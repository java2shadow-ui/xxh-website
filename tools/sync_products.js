// sync_products.js — 把 datasheets 的厂家+牌号批量同步为 products（型号层）
// 规则：同 (grade,brand) 已存在则跳过；同品牌共用一张图；specs 取物性摘要
const { db } = require('../db');

const BRAND_ZH = {
  'CHIMEI': '奇美', 'CHIMEI Zhenjiang': '镇江奇美', 'LG Chem': 'LG化学', 'LG Ningbo': 'LG甬兴',
  'LG Chem Ningbo': 'LG化学宁波', 'Formosa': '台化', 'Formosa Ningbo': '台化宁波',
  'Sinopec': '中石化', 'ZPC': '浙石化', 'Maoming': '茂名', 'Maoming Petrochemical': '茂名石化',
  'Yanshan': '燕山', 'Yangzi': '扬子', 'Qilu': '齐鲁', 'Daqing': '大庆', 'Jilin': '吉林',
  'Baofeng Energy': '宝丰能源', 'Shenhua': '神华', 'Yanchang': '延长', 'Donghua Energy': '东华能源',
  'CNOOC': '中海油', 'Shanghai Petrochemical': '上海石化', 'BASF': '巴斯夫', 'BASF-YPC': '扬子巴斯夫',
  'BASF-YPC Nanjing': '扬子巴斯夫', 'BASF Shanghai': '巴斯夫上海', 'Covestro': '科思创',
  'Covestro Shanghai': '科思创上海', 'SABIC': '沙伯', 'SABIC Shanghai': '沙伯上海',
  'DuPont': '杜邦', 'DuPont Shenzhen': '杜邦深圳', 'Polyplastics': '宝理', 'Polyplastics Nantong': '宝理南通',
  'Mitsubishi': '三菱', 'Mitsubishi Shanghai': '三菱上海', 'Teijin': '帝人', 'Teijin Shanghai': '帝人上海',
  'Toray': '东丽', 'Celanese': '塞拉尼斯', 'Evonik': '赢创', 'Evonik Shanghai': '赢创上海',
  'Total Corbion': '道达尔科碧恩', 'Hisun': '海正', 'Kingfa': '金发', 'Dawn Polymer': '道恩',
  'Huafeng': '华峰', 'USI': '台聚', 'Wankai': '万凯', 'Wankai Hainan': '万凯海南',
  'Yisheng': '逸盛', 'Yisheng Hainan': '逸盛海南', 'Sanfangxiang': '三房巷', 'Sanfangxiang Jiangyin': '三房巷江阴',
  'Changchun': '长春', 'Changchun Changshu': '长春常熟', 'Reliance': '信诚', 'Borealis': '北欧化工',
  'Borouge': '博禄', 'LyondellBasell': '利安德巴赛尔', 'ExxonMobil': '埃克森美孚', 'SK': 'SK',
  'Samsung Total': '三星道达尔', 'Guohan': '国亨', 'Guohan Ningbo': '国亨宁波', 'Jihua': '吉化',
  'Jihua Jilin': '吉化吉林', 'Jihua Shanghai': '吉化上海', 'Gaoqiao': '高桥', 'Gaoqiao Shanghai': '高桥上海',
  'Ascend': '奥升德', 'Asahi Kasei': '旭化成', 'UBE': '宇部', 'UBE Shanghai': '宇部上海',
  'Yueyang': '岳阳石化', 'Baling': '巴陵', 'Yuntianhua': '云天化', 'Yuntianhua Chongqing': '云天化重庆',
  'Xinjiang Tianye': '新疆天业', 'Zhongtai': '中泰', 'SECCO': '赛科', 'SECCO Shanghai': '赛科上海',
  'Lotte': '乐天', 'Lotte Shanghai': '乐天上海', 'Huntsman': '亨斯迈', 'DuPont Shenzhen': '杜邦深圳',
  'NatureWorks': 'NatureWorks', 'Total Corbion Shanghai': '道达尔科碧恩'
};

const BRAND_BASE = { 'LG Ningbo':'LG Chem', 'LG Chem Ningbo':'LG Chem', 'Formosa Ningbo':'Formosa', 'CHIMEI Zhenjiang':'CHIMEI', 'PA-757':'' };
const CAT_BY_POLY = {
  'ABS': 'abs', 'PC': 'pc', 'PC/ABS': 'pc-abs', 'PA6': 'pa6', 'PA66': 'pa66', 'POM': 'pom',
  'EVA': 'eva', 'PP': 'pp', 'HDPE': 'hdpe', 'LDPE': 'ldpe', 'LLDPE': 'lldpe',
  'PMMA': 'pmma', 'PVC': 'pvc', 'PET': 'pet', 'PBT': 'pbt', 'TPU': 'tpu', 'TPE': 'tpe',
  'PPS': 'pps', 'LCP': 'lcp', 'PLA': 'bio', 'PBAT': 'bio', 'TPS': 'bio'
};

// PS 拆 GPPS/HIPS：高抗冲特性 → HIPS
function catSlug(r) {
  if (r.polymer === 'PS') return (r.features || '').indexOf('high impact') >= 0 ? 'hips' : 'gpps';
  return CAT_BY_POLY[r.polymer] || 'modified';
}

const NEW_CATS = [
  ['pmma', '亚克力（PMMA）', 'PMMA (Acrylic)', 'pellets/clear.jpg'],
  ['pvc', '聚氯乙烯（PVC）', 'PVC', 'pellets/white.jpg'],
  ['pet', '聚酯（PET）', 'PET', 'pellets/blue.jpg'],
  ['pbt', 'PBT 树脂', 'PBT', 'pellets/ivory.jpg'],
  ['tpu', '热塑性聚氨酯（TPU）', 'TPU', 'pellets/milky.jpg'],
  ['tpe', '热塑性弹性体（TPE）', 'TPE', 'pellets/white.jpg'],
  ['pps', '聚苯硫醚（PPS）', 'PPS', 'pellets/dark.jpg'],
  ['lcp', '液晶聚合物（LCP）', 'LCP', 'pellets/clear.jpg'],
  ['bio', '可降解塑料', 'Biodegradable Plastics', 'pellets/ivory.jpg'],
];

function run() {
  // 1) 新分类
  let catsAdded = 0;
  for (const [slug, zh, en, img] of NEW_CATS) {
    const ex = db.prepare('SELECT id FROM categories WHERE slug=?').get(slug);
    if (!ex) {
      db.prepare('INSERT INTO categories(slug,sort,active,name_en,name_zh,name_ru,name_vi,name_th,name_id,brands,desc_en,desc_zh,apps_en,apps_zh,image) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
        .run(slug, 90, 1, en, zh, en, en, en, en, '', 'Typical grades with datasheets.', '常见牌号，附完整物性表。', '', '', img);
      catsAdded += 1;
    }
  }
  const catRows = db.prepare('SELECT id,slug,name_zh,image FROM categories').all();
  const catBySlug = {}; catRows.forEach(c => catBySlug[c.slug] = c);
  const catDefaultImg = {}; catRows.forEach(c => catDefaultImg[c.id] = c.image || '');

  // 2) 品牌已有图片缓存（同品牌共用一张图）
  const brandImg = {}; const brandCatImg = {};
  db.prepare("SELECT category_id,brand,image FROM products WHERE IFNULL(image,'')!=''").all().forEach(p => {
    const k1 = p.brand + '|' + p.category_id, k2 = p.brand;
    if (!brandCatImg[k1]) brandCatImg[k1] = p.image;
    if (!brandImg[k2]) brandImg[k2] = p.image;
  });

  const ds = db.prepare('SELECT * FROM datasheets').all();
  const exists = new Set(db.prepare('SELECT grade,brand FROM products').all().map(p => p.grade + '|' + p.brand));
  const ins = db.prepare(`INSERT INTO products(category_id,slug,sort,featured,active,name_en,name_zh,name_ru,name_vi,name_th,name_id,brand,grade,desc_en,desc_zh,specs,image)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

  let added = 0, skipped = 0;
  const tx = db;
  for (const r of ds) {
    const key = r.grade + '|' + r.brand;
    if (exists.has(key)) { skipped += 1; continue; }
    exists.add(key);
    const cat = catBySlug[catSlug(r)];
    if (!cat) { skipped += 1; continue; }
    const brandEn = r.brand || '';
    const brandZh = BRAND_ZH[brandEn] || brandEn;
    const img = brandCatImg[brandEn + '|' + cat.id] || brandCatImg[(BRAND_BASE[brandEn] || brandEn) + '|' + cat.id] || brandImg[brandEn] || brandImg[BRAND_BASE[brandEn] || ''] || catDefaultImg[cat.id] || '';
    const nm = (b, g, p) => b + ' ' + g + ' ' + p;
    const specs = [];
    if (r.mfr !== null && r.mfr !== undefined && r.mfr !== '') specs.push(['Melt index', r.mfr + ' g/10min' + (r.mfr_cond ? ' @' + r.mfr_cond : '')]);
    if (r.density) specs.push(['Density', r.density + ' g/cm³']);
    if (r.tensile) specs.push(['Tensile strength', r.tensile + ' MPa']);
    if (r.izod) specs.push(['Izod impact', r.izod + ' kJ/m²']);
    if (r.hdt) specs.push(['HDT', r.hdt + ' °C']);
    if (r.vicat) specs.push(['Vicat', r.vicat + ' °C']);
    const slug = (r.grade + '-' + brandEn).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const descEn = r.apps || (brandEn + ' ' + r.grade + ' ' + r.polymer + ' resin.');
    const descZh = brandZh + ' ' + r.grade + '，原厂品质，中国塑料城现货/期货供应，MOQ 1 吨，FOB 宁波，1-2 天发货。';
    ins.run(cat.id, slug, 99, 0, 1,
      nm(brandEn, r.grade, r.polymer),
      nm(brandZh, r.grade, r.polymer),
      nm(brandEn, r.grade, r.polymer),
      nm(brandEn, r.grade, r.polymer),
      nm(brandEn, r.grade, r.polymer),
      nm(brandEn, r.grade, r.polymer),
      brandEn, r.grade, descEn, descZh, JSON.stringify(specs), img);
    added += 1;
  }
  console.log('new categories:', catsAdded, '| products added:', added, '| skipped(exists):', skipped,
    '| total products:', db.prepare('SELECT COUNT(*) c FROM products').get().c);
}
run();
