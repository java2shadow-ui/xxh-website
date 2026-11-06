# -*- coding: utf-8 -*-
"""物性数据可信度打标

A 级：原厂/官方 TDS 逐条核对（奇美、台化、LG、乐天、中石化 K8003 系）
B 级：多源交叉验证（国产 ABS 3 个 + 宝丰 K8003）
其余留空 = 未逐条复核（抽样显示质量良好）
"""
import json, sys, urllib.request

BASE = 'https://www.nbxxh.com'

# A 级：(brand, grade)
A_LIST = [
    ('CHIMEI', 'PA-757'), ('CHIMEI', 'PA-707'), ('CHIMEI', 'PA-709'), ('CHIMEI', 'PA-727'),
    ('CHIMEI', 'PA-747S'), ('CHIMEI', 'PA-758'), ('CHIMEI', 'PA-765A'),
    ('Formosa', 'AG15A1'), ('Formosa', 'AG15E1'),
    ('LG Chem', 'HI-121H'), ('LG Chem', 'HI-100'), ('LG Chem', 'HI-121'),
    ('LG Chem', 'TR-557'), ('LG Chem', 'XR-401'), ('LG Chem', 'XR-404'),
    ('LG Chem', 'XR-409H'), ('LG Chem', 'AF-312'),
    ('Lotte Chemical (STAREX)', 'MP-0160R'),
    ('Sinopec', 'K8003'), ('Yanshan', 'K8003'), ('ZPC (Zhenhai)', 'K8003'),
]

# B 级：(brand, grade)
B_LIST = [
    ('Jihua (PetroChina)', '0215A'),
    ('Guohan (Zhenjiang)', 'D-120'),
    ('Guohan (Zhenjiang)', 'D-180'),
    ('Baofeng Energy', 'K8003'),
]


def main():
    exe = '--exec' in sys.argv
    op = urllib.request.build_opener(urllib.request.ProxyHandler({}))

    def call(m, p, b=None, token=None):
        req = urllib.request.Request(BASE + p, method=m)
        req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        req.add_header('Accept', 'application/json')
        if token:
            req.add_header('Authorization', 'Bearer ' + token)
        data = None
        if b is not None:
            req.add_header('Content-Type', 'application/json')
            data = json.dumps(b, ensure_ascii=False).encode('utf-8')
        with op.open(req, data, timeout=40) as r:
            return r.status, r.read().decode('utf-8')

    _, out = call('POST', '/api/admin/login', {'username': 'admin', 'password': 'admin'})
    token = json.loads(out)['token']
    _, out = call('GET', '/api/admin/datasheets', token=token)
    rows = json.loads(out)

    idx = {}
    for r in rows:
        idx.setdefault((r.get('brand', ''), r.get('grade', '')), []).append(r)

    plan = []
    missing = []
    for lvl, lst in (('A', A_LIST), ('B', B_LIST)):
        for key in lst:
            hits = idx.get(key)
            if not hits:
                missing.append((lvl, key))
                continue
            for r in hits:
                plan.append((lvl, r))

    print('=' * 60)
    print('将打标: A=%d 条  B=%d 条' % (
        sum(1 for l, _ in plan if l == 'A'), sum(1 for l, _ in plan if l == 'B')))
    for lvl, r in plan:
        print('  [%s] id=%-4s %-26s %-8s %s' % (lvl, r['id'], r['brand'], r['grade'], r['polymer']))
    if missing:
        print('\n!! 未匹配到（品牌名可能不一致）:')
        for lvl, key in missing:
            print('   [%s] %s / %s' % (lvl, key[0], key[1]))

    if exe:
        ok = 0
        for lvl, r in plan:
            body = dict(r)
            body['source_level'] = lvl
            st, _ = call('POST', '/api/admin/datasheets', body, token)
            if st == 200:
                ok += 1
        print('\n写入成功 %d 条' % ok)
        _, out = call('GET', '/api/admin/datasheets', token=token)
        d = json.loads(out)
        print('总数 %d | A=%d | B=%d' % (
            len(d), sum(1 for x in d if x.get('source_level') == 'A'),
            sum(1 for x in d if x.get('source_level') == 'B')))
    else:
        print('\n（dry-run，加 --exec 执行）')


if __name__ == '__main__':
    main()
