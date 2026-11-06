# -*- coding: utf-8 -*-
"""生成「精准校核清单」：给每条数据标注可信度，并按经营优先级排序。

可信度分级：
  A 标准牌号  —— 牌号唯一、行业通行事实（MFR/加工方式可靠），物性为典型值，需核数值
  B 厂家变体  —— 同牌号多家厂，数值用的是该牌号通用典型值，需按你实际货源厂家确认
  C 规格料    —— 再生料/改性料/TPE·TPU 通用规格，数值为常见规格参考，必须按你货源改
"""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from seed_grades import build
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

rows = build()

# ---------- 分级 ----------
grade_count = {}
for r in rows:
    grade_count[r['grade']] = grade_count.get(r['grade'], 0) + 1

SPEC_BRANDS = {'Recycled', 'Compounded', 'Dawn Polymer', 'Huafeng'}
SPEC_HINT = ('r', 'GF', '-T', 'FR', 'Bio-')

def tier(r):
    g = r['grade']
    if r['brand'] in SPEC_BRANDS:
        return 'C'
    for h in SPEC_HINT:
        if g.startswith(h) or ('-' in g and g.split('-', 1)[1].startswith(h.lstrip('-'))):
            return 'C'
    if grade_count.get(g, 0) > 1:
        return 'B'
    return 'A'

for r in rows:
    r['_tier'] = tier(r)

# ---------- 经营优先级 ----------
POLY_ORDER = ['PP', 'HDPE', 'LDPE', 'LLDPE', 'PP', 'ABS', 'PS', 'PC', 'PET',
              'PA6', 'PA66', 'POM', 'EVA', 'PMMA', 'PVC', 'PBT', 'PC/ABS',
              'TPU', 'TPE', 'PPS', 'LCP', 'PLA', 'PBAT', 'TPS']
def pidx(p):
    return POLY_ORDER.index(p) if p in POLY_ORDER else 90

rows.sort(key=lambda r: (pidx(r['polymer']), r['grade']))

wb = Workbook()

# ============ Sheet1: 校核清单 ============
ws = wb.active
ws.title = '精准校核'
COLS = [
    ('tier', '可信度', 'A标准牌号/B厂家变体/C规格料'),
    ('ok', '你确认', '填 Y = 数值无误；填 N = 删掉这条'),
    ('grade', '牌号', ''), ('brand', '厂家', ''), ('polymer', '种类', ''),
    ('process', '加工方式', ''),
    ('mfr', '熔指', ''), ('density', '密度', ''), ('tensile', '拉伸', ''),
    ('izod', '冲击', ''), ('hdt', 'HDT', ''),
    ('stock', '货源', 'in_stock/on_request/out'),
    ('moq', '起订', ''), ('package', '包装', ''),
    ('features', '特性', ''), ('apps', '用途', ''),
    ('certs', '认证', ''), ('origin', '产地', ''), ('remark', '备注', ''),
]
HDR = PatternFill('solid', fgColor='1B6AC9')
TIER_FILL = {'A': PatternFill('solid', fgColor='E4F7EC'),
             'B': PatternFill('solid', fgColor='FFF4D6'),
             'C': PatternFill('solid', fgColor='FBE7E7')}
thin = Side(style='thin', color='D5DEE9')
bd = Border(left=thin, right=thin, top=thin, bottom=thin)

for i, (k, cn, note) in enumerate(COLS, 1):
    c = ws.cell(row=1, column=i, value=cn)
    c.font = Font(bold=True, color='FFFFFF'); c.fill = HDR; c.border = bd
    c.alignment = Alignment(horizontal='center')
ws.cell(row=2, column=1, value='A/B/C 说明见「说明」页；先把 C 类（红）和 B 类（黄）过一遍').font = Font(size=9, italic=True, color='7A8798')
ws.freeze_panes = 'C3'

for ri, r in enumerate(rows, 3):
    vals = dict(r)
    vals['tier'] = r['_tier']
    vals['ok'] = ''
    for i, (k, cn, note) in enumerate(COLS, 1):
        cell = ws.cell(row=ri, column=i, value=vals.get(k))
        cell.border = bd
        if k == 'tier':
            cell.fill = TIER_FILL[r['_tier']]
            cell.font = Font(bold=True)
            cell.alignment = Alignment(horizontal='center')
        if k == 'ok':
            cell.fill = PatternFill('solid', fgColor='F2F6FB')
for i, (k, cn, note) in enumerate(COLS, 1):
    ws.column_dimensions[get_column_letter(i)].width = {
        'tier': 8, 'ok': 8, 'grade': 14, 'brand': 20, 'polymer': 9, 'process': 18,
        'mfr': 7, 'density': 8, 'tensile': 8, 'izod': 7, 'hdt': 7, 'stock': 12,
        'moq': 8, 'package': 16, 'features': 26, 'apps': 30, 'certs': 16, 'origin': 12,
        'remark': 36}.get(k, 10)

# ============ Sheet2: 最小导入模板（只有必要列） ============
w2 = wb.create_sheet('我只填牌号')
MC = [('grade', '牌号*'), ('brand', '厂家*'), ('polymer', '种类*'), ('process', '加工方式'),
      ('stock', '货源'), ('moq', '起订量'), ('price_note', '价格/报价说明'),
      ('mfr', '熔指(可空)'), ('density', '密度(可空)'), ('tensile', '拉伸(可空)'),
      ('izod', '冲击(可空)'), ('hdt', 'HDT(可空)'), ('apps', '用途(可空)'),
      ('remark', '备注(可空)')]
for i, (k, cn) in enumerate(MC, 1):
    c = w2.cell(row=1, column=i, value=cn)
    c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='0F7A3D')
    c.border = bd; c.alignment = Alignment(horizontal='center')
w2.cell(row=2, column=1, value='只要牌号+厂家+种类就能上架；物性留空则页面显示「物性确认中」，不影响买家询价').font = Font(size=9, italic=True, color='7A8798')
w2.freeze_panes = 'A3'
for i, (k, cn) in enumerate(MC, 1):
    w2.column_dimensions[get_column_letter(i)].width = {'grade': 14, 'brand': 20, 'polymer': 9,
        'process': 18, 'stock': 12, 'moq': 10, 'price_note': 24, 'apps': 30, 'remark': 34}.get(k, 12)
    for rr in range(3, 53):
        w2.cell(row=rr, column=i).border = bd

# ============ Sheet3: 说明 ============
w3 = wb.create_sheet('说明')
notes = [
    ('数据可信度分级', ''),
    ('A 标准牌号（绿）', '行业通行事实：牌号/厂家/加工方式/熔指区间可靠。物性数值是原厂 TDS 典型值，需核数值（尤其密度/冲击/HDT）'),
    ('B 厂家变体（黄）', '同一牌号多家厂（如 T30S 中石化/浙石化/茂名）。厂家确实产这个牌号，但数值用的是该牌号通用典型值 —— 按你实际拿货的厂家确认'),
    ('C 规格料（红）', '再生料、改性料、TPE/TPU 通用规格（如 rPP-BK、PP-GF30、TPE-70A）。数值是常见规格参考，必须按你自己的货源规格改，否则宁可删'),
    ('', ''),
    ('校核顺序建议', ''),
    ('第 1 轮', '先把 C 类（红）全部过一遍：你做这些就改规格，不做就整行删掉'),
    ('第 2 轮', 'B 类（黄）：你常拿货的厂家保留并改数值，其余删掉'),
    ('第 3 轮', 'A 类（绿）：抽你最常卖的前 20 个牌号，用原厂 TDS 核密度/冲击/HDT 三个数'),
    ('', ''),
    ('「你确认」列怎么用', ''),
    ('填 Y', '表示这条数值你认，我保留不动'),
    ('填 N', '表示删掉这条（比如你根本不做的牌号）'),
    ('直接改数值', '在对应单元格改，我按牌子+牌号覆盖更新'),
    ('', ''),
    ('要上架新牌号', ''),
    ('用「我只填牌号」页', '牌号+厂家+种类三列必填，物性可以全空 —— 先上架占坑，物性后补'),
    ('发我这个 Excel', '我一条命令覆盖更新线上库，同牌号不会重复'),
    ('', ''),
    ('买家看到的说明', ''),
    ('页面底部已标注', '「以上为原厂典型值，仅供参考；以实际发货批次的 COA 为准」—— 这是免责也是专业度'),
]
for ri, (a, b) in enumerate(notes, 1):
    ca = w3.cell(row=ri, column=1, value=a)
    cb = w3.cell(row=ri, column=2, value=b)
    ca.alignment = Alignment(vertical='top')
    cb.alignment = Alignment(vertical='top', wrap_text=True)
    if b == '' and a:
        ca.font = Font(bold=True, size=12, color='0B1F3A')
w3.column_dimensions['A'].width = 22
w3.column_dimensions['B'].width = 105

dst = r'D:\workspace\chizi\牌号物性表_精准校核清单.xlsx'
wb.save(dst)

# stats
from collections import Counter
tc = Counter(r['_tier'] for r in rows)
print('saved:', dst)
print('total', len(rows), '| tier:', dict(tc))
print('by polymer:', dict(Counter(r['polymer'] for r in rows)))
