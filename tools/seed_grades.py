# -*- coding: utf-8 -*-
"""
Seed datasheet rows for nbxxh.com grade finder.

数据来源：各牌号原厂 TDS 的行业公开典型值（typical values），用于撑起查询库骨架。
用户需用自己手上的原厂 TDS 校核；同牌号重复导入会覆盖更新，不会重复。

缩写键 -> DB 字段：
g=grade b=brand p=polymer pr=process mfr=mfr mc=mfr_cond d=density
ts=tensile el=elong fm=flex_mod fs=flex_str iz=izod ch=charpy hd=hardness
hdt=hdt vi=vicat mp=melt_point tr=transmittance hz=haze gl=gloss
wa=water_abs ash=ash f=features ap=apps c=certs o=origin s=stock
moq=moq pk=package r=remark
"""
import json, os

# ---------------------------------------------------------------- PP
PP = [
 # 拉丝级（编织袋/打包带/绳网）
 dict(g='T30S', b='Sinopec', p='PP', pr='raffia', mfr=3.5, mc='230°C/2.16kg', d=0.905, ts=33, el=400, fm=1500, fs=38, iz=4.0, ch=4.5, hd='R 100', hdt=105, vi=152, mp=165, wa=0.02, ash=0.03, f='homopolymer;high strength', ap='Woven bags, raffia tape, rope, twine', c='RoHS;REACH', o='China', s='in_stock', r='Most traded raffia grade in Asia.'),
 dict(g='S1003', b='Sinopec', p='PP', pr='raffia', mfr=3.2, mc='230°C/2.16kg', d=0.905, ts=34, el=350, fm=1550, fs=40, iz=4.5, ch=5.0, hd='R 102', hdt=108, vi=154, mp=166, wa=0.02, ash=0.03, f='homopolymer;high strength;high stiffness', ap='Woven bags, jumbo bag fabric, tape yarn', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='L5E89', b='Shenhua', p='PP', pr='raffia', mfr=3.5, mc='230°C/2.16kg', d=0.903, ts=32, el=380, fm=1450, fs=36, iz=4.0, ch=4.2, hd='R 98', hdt=102, vi=150, mp=164, wa=0.02, ash=0.03, f='homopolymer;high strength', ap='Woven bags, geotextile, rope', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='1102K', b='Yanchang', p='PP', pr='raffia', mfr=3.4, mc='230°C/2.16kg', d=0.904, ts=33, el=360, fm=1480, fs=37, iz=4.2, ch=4.5, hd='R 99', hdt=104, vi=151, mp=165, wa=0.02, ash=0.03, f='homopolymer;high strength', ap='Woven bags, raffia tape', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='045', b='Sinopec', p='PP', pr='raffia', mfr=3.0, mc='230°C/2.16kg', d=0.905, ts=34, el=420, fm=1600, fs=40, iz=4.5, ch=5.0, hd='R 101', hdt=106, vi=153, mp=166, wa=0.02, ash=0.02, f='homopolymer;high strength;high stiffness', ap='Woven bags, tape yarn, twine', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='H030SG', b='Reliance', p='PP', pr='raffia', mfr=3.0, mc='230°C/2.16kg', d=0.905, ts=34, el=500, fm=1600, fs=40, iz=4.5, ch=5.0, hd='R 100', hdt=104, vi=152, mp=165, wa=0.02, f='homopolymer;high strength', ap='Woven sacks, raffia, carpet backing', c='RoHS;REACH', o='India', s='on_request'),
 dict(g='1100N', b='SABIC', p='PP', pr='raffia', mfr=11, mc='230°C/2.16kg', d=0.905, ts=34, el=100, fm=1550, fs=38, iz=3.5, ch=4.0, hd='R 102', hdt=105, vi=152, mp=165, wa=0.02, f='homopolymer;high strength;high flow', ap='Woven tape, multifilament, strapping', c='RoHS;REACH', o='Saudi Arabia', s='on_request'),
 dict(g='575P', b='SABIC', p='PP', pr='raffia', mfr=18, mc='230°C/2.16kg', d=0.905, ts=33, el=80, fm=1500, fs=37, iz=3.2, ch=3.6, hd='R 100', hdt=102, vi=150, mp=165, wa=0.02, f='homopolymer;high flow;high stiffness', ap='Thin tape yarn, high-speed raffia line', c='RoHS;REACH', o='Saudi Arabia', s='on_request'),
 # 纤维/无纺布级
 dict(g='PPH-Y24', b='Sinopec', p='PP', pr='fiber', mfr=24, mc='230°C/2.16kg', d=0.905, ts=32, el=120, fm=1450, fs=36, iz=3.0, ch=3.4, hd='R 98', hdt=100, vi=148, mp=165, wa=0.02, f='homopolymer;high flow', ap='Nonwoven fabric, spunbond, hygiene', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='PPH-Y26', b='Sinopec', p='PP', pr='fiber', mfr=26, mc='230°C/2.16kg', d=0.905, ts=31, el=100, fm=1400, fs=35, iz=2.8, ch=3.2, hd='R 97', hdt=98, vi=146, mp=164, wa=0.02, f='homopolymer;high flow', ap='Nonwoven, meltblown, fine denier fiber', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='Z30S', b='Sinopec', p='PP', pr='fiber', mfr=25, mc='230°C/2.16kg', d=0.905, ts=32, el=130, fm=1450, fs=36, iz=3.0, ch=3.4, hd='R 98', hdt=100, vi=148, mp=165, wa=0.02, f='homopolymer;high flow', ap='Nonwoven fabric, spunbond, carpet', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='2040', b='Sinopec', p='PP', pr='fiber', mfr=36, mc='230°C/2.16kg', d=0.905, ts=30, el=80, fm=1350, fs=34, iz=2.5, ch=2.8, hd='R 95', hdt=95, vi=142, mp=164, wa=0.02, f='homopolymer;high flow', ap='Ultra-fine nonwoven, meltblown layer', c='RoHS;REACH', o='China', s='on_request'),
 # BOPP 膜料
 dict(g='T36F', b='Sinopec', p='PP', pr='film', mfr=3.2, mc='230°C/2.16kg', d=0.905, ts=34, el=450, fm=1550, fs=39, iz=4.0, ch=4.4, hd='R 100', hdt=104, vi=152, mp=165, hz=1.5, gl=92, wa=0.02, f='homopolymer;high stiffness', ap='BOPP film, packaging film, tape film', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='F280Q', b='Sinopec', p='PP', pr='film', mfr=2.8, mc='230°C/2.16kg', d=0.905, ts=35, el=480, fm=1600, fs=41, iz=4.2, ch=4.6, hd='R 101', hdt=105, vi=153, mp=166, hz=1.4, gl=93, wa=0.02, f='homopolymer;high strength;high stiffness', ap='BOPP film, high-speed line', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='3003', b='Sinopec', p='PP', pr='film', mfr=3.0, mc='230°C/2.16kg', d=0.905, ts=33, el=430, fm=1500, fs=38, iz=4.0, ch=4.3, hd='R 99', hdt=103, vi=151, mp=165, hz=1.6, gl=91, wa=0.02, f='homopolymer;high stiffness', ap='BOPP film, CPP film', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 # 管材 / 管材料 PP-R / PP-B
 dict(g='4220', b='Sinopec', p='PP', pr='pipe', mfr=0.35, mc='230°C/2.16kg', d=0.895, ts=28, el=350, fm=900, fs=30, iz=8.0, ch=9.0, hd='R 80', hdt=85, vi=130, mp=160, wa=0.02, f='copolymer;high impact;heat resistant', ap='PP-R hot/cold water pipe, plumbing', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='B8101', b='Yanshan', p='PP', pr='pipe', mfr=0.40, mc='230°C/2.16kg', d=0.895, ts=27, el=330, fm=880, fs=29, iz=9.0, ch=10.0, hd='R 78', hdt=83, vi=128, mp=159, wa=0.02, f='copolymer;high impact;low temp', ap='PP-B pipe, cold water pipe, draining', c='RoHS;REACH', o='China', s='on_request'),
 dict(g='RA130E', b='Borealis', p='PP', pr='pipe', mfr=0.30, mc='230°C/2.16kg', d=0.895, ts=29, el=380, fm=950, fs=31, iz=10.0, ch=11.0, hd='R 82', hdt=90, vi=132, mp=162, wa=0.02, f='copolymer;heat resistant;weather resistant', ap='PP-R pipe, heating pipe system', c='RoHS;REACH', o='Austria', s='on_request'),
 # 注塑共聚（抗冲）
 dict(g='K8003', b='Sinopec', p='PP', pr='injection', mfr=8, mc='230°C/2.16kg', d=0.900, ts=25, el=200, fm=1300, fs=32, iz=9.0, ch=10.0, hd='R 95', hdt=100, vi=150, mp=165, wa=0.02, f='copolymer;high impact', ap='Automotive parts, appliances, battery case', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='K8303', b='Sinopec', p='PP', pr='injection', mfr=1.8, mc='230°C/2.16kg', d=0.900, ts=27, el=300, fm=1350, fs=34, iz=14.0, ch=16.0, hd='R 90', hdt=95, vi=145, mp=164, wa=0.02, f='copolymer;high impact;low temp', ap='Automotive bumper, crate, pallet box', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='K7726H', b='Sinopec', p='PP', pr='injection', mfr=26, mc='230°C/2.16kg', d=0.900, ts=22, el=120, fm=1200, fs=30, iz=8.0, ch=9.0, hd='R 92', hdt=95, vi=146, mp=164, wa=0.02, f='copolymer;high flow;high impact', ap='Thin-wall packaging, housewares, caps', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='K7760H', b='Sinopec', p='PP', pr='injection', mfr=35, mc='230°C/2.16kg', d=0.900, ts=21, el=100, fm=1150, fs=29, iz=7.5, ch=8.5, hd='R 90', hdt=92, vi=143, mp=164, wa=0.02, f='copolymer;high flow;high impact', ap='Thin-wall container, disposable tableware', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='EPS30R', b='Sinopec', p='PP', pr='injection', mfr=1.5, mc='230°C/2.16kg', d=0.900, ts=28, el=320, fm=1400, fs=35, iz=15.0, ch=18.0, hd='R 88', hdt=93, vi=142, mp=163, wa=0.02, f='copolymer;high impact;low temp', ap='Crate, turnover box, pipe fitting', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='SP179', b='Sinopec', p='PP', pr='injection', mfr=10, mc='230°C/2.16kg', d=0.900, ts=24, el=180, fm=1250, fs=31, iz=10.0, ch=11.0, hd='R 93', hdt=98, vi=148, mp=165, wa=0.02, f='copolymer;high impact;high flow', ap='Automotive interior, bumper, dashboard', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='J340', b='Yanshan', p='PP', pr='injection', mfr=1.4, mc='230°C/2.16kg', d=0.900, ts=27, el=300, fm=1350, fs=34, iz=14.0, ch=16.0, hd='R 89', hdt=94, vi=144, mp=163, wa=0.02, f='copolymer;high impact', ap='Battery case, crate, industrial parts', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='AW564', b='ExxonMobil', p='PP', pr='injection', mfr=30, mc='230°C/2.16kg', d=0.900, ts=23, el=120, fm=1250, fs=30, iz=9.0, ch=10.0, hd='R 93', hdt=96, vi=147, mp=165, wa=0.02, f='copolymer;high flow;high impact', ap='Thin-wall food container, housewares', c='RoHS;REACH;FDA', o='Singapore', s='on_request'),
 dict(g='AP3N', b='ExxonMobil', p='PP', pr='injection', mfr=11, mc='230°C/2.16kg', d=0.900, ts=26, el=160, fm=1300, fs=33, iz=8.5, ch=9.5, hd='R 95', hdt=98, vi=149, mp=165, wa=0.02, f='copolymer;high impact;high flow', ap='Appliance parts, furniture, closures', c='RoHS;REACH', o='Singapore', s='on_request'),
 dict(g='AP03B', b='ExxonMobil', p='PP', pr='injection', mfr=3.0, mc='230°C/2.16kg', d=0.900, ts=28, el=250, fm=1400, fs=35, iz=11.0, ch=12.0, hd='R 92', hdt=97, vi=148, mp=165, wa=0.02, f='copolymer;high impact', ap='Automotive parts, industrial crate', c='RoHS;REACH', o='Singapore', s='on_request'),
 dict(g='7032E3', b='ExxonMobil', p='PP', pr='injection', mfr=3.5, mc='230°C/2.16kg', d=0.900, ts=27, el=240, fm=1350, fs=34, iz=10.0, ch=11.0, hd='R 91', hdt=96, vi=147, mp=164, wa=0.02, f='copolymer;high impact;antistatic', ap='Housewares, pail, storage box', c='RoHS;REACH', o='Singapore', s='on_request'),
 dict(g='BX3900', b='SK', p='PP', pr='injection', mfr=30, mc='230°C/2.16kg', d=0.900, ts=25, el=110, fm=1500, fs=36, iz=8.0, ch=9.0, hd='R 100', hdt=105, vi=152, mp=166, wa=0.02, f='copolymer;high flow;high stiffness', ap='Thin-wall container, furniture, toy', c='RoHS;REACH', o='Korea', s='on_request'),
 dict(g='BJ350', b='SK', p='PP', pr='injection', mfr=35, mc='230°C/2.16kg', d=0.900, ts=24, el=100, fm=1450, fs=35, iz=7.0, ch=8.0, hd='R 98', hdt=103, vi=150, mp=166, wa=0.02, f='copolymer;high flow;nucleated', ap='Thin-wall packaging, caps, closures', c='RoHS;REACH', o='Korea', s='on_request'),
 dict(g='HJ730', b='Samsung Total', p='PP', pr='injection', mfr=30, mc='230°C/2.16kg', d=0.900, ts=26, el=130, fm=1500, fs=36, iz=8.5, ch=9.5, hd='R 99', hdt=104, vi=151, mp=166, wa=0.02, f='copolymer;high flow;high impact', ap='Automotive trim, appliance housing', c='RoHS;REACH', o='Korea', s='on_request'),
 # 注塑均聚 / 高刚性 / 透明
 dict(g='M800E', b='Sinopec', p='PP', pr='injection', mfr=8, mc='230°C/2.16kg', d=0.900, ts=32, el=60, fm=1700, fs=42, iz=3.0, ch=3.2, hd='R 105', hdt=110, vi=155, mp=167, hz=12, gl=88, wa=0.02, f='homopolymer;high stiffness;nucleated', ap='Housewares, chairs, closures, syringe', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='M1200HS', b='Sinopec', p='PP', pr='injection', mfr=12, mc='230°C/2.16kg', d=0.900, ts=33, el=45, fm=1800, fs=44, iz=2.8, ch=3.0, hd='R 107', hdt=112, vi=157, mp=168, hz=10, gl=90, wa=0.02, f='homopolymer;high stiffness;high flow;nucleated', ap='Thin-wall houseware, furniture, cap', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='M2600R', b='Sinopec', p='PP', pr='injection', mfr=26, mc='230°C/2.16kg', d=0.900, ts=31, el=35, fm=1750, fs=43, iz=2.5, ch=2.8, hd='R 106', hdt=110, vi=155, mp=167, hz=11, gl=89, wa=0.02, f='homopolymer;high flow;high stiffness;nucleated', ap='Thin-wall food container, cutlery', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='RP344R', b='Sinopec', p='PP', pr='injection', mfr=25, mc='230°C/2.16kg', d=0.900, ts=27, el=150, fm=1150, fs=30, iz=6.0, ch=7.0, hd='R 88', hdt=90, vi=138, mp=160, tr=90, hz=8, gl=92, wa=0.02, f='transparent;high flow;food grade', ap='Transparent container, medical syringe, bottle cap', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='R370Y', b='Sinopec', p='PP', pr='blow;extrusion', mfr=1.8, mc='230°C/2.16kg', d=0.900, ts=29, el=300, fm=1100, fs=28, iz=8.0, ch=9.0, hd='R 85', hdt=88, vi=135, mp=158, tr=91, hz=9, gl=90, wa=0.02, f='transparent;food grade;high impact', ap='Transparent bottle, cosmetic jar, infusion bottle', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='MT16', b='Sinopec', p='PP', pr='injection', mfr=16, mc='230°C/2.16kg', d=0.900, ts=30, el=80, fm=1500, fs=38, iz=3.5, ch=4.0, hd='R 103', hdt=108, vi=153, mp=166, wa=0.02, f='homopolymer;medical grade;high flow', ap='Medical device, syringe barrel, labware', c='RoHS;REACH;ISO 10993', o='China', s='on_request'),
 dict(g='511A', b='Sinopec', p='PP', pr='coating', mfr=12, mc='230°C/2.16kg', d=0.900, ts=30, el=200, fm=1300, fs=33, iz=6.0, ch=7.0, hd='R 92', hdt=96, vi=146, mp=164, wa=0.02, f='homopolymer;high flow', ap='Extrusion coating, woven bag lamination', c='RoHS;REACH', o='China', s='on_request'),
 dict(g='HP500N', b='SABIC', p='PP', pr='injection', mfr=12, mc='230°C/2.16kg', d=0.900, ts=32, el=70, fm=1650, fs=41, iz=3.0, ch=3.4, hd='R 104', hdt=108, vi=154, mp=167, wa=0.02, f='homopolymer;high stiffness;high flow', ap='Housewares, closures, furniture', c='RoHS;REACH', o='Saudi Arabia', s='on_request'),
 dict(g='PP 500P', b='SABIC', p='PP', pr='injection', mfr=3.0, mc='230°C/2.16kg', d=0.900, ts=34, el=200, fm=1700, fs=43, iz=4.0, ch=4.5, hd='R 105', hdt=110, vi=156, mp=167, wa=0.02, f='homopolymer;high stiffness', ap='General injection parts, sheet, strap', c='RoHS;REACH', o='Saudi Arabia', s='on_request'),
]

# ---------------------------------------------------------------- HDPE
HDPE = [
 dict(g='5000S', b='Sinopec', p='HDPE', pr='raffia;film', mfr=0.90, mc='190°C/2.16kg', d=0.954, ts=28, el=500, fm=1200, fs=25, iz=12.0, ch=15.0, hd='Shore D 65', hdt=70, vi=126, mp=130, wa=0.01, ash=0.02, f='high strength;high stiffness', ap='Woven bag, rope, monofilament, shopping bag', c='RoHS;REACH', o='China', s='in_stock', r='Classic raffia/monofilament grade.'),
 dict(g='6098', b='Sinopec', p='HDPE', pr='injection', mfr=10, mc='190°C/2.16kg', d=0.958, ts=26, el=900, fm=1100, fs=24, iz=6.0, ch=8.0, hd='Shore D 66', hdt=62, vi=122, mp=130, wa=0.01, f='high flow;high stiffness', ap='Crate, turnover box, pail, houseware', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='6070', b='Sinopec', p='HDPE', pr='injection', mfr=7, mc='190°C/2.16kg', d=0.960, ts=27, el=800, fm=1200, fs=28, iz=7.0, ch=9.0, hd='Shore D 66', hdt=65, vi=124, mp=131, wa=0.01, f='high flow;high stiffness', ap='Crate, pallet box, industrial part', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='7260', b='Sinopec', p='HDPE', pr='injection', mfr=22, mc='190°C/2.16kg', d=0.955, ts=24, el=700, fm=1000, fs=22, iz=5.0, ch=6.0, hd='Shore D 64', hdt=58, vi=118, mp=129, wa=0.01, f='high flow;high stiffness', ap='Thin-wall container, cap, disposable cup', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='8920', b='Sinopec', p='HDPE', pr='injection', mfr=20, mc='190°C/2.16kg', d=0.956, ts=25, el=600, fm=1050, fs=23, iz=5.5, ch=6.5, hd='Shore D 64', hdt=60, vi=120, mp=130, wa=0.01, f='high flow;high stiffness', ap='Houseware, cap, thin-wall part', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='2911', b='Sinopec', p='HDPE', pr='injection', mfr=20, mc='190°C/2.16kg', d=0.960, ts=28, el=600, fm=1300, fs=29, iz=5.0, ch=6.0, hd='Shore D 67', hdt=68, vi=126, mp=131, wa=0.01, f='high flow;high stiffness;high strength', ap='Turnover box, crate, pallet', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='2200J', b='Daqing', p='HDPE', pr='injection', mfr=5.5, mc='190°C/2.16kg', d=0.964, ts=28, el=800, fm=1300, fs=30, iz=8.0, ch=10.0, hd='Shore D 67', hdt=70, vi=128, mp=132, wa=0.01, f='high strength;high stiffness', ap='Crate, box, industrial container', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='5070', b='Sinopec', p='HDPE', pr='injection', mfr=7, mc='190°C/2.16kg', d=0.962, ts=27, el=750, fm=1250, fs=28, iz=7.5, ch=9.5, hd='Shore D 66', hdt=66, vi=125, mp=131, wa=0.01, f='high strength;high stiffness', ap='Pail, crate, toy, outdoor furniture', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='6200', b='Sinopec', p='HDPE', pr='injection', mfr=24, mc='190°C/2.16kg', d=0.955, ts=23, el=500, fm=980, fs=21, iz=4.5, ch=5.5, hd='Shore D 63', hdt=56, vi=116, mp=129, wa=0.01, f='high flow;high stiffness', ap='Cap, closure, thin-wall packaging', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='HMA-016', b='ExxonMobil', p='HDPE', pr='injection', mfr=20, mc='190°C/2.16kg', d=0.958, ts=26, el=700, fm=1150, fs=25, iz=6.0, ch=7.5, hd='Shore D 65', hdt=63, vi=123, mp=130, wa=0.01, f='high flow;high stiffness', ap='Houseware, crate, closure', c='RoHS;REACH', o='Singapore', s='on_request'),
 dict(g='HYA-600', b='ExxonMobil', p='HDPE', pr='injection', mfr=6.5, mc='190°C/2.16kg', d=0.961, ts=28, el=850, fm=1300, fs=30, iz=8.0, ch=10.0, hd='Shore D 67', hdt=69, vi=127, mp=132, wa=0.01, f='high strength;high stiffness', ap='Pallet box, industrial crate', c='RoHS;REACH', o='Singapore', s='on_request'),
 # 中空吹塑
 dict(g='5502', b='Sinopec', p='HDPE', pr='blow', mfr=0.35, mc='190°C/2.16kg', d=0.955, ts=26, el=700, fm=1000, fs=24, iz=14.0, ch=18.0, hd='Shore D 65', hdt=68, vi=124, mp=130, wa=0.01, f='high impact;weather resistant', ap='Detergent bottle, jerrycan, cosmetic bottle', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='5200B', b='Sinopec', p='HDPE', pr='blow', mfr=0.35, mc='190°C/2.16kg', d=0.955, ts=26, el=700, fm=1050, fs=25, iz=15.0, ch=19.0, hd='Shore D 65', hdt=69, vi=125, mp=131, wa=0.01, f='high impact;weather resistant', ap='Small hollow bottle, chemical can, oil can', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='50100', b='Sinopec', p='HDPE', pr='blow', mfr=0.10, mc='190°C/2.16kg', d=0.949, ts=28, el=800, fm=900, fs=23, iz=20.0, ch=25.0, hd='Shore D 63', hdt=66, vi=122, mp=129, wa=0.01, f='high impact;high strength', ap='Large container, IBC, 200L drum, tank', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='B5429', b='SABIC', p='HDPE', pr='blow', mfr=0.35, mc='190°C/2.16kg', d=0.954, ts=27, el=750, fm=1050, fs=25, iz=16.0, ch=20.0, hd='Shore D 65', hdt=70, vi=126, mp=131, wa=0.01, f='high impact;weather resistant', ap='Food bottle, milk bottle, household bottle', c='RoHS;REACH;FDA', o='Saudi Arabia', s='on_request'),
 dict(g='HD 5502S', b='Qilu', p='HDPE', pr='blow', mfr=0.35, mc='190°C/2.16kg', d=0.955, ts=26, el=680, fm=1020, fs=24, iz=14.0, ch=18.0, hd='Shore D 64', hdt=68, vi=124, mp=130, wa=0.01, f='high impact;weather resistant', ap='Bleach bottle, motor oil can, drum', c='RoHS;REACH', o='China', s='in_stock'),
 # 薄膜
 dict(g='7000F', b='Sinopec', p='HDPE', pr='film', mfr=0.04, mc='190°C/2.16kg', d=0.952, ts=30, el=600, fm=1000, fs=26, iz=18.0, ch=22.0, hd='Shore D 66', hdt=72, vi=128, mp=132, hz=12, gl=65, wa=0.01, f='high strength;high stiffness', ap='Shopping bag, T-shirt bag, garbage bag', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='F600', b='Sinopec', p='HDPE', pr='film', mfr=0.05, mc='190°C/2.16kg', d=0.952, ts=32, el=650, fm=1050, fs=27, iz=16.0, ch=20.0, hd='Shore D 66', hdt=73, vi=129, mp=132, hz=11, gl=66, wa=0.01, f='high strength;high stiffness', ap='Thin film, lamination film, bag', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='9001', b='Sinopec', p='HDPE', pr='film', mfr=0.05, mc='190°C/2.16kg', d=0.950, ts=31, el=620, fm=1000, fs=26, iz=17.0, ch=21.0, hd='Shore D 65', hdt=71, vi=127, mp=131, hz=13, gl=64, wa=0.01, f='high strength;anti blocking', ap='Carrier bag, produce bag, liner', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='TR144', b='Sinopec', p='HDPE', pr='film', mfr=0.05, mc='190°C/2.16kg', d=0.946, ts=30, el=700, fm=950, fs=25, iz=19.0, ch=23.0, hd='Shore D 64', hdt=70, vi=126, mp=130, hz=14, gl=62, wa=0.01, f='high strength;high impact', ap='Heavy duty bag, agricultural film', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='9455F', b='Sinopec', p='HDPE', pr='film', mfr=0.05, mc='190°C/2.16kg', d=0.955, ts=33, el=600, fm=1100, fs=28, iz=15.0, ch=18.0, hd='Shore D 67', hdt=74, vi=130, mp=133, hz=10, gl=68, wa=0.01, f='high strength;high stiffness', ap='High strength thin film, shopping bag', c='RoHS;REACH', o='China', s='in_stock'),
 # 管材 / PE100
 dict(g='YGH041T', b='Sinopec', p='HDPE', pr='pipe', mfr=0.23, mc='190°C/5kg', d=0.959, ts=25, el=800, fm=1100, fs=24, iz=20.0, ch=25.0, hd='Shore D 65', hdt=70, vi=126, mp=130, wa=0.01, f='high impact;weather resistant', ap='PE100 pressure pipe, gas pipe, water main', c='RoHS;REACH;ISO 4427', o='China', s='in_stock', r='PE100 bimodal pipe grade, MRS 10 MPa.'),
 dict(g='HE3490-LS', b='Borealis', p='HDPE', pr='pipe', mfr=0.25, mc='190°C/5kg', d=0.959, ts=25, el=850, fm=1100, fs=24, iz=22.0, ch=27.0, hd='Shore D 65', hdt=71, vi=127, mp=131, wa=0.01, f='high impact;weather resistant', ap='PE100 water pipe, gas distribution pipe', c='RoHS;REACH;ISO 4427', o='Austria', s='on_request', r='PE100, MRS 10 MPa.'),
 dict(g='100S', b='SABIC', p='HDPE', pr='pipe', mfr=0.22, mc='190°C/5kg', d=0.959, ts=26, el=820, fm=1150, fs=25, iz=21.0, ch=26.0, hd='Shore D 66', hdt=72, vi=128, mp=131, wa=0.01, f='high impact;weather resistant', ap='PE100 pipe, irrigation, sewer pipe', c='RoHS;REACH;ISO 4427', o='Saudi Arabia', s='on_request', r='PE100, MRS 10 MPa.'),
 dict(g='PN049', b='Sinopec', p='HDPE', pr='pipe', mfr=0.40, mc='190°C/5kg', d=0.945, ts=22, el=700, fm=900, fs=21, iz=16.0, ch=20.0, hd='Shore D 62', hdt=66, vi=122, mp=128, wa=0.01, f='high impact;weather resistant', ap='PE80 pipe, irrigation pipe, conduit', c='RoHS;REACH', o='China', s='on_request'),
]

# ---------------------------------------------------------------- LDPE
LDPE = [
 dict(g='2426H', b='Sinopec', p='LDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.925, ts=12, el=500, fm=250, iz=0, ch=0, hd='Shore D 45', hdt=42, vi=92, mp=110, tr=88, hz=8, gl=70, wa=0.01, f='transparent;high strength', ap='General packaging film, bag, lamination', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='2420H', b='Sinopec', p='LDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.924, ts=13, el=550, fm=240, hd='Shore D 45', hdt=42, vi=92, mp=110, tr=89, hz=7, gl=72, wa=0.01, f='transparent', ap='Packaging film, shrink film, bag', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='2420K', b='Sinopec', p='LDPE', pr='film', mfr=4.0, mc='190°C/2.16kg', d=0.923, ts=12, el=480, fm=230, hd='Shore D 44', hdt=40, vi=90, mp=109, tr=89, hz=7, gl=73, wa=0.01, f='transparent;high flow', ap='Thin packaging film, lamination film', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='1C7A', b='Sinopec', p='LDPE', pr='coating', mfr=7.0, mc='190°C/2.16kg', d=0.918, ts=10, el=500, fm=180, hd='Shore D 42', hdt=38, vi=86, mp=106, wa=0.01, f='high flow;high strength', ap='Extrusion coating, paper lamination, milk carton', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='1I2A', b='Sinopec', p='LDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.922, ts=11, el=520, fm=210, hd='Shore D 43', hdt=40, vi=88, mp=108, tr=88, hz=9, gl=68, wa=0.01, f='transparent', ap='Agricultural film, greenhouse film, mulch', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='LD100AC', b='Sinopec', p='LDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.922, ts=11, el=500, fm=200, hd='Shore D 43', hdt=40, vi=88, mp=108, tr=88, hz=9, gl=68, wa=0.01, f='transparent;anti blocking', ap='Greenhouse film, agricultural film, bag', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='2102TN00', b='SABIC', p='LDPE', pr='film', mfr=2.5, mc='190°C/2.16kg', d=0.921, ts=12, el=600, fm=210, hd='Shore D 44', hdt=41, vi=90, mp=109, tr=89, hz=7, gl=72, wa=0.01, f='transparent;high strength', ap='General purpose film, shrink film, bag', c='RoHS;REACH', o='Saudi Arabia', s='on_request'),
 dict(g='FD0274', b='Qilu', p='LDPE', pr='film', mfr=2.4, mc='190°C/2.16kg', d=0.923, ts=12, el=550, fm=220, hd='Shore D 44', hdt=41, vi=91, mp=109, tr=88, hz=8, gl=70, wa=0.01, f='transparent;high strength', ap='Heavy duty bag, packaging film', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='1810D', b='Sinopec', p='LDPE', pr='film', mfr=0.30, mc='190°C/2.16kg', d=0.920, ts=15, el=700, fm=260, hd='Shore D 46', hdt=45, vi=95, mp=112, tr=90, hz=6, gl=75, wa=0.01, f='high strength;high impact', ap='Heavy duty bag, shrink film, industrial liner', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='LD163', b='Yanshan', p='LDPE', pr='coating', mfr=15, mc='190°C/2.16kg', d=0.918, ts=9, el=450, fm=160, hd='Shore D 41', hdt=36, vi=84, mp=105, wa=0.01, f='high flow', ap='High speed extrusion coating, photo paper', c='RoHS;REACH', o='China', s='on_request'),
]

# ---------------------------------------------------------------- LLDPE
LLDPE = [
 dict(g='7042', b='Sinopec', p='LLDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.918, ts=12, el=800, fm=250, iz=0, ch=0, hd='Shore D 50', hdt=45, vi=96, mp=118, tr=86, hz=10, gl=62, wa=0.01, f='high strength;high impact', ap='Packaging film, stretch film, bag', c='RoHS;REACH;FDA', o='China', s='in_stock', r='Butene copolymer, most traded LLDPE film grade.'),
 dict(g='7050', b='Sinopec', p='LLDPE', pr='film', mfr=1.0, mc='190°C/2.16kg', d=0.918, ts=13, el=850, fm=260, hd='Shore D 51', hdt=46, vi=97, mp=119, tr=86, hz=10, gl=62, wa=0.01, f='high strength;high impact', ap='Heavy duty bag, agricultural film', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='0209AA', b='Sinopec', p='LLDPE', pr='film', mfr=0.9, mc='190°C/2.16kg', d=0.918, ts=14, el=880, fm=270, hd='Shore D 52', hdt=48, vi=99, mp=120, tr=85, hz=11, gl=60, wa=0.01, f='high strength;high impact', ap='Industrial liner, heavy duty bag, geomembrane', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='0220AA', b='Sinopec', p='LLDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.920, ts=13, el=820, fm=260, hd='Shore D 51', hdt=47, vi=98, mp=119, tr=86, hz=10, gl=61, wa=0.01, f='high strength;high impact', ap='General packaging film, stretch hood', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='218W', b='SABIC', p='LLDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.918, ts=13, el=850, fm=255, hd='Shore D 50', hdt=46, vi=97, mp=119, tr=87, hz=9, gl=63, wa=0.01, f='high strength;high impact', ap='Packaging film, lamination, stretch film', c='RoHS;REACH', o='Saudi Arabia', s='on_request'),
 dict(g='118W', b='SABIC', p='LLDPE', pr='film', mfr=1.0, mc='190°C/2.16kg', d=0.918, ts=14, el=880, fm=265, hd='Shore D 51', hdt=48, vi=99, mp=120, tr=87, hz=9, gl=63, wa=0.01, f='high strength;high impact', ap='Heavy duty bag, agricultural film, liner', c='RoHS;REACH', o='Saudi Arabia', s='on_request'),
 dict(g='FD21HS', b='Qilu', p='LLDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.918, ts=13, el=830, fm=255, hd='Shore D 50', hdt=46, vi=97, mp=119, tr=86, hz=10, gl=62, wa=0.01, f='high strength;anti blocking', ap='General film, packaging bag', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='6101R', b='ExxonMobil', p='LLDPE', pr='roto', mfr=5.0, mc='190°C/2.16kg', d=0.936, ts=16, el=700, fm=500, iz=25.0, ch=30.0, hd='Shore D 55', hdt=52, vi=105, mp=122, wa=0.01, f='high impact;weather resistant', ap='Rotomolding tank, water tank, playground', c='RoHS;REACH', o='Singapore', s='on_request'),
 dict(g='8320', b='ExxonMobil', p='LLDPE', pr='injection', mfr=20, mc='190°C/2.16kg', d=0.924, ts=11, el=600, fm=350, iz=12.0, ch=14.0, hd='Shore D 52', hdt=48, vi=100, mp=120, wa=0.01, f='high flow;high impact', ap='Cap, closure, masterbatch carrier', c='RoHS;REACH', o='Singapore', s='on_request'),
 dict(g='7047', b='Sinopec', p='LLDPE', pr='film', mfr=1.0, mc='190°C/2.16kg', d=0.918, ts=14, el=870, fm=270, hd='Shore D 52', hdt=48, vi=99, mp=120, tr=86, hz=10, gl=62, wa=0.01, f='high strength;high impact', ap='Stretch film, cling film, heavy bag', c='RoHS;REACH', o='China', s='in_stock'),
]

# ---------------------------------------------------------------- ABS
ABS = [
 dict(g='HI-121H', b='LG Chem', p='ABS', pr='injection', mfr=22, mc='220°C/10kg', d=1.05, ts=50, el=10, fm=2550, fs=82, iz=27, ch=22.0, hd='R 110', hdt=85, vi=93, gl=95, wa=0.30, f='high impact;high gloss', ap='TV housing, vacuum cleaner, helmet, toy', c='RoHS;REACH;UL', o='Korea', s='in_stock'),
 dict(g='121H', b='CHIMEI', p='ABS', pr='injection;extrusion', mfr=1.5, mc='200°C/5kg', d=1.05, ts=47, el=30, fm=2500, fs=72, iz=22.0, ch=24.0, hd='R 110', hdt=94, vi=100, gl=96, wa=0.30, f='high impact;high gloss', ap='Appliance housing, luggage, toy, sheet', c='RoHS;REACH', o='Taiwan, China', s='on_request'),
 dict(g='PA-757', b='CHIMEI', p='ABS', pr='injection', mfr=1.6, mc='200°C/5kg', d=1.05, ts=45.1, el=25, fm=2650, fs=77.5, iz=18, ch=20, hd='R 116', hdt=95, vi=105, gl=96, wa=0.30, f='high impact;high gloss', ap='Computer housing, appliance, office device', c='RoHS;REACH;UL', o='Taiwan, China', s='in_stock'),
 dict(g='PA-707', b='CHIMEI', p='ABS', pr='injection', mfr=1.7, mc='200°C/5kg', d=1.06, ts=48, el=20, fm=2842, fs=84, iz=15, ch=22.0, hd='R 116', hdt=95, vi=105, gl=95, wa=0.30, f='high flow;high gloss', ap='Thin-wall housing, toy, household article', c='RoHS;REACH', o='Taiwan, China', s='in_stock'),
 dict(g='PA-747S', b='CHIMEI', p='ABS', pr='extrusion;thermoform', mfr=0.5, mc='200°C/5kg', d=1.03, ts=38.2, el=40, fm=2060, fs=60.8, iz=39, ch=33.0, hd='R 102', hdt=95, vi=103, gl=88, wa=0.30, f='high impact;high strength', ap='Sheet, refrigerator liner, luggage shell', c='RoHS;REACH', o='Taiwan, China', s='on_request'),
 dict(g='PA-709', b='CHIMEI', p='ABS', pr='extrusion', mfr=0.60, mc='220°C/10kg', d=1.04, ts=38, el=40, fm=2100, fs=60, iz=35.0, ch=38.0, hd='R 98', hdt=86, vi=95, gl=86, wa=0.30, f='high impact;high strength', ap='Extruded sheet, pipe, profile, board', c='RoHS;REACH', o='Taiwan, China', s='on_request'),
 dict(g='AG15E1', b='Formosa', p='ABS', pr='injection', mfr=2.4, mc='200°C/5kg', d=1.05, ts=48, el=25, fm=2548, fs=83, iz=19, ch=16, hd='R 111', hdt=86, vi=95, gl=94, wa=0.30, f='high impact;high gloss', ap='Appliance housing, electronics, toy', c='RoHS;REACH', o='Taiwan, China', s='in_stock'),
 dict(g='AG15A1', b='Formosa', p='ABS', pr='injection', mfr=2.2, mc='200°C/5kg', d=1.05, ts=45, el=25, fm=2548, fs=80, iz=25, ch=22.0, hd='R 110', hdt=88, vi=100, gl=95, wa=0.30, f='high impact;high gloss;high stiffness', ap='Monitor housing, printer, keyboard', c='RoHS;REACH;UL', o='Taiwan, China', s='in_stock'),
 dict(g='757K', b='CHIMEI Zhenjiang', p='ABS', pr='injection', mfr=1.8, mc='200°C/5kg', d=1.05, ts=47, el=20, fm=2650, fs=77, iz=20.0, ch=22.0, hd='R 116', hdt=99, vi=105, wa=0.30, f='high flow;high gloss', ap='Household appliance, toy, thin-wall part', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='D-120', b='Guohan', p='ABS', pr='injection', mfr=5.0, mc='220°C/10kg', d=1.05, ts=44, el=25, fm=2300, fs=68, iz=19.0, ch=21.0, hd='R 106', hdt=88, vi=96, gl=93, wa=0.30, f='high flow;high gloss', ap='Appliance part, toy, stationery', c='RoHS;REACH', o='Taiwan, China', s='on_request'),
 dict(g='0215A', b='Jihua', p='ABS', pr='injection', mfr=21, mc='220°C/10kg', d=1.05, ts=45, el=20, fm=2300, fs=74, iz=16.0, ch=20, hd='R 107', hdt=90, vi=96, gl=92, wa=0.30, f='high flow;high gloss', ap='Thin-wall housing, complex part, toy', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='8391', b='Gaoqiao', p='ABS', pr='injection', mfr=12, mc='220°C/10kg', d=1.05, ts=43, el=22, fm=2350, fs=66, iz=18.0, ch=20.0, hd='R 104', hdt=86, vi=94, gl=93, wa=0.30, f='high flow;high gloss', ap='Electronics housing, household appliance', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='XR-401', b='LG Chem', p='ABS', pr='injection', mfr=6, mc='220°C/10kg', d=1.06, ts=48, el=20, fm=2500, fs=75, iz=15.0, ch=17.0, hd='R 112', hdt=100, vi=106, gl=93, wa=0.30, f='heat resistant;high impact', ap='Automotive interior, heater housing, microwave part', c='RoHS;REACH;UL', o='Korea', s='on_request', r='Heat resistant ABS, HDT approx 100 °C.'),
 dict(g='XR-409H', b='LG Chem', p='ABS', pr='injection', mfr=5, mc='220°C/10kg', d=1.06, ts=50, el=18, fm=2600, fs=78, iz=13.0, ch=15.0, hd='R 113', hdt=105, vi=110, gl=92, wa=0.30, f='heat resistant;high stiffness', ap='Automotive dashboard, radiator grille, lamp housing', c='RoHS;REACH;UL', o='Korea', s='on_request', r='High heat ABS, HDT approx 105 °C.'),
 dict(g='AF-312', b='LG Chem', p='ABS', pr='injection', mfr=20, mc='220°C/10kg', d=1.18, ts=42, el=20, fm=2300, fs=68, iz=15.0, ch=17.0, hd='R 105', hdt=82, vi=92, gl=90, wa=0.30, f='flame retardant;high flow', ap='TV housing, monitor, charger housing, socket', c='RoHS;REACH;UL94 V-0', o='Korea', s='on_request', r='Flame retardant ABS, UL94 V-0 class.'),
 dict(g='TR-557', b='LG Chem', p='ABS', pr='injection', mfr=2.5, mc='220°C/10kg', d=1.08, ts=40, el=25, fm=2100, fs=60, iz=18.0, ch=20.0, hd='R 100', hdt=85, vi=93, tr=88, hz=6, gl=94, wa=0.30, f='transparent;high impact', ap='Transparent housing, cosmetic case, display part', c='RoHS;REACH', o='Korea', s='on_request'),
 dict(g='HI-100', b='LG Chem', p='ABS', pr='injection', mfr=11, mc='220°C/10kg', d=1.02, ts=37, el=10, fm=1862, fs=57, iz=45, ch=25.0, hd='R 92', hdt=84, vi=90, gl=92, wa=0.30, f='high impact;high gloss', ap='Vacuum cleaner, speaker, helmet', c='RoHS;REACH', o='Korea', s='on_request'),
 dict(g='MP-0160R', b='LG Chem', p='ABS', pr='injection', mfr=6, mc='220°C/10kg', d=1.06, ts=45, el=22, fm=2400, fs=70, iz=18.0, ch=20.0, hd='R 108', hdt=90, vi=97, gl=96, wa=0.30, f='medical grade;high gloss', ap='Medical device housing, diagnostic equipment', c='RoHS;REACH;ISO 10993', o='Korea', s='on_request'),
]

# ---------------------------------------------------------------- PS
PS = [
 dict(g='525', b='CHIMEI', p='PS', pr='injection', mfr=8, mc='200°C/5kg', d=1.05, ts=45, el=3, fm=3200, fs=70, iz=1.5, ch=2.0, hd='M 78', hdt=82, vi=92, tr=89, hz=2, gl=98, wa=0.03, f='transparent;high flow', ap='Disposable cup, cutlery, blister pack, toy', c='RoHS;REACH;FDA', o='Taiwan, China', s='in_stock'),
 dict(g='535', b='CHIMEI', p='PS', pr='injection', mfr=4, mc='200°C/5kg', d=1.05, ts=48, el=3, fm=3300, fs=75, iz=1.5, ch=2.0, hd='M 80', hdt=85, vi=95, tr=89, hz=2, gl=98, wa=0.03, f='transparent;high stiffness', ap='Cosmetic case, stationery, display item', c='RoHS;REACH;FDA', o='Taiwan, China', s='in_stock'),
 dict(g='PG-33', b='Formosa', p='PS', pr='injection', mfr=8, mc='200°C/5kg', d=1.05, ts=45, el=3, fm=3200, fs=70, iz=1.5, ch=2.0, hd='M 78', hdt=82, vi=92, tr=89, hz=2, gl=98, wa=0.03, f='transparent;high flow', ap='Food container, cup, blister, toy', c='RoHS;REACH;FDA', o='Taiwan, China', s='in_stock'),
 dict(g='123P', b='SECCO', p='PS', pr='injection', mfr=8, mc='200°C/5kg', d=1.05, ts=46, el=3, fm=3200, fs=72, iz=1.5, ch=2.0, hd='M 78', hdt=84, vi=93, tr=89, hz=2, gl=98, wa=0.03, f='transparent;high flow', ap='Disposable tableware, cup, packaging', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='158K', b='BASF', p='PS', pr='injection;extrusion', mfr=2.5, mc='200°C/5kg', d=1.05, ts=50, el=3, fm=3400, fs=78, iz=1.5, ch=2.0, hd='M 82', hdt=88, vi=98, tr=90, hz=1.5, gl=99, wa=0.03, f='transparent;high stiffness;heat resistant', ap='Sheet, display board, medical labware', c='RoHS;REACH;FDA', o='Germany', s='on_request'),
 dict(g='PH-88', b='CHIMEI', p='PS', pr='injection', mfr=6, mc='200°C/5kg', d=1.05, ts=27, el=45, fm=2200, fs=45, iz=10.0, ch=12.0, hd='L 70', hdt=78, vi=88, wa=0.05, f='high impact', ap='TV housing, refrigerator liner, toy', c='RoHS;REACH', o='Taiwan, China', s='in_stock', r='HIPS grade.'),
 dict(g='PH-888G', b='CHIMEI', p='PS', pr='injection;extrusion', mfr=4, mc='200°C/5kg', d=1.05, ts=25, el=50, fm=2100, fs=42, iz=11.0, ch=13.0, hd='L 68', hdt=76, vi=86, wa=0.05, f='high impact;high stiffness', ap='Sheet, thermoformed tray, refrigerator liner', c='RoHS;REACH;FDA', o='Taiwan, China', s='in_stock', r='HIPS grade.'),
 dict(g='476L', b='BASF-YPC', p='PS', pr='extrusion;thermoform', mfr=5, mc='200°C/5kg', d=1.05, ts=26, el=50, fm=2100, fs=44, iz=11.0, ch=13.0, hd='L 68', hdt=76, vi=87, wa=0.05, f='high impact', ap='Thermoformed sheet, food tray, cup', c='RoHS;REACH;FDA', o='China', s='in_stock', r='HIPS grade.'),
 dict(g='622P', b='SECCO', p='PS', pr='injection', mfr=4, mc='200°C/5kg', d=1.05, ts=28, el=45, fm=2200, fs=46, iz=10.0, ch=12.0, hd='L 70', hdt=78, vi=88, wa=0.05, f='high impact;high gloss', ap='Appliance housing, toy, household article', c='RoHS;REACH', o='China', s='in_stock', r='HIPS grade.'),
 dict(g='825', b='CHIMEI', p='PS', pr='injection', mfr=8, mc='200°C/5kg', d=1.04, ts=24, el=40, fm=2000, fs=40, iz=9.0, ch=10.0, hd='L 65', hdt=74, vi=85, wa=0.05, f='high impact;high flow', ap='Thin-wall container, cup, toy', c='RoHS;REACH', o='Taiwan, China', s='on_request', r='HIPS grade.'),
 dict(g='466F', b='BASF', p='PS', pr='extrusion', mfr=3, mc='200°C/5kg', d=1.05, ts=27, el=48, fm=2150, fs=44, iz=11.5, ch=13.5, hd='L 69', hdt=77, vi=87, wa=0.05, f='high impact', ap='Sheet, signage board, thermoforming', c='RoHS;REACH', o='Germany', s='on_request', r='HIPS grade.'),
 dict(g='680A', b='BASF-YPC', p='PS', pr='foam', mfr=2.5, mc='200°C/5kg', d=1.05, ts=30, el=35, fm=2400, fs=50, iz=8.0, ch=9.0, hd='L 72', hdt=80, vi=90, wa=0.05, f='high impact;heat resistant', ap='XPS foam board, insulation board', c='RoHS;REACH', o='China', s='on_request'),
]

# ---------------------------------------------------------------- PC
PC = [
 dict(g='PC-110', b='CHIMEI', p='PC', pr='injection', mfr=10, mc='300°C/1.2kg', d=1.20, ts=62, el=90, fm=2350, fs=90, iz=65.0, ch=70.0, hd='M 70', hdt=130, vi=145, tr=89, hz=1.2, gl=95, wa=0.23, f='transparent;high impact;heat resistant', ap='Electronic housing, optical part, safety helmet', c='RoHS;REACH;UL', o='Taiwan, China', s='in_stock'),
 dict(g='PC-115', b='CHIMEI', p='PC', pr='injection', mfr=15, mc='300°C/1.2kg', d=1.20, ts=60, el=85, fm=2300, fs=88, iz=60.0, ch=65.0, hd='M 68', hdt=128, vi=143, tr=89, hz=1.5, gl=95, wa=0.23, f='transparent;high impact;high flow', ap='Thin-wall part, lens cover, connector', c='RoHS;REACH;UL', o='Taiwan, China', s='in_stock'),
 dict(g='2805', b='Covestro', p='PC', pr='injection;extrusion', mfr=10, mc='300°C/1.2kg', d=1.20, ts=65, el=90, fm=2400, fs=92, iz=70.0, ch=75.0, hd='M 72', hdt=132, vi=146, tr=89, hz=1.0, gl=96, wa=0.23, f='transparent;high impact;heat resistant', ap='Automotive lamp, medical device, sheet, glazing', c='RoHS;REACH;UL', o='Germany', s='on_request'),
 dict(g='2405', b='Covestro', p='PC', pr='injection', mfr=20, mc='300°C/1.2kg', d=1.20, ts=62, el=85, fm=2350, fs=90, iz=65.0, ch=70.0, hd='M 70', hdt=128, vi=144, tr=89, hz=1.2, gl=96, wa=0.23, f='transparent;high flow;high impact', ap='Thin-wall housing, connector, LED cover', c='RoHS;REACH;UL', o='Germany', s='on_request'),
 dict(g='S-3000R', b='Mitsubishi', p='PC', pr='injection', mfr=10, mc='300°C/1.2kg', d=1.20, ts=64, el=95, fm=2400, fs=91, iz=68.0, ch=73.0, hd='M 71', hdt=130, vi=145, tr=89, hz=1.2, gl=95, wa=0.23, f='transparent;high impact;heat resistant', ap='Optical disc, lens, electronic housing', c='RoHS;REACH;UL', o='Japan', s='on_request'),
 dict(g='L-1250Y', b='Teijin', p='PC', pr='injection', mfr=12, mc='300°C/1.2kg', d=1.20, ts=63, el=90, fm=2350, fs=90, iz=66.0, ch=71.0, hd='M 70', hdt=129, vi=144, tr=89, hz=1.3, gl=95, wa=0.23, f='transparent;high impact;high flow', ap='LED lens, light guide, medical part', c='RoHS;REACH;UL', o='Japan', s='on_request'),
 dict(g='1100', b='Lotte', p='PC', pr='injection;extrusion', mfr=10, mc='300°C/1.2kg', d=1.20, ts=62, el=88, fm=2350, fs=89, iz=64.0, ch=69.0, hd='M 70', hdt=130, vi=145, tr=89, hz=1.3, gl=94, wa=0.23, f='transparent;high impact;weather resistant', ap='Sheet, glazing, greenhouse panel, housing', c='RoHS;REACH;UL', o='Korea', s='on_request'),
 dict(g='PC-110U', b='CHIMEI', p='PC', pr='injection;extrusion', mfr=10, mc='300°C/1.2kg', d=1.20, ts=62, el=90, fm=2350, fs=90, iz=65.0, ch=70.0, hd='M 70', hdt=130, vi=145, tr=88, hz=1.5, gl=93, wa=0.23, f='transparent;uv resistant;weather resistant', ap='Outdoor luminaire, skylight, noise barrier', c='RoHS;REACH;UL', o='Taiwan, China', s='on_request'),
]

# ---------------------------------------------------------------- PET
PET = [
 dict(g='CZ-302', b='Sanfangxiang', p='PET', pr='blow', d=1.40, ts=55, el=60, mp=250, wa=0.30, f='food grade;transparent', ap='Mineral water bottle, beverage bottle, preform', c='RoHS;REACH;FDA', o='China', s='in_stock', r='Bottle grade, intrinsic viscosity 0.80 dL/g.'),
 dict(g='CZ-318', b='Sanfangxiang', p='PET', pr='blow', d=1.40, ts=58, el=55, mp=252, wa=0.30, f='food grade;transparent', ap='CSD bottle, hot-fill juice bottle, preform', c='RoHS;REACH;FDA', o='China', s='in_stock', r='Bottle grade, intrinsic viscosity 0.84 dL/g.'),
 dict(g='CB-608S', b='Yisheng', p='PET', pr='blow', d=1.40, ts=57, el=58, mp=251, wa=0.30, f='food grade;transparent', ap='Carbonated drink bottle, large bottle', c='RoHS;REACH;FDA', o='China', s='in_stock', r='Bottle grade, intrinsic viscosity 0.84 dL/g.'),
 dict(g='WK-801', b='Wankai', p='PET', pr='blow', d=1.40, ts=56, el=60, mp=250, wa=0.30, f='food grade;transparent', ap='Water bottle, edible oil bottle, preform', c='RoHS;REACH;FDA', o='China', s='in_stock', r='Bottle grade, intrinsic viscosity 0.80 dL/g.'),
 dict(g='SD-500', b='Sanfangxiang', p='PET', pr='fiber', d=1.38, ts=60, el=40, mp=255, wa=0.40, f='high strength', ap='Polyester staple fiber, textile, filling', c='RoHS;REACH', o='China', s='on_request', r='Fiber grade, intrinsic viscosity 0.64 dL/g.'),
 dict(g='BG-80', b='Sanfangxiang', p='PET', pr='sheet', d=1.38, ts=55, el=80, mp=250, tr=88, wa=0.30, f='transparent;food grade', ap='APET sheet, blister packaging, food tray', c='RoHS;REACH;FDA', o='China', s='on_request', r='Sheet grade, intrinsic viscosity 0.80 dL/g.'),
]

# ---------------------------------------------------------------- PA
PA = [
 dict(g='1013B', b='UBE', p='PA6', pr='injection', d=1.14, ts=75, el=150, fm=2800, fs=110, iz=6.0, ch=8.0, hd='R 120', hdt=70, vi=200, mp=220, wa=1.80, f='high impact;high strength', ap='Automotive part, gear, bearing, cable tie', c='RoHS;REACH;UL', o='Japan', s='on_request', r='Relative viscosity 2.7 (96% H2SO4).'),
 dict(g='B3S', b='BASF', p='PA6', pr='injection', d=1.13, ts=80, el=100, fm=3000, fs=120, iz=5.0, ch=7.0, hd='R 121', hdt=75, vi=205, mp=220, wa=1.80, f='high flow;high stiffness', ap='Connector, fastener, thin-wall technical part', c='RoHS;REACH;UL', o='Germany', s='on_request'),
 dict(g='YH800', b='Yueyang', p='PA6', pr='injection;fiber', d=1.14, ts=72, el=160, fm=2700, fs=105, iz=6.5, ch=8.5, hd='R 118', hdt=68, vi=195, mp=219, wa=1.80, f='high strength;high impact', ap='Engineering part, monofilament, fishing line', c='RoHS;REACH', o='China', s='in_stock', r='Relative viscosity 2.8.'),
 dict(g='EPR27', b='Shenma', p='PA66', pr='injection;fiber', d=1.14, ts=85, el=30, fm=3200, fs=130, iz=5.0, ch=6.5, hd='R 121', hdt=90, vi=240, mp=260, wa=1.50, f='high strength;heat resistant', ap='Automotive under-hood part, radiator tank, gear', c='RoHS;REACH;UL', o='China', s='in_stock', r='Relative viscosity 2.7.'),
 dict(g='21SPC', b='Ascend', p='PA66', pr='injection', d=1.14, ts=83, el=35, fm=3100, fs=125, iz=5.5, ch=7.0, hd='R 120', hdt=85, vi=235, mp=258, wa=1.50, f='high strength;heat resistant', ap='Automotive part, electrical connector, zip tie', c='RoHS;REACH;UL', o='USA', s='on_request'),
 dict(g='A3K', b='BASF', p='PA66', pr='injection', d=1.14, ts=82, el=40, fm=3000, fs=122, iz=6.0, ch=7.5, hd='R 119', hdt=80, vi=230, mp=258, wa=1.50, f='high flow;heat resistant', ap='Thin-wall technical part, connector, clip', c='RoHS;REACH;UL', o='Germany', s='on_request'),
]

# ---------------------------------------------------------------- POM
POM = [
 dict(g='M90-44', b='Polyplastics', p='POM', pr='injection', mfr=9, mc='190°C/2.16kg', d=1.41, ts=62, el=40, fm=2600, fs=88, iz=7.0, ch=8.0, hd='M 80', hdt=110, vi=158, mp=165, wa=0.22, f='high stiffness;high strength', ap='Gear, bearing, zipper, automotive clip', c='RoHS;REACH;UL', o='Japan', s='on_request'),
 dict(g='F20-03', b='Yuntianhua', p='POM', pr='injection', mfr=9, mc='190°C/2.16kg', d=1.41, ts=60, el=40, fm=2500, fs=85, iz=6.5, ch=8.0, hd='M 78', hdt=105, vi=155, mp=164, wa=0.22, f='high stiffness;high strength', ap='Gear, bushing, valve part, zipper', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='500P', b='DuPont', p='POM', pr='injection', mfr=14, mc='190°C/2.16kg', d=1.42, ts=68, el=35, fm=2900, fs=96, iz=7.5, ch=9.0, hd='M 82', hdt=115, vi=160, mp=170, wa=0.22, f='high stiffness;high strength', ap='Precision gear, bearing, automotive part', c='RoHS;REACH;UL', o='USA', s='on_request'),
 dict(g='FM090', b='Formosa', p='POM', pr='injection', mfr=9, mc='190°C/2.16kg', d=1.41, ts=62, el=40, fm=2600, fs=88, iz=7.0, ch=8.0, hd='M 80', hdt=110, vi=158, mp=165, wa=0.22, f='high stiffness;high strength', ap='Gear, buckle, sprayer, mechanical part', c='RoHS;REACH', o='Taiwan, China', s='on_request'),
 dict(g='MC90', b='Yuntianhua', p='POM', pr='injection', mfr=9, mc='190°C/2.16kg', d=1.41, ts=61, el=42, fm=2550, fs=86, iz=7.0, ch=8.5, hd='M 79', hdt=108, vi=156, mp=165, wa=0.22, f='high stiffness;high strength', ap='General engineering part, slide, fastener', c='RoHS;REACH', o='China', s='in_stock'),
]

# ---------------------------------------------------------------- EVA
EVA = [
 dict(g='18-3', b='Yanshan', p='EVA', pr='film;foam', mfr=3.0, mc='190°C/2.16kg', d=0.940, ts=18, el=700, fm=60, hd='Shore A 92', mp=88, wa=0.05, f='high impact;low temp', ap='Foam shoe sole, solar film, hot melt adhesive', c='RoHS;REACH', o='China', s='in_stock', r='VA content 18%.'),
 dict(g='14-2', b='Yanshan', p='EVA', pr='foam;film', mfr=2.0, mc='190°C/2.16kg', d=0.935, ts=16, el=700, fm=50, hd='Shore A 90', mp=90, wa=0.05, f='high impact;low temp', ap='Foam sheet, shoe midsole, packaging foam', c='RoHS;REACH', o='China', s='in_stock', r='VA content 14%.'),
 dict(g='7350M', b='Formosa', p='EVA', pr='foam;injection', mfr=2.5, mc='190°C/2.16kg', d=0.938, ts=17, el=750, fm=55, hd='Shore A 91', mp=88, wa=0.05, f='high impact;low temp', ap='Shoe sole, foam board, sport equipment', c='RoHS;REACH', o='Taiwan, China', s='on_request', r='VA content 18%.'),
 dict(g='V5110J', b='BASF-YPC', p='EVA', pr='film', mfr=2.5, mc='190°C/2.16kg', d=0.940, ts=18, el=700, fm=60, hd='Shore A 92', mp=88, wa=0.05, f='transparent;high impact', ap='Greenhouse film, photovoltaic encapsulant film', c='RoHS;REACH', o='China', s='in_stock', r='VA content 18%.'),
 dict(g='UE639', b='USI', p='EVA', pr='foam;injection', mfr=2.0, mc='190°C/2.16kg', d=0.937, ts=16, el=720, fm=52, hd='Shore A 90', mp=89, wa=0.05, f='high impact;low temp', ap='Sandal, slipper, foam product', c='RoHS;REACH', o='Taiwan, China', s='on_request', r='VA content 16%.'),
]

# ---------------------------------------------------------------- PMMA
PMMA = [
 dict(g='CM-205', b='CHIMEI', p='PMMA', pr='injection', mfr=1.8, mc='230°C/3.8kg', d=1.19, ts=68, el=5, fm=3200, fs=105, iz=2.0, ch=2.2, hd='M 90', hdt=95, vi=110, tr=92, hz=0.5, gl=98, wa=0.40, f='transparent;weather resistant;high gloss', ap='Lamp cover, optical lens, display panel, signage', c='RoHS;REACH;UL', o='Taiwan, China', s='on_request'),
 dict(g='CM-211', b='CHIMEI', p='PMMA', pr='injection', mfr=14, mc='230°C/3.8kg', d=1.19, ts=62, el=4, fm=3000, fs=95, iz=1.8, ch=2.0, hd='M 85', hdt=88, vi=102, tr=92, hz=0.5, gl=98, wa=0.40, f='transparent;high flow;high gloss', ap='Thin-wall lens, light guide, cosmetic case', c='RoHS;REACH', o='Taiwan, China', s='on_request'),
 dict(g='8N', b='Evonik', p='PMMA', pr='injection;extrusion', mfr=2.0, mc='230°C/3.8kg', d=1.19, ts=70, el=5, fm=3300, fs=108, iz=2.0, ch=2.2, hd='M 92', hdt=100, vi=112, tr=92, hz=0.4, gl=99, wa=0.40, f='transparent;weather resistant;heat resistant', ap='Sheet, aircraft glazing, sanitary ware, lens', c='RoHS;REACH;UL', o='Germany', s='on_request'),
]

# ---------------------------------------------------------------- PVC
PVC = [
 dict(g='SG-5', b='Sinopec', p='PVC', pr='pipe;extrusion', d=1.40, ts=52, el=150, fm=3000, fs=80, wa=0.05, f='flame retardant;weather resistant', ap='Pipe, profile, window frame, conduit, board', c='RoHS;REACH', o='China', s='in_stock', r='Suspension PVC resin, K-value 66-68, apparent density 0.55 g/ml.'),
 dict(g='SG-3', b='Sinopec', p='PVC', pr='extrusion', d=1.40, ts=50, el=200, fm=2800, fs=75, wa=0.05, f='flame retardant;high flow', ap='Soft film, cable insulation, hose, leather cloth', c='RoHS;REACH', o='China', s='in_stock', r='Suspension PVC resin, K-value 71-72, apparent density 0.50 g/ml.'),
 dict(g='SG-7', b='Sinopec', p='PVC', pr='injection;extrusion', d=1.40, ts=54, el=120, fm=3200, fs=85, wa=0.05, f='flame retardant;high flow', ap='Injection fitting, rigid foam board, calendered sheet', c='RoHS;REACH', o='China', s='in_stock', r='Suspension PVC resin, K-value 62-64, apparent density 0.58 g/ml.'),
 dict(g='S-1000', b='Sinopec', p='PVC', pr='pipe;extrusion', d=1.40, ts=52, el=160, fm=3000, fs=80, wa=0.05, f='flame retardant;weather resistant', ap='Pressure pipe, profile, transparent sheet', c='RoHS;REACH', o='China', s='in_stock', r='Ethylene-based PVC resin, K-value 66-68.'),
]

# ---------------------------------------------------------------- 补充：同牌号不同厂家变体
# 同一牌号在国内由多家厂生产，贸易商也按厂家分开报价，买家常按厂家找货。
VAR = [
 dict(g='T30S', b='ZPC', p='PP', pr='raffia', mfr=3.5, mc='230°C/2.16kg', d=0.905, ts=33, el=400, fm=1500, fs=38, iz=4.0, ch=4.5, hd='R 100', hdt=105, vi=152, mp=165, wa=0.02, f='homopolymer;high strength', ap='Woven bags, raffia tape, rope', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='T30S', b='Maoming Petrochemical', p='PP', pr='raffia', mfr=3.4, mc='230°C/2.16kg', d=0.904, ts=33, el=390, fm=1480, fs=37, iz=4.1, ch=4.6, hd='R 100', hdt=104, vi=151, mp=165, wa=0.02, f='homopolymer;high strength', ap='Woven bags, raffia tape, twine', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='S1003', b='Shanghai Petrochemical', p='PP', pr='raffia', mfr=3.2, mc='230°C/2.16kg', d=0.905, ts=34, el=360, fm=1550, fs=40, iz=4.5, ch=5.0, hd='R 102', hdt=108, vi=154, mp=166, wa=0.02, f='homopolymer;high stiffness', ap='Woven jumbo bag fabric, tape yarn', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='045', b='Qilu', p='PP', pr='raffia', mfr=3.0, mc='230°C/2.16kg', d=0.905, ts=34, el=410, fm=1580, fs=40, iz=4.5, ch=5.0, hd='R 101', hdt=106, vi=153, mp=166, wa=0.02, f='homopolymer;high strength', ap='Woven bag, packing tape', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='F401', b='Yangzi', p='PP', pr='raffia', mfr=2.5, mc='230°C/2.16kg', d=0.905, ts=35, el=450, fm=1600, fs=41, iz=4.8, ch=5.2, hd='R 102', hdt=108, vi=154, mp=166, wa=0.02, f='homopolymer;high strength', ap='Woven bag, heavy duty raffia', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='2401', b='Yanshan', p='PP', pr='raffia', mfr=3.0, mc='230°C/2.16kg', d=0.905, ts=33, el=400, fm=1500, fs=38, iz=4.2, ch=4.8, hd='R 100', hdt=105, vi=152, mp=165, wa=0.02, f='homopolymer;high strength', ap='Woven bag, rope, belt', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='1080', b='Sinopec', p='PP', pr='raffia', mfr=10, mc='230°C/2.16kg', d=0.905, ts=32, el=150, fm=1500, fs=37, iz=3.5, ch=4.0, hd='R 100', hdt=103, vi=150, mp=165, wa=0.02, f='homopolymer;high flow', ap='High-speed raffia line, thin tape', c='RoHS;REACH', o='China', s='on_request'),
 dict(g='V30G', b='Sinopec', p='PP', pr='injection', mfr=16, mc='230°C/2.16kg', d=0.900, ts=32, el=60, fm=1700, fs=42, iz=2.8, ch=3.0, hd='R 106', hdt=110, vi=155, mp=167, wa=0.02, f='homopolymer;high flow;nucleated', ap='Houseware, closure, thin-wall part', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='M1600', b='Sinopec', p='PP', pr='injection', mfr=16, mc='230°C/2.16kg', d=0.900, ts=30, el=70, fm=1650, fs=41, iz=3.0, ch=3.2, hd='R 104', hdt=108, vi=154, mp=167, wa=0.02, f='homopolymer;high flow;high stiffness', ap='Household article, furniture, toy', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='EPC30R', b='Sinopec', p='PP', pr='injection', mfr=7.0, mc='230°C/2.16kg', d=0.900, ts=26, el=220, fm=1300, fs=33, iz=9.5, ch=11.0, hd='R 94', hdt=99, vi=149, mp=165, wa=0.02, f='copolymer;high impact', ap='Automotive part, appliance, crate', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='K8003', b='ZPC', p='PP', pr='injection', mfr=8, mc='230°C/2.16kg', d=0.900, ts=25, el=200, fm=1300, fs=32, iz=9.0, ch=10.0, hd='R 95', hdt=100, vi=150, mp=165, wa=0.02, f='copolymer;high impact', ap='Automotive parts, appliance housing', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='K8003', b='Yanshan', p='PP', pr='injection', mfr=8, mc='230°C/2.16kg', d=0.900, ts=25, el=190, fm=1280, fs=32, iz=8.8, ch=10.0, hd='R 94', hdt=99, vi=149, mp=164, wa=0.02, f='copolymer;high impact', ap='Battery case, appliance, crate', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='K7726H', b='ZPC', p='PP', pr='injection', mfr=26, mc='230°C/2.16kg', d=0.900, ts=22, el=120, fm=1200, fs=30, iz=8.0, ch=9.0, hd='R 92', hdt=95, vi=146, mp=164, wa=0.02, f='copolymer;high flow;high impact', ap='Thin-wall packaging, houseware', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='K8303', b='Yanshan', p='PP', pr='injection', mfr=1.8, mc='230°C/2.16kg', d=0.900, ts=27, el=300, fm=1350, fs=34, iz=14.0, ch=16.0, hd='R 90', hdt=95, vi=145, mp=164, wa=0.02, f='copolymer;high impact;low temp', ap='Bumper, pallet box, crate', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='RP340R', b='Sinopec', p='PP', pr='injection', mfr=25, mc='230°C/2.16kg', d=0.900, ts=27, el=150, fm=1150, fs=30, iz=6.0, ch=7.0, hd='R 88', hdt=90, vi=138, mp=160, tr=90, hz=8, gl=92, wa=0.02, f='transparent;high flow;food grade', ap='Transparent cup, food container, lid', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='R520Y', b='Sinopec', p='PP', pr='blow', mfr=1.8, mc='230°C/2.16kg', d=0.900, ts=29, el=300, fm=1100, fs=28, iz=8.0, ch=9.0, hd='R 85', hdt=88, vi=135, mp=158, tr=91, hz=9, gl=90, wa=0.02, f='transparent;food grade', ap='Transparent bottle, cosmetic jar', c='RoHS;REACH;FDA', o='China', s='on_request'),
 dict(g='MT18', b='Sinopec', p='PP', pr='injection', mfr=18, mc='230°C/2.16kg', d=0.900, ts=30, el=70, fm=1500, fs=38, iz=3.5, ch=4.0, hd='R 103', hdt=108, vi=153, mp=166, wa=0.02, f='medical grade;high flow', ap='Syringe, infusion set, labware', c='RoHS;REACH;ISO 10993', o='China', s='on_request'),
 dict(g='PPH-F03D', b='Sinopec', p='PP', pr='film', mfr=3.0, mc='230°C/2.16kg', d=0.905, ts=34, el=450, fm=1550, fs=39, iz=4.0, ch=4.4, hd='R 100', hdt=104, vi=152, mp=165, hz=1.5, gl=92, wa=0.02, f='homopolymer;high stiffness', ap='BOPP film, printing film, tape film', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='HP500N', b='LyondellBasell', p='PP', pr='injection', mfr=12, mc='230°C/2.16kg', d=0.900, ts=32, el=70, fm=1650, fs=41, iz=3.0, ch=3.4, hd='R 104', hdt=108, vi=154, mp=167, wa=0.02, f='homopolymer;high stiffness;high flow', ap='Houseware, closure, thin-wall part', c='RoHS;REACH', o='Netherlands', s='on_request'),
 dict(g='RD208CF', b='Borealis', p='PP', pr='film', mfr=8.0, mc='230°C/2.16kg', d=0.900, ts=30, el=400, fm=1200, fs=32, iz=6.0, ch=7.0, hd='R 92', hdt=98, vi=145, mp=160, hz=3, gl=90, wa=0.02, f='transparent;high flow', ap='Cast film, CPP film, lamination film', c='RoHS;REACH', o='Austria', s='on_request'),
 # PE 厂家变体
 dict(g='5000S', b='Yangzi', p='HDPE', pr='raffia;film', mfr=0.90, mc='190°C/2.16kg', d=0.954, ts=28, el=500, fm=1200, fs=25, iz=12.0, ch=15.0, hd='Shore D 65', hdt=70, vi=126, mp=130, wa=0.01, f='high strength;high stiffness', ap='Woven bag, rope, monofilament', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='5000S', b='Qilu', p='HDPE', pr='raffia;film', mfr=0.90, mc='190°C/2.16kg', d=0.954, ts=28, el=480, fm=1180, fs=25, iz=12.0, ch=15.0, hd='Shore D 65', hdt=70, vi=126, mp=130, wa=0.01, f='high strength;high stiffness', ap='Monofilament, rope, net, shopping bag', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='6098', b='Qilu', p='HDPE', pr='injection', mfr=10, mc='190°C/2.16kg', d=0.958, ts=26, el=900, fm=1100, fs=24, iz=6.0, ch=8.0, hd='Shore D 66', hdt=62, vi=122, mp=130, wa=0.01, f='high flow;high stiffness', ap='Crate, turnover box, pail', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='6070', b='Yangzi', p='HDPE', pr='injection', mfr=7, mc='190°C/2.16kg', d=0.960, ts=27, el=800, fm=1200, fs=28, iz=7.0, ch=9.0, hd='Shore D 66', hdt=65, vi=124, mp=131, wa=0.01, f='high flow;high stiffness', ap='Crate, pallet box, industrial part', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='7260', b='Yanshan', p='HDPE', pr='injection', mfr=22, mc='190°C/2.16kg', d=0.955, ts=24, el=700, fm=1000, fs=22, iz=5.0, ch=6.0, hd='Shore D 64', hdt=58, vi=118, mp=129, wa=0.01, f='high flow;high stiffness', ap='Cap, closure, thin-wall cup', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='7000F', b='Yangzi', p='HDPE', pr='film', mfr=0.04, mc='190°C/2.16kg', d=0.952, ts=30, el=600, fm=1000, fs=26, iz=18.0, ch=22.0, hd='Shore D 66', hdt=72, vi=128, mp=132, hz=12, gl=65, wa=0.01, f='high strength;high stiffness', ap='T-shirt bag, shopping bag, garbage bag', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='F600', b='Qilu', p='HDPE', pr='film', mfr=0.05, mc='190°C/2.16kg', d=0.952, ts=32, el=650, fm=1050, fs=27, iz=16.0, ch=20.0, hd='Shore D 66', hdt=73, vi=129, mp=132, hz=11, gl=66, wa=0.01, f='high strength;high stiffness', ap='Thin film, lamination film', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='5502', b='SABIC', p='HDPE', pr='blow', mfr=0.35, mc='190°C/2.16kg', d=0.955, ts=26, el=700, fm=1020, fs=24, iz=15.0, ch=19.0, hd='Shore D 65', hdt=69, vi=125, mp=131, wa=0.01, f='high impact;weather resistant', ap='Household bottle, jerrycan, oil can', c='RoHS;REACH;FDA', o='Saudi Arabia', s='on_request'),
 dict(g='YGH041T', b='Yangzi', p='HDPE', pr='pipe', mfr=0.23, mc='190°C/5kg', d=0.959, ts=25, el=800, fm=1100, fs=24, iz=20.0, ch=25.0, hd='Shore D 65', hdt=70, vi=126, mp=130, wa=0.01, f='high impact;weather resistant', ap='PE100 water pipe, gas pipe', c='RoHS;REACH;ISO 4427', o='China', s='in_stock', r='PE100 bimodal pipe grade, MRS 10 MPa.'),
 dict(g='2426H', b='Qilu', p='LDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.925, ts=12, el=500, fm=250, hd='Shore D 45', hdt=42, vi=92, mp=110, tr=88, hz=8, gl=70, wa=0.01, f='transparent;high strength', ap='Packaging film, bag, lamination', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='2426H', b='Shanghai Petrochemical', p='LDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.925, ts=12, el=520, fm=250, hd='Shore D 45', hdt=42, vi=92, mp=110, tr=88, hz=8, gl=70, wa=0.01, f='transparent;high strength', ap='Packaging film, shrink film', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='2420H', b='Yanshan', p='LDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.924, ts=13, el=550, fm=240, hd='Shore D 45', hdt=42, vi=92, mp=110, tr=89, hz=7, gl=72, wa=0.01, f='transparent', ap='Packaging film, bag', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='1C7A', b='Yanshan', p='LDPE', pr='coating', mfr=7.0, mc='190°C/2.16kg', d=0.918, ts=10, el=500, fm=180, hd='Shore D 42', hdt=38, vi=86, mp=106, wa=0.01, f='high flow;high strength', ap='Extrusion coating, paper lamination', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='1810D', b='Yanshan', p='LDPE', pr='film', mfr=0.30, mc='190°C/2.16kg', d=0.920, ts=15, el=700, fm=260, hd='Shore D 46', hdt=45, vi=95, mp=112, tr=90, hz=6, gl=75, wa=0.01, f='high strength;high impact', ap='Heavy duty bag, shrink film', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='7042', b='ZPC', p='LLDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.918, ts=12, el=800, fm=250, hd='Shore D 50', hdt=45, vi=96, mp=118, tr=86, hz=10, gl=62, wa=0.01, f='high strength;high impact', ap='Packaging film, stretch film, bag', c='RoHS;REACH;FDA', o='China', s='in_stock', r='Butene copolymer LLDPE.'),
 dict(g='7042', b='Yangzi', p='LLDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.918, ts=12, el=790, fm=250, hd='Shore D 50', hdt=45, vi=96, mp=118, tr=86, hz=10, gl=62, wa=0.01, f='high strength;high impact', ap='Packaging film, bag, liner', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='7042', b='Baofeng Energy', p='LLDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.918, ts=12, el=800, fm=245, hd='Shore D 50', hdt=45, vi=96, mp=118, tr=86, hz=10, gl=62, wa=0.01, f='high strength;high impact', ap='Packaging film, agricultural film', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='7050', b='Yanshan', p='LLDPE', pr='film', mfr=1.0, mc='190°C/2.16kg', d=0.918, ts=13, el=850, fm=260, hd='Shore D 51', hdt=46, vi=97, mp=119, tr=86, hz=10, gl=62, wa=0.01, f='high strength;high impact', ap='Heavy duty bag, agricultural film', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='0209AA', b='Yanshan', p='LLDPE', pr='film', mfr=0.9, mc='190°C/2.16kg', d=0.918, ts=14, el=880, fm=270, hd='Shore D 52', hdt=48, vi=99, mp=120, tr=85, hz=11, gl=60, wa=0.01, f='high strength;high impact', ap='Industrial liner, geomembrane', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='0220AA', b='ZPC', p='LLDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.920, ts=13, el=820, fm=260, hd='Shore D 51', hdt=47, vi=98, mp=119, tr=86, hz=10, gl=61, wa=0.01, f='high strength;high impact', ap='General packaging film, stretch hood', c='RoHS;REACH', o='China', s='in_stock'),
 dict(g='218WJ', b='SABIC', p='LLDPE', pr='film', mfr=2.0, mc='190°C/2.16kg', d=0.918, ts=13, el=850, fm=255, hd='Shore D 50', hdt=46, vi=97, mp=119, tr=87, hz=9, gl=63, wa=0.01, f='high strength;anti blocking', ap='Packaging film, lamination film', c='RoHS;REACH', o='Saudi Arabia', s='on_request'),
 # ABS / PS 变体与新牌号
 dict(g='HI-121H', b='LG Ningbo', p='ABS', pr='injection', mfr=22, mc='220°C/10kg', d=1.05, ts=50, el=10, fm=2550, fs=82, iz=27, ch=22.0, hd='R 110', hdt=85, vi=93, gl=95, wa=0.30, f='high impact;high gloss', ap='TV housing, vacuum cleaner, helmet', c='RoHS;REACH;UL', o='China', s='in_stock'),
 dict(g='PA-757', b='CHIMEI Zhenjiang', p='ABS', pr='injection', mfr=1.6, mc='200°C/5kg', d=1.05, ts=45.1, el=25, fm=2650, fs=77.5, iz=18, ch=20, hd='R 116', hdt=95, vi=105, gl=96, wa=0.30, f='high impact;high gloss', ap='Computer housing, appliance, office device', c='RoHS;REACH;UL', o='China', s='in_stock'),
 dict(g='PA-727', b='CHIMEI', p='ABS', pr='injection', mfr=6, mc='220°C/10kg', d=1.05, ts=46, el=25, fm=2450, fs=71, iz=21.0, ch=23.0, hd='R 109', hdt=92, vi=98, gl=96, wa=0.30, f='high gloss;high impact', ap='Plating part, automotive trim, shower head', c='RoHS;REACH', o='Taiwan, China', s='on_request', r='Electroplating grade ABS.'),
 dict(g='PA-765A', b='CHIMEI', p='ABS', pr='injection', mfr=4.6, mc='200°C/5kg', d=1.17, ts=39, el=20, fm=2210, fs=62.5, iz=19, ch=20, hd='R 101', hdt=76, vi=90, gl=90, wa=0.30, f='flame retardant;high gloss', ap='TV housing, socket, charger case', c='RoHS;REACH;UL94 V-0', o='Taiwan, China', s='on_request', r='Flame retardant ABS, UL94 V-0.'),
 dict(g='PA-758', b='CHIMEI', p='ABS', pr='injection', mfr=3.0, mc='200°C/5kg', d=1.08, ts=42, el=40, fm=1900, fs=57, iz=17.0, ch=14, hd='R 107', hdt=77, vi=104, tr=89, hz=5, gl=93, wa=0.30, f='transparent;high impact', ap='Cosmetic case, transparent housing, pen', c='RoHS;REACH', o='Taiwan, China', s='on_request'),
 dict(g='XR-404', b='LG Chem', p='ABS', pr='injection', mfr=6, mc='220°C/10kg', d=1.06, ts=49, el=20, fm=2550, fs=76, iz=14.0, ch=16.0, hd='R 112', hdt=102, vi=108, gl=93, wa=0.30, f='heat resistant;high stiffness', ap='Automotive interior trim, heater housing', c='RoHS;REACH;UL', o='Korea', s='on_request', r='Heat resistant ABS, HDT approx 102 °C.'),
 dict(g='D-180', b='Guohan', p='ABS', pr='injection', mfr=1.8, mc='220°C/10kg', d=1.05, ts=47, el=28, fm=2500, fs=72, iz=21.0, ch=23.0, hd='R 110', hdt=93, vi=99, gl=95, wa=0.30, f='high impact;high gloss', ap='Appliance housing, luggage, toy', c='RoHS;REACH', o='Taiwan, China', s='on_request'),
 dict(g='AG15A1', b='Formosa Ningbo', p='ABS', pr='injection', mfr=2.2, mc='200°C/5kg', d=1.05, ts=45, el=25, fm=2548, fs=80, iz=25, ch=22.0, hd='R 110', hdt=88, vi=100, gl=95, wa=0.30, f='high impact;high gloss;high stiffness', ap='Monitor housing, printer, keyboard', c='RoHS;REACH;UL', o='China', s='in_stock'),
 dict(g='525', b='CHIMEI Zhenjiang', p='PS', pr='injection', mfr=8, mc='200°C/5kg', d=1.05, ts=45, el=3, fm=3200, fs=70, iz=1.5, ch=2.0, hd='M 78', hdt=82, vi=92, tr=89, hz=2, gl=98, wa=0.03, f='transparent;high flow', ap='Disposable cup, cutlery, blister pack', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='535', b='CHIMEI Zhenjiang', p='PS', pr='injection', mfr=4, mc='200°C/5kg', d=1.05, ts=48, el=3, fm=3300, fs=75, iz=1.5, ch=2.0, hd='M 80', hdt=85, vi=95, tr=89, hz=2, gl=98, wa=0.03, f='transparent;high stiffness', ap='Cosmetic case, stationery, display', c='RoHS;REACH;FDA', o='China', s='in_stock'),
 dict(g='PH-88', b='CHIMEI Zhenjiang', p='PS', pr='injection', mfr=6, mc='200°C/5kg', d=1.05, ts=27, el=45, fm=2200, fs=45, iz=10.0, ch=12.0, hd='L 70', hdt=78, vi=88, wa=0.05, f='high impact', ap='TV housing, refrigerator liner, toy', c='RoHS;REACH', o='China', s='in_stock', r='HIPS grade.'),
 dict(g='PG-383', b='Formosa', p='PS', pr='injection', mfr=16, mc='200°C/5kg', d=1.05, ts=42, el=2.5, fm=3100, fs=68, iz=1.3, ch=1.8, hd='M 76', hdt=80, vi=90, tr=89, hz=2, gl=97, wa=0.03, f='transparent;high flow', ap='Thin-wall cup, blister, cutlery', c='RoHS;REACH;FDA', o='Taiwan, China', s='on_request'),
 dict(g='HP-8250', b='Formosa', p='PS', pr='injection', mfr=8, mc='200°C/5kg', d=1.04, ts=24, el=40, fm=2000, fs=40, iz=9.0, ch=10.0, hd='L 65', hdt=74, vi=85, wa=0.05, f='high impact;high flow', ap='Thin-wall container, cup, toy', c='RoHS;REACH', o='Taiwan, China', s='on_request', r='HIPS grade.'),
 dict(g='476L', b='BASF-YPC Nanjing', p='PS', pr='extrusion;thermoform', mfr=5, mc='200°C/5kg', d=1.05, ts=26, el=50, fm=2100, fs=44, iz=11.0, ch=13.0, hd='L 68', hdt=76, vi=87, wa=0.05, f='high impact', ap='Thermoformed sheet, food tray', c='RoHS;REACH;FDA', o='China', s='in_stock', r='HIPS grade.'),
 # PC / 工程塑料
 dict(g='PC-122', b='CHIMEI', p='PC', pr='injection', mfr=22, mc='300°C/1.2kg', d=1.20, ts=58, el=80, fm=2250, fs=86, iz=55.0, ch=60.0, hd='M 66', hdt=125, vi=140, tr=89, hz=1.8, gl=94, wa=0.23, f='transparent;high flow;high impact', ap='Thin-wall part, connector, LED cover', c='RoHS;REACH;UL', o='Taiwan, China', s='on_request'),
 dict(g='2807', b='Covestro', p='PC', pr='injection;extrusion', mfr=10, mc='300°C/1.2kg', d=1.20, ts=65, el=90, fm=2400, fs=92, iz=70.0, ch=75.0, hd='M 72', hdt=132, vi=146, tr=88, hz=1.2, gl=96, wa=0.23, f='transparent;uv resistant;weather resistant', ap='Outdoor luminaire, skylight, glazing', c='RoHS;REACH;UL', o='Germany', s='on_request'),
 dict(g='L-1225Y', b='Teijin', p='PC', pr='injection', mfr=11, mc='300°C/1.2kg', d=1.20, ts=63, el=90, fm=2350, fs=90, iz=66.0, ch=71.0, hd='M 70', hdt=129, vi=144, tr=89, hz=1.3, gl=95, wa=0.23, f='transparent;high impact;high flow', ap='LED lens, light guide plate, housing', c='RoHS;REACH;UL', o='Japan', s='on_request'),
 dict(g='S-2000R', b='Mitsubishi', p='PC', pr='injection', mfr=8, mc='300°C/1.2kg', d=1.20, ts=66, el=95, fm=2450, fs=93, iz=72.0, ch=78.0, hd='M 73', hdt=134, vi=148, tr=89, hz=1.0, gl=96, wa=0.23, f='transparent;high impact;heat resistant', ap='Optical lens, medical part, safety shield', c='RoHS;REACH;UL', o='Japan', s='on_request'),
 dict(g='PC-1150', b='Lotte', p='PC', pr='injection', mfr=15, mc='300°C/1.2kg', d=1.20, ts=60, el=85, fm=2300, fs=88, iz=60.0, ch=65.0, hd='M 68', hdt=128, vi=143, tr=89, hz=1.5, gl=94, wa=0.23, f='transparent;high flow;high impact', ap='Mobile phone case, thin-wall housing', c='RoHS;REACH;UL', o='Korea', s='on_request'),
 dict(g='1100-211M', b='Changchun', p='PBT', pr='injection', d=1.31, ts=55, el=50, fm=2500, fs=80, iz=5.0, ch=6.0, hd='M 72', hdt=60, vi=170, mp=225, wa=0.10, f='heat resistant;high stiffness', ap='Connector, relay, switch, automotive part', c='RoHS;REACH;UL', o='Taiwan, China', s='on_request'),
 dict(g='PBT-4830', b='Changchun', p='PBT', pr='injection', d=1.53, ts=130, el=3, fm=9000, fs=190, iz=11.0, ch=12.0, hd='M 90', hdt=205, vi=220, mp=225, wa=0.08, f='glass fiber;heat resistant;high stiffness', ap='Automotive connector, motor housing, bobbin', c='RoHS;REACH;UL', o='Taiwan, China', s='on_request', r='PBT + 30% glass fiber.'),
 dict(g='B4300G6', b='BASF', p='PBT', pr='injection', d=1.53, ts=135, el=3, fm=9200, fs=195, iz=11.5, ch=13.0, hd='M 91', hdt=208, vi=222, mp=226, wa=0.08, f='glass fiber;heat resistant;high stiffness', ap='Automotive under-hood part, housing', c='RoHS;REACH;UL', o='Germany', s='on_request', r='PBT + 30% glass fiber.'),
 dict(g='PBT-4815', b='Changchun', p='PBT', pr='injection', d=1.42, ts=95, el=4, fm=5500, fs=135, iz=8.0, ch=9.0, hd='M 84', hdt=195, vi=210, mp=225, wa=0.09, f='glass fiber;heat resistant', ap='Coil bobbin, switch, connector', c='RoHS;REACH;UL', o='Taiwan, China', s='on_request', r='PBT + 15% glass fiber.'),
 dict(g='325', b='SABIC', p='PBT', pr='injection', d=1.31, ts=52, el=60, fm=2400, fs=78, iz=5.5, ch=6.5, hd='M 70', hdt=58, vi=168, mp=224, wa=0.10, f='high flow;heat resistant', ap='Electrical connector, handle, button', c='RoHS;REACH;UL', o='Saudi Arabia', s='on_request'),
 dict(g='PC-540', b='CHIMEI', p='PC/ABS', pr='injection', mfr=20, mc='260°C/2.16kg', d=1.13, ts=56, el=60, fm=2300, fs=82, iz=50.0, ch=55.0, hd='R 112', hdt=100, vi=110, wa=0.20, f='high impact;heat resistant;high flow', ap='Automotive interior, notebook housing, charger', c='RoHS;REACH;UL', o='Taiwan, China', s='on_request'),
 dict(g='C1200HF', b='SABIC', p='PC/ABS', pr='injection', mfr=19, mc='260°C/2.16kg', d=1.15, ts=58, el=70, fm=2350, fs=85, iz=55.0, ch=60.0, hd='R 114', hdt=105, vi=115, wa=0.20, f='high impact;heat resistant;high flow', ap='Automotive part, thin-wall housing', c='RoHS;REACH;UL', o='Saudi Arabia', s='on_request'),
 dict(g='C2800', b='SABIC', p='PC/ABS', pr='injection', mfr=15, mc='260°C/2.16kg', d=1.18, ts=54, el=50, fm=2300, fs=80, iz=45.0, ch=50.0, hd='R 110', hdt=95, vi=105, wa=0.20, f='flame retardant;high impact', ap='Charger housing, socket, TV back cover', c='RoHS;REACH;UL94 V-0', o='Saudi Arabia', s='on_request'),
 dict(g='T65XF', b='Covestro', p='PC/ABS', pr='injection;extrusion', mfr=12, mc='260°C/2.16kg', d=1.13, ts=55, el=70, fm=2250, fs=80, iz=52.0, ch=57.0, hd='R 111', hdt=102, vi=112, wa=0.20, f='high impact;heat resistant', ap='Automotive interior trim, sheet, housing', c='RoHS;REACH;UL', o='Germany', s='on_request'),
]

try:
    from seed_extra_d import EXTRA_D
except ImportError:
    EXTRA_D = []
try:
    from seed_extra_e import EXTRA_E
except ImportError:
    EXTRA_E = []
try:
    from seed_extra_f import EXTRA_F
except ImportError:
    EXTRA_F = []
try:
    from seed_extra_a import EXTRA_A
except ImportError:
    EXTRA_A = []
try:
    from seed_extra_b import EXTRA_B
except ImportError:
    EXTRA_B = []
try:
    from seed_extra_c import EXTRA_C
except ImportError:
    EXTRA_C = []

ALL = PP + HDPE + LDPE + LLDPE + ABS + PS + PC + PET + PA + POM + EVA + PMMA + PVC + VAR + EXTRA_A + EXTRA_B + EXTRA_C + EXTRA_D + EXTRA_E + EXTRA_F

KEY = dict(g='grade', b='brand', p='polymer', pr='process', mfr='mfr', mc='mfr_cond',
           d='density', ts='tensile', el='elong', fm='flex_mod', fs='flex_str',
           iz='izod', ch='charpy', hd='hardness', hdt='hdt', vi='vicat', mp='melt_point',
           tr='transmittance', hz='haze', gl='gloss', wa='water_abs', ash='ash',
           f='features', ap='apps', c='certs', o='origin', s='stock', moq='moq',
           pk='package', r='remark')


def build(default_moq='1 ton', default_pkg='25kg original bag'):
    out = []
    seen = set()
    for row in ALL:
        o = {}
        for k, v in row.items():
            o[KEY[k]] = v
        o.setdefault('moq', default_moq)
        o.setdefault('package', default_pkg)
        o.setdefault('stock', 'on_request')
        o.setdefault('certs', 'RoHS;REACH')
        o.setdefault('origin', 'China')
        key = (o['grade'], o['brand'])
        if key in seen:
            print('skip duplicate: %s / %s' % key)
            continue
        seen.add(key)
        out.append(o)
    return out


if __name__ == '__main__':
    rows = build()
    print('total grades:', len(rows))
    from collections import Counter
    print('by polymer:', dict(Counter(r['polymer'] for r in rows)))
    print('by stock:', dict(Counter(r['stock'] for r in rows)))
    here = os.path.dirname(os.path.abspath(__file__))
    dst = os.path.join(here, 'grades_seed.json')
    with open(dst, 'w', encoding='utf-8') as fh:
        json.dump({'rows': rows}, fh, ensure_ascii=False, indent=1)
    print('written:', dst)
