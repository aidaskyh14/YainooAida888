/* fix17 📦 กล่องสุ่มมหากุศล — หน้าห้องใต้ดิน (scr-house) · ทุกผลมาจากคลาวด์ (mahakusalActionCloud) หน้าเว็บไม่รู้รหัส/โอกาส/การันตี
   window.mkOpenMenu() เมนูเปิดกล่อง (ปุ่มทายรหัสเด่นกว่าเปิดด่วนมาก) · window.mkOpenCraft() คราฟจากกล่องสุ่ม 8 ชนิด อย่างละ 3 */
{/* บล็อกเดียว: ชื่อตัวแปรไม่ชนกับสคริปต์ของหน้า */
let API=null;/* เปิดจากกระเป๋า (เปลือกเกม) ส่ง cloud/onClose มาเอง · เปิดในห้องใต้ดินใช้ Host ของหน้า */
const H={cloud:(sys,input)=>API?.cloud?API.cloud(sys,input):parent.__HOST.cloud(sys,input)};
const IMG={mk:'images/mahakusal-box.webp',sheet:'images/mahakusal-open.webp'};
const TIER={s:['🥉','มหากุศลขนาดเล็ก'],m:['🥈','มหากุศลขนาดกลาง'],l:['🥇','มหากุศลขนาดใหญ่']};
const PAYP=[100,80,60],FAST_Q=[500,1000,1500,2000],FAST_MIN=500;
const BOXES=[['dog','หมา','dog-box-dog.webp'],['cat','แมว','cat-box-cat.webp'],['hamster','แฮมสเตอร์','hamster-box-hamster.webp'],['alpaca','อัลปาก้า','boxes-box-alpaca.webp'],['ostrich','นกกระจอกเทศ','boxes-box-ostrich.webp'],['dodo','โดโด้','boxes-box-dodo.webp'],['plant','พืช','boxes-box-clover.webp'],['fruit','ผลไม้','boxes-box-berry.webp']];
const boxImg=(id,file)=>'images/'+file;
const fmt=n=>Math.round(Number(n)||0).toLocaleString('en-US');
const css=document.createElement('style');css.textContent=`
.mk-shade{position:fixed;inset:0;z-index:60;background:rgba(30,15,5,.5);opacity:0;pointer-events:none;transition:.2s}.mk-shade.on{opacity:1;pointer-events:auto}
.mk-sheet{position:fixed;z-index:61;left:50%;bottom:0;width:min(27rem,100vw);transform:translate(-50%,105%);transition:transform .22s ease-out;background:#FFFBF5;color:#6E4B3A;border:3px solid #fff;border-bottom:0;border-radius:1.6rem 1.6rem 0 0;padding:.85rem max(16px,env(safe-area-inset-right,0px)) calc(env(safe-area-inset-bottom,0px) + 1rem) max(16px,env(safe-area-inset-left,0px));max-height:88vh;overflow:auto;box-sizing:border-box;font-family:'Mali',sans-serif}
.mk-sheet *{box-sizing:border-box}.mk-sheet.on{transform:translate(-50%,0)}
.mk-sheet h3{margin:0 0 .15rem;font-size:1rem;text-align:center}
.mk-hint{font-size:.66rem;color:#9A7A68;text-align:center;margin-bottom:.5rem}
.mk-head{display:flex;align-items:center;gap:.6rem;justify-content:center;margin-bottom:.4rem}.mk-head img{width:4.2rem;filter:drop-shadow(0 0 10px rgba(255,200,60,.8))}.mk-head b{font-size:1.3rem;color:#B9761F;font-variant-numeric:tabular-nums}
.mk-mode{display:grid;grid-template-columns:2.6rem 1fr;align-items:center;gap:.55rem;width:100%;border:2px solid #F3E9DE;background:#fff;border-radius:1rem;padding:.5rem .65rem;margin-bottom:.4rem;text-align:left;font:inherit;color:inherit}
.mk-mode .e{font-size:1.8rem;text-align:center}.mk-mode b{font-size:.88rem;display:block}.mk-mode small{font-size:.64rem;color:#9A7A68;font-weight:600;display:block}
.mk-mode.fast{border-color:#FFE08A;background:linear-gradient(100deg,#fff 40%,#FFF7DA)}
#mkPlay{position:relative;overflow:hidden;cursor:pointer;border:3px solid #fff;background:linear-gradient(135deg,#FFE58A,#F2A23A 55%,#E08A1E);box-shadow:0 0 0 2px #F2B33D,0 0 22px rgba(255,190,50,.85),0 6px 0 #B9761F;padding:.75rem .8rem;margin-bottom:.6rem;animation:mkpl 2s ease-in-out infinite}
#mkPlay .e{font-size:2.3rem}#mkPlay b{font-size:1.05rem;color:#fff;text-shadow:0 2px 0 rgba(140,70,0,.45)}#mkPlay small{color:#FFF6DA;font-weight:700}
#mkPlay::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.65) 50%,transparent 65%);background-size:250% 100%;animation:mkshine 2.2s linear infinite;pointer-events:none}
#mkPlay .tag{position:absolute;right:.5rem;top:.4rem;background:#fff;color:#C0601A;font-size:.6rem;font-weight:800;border-radius:999px;padding:.05rem .45rem}
#mkPlay:disabled{animation:none;filter:grayscale(.7);opacity:.6}
@keyframes mkpl{50%{box-shadow:0 0 0 2px #F2B33D,0 0 34px rgba(255,200,60,1),0 6px 0 #B9761F}}@keyframes mkshine{from{background-position:150% 0}to{background-position:-100% 0}}
.mk-qty{display:flex;gap:.3rem;margin-top:.4rem;flex-wrap:wrap}
.mk-qty button{flex:1;min-width:3.4rem;border:2px solid #F3E9DE;background:#fff;border-radius:999px;padding:.32rem .2rem;font:800 .74rem 'Mali',sans-serif;color:#6E4B3A;cursor:pointer}
.mk-qty button.on{background:#FFE7A8;border-color:#F2C35A}.mk-qty button:disabled{opacity:.4}
.mk-tog{display:flex;align-items:center;gap:.45rem;margin-top:.45rem;font-size:.72rem;font-weight:700;cursor:pointer}
.mk-tog i{width:2.2rem;height:1.25rem;border-radius:999px;background:#E6DCD0;position:relative;transition:.2s;flex:none}
.mk-tog i::after{content:"";position:absolute;left:.15rem;top:.15rem;width:.95rem;height:.95rem;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:.2s}
.mk-tog.on i{background:#F2B33D}.mk-tog.on i::after{left:1.1rem}
.mk-row{display:flex;gap:.4rem;justify-content:center;margin-top:.55rem;flex-wrap:wrap}
.mk-big{border:3px solid #fff;border-radius:999px;font:800 .84rem 'Mali',sans-serif;padding:.55rem 1rem;cursor:pointer;background:#6CC9A8;color:#fff;box-shadow:0 4px 0 #4DAA8A,0 8px 16px rgba(0,0,0,.25);white-space:nowrap}
.mk-big.gold{background:linear-gradient(180deg,#FFD36B,#F2A23A);box-shadow:0 4px 0 #C07A1E,0 0 16px rgba(255,200,60,.55)}.mk-big.blue{background:#5FB8E8;box-shadow:0 4px 0 #2E6FA6}
.mk-big.ghost{background:rgba(255,255,255,.14);box-shadow:none;border-color:rgba(255,255,255,.6)}.mk-big:disabled{background:#cfd8d6;box-shadow:none}
.mk-fine{font-size:.62rem;color:#9A7A68;text-align:center;margin-top:.35rem}
.mk-recipe{display:grid;grid-template-columns:repeat(4,1fr);gap:.3rem;margin:.4rem 0}
.mk-rc{background:#fff;border:2px solid #F3E9DE;border-radius:.8rem;padding:.25rem .15rem;display:flex;flex-direction:column;align-items:center;font-size:.6rem;font-weight:700;font-variant-numeric:tabular-nums}
.mk-rc img{width:2.3rem;height:2.3rem;object-fit:contain}.mk-rc.ok{border-color:#9EDDB6}.mk-rc.no{border-color:#FFC7D3;background:#FFF4F6}.mk-rc.min{box-shadow:0 0 0 2px #F2B33D}
.mk-arrow{display:flex;align-items:center;justify-content:center;gap:.5rem;margin:.2rem 0;font-weight:800;font-size:.82rem}.mk-arrow img{width:3rem;filter:drop-shadow(0 0 8px rgba(255,200,60,.8))}
.mk-pop{position:fixed;inset:0;z-index:70;display:none;flex-direction:column;align-items:center;background:radial-gradient(circle at 50% 38%,rgba(120,80,20,.94),rgba(40,20,6,.97) 70%);padding:1rem max(16px,env(safe-area-inset-right,0px)) 1rem max(16px,env(safe-area-inset-left,0px));overflow-y:auto;font-family:'Mali',sans-serif;box-sizing:border-box}
.mk-pop.on{display:flex}.mk-pop *{box-sizing:border-box}
.mk-body{margin:auto 0;display:flex;flex-direction:column;align-items:center;width:100%;max-width:24rem;text-align:center;color:#FFF3D6;position:relative;z-index:1}
.mk-rays{position:fixed;left:50%;top:38%;width:min(34rem,140vw);aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,226,140,.32) 0 8deg,rgba(255,226,140,0) 8deg 22deg);-webkit-mask:radial-gradient(circle,#000 15%,transparent 66%);mask:radial-gradient(circle,#000 15%,transparent 66%);animation:mkray 16s linear infinite;pointer-events:none;opacity:.5;transition:opacity .5s}
.mk-rays.hot{opacity:1}@keyframes mkray{to{transform:translate(-50%,-50%) rotate(360deg)}}
.mk-sp{position:relative;width:min(15rem,64vw);aspect-ratio:1;background:url(${IMG.sheet}) 0 0/400% 400% no-repeat;cursor:pointer}
.mk-sp.idle{animation:mkspb 2s ease-in-out infinite}@keyframes mkspb{50%{transform:translateY(-4px)}}
.mk-tier{display:flex;flex-direction:column;align-items:center;gap:.1rem;margin-top:-.4rem;animation:mktin .6s cubic-bezier(.2,1.5,.4,1)}
@keyframes mktin{from{opacity:0;transform:scale(.6) translateY(20px)}}
.mk-medal{font-family:'Kanit','Mali',sans-serif;font-style:italic;font-weight:900;font-size:1.25rem;padding:.15rem 1rem;border-radius:999px;color:#fff;border:2px solid #fff;text-shadow:0 2px 0 rgba(0,0,0,.25)}
.mk-medal.s{background:linear-gradient(180deg,#E3A774,#9B5A2E);box-shadow:0 0 18px rgba(230,160,100,.7)}.mk-medal.m{background:linear-gradient(180deg,#F1F4F8,#9DA9B8);color:#3b4a5c;text-shadow:none;box-shadow:0 0 18px rgba(220,230,255,.8)}.mk-medal.l{background:linear-gradient(180deg,#FFE58A,#E09A1E);box-shadow:0 0 26px rgba(255,210,80,.95)}
.mk-prize{font-size:.78rem;color:#FFE7A8}.mk-prize b{font-size:1.6rem;display:block;color:#fff;text-shadow:0 0 14px rgba(255,210,90,.9);font-variant-numeric:tabular-nums}
.mk-code{display:flex;gap:.45rem;justify-content:center;margin:.6rem 0 .3rem}
.mk-slot{width:3.1rem;height:3.6rem;border-radius:.8rem;background:rgba(255,255,255,.1);border:2px solid rgba(255,226,140,.6);display:grid;place-items:center;font-size:1.8rem;font-weight:800;color:#fff;box-shadow:inset 0 0 12px rgba(255,210,90,.25);font-variant-numeric:tabular-nums}
.mk-slot.cur{border-color:#fff;box-shadow:0 0 14px rgba(255,220,120,.9),inset 0 0 12px rgba(255,210,90,.4)}.mk-slot.ok{background:rgba(80,200,120,.35);border-color:#9EF0B8}
.mk-code.shake{animation:mkcs .45s}@keyframes mkcs{20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
.mk-tries{font-size:.74rem;margin-bottom:.2rem;letter-spacing:.15em}
.mk-hc{display:flex;align-items:center;gap:.45rem;width:100%;background:linear-gradient(100deg,rgba(255,240,190,.18),rgba(255,255,255,.06));border:1.5px solid rgba(255,226,140,.7);border-radius:.9rem;padding:.3rem .6rem;font-size:.74rem;font-weight:700;margin:.2rem 0;animation:mktin .5s cubic-bezier(.2,1.5,.4,1)}
.mk-hc .e{font-size:1.2rem}.mk-hc b{font-size:.95rem;letter-spacing:.15em;color:#fff}.mk-hc.bonus{border-color:#9EF0B8}
.mk-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:.35rem;width:min(15rem,78vw);margin:.35rem auto 0}
.mk-code.wait .mk-slot{animation:mkwait .5s ease-in-out infinite alternate}@keyframes mkwait{to{box-shadow:0 0 14px rgba(255,220,120,.9);transform:translateY(-2px)}}
.mk-pad button{touch-action:manipulation;-webkit-user-select:none;user-select:none;border:2px solid rgba(255,226,140,.55);background:rgba(255,255,255,.08);color:#fff;border-radius:.8rem;padding:.45rem 0;font:800 1.05rem 'Mali',sans-serif;cursor:pointer}
.mk-pad button.go{background:linear-gradient(180deg,#FFD36B,#E8962A);border-color:#fff;color:#5a3100;font-size:.88rem}.mk-pad button:active{transform:scale(.95)}.mk-pad button:disabled{opacity:.5}
.mk-win{font-family:'Kanit','Mali',sans-serif;font-style:italic;font-weight:900;font-size:1.6rem;color:#fff;text-shadow:0 0 18px rgba(255,210,80,.95),0 3px 0 #8a5a10;animation:mktin .6s cubic-bezier(.2,1.5,.4,1)}
.mk-sumg{display:grid;grid-template-columns:repeat(3,1fr);gap:.35rem;width:100%;margin:.5rem 0}
.mk-sumg div{background:rgba(255,255,255,.08);border:1.5px solid rgba(255,226,140,.5);border-radius:.8rem;padding:.35rem .2rem;font-size:.66rem;font-weight:700}.mk-sumg b{display:block;font-size:1rem;color:#fff;font-variant-numeric:tabular-nums}
.mk-total{font-size:.8rem;color:#FFE7A8;margin-top:.2rem}.mk-total b{display:block;font-size:1.9rem;color:#fff;text-shadow:0 0 16px rgba(255,210,90,.9);font-variant-numeric:tabular-nums}
.mk-fine2{font-size:.66rem;color:#FFE7A8;margin-top:.3rem}
.mk-ring{position:relative;width:min(16rem,70vw);aspect-ratio:1}
.mk-ring img.bx{position:absolute;width:22%;left:39%;top:39%;filter:drop-shadow(0 0 8px rgba(255,220,120,.9))}
.mk-ring .core{position:absolute;left:50%;top:50%;width:30%;aspect-ratio:1;transform:translate(-50%,-50%) scale(.2);border-radius:50%;background:radial-gradient(circle,#fff,#FFE08A 40%,rgba(255,190,60,0) 70%);opacity:0;transition:transform .5s,opacity .5s}
.mk-ring.hot .core{opacity:1;transform:translate(-50%,-50%) scale(1.6)}
.mk-ring .lotus{position:absolute;left:50%;top:50%;font-size:3.4rem;transform:translate(-50%,-50%) scale(0);transition:transform .5s cubic-bezier(.2,1.6,.4,1);filter:drop-shadow(0 0 16px #FFE08A)}.mk-ring.bloom .lotus{transform:translate(-50%,-50%) scale(1.4)}
.mk-outs{display:flex;gap:.3rem;justify-content:center;min-height:4.4rem;margin-top:.2rem}.mk-outs img{width:4rem;filter:drop-shadow(0 0 10px rgba(255,210,80,.9));animation:mkoin .45s cubic-bezier(.2,1.6,.4,1) both}
@keyframes mkoin{from{opacity:0;transform:translateY(-40px) scale(.3)}}
.mk-petal{position:fixed;z-index:75;width:.7rem;height:1rem;border-radius:60% 60% 60% 60%/80% 80% 40% 40%;background:linear-gradient(180deg,#fff,#FFD6E2);pointer-events:none}.mk-coin{position:fixed;z-index:75;font-size:1.2rem;pointer-events:none}
.mk-pop button:focus-visible,.mk-sheet button:focus-visible{outline:3px solid #fff;outline-offset:2px}
@media (prefers-reduced-motion:reduce){.mk-rays,.mk-sp.idle,#mkPlay{animation:none}}`;document.head.appendChild(css);
const mkEl=(cls,tag='div')=>{const d=document.createElement(tag);d.className=cls;document.body.appendChild(d);return d;};
const shade=mkEl('mk-shade'),sheet=mkEl('mk-sheet'),pop=mkEl('mk-pop');pop.innerHTML='<div class="mk-rays"></div><div class="mk-body"></div>';
const rays=pop.querySelector('.mk-rays'),body=pop.querySelector('.mk-body');
const openSheet=h=>{sheet.innerHTML=h;sheet.classList.add('on');shade.classList.add('on');};
const closeSheet=()=>{sheet.classList.remove('on');shade.classList.remove('on');};shade.onclick=()=>{closeSheet();done();};
const showPop=h=>{pop.classList.add('on');body.innerHTML=h;};
const closePop=()=>{pop.classList.remove('on');rays.classList.remove('hot');refresh();done();};
let changed=false;const done=()=>{if(sheet.classList.contains('on')||pop.classList.contains('on'))return;const a=API;if(a?.onClose){API=null;a.onClose(changed);}changed=false;};
const say=(m,bad)=>{try{if(API?.toast)API.toast(m);else toast(m,bad?1:0);}catch(e){}};
function refresh(){try{S=loadS();}catch(e){}try{draw();}catch(e){}}
let V=null,busy=false;
async function call(input){if(busy)return null;busy=true;try{const out=await H.cloud('mahakusal',input);if(out?.view)V={...V,...out.view,counts:out.counts||V?.counts};if(input.type!=='status'){changed=true;refresh();}return out;}catch(e){say(e.message||'ลองใหม่อีกครั้ง',1);return null;}finally{busy=false;}}
function burst(n){const r=body.getBoundingClientRect(),cx=innerWidth/2,cy=r.top+Math.min(r.height*.3,innerHeight*.35);for(let i=0;i<n;i++){const p=document.createElement(i%3?'div':'span');if(i%3)p.className='mk-petal';else{p.className='mk-coin';p.textContent='🪙';}p.style.left=cx+'px';p.style.top=cy+'px';document.body.appendChild(p);const a=Math.random()*6.28,v=80+Math.random()*160;
  p.animate([{transform:'translate(-50%,-50%) rotate(0)',opacity:1},{transform:'translate('+(Math.cos(a)*v)+'px,'+(Math.sin(a)*v+120)+'px) rotate('+(Math.random()*540)+'deg)',opacity:0}],{duration:1400+Math.random()*600,easing:'cubic-bezier(.2,.6,.4,1)'}).onfinish=()=>p.remove();}}
function playSheet(el,done,speed){let f=0;rays.classList.add('hot');const tm=setInterval(()=>{el.style.backgroundPosition=((f%4)*100/3)+'% '+(Math.floor(f/4)*100/3)+'%';if(f===8)burst(26);if(++f>=16){clearInterval(tm);done&&done();}},speed||85);}
/* ---------- เมนูเปิดกล่อง ---------- */
let fq=500,keepL=false;
async function openMenu(){if(!V){openSheet('<div class="mk-hint">กำลังโหลด…</div>');const o=await call({type:'status'});if(!o){closeSheet();done();return;}}
  const have=V.have||0,left=V.left??0,n=Math.min(have,left),q=[...FAST_Q,'max'];
  if(have&&!left){openSheet('<div class="mk-head"><img src="'+IMG.mk+'" alt=""><div><h3 style="margin:0">กล่องสุ่มมหากุศล</h3><b>'+fmt(have)+'</b> กล่อง</div></div><div class="mk-mode" style="grid-template-columns:2.6rem 1fr"><span class="e">🌙</span><div><b>วันนี้เปิดครบแล้ว</b><small>กลับมาเปิดต่อได้หลังเที่ยงคืน</small></div></div>'+(V.kept?keptBtn():''));bindKept();return;}
  const fqOk=v=>v==='max'?n>=FAST_MIN:n>=v&&have>=FAST_MIN;
  openSheet('<div class="mk-head"><img src="'+IMG.mk+'" alt=""><div><h3 style="margin:0">กล่องสุ่มมหากุศล</h3><b>'+fmt(have)+'</b> กล่อง</div></div>'
   +'<button class="mk-mode" id="mkPlay" '+((n||V.cur)?'':'disabled')+'><span class="tag">⭐ ได้มากกว่า</span><span class="e">🔐</span><div><b>'+(V.cur?'เล่นกล่องที่เปิดค้างไว้':'เปิดลุ้นรหัส')+'</b><small>ทายรหัส 4 หลัก ได้ 3 ครั้ง · ทายถูกได้เต็มก้อน · ทายผิดก็ยังได้มากกว่าเปิดด่วน</small></div></button>'
   +'<div class="mk-mode fast"><span class="e">⚡</span><div><b>เปิดด่วน · ไม่ต้องทาย</b><small>เปิดทีละ 500 กล่องขึ้นไป รับกุศลรวดเดียว</small><div class="mk-qty">'+q.map(v=>'<button data-q="'+v+'" class="'+(v===fq?'on':'')+'" '+(fqOk(v)?'':'disabled')+'>'+(v==='max'?'ทั้งหมด':'×'+fmt(v))+'</button>').join('')+'</div>'
   +'<div class="mk-tog'+(keepL?' on':'')+'" id="mkKeep" role="switch" aria-checked="'+keepL+'" tabindex="0"><i></i>🥇 เก็บกล่องใหญ่ไว้ทายเอง</div></div></div>'
   +'<div class="mk-row"><button class="mk-big blue" id="mkFast" '+(fqOk(fq)?'':'disabled')+'>⚡ เปิดด่วน '+(fq==='max'?'ทั้งหมด':'×'+fmt(fq))+'</button></div>'+(have<FAST_MIN?'<div class="mk-fine">เปิดด่วนได้เมื่อมีตั้งแต่ 500 กล่อง</div>':'')+(V.kept?keptBtn():'')
   +(have?'':'<div class="mk-fine">ได้จากนางเงือกตัวจริง · ท็อป 5 ตกปลา · ตกปลา (หายาก) · คราฟในห้องใต้ดิน</div>'));
  sheet.querySelector('#mkPlay').onclick=()=>{closeSheet();playNext();};
  sheet.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{fq=b.dataset.q==='max'?'max':+b.dataset.q;openMenu();});
  const kp=sheet.querySelector('#mkKeep');kp.onclick=()=>{keepL=!keepL;openMenu();};kp.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();kp.click();}};
  sheet.querySelector('#mkFast').onclick=()=>{closeSheet();fastOpen(fq);};bindKept();}
const keptBtn=()=>'<div class="mk-row"><button class="mk-big gold" id="mkKept">🥇 ทายกล่องใหญ่ที่เก็บไว้ ('+fmt(V.kept)+')</button></div>';
function bindKept(){const b=sheet.querySelector('#mkKept');if(b)b.onclick=()=>{closeSheet();playNext(true);};}
/* ---------- เปิดลุ้นรหัส ---------- */
let cur=[],box=null;
async function playNext(kept){showPop('<div class="mk-sp idle" id="mkSp" role="button" aria-label="แตะกล่องเพื่อเปิด"></div><div class="mk-fine2">👆 แตะกล่องเพื่อเปิด</div>');
  const sp=body.querySelector('#mkSp');sp.onclick=async()=>{sp.onclick=null;sp.classList.remove('idle');sp.nextElementSibling?.remove();/* fix18: เล่นแอนิเมชันระหว่างรอเซิร์ฟเวอร์ (ไม่ต้องรอทีละขั้น) */
    const anim=new Promise(r=>playSheet(sp,r,60));const o=await call({type:'open',...(kept?{kept:true}:{})});if(!o?.box){closePop();return;}await anim;box=o.box;cur=[];showTier();};}
function showTier(){const [md,name]=TIER[box.t]||TIER.s;const el=document.createElement('div');el.className='mk-tier';el.innerHTML='<span class="mk-medal '+box.t+'">'+md+' '+name+'</span><div class="mk-prize">ลุ้นได้สูงสุด<b>'+fmt(box.val)+'</b></div>';body.appendChild(el);
  setTimeout(()=>{const host=document.createElement('div');host.id='mkCg';host.style.width='100%';body.appendChild(host);drawCode();},250);}
const ARW=a=>a===1?'⬆️':a===-1?'⬇️':'✅';
function drawCode(shake){const host=body.querySelector('#mkCg');if(!host)return;const left=3-box.tries;
  host.innerHTML='<div class="mk-tries" aria-label="เหลือ '+left+' ครั้ง">'+'🔵'.repeat(left)+'⚪'.repeat(box.tries)+'</div><div class="mk-code" id="mkCode">'+[0,1,2,3].map(i=>'<div class="mk-slot'+(i===cur.length?' cur':'')+'">'+(cur[i]??'')+'</div>').join('')+'</div>'
   +box.hist.map(h=>'<div class="mk-hc"><b>'+h.g.join('')+'</b><span>'+(h.a||[]).map(ARW).join(' ')+'</span></div>'+(h.b?'<div class="mk-hc bonus"><span class="e">'+(h.b.pos!==undefined?'🔍':'💡')+'</span><span>'+(h.b.pos!==undefined?'โบนัส! หลักที่ '+(h.b.pos+1)+' คือ '+h.b.d:'โบนัส! มีเลข '+h.b.has+' อยู่ในรหัส')+'</span></div>':'')).join('')
   +(box.hist.length?'<div class="mk-fine2">⬆️ ตัวจริงมากกว่า · ⬇️ ตัวจริงน้อยกว่า · ✅ ถูกแล้ว</div>':'')
   +'<div class="mk-pad">'+[1,2,3,4,5,6,7,8,9].map(n=>'<button data-n="'+n+'">'+n+'</button>').join('')+'<button data-n="del" aria-label="ลบ">⌫</button><button data-n="0">0</button><button class="go" data-n="go">ทาย!</button></div>';
  if(shake){const c=host.querySelector('#mkCode');c.classList.add('shake');}
  const slots=()=>host.querySelectorAll('.mk-slot').forEach((el,i)=>{el.textContent=cur[i]??'';el.classList.toggle('cur',i===cur.length);});
  const press=x=>{const v=x.dataset.n;if(x.disabled)return;if(v==='del'){cur.pop();slots();return;}if(v==='go'){if(cur.length<4)return;guess();return;}if(cur.length<4){cur.push(+v);slots();}};
  host.querySelectorAll('[data-n]').forEach(x=>{x.onpointerdown=e=>{e.preventDefault();press(x);};x.onclick=e=>{if(e.detail===0)press(x);};});}
async function guess(){const g=cur.slice();body.querySelectorAll('.mk-pad button').forEach(b=>b.disabled=true);body.querySelector('#mkCode')?.classList.add('wait');const o=await call({type:'guess',code:g});cur=[];
  if(!o){drawCode();return;}if(o.box){box=o.box;drawCode(true);return;}const r=o.result,host=body.querySelector('#mkCg');
  const more=(V.have>0&&V.left>0)||V.kept>0,again=more?'<button class="mk-big ghost" id="mkAgain">🔐 เปิดอีก</button>':'';
  if(r.win){burst(40);host.innerHTML='<div class="mk-code">'+r.code.map(d=>'<div class="mk-slot ok">'+d+'</div>').join('')+'</div><div class="mk-win">🎉 ถูกต้อง! ครั้งที่ '+r.tries+'</div><div class="mk-total">ได้รับ<b>+'+fmt(r.pay)+'</b>'+(r.tries>1?'('+PAYP[r.tries-1]+'% ของยอด)':'เต็มก้อน!')+'</div><div class="mk-row"><button class="mk-big gold" id="mkOk">✨ รับกุศล</button>'+again+'</div>';}
  else host.innerHTML='<div class="mk-code">'+r.code.map(d=>'<div class="mk-slot">'+d+'</div>').join('')+'</div><div class="mk-fine2">รหัสที่ถูกคือ '+r.code.join('')+'</div><div class="mk-total">ไม่ถูกทั้ง 3 ครั้ง ได้ปลอบใจ<b>+'+fmt(r.pay)+'</b></div><div class="mk-row"><button class="mk-big gold" id="mkOk">รับกุศล</button>'+again+'</div>';
  host.querySelector('#mkOk').onclick=closePop;const a=host.querySelector('#mkAgain');if(a)a.onclick=()=>playNext(!(V.have>0&&V.left>0)&&V.kept>0);}
/* ---------- เปิดด่วน ---------- */
async function fastOpen(n){showPop('<div class="mk-sp" id="mkSp"></div><div id="mkRes"></div>');const sp=body.querySelector('#mkSp');
  const o=await call({type:'fast',n,keep:keepL});if(!o?.fast){closePop();return;}const f=o.fast;
  playSheet(sp,()=>{body.querySelector('#mkRes').innerHTML='<div class="mk-sumg"><div>🥉 เล็ก<b>'+fmt(f.cnt.s)+'</b></div><div>🥈 กลาง<b>'+fmt(f.cnt.m)+'</b></div><div>🥇 ใหญ่<b>'+fmt(f.cnt.l)+'</b></div></div>'
    +(f.kept?'<div class="mk-hc"><span class="e">🥇</span><span>เก็บกล่องใหญ่ไว้ทายเอง '+fmt(f.kept)+' กล่อง</span></div>':'')
    +'<div class="mk-total">เปิด '+fmt(f.n)+' กล่อง ได้รับ<b id="mkTot">+0</b></div><div class="mk-row"><button class="mk-big gold" id="mkOk">✨ รับกุศล</button></div>';
    const t0=performance.now(),D=1100,step=t=>{const q=Math.min(1,(t-t0)/D),e=body.querySelector('#mkTot');if(e)e.textContent='+'+fmt(f.total*(1-Math.pow(1-q,3)));if(q<1)requestAnimationFrame(step);};requestAnimationFrame(step);burst(36);
    body.querySelector('#mkOk').onclick=closePop;},55);}
/* ---------- คราฟ ---------- */
let cq=1;
async function openCraft(){if(!V?.counts){openSheet('<div class="mk-hint">กำลังโหลด…</div>');const o=await call({type:'status'});if(!o){closeSheet();done();return;}}
  const C=V.counts||{},mx=Math.min(1000,...BOXES.map(([k])=>Math.floor((C[k]||0)/3))),minK=BOXES.reduce((a,[k])=>(C[k]||0)<(C[a]||0)?k:a,'dog'),q=cq==='max'?mx:cq;
  openSheet('<h3>🧪 คราฟกล่องมหากุศล</h3><div class="mk-hint">ห้องใต้ดิน · ใช้กล่องสุ่ม 8 ชนิด อย่างละ 3 · สำเร็จทุกครั้ง</div><div class="mk-recipe">'+BOXES.map(([k,n,p])=>'<div class="mk-rc '+((C[k]||0)>=3*Math.max(1,q)?'ok':'no')+(k===minK?' min':'')+'"><img src="'+boxImg(k,p)+'" alt="">'+n+'<span>'+fmt(3*Math.max(1,q))+' / '+fmt(C[k]||0)+'</span></div>').join('')+'</div>'
   +'<div class="mk-arrow">⬇️ ได้ <img src="'+IMG.mk+'" alt=""> 1–4 กล่อง ต่อครั้ง</div><div class="mk-qty">'+[1,10,100,'max'].map(v=>'<button data-c="'+v+'" class="'+(v===cq?'on':'')+'" '+((v==='max'?mx>0:mx>=v)?'':'disabled')+'>'+(v==='max'?'สูงสุด '+fmt(mx):'×'+v)+'</button>').join('')+'</div>'
   +'<div class="mk-row"><button class="mk-big gold" id="mkDoC" '+(q>0&&mx>=q?'':'disabled')+'>🧪 คราฟ ×'+fmt(q)+'</button></div><div class="mk-fine">⭐ กรอบทอง = กล่องที่มีน้อยที่สุด กำหนดว่าคราฟได้กี่ครั้ง</div>');
  sheet.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{cq=b.dataset.c==='max'?'max':+b.dataset.c;openCraft();});
  sheet.querySelector('#mkDoC').onclick=()=>{closeSheet();doCraft(q);};}
async function doCraft(q){showPop('<div class="mk-ring" id="mkRing">'+BOXES.map(([k,,p])=>'<img class="bx" src="'+boxImg(k,p)+'" alt="">').join('')+'<div class="core"></div><div class="lotus">🪷</div></div><div class="mk-outs" id="mkOuts"></div><div id="mkCres"></div>');
  const ring=body.querySelector('#mkRing'),imgs=[...ring.querySelectorAll('.bx')],t0=performance.now();const req=call({type:'craft',quantity:q});
  const spin=async t=>{const e=(t-t0)/1000,sp=e<1.2?1+e*2:3.4+(e-1.2)*8,rad=e<1.6?40:Math.max(0,40-(e-1.6)*90);imgs.forEach((im,i)=>{const a=i/8*6.283+e*sp;im.style.transform='translate('+Math.cos(a)*rad+'%,'+Math.sin(a)*rad*.85+'%) scale('+(rad>4?1:.3)+')';im.style.opacity=rad>2?1:0;});
    if(e>1.6)ring.classList.add('hot');if(e<2.1){requestAnimationFrame(spin);return;}
    const o=await req;if(!o?.craft){closePop();return;}const got=o.craft.got;ring.classList.add('bloom');burst(40);rays.classList.add('hot');
    const show=Math.min(4,q===1?got:4);for(let i=0;i<show;i++)setTimeout(()=>{const im=document.createElement('img');im.src=IMG.mk;im.alt='';body.querySelector('#mkOuts')?.appendChild(im);},250+i*220);
    setTimeout(()=>{const c=body.querySelector('#mkCres');if(!c)return;c.innerHTML='<div class="mk-win">'+(q===1?'ได้ '+got+' กล่อง!':'คราฟ ×'+fmt(q)+' ได้ '+fmt(got)+' กล่อง!')+'</div><div class="mk-row"><button class="mk-big gold" id="mkOk">📦 เก็บเข้ากระเป๋า</button></div>';c.querySelector('#mkOk').onclick=()=>{closePop();say('📦 ได้กล่องมหากุศล +'+fmt(got));};},400+show*220);};
  requestAnimationFrame(spin);}
window.mkOpenMenu=api=>{API=api||null;V=null;openMenu();};window.mkOpenCraft=api=>{API=api||null;V=null;openCraft();};

}
