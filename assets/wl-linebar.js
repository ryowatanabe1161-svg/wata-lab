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
      'body.wl-chat-open .wl-footer-cta,body.wl-chat-open #mobileCta,body.wl-chat-open .mobile-cta{opacity:0 !important;visibility:hidden !important;pointer-events:none !important}',
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

  /* Robust scroll-away: rAF-throttled, 40px accumulated threshold, ignores
     overscroll/bounce and resize, hidden while the FAQ chat panel is open. */
  var THRESH = 40, EDGE = 60;
  var scrolledAway = false;
  var lastY = new WeakMap(), acc = new WeakMap();
  var pending = null, ticking = false;

  function setScrolled(on) {
    if (dismissed()) return;
    if (on && !hasStickyBar()) return;
    if (scrolledAway === on) return;
    scrolledAway = on;
    document.body.classList.toggle('wl-linebar-away', on);
    document.querySelectorAll('.wl-footer-cta, #mobileCta').forEach(function (el) {
      el.classList.toggle('wl-linebar-scrolled', on);
    });
  }

  function evaluate(node) {
    if (document.body.classList.contains('wl-chat-open')) return;
    var max = Math.max(0, node.scrollHeight - node.clientHeight);
    var y = node === (document.scrollingElement || document.documentElement) ? (window.scrollY || node.scrollTop || 0) : node.scrollTop;
    y = Math.min(Math.max(y, 0), max); /* ignore iOS bounce/overscroll */
    var prev = lastY.has(node) ? lastY.get(node) : y;
    lastY.set(node, y);
    var dy = y - prev;
    if (dy === 0) return;
    var a = acc.get(node) || 0;
    if ((dy > 0) !== (a > 0)) a = 0; /* direction changed: restart */
    a += dy; acc.set(node, a);
    if (y <= EDGE || max - y <= EDGE) { if (y <= EDGE) setScrolled(false); return; }
    if (a > THRESH) { setScrolled(true); acc.set(node, 0); }
    else if (a < -THRESH) { setScrolled(false); acc.set(node, 0); }
  }

  function onScroll(e) {
    if (dismissed()) return;
    var target = e.target === window ? document : e.target;
    if (!isPageScroller(target)) return;
    pending = (target === document || target === document.documentElement || target === document.body)
      ? (document.scrollingElement || document.documentElement) : target;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; if (pending) evaluate(pending); });
  }

  injectStyle();
  if (dismissed()) markClosed();

  var mo = new MutationObserver(function () { scan(); });
  function start() {
    scan();
    mo.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', scan);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
/* LINE link opener: works even inside sandboxed previews / in-app WebViews. */
(function(){
if(window.__wlLineNav)return;window.__wlLineNav=true;
var URL_='https://lin.ee/n3TOIyU',ID='@667eqabz',QR='https://ryowatanabe1161-svg.github.io/wata-lab/line-qr.png';
function css(){if(document.getElementById('wl-ln-style'))return;var s=document.createElement('style');s.id='wl-ln-style';
s.textContent='#wl-ln{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:380px;margin:0 auto;background:#fffcf8;color:#1b2740;border:1px solid #e4ddd2;border-radius:18px;box-shadow:0 20px 44px -16px rgba(27,39,64,.55);padding:16px;font:500 14px/1.7 "Zen Kaku Gothic New","Hiragino Sans",sans-serif}#wl-ln b{display:block;font-size:15px;margin-bottom:4px}#wl-ln .row{display:flex;gap:12px;align-items:center;margin-top:10px}#wl-ln img{width:84px;height:84px;border-radius:8px;border:1px solid #e4ddd2;flex:none}#wl-ln code{font:900 18px/1.4 monospace;user-select:all;-webkit-user-select:all}#wl-ln button{border:0;border-radius:10px;padding:9px 12px;font-weight:800;cursor:pointer}#wl-ln .cp{background:#06c755;color:#fff}#wl-ln .x{position:absolute;top:8px;right:8px;background:none;font-size:18px;padding:4px 8px}#wl-ln a{color:#1c6b58;font-weight:800;word-break:break-all}';document.head.appendChild(s)}
function help(){css();var o=document.getElementById('wl-ln');if(o)o.remove();var d=document.createElement('div');d.id='wl-ln';d.setAttribute('role','dialog');
d.innerHTML='<button class="x" aria-label="閉じる">✕</button><b>LINEが開かないときは</b>LINEアプリの「友だち追加」→「検索」で、IDを検索してください。<div class="row"><img src="'+QR+'" alt="公式LINEのQRコード" onerror="this.remove()"><div>ID：<code>'+ID+'</code><br><button class="cp" type="button">IDをコピー</button></div></div><div style="margin-top:8px;font-size:12px">リンク：<a href="'+URL_+'" target="_top" rel="noopener">'+URL_+'</a></div>';
document.body.appendChild(d);d.querySelector('.x').onclick=function(){d.remove()};
d.querySelector('.cp').onclick=function(){var b=this,c=d.querySelector('code');function sel(){var r=document.createRange();r.selectNodeContents(c);var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='選択しました。長押しでコピー'}
try{navigator.clipboard.writeText(ID).then(function(){b.textContent='コピーしました ✓'},sel)}catch(e){sel()}}}
function open(){var w=null,framed=false;
try{framed=window.top!==window.self}catch(e){framed=true}
try{w=window.open(URL_,'_blank');if(w)try{w.opener=null}catch(e){}}catch(e){w=null}
if(w)return;
if(framed){try{window.top.location.href=URL_}catch(e){}}else{try{location.href=URL_}catch(e){}}
setTimeout(function(){if(document.visibilityState==='visible')help()},800)}
window.wlOpenLine=open;window.wlLineHelp=help;
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href*="lin.ee/n3TOIyU"]');if(!a||a.closest('#wl-ln'))return;
if(e.defaultPrevented||e.button>0||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();open()},true);
})();
