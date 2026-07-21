/* ═══════════════════════════════════════════════════════════
   Site behaviour — theme, nav, reveals, counters, game modal
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ── Theme ────────────────────────────────────────────────── */
  const root = document.documentElement;
  const toggle = $('#themeToggle');

  const readTheme = () => {
    try {
      const saved = localStorage.getItem('ks_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  applyTheme(readTheme());

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('ks_theme', next); } catch (_) {}
  });

  /* Follow the OS unless the user has picked a theme here */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('ks_theme'); } catch (_) {}
    if (!saved) applyTheme(e.matches ? 'dark' : 'light');
  });

  /* ── Header shadow on scroll ──────────────────────────────── */
  const header = $('#siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile nav ───────────────────────────────────────────── */
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  const closeNav = () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  };

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  $$('#navLinks a').forEach((a) => a.addEventListener('click', closeNav));

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) closeNav();
  });

  /* ── Reveal on scroll ─────────────────────────────────────── */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    $$('.reveal').forEach((n) => n.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('in'), i * 70);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });

    $$('.reveal').forEach((n) => io.observe(n));
  }

  /* ── Stat counters ────────────────────────────────────────── */
  const counters = $$('[data-count]');

  function runCounter(node) {
    const target = parseInt(node.dataset.count, 10);
    const suffix = node.dataset.suffix || '';
    if (reduced) { node.textContent = target + suffix; return; }

    const DURATION = 1100;
    let start = null;

    function tick(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        runCounter(e.target);
        co.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((n) => co.observe(n));
  } else {
    counters.forEach(runCounter);
  }

  /* ── Best-score labels on the game cards ──────────────────── */
  function readBest(key) {
    try {
      const v = localStorage.getItem('ks_' + key);
      return v === null ? null : JSON.parse(v);
    } catch (_) { return null; }
  }

  function paintBest(id) {
    const node = $(`[data-best="${id}"]`);
    const game = window.GAMES && window.GAMES[id];
    if (!node || !game) return;
    const v = readBest(game.bestKey);
    node.textContent = v === null || v === 0 ? 'Not played yet' : game.bestLabel(v);
  }

  Object.keys(window.GAMES || {}).forEach(paintBest);

  /* ── Game modal ───────────────────────────────────────────── */
  const modal = $('#gameModal');
  const modalTitle = $('#modalTitle');
  const modalBody = $('#modalBody');
  const modalFoot = $('#modalFoot');

  let destroyGame = null;
  let lastFocus = null;
  let currentId = null;

  function openGame(id) {
    const game = window.GAMES && window.GAMES[id];
    if (!game) return;

    lastFocus = document.activeElement;
    currentId = id;

    modalTitle.textContent = game.title;
    modalFoot.innerHTML = game.foot || '';
    modalBody.textContent = '';

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    destroyGame = game.mount(modalBody, () => paintBest(id)) || null;

    $('.modal-close', modal).focus();
    document.addEventListener('keydown', onModalKey);
  }

  function closeGame() {
    if (modal.hidden) return;

    if (typeof destroyGame === 'function') destroyGame();
    destroyGame = null;

    modal.hidden = true;
    modalBody.textContent = '';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onModalKey);

    if (currentId) paintBest(currentId);
    currentId = null;

    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* Esc to close + focus trap so Tab stays inside the dialog */
  function onModalKey(e) {
    if (e.key === 'Escape') { closeGame(); return; }
    if (e.key !== 'Tab') return;

    const focusable = $$(
      'button:not(:disabled), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      modal
    ).filter((n) => n.offsetParent !== null);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  $$('[data-game]').forEach((card) => {
    card.addEventListener('click', () => openGame(card.dataset.game));
  });

  $$('[data-close]', modal).forEach((n) => n.addEventListener('click', closeGame));

  /* Placeholder card shouldn't navigate anywhere yet */
  $$('.game-soon').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (card.getAttribute('href') === '#') e.preventDefault();
    });
  });

  /* ── Project image lightbox ───────────────────────────────── */
  const lightbox = $('#lightbox');
  const lbImg = $('#lightboxImg');
  const lbCap = $('#lightboxCap');
  let lbLastFocus = null;

  function openLightbox(src, title) {
    lbLastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = title + ' — full screenshot';
    lbCap.textContent = title;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.lightbox-close', lightbox).focus();
    document.addEventListener('keydown', onLbKey);
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    lbImg.src = '';
    // Keep the scroll lock if a case-study modal is still open beneath
    const caseOpen = document.getElementById('caseModal') &&
      !document.getElementById('caseModal').hidden;
    if (!caseOpen) document.body.style.overflow = '';
    document.removeEventListener('keydown', onLbKey);
    if (lbLastFocus && lbLastFocus.focus) lbLastFocus.focus();
  }

  function onLbKey(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  $$('[data-lb-close]', lightbox).forEach((n) =>
    n.addEventListener('click', closeLightbox));

  /* Featured case-study poster → lightbox */
  const featureShot = $('#caseFeatureShot');
  if (featureShot) {
    const openFeature = () => openLightbox(
      featureShot.querySelector('img').getAttribute('src'),
      'Decision-Support Terminal — solution summary');
    featureShot.addEventListener('click', openFeature);
    featureShot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFeature(); }
    });
  }

  /* ── Case-study modal ─────────────────────────────────────── */
  const caseModal = $('#caseModal');
  const caseBody = $('#caseBody');
  const caseTitle = $('#caseTitle');
  const caseBadge = $('#caseBadge');
  const projects = window.PROJECTS || [];
  const byId = {};
  projects.forEach((p) => { byId[p.id] = p; });

  let caseLastFocus = null;

  const escapeHtml = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function listOrText(value, cls) {
    if (Array.isArray(value)) {
      return '<ul class="case-ul">' +
        value.map((i) => `<li>${escapeHtml(i)}</li>`).join('') + '</ul>';
    }
    return `<p>${escapeHtml(value)}</p>`;
  }

  function renderCase(p) {
    caseBadge.textContent = p.badge;
    caseTitle.textContent = p.title;

    caseBody.innerHTML = `
      <figure class="case-shot" id="caseShot" role="button" tabindex="0"
              aria-label="Enlarge ${escapeHtml(p.title)} screenshot">
        <img src="portfolio_images/${p.img}" alt="${escapeHtml(p.title)} screenshot">
      </figure>
      <p class="case-summary">${escapeHtml(p.summary)}</p>

      <div class="case-block challenge">
        <h3><span class="dot" aria-hidden="true"></span>The challenge</h3>
        ${listOrText(p.challenge)}
      </div>
      <div class="case-block solution">
        <h3><span class="dot" aria-hidden="true"></span>What I built</h3>
        ${listOrText(p.solution)}
      </div>
      <div class="case-block result">
        <h3><span class="dot" aria-hidden="true"></span>The result</h3>
        ${listOrText(p.impact)}
      </div>

      <div class="case-stack">
        <p class="skill-label">Stack</p>
        <ul class="tags">${p.stack.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
      </div>`;

    // Zoom the screenshot via the existing lightbox
    const shot = $('#caseShot', caseBody);
    const openShot = () => openLightbox('portfolio_images/' + p.img, p.title);
    shot.addEventListener('click', openShot);
    shot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openShot(); }
    });
  }

  function openCase(id) {
    const p = byId[id];
    if (!p) return;
    caseLastFocus = document.activeElement;
    renderCase(p);
    caseModal.hidden = false;
    document.body.style.overflow = 'hidden';
    caseBody.scrollTop = 0;
    $('.modal-close', caseModal).focus();
    document.addEventListener('keydown', onCaseKey);
  }

  function closeCase() {
    if (caseModal.hidden) return;
    caseModal.hidden = true;
    caseBody.innerHTML = '';
    document.removeEventListener('keydown', onCaseKey);
    // If the lightbox is stacked on top, it manages the scroll lock itself
    if (lightbox.hidden) document.body.style.overflow = '';
    if (caseLastFocus && caseLastFocus.focus) caseLastFocus.focus();
  }

  function onCaseKey(e) {
    // Let the lightbox handle keys while it's open on top
    if (!lightbox.hidden) return;
    if (e.key === 'Escape') { closeCase(); return; }
    if (e.key !== 'Tab') return;

    const focusable = $$(
      'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
      caseModal
    ).filter((n) => n.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  $$('.gcard').forEach((card) => {
    card.addEventListener('click', () => openCase(card.dataset.project));
  });
  $$('[data-case-close]', caseModal).forEach((n) =>
    n.addEventListener('click', closeCase));

  /* ── Gallery category filter ──────────────────────────────── */
  const filterBtns = $$('.filter-btn');
  const cards = $$('.gcard');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.toggle('on', b === btn));
      cards.forEach((card) => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('hide', !show);
        // Any card that becomes visible should be revealed immediately
        if (show) card.classList.add('in');
      });
    });
  });

  /* ── Footer year ──────────────────────────────────────────── */
  $('#year').textContent = new Date().getFullYear();

})();
