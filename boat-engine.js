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
export const boxSlots=line=>line<=100?3:2; // fix14: เส้น 50 และ 100 มีกล่อง 3 ลำแรก
export const BOAT_GRACE=15000;          // ผู้เปิดส่งเป้าช้ากว่าเส้นตายได้ไม่เกิน 15 วิ (เผื่อเน็ตช้า) หลังจากนั้นเซิร์ฟเวอร์สุ่มเอง
export const BOAT_CARD_NAMES={supply:'เติมเสบียง',cut:'ตัดเสบียง',merit:'กุศล',stop:'หยุดเรือ',kick:'เตะ',pull:'ดึงตัว',swap:'สลับตัว',revive:'ชุบชีวิต',ink:'พ่นหมึก',freeze:'แช่แข็ง',crab:'ปูหนีบ'};
const TARGET_CARDS=new Set(['cut','kick','pull','swap','revive','ink','freeze','crab']);
export const needsTarget=card=>TARGET_CARDS.has(card);
const fail=m=>{throw new Error(m);};
export function freshBoat(){return {status:'setup',p:[0,0,0,0,0],team:{},kicked:{},claims:{},menus:{},boxes:[],winner:null,stopUntil:0,stopBy:null,sent:{},cd:{},credits:{},claimedCredits:{},log:[],names:{},lastTeam:{},pausedAt:null,startSize:{},fired:{},frozen:{},revives:0};}
export const members=(r,b)=>Object.keys(r.team).filter(u=>r.team[u]===b&&!r.kicked[u]);
const log=(r,m)=>{r.log.unshift(m);r.log=r.log.slice(0,40);};
const nameOf=(r,u)=>r.names?.[u]||'ลูกเรือ';
const pickOne=(list,rng)=>list[Math.min(list.length-1,Math.floor(rng()*list.length))];
/* สุ่มแบบกำหนดผลได้ (seed จากข้อมูลกล่อง): ใครเป็นคนชำระการ์ดที่หมดเวลา ผลก็เหมือนกันเสมอ */
export function seededRng(seed) {
  let h=2166136261>>>0;for(const ch of String(seed)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0;}
  return ()=>{h=(h+0x6D2B79F5)>>>0;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
const boxSeed=(r,box)=>box.id+'|'+(box.pickedAt||0)+'|'+(r.round||0);
const reviveOk=r=>Object.values(r.kicked||{}).some(Boolean)&&(r.revives||0)<BOAT_REVIVE_MAX;
export function rollCard(rng,line,canRevive){const table=(line<=100?BOAT_CARDS_EARLY:BOAT_CARDS_LATE).filter(([k])=>k!=='revive'||canRevive),total=table.reduce((a,[,w])=>a+w,0);let x=rng()*total;for(const [k,w]of table){x-=w;if(x<0)return k;}return table[table.length-1][0];}
const boatOk=b=>Number.isInteger(b)&&b>=1&&b<=5;
const foodKeys=new Set(CATALOG.filter(c=>c.p.startsWith('food.')||c.p.startsWith('gfood.')).map(c=>c.k));
export function boatProgress(r,b,n,rng) {
  if(r.status!=='running')fail('การแข่งขันไม่ได้เปิดอยู่');
  if(!boatOk(b))fail('เรือไม่ถูกต้อง');
  const before=r.p[b-1];r.p[b-1]=Math.max(0,Math.min(BOAT_GOAL,before+n));
  for(const line of BOAT_LINES)if(before<line&&r.p[b-1]>=line) {
    const arrived=r.claims[line] ||= [];
    if(arrived.length<boxSlots(line)&&!arrived.includes(b)) {
      const can=reviveOk(r);arrived.push(b);r.boxes.push({id:line+'-'+b,boat:b,line,opened:false,deck:Array.from({length:5},()=>rollCard(rng,line,can))});
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
  r.startSize ||= {};r.fired ||= {};r.frozen ||= {};r.revives ||= 0;
  const intOr=v=>v===undefined||v===null?null:v;
  let target=intOr(choice.target),victims=[];
  const ledger=[];
  // ---- ตรวจและสุ่มเป้า (ยังไม่เปลี่ยนสถานะ จนกว่าจะผ่านการตรวจทั้งหมด) ----
  if(card==='cut'||card==='ink'||card==='crab') {
    if(target===null)target=pickOne(staffed.length?staffed:rivals,pick);
    if(!Number.isInteger(target)||!rivals.includes(target))fail('เลือกเรือคู่แข่ง');
  }
  if(card==='kick') {
    const mode=choice.mode==='one'?'one':'all',targets=choice.targets??(choice.target!==undefined&&choice.target!==null&&typeof choice.target==='string'?[choice.target]:[]);
    if(!Array.isArray(targets))fail('เลือกสมาชิกคู่แข่ง');
    if(mode==='one'&&targets.length) {
      if(targets.length>2)fail('เตะทีมเดียวได้ไม่เกิน 2 คน');
      const b0=r.team[targets[0]];
      for(const id of targets){const b=r.team[id];if(!b||b===boat||r.kicked[id]||b!==b0)fail('เลือกคนจากทีมเดียวกัน ไม่เกิน 2 คน');}
      if(new Set(targets).size!==targets.length)fail('เลือกคนซ้ำ');
      victims=[...targets];
    } else {
      // ทุกทีมคู่แข่งทีมละ 1 คน · ทีมที่ไม่ได้เลือก ระบบสุ่มให้
      const seen=new Set();for(const id of targets){const b=r.team[id];if(!b||b===boat||r.kicked[id]||seen.has(b))fail('เลือกคู่แข่งทีมละ 1 คน');seen.add(b);victims.push(id);}
      for(const b of staffed)if(!seen.has(b))victims.push(pickOne(members(r,b),pick));
    }
  }
  let pulled=null,fired=null,swapA=null,swapB=null,revived=null,revivedTo=null,reviveFull=false,frozen=null;
  if(card==='pull') {
    const pool=rivalMembers(r,boat);pulled=typeof choice.uid==='string'?choice.uid:(pool.length?pickOne(pool,pick):null);
    if(pulled!==null&&!pool.includes(pulled))fail('เลือกคู่แข่ง 1 คน');
    if(pulled!==null&&members(r,boat).length+1>capOf(r,boat)) {
      const own=members(r,boat),opener=box.pickedBy||uid;
      if(typeof choice.fire!=='string'&&!auto)fail('ทีมเต็มโควตาแล้ว ต้องเลือกลูกเรือ 1 คนให้ออก');fired=typeof choice.fire==='string'?choice.fire:pickOne(own.filter(u=>u!==opener).length?own.filter(u=>u!==opener):own,pick);
      if(!own.includes(fired))fail('ทีมเต็มโควตาแล้ว ต้องเลือกลูกเรือ 1 คนให้ออก');
    }
  }
  if(card==='swap') {
    const own=members(r,boat),pool=rivalMembers(r,boat);
    swapA=typeof choice.mine==='string'?choice.mine:(own.length?pickOne(own,pick):null);
    swapB=typeof choice.theirs==='string'?choice.theirs:(pool.length?pickOne(pool,pick):null);
    if((swapA!==null&&!own.includes(swapA))||(swapB!==null&&!pool.includes(swapB)))fail('เลือกลูกเรือเรา 1 คน และคู่แข่ง 1 คน');
    if(swapA===null||swapB===null){swapA=null;swapB=null;}
  }
  if(card==='revive') {
    const pool=kickedList(r);revived=typeof choice.uid==='string'?choice.uid:(pool.length&&r.revives<BOAT_REVIVE_MAX?pickOne(pool,pick):null);
    if(revived!==null&&!pool.includes(revived))fail('เลือกคนที่โดนเตะ 1 คน');
    if(revived!==null&&r.revives>=BOAT_REVIVE_MAX)fail('ชุบชีวิตครบ 2 ครั้งแล้ว');
  }
  if(card==='freeze') {
    const pool=rivalMembers(r,boat);frozen=typeof choice.uid==='string'?choice.uid:(pool.length?pickOne(pool,pick):null);
    if(frozen!==null&&!pool.includes(frozen))fail('เลือกคู่แข่ง 1 คน');
  }
  // ---- ใช้การ์ด ----
  box.opened=true;box.usedAt=now;delete box.deadline;
  if(card==='supply'){log(r,'เรือ '+boat+' ใช้การ์ดเติมเสบียง +10'+tag);boatProgress(r,boat,10,rng);}
  if(card==='cut'){log(r,'เรือ '+boat+' ใช้การ์ดตัดเสบียง เรือ '+target+' ถอย 10'+tag);boatProgress(r,target,-10,rng);box.target=target;}
  if(card==='merit') {
    const id='boat-'+box.id+'-'+(box.pickedAt||now);
    for(const m of members(r,boat)) {
      // ส่วนของผู้กดเข้ากุศลตรง (self:true = ไม่ต้องเขียน ledger)
      if(m===uid){player.merit=(player.merit||0)+BOAT_MERIT;ledger.push({uid:m,id,boat,merit:BOAT_MERIT,self:true});continue;}
      ledger.push({uid:m,id,boat,merit:BOAT_MERIT});
    }
    box.meritTo=members(r,boat);
    log(r,'เรือ '+boat+' ได้การ์ดกุศล ลูกเรือคนละ 100,000'+tag);
  }
  if(card==='stop'){r.stopUntil=now+30*60000;r.stopBy=boat;log(r,'เรือ '+boat+' ใช้การ์ดหยุดเรือ ทีมอื่นส่งเสบียงไม่ได้ 30 นาที'+tag);}
  if(card==='kick') {
    for(const id of victims)r.kicked[id]=true;box.victims=victims;
    log(r,victims.length?'เรือ '+boat+' ใช้การ์ดเตะ '+victims.map(id=>nameOf(r,id)).join(', ')+' ออกจากทีม'+tag:'เรือ '+boat+' ใช้การ์ดเตะ แต่ไม่มีคู่แข่งให้เตะ'+tag);
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
  if(card==='revive') {
    if(revived===null)log(r,'เรือ '+boat+' ใช้การ์ดชุบชีวิต แต่ไม่มีใครให้ชุบ'+tag);
    else {
      const home=r.team[revived],sizeOf=b=>members(r,b).length;
      if(sizeOf(home)<Math.max(1,r.startSize?.[home]??1))revivedTo=home;
      else{reviveFull=true;revivedTo=[1,2,3,4,5].sort((a,b)=>sizeOf(a)-sizeOf(b)||a-b)[0];}
      delete r.kicked[revived];delete r.fired[revived];r.team[revived]=revivedTo;r.revives++;
      box.revived=revived;box.from=home;box.target=revivedTo;box.full=reviveFull;
      log(r,'เรือ '+boat+' ชุบชีวิต '+nameOf(r,revived)+(reviveFull?' (เรือ '+home+' เต็ม จึงไปเรือ '+revivedTo+' ที่คนน้อยที่สุด)':' กลับเรือ '+revivedTo)+tag);
    }
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
  return ledger;
}
function shiftTimers(r,now) {
  const at=r.pausedAt,d=Number.isFinite(at)?Math.max(0,now-at):0;r.pausedAt=null;if(!d)return;
  for(const u of Object.keys(r.cd))if(r.cd[u]>at)r.cd[u]+=d;
  if(r.stopUntil>at)r.stopUntil+=d;
  for(const u of Object.keys(r.frozen||{}))if(r.frozen[u]>at)r.frozen[u]+=d;
  for(const box of r.boxes)if(!box.opened&&box.picked!==undefined){if(Number.isFinite(box.pickedAt))box.pickedAt+=d;if(Number.isFinite(box.deadline))box.deadline+=d;}
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
    if(!boatOk(b)||!Array.isArray(menus)||menus.length<1||menus.length>BOAT_MENU_MAX||new Set(menus).size!==menus.length||menus.some(k=>!foodKeys.has(k)))fail('เลือกอาหาร 1–8 เมนูไม่ซ้ำสำหรับเรือลำนี้');
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
  if(!boat||r.kicked[uid])fail('คุณยังไม่มีทีม หรือถูกคัดออกแล้ว');
  if(type==='supply') {
    if(r.stopUntil>now&&r.stopBy!==boat)fail('เรือถูกหยุด');
    if((r.frozen?.[uid]||0)>now)fail('🧊 ถูกแช่แข็งอยู่ ส่งเสบียงไม่ได้');
    if((r.cd[uid]||0)>now)fail('ยังอยู่ในช่วงพักส่ง');
    const menu=CATALOG.find(c=>c.p===(input.group==='food'?'food.':'gfood.')+input.food);if(r.menus[boat]?.length&&(!menu||!r.menus[boat].includes(menu.k)))fail('อาหารนี้ไม่อยู่ในเสบียงของทีม');
    const k=String(input.food),group=input.group==='food'?'food':'gfood',have=player.bag?.[group]?.[k]||0;
    if(have<1)fail('อาหารสวนไม่พอ');
    player.bag[group][k]--;player.merit=(player.merit||0)+10+Math.floor(rng()*21);
    r.cd[uid]=now+BOAT_COOLDOWN;r.sent[uid]=(r.sent[uid]||0)+1;
    log(r,nameOf(r,uid)+' ส่งเสบียงเรือ '+boat);boatProgress(r,boat,1,rng);return done();
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
  ledger.push(...useCard(r,box,{target:input.target,targets:input.targets,mode:input.mode,uid:input.uid,fire:input.fire,mine:input.mine,theirs:input.theirs},ctx,rng,player,false));
  return done({card,reveal:box.deck});
}
export function publicBoat(r) {const out=structuredClone(r);for(const b of out.boxes)if(!b.opened&&b.picked===undefined)delete b.deck;return out;}
