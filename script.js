/* ═══════════════════════════════════════════════════════════
   Site behaviour — nav, sticky rail, reveals, counters,
   game modal, case-study modal, image lightbox, rack filter
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme ────────────────────────────────────────────────────
     The inline script in <head> has already set data-theme before paint;
     this only wires the toggle and keeps the chrome colour in sync. */
  const toggle = $('#themeToggle');
  const themeMeta = $('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#030303' : '#faf8f5');
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('ks_theme', next); } catch (_) {}
  });

  /* Follow the OS unless the visitor has picked a theme here */
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('ks_theme'); } catch (_) {}
    if (!saved) applyTheme(e.matches ? 'light' : 'dark');
  });

  /* ── Mobile menu (banner header) ──────────────────────────── */
  const shell = $('#routeShell');
  const menuBtn = $('#routeMenu');

  const closeMenu = () => {
    shell.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  };

  menuBtn.addEventListener('click', () => {
    const open = shell.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  $$('#routeMobile a').forEach((a) => a.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (!shell.classList.contains('menu-open')) return;
    if (!$('#routeMobile').contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shell.classList.contains('menu-open')) closeMenu();
  });

  /* ── Sticky rail — slides in once the banner has scrolled by ─
     It duplicates the banner nav purely for convenience, so it stays
     aria-hidden with unfocusable links; the banner is the real nav. */
  const header = $('#routeHeader');
  const rail = $('#rail');

  const onScroll = () => {
    rail.classList.toggle('on', window.scrollY > header.offsetHeight - 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Reveal on scroll ─────────────────────────────────────── */
  if (reduced || !('IntersectionObserver' in window)) {
    $$('.reveal').forEach((n) => n.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('in'), i * 60);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px' });

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

  /* ── Best-score labels on the cartridges ──────────────────── */
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
    node.textContent = v === null || v === 0
      ? 'Not played yet'
      : game.bestLabel(v);
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
    syncMotion();
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
    syncMotion();
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

  /* ── Image lightbox ───────────────────────────────────────── */
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
    syncMotion();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    lbImg.src = '';
    // Keep the scroll lock if a case-study modal is still open beneath
    if (caseModal.hidden) document.body.style.overflow = '';
    document.removeEventListener('keydown', onLbKey);
    if (lbLastFocus && lbLastFocus.focus) lbLastFocus.focus();
    syncMotion();
  }

  function onLbKey(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  $$('[data-lb-close]', lightbox).forEach((n) =>
    n.addEventListener('click', closeLightbox));

  /* Featured spread poster → lightbox */
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
  const caseNo = $('#caseNo');

  const projects = window.PROJECTS || [];
  const byId = {};
  projects.forEach((p, i) => {
    byId[p.id] = { data: p, no: String(i + 1).padStart(2, '0') };
  });

  let caseLastFocus = null;

  /* Escapes quotes too — this output lands inside attributes */
  const esc = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  function listOrText(value) {
    if (Array.isArray(value)) {
      return '<ul class="case-ul">' +
        value.map((i) => `<li>${esc(i)}</li>`).join('') + '</ul>';
    }
    return `<p>${esc(value)}</p>`;
  }

  function renderCase(p, no) {
    caseNo.textContent = 'CASE STUDY ' + no;
    caseTitle.textContent = p.title;

    caseBody.innerHTML = `
      <figure class="case-shot" id="caseShot" role="button" tabindex="0"
              aria-label="Enlarge the ${esc(p.title)} screenshot">
        <img src="portfolio_images/${esc(p.img)}" alt="${esc(p.title)} screenshot">
      </figure>

      <p class="case-kicker">${esc(p.badge)} · ${esc(p.metric)}</p>
      <p class="case-summary">${esc(p.summary)}</p>

      <div class="case-block">
        <h3><span>01</span>The challenge</h3>
        ${listOrText(p.challenge)}
      </div>
      <div class="case-block">
        <h3><span>02</span>What I built</h3>
        ${listOrText(p.solution)}
      </div>
      <div class="case-block">
        <h3><span>03</span>The result</h3>
        ${listOrText(p.impact)}
      </div>

      <div class="case-stack">
        <p class="label label-hot">Stack</p>
        <ul class="tags">${p.stack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>`;

    // Zoom the screenshot via the shared lightbox
    const shot = $('#caseShot', caseBody);
    const openShot = () => openLightbox('portfolio_images/' + p.img, p.title);
    shot.addEventListener('click', openShot);
    shot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openShot(); }
    });
  }

  function openCase(id) {
    const entry = byId[id];
    if (!entry) return;
    caseLastFocus = document.activeElement;
    renderCase(entry.data, entry.no);
    caseModal.hidden = false;
    document.body.style.overflow = 'hidden';
    caseBody.scrollTop = 0;
    $('.modal-close', caseModal).focus();
    document.addEventListener('keydown', onCaseKey);
    syncMotion();
  }

  function closeCase() {
    if (caseModal.hidden) return;
    caseModal.hidden = true;
    caseBody.innerHTML = '';
    document.removeEventListener('keydown', onCaseKey);
    // If the lightbox is stacked on top, it manages the scroll lock itself
    if (lightbox.hidden) document.body.style.overflow = '';
    if (caseLastFocus && caseLastFocus.focus) caseLastFocus.focus();
    syncMotion();
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

  const slots = $$('.mag-slot');
  slots.forEach((slot) => {
    $('.mag-lift', slot).addEventListener('click', () => openCase(slot.dataset.project));
  });
  $$('[data-case-close]', caseModal).forEach((n) =>
    n.addEventListener('click', closeCase));

  /* ── Shelf filter ─────────────────────────────────────────── */
  const tabs = $$('.tab');
  const rackEmpty = $('#rackEmpty');
  const shelfCount = $('#shelfCount');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const f = tab.dataset.filter;
      tabs.forEach((t) => t.classList.toggle('on', t === tab));

      let shown = 0;
      slots.forEach((slot) => {
        const show = f === 'all' || slot.dataset.cat === f;
        slot.classList.toggle('hide', !show);
        if (show) { shown++; slot.classList.add('in'); }
      });

      rackEmpty.hidden = shown > 0;
      if (shelfCount) {
        const label = tab.textContent.replace(/\s*\d+\s*$/, '').trim().toLowerCase();
        shelfCount.textContent = f === 'all'
          ? `Showing all ${shown} case studies`
          : `Showing ${shown} ${label} case ${shown === 1 ? 'study' : 'studies'} of ${slots.length}`;
      }
    });
  });

  /* ── Footer year ──────────────────────────────────────────── */
  $('#year').textContent = new Date().getFullYear();

  /* ── Pause continuous animation when nobody's watching ──────
     Hidden tab, or a full-screen dialog covering the page → freeze the
     marquee and route flow so the GPU isn't compositing for nothing. */
  function anyModalOpen() {
    return !modal.hidden || !caseModal.hidden || !lightbox.hidden;
  }
  function syncMotion() {
    root.classList.toggle('motion-paused', document.hidden || anyModalOpen());
  }
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();

})();
