# -*- coding: utf-8 -*-
"""Generate the grade-datasheet Excel import template (牌号物性表导入模板)."""
import os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

OUT = r"D:\workspace\chizi\牌号物性表_导入模板.xlsx"

# (中文表头, 字段key, 列宽, 说明)
COLS = [
    ("牌号 *",        "grade",          16, "必填。例：5000S、K8003、HI-121H"),
    ("厂家",          "brand",          16, "例：Sinopec、SABIC、LG Chem"),
    ("种类 *",        "polymer",        12, "PP/HDPE/LDPE/LLDPE/ABS/GPPS/HIPS/PC/PA6/PA66/POM/PET/PVC/EVA/POE/PMMA/PBT/TPU"),
    ("加工方式",      "process",        22, "英文代码，多个用英文分号隔开：injection;blow;extrusion;film;pipe;raffia;coating;foam;roto;thermoform;fiber"),
    ("熔融指数",      "mfr",            11, "g/10min，只填数字"),
    ("熔指测试条件",  "mfr_cond",       18, "例：190°C/2.16kg、230°C/2.16kg"),
    ("密度",          "density",        10, "g/cm³，只填数字"),
    ("拉伸强度",      "tensile",        11, "MPa"),
    ("断裂伸长率",    "elong",          12, "%"),
    ("弯曲模量",      "flex_mod",       11, "MPa"),
    ("弯曲强度",      "flex_str",       11, "MPa"),
    ("缺口冲击(Izod)","izod",           14, "kJ/m²"),
    ("简支梁冲击",    "charpy",         12, "kJ/m²"),
    ("硬度",          "hardness",       12, "文本，例：Shore D 65 / R110"),
    ("热变形温度",    "hdt",            12, "°C @0.45MPa"),
    ("维卡软化点",    "vicat",          12, "°C"),
    ("熔点",          "melt_point",     10, "°C"),
    ("透光率",        "transmittance",  10, "%"),
    ("雾度",          "haze",           10, "%"),
    ("光泽度",        "gloss",          10, ""),
    ("吸水率",        "water_abs",      10, "%"),
    ("灰分",          "ash",            10, "%"),
    ("特性",          "features",       30, "建议用英文词，多个用 ; 隔开（见字典表）。中文也会原样显示"),
    ("典型用途",      "apps",           30, "建议填英文，6 语言网站直接展示"),
    ("认证",          "certs",          18, "FDA;RoHS;REACH;UL;SGS;食品级，多个用 ; 隔开"),
    ("产地",          "origin",         14, "例：China、Saudi Arabia、Korea"),
    ("货源状态",      "stock",          12, "现货 / 期货 / 缺货（或 in_stock / on_request / out）"),
    ("起订量",        "moq",            14, "例：1 吨"),
    ("包装",          "package",        16, "例：25kg 原厂袋 / 1000kg 吨袋"),
    ("价格说明",      "price_note",     18, "可留空"),
    ("TDS 链接",      "tds_url",        24, "可留空"),
    ("COA 链接",      "coa_url",        24, "可留空"),
    ("UL 黄卡号",     "yellow_card",    14, "可留空"),
    ("备注",          "remark",         24, "可留空"),
]

POLY = "PP,HDPE,LDPE,LLDPE,ABS,GPPS,HIPS,PC,PC/ABS,PA6,PA66,POM,PBT,PET,PVC,EVA,POE,PMMA,TPU,TPE,PPS,PPSU,Surlyn,Modified"
PROC = "injection,blow,extrusion,film,pipe,raffia,coating,foam,roto,thermoform,fiber"
STOCK = "现货,期货,缺货,in_stock,on_request,out"
FEATS = [
    ("high flow", "高流动"), ("high impact", "高抗冲"), ("transparent", "透明"),
    ("food grade", "食品级"), ("uv resistant", "抗紫外"), ("glass fiber", "玻纤增强"),
    ("flame retardant", "阻燃"), ("high gloss", "高光泽"), ("antistatic", "抗静电"),
    ("heat resistant", "耐热"), ("low temp", "耐低温"), ("high stiffness", "高刚性"),
    ("copolymer", "共聚"), ("homopolymer", "均聚"), ("anti blocking", "开口性好"),
    ("high strength", "高强度"), ("medical grade", "医疗级"), ("weather resistant", "耐候"),
    ("nucleated", "成核"), ("recycled", "含回收料"),
]
PROC_ZH = [
    ("injection", "注塑"), ("blow", "吹塑"), ("extrusion", "挤出"), ("film", "薄膜"),
    ("pipe", "管材/型材"), ("raffia", "拉丝/编织袋"), ("coating", "涂覆/淋膜"),
    ("foam", "发泡"), ("roto", "滚塑"), ("thermoform", "吸塑/热成型"), ("fiber", "纺丝/纤维"),
]

SAMPLES = [
    ["5000S（示例）", "Sinopec", "HDPE", "raffia;film", 0.9, "190°C/2.16kg", 0.954, 28, 500, 1200, None, 12, None, "Shore D 65", 70, 126, 130, None, None, None, 0.01, 0.02,
     "high strength;high stiffness", "Woven bag, rope, monofilament, shopping bag", "RoHS;REACH", "China", "现货", "1 吨", "25kg 原厂袋", None, None, None, None, "示例行，导入前请删除本行"],
    ["K8003（示例）", "Sinopec", "PP", "injection", 8, "230°C/2.16kg", 0.9, 25, 200, 1300, None, 9, None, "R 95", 100, 150, 165, None, None, None, 0.02, None,
     "copolymer;high impact", "Automotive parts, appliances, battery case", "RoHS;REACH", "China", "现货", "1 吨", "25kg 原厂袋", None, None, None, None, "示例行，导入前请删除本行"],
    ["HI-121H（示例）", "LG Chem", "ABS", "injection", 15, "220°C/10kg", 1.05, 45, 25, 2400, 70, 20, None, "R 108", 92, 98, None, None, None, None, 0.3, None,
     "high impact;high gloss", "TV housing, vacuum cleaner, helmet", "RoHS;REACH;UL", "Korea", "现货", "1 吨", "25kg 原厂袋", None, None, None, None, "示例行，导入前请删除本行"],
]

HDR_FILL = PatternFill("solid", fgColor="0B1F3A")
KEY_FILL = PatternFill("solid", fgColor="EEF2F7")
REQ_FILL = PatternFill("solid", fgColor="FEF3E2")
SAMPLE_FILL = PatternFill("solid", fgColor="FFF9E6")
THIN = Side(style="thin", color="D5DEE9")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)


def build():
    wb = Workbook()

    # ---------- Sheet 1 ----------
    ws = wb.active
    ws.title = "牌号物性表"

    for i, (zh, key, w, note) in enumerate(COLS, start=1):
        c = ws.cell(row=1, column=i, value=zh)
        c.font = Font(bold=True, color="FFFFFF", size=11)
        c.fill = HDR_FILL if key not in ("grade", "polymer") else PatternFill("solid", fgColor="8A5A00")
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = BORDER
        k = ws.cell(row=2, column=i, value=key)
        k.font = Font(bold=True, color="5B6B7F", size=9)
        k.fill = KEY_FILL
        k.alignment = Alignment(horizontal="center", vertical="center")
        k.border = BORDER
        ws.column_dimensions[get_column_letter(i)].width = w

    ws.row_dimensions[1].height = 26
    ws.row_dimensions[2].height = 18

    for r, row in enumerate(SAMPLES, start=3):
        for i, v in enumerate(row, start=1):
            c = ws.cell(row=r, column=i, value=v)
            c.fill = SAMPLE_FILL
            c.border = BORDER
            c.font = Font(size=10.5, italic=True, color="8A6D1F")

    for r in range(3, 203):
        for i in range(1, len(COLS) + 1):
            ws.cell(row=r, column=i).border = BORDER

    # numeric formatting for the value columns
    for r in range(3, 203):
        for i in range(5, 23):
            ws.cell(row=r, column=i).number_format = "0.###"

    ws.freeze_panes = "C3"

    def dv(formula, col_letter, last_row=200):
        d = DataValidation(type="list", formula1='"%s"' % formula, allow_blank=True, showErrorMessage=False)
        ws.add_data_validation(d)
        d.add("%s3:%s%d" % (col_letter, col_letter, last_row))

    dv(POLY, "C")
    dv(PROC, "D")
    dv(STOCK, "AA")

    ws.auto_filter.ref = "A2:%s200" % get_column_letter(len(COLS))

    # ---------- Sheet 2 填写说明 ----------
    ws2 = wb.create_sheet("填写说明")
    ws2.column_dimensions["A"].width = 12
    ws2.column_dimensions["B"].width = 22
    ws2.column_dimensions["C"].width = 18
    ws2.column_dimensions["D"].width = 78
    ws2["A1"] = "牌号物性表 · 填写说明"
    ws2["A1"].font = Font(bold=True, size=14, color="0B1F3A")

    notes = [
        "",
        "1. 只在「牌号物性表」这张表填写，一行 = 一个牌号。第 1 行中文表头、第 2 行英文字段名，请勿修改或删除前两行。",
        "2. 带 * 的「牌号」和「种类」必填；其余全部可留空 —— 留空的参数在网站上自动隐藏，不会显示「—」。",
        "3. 数值列只填数字，不要带单位（单位已固定在表头）。小数用点号，例如 0.954。",
        "4. 「加工方式」和「特性」请填英文代码，多个值用英文分号 ; 隔开。用代码的好处：网站会按买家语言自动翻译（6 种语言）。",
        "5. 「特性」和「用途」填英文效果最好；填中文也会原样显示，只是不会翻译。",
        "6. 前 3 行黄色示例行是格式参考，导入脚本会自动跳过（牌号含「示例」二字即跳过），你也可以直接删掉。",
        "7. 填好后把文件发给我，一条命令即可批量入库；重复导入同一个牌号会覆盖更新，不会重复。",
        "8. 想整表重来，导入时可以选「清空后导入」。",
    ]
    r = 2
    for n in notes:
        ws2.cell(row=r, column=1, value=n).alignment = Alignment(wrap_text=True, vertical="top")
        ws2.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
        ws2.row_dimensions[r].height = 22
        r += 1

    r += 1
    ws2.cell(row=r, column=1, value="字段清单").font = Font(bold=True, size=12, color="0B1F3A")
    r += 1
    for h, v in zip(["列", "字段名", "单位", "说明"], ["A", "B", "C", "D"]):
        pass
    ws2.cell(row=r, column=1, value="列").font = Font(bold=True)
    ws2.cell(row=r, column=2, value="字段名").font = Font(bold=True)
    ws2.cell(row=r, column=3, value="单位").font = Font(bold=True)
    ws2.cell(row=r, column=4, value="说明").font = Font(bold=True)
    r += 1
    units = {"mfr": "g/10min", "density": "g/cm³", "tensile": "MPa", "elong": "%", "flex_mod": "MPa",
             "flex_str": "MPa", "izod": "kJ/m²", "charpy": "kJ/m²", "hdt": "°C", "vicat": "°C",
             "melt_point": "°C", "transmittance": "%", "haze": "%", "water_abs": "%", "ash": "%"}
    for i, (zh, key, w, note) in enumerate(COLS, start=1):
        ws2.cell(row=r, column=1, value=get_column_letter(i))
        ws2.cell(row=r, column=2, value=key)
        ws2.cell(row=r, column=3, value=units.get(key, ""))
        ws2.cell(row=r, column=4, value=note).alignment = Alignment(wrap_text=True)
        r += 1

    # ---------- Sheet 3 字典 ----------
    ws3 = wb.create_sheet("字典")
    ws3.column_dimensions["A"].width = 22
    ws3.column_dimensions["B"].width = 22
    ws3.column_dimensions["C"].width = 4
    ws3.column_dimensions["D"].width = 22
    ws3.column_dimensions["E"].width = 22
    ws3["A1"] = "加工方式代码"
    ws3["B1"] = "中文"
    ws3["D1"] = "特性代码"
    ws3["E1"] = "中文"
    for c in ("A1", "B1", "D1", "E1"):
        ws3[c].font = Font(bold=True, color="FFFFFF")
        ws3[c].fill = HDR_FILL
    for i, (code, zh) in enumerate(PROC_ZH, start=2):
        ws3.cell(row=i, column=1, value=code)
        ws3.cell(row=i, column=2, value=zh)
    for i, (code, zh) in enumerate(FEATS, start=2):
        ws3.cell(row=i, column=4, value=code)
        ws3.cell(row=i, column=5, value=zh)
    ws3.cell(row=len(FEATS) + 3, column=1,
             value="未在上表中的词也可以直接填，网站会原样显示（不会翻译）。").font = Font(italic=True, color="8A6D1F")

    wb.save(OUT)
    print("saved:", OUT)


if __name__ == "__main__":
    build()
