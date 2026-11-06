# -*- coding: utf-8 -*-
"""Emergency redeploy: extract into /opt/xxh-web (real app dir), build, run, verify."""
import os
import sys
import getpass
import paramiko

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from deploy_grades import build_tar, TAR_NAME  # noqa

APP_DIR = "/opt/xxh-web"


def main():
    host = sys.argv[1] if len(sys.argv) > 1 else "103.12.149.76"
    user = sys.argv[2] if len(sys.argv) > 2 else "root"
    pw = os.environ.get("SSHPW") or getpass.getpass("SSH password: ")

    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(host, username=user, password=pw, timeout=25, banner_timeout=25)

    def run(cmd, timeout=900):
        _, stdout, stderr = cli.exec_command(cmd, timeout=timeout)
        code = stdout.channel.recv_exit_status()
        return code, stdout.read().decode("utf-8", "ignore"), stderr.read().decode("utf-8", "ignore")

    code, out, err = run("ls %s | head -20; test -f %s/Dockerfile && echo DOCKERFILE_OK" % (APP_DIR, APP_DIR))
    print("appdir:", out.strip())
    if "DOCKERFILE_OK" not in out:
        raise SystemExit("Dockerfile not in " + APP_DIR)

    sftp = cli.open_sftp()
    data = build_tar()
    with sftp.open(APP_DIR + "/" + TAR_NAME, "wb") as f:
        f.write(data)
    sftp.close()
    print("uploaded")

    code, out, err = run("cd %s && tar xzf %s && echo EXTRACT_OK" % (APP_DIR, TAR_NAME))
    print(out.strip()[-80:], err.strip()[:200])

    print("building...")
    code, out, err = run("cd %s && docker build -t xxh-web . 2>&1 | tail -4" % APP_DIR)
    print(out.strip())
    if "error" in out.lower():
        raise SystemExit("build failed")

    code, out, err = run(
        "docker rm -f xxh-web 2>/dev/null; "
        "docker run -d --name xxh-web --restart unless-stopped "
        "-p 127.0.0.1:3000:3000 "
        "-v %s/data.db:/app/data.db -v %s/public/uploads:/app/public/uploads "
        "xxh-web:latest && sleep 3 && docker ps --filter name=xxh-web --format '{{.Status}}'" % (APP_DIR, APP_DIR))
    print("run:", code, out.strip(), err.strip()[:300])

    for path in ["/zh/grades", "/en/grades", "/zh", "/api/admin/stats"]:
        code, out, err = run("curl -s -o /dev/null -w '%%{http_code}' http://127.0.0.1:3000%s" % path)
        print("  local", path, "->", out.strip())

    code, out, err = run("docker logs xxh-web 2>&1 | tail -3")
    print("logs:", out.strip())
    cli.close()
    print("\nDone. Verify https://nbxxh.com/zh/grades")


if __name__ == "__main__":
    main()
