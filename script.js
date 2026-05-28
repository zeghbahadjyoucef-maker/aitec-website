(function () {
  'use strict';

  /* Nav — transparent over hero, dark when scrolled */
  function initNav() {
    var nav = document.getElementById('nav');
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Hamburger */
  function initHamburger() {
    var btn  = document.getElementById('hamburger');
    var menu = document.getElementById('navMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      var nav = document.getElementById('nav');
      if (!nav.contains(e.target)) {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Smooth scroll for anchor links */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* Scroll reveal */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Service category filter */
  function initFilter() {
    var filters = document.querySelectorAll('.svc-filter');
    var cards   = document.querySelectorAll('.svc-card[data-cat]');
    if (!filters.length || !cards.length) return;

    function applyFilter(cat) {
      cards.forEach(function (card) {
        var match = (cat === 'all' || card.dataset.cat === cat);
        if (match) {
          card.style.display = '';
          // Trigger fade-in
          requestAnimationFrame(function () {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    }

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.filter;
        filters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilter(cat);
      });
    });

    // Apply default (show all)
    applyFilter('all');
  }

  /* Animated stat counters */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      if (done || !entries[0].isIntersecting) return;
      done = true;
      counters.forEach(function (el) {
        var target = parseInt(el.dataset.count, 10);
        var duration = 1600;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
      });
      io.disconnect();
    }, { threshold: 0.3 });
    var statsBar = document.querySelector('.stats-bar');
    if (statsBar) io.observe(statsBar);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initHamburger();
    initSmoothScroll();
    initReveal();
    initFilter();
    initCounters();
  });
})();
