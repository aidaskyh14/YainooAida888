import {CATALOG} from './catalog.js';
import {rainLogic,rainScore,RAIN_MS,RAIN_WARN,RAIN_LEVELS,RAIN_SETTLE,RAIN_LATE,RAIN_TEAM_MIN,RAIN_TEAM_POS,RAIN_TEAM_BACK,RAIN_ANCHOR_BACK,RAIN_PLUS_CAP} from './rain-engine.js';
/* กติกาเรือเป็นฟังก์ชันล้วน: ใช้กับ transaction บนคลาวด์ ไม่สร้างผู้เล่นจำลอง */
/* fix17: กล่องการ์ดทุก 30 (30…330) + เส้น 350 เดิม · พักส่ง 7 นาที · โล่กันเตะ 30 นาที · เตะย้อนศร · ว่ายกลับเรือ · นางเงือก 2 ตนแข่งส่งถาด · ฝนกุศล */
export const BOAT_LINES=[30,60,90,120,150,180,210,240,270,300,330,350];
export const BOAT_GOAL=400;
export const BOAT_COOLDOWN=7*60000;
export const BOAT_CARD_TIME=30000;        // การ์ดที่หยิบแล้ว ใช้เองอัตโนมัติเมื่อครบ 30 วิ (เวลาเซิร์ฟเวอร์)
export const BOAT_TARGET_TIME=10*60000;   // การ์ดที่ต้องเลือกเป้า ถ้าไม่เลือกใน 10 นาที ระบบสุ่มเป้าให้
export const BOAT_MERIT=100000;          // fix14: การ์ดกุศล ลูกเรือคนละ 100,000
export const BOAT_FIRE_MERIT=100000;     // fix14: ลูกเรือที่ "ถูกจ้างออก" (ดึงตัวเกินโควตา) ได้ 100,000
export const BOAT_REVIVE_MAX=3;          // fix17: นับเป็นจำนวนการ์ดชุบชีวิต (แผนมี 3 ใบ ใช้ได้ครบทุกใบ)
export const BOAT_FREEZE=60*60000,BOAT_CRAB=30*60000,BOAT_INK=5*60000;
export const BOAT_MENU_MAX=8;
export const BOAT_CARDS_EARLY=[['kick',30],['revive',20],['pull',10],['swap',8],['ink',8],['freeze',6],['crab',6],['supply',4],['cut',4],['stop',2],['merit',2]];
export const BOAT_CARDS_LATE=[['kick',12],['revive',8],['pull',8],['swap',8],['ink',8],['freeze',8],['crab',8],['supply',14],['cut',14],['stop',6],['merit',6]];
export const BOAT_CARDS=BOAT_CARDS_LATE;
/* การ์ดแต่ละเส้นตามลำดับลำที่มาถึง (ความลับ: หน้าเว็บไม่แสดงตารางนี้ และ publicBoat ไม่ส่งสำรับก่อนเปิด) */
export const BOAT_PLAN={30:['kickall','kickall','kick2','kick2'],60:['kickall','burn','pull'],90:['kickall','kick2','freeze','revive'],120:['kickall','kick2','crab','burn'],150:['kickall','kickall','ink'],
 180:['kick2','supply','revive'],210:['kick2','merit','cut'],240:['kick2','reviveall','crab'],270:['kick2','supply','ink'],300:['merit','stop'],330:['supply','cut'],350:['merit','cut1']};
export const boxSlots=line=>(BOAT_PLAN[line]||[]).length;
export const BOAT_GRACE=15000;          // ผู้เปิดส่งเป้าช้ากว่าเส้นตายได้ไม่เกิน 15 วิ (เผื่อเน็ตช้า) หลังจากนั้นเซิร์ฟเวอร์สุ่มเอง
export const BOAT_CARD_NAMES={burn:'เผาเรือ',cut1:'ตัดเสบียง',supply:'เติมเสบียง',cut:'ตัดเสบียง',merit:'กุศล',stop:'หยุดเรือ',kick:'เตะ',kickall:'เตะกวาดทุกทีม',kick2:'เตะเจาะทีม',pull:'ดึงตัว',swap:'สลับตัว',revive:'ชุบชีวิต',reviveall:'ชุบชีวิตทุกทีม',ink:'พ่นหมึก',freeze:'แช่แข็ง',crab:'ปูหนีบ',gift:'กล่องของขวัญ'};
const TARGET_CARDS=new Set(['cut','cut1','burn','kick','kickall','kick2','pull','swap','revive','ink','freeze','crab']);
export const BOAT_CARD_TABLES={
 50:[['kickall',65],['kick2',35]],
 100:[['pull',50],['kickall',20],['kick2',20],['cut',10]],
 150:[['pull',40],['swap',15],['ink',15],['freeze',15],['crab',15]],
 200:[['supply',25],['merit',25],['cut',20],['revive',10],['reviveall',5],['stop',5],['ink',5],['crab',5]],
 250:[['supply',25],['merit',25],['cut',20],['revive',10],['reviveall',5],['stop',5],['ink',5],['crab',5]],
 300:[['merit',35],['supply',30],['cut',20],['ink',5],['crab',5],['stop',5]]};
export const BOAT_GIFT=150000,BOAT_CUT=20;
export const BOAT_STAY_TIME=2*60000,BOAT_STAY_GAIN=50000,BOAT_STAY_COST={merit:10000,hat:1000,mb:1000,wool:200,pestle:2000,coin:100};
export const BOAT_COMBO=20000,BOAT_SEND=[1,3];
export const BOAT_STAY_MULT=[1,4];         // ค่าอยู่ต่อ ครั้งที่ 1/2 · fix17: ครั้งที่ 3 = ว่ายกลับเรือ
export const BOAT_BURN_TIME=10*60000,BOAT_BURN_NEED={merit:500000,hat:5000,mb:5000,wool:3000,pestle:10000,coin:1000},BOAT_BURN_BACK=30;
export const BOAT_CUT1=30,BOAT_FIRE350=1000000,BOAT_FIRE350_TIME=10*60000,BOAT_FIRE350_N=2;
const BURN_OLD={merit:500000,hat:5000,mb:5000,wool:3000};
export const burnNeed=st=>st?.need||BURN_OLD;
/* fix17 โล่ · เตะย้อนศร · ว่ายกลับ */
export const BOAT_SHIELD=30*60000,BOAT_BACKFIRE=500000;
export const BOAT_SWIM_TIME=10*60000,BOAT_SWIM_GAIN=1000000,BOAT_SWIM_FAIL=300000,BOAT_SWIM_GRACE=60000,BOAT_SWIM_LINE=350;
export const BOAT_SWIM_KINDS=['mg','cook','bird','box'];
export const BOAT_BIRD_ITEMS=['ostrich-egg','ostrich-feather','dodo-egg','dodo-feather','dodo-pebble'];
/* เมนูภารกิจคราฟ: เมนูในบ้าน/สวนหลังบ้านที่โอกาสสำเร็จ 40% ขึ้นไป (ไม่ใช่เมนูรอบดึก) */
export const BOAT_COOK_POOL=['food.ออมเล็ตโรซี่','gfood.r1','gfood.r2','gfood.r3','gfood.r4','gfood.r5','gfood.r6','gfood.b1','gfood.b2','gfood.b3','gfood.b4','gfood.b5','gfood.b6','gfood.b7','gfood.b8'];
/* fix17 นางเงือก 2 ตน */
export const BOAT_MM_SHARE=.4,BOAT_MM_NEED=2,BOAT_MM_GOAL=100,BOAT_MM_STEP=20,BOAT_MM_BONUS=300000,BOAT_MM_LOSE=500000,BOAT_MM_LATE=300000,BOAT_MM_CD=5*60000,BOAT_MM_SEND=[1,2,3];
export const BOAT_MM_POKE=5000,BOAT_MM_POKE_BOXES=10,BOAT_MM_POKE_CD=15*60000;
export const BOAT_MM_MENUS=['food-01','food-02','food-03','food-04','food-05','food-06','food-07','food-08','food-09','food-10','food-11','food-12','gfood-r1','gfood-r2','gfood-r3','gfood-r4','gfood-r5','gfood-r6','gfood-r7','gfood-r8','gfood-b1','gfood-b2','gfood-b3','gfood-b4','gfood-b5','gfood-b6','gfood-b7','gfood-b8'];
/* กล่องสุ่มจากการจิ้มนางเงือก (อยู่ในกระเป๋าหลัก · กล่องอัลปาก้าอยู่หน้าฟาร์มจึงไม่รวม) */
export const BOAT_POKE_BOXES=[['item','boxdog'],['box','cat'],['box','hamster'],['birdbox','ostrich'],['birdbox','dodo'],['box','plant'],['box','fruit']];
export const BOAT_FOOD_MERIT=[100,200];
export const BOAT_STAR_MERIT={1:200,2:300,3:500,4:700,5:1000,6:1000};
export const BOAT_ALPACA={'wool-yarn':[1,'ไหมพรม'],'wool-mittens':[2,'ถุงมือขนฟู'],'wool-beanie':[2,'หมวกบีนนี่'],'wool-bag':[2,'กระเป๋าพาสเทล'],'wool-scarf':[3,'ผ้าพันคอสายรุ้ง'],'wool-blanket':[3,'ผ้าห่มนุ่มฟู'],'wool-plush':[4,'ตุ๊กตาอัลปาก้า'],'wool-goldbag':[4,'กระเป๋าหรูขนทอง'],'wool-cloak':[5,'เสื้อคลุมราชวงศ์ทอง'],'wool-rug':[6,'พรมขนทองยัยหนู'],
 'meat-skewer':[1,'ลูกชิ้นปิ้ง'],'meat-sausage':[1,'ไส้กรอกสมุนไพร'],'meat-steak':[2,'สเต็ก'],'meat-burger':[2,'เบอร์เกอร์ชีส'],'meat-smoked':[2,'รมควัน'],'meat-massaman':[3,'มัสมั่น'],'meat-ghostsoup':[3,'ซุปหม้อวิญญาณ'],'meat-winestew':[4,'ตุ๋นไวน์แดง'],'meat-royal':[5,'ชุดเนื้อราชวงศ์'],'meat-buffet':[6,'บุฟเฟต์ทองคำ']};
export const stayCost=n=>{const m=BOAT_STAY_MULT[Math.max(1,n)-1]??BOAT_STAY_MULT[BOAT_STAY_MULT.length-1];return Object.fromEntries(Object.entries(BOAT_STAY_COST).map(([k,v])=>[k,v*m]));};
const isKick=c=>c==='kick'||c==='kickall'||c==='kick2';
export const needsTarget=card=>TARGET_CARDS.has(card);
const fail=m=>{throw new Error(m);};
export function freshBoat(){return {status:'setup',p:[0,0,0,0,0],team:{},kicked:{},claims:{},menus:{},boxes:[],winner:null,stopUntil:0,stopBy:null,sent:{},cd:{},credits:{},claimedCredits:{},log:[],names:{},lastTeam:{},pausedAt:null,startSize:{},fired:{},frozen:{},revives:0,offers:{},stays:{},combo:{},burns:{},burned:{},dismiss:{},mm:null,mmEx:{},
  shield:{},swim:{},swam:{},noSwim:{},mmBan:{},rain:null,rainRes:{}};}
export const members=(r,b)=>Object.keys(r.team).filter(u=>r.team[u]===b&&!r.kicked[u]);
/* คนที่กำลังตัดสินใจข้อเสนออยู่ต่อ ยังอยู่ในทีม แต่ถูกเลือกเตะ/ดึง/สลับซ้ำไม่ได้ */
const offered=(r,u)=>!!r.offers?.[u];
const open=(r,b)=>members(r,b).filter(u=>!offered(r,u));
const shielded=(r,u,now)=>(r.shield?.[u]||0)>now;
const kickable=(r,b,now)=>open(r,b).filter(u=>!shielded(r,u,now));
const log=(r,m)=>{r.log.unshift(m);r.log=r.log.slice(0,40);};
const nameOf=(r,u)=>r.names?.[u]||'ลูกเรือ';
const pickOne=(list,rng)=>list[Math.min(list.length-1,Math.floor(rng()*list.length))];
const floorAdd=(m0,d)=>{m0=m0||0;return d<0?Math.max(Math.min(m0,0),m0+d):m0+d;};
export function seededRng(seed) {
  let h=2166136261>>>0;for(const ch of String(seed)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0;}
  return ()=>{h=(h+0x6D2B79F5)>>>0;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
const boxSeed=(r,box)=>box.id+'|'+(box.pickedAt||0)+'|'+(r.round||0);
/* คนที่ชุบชีวิตได้: หลุดแล้ว ไม่ใช่นางเงือก (จองจำ) และไม่ได้กำลังว่ายกลับ */
const revivable=r=>Object.keys(r.kicked||{}).filter(u=>r.kicked[u]&&r.team[u]&&!r.mmBan?.[u]&&!r.swim?.[u]&&u!==r.mm?.uid);
export function rollCard(rng,line,canRevive){const table=(BOAT_CARD_TABLES[line]||BOAT_CARD_TABLES[300]).filter(([k])=>(k!=='revive'&&k!=='reviveall')||canRevive),total=table.reduce((a,[,w])=>a+w,0);let x=rng()*total;for(const [k,w]of table){x-=w;if(x<0)return k;}return table[table.length-1][0];}
const boatOk=b=>Number.isInteger(b)&&b>=1&&b<=5;
/* fix17: เครื่องดื่มป่า 4 ชนิด ตั้งเป็นเสบียงเรือได้ (bag.drink.*) */
const SUPPLY_GROUPS=['food','gfood','drink'];
const foodKeys=new Set(CATALOG.filter(c=>SUPPLY_GROUPS.some(g=>c.p.startsWith(g+'.'))).map(c=>c.k));
const catOf=k=>CATALOG.find(c=>c.k===k);
/* outbox: ไปรษณีย์ / มุมมองส่วนตัว / ledger ที่คลาวด์ต้องเขียนหลังธุรกรรม (ดึงออกก่อนบันทึก) */
const outbox=(r,x)=>{(r.outbox ||= []).push(x);};
const ledgerOut=(r,uid,merit,title,msg,id)=>outbox(r,{ledger:{uid,merit,title,msg,id:id||('boat-x-'+(r.round||0)+'-'+uid+'-'+(r._now||0)+'-'+Math.abs(merit)+'-'+(r.outbox?.length||0))}});
export function boatProgress(r,b,n,rng) {
  if(r.status!=='running')fail('การแข่งขันไม่ได้เปิดอยู่');
  if(!boatOk(b))fail('เรือไม่ถูกต้อง');
  const before=r.p[b-1];r.p[b-1]=Math.max(0,Math.min(BOAT_GOAL,before+n));
  for(const line of BOAT_LINES)if(before<line&&r.p[b-1]>=line) {
    const arrived=r.claims[line] ||= [];
    // เส้นที่เคยเปิดกล่องให้ลำนี้แล้ว ถอยแล้วกลับมาใหม่ไม่ได้กล่องซ้ำ
    if(arrived.length<boxSlots(line)&&!arrived.includes(b)) {
      const first=!arrived.length,card=BOAT_PLAN[line][arrived.length];arrived.push(b);r.boxes.push({id:line+'-'+b,boat:b,line,opened:false,deck:Array(5).fill(card)});
      if(line===350){r.dismiss ||= {};r.dismiss[b]={at:r._now||0,until:(r._now||0)+BOAT_FIRE350_TIME,left:BOAT_FIRE350_N};log(r,'🧜‍♀️ เรือ '+b+' ถึงเส้น 350');mmLate(r,r._now||0);}
      if(line===300&&first){r.boxes.push({id:'300-'+b+'-gift',boat:b,line,opened:false,gift:true,deck:Array(5).fill('gift')});log(r,'🎁 เรือ '+b+' ถึงเส้น 300 ก่อน ได้กล่องของขวัญ!');}
    }
  }
  if(r.p[b-1]===BOAT_GOAL){r.status='finished';r.winner=b;log(r,'🏁 เรือ '+b+' ถึงเส้น 400 ชนะ!');finishExtras(r);}
}
const rivalsOf=boat=>[1,2,3,4,5].filter(b=>b!==boat);
const capOf=(r,b)=>(r.startSize?.[b]??0)+1;
/* ---------- การเตะ: ข้อเสนออยู่ต่อ (ครั้งที่ 1/2) · ว่ายกลับ (ครั้งที่ 3) · หลุดถาวร ---------- */
const swimOk=(r,u)=>!r.swam?.[u]&&!r.noSwim?.[u]&&!r.mmBan?.[u]&&r.team[u]&&(r.p[r.team[u]-1]||0)<BOAT_SWIM_LINE;
function kickOne(r,id,boat,boxId,now){
  if(r.swam?.[id]==='ok'){r.kicked[id]=true;r.noSwim[id]=true;log(r,'💦 '+nameOf(r,id)+' โดนเตะหลังว่ายกลับ หลุดถาวร');return;}
  const n=(r.stays[id]||0)+1;
  if(n<=BOAT_STAY_MULT.length){r.offers[id]={at:now,until:now+BOAT_STAY_TIME,n,by:boat,box:boxId};return;}
  if(swimOk(r,id)){r.offers[id]={at:now,until:now+BOAT_STAY_TIME,n,by:boat,box:boxId,swim:true};return;}
  r.kicked[id]=true;r.noSwim[id]=true;log(r,'💦 '+nameOf(r,id)+' ถูกเตะออกจากเรือ '+r.team[id]);
}
function useCard(r,box,choice,ctx,rng,player,auto) {
  const boat=box.boat,card=box.card,{uid,now}=ctx,tag=auto?' (อัตโนมัติ)':'',pick=seededRng(boxSeed(r,box));
  const rivals=rivalsOf(boat),staffed=rivals.filter(b=>members(r,b).length);
  r.startSize ||= {};r.fired ||= {};r.frozen ||= {};r.revives ||= 0;r.offers ||= {};r.stays ||= {};r.shield ||= {};r.noSwim ||= {};
  const intOr=v=>v===undefined||v===null?null:v;
  let target=intOr(choice.target),victims=[],cutBoats=[],backfire=null;
  const ledger=[];
  // ---- ตรวจและสุ่มเป้า (ยังไม่เปลี่ยนสถานะ จนกว่าจะผ่านการตรวจทั้งหมด) ----
  if(card==='ink'||card==='crab') {
    if(target===null)target=pickOne(staffed.length?staffed:rivals,pick);
    if(!Number.isInteger(target)||!rivals.includes(target))fail('เลือกเรือคู่แข่ง');
  }
  if(card==='cut1'||card==='burn') {
    const ok=b=>card!=='burn'||(members(r,b).length&&!r.burns?.[b]),pool=(staffed.length?staffed:rivals).filter(ok);
    if(target===null)target=pool.length?[...pool].sort((a,b)=>r.p[b-1]-r.p[a-1]||a-b)[0]:null;
    if(target!==null&&(!Number.isInteger(target)||!rivals.includes(target)||!ok(target)))fail(card==='burn'&&r.burns?.[target]?'เรือลำนี้กำลังไฟไหม้อยู่แล้ว':'เลือกเรือคู่แข่ง');
  }
  if(card==='cut') {
    const want=Math.min(2,rivals.length);let list=Array.isArray(choice.boats)?choice.boats:target!==null?[target]:[];
    if(list.length>2||new Set(list).size!==list.length||list.some(b=>!Number.isInteger(b)||!rivals.includes(b)))fail('เลือกเรือคู่แข่ง 2 ลำ');
    list=[...list];const pool=(staffed.length>=want?staffed:rivals).filter(b=>!list.includes(b));
    while(list.length<want&&pool.length)list.push(pool.splice(Math.min(pool.length-1,Math.floor(pick()*pool.length)),1)[0]);
    cutBoats=list;target=list[0]??null;
  }
  if(isKick(card)) {
    const mode=card==='kickall'?'all':card==='kick2'?'one':choice.mode==='one'?'one':'all',targets=choice.targets??(choice.target!==undefined&&choice.target!==null&&typeof choice.target==='string'?[choice.target]:[]);
    if(!Array.isArray(targets))fail('เลือกสมาชิกคู่แข่ง');
    const can=b=>kickable(r,b,now),live=rivals.filter(b=>can(b).length),shieldBlocked=rivals.some(b=>open(r,b).some(u=>shielded(r,u,now)));
    if(!live.length&&shieldBlocked){
      // fix17 เตะย้อนศร: คู่แข่งมีโล่ทุกคน → เตะเพื่อนร่วมทีม 1 คน (ผู้เปิดเลือก) → ไม่มี = ผู้เปิดเอง → ไม่ได้ = ผู้เปิด −500,000
      const opener=box.pickedBy||uid,own=can(boat).filter(u=>u!==opener),want=targets[0];
      if(targets.length>1)fail('คู่แข่งมีโล่ทั้งหมด เลือกเพื่อนร่วมทีมได้ 1 คน');
      let v=null;
      if(own.length){
        if(typeof want==='string'){if(!own.includes(want))fail('คู่แข่งมีโล่ทั้งหมด ต้องเลือกเพื่อนร่วมทีม 1 คน');v=want;}
        else v=pickOne(own,pick);
      } else if(can(boat).includes(opener))v=opener;
      victims=v?[v]:[];backfire=v?{v,self:v===opener}:{pen:BOAT_BACKFIRE,uid:opener};
    } else if(mode==='one') {
      if(targets.length>2)fail('เตะทีมเดียวได้ไม่เกิน 2 คน');
      if(targets.length){
        const b0=r.team[targets[0]];
        for(const id of targets){const b=r.team[id];if(!b||b===boat||r.kicked[id]||offered(r,id)||b!==b0)fail('เลือกคนจากทีมเดียวกัน ไม่เกิน 2 คน');if(shielded(r,id,now))fail('🛡️ '+nameOf(r,id)+' มีโล่กันเตะอยู่');}
        if(new Set(targets).size!==targets.length)fail('เลือกคนซ้ำ');
        victims=[...targets];
      } else {const b=pickOne(live,pick),pool=[...can(b)];while(victims.length<2&&pool.length)victims.push(pool.splice(Math.min(pool.length-1,Math.floor(pick()*pool.length)),1)[0]);}
    } else {
      const seen=new Set();for(const id of targets){const b=r.team[id];if(!b||b===boat||r.kicked[id]||offered(r,id)||seen.has(b))fail('เลือกคู่แข่งทีมละ 1 คน');if(shielded(r,id,now))fail('🛡️ '+nameOf(r,id)+' มีโล่กันเตะอยู่');seen.add(b);victims.push(id);}
      for(const b of live)if(!seen.has(b))victims.push(pickOne(can(b),pick));
    }
  }
  let pulled=null,fired=null,swapA=null,swapB=null,revived=null,revivedTo=null,frozen=null,revivedAll=[];
  if(card==='pull') {
    const pool=rivals.flatMap(b=>open(r,b));pulled=typeof choice.uid==='string'?choice.uid:(pool.length?pickOne(pool,pick):null);
    if(pulled!==null&&!pool.includes(pulled))fail('เลือกคู่แข่ง 1 คน');
    if(pulled!==null&&members(r,boat).length+1>capOf(r,boat)&&!open(r,boat).length)pulled=null;/* ทีมเต็มและไม่มีใครให้ออก (ทุกคนรอตัดสินใจ) → ดึงไม่ได้ ข้ามไป */
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
    const pool=revivable(r);revived=typeof choice.uid==='string'?choice.uid:(pool.length?pickOne(pool,pick):null);
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
    for(const id of victims)kickOne(r,id,boat,box.id,now);
    box.victims=victims;box.offered=true;
    if(backfire){box.backfire=backfire.pen?{pen:backfire.pen}:{v:backfire.v,self:!!backfire.self};
      if(backfire.pen){const id='boat-backfire-'+box.id+'-'+(box.pickedAt||now);
        if(backfire.uid===uid){player.merit=floorAdd(player.merit,-backfire.pen);ledger.push({uid,id,boat,merit:-backfire.pen,self:true,title:'🦶 เตะย้อนศร'});}
        else ledger.push({uid:backfire.uid,id,boat,merit:-backfire.pen,title:'🦶 เตะย้อนศร',msg:'คู่แข่งมีโล่ทั้งหมด และไม่มีใครในเรือให้เตะ'});
        log(r,'🛡️ คู่แข่งเรือ '+boat+' มีโล่ทั้งหมด! ไม่มีใครให้เตะ ผู้เปิดการ์ดเสีย 500,000 กุศล'+tag);}
      else log(r,'🛡️ คู่แข่งมีโล่ทั้งหมด! เรือ '+boat+' เตะย้อนศร '+nameOf(r,backfire.v)+tag);}
    else log(r,victims.length?'เรือ '+boat+' ใช้การ์ดเตะ '+victims.map(id=>nameOf(r,id)).join(', ')+(victims.some(id=>r.offers[id])?' (รอตัดสินใจ 2 นาที)':'')+tag:'เรือ '+boat+' ใช้การ์ดเตะ แต่ไม่มีคู่แข่งให้เตะ'+tag);
  }
  if(card==='pull') {
    if(pulled===null)log(r,'เรือ '+boat+' ใช้การ์ดดึงตัว แต่ไม่มีคู่แข่งให้ดึง'+tag);
    else {
      box.pulled=pulled;box.from=r.team[pulled];r.team[pulled]=boat;
      log(r,'เรือ '+boat+' ดึง '+nameOf(r,pulled)+' มาจากเรือ '+box.from+tag);
      if(fired!==null){
        r.kicked[fired]=true;r.fired[fired]=true;r.noSwim[fired]=true;box.fired=fired;
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
  const bringBack=u=>{delete r.kicked[u];delete r.fired[u];};
  if((card==='revive'||card==='reviveall')&&(r.revives||0)>=BOAT_REVIVE_MAX){revived=null;}
  if(card==='revive') {
    if(revived===null)log(r,'เรือ '+boat+' ใช้การ์ดชุบชีวิต แต่ไม่มีใครให้ชุบ'+tag);
    else{revivedTo=r.team[revived];if(!members(r,revivedTo).length)revivedTo=[1,2,3,4,5].filter(b=>members(r,b).length).sort((a,b)=>members(r,a).length-members(r,b).length||a-b)[0]||revivedTo;r.team[revived]=revivedTo;bringBack(revived);r.revives++;box.revived=revived;box.from=revivedTo;box.target=revivedTo;box.full=false;
      log(r,'เรือ '+boat+' ชุบชีวิต '+nameOf(r,revived)+' กลับเรือ '+revivedTo+tag);}
  }
  if(card==='reviveall') {
    // ทุกทีม (ยกเว้นทีมตัวเอง) ทีมละ 1 คนที่โดนเตะ กลับเรือทีมของตัวเอง
    if((r.revives||0)<BOAT_REVIVE_MAX)for(const b of rivals){const pool=revivable(r).filter(u=>r.team[u]===b);if(!pool.length)continue;const u=pickOne(pool,pick);bringBack(u);revivedAll.push(u);}
    if(revivedAll.length)r.revives++;
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
/* ข้อเสนอ: ตัดสินด้วยบัญชีของคนโดนเตะเท่านั้น (ต้องใช้ของในกระเป๋าเขา)
   อยู่ต่อ: accept=true จ่ายแล้วอยู่ต่อ (+โล่ 30 นาที) · false ออกจากเรือ · null = หมดเวลา (ครั้งแรกมีของครบอยู่ต่อ ไม่ครบออก)
   ว่ายกลับ (ครั้งที่ 3): true เริ่มภารกิจ 10 นาที · false/หมดเวลา = ออกจากเรือ (ไม่หักอะไร) */
const alpacaWool=p=>Number(p.sub?.alpaca?.bag?.wool)||0;
const pestleOf=p=>Number(p.bag?.item?.pestle)||0;
export const stayHave=(player,coins)=>({merit:player.merit||0,hat:Number(player.bag?.item?.hat)||0,mb:Number(player.bag?.item?.musicbox)||0,wool:alpacaWool(player),pestle:pestleOf(player),coin:Number(coins)||0});
export function stayAfford(player,n,coins=0){const c=stayCost(n),h=stayHave(player,coins);return Object.keys(c).every(k=>h[k]>=c[k]);}
export const birdSum=p=>BOAT_BIRD_ITEMS.reduce((a,k)=>a+(Number(p?.bag?.bird?.[k])||0),0);
function startSwim(r,uid,player,ctx,rng){
  const now=ctx.now,kind=pickOne(BOAT_SWIM_KINDS,rng),R=(a,b)=>a+Math.floor(rng()*(b-a+1));
  const sq={round:r.round||0,kind,need:0,got:0,at:now,until:now+BOAT_SWIM_TIME};
  if(kind==='mg')sq.need=200000;
  if(kind==='cook'){sq.need=R(20,50);sq.key=pickOne(BOAT_COOK_POOL,rng);}
  if(kind==='bird'){sq.need=R(40,60);sq.base=birdSum(player);}
  if(kind==='box')sq.need=R(300,500);
  r.kicked[uid]=true;r.swim ||= {};r.swim[uid]={at:now,until:sq.until,kind,need:sq.need,...(sq.key?{key:sq.key}:{})};
  if(ctx.x17)ctx.x17.sq=sq;
  log(r,'🏊 '+nameOf(r,uid)+' กระโดดน้ำ ว่ายกลับเรือ '+r.team[uid]+' (10 นาที)');
  return sq;
}
function resolveOffer(r,uid,player,accept,now,ctx,rng){
  const o=r.offers?.[uid];if(!o)return null;delete r.offers[uid];r.shield ||= {};r.noSwim ||= {};
  if(o.swim){
    if(accept===true&&swimOk(r,uid)){const sq=startSwim(r,uid,player,ctx||{now},rng||Math.random);return {stay:false,swim:true,n:o.n,kind:sq.kind,need:sq.need,key:sq.key||null,until:sq.until};}
    r.kicked[uid]=true;r.noSwim[uid]=true;log(r,'💦 '+nameOf(r,uid)+(accept===null?' หมดเวลาตัดสินใจ':' ไม่ว่ายกลับ')+' ออกจากเรือ '+r.team[uid]);return {stay:false,swim:false,n:o.n};
  }
  const stay=accept===true||(accept===null&&o.n===1&&stayAfford(player,o.n,r._coins));
  if(stay){
    if(!stayAfford(player,o.n,r._coins)){r.offers[uid]=o;fail('ของไม่พอจ่ายข้อเสนอ');}
    const c=stayCost(o.n);player.merit-=c.merit;player.bag.item.hat-=c.hat;player.bag.item.musicbox-=c.mb;player.sub.alpaca.bag.wool-=c.wool;if(c.pestle)player.bag.item.pestle=pestleOf(player)-c.pestle;if(c.coin)r._coins-=c.coin;player.merit+=BOAT_STAY_GAIN;
    r.stays[uid]=o.n;r.shield[uid]=now+BOAT_SHIELD;log(r,'💪 '+nameOf(r,uid)+' เลือกอยู่ต่อบนเรือ '+r.team[uid]+(accept===null?' (อัตโนมัติ)':'')+' 🛡️');return {stay:true,n:o.n,cost:c,gain:BOAT_STAY_GAIN,shield:now+BOAT_SHIELD};
  }
  r.kicked[uid]=true;r.noSwim[uid]=true;log(r,'💦 '+nameOf(r,uid)+(accept===null?' หมดเวลาตัดสินใจ':' ยอมรับ')+' ออกจากเรือ '+r.team[uid]);return {stay:false,n:o.n};
}
export const boxDeadline=(box,now)=>box.deadline??((box.pickedAt||now)+(needsTarget(box.card)?BOAT_TARGET_TIME:BOAT_CARD_TIME));
/* เส้นตายฝั่งเซิร์ฟเวอร์: การ์ดไม่ต้องเลือกเป้าใช้เองหลัง 30 วิ / การ์ดเลือกเป้าสุ่มเป้าหลัง 10 นาที */
export function settleBoat(r,ctx,rng,player,skipBox) {
  const ledger=[];
  if(r.status!=='running')return ledger;
  const due=r.boxes.filter(box=>!box.opened&&box.picked!==undefined).map(box=>({box,deadline:boxDeadline(box,ctx.now)}))
    .filter(x=>x.deadline<=ctx.now&&!(x.box.id===skipBox&&ctx.now<x.deadline+BOAT_GRACE)).sort((a,b)=>a.deadline-b.deadline||(a.box.id<b.box.id?-1:1));
  for(const {box}of due) {
    if(r.status!=='running')break;
    const snap=JSON.stringify(r),psnap=JSON.stringify(player);
    try{ledger.push(...useCard(r,box,{},ctx,rng,player,true));}
    catch(e){if(typeof console!=='undefined')console.error('boat auto card skipped',box.id,e?.message);for(const k of Object.keys(player))delete player[k];Object.assign(player,JSON.parse(psnap));/* การ์ดอัตโนมัติใช้ไม่ได้ (ไม่มีเป้า) → ข้ามกล่องนี้ ไม่ให้ทั้งการแข่งค้าง */
      const back=JSON.parse(snap);for(const k of Object.keys(r))delete r[k];Object.assign(r,back);const b=r.boxes.find(x=>x.id===box.id);if(b){b.opened=true;b.usedAt=ctx.now;b.void=true;delete b.deadline;}log(r,'🎴 การ์ดที่เส้น '+box.line+' ไม่มีเป้าให้ใช้ ข้ามไป');}
  }
  settleExtras(r,ctx,player,ledger);
  // ข้อเสนอที่หมดเวลา: ตัดสินได้เฉพาะตอนเจ้าตัวเรียก (ต้องใช้กระเป๋าของเขา)
  const mine=r.offers?.[ctx.uid];if(mine&&mine.until+BOAT_GRACE<=ctx.now)r.lastStay={uid:ctx.uid,...resolveOffer(r,ctx.uid,player,null,ctx.now,ctx,rng),at:ctx.now};
  return ledger;
}

/* ---------- เผาเรือ ---------- */
const BURN_ITEM={hat:'hat',mb:'musicbox',wool:'wool',pestle:'pestle'};
function burnRefund(r,b,why){const st=r.burns?.[b];if(!st)return;
  for(const [u,c] of Object.entries(st.paid||{})){const items={};for(const k of ['hat','mb','wool','pestle'])if(c[k]>0)items[BURN_ITEM[k]]=c[k];
    if((c.merit||0)>0||(c.coin||0)>0||Object.keys(items).length)outbox(r,{mail:{uid:u,key:'boat-burn-'+(r.round||0)+'-'+b+'-'+st.at,title:'🔥 คืนของที่ลงขันกอบกู้เรือ '+b,msg:why,icon:'🔥',kusal:c.merit||0,coins:c.coin||0,items}});}
  delete r.burns[b];}
const dLeft=d=>Number.isInteger(d?.left)?d.left:1;
/* ---------- fix17 นางเงือก 2 ตน ----------
   r.mm={since,menus:[k1,k2],a:[{uid,t,cd,earn,at},{…}],ms:{20:i,…},win:null|i,lose:null|i,late:false,done:false}
   · แต่งตั้งพร้อมกัน 2 ตน (คนหลุดจริงอย่างน้อย 2 คน) ครั้งเดียวต่อการแข่ง ไม่มีตัวแทน · ถูกจองจำ (ชุบ/ดึง/ว่ายกลับไม่ได้)
   · ส่งถาดเมนูเดียวกัน 1–3 ถาด พัก 5 นาที · ทุก 20 ถาด ถึงก่อน +300,000 อีกตน −300,000
   · ครบ 100 ก่อน = นางเงือกตัวจริง (มีอำนาจจ้างออกเส้น 350) · อีกตนสลาย −500,000
   · เรือถึง 350 ก่อนมีใครครบ 100 → ทั้งคู่ −300,000 · ถาดมากกว่าชนะ (เท่ากัน = ถึงจำนวนนั้นก่อน) */
const mmOn=r=>!!(r.mm&&Array.isArray(r.mm.a)&&!r.mm.done);
export const mmIndex=(r,uid)=>mmOn(r)?r.mm.a.findIndex(x=>x.uid===uid):-1;
const mmLive=(r,i)=>mmOn(r)&&i>=0&&r.mm.lose!==i;
export const mmReal=r=>mmOn(r)&&r.mm.win!==null?r.mm.a[r.mm.win].uid:null;
function mmView(r,i){const mm=r.mm;if(!mm||mm.done||mm.lose===i)return {round:r.round||0,active:false};
  const real=mm.win===i;
  return {round:r.round||0,active:true,since:mm.since,real,menus:[...mm.menus],t:mm.a[i].t,earn:mm.a[i].earn,
    dismiss:real?Object.entries(r.dismiss||{}).map(([b,d])=>({boat:+b,until:d.until,left:dLeft(d),crew:members(r,+b).map(u=>({u,n:nameOf(r,u)}))})):[]};}// Firestore: ห้าม array ซ้อน array
function emitViews(r){if(!r.mm||!Array.isArray(r.mm.a))return;if(!r.mmSig||typeof r.mmSig!=='object')r.mmSig={};
  r.mm.a.forEach((x,i)=>{const v=mmView(r,i),sig=JSON.stringify(v);if(r.mmSig[x.uid]===sig)return;r.mmSig[x.uid]=sig;outbox(r,{view:{uid:x.uid,data:v}});});}
const mmNotice=(r,uid,k,extra)=>outbox(r,{view:{uid,data:{round:r.round||0,notice:{k,at:r._now||0,...(extra||{})}}}});
function mmPay(r,i,why){const x=r.mm.a[i];if(x.paid)return;x.paid=true;
  if(x.earn>0)outbox(r,{mail:{uid:x.uid,key:'boat-mm-pay-'+(r.round||0)+'-'+i,title:'🧜‍♀️ ค่าประกอบวิชาชีพนางเงือก',msg:why,icon:'🧜‍♀️',kusal:x.earn,items:{}}});}
function ensureMermaid(r,now){
  if(r.status!=='running'||r.mm)return;
  if(Object.keys(r.dismiss||{}).length||r.p.some(p=>p>=350))return;// ถึง 350 แล้ว ไม่แต่งตั้ง (ระบบจ้างออกเอง)
  const pool=Object.keys(r.kicked||{}).filter(u=>r.kicked[u]&&r.team[u]&&!r.offers?.[u]&&!r.swim?.[u]&&!r.mmEx?.[u]&&!r.burned?.[u]&&!r.fired?.[u]).sort();
  if(pool.length<BOAT_MM_NEED)return;
  const rng=seededRng((r.round||0)+'|mm2|'+pool.join(',')),a=[...pool],two=[];
  while(two.length<2)two.push(a.splice(Math.min(a.length-1,Math.floor(rng()*a.length)),1)[0]);
  const menus=[...BOAT_MM_MENUS],picked=[];while(picked.length<2)picked.push(menus.splice(Math.min(menus.length-1,Math.floor(rng()*menus.length)),1)[0]);
  r.mm={since:now,menus:picked,a:two.map(uid=>({uid,t:0,cd:0,earn:0,at:0})),ms:{},win:null,lose:null,late:false,done:false};
  r.mmBan ||= {};for(const u of two)r.mmBan[u]=true;r.mmSig={};
  log(r,'🧜‍♀️🧜‍♀️ นางเงือก 2 ตนปรากฏตัว! '+two.map(u=>nameOf(r,u)).join(' กับ ')+' แข่งส่งถาดให้ครบ 100');
  for(const u of two)mmNotice(r,u,'appointed',{menus:picked});
}
function mmResolve(r,win,why){const mm=r.mm,lose=1-win;mm.win=win;mm.lose=lose;mmPay(r,lose,why);
  outbox(r,{mail:{uid:mm.a[win].uid,key:'boat-mm-mk-'+(r.round||0),title:'👑 รางวัลนางเงือกตัวจริง',msg:'ได้กล่องสุ่มมหากุศล 10 กล่อง',icon:'📦',kusal:0,items:{'box-mahakusal':10}}});/* fix17 📦 */
  mmNotice(r,mm.a[win].uid,'real');mmNotice(r,mm.a[lose].uid,'lost',{late:!!mm.late});}
function mmLate(r,now){const mm=r.mm;if(!mmOn(r)||mm.win!==null)return;mm.late=true;
  for(const x of mm.a)ledgerOut(r,x.uid,-BOAT_MM_LATE,'🧜‍♀️ ส่งถาดไม่ครบ 100','เรือถึงเส้น 350 ก่อนนางเงือกส่งถาดครบ 100','boat-mm-late-'+(r.round||0)+'-'+x.uid);
  const [A,B]=mm.a,win=A.t!==B.t?(A.t>B.t?0:1):((A.at||Infinity)<=(B.at||Infinity)?0:1);
  log(r,'⏰ เรือถึงเส้น 350 ก่อนนางเงือกส่งครบ 100 · ทั้งคู่ −300,000 · 👑 '+nameOf(r,mm.a[win].uid)+' ถาดมากกว่า เป็นนางเงือกตัวจริง');
  mmResolve(r,win,'การแข่งส่งถาดจบที่เส้น 350 ขอบคุณที่ทำหน้าที่');}
function fireOut(r,b,u,ctx,player,ledger,auto){
  r.kicked[u]=true;r.fired ||= {};r.fired[u]=true;r.noSwim ||= {};r.noSwim[u]=true;delete r.offers?.[u];
  const d=r.dismiss[b];if(d){d.left=dLeft(d)-1;if(d.left<=0||members(r,b).length<2)delete r.dismiss[b];}
  const id='boat-mm-'+(r.round||0)+'-'+b+'-'+u;
  if(u===ctx.uid){player.merit=(player.merit||0)+BOAT_FIRE350;ledger.push({uid:u,id,boat:b,merit:BOAT_FIRE350,self:true,title:'🧜‍♀️ นางเงือกจ้างออก'});}
  else ledger.push({uid:u,id,boat:b,merit:BOAT_FIRE350,title:'🧜‍♀️ นางเงือกจ้างออก',msg:'ได้ค่าจ้างออกจากเรือ '+b+' 1,000,000 กุศล'});
  log(r,'🧜‍♀️ '+(auto?'ระบบ':'นางเงือก')+'จ้าง '+nameOf(r,u)+' ออกจากเรือ '+b+' ได้ 1,000,000 กุศล');}
/* ---------- ⛈️ ฝนกุศล: ตัดสินทีม (ต้องมีลูกทีมอย่างน้อย 3 คนที่กดฟองบวก ≥3 ลูก ไม่งั้นเรือ −10) ---------- */
function rainSettle(r,now){const rain=r.rain;if(!rain||rain.done||now<rain.end+RAIN_SETTLE)return;rain.done=true;
  const res=r.rainRes||{},back=[];
  for(const b of [1,2,3,4,5]){const team=Object.keys(r.team).filter(u=>r.team[u]===b);if(!team.length)continue;
    const n=team.filter(u=>(res[u]?.p||0)>=RAIN_TEAM_POS).length;if(n<RAIN_TEAM_MIN)back.push(b);}
  rain.back=back;for(const b of back)boatProgress(r,b,-RAIN_TEAM_BACK,()=>0);
  log(r,back.length?'⛈️ ฝนกุศลจบ · เรือ '+back.join(', ')+' ช่วยกันไม่ถึง 3 คน ถอย −10':'⛈️ ฝนกุศลจบ · ทุกเรือช่วยกันครบ');}
/* งานตามเวลา (ผลเหมือนกันไม่ว่าใครเรียก): เรือไหม้หมดเวลา · ว่ายกลับไม่ทัน · แต่งตั้งนางเงือก · จ้างออกเส้น 350 · ฝน */
function settleExtras(r,ctx,player,ledger){
  if(r.status!=='running')return;const now=ctx.now;
  for(const b of Object.keys(r.burns||{}).map(Number).sort()){const st=r.burns[b];if(now<st.until)continue;
    const crew=members(r,b);for(const u of crew){r.kicked[u]=true;r.burned ||= {};r.burned[u]=true;r.noSwim ||= {};r.noSwim[u]=true;delete r.offers?.[u];}
    burnRefund(r,b,'เรือจม ระบบคืนของที่ลงขันให้ครบ');log(r,'💀 เรือ '+b+' กอบกู้ไม่ทัน จมแล้ว ลูกเรือหลุดทั้งลำ');r.lastBurn={boat:b,ok:false,at:now};}
  for(const u of Object.keys(r.swim||{}).sort()){const s=r.swim[u];if(now<=s.until+BOAT_SWIM_GRACE)continue;
    if(u===ctx.uid&&ctx.x17?.sq&&ctx.x17.sq.round===(r.round||0)&&Number(ctx.x17.sq.doneAt)>0&&ctx.x17.sq.doneAt<=s.until)continue;/* ทำครบทันเวลาแล้ว รอส่ง swimDone */
    delete r.swim[u];r.swam ||= {};r.swam[u]='fail';r.noSwim ||= {};r.noSwim[u]=true;
    const id='boat-swim-'+(r.round||0)+'-'+u;
    if(u===ctx.uid){player.merit=floorAdd(player.merit,-BOAT_SWIM_FAIL);ledger.push({uid:u,id,merit:-BOAT_SWIM_FAIL,self:true,title:'🏊 ว่ายกลับไม่ทัน'});}
    else ledger.push({uid:u,id,merit:-BOAT_SWIM_FAIL,title:'🏊 ว่ายกลับไม่ทัน',msg:'ภารกิจว่ายกลับเรือไม่สำเร็จใน 10 นาที'});
    log(r,'🌊 '+nameOf(r,u)+' ว่ายกลับไม่ทัน หลุดถาวร');}
  ensureMermaid(r,now);
  const real=mmReal(r);
  for(const b of Object.keys(r.dismiss||{}).map(Number).sort()){const d=r.dismiss[b];if(real&&now<d.until+BOAT_GRACE)continue;
    for(let k=0;r.dismiss[b]&&k<BOAT_FIRE350_N;k++){const crew=members(r,b).sort();if(crew.length<2){delete r.dismiss[b];break;}
      fireOut(r,b,pickOne(crew,seededRng((r.round||0)+'|fire|'+b+'|'+k)),ctx,player,ledger,true);}}
  rainSettle(r,now);
}
function finishExtras(r){
  for(const b of Object.keys(r.burns||{}))burnRefund(r,+b,'การแข่งจบระหว่างเรือไหม้ ระบบคืนของที่ลงขันให้ครบ');
  r.dismiss={};
  for(const u of Object.keys(r.swim||{})){delete r.swim[u];log(r,'🏊 การแข่งจบระหว่าง '+nameOf(r,u)+' ว่ายกลับ (ไม่หักอะไร)');}
  if(r.rain&&!r.rain.done)r.rain.done=true;
  if(mmOn(r)){const mm=r.mm;mm.done=true;r.mmSig={};
    mm.a.forEach((x,i)=>{if(mm.lose===i)return;mmPay(r,i,'ขอบคุณที่ทำหน้าที่นางเงือกจนจบการแข่ง');outbox(r,{view:{uid:x.uid,data:{round:r.round||0,active:false,notice:{k:'paid',earn:x.earn,at:r._now||0}}}});});
    for(const x of mm.a)if(mm.lose===mm.a.indexOf(x))outbox(r,{view:{uid:x.uid,data:{round:r.round||0,active:false}}});}
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
  for(const u of Object.keys(r.shield||{}))if(r.shield[u]>at)r.shield[u]+=d;
  for(const x of Object.values(r.swim||{}))if(x.until>at)x.until+=d;
  if(mmOn(r))for(const x of r.mm.a)if(x.cd>at)x.cd+=d;
}
const SEND_GROUP=g=>g==='food'?'food':g==='drink'?'drink':'gfood';
export function boatAction(source,account,ctx,input,rng=Math.random) {
  const r={...freshBoat(),...structuredClone(source)}, player=structuredClone(account), {uid,admin,now}=ctx;
  if(!uid||!Number.isFinite(now))fail('ไม่มีบัญชีหรือเวลาเซิร์ฟเวอร์');
  for(const k of ['shield','swim','swam','noSwim','mmBan','rainRes','offers','stays'])r[k] ||= {};
  if(r.mm&&!Array.isArray(r.mm.a))r.mm=null;// นางเงือกรุ่นเก่า (fix16) ไม่ใช้ต่อ
  const type=input.type;
  if(!r.names)r.names={};if(ctx.name&&r.team[uid])r.names[uid]=String(ctx.name).slice(0,40);
  r._now=now;r._coins=Number.isSafeInteger(ctx.coins)?ctx.coins:0;const coins0=r._coins;
  const ledger=settleBoat(r,ctx,rng,player,type==='card'?input.box:null);
  /* ภารกิจว่ายกลับของตัวเองที่ค้าง (รอบเก่า/จบแล้ว) ลบทิ้ง */
  if(ctx.x17?.sq&&(ctx.x17.sq.round!==(r.round||0)||!r.swim?.[uid]))delete ctx.x17.sq;
  const done=extra=>{settleExtras(r,ctx,player,ledger);emitViews(r);const mails=[],views=[],notices=[];
    for(const x of r.outbox||[]){if(x.mail)mails.push(x.mail);
      if(x.ledger){const e=x.ledger;if(e.uid===uid){player.merit=floorAdd(player.merit,e.merit);ledger.push({uid,id:e.id,merit:e.merit,self:true,title:e.title});}else ledger.push({uid:e.uid,id:e.id,merit:e.merit,title:e.title,msg:e.msg});}
      if(x.rain)notices.push(x.rain);
      if(x.view){const v=views.find(v=>v.uid===x.view.uid);if(v)v.data={...v.data,...x.view.data};else views.push({uid:x.view.uid,data:{...x.view.data}});}}
    delete r.outbox;delete r._now;const coinsOut=r._coins;delete r._coins;return {race:r,player,ledger,mails,views,...(notices.length?{rainCall:notices[0]}:{}),...(coinsOut!==coins0?{coins:coinsOut}:{}),...extra};};
  const boat=r.team[uid];
  if(type==='status'||type==='tick')return done();
  const addNames=()=>{for(const [id,n]of Object.entries(input.names||{}))if(typeof n==='string')r.names[id]=n.slice(0,40);};
  if(type==='teams') {
    if(!admin)fail('เฉพาะแอดมิน');if(r.status!=='setup')fail('จัดทีมก่อนเริ่มการแข่งขันเท่านั้น');
    const roster=input.roster||[];
    if(Number.isInteger(input.boat)&&Array.isArray(input.members)) {
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
    if(r.status==='running'||r.status==='paused')finishExtras(r);
    const mails=[],views=[];for(const x of r.outbox||[]){if(x.mail)mails.push(x.mail);if(x.ledger)ledger.push({uid:x.ledger.uid,id:x.ledger.id,merit:x.ledger.merit,title:x.ledger.title,msg:x.ledger.msg});if(x.view){const v=views.find(v=>v.uid===x.view.uid);if(v)v.data={...v.data,...x.view.data};else views.push({uid:x.view.uid,data:{...x.view.data}});}}
    if(r.mm&&Array.isArray(r.mm.a))for(const x of r.mm.a)if(!views.some(v=>v.uid===x.uid))views.push({uid:x.uid,data:{round:r.round||0,active:false}});
    return {race:fresh,player,ledger,mails,views};}
  if(type==='claimCredit') {
    const credited=r.credits[uid]||0,claimed=r.claimedCredits[uid]||0,amount=credited-claimed;
    if(amount<=0)fail('ไม่มีรางวัลใหม่');player.merit=(player.merit||0)+amount;r.claimedCredits[uid]=credited;return done();
  }
  /* ⛈️ ฝนกุศล: ส่งผลหลังฝนหยุด (รับได้แม้การแข่งพัก/จบ เพื่อไม่ให้กุศลของใครหาย) */
  if(type==='rainEnd'){
    const rain=r.rain;if(!rain||rain.id!==input.id)fail('ฝนรอบนี้จบไปแล้ว');
    if(!r.team[uid])fail('รอบนี้คุณไม่ได้ร่วมแข่ง');
    if(now<rain.end-500)fail('ฝนยังไม่หยุด');if(now>rain.end+RAIN_LATE)fail('ส่งผลฝนช้าเกินไป');
    if(r.rainRes[uid])return done({rain:{...r.rainRes[uid],again:true}});
    const s=rainScore(rainLogic(rain.seed),input.taps,input.miss,rain.lvl,Array.isArray(input.goldsMine)?input.goldsMine:[]);
    {const cap=RAIN_PLUS_CAP*(RAIN_LEVELS.includes(rain.lvl)?rain.lvl:1),ng=s.plus-s.goldV;if(ng>cap){s.plus=cap+s.goldV;s.net=s.plus-s.minus;}}
    player.merit=floorAdd(player.merit,s.net);
    r.rainRes[uid]={n:s.net,p:s.pos,a:s.anc,g:s.gold};
    if(s.anc&&r.status==='running')boatProgress(r,r.team[uid],-RAIN_ANCHOR_BACK*s.anc,rng);
    return done({rain:{plus:s.plus,minus:s.minus,net:s.net,pos:s.pos,anc:s.anc,best:s.best,gold:s.gold,missPen:s.missPen}});
  }
  if(r.status!=='running')fail(r.status==='paused'?'พักการแข่งขันอยู่':'การแข่งขันไม่ได้เปิดอยู่');
  if(type==='rainCall'){
    if(!admin)fail('เฉพาะแอดมิน');if(r.rain&&!r.rain.done)fail('ฝนกุศลกำลังตกอยู่');
    const lvl=input.lvl;if(!RAIN_LEVELS.includes(lvl))fail('เลือกระดับฝน');
    const start=now+RAIN_WARN,id='rain-'+now,seed=(Math.floor(rng()*2147483647)^now)|0;
    r.rain={id,lvl,seed,at:now,start,end:start+RAIN_MS,done:false};r.rainRes={};
    log(r,'⛈️ ฝนกุศลกำลังจะตก!');outbox(r,{rain:{id,lvl,seed,start,end:start+RAIN_MS}});return done();
  }
  if(type==='mmPoke'){
    const i=input.i===1?1:0;if(!mmLive(r,i))fail('ตอนนี้ไม่มีนางเงือกตนนี้');if(mmIndex(r,uid)>=0)fail('นางเงือกจิ้มกันเองไม่ได้');if(admin)fail('แอดมินไม่ต้องจิ้ม');
    const x17=ctx.x17 ||= {};const last=Number(x17.pokeAt)||0;if(now<last+BOAT_MM_POKE_CD)fail('⏳ จิ้มนางเงือกได้อีกใน '+Math.ceil((last+BOAT_MM_POKE_CD-now)/60000)+' นาที');
    x17.pokeAt=now;
    if(rng()<.5){const before=player.merit||0;player.merit=floorAdd(before,-BOAT_MM_POKE);return done({poke:{lose:before-(player.merit||0),i}});}
    player.bag ||= {};const got={};for(let k=0;k<BOAT_MM_POKE_BOXES;k++){const [g,id]=pickOne(BOAT_POKE_BOXES,rng);player.bag[g] ||= {};player.bag[g][id]=(Number.isSafeInteger(player.bag[g][id])?player.bag[g][id]:0)+1;got[g+'.'+id]=(got[g+'.'+id]||0)+1;}
    return done({poke:{boxes:got,i}});
  }
  if(type==='mmSend'){
    const i=mmIndex(r,uid);if(!mmLive(r,i))fail('คุณไม่ได้เป็นนางเงือก');const mm=r.mm,a=mm.a[i];
    if(mm.win!==null)fail('การแข่งส่งถาดจบแล้ว');
    const qty=input.qty;if(!BOAT_MM_SEND.includes(qty))fail('ส่งได้ครั้งละ 1–3 ถาด');
    if(!mm.menus.includes(input.menu))fail('เมนูนี้ไม่ใช่เมนูนางเงือก');
    if(a.cd>now)fail('⏳ ส่งถาดได้อีกใน '+Math.ceil((a.cd-now)/60000)+' นาที');
    const c=catOf(input.menu);if(!c)fail('เมนูไม่ถูกต้อง');const [g,id]=[c.p.split('.')[0],c.p.slice(c.p.indexOf('.')+1)];
    const have=Number(player.bag?.[g]?.[id])||0;if(have<qty)fail('อาหารไม่พอ');player.bag[g][id]=have-qty;
    const before=a.t;a.t=Math.min(BOAT_MM_GOAL,a.t+qty);a.cd=now+BOAT_MM_CD;a.at=now;const other=mm.a[1-i],steps=[];
    for(let s=BOAT_MM_STEP;s<BOAT_MM_GOAL;s+=BOAT_MM_STEP)if(before<s&&a.t>=s&&mm.ms[s]===undefined){mm.ms[s]=i;steps.push(s);
      player.merit=(player.merit||0)+BOAT_MM_BONUS;ledger.push({uid,id:'boat-mm-step-'+(r.round||0)+'-'+s,merit:BOAT_MM_BONUS,self:true,title:'🎯 ถาดครบ '+s+' ก่อน'});
      if(mm.lose!==1-i)ledgerOut(r,other.uid,-BOAT_MM_BONUS,'🎯 นางเงือกอีกตนถึง '+s+' ถาดก่อน','นางเงือกอีกตนส่งถาดครบ '+s+' ก่อน','boat-mm-step-'+(r.round||0)+'-'+s+'-x');
      log(r,'🎯 นางเงือก '+nameOf(r,uid)+' ถึง '+s+' ถาดก่อน! +300,000 · '+nameOf(r,other.uid)+' −300,000');}
    let won=false;
    if(a.t>=BOAT_MM_GOAL&&mm.win===null){won=true;ledgerOut(r,other.uid,-BOAT_MM_LOSE,'💔 นางเงือกสลาย','นางเงือกอีกตนส่งถาดครบ 100 ก่อน','boat-mm-lose-'+(r.round||0)+'-'+other.uid);
      log(r,'👑 '+nameOf(r,uid)+' ส่งถาดครบ 100 เป็นนางเงือกตัวจริง! · 💔 '+nameOf(r,other.uid)+' สลาย −500,000');mmResolve(r,i,'นางเงือกอีกตนส่งถาดครบ 100 ก่อน ขอบคุณที่ทำหน้าที่');}
    return done({mmSend:{t:a.t,steps,won,cd:a.cd}});
  }
  if(type==='mmFire'){
    if(!mmReal(r)||mmReal(r)!==uid)fail('คุณไม่ได้เป็นนางเงือกตัวจริง');
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
    const res=resolveOffer(r,uid,player,accept,now,ctx,rng);r.lastStay={uid,...res,at:now};return done({stay:res});
  }
  if(type==='swimDone'){
    const s=r.swim?.[uid];if(!s)fail('ตอนนี้คุณไม่ได้ว่ายกลับเรือ');const sq=ctx.x17?.sq;
    if(!sq||sq.round!==(r.round||0))fail('ไม่พบภารกิจว่ายกลับ');
    const prog=sq.kind==='bird'?Math.max(0,birdSum(player)-(sq.base||0)):Math.max(0,sq.got||0);
    const inTime=now<=s.until+BOAT_GRACE||(Number(sq.doneAt)>0&&sq.doneAt<=s.until);
    if(prog<sq.need)fail('ภารกิจยังไม่ครบ ('+prog.toLocaleString('en-US')+'/'+sq.need.toLocaleString('en-US')+')');
    if(!inTime)fail('หมดเวลาว่ายกลับแล้ว');
    delete r.kicked[uid];delete r.swim[uid];r.swam[uid]='ok';r.shield[uid]=now+BOAT_SHIELD;delete ctx.x17.sq;
    player.merit=(player.merit||0)+BOAT_SWIM_GAIN;ledger.push({uid,id:'boat-swim-ok-'+(r.round||0)+'-'+uid,merit:BOAT_SWIM_GAIN,self:true,title:'🏊 ว่ายกลับเรือสำเร็จ'});
    log(r,'🏊 '+nameOf(r,uid)+' ว่ายกลับเรือ '+r.team[uid]+' สำเร็จ! +1,000,000 🛡️');
    return done({swimBack:{boat:r.team[uid],gain:BOAT_SWIM_GAIN,shield:now+BOAT_SHIELD}});
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
      const group=SEND_GROUP(input.group),menu=CATALOG.find(c=>c.p===group+'.'+k);menuKey=menu?.k||null;
      have=Number(player.bag?.[group]?.[k])||0;take=()=>{player.bag[group][k]=have-qty;};
    }
    if(r.menus[boat]?.length&&(!menuKey||!r.menus[boat].includes(menuKey)))fail('อาหารนี้ไม่อยู่ในเสบียงของทีม');
    if(have<qty)fail(alp?'ของแปรรูปไม่พอ':'อาหารสวนไม่พอ');
    take();let gain=0;
    for(let i=0;i<qty;i++)gain+=alp?BOAT_STAR_MERIT[BOAT_ALPACA[k][0]]:BOAT_FOOD_MERIT[0]+Math.floor(rng()*(BOAT_FOOD_MERIT[1]-BOAT_FOOD_MERIT[0]+1));
    r.combo ||= {};let c=r.combo[uid];if(!c||c.b!==boat)c=r.combo[uid]={b:boat,got:[]};let combo=0;
    const menus=r.menus[boat]||[];if(menus.length&&!c.got.includes(menuKey)){c.got.push(menuKey);if(menus.every(m=>c.got.includes(m))){combo=BOAT_COMBO;c.got=[];c.n=(c.n||0)+1;log(r,'🍱 '+nameOf(r,uid)+' ส่งเสบียงครบทุกเมนู รับคอมโบ +20,000 กุศล');
      if(mmOn(r))r.mm.a.forEach((x,i)=>{if(r.mm.lose!==i)x.earn+=Math.round(BOAT_COMBO*BOAT_MM_SHARE);});}}
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
    log(r,'🎁 เรือ '+boat+' เปิดกล่องได้การ์ด'+BOAT_CARD_NAMES[card]);// fix17: ไม่บอกชื่อคนเปิด
    return done({card,reveal:box.deck});
  }
  if(box.picked===undefined){box.picked=i;box.pickedAt=now;box.card=card;box.pickedBy=uid;}
  ledger.push(...useCard(r,box,{target:input.target,targets:input.targets,boats:input.boats,mode:input.mode,uid:input.uid,fire:input.fire,mine:input.mine,theirs:input.theirs},ctx,rng,player,false));
  return done({card,reveal:box.deck});
}
/* ข้อมูลที่ทุกคนเห็น (world/boat): ไม่มีสำรับก่อนเปิด · ไม่มีชื่อคนเปิดการ์ด · ไม่มีภารกิจส่วนตัว */
export function publicBoat(r) {const out=structuredClone(r);delete out.outbox;delete out._now;delete out.mmSig;delete out._coins;
  for(const b of out.boxes){if(!b.opened&&b.picked===undefined)delete b.deck;delete b.pickedBy;}
  for(const s of Object.values(out.swim||{})){delete s.key;}
  return out;}
/* กล่องการ์ดที่ฉันเปิดค้างไว้ (ส่งให้เจ้าตัวเท่านั้น) */
export const myPicks=(r,uid)=>(r.boxes||[]).filter(b=>!b.opened&&b.picked!==undefined&&b.pickedBy===uid).map(b=>b.id);
