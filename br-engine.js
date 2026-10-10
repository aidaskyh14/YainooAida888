const fail=m=>{throw new Error(m);},int=(r,a,b)=>a+Math.floor(r()*(b-a+1)),pick=(r,a)=>a[Math.floor(r()*a.length)];
export const brDistance=(a,b,c,d)=>Math.max(Math.abs(a-c),Math.abs(b-d));
const fog=(x,y,n)=>Math.min(x,y,8-x,8-y)<n;
const ITEMS=['bomb','cloak','shoes','candy','smoke'];
export const freshBr=()=>({open:true,fee:6,state:'waiting',round:0,seats:[],players:[],hist:[]});
export const BR_MIN=6,BR_MAX=8,BR_DC=-75000;
export const BR_DC_MSG='เสียใจด้วย คุณได้หลุดออกจากเกม รบกวนเช็คการเชื่อมต่อของโทรศัพท์ของคุณด้วยค่ะ';
/* Prize by final rank among the players who stayed connected. Ranks 4..last fall evenly from −15,000 to −45,000 (last is always −45,000). */
export function brPrize(rank,count){if(rank===1)return 100000;if(rank===2)return 40000;if(rank===3)return 30000;const m=count-3;if(m<=1)return -45000;return -Math.round(15000+(rank-4)*30000/(m-1));}
const DEFAULT_RULES={fees:{br:6},emergency:false,off:()=>false};
/* A disconnected player stands still or steps to a random safe neighbouring cell. */
function autoMove(r,p,rng){const opts=[],warned=(x,y)=>r.warn.some(w=>w[0]===x&&w[1]===y);for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){const x=p.x+dx,y=p.y+dy;if(x<0||y<0||x>8||y>8||fog(x,y,r.fog)||warned(x,y))continue;opts.push([x,y]);}
 const calm=opts.filter(([x,y])=>!fog(x,y,Math.max(r.fog,r.fogWarn||0))),list=calm.length?calm:opts;if(!list.length)return {t:'stay'};const [x,y]=pick(rng,list);return x===p.x&&y===p.y?{t:'stay'}:{t:'move',x,y};}
function finish(r,now,winners){
 const ranked=r.players.filter(p=>!p.dc),rest=ranked.filter(p=>!winners.includes(p)).sort((a,b)=>b.deadTurn-a.deadTurn||(b.hpStart||0)-(a.hpStart||0)),n=ranked.length;
 r.result=[...winners.map(p=>({uid:p.uid,name:p.n,rank:1,cause:'รอด',turn:r.turn})),...rest.map((p,i)=>({uid:p.uid,name:p.n,rank:winners.length+i+1,cause:p.cause,turn:p.deadTurn}))].map(p=>r.v>=12?{...p,merit:brPrize(p.rank,n)}:p);
 r.dropped=r.players.filter(p=>p.dc&&r.v>=12).map(p=>({uid:p.uid,name:p.n,turn:p.dcTurn||r.turn,merit:BR_DC}));
 r.state='result';r.done=true;r.deadline=0;r.hist.unshift({round:r.round,at:now,result:r.result,dropped:r.dropped});r.hist=r.hist.slice(0,20);
}
export function brPublic(r){const out=structuredClone(r);out.warn=(out.warn||[]).map(([x,y])=>({x,y}));for(const p of out.players){p.confirmed=!!p.act;delete p.act;}return out;}
function warnings(r,rng){const live=r.players.filter(p=>p.alive),n=Math.min(6,2+Math.floor(r.turn/4));r.warn=[];for(let k=0;k<n*5&&r.warn.length<n;k++){const target=rng()<.5?pick(rng,live):null,x=target?target.x+int(rng,-1,1):int(rng,0,8),y=target?target.y+int(rng,-1,1):int(rng,0,8);if(x<0||y<0||x>8||y>8||fog(x,y,r.fog)||r.warn.some(w=>w[0]===x&&w[1]===y))continue;r.warn.push([x,y]);}}
function resolve(r,now,rng){
 const live=r.players.filter(p=>p.alive),hpStart=Object.fromEntries(r.players.map(p=>[p.i,p.hp])),haunts=r.players.filter(p=>!p.alive&&p.act?.t==='haunt');r.pend=[];
 const fx=(p,t)=>r.pend.push({x:p.x,y:p.y,t});
 const hurt=(p,cause,source)=>{if(!p.alive||p.hp<=0)return;if(p.smoke)return;if(p.cloak){p.cloak=false;fx(p,'🧥 กันไว้');return;}p.hp=Math.max(0,p.hp-1);p.lastCause=cause;if(source)p.killer=source.uid;fx(p,'−❤️');};
 // Two turns in a row without a choice = disconnected; from then on the server plays for them.
 if(r.v>=12)live.forEach(p=>{if(p.frozen)return;if(!p.dc){if(p.act){p.miss=0;return;}p.miss=(p.miss||0)+1;if(p.miss<2)return;p.dc=true;p.dcTurn=r.turn;r.log.unshift('📵 '+p.n+' หลุดออกจากเกม');}p.act=autoMove(r,p,rng);});
 live.forEach(p=>{p.smoke=false;if(p.frozen){p.act={t:'stay'};return;}const a=p.act ||= {t:'stay'};if(a.t==='item'){p.items.splice(p.items.indexOf(a.k),1);if(a.k==='candy')p.hp=Math.min(3,p.hp+1);if(a.k==='cloak')p.cloak=true;if(a.k==='smoke')p.smoke=true;if(a.k==='shoes'){p.x=a.x;p.y=a.y;}}});
 live.forEach(p=>{if(p.act.t==='move'){p.x=p.act.x;p.y=p.act.y;}});
 live.filter(p=>p.act.t==='throw'||p.act.t==='item'&&p.act.k==='bomb').forEach(p=>{const a=p.act,b=a.k==='bomb';live.forEach(o=>{if(b?brDistance(o.x,o.y,a.x,a.y)<=1:o.x===a.x&&o.y===a.y)hurt(o,'โดน '+p.n+' ปาฟักทอง'+(b?'ระเบิด':''),p);});});
 live.forEach(p=>{if(r.warn.some(w=>w[0]===p.x&&w[1]===p.y))hurt(p,'ฟักทองตกจากฟ้า');if(fog(p.x,p.y,r.fog))hurt(p,'โดนหมอกผี');});
 live.forEach(p=>{if(p.act.t==='dig'&&p.hp>0&&p.items.length<2&&rng()<.4){const k=pick(rng,ITEMS);p.items.push(k);fx(p,'⛏️ ได้ไอเทม');}});
 r.players.forEach(p=>p.frozen=false);haunts.forEach(g=>{const target=r.players[g.act.v];if(target?.alive){target.frozen=true;g.hauntCd=4;g.lastHaunt=target.i;r.log.unshift('👻 '+g.n+' หลอก '+target.n);}});r.players.forEach(p=>{if(!p.alive&&p.hauntCd>0)p.hauntCd--;});
 const died=live.filter(p=>p.hp<=0);died.forEach(p=>{p.alive=false;p.deadTurn=r.turn;p.cause=p.lastCause||'';p.hpStart=hpStart[p.i];r.log.unshift('💀 '+p.n+' ตกรอบ ('+p.cause+')');});r.log=r.log.slice(0,10);
 // The match ends when at most one connected player is alive; disconnected players are not ranked.
 const left=r.players.filter(p=>p.alive&&!p.dc);if(left.length<=1){let winners=left;if(!left.length){const fell=died.filter(p=>!p.dc),max=Math.max(...fell.map(p=>p.hpStart));winners=fell.filter(p=>p.hpStart===max);winners.forEach(p=>{p.alive=true;p.cause='';});}finish(r,now,winners);return;}
 if(r.turn%3===2&&r.fog<4)r.fogWarn=r.fog+1;if(r.turn%3===0&&r.fog<4){r.fog++;r.log.unshift('🌫️ หมอกผีบีบสนามเข้ามา');}r.turn++;warnings(r,rng);r.deadline=now+35000;r.players.forEach(p=>p.act=null);
}
export function brAction(source,account,ctx,input,rng=Math.random){const r=structuredClone(source),game=structuredClone(account);let coins=ctx.coins;const index=r.seats.findIndex(s=>s.uid===ctx.uid),own=r.players.find(p=>p.uid===ctx.uid),out=extra=>({room:r,game,coins,...extra});
 const rules=ctx.rules||DEFAULT_RULES,boss=ctx.owner??ctx.admin,EMERGENCY='ขออภัย ระบบปิดฉุกเฉิน แวะมาใหม่โอกาสหน้า';
 // Rooms open by themselves; only the owner's close switch or the emergency switch shuts them. A fee change applies to the next entry.
 // Seats taken before this version do not carry their own fee: lock in what they actually paid before the fee may change.
 for(const s of r.seats)if(!Number.isSafeInteger(s.fee))s.fee=Number.isSafeInteger(r.fee)?r.fee:2;
 r.open=!rules.off('br');r.fee=rules.fees.br;
 const paid=s=>Number.isSafeInteger(s?.fee)?s.fee:r.fee;
 const voidRoom=()=>{const refund=r.seats.map(s=>({uid:s.uid,coins:paid(s)}));r.reason='VOID';r.deadline=0;r.pend=[];r.log ||= [];r.warn ||= [];
  // A waiting room has no arena yet: refund and return to an empty waiting room instead of an empty result screen.
  if(r.state!=='playing'){r.state='waiting';r.seats=[];r.players=[];r.done=false;r.result=[];return out({refund});}
  r.state='result';r.done=true;r.result=[];r.dropped=[];return out({refund});};
 if(rules.emergency&&r.seats.length&&r.state!=='result')return voidRoom();
 if(input.type==='status')return out();
 if(input.type==='configure'){if(!boss)fail('เฉพาะเจ้าของแผงควบคุม');return out();}
 if(input.type==='void'){
  if(!boss)fail('เฉพาะเจ้าของแผงควบคุม');if(!r.seats.length||r.state==='result')fail('ไม่มีรอบที่ยุติได้');return voidRoom();
 }
 if(input.type==='join'){
  if(rules.emergency)fail(EMERGENCY);if(!r.open)fail('ห้องปิดชั่วคราว');if(r.state==='playing')fail('กำลังแข่งอยู่ รอบหน้ากลับมาใหม่นะ');if(r.state==='result'){r.state='waiting';r.seats=[];r.players=[];r.done=false;}delete r.reason;
  if(r.seats.some(s=>s.uid===ctx.uid))return out();if(r.seats.length>=BR_MAX)fail('ห้องเต็ม 8 คน');if(coins<r.fee)fail('เหรียญไม่พอ');coins-=r.fee;r.seats.push({uid:ctx.uid,name:ctx.name,fee:r.fee});game.sub ||= {};game.sub.minigames ||= {};game.sub.minigames.brEntry={round:r.round+1,coins:r.fee};return out();
 }
 if(input.type==='leave'){
  if(r.state==='playing')fail('ออกจากหน้าได้ แต่จะถือว่าหลุดจากเกม');if(index<0)return out();if(r.state==='waiting')coins+=paid(r.seats[index]);r.seats.splice(index,1);return out();
 }
 if(input.type==='disconnect'){
  // The player left the arena page or was idle for 5 minutes: from now on the server plays for them.
  if(r.state!=='playing'||!own||!own.alive||own.dc||!(r.v>=12))return out();own.dc=true;own.dcTurn=r.turn;own.act=null;r.log.unshift('📵 '+own.n+' หลุดออกจากเกม');r.log=r.log.slice(0,10);
  const left=r.players.filter(p=>p.alive&&!p.dc);if(left.length<=1){finish(r,ctx.now,left);return out();}
  const eligible=r.players.filter(p=>p.alive&&!p.frozen&&!p.dc||!p.alive&&p.hauntCd===0);if(eligible.every(p=>p.act))resolve(r,ctx.now,rng);return out();
 }
 if(input.type==='start'){
  if(rules.emergency)fail(EMERGENCY);if(!boss&&index<0)fail('เข้าร่วมห้องก่อนจึงกดเริ่มได้');if(r.state!=='waiting'||r.seats.length<BR_MIN||r.seats.length>BR_MAX)fail('ต้องมีผู้เล่นจริง 6–8 คน');r.round++;r.v=12;r.state='playing';r.turn=1;r.fog=0;r.fogWarn=0;r.log=[];r.pend=[];r.done=false;r.deadline=ctx.now+35000;const spots=[[1,1],[7,1],[1,7],[7,7],[4,1],[1,4],[7,4],[4,7]];for(let i=7;i>0;i--){const j=int(rng,0,i);[spots[i],spots[j]]=[spots[j],spots[i]];}r.result=[];r.dropped=[];delete r.paid;r.players=r.seats.map((s,i)=>({uid:s.uid,i,n:s.name,x:spots[i][0],y:spots[i][1],hp:3,items:[],alive:true,cause:'',deadTurn:0,act:null,frozen:false,cloak:false,hauntCd:0,lastHaunt:null,miss:0,dc:false}));warnings(r,rng);return out();
 }
 if(r.state!=='playing'||input.round!==r.round||input.turn!==r.turn)fail('ตาเก่าหรือรอบนี้จบแล้ว');
 if(ctx.now>=r.deadline){resolve(r,ctx.now,rng);return out({late:input.type!=='advance'});}
 if(input.type==='advance')fail('ยังไม่หมดเวลาตานี้');
 if(input.type!=='choose'||!own)fail('เลือกท่าไม่ได้');if(own.dc)fail('คุณหลุดออกจากเกมแล้ว ระบบเล่นแทนจนจบรอบ');if(own.act)fail('เลือกท่าแล้ว');const a=input.action;if(!a||typeof a!=='object')fail('ท่าไม่ถูกต้อง');
 if(!own.alive){if(a.t!=='haunt'||own.hauntCd>0||!Number.isInteger(a.v)||!r.players[a.v]?.alive||a.v===own.lastHaunt)fail('ยังหลอกเป้าหมายนี้ไม่ได้');own.act={t:'haunt',v:a.v};}
 else {
  if(own.frozen)fail('โดนหลอก ตานี้ต้องยืนรอ');if(!['move','dig','throw','stay','item'].includes(a.t))fail('ท่าไม่ถูกต้อง');
  if(a.t==='item'&&!own.items.includes(a.k))fail('ไม่มีไอเทมนี้');const target=a.t==='move'||a.t==='throw'||a.t==='item'&&['shoes','bomb'].includes(a.k);
  if(target){if(!Number.isInteger(a.x)||!Number.isInteger(a.y)||a.x<0||a.x>8||a.y<0||a.y>8)fail('ช่องเป้าไม่ถูกต้อง');const d=brDistance(a.x,a.y,own.x,own.y);if(d<1||d>(a.t==='move'?1:3))fail('เป้าหมายไกลเกินไป');}
  own.act={t:a.t,...(a.t==='item'?{k:a.k}:{}),...(target?{x:a.x,y:a.y}:{})};
 }
 const eligible=r.players.filter(p=>p.alive&&!p.frozen&&!p.dc||!p.alive&&p.hauntCd===0);if(eligible.every(p=>p.act))resolve(r,ctx.now,rng);return out();
}
