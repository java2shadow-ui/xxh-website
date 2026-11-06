# -*- coding: utf-8 -*-
"""Deploy quotation system (admin-quote) + updated admin.html to server.

Usage: python deploy_quote.py [host] [user]   (password via SSHPW env or prompt)
- Uploads dist/* -> /opt/xxh-web/public/admin-quote/
- Uploads public/admin.html
- Inspects Dockerfile COPY rules; rebuilds + recreates container if needed
- Verifies live pages
"""
import os
import sys
import getpass
import paramiko

APP_DIR = "/opt/xxh-web"
LOCAL_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # website/
QUOTE_PROJECT = os.path.dirname(LOCAL_ROOT)  # chizi/
SRC_DIST = os.path.join(QUOTE_PROJECT, "plastic-resin-foreign-trade-quotation-optimizer-&-pro-generator", "dist")


def main():
    host = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("SERVER_HOST", "103.12.149.76")
    user = sys.argv[2] if len(sys.argv) > 2 else "root"
    pw = os.environ.get("SSHPW") or getpass.getpass("SSH password: ")

    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    import time as _t
    for attempt in range(1, 5):
        try:
            cli.connect(host, username=user, password=pw, timeout=25, banner_timeout=40)
            break
        except Exception as e:
            if attempt == 4:
                raise
            print("connect attempt %d failed (%s) — anti-bruteforce throttle, waiting 75s..." % (attempt, str(e)[:60]))
            _t.sleep(75)

    def run(cmd, timeout=900):
        _, stdout, stderr = cli.exec_command(cmd, timeout=timeout)
        code = stdout.channel.recv_exit_status()
        return code, stdout.read().decode("utf-8", "ignore"), stderr.read().decode("utf-8", "ignore")

    # 1. show server Dockerfile COPY rules
    code, out, err = run("cat %s/Dockerfile" % APP_DIR)
    print("=== Dockerfile ===")
    print(out.strip())

    # 2. upload dist/ -> public/admin-quote/
    sftp = cli.open_sftp()
    n = 0
    for root, dirs, files in os.walk(SRC_DIST):
        rel = os.path.relpath(root, SRC_DIST).replace("\\", "/")
        remote_dir = APP_DIR + "/public/admin-quote" + (("/" + rel) if rel != "." else "")
        try:
            sftp.stat(remote_dir)
        except IOError:
            sftp.mkdir(remote_dir)
        for f in files:
            lp = os.path.join(root, f)
            rp = remote_dir + "/" + f
            sftp.put(lp, rp)
            n += 1
    print("uploaded %d dist files -> public/admin-quote/" % n)

    # 3. upload admin.html + updated site files (views / i18n)
    sftp.put(os.path.join(LOCAL_ROOT, "public", "admin.html"), APP_DIR + "/public/admin.html")
    code, out, err = run("grep -c makeQuote %s/public/admin.html" % APP_DIR)
    print("admin.html uploaded (makeQuote refs: %s)" % out.strip())
    EXTRA_FILES = [
        "views/calculator.ejs",
        "views/home-v2.ejs",
        "views/grades.ejs",
        "views/grade.ejs",
        "views/about.ejs",
        "views/contact.ejs",
        "views/news.ejs",
        "views/products.ejs",
        "views/legal.ejs",
        "views/partials/footer-v2.ejs",
        "views/partials/header-v2.ejs",
        "views/partials/header.ejs",
        "i18n-calc.js",
        "i18n-grades.js",
        "i18n-legal.js",
        "i18n-home-a.js",
        "i18n-home-b.js",
        "i18n-home-c.js",
        "i18n.js",
        "server.js",
        "db.js",
        "public/js/calculator.js",
        "public/js/grades.js",
        "public/js/rfq-suggest.js",
        "public/css/home-v2.css",
        "public/css/grades-v2.css",
        "public/css/pages-v2.css",
        "public/assets/og-default.png",
        "public/assets/photos/warehouse-yard.jpg",
        "public/assets/photos/container-loading.jpg",
        "public/assets/photos/office-ningbo.jpg",
        "public/assets/photos/business-license.jpg",
    ]
    for rel in EXTRA_FILES:
        rp = APP_DIR + "/" + rel
        rd = os.path.dirname(rp)
        if rd != APP_DIR:
            run("mkdir -p '%s'" % rd)
        sftp.put(os.path.join(LOCAL_ROOT, rel), rp)
        print("  uploaded", rel)
    # Dockerfile whitelist: ensure new root JS files are COPY'd (i18n-calc.js / i18n-legal.js)
    code, out, err = run("grep -q 'i18n-calc.js' %s/Dockerfile && echo HAS || echo MISSING" % APP_DIR)
    if "MISSING" in out:
        run("sed -i 's|i18n-home-c.js \\./|i18n-home-c.js i18n-calc.js ./|' %s/Dockerfile" % APP_DIR)
        code, out, err = run("grep 'COPY server' %s/Dockerfile" % APP_DIR)
        print("Dockerfile updated:", out.strip())
    code, out, err = run("grep -q 'i18n-legal.js' %s/Dockerfile && echo HAS || echo MISSING" % APP_DIR)
    if "MISSING" in out:
        # 锚点必须是 i18n-calc.js 后面紧跟的 " ./"（COPY 行以 i18n-calc.js ./ 结尾）
        run("sed -i 's|i18n-calc.js \\./|i18n-calc.js i18n-legal.js ./|' %s/Dockerfile" % APP_DIR)
        code, out, err = run("grep 'COPY server' %s/Dockerfile" % APP_DIR)
        print("Dockerfile updated (legal):", out.strip())
    sftp.close()

    # 4. check whether public/ is COPY'd wholesale; rebuild + recreate
    code, out, err = run("docker inspect xxh-web --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}'")
    mounts = out.strip()
    print("mounts:", mounts.replace("\n", " | "))
    rebuild = "COPY" in out or True  # public is baked in image (same as views); always rebuild
    if rebuild:
        print("rebuilding image...")
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

    # 5. verify
    for path in ["/static/admin-quote/index.html", "/admin"]:
        code, out, err = run("curl -s -o /dev/null -w '%%{http_code}' http://127.0.0.1:3000%s" % path)
        print("  local", path, "->", out.strip())
    code, out, err = run("curl -s http://127.0.0.1:3000/static/admin-quote/index.html | grep -c 'XXH 报价系统'")
    print("  quote page title hits:", out.strip())

    cli.close()
    print("\nDone. Verify: https://www.nbxxh.com/static/admin-quote/index.html (via admin) and /admin inquiry page")


if __name__ == "__main__":
    main()
