import {birdPosition,fireBird,minigameRules,MG_EMERGENCY} from './solo-engine.js?v=ss3-fix12';
import {brPrize,BR_MIN,BR_DC_MSG} from './br-engine.js?v=ss3-fix12';
import {mountMole} from './mole-game.js?v=ss3-fix12';
import {mountBasket} from './basket-game.js?v=ss3-fix12';
const IMG={"mole-bg": "images/mole-bg.webp", "basket-bg": "images/basket-table-bg.webp", "coin": "images/gacha-coin.webp", "bs-bg": "images/bs-bg.webp", "pk-bg": "images/pk-shelf-bg.webp", "kg-bg": "images/kang-table-bg.webp", "br-bg": "images/minigame-mg-arena-bg.webp", "gun": "images/bs-gun.webp", "b-ghost": "images/bs-bird-ghost-fly-4x4.webp", "bi-ghost": "images/bs-bird-ghost.webp", "b-pumpkin": "images/bs-bird-pumpkin-fly-4x4.webp", "bi-pumpkin": "images/bs-bird-pumpkin.webp", "b-witch": "images/bs-bird-witch-fly-4x4.webp", "bi-witch": "images/bs-bird-witch.webp", "b-skeleton": "images/bs-bird-skeleton-fly-4x4.webp", "bi-skeleton": "images/bs-bird-skeleton.webp", "pk-normal": "images/pk-normal.webp", "pk-angel": "images/pk-angel.webp", "pk-devil": "images/pk-devil.webp", "pkt-angel": "images/pk-angel-turn-4x4.webp", "pkt-devil": "images/pk-devil-turn-4x4.webp", "k-spade-a": "images/kang-card-spade-a.webp", "k-spade-2": "images/kang-card-spade-2.webp", "k-spade-3": "images/kang-card-spade-3.webp", "k-spade-4": "images/kang-card-spade-4.webp", "k-spade-5": "images/kang-card-spade-5.webp", "k-spade-6": "images/kang-card-spade-6.webp", "k-spade-7": "images/kang-card-spade-7.webp", "k-spade-8": "images/kang-card-spade-8.webp", "k-spade-9": "images/kang-card-spade-9.webp", "k-spade-10": "images/kang-card-spade-10.webp", "k-spade-j": "images/kang-card-spade-j.webp", "k-spade-q": "images/kang-card-spade-q.webp", "k-spade-k": "images/kang-card-spade-k.webp", "k-heart-a": "images/kang-card-heart-a.webp", "k-heart-2": "images/kang-card-heart-2.webp", "k-heart-3": "images/kang-card-heart-3.webp", "k-heart-4": "images/kang-card-heart-4.webp", "k-heart-5": "images/kang-card-heart-5.webp", "k-heart-6": "images/kang-card-heart-6.webp", "k-heart-7": "images/kang-card-heart-7.webp", "k-heart-8": "images/kang-card-heart-8.webp", "k-heart-9": "images/kang-card-heart-9.webp", "k-heart-10": "images/kang-card-heart-10.webp", "k-heart-j": "images/kang-card-heart-j.webp", "k-heart-q": "images/kang-card-heart-q.webp", "k-heart-k": "images/kang-card-heart-k.webp", "k-diamond-a": "images/kang-card-diamond-a.webp", "k-diamond-2": "images/kang-card-diamond-2.webp", "k-diamond-3": "images/kang-card-diamond-3.webp", "k-diamond-4": "images/kang-card-diamond-4.webp", "k-diamond-5": "images/kang-card-diamond-5.webp", "k-diamond-6": "images/kang-card-diamond-6.webp", "k-diamond-7": "images/kang-card-diamond-7.webp", "k-diamond-8": "images/kang-card-diamond-8.webp", "k-diamond-9": "images/kang-card-diamond-9.webp", "k-diamond-10": "images/kang-card-diamond-10.webp", "k-diamond-j": "images/kang-card-diamond-j.webp", "k-diamond-q": "images/kang-card-diamond-q.webp", "k-diamond-k": "images/kang-card-diamond-k.webp", "k-club-a": "images/kang-card-club-a.webp", "k-club-2": "images/kang-card-club-2.webp", "k-club-3": "images/kang-card-club-3.webp", "k-club-4": "images/kang-card-club-4.webp", "k-club-5": "images/kang-card-club-5.webp", "k-club-6": "images/kang-card-club-6.webp", "k-club-7": "images/kang-card-club-7.webp", "k-club-8": "images/kang-card-club-8.webp", "k-club-9": "images/kang-card-club-9.webp", "k-club-10": "images/kang-card-club-10.webp", "k-club-j": "images/kang-card-club-j.webp", "k-club-q": "images/kang-card-club-q.webp", "k-club-k": "images/kang-card-club-k.webp", "k-back": "images/kang-card-back.webp", "br-candy": "images/minigame-mg-candy.webp", "br-crown": "images/minigame-mg-crown.webp", "br-dig-hole": "images/minigame-mg-dig-hole.webp", "br-ghost-cloak": "images/minigame-mg-ghost-cloak.webp", "br-ghost": "images/minigame-mg-ghost.webp", "br-grave": "images/minigame-mg-grave.webp", "br-pumpkin-bomb": "images/minigame-mg-pumpkin-bomb.webp", "br-smoke": "images/minigame-mg-smoke.webp", "br-warn-shadow": "images/minigame-mg-warn-shadow.webp", "br-wing-shoes": "images/minigame-mg-wing-shoes.webp", "br-pumpkin": "images/minigame-mg-pumpkin.webp", "br-fog": "images/minigame-mg-fog.webp"},DIM={"gun": [571, 494], "b-ghost": [183.0, 150.0], "b-pumpkin": [197.0, 150.0], "b-witch": [161.0, 150.0], "b-skeleton": [199.0, 150.0], "pk-normal": [50.0, 44.75], "pk-angel": [50.0, 39.25], "pk-devil": [50.0, 44.5], "pkt-angel": [218.0, 180.0], "pkt-devil": [413.0, 180.0]};
const $=s=>document.querySelector(s);
const fmt=n=>Math.round(n).toLocaleString('en-US');
const rnd=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
const Host=parent.__HOST;if(!Host)throw new Error('กรุณาเปิดจากเกมหลัก');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let soloState={},serverOffset=0,acting=false;const time=()=>Date.now()+serverOffset;
const S={role:Host.admin?'admin':'player',owner:!!Host.admin,coins:Host.coins,kusal:JSON.parse(Host.get('s3all-v1')||'{}').merit||0,br:{open:true,fee:6},kang:[{open:true,base:10000,fee:4},{open:true,base:50000,fee:4}],solo:{},cfg:{},rules:minigameRules(null),emergency:false,cd:{pk:0,bs:0},brHist:[],kgHist:[]};
let cloudWait=Promise.resolve();
/* One request at a time. Player taps wait their turn instead of being dropped; timer-driven "advance" calls are skipped when busy. */
async function cloud(system,input){
  while(acting){if(input.type==='advance')return null;await cloudWait;}
  acting=true;let release;cloudWait=new Promise(resolve=>release=resolve);const sent=Date.now();
  try{const out=await Host.cloud(system,input);if(out.serverNow)serverOffset=out.serverNow-(sent+Date.now())/2;if(out.state)soloState=out.state;if(out.progress?.cd)S.cd={pk:0,bs:0,...out.progress.cd};if(typeof out.owner==='boolean')S.owner=out.owner;if(out.settings)applySettings(out.settings);if(out.refunded?.length)setTimeout(()=>modal(`<h2>⛔ ระบบปิดฉุกเฉิน</h2><p>รอบที่ค้างอยู่ถูกยกเลิก ไม่มีผลกับกุศล</p><p class="plus">คืน ${out.refunded.reduce((a,r)=>a+r.coins,0)} เหรียญแล้ว</p>`),0);renderWallet();return out;}
  catch(e){if(input.type!=='advance')toast(e.message);return null;}
  finally{acting=false;release();}
}
function applySettings(cfg){S.controlRevision=cfg.controlRevision||0;S.cfg=cfg;S.rules=minigameRules(cfg);S.br=cfg.br||S.br;S.kang=cfg.kang||S.kang;S.solo=cfg.solo||{};const was=S.emergency;S.emergency=S.rules.emergency;if(S.emergency&&!was)setTimeout(onEmergency,0);}
/* Emergency close: everyone in a minigame screen goes back to the minigame home. */
function onEmergency(){if(!S.emergency)return;if(CUR)closeGame();if(!$('#admin').classList.contains('on'))modal(`<h2>⛔ ปิดฉุกเฉิน</h2><p>${MG_EMERGENCY}</p>`);}
const pad2=h=>String(h).padStart(2,'0');
const hoursText=k=>S.rules.hours[k].map(h=>pad2(h)+':00').join('–');
let CUR=null;
function thaiTime(){const d=new Date(Date.now()+7*3600e3);return d.getUTCHours()*60+d.getUTCMinutes();}
function inHours(from,to){const m=thaiTime();return from<to?(m>=from*60&&m<to*60):(m>=from*60||m<to*60)}
function soloOpen(k){if(S.rules.emergency)return false;const m=S.rules.solo[k];if(m==='open')return true;if(m==='closed')return false;const h=S.rules.hours[k];return h?inHours(h[0],h[1]):true;}
function minsUntil(h){const m=thaiTime();let d=h*60-m;if(d<=0)d+=1440;return d}
function hm(min){const h=Math.floor(min/60),m=min%60;return h?`${h} ชม. ${m} นาที`:`${m} นาที`}
function mmss(ms){ms=Math.max(0,ms);const s=Math.ceil(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2400)}
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
function avatar(p,extra=''){return p?`<span class="av ${extra}" style="--c:${avColor(p.uid)}">${initial(p.name)}</span>`:`<span class="av empty ${extra}">+</span>`;}
function renderWallet(){S.coins=Host.coins;S.kusal=JSON.parse(Host.get('s3all-v1')||'{}').merit||0;const n=Host.mailCount();const w=`<span class="chip">${coinImg()}${S.coins}</span><span class="chip">✨${fmt(S.kusal)}</span><button class="chip mail" data-mail>📮${n?`<i>${n}</i>`:''}</button>`;$('#wal').innerHTML=w;$('#gwal').innerHTML=w;document.querySelectorAll('[data-mail]').forEach(b=>b.onclick=()=>Host.openMail());}
// sprite helper (4x4 sheets)
function sprite(key,hcqw,extra=''){const d=DIM[key];const w=hcqw*d[0]/d[1];return `<div class="spr ${extra}" data-k="${key}" style="width:${w}cqw;height:${hcqw}cqw;background-image:url(${IMG[key]})"></div>`}
function setFrame(el,f){el.style.backgroundPosition=`${(f%4)*100/3}% ${Math.floor(f/4)*100/3}%`}
function playSprite(el,fps=12,loop=false,done,from=0,to=15){let f=from;setFrame(el,f);const iv=setInterval(()=>{f++;if(f>to){if(loop)f=from;else{clearInterval(iv);done&&done();return}}setFrame(el,f)},1000/fps);return iv}
const GAMES={};
async function openGame(k){if(S.emergency){modal(`<h2>⛔ ปิดฉุกเฉิน</h2><p>${MG_EMERGENCY}</p>`);return;}closeAdmin();CUR=k;lastTouch=Date.now();$('#game').classList.add('on');$('#gtitle').textContent=GAMES[k].title;$('#gbody').innerHTML='<div class="loadwrap"><div class="spin"></div><p>กำลังโหลดห้องเกม…</p></div>';document.body.style.overflow='hidden';try{await GAMES[k].open();}catch(e){if(CUR===k){$('#gbody').innerHTML='<div class="loadwrap"><h2>ยังโหลดห้องไม่ได้</h2><p>'+esc(e.message||'กรุณาลองอีกครั้ง')+'</p><button class="btn" id="gameRetry">ลองโหลดอีกครั้ง</button></div>';$('#gameRetry').onclick=()=>openGame(k);}}}
function closeGame(){if(CUR&&GAMES[CUR].close)GAMES[CUR].close();CUR=null;$('#game').classList.remove('on');$('#gbody').innerHTML='';document.body.style.overflow='';renderHub()}
$('#gback').onclick=()=>{if(CUR&&GAMES[CUR].canLeave&&!GAMES[CUR].canLeave())return;closeGame()};
function stage(bgKey){const g=$('#gbody');g.innerHTML='';g.style.setProperty('--gbg',`url(${IMG[bgKey]})`);const s=document.createElement('div');s.className='stage';s.style.backgroundImage=`url(${IMG[bgKey]})`;g.appendChild(s);return s}
function stageOf(bgKey){const s=$('#gbody > .stage');if(s&&s.dataset.bg===bgKey)return s;const n=stage(bgKey);n.dataset.bg=bgKey;return n;}

/* ---------- hub ---------- */
function statusPill(cls,text){return `<span class="st ${cls}">${text}</span>`;}
function hubCards(){
  const R=S.rules,F=R.fees,pkOpen=soloOpen('pk'),bsOpen=soloOpen('bs');
  const seats=(n,max)=>n===undefined?'':` · ${n}/${max} คน`;
  const brSt=R.off('br')?statusPill('off','ปิดอยู่'):S.br.playing?statusPill('wait','กำลังแข่ง'):statusPill('on','เปิดรับ'+seats(S.br.seated,8));
  const kgSt=R.off('kang')?statusPill('off','ปิดอยู่'):statusPill('on','เปิด 2 ห้อง');
  const at=k=>pad2(R.hours[k][0])+':00',until=k=>pad2(R.hours[k][1])+':00';
  const pkSt=pkOpen?(Date.now()<S.cd.pk?statusPill('wait','พัก '+mmss(S.cd.pk-Date.now())):statusPill('on','เปิดถึง '+until('pk'))):statusPill('off',R.emergency||R.solo.pk==='closed'?'ปิดชั่วคราว':'เปิด '+at('pk'));
  const bsSt=bsOpen?(Date.now()<S.cd.bs?statusPill('wait','พัก '+mmss(S.cd.bs-Date.now())):statusPill('on','เปิดถึง '+until('bs'))):statusPill('off',R.emergency||R.solo.bs==='closed'?'ปิดชั่วคราว':'เปิด '+at('bs'));
  const soloSt=k=>soloOpen(k)?(Date.now()<(S.cd[k]||0)?statusPill('wait','พัก '+mmss(S.cd[k]-Date.now())):statusPill('on','เปิดอยู่')):statusPill('off','ปิดชั่วคราว');
  return [['br','🎲','หนีผีฮาโลวีน',`6–8 คน · 🪙${F.br}`,brSt,'br-bg'],['kang','🃏','ไพ่แคง',`4 คน · 🪙${F.kang}/รอบ`,kgSt,'kg-bg'],['pk','🎃','จิ้มฟักทอง',`เลือก 4 จาก 16 · 🪙${F.pk}`,pkSt,'pk-bg'],['bs','🐦','ยิงนกฮาโลวีน',`60 วินาที · 🪙${F.bs}`,bsSt,'bs-bg'],['mole','🔨','ตุ่นบุกสวน!',`ตีให้ถึงเป้า · 🪙${F.mole}`,soloSt('mole'),'mole-bg'],['basket','🧺','จัดตะกร้าให้แม่มด',`30 วิ · 🪙${F.basket}`,soloSt('basket'),'basket-bg']];
}
function renderHub(){
  $('#hub').innerHTML=`${S.emergency?`<div class="emerban">⛔ ${MG_EMERGENCY}</div>`:''}<div class="ggrid">${hubCards().map(([k,e,t,s,st,bg])=>`<button class="gpost" data-g="${k}" style="--bg:url(${IMG[bg]})"><span class="gtxt"><b>${e} ${t}</b><small>${s}</small>${st}</span></button>`).join('')}</div>`;
  document.querySelectorAll('.gpost').forEach(b=>b.onclick=()=>openGame(b.dataset.g));
  const ab=$('#adminBtn');ab.hidden=!S.owner;if(!S.owner)closeAdmin();
  if($('#admin').classList.contains('on'))renderAdmin();
  renderWallet();
}
/* ---------- admin control panel ---------- */
function seg(attrs,options,cur){return `<div class="seg">${options.map(([v,t])=>`<button ${attrs}="${v}" class="${String(v)===String(cur)?'on':''}">${t}</button>`).join('')}</div>`;}
function sel(id,vals,cur,fn=v=>v){return `<select id="${id}">${vals.map(v=>`<option value="${v}"${v==cur?' selected':''}>${fn(v)}</option>`).join('')}</select>`;}
function openAdmin(){$('#admin').classList.add('on');renderAdmin();}
function closeAdmin(){$('#admin').classList.remove('on');}
function renderAdmin(){
  if(!S.owner){closeAdmin();return;}
  // Do not redraw under the owner's fingers while a fee/hour field is being edited.
  const focus=document.activeElement;if(focus&&$('#adminBody').contains(focus)&&/INPUT|SELECT/.test(focus.tagName))return;
  const R=S.rules,em=R.emergency,br=S.br,kg=S.kang,off=S.cfg.off||{};
  const pill=(k,busy,openText='เปิดอยู่')=>em?statusPill('off','ปิดฉุกเฉิน'):R.off(k)?statusPill('off','ปิดอยู่'):busy?statusPill('wait',busy):statusPill('on',openText);
  const feeIn=k=>`<label class="afee">ค่าเข้า<span><input type="number" min="0" max="99" step="1" inputmode="numeric" data-fee="${k}" value="${R.fees[k]}">🪙</span></label>`;
  const hourSel=k=>{const opt=v=>[...Array(24).keys()].map(h=>`<option value="${h}"${h===v?' selected':''}>${pad2(h)}:00</option>`).join('');return `<label class="ahours">เวลาเปิด<span><select data-hour="${k}" data-end="0">${opt(R.hours[k][0])}</select>–<select data-hour="${k}" data-end="1">${opt(R.hours[k][1])}</select></span></label>`;};
  const card=(k,name,bg,status,modes,cur,extra='')=>`<section class="acard mg"><header><span class="aic" style="background-image:url(${IMG[bg]})"></span><b>${name}</b>${status}</header><div class="arow">${seg(`data-ctl="${k}" data-mode`,modes,cur)}${feeIn(k)}</div>${extra}</section>`;
  const roomMode=k=>off[k]?'closed':'open',soloMode=k=>S.solo?.[k]||'auto';
  const base=(r,i)=>`<label>ฐานห้อง ${i+1}${sel('kb'+i,[1000,5000,10000,50000],r.base,fmt)}</label>`;
  const kVoid=kg.map((r,i)=>r.playing||r.ready?`<button class="btn sm danger" data-emergency="kang" data-room="${i}">⛔ ยุติรอบห้อง ${i+1} · คืนทุน</button>`:'').join('');
  $('#adminBody').innerHTML=`
  <section class="acard emer ${em?'on':''}"><b>${em?'⛔ มินิเกมปิดฉุกเฉินอยู่':'🟢 มินิเกมเปิดตามปกติ'}</b><p class="note">${em?'ทุกคนถูกพากลับหน้าแรก · ค่าเข้าและทุนคืนแล้ว':'ปิดทุกเกมทันที เตะทุกคนกลับหน้าแรก คืนค่าเข้าและทุนแคงทางไปรษณีย์'}</p><button class="btn ${em?'':'danger'}" id="emBtn">${em?'✅ เปิดระบบกลับ':'⛔ ปิดฉุกเฉินทั้งหมด'}</button></section>
  ${card('br','หนีผีฮาโลวีน','br-bg',pill('br',br.playing?'กำลังแข่ง':'','เปิดรับ'+(br.seated!==undefined?` · ${br.seated}/8`:'')),[['open','เปิด'],['closed','ปิด']],roomMode('br'),br.playing||br.seated?'<button class="btn sm danger" data-emergency="br">⛔ ยุติรอบหนีผี · คืนค่าเข้า</button>':'')}
  ${card('kang','ไพ่แคง (2 ห้อง)','kg-bg',pill('kang',kg.some(r=>r.playing)?'กำลังเล่น':''),[['open','เปิด'],['closed','ปิด']],roomMode('kang'),`<div class="agrid">${kg.map(base).join('')}</div>${kVoid}`)}
  ${card('pk','จิ้มฟักทอง','pk-bg',soloOpen('pk')?statusPill('on','เปิดอยู่'):pill('pk','','ตามเวลา'),[['auto','⏰ ตามเวลา'],['open','เปิดเลย'],['closed','ปิด']],soloMode('pk'),hourSel('pk'))}
  ${card('bs','ยิงนกฮาโลวีน','bs-bg',soloOpen('bs')?statusPill('on','เปิดอยู่'):pill('bs','','ตามเวลา'),[['auto','⏰ ตามเวลา'],['open','เปิดเลย'],['closed','ปิด']],soloMode('bs'),hourSel('bs'))}
  ${card('mole','ตุ่นบุกสวน!','mole-bg',pill('mole'),[['auto','เปิด'],['closed','ปิด']],soloMode('mole')==='closed'?'closed':'auto')}
  ${card('basket','จัดตะกร้าให้แม่มด','basket-bg',pill('basket'),[['auto','เปิด'],['closed','ปิด']],soloMode('basket')==='closed'?'closed':'auto')}
  <p class="note" style="text-align:center">ค่าเข้าใหม่มีผลกับคนที่เข้าเล่นครั้งถัดไป ไม่กระทบคนที่จ่ายแล้ว</p>
  <details class="acard"><summary>📜 ผลหนีผีย้อนหลัง</summary>${S.brHist.length?S.brHist.map(r=>`<div class="hist">รอบ ${r.no} · 👑 ${r.win}<br><span class="note">${r.order}</span></div>`).join(''):'<p class="note">เปิดห้องหนีผีหนึ่งครั้งเพื่อโหลดประวัติ</p>'}</details>
  <details class="acard"><summary>📜 ผลไพ่แคงย้อนหลัง</summary>${S.kgHist.length?S.kgHist.map(r=>`<div class="hist">${r}</div>`).join(''):'<p class="note">เปิดห้องไพ่แคงหนึ่งครั้งเพื่อโหลดประวัติ</p>'}</details>`;
  const B=$('#adminBody'),saved=out=>{if(out)toast('บันทึกแล้ว');renderHub();};
  B.querySelector('#emBtn').onclick=()=>em?modal('<h2>เปิดระบบมินิเกมกลับ?</h2><p>ทุกเกมกลับมาเปิดตามการตั้งค่าเดิม</p>',[{t:'ยกเลิก',c:'gray'},{t:'เปิดระบบ',f:async()=>saved(await cloud('minigames',{type:'emergency',on:false}))}])
    :modal('<h2>⛔ ปิดฉุกเฉินทั้งหมด?</h2><p>ทุกเกมปิดทันที ทุกคนถูกพากลับหน้าแรก รอบที่เล่นอยู่เป็นโมฆะ คืนค่าเข้าและทุนแคงทางไปรษณีย์ ไม่มีใครเสียกุศล</p>',[{t:'ยกเลิก',c:'gray'},{t:'ปิดฉุกเฉิน',c:'pink',f:async()=>saved(await cloud('minigames',{type:'emergency',on:true}))}]);
  B.querySelectorAll('[data-ctl]').forEach(b=>b.onclick=async()=>saved(await cloud('minigames',{type:'control',game:b.dataset.ctl,mode:b.dataset.mode})));
  B.querySelectorAll('[data-fee]').forEach(i=>i.onchange=async()=>{const v=Number(i.value);if(!Number.isInteger(v)||v<0||v>99){toast('ค่าเข้าต้องเป็น 0–99 เหรียญ');i.value=R.fees[i.dataset.fee];return;}i.blur();saved(await cloud('minigames',{type:'fees',fees:{[i.dataset.fee]:v}}));});
  B.querySelectorAll('[data-hour]').forEach(x=>x.onchange=async()=>{const k=x.dataset.hour,v=[...B.querySelectorAll(`[data-hour="${k}"]`)].map(e=>+e.value);x.blur();if(v[0]===v[1]){toast('เวลาเปิดและปิดต้องไม่ตรงกัน');renderAdmin();return;}saved(await cloud('minigames',{type:'hours',game:k,from:v[0],to:v[1]}));});
  kg.forEach((r,i)=>{$('#kb'+i).onchange=async e=>{e.target.blur();const out=await cloud('kang',{type:'configure',room:i,base:+e.target.value});if(out?.room?.nextBase)toast('ค่าฐานใหม่มีผลรอบถัดไป');else saved(out);renderHub();};});
  B.querySelectorAll('[data-emergency]').forEach(b=>b.onclick=()=>modal('<h2>ยุติรอบและคืนทุน?</h2><p>รอบนี้เป็นโมฆะ ผู้เล่นได้ค่าเข้าและทุนคืนทางไปรษณีย์</p>',[{t:'ยกเลิก',c:'gray'},{t:'ยืนยันยุติ',c:'pink',f:async()=>{const system=b.dataset.emergency,room=system==='kang'?{room:Number(b.dataset.room)}:{};await cloud(system,{type:'void',...room});renderHub();}}]));
}
$('#adminBtn').onclick=()=>{if(S.owner)openAdmin();};$('#adminClose').onclick=closeAdmin;
setInterval(()=>{if(!CUR&&!$('#modal').classList.contains('on')&&!$('#admin').classList.contains('on'))renderHub()},15000);
renderHub();

/* ---------- จิ้มฟักทอง ---------- */
GAMES.pk=(()=>{
  const XS=[26.6,42.2,58.0,73.8],YS=[36.3,44.7,53.0,61.6];
  let st,round=null,cdIv;
  const PAY={4:{k:100000,t:'โบนัส +100,000 กุศล'},3:{k:20000,t:'ได้รับ +20,000 กุศล'},2:{k:0,t:'รางวัลปลอบใจ กล่องสุ่มนกกระจอกเทศ 10 กล่อง + กล่องสุ่มนกโดโด้ 10 กล่อง',box:1},1:{k:-5000,t:'ถูกหัก 5,000 กุศล'},0:{k:-15000,t:'ถูกหัก 15,000 กุศล'}};
  async function open(){st=stage('pk-bg');await cloud('minigames',{type:'status'});if(soloState.pk?.phase==='active'){round={...soloState.pk,sel:[],phase:'pick'};st.innerHTML=cells()+`<div class="pkhud" id="pkhud"></div><div class="panel" id="pkp"></div>`;st.querySelectorAll('.pkc').forEach(c=>c.innerHTML=`<img class="pkn" src="${IMG['pk-normal']}">`);pickMode();}else lobby();cdIv=setInterval(()=>{if(!round)lobby()},1000)}
  function close(){clearInterval(cdIv);round=null}
  function cells(){let h='';for(let i=0;i<16;i++){const x=XS[i%4],y=YS[Math.floor(i/4)];h+=`<div class="pkc" data-i="${i}" style="left:${x}%;top:${y}%"></div>`}return h}
  function showRules(){
    const ang=n=>[...Array(4)].map((_,i)=>`<img src="${IMG[i<n?'pk-angel':'pk-devil']}" alt="">`).join('');
    const L=[[4,'+100,000','good'],[3,'+20,000','good'],[2,'📦 กล่องนก 10+10',''],[1,'−5,000','bad'],[0,'−15,000','bad']];
    rules('จิ้มฟักทอง',[['🎃','เลือก 4 ลูก','จาก 16 ลูกบนชั้น'],['🔮','ผลสุ่มไว้ก่อน','ไม่เปลี่ยนจนจบรอบ'],['⏳','พัก 30 นาที','หลังจบแต่ละรอบ'],['🌙','เปิด '+hoursText('pk'),'ใช้ '+S.rules.fees.pk+' เหรียญ · มีกุศล 25,000+']],
      `<div class="rtitle">รางวัลจาก 4 ลูกที่เลือก</div>${L.map(([n,t,c])=>`<div class="lad ${c}"><span class="ic">${ang(n)}</span><b>${t}</b></div>`).join('')}`);
  }
  function lobby(){
    const open=soloOpen('pk'),fee=S.rules.fees.pk,cd=Date.now()<S.cd.pk,okC=S.coins>=fee,okK=S.kusal>=25000;
    let body;
    if(!open) body=`<div class="phead"><h2>🎃 จิ้มฟักทอง</h2><button class="rbtn" id="rb">📜 กติกา</button></div><div style="text-align:center;margin-top:2cqw">${S.rules.emergency||S.rules.solo.pk==='closed'?'🌙 ปิดชั่วคราว แวะมาใหม่นะ':`🌙 เปิด ${hoursText('pk')}<div class="big">อีก ${hm(minsUntil(S.rules.hours.pk[0]))}</div>`}</div>`;
    else body=`<div class="phead"><h2>🎃 จิ้มฟักทอง</h2><button class="rbtn" id="rb">📜 กติกา</button></div>${pills([[`🪙 ${fee} เหรียญ`,okC],['✨ กุศล 25,000+',okK],['👼 ลุ้นสูงสุด +100,000']])}
      <div style="text-align:center">${cd?`<div>พักก่อนนะ เล่นได้อีกใน</div><div class="big">${mmss(S.cd.pk-Date.now())}</div>`:`<button class="btn orange big-btn" id="go" ${okC&&okK?'':'disabled'}>เริ่มเล่น</button>`}</div>`;
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
    modal(`<h2>${a>=3?'🎉':a===2?'🙂':'😱'} เฉลยแล้ว!</h2><p>คุณได้ฟักทองนางฟ้า <b>${a}</b> ลูก และฟักทองผี <b>${d}</b> ลูก</p>${line}<p class="note">รอบนี้บนชั้นมีฟักทองนางฟ้า ${nA} ลูก จาก 16 ลูก · เล่นรอบต่อไปได้ในอีก 30 นาที</p>`,[{t:'ดูชั้นวาง',c:'gray'},{t:'กลับหน้าเกม',f:()=>{round=null;lobby()}}]);
    round.phase='done';
    const p2=st.querySelector('#pkp');p2.style.display='';p2.innerHTML='<button class="btn big-btn" id="again">กลับหน้าเกม</button>';p2.querySelector('#again').onclick=()=>{round=null;lobby()};
  }
  return {title:'🎃 จิ้มฟักทอง',open,close,refresh(){if(!round)lobby()},canLeave(){if(round&&round.phase==='lock'){toast('รอเฉลยก่อนนะ');return false}if(round&&(round.phase==='pick'||round.phase==='ready'||round.phase==='pop')){toast('เลือกฟักทองให้ครบ 4 ลูกก่อนนะ จ่ายเหรียญไปแล้ว');return false}return true}};
})();

/* ---------- ยิงนก ---------- */
GAMES.bs=(()=>{
 const TYPES=[['ghost','👻','นกผี'],['pumpkin','🎃','นกฟักทอง'],['witch','🧙','นกแม่มด'],['skeleton','💀','นกโครงกระดูก']];
 const sheets=TYPES.map(([key])=>{const image=new Image();image.src=IMG['b-'+key];return image;});
 let st,canvas,ctx,W,H,round=null,raf,timer,ending=false,pendingShot=false,queuedShots=[],syncTimer=null,fx=[],combo=0,lastHit=0,aimDeg=0,lastFrame=0;
 const values=()=>round?.values||soloState.offer||{};
 function valTable(){return '<div class="bvgrid">'+TYPES.map(([k,e,n],i)=>{const v=values()[i];return v?`<div class="bvt ${v.role}"><img src="${IMG['bi-'+k]}"><div>${n}${v.role==='lucky'?' ⭐':v.role==='cursed'?' ☠️':''}</div><b class="${v.val<0?'minus':'plus'}">${v.val>0?'+':''}${fmt(v.val)}</b></div>`:'';}).join('')+'</div>';}
 function showRules(){rules('ยิงนกฮาโลวีน',[['🎯','แตะนกเพื่อยิง','ยิงได้ใน 60 วินาที'],['🎲','ค่านกสุ่มใหม่','ดูค่าก่อนกดเริ่ม'],['⭐','นกนำโชค','ค่าสูงสุด บินเร็ว'],['☠️','นกต้องสาป','โดนแล้วหักกุศล'],['🔫','กระสุน 6 นัด','บรรจุ 1.5 วินาที'],['🔥','ไม่เกิน 4 นัด/วิ','กดรัวเกินไปปืนร้อน'],['⚡','ยิงติดกัน','ได้คอมโบ (เอฟเฟกต์)'],['☀️','เปิด '+hoursText('bs'),S.rules.fees.bs+' เหรียญ · พัก 15 นาที']]);}
 async function open(){st=stage('bs-bg');await cloud('minigames',{type:'status'});if(soloState.bs?.phase==='active'){round=soloState.bs;mount();}else lobby();timer=setInterval(()=>{if(!round)lobby();},1000);}
 function close(){clearInterval(timer);clearInterval(syncTimer);cancelAnimationFrame(raf);st?.removeEventListener('pointerdown',shoot);round=null;}
 function lobby(){const enabled=soloOpen('bs'),fee=S.rules.fees.bs,cooldown=S.cd.bs>time(),ok=S.coins>=fee&&S.kusal>=10000;st.innerHTML=`<img class="bsgun" src="${IMG.gun}"><div class="panel slim" style="top:6cqw"><div class="phead"><h2>🐦 ค่านกรอบนี้</h2><button class="rbtn" id="birdRules">📜 กติกา</button></div>${valTable()}<div style="text-align:center">${!enabled?(S.rules.emergency||S.rules.solo.bs==='closed'?'<div>☀️ ลานยิงนกปิดชั่วคราว</div>':'<div>☀️ ลานยิงนกเปิด '+hoursText('bs')+'</div><div class="big">อีก '+hm(minsUntil(S.rules.hours.bs[0]))+'</div>'):cooldown?'<div>พักก่อนนะ ยิงได้อีกใน</div><div class="big">'+mmss(S.cd.bs-time())+'</div>':pills([['🪙 '+fee+' เหรียญ',S.coins>=fee],['✨ กุศล 10,000+',S.kusal>=10000],['⏱️ 60 วินาที']])+'<button class="btn orange big-btn" id="birdStart" '+(ok?'':'disabled')+'>เริ่มยิง</button>'}</div></div>`;st.querySelector('#birdRules').onclick=showRules;if(st.querySelector('#birdStart'))st.querySelector('#birdStart').onclick=start;}
 async function start(){const out=await cloud('minigames',{type:'bs-start'});if(out){round=out.state.bs;mount();}}
 function mount(){ending=false;queuedShots=[];fx=[];combo=0;clearInterval(syncTimer);syncTimer=setInterval(()=>flushShots(),1500);
  st.innerHTML=`<canvas id="bscv"></canvas><img class="bsgun" id="gun" src="${IMG.gun}"><div class="bstime" id="bt">60</div><div class="bsscore" id="bsc"></div><div class="bsammo" id="ammo"></div><div class="bsmsg" id="bmsg"></div><div class="bscombo" id="bcombo"></div><div class="bslegend">${TYPES.map(([k],i)=>`<span class="${round.values[i].role}"><img src="${IMG['bi-'+k]}">${round.values[i].val>0?'+':''}${fmt(round.values[i].val)}</span>`).join('')}</div>`;
  canvas=st.querySelector('#bscv');const r=st.getBoundingClientRect();W=r.width;H=r.height;const dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=W*dpr;canvas.height=H*dpr;ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);st.addEventListener('pointerdown',shoot);updateScore();lastFrame=performance.now();loop();}
 function ammoHtml(){const elapsed=time()-round.start;if(round.reload>elapsed)return '<small>บรรจุ…</small>';const n=round.reload&&round.reload<=elapsed?6:round.ammo;return [...Array(6)].map((_,i)=>`<i class="${i<n?'':'u'}"></i>`).join('');}
 function updateScore(){if(!round||!st.querySelector('#bsc'))return;st.querySelector('#bsc').innerHTML='🎯 '+round.count+' ตัว<br><small>✨ '+(round.sum>=0?'+':'')+fmt(round.sum)+'</small>';const a=st.querySelector('#ammo'),h=ammoHtml();if(a.dataset.h!==h){a.innerHTML=h;a.dataset.h=h;}}
 function drawFx(dt){fx=fx.filter(f=>(f.t+=dt)<f.life);for(const f of fx){const k=f.t/f.life;ctx.save();ctx.globalAlpha=Math.max(0,1-k);
   if(f.kind==='puff'){ctx.fillStyle=f.c;ctx.beginPath();ctx.arc(f.x+f.vx*f.t,f.y+f.vy*f.t+f.g*f.t*f.t,f.r*(1+k*1.2),0,7);ctx.fill();}
   else if(f.kind==='smoke'){ctx.globalAlpha=(1-k)*.55;ctx.fillStyle=f.c;ctx.beginPath();ctx.arc(f.x,f.y-k*H*.02,f.r*(.6+k*1.6),0,7);ctx.fill();}
   else if(f.kind==='feather'){ctx.translate(f.x+f.vx*f.t+Math.sin(f.t*9+f.ph)*W*.012,f.y+f.vy*f.t+H*.05*f.t*f.t);ctx.rotate(Math.sin(f.t*7+f.ph)*.9);ctx.fillStyle=f.c;ctx.beginPath();ctx.ellipse(0,0,W*.012,W*.004,0,0,7);ctx.fill();}
   else if(f.kind==='star'){ctx.translate(f.x+f.vx*f.t,f.y+f.vy*f.t);ctx.rotate(f.t*6);ctx.fillStyle=f.c;ctx.font=`${W*.05}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('✦',0,0);}
   else if(f.kind==='txt'){const s=1+.35*Math.max(0,1-k*4);ctx.translate(f.x,f.y-k*H*.06);ctx.scale(s,s);ctx.font=`800 ${W*(f.big?.075:.055)}px Mali,system-ui`;ctx.textAlign='center';ctx.lineWidth=5;ctx.strokeStyle='#2A2140';ctx.fillStyle=f.c;ctx.strokeText(f.s,0,0);ctx.fillText(f.s,0,0);}
   else if(f.kind==='flash'){const g=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,W*.09*(1-k*.5));g.addColorStop(0,'rgba(255,255,230,1)');g.addColorStop(.35,'rgba(255,214,90,.9)');g.addColorStop(1,'rgba(255,140,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(f.x,f.y,W*.09,0,7);ctx.fill();}
   else if(f.kind==='trail'){ctx.globalAlpha=(1-k)*.8;ctx.strokeStyle='#FFF2B0';ctx.lineWidth=W*.008*(1-k);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(f.x0,f.y0);ctx.lineTo(f.x0+(f.x-f.x0)*Math.min(1,k*3+.4),f.y0+(f.y-f.y0)*Math.min(1,k*3+.4));ctx.stroke();}
   else if(f.kind==='ring'){ctx.strokeStyle=f.hit?'#FFE07A':'#fff';ctx.lineWidth=2.5;const rr=W*.035+k*W*.025;ctx.beginPath();ctx.arc(f.x,f.y,rr,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(f.x-rr*1.5,f.y);ctx.lineTo(f.x-rr*.5,f.y);ctx.moveTo(f.x+rr*.5,f.y);ctx.lineTo(f.x+rr*1.5,f.y);ctx.moveTo(f.x,f.y-rr*1.5);ctx.lineTo(f.x,f.y-rr*.5);ctx.moveTo(f.x,f.y+rr*.5);ctx.lineTo(f.x,f.y+rr*1.5);ctx.stroke();}
   ctx.restore();}}
 function loop(){if(!round)return;const nowp=performance.now(),dt=Math.min(.05,(nowp-lastFrame)/1000);lastFrame=nowp;const elapsed=time()-round.start;ctx.clearRect(0,0,W,H);
  for(const b of round.flights){if(round.killed.includes(b.id))continue;const p=birdPosition(b,elapsed);if(!p)continue;const im=sheets[b.type];if(!(im.complete&&im.naturalWidth))continue;const fw=im.naturalWidth/4,fh=im.naturalHeight/4,h=H*.075,w=h*fw/fh,frame=Math.floor(elapsed/70+b.phase*5)%16;ctx.save();ctx.globalAlpha=p.vis;ctx.translate(p.x*W,p.y*H);ctx.scale(p.dir,1);ctx.drawImage(im,(frame%4)*fw,Math.floor(frame/4)*fh,fw,fh,-w/2,-h/2,w,h);ctx.restore();}
  drawFx(dt);
  const left=Math.max(0,Math.ceil((round.until-time())/1000)),bt=st.querySelector('#bt');if(bt.textContent!==String(left)){bt.textContent=left;bt.classList.toggle('hot',left<=10&&left>0);}updateScore();
  if(time()>=round.until){if(!pendingShot&&!ending)end();else raf=requestAnimationFrame(loop);return;}raf=requestAnimationFrame(loop);}
 async function flushShots(){if(!round||pendingShot||!queuedShots.length)return !queuedShots.length;pendingShot=true;const batch=queuedShots.slice(0,40),id=round.id;const out=await cloud('minigames',{type:'bs-shots',round:id,shots:batch});if(out&&round?.id===id){queuedShots.splice(0,batch.length);round=structuredClone(out.state.bs);for(const shot of queuedShots){try{fireBird(round,shot);}catch{}}updateScore();}pendingShot=false;return !!out;}
 function msg(t){const m=st.querySelector('#bmsg');if(!m)return;m.textContent=t;m.classList.remove('on');void m.offsetWidth;m.classList.add('on');}
 function aim(px,py){const g=st.querySelector('#gun');if(!g)return null;const gx=W*.482,gy=H;let a=Math.atan2(px-gx,gy-py)*180/Math.PI;a=Math.max(-12,Math.min(12,a));aimDeg=a;g.animate([{transform:`rotate(${a}deg) translateY(3%)`},{transform:`rotate(${a}deg)`}],{duration:170,easing:'ease-out',fill:'forwards'});const L=H*.30;return {x:gx+Math.sin(a*Math.PI/180)*L,y:gy-Math.cos(a*Math.PI/180)*L};}
 function burst(x,y,v){const lucky=v.role==='lucky',cursed=v.val<0;const cols=cursed?['#5b4a7a','#3a2f52','#8f7fb0']:lucky?['#FFE07A','#FFC93C','#FFF3B0','#ffffff']:['#c9a8ff','#fff3b0','#ffd36e','#e9dcff'];
  for(let i=0;i<6;i++)fx.push({kind:'smoke',x:x+rnd(-1,1)*W*.03,y:y+rnd(-1,1)*W*.02,r:W*rnd(.03,.05),c:cursed?'#2c2140':'#a58bd6',t:0,life:.7});
  for(let i=0;i<(lucky?22:14);i++){const a=Math.random()*Math.PI*2,s=W*rnd(.12,.3);fx.push({kind:'puff',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,g:H*.08,r:W*rnd(.008,.02),c:pick(cols),t:0,life:rnd(.4,.7)});}
  for(let i=0;i<6;i++)fx.push({kind:'feather',x,y,vx:rnd(-1,1)*W*.12,vy:rnd(-1,.2)*W*.12,ph:Math.random()*6,c:cursed?'#3a2f52':'#ffffff',t:0,life:1.1});
  if(!cursed)for(let i=0;i<(lucky?6:3);i++)fx.push({kind:'star',x,y,vx:rnd(-1,1)*W*.2,vy:rnd(-1,.3)*W*.2,c:lucky?'#FFE07A':'#fff',t:0,life:.8});
  fx.push({kind:'txt',x,y:y-H*.02,s:(v.val>0?'+':'')+fmt(v.val),c:cursed?'#ff8a8a':lucky?'#FFE07A':'#ffffff',big:lucky,t:0,life:1});}
 function showCombo(){const c=st.querySelector('#bcombo');if(!c)return;if(combo<2){c.classList.remove('on');return;}c.textContent=`คอมโบ x${combo}${combo>=5?' 🔥':''}`;c.classList.remove('on');void c.offsetWidth;c.classList.add('on');}
 function shoot(ev){if(!round||ending||time()>=round.until)return;ev.preventDefault();const r=st.getBoundingClientRect(),px=ev.clientX-r.left,py=ev.clientY-r.top,x=px/W,y=py/H,t=Math.round(time()-round.start);if(x<0||x>1||y<0||y>1)return;const shot={x,y,t};
  let hit;try{const next=structuredClone(round);hit=fireBird(next,shot);round=next;queuedShots.push(shot);}catch(e){msg(/ร้อน/.test(e.message)?'🔥 ปืนร้อน! กดรัวเกินไป':/บรรจุ/.test(e.message)?'🔄 กำลังบรรจุกระสุน…':e.message);return;}
  const tip=aim(px,py);if(tip){fx.push({kind:'flash',x:tip.x,y:tip.y,t:0,life:.12});fx.push({kind:'trail',x0:tip.x,y0:tip.y,x:px,y:py,t:0,life:.16});}fx.push({kind:'ring',x:px,y:py,hit:!!hit,t:0,life:.28});
  if(hit){const p=birdPosition(hit,t)||{x,y},v=round.values[hit.type];burst(p.x*W,p.y*H,v);
   if(v.val<0){combo=0;msg('☠️ โดนนกต้องสาป!');st.animate([{transform:'translateX(0)'},{transform:'translateX(-2.5%)'},{transform:'translateX(2%)'},{transform:'translateX(-1%)'},{transform:'translateX(0)'}],{duration:320});st.classList.remove('cursedflash');void st.offsetWidth;st.classList.add('cursedflash');}
   else{combo=Date.now()-lastHit<1500?combo+1:1;lastHit=Date.now();if(v.role==='lucky')msg('⭐ นกนำโชค!');}
   showCombo();}
  updateScore();if(queuedShots.length>=8)flushShots();}
 async function end(){ending=true;if(queuedShots.length&&!await flushShots()){ending=false;setTimeout(()=>{if(round)end();},1500);return;}clearInterval(syncTimer);const out=await cloud('minigames',{type:'bs-finish',round:round.id});if(!out){ending=false;setTimeout(()=>{if(round)end();},2000);return;}round=out.state.bs;st.removeEventListener('pointerdown',shoot);const lines=TYPES.map(([k,e,n],i)=>round.hits[i]?`<div><span><img class="ri" src="${IMG['bi-'+k]}" alt=""> ${n} ×${round.hits[i]}</span><b class="${round.values[i].val<0?'minus':'plus'}">${round.values[i].val*round.hits[i]>0?'+':''}${fmt(round.values[i].val*round.hits[i])}</b></div>`:'').join('');modal(`<h2>⏰ หมดเวลา!</h2><p class="bigline">ยิงได้ <b>${round.count}</b> ตัว</p><div class="reslist">${lines||'<div><span>ยังไม่โดนนกเลย</span><b>0</b></div>'}<div class="tot"><b>รวม</b><b class="${round.gain<0?'minus':'plus'}">${round.gain>0?'+':''}${fmt(round.gain)} กุศล</b></div></div><p class="note">${round.gain>0?'รางวัลส่งเข้าไปรษณีย์แล้ว':'บันทึกยอดบนคลาวด์แล้ว'}</p>`,[{t:'กลับหน้าเกม',f:()=>{round=null;lobby();}}]);}
 return{title:'🐦 ยิงนกฮาโลวีน',open,close,refresh(){if(!round)lobby();},canLeave(){if(round&&round.phase==='active'){modal('<h2>ออกจากลานยิง?</h2><p>ผลที่ยิงสำเร็จบันทึกบนคลาวด์แล้ว เวลาในรอบยังเดินต่อ กลับมารับผลรอบเดิมได้</p>',[{t:'เล่นต่อ'},{t:'ออก',c:'gray',f:closeGame}]);return false;}return true;}};
})();

/* ---------- ไพ่แคง ---------- */
GAMES.kang=(()=>{
  const SY={spade:'♠',heart:'♥',diamond:'♦',club:'♣'},RL=['','A','2','3','4','5','6','7','8','9','10','J','Q','K'],RK=['','a','2','3','4','5','6','7','8','9','10','j','q','k'];
  const SEAT=[{ax:13,ay:79},{ax:9,ay:43,bx:20,by:47.3,v:1},{ax:50,ay:21.5,bx:50,by:34,v:0},{ax:91,ay:43,bx:80,by:47.3,v:1}];
  const WAITSEAT=[{x:50,y:70},{x:17,y:46},{x:50,y:24},{x:83,y:46}];
  const REASON={KANG:'📢 แคงสำเร็จ',KANG_FAIL:'😵 แคงล่ม',KNOCK:'💥 น็อค! ไพ่หมดมือ',DECK_OUT:'🃏 กองจั่วหมด',OPEN_TRIPLE:'🎴 ตองเปิด',OPEN_FOUR:'🎴 สี่ใบเปิด',LAST_PLAYER:'🏳️ เหลือคนสุดท้าย',VOID:'⛔ ยุติรอบ คืนทุนแล้ว',FORFEIT:'🏳️ ยอมแพ้'};
  let room=null,G=null,tick,st;
  const pts=c=>Math.min(10,c.r),lbl=c=>RL[c.r]+SY[c.s],img=c=>IMG[`k-${c.s}-${RK[c.r]}`];
  const total=h=>h.reduce((a,c)=>a+pts(c),0);
  let publicRoom=null,privateHand=null,stopRoom=null,stopHand=null,resultShown='',advancePending=false,lastFlow=undefined,lastResultFx=undefined,startedRound=null;
  const seatsOf=()=>publicRoom.state==='result'?(publicRoom.lastSeats||publicRoom.seats):publicRoom.seats;
  function stop(){stopRoom?.();stopHand?.();stopRoom=stopHand=null;clearInterval(tick);}
  async function open(){room=null;G=null;await cloud('minigames',{type:'status'});lobby();}
  function close(){stop();G=null;room=null;}
  function cfg(r){return{base:r.base,flow:[0,r.base/2,r.base,r.base*2,r.base*3],knock:2,tri:2,four:3,first:2,forfeit:1};}
  function dots(r){if(r.seated===undefined)return `<div class="sdots"><span>${r.playing?'กำลังเล่น':'แตะเพื่อดูโต๊ะ'}</span></div>`;return `<div class="sdots">${[0,1,2,3].map(i=>`<i class="${i<r.seated?'on':''}"></i>`).join('')}<span>${r.seated}/4</span></div>`;}
  function lobby(){stop();room=null;G=null;lastFlow=undefined;lastResultFx=undefined;st=stageOf('kg-bg');
    const open=!S.rules.off('kang'),fee=S.rules.fees.kang;
    st.innerHTML=`<div class="lhead"><h2>🃏 ไพ่แคง</h2><button class="rbtn" id="krules">📜 กติกา</button></div><div class="rooms">${S.kang.map((r,i)=>`<div class="rtile ${open?'':'closed'}"><div class="rt-top"><b>ห้อง ${i+1}</b>${!open?statusPill('off','ปิด'):r.playing?statusPill('wait','กำลังเล่น'):statusPill('on','เปิด')}</div><div class="rt-table">${dots(r)}</div><div class="pills"><span class="pill">✨ ฐาน ${fmt(r.base)}</span><span class="pill">🪙 ${fee}/รอบ</span><span class="pill">🔒 กัน ${fmt(r.base*8)}</span></div><button class="btn big-btn ${open?'':'gray'}" data-room="${i}" ${open?'':'disabled'}>${open?(r.playing?'เข้าไปดู':'เข้าห้อง'):'ปิดชั่วคราว'}</button></div>`).join('')}</div>`;
    st.querySelectorAll('[data-room]').forEach(b=>b.onclick=async()=>{const i=+b.dataset.room;await cloud('minigames',{type:'status'});if(S.rules.off('kang')){lobby();return;}waiting(i);});st.querySelector('#krules').onclick=()=>ruleModal(S.kang[0]);}
  async function action(input){if(!room)return null;const out=await cloud('kang',{...input,room:room.i,...(G?{round:G.round,turn:G.turnNo}:{})});if(out&&room){publicRoom=out.room;privateHand={hand:out.mine,round:out.room.round,turn:out.room.turnNo??0};project();if(out.late)toast('หมดเวลาแล้ว ระบบเล่นตานั้นแทน');}return out;}
  function project(){if(!room||!publicRoom)return;room.r={base:publicRoom.base,fee:publicRoom.fee};room.seats=seatsOf();const own=room.seats.findIndex(s=>s?.uid===Host.uid);room.sat=own>=0;
   if(publicRoom.state==='playing'||publicRoom.state==='result'){
    if(publicRoom.state==='playing'&&startedRound!==publicRoom.round){const first=startedRound!==null||publicRoom.turnNo===0;startedRound=publicRoom.round;if(first&&publicRoom.turnNo===0)setTimeout(()=>st&&window.miniTableEffect?.(st,'🃏 เริ่มรอบ '+publicRoom.round+'!',[]),200);}
    const offset=own<0?0:own,indices=Array.from({length:4},(_,i)=>(offset+i)%4),map=i=>(i-offset+4)%4,sync=own>=0&&privateHand?.round===publicRoom.round&&privateHand?.turn===publicRoom.turnNo;
    const hands=indices.map((p,i)=>publicRoom.state==='result'?(publicRoom.hands?.[p]||[]):i===0&&sync?privateHand.hand:Array(publicRoom.counts?.[p]||0).fill({s:'back',r:0}));
    const selected=G?.sel?.map(c=>c.id)||[];G={names:indices.map(p=>esc(seatsOf()[p]?.name||'ว่าง')),uids:indices.map(p=>seatsOf()[p]?.uid),hands,cur:map(publicRoom.cur),deck:Array(publicRoom.deckCount||0).fill(null),round:publicRoom.round,turnNo:publicRoom.turnNo,mySync:sync,seated:own>=0,drawn:publicRoom.drawn,over:publicRoom.state==='result',status:indices.map(p=>publicRoom.status?.[p]),auto:indices.map(p=>publicRoom.auto?.[p]),net:indices.map(p=>publicRoom.net?.[p]||0),hold:publicRoom.base*8,c:cfg(room.r),deadline:publicRoom.deadline,last:publicRoom.last?{...publicRoom.last,by:map(publicRoom.last.by)}:null,feed:(publicRoom.feed||[]).map(esc),sel:hands[0].filter(c=>selected.includes(c.id))};
    st=stageOf('kg-bg');if(!st.querySelector('#kmain'))st.innerHTML='';render(G.over);const flow=(publicRoom.tx||[]).filter(t=>t.reason?.startsWith('FLOW')).at(-1);
    if(flow){const key=publicRoom.round+'-'+flow.at+'-'+flow.from+'-'+flow.to+'-'+publicRoom.tx.length;if(lastFlow!==undefined&&lastFlow!==key){const from=map(seatsOf().findIndex(p=>p?.uid===flow.from)),to=map(seatsOf().findIndex(p=>p?.uid===flow.to));flowFx(from,to,flow.amount);}lastFlow=key;}else lastFlow='none';
    const resultKey=publicRoom.state==='result'?publicRoom.round+'-'+publicRoom.reason:null;const liveResult=resultKey&&lastResultFx!==undefined&&resultKey!==lastResultFx;if(liveResult)window.miniTableEffect?.(st,REASON[publicRoom.reason]||'🏆 จบรอบ',G.net.map((amount,p)=>({x:SEAT[p].ax,y:SEAT[p].ay,amount})).filter(c=>c.amount));lastResultFx=resultKey;
    if(G.over&&resultShown!==room.i+'-'+G.round){resultShown=room.i+'-'+G.round;S.kgHist=(publicRoom.hist||[]).map(h=>'รอบ '+h.round+' · '+esc(h.winner||'ไม่มีผู้ชนะ')+' · '+(REASON[h.why]||esc(h.why)));const finishedKey=resultShown;setTimeout(()=>{if(!room||!G?.over||resultShown!==finishedKey)return;showResult();},liveResult?1500:0);}
   }else{G=null;drawWaiting();}
  }
  function showResult(){const w=publicRoom.winner,winName=w!==undefined&&w!==null?esc(seatsOf()[w]?.name||''):'';
    const rows=G.names.map((n,p)=>({n,p,net:G.net[p],hand:G.hands[p]})).sort((a,b)=>b.net-a.net);
    modal(`<div class="kres"><h2>${REASON[publicRoom.reason]||'🏆 จบรอบ'}</h2><p class="note">ห้อง ${room.i+1} · รอบ ${G.round}${winName?' · ผู้ชนะ <b>'+winName+'</b>':''}</p>${rows.map(r=>`<div class="krow ${r.p===0&&G.seated?'me':''}"><span class="av sm" style="--c:${avColor(G.uids[r.p])}">${initial(r.n.replace(/&[a-z#0-9]+;/g,'?'))}</span><span class="kn">${r.p===0&&G.seated?'คุณ':r.n}<small>${r.hand.length?r.hand.map(lbl).join(' ')+' · '+total(r.hand)+' แต้ม':''}</small></span><b class="${r.net>0?'plus':r.net<0?'minus':''}">${r.net>0?'+':''}${fmt(r.net)}</b></div>`).join('')}<p class="note">จบรอบแล้ว ทุกคนลุกจากโต๊ะเพื่อให้คนที่รอได้เข้าเล่น · ทุนที่กันไว้และผลได้เสียส่งเข้าไปรษณีย์</p></div>`,[{t:'ออกจากห้อง',c:'pink',f:()=>{G=null;closeGame();}}]);}
  function drawWaiting(){if(!room||!publicRoom)return;st=stageOf('kg-bg');const index=publicRoom.seats.findIndex(s=>s?.uid===Host.uid),ready=index>=0&&publicRoom.ready[index]&&publicRoom.state!=='result',readyCount=publicRoom.state==='result'?0:publicRoom.ready.filter(Boolean).length,seated=publicRoom.seats.filter(Boolean).length;
   const offset=index<0?0:index;
   const seatHtml=[0,1,2,3].map(v=>{const p=(offset+v)%4,s=publicRoom.seats[p],rd=s&&publicRoom.ready[p]&&publicRoom.state!=='result';const pos=WAITSEAT[v];return `<div class="wseat ${s?'':'free'} ${rd?'rd':''} ${s?.uid===Host.uid?'me':''}" style="left:${pos.x}%;top:${pos.y}%">${s?avatar(s):'<span class="av empty">?</span>'}<b>${s?(s.uid===Host.uid?'คุณ':esc(s.name)):'ว่าง'}</b>${s?`<span class="rdtag">${rd?'✅ พร้อม':'⏳ รอพร้อม'}</span>`:''}</div>`;}).join('');
   let main;
   if(!publicRoom.open)main='<div class="wmsg">ห้องนี้ปิดแล้ว</div>';
   else if(index<0)main=`<div class="wmsg">${seated>=4?'ห้องเต็มแล้ว':'มีที่ว่าง '+(4-seated)+' ที่'}</div>${seated<4?'<button class="btn big-btn" id="sit">🪑 นั่งที่โต๊ะ</button>':''}`;
   else if(!ready)main=`<div class="wmsg">กดพร้อมเพื่อกันทุน <b>${fmt(publicRoom.base*8)}</b> กุศล + ${publicRoom.fee} เหรียญ</div><button class="btn orange big-btn" id="ready">✋ พร้อมเล่น</button>`;
   else main=`<div class="wmsg">${seated<4?'รอผู้เล่นอีก '+(4-seated)+' คน':'รอคนอื่นกดพร้อม'} · ครบแล้วเริ่มเอง</div>`;
   st.innerHTML=`<div class="lhead"><button class="rbtn" id="kback">‹ ห้องทั้งหมด</button><h2>ห้อง ${room.i+1}</h2><button class="rbtn" id="rule">📜</button></div><div class="wtable">${seatHtml}<div class="wcenter"><div class="wcount">${readyCount}<small>/4 พร้อม</small></div></div></div><div class="panel slim wpanel">${pills([[`✨ ฐาน ${fmt(publicRoom.base)}`],[`🪙 ${publicRoom.fee}/รอบ`],[`🔒 กัน ${fmt(publicRoom.base*8)}`]])}${main}${index>=0&&!ready?'<button class="btn gray sm" id="leave">ลุกจากโต๊ะ</button>':''}${index>=0&&ready?'<button class="btn gray sm" id="leave">ยกเลิกพร้อม · ลุกจากโต๊ะ</button>':''}${S.owner&&seated===4&&readyCount===4?'<button class="btn pink sm" id="startg">👑 เริ่มเกมทันที</button>':''}</div>`;
   const on=(id,f)=>{const e=st.querySelector('#'+id);if(e)e.onclick=f;};
   on('sit',async()=>{if(await action({type:'join'}))subscribe();});on('ready',()=>action({type:'ready'}));on('leave',async()=>{if(!await action({type:'leave'}))return;drawWaiting();});on('rule',()=>ruleModal(room.r));on('startg',()=>action({type:'start'}));on('kback',()=>{if(index>=0&&ready){toast('กดยกเลิกพร้อมก่อน หรืออยู่รอที่โต๊ะ');return;}lobby();});
  }
  function subscribe(){stop();if(!room)return;const key='kang-'+room.i;stopRoom=Host.watchWorld(key,data=>{if(data){publicRoom=data;project();}});stopHand=Host.watchGameView(key,data=>{privateHand=data;project();});
    /* Only one device should ask the server to auto-play a timed-out turn: the player whose turn it is first, then the others one by one as back-up. */
    tick=setInterval(async()=>{if(!G||G.over)return;const left=G.deadline-time(),label=st?.querySelector('.kav.turn .ktm');if(label)label.textContent=Math.max(0,Math.ceil(left/1000));const wait=G.seated?(G.cur===0?300:1800+G.cur*1500):9000;if(left<=-wait&&!acting&&!advancePending){advancePending=true;await action({type:'advance'});advancePending=false;}},250);}
  async function waiting(i){stop();G=null;room={i,r:S.kang[i],seats:[]};privateHand=null;publicRoom=null;startedRound=null;const out=await action({type:'status'});if(out)subscribe();}
  function ruleModal(r){const c=cfg(r);const pay=(a,b,cl='')=>`<div class="lad ${cl}"><span class="ic" style="font-size:.8rem;font-weight:700">${a}</span><b>${fmt(b)}</b></div>`;
    rules('ไพ่แคง',[['🃏','แต้มน้อยสุดชนะ','คนละ 5 ใบ · A=1 · J Q K=10'],['🔄','จั่วแล้วทิ้ง','แต้มเดียวกันทิ้งพร้อมกันได้'],['⚡','ไหล','คนก่อนหน้าทิ้งแต้มที่เรามี ลงได้เลยไม่ต้องจั่ว'],['📢','แคง','กดตอนต้นตา เปิดไพ่วัดแต้ม'],['💥','น็อค','ไพ่หมดมือ ชนะ ×2'],['🎴','ตอง / สี่ใบเปิด','แจกมาได้ ชนะทันที'],['⏱️','ตาละ 20 วิ','หมดเวลาระบบเล่นแทน'],['✋','ครบ 4 คนพร้อม','เกมเริ่มเอง · 🪙 '+(r?.fee??S.rules.fees.kang)+'/รอบ']],
    `<div class="rtitle">กุศลต่อคน (ฐาน ${fmt(c.base)})</div>${pay('🏆 ชนะ / แคงเข้า',c.base,'good')}${pay('📢 แคงรอบแรกเข้า ×2',c.base*c.first,'good')}${pay('💥 น็อค ×2',c.base*c.knock,'good')}${pay('🎴 ตองเปิด ×2',c.base*c.tri,'good')}${pay('🎴 สี่ใบเปิด ×3',c.base*c.four,'good')}${pay('😵 แคงล่ม จ่ายทุกคน',c.base,'bad')}${pay('🏳️ ยอมแพ้ จ่ายทุกคน',c.base,'bad')}<div class="rtitle">⚡ ไหล (คนทิ้งจ่ายคนไหล)</div>${pay('1 ใบ',c.flow[1])}${pay('คู่',c.flow[2])}${pay('ตอง',c.flow[3])}`)}
  const clampX=x=>Math.max(18,Math.min(82,x));
  function flowFx(from,to,amount){if(!st)return;const fxl=document.createElement('div');fxl.className='kfxl';fxl.innerHTML=`<div class="kflash"></div><div class="kbolt">⚡</div><div class="kflowt">ไหล!</div><div class="kamt minus" style="left:${clampX(SEAT[from].ax)}%;top:${SEAT[from].ay}%">−${fmt(amount)}</div><div class="kamt plus" style="left:${clampX(SEAT[to].ax)}%;top:${SEAT[to].ay}%">+${fmt(amount)}</div>`;st.appendChild(fxl);setTimeout(()=>fxl.remove(),1900);}
  function canFlow(p){return G.mySync&&!G.drawn&&G.last&&G.last.by!==p&&G.cur===p&&G.hands[p].some(c=>c.r===G.last.cards[0].r);}
  function render(reveal){
    if(!st||!G)return;const my=G.hands[0],myTurn=G.mySync&&G.cur===0&&!G.over&&G.status[0]!=='FORFEITED';
    let h='';
    [1,2,3].forEach(p=>{const s=SEAT[p],n=G.hands[p].length;
      h+=`<div class="kav ${G.cur===p&&!G.over?'turn':''}" style="left:${s.ax}%;top:${s.ay}%"><div class="kface" style="background:${avColor(G.uids[p])}">${initial(G.names[p])}</div><b>${G.names[p]}</b><span class="kcnt">🃏${n}</span>${G.auto[p]?'<span class="kchip">⚡AUTO</span>':''}${G.status[p]==='FORFEITED'?'<span class="kchip">ยอมแพ้</span>':''}${G.cur===p&&!G.over?'<span class="ktm">20</span>':''}</div>`;
      h+=`<div class="kbacks ${s.v?'v':''}" style="left:${s.bx}%;top:${s.by}%">${(reveal?G.hands[p].map(c=>`<img src="${img(c)}" alt="${lbl(c)}">`):[...Array(n)].map(()=>`<img src="${IMG['k-back']}" alt="">`)).join('')}</div>`});
    const dn=G.deck.length;h+=`<div class="kpile" style="left:37%;top:47.3%">${dn?[...Array(Math.min(4,Math.ceil(dn/8)))].map((_,i)=>`<img src="${IMG['k-back']}" style="transform:translate(${-i*.35}cqw,${-i*.35}cqw)" alt="">`).join(''):''}<span class="kbadge">${dn}</span></div>`;
    if(G.last)h+=`<div class="kdisc" style="left:59%;top:47.3%">${G.last.cards.map((c,i)=>`<img src="${img(c)}" style="transform:translateX(${(i-(G.last.cards.length-1)/2)*6}cqw) rotate(${(i-(G.last.cards.length-1)/2)*7}deg)" alt="${lbl(c)}">`).join('')}<span class="kwho">${G.names[G.last.by]} ทิ้ง</span></div>`;
    h+=`<div class="kfeed">${G.feed.slice(0,3).map((f,i)=>`<div style="opacity:${1-i*.3}">${f}</div>`).join('')}</div>`;
    if(G.seated){h+=`<div class="kav me ${myTurn?'turn':''}" style="left:${SEAT[0].ax}%;top:${SEAT[0].ay}%"><div class="kface">คุณ</div><span class="kcnt">${total(my)} แต้ม</span>${myTurn?'<span class="ktm">20</span>':''}${G.status[0]==='FORFEITED'?'<span class="kchip">ยอมแพ้</span>':''}</div>`;
      h+=`<div class="khand">${my.map((c,i)=>`<img class="${G.sel.includes(c)?'up':''}" data-i="${i}" src="${img(c)}" alt="${lbl(c)}">`).join('')}</div>`;}
    else h+=`<div class="kav" style="left:${SEAT[0].ax}%;top:${SEAT[0].ay}%"><div class="kface" style="background:${avColor(G.uids[0])}">${initial(G.names[0])}</div><b>${G.names[0]}</b><span class="kcnt">🃏${my.length}</span></div>`;
    const selSame=G.sel.length&&G.sel.every(c=>c.r===G.sel[0].r);const fl=myTurn&&canFlow(0);
    h+=`<div class="kbtns">${myTurn&&!G.drawn?`<button class="btn pink" id="kkang">📢 แคง</button><button class="btn" id="kdraw">จั่ว</button>`:''}${fl?`<button class="btn grape" id="kflow">⚡ ไหล</button>`:''}${myTurn&&G.drawn?`<button class="btn orange" id="kdisc" ${selSame?'':'disabled'}>ทิ้ง${G.sel.length>1?' '+G.sel.length+' ใบ':''}</button>`:''}${G.sel.length?'<button class="btn gray" id="kcan">ยกเลิก</button>':''}${!myTurn&&!G.over?`<span class="kwait">${!G.seated?'👀 กำลังชม · ตาของ '+G.names[G.cur]:G.status[0]==='FORFEITED'?'คุณยอมแพ้แล้ว รอจบรอบ':'รอ '+G.names[G.cur]+' เล่น…'}</span>`:''}${G.over?'<button class="btn pink" id="kres">ดูผลและออกจากห้อง</button>':''}</div>`;
    h+=`<div class="ktop"><button class="btn sm gray" id="khelp">📜</button>${G.seated&&!G.over&&G.status[0]!=='FORFEITED'?'<button class="btn sm gray" id="kff">🏳️</button>':''}${S.owner&&!G.over?'<button class="btn sm pink" id="kstop" title="ยุติรอบ">⛔</button>':''}<span class="kroom">ห้อง ${room.i+1} · รอบ ${G.round} · ฐาน ${fmt(G.c.base)}${G.seated?`<br>🔒 ${fmt(G.hold)} · <span class="${G.net[0]>0?'plus':G.net[0]<0?'minus':''}">${G.net[0]>=0?'+':''}${fmt(G.net[0])}</span>`:''}</span></div>`;
    let main=st.querySelector('#kmain');if(!main){st.innerHTML='<div id="kmain"></div>';main=st.querySelector('#kmain')}
    main.innerHTML=h;
    st.querySelectorAll('.khand img').forEach(im=>im.onclick=()=>{const c=my[+im.dataset.i];const j=G.sel.indexOf(c);if(j>=0)G.sel.splice(j,1);else{if(G.sel.length&&G.sel[0].r!==c.r)G.sel=[];G.sel.push(c)}render()});
    const on=(id,f)=>{const e=st.querySelector('#'+id);if(e)e.onclick=f};
    on('kkang',()=>modal('<h2>📢 ต้องการแคงหรือไม่?</h2><p>แต้มในมือคุณตอนนี้ <b>'+total(my)+'</b> แต้ม ถ้ามีคนแต้มน้อยกว่า คุณต้องจ่ายทุกคน</p>',[{t:'ยกเลิก',c:'gray'},{t:'ยืนยันแคง',c:'pink',f:()=>{if(G.cur===0&&!G.drawn)action({type:'kang'})}}]));
    on('kdraw',()=>action({type:'draw'}));
    on('kflow',()=>{const r=G.last.cards[0].r;let cs=G.sel.filter(c=>c.r===r);if(!cs.length)cs=my.filter(c=>c.r===r);action({type:'flow',cards:cs.map(c=>c.id)})});
    on('kdisc',()=>action({type:'discard',cards:G.sel.map(c=>c.id)}));
    on('kcan',()=>{G.sel=[];render()});on('kff',()=>modal('<h2>ยอมแพ้?</h2><p>จ่ายกุศลตามกติกาและออกจากรอบนี้</p>',[{t:'เล่นต่อ',c:'gray'},{t:'ยืนยันยอมแพ้',c:'pink',f:()=>action({type:'forfeit'})}]));
    on('khelp',()=>ruleModal(room.r));on('kres',showResult);
    on('kstop',()=>modal('<h2>ยุติรอบฉุกเฉิน?</h2><p>รอบเป็นโมฆะ คืนทุนและค่าเหรียญให้ผู้เล่นทุกคนที่ไปรษณีย์</p>',[{t:'ยกเลิก',c:'gray'},{t:'ยืนยัน',c:'pink',f:()=>action({type:'void'})}]));
  }
  /* Idle 5 minutes: leave a waiting seat (normal refund). Inside a running round auto-play simply continues. */
  async function idle(){if(!room||!publicRoom||publicRoom.state==='playing')return;if(publicRoom.seats.some(s=>s?.uid===Host.uid))await action({type:'leave'});}
  return {title:'🃏 ไพ่แคง',open,close,idle,refresh(){if(G&&st)render(G.over);else if(!room)lobby()},canLeave(){if(G&&!G.over&&G.seated){modal('<h2>ออกจากหน้านี้?</h2><p>หากออกจากหน้านี้ ระบบอัตโนมัติจะเล่นแทนเมื่อถึงเทิร์นของคุณ</p>',[{t:'อยู่ต่อ',c:'gray'},{t:'ออกจากหน้า',c:'pink',f:closeGame}]);return false}return true}};
})();

/* ---------- หนีผีฮาโลวีน ---------- */
GAMES.br=(()=>{
  const N=9,GX=12,GW=76,CELL=GW/N,GY=27.6;
  const COL=['#F2B544','#F27E9B','#6CC9A8','#8FB3F2','#C59BF2','#F29B6C','#9BD3E0','#E0C59B'];
  const ITEMS={bomb:['br-pumpkin-bomb','ฟักทองระเบิด','ปาโดนช่องเป้าและ 8 ช่องรอบๆ'],cloak:['br-ghost-cloak','ผ้าคลุม','กันดาเมจครั้งถัดไป 1 ครั้ง'],shoes:['br-wing-shoes','รองเท้าปีก','เดินได้ 3 ช่องในตาเดียว'],candy:['br-candy','ลูกอม','+❤️1 (สูงสุด 3)'],smoke:['br-smoke','ควันล่องหน','ตานี้ไม่มีอะไรโดนเรา']};
  let st,R=null,tick;
  const cx=x=>GX+CELL*(x+.5);
  const topCqw=y=>GY/100*177.69+CELL*(y+.5);
  const dist=(a,b,c,d)=>Math.max(Math.abs(a-c),Math.abs(b-d));
  const inFog=(x,y,l)=>Math.min(x,y,N-1-x,N-1-y)<l;
  let watching=false,stopRoom=null,stopHand=null,publicRoom=null,privateAction=null,resultShown='',advancing=false,lastTurnKey='';
  function stop(){watching=false;stopRoom?.();stopHand?.();stopRoom=stopHand=null;clearInterval(tick);}
  async function action(input){const out=await cloud('br',{...input,...(R?{round:R.round,turn:R.turn}:{})});if(out&&CUR==='br'){publicRoom=out.room;privateAction={round:out.room.round,turn:out.room.turn,action:out.mine};project();if(out.late)toast('หมดเวลาตานี้แล้ว กรุณาดูตาล่าสุด');}return out;}
  function project(){if(!publicRoom)return;S.br={...S.br,open:publicRoom.open,fee:publicRoom.fee};S.brHist=(publicRoom.hist||[]).map(h=>({no:h.round,win:h.result.filter(p=>p.rank===1).map(p=>esc(p.name)).join(', '),order:h.result.map(p=>p.rank+' '+esc(p.name)+' (ตา '+p.turn+' '+esc(p.cause)+')').join(' · ')}));
   if((publicRoom.state==='playing'||publicRoom.state==='result')&&(publicRoom.players||[]).length){
    const key=publicRoom.round+'-'+publicRoom.turn;const fresh=key!==lastTurnKey;lastTurnKey=key;
    R={...structuredClone(publicRoom),pend:fresh?(publicRoom.pend||[]):[],fog:publicRoom.fog||0,fogWarn:publicRoom.fogWarn||0,turn:publicRoom.turn||0,warn:(publicRoom.warn||[]).map(p=>[p.x,p.y]),mode:R?.mode||null,busy:false,players:publicRoom.players.map(p=>({...p,n:esc(p.n),me:p.uid===Host.uid,col:COL[p.i%COL.length],act:p.uid===Host.uid&&privateAction?.round===publicRoom.round&&privateAction?.turn===publicRoom.turn?privateAction.action:p.confirmed?{t:'stay'}:null})),log:(publicRoom.log||[]).map(esc)};
    st=stageOf('br-bg');st.style.setProperty('--fog',`url(${IMG['br-fog']})`);if(!st.querySelector('#brbase'))st.innerHTML='';render();
    if(!R.players.some(p=>p.me))st.querySelector('.brbar').innerHTML='<span class="brhint">👀 กำลังชมการแข่งขัน</span>';
    if(R.done&&resultShown!==String(R.round)){resultShown=String(R.round);setTimeout(showResult,900);}
   }else{R=null;drawLobby();}
  }
  const money=n=>`<b class="${n>0?'plus':'minus'}">${n>0?'+':''}${fmt(n)}</b>`;
  function showResult(){if(!R)return;const res=R.result||[],drop=R.dropped||[],paid=res.some(p=>Number.isFinite(p.merit));modal('<div class="brres"><h2>🏁 ผลการแข่งรอบ '+R.round+'</h2>'+(res.length||drop.length?res.map(p=>`<div class="brrow r${p.rank} ${p.uid===Host.uid?'me':''}">${p.rank===1?`<img class="crown" src="${IMG['br-crown']}" alt="">`:`<span class="rk">${p.rank}</span>`}<span class="av sm" style="--c:${avColor(p.uid)}">${initial(p.name)}</span><span class="kn">${esc(p.name)}<small>${p.rank===1?'รอดคนสุดท้าย':'ตกรอบตา '+p.turn+' · '+esc(p.cause)}</small></span>${paid?money(p.merit):''}</div>`).join('')+drop.map(p=>`<div class="brrow ${p.uid===Host.uid?'me':''}"><span class="rk">📵</span><span class="av sm" style="--c:${avColor(p.uid)}">${initial(p.name)}</span><span class="kn">${esc(p.name)}<small>หลุดจากเกม · ไม่มีสิทธิ์รับรางวัล</small></span>${money(p.merit)}</div>`).join(''):'<p>รอบนี้เป็นโมฆะ ค่าเข้าคืนในไปรษณีย์แล้ว</p>')+(paid?'<p class="note">ยอดบวกส่งเข้าไปรษณีย์ · ยอดติดลบหักจากกุศลอัตโนมัติ (ไม่ต่ำกว่า 0)</p>':'')+'</div>',[{t:'ดูสนาม',c:'gray'},{t:'กลับห้องรอ',f:()=>{R=null;drawLobby();}}]);}
  async function open(){stop();R=null;publicRoom=null;privateAction=null;lastTurnKey='';const out=await action({type:'status'});if(CUR!=='br')return;if(!out)throw new Error('ตรวจสถานะห้องไม่สำเร็จ กดโหลดอีกครั้งได้โดยไม่เสียค่าเข้า');subscribe();}
  const liveMe=()=>R&&!R.done&&R.players.some(p=>p.me&&p.alive&&!p.dc);
  /* Leaving the arena (back button, idle kick, page closed) during a live match counts as disconnected: the server plays for you. */
  function close(){if(liveMe()){const send=()=>Host.cloud('br',{type:'disconnect'}).catch(()=>{});acting?cloudWait.then(send):send();}stop();R=null;publicRoom=null;}
  async function idle(){if(liveMe())return;if((publicRoom?.seats||[]).some(s=>s.uid===Host.uid)&&publicRoom.state==='waiting')await action({type:'leave'});}
  function drawLobby(){st=stageOf('br-bg');const r=publicRoom||{seats:[],state:'waiting'},seats=r.seats||[],joined=seats.some(s=>s.uid===Host.uid),open=!S.rules.off('br')&&(r.open??true),fee=r.state==='waiting'&&!joined?S.rules.fees.br:(r.fee??S.rules.fees.br);
    const slots=[...Array(8)].map((_,i)=>{const s=seats[i];return `<div class="bslot ${s?'':'free'} ${s?.uid===Host.uid?'me':''}">${s?avatar(s):'<span class="av empty">?</span>'}<b>${s?(s.uid===Host.uid?'คุณ':esc(s.name)):'ว่าง'}</b></div>`;}).join('');
    const need=Math.max(0,BR_MIN-seats.length);
    st.innerHTML=`<div class="lhead"><h2>🎲 หนีผีฮาโลวีน</h2><button class="rbtn" id="brRule">📜 กติกา</button></div><div class="panel brlobby">${open?`<div class="wmsg">${r.state==='playing'?'กำลังแข่งอยู่ รอบหน้ากลับมาใหม่นะ':need?'ต้องมี 6–8 คน · ขาดอีก '+need+' คน':'ครบแล้ว! คนในห้องกดเริ่มได้เลย'}</div><div class="bslots">${slots}</div>${pills([[`🪙 ค่าเข้า ${fee} เหรียญ`,S.coins>=fee||joined],[`👥 ${seats.length}/8 คน`],['🏆 ที่ 1 +100,000']])}<div class="brbtns">${!joined&&r.state!=='playing'?`<button class="btn big-btn" id="brJoin" ${seats.length>=8?'disabled':''}>🎟️ เข้าร่วม (${fee} เหรียญ)</button>`:''}${joined?'<button class="btn gray sm" id="brLeave">ออกจากห้อง · คืนเหรียญ</button>':''}${(joined||S.owner)&&r.state!=='playing'?`<button class="btn pink big-btn" id="brStart" ${seats.length>=BR_MIN?'':'disabled'}>▶ เริ่มเกม</button>`:''}</div>`:'<div class="wmsg">🌙 ห้องปิดชั่วคราว</div><p class="note" style="text-align:center">แวะมาใหม่อีกครั้งนะ</p>'}</div>`;
    const on=(id,f)=>{const e=st.querySelector('#'+id);if(e)e.onclick=f;};
    on('brRule',showRules);on('brJoin',async()=>{if(await action({type:'join'}))subscribe();});on('brLeave',async()=>{if(await action({type:'leave'})){R=null;drawLobby();}});on('brStart',async()=>{if(await action({type:'start'}))subscribe();});subscribe();}
  function subscribe(){if(watching)return;watching=true;stopRoom=Host.watchWorld('br',data=>{if(data){publicRoom=data;project();}});stopHand=Host.watchGameView('br',data=>{privateAction=data?{...data}:null;project();});
    tick=setInterval(async()=>{if(!R||R.done)return;const left=R.deadline-time(),label=st?.querySelector('#brt');if(label){label.textContent=Math.max(0,Math.ceil(left/1000));label.classList.toggle('hot',left<10000);}const mine=R.players.findIndex(p=>p.me),wait=mine<0?9000:300+mine*1500;if(left<=-wait&&!acting&&!advancing){advancing=true;await action({type:'advance'});advancing=false;}},250);}
  function showRules(){rules('หนีผีฮาโลวีน',[['🗺️','สนาม 9×9','คนละ ❤️❤️❤️'],['⏱️','ตาละ 35 วิ','ทุกคนเลือกท่าพร้อมกัน'],['🚶','เดิน 1 ช่อง','ยืนช่องเดียวกับคนอื่นได้'],['⛏️','ขุด','40% ได้ไอเทม พกได้ 2 ชิ้น'],['🎃','ปาฟักทอง','ไกลไม่เกิน 3 ช่อง โดนเสีย ❤️1'],['🌑','เงาเตือน','ตาหน้าฟักทองตกจากฟ้า หลบด่วน'],['🌫️','หมอกผี','ทุก 3 ตาบีบสนามเข้ามา อยู่ในหมอกเสีย ❤️'],['👻','ตกรอบเป็นผี','หลอกคนอื่นให้เสียตาได้']],
    `<div class="rtitle">ไอเทม (ขุดเจอเท่านั้น)</div><div class="rgrid">${Object.values(ITEMS).map(([k,n,d])=>`<div class="rc"><img src="${IMG[k]}" style="width:2.6rem;height:2.6rem;object-fit:contain" alt=""><b>${n}</b><small>${d}</small></div>`).join('')}</div><div class="rtitle">🏆 รางวัลตามอันดับ (6–8 คน · ค่าเข้า ${S.rules.fees.br} เหรียญ)</div>${[['👑 ที่ 1 (เสมอได้ทุกคน)',100000],['ที่ 2',40000],['ที่ 3',30000],['ที่ 4',-15000],['คนสุดท้าย',-45000],['📵 หลุดจากเกม',-75000]].map(([t,n])=>`<div class="lad ${n>0?'good':'bad'}"><span class="ic" style="font-size:.8rem;font-weight:700">${t}</span><b>${n>0?'+':''}${fmt(n)}</b></div>`).join('')}<p class="note">ที่ 4 ถึงคนสุดท้ายติดลบไล่เท่า ๆ กันจาก −15,000 ถึง −45,000 · ไม่เลือกท่า 2 ตาติด ออกจากหน้าสนาม หรือนิ่ง 5 นาที = หลุด ระบบเล่นแทน ได้ −75,000 อย่างเดียว</p>`)}
  const alive=()=>R.players.filter(p=>p.alive),me=()=>R.players.find(p=>p.me)||{alive:false,items:[],hauntCd:1,act:null};
  function choose(a){if(!R||R.done)return;R.mode=null;action({type:'choose',action:a});}
  function cellClick(x,y){const m=me();if(!R.mode||R.busy)return;const d=dist(x,y,m.x,m.y);if(R.mode==='move'&&d===1)choose({t:'move',x,y});else if(R.mode==='shoes'&&d<=3&&d>0)choose({t:'item',k:'shoes',x,y});else if(R.mode==='throw'&&d<=3&&d>0)choose({t:'throw',x,y});else if(R.mode==='bomb'&&d<=3&&d>0)choose({t:'item',k:'bomb',x,y});}
  function fxLayer(){let l=st.querySelector('#brfxl');if(!l){l=document.createElement('div');l.id='brfxl';st.appendChild(l);}return l;}
  function playPend(list){if(!list.length)return;const l=fxLayer();list.forEach((f,i)=>{const left=cx(f.x),top=topCqw(f.y);setTimeout(()=>{
      if(/❤️/.test(f.t)){const pk=document.createElement('img');pk.className='brfly sky';pk.src=IMG['br-pumpkin'];pk.style.left=left+'cqw';pk.style.top=(top-40)+'cqw';l.appendChild(pk);requestAnimationFrame(()=>{pk.style.top=top+'cqw';});setTimeout(()=>{pk.classList.add('boom');},560);setTimeout(()=>pk.remove(),1000);}
      if(/ไอเทม/.test(f.t)){const h=document.createElement('img');h.className='brhole';h.src=IMG['br-dig-hole'];h.style.left=left+'cqw';h.style.top=top+'cqw';l.appendChild(h);setTimeout(()=>h.remove(),1600);}
      const t=document.createElement('div');t.className='brfx';t.style.left=left+'cqw';t.style.top=(top-4)+'cqw';t.textContent=f.t;l.appendChild(t);setTimeout(()=>t.remove(),1500);},i*120);});}
  function render(){
    if(!st||!R)return;const m=me();let h='';
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){const f=inFog(x,y,R.fog),fw=!f&&inFog(x,y,R.fogWarn),w=R.warn.some(a=>a[0]===x&&a[1]===y);
      let tgt='';if(R.mode&&m.alive){const d=dist(x,y,m.x,m.y);if((R.mode==='move'&&d===1)||((R.mode==='throw'||R.mode==='bomb'||R.mode==='shoes')&&d>0&&d<=3))tgt='tg'}
      h+=`<div class="brc ${f?'fog':''} ${fw?'fogw':''} ${tgt}" data-x="${x}" data-y="${y}" style="left:${GX+CELL*x}cqw;top:${topCqw(y)-CELL/2}cqw;width:${CELL}cqw;height:${CELL}cqw">${w?`<img class="brw" src="${IMG['br-warn-shadow']}" alt="">`:''}</div>`}
    const left=alive().length;
    h+=`<div class="brtop"><span class="brtag">ตาที่ ${R.turn}</span><b id="brt">35</b><span class="brtag">รอด ${left}/${R.players.length}</span></div>`;
    h+=`<div class="brlog">${R.log.slice(0,2).map(l=>`<div>${l}</div>`).join('')||'<div>เลือกท่าภายใน 35 วิ ทุกคนเล่นพร้อมกัน</div>'}${R.fogWarn>R.fog?'<div class="warnline">⚠️ หมอกจะบีบเข้ามาตาหน้า!</div>':''}</div>`;
    let bar='';
    if(R.done){const win=(R.result||[]).filter(p=>p.rank===1).map(p=>esc(p.name)).join(', ');bar=`<span class="brhint">👑 ${win||'จบเกม'} ชนะ!</span><button class="btn sm" id="brres">ดูผล</button>`;}
    else if(!m.alive&&R.players.some(p=>p.me)){const t=alive();bar=m.hauntCd>0?`<span class="brhint">👻 คุณเป็นผีแล้ว หลอกได้อีกใน ${m.hauntCd} ตา</span>`:(m.act&&m.act.t==='haunt'?`<span class="brhint">👻 จะหลอก ${R.players[m.act.v].n} ตาหน้า</span>`:`<span class="brhint">👻 เลือกคนที่จะหลอก:</span>${t.filter(a=>a.i!==m.lastHaunt).map(a=>`<button class="btn sm grape" data-h="${a.i}">${a.n}</button>`).join('')}`)}
    else if(m.dc)bar='<span class="brhint">📵 คุณหลุดออกจากเกม ระบบเล่นแทนจนจบรอบ</span>';
    else if(m.frozen)bar='<span class="brhint">👻 คุณโดนผีหลอก ตานี้ทำอะไรไม่ได้</span>';
    else if(m.act)bar=`<span class="brhint">✅ เลือกแล้ว: ${({move:'เดิน',dig:'ขุด',throw:'ปาฟักทอง',stay:'ยืนเฉยๆ',item:'ใช้ไอเทม'})[m.act.t]} · รอทุกคน…</span>`;
    else if(R.mode)bar=`<span class="brhint">${R.mode==='move'?'แตะช่องเรืองแสงข้างตัวเพื่อเดิน':'แตะช่องเป้าหมาย (ไม่เกิน 3 ช่อง)'}</span><button class="btn sm gray" id="brcan">ยกเลิก</button>`;
    else bar=`<button class="abtn" data-a="move"><span>🚶</span>เดิน</button><button class="abtn" data-a="dig"><span>⛏️</span>ขุด</button><button class="abtn" data-a="throw"><img src="${IMG['br-pumpkin']}" alt="">ปา</button><button class="abtn" data-a="stay"><span>🧍</span>ยืน</button>${m.items.map(k=>`<button class="abtn it" data-it="${k}"><img src="${IMG[ITEMS[k][0]]}" alt="">${ITEMS[k][1]}</button>`).join('')}`;
    h+=`<div class="brbar">${bar}</div>`;
    let base=st.querySelector('#brbase'),pl=st.querySelector('#brpl');
    if(!base){st.innerHTML='<div id="brbase"></div><div id="brpl"></div><div id="brfxl"></div>';base=st.querySelector('#brbase');pl=st.querySelector('#brpl')}
    base.innerHTML=h;
    const winners=new Set((R.done?(R.result||[]).filter(p=>p.rank===1):[]).map(p=>p.uid));
    R.players.forEach(p=>{let e=pl.querySelector('[data-p="'+p.i+'"]');if(!e){e=document.createElement('div');e.dataset.p=p.i;pl.appendChild(e)}
      e.className=`brp ${p.me?'me':''} ${p.alive?'':'dead'} ${p.frozen?'frz':''}`;e.style.left=cx(p.x)+'cqw';e.style.top=topCqw(p.y)+'cqw';e.style.setProperty('--c',p.col);
      e.innerHTML=p.alive?`${winners.has(p.uid)?`<img class="brcrown" src="${IMG['br-crown']}" alt="">`:''}<span class="brdot">${p.me?'คุณ':initial(p.n)}</span><span class="brhp">${'❤️'.repeat(Math.max(0,p.hp))}</span>${p.cloak?'<span class="brst">🧥</span>':''}${p.frozen?'<span class="brst">👻</span>':''}${p.dc?'<span class="brst">📵</span>':''}`:`<img class="brghost" src="${IMG['br-ghost']}" alt=""><span class="brname">${p.me?'คุณ':initial(p.n)}</span>`});
    base.querySelectorAll('.brc').forEach(c=>c.onclick=()=>cellClick(+c.dataset.x,+c.dataset.y));
    base.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='dig')choose({t:'dig'});else if(a==='stay')choose({t:'stay'});else{R.mode=a;render()}});
    base.querySelectorAll('[data-it]').forEach(b=>b.onclick=()=>{const k=b.dataset.it;if(k==='bomb'||k==='shoes'){R.mode=k;render()}else choose({t:'item',k})});
    base.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{choose({t:'haunt',v:+b.dataset.h})});
    const cn=base.querySelector('#brcan');if(cn)cn.onclick=()=>{R.mode=null;render()};const rs=base.querySelector('#brres');if(rs)rs.onclick=showResult;
    if(S.owner&&!R.done){const s=document.createElement('button');s.className='btn sm pink brstop';s.textContent='⛔';s.title='ยุติรอบฉุกเฉิน';s.onclick=()=>modal('<h2>ยุติรอบและคืนค่าเข้า?</h2>',[{t:'ยกเลิก',c:'gray'},{t:'ยืนยัน',c:'pink',f:()=>action({type:'void'})}]);base.appendChild(s);}
    playPend(R.pend);R.pend=[];
  }
  return {title:'🎲 หนีผีฮาโลวีน',open,close,idle,refresh(){if(R&&st)render();else drawLobby()},canLeave(){if(liveMe()){modal('<h2>ออกจากสนาม?</h2><p>ถ้าออกตอนนี้จะถือว่า <b>หลุดจากเกม</b> ระบบเล่นแทนจนจบรอบ ได้ <b class="minus">−75,000</b> กุศล และไม่มีสิทธิ์รับรางวัลอันดับ</p>',[{t:'อยู่ต่อ',c:'gray'},{t:'ออก',c:'pink',f:closeGame}]);return false}return true}};
})();

/* ---------- ตุ่นบุกสวน! + จัดตะกร้าให้แม่มด (isolated screens, server rounds) ---------- */
function soloScreen(key,title,mount){let screen=null;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const api={S,time,offer:()=>soloState[key+'Offer']||null,current:()=>soloState[key]||null,cost:()=>S.rules.fees[key],closed:()=>S.rules.off(key),
  async start(){const out=await cloud('minigames',{type:key+'-start'});return out?.state?.[key]?.phase==='active'?out.state[key]:null;},
  async hits(round,hits){return !!await cloud('minigames',{type:'mole-hits',round,hits});},
  async send(round,witch,items){const out=await cloud('minigames',{type:'basket-send',round,witch,items});return out?.state?.basket||null;},
  async finish(round){const cur=soloState[key];if(cur&&cur.id===round&&cur.phase==='active'&&!(key==='basket'&&cur.sent?.every(Boolean))){const w=cur.until+400-time();if(w>0)await sleep(w);}
   const out=await cloud('minigames',{type:key+'-finish',round});const r=out?.state?.[key];renderWallet();return r&&r.id===round&&r.phase==='done'?r:null;}};
 return {title,async open(){await cloud('minigames',{type:'status'});if(CUR!==key)return;const g=$('#gbody');g.innerHTML='';const host=document.createElement('div');host.className='solohost';g.appendChild(host);screen=mount(host,api);},
  close(){screen?.close();screen=null;},refresh(){},
  canLeave(){if(!screen||screen.canLeave())return true;modal('<h2>ออกจากเกม?</h2><p>เวลาในรอบยังเดินต่อ ผลที่ทำได้บันทึกแล้ว กลับมาเปิดเกมนี้เพื่อรับผลได้</p>',[{t:'เล่นต่อ',c:'gray'},{t:'ออก',c:'pink',f:closeGame}]);return false;}};}
GAMES.mole=soloScreen('mole','🔨 ตุ่นบุกสวน!',mountMole);
GAMES.basket=soloScreen('basket','🧺 จัดตะกร้าให้แม่มด',mountBasket);

cloud('minigames',{type:'status'}).then(renderHub);
addEventListener('pagehide',()=>{if(CUR)GAMES[CUR].close();});
const stopControls=Host.watchWorld("minigames",config=>{if(config&&(!S.controlRevision||!config.controlRevision||config.controlRevision>=S.controlRevision)){applySettings(config);if(!CUR)renderHub();}});addEventListener("pagehide",()=>stopControls?.());
/* Only the owner account (world/minigameOwner, set by tools/set-minigame-owner.mjs) sees the control panel. Without that doc, admins keep it. */
const stopOwner=Host.watchWorld('minigameOwner',d=>{S.owner=d?.uid?d.uid===Host.uid:!!Host.admin;renderHub();});addEventListener('pagehide',()=>stopOwner?.());
/* A player dropped from a BR match sees the notice once, the next time the minigames open. */
{let done=false,stop=null;stop=Host.watchGameView('br',v=>{if(done)return;done=true;setTimeout(()=>stop?.(),0);if(!v?.dc||!v.round)return;let seen='';try{seen=localStorage.getItem('mg-br-dc')||'';}catch{}if(seen===String(v.round))return;try{localStorage.setItem('mg-br-dc',String(v.round));}catch{}modal(`<h2>📵 หลุดออกจากเกม</h2><p>${BR_DC_MSG}</p><p class="minus" style="font-weight:800;font-size:1.1rem">−75,000 กุศล</p>`);});}
/* Idle kick: no touch or key for 5 minutes on any minigame screen closes the game and returns to the minigame home. */
var lastTouch=Date.now();for(const e of ['pointerdown','keydown','touchstart','wheel'])addEventListener(e,()=>{lastTouch=Date.now();},{capture:true,passive:true});
setInterval(async()=>{if(!CUR||Date.now()-lastTouch<5*60000)return;const k=CUR;lastTouch=Date.now();try{await GAMES[k].idle?.();}catch{}if(CUR===k){closeGame();modal('<h2>⏰ ไม่ได้เล่นนานเกิน 5 นาที</h2><p>ระบบพากลับหน้าแรกมินิเกมแล้ว</p>');}},10000);
