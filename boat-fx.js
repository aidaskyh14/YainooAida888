/* เอฟเฟกต์ฉากแข่งเรือ (fix13) — CSS + canvas เดียว ไม่ใช้รูปใหม่ ไม่เขียนข้อมูลใดๆ
   - BoatFX.events(prev,next): เทียบสถานะเรือสองชุด (ข้อมูลที่ทุกคนได้รับอยู่แล้วจาก world/boat) → รายการเหตุการณ์
   - BoatFX.mount(stage,{W,H}): ติดเลเยอร์เอฟเฟกต์ · ลูปวาดทำงานเฉพาะตอนมีอนุภาค (ไม่กินแบตตอนนิ่ง)
   - ลดเอฟเฟกต์เองเมื่อเครื่องกระตุก (FPS ต่ำ) และเมื่อผู้ใช้ตั้ง prefers-reduced-motion */
(function(root){
'use strict';
const AURA={supply:'#4FE08A',cut:'#FF5A5A',merit:'#FFD24A',stop:'#5BC8FF',kick:'#FF4D7A',pull:'#9B6BFF',swap:'#FF8AD0',revive:'#7FFFE0',ink:'#8A6AC8',freeze:'#9FE3FF',crab:'#FF7A45'};
const CARD_LABEL={supply:'เติมเสบียง +10',cut:'ตัดเสบียง −10',merit:'กุศลทั้งทีม',stop:'หยุดเรือ 30 นาที',kick:'การ์ดเตะ',pull:'ดึงตัว',swap:'สลับตัว',revive:'ชุบชีวิต',ink:'พ่นหมึก',freeze:'แช่แข็ง',crab:'ปูหนีบ'};
const CARD_ICON={supply:'🍱',cut:'🎃',merit:'🪙',stop:'🧊',kick:'🦶',pull:'🏴‍☠️',swap:'🔄',revive:'💫',ink:'🐙',freeze:'🧊',crab:'🦀'};

/* ---------- เหตุการณ์จากการเทียบข้อมูล (ฟังก์ชันล้วน ทดสอบได้ใน node) ---------- */
function events(prev,next){
  const out=[];if(!prev||!next)return out;
  const pb=new Map((prev.boxes||[]).map(b=>[b.id,b]));
  const delta=[0,0,0,0,0].map((_,i)=>((next.p||[])[i]||0)-((prev.p||[])[i]||0));
  for(const box of next.boxes||[]){
    const before=pb.get(box.id);
    if(!before){out.push({type:'box',boat:box.boat,line:box.line,id:box.id});}
    const wasPicked=before&&before.picked!==undefined,wasOpened=before&&before.opened;
    if(before&&!wasPicked&&box.picked!==undefined&&box.card)out.push({type:'pick',boat:box.boat,card:box.card,by:box.pickedBy||null,id:box.id,used:!!box.opened});
    if(before&&!wasOpened&&box.opened&&box.card){
      const e={type:'card',card:box.card,boat:box.boat,id:box.id,target:box.target??null,victims:[...(box.victims||[])],meritTo:[...(box.meritTo||[])],pulled:box.pulled??null,fired:box.fired??null,from:box.from??null,swap:box.swap?[...box.swap]:null,revived:box.revived??null,full:!!box.full,frozen:box.frozen??null};
      if(box.card==='supply')delta[box.boat-1]-=10;
      if(box.card==='cut'&&Number.isInteger(box.target))delta[box.target-1]+=10;
      out.push(e);
    }
  }
  delta.forEach((d,i)=>{if(d>0&&d<10)out.push({type:'supply',boat:i+1,n:d});});
  if(prev.status!=='finished'&&next.status==='finished'&&next.winner)out.push({type:'finish',boat:next.winner});
  return out;
}

/* ---------- คุณภาพ ---------- */
const mm=q=>{try{return !!(root.matchMedia&&root.matchMedia(q).matches);}catch(e){return false;}};
const Q={reduced:mm('(prefers-reduced-motion: reduce)'),low:false,scale(n){return Math.max(1,Math.round(n*(this.reduced?.35:1)*(this.low?.45:1)));}};

/* ---------- เลเยอร์ ---------- */
let stage=null,W=941,H=1672,cv=null,cx=null,parts=[],raf=0,last=0,slow=0,frames=0,dpr=1;
function mount(el,size){
  stage=el;W=size?.W||W;H=size?.H||H;
  if(!root.document)return;
  if(!cv){cv=document.createElement('canvas');cv.className='fxc';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);cx=cv.getContext&&cv.getContext('2d');}
  if(Q.reduced)document.body.classList.add('fx-reduced');
}
function size(){if(!cv)return;dpr=Math.min(Q.low?1:1.75,root.devicePixelRatio||1);const w=Math.round(innerWidth*dpr),h=Math.round(innerHeight*dpr);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}}
/* พิกัดฉาก (941×1672) → พิกัดหน้าจอ */
function toScreen(x,y){if(!stage||!stage.getBoundingClientRect)return {x:0,y:0,s:1};const r=stage.getBoundingClientRect();return {x:r.left+x/W*r.width,y:r.top+y/H*r.height,s:r.width/W};}
function add(p){if(!cx)return;if(parts.length>(Q.low?160:420))parts.splice(0,parts.length-(Q.low?120:360));parts.push(p);if(!raf){last=0;raf=requestAnimationFrame(tick);}}
function tick(t){
  raf=0;if(!cx)return;const dt=last?Math.min(50,t-last):16;last=t;
  // ตรวจเครื่องกระตุก: เฟรมเฉลี่ยช้ากว่า ~30fps ต่อเนื่อง → ลดเอฟเฟกต์ถาวรในหน้านี้
  frames++;if(dt>34)slow++;if(frames>=45){if(slow>22&&!Q.low){Q.low=true;document.body.classList.add('fx-low');}frames=0;slow=0;}
  size();cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,innerWidth,innerHeight);
  const k=dt/16.67;
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.life+=dt;if(p.life>=p.max){if(p.burst)p.burst(p);parts.splice(i,1);continue;}
    p.vy+=(p.g||0)*k;p.vx*=p.drag??1;p.vy*=p.drag??1;p.x+=p.vx*k;p.y+=p.vy*k;draw(p);}
  if(parts.length)raf=requestAnimationFrame(tick);else cx.clearRect(0,0,innerWidth,innerHeight);
}
function draw(p){
  const a=1-p.life/p.max,c=cx;c.globalAlpha=Math.max(0,Math.min(1,p.fade===false?1:a*1.4));
  if(p.kind==='dot'){c.fillStyle=p.color;c.beginPath();c.arc(p.x,p.y,p.r*(p.shrink?a:1)+.3,0,6.283);c.fill();}
  else if(p.kind==='ring'){const r=p.r+(p.R-p.r)*(1-a);c.strokeStyle=p.color;c.lineWidth=p.w*a+.5;c.beginPath();c.ellipse(p.x,p.y,r,r*(p.flat||1),0,0,6.283);c.stroke();}
  else if(p.kind==='spark'){const s=p.r*(.6+.4*Math.sin(p.life/60));c.strokeStyle=p.color;c.lineWidth=1.6;c.beginPath();c.moveTo(p.x-s,p.y);c.lineTo(p.x+s,p.y);c.moveTo(p.x,p.y-s);c.lineTo(p.x,p.y+s);c.stroke();}
  else if(p.kind==='coin'){const w=Math.abs(Math.cos(p.life/90+p.ph))*p.r+.6;c.fillStyle='#E9A21B';c.beginPath();c.ellipse(p.x,p.y,w,p.r,0,0,6.283);c.fill();c.fillStyle='#FFE27A';c.beginPath();c.ellipse(p.x,p.y,w*.68,p.r*.68,0,0,6.283);c.fill();}
  else if(p.kind==='streak'){c.strokeStyle=p.color;c.lineWidth=p.w||2;c.lineCap='round';c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx*3,p.y-p.vy*3);c.stroke();}
  c.globalAlpha=1;
}
const rnd=(a,b)=>a+Math.random()*(b-a);

/* ---------- อนุภาค (พิกัดฉาก) ---------- */
function splash(x,y,n=14,col){const s=toScreen(x,y),sc=Math.max(1,s.s*3.2);n=Q.scale(n);
  for(let i=0;i<n;i++){const a=rnd(-Math.PI*.95,-Math.PI*.05),v=rnd(1.2,3.6)*sc;add({kind:'dot',x:s.x+rnd(-6,6)*sc,y:s.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:.16*sc,r:rnd(1.4,3.2)*sc,color:col||(i%3?'#E8F8FF':'#9ADCF5'),life:0,max:rnd(500,850),shrink:true});}
  add({kind:'ring',x:s.x,y:s.y+2*sc,vx:0,vy:0,r:4*sc,R:26*sc,w:2.4,flat:.38,color:'rgba(255,255,255,.85)',life:0,max:700});}
function sparkles(x,y,n=12,col='#FFF3B0',spread=40){const s=toScreen(x,y),sc=Math.max(1,s.s*3.2);n=Q.scale(n);
  for(let i=0;i<n;i++){const a=rnd(0,6.283),v=rnd(.4,2)*sc;add({kind:i%2?'spark':'dot',x:s.x+Math.cos(a)*rnd(0,spread)*s.s,y:s.y+Math.sin(a)*rnd(0,spread)*s.s,vx:Math.cos(a)*v,vy:Math.sin(a)*v-.3,g:0,drag:.97,r:rnd(1.5,4)*sc,color:col,life:0,max:rnd(600,1100)});}}
function explode(x,y,cols=['#FF8A1F','#FFC93C','#3A2A1A','#FF5A3C'],n=34){const s=toScreen(x,y),sc=Math.max(1,s.s*3.2);n=Q.scale(n);
  for(let i=0;i<n;i++){const a=rnd(0,6.283),v=rnd(1.5,5)*sc;add({kind:'dot',x:s.x,y:s.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,g:.12*sc,drag:.96,r:rnd(1.5,4.5)*sc,color:cols[i%cols.length],life:0,max:rnd(500,1000),shrink:true});}
  add({kind:'ring',x:s.x,y:s.y,vx:0,vy:0,r:6*sc,R:60*sc,w:5,color:'rgba(255,200,90,.9)',life:0,max:520});}
function coins(x,y,n=26){const s=toScreen(x,y),sc=Math.max(1,s.s*3.2);n=Q.scale(n);
  for(let i=0;i<n;i++)setTimeout(()=>add({kind:'coin',x:s.x+rnd(-55,55)*sc,y:s.y-rnd(60,140)*sc,vx:rnd(-.4,.4),vy:rnd(.5,1.5),g:.09*sc,r:rnd(3.5,5.5)*sc,ph:rnd(0,3),life:0,max:rnd(900,1300)}),i*28);
  setTimeout(()=>sparkles(x,y,10,'#FFE27A',60),400);}
function streaks(x,y,col='#E8FFF2',n=10){const s=toScreen(x,y),sc=Math.max(1,s.s*3.2);n=Q.scale(n);
  for(let i=0;i<n;i++)add({kind:'streak',x:s.x+rnd(-26,26)*sc,y:s.y+rnd(10,40)*sc,vx:0,vy:rnd(2,4)*sc,g:0,w:rnd(1.2,2.6),color:col,life:0,max:rnd(350,600)});}
function snow(x,y,n=12){sparkles(x,y,n,'#DDF4FF',50);}
function firework(sx,sy){ // พิกัดหน้าจอ
  const cols=[['#FFD86B','#FFF3B0'],['#F39AB2','#FFE1EA'],['#6CC9A8','#D9FFF0'],['#5BB6D4','#E0F6FF'],['#B58CE0','#F1E6FF']][Math.floor(rnd(0,5))];
  const ty=sy,startY=innerHeight+10;
  add({kind:'dot',x:sx+rnd(-20,20),y:startY,vx:0,vy:-(startY-ty)/38,g:0,r:2.4,color:'#FFF6D0',life:0,max:620,fade:false,burst:p=>{const n=Q.scale(46);for(let i=0;i<n;i++){const a=i/n*6.283,v=rnd(2.2,4.2);add({kind:i%4?'dot':'spark',x:p.x,y:p.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:.045,drag:.975,r:rnd(1.6,3),color:cols[i%2],life:0,max:rnd(1000,1500)});}
    add({kind:'ring',x:p.x,y:p.y,vx:0,vy:0,r:4,R:70,w:3,color:'rgba(255,255,255,.7)',life:0,max:500});}});
}

/* ---------- DOM ในฉาก (เปอร์เซ็นต์ เลื่อนตามขนาดจอ) ---------- */
const pct=(v,t)=>v/t*100+'%';
function el(cls,html,x,y,parent){const d=document.createElement('div');d.className=cls;if(html!=null)d.innerHTML=html;if(x!=null){d.style.left=pct(x,W);d.style.top=pct(y,H);}(parent||stage).appendChild(d);return d;}
const later=(fn,ms)=>setTimeout(fn,ms);
function floatText(x,y,txt,col){if(!stage)return;const d=el('fxf',txt,x,y);d.style.color=col||'#fff';later(()=>d.remove(),1500);}
function boatClass(boatEl,cls,ms){if(!boatEl)return;boatEl.classList.remove(cls);void boatEl.offsetWidth;boatEl.classList.add(cls);later(()=>boatEl.classList.remove(cls),ms);}
function lineGlow(lineEl){if(!lineEl)return;lineEl.classList.remove('glow');void lineEl.offsetWidth;lineEl.classList.add('glow');later(()=>lineEl.classList.remove('glow'),2200);}
function pumpkin(x,y,done){if(!stage)return done&&done();const d=el('fxpk','🎃',x,y);later(()=>{d.remove();explode(x,y);done&&done();},Q.reduced?60:720);}
function iceRing(x,y){if(!stage)return;const d=el('fxice','<i></i>',x,y);snow(x,y);later(()=>d.remove(),2400);}
/* หน่วย em ในฉาก = 18 หน่วยฉาก (stage.fontSize ตั้งใน fit()) จึงเลื่อนตามขนาดจอเสมอ */
function nameFly(x,y,name,dir){if(!stage)return;const d=el('fxname','❌ '+name,x,y);
  const lx=Math.max(230,Math.min(W-230,x+dir*rnd(50,110))),ly=Math.min(H-120,y+rnd(130,190));d.style.setProperty('--tx',(lx-x)/18+'em');d.style.setProperty('--ty',(ly-y)/18+'em');d.style.setProperty('--rot',dir*rnd(60,130)+'deg');
  later(()=>{d.remove();splash(lx,ly,16);floatText(lx,ly-30,'💦','#fff');},Q.reduced?80:1150);}
function banner(card,html){
  if(!root.document)return;let host=document.getElementById('fxBanners');if(!host){host=document.createElement('div');host.id='fxBanners';document.body.appendChild(host);}
  const b=document.createElement('div');b.className='fxb';b.style.setProperty('--aura',AURA[card]||'#FFD86B');b.innerHTML='<span class="ic">'+(CARD_ICON[card]||'🎴')+'</span><span class="tx">'+html+'</span>';
  host.appendChild(b);while(host.children.length>3)host.firstChild.remove();
  later(()=>b.classList.add('out'),3400);later(()=>b.remove(),3900);
}
function trophy(html){if(!root.document)return;const d=document.createElement('div');d.className='fxtrophy';d.innerHTML='<b>🏆</b><span>'+html+'</span>';document.body.appendChild(d);later(()=>d.classList.add('out'),4200);later(()=>d.remove(),4800);}
function spotlight(x,y){if(!root.document)return;const s=toScreen(x,y),d=document.createElement('div');d.className='fxspot';d.style.setProperty('--sx',s.x+'px');d.style.setProperty('--sy',s.y+'px');document.body.appendChild(d);later(()=>d.classList.add('out'),4300);later(()=>d.remove(),5200);}
function finale(x,y){
  spotlight(x,y);const n=Q.reduced?2:Q.low?5:9;
  for(let i=0;i<n;i++)later(()=>firework(rnd(.12,.88)*innerWidth,rnd(.12,.42)*innerHeight),i*380);
  later(()=>sparkles(x,y,20,'#FFE27A',70),300);
}
/* ป๊อปอัปเปิดกล่อง: ประกายพุ่งออกจากกลางกล่อง (DOM 14 ชิ้น) */
function burstIn(container,col){if(!container)return;const n=Q.reduced?4:Q.low?8:14;for(let i=0;i<n;i++){const s=document.createElement('i');s.className='fxsp';const a=i/n*6.283+rnd(-.2,.2),r=rnd(70,140);s.style.setProperty('--x',Math.cos(a)*r+'px');s.style.setProperty('--y',Math.sin(a)*r+'px');s.style.background=col||'#FFF3B0';s.style.animationDelay=rnd(0,.12)+'s';container.appendChild(s);later(()=>s.remove(),1100);}}

root.BoatFX={AURA,CARD_LABEL,CARD_ICON,Q,events,mount,splash,sparkles,explode,coins,streaks,snow,firework,finale,floatText,boatClass,lineGlow,pumpkin,iceRing,nameFly,banner,trophy,spotlight,burstIn,toScreen};
})(typeof window!=='undefined'?window:globalThis);
