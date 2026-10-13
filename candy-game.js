/* โรงงานลูกกวาดต้องคำสาป — หน้าเกมเต็มจอ (เปิดใน iframe จากหน้ามินิเกม) · กติกา/คะแนนอยู่ใน candy-engine.js (ใช้ร่วมกับเซิร์ฟเวอร์) */
import {CANDY,candyScore,candyStreams,candySpawnGap} from './candy-engine.js?v=ss3-fix14';
import {mgFrame} from './mg-frame.js?v=ss3-fix14';
(()=>{
const IMG={};['belt','bg','bluecandy','bomb','boss','box','cane','caramel','cat','catgrab','cauldron','choco','clock','corn','cupcake','eyeball','ghost','ghostcandy','gold','heart','jelly','lolli','lose','mold','poster','pumpkinchoco','redeye','skull','spider','ticket','win','worm','zhand','zombiegummy'].forEach(k=>IMG[k]='images/cf-'+k+'.webp');
const isImg=s=>typeof s==='string'&&s.startsWith('images/');
const $=id=>document.getElementById(id);
const cv=$('c'),cx=cv.getContext('2d');
const fmt=n=>Math.round(n).toLocaleString('en-US');
const sgn=n=>(n>0?'+':n<0?'−':'')+fmt(Math.abs(n));
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
const I={};let loaded=0;const names=Object.keys(IMG);
names.forEach(k=>{const im=new Image();im.onload=im.onerror=()=>{if(++loaded===names.length)ready();};im.src=IMG[k];I[k]=im;});
let FR=null;

/* ---------- กติกา ---------- */
const SHIFT_LEN=55,SHIFTS=[
 {n:'กะเช้า',ic:'🌅',travel:3.4,gap:.95,mix:{good:7,cursed:3},tint:'#ffb060',dark:0,col:'#ffb35c'},
 {n:'กะบ่าย',ic:'🌇',travel:2.9,gap:.78,mix:{good:6,cursed:3,fake:2},tint:'#ffd27a',dark:.18,col:'#ffd27a'},
 {n:'กะค่ำ',ic:'🌙',travel:2.5,gap:.64,mix:{good:5,cursed:3,fake:2.5,mimic:1.5,bomb:1,clock:.5},tint:'#b77bff',dark:.5,col:'#c08bff'},
 {n:'กะเที่ยงคืน',ic:'🕛',travel:2.3,gap:.48,mix:{good:5,cursed:3,fake:3,mimic:2,bomb:1.4,clock:.6},tint:'#6dff9c',dark:.62,col:'#6ff0b5',lanes:2}];
const {TOTAL_T,PASS_T}=CANDY;
const GOOD=['lolli','corn','caramel','choco','worm','cupcake','cane','bluecandy','pumpkinchoco','jelly'];
const CURSED=['skull','eyeball','zombiegummy','spider','redeye','mold','zhand','ghostcandy'];
const GNAME={lolli:'อมยิ้มเกลียว',corn:'ข้าวโพดหวาน',caramel:'คาราเมลฟักทอง',choco:'ช็อกโกแลต',worm:'เยลลี่หนอน',cupcake:'คัพเค้ก',cane:'ไม้เท้าลูกกวาด',bluecandy:'ลูกกวาดดาว',pumpkinchoco:'ช็อกฟักทอง',jelly:'เจลลี่บีนรุ้ง'};
const TELLS=['skull','eye','drip','rune','shadow'];
const {PTS,PEN,ORDER_PTS,SHIFT_BONUS,BASE_WIN,MAX_WIN,PAUSE_BUDGET}=CANDY;
const scoreOf=s=>candyScore({t:s.t,pts:s.pts,orders:s.orders,bonus:s.bonus});
/* สุ่มเกม: ทุกอย่างที่มีผลต่อการเล่นมาจาก round.seed (ST) · Math.random ใช้แค่ของตกแต่ง */
let ST=candyStreams('idle');const R=(r,a,b)=>a+r()*(b-a),P=(r,a)=>a[Math.floor(r()*a.length)%a.length];

/* ---------- จอ ---------- */
let W=0,H=0,DPR=1,HX=0,TOP=0,END=0,L=0,Q=1;
function fit(){DPR=Math.min(devicePixelRatio||1,Q?2:1.25);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;HX=W/2;TOP=Math.max(H*.12,hudBottom()+50);END=H*.74;L=END-TOP;}
function hudBottom(){const h=document.getElementById('hud');if(!h||h.classList.contains('hide'))return 112;const r=h.getBoundingClientRect();return r.bottom;}
addEventListener('resize',fit);fit();
const BW1=()=>clamp(W*.42,150,250),BW2=()=>clamp(W*.74,250,440);
function beltW(){return lerp(BW1(),BW2(),S?S.laneK:0);}
function laneX(i){const two=HX+(i?1:-1)*BW2()/4;return lerp(HX,two,S.laneK);}
function laneW(){return S.laneK>0?lerp(BW1(),BW2()/2-6,S.laneK):BW1();}
function CS(){return Math.min(laneW()*.47,82);}
const potPos=()=>({x:W*.15,y:H*.875,s:Math.min(W*.27,150)}),boxPos=()=>({x:W*.85,y:H*.875,s:Math.min(W*.27,150)});

/* ---------- ควบคุม: ปัดซ้าย = หม้อ · ปัดขวา = กล่อง ---------- */
let ptr=null,light={x:0,y:0};
cv.addEventListener('pointerdown',e=>{if(!S||!S.run||S.paused)return;light={x:e.clientX,y:e.clientY};
 if(S.cat&&S.cat.ph==='run'&&Math.hypot(e.clientX-S.cat.x,e.clientY-S.cat.y)<CS()*1.1){shooCat();return;}
 ptr={x:e.clientX,y:e.clientY,cand:candyAt(e.clientX,e.clientY),used:false};});
addEventListener('pointermove',e=>{if(!S||!S.run)return;light={x:e.clientX,y:e.clientY};if(!ptr||ptr.used)return;const dx=e.clientX-ptr.x,dy=e.clientY-ptr.y;if(Math.abs(dx)>24&&Math.abs(dx)>Math.abs(dy)*.9){ptr.used=true;swipe(Math.sign(dx));}});
addEventListener('pointerup',e=>{if(ptr&&!ptr.used){const dx=e.clientX-ptr.x,dy=e.clientY-ptr.y;if(Math.abs(dx)>14&&Math.abs(dx)>Math.abs(dy)*.9)swipe(Math.sign(dx));else if(ptr.cand)hintOnce();}ptr=null;});
addEventListener('keydown',e=>{if(!S||!S.run||S.paused)return;if(e.key==='ArrowLeft'||e.key==='a')swipe(-1);if(e.key==='ArrowRight'||e.key==='d')swipe(1);if(e.key===' '&&S.cat)shooCat();if(e.key==='p'||e.key==='Escape')pauseGame();});
let hinted=0;function hintOnce(){if(hinted++>2)return;floatText(HX,TOP+L*.35,'👈 ปัดซ้ายทิ้ง · ปัดขวาเก็บ 👉','#fff');}

/* ---------- สถานะ ---------- */
let S=null,best=0;try{best=+localStorage.getItem('candy-best')||0;}catch(e){}
function newRun(round){
 ST=candyStreams(round?round.seed:'idle');const E=ST.evt;
 S={run:false,t:0,shift:0,hearts:CANDY.HEARTS,pts:0,orders:0,shiftPts:0,bonus:0,combo:0,maxCombo:0,
  st:{good:0,bad:0,fake:0,mimic:0,bomb:0,heart:0,clock:0,gold:0,wrong:0,miss:0,cat:0,shoo:0,lost:0},
  c:[],part:[],float:[],smoke:[],spawnT:CANDY.SPAWN_FIRST,beltPos:0,laneK:0,lanes:1,quiet:0,
  slow:0,jolt:0,joltWarn:0,nextJolt:R(E,10,18),dark:0,ghost:null,nextGhost:R(E,8,16),cat:null,nextCat:R(E,6,12),
  order:null,nextOrder:R(E,5,9),goldAt:round&&round.goldAt>0?round.goldAt:-1,goldVal:round&&round.goldVal>0?round.goldVal:0,goldShown:false,
  boss:0,bossT:0,passed:false,shake:0,flash:0,flashCol:'#fff',trans:0,paused:0,pauseUsed:0,ended:false,endT:0,win:false,cpI:0,round:round||null,done:false};
}
const snap=()=>({t:Math.round(S.t*1000)/1000,pts:S.pts,orders:S.orders,st:{...S.st},gold:S.st.gold>0});
const shiftAt=t=>Math.min(3,Math.floor(t/SHIFT_LEN));

/* ---------- เกิดลูกกวาด ---------- */
function weighted(mix){let tot=0;for(const k in mix)tot+=mix[k];let r=ST.type()*tot;for(const k in mix){r-=mix[k];if(r<0)return k;}return 'good';}
function spawnCandy(lane){
 const s=S,sh=SHIFTS[s.shift];let type=weighted(sh.mix);
 const hr=ST.type();if(s.shift>=1&&hr<.025)type='heart';
 if(s.goldAt>0&&!s.goldShown&&s.t>=s.goldAt&&s.t>=PASS_T){type='gold';s.goldShown=true;}
 const c={type,lane,y:-.06,rot:rnd(-.25,.25),ph:rnd(0,6),done:false,fly:null},L2=ST.look;
 if(type==='good'){c.img=s.order&&L2()<.32?s.order.kind:P(L2,GOOD);c.good=true;}
 else if(type==='cursed'){c.img=P(L2,CURSED);c.good=false;}
 else if(type==='fake'){c.img=P(L2,GOOD);c.good=false;c.tell=P(L2,TELLS);}
 else if(type==='mimic'){c.img=P(L2,GOOD);c.good=false;c.morphAt=R(L2,.32,.5);c.cursedImg=P(L2,CURSED);}
 else if(type==='bomb'){c.img='bomb';c.good=false;c.fuse=3.2;}
 else if(type==='heart'){c.img='heart';c.good=true;}
 else if(type==='clock'){c.img='clock';c.good=true;}
 else if(type==='gold'){c.img='gold';c.good=true;}
 s.c.push(c);
}
function spawnLogic(dt){
 const s=S,sh=SHIFTS[s.shift];
 if(s.quiet>0){s.quiet-=dt;return;}
 s.spawnT-=dt;if(s.spawnT>0)return;
 const lanes=s.lanes;let lane=lanes>1?(ST.look()<.5?0:1):0;
 // เว้นระยะในเลนเดียวกัน
 const minGap=Math.max(.1,CS()*1.1/L);const lastY=l=>{let m=1;for(const c of s.c)if(!c.done&&c.lane===l)m=Math.min(m,c.y);return m;};
 if(lastY(lane)<minGap){if(lanes>1&&lastY(1-lane)>=minGap)lane=1-lane;else{s.spawnT=.15;return;}}
 // ช่วงห่างสุ่มจาก seed ครั้งเดียวต่อลูกกวาดที่ปล่อยจริง (เซิร์ฟเวอร์ใช้สูตรเดียวกันคำนวณจำนวนสูงสุด)
 s.spawnT=candySpawnGap(s.t,ST.time)/(s.slow>0?.6:1);
 spawnCandy(lane);
}

/* ---------- คัด ---------- */
function candyPos(c){return {x:laneX(c.lane)+Math.sin(c.ph+S.t*2)*2,y:TOP+c.y*L};}
function candyAt(x,y){let b=null,bd=1e9;for(const c of S.c){if(c.done||c.y<0)continue;const p=candyPos(c),d=Math.hypot(p.x-x,p.y-y);if(d<CS()*.75&&d<bd){bd=d;b=c;}}return b;}
function front(prefX){const s=S;let lane=null;if(s.lanes>1&&prefX!=null)lane=prefX<HX?0:1;
 let b=null;for(const c of s.c){if(c.done||c.y<-.02)continue;if(lane!=null&&c.lane!==lane)continue;if(!b||c.y>b.y)b=c;}
 if(!b&&lane!=null)return front(null);return b;}
function swipe(dir){
 const s=S;if(s.ended)return;let c=ptr&&ptr.cand&&!ptr.cand.done?ptr.cand:front(ptr?ptr.x:null);if(!c)return;sortCandy(c,dir);}
function sortCandy(c,dir){
 const s=S,p=candyPos(c),tg=dir>0?boxPos():potPos();c.done=true;c.fly={t:0,x0:p.x,y0:p.y,x1:tg.x,y1:tg.y-tg.s*.18,dir};
 const isMimic=c.type==='mimic',morphed=isMimic&&c.y>=c.morphAt;
 if(c.good&&dir>0){ // ถูก: ของดีลงกล่อง
  s.combo++;const m=mult();let add=PTS[c.type]||PTS.good;
  if(c.type==='heart')s.st.heart++;if(c.type==='clock')s.st.clock++;
  if(c.type==='gold'){s.st.gold++;s.bonus=s.goldVal;s.flash=.45;s.flashCol='#ffe9a8';burst(tg.x,tg.y-40,'#ffd27a',50,420);floatText(tg.x-30,tg.y-120,'🌟 +'+fmt(s.goldVal),'#ffd27a',true);banner('🌟 ลูกกวาดทอง!','โบนัส +'+fmt(s.goldVal),'#ffd27a',2);add=0;}
  if(c.type==='heart'){if(s.hearts<3){s.hearts++;floatText(tg.x,tg.y-110,'+1 ❤️','#ff8fa3',true);}else add+=160;}
  if(c.type==='clock'){s.slow=6;floatText(tg.x,tg.y-110,'⏳ ช้าลง 6 วิ','#bfe3ff',true);}
  if(add){s.pts+=Math.round(add*m);floatText(tg.x+rnd(-14,14),tg.y-100,'+'+fmt(add*m),'#ffe08a');}
  s.st.good++;if(s.order&&c.img===s.order.kind){s.order.got++;if(s.order.got>=s.order.need)orderDone();}
  bossFace(1);setTimeout(()=>burst(tg.x,tg.y-tg.s*.2,'#ffd76a',14),330);
 }else if(!c.good&&dir<0){ // ถูก: ของร้ายลงหม้อ
  s.combo++;const m=mult(),k=c.type==='fake'?'fake':isMimic?'mimic':c.type==='bomb'?'bomb':'cursed',add=PTS[k];
  s.pts+=Math.round(add*m);s.st[k==='cursed'?'bad':k]++;
  floatText(tg.x+rnd(-14,14),tg.y-100,(k==='fake'?'🎭 จับได้! ':isMimic&&!morphed?'🔄 ตาไว! ':'')+'+'+fmt(add*m),k==='fake'||isMimic?'#d9b3ff':'#a8ffcf',k==='fake'||isMimic);
  bossFace(1);setTimeout(()=>{smokePuff(tg.x,tg.y-tg.s*.25,1);},330);
 }else{ // ผิด
  s.combo=0;s.st.wrong++;
  if(c.good){s.pts-=PEN.wrongGood;floatText(tg.x,tg.y-100,'−'+PEN.wrongGood+' ของดีหาย!','#ff9db0',true);if(c.type==='gold'){floatText(HX,TOP+L*.4,'ลูกกวาดทองละลาย…','#ffd27a',true);}}
  else{s.pts-=PEN.wrongBad;loseHeart(c.type==='fake'?'🎭 ของปลอม!':isMimic?'🔄 แปลงร่าง!':'☠️ ต้องคำสาป!',tg);}
  bossFace(3);
 }
 if(s.combo>s.maxCombo)s.maxCombo=s.combo;
 if(s.combo&&s.combo%10===0){floatText(HX,END+20,'🔥 คอมโบ '+s.combo+' ×'+mult().toFixed(1),'#ffb347',true);bossFace(2);}
 updateHud(true);
}
const mult=()=>1+Math.min(1,S.combo/20);
function loseHeart(msg,at){const s=S;s.hearts--;s.st.lost++;s.shake=.45;s.flash=.45;s.flashCol='#ff3b5c';floatText(at.x,at.y-120,msg,'#ff6b81',true);floatText(at.x,at.y-88,'−1 ❤️','#ff6b81');bossFace(3);if(navigator.vibrate)try{navigator.vibrate(90);}catch(e){}
 if(s.hearts<=0&&!s.ended){s.ended=true;s.win=false;s.endT=1.3;}}
function orderDone(){const s=S;s.orders++;floatText(W*.78,TOP+70,'📋 ออเดอร์สำเร็จ +'+fmt(ORDER_PTS),'#ffe08a',true);burst(W*.8,TOP+40,'#ffd27a',30,300);s.order=null;s.nextOrder=R(ST.evt,8,14);bossFace(2);}
function bossFace(f){S.boss=f;S.bossT=f?1:0;}

/* ---------- ตัวป่วน ---------- */
function startCat(){const side=ST.evt()<.5?-1:1;S.cat={side,ph:'run',t:0,x:side<0?-60:W+60,y:TOP+L*R(ST.evt,.42,.62),grab:null};floatText(side<0?70:W-70,S.cat.y-50,'🐈‍⬛ แตะไล่!','#fff',true);}
function shooCat(){const k=S.cat;if(!k||k.ph!=='run')return;k.ph='flee';k.t=0;S.pts+=80;S.st.shoo++;floatText(k.x,k.y-50,'ชิ่ว! +80','#a8ffcf',true);burst(k.x,k.y,'#ffffff',12);updateHud(true);}
function catLogic(dt){
 const s=S,k=s.cat;
 if(!k){if(s.shift>=1&&!s.ended){s.nextCat-=dt;if(s.nextCat<=0){s.nextCat=R(ST.evt,14,24);startCat();}}return;}
 k.t+=dt;
 if(k.ph==='run'){const sx=k.side<0?-60:W+60,tx=k.side<0?HX-beltW()/2-10:HX+beltW()/2+10;k.x=lerp(sx,tx,clamp(k.t/2.4,0,1));
  if(k.t>=2.4){k.ph='grab';k.t=0;let best=null,bd=9;for(const c of s.c){if(c.done||!c.good||c.y<0)continue;const d=Math.abs(TOP+c.y*L-k.y)/L;if(d<bd){bd=d;best=c;}}
   if(best&&bd<.3){best.done=true;best.stolen=true;k.grab=best;s.pts-=PEN.cat;s.st.cat++;s.combo=0;floatText(k.x,k.y-60,'แมวขโมย! −'+PEN.cat,'#ff9db0',true);bossFace(3);updateHud(true);}}}
 else if(k.ph==='grab'){if(k.t>.55){k.ph='flee';k.t=0;}}
 else if(k.ph==='flee'){k.x+=(k.side<0?-1:1)*dt*W*1.1;if(k.x<-120||k.x>W+120)s.cat=null;}
}
function ghostLogic(dt){
 const s=S;if(s.dark>0)s.dark-=dt;
 if(!s.ghost){if(s.shift>=2&&!s.ended){s.nextGhost-=dt;if(s.nextGhost<=0){s.nextGhost=R(ST.evt,16,26);s.ghost={t:0};}}return;}
 const g=s.ghost;g.t+=dt;if(g.t>1.3&&!g.blown){g.blown=true;s.dark=6;banner('👻 ผีปิดไฟ!','ใช้นิ้วส่องไฟหาของต้องคำสาป','#c79bff',1.6);}
 if(g.t>7.5)s.ghost=null;
}
function joltLogic(dt){
 const s=S;if(s.jolt>0)s.jolt-=dt;if(s.joltWarn>0){s.joltWarn-=dt;if(s.joltWarn<=0)s.jolt=1.6;}
 if(s.shift>=2&&!s.ended&&s.jolt<=0&&s.joltWarn<=0){s.nextJolt-=dt;if(s.nextJolt<=0){s.nextJolt=R(ST.evt,14,22);s.joltWarn=.9;banner('⚡ สายพานกระตุก!','เร่งเร็วชั่วครู่','#ffe08a',1.2);}}
}
function orderLogic(dt){
 const s=S;if(s.order){s.order.t+=dt;if(s.order.t>=s.order.dur){floatText(W*.78,TOP+70,'📋 ออเดอร์หมดเวลา','#cdbbe9');s.order=null;s.nextOrder=R(ST.evt,6,10);}return;}
 if(s.shift>=1&&!s.ended){s.nextOrder-=dt;if(s.nextOrder<=0){s.order={kind:P(ST.evt,GOOD),need:Math.floor(R(ST.evt,3,5.99)),got:0,t:0,dur:20};}}
}

/* ---------- เอฟเฟกต์ ---------- */
function floatText(x,y,txt,col,big){S.float.push({x,y,txt,col,t:0,big});}
function burst(x,y,col,n,sp=220){for(let i=0;i<n*(Q?1:.5)+3;i++){const a=rnd(0,6.28),s=rnd(.3,1)*sp;S.part.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,life:rnd(.4,.8),r:rnd(2,5),col});}}
function smokePuff(x,y,k){for(let i=0;i<(Q?14:7);i++)S.smoke.push({x:x+rnd(-20,20)*k,y:y+rnd(-10,10)*k,vx:rnd(-40,40),vy:rnd(-90,-30),t:0,life:rnd(.6,1.1),r:rnd(14,30)*k,c:Math.random()<.5?'150,60,220':'90,220,120'});}
let bannerT=0;
function banner(t,s,col,dur=1.8){$('bT').textContent=t;$('bS').textContent=s||'';$('bS').style.display=s?'':'none';$('banner').style.setProperty('--bc',col||'#ffd27a');$('banner').classList.add('on');bannerT=dur;}

/* ---------- วาด ---------- */
function drawCover(img,alpha,scale,ox,oy){if(!img.width)return;const s=Math.max(W/img.width,H/img.height)*scale;cx.save();cx.globalAlpha=alpha;cx.drawImage(img,HX+ox-img.width*s/2,H*.5+oy-img.height*s/2,img.width*s,img.height*s);cx.restore();}
function drawImg(img,x,y,w,alpha=1,rot=0,flip=false){if(!img||!img.width)return;const h=w*img.height/img.width;cx.save();cx.globalAlpha=alpha;cx.translate(x,y);if(rot)cx.rotate(rot);if(flip)cx.scale(-1,1);cx.drawImage(img,-w/2,-h/2,w,h);cx.restore();}
function frame(img,n,i,x,y,w,alpha=1,flip=false){if(!img.width)return;const fw=img.width/n,h=w*img.height/fw;cx.save();cx.globalAlpha=alpha;cx.translate(x,y);if(flip)cx.scale(-1,1);cx.drawImage(img,i*fw,0,fw,img.height,-w/2,-h/2,w,h);cx.restore();}
function glow(x,y,r,col,a){const g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');cx.save();cx.globalAlpha=a;cx.globalCompositeOperation='lighter';cx.fillStyle=g;cx.fillRect(x-r,y-r,r*2,r*2);cx.restore();}
function hexA(h,a){const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`;}
let beltTile=null;
function makeBelt(){const b=I.belt;if(!b.width)return;const c=document.createElement('canvas');c.width=b.height;c.height=b.width;const g=c.getContext('2d');g.translate(c.width/2,c.height/2);g.rotate(Math.PI/2);g.drawImage(b,-b.width/2,-b.height/2);beltTile=c;}
function drawBelt(x,w){
 if(!beltTile)return;const sc=w/beltTile.width,th=beltTile.height*sc,off=(S.beltPos*L)%th;
 cx.save();cx.beginPath();cx.rect(x-w/2,TOP-14,w,L+40);cx.clip();
 for(let y=TOP-14-th+off;y<END+30;y+=th)cx.drawImage(beltTile,x-w/2,y,w,th);
 // เงาหัว/ท้ายสายพาน
 let g=cx.createLinearGradient(0,TOP-14,0,TOP+60);g.addColorStop(0,'rgba(10,2,20,.95)');g.addColorStop(1,'rgba(10,2,20,0)');cx.fillStyle=g;cx.fillRect(x-w/2,TOP-14,w,74);
 g=cx.createLinearGradient(0,END-40,0,END+26);g.addColorStop(0,'rgba(255,60,90,0)');g.addColorStop(1,'rgba(255,60,90,.35)');cx.fillStyle=g;cx.fillRect(x-w/2,END-40,w,66);
 cx.restore();
 // ปากเครื่องจักรด้านบน
 cx.save();const mw=w+26;const gr=cx.createLinearGradient(0,TOP-40,0,TOP);gr.addColorStop(0,'#3a1d52');gr.addColorStop(1,'#1c0b2c');cx.fillStyle=gr;rr(x-mw/2,TOP-42,mw,34,12);cx.fill();cx.strokeStyle='rgba(255,180,90,.6)';cx.lineWidth=2;cx.stroke();
 cx.fillStyle='rgba(255,190,90,.9)';for(let i=0;i<5;i++){cx.globalAlpha=.4+.6*((Math.floor(S.t*4)+i)%5===0);cx.beginPath();cx.arc(x-mw/2+16+i*(mw-32)/4,TOP-25,3.5,0,6.3);cx.fill();}
 cx.restore();
}
function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath();}
function drawTell(c,x,y,s){
 const t=S.t;cx.save();
 if(c.tell==='skull'){const r=s*.1,sx=x+s*.18,sy=y-s*.08;cx.fillStyle='#f4ecff';cx.beginPath();cx.arc(sx,sy,r,0,6.3);cx.fill();cx.fillRect(sx-r*.55,sy+r*.5,r*1.1,r*.6);cx.fillStyle='#2a0838';cx.beginPath();cx.arc(sx-r*.38,sy,r*.28,0,6.3);cx.arc(sx+r*.38,sy,r*.28,0,6.3);cx.fill();}
 else if(c.tell==='eye'){const k=(t*1.1+c.ph)%1.6;if(k<.75){const o=Math.sin(Math.min(1,k/.12)*Math.PI/2)*Math.min(1,(.75-k)/.12),ex=x-s*.12,ey=y+s*.05,rx=s*.13,ry=s*.09*o;cx.fillStyle='#fff';cx.beginPath();cx.ellipse(ex,ey,rx,Math.max(.5,ry),0,0,6.3);cx.fill();cx.fillStyle='#c4001f';cx.beginPath();cx.arc(ex+Math.sin(t*3)*rx*.3,ey,Math.min(ry,s*.05),0,6.3);cx.fill();}}
 else if(c.tell==='drip'){const dx=x+s*.05,dy=y+s*.18,L2=s*(.16+.08*Math.sin(t*2+c.ph));cx.fillStyle='rgba(70,10,80,.97)';cx.strokeStyle='rgba(160,255,120,.7)';cx.lineWidth=1.5;cx.beginPath();cx.moveTo(dx-s*.1,dy-s*.05);cx.quadraticCurveTo(dx-s*.02,dy+L2,dx,dy+L2);cx.quadraticCurveTo(dx+s*.02,dy+L2,dx+s*.1,dy-s*.05);cx.closePath();cx.fill();cx.stroke();cx.beginPath();cx.arc(dx,dy+L2+s*.04,s*.045,0,6.3);cx.fill();cx.stroke();}
 else if(c.tell==='rune'){cx.globalCompositeOperation='lighter';cx.strokeStyle='rgba(200,90,255,'+(.35+.35*Math.sin(t*5+c.ph))+')';cx.lineWidth=2;cx.beginPath();cx.arc(x,y,s*.42,0,6.3);cx.stroke();cx.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*4*Math.PI/5,px=x+Math.cos(a)*s*.42,py=y+Math.sin(a)*s*.42;i?cx.lineTo(px,py):cx.moveTo(px,py);}cx.closePath();cx.stroke();}
 cx.restore();
}
function drawCandy(c,dt){
 const s=CS(),p=c.fly?null:candyPos(c);let x,y,sc=1,rot=c.rot+Math.sin(S.t*1.6+c.ph)*.05,a=1;
 if(c.fly){const f=c.fly,k=clamp(f.t/.34,0,1);x=lerp(f.x0,f.x1,k);y=lerp(f.y0,f.y1,k)-Math.sin(k*Math.PI)*H*.12;sc=1-k*.45;rot+=k*f.dir*4;a=k>.9?(1-k)*10:1;}
 else{x=p.x;y=p.y;}
 if(c.stolen&&!c.fly)return;
 let img=c.img;
 if(c.type==='mimic'&&c.y>=c.morphAt){img=c.cursedImg;}
 if(c.type==='mimic'&&c.y<c.morphAt&&!c.fly){rot+=Math.sin(S.t*22+c.ph)*.045;}
 // เงา
 if(!c.fly){cx.save();cx.fillStyle=c.tell==='shadow'?'rgba(120,0,30,.55)':'rgba(0,0,0,.35)';cx.beginPath();cx.ellipse(x+4,y+s*.36,s*.36,s*.1,0,0,6.3);cx.fill();
  if(c.tell==='shadow'){cx.fillStyle='rgba(255,40,60,.9)';cx.beginPath();cx.arc(x-s*.08,y+s*.36,2.2,0,6.3);cx.arc(x+s*.1,y+s*.36,2.2,0,6.3);cx.fill();}cx.restore();}
 if(c.type==='gold')glow(x,y,s*.9,'rgba(255,215,120,1)',.55+.2*Math.sin(S.t*6));
 if(c.type==='bomb'&&!c.fly){const k=c.fuse/3.2;glow(x,y,s*(.7+.3*(1-k)),'rgba(255,80,40,1)',.25+.35*(1-k)*Math.abs(Math.sin(S.t*(6+14*(1-k)))));}
 // ใกล้หล่น: กะพริบเตือน
 if(!c.fly&&c.y>.82){cx.save();cx.strokeStyle='rgba(255,90,110,'+(.5+.5*Math.sin(S.t*16))+')';cx.lineWidth=3;cx.beginPath();cx.arc(x,y,s*.56,0,6.3);cx.stroke();cx.restore();}
 drawImg(I[img],x,y,s*sc,a,rot);
 if(c.tell&&!c.fly)drawTell(c,x,y,s);
 if(c.type==='bomb'&&!c.fly){const k=clamp(c.fuse/3.2,0,1);cx.save();cx.lineWidth=4;cx.strokeStyle='rgba(255,255,255,.25)';cx.beginPath();cx.arc(x,y,s*.5,0,6.3);cx.stroke();cx.strokeStyle=k<.35?'#ff4d5e':'#ffb347';cx.beginPath();cx.arc(x,y,s*.5,-Math.PI/2,-Math.PI/2+k*6.283);cx.stroke();cx.restore();if(Math.random()<.5)S.part.push({x:x+s*.18,y:y-s*.42,vx:rnd(-60,60),vy:rnd(-120,-40),t:0,life:.35,r:2,col:'#ffd27a'});}
 if(c.type==='mimic'&&c.y>=c.morphAt&&c.y<c.morphAt+.05&&!c.puffed){c.puffed=true;smokePuff(x,y,.8);}
}
function drawTargets(){
 const pp=potPos(),bp=boxPos(),t=S.t;
 glow(pp.x,pp.y-pp.s*.15,pp.s*.75,'rgba(110,255,120,1)',.22+.08*Math.sin(t*3));
 glow(bp.x,bp.y-bp.s*.15,bp.s*.75,'rgba(255,200,90,1)',.22+.08*Math.sin(t*3+1));
 drawImg(I.cauldron,pp.x,pp.y,pp.s*(1+.02*Math.sin(t*5)));drawImg(I.box,bp.x,bp.y,bp.s);
 // ฟองหม้อ
 if(Math.random()<.18)S.smoke.push({x:pp.x+rnd(-pp.s*.25,pp.s*.25),y:pp.y-pp.s*.32,vx:rnd(-8,8),vy:rnd(-40,-20),t:0,life:rnd(.6,1),r:rnd(5,10),c:'120,255,120'});
 cx.save();cx.font='800 13px Mali';cx.textAlign='center';cx.lineWidth=4;cx.strokeStyle='rgba(20,6,40,.85)';
 [[pp,'👈 ทิ้ง'],[bp,'เก็บ 👉']].forEach(([p,tx])=>{cx.strokeText(tx,p.x,p.y+p.s*.48);cx.fillStyle='#fff';cx.fillText(tx,p.x,p.y+p.s*.48);});cx.restore();
}
function drawBoss(){
 const s=S,img=I.boss;if(!img.width)return;const w=Math.min(W*.46,230),fh=img.height/(img.width/4)*w,x=HX,y=H-fh/2+6+Math.sin(s.t*2)*2;
 glow(x,H-fh*.45,w*.7,'rgba(255,190,120,1)',.18);frame(img,4,s.boss,x,y,w);
 const g=cx.createLinearGradient(0,H-fh*.18,0,H);g.addColorStop(0,'rgba(18,8,24,0)');g.addColorStop(1,'rgba(18,8,24,.55)');cx.fillStyle=g;cx.fillRect(x-w/2,H-fh*.18,w,fh*.18);
 if(s.combo>=3){cx.save();cx.font='800 '+(16+Math.min(6,s.combo/5))+'px Itim';cx.textAlign='center';cx.lineWidth=4;cx.strokeStyle='rgba(20,6,40,.9)';const tx='🔥 '+s.combo+' ×'+mult().toFixed(1),ty=H-fh-6;cx.strokeText(tx,x,ty);cx.fillStyle='#ffb347';cx.fillText(tx,x,ty);cx.restore();}
}

function drawCat(){const k=S.cat;if(!k)return;const w=CS()*1.5;
 // ภาพแมวหันขวา: วิ่งเข้าจากซ้าย = ไม่กลับ · จากขวา = กลับ
 const flip=k.ph==='flee'?k.side<0:k.side>0;
 if(k.ph==='grab'||(k.ph==='flee'&&k.grab))frame(I.catgrab,4,k.ph==='grab'?Math.min(3,1+Math.floor(k.t*5)):3,k.x,k.y,w,1,flip);
 else frame(I.cat,4,Math.floor(S.t*12)%4,k.x,k.y+Math.abs(Math.sin(S.t*12))*-4,w,1,flip);
 if(k.ph==='run'){cx.save();cx.strokeStyle='rgba(255,255,255,'+(.5+.4*Math.sin(S.t*10))+')';cx.lineWidth=2.5;cx.setLineDash([6,5]);cx.beginPath();cx.arc(k.x,k.y,w*.5,0,6.3);cx.stroke();cx.restore();}
}
function drawGhost(){const g=S.ghost;if(!g)return;const w=Math.min(W*.26,130),x=W*.8+Math.sin(g.t*2)*10,y=TOP+50+Math.sin(g.t*3)*8,a=clamp(g.t/.4,0,1)*clamp((7.5-g.t)/.6,0,1);
 const f=g.t<1.1?0:g.t<1.8?1:g.t<3?2:3;frame(I.ghost,4,f,x,y,w,a);}
function drawDark(){
 const s=S;if(s.dark<=0)return;const a=clamp(Math.min(s.dark/.4,(6.4-s.dark)/.4),0,1);
 const lx=light.x||HX,ly=light.y||TOP+L*.7,r=Math.min(W,H)*.3;
 const g=cx.createRadialGradient(lx,ly,r*.25,lx,ly,r);g.addColorStop(0,'rgba(6,0,16,0)');g.addColorStop(1,'rgba(6,0,16,.93)');
 cx.save();cx.globalAlpha=a;cx.fillStyle=g;cx.fillRect(0,0,W,H);
 cx.globalCompositeOperation='lighter';for(const c of s.c){if(c.done||c.y<0)continue;if(c.type==='cursed'||c.type==='bomb'||(c.type==='mimic'&&c.y>=c.morphAt)){const p=candyPos(c);const gg=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,CS()*.6);gg.addColorStop(0,'rgba(255,40,70,.5)');gg.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gg;cx.fillRect(p.x-CS(),p.y-CS(),CS()*2,CS()*2);}}
 cx.restore();
}
function drawOrder(){const o=S.order;if(!o)return;const w=Math.min(W*.3,120),x=W-w/2-10,y=TOP+w*.42+6;
 cx.save();drawImg(I.ticket,x,y,w,.96);drawImg(I[o.kind],x-w*.14,y+2,w*.34);cx.font='800 '+Math.round(w*.17)+'px Itim';cx.textAlign='left';cx.lineWidth=4;cx.strokeStyle='rgba(60,25,0,.6)';const tx=o.got+'/'+o.need;cx.fillStyle='#5a2a00';cx.fillText(tx,x+w*.06,y+w*.08);
 const k=1-o.t/o.dur;cx.fillStyle='rgba(0,0,0,.25)';cx.fillRect(x-w*.32,y+w*.26,w*.64,5);cx.fillStyle=k<.3?'#ff4d5e':'#ff9d3c';cx.fillRect(x-w*.32,y+w*.26,w*.64*k,5);cx.restore();}
function drawParts(dt){cx.save();cx.globalCompositeOperation='lighter';for(let i=S.part.length-1;i>=0;i--){const q=S.part[i];q.t+=dt;if(q.t>q.life){S.part.splice(i,1);continue;}q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.92;q.vy*=.92;cx.globalAlpha=1-q.t/q.life;cx.fillStyle=q.col;cx.beginPath();cx.arc(q.x,q.y,q.r*(1-q.t/q.life*.5),0,6.3);cx.fill();}cx.restore();
 cx.save();for(let i=S.smoke.length-1;i>=0;i--){const q=S.smoke[i];q.t+=dt;if(q.t>q.life){S.smoke.splice(i,1);continue;}q.x+=q.vx*dt;q.y+=q.vy*dt;const k=q.t/q.life,r=q.r*(1+k*1.4);const g=cx.createRadialGradient(q.x,q.y,0,q.x,q.y,r);g.addColorStop(0,'rgba('+q.c+','+(.5*(1-k))+')');g.addColorStop(1,'rgba('+q.c+',0)');cx.fillStyle=g;cx.fillRect(q.x-r,q.y-r,r*2,r*2);}cx.restore();}
function drawFloats(dt){for(let i=S.float.length-1;i>=0;i--){const f=S.float[i];f.t+=dt;if(f.t>1.1){S.float.splice(i,1);continue;}const k=f.t/1.1;cx.save();cx.globalAlpha=1-k*k;cx.font=`800 ${f.big?24:19}px Itim`;cx.textAlign='center';cx.lineWidth=5;cx.strokeStyle='rgba(20,6,40,.85)';const y=f.y-k*60,sc=f.t<.12?.6+f.t/.12*.5:1.1-Math.min(.1,(f.t-.12));cx.translate(clamp(f.x,90,W-90),y);cx.scale(sc,sc);cx.strokeText(f.txt,0,0);cx.fillStyle=f.col;cx.fillText(f.txt,0,0);cx.restore();}}

function render(dt){
 const s=S,sh=SHIFTS[s.shift];
 cx.setTransform(DPR,0,0,DPR,0,0);cx.fillStyle='#120818';cx.fillRect(0,0,W,H);
 const shk=s.shake>0?s.shake*12:0;cx.save();cx.translate(rnd(-shk,shk),rnd(-shk,shk));
 drawCover(I.bg,1,1.04+Math.sin(s.t*.3)*.01,0,0);
 // แสงตามกะ
 const darkA=s.trans>0&&s.shift>0?lerp(SHIFTS[s.shift-1].dark,sh.dark,1-s.trans):sh.dark;
 if(darkA>0){cx.fillStyle='rgba(12,2,28,'+darkA+')';cx.fillRect(0,0,W,H);}
 if(s.shift>=2){const vg=cx.createRadialGradient(HX,H*.55,Math.min(W,H)*.35,HX,H*.55,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(5,0,15,.75)');cx.fillStyle=vg;cx.fillRect(0,0,W,H);}
 glow(W*.5,H*.12,Math.max(W,H)*.55,hexA(sh.tint,1),.16+(s.shift===3?.06*Math.sin(s.t*7)*(Math.random()<.1?3:1):0));
 if(s.shift===3)glow(W*.15,H*.4,W*.6,'rgba(255,40,60,1)',.06+.05*Math.sin(s.t*3));
 // สายพาน
 if(s.laneK<=0)drawBelt(HX,laneW());else{drawBelt(laneX(0),laneW());drawBelt(laneX(1),laneW());}
 if(s.jolt>0||s.joltWarn>0){cx.save();cx.globalCompositeOperation='lighter';cx.strokeStyle='rgba(255,230,120,'+(.4+.4*Math.sin(s.t*30))+')';cx.lineWidth=3;const bw=beltW();cx.strokeRect(HX-bw/2-4,TOP-8,bw+8,L+16);cx.restore();}
 drawTargets();drawBoss();
 for(const c of s.c)if(!c.fly)drawCandy(c,dt);
 drawCat();
 for(const c of s.c)if(c.fly)drawCandy(c,dt);
 drawParts(dt);drawDark();drawGhost();drawFloats(dt);
 cx.restore();
 if(s.slow>0){cx.save();cx.fillStyle='rgba(120,190,255,'+(.08+.04*Math.sin(s.t*4))+')';cx.fillRect(0,0,W,H);cx.restore();}
 if(s.flash>0){cx.save();cx.globalAlpha=Math.min(.55,s.flash);cx.fillStyle=s.flashCol;cx.fillRect(0,0,W,H);cx.restore();}
 if(s.trans>0){cx.save();cx.globalAlpha=Math.max(0,s.trans-.3);cx.fillStyle='#fff';cx.fillRect(0,0,W,H);cx.restore();}
}

/* ---------- วนเกม ---------- */
let last=0,fpsAcc=0,fpsN=0,fpsT=0;
function loop(ts){
 requestAnimationFrame(loop);
 let dt=Math.min(.05,(ts-last)/1000||0);last=ts;
 if(!S)return;
 if(S.run&&!S.paused)step(dt);
 render(S.run&&!S.paused?dt:0);
 fpsAcc+=dt;fpsN++;fpsT+=dt;if(fpsT>2.5){const fps=fpsN/fpsAcc;if(fps<42&&Q){Q=0;fit();}fpsAcc=0;fpsN=0;fpsT=0;}
}
function step(dt){
 if(!(dt>0))return;const s=S;
 if(s.ended){s.endT-=dt;dt*=s.win?1:.3;if(s.endT<=0){finish();return;}}
 else s.t+=dt;
 const si=shiftAt(s.t);
 if(si!==s.shift&&!s.ended){s.shiftPts+=SHIFT_BONUS[s.shift]||0;if(SHIFT_BONUS[s.shift])floatText(HX,TOP+L*.3,'ผ่าน'+SHIFTS[s.shift].n+' +'+fmt(SHIFT_BONUS[s.shift]),'#a8ffcf',true);
  s.shift=si;s.trans=1;const z=SHIFTS[si];banner(z.ic+' '+z.n,si===1?'มีของปลอม + ออเดอร์ + แมวขโมย':si===2?'ผีปิดไฟ · ลูกกวาดแปลงร่าง · ระเบิด':'สายพาน 2 เลน! เร็วสุด',z.col,2.4);
  if(z.lanes===2){s.quiet=2.2;}}
 if(s.t>=PASS_T&&!s.passed){s.passed=true;banner('✅ ผ่านเกณฑ์แล้ว!','ได้กุศลบวกแน่นอน +15,000 ขึ้นไป','#6ff0b5',2);burst(HX,TOP+L*.4,'#6ff0b5',40,400);}
 while(!s.ended&&s.cpI<CANDY.CPS.length&&s.t>=CANDY.CPS[s.cpI]){s.cpI++;if(FR&&s.round)FR.checkpoint(snap());}
 if(s.t>=TOTAL_T&&!s.ended){s.shiftPts+=SHIFT_BONUS[3];s.ended=true;s.win=true;s.endT=1.4;s.flash=.6;s.flashCol='#ffffff';banner('🎉 เลิกงานแล้ว!','ครบ 4 กะ','#ffd27a',2);for(const c of s.c)c.done=true;}
 // สองเลน
 const wantK=SHIFTS[s.shift].lanes===2?1:0;if(s.laneK!==wantK&&s.quiet<1.6){s.laneK=clamp(s.laneK+(wantK?1:-1)*dt*1.2,0,1);}s.lanes=s.laneK>=1?2:1;
 for(const k of ['shake','flash','trans','slow'])s[k]=Math.max(0,s[k]-dt);
 if(s.bossT>0){s.bossT-=dt;if(s.bossT<=0)s.boss=0;}
 if(bannerT>0){bannerT-=dt;if(bannerT<=0)$('banner').classList.remove('on');}
 if(!s.ended){spawnLogic(dt);catLogic(dt);ghostLogic(dt);joltLogic(dt);orderLogic(dt);}else if(s.cat)catLogic(dt);
 const sh=SHIFTS[s.shift],ramp=1+.2*((s.t%SHIFT_LEN)/SHIFT_LEN),spd=ramp/sh.travel*(s.slow>0?.6:1)*(s.jolt>0?1.7:1);
 s.beltPos+=spd*dt;
 for(let i=s.c.length-1;i>=0;i--){const c=s.c[i];
  if(c.fly){c.fly.t+=dt;if(c.fly.t>.4)s.c.splice(i,1);continue;}
  if(c.done){if(c.stolen||s.ended)s.c.splice(i,1);continue;}
  c.y+=spd*dt;
  if(c.type==='bomb'){c.fuse-=dt;if(c.fuse<=0){const p=candyPos(c);s.c.splice(i,1);s.pts-=PEN.bomb;s.combo=0;s.st.wrong++;burst(p.x,p.y,'#ff8a3d',40,420);smokePuff(p.x,p.y,1.2);loseHeart('💣 ระเบิด! −'+PEN.bomb,p);updateHud(true);continue;}}
  if(c.y>1.04){s.c.splice(i,1);const p={x:laneX(c.lane),y:END};s.combo=0;s.st.miss++;
   if(c.good){if(c.type!=='heart'&&c.type!=='clock'){s.pts-=PEN.missGood;floatText(p.x,p.y-30,c.type==='gold'?'ลูกกวาดทองหล่นหาย!':'หล่น −'+PEN.missGood,'#ff9db0');}}
   else{s.pts-=PEN.missBad;loseHeart('☠️ หลุดลงกล่อง! −'+PEN.missBad,p);}
   bossFace(3);updateHud(true);}
 }
 updateHud(false);
}

/* ---------- HUD ---------- */
let hudScore=null,hudH=-1,hudC='';
function liveTotal(){return scoreOf(S).total;}
function updateHud(bump){
 const s=S;if(hudH!==s.hearts){hudH=s.hearts;$('hearts').innerHTML=[0,1,2].map(i=>'<span class="'+(i<s.hearts?'':'off')+'">❤️</span>').join('');}
 const left=Math.max(0,SHIFT_LEN-(s.t%SHIFT_LEN)),cl=SHIFTS[s.shift].ic+' '+SHIFTS[s.shift].n+'|'+Math.floor(left/60)+':'+String(Math.floor(left%60)).padStart(2,'0');
 if(cl!==hudC){hudC=cl;const [a,b]=cl.split('|');$('distV').textContent=a;$('clk').textContent='เหลือ '+b;}
 const live=liveTotal();
 if(live!==hudScore){hudScore=live;$('scoreV').textContent=sgn(live);$('score').style.color=live<0?'#ffb3c0':'';if(bump){$('score').classList.remove('bump');void $('score').offsetWidth;$('score').classList.add('bump');}}
 const k=Math.min(1,s.t/TOTAL_T);$('pfill').style.width=(k*100)+'%';$('pme').style.left=(k*100)+'%';
 const fx=[];if(!s.passed)fx.push('<span class="chip">🚩 ถึงธงก่อนได้กุศลบวก</span>');if(s.slow>0)fx.push('<span class="chip">⏳ ช้า '+Math.ceil(s.slow)+'</span>');if(s.dark>0)fx.push('<span class="chip bad">👻 ไฟดับ '+Math.ceil(s.dark)+'</span>');if(s.jolt>0)fx.push('<span class="chip bad">⚡ กระตุก</span>');if(s.order){const o=s.order,left=Math.ceil(o.dur-o.t);fx.push('<span class="chip" style="border-color:#ffd27a">📋 <img src="'+IMG[o.kind]+'"> '+o.got+'/'+o.need+' · '+left+' วิ</span>');}
 const h=fx.join('');if($('fx').dataset.h!==h){$('fx').innerHTML=h;$('fx').dataset.h=h;}
}
function buildProg(){const p=$('prog');p.querySelectorAll('.tick,.flag').forEach(e=>e.remove());
 [1,2,3].forEach(i=>{const t=document.createElement('div');t.className='tick';t.style.left=(i*25)+'%';t.style.background=SHIFTS[i].col;p.appendChild(t);});
 const f=document.createElement('div');f.className='flag';f.style.left='50%';f.textContent='🚩';p.appendChild(f);$('pgate').textContent='🎁';}

/* ---------- พักเกม ---------- */
let pauseAt=0;
function pauseGame(){if(!S||!S.run||S.paused||S.ended)return;S.paused=1;pauseAt=performance.now();$('pause').classList.remove('hide');tickPause();}
function tickPause(){if(!S.paused)return;const used=S.pauseUsed+(performance.now()-pauseAt)/1000,left=Math.max(0,PAUSE_BUDGET-used);$('pBudget').textContent='พักได้อีก '+Math.floor(left/60)+':'+String(Math.floor(left%60)).padStart(2,'0')+' นาที (รวมทั้งรอบ)';if(left<=0){S.pauseUsed=PAUSE_BUDGET;$('pause').classList.add('hide');S.paused=0;finish(true);return;}setTimeout(tickPause,500);}
function resume(){if(!S.paused)return;S.pauseUsed+=(performance.now()-pauseAt)/1000;$('pause').classList.add('hide');countdown(()=>{S.paused=0;});}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame();});
$('pauseBtn').onclick=pauseGame;$('resume').onclick=resume;
$('quit').onclick=()=>{S.pauseUsed+=(performance.now()-pauseAt)/1000;$('pause').classList.add('hide');S.paused=0;finish(false,true);};
function countdown(done){const c=$('count');c.classList.remove('hide');let n=3;const tick=()=>{if(n===0){c.classList.add('hide');done();return;}c.textContent=n;c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');n--;setTimeout(tick,700);};tick();}

/* ---------- เริ่ม/จบ (เซิร์ฟเวอร์เปิดรอบ → เล่น → ส่งผล → เซิร์ฟเวอร์คิดกุศล) ---------- */
function startRun(round){
 newRun(round);buildProg();hudH=-1;hudC='';hudScore=null;light={x:HX,y:TOP+L*.7};
 $('start').classList.add('hide');$('result').classList.add('hide');$('hud').classList.remove('hide');fit();updateHud(false);
 const z=SHIFTS[S.shift];banner(z.ic+' '+z.n,'👈 ปัดซ้ายทิ้งหม้อ · ปัดขวาใส่กล่อง 👉',z.col,2.6);
 countdown(()=>{S.run=true;});
}
let resTimer=null,lastMaxCombo=0;
function finish(timeout,quit){
 const s=S;if(s.done)return;s.done=true;s.run=false;s.ended=true;lastMaxCombo=s.maxCombo;
 if(s.t>best){best=s.t;try{localStorage.setItem('candy-best',String(Math.round(best)));}catch(e){}}
 $('hud').classList.add('hide');$('banner').classList.remove('on');$('pause').classList.add('hide');
 const report={...snap(),quit:!!(quit||timeout)};
 showWaiting(timeout?'หมดเวลาพัก':'');
 FR.finish(report);
}
function showWaiting(title,stale){
 if(stale)lastMaxCombo=0;
 $('resBox').innerHTML='<div class="waitbox"><div class="spin"></div><h2>'+(title||(stale?'📮 กำลังปิดรอบ…':'📮 กำลังส่งผล…'))+'</h2><div class="sub">รอเซิร์ฟเวอร์ตรวจคะแนนสักครู่</div></div>';
 $('start').classList.add('hide');$('result').classList.remove('hide');$('result').scrollTop=0;
}
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function showFinishError(msg){
 clearInterval(resTimer);
 $('resBox').innerHTML='<div class="errbox"><div class="em">😵</div><h2>ส่งผลไม่สำเร็จ</h2><div class="sub">'+esc(msg)+'</div>'+
  (FR.canRetry()?'<button class="go" id="retryBtn">🔁 ส่งผลอีกครั้ง</button>':'')+'<button class="btn2" id="backBtn">🎮 กลับหน้ามินิเกม</button></div>';
 $('result').classList.remove('hide');
 if($('retryBtn'))$('retryBtn').onclick=()=>{showWaiting();FR.retry();};
 $('backBtn').onclick=backToStart;
}
const tm=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
/* หน้าผล: ใช้ตัวเลขจากเซิร์ฟเวอร์ (result.breakdown) เท่านั้น */
function showResult(res){
 const b=res&&res.breakdown||{},r=b,total=Number(res&&res.gain!=null?res.gain:b.total)||0,t=+b.t||0;
 const st={good:0,bad:0,fake:0,mimic:0,bomb:0,wrong:0,miss:0,cat:0,...(b.st||{})};
 if(t>best){best=t;try{localStorage.setItem('candy-best',String(Math.round(best)));}catch(e){}}
 const row=(ic,lb,sub,v,cls)=>'<div class="row">'+(isImg(ic)?'<img src="'+ic+'" alt="">':'<span class="em">'+ic+'</span>')+'<div class="lb">'+lb+(sub?'<small>'+sub+'</small>':'')+'</div><div class="v '+cls+'">'+v+'</div></div>';
 const right=st.good+st.bad+st.fake+st.mimic+st.bomb;
 const k=Math.min(1,t/TOTAL_T),bk=Math.min(1,best/TOTAL_T),shiftSub=r.fin?'กะค่ำ + กะเที่ยงคืน':r.shiftPts?'กะค่ำ':'—';
 let rows='';
 if(!r.passed){rows=row('⏱️','ทำงานได้ '+tm(t)+' นาที','ยังไม่ถึงธง (ต้องครบ 2 กะ = '+tm(PASS_T)+')',sgn(total),'neg')+
   row(IMG.box,'คัดถูก ×'+right,'ไม่นับ เพราะยังไม่ถึงเกณฑ์','—','dim');}
 else{const perf=(+r.perf||0)+(+b.extraPen||0);
  rows=row('🚩','ผ่านเกณฑ์ (ครบ 2 กะ)','ทำงานได้ '+tm(t)+' นาที',sgn(BASE_WIN),'pos')+
   row(IMG.box,'คัดถูก ×'+right,'ของดี '+st.good+' · ของร้าย '+st.bad+' · ของปลอม '+st.fake+' · แปลงร่าง '+st.mimic+' · ระเบิด '+st.bomb+(lastMaxCombo?' · คอมโบสูงสุด '+lastMaxCombo:''),'','dim')+
   row('🎯','แต้มจากการคัด','รวมคอมโบ หักที่พลาดแล้ว',sgn(perf),perf>=0?'pos':'neg')+
   (b.abandoned&&b.extraPen?row('📴','หัวใจที่เหลือ','ปิดเกมกลางคัน คิดเหมือนพลาดจนหมด',sgn(-b.extraPen),'neg'):'')+
   row(IMG.ticket,'ออเดอร์สำเร็จ ×'+(b.orders|0),'',b.orders?sgn(r.orderPts):'—',b.orders?'pos':'dim')+
   row('🏅','ผ่านกะ',shiftSub,r.shiftPts?sgn(r.shiftPts):'—',r.shiftPts?'pos':'dim')+
   (r.capped?row('📦','เพดานรอบปกติ','สูงสุด +'+fmt(MAX_WIN),'','dim'):'')+
   row(IMG.gold,'ลูกกวาดทอง',r.bonus?'โบนัสหายาก!':b.gold?'หลุดมือไป…':'ไม่ได้เจอรอบนี้',r.bonus?sgn(r.bonus):'—',r.bonus?'pos':'dim');}
 const miss='พลาด '+st.wrong+' · หล่น '+st.miss+' · แมวขโมย '+st.cat;
 $('resBox').innerHTML=
  '<img class="hero" src="'+(total>=0?IMG.win:IMG.lose)+'" alt="">'+
  '<h2>'+(b.abandoned?'ปิดรอบที่ค้างไว้':r.fin?'เลิกงานครบ 4 กะ! 🎉':b.quit&&!st.lost?'จบกะนี้แล้ว':total>=0?'ทำงานเก่งมาก!':'โดนคำสาปซะแล้ว')+'</h2>'+
  '<div class="sub">ทำงานได้ <b style="color:#fff;font-size:16px">'+tm(t)+'</b> นาที · สถิติ '+tm(best)+' · '+miss+'</div>'+
  '<div class="rprog"><div class="fill" style="width:'+(k*100)+'%"></div><div class="th" style="left:50%"><span>🚩 2 กะ</span></div><div class="best" style="left:'+(bk*100)+'%">🏆</div></div>'+
  '<div class="rows">'+rows+'</div>'+
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
 const strip=(ks,cls)=>'<div class="strip '+cls+'">'+ks.map(k=>'<img src="'+IMG[k]+'" alt="">').join('')+'</div>';
 const sec=(t,amt,cls)=>'<div class="sec">'+t+(amt?'<span class="amt '+cls+'">'+amt+'</span>':'')+'</div>';
 $('t-how').innerHTML='<div class="legend"><div class="l"><img src="'+IMG.cauldron+'">👈 ปัดซ้าย<br>ทิ้งลงหม้อ</div><div class="r"><img src="'+IMG.box+'">ปัดขวา 👉<br>ใส่กล่อง</div></div>'+
  '<div class="grid" style="margin-top:8px">'+tile('❤️','หัวใจ 3 ดวง','','','ใส่ผิดกล่อง −1')+tile('🔥','คอมโบ','สูงสุด ×2','pos','ถูกติดกัน 20')+tile('⏱️','4 กะ','กะละ 55 วิ','gold','')+'</div>'+
  sec('🏭 ยิ่งดึก ยิ่งเร็ว ยิ่งยาก')+'<div class="grid two">'+SHIFTS.map((z,i)=>tile(z.ic,z.n,'','','<div class="tags">'+(i===0?'<span>🍬 ของดี</span><span>☠️ ของร้าย</span>':i===1?'<span>🎭 ของปลอม</span><span>📋 ออเดอร์</span><span>🐈‍⬛ แมว</span>':i===2?'<span>🔄 แปลงร่าง</span><span>💣 ระเบิด</span><span>👻 ปิดไฟ</span>':'<span>🛤️ 2 เลน</span><span>🚀 เร็วสุด</span>')+'</div>')).join('')+'</div>';
 $('t-obs').innerHTML=sec('🎁 ของดี → ปัดขวา','+40','pos').replace('class="sec"','class="sec" style="margin-top:2px"')+strip(GOOD,'good')+
  sec('🧪 ของต้องคำสาป → ปัดซ้าย','+60','pos')+strip(CURSED,'bad')+
  sec('🎭 ตัวหลอก → ปัดซ้าย')+'<div class="grid">'+
   tile(IMG.lolli,'ของปลอม','+120','pos','<div class="tags"><span>💀</span><span>👁️</span><span>💧</span><span>🔯</span><span>👣</span></div>',false,'badimg')+
   tile(IMG.ghostcandy,'แปลงร่าง','+120','pos','สั่น → กลายร่าง',false,'badimg')+
   tile(IMG.bomb,'ระเบิด','+100','pos','⏱️ ทิ้งก่อนตูม',false,'badimg')+'</div>'+
  sec('✨ ของพิเศษ → ปัดขวา')+'<div class="grid">'+tile(IMG.heart,'หัวใจ','+1 ❤️','pos','')+tile(IMG.clock,'นาฬิกา','⏳ ช้า 6 วิ','pos','')+tile(IMG.gold,'ลูกกวาดทอง','+10k~50k','gold','',true,'')+'</div>';
 $('t-get').innerHTML=sec('😈 ตัวป่วน').replace('class="sec"','class="sec" style="margin-top:2px"')+'<div class="grid two">'+tile(IMG.ticket,'ใบออเดอร์','+1,500','pos','คัดครบก่อนหมดเวลา')+tile('🐈‍⬛','แมวดำ','แตะไล่ +80','pos','ปล่อยไว้ −150')+tile('👻','ผีปิดไฟ','6 วิ','neg','👆 ใช้นิ้วส่องไฟ')+tile('⚡','สายพานกระตุก','1.6 วิ','neg','เร่งเร็วกะทันหัน')+'</div>'+
  sec('❌ พลาดแล้วโดนหัก')+'<div class="grid">'+tile('🎁','ของร้าย→กล่อง','−400 · ❤️','neg','')+tile('🧪','ของดี→หม้อ','−150','neg','')+tile('⬇️','หล่นปลายทาง','−100~300','neg','ของร้ายหล่น ❤️')+'</div>';
 $('t-prize').innerHTML='<div class="rbar" style="background:linear-gradient(90deg,#ff5a78 0%,#ff9db0 30%,#fff2 31%,#8ff0c7 32%,#57e6a4 92%,#ffd27a 100%)"><span class="m" style="left:31%"></span>'+
  '<span class="l t" style="left:6%">−20,000</span><span class="l t" style="left:31%">🚩 +15,000</span><span class="l t" style="left:92%">+50,000</span>'+
  '<span class="l b" style="left:6%">💥 ตายเร็ว</span><span class="l b" style="left:31%">ครบ 2 กะ</span><span class="l b" style="left:92%">🏆 ครบ 4 กะ</span></div>'+
  '<div class="facts">'+tile('🚩','ไม่ถึง 2 กะ','−20k → −5k','neg','อยู่นาน ลบน้อย')+tile('🎯','ผ่านเกณฑ์','+15k → +50k','pos','แต้มคัด · คอมโบ · ออเดอร์')+tile(IMG.gold,'โบนัสทอง','+10k~50k','gold','นานๆ ออกที',true)+'</div>'+
  sec('🎯 แต้มคัด (ได้หลังผ่านเกณฑ์)')+'<div class="grid">'+tile('🍬','ของดี','+40','pos','')+tile('☠️','ของร้าย','+60','pos','')+tile('🎭','ตัวหลอก','+120','pos','')+tile('📋','ออเดอร์','+1,500','pos','')+tile('🌙','ผ่านกะค่ำ','+3,000','pos','')+tile('🕛','ผ่านกะเที่ยงคืน','+5,000','pos','')+'</div>'+
  '<div class="sec" style="justify-content:center;margin-top:12px">🔥 คอมโบคูณแต้มคัดได้ถึง ×2</div>';
 document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x===b));['how','obs','get','prize'].forEach(t=>$('t-'+t).classList.toggle('hide',t!==b.dataset.t));});
 $('goBtn').onclick=()=>FR.start();$('closeBtn').onclick=()=>FR.close();
}
/* รอบค้าง: แสดงจุดเช็กล่าสุดที่เซิร์ฟเวอร์จำไว้ */
function staleInfo(round){
 const cp=Array.isArray(round.cps)&&round.cps.length?round.cps[round.cps.length-1]:null;
 return '<div class="facts" style="grid-template-columns:1fr 1fr">'+tile('📍','จุดเช็กล่าสุด',cp?tm(cp.t)+' นาที':'ยังไม่มี',cp&&cp.t>=PASS_T?'pos':'neg',cp?'':'ยังทำงานไม่ถึง 0:27')+
  tile('❤️','เสียหัวใจ',cp?(cp.st&&cp.st.lost|0)+' ดวง':'—','neg','')+'</div>';
}
function ready(){
 makeBelt();$('scoreIc').src=IMG.gold;buildStart();newRun();requestAnimationFrame(loop);
 FR=mgFrame('candy',{onStarted:startRun,onResult:showResult,onFinishError:showFinishError,onSending:st=>showWaiting('',st),staleInfo});
}
})();
