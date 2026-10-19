/* fix16 🍽️ ให้อาหารหรู (ใช้ร่วมกัน: หน้าเม่น scr-house · หน้าแฮมสเตอร์ scr-backyard)
   ป้อนเมนูมีคลาส 3 จาน (ซ้ำ/คละได้) → เซิร์ฟเวอร์สุ่ม 2,000–5,000 กุศล · คูลดาวน์ 15 นาทีแยกต่อหน้า (เก็บในเซฟ) · นับถอยหลังอยู่ในปุ่ม
   LuxFeed.mount({page:'house'|'backyard', state:()=>S, reload:()=>{...}, visible:()=>true, target:()=>Element|null, bottom:'.7rem'}) */
(function(){
const DISH=[['cl-peasoup','ซุปครีมถั่วลันเตาทรัฟเฟิล'],['cl-sashimi','ซาชิมิแตงโมไข่ปลา'],['cl-risotto','ริซอตโต้แพลงก์ตอน'],['cl-rosesalad','สลัดแตงโมกุหลาบชีสนม'],
 ['cl-shumai','ขนมจีบแพลงก์ตอนหมูทรัฟเฟิล'],['cl-peapasta','พาสต้าถั่วลันเตาไข่นกกระจอกเทศ'],['cl-sorbet','ซอร์เบต์แตงโมเชอร์รีลีลาวดี'],['cl-fishsteak','สเต๊กปลาซอสแพลงก์ตอนไข่โดโด้']];
const CD=15*60000,nf=n=>Math.round(n).toLocaleString('en-US');
const css=`.luxbtn{position:fixed;z-index:6;left:50%;transform:translateX(-50%);border:3px solid #fff;border-radius:999px;font:inherit;font-weight:800;font-size:.95rem;padding:.5rem 1.2rem;color:#fff;background:linear-gradient(180deg,#FFB547,#E07B12);box-shadow:0 4px 0 #A5560A,0 0 18px rgba(255,181,71,.55);cursor:pointer;white-space:nowrap;font-variant-numeric:tabular-nums}
.luxbtn:disabled{background:linear-gradient(180deg,#8C7A6A,#5E4E42);box-shadow:0 4px 0 #3E3229;cursor:default}
.lxdim{position:fixed;inset:0;z-index:40;background:rgba(20,10,5,.4);opacity:0;pointer-events:none;transition:opacity .3s}.lxdim.on{opacity:1;pointer-events:auto}
.lxsheet{position:fixed;z-index:41;left:0;right:0;bottom:0;max-width:30rem;margin:0 auto;background:#FFFBF5;color:#6E4B3A;border-radius:1.4rem 1.4rem 0 0;border:3px solid #fff;border-bottom:0;padding:.8rem 16px calc(env(safe-area-inset-bottom,0px) + .9rem);box-shadow:0 -10px 30px rgba(0,0,0,.35);transform:translateY(105%);transition:transform .3s cubic-bezier(.2,1,.3,1)}
.lxsheet.on{transform:none}
.lxsh{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem}.lxsh h2{margin:0;flex:1;font-size:1.05rem;white-space:nowrap}
.lxsh .x{border:0;background:#F3EAE0;border-radius:50%;width:2rem;height:2rem;font-weight:800;color:#6E4B3A}
.lxpill{border-radius:999px;padding:.12rem .55rem;font-size:.68rem;font-weight:800;background:#FFF0C2;color:#9A6A00;white-space:nowrap}
.lxslots{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:.6rem}
.lxslot{aspect-ratio:1;border-radius:1rem;border:2.5px dashed #E8D9C6;background:#fff;display:grid;place-items:center;position:relative}
.lxslot img{width:84%;animation:lxin .35s cubic-bezier(.2,1.6,.4,1)}@keyframes lxin{from{transform:scale(.3)}}
.lxslot.f{border-style:solid;border-color:#FFC94D;background:#FFF9E8}.lxslot span{color:#C9B8A6;font-weight:800;font-size:1.4rem}
.lxslot button{position:absolute;right:-.3rem;top:-.3rem;border:0;width:1.4rem;height:1.4rem;border-radius:50%;background:#E5534B;color:#fff;font-weight:800;font-size:.75rem;line-height:1}
.lxmenu{display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem;max-height:34vh;overflow:auto;padding:.1rem}
.lxdish{border:2px solid #F3E9DE;background:#fff;border-radius:.9rem;padding:.25rem .2rem .3rem;text-align:center;cursor:pointer;font:inherit;color:inherit}
.lxdish img{width:100%;aspect-ratio:1;object-fit:contain;display:block}.lxdish b{display:block;font-size:.58rem;line-height:1.2;min-height:2.4em}.lxdish small{font-size:.62rem;font-weight:800;color:#2F8F6C}.lxdish:disabled{opacity:.4}
.lxempty{grid-column:1/-1;text-align:center;font-size:.8rem;font-weight:700;color:#9A7A68;padding:.8rem 0}
.lxfeed{margin-top:.6rem;width:100%;border:0;border-radius:1.1rem;font:inherit;font-weight:800;font-size:1rem;padding:.7rem;color:#fff;background:linear-gradient(180deg,#FFB547,#E07B12);box-shadow:0 4px 0 #A5560A}
.lxfeed:disabled{background:#E3D9CC;box-shadow:none;color:#A89886}
.lxfly{position:fixed;z-index:50;left:0;top:0;width:4.2rem;pointer-events:none;filter:drop-shadow(0 6px 8px rgba(0,0,0,.35))}
.lxfx{position:fixed;inset:0;z-index:49;pointer-events:none;overflow:hidden}
.lxring{position:absolute;width:10px;height:10px;border-radius:50%;transform:translate(-50%,-50%);border:4px solid #FFE08A;box-shadow:0 0 20px #FFC94D,inset 0 0 14px #FFC94D;animation:lxring .9s ease-out forwards}@keyframes lxring{to{width:22rem;height:22rem;opacity:0;border-width:1px}}
.lxrays{position:absolute;width:26rem;height:26rem;transform:translate(-50%,-50%);background:repeating-conic-gradient(rgba(255,224,138,.55) 0 8deg,transparent 8deg 22deg);border-radius:50%;-webkit-mask:radial-gradient(circle,#000 8%,transparent 62%);mask:radial-gradient(circle,#000 8%,transparent 62%);animation:lxrays 1.8s ease-out forwards}
@keyframes lxrays{0%{opacity:0;transform:translate(-50%,-50%) scale(.3) rotate(0)}20%{opacity:1}to{opacity:0;transform:translate(-50%,-50%) scale(1.1) rotate(70deg)}}
.lxcoin{position:absolute;width:2rem;height:2rem;transform:translate(-50%,-50%);animation:lxcoin 1.3s cubic-bezier(.2,.7,.4,1) forwards}.lxcoin img{width:100%;display:block;animation:lxspin .5s linear infinite}@keyframes lxspin{50%{transform:scaleX(.2)}}
@keyframes lxcoin{0%{transform:translate(-50%,-50%) scale(.3)}45%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1)}100%{transform:translate(calc(-50% + var(--ex)),calc(-50% + var(--ey))) scale(.4);opacity:.2}}
.lxspark{position:absolute;color:#FFF3B0;font-size:1.2rem;transform:translate(-50%,-50%);animation:lxspk 1s ease-out forwards;text-shadow:0 0 8px #FFC94D}@keyframes lxspk{to{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(.2);opacity:0}}
.lxgain{position:absolute;transform:translate(-50%,-50%);text-align:center;animation:lxgain 2.4s ease-out forwards}
.lxgain .n{font-size:3rem;font-weight:800;line-height:1;color:#FFE08A;-webkit-text-stroke:2px #9A5A00;text-shadow:0 4px 0 #9A5A00,0 0 24px rgba(255,201,77,.9);font-variant-numeric:tabular-nums}
.lxgain .l{display:inline-block;white-space:nowrap;margin-top:.3rem;background:rgba(255,251,245,.95);border-radius:999px;padding:.15rem .7rem;font-weight:800;font-size:.85rem;color:#9A6A00}
@keyframes lxgain{0%{transform:translate(-50%,-30%) scale(.3);opacity:0}12%{transform:translate(-50%,-50%) scale(1.25);opacity:1}22%{transform:translate(-50%,-50%) scale(1)}80%{transform:translate(-50%,-60%) scale(1);opacity:1}to{transform:translate(-50%,-90%) scale(.9);opacity:0}}
@media (prefers-reduced-motion:reduce){.lxcoin,.lxspark,.lxrays,.lxring{animation-duration:.01ms}}`;
function mount(o){
 const H=parent.__HOST,st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
 const btn=el('button','luxbtn','🍽️ ให้อาหารหรู');btn.id='luxBtn';btn.style.bottom='calc(env(safe-area-inset-bottom,0px) + '+(o.bottom||'.7rem')+')';
 const dim=el('div','lxdim'),sh=el('section','lxsheet','<div class="lxsh"><h2>🍽️ ให้อาหารหรู</h2><span class="lxpill">ใส่ 3 จาน · 🙏 2,000–5,000</span><button class="x" aria-label="ปิด">✕</button></div><div class="lxslots"></div><div class="lxmenu"></div><button class="lxfeed" disabled>✨ ป้อนเลย!</button>'),fx=el('div','lxfx');
 document.body.append(btn,dim,sh,fx);
 let pick=[],busy=false;
 const now=()=>{try{const t=H&&typeof H.serverNow==='function'?H.serverNow():0;return Number.isFinite(t)&&t>0?t:Date.now();}catch(e){return Date.now();}};
 const lastAt=()=>{const S=o.state();return Number(o.page==='house'?S.hedgeLuxAt:S.ham&&S.ham.luxAt)||0;};
 const have=k=>{const S=o.state(),n=DISH.find(d=>d[0]===k)[1],q=S.bag&&S.bag.food&&S.bag.food[n];return Number.isSafeInteger(q)&&q>0?q:0;};
 const left=k=>have(k)-pick.filter(x=>x===k).length;
 function tick(){const show=!o.visible||o.visible();btn.style.display=show?'':'none';if(!show)return;const l=lastAt()+CD-now();
  btn.disabled=busy||l>0;btn.textContent=busy?'⏳ กำลังป้อน…':l>0?'⏳ ให้อาหารหรูได้อีกใน '+Math.floor(l/60000)+':'+String(Math.floor(l/1000)%60).padStart(2,'0'):'🍽️ ให้อาหารหรู';}
 function close(){sh.classList.remove('on');dim.classList.remove('on');}
 function draw(){sh.querySelector('.lxslots').innerHTML=[0,1,2].map(i=>pick[i]?'<div class="lxslot f"><img src="images/'+pick[i]+'.webp" alt=""><button data-rm="'+i+'" aria-label="เอาออก">✕</button></div>':'<div class="lxslot"><span>'+(i+1)+'</span></div>').join('');
  const list=DISH.filter(([k])=>have(k)>0);
  sh.querySelector('.lxmenu').innerHTML=list.length?list.map(([k,n])=>'<button class="lxdish" data-k="'+k+'"'+(left(k)>0&&pick.length<3?'':' disabled')+'><img src="images/'+k+'.webp" alt=""><b>'+n+'</b><small>×'+left(k)+'</small></button>').join(''):'<div class="lxempty">ยังไม่มีเมนูมีคลาส • ทำได้ที่ 🔥 ครัวในบ้าน แท็บ 🌟 เมนูมีคลาส</div>';
  sh.querySelector('.lxfeed').disabled=pick.length<3;
  sh.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{if(pick.length<3&&left(b.dataset.k)>0){pick.push(b.dataset.k);draw();}});
  sh.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{pick.splice(+b.dataset.rm,1);draw();});}
 btn.onclick=()=>{if(btn.disabled)return;if(o.guard&&o.guard())return;pick=[];draw();sh.classList.add('on');dim.classList.add('on');};
 sh.querySelector('.x').onclick=close;dim.onclick=close;
 sh.querySelector('.lxfeed').onclick=async()=>{if(busy||pick.length<3)return;const chosen=pick.slice(),dishes={};chosen.forEach(k=>{const n=DISH.find(d=>d[0]===k)[1];dishes[n]=(dishes[n]||0)+1;});
  busy=true;tick();close();
  const t=o.target&&o.target(),r=t&&t.getBoundingClientRect?t.getBoundingClientRect():null,tx=r?r.left+r.width/2:innerWidth/2,ty=r?r.top+r.height*.45:innerHeight*.55;
  const fly=Promise.all(chosen.map((k,i)=>new Promise(res=>{const im=el('img','lxfly');im.src='images/'+k+'.webp';im.alt='';document.body.append(im);const sx=innerWidth*(.25+i*.25),sy=innerHeight-90;
   if(!im.animate){im.remove();return res();}
   const a=im.animate([{transform:'translate('+(sx-34)+'px,'+(sy-34)+'px) scale(1)'},{transform:'translate('+((sx+tx)/2-34)+'px,'+(Math.min(sy,ty)-160)+'px) scale(1.15) rotate('+(i-1)*20+'deg)',offset:.5},{transform:'translate('+(tx-34)+'px,'+(ty-34)+'px) scale(.2) rotate('+(i-1)*60+'deg)',opacity:.3}],{duration:900+i*120,easing:'cubic-bezier(.4,0,.3,1)'});
   a.onfinish=()=>{im.remove();res();};})));
  const LS=o.ls,keep=LS?{s:LS.setItem,r:LS.removeItem}:null;if(LS){LS.setItem=function(){};LS.removeItem=function(){};}
  let out=null,err=null;try{out=await H.cloud('craft',{type:'lux',page:o.page,dishes});}catch(e){err=e;}
  if(LS){LS.setItem=keep.s;LS.removeItem=keep.r;}try{o.reload();}catch(e){}
  await fly;busy=false;
  if(err){tick();if(o.toast)o.toast(err.message||'ให้อาหารไม่สำเร็จ ลองใหม่อีกครั้ง',1);return;}
  if(o.joy)try{o.joy();}catch(e){}
  burst(tx,ty,out.merit||0);tick();};
 function burst(x,y,g){const add=(c,h,s)=>{const e=el('div',c,h);Object.assign(e.style,s);fx.append(e);return e;};
  add('lxrays','',{left:x+'px',top:y+'px'});add('lxring','',{left:x+'px',top:y+'px'});setTimeout(()=>add('lxring','',{left:x+'px',top:y+'px'}),180);
  for(let i=0;i<16;i++){const a=Math.random()*Math.PI*2,R=60+Math.random()*90;add('lxspark','✦',{left:x+'px',top:y+'px','--dx':Math.cos(a)*R+'px','--dy':Math.sin(a)*R+'px',animationDelay:Math.random()*.2+'s'});}
  const cx=60,cy=30;
  for(let i=0;i<18;i++){const a=-Math.PI/2+(Math.random()-.5)*2.4,R=70+Math.random()*80;add('lxcoin','<img src="images/lux-coin.webp" alt="">',{left:x+'px',top:y+'px','--dx':Math.cos(a)*R+'px','--dy':Math.sin(a)*R+'px','--ex':(cx-x)+'px','--ey':(cy-y)+'px',animationDelay:(.15+i*.035)+'s'});}
  const gn=add('lxgain','<div class="n">+0</div><span class="l">🙏 กุศลจากเมนูมีคลาส</span>',{left:x+'px',top:(y-90)+'px'}),n=gn.querySelector('.n'),t0=performance.now();
  (function step(t){const k=Math.min(1,(t-t0)/1000);n.textContent='+'+nf(g*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step);})(t0);
  setTimeout(()=>{fx.innerHTML='';},2600);}
 setInterval(tick,400);tick();
 return {tick};
}
window.LuxFeed={mount};
})();
