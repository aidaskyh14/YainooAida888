import {CATALOG} from './catalog.js';
/* กติกาเรือเป็นฟังก์ชันล้วน: ใช้กับ transaction บนคลาวด์ ไม่สร้างผู้เล่นจำลอง */
export const BOAT_LINES=[50,100,150,200,250,300,350];
export const BOAT_GOAL=400;
export const BOAT_COOLDOWN=5*60000;
export const BOAT_CARD_TIME=30000;        // การ์ดที่หยิบแล้ว ใช้เองอัตโนมัติเมื่อครบ 30 วิ (เวลาเซิร์ฟเวอร์)
export const BOAT_TARGET_TIME=10*60000;   // การ์ดที่ต้องเลือกเป้า ถ้าไม่เลือกใน 10 นาที ระบบสุ่มเป้าให้
export const BOAT_MERIT=100000;          // fix14: การ์ดกุศล ลูกเรือคนละ 100,000
export const BOAT_FIRE_MERIT=100000;     // fix14: ลูกเรือที่ "ถูกจ้างออก" (ดึงตัวเกินโควตา) ได้ 100,000
export const BOAT_REVIVE_MAX=1;          // fix15f: ชุบชีวิตได้ครั้งเดียวต่อการแข่ง
export const BOAT_FREEZE=60*60000,BOAT_CRAB=30*60000,BOAT_INK=5*60000;
export const BOAT_MENU_MAX=8;
/* fix14: การ์ด 11 ใบ · เส้น 50/100 เน้นเตะ+ชุบชีวิต · การ์ดชุบชีวิตออกเฉพาะเมื่อมีคนโดนเตะแล้วและยังชุบไม่ครบ 2 ครั้ง */
export const BOAT_CARDS_EARLY=[['kick',30],['revive',20],['pull',10],['swap',8],['ink',8],['freeze',6],['crab',6],['supply',4],['cut',4],['stop',2],['merit',2]];
export const BOAT_CARDS_LATE=[['kick',12],['revive',8],['pull',8],['swap',8],['ink',8],['freeze',8],['crab',8],['supply',14],['cut',14],['stop',6],['merit',6]];
export const BOAT_CARDS=BOAT_CARDS_LATE;
/* fix15f: การ์ดแต่ละเส้นกำหนดตามลำดับลำที่มาถึง (ความลับ: หน้าเว็บไม่แสดงตารางนี้ และ publicBoat ไม่ส่งสำรับก่อนเปิด) */
export const BOAT_PLAN={50:['kickall','kickall','kick2','kick2'],100:['kickall','burn','pull'],150:['kickall','kick2','freeze','revive'],200:['kickall','kick2','crab','burn'],250:['kickall','kickall','ink'],300:['merit','stop'],350:['merit','cut1']};
export const boxSlots=line=>(BOAT_PLAN[line]||[]).length;
export const BOAT_GRACE=15000;          // ผู้เปิดส่งเป้าช้ากว่าเส้นตายได้ไม่เกิน 15 วิ (เผื่อเน็ตช้า) หลังจากนั้นเซิร์ฟเวอร์สุ่มเอง
export const BOAT_CARD_NAMES={burn:'เผาเรือ',cut1:'ตัดเสบียง',supply:'เติมเสบียง',cut:'ตัดเสบียง',merit:'กุศล',stop:'หยุดเรือ',kick:'เตะ',kickall:'เตะกวาดทุกทีม',kick2:'เตะเจาะทีม',pull:'ดึงตัว',swap:'สลับตัว',revive:'ชุบชีวิต',reviveall:'ชุบชีวิตทุกทีม',ink:'พ่นหมึก',freeze:'แช่แข็ง',crab:'ปูหนีบ',gift:'กล่องของขวัญ'};
const TARGET_CARDS=new Set(['cut','cut1','burn','kick','kickall','kick2','pull','swap','revive','ink','freeze','crab']);
/* ---------- fix15 ----------
   การ์ดแต่ละเส้น (โอกาส % รวม 100) · เส้น 50 มีกล่อง 4 ลำแรก · เส้น 100 มี 3 · ที่เหลือ 2
   เส้น 300: ลำแรกที่ถึงได้ "กล่องของขวัญ" เพิ่มอีก 1 กล่อง (ลูกเรือที่ยังไม่โดนเตะ คนละ 150,000) · หลังเส้น 300 ไม่มีเตะ/ดึง/ชุบ
   ตัดเสบียง = เลือก 2 ทีม ทีมละ −20 · ชุบชีวิต = กลับเรือทีมตัวเอง (มีเฉพาะเส้น 200/250 และต้องมีคนโดนเตะ)
   โดนเตะ → ข้อเสนอ "อยู่ต่อ" 2 นาที: จ่าย กุศล 10,000 + หมวกกะลาสี 1,000 + กล่องดนตรี 1,000 + ขนอัลปาก้า 200 แล้วได้ +50,000 · ครั้งที่ 2 จ่าย ×2 (ครั้งที่ n จ่าย ×n)
     ไม่ตอบใน 2 นาที: มีของครบ = อยู่ต่ออัตโนมัติ · ไม่ครบ = ออกจากเรือ
   ส่งเสบียงได้ทีละ 1 หรือ 3 ชิ้น (พักเท่าเดิม) · ชิ้นละ +1 · อาหาร 100–200 กุศล/ชิ้น · ของแปรรูปอัลปาก้าตามดาว
   คอมโบ: ส่งครบทุกเมนูของเรือตัวเอง +5,000 (ไม่เลื่อนเรือ) ทำซ้ำได้ · ย้ายทีมแล้วเริ่มนับใหม่ */
export const BOAT_CARD_TABLES={
 50:[['kickall',65],['kick2',35]],
 100:[['pull',50],['kickall',20],['kick2',20],['cut',10]],
 150:[['pull',40],['swap',15],['ink',15],['freeze',15],['crab',15]],
 200:[['supply',25],['merit',25],['cut',20],['revive',10],['reviveall',5],['stop',5],['ink',5],['crab',5]],
 250:[['supply',25],['merit',25],['cut',20],['revive',10],['reviveall',5],['stop',5],['ink',5],['crab',5]],
 300:[['merit',35],['supply',30],['cut',20],['ink',5],['crab',5],['stop',5]]};
export const BOAT_GIFT=150000,BOAT_CUT=20;
export const BOAT_STAY_TIME=2*60000,BOAT_STAY_GAIN=50000,BOAT_STAY_COST={merit:10000,hat:1000,mb:1000,wool:200,pestle:2000,coin:100};// fix16: + สากกะเบือ + เหรียญฮาโลวีน
export const BOAT_COMBO=20000,BOAT_SEND=[1,3];
/* fix15f เผาเรือ · นางเงือก · เส้น 350 */
export const BOAT_STAY_MULT=[1,4];         // fix16: ค่าอยู่ต่อ ครั้งที่ 1/2 · ครั้งที่ 3 หลุดทันที
export const BOAT_BURN_TIME=10*60000,BOAT_BURN_NEED={merit:500000,hat:5000,mb:5000,wool:3000,pestle:10000,coin:1000},BOAT_BURN_BACK=30;
export const BOAT_CUT1=30,BOAT_FIRE350=1000000,BOAT_FIRE350_TIME=10*60000,BOAT_FIRE350_N=2;// fix16: นางเงือกจ้างออกลำละ 2 คน
const BURN_OLD={merit:500000,hat:5000,mb:5000,wool:3000};// เรือที่ไหม้ก่อนอัปเดตใช้ยอดเดิม
export const burnNeed=st=>st?.need||BURN_OLD;
export const BOAT_MM_SHARE=.2,BOAT_MM_NEED=2,BOAT_MM_CHECKS=[30*60000,120*60000],BOAT_MM_REPLY=5*60000,BOAT_MM_POKE=3000;
export const BOAT_FOOD_MERIT=[100,200];
export const BOAT_STAR_MERIT={1:200,2:300,3:500,4:700,5:1000,6:1000};
/* ของแปรรูปอัลปาก้า [ดาว, ชื่อ] · key เมนูเรือ = 'alp-'+id · ของอยู่ใน sub.alpaca.bag[id] */
export const BOAT_ALPACA={'wool-yarn':[1,'ไหมพรม'],'wool-mittens':[2,'ถุงมือขนฟู'],'wool-beanie':[2,'หมวกบีนนี่'],'wool-bag':[2,'กระเป๋าพาสเทล'],'wool-scarf':[3,'ผ้าพันคอสายรุ้ง'],'wool-blanket':[3,'ผ้าห่มนุ่มฟู'],'wool-plush':[4,'ตุ๊กตาอัลปาก้า'],'wool-goldbag':[4,'กระเป๋าหรูขนทอง'],'wool-cloak':[5,'เสื้อคลุมราชวงศ์ทอง'],'wool-rug':[6,'พรมขนทองยัยหนู'],
 'meat-skewer':[1,'ลูกชิ้นปิ้ง'],'meat-sausage':[1,'ไส้กรอกสมุนไพร'],'meat-steak':[2,'สเต็ก'],'meat-burger':[2,'เบอร์เกอร์ชีส'],'meat-smoked':[2,'รมควัน'],'meat-massaman':[3,'มัสมั่น'],'meat-ghostsoup':[3,'ซุปหม้อวิญญาณ'],'meat-winestew':[4,'ตุ๋นไวน์แดง'],'meat-royal':[5,'ชุดเนื้อราชวงศ์'],'meat-buffet':[6,'บุฟเฟต์ทองคำ']};
export const stayCost=n=>{const m=BOAT_STAY_MULT[Math.max(1,n)-1]??BOAT_STAY_MULT[BOAT_STAY_MULT.length-1];return Object.fromEntries(Object.entries(BOAT_STAY_COST).map(([k,v])=>[k,v*m]));};
const isKick=c=>c==='kick'||c==='kickall'||c==='kick2';
export const needsTarget=card=>TARGET_CARDS.has(card);
const fail=m=>{throw new Error(m);};
export function freshBoat(){return {status:'setup',p:[0,0,0,0,0],team:{},kicked:{},claims:{},menus:{},boxes:[],winner:null,stopUntil:0,stopBy:null,sent:{},cd:{},credits:{},claimedCredits:{},log:[],names:{},lastTeam:{},pausedAt:null,startSize:{},fired:{},frozen:{},revives:0,offers:{},stays:{},combo:{},burns:{},burned:{},dismiss:{},mm:null,mmEx:{}};}
export const members=(r,b)=>Object.keys(r.team).filter(u=>r.team[u]===b&&!r.kicked[u]);
/* คนที่กำลังตัดสินใจข้อเสนออยู่ต่อ ยังอยู่ในทีม แต่ถูกเลือกเตะ/ดึง/สลับซ้ำไม่ได้ */
const offered=(r,u)=>!!r.offers?.[u];
const open=(r,b)=>members(r,b).filter(u=>!offered(r,u));
const log=(r,m)=>{r.log.unshift(m);r.log=r.log.slice(0,40);};
const nameOf=(r,u)=>r.names?.[u]||'ลูกเรือ';
const pickOne=(list,rng)=>list[Math.min(list.length-1,Math.floor(rng()*list.length))];
/* สุ่มแบบกำหนดผลได้ (seed จากข้อมูลกล่อง): ใครเป็นคนชำระการ์ดที่หมดเวลา ผลก็เหมือนกันเสมอ */
export function seededRng(seed) {
  let h=2166136261>>>0;for(const ch of String(seed)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0;}
  return ()=>{h=(h+0x6D2B79F5)>>>0;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
const boxSeed=(r,box)=>box.id+'|'+(box.pickedAt||0)+'|'+(r.round||0);
const reviveOk=r=>Object.keys(r.kicked||{}).some(u=>r.kicked[u]&&r.team[u]);
export function rollCard(rng,line,canRevive){const table=(BOAT_CARD_TABLES[line]||BOAT_CARD_TABLES[300]).filter(([k])=>(k!=='revive'&&k!=='reviveall')||canRevive),total=table.reduce((a,[,w])=>a+w,0);let x=rng()*total;for(const [k,w]of table){x-=w;if(x<0)return k;}return table[table.length-1][0];}
const boatOk=b=>Number.isInteger(b)&&b>=1&&b<=5;
const foodKeys=new Set(CATALOG.filter(c=>c.p.startsWith('food.')||c.p.startsWith('gfood.')).map(c=>c.k));
export function boatProgress(r,b,n,rng) {
  if(r.status!=='running')fail('การแข่งขันไม่ได้เปิดอยู่');
  if(!boatOk(b))fail('เรือไม่ถูกต้อง');
  const before=r.p[b-1];r.p[b-1]=Math.max(0,Math.min(BOAT_GOAL,before+n));
  for(const line of BOAT_LINES)if(before<line&&r.p[b-1]>=line) {
    const arrived=r.claims[line] ||= [];
    if(arrived.length<boxSlots(line)&&!arrived.includes(b)) {
      const first=!arrived.length,card=BOAT_PLAN[line][arrived.length];arrived.push(b);r.boxes.push({id:line+'-'+b,boat:b,line,opened:false,deck:Array(5).fill(card)});
      if(line===350){r.dismiss ||= {};r.dismiss[b]={at:r._now||0,until:(r._now||0)+BOAT_FIRE350_TIME,left:BOAT_FIRE350_N};log(r,'🧜‍♀️ เรือ '+b+' ถึงเส้น 350');}
      if(line===300&&first){r.boxes.push({id:'300-'+b+'-gift',boat:b,line,opened:false,gift:true,deck:Array(5).fill('gift')});log(r,'🎁 เรือ '+b+' ถึงเส้น 300 ก่อน ได้กล่องของขวัญ!');}
    }
  }
  if(r.p[b-1]===BOAT_GOAL){r.status='finished';r.winner=b;log(r,'🏁 เรือ '+b+' ถึงเส้น 400 ชนะ!');finishExtras(r);}
}
/* ใช้การ์ดที่หยิบไว้ ถ้าไม่ได้ระบุเป้า (หมดเวลา) จะสุ่มเป้าที่ใช้ได้
   fix14 การ์ด 11 ใบ:
   supply +10 · cut เรือคู่แข่ง −10 · merit ลูกเรือคนละ 100,000 · stop ทีมอื่นส่งไม่ได้ 30 นาที
   kick  เลือกแบบ: ทุกทีมคู่แข่งทีมละ 1 คน (mode all) หรือ ทีมเดียวไม่เกิน 2 คน (mode one)
   pull  ดึงคู่แข่ง 1 คนมาทีมเรา · ทีมเราใหญ่ได้ไม่เกิน (ขนาดตอนเริ่ม +1) ถ้าเกิน ต้องเลือกลูกเรือตัวเอง 1 คน "ถูกจ้างออก" (ได้ 100,000)
   swap  แลกลูกเรือเรา 1 คนกับคู่แข่ง 1 คน
   revive ชุบคนที่โดนเตะ 1 คน กลับทีมเดิม ถ้าทีมเดิมเต็ม ไปทีมที่คนน้อยที่สุด · ไม่เกิน 2 ครั้งต่อการแข่ง
   ink   พ่นหมึกใส่หน้าจอทีมคู่แข่ง 1 ลำ (กวนสายตา ถูจอเพื่อเช็ด)
   freeze แช่แข็งคู่แข่ง 1 คน ส่งเสบียงไม่ได้ 30 นาที
   crab  ปูหนีบเรือคู่แข่ง 1 ลำ ทุกคนในเรือต้องรอส่งเพิ่ม 10 นาที */
const rivalsOf=boat=>[1,2,3,4,5].filter(b=>b!==boat);
const rivalMembers=(r,boat)=>rivalsOf(boat).flatMap(b=>members(r,b));
const kickedList=r=>Object.keys(r.kicked||{}).filter(u=>r.kicked[u]&&r.team[u]);
const capOf=(r,b)=>(r.startSize?.[b]??0)+1;
function useCard(r,box,choice,ctx,rng,player,auto) {
  const boat=box.boat,card=box.card,{uid,now}=ctx,tag=auto?' (อัตโนมัติ)':'',pick=seededRng(boxSeed(r,box));
  const rivals=rivalsOf(boat),staffed=rivals.filter(b=>members(r,b).length);
  r.startSize ||= {};r.fired ||= {};r.frozen ||= {};r.revives ||= 0;r.offers ||= {};r.stays ||= {};
  const intOr=v=>v===undefined||v===null?null:v;
  let target=intOr(choice.target),victims=[],cutBoats=[];
  const ledger=[];
  // ---- ตรวจและสุ่มเป้า (ยังไม่เปลี่ยนสถานะ จนกว่าจะผ่านการตรวจทั้งหมด) ----
  if(card==='ink'||card==='crab') {
    if(target===null)target=pickOne(staffed.length?staffed:rivals,pick);
    if(!Number.isInteger(target)||!rivals.includes(target))fail('เลือกเรือคู่แข่ง');
  }
  if(card==='cut1'||card==='burn') {
    // fix15f: ไม่เลือกในเวลา = เรือคู่แข่งที่นำอยู่ · เผาซ้ำลำที่กำลังไหม้ไม่ได้
    const ok=b=>card!=='burn'||(members(r,b).length&&!r.burns?.[b]),pool=(staffed.length?staffed:rivals).filter(ok);
    if(target===null)target=pool.length?[...pool].sort((a,b)=>r.p[b-1]-r.p[a-1]||a-b)[0]:null;
    if(target!==null&&(!Number.isInteger(target)||!rivals.includes(target)||!ok(target)))fail(card==='burn'&&r.burns?.[target]?'เรือลำนี้กำลังไฟไหม้อยู่แล้ว':'เลือกเรือคู่แข่ง');
  }
  if(card==='cut') {
    // fix15: เลือก 2 ทีม ทีมละ −20 (ระบบเติมให้ครบ 2 ทีมถ้าเลือกไม่ครบ)
    const want=Math.min(2,rivals.length);let list=Array.isArray(choice.boats)?choice.boats:target!==null?[target]:[];
    if(list.length>2||new Set(list).size!==list.length||list.some(b=>!Number.isInteger(b)||!rivals.includes(b)))fail('เลือกเรือคู่แข่ง 2 ลำ');
    list=[...list];const pool=(staffed.length>=want?staffed:rivals).filter(b=>!list.includes(b));
    while(list.length<want&&pool.length)list.push(pool.splice(Math.min(pool.length-1,Math.floor(pick()*pool.length)),1)[0]);
    cutBoats=list;target=list[0]??null;
  }
  if(isKick(card)) {
    const mode=card==='kickall'?'all':card==='kick2'?'one':choice.mode==='one'?'one':'all',targets=choice.targets??(choice.target!==undefined&&choice.target!==null&&typeof choice.target==='string'?[choice.target]:[]);
    if(!Array.isArray(targets))fail('เลือกสมาชิกคู่แข่ง');
    const live=rivals.filter(b=>open(r,b).length);
    if(mode==='one') {
      if(targets.length>2)fail('เตะทีมเดียวได้ไม่เกิน 2 คน');
      if(targets.length){
        const b0=r.team[targets[0]];
        for(const id of targets){const b=r.team[id];if(!b||b===boat||r.kicked[id]||offered(r,id)||b!==b0)fail('เลือกคนจากทีมเดียวกัน ไม่เกิน 2 คน');}
        if(new Set(targets).size!==targets.length)fail('เลือกคนซ้ำ');
        victims=[...targets];
      } else if(live.length){const b=pickOne(live,pick),pool=[...open(r,b)];while(victims.length<2&&pool.length)victims.push(pool.splice(Math.min(pool.length-1,Math.floor(pick()*pool.length)),1)[0]);}
    } else {
      // ทุกทีมคู่แข่งทีมละ 1 คน · ทีมที่ไม่ได้เลือก ระบบสุ่มให้
      const seen=new Set();for(const id of targets){const b=r.team[id];if(!b||b===boat||r.kicked[id]||offered(r,id)||seen.has(b))fail('เลือกคู่แข่งทีมละ 1 คน');seen.add(b);victims.push(id);}
      for(const b of live)if(!seen.has(b))victims.push(pickOne(open(r,b),pick));
    }
  }
  let pulled=null,fired=null,swapA=null,swapB=null,revived=null,revivedTo=null,frozen=null,revivedAll=[];
  if(card==='pull') {
    const pool=rivals.flatMap(b=>open(r,b));pulled=typeof choice.uid==='string'?choice.uid:(pool.length?pickOne(pool,pick):null);
    if(pulled!==null&&!pool.includes(pulled))fail('เลือกคู่แข่ง 1 คน');
    if(pulled!==null&&members(r,boat).length+1>capOf(r,boat)) {
      const own=open(r,boat),opener=box.pickedBy||uid;
      if(typeof choice.fire!=='string'&&!auto)fail('ทีมเต็มโควตาแล้ว ต้องเลือกลูกเรือ 1 คนให้ออก');fired=typeof choice.fire==='string'?choice.fire:pickOne(own.filter(u=>u!==opener).length?own.filter(u=>u!==opener):own,pick);
      if(!own.includes(fired))fail('ทีมเต็มโควตาแล้ว ต้องเลือกลูกเรือ 1 คนให้ออก');
    }
  }
  if(card==='swap') {
    const own=open(r,boat),pool=rivals.flatMap(b=>open(r,b));
    swapA=typeof choice.mine==='string'?choice.mine:(own.length?pickOne(own,pick):null);
    swapB=typeof choice.theirs==='string'?choice.theirs:(pool.length?pickOne(pool,pick):null);
    if((swapA!==null&&!own.includes(swapA))||(swapB!==null&&!pool.includes(swapB)))fail('เลือกลูกเรือเรา 1 คน และคู่แข่ง 1 คน');
    if(swapA===null||swapB===null){swapA=null;swapB=null;}
  }
  if(card==='revive') {
    const pool=kickedList(r).filter(u=>u!==r.mm?.uid);revived=typeof choice.uid==='string'?choice.uid:(pool.length?pickOne(pool,pick):null);
    if(revived!==null&&!pool.includes(revived))fail('เลือกคนที่โดนเตะ 1 คน');
  }
  if(card==='freeze') {
    const pool=rivals.flatMap(b=>members(r,b));frozen=typeof choice.uid==='string'?choice.uid:(pool.length?pickOne(pool,pick):null);
    if(frozen!==null&&!pool.includes(frozen))fail('เลือกคู่แข่ง 1 คน');
  }
  // ---- ใช้การ์ด ----
  box.opened=true;box.usedAt=now;delete box.deadline;
  if(card==='supply'){log(r,'เรือ '+boat+' ใช้การ์ดเติมเสบียง +10'+tag);boatProgress(r,boat,10,rng);}
  if(card==='cut'){
    box.targets=cutBoats;box.target=target;
    log(r,cutBoats.length?'เรือ '+boat+' ใช้การ์ดตัดเสบียง เรือ '+cutBoats.join(' และ ')+' ถอยลำละ '+BOAT_CUT+tag:'เรือ '+boat+' ใช้การ์ดตัดเสบียง แต่ไม่มีเรือคู่แข่ง'+tag);
    for(const b of cutBoats)boatProgress(r,b,-BOAT_CUT,rng);
  }
  if(card==='merit'||card==='gift') {
    const amt=card==='gift'?BOAT_GIFT:BOAT_MERIT,id='boat-'+box.id+'-'+(box.pickedAt||now);
    for(const m of members(r,boat)) {
      // ส่วนของผู้กดเข้ากุศลตรง (self:true = ไม่ต้องเขียน ledger)
      if(m===uid){player.merit=(player.merit||0)+amt;ledger.push({uid:m,id,boat,merit:amt,self:true,...(card==='gift'?{title:'กล่องของขวัญเส้น 300',msg:'ทีมเรือ '+boat+' ถึงเส้น 300 ก่อน'}:{})});continue;}
      ledger.push({uid:m,id,boat,merit:amt,...(card==='gift'?{title:'กล่องของขวัญเส้น 300',msg:'ทีมเรือ '+boat+' ถึงเส้น 300 ก่อน'}:{})});
    }
    box.meritTo=members(r,boat);box.meritAmt=amt;
    log(r,card==='gift'?'🎁 เรือ '+boat+' เปิดกล่องของขวัญ ลูกเรือคนละ 150,000'+tag:'เรือ '+boat+' ได้การ์ดกุศล ลูกเรือคนละ 100,000'+tag);
  }
  if(card==='cut1'){box.target=target;if(target===null)log(r,'เรือ '+boat+' ใช้การ์ดตัดเสบียง แต่ไม่มีเรือคู่แข่ง'+tag);else{log(r,'เรือ '+boat+' ใช้การ์ดตัดเสบียง เรือ '+target+' ถอย '+BOAT_CUT1+tag);boatProgress(r,target,-BOAT_CUT1,rng);}}
  if(card==='burn'){box.target=target;if(target===null)log(r,'เรือ '+boat+' ใช้การ์ดเผาเรือ แต่ไม่มีเรือให้เผา'+tag);else{r.burns ||= {};r.burns[target]={by:boat,at:now,until:now+BOAT_BURN_TIME,need:{...BOAT_BURN_NEED},got:Object.fromEntries(Object.keys(BOAT_BURN_NEED).map(k=>[k,0])),paid:{}};log(r,'🔥 เรือ '+boat+' เผาเรือ '+target+'! ลูกเรือต้องช่วยกันกอบกู้ใน 10 นาที'+tag);}}
  if(card==='stop'){r.stopUntil=now+30*60000;r.stopBy=boat;log(r,'เรือ '+boat+' ใช้การ์ดหยุดเรือ ทีมอื่นส่งเสบียงไม่ได้ 30 นาที'+tag);}
  if(isKick(card)) {
    // fix15: คนโดนเตะได้ข้อเสนออยู่ต่อ 2 นาทีก่อน (ยังไม่ออกจากเรือ)
    for(const id of victims){const n=(r.stays[id]||0)+1;if(n>BOAT_STAY_MULT.length){r.kicked[id]=true;log(r,'💦 '+nameOf(r,id)+' ถูกเตะออกจากเรือ '+r.team[id]);continue;}r.offers[id]={at:now,until:now+BOAT_STAY_TIME,n,by:boat,box:box.id};}
    box.victims=victims;box.offered=true;
    log(r,victims.length?'เรือ '+boat+' ใช้การ์ดเตะ '+victims.map(id=>nameOf(r,id)).join(', ')+(victims.some(id=>r.offers[id])?' (รอตัดสินใจ 2 นาที)':'')+tag:'เรือ '+boat+' ใช้การ์ดเตะ แต่ไม่มีคู่แข่งให้เตะ'+tag);
  }
  if(card==='pull') {
    if(pulled===null)log(r,'เรือ '+boat+' ใช้การ์ดดึงตัว แต่ไม่มีคู่แข่งให้ดึง'+tag);
    else {
      box.pulled=pulled;box.from=r.team[pulled];r.team[pulled]=boat;
      log(r,'เรือ '+boat+' ดึง '+nameOf(r,pulled)+' มาจากเรือ '+box.from+tag);
      if(fired!==null){
        r.kicked[fired]=true;r.fired[fired]=true;box.fired=fired;
        const id='boat-fire-'+box.id+'-'+(box.pickedAt||now);
        if(fired===uid){player.merit=(player.merit||0)+BOAT_FIRE_MERIT;ledger.push({uid:fired,id,boat,merit:BOAT_FIRE_MERIT,self:true});}
        else ledger.push({uid:fired,id,boat,merit:BOAT_FIRE_MERIT,title:'ถูกจ้างออกจากเรือ',msg:'ทีมเรือ '+boat+' เต็มโควตา ได้ค่าชดเชย 100,000 กุศล'});
        log(r,nameOf(r,fired)+' ถูกจ้างออกจากเรือ '+boat+' (ทีมเต็มโควตา) ได้ค่าชดเชย 100,000 กุศล');
      }
    }
  }
  if(card==='swap') {
    if(swapA===null)log(r,'เรือ '+boat+' ใช้การ์ดสลับตัว แต่ไม่มีคนให้สลับ'+tag);
    else{const bB=r.team[swapB];r.team[swapB]=boat;r.team[swapA]=bB;box.swap=[swapA,swapB];box.target=bB;log(r,'เรือ '+boat+' สลับ '+nameOf(r,swapA)+' กับ '+nameOf(r,swapB)+' จากเรือ '+bB+tag);}
  }
  const bringBack=u=>{delete r.kicked[u];delete r.fired[u];r.revives++;};
  if((card==='revive'||card==='reviveall')&&(r.revives||0)>=BOAT_REVIVE_MAX){revived=null;revivedAll.length=0;}
  if(card==='revive') {
    if(revived===null)log(r,'เรือ '+boat+' ใช้การ์ดชุบชีวิต แต่ไม่มีใครให้ชุบ'+tag);
    else{revivedTo=r.team[revived];if(!members(r,revivedTo).length)revivedTo=[1,2,3,4,5].filter(b=>members(r,b).length).sort((a,b)=>members(r,a).length-members(r,b).length||a-b)[0]||revivedTo;r.team[revived]=revivedTo;bringBack(revived);box.revived=revived;box.from=revivedTo;box.target=revivedTo;box.full=false;
      log(r,'เรือ '+boat+' ชุบชีวิต '+nameOf(r,revived)+' กลับเรือ '+revivedTo+tag);}
  }
  if(card==='reviveall') {
    // ทุกทีม (ยกเว้นทีมตัวเอง) ทีมละ 1 คนที่โดนเตะ กลับเรือทีมของตัวเอง
    for(const b of rivals){if((r.revives||0)>=BOAT_REVIVE_MAX)break;const pool=kickedList(r).filter(u=>r.team[u]===b);if(!pool.length)continue;const u=pickOne(pool,pick);bringBack(u);revivedAll.push(u);}
    box.revivedAll=revivedAll;
    log(r,revivedAll.length?'เรือ '+boat+' ชุบชีวิตทุกทีม: '+revivedAll.map(u=>nameOf(r,u)+' → เรือ '+r.team[u]).join(', ')+tag:'เรือ '+boat+' ใช้การ์ดชุบชีวิตทุกทีม แต่ไม่มีใครให้ชุบ'+tag);
  }
  if(card==='ink'){box.target=target;box.inkUntil=now+BOAT_INK;log(r,'เรือ '+boat+' พ่นหมึกใส่เรือ '+target+' 5 นาที'+tag);}
  if(card==='freeze') {
    if(frozen===null)log(r,'เรือ '+boat+' ใช้การ์ดแช่แข็ง แต่ไม่มีคู่แข่ง'+tag);
    else{r.frozen[frozen]=Math.max(r.frozen[frozen]||0,now)+BOAT_FREEZE;box.frozen=frozen;box.target=r.team[frozen];log(r,'เรือ '+boat+' แช่แข็ง '+nameOf(r,frozen)+' 60 นาที'+tag);}
  }
  if(card==='crab') {
    for(const m of members(r,target))r.cd[m]=Math.max(r.cd[m]||0,now)+BOAT_CRAB;
    box.target=target;log(r,'เรือ '+boat+' ส่งปูหนีบเรือ '+target+' ต้องรอส่งเพิ่ม 30 นาที'+tag);
  }
  return ledger;
}
/* ข้อเสนออยู่ต่อ: ตัดสินด้วยบัญชีของคนโดนเตะเท่านั้น (ต้องใช้ของในกระเป๋าเขา)
   accept=true จ่ายแล้วอยู่ต่อ · false ออกจากเรือ · null = หมดเวลา (มีของครบอยู่ต่อ ไม่ครบออก) */
const alpacaWool=p=>Number(p.sub?.alpaca?.bag?.wool)||0;
const pestleOf=p=>Number(p.bag?.item?.pestle)||0;
export const stayHave=(player,coins)=>({merit:player.merit||0,hat:Number(player.bag?.item?.hat)||0,mb:Number(player.bag?.item?.musicbox)||0,wool:alpacaWool(player),pestle:pestleOf(player),coin:Number(coins)||0});
export function stayAfford(player,n,coins=0){const c=stayCost(n),h=stayHave(player,coins);return Object.keys(c).every(k=>h[k]>=c[k]);}
function resolveOffer(r,uid,player,accept,now){
  const o=r.offers?.[uid];if(!o)return null;delete r.offers[uid];
  // fix15f: หมดเวลาแล้วอยู่ต่ออัตโนมัติเฉพาะครั้งแรก (×1) · ครั้งต่อไปต้องกดเอง ไม่หักของแพงโดยไม่ตั้งใจ
  const stay=accept===true||(accept===null&&o.n===1&&stayAfford(player,o.n,r._coins));
  if(stay){
    if(!stayAfford(player,o.n,r._coins)){r.offers[uid]=o;fail('ของไม่พอจ่ายข้อเสนอ');}
    const c=stayCost(o.n);player.merit-=c.merit;player.bag.item.hat-=c.hat;player.bag.item.musicbox-=c.mb;player.sub.alpaca.bag.wool-=c.wool;if(c.pestle)player.bag.item.pestle=pestleOf(player)-c.pestle;if(c.coin)r._coins-=c.coin;player.merit+=BOAT_STAY_GAIN;
    r.stays[uid]=o.n;log(r,'💪 '+nameOf(r,uid)+' เลือกอยู่ต่อบนเรือ '+r.team[uid]+(accept===null?' (อัตโนมัติ)':''));return {stay:true,n:o.n,cost:c,gain:BOAT_STAY_GAIN};
  }
  r.kicked[uid]=true;log(r,'💦 '+nameOf(r,uid)+(accept===null?' หมดเวลาตัดสินใจ':' ยอมรับ')+' ออกจากเรือ '+r.team[uid]);return {stay:false,n:o.n};
}
export const boxDeadline=(box,now)=>box.deadline??((box.pickedAt||now)+(needsTarget(box.card)?BOAT_TARGET_TIME:BOAT_CARD_TIME));
/* เส้นตายฝั่งเซิร์ฟเวอร์: การ์ดไม่ต้องเลือกเป้าใช้เองหลัง 30 วิ / การ์ดเลือกเป้าสุ่มเป้าหลัง 10 นาที */
export function settleBoat(r,ctx,rng,player,skipBox) {
  const ledger=[];
  if(r.status!=='running')return ledger;
  // ชำระตามลำดับเส้นตาย (ผลเหมือนกันไม่ว่าใครเรียก) · กล่องที่ผู้เปิดกำลังส่งเป้าเองได้ผ่อนผัน BOAT_GRACE
  const due=r.boxes.filter(box=>!box.opened&&box.picked!==undefined).map(box=>({box,deadline:boxDeadline(box,ctx.now)}))
    .filter(x=>x.deadline<=ctx.now&&!(x.box.id===skipBox&&ctx.now<x.deadline+BOAT_GRACE)).sort((a,b)=>a.deadline-b.deadline||(a.box.id<b.box.id?-1:1));
  for(const {box}of due) {
    if(r.status!=='running')break;
    ledger.push(...useCard(r,box,{},ctx,rng,player,true));
  }
  settleExtras(r,ctx,player,ledger);
  // ข้อเสนออยู่ต่อที่หมดเวลา: ตัดสินได้เฉพาะตอนเจ้าตัวเรียก (ต้องใช้กระเป๋าของเขา)
  const mine=r.offers?.[ctx.uid];if(mine&&mine.until+BOAT_GRACE<=ctx.now)r.lastStay={uid:ctx.uid,...resolveOffer(r,ctx.uid,player,null,ctx.now),at:ctx.now};
  return ledger;
}

/* ---------- fix15f: กล่องจดหมาย/มุมมองส่วนตัวที่คลาวด์ต้องเขียนหลังธุรกรรม ----------
   r.outbox = [{mail:{uid,key,title,msg,icon,kusal,items}} | {view:{uid,data}}] · boatAction ดึงออกแล้วลบทิ้งก่อนบันทึก */
const outbox=(r,x)=>{(r.outbox ||= []).push(x);};
const BURN_ITEM={hat:'hat',mb:'musicbox',wool:'wool',pestle:'pestle'};
function burnRefund(r,b,why){const st=r.burns?.[b];if(!st)return;
  for(const [u,c] of Object.entries(st.paid||{})){const items={};for(const k of ['hat','mb','wool','pestle'])if(c[k]>0)items[BURN_ITEM[k]]=c[k];
    if((c.merit||0)>0||(c.coin||0)>0||Object.keys(items).length)outbox(r,{mail:{uid:u,key:'boat-burn-'+(r.round||0)+'-'+b+'-'+st.at,title:'🔥 คืนของที่ลงขันกอบกู้เรือ '+b,msg:why,icon:'🔥',kusal:c.merit||0,coins:c.coin||0,items}});}
  delete r.burns[b];}
const mmDue=(mm,i)=>mm.since+BOAT_MM_CHECKS[i];
const dLeft=d=>Number.isInteger(d?.left)?d.left:1;// การ์ดเส้น 350 ก่อนอัปเดตจ้างออก 1 คน
function mmView(r){const mm=r.mm;if(!mm||mm.done)return null;const i=mm.ok.findIndex(x=>!x);
  return {round:r.round||0,active:true,since:mm.since,earn:mm.earn,check:i<0?null:{n:i+1,at:mmDue(mm,i),until:mmDue(mm,i)+BOAT_MM_REPLY},
    dismiss:Object.entries(r.dismiss||{}).map(([b,d])=>({boat:+b,until:d.until,left:dLeft(d),crew:members(r,+b).map(u=>({u,n:nameOf(r,u)}))}))};}// Firestore: ห้าม array ซ้อน array
function emitViews(r){const v=mmView(r),uid=r.mm&&!r.mm.done?r.mm.uid:null,sig=JSON.stringify([uid,v]);
  if(sig===(r.mmSig??JSON.stringify([null,null])))return;r.mmSig=sig;if(uid)outbox(r,{view:{uid,data:v}});}
function ensureMermaid(r,now){
  if(r.status!=='running'||(r.mm&&!r.mm.done))return;
  const out=Object.keys(r.kicked||{}).filter(u=>r.kicked[u]&&r.team[u]);if(out.length<BOAT_MM_NEED)return;
  const pool=out.filter(u=>!r.mmEx?.[u]&&!r.offers?.[u]).sort();if(!pool.length)return;
  const uid=pickOne(pool,seededRng((r.round||0)+'|mm|'+out.length+'|'+Object.keys(r.mmEx||{}).length));
  r.mm={uid,since:now,earn:0,ok:BOAT_MM_CHECKS.map(()=>false)};log(r,'🧜‍♀️ นางเงือกปรากฏตัวแล้ว!');
  outbox(r,{view:{uid,data:{round:r.round||0,active:true,notice:{k:'appointed',at:now}}}});r.mmSig=null;
}
function mmNeglect(r,now){const old=r.mm.uid;r.mmEx ||= {};r.mmEx[old]=true;r.mm=null;r.mmSig=null;log(r,'🧜‍♀️ นางเงือกละเลยหน้าที่ มีนางเงือกตนใหม่มาแทน');
  outbox(r,{mail:{uid:old,key:'boat-mm-fake-'+(r.round||0)+'-'+now,title:'💔 นางเงือกตัวปลอม',msg:'เธอได้ละเลยจากการเป็นนางเงือก ได้แต่งตั้งนางเงือกคนใหม่แล้ว เสียใจด้วย เธอเป็นนางเงือกตัวปลอม',icon:'🧜‍♀️',kusal:0,items:{}}});
  outbox(r,{view:{uid:old,data:{round:r.round||0,active:false,notice:{k:'fake',at:now}}}});ensureMermaid(r,now);}
function fireOut(r,b,u,ctx,player,ledger,auto){
  r.kicked[u]=true;r.fired ||= {};r.fired[u]=true;delete r.offers?.[u];
  const d=r.dismiss[b];if(d){d.left=dLeft(d)-1;if(d.left<=0||members(r,b).length<2)delete r.dismiss[b];}
  const id='boat-mm-'+(r.round||0)+'-'+b+'-'+u;
  if(u===ctx.uid){player.merit=(player.merit||0)+BOAT_FIRE350;ledger.push({uid:u,id,boat:b,merit:BOAT_FIRE350,self:true,title:'🧜‍♀️ นางเงือกจ้างออก'});}
  else ledger.push({uid:u,id,boat:b,merit:BOAT_FIRE350,title:'🧜‍♀️ นางเงือกจ้างออก',msg:'ได้ค่าจ้างออกจากเรือ '+b+' 1,000,000 กุศล'});
  log(r,'🧜‍♀️ '+(auto?'ระบบ':'นางเงือก')+'จ้าง '+nameOf(r,u)+' ออกจากเรือ '+b+' ได้ 1,000,000 กุศล');}
/* งานตามเวลา: เรือไหม้หมดเวลา · จ้างออกเส้น 350 · เช็กอินนางเงือก · แต่งตั้งนางเงือก (ผลเหมือนกันไม่ว่าใครเรียก) */
function settleExtras(r,ctx,player,ledger){
  if(r.status!=='running')return;const now=ctx.now;
  for(const b of Object.keys(r.burns||{}).map(Number).sort()){const st=r.burns[b];if(now<st.until)continue;
    const crew=members(r,b);for(const u of crew){r.kicked[u]=true;r.burned ||= {};r.burned[u]=true;delete r.offers?.[u];}
    burnRefund(r,b,'เรือจม ระบบคืนของที่ลงขันให้ครบ');log(r,'💀 เรือ '+b+' กอบกู้ไม่ทัน จมแล้ว ลูกเรือหลุดทั้งลำ');r.lastBurn={boat:b,ok:false,at:now};}
  if(r.mm&&!r.mm.done)for(let i=0;i<BOAT_MM_CHECKS.length;i++)if(!r.mm.ok[i]&&now>=mmDue(r.mm,i)+BOAT_MM_REPLY+BOAT_GRACE){mmNeglect(r,now);break;}
  ensureMermaid(r,now);
  for(const b of Object.keys(r.dismiss||{}).map(Number).sort()){const d=r.dismiss[b];if(r.mm&&!r.mm.done&&now<d.until+BOAT_GRACE)continue;
    for(let k=0;r.dismiss[b]&&k<BOAT_FIRE350_N;k++){const crew=members(r,b).sort();if(crew.length<2){delete r.dismiss[b];break;}
      fireOut(r,b,pickOne(crew,seededRng((r.round||0)+'|fire|'+b+'|'+k)),ctx,player,ledger,true);}}
}
function finishExtras(r){
  for(const b of Object.keys(r.burns||{}))burnRefund(r,+b,'การแข่งจบระหว่างเรือไหม้ ระบบคืนของที่ลงขันให้ครบ');
  r.dismiss={};
  if(r.mm&&!r.mm.done){const mm=r.mm;mm.done=true;r.mmSig=null;
    if(mm.earn>0)outbox(r,{mail:{uid:mm.uid,key:'boat-mm-pay-'+(r.round||0),title:'🧜‍♀️ ค่าประกอบวิชาชีพนางเงือก',msg:'ขอบคุณที่ทำหน้าที่นางเงือกจนจบการแข่ง',icon:'🧜‍♀️',kusal:mm.earn,items:{}}});
    outbox(r,{view:{uid:mm.uid,data:{round:r.round||0,active:false,notice:{k:'paid',earn:mm.earn}}}});}
}
function shiftTimers(r,now) {
  const at=r.pausedAt,d=Number.isFinite(at)?Math.max(0,now-at):0;r.pausedAt=null;if(!d)return;
  for(const u of Object.keys(r.cd))if(r.cd[u]>at)r.cd[u]+=d;
  if(r.stopUntil>at)r.stopUntil+=d;
  for(const u of Object.keys(r.frozen||{}))if(r.frozen[u]>at)r.frozen[u]+=d;
  for(const box of r.boxes)if(!box.opened&&box.picked!==undefined){if(Number.isFinite(box.pickedAt))box.pickedAt+=d;if(Number.isFinite(box.deadline))box.deadline+=d;}
  for(const o of Object.values(r.offers||{}))if(o.until>at)o.until+=d;
  for(const x of Object.values(r.burns||{}))if(x.until>at)x.until+=d;
  for(const x of Object.values(r.dismiss||{}))if(x.until>at)x.until+=d;
  if(r.mm&&!r.mm.done)r.mm.since+=d;r.mmSig=null;
}
export function boatAction(source,account,ctx,input,rng=Math.random) {
  const r={...freshBoat(),...structuredClone(source)}, player=structuredClone(account), {uid,admin,now}=ctx;
  if(!uid||!Number.isFinite(now))fail('ไม่มีบัญชีหรือเวลาเซิร์ฟเวอร์');
  const type=input.type;
  if(!r.names)r.names={};if(ctx.name&&r.team[uid])r.names[uid]=String(ctx.name).slice(0,40);
  r._now=now;r._coins=Number.isSafeInteger(ctx.coins)?ctx.coins:0;const coins0=r._coins;
  const ledger=settleBoat(r,ctx,rng,player,type==='card'?input.box:null);
  const done=extra=>{settleExtras(r,ctx,player,ledger);emitViews(r);const mails=[],views=[];for(const x of r.outbox||[]){if(x.mail)mails.push(x.mail);if(x.view){const v=views.find(v=>v.uid===x.view.uid);if(v)v.data={...v.data,...x.view.data};else views.push({uid:x.view.uid,data:{...x.view.data}});}}delete r.outbox;delete r._now;const coinsOut=r._coins;delete r._coins;return {race:r,player,ledger,mails,views,...(coinsOut!==coins0?{coins:coinsOut}:{}),...extra};};
  const boat=r.team[uid];
  // status/tick: ไม่เปลี่ยนอะไรนอกจากชำระการ์ดที่หมดเวลา (tick = ไคลเอนต์เห็นเส้นตายผ่านแล้ว ขอให้เซิร์ฟเวอร์ชำระ)
  if(type==='status'||type==='tick')return done();
  const addNames=()=>{for(const [id,n]of Object.entries(input.names||{}))if(typeof n==='string')r.names[id]=n.slice(0,40);};
  if(type==='teams') {
    if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='setup')fail('จัดทีมก่อนเริ่มการแข่งขันเท่านั้น');
    const roster=input.roster||[];
    if(Number.isInteger(input.boat)&&Array.isArray(input.members)) {
      // บันทึกทีละลำ: ตรวจเฉพาะสมาชิกของลำที่แก้
      const b=input.boat;if(!boatOk(b))fail('เรือไม่ถูกต้อง');
      for(const id of input.members)if(!roster.includes(id))fail('สมาชิกหรือทีมไม่ถูกต้อง');
      for(const id of Object.keys(r.team))if(r.team[id]===b&&!input.members.includes(id))delete r.team[id];
      for(const id of input.members)r.team[id]=b;
    } else {
      const team=input.team||{};
      for(const [id,b]of Object.entries(team))if(!boatOk(b)||r.team[id]!==b&&!roster.includes(id))fail('สมาชิกหรือทีมไม่ถูกต้อง');
      r.team={...team};
    }
    addNames();return done();
  }
  if(type==='addMember') {
    if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='running'&&r.status!=='paused')fail('เพิ่มคนระหว่างแข่งได้เมื่อเริ่มรอบแล้วเท่านั้น');
    const id=input.uid,b=input.boat;
    if(typeof id!=='string'||!(input.roster||[]).includes(id))fail('สมาชิกไม่ถูกต้อง');if(!boatOk(b))fail('เรือไม่ถูกต้อง');
    if(r.team[id])fail('สมาชิกคนนี้มีทีมแล้ว ย้ายทีมระหว่างแข่งไม่ได้');
    r.team[id]=b;r.startSize ||= {};r.startSize[b]=(r.startSize[b]||0)+1;addNames();log(r,'แอดมินเพิ่ม '+nameOf(r,id)+' เข้าเรือ '+b);return done();
  }
  if(type==='menus'){
    if(!admin)fail('เฉพาะแอดมิน');if(r.status==='running'||r.status==='paused')fail('ตั้งเสบียงก่อนเริ่มรอบ');const b=input.boat,menus=input.menus;
    if(!boatOk(b)||!Array.isArray(menus)||menus.length<1||menus.length>BOAT_MENU_MAX||new Set(menus).size!==menus.length||menus.some(k=>!foodKeys.has(k)&&!(typeof k==='string'&&k.startsWith('alp-')&&BOAT_ALPACA[k.slice(4)])))fail('เลือกเสบียง 1–8 เมนูไม่ซ้ำสำหรับเรือลำนี้');
    r.menus[b]=[...menus];return done();
  }
  if(type==='pause'){if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='running')fail('สถานะไม่ถูกต้อง');r.status='paused';r.pausedAt=now;log(r,'⏸️ แอดมินพักการแข่งขัน');return done();}
  if(type==='resume'){if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='paused')fail('สถานะไม่ถูกต้อง');shiftTimers(r,now);r.status='running';log(r,'▶️ แข่งต่อ');return done();}
  if(type==='start') {
    if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='setup')fail('รีเซ็ตรอบเดิมก่อนเริ่มรอบใหม่');if(!Object.keys(r.team).length)fail('ต้องจัดทีมก่อน');
    const fresh=freshBoat();fresh.team={...r.team};fresh.menus={...r.menus};fresh.names={...r.names};fresh.lastTeam={...r.team};fresh.round=now;fresh.status='running';
    for(const b of [1,2,3,4,5])fresh.startSize[b]=Object.values(r.team).filter(x=>x===b).length;log(fresh,'🏁 เริ่มการแข่งขัน');
    return {race:fresh,player,ledger,mails:[],views:[]};
  }
  if(type==='reset'){if(!admin)fail('เฉพาะแอดมิน');const fresh=freshBoat();fresh.lastTeam=Object.keys(r.team).length?{...r.team}:{...(r.lastTeam||{})};fresh.names={...r.names};fresh.menus={...r.menus};
    // fix15f: รีเซ็ตกลางการแข่ง → คืนของเผาเรือ · จ่ายค่านางเงือก · ส่งจดหมายที่ค้างจากการชำระ (ไม่ทิ้งของใคร)
    if(r.status==='running'||r.status==='paused')finishExtras(r);
    const mails=[],views=[];for(const x of r.outbox||[]){if(x.mail)mails.push(x.mail);if(x.view){const v=views.find(v=>v.uid===x.view.uid);if(v)v.data={...v.data,...x.view.data};else views.push({uid:x.view.uid,data:{...x.view.data}});}}
    if(r.mm&&!views.some(v=>v.uid===r.mm.uid))views.push({uid:r.mm.uid,data:{round:r.round||0,active:false}});return {race:fresh,player,ledger,mails,views};}
  if(type==='claimCredit') {
    const credited=r.credits[uid]||0,claimed=r.claimedCredits[uid]||0,amount=credited-claimed;
    if(amount<=0)fail('ไม่มีรางวัลใหม่');player.merit=(player.merit||0)+amount;r.claimedCredits[uid]=credited;return done();
  }
  if(r.status!=='running')fail(r.status==='paused'?'พักการแข่งขันอยู่':'การแข่งขันไม่ได้เปิดอยู่');
  if(type==='mmPoke'){
    if(!r.mm||r.mm.done)fail('ตอนนี้ไม่มีนางเงือก');if(r.mm.uid===uid)fail('กดตัวเองไม่ได้');if(admin)fail('แอดมินไม่ต้องกด');
    if((player.merit||0)<BOAT_MM_POKE)fail('กุศลไม่พอ');player.merit=(player.merit||0)-BOAT_MM_POKE;return done({poke:BOAT_MM_POKE});
  }
  if(type==='mmCheck'){
    const mm=r.mm;if(!mm||mm.done||mm.uid!==uid)fail('คุณไม่ได้เป็นนางเงือกแล้ว');
    const i=mm.ok.findIndex((x,k)=>!x&&now>=mmDue(mm,k));if(i<0)fail('ยังไม่ถึงเวลาเช็กอิน');
    mm.ok[i]=true;r.mmSig=null;return done({check:i+1});
  }
  if(type==='mmFire'){
    const mm=r.mm;if(!mm||mm.done||mm.uid!==uid)fail('คุณไม่ได้เป็นนางเงือก');
    const b=input.boat;if(!r.dismiss?.[b])fail('เรือลำนี้ไม่ต้องจ้างออกแล้ว');
    const crew=members(r,b),want=Array.isArray(input.uids)?input.uids:[input.uid],left=dLeft(r.dismiss[b]);
    if(!want.length||want.length>left||new Set(want).size!==want.length)fail('เลือกลูกเรือ '+Math.min(left,Math.max(1,crew.length-1))+' คน');
    if(want.some(u=>typeof u!=='string'||!crew.includes(u)))fail('เลือกลูกเรือของเรือ '+b);
    if(crew.length<2){delete r.dismiss[b];return done({fire:null});}
    const fired=[];for(const u of want){if(!r.dismiss[b]||members(r,b).length<2)break;fireOut(r,b,u,ctx,player,ledger,false);fired.push(u);}
    return done({fire:fired[0]??null,fires:fired});
  }
  if(type==='burnPay'){
    const b=r.team[uid],st=r.burns?.[b];if(!b||r.kicked[uid]||!st)fail('เรือของคุณไม่ได้ไฟไหม้');
    const need=burnNeed(st),have={...stayHave(player,r._coins),merit:Math.max(0,player.merit||0)};
    const req={},take={};let sum=0;
    for(const k of Object.keys(need)){const v=input[k]===undefined?0:input[k];if(!Number.isSafeInteger(v)||v<0)fail('จำนวนไม่ถูกต้อง');if(v>have[k])fail('ของไม่พอ');req[k]=v;take[k]=Math.min(v,Math.max(0,need[k]-(st.got[k]||0)));sum+=take[k];}
    if(!sum&&!st.paid[uid]){const k=Object.keys(req).find(k=>req[k]>0);if(k){take[k]=1;sum=1;}}
    if(!sum)fail(st.paid[uid]?'ของส่วนนี้ครบแล้ว':'ลงขันอย่างน้อย 1 ชิ้น');
    player.merit-=take.merit||0;if(take.hat)player.bag.item.hat-=take.hat;if(take.mb)player.bag.item.musicbox-=take.mb;if(take.wool)player.sub.alpaca.bag.wool-=take.wool;if(take.pestle)player.bag.item.pestle=pestleOf(player)-take.pestle;if(take.coin)r._coins-=take.coin;
    const mine=st.paid[uid] ||= Object.fromEntries(Object.keys(need).map(k=>[k,0]));for(const k of Object.keys(take)){st.got[k]=(st.got[k]||0)+take[k];mine[k]=(mine[k]||0)+take[k];}
    log(r,'🪣 '+nameOf(r,uid)+' ลงขันกอบกู้เรือ '+b);
    const full=Object.keys(need).every(k=>(st.got[k]||0)>=need[k]),all=members(r,b).every(u=>st.paid[u]);
    if(full&&all){delete r.burns[b];r.lastBurn={boat:b,ok:true,at:now};log(r,'🌊 เรือ '+b+' กอบกู้สำเร็จ! ถอย '+BOAT_BURN_BACK);boatProgress(r,b,-BOAT_BURN_BACK,rng);}
    return done({burnPaid:take,saved:full&&all});
  }
  if(type==='stay'){
    const o=r.offers?.[uid];if(!o)fail('ไม่มีข้อเสนอที่รอตัดสินใจ');
    const accept=input.accept===true?true:input.accept===false?false:null;
    if(accept===null&&now<o.until)fail('ยังไม่หมดเวลาตัดสินใจ');
    const res=resolveOffer(r,uid,player,accept,now);r.lastStay={uid,...res,at:now};return done({stay:res});
  }
  if(!boat||r.kicked[uid])fail('คุณยังไม่มีทีม หรือถูกคัดออกแล้ว');
  if(r.offers?.[uid])fail('ตัดสินใจข้อเสนออยู่ต่อก่อนนะ');
  if(type==='supply') {
    if(r.stopUntil>now&&r.stopBy!==boat)fail('เรือถูกหยุด');
    if(r.burns?.[boat])fail('🔥 เรือกำลังไฟไหม้ ส่งเสบียงไม่ได้ ช่วยกันกอบกู้ก่อน');
    if((r.frozen?.[uid]||0)>now)fail('🧊 ถูกแช่แข็งอยู่ ส่งเสบียงไม่ได้');
    if((r.cd[uid]||0)>now)fail('ยังอยู่ในช่วงพักส่ง');
    const qty=input.qty===undefined?1:input.qty;if(!BOAT_SEND.includes(qty))fail('ส่งได้ครั้งละ 1 หรือ 3 ชิ้น');
    const alp=input.group==='alpaca',k=String(input.food);let menuKey,have,take;
    if(alp){
      if(!BOAT_ALPACA[k])fail('ของแปรรูปนี้ส่งเป็นเสบียงไม่ได้');menuKey='alp-'+k;
      have=Number(player.sub?.alpaca?.bag?.[k])||0;take=()=>{player.sub.alpaca.bag[k]=have-qty;};
    } else {
      const group=input.group==='food'?'food':'gfood',menu=CATALOG.find(c=>c.p===group+'.'+k);menuKey=menu?.k||null;
      have=Number(player.bag?.[group]?.[k])||0;take=()=>{player.bag[group][k]=have-qty;};
    }
    if(r.menus[boat]?.length&&(!menuKey||!r.menus[boat].includes(menuKey)))fail('อาหารนี้ไม่อยู่ในเสบียงของทีม');
    if(have<qty)fail(alp?'ของแปรรูปไม่พอ':'อาหารสวนไม่พอ');
    take();let gain=0;
    for(let i=0;i<qty;i++)gain+=alp?BOAT_STAR_MERIT[BOAT_ALPACA[k][0]]:BOAT_FOOD_MERIT[0]+Math.floor(rng()*(BOAT_FOOD_MERIT[1]-BOAT_FOOD_MERIT[0]+1));
    // คอมโบ: ครบทุกเมนูของเรือตัวเอง +5,000 (ไม่เลื่อนเรือ) · ย้ายทีมแล้วเริ่มนับใหม่
    r.combo ||= {};let c=r.combo[uid];if(!c||c.b!==boat)c=r.combo[uid]={b:boat,got:[]};let combo=0;
    const menus=r.menus[boat]||[];if(menus.length&&!c.got.includes(menuKey)){c.got.push(menuKey);if(menus.every(m=>c.got.includes(m))){combo=BOAT_COMBO;c.got=[];c.n=(c.n||0)+1;log(r,'🍱 '+nameOf(r,uid)+' ส่งเสบียงครบทุกเมนู รับคอมโบ +20,000 กุศล');if(r.mm&&!r.mm.done){r.mm.earn+=Math.round(BOAT_COMBO*BOAT_MM_SHARE);}}}
    player.merit=(player.merit||0)+gain+combo;
    r.cd[uid]=now+BOAT_COOLDOWN;r.sent[uid]=(r.sent[uid]||0)+qty;
    log(r,nameOf(r,uid)+' ส่งเสบียงเรือ '+boat+(qty>1?' ×'+qty:''));boatProgress(r,boat,qty,rng);return done({supply:{qty,gain,combo}});
  }
  if(!['card','pick'].includes(type))fail('คำสั่งเรือไม่ถูกต้อง');
  const box=r.boxes.find(x=>x.id===input.box);
  if(!box||box.boat!==boat||box.opened)fail('กล่องนี้เปิดไม่ได้หรือใช้ไปแล้ว');
  const i=input.index;if(!Number.isInteger(i)||i<0||i>4)fail('ต้องเลือกการ์ดหนึ่งใบ');
  if(box.picked!==undefined&&box.picked!==i)fail('กล่องนี้เลือกการ์ดไปแล้ว');
  const card=box.deck[i];
  if(type==='pick'){
    if(box.picked!==undefined)fail('กล่องนี้เลือกการ์ดไปแล้ว');
    box.picked=i;box.pickedAt=now;box.card=card;box.pickedBy=uid;box.deadline=now+(needsTarget(card)?BOAT_TARGET_TIME:BOAT_CARD_TIME);
    log(r,nameOf(r,uid)+' เปิดกล่องเรือ '+boat+' ได้การ์ด'+BOAT_CARD_NAMES[card]);
    return done({card,reveal:box.deck});
  }
  if(box.picked===undefined){box.picked=i;box.pickedAt=now;box.card=card;}
  ledger.push(...useCard(r,box,{target:input.target,targets:input.targets,boats:input.boats,mode:input.mode,uid:input.uid,fire:input.fire,mine:input.mine,theirs:input.theirs},ctx,rng,player,false));
  return done({card,reveal:box.deck});
}
export function publicBoat(r) {const out=structuredClone(r);delete out.outbox;delete out._now;delete out.mmSig;for(const b of out.boxes)if(!b.opened&&b.picked===undefined)delete b.deck;return out;}
