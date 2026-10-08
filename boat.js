
const IMG={"bg": "images/boat-boatrace-bg.webp", "box": "images/boat-box.webp", "boxopen": "images/boat-box-open.webp", "back": "images/boat-boatcard-back.webp", "happy": "images/honey-face-happy.webp", "oops": "images/honey-face-oops.webp", "b1": "images/boat-1.webp", "b2": "images/boat-2.webp", "b3": "images/boat-3.webp", "b4": "images/boat-4.webp", "b5": "images/boat-5.webp", "c-supply": "images/boat-boatcard-supply.webp", "c-cut": "images/boat-boatcard-cut.webp", "c-merit": "images/boat-boatcard-merit.webp", "c-stop": "images/boat-boatcard-stop.webp", "c-kick": "images/boat-boatcard-kick.webp", "f1": "images/food-01.webp", "f2": "images/food-02.webp", "f9": "images/food-09.webp", "f10": "images/food-10.webp"};const W=941,H=1672,$=id=>document.getElementById(id);
const BOATS=[['ทุเรียน','#3E7A2E','#7CB342'],['องุ่น','#7B3FB5','#9C5BD6'],['สตรอว์เบอร์รี','#D4313B','#E85A62'],['กล้วย','#7A4A22','#E0B43A'],['มะนาว','#2F7A33','#A6C83A']];
const LINES=[50,100,150,200,250,300,350],BOXLINES=[50,100,150,200,250,300],GOAL=400;
const CARDS=[['supply',30,'เติมเสบียง +10','เรือของทีมเดินหน้า 10 ทันที'],['cut',30,'ตัดเสบียง −10','เลือกเรือคู่แข่ง 1 ลำ ถอยหลัง 10'],['merit',20,'กุศลทั้งทีม','สมาชิกทุกคนในทีม คนละ 5,000 กุศล'],['stop',15,'หยุดเรือ 30 นาที','ทีมอื่นทุกทีมส่งเสบียงไม่ได้ 30 นาที'],['kick',5,'คัดคนออก','คัดสมาชิกทีมอื่นออกได้ทีมละ 1 คน']];
const CMAP=Object.fromEntries(CARDS.map(c=>[c[0],c]));
const Host=parent.__HOST;if(!Host)throw new Error('กรุณาเข้าเกมจากหน้าล็อกอิน');
const ME=Host.uid,ADMIN=Host.admin;
let roster=[],R={status:'setup',p:[0,0,0,0,0],team:{},kicked:{},boxes:[],sent:{},cd:{},credits:{},claimedCredits:{},log:[],stopUntil:0},acting=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=uid=>esc(roster.find(x=>x.uid===uid)?.name||JSON.parse(Host.get('s3user')||'{}').name||uid);
const myBoat=()=>R.team[ME]||0,isKicked=n=>!!R.kicked[n];
const members=b=>Object.keys(R.team).filter(n=>R.team[n]===b&&!R.kicked[n]);
const fmt=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
async function action(input){if(acting)return null;acting=true;try{const out=await Host.cloud('boat',input);R=out.race;draw();return out;}catch(e){ann(e.message,true);return null;}finally{acting=false;}}
function open(h){$('sb').innerHTML=h;$('sheet').classList.add('on');$('shade').classList.add('on');}
function closeAll(){$('sheet').classList.remove('on');$('shade').classList.remove('on');}
function closePop(){$('pop').classList.remove('on');draw();}
$('shade').onclick=closeAll;
function fit(){const u=Math.min(innerWidth/390,innerHeight/760);document.documentElement.style.fontSize=(16*Math.max(.82,Math.min(u,1.35)))+'px';const s=$('stage'),sc=Math.min(innerWidth/W,innerHeight/H);s.style.width=W*sc+'px';s.style.height=H*sc+'px';s.style.fontSize=(W*sc/941*18)+'px'}
let at;function ann(m,err){$('aImg').src=err?IMG.oops:IMG.happy;$('aTxt').innerHTML=m;$('ann').className='ann show'+(err?' err':'');clearTimeout(at);at=setTimeout(()=>$('ann').className='ann',3000)}
const Y0=1520,Y1=230; // ล่างสุด = 0 / บนสุด = 400
const yOf=p=>Y0-(Y0-Y1)*p/GOAL;
function laneX(b,y){const t=Math.max(0,Math.min(1,(y-200)/500));const L=340+(205-340)*t,Rr=600+(735-600)*t;return L+(Rr-L)*(b-.5)/5}
const sizeAt=y=>.62+.38*Math.max(0,Math.min(1,(y-200)/1300));
function draw(){const s=$('stage');s.innerHTML='';s.style.backgroundImage='url('+IMG.bg+')';document.getElementById('view').style.setProperty('--bg','url('+IMG.bg+')');
 [...LINES,GOAL].forEach(L=>{const y=yOf(L),x0=laneX(.5,y)-20,x1=laneX(5.5,y)+20;const d=document.createElement('div');d.className='line'+(L===GOAL?' fin':'');Object.assign(d.style,{left:x0/W*100+'%',width:(x1-x0)/W*100+'%',top:y/H*100+'%'});s.appendChild(d);
  const l=document.createElement('div');l.className='lbl';l.style.left=(x0-4)/W*100+'%';l.style.top=y/H*100+'%';
  const c=(R.claims[L]||[]).length;l.innerHTML=(L===GOAL?'🏁 ':'')+L+(BOXLINES.includes(L)?' <i>'+'✅'.repeat(c)+'🎁'.repeat(2-c)+'</i>':'');s.appendChild(l)});
 BOATS.forEach(([nm,col],i)=>{const b=i+1,p=R.p[i],y=yOf(p),x=laneX(b,y),sc=sizeAt(y);const d=document.createElement('div');d.className='boat'+(b===myBoat()?' mine':'');
  Object.assign(d.style,{left:x/W*100+'%',top:y/H*100+'%',width:'4.6%',fontSize:'.62em'});
  const stopped=R.stopUntil>Date.now()&&R.stopBy!==b&&R.status==='running';
  d.innerHTML='<img class="hull" src="'+IMG['b'+b]+'"><span class="num" style="color:'+col+'">'+b+'</span>'+(stopped?'<span class="stopv">⏸️</span>':'')+'<span class="tag">🧑‍✈️'+members(b).length+' • <b>'+p+'</b></span>'+(R.winner===b?'<span class="win">🏁 ผู้ชนะ</span>':'');
  d.onclick=()=>ADMIN&&R.status==='setup'?openPick(b):openCrew(b);s.appendChild(d)});
 // กล่องที่รอเปิด
 R.boxes.filter(x=>!x.opened).forEach(x=>{const y=yOf(R.p[x.boat-1]),gx=laneX(x.boat,y);const g=document.createElement('div');g.className='gift'+(x.boat===myBoat()&&!isKicked(ME)?'':' other');
  Object.assign(g.style,{left:(gx+48)/W*100+'%',top:(y-40)/H*100+'%'});g.innerHTML='<img src="'+IMG.box+'">';g.onclick=()=>{if(x.boat!==myBoat())return ann('กล่องนี้เป็นของทีมเรือ '+x.boat+' นะ',1);if(isKicked(ME))return ann('คุณถูกคัดออกแล้ว เปิดกล่องไม่ได้',1);openBox(x)};s.appendChild(g)});
 // ป้ายบน / ปุ่มล่าง
 const mb=myBoat();$('myTeam').innerHTML=ADMIN?'👑 แอดมิน • '+label(ME):(mb?(isKicked(ME)?'❌ '+label(ME)+' ถูกคัดออกจากเรือ '+mb:'🧑‍✈️ '+label(ME)+' • รอบนี้คุณอยู่เรือ '+mb+' '+BOATS[mb-1][0]):'👀 '+label(ME)+' • รอบนี้ไม่ได้ร่วมแข่ง');
 const lk=$('lock');if(R.status==='finished'){lk.classList.add('on');lk.innerHTML='🏁 เรือ '+R.winner+' '+BOATS[R.winner-1][0]+' ชนะ! การแข่งจบแล้ว<small>รอยัยหนูเปิดรอบใหม่ • แตะเรือเพื่อดูรายชื่อและผลของแต่ละทีม</small>'}
 else if(R.status==='setup'){lk.classList.add('on');lk.innerHTML='⏳ แอดมินกำลังจัดทีมรอบใหม่<small>รอสักครู่นะ</small>'}else lk.classList.remove('on')}
function supplyState(b){if(R.status!=='running')return 'การแข่งขันยังไม่เปิด';if(b!==myBoat()||isKicked(ME))return '';if(R.stopUntil>Date.now()&&R.stopBy!==b)return '⏸️ ถูกหยุด '+fmt(R.stopUntil-Date.now());if((R.cd[ME]||0)>Date.now())return '⏱️ ส่งได้อีกใน '+fmt(R.cd[ME]-Date.now());return 'ok';}
function supplyHTML(b){const st=supplyState(b);if(st!=='ok')return '<div class="hint">'+st+'</div>';const game=JSON.parse(Host.get('s3all-v1')||'{}'),food=game.bag?.food||{};return '<div class="hint">🍱 ส่งอาหาร 1 จาน = +1 • พักส่ง 5 นาที</div>'+[[1,'ข้าวผัดไข่'],[2,'ซุปฟักทอง'],[9,'ออมเล็ตโรซี่'],[10,'ไข่อบอัญชัน']].map(([i,n])=>'<button class="opt" data-food="'+n+'" '+(food[n]>0?'':'disabled')+'><img src="'+IMG['f'+i]+'"><b>'+n+'</b><span>มี '+(food[n]||0)+'</span></button>').join('');}
function openCrew(b){const m=members(b);open('<h3>🧑‍✈️ กะลาสีเรือ '+b+' '+BOATS[b-1][0]+'</h3><div class="hint">'+R.p[b-1]+'/400 • '+m.length+' คน</div>'+m.map(uid=>'<div class="mem"><b>'+label(uid)+'</b><span>ส่ง '+(R.sent[uid]||0)+' จาน</span></div>').join('')+supplyHTML(b));$('sb').querySelectorAll('[data-food]').forEach(el=>el.onclick=async()=>{const out=await action({type:'supply',group:'food',food:el.dataset.food});if(out){closeAll();ann('ส่งเสบียงสำเร็จ กุศลบันทึกบนคลาวด์แล้ว');}});}
function openBox(box){if(box.picked!==undefined){$('pop').classList.add('on');showPicked(box.card,box,box.picked);return;}$('pop').classList.add('on');$('popBody').innerHTML='<div class="chest" id="chest" style="background-image:url('+IMG.boxopen+')"></div><h3>🎁 กล่องจากเส้น '+box.line+'</h3><div class="hint">แตะกล่องเพื่อเปิด</div>';$('chest').onclick=()=>{let f=0;const timer=setInterval(()=>{const el=$('chest');if(!el){clearInterval(timer);return;}el.style.backgroundPosition=((f%4)*100/3)+'% '+(Math.floor(f/4)*100/3)+'%';if(f++>=15){clearInterval(timer);showCards(box);}},70);$('chest').onclick=null;};}
function showCards(box){$('popBody').innerHTML='<h3>เลือกการ์ด 1 ใบ</h3><div class="hint">การ์ดถูกสุ่มบนเซิร์ฟเวอร์แล้ว เลือกหนึ่งใบ</div><div class="cards">'+Array.from({length:5},(_,i)=>'<button class="tc in" data-index="'+i+'"><div class="i"><div class="k"><img src="'+IMG.back+'"></div></div></button>').join('')+'</div>';$('popBody').querySelectorAll('[data-index]').forEach(el=>el.onclick=()=>choose(box,+el.dataset.index));}
async function choose(box,index){const out=await action({type:'pick',box:box.id,index});if(!out)return;$('popBody').innerHTML='<div class="cards">'+out.reveal.map((card,i)=>'<div class="tc in flip '+(i===index?'pick':'dim')+'"><div class="i"><div class="f"><img src="'+IMG['c-'+card]+'"></div></div></div>').join('')+'</div>';setTimeout(()=>showPicked(out.card,box,index),1100);}
function showPicked(card,box,index){
 const boats=BOATS.map((b,i)=>i+1===myBoat()?'':'<option value="'+(i+1)+'">เรือ '+(i+1)+' '+b[0]+'</option>').join('');
 const people=Object.keys(R.team).filter(uid=>R.team[uid]!==myBoat()&&!isKicked(uid)).map(uid=>'<option value="'+uid+'">'+label(uid)+'</option>').join('');
 $('popBody').innerHTML='<div class="picked"><img src="'+IMG['c-'+card]+'"></div><div class="res">'+CMAP[card][2]+'<small>'+CMAP[card][3]+'</small></div>'+(card==='cut'?'<select id="targetBoat">'+boats+'</select>':card==='kick'?'<select id="targetPerson">'+people+'</select>':'')+'<button class="btn g" id="apply">ใช้การ์ด (<span id="countdown">30</span>)</button>';
 let remaining=Math.max(0,Math.ceil(((R.boxes.find(b=>b.id===box.id)?.pickedAt||Date.now())+30000-Date.now())/1000)),done=false;
 const use=async()=>{if(done)return;done=true;clearInterval(timer);const input={type:'card',box:box.id,index};if(card==='cut')input.targetBoat=+$('targetBoat').value;if(card==='kick')input.targetPerson=$('targetPerson').value;const out=await action(input);if(out){closePop();ann(CMAP[card][2]);}else{done=false;$('apply').onclick=use;}};
 const timer=setInterval(()=>{if(!$('countdown')){clearInterval(timer);return;}$('countdown').textContent=String(--remaining);if(remaining<=0)use();},1000);
 $('apply').onclick=use;if(remaining<=0)use();
}
function openTeam(){if(!ADMIN)return;const counts=b=>Object.values(R.team).filter(v=>v===b).length;open('<h3>👥 จัดทีม</h3>'+BOATS.map((b,i)=>'<button class="opt" data-team="'+(i+1)+'"><img src="'+IMG['b'+(i+1)]+'"><b>เรือ '+(i+1)+' '+b[0]+'</b><span>'+counts(i+1)+' คน</span></button>').join('')+'<button class="btn g" id="raceStart">🏁 เริ่มการแข่งขัน</button>');$('sb').querySelectorAll('[data-team]').forEach(el=>el.onclick=()=>openPick(+el.dataset.team));$('raceStart').onclick=async()=>{if(await action({type:'start'}))closeAll();};}
function openPick(b){if(!ADMIN||R.status==='running')return;const selected=new Set(members(b));const render=()=>{open('<h3>เลือกสมาชิกเรือ '+b+'</h3>'+roster.map(p=>'<button class="opt" data-uid="'+p.uid+'"><b>'+(selected.has(p.uid)?'✅ ':'⬜ ')+label(p.uid)+'</b></button>').join('')+'<button class="btn g" id="saveTeam">บันทึกทีม</button>');$('sb').querySelectorAll('[data-uid]').forEach(el=>el.onclick=()=>{selected.has(el.dataset.uid)?selected.delete(el.dataset.uid):selected.add(el.dataset.uid);render();});$('saveTeam').onclick=async()=>{const team={...R.team};for(const uid of Object.keys(team))if(team[uid]===b)delete team[uid];for(const uid of selected)team[uid]=b;if(await action({type:'teams',team}))openTeam();};};render();}
$('logBtn').onclick=()=>open('<h3>📜 รายการล่าสุด</h3>'+R.log.map(x=>'<p>'+esc(x)+'</p>').join(''));
$('setBtn').hidden=!ADMIN;$('setBtn').onclick=()=>{open('<h3>👑 ควบคุมการแข่งขัน</h3><button class="btn g" id="teams">จัดทีม / เริ่ม</button><button class="btn r" id="reset">รีเซ็ตการแข่งขัน</button>');$('teams').onclick=openTeam;$('reset').onclick=()=>{open('<h3>ยืนยันรีเซ็ตการแข่งขัน?</h3><p>คะแนนและกล่องของรอบนี้จะเริ่มใหม่</p><button class="btn r" id="yesReset">ยืนยัน</button>');$('yesReset').onclick=async()=>{if(await action({type:'reset'}))closeAll();};};};
async function initialize(){try{roster=await Host.roster();const stop=Host.watchWorld('boat',world=>{if(world)R=world;draw();const reward=(R.credits[ME]||0)-(R.claimedCredits[ME]||0);if(reward>0&&!acting)action({type:'claimCredit'});});addEventListener('pagehide',stop,{once:true});draw();}catch(e){ann(e.message,true);}}
addEventListener('resize',()=>{fit();draw();});fit();initialize();
setInterval(()=>{const el=$('myTeam');if(el&&(R.cd[ME]||0)>Date.now())el.textContent=(roster.find(x=>x.uid===ME)?.name||'คุณ')+' • พักส่ง '+fmt(R.cd[ME]-Date.now());},1000);
