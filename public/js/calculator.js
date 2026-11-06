/* Container loading calculator — client-side logic + CSS 3D visual (zero deps) */
(function () {
  var POLYMERS = [
    { p: 'PP', d: 0.905 }, { p: 'HDPE', d: 0.955 }, { p: 'LDPE', d: 0.922 },
    { p: 'LLDPE', d: 0.918 }, { p: 'ABS', d: 1.05 }, { p: 'PC', d: 1.20 },
    { p: 'PC/ABS', d: 1.12 }, { p: 'PA6', d: 1.14 }, { p: 'PA66', d: 1.14 },
    { p: 'POM', d: 1.41 }, { p: 'PMMA', d: 1.18 }, { p: 'EVA', d: 0.94 }
  ];
  // container spec: { vol(m3), weightLimit(T), palletVol, palletWeight }
  var C20 = { name: '20GP', vol: 33, wt: 27, pVol: 28, pWt: 18 };
  var C40 = { name: '40HQ', vol: 76, wt: 27, pVol: 66, pWt: 24 };
  var BULK = 0.62, PALLET = 0.55; // bag stacking factors

  var cur = { poly: POLYMERS[0], tons: 25 };

  // ---- i18n labels from the EJS-injected CALC object (window.CALC) ----
  var C = window.CALC || {};

  function calc(poly, tons) {
    var vol = tons / (poly.d * BULK);          // floor-loaded volume (m3)
    var pVol = tons / (poly.d * PALLET);       // palletized volume (m3)
    function cnt(spec, volUsed, weightT) {
      return Math.max(Math.ceil(weightT / spec.wt), Math.ceil(volUsed / spec.vol));
    }
    var f20 = cnt(C20, vol, tons), f40 = cnt(C40, vol, tons);
    var p20 = cnt(C20, pVol, tons), p40 = cnt(C40, pVol, tons);

    // pick recommended: fewer containers, then higher utilization
    function util(spec, n) { return Math.max(tons / n / spec.wt, vol / n / spec.vol) * 100; }
    var opts = [
      { c: C20, n: f20, mode: 'floor' }, { c: C40, n: f40, mode: 'floor' }
    ];
    opts.sort(function (a, b) { return a.n - b.n || util(b.c, b.n) - util(a.c, a.n); });
    var rec = opts[0];

    var palletRec = p20 <= p40 ? { c: C20, n: p20 } : { c: C40, n: p40 };
    return { vol: vol, f20: f20, f40: f40, p20: p20, p40: p40, rec: rec, palletRec: palletRec, util: util(rec.c, rec.n) };
  }

  function fmt(x) { return (Math.round(x * 10) / 10).toString(); }

  function render() {
    var r = calc(cur.poly, cur.tons);
    document.getElementById('calcDens').textContent = fmt(cur.poly.d);
    document.getElementById('calcTonsVal').textContent = cur.tons;

    // pills
    var pills = document.getElementById('calcPills');
    pills.innerHTML = '';
    POLYMERS.forEach(function (pl) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'calc-pill' + (pl.p === cur.poly.p ? ' on' : '');
      b.textContent = pl.p;
      b.onclick = function () { cur.poly = pl; render(); };
      pills.appendChild(b);
    });

    // metrics
    var m = document.getElementById('calcMetrics');
    m.innerHTML =
      '<div class="calc-metric"><div class="k">' + C.totalCbm + '</div><div class="v">' + fmt(r.vol) + ' <small>' + C.cbm + '</small></div></div>' +
      '<div class="calc-metric"><div class="k">' + C.weight + '</div><div class="v">' + cur.tons + ' <small>' + C.tons + '</small></div></div>' +
      '<div class="calc-metric hl"><div class="k">' + C.rec + '</div><div class="v">' + r.rec.n + ' × ' + r.rec.c.name + '</div></div>' +
      '<div class="calc-metric"><div class="k">' + C.utilization + '</div><div class="v">' + Math.round(r.util) + '<small>%</small></div></div>';

    // floor vs pallet compare
    var floorN = r.f20 <= r.f40 ? r.f20 + ' × 20GP' : r.f40 + ' × 40HQ';
    var palN = r.palletRec.n + ' × ' + r.palletRec.c.name;
    var floorWins = (r.f20 <= r.f40 ? r.f20 : r.f40) <= r.palletRec.n;
    var savN = Math.max(0, r.palletRec.n - (r.f20 <= r.f40 ? r.f20 : r.f40));
    document.getElementById('calcCompare').innerHTML =
      '<div class="cc-cell' + (floorWins ? ' win' : '') + '">' + (floorWins ? '<span class="tag">' + C.rec + '</span> ' : '') + C.floor + '<b>' + floorN + '</b>' +
        (savN > 0 ? '<span class="sav">' + C.save + ' ' + savN + ' ' + (savN > 1 ? C.containers : C.containers) + '</span>' : '<span class="sav">—</span>') + '</div>' +
      '<div class="cc-cell' + (!floorWins ? ' win' : '') + '">' + C.pallet + '<b>' + palN + '</b><span class="sav">—</span></div>';

    drawBox(r.rec, r.util);
  }

  // ---- CSS 3D container visual ----
  function drawBox(rec, utilPct) {
    var box = document.getElementById('calcBox');
    if (!box) return;
    box.innerHTML = '';
    var W = 210, H = 120, D = 110;
    var walls = [
      { cls: '', w: W, h: H, t: 'rotateY(0deg) translateZ(' + (D / 2) + 'px)', l: 0, t2: 0 },       // back
      { cls: '', w: D, h: H, t: 'rotateY(90deg) translateZ(' + (W / 2) + 'px)', l: W / 2 - D / 2, t2: 0 }, // left
      { cls: '', w: D, h: H, t: 'rotateY(-90deg) translateZ(' + (W / 2) + 'px)', l: W / 2 - D / 2, t2: 0 } // right
    ];
    // floor
    var floor = document.createElement('div');
    floor.className = 'wall';
    floor.style.cssText = 'width:' + W + 'px;height:' + D + 'px;left:0;top:' + (H - D) + 'px;transform:rotateX(90deg) translateZ(' + (-D / 2 + D) + 'px);opacity:.55';
    box.appendChild(floor);

    walls.forEach(function (w) {
      var el = document.createElement('div');
      el.className = 'wall';
      el.style.cssText = 'width:' + w.w + 'px;height:' + w.h + 'px;left:' + w.l + 'px;top:' + w.t2 + 'px;transform:' + w.t;
      box.appendChild(el);
    });

    // cargo blocks (layers mapped from utilization)
    var layers = Math.max(1, Math.min(4, Math.ceil((utilPct || 60) / 25)));
    var cols = 6, rows = 3;
    for (var L = 0; L < layers; L++) {
      for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          var bl = document.createElement('div');
          var bw = 26, bh = 16, bd = 26;
          var x = 14 + i * (bw + 4), y = H - D - 8 - L * (bh + 2), z = -D / 2 + 16 + j * (bd + 3);
          bl.style.cssText = 'position:absolute;width:' + bw + 'px;height:' + bh + 'px;left:' + x + 'px;top:' + y + 'px;transform:translateZ(' + z + 'px);background:#fff;border:1px solid #cbd8e6;border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,.12)';
          box.appendChild(bl);
        }
      }
    }
    // door frame hint
    var door = document.createElement('div');
    door.style.cssText = 'position:absolute;width:' + (W - 6) + 'px;height:' + (H - 6) + 'px;left:3px;top:3px;transform:translateZ(' + (D / 2 - 0.5) + 'px);border:2px dashed rgba(255,255,255,.25);border-radius:3px';
    box.appendChild(door);
    box.style.transform = 'rotateX(-24deg) rotateY(-32deg)';
  }

  // drag to rotate
  (function () {
    var scene = document.getElementById('calcScene'), box = document.getElementById('calcBox');
    if (!scene || !box) return;
    var rx = -24, ry = -32, down = false, sx = 0, sy = 0;
    scene.addEventListener('mousedown', function (e) { down = true; sx = e.clientX; sy = e.clientY; });
    window.addEventListener('mousemove', function (e) {
      if (!down) return;
      ry += (e.clientX - sx) * 0.4; rx -= (e.clientY - sy) * 0.4;
      rx = Math.max(-80, Math.min(80, rx)); sx = e.clientX; sy = e.clientY;
      box.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });
    window.addEventListener('mouseup', function () { down = false; });
    scene.addEventListener('touchstart', function (e) { down = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    scene.addEventListener('touchmove', function (e) {
      if (!down) return;
      ry += (e.touches[0].clientX - sx) * 0.4; rx -= (e.touches[0].clientY - sy) * 0.4;
      rx = Math.max(-80, Math.min(80, rx)); sx = e.touches[0].clientX; sy = e.touches[0].clientY;
      box.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    }, { passive: true });
    scene.addEventListener('touchend', function () { down = false; });
  })();

  // slider
  var range = document.getElementById('calcTons');
  if (range) range.addEventListener('input', function () { cur.tons = parseInt(range.value, 10) || 1; render(); });

  // CTA -> open RFQ with prefill
  var cta = document.getElementById('calcCta');
  if (cta) cta.addEventListener('click', function () {
    var r = calc(cur.poly, cur.tons);
    var plan = r.rec.n + ' x ' + r.rec.c.name + ' floor-loaded';
    var msgBox = document.getElementById('v2Msg');
    if (msgBox) msgBox.value = cur.tons + ' MT ' + cur.poly.p + ', ' + plan;
    if (typeof v2AddTag === 'function') v2AddTag(cur.poly.p);
    var rfq = document.getElementById('rfqBox');
    if (rfq) { rfq.classList.add('open'); rfq.classList.remove('sent'); document.body.style.overflow = 'hidden'; }
  });

  render();
})();
