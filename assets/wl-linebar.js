/* Sticky 「公式LINEで相談」 bar: close control, scroll-away, session dismiss. */
(function () {
  if (window.__wlLinebarDismiss) return;
  window.__wlLinebarDismiss = true;

  var KEY = 'wl-linebar-dismissed';
  var SCROLL_SHOW_AT = 8;
  var SCROLL_HIDE_AFTER = 16;

  function dismissed() {
    try { return sessionStorage.getItem(KEY) === '1'; }
    catch (e) { return false; }
  }

  function isChatbot() {
    var page = (location.pathname.split('/').pop() || '');
    return page === 'demo-chatbot.html';
  }

  function injectStyle() {
    if (document.getElementById('wl-linebar-style')) return;
    var style = document.createElement('style');
    style.id = 'wl-linebar-style';
    style.textContent = [
      '.wl-footer-cta{display:grid !important;grid-template-columns:minmax(0,1fr) auto !important;grid-template-areas:"copy close" "link link" !important;align-items:center !important;column-gap:10px !important;row-gap:8px !important;padding:12px 14px !important}',
      '.wl-footer-cta > div{grid-area:copy;min-width:0}',
      '.wl-footer-cta > a{grid-area:link;justify-self:stretch;text-align:center;width:auto !important;position:relative;z-index:1}',
      '.wl-footer-cta > .wl-linebar-close{grid-area:close;justify-self:end}',
      '@media (min-width:640px){',
      '.wl-footer-cta{grid-template-columns:minmax(0,1fr) auto auto !important;grid-template-areas:"copy link close" !important}',
      '.wl-footer-cta > a{justify-self:end;width:auto !important}',
      '}',
      '.wl-linebar-close{appearance:none;-webkit-appearance:none;border:1px solid rgba(255,255,255,.5) !important;background:rgba(255,255,255,.16) !important;color:#fff !important;font-family:inherit;font-weight:800;font-size:13px;line-height:1;letter-spacing:.02em;border-radius:999px;min-height:40px;padding:0 12px !important;margin:0;cursor:pointer;white-space:nowrap;box-shadow:none !important;position:relative;z-index:2}',
      '.wl-linebar-close:hover{background:rgba(255,255,255,.28) !important}',
      '.wl-linebar-close:focus-visible{outline:3px solid #ffe0ab !important;outline-offset:2px !important}',
      '.mobile-cta a{color:inherit;text-decoration:none;display:block}',
      '.mobile-cta .wl-linebar-close{position:absolute;top:8px;right:8px;z-index:3}',
      '.mobile-cta .wl-linebar-close + span,.mobile-cta a span{display:block}',
      'a.mobile-cta,div.mobile-cta{padding-right:96px}',
      '.wl-footer-cta.wl-linebar-scrolled,.mobile-cta.wl-linebar-scrolled{opacity:0 !important;visibility:hidden !important;pointer-events:none !important}',
      '@media (max-width:639px){.wl-footer-cta.wl-linebar-scrolled{transform:translateY(calc(100% + 28px)) !important}}',
      '@media (min-width:640px){.wl-footer-cta.wl-linebar-scrolled{transform:translate(-50%, calc(100% + 28px)) !important}}',
      '.mobile-cta.wl-linebar-scrolled{transform:translateY(calc(100% + 20px)) !important}',
      'html:has(body.wl-linebar-closed),body.wl-linebar-closed{--fixed-bar-h:0px !important;--wl-line-bar-h:0px !important;--wl-toast-lift:0px !important}',
      'body.wl-linebar-closed,body.wl-linebar-closed.wl-has-linebar{padding-bottom:env(safe-area-inset-bottom,0px) !important}',
      'body.wl-linebar-closed .wl-footer-cta,body.wl-linebar-closed #mobileCta,body.wl-linebar-closed .mobile-cta,.wl-footer-cta.wl-linebar-dismissed,#mobileCta.wl-linebar-dismissed{display:none !important}',
      'body.wl-linebar-closed.wl-has-linebar .wrap{padding-bottom:1.25rem !important}',
      'body.wl-linebar-closed.wl-has-linebar .footer-note,body.wl-linebar-closed.wl-has-linebar .footnote,body.wl-linebar-closed.wl-has-linebar aside.footnote{margin-bottom:0 !important;padding-bottom:.75rem !important}',
      '@media (prefers-reduced-motion: reduce){.wl-footer-cta,.mobile-cta,.wl-linebar-close{transition:none !important}}'
    ].join('');
    document.documentElement.appendChild(style);
  }

  function zeroVars() {
    var props = ['--fixed-bar-h', '--wl-line-bar-h', '--wl-toast-lift'];
    [document.documentElement, document.body].forEach(function (el) {
      if (!el) return;
      props.forEach(function (name) { el.style.setProperty(name, '0px'); });
    });
    if (document.body) document.body.style.removeProperty('padding-bottom');
  }

  function visibleSticky() {
    var found = null;
    document.querySelectorAll('.wl-footer-cta, #mobileCta').forEach(function (el) {
      if (found || el.classList.contains('wl-linebar-dismissed') || el.hasAttribute('hidden')) return;
      var cs = window.getComputedStyle(el);
      if (cs.display === 'none') return;
      if (cs.visibility === 'hidden' && !el.classList.contains('wl-linebar-scrolled')) return;
      if (cs.position !== 'fixed' && cs.position !== 'sticky') return;
      found = el;
    });
    return found;
  }

  function syncPad() {
    if (!document.body) return;
    if (dismissed() || document.body.classList.contains('wl-linebar-closed')) {
      zeroVars();
      return;
    }
    var bar = visibleSticky();
    if (!bar) {
      document.body.style.removeProperty('padding-bottom');
      return;
    }
    var rect = bar.getBoundingClientRect();
    var occupied = Math.ceil(Math.max(0, window.innerHeight - rect.top));
    if (occupied < 48) return;
    var px = occupied + 'px';
    document.documentElement.style.setProperty('--fixed-bar-h', px);
    document.body.style.setProperty('--fixed-bar-h', px);
    document.documentElement.style.setProperty('--wl-toast-lift', px);
    document.body.style.setProperty('padding-bottom', 'calc(' + occupied + 'px + env(safe-area-inset-bottom, 0px))', 'important');
  }

  function markClosed() {
    document.body.classList.add('wl-linebar-closed');
    document.body.classList.remove('wl-linebar-away');
    scrolledAway = false;
    if (isChatbot()) document.body.classList.add('wl-has-linebar');
    else document.body.classList.remove('wl-has-linebar');
    zeroVars();
    document.querySelectorAll('.wl-footer-cta, #mobileCta').forEach(function (el) {
      el.classList.add('wl-linebar-dismissed');
      el.setAttribute('hidden', '');
      el.setAttribute('aria-hidden', 'true');
    });
  }

  function dismiss() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    markClosed();
  }

  function ensureClose(bar) {
    if (!bar || bar.querySelector('.wl-linebar-close')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wl-linebar-close';
    btn.setAttribute('aria-label', '閉じる');
    btn.textContent = '✕ 閉じる';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dismiss();
    });
    bar.appendChild(btn);
  }

  function hasStickyBar() {
    return Array.prototype.some.call(document.querySelectorAll('.wl-footer-cta, #mobileCta'), function (el) {
      if (el.classList.contains('wl-linebar-dismissed') || el.hasAttribute('hidden')) return false;
      var cs = window.getComputedStyle(el);
      if (cs.display === 'none') return false;
      return cs.position === 'fixed' || cs.position === 'sticky';
    });
  }

  function wire(bar) {
    if (!bar || bar.dataset.wlLinebarWired === '1') return;
    bar.dataset.wlLinebarWired = '1';
    if (!bar.getAttribute('aria-label')) bar.setAttribute('aria-label', '公式LINEで相談');
    ensureClose(bar);
    var link = bar.querySelector('a[href*="lin.ee/n3TOIyU"]');
    if (!link && bar.matches('a[href*="lin.ee/n3TOIyU"]')) link = bar;
    if (link) link.setAttribute('data-wl-line', '1');
  }

  function scan() {
    if (dismissed()) {
      markClosed();
      return;
    }
    document.querySelectorAll('.wl-footer-cta, #mobileCta').forEach(wire);
    requestAnimationFrame(function () { syncPad(); requestAnimationFrame(syncPad); });
  }

  function isPageScroller(target) {
    if (!target) return false;
    if (target === document || target === document.documentElement || target === document.body) return true;
    if (target.matches && target.matches('#chat, main.chat, .chat, main, .view')) return true;
    return false;
  }

  var lastTop = new WeakMap();
  var scrolledAway = false;
  var lockUntil = 0;
  var userIntentUntil = 0;

  function markUserIntent() {
    userIntentUntil = Date.now() + 700;
  }
  var touchStartY = null;
  window.addEventListener('touchstart', function (e) {
    if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
  }, { passive: true, capture: true });
  window.addEventListener('wheel', function (e) {
    markUserIntent();
    if (e.deltaY > 8) setScrolled(true);
    else if (e.deltaY < -8) setScrolled(false);
  }, { passive: true, capture: true });
  window.addEventListener('touchmove', function (e) {
    markUserIntent();
    if (touchStartY == null || !e.touches || !e.touches[0]) return;
    var dy = touchStartY - e.touches[0].clientY;
    if (dy > 12) setScrolled(true);
    else if (dy < -12) setScrolled(false);
  }, { passive: true, capture: true });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'PageDown' || e.key === 'PageUp' || e.key === 'Home' || e.key === 'End' || e.key === ' ') markUserIntent();
  }, true);

  function setScrolled(on) {
    if (dismissed()) return;
    if (on && !hasStickyBar()) return;
    if (scrolledAway === on) return;
    scrolledAway = on;
    document.body.classList.toggle('wl-linebar-away', on);
    document.querySelectorAll('.wl-footer-cta, #mobileCta').forEach(function (el) {
      el.classList.toggle('wl-linebar-scrolled', on);
    });
    lockUntil = Date.now() + 220;
  }

  function onScroll(e) {
    if (dismissed()) return;
    if (Date.now() > userIntentUntil) return;
    if (Date.now() < lockUntil) return;
    var target = e.target === window ? document : e.target;
    if (!isPageScroller(target)) return;
    var node = (target === document || target === document.documentElement || target === document.body)
      ? document.scrollingElement || document.documentElement
      : target;
    var y = node.scrollTop || window.scrollY || 0;
    var prev = lastTop.has(node) ? lastTop.get(node) : 0;
    lastTop.set(node, y);
    var dy = y - prev;
    if (y <= SCROLL_SHOW_AT) {
      setScrolled(false);
      return;
    }
    if (dy > 6 && y > SCROLL_HIDE_AFTER) setScrolled(true);
    else if (dy < -6) setScrolled(false);
  }

  injectStyle();
  if (dismissed()) markClosed();

  var mo = new MutationObserver(function () { scan(); });
  function start() {
    scan();
    mo.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncPad, { passive: true });
    window.addEventListener('load', scan);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
