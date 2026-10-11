const fail=m=>{throw new Error(m);};
const shuffle=(rng,a)=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
/* fix13 room flow (server clock only): sit → ready within 60 s or the seat is freed → 4 ready = 10 s countdown → play
   → result shown 30 s → the room is cleared to 0/4. Clients only call a cheap 'tick' when one of these deadlines passes. */
export const KANG={readyMs:60000,countdownMs:10000,resultMs:30000,turnMs:20000,rounds:3,restMs:10*60000};
export const cardPoints=c=>Math.min(c.r,10);
export const handPoints=h=>h.reduce((s,c)=>s+cardPoints(c),0);
export const kangFeePaid=(r,i)=>r.feeRec?.[i]&&Number.isSafeInteger(r.paid?.[i])?r.paid[i]:Number.isSafeInteger(r.paid?.[i])&&r.paid[i]>0?r.paid[i]:r.fee;
/* Rounds readied before fix13 recorded coins only: no items to give back for them. */
export const kangItemsPaid=(r,i)=>({hat:Number.isSafeInteger(r.paidHat?.[i])?r.paidHat[i]:0,mb:Number.isSafeInteger(r.paidMb?.[i])?r.paidMb[i]:0});
export const freshKang=i=>({open:true,accept:true,base:i===1?50000:10000,fee:4,duration:KANG.turnMs,round:0,state:'waiting',seats:Array(4).fill(null),seatAt:[0,0,0,0],hands:[[],[],[],[]],deck:[],net:[0,0,0,0],pool:[0,0,0,0],ready:[false,false,false,false],paid:[0,0,0,0],feeRec:[false,false,false,false],paidHat:[0,0,0,0],paidMb:[0,0,0,0],tx:[],hist:[],settled:true});
/* Empty table: nobody seated, no cards, no stakes. Only called once every stake has been settled or refunded. */
export function kangClear(r){Object.assign(r,{state:'waiting',seats:Array(4).fill(null),seatAt:[0,0,0,0],hands:[[],[],[],[]],deck:[],net:[0,0,0,0],pool:[0,0,0,0],ready:[false,false,false,false],paid:[0,0,0,0],paidHat:[0,0,0,0],paidMb:[0,0,0,0],tx:[],feed:[],last:null,settled:true,drawn:false});
 for(const k of ['startAt','endAt','lastSeats','winner','reason','status','auto','turns','turnNo','cur','deadline','clearAfter'])delete r[k];return r;}
export function kangPublic(r){const v=structuredClone(r);v.deckCount=r.deck.length;delete v.deck;v.counts=r.hands.map(h=>h.length);if(r.state!=='result')delete v.hands;else v.hands=Object.fromEntries(r.hands.map((h,i)=>[String(i),h]));delete v.lastSeats;return v;}
export function kangAction(source,account,ctx,input,rng=Math.random){
 const r=structuredClone(source),game=structuredClone(account);r.duration=KANG.turnMs;game.sub ||= {};const min=game.sub.minigames ||= {escrows:{}};min.escrows ||= {};let coins=ctx.coins,refund=0;
 r.seatAt ||= [0,0,0,0];r.paidHat ||= [0,0,0,0];r.paidMb ||= [0,0,0,0];delete r.lastSeats;
 const slot=()=>r.seats.findIndex(s=>s?.uid===ctx.uid);
 const active=()=>r.seats.map((s,i)=>s&&r.status?.[i]!=='FORFEITED'?i:-1).filter(i=>i>=0),others=p=>active().filter(i=>i!==p);
 const addFeed=s=>{r.feed ||= [];r.feed.unshift(s);r.feed=r.feed.slice(0,5);};
 const transfer=(from,to,amount,reason)=>{const paid=Math.min(amount,r.pool[from]);r.pool[from]-=paid;r.pool[to]+=paid;r.net[from]-=paid;r.net[to]+=paid;r.tx.push({from:r.seats[from].uid,to:r.seats[to].uid,amount:paid,reason,round:r.round,at:ctx.now});r.tx=r.tx.slice(-100);};
 const result=(winner,why,loser=null,mult=1)=>{if(r.state==='result')return;r.state='result';r.endAt=ctx.now+KANG.resultMs;r.winner=winner;r.reason=why;r.deadline=0;delete r.startAt;if(loser!==null)others(loser).forEach(to=>transfer(loser,to,r.base*mult,why));else if(winner!==null)others(winner).forEach(from=>transfer(from,winner,r.base*mult,why));r.hist.unshift({round:r.round,winner:winner===null?null:r.seats[winner].name,why,net:[...r.net],at:ctx.now});r.hist=r.hist.slice(0,10);};
 const next=p=>{for(let i=1;i<=4;i++){const n=(p+i)%4;if(active().includes(n))return n;}return p;};
 const canFlow=p=>!r.drawn&&r.last&&r.last.by!==p&&next(r.last.by)===p&&r.hands[p].some(c=>c.r===r.last.cards[0].r);
 const endTurn=()=>{r.turns[r.cur]++;r.turnNo++;r.cur=next(r.cur);r.drawn=false;r.deadline=ctx.now+r.duration;};
 const cards=(p,ids)=>{if(!Array.isArray(ids)||!ids.length||ids.length>4||new Set(ids).size!==ids.length)fail('เลือกไพ่ไม่ถูกต้อง');const found=ids.map(id=>r.hands[p].find(c=>c.id===id));if(found.some(c=>!c)||found.some(c=>c.r!==found[0].r))fail('ไพ่ต้องอยู่ในมือและ Rank เดียวกัน');return found;};
 const discard=(p,ids,flow=false)=>{const cs=cards(p,ids);if(flow){if(!canFlow(p)||cs[0].r!==r.last.cards[0].r)fail('ไหลไม่ได้');const values=[0,.5,1,2,3];transfer(r.last.by,p,r.base*values[cs.length],'FLOW_'+cs.length);}else if(!r.drawn)fail('จั่วก่อนทิ้ง');r.hands[p]=r.hands[p].filter(c=>!ids.includes(c.id));r.last={by:p,cards:cs};addFeed(r.seats[p].name+(flow?' ไหล ':' ทิ้ง ')+cs.length+' ใบ');if(!r.hands[p].length)result(p,'KNOCK',null,2);else endTurn();};
 const draw=p=>{if(r.drawn)fail('จั่วแล้ว');if(!r.deck.length){const list=Array.from({length:4},(_,i)=>(r.cur+i)%4).filter(p=>active().includes(p)),winner=list.reduce((a,b)=>handPoints(r.hands[a])<=handPoints(r.hands[b])?a:b);result(winner,'DECK_OUT');return;}r.hands[p].push(r.deck.pop());r.drawn=true;addFeed(r.seats[p].name+' จั่วไพ่');};
 const auto=()=>{const p=r.cur;r.auto[p]=1;if(canFlow(p)){const rank=r.last.cards[0].r;discard(p,r.hands[p].filter(c=>c.r===rank).map(c=>c.id),true);}else{if(!r.drawn)draw(p);if(r.state==='playing'){const high=Math.max(...r.hands[p].map(cardPoints)),choices=r.hands[p].filter(c=>cardPoints(c)===high),rank=choices[Math.floor(rng()*choices.length)].r;discard(p,r.hands[p].filter(c=>c.r===rank).map(c=>c.id));}}};
 let late=false,cleared=false;
 const out=extra=>({room:r,game,coins,refund,late,cleared,...extra});
 const rules=ctx.rules||{fees:{kang:4},fee3:{kang:{coin:4,hat:20,mb:20}},emergency:false,off:()=>false},boss=ctx.owner??ctx.admin,EMERGENCY='ขออภัย ระบบปิดฉุกเฉิน แวะมาใหม่โอกาสหน้า';
 const fee3=rules.fee3?.kang||{coin:rules.fees?.kang??4,hat:0,mb:0};
 // Both rooms open by themselves; the owner's close switch or the emergency switch shuts them. Fee changes apply to the next "ready".
 r.paid ||= r.ready.map(x=>x?r.fee:0);r.open=!rules.off('kang');r.accept=r.open;r.fee=fee3.coin;r.fee3={...fee3};
 const paidFee=i=>kangFeePaid(r,i);
 const applyBase=()=>{if(r.nextBase&&r.state==='waiting'&&!r.ready.some(Boolean)){r.base=r.nextBase;delete r.nextBase;}};
 const voidRound=()=>{if(r.state!=='playing'){r.round++;r.match='kang-'+input.room+'-'+r.round;}r.net.fill(0);r.pool=r.pool.map((v,i)=>r.ready[i]?r.base*8:0);result(null,'VOID');};
 const startRound=()=>{
  r.round++;r.match='kang-'+input.room+'-'+r.round;r.state='playing';delete r.startAt;r.hands=[[],[],[],[]];r.deck=shuffle(rng,['spade','heart','diamond','club'].flatMap(s=>Array.from({length:13},(_,i)=>({s,r:i+1,id:s+'-'+(i+1)}))));r.net=[0,0,0,0];r.status=['ACTIVE','ACTIVE','ACTIVE','ACTIVE'];r.auto=[0,0,0,0];r.turns=[0,0,0,0];r.turnNo=0;r.cur=r.starter??Math.floor(rng()*4);r.drawn=false;r.last=null;r.feed=[];r.tx=[];r.deadline=ctx.now+r.duration;r.settled=false;
  for(let i=0;i<5;i++)for(let p=0;p<4;p++)r.hands[p].push(r.deck.pop());
  let best=null;r.hands.forEach((h,p)=>{const counts={};h.forEach(c=>counts[c.r]=(counts[c.r]||0)+1);for(const[rank,n]of Object.entries(counts))if(n>=3){const score=(n===4?100:0)+Number(rank);if(!best||score>best.score)best={p,n,score};}});
  if(best)result(best.p,best.n===4?'OPEN_FOUR':'OPEN_TRIPLE',null,best.n===4?3:2); };
 /* Server clock: every call first applies whatever deadline has passed (countdown, unready seats, turn timeout, result display). */
 const clock=()=>{const n=ctx.now;
  if(r.state==='countdown'&&n>=(r.startAt||0)){if(r.seats.every(Boolean)&&r.ready.every(Boolean))startRound();else{r.state='waiting';delete r.startAt;}}
  if(r.state==='waiting')r.seats.forEach((s,i)=>{if(s&&!r.ready[i]&&n-(r.seatAt[i]||0)>=KANG.readyMs){r.seats[i]=null;r.seatAt[i]=0;}});
  // Timed-out turns are played by the system. A table left alone catches up in one call: when a whole turn length has been missed, each further turn ends 20 s after the previous deadline.
  for(let guard=0;r.state==='playing'&&n>=r.deadline&&guard<80;guard++){const d=r.deadline;auto();late=true;if(r.state==='playing'&&n-d>r.duration)r.deadline=d+r.duration;}
  if(r.state==='result'&&r.settled&&n>=(r.endAt||0)){kangClear(r);cleared=true;applyBase();}
 };
 if(rules.emergency&&r.state!=='result'){if(r.state==='playing'||r.state==='countdown'||r.ready.some(Boolean)){voidRound();r.clearAfter=true;return out();}if(r.seats.some(Boolean))kangClear(r);}
 /* owner clear/void (and the one-time migration) cancels the table as it stands: do not auto-play an abandoned round to a result first */
 const before=JSON.stringify(r);if(!(['clear','void'].includes(input.type)&&boss))clock();const ticked=JSON.stringify(r)!==before;
 /* If the clock moved the table, a refused request must not roll that back: keep the clock step and answer with a notice. */
 const snapRoom=structuredClone(r),snapGame=structuredClone(game),snapCoins=coins;
 try{return play();}catch(e){if(!ticked)throw e;for(const key of Object.keys(r))delete r[key];Object.assign(r,snapRoom);for(const key of Object.keys(game))delete game[key];Object.assign(game,snapGame);coins=snapCoins;refund=0;return out({notice:e.message});}
 function play(){
 const index=slot();
 const k=min.kang ||= {n:0,at:0,rest:0};
 const restLeft=()=>Math.max(0,(k.rest||0)-ctx.now);
 if(input.type==='configure'){
  // Open/close and fees live in world/minigames (handled by the cloud handler). A new base waits until nobody holds a stake.
  if(!boss)fail('เฉพาะเจ้าของแผงควบคุม');
  if(input.base!==undefined){if(![1000,5000,10000,50000].includes(input.base))fail('ค่าฐานไม่ถูกต้อง');if(r.state!=='waiting'||r.ready.some(Boolean))r.nextBase=input.base;else{r.base=input.base;delete r.nextBase;}}
  return out();
 }
 /* Owner "clear room": any time. A round in play (or stakes already reserved) is voided first; the cloud handler mails every stake and fee back, then empties the table. */
 if(input.type==='clear'||input.type==='void'){if(!boss)fail('เฉพาะเจ้าของแผงควบคุม');
  if(r.state==='result'){if(r.settled){kangClear(r);cleared=true;applyBase();}else r.clearAfter=true;return out();}
  if(r.state==='playing'||r.state==='countdown'||r.ready.some(Boolean)){voidRound();r.clearAfter=true;return out();}
  kangClear(r);cleared=true;applyBase();return out();}
 if(['status','tick','advance'].includes(input.type))return out({mine:index>=0?r.hands[index]:[]});
 if(input.type==='join'){
  if(rules.emergency)fail(EMERGENCY);if(!r.open)fail('ห้องปิดชั่วคราว');if(index>=0)return out();if(r.state!=='waiting')fail('โต๊ะนี้กำลังเล่นอยู่ รอรอบหน้านะ');
  if(restLeft())fail('⏳ พักไพ่แคงอีก '+Math.ceil(restLeft()/60000)+' นาที');
  const free=r.seats.indexOf(null);if(free<0)fail('ห้องเต็ม 4 คน');r.seats[free]={uid:ctx.uid,name:ctx.name};r.seatAt[free]=ctx.now;return out();
 }
 if(input.type==='start')fail('ครบ 4 คนพร้อมแล้ว ระบบนับถอยหลังและเริ่มเอง');
 if(index<0)fail('คุณไม่ได้อยู่ในห้องนี้');
 if(input.type==='leave'){
  if(r.state==='playing')fail('ออกจากหน้าได้ หรือกดยอมแพ้เพื่อออกจากรอบ');
  if(r.state==='result')return out();   // results stay on the table for 30 s; stakes already went out by mail
  if(r.ready[index]&&!r.settled){const items=kangItemsPaid(r,index);refund=r.pool[index];game.merit=(game.merit||0)+refund;coins+=paidFee(index);
   if(items.hat||items.mb){game.bag ||= {};game.bag.item ||= {};if(items.hat)game.bag.item.hat=(Number(game.bag.item.hat)||0)+items.hat;if(items.mb)game.bag.item.musicbox=(Number(game.bag.item.musicbox)||0)+items.mb;}
   r.pool[index]=0;r.ready[index]=false;r.paid[index]=0;if(r.feeRec)r.feeRec[index]=false;r.paidHat[index]=0;r.paidMb[index]=0;delete min.escrows['kang-'+input.room];
   // A refunded round does not count towards the 3-round streak.
   if(k.restBy==='kang-'+input.room+'-'+(r.round+1)){k.rest=0;k.n=KANG.rounds-1;delete k.restBy;}else k.n=Math.max(0,(k.n||0)-1);}
  r.seats[index]=null;r.seatAt[index]=0;if(r.state==='countdown'){r.state='waiting';delete r.startAt;}applyBase();return out();
 }
 if(input.type==='ready'){
  if(rules.emergency)fail(EMERGENCY);if(!r.open||r.state!=='waiting')fail('ห้องยังไม่พร้อม');if(r.ready[index])return out();
  if(restLeft())fail('⏳ พักไพ่แคงอีก '+Math.ceil(restLeft()/60000)+' นาที');applyBase();
  const it=game.bag?.item||{},lack=[];if(coins<fee3.coin)lack.push('🪙 เหรียญอีก '+(fee3.coin-coins));if((Number(it.hat)||0)<fee3.hat)lack.push('👒 หมวกกะลาสีอีก '+(fee3.hat-(Number(it.hat)||0)));if((Number(it.musicbox)||0)<fee3.mb)lack.push('🎵 กล่องดนตรีอีก '+(fee3.mb-(Number(it.musicbox)||0)));
  if((game.merit||0)<r.base*8)lack.push('✨ กุศลขั้นต่ำ '+(r.base*8).toLocaleString('en-US'));if(lack.length)fail('ยังพร้อมไม่ได้ ขาด '+lack.join(' · '));
  coins-=fee3.coin;if(fee3.hat||fee3.mb){game.bag ||= {};game.bag.item ||= {};if(fee3.hat)game.bag.item.hat=(Number(game.bag.item.hat)||0)-fee3.hat;if(fee3.mb)game.bag.item.musicbox=(Number(game.bag.item.musicbox)||0)-fee3.mb;}
  r.paid[index]=fee3.coin;(r.feeRec ||= [false,false,false,false])[index]=true;r.paidHat[index]=fee3.hat;r.paidMb[index]=fee3.mb;game.merit-=r.base*8;r.match='kang-'+input.room+'-'+(r.round+1);r.pool[index]=r.base*8;r.ready[index]=true;r.settled=false;min.escrows['kang-'+input.room]={round:r.round+1,merit:r.base*8};
  // 3 rounds in a row, then a 10-minute rest (a gap of 10 minutes also resets the streak).
  if(ctx.now-(k.at||0)>KANG.restMs)k.n=0;k.n=(k.n||0)+1;k.at=ctx.now;if(k.n>=KANG.rounds){k.rest=ctx.now+KANG.restMs;k.n=0;k.restBy='kang-'+input.room+'-'+(r.round+1);}else delete k.restBy;
  // Four real players ready: a 10-second countdown on every screen, then the round starts by itself.
  if(r.seats.every(Boolean)&&r.ready.every(Boolean)){r.state='countdown';r.startAt=ctx.now+KANG.countdownMs;}return out();
 }
 if(late)return out();
 if(r.state!=='playing')fail('รอบนี้จบแล้ว');
 if(input.round!==r.round||input.turn!==r.turnNo)fail('รายการข้ามรอบหรือตาเก่า กรุณาดูโต๊ะล่าสุด');
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
}
