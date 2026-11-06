# -*- coding: utf-8 -*-
"""第三批物性修正：ABS 国产 3 牌号 + MP-0160R 品牌纠正 + K8003 按厂家核准

数据来源：
- 0215A  吉林石化：plas.cn 原厂整理 TDS + 吉化典型值区间（多源一致）
- D-120  镇江国亨：台湾国乔 GPPC 官方 TDS（kgf 单位已换算 SI）
- D-180  镇江国亨：同上
- MP-0160R 乐天化学（原三星第一毛织）STAREX：官方 TDS 多源一致
- K8003  中石化 SINOPEC 官方 TDS (PPB-M02-V)；宝丰 plas.com 官方整理
"""
import json, urllib.request, sys

BASE = 'https://www.nbxxh.com'
USER = 'admin'
PWD = 'admin'


def make_opener():
    return urllib.request.build_opener(urllib.request.ProxyHandler({}))


def call(opener, method, path, body=None, token=None):
    req = urllib.request.Request(BASE + path, method=method)
    req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    req.add_header('Accept', 'application/json')
    if token:
        req.add_header('Authorization', 'Bearer ' + token)
    data = None
    if body is not None:
        req.add_header('Content-Type', 'application/json')
        data = json.dumps(body, ensure_ascii=False).encode('utf-8')
    with opener.open(req, data, timeout=40) as r:
        return r.status, r.read().decode('utf-8')


# ---------------- 修正数据 ----------------
PATCHES = [
    # ===== 0215A 吉林石化（注塑通用级，对标奇美 757）=====
    dict(id=103, note='0215A 吉林石化',
         fields=dict(
             brand='Jihua (PetroChina)', origin='China', process='injection',
             mfr=21, mfr_cond='220°C/10kg', density=1.05,
             tensile=45, flex_str=81, flex_mod=2700,
             izod=20, charpy=21, hdt=85, vicat=96,
             features='general purpose;high gloss;good colorability',
             apps='Home appliance shells, TV/AC housings, electronic parts, toys, auto interior trims',
             certs='RoHS;REACH;UL94 HB',
         )),

    # ===== D-120 镇江国亨（超高强度，挤出级）=====
    dict(id=102, note='D-120 镇江国亨',
         fields=dict(
             brand='Guohan (Zhenjiang)', origin='China', process='extrusion',
             mfr=0.7, mfr_cond='200°C/5kg', density=1.04,
             tensile=43, flex_str=67, flex_mod=2250,
             izod=31, hdt=88,
             features='extra high strength;extrusion grade;good toughness',
             apps='Suitcases, water tank valves, locomotive parts, extruded profiles',
             certs='RoHS;REACH;UL94 HB',
         )),

    # ===== D-180 镇江国亨（高刚性高光泽，注塑级）=====
    dict(id=207, note='D-180 镇江国亨',
         fields=dict(
             brand='Guohan (Zhenjiang)', origin='China', process='injection',
             mfr=1.7, mfr_cond='200°C/5kg', density=1.05,
             tensile=47, flex_str=72, flex_mod=2450,
             izod=15, hdt=87,
             features='high rigidity;high gloss;general purpose',
             apps='Home appliance parts, electronic parts, office machine housings, toys',
             certs='RoHS;REACH;UL94 HB',
         )),

    # ===== MP-0160R 乐天化学 STAREX 电镀级（品牌纠正）=====
    dict(id=110, note='MP-0160R 乐天化学（原三星第一毛织）',
         fields=dict(
             brand='Lotte Chemical (STAREX)', origin='Korea', process='injection',
             mfr=1.7, mfr_cond='220°C/10kg', density=1.04,
             tensile=39, flex_str=55, flex_mod=2157,
             izod=28, hdt=86, vicat=96, hardness='R 105',
             features='electroplating grade;high impact;high flexural strength',
             apps='Auto parts (radiator grille, lamp bezel, side mirror), appliance handles and drawers',
             certs='RoHS;REACH;UL94 HB',
         )),

    # ===== K8003 中石化系（燕山 / 赛科 / 扬子 / 镇海 同一规格 PPB-M02-V）=====
    dict(id=25, note='K8003 中石化 Sinopec（PPB-M02-V）',
         fields=dict(
             brand='Sinopec', origin='China', process='injection',
             mfr=2.5, mfr_cond='230°C/2.16kg', density=0.90,
             tensile=23.5, flex_mod=1310,
             izod=5.8, hdt=90, vicat=150,
             features='impact copolymer;high stiffness;ultra high impact',
             apps='Auto parts, battery shells, oil tanks, tool boxes, luggage, packaging containers',
             certs='RoHS;REACH;UL94 HB',
         )),
    dict(id=171, note='K8003 燕山 Yanshan（中石化规格）',
         fields=dict(
             brand='Yanshan', origin='China', process='injection',
             mfr=2.5, mfr_cond='230°C/2.16kg', density=0.90,
             tensile=23.5, flex_mod=1310,
             izod=5.8, hdt=90, vicat=150,
             features='impact copolymer;high stiffness;ultra high impact',
             apps='Auto parts, battery shells, oil tanks, heavy-duty parts',
             certs='RoHS;REACH;UL94 HB',
         )),
    dict(id=170, note='K8003 镇海 ZPC（中石化规格）',
         fields=dict(
             brand='ZPC (Zhenhai)', origin='China', process='injection',
             mfr=2.5, mfr_cond='230°C/2.16kg', density=0.90,
             tensile=23.5, flex_mod=1310,
             izod=5.8, hdt=90, vicat=150,
             features='impact copolymer;high stiffness;ultra high impact',
             apps='Auto parts, battery shells, oil tanks, household goods',
             certs='RoHS;REACH;UL94 HB',
         )),

    # ===== K8003 宝丰（独立规格，GB/T 标准）=====
    dict(id=235, note='K8003 宁夏宝丰 Baofeng（GB/T 规格）',
         fields=dict(
             brand='Baofeng Energy', origin='China', process='injection',
             mfr=2.26, mfr_cond='230°C/2.16kg', density=0.90,
             tensile=21.9, flex_mod=875,
             izod=None, charpy=62, hdt=71, vicat=150,
             features='impact copolymer;high impact at low temperature',
             apps='Automotive interior, household appliance structures, turnover boxes, pallets',
             certs='RoHS;UL94 HB',
         )),
]


def main():
    exe = '--exec' in sys.argv
    op = make_opener()
    st, out = call(op, 'POST', '/api/admin/login', {'username': USER, 'password': PWD})
    token = json.loads(out)['token']
    st, out = call(op, 'GET', '/api/admin/datasheets', token=token)
    rows = {r['id']: r for r in json.loads(out)}

    print('=' * 68)
    for p in PATCHES:
        cur = rows.get(p['id'])
        if not cur:
            print('!! id=%s 不存在，跳过（%s）' % (p['id'], p['note']))
            continue
        print('\n[%s]  id=%s  %s / %s' % (p['note'], p['id'], cur['brand'], cur['grade']))
        body = dict(cur)
        for k, v in p['fields'].items():
            old = cur.get(k)
            body[k] = v
            if str(old) != str(v):
                print('   %-10s %s  ->  %s' % (k, old, v))
        if exe:
            st, out = call(op, 'POST', '/api/admin/datasheets', body, token)
            print('   写入 HTTP %s %s' % (st, '' if st == 200 else out[:120]))

    if not exe:
        print('\n（dry-run，未写入。加 --exec 执行）')


if __name__ == '__main__':
    main()
