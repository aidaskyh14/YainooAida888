/* จัดตะกร้าให้แม่มด — server rules. Witch 0 (left) is always the easiest order, witch 2 (right) the hardest. */
const fail=m=>{throw new Error(m);};
const int=(r,a,b)=>a+Math.floor(r()*(b-a+1)),pick=(r,a)=>a[Math.floor(r()*a.length)],uni=(r,a,b)=>a+r()*(b-a);
const shuffle=(r,a)=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export const BASKET={cost:6,minMerit:20000,cooldown:15*60000,length:30000,grace:2500,items:30,slots:30,maxPieces:18,
  all:{base:30000,perSecond:1500,cap:50000,jackpot:100000,jackpotSeconds:{easy:25,mid:21,hard:17}},
  two:{'1,2':15000,'0,2':8000,'0,1':3000},one:{2:-10000,1:-12000,0:-15000},none:-20000};
export function basketRound(rng,now,id){
  const tier=pick(rng,['easy','mid','mid','hard','hard']);
  const sizes={easy:[[2,4],[2,4],[3,5]],mid:[[2,5],[3,6],[4,8]],hard:[[3,6],[5,8],[6,10]]}[tier].map(([a,b])=>int(rng,a,b));
  let total=sizes.reduce((a,b)=>a+b,0);while(total>BASKET.maxPieces){const i=sizes.indexOf(Math.max(...sizes));sizes[i]--;total--;}
  sizes.sort((a,b)=>a-b);
  const pool=shuffle(rng,[...Array(BASKET.items).keys()]);let p=0;
  const orders=sizes.map(sz=>{const kinds=Math.min(5,Math.max(1,int(rng,Math.ceil(sz/3),Math.min(5,sz))));const ids=pool.slice(p,p+kinds);p+=kinds;const need={};ids.forEach(x=>need[x]=1);for(let i=kinds;i<sz;i++)need[pick(rng,ids)]++;return need;});
  const pieces=[];orders.forEach(o=>Object.entries(o).forEach(([x,n])=>{for(let i=0;i<n;i++)pieces.push(+x);}));
  const used=[...new Set(pieces)];const want=Math.min(BASKET.slots,Math.max(24,pieces.length+8));while(pieces.length<want)pieces.push(rng()<.45?pick(rng,used):pool[int(rng,p,BASKET.items-1)]);
  const slots=shuffle(rng,[...Array(BASKET.slots).keys()]);
  const kinds=tier==='easy'?[]:shuffle(rng,['bats','candle','wind']).slice(0,tier==='mid'?1:2);
  const events=kinds.map((k,i)=>({k,at:Math.round((i===0?uni(rng,7,12):uni(rng,16,22))*1000)}));
  return {id,phase:'active',tier,start:now,until:now+BASKET.length,orders,pieces:shuffle(rng,pieces).map((x,i)=>({id:x,slot:slots[i]})),events,shadowList:tier==='hard'?int(rng,0,2):-1,sent:[null,null,null]};
}
export function basketSend(r,witch,items,now){
  if(!r||r.phase!=='active')fail('รอบจัดตะกร้าไม่ถูกต้อง');if(![0,1,2].includes(witch))fail('แม่มดไม่ถูกต้อง');if(r.sent[witch])fail('ส่งตะกร้านี้ไปแล้ว');
  if(now>r.until+BASKET.grace)fail('หมดเวลาแล้ว');if(!items||typeof items!=='object'||Array.isArray(items))fail('ตะกร้าไม่ถูกต้อง');
  const got={};for(const [k,n] of Object.entries(items)){const x=Number(k);if(!Number.isInteger(x)||x<0||x>=BASKET.items||!Number.isInteger(n)||n<1||n>BASKET.slots)fail('ของในตะกร้าไม่ถูกต้อง');got[x]=n;}
  // pieces must exist on the table and not already be in a basket that was sent
  const left={};r.pieces.forEach(p=>left[p.id]=(left[p.id]||0)+1);r.sent.forEach(s=>s&&Object.entries(s.items).forEach(([k,n])=>left[k]-=n));
  for(const [k,n] of Object.entries(got))if((left[k]||0)<n)fail('ของบนโต๊ะไม่พอ');
  const need=r.orders[witch],keys=new Set([...Object.keys(need),...Object.keys(got)]),ok=[...keys].every(k=>(need[k]||0)===(got[k]||0));
  r.sent[witch]={ok,items:got,at:Math.min(now,r.until)-r.start};return r;
}
export function basketResult(r){
  const ok=r.sent.map(s=>!!s?.ok),n=ok.filter(Boolean).length,A=BASKET.all;
  if(n===3){const left=Math.max(0,(BASKET.length-Math.max(...r.sent.map(s=>s.at)))/1000);if(left>=A.jackpotSeconds[r.tier])return {ok,n,left,jackpot:true,merit:A.jackpot};return {ok,n,left,jackpot:false,merit:Math.min(A.cap,A.base+Math.round(left*A.perSecond/1000)*1000)};}
  if(n===2)return {ok,n,merit:BASKET.two[ok.map((v,i)=>v?i:-1).filter(i=>i>=0).join(',')]};
  if(n===1)return {ok,n,merit:BASKET.one[ok.indexOf(true)]};
  return {ok,n,merit:BASKET.none};
}
