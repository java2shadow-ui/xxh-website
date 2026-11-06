// One-time migration: aggregate existing products (text brand) into brands rows
// and backfill products.brand_id. Idempotent: skips (category_id, slug) already present.
const fs = require('fs');
const path = require('path');
const { db } = require(path.join(__dirname, '..', 'db'));

// reuse the zh mapping from sync_products.js without executing it
let BRAND_ZH = {};
try {
  const src = fs.readFileSync(path.join(__dirname, 'sync_products.js'), 'utf8');
  const m = src.match(/const BRAND_ZH = \{[\s\S]*?\};/);
  if (m) BRAND_ZH = new Function('return ' + m[0].replace('const BRAND_ZH =', '').trim())();
  else console.log('WARN: BRAND_ZH block not found in sync_products.js');
} catch (e) {
  console.log('WARN: BRAND_ZH unavailable (' + e.message + ') — falling back to English names');
}

function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'brand';
}

const cats = db.prepare('SELECT id FROM categories').all();
let created = 0, linked = 0;
cats.forEach(function (c) {
  const brands = db.prepare("SELECT DISTINCT brand FROM products WHERE category_id=? AND active=1 AND IFNULL(brand,'')!='' ORDER BY brand").all(c.id);
  brands.forEach(function (r, i) {
    const slug = slugify(r.brand);
    let b = db.prepare('SELECT id FROM brands WHERE category_id=? AND slug=?').get(c.id, slug);
    if (!b) {
      const img = db.prepare("SELECT image FROM products WHERE category_id=? AND brand=? AND IFNULL(image,'')!='' ORDER BY sort LIMIT 1").get(c.id, r.brand);
      db.prepare('INSERT INTO brands(category_id,slug,name_en,name_zh,image,sort,active) VALUES(?,?,?,?,?,?,1)')
        .run(c.id, slug, r.brand, BRAND_ZH[r.brand] || r.brand, img ? img.image : null, i);
      b = { id: db.prepare('SELECT last_insert_rowid() id').get().id };
      created++;
    }
    const res = db.prepare('UPDATE products SET brand_id=? WHERE category_id=? AND brand=? AND brand_id IS NULL').run(b.id, c.id, r.brand);
    linked += res.changes;
  });
});
console.log('brands created:', created, '| products linked:', linked,
  '| brands total:', db.prepare('SELECT COUNT(*) c FROM brands').get().c);
