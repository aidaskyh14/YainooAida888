/* fix15 หน้าสวน: เยี่ยมสวนเพื่อนเห็นผักจริง + ระบบแกล้งเพื่อน (ค้างคาว ป้ายแซว แกล้งแปลง หุ่นไล่กา)
   ใช้ตัวแปรของหน้าสวน (S, farm, visiting, IMG, CN, P1, P2, W, H, box, toast, $, open, closeAll, render, plotEls, tapPlot, friendPlot)
   คำสั่งที่เปลี่ยนข้อมูลส่งผ่านคลาวด์ทั้งหมด (window.cloudFriend / window.cloudFarm จาก farm-cloud.js) */
import {PRANKS,PRANK_MSGS,PRANK_DAY,SIGN_MAX,SCARE_COST,HW_NAMES} from './prank-engine.js?v=ss3-fix17';
const HWI=k=>'images/halloween-hw-'+k+'.webp';
const PIMG=k=>'images/'+PRANKS[k].img+'.webp';
const fmtN=n=>(n<0?'−':'')+Math.abs(Math.round(n)).toLocaleString('en-US');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=document.createElement('style');css.textContent=`
.cplot.fr .pl img.s1{max-width:42%;max-height:42%}.cplot.fr .pl img.s2{max-width:55%;max-height:55%}
.cplot.ready .pl img{animation:pkglow 1.8s ease-in-out infinite}
@keyframes pkglow{50%{filter:drop-shadow(0 0 6px #fff6b0) drop-shadow(0 3px 2px rgba(0,0,0,.28))}}
.pkspark{position:absolute;right:6%;top:-6%;font-size:.95rem;animation:pktw 1.4s ease-in-out infinite;pointer-events:none;z-index:2}
@keyframes pktw{50%{transform:scale(1.35) rotate(15deg);opacity:.6}}
.pkover{position:absolute;inset:-8% 0 6% 0;display:grid;place-items:center;pointer-events:none;z-index:3}
.pkover img{width:80%;max-height:100%;object-fit:contain;filter:drop-shadow(0 4px 4px rgba(40,10,60,.45));animation:pkdrop .5s cubic-bezier(.3,1.6,.5,1)}
.pkover::before{content:"";position:absolute;inset:18% 6% 0;border-radius:50%;background:radial-gradient(closest-side,rgba(142,92,200,.45),transparent);animation:pkpulse 2s ease-in-out infinite}
@keyframes pkpulse{50%{opacity:.4}}@keyframes pkdrop{from{transform:translateY(-60%) scale(.5);opacity:0}}
.pkmagic{position:absolute;inset:0;border-radius:10px;background:radial-gradient(circle,rgba(120,40,160,.55),rgba(60,20,90,.65));box-shadow:0 0 12px rgba(160,80,220,.8) inset;display:grid;place-items:center;font-size:1.3rem;pointer-events:none;z-index:2}
.pkbat{position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none}
.pkbatfly{position:absolute;top:14%;left:50%;width:30%;transform:translateX(-50%);z-index:4;animation:pkhover 3s ease-in-out infinite;pointer-events:none}
@keyframes pkhover{50%{transform:translate(-50%,6%)}}
#stage.pkshake{animation:pkshake .35s}
@keyframes pkshake{20%{transform:translate(calc(-50% - 3px),calc(-50% + 2px))}40%{transform:translate(calc(-50% + 3px),calc(-50% - 2px))}60%{transform:translate(calc(-50% - 2px),calc(-50% - 1px))}80%{transform:translate(calc(-50% + 2px),calc(-50% + 1px))}}
.pksign{position:absolute;width:7.5%;z-index:2;cursor:pointer;transform-origin:50% 100%;transform:translate(-50%,-100%) rotate(var(--r,0deg))}
.pksign img{width:100%;display:block;filter:brightness(.9) saturate(.85) sepia(.12) drop-shadow(0 2px 1px rgba(40,25,10,.35))}
.pksign::before{content:"";position:absolute;left:8%;right:8%;bottom:-6%;height:16%;border-radius:50%;background:radial-gradient(closest-side,rgba(40,30,10,.45),transparent)}
.pkscare{position:absolute;left:2%;top:39%;width:20%;z-index:3;pointer-events:none;filter:drop-shadow(0 6px 6px rgba(0,0,0,.3))}
.pkshield{position:absolute;left:4%;top:37%;z-index:3;background:rgba(255,251,245,.94);border-radius:999px;padding:.1rem .5rem;font-size:.66rem;font-weight:700;border:2px solid #fff;white-space:nowrap}
.pkdock{position:fixed;z-index:5;left:.55rem;bottom:calc(env(safe-area-inset-bottom,0px) + 4.2rem);display:flex;flex-direction:column;gap:.4rem}
.pkdock button{display:flex;align-items:center;gap:.25rem;border:3px solid #fff;border-radius:999px;background:linear-gradient(180deg,#9A6BD8,#6B3FA0);color:#fff;font:inherit;font-family:'Mali',sans-serif;font-weight:700;font-size:.7rem;padding:.2rem .6rem .2rem .25rem;box-shadow:0 4px 10px rgba(60,20,90,.35);cursor:pointer}
.pkdock button img{width:1.7rem;height:1.7rem;object-fit:contain}
.pkdock button.gold{background:linear-gradient(180deg,#FFD86B,#F2B33D);color:#5a3a10}
.pkalert{position:fixed;z-index:6;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 4.1rem);background:rgba(255,251,245,.96);border:3px solid #fff;border-radius:999px;padding:.2rem .8rem;font-size:.72rem;font-weight:700;color:#6B3FA0;box-shadow:0 6px 16px rgba(60,20,90,.25);white-space:nowrap;cursor:pointer}
#pkSheet .ph{display:flex;align-items:center;gap:.6rem;margin-bottom:.45rem}
#pkSheet .ph img{width:3rem;height:3rem;object-fit:contain;flex:none}
#pkSheet .ph b{display:block;font-size:1rem}#pkSheet .ph small{display:block;font-size:.74rem;color:var(--soft,#9A7A68)}
#pkSheet .row2{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-bottom:.5rem}
#pkSheet .lbl{font-size:.74rem;color:#8A6AA8;font-weight:700;margin:.35rem 0 .3rem}
#pkSheet .pgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.4rem}
/* fix17 😈 ไอเทมปีศาจในฉากสวน */
.dmobj{position:absolute;transform:translate(-50%,-50%);pointer-events:none;z-index:4}
.dmhg{width:17%}.dmhg img{position:relative;z-index:2;width:100%;display:block;filter:drop-shadow(0 0 .8em rgba(255,40,80,.95)) drop-shadow(0 8px 6px rgba(0,0,0,.4));animation:dmsway 3s ease-in-out infinite}
@keyframes dmsway{50%{transform:rotate(2deg) translateY(-2%)}}
.dmhg .rune{position:absolute;left:50%;top:92%;width:190%;aspect-ratio:3/1;transform:translate(-50%,-50%);border-radius:50%;z-index:1;background:repeating-conic-gradient(from 0deg,rgba(255,60,90,0) 0 8deg,rgba(255,60,90,.75) 8deg 10deg),radial-gradient(ellipse,rgba(255,40,80,.55),transparent 70%);-webkit-mask:radial-gradient(ellipse,transparent 30%,#000 32%,#000 48%,transparent 50%);mask:radial-gradient(ellipse,transparent 30%,#000 32%,#000 48%,transparent 50%);animation:dmrs 6s linear infinite}
@keyframes dmrs{to{transform:translate(-50%,-50%) rotate(360deg)}}
.dmhg .aura{position:absolute;left:50%;top:50%;width:170%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,60,100,.55),rgba(180,0,40,.25) 40%,transparent 68%);z-index:0;animation:dmap 2.2s ease-in-out infinite;mix-blend-mode:screen}
@keyframes dmap{50%{transform:translate(-50%,-50%) scale(1.15);opacity:.6}}
.dmhg .neck{position:absolute;left:50%;top:44%;width:4%;height:16%;transform:translateX(-50%);z-index:3;background:linear-gradient(180deg,#fff,#ff3b5c 40%,rgba(255,60,90,0));border-radius:2px;box-shadow:0 0 .5em #ff3b5c;animation:dmneck .35s linear infinite}
@keyframes dmneck{50%{opacity:.55;height:13%}}
.dmtag{position:absolute;left:50%;top:104%;transform:translateX(-50%);white-space:nowrap;background:rgba(28,10,18,.9);color:#FFD5DC;border:2px solid #ff6b82;border-radius:999px;padding:.05rem .5rem;font-size:.6rem;font-weight:800;box-shadow:0 0 10px rgba(216,30,60,.6);font-variant-numeric:tabular-nums;z-index:3;font-family:'Mali',sans-serif}
.dmcf{width:26%;pointer-events:auto;cursor:pointer;z-index:5}.dmcf img{width:100%;display:block;filter:drop-shadow(0 0 1em rgba(255,50,90,.9)) drop-shadow(0 10px 8px rgba(0,0,0,.4));animation:dmcsh 2.4s ease-in-out infinite}
.dmcf.drop img{animation:dmcdrop .55s cubic-bezier(.55,0,1,.45)}
@keyframes dmcsh{0%,80%,100%{transform:rotate(0)}84%{transform:rotate(-2deg)}88%{transform:rotate(2deg)}92%{transform:rotate(-1deg)}}
@keyframes dmcdrop{from{transform:translateY(-260%) rotate(-12deg);opacity:.2}}
.dmlock{position:absolute;left:8%;right:8%;top:38%;height:30%;border-radius:4%;background:rgba(30,0,10,.32);box-shadow:inset 0 0 0 3px rgba(255,80,110,.55),0 0 24px rgba(216,30,60,.55);pointer-events:none;z-index:3;animation:dmlk 2s ease-in-out infinite}
@keyframes dmlk{50%{box-shadow:inset 0 0 0 3px rgba(255,80,110,.85),0 0 34px rgba(216,30,60,.75)}}
.pkdock button.dv{background:linear-gradient(180deg,#ff5a72,#b30f2b);box-shadow:0 4px 10px rgba(120,0,20,.45),0 0 12px rgba(216,30,60,.55)}
#pkSheet .dmit{display:grid;grid-template-columns:3rem 1fr auto;align-items:center;gap:.5rem;width:100%;border:2px solid #F3E9DE;background:#fff;border-radius:1rem;padding:.4rem .55rem;margin-bottom:.32rem;cursor:pointer;text-align:left;font:inherit;color:inherit}
#pkSheet .dmit img{width:3rem;height:3rem;object-fit:contain;filter:drop-shadow(0 0 5px rgba(216,30,60,.45))}
#pkSheet .dmit b{display:block;font-size:.82rem}#pkSheet .dmit small{display:block;font-size:.64rem;color:#9A7A68;font-weight:600}
#pkSheet .dmit .r{font-size:.7rem;font-weight:800;color:#D81E3C}#pkSheet .dmit:disabled{opacity:.45;cursor:default}
#pkSheet .dmexp{display:inline-block;background:#FFF0F3;color:#D81E3C;border-radius:999px;padding:0 .4em;font-size:.6rem;font-weight:800}#pkSheet .dmexp.warn{background:#D81E3C;color:#fff}
.dmfly{position:fixed;z-index:60;width:4rem;pointer-events:none;filter:drop-shadow(0 0 10px rgba(255,60,90,.9));transition:transform .9s cubic-bezier(.5,-.3,.5,1),opacity .9s}
.dmboom{position:fixed;z-index:60;width:10rem;height:10rem;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,#fff,rgba(255,80,110,.85) 30%,rgba(120,0,20,.4) 60%,transparent 72%);animation:dmbm .6s ease-out forwards;pointer-events:none}
@keyframes dmbm{from{transform:translate(-50%,-50%) scale(.2)}to{transform:translate(-50%,-50%) scale(1.6);opacity:0}}
@media (prefers-reduced-motion:reduce){.dmhg img,.dmhg .rune,.dmhg .aura,.dmcf img,.dmlock{animation:none}}

#pkSheet .pcard{border:2px solid #F1E3D3;background:#fff;border-radius:14px;padding:.35rem .4rem;display:flex;gap:.4rem;align-items:center;cursor:pointer;text-align:left;font:inherit;color:var(--cocoa,#6E4B3A)}
#pkSheet .pcard img{width:2.5rem;height:2.5rem;object-fit:contain;flex:none}
#pkSheet .pcard b{display:block;font-size:.76rem}#pkSheet .pcard small{display:block;font-size:.62rem;color:#9A7A68;line-height:1.3}
#pkSheet .pcard .cost{display:flex;align-items:center;gap:.15rem;font-size:.66rem;font-weight:800;color:#6B3FA0}
#pkSheet .cost{display:inline-flex;align-items:center;gap:.15rem;font-weight:800;color:#6B3FA0}#pkSheet .cost img{width:1rem;height:1rem;object-fit:contain}
#pkSheet .pcard:disabled{opacity:.45;cursor:not-allowed}
#pkSheet .msgs{display:grid;gap:.35rem;margin-top:.3rem}
#pkSheet .msgs button{text-align:left;border:2px solid #F1E3D3;background:#fff;border-radius:14px;padding:.4rem .7rem;font:inherit;font-size:.8rem;cursor:pointer;color:var(--cocoa,#6E4B3A)}
#pkSheet .msgs button:disabled{opacity:.45}
#pkSheet .pay{display:flex;align-items:center;gap:.6rem;width:100%;border:2px solid #F1E3D3;background:#fff;border-radius:16px;padding:.55rem .7rem;font:inherit;color:var(--cocoa,#6E4B3A);cursor:pointer;text-align:left;margin-bottom:.4rem}
#pkSheet .pay .ico{font-size:1.6rem;width:2.4rem;text-align:center}#pkSheet .pay img{width:2.4rem;height:2.4rem;object-fit:contain}
#pkSheet .pay b{display:block;font-size:.92rem}#pkSheet .pay small{font-size:.7rem;color:#9A7A68}
#pkSheet .pay.m:not(:disabled){border-color:#F6C77A}#pkSheet .pay.b:not(:disabled){border-color:#C7A4EE}#pkSheet .pay:disabled{opacity:.45;cursor:not-allowed}
#pkSheet .note{font-size:.7rem;color:#9A7A68;text-align:center;margin-top:.3rem}
.pknote{position:fixed;inset:0;z-index:20;background:rgba(30,15,25,.55);display:grid;place-items:center;padding:6%}
.pknote .paper{background:#FFF4DC;border:4px solid #fff;border-radius:22px;padding:1rem;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.35);animation:pkpop .35s cubic-bezier(.3,1.6,.5,1);width:min(24rem,100%);font-family:'Mali',sans-serif;color:#6E4B3A}
@keyframes pkpop{from{transform:scale(.6);opacity:0}}
.pknote .paper>img{width:22%}
.pknote .sum{font-size:.82rem;background:#F4EAFF;border-radius:12px;padding:.45rem .5rem;margin:.4rem 0 .5rem;color:#6B3FA0;font-weight:700}
.pknote .list{display:grid;gap:.35rem;max-height:40vh;overflow:auto;margin-bottom:.7rem;text-align:left}
.pknote .list div{background:#fff;border:2px dashed #E9C99A;border-radius:12px;padding:.45rem .6rem;font-size:.9rem}
.pknote .row2{display:grid;grid-template-columns:1fr 1fr;gap:.4rem}
.pknote button{border:2px solid #fff;border-radius:14px;padding:.55rem;font:inherit;font-weight:700;cursor:pointer;background:#F3E6D6;color:#6E4B3A}
.pknote button.main{background:#5CC48A;color:#fff}
.pksweep{position:fixed;z-index:21;pointer-events:none;width:22vw;max-width:7rem;animation:pksw .9s ease-out forwards}
@keyframes pksw{0%{transform:translate(-30%,10%) rotate(-25deg);opacity:0}30%{opacity:1}100%{transform:translate(30%,-10%) rotate(20deg);opacity:0}}
#pkSheet .pcard{background:linear-gradient(180deg,#FFFFFF,#F8F0FF);border:2px solid #EADCFB;border-radius:18px;box-shadow:0 3px 0 #E2D0F7;padding:.45rem .45rem;transition:transform .12s}
#pkSheet .pcard:not(:disabled):active{transform:translateY(2px);box-shadow:0 1px 0 #E2D0F7}
#pkSheet .pcard img{background:radial-gradient(circle,#fff 55%,#F1E6FF);border-radius:50%;padding:.15rem;width:2.7rem;height:2.7rem}
#pkSheet .pcard b{font-size:.8rem;color:#5E3A8C}
#pkSheet .pcard .cost img{width:1rem;height:1rem;background:none;padding:0;border-radius:0}
#pkSheet .pcard .cost{background:#fff;border-radius:999px;padding:.05rem .4rem;margin-top:.15rem;width:max-content;border:1.5px solid #EADCFB}
#pkSheet .lbl{display:inline-block;background:#F4EAFF;border-radius:999px;padding:.12rem .6rem}
#pkSheet .msgs button{background:linear-gradient(180deg,#FFFDF8,#FFF3E2);border-color:#F6DDB8;border-radius:16px;box-shadow:0 2px 0 #F1D6AE;padding-left:.6rem}
#pkSheet .msgs button::before{content:"💬 "}
#pkSheet .pay{border-radius:20px;box-shadow:0 3px 0 #EEDFCC}
#pkSheet .pay.m:not(:disabled){background:linear-gradient(180deg,#FFFDF5,#FFF1D2);box-shadow:0 3px 0 #F6C77A}
#pkSheet .pay.b:not(:disabled){background:linear-gradient(180deg,#FFFFFF,#F6EEFF);box-shadow:0 3px 0 #C7A4EE}
#pkSheet .pay img,#pkSheet .pay .ico{background:#fff;border-radius:50%;box-shadow:0 2px 6px rgba(107,63,160,.15)}
.pkdock button{background:linear-gradient(180deg,#C9A8F2,#9A6BD8);box-shadow:0 3px 0 #7A4DB8,0 6px 12px rgba(60,20,90,.25);font-size:.72rem;text-shadow:0 1px 0 rgba(80,30,120,.35)}
.pkdock button img{background:rgba(255,255,255,.9);border-radius:50%;padding:.1rem}
.pkdock button.gold{box-shadow:0 3px 0 #D3952A,0 6px 12px rgba(120,70,10,.25);text-shadow:none}
.pkalert{background:linear-gradient(180deg,#FFFFFF,#F6EEFF);box-shadow:0 3px 0 #D9C3F5,0 6px 16px rgba(60,20,90,.2)}
.pknote .paper{background:linear-gradient(180deg,#FFF9EC,#FFF0D6);border-radius:26px}
.pknote .list div::before{content:"🪧 "}
.pknote button{border-radius:999px;box-shadow:0 3px 0 #E2CDB2}
.pknote button.main{background:linear-gradient(180deg,#7FD8A6,#4FB87D);box-shadow:0 3px 0 #3A9A66}
@media (prefers-reduced-motion:reduce){.pkbatfly,.pkspark,.pkover img,.pkover::before{animation:none}}`;
document.head.appendChild(css);
const sheetEl=document.createElement('section');sheetEl.className='sheet';sheetEl.id='pkSheet';document.body.appendChild(sheetEl);
const oldClose=closeAll;closeAll=function(){oldClose();sheetEl.classList.remove('on');};
function pkOpen(html){closeAll();sheetEl.innerHTML=html;open('pkSheet');sheetEl.scrollTop=0;sheetEl.querySelector('[data-x]')?.addEventListener('click',closeAll);}
const hw=k=>Number(S.bag?.halloween?.[k])||0;
/* ---------- ระยะเวลาของแปลง (ใช้สูตรเดียวกับหน้าสวน) ---------- */
const left=ms=>{const m=Math.max(0,Math.ceil(ms/60000));return m>=60?Math.floor(m/60)+' ชม. '+(m%60)+' นาที':m+' นาที';};
function plotInfo(p){if(!p)return {st:0,txt:'แปลงว่าง'};if(p.pk)return {st:Math.max(1,pstage(p)||1),txt:'😈 โดน'+PRANKS[p.pk.k].n+' · หยุดโต'};
 const st=pstage(p),now=Date.now();let txt='';
 if(p.magicUntil>now)txt='🔮 มนต์ดำเหลือ '+left(p.magicUntil-now);
 else if(p.ph==='ready')txt='✨ สุกแล้ว';
 else if(p.ph==='water')txt='💧 รอรดน้ำ';
 else if(p.ph==='worm')txt='🪱 มีหนอน';
 else if(p.ph==='g1')txt='⏳ รดน้ำได้ในอีก '+left(G1(p)-(now-p.t));
 else if(p.ph==='g2')txt='⏳ สุกในอีก '+left(G2(p)-(now-p.t));
 return {st,txt};}
const srcOf=(p,st)=>st<=1?IMG.s1:st===2?IMG.s2:(IMG[p.c+st]||IMG[p.c+'4']||IMG.s2);
/* ---------- เยี่ยมสวน: วาดผักจริง ---------- */
window.renderFriendPlots=function(s,list){const plots=window.friendFarm?.plots||[];plotEls=[];
 list.forEach((r,i)=>{const p=plots[i],d=box(...r,'cplot fr',()=>friendPlot(i),'<div class="pl"></div><div class="bar" style="display:none"><i></i></div><span class="badge" style="display:none"></span>');
  if(p&&p.c){const {st}=plotInfo(p),now=Date.now(),magic=p.magicUntil>now,ready=p.ph==='ready'&&!p.pk&&!magic;
   d.querySelector('.pl').innerHTML='<img class="s'+st+'" src="'+srcOf(p,st)+'" alt="">';if(ready){d.classList.add('ready');d.insertAdjacentHTML('beforeend','<span class="pkspark">✨</span>');}
   const bt=p.ph==='water'?'💧':p.ph==='worm'?'🪱':'';const bd=d.querySelector('.badge');if(bt&&!p.pk){bd.textContent=bt;bd.style.display='grid';}
   if(p.angel)d.insertAdjacentHTML('beforeend','<span class="wing">😇</span>');
   if(magic)d.insertAdjacentHTML('beforeend','<div class="pkmagic">🔮</div>');
   if(p.pk)d.insertAdjacentHTML('beforeend','<div class="pkover"><img src="'+PIMG(p.pk.k)+'" alt=""></div>');
   const sh=(p.ph==='g1'||p.ph==='g2')&&!p.pk;if(sh){const b=d.querySelector('.bar');b.style.display='block';b.firstChild.style.width=Math.min(100,pprog(p))+'%';}}
  s.appendChild(d);plotEls.push(d);});};
/* แตะแปลงเพื่อน: ชื่อผักจริง เวลาที่เหลือ + ขโมย/รดน้ำ/หนอน/มนต์ดำ + แกล้งแปลง */
const prankCost=k=>{const [it,q]=PRANKS[k].pay;return '<span class="cost"><img src="'+HWI(it)+'" alt="">'+q+' <small style="font-weight:600;color:#9A7A68">(มี '+hw(it)+')</small></span>';};
const canPay=k=>{const [it,q]=PRANKS[k].pay;return hw(it)>=q;};
const scareOn=()=>(window.friendFarm?.prankState?.scareUntil||0)>Date.now();
const myPranks=()=>{const q=window.friendFarm?.quota||{},d=new Date(Date.now()+7*3600e3).toISOString().slice(0,10);return q.pday===d?Number(q.pranks)||0:0;};
friendPlot=function(i){const p=window.friendFarm?.plots?.[i];if(!p||!p.c)return toast('แปลงว่าง');
 const {st,txt}=plotInfo(p),now=Date.now(),magic=p.magicUntil>now,ready=p.ph==='ready'&&!p.pk&&!magic,mine=myPranks();
 const acts=[];if(!p.pk&&!magic){if(ready&&!p.angel)acts.push(['🧤 ขโมย','steal',1]);if(p.ph==='water')acts.push(['💧 รดน้ำ','water',0]);if(p.ph==='worm')acts.push(['🪱 กำจัดหนอน','worm',0]);if(!p.angel)acts.push(['🔮 มนต์ดำ 3 ชม.','magic',0]);}
 const lock=scareOn()?'🛡️ หุ่นไล่กาเฝ้าสวนนี้อยู่':p.pk?'แปลงนี้โดนแกล้งอยู่แล้ว':magic?'แปลงมีมนต์ดำอยู่':mine>=PRANK_DAY?'วันนี้แกล้งครบ '+PRANK_DAY+' ครั้งแล้ว':'';
 pkOpen('<div class="ph"><img src="'+(p.pk?PIMG(p.pk.k):srcOf(p,st))+'" alt=""><div><b>'+esc(CN[p.c]||p.c)+' · แปลง '+(i+1)+'</b><small>'+txt+(p.angel?' · 😇 นางฟ้าปกป้อง':'')+'</small></div><button class="x" data-x aria-label="ปิด">✕</button></div>'
  +(acts.length?'<div class="row2">'+acts.map(([l,t,main])=>'<button class="act'+(main?' gold':'')+'" data-a="'+t+'">'+l+'</button>').join('')+'</div>':'')
  +'<div class="lbl">😈 แกล้งแปลงนี้ · ไม่บอกชื่อคนแกล้ง · วันนี้ '+mine+'/'+PRANK_DAY+'</div>'+(lock?'<div class="note">'+lock+'</div>':'')
  +'<div class="pgrid">'+Object.entries(PRANKS).filter(([,v])=>v.plot).map(([k,v])=>'<button class="pcard" data-k="'+k+'" '+(lock||!canPay(k)?'disabled':'')+'><img src="'+PIMG(k)+'" alt=""><div><b>'+v.n+'</b><small>'+v.desc+'</small>'+prankCost(k)+'</div></button>').join('')+'</div>');
 sheetEl.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{closeAll();window.cloudFriend(b.dataset.a,{index:i});});
 sheetEl.querySelectorAll('[data-k]').forEach(b=>b.onclick=async()=>{const k=b.dataset.k;closeAll();const out=await window.cloudFriend('prank',{prank:k,index:i});if(out?.prank)toast('😈 '+PRANKS[k].n+'แล้ว! เจ้าของสวนจะเห็นแค่ว่า "ใครสักคน"');});};
function gardenPrank(k){const st=window.friendFarm?.prankState||{},mine=myPranks(),P=PRANKS[k];
 const full=k==='bat'?st.bat:(st.signs||0)>=SIGN_MAX,lock=scareOn()?'🛡️ หุ่นไล่กาเฝ้าสวนนี้อยู่':mine>=PRANK_DAY?'วันนี้แกล้งครบ '+PRANK_DAY+' ครั้งแล้ว':full?(k==='bat'?'สวนนี้มีค้างคาวอยู่แล้ว':'สวนนี้มีป้ายครบ '+SIGN_MAX+' ป้ายแล้ว'):!canPay(k)?HW_NAMES[P.pay[0]]+'ไม่พอ':'';
 pkOpen('<div class="ph"><img src="'+PIMG(k)+'" alt=""><div><b>'+P.n+'</b><small>'+P.desc+' · แกล้งทั้งสวน · วันนี้ '+mine+'/'+PRANK_DAY+'</small></div><button class="x" data-x aria-label="ปิด">✕</button></div><div class="lbl">จ่าย '+prankCost(k)+'</div>'+(lock?'<div class="note">'+lock+'</div>':'')
  +(k==='sign'?'<div class="lbl">🪧 เลือกข้อความบนป้าย · ในสวนนี้ '+(st.signs||0)+'/'+SIGN_MAX+'</div><div class="msgs">'+PRANK_MSGS.map((m,j)=>'<button data-m="'+j+'" '+(lock?'disabled':'')+'>'+esc(m)+'</button>').join('')+'</div>'
   :'<button class="act gold" id="pkGo" style="width:100%" '+(lock?'disabled':'')+'>😈 ปล่อยค้างคาว!</button>'));
 sheetEl.querySelectorAll('[data-m]').forEach(b=>b.onclick=async()=>{closeAll();const out=await window.cloudFriend('prank',{prank:'sign',msg:+b.dataset.m});if(out?.prank)toast('🪧 ปักป้ายแล้ว! เจ้าของสวนจะเห็นแค่ว่า "ใครสักคน"');});
 sheetEl.querySelector('#pkGo')?.addEventListener('click',async()=>{closeAll();const out=await window.cloudFriend('prank',{prank:'bat'});if(out?.prank)toast('🦇 ปล่อยค้างคาวแล้ว! สวนมืดครึ้ม');});}
/* ---------- เจ้าของสวน: แก้การแกล้ง ---------- */
const myPrank=()=>S.sub?.prank||{};
function fixSheet(kind,opt={}){const k=kind==='plot'?opt.k:kind,P=PRANKS[k],n=opt.n||1,merit=P.merit*n,broom=P.broom*n,have=hw('broom'),after=(Number(S.merit)||0)-merit;
 const title=kind==='sign'?'ป้ายแซว '+n+' ป้าย':kind==='plot'&&n>1?P.n+' '+n+' แปลง':P.n;
 pkOpen('<div class="ph"><img src="'+PIMG(k)+'" alt=""><div><b>😈 ใครสักคน'+title+'!</b><small>'+(n>1?'ราคาคิดต่อ'+(kind==='sign'?'ป้าย':'แปลง')+' · ':'')+'เลือกวิธีแก้ 1 อย่าง</small></div><button class="x" data-x aria-label="ปิด">✕</button></div>'
  +'<button class="pay m" data-h="merit"><span class="ico">🙏</span><div><b>จ่าย '+fmtN(merit)+' กุศล</b><small>หลังจ่ายเหลือ '+fmtN(after)+(after<0?' · ติดลบได้':'')+'</small></div></button>'
  +'<button class="pay b" data-h="broom" '+(have>=broom?'':'disabled')+'><img src="'+HWI('broom')+'" alt=""><div><b>ใช้ไม้กวาดแม่มด '+broom+' อัน</b><small>'+(have>=broom?'มีอยู่ '+have+' อัน':'ไม้กวาดไม่พอ (มี '+have+')')+'</small></div></button>'
  +'<div class="note">เพื่อนช่วยแก้ไม่ได้ · ต้องแก้เอง</div>');
 sheetEl.querySelectorAll('[data-h]').forEach(b=>b.onclick=async()=>{const how=b.dataset.h;closeAll();const out=await window.cloudFarm('prank-fix',{kind,how,...opt.input});if(out&&out.prank){sweep(opt.rect);toast('🧹 แก้เรียบร้อย! '+(how==='merit'?'จ่าย '+fmtN(out.prank.merit)+' กุศล':'ใช้ไม้กวาด '+out.prank.broom+' อัน'));}});}
function sweep(rect){const im=document.createElement('img');im.className='pksweep';im.src=HWI('broom');im.alt='';const r=rect||{left:innerWidth*.35,top:innerHeight*.4};im.style.left=r.left+'px';im.style.top=r.top+'px';document.body.appendChild(im);setTimeout(()=>im.remove(),950);}
const prevTap=tapPlot;tapPlot=function(i){if(!visiting){const p=S.farms?.[farm]?.[i];if(p?.pk){const n=(S.farms[farm]||[]).filter(x=>x?.pk?.k===p.pk.k).length;return fixSheet('plot',{k:p.pk.k,input:{farm,index:i},rect:plotEls[i]?.getBoundingClientRect()});}}return prevTap(i);};
function scareSheet(){const st=myPrank(),on=(st.scareUntil||0)>Date.now(),need=Object.entries(SCARE_COST),ok=need.every(([k,q])=>hw(k)>=q);
 pkOpen('<div class="ph"><img src="images/prank-scarecrow.webp" alt=""><div><b>🛡️ หุ่นไล่กา</b><small>กันเพื่อนแกล้งสวน 59 นาที (ไม่กันการขโมย)</small></div><button class="x" data-x aria-label="ปิด">✕</button></div>'
  +(on?'<div class="note" style="font-size:.85rem">🛡️ หุ่นไล่กาเฝ้าอยู่ อีก '+left(st.scareUntil-Date.now())+'</div>'
   :'<div class="lbl">🧺 วัตถุดิบ</div><div class="pgrid">'+need.map(([k,q])=>'<div class="pcard" style="cursor:default'+(hw(k)>=q?'':';opacity:.55')+'"><img src="'+HWI(k)+'" alt=""><div><b>'+HW_NAMES[k]+'</b><span class="cost">'+(hw(k)>=q?'✅ ':'❌ ')+fmtN(q)+' <small style="font-weight:600;color:#9A7A68">(มี '+fmtN(hw(k))+')</small></span></div></div>').join('')+'</div>'
   +'<button class="act gold" id="pkScare" style="width:100%;margin-top:.6rem" '+(ok?'':'disabled')+'>🎃 ตั้งหุ่นไล่กา</button>'));
 sheetEl.querySelector('#pkScare')?.addEventListener('click',async()=>{closeAll();const out=await window.cloudFarm('prank-fix',{kind:'scare'});if(out?.prank)toast('🛡️ ตั้งหุ่นไล่กาแล้ว กันแกล้ง 59 นาที');});}
function readSigns(first){const st=myPrank(),signs=st.signs||[],plots=[1,2,3].reduce((a,f)=>a+(S.farms?.[f]||[]).filter(p=>p?.pk).length,0);
 const nn=document.createElement('div');nn.className='pknote';
 nn.innerHTML='<div class="paper" role="dialog"><img src="images/prank-sign.webp" alt="">'+(first?'<div class="sum">😱 ระหว่างที่คุณไม่อยู่ ใครสักคนแกล้งสวนคุณ!<br>'+[signs.length?'🪧 ป้าย '+signs.length:'',plots?'🌱 แปลง '+plots:'',st.bat?'🦇 ค้างคาว 1':''].filter(Boolean).join(' · ')+'</div>':'')
  +(signs.length?'<div class="list">'+signs.map(g=>'<div>“'+esc(PRANK_MSGS[g.m]||'')+'”</div>').join('')+'</div>':'')
  +'<div class="row2"><button id="pnOk">👀 อ่านแล้ว</button><button class="main" id="pnFix" '+(signs.length?'':'disabled')+'>🧹 ถอน'+(signs.length>1?'ทั้งหมด '+signs.length+' ป้าย':'ป้าย')+'</button></div></div>';
 document.body.appendChild(nn);const done=()=>{nn.remove();if(first)window.cloudFarm('prank-fix',{kind:'seen'}).catch?.(()=>{});};
 nn.querySelector('#pnOk').onclick=done;nn.querySelector('#pnFix').onclick=()=>{nn.remove();if(first)window.cloudFarm('prank-fix',{kind:'seen'});setTimeout(()=>fixSheet('sign',{n:signs.length,input:{all:true}}),first?600:0);};}

/* ---------- fix17 😈 ไอเทมปีศาจ ---------- */
const DM={music:['กล่องดนตรีหมูปีศาจ','🎶','prank-musicbox','หักทันที −20,000'],hour:['นาฬิกาทรายปีศาจ','⏳','prank-hourglass','ดูด −4,000 ทุก 6 นาที · 1 ชม.'],coffin:['หีบโลงต้องสาป','⛓️','prank-coffin','ล็อกสวน · เจ้าของเสี่ยงดวงเปิดหีบ'],heart:['หัวใจทับทิมปีศาจ','💖','prank-heart','ส่งต่อใน 10 นาที ไม่งั้น −100,000']};
const dmHms=ms=>{ms=Math.max(0,ms);const h=Math.floor(ms/3600e3),m=Math.floor(ms%3600e3/60e3),s=Math.floor(ms%60e3/1e3);return h?h+':'+String(m).padStart(2,'0')+' ชม.':m+':'+String(s).padStart(2,'0');};
function demonSheet(){const bag=S.bag?.demon||{},lots=(()=>{try{return parent.__HOST?.x17?.()?.dm?.b||[];}catch(e){return [];}})(),now=Date.now();
 pkOpen('<div class="ph"><img src="images/prank-heart.webp" alt=""><div><b>😈 แกล้งสวนของ '+esc(visiting||'')+'</b><small>ไม่บอกชื่อคนแกล้ง · คนโดนสืบไม่ได้ · ใช้ชิ้นที่ใกล้หมดเวลาก่อน</small></div><button class="x" data-x aria-label="ปิด">✕</button></div>'
  +Object.entries(DM).map(([k,[n,e,img,desc]])=>{const have=Math.max(0,Math.floor(Number(bag[k])||0)),first=lots.filter(x=>x.k===k&&x.n>0).sort((a,b)=>a.at-b.at)[0],left=first?first.at+48*3600e3-now:0;
   return '<button class="dmit" data-dm="'+k+'" '+(have?'':'disabled')+'><img src="images/'+img+'.webp" alt=""><div><b>'+e+' '+n+'</b><small>'+desc+'</small>'+(first?'<span class="dmexp'+(left<6*3600e3?' warn':'')+'">⏳ '+dmHms(left)+'</span>':'')+'</div><div class="r">มี '+have+'</div></button>';}).join('')
  +'<div class="note">🛡️ หุ่นไล่กากัน 🎶 ⏳ ⛓️ ได้ · 💖 ทะลุหุ่นไล่กา</div>');
 sheetEl.querySelectorAll('[data-dm]').forEach(b=>b.onclick=async()=>{const k=b.dataset.dm;closeAll();const out=await window.cloudDemon?.(k);if(!out?.sent)return;
  const [cx,cy]=[innerWidth/2,innerHeight*.5],f=document.createElement('img');f.className='dmfly';f.src='images/'+DM[k][2]+'.webp';f.style.left=(cx-32)+'px';f.style.top=(innerHeight-120)+'px';document.body.appendChild(f);
  requestAnimationFrame(()=>{f.style.transform='translate(0,'+(cy-innerHeight+90)+'px) scale(1.4)';});
  setTimeout(()=>{f.style.opacity='0';const bm=document.createElement('div');bm.className='dmboom';bm.style.left=cx+'px';bm.style.top=cy+'px';document.body.appendChild(bm);setTimeout(()=>{bm.remove();f.remove();},600);const st=$('stage');st.classList.remove('pkshake');void st.offsetWidth;st.classList.add('pkshake');
   toast('😈 '+({music:'ส่งกล่องดนตรีให้ ',hour:'วางนาฬิกาทรายในสวน ',coffin:'วางหีบโลงในสวน ',heart:'ส่งหัวใจให้ '}[k])+esc(out.sent.name)+' แล้ว! เจ้าของสวนจะไม่รู้ว่าใคร');},900);});}
const HG_SPOT=[[80,30],[66,27],[90,46]];
function demonGarden(s){if(visiting)return;let D=null;try{D=parent.__DEMON;}catch(e){}const v=D?.view;if(!v)return;const now=Date.now();
 (v.hg||[]).slice(0,3).forEach((h,j)=>{const [x,y]=HG_SPOT[j],o=document.createElement('div');o.className='dmobj dmhg';o.style.left=x+'%';o.style.top=y+'%';const paid=Math.min(10,Math.floor((now-h.at)/360000));
  o.innerHTML='<span class="rune"></span><span class="aura"></span><img src="images/prank-hourglass.webp" alt="นาฬิกาทรายปีศาจ"><span class="neck"></span><span class="dmtag">⏳ '+dmHms(h.end-now)+' · −'+(paid*4000).toLocaleString('en-US')+'</span>';s.appendChild(o);});
 const c=(v.cf||[])[0];if(c){const l=document.createElement('div');l.className='dmlock';s.appendChild(l);const o=document.createElement('div');o.className='dmobj dmcf'+(window.__dmCf===c.id?'':' drop');window.__dmCf=c.id;o.style.left='52%';o.style.top='54%';o.setAttribute('role','button');o.setAttribute('aria-label','เปิดหีบโลง');
  o.innerHTML='<img src="images/prank-coffin.webp" alt=""><span class="dmtag">⛓️ แตะเพื่อเปิด · '+dmHms(c.until-now)+'</span>';o.onclick=e=>{e.stopPropagation();try{parent.__DEMON?.openSeal?.();}catch(err){}};s.appendChild(o);}}
try{parent.__demonHook=()=>{try{render();}catch(e){}};}catch(e){}
/* ---------- ฉาก: ค้างคาว ป้าย หุ่นไล่กา (ทั้งเจ้าของและคนเยี่ยม) ---------- */
const SPOTS=[];for(let i=0;i<10;i++){SPOTS.push([88+i*85,1352]);SPOTS.push([130+i*85,1228]);}
let batRAF=0,dock=null,alert=null;
function stopBats(){cancelAnimationFrame(batRAF);batRAF=0;}
function startBats(cv){stopBats();const g=cv.getContext('2d');let w,h;const dpr=Math.min(2,devicePixelRatio||1);
 const fit=()=>{w=cv.clientWidth;h=cv.clientHeight;cv.width=w*dpr;cv.height=h*dpr;g.setTransform(dpr,0,0,dpr,0,0);};fit();
 const rnd=(a,b)=>a+Math.random()*(b-a);
 const bats=Array.from({length:16},()=>({x:rnd(-w,w),y:rnd(h*.08,h*.6),s:rnd(.6,1.3),v:rnd(.6,1.6),ph:rnd(0,6),dir:Math.random()<.5?1:-1,wob:rnd(.6,1.4)}));
 const mist=Array.from({length:9},(_,i)=>({x:rnd(0,w),y:rnd(h*.55,h*.95),r:rnd(60,130),v:rnd(.1,.3)*(i%2?1:-1)}));
 let bolt=null,flash=0,next=performance.now()+1800;
 const mkBolt=()=>{const x0=rnd(w*.12,w*.88),pts=[[x0,0]];let x=x0,y=0;const end=rnd(h*.45,h*.7);while(y<end){y+=rnd(14,30);x+=rnd(-22,22);pts.push([x,y]);}
  const br=[];for(let k=0;k<2;k++){const i=Math.floor(rnd(2,pts.length-2)),[bx,by]=pts[i],p=[[bx,by]];let xx=bx,yy=by;for(let j=0;j<5;j++){yy+=rnd(10,20);xx+=rnd(8,22)*(k?1:-1);p.push([xx,yy]);}br.push(p);}return {pts,br,life:1};};
 const path=p=>{g.beginPath();g.moveTo(p[0][0],p[0][1]);for(const q of p)g.lineTo(q[0],q[1]);};
 const drawBat=(b,t)=>{const f=Math.sin(t/90*b.wob+b.ph),sz=14*b.s;g.save();g.translate(b.x,b.y+Math.sin(t/400+b.ph)*6);g.scale(b.dir,1);
  g.fillStyle='rgba(28,10,40,.95)';g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(-sz*.9,-sz*(.2+.8*f),-sz*1.8,-sz*.1*f+sz*.1);g.quadraticCurveTo(-sz*1.2,sz*.15,-sz*.9,sz*.35);g.quadraticCurveTo(-sz*.5,sz*.1,0,sz*.35);
  g.quadraticCurveTo(sz*.5,sz*.1,sz*.9,sz*.35);g.quadraticCurveTo(sz*1.2,sz*.15,sz*1.8,-sz*.1*f+sz*.1);g.quadraticCurveTo(sz*.9,-sz*(.2+.8*f),0,0);g.fill();
  g.beginPath();g.ellipse(0,sz*.15,sz*.32,sz*.42,0,0,7);g.fill();g.fillStyle='#FFD95A';g.shadowColor='#FFD95A';g.shadowBlur=6;g.beginPath();g.arc(-sz*.12,sz*.08,sz*.07,0,7);g.arc(sz*.12,sz*.08,sz*.07,0,7);g.fill();g.restore();};
 const loop=t=>{batRAF=requestAnimationFrame(loop);if(!cv.isConnected)return stopBats();if(cv.clientWidth!==w)fit();g.clearRect(0,0,w,h);
  const v=g.createRadialGradient(w*.5,h*.38,h*.08,w*.5,h*.45,h*.75);v.addColorStop(0,'rgba(34,10,62,.72)');v.addColorStop(1,'rgba(4,1,12,.96)');g.fillStyle=v;g.fillRect(0,0,w,h);
  const m=g.createRadialGradient(w*.82,h*.07,0,w*.82,h*.07,h*.18);m.addColorStop(0,'rgba(220,210,255,.35)');m.addColorStop(1,'rgba(220,210,255,0)');g.fillStyle=m;g.fillRect(0,0,w,h*.3);
  for(const s of mist){s.x+=s.v;if(s.x<-s.r)s.x=w+s.r;if(s.x>w+s.r)s.x=-s.r;const q=g.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r);q.addColorStop(0,'rgba(150,90,220,.22)');q.addColorStop(1,'rgba(150,90,220,0)');g.fillStyle=q;g.beginPath();g.arc(s.x,s.y,s.r,0,7);g.fill();}
  for(const b of bats){b.x+=b.v*b.dir*1.4;if(b.dir>0&&b.x>w+40){b.x=-40;b.y=rnd(h*.08,h*.6);}if(b.dir<0&&b.x<-40){b.x=w+40;b.y=rnd(h*.08,h*.6);}drawBat(b,t);}
  if(t>next){bolt=mkBolt();flash=1;next=t+rnd(2600,5200);const s=$('stage');s.classList.remove('pkshake');void s.offsetWidth;s.classList.add('pkshake');}
  if(bolt){g.save();g.globalAlpha=bolt.life;g.strokeStyle='#F4ECFF';g.lineWidth=3;g.shadowColor='#B98CFF';g.shadowBlur=22;path(bolt.pts);g.stroke();g.lineWidth=1.5;for(const b of bolt.br){path(b);g.stroke();}g.restore();bolt.life-=.045;if(bolt.life<=0)bolt=null;}
  if(flash>0){g.fillStyle='rgba(235,225,255,'+(flash*.55)+')';g.fillRect(0,0,w,h);flash-=.06;}};
 if(matchMedia('(prefers-reduced-motion:reduce)').matches){loop(0);stopBats();return;}batRAF=requestAnimationFrame(loop);}
function state(){if(visiting){const s=window.friendFarm?.prankState||{};return {bat:!!s.bat,signs:Array.from({length:s.signs||0},()=>null),scareUntil:s.scareUntil||0};}const s=myPrank();return {bat:!!s.bat,signs:s.signs||[],scareUntil:s.scareUntil||0};}
window.prankDecorate=function(s){stopBats();dock?.remove();alert?.remove();dock=alert=null;const st=state(),now=Date.now();
 // แปลงของเจ้าของที่โดนแกล้ง
 if(!visiting&&farm<=3)(S.farms?.[farm]||[]).forEach((p,i)=>{const d=plotEls[i];if(!d||!p?.pk)return;d.insertAdjacentHTML('beforeend','<div class="pkover"><img src="'+PIMG(p.pk.k)+'" alt=""></div>');const b=d.querySelector('.bar');if(b)b.style.display='none';});
 if(farm===1)st.signs.forEach((g,j)=>{const [x,y]=SPOTS[j]||SPOTS[0],el=document.createElement('div');el.className='pksign';el.style.left=x/W*100+'%';el.style.top=y/H*100+'%';el.style.setProperty('--r',((j*29)%9-4)+'deg');el.innerHTML='<img src="images/prank-sign.webp" alt="ป้ายแซว">';el.onclick=()=>visiting?toast('🪧 ป้ายแซวในสวนนี้'):readSigns(false);s.appendChild(el);});
 if(st.scareUntil>now&&farm===1){const im=document.createElement('img');im.className='pkscare';im.src='images/prank-scarecrow.webp';im.alt='';s.appendChild(im);const t=document.createElement('span');t.className='pkshield';t.textContent='🛡️ กันแกล้ง '+left(st.scareUntil-now);s.appendChild(t);}
 if(st.bat){const c=document.createElement('canvas');c.className='pkbat';s.appendChild(c);const b=document.createElement('img');b.className='pkbatfly';b.src='images/prank-bat.webp';b.alt='';s.appendChild(b);requestAnimationFrame(()=>startBats(c));}
 dock=document.createElement('div');dock.className='pkdock';
 if(visiting)dock.innerHTML='<button class="dv" data-dm><img src="images/prank-heart.webp" alt="">ปีศาจ</button><button data-p="bat"><img src="images/prank-bat.webp" alt="">ค้างคาว</button><button data-p="sign"><img src="images/prank-sign.webp" alt="">ปักป้าย</button>';
 else dock.innerHTML=(st.bat?'<button data-f="bat"><img src="images/prank-bat.webp" alt="">ไล่ค้างคาว</button>':'')+(st.signs.length?'<button data-f="sign"><img src="images/prank-sign.webp" alt="">ป้าย '+st.signs.length+'</button>':'')+'<button class="gold" data-f="scare"><img src="images/prank-scarecrow.webp" alt="">'+(st.scareUntil>now?'เฝ้าอยู่':'หุ่นไล่กา')+'</button>';
 document.body.appendChild(dock);
 dock.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>gardenPrank(b.dataset.p));
 dock.querySelector('[data-dm]')?.addEventListener('click',demonSheet);demonGarden(s);
 dock.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const f=b.dataset.f;if(f==='scare')return scareSheet();if(f==='bat')return fixSheet('bat');readSigns(false);});
 if(!visiting){const plots=[1,2,3].reduce((a,f)=>a+(S.farms?.[f]||[]).filter(p=>p?.pk).length,0),n=plots+(st.bat?1:0)+st.signs.length;
  if(n){alert=document.createElement('div');alert.className='pkalert';alert.textContent='😈 ใครสักคนแกล้งสวนของคุณ · '+n+' จุด';alert.onclick=()=>readSigns(false);document.body.appendChild(alert);}
  const last=Math.max(myPrank().last||0),seen=myPrank().seen||0;if(n&&last>seen&&!document.querySelector('.pknote')&&!window.__pkShown){window.__pkShown=last;readSigns(true);}}};
/* โมดูลนี้โหลดหลังหน้าสวนวาดเสร็จ: วาดใหม่หนึ่งครั้งให้เห็นสถานะการแกล้ง */
try{render();}catch(e){console.error(e);}
