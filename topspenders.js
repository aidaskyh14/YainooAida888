
const $=id=>document.getElementById(id);const COLORS=['#F6B43C','#A9BDD0','#E09C70','#F6A9BD','#6CC9A8','#7FC7E8','#B49BE0','#E8A0C8'];
const Host=parent.__HOST;if(!Host)throw new Error('กรุณาเปิดจากเกมหลัก');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let PLAYERS=[],roster=[],D={rows:[],updatedAt:0},admin=Host.admin;const ME=JSON.parse(Host.get('s3user')||'{}').name||'ฉัน';
let pending=false;async function action(input){if(pending)return null;pending=true;try{return await Host.cloud('events',input);}catch(e){toast(e.message);return null;}finally{pending=false;}}
const fmt=n=>Number(n||0).toLocaleString();
function toast(m){$('toast').textContent=m;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2400)}
function sorted(){const by=new Map(D.rows.map(r=>[r.uid,r]));return roster.map(p=>({uid:p.uid,name:p.name,today:0,total:0,...by.get(p.uid)})).sort((a,b)=>b.total-a.total||b.today-a.today)}
function render(){const R=sorted(),col=n=>COLORS[[...n].reduce((a,c)=>a+c.charCodeAt(0),0)%COLORS.length];
 const pod=(r,c)=>r?'<div class="col c'+c+'"><div class="av" style="background:'+col(r.name)+'">'+esc(r.name[0])+'</div><div class="nm">'+esc(r.name)+'</div><div class="pt">💎 '+fmt(r.total)+'</div><div class="step">'+c+'</div></div>':'<div class="col c'+c+'"></div>';
 $('podium').innerHTML='<canvas class="spark" id="spark"></canvas>'+pod(R[1],2)+pod(R[0],1)+pod(R[2],3);
 $('list').innerHTML=R.slice(3).map((r,i)=>'<div class="row'+(r.name===ME?' me':'')+'"><span class="r">#'+(i+4)+'</span><b>'+esc(r.name)+'</b><small>'+(r.today?'+'+fmt(r.today):'–')+'</small><strong>'+fmt(r.total)+'</strong></div>').join('')||'';
 $('upd').textContent='🕐 อัปเดตล่าสุดโดยยัยหนู • '+new Date(D.updatedAt).toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short'});
 $('bar').innerHTML=admin?'<button class="btn" id="goEd">✏️ แก้ไขข้อมูล</button>':'';if(admin)$('goEd').onclick=openEdit;spark()}
function openEdit(){if(!admin)return;$('view').classList.add('hidden');$('edit').classList.remove('hidden');const by=new Map(D.rows.map(r=>[r.uid,r]));
 $('edList').innerHTML=roster.map(p=>{const r=by.get(p.uid)||{};return '<div class="ed"><b>'+esc(p.name)+'</b><input inputmode="numeric" data-n="'+esc(p.uid)+'" data-f="today" value="'+(r.today||0)+'"><input inputmode="numeric" data-n="'+esc(p.uid)+'" data-f="total" value="'+(r.total||0)+'"></div>';}).join('');
 $('bar').innerHTML='<button class="btn gray" id="cancel">ยกเลิก</button><button class="btn gray" id="zero">ล้างวันนี้</button><button class="btn g" id="saveB">💾 บันทึก</button>';$('cancel').onclick=closeEdit;$('zero').onclick=()=>document.querySelectorAll('[data-f="today"]').forEach(i=>i.value=0);
 $('saveB').onclick=async()=>{const m={};document.querySelectorAll('#edList input').forEach(i=>{const uid=i.dataset.n;m[uid] ||= {uid,today:0,total:0};m[uid][i.dataset.f]=Math.max(0,parseInt(String(i.value).replace(/[^0-9]/g,''))||0);});const out=await action({type:'save',rows:Object.values(m)});if(out){D=out.board;closeEdit();toast('บันทึกบนคลาวด์แล้ว');}};
}
function closeEdit(){$('edit').classList.add('hidden');$('view').classList.remove('hidden');render()}
$('sw').hidden=true;
function spark(){const c=$('spark');if(!c)return;const w=c.clientWidth,h=c.clientHeight;c.width=w;c.height=h;const x=c.getContext('2d');const P=Array.from({length:18},()=>({x:w/2+(Math.random()-.5)*w*.5,y:Math.random()*h,v:.2+Math.random()*.4,p:Math.random()*6}));
 (function f(){if(!document.body.contains(c))return;x.clearRect(0,0,w,h);P.forEach(p=>{p.y-=p.v;p.p+=.05;if(p.y<0)p.y=h;const a=(Math.sin(p.p)+1)/2;x.fillStyle='rgba(255,215,110,'+a+')';x.beginPath();x.arc(p.x,p.y,1.8,0,6.28);x.fill()});requestAnimationFrame(f)})()}
render();
(()=>{
const IMG={"machine": "images/gacha-machine.webp", "m-idle": "images/gacha-machine-idle.webp", "m-shake": "images/gacha-machine-shake.webp", "coinspin": "images/gacha-coin-spin.webp", "coin": "images/gacha-coin.webp", "c-orange": "images/gacha-candy-orange.webp", "c-purple": "images/gacha-candy-purple.webp", "c-pink": "images/gacha-candy-pink.webp", "c-witch": "images/gacha-candy-witch.webp", "sad": "images/gacha-sad.webp"},DIM={"m-idle": [206.0, 300.0], "m-shake": [200.0, 300.0], "coinspin": [184.0, 160.0]};
const q=s=>document.querySelector(s),rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const ITEMS=[['🌿','หญ้าครบ 5 สี','สีละ 1,000'],['🪵','ไม้ + หิน','อย่างละ 3,000'],['🥗','อาหารสวน 1 เมนู','5 ถาด'],['🍛','อาหารในบ้าน 1 เมนู','5 ถาด'],['⛽','แกลลอนน้ำมัน','1,000 แกลลอน'],['⚓','หมวกกะลาสี','50 ชิ้น'],['🎵','กล่องดนตรี','100 ชิ้น'],['✨','ขนทองอัลปาก้า','100 ชิ้น'],['🍷','ไวน์ครบ 4 ชนิด','อย่างละ 3'],['🥣','สากกะเบือ','100 ชิ้น'],['👻','วัตถุดิบโลกวิญญาณ 12 อย่าง','อย่างละ 100'],['📦','กล่องสุ่มหมา + แมว','อย่างละ 10'],['🎣','เบ็ดตกปลา','5 คัน คละแบบ'],['🎫','บัตรตกปลา VIP','3 ใบ']];
const RODS=['เบ็ดไผ่ลมหวน','เบ็ดจันทร์เสี้ยว','เบ็ดน้ำผึ้งหวานเจี๊ยบ','เบ็ดซากุระพลิ้ว'],CANDY=['orange','purple','pink','witch'];
const G={coins:{},kusal:150000,mail:{},log:[],sel:[],amt:2,busy:false,seq:1};
G.coins[ME]=Host.coins;G.mail[ME]=[];G.kusal=JSON.parse(Host.get('s3all-v1')||'{}').merit||0;
let PG='ts',idleIv;
function modal(h,acts=[{t:'ตกลง'}]){const c=q('#mcard');c.innerHTML=h+'<div class="acts"></div>';const a=c.querySelector('.acts');acts.forEach(x=>{const b=document.createElement('button');b.className='btn '+(x.c||'');b.textContent=x.t;b.onclick=()=>{q('#modal').classList.remove('on');x.f&&x.f()};a.appendChild(b)});q('#modal').classList.add('on')}
function showPage(p){PG=p;document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.pg===p));
  if(p==='ts'){q('#gpage').classList.add('hidden');closeEdit()}else{$('view').classList.add('hidden');$('edit').classList.add('hidden');q('#gpage').classList.remove('hidden');$('bar').innerHTML='';renderG()}window.scrollTo(0,0)}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>showPage(b.dataset.pg));

function wal(){G.coins[ME]=Host.coins;G.kusal=JSON.parse(Host.get('s3all-v1')||'{}').merit||0;q('#gwal').innerHTML=`<span class="chip"><img src="${IMG.coin}" alt="">${G.coins[ME]}</span><span class="chip">✨${fmt(G.kusal)}</span><button class="chip mail" id="mb">📮 ไปรษณีย์${Host.mailCount()?`<i>${Host.mailCount()}</i>`:''}</button>`;q('#mb').onclick=openMail;const sp=q('#spin');if(sp)sp.disabled=G.busy||G.coins[ME]<2}
function openMail(){Host.openMail();}
function frame(el,f){el.style.backgroundPosition=`${(f%4)*100/3}% ${Math.floor(f/4)*100/3}%`}
function idle(){clearInterval(idleIv);const m=q('#mspr');if(!m)return;m.style.backgroundImage=`url(${IMG['m-idle']})`;let f=0;idleIv=setInterval(()=>{frame(m,f);f=(f+1)%16},110)}
function showItems(){modal(`<h2>🎁 ของในตู้</h2><div class="igrid">${ITEMS.map(i=>`<div class="ig"><span>${i[0]}</span><b>${i[1]}</b>${i[2]}</div>`).join('')}<div class="ig k"><span>✨</span><b>กุศล</b>5–30,000</div><div class="ig n"><span>😢</span><b>ไม่ได้อะไร</b>ลุ้นใหม่</div></div><div class="odds" style="color:var(--cocoa)"><span style="background:#F3E9DE">🎁 ไอเทม 60%</span><span style="background:#F3E9DE">✨ กุศล 20%</span><span style="background:#F3E9DE">😢 20%</span></div>`)}
function renderG(){
  q('#gacha').innerHTML=`${[...Array(18)].map(()=>`<span class="star" style="left:${rnd(2,98)}%;top:${rnd(2,60)}%;animation-delay:${rnd(0,2.4)}s"></span>`).join('')}<span class="floaty" style="top:10%;animation-duration:19s">👻</span><span class="floaty" style="top:34%;animation-duration:27s;animation-delay:-9s">🦇</span><span class="floaty" style="top:52%;animation-duration:23s;animation-delay:-15s">👻</span>
    <div class="gtitle"><p>หมุนละ 2 เหรียญฮาโลวีน</p></div><div class="mwrap" id="mwrap"><div class="spr" id="mspr"></div></div>
    <div class="gctl"><button class="btn spin" id="spin">หมุนเลย!</button><div class="odds"><span>🎁 ไอเทม 60%</span><span>✨ กุศล 20%</span><span>😢 20%</span></div><button class="mini" id="items">🎁 ดูของในตู้</button></div>`;
  q('#spin').onclick=spin;q('#items').onclick=showItems;
  q('#gadmin').innerHTML=admin?'<div class="gbox"><h3>👑 ส่งเหรียญฮาโลวีน</h3><p class="note">เลือกผู้รับและจำนวนในหน้าส่งของแอดมิน เหรียญเข้าไปรษณีย์ผู้รับ</p><button class="btn g" id="sendCoins">📮 เปิดหน้าส่งของ</button></div>':'';
  if(admin)q('#sendCoins').onclick=()=>Host.openAdmin();
  wal();idle();
}
async function spin(){
  if(G.busy||Host.coins<2)return;G.busy=true;wal();const out=await action({type:'spin'});if(!out){G.busy=false;wal();return;}G.coins[ME]=Host.coins;
  const wrap=q('#mwrap'),m=q('#mspr'),btn=q('#spin'),g=q('#gacha');const res=out.reward,color=pick(CANDY);
  const c=document.createElement('div');c.className='coinfly';c.style.backgroundImage=`url(${IMG.coinspin})`;const br=btn.getBoundingClientRect(),gr=g.getBoundingClientRect(),wr=wrap.getBoundingClientRect();
  c.style.left=(br.left-gr.left+br.width/2-24)+'px';c.style.top=(br.top-gr.top-10)+'px';g.appendChild(c);let cf=0;const civ=setInterval(()=>{frame(c,cf);cf=(cf+1)%16},45);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.left=(wr.left-gr.left+wr.width*.5-24)+'px';c.style.top=(wr.top-gr.top+wr.height*.6)+'px';c.style.transform='scale(.45)'}));
  setTimeout(()=>{clearInterval(civ);c.remove();clearInterval(idleIv);m.style.backgroundImage=`url(${IMG['m-shake']})`;let f=0;const iv=setInterval(()=>{frame(m,f);f++;if(f>15){clearInterval(iv);drop()}},85)},760);
  function drop(){const cd=document.createElement('img');cd.className='candy drop';cd.src=IMG['c-'+color];wrap.appendChild(cd);idle();
    setTimeout(()=>{cd.className='candy wob';setTimeout(()=>{burst(wrap);cd.remove();show(res)},1000)},950)}
}
function burst(w){const b=document.createElement('div');b.className='burst';b.innerHTML=[...Array(22)].map(()=>{const a=Math.random()*6.28,d=rnd(40,120);return `<i style="--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;background:${pick(['#FFE07A','#F27E9B','#C9A8FF','#fff','#F28C28'])}"></i>`}).join('');w.appendChild(b);setTimeout(()=>b.remove(),900)}
function show(r){G.busy=false;
  if(r.type==='none')modal(`<img src="${IMG.sad}" style="width:9rem" alt=""><h2>ขอโทษค่ะ</h2><p>คุณไม่ได้อะไรเลยจากการสุ่มครั้งนี้ ดวงคุณมันแย่จริงๆ</p>`,[{t:'ลองใหม่'}]);
  else if(r.type==='kusal'){modal(`<div class="rw">✨</div><h2>ได้กุศล ${fmt(r.k)}!</h2><p class="note">ส่งเข้าไปรษณีย์แล้ว ไปกดรับได้เลย</p>`,[{t:'เก็บ'}])}
  else{modal(`<div class="rw">${r.it[0]}</div><h2>${r.it[1]}</h2><p><b>${r.it[2]}</b>${r.extra?`<br><span class="note">${r.extra}</span>`:''}</p><p class="note">ส่งเข้าไปรษณีย์แล้ว ไปกดรับได้เลย</p>`,[{t:'เก็บ'}])}
  wal();
}
})();


(async()=>{try{roster=await Host.roster();PLAYERS=roster.map(p=>p.name);const out=await action({type:'status'});if(out){D=out.board;render();const stop=Host.watchWorld('topspenders',data=>{if(data){D=data;if(!$('view').classList.contains('hidden'))render();}});addEventListener('pagehide',stop,{once:true});}}catch(e){toast(e.message);}})();
