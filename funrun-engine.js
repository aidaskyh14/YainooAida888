/* fix14 แรลลี่ฟักทอง — กติกาล้วน (เซิร์ฟเวอร์ + หน้าเกมใช้ชุดเดียวกัน ไม่มี Firebase)
   ห้องละ 6 คน · ครบ 6 และทุกคนกดพร้อม (จ่ายค่าเข้าตอนกดพร้อม) → นับ 10 วิ → 3 ด่าน → จัดอันดับรวม → ให้/หักกุศล
   เซิร์ฟเวอร์เป็นคนตัดสินคะแนนและเงินทั้งหมด หน้าเกมรายงานผลของตัวเองแต่ละด่าน แล้วเซิร์ฟเวอร์ตรวจว่าทำได้จริง */
export const FR={SEATS:6,ROUNDS:3,LEN:13000,SPEED:3.3,COUNTDOWN:10000,ROUND_CD:3500,BETWEEN:8000,CUTOFF:20000,ROUND_MAX:150000,RESULTS:30000,
 MIN_MERIT:15000,FEE:{coin:20,hat:100,mb:100},MIN_TIME:40000,STALE:10*60000};
export const FR_CHARS=['pig','hedgehog','cat','alpaca','dog','dodo'];
const fail=m=>{throw new Error(m);};
export function rng(s){s=Math.max(1,Math.floor(s)%2147483646||1);return()=>{s=(s*16807)%2147483647;return s/2147483647;};}
export const ZONE_OBS=[['ob-pumpkin','ob-spikes','ob-mud','ob-cauldron','ob-bats','ob-tomb'],['ob-spikes','ob-cauldron','ob-bats','ob-ghost','ob-pumpkin'],['ob-ghost','ob-spikes','ob-bats','ob-tomb','ob-cauldron']];
/* สนามของแต่ละด่าน (seed จากเซิร์ฟเวอร์ → ทุกเครื่องได้สนามเดียวกัน) */
export function buildCourse(seed,round){
 const r=rng(((seed>>>0)%2000000000)+round*7919+31),pits=[],plats=[],obs=[],boxes=[],candies=[],pads=[],kinds=ZONE_OBS[Math.max(0,Math.min(2,round-1))];
 let x=700;
 while(x<FR.LEN-600){
  const roll=r();
  if(roll<.24){const w=90+r()*50;pits.push([x,x+w]);if(r()<.5)plats.push({x1:x-60,x2:x+w+120,h:115,k:r()<.5?'tl-plank':'tl-stone'});x+=w+260+r()*160;}
  else if(roll<.42){const w=260+r()*200;pads.push({x:x-70,sq:0});plats.push({x1:x,x2:x+w,h:150+r()*20,k:r()<.5?'tl-plank':'tl-stone'});for(let c=x+30;c<x+w-20;c+=34)candies.push({x:c,y:185});boxes.push({x:x+w/2,y:240});x+=w+220;}
  else{const k=kinds[Math.floor(r()*kinds.length)];obs.push({x,k,fly:k==='ob-bats'});if(r()<.5)for(let c=x+60;c<x+200;c+=34)candies.push({x:c,y:20});x+=300+r()*200;}
  if(r()<.5)boxes.push({x:x-120,y:95});
 }
 return {pits,plats,obs,boxes,candies,pads};
}
export const roundScore=rep=>{if(!rep||rep.dnf)return {time:0,heart:0,got:0,total:0};const time=rep.fin?Math.max(0,150-Math.round(rep.time/1000)):0,heart=rep.fin?rep.hp*15:0,got=rep.candy+rep.boxes*5;return {time,heart,got,total:time+heart+got};};
export function frReward(rank,score){const q=Math.max(0,Math.min(1,score/600)),k=v=>Math.round(v/1000)*1000;
 return [k(50000+50000*q),k(25000+20000*q),k(10000+15000*q),0,-k(3000+5000*(1-q)),-k(8000+7000*(1-q))][rank]||0;}
export function freshRoom(){return {status:'lobby',seats:[],game:null,seed:0,round:0,startAt:0,roundStart:0,first:0,reports:{},totals:{},results:null,doneAt:0,lastAt:0};}
const seatOf=(r,uid)=>r.seats.findIndex(s=>s.uid===uid);
/* ปิดด่าน: ใครไม่รายงาน = ไม่ถึงเส้นชัย · ด่าน 3 จบ → จัดอันดับ/รางวัล */
function closeRound(r,now){
 const reps=r.reports[r.round] ||= {};for(const s of r.seats)if(!reps[s.uid])reps[s.uid]={dnf:true};
 for(const s of r.seats){const t=r.totals[s.uid] ||= {time:0,heart:0,got:0,total:0};const sc=roundScore(reps[s.uid]);for(const k of ['time','heart','got','total'])t[k]+=sc[k];}
 if(r.round<FR.ROUNDS){r.round++;r.roundStart=now+FR.BETWEEN+FR.ROUND_CD;r.first=0;r.status='race';return null;}
 const order=[...r.seats].sort((a,b)=>(r.totals[b.uid].total-r.totals[a.uid].total)||(seatOf(r,a.uid)-seatOf(r,b.uid)));
 r.results=order.map((s,i)=>({uid:s.uid,name:s.name,c:s.c,total:r.totals[s.uid].total,merit:frReward(i,r.totals[s.uid].total)}));
 r.status='results';r.doneAt=now;return r.results;
}
/* ชำระเวลา: เริ่มด่าน / ตัดเวลา 20 วิหลังคนแรกเข้าเส้น / ด่านค้างนานเกิน → ปิดด่าน */
export function settleRoom(r,now){
 let paid=null;
 if(r.status==='countdown'&&now>=r.startAt){r.status='race';}
 if(r.status==='race'){
  const reps=r.reports[r.round]||{},all=r.seats.every(s=>reps[s.uid]),cut=r.first&&now>=r.first+FR.CUTOFF+5000,hard=now>=r.roundStart+FR.ROUND_MAX+10000;
  if(all||cut||hard){paid=closeRound(r,now);if(!paid&&r.status==='race')return settleRoom(r,now)??paid;}
 }
 if(r.status==='results'&&now>=r.doneAt+FR.RESULTS){Object.assign(r,freshRoom());}
 return paid;
}
const hasFee=(game,coins)=>coins>=FR.FEE.coin&&(game.bag?.item?.hat||0)>=FR.FEE.hat&&(game.bag?.item?.musicbox||0)>=FR.FEE.mb;
/* account = เกมของผู้กด · ctx {uid,name,now,coins,admin} · คืนค่า {room,game,coins,payouts,refunds} */
export function funrunAction(source,account,ctx,input){
 const r={...freshRoom(),...structuredClone(source||{})},game=structuredClone(account),{uid,now}=ctx;let coins=ctx.coins;
 game.bag ||= {};game.bag.item ||= {};const refunds=[];let payouts=null;
 const result=extra=>({room:r,game,coins,payouts,refunds,...extra});
 payouts=settleRoom(r,now);
 const type=input.type,i=seatOf(r,uid);
 if(type==='status'||type==='tick')return result();
 if(type==='clear'){if(!ctx.admin)fail('เฉพาะแอดมิน');for(const s of r.seats)if(s.paid)refunds.push({uid:s.uid,fee:s.paid});Object.assign(r,freshRoom());
  const mine=refunds.find(x=>x.uid===uid);if(mine){coins+=mine.fee.coin;game.bag.item.hat=(game.bag.item.hat||0)+mine.fee.hat;game.bag.item.musicbox=(game.bag.item.musicbox||0)+mine.fee.mb;mine.self=true;}return result();}
 if((type==='sit'||type==='ready')&&ctx.emergency)fail('⛔ มินิเกมปิดฉุกเฉินอยู่');
 if(type==='sit'){
  if(r.status!=='lobby')fail('ห้องกำลังแข่งอยู่ รอรอบถัดไปนะ');if(i>=0)return result();if(r.seats.length>=FR.SEATS)fail('ห้องเต็ม 6 คนแล้ว');
  const c=FR_CHARS.includes(input.c)?input.c:FR_CHARS[r.seats.length%6];r.seats.push({uid,name:String(ctx.name||'ผู้เล่น').slice(0,24),c,ready:false,at:now});r.lastAt=now;return result();
 }
 if(i<0)fail('ยังไม่ได้นั่งในห้อง');const seat=r.seats[i];
 if(type==='char'){if(r.status!=='lobby'||seat.ready)fail('เปลี่ยนตัวละครได้ก่อนกดพร้อม');if(!FR_CHARS.includes(input.c))fail('ตัวละครไม่ถูกต้อง');seat.c=input.c;return result();}
 if(type==='leave'){
  if(r.status!=='lobby')fail('เริ่มแข่งแล้ว ออกกลางคันไม่ได้');if(seat.paid){coins+=seat.paid.coin;game.bag.item.hat=(game.bag.item.hat||0)+seat.paid.hat;game.bag.item.musicbox=(game.bag.item.musicbox||0)+seat.paid.mb;}
  r.seats.splice(i,1);return result();
 }
 if(type==='ready'){
  if(r.status!=='lobby')fail('ห้องกำลังแข่งอยู่');if(seat.ready)return result();
  if((game.merit||0)<FR.MIN_MERIT)fail('🙏 กุศลไม่พอ (ต้องมี '+FR.MIN_MERIT.toLocaleString('en-US')+')');
  if(!hasFee(game,coins))fail('ค่าเข้าไม่พอ: ต้องมี 🪙'+FR.FEE.coin+' 🎩'+FR.FEE.hat+' 🎵'+FR.FEE.mb);
  coins-=FR.FEE.coin;game.bag.item.hat-=FR.FEE.hat;game.bag.item.musicbox-=FR.FEE.mb;seat.paid={...FR.FEE};seat.ready=true;r.lastAt=now;
  if(r.seats.length===FR.SEATS&&r.seats.every(s=>s.ready)){r.status='countdown';r.game='fr'+now.toString(36)+Math.floor(Math.random()*1e6).toString(36);r.seed=Math.floor(Math.random()*2e9)+1;r.startAt=now+FR.COUNTDOWN;r.round=1;r.roundStart=r.startAt+FR.ROUND_CD;r.reports={};r.totals={};r.first=0;}
  return result();
 }
 if(type==='report'){
  if(r.status!=='race'&&r.status!=='countdown')fail('ไม่ได้อยู่ระหว่างแข่ง');if(input.game!==r.game||input.round!==r.round)fail('ด่านนี้จบไปแล้ว');
  const reps=r.reports[r.round] ||= {};if(reps[uid])return result();
  const fin=!!input.fin,time=Math.round(Number(input.time)),hp=Math.round(Number(input.hp)),candy=Math.round(Number(input.candy)),bx=Math.round(Number(input.boxes)),course=buildCourse(r.seed,r.round),elapsed=now-r.roundStart;
  if(![time,hp,candy,bx].every(Number.isFinite))fail('ผลไม่ถูกต้อง');
  if(hp<0||hp>5||candy<0||candy>course.candies.length||bx<0||bx>course.boxes.length)fail('ผลไม่ถูกต้อง');
  if(fin&&(time<FR.MIN_TIME||time>elapsed+5000||time>FR.ROUND_MAX||hp<1))fail('เวลาเข้าเส้นชัยไม่ถูกต้อง');
  reps[uid]=fin?{fin:true,time,hp,candy,boxes:bx}:{fin:false,time:0,hp:0,candy,boxes:bx};
  if(fin&&!r.first)r.first=now;r.lastAt=now;
  // เควสต์เนเบอร์ฮูด "เล่นมินิเกมจบรอบ": นับเมื่อส่งผลด่านสุดท้าย
  if(r.round===FR.ROUNDS){game.sub ||= {};game.sub.minigames ||= {cd:{}};game.sub.minigames.cd ||= {};game.sub.minigames.cd.funrun=now;}
  payouts=payouts||settleRoom(r,now);return result();
 }
 fail('คำสั่งไม่ถูกต้อง');
}
export function funrunPublic(r){const {seats,...rest}=r;return {...rest,seats:(seats||[]).map(({uid,name,c,ready})=>({uid,name,c,ready}))};}
