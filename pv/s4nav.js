/* ซีซัน 4: 🗺️ ทางลัด กับ 🌾 หน้ารวมระบบ ใช้รายการเดียวกัน (ลิงก์ตรงกัน) · โปสเตอร์น้องน้ำผึ้ง 16 ระบบ */
(()=>{
 const F3=()=>{try{return document.getElementById('f3d').contentWindow;}catch(e){return null;}};
 const G=g=>()=>{closeAll();goScreen(g);};
 const soon=n=>()=>toast('🚧 '+n+' · เร็วๆ นี้',1);
 const farmGo=()=>{closeAll();try{farm=1;render();}catch(e){}const w=F3();w&&w.__s3farm&&w.__s3farm(1);};
 const pet=()=>{closeAll();const el=$('delSheet');el.innerHTML='<h3>🐾 Pet Care</h3>'+
   '<div class="dreq" data-g="dog" style="cursor:pointer"><span style="font-size:1.9rem">🐶</span><b>สวนหมา</b><span>›</span></div>'+
   '<div class="dreq" data-g="catpen" style="cursor:pointer"><span style="font-size:1.9rem">🐱</span><b>สวนแมว</b><span>›</span></div>';
   el.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{closeAll();goScreen(b.dataset.g);});open('delSheet');};
 // [key, ชื่อ, คำอธิบายสั้น, ไป, หมวด]
 const SYS=[
  ['farm','🌾 ฟาร์ม','ปลูก · แต่งสวน',farmGo,'home'],
  ['house','🏠 บ้าน','ห้องนอน · ครัว · ใต้ดิน',()=>{closeAll();window.__S4B&&window.__S4B.house();},'home'],
  ['backyard','🍳 หลังบ้าน','ทำอาหาร · แฮมสเตอร์',G('backyard'),'home'],
  ['barn','🐔 โรงเรือนสัตว์','ไก่ วัว หมู ปลา เม่น',()=>{closeAll();window.__S4B&&window.__S4B.zone('barn');},'ani'],
  ['safari','🦒 ซาฟารี','นกกระจอกเทศ · โดโด้',G('birds'),'ani'],
  ['petcare','🐾 Pet Care','สวนหมา · สวนแมว',pet,'ani'],
  ['alpaca','🦙 ทุ่งอัลปาก้า','ตัดขน · โรงงาน 2 แห่ง',G('alpaca'),'ani'],
  ['fishing','🎣 ตกปลา','20 แท่น · VIP',G('fishing'),'place'],
  ['shop','📈 ตลาดสวน','หุ้น · รับซื้อ · ลอยกระทง',G('shop'),'place'],
  ['neighborhood','🏘️ เนเบอร์ฮูด','ภารกิจทีม · ชุมชน',G('neighborhood'),'place'],
  ['boat','🚤 แข่งเรือ','5 ทีม · เสบียง · การ์ด',G('boat'),'place'],
  ['minigames','🎮 มินิเกม','เหรียญกระทงทอง',G('minigames'),'place'],
  ['topspenders','🏆 Top Spenders','อันดับ · กาชาปอง',G('topspenders'),'place'],
  ['campaigns','🏅 แคมเปญ','รางวัล 10 ขั้น',G('campaigns'),'place'],
  ['treewar','🏮 ศึกโคมลอย','เร็วๆ นี้',soon('ศึกโคมลอย'),'place',1],
  ['city','🏯 นครยัยหนู','เร็วๆ นี้',soon('นครยัยหนู'),'place',1]];
 const css=document.createElement('style');css.textContent=`
#places .s4g{margin:.55rem 0 .25rem;font-size:.72rem;font-weight:800;color:#9a7a68;letter-spacing:.02em}
#places .s4r{display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem}
#places .s4i{position:relative;border:0;padding:0;background:#fff;border-radius:.8rem;overflow:hidden;box-shadow:0 2px 6px rgba(90,52,18,.18);text-align:center;font-family:inherit}
#places .s4i img{display:block;width:100%;aspect-ratio:1;object-fit:cover}
#places .s4i b{display:block;font-size:.66rem;line-height:1.25;padding:.22rem .15rem .3rem;color:#5a3412;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#places .s4i.soon img{filter:saturate(.35) brightness(.85)}#places .s4i.soon::after{content:'เร็วๆ นี้';position:absolute;top:.3rem;right:.3rem;font-size:.55rem;font-weight:800;background:#ff8fb3;color:#fff;border-radius:999px;padding:.05rem .4rem}
#s4hub{position:fixed;inset:0;z-index:2147482500;background:linear-gradient(#1d2a6b,#3b2a6e 55%,#6b3a6e);display:none;flex-direction:column}
#s4hub.on{display:flex}#s4hub .hd{display:flex;align-items:center;justify-content:space-between;padding:calc(env(safe-area-inset-top,0px) + .7rem) 1rem .5rem;color:#fff}
#s4hub .hd b{font-size:1.05rem;text-shadow:0 2px 4px rgba(0,0,0,.3)}#s4hub .hd button{border:0;border-radius:50%;width:2.1rem;height:2.1rem;background:rgba(255,255,255,.18);color:#fff;font-size:1rem}
#s4hub .gr{flex:1;overflow:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:.55rem;padding:.3rem 1rem calc(1rem + env(safe-area-inset-bottom,0px));align-content:start}
#s4hub .c{position:relative;display:flex;flex-direction:column;border:0;padding:0;border-radius:1rem;overflow:hidden;background:#fff6e6;box-shadow:0 0 0 2px rgba(255,214,120,.55),0 6px 14px rgba(0,0,0,.3);font-family:inherit;transition:transform .12s}
#s4hub .c:active{transform:scale(.96)}#s4hub .c img{display:block;width:100%;aspect-ratio:1;object-fit:cover}
#s4hub .c b{display:block;font-size:.72rem;color:#5a3412;padding:.3rem .2rem 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#s4hub .c small{display:block;font-size:.56rem;color:#a07a5a;padding:0 .2rem .35rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#s4hub .c.soon img{filter:saturate(.35) brightness(.8)}#s4hub .c.soon::after{content:'เร็วๆ นี้';position:absolute;top:.35rem;right:.35rem;font-size:.58rem;font-weight:800;background:#ff8fb3;color:#fff;border-radius:999px;padding:.05rem .45rem}
#s4hub .c::before{content:'';position:absolute;inset:0;border-radius:1rem;box-shadow:inset 0 0 0 1px rgba(255,255,255,.5);pointer-events:none}`;document.head.appendChild(css);
 const img=k=>'images/s4p-'+k+'.webp';
 // 🗺️ ทางลัด
 const GRP=[['home','🏡 บ้านของฉัน'],['ani','🐾 สัตว์'],['place','🗺️ สถานที่']];
 const pl=$('places');
 pl.innerHTML=GRP.map(([g,t])=>'<div class="s4g">'+t+'</div>'+SYS.filter(s=>s[4]===g&&s[0]!=='farm').map(s=>{const sp=s[1].indexOf(' ');return '<button type="button" class="s4l'+(s[5]?' soon':'')+'" data-k="'+s[0]+'"><i>'+s[1].slice(0,sp)+'</i><span><b>'+s[1].slice(sp+1)+'</b>'+(s[5]?'':'<small>'+s[2]+'</small>')+'</span></button>';}).join('')).join('');
 pl.onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;const s=SYS.find(x=>x[0]===b.dataset.k);s&&s[3]();};
 const dh=document.querySelector('#drawer h3');if(dh)dh.textContent='🗺️ ทางลัด';
 // 🌾 หน้ารวมระบบ
 const hub=document.createElement('div');hub.id='s4hub';document.body.appendChild(hub);
 hub.innerHTML='<div class="hd"><b>🌾 ในสวนของยัยหนู · ทุกระบบ</b><button type="button" aria-label="ปิด">✕</button></div><div class="gr">'+
  SYS.map(s=>'<button type="button" class="c'+(s[5]?' soon':'')+'" data-k="'+s[0]+'"><img src="'+img(s[0])+'" alt=""><b>'+s[1]+'</b><small>'+s[2]+'</small></button>').join('')+'</div>';
 hub.onclick=e=>{if(e.target.closest('.hd button')){hub.classList.remove('on');return;}const b=e.target.closest('[data-k]');if(!b)return;hub.classList.remove('on');const s=SYS.find(x=>x[0]===b.dataset.k);s&&s[3]();};
 const fb=$('farmBtn');if(fb)fb.onclick=()=>{closeAll();hub.classList.add('on');};
 window.__s4hub=()=>hub.classList.add('on');
 window.__s4SYS=SYS;
})();
