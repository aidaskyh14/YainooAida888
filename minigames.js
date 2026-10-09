import {birdPosition,fireBird} from './solo-engine.js';
function soloOpen(k,a,b){return S.solo?.[k]==='open'||S.solo?.[k]!=='closed'&&inHours(a,b);}

const IMG={"coin": "images/gacha-coin.webp", "bs-bg": "images/bs-bg.webp", "pk-bg": "images/pk-shelf-bg.webp", "kg-bg": "images/kang-table-bg.webp", "br-bg": "images/minigame-mg-arena-bg.webp", "gun": "images/bs-gun.webp", "b-ghost": "images/bs-bird-ghost-fly-4x4.webp", "bi-ghost": "images/bs-bird-ghost.webp", "b-pumpkin": "images/bs-bird-pumpkin-fly-4x4.webp", "bi-pumpkin": "images/bs-bird-pumpkin.webp", "b-witch": "images/bs-bird-witch-fly-4x4.webp", "bi-witch": "images/bs-bird-witch.webp", "b-skeleton": "images/bs-bird-skeleton-fly-4x4.webp", "bi-skeleton": "images/bs-bird-skeleton.webp", "pk-normal": "images/pk-normal.webp", "pk-angel": "images/pk-angel.webp", "pk-devil": "images/pk-devil.webp", "pkt-angel": "images/pk-angel-turn-4x4.webp", "pkt-devil": "images/pk-devil-turn-4x4.webp", "k-spade-a": "images/kang-card-spade-a.webp", "k-spade-2": "images/kang-card-spade-2.webp", "k-spade-3": "images/kang-card-spade-3.webp", "k-spade-4": "images/kang-card-spade-4.webp", "k-spade-5": "images/kang-card-spade-5.webp", "k-spade-6": "images/kang-card-spade-6.webp", "k-spade-7": "images/kang-card-spade-7.webp", "k-spade-8": "images/kang-card-spade-8.webp", "k-spade-9": "images/kang-card-spade-9.webp", "k-spade-10": "images/kang-card-spade-10.webp", "k-spade-j": "images/kang-card-spade-j.webp", "k-spade-q": "images/kang-card-spade-q.webp", "k-spade-k": "images/kang-card-spade-k.webp", "k-heart-a": "images/kang-card-heart-a.webp", "k-heart-2": "images/kang-card-heart-2.webp", "k-heart-3": "images/kang-card-heart-3.webp", "k-heart-4": "images/kang-card-heart-4.webp", "k-heart-5": "images/kang-card-heart-5.webp", "k-heart-6": "images/kang-card-heart-6.webp", "k-heart-7": "images/kang-card-heart-7.webp", "k-heart-8": "images/kang-card-heart-8.webp", "k-heart-9": "images/kang-card-heart-9.webp", "k-heart-10": "images/kang-card-heart-10.webp", "k-heart-j": "images/kang-card-heart-j.webp", "k-heart-q": "images/kang-card-heart-q.webp", "k-heart-k": "images/kang-card-heart-k.webp", "k-diamond-a": "images/kang-card-diamond-a.webp", "k-diamond-2": "images/kang-card-diamond-2.webp", "k-diamond-3": "images/kang-card-diamond-3.webp", "k-diamond-4": "images/kang-card-diamond-4.webp", "k-diamond-5": "images/kang-card-diamond-5.webp", "k-diamond-6": "images/kang-card-diamond-6.webp", "k-diamond-7": "images/kang-card-diamond-7.webp", "k-diamond-8": "images/kang-card-diamond-8.webp", "k-diamond-9": "images/kang-card-diamond-9.webp", "k-diamond-10": "images/kang-card-diamond-10.webp", "k-diamond-j": "images/kang-card-diamond-j.webp", "k-diamond-q": "images/kang-card-diamond-q.webp", "k-diamond-k": "images/kang-card-diamond-k.webp", "k-club-a": "images/kang-card-club-a.webp", "k-club-2": "images/kang-card-club-2.webp", "k-club-3": "images/kang-card-club-3.webp", "k-club-4": "images/kang-card-club-4.webp", "k-club-5": "images/kang-card-club-5.webp", "k-club-6": "images/kang-card-club-6.webp", "k-club-7": "images/kang-card-club-7.webp", "k-club-8": "images/kang-card-club-8.webp", "k-club-9": "images/kang-card-club-9.webp", "k-club-10": "images/kang-card-club-10.webp", "k-club-j": "images/kang-card-club-j.webp", "k-club-q": "images/kang-card-club-q.webp", "k-club-k": "images/kang-card-club-k.webp", "k-back": "images/kang-card-back.webp", "br-candy": "images/minigame-mg-candy.webp", "br-crown": "images/minigame-mg-crown.webp", "br-dig-hole": "images/minigame-mg-dig-hole.webp", "br-ghost-cloak": "images/minigame-mg-ghost-cloak.webp", "br-ghost": "images/minigame-mg-ghost.webp", "br-grave": "images/minigame-mg-grave.webp", "br-pumpkin-bomb": "images/minigame-mg-pumpkin-bomb.webp", "br-smoke": "images/minigame-mg-smoke.webp", "br-warn-shadow": "images/minigame-mg-warn-shadow.webp", "br-wing-shoes": "images/minigame-mg-wing-shoes.webp", "br-pumpkin": "images/minigame-mg-pumpkin.webp", "br-fog": "images/minigame-mg-fog.webp"},DIM={"gun": [571, 494], "b-ghost": [183.0, 150.0], "b-pumpkin": [197.0, 150.0], "b-witch": [161.0, 150.0], "b-skeleton": [199.0, 150.0], "pk-normal": [50.0, 44.75], "pk-angel": [50.0, 39.25], "pk-devil": [50.0, 44.5], "pkt-angel": [218.0, 180.0], "pkt-devil": [413.0, 180.0]};
const $=s=>document.querySelector(s);
const fmt=n=>Math.round(n).toLocaleString('en-US');
const rnd=(a,b)=>a+Math.random()*(b-a), ri=(a,b)=>Math.floor(rnd(a,b+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const Host=parent.__HOST;if(!Host)throw new Error('กรุณาเปิดจากเกมหลัก');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let soloState={},serverOffset=0,acting=false;const time=()=>Date.now()+serverOffset;
const S={role:Host.admin?'admin':'player',coins:Host.coins,kusal:JSON.parse(Host.get('s3all-v1')||'{}').merit||0,mail:[],clock:'real',br:{open:false,fee:2},kang:[{open:false,base:10000,fee:1},{open:false,base:50000,fee:2}],cd:{pk:0,bs:0},brHist:[],kgHist:[]};
async function cloud(system,input){if(acting)return null;acting=true;const sent=Date.now();try{const out=await Host.cloud(system,input);if(out.serverNow)serverOffset=out.serverNow-(sent+Date.now())/2;if(out.state)soloState=out.state;if(out.progress?.cd)S.cd={pk:0,bs:0,...out.progress.cd};if(out.settings){S.br=out.settings.br;S.kang=out.settings.kang;S.solo=out.settings.solo||{};}S.coins=Host.coins;S.kusal=JSON.parse(Host.get('s3all-v1')||'{}').merit||0;renderWallet();return out;}catch(e){toast(e.message);return null;}finally{acting=false;}}
let CUR=null; // current game key
function thaiTime(){ // returns minutes of day in Thai time
  if(S.clock!=='real') return +S.clock*60;
  const d=new Date(Date.now()+7*3600e3); return d.getUTCHours()*60+d.getUTCMinutes();
}
function inHours(from,to){const m=thaiTime();return from<to? (m>=from*60&&m<to*60) : (m>=from*60||m<to*60)}
function minsUntil(h){const m=thaiTime();let d=h*60-m;if(d<=0)d+=1440;return d}
function hm(min){const h=Math.floor(min/60),m=min%60;return h? `${h} ชม. ${m} นาที`:`${m} นาที`}
function mmss(ms){ms=Math.max(0,ms);const s=Math.ceil(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2200)}
function modal(html,acts=[{t:'ตกลง'}]){
  const c=$('#mcard');c.innerHTML=html+'<div class="acts"></div>';const a=c.querySelector('.acts');
  acts.forEach(x=>{const b=document.createElement('button');b.className='btn '+(x.c||'');b.textContent=x.t;b.onclick=()=>{if(!x.keep)closeModal();x.f&&x.f()};a.appendChild(b)});
  $('#modal').classList.add('on');
}
function rules(title,cards,extra=''){modal(`<h2>📜 ${title}</h2><div class="rgrid">${cards.map(([e,b,s])=>`<div class="rc"><div class="e">${e}</div><b>${b}</b>${s?`<small>${s}</small>`:''}</div>`).join('')}</div>${extra}`,[{t:'เข้าใจแล้ว'}])}
function pills(list){return `<div class="pills">${list.map(([t,ok])=>`<span class="pill ${ok===false?'no':''}">${t}</span>`).join('')}</div>`}
function closeModal(){$('#modal').classList.remove('on')}
function coinImg(){return `<img src="${IMG.coin}" alt="">`}
function renderWallet(){S.coins=Host.coins;S.kusal=JSON.parse(Host.get('s3all-v1')||'{}').merit||0;const w=`<span class="chip">${coinImg()}${S.coins}</span><span class="chip">✨${fmt(S.kusal)}</span><button class="chip mail" id="mailbtn">📮${Host.mailCount()?`<i>${Host.mailCount()}</i>`:''}</button>`;$('#wal').innerHTML=w;$('#gwal').innerHTML=w.replace('id="mailbtn"','id="mailbtn2"');$('#mailbtn').onclick=openMail;$('#mailbtn2').onclick=openMail;}
function openMail(){Host.openMail();}
// sprite helper (4x4 sheets)
function sprite(key,hcqw,extra=''){const d=DIM[key];const w=hcqw*d[0]/d[1];return `<div class="spr ${extra}" data-k="${key}" style="width:${w}cqw;height:${hcqw}cqw;background-image:url(${IMG[key]})"></div>`}
function setFrame(el,f){el.style.backgroundPosition=`${(f%4)*100/3}% ${Math.floor(f/4)*100/3}%`}
function playSprite(el,fps=12,loop=false,done,from=0,to=15){let f=from;setFrame(el,f);const iv=setInterval(()=>{f++;if(f>to){if(loop)f=from;else{clearInterval(iv);done&&done();return}}setFrame(el,f)},1000/fps);return iv}
$('#role').hidden=true;
const GAMES={};
function openGame(k){CUR=k;$('#game').classList.add('on');$('#gtitle').textContent=GAMES[k].title;$('#gbody').innerHTML='';document.body.style.overflow='hidden';GAMES[k].open()}
function closeGame(){if(CUR&&GAMES[CUR].close)GAMES[CUR].close();CUR=null;$('#game').classList.remove('on');$('#gbody').innerHTML='';document.body.style.overflow='';renderHub()}
$('#gback').onclick=()=>{if(CUR&&GAMES[CUR].canLeave&&!GAMES[CUR].canLeave())return;closeGame()};
function stage(bgKey){const s=document.createElement('div');s.className='stage';s.style.backgroundImage=`url(${IMG[bgKey]})`;$('#gbody').appendChild(s);return s}
function renderHub(){
  const pkOpen=soloOpen('pk',19,5),bsOpen=soloOpen('bs',10,18);
  const cards=[
    ['br','🎲','หนีผีฮาโลวีน','แบตเทิลรอยัล 3–8 คน รอดคนสุดท้ายชนะ',S.br.open?`<span class="st on">เปิดอยู่ ค่าเข้า ${S.br.fee} เหรียญ</span>`:'<span class="st off">ปิด แอดมินเปิดเป็นรอบ</span>',IMG['br-bg']],
    ['kang','🃏','ไพ่แคง','2 ห้อง ห้องละ 4 คน เดิมพันกุศล',S.kang.map((r,i)=>`<span class="st ${r.open?'on':'off'}">ห้อง ${i+1} ${r.open?'เปิด':'ปิด'}</span>`).join(' '),IMG['kg-bg']],
    ['pk','🎃','จิ้มฟักทอง','เลือก 4 จาก 16 ลูก ลุ้นฟักทองนางฟ้า',pkOpen?(Date.now()<S.cd.pk?`<span class="st wait">พักอีก ${mmss(S.cd.pk-Date.now())}</span>`:'<span class="st on">เปิดอยู่ ถึงตี 5</span>'):`<span class="st off">เปิด 19:00–05:00 (อีก ${hm(minsUntil(19))})</span>`,IMG['pk-bg']],
    ['bs','🐦','ยิงนกฮาโลวีน','60 วินาที ยิงให้ได้มากที่สุด ระวังนกต้องสาป',bsOpen?(Date.now()<S.cd.bs?`<span class="st wait">พักอีก ${mmss(S.cd.bs-Date.now())}</span>`:'<span class="st on">เปิดอยู่ ถึง 18:00</span>'):`<span class="st off">เปิด 10:00–18:00 (อีก ${hm(minsUntil(10))})</span>`,IMG['bs-bg']]];
  let h=cards.map(c=>`<button class="gcard" data-g="${c[0]}"><span class="ic" style="background-image:url(${c[5]})"></span><span><b>${c[1]} ${c[2]}</b><small>${c[3]}</small>${c[4]}</span></button>`).join('');
  if(S.role==='admin'){
    const sel=(id,vals,cur,fn=v=>v)=>`<select id="${id}">${vals.map(v=>`<option value="${v}"${v==cur?' selected':''}>${fn(v)}</option>`).join('')}</select>`;
    h+=`<div class="box"><h3>👑 แผงควบคุมมินิเกม</h3>
    <div class="row"><b style="width:7.5rem">🎲 หนีผีฮาโลวีน</b><button class="btn sm ${S.br.open?'pink':''}" id="brT">${S.br.open?'ปิดห้อง':'เปิดห้อง'}</button>ค่าเข้า ${sel('brF',[1,2,3,5],S.br.fee)} เหรียญ</div>
    ${S.kang.map((r,i)=>`<div class="row"><b style="width:7.5rem">🃏 ไพ่แคง ห้อง ${i+1}</b><button class="btn sm ${r.open?'pink':''}" data-kt="${i}">${r.open?'ปิดห้อง':'เปิดห้อง'}</button>ค่าฐาน ${sel('kb'+i,[1000,5000,10000,50000],r.base,fmt)} เหรียญ/รอบ ${sel('kf'+i,[1,2,3],r.fee)}</div>`).join('')}
    ${[['pk','🎃 จิ้มฟักทอง'],['bs','🐦 ยิงนก']].map(([k,n])=>`<div class="row"><b>${n}</b>${['open','closed','auto'].map(m=>`<button class="btn sm ${S.solo?.[k]===m?'pink':''}" data-solo="${k}" data-mode="${m}">${{open:'เปิดฉุกเฉิน',closed:'ปิดฉุกเฉิน',auto:'ตามเวลา'}[m]}</button>`).join('')}</div>`).join('')}<div class="row"><button class="btn sm pink" data-emergency="br">ยุติหนีผีฉุกเฉิน / คืนค่าเข้า</button><button class="btn sm pink" data-emergency="kang" data-room="0">ยุติแคงห้อง 1 / คืนทุน</button><button class="btn sm pink" data-emergency="kang" data-room="1">ยุติแคงห้อง 2 / คืนทุน</button></div><p class="note">เปิดฉุกเฉินมีผลกับสมาชิกทุกคน ค่าเข้าและช่วงพักยังเป็นไปตามกติกา รอบที่จ่ายแล้วจบตามกติกาได้ หากยุติแคง/หนีผีระบบคืนทุนทางไปรษณีย์</p>
    </div>
    <div class="box"><h3>📜 ผลหนีผีฮาโลวีนย้อนหลัง</h3>${S.brHist.length?S.brHist.map(r=>`<div class="hist">รอบ ${r.no} · 👑 ${r.win}<br><span class="note">${r.order}</span></div>`).join(''):'<p class="note">ยังไม่มีรอบที่เล่นจบ</p>'}</div>
    <div class="box"><h3>📜 ผลไพ่แคงย้อนหลัง</h3>${S.kgHist.length?S.kgHist.map(r=>`<div class="hist">${r}</div>`).join(''):'<p class="note">ยังไม่มีรอบที่เล่นจบ</p>'}</div>`;
  } else h+=`<p class="note">ห้องหนีผีและไพ่แคงใช้ผู้เล่นจริง แอดมินเป็นผู้เปิดห้องและเริ่มเกม</p>`;
  $('#hub').innerHTML=h;
  document.querySelectorAll('.gcard').forEach(b=>b.onclick=()=>openGame(b.dataset.g));
  if(S.role==='admin'){
    document.querySelectorAll('[data-emergency]').forEach(b=>b.onclick=()=>modal('<h2>ยุติรอบฉุกเฉินและคืนทุน?</h2>',[{t:'ยกเลิก'},{t:'ยืนยัน',f:async()=>{const system=b.dataset.emergency,room=system==='kang'?{room:Number(b.dataset.room)}:{};const out=await cloud(system,{type:'void',...room});if(out){await cloud(system,{type:'configure',open:false,...room});renderHub();}}}]));
    document.querySelectorAll('[data-solo]').forEach(b=>b.onclick=()=>cloud('minigames',{type:'control',game:b.dataset.solo,mode:b.dataset.mode}).then(renderHub));
    $('#brT').onclick=()=>cloud('br',{type:'configure',open:!S.br.open}).then(renderHub);$('#brF').onchange=e=>cloud('br',{type:'configure',fee:+e.target.value}).then(renderHub);
    document.querySelectorAll('[data-kt]').forEach(b=>b.onclick=()=>cloud('kang',{type:'configure',room:+b.dataset.kt,open:!S.kang[b.dataset.kt].open}).then(renderHub));
    S.kang.forEach((r,i)=>{$('#kb'+i).onchange=e=>cloud('kang',{type:'configure',room:i,base:+e.target.value}).then(renderHub);$('#kf'+i).onchange=e=>cloud('kang',{type:'configure',room:i,fee:+e.target.value}).then(renderHub);});

  }
  renderWallet();
}
setInterval(()=>{if(!CUR&&S.role==='player'&&!$('#modal').classList.contains('on'))renderHub()},15000);
renderHub();

GAMES.pk=(()=>{
  const XS=[26.6,42.2,58.0,73.8],YS=[36.3,44.7,53.0,61.6];
  let st,el,round=null,cdIv;
  const PAY={4:{k:100000,t:'โบนัส +100,000 กุศล'},3:{k:20000,t:'ได้รับ +20,000 กุศล'},2:{k:0,t:'รางวัลปลอบใจ กล่องสุ่มนกกระจอกเทศ 10 กล่อง + กล่องสุ่มนกโดโด้ 10 กล่อง',box:1},1:{k:-5000,t:'ถูกหัก 5,000 กุศล'},0:{k:-15000,t:'ถูกหัก 15,000 กุศล'}};
  async function open(){st=stage('pk-bg');el={};await cloud('minigames',{type:'status'});if(soloState.pk?.phase==='active'){round={...soloState.pk,sel:[],phase:'pick'};st.innerHTML=cells()+`<div class="pkhud" id="pkhud"></div><div class="panel" id="pkp"></div>`;st.querySelectorAll('.pkc').forEach(c=>c.innerHTML=`<img class="pkn" src="${IMG['pk-normal']}">`);pickMode();}else lobby();cdIv=setInterval(()=>{if(!round)lobby()},1000)}
  function close(){clearInterval(cdIv);round=null}
  function cells(){let h='';for(let i=0;i<16;i++){const x=XS[i%4],y=YS[Math.floor(i/4)];h+=`<div class="pkc" data-i="${i}" style="left:${x}%;top:${y}%"></div>`}return h}
  function showRules(){
    const ang=n=>[...Array(4)].map((_,i)=>`<img src="${IMG[i<n?'pk-angel':'pk-devil']}" alt="">`).join('');
    const L=[[4,'+100,000','good'],[3,'+20,000','good'],[2,'📦 กล่องนก 10+10',''],[1,'−5,000','bad'],[0,'−15,000','bad']];
    rules('จิ้มฟักทอง',[['🎃','เลือก 4 ลูก','จาก 16 ลูกบนชั้น'],['🔮','ผลสุ่มไว้ก่อน','ไม่เปลี่ยนจนจบรอบ'],['⏳','พัก 30 นาที','หลังจบแต่ละรอบ'],['🌙','เปิด 19:00–05:00','ใช้ 2 เหรียญ · มีกุศล 25,000+']],
      `<div class="rtitle">รางวัลจาก 4 ลูกที่เลือก</div>${L.map(([n,t,c])=>`<div class="lad ${c}"><span class="ic">${ang(n)}</span><b>${t}</b></div>`).join('')}`);
  }
  function lobby(){
    const open=soloOpen('pk',19,5),cd=Date.now()<S.cd.pk,okC=S.coins>=2,okK=S.kusal>=25000;
    let body;
    if(!open) body=`<div class="phead"><h2>🎃 จิ้มฟักทอง</h2><button class="rbtn" id="rb">📜 กติกา</button></div><div style="text-align:center;margin-top:2cqw">🌙 เปิดตอนกลางคืน 19:00–05:00<div class="big">อีก ${hm(minsUntil(19))}</div></div>`;
    else body=`<div class="phead"><h2>🎃 จิ้มฟักทอง</h2><button class="rbtn" id="rb">📜 กติกา</button></div>${pills([[`🪙 2 เหรียญ`,okC],['✨ กุศล 25,000+',okK],['👼 ลุ้นสูงสุด +100,000']])}
      <div style="text-align:center">${cd?`<div>พักก่อนนะ เล่นได้อีกใน</div><div class="big">${mmss(S.cd.pk-Date.now())}</div>`:`<button class="btn orange" id="go" ${okC&&okK?'':'disabled'}>เริ่มเล่น</button>`}</div>`;
    st.innerHTML=cells()+`<div class="panel slim" style="bottom:4cqw">${body}</div>`;
    st.querySelector('#rb').onclick=showRules;
    const g=st.querySelector('#go');if(g)g.onclick=start;const s=st.querySelector('#skip');if(s)s.onclick=()=>{S.cd.pk=0;lobby()};
  }
  async function start(){const out=await cloud('minigames',{type:'pk-start'});if(!out)return;round={...out.state.pk,sel:[],phase:'pop'};
    st.innerHTML=cells()+`<div class="pkhud" id="pkhud">ฟักทองกำลังมาวางบนชั้น…</div><div class="panel" style="bottom:4cqw;text-align:center" id="pkp"></div>`;
    st.querySelector('#pkp').style.display='none';
    const cs=st.querySelectorAll('.pkc');
    cs.forEach((c,i)=>setTimeout(()=>{c.innerHTML=`<img class="pkn" src="${IMG['pk-normal']}" alt="">`;c.classList.add('pop')},120+i*70));
    setTimeout(()=>{round.phase='ready';const p=st.querySelector('#pkp');p.style.display='';p.innerHTML='<button class="btn orange" id="ready">พร้อมเลือกฟักทอง</button>';p.querySelector('#ready').onclick=pickMode;st.querySelector('#pkhud').textContent='ผลของทุกช่องสุ่มไว้แล้ว ไม่เปลี่ยนจนจบรอบ'},120+16*70+300);
  }
  function pickMode(){
    round.phase='pick';st.querySelector('#pkp').style.display='none';hud();
    st.querySelectorAll('.pkc').forEach(c=>c.onclick=()=>{
      if(round.phase!=='pick')return;const i=+c.dataset.i,j=round.sel.indexOf(i);
      if(j>=0){round.sel.splice(j,1);c.classList.remove('sel')}else if(round.sel.length<4){round.sel.push(i);c.classList.add('sel')}
      st.querySelectorAll('.pkc').forEach(x=>{const n=round.sel.indexOf(+x.dataset.i);x.dataset.n=n>=0?n+1:''});
      hud();if(round.sel.length===4){round.phase='lock';setTimeout(reveal,700)}
    });
  }
  function hud(){st.querySelector('#pkhud').innerHTML=round.phase==='lock'?'🔒 ล็อกแล้ว! กำลังเฉลย…':`แตะเลือกฟักทอง <b>${round.sel.length}/4</b> ลูก (แตะซ้ำเพื่อยกเลิก)`}
  async function reveal(){const out=await cloud('minigames',{type:'pk-finish',round:round.id,picks:round.sel});if(!out){modal('<h2>ยังบันทึกผลไม่สำเร็จ</h2>',[{t:'ลองอีกครั้ง',f:reveal}]);return;}round.kind=out.state.pk.kind;round.phase='lock';
    hud();
    st.querySelectorAll('.pkc').forEach(c=>{const i=+c.dataset.i,k=round.kind[i];c.innerHTML=sprite('pkt-'+k,15,'pks');const sp=c.querySelector('.spr');playSprite(sp,11,false);if(!round.sel.includes(i))setTimeout(()=>c.classList.add('dim'),1600)});
    setTimeout(result,2100);
  }
  function result(){
    const a=round.sel.filter(i=>round.kind[i]==='angel').length,d=4-a,p=PAY[a];
    let line;
    if(p.k>0)line=`<p class="plus">${p.t}</p><p class="note">ส่งเข้าไปรษณีย์แล้ว ไปกดรับได้เลย</p>`;else if(p.box)line=`<p class="plus">${p.t}</p><p class="note">ส่งกล่องนกเข้าไปรษณีย์แล้ว</p>`;else line=`<p class="minus">${p.t}</p><p class="note">หักจากกระเป๋าบนคลาวด์แล้ว</p>`;
    st.querySelector('#pkhud').textContent='เฉลยแล้ว! กรอบเหลือง = ลูกที่คุณเลือก';
    const nA=round.kind.filter(k=>k==='angel').length;
    modal(`<h2>${a>=3?'🎉':a===2?'🙂':'😱'} เฉลยแล้ว!</h2><p>คุณได้ฟักทองนางฟ้า <b>${a}</b> ลูก และฟักทองผี <b>${d}</b> ลูก</p>${line}<p class="note">รอบนี้บนชั้นมีฟักทองนางฟ้า ${nA} ลูก จาก 16 ลูก · เล่นรอบต่อไปได้ในอีก 30 นาที</p>`,[{t:'ดูชั้นวาง',c:'gray'},{t:'กลับหน้าเกม',f:()=>{round=null;lobby()}}]);
    round.phase='done';
    const p2=st.querySelector('#pkp');p2.style.display='';p2.innerHTML='<button class="btn" id="again">กลับหน้าเกม</button>';p2.querySelector('#again').onclick=()=>{round=null;lobby()};
  }
  return {title:'🎃 จิ้มฟักทอง',open,close,refresh(){if(!round)lobby()},canLeave(){if(round&&round.phase==='lock'){toast('รอเฉลยก่อนนะ');return false}if(round&&(round.phase==='pick'||round.phase==='ready'||round.phase==='pop')){toast('เลือกฟักทองให้ครบ 4 ลูกก่อนนะ จ่ายเหรียญไปแล้ว');return false}return true}};
})();

GAMES.bs=(()=>{
 const TYPES=[['ghost','👻','นกผี'],['pumpkin','🎃','นกฟักทอง'],['witch','🧙','นกแม่มด'],['skeleton','💀','นกโครงกระดูก']];const sheets=TYPES.map(([key])=>{const image=new Image();image.src=IMG['b-'+key];return image;});let st,canvas,ctx,W,H,round=null,raf,timer,ending=false,pendingShot=false,queuedShots=[],syncTimer=null;
 const values=()=>round?.values||soloState.offer||{};
 function valTable(){return '<div class="bvgrid">'+TYPES.map(([k,e,n],i)=>{const v=values()[i];return v?`<div class="bvt ${v.role}"><img src="${IMG['bi-'+k]}"><div>${n}</div><b>${v.val>0?'+':''}${fmt(v.val)}</b></div>`:'';}).join('')+'</div>';}
 function showRules(){rules('ยิงนกฮาโลวีน',[['🎯','แตะนกเพื่อยิง','ยิงได้ใน 60 วินาที'],['🎲','ค่านกสุ่มใหม่','ดูค่าก่อนกดเริ่ม'],['☠️','นกต้องสาป','โดนแล้วหักกุศล'],['🔫','กระสุน 6 นัด','บรรจุ 1.5 วินาที'],['🔥','ไม่เกิน 4 นัด/วิ','กดรัวเกินไปปืนร้อน'],['🧾','ยอดเสี่ยง 10,000','ต้องมีกุศลอย่างน้อย 10,000'],['☀️','เปิด 10:00–18:00','3 เหรียญ · พัก 15 นาที']]);}
 async function open(){st=stage('bs-bg');await cloud('minigames',{type:'status'});if(soloState.bs?.phase==='active'){round=soloState.bs;mount();}else lobby();timer=setInterval(()=>{if(!round)lobby();},1000);}
 function close(){clearInterval(timer);clearInterval(syncTimer);cancelAnimationFrame(raf);st?.removeEventListener('pointerdown',shoot);round=null;}
 function lobby(){const enabled=soloOpen('bs',10,18),cooldown=S.cd.bs>time();st.innerHTML=`<img class="bsgun" src="${IMG.gun}"><div class="panel slim" style="top:6cqw"><h2>🐦 ค่านกรอบนี้</h2>${valTable()}<div class="note">3 เหรียญ · 60 วินาที · กุศล 10,000 ขึ้นไป</div><button class="btn gray" id="birdRules">📜 กติกา</button>${!enabled?'<p>เปิด 10:00–18:00 เวลาไทย</p>':cooldown?'<p>พักอีก '+mmss(S.cd.bs-time())+'</p>':'<button class="btn orange" id="birdStart" '+(S.coins<3||S.kusal<10000?'disabled':'')+'>เริ่มยิง</button>'}</div>`;st.querySelector('#birdRules').onclick=showRules;if(st.querySelector('#birdStart'))st.querySelector('#birdStart').onclick=start;}
 async function start(){const out=await cloud('minigames',{type:'bs-start'});if(out){round=out.state.bs;mount();}}
 function mount(){ending=false;queuedShots=[];clearInterval(syncTimer);syncTimer=setInterval(()=>flushShots(),1500);st.innerHTML=`<canvas id="bscv"></canvas><img class="bsgun" id="gun" src="${IMG.gun}"><div class="bstime" id="bt">60</div><div class="bsscore" id="bsc"></div><div class="bsammo" id="ammo"></div><div class="bsmsg" id="bmsg"></div><div class="bslegend">${TYPES.map(([k],i)=>`<span class="${round.values[i].role}"><img src="${IMG['bi-'+k]}">${round.values[i].val}</span>`).join('')}</div>`;canvas=st.querySelector('#bscv');const r=st.getBoundingClientRect();W=r.width;H=r.height;const dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=W*dpr;canvas.height=H*dpr;ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);st.addEventListener('pointerdown',shoot);updateScore();loop();}
 function updateScore(){if(!round||!st.querySelector('#bsc'))return;st.querySelector('#bsc').innerHTML='🎯 '+round.count+' ตัว<br><small>✨ '+(round.sum>=0?'+':'')+fmt(round.sum)+'</small>';const elapsed=time()-round.start;st.querySelector('#ammo').textContent=round.reload>elapsed?'บรรจุ…':'🔫 '+(round.reload&&round.reload<=elapsed?6:round.ammo)+'/6';}
 function loop(){if(!round)return;const elapsed=time()-round.start;ctx.clearRect(0,0,W,H);for(const b of round.flights){if(round.killed.includes(b.id))continue;const p=birdPosition(b,elapsed);if(!p)continue;const im=sheets[b.type],dim=DIM['b-'+TYPES[b.type][0]],h=H*.075,w=h*.95,frame=Math.floor(elapsed/85)%16;ctx.save();ctx.globalAlpha=p.vis;ctx.translate(p.x*W,p.y*H);ctx.scale(p.dir,1);if(im.complete&&im.naturalWidth)ctx.drawImage(im,(frame%4)*dim[0],Math.floor(frame/4)*dim[1],dim[0],dim[1],-w/2,-h/2,w,h);ctx.restore();}st.querySelector('#bt').textContent=Math.max(0,Math.ceil((round.until-time())/1000));updateScore();if(time()>=round.until){if(!pendingShot&&!ending)end();else raf=requestAnimationFrame(loop);return;}raf=requestAnimationFrame(loop);}
 async function flushShots(){if(!round||pendingShot||!queuedShots.length)return !queuedShots.length;pendingShot=true;const batch=queuedShots.slice(0,40),id=round.id;const out=await cloud('minigames',{type:'bs-shots',round:id,shots:batch});if(out&&round?.id===id){queuedShots.splice(0,batch.length);round=structuredClone(out.state.bs);for(const shot of queuedShots){try{fireBird(round,shot);}catch{}}updateScore();}pendingShot=false;return !!out;}
 function shoot(ev){if(!round||ending||time()>=round.until)return;ev.preventDefault();const r=st.getBoundingClientRect(),x=(ev.clientX-r.left)/W,y=(ev.clientY-r.top)/H,t=Math.round(time()-round.start);if(x<0||x>1||y<0||y>1)return;const shot={x,y,t};try{const next=structuredClone(round),hit=fireBird(next,shot);round=next;queuedShots.push(shot);st.querySelector('#bmsg').textContent=hit?(round.values[hit.type].val<0?'☠️ โดนนกต้องสาป!':'🎯 ยิงโดน!'):'';const gun=st.querySelector('#gun');gun?.animate?.([{transform:'translateY(0)'},{transform:'translateY(8px)'},{transform:'translateY(0)'}],{duration:140});updateScore();if(queuedShots.length>=8)flushShots();}catch(e){st.querySelector('#bmsg').textContent=e.message;}}
 async function end(){ending=true;if(queuedShots.length&&!await flushShots()){ending=false;setTimeout(()=>{if(round)end();},1500);return;}clearInterval(syncTimer);const out=await cloud('minigames',{type:'bs-finish',round:round.id});if(!out){ending=false;setTimeout(()=>{if(round)end();},2000);return;}round=out.state.bs;st.removeEventListener('pointerdown',shoot);const lines=TYPES.map(([k,e,n],i)=>`<div><span>${e} ${n} ×${round.hits[i]}</span><b>${fmt(round.values[i].val*round.hits[i])}</b></div>`).join('');modal(`<h2>⏰ หมดเวลา!</h2><p>ยิงได้ ${round.count} ตัว</p><div class="reslist">${lines}<div><b>รวม</b><b>${fmt(round.gain)} กุศล</b></div></div><p>${round.gain>0?'รางวัลสะสมในไปรษณีย์แล้ว':'บันทึกยอดบนคลาวด์แล้ว'}</p>`,[{t:'กลับหน้าเกม',f:()=>{round=null;lobby();}}]);}
 return{title:'🐦 ยิงนกฮาโลวีน',open,close,refresh(){if(!round)lobby();},canLeave(){if(round&&round.phase==='active'){modal('<h2>ออกจากลานยิง?</h2><p>ผลที่ยิงสำเร็จบันทึกบนคลาวด์แล้ว เวลาในรอบยังเดินต่อ กลับมารับผลรอบเดิมได้</p>',[{t:'เล่นต่อ'},{t:'ออก',c:'gray',f:closeGame}]);return false;}return true;}};
})();

GAMES.kang=(()=>{
  const SU=['spade','heart','diamond','club'],SY={spade:'♠',heart:'♥',diamond:'♦',club:'♣'},RL=['','A','2','3','4','5','6','7','8','9','10','J','Q','K'],RK=['','a','2','3','4','5','6','7','8','9','10','j','q','k'];
  const SEAT=[{ax:13,ay:79},{ax:9,ay:43,bx:20,by:47.3,v:1},{ax:50,ay:21.5,bx:50,by:34,v:0},{ax:91,ay:43,bx:80,by:47.3,v:1}];
  let room=null,G=null,tick,botT,st;
  const pts=c=>Math.min(10,c.r),lbl=c=>RL[c.r]+SY[c.s],img=c=>IMG[`k-${c.s}-${RK[c.r]}`];
  const total=h=>h.reduce((a,c)=>a+pts(c),0);
  let publicRoom=null,privateHand=null,stopRoom=null,stopHand=null,resultShown='',advancePending=false,lastFlow='';
  function stop(){stopRoom?.();stopHand?.();stopRoom=stopHand=null;clearInterval(tick);}
  async function open(){room=null;G=null;await cloud('minigames',{type:'status'});lobby();}
  function close(){stop();G=null;room=null;}
  function cfg(r){return{base:r.base,flow:[0,r.base/2,r.base,r.base*2,r.base*3],knock:2,tri:2,four:3,first:2,forfeit:1};}
  function lobby(){stop();room=null;G=null;$('#gbody').innerHTML=`<div class="page"><h2>🃏 ไพ่แคง เลือกห้อง</h2>${S.kang.map((r,i)=>`<div class="box"><h3>ห้อง ${i+1} ${r.open?'เปิดอยู่':'ยังไม่เปิด'}</h3><div class="row"><span class="chip">✨ ฐาน ${fmt(r.base)}</span><span class="chip">🪙 ${r.fee}/รอบ</span></div><button class="btn" data-room="${i}">${r.open?'เข้าห้อง':'ตรวจสอบอีกครั้ง'}</button><button class="btn gray" data-rule="${i}">กติกากุศล</button></div>`).join('')}</div>`;document.querySelectorAll('[data-room]').forEach(b=>b.onclick=async()=>{const i=+b.dataset.room;await cloud('minigames',{type:'status'});if(!S.kang[i].open){lobby();return;}waiting(i);});document.querySelectorAll('[data-rule]').forEach(b=>b.onclick=()=>ruleModal(S.kang[b.dataset.rule]));}
  async function action(input){if(!room)return null;const out=await cloud('kang',{...input,room:room.i,...(G?{round:G.round,turn:G.turnNo}:{})});if(out){publicRoom=out.room;privateHand={hand:out.mine,round:out.room.round,turn:out.room.turnNo??0};project();if(out.late)toast('หมดเวลาแล้ว ระบบเล่นตานั้นแทน กรุณาดูตาล่าสุด');}return out;}
  function project(){if(!room||!publicRoom)return;room.r={base:publicRoom.base,fee:publicRoom.fee};room.seats=publicRoom.seats;const own=room.seats.findIndex(s=>s?.uid===Host.uid);room.sat=own>=0;
   if(publicRoom.state==='playing'||publicRoom.state==='result'){
    const offset=own<0?0:own,indices=Array.from({length:4},(_,i)=>(offset+i)%4),map=i=>(i-offset+4)%4,sync=own>=0&&privateHand?.round===publicRoom.round&&privateHand?.turn===publicRoom.turnNo;
    const hands=indices.map((p,i)=>publicRoom.state==='result'?publicRoom.hands[p]:i===0&&sync?privateHand.hand:Array(publicRoom.counts[p]).fill({s:'back',r:0}));
    const selected=G?.sel?.map(c=>c.id)||[];G={names:indices.map(p=>esc(publicRoom.seats[p]?.name||'ว่าง')),hands,cur:map(publicRoom.cur),deck:Array(publicRoom.deckCount).fill(null),round:publicRoom.round,turnNo:publicRoom.turnNo,mySync:sync,drawn:publicRoom.drawn,over:publicRoom.state==='result',status:indices.map(p=>publicRoom.status[p]),auto:indices.map(p=>publicRoom.auto[p]),net:indices.map(p=>publicRoom.net[p]),hold:publicRoom.base*8,c:cfg(room.r),deadline:publicRoom.deadline,last:publicRoom.last?{...publicRoom.last,by:map(publicRoom.last.by)}:null,feed:(publicRoom.feed||[]).map(esc),sel:hands[0].filter(c=>selected.includes(c.id))};
    if(!st||!$('#gbody').contains(st)){$('#gbody').innerHTML='';st=stage('kg-bg');}render(G.over);const flow=(publicRoom.tx||[]).filter(t=>t.reason?.startsWith('FLOW')).at(-1);if(flow){const key=publicRoom.round+'-'+flow.at+'-'+flow.from+'-'+flow.to;if(lastFlow&&lastFlow!==key){const from=map(publicRoom.seats.findIndex(p=>p?.uid===flow.from)),to=map(publicRoom.seats.findIndex(p=>p?.uid===flow.to)),fx=st.querySelector('#kfx');if(fx){fx.innerHTML='<div class="kflash"></div><div class="kflowt">⚡ ไหล!</div>'+[[from,-flow.amount],[to,flow.amount]].map(([p,q])=>'<div class="kamt" style="left:'+SEAT[p].ax+'%;top:'+SEAT[p].ay+'%;color:'+(q<0?'#d54857':'#238e61')+'">'+(q>0?'+':'')+fmt(q)+'</div>').join('');setTimeout(()=>fx.innerHTML='',1900);}}lastFlow=key;}else lastFlow='none';
    if(G.over&&resultShown!==room.i+'-'+G.round){resultShown=room.i+'-'+G.round;S.kgHist=publicRoom.hist.map(h=>esc(h.winner||'ไม่มีผู้ชนะ')+' • '+h.why);modal('<h2>สรุปผลรอบ '+G.round+'</h2><p>'+esc(publicRoom.reason)+'</p><p>ทุนคืนและผลได้เสียอยู่ในไปรษณีย์ของแต่ละคน กดรับแล้วเข้ากระเป๋า</p>',[{t:'📮 รับที่ไปรษณีย์',f:openMail},{t:'กลับห้อง',f:()=>drawWaiting()}]);}
   }else{G=null;drawWaiting();}
  }
  function drawWaiting(){if(!room||!publicRoom)return;const index=publicRoom.seats.findIndex(s=>s?.uid===Host.uid),ready=index>=0&&publicRoom.ready[index];$('#gbody').innerHTML=`<div class="page"><h2>🃏 ห้อง ${room.i+1} ผู้เล่นจริง ${publicRoom.seats.filter(Boolean).length}/4</h2><div class="box">${publicRoom.seats.map((s,i)=>`<div class="row"><b>${s?esc(s.name):'รอผู้เล่น…'}</b><span>${publicRoom.ready[i]?'✅ พร้อมแล้ว':''}</span></div>`).join('')}<div class="pills"><span class="pill">🪙 ${publicRoom.fee}</span><span class="pill">🔒 ${fmt(publicRoom.base*8)}</span></div><div class="row">${index<0?'<button class="btn" id="sit">นั่ง</button>':!ready?'<button class="btn" id="ready">พร้อม</button>':'<span>รอแอดมินเริ่ม</span>'}<button class="btn gray" id="leave">ออกจากห้อง</button><button class="btn gray" id="rule">กติกา</button></div>${S.role==='admin'?'<button class="btn pink" id="startg">👑 เริ่มเกม</button>':''}</div></div>`;
   if($('#sit'))$('#sit').onclick=async()=>{if(await action({type:'join'}))subscribe();};if($('#ready'))$('#ready').onclick=()=>action({type:'ready'});$('#leave').onclick=async()=>{if(index>=0&&!await action({type:'leave'}))return;lobby();};$('#rule').onclick=()=>ruleModal(room.r);if($('#startg'))$('#startg').onclick=()=>action({type:'start'});
  }
  function subscribe(){stop();if(!room)return;const key='kang-'+room.i;stopRoom=Host.watchWorld(key,data=>{if(data){publicRoom=data;project();}});stopHand=Host.watchGameView(key,data=>{privateHand=data;project();});tick=setInterval(async()=>{if(!G||G.over)return;const left=G.deadline-time(),label=st?.querySelector('.kav.turn .ktm');if(label)label.textContent=Math.max(0,Math.ceil(left/1000));if(left<=0&&!acting&&!advancePending){advancePending=true;await action({type:'advance'});advancePending=false;}},250);}
  async function waiting(i){stop();st=null;G=null;room={i,r:S.kang[i],seats:[]};privateHand=null;const out=await action({type:'status'});if(out&&(room.sat||S.role==='admin'))subscribe();}
  function ruleModal(r){const c=cfg(r);const pay=(a,b,cl='')=>`<div class="lad ${cl}"><span class="ic" style="font-size:.8rem;font-weight:700">${a}</span><b>${fmt(b)}</b></div>`;
    rules('ไพ่แคง',[['🃏','แต้มน้อยสุดชนะ','คนละ 5 ใบ · A=1 · J Q K=10'],['🔄','จั่วแล้วทิ้ง','แต้มเดียวกันทิ้งพร้อมกันได้'],['⚡','ไหล','คนก่อนหน้าทิ้งแต้มที่เรามี ลงได้เลยไม่ต้องจั่ว'],['📢','แคง','กดตอนต้นตา เปิดไพ่วัดแต้ม'],['💥','น็อค','ไพ่หมดมือ ชนะ ×2'],['🎴','ตอง / สี่ใบเปิด','แจกมาได้ ชนะทันที'],['⏱️','ตาละ 20 วิ','หมดเวลาระบบเล่นแทน'],['🔒','กันกุศลก่อนเริ่ม','ต้องมี 8 เท่าของค่าฐาน']],
    `<div class="rtitle">กุศลห้อง ${S.kang.indexOf(r)+1} (ต่อคน)</div>${pay('🏆 ชนะ / แคงเข้า',c.base,'good')}${pay('📢 แคงรอบแรกเข้า ×2',c.base*c.first,'good')}${pay('💥 น็อค ×2',c.base*c.knock,'good')}${pay('🎴 ตองเปิด ×2',c.base*c.tri,'good')}${pay('🎴 สี่ใบเปิด ×3',c.base*c.four,'good')}${pay('😵 แคงล่ม จ่ายทุกคน',c.base,'bad')}${pay('🏳️ ยอมแพ้ จ่ายทุกคน',c.base,'bad')}<div class="rtitle">⚡ ไหล (คนทิ้งจ่ายคนไหล)</div>${pay('1 ใบ',c.flow[1])}${pay('คู่',c.flow[2])}${pay('ตอง',c.flow[3])}`)}
  function canFlow(p){return G.mySync&&!G.drawn&&G.last&&G.last.by!==p&&G.cur===p&&G.hands[p].some(c=>c.r===G.last.cards[0].r);}
  function doDraw(){action({type:'draw'});}
  function doKang(){action({type:'kang'});}
  function playCards(p,cards,flow){action({type:flow?'flow':'discard',cards:cards.map(c=>c.id)});}
  function forfeit(){modal('<h2>ยอมแพ้?</h2><p>จ่ายกุศลตามกติกาและออกจากรอบนี้</p>',[{t:'เล่นต่อ',c:'gray'},{t:'ยืนยันยอมแพ้',c:'pink',f:()=>action({type:'forfeit'})}]);}
  function render(reveal){
    if(!st||!G)return;const my=G.hands[0],myTurn=G.mySync&&G.cur===0&&!G.over&&G.status[0]!=='FORFEITED';
    let h='';
    [1,2,3].forEach(p=>{const s=SEAT[p],n=G.hands[p].length;
      h+=`<div class="kav ${G.cur===p&&!G.over?'turn':''}" style="left:${s.ax}%;top:${s.ay}%"><div class="kface">${G.names[p][0]}</div><b>${G.names[p]}</b><span class="kcnt">🃏${n}</span>${G.auto[p]?'<span class="kchip">⚡AUTO</span>':''}${G.status[p]==='FORFEITED'?'<span class="kchip">ยอมแพ้</span>':''}${G.cur===p&&!G.over?'<span class="ktm">20</span>':''}</div>`;
      h+=`<div class="kbacks ${s.v?'v':''}" style="left:${s.bx}%;top:${s.by}%">${(reveal?G.hands[p].map(c=>`<img src="${img(c)}" alt="${lbl(c)}">`):[...Array(n)].map(()=>`<img src="${IMG['k-back']}" alt="">`)).join('')}</div>`});
    const dn=G.deck.length;h+=`<div class="kpile" style="left:37%;top:47.3%">${dn?[...Array(Math.min(4,Math.ceil(dn/8)))].map((_,i)=>`<img src="${IMG['k-back']}" style="transform:translate(${-i*.35}cqw,${-i*.35}cqw)" alt="">`).join(''):''}<span class="kbadge">${dn}</span></div>`;
    if(G.last)h+=`<div class="kdisc" style="left:59%;top:47.3%">${G.last.cards.map((c,i)=>`<img src="${img(c)}" style="transform:translateX(${(i-(G.last.cards.length-1)/2)*6}cqw) rotate(${(i-(G.last.cards.length-1)/2)*7}deg)" alt="${lbl(c)}">`).join('')}<span class="kwho">${G.names[G.last.by]} ทิ้ง</span></div>`;
    h+=`<div class="kfeed">${G.feed.map((f,i)=>`<div style="opacity:${1-i*.3}">${f}</div>`).join('')}</div>`;
    h+=`<div class="kav me ${myTurn?'turn':''}" style="left:${SEAT[0].ax}%;top:${SEAT[0].ay}%"><div class="kface">คุณ</div><span class="kcnt">${total(my)} แต้ม</span>${myTurn?'<span class="ktm">20</span>':''}${G.status[0]==='FORFEITED'?'<span class="kchip">ยอมแพ้</span>':''}</div>`;
    h+=`<div class="khand">${my.map((c,i)=>`<img class="${G.sel.includes(c)?'up':''}" data-i="${i}" src="${img(c)}" alt="${lbl(c)}">`).join('')}</div>`;
    const selSame=G.sel.length&&G.sel.every(c=>c.r===G.sel[0].r);const fl=myTurn&&canFlow(0);
    h+=`<div class="kbtns">${myTurn&&!G.drawn?`<button class="btn pink" id="kkang">แคง</button><button class="btn" id="kdraw">จั่ว</button>`:''}${fl?`<button class="btn grape" id="kflow">ไหล</button>`:''}${myTurn&&G.drawn?`<button class="btn orange" id="kdisc" ${selSame?'':'disabled'}>ทิ้ง${G.sel.length>1?' '+G.sel.length+' ใบ':''}</button>`:''}${G.sel.length?'<button class="btn gray" id="kcan">ยกเลิกการเลือก</button>':''}${!myTurn&&!G.over?`<span class="kwait">${G.status[0]==='FORFEITED'?'คุณยอมแพ้แล้ว รอจบรอบ':'รอ '+G.names[G.cur]+' เล่น…'}</span>`:''}</div>`;
    h+=`<div class="ktop"><button class="btn sm gray" id="khelp">📜</button>${!G.over&&G.status[0]!=='FORFEITED'?'<button class="btn sm pink" id="kff">ยอมแพ้</button>':''}<span class="kroom">ห้อง ${room.i+1} · รอบ ${G.round} · ฐาน ${fmt(G.c.base)}<br>🔒 กันไว้ ${fmt(G.hold)} · ${G.net[0]>=0?'+':''}${fmt(G.net[0])}</span></div>`;
    if(S.role==='admin')h+=`<div class="kadmin">👑 ${G.over?'สรุปผลแล้ว':'กำลังเล่น'} · ตาของ ${G.names[G.cur]} · กองจั่ว ${dn} · แอดมินไม่เห็นไพ่คนอื่น <button class="btn sm pink" id="kstop">ยุติรอบฉุกเฉิน</button></div>`;
    let main=st.querySelector('#kmain');if(!main){st.innerHTML='<div id="kmain"></div><div id="kfx"></div>';main=st.querySelector('#kmain')}
    main.innerHTML=h;
    st.querySelectorAll('.khand img').forEach(im=>im.onclick=()=>{const c=my[+im.dataset.i];const j=G.sel.indexOf(c);if(j>=0)G.sel.splice(j,1);else{if(G.sel.length&&G.sel[0].r!==c.r)G.sel=[];G.sel.push(c)}render()});
    const on=(id,f)=>{const e=st.querySelector('#'+id);if(e)e.onclick=f};
    on('kkang',()=>modal('<h2>ต้องการแคงหรือไม่?</h2><p>แต้มในมือคุณตอนนี้ <b>'+total(my)+'</b> แต้ม ถ้ามีคนแต้มน้อยกว่า คุณต้องจ่ายทุกคน</p>',[{t:'ยกเลิก',c:'gray'},{t:'ยืนยันแคง',c:'pink',f:()=>{if(G.cur===0&&!G.drawn)doKang(0)}}]));
    on('kdraw',()=>{G.auto[0]=0;doDraw(0)});
    on('kflow',()=>{G.auto[0]=0;const r=G.last.cards[0].r;let cs=G.sel.filter(c=>c.r===r);if(!cs.length)cs=my.filter(c=>c.r===r);playCards(0,cs,true)});
    on('kdisc',()=>{G.auto[0]=0;playCards(0,G.sel.slice(),false)});
    on('kcan',()=>{G.sel=[];render()});on('kff',forfeit);
    on('khelp',()=>ruleModal(room.r));
    on('kstop',()=>modal('<h2>ยุติรอบฉุกเฉิน?</h2><p>รอบเป็นโมฆะ คืนทุนและค่าเหรียญให้ผู้เล่นทุกคนที่ไปรษณีย์</p>',[{t:'ยกเลิก',c:'gray'},{t:'ยืนยัน',c:'pink',f:()=>action({type:'void'})}]));
  }
  return {title:'🃏 ไพ่แคง',open,close,refresh(){if(G&&st)render(G.over);else if(!room)lobby()},canLeave(){if(G&&!G.over){modal('<h2>ออกจากหน้านี้?</h2><p>หากออกจากหน้านี้ ระบบอัตโนมัติจะเล่นแทนเมื่อถึงเทิร์นของคุณ</p>',[{t:'อยู่ต่อ',c:'gray'},{t:'ออกจากหน้า',c:'pink',f:()=>{G.leftAuto=true;closeGame()}}]);return false}return true}};
})();

GAMES.br=(()=>{
  const N=9,GX=12,GW=76,CELL=GW/N,GY=27.6; // % of stage width / height basis
  const COL=['#F2B544','#F27E9B','#6CC9A8','#8FB3F2','#C59BF2','#F29B6C','#9BD3E0','#E0C59B'];
  const ITEMS={bomb:['br-pumpkin-bomb','ฟักทองระเบิด','ปาโดนช่องเป้าและ 8 ช่องรอบๆ'],cloak:['br-ghost-cloak','ผ้าคลุม','กันดาเมจครั้งถัดไป 1 ครั้ง'],shoes:['br-wing-shoes','รองเท้าปีก','เดินได้ 3 ช่องในตาเดียว'],candy:['br-candy','ลูกอม','+❤️1 (สูงสุด 3)'],smoke:['br-smoke','ควันล่องหน','ตานี้ไม่มีอะไรโดนเรา']};
  let st,R=null,lob=null,tick;
  const cx=x=>GX+CELL*(x+.5), cy=y=>GY*100/56.28+ (CELL*(y+.5)); // in cqw units for top: stage height = 177.7cqw
  const topCqw=y=>GY/100*177.69+CELL*(y+.5);
  const dist=(a,b,c,d)=>Math.max(Math.abs(a-c),Math.abs(b-d));
  const inFog=(x,y,l)=>Math.min(x,y,N-1-x,N-1-y)<l;
  let watching=false,stopRoom=null,stopHand=null,publicRoom=null,privateAction=null,resultShown='',advancing=false;
  function stop(){watching=false;stopRoom?.();stopHand?.();stopRoom=stopHand=null;clearInterval(tick);}
  async function action(input){const out=await cloud('br',{...input,...(R?{round:R.round,turn:R.turn}:{})});if(out){publicRoom=out.room;privateAction={round:out.room.round,turn:out.room.turn,action:out.mine};project();if(out.late)toast('หมดเวลาตานี้แล้ว กรุณาดูตาล่าสุด');}return out;}
  function project(){if(!publicRoom)return;S.br={open:publicRoom.open,fee:publicRoom.fee};S.brHist=(publicRoom.hist||[]).map(h=>({no:h.round,win:h.result.filter(p=>p.rank===1).map(p=>esc(p.name)).join(', '),order:h.result.map(p=>p.rank+' '+esc(p.name)+' (ตา '+p.turn+' '+esc(p.cause)+')').join(' · ')}));
   if(publicRoom.state==='playing'||publicRoom.state==='result'){
    R={...structuredClone(publicRoom),warn:(publicRoom.warn||[]).map(p=>[p.x,p.y]),mode:R?.mode||null,busy:false,players:publicRoom.players.map(p=>({...p,n:esc(p.n),me:p.uid===Host.uid,col:COL[p.i],act:p.uid===Host.uid&&privateAction?.round===publicRoom.round&&privateAction?.turn===publicRoom.turn?privateAction.action:p.confirmed?{t:'stay'}:null})),log:(publicRoom.log||[]).map(esc)};
    if(!st||!$('#gbody').contains(st)){$('#gbody').innerHTML='';st=stage('br-bg');st.style.setProperty('--fog',`url(${IMG['br-fog']})`);}render();
    if(!R.players.some(p=>p.me))st.querySelector('.brbar').textContent='กำลังชมการแข่งขัน';
    if(R.done&&resultShown!==String(R.round)){resultShown=String(R.round);modal('<h2>🏁 ใบผลการแข่ง</h2>'+((R.result||[]).map(p=>'<div class="row"><b>'+p.rank+' '+esc(p.name)+'</b><span>ตา '+p.turn+' · '+esc(p.cause)+'</span></div>').join('')||'<p>รอบนี้เป็นโมฆะ ค่าเข้าสะสมในไปรษณีย์แล้ว</p>')+'<p class="note">ผลบันทึกบนคลาวด์แล้ว แอดมินส่งรางวัลผู้ชนะจากหน้าส่งของ</p>',[{t:'ปิด'},{t:'กลับห้อง',f:()=>{R=null;drawLobby();}}]);}
   }else{R=null;drawLobby();}
  }
  async function open(){R=null;publicRoom=null;await cloud('minigames',{type:'status'});stop();if(S.br.open){await action({type:'status'});if(R&&(R.players.some(p=>p.me)||S.role==='admin'))subscribe();}else drawLobby();}
  function close(){stop();R=null;publicRoom=null;}
  function drawLobby(){const r=publicRoom||{seats:[],state:'waiting'},joined=r.seats.some(s=>s.uid===Host.uid);$('#gbody').innerHTML=`<div class="page"><h2>🎲 หนีผีฮาโลวีน</h2><div class="box"><b>${S.br.open?'เปิดอยู่ • ผู้เล่นจริง '+r.seats.length+'/8':'ห้องยังไม่เปิด'}</b><div class="row">${r.seats.map(p=>'<span class="chip">'+esc(p.name)+'</span>').join('')}</div><p class="note">ค่าเข้า ${S.br.fee} เหรียญ • 3–8 คน • รางวัลแอดมินส่งให้</p><div class="row"><button class="btn gray" id="brRule">📜 กติกา</button><button class="btn gray" id="brCheck">ตรวจสอบอีกครั้ง</button>${S.br.open&&!joined?'<button class="btn" id="brJoin">เข้าร่วม</button>':''}${joined?'<button class="btn gray" id="brLeave">ออกจากห้อง</button>':''}</div>${S.role==='admin'&&S.br.open?'<button class="btn pink" id="brStart">👑 เริ่มเกม</button>':''}</div></div>`;$('#brRule').onclick=showRules;$('#brCheck').onclick=open;if($('#brJoin'))$('#brJoin').onclick=async()=>{if(await action({type:'join'}))subscribe();};if($('#brLeave'))$('#brLeave').onclick=async()=>{if(await action({type:'leave'})){R=null;drawLobby();}};if($('#brStart'))$('#brStart').onclick=async()=>{if(await action({type:'start'}))subscribe();};if(joined||S.role==='admin')subscribe();else stop();}
  function subscribe(){if(watching)return;watching=true;stopRoom=Host.watchWorld('br',data=>{if(data){publicRoom=data;project();}});stopHand=Host.watchGameView('br',data=>{privateAction=data?{...data}:null;project();});tick=setInterval(async()=>{if(!R||R.done)return;const left=R.deadline-time(),label=st?.querySelector('#brt');if(label)label.textContent=Math.max(0,Math.ceil(left/1000));if(left<=0&&!acting&&!advancing){advancing=true;await action({type:'advance'});advancing=false;}},250);}
  function showRules(){rules('หนีผีฮาโลวีน',[['🗺️','สนาม 9×9','คนละ ❤️❤️❤️'],['⏱️','ตาละ 35 วิ','ทุกคนเลือกท่าพร้อมกัน'],['🚶','เดิน 1 ช่อง','ยืนช่องเดียวกับคนอื่นได้'],['⛏️','ขุด','40% ได้ไอเทม พกได้ 2 ชิ้น'],['🎃','ปาฟักทอง','ไกลไม่เกิน 3 ช่อง โดนเสีย ❤️1'],['🌑','เงาเตือน','ตาหน้าฟักทองตกจากฟ้า หลบด่วน'],['🌫️','หมอกผี','ทุก 3 ตาบีบสนามเข้ามา อยู่ในหมอกเสีย ❤️'],['👻','ตกรอบเป็นผี','หลอกคนอื่นให้เสียตาได้']],
    `<div class="rtitle">ไอเทม (ขุดเจอเท่านั้น)</div><div class="rgrid">${Object.values(ITEMS).map(([k,n,d])=>`<div class="rc"><img src="${IMG[k]}" style="width:2.6rem;height:2.6rem;object-fit:contain" alt=""><b>${n}</b><small>${d}</small></div>`).join('')}</div><div class="rtitle" style="text-align:center">👑 รอดคนสุดท้ายชนะ</div>`)}
  const alive=()=>R.players.filter(p=>p.alive),me=()=>R.players.find(p=>p.me)||{alive:false,items:[],hauntCd:1,act:null};
  function choose(a){if(!R||R.done)return;R.mode=null;action({type:'choose',action:a});}
  function cellClick(x,y){const m=me();if(!R.mode||R.busy)return;if(R.mode==='move'&&dist(x,y,m.x,m.y)===1)choose({t:'move',x,y});else if(R.mode==='shoes'&&dist(x,y,m.x,m.y)<=3&&dist(x,y,m.x,m.y)>0)choose({t:'item',k:'shoes',x,y});else if(R.mode==='throw'&&dist(x,y,m.x,m.y)<=3&&dist(x,y,m.x,m.y)>0)choose({t:'throw',x,y});else if(R.mode==='bomb'&&dist(x,y,m.x,m.y)<=3&&dist(x,y,m.x,m.y)>0)choose({t:'item',k:'bomb',x,y});}
  function render(anim){
    if(!st||!R)return;const m=me();let h='';
    // grid cells
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){const f=inFog(x,y,R.fog),fw=!f&&inFog(x,y,R.fogWarn),w=R.warn.some(a=>a[0]===x&&a[1]===y);
      let tgt='';if(R.mode&&m.alive){const d=dist(x,y,m.x,m.y);if((R.mode==='move'&&d===1)||((R.mode==='throw'||R.mode==='bomb'||R.mode==='shoes')&&d>0&&d<=3))tgt='tg'}
      h+=`<div class="brc ${f?'fog':''} ${fw?'fogw':''} ${tgt}" data-x="${x}" data-y="${y}" style="left:${GX+CELL*x}cqw;top:${topCqw(y)-CELL/2}cqw;width:${CELL}cqw;height:${CELL}cqw">${w?`<img class="brw" src="${IMG['br-warn-shadow']}" alt="">`:''}</div>`}
    R.pend.forEach((f,i)=>{h+=`<div class="brfx" style="left:${cx(f.x)}cqw;top:${topCqw(f.y)-4}cqw;animation-delay:${i*60}ms">${f.t}</div>`});R.pend=[];
    const left=alive().length;
    h+=`<div class="brtop"><span>ตาที่ ${R.turn}</span><b id="brt">35</b><span>รอด ${left}/${R.players.length}</span></div>`;
    h+=`<div class="brlog">${R.log.slice(0,3).map(l=>`<div>${l}</div>`).join('')||'<div>เลือกท่าภายใน 35 วิ ทุกคนเล่นพร้อมกัน</div>'}${R.fogWarn>R.fog?'<div>⚠️ หมอกจะบีบเข้ามาตาหน้า!</div>':''}</div>`;
    // action bar
    let bar='';
    if(R.done)bar='<span class="brhint">จบเกมแล้ว</span>';
    else if(!m.alive){const t=alive();bar=m.hauntCd>0?`<span class="brhint">👻 คุณเป็นผีแล้ว หลอกได้อีกใน ${m.hauntCd} ตา</span>`:(m.act&&m.act.t==='haunt'?`<span class="brhint">👻 จะหลอก ${R.players[m.act.v].n} ตาหน้า</span>`:`<span class="brhint">👻 เลือกคนที่จะหลอก:</span>${t.filter(a=>a.i!==m.lastHaunt).map(a=>`<button class="btn sm grape" data-h="${a.i}">${a.n}</button>`).join('')}`)}
    else if(m.frozen)bar='<span class="brhint">👻 คุณโดนผีหลอก ตานี้ทำอะไรไม่ได้</span>';
    else if(m.act)bar=`<span class="brhint">✅ เลือกแล้ว: ${({move:'เดิน',dig:'ขุด',throw:'ปาฟักทอง',stay:'ยืนเฉยๆ',item:'ใช้ไอเทม'})[m.act.t]} รอทุกคน…</span>`;
    else if(R.mode)bar=`<span class="brhint">${R.mode==='move'?'แตะช่องข้างตัวเพื่อเดิน':R.mode==='dig'?'':'แตะช่องเป้าหมาย (ไม่เกิน 3 ช่อง)'}</span><button class="btn sm gray" id="brcan">ยกเลิก</button>`;
    else bar=`<button class="btn sm" data-a="move">🚶 เดิน</button><button class="btn sm orange" data-a="dig">⛏️ ขุด</button><button class="btn sm pink" data-a="throw">🎃 ปา</button>${m.items.map((k,i)=>`<button class="britem" data-it="${k}"><img src="${IMG[ITEMS[k][0]]}" alt="">${ITEMS[k][1]}</button>`).join('')}`;
    h+=`<div class="brbar">${bar}</div>`;
    let base=st.querySelector('#brbase'),pl=st.querySelector('#brpl');
    if(!base){st.innerHTML='<div id="brbase"></div><div id="brpl"></div>';base=st.querySelector('#brbase');pl=st.querySelector('#brpl')}
    base.innerHTML=h;
    R.players.forEach(p=>{let e=pl.querySelector('[data-p="'+p.i+'"]');if(!e){e=document.createElement('div');e.dataset.p=p.i;pl.appendChild(e)}
      e.className=`brp ${p.me?'me':''} ${p.alive?'':'dead'} ${p.frozen?'frz':''}`;e.style.left=cx(p.x)+'cqw';e.style.top=topCqw(p.y)+'cqw';e.style.setProperty('--c',p.col);
      e.innerHTML=p.alive?`<span class="brdot">${p.n==='คุณ'?'คุณ':p.n[0]}</span><span class="brhp">${'❤️'.repeat(Math.max(0,p.hp))}</span>${p.cloak?'<span class="brst">🧥</span>':''}${p.frozen?'<span class="brst">👻</span>':''}`:`<img src="${IMG['br-grave']}" alt="">`});
    base.querySelectorAll('.brc').forEach(c=>c.onclick=()=>cellClick(+c.dataset.x,+c.dataset.y));
    base.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='dig')choose({t:'dig'});else{R.mode=a;render()}});
    base.querySelectorAll('[data-it]').forEach(b=>b.onclick=()=>{const k=b.dataset.it;if(k==='bomb'||k==='shoes'){R.mode=k;render()}else choose({t:'item',k})});
    base.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{choose({t:'haunt',v:+b.dataset.h})});
    const cn=base.querySelector('#brcan');if(cn)cn.onclick=()=>{R.mode=null;render()};
    if(S.role==='admin'){const stop=document.createElement('button');stop.className='btn sm pink';stop.style.cssText='position:absolute;left:34cqw;top:4cqw;z-index:8';stop.textContent='ยุติรอบฉุกเฉิน';stop.onclick=()=>modal('<h2>ยุติรอบและคืนค่าเข้า?</h2>',[{t:'ยกเลิก'},{t:'ยืนยัน',f:()=>action({type:'void'})}]);base.appendChild(stop);}

  }
  return {title:'🎲 หนีผีฮาโลวีน',open,close,refresh(){if(R&&st)render();else drawLobby()},canLeave(){if(R&&!R.done){modal('<h2>ออกจากสนาม?</h2><p>ตัวละครจะยืนเฉยๆ (ไม่ขุด ไม่ปา) จนกว่าจะกลับมา ไม่ถือว่าแพ้ทันที</p>',[{t:'อยู่ต่อ',c:'gray'},{t:'ออก',c:'pink',f:closeGame}]);return false}return true}};
})();



cloud('minigames',{type:'status'}).then(renderHub);
addEventListener('pagehide',()=>{if(CUR)GAMES[CUR].close();});

const stopControls=Host.watchWorld("minigames",config=>{if(config){S.br=config.br||S.br;S.kang=config.kang||S.kang;S.solo=config.solo||{};if(!CUR)renderHub();}});addEventListener("pagehide",()=>stopControls?.());
