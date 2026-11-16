import {CATALOG} from './catalog.js?h=fb20d645';
import {BOAT_ALPACA} from './boat-engine.js?h=8c7e02f8';
/* fix50 🌊 แข่งผีพรายปีนเสา — กติกาเป็นฟังก์ชันล้วน (ใช้ใน transaction บนคลาวด์ · หน้าเว็บใช้แค่ค่าคงที่)
   10 ทีม · ผีพรายปีนจาก 0 ถึง 200 (เส้นละ 10) ทีมแรกที่ถึง 200 = คว้าธง ชนะ · ไม่มีการ์ด/เตะ/เผา/นางในวรรณคดี/ฝน
   ① แรงผีพราย: คนละ 3 ดวง ส่ง 1 ชิ้นใช้ 1 ดวง ฟื้น 1 ดวงทุก 20 นาที (มีของเยอะก็ส่งรัวไม่ได้)
   ② ผีพรายอยากกิน: ทุกเส้น 10 แต่ละทีมสุ่ม "ของที่อยากกิน" 1 อย่างจากเสบียงที่แอดมินตั้ง ต้องส่งของอย่างนั้นถึงจะปีน
   ③ น้ำขึ้น: นาทีที่ 0–14 ของทุกชั่วโมง ส่ง 1 ชิ้นปีน 2 ขั้น (นอกช่วง = 1 ขั้น)
   เสบียง/จัดทีม/เพิ่มคนระหว่างแข่ง/พัก/รีเซ็ต = แบบเดียวกับแข่งเรือ (แอดมินเท่านั้น) */
export const PH_TEAMS=10,PH_GOAL=200,PH_STEP=10,PH_MENU_MAX=8;
export const PH_ENERGY=3,PH_REGEN=20*60000;
export const PH_TIDE_MIN=15,PH_TIDE_GAIN=2;
export const PH_FOOD_MERIT=[500,2000],PH_COMBO=100000;/* กุศลต่อชิ้น 500–2,000 · คอมโบส่งครบทุกเมนู 100,000 */
export const PH_COLORS=['#ff5a7a','#ff9f2e','#e6b800','#4fb83a','#1fa99c','#2f93ec','#5b6cff','#a66bff','#f04fc4','#a07850'];
const SUPPLY_GROUPS=['food','gfood','drink'];
export const PH_FOOD_KEYS=new Set(CATALOG.filter(c=>SUPPLY_GROUPS.some(g=>c.p.startsWith(g+'.'))||/^(bird\.mkdish|fishing\.sqdish)/.test(c.p)).map(c=>c.k));
export const phMenuOk=k=>PH_FOOD_KEYS.has(k)||(typeof k==='string'&&k.startsWith('alp-')&&!!BOAT_ALPACA[k.slice(4)]);
const fail=m=>{throw Object.assign(new Error(m),{code:'failed-precondition'});};
const teamOk=t=>Number.isInteger(t)&&t>=1&&t<=PH_TEAMS;
const TEAMS=Array.from({length:PH_TEAMS},(_,i)=>i+1);
export const freshPhrai=()=>({status:'setup',p:Array(PH_TEAMS).fill(0),team:{},names:{},menus:{},want:{},en:{},sent:{},combo:{},items:{},log:[],winner:null,round:0,pausedAt:null,off:{}});
/* ปิดธง: off={[ทีม]:1} · ทีมที่ปิดไม่ร่วมแข่งรอบนั้น (เสาเทา ส่งไม่ได้ ไม่อยู่ในสรุป) · แอดมินตั้งได้ก่อนเริ่มรอบ */
export const phOff=(r,t)=>!!(r&&r.off&&r.off[t]);
const nameOf=(r,u)=>String(r.names?.[u]||'สมาชิก');
const log=(r,t)=>{r.log.unshift({t,at:r._now});r.log=r.log.slice(0,40);};
export const phMembers=(r,t)=>Object.keys(r.team||{}).filter(u=>r.team[u]===t);
/* ① แรง: เก็บ {n,at} · at = เวลาที่เริ่มนับฟื้นดวงถัดไป */
export function phEnergy(r,uid,now){const e=r.en?.[uid];if(!e)return {n:PH_ENERGY,next:0};let n=Math.max(0,Math.min(PH_ENERGY,Number(e.n)||0)),at=Number(e.at)||now;if(n<PH_ENERGY){const k=Math.floor((now-at)/PH_REGEN);if(k>0){n=Math.min(PH_ENERGY,n+k);at+=k*PH_REGEN;}}return {n,next:n<PH_ENERGY?at+PH_REGEN:0,at};}
/* ③ น้ำขึ้น: นาทีที่ 0–14 ของทุกชั่วโมง (นาทีของนาฬิกาเหมือนกันทุกเขตเวลาที่เป็นชั่วโมงเต็ม/ครึ่ง → ใช้เวลาไทย UTC+7) */
export function phTide(now){const H=3600000,into=((now%H)+H)%H,win=PH_TIDE_MIN*60000;return into<win?{on:true,until:now-into+win,next:now-into+H}:{on:false,until:0,next:now-into+H};}
const pickWant=(r,t,rng)=>{const m=r.menus?.[t]||[];if(!m.length){delete r.want[t];return null;}const prev=r.want[t],pool=m.length>1?m.filter(k=>k!==prev):m;const k=pool[Math.floor(rng()*pool.length)%pool.length];r.want[t]=k;return k;};
const SEND_GROUP=g=>g==='food'?'food':g==='drink'?'drink':g==='bird'?'bird':g==='fishing'?'fishing':'gfood';
export function publicPhrai(r,now){const v={status:r.status,p:r.p,team:r.team,names:r.names,menus:r.menus,want:r.want,sent:r.sent,log:(r.log||[]).slice(0,30),winner:r.winner,round:r.round||0,pausedAt:r.pausedAt||null,goal:PH_GOAL,off:r.off||{}};return v;}
export function phraiAction(source,account,ctx,input,rng=Math.random){
  const r={...freshPhrai(),...structuredClone(source||{})},player=structuredClone(account),{uid,admin,now}=ctx;
  if(!uid||!Number.isFinite(now))fail('ไม่มีบัญชีหรือเวลาเซิร์ฟเวอร์');
  for(const k of ['team','names','menus','want','en','sent','combo','items','off'])r[k] ||= {};if(!Array.isArray(r.p)||r.p.length!==PH_TEAMS)r.p=Array(PH_TEAMS).fill(0);if(!Array.isArray(r.log))r.log=[];
  r._now=now;const type=input?.type;if(ctx.name&&r.team[uid])r.names[uid]=String(ctx.name).slice(0,40);
  const done=extra=>{delete r._now;const e=phEnergy(r,uid,now);return {race:r,player,me:{team:r.team[uid]||0,energy:e.n,next:e.next,max:PH_ENERGY},tide:phTide(now),...extra};};
  const addNames=()=>{for(const [id,n]of Object.entries(input.names||{}))if(typeof n==='string')r.names[id]=n.slice(0,40);};
  const t0=r.team[uid];
  if(type==='status')return done();
  if(type==='teams'){
    if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='setup')fail('จัดทีมก่อนเริ่มการแข่งขันเท่านั้น');const roster=input.roster||[];
    if(Number.isInteger(input.team)&&Array.isArray(input.members)){const t=input.team;if(!teamOk(t))fail('ทีมไม่ถูกต้อง');
      for(const id of input.members)if(!roster.includes(id))fail('สมาชิกหรือทีมไม่ถูกต้อง');
      for(const id of Object.keys(r.team))if(r.team[id]===t&&!input.members.includes(id))delete r.team[id];
      for(const id of input.members)r.team[id]=t;}
    else{const team=input.map||{};for(const [id,t]of Object.entries(team))if(!teamOk(t)||(r.team[id]!==t&&!roster.includes(id)))fail('สมาชิกหรือทีมไม่ถูกต้อง');r.team={...team};}
    addNames();return done();}
  if(type==='addMember'){
    if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='running'&&r.status!=='paused')fail('เพิ่มคนระหว่างแข่งได้เมื่อเริ่มรอบแล้วเท่านั้น');const id=input.uid,t=input.team;
    if(typeof id!=='string'||!(input.roster||[]).includes(id))fail('สมาชิกไม่ถูกต้อง');if(!teamOk(t))fail('ทีมไม่ถูกต้อง');if(r.team[id])fail('สมาชิกคนนี้มีทีมแล้ว ย้ายทีมระหว่างแข่งไม่ได้');
    r.team[id]=t;addNames();log(r,'แอดมินเพิ่ม '+nameOf(r,id)+' เข้าทีม '+t);return done();}
  if(type==='menus'){
    if(!admin)fail('เฉพาะแอดมิน');if(r.status==='running'||r.status==='paused')fail('ตั้งเสบียงก่อนเริ่มรอบ');const menus=input.menus;
    if(!Array.isArray(menus)||menus.length<1||menus.length>PH_MENU_MAX||new Set(menus).size!==menus.length||menus.some(k=>!phMenuOk(k)))fail('เลือกเสบียง 1–'+PH_MENU_MAX+' เมนูไม่ซ้ำ');
    const ts=input.all===true?TEAMS:[input.team];if(ts.some(t=>!teamOk(t)))fail('ทีมไม่ถูกต้อง');for(const t of ts)r.menus[t]=[...menus];return done();}
  if(type==='flags'){
    if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='setup')fail('เปิด/ปิดธงได้ก่อนเริ่มรอบเท่านั้น (รีเซ็ตรอบก่อน)');const off=input.off;
    if(!Array.isArray(off)||off.some(t=>!teamOk(t))||new Set(off).size!==off.length)fail('รายการธงไม่ถูกต้อง');if(off.length>=PH_TEAMS)fail('ต้องเปิดธงไว้อย่างน้อย 1 ทีม');
    r.off=Object.fromEntries(off.map(t=>[t,1]));return done();}
  if(type==='pause'){if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='running')fail('สถานะไม่ถูกต้อง');r.status='paused';r.pausedAt=now;log(r,'⏸️ แอดมินพักการแข่งขัน');return done();}
  if(type==='resume'){if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='paused')fail('สถานะไม่ถูกต้อง');const d=Math.max(0,now-(r.pausedAt||now));for(const e of Object.values(r.en))if(e&&Number.isFinite(e.at))e.at+=d;/* เวลาที่พักไม่นับเป็นเวลาฟื้นแรง */r.status='running';r.pausedAt=null;log(r,'▶️ แข่งต่อ');return done();}
  if(type==='start'){
    if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='setup')fail('รีเซ็ตรอบเดิมก่อนเริ่มรอบใหม่');if(!Object.keys(r.team).length)fail('ต้องจัดทีมก่อน');if(!TEAMS.some(t=>!phOff(r,t)&&phMembers(r,t).length))fail('ธงที่เปิดอยู่ยังไม่มีสมาชิกเลย จัดทีมหรือเปิดธงก่อน');
    const f=freshPhrai();f.team={...r.team};f.menus={...r.menus};f.names={...r.names};f.off={...r.off};f.round=now;f.status='running';f._now=now;for(const t of TEAMS)if(!phOff(f,t)&&phMembers(f,t).length)pickWant(f,t,rng);log(f,'🏁 เริ่มแข่งผีพรายปีนเสา');delete f._now;
    const e=phEnergy(f,uid,now);return {race:f,player,me:{team:f.team[uid]||0,energy:e.n,next:e.next,max:PH_ENERGY},tide:phTide(now)};}
  if(type==='reset'){if(!admin)fail('เฉพาะแอดมิน');const f=freshPhrai();f.team={...r.team};f.names={...r.names};f.menus={...r.menus};f.off={...r.off};f.lastWinner=r.winner||null;return {race:f,player,me:{team:f.team[uid]||0,energy:PH_ENERGY,next:0,max:PH_ENERGY},tide:phTide(now)};}
  if(type!=='supply')fail('คำสั่งไม่ถูกต้อง');
  if(r.status==='paused')fail('⏸️ แอดมินพักการแข่งขันอยู่');if(r.status!=='running')fail(r.status==='finished'?'การแข่งขันจบแล้ว':'ยังไม่เริ่มการแข่งขัน');
  if(!teamOk(t0))fail('คุณยังไม่มีทีม รอยัยหนูจัดทีมให้ก่อนนะ');if(phOff(r,t0))fail('รอบนี้ธงของทีมคุณปิดอยู่ ดูการแข่งได้นะ');
  const en=phEnergy(r,uid,now);if(en.n<1)fail('แรงหมดแล้ว รอฟื้นอีกสักครู่');
  const alp=input.group==='alpaca',k=String(input.food);let menuKey,have,take;
  if(alp){if(!BOAT_ALPACA[k])fail('ของแปรรูปนี้ส่งเป็นเสบียงไม่ได้');menuKey='alp-'+k;have=Number(player.sub?.alpaca?.bag?.[k])||0;take=()=>{player.sub.alpaca.bag[k]=have-1;};}
  else{const group=SEND_GROUP(input.group),menu=CATALOG.find(c=>c.p===group+'.'+k);menuKey=menu?.k||null;if(!menuKey||!PH_FOOD_KEYS.has(menuKey))fail('อาหารนี้ส่งเป็นเสบียงไม่ได้');
    have=Number(player.bag?.[group]?.[k])||0;take=()=>{player.bag[group] ||= {};player.bag[group][k]=have-1;};}
  const menus=r.menus[t0]||[];if(menus.length&&!menus.includes(menuKey))fail('อาหารนี้ไม่อยู่ในเสบียงของทีม');
  if(menus.length&&r.want[t0]&&!menus.includes(r.want[t0]))pickWant(r,t0,rng);/* เสบียงถูกแก้ระหว่างรอบ (ไม่ควรเกิด) */
  if(menus.length&&!r.want[t0])pickWant(r,t0,rng);
  if(menus.length&&r.want[t0]!==menuKey)fail('ตอนนี้ผีพรายอยากกินอย่างอื่น ส่งของที่ผีพรายขอนะ');
  if(!Number.isSafeInteger(have)||have<1)fail(alp?'ของแปรรูปไม่พอ':'อาหารไม่พอ');
  take();const gain=PH_FOOD_MERIT[0]+Math.floor(rng()*(PH_FOOD_MERIT[1]-PH_FOOD_MERIT[0]+1));
  let c=r.combo[uid];if(!c||c.t!==t0)c=r.combo[uid]={t:t0,got:[]};let combo=0;
  if(menus.length&&!c.got.includes(menuKey)){c.got.push(menuKey);if(menus.every(m=>c.got.includes(m))){combo=PH_COMBO;c.got=[];c.n=(c.n||0)+1;log(r,'🍱 '+nameOf(r,uid)+' ส่งเสบียงครบทุกเมนู รับคอมโบ +'+PH_COMBO.toLocaleString('en-US')+' กุศล');}}
  player.merit=(Number(player.merit)||0)+gain+combo;
  r.en[uid]={n:en.n-1,at:en.n>=PH_ENERGY?now:(en.at||now)};r.sent[uid]=(r.sent[uid]||0)+1;r.items[menuKey]=(r.items[menuKey]||0)+1;
  const tide=phTide(now),step=tide.on?PH_TIDE_GAIN:1,before=r.p[t0-1],after=Math.min(PH_GOAL,before+step);r.p[t0-1]=after;
  log(r,nameOf(r,uid)+' ส่งเสบียงให้ผีพรายทีม '+t0+(tide.on?' 🌊 น้ำขึ้น ×2':''));
  let lineUp=false;if(Math.floor(after/PH_STEP)>Math.floor(before/PH_STEP)&&after<PH_GOAL){lineUp=true;const w=pickWant(r,t0,rng);log(r,'⬆️ ผีพรายทีม '+t0+' ปีนถึงเส้น '+Math.floor(after/PH_STEP)*PH_STEP+(w?' · เปลี่ยนของที่อยากกิน':''));}
  if(after>=PH_GOAL){r.status='finished';r.winner=t0;log(r,'🏁 ผีพรายทีม '+t0+' คว้าธงที่ '+PH_GOAL+' ชนะ!');}
  return done({supply:{gain,combo,step,tide:tide.on,p:after,lineUp,line:Math.floor(after/PH_STEP)*PH_STEP,win:after>=PH_GOAL,want:r.want[t0]||null}});
}
