import {altTake,altHave,payBroom} from './broom-pay.js?h=92e78b5b';
/* fix17 😈 ไอเทมปีศาจ 4 ชิ้น (แกล้งสวนเพื่อน) — กติกาล้วน ใช้บนคลาวด์ (หน้าเว็บใช้ค่าคงที่/ข้อความเท่านั้น)
   🎶 กล่องดนตรีหมูปีศาจ −50,000 ทันที (fix18: เดิม −20,000)
   ⏳ นาฬิกาทรายปีศาจ ดูด −10,000 ทุก 6 นาที 1 ชม. (รวม −100,000) · เจ้าของคว่ำได้ด้วยใบตองทอง 20 · สวนหนึ่งมีพร้อมกันได้ 3 อัน
   ⛓️ หีบโลงต้องสาป ล็อกสวน · เจ้าของเลือกตรา 1 ใน 3 (−50,000 / −150,000 / สะท้อน −150,000 ใส่คนแกล้ง หน่วง 5–30 นาที) · ไม่เปิดใน 30 นาที = −150,000 · ทีละ 1 อัน
   💖 หัวใจทับทิมปีศาจ คนถือมีเวลา 10 นาที (นับเมื่อออนไลน์) ส่งต่อได้ 3 ทอด ห้ามคืนคนส่ง · หมดเวลา −250,000 · ทะลุหุ่นไล่กา
   ของในกระเป๋าต้องใช้ใน 48 ชม. ไม่งั้นระเบิดใส่ตัวเอง (≈2 เท่า) · ทิ้งลงบ่อได้ (ครึ่งหนึ่งของระเบิด)
   ไม่บอก ไม่เก็บชื่อคนแกล้งในข้อมูลที่คนโดนอ่านได้ · ส่งไม่ได้ทุกกรณี = ข้อความเดียวกัน */
export const DEMON_KINDS=['music','hour','coffin','heart'];
export const DEMON={
 music:{n:'กล่องดนตรีหมูจอมแสบ',e:'🎶',img:'prank-musicbox',amt:50000,boom:100000,toss:50000,cap:150,pair:50},
 hour:{n:'นาฬิกาทรายจอมแสบ',e:'⏳',img:'prank-hourglass',tick:10000,every:6*60000,ticks:10,boom:200000,toss:100000,cap:30,pair:8,max:3,flip:100},
 coffin:{n:'หีบโลงต้องสาป',e:'⛓️',img:'prank-coffin',green:50000,red:150000,reflect:150000,time:30*60000,boom:300000,toss:150000,cap:25,pair:6,max:1},
 heart:{n:'หัวใจทับทิมจอมแสบ',e:'💖',img:'prank-heart',amt:250000,time:10*60000,passes:3,boom:500000,toss:250000,cap:25,resend:60*60000}};
export const HEART_MSG='หัวใจต้องคำสาป  คุณจำเป็นที่จะจะต้องส่งต่อ  หัวใจนี้ถ้าไม่อย่างนั้น จะมีอันเป็นไป  ไม่เชื่อใช่ไหม   ก็ลองดูสิ ฮ่า ฮ่า ฮ่า';
export const DEMON_MUSIC_BULK=50,DEMON_HEART_HOLD=10;
/* fix23 💖 หัวใจทอดสุดท้าย (ส่งต่อไม่ได้แล้ว) แตกตอนไม่อยู่ในเกม = หักของ 1,000 ชิ้น · หัวใจทุกดวงที่อยู่ในมือ เลือกจ่ายเองได้: ของ 1,500 ชิ้น หรือหัก 250,000 (ติดลบได้) · อยู่ในเกมแต่ไม่เลือก/ไม่ส่ง = หัก 250,000 เหมือนเดิม
   ของที่หัก: คละจาก 7 อย่างใน broom-pay.js หักจากกองที่เยอะที่สุดก่อนทีละชิ้น · ของรวมไม่พอ = หักเท่าที่มี ส่วนที่ขาดคิดชิ้นละ 250 กุศล
   "ไม่อยู่ในเกม" = เซิร์ฟเวอร์ตัดสินหลังหมดเวลาเกิน 2 นาที (ในเกม หน้าเว็บส่งตัดสินภายในไม่กี่วินาที) */
export const HEART_AWAY=1000,HEART_STAY=1500,HEART_ITEM_MERIT=250,HEART_GRACE=2*60000;
export const heartLast=h=>(Number(h?.passes)||0)>=DEMON.heart.passes;
export const heartItemsHave=game=>altHave(game,'mix');
export const heartTakeItems=(game,n)=>altTake(game,n,'mix');
/* fix21 🏮 ของผีสิง (โรงงานอัลปาก้าแปรรูปพลาด)
   คนแปรรูป: ต้องส่งให้เพื่อนภายใน 24 ชม. ไม่งั้นระเบิดใส่ตัวเอง (มูลค่าของชิ้นนั้น) · ทะลุหุ่นไล่กา
   คนโดน: เข้ากองรอจัดการเงียบ ๆ 24 ชม. · ใช้ใบตองทอง 100/ชิ้น ลดยอดสุ่ม 20–50% หรือรับทราบหักเต็ม · ไม่จัดการ = หักเต็มอัตโนมัติ · ส่งต่อไม่ได้ */
export const GHOST_TIME=24*3600000,GHOST_HOLD=200,GHOST_HAND=1000,GHOST_BROOM=100,GHOST_CUT=[.2,.5];
export const DEMON_EXPIRE=48*3600000,DEMON_USER_DAY=400,DEMON_PAIR_GAP=60000,DEMON_REFLECT=[5*60000,30*60000],DEMON_NOPE='😈 ตอนนี้ใช้กับคนนี้ไม่ได้ ลองใหม่ทีหลังนะ';
/* ของดร็อป: ดูแลสัตว์ (ตั๋วละ 5,000 กุศลจากสัตว์ วันละไม่เกิน 40 ตั๋ว) · กล่องสุ่มสัตว์เลี้ยง (ซ่อน: เฉลี่ย 1–2 ชิ้น/500 กล่อง) */
export const PET_TICKET=5000,PET_TICKETS_DAY=40,PET_EARN_CAP=500000;
export const PET_ODDS=[['music',.06],['hour',.03],['coffin',.015],['heart',.01]];
export const BOX_ODDS=.0025,BOX_PITY=600,BOX_WEIGHTS=[['music',55],['hour',25],['coffin',13],['heart',7]];
export const PET_BOXES=['dog','cat','hamster','alpaca','ostrich','dodo'];
export const thaiDay=now=>new Date(now+7*3600000).toISOString().slice(0,10);
const num=n=>Number.isSafeInteger(n)&&n>0?n:0;
const fail=m=>{throw Object.assign(new Error(m),{code:'failed-precondition'});};
export const floorAdd=(m0,d)=>{m0=Number(m0)||0;return d<0?m0+d:m0+d;};
const bagHave=(game,k)=>num(game?.bag?.demon?.[k]);
function bagSet(game,k,n){game.bag ||= {};game.bag.demon ||= {};game.bag.demon[k]=Math.max(0,n);}
/* ---------- กระเป๋า 48 ชม. (เก็บล็อตใน players/{uid}.x17.dm.b = [{k,n,at}]) ---------- */
export function dmState(x17){const s=x17.dm && typeof x17.dm==='object'?x17.dm:(x17.dm={});s.b=Array.isArray(s.b)?s.b.filter(x=>x&&DEMON_KINDS.includes(x.k)&&num(x.n)&&Number.isFinite(x.at)):[];s.dl=Array.isArray(s.dl)?s.dl:[];return s;}
const selfLog=(s,row)=>{s.dl.unshift(row);s.dl=s.dl.slice(0,20);};
/* เทียบของในกระเป๋ากับล็อต: เพิ่ม = ล็อตใหม่ (เริ่มนับ 48 ชม.) · ลด = ใช้จากล็อตเก่าก่อน · หมดอายุ = ระเบิด */
export function demonSync(game,x17,now){
  const had=x17.dm?JSON.stringify(x17.dm):null,anyBag=DEMON_KINDS.some(k=>bagHave(game,k));if(!had&&!anyBag)return {changed:false,boom:[]};
  const s=dmState(x17),boom=[];
  for(const k of DEMON_KINDS){const have=bagHave(game,k),lots=s.b.filter(x=>x.k===k).sort((a,b)=>a.at-b.at);let sum=lots.reduce((a,x)=>a+x.n,0);
    if(have>sum)s.b.push({k,n:have-sum,at:now});
    else if(have<sum){let cut=sum-have;for(const x of lots){const t=Math.min(cut,x.n);x.n-=t;cut-=t;if(!cut)break;}}}
  s.b=s.b.filter(x=>x.n>0);
  for(const x of s.b.filter(x=>x.at+DEMON_EXPIRE<=now)){const D=DEMON[x.k],amt=D.boom*x.n;bagSet(game,x.k,bagHave(game,x.k)-x.n);game.merit=floorAdd(game.merit,-amt);boom.push({k:x.k,n:x.n,amt});selfLog(s,{k:x.k,n:x.n,amt,at:now,w:'boom'});x.n=0;}
  s.b=s.b.filter(x=>x.n>0);if(!s.b.length&&!s.dl.length&&!s.d&&!s.p&&!s.pet)delete x17.dm;
  return {changed:had!==(x17.dm?JSON.stringify(x17.dm):null),boom};
}
/* หยิบ 1 ชิ้นจากล็อตที่ใกล้หมดเวลาที่สุด */
export function demonTake(game,x17,k,now){demonSync(game,x17,now);const s=dmState(x17);if(bagHave(game,k)<1)fail('ไม่มี'+DEMON[k].n+'ในกระเป๋า');
  const lot=s.b.filter(x=>x.k===k).sort((a,b)=>a.at-b.at)[0];if(lot)lot.n--;s.b=s.b.filter(x=>x.n>0);bagSet(game,k,bagHave(game,k)-1);return lot?lot.at:now;}
export function demonGive(game,x17,k,n,now){bagSet(game,k,bagHave(game,k)+n);demonSync(game,x17,now);}
export function demonToss(game,x17,k,now){if(!DEMON[k])fail('ไอเทมไม่ถูกต้อง');demonTake(game,x17,k,now);const amt=DEMON[k].toss;game.merit=floorAdd(game.merit,-amt);selfLog(dmState(x17),{k,n:1,amt,at:now,w:'toss'});return {k,amt};}
/* ---------- ดร็อปจากการดูแลสัตว์ (สุ่มบนเซิร์ฟเวอร์) ---------- */
export function petRoll(game,x17,earned,now,rng){const s=dmState(x17),day=thaiDay(now);if(s.pet?.d!==day)s.pet={d:day,t:0,acc:0};
  const e=Math.max(0,Math.min(PET_EARN_CAP,Math.floor(Number(earned)||0)));let acc=num(s.pet.acc)+e,t=Math.floor(acc/PET_TICKET);acc-=t*PET_TICKET;t=Math.max(0,Math.min(t,PET_TICKETS_DAY-num(s.pet.t)));
  s.pet.acc=Math.min(acc,PET_TICKET);s.pet.t=num(s.pet.t)+t;const got={};
  for(let i=0;i<t;i++){let x=rng(),k=null;for(const [kk,p] of PET_ODDS){if(x<p){k=kk;break;}x-=p;}if(k)got[k]=(got[k]||0)+1;}
  for(const [k,n] of Object.entries(got))demonGive(game,x17,k,n,now);return {tickets:t,got};}
/* ---------- กล่องสุ่มสัตว์เลี้ยง: โอกาสซ่อน + การันตีซ่อน ---------- */
/* pity = ตัวนับการันตี (เก็บใน privateDemon/{uid}.box ฝั่งเซิร์ฟเวอร์เท่านั้น ผู้เล่นอ่านไม่ได้) */
export function boxRoll(game,x17,box,quantity,now,rng,pity={}){if(!PET_BOXES.includes(box)||!(quantity>0))return {};let n=num(pity.n),got={};
  const pickK=()=>{let x=rng()*100;for(const [k,w] of BOX_WEIGHTS){if((x-=w)<0)return k;}return 'music';};
  for(let i=0;i<quantity;i++){n++;if(rng()<BOX_ODDS||n>=BOX_PITY){const k=pickK();got[k]=(got[k]||0)+1;n=0;}}
  pity.n=n;for(const [k,c] of Object.entries(got))demonGive(game,x17,k,c,now);return got;}
/* ---------- ฝั่งคนโดน: gameViews/poison.dm (คนโดนอ่านได้ ไม่มีชื่อคนแกล้ง) ---------- */
export const freshDm=now=>({v:1,day:thaiDay(now),got:{music:0,hour:0,coffin:0,heart:0},hg:[],cf:[],ht:[],gh:[],gr:[],log:[],tot:{d:thaiDay(now),n:0}});
export function dmView(v,now){const d=v&&typeof v==='object'?structuredClone(v):freshDm(now);const day=thaiDay(now);
  if(d.day!==day){d.day=day;d.got={music:0,hour:0,coffin:0,heart:0};}
  for(const k of ['hg','cf','ht','gh','gr','log'])d[k]=Array.isArray(d[k])?d[k]:[];d.got ||= {music:0,hour:0,coffin:0,heart:0};if(d.tot?.d!==day)d.tot={d:day,n:0};return d;}
export const dmActive=d=>!!(d&&(d.mu>0||d.hg?.length||d.cf?.length||d.ht?.length||d.gh?.length||d.gr?.length));
const vLog=(d,row)=>{d.log.unshift(row);d.log=d.log.slice(0,40);if(row.amt>0)d.tot.n+=row.amt;};
const hgDue=(h,now)=>Math.min(DEMON.hour.ticks,Math.floor((Math.min(now,h.flip||Infinity)-h.at)/DEMON.hour.every));
/* คนโดนออนไลน์/ทำรายการ: หักตามเวลาจริงที่ถึงกำหนด (หักกุศลจากเกมของคนโดนเอง) */
export function victimSettle(d,game,now,{online=true}={}){let changed=false,lost=0;
  if(num(d.mu)){const n=num(d.mu),amt=DEMON.music.amt*n;game.merit=floorAdd(game.merit,-amt);lost+=amt;vLog(d,{k:'music',amt,n,at:now,w:'hit'});d.mu=0;changed=true;}
  for(const h of d.hg){const due=hgDue(h,now)-num(h.paid);if(due>0){const amt=DEMON.hour.tick*due;game.merit=floorAdd(game.merit,-amt);h.paid=num(h.paid)+due;lost+=amt;vLog(d,{k:'hour',amt,n:due,at:now,w:'tick'});changed=true;}}
  const left=d.hg.filter(h=>!(h.flip||num(h.paid)>=DEMON.hour.ticks));if(left.length!==d.hg.length){d.hg=left;changed=true;}
  for(const c of d.cf)if(now>=c.until){game.merit=floorAdd(game.merit,-DEMON.coffin.red);lost+=DEMON.coffin.red;vLog(d,{k:'coffin',amt:DEMON.coffin.red,at:now,w:'timeout'});c.done=true;changed=true;}
  if(d.cf.some(c=>c.done)){d.cf=d.cf.filter(c=>!c.done);}
  for(const h of d.ht){if(!h.seen&&online){h.seen=now;changed=true;}if(h.seen&&now>=h.seen+DEMON.heart.time){if(heartLast(h)&&now>=h.seen+DEMON.heart.time+HEART_GRACE){const t=heartTakeItems(game,HEART_AWAY),amt=t.short*HEART_ITEM_MERIT;if(amt)game.merit=floorAdd(game.merit,-amt);lost+=amt;vLog(d,{k:'heart',amt,at:now,w:'items',n:t.n,it:t.items});}else{game.merit=floorAdd(game.merit,-DEMON.heart.amt);lost+=DEMON.heart.amt;vLog(d,{k:'heart',amt:DEMON.heart.amt,at:now,w:'timeout'});}h.done=true;changed=true;}}
  if(d.ht.some(h=>h.done)){d.ht=d.ht.filter(h=>!h.done);}
  for(const h of d.gh)if(now>=num(h.until)){const amt=num(h.amt);game.merit=floorAdd(game.merit,-amt);lost+=amt;vLog(d,{k:'ghost',g:h.g,amt,at:now,w:'timeout'});h.done=true;changed=true;}
  if(d.gh.some(h=>h.done)){d.gh=d.gh.filter(h=>!h.done);}
  {let n=0,amt=0;for(const h of d.gr)if(now>=num(h.until)){n++;amt+=num(h.amt);h.done=true;}
   if(n){game.merit=floorAdd(game.merit,-amt);lost+=amt;vLog(d,{k:'ghost',amt,n,at:now,w:'gauto'});d.gr=d.gr.filter(h=>!h.done);changed=true;}}
  return {changed,lost};}
/* fix21 🏮 โรงงานแปรรูปพลาด → ของผีสิงเข้ามือคนแปรรูปเอง (ส่งได้ใน 24 ชม.) */
export function ghostGive(d,priv,me,list,now,rng,game={}){const out=[];
  for(const x of list){if(d.gh.length>=GHOST_HAND){/* มือเต็ม (กันเอกสารใหญ่เกิน) = ระเบิดทันที */const amt=num(x.amt);game.merit=floorAdd(game.merit,-amt);vLog(d,{k:'ghost',g:String(x.g),amt,at:now,w:'timeout'});continue;}const id='g'+now.toString(36)+Math.floor(rng()*1e9).toString(36)+out.length;d.gh.push({id,at:now,until:now+GHOST_TIME,g:String(x.g),amt:num(x.amt)});out.push(id);}
  if(list.length)vLog(d,{k:'ghost',amt:0,n:list.length,at:now,w:'made'});return out;}
/* ส่งของผีสิงให้เพื่อน: ทีละหลายชิ้นได้ (ids) · เข้ากองรอจัดการของเพื่อน (ไม่เด้ง) */
export function ghostSend({d,td,me,to,ids,now}){if(to===me)fail(DEMON_NOPE);const list=(Array.isArray(ids)?ids:[ids]).map(String);if(list.length>GHOST_HOLD)fail('ส่งได้ครั้งละไม่เกิน '+GHOST_HOLD+' ชิ้น');
  const pick=d.gh.filter(h=>list.includes(h.id));if(!pick.length||pick.length!==new Set(list).size)fail('ของต้องมนต์นี้ไม่อยู่ในมือคุณแล้ว');
  if(pick.some(h=>now>=num(h.until)))fail('หมดเวลาแล้ว ของต้องมนต์ระเบิดในมือคุณ');if(td.gr.filter(h=>now<num(h.until)).length+pick.length>GHOST_HOLD)fail(DEMON_NOPE);
  d.gh=d.gh.filter(h=>!list.includes(h.id));vLog(d,{k:'ghost',amt:0,n:pick.length,at:now,w:'gsent'});
  for(const h of pick)td.gr.push({id:'r'+h.id.slice(1),at:now,until:now+GHOST_TIME,g:h.g,amt:num(h.amt)});return {n:pick.length};}
/* คนโดนจัดการกอง: broom = ใช้ใบตองทอง 100/ชิ้น ลด 20–50% · ไม่ใช้ = หักเต็ม */
export function ghostClear(d,game,ids,broom,now,rng,alt){const list=ids==='all'?d.gr.map(h=>h.id):(Array.isArray(ids)?ids:[ids]).map(String);if(list.length>GHOST_HOLD)fail('จัดการได้ครั้งละไม่เกิน '+GHOST_HOLD+' ชิ้น');
  const pick=d.gr.filter(h=>list.includes(h.id));if(!pick.length)fail('ไม่มีของต้องมนต์ให้จัดการ');
  const bp=broom?payBroom(game,GHOST_BROOM*pick.length,alt):{broom:0};
  let full=0,paid=0;const rows=[];for(const h of pick){const a=num(h.amt);let cut=0;if(broom)cut=Math.round(a*(GHOST_CUT[0]+rng()*(GHOST_CUT[1]-GHOST_CUT[0]))/100)*100;full+=a;paid+=a-cut;rows.push({g:h.g,amt:a-cut,cut});}
  game.merit=floorAdd(game.merit,-paid);d.gr=d.gr.filter(h=>!list.includes(h.id));vLog(d,{k:'ghost',amt:paid,n:pick.length,at:now,w:broom?'gsweep':'gaccept'});
  return {n:pick.length,full,paid,saved:full-paid,rows,broom:bp.broom,items:bp.items};}
/* ---------- คนแกล้งใช้ไอเทมกับสวนเพื่อน ----------
   ax17 = x17 ของคนแกล้ง (ตัวนับรายวัน + คู่คนแกล้ง→คนโดน) · d = dm ของคนโดน · priv = privateDemon/{victim} (เซิร์ฟเวอร์เท่านั้น) */
export function demonSend({game,ax17,d,priv,actor,victim,kind,now,scare,rng,n=1}){
  const D=DEMON[kind];if(!D)fail('ไอเทมไม่ถูกต้อง');if(victim===actor)fail(DEMON_NOPE);
  demonSync(game,ax17,now);if(bagHave(game,kind)<1)fail('ไม่มี'+D.n+'ในกระเป๋า');
  const s=dmState(ax17),day=thaiDay(now);if(s.d?.d!==day)s.d={d:day,n:0};s.p ||= {};
  for(const [u,p] of Object.entries(s.p))if(p.d!==day&&!(p.lh>now-DEMON.heart.resend))delete s.p[u];
  const pair=s.p[victim]&&s.p[victim].d===day?s.p[victim]:(s.p[victim]={d:day,m:0,h:0,c:0,last:0,lh:s.p[victim]?.lh||0});
  const nope=()=>fail(DEMON_NOPE);
  /* fix20: ไม่จำกัดการแกล้งแล้ว (ไม่มีเพดานต่อวันของคนแกล้ง/คนโดน/คู่เดิม) · เหลือเฉพาะกลไกของไอเทม: หุ่นไล่กา · นาฬิกาทราย 3 อัน/สวน · หีบโลงทีละ 1 · หัวใจค้างพร้อมกัน 3 · กล่องดนตรีส่งทีละหลายกล่องได้ */
  if(kind!=='heart'&&(scare||0)>now)nope();
  if(kind==='hour'&&d.hg.length>=D.max)nope();if(kind==='coffin'&&d.cf.length>=D.max)nope();
  if(kind==='heart'&&d.ht.length>=DEMON_HEART_HOLD)nope();
  const cnt=kind==='music'?Math.max(1,Math.min(DEMON_MUSIC_BULK,Math.floor(Number(n))||1)):1;if(bagHave(game,kind)<cnt)fail('มี'+D.n+'ไม่พอ ('+bagHave(game,kind)+')');
  for(let i=0;i<cnt;i++)demonTake(game,ax17,kind,now);s.d.n=num(s.d.n)+cnt;pair.last=now;const pk={music:'m',hour:'h',coffin:'c'}[kind];if(pk)pair[pk]=num(pair[pk])+cnt;if(kind==='heart')pair.lh=now;
  d.got[kind]=num(d.got[kind])+cnt;const id=kind[0]+now.toString(36)+Math.floor(rng()*1e6).toString(36);const out={id,kind,dmc:0,n:cnt};
  if(kind==='music')d.mu=num(d.mu)+cnt;/* หักตอนฝั่งคนโดนตัดสิน (ทันทีที่ออนไลน์ / เข้าเกม) */
  if(kind==='hour'){d.hg.push({id,at:now,end:now+D.every*D.ticks,paid:0});vLog(d,{k:'hour',amt:0,at:now,w:'placed'});}
  if(kind==='coffin'){const perm=['g','r','x'];for(let i=perm.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]];}
    d.cf.push({id,at:now,until:now+D.time});priv.cf ||= {};priv.cf[id]={by:actor,seal:perm,at:now};out.dmc=now+D.time;vLog(d,{k:'coffin',amt:0,at:now,w:'placed'});}
  if(kind==='heart'){d.ht.push({id,at:now,seen:0,passes:0});priv.ht ||= {};priv.ht[id]={from:actor,chain:[actor],at:now};vLog(d,{k:'heart',amt:0,at:now,w:'got'});}
  return out;}
/* เปิดหีบโลง: ผลสุ่มไว้ตั้งแต่วาง · สะท้อน = คนแกล้งเสีย (หน่วง 5–30 นาที) */
export function coffinOpen(d,priv,game,id,pick,now,rng){const c=d.cf.find(x=>x.id===id),p=priv.cf?.[id];if(!c||!p)fail('หีบนี้เปิดไปแล้ว');if(!Number.isInteger(pick)||pick<0||pick>2)fail('เลือกตราผนึก 1 ดวง');
  const r=p.seal[pick],D=DEMON.coffin;let amt=0,reflect=null;
  if(r==='g')amt=D.green;else if(r==='r')amt=D.red;else reflect={to:p.by,merit:-D.reflect,after:now+DEMON_REFLECT[0]+Math.floor(rng()*(DEMON_REFLECT[1]-DEMON_REFLECT[0]))};
  if(amt)game.merit=floorAdd(game.merit,-amt);d.cf=d.cf.filter(x=>x.id!==id);delete priv.cf[id];vLog(d,{k:'coffin',amt,at:now,w:r==='x'?'reflect':r==='g'?'green':'red'});
  return {result:r,amt,seal:[...p.seal],reflect};}
export function hourFlip(d,game,id,now,alt){const h=d.hg.find(x=>x.id===id);if(!h)fail('นาฬิกาทรายนี้หมดแล้ว');
  victimSettle(d,game,now);const cur=d.hg.find(x=>x.id===id);if(!cur)return {flipped:false};const paid=payBroom(game,DEMON.hour.flip,alt);d.hg=d.hg.filter(x=>x.id!==id);vLog(d,{k:'hour',amt:0,at:now,w:'flip'});return {flipped:true,...paid};}
/* fix23 💖 หัวใจในมือ (ทุกดวง · ส่งไม่ทัน/ส่งไม่ได้): เลือกเอง how='items' (ของ 1,500 ชิ้น ต้องมีพอ) | 'merit' (หัก 250,000 ติดลบได้) */
export function heartPay(d,priv,game,id,how,now){const h=d.ht.find(x=>x.id===id);if(!h)fail('หัวใจนี้ไม่อยู่ในมือคุณแล้ว');
  let res;if(how==='items'){const have=heartItemsHave(game);if(have<HEART_STAY)fail('ของไม่พอ ต้องมี '+HEART_STAY.toLocaleString('en-US')+' ชิ้น (มี '+have.toLocaleString('en-US')+')');const t=heartTakeItems(game,HEART_STAY);vLog(d,{k:'heart',amt:0,at:now,w:'items',n:t.n,it:t.items});res={how,items:t.items,n:t.n};}
  else if(how==='merit'){const amt=DEMON.heart.amt;game.merit=(Number(game.merit)||0)-amt;vLog(d,{k:'heart',amt,at:now,w:'pay'});res={how,amt};}
  else fail('เลือกวิธีก่อน');
  d.ht=d.ht.filter(x=>x.id!==id);if(priv?.ht)delete priv.ht[id];return res;}
/* ส่งหัวใจต่อ: from = คนส่งเดิม (ห้ามคืน) · ทอดสูงสุด 3 · กติกาคู่เหมือนการส่งใหม่ */
export function heartPass({d,priv,td,tpriv,gx17,me,to,id,now,rng}){const h=d.ht.find(x=>x.id===id),p=priv.ht?.[id];if(!h||!p)fail('หัวใจนี้ไม่อยู่ในมือคุณแล้ว');
  const nope=()=>fail(DEMON_NOPE),day=thaiDay(now);
  if(to===me||to===p.from||num(h.passes)>=DEMON.heart.passes)nope();
  if(h.seen&&now>=h.seen+DEMON.heart.time)fail('หมดเวลาแล้ว หัวใจแตกในมือคุณ');
  if(td.ht.length>=DEMON_HEART_HOLD)nope();/* fix20: ไม่มีเพดานรับหัวใจต่อวัน · ไม่ต้องเว้น 60 นาที */
  const s=dmState(gx17);s.p ||= {};const pair=s.p[to] ||= {d:day,m:0,h:0,c:0,last:0,lh:0};
  pair.lh=now;if(pair.d!==day){pair.d=day;pair.m=pair.h=pair.c=0;}
  d.ht=d.ht.filter(x=>x.id!==id);delete priv.ht[id];vLog(d,{k:'heart',amt:0,at:now,w:'passed'});
  const nid='h'+now.toString(36)+Math.floor(rng()*1e6).toString(36);td.got.heart=num(td.got.heart)+1;td.ht.push({id:nid,at:now,seen:0,passes:num(h.passes)+1});
  tpriv.ht ||= {};tpriv.ht[nid]={from:me,chain:[...(p.chain||[]).slice(-6),me],at:now};vLog(td,{k:'heart',amt:0,at:now,w:'got'});return {id:nid,passes:num(h.passes)+1};}
