# -*- coding: utf-8 -*-
"""Fix ABS batch 2: MP-0160R / 8391 / 757K / 707K (verified + reference values)."""
import json, urllib.request

BASE = 'https://www.nbxxh.com'
USER, PWD = 'admin', 'admin'
TOKEN = ''

FIX = {
 'MP-0160R': dict(mfr=1.7, density=1.04, tensile=39, flex_str=55, flex_mod=2156, izod=28, hdt=86, vicat=96, mfr_cond='220°C/10kg'),
 '8391':     dict(mfr=24, density=1.04, tensile=45, flex_str=78, flex_mod=2400, izod=19, hdt=83, vicat=95, mfr_cond='220°C/10kg'),
 '757K':     dict(mfr=18, density=1.05, tensile=47, flex_str=76, flex_mod=2200, izod=19, hdt=83, vicat=100, mfr_cond='220°C/10kg'),
 '707K':     dict(mfr=20, density=1.06, tensile=50, flex_str=79, flex_mod=2300, izod=13, hdt=83, vicat=104, mfr_cond='220°C/10kg'),
}

opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))

def api(method, path, body=None):
    req = urllib.request.Request(BASE + path, method=method)
    req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36')
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

s, out = api('POST', '/api/admin/login', {'username': USER, 'password': PWD})
TOKEN = json.loads(out).get('token', '')
if not TOKEN:
    print('LOGIN FAILED:', out); raise SystemExit(1)

s, out = api('GET', '/api/admin/datasheets')
allrows = json.loads(out)
with open('D:/workspace/chizi/backups/datasheets_before_absfix2.json', 'w', encoding='utf-8') as f:
    json.dump(allrows, f, ensure_ascii=False)
print('backed up', len(allrows), 'rows')

targets = [r for r in allrows if r.get('polymer') == 'ABS' and r.get('grade') in FIX]
print('target records:', len(targets))
ok = fail = 0
for r in targets:
    body = dict(r)
    body.update(FIX[r['grade']])
    for k in ('id', 'created_at', 'sort'):
        body.pop(k, None)
    s, out = api('POST', '/api/admin/datasheets', body)
    if s == 200 and 'ok' in out:
        ok += 1
        print('  UPDATED %s %s -> MFR %s' % (r['brand'], r['grade'], FIX[r['grade']]['mfr']))
    else:
        fail += 1
        print('  FAIL %s %s -> %s %s' % (r['brand'], r['grade'], s, out[:80]))
print('done: %d ok, %d fail' % (ok, fail))
