/* grades.js — grade datasheet finder: search, filter, detail, compare */
(function () {
  var DS = window.DS || [], GT = window.GT || {}, LANG = window.GLANG || 'en';
  function sl(v) { return String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function dsSlug(g, b) { var a = sl(g), c = sl(b); return c ? a + '-' + c : a; }
  var FIELDS = window.GFIELDS || [], PROC = window.GPROC || {}, FEAT = window.GFEAT || {};
  var STOCK = window.GSTOCK || {}, SET = window.GSETTINGS || {};
  var SH = (window.GSHORT || {})[LANG] || window.GSHORT_L || {};
  var TABLE_COLS = ['mfr', 'density', 'tensile', 'izod', 'hdt'];
  var MAXC = 4;
  var PAGE = 1, PER = 50, LAST_SIG = '';

  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  function num(v) { if (v === '' || v === null || v === undefined) return null; var n = Number(v); return isFinite(n) ? n : null; }
  function fmt(v) { var n = num(v); if (n === null) return '—'; return String(Math.round(n * 1000) / 1000); }
  function split(s) {
    if (!s) return [];
    return String(s).split(/[;；,，、\/|]+/).map(function (x) { return x.trim(); }).filter(Boolean);
  }
  // translate controlled vocabulary; unknown terms pass through untouched
  function trList(s, map) {
    return split(s).map(function (t) {
      var k = String(t).toLowerCase();
      return map[k] || map[t] || t;
    });
  }
  function stockLabel(s) { return STOCK[s] || s || ''; }
  function stockCls(s) { return s === 'in_stock' ? 'ok' : (s === 'out' ? 'no' : 'mid'); }

  // ---------- build vocabularies from data ----------
  var POLY = [], BRANDS = [], CERTS = [], PROCS = [], STOCKS = [];
  DS.forEach(function (r) {
    if (r.polymer && POLY.indexOf(r.polymer) < 0) POLY.push(r.polymer);
    if (r.brand && BRANDS.indexOf(r.brand) < 0) BRANDS.push(r.brand);
    if (r.stock && STOCKS.indexOf(r.stock) < 0) STOCKS.push(r.stock);
    split(r.certs).forEach(function (c) { if (CERTS.indexOf(c) < 0) CERTS.push(c); });
    split(r.process).forEach(function (p) { if (PROCS.indexOf(p) < 0) PROCS.push(p); });
  });
  POLY.sort(); BRANDS.sort(); CERTS.sort();

  var S = { q: '', poly: '', proc: '', brand: '', mfrMin: '', mfrMax: '', denMin: '', denMax: '', izod: '', hdt: '', certs: [], stock: [], sort: 'grade', ver: false };
  var PICK = [];

  // ---------- static controls ----------
  function buildChips() {
    var box = $('#gPoly'); if (!box) return;
    var h = '<button type="button" class="g-chip on" data-p="">' + esc(GT.g_all) + '</button>';
    POLY.forEach(function (p) { h += '<button type="button" class="g-chip" data-p="' + esc(p) + '">' + esc(p) + '</button>'; });
    box.innerHTML = h;
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.g-chip'); if (!b) return;
      S.poly = b.getAttribute('data-p');
      Array.prototype.forEach.call(box.children, function (c) { c.classList.toggle('on', c === b); });
      render();
    });
  }
  function buildPanel() {
    var sp = $('#fProc'); if (sp) {
      var h = '<option value="">' + esc(GT.g_all_proc) + '</option>';
      PROCS.forEach(function (p) { h += '<option value="' + esc(p) + '">' + esc(PROC[p] || p) + '</option>'; });
      sp.innerHTML = h;
      sp.addEventListener('change', function () { S.proc = sp.value; render(); });
    }
    var sb = $('#fBrand'); if (sb) {
      var h2 = '<option value="">' + esc(GT.g_all) + '</option>';
      BRANDS.forEach(function (b) { h2 += '<option value="' + esc(b) + '">' + esc(b) + '</option>'; });
      sb.innerHTML = h2;
      sb.addEventListener('change', function () { S.brand = sb.value; render(); });
    }
    var fc = $('#fCerts');
    if (fc) {
      fc.innerHTML = CERTS.map(function (c) {
        return '<label class="g-ck"><input type="checkbox" value="' + esc(c) + '"><span>' + esc(c) + '</span></label>';
      }).join('');
      fc.addEventListener('change', function () {
        S.certs = Array.prototype.slice.call(fc.querySelectorAll('input:checked')).map(function (i) { return i.value; });
        render();
      });
    }
    var fs = $('#fStock');
    if (fs) {
      fs.innerHTML = STOCKS.map(function (s) {
        return '<label class="g-ck"><input type="checkbox" value="' + esc(s) + '"><span>' + esc(stockLabel(s)) + '</span></label>';
      }).join('');
      fs.addEventListener('change', function () {
        S.stock = Array.prototype.slice.call(fs.querySelectorAll('input:checked')).map(function (i) { return i.value; });
        render();
      });
    }
    var bind = function (id, key) {
      var el = $(id); if (!el) return;
      el.addEventListener('input', function () { S[key] = el.value; render(); });
    };
    bind('#fMfrMin', 'mfrMin'); bind('#fMfrMax', 'mfrMax');
    bind('#fDenMin', 'denMin'); bind('#fDenMax', 'denMax');
    bind('#fIzod', 'izod'); bind('#fHdt', 'hdt');

    var q = $('#gq'); if (q) q.addEventListener('input', function () { S.q = q.value; render(); });
    var qc = $('#gqClear'); if (qc) qc.addEventListener('click', function () { q.value = ''; S.q = ''; render(); q.focus(); });
    var so = $('#gSort'); if (so) so.addEventListener('change', function () { S.sort = so.value; render(); });
    var fb = $('#gFilterBtn'), pn = $('#gPanel');
    if (fb && pn) fb.addEventListener('click', function () {
      var open = pn.style.display !== 'none';
      pn.style.display = open ? 'none' : 'block';
      $('#gFilterLabel').textContent = open ? GT.g_filter : GT.g_filter_hide;
    });
    var fr = $('#fReset'); if (fr) fr.addEventListener('click', resetFilters);

    // 「✓ TDS 已核对」快捷筛选：让核过的牌号一眼可找，不用翻页碰运气
    var vb = $('#gVerBtn');
    if (vb) {
      var vTotal = DS.filter(function (x) { return x.source_level === 'A'; }).length;
      if (vTotal) {
        vb.hidden = false;
        var vt = vb.querySelector('.g-vtxt');
        if (vt) vt.textContent = GT.g_ver_filter || 'TDS verified';
        var vc = $('#gVerCnt'); if (vc) vc.textContent = '(' + vTotal + ')';
        vb.addEventListener('click', function () {
          S.ver = !S.ver;
          vb.classList.toggle('on', S.ver);
          render();
        });
      }
    }
  }
  function resetFilters() {
    S.proc = ''; S.brand = ''; S.mfrMin = ''; S.mfrMax = ''; S.denMin = ''; S.denMax = '';
    S.izod = ''; S.hdt = ''; S.certs = []; S.stock = [];
    ['#fProc', '#fBrand', '#fMfrMin', '#fMfrMax', '#fDenMin', '#fDenMax', '#fIzod', '#fHdt'].forEach(function (i) {
      var el = $(i); if (el) el.value = '';
    });
    ['#fCerts', '#fStock'].forEach(function (i) {
      var el = $(i); if (!el) return;
      Array.prototype.forEach.call(el.querySelectorAll('input'), function (c) { c.checked = false; });
    });
    S.ver = false;
    var vb = $('#gVerBtn'); if (vb) vb.classList.remove('on');
    render();
  }
  function activeFilterCount() {
    var n = 0;
    ['proc', 'brand', 'mfrMin', 'mfrMax', 'denMin', 'denMax', 'izod', 'hdt'].forEach(function (k) { if (S[k]) n += 1; });
    return n + S.certs.length + S.stock.length;
  }

  // ---------- fuzzy search ----------
  // normalise: lowercase, drop separators/punctuation so "K-8003", "k 8003", "K8003" all match
  function norm(s) {
    return String(s === null || s === undefined ? '' : s).toLowerCase()
      .replace(/[\s\-_.·/\\()（）\[\]{}:：]+/g, '');
  }
  // searchable haystack per row; includes LOCALISED feature/process text so
  // a Chinese buyer can search 高抗冲 / 透明 and a Thai buyer can search Thai
  var HAY = {};
  function hayOf(r) {
    var key = String(r.id);
    if (HAY[key]) return HAY[key];
    var parts = [r.grade, r.brand, r.polymer, r.process, r.features, r.apps,
      r.origin, r.certs, r.remark, trList(r.features, FEAT).join(' '), trList(r.process, PROC).join(' ')];
    HAY[key] = norm(parts.map(function (x) { return String(x === null || x === undefined ? '' : x); }).join(' '));
    return HAY[key];
  }
  function lev(a, b) {
    if (a === b) return 0;
    if (Math.abs(a.length - b.length) > 2) return 3;
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j += 1) prev[j] = j;
    for (i = 1; i <= a.length; i += 1) {
      cur = [i];
      for (j = 1; j <= b.length; j += 1) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }
  // "did you mean" when a search returns nothing: nearest grade names
  function suggest(q) {
    var t = norm(q);
    if (!t || t.length < 2) return [];
    var scored = [];
    DS.forEach(function (r) {
      var g = norm(r.grade);
      if (!g) return;
      var d = lev(t, g);
      if (g.indexOf(t) >= 0 || t.indexOf(g) >= 0) d = 0;
      if (d <= 2) scored.push({ g: r.grade, d: d });
    });
    scored.sort(function (a, b) { return a.d - b.d; });
    var out = [], seen = {};
    scored.forEach(function (s) {
      if (out.length >= 3) return;
      if (seen[s.g]) return;
      seen[s.g] = 1; out.push(s.g);
    });
    return out;
  }

  // ---------- filtering ----------
  function match(r) {
    if (S.ver && r.source_level !== 'A') return false;
    if (S.poly && r.polymer !== S.poly) return false;
    if (S.brand && r.brand !== S.brand) return false;
    if (S.proc && split(r.process).indexOf(S.proc) < 0) return false;
    if (S.stock.length && S.stock.indexOf(r.stock) < 0) return false;
    if (S.certs.length) {
      var cs = split(r.certs).map(function (x) { return x.toLowerCase(); });
      for (var i = 0; i < S.certs.length; i += 1) {
        if (cs.indexOf(String(S.certs[i]).toLowerCase()) < 0) return false;
      }
    }
    var pairs = [['mfrMin', 'mfr', 1], ['mfrMax', 'mfr', -1], ['denMin', 'density', 1], ['denMax', 'density', -1], ['izod', 'izod', 1], ['hdt', 'hdt', 1]];
    for (var j = 0; j < pairs.length; j += 1) {
      var sv = num(S[pairs[j][0]]), rv = num(r[pairs[j][1]]);
      if (sv === null) continue;
      if (rv === null) return false;
      if (pairs[j][2] === 1 && rv < sv) return false;
      if (pairs[j][2] === -1 && rv > sv) return false;
    }
    if (S.q) {
      // multi-word search: every term must hit (AND). separators are ignored
      var terms = String(S.q).split(/[\s,，、;；]+/).map(norm).filter(Boolean);
      if (terms.length) {
        var hay = hayOf(r);
        for (var t = 0; t < terms.length; t += 1) {
          if (hay.indexOf(terms[t]) < 0) return false;
        }
      }
    }
    return true;
  }
  function sorted(rows) {
    var k = S.sort;
    return rows.sort(function (a, b) {
      if (k === 'grade') return String(a.grade).localeCompare(String(b.grade));
      if (k === 'brand') return String(a.brand || '').localeCompare(String(b.brand || '')) || String(a.grade).localeCompare(String(b.grade));
      var av = num(a[k]), bv = num(b[k]);
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return bv - av;
    });
  }

  // ---------- paging ----------
  // any change to the result set resets to page 1; paging itself / compare ticks keep the page
  function curSig() {
    return [S.poly, S.brand, S.proc, S.q, S.sort, S.stock.join(), S.certs.join(),
      S.mfrMin, S.mfrMax, S.denMin, S.denMax, S.izod, S.hdt, S.ver ? 'v' : ''].join('~');
  }
  function pageBtns(pages) {
    var out = [], add = function (p) { out.push(p); };
    if (pages <= 7) { for (var i = 1; i <= pages; i += 1) add(i); return out; }
    add(1);
    var lo = Math.max(2, PAGE - 1), hi = Math.min(pages - 1, PAGE + 1);
    if (lo > 2) out.push('…');
    for (var j = lo; j <= hi; j += 1) add(j);
    if (hi < pages - 1) out.push('…');
    add(pages);
    return out;
  }
  function renderPager(total, pages, from, shown) {
    var el = $('#gPager'); if (!el) return;
    if (!total) { el.innerHTML = ''; el.style.display = 'none'; return; }
    el.style.display = '';
    var info = String(GT.g_pg_info || '{a}–{b} / {c}')
      .replace('{a}', from + 1).replace('{b}', from + shown).replace('{c}', total);
    var h = '<div class="g-pg-info">' + esc(info) + '</div><div class="g-pg-nav">';
    h += '<button type="button" class="g-pg' + (PAGE <= 1 ? ' dis' : '') + '" data-pg="' + (PAGE - 1) + '"' + (PAGE <= 1 ? ' disabled' : '') + '>‹</button>';
    pageBtns(pages).forEach(function (p) {
      if (p === '…') { h += '<span class="g-pg-gap">…</span>'; return; }
      h += '<button type="button" class="g-pg' + (p === PAGE ? ' on' : '') + '" data-pg="' + p + '">' + p + '</button>';
    });
    h += '<button type="button" class="g-pg' + (PAGE >= pages ? ' dis' : '') + '" data-pg="' + (PAGE + 1) + '"' + (PAGE >= pages ? ' disabled' : '') + '>›</button>';
    h += '<select class="g-pg-per" id="gPer">' +
      [25, 50, 100].map(function (n) { return '<option value="' + n + '"' + (n === PER ? ' selected' : '') + '>' + n + '</option>'; }).join('') +
      '</select><span class="g-pg-lbl">' + esc(GT.g_per_page || 'per page') + '</span></div>';
    el.innerHTML = h;
  }

  // ---------- render ----------
  function render(forcePage) {
    var body = $('#gBody'); if (!body) return;
    if (forcePage) PAGE = forcePage;
    else { var sg = curSig(); if (sg !== LAST_SIG) { LAST_SIG = sg; PAGE = 1; } }
    var rows = sorted(DS.filter(match));
    var pages = Math.max(1, Math.ceil(rows.length / PER));
    if (PAGE > pages) PAGE = pages;
    var from = (PAGE - 1) * PER, pageRows = rows.slice(from, from + PER);
    var cnt = $('#gCount');
    if (cnt) cnt.innerHTML = '<b>' + rows.length + '</b> ' + esc(rows.length === 1 ? GT.g_found_1 : GT.g_found);
    var fc = $('#gFilterCount');
    if (fc) { var n = activeFilterCount(); fc.style.display = n ? '' : 'none'; fc.textContent = n; }
    var emp = $('#gEmpty'), tw = $('.g-tablewrap');
    if (emp) emp.style.display = rows.length ? 'none' : 'block';
    if (tw) tw.style.display = rows.length ? '' : 'none';
    var sug = $('#gSug');
    if (sug) {
      if (!rows.length && S.q) {
        var list = suggest(S.q);
        sug.innerHTML = list.length
          ? esc(GT.g_didyoumean || 'Did you mean') + ' ' + list.map(function (g) {
            return '<button type="button" class="g-sug-b" data-q="' + esc(g) + '">' + esc(g) + '</button>';
          }).join('')
          : '';
      } else sug.innerHTML = '';
    }

    body.innerHTML = pageRows.map(function (r) {
      var picked = PICK.indexOf(r.id) >= 0;
      var feats = trList(r.features, FEAT).slice(0, 3);
      var procs = trList(r.process, PROC);
      return '<tr data-id="' + r.id + '" class="' + (picked ? 'picked' : '') + '">' +
        '<td class="g-c-sel"><button type="button" class="g-cbox' + (picked ? ' on' : '') + '" data-pick="' + r.id + '" title="' + esc(GT.g_compare) + '">' +
          (picked ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5"><path d="M4 12l6 6L20 6"/></svg>' : '') +
        '</button></td>' +
        '<td class="g-c-grade"><b>' + esc(r.grade) + '</b>' + (r.source_level === 'A' ? '<i class="g-ver" title="' + esc(GT.g_ver_tip) + '">✓<span>TDS</span></i>' : '') + (r.stock ? '<i class="g-st ' + stockCls(r.stock) + '">' + esc(stockLabel(r.stock)) + '</i>' : '') + '</td>' +
        '<td>' + esc(r.brand || '—') + '</td>' +
        '<td class="g-hide-sm"><span class="g-poly">' + esc(r.polymer || '—') + '</span></td>' +
        '<td class="g-hide-sm g-c-proc">' + esc(procs.join(' · ') || '—') + '</td>' +
        '<td class="num" data-l="' + esc(SH.mfr) + '">' + fmt(r.mfr) + '</td>' +
        '<td class="num g-hide-sm" data-l="' + esc(SH.density) + '">' + fmt(r.density) + '</td>' +
        '<td class="num g-hide-sm" data-l="' + esc(SH.tensile) + '">' + fmt(r.tensile) + '</td>' +
        '<td class="num" data-l="' + esc(SH.izod) + '">' + fmt(r.izod) + '</td>' +
        '<td class="num g-hide-sm" data-l="' + esc(SH.hdt) + '">' + fmt(r.hdt) + '</td>' +
        '<td class="g-hide-md g-c-feat">' + (feats.length ? feats.map(function (f) { return '<em>' + esc(f) + '</em>'; }).join('') : '—') + '</td>' +
        '<td class="g-c-act"><button type="button" class="g-mini" data-view="' + r.id + '">' + esc(GT.g_detail) + '</button>' +
          '<a class="g-mini pri" href="' + inquireHref(r) + '">' + esc(GT.g_inquire) + '</a></td>' +
        '</tr>';
    }).join('');
    renderPager(rows.length, pages, from, pageRows.length);
  }

  function inquireHref(r) {
    var msg = encodeURIComponent('Inquiry — ' + (r.brand || '') + ' ' + r.grade + ' (' + (r.polymer || '') + ')');
    return '/' + LANG + '/contact?grade=' + encodeURIComponent(r.grade) + '&msg=' + msg;
  }

  // ---------- detail ----------
  function openDetail(id) {
    var r = DS.filter(function (x) { return x.id === id; })[0]; if (!r) return;
    $('#dBrand').textContent = r.brand || '';
    $('#dGrade').textContent = r.grade;
    var tags = [];
    if (r.polymer) tags.push('<span class="g-tag poly">' + esc(r.polymer) + '</span>');
    trList(r.process, PROC).forEach(function (p) { tags.push('<span class="g-tag">' + esc(p) + '</span>'); });
    if (r.stock) tags.push('<span class="g-tag st ' + stockCls(r.stock) + '">' + esc(stockLabel(r.stock)) + '</span>');
    if (r.origin) tags.push('<span class="g-tag">' + esc(r.origin) + '</span>');
    if (r.source_level === 'A') tags.push('<span class="g-tag ver" title="' + esc(GT.g_ver_tip) + '">✓ ' + esc(GT.g_ver_tag) + '</span>');
    $('#dTags').innerHTML = tags.join('');

    var h = '';
    // properties, grouped like the big datasheet portals (physical / mechanical / thermal / optical)
    var GROUPS = [
      ['g_sec_phys', ['mfr', 'density', 'water_abs', 'ash']],
      ['g_sec_mech', ['tensile', 'elong', 'flex_mod', 'flex_str', 'izod', 'charpy', 'hardness']],
      ['g_sec_therm', ['hdt', 'vicat', 'melt_point']],
      ['g_sec_opt', ['transmittance', 'haze', 'gloss']]
    ];
    var TM = {
      mfr: 'ASTM D1238 / ISO 1133', density: 'ASTM D792 / ISO 1183',
      tensile: 'ASTM D638 / ISO 527', elong: 'ASTM D638 / ISO 527',
      flex_mod: 'ASTM D790 / ISO 178', flex_str: 'ASTM D790 / ISO 178',
      izod: 'ASTM D256 / ISO 180', charpy: 'ISO 179 / ASTM D6110',
      hardness: 'ASTM D2240 / D785', hdt: 'ASTM D648 / ISO 75',
      vicat: 'ASTM D1525 / ISO 306', melt_point: 'ASTM D3418 (DSC)',
      transmittance: 'ASTM D1003', haze: 'ASTM D1003', gloss: 'ASTM D523',
      water_abs: 'ASTM D570', ash: 'ASTM D2584 / ISO 3451'
    };
    var prow = FIELDS.filter(function (f) {
      var v = r[f.k];
      return !(v === null || v === undefined || v === '');
    });
    var hasAny = prow.length > 0 || !!r.mfr_cond;
    if (hasAny) {
      GROUPS.forEach(function (grp) {
        var fields = prow.filter(function (f) { return grp[1].indexOf(f.k) >= 0; });
        if (!fields.length && !(grp[0] === 'g_sec_phys' && r.mfr_cond)) return;
        h += '<div class="g-sec">' + esc(GT[grp[0]] || '') + '</div><table class="g-dtable"><tbody>';
        fields.forEach(function (f) {
          var cond = f.k === 'mfr' ? (r.mfr_cond || '') : '';
          h += '<tr><th>' + esc(f.l[LANG] || f.l.en) + '</th><td>' + esc(f.text ? r[f.k] : fmt(r[f.k])) +
            (f.u ? ' <i>' + esc(f.u) + '</i>' : '') + '</td><td class="g-cond">' + esc(cond || TM[f.k] || '') + '</td></tr>';
        });
        h += '</tbody></table>';
      });
    }
    // descriptors
    var blocks = [
      [GT.g_features, trList(r.features, FEAT).join(' · ')],
      [GT.g_apps, r.apps],
      [GT.g_certs_l, r.certs],
      [GT.g_origin, r.origin]
    ].filter(function (b) { return b[1]; });
    if (blocks.length) {
      h += '<div class="g-sec">' + esc(GT.g_features) + ' &amp; ' + esc(GT.g_apps) + '</div><div class="g-kv">';
      blocks.forEach(function (b) { h += '<div class="g-kv-r"><span>' + esc(b[0]) + '</span><p>' + esc(b[1]) + '</p></div>'; });
      h += '</div>';
    }
    // commercial
    var com = [[GT.g_moq, r.moq], [GT.g_pack, r['package']], [GT.g_price, r.price_note]].filter(function (b) { return b[1]; });
    if (com.length) {
      h += '<div class="g-sec">' + esc(GT.g_commercial) + '</div><div class="g-kv">';
      com.forEach(function (b) { h += '<div class="g-kv-r"><span>' + esc(b[0]) + '</span><p>' + esc(b[1]) + '</p></div>'; });
      h += '</div>';
    }
    if (r.remark) h += '<p class="g-remark">' + esc(r.remark) + '</p>';
    h += '<p class="g-note">' + esc(GT.g_note) + '</p>';
    h += '<p style="margin:14px 0 0;text-align:center"><a class="btn btn-outline" href="/' + LANG + '/grade/' + dsSlug(r.grade, r.brand) + '">' + esc(GT.g_open_page || 'View full grade page') + '</a></p>';
    $('#dBody').innerHTML = h;

    $('#dInquire').setAttribute('href', inquireHref(r));
    var wa = (SET.whatsapp || '').replace(/[^0-9]/g, '');
    var txt = encodeURIComponent('Please send TDS / COA for ' + (r.brand || '') + ' ' + r.grade + ' (' + (r.polymer || '') + '). ' + GT.g_get_tds_s);
    $('#dTds').setAttribute('href', wa ? 'https://wa.me/' + wa + '?text=' + txt : 'mailto:' + (SET.email || '') + '?subject=' + encodeURIComponent('TDS / COA request — ' + r.grade) + '&body=' + txt);
    showModal('#gDetail');
  }

  // ---------- compare ----------
  function togglePick(id) {
    var i = PICK.indexOf(id);
    if (i >= 0) PICK.splice(i, 1);
    else {
      if (PICK.length >= MAXC) { alert(GT.g_cmp_max); return; }
      PICK.push(id);
    }
    renderTray(); render();
  }
  function renderTray() {
    var t = $('#gTray'); if (!t) return;
    t.style.display = PICK.length ? 'block' : 'none';
    document.body.classList.toggle('has-tray', PICK.length > 0);
    $('#gTrayChips').innerHTML = PICK.map(function (id) {
      var r = DS.filter(function (x) { return x.id === id; })[0] || {};
      return '<span class="g-tchip">' + esc(r.grade || '') + '<button type="button" data-unpick="' + id + '">&times;</button></span>';
    }).join('');
  }
  function openCompare() {
    if (!PICK.length) { return; }
    var rows = PICK.map(function (id) { return DS.filter(function (x) { return x.id === id; })[0]; }).filter(Boolean);
    var use = FIELDS.filter(function (f) {
      return rows.some(function (r) { var v = r[f.k]; return !(v === null || v === undefined || v === ''); });
    });
    var h = '<div class="g-cmpwrap"><table class="g-cmp"><thead><tr><th class="g-cmp-pl"></th>';
    rows.forEach(function (r) {
      h += '<th><span class="g-cmp-b">' + esc(r.brand || '—') + '</span><b>' + esc(r.grade) + '</b>' +
        '<span class="g-cmp-p">' + esc(r.polymer || '') + '</span>' +
        '<span class="g-tag st ' + stockCls(r.stock) + '">' + esc(stockLabel(r.stock)) + '</span></th>';
    });
    h += '</tr></thead><tbody>';
    use.forEach(function (f) {
      var vals = rows.map(function (r) { return f.text ? null : num(r[f.k]); });
      var best = null;
      if (f.dir) {
        var cand = vals.filter(function (v) { return v !== null; });
        if (cand.length > 1) {
          best = f.dir === 'up' ? Math.max.apply(null, cand) : Math.min.apply(null, cand);
          if (cand.every(function (v) { return v === cand[0]; })) best = null;
        }
      }
      h += '<tr><th>' + esc(f.l[LANG] || f.l.en) + (f.u ? ' <i>' + esc(f.u) + '</i>' : '') + '</th>';
      rows.forEach(function (r, i) {
        var v = r[f.k];
        var shown = (v === null || v === undefined || v === '') ? GT.g_cmp_empty : (f.text ? esc(v) : esc(fmt(v)));
        var isBest = best !== null && vals[i] === best;
        h += '<td class="' + (isBest ? 'best' : '') + '">' + shown + (isBest ? '<i class="g-best">' + esc(GT.g_cmp_best) + '</i>' : '') + '</td>';
      });
      h += '</tr>';
    });
    // descriptor rows
    [['proc', GT.g_col_proc, PROC], ['features', GT.g_features, FEAT], ['apps', GT.g_apps, null], ['certs', GT.g_certs_l, null]]
      .forEach(function (d) {
        if (!rows.some(function (r) { return r[d[0]]; })) return;
        h += '<tr class="g-cmp-desc"><th>' + esc(d[1]) + '</th>';
        rows.forEach(function (r) {
          var v = d[2] ? trList(r[d[0]], d[2]).join(' · ') : (r[d[0]] || '');
          h += '<td>' + esc(v || GT.g_cmp_empty) + '</td>';
        });
        h += '</tr>';
      });
    h += '</tbody></table></div>';
    h += '<p class="g-note">' + esc(GT.g_note) + '</p>';
    $('#cKicker').textContent = rows.length + ' × ' + GT.g_cmp_t;
    $('#cBody').innerHTML = h;
    showModal('#gCompare');
  }

  // ---------- modals ----------
  function showModal(sel) {
    var m = $(sel); if (!m) return;
    m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function hideModal(m) {
    if (!m) return;
    m.classList.remove('open'); m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var pk = e.target.closest('[data-pick]');
    if (pk) { e.stopPropagation(); togglePick(Number(pk.getAttribute('data-pick'))); return; }
    var up = e.target.closest('[data-unpick]');
    if (up) { togglePick(Number(up.getAttribute('data-unpick'))); return; }
    var vw = e.target.closest('[data-view]');
    if (vw) { openDetail(Number(vw.getAttribute('data-view'))); return; }
    var row = e.target.closest('#gBody tr');
    if (row && !e.target.closest('a')) { openDetail(Number(row.getAttribute('data-id'))); return; }
    if (e.target.closest('[data-close]')) {
      Array.prototype.forEach.call(document.querySelectorAll('.g-modal'), hideModal);
      return;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') Array.prototype.forEach.call(document.querySelectorAll('.g-modal'), hideModal);
  });

  var em = $('#gEmpty');
  if (em) em.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-q]'); if (!b) return;
    var q = $('#gq'); if (q) q.value = b.getAttribute('data-q');
    S.q = b.getAttribute('data-q'); render();
  });

  var pg = $('#gPager');
  if (pg) pg.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-pg]'); if (!b || b.disabled) return;
    var n = Number(b.getAttribute('data-pg'));
    if (!n || n === PAGE) return;
    render(n);
    var tw = $('.g-tablewrap'); if (tw) tw.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  if (pg) pg.addEventListener('change', function (e) {
    if (e.target.id !== 'gPer') return;
    PER = Number(e.target.value) || 50; render(1);
  });

  var tc = $('#gTrayClear'); if (tc) tc.addEventListener('click', function () { PICK = []; renderTray(); render(); });
  var tg = $('#gTrayGo'); if (tg) tg.addEventListener('click', openCompare);
  var cp = $('#cPrint'); if (cp) cp.addEventListener('click', function () { window.print(); });

  buildChips();
  buildPanel();
  render();
  renderTray();

  // deep link: ?q=k8003 pre-fills the search (shareable result link)
  try {
    var qq = new URLSearchParams(location.search).get('q');
    if (qq) {
      var qi = $('#gq'); if (qi) qi.value = qq;
      S.q = qq; LAST_SIG = ''; render(1);
    }
  } catch (e) { /* ignore */ }

  // deep link: /zh/grades?open=5000S opens the detail modal directly (shareable)
  try {
    var op = new URLSearchParams(location.search).get('open');
    if (op) {
      var hit = DS.filter(function (r) { return String(r.grade).toLowerCase() === String(op).toLowerCase(); })[0];
      if (hit) openDetail(hit.id);
    }
  } catch (e) { /* ignore */ }
})();
