import {CATALOG} from './catalog.js';
/* กติกาเรือเป็นฟังก์ชันล้วน: ใช้กับ transaction บนคลาวด์ ไม่สร้างผู้เล่นจำลอง */
export const BOAT_LINES=[50,100,150,200,250,300];
export const BOAT_GOAL=400;
export const BOAT_COOLDOWN=5*60000;
export const BOAT_CARD_TIME=30000;        // การ์ดที่หยิบแล้ว ใช้เองอัตโนมัติเมื่อครบ 30 วิ (เวลาเซิร์ฟเวอร์)
export const BOAT_TARGET_TIME=10*60000;   // การ์ดที่ต้องเลือกเป้า ถ้าไม่เลือกใน 10 นาที ระบบสุ่มเป้าให้
export const BOAT_MERIT=5000;
export const BOAT_MENU_MAX=8;
export const BOAT_CARDS=[['supply',30],['cut',30],['merit',20],['stop',15],['kick',5]];
export const BOAT_CARD_NAMES={supply:'เติมเสบียง',cut:'ตัดเสบียง',merit:'กุศล',stop:'หยุดเรือ',kick:'เตะ'};
export const needsTarget=card=>card==='cut'||card==='kick';
const fail=m=>{throw new Error(m);};
export function freshBoat(){return {status:'setup',p:[0,0,0,0,0],team:{},kicked:{},claims:{},menus:{},boxes:[],winner:null,stopUntil:0,stopBy:null,sent:{},cd:{},credits:{},claimedCredits:{},log:[],names:{},lastTeam:{},pausedAt:null};}
export const members=(r,b)=>Object.keys(r.team).filter(u=>r.team[u]===b&&!r.kicked[u]);
const log=(r,m)=>{r.log.unshift(m);r.log=r.log.slice(0,40);};
const nameOf=(r,u)=>r.names?.[u]||'ลูกเรือ';
const pickOne=(list,rng)=>list[Math.min(list.length-1,Math.floor(rng()*list.length))];
const roll=rng=>{let x=rng()*100;for(const [k,w]of BOAT_CARDS){x-=w;if(x<0)return k;}return 'kick';};
const boatOk=b=>Number.isInteger(b)&&b>=1&&b<=5;
const foodKeys=new Set(CATALOG.filter(c=>c.p.startsWith('food.')||c.p.startsWith('gfood.')).map(c=>c.k));
export function boatProgress(r,b,n,rng) {
  if(r.status!=='running')fail('การแข่งขันไม่ได้เปิดอยู่');
  if(!boatOk(b))fail('เรือไม่ถูกต้อง');
  const before=r.p[b-1];r.p[b-1]=Math.max(0,Math.min(BOAT_GOAL,before+n));
  for(const line of BOAT_LINES)if(before<line&&r.p[b-1]>=line) {
    const arrived=r.claims[line] ||= [];
    if(arrived.length<2&&!arrived.includes(b)) {
      arrived.push(b);r.boxes.push({id:line+'-'+b,boat:b,line,opened:false,deck:Array.from({length:5},()=>roll(rng))});
    }
  }
  if(r.p[b-1]===BOAT_GOAL){r.status='finished';r.winner=b;log(r,'🏁 เรือ '+b+' ถึงเส้น 400 ชนะ!');}
}
/* ใช้การ์ดที่หยิบไว้ ถ้าไม่ได้ระบุเป้า (หมดเวลา) จะสุ่มเป้าที่ใช้ได้ */
function useCard(r,box,choice,ctx,rng,player,auto) {
  const boat=box.boat,card=box.card,{uid,now}=ctx,tag=auto?' (อัตโนมัติ)':'';
  const rivals=[1,2,3,4,5].filter(b=>b!==boat);
  let target=choice.target,victims=[];
  if(card==='cut') {
    if(target===undefined||target===null){const staffed=rivals.filter(b=>Object.values(r.team).includes(b));target=pickOne(staffed.length?staffed:rivals,rng);}
    if(!Number.isInteger(target)||!rivals.includes(target))fail('เลือกเรือคู่แข่ง');
  }
  if(card==='kick') {
    const teams=rivals.filter(b=>members(r,b).length);
    let targets=choice.targets||(choice.target!==undefined&&choice.target!==null?[choice.target]:null);
    if(!targets)targets=teams.map(b=>pickOne(members(r,b),rng));
    if(!Array.isArray(targets))fail('เลือกสมาชิกคู่แข่ง');
    if(choice.targets&&targets.length!==teams.length)fail('เลือกคู่แข่งทีมละ 1 คน');
    const seen=new Set();for(const id of targets){const b=r.team[id];if(!b||b===boat||r.kicked[id]||seen.has(b))fail('เลือกคู่แข่งทีมละ 1 คน');seen.add(b);victims.push(id);}
  }
  box.opened=true;box.usedAt=now;delete box.deadline;
  const ledger=[];
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
    log(r,'เรือ '+boat+' ได้การ์ดกุศล ลูกเรือคนละ 5,000'+tag);
  }
  if(card==='stop'){r.stopUntil=now+30*60000;r.stopBy=boat;log(r,'เรือ '+boat+' ใช้การ์ดหยุดเรือ ทีมอื่นส่งเสบียงไม่ได้ 30 นาที'+tag);}
  if(card==='kick') {
    for(const id of victims)r.kicked[id]=true;box.victims=victims;
    log(r,victims.length?'เรือ '+boat+' ใช้การ์ดเตะ '+victims.map(id=>nameOf(r,id)).join(', ')+' ออกจากทีม'+tag:'เรือ '+boat+' ใช้การ์ดเตะ แต่ไม่มีคู่แข่งให้เตะ'+tag);
  }
  return ledger;
}
/* เส้นตายฝั่งเซิร์ฟเวอร์: การ์ดไม่ต้องเลือกเป้าใช้เองหลัง 30 วิ / การ์ดเลือกเป้าสุ่มเป้าหลัง 10 นาที */
export function settleBoat(r,ctx,rng,player,skipBox) {
  const ledger=[];
  if(r.status!=='running')return ledger;
  for(const box of r.boxes) {
    if(r.status!=='running')break;
    if(box.opened||box.picked===undefined||box.id===skipBox)continue;
    const deadline=box.deadline??((box.pickedAt||ctx.now)+(needsTarget(box.card)?BOAT_TARGET_TIME:BOAT_CARD_TIME));
    if(deadline>ctx.now)continue;
    ledger.push(...useCard(r,box,{},ctx,rng,player,true));
  }
  return ledger;
}
function shiftTimers(r,now) {
  const at=r.pausedAt,d=Number.isFinite(at)?Math.max(0,now-at):0;r.pausedAt=null;if(!d)return;
  for(const u of Object.keys(r.cd))if(r.cd[u]>at)r.cd[u]+=d;
  if(r.stopUntil>at)r.stopUntil+=d;
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
  if(type==='status')return done();
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
    r.team[id]=b;addNames();log(r,'แอดมินเพิ่ม '+nameOf(r,id)+' เข้าเรือ '+b);return done();
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
    const fresh=freshBoat();fresh.team={...r.team};fresh.menus={...r.menus};fresh.names={...r.names};fresh.lastTeam={...r.team};fresh.round=now;fresh.status='running';log(fresh,'🏁 เริ่มการแข่งขัน');
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
  ledger.push(...useCard(r,box,{target:input.target,targets:input.targets},ctx,rng,player,false));
  return done({card,reveal:box.deck});
}
export function publicBoat(r) {const out=structuredClone(r);for(const b of out.boxes)if(!b.opened&&b.picked===undefined)delete b.deck;return out;}
