# -*- coding: utf-8 -*-
"""Deploy GA4 gtag snippet (2 EJS files) to server. Single SSH connection.

Usage: python deploy_ga.py [host] [user]   (password via SSHPW env or prompt)
Files: views/home-v2.ejs + views/partials/header-v2.ejs -> /opt/xxh-web
No container restart needed if views are bind-mounted; otherwise auto rebuild.
"""
import os
import sys
import getpass
import paramiko

APP_DIR = "/opt/xxh-web"
FILES = [
    ("views/home-v2.ejs", "views/home-v2.ejs"),
    ("views/partials/header-v2.ejs", "views/partials/header-v2.ejs"),
]
GA_ID = "G-65MXGN3FTC"

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def main():
    host = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("SERVER_HOST", "103.12.149.76")
    user = sys.argv[2] if len(sys.argv) > 2 else "root"
    pw = os.environ.get("SSHPW") or getpass.getpass("SSH password: ")

    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(host, username=user, password=pw, timeout=25, banner_timeout=25)

    def run(cmd, timeout=900):
        _, stdout, stderr = cli.exec_command(cmd, timeout=timeout)
        code = stdout.channel.recv_exit_status()
        return code, stdout.read().decode("utf-8", "ignore"), stderr.read().decode("utf-8", "ignore")

    # 1. upload the two EJS files
    sftp = cli.open_sftp()
    for local, remote in FILES:
        lp = os.path.join(ROOT, local)
        rp = "%s/%s" % (APP_DIR, remote)
        sftp.put(lp, rp)
        code, out, err = run("grep -c %s %s" % (GA_ID, rp))
        print("  upload %-35s -> %s (gtag hits: %s)" % (local, remote, out.strip()))
    sftp.close()

    # 2. check whether views are bind-mounted (live without rebuild)
    code, out, err = run("docker inspect xxh-web --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}'")
    print("mounts:\n" + out.strip())
    views_mounted = "views" in out

    # 3. verify live page serves gtag
    def check_live():
        code, out, err = run("curl -s http://127.0.0.1:3000/en | grep -c %s; curl -s -o /dev/null -w ' %%{http_code}' http://127.0.0.1:3000/en" % GA_ID)
        return out.strip()

    print("live check (before):", check_live())
    if GA_ID not in check_live() and not views_mounted:
        print("views baked in image -> rebuild + recreate container")
        code, out, err = run("cd %s && docker build -t xxh-web . 2>&1 | tail -3" % APP_DIR, timeout=900)
        print(out.strip())
        if code != 0:
            raise SystemExit("build failed")
        code, out, err = run(
            "set -e; cd %s; "
            "docker inspect xxh-web --format '{{json .HostConfig.PortBindings}}' > /tmp/ports.json; "
            "PORTS=$(python3 -c \"import json;p=json.load(open('/tmp/ports.json'));print(' '.join('-p %%s:%%s'%%(v[0]['HostPort'],k) for k,v in p.items()))\"); "
            "VOLS=$(docker inspect xxh-web --format '{{range .Mounts}}-v {{.Source}}:{{.Destination}} {{end}}'); "
            "docker rm -f xxh-web; "
            "docker run -d --name xxh-web --restart unless-stopped $PORTS $VOLS xxh-web:latest; "
            "sleep 3; docker ps --filter name=xxh-web --format '{{.Status}}'" % APP_DIR, timeout=180)
        print("recreate:", code, out.strip(), err.strip()[:300])
    print("live check (after):", check_live())

    # 4. final status
    code, out, err = run("curl -s http://127.0.0.1:3000/en/grades | grep -c %s" % GA_ID)
    print("grades page gtag hits:", out.strip())
    cli.close()
    print("\nDone. Verify: https://nbxxh.com/en")


if __name__ == "__main__":
    main()
