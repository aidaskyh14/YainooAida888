import {birdPosition,fireBird,birdGain,minigameRules,MG_EMERGENCY,MG_CD,MG_MIN,MG_FEE3,MG_NAMES,BIRD_BLAST} from './solo-engine.js?v=ss3-fix15';
import {KANG} from './kang-engine.js?v=ss3-fix15';
import {mountMole} from './mole-game.js?v=ss3-fix15';
import {mountBasket} from './basket-game.js?v=ss3-fix15';
import {MOLE} from './mole-engine.js?v=ss3-fix15';
import {BASKET} from './basket-engine.js?v=ss3-fix15';
import {WITCH} from './witch-engine.js?v=ss3-fix15';
import {CANDY} from './candy-engine.js?v=ss3-fix15';
const IMG={"mole-bg":"images/mole-bg.webp","basket-bg":"images/basket-table-bg.webp","coin":"images/gacha-coin.webp","bs-bg":"images/bs-bg.webp","pk-bg":"images/pk-shelf-bg.webp","kg-bg":"images/kang-table-bg.webp","gun":"images/bs-gun.webp","b-ghost":"images/bs-bird-ghost-fly-4x4.webp","bi-ghost":"images/bs-bird-ghost.webp","b-pumpkin":"images/bs-bird-pumpkin-fly-4x4.webp","bi-pumpkin":"images/bs-bird-pumpkin.webp","b-witch":"images/bs-bird-witch-fly-4x4.webp","bi-witch":"images/bs-bird-witch.webp","b-skeleton":"images/bs-bird-skeleton-fly-4x4.webp","bi-skeleton":"images/bs-bird-skeleton.webp","pk-normal":"images/pk-normal.webp","pk-angel":"images/pk-angel.webp","pk-devil":"images/pk-devil.webp","pkt-angel":"images/pk-angel-turn-4x4.webp","pkt-devil":"images/pk-devil-turn-4x4.webp","k-spade-a":"images/kang-card-spade-a.webp","k-spade-2":"images/kang-card-spade-2.webp","k-spade-3":"images/kang-card-spade-3.webp","k-spade-4":"images/kang-card-spade-4.webp","k-spade-5":"images/kang-card-spade-5.webp","k-spade-6":"images/kang-card-spade-6.webp","k-spade-7":"images/kang-card-spade-7.webp","k-spade-8":"images/kang-card-spade-8.webp","k-spade-9":"images/kang-card-spade-9.webp","k-spade-10":"images/kang-card-spade-10.webp","k-spade-j":"images/kang-card-spade-j.webp","k-spade-q":"images/kang-card-spade-q.webp","k-spade-k":"images/kang-card-spade-k.webp","k-heart-a":"images/kang-card-heart-a.webp","k-heart-2":"images/kang-card-heart-2.webp","k-heart-3":"images/kang-card-heart-3.webp","k-heart-4":"images/kang-card-heart-4.webp","k-heart-5":"images/kang-card-heart-5.webp","k-heart-6":"images/kang-card-heart-6.webp","k-heart-7":"images/kang-card-heart-7.webp","k-heart-8":"images/kang-card-heart-8.webp","k-heart-9":"images/kang-card-heart-9.webp","k-heart-10":"images/kang-card-heart-10.webp","k-heart-j":"images/kang-card-heart-j.webp","k-heart-q":"images/kang-card-heart-q.webp","k-heart-k":"images/kang-card-heart-k.webp","k-diamond-a":"images/kang-card-diamond-a.webp","k-diamond-2":"images/kang-card-diamond-2.webp","k-diamond-3":"images/kang-card-diamond-3.webp","k-diamond-4":"images/kang-card-diamond-4.webp","k-diamond-5":"images/kang-card-diamond-5.webp","k-diamond-6":"images/kang-card-diamond-6.webp","k-diamond-7":"images/kang-card-diamond-7.webp","k-diamond-8":"images/kang-card-diamond-8.webp","k-diamond-9":"images/kang-card-diamond-9.webp","k-diamond-10":"images/kang-card-diamond-10.webp","k-diamond-j":"images/kang-card-diamond-j.webp","k-diamond-q":"images/kang-card-diamond-q.webp","k-diamond-k":"images/kang-card-diamond-k.webp","k-club-a":"images/kang-card-club-a.webp","k-club-2":"images/kang-card-club-2.webp","k-club-3":"images/kang-card-club-3.webp","k-club-4":"images/kang-card-club-4.webp","k-club-5":"images/kang-card-club-5.webp","k-club-6":"images/kang-card-club-6.webp","k-club-7":"images/kang-card-club-7.webp","k-club-8":"images/kang-card-club-8.webp","k-club-9":"images/kang-card-club-9.webp","k-club-10":"images/kang-card-club-10.webp","k-club-j":"images/kang-card-club-j.webp","k-club-q":"images/kang-card-club-q.webp","k-club-k":"images/kang-card-club-k.webp","k-back":"images/kang-card-back.webp","hat":"images/honey-sailorhat.webp","mb":"images/animals-item-musicbox.webp","b-crow":"images/bs-bird-crow-fly-4x4.webp","bi-crow":"images/bs-bird-crow.webp","b-owl":"images/bs-bird-owl-fly-4x4.webp","bi-owl":"images/bs-bird-owl.webp","b-bat":"images/bs-bird-bat-fly-4x4.webp","bi-bat":"images/bs-bird-bat.webp","wg-poster":"images/wg-poster.webp","cf-poster":"images/cf-poster.webp"},DIM={"gun":[571,494],"b-ghost":[183.0,150.0],"b-pumpkin":[197.0,150.0],"b-witch":[161.0,150.0],"b-skeleton":[199.0,150.0],"pk-normal":[50.0,44.75],"pk-angel":[50.0,39.25],"pk-devil":[50.0,44.5],"pkt-angel":[218.0,180.0],"pkt-devil":[413.0,180.0]};
const $=s=>document.querySelector(s);
const fmt=n=>Math.round(n).toLocaleString('en-US'),sgn=n=>(n>0?'+':n<0?'−':'')+fmt(Math.abs(n));
const rnd=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)],clamp=(v,a,b)=>v<a?a:v>b?b:v;
const Host=parent.__HOST;if(!Host)throw new Error('กรุณาเปิดจากเกมหลัก');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let soloState={},serverOffset=0,acting=false;const time=()=>Date.now()+serverOffset;
const S={owner:!!Host.admin,kang:[{open:true,base:10000,fee:4},{open:true,base:50000,fee:4}],solo:{},cfg:{},rules:minigameRules(null),emergency:false,cd:{},streak:{},kgHist:[]};
/* Idle kick (fix13): counts from the LAST real touch anywhere in this screen, its game frames, or any action the player sends. */
let lastTouch=Date.now();const touch=()=>{lastTouch=Date.now();};
const QUIET=new Set(['advance','tick','status','witch-cp','candy-cp']);
let cloudWait=Promise.resolve();
/* One request at a time. Player taps wait their turn instead of being dropped; timer-driven tick calls are skipped when busy. */
let lastCloudError='';
async function cloud(system,input,opts={}){
  if(!QUIET.has(input.type))touch();
  while(acting){if(input.type==='advance'||input.type==='tick')return null;await cloudWait;}
  acting=true;let release;cloudWait=new Promise(resolve=>release=resolve);const sent=Date.now();
  try{const out=await Host.cloud(system,{...input,v:13});if(out.serverNow)serverOffset=out.serverNow-(sent+Date.now())/2;if(out.state)soloState=out.state;
    if(out.progress){S.cd={...(out.progress.cd||{})};S.streak={...(out.progress.kang||{})};}if(typeof out.owner==='boolean')S.owner=out.owner;if(out.settings)applySettings(out.settings);
    if(out.refunded?.length)setTimeout(()=>{const t=out.refunded.reduce((a,r)=>({coin:a.coin+(r.coins||0),hat:a.hat+(r.hat||0),mb:a.mb+(r.mb||0)}),{coin:0,hat:0,mb:0});modal(`<h2>⛔ ระบบปิดฉุกเฉิน</h2><p>รอบที่ค้างอยู่ถูกยกเลิก ไม่มีผลกับกุศล</p>${feeChips(t,'plus')}<p class="note">คืนค่าเข้าครบแล้ว</p>`);},0);
    if(out.abandoned?.length)setTimeout(()=>out.abandoned.forEach(k=>{const r=soloState[k];if(r)toast(`⌛ รอบ${MG_NAMES[k]}ที่ค้างไว้หมดเวลา สรุปผล ${sgn(r.gain||0)} กุศล`);}),0);
    if(out.notice)toast(out.notice);
    renderWallet();return out;}
  catch(e){lastCloudError=e.message||'';if(!QUIET.has(input.type)&&!opts.quiet)toast(e.message);return null;}
  finally{acting=false;release();}
}
function applySettings(cfg){S.controlRevision=cfg.controlRevision||0;S.cfg=cfg;S.rules=minigameRules(cfg);S.kang=cfg.kang||S.kang;S.solo=cfg.solo||{};const was=S.emergency;S.emergency=S.rules.emergency;if(S.emergency&&!was)setTimeout(onEmergency,0);}
/* Emergency close: everyone in a minigame screen goes back to the minigame home. */
function onEmergency(){if(!S.emergency)return;if(CUR)closeGame();if(!$('#admin').classList.contains('on'))modal(`<h2>⛔ ปิดฉุกเฉิน</h2><p>${MG_EMERGENCY}</p>`);}
const pad2=h=>String(h).padStart(2,'0');
const hoursText=k=>S.rules.hours[k].map(h=>pad2(h)+':00').join('–');
let CUR=null;
function thaiTime(){const d=new Date(time()+7*3600e3);return d.getUTCHours()*60+d.getUTCMinutes();}
function inHours(from,to){const m=thaiTime();return from<to?(m>=from*60&&m<to*60):(m>=from*60||m<to*60)}
function soloOpen(k){if(S.rules.emergency)return false;const m=S.rules.solo[k];if(m==='open')return true;if(m==='closed')return false;const h=S.rules.hours[k];return h?inHours(h[0],h[1]):true;}
function minsUntil(h){const m=thaiTime();let d=h*60-m;if(d<=0)d+=1440;return d}
function hm(min){const h=Math.floor(min/60),m=min%60;return h?`${h} ชม. ${m} นาที`:`${m} นาที`}
function mmss(ms){ms=Math.max(0,ms);const s=Math.ceil(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2600)}
function modal(html,acts=[{t:'ตกลง'}]){
  const c=$('#mcard');c.innerHTML=html+'<div class="acts"></div>';const a=c.querySelector('.acts');
  acts.forEach(x=>{const b=document.createElement('button');b.className='btn '+(x.c||'');b.textContent=x.t;b.onclick=()=>{if(!x.keep)closeModal();x.f&&x.f()};a.appendChild(b)});
  $('#modal').classList.add('on');
}
function rules(title,cards,extra=''){modal(`<h2>📜 ${title}</h2><div class="rgrid">${cards.map(([e,b,s])=>`<div class="rc"><div class="e">${e}</div><b>${b}</b>${s?`<small>${s}</small>`:''}</div>`).join('')}</div>${extra}`,[{t:'เข้าใจแล้ว'}])}
function pills(list){return `<div class="pills">${list.map(([t,ok])=>`<span class="pill ${ok===false?'no':''}">${t}</span>`).join('')}</div>`}
function closeModal(){$('#modal').classList.remove('on')}
function coinImg(){return `<img src="${IMG.coin}" alt="">`}
const AVC=['#F2B544','#F27E9B','#6CC9A8','#8FB3F2','#C59BF2','#F29B6C','#5FC3D6','#D9A066'];
const avColor=uid=>{let h=0;for(const c of String(uid||''))h=(h*31+c.charCodeAt(0))>>>0;return AVC[h%AVC.length];};
const initial=name=>esc((Array.from(String(name||'?').trim())[0])||'?');
/* ---------- wallet + fees (coins, sailor hats bag.item.hat, music boxes bag.item.musicbox) ---------- */
function wallet(){let g={};try{g=JSON.parse(Host.get('s3all-v1')||'{}')||{};}catch{}const it=g.bag?.item||{};return {coin:Host.coins||0,hat:Number(it.hat)||0,mb:Number(it.musicbox)||0,merit:g.merit||0};}
const feeOf=k=>S.rules.fee3?.[k]||MG_FEE3[k];
function lacks(k){const f=feeOf(k),w=wallet(),l=[];if(w.coin<f.coin)l.push('coin');if(w.hat<f.hat)l.push('hat');if(w.mb<f.mb)l.push('mb');return l;}
const LACK_NAME={coin:'🪙 เหรียญ',hat:'👒 หมวกกะลาสี',mb:'🎵 กล่องดนตรี'};
function feeChips(f,cls='',per=''){return `<div class="fchips ${cls}">${[['coin',f.coin],['hat',f.hat],['mb',f.mb]].map(([k,n])=>`<span><img src="${IMG[k]}" alt="">${fmt(n)}${per}</span>`).join('')}</div>`;}
function feePills(k){const f=feeOf(k),l=lacks(k);return `<div class="fchips">${[['coin',f.coin],['hat',f.hat],['mb',f.mb]].map(([x,n])=>`<span class="${l.includes(x)?'no':''}"><img src="${IMG[x]}" alt="">${fmt(n)}</span>`).join('')}</div>`;}
const feeText=k=>{const f=feeOf(k);return `🪙${f.coin} · 👒${f.hat} · 🎵${f.mb}`;};
function renderWallet(){const w=wallet(),n=Host.mailCount();const h=`<span class="chip">${coinImg()}${fmt(w.coin)}</span><span class="chip"><img src="${IMG.hat}" alt="">${fmt(w.hat)}</span><span class="chip"><img src="${IMG.mb}" alt="">${fmt(w.mb)}</span><span class="chip">✨${fmt(w.merit)}</span><button class="chip mail" data-mail>📮${n?`<i>${n}</i>`:''}</button>`;$('#wal').innerHTML=h;$('#gwal').innerHTML=h;document.querySelectorAll('[data-mail]').forEach(b=>b.onclick=()=>Host.openMail());}
// sprite helper (4x4 sheets)
function sprite(key,hcqw,extra=''){const d=DIM[key];const w=hcqw*d[0]/d[1];return `<div class="spr ${extra}" data-k="${key}" style="width:${w}cqw;height:${hcqw}cqw;background-image:url(${IMG[key]})"></div>`}
function setFrame(el,f){el.style.backgroundPosition=`${(f%4)*100/3}% ${Math.floor(f/4)*100/3}%`}
function playSprite(el,fps=12,loop=false,done,from=0,to=15){let f=from;setFrame(el,f);const iv=setInterval(()=>{f++;if(f>to){if(loop)f=from;else{clearInterval(iv);done&&done();return}}setFrame(el,f)},1000/fps);return iv}
const GAMES={};
async function openGame(k){if(S.emergency){modal(`<h2>⛔ ปิดฉุกเฉิน</h2><p>${MG_EMERGENCY}</p>`);return;}closeAdmin();closeSheet();CUR=k;touch();const G=GAMES[k];$('#game').classList.add('on');$('#game').classList.toggle('framed',!!G.framed);$('#gtitle').textContent=G.title;$('#gbody').innerHTML='<div class="loadwrap"><div class="spin"></div><p>กำลังโหลดห้องเกม…</p></div>';document.body.style.overflow='hidden';try{await G.open();}catch(e){if(CUR===k){$('#gbody').innerHTML='<div class="loadwrap"><h2>ยังโหลดห้องไม่ได้</h2><p>'+esc(e.message||'กรุณาลองอีกครั้ง')+'</p><button class="btn" id="gameRetry">ลองโหลดอีกครั้ง</button> <button class="btn gray" id="gameBack">กลับหน้ามินิเกม</button></div>';$('#gameRetry').onclick=()=>openGame(k);$('#gameBack').onclick=closeGame;}}}
function closeGame(){if(CUR&&GAMES[CUR].close)GAMES[CUR].close();CUR=null;$('#game').classList.remove('on','framed');$('#gbody').innerHTML='';document.body.style.overflow='';renderHub()}
$('#gback').onclick=()=>{if(CUR&&GAMES[CUR].canLeave&&!GAMES[CUR].canLeave())return;closeGame()};
function stage(bgKey){const g=$('#gbody');g.innerHTML='';g.style.setProperty('--gbg',`url(${IMG[bgKey]})`);const s=document.createElement('div');s.className='stage';s.style.backgroundImage=`url(${IMG[bgKey]})`;g.appendChild(s);return s}
function stageOf(bgKey){const s=$('#gbody > .stage');if(s&&s.dataset.bg===bgKey)return s;const n=stage(bgKey);n.dataset.bg=bgKey;return n;}

/* ---------- hub (2-column cards + bottom sheet) ---------- */
const HUB=[
 {k:'bs',ic:'🐦',sn:'ยิงนก',d:'60 วิ · ระวังนกร้ายบินประกบ',bg:'bs-bg',lo:-30000,hi:null,tag:'นกร้ายใหม่'},
 {k:'mole',ic:'🔨',d:'60 วิ · ทุบให้ถึงเป้า',bg:'mole-bg',lo:MOLE.lose,hi:MOLE.win+MOLE.bonus},
 {k:'witch',ic:'🧹',sn:'แม่มดซิ่ง',d:'ตะแคง/ลากนิ้ว · 5 ช่วง',bg:'wg-poster',lo:WITCH?.lo??-60000,hi:WITCH?.hi??80000,bonus:WITCH?.bonus??30000,tag:'ใหม่'},
 {k:'pk',ic:'🎃',d:'เลือก 4 จาก 16',bg:'pk-bg',lo:-15000,hi:100000},
 {k:'basket',ic:'🧺',sn:'จัดตะกร้า',d:'30 วิ · จัดให้ครบ 3 ตะกร้า',bg:'basket-bg',lo:BASKET.none,hi:BASKET.all.jackpot},
 {k:'candy',ic:'🍭',sn:'ลูกกวาดคำสาป',d:'ปัดซ้ายทิ้ง · ปัดขวาเก็บ',bg:'cf-poster',lo:CANDY?.lo??-20000,hi:CANDY?.hi??50000,bonus:CANDY?.bonus??50000,tag:'ใหม่'},
 {k:'kang',ic:'🃏',d:'4 คน · ค่าเข้าคิดต่อตา',bg:'kg-bg',tag:'ห้องแบบใหม่'}];
const hubOf=k=>HUB.find(g=>g.k===k);
const hasActive=k=>soloState[k]?.phase==='active';
/* Why a game cannot be started right now (empty = playable). */
function blockers(k){const R=S.rules,w=wallet(),out=[];
  if(R.emergency)return [{c:'off',t:'⛔ ปิดฉุกเฉิน',why:MG_EMERGENCY}];
  if(k==='kang'){if(R.off('kang'))return [{c:'off',t:'🔒 ปิดชั่วคราว',why:'🔒 ห้องไพ่แคงปิดชั่วคราว'}];
    if((S.streak.rest||0)>time())out.push({c:'wait',t:'⏳ พัก',cd:S.streak.rest,why:'⏳ พักไพ่แคงอยู่ เล่นได้อีกใน '});}
  else{if(hasActive(k))return [];
    if(R.solo[k]==='closed')return [{c:'off',t:'🔒 ปิดชั่วคราว',why:'🔒 เกมนี้ปิดชั่วคราว'}];
    if((S.cd[k]||0)>time())out.push({c:'wait',t:'⏳ พัก',cd:S.cd[k],why:'⏳ ยังพักอยู่ เล่นได้อีกใน '});
    else if(!soloOpen(k))out.push({c:'off',t:'🌙 เปิด '+pad2(R.hours[k][0])+':00',why:'🌙 เกมนี้เปิด '+hoursText(k)+' น.'});}
  const l=lacks(k);if(l.length)out.push({c:'off',t:'🎒 ของไม่พอ',why:'🎒 ขาด '+l.map(x=>LACK_NAME[x]).join(' · ')});
  if(k!=='kang'&&w.merit<MG_MIN[k])out.push({c:'off',t:'✨ กุศลไม่ถึง',why:'✨ ต้องมีกุศลอย่างน้อย '+fmt(MG_MIN[k])});
  return out;}
function cardStatus(k){const R=S.rules,b=blockers(k);
  if(k==='kang'&&!b.some(x=>x.c==='off'||x.c==='wait')){const n=S.kang.map(r=>r.state==='result'&&time()>=(r.endAt||0)?0:(r.seated||0));return {c:'on',t:'✅ 2 ห้อง · '+n.map(x=>x+'/4').join(' · ')};}
  if(k!=='kang'&&hasActive(k))return {c:'wait',t:'▶ เล่นค้างอยู่'};
  if(b.length)return b[0];return {c:'on',t:R.hours[k]&&S.rules.solo[k]!=='open'?'✅ ถึง '+pad2(R.hours[k][1])+':00':'✅ เปิดอยู่'};}
const pillHtml=st=>`<span class="hst ${st.c}" ${st.cd?`data-cd="${st.cd}" data-pre="${st.t}"`:''}>${st.cd?st.t+' '+mmss(st.cd-time()):st.t}</span>`;
function renderHub(){
  const l=k=>lacks(k);
  $('#hub').innerHTML=`${S.emergency?`<div class="emerban">⛔ ${MG_EMERGENCY}</div>`:''}<div class="hgrid">${HUB.map(g=>{const f=feeOf(g.k),lk=l(g.k);return `<button class="hcard" data-g="${g.k}"><span class="hth" style="background-image:url(${IMG[g.bg]})"></span>${g.tag?`<span class="hnew">✨ ${g.tag}</span>`:''}${pillHtml(cardStatus(g.k))}<span class="hbody"><b class="ht">${g.ic} ${g.sn||MG_NAMES[g.k]}</b><span class="hmeta">${g.d}</span><span class="hfee">${[['coin',f.coin],['hat',f.hat],['mb',f.mb]].map(([x,n])=>`<span class="${lk.includes(x)?'no':''}"><img src="${IMG[x]}" alt="">${n}</span>`).join('')}<span>⏳${g.k==='kang'?KANG.restMs/60000:MG_CD[g.k]}′</span></span></span></button>`;}).join('')}<button class="hcard" id="frCard"><span class="hth" style="background-image:url(images/funrun/fr-poster.webp)"></span><span class="hnew">✨ ใหม่</span>${pillHtml({c:S.emergency?'off':'on',t:S.emergency?'ปิดฉุกเฉิน':'6 คน'})}<span class="hbody"><b class="ht">🎃 แรลลี่ฟักทอง</b><span class="hmeta">วิ่งแข่งพร้อมกัน 6 คน · 3 ด่าน</span><span class="hfee"><span><img src="${IMG.coin}" alt="">10</span><span><img src="${IMG.hat}" alt="">50</span><span><img src="${IMG.mb}" alt="">50</span><span>✨15,000+</span></span></span></button></div>`;
  document.querySelectorAll('.hcard').forEach(b=>{if(b.dataset.g)b.onclick=()=>openSheet(b.dataset.g);});
  const fc=$('#frCard');if(fc)fc.onclick=()=>{if(S.emergency)return toast('⛔ มินิเกมปิดฉุกเฉินอยู่');try{parent.postMessage({go:'funrun'},location.origin);}catch(e){}};
  const ab=$('#adminBtn');ab.hidden=!S.owner;if(!S.owner)closeAdmin();
  if($('#admin').classList.contains('on'))renderAdmin();
  if(sheetK)openSheet(sheetK,true);
  renderWallet();
}
let sheetK=null;
function openSheet(k,again){sheetK=k;const g=hubOf(k),f=feeOf(k),lk=lacks(k),w=wallet(),b=blockers(k),R=S.rules,kang=k==='kang';
  const tile=(img,v,s,no)=>`<div class="hf ${no?'no':''}">${img.startsWith('images/')?`<img src="${img}" alt="">`:`<div class="i">${img}</div>`}<b>${v}</b><small>${s}</small></div>`;
  const range=kang?`<div class="hrange"><div class="lb"><span>🃏 ได้เสียกันเองในห้อง</span><span class="p">ตามทุนห้อง</span></div><div class="bonus">🔁 เล่นติดกันได้ ${KANG.rounds} ตา แล้วพัก ${KANG.restMs/60000} นาที</div></div>`
   :`<div class="hrange"><div class="lb"><span>📉 แย่สุด</span><span>📈 ดีสุด</span></div><div class="bar"></div><div class="lb"><span class="n">${sgn(g.lo)}</span><span class="p">${g.hi==null?'ไม่จำกัด':sgn(g.hi)}</span></div>${g.bonus?`<div class="bonus">🌟 โบนัสหายาก +${fmt(g.bonus)} เพิ่ม</div>`:''}</div>`;
  const per=kang?'/ตา':'';const left=kang?Math.max(0,KANG.rounds-((time()-(S.streak.at||0)>KANG.restMs)?0:(S.streak.n||0))):null;
  const active=!kang&&hasActive(k),hard=b.filter(x=>!kang||x.c==='off'&&/ปิด/.test(x.t));
  const playable=active||!(kang?hard.length:b.length);
  const why=b.map(x=>x.cd?`<span data-cd="${x.cd}" data-pre="${esc(x.why)}">${x.why}${mmss(x.cd-time())}</span>`:x.why).join('<br>');
  $('#hsheet').innerHTML=`<div class="hbox ${again?'still':''}"><div class="hhero" style="background-image:url(${IMG[g.bg]})"><button class="hx" id="hsx" aria-label="ปิด">✕</button></div><div class="hin">
   <h2>${g.ic} ${MG_NAMES[k]}</h2><div class="hdesc">${g.d}</div>
   <div class="hfacts">${tile(IMG.coin,f.coin,'เหรียญ'+per,lk.includes('coin'))}${tile(IMG.hat,f.hat,'หมวกกะลาสี'+per,lk.includes('hat'))}${tile(IMG.mb,f.mb,'กล่องดนตรี'+per,lk.includes('mb'))}
    ${tile('⏳',(kang?KANG.restMs/60000:MG_CD[k])+' นาที',kang?'พักหลังครบ '+KANG.rounds+' ตา':'พักหลังเล่น')}${tile('🕘',R.hours[k]?pad2(R.hours[k][0])+'–'+pad2(R.hours[k][1])+' น.':'ทั้งวัน','เวลาเปิด')}${tile('✨',kang?'8× ทุนห้อง':fmt(MG_MIN[k])+'+','กุศลขั้นต่ำ',!kang&&w.merit<MG_MIN[k])}</div>
   ${range}${left!=null?`<div class="hnote">เล่นได้อีก <b>${left}</b> ตา ก่อนพัก</div>`:''}
   <button class="hplay" id="hplay" ${playable?'':'disabled'}>${active?'▶ กลับไปเล่นรอบเดิม':kang?'▶ เข้าห้องไพ่แคง':'▶ เข้าเล่น'}</button>
   ${why?`<div class="hwhy">${why}</div>`:''}<div class="hnote">${kang?'หักค่าเข้าตอนกด “พร้อม” ในห้อง · คืนครบถ้าออกก่อนเริ่ม':'หักค่าเข้าตอนกดเริ่มในเกม · คืนครบถ้าระบบปิดฉุกเฉิน'}</div>
  </div></div>`;
  $('#hsheet').classList.add('on');$('#hsx').onclick=closeSheet;$('#hsheet').onclick=e=>{if(e.target.id==='hsheet')closeSheet();};$('#hplay').onclick=()=>openGame(k);}
function closeSheet(){sheetK=null;$('#hsheet').classList.remove('on');$('#hsheet').innerHTML='';}
/* Live countdown text without redrawing the cards. */
setInterval(()=>{document.querySelectorAll('[data-cd]').forEach(e=>{const left=+e.dataset.cd-time();if(left<=0){if(!CUR)renderHub();return;}e.textContent=e.dataset.pre+(e.classList.contains('hst')?' ':'')+mmss(left);});},1000);

/* ---------- owner control panel (👑, world/minigameOwner) ---------- */
function seg(attrs,options,cur){return `<div class="seg">${options.map(([v,t])=>`<button ${attrs}="${v}" class="${String(v)===String(cur)?'on':''}">${t}</button>`).join('')}</div>`;}
function sel(id,vals,cur,fn=v=>v){return `<select id="${id}">${vals.map(v=>`<option value="${v}"${v==cur?' selected':''}>${fn(v)}</option>`).join('')}</select>`;}
function openAdmin(){$('#admin').classList.add('on');renderAdmin();}
function closeAdmin(){$('#admin').classList.remove('on');}
function renderAdmin(){
  if(!S.owner){closeAdmin();return;}
  // Do not redraw under the owner's fingers while a fee/hour field is being edited.
  const focus=document.activeElement;if(focus&&$('#adminBody').contains(focus)&&/INPUT|SELECT/.test(focus.tagName))return;
  const R=S.rules,em=R.emergency,kg=S.kang,off=S.cfg.off||{};
  const pill=(k,busy,openText='เปิดอยู่')=>em?`<span class="st off">ปิดฉุกเฉิน</span>`:R.off(k)?`<span class="st off">ปิดอยู่</span>`:busy?`<span class="st wait">${busy}</span>`:`<span class="st on">${openText}</span>`;
  const feeIn=k=>{const f=feeOf(k);return `<div class="afee3">${[['coin',99,'เหรียญ'],['hat',999,'หมวก'],['mb',999,'กล่องดนตรี']].map(([p,max,t])=>`<label><img src="${IMG[p]}" alt="">${t}<input type="number" min="0" max="${max}" step="1" inputmode="numeric" data-fee="${k}" data-part="${p}" value="${f[p]}"></label>`).join('')}</div>`;};
  const hourSel=k=>{const opt=v=>[...Array(24).keys()].map(h=>`<option value="${h}"${h===v?' selected':''}>${pad2(h)}:00</option>`).join('');return `<label class="ahours">เวลาเปิด<span><select data-hour="${k}" data-end="0">${opt(R.hours[k][0])}</select>–<select data-hour="${k}" data-end="1">${opt(R.hours[k][1])}</select></span></label>`;};
  const card=(k,bg,status,modes,cur,extra='')=>`<section class="acard mg"><header><span class="aic" style="background-image:url(${IMG[bg]})"></span><b>${MG_NAMES[k]}</b>${status}</header>${seg(`data-ctl="${k}" data-mode`,modes,cur)}${feeIn(k)}${extra}</section>`;
  const soloMode=k=>S.solo?.[k]||'auto',onOff=[['auto','เปิด'],['closed','ปิด']],timed=[['auto','⏰ ตามเวลา'],['open','เปิดเลย'],['closed','ปิด']];
  const base=(r,i)=>`<label>ฐานห้อง ${i+1}${sel('kb'+i,[1000,5000,10000,50000],r.base,fmt)}</label>`;
  const kRooms=kg.map((r,i)=>`<div class="aroom"><span>ห้อง ${i+1} · ${r.seated||0}/4 ${r.state==='playing'?'· กำลังเล่น':r.state==='countdown'?'· นับถอยหลัง':r.state==='result'?'· ขึ้นผล':''}</span><button class="btn sm gray" data-clear="${i}">🧹 เคลียร์ห้อง</button></div>`).join('');
  $('#adminBody').innerHTML=`
  <section class="acard emer ${em?'on':''}"><b>${em?'⛔ มินิเกมปิดฉุกเฉินอยู่':'🟢 มินิเกมเปิดตามปกติ'}</b><p class="note">${em?'ทุกคนถูกพากลับหน้าแรก · ค่าเข้าและทุนคืนแล้ว':'ปิดทุกเกมทันที เตะทุกคนกลับหน้าแรก คืนค่าเข้า (เหรียญ หมวก กล่องดนตรี) และทุนแคงทางไปรษณีย์'}</p><button class="btn ${em?'':'danger'}" id="emBtn">${em?'✅ เปิดระบบกลับ':'⛔ ปิดฉุกเฉินทั้งหมด'}</button></section>
  ${card('kang','kg-bg',pill('kang',kg.some(r=>r.playing)?'กำลังเล่น':''),[['open','เปิด'],['closed','ปิด']],off.kang?'closed':'open',`<div class="agrid">${kg.map(base).join('')}</div>${kRooms}<p class="note">ค่าเข้าคิดต่อตา · เคลียร์ห้องได้ทุกเวลา ถ้ากำลังเล่นจะยกเลิกรอบและคืนทุน+ค่าเข้าทางไปรษณีย์</p>`)}
  ${card('bs','bs-bg',soloOpen('bs')?pill('bs'):pill('bs','','ตามเวลา'),timed,soloMode('bs'),hourSel('bs'))}
  ${card('pk','pk-bg',soloOpen('pk')?pill('pk'):pill('pk','','ตามเวลา'),timed,soloMode('pk'),hourSel('pk'))}
  ${['mole','witch','basket','candy'].map(k=>card(k,hubOf(k).bg,pill(k),onOff,soloMode(k)==='closed'?'closed':'auto')).join('')}
  <p class="note" style="text-align:center">ค่าเข้าใหม่มีผลกับคนที่เข้าเล่นครั้งถัดไป ไม่กระทบคนที่จ่ายแล้ว · เหรียญ 0–99 · หมวก/กล่องดนตรี 0–999</p>
  <details class="acard"><summary>📜 ผลไพ่แคงย้อนหลัง</summary>${S.kgHist.length?S.kgHist.map(r=>`<div class="hist">${r}</div>`).join(''):'<p class="note">เปิดห้องไพ่แคงหนึ่งครั้งเพื่อโหลดประวัติ</p>'}</details>`;
  const B=$('#adminBody'),saved=out=>{if(out)toast('บันทึกแล้ว');renderHub();};
  B.querySelector('#emBtn').onclick=()=>em?modal('<h2>เปิดระบบมินิเกมกลับ?</h2><p>ทุกเกมกลับมาเปิดตามการตั้งค่าเดิม</p>',[{t:'ยกเลิก',c:'gray'},{t:'เปิดระบบ',f:async()=>saved(await cloud('minigames',{type:'emergency',on:false}))}])
    :modal('<h2>⛔ ปิดฉุกเฉินทั้งหมด?</h2><p>ทุกเกมปิดทันที ทุกคนถูกพากลับหน้าแรก รอบที่เล่นอยู่เป็นโมฆะ คืนค่าเข้าและทุนแคงทางไปรษณีย์ ไม่มีใครเสียกุศล</p>',[{t:'ยกเลิก',c:'gray'},{t:'ปิดฉุกเฉิน',c:'pink',f:async()=>saved(await cloud('minigames',{type:'emergency',on:true}))}]);
  B.querySelectorAll('[data-ctl]').forEach(b=>b.onclick=async()=>saved(await cloud('minigames',{type:'control',game:b.dataset.ctl,mode:b.dataset.mode})));
  B.querySelectorAll('[data-fee]').forEach(i=>i.onchange=async()=>{const k=i.dataset.fee,p=i.dataset.part,v=Number(i.value),max=p==='coin'?99:999;if(!Number.isInteger(v)||v<0||v>max){toast(p==='coin'?'เหรียญต้องเป็น 0–99':'หมวก/กล่องดนตรีต้องเป็น 0–999');i.value=feeOf(k)[p];return;}i.blur();saved(await cloud('minigames',{type:'fees',fees:{[k]:{...feeOf(k),[p]:v}}}));});
  B.querySelectorAll('[data-hour]').forEach(x=>x.onchange=async()=>{const k=x.dataset.hour,v=[...B.querySelectorAll(`[data-hour="${k}"]`)].map(e=>+e.value);x.blur();if(v[0]===v[1]){toast('เวลาเปิดและปิดต้องไม่ตรงกัน');renderAdmin();return;}saved(await cloud('minigames',{type:'hours',game:k,from:v[0],to:v[1]}));});
  kg.forEach((r,i)=>{const e=B.querySelector('#kb'+i);if(e)e.onchange=async ev=>{ev.target.blur();const out=await cloud('kang',{type:'configure',room:i,base:+ev.target.value});if(out?.room?.nextBase)toast('ค่าฐานใหม่มีผลรอบถัดไป');else saved(out);};});
  B.querySelectorAll('[data-clear]').forEach(b=>b.onclick=()=>clearKangRoom(+b.dataset.clear));
}
async function clearKangRoom(i){const out=await cloud('kang',{type:'clear',room:i});if(out){toast('🧹 เคลียร์ห้อง '+(i+1)+' แล้ว'+(out.room?.reason==='VOID'||out.cleared?'':''));renderHub();}return out;}
$('#adminBtn').onclick=()=>{if(S.owner)openAdmin();};$('#adminClose').onclick=closeAdmin;
setInterval(()=>{if(!CUR&&!$('#modal').classList.contains('on')&&!$('#admin').classList.contains('on')&&!sheetK)renderHub()},30000);
renderHub();

/* ---------- จิ้มฟักทอง ---------- */
GAMES.pk=(()=>{
  const XS=[26.6,42.2,58.0,73.8],YS=[36.3,44.7,53.0,61.6];
  let st,round=null,cdIv;
  const PAY={4:{k:100000,t:'โบนัส +100,000 กุศล'},3:{k:20000,t:'ได้รับ +20,000 กุศล'},2:{k:0,t:'รางวัลปลอบใจ กล่องสุ่มนกกระจอกเทศ 10 กล่อง + กล่องสุ่มนกโดโด้ 10 กล่อง',box:1},1:{k:-5000,t:'ถูกหัก 5,000 กุศล'},0:{k:-15000,t:'ถูกหัก 15,000 กุศล'}};
  async function open(){st=stage('pk-bg');await cloud('minigames',{type:'status'});if(soloState.pk?.phase==='active'){round={...soloState.pk,sel:[],phase:'pick'};st.innerHTML=cells()+`<div class="pkhud" id="pkhud"></div><div class="panel" id="pkp"></div>`;st.querySelectorAll('.pkc').forEach(c=>c.innerHTML=`<img class="pkn" src="${IMG['pk-normal']}">`);pickMode();}else lobby();cdIv=setInterval(()=>{if(!round)lobby()},1000);}
  function close(){clearInterval(cdIv);round=null}
  function cells(){let h='';for(let i=0;i<16;i++){const x=XS[i%4],y=YS[Math.floor(i/4)];h+=`<div class="pkc" data-i="${i}" style="left:${x}%;top:${y}%"></div>`}return h}
  function showRules(){
    const ang=n=>[...Array(4)].map((_,i)=>`<img src="${IMG[i<n?'pk-angel':'pk-devil']}" alt="">`).join('');
    const L=[[4,'+100,000','good'],[3,'+20,000','good'],[2,'📦 กล่องนก 10+10',''],[1,'−5,000','bad'],[0,'−15,000','bad']];
    rules('จิ้มฟักทอง',[['🎃','เลือก 4 ลูก','จาก 16 ลูกบนชั้น'],['🔮','ผลสุ่มไว้ก่อน','ไม่เปลี่ยนจนจบรอบ'],['⏳','พัก '+MG_CD.pk+' นาที','หลังจบแต่ละรอบ'],['🌙','เปิด '+hoursText('pk'),feeText('pk')+' · กุศล '+fmt(MG_MIN.pk)+'+']],
      `<div class="rtitle">รางวัลจาก 4 ลูกที่เลือก</div>${L.map(([n,t,c])=>`<div class="lad ${c}"><span class="ic">${ang(n)}</span><b>${t}</b></div>`).join('')}`);
  }
  function lobby(){
    const open=soloOpen('pk'),cd=time()<(S.cd.pk||0),okC=!lacks('pk').length,okK=wallet().merit>=MG_MIN.pk;
    let body;
    if(!open) body=`<div class="phead"><h2>🎃 จิ้มฟักทอง</h2><button class="rbtn" id="rb">📜 กติกา</button></div><div style="text-align:center;margin-top:2cqw">${S.rules.emergency||S.rules.solo.pk==='closed'?'🌙 ปิดชั่วคราว แวะมาใหม่นะ':`🌙 เปิด ${hoursText('pk')}<div class="big">อีก ${hm(minsUntil(S.rules.hours.pk[0]))}</div>`}</div>`;
    else body=`<div class="phead"><h2>🎃 จิ้มฟักทอง</h2><button class="rbtn" id="rb">📜 กติกา</button></div>${feePills('pk')}${pills([['✨ กุศล '+fmt(MG_MIN.pk)+'+',okK],['👼 ลุ้นสูงสุด +100,000']])}
      <div style="text-align:center">${cd?`<div>พักก่อนนะ เล่นได้อีกใน</div><div class="big">${mmss(S.cd.pk-time())}</div>`:`<button class="btn orange big-btn" id="go" ${okC&&okK?'':'disabled'}>เริ่มเล่น</button>`}</div>`;
    st.innerHTML=cells()+`<div class="panel slim" style="bottom:4cqw">${body}</div>`;
    st.querySelector('#rb').onclick=showRules;
    const g=st.querySelector('#go');if(g)g.onclick=start;
  }
  async function start(){const out=await cloud('minigames',{type:'pk-start'});if(!out)return;round={...out.state.pk,sel:[],phase:'pop'};
    st.innerHTML=cells()+`<div class="pkhud" id="pkhud">ฟักทองกำลังมาวางบนชั้น…</div><div class="panel" style="bottom:4cqw;text-align:center" id="pkp"></div>`;
    st.querySelector('#pkp').style.display='none';
    const cs=st.querySelectorAll('.pkc');
    cs.forEach((c,i)=>setTimeout(()=>{c.innerHTML=`<img class="pkn" src="${IMG['pk-normal']}" alt="">`;c.classList.add('pop')},120+i*70));
    setTimeout(()=>{round.phase='ready';const p=st.querySelector('#pkp');p.style.display='';p.innerHTML='<button class="btn orange big-btn" id="ready">พร้อมเลือกฟักทอง</button>';p.querySelector('#ready').onclick=pickMode;st.querySelector('#pkhud').textContent='ผลของทุกช่องสุ่มไว้แล้ว ไม่เปลี่ยนจนจบรอบ'},120+16*70+300);
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
    modal(`<h2>${a>=3?'🎉':a===2?'🙂':'😱'} เฉลยแล้ว!</h2><p>คุณได้ฟักทองนางฟ้า <b>${a}</b> ลูก และฟักทองผี <b>${d}</b> ลูก</p>${line}<p class="note">รอบนี้บนชั้นมีฟักทองนางฟ้า ${nA} ลูก จาก 16 ลูก · เล่นรอบต่อไปได้ในอีก ${MG_CD.pk} นาที</p>`,[{t:'ดูชั้นวาง',c:'gray'},{t:'กลับหน้าเกม',f:()=>{round=null;lobby()}}]);
    round.phase='done';
    const p2=st.querySelector('#pkp');p2.style.display='';p2.innerHTML='<button class="btn big-btn" id="again">กลับหน้าเกม</button>';p2.querySelector('#again').onclick=()=>{round=null;lobby()};
  }
  return {title:'🎃 จิ้มฟักทอง',open,close,refresh(){if(!round)lobby()},canLeave(){if(round&&round.phase==='lock'){toast('รอเฉลยก่อนนะ');return false}if(round&&(round.phase==='pick'||round.phase==='ready'||round.phase==='pop')){toast('เลือกฟักทองให้ครบ 4 ลูกก่อนนะ จ่ายเหรียญไปแล้ว');return false}return true}};
})();


/* ---------- ยิงนกฮาโลวีน (fix13: นกร้าย + เอฟเฟกต์ชุดใหม่) ---------- */
GAMES.bs=(()=>{
 const BIRDS=[['ghost','นกผี'],['pumpkin','นกฟักทอง'],['witch','นกแม่มด'],['skeleton','นกโครงกระดูก'],['crow','อีกาสาปแช่ง'],['owl','นกฮูกระเบิด'],['bat','ค้างคาวขโมยกระสุน']];
 const EVIL={4:{val:-3000,col:'#b06bff',info:'จอมืด 2 วิ'},5:{val:-4000,col:'#ff8a3d',info:'ระเบิด นกรอบๆ หายหมด'},6:{val:-2000,col:'#ff4d5e',info:'ขโมยกระสุน ต้องบรรจุใหม่'}};
 const I={};const img=(k,src)=>{const im=new Image();im.src=src;I[k]=im;return im;};BIRDS.forEach(([k])=>img(k,IMG['b-'+k]));img('bg',IMG['bs-bg']);
 let st,cv,cx,W=0,H=0,DPR=1,Q=1,round=null,raf=0,timer=null,ending=false,pendingShot=false,queuedShots=[],syncTimer=null,resTimer=null,tab='val';
 let fx=[],dead=[],combo=0,lastHit=0,shake=0,flash=0,flashCol='#fff',cross={x:.5,y:.3},aimDeg=0,lastFrame=0,fpsA=0,fpsN=0,fpsT=0,hh='';
 const amb=Array.from({length:40},()=>({x:Math.random(),y:rnd(.55,.95),ph:rnd(0,6),s:rnd(.4,1)}));
 const values=()=>round?.values||soloState.offer||{};
 const valOf=(v,i)=>v[i]||(EVIL[i]?{role:'evil',val:EVIL[i].val}:null);
 const q=s=>st?.querySelector(s);
 const elapsed=()=>round?Math.round(time()-round.start):0;
 function showRules(){rules('ยิงนกฮาโลวีน',[['🎯','แตะนกเพื่อยิง','ยิงได้ใน 60 วินาที'],['🎲','ค่านกสุ่มใหม่','ดูค่าก่อนกดเริ่ม'],['⭐','นกนำโชค','ค่าสูงสุด บินเร็ว'],['☠️','นกต้องสาป','โดนแล้วหักกุศล'],['😈','นกร้าย 3 แบบ','บินประกบนกดี ยิ่งท้ายยิ่งเยอะ'],['🔫','กระสุน 6 นัด','บรรจุ 1.5 วินาที'],['🔥','ไม่เกิน 4 นัด/วิ','กดรัวเกินไปปืนร้อน'],['📉','ติดลบสูงสุด','−30,000 · บวกไม่จำกัด'],['☀️','เปิด '+hoursText('bs'),feeText('bs')+' · พัก '+MG_CD.bs+' นาที']]);}
 async function open(){st=stage('bs-bg');st.classList.add('bsstage');await cloud('minigames',{type:'status'});if(CUR!=='bs')return;
  st.innerHTML=`<canvas class="bx-cv"></canvas><img class="bx-gun" src="${IMG.gun}" alt=""><div class="bx-hud bx-hide"><div class="bx-row"><div class="bx-pill">🎯 <b class="bx-cnt">0</b><span class="bx-sep"></span>✨ <b class="bx-sum">0</b></div><div class="bx-time">60</div><div class="bx-pill bx-ammo"></div></div><div class="bx-combo"></div><div class="bx-msg"></div><div class="bx-legend"></div></div><div class="bx-screen bx-lobby"></div><div class="bx-screen bx-res bx-hide"><div class="bx-box"></div></div>`;
  cv=q('.bx-cv');cx=cv.getContext('2d');fit();addEventListener('resize',fit);st.addEventListener('pointerdown',shoot);
  if(soloState.bs?.phase==='active'){round=soloState.bs;play();}else lobby();
  lastFrame=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
  timer=setInterval(()=>{if(!round&&q('.bx-lobby')&&!q('.bx-lobby').classList.contains('bx-hide'))lobbyStatus();},1000);}
 function close(){clearInterval(timer);clearInterval(syncTimer);clearInterval(resTimer);cancelAnimationFrame(raf);raf=0;removeEventListener('resize',fit);st?.removeEventListener('pointerdown',shoot);round=null;st=null;}
 function fit(){if(!st)return;const r=st.getBoundingClientRect();W=r.width||1;H=r.height||1;DPR=Math.min(window.devicePixelRatio||1,Q?2:1.25);cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);}
 /* ---------- lobby: tabs (ค่านก / นกร้าย / กติกา) ---------- */
 const tileH=(src,name,amt,cls,sub,tcls='',tag='')=>`<div class="bx-tile ${tcls}">${tag}${src.startsWith('images/')?`<img src="${src}" alt="">`:`<div class="bx-em">${src}</div>`}<b>${name}</b>${amt?`<span class="bx-amt ${cls}">${amt}</span>`:''}${sub?`<small>${sub}</small>`:''}</div>`;
 function lobby(){round=null;clearInterval(syncTimer);const L=q('.bx-lobby');q('.bx-hud').classList.add('bx-hide');q('.bx-res').classList.add('bx-hide');L.classList.remove('bx-hide');const v=values();
  const val=`<div class="bx-grid">${[0,1,2,3].map(i=>{const x=valOf(v,i);if(!x)return '';return tileH(IMG['bi-'+BIRDS[i][0]],BIRDS[i][1],sgn(x.val),x.val<0?'neg':x.role==='lucky'?'gold':'pos','',x.role,x.role==='lucky'?'<span class="bx-tag l">⭐ นำโชค</span>':x.role==='cursed'?'<span class="bx-tag c">☠️ ต้องสาป</span>':'');}).join('')}</div><div class="bx-sec">🎲 ค่านกสุ่มใหม่ทุกรอบ ดูก่อนกดเริ่ม</div>`;
  const evil=`<div class="bx-sec" style="margin-top:0">😈 ร้ายทุกรอบ · บินประกบนกดี · ยิ่งท้ายยิ่งเยอะ</div><div class="bx-grid three">${[4,5,6].map(i=>tileH(IMG['bi-'+BIRDS[i][0]],BIRDS[i][1],sgn(valOf(v,i).val),'neg',EVIL[i].info,'evil')).join('')}</div>`;
  const how=`<div class="bx-grid three">${tileH('🎯','แตะยิง','60 วิ','pos')}${tileH('🔫','6 นัด','บรรจุ 1.5 วิ','gold')}${tileH('🔥','ไม่เกิน','4 นัด/วิ','neg','รัวไป ปืนร้อน')}${tileH('⚡','ยิงติดกัน','คอมโบ','pos')}${tileH('📈','บวก','ไม่จำกัด','pos','คนเก่งได้เต็ม')}${tileH('📉','ติดลบ','สูงสุด −30,000','neg')}</div>`;
  L.innerHTML=`<div class="bx-wrap"><div class="bx-title"><h1>🐦 ยิงนกฮาโลวีน</h1><p>เล็งให้ดี · นกร้ายบินปนมากับนกดี</p></div><div class="bx-card"><div class="bx-tabs">${[['val','ค่านกรอบนี้'],['evil','นกร้าย'],['how','กติกา']].map(([k,t])=>`<button data-tab="${k}" class="${tab===k?'on':''}">${t}</button>`).join('')}</div><div class="bx-tab">${{val,evil,how}[tab]}</div></div>
   <div class="bx-fee">${[['coin','coin'],['hat','hat'],['mb','mb']].map(([k])=>`<span class="${lacks('bs').includes(k)?'no':''}"><img src="${IMG[k]}" alt="">${feeOf('bs')[k]}</span>`).join('')}<span>⏳ พัก ${MG_CD.bs} นาที</span></div><div class="bx-status"></div><button class="bx-go">🔫 เริ่มยิง</button><button class="bx-rules">📜 กติกาเต็ม</button></div>`;
  L.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;lobby();});L.querySelector('.bx-go').onclick=start;L.querySelector('.bx-rules').onclick=showRules;lobbyStatus();}
 function lobbyStatus(){const s=q('.bx-status'),go=q('.bx-go');if(!s||!go)return;const b=blockers('bs');let h='';
  if(b.length){const x=b[0];h=x.cd?`⏳ พักก่อนนะ ยิงได้อีกใน <b>${mmss(x.cd-time())}</b>`:x.why+(!soloOpen('bs')&&S.rules.solo.bs!=='closed'&&!S.rules.emergency&&!x.cd&&/เปิด/.test(x.why)?` · อีก ${hm(minsUntil(S.rules.hours.bs[0]))}`:'');}
  s.innerHTML=h;s.classList.toggle('bx-hide',!h);go.disabled=!!b.length;}
 async function start(){const out=await cloud('minigames',{type:'bs-start'});if(out?.state?.bs?.phase==='active'){round=out.state.bs;play();}else lobbyStatus();}
 /* ---------- play ---------- */
 function play(){ending=false;queuedShots=[];fx=[];dead=[];combo=0;hh='';clearInterval(syncTimer);syncTimer=setInterval(()=>flushShots(),1500);
  q('.bx-lobby').classList.add('bx-hide');q('.bx-res').classList.add('bx-hide');q('.bx-hud').classList.remove('bx-hide');legend(round.values);hud();if(elapsed()<3000)msg(round.values[4]?'🎯 เล็งให้ดี! นกร้ายบินปนมา':'🎯 เล็งให้ดี!','#ffe08a');}
 function legend(v){const row=list=>list.map(i=>{const x=v[i];return x?`<span class="${x.role}"><img src="${IMG['bi-'+BIRDS[i][0]]}" alt="">${sgn(x.val)}</span>`:'';}).join('');q('.bx-legend').innerHTML=`<div class="bx-lrow">${row([0,1,2,3])}</div>${v[4]?`<div class="bx-lrow evil">${row([4,5,6])}</div>`:''}`;}
 function hud(){if(!round||!st)return;const t=elapsed(),left=Math.max(0,Math.ceil((round.until-time())/1000)),te=q('.bx-time');if(te.textContent!==String(left)){te.textContent=left;te.classList.toggle('hot',left<=10&&left>0);}
  q('.bx-cnt').textContent=round.count;const s=q('.bx-sum');s.textContent=sgn(round.sum);s.className='bx-sum '+(round.sum<0?'neg':'pos');
  let a;if(round.reload&&t<round.reload)a='<small>🔄 บรรจุ…</small>';else{const n=round.reload&&round.reload<=t?6:round.ammo;a=[...Array(6)].map((_,i)=>`<i class="${i<n?'':'u'}"></i>`).join('');}
  if(a!==hh){hh=a;q('.bx-ammo').innerHTML=a;}}
 function msg(t,c){const m=q('.bx-msg');if(!m)return;m.textContent=t;m.style.setProperty('--mc',c||'#000');m.style.color=c||'#fff';m.classList.remove('on');void m.offsetWidth;m.classList.add('on');}
 function showCombo(){const c=q('.bx-combo');if(!c)return;if(combo<2){c.classList.remove('on');return;}c.textContent='คอมโบ ×'+combo+(combo>=5?' 🔥':'');c.classList.remove('on');void c.offsetWidth;c.classList.add('on');}
 function aim(px,py){const g=q('.bx-gun'),gx=W*.482,gy=H;let a=Math.atan2(px-gx,gy-py)*180/Math.PI;a=clamp(a,-12,12);aimDeg=a;g?.animate([{transform:`rotate(${a}deg) translateY(3%)`},{transform:`rotate(${a}deg)`}],{duration:170,easing:'ease-out',fill:'forwards'});return gunTip();}
 function gunTip(){const L=H*.30,gx=W*.482;return {x:gx+Math.sin(aimDeg*Math.PI/180)*L,y:H-Math.cos(aimDeg*Math.PI/180)*L};}
 function shoot(ev){if(!round||ending||time()>=round.until||q('.bx-hud').classList.contains('bx-hide'))return;ev.preventDefault();const r=st.getBoundingClientRect(),px=ev.clientX-r.left,py=ev.clientY-r.top,x=px/W,y=py/H,t=elapsed();if(x<0||x>1||y<0||y>1)return;const shot={x,y,t};cross={x,y};
  let res;try{const next=structuredClone(round);res=fireBird(next,shot);round=next;queuedShots.push(shot);}catch(e){msg(/ร้อน/.test(e.message)?'🔥 ปืนร้อน! กดรัวเกินไป':/บรรจุ/.test(e.message)?'🔄 กำลังบรรจุกระสุน…':e.message,'#ffb347');return;}
  const tip=aim(px,py);fx.push({k:'flash',x:tip.x,y:tip.y,t:0,life:.12});fx.push({k:'trail',x0:tip.x,y0:tip.y,x:px,y:py,t:0,life:.16});fx.push({k:'ring',x:px,y:py,hit:!!res.hit,t:0,life:.3});flash=Math.max(flash,.09);flashCol='#ffd890';
  for(let i=0;i<4;i++)fx.push({k:'spark',x:tip.x,y:tip.y,vx:rnd(-1,1)*W*.25,vy:-rnd(.2,1)*W*.3,t:0,life:rnd(.15,.3),c:'#ffe7a0'});
  const h=res.hit;
  if(h){const p=birdPosition(h,t)||{x,y,dir:1},v=round.values[h.type],X=p.x*W,Y=p.y*H;kill(h,p,0);burst(X,Y,v,h.type);
   if(v.role==='evil'){combo=0;showCombo();
    if(h.type===4){msg('🐦‍⬛ อีกาสาปแช่ง! มืด 2 วิ','#c79bff');for(let i=0;i<16;i++)fx.push({k:'smoke',x:X+rnd(-1,1)*W*.06,y:Y+rnd(-1,1)*W*.04,r:W*rnd(.04,.08),c:'#3a1660',t:0,life:rnd(.8,1.4)});}
    if(h.type===5){msg('💥 นกฮูกระเบิด!'+(res.blown.length?' ลูกหลง '+res.blown.length+' ตัว':''),'#ff9d3c');shake=.6;flash=.5;flashCol='#ff8a3d';boom(X,Y);res.blown.forEach(b=>{const qp=birdPosition(b,t);if(qp)kill(b,qp,1,X,Y);});}
    if(h.type===6){msg('🦇 กระสุนโดนขโมย!','#ff6b81');const g=gunTip();for(let i=0;i<6;i++)fx.push({k:'bullet',x0:g.x+rnd(-1,1)*W*.04,y0:g.y,x:X,y:Y,t:-i*.05,life:.45});}
    shake=Math.max(shake,.32);}
   else if(v.val<0){combo=0;showCombo();msg('☠️ โดนนกต้องสาป!','#ff6b81');shake=.35;flash=.3;flashCol='#ff3b5c';}
   else{combo=Date.now()-lastHit<1500?combo+1:1;lastHit=Date.now();showCombo();if(v.role==='lucky'){msg('⭐ นกนำโชค!','#ffd27a');flash=Math.max(flash,.18);flashCol='#ffe08a';}}}
  hud();if(queuedShots.length>=8)flushShots();}
 function kill(b,p,blown,bx,by){const a=blown?Math.atan2(p.y*H-by,p.x*W-bx):0;dead.push({type:b.type,x:p.x*W,y:p.y*H,dir:p.dir||1,vx:blown?Math.cos(a)*W*.5:rnd(-1,1)*W*.04,vy:blown?Math.sin(a)*W*.5-W*.2:-W*.08,rot:0,vr:(blown?rnd(6,12):rnd(3,6))*(Math.random()<.5?-1:1),t:0,burnt:blown});}
 function burst(x,y,v,type){const lucky=v.role==='lucky',bad=v.val<0,col=type>=4?EVIL[type].col:null;
  const cols=type===5?['#ffb347','#ff6b2d','#ffe08a']:type===6?['#ff4d5e','#2a0a14','#ff9db0']:type===4?['#b06bff','#3a1660','#e0c4ff']:bad?['#5b4a7a','#3a2f52','#8f7fb0']:lucky?['#FFE07A','#FFC93C','#FFF3B0','#ffffff']:['#c9a8ff','#fff3b0','#ffd36e','#e9dcff'];
  for(let i=0;i<6;i++)fx.push({k:'smoke',x:x+rnd(-1,1)*W*.03,y:y+rnd(-1,1)*W*.02,r:W*rnd(.03,.05),c:bad?'#2c2140':'#a58bd6',t:0,life:.7});
  for(let i=0;i<(lucky?24:14)*(Q?1:.5);i++){const a=Math.random()*6.28,s=W*rnd(.12,.3);fx.push({k:'puff',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,g:H*.08,r:W*rnd(.008,.02),c:pick(cols),t:0,life:rnd(.4,.7)});}
  for(let i=0;i<6;i++)fx.push({k:'feather',x,y,vx:rnd(-1,1)*W*.12,vy:rnd(-1,.2)*W*.12,ph:Math.random()*6,c:bad?'#3a2f52':'#ffffff',t:0,life:1.1});
  if(!bad)for(let i=0;i<(lucky?7:3);i++)fx.push({k:'star',x,y,vx:rnd(-1,1)*W*.2,vy:rnd(-1,.3)*W*.2,c:lucky?'#FFE07A':'#fff',t:0,life:.8});
  fx.push({k:'glow',x,y,r:W*(lucky?.22:.14),c:col||(bad?'#ff3b5c':lucky?'#ffd27a':'#d6c2ff'),t:0,life:.35});
  fx.push({k:'txt',x,y:y-H*.02,s:sgn(v.val),c:bad?'#ff8a8a':lucky?'#FFE07A':'#ffffff',big:lucky||type>=4,t:0,life:1.1});}
 function boom(x,y){fx.push({k:'shock',x,y,t:0,life:.55});fx.push({k:'glow',x,y,r:W*.45,c:'#ff8a3d',t:0,life:.5});
  for(let i=0;i<(Q?36:18);i++){const a=Math.random()*6.28,s=W*rnd(.15,.5);fx.push({k:'fire',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:W*rnd(.02,.05),t:0,life:rnd(.35,.7)});}
  for(let i=0;i<10;i++)fx.push({k:'smoke',x:x+rnd(-1,1)*W*.08,y:y+rnd(-1,1)*W*.05,r:W*rnd(.05,.1),c:'#2a1a1a',t:0,life:rnd(.9,1.5)});}
 /* ---------- drawing ---------- */
 function glow(x,y,r,col,a){if(r<=0||a<=0)return;const g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');cx.save();cx.globalAlpha=a;cx.globalCompositeOperation='lighter';cx.fillStyle=g;cx.fillRect(x-r,y-r,r*2,r*2);cx.restore();}
 function drawBird(type,x,y,dir,frame,alpha,rot,h){const im=I[BIRDS[type]?.[0]];if(!im||!im.complete||!im.naturalWidth)return;const fw=im.naturalWidth/4,fh=im.naturalHeight/4,w=h*fw/fh;cx.save();cx.globalAlpha=alpha;cx.translate(x,y);if(rot)cx.rotate(rot);cx.scale(dir,1);cx.drawImage(im,(frame%4)*fw,Math.floor(frame/4)*fh,fw,fh,-w/2,-h/2,w,h);cx.restore();}
 function render(dt){const sec=performance.now()/1000;cx.setTransform(DPR,0,0,DPR,0,0);cx.clearRect(0,0,W,H);
  const sk=shake>0?shake*W*.03:0;cx.save();cx.translate(rnd(-sk,sk),rnd(-sk,sk));
  if(I.bg.complete&&I.bg.naturalWidth)cx.drawImage(I.bg,-6,-6,W+12,H+12);
  // moonlight, drifting fog, fireflies, torches
  glow(W*.78,H*.068,W*.32*(1+.04*Math.sin(sec*1.3)),'rgba(190,205,255,1)',.28);
  cx.save();cx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){const fy=H*(.47+i*.03),fxp=((sec*.012*(i+1)+i*.3)%1.4-.2)*W;const g=cx.createRadialGradient(fxp,fy,0,fxp,fy,W*.55);g.addColorStop(0,'rgba(140,120,220,.10)');g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.fillRect(fxp-W*.55,fy-W*.3,W*1.1,W*.6);}cx.restore();
  if(Q)for(const a of amb){const x=(a.x+Math.sin(sec*.3+a.ph)*.02)*W,y=(a.y+Math.sin(sec*.5+a.ph*2)*.01)*H,k=.5+.5*Math.sin(sec*2+a.ph);glow(x,y,W*.012*a.s+1,'rgba(255,214,120,1)',.5*k);}
  glow(W*.06,H*.56,W*.2,'rgba(255,140,40,1)',.22+.05*Math.sin(sec*3));glow(W*.94,H*.56,W*.2,'rgba(255,140,40,1)',.22+.05*Math.sin(sec*3+1));
  if(round&&round.phase==='active'){const el=elapsed();for(const b of round.flights){if(round.killed.includes(b.id))continue;const p=birdPosition(b,el);if(!p)continue;const X=p.x*W,Y=p.y*H,v=round.values[b.type]||{},h=H*(b.type===5?.08:.075),frame=Math.floor(el/70+b.phase*5)%16;
    if(v.role==='lucky'){glow(X,Y,h*1.1,'rgba(255,215,120,1)',.35*p.vis);if(Math.random()<.25*Q)fx.push({k:'star',x:X+rnd(-1,1)*h*.5,y:Y+rnd(-1,1)*h*.3,vx:0,vy:-W*.03,c:'#ffe7a0',t:0,life:.6,sm:1});}
    if(b.type===4){glow(X,Y,h*.9,'rgba(150,70,255,1)',.22);if(Math.random()<.35*Q)fx.push({k:'smoke',x:X-p.dir*h*.4,y:Y+rnd(-1,1)*h*.15,r:h*rnd(.15,.3),c:'#5b2a99',t:0,life:.7});}
    if(b.type===5){const k=.5+.5*Math.sin(sec*14);glow(X+p.dir*h*.05,Y-h*.42,h*.5,'rgba(255,180,60,1)',.35+.35*k);glow(X,Y,h*.9,'rgba(255,110,40,1)',.12+.08*k);if(Math.random()<.5*Q)fx.push({k:'spark',x:X+p.dir*h*.05,y:Y-h*.45,vx:rnd(-1,1)*W*.06,vy:-rnd(.2,1)*W*.08,t:0,life:rnd(.2,.4),c:'#ffd27a'});}
    if(b.type===6){glow(X+p.dir*h*.25,Y-h*.05,h*.35,'rgba(255,40,60,1)',.35+.15*Math.sin(sec*8));if(Math.random()<.25*Q)fx.push({k:'smoke',x:X-p.dir*h*.4,y:Y,r:h*rnd(.1,.2),c:'#5a0c1c',t:0,life:.5});}
    drawBird(b.type,X,Y,p.dir,frame,p.vis,0,h);}}
  // shot birds tumble down; owl-blast victims fly outward, burnt
  for(let i=dead.length-1;i>=0;i--){const d=dead[i];d.t+=dt;if(d.t>1.4||d.y>H*1.1){dead.splice(i,1);continue;}d.vy+=H*1.4*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.rot+=d.vr*dt;const h=H*.075;
   if(d.burnt){cx.save();cx.filter='brightness(.35)';}drawBird(d.type,d.x,d.y,d.dir,5,Math.max(0,1-d.t/1.4),d.rot,h*(1-d.t*.25));if(d.burnt){cx.restore();if(Math.random()<.4)fx.push({k:'smoke',x:d.x,y:d.y,r:h*.2,c:'#3a2a2a',t:0,life:.5});}}
  drawFx(dt);
  // crow: darkness with a small light around the aim
  if(round&&round.dark&&elapsed()<round.dark){const left=(round.dark-elapsed())/2000,a=Math.min(1,left*4,(1-left)*8+.3);const lx=cross.x*W,ly=cross.y*H,r=W*.24;const g=cx.createRadialGradient(lx,ly,r*.2,lx,ly,r);g.addColorStop(0,'rgba(18,0,40,0)');g.addColorStop(1,'rgba(18,0,40,.9)');cx.save();cx.globalAlpha=a;cx.fillStyle=g;cx.fillRect(0,0,W,H);cx.restore();}
  const vg=cx.createRadialGradient(W/2,H*.42,W*.35,W/2,H*.5,H*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(6,2,18,.55)');cx.fillStyle=vg;cx.fillRect(0,0,W,H);
  cx.restore();
  if(flash>0){cx.save();cx.globalAlpha=Math.min(.45,flash);cx.globalCompositeOperation='lighter';cx.fillStyle=flashCol;cx.fillRect(0,0,W,H);cx.restore();}
  if(round&&round.phase==='active'&&round.reload&&elapsed()<round.reload){const k=1-(round.reload-elapsed())/1500,g=gunTip();cx.save();cx.lineWidth=5;cx.strokeStyle='rgba(255,255,255,.25)';cx.beginPath();cx.arc(g.x,g.y-W*.05,W*.05,0,6.3);cx.stroke();cx.strokeStyle='#ffd27a';cx.beginPath();cx.arc(g.x,g.y-W*.05,W*.05,-Math.PI/2,-Math.PI/2+clamp(k,0,1)*6.283);cx.stroke();cx.restore();}}
 function drawFx(dt){fx=fx.filter(f=>(f.t+=dt)<f.life);if(fx.length>500)fx=fx.slice(-500);for(const f of fx){if(f.t<0)continue;const k=f.t/f.life;cx.save();cx.globalAlpha=Math.max(0,1-k);
   if(f.k==='puff'){cx.fillStyle=f.c;cx.beginPath();cx.arc(f.x+f.vx*f.t,f.y+f.vy*f.t+f.g*f.t*f.t,f.r*(1+k*1.2),0,7);cx.fill();}
   else if(f.k==='smoke'){cx.globalAlpha=(1-k)*.55;const r=f.r*(.6+k*1.6),y=f.y-k*H*.02;const g=cx.createRadialGradient(f.x,y,0,f.x,y,r);g.addColorStop(0,f.c);g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.fillRect(f.x-r,y-r,r*2,r*2);}
   else if(f.k==='feather'){cx.translate(f.x+f.vx*f.t+Math.sin(f.t*9+f.ph)*W*.012,f.y+f.vy*f.t+H*.05*f.t*f.t);cx.rotate(Math.sin(f.t*7+f.ph)*.9);cx.fillStyle=f.c;cx.beginPath();cx.ellipse(0,0,W*.012,W*.004,0,0,7);cx.fill();}
   else if(f.k==='star'){cx.globalCompositeOperation='lighter';cx.translate(f.x+f.vx*f.t,f.y+f.vy*f.t);cx.rotate(f.t*6);cx.fillStyle=f.c;cx.font=`${W*(f.sm?.03:.05)}px serif`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText('✦',0,0);}
   else if(f.k==='spark'){cx.globalCompositeOperation='lighter';cx.fillStyle=f.c;cx.beginPath();cx.arc(f.x+f.vx*f.t,f.y+f.vy*f.t+H*.2*f.t*f.t,Math.max(.8,W*.006*(1-k)),0,7);cx.fill();}
   else if(f.k==='fire'){cx.globalCompositeOperation='lighter';const x=f.x+f.vx*f.t,y=f.y+f.vy*f.t-H*.05*f.t,r=f.r*(1+k);const g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,240,180,.95)');g.addColorStop(.4,'rgba(255,140,40,.8)');g.addColorStop(1,'rgba(120,20,0,0)');cx.fillStyle=g;cx.fillRect(x-r,y-r,r*2,r*2);}
   else if(f.k==='shock'){cx.globalCompositeOperation='lighter';cx.strokeStyle='rgba(255,200,120,'+(1-k)+')';cx.lineWidth=W*.02*(1-k)+1;cx.beginPath();cx.ellipse(f.x,f.y,W*BIRD_BLAST.rx*1.1*k+4,H*BIRD_BLAST.ry*1.1*k+4,0,0,7);cx.stroke();}
   else if(f.k==='glow'){cx.globalAlpha=1;glow(f.x,f.y,f.r*(1+k*.5),f.c,(1-k)*.8);}
   else if(f.k==='bullet'){const kk=clamp(f.t/f.life,0,1),x=f.x0+(f.x-f.x0)*kk,y=f.y0+(f.y-f.y0)*kk-Math.sin(kk*Math.PI)*H*.08;cx.globalAlpha=1-kk*.3;cx.translate(x,y);cx.rotate(kk*12);cx.fillStyle='#ffcf5a';cx.fillRect(-W*.006,-W*.016,W*.012,W*.032);cx.fillStyle='#c27a18';cx.fillRect(-W*.006,W*.006,W*.012,W*.01);}
   else if(f.k==='txt'){const s=1+.35*Math.max(0,1-k*4);cx.translate(f.x,f.y-k*H*.06);cx.scale(s,s);cx.font=`800 ${W*(f.big?.075:.055)}px Itim,Mali,system-ui`;cx.textAlign='center';cx.lineWidth=5;cx.strokeStyle='#2A2140';cx.fillStyle=f.c;cx.strokeText(f.s,0,0);cx.fillText(f.s,0,0);}
   else if(f.k==='flash'){cx.globalCompositeOperation='lighter';const g=cx.createRadialGradient(f.x,f.y,0,f.x,f.y,W*.11*(1-k*.5));g.addColorStop(0,'rgba(255,255,230,1)');g.addColorStop(.35,'rgba(255,214,90,.9)');g.addColorStop(1,'rgba(255,140,40,0)');cx.fillStyle=g;cx.beginPath();cx.arc(f.x,f.y,W*.11,0,7);cx.fill();}
   else if(f.k==='trail'){cx.globalAlpha=(1-k)*.8;cx.strokeStyle='#FFF2B0';cx.lineWidth=W*.008*(1-k);cx.lineCap='round';cx.beginPath();cx.moveTo(f.x0,f.y0);cx.lineTo(f.x0+(f.x-f.x0)*Math.min(1,k*3+.4),f.y0+(f.y-f.y0)*Math.min(1,k*3+.4));cx.stroke();}
   else if(f.k==='ring'){cx.strokeStyle=f.hit?'#FFE07A':'#fff';cx.lineWidth=2.5;const rr=W*.035+k*W*.025;cx.beginPath();cx.arc(f.x,f.y,rr,0,7);cx.stroke();cx.beginPath();cx.moveTo(f.x-rr*1.5,f.y);cx.lineTo(f.x-rr*.5,f.y);cx.moveTo(f.x+rr*.5,f.y);cx.lineTo(f.x+rr*1.5,f.y);cx.moveTo(f.x,f.y-rr*1.5);cx.lineTo(f.x,f.y-rr*.5);cx.moveTo(f.x,f.y+rr*.5);cx.lineTo(f.x,f.y+rr*1.5);cx.stroke();}
   cx.restore();}}
 function loop(ts){if(!st)return;raf=requestAnimationFrame(loop);const dt=Math.min(.05,(ts-lastFrame)/1000||0);lastFrame=ts;shake=Math.max(0,shake-dt);flash=Math.max(0,flash-dt*1.6);
  if(round&&round.phase==='active'){hud();if(time()>=round.until&&!ending&&!pendingShot){ending=true;setTimeout(end,700);}}
  render(dt);
  // Automatic quality: slow phones drop fireflies, resolution and particle counts.
  fpsA+=dt;fpsN++;fpsT+=dt;if(fpsT>2.5){if(fpsN/fpsA<42&&Q){Q=0;fit();}fpsA=0;fpsN=0;fpsT=0;}}
 async function flushShots(){if(!round||pendingShot||!queuedShots.length)return !queuedShots.length;pendingShot=true;const batch=queuedShots.slice(0,40),id=round.id;const out=await cloud('minigames',{type:'bs-shots',round:id,shots:batch});if(out&&round?.id===id){queuedShots.splice(0,batch.length);const local=round;round=structuredClone(out.state.bs);round.dark=Math.max(round.dark||0,local.dark||0);for(const shot of queuedShots){try{fireBird(round,shot);}catch{}}hud();}pendingShot=false;return !!out;}
 async function end(){if(!round)return;if(queuedShots.length&&!await flushShots()){ending=false;setTimeout(()=>{if(round&&!ending){ending=true;end();}},1500);return;}clearInterval(syncTimer);const out=await cloud('minigames',{type:'bs-finish',round:round.id});if(!out){setTimeout(()=>{if(round)end();},2000);return;}round=out.state.bs;result(round);}
 function result(r){q('.bx-hud').classList.add('bx-hide');const g=r.gain??birdGain(r),cap=(r.hits?.length||4)>4?-30000:-10000;
  const row=(src,lb,sub,v,cls)=>`<div class="bx-r"><img src="${src}" alt=""><div class="lb">${lb}${sub?'<small>'+sub+'</small>':''}</div><div class="v ${cls}">${v}</div></div>`;
  let rows='';(r.hits||[]).forEach((n,i)=>{if(!n||!BIRDS[i])return;const v=r.values[i]||{val:0},sub=v.role==='lucky'?'⭐ นกนำโชค':v.role==='cursed'?'☠️ นกต้องสาปรอบนี้':v.role==='evil'?'😈 '+EVIL[i].info:'';rows+=row(IMG['bi-'+BIRDS[i][0]],BIRDS[i][1]+' ×'+n,sub,sgn(v.val*n),v.val<0?'neg':'pos');});
  if(r.blown)rows+=row(IMG['bi-owl'],'โดนระเบิดลูกหลง ×'+r.blown,'ไม่ได้แต้ม','0','dim');
  if(r.sum<cap)rows+=row(IMG['bi-crow'],'เพดานติดลบ','ลบได้มากสุด '+sgn(cap),sgn(cap-r.sum),'pos');
  const R=q('.bx-res');R.classList.remove('bx-hide');R.querySelector('.bx-box').innerHTML=`<h2>⏰ หมดเวลา!</h2><div class="bx-sub">ยิงโดน <b>${r.count}</b> ตัว · ยิงไป ${r.shots||0} นัด</div><div class="bx-rows">${rows||'<div class="bx-r"><div class="lb">ยังไม่โดนนกเลย</div><div class="v dim">0</div></div>'}</div><div class="bx-total ${g>=0?'pos':'neg'}"><span>รวมกุศล</span><b>${sgn(g)}</b></div><div class="bx-hint">${g>0?'📮 กุศลส่งเข้าไปรษณีย์แล้ว':g<0?'หักจากกุศลแล้ว (ไม่ต่ำกว่า 0)':'ไม่มีผลกับกุศล'} · พัก ${MG_CD.bs} นาที</div><button class="bx-go" id="bxBack">🎮 กลับหน้ายิงนก (<span id="bxBc">30</span>)</button>`;
  let n=30;clearInterval(resTimer);resTimer=setInterval(()=>{n--;const c=q('#bxBc');if(c)c.textContent=n;if(n<=0){clearInterval(resTimer);lobby();}},1000);R.querySelector('#bxBack').onclick=()=>{clearInterval(resTimer);lobby();};renderWallet();}
 return{title:'🐦 ยิงนกฮาโลวีน',open,close,busy:()=>!!round&&round.phase==='active',refresh(){if(!round)lobby();},canLeave(){if(round&&round.phase==='active'){modal('<h2>ออกจากลานยิง?</h2><p>ผลที่ยิงสำเร็จบันทึกบนคลาวด์แล้ว เวลาในรอบยังเดินต่อ กลับมารับผลรอบเดิมได้</p>',[{t:'เล่นต่อ'},{t:'ออก',c:'gray',f:closeGame}]);return false;}return true;}};
})();

/* ---------- ไพ่แคง (fix13: นั่ง → พร้อม/ออก · ครบ 4 นับ 10 วิ · ผล 30 วิ แล้วล้างห้อง) ---------- */
GAMES.kang=(()=>{
  const RL=['','A','2','3','4','5','6','7','8','9','10','J','Q','K'],RK=['','a','2','3','4','5','6','7','8','9','10','j','q','k'],SY={spade:'♠',heart:'♥',diamond:'♦',club:'♣'};
  const cimg=c=>IMG[`k-${c.s}-${RK[c.r]}`],lbl=c=>RL[c.r]+SY[c.s],pts=h=>h.reduce((s,c)=>s+Math.min(c.r,10),0);
  const REASON={KANG:'📢 แคงสำเร็จ',KANG_FAIL:'😵 แคงล่ม',KNOCK:'💥 น็อค! ไพ่หมดมือ',DECK_OUT:'🃏 กองจั่วหมด',OPEN_TRIPLE:'🎴 ตองเปิด',OPEN_FOUR:'🎴 สี่ใบเปิด',LAST_PLAYER:'🏳️ เหลือคนสุดท้าย',VOID:'⛔ ยกเลิกรอบ คืนทุนแล้ว',FORFEIT:'🏳️ ยอมแพ้'};
  const POS=[{a:[50,63.5]},{a:[10,49],c:[21,49],v:1},{a:[50,26.5],c:[50,37.5]},{a:[90,49],c:[79,49],v:1}];
  let st=null,root=null,cur=null,pub=[null,null],hand=null,stops=[],tickIv=null,sel=[],lastH='',ticked={},wasSeated=false,lastState='',resultShown='',pileKey='',dealt=new Set(),lastFlow=undefined;
  const me=()=>pub[cur]?.seats?.findIndex(s=>s?.uid===Host.uid)??-1;
  const seatedIn=()=>[0,1].find(i=>pub[i]?.seats?.some(s=>s?.uid===Host.uid)&&pub[i].state!=='result');
  function stop(){stops.forEach(f=>f?.());stops=[];}
  function watchRooms(rooms){stop();for(const i of rooms){stops.push(Host.watchWorld('kang-'+i,d=>{if(!d)return;pub[i]=d;onRoom(i);}));}
    if(cur!=null)stops.push(Host.watchGameView('kang-'+cur,d=>{hand=d;if(cur!=null)draw();}));}
  async function open(){st=stage('kg-bg');st.classList.add('kgstage');st.innerHTML='<div class="kx"><div class="kx-lobby kx-on"></div><div class="kx-table"></div></div>';root=st.querySelector('.kx');
    await cloud('minigames',{type:'status'});if(CUR!=='kang')return;cur=null;watchRooms([0,1]);lobby();clearInterval(tickIv);tickIv=setInterval(clockTick,250);}
  function close(){stop();clearInterval(tickIv);cur=null;st=null;root=null;pub=[null,null];hand=null;}
  function onRoom(i){
    if(cur==null){const s=seatedIn();if(s!=null){enter(s);return;}lobby();return;}
    if(i!==cur)return;const r=pub[cur],m=me();
    if(m<0){ // off the table: cleared after a round, freed for not being ready, or the owner cleared the room
      if(lastState&&lastState!=='waiting'){finishToHub('🧹 ล้างห้องแล้ว ทุกคนกลับหน้ามินิเกม');return;}
      if(wasSeated)toast('🪑 ลุกจากที่นั่งแล้ว (ไม่ได้กดพร้อมใน 60 วิ หรือเจ้าของเคลียร์ห้อง)');
      wasSeated=false;cur=null;lastState='';watchRooms([0,1]);lobby();return;}
    wasSeated=true;
    if(r.state==='playing'&&lastState!=='playing'){dealt.clear();setTimeout(()=>st&&window.miniTableEffect?.(st,'🃏 เริ่มรอบ '+r.round+'!',[]),150);}
    if(r.state==='result'&&resultShown!==cur+'-'+r.round){resultShown=cur+'-'+r.round;S.kgHist=(r.hist||[]).map(h=>'รอบ '+h.round+' · '+esc(h.winner||'ไม่มีผู้ชนะ')+' · '+(REASON[h.why]||esc(h.why)));
      const n=r.net?.[m]||0;if(n>0)confetti();toast(n>0?'🎉 ได้ '+sgn(n)+' กุศล · ส่งเข้าไปรษณีย์':n<0?'เสีย '+sgn(n)+' กุศล':'เสมอตัว');}
    flowFxCheck(r);lastState=r.state;draw();}
  function finishToHub(msg){toast(msg);cur=null;lastState='';wasSeated=false;if(CUR==='kang')closeGame();}
  /* Only when a server deadline has passed does anyone call 'tick' (staggered by seat, once per deadline). */
  function due(r,i){const m=r.seats?.findIndex(s=>s?.uid===Host.uid)??-1,out=[];const seat=m<0?6:m;
    if(r.state==='countdown')out.push({key:'c'+r.startAt,at:r.startAt+seat*700});
    if(r.state==='waiting')(r.seats||[]).forEach((s,k)=>{if(s&&!r.ready[k]&&r.seatAt?.[k])out.push({key:'w'+k+'-'+r.seatAt[k],at:r.seatAt[k]+KANG.readyMs+(k===m?0:1500+seat*700)});});
    if(r.state==='playing')out.push({key:'p'+r.round+'-'+r.turnNo,at:r.deadline+(m<0?9000:r.cur===m?300:1800+((m-r.cur+4)%4)*1500)});
    if(r.state==='result'&&r.endAt)out.push({key:'r'+r.round+'-'+r.endAt,at:r.endAt+seat*700});
    if(m<0)out.forEach(d=>d.at+=15000);   // lobby viewers only help when a table has been stuck for a while
    return out;}
  async function clockTick(){if(!root)return;timers();if(acting)return;const now=time();
    for(const i of cur!=null?[cur]:[0,1]){const r=pub[i];if(!r)continue;for(const d of due(r,i)){if(now<d.at)continue;const k=i+':'+d.key;if(ticked[k]&&now-ticked[k]<5000)continue;ticked[k]=now;
      const out=await cloud('kang',{type:'tick',room:i});if(out?.room){pub[i]=out.room;onRoom(i);}return;}}}
  async function act(input){if(cur==null)return null;const r=pub[cur];const out=await cloud('kang',{room:cur,...(r?.state==='playing'?{round:r.round,turn:r.turnNo}:{}),...input});if(out?.room&&cur!=null){pub[cur]=out.room;hand={hand:out.mine,round:out.room.round,turn:out.room.turnNo??0};if(out.late)toast('หมดเวลาแล้ว ระบบเล่นตานั้นแทน');onRoom(cur);}return out;}
  /* ---------- lobby ---------- */
  function lobby(){if(!root)return;cur=null;sel=[];lastH='';show('lobby');const w=wallet(),f=feeOf('kang'),rest=(S.streak.rest||0)>time(),closed=S.rules.off('kang'),now=time();
    const left=rest?0:Math.max(0,KANG.rounds-(now-(S.streak.at||0)>KANG.restMs?0:(S.streak.n||0)));
    const rooms=[0,1].map(i=>{const r=pub[i]||S.kang[i]||{},seats=r.seats?r.seats.filter(Boolean).length:(r.seated||0),base=r.base||[10000,50000][i];
      const free=r.state==='waiting'||!r.state||r.state==='result'&&now>=(r.endAt||0);const label=closed?'ปิดชั่วคราว':free?(seats>=4?'เต็ม':'ว่าง'):r.state==='countdown'?'กำลังจะเริ่ม':r.state==='result'?'ขึ้นผล':'กำลังเล่น';
      return `<div class="kx-room"><div class="kx-rh"><b>ห้อง ${i+1}</b><span class="kx-seats">${[0,1,2,3].map(k=>`<i class="${(r.seats?r.seats[k]:k<seats)?'on':''}"></i>`).join('')} ${free&&r.state==='result'?0:seats}/4</span></div>
       <div class="kx-facts"><div><small>ทุนต่อแต้ม</small><b>${fmt(base)}</b></div><div><small>กุศลขั้นต่ำ</small><b class="${w.merit<base*8?'kx-no':''}">${fmt(base*8)}</b></div><div><small>สถานะ</small><b>${label}</b></div></div>
       <button class="kx-go sm" data-sit="${i}" ${closed||rest||!free||seats>=4&&r.state!=='result'?'disabled':''}>🪑 นั่งห้องนี้</button>${S.owner?`<button class="kx-btn2 sm" data-kclear="${i}">🧹 เคลียร์ห้อง</button>`:''}</div>`;}).join('');
    const L=root.querySelector('.kx-lobby');
    L.innerHTML=`<div class="kx-wrap"><div class="kx-title"><h1>🃏 ไพ่แคง</h1><p>4 คน · ใครแต้มน้อยสุดชนะ</p></div>
     <div class="kx-wallet"><span><img src="${IMG.coin}" alt="">${fmt(w.coin)}</span><span><img src="${IMG.hat}" alt="">${fmt(w.hat)}</span><span><img src="${IMG.mb}" alt="">${fmt(w.mb)}</span><span class="m">✨ ${fmt(w.merit)}</span></div>
     <div class="kx-rooms">${rooms}</div>
     <div class="kx-feeRow">${[['coin',f.coin],['hat',f.hat],['mb',f.mb]].map(([k,n])=>`<span class="${lacks('kang').includes(k)?'no':''}"><img src="${IMG[k]}" alt="">${n}</span>`).join('')}<span>ต่อตา</span></div>
     <div class="kx-restBox ${rest?'wait':''}">${closed?'🔒 ห้องไพ่แคงปิดชั่วคราว':rest?`⏳ พักก่อนนะ เล่นได้อีกใน <b data-kcd="${S.streak.rest}">${mmss(S.streak.rest-now)}</b>`:`🔁 เล่นได้อีก <b>${left}</b> ตา แล้วพัก ${KANG.restMs/60000} นาที`}</div>
     <div class="kx-rulesg">${[['🃏','แจกคนละ 5 ใบ','ตาเราจั่ว 1 แล้วทิ้ง'],['🎯','แต้มน้อยสุดชนะ','A=1 · J Q K=10'],['📢','แคง','ก่อนจั่ว ถ้ามั่นใจว่าน้อยสุด'],['💧','ไหล','ทิ้งเลขเดียวกับคนก่อนหน้า'],['💥','น็อค','ไพ่หมดมือ ได้ 2 เท่า'],['⏱️','ตาละ 20 วิ','ช้าไป ระบบเล่นแทน']].map(([e,b,s])=>`<div><span>${e}</span><b>${b}</b><small>${s}</small></div>`).join('')}</div>
     <button class="kx-btn2" id="kxRules">📜 กติกาและอัตราจ่ายเต็ม</button></div>`;
    L.querySelectorAll('[data-sit]').forEach(b=>b.onclick=()=>sit(+b.dataset.sit));L.querySelectorAll('[data-kclear]').forEach(b=>b.onclick=async()=>{const out=await clearKangRoom(+b.dataset.kclear);if(out?.room){pub[+b.dataset.kclear]=out.room;lobby();}});
    L.querySelector('#kxRules').onclick=()=>ruleModal(pub[0]?.base||10000);}
  async function sit(i){const out=await cloud('kang',{type:'join',room:i});if(!out?.room)return;pub[i]=out.room;enter(i);}
  function enter(i){cur=i;sel=[];lastH='';resultShown=pub[i]?.state==='result'?i+'-'+pub[i].round:'';lastState=pub[i]?.state||'';wasSeated=true;hand=null;watchRooms([i]);show('table');draw();}
  function show(id){root?.querySelector('.kx-lobby').classList.toggle('kx-on',id==='lobby');root?.querySelector('.kx-table').classList.toggle('kx-on',id==='table');}
  async function ready(){const out=await act({type:'ready'});if(out?.room&&!out.notice){const f=feeOf('kang');toast(`💸 หัก 🪙${f.coin} · 👒${f.hat} · 🎵${f.mb} · ทุน ${fmt(out.room.base*8)}`);}}
  async function leave(){const r=pub[cur],m=me(),paid=r&&m>=0&&r.ready[m];const out=await act({type:'leave'});if(!out)return;if(paid)toast('↩️ คืนค่าเข้าและทุนครบแล้ว');wasSeated=false;cur=null;lastState='';watchRooms([0,1]);lobby();}
  function tapCard(id){const r=pub[cur],m=me(),my=myHand();const c=my.find(x=>x.id===id);if(!c)return;if(sel.includes(id))sel=sel.filter(x=>x!==id);else{const first=my.find(x=>x.id===sel[0]);if(first&&first.r!==c.r)sel=[];sel.push(id);}touch();draw();}
  function myHand(){const r=pub[cur];if(!r)return [];if(r.state==='result')return r.hands?.[String(me())]||[];return hand&&hand.round===r.round&&hand.turn===(r.turnNo??0)?hand.hand||[]:[];}
  const nextP=(r,p)=>{const act=r.seats.map((s,i)=>s&&r.status?.[i]!=='FORFEITED'?i:-1).filter(i=>i>=0);for(let i=1;i<=4;i++){const n=(p+i)%4;if(act.includes(n))return n;}return p;};
  const canFlow=(r,p,h)=>!r.drawn&&r.last&&r.last.by!==p&&nextP(r,r.last.by)===p&&h.some(c=>c.r===r.last.cards[0].r);
  function myAction(type){const r=pub[cur],m=me(),h=myHand();if(r?.state!=='playing')return;
    if(type==='draw')act({type:'draw'});
    else if(type==='kang')modal('<h2>📢 แคงเลยไหม?</h2><p>แต้มในมือคุณตอนนี้ <b>'+pts(h)+'</b> แต้ม ถ้ามีคนแต้มน้อยกว่า คุณต้องจ่ายทุกคน</p>',[{t:'ยกเลิก',c:'gray'},{t:'📢 แคง',c:'pink',f:()=>act({type:'kang'})}]);
    else if(type==='flow'){const rank=r.last.cards[0].r,ids=sel.length&&sel.every(id=>h.find(c=>c.id===id)?.r===rank)?sel:h.filter(c=>c.r===rank).map(c=>c.id);act({type:'flow',cards:ids});}
    else if(type==='discard'){if(!sel.length){toast('แตะเลือกไพ่ที่จะทิ้งก่อน');return;}act({type:'discard',cards:sel});}
    else if(type==='forfeit')modal('<h2>🏳️ ยอมแพ้รอบนี้?</h2><p>จ่ายทุนให้ทุกคนคนละ 1 แต้ม แล้วรอจบรอบ</p>',[{t:'เล่นต่อ',c:'gray'},{t:'ยอมแพ้',c:'pink',f:()=>act({type:'forfeit'})}]);
    sel=[];draw();}
  /* ---------- table ---------- */
  function draw(){if(!root||cur==null)return;const r=pub[cur],m=me(),t=root.querySelector('.kx-table');if(!r||m<0)return;const now=time(),rel=i=>(i-m+4)%4,my=myHand();
    const name=i=>r.seats[i]?.uid===Host.uid?'คุณ':esc(r.seats[i]?.name||'ว่าง'),av=i=>{const s=r.seats[i];return s?`<div class="kx-av ${s.uid===Host.uid?'me':''}" style="background:${avColor(s.uid)}">${initial(s.name)}</div>`:'<div class="kx-av empty">?</div>';};
    let h='<div class="kx-feed">'+(r.state==='playing'?(r.feed||[]).slice(0,3).map(s=>`<div>${esc(s)}</div>`).join(''):'')+'</div>';
    h+=`<div class="kx-topbar"><button class="kx-pill" id="kxBk">${r.state==='playing'?'':'← '}ห้อง ${cur+1}</button><span class="kx-pill">ทุน ${fmt(r.base)}/แต้ม</span>${r.state==='playing'?`<span class="kx-pill">รอบ ${r.round}</span>`:''}${S.owner?'<button class="kx-pill own" id="kxClr">👑 เคลียร์ห้อง</button>':''}</div>`;
    r.seats.forEach((s,i)=>{const P=POS[rel(i)],turn=r.state==='playing'&&r.cur===i,ff=r.status?.[i]==='FORFEITED';
      h+=`<div class="kx-seat ${turn?'turn':''} ${!s?'empty':''} ${ff?'ff':''}" style="left:${P.a[0]}%;top:${P.a[1]}%">${turn?`<svg class="kx-ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" pathLength="100" stroke-dasharray="100 100" data-ring="1"/></svg>`:''}${av(i)}<b>${name(i)}</b>
       ${(r.state==='waiting'||r.state==='countdown')&&s?`<span class="kx-rd ${r.ready[i]?'y':''}">${r.ready[i]?'✅ พร้อม':'⏳ รอ…'}</span>`:''}${(r.state==='playing'||r.state==='result')&&s?`<span class="kx-nt ${r.net[i]>0?'p':r.net[i]<0?'n':''}">${sgn(r.net[i]||0)}</span>`:''}${ff?'<span class="kx-rd">🏳️ ยอมแพ้</span>':''}${r.auto?.[i]&&r.state==='playing'?'<span class="kx-rd">⚡ ออโต้</span>':''}</div>`;
      if(rel(i)!==0&&s&&r.state==='playing'){const n=r.counts?.[i]||0;h+=`<div class="kx-ocards ${P.v?'v':''}" style="left:${P.c[0]}%;top:${P.c[1]}%">${Array.from({length:n},(_,k)=>`<img src="${IMG['k-back']}" style="--k:${k-(n-1)/2}" alt="">`).join('')}<em>${n}</em></div>`;}});
    if(r.state==='playing'){h+=`<div class="kx-deck"><img src="${IMG['k-back']}" alt=""><img src="${IMG['k-back']}" alt=""><em>${r.deckCount??0}</em></div>`;
      if(r.last){const pk=r.round+':'+r.turnNo;const fresh=pk!==pileKey;pileKey=pk;h+=`<div class="kx-pile ${fresh?'new':''}">${r.last.cards.map((c,k)=>`<img src="${cimg(c)}" style="--k:${k}" alt="${lbl(c)}">`).join('')}<small>${name(r.last.by)}</small></div>`;}}
    if(r.state==='waiting'||r.state==='countdown'){const f=feeOf('kang');
      h+=`<div class="kx-wait"><div class="kx-wbox"><b>${r.state==='countdown'?'ครบ 4 คนแล้ว!':'รอผู้เล่นให้ครบ 4 คน'}</b><small>${r.seats.filter(Boolean).length}/4 คน · พร้อม ${r.ready.filter(Boolean).length}/4</small>
       ${r.state==='waiting'&&!r.ready[m]?`<div class="kx-kick"><i id="kxBar"></i></div><small class="kx-kt">ไม่กดพร้อมใน <b id="kxSec">60</b> วิ จะลุกจากที่นั่งเอง</small>`:''}
       ${r.state==='waiting'?(r.ready[m]?'<div class="kx-ok">✅ คุณพร้อมแล้ว · รอคนอื่น</div>':`<div class="kx-feeRow sm">${[['coin',f.coin],['hat',f.hat],['mb',f.mb]].map(([k,n])=>`<span class="${lacks('kang').includes(k)?'no':''}"><img src="${IMG[k]}" alt="">${n}</span>`).join('')}<span>✨ ทุน ${fmt(r.base*8)}</span></div><button class="kx-go" id="kxRdy">✅ พร้อม</button>`):''}
       <button class="kx-btn2" id="kxLv">🚪 ออก${r.ready[m]?' (คืนค่าเข้า)':''}</button></div></div>`;
      if(r.state==='countdown')h+=`<div class="kx-cd"><span id="kxCdn">10</span><small>เกมเริ่มใน</small></div>`;}
    if(r.state==='playing'){const myTurn=r.cur===m&&r.status?.[m]!=='FORFEITED',flow=myTurn&&canFlow(r,m,my),synced=my.length||r.counts?.[m]===0;
      sel=sel.filter(id=>my.some(c=>c.id===id));
      h+=`<div class="kx-hand">${my.map((c,k)=>`<img class="kx-card ${sel.includes(c.id)?'sel':''} ${dealt.has(c.id)?'':'new'}" data-id="${c.id}" src="${cimg(c)}" style="--k:${k-(my.length-1)/2}" alt="${lbl(c)}">`).join('')}</div>
       <div class="kx-hp">${synced?`แต้มในมือ <b>${pts(my)}</b>`:'กำลังโหลดไพ่…'}${myTurn?' · <span class="you">ตาคุณ!</span>':''}</div>
       <div class="kx-acts">${myTurn&&!r.drawn&&synced?`<button class="kx-a draw" data-a="draw">🃏 จั่ว</button><button class="kx-a kang" data-a="kang">📢 แคง</button>`:''}${flow?`<button class="kx-a flow" data-a="flow">💧 ไหล</button>`:''}${myTurn&&r.drawn?`<button class="kx-a disc" data-a="discard" ${sel.length?'':'disabled'}>🗑️ ทิ้ง${sel.length?' '+sel.length+' ใบ':''}</button>`:''}${!myTurn?`<span class="kx-waitturn">${r.status?.[m]==='FORFEITED'?'คุณยอมแพ้แล้ว รอจบรอบ':'⏳ รอ '+name(r.cur)+' เล่น…'}</span>`:''}${r.status?.[m]!=='FORFEITED'?'<button class="kx-a ff" data-a="forfeit">🏳️</button>':''}</div>`;
      my.forEach(c=>dealt.add(c.id));}
    if(r.state==='result'){const rows=r.seats.map((s,i)=>({s,i})).filter(x=>x.s).sort((a,b)=>(r.net[b.i]||0)-(r.net[a.i]||0));
      h+=`<div class="kx-res"><div class="kx-rbox"><h2>${REASON[r.reason]||'🏆 จบรอบ'}</h2><div class="kx-sub">${r.winner!=null&&r.seats[r.winner]?'🏆 '+name(r.winner)+' ชนะ':'ไม่มีผู้ชนะ'}</div>
       ${rows.map(({s,i})=>{const hd=r.hands?.[String(i)]||[];return `<div class="kx-rr ${i===r.winner?'w':''} ${i===m?'me':''}">${av(i)}<div class="nm">${name(i)}<small>${hd.length?pts(hd)+' แต้ม':''}</small></div><div class="mini">${hd.map(c=>`<img src="${cimg(c)}" alt="${lbl(c)}">`).join('')}</div><b class="${r.net[i]>0?'p':r.net[i]<0?'n':''}">${sgn(r.net[i]||0)}</b></div>`;}).join('')}
       <div class="kx-hint">⏳ อีก <b id="kxRsec">30</b> วิ ทุกคนกลับหน้ามินิเกม · ห้องล้างเป็น 0/4</div><div class="kx-hint">${r.reason==='VOID'?'📮 คืนทุนและค่าเข้าทางไปรษณีย์':'📮 ทุนและผลได้เสียส่งเข้าไปรษณีย์'}</div><button class="kx-go sm" id="kxHome">🎮 กลับหน้ามินิเกมเลย</button></div></div>`;}
    if(h===lastH){timers();return;}lastH=h;t.innerHTML=h;timers();
    const on=(id,f)=>{const e=t.querySelector('#'+id);if(e)e.onclick=f;};
    on('kxRdy',ready);on('kxLv',leave);on('kxClr',async()=>{const out=await clearKangRoom(cur);if(out?.room){pub[cur]=out.room;onRoom(cur);}});on('kxHome',()=>finishToHub('กลับหน้ามินิเกมแล้ว'));
    on('kxBk',()=>{if(r.state==='waiting'||r.state==='countdown')leave();else if(r.state==='result')finishToHub('กลับหน้ามินิเกมแล้ว');else GAMES.kang.canLeave();});
    t.querySelectorAll('.kx-card').forEach(e=>e.onclick=()=>tapCard(e.dataset.id));t.querySelectorAll('.kx-a').forEach(e=>e.onclick=()=>myAction(e.dataset.a));}
  function timers(){if(!root)return;const now=time();const qq=id=>root.querySelector('#'+id);
    if(cur==null){root.querySelectorAll('[data-kcd]').forEach(e=>{const left=+e.dataset.kcd-now;if(left<=0)lobby();else e.textContent=mmss(left);});return;}
    const r=pub[cur],m=me();if(!r||m<0)return;
    root.querySelectorAll('[data-ring]').forEach(c=>c.setAttribute('stroke-dasharray',(Math.max(0,(r.deadline-now)/(r.duration||KANG.turnMs))*100)+' 100'));
    if(qq('kxBar')){const left=Math.max(0,KANG.readyMs/1000-(now-(r.seatAt?.[m]||now))/1000);qq('kxBar').style.width=(left/60*100)+'%';qq('kxSec').textContent=Math.ceil(left);}
    if(qq('kxCdn'))qq('kxCdn').textContent=Math.max(1,Math.ceil((r.startAt-now)/1000));
    if(qq('kxRsec')){const left=Math.max(0,Math.ceil((r.endAt-now)/1000));qq('kxRsec').textContent=left;if(left<=0&&CUR==='kang'){const room=cur,seat=Math.max(0,m);finishToHub('🧹 ล้างห้องแล้ว ทุกคนกลับหน้ามินิเกม');
      // Ask the server to clear the table now (staggered by seat; later calls are no-ops) so the hub shows 0/4 at once.
      setTimeout(()=>cloud('kang',{type:'tick',room}).then(out=>{if(out&&!CUR)renderHub();}),300+seat*900);}}}
  function flowFxCheck(r){const flow=(r.tx||[]).filter(t=>t.reason?.startsWith('FLOW')).at(-1);if(!flow){lastFlow='none';return;}const key=r.round+'-'+flow.at+'-'+flow.from+'-'+flow.to+'-'+r.tx.length;
    if(lastFlow!==undefined&&lastFlow!==key&&st){const m=me(),rel=uid=>(r.seats.findIndex(s=>s?.uid===uid)-m+4)%4,a=POS[rel(flow.from)].a,b=POS[rel(flow.to)].a;const fxl=document.createElement('div');fxl.className='kfxl';fxl.innerHTML=`<div class="kflash"></div><div class="kbolt">💧</div><div class="kflowt">ไหล!</div><div class="kamt minus" style="left:${clamp(a[0],18,82)}%;top:${a[1]}%">−${fmt(flow.amount)}</div><div class="kamt plus" style="left:${clamp(b[0],18,82)}%;top:${b[1]}%">+${fmt(flow.amount)}</div>`;st.appendChild(fxl);setTimeout(()=>fxl.remove(),1900);}
    lastFlow=key;}
  function confetti(){if(!st)return;for(let i=0;i<30;i++){const d=document.createElement('i');d.className='kx-conf';d.style.left=rnd(10,90)+'%';d.style.background=pick(['#ffd27a','#ff7ab6','#6ff0b5','#b98cff']);d.style.animationDelay=rnd(0,.4)+'s';st.appendChild(d);setTimeout(()=>d.remove(),2400);}}
  function ruleModal(base){const pay=(a,b,cl='')=>`<div class="lad ${cl}"><span class="ic" style="font-size:.8rem;font-weight:700">${a}</span><b>${fmt(b)}</b></div>`;
    rules('ไพ่แคง',[['🃏','แต้มน้อยสุดชนะ','คนละ 5 ใบ · A=1 · J Q K=10'],['🔄','จั่วแล้วทิ้ง','แต้มเดียวกันทิ้งพร้อมกันได้'],['💧','ไหล','คนก่อนหน้าทิ้งแต้มที่เรามี ลงได้เลยไม่ต้องจั่ว'],['📢','แคง','กดตอนต้นตา เปิดไพ่วัดแต้ม'],['💥','น็อค','ไพ่หมดมือ ชนะ ×2'],['🎴','ตอง / สี่ใบเปิด','แจกมาได้ ชนะทันที'],['⏱️','ตาละ 20 วิ','หมดเวลาระบบเล่นแทน'],['✅','ครบ 4 คนพร้อม','นับ 10 วิ แล้วเริ่มเอง · '+feeText('kang')+'/ตา'],['🪑','นั่งแล้วไม่พร้อม','60 วิ ลุกจากที่นั่งเอง'],['🔁','เล่นติดกัน 3 ตา','แล้วพัก '+KANG.restMs/60000+' นาที']],
      `<div class="rtitle">กุศลต่อคน (ฐาน ${fmt(base)})</div>${pay('🏆 ชนะ / แคงเข้า',base,'good')}${pay('📢 แคงรอบแรกเข้า ×2',base*2,'good')}${pay('💥 น็อค ×2',base*2,'good')}${pay('🎴 ตองเปิด ×2',base*2,'good')}${pay('🎴 สี่ใบเปิด ×3',base*3,'good')}${pay('😵 แคงล่ม จ่ายทุกคน',base,'bad')}${pay('🏳️ ยอมแพ้ จ่ายทุกคน',base,'bad')}<div class="rtitle">💧 ไหล (คนทิ้งจ่ายคนไหล)</div>${pay('1 ใบ',base/2)}${pay('คู่',base)}${pay('ตอง',base*2)}`);}
  /* Idle 5 minutes: leave a waiting seat (normal refund). Inside a running round auto-play simply continues. */
  async function idle(){if(cur==null)return;const r=pub[cur];if(r?.state==='waiting'&&me()>=0)await act({type:'leave'});}
  return {title:'🃏 ไพ่แคง',open,close,idle,busy:()=>cur!=null&&['playing','countdown','result'].includes(pub[cur]?.state),refresh(){if(cur!=null)draw();else lobby();},
    canLeave(){const r=cur!=null?pub[cur]:null,m=me();if(!r||m<0)return true;
      if(r.state==='playing'){modal('<h2>ออกจากหน้านี้?</h2><p>ระบบอัตโนมัติจะเล่นแทนเมื่อถึงตาของคุณ ผลรอบส่งเข้าไปรษณีย์</p>',[{t:'อยู่ต่อ',c:'gray'},{t:'ออกจากหน้า',c:'pink',f:closeGame}]);return false;}
      if(r.state==='waiting'||r.state==='countdown'){modal('<h2>ลุกจากโต๊ะ?</h2><p>'+(r.ready[m]?'คืนค่าเข้าและทุนให้ครบทันที':'ยังไม่ได้จ่ายอะไร')+'</p>',[{t:'อยู่ต่อ',c:'gray'},{t:'ลุกและออก',c:'pink',f:async()=>{await act({type:'leave'});closeGame();}}]);return false;}
      return true;}};
})();

/* ---------- ตุ่นบุกสวน! + จัดตะกร้าให้แม่มด (isolated screens, server rounds) ---------- */
function soloScreen(key,title,mount){let screen=null;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const api={S:new Proxy({},{get:(o,p)=>p==='coins'?wallet().coin:p==='kusal'?wallet().merit:S[p]}),time,offer:()=>soloState[key+'Offer']||null,current:()=>soloState[key]||null,cost:()=>feeOf(key).coin,closed:()=>S.rules.off(key),
  lack:()=>lacks(key).length>0,lackText:()=>'ขาด '+lacks(key).map(x=>LACK_NAME[x]).join(' · '),feeText:()=>feeText(key),cdMin:()=>MG_CD[key],minMerit:()=>MG_MIN[key],
  async start(){const out=await cloud('minigames',{type:key+'-start'});return out?.state?.[key]?.phase==='active'?out.state[key]:null;},
  async hits(round,hits){return !!await cloud('minigames',{type:'mole-hits',round,hits});},
  async send(round,witch,items){const out=await cloud('minigames',{type:'basket-send',round,witch,items});return out?.state?.basket||null;},
  async finish(round){const cur=soloState[key];if(cur&&cur.id===round&&cur.phase==='active'&&!(key==='basket'&&cur.sent?.every(Boolean))){const w=cur.until+400-time();if(w>0)await sleep(w);}
   const out=await cloud('minigames',{type:key+'-finish',round});const r=out?.state?.[key];renderWallet();return r&&r.id===round&&r.phase==='done'?r:null;}};
 return {title,async open(){await cloud('minigames',{type:'status'});if(CUR!==key)return;const g=$('#gbody');g.innerHTML='';const host=document.createElement('div');host.className='solohost';g.appendChild(host);screen=mount(host,api);},
  close(){screen?.close();screen=null;},refresh(){},busy:()=>soloState[key]?.phase==='active',
  canLeave(){if(!screen||screen.canLeave())return true;modal('<h2>ออกจากเกม?</h2><p>เวลาในรอบยังเดินต่อ ผลที่ทำได้บันทึกแล้ว กลับมาเปิดเกมนี้เพื่อรับผลได้</p>',[{t:'เล่นต่อ',c:'gray'},{t:'ออก',c:'pink',f:closeGame}]);return false;}};}
GAMES.mole=soloScreen('mole','🔨 ตุ่นบุกสวน!',mountMole);
GAMES.basket=soloScreen('basket','🧺 จัดตะกร้าให้แม่มด',mountBasket);

/* ---------- แม่มดซิ่งไม้กวาด + โรงงานลูกกวาด: standalone pages in a full-screen frame, talking by postMessage ----------
   page→here {mg:'ready'|'start'|'checkpoint'|'finish'|'close'} · here→page {mg:'init'|'started'|'result'|'error'}. Only this frame, same origin. */
function frameGame(k,src,title){let frame=null,round=null,cps=0,readyT=null;
 const post=m=>{try{frame?.contentWindow?.postMessage(m,location.origin);}catch{}};
 const active=()=>soloState[k]?.phase==='active'?soloState[k]:null;
 function init(){const b=blockers(k),a=active();return {mg:'init',game:k,fee:{...feeOf(k)},cooldownUntil:S.cd[k]||0,serverOffset,active:a,canPlay:!!a||!b.length,why:b.map(x=>x.cd?x.why+mmss(x.cd-time()):x.why).join(' · '),wallet:wallet(),minMerit:MG_MIN[k],cooldownMin:MG_CD[k]};}
 async function onMsg(e){if(!frame||e.source!==frame.contentWindow||e.origin!==location.origin)return;const m=e.data;if(!m||typeof m!=='object'||typeof m.mg!=='string')return;touch();
  if(m.mg==='ready'){clearTimeout(readyT);st()?.classList.add('ok');post(init());}
  else if(m.mg==='start'){const out=await cloud('minigames',{type:k+'-start'},{quiet:true}),r=out?.state?.[k];
   if(r?.phase==='active'){round=r;cps=0;post({mg:'started',round:r});}else post({mg:'error',msg:!out?lastCloudError||'เริ่มเกมไม่สำเร็จ':r?.abandoned?'รอบเดิมหมดเวลา ระบบสรุปผล '+sgn(r.gain||0)+' กุศลแล้ว':'ยังเริ่มรอบใหม่ไม่ได้'});renderWallet();}
  else if(m.mg==='checkpoint'){const r=round||active();if(!r||cps>=12)return;cps++;cloud('minigames',{type:k+'-cp',round:r.id,cp:m.cp},{quiet:true});}
  else if(m.mg==='finish'){const r=round||active();if(!r){post({mg:'error',msg:'ไม่พบรอบที่กำลังเล่น'});return;}const out=await cloud('minigames',{type:k+'-finish',round:r.id,report:m.report},{quiet:true}),d=out?.state?.[k];
   if(d&&d.id===r.id&&d.phase==='done'){round=null;post({mg:'result',result:{gain:d.gain,breakdown:d.breakdown??null}});renderWallet();}else post({mg:'error',msg:lastCloudError||'ส่งผลไม่สำเร็จ ลองอีกครั้ง'});}
  else if(m.mg==='close'){if(CUR===k)closeGame();}}
 const st=()=>$('#gbody .mgframe');
 return {title,framed:true,async open(){await cloud('minigames',{type:'status'});if(CUR!==k)return;round=active();cps=0;const g=$('#gbody');g.innerHTML=`<div class="mgframe"><iframe title="${esc(title)}" allow="accelerometer; gyroscope; fullscreen" src="${src}?v=ss3-fix15"></iframe><div class="mgwait"><div class="spin"></div><p>กำลังโหลดเกม…</p><button class="btn gray sm" id="mgfBack">‹ กลับหน้ามินิเกม</button></div></div>`;
   frame=g.querySelector('iframe');addEventListener('message',onMsg);g.querySelector('#mgfBack').onclick=closeGame;
   frame.addEventListener('load',()=>{try{const w=frame.contentWindow;for(const ev of ['pointerdown','touchstart','keydown','deviceorientation'])w.addEventListener(ev,touch,{capture:true,passive:true});}catch{}});
   readyT=setTimeout(()=>{const w=st()?.querySelector('.mgwait p');if(w)w.textContent='โหลดเกมไม่สำเร็จ กรุณากลับแล้วลองใหม่';},15000);},
  close(){clearTimeout(readyT);removeEventListener('message',onMsg);if(frame){try{frame.src='about:blank';}catch{}frame.remove();}frame=null;round=null;},
  busy:()=>!!round||!!active(),refresh(){}};}
GAMES.witch=frameGame('witch','witch-game.html','🧹 แม่มดซิ่งไม้กวาด');
GAMES.candy=frameGame('candy','candy-game.html','🍭 โรงงานลูกกวาดต้องคำสาป');

cloud('minigames',{type:'status'}).then(renderHub);
addEventListener('pagehide',()=>{if(CUR)GAMES[CUR].close();});
const stopControls=Host.watchWorld("minigames",config=>{if(config&&(!S.controlRevision||!config.controlRevision||config.controlRevision>=S.controlRevision)){applySettings(config);if(!CUR)renderHub();}});addEventListener("pagehide",()=>stopControls?.());
/* Only the owner account (world/minigameOwner, set by tools/set-minigame-owner.mjs) sees the control panel. Without that doc, admins keep it. */
const stopOwner=Host.watchWorld('minigameOwner',d=>{S.owner=d?.uid?d.uid===Host.uid:!!Host.admin;renderHub();});addEventListener('pagehide',()=>stopOwner?.());
/* Idle kick: 5 minutes without any touch, key or game message closes the game and returns to the minigame home.
   Never while a round is running (busy), and Kang leaves only a waiting seat (normal refund). */
for(const ev of ['pointerdown','pointermove','touchstart','touchmove','keydown','wheel','click'])addEventListener(ev,touch,{capture:true,passive:true});
setInterval(async()=>{if(!CUR||Date.now()-lastTouch<5*60000)return;const k=CUR,G=GAMES[k];if(G.busy?.())return;touch();try{await G.idle?.();}catch{}if(CUR===k){closeGame();modal('<h2>⏰ ไม่ได้เล่นนานเกิน 5 นาที</h2><p>ระบบพากลับหน้าแรกมินิเกมแล้ว</p>');}},10000);
