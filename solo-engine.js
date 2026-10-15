import {seeded,bkkHour} from './campaigns-engine.js';
import {moleRound,moleHits,moleResult,MOLE} from './mole-engine.js';
import {basketRound,basketSend,basketResult,BASKET} from './basket-engine.js';
import {witchStart,witchCheckpoint,witchFinish,witchAbandon} from './witch-engine.js';
import {candyStart,candyCheckpoint,candyFinish,candyAbandon} from './candy-engine.js';
const fail=m=>{throw new Error(m);},choose=(r,a)=>a[Math.floor(r()*a.length)],int=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const shuffle=(r,a)=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const clamp=(v,a,b)=>v<a?a:v>b?b:v,num=n=>Math.round(n).toLocaleString('en-US');

/* ---------- ยิงนกฮาโลวีน (fix13: นกร้าย type 4–6) ---------- */
export const BIRD_EVIL={4:{key:'crow',val:-3000},5:{key:'owl',val:-4000},6:{key:'bat',val:-2000}};
export const BIRD_LOSS_CAP=-30000,BIRD_LOSS_CAP_OLD=-10000,BIRD_BLAST={rx:.17,ry:.1};
/* The four normal birds keep their exact old draw; evil values are added after it. */
export const withEvil=values=>{const v={...values};for(const k of [4,5,6])v[k]={role:'evil',val:BIRD_EVIL[k].val};return v;};
export function birdOffer(seed){const rng=seeded(seed),order=shuffle(rng,[0,1,2,3]),roles=['normal','normal','lucky','cursed'],values={};order.forEach((t,i)=>{const role=roles[i];values[t]={role,val:role==='normal'?int(rng,25,100)*10:role==='lucky'?int(rng,50,100)*50:-int(rng,30,80)*50};});return withEvil(values);}
export function birdFlights(seed,values){const rng=seeded(seed),rows=[],phases=[{from:0,to:8,iv:1.25,sp:.13},{from:8,to:15,iv:.6,sp:.15},{from:15,to:22,iv:1.4,sp:.15},{from:22,to:30,iv:.5,sp:.19},{from:30,to:35,iv:1.3,sp:.16},{from:35,to:42,iv:.75,sp:.27},{from:42,to:50,iv:.4,sp:.25},{from:50,to:60,iv:.32,sp:.29}],patterns=['straight','wave','zig','dash','uturn','fade'];
 // Original rows: identical draw order to fix12, so the normal birds of a seed never change.
 for(const p of phases)for(let t=p.from;t<p.to;t+=p.iv*(.7+rng()*.6)){const type=p.from===35&&rng()<.5?Number(Object.keys(values).find(k=>values[k].role==='lucky')):int(rng,0,3);rows.push({id:rows.length,type,at:Math.round(t*1000),dir:rng()<.5?1:-1,y:.08+rng()*.3,phase:rng()*6,sp:p.sp*(.85+rng()*.4),pattern:choose(rng,patterns)});}
 if(!values[4])return rows;   // an old offer without evil birds keeps the old flight table
 // Evil rows are appended with their own rng (drawn on top: a shot on an overlap hits the evil bird first). Later = more; 55% escort a good bird.
 const r2=seeded(seed+':evil'),good=rows.filter(b=>values[b.type].role!=='cursed'),ep=[{from:2,to:15,iv:2.6},{from:15,to:35,iv:1.5},{from:35,to:60,iv:.85}];
 for(const p of ep)for(let t=p.from;t<p.to;t+=p.iv*(.7+r2()*.6)){const type=4+int(r2,0,2),ms=Math.round(t*1000);
  let g=null,bd=1300;if(r2()<.55)for(const b of good){const d=Math.abs(b.at-ms);if(d<bd){bd=d;g=b;}}
  if(g)rows.push({id:rows.length,type,at:Math.max(0,g.at+int(r2,-260,260)),dir:g.dir,y:clamp(g.y+(r2()<.5?-1:1)*(.02+r2()*.03),.06,.42),phase:g.phase+1.3,sp:g.sp*(.95+r2()*.1),pattern:g.pattern==='fade'?'wave':g.pattern,escort:1});
  else rows.push({id:rows.length,type,at:ms,dir:r2()<.5?1:-1,y:.07+r2()*.32,phase:r2()*6,sp:(.14+t/60*.13)*(.85+r2()*.4),pattern:choose(r2,['straight','wave','zig','dash'])});}
 return rows;
}
export function birdPosition(b,time){const seconds=(time-b.at)/1000;if(seconds<0)return null;let travel=seconds*b.sp,dir=b.dir;if(b.pattern==='dash')travel+=Math.max(0,seconds-1.5)*b.sp*.8;if(b.pattern==='uturn'&&travel>.75){travel=1.5-travel;dir=-dir;}const x=b.dir>0?-.1+travel:1.1-travel;if(x<-.15||x>1.15||seconds>14)return null;let y=b.y;if(['wave','fade','uturn'].includes(b.pattern))y+=Math.sin(seconds*3+b.phase)*.025;if(b.pattern==='zig')y+=Math.sin(seconds*7+b.phase)*.04;const vis=b.pattern==='fade'?Math.max(.2,(Math.sin(seconds*4+b.phase)+1)/2):1;return {x,y,dir,vis};}
/* Returns {hit,blown}. Owl (5): every bird inside the blast ellipse falls without score. Bat (6): ammo 0 + 1.5 s reload. Crow (4): darkness 2 s. */
export function fireBird(round,shot){const t=shot.t;if(!Number.isFinite(t)||t<0||t>=60000||t<(round.lastShot??-1)||!Number.isFinite(shot.x)||!Number.isFinite(shot.y)||shot.x<0||shot.x>1||shot.y<0||shot.y>1)fail('ตำแหน่งหรือเวลายิงไม่ถูกต้อง');
 if(t<(round.reload||0))fail('กำลังบรรจุกระสุน');if((round.reload||0)&&t>=round.reload){round.ammo=6;round.reload=0;}round.recent=(round.recent||[]).filter(at=>t-at<1000);if(round.recent.length>=4)fail('ปืนร้อน กดรัวเกินไป');round.recent.push(t);round.lastShot=t;round.shots=(round.shots||0)+1;if(round.shots>240)fail('เกินจำนวนนัดสูงสุด');round.ammo--;if(!round.ammo)round.reload=t+1500;
 let hit=null;const radiusX=.075/(941/1672)*.95*.5,radiusY=.075*.48;
 for(let i=round.flights.length-1;i>=0;i--){const b=round.flights[i];if(round.killed.includes(b.id))continue;const p=birdPosition(b,t);if(!p||p.vis<.5)continue;if(((shot.x-p.x)/radiusX)**2+((shot.y-p.y)/radiusY)**2<=1){hit=b;break;}}
 const blown=[];
 if(hit){round.killed.push(hit.id);round.hits[hit.type]=(round.hits[hit.type]||0)+1;round.count++;round.sum+=round.values[hit.type].val;
  if(hit.type===5){const bp=birdPosition(hit,t);for(const b of round.flights){if(round.killed.includes(b.id))continue;const p=birdPosition(b,t);if(!p)continue;if(((p.x-bp.x)/BIRD_BLAST.rx)**2+((p.y-bp.y)/BIRD_BLAST.ry)**2<=1){round.killed.push(b.id);blown.push(b);}}round.blown=(round.blown||0)+blown.length;}
  if(hit.type===6){round.ammo=0;round.reload=t+1500;round.stolen=(round.stolen||0)+1;}
  if(hit.type===4)round.dark=t+2000;}
 return {hit,blown};
}
/* Rounds started before fix13 (4 hit slots, no evil birds) keep their old loss cap. */
export const birdGain=r=>Math.max((r.hits?.length||4)>4?BIRD_LOSS_CAP:BIRD_LOSS_CAP_OLD,r.sum);

/* ---------- Shared minigame settings (world/minigames) ----------
   fix13: every game costs Halloween coins + sailor hats (bag.item.hat) + music boxes (bag.item.musicbox).
   The owner edits them in settings.fee3 = {game:{coin,hat,mb}}. The old coin-only settings.fees is ignored. */
export const MG_GAMES=['kang','pk','bs','mole','basket','witch','candy'];
export const MG_SOLO=['pk','bs','mole','basket','witch','candy'];
/* fix15: ค่าเข้า ×2 (เหรียญ หมวกกะลาสี กล่องดนตรี ×2 ทั้งหมด) · ค่าที่แอดมินแก้ใหม่เก็บใน settings.fee15 (ค่าเดิมใน fee3 เลิกใช้) */
export const MG_FEE3={bs:{coin:24,hat:160,mb:160},mole:{coin:20,hat:120,mb:120},witch:{coin:20,hat:120,mb:120},pk:{coin:16,hat:100,mb:100},basket:{coin:12,hat:80,mb:80},candy:{coin:12,hat:60,mb:60},kang:{coin:8,hat:40,mb:40}};
export const MG_FEES=Object.fromEntries(Object.entries(MG_FEE3).map(([k,v])=>[k,v.coin]));
export const MG_CD={bs:45,mole:40,witch:40,pk:35,basket:25,candy:20};          // minutes after a finished round
export const MG_MIN={bs:30000,mole:15000,witch:60000,pk:25000,basket:20000,candy:20000};
export const MG_MAX_MS={witch:30*60000,candy:15*60000};                           // an active round older than this is settled as abandoned
export const MG_HOURS={pk:[19,5],bs:[10,18]};
export const MG_NAMES={bs:'ยิงนกฮาโลวีน',mole:'ตุ่นบุกสวน!',witch:'แม่มดซิ่งไม้กวาด',pk:'จิ้มฟักทอง',basket:'จัดตะกร้าให้แม่มด',candy:'โรงงานลูกกวาดต้องคำสาป',kang:'ไพ่แคง'};
export const MG_EMERGENCY='ขออภัย ระบบปิดฉุกเฉิน แวะมาใหม่โอกาสหน้า';
const LEGACY_FEE={pk:2,bs:3,mole:3,basket:3};
export const inHours=(hour,[a,b])=>a<b?hour>=a&&hour<b:hour>=a||hour<b;
const okInt=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
export function minigameRules(settings){
 const s=settings||{},fee3={},hours={pk:[...MG_HOURS.pk],bs:[...MG_HOURS.bs]};
 for(const k of MG_GAMES){const d=MG_FEE3[k],o=s.fee15?.[k]||{};fee3[k]={coin:okInt(o.coin,99)?o.coin:d.coin,hat:okInt(o.hat,999)?o.hat:d.hat,mb:okInt(o.mb,999)?o.mb:d.mb};}
 for(const k of ['pk','bs']){const h=s.hours?.[k];if(Array.isArray(h)&&h.length===2&&h.every(n=>Number.isInteger(n)&&n>=0&&n<=23)&&h[0]!==h[1])hours[k]=[h[0],h[1]];}
 const emergency=!!s.emergency,solo=s.solo||{},off={...(s.off||{})},fees=Object.fromEntries(MG_GAMES.map(k=>[k,fee3[k].coin]));
 return {fees,fee3,hours,emergency,emergencyAt:s.emergencyAt||0,solo,off:k=>emergency||k==='br'||(k==='kang'?!!off[k]:solo[k]==='closed')};
}
/* Owner control: mutates settings in place, throws on bad input. Changes apply to the next entry; nothing is refused because people are seated. */
export function minigameConfigure(settings,input,now){
 const s=settings;s.fee15 ||= {};s.hours ||= {};s.off ||= {};s.solo ||= {};
 if(input.type==='control'){
  if(!MG_GAMES.includes(input.game))fail('เกมไม่ถูกต้อง');
  if(input.game==='kang'){if(!['open','closed','auto'].includes(input.mode))fail('โหมดไม่ถูกต้อง');s.off.kang=input.mode==='closed';}
  else{if(!['auto','open','closed'].includes(input.mode))fail('โหมดไม่ถูกต้อง');s.solo[input.game]=input.mode;}
 }else if(input.type==='fees'){
  // {game:{coin,hat,mb}} (fix13) or {game:coins} from an older panel (coins only, items unchanged).
  const rows=Object.entries(input.fees||{});if(!rows.length)fail('ไม่มีค่าเข้าที่จะบันทึก');const cur=minigameRules(s).fee3;
  for(const[k,v]of rows){if(!MG_GAMES.includes(k))fail('เกมไม่ถูกต้อง');const next={...cur[k],...(typeof v==='number'?{coin:v}:v&&typeof v==='object'?v:{bad:1})};
   if(next.bad||!okInt(next.coin,99))fail('ค่าเข้าต้องเป็น 0–99 เหรียญ');if(!okInt(next.hat,999)||!okInt(next.mb,999))fail('หมวกกะลาสีและกล่องดนตรีต้องเป็น 0–999');
   s.fee15[k]={coin:next.coin,hat:next.hat,mb:next.mb};}
 }else if(input.type==='hours'){
  if(!['pk','bs'].includes(input.game)||![input.from,input.to].every(n=>Number.isInteger(n)&&n>=0&&n<=23)||input.from===input.to)fail('เวลาเปิดไม่ถูกต้อง');s.hours[input.game]=[input.from,input.to];
 }else if(input.type==='emergency'){
  s.emergency=!!input.on;if(s.emergency)s.emergencyAt=now;
 }else fail('รายการควบคุมไม่ถูกต้อง');
 const rules=minigameRules(s);
 if(Array.isArray(s.kang))s.kang.forEach(k=>k&&Object.assign(k,{open:!rules.off('kang'),accept:!rules.off('kang'),fee:rules.fee3.kang.coin,fee3:rules.fee3.kang}));
 s.controlRevision=now;return s;
}
/* ---------- fees: coins + hats + music boxes in one transaction ---------- */
const bagItem=game=>game.bag?.item||{};
export function feeLack(game,coins,fee){const it=bagItem(game),lack=[];
 if((coins||0)<fee.coin)lack.push('🪙 เหรียญอีก '+num(fee.coin-(coins||0)));
 if((Number(it.hat)||0)<fee.hat)lack.push('👒 หมวกกะลาสีอีก '+num(fee.hat-(Number(it.hat)||0)));
 if((Number(it.musicbox)||0)<fee.mb)lack.push('🎵 กล่องดนตรีอีก '+num(fee.mb-(Number(it.musicbox)||0)));
 return lack;}
/* Checks everything first; nothing is taken unless all of it is there. Returns the new coin balance. */
export function payFee(game,coins,fee,minMerit=0){const lack=feeLack(game,coins,fee);if((game.merit||0)<minMerit)lack.push('✨ กุศลขั้นต่ำ '+num(minMerit));
 if(lack.length)fail('ยังเล่นไม่ได้ ขาด '+lack.join(' · '));
 if(fee.hat||fee.mb){game.bag ||= {};game.bag.item ||= {};if(fee.hat)game.bag.item.hat=(Number(game.bag.item.hat)||0)-fee.hat;if(fee.mb)game.bag.item.musicbox=(Number(game.bag.item.musicbox)||0)-fee.mb;}
 return coins-fee.coin;}
/* What a round actually paid: fix13 {coin,hat,mb}; fix12 coins only; older rounds the legacy coin fee. */
export const paidFee=(r,k)=>r?.fee&&typeof r.fee==='object'?{coin:r.fee.coin||0,hat:r.fee.hat||0,mb:r.fee.mb||0}:{coin:Number.isSafeInteger(r?.fee)?r.fee:(LEGACY_FEE[k]||0),hat:0,mb:0};
/* Gives back a fee inside the player's own transaction (added to the balances read in it, never overwritten). */
export function refundInto(game,coins,fee){if(fee.hat||fee.mb){game.bag ||= {};game.bag.item ||= {};if(fee.hat)game.bag.item.hat=(Number(game.bag.item.hat)||0)+fee.hat;if(fee.mb)game.bag.item.musicbox=(Number(game.bag.item.musicbox)||0)+fee.mb;}return coins+fee.coin;}
/* Mail items for a refunded fee (claimed through the normal mail path: catalog keys hat / musicbox). */
export const feeMailItems=fee=>Object.fromEntries([['hat',fee.hat||0],['musicbox',fee.mb||0]].filter(([,n])=>n>0));

export function soloPublic(state){const out=structuredClone(state);if(out.pk?.phase==='active')delete out.pk.kind;
 for(const k of ['witch','candy'])if(out[k])for(const key of Object.keys(out[k]))if(key.startsWith('_'))delete out[k][key];return out;}
const EXT={witch:{start:witchStart,cp:witchCheckpoint,finish:witchFinish,abandon:witchAbandon,icon:'🧹'},candy:{start:candyStart,cp:candyCheckpoint,finish:candyFinish,abandon:candyAbandon,icon:'🍭'}};
const MAX_CP=12;
export function soloAction(source,account,ctx,input,rng=Math.random){const state=structuredClone(source||{}),game=structuredClone(account);game.sub ||= {};const progress=game.sub.minigames ||= {cd:{},escrows:{}};progress.cd ||= {};let coins=ctx.coins;const rewards=[];const hours=bkkHour(ctx.now),nonce=ctx.nonce;
 const rules=ctx.rules||minigameRules({solo:ctx.controls||{}}),fee3=rules.fee3;
 const opened=(k,scheduled)=>!rules.emergency&&(rules.solo[k]==='open'||rules.solo[k]!=='closed'&&scheduled);
 const hh=k=>rules.hours[k].map(h=>String(h).padStart(2,'0')+':00').join('–');
 const cdLeft=k=>Math.max(1,Math.ceil(((progress.cd[k]||0)-ctx.now)/60000));
 const reward=(key,icon,title,merit,items={})=>rewards.push({key:'minigames-'+key,icon,title,merit,items});
 /* Emergency close voids every unfinished solo round (no merit change) and returns everything it paid. */
 const voided=[];
 for(const k of MG_SOLO){const r=state[k];if(r?.phase!=='active')continue;const paid=r.paidAt??r.start??0;if(rules.emergency||rules.emergencyAt&&paid<=rules.emergencyAt){const fee=paidFee(r,k);r.phase='void';coins=refundInto(game,coins,fee);voided.push({game:k,coins:fee.coin,hat:fee.hat,mb:fee.mb});}}
 /* Witch / candy rounds left past their maximum length (pauses included) are settled from their last checkpoint. */
 const settleExt=(k,res)=>{const r=state[k],gain=Math.round(Number(res?.gain));if(!Number.isSafeInteger(gain))fail('ผลรอบไม่ถูกต้อง');r.phase='done';r.gain=gain;r.breakdown=res.breakdown??null;r.doneAt=ctx.now;progress.cd[k]=ctx.now+MG_CD[k]*60000;
  if(gain>0)reward(k,EXT[k].icon,MG_NAMES[k]+' +'+num(gain)+' กุศล',gain);else if(gain<0){const m0=game.merit||0;game.merit=Math.max(Math.min(m0,0),m0+gain);}return r;};
 const overdue=(k,r)=>r?.phase==='active'&&ctx.now-(r.startedAt??r.paidAt??0)>(r.maxMs||MG_MAX_MS[k])+60000;   // one minute of grace for a late finish
 const abandoned=[];
 if(!rules.emergency)for(const k of ['witch','candy'])if(overdue(k,state[k])){settleExt(k,EXT[k].abandon(structuredClone(state[k]),ctx.now));state[k].abandoned=true;abandoned.push(k);}
 const result=()=>({state,game,coins,reward:rewards[0]||null,rewards,voided,abandoned});
 if(rules.emergency&&/-start$/.test(String(input.type)))fail(MG_EMERGENCY);
 const checkStart=(k,scheduled=true)=>{if(!opened(k,scheduled))fail(MG_HOURS[k]&&rules.solo[k]!=='closed'?MG_NAMES[k]+' เปิด '+hh(k)+' เวลาไทย':MG_NAMES[k]+' ปิดอยู่ชั่วคราว');
  if((progress.cd[k]||0)>ctx.now)fail('⏳ พัก'+MG_NAMES[k]+'อีก '+cdLeft(k)+' นาที');const fee={...fee3[k]};coins=payFee(game,coins,fee,MG_MIN[k]);return fee;};
 if(input.type==='status'){state.offer=state.offer?withEvil(state.offer):birdOffer(nonce);state.moleOffer ||= moleRound(rng,0,'offer');state.basketOffer ||= basketRound(rng,0,'offer');return result();}
 if(input.type==='pk-start'){
  if(state.pk?.phase==='active')return result();const fee=checkStart('pk',inHours(hours,rules.hours.pk));const angels=int(rng,5,10);state.pk={id:nonce,phase:'active',start:ctx.now,paidAt:ctx.now,fee,kind:shuffle(rng,Array.from({length:16},(_,i)=>i<angels?'angel':'devil'))};return result();
 }
 if(input.type==='pk-finish'){
  const r=state.pk;if(!r||r.phase!=='active'||r.id!==input.round)fail('รอบจิ้มฟักทองไม่ถูกต้อง');const picks=input.picks;if(!Array.isArray(picks)||picks.length!==4||new Set(picks).size!==4||picks.some(i=>!Number.isInteger(i)||i<0||i>15))fail('เลือกฟักทอง 4 ลูกที่ต่างกัน');r.picks=picks;r.angels=picks.filter(i=>r.kind[i]==='angel').length;r.phase='done';progress.cd.pk=ctx.now+MG_CD.pk*60000;const merit={4:100000,3:20000,2:0,1:-5000,0:-15000}[r.angels];
  if(merit>0)reward('pk','🎃','จิ้มฟักทอง +'+num(merit)+' กุศล',merit);else if(r.angels===2)reward('pk','📦','รางวัลปลอบใจจิ้มฟักทอง',0,{'bird-box-ostrich':10,'bird-box-dodo':10});else game.merit=Math.max(0,(game.merit||0)+merit);r.gain=merit;return result();
 }
 if(input.type==='bs-start'){
  if(state.bs?.phase==='active'&&ctx.now<state.bs.until)return result();if(state.bs?.phase==='active')fail('รับผลรอบเดิมก่อน');const fee=checkStart('bs',inHours(hours,rules.hours.bs));
  state.offer=state.offer?withEvil(state.offer):birdOffer(nonce);
  state.bs={id:nonce,v:13,phase:'active',start:ctx.now,paidAt:ctx.now,fee,until:ctx.now+60000,values:state.offer,flights:birdFlights(nonce,state.offer),killed:[],hits:[0,0,0,0,0,0,0],count:0,sum:0,ammo:6,reload:0,recent:[],shots:0,blown:0,stolen:0};return result();
 }
 if(input.type==='bs-shot'||input.type==='bs-shots'){
  const r=state.bs;if(!r||r.phase!=='active'||r.id!==input.round)fail('รอบยิงนกไม่ถูกต้อง');const shots=input.type==='bs-shot'?[input]:input.shots;
  if(!Array.isArray(shots)||!shots.length||shots.length>40)fail('รายการยิงไม่ถูกต้อง');
  const maxAge=input.type==='bs-shot'?2000:15000;
  for(const shot of shots){if(ctx.now>r.until+maxAge||shot.t>ctx.now-r.start+500||ctx.now-r.start-shot.t>maxAge)fail('เวลายิงหมดแล้วหรือรายการเก่า');fireBird(r,shot);}return result();
 }
 if(input.type==='bs-finish'){
  const r=state.bs;if(!r||r.phase!=='active'||r.id!==input.round||ctx.now<r.until)fail('รอบยิงนกยังไม่จบ');r.phase='done';r.gain=birdGain(r);progress.cd.bs=ctx.now+MG_CD.bs*60000;if(r.gain>0)reward('bs','🐦','ยิงนกฮาโลวีน +'+num(r.gain)+' กุศล',r.gain);else game.merit=Math.max(0,(game.merit||0)+r.gain);state.offer=birdOffer(nonce);return result();
 }
 const roundStart=(key,grace0,make)=>{const cur=state[key];if(cur?.phase==='active'&&ctx.now<cur.until+grace0)return result();if(cur?.phase==='active')fail('รับผลรอบเดิมก่อน');const fee=checkStart(key);state[key]={...make(),paidAt:ctx.now,fee};return result();};
 const settle=(key,res,icon,title)=>{const r=state[key];r.phase='done';r.result=res;state[key+'Offer']=key==='mole'?moleRound(rng,0,'offer'):basketRound(rng,0,'offer');progress.cd[key]=ctx.now+MG_CD[key]*60000;if(res.merit>0)reward(key,icon,title+' +'+num(res.merit)+' กุศล',res.merit);else if(res.merit<0)game.merit=Math.max(0,(game.merit||0)+res.merit);return result();};
 if(input.type==='mole-start')return roundStart('mole',0,()=>{const o=state.moleOffer||moleRound(rng,0,nonce);delete state.moleOffer;return {...o,id:nonce,phase:'active',start:ctx.now+3000,until:ctx.now+3000+MOLE.length};});
 if(input.type==='mole-hits'){const r=state.mole;if(!r||r.id!==input.round)fail('รอบตีตุ่นไม่ถูกต้อง');moleHits(r,input.hits,ctx.now);return result();}
 if(input.type==='mole-finish'){const r=state.mole;if(!r||r.phase!=='active'||r.id!==input.round||ctx.now<r.until)fail('รอบตีตุ่นยังไม่จบ');return settle('mole',moleResult(r),'🔨','ตีตุ่น');}
 if(input.type==='basket-start')return roundStart('basket',BASKET.grace,()=>{const o=state.basketOffer||basketRound(rng,0,nonce);delete state.basketOffer;return {...o,id:nonce,phase:'active',start:ctx.now+3000,until:ctx.now+3000+BASKET.length};});
 if(input.type==='basket-send'){const r=state.basket;if(!r||r.id!==input.round)fail('รอบจัดตะกร้าไม่ถูกต้อง');basketSend(r,input.witch,input.items,ctx.now);return result();}
 if(input.type==='basket-finish'){const r=state.basket;if(!r||r.phase!=='active'||r.id!==input.round||(ctx.now<r.until&&r.sent.some(x=>!x)))fail('รอบจัดตะกร้ายังไม่จบ');return settle('basket',basketResult(r),'🧺','จัดตะกร้าให้แม่มด');}
 /* ---------- แม่มดซิ่ง / โรงงานลูกกวาด: rounds run in their own page; the server checks start, checkpoints and the final report ---------- */
 const m=/^(witch|candy)-(start|cp|finish)$/.exec(String(input.type));
 if(m){const [,k,op]=m,E=EXT[k];let r=state[k];
  if(op==='start'){
   if(abandoned.includes(k))return result();             // the old round was just settled: show that result first
   if(r?.phase==='active')return result();                // resume the same round
   const fee=checkStart(k),round=E.start(rng,ctx.now)||{};
   state[k]={...round,id:nonce,phase:'active',fee,paidAt:ctx.now,startedAt:Number.isFinite(round.startedAt)?round.startedAt:ctx.now,cpn:0};return result();
  }
  if(!r||r.id!==input.round)fail('รอบเกมไม่ถูกต้อง กรุณาเปิดเกมใหม่');
  if(r.phase!=='active'){if(abandoned.includes(k)||op==='finish'&&r.phase==='done')return result();fail('รอบนี้จบแล้ว');}
  if(op==='cp'){if((r.cpn||0)>=MAX_CP)return result();const keep={id:r.id,phase:r.phase,fee:r.fee,paidAt:r.paidAt,startedAt:r.startedAt,cpn:(r.cpn||0)+1};state[k]={...(E.cp(structuredClone(r),input.cp,ctx.now)||r),...keep};return result();}
  settleExt(k,E.finish(structuredClone(r),input.report,ctx.now));return result();
 }
 fail('รายการมินิเกมไม่ถูกต้อง');
}
