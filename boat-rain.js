/* fix17 ⛈️ ฝนกุศล บนหน้าแข่งเรือ (โมดูลหน้าเว็บ)
   · ทุกคนเห็นฝนชุดเดียวกัน (seed จากเซิร์ฟเวอร์) · กดฟองเก็บไว้ในเครื่อง แล้วส่งรายการกดครั้งเดียวตอนฝนหยุด → เซิร์ฟเวอร์คิดคะแนนเอง
   · 👑 ฟองทอง: ถามเซิร์ฟเวอร์ทันที (คนแรกคนเดียว) · พลังทีมสด: ส่งคะแนนตัวเองทุก ~5 วิ และฟังกระดานทีมเฉพาะตอนฝนตก
   · ไม่มีฝน = ไม่ฟังอะไรเพิ่ม ไม่อ่านอะไรเพิ่ม */
import {rainLogic,rainGeom,RAIN_MS,RAIN_WARN,RAIN_STORM,RAIN_PLUS,RAIN_LEVELS,RAIN_SETTLE,RAIN_FREE_MISS,RAIN_MISS,RAIN_RATE,RAIN_LAG} from './rain-engine.js?v=ss3-fix17';
const LEVELS=[{lvl:1,e:'🌦️',name:'ฝนปรอย',est:'~5 แสน'},{lvl:2,e:'🌧️',name:'ฝนหนัก',est:'~1 ล้าน'},{lvl:5,e:'⛈️',name:'พายุ',est:'~2.5–3 ล้าน'}];
const CSS=`
#rnSky{position:fixed;inset:0;pointer-events:none;z-index:3;opacity:0;transition:opacity 2.5s ease;background:linear-gradient(180deg,rgba(14,22,48,.82) 0%,rgba(20,34,70,.5) 32%,rgba(20,40,80,.18) 70%,rgba(20,40,80,.1) 100%)}
#rnSky.on{opacity:1}
#rnSky i{position:absolute;top:-6%;width:70vw;height:22vh;border-radius:50%;background:radial-gradient(ellipse at center,rgba(70,84,120,.95),rgba(50,62,96,.6) 45%,rgba(40,50,80,0) 72%);filter:blur(6px);animation:rnDrift 18s ease-in-out infinite alternate}
#rnSky i:nth-child(1){left:-20vw}#rnSky i:nth-child(2){left:25vw;top:-9%;animation-duration:22s}#rnSky i:nth-child(3){left:55vw;top:-4%;animation-duration:16s}
@keyframes rnDrift{to{transform:translateX(9vw)}}
#rnFlash{position:fixed;inset:0;z-index:6;pointer-events:none;background:radial-gradient(circle at 50% 10%,rgba(255,255,255,.95),rgba(200,220,255,.55) 40%,rgba(255,255,255,0) 75%);opacity:0}
#rnFlash.go{animation:rnFlash .55s ease-out}
@keyframes rnFlash{0%{opacity:0}10%{opacity:1}25%{opacity:.2}38%{opacity:.85}100%{opacity:0}}
#rnHurt{position:fixed;inset:0;z-index:6;pointer-events:none;box-shadow:inset 0 0 70px 18px rgba(224,71,94,.65);opacity:0;transition:opacity .35s}
#rnHurt.on{opacity:1;transition:none}
#rnFx{position:fixed;inset:0;z-index:4;width:100%;height:100%;touch-action:none;pointer-events:none}
#rnFx.live{pointer-events:auto}
#rnHud{position:fixed;z-index:7;left:50%;top:calc(env(safe-area-inset-top,0px) + 3.5rem);transform:translateX(-50%);display:flex;gap:.35rem;align-items:center;opacity:0;transition:opacity .4s;pointer-events:none}
#rnHud.on{opacity:1}
.rn-timer{position:relative;display:flex;align-items:center;gap:.3rem;background:rgba(14,26,56,.78);color:#fff;border:2px solid rgba(255,255,255,.75);border-radius:999px;padding:.22rem .65rem .22rem .3rem;font-weight:700;font-size:.8rem;box-shadow:0 0 14px rgba(140,200,255,.45),0 4px 10px rgba(0,0,0,.3);font-variant-numeric:tabular-nums}
.rn-timer svg{width:1.5rem;height:1.5rem;transform:rotate(-90deg)}
.rn-timer circle{fill:none;stroke-width:4}.rn-timer .trk{stroke:rgba(255,255,255,.2)}.rn-timer .arc{stroke:#9FE3FF;stroke-linecap:round;transition:stroke-dashoffset .25s linear}
.rn-timer.storm{background:rgba(70,14,40,.85);border-color:#FFB0C0;box-shadow:0 0 18px rgba(255,90,120,.7)}.rn-timer.storm .arc{stroke:#FF8FA6}
.rn-timer .st{font-size:.66rem;opacity:.9}
.rn-mys{background:rgba(255,251,245,.95);border:2px solid #fff;border-radius:999px;padding:.22rem .6rem;font-weight:700;font-size:.78rem;box-shadow:0 4px 10px rgba(0,0,0,.25);font-variant-numeric:tabular-nums;color:#6E4B3A}
.rn-mys.neg{color:#E0475E}
#rnCombo{position:fixed;z-index:7;left:50%;top:calc(env(safe-area-inset-top,0px) + 5.7rem);transform:translateX(-50%) scale(.7);opacity:0;transition:opacity .2s,transform .2s;pointer-events:none;font-weight:800;font-size:.95rem;color:#fff;background:linear-gradient(180deg,#FFB547,#F07A2A);border:2px solid #fff;border-radius:999px;padding:.15rem .7rem;box-shadow:0 0 16px rgba(255,170,60,.8)}
#rnCombo.on{opacity:1;transform:translateX(-50%) scale(1)}#rnCombo.pop{animation:rnCpop .25s}
@keyframes rnCpop{50%{transform:translateX(-50%) scale(1.2)}}
#rnCombo.broke{animation:rnCbreak .45s forwards}
@keyframes rnCbreak{to{opacity:0;transform:translateX(-50%) translateY(10px) scale(.8);filter:grayscale(1)}}
#rnTeams{position:fixed;z-index:7;right:max(.45rem,env(safe-area-inset-right,0px));top:34%;width:6.6rem;background:rgba(14,26,56,.72);border:2px solid rgba(255,255,255,.6);border-radius:.9rem;padding:.35rem .4rem;color:#fff;box-shadow:0 6px 16px rgba(0,0,0,.3);opacity:0;transform:translateX(8px);transition:.4s;pointer-events:none}
#rnTeams.on{opacity:1;transform:none}
#rnTeams h4{margin:0 0 .2rem;font-size:.6rem;font-weight:700;opacity:.85;text-align:center}
.rn-trow{display:grid;grid-template-columns:1rem 1fr auto;gap:.25rem;align-items:center;font-size:.58rem;margin:.18rem 0;font-variant-numeric:tabular-nums}
.rn-trow img{width:1rem;height:1rem;object-fit:contain}
.rn-trow .tb{height:.42rem;border-radius:999px;background:rgba(255,255,255,.15);overflow:hidden}
.rn-trow .tb i{display:block;height:100%;width:0;border-radius:999px;transition:width .9s ease}
.rn-trow.me{color:#FFE08A;font-weight:700}.rn-trow.lead .tb i{box-shadow:0 0 8px currentColor}
#rnWarn{position:fixed;z-index:9;left:50%;top:calc(env(safe-area-inset-top,0px) + 3.6rem);transform:translate(-50%,-16px);opacity:0;transition:.35s;pointer-events:none;display:flex;gap:.6rem;align-items:center;background:linear-gradient(180deg,rgba(30,44,86,.96),rgba(18,26,56,.96));color:#fff;border:2px solid #9FD8FF;border-radius:1.1rem;padding:.45rem .9rem .45rem .5rem;box-shadow:0 0 26px rgba(120,190,255,.6),0 8px 20px rgba(0,0,0,.35);width:max-content;max-width:calc(100vw - 32px)}
#rnWarn.on{opacity:1;transform:translate(-50%,0)}
#rnWarn .ring{position:relative;width:2.8rem;height:2.8rem;flex:none}
#rnWarn .ring svg{width:100%;height:100%;transform:rotate(-90deg)}#rnWarn .ring circle{fill:none;stroke-width:4}
#rnWarn .ring .trk{stroke:rgba(255,255,255,.18)}#rnWarn .ring .arc{stroke:#FFD86B;stroke-linecap:round;transition:stroke-dashoffset 1s linear}
#rnWarn .ring b{position:absolute;inset:0;display:grid;place-items:center;font-size:1.05rem;font-variant-numeric:tabular-nums}
#rnWarn .wt{font-weight:700;font-size:.9rem;line-height:1.3}#rnWarn .wt small{display:block;font-weight:600;font-size:.72rem;color:#FFE7A3}
.rn-lvls{display:grid;gap:.4rem}
.rn-lvl{display:grid;grid-template-columns:2.4rem 1fr auto;align-items:center;gap:.55rem;width:100%;border:2px solid #F3E9DE;background:#fff;border-radius:1rem;padding:.5rem .7rem;font:inherit;color:#6E4B3A;cursor:pointer;text-align:left}
.rn-lvl .e{font-size:1.7rem;text-align:center}.rn-lvl b{font-size:.88rem;display:block}.rn-lvl small{font-size:.68rem;color:#9A7A68;font-weight:600}
.rn-lvl span{font-weight:800;color:#B9761F;font-size:.8rem;text-align:right;font-variant-numeric:tabular-nums}
.rn-lvl[aria-pressed="true"]{border-color:#7CC7F0;background:linear-gradient(180deg,#F1FAFF,#fff);box-shadow:0 0 0 3px rgba(124,199,240,.3)}
.rn-rules{display:flex;flex-wrap:wrap;gap:.3rem;justify-content:center;margin:.7rem 0 .2rem}
.rn-rules span{font-size:.66rem;font-weight:600;background:#fff;border:1.5px solid #F3E9DE;border-radius:999px;padding:.12rem .5rem}
.rn-big{display:block;width:100%;margin-top:.7rem;border:3px solid #fff;border-radius:999px;font:inherit;font-weight:800;font-size:.95rem;padding:.65rem 1.2rem;cursor:pointer;background:linear-gradient(180deg,#5FB8E8,#3D8FD0);color:#fff;box-shadow:0 4px 0 #2E6FA6,0 8px 16px rgba(0,0,0,.25)}
.rn-big.gold{background:linear-gradient(180deg,#FFCB5C,#F2A23A);box-shadow:0 4px 0 #C07A1E,0 8px 18px rgba(240,160,40,.45)}
.rn-big:disabled{background:#cfd8d6;box-shadow:none}
#rnRes{position:fixed;z-index:12;left:50%;top:50%;width:min(23rem,calc(100vw - 32px));max-height:calc(100% - 2rem);overflow:auto;transform:translate(-50%,-46%) scale(.92);opacity:0;pointer-events:none;transition:.3s cubic-bezier(.2,1.3,.4,1);background:#FFFBF5;border:3px solid #fff;border-radius:1.5rem;padding:.9rem .85rem 1rem;box-shadow:0 0 0 4px rgba(150,210,255,.45),0 18px 40px rgba(0,0,0,.45);color:#6E4B3A}
#rnRes.on{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
#rnRes .hd{text-align:center;margin-bottom:.5rem}#rnRes .hd .e{font-size:2.1rem;line-height:1;filter:drop-shadow(0 4px 8px rgba(80,140,220,.5))}
#rnRes .hd h3{margin:.2rem 0 .1rem}#rnRes .hd .lv{display:inline-block;font-size:.66rem;font-weight:700;background:#EAF6FF;color:#3C78A8;border-radius:999px;padding:.08rem .55rem}
.rn-sec{background:#fff;border:2px solid #F3E9DE;border-radius:1rem;padding:.5rem .6rem;margin-top:.45rem}
.rn-sec h5{margin:0 0 .35rem;font-size:.74rem;display:flex;align-items:center;gap:.3rem}
.rn-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:.3rem}
.rn-tile{border-radius:.75rem;padding:.3rem .2rem;text-align:center;background:#F8FBF9}
.rn-tile small{display:block;font-size:.6rem;font-weight:600;color:#9A7A68}.rn-tile b{font-size:.84rem;font-variant-numeric:tabular-nums}
.rn-tile.p b{color:#2E9E6A}.rn-tile.m b{color:#E0475E}.rn-tile.n{background:linear-gradient(180deg,#FFF5D6,#FFE9AE)}.rn-tile.n b{color:#B9761F}
.rn-tile.n.neg{background:#FFEFF2}.rn-tile.n.neg b{color:#E0475E}
.rn-facts{display:flex;flex-wrap:wrap;gap:.25rem;margin-top:.35rem}
.rn-facts span{font-size:.64rem;font-weight:600;background:#F6F1EB;border-radius:999px;padding:.08rem .45rem;font-variant-numeric:tabular-nums}
.rn-facts span.g{background:#FFEFC2;color:#B9761F}
.rn-paid{font-size:.64rem;text-align:center;color:#2E9E6A;font-weight:700;margin-top:.45rem}
.rn-drop{position:absolute;left:50%;top:-30%;transform:translate(-50%,0);font-weight:800;color:#fff;background:#E0475E;border:2px solid #fff;border-radius:999px;padding:.05rem .45rem;white-space:nowrap;font-size:1.1em;box-shadow:0 3px 8px rgba(120,0,30,.45);animation:rnDrop 2.8s ease-out forwards;pointer-events:none;z-index:4}
@keyframes rnDrop{0%{opacity:0;transform:translate(-50%,8px) scale(.6)}12%{opacity:1;transform:translate(-50%,0) scale(1.15)}22%{transform:translate(-50%,0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-14px)}}
.stage.rn-shake{animation:rnShake .45s cubic-bezier(.36,.07,.19,.97)}
@keyframes rnShake{20%{transform:translate(calc(-50% - 4px),-50%)}40%{transform:translate(calc(-50% + 4px),calc(-50% + 2px))}60%{transform:translate(calc(-50% - 3px),-50%)}80%{transform:translate(calc(-50% + 2px),-50%)}}
@media (prefers-reduced-motion:reduce){#rnSky i{animation:none}.stage.rn-shake{animation:none}}`;
const fmt=n=>Math.round(n).toLocaleString('en-US');
const sgn=n=>(n>=0?'+':'−')+fmt(Math.abs(n));
const short=n=>{const a=Math.abs(n),s=n<0?'−':'';return a>=1e6?s+(a/1e6).toFixed(1)+'M':a>=1e3?s+Math.round(a/1e3)+'k':s+Math.round(a);};
const easeOut=t=>1-Math.pow(1-t,3);
export function mountRain(X){
  /* X = {stage,W,H,laneX,boats,boatEls,me,admin,myBoat,team,label,now,act,raw,watch,ann,fx,open,closeAll,img} */
  if(!document.getElementById('rnCss')){const st=document.createElement('style');st.id='rnCss';st.textContent=CSS;document.head.appendChild(st);}
  const el=(tag,id,html)=>{const d=document.createElement(tag);if(id)d.id=id;if(html)d.innerHTML=html;document.body.appendChild(d);return d;};
  const sky=el('div','rnSky','<i></i><i></i><i></i>'),cv=el('canvas','rnFx'),flashEl=el('div','rnFlash'),hurtEl=el('div','rnHurt');
  const hud=el('div','rnHud','<div class="rn-timer" id="rnTimer"><svg viewBox="0 0 36 36"><circle class="trk" cx="18" cy="18" r="15"/><circle class="arc" id="rnTarc" cx="18" cy="18" r="15" stroke-dasharray="94.25" stroke-dashoffset="0"/></svg><span id="rnTval">1:00</span><span class="st" id="rnTst">🌧️</span></div><div class="rn-mys" id="rnMys">✨ +0</div>');
  const comboEl=el('div','rnCombo'),teamsEl=el('div','rnTeams','<h4>📊 พลังทีม</h4><div id="rnTrows"></div>');
  const warnEl=el('div','rnWarn','<div class="ring"><svg viewBox="0 0 36 36"><circle class="trk" cx="18" cy="18" r="15"/><circle class="arc" id="rnWarc" cx="18" cy="18" r="15" stroke-dasharray="94.25" stroke-dashoffset="0"/></svg><b id="rnWnum">15</b></div><div class="wt">⛈️ ฝนกุศลกำลังจะตก<small>เตรียมรับกุศล!</small></div>');
  warnEl.setAttribute('role','status');const resEl=el('div','rnRes');resEl.setAttribute('role','dialog');resEl.setAttribute('aria-label','สรุปฝนกุศล');
  const $=id=>document.getElementById(id),ctx=cv.getContext('2d');
  let DPR=1,CW=0,CH=0,SR={left:0,top:0,width:1,height:1};
  function size(){DPR=Math.min(2,devicePixelRatio||1);CW=innerWidth;CH=innerHeight;cv.width=CW*DPR;cv.height=CH*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}
  size();addEventListener('resize',size);
  const toS=(x,y)=>[SR.left+x/X.W*SR.width,SR.top+y/X.H*SR.height],sc=()=>SR.width/X.W;
  /* ---------- สถานะ ---------- */
  let rain=null,list=[],phase='idle',me=null,taps=[],miss=[],tapTimes=[],fxs=[],texts=[],drops=[],stormOn=false,lastFlash=0,lastPing=0,stops=[],board={},goldTaken={},submitted=new Set(),resShown=new Set(),pinged=0,settledShown=new Set(),pending=false;
  const lv=()=>LEVELS.find(l=>l.lvl===rain?.lvl)||LEVELS[0];
  const keyOf=id=>'rnTaps:'+id,save=()=>{try{sessionStorage.setItem(keyOf(rain.id),JSON.stringify({taps,miss}));}catch(e){}};
  const load=id=>{try{return JSON.parse(sessionStorage.getItem(keyOf(id))||'null');}catch(e){return null;}};
  const inTeam=()=>!X.admin&&!!X.team()[X.me];
  function reset(){me={plus:0,minus:0,pos:0,popped:0,anc:0,misses:0,missPen:0,combo:0,best:0,gold:0};taps=[];miss=[];tapTimes=[];stormOn=false;lastFlash=0;fxs=[];texts=[];drops=[];goldTaken={};board={};}
  const rainDrops=[];for(let i=0;i<180;i++)rainDrops.push({x:Math.random(),y:Math.random(),l:.6+Math.random()*.8,s:.7+Math.random()*.6});
  const elapsed=()=>X.now()-(rain?.start||0);
  function bubbleState(b,e){const a=e-b.t0;if(a<0||a>b.life||b.done)return null;const app=Math.min(1,a/180),fade=a>b.life-300?(b.life-a)/300:1;return {x:b.x+Math.sin(b.ph+a/420)*6,y:b.y-b.vy*a/1000,s:.55+.45*easeOut(app),al:fade*app};}
  function drawBubble(b,x,y,r,al,e){ctx.save();ctx.globalAlpha=al;
    ctx.fillStyle='rgba(0,28,70,.22)';ctx.beginPath();ctx.ellipse(x+r*.25,y+r*1.28,r*.78,r*.24,0,0,6.283);ctx.fill();
    let g;const T=b.type;
    if(T==='gold'){r*=1+Math.sin(e/90)*.06;ctx.save();ctx.translate(x,y);ctx.rotate(e/900);for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.fillStyle='rgba(255,220,110,.28)';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(r*2.3,-r*.18);ctx.lineTo(r*2.3,r*.18);ctx.fill();}ctx.restore();
      ctx.shadowColor='rgba(255,200,60,.95)';ctx.shadowBlur=26;g=ctx.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r);g.addColorStop(0,'#FFF8D8');g.addColorStop(.55,'rgba(255,205,80,.85)');g.addColorStop(1,'rgba(214,140,20,.95)');}
    else if(T==='neg'){g=ctx.createRadialGradient(x-r*.3,y-r*.3,r*.1,x,y,r);g.addColorStop(0,'rgba(120,70,150,.18)');g.addColorStop(.7,'rgba(110,50,140,.38)');g.addColorStop(1,'rgba(200,150,235,.85)');ctx.shadowColor='rgba(150,80,200,.55)';ctx.shadowBlur=10;}
    else if(T==='anchor'){g=ctx.createRadialGradient(x-r*.3,y-r*.3,r*.1,x,y,r);g.addColorStop(0,'rgba(150,175,205,.2)');g.addColorStop(.7,'rgba(70,95,130,.42)');g.addColorStop(1,'rgba(190,210,235,.9)');ctx.shadowColor='rgba(80,110,160,.5)';ctx.shadowBlur=8;}
    else{g=ctx.createRadialGradient(x-r*.3,y-r*.3,r*.1,x,y,r);g.addColorStop(0,'rgba(255,255,255,.06)');g.addColorStop(.68,T==='big'?'rgba(150,225,255,.26)':'rgba(190,240,255,.2)');g.addColorStop(1,'rgba(255,255,255,.86)');ctx.shadowColor=T==='rainbow'?'rgba(255,180,255,.9)':'rgba(170,235,255,.85)';ctx.shadowBlur=T==='rainbow'?20:12;}
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fill();ctx.shadowBlur=0;
    if(T==='rainbow'&&ctx.createConicGradient){const cg=ctx.createConicGradient(e/500,x,y);['#FF8FB1','#FFD36E','#9BF0A8','#8FD8FF','#C9A2FF','#FF8FB1'].forEach((c,i,a)=>cg.addColorStop(i/(a.length-1),c));ctx.strokeStyle=cg;ctx.lineWidth=r*.16;ctx.beginPath();ctx.arc(x,y,r*.9,0,6.283);ctx.stroke();}
    if(T==='small'||T==='big'){ctx.strokeStyle='rgba(255,190,240,.35)';ctx.lineWidth=r*.08;ctx.beginPath();ctx.arc(x,y,r*.9,2.4,3.9);ctx.stroke();ctx.strokeStyle='rgba(160,255,220,.35)';ctx.beginPath();ctx.arc(x,y,r*.9,-.4,1.1);ctx.stroke();}
    if(T==='neg'){ctx.strokeStyle='rgba(60,20,80,.45)';ctx.lineWidth=r*.09;ctx.beginPath();ctx.arc(x+r*.05,y+r*.08,r*.42,0.3,4.6);ctx.stroke();}
    ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.ellipse(x-r*.38,y-r*.42,r*.26,r*.13,-.7,0,6.283);ctx.fill();ctx.beginPath();ctx.arc(x+r*.42,y+r*.38,r*.07,0,6.283);ctx.fill();
    if(T==='anchor'||T==='gold'){ctx.globalAlpha=al*.95;ctx.font=(T==='gold'?r:r*.95)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(T==='gold'?'👑':'⚓',x,y+r*.06);}
    ctx.restore();}
  const addPop=(x,y,r,col)=>{fxs.push({x,y,r,col,t:performance.now()});for(let i=0;i<9;i++){const a=i/9*6.283+Math.random()*.4,sp=1.2+Math.random()*1.4;drops.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,t:performance.now(),col});}};
  const addText=(x,y,txt,col,big)=>texts.push({x,y,txt,col,big,t:performance.now()});
  function flash(){flashEl.classList.remove('go');void flashEl.offsetWidth;flashEl.classList.add('go');X.stage.classList.remove('rn-shake');void X.stage.offsetWidth;X.stage.classList.add('rn-shake');}
  function hurt(){hurtEl.classList.add('on');setTimeout(()=>hurtEl.classList.remove('on'),60);}
  function frame(){requestAnimationFrame(frame);const active=phase!=='idle'||fxs.length||texts.length||drops.length;if(!active)return;
    SR=X.stage.getBoundingClientRect();ctx.clearRect(0,0,CW,CH);const now=performance.now();
    if(phase==='warn'||phase==='rain'||phase==='end'){const n=stormOn?180:phase==='warn'?50:110;ctx.strokeStyle='rgba(200,225,255,.38)';ctx.lineWidth=1.2;ctx.beginPath();
      for(let i=0;i<n;i++){const d=rainDrops[i];d.y+=.012*d.s*(stormOn?1.6:1);if(d.y>1.05){d.y=-.05;d.x=Math.random();}const x=d.x*CW,y=d.y*CH,l=14*d.l*(stormOn?1.4:1);ctx.moveTo(x,y);ctx.lineTo(x-l*.28,y+l);}ctx.stroke();}
    if(phase==='rain'){const e=elapsed(),k=sc();for(const b of list){if(b.t0>e)break;const st=bubbleState(b,e);if(!st)continue;const [x,y]=toS(st.x,st.y);drawBubble(b,x,y,b.r*k*st.s,st.al,e);}}
    fxs=fxs.filter(p=>{const a=(now-p.t)/380;if(a>1)return false;ctx.save();ctx.globalAlpha=1-a;ctx.strokeStyle=p.col;ctx.lineWidth=3*(1-a)+1;ctx.beginPath();ctx.arc(p.x,p.y,p.r*(1+a*.9),0,6.283);ctx.stroke();ctx.restore();return true;});
    drops=drops.filter(d=>{const a=(now-d.t)/520;if(a>1)return false;d.x+=d.vx*2.2;d.y+=d.vy*2.2;d.vy+=.12;ctx.globalAlpha=1-a;ctx.fillStyle=d.col;ctx.beginPath();ctx.arc(d.x,d.y,2.6*(1-a)+.6,0,6.283);ctx.fill();ctx.globalAlpha=1;return true;});
    texts=texts.filter(t=>{const a=(now-t.t)/(t.big?1500:950);if(a>1)return false;ctx.save();ctx.globalAlpha=a<.75?1:(1-a)*4;ctx.font='700 '+(t.big?22:15)+'px Mali,sans-serif';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='rgba(20,30,60,.75)';const y=t.y-28*easeOut(Math.min(1,a*1.4)),s=a<.12?.7+a*2.5:1;ctx.translate(t.x,y);ctx.scale(s,s);ctx.strokeText(t.txt,0,0);ctx.fillStyle=t.col;ctx.fillText(t.txt,0,0);ctx.restore();return true;});
  }
  requestAnimationFrame(frame);
  /* ---------- กดฟอง (กติกาเดียวกับเซิร์ฟเวอร์ ใช้แสดงผลสด) ---------- */
  const m=()=>lv().lvl;
  function missAt(x,y,e,fast){miss.push(Math.round(e));me.misses++;if(fast||me.misses>RAIN_FREE_MISS){const pen=RAIN_MISS*m();me.minus+=pen;me.missPen+=pen;addText(x,y,(fast?'🤖 ':'💦 ')+'−'+fmt(pen),'#FF9AAE');}else addText(x,y,'💦','#CFEFFF');breakCombo();hudUpd();}
  cv.addEventListener('pointerdown',ev=>{if(phase!=='rain'||!inTeam())return;ev.preventDefault();const e=elapsed();
    tapTimes=tapTimes.filter(t=>e-t<1000);tapTimes.push(e);const k=sc();
    let best=null,bd=1e9;for(const b of list){if(b.t0>e)break;const st=bubbleState(b,e);if(!st)continue;const [x,y]=toS(st.x,st.y),d=Math.hypot(ev.clientX-x,ev.clientY-y),rr=b.r*k*st.s+7;if(d<rr&&d<bd){bd=d;best={b,x,y,r:b.r*k*st.s};}}
    if(tapTimes.length>RAIN_RATE){if(best){taps.push([best.b.id,Math.round(e)]);}else miss.push(Math.round(e));me.misses++;const pen=RAIN_MISS*m();me.minus+=pen;me.missPen+=pen;addText(ev.clientX,ev.clientY,'🤖 −'+fmt(pen),'#FF9AAE');breakCombo();hudUpd();save();return;}
    if(!best){missAt(ev.clientX,ev.clientY,e,false);save();return;}
    hit(best.b,best.x,best.y,best.r,e);save();});
  function hit(b,x,y,r,e){const M=m();
    if(b.type==='gold'){b.done=true;addPop(x,y,r*1.4,'#FFD86B');taps.push([b.id,Math.round(e)]);
      X.raw({type:'rainGold',id:rain.id,gid:b.id}).then(o=>{if(o?.ok){me.gold++;const v=b.v*M;me.plus+=v;me.pos++;addText(x,y,'👑 +'+fmt(v),'#FFE08A',true);X.ann('👑 <b>คุณ</b> คว้าฟองทองคำ! +'+fmt(v));flash();hudUpd();}
        else if(o?.by)X.ann('👑 <b>'+esc(o.by)+'</b> (เรือ '+o.boat+') คว้าไปก่อนแล้ว!',1);else addText(x,y,'💨','#CFEFFF');}).catch(()=>addText(x,y,'💨','#CFEFFF'));return;}
    b.done=true;me.popped++;taps.push([b.id,Math.round(e)]);
    if(b.type==='neg'){const v=b.v*M;me.minus+=v;addPop(x,y,r,'#C88BEB');addText(x,y,'−'+fmt(v),'#FF8FA6');hurt();breakCombo();}
    else if(b.type==='anchor'){me.anc++;addPop(x,y,r,'#B8CBE6');addText(x,y,'⚓ เรือ '+X.myBoat()+' −2','#D6E4FF');hurt();breakCombo();}
    else{me.combo++;me.best=Math.max(me.best,me.combo);const mult=me.combo>=20?3:me.combo>=10?2:me.combo>=5?1.5:1,v=Math.round(b.v*M*mult);me.plus+=v;me.pos++;
      addPop(x,y,r,b.type==='rainbow'?'#FFC4F0':'#DFF7FF');addText(x,y,'+'+fmt(v),b.type==='rainbow'?'#FFD9F6':'#FFE89A');comboUI(mult);}
    hudUpd();}
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function comboUI(mult){if(me.combo<2){comboEl.className='';return;}comboEl.textContent='🔥 '+(mult>1?'×'+mult+' · ':'')+me.combo+' คอมโบ';comboEl.className='on';void comboEl.offsetWidth;comboEl.className='on pop';}
  function breakCombo(){if(me.combo>=2){comboEl.className='on broke';setTimeout(()=>{if(me.combo<2)comboEl.className='';},450);}me.combo=0;}
  function hudUpd(){const n=me.plus-me.minus,e=$('rnMys');e.textContent='✨ '+sgn(n);e.classList.toggle('neg',n<0);}
  function teamUI(){const t=[1,2,3,4,5].map(b=>{const s=board[b]||{};return Object.values(s).reduce((a,v)=>a+(Number(v)||0),0);});const mb=X.myBoat();if(mb&&inTeam()){const s=board[mb]||{};t[mb-1]+=me.plus-me.minus-(Number(s[X.me])||0);}
    const mx=Math.max(1,...t),lead=t.indexOf(Math.max(...t));$('rnTrows').innerHTML=t.map((v,i)=>'<div class="rn-trow'+(i+1===mb?' me':'')+(i===lead&&v>0?' lead':'')+'" style="color:'+X.boats[i][2]+'"><img src="'+X.img('b'+(i+1))+'" alt=""><div class="tb"><i style="width:'+Math.max(3,v/mx*100)+'%;background:'+X.boats[i][2]+'"></i></div><span style="color:#fff">'+short(Math.max(0,v))+'</span></div>').join('');}
  /* ---------- ฟังกระดานเฉพาะตอนฝนตก ---------- */
  function listen(){unlisten();stops.push(X.watch('rainLive',v=>{if(!v||v.id!==rain?.id)return;for(const [gid,w] of Object.entries(v.gold||{})){if(goldTaken[gid])continue;goldTaken[gid]=w;const b=list.find(x=>x.id===+gid);if(b&&!b.done){b.done=true;if(phase==='rain'&&w.n!==X.label(X.me)){const st=bubbleState({...b,done:false},elapsed());if(st){const [x,y]=toS(st.x,st.y);addPop(x,y,b.r*sc()*1.4,'#FFD86B');}X.ann('👑 <b>'+esc(w.n)+'</b> (เรือ '+w.b+') คว้าฟองทองคำ!');}}}}));
    for(const b of [1,2,3,4,5])stops.push(X.watch('rainLive-'+b,v=>{if(!v||v.id!==rain?.id)return;board[b]=v.s||{};}));}
  function unlisten(){for(const s of stops)try{s();}catch(e){}stops=[];}
  /* ---------- ลำดับเวลา ---------- */
  function start(){phase='rain';reset();const saved=load(rain.id);if(saved){taps=saved.taps||[];miss=saved.miss||[];}
    cv.classList.toggle('live',inTeam());hud.classList.add('on');teamsEl.classList.add('on');$('rnTst').textContent=lv().e+' '+lv().name;hudUpd();teamUI();listen();
    X.ann(inTeam()?'🌧️ ฝนกุศลตกแล้ว! กดฟองให้ไว':'🌧️ ฝนกุศลตกแล้ว');}
  function stopRain(){phase='end';cv.classList.remove('live');hud.classList.remove('on');teamsEl.classList.remove('on');comboEl.className='';$('rnTimer').classList.remove('storm');unlisten();
    setTimeout(()=>{if(phase==='end')phase='idle';sky.classList.remove('on');},6000);
    if(inTeam())submit();}
  async function submit(tries=0){if(!rain||submitted.has(rain.id)||pending)return;const id=rain.id,R=X.race();if(R.rainRes?.[X.me]){submitted.add(id);return;}
    pending=true;await new Promise(r=>setTimeout(r,tries?3000*tries+Math.random()*3000:800+Math.random()*20000));/* กระจายเวลาส่ง ลดการชนกันของรายการ */
    try{const out=await X.act({type:'rainEnd',id,taps:taps.slice(0,1500),miss:miss.slice(0,1500)});
      if(out&&!out.error&&out.rain){submitted.add(id);try{sessionStorage.removeItem(keyOf(id));}catch(e){}showResult(out.rain,id);}
      else if(out?.error&&/จบไปแล้ว|ช้าเกินไป|ไม่ได้ร่วม/.test(out.error)){submitted.add(id);}
      else if(tries<6){pending=false;return submit(tries+1);}}
    finally{pending=false;}}
  function showResult(s,id){if(resShown.has(id))return;resShown.add(id);const net=s.net||0,L=lv();
    resEl.innerHTML='<div class="hd"><div class="e">🌧️</div><h3>ฝนกุศลจบแล้ว!</h3><span class="lv">'+L.e+' '+L.name+' ×'+L.lvl+'</span></div>'+
      '<div class="rn-sec"><h5>👤 ของคุณ</h5><div class="rn-tiles"><div class="rn-tile p"><small>➕ ได้</small><b>'+fmt(s.plus||0)+'</b></div><div class="rn-tile m"><small>➖ เสีย</small><b>'+fmt(s.minus||0)+'</b></div><div class="rn-tile n'+(net<0?' neg':'')+'"><small>✨ สุทธิ</small><b>'+sgn(net)+'</b></div></div>'+
      '<div class="rn-facts"><span>🫧 ฟองบวก '+(s.pos||0)+' ลูก</span><span>🔥 คอมโบสูงสุด '+(s.best||0)+'</span>'+(s.missPen?'<span>💦 จิ้มพลาด −'+fmt(s.missPen)+'</span>':'')+(s.gold?'<span class="g">👑 ฟองทองคำ ×'+s.gold+'</span>':'')+(s.anc?'<span>⚓ เรือ '+X.myBoat()+' −'+s.anc*2+'</span>':'')+'</div>'+
      ((s.pos||0)<3?'<div class="rn-facts"><span style="background:#FFEFF2;color:#E0475E">กดฟองบวกไม่ถึง 3 ลูก ไม่นับว่าช่วยทีม</span></div>':'')+'</div>'+
      '<div class="rn-sec"><h5>🚤 ทีม</h5><div class="rn-facts"><span>👥 ทีมต้องมีอย่างน้อย 3 คนที่กดฟองบวก ≥3 ลูก</span><span>⏳ สรุปทีมหลังฝนหยุด</span></div></div>'+
      '<div class="rn-paid">✅ กุศลเข้ากระเป๋าแล้ว ไม่ต้องไปรับที่ไปรษณีย์</div><button class="rn-big gold" id="rnOk">✨ รับทราบ</button>';
    resEl.classList.add('on');$('rnOk').onclick=()=>{resEl.classList.remove('on');if(net>0)X.fx('coins',X.W/2,X.H*.45,24);};}
  function warnTick(){const left=Math.max(0,Math.ceil((rain.start-X.now())/1000));$('rnWnum').textContent=left;$('rnWarc').style.strokeDashoffset=94.25*(1-left/15);}
  function rainTick(){const e=elapsed(),left=Math.max(0,RAIN_MS-e),s=Math.ceil(left/1000);$('rnTval').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');$('rnTarc').style.strokeDashoffset=94.25*(1-left/RAIN_MS);
    if(!stormOn&&left<=RAIN_STORM){stormOn=true;$('rnTimer').classList.add('storm');$('rnTst').textContent='⛈️ พายุ ×2';X.ann('⛈️ พายุเข้า! 15 วิสุดท้าย ค่าฟอง ×2');flash();}
    if(stormOn&&e-lastFlash>2200+Math.random()*1500){lastFlash=e;flash();}
    if(inTeam()&&Date.now()-lastPing>5000){lastPing=Date.now();X.raw({type:'rainPing',id:rain.id,net:me.plus-me.minus}).catch(()=>{});}
    if(Date.now()-pinged>2500){pinged=Date.now();teamUI();}}
  /* หน้าเรือเรียกทุกครั้งที่ข้อมูลการแข่งเปลี่ยน + ทุก 250ms ระหว่างฝน */
  function update(R){const r=R.rain&&R.status!=='setup'?R.rain:null,now=X.now();
    if(r&&(!rain||rain.id!==r.id)){rain=r;list=rainGeom(r.seed,rainLogic(r.seed),X.laneX);phase='idle';reset();}
    if(!r){if(phase!=='idle'){phase='idle';cv.classList.remove('live');hud.classList.remove('on');teamsEl.classList.remove('on');warnEl.classList.remove('on');sky.classList.remove('on');unlisten();}rain=null;return;}
    rain=r;
    // ทีมที่ถอยหลังจากการตัดสิน
    if(r.done&&Array.isArray(r.back)&&!settledShown.has(r.id)){settledShown.add(r.id);if(now<r.end+RAIN_SETTLE+120000){for(const b of r.back){const d=document.createElement('span');d.className='rn-drop';d.textContent='⬇️ −10';X.boatEls[b-1]?.appendChild(d);setTimeout(()=>d.remove(),3000);}
      if(r.back.length)X.fx('banner','stop','⛈️ ฝนกุศลจบ · เรือ <b>'+r.back.join(', ')+'</b> ช่วยกันไม่ถึง 3 คน<small>ถอย −10</small>');else X.fx('banner','merit','⛈️ ฝนกุศลจบ · ทุกเรือช่วยกันครบ 👏');}}
    if(now<r.start){if(phase!=='warn'){phase='warn';sky.classList.add('on');warnEl.classList.add('on');}warnTick();return;}
    if(phase==='warn')warnEl.classList.remove('on');
    if(now<r.end){if(phase!=='rain'){sky.classList.add('on');start();}rainTick();return;}
    if(phase==='rain')stopRain();
    // เปิดหน้าใหม่หลังฝนหยุด: ส่งผลที่ค้าง (ฟองทองที่ได้แล้วต้องไม่หาย)
    if(inTeam()&&!submitted.has(r.id)&&!R.rainRes?.[X.me]&&now<r.end+10*60000&&!pending){const saved=load(r.id);if(saved){taps=saved.taps||[];miss=saved.miss||[];}submit();}
  }
  /* ---------- แอดมิน: เรียกฝน ---------- */
  function openAdmin(){let pick=LEVELS[2];const render=()=>{X.open('<h3>🌧️ ฝนกุศล</h3><div class="hint">🔒 เห็นเฉพาะบัญชีแอดมิน · รอบละ 1 นาที · เตือนทุกคน 15 วินาที</div><div class="rn-lvls">'+LEVELS.map(l=>'<button class="rn-lvl" data-l="'+l.lvl+'" aria-pressed="'+(l===pick)+'"><span class="e">'+l.e+'</span><div><b>'+l.name+' ×'+l.lvl+'</b><small>ฟองบวก '+short(3000*l.lvl)+'–'+short(10000*l.lvl)+' · ฟองลบ '+short(1000*l.lvl)+'–'+short(5000*l.lvl)+'</small></div><span>'+l.est+'</span></button>').join('')+'</div>'+
      '<div class="rn-rules"><span>🫧 ➕ 3k–10k</span><span>🟣 ➖ 1k–5k</span><span>⚓ เรือทีมตัวเอง −2</span><span>👑 ฟองทอง 6–8 ลูก (แย่งกัน)</span><span>🔥 คอมโบ ×1.5/×2/×3</span><span>⛈️ 15 วิสุดท้าย ×2</span><span>👥 ทีมกดไม่ถึง 3 คน = เรือ −10</span></div><button class="rn-big" id="rnCall">🌧️ เรียกฝนกุศล</button>');
    document.querySelectorAll('.rn-lvl').forEach(b=>b.onclick=()=>{pick=LEVELS.find(l=>l.lvl===+b.dataset.l);render();});
    document.getElementById('rnCall').onclick=async e=>{e.currentTarget.disabled=true;const out=await X.act({type:'rainCall',lvl:pick.lvl});if(out&&!out.error){X.closeAll();X.ann('⛈️ เรียกฝนกุศลแล้ว! เตือนทุกคน 15 วินาที');}else e.currentTarget.disabled=false;};};render();}
  return {update,openAdmin,active:()=>!!rain&&phase!=='idle'};
}
