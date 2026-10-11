/* แม่มดซิ่งไม้กวาด — shared rules (Cloud Functions + witch-game.js).
   Pure ES module: no DOM, no Firebase. The page uses the same scoring function and the same seeded
   item streams, so the numbers the player sees are exactly what the server pays.
   The server never runs per frame: start → (≤6 checkpoints) → finish; the finish report is re-scored here
   and rejected if it is physically impossible for the seed and the real elapsed time. */
const fail=m=>{throw new Error(m);};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const uni=(r,a,b)=>a+r()*(b-a);
const r100=v=>Math.round(v/100)*100;

/* ---------- seeded PRNG (xmur3 hash → mulberry32). Same seed + same sub-stream name ⇒ same numbers everywhere. ---------- */
export function hashSeed(str){
  let h=1779033703^str.length;
  for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}
  h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return (h^=h>>>16)>>>0;
}
export function seededRng(seed,sub=''){
  let a=hashSeed(String(seed)+'|'+sub);
  return ()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
}
export function makeSeed(rng,len=12){const A='abcdefghijklmnopqrstuvwxyz0123456789';let s='';for(let i=0;i<len;i++)s+=A[Math.floor(rng()*36)%36];return s;}

/* ---------- constants ---------- */
export const WITCH=Object.freeze({
  id:'witch',
  GOAL:20000,MIN_LINE:3000,FLOOR_AT:600,PASS_FLOOR:5000,
  DIST_LOSS:-60000,DIST_NEAR:-5000,DIST_PASS:10000,DIST_GOAL:50000,
  ITEM_CAP:30000,BONUS:30000,MAX_WIN:80000,MAX_LOSS:-60000,
  HEARTS:3,PAUSE_BUDGET:120,
  ZONES:Object.freeze([
    {from:0,to:3000,v0:28,v1:34,obs:['meteor','bat']},
    {from:3000,to:6000,v0:34,v1:40,obs:['meteor','bat','storm']},
    {from:6000,to:10000,v0:40,v1:46,obs:['meteor','bat','storm','pumpkin']},
    {from:10000,to:15000,v0:46,v1:52,obs:['meteor','bat','storm','pumpkin','comet']},
    {from:15000,to:20000,v0:52,v1:58,obs:['meteor','bat','storm','pumpkin','comet']}]),
  PEN:Object.freeze({meteor:2000,bat:1500,storm:1500,pumpkin:2500,comet:3000}),
  BAT_STEAL:5,
  PTS:Object.freeze({star:200,candy:500,corn:500,moon:3000}),
  GOLD_CHANCE:.1,GOLD_FROM:6000,GOLD_TO:14000,
  ITEM_FIRST:.6,
  CPS:Object.freeze([1000,2000,3000,6000,10000,15000]),   // checkpoint distances (m) — page sends one when passing each
  MAX_CPS:8,
  MAX_MS:30*60000,          // after this the parent/server may settle the round as abandoned
  SLACK_S:5,                // seconds of clock slack (network / timer jitter)
});
const OBS=Object.keys(WITCH.PEN),ITEMS=Object.keys(WITCH.PTS);

/* ---------- scoring (the page calls this every frame for the HUD) ----------
   s = {d, c:{star,candy,corn,moon}, hits:{meteor,...} | pen, gold:boolean} */
export function witchPen(hits){let p=0;for(const k of OBS)p+=(hits&&hits[k]|0)*WITCH.PEN[k];return p;}
export function witchScore(s){
  const W=WITCH,d=+s.d||0,c=s.c||{};
  const passed=d>=W.MIN_LINE,fin=d>=W.GOAL;
  const dist=fin?W.DIST_GOAL:passed?W.DIST_PASS+(d-W.MIN_LINE)/(W.GOAL-W.MIN_LINE)*(W.DIST_GOAL-W.DIST_PASS)
    :d<=W.FLOOR_AT?W.DIST_LOSS:W.DIST_LOSS+(d-W.FLOOR_AT)/(W.MIN_LINE-W.FLOOR_AT)*(W.DIST_NEAR-W.DIST_LOSS);
  const raw=(c.star|0)*W.PTS.star+(c.candy|0)*W.PTS.candy+(c.corn|0)*W.PTS.corn+(c.moon|0)*W.PTS.moon;
  const items=passed?Math.min(W.ITEM_CAP,raw):0;
  const pen=s.pen!=null?s.pen:witchPen(s.hits);
  const bonus=passed&&s.gold?W.BONUS:0;
  const total=r100(clamp(dist+items-pen,passed?W.PASS_FLOOR:W.MAX_LOSS,W.MAX_WIN))+bonus;
  return {passed,fin,dist:r100(dist),raw,items,pen,bonus,total};
}

/* ---------- seeded streams shared by page and server ----------
   Each timer owns its own sub-stream, so frame timing can never reorder draws between timers.
   item(): one star row (+ maybe a candy/corn) · moon(): one moon · ob/curve/pow/gold: page-only gameplay streams. */
export function witchStreams(seed){
  const ri=seededRng(seed,'item'),rm=seededRng(seed,'moon');
  return {
    ob:seededRng(seed,'ob'),curve:seededRng(seed,'curve'),pow:seededRng(seed,'pow'),gold:seededRng(seed,'gold'),
    item(){const gap=uni(ri,1.1,1.8),n=Math.floor(uni(ri,3,6)),x0=uni(ri,-.8,.8),dx=uni(ri,-.12,.12);let extra=null;
      if(ri()<.35){const kind=ri()<.5?'candy':'corn';extra={kind,x:uni(ri,-.9,.9)};}return {gap,n,x0,dx,extra};},
    moonFirst(){return uni(rm,18,30);},
    moon(){return {gap:uni(rm,22,34),x:uni(rm,-.85,.85)};},
  };
}
/* Upper bound of collectable items by game-time t (the page's timers only ever fire later than this, never earlier). */
export function witchItemBound(seed,t){
  const st=witchStreams(seed),lim=t+.5,out={star:0,candy:0,corn:0,moon:0};
  for(let f=WITCH.ITEM_FIRST;f<=lim;){const g=st.item();out.star+=g.n;if(g.extra)out[g.extra.kind]++;f+=g.gap;}
  for(let f=st.moonFirst();f<=lim;){out.moon++;f+=st.moon().gap;}
  return out;
}
/* Farthest distance reachable in game-time t (exact solution of dd/dt=v(d); the page's Euler steps are always ≤ this). */
export function witchDistMax(t){
  let left=Math.max(0,+t||0),d=0;
  for(const z of WITCH.ZONES){
    const k=(z.v1-z.v0)/(z.to-z.from),tz=Math.log(z.v1/z.v0)/k;
    if(left<=tz)return Math.min(WITCH.GOAL,z.from+z.v0/k*(Math.exp(k*left)-1));
    left-=tz;d=z.to;
  }
  return Math.min(WITCH.GOAL,d);
}
export function witchTimeToGoal(){let t=0;for(const z of WITCH.ZONES){const k=(z.v1-z.v0)/(z.to-z.from);t+=Math.log(z.v1/z.v0)/k;}return t;}
export const witchZoneAt=d=>{let i=0;WITCH.ZONES.forEach((z,k)=>{if(d>=z.from)i=k;});return i;};

/* ---------- round lifecycle ---------- */
export function witchStart(rng,now){
  const seed=makeSeed(rng);
  const goldAt=rng()<WITCH.GOLD_CHANCE?Math.round(WITCH.GOLD_FROM+rng()*(WITCH.GOLD_TO-WITCH.GOLD_FROM)):-1;
  return {game:'witch',seed,goldAt,startedAt:now,maxMs:WITCH.MAX_MS,cps:[]};
}
const nInt=(v,max)=>{const n=Number(v);if(!Number.isFinite(n)||n<0||n>max||Math.floor(n)!==n)fail('ข้อมูลผลเกมไม่ถูกต้อง');return n;};
function normReport(rep){
  if(!rep||typeof rep!=='object')fail('ข้อมูลผลเกมไม่ถูกต้อง');
  const d=Number(rep.d),t=Number(rep.t);
  if(!Number.isFinite(d)||d<0||d>WITCH.GOAL+1)fail('ระยะทางไม่ถูกต้อง');
  if(!Number.isFinite(t)||t<0||t>4*3600)fail('เวลาในเกมไม่ถูกต้อง');
  const c={},hits={},rc=rep.c||{},rh=rep.hits||{};
  for(const k of ITEMS)c[k]=nInt(rc[k]||0,5000);
  for(const k of OBS)hits[k]=nInt(rh[k]||0,WITCH.HEARTS);
  for(const k of Object.keys(rh))if(!OBS.includes(k))fail('ข้อมูลการชนไม่ถูกต้อง');
  return {d:Math.min(WITCH.GOAL,d),t,c,hits,gold:rep.gold===true,quit:rep.quit===true};
}
const hitTotal=h=>OBS.reduce((a,k)=>a+(h[k]|0),0);
/* Throws a Thai Error when the stats cannot come from a real run of this round. */
function checkPlausible(round,s,now){
  if(!round||typeof round.seed!=='string'||!Number.isFinite(round.startedAt))fail('รอบแม่มดซิ่งไม่ถูกต้อง');
  const elapsed=(now-round.startedAt)/1000;
  if(s.t>elapsed+WITCH.SLACK_S)fail('เวลาในเกมมากกว่าเวลาจริง');
  if(s.d>witchDistMax(s.t)*1.01+25)fail('ระยะทางไกลเกินกว่าที่บินได้ในเวลานี้');
  if(hitTotal(s.hits)>WITCH.HEARTS)fail('จำนวนการชนเกินหัวใจที่มี');
  // obstacles only exist from their zone onwards
  for(const k of OBS)if(s.hits[k]&&!WITCH.ZONES.some(q=>q.from<=s.d&&q.obs.includes(k)))fail('ข้อมูลการชนไม่ตรงกับช่วงที่บินถึง');
  const b=witchItemBound(round.seed,s.t);
  for(const k of ITEMS)if(s.c[k]>b[k])fail('จำนวนของที่เก็บมากเกินกว่าที่เกิดขึ้นจริง');
  if(s.gold&&!(round.goldAt>0))fail('รอบนี้ไม่มีดาวหางทอง');
  if(s.gold&&s.d<round.goldAt)fail('ยังบินไม่ถึงจุดดาวหางทอง');
  const cp=lastCp(round);
  if(cp){
    if(s.d<cp.d-1||s.t<cp.t-.05)fail('ผลเกมย้อนหลังจุดเช็กล่าสุด');
    for(const k of OBS)if(s.hits[k]<(cp.hits[k]|0))fail('ผลเกมย้อนหลังจุดเช็กล่าสุด');
    for(const k of ['candy','corn','moon'])if(s.c[k]<(cp.c[k]|0))fail('ผลเกมย้อนหลังจุดเช็กล่าสุด');
    if(cp.gold&&!s.gold)fail('ผลเกมย้อนหลังจุดเช็กล่าสุด');
  }
}
const lastCp=r=>Array.isArray(r&&r.cps)&&r.cps.length?r.cps[r.cps.length-1]:null;

/* cp = same shape as the finish report ({d,t,c,hits,gold}). Returns a NEW round with the cp appended (last MAX_CPS kept). */
export function witchCheckpoint(round,cp,now){
  const s=normReport(cp);checkPlausible(round,s,now);
  const keep={d:Math.floor(s.d),t:Math.round(s.t*100)/100,c:s.c,hits:s.hits,gold:s.gold,at:now};
  return {...round,cps:[...(round.cps||[]),keep].slice(-WITCH.MAX_CPS)};
}
function result(s,extra){
  const sc=witchScore(s);
  return {gain:sc.total,breakdown:{game:'witch',d:Math.round(s.d),t:Math.round(s.t*10)/10,c:s.c,hits:s.hits,gold:!!s.gold,
    passed:sc.passed,fin:sc.fin,dist:sc.dist,raw:sc.raw,items:sc.items,pen:sc.pen,bonus:sc.bonus,total:sc.total,quit:!!s.quit,abandoned:false,extraPen:0,...extra}};
}
/* report = {d,t,c,hits,gold,quit} · report {abandon:true} = player chose to close a stuck round → witchAbandon. */
export function witchFinish(round,report,now){
  if(report&&report.abandon===true)return witchAbandon(round,now);
  const s=normReport(report);checkPlausible(round,s,now);
  return result(s);
}
/* Worst single hit at distance d (bat = penalty + up to 5 stolen stars). */
export function witchWorstHit(d){
  const z=WITCH.ZONES[witchZoneAt(d)];let w=0;
  for(const k of z.obs)w=Math.max(w,WITCH.PEN[k]+(k==='bat'?WITCH.BAT_STEAL*WITCH.PTS.star:0));return w;
}
/* Abandoned (tab closed / timed out): settle as if the witch crashed right at the last checkpoint, losing every
   remaining heart to the worst obstacle of that zone. No checkpoint yet (< 1,000 m) ⇒ d=0 ⇒ the floor (−60,000),
   which equals the worst real outcome there, so closing the page is never better than playing on. */
export function witchAbandon(round,now){
  const cp=lastCp(round);
  if(!cp)return result({d:0,t:0,c:{star:0,candy:0,corn:0,moon:0},hits:{},gold:false},{abandoned:true,cp:null});
  const left=Math.max(0,WITCH.HEARTS-hitTotal(cp.hits||{})),extraPen=left*witchWorstHit(cp.d);
  const s={d:cp.d,t:cp.t,c:{...cp.c},hits:{...cp.hits},gold:!!cp.gold};
  const sc=witchScore({...s,pen:witchPen(s.hits)+extraPen});
  const base=result(s,{abandoned:true,extraPen,cp:cp.d});
  base.gain=sc.total;Object.assign(base.breakdown,{pen:sc.pen,total:sc.total,items:sc.items,dist:sc.dist,bonus:sc.bonus});
  return base;
}
