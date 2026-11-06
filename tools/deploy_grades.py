# -*- coding: utf-8 -*-
"""Deploy the grade-datasheet update to the HK server. Single SSH connection, full flow.

Usage: python deploy_grades.py <host> <user>   (password prompted)
Packs changed files only, uploads, docker build, recreates container with the
same ports/volumes as the old one, verifies /zh/grades locally on the server.
"""
import sys
import os
import io
import tarfile
import time
import getpass

import paramiko

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

FILES = [
    "server.js",
    "db.js",
    "i18n.js",
    "i18n-grades.js",
    "package.json",
    "package-lock.json",
    "views/grades.ejs",
    "views/partials/header.ejs",
    "public/css/grades.css",
    "public/css/style.css",
    "public/js/grades.js",
]

REMOTE_DIR = "/root/xxh-site"
TAR_NAME = "grades-deploy.tar.gz"


def build_tar():
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w:gz") as tar:
        for rel in FILES:
            p = os.path.join(ROOT, rel)
            if not os.path.exists(p):
                print("  ! missing:", rel)
                continue
            tar.add(p, arcname=rel)
    data = buf.getvalue()
    print("Packed %d files, %.1f KB" % (len(FILES), len(data) / 1024))
    return data


def main():
    host = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("SERVER_HOST", "103.12.149.76")
    user = sys.argv[2] if len(sys.argv) > 2 else "root"
    pw = os.environ.get("SSHPW") or getpass.getpass("SSH password for %s@%s: " % (user, host))

    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(host, username=user, password=pw, timeout=25, banner_timeout=25)

    def run(cmd, timeout=600):
        stdin, stdout, stderr = cli.exec_command(cmd, timeout=timeout)
        code = stdout.channel.recv_exit_status()
        out = stdout.read().decode("utf-8", "ignore")
        err = stderr.read().decode("utf-8", "ignore")
        return code, out, err

    # 1. upload
    sftp = cli.open_sftp()
    try:
        sftp.mkdir(REMOTE_DIR)
    except IOError:
        pass
    tar_data = build_tar()
    rp = REMOTE_DIR + "/" + TAR_NAME
    with sftp.open(rp, "wb") as f:
        f.write(tar_data)
    print("Uploaded", rp)
    sftp.close()

    # 2. extract
    code, out, err = run("cd %s && tar xzf %s && ls -la i18n-grades.js views/grades.ejs" % (REMOTE_DIR, TAR_NAME))
    print("extract:", code, out.strip()[:200], err.strip()[:300])
    if code != 0:
        raise SystemExit("extract failed")

    # 3. docker build
    print("docker build ...")
    code, out, err = run("cd %s && docker build -t xxh-web . 2>&1 | tail -5" % REMOTE_DIR, timeout=900)
    print(out.strip())
    if code != 0 or "error" in err.lower():
        print("stderr:", err[:500])
        raise SystemExit("build failed")

    # 4. derive ports/volumes from the old container, recreate
    code, out, err = run(
        "docker inspect xxh-web --format '{{json .HostConfig.PortBindings}}' > /tmp/ports.json;"
        "docker inspect xxh-web --format '{{range .Mounts}}{{.Source}}:{{.Destination}} {{end}}' > /tmp/vols.txt;"
        "cat /tmp/ports.json; cat /tmp/vols.txt"
    )
    print("inspect:", out.strip())
    if code != 0:
        raise SystemExit("inspect failed: " + err[:300])

    code, out, err = run(
        "set -e; cd %s; "
        "PORTS=$(python3 -c \"import json;p=json.load(open('/tmp/ports.json'));print(' '.join('-p %%s:%%s'%%(v[0]['HostPort'],k) for k,v in p.items()))\"); "
        "VOLS=$(cat /tmp/vols.txt); "
        "docker rm -f xxh-web; "
        "docker run -d --name xxh-web --restart unless-stopped $PORTS $VOLS xxh-web:latest; "
        "sleep 3; docker ps --filter name=xxh-web --format '{{.Status}}'"
        % REMOTE_DIR, timeout=120)
    print("recreate:", code, out.strip(), err.strip()[:400])
    if code != 0:
        raise SystemExit("recreate failed")

    # 5. verify
    for path in ["/zh/grades", "/en/grades", "/zh", "/api/admin/stats"]:
        code, out, err = run("curl -s -o /dev/null -w '%%{http_code}' http://127.0.0.1:3000%s" % path)
        print("  local", path, "->", out.strip())

    code, out, err = run("docker logs xxh-web 2>&1 | tail -3")
    print("logs:", out.strip())

    cli.close()
    print("\nDeployed. Verify: https://nbxxh.com/zh/grades")


if __name__ == "__main__":
    main()
