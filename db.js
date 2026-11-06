// db.js — SQLite database (node:sqlite, zero-dependency) + seed data
const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.db');
const db = new DatabaseSync(DB_PATH);

function hash(salt, pw) { return crypto.createHash('sha256').update(salt + pw).digest('hex'); }

db.exec(`
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  pass_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS categories(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  sort INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  name_en TEXT, name_zh TEXT, name_ru TEXT, name_vi TEXT, name_th TEXT, name_id TEXT,
  brands TEXT,
  desc_en TEXT, desc_zh TEXT,
  apps_en TEXT, apps_zh TEXT,
  icon TEXT, image TEXT
);
CREATE TABLE IF NOT EXISTS products(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  name_en TEXT, name_zh TEXT, name_ru TEXT, name_vi TEXT, name_th TEXT, name_id TEXT,
  brand TEXT, grade TEXT,
  desc_en TEXT, desc_zh TEXT,
  specs TEXT,
  image TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS news(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_en TEXT, title_zh TEXT, title_ru TEXT, title_vi TEXT, title_th TEXT, title_id TEXT,
  body_en TEXT, body_zh TEXT,
  image TEXT, date TEXT, active INTEGER DEFAULT 1
);
-- Brand (manufacturer) entities: manually maintained by admin, secondary layer of category → brand → model
CREATE TABLE IF NOT EXISTS brands(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  slug TEXT,
  name_en TEXT, name_zh TEXT,
  image TEXT,
  sort INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS inquiries(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, email TEXT, phone TEXT, company TEXT,
  message TEXT, product TEXT, lang TEXT,
  status TEXT DEFAULT 'new',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS settings(
  key TEXT PRIMARY KEY, value TEXT
);
-- Grade datasheet library (physical property table)
CREATE TABLE IF NOT EXISTS datasheets(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  grade TEXT NOT NULL,
  brand TEXT,
  polymer TEXT,
  process TEXT,
  features TEXT,
  apps TEXT,
  certs TEXT,
  origin TEXT,
  stock TEXT,
  mfr REAL, mfr_cond TEXT,
  density REAL,
  tensile REAL,
  elong REAL,
  flex_mod REAL,
  flex_str REAL,
  izod REAL,
  charpy REAL,
  hardness TEXT,
  hdt REAL,
  vicat REAL,
  melt_point REAL,
  transmittance REAL,
  haze REAL,
  gloss REAL,
  water_abs REAL,
  ash REAL,
  moq TEXT, package TEXT, price_note TEXT,
  tds_url TEXT, coa_url TEXT, yellow_card TEXT,
  remark TEXT,
  source_level TEXT,
  active INTEGER DEFAULT 1,
  sort INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ds_uniq ON datasheets(IFNULL(brand,''), grade);
`);

// 兼容已有库：为 datasheets 补 source_level 列（A=原厂TDS逐条核对 B=多源交叉验证 C=待核）
try { db.exec("ALTER TABLE datasheets ADD COLUMN source_level TEXT"); } catch (e) {}

function getSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const o = {}; for (const r of rows) o[r.key] = r.value; return o;
}
function setSetting(k, v) { db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(k, v); }

// ---------- seed ----------
function seed() {
  const cnt = db.prepare('SELECT COUNT(*) AS c FROM categories').get().c;
  if (cnt > 0) return;

  // default admin: admin / admin
  const salt = crypto.randomBytes(8).toString('hex');
  db.prepare('INSERT INTO users(username, pass_hash, salt) VALUES(?,?,?)').run('admin', hash(salt, 'admin'), salt);

  setSetting('site_name_en', 'Ningbo Xianxunhe New Materials Co., Ltd.');
  setSetting('site_name_zh', '宁波纤讯和新材料有限公司');
  setSetting('whatsapp', '+8615221168218');
  setSetting('phone', '+86 152 2116 8218');
  setSetting('email', 'sales@xianxunhe.com');
  setSetting('addr_en', 'Room 335, Building 1, International Business Center, China Plastic City, Yuyao, Ningbo, Zhejiang, China');
  setSetting('addr_zh', '浙江省余姚市中国塑料城国际商务中心1幢335室');
  setSetting('footer_note', '');

  const cat = db.prepare(`INSERT INTO categories(slug,sort,name_en,name_zh,name_ru,name_vi,name_th,name_id,brands,desc_en,desc_zh,apps_en,apps_zh,icon,image)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

  // 19 categories
  cat.run('abs', 1, 'ABS', 'ABS 树脂', 'АБС-пластик', 'Nhựa ABS', 'ABS', 'ABS',
    'CHIMEI, Formosa, LG Chem',
    'General-purpose and high-impact ABS for injection molding and extrusion.',
    '通用级与高抗冲 ABS，适用于注塑与挤出成型。',
    'Electronics housings, appliances, auto interior parts, toys, luggage',
    '电器外壳、家电、汽车内饰、玩具、箱包', 'abs', 'cat/abs.jpg');
  cat.run('pc', 2, 'Polycarbonate (PC)', '聚碳酸酯（PC）', 'Поликарбонат (ПК)', 'Polycarbonate (PC)', 'พอลิคาร์บอเนต (PC)', 'Polikarbonat (PC)',
    'SABIC, Covestro, CHIMEI, LG Chem, Mitsubishi, Idemitsu, Formosa',
    'High-clarity, high-impact polycarbonate resins for engineering applications.',
    '高透明、高抗冲聚碳酸酯，工程应用首选。',
    'Auto glazing, LED optics, electronics, medical devices, construction',
    '汽车车窗、LED 光学、电子电器、医疗器械、建材', 'pc', 'cat/pc.jpg');
  cat.run('pc-abs', 3, 'PC/ABS Alloy', 'PC/ABS 合金', 'Сплав ПК/АБС', 'Hợp kim PC/ABS', 'อัลลอย PC/ABS', 'Aloy PC/ABS',
    'Covestro, CHIMEI, SABIC',
    'PC/ABS blends combining impact strength with processability.',
    'PC/ABS 合金，兼顾抗冲击性与加工性能。',
    'Auto interiors, laptop enclosures, charger housings',
    '汽车内饰、笔记本外壳、充电器外壳', 'pcabs', 'cat/pcabs.jpg');
  cat.run('pa6', 4, 'PA6 (Nylon 6)', '尼龙6（PA6）', 'ПА6 (нейлон 6)', 'PA6 (Nylon 6)', 'PA6 (ไนลอน 6)', 'PA6 (Nilon 6)',
    'BASF, DuPont, domestic',
    'Polyamide 6 for injection molding and fiber applications.',
    '聚酰胺 6，适用于注塑与纤维领域。',
    'Auto parts, gears, fasteners, cable ties, industrial components',
    '汽车部件、齿轮、紧固件、扎带、工业零件', 'pa', 'cat/pa6.jpg');
  cat.run('pa66', 5, 'PA66 (Nylon 66)', '尼龙66（PA66）', 'ПА66 (нейлон 66)', 'PA66 (Nylon 66)', 'PA66 (ไนลอน 66)', 'PA66 (Nilon 66)',
    'BASF, Asahi Kasei, DuPont',
    'High-strength polyamide 66 for demanding engineering parts.',
    '高强度聚酰胺 66，适用于严苛工程部件。',
    'Connectors, under-hood parts, structural components',
    '连接器、发动机舱部件、结构件', 'pa', 'cat/pa66.jpg');
  cat.run('pa12', 6, 'PA12 (Nylon 12)', '尼龙12（PA12）', 'ПА12 (нейлон 12)', 'PA12 (Nylon 12)', 'PA12 (ไนลอน 12)', 'PA12 (Nilon 12)',
    'Premium sourcing on request',
    'Low-moisture nylon 12 for flexible and chemical-resistant parts.',
    '低吸水尼龙 12，柔韧且耐化学。',
    'Fuel lines, tubing, cable sheathing, 3D printing',
    '油管、软管、电缆护套、3D打印', 'pa', 'cat/pa12.jpg');
  cat.run('pa46', 7, 'PA46 (Nylon 46)', '尼龙46（PA46）', 'ПА46', 'PA46 (Nylon 46)', 'PA46 (ไนลอน 46)', 'PA46 (Nilon 46)',
    'Premium sourcing on request',
    'Ultra-high-heat nylon for extreme operating conditions.',
    '超耐热尼龙，适用于极端工况。',
    'Automotive electronics, connectors, E&E components',
    '汽车电子、连接器、电气元件', 'pa', 'cat/pa46.jpg');
  cat.run('pom', 8, 'POM (Acetal)', '聚甲醛（POM）', 'ПОМ (полиацеталь)', 'POM (Acetal)', 'POM (อะซิทัล)', 'POM (Asetal)',
    'Polyplastics, domestic',
    'High-crystallinity acetal with excellent wear resistance.',
    '高结晶度聚甲醛，耐磨性出色。',
    'Gears, bearings, precision parts, zippers, pumps',
    '齿轮、轴承、精密零件、拉链、水泵', 'pom', 'cat/pom.jpg');
  cat.run('ppsu', 9, 'PPSU (Polyphenylsulfone)', '聚苯砜（PPSU）', 'ППСФ', 'PPSU', 'PPSU', 'PPSU',
    'Solvay, domestic',
    'High-performance sulfone polymer for medical and hot-water applications.',
    '高性能砜聚合物，医疗与热水应用。',
    'Medical devices, sterilizable parts, plumbing, aerospace',
    '医疗器械、可灭菌部件、水暖、航天', 'ppsu', 'cat/ppsu.jpg');
  cat.run('poe', 10, 'POE (Polyolefin Elastomer)', '聚烯烃弹性体（POE）', 'ПОЭ (полиолефиновый эластомер)', 'POE', 'POE (อีลาสโตเมอร์)', 'POE',
    'Dow (ENGAGE), ExxonMobil, Mitsui',
    'Olefin block copolymer elastomers for modification and encapsulation.',
    '烯烃嵌段共聚弹性体，改性与封装应用。',
    'Solar encapsulant films, TPO modification, wire & cable, footwear',
    '光伏胶膜、TPO 改性、电线电缆、鞋材', 'poe', 'cat/poe.jpg');
  cat.run('eva', 11, 'EVA (Ethylene Vinyl Acetate)', '乙烯-醋酸乙烯共聚物（EVA）', 'ЭВА (этиленвинилацетат)', 'EVA', 'EVA', 'EVA',
    'Formosa, BASF-YPC, USI, Beijing Organic',
    'Flexible EVA copolymers from low to high VA content.',
    '低含量至高含量 VA 的柔性 EVA 共聚物。',
    'Solar encapsulant, footwear midsoles, hot-melt adhesive, films',
    '光伏胶膜、鞋中底、热熔胶、薄膜', 'eva', 'cat/eva.jpg');
  cat.run('surlyn', 12, 'Surlyn (Ionomer)', '沙林树脂（离子聚合物）', 'Сурлин (иономер)', 'Surlyn (Ionomer)', 'ซัรลิน (ไอโอโนเมอร์)', 'Surlyn (Ionomer)',
    'DuPont',
    'DuPont ionomer resin with unique clarity and toughness.',
    '杜邦离子聚合物，透明与韧性兼备。',
    'Golf ball covers, luxury packaging, perfume caps, footwear',
    '高尔夫球表层、高端包装、香水瓶盖、鞋材', 'surlyn', 'cat/surlyn.jpg');
  cat.run('pp', 13, 'Polypropylene (PP)', '聚丙烯（PP）', 'Полипропилен (ПП)', 'Polypropylene (PP)', 'พอลิโพรพิลีน (PP)', 'Polipropilena (PP)',
    'Borealis, Formosa, Sinopec, Donghua Energy',
    'Homopolymer, copolymer and random PP for all processing methods.',
    '均聚、共聚与无规聚丙烯，加工方式全覆盖。',
    'Packaging, automotive, fibers, household products, BOPP film',
    '包装、汽车、纤维、日用品、BOPP 薄膜', 'pp', 'cat/pp.jpg');
  cat.run('hdpe', 14, 'HDPE', '高密度聚乙烯（HDPE）', 'ПЭВП', 'HDPE', 'HDPE', 'HDPE',
    'ExxonMobil, Formosa, Iran petrochemical, Daqing',
    'Blow-molding and injection HDPE grades.',
    '吹塑与注塑级 HDPE。',
    'Bottles, drums, pipes, crates, containers',
    '瓶类、桶类、管材、周转箱、容器', 'pe', 'cat/hdpe.jpg');
  cat.run('ldpe', 15, 'LDPE', '低密度聚乙烯（LDPE）', 'ПЭНП', 'LDPE', 'LDPE', 'LDPE',
    'LG Chem, Sinopec',
    'Flexible LDPE for film extrusion and coating.',
    '柔性 LDPE，适用于薄膜挤出与涂覆。',
    'Films, bags, lamination, wire coating',
    '薄膜、包装袋、复合、电线包覆', 'pe', 'cat/ldpe.jpg');
  cat.run('lldpe', 16, 'LLDPE', '线性低密度聚乙烯（LLDPE）', 'ЛПЭНП', 'LLDPE', 'LLDPE', 'LLDPE',
    'ExxonMobil, Formosa, ZRCC, ZPC',
    'Butene / hexene LLDPE for stretch and packaging films.',
    '丁烯/己烯 LLDPE，缠绕膜与包装膜应用。',
    'Stretch film, heavy-duty bags, lamination',
    '缠绕膜、重包装袋、复合膜', 'pe', 'cat/lldpe.jpg');
  cat.run('gpps', 17, 'GPPS', '通用聚苯乙烯（GPPS）', 'ПС общего назначения', 'GPPS', 'GPPS', 'GPPS',
    'SECCO, Satellite Chemical',
    'Crystal-clear general-purpose polystyrene.',
    '水晶级通用聚苯乙烯。',
    'Transparent packaging, disposables, stationery',
    '透明包装、一次性用品、文具', 'ps', 'cat/gpps.jpg');
  cat.run('hips', 18, 'HIPS', '高抗冲聚苯乙烯（HIPS）', 'Ударопрочный ПС', 'HIPS', 'HIPS', 'HIPS',
    'Formosa, domestic',
    'High-impact polystyrene for housings and packaging.',
    '高抗冲聚苯乙烯，外壳与包装应用。',
    'Appliance housings, refrigerator liners, food packaging',
    '家电外壳、冰箱内衬、食品包装', 'ps', 'cat/hips.jpg');
  cat.run('modified', 19, 'Modified Plastics', '改性塑料', 'Модифицированные пластики', 'Nhựa biến tính', 'พลาสติกดัดแปร', 'Plastik modifikasi',
    'Custom compounding',
    'Glass-filled, flame-retardant and heat-stabilized compounds tailored to spec.',
    '玻纤增强、阻燃、耐热等定制改性配方。',
    'Automotive, electrical, appliance, custom applications',
    '汽车、电气、家电、定制应用', 'mod', 'cat/modified.jpg');

  // representative products
  const prod = db.prepare(`INSERT INTO products(category_id,slug,featured,name_en,name_zh,brand,grade,desc_en,desc_zh,specs,image,sort)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`);
  const cid = (slug) => db.prepare('SELECT id FROM categories WHERE slug=?').get(slug).id;

  prod.run(cid('poe'), 'engage-8842', 1, 'ENGAGE™ 8842 POE', 'ENGAGE™ 8842 聚烯烃弹性体', 'Dow', 'ENGAGE 8842',
    'Ultra-low-density ethylene-octene copolymer in pellet form. Excellent flow and outstanding impact performance in PP and PE blends; ideal for TPO applications requiring superior low-temperature impact.',
    '超低密度乙烯-辛烯共聚物，颗粒形态。流动性出色，在 PP/PE 体系中抗冲击性能优异，特别适合要求低温抗冲的 TPO 应用。',
    JSON.stringify([['Melt index', '1.0 g/10min'],['Density', '0.857 g/cm³'],['Octene content', 'High'],['Form', 'Pellets']]),
    'prod/engage8842.jpg', 1);
  prod.run(cid('poe'), 'engage-8400', 1, 'ENGAGE™ 8400 POE', 'ENGAGE™ 8400 聚烯烃弹性体', 'Dow', 'ENGAGE 8400',
    'Versatile ethylene-octene POE for TPO modification and flexible applications with excellent elasticity.',
    '通用型乙烯-辛烯 POE，用于 TPO 改性与柔性应用，弹性出色。',
    JSON.stringify([['Melt index', '30 g/10min'],['Density', '0.870 g/cm³']]),
    'prod/engage8400.jpg', 2);
  prod.run(cid('abs'), 'chimei-pa757', 1, 'CHIMEI PA-757 ABS', '奇美 PA-757 ABS', 'CHIMEI', 'PA-757',
    'General-purpose injection grade ABS with balanced flow and impact strength — the industry benchmark for electronics housings.',
    '通用注塑级 ABS，流动性与抗冲击平衡——电子外壳行业的标杆牌号。',
    JSON.stringify([['Melt index', '17 g/10min'],['Izod impact', '18 kg·cm/cm'],['Form', 'Pellets']]),
    'prod/pa757.jpg', 1);
  prod.run(cid('pc'), 'sabic-pc', 1, 'SABIC LEXAN™ PC', 'SABIC LEXAN™ 聚碳酸酯', 'SABIC', 'LEXAN',
    'High-viscosity polycarbonate grades with excellent clarity and toughness for engineering and optical applications.',
    '高粘度聚碳酸酯，透明度与韧性俱佳，工程与光学应用。',
    JSON.stringify([['Melt flow', '10.5 g/10min'],['Light transmission', '88–90%']]),
    'prod/sabicpc.jpg', 1);
  prod.run(cid('pa66'), 'basf-pa66', 1, 'BASF Ultramid® A3 PA66', '巴斯夫 Ultramid® A3 PA66', 'BASF', 'Ultramid A3',
    'Standard injection-molding PA66 with high rigidity and thermal stability for electrical and automotive parts.',
    '标准注塑级 PA66，刚性与热稳定性高，电气与汽车部件首选。',
    JSON.stringify([['Melt flow', '95 cm³/10min'],['Tensile strength', '85 MPa']]),
    'prod/ultramid.jpg', 1);
  prod.run(cid('eva'), 'eva-formosa', 1, 'Formosa EVA (Solar / Footwear)', '台塑 EVA（光伏/鞋材级）', 'Formosa', '7350M etc.',
    'EVA copolymers for solar encapsulation and footwear midsoles. Various VA contents in stock.',
    '光伏胶膜与鞋中底用 EVA 共聚物，多种 VA 含量现货。',
    JSON.stringify([['VA content', '18–33%'],['Melt index', '2–25 g/10min']]),
    'prod/eva.jpg', 1);
  prod.run(cid('surlyn'), 'surlyn-8940', 1, 'DuPont Surlyn® 8940', '杜邦沙林树脂 8940', 'DuPont', 'Surlyn 8940',
    'Premium ionomer resin with exceptional clarity, scratch resistance and soft touch — the choice for golf ball covers and luxury packaging.',
    '高端离子聚合物，透明、耐刮、触感柔软——高尔夫球与高端包装之选。',
    JSON.stringify([['Melt index', '2.8 g/10min'],['Density', '0.95 g/cm³']]),
    'prod/surlyn.jpg', 1);
  prod.run(cid('pp'), 'borealis-pp', 0, 'Borealis PP (Injection / Fiber)', '北欧化工 PP（注塑/纤维级）', 'Borealis', 'HC600 etc.',
    'Bimodal polypropylene grades for rigid packaging and fiber applications.',
    '双峰聚丙烯，刚性包装与纤维应用。',
    JSON.stringify([['Melt index', '8–30 g/10min']]),
    'prod/borealispp.jpg', 2);
  prod.run(cid('hdpe'), 'exxon-hdpe', 0, 'ExxonMobil HDPE (Blow Molding)', '埃克森美孚 HDPE（吹塑级）', 'ExxonMobil', 'HTA001 etc.',
    'High-stiffness blow-molding HDPE. "Blow molding" means hollow parts such as bottles, jerrycans and drums are formed by inflating the melted resin in a mold.',
    '高刚性吹塑级 HDPE。"吹塑"是中空成型工艺——把熔融树脂吹入模具做成瓶子、油桶、化工桶等中空容器，也可用于周转箱等注塑件。',
    JSON.stringify([['Melt index', '0.03–0.9 g/10min'],['Density', '0.951–0.960 g/cm³'],['Typical use', 'Bottles / drums / containers']]),
    'prod/exxonhdpe.jpg', 2);
  prod.run(cid('pom'), 'polyplastics-m90', 0, 'Polyplastics DURACON® M90 POM', '宝理 DURACON® M90 POM', 'Polyplastics', 'M90',
    'General-purpose acetal copolymer with excellent fatigue resistance for gears and precision parts.',
    '通用型共聚 POM，抗疲劳性能优异，齿轮与精密零件首选。',
    JSON.stringify([['Melt index', '9 g/10min'],['Tensile strength', '61 MPa']]),
    'prod/m90.jpg', 1);

  // fill remaining categories so every category has products
  prod.run(cid('abs'), 'lg-121h', 0, 'LG Chem 121H ABS', 'LG化学 121H ABS', 'LG Chem', '121H',
    'High-impact general-purpose ABS, one of the most widely used injection grades in Asia.',
    '高抗冲通用级 ABS，亚洲注塑领域应用最广的牌号之一。',
    JSON.stringify([['Type', 'Injection / high impact'],['Form', 'Pellets']]),
    'prod/lgabs.jpg', 2);
  prod.run(cid('abs'), 'formosa-ag15a1', 0, 'Formosa AG15A1 ABS', '台化 AG15A1 ABS', 'Formosa', 'AG15A1',
    'Extrusion-grade ABS for sheet and profile applications.',
    '挤出级 ABS，适用于板材与型材。',
    JSON.stringify([['Type', 'Extrusion'],['Form', 'Pellets']]),
    'prod/formosaabs.jpg', 3);
  prod.run(cid('pc'), 'makrolon-2805', 0, 'Covestro Makrolon® 2805 PC', '科思创 Makrolon® 2805 PC', 'Covestro', 'Makrolon 2805',
    'General-purpose injection PC with easy release — ideal for transparent technical parts.',
    '通用注塑级 PC，易脱模，适合透明制件。',
    JSON.stringify([['Melt flow', '17.5 g/10min'],['Type', 'Injection']]),
    'prod/makrolon.jpg', 2);
  prod.run(cid('pc'), 'chimei-pc-110', 0, 'CHIMEI PC-110', '奇美 PC-110', 'CHIMEI', 'PC-110',
    'General-purpose polycarbonate with balanced flow and impact strength.',
    '通用级聚碳酸酯，流动性与抗冲击均衡。',
    JSON.stringify([['Melt flow', '17 g/10min']]),
    'prod/chimeipc.jpg', 3);
  prod.run(cid('pc-abs'), 'bayblend-t65', 1, 'Covestro Bayblend® T65 XF PC/ABS', '科思创 Bayblend® T65 XF PC/ABS', 'Covestro', 'Bayblend T65 XF',
    'Extra-flow PC/ABS blend for thin-wall electronics enclosures with excellent surface finish.',
    '高流动 PC/ABS 合金，薄壁电子外壳首选，表面质感出色。',
    JSON.stringify([['Type', 'Extra flow'],['Application', 'Electronics enclosures']]),
    'prod/bayblend.jpg', 1);
  prod.run(cid('pa6'), 'basf-b3eg6', 1, 'BASF Ultramid® B3EG6 PA6-GF30', '巴斯夫 Ultramid® B3EG6 PA6（30%玻纤）', 'BASF', 'Ultramid B3EG6',
    '30% glass-fiber reinforced PA6 with high rigidity and heat stability for structural parts.',
    '30% 玻纤增强 PA6，刚性与耐热性高，结构部件首选。',
    JSON.stringify([['Glass fiber', '30%'],['Type', 'Heat stabilized']]),
    'prod/pa6basf.jpg', 1);
  prod.run(cid('pa66'), 'leona-1300s', 0, 'Asahi Kasei LEONA™ 1300S PA66', '旭化成 LEONA™ 1300S PA66', 'Asahi Kasei', '1300S',
    'General-purpose PA66 for electrical and mechanical parts.',
    '通用级 PA66，电气与机械部件常用牌号。',
    JSON.stringify([['Type', 'General purpose'],['Form', 'Pellets']]),
    'prod/leona.jpg', 2);
  prod.run(cid('pa12'), 'pa12-general', 1, 'PA12 Injection & Extrusion Grades', 'PA12 注塑/挤出级', 'Premium sourcing on request', 'Various',
    'Low-moisture nylon 12 with excellent chemical resistance and flexibility. Tell us your application and we will quote the matching grade.',
    '低吸水尼龙 12，耐化学、柔韧性好。告知您的应用场景，我们为您匹配牌号报价。',
    JSON.stringify([['Moisture uptake', 'Very low'],['Form', 'Pellets']]),
    'prod/pa12.jpg', 1);
  prod.run(cid('pa46'), 'stanyl-pa46', 1, 'DSM Stanyl® PA46', 'DSM Stanyl® PA46', 'DSM', 'Stanyl series',
    'High-heat nylon 46 for connectors and E/E components working above 150 °C.',
    '耐高温尼龙 46，适用于 150°C 以上工况的连接器与电气元件。',
    JSON.stringify([['Heat deflection', 'Very high'],['Application', 'Connectors / E&E']]),
    'prod/pa46.jpg', 1);
  prod.run(cid('pom'), 'yuntianhua-m270', 0, 'Yuntianhua M270 POM', '云天化 M270 POM', 'Yuntianhua', 'M270',
    'Domestic general-purpose acetal copolymer — cost-effective choice for gears and hardware.',
    '国产通用共聚 POM，齿轮与五金件的高性价比选择。',
    JSON.stringify([['Type', 'General purpose'],['Form', 'Pellets']]),
    'prod/m270.jpg', 2);
  prod.run(cid('ppsu'), 'radel-r5000', 1, 'Solvay RADEL® R-5000 PPSU', '苏威 RADEL® R-5000 PPSU', 'Solvay', 'R-5000',
    'Premium PPSU with outstanding impact strength and repeated steam-sterilization capability.',
    '高端 PPSU，抗冲击性能突出，可反复蒸汽灭菌。',
    JSON.stringify([['Type', 'Medical grade'],['Sterilization', 'Steam / repeated']]),
    'prod/radel.jpg', 1);
  prod.run(cid('poe'), 'tafmer-poe', 0, 'Mitsui TAFMER™ POE', '三井 TAFMER™ POE', 'Mitsui', 'TAFMER series',
    'Soft olefin elastomer for modification of PP/PE and flexible compounds.',
    '软质烯烃弹性体，用于 PP/PE 改性与柔性配方。',
    JSON.stringify([['Type', 'Elastomer'],['Form', 'Pellets']]),
    'prod/tafmer.jpg', 3);
  prod.run(cid('eva'), 'eva-v5110j', 0, 'BASF-YPC V5110J EVA (Solar)', '扬子巴斯夫 V5110J EVA（光伏级）', 'BASF-YPC', 'V5110J',
    '28% VA EVA designed for solar encapsulant films.',
    '28% VA 光伏胶膜专用 EVA。',
    JSON.stringify([['VA content', '28%'],['Application', 'Solar film']]),
    'prod/eva2.jpg', 2);
  prod.run(cid('surlyn'), 'surlyn-8920', 0, 'DuPont Surlyn® 8920', '杜邦沙林树脂 8920', 'DuPont', 'Surlyn 8920',
    'Ionomer for extrusion coating and packaging with excellent seal strength.',
    '挤出贴合与包装用离子聚合物，热封强度出色。',
    JSON.stringify([['Application', 'Coating / packaging']]),
    'prod/surlyn8920.jpg', 2);
  prod.run(cid('pp'), 'formosa-pp', 0, 'Formosa PP (Injection Grade)', '台塑 PP（注塑级）', 'Formosa', 'Injection series',
    'Cost-effective PP for housewares, appliances and automotive trim.',
    '高性价比 PP，日用品、家电与汽车内饰应用。',
    JSON.stringify([['Type', 'Homopolymer'],['Form', 'Pellets']]),
    'prod/formosapp.jpg', 3);
  prod.run(cid('hdpe'), 'hdpe-film', 0, 'HDPE Film Grade', 'HDPE 薄膜级', 'Formosa', 'Film series',
    'Film-grade HDPE for shopping bags and heavy-duty packaging.',
    '薄膜级 HDPE，购物袋与重包装应用。',
    JSON.stringify([['Type', 'Film'],['Form', 'Pellets']]),
    'prod/hdpefilm.jpg', 3);
  prod.run(cid('ldpe'), 'ldpe-film', 1, 'LG Chem LDPE (Film)', 'LG化学 LDPE（薄膜级）', 'LG Chem', 'Film series',
    'Flexible LDPE for packaging films and lamination.',
    '柔性 LDPE，包装薄膜与复合应用。',
    JSON.stringify([['Type', 'Film'],['Form', 'Pellets']]),
    'prod/ldpe.jpg', 1);
  prod.run(cid('lldpe'), 'lldpe-exceed', 1, 'ExxonMobil Exceed™ LLDPE', '埃克森美孚 Exceed™ LLDPE', 'ExxonMobil', 'Exceed series',
    'Metallocene LLDPE for high-clarity stretch film with superior puncture resistance.',
    '茂金属 LLDPE，高透明缠绕膜，抗穿刺性能出色。',
    JSON.stringify([['Type', 'Metallocene'],['Application', 'Stretch film']]),
    'prod/lldpe.jpg', 1);
  prod.run(cid('gpps'), 'secco-123p', 1, 'SECCO 123P GPPS', '赛科 123P GPPS', 'SECCO', '123P',
    'Crystal-clear general-purpose PS for transparent packaging and disposables.',
    '水晶级通用聚苯乙烯，透明包装与一次性用品。',
    JSON.stringify([['Type', 'Crystal'],['Form', 'Pellets']]),
    'prod/gpps.jpg', 1);
  prod.run(cid('hips'), 'hips-general', 1, 'Formosa HIPS (General Purpose)', '台化 HIPS（通用级）', 'Formosa', 'General purpose',
    'High-impact PS for appliance housings, refrigerator liners and food packaging.',
    '高抗冲聚苯乙烯，家电外壳、冰箱内衬与食品包装。',
    JSON.stringify([['Type', 'High impact'],['Form', 'Pellets']]),
    'prod/hips.jpg', 1);
  prod.run(cid('modified'), 'high-temp-pp', 1, 'High-Temperature PP Compound', '耐高温 PP 改性料', 'Custom compounding', 'Custom',
    'Heat-stabilized and glass-filled PP compounds tailored to your spec — tell us the target HDT and we will match it.',
    '耐热稳定与玻纤增强 PP 定制配方，告知目标热变形温度，我们为您匹配。',
    JSON.stringify([['Type', 'Custom compound'],['Options', 'GF / FR / heat stabilized']]),
    'prod/modifiedpp.jpg', 1);

  // seed news
  const news = db.prepare('INSERT INTO news(title_en,title_zh,body_en,body_zh,date) VALUES(?,?,?,?,?)');
  news.run('Xianxunhe attends Chinaplas 2026',
    '纤讯和亮相 Chinaplas 2026 国际橡塑展',
    'Meet our export team at Chinaplas 2026. We will present our full engineering plastics portfolio and SEA-focused supply programs. Contact us to arrange a meeting.',
    '欢迎莅临我司 Chinaplas 2026 展位，现场展示全系列工程塑料产品与面向东南亚市场的供应方案，欢迎预约洽谈。',
    '2026-04-21');
  news.run('Expanded POE stock for solar module makers',
    'POE 现货扩容，服务光伏组件客户',
    'We have expanded local stock of Dow ENGAGE POE grades to support rapidly growing solar encapsulant demand across Southeast Asia.',
    '为满足东南亚快速增长的光伏胶膜需求，我司已扩大陶氏 ENGAGE POE 系列本地现货库存。',
    '2026-03-05');
}

seed();

// lightweight migrations (idempotent)
try { db.exec("ALTER TABLE products ADD COLUMN brand_id INTEGER"); } catch (e) {}
try { db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_brands_cat_slug ON brands(category_id, slug)"); } catch (e) {}

module.exports = { db, hash, getSettings, setSetting };
