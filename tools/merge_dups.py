# -*- coding: utf-8 -*-
"""Merge duplicate grade entries: same brand family, branch-factory suffix.
   Dry-run by default; pass --exec to actually delete."""
import json, sys, urllib.request
from collections import defaultdict

BASE = 'https://www.nbxxh.com'
USER, PWD = 'admin', 'admin'
TOKEN = ''
EXEC = '--exec' in sys.argv

# brand -> canonical main brand when it has a branch-factory suffix
BRANCH = {
 'CHIMEI Zhenjiang': 'CHIMEI',
 'LG Ningbo': 'LG Chem',
 'LG Chem Ningbo': 'LG Chem',
 'Formosa Ningbo': 'Formosa',
 'BASF Shanghai': 'BASF',
 'DuPont Shenzhen': 'DuPont',
 'Covestro Shanghai': 'Covestro',
 'Teijin Shanghai': 'Teijin',
 'Mitsubishi Shanghai': 'Mitsubishi',
 'SABIC Shanghai': 'SABIC',
 'Evonik Shanghai': 'Evonik',
 'Polyplastics Nantong': 'Polyplastics',
 'Yuntianhua Chongqing': 'Yuntianhua',
 'Ascend Shanghai': 'Ascend',
 'Shenma Shanghai': 'Shenma',
 'UBE Shanghai': 'UBE',
 'Gaoqiao Shanghai': 'Gaoqiao',
 'Guohan Ningbo': 'Guohan',
 'Jihua Jilin': 'Jihua',
 'Jihua Shanghai': 'Jihua',
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
    print('LOGIN FAILED'); raise SystemExit(1)

s, out = api('GET', '/api/admin/datasheets')
rows = json.loads(out)
print('total rows:', len(rows))

g = defaultdict(list)
for x in rows:
    g[(x['polymer'], x['grade'])].append(x)

to_delete = []
for (pol, grade), items in sorted(g.items()):
    if len(items) < 2:
        continue
    # map branch brands to their canonical main brand
    mains = [it for it in items if it['brand'] not in BRANCH]
    branches = [it for it in items if it['brand'] in BRANCH]
    if not branches or not mains:
        continue
    # a branch is deletable only if its canonical main brand exists in this group
    main_brands = set(it['brand'] for it in mains)
    for b in branches:
        if BRANCH[b['brand']] in main_brands:
            to_delete.append(b)

print('\n=== 拟删除（%d 条，合并到主品牌条目）===' % len(to_delete))
for b in to_delete:
    print('  %-7s %-12s %-22s -> 保留 %s' % (b['polymer'], b['grade'], b['brand'], BRANCH[b['brand']]))

if not EXEC:
    print('\n[DRY-RUN] 加 --exec 执行删除')
    raise SystemExit(0)

# backup
with open('D:/workspace/chizi/backups/ds_before_merge_exec.json', 'w', encoding='utf-8') as f:
    json.dump(rows, f, ensure_ascii=False)
print('\nbackup saved. executing deletes...')
ok = fail = 0
for b in to_delete:
    s, out = api('DELETE', '/api/admin/datasheets/%d' % b['id'])
    if s == 200:
        ok += 1
    else:
        fail += 1
        print('  FAIL id=%d -> %s %s' % (b['id'], s, out[:60]))
print('deleted: %d ok, %d fail' % (ok, fail))

s, out = api('GET', '/api/admin/datasheets')
print('rows after merge:', len(json.loads(out)))
