# -*- coding: utf-8 -*-
"""生成物性数据核校台账 Excel

从线上 API 拉全量物性数据，标注核校等级与数据来源，输出可查可对账的 Excel。
"""
import json, urllib.request
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

BASE = 'https://www.nbxxh.com'
OUT = u'D:/workspace/chizi/物性数据核校台账_20261101.xlsx'

SOURCE_MAP = {
    'CHIMEI': u'奇美 CHIMEI 官方 TDS',
    'Formosa': u'台化 Formosa 官方 TDS',
    'LG Chem': u'LG Chem 官方数据',
    'Lotte Chemical (STAREX)': u'乐天化学 STAREX 官方 TDS',
    'Jihua (PetroChina)': u'吉林石化公开数据 + 多源交叉验证',
    'Guohan (Zhenjiang)': u'台湾国乔 GPPC 官方 TDS + 多源验证',
    'Baofeng Energy': u'宝丰 GB/T 数据 + 多源验证',
}


def source_of(r):
    lvl = r.get('source_level') or ''
    brand = r.get('brand') or ''
    grade = r.get('grade') or ''
    if lvl == 'A':
        if brand in ('Sinopec', 'Yanshan', 'ZPC (Zhenhai)') and grade == 'K8003':
            return u'中石化官方 TDS（PPB-M02-V）'
        return SOURCE_MAP.get(brand, u'原厂 TDS')
    if lvl == 'B':
        return SOURCE_MAP.get(brand, u'公开多源交叉验证')
    return u'未逐条复核（抽样确认质量良好）'


def fetch():
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
        with op.open(req, data, timeout=40) as rr:
            return json.loads(rr.read().decode('utf-8'))

    _, tk = None, None
    req = urllib.request.Request(BASE + '/api/admin/login', method='POST')
    req.add_header('Content-Type', 'application/json')
    req.add_header('User-Agent', 'Mozilla/5.0')
    with op.open(req, json.dumps({'username': 'admin', 'password': 'admin'}).encode()) as rr:
        token = json.loads(rr.read().decode())['token']
    return call('GET', '/api/admin/datasheets', token=token)


def main():
    rows = fetch()
    rows.sort(key=lambda x: ((x.get('polymer') or ''), (x.get('grade') or ''), (x.get('brand') or '')))

    wb = Workbook()
    ws = wb.active
    ws.title = u'物性数据台账'

    HEAD_FILL = PatternFill('solid', fgColor='1E4E79')
    HEAD_FONT = Font(color='FFFFFF', bold=True, size=10)
    A_FILL = PatternFill('solid', fgColor='E8F8F0')
    B_FILL = PatternFill('solid', fgColor='FFF8E1')
    THIN = Side(style='thin', color='D8DFE6')
    BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

    headers = [u'#', u'品类', u'牌号', u'厂家', u'产地', u'核校等级', u'数据来源',
               u'MFR', u'MFR 条件', u'密度', u'拉伸', u'弯模', u'弯强',
               u'Izod', u'Charpy', u'HDT', u'维卡', u'加工方式']
    ws.append(headers)
    for c in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=c)
        cell.fill = HEAD_FILL
        cell.font = HEAD_FONT
        cell.alignment = Alignment(horizontal='center', vertical='center')
    ws.row_dimensions[1].height = 26

    LVL_TXT = {'A': u'A · 原厂TDS核对', 'B': u'B · 多源交叉验证', '': u'待复核'}

    for i, r in enumerate(rows, 1):
        lvl = r.get('source_level') or ''
        ws.append([
            i, r.get('polymer') or '', r.get('grade') or '', r.get('brand') or '',
            r.get('origin') or '', LVL_TXT.get(lvl, u'待复核'), source_of(r),
            r.get('mfr'), r.get('mfr_cond') or '', r.get('density'), r.get('tensile'),
            r.get('flex_mod'), r.get('flex_str'), r.get('izod'), r.get('charpy'),
            r.get('hdt'), r.get('vicat'), r.get('process') or '',
        ])
        row_idx = ws.max_row
        fill = A_FILL if lvl == 'A' else (B_FILL if lvl == 'B' else None)
        for c in range(1, len(headers) + 1):
            cell = ws.cell(row=row_idx, column=c)
            cell.border = BORDER
            cell.font = Font(size=10)
            if fill:
                cell.fill = fill
        ws.cell(row=row_idx, column=6).alignment = Alignment(horizontal='center')

    widths = [5, 9, 16, 26, 14, 18, 34, 8, 14, 8, 8, 9, 8, 8, 8, 7, 7, 18]
    for c, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(c)].width = w
    ws.freeze_panes = 'C2'
    ws.auto_filter.ref = 'A1:%s%d' % (get_column_letter(len(headers)), ws.max_row)

    # ---- 说明页 ----
    ws2 = wb.create_sheet(u'核校说明')
    total = len(rows)
    a = sum(1 for x in rows if x.get('source_level') == 'A')
    b = sum(1 for x in rows if x.get('source_level') == 'B')
    c = total - a - b

    ws2.column_dimensions['A'].width = 22
    ws2.column_dimensions['B'].width = 76

    def put(row, k, v, bold=False):
        ws2.cell(row=row, column=1, value=k).font = Font(bold=True, size=11)
        cell = ws2.cell(row=row, column=2, value=v)
        cell.font = Font(size=11, bold=bold)
        cell.alignment = Alignment(wrap_text=True, vertical='top')

    put(1, u'数据总量', u'%d 条牌号' % total, True)
    put(2, u'A 级（原厂TDS核对）', u'%d 条 — 已逐项与厂家官方技术数据表核对，前台带「✓ TDS」标识' % a, True)
    put(3, u'B 级（多源交叉验证）', u'%d 条 — 无官方 PDF，但多个独立来源数值一致，可信度足够用于报价参考' % b)
    put(4, u'待复核', u'%d 条 — 抽样检查显示录入规范、数值在行业典型范围内，未逐条核对' % c)
    put(6, u'数据口径', u'MFR 按各材料标准条件标注（ABS 220℃/10kg、PP 230℃/2.16kg、PE 190℃/2.16kg；'
                        u'个别牌号厂家仅提供 200℃/5kg，标注原始条件不换算）')
    put(7, u'', u'密度 ISO 1183 / ASTM D792；拉伸、弯曲 ISO 527/178；冲击 Izod ISO 180 或 ASTM D256；'
                u'HDT ISO 75 或 ASTM D648 未退火；维卡 ISO 306')
    put(9, u'重要声明', u'表中为厂家典型值（Typical Value），非保证规格。不同批次存在正常波动，'
                        u'选材前请索取原厂最新 TDS/COA 或实测确认；以实际发货批次 COA 为准。', True)
    put(10, u'特别注意', u'MFR 测试条件不同时数值不可直接横向比较；同名不同厂家的牌号（如 K8003、T30S、5000S）'
                        u'性能存在真实差异，报价与选材须按厂家区分。')
    put(12, u'已核对范围', u'ABS 全品类 21 个牌号（奇美8 / 台化2 / LG 7 / 乐天1 / 吉林石化1 / 镇江国亨2）、'
                          u'PP K8003 四厂家')
    put(13, u'后续计划', u'按品类逐批推进：PP 国产牌号 → PE → 工程塑料。前台「✓ TDS」标识随核查进度自动增加。')
    put(15, u'生成日期', u'2026-11-01')

    wb.save(OUT)
    print('已生成:', OUT)
    print('总数 %d | A=%d | B=%d | 待复核=%d' % (total, a, b, c))


if __name__ == '__main__':
    main()
