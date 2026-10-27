import {ALPACA_MB} from './alpaca-menu.js?v=ss3-fix22';
import {altPick,altHave,altText,ALT_X} from './broom-pay.js?v=ss3-fix23';
/* fix17 😈 ไอเทมปีศาจ — ฝั่งเปลือกเกม (ทุกหน้า): ฝั่งคนโดน + กระเป๋า 48 ชม.
   อ่าน players/{uid}/gameViews/demon ของตัวเองเท่านั้น (ไม่มีชื่อคนแกล้ง) · หักอัตโนมัติตามเวลาจริง (ส่ง settle เมื่อถึงกำหนด)
   วิดเจ็ตเล็กชิดขอบขวา (หัวใจ · หีบโลง · นาฬิกาทราย · กระเป๋า) · แจ้งเตือนเป็นแคปซูลเล็กมุมซ้ายบน · ฉากสวนวาดโดย prank-ui (อ่าน window.__DEMON) */
const IT={
 music:{n:'กล่องดนตรีหมูปีศาจ',img:'images/prank-musicbox.webp',e:'🎶',boom:100000,toss:50000},
 hour:{n:'นาฬิกาทรายปีศาจ',img:'images/prank-hourglass.webp',e:'⏳',boom:200000,toss:100000},
 coffin:{n:'หีบโลงต้องสาป',img:'images/prank-coffin.webp',e:'⛓️',boom:300000,toss:150000},
 heart:{n:'หัวใจทับทิมปีศาจ',img:'images/prank-heart.webp',e:'💖',boom:500000,toss:250000},
 ghost:{n:'ของผีสิง',img:'images/alpaca-hw-ghost.webp',e:'👻'}};/* fix21 👻 ไม่ใช่ของในกระเป๋า (bag.demon ไม่มี ghost) */
const GHOST_BROOM=100,MB=k=>ALPACA_MB[k]||{n:'ของแปรรูป',img:'images/alpaca-hw-ghost.webp',merit:0};
const HEART_MSG='หัวใจต้องคำสาป  คุณจำเป็นที่จะจะต้องส่งต่อ  หัวใจนี้ถ้าไม่อย่างนั้น จะมีอันเป็นไป  ไม่เชื่อใช่ไหม   ก็ลองดูสิ ฮ่า ฮ่า ฮ่า';
const HG_EVERY=6*60000,HG_TICKS=10,HG_TICK=10000,HEART_TIME=10*60000,EXPIRE=48*3600000,FLIP=100,HEART_STAY=1500,HEART_AWAY=1000,HEART_AMT=250000;
const CSS=`
.dm-tst{position:fixed;z-index:9001;left:max(.6rem,env(safe-area-inset-left,0px));top:calc(env(safe-area-inset-top,0px) + 3.3rem);display:flex;flex-direction:column;gap:.25rem;pointer-events:none;max-width:min(62vw,calc(100vw - 11.5rem));font-family:'Mali',system-ui,sans-serif}
.dm-tt{display:flex;align-items:center;gap:.35rem;background:rgba(28,10,18,.88);color:#fff;border:1.5px solid rgba(255,107,130,.7);border-radius:999px;padding:.12rem .6rem .12rem .15rem;font-size:.68rem;font-weight:700;box-shadow:0 4px 10px rgba(0,0,0,.3);animation:dmtin .35s cubic-bezier(.2,1.4,.4,1)}
.dm-tt img{width:1.4rem;height:1.4rem;object-fit:contain;flex:none}.dm-tt span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dm-tt b{color:#FFB3C0}.dm-tt.good{border-color:#9EDDB6}.dm-tt.good b{color:#B8FFD4}.dm-tt.out{animation:dmtout .3s forwards}
@keyframes dmtin{from{opacity:0;transform:translateX(-10px)}}@keyframes dmtout{to{opacity:0;transform:translateX(-10px)}}
.dm-col{position:fixed;z-index:8990;left:max(.35rem,env(safe-area-inset-left,0px));top:calc(env(safe-area-inset-top,0px) + 11.4rem);display:flex;flex-direction:column;align-items:flex-start;gap:.3rem;font-family:'Mali',system-ui,sans-serif;pointer-events:none}/* fix17e: ป้ายเล็กชิดขอบซ้ายกลางจอ ไม่ทับปุ่มของหน้า */
.dm-w{pointer-events:auto;display:flex;align-items:center;gap:.35rem;background:rgba(28,10,18,.88);color:#fff;border:2px solid rgba(255,107,130,.75);border-radius:1rem;padding:.2rem .45rem .2rem .2rem;box-shadow:0 0 12px rgba(216,30,60,.5),0 6px 14px rgba(0,0,0,.3);font-size:.64rem;font-weight:700;font-variant-numeric:tabular-nums;cursor:pointer;max-width:12.5rem;animation:dmtin .35s}
.dm-w img{width:2.1rem;height:2.1rem;object-fit:contain;filter:drop-shadow(0 0 6px rgba(255,60,90,.8));flex:none}
.dm-w small{display:block;font-weight:600;font-size:.56rem;color:#FFC9D2}
.dm-w button{border:0;border-radius:999px;padding:.18rem .45rem;font:800 .6rem 'Mali',sans-serif;cursor:pointer;background:#fff;color:#D81E3C;flex:none}
.dm-w.hg img{animation:dmhg 6s linear infinite}@keyframes dmhg{0%,45%{transform:rotate(0)}50%,95%{transform:rotate(180deg)}100%{transform:rotate(360deg)}}
.dm-w.ht{flex-direction:column;gap:.1rem;padding:.3rem .4rem;border-radius:1.1rem}.dm-w.ht img{width:2.7rem;height:2.7rem;animation:dmbeat 1s ease-in-out infinite}.dm-w.ht .tm{font-size:.78rem}
.dm-w.ht.hot{border-color:#ff2a4a;box-shadow:0 0 18px rgba(255,42,74,.9)}
@keyframes dmbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.15)}30%{transform:scale(1)}45%{transform:scale(1.1)}}
.dm-w.cf img{animation:dmcs 2.4s ease-in-out infinite}@keyframes dmcs{0%,80%,100%{transform:rotate(0)}84%{transform:rotate(-4deg)}88%{transform:rotate(4deg)}92%{transform:rotate(-2deg)}}
.dm-w.bag{border-color:rgba(255,190,90,.8);box-shadow:0 0 10px rgba(242,179,61,.45)}.dm-w.bag.warn{animation:dmwarn 1s infinite}@keyframes dmwarn{50%{box-shadow:0 0 18px rgba(255,42,74,.95)}}
.dm-vig{position:fixed;inset:0;z-index:8980;pointer-events:none;box-shadow:inset 0 0 60px 10px rgba(216,30,60,.45);animation:dmvb 1s ease-in-out infinite}
@keyframes dmvb{0%,100%{opacity:.3}15%{opacity:.85}30%{opacity:.35}45%{opacity:.7}}
.dm-shade{position:fixed;inset:0;z-index:9010;background:rgba(20,5,12,.5);opacity:0;pointer-events:none;transition:.2s}.dm-shade.on{opacity:1;pointer-events:auto}
.dm-sheet{position:fixed;z-index:9011;left:50%;bottom:0;width:min(27rem,100vw);transform:translate(-50%,105%);transition:transform .22s ease-out;background:#FFFBF5;color:#6E4B3A;border:3px solid #fff;border-bottom:0;border-radius:1.6rem 1.6rem 0 0;padding:.85rem max(16px,env(safe-area-inset-right,0px)) calc(env(safe-area-inset-bottom,0px) + 1rem) max(16px,env(safe-area-inset-left,0px));max-height:86vh;overflow:auto;font-family:'Mali',system-ui,sans-serif;box-sizing:border-box}
.dm-sheet.on{transform:translate(-50%,0)}
.dm-sheet.dark{background:linear-gradient(180deg,#2a0c16,#16060c);border-color:#ff6b82;color:#FFE3E8;box-shadow:0 0 30px rgba(216,30,60,.5)}
.dm-sheet h3{margin:0 0 .15rem;font-size:1rem;text-align:center;text-wrap:balance}
.dm-hint{font-size:.66rem;color:#9A7A68;text-align:center;margin-bottom:.5rem}.dm-sheet.dark .dm-hint,.dm-sheet.dark .dm-fine{color:#E8A8B4}
.dm-it{display:grid;grid-template-columns:3rem 1fr auto;align-items:center;gap:.5rem;width:100%;border:2px solid #F3E9DE;background:#fff;border-radius:1rem;padding:.4rem .55rem;margin-bottom:.32rem;text-align:left;box-sizing:border-box}
.dm-it img{width:3rem;height:3rem;object-fit:contain;filter:drop-shadow(0 0 5px rgba(216,30,60,.45))}
.dm-it b{font-size:.8rem;display:block}.dm-it .r{text-align:right;font-size:.64rem;font-weight:800;color:#D81E3C;font-variant-numeric:tabular-nums}.dm-it .r small{display:block;color:#9A7A68;font-weight:600}
.dm-next{font-size:.66rem;color:#8B1028;margin:.15rem 0}.dm-next em{font-style:normal;font-weight:800;color:#D81E3C}
.dm-exp{display:inline-block;background:#FFF0F3;color:#D81E3C;border-radius:999px;padding:0 .4em;font-size:.6rem;font-weight:800;margin:.1rem .15rem 0 0}.dm-exp.warn{background:#D81E3C;color:#fff;animation:dmew 1s infinite}@keyframes dmew{50%{opacity:.6}}
.dm-mini{border:0;background:none;color:#9A7A68;font:700 .62rem 'Mali',sans-serif;text-decoration:underline;cursor:pointer;padding:0;margin-top:.15rem}
.dm-row{display:flex;gap:.4rem;justify-content:center;margin-top:.55rem;flex-wrap:wrap}
.dm-big{border:3px solid #fff;border-radius:999px;font:800 .8rem 'Mali',sans-serif;padding:.5rem .95rem;cursor:pointer;background:#6CC9A8;color:#fff;box-shadow:0 4px 0 #4DAA8A,0 8px 16px rgba(0,0,0,.25)}
.dm-big.devil{background:linear-gradient(180deg,#ff5a72,#b30f2b);box-shadow:0 4px 0 #7a0a1c,0 0 16px rgba(216,30,60,.55)}.dm-big.dark{background:linear-gradient(180deg,#4a2a3a,#22101a);box-shadow:0 4px 0 #120810}
.dm-big:disabled{opacity:.5}
.dm-fine{font-size:.62rem;color:#9A7A68;text-align:center;margin-top:.35rem}
.dm-seals{display:grid;grid-template-columns:repeat(3,1fr);gap:.55rem;margin:.6rem .4rem}
.dm-seal{aspect-ratio:1;border-radius:50%;border:3px solid #F2B33D;background:radial-gradient(circle at 35% 30%,#ff8a9a,#a50d27 60%,#5a0612);box-shadow:0 0 16px rgba(255,60,90,.7),inset 0 -6px 10px rgba(0,0,0,.35);cursor:pointer;display:grid;place-items:center;font-size:1.6rem;color:#FFE7A8;animation:dmsf 2s ease-in-out infinite}
.dm-seal:nth-child(2){animation-delay:.3s}.dm-seal:nth-child(3){animation-delay:.6s}@keyframes dmsf{50%{transform:translateY(-5px)}}
.dm-seal.r{animation:none;transform:scale(1.1);box-shadow:0 0 26px #fff,0 0 16px rgba(255,60,90,.9)}.dm-seal.dim{opacity:.35;animation:none}.dm-seal:disabled{cursor:default}
.dm-curse{font-size:.9rem;line-height:1.7;text-align:center;font-weight:700;color:#FFE3E8;text-shadow:0 0 10px rgba(255,60,90,.6);margin:.4rem 0 .5rem;white-space:pre-wrap}
.dm-bigimg{display:block;width:40%;margin:.1rem auto;filter:drop-shadow(0 0 18px rgba(255,60,90,.9))}.dm-bigimg.beat{animation:dmbeat 1s infinite}
.dm-ppl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.3rem;max-height:13rem;overflow:auto}
.dm-ppl button{border:2px solid rgba(255,107,130,.5);background:rgba(255,255,255,.06);color:#FFE3E8;border-radius:.8rem;padding:.4rem .2rem;font:700 .7rem 'Mali',sans-serif;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dm-ppl button:disabled{opacity:.45}
.dm-sum{display:grid;gap:.25rem;margin:.4rem 0}
.dm-sum div{display:grid;grid-template-columns:2rem 1fr auto;align-items:center;gap:.4rem;background:#fff;border:2px solid #F3E9DE;border-radius:.8rem;padding:.2rem .45rem;font-size:.72rem;font-variant-numeric:tabular-nums}
.dm-sum img{width:2rem;height:2rem;object-fit:contain}.dm-sum b{color:#E0475E}.dm-sum .tot{background:#FFF0F3;border-color:#FFC1CC;font-weight:800}
.dm-fly{position:fixed;z-index:9020;width:4rem;pointer-events:none;filter:drop-shadow(0 0 10px rgba(255,60,90,.9));transition:transform .9s cubic-bezier(.5,-.3,.5,1),opacity .9s}
.dm-boom{position:fixed;z-index:9020;width:10rem;height:10rem;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,#fff,rgba(255,80,110,.85) 30%,rgba(120,0,20,.4) 60%,transparent 72%);animation:dmbm .6s ease-out forwards;pointer-events:none}
@keyframes dmbm{from{transform:translate(-50%,-50%) scale(.2)}to{transform:translate(-50%,-50%) scale(1.6);opacity:0}}
.dm-fxt{position:fixed;z-index:9021;transform:translate(-50%,-50%);font-family:'Kanit','Mali',sans-serif;font-style:italic;font-weight:900;font-size:1.35rem;color:#fff;-webkit-text-stroke:2px #8a0a1f;paint-order:stroke;text-shadow:0 0 10px rgba(255,42,74,.9);pointer-events:none;white-space:nowrap;animation:dmft 1.5s ease-out forwards}
.dm-fxt.good{-webkit-text-stroke-color:#0A5A2A;text-shadow:0 0 10px rgba(80,220,140,.9)}
@keyframes dmft{0%{opacity:0;transform:translate(-50%,-20%) scale(.5)}15%{opacity:1;transform:translate(-50%,-70%) scale(1.15)}100%{opacity:0;transform:translate(-50%,-170%)}}
.dm-note{position:fixed;z-index:9020;font-size:1.6rem;color:#ff4d6d;text-shadow:0 0 8px #ff9aaa,0 2px 2px rgba(0,0,0,.4);pointer-events:none;animation:dmnt 1.8s ease-out forwards}
@keyframes dmnt{0%{opacity:0;transform:translate(0,0) scale(.5)}20%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-6rem) scale(1.2) rotate(var(--r))}}
.dm-sheet button:focus-visible,.dm-w:focus-visible{outline:3px solid #fff;outline-offset:2px}
/* fix17e ป้ายเล็ก */
.dm-p{pointer-events:auto;display:flex;align-items:center;gap:.25rem;background:rgba(28,10,18,.82);color:#fff;border:1.5px solid rgba(255,107,130,.75);border-radius:999px;padding:.1rem .45rem .1rem .12rem;box-shadow:0 0 8px rgba(216,30,60,.45);font:700 .62rem 'Mali',sans-serif;font-variant-numeric:tabular-nums;cursor:pointer;animation:dmtin .3s}
.dm-p img{width:1.45rem;height:1.45rem;object-fit:contain}.dm-p.hot{border-color:#ff2a4a;box-shadow:0 0 12px rgba(255,42,74,.9)}.dm-p.ht img{animation:dmbeat 1s ease-in-out infinite}.dm-p.bag{border-color:rgba(255,190,90,.8)}.dm-p.bag.warn{animation:dmwarn 1s infinite}
.dm-fly,.dm-note,.dm-fxt,.dm-boom,.dm-tst,.dm-tt,.dm-vig{pointer-events:none!important}.dm-ppl button.on{background:#D81E3C;color:#fff;border-color:#D81E3C}
.dm-last{display:inline-block;background:#D81E3C;color:#fff;border-radius:99px;padding:0 .4rem;font-size:.62rem;vertical-align:middle}
.dm-one{padding:.2rem .5rem .2rem .2rem;font-size:.9rem;gap:.15rem}.dm-one img{width:1.9rem;height:1.9rem}.dm-one.hot{border-color:#ff2a4a;animation:dmwarn 1.2s infinite}.dm-one .dm-badge{font-size:.78rem;padding:0 .4em}.dm-badge.dot{background:#FFB020}.dm-cd{color:#D81E3C;font-variant-numeric:tabular-nums}.dm-amt{display:block;font-size:.66rem;color:#D81E3C;font-weight:800;margin-bottom:.15rem}.dm-sec small{font-weight:600;color:#9A7A68;font-size:.62rem;margin-left:.25rem}.dm-scroll{max-height:58vh;overflow:auto;-webkit-overflow-scrolling:touch}
.dm-p.sum{border-color:#FFD27A}.dm-p.sum.new{box-shadow:0 0 10px rgba(255,200,90,.8)}.dm-badge{background:#E0475E;color:#fff;border-radius:999px;padding:0 .35em;font-size:.62rem;margin-left:.2rem}.dm-sec{font-weight:800;font-size:.8rem;margin:.55rem 0 .3rem;color:#6E4B3A}.dm-gl small.nd{color:#2E8B57}
.dm-p.gh{border-color:#9EF0B8;box-shadow:0 0 10px rgba(120,255,170,.6)}.dm-p.gh.hot{animation:dmwarn 1s infinite}.dm-p.gr{border-color:rgba(190,170,255,.8)}
.dm-gl{display:grid;grid-template-columns:2.6rem 1fr auto;gap:.45rem;align-items:center;background:#fff;border:2px solid #EFE6FA;border-radius:1rem;padding:.35rem .5rem;margin-bottom:.3rem}
.dm-gl .pic{position:relative;width:2.6rem;height:2.6rem}.dm-gl .pic img{width:100%;height:100%;object-fit:contain}.dm-gl .pic i{position:absolute;right:-.35rem;bottom:-.3rem;width:1.5rem;height:1.5rem;background:url(images/alpaca-hw-ghost.webp) center/contain no-repeat;filter:drop-shadow(0 0 4px #7CFFB0)}
.dm-gl b{font-size:.78rem;display:block}.dm-gl small{display:block;font-size:.62rem;color:#8A6AA8;font-weight:700}.dm-gl .r{font-size:.72rem;font-weight:800;color:#D81E3C;text-align:right}
.dm-gb{display:flex;gap:.3rem;flex-wrap:wrap;margin:.35rem 0}.dm-gb button{flex:1 1 auto;border:2px solid #E6D2FA;background:#FBF6FF;border-radius:999px;padding:.35rem .6rem;font:800 .76rem Mali,sans-serif;color:#6A2FB8}.dm-gb button.on{background:#7A2FD8;color:#fff;border-color:#7A2FD8}.dm-gb button:disabled{opacity:.45}
.dm-mini2{border:0;border-radius:.7rem;padding:.3rem .5rem;font:800 .66rem Mali,sans-serif;margin-left:.2rem}.dm-mini2.sw{background:#F1E7FF;color:#6A2FB8}.dm-mini2.ok{background:#FFE9EC;color:#C21D3A}
@media (prefers-reduced-motion:reduce){.dm-w img,.dm-vig,.dm-seal,.dm-bigimg{animation:none!important}}`;
export function startDemon({watch,act,now,game,x17,uid,roster,screen}){
  if(!document.getElementById('dmcss')){const st=document.createElement('style');st.id='dmcss';st.textContent=CSS;document.head.appendChild(st);}
  const el=(cls,parent=document.body)=>{const d=document.createElement('div');d.className=cls;parent.appendChild(d);return d;};
  const tst=el('dm-tst'),col=el('dm-col'),shade=el('dm-shade'),sheet=el('dm-sheet');sheet.setAttribute('role','dialog');
  const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
  const fmt=n=>Math.round(Math.abs(n)).toLocaleString('en-US');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hms=ms=>{ms=Math.max(0,ms);const h=Math.floor(ms/3600e3),m=Math.floor(ms%3600e3/60e3),s=Math.floor(ms%60e3/1e3);return h?h+':'+String(m).padStart(2,'0')+' ชม.':m+':'+String(s).padStart(2,'0');};
  let view=null,lock=false,busy=false,stopped=false;
  /* ---------- เอฟเฟกต์เล็ก ๆ ---------- */
  function tt(it,txt,amt,good){const d=document.createElement('div');d.className='dm-tt'+(good?' good':'');d.innerHTML=(it?'<img src="'+it.img+'" alt="">':'')+'<span>'+txt+(amt?' <b>'+amt+'</b>':'')+'</span>';tst.appendChild(d);while(tst.children.length>2)tst.firstChild.remove();setTimeout(()=>{d.classList.add('out');setTimeout(()=>d.remove(),300);},2800);}
  function fxt(x,y,t,good){const d=document.createElement('div');d.className='dm-fxt'+(good?' good':'');d.style.left=x+'px';d.style.top=y+'px';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1500);}
  function boom(x,y){const b=document.createElement('div');b.className='dm-boom';b.style.left=x+'px';b.style.top=y+'px';document.body.appendChild(b);setTimeout(()=>b.remove(),600);}
  function notes(){for(let i=0;i<6;i++)setTimeout(()=>{const n=document.createElement('span');n.className='dm-note';n.textContent=['♪','♫','♬'][i%3];n.style.left=(innerWidth*(.42+Math.random()*.16))+'px';n.style.top=(innerHeight*.45)+'px';n.style.setProperty('--dx',(Math.random()*6-3)+'rem');n.style.setProperty('--r',(Math.random()*60-30)+'deg');document.body.appendChild(n);setTimeout(()=>n.remove(),1800);},i*200);}
  const center=()=>[innerWidth/2,innerHeight*.45];
  function open(h,dark,locked){sheet.className='dm-sheet'+(dark?' dark':'');sheet.innerHTML=h;void sheet.offsetWidth;sheet.classList.add('on');shade.classList.add('on');lock=!!locked;}
  function close(){sheet.classList.remove('on');shade.classList.remove('on');lock=false;}
  shade.onclick=()=>{if(!lock)close();};
  async function run(input,quiet,wait){if(busy&&wait){for(let i=0;i<80&&busy;i++)await new Promise(r=>setTimeout(r,250));}if(busy){if(wait&&!quiet)tt(null,'⏳ ระบบกำลังบันทึกรายการอื่น ลองกดอีกครั้งนะ','');return wait?{busy:true}:null;}busy=true;/* fix20: ส่งต่อหัวใจรอรายการอัตโนมัติจบก่อน (เดิมชนกันแล้วขึ้น 'ตอนนี้ไม่ได้') */try{const out=await act('demon',input);if(out?.view){view=out.view;paint();}boomNotice(out?.boom);return out;}catch(e){if(!quiet)tt(null,'😈 '+esc(e.message||'ลองใหม่อีกครั้ง'),'');return null;}finally{busy=false;}}
  /* ---------- กระเป๋า 48 ชม. ---------- */
  const bag=()=>{const b=game?.()?.bag?.demon||{};return Object.fromEntries(Object.keys(IT).map(k=>[k,Math.max(0,Math.floor(Number(b[k])||0))]));};
  const lots=()=>{const L=x17?.()?.dm?.b;return Array.isArray(L)?L:[];};
  const lotsOf=k=>lots().filter(x=>x.k===k&&x.n>0).sort((a,b)=>a.at-b.at);
  function bagSheet(){const b=bag(),t=now();const rows=Object.entries(IT).filter(([k])=>b[k]>0);
    open('<h3>🎒 ไอเทมปีศาจของฉัน</h3><div class="dm-hint">ของแต่ละก้อนนับ 48 ชม. แยกกัน ตั้งแต่ตอนเข้ากระเป๋า · ก้อนไหนหมดเวลา 💥 ระเบิดเฉพาะก้อนนั้น · ใช้/ทิ้ง จะหยิบก้อนที่ใกล้หมดเวลาก่อนเสมอ · ใช้ที่สวนเพื่อน (ปุ่ม 😈)</div>'
      +(rows.length?rows.map(([k,it])=>{const L=lotsOf(k);return '<div class="dm-it"><img src="'+it.img+'" alt=""><div><b>'+it.e+' '+it.n+' ×'+b[k]+'</b>'+(L.length?'<div class="dm-next">💥 ก้อนแรกระเบิดในอีก <em>'+hms(L[0].at+EXPIRE-t)+'</em> · '+fmt(L[0].n)+' ชิ้น = −'+fmt(L[0].n*it.boom)+'</div>'+L.slice(0,8).map(x=>{const left=x.at+EXPIRE-t;return '<span class="dm-exp'+(left<6*3600e3?' warn':'')+'">⏳ '+hms(left)+' ×'+fmt(x.n)+'</span>';}).join('')+(L.length>8?'<span class="dm-exp">+อีก '+(L.length-8)+' ก้อน</span>':''):'<span class="dm-exp">⏳ 48:00 ชม.</span>')+'<br><button class="dm-mini" data-t="'+k+'">🗑️ ทิ้งลงบ่อ 1 ชิ้น (−'+fmt(it.toss)+')</button></div><div class="r">💥 −'+fmt(it.boom)+'<small>ถ้าหมดเวลา</small></div></div>';}).join('')
        :'<div class="dm-fine">ยังไม่มีไอเทมปีศาจ</div>')+'<div class="dm-fine">ได้จากการดูแลสัตว์เลี้ยง และเปิดกล่องสุ่มสัตว์</div>');
    sheet.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>{const k=x.dataset.t,it=IT[k];
      open('<img class="dm-bigimg" src="'+it.img+'" alt=""><h3>🗑️ ทิ้ง'+it.n+'ลงบ่อ?</h3><div class="dm-hint">ทิ้ง 1 ชิ้น เสีย −'+fmt(it.toss)+' กุศล (ครึ่งหนึ่งของตอนระเบิด)</div><div class="dm-row"><button class="dm-big devil" id="dmTossGo">🗑️ ทิ้งเลย</button><button class="dm-big dark" id="dmTossNo">ไม่ทิ้ง</button></div>');
      sheet.querySelector('#dmTossNo').onclick=bagSheet;sheet.querySelector('#dmTossGo').onclick=async e=>{e.currentTarget.disabled=true;const out=await run({type:'toss',kind:k});if(out?.toss){close();const [cx,cy]=center();fxt(cx,cy,'🗑️ −'+fmt(out.toss.amt));tt(it,'ทิ้ง'+it.n+'ลงบ่อแล้ว','−'+fmt(out.toss.amt));seenDl();}else bagSheet();};});}
  /* ระเบิด/ทิ้งของตัวเอง (x17.dm.dl) */
  const dlKey='dmDl:'+uid;
  function seenDl(){const dl=x17?.()?.dm?.dl||[];if(dl[0])ls.set(dlKey,String(dl[0].at));}
  function boomNotice(list){if(!list?.length)return;const [cx,cy]=center();let tot=0;for(const b of list){tot+=b.amt;tt(IT[b.k],'💥 '+IT[b.k].n+(b.n>1?' ×'+b.n:'')+' ระเบิด (เกิน 48 ชม.)','−'+fmt(b.amt));}boom(cx,cy);fxt(cx,cy,'💥 −'+fmt(tot));seenDl();}
  function dlCheck(){const dl=x17?.()?.dm?.dl||[],last=Number(ls.get(dlKey)||0);const fresh=dl.filter(r=>r.at>last&&r.w==='boom');if(fresh.length)boomNotice(fresh.map(r=>({k:r.k,n:r.n,amt:r.amt})));else if(dl[0]&&dl[0].at>last)seenDl();}
  /* ---------- ฝั่งคนโดน ---------- */
  const seenKey='dmSeen:'+uid;let seenAt=Number(ls.get(seenKey)||0),firstView=true;
  const rowKey=r=>r.at+'|'+r.k+'|'+r.w+'|'+(r.n||0)+'|'+(r.amt||0);
  const WHY={made:r=>'แปรรูปพลาด! ได้ของผีสิง ×'+(r.n||1)+' ต้องส่งให้เพื่อนใน 24 ชม.',gsent:r=>'ส่งของผีสิงแล้ว ×'+(r.n||1),gsweep:r=>'🧹 ปัดกวาดของผีสิง ×'+(r.n||1),gaccept:r=>'รับทราบของผีสิง ×'+(r.n||1),gauto:r=>'ของผีสิงครบ 24 ชม. หักอัตโนมัติ ×'+(r.n||1),hit:(r)=>IT.music.n+(r.n>1?' ×'+r.n:''),placed:r=>r.k==='hour'?'ใครสักคนวางนาฬิกาทรายปีศาจในสวนคุณ':'ใครสักคนวางหีบโลงต้องสาป สวนถูกล็อก',tick:r=>'ทรายดูดกุศล'+(r.n>1?' ×'+r.n:''),timeout:r=>r.k==='coffin'?'ไม่เปิดหีบโลงใน 30 นาที':r.k==='ghost'?'ไม่ได้ส่งต่อ ของผีสิงระเบิดในมือคุณ':'หัวใจต้องคำสาปแตกในมือคุณ',flip:()=>'คว่ำนาฬิกาทรายแล้ว ทรายหยุด',green:()=>'เปิดหีบโลง หลุดคำสาป',red:()=>'เปิดหีบโลง โดนคำสาปเต็ม',reflect:()=>'คำสาปสะท้อนกลับใส่คนแกล้ง คุณไม่เสียอะไร 😎',got:()=>'ใครสักคนส่งหัวใจทับทิมปีศาจมาให้คุณ',passed:()=>'ส่งหัวใจต่อแล้ว 💌',items:r=>'หัวใจแตก หักของแทน '+fmt(r.n||0)+' ชิ้น',pay:()=>'จ่ายแทนหัวใจ'};
  function logs(){const L=(view?.log||[]).slice().sort((a,b)=>a.at-b.at);const fresh=L.filter(r=>r.at>seenAt);if(L.length)seenAt=Math.max(seenAt,L.at(-1).at);ls.set(seenKey,String(seenAt));
    if(!fresh.length){firstView=false;return;}
    const lost=fresh.filter(r=>r.amt>0);
    const hits=fresh.filter(r=>r.amt>0||(r.w==='placed')||(r.w==='got')||(r.w==='items'));if(hits.length)setUnseen(unseen+hits.length);
    if(firstView&&lost.length>=2&&now()-fresh[0].at>60000){firstView=false;paint();return;}firstView=false;
    if(fresh.length>3){const sum=lost.reduce((a,r)=>a+r.amt,0);if(sum){const [cx,cy]=center();fxt(cx,cy,'😈 −'+fmt(sum));}paint();return;}
    for(const r of fresh.filter(r=>!['gsweep','gaccept','gsent'].includes(r.w)).slice(-3)){const it=IT[r.k],why=(WHY[r.w]||(()=>it.n))(r),good=['flip','reflect','passed','gsent'].includes(r.w);/* fix23: ไม่ขึ้นข้อความ เหลือแต่เอฟเฟกต์ · ดูรายละเอียดที่ปุ่ม 😈 */
      const [cx,cy]=center();if(r.w==='hit'){notes();setTimeout(()=>fxt(cx,cy,'🎶 −'+fmt(r.amt)),500);}else if(r.amt>=20000)fxt(cx,cy,(r.w==='timeout'&&r.k==='heart'?'💔 ':'')+'−'+fmt(r.amt));
      if(r.w==='reflect')fxt(cx,cy,'🔁 สะท้อนกลับ!',true);if(r.w==='items'&&r.n)fxt(cx,cy,'💔 −'+fmt(r.n)+' ชิ้น');
    }paint();}
  function awaySum(rows){const g={};for(const r of rows){const k=r.k+'|'+(r.w==='timeout'?'t':r.w);(g[k] ||= {k:r.k,w:r.w,n:0,amt:0}).n+=r.n||1;g[k].amt+=r.amt;}
    const list=Object.values(g),tot=list.reduce((a,x)=>a+x.amt,0);const label={hit:'กล่องดนตรีหมูปีศาจ',tick:'นาฬิกาทรายดูดกุศล',timeout:'',green:'เปิดหีบโลง (หลุดคำสาป)',red:'เปิดหีบโลง (คำสาปเต็ม)'};
    open('<h3>😈 ระหว่างที่คุณไม่อยู่…</h3><div class="dm-hint">ใครสักคนแกล้งคุณ · หักไปแล้วตามเวลาจริง · ไม่มีใครรู้ว่าใครแกล้ง</div><div class="dm-sum">'+list.map(x=>'<div><img src="'+IT[x.k].img+'" alt=""><span>'+(x.w==='timeout'?(x.k==='coffin'?'หีบโลงหมดเวลา':'หัวใจแตกในมือ'):(label[x.w]||IT[x.k].n))+' ×'+x.n+'</span><b>−'+fmt(x.amt)+'</b></div>').join('')+'<div class="tot"><span>💸</span><span>รวม</span><b>−'+fmt(tot)+'</b></div></div><div class="dm-row"><button class="dm-big" id="dmOkA">😤 รับทราบ</button></div>');
    sheet.querySelector('#dmOkA').onclick=close;}
  function todaySheet(){const L=(view?.log||[]).filter(r=>r.amt>0).slice(0,14);
    open('<h3>😈 วันนี้โดนแกล้ง</h3><div class="dm-hint">ไม่มีใครรู้ว่าใครแกล้ง · ระบบไม่เก็บชื่อให้ดู</div>'+(L.length?'<div class="dm-sum">'+L.map(r=>'<div><img src="'+IT[r.k].img+'" alt=""><span>'+esc((WHY[r.w]||(()=>IT[r.k].n))(r))+'<br><small style="color:#9A7A68">'+new Date(r.at).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})+'</small></span><b>−'+fmt(r.amt)+'</b></div>').join('')+'<div class="tot"><span>😈</span><span>รวมวันนี้</span><b>−'+fmt(view?.tot?.n||0)+'</b></div></div>':'<div class="dm-fine">วันนี้ยังไม่โดนแกล้ง 🎉</div>'));}
  /* หีบโลง: เลือกตรา 1 ดวง (ผลสุ่มไว้ตั้งแต่วาง) */
  function sealSheet(){const c=view?.cf?.[0];if(!c)return;
    open('<img class="dm-bigimg" src="'+IT.coffin.img+'" alt=""><h3>⛓️ เลือกตราผนึก 1 ดวง</h3><div class="dm-hint">⏳ <b class="dmcd">'+hms(c.until-now())+'</b> · ไม่เปิดในเวลา = −150,000 · ระหว่างนี้สวนถูกล็อก</div><div class="dm-seals">'+[0,1,2].map(i=>'<button class="dm-seal" data-s="'+i+'" aria-label="ตราผนึก '+(i+1)+'">💀</button>').join('')+'</div><div class="dm-fine">🟢 หลุดคำสาป −20,000 · 🔴 คำสาปเต็ม −65,000 · 🔁 สะท้อนกลับใส่คนแกล้ง</div>',true);
    const cd=setInterval(()=>{const e=sheet.querySelector('.dmcd');if(!e||!sheet.classList.contains('on'))return clearInterval(cd);e.textContent=hms(c.until-now());},1000);
    sheet.querySelectorAll('.dm-seal').forEach(b=>b.onclick=async()=>{const i=+b.dataset.s;sheet.querySelectorAll('.dm-seal').forEach(x=>x.disabled=true);const out=await run({type:'seal',id:c.id,pick:i},false,true);
      if(out?.busy){lock=false;sheet.querySelectorAll('.dm-seal').forEach(x=>x.disabled=false);return;}if(!out?.seal){lock=false;close();return;}const res=out.seal.seal;sheet.querySelectorAll('.dm-seal').forEach((x,j)=>{x.classList.add(j===i?'r':'dim');x.textContent={g:'🟢',r:'🔴',x:'🔁'}[res[j]];});
      setTimeout(()=>{clearInterval(cd);close();const [cx,cy]=center();boom(cx,cy);const r=out.seal.result;if(r==='x')fxt(cx,cy,'🔁 สะท้อนกลับ!',true);else fxt(cx,cy,(r==='g'?'🟢 ':'🔴 ')+'−'+fmt(out.seal.amt));},1400);});}
  /* นาฬิกาทราย: คว่ำด้วยไม้กวาด 100 (fix19) */
  const broom=()=>Math.floor(Number(game?.()?.bag?.halloween?.broom)||0);
  /* fix23 🧹 เลือกจ่าย: ไม้กวาด หรือของ 7 อย่าง ×5 (อย่างเดียว/คละ) */
  const pickPay=(n,title)=>altPick(document,{n,broom:broom(),game:game?.()||{},title});
  function flipSheet(){const list=(view?.hg||[]).slice();if(!list.length)return;const t=now();
    open('<h3>⏳ นาฬิกาทรายปีศาจในสวน</h3><div class="dm-hint">ดูดทีละ −10,000 ทุก 6 นาที · คว่ำได้ด้วยไม้กวาดแม่มด '+FLIP+' อัน (มี '+broom()+') หรือใช้ของแทน '+fmt(FLIP*ALT_X)+' ชิ้น</div>'+list.map(h=>{const paid=Math.min(HG_TICKS,Math.floor((t-h.at)/HG_EVERY));return '<div class="dm-it"><img src="'+IT.hour.img+'" alt=""><div><b>−'+fmt(paid*HG_TICK)+' / −'+fmt(HG_TICK*HG_TICKS)+'</b><span class="dm-exp">⏳ '+hms(h.end-t)+'</span></div><button class="dm-big devil" style="padding:.35rem .7rem;font-size:.7rem" data-f="'+esc(h.id)+'">🔄 คว่ำ</button></div>';}).join(''));
    sheet.querySelectorAll('[data-f]').forEach(b=>b.onclick=async()=>{const alt=await pickPay(FLIP,'🔄 คว่ำนาฬิกาทราย');if(!alt)return;b.disabled=true;const out=await run({type:'flip',id:b.dataset.f,alt},false,true);if(out?.flip?.items)tt(IT.hour,'จ่ายแทนไม้กวาด: '+esc(altText(out.flip.items)),'',true);if(out?.flip?.flipped){close();const [cx,cy]=center();fxt(cx,cy,'🔄 ทรายหยุดแล้ว!',true);}else if(out)flipSheet();});}
  /* หัวใจ: ข้อความคำสาป (ตามต้นฉบับ) → ส่งต่อ */
  function heartIntro(){const h=view?.ht?.[0];if(!h||sheet.classList.contains('on'))return;
    open('<img class="dm-bigimg beat" src="'+IT.heart.img+'" alt=""><div class="dm-curse">'+esc(HEART_MSG)+'</div><div class="dm-hint">⏳ 10 นาที · ส่งต่อได้อีก '+Math.max(0,3-(h.passes||0))+' ทอด · ไม่ส่ง = −250,000</div><div class="dm-row"><button class="dm-big devil" id="dmPassNow" '+((h.passes||0)>=3?'disabled':'')+'>💌 ส่งต่อเลย</button><button class="dm-big dark" id="dmLater">ไว้ก่อน</button></div>',true);
    sheet.querySelector('#dmPassNow').onclick=()=>passSheet();sheet.querySelector('#dmLater').onclick=close;}
  async function passSheet(hid){const h=(hid&&view?.ht?.find(x=>x.id===hid))||view?.ht?.[0];if(!h)return close();
    open('<h3>💌 ส่งหัวใจต่อให้ใคร?</h3><div class="dm-hint">ส่งคืนคนที่ส่งมาไม่ได้ · ส่งต่อได้อีก '+Math.max(0,3-(h.passes||0))+' ทอด</div><div class="dm-ppl"><div class="dm-fine">กำลังโหลดรายชื่อ…</div></div>',true);
    let rows=[];try{rows=(await roster())||[];}catch(e){}
    const box=sheet.querySelector('.dm-ppl');if(!box)return;const ppl=rows.filter(p=>p.uid!==uid&&!p.admin);
    box.innerHTML=ppl.length?ppl.map(p=>'<button data-p="'+esc(p.uid)+'">'+esc(p.name)+'</button>').join(''):'<div class="dm-fine">ยังไม่มีเพื่อนให้ส่ง</div>';
    sheet.insertAdjacentHTML('beforeend','<div class="dm-row"><button class="dm-big dark" id="dmBack">↩️ กลับ</button></div>');sheet.querySelector('#dmBack').onclick=centerSheet;
    box.querySelectorAll('[data-p]').forEach(b=>b.onclick=async()=>{box.querySelectorAll('button').forEach(x=>x.disabled=true);const out=await run({type:'pass',id:h.id,to:b.dataset.p},false,true);
      if(out?.pass){close();const w=col.querySelector('.ht')?.getBoundingClientRect()||{left:innerWidth-60,top:120};const f=document.createElement('img');f.className='dm-fly';f.src=IT.heart.img;f.style.left=w.left+'px';f.style.top=w.top+'px';document.body.appendChild(f);requestAnimationFrame(()=>{f.style.transform='translate(-'+(innerWidth*.6)+'px,-120px) scale(.4)';f.style.opacity='0';});setTimeout(()=>f.remove(),950);tt(IT.heart,'ส่งหัวใจต่อให้ '+esc(out.pass.name)+' แล้ว 💌','',true);}
      else{box.querySelectorAll('button').forEach(x=>x.disabled=false);if(!out?.busy){b.disabled=true;b.textContent='🚫 ตอนนี้ไม่ได้';}}});}
  /* ---------- fix21 👻 ของผีสิง ---------- */
  const ghostPic=g=>'<span class="pic"><img src="'+esc(MB(g).img)+'" alt=""><i></i></span>';
  const groupBy=list=>{const m=new Map();for(const h of list){const x=m.get(h.g)||{g:h.g,n:0,amt:0,until:Infinity,ids:[]};x.n++;x.amt+=Number(h.amt)||0;x.until=Math.min(x.until,Number(h.until)||Infinity);x.ids.push(h.id);m.set(h.g,x);}return [...m.values()].sort((a,b)=>a.until-b.until);};
  /* ฝั่งคนแปรรูป: ต้องส่งให้เพื่อนใน 24 ชม. */
  function ghostHoldSheet(){const list=(view?.gh||[]).slice().sort((a,b)=>a.until-b.until);if(!list.length)return close();const t=now(),tot=list.reduce((a,h)=>a+(Number(h.amt)||0),0);
    open('<h3>👻 ของผีสิงในมือคุณ ×'+list.length+'</h3><div class="dm-hint">แปรรูปพลาด ผีสิงของ! ส่งให้เพื่อนภายใน 24 ชม. · ไม่ส่ง = 💥 ระเบิดใส่ตัวเอง −'+fmt(tot)+' · ส่งได้ทุกคน (ทะลุหุ่นไล่กา) · เพื่อนจะไม่รู้ว่าใครส่ง</div>'
      +groupBy(list).map(x=>'<div class="dm-gl">'+ghostPic(x.g)+'<div><b>'+esc(MB(x.g).n)+'ผีสิง ×'+x.n+'</b><small>⏳ '+hms(x.until-t)+' · ถ้าระเบิด −'+fmt(x.amt/x.n)+'/ชิ้น</small></div><div class="r">−'+fmt(x.amt)+'</div></div>').join('')
      +'<div class="dm-row"><button class="dm-big devil" id="dmGSend">💌 เลือกเพื่อนส่งให้</button><button class="dm-big dark" id="dmGLater">ไว้ก่อน</button></div><div class="dm-fine">หรือไปสวนเพื่อนแล้วกด 😈 → 👻 ส่งของผีสิง</div>');
    sheet.querySelector('#dmGSend').onclick=ghostSendSheet;sheet.querySelector('#dmGLater').onclick=close;}
  async function ghostSendSheet(){const list=(view?.gh||[]).slice().sort((a,b)=>a.until-b.until);if(!list.length)return close();let cnt=list.length;
    const qs=[...new Set([1,5,10,list.length].filter(q=>q<=list.length))];
    open('<h3>💌 ส่งของผีสิงให้ใคร?</h3><div class="dm-hint">ส่งชิ้นที่ใกล้หมดเวลาก่อน · เพื่อนจะไม่รู้ว่าใครส่ง</div><div class="dm-gb">'+qs.map(q=>'<button data-q="'+q+'" class="'+(q===cnt?'on':'')+'">'+(q===list.length?'ทั้งหมด ×'+q:'×'+q)+'</button>').join('')+'</div><div class="dm-ppl"><div class="dm-fine">กำลังโหลดรายชื่อ…</div></div>',true);
    sheet.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{cnt=Number(b.dataset.q);sheet.querySelectorAll('[data-q]').forEach(x=>x.classList.toggle('on',x===b));});
    let rows=[];try{rows=(await roster())||[];}catch(e){}
    const box=sheet.querySelector('.dm-ppl');if(!box)return;const ppl=rows.filter(p=>p.uid!==uid&&!p.admin);
    box.innerHTML=ppl.length?ppl.map(p=>'<button data-p="'+esc(p.uid)+'">'+esc(p.name)+'</button>').join(''):'<div class="dm-fine">ยังไม่มีเพื่อนให้ส่ง</div>';
    sheet.insertAdjacentHTML('beforeend','<div class="dm-row"><button class="dm-big dark" id="dmBack">↩️ กลับ</button></div>');sheet.querySelector('#dmBack').onclick=ghostHoldSheet;
    box.querySelectorAll('[data-p]').forEach(b=>b.onclick=async()=>{box.querySelectorAll('button').forEach(x=>x.disabled=true);const ids=(view?.gh||[]).slice().sort((a,c)=>a.until-c.until).slice(0,cnt).map(h=>h.id);
      const out=await run({type:'gsend',to:b.dataset.p,ids},false,true);
      if(out?.gsend){close();tt(IT.ghost,'ส่งของผีสิง ×'+out.gsend.n+' ให้ '+esc(out.gsend.name)+' แล้ว 👻','',true);}
      else{box.querySelectorAll('button').forEach(x=>x.disabled=false);if(!out?.busy){b.disabled=true;b.textContent='🚫 ตอนนี้ไม่ได้';}}});}
  /* ฝั่งคนโดน: กองรอจัดการ (ไม่เด้ง) · ไม้กวาด 100/ชิ้น ลด 20–50% · ครบ 24 ชม. หักเต็มเอง */
  function ghostPileSheet(){const list=(view?.gr||[]).slice().sort((a,b)=>a.until-b.until);if(!list.length)return close();const t=now(),tot=list.reduce((a,h)=>a+(Number(h.amt)||0),0),br=broom();
    open('<h3>👻 ของผีสิงที่มีคนส่งมา ×'+list.length+'</h3><div class="dm-hint">ใครสักคนส่งของผีสิงมาให้ · จัดการได้ภายใน 24 ชม. · 🧹 ไม้กวาดแม่มด '+GHOST_BROOM+' อัน/ชิ้น (หรือของแทน '+fmt(GHOST_BROOM*ALT_X)+' ชิ้น) ลดยอดหัก 20–50% (สุ่ม) · ไม่จัดการ = หักเต็มอัตโนมัติ · 🧹 มี '+fmt(br)+'</div>'
      +'<div class="dm-gb"><button id="dmGSwAll">🧹 ปัดกวาดทั้งหมด (ไม้กวาด '+fmt(GHOST_BROOM*list.length)+')</button><button id="dmGOkAll">รับทราบทั้งหมด −'+fmt(tot)+'</button></div>'
      +'<div style="max-height:46vh;overflow:auto">'+list.map(h=>'<div class="dm-gl">'+ghostPic(h.g)+'<div><b>'+esc(MB(h.g).n)+'ผีสิง</b><small>⏳ เหลือ '+hms(h.until-t)+'</small></div><div class="r">−'+fmt(h.amt)+'<br><button class="dm-mini2 sw" data-sw="'+esc(h.id)+'">🧹</button><button class="dm-mini2 ok" data-ok="'+esc(h.id)+'">รับทราบ</button></div></div>').join('')+'</div>'
      );
    const go=async(ids,b)=>{let alt=null;if(b){alt=await pickPay(GHOST_BROOM*(ids==='all'?list.length:ids.length),'🧹 ปัดกวาดของผีสิง');if(!alt)return;}
      sheet.querySelectorAll('button').forEach(x=>x.disabled=true);const out=await run({type:'gclear',ids,broom:b,alt},false,true);if(out?.gclear?.items)tt(IT.ghost,'จ่ายแทนไม้กวาด: '+esc(altText(out.gclear.items)),'',true);
      if(out?.gclear){const r=out.gclear,[cx,cy]=center();fxt(cx,cy,(b?'🧹 ':'👻 ')+'−'+fmt(r.paid),!!b);tt(IT.ghost,b?'ปัดกวาด ×'+r.n+' ประหยัดไป '+fmt(r.saved):'รับทราบของผีสิง ×'+r.n,'−'+fmt(r.paid),!!b);}
      if(view?.gr?.length)ghostPileSheet();else close();};
    sheet.querySelector('#dmGSwAll').onclick=()=>go('all',true);sheet.querySelector('#dmGOkAll').onclick=()=>go('all',false);
    sheet.querySelectorAll('[data-sw]').forEach(b=>b.onclick=()=>go([b.dataset.sw],true));sheet.querySelectorAll('[data-ok]').forEach(b=>b.onclick=()=>go([b.dataset.ok],false));}
  /* fix22 📋 ศูนย์สรุปโดนแกล้ง (ไม่เด้งรัว): ต้องจัดการอะไร · ใช้อะไรแก้ · วันนี้โดนอะไรไปเท่าไหร่ */
  let unseen=Number(ls.get('dmUnseen:'+uid)||0);const setUnseen=n=>{unseen=n;ls.set('dmUnseen:'+uid,String(n));};
  const LBL={hit:'กล่องดนตรีหมูปีศาจ',tick:'นาฬิกาทรายดูดกุศล',timeout:'',green:'เปิดหีบโลง (หลุดคำสาป)',red:'เปิดหีบโลง (คำสาปเต็ม)',gauto:'ของผีสิงครบ 24 ชม.',gaccept:'รับทราบของผีสิง',gsweep:'ปัดกวาดของผีสิง (ลดแล้ว)',items:'หัวใจ (หักของไม่พอ ส่วนที่ขาด)',pay:'จ่ายแทนหัวใจด้วยกุศล'};
  function summarySheet(){setUnseen(0);paint();const v=view||{},t=now(),br=broom(),todo=[];
    const btn=(id,txt,dis)=>'<button class="dm-mini2 sw" data-do="'+id+'"'+(dis?' disabled':'')+'>'+txt+'</button>';
    if(v.ht?.length){const h=v.ht[0],l=h.seen?h.seen+HEART_TIME-t:HEART_TIME;todo.push(['heart','💖 หัวใจทับทิมปีศาจ ×'+v.ht.length,'ต้องส่งต่อใน '+hms(l)+' · ไม่ส่ง −250,000/ดวง','ไม่ต้องใช้ของ · แค่เลือกเพื่อนส่งต่อ',btn('ht','💌 ส่งต่อ')]);}
    if(v.cf?.length){const c=v.cf[0];todo.push(['coffin','⛓️ หีบโลงต้องสาป (สวนถูกล็อก)','ต้องเปิดใน '+hms(c.until-t)+' · ไม่เปิด −150,000','ไม่ต้องใช้ของ · เลือกตราผนึก 1 ใน 3',btn('cf','💀 เลือกตรา')]);}
    if(v.hg?.length)todo.push(['hour','⏳ นาฬิกาทรายปีศาจ ×'+v.hg.length,'ดูด −10,000 ทุก 6 นาที','🧹 ไม้กวาดแม่มด '+FLIP+' อัน/อัน (มี '+fmt(br)+')',btn('hg','🔄 คว่ำ',br<FLIP)]);
    if(v.gr?.length){const tot=v.gr.reduce((a,h)=>a+(Number(h.amt)||0),0),u=Math.min(...v.gr.map(h=>Number(h.until)||Infinity));todo.push(['ghost','👻 ของผีสิงที่มีคนส่งมา ×'+v.gr.length,'รวม −'+fmt(tot)+' · หักเต็มอัตโนมัติในอีก '+hms(u-t),'🧹 ไม้กวาดแม่มด '+GHOST_BROOM+' อัน/ชิ้น ลด 20–50% (มี '+fmt(br)+')',btn('gr','🧹 จัดการ')]);}
    if(v.gh?.length){const u=Math.min(...v.gh.map(h=>Number(h.until)||Infinity));todo.push(['ghost','👻 ของผีสิงในมือคุณ ×'+v.gh.length,'ต้องส่งให้เพื่อนใน '+hms(u-t)+' ไม่งั้นระเบิดใส่ตัวเอง','ไม่ต้องใช้ของ · เลือกเพื่อนส่ง',btn('gh','💌 ส่ง')]);}
    const day=new Date(t+7*3600e3).toISOString().slice(0,10),isToday=r=>new Date(r.at+7*3600e3).toISOString().slice(0,10)===day;
    const g={};for(const r of (v.log||[]).filter(r=>r.amt>0&&isToday(r))){const key=r.k+'|'+r.w;(g[key] ||= {k:r.k,w:r.w,n:0,amt:0}).n+=r.n||1;g[key].amt+=r.amt;}
    const rows=Object.values(g).sort((a,b)=>b.amt-a.amt),tot=rows.reduce((a,x)=>a+x.amt,0);
    open('<h3>📋 สรุปการโดนแกล้ง</h3><div class="dm-hint">ไม่มีใครรู้ว่าใครแกล้ง · ดูทีเดียวตรงนี้ได้ ไม่ต้องกดทีละอัน</div>'
      +'<div class="dm-sec">⚠️ ต้องจัดการตอนนี้</div>'+(todo.length?todo.map(([k,a,b2,need,act])=>'<div class="dm-gl"><span class="pic"><img src="'+IT[k].img+'" alt=""></span><div><b>'+a+'</b><small>'+b2+'</small><small class="nd">🧰 '+need+'</small></div><div class="r">'+act+'</div></div>').join(''):'<div class="dm-fine">ไม่มีอะไรค้าง 🎉</div>')
      +'<div class="dm-sec">😈 วันนี้โดนอะไรไปบ้าง</div>'+(rows.length?'<div class="dm-sum">'+rows.map(x=>'<div><img src="'+IT[x.k].img+'" alt=""><span>'+esc(x.w==='timeout'?(x.k==='coffin'?'หีบโลงหมดเวลา':x.k==='ghost'?'ของผีสิงระเบิดในมือ':'หัวใจแตกในมือ'):(LBL[x.w]||IT[x.k].n))+' ×'+x.n+'</span><b>−'+fmt(x.amt)+'</b></div>').join('')+'<div class="tot"><span>💸</span><span>รวมวันนี้</span><b>−'+fmt(tot)+'</b></div></div>':'<div class="dm-fine">วันนี้ยังไม่เสียอะไร 🎉</div>')
      +'<div class="dm-fine">🛡️ หุ่นไล่กากัน 🎶 ⏳ ⛓️ ได้ (💖 👻 ทะลุ) · 🧹 ไม้กวาดคราฟได้ที่ร้านฮาโลวีน</div>');
    sheet.querySelectorAll('[data-do]').forEach(b=>b.onclick=()=>({ht:passSheet,cf:sealSheet,hg:flipSheet,gr:ghostPileSheet,gh:ghostHoldSheet})[b.dataset.do]?.());}
  /* fix23 💌 ส่งหัวใจหลายดวงทีเดียว: เลือกเพื่อนได้หลายคน (คนละ 1 ดวง) · ส่งดวงที่ใกล้หมดเวลาก่อน */
  async function multiPassSheet(){const hs=(view?.ht||[]).filter(h=>(h.passes||0)<3).sort((a,c)=>(a.seen||Infinity)-(c.seen||Infinity));if(!hs.length)return centerSheet();const pick=new Set();
    open('<h3>💌 ส่งหัวใจหลายดวง</h3><div class="dm-hint">แตะเลือกเพื่อนได้หลายคน คนละ 1 ดวง (มี '+hs.length+' ดวงที่ส่งได้) · ส่งคืนคนที่ส่งมาไม่ได้</div><div class="dm-ppl"><div class="dm-fine">กำลังโหลดรายชื่อ…</div></div><div class="dm-row"><button class="dm-big devil" id="dmMGo" disabled>💌 ส่ง 0 ดวง</button><button class="dm-big dark" id="dmMBack">↩️ กลับ</button></div>',true);
    sheet.querySelector('#dmMBack').onclick=centerSheet;
    let rows=[];try{rows=(await roster())||[];}catch(e){}
    const box=sheet.querySelector('.dm-ppl');if(!box)return;const ppl=rows.filter(p=>p.uid!==uid&&!p.admin),go=sheet.querySelector('#dmMGo');
    box.innerHTML=ppl.length?ppl.map(p=>'<button data-p="'+esc(p.uid)+'">'+esc(p.name)+'</button>').join(''):'<div class="dm-fine">ยังไม่มีเพื่อนให้ส่ง</div>';
    const upd=()=>{go.disabled=!pick.size;go.textContent='💌 ส่ง '+pick.size+' ดวง';box.querySelectorAll('[data-p]').forEach(b=>{b.classList.toggle('on',pick.has(b.dataset.p));b.disabled=!pick.has(b.dataset.p)&&pick.size>=hs.length;});};
    box.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const u=b.dataset.p;pick.has(u)?pick.delete(u):pick.add(u);upd();});
    go.onclick=async()=>{go.disabled=true;box.querySelectorAll('button').forEach(x=>x.disabled=true);const list=[...pick];let ok=0,fail=[];
      for(let i=0;i<list.length;i++){const h=(view?.ht||[]).filter(x=>(x.passes||0)<3).sort((a,c)=>(a.seen||Infinity)-(c.seen||Infinity))[0];if(!h)break;go.textContent='⏳ กำลังส่ง '+(i+1)+'/'+list.length;
        const out=await run({type:'pass',id:h.id,to:list[i]},true,true);if(out?.pass)ok++;else fail.push((ppl.find(p=>p.uid===list[i])||{}).name||'');}
      tt(IT.heart,'ส่งหัวใจแล้ว '+ok+' ดวง'+(fail.length?' · ส่งไม่ได้: '+esc(fail.join(', ')):'')+' 💌','',true);centerSheet();};}
  const itemsLost=(log,isToday)=>{const m={};for(const r of (log||[]))if(r.it&&isToday(r))for(const [k,q] of Object.entries(r.it))m[k]=(m[k]||0)+(Number(q)||0);const t=altText(m);return t?'<div class="dm-fine" style="font-size:.72rem">🎁 ของที่เสียแทนหัวใจวันนี้: '+esc(t)+'</div>':'';};
  /* fix23 💖 จ่ายแทนหัวใจ (ทุกดวง): เสียของ 1,500 ชิ้น (คละ 7 อย่าง) หรือหัก 250,000 (ติดลบได้) */
  function heartPaySheet(hid){const h=view?.ht?.find(x=>x.id===hid);if(!h)return centerSheet();const g=game?.()||{},have=altHave(g),last=(h.passes||0)>=3,m=Number(g.merit)||0;
    open('<img class="dm-bigimg beat" src="'+IT.heart.img+'" alt=""><h3>💖 จ่ายแทนหัวใจดวงนี้</h3><div class="dm-hint">'+(last?'ทอดสุดท้าย ส่งต่อไม่ได้แล้ว · ':'ส่งต่อไม่ทันก็จ่ายแทนได้ · ')+'เลือก 1 อย่าง แล้วหัวใจดวงนี้จะหายไป'+(last?'<br>⚠️ ถ้าไม่อยู่ในเกมตอนหัวใจแตก จะโดนหักของ '+fmt(HEART_AWAY)+' ชิ้นแทน':'')+'</div>'
      +'<div class="dm-gl"><span class="pic" style="font-size:1.9rem;display:grid;place-items:center">🎁</span><div><b>เสียของ '+fmt(HEART_STAY)+' ชิ้น</b><small>คละ สากกะเบือ · มะพร้าว · เค้ก · แกลลอนน้ำมัน · หมวกกะลาสี · กล่องดนตรี · ปีกนางฟ้า (หักกองที่เยอะก่อน) · มีรวม '+fmt(have)+'</small></div><div class="r"><button class="dm-mini2 sw" data-hw="items" '+(have>=HEART_STAY?'':'disabled')+'>เลือก</button></div></div>'
      +'<div class="dm-gl"><span class="pic" style="font-size:1.9rem;display:grid;place-items:center">💸</span><div><b>หัก '+fmt(HEART_AMT)+' กุศล</b><small>ติดลบได้ · หลังหักเหลือ '+fmt(m-HEART_AMT)+'</small></div><div class="r"><button class="dm-mini2 sw" data-hw="merit">เลือก</button></div></div>'
      +'<div class="dm-row"><button class="dm-big dark" id="dmHBack">↩️ กลับ</button></div>',true);
    sheet.querySelector('#dmHBack').onclick=centerSheet;
    sheet.querySelectorAll('[data-hw]').forEach(b=>b.onclick=async()=>{sheet.querySelectorAll('button').forEach(x=>x.disabled=true);const out=await run({type:'hpay',id:h.id,how:b.dataset.hw},false,true);
      if(out?.hpay){const [cx,cy]=center();if(out.hpay.how==='items'){fxt(cx,cy,'🎁 −'+fmt(out.hpay.n)+' ชิ้น');tt(IT.heart,'จ่ายแทนหัวใจ: '+esc(altText(out.hpay.items)),'',true);}else fxt(cx,cy,'💔 −'+fmt(out.hpay.amt));}
      centerSheet();});}
  /* fix23 😈 ศูนย์ปีศาจ: ปุ่มเดียว + ตัวเลข (ไม่เด้ง ไม่เปลี่ยนทุกวินาที กดได้แน่นอน) · กดแล้วเห็นทุกอย่างทีละชิ้นพร้อมรูป เวลา และปุ่มจัดการ */
  function centerSheet(){setUnseen(0);const v=view||{},t=now(),br=broom(),b=bag();
    const cd=u=>'<b class="dm-cd" data-u="'+u+'">'+hms(u-t)+'</b>';
    const row=(img,title,sub,act,amt)=>'<div class="dm-gl"><span class="pic"><img src="'+img+'" alt=""></span><div><b>'+title+'</b><small>'+sub+'</small></div><div class="r">'+(amt?'<span class="dm-amt">'+amt+'</span>':'')+(act||'')+'</div></div>';
    const btn=(attrs,txt,dis)=>'<button class="dm-mini2 sw" '+attrs+(dis?' disabled':'')+'>'+txt+'</button>';
    let H='';
    const ht=(v.ht||[]).slice().sort((a,c)=>(a.seen?a.seen:t)-(c.seen?c.seen:t));
    if(ht.length)H+='<div class="dm-sec">💖 หัวใจทับทิมปีศาจ ×'+ht.length+' <small>ส่งต่อไม่ทัน = −250,000/ดวง · หรือกด 🎁 จ่ายด้วยของ '+fmt(HEART_STAY)+' ชิ้นแทน</small></div>'+(ht.filter(h=>(h.passes||0)<3).length>1?'<div class="dm-gb"><button data-mp="1" class="on">💌 ส่งหลายดวงทีเดียว (เลือกหลายคน)</button></div>':'')+ht.map((h,i)=>{const last=(h.passes||0)>=3;return row(IT.heart.img,'หัวใจดวงที่ '+(i+1)+(last?' <span class="dm-last">ทอดสุดท้าย</span>':''),(h.seen?'⏳ '+(last?'แตกใน ':'ส่งต่อภายใน ')+cd(h.seen+HEART_TIME):'⏳ เริ่มนับเมื่อเข้าเกม')+(last?' · ส่งต่อไม่ได้แล้ว':''),(last?'':btn('data-ph="'+esc(h.id)+'"','💌 ส่งต่อ'))+btn('data-hp="'+esc(h.id)+'"','🎁 จ่าย'),last?'':'ส่งได้อีก '+(3-(h.passes||0))+' ทอด');}).join('');
    if(v.cf?.length)H+='<div class="dm-sec">⛓️ หีบโลงต้องสาป <small>สวนถูกล็อกจนกว่าจะเปิด</small></div>'+v.cf.map(c=>row(IT.coffin.img,'หีบโลงในสวนคุณ','⏳ ต้องเปิดภายใน '+cd(c.until)+' · ไม่เปิด −150,000',btn('data-do="cf"','💀 เลือกตรา'))).join('');
    if(v.hg?.length)H+='<div class="dm-sec">⏳ นาฬิกาทรายปีศาจ ×'+v.hg.length+' <small>ดูด −10,000 ทุก 6 นาที</small></div>'+v.hg.map(h=>row(IT.hour.img,'นาฬิกาทรายในสวน','⏳ หมดใน '+cd(h.end)+' · 🧹 คว่ำใช้ไม้กวาด '+FLIP+' (มี '+fmt(br)+') หรือของ '+fmt(FLIP*ALT_X)+' ชิ้น',btn('data-do="hg"','🔄 คว่ำ'))).join('');
    if(v.gh?.length){const g=groupBy(v.gh);H+='<div class="dm-sec">👻 ของผีสิงในมือคุณ ×'+v.gh.length+' <small>ต้องส่งให้เพื่อน ไม่งั้นระเบิดใส่ตัวเอง</small></div>'+g.map(x=>'<div class="dm-gl">'+ghostPic(x.g)+'<div><b>'+esc(MB(x.g).n)+'ผีสิง ×'+x.n+'</b><small>⏳ ส่งภายใน '+cd(x.until)+'</small></div><div class="r"><span class="dm-amt">−'+fmt(x.amt)+'</span>'+btn('data-do="gh"','💌 ส่ง')+'</div></div>').join('');}
    if(v.gr?.length){H+='<div class="dm-sec">👻 ของผีสิงที่มีคนส่งมา ×'+v.gr.length+' <small>🧹 ไม้กวาด '+GHOST_BROOM+'/ชิ้น (หรือของ '+fmt(GHOST_BROOM*ALT_X)+') ลด 20–50% · ไม่จัดการ = หักเต็ม</small></div>'+v.gr.slice().sort((a,c)=>a.until-c.until).map(h=>'<div class="dm-gl">'+ghostPic(h.g)+'<div><b>'+esc(MB(h.g).n)+'ผีสิง</b><small>⏳ หักอัตโนมัติใน '+cd(h.until)+'</small></div><div class="r"><span class="dm-amt">−'+fmt(h.amt)+'</span>'+btn('data-do="gr"','🧹 จัดการ')+'</div></div>').join('');}
    const mine=Object.entries(IT).filter(([k])=>b[k]>0);
    if(mine.length)H+='<div class="dm-sec">🎒 ไอเทมปีศาจของฉัน <small>ใช้แกล้งเพื่อนได้ · ต้องใช้ภายใน 48 ชม.</small></div>'+mine.map(([k,it])=>{const L=lotsOf(k);return row(it.img,it.n+' ×'+fmt(b[k]),L.length?'⏳ ก้อนแรกระเบิดใน '+cd(L[0].at+EXPIRE)+' ('+fmt(L[0].n)+' ชิ้น)':'ใช้ที่สวนเพื่อน (ปุ่ม 😈)',btn('data-do="bag"','ดู'));}).join('');
    if(!H)H='<div class="dm-fine" style="font-size:.85rem;margin:1rem 0">ตอนนี้ไม่มีอะไรค้าง 🎉</div>';
    const day=new Date(t+7*3600e3).toISOString().slice(0,10),isToday=r=>new Date(r.at+7*3600e3).toISOString().slice(0,10)===day;
    const g={};for(const r of (v.log||[]).filter(r=>r.amt>0&&isToday(r))){const key=r.k+'|'+r.w;(g[key] ||= {k:r.k,w:r.w,n:0,amt:0}).n+=r.n||1;g[key].amt+=r.amt;}
    const rows=Object.values(g).sort((a,c)=>c.amt-a.amt),tot=rows.reduce((a,x)=>a+x.amt,0);
    open('<h3>😈 ศูนย์ปีศาจ</h3><div class="dm-hint">ทุกอย่างที่โดน/ที่ถืออยู่ รวมไว้ตรงนี้ · ไม่มีใครรู้ว่าใครแกล้ง</div><div class="dm-scroll">'+H
      +'<div class="dm-sec">📉 วันนี้เสียไปแล้ว</div>'+(rows.length?'<div class="dm-sum">'+rows.map(x=>'<div><img src="'+IT[x.k].img+'" alt=""><span>'+esc(x.w==='timeout'?(x.k==='coffin'?'หีบโลงหมดเวลา':x.k==='ghost'?'ของผีสิงระเบิดในมือ':'หัวใจแตกในมือ'):(LBL[x.w]||IT[x.k].n))+' ×'+x.n+'</span><b>−'+fmt(x.amt)+'</b></div>').join('')+'<div class="tot"><span>💸</span><span>รวมวันนี้</span><b>−'+fmt(tot)+'</b></div></div>':'<div class="dm-fine">วันนี้ยังไม่เสียอะไร 🎉</div>')
      +itemsLost(v.log,isToday)+'</div><div class="dm-fine">🛡️ หุ่นไล่กากัน 🎶 ⏳ ⛓️ ได้ (💖 👻 ทะลุ) · 🧹 ไม้กวาดคราฟได้ที่ร้านฮาโลวีน</div><div class="dm-row"><button class="dm-big dark" id="dmCClose">ปิด</button></div>');
    sheet.querySelector('#dmCClose').onclick=close;
    sheet.querySelectorAll('[data-ph]').forEach(x=>x.onclick=()=>passSheet(x.dataset.ph));sheet.querySelectorAll('[data-hp]').forEach(x=>x.onclick=()=>heartPaySheet(x.dataset.hp));sheet.querySelector('[data-mp]')?.addEventListener('click',multiPassSheet);
    sheet.querySelectorAll('[data-do]').forEach(x=>x.onclick=()=>({cf:sealSheet,hg:flipSheet,gr:ghostPileSheet,gh:ghostHoldSheet,bag:bagSheet})[x.dataset.do]?.());
    paint();}
  /* นับถอยหลังในหน้าต่าง (แก้แค่ตัวเลข ไม่วาดใหม่ทั้งหน้า ปุ่มจึงกดได้ตลอด) */
  setInterval(()=>{if(!sheet.classList.contains('on'))return;const t=now();sheet.querySelectorAll('.dm-cd[data-u]').forEach(e=>{const s=hms(Number(e.dataset.u)-t);if(e.textContent!==s)e.textContent=s;});},1000);
  /* ---------- วิดเจ็ตชิดขอบขวา ---------- */
  let vig=null,prevBag=null;
  function paint(){if(stopped)return;const t=now(),v=view||{},b=bag(),parts=[];
    prevBag=b;
    const farm=(screen?.()||'farm')==='farm',pill=(w,img,txt,extra='')=>'<div class="dm-p '+w+extra+'" data-w="'+w+'" role="button" tabindex="0"><img src="'+img+'" alt="">'+txt+'</div>';
    /* fix23: ปุ่มเดียว 😈 + ตัวเลขของที่ค้าง (หัวใจ/หีบโลง/นาฬิกาทราย/ผีสิง) · เนื้อหาเปลี่ยนเฉพาะตอนจำนวนเปลี่ยน → กดได้ทุกครั้ง */
    {const n=(v.ht?.length||0)+(v.cf?.length||0)+(v.hg?.length||0)+(v.gh?.length||0)+(v.gr?.length||0),mine=Object.values(b).reduce((a,x)=>a+x,0);
     const hot=(v.ht||[]).some(h=>h.seen&&h.seen+HEART_TIME-t<5*60000)||(v.cf||[]).length>0||(v.gh||[]).some(h=>h.until-t<3600e3);
     if(n||mine||unseen)parts.push('<div class="dm-p dm-one'+(hot?' hot':'')+(n?' has':'')+'" data-w="center" role="button" tabindex="0"><img src="'+IT.heart.img+'" alt="">😈'+(n?'<b class="dm-badge">'+(n>99?'99+':n)+'</b>':(unseen?'<b class="dm-badge dot">•</b>':''))+'</div>');}
    const html=parts.join('');if(col._h!==html){col._h=html;col.innerHTML=html;
      col.querySelectorAll('[data-w]').forEach(x=>x.onclick=e=>{e.stopPropagation();const w=x.dataset.w;({center:centerSheet,ht:()=>{if(!sheet.classList.contains('on'))heartIntro();},sum:centerSheet,pass:passSheet,gh:ghostHoldSheet,gr:ghostPileSheet,cf:sealSheet,hg:flipSheet,flip:flipSheet,bag:bagSheet,today:todaySheet})[w]?.();});}
    if(vig){vig.remove();vig=null;}/* fix23: ไม่มีจอแดงกะพริบแล้ว */
    window.__DEMON={view:v,now:t,openSeal:sealSheet,openFlip:flipSheet,openGhost:ghostHoldSheet,openSummary:centerSheet,openCenter:centerSheet,openPile:ghostPileSheet};
    const gk=JSON.stringify([(v.hg||[]).map(x=>x.id),(v.cf||[]).map(x=>x.id)]);if(gk!==paint._gk){paint._gk=gk;try{window.__demonHook?.();}catch(e){window.__demonHook=null;}}}
  /* ---------- หักอัตโนมัติ: ส่ง settle เมื่อถึงกำหนด (รวมเป็นครั้งเดียว) ---------- */
  let lastSettle=0,lastSync=0;
  function due(){const v=view;if(!v)return Infinity;const t=now();let d=Infinity;
    if(v.mu>0)d=t;for(const h of v.ht||[])d=Math.min(d,h.seen?h.seen+HEART_TIME:t);
    for(const c of v.cf||[])d=Math.min(d,c.until);for(const g of [...(v.gh||[]),...(v.gr||[])])d=Math.min(d,Number(g.until)||Infinity);
    for(const g of v.hg||[]){const paid=Number(g.paid)||0;if(paid<HG_TICKS)d=Math.min(d,g.at+(paid+1)*HG_EVERY+(HG_TICKS-paid>1?0:0));}
    return d;}
  function needSync(){const b=bag(),t=now();for(const k of Object.keys(IT)){const sum=lotsOf(k).reduce((a,x)=>a+x.n,0);if(sum!==b[k])return true;}return lots().some(x=>x.n>0&&x.at+EXPIRE<=t);}
  async function tick(){if(stopped)return;paint();const t=now();
    if(!busy&&!lock){const d=due(),urgent=(view?.mu>0)||(view?.ht||[]).some(h=>!h.seen||h.seen+HEART_TIME<=t)||(view?.cf||[]).some(c=>c.until<=t);
      if(d<=t&&t-lastSettle>(urgent?8000:45000)){lastSettle=t;await run({type:'settle'},true);}
      else if(needSync()&&t-lastSync>60000){lastSync=t;await run({type:'sync'},true);}}
    dlCheck();}
  const timer=setInterval(tick,1000);
  const stop=watch('demon',v=>{view=v;logs();paint();});
  paint();
  return ()=>{stopped=true;clearInterval(timer);stop?.();col.remove();tst.remove();shade.remove();sheet.remove();vig?.remove();delete window.__DEMON;};
}
