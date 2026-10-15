import {CATALOG} from './catalog.js';
/* กติกาเรือเป็นฟังก์ชันล้วน: ใช้กับ transaction บนคลาวด์ ไม่สร้างผู้เล่นจำลอง */
export const BOAT_LINES=[50,100,150,200,250,300];
export const BOAT_GOAL=400;
export const BOAT_COOLDOWN=5*60000;
export const BOAT_CARD_TIME=30000;        // การ์ดที่หยิบแล้ว ใช้เองอัตโนมัติเมื่อครบ 30 วิ (เวลาเซิร์ฟเวอร์)
export const BOAT_TARGET_TIME=10*60000;   // การ์ดที่ต้องเลือกเป้า ถ้าไม่เลือกใน 10 นาที ระบบสุ่มเป้าให้
export const BOAT_MERIT=100000;          // fix14: การ์ดกุศล ลูกเรือคนละ 100,000
export const BOAT_FIRE_MERIT=100000;     // fix14: ลูกเรือที่ "ถูกจ้างออก" (ดึงตัวเกินโควตา) ได้ 100,000
export const BOAT_REVIVE_MAX=2;          // fix14: ชุบชีวิตได้ไม่เกิน 2 ครั้งต่อการแข่ง
export const BOAT_FREEZE=30*60000,BOAT_CRAB=10*60000,BOAT_INK=60000;
export const BOAT_MENU_MAX=8;
/* fix14: การ์ด 11 ใบ · เส้น 50/100 เน้นเตะ+ชุบชีวิต · การ์ดชุบชีวิตออกเฉพาะเมื่อมีคนโดนเตะแล้วและยังชุบไม่ครบ 2 ครั้ง */
export const BOAT_CARDS_EARLY=[['kick',30],['revive',20],['pull',10],['swap',8],['ink',8],['freeze',6],['crab',6],['supply',4],['cut',4],['stop',2],['merit',2]];
export const BOAT_CARDS_LATE=[['kick',12],['revive',8],['pull',8],['swap',8],['ink',8],['freeze',8],['crab',8],['supply',14],['cut',14],['stop',6],['merit',6]];
export const BOAT_CARDS=BOAT_CARDS_LATE;
export const boxSlots=line=>line===50?4:line===100?3:2; // fix15: เส้น 50 มี 4 · เส้น 100 มี 3 · ที่เหลือ 2
export const BOAT_GRACE=15000;          // ผู้เปิดส่งเป้าช้ากว่าเส้นตายได้ไม่เกิน 15 วิ (เผื่อเน็ตช้า) หลังจากนั้นเซิร์ฟเวอร์สุ่มเอง
export const BOAT_CARD_NAMES={supply:'เติมเสบียง',cut:'ตัดเสบียง',merit:'กุศล',stop:'หยุดเรือ',kick:'เตะ',kickall:'เตะกวาดทุกทีม',kick2:'เตะเจาะทีม',pull:'ดึงตัว',swap:'สลับตัว',revive:'ชุบชีวิต',reviveall:'ชุบชีวิตทุกทีม',ink:'พ่นหมึก',freeze:'แช่แข็ง',crab:'ปูหนีบ',gift:'กล่องของขวัญ'};
const TARGET_CARDS=new Set(['cut','kick','kickall','kick2','pull','swap','revive','ink','freeze','crab']);
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
export const BOAT_STAY_TIME=2*60000,BOAT_STAY_GAIN=50000,BOAT_STAY_COST={merit:10000,hat:1000,mb:1000,wool:200};
export const BOAT_COMBO=5000,BOAT_SEND=[1,3];
export const BOAT_FOOD_MERIT=[100,200];
export const BOAT_STAR_MERIT={1:200,2:300,3:500,4:700,5:1000,6:1000};
/* ของแปรรูปอัลปาก้า [ดาว, ชื่อ] · key เมนูเรือ = 'alp-'+id · ของอยู่ใน sub.alpaca.bag[id] */
export const BOAT_ALPACA={'wool-yarn':[1,'ไหมพรม'],'wool-mittens':[2,'ถุงมือขนฟู'],'wool-beanie':[2,'หมวกบีนนี่'],'wool-bag':[2,'กระเป๋าพาสเทล'],'wool-scarf':[3,'ผ้าพันคอสายรุ้ง'],'wool-blanket':[3,'ผ้าห่มนุ่มฟู'],'wool-plush':[4,'ตุ๊กตาอัลปาก้า'],'wool-goldbag':[4,'กระเป๋าหรูขนทอง'],'wool-cloak':[5,'เสื้อคลุมราชวงศ์ทอง'],'wool-rug':[6,'พรมขนทองยัยหนู'],
 'meat-skewer':[1,'ลูกชิ้นปิ้ง'],'meat-sausage':[1,'ไส้กรอกสมุนไพร'],'meat-steak':[2,'สเต็ก'],'meat-burger':[2,'เบอร์เกอร์ชีส'],'meat-smoked':[2,'รมควัน'],'meat-massaman':[3,'มัสมั่น'],'meat-ghostsoup':[3,'ซุปหม้อวิญญาณ'],'meat-winestew':[4,'ตุ๋นไวน์แดง'],'meat-royal':[5,'ชุดเนื้อราชวงศ์'],'meat-buffet':[6,'บุฟเฟต์ทองคำ']};
export const stayCost=n=>Object.fromEntries(Object.entries(BOAT_STAY_COST).map(([k,v])=>[k,v*Math.max(1,n)]));
const isKick=c=>c==='kick'||c==='kickall'||c==='kick2';
export const needsTarget=card=>TARGET_CARDS.has(card);
const fail=m=>{throw new Error(m);};
export function freshBoat(){return {status:'setup',p:[0,0,0,0,0],team:{},kicked:{},claims:{},menus:{},boxes:[],winner:null,stopUntil:0,stopBy:null,sent:{},cd:{},credits:{},claimedCredits:{},log:[],names:{},lastTeam:{},pausedAt:null,startSize:{},fired:{},frozen:{},revives:0,offers:{},stays:{},combo:{}};}
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
      const can=reviveOk(r),first=!arrived.length;arrived.push(b);r.boxes.push({id:line+'-'+b,boat:b,line,opened:false,deck:Array.from({length:5},()=>rollCard(rng,line,can))});
      if(line===300&&first){r.boxes.push({id:'300-'+b+'-gift',boat:b,line,opened:false,gift:true,deck:Array(5).fill('gift')});log(r,'🎁 เรือ '+b+' ถึงเส้น 300 ก่อน ได้กล่องของขวัญ!');}
    }
  }
  if(r.p[b-1]===BOAT_GOAL){r.status='finished';r.winner=b;log(r,'🏁 เรือ '+b+' ถึงเส้น 400 ชนะ!');}
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
    const pool=kickedList(r);revived=typeof choice.uid==='string'?choice.uid:(pool.length?pickOne(pool,pick):null);
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
  if(card==='stop'){r.stopUntil=now+30*60000;r.stopBy=boat;log(r,'เรือ '+boat+' ใช้การ์ดหยุดเรือ ทีมอื่นส่งเสบียงไม่ได้ 30 นาที'+tag);}
  if(isKick(card)) {
    // fix15: คนโดนเตะได้ข้อเสนออยู่ต่อ 2 นาทีก่อน (ยังไม่ออกจากเรือ)
    for(const id of victims)r.offers[id]={at:now,until:now+BOAT_STAY_TIME,n:(r.stays[id]||0)+1,by:boat,box:box.id};
    box.victims=victims;box.offered=true;
    log(r,victims.length?'เรือ '+boat+' ใช้การ์ดเตะ '+victims.map(id=>nameOf(r,id)).join(', ')+' (รอตัดสินใจ 2 นาที)'+tag:'เรือ '+boat+' ใช้การ์ดเตะ แต่ไม่มีคู่แข่งให้เตะ'+tag);
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
  if(card==='revive') {
    if(revived===null)log(r,'เรือ '+boat+' ใช้การ์ดชุบชีวิต แต่ไม่มีใครให้ชุบ'+tag);
    else{revivedTo=r.team[revived];bringBack(revived);box.revived=revived;box.from=revivedTo;box.target=revivedTo;box.full=false;
      log(r,'เรือ '+boat+' ชุบชีวิต '+nameOf(r,revived)+' กลับเรือ '+revivedTo+tag);}
  }
  if(card==='reviveall') {
    // ทุกทีม (ยกเว้นทีมตัวเอง) ทีมละ 1 คนที่โดนเตะ กลับเรือทีมของตัวเอง
    for(const b of rivals){const pool=kickedList(r).filter(u=>r.team[u]===b);if(!pool.length)continue;const u=pickOne(pool,pick);bringBack(u);revivedAll.push(u);}
    box.revivedAll=revivedAll;
    log(r,revivedAll.length?'เรือ '+boat+' ชุบชีวิตทุกทีม: '+revivedAll.map(u=>nameOf(r,u)+' → เรือ '+r.team[u]).join(', ')+tag:'เรือ '+boat+' ใช้การ์ดชุบชีวิตทุกทีม แต่ไม่มีใครให้ชุบ'+tag);
  }
  if(card==='ink'){box.target=target;box.inkUntil=now+BOAT_INK;log(r,'เรือ '+boat+' พ่นหมึกใส่เรือ '+target+tag);}
  if(card==='freeze') {
    if(frozen===null)log(r,'เรือ '+boat+' ใช้การ์ดแช่แข็ง แต่ไม่มีคู่แข่ง'+tag);
    else{r.frozen[frozen]=Math.max(r.frozen[frozen]||0,now)+BOAT_FREEZE;box.frozen=frozen;box.target=r.team[frozen];log(r,'เรือ '+boat+' แช่แข็ง '+nameOf(r,frozen)+' 30 นาที'+tag);}
  }
  if(card==='crab') {
    for(const m of members(r,target))r.cd[m]=Math.max(r.cd[m]||0,now)+BOAT_CRAB;
    box.target=target;log(r,'เรือ '+boat+' ส่งปูหนีบเรือ '+target+' ต้องรอส่งเพิ่ม 10 นาที'+tag);
  }
  return ledger;
}
/* ข้อเสนออยู่ต่อ: ตัดสินด้วยบัญชีของคนโดนเตะเท่านั้น (ต้องใช้ของในกระเป๋าเขา)
   accept=true จ่ายแล้วอยู่ต่อ · false ออกจากเรือ · null = หมดเวลา (มีของครบอยู่ต่อ ไม่ครบออก) */
const alpacaWool=p=>Number(p.sub?.alpaca?.bag?.wool)||0;
export function stayAfford(player,n){const c=stayCost(n);return (player.merit||0)>=c.merit&&(Number(player.bag?.item?.hat)||0)>=c.hat&&(Number(player.bag?.item?.musicbox)||0)>=c.mb&&alpacaWool(player)>=c.wool;}
function resolveOffer(r,uid,player,accept,now){
  const o=r.offers?.[uid];if(!o)return null;delete r.offers[uid];
  const stay=accept===true||(accept===null&&stayAfford(player,o.n));
  if(stay){
    if(!stayAfford(player,o.n)){r.offers[uid]=o;fail('ของไม่พอจ่ายข้อเสนอ');}
    const c=stayCost(o.n);player.merit-=c.merit;player.bag.item.hat-=c.hat;player.bag.item.musicbox-=c.mb;player.sub.alpaca.bag.wool-=c.wool;player.merit+=BOAT_STAY_GAIN;
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
  // ข้อเสนออยู่ต่อที่หมดเวลา: ตัดสินได้เฉพาะตอนเจ้าตัวเรียก (ต้องใช้กระเป๋าของเขา)
  const mine=r.offers?.[ctx.uid];if(mine&&mine.until+BOAT_GRACE<=ctx.now)r.lastStay={uid:ctx.uid,...resolveOffer(r,ctx.uid,player,null,ctx.now),at:ctx.now};
  return ledger;
}
function shiftTimers(r,now) {
  const at=r.pausedAt,d=Number.isFinite(at)?Math.max(0,now-at):0;r.pausedAt=null;if(!d)return;
  for(const u of Object.keys(r.cd))if(r.cd[u]>at)r.cd[u]+=d;
  if(r.stopUntil>at)r.stopUntil+=d;
  for(const u of Object.keys(r.frozen||{}))if(r.frozen[u]>at)r.frozen[u]+=d;
  for(const box of r.boxes)if(!box.opened&&box.picked!==undefined){if(Number.isFinite(box.pickedAt))box.pickedAt+=d;if(Number.isFinite(box.deadline))box.deadline+=d;}
  for(const o of Object.values(r.offers||{}))if(o.until>at)o.until+=d;
}
export function boatAction(source,account,ctx,input,rng=Math.random) {
  const r={...freshBoat(),...structuredClone(source)}, player=structuredClone(account), {uid,admin,now}=ctx;
  if(!uid||!Number.isFinite(now))fail('ไม่มีบัญชีหรือเวลาเซิร์ฟเวอร์');
  const type=input.type;
  if(!r.names)r.names={};if(ctx.name&&r.team[uid])r.names[uid]=String(ctx.name).slice(0,40);
  const ledger=settleBoat(r,ctx,rng,player,type==='card'?input.box:null);
  const done=extra=>({race:r,player,ledger,...extra});
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
    return {race:fresh,player,ledger};
  }
  if(type==='reset'){if(!admin)fail('เฉพาะแอดมิน');const fresh=freshBoat();fresh.lastTeam=Object.keys(r.team).length?{...r.team}:{...(r.lastTeam||{})};fresh.names={...r.names};fresh.menus={...r.menus};return {race:fresh,player,ledger};}
  if(type==='claimCredit') {
    const credited=r.credits[uid]||0,claimed=r.claimedCredits[uid]||0,amount=credited-claimed;
    if(amount<=0)fail('ไม่มีรางวัลใหม่');player.merit=(player.merit||0)+amount;r.claimedCredits[uid]=credited;return done();
  }
  if(r.status!=='running')fail(r.status==='paused'?'พักการแข่งขันอยู่':'การแข่งขันไม่ได้เปิดอยู่');
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
    const menus=r.menus[boat]||[];if(menus.length&&!c.got.includes(menuKey)){c.got.push(menuKey);if(menus.every(m=>c.got.includes(m))){combo=BOAT_COMBO;c.got=[];c.n=(c.n||0)+1;log(r,'🍱 '+nameOf(r,uid)+' ส่งเสบียงครบทุกเมนู รับคอมโบ +5,000 กุศล');}}
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
export function publicBoat(r) {const out=structuredClone(r);for(const b of out.boxes)if(!b.opened&&b.picked===undefined)delete b.deck;return out;}
