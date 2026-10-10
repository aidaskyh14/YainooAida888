const fail=m=>{throw new Error(m);};
const shuffle=(rng,a)=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export const cardPoints=c=>Math.min(c.r,10);
export const handPoints=h=>h.reduce((s,c)=>s+cardPoints(c),0);
export const kangFeePaid=(r,i)=>Number.isSafeInteger(r.paid?.[i])&&r.paid[i]>0?r.paid[i]:r.fee;
export const freshKang=i=>({open:true,accept:true,base:i===1?50000:10000,fee:4,duration:20000,round:0,state:'waiting',seats:Array(4).fill(null),hands:[[],[],[],[]],deck:[],net:[0,0,0,0],pool:[0,0,0,0],ready:[false,false,false,false],tx:[],hist:[],settled:true});
export function kangPublic(r){const v=structuredClone(r);v.deckCount=r.deck.length;delete v.deck;v.counts=r.hands.map(h=>h.length);if(r.state!=='result')delete v.hands;else v.hands=Object.fromEntries(r.hands.map((h,i)=>[String(i),h]));return v;}
export function kangAction(source,account,ctx,input,rng=Math.random){
 const r=structuredClone(source),game=structuredClone(account);r.duration=20000;game.sub ||= {};const min=game.sub.minigames ||= {escrows:{}};min.escrows ||= {};const slot=()=>r.seats.findIndex(s=>s?.uid===ctx.uid),index=slot();let coins=ctx.coins,refund=0;
 const active=()=>r.seats.map((s,i)=>s&&r.status?.[i]!=='FORFEITED'?i:-1).filter(i=>i>=0),others=p=>active().filter(i=>i!==p);
 const addFeed=s=>{r.feed ||= [];r.feed.unshift(s);r.feed=r.feed.slice(0,5);};
 const transfer=(from,to,amount,reason)=>{const paid=Math.min(amount,r.pool[from]);r.pool[from]-=paid;r.pool[to]+=paid;r.net[from]-=paid;r.net[to]+=paid;r.tx.push({from:r.seats[from].uid,to:r.seats[to].uid,amount:paid,reason,round:r.round,at:ctx.now});r.tx=r.tx.slice(-100);};
 const result=(winner,why,loser=null,mult=1)=>{if(r.state==='result')return;r.state='result';r.lastSeats=structuredClone(r.seats);r.winner=winner;r.reason=why;r.deadline=0;if(loser!==null)others(loser).forEach(to=>transfer(loser,to,r.base*mult,why));else if(winner!==null)others(winner).forEach(from=>transfer(from,winner,r.base*mult,why));r.hist.unshift({round:r.round,winner:winner===null?null:r.seats[winner].name,why,net:[...r.net],at:ctx.now});r.hist=r.hist.slice(0,10);};
 const next=p=>{for(let i=1;i<=4;i++){const n=(p+i)%4;if(active().includes(n))return n;}return p;};
 const canFlow=p=>!r.drawn&&r.last&&r.last.by!==p&&next(r.last.by)===p&&r.hands[p].some(c=>c.r===r.last.cards[0].r);
 const endTurn=()=>{r.turns[r.cur]++;r.turnNo++;r.cur=next(r.cur);r.drawn=false;r.deadline=ctx.now+r.duration;};
 const cards=(p,ids)=>{if(!Array.isArray(ids)||!ids.length||ids.length>4||new Set(ids).size!==ids.length)fail('เลือกไพ่ไม่ถูกต้อง');const found=ids.map(id=>r.hands[p].find(c=>c.id===id));if(found.some(c=>!c)||found.some(c=>c.r!==found[0].r))fail('ไพ่ต้องอยู่ในมือและ Rank เดียวกัน');return found;};
 const discard=(p,ids,flow=false)=>{const cs=cards(p,ids);if(flow){if(!canFlow(p)||cs[0].r!==r.last.cards[0].r)fail('ไหลไม่ได้');const values=[0,.5,1,2,3];transfer(r.last.by,p,r.base*values[cs.length],'FLOW_'+cs.length);}else if(!r.drawn)fail('จั่วก่อนทิ้ง');r.hands[p]=r.hands[p].filter(c=>!ids.includes(c.id));r.last={by:p,cards:cs};addFeed(r.seats[p].name+(flow?' ไหล ':' ทิ้ง ')+cs.length+' ใบ');if(!r.hands[p].length)result(p,'KNOCK',null,2);else endTurn();};
 const draw=p=>{if(r.drawn)fail('จั่วแล้ว');if(!r.deck.length){const list=Array.from({length:4},(_,i)=>(r.cur+i)%4).filter(p=>active().includes(p)),winner=list.reduce((a,b)=>handPoints(r.hands[a])<=handPoints(r.hands[b])?a:b);result(winner,'DECK_OUT');return;}r.hands[p].push(r.deck.pop());r.drawn=true;addFeed(r.seats[p].name+' จั่วไพ่');};
 const auto=()=>{const p=r.cur;r.auto[p]=1;if(canFlow(p)){const rank=r.last.cards[0].r;discard(p,r.hands[p].filter(c=>c.r===rank).map(c=>c.id),true);}else{if(!r.drawn)draw(p);if(r.state==='playing'){const high=Math.max(...r.hands[p].map(cardPoints)),choices=r.hands[p].filter(c=>cardPoints(c)===high),rank=choices[Math.floor(rng()*choices.length)].r;discard(p,r.hands[p].filter(c=>c.r===rank).map(c=>c.id));}}};
 const out=extra=>({room:r,game,coins,refund,...extra});
 const rules=ctx.rules||{fees:{kang:4},emergency:false,off:()=>false},boss=ctx.owner??ctx.admin,EMERGENCY='ขออภัย ระบบปิดฉุกเฉิน แวะมาใหม่โอกาสหน้า';
 // Both rooms open by themselves; the owner's close switch or the emergency switch shuts them. Fee changes apply to the next "ready".
 // Older rooms recorded only one fee for everyone: remember what each ready player actually paid before the fee changes.
 r.paid ||= r.ready.map(x=>x?r.fee:0);r.open=!rules.off('kang');r.accept=r.open;r.fee=rules.fees.kang;
 const paidFee=i=>Number.isSafeInteger(r.paid[i])&&r.paid[i]>0?r.paid[i]:r.fee;
 const applyBase=()=>{if(r.nextBase&&r.state!=='playing'&&!r.ready.some(Boolean)){r.base=r.nextBase;delete r.nextBase;}};
 const voidRound=()=>{if(r.state!=='playing'){r.round++;r.match='kang-'+input.room+'-'+r.round;}r.net.fill(0);r.pool=r.pool.map((v,i)=>r.ready[i]?r.base*8:0);result(null,'VOID');return out();};
 const startRound=()=>{
  r.round++;r.match='kang-'+input.room+'-'+r.round;r.state='playing';r.hands=[[],[],[],[]];r.deck=shuffle(rng,['spade','heart','diamond','club'].flatMap(s=>Array.from({length:13},(_,i)=>({s,r:i+1,id:s+'-'+(i+1)}))));r.net=[0,0,0,0];r.status=['ACTIVE','ACTIVE','ACTIVE','ACTIVE'];r.auto=[0,0,0,0];r.turns=[0,0,0,0];r.turnNo=0;r.cur=r.starter??Math.floor(rng()*4);r.drawn=false;r.last=null;r.feed=[];r.tx=[];r.deadline=ctx.now+r.duration;r.settled=false;
  for(let i=0;i<5;i++)for(let p=0;p<4;p++)r.hands[p].push(r.deck.pop());
  let best=null;r.hands.forEach((h,p)=>{const counts={};h.forEach(c=>counts[c.r]=(counts[c.r]||0)+1);for(const[rank,n]of Object.entries(counts))if(n>=3){const score=(n===4?100:0)+Number(rank);if(!best||score>best.score)best={p,n,score};}});
  if(best)result(best.p,best.n===4?'OPEN_FOUR':'OPEN_TRIPLE',null,best.n===4?3:2); };
 if(rules.emergency&&r.state!=='result'){if(r.state==='playing'||r.ready.some(Boolean))return voidRound();if(r.seats.some(Boolean))r.seats=r.seats.map(()=>null);}
 if(input.type==='configure'){
  // Open/close and fee live in world/minigames (handled by the cloud handler). A new base waits until nobody holds a stake.
  if(!boss)fail('เฉพาะเจ้าของแผงควบคุม');
  if(input.base!==undefined){if(![1000,5000,10000,50000].includes(input.base))fail('ค่าฐานไม่ถูกต้อง');if(r.state==='playing'||r.ready.some(Boolean))r.nextBase=input.base;else{r.base=input.base;delete r.nextBase;}}
  return out();
 }
 if(input.type==='void'){if(!boss)fail('เฉพาะเจ้าของแผงควบคุม');if(r.state!=='playing'&&!r.ready.some(Boolean))fail('ไม่มีรอบที่ยุติได้');return voidRound();}
 if(input.type==='status')return out({mine:index>=0?r.hands[index]:[]});
 if(input.type==='join'){
  if(rules.emergency)fail(EMERGENCY);if(!r.open)fail('ห้องปิดชั่วคราว');if(r.state==='playing')fail('ห้องยังไม่รับผู้เล่น');if(index>=0)return out();const free=r.seats.indexOf(null);if(free<0)fail('ห้องเต็ม 4 คน');r.seats[free]={uid:ctx.uid,name:ctx.name};return out();
 }
 if(index<0&&!['start','advance'].includes(input.type))fail('คุณไม่ได้อยู่ในห้องนี้');
 if(input.type==='leave'){
  if(r.state==='playing')fail('ออกจากหน้าได้ หรือกดยอมแพ้เพื่อออกจากรอบ');if(r.ready[index]&&!r.settled){refund=r.pool[index];game.merit=(game.merit||0)+refund;coins+=paidFee(index);r.pool[index]=0;r.ready[index]=false;r.paid[index]=0;delete min.escrows['kang-'+input.room];}r.seats[index]=null;applyBase();return out();
 }
 if(input.type==='ready'){
  if(rules.emergency)fail(EMERGENCY);if(!r.open||r.state==='playing')fail('ห้องยังไม่พร้อม');if(r.ready[index]&&r.state!=='result')return out();if(r.state==='result'&&!r.settled)fail('รอระบบส่งผลรอบเดิม');if(coins<r.fee||(game.merit||0)<r.base*8)fail('ต้องมีเหรียญค่าเข้าและกุศลอย่างน้อย 8 เท่าค่าฐาน');if(r.state==='result'){r.state='waiting';r.ready.fill(false);r.pool.fill(0);r.net.fill(0);r.paid=[0,0,0,0];}applyBase();if(coins<r.fee||(game.merit||0)<r.base*8)fail('ต้องมีเหรียญค่าเข้าและกุศลอย่างน้อย 8 เท่าค่าฐาน');coins-=r.fee;r.paid[index]=r.fee;game.merit-=r.base*8;r.match='kang-'+input.room+'-'+(r.round+1);r.pool[index]=r.base*8;r.ready[index]=true;r.settled=false;min.escrows['kang-'+input.room]={round:r.round+1,merit:r.base*8};
  // The round starts by itself once four real players have all reserved their stake.
  if(r.seats.every(Boolean)&&r.ready.every(Boolean))startRound();return out();
 }
 if(input.type==='start'){
  if(!boss)fail('เฉพาะเจ้าของแผงควบคุม');if(r.state==='playing'||r.seats.some(s=>!s)||r.ready.some(v=>!v))fail('ต้องมีผู้เล่นจริงครบ 4 คนและพร้อมทุกคน');
  startRound();return out();
 }
 if(r.state!=='playing')fail('รอบนี้จบแล้ว');
 if(input.round!==r.round||input.turn!==r.turnNo)fail('รายการข้ามรอบหรือตาเก่า กรุณาดูโต๊ะล่าสุด');
 if(ctx.now>=r.deadline){auto();return out({late:true});}
 if(input.type==='advance')return out();
 if(input.type==='forfeit'){
  if(r.status[index]==='FORFEITED')fail('ยอมแพ้แล้ว');others(index).forEach(to=>transfer(index,to,r.base,'FORFEIT'));r.status[index]='FORFEITED';addFeed(ctx.name+' ยอมแพ้');if(active().length===1)result(active()[0],'LAST_PLAYER');else if(r.cur===index)endTurn();return out();
 }
 if(r.cur!==index)fail('ยังไม่ใช่ตาของคุณ');r.auto[index]=0;
 if(input.type==='draw')draw(index);
 else if(input.type==='discard')discard(index,input.cards);
 else if(input.type==='flow')discard(index,input.cards,true);
 else if(input.type==='kang'){
  if(r.drawn)fail('แคงได้ก่อนจั่วเท่านั้น');const low=Math.min(...active().map(p=>handPoints(r.hands[p]))),mult=r.turns[index]===0?2:1;if(handPoints(r.hands[index])===low)result(index,'KANG',null,mult);else result(null,'KANG_FAIL',index,mult);
 }else fail('รายการไม่ถูกต้อง');return out();
}
