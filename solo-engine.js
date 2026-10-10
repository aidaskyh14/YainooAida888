import {seeded,bkkHour} from './campaigns-engine.js';
import {moleRound,moleHits,moleResult,MOLE} from './mole-engine.js';
import {basketRound,basketSend,basketResult,BASKET} from './basket-engine.js';
const fail=m=>{throw new Error(m);},choose=(r,a)=>a[Math.floor(r()*a.length)],int=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const shuffle=(r,a)=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export function birdOffer(seed){const rng=seeded(seed),order=shuffle(rng,[0,1,2,3]),roles=['normal','normal','lucky','cursed'],values={};order.forEach((t,i)=>{const role=roles[i];values[t]={role,val:role==='normal'?int(rng,25,100)*10:role==='lucky'?int(rng,50,100)*50:-int(rng,30,80)*50};});return values;}
export function birdFlights(seed,values){const rng=seeded(seed),rows=[],phases=[{from:0,to:8,iv:1.25,sp:.13},{from:8,to:15,iv:.6,sp:.15},{from:15,to:22,iv:1.4,sp:.15},{from:22,to:30,iv:.5,sp:.19},{from:30,to:35,iv:1.3,sp:.16},{from:35,to:42,iv:.75,sp:.27},{from:42,to:50,iv:.4,sp:.25},{from:50,to:60,iv:.32,sp:.29}],patterns=['straight','wave','zig','dash','uturn','fade'];
 for(const p of phases)for(let t=p.from;t<p.to;t+=p.iv*(.7+rng()*.6)){const type=p.from===35&&rng()<.5?Number(Object.keys(values).find(k=>values[k].role==='lucky')):int(rng,0,3);rows.push({id:rows.length,type,at:Math.round(t*1000),dir:rng()<.5?1:-1,y:.08+rng()*.3,phase:rng()*6,sp:p.sp*(.85+rng()*.4),pattern:choose(rng,patterns)});}
 return rows;
}
export function birdPosition(b,time){const seconds=(time-b.at)/1000;if(seconds<0)return null;let travel=seconds*b.sp,dir=b.dir;if(b.pattern==='dash')travel+=Math.max(0,seconds-1.5)*b.sp*.8;if(b.pattern==='uturn'&&travel>.75){travel=1.5-travel;dir=-dir;}const x=b.dir>0?-.1+travel:1.1-travel;if(x<-.15||x>1.15||seconds>14)return null;let y=b.y;if(['wave','fade','uturn'].includes(b.pattern))y+=Math.sin(seconds*3+b.phase)*.025;if(b.pattern==='zig')y+=Math.sin(seconds*7+b.phase)*.04;const vis=b.pattern==='fade'?Math.max(.2,(Math.sin(seconds*4+b.phase)+1)/2):1;return {x,y,dir,vis};}
export function fireBird(round,shot){const t=shot.t;if(!Number.isFinite(t)||t<0||t>=60000||t<(round.lastShot??-1)||!Number.isFinite(shot.x)||!Number.isFinite(shot.y)||shot.x<0||shot.x>1||shot.y<0||shot.y>1)fail('ตำแหน่งหรือเวลายิงไม่ถูกต้อง');
 if(t<(round.reload||0))fail('กำลังบรรจุกระสุน');if((round.reload||0)&&t>=round.reload){round.ammo=6;round.reload=0;}round.recent=(round.recent||[]).filter(at=>t-at<1000);if(round.recent.length>=4)fail('ปืนร้อน กดรัวเกินไป');round.recent.push(t);round.lastShot=t;round.shots=(round.shots||0)+1;if(round.shots>240)fail('เกินจำนวนนัดสูงสุด');round.ammo--;if(!round.ammo)round.reload=t+1500;
 let hit=null;for(let i=round.flights.length-1;i>=0;i--){const b=round.flights[i];if(round.killed.includes(b.id))continue;const p=birdPosition(b,t);if(!p||p.vis<.5)continue;const radiusX=.075/(941/1672)*.95*.5,radiusY=.075*.48;if(((shot.x-p.x)/radiusX)**2+((shot.y-p.y)/radiusY)**2<=1){hit=b;break;}}
 if(hit){round.killed.push(hit.id);round.hits[hit.type]++;round.count++;round.sum+=round.values[hit.type].val;}return hit;
}
/* Shared minigame settings (world/minigames). Fees are Halloween coins; the owner edits them in the control panel. */
export const MG_GAMES=['br','kang','pk','bs','mole','basket'];
export const MG_FEES={br:6,kang:4,bs:8,pk:3,mole:2,basket:6};
export const MG_HOURS={pk:[19,5],bs:[10,18]};
export const MG_MIN={pk:25000,bs:10000};
export const MG_EMERGENCY='ขออภัย ระบบปิดฉุกเฉิน แวะมาใหม่โอกาสหน้า';
const LEGACY_FEE={pk:2,bs:3,mole:3,basket:3};
export const inHours=(hour,[a,b])=>a<b?hour>=a&&hour<b:hour>=a||hour<b;
export function minigameRules(settings){
 const s=settings||{},fees={...MG_FEES},hours={pk:[...MG_HOURS.pk],bs:[...MG_HOURS.bs]};
 for(const k of MG_GAMES){const f=s.fees?.[k];if(Number.isSafeInteger(f)&&f>=0&&f<=99)fees[k]=f;}
 for(const k of ['pk','bs']){const h=s.hours?.[k];if(Array.isArray(h)&&h.length===2&&h.every(n=>Number.isInteger(n)&&n>=0&&n<=23)&&h[0]!==h[1])hours[k]=[h[0],h[1]];}
 const emergency=!!s.emergency,solo=s.solo||{},off={...(s.off||{})};
 return {fees,hours,emergency,emergencyAt:s.emergencyAt||0,solo,off:k=>emergency||(k==='br'||k==='kang'?!!off[k]:solo[k]==='closed')};
}
/* Owner control: mutates settings in place, throws on bad input. Changes always apply to the next entry; nothing is refused because people are seated. */
export function minigameConfigure(settings,input,now){
 const s=settings;s.fees ||= {};s.hours ||= {};s.off ||= {};s.solo ||= {};
 if(input.type==='control'){
  if(!MG_GAMES.includes(input.game))fail('เกมไม่ถูกต้อง');
  if(input.game==='br'||input.game==='kang'){if(!['open','closed','auto'].includes(input.mode))fail('โหมดไม่ถูกต้อง');s.off[input.game]=input.mode==='closed';}
  else{if(!['auto','open','closed'].includes(input.mode))fail('โหมดไม่ถูกต้อง');s.solo[input.game]=input.mode;}
 }else if(input.type==='fees'){
  const rows=Object.entries(input.fees||{});if(!rows.length)fail('ไม่มีค่าเข้าที่จะบันทึก');
  for(const[k,v]of rows){if(!MG_GAMES.includes(k)||!Number.isSafeInteger(v)||v<0||v>99)fail('ค่าเข้าต้องเป็น 0–99 เหรียญ');s.fees[k]=v;}
 }else if(input.type==='hours'){
  if(!['pk','bs'].includes(input.game)||![input.from,input.to].every(n=>Number.isInteger(n)&&n>=0&&n<=23)||input.from===input.to)fail('เวลาเปิดไม่ถูกต้อง');s.hours[input.game]=[input.from,input.to];
 }else if(input.type==='emergency'){
  s.emergency=!!input.on;if(s.emergency)s.emergencyAt=now;
 }else fail('รายการควบคุมไม่ถูกต้อง');
 const rules=minigameRules(s);
 if(s.br)Object.assign(s.br,{open:!rules.off('br'),fee:rules.fees.br});
 if(Array.isArray(s.kang))s.kang.forEach(k=>k&&Object.assign(k,{open:!rules.off('kang'),accept:!rules.off('kang'),fee:rules.fees.kang}));
 s.controlRevision=now;return s;
}
export function soloPublic(state){const out=structuredClone(state);if(out.pk?.phase==='active')delete out.pk.kind;return out;}
export function soloAction(source,account,ctx,input,rng=Math.random){const state=structuredClone(source||{}),game=structuredClone(account);game.sub ||= {};const progress=game.sub.minigames ||= {cd:{},escrows:{}};progress.cd ||= {};let coins=ctx.coins,reward=null;const hours=bkkHour(ctx.now),nonce=ctx.nonce;
 const rules=ctx.rules||minigameRules({solo:ctx.controls||{}}),fees=rules.fees;
 const opened=(k,scheduled)=>!rules.emergency&&(rules.solo[k]==='open'||rules.solo[k]!=='closed'&&scheduled);
 const hh=k=>rules.hours[k].map(h=>String(h).padStart(2,'0')+':00').join('–');
 /* Emergency close voids every unfinished solo round (no merit change) and returns its coin fee. */
 const voided=[];
 for(const k of ['pk','bs','mole','basket']){const r=state[k];if(r?.phase!=='active')continue;const paid=r.paidAt??r.start??0;if(rules.emergency||rules.emergencyAt&&paid<=rules.emergencyAt){const fee=Number.isSafeInteger(r.fee)?r.fee:LEGACY_FEE[k];r.phase='void';coins+=fee;voided.push({game:k,coins:fee});}}
 const result=()=>({state,game,coins,reward,voided});
 if(rules.emergency&&/-start$/.test(String(input.type)))fail(MG_EMERGENCY);
 if(input.type==='status'){state.offer ||= birdOffer(nonce);state.moleOffer ||= moleRound(rng,0,'offer');state.basketOffer ||= basketRound(rng,0,'offer');return result();}
 if(input.type==='pk-start'){
  if(state.pk?.phase==='active')return result();if(!opened('pk',inHours(hours,rules.hours.pk)))fail('จิ้มฟักทองเปิด '+hh('pk')+' เวลาไทย');if((progress.cd.pk||0)>ctx.now)fail('พักจิ้มฟักทอง 30 นาที');if(coins<fees.pk||(game.merit||0)<MG_MIN.pk)fail('ใช้ '+fees.pk+' เหรียญและต้องมีกุศลอย่างน้อย 25,000');coins-=fees.pk;const angels=int(rng,5,10);state.pk={id:nonce,phase:'active',start:ctx.now,paidAt:ctx.now,fee:fees.pk,kind:shuffle(rng,Array.from({length:16},(_,i)=>i<angels?'angel':'devil'))};return result();
 }
 if(input.type==='pk-finish'){
  const r=state.pk;if(!r||r.phase!=='active'||r.id!==input.round)fail('รอบจิ้มฟักทองไม่ถูกต้อง');const picks=input.picks;if(!Array.isArray(picks)||picks.length!==4||new Set(picks).size!==4||picks.some(i=>!Number.isInteger(i)||i<0||i>15))fail('เลือกฟักทอง 4 ลูกที่ต่างกัน');r.picks=picks;r.angels=picks.filter(i=>r.kind[i]==='angel').length;r.phase='done';progress.cd.pk=ctx.now+30*60000;const merit={4:100000,3:20000,2:0,1:-5000,0:-15000}[r.angels];
  if(merit>0)reward={icon:'🎃',title:'จิ้มฟักทอง +'+merit+' กุศล',merit,items:{}};else if(r.angels===2)reward={icon:'📦',title:'รางวัลปลอบใจจิ้มฟักทอง',merit:0,items:{'bird-box-ostrich':10,'bird-box-dodo':10}};else game.merit=Math.max(0,(game.merit||0)+merit);r.gain=merit;return result();
 }
 if(input.type==='bs-start'){
  if(state.bs?.phase==='active'&&ctx.now<state.bs.until)return result();if(state.bs?.phase==='active')fail('รับผลรอบเดิมก่อน');if(!opened('bs',inHours(hours,rules.hours.bs)))fail('ยิงนกเปิด '+hh('bs')+' เวลาไทย');if((progress.cd.bs||0)>ctx.now)fail('พักยิงนก 15 นาที');if(coins<fees.bs||(game.merit||0)<MG_MIN.bs)fail('ใช้ '+fees.bs+' เหรียญและต้องมีกุศลอย่างน้อย 10,000 สำหรับยอดเสี่ยง');coins-=fees.bs;state.offer ||= birdOffer(nonce);state.bs={id:nonce,phase:'active',start:ctx.now,paidAt:ctx.now,fee:fees.bs,until:ctx.now+60000,values:state.offer,flights:birdFlights(nonce,state.offer),killed:[],hits:[0,0,0,0],count:0,sum:0,ammo:6,reload:0,recent:[],shots:0};return result();
 }
 if(input.type==='bs-shot'||input.type==='bs-shots'){
  const r=state.bs;if(!r||r.phase!=='active'||r.id!==input.round)fail('รอบยิงนกไม่ถูกต้อง');const shots=input.type==='bs-shot'?[input]:input.shots;
  if(!Array.isArray(shots)||!shots.length||shots.length>40)fail('รายการยิงไม่ถูกต้อง');
  const maxAge=input.type==='bs-shot'?2000:15000;
  for(const shot of shots){if(ctx.now>r.until+maxAge||shot.t>ctx.now-r.start+500||ctx.now-r.start-shot.t>maxAge)fail('เวลายิงหมดแล้วหรือรายการเก่า');fireBird(r,shot);}return result();
 }
 if(input.type==='bs-finish'){
  const r=state.bs;if(!r||r.phase!=='active'||r.id!==input.round||ctx.now<r.until)fail('รอบยิงนกยังไม่จบ');r.phase='done';r.gain=Math.max(-10000,r.sum);progress.cd.bs=ctx.now+15*60000;if(r.gain>0)reward={icon:'🐦',title:'ยิงนกฮาโลวีน +'+r.gain+' กุศล',merit:r.gain,items:{}};else game.merit=Math.max(0,(game.merit||0)+r.gain);state.offer=birdOffer(nonce);return result();
 }
  const roundStart=(key,game_rules,make)=>{const rules=game_rules;const cur=state[key];if(cur?.phase==='active'&&ctx.now<cur.until+rules.grace0)return result();if(cur?.phase==='active')fail('รับผลรอบเดิมก่อน');if(!opened(key,true))fail('เกมนี้ปิดอยู่ชั่วคราว');if((progress.cd[key]||0)>ctx.now)fail('พักก่อนนะ เล่นรอบใหม่ได้ในอีกสักครู่');const cost=fees[key];if(coins<cost||(game.merit||0)<rules.minMerit)fail('ใช้ '+cost+' เหรียญ และต้องมีกุศลอย่างน้อย '+rules.minMerit.toLocaleString('en-US'));coins-=cost;state[key]={...make(),paidAt:ctx.now,fee:cost};return result();};
 const settle=(key,game_rules,res,icon,title)=>{const rules=game_rules;const r=state[key];r.phase='done';r.result=res;state[key+'Offer']=key==='mole'?moleRound(rng,0,'offer'):basketRound(rng,0,'offer');progress.cd[key]=ctx.now+rules.cooldown;if(res.merit>0)reward={icon,title:title+' +'+res.merit.toLocaleString('en-US')+' กุศล',merit:res.merit,items:{}};else if(res.merit<0)game.merit=Math.max(0,(game.merit||0)+res.merit);return result();};
 if(input.type==='mole-start')return roundStart('mole',{...MOLE,grace0:0},()=>{const o=state.moleOffer||moleRound(rng,0,nonce);delete state.moleOffer;return {...o,id:nonce,phase:'active',start:ctx.now+3000,until:ctx.now+3000+MOLE.length};});
 if(input.type==='mole-hits'){const r=state.mole;if(!r||r.id!==input.round)fail('รอบตีตุ่นไม่ถูกต้อง');moleHits(r,input.hits,ctx.now);return result();}
 if(input.type==='mole-finish'){const r=state.mole;if(!r||r.phase!=='active'||r.id!==input.round||ctx.now<r.until)fail('รอบตีตุ่นยังไม่จบ');return settle('mole',MOLE,moleResult(r),'🔨','ตีตุ่น');}
 if(input.type==='basket-start')return roundStart('basket',{...BASKET,grace0:BASKET.grace},()=>{const o=state.basketOffer||basketRound(rng,0,nonce);delete state.basketOffer;return {...o,id:nonce,phase:'active',start:ctx.now+3000,until:ctx.now+3000+BASKET.length};});
 if(input.type==='basket-send'){const r=state.basket;if(!r||r.id!==input.round)fail('รอบจัดตะกร้าไม่ถูกต้อง');basketSend(r,input.witch,input.items,ctx.now);return result();}
 if(input.type==='basket-finish'){const r=state.basket;if(!r||r.phase!=='active'||r.id!==input.round||(ctx.now<r.until&&r.sent.some(x=>!x)))fail('รอบจัดตะกร้ายังไม่จบ');return settle('basket',BASKET,basketResult(r),'🧺','จัดตะกร้าให้แม่มด');}
 fail('รายการมินิเกมไม่ถูกต้อง');
}
