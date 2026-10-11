/* โรงงานลูกกวาดต้องคำสาป — shared rules (Cloud Functions + candy-game.js).
   Pure ES module. Same idea as witch-engine.js: seeded streams + one scoring function used by both sides;
   the server re-scores the finish report and rejects anything the seed and the real clock cannot produce. */
import {seededRng,makeSeed} from './witch-engine.js';
export {seededRng};
const fail=m=>{throw new Error(m);};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const uni=(r,a,b)=>a+r()*(b-a);
const r100=v=>Math.round(v/100)*100;

export const CANDY=Object.freeze({
  id:'candy',
  SHIFT_LEN:55,
  SHIFTS:Object.freeze([{travel:3.4,gap:.95},{travel:2.9,gap:.78},{travel:2.5,gap:.64},{travel:2.3,gap:.48}]),
  TOTAL_T:220,PASS_T:110,
  PTS:Object.freeze({good:40,cursed:60,fake:120,mimic:120,bomb:100,heart:40,clock:40,heartFull:160,shoo:80}),
  PEN:Object.freeze({wrongGood:150,wrongBad:400,missGood:100,missBad:300,bomb:400,cat:150}),
  MAX_MULT:2,
  ORDER_PTS:1500,SHIFT_BONUS:Object.freeze([0,0,3000,5000]),
  BASE_WIN:15000,MAX_WIN:50000,LOSS_MAX:-20000,LOSS_MIN:-5000,
  HEARTS:3,PAUSE_BUDGET:120,
  SPAWN_FIRST:.6,
  GOLD_CHANCE:.15,GOLD_TABLE:Object.freeze([[10000,40],[20000,28],[30000,18],[40000,9],[50000,5]]),
  CPS:Object.freeze([27.5,55,82.5,110,165]),   // checkpoint game-times (s): half shifts before the pass line, then shift changes
  MAX_CPS:8,
  MAX_MS:15*60000,
  SLACK_S:5,
});
const STATS=['good','bad','fake','mimic','bomb','heart','clock','gold','wrong','miss','cat','shoo','lost'];

export const candyShiftAt=t=>Math.min(3,Math.floor(Math.max(0,t)/CANDY.SHIFT_LEN));
export function candyShiftPts(t){let p=0;for(let i=0;i<4;i++)if(t>=(i+1)*CANDY.SHIFT_LEN)p+=CANDY.SHIFT_BONUS[i];return p;}
/* s = {t, pts, orders, bonus} → same numbers on HUD, result screen and server */
export function candyScore(s){
  const C=CANDY,t=+s.t||0,passed=t>=C.PASS_T,fin=t>=C.TOTAL_T;
  if(!passed){const total=r100(C.LOSS_MAX+(C.LOSS_MIN-C.LOSS_MAX)*clamp(t/C.PASS_T,0,1));return {passed,fin,total,base:total,perf:0,orderPts:0,shiftPts:0,bonus:0,capped:false};}
  const pts=Math.round(+s.pts||0),orderPts=(s.orders|0)*C.ORDER_PTS,shiftPts=candyShiftPts(t),bonus=Math.max(0,+s.bonus||0);
  const sum=C.BASE_WIN+pts+orderPts+shiftPts;
  return {passed,fin,total:r100(clamp(sum,C.BASE_WIN,C.MAX_WIN))+bonus,base:C.BASE_WIN,perf:pts,orderPts,shiftPts,bonus,capped:sum>C.MAX_WIN};
}

/* ---------- seeded streams ----------
   spawnGap(t): the ONLY draw of the 'time' stream, made once per candy actually spawned (blocked lanes do not draw).
   type/look/evt: page-only gameplay streams (candy kinds, images, cat/ghost/jolt/order timers). */
export function candySpawnGap(t,r){
  const sh=CANDY.SHIFTS[candyShiftAt(t)],ramp=1-.18*((t%CANDY.SHIFT_LEN)/CANDY.SHIFT_LEN);
  return sh.gap*ramp*uni(r,.8,1.2);
}
export function candyStreams(seed){
  return {time:seededRng(seed,'time'),type:seededRng(seed,'type'),look:seededRng(seed,'look'),evt:seededRng(seed,'evt')};
}
/* Upper bound of candies spawned by game-time t (slow-clock, quiet time and lane blocking only delay real spawns;
   +2 covers the one place the gap shrinks across a shift change). */
export function candySpawnBound(seed,t){
  const r=seededRng(seed,'time'),lim=Math.min(t,CANDY.TOTAL_T)+.5;let n=0;
  for(let f=CANDY.SPAWN_FIRST;f<=lim;){n++;f+=candySpawnGap(f,r);}
  return n+2;
}
/* cats/orders can only start in shift 2+, with minimum gaps (first cat ≥6 s, then ≥14 s; first order ≥5 s, then ≥6 s, each order needs ≥3 sorts) */
const catBound=t=>t<=CANDY.SHIFT_LEN+6?0:Math.floor((t-CANDY.SHIFT_LEN-6)/14)+1;
const orderBound=t=>t<=CANDY.SHIFT_LEN+5?0:Math.floor((t-CANDY.SHIFT_LEN-5)/6)+1;

export function candyStart(rng,now){
  const seed=makeSeed(rng);let goldAt=-1,goldVal=0;
  if(rng()<CANDY.GOLD_CHANCE){
    goldAt=Math.round((CANDY.PASS_T+8+rng()*(CANDY.TOTAL_T-12-CANDY.PASS_T-8))*10)/10;
    let tot=0;CANDY.GOLD_TABLE.forEach(g=>tot+=g[1]);let x=rng()*tot;goldVal=CANDY.GOLD_TABLE[0][0];
    for(const [v,w] of CANDY.GOLD_TABLE){x-=w;if(x<0){goldVal=v;break;}}
  }
  return {game:'candy',seed,goldAt,goldVal,startedAt:now,maxMs:CANDY.MAX_MS,cps:[]};
}

const nInt=(v,max)=>{const n=Number(v);if(!Number.isFinite(n)||n<0||n>max||Math.floor(n)!==n)fail('ข้อมูลผลเกมไม่ถูกต้อง');return n;};
function normReport(rep){
  if(!rep||typeof rep!=='object')fail('ข้อมูลผลเกมไม่ถูกต้อง');
  const t=Number(rep.t),pts=Number(rep.pts);
  if(!Number.isFinite(t)||t<0||t>CANDY.TOTAL_T+.5)fail('เวลาในเกมไม่ถูกต้อง');
  if(!Number.isFinite(pts)||Math.abs(pts)>1e6)fail('แต้มไม่ถูกต้อง');
  const st={},rs=rep.st||{};for(const k of STATS)st[k]=nInt(rs[k]||0,5000);
  return {t:Math.min(CANDY.TOTAL_T,t),pts:Math.round(pts),orders:nInt(rep.orders||0,500),st,gold:rep.gold===true,quit:rep.quit===true};
}
/* most points the reported sorts could possibly be worth (every sort at the ×2 combo) minus the least the reported mistakes cost */
export function candyPtsBound(st){
  const P=CANDY.PTS,M=CANDY.MAX_MULT,plain=Math.max(0,st.good-st.heart-st.clock-st.gold);
  const up=M*(plain*P.good+st.heart*(P.heart+P.heartFull)+st.clock*P.clock+st.bad*P.cursed+(st.fake+st.mimic)*P.fake+st.bomb*P.bomb)+st.shoo*P.shoo;
  const down=st.lost*CANDY.PEN.missBad+Math.max(0,st.wrong-st.lost)*CANDY.PEN.wrongGood+st.cat*CANDY.PEN.cat;
  return up-down;
}
function checkPlausible(round,s,now){
  if(!round||typeof round.seed!=='string'||!Number.isFinite(round.startedAt))fail('รอบโรงงานลูกกวาดไม่ถูกต้อง');
  const elapsed=(now-round.startedAt)/1000,st=s.st;
  if(s.t>elapsed+CANDY.SLACK_S)fail('เวลาในเกมมากกว่าเวลาจริง');
  const resolved=st.good+st.bad+st.fake+st.mimic+st.bomb+st.wrong+st.miss+st.cat;
  if(resolved>candySpawnBound(round.seed,s.t))fail('จำนวนลูกกวาดมากเกินกว่าที่สายพานปล่อยได้');
  if(st.heart+st.clock+st.gold>st.good)fail('ข้อมูลผลเกมไม่ถูกต้อง');
  if(st.lost>CANDY.HEARTS+st.heart)fail('จำนวนหัวใจที่เสียไม่ถูกต้อง');
  if(st.lost>st.wrong+st.miss)fail('จำนวนหัวใจที่เสียไม่ถูกต้อง');
  if(st.cat+st.shoo>catBound(s.t))fail('จำนวนแมวไม่ถูกต้อง');
  if(s.orders>orderBound(s.t)||s.orders*3>st.good)fail('จำนวนออเดอร์มากเกินจริง');
  if(s.pts>candyPtsBound(st)+1)fail('แต้มมากเกินกว่าที่คัดได้จริง');
  if(st.gold>1)fail('ข้อมูลลูกกวาดทองไม่ถูกต้อง');
  if(s.gold||st.gold){
    if(!(round.goldAt>0))fail('รอบนี้ไม่มีลูกกวาดทอง');
    if(s.t<round.goldAt||s.t<CANDY.PASS_T)fail('ยังทำงานไม่ถึงเวลาลูกกวาดทอง');
  }
  const cp=lastCp(round);
  if(cp){
    if(s.t<cp.t-.05||s.orders<(cp.orders|0))fail('ผลเกมย้อนหลังจุดเช็กล่าสุด');
    for(const k of STATS)if(st[k]<(cp.st[k]|0))fail('ผลเกมย้อนหลังจุดเช็กล่าสุด');
    if(cp.gold&&!s.gold)fail('ผลเกมย้อนหลังจุดเช็กล่าสุด');
  }
}
const lastCp=r=>Array.isArray(r&&r.cps)&&r.cps.length?r.cps[r.cps.length-1]:null;

/* cp/report = {t, pts, orders, st:{good,bad,fake,mimic,bomb,heart,clock,gold,wrong,miss,cat,shoo,lost}, gold, quit} */
export function candyCheckpoint(round,cp,now){
  const s=normReport(cp);checkPlausible(round,s,now);
  const keep={t:Math.round(s.t*100)/100,pts:s.pts,orders:s.orders,st:s.st,gold:s.gold,at:now};
  return {...round,cps:[...(round.cps||[]),keep].slice(-CANDY.MAX_CPS)};
}
function result(round,s,extra){
  const bonus=s.gold&&round.goldAt>0?round.goldVal|0:0;
  const sc=candyScore({t:s.t,pts:s.pts,orders:s.orders,bonus});
  return {gain:sc.total,breakdown:{game:'candy',t:Math.round(s.t*10)/10,pts:s.pts,orders:s.orders,st:s.st,gold:!!s.gold,goldVal:round.goldVal|0,
    passed:sc.passed,fin:sc.fin,base:sc.base,perf:sc.perf,orderPts:sc.orderPts,shiftPts:sc.shiftPts,bonus:sc.bonus,capped:sc.capped,total:sc.total,
    quit:!!s.quit,abandoned:false,extraPen:0,...extra}};
}
export function candyFinish(round,report,now){
  if(report&&report.abandon===true)return candyAbandon(round,now);
  const s=normReport(report);checkPlausible(round,s,now);
  return result(round,s);
}
/* Abandoned: settle as if the worker lost every remaining heart right at the last checkpoint (−400 each).
   Before the pass line the score only grows with time, so freezing at the checkpoint is never better than playing on.
   No checkpoint yet (< 27.5 s) ⇒ t=0 ⇒ −20,000 (the worst real outcome). */
export function candyAbandon(round,now){
  const cp=lastCp(round);
  const zero={good:0,bad:0,fake:0,mimic:0,bomb:0,heart:0,clock:0,gold:0,wrong:0,miss:0,cat:0,shoo:0,lost:0};
  if(!cp)return result(round,{t:0,pts:0,orders:0,st:zero,gold:false},{abandoned:true,cp:null});
  const left=clamp(CANDY.HEARTS-(cp.st.lost|0)+(cp.st.heart|0),0,CANDY.HEARTS),extraPen=left*CANDY.PEN.wrongBad;
  return result(round,{t:cp.t,pts:cp.pts-extraPen,orders:cp.orders,st:{...zero,...cp.st},gold:!!cp.gold},{abandoned:true,extraPen,cp:cp.t});
}
