// server.js — Express app: multilingual frontend + admin API
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { db, hash, getSettings, setSetting } = require('./db');
const { LANGS, T } = require('./i18n');
const { TG, FIELDS, PROC_MAP, FEAT_MAP, STOCK_MAP, SHORT } = require('./i18n-grades');
const { IH } = require('./i18n-home');
const { CALC } = require('./i18n-calc');
const { LEGAL } = require('./i18n-legal');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// HTML 页面一律 no-cache：否则浏览器按 Last-Modified 做启发式缓存，
// 用户刷新后仍拿到旧页面（引用旧版 JS/CSS → 新功能看起来"没生效"）。
// 静态资源保留长缓存，靠模板里的 ?v= 版本号控制更新。
app.use((req, res, next) => {
  if (!/^\/(static|assets|uploads)\//.test(req.path)) {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  }
  next();
});
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true }));
// P0 SEO：主域统一为 www.nbxxh.com —— 裸域 301 到 www，避免双域名内容拆分权重。
// sitemap/robots/canonical 全部用 www（Google 规则：sitemap 内 URL 必须与 sitemap 本身同域）。
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  if (host === 'nbxxh.com' && (req.method === 'GET' || req.method === 'HEAD')) {
    return res.redirect(301, 'https://www.nbxxh.com' + req.originalUrl);
  }
  next();
});
app.use('/static', express.static(path.join(__dirname, 'public'), { maxAge: '1h', etag: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'), { maxAge: '1h' }));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets'), { maxAge: '1h' }));

// ---------- helpers ----------
const LANG_CODES = LANGS.map(l => l.code);
function validLang(l) { return LANG_CODES.includes(l); }
function langOf(req) { return validLang(req.params.lang) ? req.params.lang : 'en'; }
// base UI strings + grade-datasheet strings merged (grades module keeps its own file)
function tr(lang) { return Object.assign({}, T[lang] || T.en, TG[lang] || TG.en); }

// pick first non-empty value with fallback lang -> en -> zh
function pick(lang, ...vals) {
  const order = [lang, 'en', 'zh'];
  const flat = [];
  for (let i = 0; i < vals.length; i += 1) { // vals come as per-lang arrays
    // vals: [vLang, vEn, vZh, ...] handled by caller; here expect object-style call
  }
  return null;
}
function lp(lang, obj) { // localized pick from {en, zh, ru...}
  if (!obj) return '';
  for (const k of [lang, 'en', 'zh']) { if (obj[k] && String(obj[k]).trim()) return obj[k]; }
  return '';
}

// ---------- auth (admin) ----------
const sessions = new Map(); // token -> {user, expires}
function makeToken(user) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, { user, expires: Date.now() + 24 * 3600 * 1000 });
  return token;
}
function authUser(req) {
  const h = req.headers['authorization'] || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : (req.headers['x-token'] || null);
  if (!token) return null;
  const s = sessions.get(token);
  if (!s || s.expires < Date.now()) { sessions.delete(token); return null; }
  return s.user;
}
function requireAuth(req, res, next) {
  const u = authUser(req);
  if (!u) return res.status(401).json({ error: 'unauthorized' });
  next();
}

// ---------- view routes ----------
app.get('/', (req, res) => res.redirect('/en'));
app.get('/admin', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

const SEO_DEFAULTS = {
  pageTitle: '', pageDesc: '', canonical: '', canonPath: '',
  langAlts: null, ogType: 'website', ogImage: '', extraCss: ''
};
const SITE = 'https://www.nbxxh.com';
function siteUrl(l, p) { return SITE + '/' + l + (p ? '/' + p : ''); }
// active datasheet count, cached 5 min — used for the {N} placeholder in page titles
let _dsCnt = 0, _dsCntAt = 0;
function dsCount() {
  if (!_dsCnt || Date.now() - _dsCntAt > 300000) {
    try { _dsCnt = db.prepare('SELECT COUNT(*) c FROM datasheets WHERE active=1').get().c; } catch (e) { _dsCnt = 0; }
    _dsCntAt = Date.now();
  }
  return _dsCnt;
}

// ---------- per-page SEO meta (title / description in 6 languages) ----------
// 此前 grades / products / about / contact / news / category 全部落到默认站点名
// "Ningbo Xianxunhe New Materials"，20+ 个页面 title 完全重复，等于没做关键词。
// 这里集中管理；grade 详情页有自己动态生成的 title（见 grade 路由），不在此表。
const PAGE_META = {
  grades: {
    path: 'grades',
    en: { t: 'Plastic Resin Grade Datasheets — ABS, PP, PE, PC, PA, POM | {N} Grades',
          d: 'Search {N} plastic resin grades by melt flow index, density, impact strength and HDT. ABS, PP, HDPE, LDPE, LLDPE, PC, PA6, PA66, POM, PMMA and EVA from CHIMEI, LG Chem, Sinopec, SABIC, ExxonMobil. Free samples, MOQ 1 ton, FOB Ningbo.' },
    zh: { t: '塑料牌号物性表查询 — ABS/PP/PE/PC/PA/POM 共 {N} 个牌号',
          d: '按熔融指数、密度、冲击强度、热变形温度筛选 {N} 个塑料牌号物性数据。覆盖奇美、LG、中石化、SABIC、埃克森美孚等原厂 ABS/PP/PE/PC/PA/POM，免费样品，1 吨起订，FOB 宁波。' },
    ru: { t: 'Таблицы свойств марок пластика — ABS, PP, PE, PC, PA | {N} марки',
          d: 'Подбор {N} марок по показателю текучести, плотности, ударной вязкости и HDT. ABS, PP, HDPE, LDPE, LLDPE, PC, PA6, PA66, POM, PMMA, EVA от CHIMEI, LG Chem, Sinopec, SABIC. Бесплатные образцы, MOQ 1 тонна, FOB Нинбо.' },
    vi: { t: 'Bảng tính chất mã nhựa — ABS, PP, PE, PC, PA, POM | {N} mã',
          d: 'Tra cứu {N} mã nhựa theo MFR, khối lượng riêng, độ bền va đập và HDT. ABS, PP, HDPE, LDPE, LLDPE, PC, PA6, PA66, POM, PMMA, EVA từ CHIMEI, LG Chem, Sinopec, SABIC. Mẫu miễn phí, MOQ 1 tấn, FOB Ninh Ba.' },
    th: { t: 'ตารางสมบัติเกรดพลาสติก — ABS, PP, PE, PC, PA, POM | {N} เกรด',
          d: 'ค้นหา {N} เกรดพลาสติกตามค่า MFR ความหนาแน่น แรงกระแทก และ HDT ครอบคลุม ABS, PP, HDPE, LDPE, LLDPE, PC, PA6, PA66, POM, PMMA, EVA จาก CHIMEI, LG Chem, Sinopec, SABIC ตัวอย่างฟรี MOQ 1 ตัน FOB หนิงโป' },
    id: { t: 'Lembar Data Grade Plastik — ABS, PP, PE, PC, PA, POM | {N} Grade',
          d: 'Cari {N} grade resin berdasarkan MFR, densitas, ketahanan benturan dan HDT. ABS, PP, HDPE, LDPE, LLDPE, PC, PA6, PA66, POM, PMMA, EVA dari CHIMEI, LG Chem, Sinopec, SABIC. Sampel gratis, MOQ 1 ton, FOB Ningbo.' }
  },
  products: {
    path: 'products',
    en: { t: 'Polymer & Engineering Plastic Products by Category | Xianxunhe',
          d: 'Browse ABS, PP, PE, PC, PA6/PA66, POM, PMMA, EVA and PC/ABS by category and producer — {N} grades with datasheets and stock status. MOQ 1 ton, FOB Ningbo, free samples.' },
    zh: { t: '产品中心 — ABS/PP/PE/PC/PA/POM 品类与原厂品牌 | 纤讯和新材料',
          d: '按品类与生产企业浏览 ABS、PP、PE、PC、PA6/PA66、POM、PMMA、EVA、PC/ABS 共 {N} 个牌号，附物性表与现货状态。1 吨起订，FOB 宁波，免费样品。' },
    ru: { t: 'Полимеры и инженерные пластики по категориям | Xianxunhe',
          d: 'ABS, PP, PE, PC, PA6/PA66, POM, PMMA, EVA и PC/ABS по категориям и производителям — {N} марки с таблицами свойств и наличием. MOQ 1 тонна, FOB Нинбо.' },
    vi: { t: 'Sản phẩm nhựa polyme & kỹ thuật theo danh mục | Xianxunhe',
          d: 'Xem ABS, PP, PE, PC, PA6/PA66, POM, PMMA, EVA và PC/ABS theo danh mục và nhà sản xuất — {N} mã kèm bảng tính chất và tình trạng hàng. MOQ 1 tấn, FOB Ninh Ba.' },
    th: { t: 'ผลิตภัณฑ์โพลิเมอร์และพลาสติกวิศวกรรมตามหมวด | Xianxunhe',
          d: 'เลือกดู ABS, PP, PE, PC, PA6/PA66, POM, PMMA, EVA และ PC/ABS ตามหมวดและผู้ผลิต — {N} เกรดพร้อมตารางสมบัติและสถานะสินค้า MOQ 1 ตัน FOB หนิงโป' },
    id: { t: 'Produk Polimer & Plastik Teknik per Kategori | Xianxunhe',
          d: 'Jelajahi ABS, PP, PE, PC, PA6/PA66, POM, PMMA, EVA dan PC/ABS per kategori dan produsen — {N} grade dengan lembar data dan status stok. MOQ 1 ton, FOB Ningbo.' }
  },
  about: {
    path: 'about',
    en: { t: 'About Xianxunhe — Plastic Resin Distributor in Ningbo, China',
          d: 'Ningbo Xianxunhe New Materials supplies engineering and commodity plastics from CHIMEI, LG Chem, Sinopec, SABIC and more. {N} grades, MOQ 1 ton, FOB Ningbo, free samples 0.5–2 kg.' },
    zh: { t: '关于我们 — 宁波纤讯和新材料，工程塑料与通用塑料供应商',
          d: '宁波纤讯和新材料供应奇美、LG、中石化、SABIC 等原厂 ABS/PP/PE/PC/PA/POM 牌号，{N} 个牌号现货，1 吨起订，FOB 宁波，免费样品 0.5–2kg。' },
    ru: { t: 'О компании Xianxunhe — поставщик пластика в Нинбо, Китай',
          d: 'Ningbo Xianxunhe New Materials поставляет инженерные и товарные пластики CHIMEI, LG Chem, Sinopec, SABIC: {N} марки, MOQ 1 тонна, FOB Нинбо, бесплатные образцы 0,5–2 кг.' },
    vi: { t: 'Giới thiệu Xianxunhe — nhà phân phối nhựa tại Ninh Ba, Trung Quốc',
          d: 'Ningbo Xianxunhe New Materials cung cấp nhựa kỹ thuật và nhựa phổ thông từ CHIMEI, LG Chem, Sinopec, SABIC: {N} mã, MOQ 1 tấn, FOB Ninh Ba, mẫu miễn phí 0,5–2 kg.' },
    th: { t: 'เกี่ยวกับ Xianxunhe — ผู้จัดจำหน่ายพลาสติกในหนิงโป จีน',
          d: 'Ningbo Xianxunhe New Materials จัดหาพลาสติกวิศวกรรมและพลาสติกทั่วไปจาก CHIMEI, LG Chem, Sinopec, SABIC: {N} เกรด MOQ 1 ตัน FOB หนิงโป ตัวอย่างฟรี 0.5–2 กก.' },
    id: { t: 'Tentang Xianxunhe — Distributor Resin Plastik di Ningbo, Tiongkok',
          d: 'Ningbo Xianxunhe New Materials memasok plastik teknik dan komoditas dari CHIMEI, LG Chem, Sinopec, SABIC: {N} grade, MOQ 1 ton, FOB Ningbo, sampel gratis 0,5–2 kg.' }
  },
  contact: {
    path: 'contact',
    en: { t: 'Contact Xianxunhe — WhatsApp, Email & Ningbo Office',
          d: 'Quote within 30 minutes on business days. WhatsApp +86 152 6843 6369, email yize.chi@nbxianxunhe.com. Free samples 0.5–2 kg, MOQ 1 ton, FOB Ningbo, China.' },
    zh: { t: '联系我们 — WhatsApp、邮箱与宁波办公地址 | 纤讯和新材料',
          d: '工作日 30 分钟内报价。WhatsApp +86 152 6843 6369，邮箱 yize.chi@nbxianxunhe.com。免费样品 0.5–2kg，1 吨起订，FOB 宁波。' },
    ru: { t: 'Контакты Xianxunhe — WhatsApp, e-mail, офис в Нинбо',
          d: 'Цена в течение 30 минут в рабочие дни. WhatsApp +86 152 6843 6369, e-mail yize.chi@nbxianxunhe.com. Бесплатные образцы 0,5–2 кг, MOQ 1 тонна, FOB Нинбо.' },
    vi: { t: 'Liên hệ Xianxunhe — WhatsApp, email & văn phòng Ninh Ba',
          d: 'Báo giá trong 30 phút ngày làm việc. WhatsApp +86 152 6843 6369, email yize.chi@nbxianxunhe.com. Mẫu miễn phí 0,5–2 kg, MOQ 1 tấn, FOB Ninh Ba.' },
    th: { t: 'ติดต่อ Xianxunhe — WhatsApp อีเมล และสำนักงานหนิงโป',
          d: 'รับใบเสนอราคาภายใน 30 นาทีในวันทำการ WhatsApp +86 152 6843 6369 อีเมล yize.chi@nbxianxunhe.com ตัวอย่างฟรี 0.5–2 กก. MOQ 1 ตัน FOB หนิงโป' },
    id: { t: 'Kontak Xianxunhe — WhatsApp, Email & Kantor Ningbo',
          d: 'Penawaran dalam 30 menit pada hari kerja. WhatsApp +86 152 6843 6369, email yize.chi@nbxianxunhe.com. Sampel gratis 0,5–2 kg, MOQ 1 ton, FOB Ningbo.' }
  },
  news: {
    path: 'news',
    en: { t: 'Plastic Industry News & Market Notes | Xianxunhe',
          d: 'Chinaplas coverage, capacity expansions and resin market notes from Ningbo Xianxunhe New Materials — what actually moves ABS, PP and PE prices in Asia.' },
    zh: { t: '行业动态与市场札记 — 塑料原料资讯 | 纤讯和新材料',
          d: 'Chinaplas 展会报道、产能扩张与塑料原料市场动态，由宁波纤讯和新材料整理——影响亚洲 ABS、PP、PE 价格的真实变量。' },
    ru: { t: 'Новости отрасли и рынка пластика | Xianxunhe',
          d: 'Материалы о Chinaplas, расширении мощностей и рынке полимеров от Ningbo Xianxunhe New Materials — что реально двигает цены на ABS, PP и PE в Азии.' },
    vi: { t: 'Tin ngành nhựa & ghi chú thị trường | Xianxunhe',
          d: 'Tin Chinaplas, mở rộng công suất và thị trường nhựa từ Ningbo Xianxunhe New Materials — điều gì thực sự tác động giá ABS, PP và PE tại châu Á.' },
    th: { t: 'ข่าวอุตสาหกรรมพลาสติกและตลาด | Xianxunhe',
          d: 'ข่าว Chinaplas การขยายกำลังผลิต และข้อมูลตลาดเม็ดพลาสติกจาก Ningbo Xianxunhe New Materials — ปัจจัยที่ทำให้ราคา ABS, PP, PE ในเอเชียเคลื่อนไหว' },
    id: { t: 'Berita Industri Plastik & Catatan Pasar | Xianxunhe',
          d: 'Liputan Chinaplas, ekspansi kapasitas dan pasar resin dari Ningbo Xianxunhe New Materials — apa yang benar-benar menggerakkan harga ABS, PP dan PE di Asia.' }
  },
  calculator: {
    path: 'container-calculator',
    en: { t: 'Container Loading Calculator for Plastic Resin Bags | Xianxunhe',
          d: 'Calculate how many 25 kg resin bags fit a 20GP, 40GP or 40HQ container — palletized or floor-loaded, with net weight and carton count.' },
    zh: { t: '装柜计算器 — 塑料粒子 25kg 袋装柜量测算 | 纤讯和新材料',
          d: '快速计算 20GP、40GP、40HQ 集装箱能装多少 25kg 塑料粒子袋——托盘装或散装，含净重与件数。' },
    ru: { t: 'Калькулятор загрузки контейнера для мешков со смолой | Xianxunhe',
          d: 'Рассчитайте, сколько мешков по 25 кг входит в 20GP, 40GP или 40HQ — на паллетах или навалом, с чистым весом и количеством мест.' },
    vi: { t: 'Công cụ tính xếp container cho bao nhựa 25kg | Xianxunhe',
          d: 'Tính số bao nhựa 25 kg xếp vừa container 20GP, 40GP hoặc 40HQ — có pallet hoặc xếp sàn, kèm trọng lượng tịnh và số kiện.' },
    th: { t: 'เครื่องคำนวณการบรรจุตู้คอนเทนเนอร์สำหรับถุงเรซิน | Xianxunhe',
          d: 'คำนวณจำนวนถุงเรซิน 25 กก. ที่บรรจุในตู้ 20GP, 40GP หรือ 40HQ — แบบพาเลทหรือวางพื้น พร้อมน้ำหนักสุทธิและจำนวนชิ้น' },
    id: { t: 'Kalkulator Muat Container untuk Karung Resin 25 kg | Xianxunhe',
          d: 'Hitung berapa karung resin 25 kg yang muat di kontainer 20GP, 40GP atau 40HQ — palet atau tanpa palet, lengkap dengan berat bersih dan jumlah koli.' }
  }
};

function renderPage(res, page, lang, extra) {
  const settings = getSettings();
  const out = { lang, t: tr(lang), LANGS, settings, path: '/', ...SEO_DEFAULTS, ...extra };
  const PM = PAGE_META[page];
  const meta = extra.__meta || (PM ? (PM[lang] || PM.en) : null);
  // {N} = live count of active datasheets, so titles never go stale when grades are added
  const cnt = extra.__count || dsCount();
  if (meta) {
    if (!out.pageTitle) out.pageTitle = String(meta.t).replace(/\{N\}/g, cnt);
    if (!out.pageDesc) out.pageDesc = String(meta.d).replace(/\{N\}/g, cnt);
  }
  // canonical + hreflang: auto-derive from the page's language-neutral path
  const seoPath = extra.seoPath !== undefined ? extra.seoPath : (PM ? PM.path : '');
  if (!out.canonical) out.canonical = siteUrl(lang, seoPath);
  if (!out.langAlts) {
    out.langAlts = {};
    LANGS.forEach(function (l) { out.langAlts[l.code] = siteUrl(l.code, seoPath); });
  }
  if (!out.ogImage) out.ogImage = SITE + '/assets/og-default.png';
  res.render(page, out);
}

// partner brands: logo auto-detected from public/assets/brandlogos/<name>.<png|jpg|jpeg|svg|webp>
const PARTNER_GROUPS = [
  { key: 'global', brands: ['Dow','DuPont','ExxonMobil','BASF','SABIC','Covestro','LG Chem','Asahi Kasei','Solvay','Borealis','Mitsui','Idemitsu'] },
  { key: 'asian', brands: ['CHIMEI','Formosa','Polyplastics','USI'] },
  { key: 'china', brands: ['Sinopec','ZPC','BASF-YPC','Satellite Chemical','Yuntianhua','Shenhua','Donghua Energy','Haoran'] },
];
const LOGO_EXTS = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
function partnerGroups() {
  const logoDir = path.join(__dirname, 'public', 'assets', 'brandlogos');
  return PARTNER_GROUPS.map(g => ({
    key: g.key,
    brands: g.brands.map(name => {
      const file = name.replace(/[^a-zA-Z0-9-]/g, '_');
      let logo = null;
      for (const ext of LOGO_EXTS) {
        if (fs.existsSync(path.join(logoDir, file + ext))) { logo = '/assets/brandlogos/' + file + ext; break; }
      }
      return { name, logo };
    })
  }));
}

let sitemapCache = '', sitemapAt = 0;
app.get('/sitemap.xml', (req, res) => {
  if (!sitemapCache || Date.now() - sitemapAt > 3600e3) {
    const urls = allSiteUrls();
    sitemapCache = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map(u => '  <url><loc>https://www.nbxxh.com' + u + '</loc><changefreq>weekly</changefreq><priority>' +
        (u.indexOf('/grade/') > -1 ? '0.7' : (u.indexOf('/category/') > -1 ? '0.6' : '0.8')) + '</priority></url>').join('\n') +
      '\n</urlset>';
    sitemapAt = Date.now();
  }
  res.type('application/xml').send(sitemapCache);
});
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: https://www.nbxxh.com/sitemap.xml\n');
});

// ---------- home v2 (new design preview) ----------
const HOME_PARTNERS = [
  { name: 'CHIMEI 奇美', country: 'Taiwan, China / Zhenjiang', coreResin: 'ABS / PC / PMMA / PC+ABS' },
  { name: 'Formosa 台化', country: 'Taiwan, China / Ningbo', coreResin: 'ABS / PC / PP / PS' },
  { name: 'Lotte Chemical', country: 'Korea', coreResin: 'ABS / PP / PC' },
  { name: 'Mitsubishi', country: 'Japan', coreResin: 'PMMA / POM / PC' },
  { name: 'BASF', country: 'Germany', coreResin: 'PA6 / PA66 / TPU' },
  { name: 'Covestro', country: 'Germany', coreResin: 'PC (Makrolon) / TPU' },
  { name: 'SABIC', country: 'Saudi / Global', coreResin: 'Cycoloy PC/ABS / Lexan' },
  { name: 'Dow', country: 'USA', coreResin: 'POE / Specialty copolymers' }
];
const HOME_SPOT_POLY = ['ABS', 'PC', 'PP', 'HDPE', 'LDPE', 'PA6', 'POM', 'PMMA', 'PA66', 'PC/ABS'];

// real warehouse footage (already watermarked & compressed)
const HOME_MEDIA = [
  { type: 'video', src: '/assets/warehouse.mp4', poster: '/assets/warehouse-poster.jpg', key: 'v1' },
  { type: 'video', src: '/assets/warehouse-2.mp4', poster: '/assets/warehouse-2-poster.jpg', key: 'v2' },
  { type: 'photo', src: '/assets/warehouse-photo-1.jpg', key: 'p1' },
  { type: 'photo', src: '/assets/warehouse-photo-2.jpg', key: 'p2' }
];
const HOME_MEDIA_LABELS = {
  zh: { v1: '实拍视频 ①', v2: '实拍视频 ②', p1: '仓库实拍 ①', p2: '仓库实拍 ②' },
  en: { v1: 'Video 1', v2: 'Video 2', p1: 'Photo 1', p2: 'Photo 2' },
  ru: { v1: 'Видео 1', v2: 'Видео 2', p1: 'Фото 1', p2: 'Фото 2' },
  vi: { v1: 'Video 1', v2: 'Video 2', p1: 'Ảnh 1', p2: 'Ảnh 2' },
  th: { v1: 'วิดีโอ 1', v2: 'วิดีโอ 2', p1: 'รูป 1', p2: 'รูป 2' },
  id: { v1: 'Video 1', v2: 'Video 2', p1: 'Foto 1', p2: 'Foto 2' }
};

// home v2 renderer shared by /:lang (live home) and legacy preview route
function renderHomeV2(res, lang, langBase) {
  const h = IH[lang] || IH.en;
  const spot = [];
  const seen = {};

  // 1) manual picks from settings.home_grades ("GRADE|BRAND" list, comma/newline separated)
  const raw = String(getSettings().home_grades || '').trim();
  if (raw) {
    raw.split(/[,，;；\n]+/).forEach(function (part) {
      if (spot.length >= 9) return;
      const s = part.trim(); if (!s) return;
      const bits = s.split('|').map(x => x.trim());
      const g = bits[0], b = bits[1] || '';
      let row = null;
      if (b) {
        row = db.prepare("SELECT * FROM datasheets WHERE active=1 AND LOWER(grade)=LOWER(?) AND LOWER(brand) LIKE LOWER(?) ORDER BY CASE stock WHEN 'in_stock' THEN 0 ELSE 1 END LIMIT 1").get(g, '%' + b + '%');
      } else {
        row = db.prepare("SELECT * FROM datasheets WHERE active=1 AND LOWER(grade)=LOWER(?) ORDER BY CASE stock WHEN 'in_stock' THEN 0 ELSE 1 END LIMIT 1").get(g);
      }
      if (row && !seen[row.id]) {
        seen[row.id] = 1;
        rFix(row, lang);
        spot.push(row);
      }
    });
  }

  // 2) auto-fill remaining slots: one in-stock grade per polymer, fixed category priority
  for (const p of HOME_SPOT_POLY) {
    if (spot.length >= 9) break;
    const r = db.prepare("SELECT * FROM datasheets WHERE active=1 AND stock='in_stock' AND polymer=? ORDER BY id LIMIT 1").get(p);
    if (r && !seen[r.id]) {
      seen[r.id] = 1;
      rFix(r, lang);
      spot.push(r);
    }
  }

  const stats = {
    grades: db.prepare("SELECT COUNT(*) c FROM datasheets WHERE active=1").get().c,
    stock: db.prepare("SELECT COUNT(*) c FROM datasheets WHERE active=1 AND stock='in_stock'").get().c,
    brands: db.prepare("SELECT COUNT(DISTINCT brand) c FROM datasheets WHERE active=1").get().c
  };
  const stockLabel = function (s) {
    const m = (STOCK_MAP && STOCK_MAP[s]) || {};
    return m[lang] || m.en || s;
  };
  renderPage(res, 'home-v2', lang, {
    h, spot, stats, PARTNERS: HOME_PARTNERS, stockLabel, langBase,
    canonical: 'https://www.nbxxh.com/' + lang,
    media: HOME_MEDIA.map(m => Object.assign({}, m, { label: (HOME_MEDIA_LABELS[lang] || HOME_MEDIA_LABELS.en)[m.key] }))
  });
}

function rFix(r, lang) {
  r.slug = dsSlug(r.grade, r.brand);
  r.feat = String(r.features || '').split(';').map(s => s.trim()).filter(Boolean).slice(0, 3)
    .map(code => (FEAT_MAP[code] && (FEAT_MAP[code][lang] || FEAT_MAP[code].en)) || code);
}

app.get('/:lang/home-v2', (req, res) => {
  if (!validLang(req.params.lang)) return res.status(404).render('404', { lang: 'en', t: T.en, LANGS, settings: getSettings() });
  res.redirect(301, '/' + langOf(req));
});

app.get('/:lang', (req, res) => {
  if (!validLang(req.params.lang)) return res.status(404).render('404', { lang: 'en', t: T.en, LANGS, settings: getSettings() });
  const lang = langOf(req);
  renderHomeV2(res, lang, '/');
});

app.get('/:lang/products', (req, res) => {
  const lang = langOf(req);
  const cats = db.prepare('SELECT * FROM categories WHERE active=1 ORDER BY sort').all();
  const prods = db.prepare('SELECT p.*, c.slug AS cat_slug, c.name_en AS cat_name_en, c.name_zh AS cat_name_zh FROM products p JOIN categories c ON c.id=p.category_id WHERE p.active=1 ORDER BY p.sort').all();
  renderPage(res, 'products', lang, { cats, prods, cat: null, mode: 'browse' });
});

function gradeLabels(lang) {
  const o = {};
  FIELDS.forEach(function (f) { o[f.k] = { l: (f.l && f.l[lang]) || (f.l && f.l.en) || f.k, u: f.u || '' }; });
  o._stock = STOCK_MAP || {};
  return o;
}

function brandSlug(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'brand';
}

// datasheet index for property lookup (built once per request batch)
let dsIndex = {};
let dsIndexAt = 0;
function getDsIndex() {
  const n = db.prepare('SELECT COUNT(*) c, MAX(id) m FROM datasheets').get();
  const stamp = n.c + ':' + n.m;
  if (stamp !== dsIndexAt) {
    dsIndex = {};
    db.prepare('SELECT * FROM datasheets WHERE active=1').all().forEach(function (d) {
      dsIndex[String(d.brand || '').trim().toLowerCase() + '|' + String(d.grade || '').trim().toLowerCase()] = d;
    });
    dsIndexAt = stamp;
  }
  return dsIndex;
}

function catBrands(catSlug) {
  const cat = db.prepare('SELECT * FROM categories WHERE slug=?').get(catSlug);
  if (!cat) return [];
  const dmap = getDsIndex();
  const attach = function (items) {
    items.forEach(function (p) {
      p.ds = p.brand ? (dmap[String(p.brand).trim().toLowerCase() + '|' + String(p.grade || '').trim().toLowerCase()] || null) : null;
      p.grade_slug = p.ds ? dsSlug(p.grade, p.brand) : '';
    });
    return items;
  };
  // admin-maintained brands take priority
  const blist = db.prepare('SELECT * FROM brands WHERE category_id=? AND active=1 ORDER BY sort, name_en').all(cat.id).map(function (b) {
    const items = attach(db.prepare('SELECT p.*, c.slug AS cat_slug FROM products p JOIN categories c ON c.id=p.category_id WHERE p.active=1 AND p.brand_id=? ORDER BY p.grade').all(b.id));
    return { id: b.id, brand: b.name_en, name_zh: b.name_zh, slug: b.slug || brandSlug(b.name_en), image: b.image, count: items.length, items: items };
  });
  if (blist.length) return blist;
  // fallback: aggregate from product text fields (legacy data)
  const list = attach(db.prepare("SELECT p.*, c.slug AS cat_slug FROM products p JOIN categories c ON c.id=p.category_id WHERE p.active=1 AND c.slug=? ORDER BY p.brand, p.grade").all(catSlug));
  const map = {};
  list.forEach(function (p) {
    const b = p.brand || '—';
    if (!map[b]) map[b] = { brand: b, items: [], image: '' };
    map[b].items.push(p);
    if (!map[b].image && p.image) map[b].image = p.image;
  });
  return Object.values(map).map(function (g) {
    return { brand: g.brand, slug: brandSlug(g.brand), image: g.image, count: g.items.length, items: g.items };
  });
}

// 品类页动态 meta：标题带品类名 + 牌号数，避免所有品类共用「产品中心」标题
function catSeoMeta(lang, cat, brands) {
  const nm = (lang === 'zh' ? (cat.name_zh || cat.name_en) : (cat.name_en || cat.name_zh)) || '';
  const list = brands || [];
  // 注意：这里只报牌号数，不报厂家数。`brands` 来自 products/brands 表（有品牌页的厂家），
  // 不等于实际供货厂家总数（如 ABS 库里有奇美/LG/台化/乐天/高桥等），报厂家数会误导。
  const n = list.reduce(function (s, b) { return s + (b.items ? b.items.length : 0); }, 0);
  const M = {
    en: { t: nm + ' Resins — ' + n + ' Grades, Datasheets & Stock | Xianxunhe',
          d: 'Browse ' + n + ' ' + nm + ' grades with datasheet values, MFR, density and stock status. MOQ 1 ton, FOB Ningbo, free samples 0.5–2 kg.' },
    zh: { t: nm + '物性表 — ' + n + ' 个牌号，现货供应 | 纤讯和新材料',
          d: '浏览 ' + nm + ' 共 ' + n + ' 个牌号，附物性表、熔融指数、密度与现货状态。1 吨起订，FOB 宁波，免费样品。' },
    ru: { t: nm + ' — ' + n + ' марок, таблицы свойств и наличие | Xianxunhe',
          d: 'Каталог ' + nm + ': ' + n + ' марок с таблицами свойств, ПТР, плотностью и наличием. MOQ 1 тонна, FOB Нинбо, бесплатные образцы.' },
    vi: { t: nm + ' — ' + n + ' mã, bảng tính chất và tồn kho | Xianxunhe',
          d: 'Danh mục ' + nm + ': ' + n + ' mã kèm bảng tính chất, MFR, khối lượng riêng và tình trạng hàng. MOQ 1 tấn, FOB Ninh Ba, mẫu miễn phí.' },
    th: { t: nm + ' — ' + n + ' เกรด ตารางสมบัติและสถานะสินค้า | Xianxunhe',
          d: 'รายการ ' + nm + ': ' + n + ' เกรด พร้อมตารางสมบัติ MFR ความหนาแน่น และสถานะสินค้า MOQ 1 ตัน FOB หนิงโป ตัวอย่างฟรี' },
    id: { t: nm + ' — ' + n + ' Grade, Lembar Data dan Stok | Xianxunhe',
          d: 'Katalog ' + nm + ': ' + n + ' grade dengan data properti, MFR, densitas dan status stok. MOQ 1 ton, FOB Ningbo, sampel gratis.' }
  };
  return M[lang] || M.en;
}

// 品牌页动态 meta（如 /category/abs/chimei）：6 语言，品牌名保留原文
function catBrandSeoMeta(lang, cat, brand) {
  const nm = (lang === 'zh' ? (cat.name_zh || cat.name_en) : (cat.name_en || cat.name_zh)) || '';
  const bn = (brand && brand.brand) || (brand && brand.name) || '';
  const n = brand && brand.items ? brand.items.length : 0;
  const M = {
    en: { t: bn + ' ' + nm + ' — ' + n + ' Grades & Datasheets | Xianxunhe',
          d: 'Browse ' + n + ' ' + bn + ' ' + nm + ' grades with datasheet values, MFR, density and stock status. MOQ 1 ton, FOB Ningbo, free samples 0.5–2 kg.' },
    zh: { t: bn + ' ' + nm + ' — ' + n + ' 个牌号物性表 | 纤讯和新材料',
          d: '浏览 ' + bn + ' ' + nm + ' 共 ' + n + ' 个牌号，附物性表、熔融指数、密度与现货状态。1 吨起订，FOB 宁波，免费样品。' },
    ru: { t: bn + ' ' + nm + ' — ' + n + ' марок и таблицы свойств | Xianxunhe',
          d: 'Каталог ' + bn + ' ' + nm + ': ' + n + ' марок с таблицами свойств, ПТР, плотностью и наличием. MOQ 1 тонна, FOB Нинбо, бесплатные образцы.' },
    vi: { t: bn + ' ' + nm + ' — ' + n + ' mã và bảng tính chất | Xianxunhe',
          d: 'Danh mục ' + bn + ' ' + nm + ': ' + n + ' mã kèm bảng tính chất, MFR, khối lượng riêng và tình trạng hàng. MOQ 1 tấn, FOB Ninh Ba.' },
    th: { t: bn + ' ' + nm + ' — ' + n + ' เกรดและตารางสมบัติ | Xianxunhe',
          d: 'รายการ ' + bn + ' ' + nm + ': ' + n + ' เกรด พร้อมตารางสมบัติ MFR ความหนาแน่น และสถานะสินค้า MOQ 1 ตัน FOB หนิงโป' },
    id: { t: bn + ' ' + nm + ' — ' + n + ' Grade dan Lembar Data | Xianxunhe',
          d: 'Katalog ' + bn + ' ' + nm + ': ' + n + ' grade dengan data properti, MFR, densitas dan status stok. MOQ 1 ton, FOB Ningbo.' }
  };
  return M[lang] || M.en;
}

app.get('/:lang/category/:cat', (req, res) => {
  const lang = langOf(req);
  const cat = db.prepare('SELECT * FROM categories WHERE slug=? AND active=1').get(req.params.cat);
  if (!cat) return res.status(404).render('404', { lang, t: tr(lang), LANGS, settings: getSettings() });
  const cats = db.prepare('SELECT * FROM categories WHERE active=1 ORDER BY sort').all();
  const brands = catBrands(cat.slug);
  renderPage(res, 'products', lang, {
    cats, cat, mode: 'brands', brands, prods: [], GL: gradeLabels(lang),
    __meta: catSeoMeta(lang, cat, brands), seoPath: 'category/' + cat.slug
  });
});

app.get('/:lang/category/:cat/:brand', (req, res) => {
  const lang = langOf(req);
  const cat = db.prepare('SELECT * FROM categories WHERE slug=? AND active=1').get(req.params.cat);
  if (!cat) return res.status(404).render('404', { lang, t: tr(lang), LANGS, settings: getSettings() });
  const brands = catBrands(cat.slug);
  const brand = brands.find(b => b.slug === String(req.params.brand).toLowerCase());
  if (!brand) return res.status(404).render('404', { lang, t: tr(lang), LANGS, settings: getSettings() });
  const cats = db.prepare('SELECT * FROM categories WHERE active=1 ORDER BY sort').all();
  renderPage(res, 'products', lang, {
    cats, cat, mode: 'brand', brand, brands, prods: brand.items, GL: gradeLabels(lang),
    __meta: catBrandSeoMeta(lang, cat, brand), seoPath: 'category/' + cat.slug + '/' + brand.slug
  });
});

app.get('/:lang/products/:slug', (req, res) => {
  const lang = langOf(req);
  const p = db.prepare('SELECT p.*, c.slug AS cat_slug FROM products p JOIN categories c ON c.id=p.category_id WHERE p.slug=? AND p.active=1').get(req.params.slug);
  if (!p) return res.status(404).render('404', { lang, t: tr(lang), LANGS, settings: getSettings() });
  p.specs = p.specs ? JSON.parse(p.specs) : [];
  const related = db.prepare('SELECT * FROM products WHERE category_id=? AND id<>? AND active=1 LIMIT 4').all(p.category_id, p.id);
  renderPage(res, 'product', lang, { p, related });
});

// ---------- SEO: per-grade landing pages ----------
const TM_MAP = {
  mfr: 'ASTM D1238 / ISO 1133', density: 'ASTM D792 / ISO 1183', tensile: 'ASTM D638 / ISO 527',
  elong: 'ASTM D638 / ISO 527', flex_mod: 'ASTM D790 / ISO 178', flex_str: 'ASTM D790 / ISO 178',
  izod: 'ASTM D256 / ISO 180', charpy: 'ISO 179', hardness: 'ASTM D785',
  hdt: 'ASTM D648 / ISO 75', vicat: 'ASTM D1525 / ISO 306', melt_point: 'ISO 11357',
  transmittance: 'ASTM D1003', haze: 'ASTM D1003', gloss: 'ASTM D523',
  water_abs: 'ASTM D570 / ISO 62', ash: 'ISO 3451'
};
const POLY_CAT = {
  'ABS': 'abs', 'PC': 'pc', 'PC/ABS': 'pc-abs', 'PA6': 'pa6', 'PA66': 'pa66', 'POM': 'pom',
  'EVA': 'eva', 'PP': 'pp', 'HDPE': 'hdpe', 'LDPE': 'ldpe', 'LLDPE': 'lldpe',
  'PMMA': 'pmma', 'PVC': 'pvc', 'PET': 'pet', 'PBT': 'pbt', 'TPU': 'tpu', 'TPE': 'tpe',
  'PPS': 'pps', 'LCP': 'lcp', 'PLA': 'bio', 'PBAT': 'bio', 'TPS': 'bio'
};
function dsCatSlug(r) {
  if (r.polymer === 'PS') return String(r.features || '').indexOf('high impact') >= 0 ? 'hips' : 'gpps';
  return POLY_CAT[r.polymer] || '';
}
const SEC_OF = {
  mfr: 'phys', density: 'phys', water_abs: 'phys', ash: 'phys',
  tensile: 'mech', elong: 'mech', flex_mod: 'mech', flex_str: 'mech', izod: 'mech', charpy: 'mech', hardness: 'mech',
  hdt: 'therm', vicat: 'therm', melt_point: 'therm',
  transmittance: 'opt', haze: 'opt', gloss: 'opt'
};

let dsListCache = null, dsListAt = 0;
function dsList() {
  const n = db.prepare('SELECT COUNT(*) c FROM datasheets').get().c;
  if (n !== dsListAt || !dsListCache) {
    dsListCache = db.prepare('SELECT * FROM datasheets WHERE active=1 ORDER BY polymer, brand, grade').all();
    dsListCache.forEach(function (d) { d.slug = dsSlug(d.grade, d.brand); });
    dsListAt = n;
  }
  return dsListCache;
}
function dsSlug(g, b) {
  const s = function (v) { return String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); };
  const a = s(g), c = s(b);
  return c ? a + '-' + c : a;
}

// ---------- programmatic SEO: polymer processing guide (industry-typical values) ----------
const PROC_GUIDE = {
  'ABS':      { dry: '80–85 °C',  dryH: '2–4 h',  melt: '200–240 °C', mold: '40–80 °C',  warn: 'abs' },
  'PP':       { dry: '—',         dryH: '—',     melt: '180–230 °C', mold: '20–50 °C',  warn: '' },
  'HDPE':     { dry: '—',         dryH: '—',     melt: '180–240 °C', mold: '20–60 °C',  warn: '' },
  'LDPE':     { dry: '—',         dryH: '—',     melt: '160–200 °C', mold: '20–40 °C',  warn: '' },
  'LLDPE':    { dry: '—',         dryH: '—',     melt: '190–230 °C', mold: '20–40 °C',  warn: '' },
  'PC':       { dry: '120 °C',    dryH: '3–4 h', melt: '270–320 °C', mold: '80–120 °C', warn: 'hydro' },
  'PC/ABS':   { dry: '100–110 °C',dryH: '2–4 h', melt: '240–290 °C', mold: '60–90 °C',  warn: 'hydro' },
  'PA6':      { dry: '80 °C',     dryH: '4–8 h', melt: '230–280 °C', mold: '60–100 °C', warn: 'hydro' },
  'PA66':     { dry: '80 °C',     dryH: '4–8 h', melt: '260–300 °C', mold: '70–110 °C', warn: 'hydro' },
  'POM':      { dry: '80–90 °C',  dryH: '1–2 h', melt: '190–210 °C', mold: '60–120 °C', warn: 'pom' },
  'PMMA':     { dry: '80–90 °C',  dryH: '2–4 h', melt: '220–250 °C', mold: '50–90 °C',  warn: '' },
  'EVA':      { dry: '—',         dryH: '—',     melt: '140–180 °C', mold: '20–40 °C',  warn: 'eva' },
  'TPU':      { dry: '80–90 °C',  dryH: '2–3 h', melt: '180–220 °C', mold: '20–40 °C',  warn: 'hydro' },
  'TPE':      { dry: '—',         dryH: '—',     melt: '180–220 °C', mold: '20–40 °C',  warn: '' },
  'PLA':      { dry: '45–55 °C',  dryH: '4–6 h', melt: '190–220 °C', mold: '20–40 °C',  warn: 'hydro' },
  'LCP':      { dry: '120–140 °C',dryH: '3–4 h', melt: '280–350 °C', mold: '80–120 °C', warn: '' }
};

app.get('/:lang/grade/:slug', (req, res) => {
  const lang = langOf(req);
  const r = dsList().find(x => x.slug === String(req.params.slug).toLowerCase());
  if (!r) return res.status(404).render('404', { lang, t: tr(lang), LANGS, settings: getSettings() });
  const GT = (TG[lang] || TG.en);
  const L = function (k) { return (k && GT[k]) || ''; };

  // property rows grouped by section
  const groups = { phys: [], mech: [], therm: [], opt: [] };
  FIELDS.forEach(function (f) {
    const v = r[f.k];
    if (v === null || v === undefined || v === '') return;
    const sec = SEC_OF[f.k] || 'phys';
    groups[sec].push({
      label: (f.l && (f.l[lang] || f.l.en)) || f.k,
      value: v, unit: f.u || '',
      cond: f.k === 'mfr' ? (r.mfr_cond || '') : '',
      tm: TM_MAP[f.k] || ''
    });
  });
  // features / process localised
  const feats = String(r.features || '').split(';').map(s => s.trim()).filter(Boolean)
    .map(c => (FEAT_MAP[c] && (FEAT_MAP[c][lang] || FEAT_MAP[c].en)) || c);
  const procs = String(r.process || '').split(';').map(s => s.trim()).filter(Boolean)
    .map(c => (PROC_MAP[c] && (PROC_MAP[c][lang] || PROC_MAP[c].en)) || c).join(' · ');
  const stockLabel = (STOCK_MAP[r.stock] && (STOCK_MAP[r.stock][lang] || STOCK_MAP[r.stock].en)) || '';

  // related: same brand first, then same polymer
  const all = dsList();
  const sameBrand = all.filter(x => x.brand === r.brand && x.slug !== r.slug).slice(0, 5);
  const samePoly = all.filter(x => x.brand !== r.brand && x.polymer === r.polymer).slice(0, 4);
  const related = sameBrand.concat(samePoly).slice(0, 8);

  // ---------- programmatic SEO content: overview / FAQ / processing guide ----------
  const fill = function (s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/#G#/g, r.grade).replace(/#B#/g, r.brand || '')
      .replace(/#P#/g, r.polymer || '').replace(/#O#/g, r.origin || '')
      .replace(/#M#/g, r.mfr !== null && r.mfr !== undefined ? r.mfr : '')
      .replace(/#C#/g, r.mfr_cond || '').replace(/#D#/g, r.density !== null && r.density !== undefined ? r.density : '')
      .replace(/#T#/g, r.tensile !== null && r.tensile !== undefined ? r.tensile : '')
      .replace(/#I#/g, r.izod !== null && r.izod !== undefined ? r.izod : (r.charpy !== null && r.charpy !== undefined ? r.charpy : ''))
      .replace(/#H#/g, r.hdt !== null && r.hdt !== undefined ? r.hdt : '')
      .replace(/#V#/g, r.vicat !== null && r.vicat !== undefined ? r.vicat : '')
      .replace(/#A#/g, r.apps || '').replace(/#F#/g, feats.join(' · '))
      .replace(/#S#/g, stockLabel);
  };
  // key-values sentence built from available data
  const specBits = [];
  if (r.mfr !== null && r.mfr !== undefined) specBits.push((L('gd_w_mfr') || 'MFR') + ' ' + r.mfr + ' g/10 min' + (r.mfr_cond ? ' (' + r.mfr_cond + ')' : ''));
  if (r.density !== null && r.density !== undefined) specBits.push((L('gd_w_dens') || 'density') + ' ' + r.density + ' g/cm³');
  if (r.tensile !== null && r.tensile !== undefined) specBits.push((L('gd_w_tens') || 'tensile strength') + ' ' + r.tensile + ' MPa');
  if (specBits.length) specBits[specBits.length - 1] = (L('gd_w_and') || 'and') + ' ' + specBits[specBits.length - 1];
  const gd = {
    about_t: fill(L('gd_about_t')),
    proc_t: fill(L('gd_proc_t')),
    faq_t: fill(L('gd_faq_t')),
    p1: fill(L('gd_p1')),
    p2: fill(L('gd_p2')).replace('#X#', specBits.join(' · ')),
    p3: fill(L('gd_p3'))
  };
  // FAQ: only emit a Q/A when the underlying data exists
  const faq = [];
  const QA = [
    ['gd_q_mfr', 'gd_a_mfr', r.mfr !== null && r.mfr !== undefined],
    ['gd_q_dens', 'gd_a_dens', r.density !== null && r.density !== undefined],
    ['gd_q_tens', 'gd_a_tens', r.tensile !== null && r.tensile !== undefined],
    ['gd_q_izod', 'gd_a_izod', (r.izod !== null && r.izod !== undefined) || (r.charpy !== null && r.charpy !== undefined)],
    ['gd_q_hdt', 'gd_a_hdt', r.hdt !== null && r.hdt !== undefined],
    ['gd_q_vicat', 'gd_a_vicat', r.vicat !== null && r.vicat !== undefined],
    ['gd_q_maker', 'gd_a_maker', !!r.brand],
    ['gd_q_apps', 'gd_a_apps', !!r.apps],
    ['gd_q_stock', 'gd_a_stock', true]
  ];
  QA.forEach(function (pair) { if (pair[2] && L(pair[0])) faq.push({ q: fill(L(pair[0])), a: fill(L(pair[1])) }); });
  // processing guide for this polymer
  const pg = PROC_GUIDE[r.polymer] || null;

  // category mapping for breadcrumb
  const catSlug = dsCatSlug(r);
  const catRow = catSlug ? db.prepare('SELECT name_zh, name_en FROM categories WHERE slug=?').get(catSlug) : null;
  const catName = catRow ? (lang === 'zh' ? catRow.name_zh : catRow.name_en) : '';

  const site = getSettings();
  const mfrTxt = r.mfr !== null && r.mfr !== undefined ? String(r.mfr) : '';

  // P1: application keywords in <title> / <meta description> — capture long-tail searches
  // like "ABS for TV housing" / "PP for automotive parts". `apps` is a comma-separated
  // list of English industry terms (no translations in DB); keep the original terms
  // (standard international trade vocabulary, same as the FAQ answers) and localize
  // only the connector. Take the first 2 terms and cap length so titles stay readable.
  // Split on TOP-LEVEL commas only: commas inside parentheses (e.g. "Auto parts
  // (radiator grille, lamp bezel, side mirror)") belong to one phrase, and slashes
  // stay inside words ("Grey/natural", "hot/cold water pipe").
  const appRaw = String(r.apps || '');
  const appParts = [];
  let _depth = 0, _cur = '';
  for (let _i = 0; _i < appRaw.length; _i++) {
    const _ch = appRaw[_i];
    if (_ch === '(' || _ch === '[') _depth++;
    else if (_ch === ')' || _ch === ']') _depth--;
    if ((_ch === ',' || _ch === ';') && _depth === 0) {
      if (_cur.trim()) appParts.push(_cur.trim());
      _cur = '';
    } else _cur += _ch;
  }
  if (_cur.trim()) appParts.push(_cur.trim());
  // Long parenthetical examples add little to a SERP title — keep the head term.
  const appBits = appParts.map(function (s) {
    const p = s.indexOf('(');
    return (p > 0 ? s.slice(0, p) : s).trim();
  }).filter(Boolean).slice(0, 2);
  let appTxt = appBits.join(' / ');
  if (appTxt.length > 48) appTxt = appBits[0].slice(0, 48);
  const APP_CONJ = { en: ' for ', zh: ' 用于 ', ru: ' для ', vi: ' cho ', th: ' สำหรับ ', id: ' untuk ' };
  const appPhrase = appTxt ? (APP_CONJ[lang] || APP_CONJ.en) + appTxt : '';
  const shortSite = lang === 'zh' ? '纤讯和新材料' : 'Xianxunhe';

  const TT = {
    en: r.grade + ' ' + r.polymer + appPhrase + ' | ' + r.brand + ' Datasheet | ' + shortSite,
    zh: r.grade + ' ' + r.polymer + appPhrase + ' — ' + r.brand + ' 物性表 | ' + shortSite,
    ru: r.grade + ' ' + r.polymer + appPhrase + ' | ' + r.brand + ' | ' + shortSite,
    vi: r.grade + ' ' + r.polymer + appPhrase + ' | ' + r.brand + ' | ' + shortSite,
    th: r.grade + ' ' + r.polymer + appPhrase + ' | ' + r.brand + ' | ' + shortSite,
    id: r.grade + ' ' + r.polymer + appPhrase + ' | ' + r.brand + ' | ' + shortSite
  };
  const DD = {
    en: r.grade + ' (' + r.brand + ') ' + r.polymer + ' technical datasheet' + (mfrTxt ? ': MFR ' + mfrTxt + ' g/10min' : '') +
      (r.density ? ', density ' + r.density + ' g/cm3' : '') + (r.tensile ? ', tensile ' + r.tensile + ' MPa' : '') +
      (r.apps ? '. Applications: ' + r.apps + '.' : '.') + ' In stock from Ningbo, MOQ 1 ton, FOB Ningbo. Free sample 0.5-2kg.',
    zh: r.grade + '（' + r.brand + '）' + r.polymer + ' 物性表' + (mfrTxt ? '：熔融指数 ' + mfrTxt + ' g/10min' : '') +
      (r.density ? '，密度 ' + r.density + ' g/cm³' : '') + (r.tensile ? '，拉伸强度 ' + r.tensile + ' MPa' : '') +
      (r.apps ? '。应用：' + r.apps + '。' : '。') + '宁波现货，1 吨起订，FOB 宁波，免费样品 0.5–2kg。'
  };
  const pageTitle = TT[lang] || TT.en;
  const pageDesc = DD[lang] || DD.en;
  const canon = 'https://www.nbxxh.com/' + lang + '/grade/' + r.slug;
  const langAlts = {};
  LANGS.forEach(function (l) { langAlts[l.code] = 'https://www.nbxxh.com/' + l.code + '/grade/' + r.slug; });

  const jsonld = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: r.grade + ' ' + r.polymer,
    brand: { '@type': 'Brand', name: r.brand },
    material: r.polymer,
    category: r.polymer + ' resin',
    description: pageDesc,
    sku: r.brand + '-' + r.grade,
    offers: {
      '@type': 'Offer',
      availability: r.stock === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      priceCurrency: 'USD',
      eligibleQuantity: { '@type': 'QuantitativeValue', minValue: 1, unitCode: 'TNE' },
      seller: { '@type': 'Organization', name: site.site_name_en }
    }
  };

  renderPage(res, 'grade', lang, {
    r, GT, phys: groups.phys, mech: groups.mech, therm: groups.therm, opt: groups.opt,
    feats, process_cn: procs, stockLabel, related, catSlug, catName, jsonld,
    gd, faq, pg,
    pageTitle, pageDesc, canonical: canon, canonPath: 'grade/' + r.slug, langAlts,
    ogType: 'product', path: 'grades', extraCss: '/static/css/grades.css?v=20261024a'
  });
});

// ---------- sitemap / robots ----------
function allSiteUrls() {
  const langs = LANGS.map(function (l) { return l.code; });
  const urls = [];
  langs.forEach(function (l) {
    urls.push('/' + l, '/' + l + '/products', '/' + l + '/grades', '/' + l + '/about', '/' + l + '/contact',
      '/' + l + '/news', '/' + l + '/privacy', '/' + l + '/terms', '/' + l + '/container-calculator');
  });
  const cats = db.prepare('SELECT slug FROM categories WHERE active=1').all();
  const brands = db.prepare('SELECT b.slug, c.slug AS cat FROM brands b JOIN categories c ON c.id=b.category_id WHERE b.active=1').all();
  const gs = dsList();
  langs.forEach(function (l) {
    cats.forEach(function (c) { urls.push('/' + l + '/category/' + c.slug); });
    brands.forEach(function (b) { urls.push('/' + l + '/category/' + b.cat + '/' + b.slug); });
    gs.forEach(function (g) { urls.push('/' + l + '/grade/' + g.slug); });
  });
  return urls;
}
// ---------- grade datasheet (物性表) ----------
app.get('/:lang/grades', (req, res) => {
  const lang = langOf(req);
  const rows = db.prepare('SELECT * FROM datasheets WHERE active=1 ORDER BY sort, polymer, brand, grade').all();
  const brands = [...new Set(rows.map(r => (r.brand || '').trim()).filter(Boolean))].sort();
  const polymers = [...new Set(rows.map(r => (r.polymer || '').trim()).filter(Boolean))].sort();
  renderPage(res, 'grades', lang, {
    rows, brands, polymers, path: 'grades', langBase: '/grades',
    FIELDS, PROC_MAP, FEAT_MAP, STOCK_MAP, SHORT, SHORT_L: SHORT[lang] || SHORT.en,
    TG_L: TG[lang] || TG.en
  });
});

app.get('/:lang/about', (req, res) => renderPage(res, 'about', langOf(req), {}));
app.get('/:lang/news', (req, res) => {
  const lang = langOf(req);
  const news = db.prepare('SELECT * FROM news WHERE active=1 ORDER BY date DESC').all();
  renderPage(res, 'news', lang, { news });
});
app.get('/:lang/contact', (req, res) => renderPage(res, 'contact', langOf(req), {}));

// ---------- legal pages (privacy / terms) ----------
// 欧盟买家、Google Ads / B2B 平台审核的硬门槛；页脚已挂链接。
function renderLegal(res, kind, lang) {
  const pack = LEGAL[lang] || LEGAL.en;
  const raw = pack[kind] || LEGAL.en[kind];
  const email = getSettings().email || '';
  // {EMAIL} 占位符统一替换为后台设置里的邮箱，全站单一数据源
  const d = { t: raw.t, up: raw.up, s: raw.s.map(function (x) { return [x[0], String(x[1]).replace(/\{EMAIL\}/g, email)]; }) };
  renderPage(res, 'legal', lang, {
    LG: { d, slug: kind },
    pageTitle: d.t + ' — Ningbo Xianxunhe New Materials',
    pageDesc: String(d.s[0][1]).slice(0, 155),
    seoPath: kind
  });
}
app.get('/:lang/privacy', (req, res) => renderLegal(res, 'privacy', langOf(req)));
app.get('/:lang/terms', (req, res) => renderLegal(res, 'terms', langOf(req)));

// ---------- container loading calculator (customer-facing tool) ----------
app.get('/:lang/container-calculator', (req, res) => {
  const lang = langOf(req);
  renderPage(res, 'calculator', lang, {
    path: 'calculator', langBase: '/container-calculator',
    c: CALC[lang] || CALC.en
  });
});

// ---------- public API ----------
// grade autocomplete for the public RFQ form (no auth; only public grade fields)
app.get('/api/grades/suggest', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 20);
  if (!q) return res.json([]);
  const rows = db.prepare(
    "SELECT grade,brand,polymer,stock FROM datasheets WHERE active=1 AND (LOWER(grade) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(polymer) LIKE ?) ORDER BY CASE stock WHEN 'in_stock' THEN 0 ELSE 1 END, grade LIMIT ?"
  ).all('%' + q + '%', '%' + q + '%', '%' + q + '%', limit);
  res.json(rows);
});
app.post('/api/inquiry', (req, res) => {
  const { name, email, phone, company, message, product, lang } = req.body || {};
  if (!name || !message) return res.status(400).json({ error: 'missing_fields' });
  db.prepare('INSERT INTO inquiries(name,email,phone,company,message,product,lang) VALUES(?,?,?,?,?,?,?)')
    .run(name, email || '', phone || '', company || '', message, product || '', validLang(lang) ? lang : 'en');
  res.json({ ok: true });
});

// ---------- admin API ----------
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  const u = db.prepare('SELECT * FROM users WHERE username=?').get(username || '');
  if (!u || u.pass_hash !== hash(u.salt, password || '')) return res.status(401).json({ error: 'bad_credentials' });
  res.json({ token: makeToken(u.username), user: u.username });
});

app.post('/api/admin/logout', (req, res) => {
  const h = req.headers['authorization'] || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

app.post('/api/admin/password', requireAuth, (req, res) => {
  const { oldP, newP } = req.body || {};
  const u = db.prepare('SELECT * FROM users WHERE username=?').get(authUser(req));
  if (!u || u.pass_hash !== hash(u.salt, oldP || '')) return res.status(400).json({ error: 'bad_old' });
  if (!newP || newP.length < 4) return res.status(400).json({ error: 'weak' });
  const salt = crypto.randomBytes(8).toString('hex');
  db.prepare('UPDATE users SET pass_hash=?, salt=? WHERE id=?').run(hash(salt, newP), salt, u.id);
  res.json({ ok: true });
});

app.get('/api/admin/stats', requireAuth, (req, res) => {
  res.json({
    products: db.prepare('SELECT COUNT(*) c FROM products').get().c,
    categories: db.prepare('SELECT COUNT(*) c FROM categories').get().c,
    inquiries: db.prepare('SELECT COUNT(*) c FROM inquiries').get().c,
    newInquiries: db.prepare("SELECT COUNT(*) c FROM inquiries WHERE status='new'").get().c,
    news: db.prepare('SELECT COUNT(*) c FROM news').get().c
  });
});

app.get('/api/admin/products', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT p.*, c.slug AS cat_slug, c.name_zh AS cat_name FROM products p JOIN categories c ON c.id=p.category_id ORDER BY p.category_id, p.sort').all();
  res.json(rows);
});
app.post('/api/admin/products', requireAuth, (req, res) => {
  const p = req.body || {};
  if (!p.slug || !p.category_id) return res.status(400).json({ error: 'missing_fields' });
  if (db.prepare('SELECT id FROM products WHERE slug=?').get(p.slug)) return res.status(400).json({ error: 'dup_slug' });
  db.prepare(`INSERT INTO products(category_id,slug,sort,featured,active,name_en,name_zh,name_ru,name_vi,name_th,name_id,brand,grade,desc_en,desc_zh,specs,image,brand_id)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(p.category_id, p.slug, p.sort || 0, p.featured ? 1 : 0, p.active === false ? 0 : 1,
      p.name_en || '', p.name_zh || '', p.name_ru || '', p.name_vi || '', p.name_th || '', p.name_id || '',
      p.brand || '', p.grade || '', p.desc_en || '', p.desc_zh || '', JSON.stringify(p.specs || []), imgRel(p.image), p.brand_id || null);
  res.json({ ok: true, id: db.prepare('SELECT last_insert_rowid() id').get().id });
});
app.put('/api/admin/products/:id', requireAuth, (req, res) => {
  const p = req.body || {}; const id = req.params.id;
  db.prepare(`UPDATE products SET category_id=?,slug=?,sort=?,featured=?,active=?,name_en=?,name_zh=?,name_ru=?,name_vi=?,name_th=?,name_id=?,brand=?,grade=?,desc_en=?,desc_zh=?,specs=?,image=?,brand_id=? WHERE id=?`)
    .run(p.category_id, p.slug, p.sort || 0, p.featured ? 1 : 0, p.active === false ? 0 : 1,
      p.name_en || '', p.name_zh || '', p.name_ru || '', p.name_vi || '', p.name_th || '', p.name_id || '',
      p.brand || '', p.grade || '', p.desc_en || '', p.desc_zh || '', JSON.stringify(p.specs || []), imgRel(p.image), p.brand_id || null, id);
  res.json({ ok: true });
});

// ---------- brands (厂家，后台手动维护) ----------
app.get('/api/admin/brands', requireAuth, (req, res) => {
  const rows = db.prepare(`SELECT b.*, c.name_zh AS cat_name, c.slug AS cat_slug,
    (SELECT COUNT(*) FROM products p WHERE p.brand_id=b.id AND p.active=1) AS product_count
    FROM brands b JOIN categories c ON c.id=b.category_id ORDER BY b.category_id, b.sort, b.name_en`).all();
  res.json(rows);
});
app.post('/api/admin/brands', requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.category_id || !(b.name_en || b.name_zh)) return res.status(400).json({ error: 'missing_fields' });
  const slug = (b.slug || brandSlug(b.name_en || b.name_zh)).toLowerCase();
  const dup = db.prepare('SELECT id FROM brands WHERE category_id=? AND slug=?').get(b.category_id, slug);
  if (dup) return res.status(400).json({ error: 'duplicate', id: dup.id });
  db.prepare('INSERT INTO brands(category_id,slug,name_en,name_zh,image,sort,active) VALUES(?,?,?,?,?,?,?)')
    .run(b.category_id, slug, b.name_en || '', b.name_zh || b.name_en || '', imgRel(b.image), b.sort || 0, b.active === false ? 0 : 1);
  res.json({ ok: true, id: db.prepare('SELECT last_insert_rowid() id').get().id });
});
app.put('/api/admin/brands/:id', requireAuth, (req, res) => {
  const b = req.body || {}; const id = req.params.id;
  const slug = (b.slug || brandSlug(b.name_en || b.name_zh)).toLowerCase();
  db.prepare('UPDATE brands SET category_id=?,slug=?,name_en=?,name_zh=?,image=?,sort=?,active=? WHERE id=?')
    .run(b.category_id, slug, b.name_en || '', b.name_zh || b.name_en || '', imgRel(b.image), b.sort || 0, b.active === false ? 0 : 1, id);
  res.json({ ok: true });
});
app.delete('/api/admin/brands/:id', requireAuth, (req, res) => {
  db.prepare('UPDATE products SET brand_id=NULL WHERE brand_id=?').run(req.params.id);
  db.prepare('DELETE FROM brands WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});
app.delete('/api/admin/products/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM products WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

app.get('/api/admin/categories', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM categories ORDER BY sort').all());
});
app.post('/api/admin/categories', requireAuth, (req, res) => {
  const c = req.body || {};
  const slug = String(c.slug || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) return res.status(400).json({ error: 'missing_slug' });
  if (db.prepare('SELECT id FROM categories WHERE slug=?').get(slug)) return res.status(400).json({ error: 'duplicate' });
  db.prepare(`INSERT INTO categories(slug,sort,active,name_en,name_zh,name_ru,name_vi,name_th,name_id,brands,desc_en,desc_zh,apps_en,apps_zh,image)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(slug, c.sort || 0, c.active === false ? 0 : 1,
      c.name_en || '', c.name_zh || '', c.name_ru || '', c.name_vi || '', c.name_th || '', c.name_id || '',
      c.brands || '', c.desc_en || '', c.desc_zh || '', c.apps_en || '', c.apps_zh || '', imgRel(c.image));
  res.json({ ok: true, id: db.prepare('SELECT last_insert_rowid() id').get().id, slug: slug });
});
app.put('/api/admin/categories/:id', requireAuth, (req, res) => {
  const c = req.body || {};
  db.prepare(`UPDATE categories SET sort=?,active=?,name_en=?,name_zh=?,name_ru=?,name_vi=?,name_th=?,name_id=?,brands=?,desc_en=?,desc_zh=?,apps_en=?,apps_zh=?,image=? WHERE id=?`)
    .run(c.sort || 0, c.active === false ? 0 : 1, c.name_en || '', c.name_zh || '',
      c.name_ru || '', c.name_vi || '', c.name_th || '', c.name_id || '',
      c.brands || '', c.desc_en || '', c.desc_zh || '', c.apps_en || '', c.apps_zh || '', imgRel(c.image), req.params.id);
  res.json({ ok: true });
});
// delete a category. If it still holds brands/products, ask the client to confirm first (force=1).
app.delete('/api/admin/categories/:id', requireAuth, (req, res) => {
  const id = req.params.id;
  const cat = db.prepare('SELECT * FROM categories WHERE id=?').get(id);
  if (!cat) return res.status(404).json({ error: 'not_found' });
  const nb = db.prepare('SELECT COUNT(*) c FROM brands WHERE category_id=?').get(id).c;
  const np = db.prepare('SELECT COUNT(*) c FROM products WHERE category_id=?').get(id).c;
  const force = (req.body && req.body.force) || req.query.force === '1';
  if ((nb || np) && !force) return res.json({ error: 'not_empty', brands: nb, products: np });
  db.prepare('DELETE FROM products WHERE category_id=?').run(id);
  db.prepare('DELETE FROM brands WHERE category_id=?').run(id);
  db.prepare('DELETE FROM categories WHERE id=?').run(id);
  res.json({ ok: true, deletedBrands: nb, deletedProducts: np });
});

// bulk delete
app.post('/api/admin/products/bulk-delete', requireAuth, (req, res) => {
  const ids = (req.body && req.body.ids) || [];
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'no_ids' });
  const st = db.prepare('DELETE FROM products WHERE id=?');
  let n = 0;
  ids.forEach(function (id) { n += st.run(id).changes; });
  res.json({ ok: true, deleted: n });
});
app.post('/api/admin/brands/bulk-delete', requireAuth, (req, res) => {
  const ids = (req.body && req.body.ids) || [];
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'no_ids' });
  let n = 0;
  ids.forEach(function (id) {
    db.prepare('UPDATE products SET brand_id=NULL WHERE brand_id=?').run(id);
    n += db.prepare('DELETE FROM brands WHERE id=?').run(id).changes;
  });
  res.json({ ok: true, deleted: n });
});

app.get('/api/admin/news', requireAuth, (req, res) => res.json(db.prepare('SELECT * FROM news ORDER BY date DESC').all()));
app.post('/api/admin/news', requireAuth, (req, res) => {
  const n = req.body || {};
  db.prepare('INSERT INTO news(title_en,title_zh,body_en,body_zh,image,date,active) VALUES(?,?,?,?,?,?,?)')
    .run(n.title_en || '', n.title_zh || '', n.body_en || '', n.body_zh || '', imgRel(n.image), n.date || new Date().toISOString().slice(0, 10), n.active === false ? 0 : 1);
  res.json({ ok: true });
});
app.put('/api/admin/news/:id', requireAuth, (req, res) => {
  const n = req.body || {};
  db.prepare('UPDATE news SET title_en=?,title_zh=?,body_en=?,body_zh=?,image=?,date=?,active=? WHERE id=?')
    .run(n.title_en || '', n.title_zh || '', n.body_en || '', n.body_zh || '', imgRel(n.image), n.date || '', n.active === false ? 0 : 1, req.params.id);
  res.json({ ok: true });
});
app.delete('/api/admin/news/:id', requireAuth, (req, res) => { db.prepare('DELETE FROM news WHERE id=?').run(req.params.id); res.json({ ok: true }); });

app.get('/api/admin/inquiries', requireAuth, (req, res) => res.json(db.prepare('SELECT * FROM inquiries ORDER BY id DESC').all()));
app.put('/api/admin/inquiries/:id', requireAuth, (req, res) => {
  db.prepare('UPDATE inquiries SET status=? WHERE id=?').run(req.body.status === 'handled' ? 'handled' : 'new', req.params.id);
  res.json({ ok: true });
});
app.delete('/api/admin/inquiries/:id', requireAuth, (req, res) => { db.prepare('DELETE FROM inquiries WHERE id=?').run(req.params.id); res.json({ ok: true }); });

// ---------- grade datasheets (admin) ----------
const DS_TEXT = ['grade','brand','polymer','process','features','apps','certs','origin','stock','mfr_cond','hardness','moq','package','price_note','tds_url','coa_url','yellow_card','remark','source_level'];
const DS_NUM = ['mfr','density','tensile','elong','flex_mod','flex_str','izod','charpy','hdt','vicat','melt_point','transmittance','haze','gloss','water_abs','ash'];
function dsNum(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}
function dsStock(s) {
  const v = String(s === null || s === undefined ? '' : s).trim().toLowerCase();
  if (!v) return 'on_request';
  if (/^(in_stock|in stock|instock|available|现货|有货|在库)$/.test(v)) return 'in_stock';
  if (/^(out|out of stock|none|缺货|无货|断货)$/.test(v)) return 'out';
  return 'on_request';
}
function dsNorm(d) {
  const o = {};
  for (const k of DS_TEXT) o[k] = String(d[k] === null || d[k] === undefined ? '' : d[k]).trim();
  for (const k of DS_NUM) o[k] = dsNum(d[k]);
  o.stock = dsStock(o.stock);
  if (o.polymer && /^[\x20-\x7e]+$/.test(o.polymer)) o.polymer = o.polymer.toUpperCase();
  // normalise well-known process codes to lowercase so the UI can translate them
  o.process = o.process.split(/[;；,，、]+/).map(s => s.trim()).filter(Boolean)
    .map(s => (/^[\x20-\x7e]+$/.test(s) ? s.toLowerCase() : s)).join(';');
  o.features = o.features.split(/[;；]+/).map(s => s.trim()).filter(Boolean)
    .map(s => (/^[\x20-\x7e]+$/.test(s) ? s.toLowerCase() : s)).join(';');
  return o;
}
function dsUpsert(d) {
  const o = dsNorm(d);
  if (!o.grade) return { ok: false, err: 'no_grade' };
  if (!o.stock) o.stock = 'on_request';
  const ex = db.prepare("SELECT id FROM datasheets WHERE IFNULL(brand,'')=? AND grade=?").get(o.brand, o.grade);
  if (ex) {
    const sets = DS_TEXT.concat(DS_NUM).map(k => k + '=?').join(',');
    db.prepare('UPDATE datasheets SET ' + sets + ' WHERE id=?').run(...DS_TEXT.concat(DS_NUM).map(k => o[k]), ex.id);
    return { ok: true, id: ex.id, mode: 'update' };
  }
  const cols = DS_TEXT.concat(DS_NUM).join(',');
  const qs = DS_TEXT.concat(DS_NUM).map(() => '?').join(',');
  db.prepare('INSERT INTO datasheets(' + cols + ') VALUES(' + qs + ')').run(...DS_TEXT.concat(DS_NUM).map(k => o[k]));
  return { ok: true, id: db.prepare('SELECT last_insert_rowid() id').get().id, mode: 'insert' };
}

app.get('/api/admin/datasheets', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM datasheets ORDER BY polymer, brand, grade').all());
});
// grade autocomplete for the quotation system (lightweight fields only)
app.get('/api/admin/grades/suggest', requireAuth, (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const limit = Math.min(parseInt(req.query.limit, 10) || 15, 30);
  const SEL = "SELECT grade,brand,polymer,stock,features,apps,mfr,mfr_cond,density,moq FROM datasheets WHERE active=1";
  const rows = q
    ? db.prepare(SEL + " AND (LOWER(grade) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(polymer) LIKE ?) ORDER BY CASE stock WHEN 'in_stock' THEN 0 ELSE 1 END, grade LIMIT ?")
        .all('%' + q + '%', '%' + q + '%', '%' + q + '%', limit)
    : db.prepare(SEL + " AND stock='in_stock' ORDER BY grade LIMIT ?").all(limit);
  res.json(rows);
});
app.post('/api/admin/datasheets', requireAuth, (req, res) => {
  const r = dsUpsert(req.body || {});
  if (!r.ok) return res.status(400).json({ error: r.err });
  res.json(r);
});
app.post('/api/admin/datasheets/import', requireAuth, (req, res) => {
  const rows = (req.body && req.body.rows) || [];
  const replace = !!(req.body && req.body.replace);
  let ins = 0, upd = 0, skip = 0;
  db.exec('BEGIN');
  try {
    if (replace) db.exec('DELETE FROM datasheets');
    for (const r of rows) {
      const x = dsUpsert(r);
      if (!x.ok) { skip += 1; continue; }
      if (x.mode === 'insert') ins += 1; else upd += 1;
    }
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); return res.status(500).json({ error: String(e.message || e) }); }
  res.json({ ok: true, inserted: ins, updated: upd, skipped: skip, total: db.prepare('SELECT COUNT(*) c FROM datasheets').get().c });
});
app.delete('/api/admin/datasheets/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM datasheets WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});
app.post('/api/admin/datasheets/clear', requireAuth, (req, res) => {
  db.exec('DELETE FROM datasheets');
  res.json({ ok: true });
});

app.get('/api/admin/settings', requireAuth, (req, res) => res.json(getSettings()));
app.put('/api/admin/settings', requireAuth, (req, res) => {
  const allowed = ['site_name_en', 'site_name_zh', 'whatsapp', 'phone', 'email', 'addr_en', 'addr_zh', 'footer_note', 'home_grades'];
  for (const k of allowed) if (req.body[k] !== undefined) setSetting(k, String(req.body[k]));
  res.json({ ok: true });
});

// normalise image field: store path RELATIVE to /uploads (e.g. 'prod/x.jpg')
function imgRel(v) {
  v = String(v === null || v === undefined ? '' : v).trim();
  if (!v) return '';
  var pat = /^\/?uploads\//i;
  while (pat.test(v)) v = v.replace(pat, '');
  v = v.replace(/^\/+/, '');
  return v;
}
// image upload (base64 json)
app.post('/api/admin/upload', requireAuth, (req, res) => {
  const { name, data } = req.body || {};
  if (!data || !data.startsWith('data:')) return res.status(400).json({ error: 'bad_data' });
  const m = data.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
  if (!m) return res.status(400).json({ error: 'bad_image' });
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 8 * 1024 * 1024) return res.status(400).json({ error: 'too_large' });
  const fname = (name ? String(name).replace(/[^a-zA-Z0-9_-]/g, '_') : 'img') + '_' + Date.now() + '.' + ext;
  fs.mkdirSync(path.join(__dirname, 'public', 'uploads'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'public', 'uploads', fname), buf);
  res.json({ ok: true, url: '/uploads/' + fname });
});

// ---------- ERP 报价导入代理 ----------
// 报价工具（/admin-quote，同域）把报价单推送到柠檬 ERP；API Key 存服务端环境变量不进前端
const ERP_BASE = process.env.ERP_BASE_URL || 'http://127.0.0.1:8080/api';
const ERP_API_KEY = process.env.ERP_API_KEY || '';
app.post('/api/erp/quotation-import', requireAuth, async (req, res) => {
  if (!ERP_API_KEY) return res.status(500).json({ code: 500, msg: 'ERP 未配置：请在容器环境变量设置 ERP_API_KEY' });
  try {
    const r = await fetch(ERP_BASE + '/scm/quotation/import-web', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': ERP_API_KEY },
      body: JSON.stringify(req.body),
    });
    const data = await r.json().catch(() => ({ code: r.status, msg: 'ERP 返回异常（HTTP ' + r.status + '）' }));
    res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    res.status(502).json({ code: 502, msg: 'ERP 不可达：' + e.message + '（ERP_BASE_URL=' + ERP_BASE + '）' });
  }
});

app.use((req, res) => res.status(404).render('404', { lang: 'en', t: T.en, LANGS, settings: getSettings() }));

app.listen(PORT, () => console.log('Website running at http://localhost:' + PORT));
