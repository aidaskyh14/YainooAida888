import {CATALOG} from './catalog.js';

const IMG={"bg": "images/boat-boatrace-bg.webp", "box": "images/boat-box.webp", "boxopen": "images/boat-box-open.webp", "back": "images/boat-boatcard-back.webp", "happy": "images/honey-face-happy.webp", "oops": "images/honey-face-oops.webp", "b1": "images/boat-1.webp", "b2": "images/boat-2.webp", "b3": "images/boat-3.webp", "b4": "images/boat-4.webp", "b5": "images/boat-5.webp", "c-supply": "images/boat-boatcard-supply.webp", "c-cut": "images/boat-boatcard-cut.webp", "c-merit": "images/boat-boatcard-merit.webp", "c-stop": "images/boat-boatcard-stop.webp", "c-kick": "images/boat-boatcard-kick.webp", "f1": "images/food-01.webp", "f2": "images/food-02.webp", "f9": "images/food-09.webp", "f10": "images/food-10.webp"};const W=941,H=1672,$=id=>document.getElementById(id);
const BOATS=[['ทุเรียน','#3E7A2E','#7CB342'],['องุ่น','#7B3FB5','#9C5BD6'],['สตรอว์เบอร์รี','#D4313B','#E85A62'],['กล้วย','#7A4A22','#E0B43A'],['มะนาว','#2F7A33','#A6C83A']];
const LINES=[50,100,150,200,250,300,350],BOXLINES=[50,100,150,200,250,300],GOAL=400;
const CARD_TIME=30000,TARGET_TIME=10*60000,MENU_MAX=8;
const BOAT_DISHES=['food-01','food-02','food-09','food-10']; // เมนูเรือเดิม (ใช้เมื่อแอดมินยังไม่ตั้งเสบียง)
const CARDS=[['supply',30,'เติมเสบียง +10','เรือของทีมเดินหน้า 10 ทันที'],['cut',30,'ตัดเสบียง −10','เลือกเรือคู่แข่ง 1 ลำ ถอยหลัง 10'],['merit',20,'กุศลทั้งทีม','ลูกเรือทุกคนในทีม คนละ 5,000 กุศล'],['stop',15,'หยุดเรือ 30 นาที','ทีมอื่นทุกทีมส่งเสบียงไม่ได้ 30 นาที'],['kick',5,'การ์ดเตะ','เตะสมาชิกทีมอื่นออกได้ทีมละ 1 คน']];
const CMAP=Object.fromEntries(CARDS.map(c=>[c[0],c]));
const CARD_TH={supply:'เติมเสบียง',cut:'ตัดเสบียง',merit:'กุศล',stop:'หยุดเรือ',kick:'เตะ'};
const needsTarget=c=>c==='cut'||c==='kick';
const Host=parent.__HOST;if(!Host)throw new Error('กรุณาเข้าเกมจากหน้าล็อกอิน');
const ME=Host.uid,ADMIN=Host.admin;
let roster=[],R=norm({}),acting=false,off=0;
function norm(w){return {status:'setup',p:[0,0,0,0,0],team:{},kicked:{},claims:{},menus:{},boxes:[],sent:{},cd:{},credits:{},claimedCredits:{},log:[],stopUntil:0,names:{},lastTeam:{},pausedAt:null,...w,claims:w.claims||{},menus:w.menus||{},names:w.names||{},lastTeam:w.lastTeam||{},boxes:w.boxes||[],team:w.team||{},kicked:w.kicked||{},cd:w.cd||{},sent:w.sent||{},log:w.log||[]};}
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
const thaiLog=s=>String(s).replace(/ใช้การ์ด (supply|cut|merit|stop|kick)\b/g,(_,k)=>'ใช้การ์ด'+CARD_TH[k]);
async function action(input,quiet){if(acting)return null;acting=true;try{const out=await Host.cloud('boat',input);setOff(out.serverNow);if(out.race)R=norm(out.race);update();if(out.meritSelf?.length)meritPop(out.meritSelf[0]);return out;}catch(e){if(!quiet)ann(e.message,true);return quiet?null:{error:e.message};}finally{acting=false;}}
const ok=out=>out&&!out.error;
function open(h){$('sb').innerHTML=h;$('sheet').classList.add('on');$('shade').classList.add('on');}
function closeAll(){$('sheet').classList.remove('on');$('shade').classList.remove('on');}
let popTimer=0;function popScreen(h){clearInterval(popTimer);$('pop').classList.add('on');$('popBody').innerHTML=h;}
function closePop(){clearInterval(popTimer);$('pop').classList.remove('on');$('popBody').innerHTML='';update();}
$('shade').onclick=closeAll;$('popX').onclick=closePop;
function fit(){const u=Math.min(innerWidth/390,innerHeight/760);document.documentElement.style.fontSize=(16*Math.max(.82,Math.min(u,1.35)))+'px';const s=$('stage'),sc=Math.min(innerWidth/W,innerHeight/H);s.style.width=W*sc+'px';s.style.height=H*sc+'px';s.style.fontSize=(W*sc/941*18)+'px'}
let at;function ann(m,err){$('aImg').src=err?IMG.oops:IMG.happy;$('aTxt').innerHTML=m;$('ann').className='ann show'+(err?' err':'');clearTimeout(at);at=setTimeout(()=>$('ann').className='ann',3000)}
const Y0=1520,Y1=230; // ล่างสุด = 0 / บนสุด = 400
const yOf=p=>Y0-(Y0-Y1)*p/GOAL;
function laneX(b,y){const t=Math.max(0,Math.min(1,(y-200)/500));const L=340+(205-340)*t,Rr=600+(735-600)*t;return L+(Rr-L)*(b-.5)/5}
const pct=(v,t)=>v/t*100+'%';

/* ฉาก: สร้างครั้งเดียว แล้วอัปเดตตำแหน่งทีละนิด เรือจึงเลื่อนนุ่ม */
let built=false,boatEls=[],lblEls={},giftEls=new Map(),prevP=null,prevStatus=null;
function build(){const s=$('stage');s.innerHTML='';s.style.backgroundImage='url('+IMG.bg+')';$('view').style.setProperty('--bg','url('+IMG.bg+')');giftEls=new Map();lblEls={};
 [...LINES,GOAL].forEach(L=>{const y=yOf(L),x0=laneX(.5,y)-20,x1=laneX(5.5,y)+20;const d=document.createElement('div');d.className='line'+(L===GOAL?' fin':'');Object.assign(d.style,{left:pct(x0,W),width:pct(x1-x0,W),top:pct(y,H)});s.appendChild(d);
  const l=document.createElement('div');l.className='lbl';l.style.left=pct(x0-4,W);l.style.top=pct(y,H);s.appendChild(l);lblEls[L]=l;});
 boatEls=BOATS.map(([nm,col],i)=>{const b=i+1,d=document.createElement('div');d.className='boat';Object.assign(d.style,{width:'4.6%',fontSize:'.62em'});
  d.innerHTML='<img class="hull" src="'+IMG['b'+b]+'"><span class="num" style="color:'+col+'">'+b+'</span><span class="stopv" style="display:none">⏸️</span><span class="tag"></span><span class="win" style="display:none">🏁 ผู้ชนะ</span>';
  d.onclick=()=>ADMIN&&R.status==='setup'?openPick(b):openCrew(b);s.appendChild(d);return d;});
 built=true;update();}
function ripple(el){const r=document.createElement('span');r.className='ripple';el.appendChild(r);setTimeout(()=>r.remove(),950);}
function update(){if(!built)return build();const now=clock();
 [...LINES,GOAL].forEach(L=>{const c=(R.claims?.[L]||[]).length;lblEls[L].innerHTML=(L===GOAL?'🏁 ':'')+L+(BOXLINES.includes(L)?' <i>'+'✅'.repeat(Math.min(2,c))+'🎁'.repeat(Math.max(0,2-c))+'</i>':'');});
 BOATS.forEach((_,i)=>{const b=i+1,p=R.p[i]||0,y=yOf(p),d=boatEls[i];d.style.left=pct(laneX(b,y),W);d.style.top=pct(y,H);d.classList.toggle('mine',b===myBoat());
  const stopped=R.stopUntil>now&&R.stopBy!==b&&(R.status==='running'||R.status==='paused');d.querySelector('.stopv').style.display=stopped?'':'none';
  d.querySelector('.tag').innerHTML='🧑‍✈️'+members(b).length+' • <b>'+p+'</b>';d.querySelector('.win').style.display=R.winner===b?'':'none';
  if(prevP&&p>prevP[i])ripple(d);});
 const waiting=new Set();
 R.boxes.filter(x=>!x.opened&&(R.status==='running'||R.status==='paused')).forEach(x=>{waiting.add(x.id);let g=giftEls.get(x.id);
  if(!g){g=document.createElement('div');g.innerHTML='<img src="'+IMG.box+'">';g.onclick=()=>{const box=R.boxes.find(b=>b.id===x.id);if(!box||box.opened)return;if(ADMIN)return ann('กล่องของทีมเรือ '+box.boat);if(box.boat!==myBoat())return ann('กล่องนี้เป็นของทีมเรือ '+box.boat+' นะ',1);if(isKicked(ME))return ann('คุณถูกเตะออกแล้ว เปิดกล่องไม่ได้',1);if(R.status!=='running')return ann('พักการแข่งขันอยู่ รอแข่งต่อนะ',1);openBox(box);};$('stage').appendChild(g);giftEls.set(x.id,g);}
  const y=yOf(R.p[x.boat-1]),gx=laneX(x.boat,y),same=R.boxes.filter(o=>!o.opened&&o.boat===x.boat),k=same.indexOf(x);
  g.className='gift'+(x.boat===myBoat()&&!isKicked(ME)?'':' other');g.style.left=pct(gx+48+k*30,W);g.style.top=pct(y-40-k*20,H);});
 for(const [id,g]of giftEls)if(!waiting.has(id)){g.remove();giftEls.delete(id);}
 const mb=myBoat();$('myTeam').innerHTML=ADMIN?'👑 แอดมิน • '+label(ME):(mb?(isKicked(ME)?'❌ '+label(ME)+' ถูกเตะออกจากเรือ '+mb:'🧑‍✈️ '+label(ME)+' • เรือ '+mb+' '+BOATS[mb-1][0]+((R.cd[ME]||0)>now&&R.status!=='finished'?' • พักส่ง '+fmt(R.cd[ME]-now):'')):'👀 '+label(ME)+' • รอบนี้ไม่ได้ร่วมแข่ง');
 const lk=$('lock');if(R.status==='finished'&&R.winner){lk.classList.add('on');lk.innerHTML='🏁 เรือ '+R.winner+' '+BOATS[R.winner-1][0]+' ชนะ! การแข่งจบแล้ว<small>รอยัยหนูเปิดรอบใหม่ • แตะเรือเพื่อดูรายชื่อและผลของแต่ละทีม</small>'}
 else if(R.status==='setup'){lk.classList.add('on');lk.innerHTML='⏳ แอดมินกำลังจัดทีมรอบใหม่<small>รอสักครู่นะ</small>'}else if(R.status==='paused'){lk.classList.add('on');lk.innerHTML='⏸️ พักการแข่งขัน<small>เวลาพักส่งและการ์ดหยุดไว้ก่อน</small>'}else lk.classList.remove('on');
 if(prevStatus==='running'&&R.status==='finished')confetti();
 prevP=[...R.p];prevStatus=R.status;}
function confetti(){const c=document.createElement('div');c.className='confetti';const cols=['#FFD86B','#F39AB2','#6CC9A8','#5BB6D4','#B58CE0','#fff'];
 for(let i=0;i<70;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.background=cols[i%cols.length];p.style.animationDelay=(Math.random()*1.2)+'s';p.style.animationDuration=(2.2+Math.random()*1.8)+'s';p.style.transform='rotate('+Math.random()*360+'deg)';c.appendChild(p);}
 document.body.appendChild(c);setTimeout(()=>c.remove(),5200);}

/* ส่งเสบียง */
function supplyState(b){if(R.status!=='running')return R.status==='paused'?'⏸️ พักการแข่งขันอยู่':'การแข่งขันยังไม่เปิด';if(b!==myBoat()||isKicked(ME))return '';const now=SNow();if(R.stopUntil>now&&R.stopBy!==b)return '⏸️ ถูกหยุด '+fmt(R.stopUntil-now);if((R.cd[ME]||0)>now)return '⏱️ ส่งได้อีกใน '+fmt(R.cd[ME]-now);return 'ok';}
function supplyHTML(b){const st=supplyState(b);if(st!=='ok')return st?'<div class="hint">'+st+'</div>':'';const game=JSON.parse(Host.get('s3all-v1')||'{}'),menus=R.menus?.[b]?.length?R.menus[b]:BOAT_DISHES;return '<div class="hint">🍱 ส่งอาหาร 1 จาน = +1 • พักส่ง 5 นาที</div>'+menus.map(key=>{const c=CATALOG.find(c=>c.k===key);if(!c)return '';const group=c.p.split('.')[0],id=c.p.slice(group.length+1),n=game.bag?.[group]?.[id]||0;return '<button class="opt" data-food="'+esc(id)+'" data-group="'+group+'" '+(n>0?'':'disabled')+'><img src="images/'+c.i+'"><b>'+esc(c.n)+'</b><span>มี '+n+'</span></button>';}).join('');}
function menuList(b){const menus=R.menus?.[b]?.length?R.menus[b]:BOAT_DISHES;return '<div class="hint">🍱 เสบียงเรือนี้: '+menus.map(k=>esc(CATALOG.find(c=>c.k===k)?.n||k)).join(' • ')+'</div>';}
function openCrew(b){const m=members(b),out=Object.keys(R.team).filter(n=>R.team[n]===b&&R.kicked[n]);
 open('<h3>🧑‍✈️ กะลาสีเรือ '+b+' '+BOATS[b-1][0]+'</h3><div class="hint">'+(R.p[b-1]||0)+'/400 • '+m.length+' คน</div>'+m.map(uid=>'<div class="mem'+(uid===ME?' me':'')+'"><b>'+label(uid)+'</b><span>ส่ง '+(R.sent[uid]||0)+' จาน</span></div>').join('')+out.map(uid=>'<div class="mem out"><b>❌ '+label(uid)+'</b><span>ถูกเตะออก</span></div>').join('')+(R.status!=='setup'&&b!==myBoat()?menuList(b):'')+supplyHTML(b));
 $('sb').querySelectorAll('[data-food]').forEach(el=>el.onclick=async()=>{const out=await action({type:'supply',group:el.dataset.group,food:el.dataset.food});if(ok(out)){closeAll();ann('ส่งเสบียงสำเร็จ เรือ '+b+' +1');}});}

/* กล่องและการ์ด */
function openBox(box){if(box.picked!==undefined)return showPicked(box.id);
 popScreen('<div class="chest" id="chest" style="background-image:url('+IMG.boxopen+')"></div><h3>🎁 กล่องจากเส้น '+box.line+'</h3><div class="hint">แตะกล่องเพื่อเปิด</div>');
 $('chest').onclick=()=>{$('chest').onclick=null;let f=0;const timer=setInterval(()=>{const el=$('chest');if(!el){clearInterval(timer);return;}el.style.backgroundPosition=((f%4)*100/3)+'% '+(Math.floor(f/4)*100/3)+'%';if(f===9){el.classList.add('burst');const fl=document.createElement('div');fl.className='flash';$('pop').appendChild(fl);setTimeout(()=>fl.remove(),700);}if(f++>=15){clearInterval(timer);showCards(box);}},70);};}
function cardHTML(i,front,cls){return '<div class="tc '+cls+'" data-index="'+i+'"><div class="i"><div class="k"><img src="'+IMG.back+'"></div>'+(front?'<div class="f"><img src="'+IMG['c-'+front]+'"></div>':'')+'</div></div>';}
function showCards(box){popScreen('<h3>เลือกการ์ด 1 ใบ</h3><div class="hint">การ์ดถูกสุ่มบนเซิร์ฟเวอร์แล้ว เลือกหนึ่งใบ</div><div class="cards">'+[0,1,2,3,4].map(i=>cardHTML(i,'','deal')).join('')+'</div>');
 const els=[...$('popBody').querySelectorAll('[data-index]')];els.forEach((el,i)=>{setTimeout(()=>el.classList.add('in'),80+i*130);el.onclick=()=>{els.forEach(e=>e.onclick=null);choose(box,i);};});}
async function choose(box,index){const out=await action({type:'pick',box:box.id,index});
 if(!ok(out)||!out.reveal){if(R.boxes.find(b=>b.id===box.id)?.picked!==undefined)return showPicked(box.id);return showCards(box);}
 popScreen('<h3>🎴 พลิกการ์ด</h3><div class="cards">'+out.reveal.map((card,i)=>cardHTML(i,card,'in'+(i===index?' pick':''))).join('')+'</div>');
 const els=[...$('popBody').querySelectorAll('[data-index]')];setTimeout(()=>els[index].classList.add('flip'),60);
 els.forEach((el,i)=>{if(i!==index)setTimeout(()=>el.classList.add('flip','dim'),550+i*120);});
 setTimeout(()=>{if($('pop').classList.contains('on'))showPicked(box.id);},2100);}
function showPicked(id){const box=R.boxes.find(b=>b.id===id);if(!box||box.opened){closePop();return;}const card=box.card;
 const remain=()=>{const cur=R.boxes.find(b=>b.id===id)||box;return Math.ceil(((cur.pickedAt||SNow())+CARD_TIME-clock())/1000);};
 if(needsTarget(card)&&remain()<=0)return showTarget(id);
 popScreen('<div class="picked"><img src="'+IMG['c-'+card]+'"></div><div class="res">🎴 คุณได้การ์ด: '+CMAP[card][2]+'<small>'+CMAP[card][3]+'</small></div><div class="row"><button class="btn g" id="apply">✨ ใช้การ์ด (<span id="countdown">'+Math.max(0,remain())+'</span>)</button></div>');
 let sending=false,retryAt=0;
 const go=async()=>{if(needsTarget(card))return showTarget(id);if(sending||Date.now()<retryAt)return;sending=true;const out=await useCard(id,{});sending=false;if(!out)retryAt=Date.now()+2000;};
 $('apply').onclick=go;
 popTimer=setInterval(()=>{const cur=R.boxes.find(b=>b.id===id);if(!cur||cur.opened){closePop();ann('ใช้การ์ด'+CARD_TH[card]+'แล้ว');return;}if(R.status!=='running')return;const n=Math.max(0,remain());if($('countdown'))$('countdown').textContent=n;if(n<=0)go();},250);}
/* เลือกเป้าหลังนับถอยหลัง ไม่จับเวลา (เซิร์ฟเวอร์สุ่มให้เองถ้าไม่เลือกภายใน 10 นาที) */
function showTarget(id){const box=R.boxes.find(b=>b.id===id);if(!box||box.opened){closePop();return;}const card=box.card,mb=box.boat;
 let h='<div class="picked sm"><img src="'+IMG['c-'+card]+'"></div><div class="res">'+CMAP[card][2]+'<small>เลือกได้สบายๆ ไม่จับเวลา</small></div>';
 if(card==='cut')h+='<div class="tgt">'+BOATS.map((b,i)=>i+1===mb?'':'<button class="opt" data-boat="'+(i+1)+'"><img src="'+IMG['b'+(i+1)]+'"><b>เรือ '+(i+1)+' '+b[0]+'</b><span>'+(R.p[i]||0)+'/400</span></button>').join('')+'</div>';
 else{const teams=[1,2,3,4,5].filter(b=>b!==mb&&members(b).length);h+=teams.length?'<div class="tgt">'+teams.map(b=>'<div class="kt"><b>เรือ '+b+' '+BOATS[b-1][0]+'</b>'+members(b).map((uid,j)=>'<button class="chipb'+(j===0?' on':'')+'" data-kt="'+b+'" data-uid="'+esc(uid)+'">'+label(uid)+'</button>').join('')+'</div>').join('')+'</div><div class="row"><button class="btn r" id="kickGo">❌ เตะออก</button></div>':'<div class="hint">ไม่มีคู่แข่งให้เตะ</div><div class="row"><button class="btn g" id="kickGo">ใช้การ์ด</button></div>';}
 popScreen(h);
 popTimer=setInterval(()=>{const cur=R.boxes.find(b=>b.id===id);if(!cur||cur.opened){closePop();ann('การ์ดถูกใช้แล้ว');}},500);
 $('popBody').querySelectorAll('[data-boat]').forEach(el=>el.onclick=()=>useCard(id,{targetBoat:+el.dataset.boat}));
 $('popBody').querySelectorAll('[data-kt]').forEach(el=>el.onclick=()=>{$('popBody').querySelectorAll('[data-kt="'+el.dataset.kt+'"]').forEach(x=>x.classList.toggle('on',x===el));});
 if($('kickGo'))$('kickGo').onclick=()=>useCard(id,{targets:[...$('popBody').querySelectorAll('[data-kt].on')].map(el=>el.dataset.uid)});}
async function useCard(id,extra){const box=R.boxes.find(b=>b.id===id);if(!box)return closePop();const card=box.card;
 const out=await action({type:'card',box:id,index:box.picked,...extra});
 if(ok(out)){if(!out.meritSelf?.length)closePop();if(card!=='merit')ann('ใช้การ์ด'+CARD_TH[card]+'แล้ว');return out;}
 if(out?.error&&/ใช้ไปแล้ว/.test(out.error))closePop();return null;}
function meritPop(m){popScreen('<img class="face" src="'+IMG.happy+'"><div class="res">🎉 ทีมเรือ '+m.boat+' เปิดได้การ์ดกุศล!<small>คุณได้รับ +'+Number(m.merit||5000).toLocaleString()+' กุศล เข้ากระเป๋าแล้ว</small></div><div class="row"><button class="btn g" id="gotIt">รับแล้ว</button></div>');$('gotIt').onclick=closePop;}

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
function watchDeadlines(){if(R.status!=='running'||acting||Date.now()<nextStatus)return;if(R.boxes.some(b=>!b.opened&&b.picked!==undefined&&deadlineOf(b)+jitter<SNow())){nextStatus=Date.now()+20000;action({type:'status'},true);}}
async function initialize(){try{roster=await Host.roster();const stop=Host.watchWorld('boat',world=>{if(world)R=norm(world);update();const reward=(R.credits?.[ME]||0)-(R.claimedCredits?.[ME]||0);if(reward>0&&!acting)action({type:'claimCredit'},true);});addEventListener('pagehide',stop,{once:true});update();action({type:'status'},true);}catch(e){ann(e.message,true);}}
addEventListener('resize',()=>{fit();build();});fit();build();initialize();
setInterval(()=>{update();watchDeadlines();},1000);
