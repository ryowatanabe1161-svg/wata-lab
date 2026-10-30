/* WATA LAB よくある質問チャット（ページごとに window.WL_CHAT で回答を設定） */
(function(){
var C=window.WL_CHAT;if(!C)return;var LINE='https://lin.ee/n3TOIyU';var LBTN='<a class="wlc-linebtn" href="'+LINE+'" target="_blank" rel="noopener">LINEを開く</a>';
var css="#wlc-btn{position:fixed;right:16px;bottom:96px;z-index:60;border:0;border-radius:999px;background:#1c6b58;color:#fff;font:700 14px/1 var(--font,sans-serif);padding:14px 18px;box-shadow:0 12px 26px -12px rgba(27,39,64,.6);cursor:pointer}"+
"#wlc{position:fixed;right:12px;left:12px;bottom:12px;z-index:70;max-width:380px;margin-left:auto;height:min(560px,calc(100dvh - 24px));background:#fffcf8;border:1px solid #e4ddd2;border-radius:20px;box-shadow:0 24px 50px -20px rgba(27,39,64,.5);display:none;flex-direction:column;overflow:hidden;font-family:var(--font,sans-serif);color:#1b2740}"+
"#wlc.open{display:flex}#wlc header{position:static;display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#1c6b58;color:#fff;font-weight:700;height:auto;border:0;backdrop-filter:none}"+
"#wlc header button{background:none;border:0;color:#fff;font-size:20px;cursor:pointer}#wlc-log{flex:1 1 0;min-height:0;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}"+
".wlc-m{max-width:85%;padding:10px 13px;border-radius:16px;font-size:14px;line-height:1.7;white-space:pre-line}.wlc-b{background:#e4f3ed;align-self:flex-start;border-top-left-radius:4px}.wlc-u{background:#c4471f;color:#fff;align-self:flex-end;border-top-right-radius:4px}"+
".wlc-m a{color:#1c6b58;font-weight:700}#wlc-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;border-top:1px solid #e4ddd2}#wlc-chips a.wlc-line{display:inline-flex;align-items:center;border:0;background:#06c755;color:#fff;border-radius:999px;padding:6px 12px;font:700 13px var(--font,sans-serif);text-decoration:none}#wlc-chips button{border:1px solid #1c6b58;background:#fff;color:#1c6b58;border-radius:999px;padding:6px 11px;font:700 13px var(--font,sans-serif);cursor:pointer}"+
"a.wlc-linebtn{display:block;text-align:center;margin:8px 12px 0;background:#06c755;color:#fff !important;font-weight:900;text-decoration:none;border-radius:12px;padding:12px;font-size:15px}.wlc-m a.wlc-linebtn{margin:8px 0 0}"+
"#wlc form{display:flex;gap:6px;padding:10px 12px;border-top:1px solid #e4ddd2}#wlc input{flex:1;min-width:0;border:1px solid #d4cdc2;border-radius:12px;padding:10px;font-size:16px}#wlc form button{border:0;border-radius:12px;background:#c4471f;color:#fff;font-weight:700;padding:0 14px}";
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var btn=document.createElement('button');btn.id='wlc-btn';btn.type='button';btn.textContent='💬 質問する';
var box=document.createElement('div');box.id='wlc';box.setAttribute('role','dialog');box.setAttribute('aria-label','よくある質問チャット');
box.innerHTML='<header><span>WATA LAB よくある質問</span><button type="button" aria-label="閉じる">✕</button></header><div id="wlc-log"></div><div id="wlc-chips"></div><a class="wlc-linebtn" href="'+LINE+'" target="_blank" rel="noopener">公式LINEで相談する（無料）</a><form><input placeholder="質問を入力（例：料金）" aria-label="質問"><button>送信</button></form>';
document.body.appendChild(btn);document.body.appendChild(box);
var log=box.querySelector('#wlc-log'),chips=box.querySelector('#wlc-chips'),inp=box.querySelector('input');
function add(t,c,html){var d=document.createElement('div');d.className='wlc-m '+c;if(html)d.innerHTML=t;else d.textContent=t;log.appendChild(d);log.scrollTop=log.scrollHeight}
function answer(q){var k=C.items.filter(function(i){return i.label===q||i.keys.some(function(w){return q.indexOf(w)>=0})})[0];
var t=k?k.a:C.fallback;if(!k||k.href||/lin\.ee/.test(t))t+=LBTN;setTimeout(function(){add(t,'wlc-b',true)},450)}
C.items.forEach(function(i){if(i.href){var l=document.createElement('a');l.className='wlc-line';l.href=i.href;l.target='_blank';l.rel='noopener';l.textContent='💬 '+i.label;chips.appendChild(l);return}var b=document.createElement('button');b.type='button';b.textContent=i.label;b.onclick=function(){add(i.label,'wlc-u');answer(i.label)};chips.appendChild(b)});
var started=false;
btn.onclick=function(){box.classList.add('open');btn.style.display='none';document.body.classList.add('wl-chat-open');if(!started){started=true;add(C.hello,'wlc-b',true)}};
box.querySelector('header button').onclick=function(){box.classList.remove('open');btn.style.display='';document.body.classList.remove('wl-chat-open')};
box.querySelector('form').onsubmit=function(e){e.preventDefault();var q=inp.value.trim();if(!q)return;inp.value='';add(q,'wlc-u');answer(q)};
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
