/* ซีซัน 4: หน้าระบบแสดงฉาก 3D ซีซัน 4 เต็มจอเสมอ (ไม่มีปุ่มกลับไปหน้าซีซัน 3)
   หน้าเดิมของซีซัน 3 ทำงานอยู่เบื้องหลังเพื่อใช้ข้อมูล กติกา และจำนวนของเดิม
   ส่วนที่มองเห็นได้มีแค่หน้าต่างเลือก/ยืนยัน (sheet) ที่ขึ้นทับฉาก 3D
   data-acts  : {ชื่อ: โค้ด} ที่ฉาก 3D เรียกผ่าน postMessage {s4z, id}
   data-sync  : นิพจน์ที่ส่งสถานะให้ฉาก 3D ทุก 1 วินาที
   data-dock  : [[อีโมจิ, ชื่อสั้น, โค้ด], ...] แถบปุ่มเล็กสไตล์ซีซัน 4 */
(()=>{
 const me=document.currentScript||[...document.querySelectorAll('script[src*="s4view.js?h=e7935ecb"]')].pop();if(!me||!me.dataset)return;const src=me.dataset.src;let ACTS={},DOCK=[];
 try{ACTS=JSON.parse(me.dataset.acts||'{}');}catch(e){}try{DOCK=JSON.parse(me.dataset.dock||'[]');}catch(e){}
 const css=document.createElement('style');css.textContent=`
html.s4emb,html.s4emb body{background:transparent!important}
html.s4emb body{visibility:hidden!important}
html.s4emb body *:not(.s4ov):not(.s4ov *):not(#s4f):not(#s4dock):not(#s4ring):not(#s4ring *):not(#s4dveil){visibility:hidden!important}
:where(html.s4emb) :where(.s4ov){visibility:visible}
html.s4emb #s4f,html.s4emb #s4dock,html.s4emb #s4ring,html.s4emb #s4dveil{visibility:visible!important}
#s4f{position:fixed;inset:0;width:100%;height:100%;border:0;z-index:0;display:block;background:#bfe6a0}
#s4dock{position:fixed;right:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 10px);z-index:30;width:56px;height:56px;border-radius:16px;border:3px solid #fff;padding:0;cursor:pointer;background:linear-gradient(180deg,#ff9fc0,#e8578a);box-shadow:0 4px 0 rgba(0,0,0,.18),0 6px 12px rgba(40,20,0,.25);font-size:26px;color:#fff;display:flex;align-items:center;justify-content:center;transition:transform .1s,opacity .2s}
#s4dock::after{content:'';position:absolute;left:5px;right:5px;top:3px;height:40%;border-radius:12px 12px 20px 20px;background:linear-gradient(rgba(255,255,255,.55),rgba(255,255,255,0));pointer-events:none}
#s4dock:active{transform:translateY(3px)}#s4dock.on{opacity:0;pointer-events:none}
#s4ring{position:fixed;z-index:31;left:0;right:0;bottom:0;padding:10px 10px calc(env(safe-area-inset-bottom,0px) + 12px);background:linear-gradient(180deg,#fff9ee,#ffefd6);border-radius:22px 22px 0 0;box-shadow:0 -6px 22px rgba(70,40,10,.22),inset 0 2px 0 #fff;transform:translateY(105%);transition:transform .24s cubic-bezier(.3,1.25,.5,1)}
#s4ring.on{transform:none}
#s4ring .hd{display:flex;align-items:center;margin:0 2px 8px;font:800 12px Mali,sans-serif;color:#8a5a2e}#s4ring .hd button{margin-left:auto;width:30px;height:30px;border-radius:50%;border:2px solid #fff;background:#f3dcb8;color:#8a5a2e;font:800 15px sans-serif;box-shadow:0 2px 0 #d2ac78;padding:0}
#s4ring .row{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding:2px 2px 4px}#s4ring .row::-webkit-scrollbar{display:none}
#s4ring .t{flex:0 0 auto;width:60px;border:0;background:none;padding:0;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;font:800 9.5px Mali,sans-serif;color:#6e4b3a}
#s4ring .t i{position:relative;width:52px;height:52px;border-radius:15px;border:3px solid #fff;font-style:normal;font-size:24px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 0 rgba(0,0,0,.18),0 6px 12px rgba(40,20,0,.2)}
#s4ring .t i::after{content:'';position:absolute;left:5px;right:5px;top:3px;height:40%;border-radius:11px 11px 18px 18px;background:linear-gradient(rgba(255,255,255,.55),rgba(255,255,255,0))}
#s4ring .t span{max-width:62px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#s4ring .t:active i{transform:translateY(2px)}
#s4dveil{position:fixed;inset:0;z-index:29;display:none}#s4dveil.on{display:block}`;
 document.head.appendChild(css);document.documentElement.classList.add('s4emb');
 const f=document.createElement(src?'iframe':'i');f.id='s4f';if(src)f.src=src;else f.style.display='none';f.title='ฉาก 3D';f.allow='accelerometer; gyroscope';window.__s4f=f;
 const run=(code,id)=>{if(!code)return;code=code.split('__ID').join(JSON.stringify(id||''));setTimeout(()=>{try{(0,eval)(code);}catch(err){console.error(err);}},40);};
 addEventListener('message',e=>{if(e.data&&'s4dedit' in e.data&&e.source===f.contentWindow){document.body.classList.toggle('s4dedit',!!e.data.s4dedit);return;}if(!e.data||!e.data.s4z||!src||e.source!==f.contentWindow)return;let code=ACTS[e.data.s4z];if(code&&e.data.s4z==='pet'&&!e.data.id)code='';run(code,e.data.id);});
 const SY=me.dataset.sync;if(SY&&src)setInterval(()=>{if(!f.contentWindow)return;let v=null;try{v=(0,eval)(SY);}catch(e){return;}try{f.contentWindow.postMessage({s4sync:JSON.parse(JSON.stringify(v))},'*');}catch(e){}},1000);
 // หน้าต่างที่ซ่อนอยู่ตอนเริ่ม (sheet/popup/toast) = ส่วนที่ให้เห็นได้ · ฉากหลังซีซัน 3 ซ่อนทั้งหมด
 const OVRX=/sheet|shade|modal|pop|toast|ann|dialog|dlg|card|book|fx|mini|tip|overlay|result|confetti|mk-|lx|craft|catch|cr-|win|lose|eel|snip|fly|burst|drawer|picker/i;
 const isOv=el=>{if(!(el instanceof HTMLElement)||el===f||/^s4(dock|ring|dveil)$/.test(el.id))return false;if(!OVRX.test((el.id||'')+' '+(typeof el.className==='string'?el.className:'')))return false;const cs=getComputedStyle(el);if(cs.position!=='fixed'&&cs.position!=='absolute')return false;
  if(cs.display==='none'||el.hidden)return true;if((+cs.opacity<.05||cs.visibility==='hidden')&&(!el.children.length||/shade|toast|ann|modal|pop|tip|sheet|card|book|fx|mini|over|dlg|dialog|panel/i.test((el.id||'')+' '+el.className)))return true;if(+cs.opacity<.05||cs.visibility==='hidden')return false;const r=el.getBoundingClientRect();return r.top>=innerHeight-2||r.bottom<=2||r.left>=innerWidth-2||r.right<=2||r.width<2||r.height<2;};
 const scan=()=>{document.querySelectorAll('body *').forEach(el=>{if(!el.closest('.s4ov')&&isOv(el))el.classList.add('s4ov');});};
 const add=()=>{document.body.insertBefore(f,document.body.firstChild);
  if(DOCK.length){const o=document.createElement('button');o.type='button';o.id='s4dock';o.textContent='☰';o.title='เมนู';const rg=document.createElement('div');rg.id='s4ring';const vl=document.createElement('div');vl.id='s4dveil';document.body.append(vl,rg,o);
   const C=['linear-gradient(180deg,#8fd0ff,#3f94e4)','linear-gradient(180deg,#ffd76a,#f39a1e)','linear-gradient(180deg,#9fe38a,#4bb04a)','linear-gradient(180deg,#ff9fc0,#e8578a)','linear-gradient(180deg,#d2b4ff,#8a5ce0)'];
   rg.innerHTML='<div class="hd"><span>เมนู</span><button type="button" data-x="1">✕</button></div><div class="row">'+DOCK.map(([e,t],i)=>`<button type="button" class="t" data-i="${i}"><i style="background:${C[i%C.length]}">${e}</i><span>${t}</span></button>`).join('')+'</div>';
   const close=()=>{rg.classList.remove('on');o.classList.remove('on');vl.classList.remove('on');};vl.onclick=close;
   o.onclick=()=>{rg.classList.add('on');o.classList.add('on');vl.classList.add('on');};
   rg.onclick=ev=>{if(ev.target.closest('[data-x]'))return close();const b=ev.target.closest('[data-i]');if(!b)return;close();run(DOCK[+b.dataset.i][2]);};}
  scan();setTimeout(scan,600);setTimeout(scan,1800);
  new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.parentNode===document.body&&n instanceof HTMLElement&&n!==f&&!/^s4(dock|ring|dveil)$/.test(n.id)){const cs=getComputedStyle(n);if(cs.position==='fixed'||cs.position==='absolute')n.classList.add('s4ov');}}).observe(document.body,{childList:true});};
 if(document.body)add();else document.addEventListener('DOMContentLoaded',add);
 window.__s4show3d=()=>{};
})();

/* S4: โหมดตกแต่งในโซน 3D → ซ่อนเมนู/ปุ่มของหน้านี้ ไม่ให้บังถาดของตกแต่ง */
(()=>{const st=document.createElement('style');st.textContent='body.s4dedit #s4dock,body.s4dedit #s4ring,body.s4dedit #s4dveil,body.s4dedit .gbar,body.s4dedit #dropCollectVisible{visibility:hidden!important}';(document.head||document.documentElement).appendChild(st);})();
