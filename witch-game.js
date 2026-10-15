/* แม่มดซิ่งไม้กวาด — หน้าเกมเต็มจอ (เปิดใน iframe จากหน้ามินิเกม) · กติกา/คะแนนอยู่ใน witch-engine.js (ใช้ร่วมกับเซิร์ฟเวอร์) */
import {WITCH,witchScore,witchStreams} from './witch-engine.js?v=ss3-fix15';
import {mgFrame} from './mg-frame.js?v=ss3-fix15';
(()=>{
const IMG={};['bat','batstill','bg1','bg2','bg3','bg4','bg5','bubble','candy','comet','corn','crash','gate','lose','magnet','meteor','moon','poster','pumpkin','shield','star','storm','win','witch'].forEach(k=>IMG[k]='images/wg-'+k+'.webp');
const isImg=s=>typeof s==='string'&&s.startsWith('images/');
const $=id=>document.getElementById(id);
const cv=$('c'),cx=cv.getContext('2d');
const fmt=n=>Math.round(n).toLocaleString('en-US');
const sgn=n=>(n>0?'+':n<0?'−':'')+fmt(Math.abs(n));
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
const I={};let loaded=0;const names=Object.keys(IMG);
names.forEach(k=>{const im=new Image();im.onload=im.onerror=()=>{if(++loaded===names.length)ready();};im.src=IMG[k];I[k]=im;});
let FR=null;

/* ---------- กติกา (ตัวเลขจาก witch-engine.js) ---------- */
const {GOAL,MIN_LINE}=WITCH;
const ZONES=[
 {n:'กาแล็กซีม่วงทอง',bg:'bg1',rate:.8,mix:{meteor:5,bat:4},col:'#c08bff'},
 {n:'เมฆพายุ',bg:'bg2',rate:1.1,mix:{meteor:4,bat:3,storm:4},col:'#5fe3ff'},
 {n:'ดงฟักทอง',bg:'bg3',rate:1.4,mix:{meteor:3,bat:3,storm:2,pumpkin:4},col:'#ffae3c'},
 {n:'ฝนดาวตก',bg:'bg4',rate:1.7,mix:{meteor:4,bat:2,storm:2,pumpkin:2,comet:4},col:'#ff4fa0'},
 {n:'ประตูพระจันทร์',bg:'bg5',rate:2,mix:{meteor:3,bat:2,storm:2,pumpkin:3,comet:3},col:'#dfe7ff'}].map((z,i)=>({...WITCH.ZONES[i],...z}));
const OB={
 meteor:{img:'meteor',name:'อุกกาบาต',size:.30,hw:.17,pen:2000,col:'#ff8a3d',fx:'ชนแรง จอสั่นหนัก'},
 bat:{img:'bat',name:'ค้างคาว',size:.34,hw:.17,pen:1500,col:'#c06bff',fx:'ขโมยดาว 5 ดวง'},
 storm:{img:'storm',name:'เมฆพายุ',size:.34,hw:.19,pen:1500,col:'#9f7bff',fx:'จอมัว + เลี้ยวกลับด้าน 3 วิ'},
 pumpkin:{img:'pumpkin',name:'ฟักทองผี',size:.32,hw:.16,pen:2500,blast:.34,col:'#ffb13b',fx:'ระเบิดเป็นวง ต้องหลบให้ห่าง'},
 comet:{img:'comet',name:'ดาวหาง',size:.30,hw:.15,pen:3000,fast:1.9,col:'#7ad7ff',fx:'พุ่งเร็ว มีลูกศรเตือน'}};
const IT={
 star:{img:'star',name:'ดาวทอง',size:.15,pts:200,col:'#ffd76a'},
 candy:{img:'candy',name:'ลูกกวาด',size:.19,pts:500,col:'#ff9a4d'},
 corn:{img:'corn',name:'ข้าวโพดลูกกวาด',size:.18,pts:500,col:'#ffc04d'},
 moon:{img:'moon',name:'เศษพระจันทร์',size:.22,pts:3000,col:'#9fe0ff'},
 shield:{img:'shield',name:'โล่เวทมนตร์',size:.2,col:'#c79bff'},
 magnet:{img:'magnet',name:'แม่เหล็กดูดดาว',size:.2,col:'#ff8bd8'},
 gold:{img:'comet',name:'ดาวหางทอง',size:.28,pts:30000,col:'#ffd27a'}};
const {ITEM_CAP,PAUSE_BUDGET}=WITCH;
for(const k in OB)OB[k].pen=WITCH.PEN[k];
for(const k of ['star','candy','corn','moon'])IT[k].pts=WITCH.PTS[k];
const scoreOf=s=>witchScore({d:s.d,c:s.c,pen:s.pen,gold:s.gold});
/* สุ่มเกม: ทุกอย่างที่มีผลต่อการเล่นมาจาก round.seed (ST) · Math.random ใช้แค่ของตกแต่ง (ประกาย ดาวพื้นหลัง ฯลฯ) */
let ST=witchStreams('idle');const R=(r,a,b)=>a+r()*(b-a);

/* ---------- จอ ---------- */
let W=0,H=0,U=0,DPR=1,HX=0,HY=0,WY=0,LW=0,F=12,ZMAX=100,Q=1;
function fit(){DPR=Math.min(devicePixelRatio||1,Q?2:1.25);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;U=Math.min(W,H*.56);HX=W/2;HY=H*.47;WY=H*.79;LW=U*.44;}
addEventListener('resize',fit);fit();

/* ---------- ควบคุม ---------- */
let gamma=null,g0=null,tiltOK=false,target=0,keys=0,touching=false,mode='touch';
function onTilt(e){if(e.gamma==null)return;gamma=e.gamma;if(g0==null)g0=gamma;tiltOK=true;}
async function askTilt(){
 try{if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function'){const r=await DeviceOrientationEvent.requestPermission();if(r!=='granted')return false;}}catch(e){return false;}
 addEventListener('deviceorientation',onTilt);return true;}
cv.addEventListener('pointerdown',e=>{touching=true;touchX(e);});
addEventListener('pointermove',e=>{if(touching||e.pointerType==='mouse')touchX(e);});
addEventListener('pointerup',()=>{touching=false;});
function touchX(e){if(!S||!S.run)return;target=clamp((e.clientX-HX)/(LW*.7),-1,1);lastTouch=performance.now();}
let lastTouch=0;
addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='a')keys=-1;if(e.key==='ArrowRight'||e.key==='d')keys=1;if(e.key==='p'||e.key==='Escape')pauseGame();});
addEventListener('keyup',e=>{if(['ArrowLeft','ArrowRight','a','d'].includes(e.key))keys=0;});

/* ---------- สถานะ ---------- */
let S=null,best=0;try{best=+localStorage.getItem('witch-best')||0;}catch(e){}
function newRun(round){
 ST=witchStreams(round?round.seed:'idle');const z=ZONES[0];
 S={curve:0,cv:null,nextCurve:R(ST.curve,6,10),run:false,t:0,d:0,v:z.v0,px:0,lean:0,hearts:WITCH.HEARTS,c:{star:0,candy:0,corn:0,moon:0},hits:{},pen:0,gold:false,
  obj:[],part:[],float:[],booms:[],spawnT:0,itemT:WITCH.ITEM_FIRST,starRow:null,nextMoon:ST.moonFirst(),nextShield:R(ST.pow,35,55),nextMagnet:R(ST.pow,30,45),
  goldAt:round&&round.goldAt>0?round.goldAt:-1,zone:0,trans:0,transFrom:null,quiet:0,
  inv:0,shield:false,magnet:0,reverse:0,blur:0,hitAnim:0,shake:0,flash:0,flashCol:'#fff',passedLine:false,
  paused:0,pauseUsed:0,ended:false,endT:0,gateT:0,frame:0,cpI:0,round:round||null,done:false};
 stars.length=0;for(let i=0;i<(Q?150:70);i++)stars.push(newStar(true));
}
const snap=()=>({d:Math.round(S.d*100)/100,t:Math.round(S.t*1000)/1000,c:{...S.c},hits:{...S.hits},gold:!!S.gold});
const stars=[];
function newStar(any){return {x:rnd(-1,1),y:rnd(-1,1),z:any?rnd(4,ZMAX):ZMAX,c:Math.random()<.2?'#ffd9a0':Math.random()<.5?'#d7c4ff':'#ffffff'};}
const zoneAt=d=>{let i=0;for(let k=0;k<ZONES.length;k++)if(d>=ZONES[k].from)i=k;return i;};

/* ---------- เกิดของ ---------- */
function spawnOb(kind,x,extra){S.obj.push({k:kind,ob:true,x,z:ZMAX,rot:rnd(0,6),spin:rnd(-1.5,1.5),ph:rnd(0,6),hit:false,...extra});}
function spawnItem(kind,x,z=ZMAX){S.obj.push({k:kind,ob:false,x,z,ph:rnd(0,6),hit:false});}
function spawnAny(k,x){if(k==='comet'){const side=ST.ob()<.5?-1:1;spawnOb('comet',side*1.6,{tx:clamp(x,-.95,.95),sx:side*1.6,warn:true});}else spawnOb(k,x);}
function weighted(mix){let tot=0;for(const k in mix)tot+=mix[k];let r=ST.ob()*tot;for(const k in mix){r-=mix[k];if(r<0)return k;}return 'meteor';}
function spawnLogic(dt){
 const z=ZONES[S.zone],prog=(S.d-z.from)/(z.to-z.from);
 if(S.quiet>0){S.quiet-=dt;return;}
 S.spawnT-=dt;
 if(S.spawnT<=0){
  const O=ST.ob,rate=z.rate*(1+.45*prog);S.spawnT=1/rate*R(O,.75,1.25);
  if(S.zone===4&&O()<.28){ // กำแพงอุปสรรค เว้นช่องหลบ
   const gap=R(O,-.7,.7),n=4;for(let i=0;i<n;i++){const x=-1+i*(2/(n-1));if(Math.abs(x-gap)>.42)spawnAny(weighted(z.mix),x+R(O,-.05,.05));}
  }else{
   const k=weighted(z.mix);
   if(k==='comet'){const side=O()<.5?-1:1,tx=clamp(S.px+R(O,-.35,.35),-.95,.95);spawnOb('comet',side*1.6,{tx,sx:side*1.6,warn:true});}
   else spawnOb(k,S.cv&&O()<.75?-Math.sign(S.curve||1)*R(O,.35,.95):R(O,-.95,.95));
   if(S.zone>=1&&O()<.18+.1*S.zone){let x2,g=0;do{x2=R(O,-.95,.95);}while(Math.abs(x2-S.obj.at(-1).x)<.55&&++g<50);spawnAny(weighted(z.mix),x2);}
  }
 }
 // ดาวเรียงเป็นแนวโค้ง
 S.itemT-=dt;
 if(S.itemT<=0){const g=ST.item();S.itemT=g.gap;for(let i=0;i<g.n;i++)spawnItem('star',clamp(g.x0+g.dx*i,-.95,.95),ZMAX+i*9);
  if(g.extra)spawnItem(g.extra.kind,g.extra.x);}
 S.nextMoon-=dt;if(S.nextMoon<=0){const m=ST.moon();S.nextMoon=m.gap;spawnItem('moon',m.x);}
 S.nextShield-=dt;if(S.nextShield<=0){S.nextShield=R(ST.pow,40,60);spawnItem('shield',R(ST.pow,-.8,.8));}
 S.nextMagnet-=dt;if(S.nextMagnet<=0){S.nextMagnet=R(ST.pow,35,50);spawnItem('magnet',R(ST.pow,-.8,.8));}
 if(S.goldAt>0&&S.d>=S.goldAt){S.goldAt=-1;spawnItem('gold',R(ST.gold,-.6,.6));banner('🌠 ดาวหางทองมาแล้ว!','รีบเลี้ยวไปเก็บ +30,000','#ffd27a',1.6);}
}

/* ---------- ทางโค้ง: โค้งธรรมดา 4–8 วิ · โค้งหักศอก 10–20 วิ ต้องตะแคง/ค้างนิ้วสวนแรงเหวี่ยง ---------- */
function curveLogic(dt){
 const s=S;
 if(s.cv){const c=s.cv;c.t+=dt;
  if(c.t<c.warn)s.curve=lerp(s.curve,0,Math.min(1,dt*2));
  else if(c.t<c.warn+c.dur)s.curve=lerp(s.curve,c.dir*c.str*(c.sharp?1+.18*Math.sin(c.t*1.4):1),Math.min(1,dt*(c.sharp?2.2:1.6)));
  else{s.curve=lerp(s.curve,0,Math.min(1,dt*1.5));if(Math.abs(s.curve)<.02){s.curve=0;s.cv=null;s.nextCurve=R(ST.curve,7,14)/(1+s.zone*.18);}}
  if(c.sharp&&!c.done&&c.t>=c.warn+c.dur){c.done=true;floatText(HX,HY+40,'✨ ผ่านโค้งหักศอก!','#6ff0b5',true);}
  return;}
 if(s.quiet>0||s.trans>0)return;
 s.nextCurve-=dt;if(s.nextCurve>0)return;
 const C=ST.curve,sharp=s.zone>=1&&C()<.25+s.zone*.08,dir=C()<.5?-1:1;
 s.cv={dir,sharp,t:0,warn:sharp?2.2:1,dur:sharp?R(C,10,20):R(C,4,8),str:sharp?R(C,1.15,1.35):R(C,.7,.95)};
 if(sharp)banner('⚠️ โค้งหักศอก'+(dir>0?'ขวา':'ซ้าย'),'ตะแคงหรือค้างนิ้วไป'+(dir>0?'ขวา':'ซ้าย')+'ไว้ '+Math.round(s.cv.dur)+' วิ','#ff9d3c',2.2);
}
function drawCurveSign(){
 const s=S,c=s.cv;if(!c||!s.run)return;const active=c.t>=c.warn&&c.t<c.warn+c.dur,warn=c.t<c.warn;if(!active&&!warn)return;
 const dir=c.dir,x=dir>0?W-34:34,y=HY-10,col=c.sharp?'#ff9d3c':'#ffe08a',blink=warn?(Math.sin(s.t*18)>0?1:.35):.55+.45*Math.sin(s.t*8);
 cx.save();cx.globalAlpha=blink;cx.fillStyle=col;cx.shadowColor=col;cx.shadowBlur=14;cx.font='900 '+(c.sharp?34:26)+'px Itim';cx.textAlign='center';
 for(let i=0;i<(c.sharp?3:2);i++)cx.fillText(dir>0?'❯':'❮',x-dir*i*16+dir*((s.t*40)%16),y);
 cx.shadowBlur=0;cx.font='700 12px Mali';cx.fillText(c.sharp?'หักศอก':'โค้ง',x-dir*10,y+24);
 if(c.sharp&&active){const left=1-(c.t-c.warn)/c.dur;cx.lineWidth=4;cx.strokeStyle='rgba(255,255,255,.25)';cx.beginPath();cx.arc(x-dir*10,y+52,13,0,6.3);cx.stroke();cx.strokeStyle=col;cx.beginPath();cx.arc(x-dir*10,y+52,13,-Math.PI/2,-Math.PI/2+left*6.283);cx.stroke();cx.fillStyle='#fff';cx.font='700 11px Mali';cx.fillText(Math.ceil(left*c.dur),x-dir*10,y+56);}
 cx.restore();
}
/* ---------- เอฟเฟกต์ ---------- */
function floatText(x,y,txt,col,big){S.float.push({x,y,txt,col,t:0,big});}
function burst(x,y,col,n,sp=220){for(let i=0;i<n*Q+3;i++){const a=rnd(0,6.28),s=rnd(.3,1)*sp;S.part.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,life:rnd(.4,.8),r:rnd(2,5),col,g:0});}}
function boom(x,y,s){S.booms.push({x,y,s,t:0});}
let bannerT=0;
function banner(t,s,col,dur=1.8){$('bT').textContent=t;$('bS').textContent=s||'';$('bS').style.display=s?'':'none';$('banner').style.setProperty('--bc',col||'#ffd27a');$('banner').classList.add('on');bannerT=dur;}

/* ---------- ชน/เก็บ ---------- */
const bend=p=>S.curve*W*1.5*Math.pow(clamp(1-p,0,1),1.9);
const proj=(x,z)=>{const p=F/(F+z);return {p,X:HX+(x-.3*S.px)*LW*p+bend(p),Y:HY+(WY-HY)*p};};
function hitOb(o){
 const d=OB[o.k],at=proj(o.x,Math.max(o.z,0));
 if(S.shield){S.shield=false;burst(HX+S.px*.7*LW,WY-20,'#d6b4ff',26,320);floatText(HX+S.px*.7*LW,WY-110,'🛡️ กันไว้!','#e3ccff',true);S.inv=.8;return;}
 if(S.inv>0)return;
 S.pen+=d.pen;S.hits[o.k]=(S.hits[o.k]||0)+1;S.hearts--;S.inv=1.4;S.hitAnim=.62;S.shake=o.k==='meteor'?.55:.38;S.flash=.5;S.flashCol='#ff3b5c';
 const wx=HX+S.px*.7*LW;boom(wx,WY-30,1);floatText(wx,WY-120,'−'+fmt(d.pen),'#ff6b81',true);
 if(o.k==='bat'){const n=Math.min(5,S.c.star);S.c.star-=n;if(n)setTimeout(()=>floatText(wx+60,WY-160,'−'+n+' ⭐','#ffd27a'),220);}
 if(o.k==='storm'){S.reverse=3;S.blur=3;}
 if(o.k==='pumpkin')boom(at.X,at.Y,1.3);
 if(navigator.vibrate)try{navigator.vibrate(o.k==='meteor'?120:70);}catch(e){}
 updateHud(true);
 if(S.hearts<=0){S.ended=true;S.endT=1.3;}
}
function getItem(o){
 const d=IT[o.k],wx=HX+S.px*.7*LW;
 if(o.k==='shield'){S.shield=true;floatText(wx,WY-130,'🛡️ โล่เวทมนตร์','#e3ccff',true);burst(wx,WY-40,'#c79bff',18);return;}
 if(o.k==='magnet'){S.magnet=8;floatText(wx,WY-130,'🧲 ดูดดาว 8 วิ','#ffb3e6',true);burst(wx,WY-40,'#ff8bd8',18);return;}
 if(o.k==='gold'){S.gold=true;floatText(wx,WY-140,'🌠 +30,000','#ffd27a',true);burst(wx,WY-50,'#ffd27a',40,380);S.flash=.4;S.flashCol='#ffe9a8';updateHud(true);return;}
 S.c[o.k]++;floatText(wx+rnd(-20,20),WY-110,'+'+fmt(d.pts),o.k==='moon'?'#bfeaff':'#ffe08a',o.k==='moon');burst(wx,WY-50,d.col,o.k==='star'?8:16);updateHud(true);
}

/* ---------- วาด ---------- */
function drawCover(img,alpha,scale,ox,oy,rot){
 if(!img.width)return;const s=Math.max(W/img.width,H/img.height)*scale;cx.save();cx.globalAlpha=alpha;cx.translate(HX+ox,H*.5+oy);cx.rotate(rot);cx.drawImage(img,-img.width*s/2,-img.height*s*.502,img.width*s,img.height*s);cx.restore();}
function sprite(img,cols,rows,idx,x,y,w,alpha=1,rot=0){
 if(!img.width)return;const fw=img.width/cols,fh=img.height/rows,c=idx%cols,r=Math.floor(idx/cols),h=w*fh/fw;
 cx.save();cx.globalAlpha=alpha;cx.translate(x,y);if(rot)cx.rotate(rot);cx.drawImage(img,c*fw,r*fh,fw,fh,-w/2,-h/2,w,h);cx.restore();}
function drawImg(img,x,y,w,alpha=1,rot=0){if(!img.width)return;const h=w*img.height/img.width;cx.save();cx.globalAlpha=alpha;cx.translate(x,y);if(rot)cx.rotate(rot);cx.drawImage(img,-w/2,-h/2,w,h);cx.restore();}
function glow(x,y,r,col,a){const g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');cx.save();cx.globalAlpha=a;cx.globalCompositeOperation='lighter';cx.fillStyle=g;cx.fillRect(x-r,y-r,r*2,r*2);cx.restore();}
function hexA(h,a){const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`;}

function render(dt){
 const s=S,z=ZONES[s.zone],sp=(s.v-28)/30;
 cx.setTransform(DPR,0,0,DPR,0,0);cx.fillStyle='#0e0820';cx.fillRect(0,0,W,H);
 // กล้อง: สั่น + เอียงตามโค้ง + ซูมตามความเร็ว
 const shk=s.shake>0?s.shake*14:sp*1.6,sx=rnd(-shk,shk),sy=rnd(-shk,shk),bank=s.lean*.075-s.curve*.22,zoom=1+sp*.05;
 cx.save();cx.translate(HX+sx,WY+sy);cx.rotate(bank);cx.scale(zoom,zoom);cx.translate(-HX,-WY);
 // ฉาก
 const breath=1.1+Math.sin(s.t*.35)*.015+sp*.04;
 if(s.trans>0&&s.transFrom!=null){const a=clamp(1-s.trans/1.1,0,1);drawCover(I[ZONES[s.transFrom].bg],1,breath*(1+(1-s.trans)*.25),-s.px*14,0,s.t*.004);drawCover(I[z.bg],a,breath,-s.px*14,0,s.t*.004);}
 else drawCover(I[z.bg],1,breath+Math.abs(s.curve)*(.62+.24*H/W),-s.px*14+s.curve*W*.3,0,s.t*.004+s.curve*.16);
 glow(HX+bend(.1),HY,Math.min(W,H)*(.33+.06*Math.sin(s.t*2.2)+sp*.12),hexA(z.col,.55),(s.zone===4?.18:.5)+sp*.25);
 // ดาววิ่งเข้าหา (ยิ่งเร็วยิ่งยาว)
 cx.save();cx.globalCompositeOperation='lighter';cx.lineCap='round';
 for(const st of stars){const p1=F/(F+st.z),p2=F/(F+st.z+3+s.v*.16),x1=HX+st.x*W*.9*p1+bend(p1),y1=HY+st.y*H*.75*p1,x2=HX+st.x*W*.9*p2+bend(p2),y2=HY+st.y*H*.75*p2;
  cx.strokeStyle=st.c;cx.globalAlpha=clamp((ZMAX-st.z)/30,0,1)*.6;cx.lineWidth=Math.max(.6,p1*2.6);cx.beginPath();cx.moveTo(x2,y2);cx.lineTo(x1,y1);cx.stroke();}
 cx.restore();
 drawTrack();
 // ของ (ไกล → ใกล้)
 const list=s.obj.slice().sort((a,b)=>b.z-a.z);
 for(const o of list){if(o.z<0)continue;drawObj(o);}
 // ประตูพระจันทร์
 if(s.d>GOAL-1600){const k=clamp(1-(GOAL-s.d)/1600,0,1),e=k*k*k,w=lerp(W*.16,W*2.6,e);drawImg(I.gate,HX-s.px*10+bend(lerp(.1,1,e)),lerp(HY,HY+H*.12,e),w,clamp(k*3,0,1));if(k>.2)glow(HX,HY,W*.5,'rgba(220,230,255,.9)',k*.5);}
 // แม่มด + เงา + ควัน
 drawTrail();drawWitch();
 for(const o of list){if(o.z>=0)continue;drawObj(o);}
 drawBooms(dt);drawParts(dt);
 cx.restore();
 // เอฟเฟกต์ทับจอ
 drawSpeedLines(sp);drawCurveSign();
 if(s.blur>0){cx.save();cx.globalAlpha=clamp(s.blur/3,0,1)*.45;cx.fillStyle='#1a1240';cx.fillRect(0,0,W,H);if(Math.random()<.08){cx.globalAlpha=.35;cx.fillStyle='#e9e1ff';cx.fillRect(0,0,W,H);}cx.restore();}
 if(s.flash>0){cx.save();cx.globalAlpha=s.flash*.7;const g=cx.createRadialGradient(HX,H/2,W*.1,HX,H/2,Math.max(W,H)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,s.flashCol);cx.fillStyle=g;cx.fillRect(0,0,W,H);cx.restore();}
 if(s.trans>0){const k=s.trans>.75?(1.1-s.trans)/.35:s.trans/.75;cx.save();cx.globalAlpha=clamp(k,0,1)*.85;const g=cx.createRadialGradient(HX,HY,0,HX,HY,Math.max(W,H));g.addColorStop(0,'#ffffff');g.addColorStop(.35,hexA(z.col,.9));g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.fillRect(0,0,W,H);cx.restore();}
 // ลูกศรเตือนดาวหาง
 for(const o of s.obj)if(o.k==='comet'&&o.z>12&&o.z<80){const side=o.sx<0?-1:1,a=.5+.5*Math.sin(s.t*20);cx.save();cx.globalAlpha=a;cx.fillStyle='#ff6b81';cx.font='800 30px Itim';cx.textAlign='center';cx.fillText(side<0?'◀':'▶',side<0?24:W-24,HY+(WY-HY)*.5);cx.font='700 12px Mali';cx.fillText('ดาวหาง!',side<0?34:W-34,HY+(WY-HY)*.5+20);cx.restore();}
 drawFloats(dt);
}
function drawObj(o){
 const s=S,{p,X,Y}=proj(o.x,o.z);if(p<=0)return;
 const def=o.ob?OB[o.k]:IT[o.k],w=def.size*U*1.25*p*(o.k==='gold'?1+.1*Math.sin(s.t*12):1),fog=clamp((ZMAX-o.z)/22,0,1),alpha=o.z<0?clamp(1+o.z/6,0,1):fog;
 if(alpha<=0)return;
 if(o.ob&&o.z>0&&o.z<40&&Q){const sh=w*.42;cx.save();cx.globalAlpha=alpha*.35;cx.fillStyle='#000';cx.beginPath();cx.ellipse(X,Y+w*.45,sh,sh*.22,0,0,6.3);cx.fill();cx.restore();}
 if(o.ob)auraBad(X,Y,w,alpha,o.ph);else auraGood(X,Y,w,alpha,o.ph,o.k==='gold'||o.k==='moon');
 if(o.k==='bat')sprite(I.bat,4,1,Math.floor(s.t*12+o.ph)%4,X,Y,w*1.25,alpha);
 else if(o.k==='meteor'||o.k==='comet')drawImg(I[def.img],X,Y,w,alpha,o.k==='comet'?(o.sx<0?.5:-.5)+Math.PI*0:o.rot+s.t*o.spin);
 else if(o.k==='storm'){drawImg(I.storm,X,Y,w,alpha,Math.sin(s.t*2+o.ph)*.06);if(Math.random()<.05)glow(X,Y,w,'rgba(200,180,255,1)',alpha*.6);}
 else if(o.k==='pumpkin')drawImg(I.pumpkin,X+Math.sin(s.t*3+o.ph)*w*.06,Y,w,alpha,Math.sin(s.t*2.4+o.ph)*.12);
 else if(o.k==='gold'){cx.save();cx.filter='sepia(1) saturate(4) brightness(1.2)';drawImg(I.comet,X,Y,w,alpha,-.6);cx.filter='none';cx.globalCompositeOperation='lighter';drawImg(I.star,X,Y,w*.55,alpha*.9,s.t*2);cx.restore();glow(X,Y,w*1.2,'rgba(255,215,120,1)',alpha*.6);}
 else drawImg(I[def.img],X,Y+Math.sin(s.t*4+o.ph)*w*.05,w,alpha,o.k==='star'?Math.sin(s.t*3+o.ph)*.25:0);
}
/* ทางวิเศษ: ราวแสงสองข้าง + ซุ้มวงแหวนลอยเป็นระยะ ทำให้เห็นทางโค้งชัด */
function drawTrack(){
 const s=S,zs=s.d*1.85,col=hexA(ZONES[s.zone].col,1);
 cx.save();cx.globalCompositeOperation='lighter';
 // ราวแสง: เส้นริบบิ้นต่อเนื่องตามขอบทาง (เห็นโค้งชัด) + จุดเรืองแสง
 for(const side of [-1.18,1.18]){const pts=[];for(let z=ZMAX;z>=0;z-=2)pts.push(proj(side,z));
  for(const [lw,al,st] of [[14,.16,col],[5,.42,col],[1.6,.8,'rgba(255,255,255,.9)']]){cx.globalAlpha=al;cx.strokeStyle=st;cx.lineCap='round';
   for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];cx.lineWidth=Math.max(1,lw*b.p*2.2);cx.beginPath();cx.moveTo(a.X,a.Y);cx.lineTo(b.X,b.Y);cx.stroke();}}}
 for(const side of [-1.18,1.18]){const sp=7,off=zs%sp;for(let z=ZMAX-off;z>0;z-=sp){const q=proj(side,z),a=clamp((ZMAX-z)/30,0,1)*.9,r=Math.max(1,9*q.p);
   const g=cx.createRadialGradient(q.X,q.Y,0,q.X,q.Y,r*2.2);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.35,col);g.addColorStop(1,'rgba(0,0,0,0)');cx.globalAlpha=a;cx.fillStyle=g;cx.fillRect(q.X-r*2.2,q.Y-r*2.2,r*4.4,r*4.4);}}
 // เส้นนำทางกลาง (จางๆ)
 cx.strokeStyle=col;cx.lineWidth=2;cx.globalAlpha=.18;cx.beginPath();for(let z=ZMAX;z>=0;z-=4){const q=proj(0,z);z===ZMAX?cx.moveTo(q.X,q.Y):cx.lineTo(q.X,q.Y);}cx.stroke();
 // ซุ้มวงแหวน
 const rs=26,offR=zs%rs;for(let z=ZMAX-offR;z>1;z-=rs){const q=proj(0,z),rx=1.45*LW*q.p,ry=rx*.82,a=clamp((ZMAX-z)/35,0,1)*clamp(z/8,0,1)*.8;
  cx.globalAlpha=a;cx.lineWidth=Math.max(1.2,7*q.p);cx.strokeStyle=col;cx.beginPath();cx.ellipse(q.X,q.Y-ry*.62,rx,ry,0,Math.PI*.92,Math.PI*2.08);cx.stroke();
  cx.globalAlpha=a*.5;cx.lineWidth=Math.max(2,16*q.p);cx.strokeStyle='rgba(255,255,255,.35)';cx.stroke();}
 cx.restore();}
/* ออร่าแยกของดี/ของร้าย: ดี = วงแสงทองเขียวมีรัศมีหมุน + ประกายลอยขึ้น · ร้าย = ควันแดงดำ ขอบหนามเต้น */
function auraGood(X,Y,w,a,ph,rare){
 const t=S.t,r=w*.78;cx.save();cx.globalCompositeOperation='lighter';
 const g=cx.createRadialGradient(X,Y,r*.15,X,Y,r*1.15);g.addColorStop(0,rare?'rgba(255,236,150,.75)':'rgba(170,255,190,.55)');g.addColorStop(.6,rare?'rgba(255,200,80,.28)':'rgba(120,255,170,.22)');g.addColorStop(1,'rgba(0,0,0,0)');
 cx.globalAlpha=a*(.85+.15*Math.sin(t*6+ph));cx.fillStyle=g;cx.beginPath();cx.arc(X,Y,r*1.15,0,6.3);cx.fill();
 cx.translate(X,Y);cx.rotate(t*1.2+ph);cx.globalAlpha=a*.5;cx.fillStyle=rare?'rgba(255,225,120,.9)':'rgba(190,255,200,.8)';
 for(let i=0;i<8;i++){cx.rotate(Math.PI/4);cx.beginPath();cx.moveTo(-r*.05,r*.42);cx.lineTo(0,r*1.05);cx.lineTo(r*.05,r*.42);cx.fill();}
 cx.rotate(-(t*1.2+ph));cx.strokeStyle=rare?'rgba(255,230,140,.95)':'rgba(170,255,200,.9)';cx.lineWidth=Math.max(1.5,w*.035);cx.globalAlpha=a*(.55+.35*Math.sin(t*5+ph));cx.beginPath();cx.arc(0,0,r*.72,0,6.3);cx.stroke();
 for(let i=0;i<4;i++){const k=((t*.9+i/4+ph)%1),yy=r*.6-k*r*1.5,xx=Math.sin(i*2.3+ph)*r*.55;cx.globalAlpha=a*(1-k);cx.fillStyle='#fff';cx.beginPath();cx.arc(xx,yy,Math.max(1.2,w*.03)*(1-k*.5),0,6.3);cx.fill();}
 cx.restore();}
function auraBad(X,Y,w,a,ph){
 const t=S.t,r=w*.72;cx.save();
 const g=cx.createRadialGradient(X,Y,r*.2,X,Y,r*1.2);g.addColorStop(0,'rgba(120,0,30,.55)');g.addColorStop(.65,'rgba(60,0,20,.35)');g.addColorStop(1,'rgba(0,0,0,0)');
 cx.globalAlpha=a;cx.fillStyle=g;cx.beginPath();cx.arc(X,Y,r*1.2,0,6.3);cx.fill();
 cx.globalCompositeOperation='lighter';cx.translate(X,Y);cx.strokeStyle='rgba(255,40,70,.9)';cx.lineWidth=Math.max(1.5,w*.03);cx.globalAlpha=a*(.45+.35*Math.abs(Math.sin(t*7+ph)));
 cx.beginPath();for(let i=0;i<=18;i++){const an=i/18*6.283+t*.6,rr=r*(.78+(i%2?.12:0)+.04*Math.sin(t*9+i));const px=Math.cos(an)*rr,py=Math.sin(an)*rr;i?cx.lineTo(px,py):cx.moveTo(px,py);}cx.closePath();cx.stroke();
 cx.restore();}
function drawWitch(){
 const s=S,wx=HX+s.px*.7*LW,bob=Math.sin(s.t*6)*4,ww=U*.42,wy=WY-ww*.18+bob;
 // เงานุ่มใต้ตัว
 cx.save();const g=cx.createRadialGradient(wx,WY+ww*.33,0,wx,WY+ww*.33,ww*.42);g.addColorStop(0,'rgba(10,0,25,.55)');g.addColorStop(1,'rgba(10,0,25,0)');cx.fillStyle=g;cx.beginPath();cx.ellipse(wx,WY+ww*.33,ww*.45,ww*.13,0,0,6.3);cx.fill();cx.restore();
 // แสงสะท้อนจากของที่ผ่านใกล้
 for(const o of s.obj)if(o.z>0&&o.z<14&&Math.abs(o.x-s.px)<.6){const d=o.ob?OB[o.k]:IT[o.k];glow(wx,wy,ww*.6,hexA(d.col,.9),(1-o.z/14)*.35);}
 let idx;
 if(s.hitAnim>0)idx=12+Math.min(3,Math.floor((.62-s.hitAnim)/.155));
 else if(s.lean<-.18)idx=4+Math.min(3,Math.floor((-s.lean-.18)/.21));
 else if(s.lean>.18)idx=8+Math.min(3,Math.floor((s.lean-.18)/.21));
 else idx=Math.floor(s.t*9)%4;
 const a=s.inv>0&&s.hitAnim<=0?(Math.sin(s.t*40)>0?.45:1):1;
 sprite(I.witch,4,4,idx,wx,wy,ww,a);
 if(s.shield){cx.save();cx.globalCompositeOperation='lighter';drawImg(I.bubble,wx,wy,ww*1.18*(1+.03*Math.sin(s.t*6)),.75,s.t*.8);cx.restore();}
 if(s.magnet>0)glow(wx,wy,ww*.9,'rgba(255,139,216,1)',.18+.1*Math.sin(s.t*10));
}
function drawTrail(){
 const s=S,ww=U*.42;
 const n=Q?2:1;for(let i=0;i<n;i++)trail.push({x:s.px+rnd(-.03,.03),t:0,life:rnd(.35,.6),c:Math.random()<.5?'rgba(255,190,90,.9)':'rgba(170,110,255,.9)',r:rnd(.03,.055)});
 cx.save();cx.globalCompositeOperation='lighter';
 for(let i=trail.length-1;i>=0;i--){const q=trail[i];q.t+=1/60;if(q.t>q.life){trail.splice(i,1);continue;}
  const zz=-q.t*16,p=F/(F+zz),X=HX+(q.x-.3*s.px)*LW*p,Y=WY+ww*.36+(q.t*q.t*ww*1.1),r=q.r*U*p*(1+q.t*2),a=(1-q.t/q.life)*.28;
  const g=cx.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,q.c);g.addColorStop(1,'rgba(0,0,0,0)');cx.globalAlpha=a;cx.fillStyle=g;cx.fillRect(X-r,Y-r,r*2,r*2);}
 cx.restore();
}
const trail=[];
function drawBooms(dt){for(let i=S.booms.length-1;i>=0;i--){const b=S.booms[i];b.t+=dt;const f=Math.floor(b.t*30);if(f>15){S.booms.splice(i,1);continue;}sprite(I.crash,4,4,f,b.x,b.y,Math.min(W,H)*.55*b.s);}}
function drawParts(dt){cx.save();cx.globalCompositeOperation='lighter';for(let i=S.part.length-1;i>=0;i--){const q=S.part[i];q.t+=dt;if(q.t>q.life){S.part.splice(i,1);continue;}q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.92;q.vy*=.92;cx.globalAlpha=1-q.t/q.life;cx.fillStyle=q.col;cx.beginPath();cx.arc(q.x,q.y,q.r*(1-q.t/q.life*.5),0,6.3);cx.fill();}cx.restore();}
function drawSpeedLines(sp){if(sp<.15||!Q)return;cx.save();cx.globalCompositeOperation='lighter';cx.strokeStyle='#ffffff';const n=Math.floor(sp*14);for(let i=0;i<n;i++){const a=rnd(0,6.28),r1=Math.max(W,H)*rnd(.42,.6),r2=r1+rnd(40,120)*sp;cx.globalAlpha=rnd(.05,.18);cx.lineWidth=rnd(1,2.5);cx.beginPath();cx.moveTo(HX+Math.cos(a)*r1,HY+Math.sin(a)*r1);cx.lineTo(HX+Math.cos(a)*r2,HY+Math.sin(a)*r2);cx.stroke();}cx.restore();}
function drawFloats(dt){for(let i=S.float.length-1;i>=0;i--){const f=S.float[i];f.t+=dt;if(f.t>1.1){S.float.splice(i,1);continue;}const k=f.t/1.1;cx.save();cx.globalAlpha=1-k*k;cx.font=`800 ${f.big?30:22}px Itim`;cx.textAlign='center';cx.lineWidth=5;cx.strokeStyle='rgba(20,6,40,.85)';const y=f.y-k*70,sc=f.t<.12?.6+f.t/.12*.5:1.1-Math.min(.1,(f.t-.12));cx.translate(f.x,y);cx.scale(sc,sc);cx.strokeText(f.txt,0,0);cx.fillStyle=f.col;cx.fillText(f.txt,0,0);cx.restore();}}

/* ---------- วนเกม ---------- */
let last=0,fpsAcc=0,fpsN=0,fpsT=0;
function loop(ts){
 requestAnimationFrame(loop);
 let dt=Math.min(.05,(ts-last)/1000||0);last=ts;
 if(!S)return;
 if(S.run&&!S.paused)step(dt);
 render(S.run&&!S.paused?dt:0);
 // ปรับคุณภาพเองถ้าเครื่องกระตุก
 fpsAcc+=dt;fpsN++;fpsT+=dt;if(fpsT>2.5){const fps=fpsN/fpsAcc;if(fps<42&&Q){Q=0;fit();}fpsAcc=0;fpsN=0;fpsT=0;}
}
function step(dt){
 if(!(dt>0))return;
 const s=S;s.t+=dt;
 if(s.ended){s.endT-=dt;if(!s.win)dt*=.25;if(s.endT<=0){finish(!!s.win);return;}}
 // ความเร็วตามช่วง
 const zi=zoneAt(s.d);if(zi!==s.zone){s.transFrom=s.zone;s.zone=zi;s.trans=1.1;s.quiet=1.3;const z=ZONES[zi];banner('⚡ ช่วง '+(zi+1)+' · '+z.n,'เร็วขึ้น!',z.col);}
 const z=ZONES[s.zone],pr=clamp((s.d-z.from)/(z.to-z.from),0,1);s.v=lerp(z.v0,z.v1,pr);
 s.d=Math.min(GOAL,s.d+s.v*dt);
 if(!s.passedLine&&s.d>=MIN_LINE){s.passedLine=true;banner('✅ ผ่านเส้นขั้นต่ำ!','จากนี้ได้กุศลบวก','#6ff0b5');burst(HX,HY,'#6ff0b5',40,400);}
 while(s.cpI<WITCH.CPS.length&&s.d>=WITCH.CPS[s.cpI]){s.cpI++;if(FR&&s.round)FR.checkpoint(snap());}
 if(s.d>=GOAL&&!s.ended){s.ended=true;s.win=true;s.endT=1.2;s.flash=1.2;s.flashCol='#ffffff';s.obj.length=0;burst(HX,HY,'#e8eeff',60,520);}
 // บังคับ
 // ใช้ได้ทั้งสองแบบ: แตะ/ลากนิ้วอยู่ = ตามนิ้ว · ปล่อยนิ้ว = ตามการตะแคง
 const fingerNow=touching||performance.now()-lastTouch<250;let tgt=target;if(tiltOK&&gamma!=null&&!fingerNow){tgt=clamp((gamma-g0)/20,-1,1);target=tgt;}if(keys)target=tgt=clamp(target+keys*dt*2.2,-1,1);
 if(s.reverse>0)tgt=-tgt;
 const prev=s.px;tgt=clamp(tgt*1.15-s.curve*(s.cv&&s.cv.sharp?1.05:.95),-1.12,1.12);s.px+=(tgt-s.px)*Math.min(1,dt*(s.cv&&s.cv.sharp?4.5:6));s.lean=lerp(s.lean,clamp((s.px-prev)/dt*.55+(tgt-s.px)*.8,-1,1),Math.min(1,dt*9));if(!Number.isFinite(s.px)){s.px=0;s.lean=0;}
 // เวลาเอฟเฟกต์
 for(const k of ['inv','hitAnim','shake','flash','reverse','blur','magnet','trans'])s[k]=Math.max(0,s[k]-dt);
 if(bannerT>0){bannerT-=dt;if(bannerT<=0)$('banner').classList.remove('on');}
 // ดาวพื้นหลัง
 const vz=s.v*1.85;for(const st of stars){st.x-=s.curve*dt*1.8;if(st.x<-1.4)st.x+=2.8;if(st.x>1.4)st.x-=2.8;st.z-=vz*dt*.9;if(st.z<.5)Object.assign(st,newStar(false));}
 if(!s.ended){spawnLogic(dt);curveLogic(dt);}
 // ของเคลื่อนที่ + ชน/เก็บ
 for(let i=s.obj.length-1;i>=0;i--){const o=s.obj[i],pz=o.z,mult=o.k==='comet'?OB.comet.fast:1;o.z-=vz*mult*dt;
  if(o.k==='comet')o.x=lerp(o.tx,o.sx,clamp(o.z/ZMAX,0,1));
  if(!o.ob&&s.magnet>0&&o.z<45&&o.k!=='shield'&&o.k!=='magnet')o.x=lerp(o.x,s.px,dt*4);
  if(!o.hit&&!s.ended){
   if(o.ob){const d=OB[o.k],reach=o.k==='pumpkin'?2.5:0;
    if(pz>reach&&o.z<=reach){o.hit=true;const dx=Math.abs(o.x-s.px);if(dx<(d.blast||d.hw)+.13)hitOb(o);}}
   else if(pz>0&&o.z<=0){const dx=Math.abs(o.x-s.px);if(dx<.27){o.hit=true;o.z=-99;getItem(o);}}
  }
  if(o.z<-7)s.obj.splice(i,1);}
 updateHud(false);
}

/* ---------- HUD ---------- */
let hudScore=null;
let hudH=-1,hudD=-1;
function updateHud(bump){
 const s=S;if(hudH!==s.hearts){hudH=s.hearts;$('hearts').innerHTML=[0,1,2].map(i=>'<span class="'+(i<s.hearts?'':'off')+'">❤️</span>').join('');}
 const dd=Math.floor(s.d/10)*10;if(dd!==hudD){hudD=dd;$('distV').textContent=fmt(dd);}
 const live=scoreOf(s).total;
 if(live!==hudScore){hudScore=live;$('scoreV').textContent=(live>=0?'+':'−')+fmt(Math.abs(live));if(bump){$('score').classList.remove('bump');void $('score').offsetWidth;$('score').classList.add('bump');}}
 const k=s.d/GOAL;$('pfill').style.width=(k*100)+'%';$('pme').style.left=(k*100)+'%';
 const fx=[];if(s.shield)fx.push('<span class="chip">🛡️ โล่</span>');if(s.magnet>0)fx.push('<span class="chip">🧲 '+Math.ceil(s.magnet)+' วิ</span>');if(s.reverse>0)fx.push('<span class="chip bad">🔄 กลับด้าน '+Math.ceil(s.reverse)+'</span>');if(!tiltOK)fx.push('<span class="chip">👆 ลากนิ้วเพื่อเลี้ยว</span>');
 const h=fx.join('');if($('fx').dataset.h!==h){$('fx').innerHTML=h;$('fx').dataset.h=h;}
}
function buildProg(){const p=$('prog');p.querySelectorAll('.tick,.flag').forEach(e=>e.remove());
 ZONES.forEach((z,i)=>{if(!i)return;const t=document.createElement('div');t.className='tick';t.style.left=(z.from/GOAL*100)+'%';t.style.background=z.col;p.appendChild(t);});
 const f=document.createElement('div');f.className='flag';f.style.left=(MIN_LINE/GOAL*100)+'%';f.textContent='🚩';p.appendChild(f);
 $('pgate').style.backgroundImage='url('+IMG.gate+')';}

/* ---------- พักเกม ---------- */
let pauseAt=0;
function pauseGame(){if(!S||!S.run||S.paused||S.ended)return;S.paused=1;pauseAt=performance.now();$('pause').classList.remove('hide');tickPause();}
function tickPause(){if(!S.paused)return;const used=S.pauseUsed+(performance.now()-pauseAt)/1000,left=Math.max(0,PAUSE_BUDGET-used);$('pBudget').textContent='พักได้อีก '+Math.floor(left/60)+':'+String(Math.floor(left%60)).padStart(2,'0')+' นาที (รวมทั้งรอบ)';if(left<=0){S.pauseUsed=PAUSE_BUDGET;$('pause').classList.add('hide');S.paused=0;finish(false,true);return;}setTimeout(tickPause,500);}
function resume(){if(!S.paused)return;S.pauseUsed+=(performance.now()-pauseAt)/1000;$('pause').classList.add('hide');countdown(()=>{S.paused=0;});}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame();});
$('pauseBtn').onclick=pauseGame;$('resume').onclick=resume;$('recal').onclick=()=>{g0=gamma;$('recal').textContent='🎯 ตั้งแล้ว ✓';setTimeout(()=>$('recal').textContent='🎯 ตั้งท่าถือใหม่',1200);};
$('quit').onclick=()=>{S.pauseUsed+=(performance.now()-pauseAt)/1000;$('pause').classList.add('hide');S.paused=0;finish(false,false,true);};
function countdown(done){const c=$('count');c.classList.remove('hide');let n=3;const tick=()=>{if(n===0){c.classList.add('hide');done();return;}c.textContent=n;c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');n--;setTimeout(tick,700);};tick();}

/* ---------- เริ่ม/จบ (เซิร์ฟเวอร์เปิดรอบ → เล่น → ส่งผล → เซิร์ฟเวอร์คิดกุศล) ---------- */
let tiltAsked=false;
function onGo(){if(!tiltAsked){tiltAsked=true;askTilt();}FR.start();}
function startRun(round){
 g0=null;newRun(round);buildProg();hudH=-1;hudD=-1;hudScore=null;
 $('start').classList.add('hide');$('result').classList.add('hide');$('hud').classList.remove('hide');updateHud(false);
 setTimeout(()=>{if(!tiltOK){const n=$('note');n.textContent='หน้านี้อ่านการตะแคงไม่ได้ ใช้นิ้วลากซ้ายขวาแทน (คอม: ปุ่มลูกศร)';n.classList.remove('hide');setTimeout(()=>n.classList.add('hide'),3500);}},900);
 banner('ช่วง '+(S.zone+1)+' · '+ZONES[S.zone].n,'ตะแคงมือถือ หรือ ลากนิ้วซ้ายขวา',ZONES[S.zone].col,2.4);
 countdown(()=>{if(gamma!=null)g0=gamma;S.run=true;});
}
let resTimer=null;
function finish(won,timeout,quit){
 const s=S;if(s.done)return;s.done=true;s.run=false;s.ended=true;
 if(s.d>best){best=s.d;try{localStorage.setItem('witch-best',String(Math.round(best)));}catch(e){}}
 $('hud').classList.add('hide');$('banner').classList.remove('on');$('pause').classList.add('hide');
 const report={...snap(),quit:!!(quit||timeout)};
 showWaiting(timeout?'หมดเวลาพัก':'');
 FR.finish(report);
}
function showWaiting(title,stale){
 $('resBox').innerHTML='<div class="waitbox"><div class="spin"></div><h2>'+(title||(stale?'📮 กำลังปิดรอบ…':'📮 กำลังส่งผล…'))+'</h2><div class="sub">รอเซิร์ฟเวอร์ตรวจคะแนนสักครู่</div></div>';
 $('start').classList.add('hide');$('result').classList.remove('hide');$('result').scrollTop=0;
}
function showFinishError(msg){
 clearInterval(resTimer);
 $('resBox').innerHTML='<div class="errbox"><div class="em">😵</div><h2>ส่งผลไม่สำเร็จ</h2><div class="sub">'+esc(msg)+'</div>'+
  (FR.canRetry()?'<button class="go" id="retryBtn">🔁 ส่งผลอีกครั้ง</button>':'')+'<button class="btn2" id="backBtn">🎮 กลับหน้ามินิเกม</button></div>';
 $('result').classList.remove('hide');
 if($('retryBtn'))$('retryBtn').onclick=()=>{showWaiting();FR.retry();};
 $('backBtn').onclick=backToStart;
}
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* หน้าผล: ใช้ตัวเลขจากเซิร์ฟเวอร์ (result.breakdown) เท่านั้น */
function showResult(res){
 const b=res&&res.breakdown||{},c={star:0,candy:0,corn:0,moon:0,...(b.c||{})},hits=b.hits||{},r=b,total=Number(res&&res.gain!=null?res.gain:b.total)||0,d=+b.d||0;
 if(d>best){best=d;try{localStorage.setItem('witch-best',String(Math.round(best)));}catch(e){}}
 const row=(ic,lb,sub,v,cls)=>'<div class="row">'+(isImg(ic)?'<img src="'+ic+'" alt="">':'<span class="em">'+ic+'</span>')+'<div class="lb">'+lb+(sub?'<small>'+sub+'</small>':'')+'</div><div class="v '+cls+'">'+v+'</div></div>';
 const rowG=(lb,sub,v,cls)=>row(IMG.comet,lb,sub,v,cls).replace('<img ','<img class="goldimg" ');
 const hitE=Object.entries(hits).filter(([k,n])=>n>0&&OB[k]),hitN=hitE.reduce((a,[,n])=>a+n,0),hitSub=hitE.map(([k,n])=>OB[k].name+' '+n).join(' · '),hitPen=(+b.pen||0)-(+b.extraPen||0);
 const itemsNote=!r.passed&&r.raw?'ไม่นับ เพราะยังไม่ถึงเส้นขั้นต่ำ':'';
 const k=Math.min(1,d/GOAL),bk=Math.min(1,best/GOAL);
 $('resBox').innerHTML=
  '<img class="hero" src="'+(total>=0?IMG.win:IMG.lose)+'" alt="">'+
  '<h2>'+(b.abandoned?'ปิดรอบที่ค้างไว้':r.fin?'ถึงประตูพระจันทร์! 🌙':b.quit&&!hitN?'จบรอบนี้แล้ว':total>=0?'บินได้สวยมาก!':'ตกไม้กวาดซะแล้ว')+'</h2>'+
  '<div class="sub">ไปได้ไกล <b style="color:#fff;font-size:16px">'+fmt(d)+' ม.</b> · สถิติของคุณ '+fmt(best)+' ม.</div>'+
  '<div class="rprog"><div class="fill" style="width:'+(k*100)+'%"></div><div class="th" style="left:'+(MIN_LINE/GOAL*100)+'%"><span>🚩 '+fmt(MIN_LINE)+'</span></div><div class="best" style="left:'+(bk*100)+'%">🏆</div></div>'+
  (!r.passed?'<div class="hint">ขาดอีก <b style="color:#fff">'+fmt(MIN_LINE-d)+' ม.</b> ถึงเส้นขั้นต่ำ</div>':'')+
  '<div class="rows">'+
   row('🧹','ระยะทาง',r.fin?'ถึงประตูพระจันทร์':r.passed?'ผ่านเส้นขั้นต่ำแล้ว':'ยังไม่ถึงเส้นขั้นต่ำ',sgn(r.dist),r.dist>=0?'pos':'neg')+
   row(IMG.star,'ดาวทอง ×'+c.star,itemsNote,r.passed&&c.star?sgn(c.star*IT.star.pts):'—',r.passed&&c.star?'pos':'dim')+
   row(IMG.candy,'ลูกกวาด ×'+(c.candy+c.corn),itemsNote,r.passed&&(c.candy+c.corn)?sgn((c.candy+c.corn)*IT.candy.pts):'—',r.passed&&(c.candy+c.corn)?'pos':'dim')+
   row(IMG.moon,'เศษพระจันทร์ ×'+c.moon,itemsNote,r.passed&&c.moon?sgn(c.moon*IT.moon.pts):'—',r.passed&&c.moon?'pos':'dim')+
   (r.passed&&r.raw>ITEM_CAP?row('📦','เพดานของเก็บ','นับได้สูงสุด +'+fmt(ITEM_CAP),sgn(ITEM_CAP-r.raw),'neg'):'')+
   row('💥','ชนอุปสรรค ×'+hitN,hitSub,hitN?sgn(-hitPen):'—',hitN?'neg':'dim')+
   (b.abandoned&&b.extraPen?row('📴','หัวใจที่เหลือ','ปิดเกมกลางคัน คิดเหมือนชนจนหมด',sgn(-b.extraPen),'neg'):'')+
   rowG('ดาวหางทอง',b.gold?(r.passed?'โบนัสหายาก!':'ไม่นับ เพราะยังไม่ถึงเส้นขั้นต่ำ'):'ไม่ได้เจอรอบนี้',r.bonus?sgn(r.bonus):'—',r.bonus?'pos':'dim')+
  '</div>'+
  '<div class="total '+(total>=0?'pos':'neg')+'"><span>รวมกุศล</span><b>'+sgn(total)+'</b></div>'+
  '<div class="hint">📮 กุศลบวกเข้าไปรษณีย์ · ติดลบหักทันที (ไม่ต่ำกว่า 0)</div>'+
  '<button class="go" id="backBtn">🎮 กลับหน้ามินิเกม (<span id="bc">30</span>)</button>';
 $('start').classList.add('hide');$('result').classList.remove('hide');$('result').scrollTop=0;
 let n=30;clearInterval(resTimer);resTimer=setInterval(()=>{n--;if($('bc'))$('bc').textContent=n;if(n<=0)backToStart();},1000);
 $('backBtn').onclick=backToStart;
}
function backToStart(){clearInterval(resTimer);$('result').classList.add('hide');$('hud').classList.add('hide');$('start').classList.remove('hide');$('start').scrollTop=0;newRun();FR.close();}

/* ---------- หน้าแรก ---------- */
function tile(img,name,amt,cls,sub,rare,ic){return '<div class="tile">'+(rare?'<span class="rare">หายาก</span>':'')+(isImg(img)?'<img class="'+(ic||'')+'" src="'+img+'" alt="">':'<div class="em">'+img+'</div>')+'<b>'+name+'</b>'+(amt?'<span class="amt '+cls+'">'+amt+'</span>':'')+(sub?'<small>'+sub+'</small>':'')+'</div>';}
function buildStart(){
 document.documentElement.style.setProperty('--poster','url('+IMG.poster+')');
 $('t-how').innerHTML='<div class="grid">'+tile('📱','ตะแคง หรือ ลากนิ้ว','','','ใช้ได้ทั้งสองแบบ')+tile('❤️','หัวใจ 3 ดวง','','','ชนครบ 3 ครั้งจบรอบ')+tile(IMG.gate,'ประตูพระจันทร์','20,000 ม.','gold','ยิ่งไกลยิ่งเร็ว')+'</div>'+
  '<div class="sec">🌌 5 ช่วง ยิ่งไกลยิ่งยาก</div><div class="zones">'+ZONES.map((z,i)=>'<div><i style="background-image:url('+IMG[z.bg]+');border-color:'+z.col+'"></i>'+(i+1)+'. '+z.n+'</div>').join('')+'</div>';
 $('t-obs').innerHTML='<div class="grid">'+Object.entries(OB).map(([k,d])=>tile(IMG[k==='bat'?'batstill':d.img],d.name,'−'+fmt(d.pen),'neg',d.fx,false,'badimg')).join('')+tile(IMG.shield,'มีโล่','ไม่โดนหัก','pos','กันชนได้ 1 ครั้ง')+'</div>';
 $('t-get').innerHTML='<div class="sec" style="margin-top:2px">✨ ของดีมีวงแสงทองเขียว · ☠️ ของร้ายมีควันแดงขอบหนาม</div><div class="grid">'+['star','candy','corn','moon'].map(k=>tile(IMG[IT[k].img],IT[k].name,'+'+fmt(IT[k].pts),'pos',k==='moon'?'นานๆ ออกที':'',false,'goodimg')).join('')+tile(IMG.comet,'ดาวหางทอง','+30,000','gold','ไม่ได้ออกทุกรอบ',true,'goldimg')+tile(IMG.shield,'โล่เวทมนตร์','','','กันชน 1 ครั้ง')+tile(IMG.magnet,'แม่เหล็ก','','','ดูดของ 8 วิ')+'</div>';
 $('t-prize').innerHTML='<div class="rbar"><span class="m" style="left:25%"></span>'+
  '<span class="l t" style="left:4%">−60,000</span><span class="l t" style="left:25%">🚩 +10,000</span><span class="l t" style="left:93%">+50,000</span>'+
  '<span class="l b" style="left:4%">ชนเร็ว</span><span class="l b" style="left:25%">3,000 ม.</span><span class="l b" style="left:93%">🌙 20,000 ม.</span></div>'+
  '<div class="facts" style="grid-template-columns:1fr 1fr">'+tile('🚩','ไม่ถึง 3,000 ม.','ติดลบ','neg','ยิ่งใกล้ ยิ่งลบน้อย')+tile('✅','ผ่าน 3,000 ม.','+5,000 ขึ้นไป','pos','บวกแน่นอน')+tile(IMG.star,'ของที่เก็บ','สูงสุด +30,000','pos','นับเมื่อผ่านเส้น')+tile(IMG.comet,'โบนัสหายาก','+30,000','gold','ดาวหางทอง',true,'goldimg')+'</div>'+
  '<div class="sec" style="justify-content:center;margin-top:12px">🏆 รวมสูงสุด 80,000 (+โบนัส 30,000)</div>';
 document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x===b));['how','obs','get','prize'].forEach(t=>$('t-'+t).classList.toggle('hide',t!==b.dataset.t));});
 $('goBtn').onclick=onGo;$('closeBtn').onclick=()=>FR.close();
}
/* รอบค้าง: แสดงจุดเช็กล่าสุดที่เซิร์ฟเวอร์จำไว้ */
function staleInfo(round){
 const cp=Array.isArray(round.cps)&&round.cps.length?round.cps[round.cps.length-1]:null;
 return '<div class="facts" style="grid-template-columns:1fr 1fr">'+tile('📍','จุดเช็กล่าสุด',cp?fmt(cp.d)+' ม.':'ยังไม่มี',cp&&cp.d>=MIN_LINE?'pos':'neg',cp?'':'ยังบินไม่ถึง 1,000 ม.')+
  tile('❤️','ชนไปแล้ว',cp?Object.values(cp.hits||{}).reduce((a,b)=>a+(b|0),0)+' ครั้ง':'—','neg','')+'</div>';
}
function ready(){
 $('scoreIc').src=IMG.star;buildStart();newRun();requestAnimationFrame(loop);
 FR=mgFrame('witch',{onStarted:startRun,onResult:showResult,onFinishError:showFinishError,onSending:st=>showWaiting('',st),staleInfo});
}
})();
