# -*- coding: utf-8 -*-
"""Fix ABS grade properties to verified OEM TDS values (unified ISO standard).
Matches by (brand, grade) via admin upsert API. Backs up current state first."""
import json, time, urllib.request

BASE = 'https://www.nbxxh.com'
USER, PWD = 'admin', 'admin'

# verified OEM values (unified口径: MFR 220C/10kg, ISO, HDT unannealed)
FIX = {
 'PA-757':  dict(mfr=18, density=1.05, tensile=47, flex_str=76, flex_mod=2200, izod=19, hdt=83, vicat=100, mfr_cond='220°C/10kg'),
 'PA-707':  dict(mfr=20, density=1.06, tensile=50, flex_str=79, flex_mod=2300, izod=13, hdt=83, vicat=104, mfr_cond='220°C/10kg'),
 'PA-709':  dict(mfr=5,  density=1.03, tensile=40, flex_str=58, flex_mod=1800, izod=40, hdt=82, vicat=105, mfr_cond='220°C/10kg'),
 'PA-727':  dict(mfr=19, density=1.05, tensile=46, flex_str=71, flex_mod=2000, izod=24, hdt=83, vicat=98,  mfr_cond='220°C/10kg'),
 'PA-747S': dict(mfr=6,  density=1.03, tensile=40, flex_str=57, flex_mod=1700, izod=34, hdt=81, vicat=103, mfr_cond='220°C/10kg'),
 'PA-758':  dict(mfr=3,  density=1.08, tensile=42, flex_str=57, flex_mod=1900, izod=14, hdt=77, vicat=104, mfr_cond='200°C/5kg'),
 'PA-765A': dict(mfr=46, density=1.17, tensile=38, flex_str=54, flex_mod=1800, izod=20, hdt=76, vicat=90,  mfr_cond='220°C/10kg'),
 'AG15A1':  dict(mfr=21, density=1.05, tensile=45, flex_str=65, flex_mod=2100, izod=25, hdt=86, vicat=94,  mfr_cond='220°C/10kg'),
 'AG15E1':  dict(mfr=24, density=1.05, tensile=46, flex_str=70, flex_mod=2500, izod=19, hdt=86, vicat=95,  mfr_cond='220°C/10kg'),
 'HI-121H': dict(mfr=22, density=1.05, tensile=50, flex_str=82, flex_mod=2550, izod=27, hdt=85, vicat=93,  mfr_cond='220°C/10kg'),
 'HI-100':  dict(mfr=11, density=1.02, tensile=37, flex_str=60, flex_mod=1900, izod=45, hdt=84, vicat=90,  mfr_cond='220°C/10kg'),
 'XR-401':  dict(mfr=9,  density=1.05, tensile=49, flex_str=79, flex_mod=2550, izod=26, hdt=97, vicat=106, mfr_cond='220°C/10kg'),
 'AF-312':  dict(mfr=52, density=1.18, tensile=43, flex_str=71, flex_mod=2550, izod=24, hdt=76, vicat=84,  mfr_cond='220°C/10kg'),
 'HI-121':  dict(mfr=21, density=1.04, tensile=46, flex_str=63, flex_mod=2200, izod=28, hdt=75, vicat=93,  mfr_cond='220°C/10kg'),
 'TR-557':  dict(mfr=21, density=1.09, tensile=48, flex_str=71, flex_mod=2250, izod=17, hdt=81, vicat=89,  mfr_cond='220°C/10kg'),
 'XR-404':  dict(mfr=7,  density=1.05, tensile=54, flex_str=82, flex_mod=2550, izod=13, hdt=93, vicat=112, mfr_cond='220°C/10kg'),
 'XR-409H': dict(mfr=3,  density=1.06, tensile=49, flex_str=77, flex_mod=2400, izod=16, hdt=99, vicat=117, mfr_cond='220°C/10kg'),
}

opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
TOKEN = ''

def api(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method)
    req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36')
    req.add_header('Accept', 'application/json')
    if TOKEN:
        req.add_header('Authorization', 'Bearer ' + TOKEN)
    data = None
    if body is not None:
        req.add_header('Content-Type', 'application/json')
        data = json.dumps(body).encode('utf-8')
    try:
        with opener.open(req, data) as r:
            return r.status, r.read().decode('utf-8')
    except Exception as e:
        return 0, str(e)

# login
s, out = api('POST', '/api/admin/login', {'username': USER, 'password': PWD})
TOKEN = json.loads(out).get('token', '')
if not TOKEN:
    print('LOGIN FAILED:', out); raise SystemExit(1)
print('logged in, token len', len(TOKEN))

# fetch all datasheets
s, out = api('GET', '/api/admin/datasheets')
allrows = json.loads(out)

# backup
with open('D:/workspace/chizi/backups/datasheets_before_absfix.json', 'w', encoding='utf-8') as f:
    json.dump(allrows, f, ensure_ascii=False)
print('backed up', len(allrows), 'rows')

# update matching ABS grades
targets = [r for r in allrows if r.get('polymer') == 'ABS' and r.get('grade') in FIX]
print('target records:', len(targets))
ok = fail = 0
for r in targets:
    body = dict(r)  # keep all existing fields
    body.update(FIX[r['grade']])  # override verified values
    body.pop('id', None)
    body.pop('created_at', None)
    body.pop('sort', None)
    s, out = api('POST', '/api/admin/datasheets', body)
    if s == 200 and 'ok' in out:
        ok += 1
        print('  UPDATED %s %s -> MFR %s' % (r['brand'], r['grade'], FIX[r['grade']]['mfr']))
    else:
        fail += 1
        print('  FAIL %s %s -> %s %s' % (r['brand'], r['grade'], s, out[:80]))
print('done: %d ok, %d fail' % (ok, fail))
