/* RFQ grade autocomplete — 搜索式下拉建议（首页 + 内页共用）
 * 数据源：/api/grades/suggest（公开接口，查牌号库）
 * 交互对齐 Google：边打边搜、匹配高亮、↑↓ 选择、Enter 选中、Esc 关闭
 *
 * 关键：下拉挂到 body 上用 position:fixed 定位。
 * 因为询价弹窗内部是 overflow:auto 的滚动容器，绝对定位下拉会被裁掉。
 */
(function () {
  var DD = 'gs-dd';

  var LANG = (location.pathname.split('/')[1] || 'en').toLowerCase();
  if (!/^(en|zh|ru|vi|th|id)$/.test(LANG)) LANG = 'en';

  var TXT = {
    en: { s: 'Searching…', n: 'No match in library — press Enter to add anyway', c: 'matches' },
    zh: { s: '搜索中…', n: '库里没有这个牌号 — 回车仍可添加', c: '个匹配' },
    ru: { s: 'Поиск…', n: 'Нет в базе — нажмите Enter, чтобы добавить', c: 'совпадений' },
    vi: { s: 'Đang tìm…', n: 'Không có trong kho — nhấn Enter để thêm', c: 'kết quả' },
    th: { s: 'กำลังค้นหา…', n: 'ไม่พบในคลัง — กด Enter เพื่อเพิ่ม', c: 'รายการ' },
    id: { s: 'Mencari…', n: 'Tidak ada di database — tekan Enter untuk menambah', c: 'hasil' }
  }[LANG];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function mark(text, q) {
    text = String(text == null ? '' : text);
    if (!q) return esc(text);
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.substr(i, q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }

  window.attachGradeSuggest = function (input, onPick) {
    if (!input) return;

    var dd = document.createElement('div');
    dd.className = DD;
    dd.style.display = 'none';
    document.body.appendChild(dd);

    var items = [], hi = -1, timer = null, reqId = 0, lastQ = '', loading = false;

    function hide() {
      dd.style.display = 'none';
      hi = -1;
      loading = false;
      reqId++;                                   // 让在途请求失效，避免关掉后又自己弹出来
    }

    // 固定定位：跟随输入框，下方放不下就向上翻
    function place() {
      if (dd.style.display === 'none') return;
      var box = input.closest('.hv2-tagbox') || input;
      var r = box.getBoundingClientRect();
      var h = Math.min(dd.scrollHeight || 240, 260);
      var gap = 6;
      var below = window.innerHeight - r.bottom - gap;
      var above = r.top - gap;
      var top;
      if (below >= h || below >= above) top = r.bottom + gap;
      else top = r.top - h - gap;
      if (top < 4) top = 4;
      dd.style.position = 'fixed';
      dd.style.left = r.left + 'px';
      dd.style.right = 'auto';
      dd.style.width = r.width + 'px';
      dd.style.top = top + 'px';
      dd.style.bottom = 'auto';
      dd.style.maxHeight = h + 'px';
    }

    function render() {
      var html = '';
      items.forEach(function (r, i) {
        html += '<button type="button" class="gs-item' + (i === hi ? ' active' : '') + '" data-i="' + i + '">' +
          '<b>' + mark(r.grade, lastQ) + '</b>' +
          '<span>' + mark(r.brand, lastQ) + '</span>' +
          (r.stock === 'in_stock' ? '<em>现货</em>' : '') +
          '<i>' + esc(r.polymer) + '</i>' +
          '</button>';
      });
      if (items.length) {
        html += '<div class="gs-foot">' + (items.length >= 9 ? '9+' : items.length) + ' ' + esc(TXT.c) + '</div>';
      }
      dd.innerHTML = html;
      place();
      var act = dd.querySelector('.gs-item.active');
      if (act) {
        var t = act.offsetTop, vh = dd.clientHeight, st = dd.scrollTop;
        if (t < st) dd.scrollTop = t;
        else if (t + act.offsetHeight > st + vh) dd.scrollTop = t + act.offsetHeight - vh;
      }
    }

    function apply(rows) {
      items = rows || [];
      hi = items.length ? 0 : -1;
      if (!items.length) {
        dd.innerHTML = '<div class="gs-empty">' + esc(TXT.n) + '</div>';
        dd.style.display = 'block';
        place();
        return;
      }
      dd.style.display = 'block';
      render();
    }

    function pick(i) {
      var r = items[i];
      if (!r) return;
      onPick(r.grade);
      hide();
      input.value = '';
      try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
    }

    // 真正发起查询（防抖后调用；用户提前按回车时也直接调用）
    function doSearch(v) {
      if (!v) { hide(); return; }
      var my = ++reqId;
      loading = true;
      clearTimeout(timer);
      // 网络异常兜底：3 秒后放开回车，避免用户被卡死在“搜索中”
      var guard = setTimeout(function () { if (my === reqId) loading = false; }, 3000);

      fetch('/api/grades/suggest?q=' + encodeURIComponent(v) + '&limit=9')
        .then(function (r) { return r.json(); })
        .then(function (rows) {
          clearTimeout(guard);
          if (my !== reqId) return;
          loading = false;
          if (!Array.isArray(rows)) rows = [];
          if (rows.length === 1 && rows[0].grade.toLowerCase() === v.toLowerCase()) { hide(); return; }
          apply(rows);
        })
        .catch(function () {
          clearTimeout(guard);
          if (my === reqId) { loading = false; hide(); }
        });
    }

    input.addEventListener('input', function () {
      var v = input.value.trim();
      lastQ = v;
      clearTimeout(timer);
      if (!v) { hide(); return; }

      dd.innerHTML = '<div class="gs-empty">' + esc(TXT.s) + '</div>';
      dd.style.display = 'block';
      place();

      loading = true;                              // 从敲下第一个字起就算“搜索中”，回车必须被拦
      timer = setTimeout(function () { doSearch(v); }, 180);
    });

    // 键盘：必须绑在 document 的捕获阶段。
    // 同一元素上 capture/bubble 监听器是按注册顺序执行的（capture 不优先），
    // 而外层表单的「回车=添加标签」先注册，所以只能从 document 层提前截。
    document.addEventListener('keydown', function (e) {
      if (e.target !== input) return;
      var open = dd.style.display !== 'none';

      // 搜索还没返回时按回车：拦下来立即搜一次，别把半截文字当成牌号加进去
      if (e.key === 'Enter' && loading) {
        e.preventDefault(); e.stopPropagation();
        doSearch(input.value.trim());
        return;
      }

      if (e.key === 'Escape') { if (open) { e.preventDefault(); hide(); } return; }
      if (!open || !items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault(); e.stopPropagation();
        hi = (hi + 1) % items.length; render();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault(); e.stopPropagation();
        hi = (hi - 1 + items.length) % items.length; render();
      } else if (e.key === 'Enter') {
        e.preventDefault(); e.stopPropagation();
        pick(hi < 0 ? 0 : hi);
      }
    }, true);

    dd.addEventListener('mousedown', function (e) {
      var b = e.target.closest('.gs-item');
      if (!b) return;
      e.preventDefault();
      pick(parseInt(b.getAttribute('data-i'), 10));
    });

    dd.addEventListener('mousemove', function (e) {
      var b = e.target.closest('.gs-item');
      if (!b) return;
      var i = parseInt(b.getAttribute('data-i'), 10);
      if (i !== hi) { hi = i; render(); }
    });

    input.addEventListener('blur', function () { setTimeout(hide, 150); });
    document.addEventListener('click', function (e) {
      if (!dd.contains(e.target) && e.target !== input) hide();
    });
    // 弹窗内滚动 / 窗口尺寸变化时重新定位，避免下拉与输入框脱节
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
  };
})();
