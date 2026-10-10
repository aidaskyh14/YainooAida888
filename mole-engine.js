/* ฮาโลวีนวุ่น ตุ่นบุกสวน! — server rules. The client only animates what this round object says. */
const fail=m=>{throw new Error(m);};
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1)),pick=(r,a)=>a[Math.floor(r()*a.length)],uni=(r,a,b)=>a+r()*(b-a);
export const MOLE_TYPES=['pumpkin','vampire','ghost','witch','mummy','devil'];
export const MOLE={cost:2,minMerit:15000,cooldown:15*60000,length:60000,golds:7,goldNeed:6,win:75000,bonus:50000,lose:-15000,near:.8,easyChance:.12,holes:12};
export function moleRound(rng,now,id){
  const order=[...MOLE_TYPES];for(let i=order.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  const values={},roles={};order.forEach((t,i)=>{const role=i===0?'gold':i<3?'cursed':'normal';roles[t]=role;values[t]=role==='gold'?int(rng,40,60)*100:role==='cursed'?-int(rng,30,50)*100:int(rng,8,20)*100;});
  const gold=order[0],curses=order.slice(1,3),normals=order.slice(3),raw=[];
  for(let t=.6;t<59.2;){const f=t/60;raw.push({at:t,up:1.25-.85*f,type:rng()<.28?pick(rng,curses):pick(rng,normals)});t+=(1.25-.88*f)*uni(rng,.7,1.3);}
  for(let i=0;i<MOLE.golds;i++){const at=uni(rng,3+i*(52/MOLE.golds),3+(i+1)*(52/MOLE.golds));raw.push({at,up:(1.25-.85*at/60)*.6,type:gold});}
  raw.sort((a,b)=>a.at-b.at);
  // one mole per hole at a time; a pop with no free hole is dropped (gold moles take priority by moving the queue)
  const free=Array(MOLE.holes).fill(0),pops=[];
  for(const p of raw){const at=Math.round(p.at*1000),up=Math.round(p.up*1000),open=free.map((t,h)=>t<=at?h:-1).filter(h=>h>=0);if(!open.length)continue;const hole=pick(rng,open);free[hole]=at+up+350;pops.push({i:pops.length,at,up,type:p.type,hole});}
  const max=pops.reduce((s,p)=>s+Math.max(0,values[p.type]),0),easy=rng()<MOLE.easyChance,target=easy?int(rng,25,35)*1000:Math.round(max*uni(rng,.55,.65)/1000)*1000;
  return {id,phase:'active',start:now,until:now+MOLE.length,values,roles,gold,pops,target,easy,goldTotal:pops.filter(p=>p.type===gold).length,hit:[],score:0,golds:0};
}
/* hits: [{i,t}] t = ms since start. Each pop counts once and only while it is out of its hole. */
export function moleHits(r,hits,now){
  if(!r||r.phase!=='active')fail('รอบตีตุ่นไม่ถูกต้อง');if(!Array.isArray(hits)||!hits.length||hits.length>60)fail('รายการตีไม่ถูกต้อง');
  if(now>r.until+15000)fail('หมดเวลาส่งผลการตีแล้ว');
  for(const h of hits){const p=r.pops[h?.i];const t=h?.t;if(!p||!Number.isFinite(t)||t<0||t>MOLE.length+300||t>now-r.start+1500)fail('การตีไม่ถูกต้อง');
    if(r.hit.includes(p.i))continue;if(t<p.at+60||t>p.at+p.up+150)continue;
    r.hit.push(p.i);r.score+=r.values[p.type];if(p.type===r.gold)r.golds++;}
  return r;
}
export function moleResult(r){const pass=r.score>=r.target,bonus=pass&&r.golds>=MOLE.goldNeed,near=!pass&&r.score>=r.target*MOLE.near;return {pass,bonus,near,merit:pass?MOLE.win+(bonus?MOLE.bonus:0):near?0:MOLE.lose};}
