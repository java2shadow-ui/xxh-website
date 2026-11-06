// main.js — inquiry form, scroll reveal, floating quick nav
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- inquiry form ---------- */
  var form = document.getElementById('rfqForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('rfqMsg');
      var fd = new FormData(form);
      var payload = {
        name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'),
        company: fd.get('company'), message: fd.get('message'),
        product: fd.get('product'), lang: form.getAttribute('data-lang') || 'en'
      };
      if (!payload.name || !payload.message) {
        msg.className = 'fmsg err'; msg.textContent = 'Please fill in the required fields.';
        return;
      }
      fetch('/api/inquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.ok) {
          msg.className = 'fmsg ok';
          msg.textContent = form.getAttribute('data-okmsg') || 'Thank you! Your inquiry has been received.';
          form.reset();
        } else {
          msg.className = 'fmsg err'; msg.textContent = 'Error, please try again.';
        }
      }).catch(function () {
        msg.className = 'fmsg err'; msg.textContent = 'Network error, please try again.';
      });
    });
  }

  /* ---------- scroll reveal (fail-safe: only hides when JS confirmed) ---------- */
  var revealEls = [];
  var vh = window.innerHeight || 800;
  document.querySelectorAll('section .wrap').forEach(function (el) {
    if (el.closest('.hero')) return;
    // tall containers (long lists): never animate, or short viewports would
    // never reach the visibility threshold and content stays hidden forever
    if (el.getBoundingClientRect().height > vh * 2) return;
    revealEls.push(el);
  });
  if (revealEls.length && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-anim');
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- floating quick nav (homepage sections) ---------- */
  var sections = document.querySelectorAll('section[id]');
  if (sections.length >= 4) {
    var nav = document.createElement('nav');
    nav.className = 'quick-nav';
    nav.setAttribute('aria-label', 'Quick navigation');
    var items = [];
    sections.forEach(function (sec) {
      var h = sec.querySelector('h2');
      if (!h) return;
      var label = h.textContent.trim();
      if (label.length > 22) label = label.slice(0, 21) + '…';
      items.push({ id: sec.id, label: label });
    });
    items.forEach(function (it, i) {
      var a = document.createElement('a');
      a.href = '#' + it.id;
      a.setAttribute('aria-label', it.label);
      a.innerHTML = '<i></i><em>' + it.label + '</em>';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(it.id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      nav.appendChild(a);
    });
    document.body.appendChild(nav);

    var links = nav.querySelectorAll('a');
    var setActive = function () {
      var pos = window.scrollY + window.innerHeight * 0.35;
      var current = null;
      sections.forEach(function (sec) {
        if (sec.offsetTop <= pos) current = sec.id;
      });
      links.forEach(function (l) {
        l.classList.toggle('on', l.getAttribute('href') === '#' + current);
      });
      nav.classList.toggle('show', window.scrollY > 420);
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

});
