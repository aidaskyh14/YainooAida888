import {CATALOG} from './catalog.js';

const IMG={"bg": "images/boat-boatrace-bg.webp", "box": "images/boat-box.webp", "boxopen": "images/boat-box-open.webp", "back": "images/boat-boatcard-back.webp", "happy": "images/honey-face-happy.webp", "oops": "images/honey-face-oops.webp", "b1": "images/boat-1.webp", "b2": "images/boat-2.webp", "b3": "images/boat-3.webp", "b4": "images/boat-4.webp", "b5": "images/boat-5.webp", "c-supply": "images/boat-boatcard-supply.webp", "c-cut": "images/boat-boatcard-cut.webp", "c-merit": "images/boat-boatcard-merit.webp", "c-stop": "images/boat-boatcard-stop.webp", "c-kick": "images/boat-boatcard-kick.webp","c2-supply": "images/boat-card2-supply.webp","c2-cut": "images/boat-card2-cut.webp","c2-merit": "images/boat-card2-merit.webp","c2-stop": "images/boat-card2-stop.webp","c2-kick": "images/boat-card2-kick.webp","c2-pull": "images/boat-card2-pull.webp","c2-swap": "images/boat-card2-swap.webp","c2-revive": "images/boat-card2-revive.webp","c2-ink": "images/boat-card2-ink.webp","c2-freeze": "images/boat-card2-freeze.webp","c2-crab": "images/boat-card2-crab.webp", "f1": "images/food-01.webp", "f2": "images/food-02.webp", "f9": "images/food-09.webp", "f10": "images/food-10.webp"};const W=941,H=1672,$=id=>document.getElementById(id);
const BOATS=[['ทุเรียน','#3E7A2E','#7CB342'],['องุ่น','#7B3FB5','#9C5BD6'],['สตรอว์เบอร์รี','#D4313B','#E85A62'],['กล้วย','#7A4A22','#E0B43A'],['มะนาว','#2F7A33','#A6C83A']];
const LINES=[50,100,150,200,250,300,350],BOXLINES=[50,100,150,200,250,300],GOAL=400;
const CARD_TIME=30000,TARGET_TIME=10*60000,MENU_MAX=8;
const BOAT_DISHES=['food-01','food-02','food-09','food-10']; // เมนูเรือเดิม (ใช้เมื่อแอดมินยังไม่ตั้งเสบียง)
const CARDS=[['supply',0,'เติมเสบียง +10','เรือของทีมเดินหน้า 10 ทันที'],['cut',0,'ตัดเสบียง −10','เลือกเรือคู่แข่ง 1 ลำ ถอยหลัง 10'],['merit',0,'กุศลทั้งทีม','ลูกเรือทุกคนในทีม คนละ 100,000 กุศล'],['stop',0,'หยุดเรือ 30 นาที','ทีมอื่นทุกทีมส่งเสบียงไม่ได้ 30 นาที'],['kick',0,'การ์ดเตะ','กวาดทุกทีมทีมละ 1 คน หรือเจาะทีมเดียว 2 คน'],['pull',0,'ดึงตัว','ดึงคู่แข่ง 1 คนมาอยู่ทีมเรา'],['swap',0,'สลับตัว','แลกลูกเรือเรา 1 คนกับคู่แข่ง 1 คน'],['revive',0,'ชุบชีวิต','ชุบคนที่โดนเตะ 1 คน กลับเรือเดิม'],['ink',0,'พ่นหมึก','พ่นหมึกใส่จอทีมคู่แข่ง 1 ลำ'],['freeze',0,'แช่แข็ง','คู่แข่ง 1 คนส่งเสบียงไม่ได้ 30 นาที'],['crab',0,'ปูหนีบ','เรือคู่แข่งต้องรอส่งเพิ่ม 10 นาที']];
/* เอฟเฟกต์ (boat-fx.js โหลดก่อนหน้านี้) — ถ้าไม่มีก็ข้ามเฉยๆ ไม่กระทบเกม */
const FX=globalThis.BoatFX||null,fx=(fn,...a)=>{try{if(FX&&typeof FX[fn]==='function')return FX[fn](...a);}catch(e){}};
const AURA={supply:'#4FE08A',cut:'#FF5A5A',merit:'#FFD24A',stop:'#5BC8FF',kick:'#FF4D7A',pull:'#9B6BFF',swap:'#FF8AD0',revive:'#7FFFE0',ink:'#8A6AC8',freeze:'#9FE3FF',crab:'#FF7A45',...(FX?.AURA||{})};
const CMAP=Object.fromEntries(CARDS.map(c=>[c[0],c]));
const CARD_TH={supply:'เติมเสบียง',cut:'ตัดเสบียง',merit:'กุศล',stop:'หยุดเรือ',kick:'เตะ',pull:'ดึงตัว',swap:'สลับตัว',revive:'ชุบชีวิต',ink:'พ่นหมึก',freeze:'แช่แข็ง',crab:'ปูหนีบ'};
const needsTarget=c=>['cut','kick','pull','swap','revive','ink','freeze','crab'].includes(c);
const cardImg=c=>IMG['c2-'+c]||IMG['c-'+c];
const Host=parent.__HOST;if(!Host)throw new Error('กรุณาเข้าเกมจากหน้าล็อกอิน');
const ME=Host.uid,ADMIN=Host.admin;
let roster=[],R=norm({}),acting=false,off=0;
function norm(w){return {startSize:{},fired:{},frozen:{},revives:0,status:'setup',p:[0,0,0,0,0],team:{},kicked:{},claims:{},menus:{},boxes:[],sent:{},cd:{},credits:{},claimedCredits:{},log:[],stopUntil:0,names:{},lastTeam:{},pausedAt:null,...w,claims:w.claims||{},menus:w.menus||{},names:w.names||{},lastTeam:w.lastTeam||{},boxes:w.boxes||[],team:w.team||{},kicked:w.kicked||{},cd:w.cd||{},sent:w.sent||{},log:w.log||[]};}
/* เวลาเซิร์ฟเวอร์: ใช้ส่วนต่างจากผลตอบกลับของคลาวด์ ไม่พึ่งนาฬิกาเครื่อง */
const SNow=()=>Date.now()+off,setOff=n=>{if(Number.isFinite(n))off=n-Date.now();};
const clock=()=>R.status==='paused'&&Number.isFinite(R.pausedAt)?R.pausedAt:SNow();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=uid=>esc(roster.find(x=>x.uid===uid)?.name||R.names?.[uid]||(uid===ME?JSON.parse(Host.get('s3user')||'{}').name:'')||'ลูกเรือ');
const myBoat=()=>R.team[ME]||0,isKicked=n=>!!R.kicked[n];
const members=b=>Object.keys(R.team).filter(n=>R.team[n]===b&&!R.kicked[n]);
const players=()=>roster.filter(p=>!p.admin);
const fmt=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const deadlineOf=b=>b.deadline??((b.pickedAt||0)+(needsTarget(b.card)?TARGET_TIME:CARD_TIME));
const thaiLog=s=>String(s).replace(/ใช้การ์ด (supply|cut|merit|stop|kick|pull|swap|revive|ink|freeze|crab)\b/g,(_,k)=>'ใช้การ์ด'+CARD_TH[k]);
async function action(input,quiet){if(acting)return null;acting=true;try{const out=await Host.cloud('boat',input);setOff(out.serverNow);if(out.race)setRace(out.race,'self');else update();if(out.meritSelf?.length)selfMerit(out.meritSelf[0],out.race);return out;}catch(e){if(!quiet)ann(e.message,true);return quiet?{error:e.message,quiet:true}:{error:e.message};}finally{acting=false;}}
/* ข้อมูลเรือชุดใหม่ (จากผลตอบกลับหรือจาก world/boat ที่ทุกคนฟังอยู่แล้ว) → เทียบกับชุดเดิมเพื่อเล่นเอฟเฟกต์ */
let firstWorld=true;
function setRace(next,src){const prev=firstWorld?null:R;firstWorld=false;const evs=fx('events',prev,next)||[];for(const e of evs)if(e.type==='box')dropIds.add(e.id);const before=prev&&prev.status==='running'?[1,2,3,4,5].map(b=>members(b).length):null;R=norm(next);update();if(evs.length)play(evs,src);if(before&&R.status==='running')[1,2,3,4,5].forEach((b,i)=>{if(before[i]>0&&members(b).length===0)setTimeout(()=>wreckFx(b),1800);});}
const ok=out=>out&&!out.error;
function open(h){$('sb').innerHTML=h;$('sheet').classList.add('on');$('shade').classList.add('on');}
function closeAll(){$('sheet').classList.remove('on');$('shade').classList.remove('on');}
/* ป๊อปอัป: ระหว่างการ์ดเตะบังคับ (forced) หน้าอื่นจะไม่ทับ และไม่มีปุ่มปิด */
let popTimer=0,forced=null;function popScreen(h,opt){if(forced&&!(opt&&opt.forced===forced))return false;clearInterval(popTimer);const p=$('pop');p.classList.add('on');p.classList.toggle('forced',!!forced);$('popBody').innerHTML=h;return true;}
function closePop(){clearInterval(popTimer);forced=null;const p=$('pop');p.classList.remove('on');p.classList.remove('forced');$('popBody').innerHTML='';update();}
$('shade').onclick=closeAll;$('popX').onclick=()=>{if(!forced)closePop();};
function fit(){const u=Math.min(innerWidth/390,innerHeight/760);document.documentElement.style.fontSize=(16*Math.max(.82,Math.min(u,1.35)))+'px';const s=$('stage'),sc=Math.min(innerWidth/W,innerHeight/H);s.style.width=W*sc+'px';s.style.height=H*sc+'px';s.style.fontSize=(W*sc/941*18)+'px'}
let at;function ann(m,err){$('aImg').src=err?IMG.oops:IMG.happy;$('aTxt').innerHTML=m;$('ann').className='ann show'+(err?' err':'');clearTimeout(at);at=setTimeout(()=>$('ann').className='ann',3000)}
const Y0=1520,Y1=230; // ล่างสุด = 0 / บนสุด = 400
const yOf=p=>Y0-(Y0-Y1)*p/GOAL;
function laneX(b,y){const t=Math.max(0,Math.min(1,(y-200)/500));const L=340+(205-340)*t,Rr=600+(735-600)*t;return L+(Rr-L)*(b-.5)/5}
const pct=(v,t)=>v/t*100+'%';

/* ฉาก: สร้างครั้งเดียว แล้วอัปเดตตำแหน่งทีละนิด เรือจึงเลื่อนนุ่ม */
let built=false,boatEls=[],lblEls={},lineEls={},giftEls=new Map(),prevP=null,prevStatus=null;const dropIds=new Set();
function build(){const s=$('stage');s.innerHTML='';s.style.backgroundImage='url('+IMG.bg+')';$('view').style.setProperty('--bg','url('+IMG.bg+')');giftEls=new Map();lblEls={};lineEls={};
 [...LINES,GOAL].forEach(L=>{const y=yOf(L),x0=laneX(.5,y)-20,x1=laneX(5.5,y)+20;const d=document.createElement('div');d.className='line'+(L===GOAL?' fin':'');Object.assign(d.style,{left:pct(x0,W),width:pct(x1-x0,W),top:pct(y,H)});s.appendChild(d);lineEls[L]=d;
  const l=document.createElement('div');l.className='lbl';l.style.left=pct(x0-4,W);l.style.top=pct(y,H);s.appendChild(l);lblEls[L]=l;});
 boatEls=BOATS.map(([nm,col],i)=>{const b=i+1,d=document.createElement('div');d.className='boat';Object.assign(d.style,{width:'4.6%',fontSize:'.62em'});
  d.style.setProperty('--d',(-i*.63)+'s');
  d.innerHTML='<span class="wake"><i></i><i></i><i></i></span><img class="hull" src="'+IMG['b'+b]+'"><span class="num" style="color:'+col+'">'+b+'</span><span class="stopv" style="display:none">🧊</span><span class="tag"></span><span class="win" style="display:none">🏁 ผู้ชนะ</span>';
  d.onclick=()=>ADMIN&&R.status==='setup'?openPick(b):openCrew(b);s.appendChild(d);return d;});
 fx('mount',s,{W,H});built=true;update();}
function update(){if(!built)return build();const now=clock();
 [...LINES,GOAL].forEach(L=>{const c=(R.claims?.[L]||[]).length;const slots=L<=100?3:2;lblEls[L].innerHTML=(L===GOAL?'🏁 ':'')+L+(BOXLINES.includes(L)?' <i>'+'✅'.repeat(Math.min(slots,c))+'🎁'.repeat(Math.max(0,slots-c))+'</i>':'');});
 BOATS.forEach((_,i)=>{const b=i+1,p=R.p[i]||0,y=yOf(p),d=boatEls[i];d.style.left=pct(laneX(b,y),W);d.style.top=pct(y,H);d.classList.toggle('mine',b===myBoat());
  const stopped=R.stopUntil>now&&R.stopBy!==b&&(R.status==='running'||R.status==='paused'),sv=d.querySelector('.stopv');sv.style.display=stopped?'':'none';if(stopped)sv.style.setProperty('--left',Math.max(0,Math.min(1,(R.stopUntil-now)/1800000)).toFixed(3));
  d.querySelector('.tag').innerHTML='🧑‍✈️'+members(b).length+' • <b>'+p+'</b>';d.querySelector('.win').style.display=R.winner===b?'':'none';});
 const waiting=new Set();
 R.boxes.filter(x=>!x.opened&&(R.status==='running'||R.status==='paused')).forEach(x=>{waiting.add(x.id);let g=giftEls.get(x.id);
  const fresh=!g;if(!g){g=document.createElement('div');g.innerHTML='<img src="'+IMG.box+'"><span class="tmr" hidden></span>';g.onclick=()=>{const box=R.boxes.find(b=>b.id===x.id);if(!box||box.opened)return;if(forced)return reopenForced();if(ADMIN)return ann('กล่องของทีมเรือ '+box.boat);if(box.boat!==myBoat())return ann('กล่องนี้เป็นของทีมเรือ '+box.boat+' นะ',1);if(isKicked(ME))return ann('คุณถูกเตะออกแล้ว เปิดกล่องไม่ได้',1);if(R.status!=='running')return ann('พักการแข่งขันอยู่ รอแข่งต่อนะ',1);openBox(box);};$('stage').appendChild(g);giftEls.set(x.id,g);}
  const y=yOf(R.p[x.boat-1]),gx=laneX(x.boat,y),same=R.boxes.filter(o=>!o.opened&&o.boat===x.boat),k=same.indexOf(x);
  g.className='gift'+(x.boat===myBoat()&&!isKicked(ME)?'':' other')+(fresh&&dropIds.has(x.id)?' drop':'');g.style.left=pct(gx+48+k*30,W);g.style.top=pct(y-40-k*20,H);
  if(fresh&&dropIds.has(x.id)){dropIds.delete(x.id);setTimeout(()=>{g.classList.remove('drop');fx('splash',gx+48+k*30,y-40-k*20+30,18);},1300);}
  // การ์ดที่หยิบแล้วรอเลือกเป้า: ป้ายนับถอยหลังให้ทุกคนเห็น
  const tm=g.querySelector('.tmr'),wait=x.picked!==undefined&&needsTarget(x.card);if(tm){tm.hidden=!wait;if(wait){tm.className='tmr'+(x.card==='kick'?' kick':'');tm.textContent=({kick:'🦶 ',cut:'🎃 ',pull:'🏴‍☠️ ',swap:'🔄 ',revive:'💫 ',ink:'🐙 ',freeze:'🧊 ',crab:'🦀 '}[x.card]||'🎴 ')+fmt(deadlineOf(x)-now);}}});
 for(const [id,g]of giftEls)if(!waiting.has(id)){g.remove();giftEls.delete(id);}
 const mb=myBoat();$('myTeam').innerHTML=ADMIN?'👑 แอดมิน • '+label(ME):(mb?(isKicked(ME)?'❌ '+label(ME)+' ถูกเตะออกจากเรือ '+mb:'🧑‍✈️ '+label(ME)+' • เรือ '+mb+' '+BOATS[mb-1][0]+((R.cd[ME]||0)>now&&R.status!=='finished'?' • พักส่ง '+fmt(R.cd[ME]-now):'')):'👀 '+label(ME)+' • รอบนี้ไม่ได้ร่วมแข่ง');
 const lk=$('lock');lk.classList.toggle('fin',R.status==='finished'&&!!R.winner);if(R.status==='finished'&&R.winner){lk.classList.add('on');lk.innerHTML='🏁 เรือ '+R.winner+' '+BOATS[R.winner-1][0]+' ชนะ! การแข่งจบแล้ว<small>รอยัยหนูเปิดรอบใหม่ • แตะเรือเพื่อดูรายชื่อและผลของแต่ละทีม</small>'}
 else if(R.status==='setup'){lk.classList.add('on');lk.innerHTML='⏳ แอดมินกำลังจัดทีมรอบใหม่<small>รอสักครู่นะ</small>'}else if(R.status==='paused'){lk.classList.add('on');lk.innerHTML='⏸️ พักการแข่งขัน<small>เวลาพักส่งและการ์ดหยุดไว้ก่อน</small>'}else lk.classList.remove('on');
 if(prevStatus==='running'&&R.status==='finished'&&!FX)confetti();
 prevP=[...R.p];prevStatus=R.status;}
function confetti(){const c=document.createElement('div');c.className='confetti';const cols=['#FFD86B','#F39AB2','#6CC9A8','#5BB6D4','#B58CE0','#fff'];
 for(let i=0;i<70;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.background=cols[i%cols.length];p.style.animationDelay=(Math.random()*1.2)+'s';p.style.animationDuration=(2.2+Math.random()*1.8)+'s';p.style.transform='rotate('+Math.random()*360+'deg)';c.appendChild(p);}
 document.body.appendChild(c);setTimeout(()=>c.remove(),5200);}

/* ส่งเสบียง */
function supplyState(b){if(R.status!=='running')return R.status==='paused'?'⏸️ พักการแข่งขันอยู่':'การแข่งขันยังไม่เปิด';if(b!==myBoat()||isKicked(ME))return '';const now=SNow();if((R.frozen?.[ME]||0)>now)return '🧊 ถูกแช่แข็ง ส่งได้อีกใน '+fmt(R.frozen[ME]-now);if(R.stopUntil>now&&R.stopBy!==b)return '⏸️ ถูกหยุด '+fmt(R.stopUntil-now);if((R.cd[ME]||0)>now)return '⏱️ ส่งได้อีกใน '+fmt(R.cd[ME]-now);return 'ok';}
function supplyHTML(b){const st=supplyState(b);if(st!=='ok')return st?'<div class="hint">'+st+'</div>':'';const game=JSON.parse(Host.get('s3all-v1')||'{}'),menus=R.menus?.[b]?.length?R.menus[b]:BOAT_DISHES;return '<div class="hint">🍱 ส่งอาหาร 1 จาน = +1 • พักส่ง 5 นาที</div>'+menus.map(key=>{const c=CATALOG.find(c=>c.k===key);if(!c)return '';const group=c.p.split('.')[0],id=c.p.slice(group.length+1),n=game.bag?.[group]?.[id]||0;return '<button class="opt" data-food="'+esc(id)+'" data-group="'+group+'" '+(n>0?'':'disabled')+'><img src="images/'+c.i+'"><b>'+esc(c.n)+'</b><span>มี '+n+'</span></button>';}).join('');}
function menuList(b){const menus=R.menus?.[b]?.length?R.menus[b]:BOAT_DISHES;return '<div class="hint">🍱 เสบียงเรือนี้: '+menus.map(k=>esc(CATALOG.find(c=>c.k===k)?.n||k)).join(' • ')+'</div>';}
function openCrew(b){const m=members(b),out=Object.keys(R.team).filter(n=>R.team[n]===b&&R.kicked[n]);
 open('<h3>🧑‍✈️ กะลาสีเรือ '+b+' '+BOATS[b-1][0]+'</h3><div class="hint">'+(R.p[b-1]||0)+'/400 • '+m.length+' คน</div>'+m.map(uid=>'<div class="mem'+(uid===ME?' me':'')+'"><b>'+((R.frozen?.[uid]||0)>SNow()?'🧊 ':'')+label(uid)+'</b><span>ส่ง '+(R.sent[uid]||0)+' จาน</span></div>').join('')+out.map(uid=>'<div class="mem out"><b>'+(R.fired?.[uid]?'💼 ':'❌ ')+label(uid)+'</b><span>'+(R.fired?.[uid]?'ถูกจ้างออก':'ถูกเตะออก')+'</span></div>').join('')+(R.status!=='setup'&&b!==myBoat()?menuList(b):'')+supplyHTML(b));
 $('sb').querySelectorAll('[data-food]').forEach(el=>el.onclick=async()=>{const out=await action({type:'supply',group:el.dataset.group,food:el.dataset.food});if(ok(out)){closeAll();ann('ส่งเสบียงสำเร็จ เรือ '+b+' +1');}});}

/* กล่องและการ์ด */
const cardName=c=>CMAP[c]?.[2]||CARD_TH[c]||c;
const auraStyle=c=>'--aura:'+(AURA[c]||'#FFE27A');
const twinkles=n=>'<div class="twk">'+Array.from({length:n},(_,i)=>'<i style="left:'+(8+(i*37)%84)+'%;top:'+(6+(i*53)%84)+'%;animation-delay:'+((i*.23)%1.6).toFixed(2)+'s"></i>').join('')+'</div>';
function openBox(box){if(box.picked!==undefined)return showPicked(box.id);
 popScreen('<div class="chestw"><div class="rays"></div>'+twinkles(9)+'<div class="chest" id="chest" style="background-image:url('+IMG.boxopen+')"></div></div><h3>🎁 กล่องจากเส้น '+box.line+'</h3><div class="hint">👆 แตะกล่องเพื่อเปิด</div>');
 $('chest').onclick=()=>{const c=$('chest');c.onclick=null;c.classList.add('shake');
  setTimeout(()=>{let f=0;const timer=setInterval(()=>{const el=$('chest');if(!el){clearInterval(timer);return;}el.style.backgroundPosition=((f%4)*100/3)+'% '+(Math.floor(f/4)*100/3)+'%';
   if(f===9){el.classList.add('burst');$('popBody').querySelector('.rays')?.classList.add('hot');fx('burstIn',el.parentNode,'#FFF3B0');const fl=document.createElement('div');fl.className='flash';$('pop').appendChild(fl);setTimeout(()=>fl.remove(),700);}
   if(f++>=15){clearInterval(timer);showCards(box);}},70);},500);};}
function cardHTML(i,front,cls,style){return '<div class="tc '+cls+'" data-index="'+i+'"'+(style?' style="'+style+'"':'')+'><div class="i"><div class="k"><img src="'+IMG.back+'"></div>'+(front?'<div class="f"><img src="'+cardImg(front)+'"></div>':'')+'</div></div>';}
function showCards(box){popScreen('<h3>✨ เลือกการ์ด 1 ใบ</h3><div class="hint">การ์ดถูกสุ่มบนเซิร์ฟเวอร์แล้ว แตะหนึ่งใบ</div><div class="cards">'+[0,1,2,3,4].map(i=>cardHTML(i,'','deal')).join('')+'</div>');
 const els=[...$('popBody').querySelectorAll('[data-index]')];els.forEach((el,i)=>{setTimeout(()=>el.classList.add('in'),60+i*120);el.onclick=()=>{els.forEach(e=>e.onclick=null);choose(box,i);};});}
async function choose(box,index){const out=await action({type:'pick',box:box.id,index});
 if(!ok(out)||!out.reveal){if(R.boxes.find(b=>b.id===box.id)?.picked!==undefined)return showPicked(box.id);return showCards(box);}
 const card=out.reveal[index];
 popScreen('<h3>🎴 พลิกการ์ด</h3><div class="cards">'+out.reveal.map((c,i)=>cardHTML(i,c,'in'+(i===index?' pick':''),i===index?auraStyle(c):'')).join('')+'</div><div class="res" id="revealTxt"></div>');
 const els=[...$('popBody').querySelectorAll('[data-index]')];setTimeout(()=>{els[index].classList.add('flip');},60);
 setTimeout(()=>{fx('burstIn',els[index],AURA[card]);const t=$('revealTxt');if(t)t.innerHTML='<b class="au" style="'+auraStyle(card)+'">'+cardName(card)+'</b>';},420);
 els.forEach((el,i)=>{if(i!==index)setTimeout(()=>el.classList.add('flip','dim'),650+i*110);});
 setTimeout(()=>{if($('pop').classList.contains('on'))showPicked(box.id);},2100);}
/* การ์ดใช้เอง (เติม/กุศล/หยุด): ใช้อัตโนมัติเมื่อครบ 30 วิ · การ์ดเลือกเป้า (ตัด/เตะ) ไปหน้าเลือกเป้าทันที */
function showPicked(id){const box=R.boxes.find(b=>b.id===id);if(!box||box.opened){closePop();return;}const card=box.card;
 if(needsTarget(card))return showTarget(id);
 const remain=()=>{const cur=R.boxes.find(b=>b.id===id)||box;return Math.ceil((deadlineOf(cur)-clock())/1000);};
 if(!popScreen('<div class="picked" style="'+auraStyle(card)+'"><div class="rays aura"></div><img src="'+cardImg(card)+'"></div><div class="res">🎴 คุณได้การ์ด <b class="au" style="'+auraStyle(card)+'">'+cardName(card)+'</b><small>'+CMAP[card][3]+'</small></div><div class="row"><button class="btn g" id="apply">✨ ใช้การ์ด (<span id="countdown">'+Math.max(0,remain())+'</span>)</button></div>'))return;
 let sending=false,retryAt=0;
 const go=async()=>{if(sending||Date.now()<retryAt)return;sending=true;const out=await useCard(id,{});sending=false;if(!out)retryAt=Date.now()+2000;};
 $('apply').onclick=go;
 popTimer=setInterval(()=>{const cur=R.boxes.find(b=>b.id===id);if(!cur||cur.opened){closePop();ann('ใช้การ์ด'+CARD_TH[card]+'แล้ว');return;}if(R.status!=='running')return;const n=Math.max(0,remain());if($('countdown'))$('countdown').textContent=n;if(n<=0)go();},250);}
/* เลือกเป้า: นับถอยหลัง 10:00 จากตอนเปิดได้การ์ด (เวลาเซิร์ฟเวอร์) ไม่เลือกในเวลา เซิร์ฟเวอร์สุ่มให้เอง
   การ์ดเตะ = บังคับ: ไม่มีปุ่มปิด · fix14: เตะเลือกได้ 2 แบบ, ดึงตัว/สลับ/ชุบชีวิต/แช่แข็ง เลือกคน, ตัด/หมึก/ปู เลือกเรือ */
const TIP={cut:'🎯 เลือกเรือคู่แข่ง 1 ลำ ถอย 10',ink:'🐙 เลือกเรือคู่แข่งที่จะพ่นหมึกใส่จอ',crab:'🦀 เลือกเรือคู่แข่ง ทุกคนต้องรอส่งเพิ่ม 10 นาที',kick:'🦶 เลือกแบบเตะ',pull:'🏴‍☠️ ดึงคู่แข่ง 1 คนมาอยู่ทีมเรา',swap:'🔄 แลกลูกเรือเรา 1 คนกับคู่แข่ง 1 คน',revive:'💫 ชุบคนที่โดนเตะ 1 คน',freeze:'🧊 แช่แข็งคู่แข่ง 1 คน ส่งไม่ได้ 30 นาที'};
const BOATCARD=new Set(['cut','ink','crab']);
let kmode='all';
const kickedList=()=>Object.keys(R.kicked||{}).filter(u=>R.kicked[u]&&R.team[u]);
const capOf=b=>(R.startSize?.[b]??0)+1;
function reviveDest(uid){const home=R.team[uid],size=b=>members(b).length;if(size(home)<Math.max(1,R.startSize?.[home]??1))return [home,false];return [[1,2,3,4,5].sort((a,b)=>size(a)-size(b)||a-b)[0],true];}
function showTarget(id){const box=R.boxes.find(b=>b.id===id);if(!box||box.opened){closePop();return;}const card=box.card,mb=box.boat,kick=card==='kick';
 if(kick&&mb===myBoat()&&!isKicked(ME)&&(!box.pickedBy||box.pickedBy===ME))forced=id;
 const left=()=>deadlineOf(R.boxes.find(b=>b.id===id)||box)-clock();
 const rivals=[1,2,3,4,5].filter(b=>b!==mb),teams=()=>rivals.filter(b=>members(b).length);
 const sig=()=>[1,2,3,4,5].map(b=>b+':'+members(b).join(',')).join('|')+'|k:'+kickedList().join(','),snap=sig();
 const chip=(g,uid,extra)=>'<button class="chipb" data-g="'+g+'" data-uid="'+esc(uid)+'">'+label(uid)+(extra||'')+'</button>';
 const teamGroup=(g,b,note)=>'<div class="kt" data-team="'+b+'"><b>🚣 เรือ '+b+' '+BOATS[b-1][0]+(note?'<small>'+note+'</small>':'')+'</b>'+members(b).map(uid=>chip(g,uid)).join('')+'</div>';
 let h='<div class="picked sm" style="'+auraStyle(card)+'"><img src="'+cardImg(card)+'"></div><div class="res"><b class="au" style="'+auraStyle(card)+'">'+cardName(card)+'</b></div>';
 h+='<div class="kclock"><div class="kring" id="kring"><span id="kleft">'+fmt(left())+'</span></div><small>'+(TIP[card]||'')+'<br>⏳ ไม่เลือกในเวลา ระบบสุ่มให้</small></div>';
 const T=teams();let need=0;
 if(BOATCARD.has(card))h+='<div class="tgt">'+BOATS.map((b,i)=>i+1===mb?'':'<button class="opt" data-boat="'+(i+1)+'"><img src="'+IMG['b'+(i+1)]+'"><b>เรือ '+(i+1)+' '+b[0]+'</b><span>🧑‍✈️'+members(i+1).length+' • '+(R.p[i]||0)+'/400</span></button>').join('')+'</div>';
 else if(kick){
  h+='<div class="kmode"><button class="opt'+(kmode==='all'?' sel':'')+'" data-kmode="all"><b>🌊 กวาดทุกทีม<small>เตะทีมละ 1 คน ทุกทีมคู่แข่ง</small></b></button><button class="opt'+(kmode==='one'?' sel':'')+'" data-kmode="one"><b>🎯 เจาะทีมเดียว<small>เลือก 1 ทีม เตะได้ 2 คน</small></b></button></div>';
  if(!T.length)h+='<div class="hint">ไม่มีคู่แข่งให้เตะ</div>';
  else h+='<div class="tgt">'+T.map(b=>teamGroup('k',b,kmode==='all'?'เลือก 1 คน':'เลือกได้ 2 คน')).join('')+'</div>';
  need=kmode==='all'?T.length:Math.min(2,Math.max(...T.map(b=>members(b).length),0));}
 else if(card==='pull'||card==='freeze'){
  h+=T.length?'<div class="tgt">'+T.map(b=>teamGroup('t',b,'')).join('')+'</div>':'<div class="hint">ไม่มีคู่แข่งให้เลือก</div>';need=T.length?1:0;
  if(card==='pull'&&members(mb).length+1>capOf(mb)){const own=members(mb).filter(u=>u!==ME);h+='<div class="sec">💼 ทีมเต็มโควตา ('+members(mb).length+'/'+capOf(mb)+') ต้องเลือกลูกเรือ 1 คน "ถูกจ้างออก" ได้ค่าชดเชย 100,000 กุศล</div><div class="tgt"><div class="kt">'+own.map(uid=>chip('f',uid)).join('')+'</div></div>';need+=own.length?1:0;}}
 else if(card==='swap'){const own=members(mb);h+='<div class="sec">🙋 ลูกเรือเรา</div><div class="tgt"><div class="kt">'+own.map(uid=>chip('m',uid,uid===ME?' (คุณ)':'')).join('')+'</div></div><div class="sec">🔄 แลกกับ</div>'+(T.length?'<div class="tgt">'+T.map(b=>teamGroup('t',b,'')).join('')+'</div>':'<div class="hint">ไม่มีคู่แข่งให้แลก</div>');need=own.length&&T.length?2:0;}
 else if(card==='revive'){const k=kickedList();h+=k.length?'<div class="tgt"><div class="kt">'+k.map(uid=>{const [to,full]=reviveDest(uid);return chip('t',uid,'<small> → เรือ '+to+(full?' (เรือ '+R.team[uid]+' เต็ม)':'')+'</small>');}).join('')+'</div></div><div class="hint">💡 กลับเรือเดิม ถ้าเรือเดิมเต็ม ไปเรือที่คนน้อยที่สุด</div>':'<div class="hint">ยังไม่มีคนโดนเตะ</div>';need=k.length?1:0;}
 if(!BOATCARD.has(card))h+='<div class="row">'+(need?'<button class="btn" id="kickRnd">🎲 สุ่มให้</button>':'')+'<button class="btn '+(kick?'r':'g')+'" id="kickGo"'+(need?' disabled':'')+'>'+(kick?'❌ เตะออก':'✨ ใช้การ์ด')+(need?' (0/'+need+')':'')+'</button></div>';
 if(!popScreen(h,{forced}))return;
 const body=$('popBody'),on=g=>[...body.querySelectorAll('[data-g="'+g+'"].on')].map(el=>el.dataset.uid);
 const count=()=>kick?on('k').length:on('t').length+on('f').length+on('m').length;
 const refresh=()=>{body.querySelectorAll('.kt').forEach(k=>k.classList.toggle('done',!!k.querySelector('.on')));const g=$('kickGo');if(g&&need){const n=count();g.disabled=n<need&&!(kick&&kmode==='one'&&n>=1);g.textContent=(kick?'❌ เตะออก':'✨ ใช้การ์ด')+' ('+n+'/'+need+')';}};
 popTimer=setInterval(()=>{const cur=R.boxes.find(b=>b.id===id);if(!cur||cur.opened){closePop();ann('การ์ด'+CARD_TH[card]+'ถูกใช้แล้ว');return;}
  const ms=left(),k=$('kring');if($('kleft'))$('kleft').textContent=ms>0?fmt(ms):'🎲';if(k){k.style.setProperty('--left',Math.max(0,Math.min(1,ms/TARGET_TIME)).toFixed(4));k.classList.toggle('hot',ms<60000);}
  if(!BOATCARD.has(card)&&sig()!==snap)showTarget(id);},250);
 body.querySelectorAll('[data-boat]').forEach(el=>el.onclick=()=>useCard(id,{targetBoat:+el.dataset.boat}));
 body.querySelectorAll('[data-kmode]').forEach(el=>el.onclick=()=>{kmode=el.dataset.kmode;showTarget(id);});
 body.querySelectorAll('[data-g]').forEach(el=>el.onclick=()=>{const g=el.dataset.g;
  if(g==='k'&&kmode==='one'){const team=el.closest('.kt');body.querySelectorAll('[data-g="k"]').forEach(x=>{if(x.closest('.kt')!==team)x.classList.remove('on');});if(!el.classList.contains('on')&&team.querySelectorAll('.on').length>=2)return ann('เตะทีมเดียวได้ไม่เกิน 2 คน',1);el.classList.toggle('on');}
  else if(g==='k'){el.closest('.kt').querySelectorAll('[data-g="k"]').forEach(x=>x.classList.toggle('on',x===el));}
  else body.querySelectorAll('[data-g="'+g+'"]').forEach(x=>x.classList.toggle('on',x===el));
  refresh();});
 if($('kickRnd'))$('kickRnd').onclick=()=>{const pickIn=list=>list.length?list[Math.floor(Math.random()*list.length)]:null;
  if(kick&&kmode==='all')body.querySelectorAll('.kt').forEach(k=>{if(k.querySelector('.on'))return;const c=pickIn([...k.querySelectorAll('[data-g="k"]')]);if(c)c.classList.add('on');});
  else if(kick){if(!on('k').length){const t=pickIn([...body.querySelectorAll('.kt')]);if(t)[...t.querySelectorAll('[data-g="k"]')].sort(()=>Math.random()-.5).slice(0,2).forEach(x=>x.classList.add('on'));}}
  else for(const g of ['t','f','m'])if(!on(g).length){const c=pickIn([...body.querySelectorAll('[data-g="'+g+'"]')]);if(c)c.classList.add('on');}
  refresh();};
 if($('kickGo'))$('kickGo').onclick=()=>{if(need&&count()<need&&!(kick&&kmode==='one'&&count()>=1))return ann('เลือกให้ครบก่อนนะ',1);
  if(kick)return useCard(id,{mode:kmode,targets:on('k')});
  if(card==='swap')return useCard(id,{mine:on('m')[0],theirs:on('t')[0]});
  if(card==='pull')return useCard(id,{uid:on('t')[0],...(on('f')[0]?{fire:on('f')[0]}:{})});
  return useCard(id,on('t')[0]?{uid:on('t')[0]}:{});};
 refresh();}
function reopenForced(){if(forced&&!$('pop').classList.contains('on'))showTarget(forced);else if(forced)ann('เลือกคนที่จะเตะให้เสร็จก่อนนะ 🦶');}
/* การ์ดเตะที่ฉันเปิดค้างอยู่ (เช่น รีเฟรชหน้า) → เปิดหน้าบังคับเลือกให้อีกครั้ง */
function checkForced(){if(forced||acting||R.status!=='running'||isKicked(ME)||$('pop').classList.contains('on'))return;const box=R.boxes.find(b=>!b.opened&&b.card==='kick'&&b.picked!==undefined&&b.pickedBy===ME&&b.boat===myBoat());if(box)showTarget(box.id);}
async function useCard(id,extra){const box=R.boxes.find(b=>b.id===id);if(!box)return closePop();const card=box.card;
 const out=await action({type:'card',box:id,index:box.picked,...extra});
 if(ok(out)){forced=null;if(!out.meritSelf?.length)closePop();if(card!=='merit')ann('ใช้การ์ด'+CARD_TH[card]+'แล้ว');return out;}
 if(out?.error&&/ใช้ไปแล้ว/.test(out.error))closePop();return null;}
/* กุศลการ์ด: ผู้กดเห็นจากผลตอบกลับ · เพื่อนร่วมทีมเห็นทันทีจาก world/boat (meritTo) แล้วดึง ledger เข้ากระเป๋าครั้งเดียว */
const meritShown=new Set();
function meritBoxOf(boat,race){return (race?.boxes||[]).filter(b=>b.opened&&b.card==='merit'&&b.boat===boat&&(b.meritTo||[]).includes(ME)).sort((a,b)=>(b.usedAt||0)-(a.usedAt||0))[0];}
function selfMerit(m,race){const box=meritBoxOf(m.boat,race);if(box){if(meritShown.has(box.id))return;meritShown.add(box.id);}meritPop(m);}
function mateMerit(e,tries=0){if(meritShown.has(e.id))return;if(acting&&tries<30)return setTimeout(()=>mateMerit(e,tries+1),400);meritShown.add(e.id);meritPop({boat:e.boat,merit:100000},true);pullLedger();}
async function pullLedger(n=0){try{await Host.cloud('ledger',{type:'status'});}catch(e){if(n<3)setTimeout(()=>pullLedger(n+1),2500);}}
function meritPop(m,mate){const amt='+'+Number(m.merit||100000).toLocaleString();fx('coins',W/2,H*.42,18);
 if(mate&&$('pop').classList.contains('on'))return ann('🪙 ทีมเรือ '+m.boat+' ได้การ์ดกุศล '+amt+' กุศล เข้ากระเป๋าแล้ว');
 if(!popScreen('<img class="face" src="'+IMG.happy+'"><div class="res">🎉 ทีมเรือ '+m.boat+' ได้การ์ดกุศล!<small>🪙 '+amt+' กุศล เข้ากระเป๋าแล้ว'+(mate?' (เพื่อนร่วมทีมเปิด)':'')+'</small></div><div class="row"><button class="btn g" id="gotIt">รับแล้ว</button></div>'))return ann('🪙 การ์ดกุศลทีม '+amt+' กุศล');$('gotIt').onclick=closePop;}
/* เอฟเฟกต์ในฉากจากเหตุการณ์ */
const boatXY=b=>{const y=yOf(R.p[b-1]||0);return [laneX(b,y),y];};
const who=uid=>uid?label(uid):'';
function play(evs,src){const used=new Set(evs.filter(e=>e.type==='card').map(e=>e.id));for(const e of evs){try{
 if(e.type==='supply'){const [x,y]=boatXY(e.boat);fx('splash',x,y+22,14);fx('floatText',x,y-46,'+'+e.n,'#FFF6C8');fx('boatClass',boatEls[e.boat-1],'surge',800);}
 else if(e.type==='box')fx('lineGlow',lineEls[e.line]);
 else if(e.type==='pick'&&!(used.has(e.id)&&e.card!=='supply'&&e.card!=='merit'))fx('banner',e.card,(e.by?'<b>'+who(e.by)+'</b> ':'')+'🚣 เรือ '+e.boat+' เปิดได้ <b>'+cardName(e.card)+'</b>'+(needsTarget(e.card)&&!e.used?'<small>⏳ มีเวลาเลือกเป้า 10 นาที</small>':''));
 else if(e.type==='card')cardFx(e,src);
 else if(e.type==='finish')finishFx(e.boat);
 }catch(err){}}}
function cardFx(e,src){const [x,y]=boatXY(e.boat);newCardFx(e,src);if(e.card==='kick')bxShake();
 if(e.card==='supply'){fx('boatClass',boatEls[e.boat-1],'boost',2600);fx('streaks',x,y,'#E3FFEE',12);fx('splash',x,y+40,18,'#C9FFE0');fx('floatText',x+10,y-50,'🚀 +10','#7DFFB0');}
 if(e.card==='cut'&&e.target){const [tx,ty]=boatXY(e.target);fx('pumpkin',tx,ty-10,()=>{fx('boatClass',boatEls[e.target-1],'hit',1000);fx('floatText',tx+10,ty-50,'💥 −10','#FF8A8A');});fx('banner','cut','🎃 เรือ '+e.boat+' ตัดเสบียง <b>เรือ '+e.target+'</b> ถอย 10');}
 if(e.card==='merit'){fx('coins',x,y,22);fx('floatText',x+10,y-60,'🪙 +100,000','#FFE27A');if((e.meritTo||[]).includes(ME)&&src!=='self')setTimeout(()=>mateMerit(e),1200);}
 if(e.card==='stop'){[1,2,3,4,5].filter(b=>b!==e.boat).forEach((b,i)=>{const [bx,by]=boatXY(b);setTimeout(()=>fx('iceRing',bx,by),i*120);});fx('banner','stop','🧊 เรือ '+e.boat+' ใช้การ์ด<b>หยุดเรือ</b><small>ทีมอื่นส่งเสบียงไม่ได้ 30 นาที</small>');}
 if(e.card==='kick'){const v=e.victims||[];v.forEach((uid,i)=>{const b=R.team[uid];if(!b)return;const [bx,by]=boatXY(b);setTimeout(()=>fx('nameFly',bx,by-20,label(uid),bx<W/2?-1:1),i*160);});
  fx('banner','kick',v.length?'🦶 เรือ '+e.boat+' เตะ <b>'+v.map(label).join(', ')+'</b> ตกน้ำ!':'🦶 เรือ '+e.boat+' ใช้การ์ดเตะ (ไม่มีคู่แข่งให้เตะ)');
  if(v.includes(ME))setTimeout(()=>ann('💦 คุณถูกการ์ดเตะของเรือ '+e.boat+' ออกจากทีม',1),1200);}}
/* fix14 เอฟเฟกต์การ์ดใหม่ (เลเยอร์ DOM ในฉาก) */
function bx(cls,html,x,y,ms,style){const s=$('stage');if(!s)return null;const d=document.createElement('div');d.className='bx '+cls;if(html!=null)d.innerHTML=html;if(x!=null){d.style.left=pct(x,W);d.style.top=pct(y,H);}if(style)Object.assign(d.style,style);s.appendChild(d);if(ms)setTimeout(()=>d.remove(),ms);return d;}
function bxNews(t){bx('bx-news','<div>'+t+'</div>',null,null,2700);}
function bxShake(){const s=$('stage');s.classList.remove('bx-shake');void s.offsetWidth;s.classList.add('bx-shake');setTimeout(()=>s.classList.remove('bx-shake'),600);}
function bxArc(fromB,toB,emo,dy){const [x1,y1]=boatXY(fromB),[x2,y2]=boatXY(toB),sc=$('stage').getBoundingClientRect().width/W;const dx=(x2-x1)*sc,ddy=(y2-y1)*sc;bx('bx-arc',emo,x1,y1-(dy||0),1400,{offsetPath:'path("M 0 0 Q '+(dx/2).toFixed(1)+' -90 '+dx.toFixed(1)+' '+ddy.toFixed(1)+'")'});}
function bxInk(){if(document.getElementById('bxInk'))return;const o=document.createElement('div');o.id='bxInk';o.className='bx-inkwrap';document.body.appendChild(o);
 for(let i=0;i<7;i++){const s=18+Math.random()*22,d=document.createElement('div');d.className='bx-ink';Object.assign(d.style,{left:(Math.random()*80)+'%',top:(15+Math.random()*65)+'%',width:s+'%',animationDelay:i*.08+'s'});const wipe=()=>{if(d.classList.contains('wipe'))return;d.classList.add('wipe');setTimeout(()=>{d.remove();if(!o.querySelector('.bx-ink'))o.remove();},400);};d.addEventListener('pointerdown',wipe);d.addEventListener('pointerenter',e=>{if(e.buttons)wipe();});o.appendChild(d);}
 const tip=document.createElement('div');tip.className='bx-inktip';tip.textContent='🧽 ถูจอเพื่อเช็ดหมึก!';o.appendChild(tip);setTimeout(()=>tip.remove(),2600);
 setTimeout(()=>o.remove(),60000);}
function bxFrost(){const o=document.createElement('div');o.className='bx-frost';document.body.appendChild(o);for(let i=0;i<14;i++){const f=document.createElement('i');f.textContent='❄';f.style.left=Math.random()*100+'%';f.style.top=Math.random()*100+'%';f.style.animationDelay=Math.random()*.6+'s';o.appendChild(f);}setTimeout(()=>o.remove(),4200);}
function newCardFx(e,src){const [x,y]=boatXY(e.boat),nm=uid=>'<b>'+label(uid)+'</b>';
 if(e.card==='pull'&&e.pulled){bxNews('🏴‍☠️ เรือ '+e.boat+' ดึง '+label(e.pulled)+' จากเรือ '+e.from+'!');setTimeout(()=>{bxArc(e.from,e.boat,'🐷',10);setTimeout(()=>{fx('splash',x,y+20,16);fx('floatText',x,y-50,'✨ ลูกเรือใหม่','#E8D8FF');},1250);
   if(e.fired){setTimeout(()=>{fx('nameFly',x,y-20,label(e.fired),x<W/2?-1:1);fx('banner','pull','💼 '+nm(e.fired)+' ถูกจ้างออกจากเรือ '+e.boat+'<small>ได้ค่าชดเชย 100,000 กุศล</small>');},1600);if(e.fired===ME)setTimeout(()=>ann('💼 คุณถูกจ้างออกจากเรือ '+e.boat+' ได้ค่าชดเชย 100,000 กุศล'),2400);}},500);
  if(e.pulled===ME)setTimeout(()=>ann('🏴‍☠️ คุณถูกดึงไปอยู่เรือ '+e.boat+' แล้ว'),1800);}
 if(e.card==='swap'&&e.swap){const [a,b2]=e.swap,ob=e.target;bxNews('🔄 เรือ '+e.boat+' สลับ '+label(a)+' ⇄ '+label(b2));setTimeout(()=>{bxArc(e.boat,ob,'🐷');bxArc(ob,e.boat,'🐽');setTimeout(()=>{const [ox,oy]=boatXY(ob);fx('splash',x,y+20,14);fx('splash',ox,oy+20,14);},1250);},500);
  if(a===ME||b2===ME)setTimeout(()=>ann('🔄 คุณถูกสลับไปอยู่เรือ '+R.team[ME]+' แล้ว'),1800);}
 if(e.card==='revive'&&e.revived){const to=e.target,[tx,ty]=boatXY(to);bxNews('💫 ชุบชีวิต '+label(e.revived)+' กลับเรือ '+to+'!');setTimeout(()=>{bx('bx-beam','',tx,0,2100,{height:pct(ty,H)});bx('bx-angel','😇',tx,ty-60,2100);fx('sparkles',tx,ty-40,16,'#FFF3B0',60);setTimeout(()=>fx('floatText',tx,ty-50,'💫 กลับมาแล้ว!','#FFE9A8'),900);
   if(e.full)fx('banner','revive','💫 เรือ '+e.from+' เต็ม <b>'+label(e.revived)+'</b> จึงไปเรือ '+to+'<small>เรือที่คนน้อยที่สุด</small>');},500);
  if(e.revived===ME)setTimeout(()=>ann('💫 คุณได้รับการชุบชีวิต กลับมาอยู่เรือ '+to+' แล้ว!'),1800);}
 if(e.card==='ink'&&e.target){const [tx,ty]=boatXY(e.target);bxNews('🐙 เรือ '+e.boat+' พ่นหมึกใส่เรือ '+e.target+'!');setTimeout(()=>{fx('explode',tx,ty,['#2a1d3a','#120a1c','#5A3A8A','#3A2A5A'],26);if(e.target===myBoat()&&!isKicked(ME))bxInk();},500);}
 if(e.card==='freeze'&&e.frozen){const b=R.team[e.frozen]||e.target,[tx,ty]=boatXY(b);bxNews('🧊 เรือ '+e.boat+' แช่แข็ง '+label(e.frozen)+' 30 นาที!');setTimeout(()=>{fx('iceRing',tx,ty);bx('bx-icecube','',tx,ty,4200);bx('bx-tag','🧊 '+label(e.frozen)+' ส่งไม่ได้ 30:00',tx,ty+40,4200);if(e.frozen===ME)bxFrost();},500);}
 if(e.card==='crab'&&e.target){const [tx,ty]=boatXY(e.target);bxNews('🦀 เรือ '+e.boat+' ส่งปูหนีบเรือ '+e.target+'!');setTimeout(()=>{bx('bx-pincher','🦀',tx+40,ty,4200);bx('bx-tag','🦀 รอส่งเพิ่ม 10 นาที',tx,ty+40,4200);fx('boatClass',boatEls[e.target-1],'hit',1000);},500);}
}
function wreckFx(b){const [x,y]=boatXY(b);bxNews('👻 เรือ '+b+' ล่ม! ไม่เหลือลูกเรือ');setTimeout(()=>{bx('bx-sink','',x,y+10,2500);for(let i=0;i<8;i++)setTimeout(()=>bx('bx-bub','',x+(Math.random()*40-20),y+10,1700),i*180);bx('bx-ghost','👻',x,y-50,2700);},500);}
function finishFx(b){const [x,y]=boatXY(b);fx('finale',x,y);setTimeout(()=>fx('trophy','เรือ '+b+' '+BOATS[b-1][0]+' ชนะ!'),700);}

/* แอดมิน: จัดทีม เสบียง และเพิ่มคนมาสาย */
async function freshRoster(){try{roster=await Host.roster();}catch(e){ann(e.message,true);}}
async function teamsAction(input){const out=await action(input);return ok(out);}
async function openTeam(){if(!ADMIN)return;open('<h3>👥 จัดทีม</h3><div class="hint">กำลังโหลดรายชื่อล่าสุด…</div>');await freshRoster();
 const counts=b=>Object.values(R.team).filter(v=>v===b).length,free=players().filter(p=>!R.team[p.uid]);
 if(R.status==='running'||R.status==='paused'){
  open('<h3>➕ เพิ่มคนมาสาย</h3><div class="hint">เริ่มแข่งแล้ว เพิ่มได้เฉพาะคนที่ยังไม่มีทีม (ย้ายทีมไม่ได้)</div>'+(free.length?free.map(p=>'<div class="tg"><b>'+label(p.uid)+'</b><div class="bs">'+BOATS.map((b,i)=>'<button style="background:'+b[2]+'" data-late="'+esc(p.uid)+'" data-b="'+(i+1)+'">'+(i+1)+'</button>').join('')+'</div></div>').join(''):'<div class="hint">ทุกคนมีทีมแล้ว</div>'));
  $('sb').querySelectorAll('[data-late]').forEach(el=>el.onclick=()=>{const uid=el.dataset.late,b=+el.dataset.b;open('<h3>เพิ่ม '+label(uid)+' เข้าเรือ '+b+'?</h3><div class="hint">ย้ายทีมภายหลังไม่ได้จนรีเซ็ต</div><div class="row"><button class="btn g" id="lateYes">ยืนยัน</button><button class="btn gray" id="lateNo">ยกเลิก</button></div>');$('lateNo').onclick=openTeam;$('lateYes').onclick=async()=>{if(await teamsAction({type:'addMember',uid,boat:b})){ann('เพิ่ม '+label(uid)+' เข้าเรือ '+b+' แล้ว');openTeam();}};});
  return;}
 if(R.status!=='setup'){open('<h3>👥 จัดทีม</h3><div class="hint">รีเซ็ตการแข่งขันก่อนจัดทีมรอบใหม่</div>');return;}
 open('<h3>👥 จัดทีม</h3><div class="hint">ยังไม่มีทีม '+free.length+' คน • แตะเรือเพื่อเลือกสมาชิก</div>'+BOATS.map((b,i)=>'<button class="opt" data-team="'+(i+1)+'"><img src="'+IMG['b'+(i+1)]+'"><b>เรือ '+(i+1)+' '+b[0]+'<small>'+members(i+1).map(label).join(', ')+'</small></b><span>'+counts(i+1)+' คน</span></button>').join('')+
  '<div class="row"><button class="btn" id="reuse">♻️ ใช้ทีมเดิม</button><button class="btn" id="shuffle">🎲 สุ่มทีม</button></div><div class="row"><button class="btn" id="supplyMenus">🍱 ตั้งเสบียงแต่ละทีม</button><button class="btn g" id="raceStart">🏁 เริ่มการแข่งขัน</button></div>');
 $('sb').querySelectorAll('[data-team]').forEach(el=>el.onclick=()=>openPick(+el.dataset.team,true));$('supplyMenus').onclick=()=>selectMenus(1);
 $('reuse').onclick=async()=>{const ids=new Set(players().map(p=>p.uid)),team=Object.fromEntries(Object.entries(R.lastTeam||{}).filter(([uid,b])=>ids.has(uid)&&b>=1&&b<=5));if(!Object.keys(team).length)return ann('ยังไม่มีทีมจากรอบที่แล้ว',1);const dropped=Object.keys(R.lastTeam).length-Object.keys(team).length;if(await teamsAction({type:'teams',team,drop:true})){ann('ใช้ทีมเดิมแล้ว'+(dropped?' (ตัด '+dropped+' คนที่ไม่ได้อนุมัติแล้ว)':''));openTeam();}};
 $('shuffle').onclick=()=>{const ids=new Set(players().map(p=>p.uid)),picked=Object.keys(R.team).filter(u=>ids.has(u)),all=players().map(p=>p.uid);
  open('<h3>🎲 สุ่มทีม</h3><div class="hint">แบ่งเท่าๆ กัน 5 ลำ</div><div class="row">'+(picked.length?'<button class="btn" id="rndPicked">สุ่มคนที่จัดแล้ว ('+picked.length+')</button>':'')+'<button class="btn g" id="rndAll">สุ่มทุกคน ('+all.length+')</button></div><div class="row"><button class="btn gray" id="rndNo">ยกเลิก</button></div>');
  const run=async pool=>{const a=[...pool],rnd=new Uint32Array(a.length);crypto.getRandomValues(rnd);for(let i=a.length-1;i>0;i--){const j=rnd[i]%(i+1);[a[i],a[j]]=[a[j],a[i]];}const team=Object.fromEntries(a.map((u,i)=>[u,i%5+1]));if(await teamsAction({type:'teams',team,drop:true})){ann('สุ่มทีมแล้ว');openTeam();}};
  if($('rndPicked'))$('rndPicked').onclick=()=>run(picked);$('rndAll').onclick=()=>run(all);$('rndNo').onclick=openTeam;};
 $('raceStart').onclick=async()=>{if(await teamsAction({type:'start'})){closeAll();ann('🏁 เริ่มการแข่งขันแล้ว');}};}
async function openPick(b,fresh){if(!ADMIN||R.status!=='setup')return;if(!fresh){open('<h3>เลือกสมาชิกเรือ '+b+'</h3><div class="hint">กำลังโหลดรายชื่อล่าสุด…</div>');await freshRoster();}
 const ids=new Set(players().map(p=>p.uid)),selected=new Set(members(b).filter(u=>ids.has(u)));
 const render=()=>{open('<h3>เลือกสมาชิกเรือ '+b+' '+BOATS[b-1][0]+'</h3><div class="hint">เลือกแล้ว '+selected.size+' คน • คนที่อยู่ลำอื่นจะถูกย้ายมาลำนี้</div>'+players().map(p=>{const other=R.team[p.uid]&&R.team[p.uid]!==b&&!selected.has(p.uid)?R.team[p.uid]:0;return '<button class="opt'+(selected.has(p.uid)?' sel':'')+'" data-uid="'+esc(p.uid)+'"><b>'+(selected.has(p.uid)?'✅ ':'⬜ ')+label(p.uid)+'</b>'+(other?'<span class="tagx">อยู่เรือ '+other+' แล้ว</span>':'')+'</button>';}).join('')+'<div class="row"><button class="btn gray" id="backTeam">กลับ</button><button class="btn g" id="saveTeam">บันทึกทีม</button></div>');
  $('sb').querySelectorAll('[data-uid]').forEach(el=>el.onclick=()=>{selected.has(el.dataset.uid)?selected.delete(el.dataset.uid):selected.add(el.dataset.uid);render();});$('backTeam').onclick=openTeam;
  $('saveTeam').onclick=async()=>{const team={...R.team};for(const uid of Object.keys(team))if(team[uid]===b)delete team[uid];for(const uid of selected)team[uid]=b;
   // ส่งทั้งแบบรายลำ (เซิร์ฟเวอร์ใหม่) และทั้งรายการ (เผื่อเซิร์ฟเวอร์รุ่นเก่า)
   if(await teamsAction({type:'teams',boat:b,members:[...selected],team})){ann('บันทึกเรือ '+b+' แล้ว');openTeam();}};};render();}
function selectMenus(b){const selected=new Set(R.menus?.[b]||[]),foods=CATALOG.filter(c=>c.p.startsWith('food.')||c.p.startsWith('gfood.'));
 const boatFoods=BOAT_DISHES.map(k=>foods.find(c=>c.k===k)).filter(Boolean),other=foods.filter(c=>!BOAT_DISHES.includes(c.k));
 const row=c=>'<button class="opt'+(selected.has(c.k)?' sel':'')+'" data-menu="'+c.k+'"><img src="images/'+c.i+'"><b>'+(selected.has(c.k)?'✅ ':'⬜ ')+esc(c.n)+'</b></button>';
 const render=()=>{open('<h3>🍱 เสบียงเรือ '+b+'</h3><select id="menuBoat">'+BOATS.map((v,i)=>'<option value="'+(i+1)+'" '+(i+1===b?'selected':'')+'>เรือ '+(i+1)+' '+v[0]+(R.menus?.[i+1]?.length?' ✅':'')+'</option>').join('')+'</select><div class="hint">เลือก 1–'+MENU_MAX+' เมนู • เลือกแล้ว '+selected.size+'/'+MENU_MAX+' • ผู้เล่นเห็นเมื่อเริ่มแข่ง</div><div class="sec">🚣 เมนูเรือ</div>'+boatFoods.map(row).join('')+'<div class="sec">🍲 อาหารอื่นที่ใช้ได้</div>'+other.map(row).join('')+'<div class="row"><button class="btn gray" id="backTeam">กลับ</button><button class="btn g" id="saveMenus" '+(selected.size>=1&&selected.size<=MENU_MAX?'':'disabled')+'>บันทึกเสบียง</button></div>');
  $('menuBoat').onchange=()=>selectMenus(+$('menuBoat').value);$('backTeam').onclick=openTeam;
  $('sb').querySelectorAll('[data-menu]').forEach(el=>el.onclick=()=>{const k=el.dataset.menu;if(selected.has(k))selected.delete(k);else if(selected.size<MENU_MAX)selected.add(k);else ann('เลือกได้ไม่เกิน '+MENU_MAX+' เมนู',1);render();});
  $('saveMenus').onclick=async()=>{if(await teamsAction({type:'menus',boat:b,menus:[...selected]})){ann('บันทึกเสบียงเรือ '+b+' แล้ว');selectMenus(b<5?b+1:1);}};};render();}
$('logBtn').onclick=()=>open('<h3>📜 รายการล่าสุด</h3>'+(R.log.length?R.log.map(x=>'<p>'+esc(thaiLog(x))+'</p>').join(''):'<div class="hint">ยังไม่มีรายการ</div>'));
$('setBtn').hidden=!ADMIN;$('setBtn').onclick=()=>{const live=R.status==='running'||R.status==='paused';open('<h3>👑 ควบคุมการแข่งขัน</h3><div class="row"><button class="btn g" id="teams">'+(live?'➕ เพิ่มคนมาสาย':'👥 จัดทีม / เริ่ม')+'</button>'+(live?'<button class="btn" id="pause">'+(R.status==='paused'?'▶️ แข่งต่อ':'⏸️ พักการแข่งขัน')+'</button>':'')+'<button class="btn r" id="reset">รีเซ็ตการแข่งขัน</button></div>');$('teams').onclick=openTeam;if($('pause'))$('pause').onclick=async()=>{if(await teamsAction({type:R.status==='paused'?'resume':'pause'}))closeAll();};$('reset').onclick=()=>{open('<h3>ยืนยันรีเซ็ตการแข่งขัน?</h3><p>คะแนนและกล่องของรอบนี้จะเริ่มใหม่ (ทีมเดิมเก็บไว้ให้กด "ใช้ทีมเดิม")</p><button class="btn r" id="yesReset">ยืนยัน</button>');$('yesReset').onclick=async()=>{if(await teamsAction({type:'reset'}))closeAll();};};};
/* เส้นตายฝั่งเซิร์ฟเวอร์: ถ้าเห็นการ์ดค้างเกินเวลา ขอให้คลาวด์ชำระ (สุ่มหน่วงกันทุกเครื่องยิงพร้อมกัน) */
const jitter=1500+Math.random()*4000;let nextStatus=0;
function watchDeadlines(){if(R.status!=='running'||acting||Date.now()<nextStatus)return;if(R.boxes.some(b=>!b.opened&&b.picked!==undefined&&deadlineOf(b)+jitter<SNow())){nextStatus=Date.now()+20000;tickServer();}}
/* 'tick' = ขอเซิร์ฟเวอร์ชำระการ์ดที่หมดเวลา (เขียนเฉพาะเมื่อมีการ์ดต้องชำระจริง) · เซิร์ฟเวอร์รุ่นเก่าไม่รู้จัก tick → ใช้ status แทน */
async function tickServer(){const out=await action({type:'tick'},true);if(out?.error&&/คำสั่งเรือไม่ถูกต้อง/.test(out.error))action({type:'status'},true);}
async function initialize(){try{roster=await Host.roster();const stop=Host.watchWorld('boat',world=>{if(world)setRace(world,'world');else update();const reward=(R.credits?.[ME]||0)-(R.claimedCredits?.[ME]||0);if(reward>0&&!acting)action({type:'claimCredit'},true);});addEventListener('pagehide',stop,{once:true});update();action({type:'status'},true);}catch(e){ann(e.message,true);}}
addEventListener('resize',()=>{fit();build();});fit();build();initialize();
setInterval(()=>{update();watchDeadlines();checkForced();},1000);
