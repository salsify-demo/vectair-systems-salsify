(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('site-menu');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', function () { setMenu(false); });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    return;
  }

  // scroll reveal
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function (el) { reveal.observe(el); });

  // active nav link
  var links = {};
  document.querySelectorAll('.menu ul a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      Object.keys(links).forEach(function (id) { links[id].classList.toggle('active', id === e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(links).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  // count-up numbers
  if (reduce) return;
  var counter = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      counter.unobserve(e.target);
      var el = e.target, raw = el.textContent, n = parseInt(raw.replace(/[^0-9]/g, ''), 10);
      if (isNaN(n)) return;
      var suffix = raw.replace(/[0-9,]/g, ''), t0 = null;
      el.style.minWidth = el.offsetWidth + 'px'; // keep layout still while counting
      (function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1400, 1);
        p = 1 - Math.pow(1 - p, 3);
        el.textContent = (raw.indexOf('$') === 0 ? '$' : '') + Math.round(n * p).toLocaleString('en-US') + suffix.replace('$', '');
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.attr b, .stats b').forEach(function (el) { counter.observe(el); });
})();
