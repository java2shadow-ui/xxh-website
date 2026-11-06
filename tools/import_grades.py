# -*- coding: utf-8 -*-
"""Import grade datasheets from Excel into the website database through the admin API.

Usage:
    python import_grades.py                       # import ../牌号物性表_导入模板.xlsx to https://nbxxh.com
    python import_grades.py my.xlsx               # import a specific file
    python import_grades.py my.xlsx --replace     # wipe the datasheet table first, then import
    python import_grades.py my.xlsx --local       # target http://127.0.0.1:3000

Rows whose grade contains 示例 are skipped. Brand+grade is the natural key: re-importing
an existing grade updates it instead of creating a duplicate.
"""
import sys
import os
import json
import getpass
import urllib.request
import urllib.error

from openpyxl import load_workbook

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_XLSX = os.path.join(os.path.dirname(HERE), "牌号物性表_导入模板.xlsx")
PROD = "https://nbxxh.com"
LOCAL = "http://127.0.0.1:3000"

NUM_KEYS = {"mfr", "density", "tensile", "elong", "flex_mod", "flex_str", "izod", "charpy",
            "hdt", "vicat", "melt_point", "transmittance", "haze", "gloss", "water_abs", "ash"}

STOCK_MAP = {
    "现货": "in_stock", "有货": "in_stock", "in stock": "in_stock", "instock": "in_stock", "in_stock": "in_stock",
    "期货": "on_request", "需确认": "on_request", "on request": "on_request", "on_request": "on_request",
    "缺货": "out", "无货": "out", "out of stock": "out", "out": "out",
}


def api(base, path, token=None, data=None, method=None):
    url = base + path
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, method=method or ("POST" if body else "GET"))
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", "Bearer " + token)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "ignore")
        raise SystemExit("HTTP %s on %s\n%s" % (e.code, path, detail))
    except Exception as e:
        raise SystemExit("Cannot reach %s (%s). Check network / VPN / server." % (base, e))


def read_rows(path):
    wb = load_workbook(path, data_only=True)
    ws = wb["牌号物性表"] if "牌号物性表" in wb.sheetnames else wb[wb.sheetnames[0]]
    keys = []
    for c in range(1, ws.max_column + 1):
        v = ws.cell(row=2, column=c).value
        keys.append(str(v).strip() if v else "")
    rows = []
    for r in range(3, ws.max_row + 1):
        item = {}
        for c, k in enumerate(keys, start=1):
            if not k:
                continue
            v = ws.cell(row=r, column=c).value
            if v is None:
                item[k] = ""
            elif isinstance(v, float) and v.is_integer():
                item[k] = int(v)
            else:
                item[k] = v
        grade = str(item.get("grade", "")).strip()
        if not grade or "示例" in grade:
            continue
        st = str(item.get("stock", "")).strip()
        item["stock"] = STOCK_MAP.get(st.lower(), STOCK_MAP.get(st, "on_request"))
        pol = str(item.get("polymer", "")).strip()
        item["polymer"] = pol.upper() if pol.isascii() else pol
        for k in NUM_KEYS:
            v = item.get(k, "")
            if isinstance(v, str):
                v = v.strip().replace(",", ".")
                if v == "":
                    item[k] = None
                else:
                    try:
                        item[k] = float(v)
                    except ValueError:
                        print("  ! %s: %s=%r is not a number, ignored" % (grade, k, v))
                        item[k] = None
        rows.append(item)
    return rows


def main():
    args = [a for a in sys.argv[1:]]
    replace = "--replace" in args
    local = "--local" in args
    files = [a for a in args if not a.startswith("--")]
    xlsx = files[0] if files else DEFAULT_XLSX
    base = LOCAL if local else PROD

    if not os.path.exists(xlsx):
        raise SystemExit("File not found: %s" % xlsx)

    rows = read_rows(xlsx)
    print("Read %d grades from %s" % (len(rows), os.path.basename(xlsx)))
    if not rows:
        raise SystemExit("No rows found — fill in column A (牌号) first.")

    user = input("Admin username [admin]: ").strip() or "admin"
    pw = getpass.getpass("Admin password: ")
    tok = api(base, "/api/admin/login", data={"username": user, "password": pw}).get("token")
    if not tok:
        raise SystemExit("Login failed.")
    print("Logged in to %s" % base)

    current = api(base, "/api/admin/datasheets", tok)
    print("Existing datasheets in DB: %d" % len(current))
    if replace:
        confirm = input("This WIPES the datasheet table first. Type YES to continue: ").strip()
        if confirm != "YES":
            raise SystemExit("Aborted.")

    res = api(base, "/api/admin/datasheets/import", tok,
              data={"rows": rows, "replace": replace})
    print(json.dumps(res, ensure_ascii=False, indent=2))
    print("\nDone. Check: %s/zh/grades" % base)


if __name__ == "__main__":
    main()
