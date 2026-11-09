import {rumorAction,RUMOR_GOOD,RUMOR_BAD,RUMOR_TIME} from './rumor-engine.js?h=0b77dfba';
import {foodCraftAction,luxFeedAction} from './food-craft-engine.js?h=478bcc41';
import {safariAction} from './safari-engine.js?h=e590b6b9';
import {adminCenter} from './admin-center-engine.js?h=7611e019';
import {adminReset} from './admin-reset.js?h=57055b90';
import {openLootBoxes} from './loot-box-engine.js?h=8e23fae8';
import {farmDropsAction} from './farm-drops-engine.js?h=97968586';
import {onSchedule} from 'firebase-functions/v2/scheduler';
import {farmAction,friendAction} from './farm-engine.js?h=45dd755f';
import {splitGame,joinGame} from './save-schema.js?h=eef4832b';
import {observeGameplay} from './campaign-progress.js?h=3f8f0ba3';
import {marketAction,HW_POISON,HW_ANTI,HW_DECIDE,antiHave,poisonApply,poisonExpired,poisonStartClocks} from './market-engine.js?h=05343b2a';
import {soloAction,soloPublic,minigameRules,minigameConfigure,feeMailItems} from './solo-engine.js?h=a8d2168e';
import {kangAction,freshKang,kangPublic,kangFeePaid,kangItemsPaid,kangClear} from './kang-engine.js?h=82312623';
import {recordCampaign,FISH_EVENTS,honeyMultiplier} from './campaigns-engine.js?h=a073b41e';
import {randomUUID,randomInt,createHash} from 'node:crypto';
import {ATM_CARD,BANKS,bankOk,bankPrime,bankGold,bankBonus,atmFeeRate,atmUses,atmUse,atmSentN,ATM_PER_DAY,ATM_BONUS_EVERY,ATM_BONUS,atmHasCard,atmToday,atmCanSend,atmCheckAmount,atmPinOk,atmCheckPin,atmRecord,atmPushHist,atmDay,FX_PER_DAY,FX_MAX,fxRateCents,fxPay,fxToday,fxCheck,fxRecord} from './atm-engine.js?h=bce581be';
import {fishingAction,freshFishing,fishingPublic} from './fishing-engine.js?h=19bb27fe';
import {outingsAction} from './outings-engine.js?h=7e68cf3c';
import {farmshopAction,freshFarmshop} from './farmshop-engine.js?h=02866494';
import {CATALOG as CATALOG_ALL} from './catalog.js?h=3eb9d621';
import {NB_HOUSE_UP,NB_THEMES,NB_DECO_MAX,bagTotal,bagTake,nbHouseOf,nbHousesTick,NB_MIN,NB_MAX,NB_LOCK,NB_GIFT_DAY,NB_GIFT_KINDS,NB_GIFT_MAX,NB_FINE,NB_EMBLEMS,NB_STICKERS,NB_COST,nbProgress,bagGet,bagPut,costDone,cleanName} from './nb-engine.js?h=99f92a56';
import {nbDay} from './nb-quest.js?h=8e07529b';
import {funrunAction,funrunPublic} from './funrun-engine.js?h=e2d97b72';
import {initializeApp} from 'firebase-admin/app';
import {getFirestore,FieldValue,FieldPath,Timestamp} from 'firebase-admin/firestore';
import {onCall,HttpsError} from 'firebase-functions/v2/https';
import {createCloudCore,refuse} from './cloud-core.js?h=205d552f';
import {boatAction,freshBoat,publicBoat,myPicks} from './boat-engine.js?h=43f2e47f';
import {rainLogic,rainGoldOpen,RAIN_MS,RAIN_GOLD_MAX} from './rain-engine.js?h=2e082531';
import {TW_TH,TW_TREES,TW_PICK_OPEN,TW_PICK_TIME,TW_MERIT,TW_PRANKS,TW_CUT,TW_ROB,TW_ROB_HOUSES,TW_CUT4,TW_SURPRISE,TW_SURPRISE_MERIT,TW_SHIELD_DROP,TW_AXES,TW_CATS,TW_BAT_MS,TW_BAT_WARN,TW_BAT_SETTLE,TW_BAT_LEVELS,twRoundAt,twNextRound,twHouseScore,twRank,twShuffle,twSupply,twBatLogic,twBatScore} from './tree-engine.js?h=14a5ec48';
import {hwmAction} from './hwmini-engine.js?h=0b53b869';
import {mahakusalAction,mkBoxCounts,MK_FISH_DROP} from './mahakusal-engine.js?h=30175f9e';
import {DEMON,DEMON_NOPE,PET_BOXES,dmView,dmActive,demonSync,demonSend,demonToss,petRoll,boxRoll,victimSettle,coffinOpen,hourFlip,heartPass,heartPay,ghostGive,ghostSend,ghostClear} from './demon-engine.js?h=5c8a0990';
import {factoryOrder,factoryClaim,factoryBattery} from './alpaca-factory-engine.js?h=984832ff';
import {charAction,charAdminSet,charOf} from './char-engine.js?h=2f29be8e';import {TRIBES,TRIBE_IDS} from './outfit-catalog.js?h=16ac9bbc';
import {cityAction,cityAdmin,cityView,publicWorld,manState} from './city-engine.js?h=44c22f95';import {pageantAdmin,pageantAction,pageantView,garland,questionDoc} from './pageant-engine.js?h=57a4a41c';import {YAINOO_QUESTIONS,GENERAL_QUESTIONS} from './city-questions.js?h=10246fe6';import {MAX_IN_CITY,MAN} from './city-catalog.js?h=d68f3e58';
initializeApp();
const db=getFirestore(),core=createCloudCore(db,()=>FieldValue.serverTimestamp());
const options={region:'us-central1',minInstances:0,maxInstances:3,memory:'512MiB',timeoutSeconds:60};
const callable=(fn,opt=options)=>onCall(opt,async req=>{
 if(!req.auth)throw new HttpsError('unauthenticated','กรุณาเข้าสู่ระบบ');
 try{return await fn(req);}catch(e){console.error('SS3 recovery6 callable failure',e.code||'exception',e.message,e.stack);if(e instanceof HttpsError)throw e;throw new HttpsError(['invalid-argument','unauthenticated','permission-denied','aborted','resource-exhausted','failed-precondition'].includes(e.code)?e.code:'failed-precondition',e.message||'ทำรายการไม่สำเร็จ');}
});
export const gameApiStatus=callable(async()=>({release:'ss3-recovery6'}));
export const adminCenterCloud=callable(req=>adminCenter(db,req.auth.uid,req.data,{timestamp:()=>FieldValue.serverTimestamp(),increment:n=>FieldValue.increment(n),expires:n=>Timestamp.fromMillis(n)}));
/* S4 ข้อ 162 🧹 เริ่มศูนย์ผู้เล่น (ดูก่อน/ล้างจริง · สำรองก่อน · ทั้งหมดครั้งเดียวต่อซีซั่น) */
export const adminResetCloud=callable(req=>adminReset(db,req.auth.uid,req.data||{},{timestamp:()=>FieldValue.serverTimestamp(),increment:n=>FieldValue.increment(n),expires:n=>Timestamp.fromMillis(n)}));
/* fix13 roster: one document (privateWorld/roster) instead of reading every player on each open of boat / friend shop /
   Top Spenders. Rebuilt (all players, no 200 cap) when missing, when player/pending/rejected counts change (sign-up,
   approve, reject), every 6 h (catches console renames), or on {rebuild:true} from an admin. A player's own name/approval
   is synced when they open a roster page. Same list shape as before: {uid,name,merit,level,admin,at}.
   fix14: the friends ranking shows merit, so the list is rebuilt every 10 minutes (was 6 h) and the caller's own merit is
   always read live; `at` = when the other players' numbers were taken. */
const ROSTER_PATH='privateWorld/roster',ROSTER_REFRESH=15e3,ROSTER_PAGE=300;
const rosterRow=d=>({n:String(d.name||'ผู้เล่น'),m:d.displayMerit??d.g?.merit??0,l:d.level||1,a:d.approval||'approved',...(d.nb?{h:1}:{}),...(typeof d.avatar==='string'&&d.avatar.length<4000?{v:d.avatar}:{})});
async function rosterCounts(){
 const players=db.collection('players');if(typeof players.count!=='function')return null;
 const [all,pending,rejected]=await Promise.all([players.count().get(),players.where('approval','==','pending').count().get(),players.where('approval','==','rejected').count().get()]);
 return {total:all.data().count,pending:pending.data().count,rejected:rejected.data().count};
}
async function buildRoster(counts){
 const rows={};let last=null;
 for(let pages=0;pages<200;pages++){
  let q=db.collection('players').orderBy(FieldPath.documentId()).limit(ROSTER_PAGE);if(last)q=q.startAfter(last);
  const snap=await q.get();for(const d of snap.docs)rows[d.id]=rosterRow(d.data());
  if(snap.docs.length<ROSTER_PAGE)break;last=snap.docs.at(-1);
 }
 const roster={v:1,rows,builtAt:Date.now(),...(counts||{})};await db.doc(ROSTER_PATH).set(roster);return roster;
}
const rosterList=(roster,ownerIds,me)=>Object.keys(roster.rows).sort().map(uid=>[uid,roster.rows[uid]]).filter(([uid,r])=>r.a==='approved'||ownerIds.has(uid)).map(([uid,r])=>({uid,name:r.n,av:r.v||null,merit:me&&uid===me.id?rosterRow(me.data()).m:r.m,level:r.l,admin:ownerIds.has(uid),hasNb:!!(me&&uid===me.id?me.data().nb:r.h),at:roster.builtAt||0}));
export const gameRoster=callable(async req=>{
 const ref=db.doc(ROSTER_PATH);
 const [snap,owners,me,counts]=await Promise.all([ref.get(),db.collection('admins').limit(20).get(),db.doc('players/'+req.auth.uid).get(),rosterCounts().catch(()=>null)]);
 const ownerIds=new Set(owners.docs.map(d=>d.id));
 if(!ownerIds.has(req.auth.uid)&&(!me.exists||me.data().approval&&me.data().approval!=='approved'))refuse('รออนุมัติสมาชิก','permission-denied');
 let roster=snap.exists?snap.data():null;
 const stale=!roster||roster.v!==1||!roster.rows||Date.now()-(roster.builtAt||0)>ROSTER_REFRESH||(req.data?.rebuild===true&&ownerIds.has(req.auth.uid))
  ||(counts&&(counts.total!==roster.total||counts.pending!==roster.pending||counts.rejected!==roster.rejected));
 if(stale)roster=await buildRoster(counts);
 else if(me.exists){const row=rosterRow(me.data()),old=roster.rows[req.auth.uid];if(!old||old.n!==row.n||old.a!==row.a||old.v!==row.v){roster.rows[req.auth.uid]=row;await ref.set(roster);}}
 return rosterList(roster,ownerIds,me.exists?me:null);
});
// Key-order-insensitive equality (Firestore does not keep the key order an object was written with).
const canonical=v=>JSON.stringify(v,(k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(key=>[key,x[key]])):x);
const sameData=(a,b)=>canonical(a)===canonical(b);
/* fix17 ⛈️ ฝนกุศลระหว่างฝนตก (ไม่ผ่านประตูลำดับรายการ ไม่แตะเซฟ): ฟองทอง (คนแรกคนเดียว) · คะแนนสดของทีมทุก ~5 วินาที
   privateWorld/rain = {id,seed,lvl,start,end,team:{uid:boat},names:{uid:name},gold:{gid:uid}} · world/rainLive = ฟองทองที่ถูกเก็บแล้ว · world/rainLive-{b} = คะแนนสดของลูกทีม */
async function boatRaw(uid,input){
 const type=input?.type,id=input?.id;if(typeof id!=='string'||id.length>40)refuse('ฝนรอบนี้จบไปแล้ว','invalid-argument');
 if(type==='rainGold'){const gid=input.gid;if(!Number.isSafeInteger(gid)||gid<0||gid>5000)refuse('ฟองไม่ถูกต้อง','invalid-argument');
  return db.runTransaction(async tx=>{const ref=db.doc('privateWorld/rain'),snap=await tx.get(ref),rain=snap.exists?snap.data():null;
   if(!rain||rain.id!==id)return {ok:false,over:true};const boat=rain.team?.[uid];if(!boat)return {ok:false,out:true};
   const b=rainLogic(rain.seed).find(x=>x.id===gid);if(!b||b.type!=='gold')refuse('ฟองไม่ถูกต้อง','invalid-argument');
   if(!rainGoldOpen(b,Date.now()-rain.start))return {ok:false,late:true};
   const by=rain.gold?.[gid];if(by)return {ok:false,by:rain.names?.[by]||'ลูกเรือ',boat:rain.team?.[by]||0,mine:by===uid};
   if(Object.values(rain.gold||{}).filter(u=>u===uid).length>=RAIN_GOLD_MAX)return {ok:false,full:true};
   rain.gold={...(rain.gold||{}),[gid]:uid};tx.set(ref,rain);tx.set(db.doc('world/rainLive'),{id,gold:{[gid]:{b:boat,n:String(rain.names?.[uid]||'ลูกเรือ').slice(0,40)}}},{merge:true});return {ok:true};});}
 if(type==='rainPing'){const net=Number(input.net);if(!Number.isFinite(net))refuse('ข้อมูลไม่ถูกต้อง','invalid-argument');
  const snap=await db.doc('privateWorld/rain').get(),rain=snap.exists?snap.data():null,now=Date.now();
  if(!rain||rain.id!==id||now<rain.start-2000||now>rain.end+5000)return {ok:false};const boat=rain.team?.[uid];if(!boat)return {ok:false};
  await db.doc('world/rainLive-'+boat).set({id,s:{[uid]:Math.max(-1e9,Math.min(1e9,Math.round(net)))}},{merge:true});return {ok:true};}
 refuse('คำสั่งไม่ถูกต้อง','invalid-argument');
}
export const boatActionCloud=callable(async req=>{
 if(req.data?.raw===true)return boatRaw(req.auth.uid,req.data?.input||{});
 const input=req.data?.input||{};delete input.goldsMine;
 const rainEnd=input.type==='rainEnd';
 // fix13: page-open status is answered without a transaction when it changes nothing (peek); otherwise the full transaction runs.
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'boat',worldIds:rainEnd?['privateWorld/boat','privateWorld/rain']:['privateWorld/boat'],peek:input.type==='status',apply:async(game,worlds,ctx,tx)=>{
   const current=worlds['privateWorld/boat']||freshBoat();
   if(rainEnd){const rd=worlds['privateWorld/rain'];input.goldsMine=rd&&rd.id===input.id?Object.entries(rd.gold||{}).filter(([,u])=>u===ctx.uid).map(([g])=>Number(g)):[];}
   if(input.type==='teams'||input.type==='addMember') {
     if(!ctx.admin)refuse('เฉพาะแอดมิน','permission-denied');
     // ตรวจเฉพาะคนที่ถูกแก้: ลำที่บันทึก / คนที่ย้ายหรือเพิ่มใหม่ / คนที่เพิ่มระหว่างแข่ง
     const perBoat=input.type==='teams'&&Number.isInteger(input.boat)&&Array.isArray(input.members),team=input.team&&typeof input.team==='object'?input.team:{};
     const uids=[...new Set(input.type==='addMember'?[input.uid]:perBoat?input.members:Object.keys(team).filter(uid=>current.team?.[uid]!==team[uid]))];
     if(uids.length>200||uids.some(uid=>typeof uid!=='string'||!/^[-a-zA-Z0-9_]{1,128}$/.test(uid)))refuse('สมาชิกไม่ถูกต้อง','invalid-argument');
     const [users,admins]=await Promise.all([Promise.all(uids.map(uid=>tx.get(db.doc('players/'+uid)))),Promise.all(uids.map(uid=>tx.get(db.doc('admins/'+uid))))]);
     const bad=uids.filter((uid,i)=>!users[i].exists||users[i].data().approval&&users[i].data().approval!=='approved'||admins[i].exists);
     if(bad.length&&input.drop===true&&input.type==='teams'&&!perBoat){for(const uid of bad)delete team[uid];input.team=team;}
     else if(bad.length){const i=uids.indexOf(bad[0]);refuse(admins[i].exists?'แอดมินเป็นผู้จัดการแข่งขัน ไม่อยู่ทีมแข่ง':'ยังไม่อนุมัติหรือไม่พบสมาชิก: '+(users[i].exists?users[i].data().name||bad[0]:bad[0]));}
     input.roster=uids.filter(uid=>!bad.includes(uid));
     input.names=Object.fromEntries(uids.flatMap((uid,i)=>bad.includes(uid)?[]:[[uid,String(users[i].data().name||'ลูกเรือ')]]));
   } else {delete input.roster;delete input.names;}
   if(input.type==='supply'&&input.group!=='alpaca') {
     const path=(input.group==='food'?'food.':input.group==='drink'?'drink.':'gfood.')+input.food;
     const {CATALOG}=await import('./catalog.js?h=3eb9d621');
     if(!CATALOG.some(c=>c.p===path))refuse('อาหารไม่ถูกต้อง','invalid-argument');
   }
   if(input.type==='card'){const box=(current.boxes||[]).find(b=>b.id===input.box);if(box){const card=box.deck?.[input.index];input.target=['cut','cut1','burn','ink','crab'].includes(card)?input.targetBoat:input.targetPerson;}}
   const out=input.type==='claimCredit'?{race:structuredClone(current),player:game,ledger:[]}:boatAction(current,game,ctx,input,()=>randomInt(4294967296)/4294967296);
   // รางวัลค้างจากรุ่นเก่าเท่านั้น: การ์ดกุศลรุ่นใหม่ไม่ใส่ credits และไม่ผ่านไปรษณีย์แล้ว
   const recipients=Object.keys(out.race.credits||{}).filter(uid=>(out.race.credits[uid]||0)>(out.race.claimedCredits?.[uid]||0));
   const profiles=await Promise.all(recipients.map(uid=>tx.get(db.doc('players/'+uid)))),priorMails=await Promise.all(recipients.map(uid=>tx.get(db.doc('mail/'+uid+'/items/boat-rewards'))));const writes={},updates={};let mailDelta=0;
   recipients.forEach((uid,i)=>{if(!profiles[i].exists)return;const credit=out.race.credits[uid]-(out.race.claimedCredits[uid]||0),old=priorMails[i].exists?priorMails[i].data():{};writes['mail/'+uid+'/items/boat-rewards']={title:'รางวัลทีมแข่งเรือสะสม',msg:'สมาชิกทีมได้รับรางวัลการ์ดกุศล',icon:'🚤',kusal:(old.kusal||0)+credit,coins:0,items:{},createdAt:FieldValue.serverTimestamp(),from:'แข่งเรือ'};out.race.claimedCredits[uid]=out.race.credits[uid];if(!priorMails[i].exists){updates['players/'+uid]={mailCount:FieldValue.increment(1)};if(uid===ctx.uid)mailDelta++;}});
   // การ์ดกุศล: เข้ากระเป๋าสมาชิกทุกคนผ่าน ledger ในธุรกรรมเดียวกัน (ส่วนของผู้กดเพิ่มเข้า game.merit ตรงแล้ว)
   for(const e of out.ledger||[])if(!e.self&&e.uid!==ctx.uid)writes['players/'+e.uid+'/ledger/'+e.id]={merit:e.merit,title:e.title||'การ์ดกุศลเรือพาย',msg:e.msg||'ทีมเรือ '+e.boat+' ได้การ์ดกุศล',at:FieldValue.serverTimestamp(),source:'boat'};
   // fix15f: ไปรษณีย์ (คืนของเผาเรือ · นางเงือกตัวปลอม · ค่าประกอบวิชาชีพ) และมุมมองส่วนตัวของนางเงือก (players/{uid}/gameViews/mermaid)
   const mailN={},mailTo=[...new Set((out.mails||[]).map(m=>m.uid))],mailRoots=await Promise.all(mailTo.map(uid=>tx.get(db.doc('players/'+uid))));
   for(const m of out.mails||[]){const i=mailTo.indexOf(m.uid);if(!mailRoots[i].exists)continue;
     writes['mail/'+m.uid+'/items/'+m.key]={title:m.title,msg:m.msg,icon:m.icon||'🚤',kusal:m.kusal||0,coins:m.coins||0,items:m.items||{},createdAt:FieldValue.serverTimestamp(),from:'แข่งเรือ'};
     mailN[m.uid]=(mailN[m.uid]||0)+1;if(m.uid===ctx.uid)mailDelta++;}
   for(const [uid,n] of Object.entries(mailN))updates['players/'+uid]={...(updates['players/'+uid]||{}),mailCount:FieldValue.increment(n+((updates['players/'+uid]?.mailCount)?1:0))};
   const rainOn=out.race.rain&&!out.race.rain.done&&ctx.now<out.race.rain.end?{id:out.race.rain.id,lvl:out.race.rain.lvl,start:out.race.rain.start,end:out.race.rain.end}:null;
   for(const v of out.views||[])writes['players/'+v.uid+'/gameViews/mermaid']={...v.data,...(rainOn?{rain:rainOn}:{}),updatedAt:ctx.now};
   // fix17 ⛈️ แอดมินเรียกฝน: เอกสารฝน + กระดานสด + แจ้งเตือน 15 วิทุกหน้าของลูกเรือ (gameViews/mermaid แบบ merge ไม่ทับข้อมูลนางเงือก)
   const merges={};
   /* fix18: ข้อเสนออยู่ต่อ → แจ้งทุกหน้า (players/{uid}/gameViews/boatOffer) · ออกเพราะไม่อยู่ในเกม → การ์ดแจ้งครั้งเดียวตอนกลับมา */
   {const o0=current.offers||{},o1=out.race.offers||{},a0=current.away||{},a1=out.race.away||{};
    for(const u of new Set([...Object.keys(o0),...Object.keys(o1)])){const x=o1[u];
      if(x&&JSON.stringify(x)!==JSON.stringify(o0[u]))merges['players/'+u+'/gameViews/boatOffer']={offer:{until:x.until,n:x.n,by:x.by,swim:!!x.swim},updatedAt:ctx.now};
      else if(!x&&o0[u])merges['players/'+u+'/gameViews/boatOffer']={offer:null,updatedAt:ctx.now};}
    for(const [u,w] of Object.entries(a1))if(!a0[u]||a0[u].at!==w.at)merges['players/'+u+'/gameViews/boatOffer']={offer:null,away:{at:w.at,boat:w.boat},updatedAt:ctx.now};}
   if(out.rainCall){const rc=out.rainCall,team={},names={};for(const [u,b] of Object.entries(out.race.team||{})){team[u]=b;names[u]=String(out.race.names?.[u]||'ลูกเรือ').slice(0,40);}
     writes['privateWorld/rain']={id:rc.id,seed:rc.seed,lvl:rc.lvl,start:rc.start,end:rc.end,team,names,gold:{}};writes['world/rainLive']={id:rc.id,gold:{}};
     for(const b of [1,2,3,4,5])writes['world/rainLive-'+b]={id:rc.id,s:{}};
     for(const u of Object.keys(team))if(!writes['players/'+u+'/gameViews/mermaid'])merges['players/'+u+'/gameViews/mermaid']={rain:{id:rc.id,lvl:rc.lvl,start:rc.start,end:rc.end}};}
   Object.assign(game,out.player);const view={...publicBoat(out.race),serverNow:ctx.now};
    if(!sameData(out.race,current)){writes['privateWorld/boat']=out.race;writes['world/boat']=view;}// fix15f: เขียนเฉพาะเมื่อข้อมูลการแข่งเปลี่ยน (กดนางเงือกไม่เขียนทั้งการแข่ง)
   const meritSelf=(out.ledger||[]).filter(e=>e.self).map(e=>({boat:e.boat,merit:e.merit,...(e.title?{title:e.title}:{})}));
   return {writes,updates,merges,mailDelta,...(out.coins!==undefined?{coins:out.coins}:{}),response:{race:view,card:out.card||null,reveal:out.reveal||null,serverNow:ctx.now,meritSelf,myPicks:myPicks(out.race,ctx.uid),...(out.rain?{rain:out.rain}:{}),...(out.mmSend?{mmSend:out.mmSend}:{}),...(out.swimBack?{swimBack:out.swimBack}:{}),...(out.stay?{stay:out.stay}:{}),...(out.supply?{supply:out.supply}:{}),...(out.poke?{poke:out.poke}:{}),...(out.check?{check:out.check}:{}),...(out.fire!==undefined?{fire:out.fire}:{}),...(out.fires?{fires:out.fires}:{}),...(out.burnPaid?{burnPaid:out.burnPaid,saved:!!out.saved}:{})}};
 }});
});

export const farmshopActionCloud=callable(async req=>{
 const input=req.data?.input||{},seller=input.seller||req.auth.uid;
 if(typeof seller!=='string'||!/^[-a-zA-Z0-9_]{1,128}$/.test(seller))refuse('ร้านไม่ถูกต้อง','invalid-argument');
 const path='world/farmshop-'+seller;
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'farmshop',partIds:['inventory','wallet','animals-farmshop'],worldIds:[path],apply:async(game,worlds,ctx,tx)=>{
   const sellerSnap=await tx.get(db.doc('players/'+seller));if(!sellerSnap.exists)refuse('ไม่พบเจ้าของร้าน');
   const out=farmshopAction(worlds[path]||freshFarmshop(seller,sellerSnap.data().name,ctx.now),game,ctx,input);
   Object.assign(game,out.game);const writes={[path]:out.shop},updates={};
   if(out.proceeds){
     const ref=db.doc('mail/'+seller+'/items/shop-proceeds'),prior=await tx.get(ref);writes[ref.path]={title:'รายได้จากร้าน '+(out.shop.name||out.shop.ownerName),msg:'รายการล่าสุด: '+ctx.name+' ซื้อ '+out.receipt.key+' ×'+out.receipt.quantity,icon:'🏪',kusal:(prior.exists?prior.data().kusal||0:0)+out.proceeds,coins:0,items:{},createdAt:FieldValue.serverTimestamp(),from:'ร้านของเพื่อน'};
     if(!prior.exists)updates['players/'+seller]={mailCount:FieldValue.increment(1)};
   }
   return {writes,updates,response:{shop:out.shop,proceeds:out.proceeds||0}};
 }});
});

export const outingsActionCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'outings',partIds:['inventory','wallet','outings','house','animals-alpaca','animals-campaigns'],worldIds:['world/campaigns'],apply:async(game,worlds,ctx)=>{const out=outingsAction(game,ctx,req.data?.input||{});Object.assign(game,out.game);if(out.gain)recordCampaign(game,worlds['world/campaigns'],'honey',out.gain*honeyMultiplier(ctx.now),ctx.now);const coinGain=Number.isSafeInteger(out.coins)&&out.coins>0?out.coins:0;return {...(coinGain?{coins:ctx.coins+coinGain}:{}),response:{gain:out.gain||0,items:out.items||{},coinGain,crafted:out.crafted??null,quantity:out.quantity??null,results:out.results||[],outputs:out.outputs||[],consumed:out.consumed||[]}};}}));

// fix13: 'status' is read-only (no transaction, no writes). Other actions write privateWorld/fishing only when it changes and
// world/fishing (read by every listener in the pond) only when the public view changes. Cast results stay private.
export const fishingActionCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'fishing',partIds:['inventory','wallet','animals-fishing','animals-campaigns','animals-char'],worldIds:['privateWorld/fishing','world/campaigns'],readOnly:req.data?.input?.type==='status',apply:async(game,worlds,ctx,tx)=>{
 ctx.nonce=randomUUID();ctx.fishEvent=worlds['world/campaigns']?.fish;const input=req.data?.input||{},out=fishingAction(worlds['privateWorld/fishing']||freshFishing(ctx.now),game,ctx,input);Object.assign(game,out.game);if(out.caught?.length&&!ctx.readOnly&&randomInt(1e6)<MK_FISH_DROP*1e6){game.bag ||= {};game.bag.box ||= {};game.bag.box.mahakusal=(Number(game.bag.box.mahakusal)||0)+1;out.mkDrop=1;}/* fix17 📦 ดร็อปหายาก (ซ่อนบนคลาวด์) */if(out.caught){const values={catshark:1,angelshark:2,manta:3,hammerhead:4,mola:6,strawberry:8,unicorn:12,goldsheep:20},event=ctx.fishEvent?.evHour===Math.floor(ctx.now/3600e3)?FISH_EVENTS[ctx.fishEvent.ev]?.[3]||{}:{};const points=out.caught.reduce((n,f)=>n+(values[f.k]||0)*(event.pts||1)*(event.sharkpts&&['catshark','angelshark','manta','hammerhead'].includes(f.k)?event.sharkpts:1),0);recordCampaign(game,worlds['world/campaigns'],'fish',points,ctx.now);}
 const prior=worlds['privateWorld/fishing'],view=fishingPublic(out.race,ctx.now),writes={},updates={};
 const publicChanged=!prior||!sameData({...view,updatedAt:0,luckyHour:0},{...fishingPublic(prior,ctx.now),updatedAt:0,luckyHour:0});
 // Unchanged public view keeps the stored timestamp, so clients still accept the next real update from the listener.
 if(!publicChanged||ctx.readOnly){const at=prior?.updatedAt??0;out.race.updatedAt=at;view.updatedAt=at;}
 if(!prior||!sameData({...out.race,updatedAt:0},{...prior,updatedAt:0}))writes['privateWorld/fishing']=out.race;
 if(publicChanged)writes['world/fishing']=view;
 // Read reward recipients before issuing any writes; rollover is atomic with the board.
 const recipients=await Promise.all(out.award.map(w=>tx.get(db.doc('players/'+w.uid))));
 out.award.forEach((w,i)=>{if(!recipients[i].exists)return;const day=worlds['privateWorld/fishing'].day;writes['mail/'+w.uid+'/items/fishing-'+day]={title:'ท็อป 5 ตกปลา '+day,msg:'น้ำหนัก '+w.w+' lb · ติดต่อกัน '+w.st+' วัน · 📦 กล่องมหากุศล 30 กล่อง',icon:'🎣',kusal:w.rw,coins:0,items:{'box-mahakusal':30},createdAt:FieldValue.serverTimestamp(),expireAt:Timestamp.fromMillis(ctx.now+60*864e5),from:'บ่อตกปลา'};updates['players/'+w.uid]={mailCount:FieldValue.increment(1)};});
 // fix17 ⚡🏮 ปลาไหลไฟฟ้าผี: หักกุศลคนโดนผ่าน ledger (ไม่บอกชื่อคนปล่อย)
 if(out.eelShock){const v=await tx.get(db.doc('players/'+out.eelShock.uid));if(v.exists)writes['players/'+out.eelShock.uid+'/ledger/eel-'+ctx.now+'-'+randomUUID().slice(0,8)]={merit:-out.eelShock.merit,title:'⚡ ปลาไหลไฟฟ้าช็อต',msg:'ใครสักคนปล่อยปลาไหลไฟฟ้าใส่คุณที่บ่อตกปลา',at:FieldValue.serverTimestamp(),source:'fishing'};}
 const race=view;const quota={eel:out.eel,bait:out.bait,vipTaken:out.race.vipTaken?.[ctx.uid]||0,cut:out.race.cuts[ctx.uid]||0,taken:out.race.taken[ctx.uid]||0,cd:out.race.cd[ctx.uid]||0,vipCount:out.race.vipCount[ctx.uid]||0,vipCd:out.race.vipCd[ctx.uid]||0,vipHeld:out.race.vipCard?.[ctx.uid]?.card||0,...(ctx.admin?{lucky:out.race.lucky}:{})};
 return {writes,updates,mailDelta:out.award.some(w=>w.uid===ctx.uid)?1:0,response:{race,quota,serverNow:ctx.now,...(out.notice?{notice:out.notice}:{}),...(out.challenge?{challenge:out.challenge}:{}),...(out.caught?{caught:out.caught,total:out.total,success:out.success,timing:out.timing,pond:out.pond}:{}),...(out.reward?{reward:out.reward}:{}),...(out.eelShock?{eelShock:{n:out.eelShock.n,vip:out.eelShock.vip}}:{}),...(out.eelBonus?{eelBonus:out.eelBonus}:{}),...(out.mkDrop?{mkDrop:out.mkDrop}:{}),...(out.crafted!==undefined?{crafted:out.crafted,results:out.results,outputs:out.outputs,consumed:out.consumed}:{})}};
}}));

export const eventsActionCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'events',worldIds:['world/topspenders'],apply:async(game,worlds,ctx,tx)=>{
 const {rollGacha,topSpenders}=await import('./events-engine.js?h=b1067a7f');const input=req.data?.input||{},writes={},updates={};
 if(input.type==='spin'){
   /* S4 ข้อ 47: หมุนละ 10 เหรียญ */if(ctx.coins<10)refuse('ต้องใช้เหรียญกระทงทอง 10 เหรียญ');const reward=rollGacha();
   if(reward.type!=='none'){const ref=db.doc('mail/'+ctx.uid+'/items/gacha-rewards'),prior=await tx.get(ref),old=prior.exists?prior.data():{},items={...(old.items||{})};for(const[k,n]of Object.entries(reward.items||{}))items[k]=(items[k]||0)+n;writes[ref.path]={title:'รางวัลลัคกี้กาชาปองสะสม',msg:reward.extra||'จากตู้กาชาปอง',icon:'🎁',kusal:(old.kusal||0)+(reward.k||0),coins:0,items,createdAt:FieldValue.serverTimestamp(),from:'กาชาปอง'};if(!prior.exists)updates['players/'+ctx.uid]={mailCount:FieldValue.increment(1)};reward.mailNew=!prior.exists;}
   return {writes,updates,mailDelta:reward.mailNew?1:0,coins:ctx.coins-10,response:{reward}};
 }
 if(input.type==='save'){if(!ctx.admin)refuse('เฉพาะแอดมิน','permission-denied');const kept=await tx.get(db.doc(ROSTER_PATH));let roster=kept.exists&&kept.data().rows?Object.entries(kept.data().rows).map(([uid,r])=>({uid,name:r.n})):null;if(!roster){const players=await tx.get(db.collection('players').limit(5000));roster=players.docs.map(d=>({uid:d.id,name:d.data().name||'ผู้เล่น'}));}writes['world/topspenders']=topSpenders(input,ctx,roster);}
 else if(input.type!=='status')refuse('รายการไม่ถูกต้อง');
 return {writes,response:{board:writes['world/topspenders']||worlds['world/topspenders']||{rows:[],updatedAt:0},coins:ctx.coins}};
}}));

// Leaderboard reads run OUTSIDE the action transaction and page through every player (no 200 cap).
const RANK_STALE=30*60000,RANK_PAGE=300,RANK_KEEP=300;
async function collectCampaignScores(){
 const rows=[];let last=null;
 for(let pages=0;pages<200;pages++){
  let q=db.collection('players').orderBy(FieldPath.documentId()).limit(RANK_PAGE);if(last)q=q.startAfter(last);
  const snap=await q.get();if(snap.empty)break;
  const parts=await db.getAll(...snap.docs.map(p=>p.ref.collection('saves').doc('animals-campaigns')));
  snap.docs.forEach((p,i)=>{const pd=p.data()||{};if(pd.approval&&pd.approval!=='approved')return;/* S4: สมาชิกที่อนุมัติแล้วทุกคนขึ้นทุกแคมเปญ (ยังไม่มีแต้ม = 0) */let data={};if(parts[i].exists){try{data=JSON.parse(parts[i].data().payload)||{};}catch(e){data={};}}rows.push({uid:p.id,name:pd.name||'ผู้เล่น',data});});
  last=snap.docs.at(-1);if(snap.size<RANK_PAGE)break;
 }
 return rows;
}
export const campaignsActionCloud=callable(async req=>{
 const input=req.data?.input||{},prior=await db.doc('world/campaign-ranks').get();
 const rebuild=['start','stop'].includes(input.type)||!prior.exists||Date.now()-(prior.data().updatedAt||0)>=RANK_STALE;
 const scores=rebuild?await collectCampaignScores():null;
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'campaigns',partIds:['wallet','animals-campaigns'],worldIds:['world/campaigns','world/campaign-ranks'],apply:async(game,worlds,ctx,tx)=>{
 const {campaignControl,claimCampaign,buildBoards}=await import('./campaigns-engine.js?h=a073b41e'),config=worlds['world/campaigns']||{},writes={};let reward=0;
 if(['start','stop','news'].includes(input.type))writes['world/campaigns']=campaignControl(config,input,ctx);
 else if(input.type==='claim')reward=claimCampaign(game,config,input);
 else if(input.type!=='status')refuse('รายการไม่ถูกต้อง');
 const settings=writes['world/campaigns']||config;let ranks=worlds['world/campaign-ranks'];
 if(scores&&(!ranks||ctx.now-(ranks.updatedAt||0)>=RANK_STALE||['start','stop'].includes(input.type))){
   // The caller's own row comes from this transaction so it is never older than their save.
   const rows=scores.filter(r=>r.uid!==ctx.uid);rows.push({uid:ctx.uid,name:ctx.name||'ผู้เล่น',data:game.sub?.campaigns||{}});
   const out=buildBoards(rows,settings,RANK_KEEP);
   ranks={updatedAt:ctx.now,boards:out.boards,totals:out.totals,players:rows.length};writes['world/campaign-ranks']=ranks;
 }
 return {writes,response:{config:settings,ranks:ranks||{updatedAt:0,boards:{}},reward,progress:game.sub?.campaigns||{},serverNow:ctx.now}};
}});
});

/* ---------- minigames (fix13): owner control, 3-part fees (coins + hats + music boxes), emergency close, Kang rooms, one-time migration ---------- */
const MG_DEFAULT=()=>({kang:[{open:true,base:10000,fee:4},{open:true,base:50000,fee:4}]});
const mgSettings=w=>{const s=w?structuredClone(w):MG_DEFAULT();if(!Array.isArray(s.kang))s.kang=MG_DEFAULT().kang;return s;};
// world/minigameOwner {uid} is written by tools/set-minigame-owner.mjs. Until it exists, the old admin check applies.
const mgOwner=(worlds,ctx)=>{const o=worlds['world/minigameOwner'];return o?.uid?o.uid===ctx.uid:ctx.admin;};
const mgRng=()=>randomInt(4294967296)/4294967296;
// One player can get several minigame mails in one transaction (emergency close / migration): count them instead of overwriting the increment.
const mailBumps=new WeakMap();
const bumpMail=(updates,uid)=>{const m=mailBumps.get(updates)||new Map();mailBumps.set(updates,m);const n=(m.get(uid)||0)+1;m.set(uid,n);updates['players/'+uid]={mailCount:FieldValue.increment(n)};};
/* Writes a Kang room. A finished round is settled once by mail: stake ± result; a voided round also returns every fee it took
   (coins, and the hats / music boxes recorded since fix13). The table is emptied 30 s later by the clock, or at once after an owner clear. */
async function kangCommit(tx,room,r,ctx,settings,version,writes,updates,prior){
 let mailDelta=0;
 if(r.state==='result'&&!r.settled){
   const recipients=await Promise.all(r.seats.map(s=>s?tx.get(db.doc('players/'+s.uid)):null));
   const priorMail=await Promise.all(r.seats.map(s=>s?tx.get(db.doc('mail/'+s.uid+'/items/kang-return-'+room)):null));
   r.seats.forEach((s,i)=>{if(!s||!recipients[i]?.exists||!r.ready[i])return;
     const old=priorMail[i]?.exists?priorMail[i].data():{},isVoid=r.reason==='VOID',back=isVoid?kangItemsPaid(r,i):{hat:0,mb:0},items={...(old.items||{})};
     for(const[key,n]of Object.entries(feeMailItems(back)))items[key]=(items[key]||0)+n;
     writes['mail/'+s.uid+'/items/kang-return-'+room]={title:isVoid?'ไพ่แคง คืนทุนและค่าเข้า (ยกเลิกรอบ)':'ผลไพ่แคง ห้อง '+(room+1)+' รอบ '+r.round,msg:'ทุนคืนและผลรอบ '+r.pool[i]+' กุศล · ผลได้เสีย '+r.net[i],icon:'🃏',kusal:(old.kusal||0)+r.pool[i],coins:(old.coins||0)+(isVoid?kangFeePaid(r,i):0),items,escrowRelease:{system:'kang-'+room,round:r.round},createdAt:FieldValue.serverTimestamp(),from:'โต๊ะไพ่แคง'};
     // Reserved funds never expire. The receipt is removed only when claimed.
     if(!priorMail[i]?.exists){bumpMail(updates,s.uid);if(s.uid===ctx.uid)mailDelta++;}
   });r.settled=true;r.starter=r.winner??0;
   if(r.clearAfter)kangClear(r);
 }
 const view=kangPublic(r);settings.kang[room]={open:r.open,base:r.base,fee:r.fee,fee3:r.fee3,accept:r.open,state:r.state,playing:r.state==='playing',seated:r.seats.filter(Boolean).length,ready:r.ready.filter(Boolean).length,...(r.startAt?{startAt:r.startAt}:{}),...(r.endAt?{endAt:r.endAt}:{})};
 // Unchanged rooms are not rewritten (status / tick calls cost a read, not three writes).
 const payload=JSON.stringify(r);
 if(payload!==prior){writes['privateWorld/kang-'+room]={payload};writes['world/kang-'+room]=view;r.seats.forEach((s,i)=>{if(s)writes['players/'+s.uid+'/gameViews/kang-'+room]={round:r.round,turn:r.turnNo??0,hand:r.hands[i],state:r.state,version};});}
 return {view,mailDelta};
}
/* fix13 one-time migration (lazy: the first minigame or Kang action after the update, flag settings.migrated.fix13):
   · หนีผี is removed. Anyone still seated in its room (waiting, or a match cut off by the update) gets the coins they paid back by mail.
     Past results, ledger rows and mails stay as they are; no merit is changed.
   · Both Kang rooms are cleared once. Stakes and fees of anyone holding them are mailed back (void), then the tables are empty 0/4. */
async function mgMigrate(tx,settings,ctx,writes,updates,version,loaded={}){
 if(settings.migrated?.fix13)return {mailDelta:0,rooms:{}};
 let mailDelta=0;const rooms={};
 const brDoc=await tx.get(db.doc('privateWorld/br')),br=brDoc.exists&&brDoc.data().payload?JSON.parse(brDoc.data().payload):null;
 const refunds=[];
 if(br&&['waiting','playing'].includes(br.state))for(const seat of br.seats||[]){const coins=Number.isSafeInteger(seat?.fee)?seat.fee:Number.isSafeInteger(br.fee)?br.fee:2;if(seat?.uid&&coins>0&&!refunds.some(x=>x.uid===seat.uid))refunds.push({uid:seat.uid,coins});}
 const roots=await Promise.all(refunds.map(p=>tx.get(db.doc('players/'+p.uid)))),prior=await Promise.all(refunds.map(p=>tx.get(db.doc('mail/'+p.uid+'/items/br-refund'))));
 refunds.forEach((p,i)=>{if(!roots[i].exists)return;const old=prior[i].exists?prior[i].data():{};
   writes['mail/'+p.uid+'/items/br-refund']={title:'คืนค่าเข้าหนีโคมลอย (ปิดเกมถาวร)',msg:'หนีโคมลอยถอดออกจากระบบแล้ว คืนเหรียญที่จ่ายไว้',icon:'🎲',kusal:old.kusal||0,coins:(old.coins||0)+p.coins,items:old.items||{},createdAt:FieldValue.serverTimestamp(),from:'มินิเกม'};
   if(!prior[i].exists){bumpMail(updates,p.uid);if(p.uid===ctx.uid)mailDelta++;}});
 if(br){const closed={...br,open:false,state:'removed',seats:[],players:[],deadline:0,pend:[],removedAt:ctx.now,refunded:refunds};writes['privateWorld/br']={payload:JSON.stringify(closed)};writes['world/br']={open:false,state:'removed',removed:true,round:br.round||0,seats:[],players:[],hist:br.hist||[]};}
 const sys={...ctx,uid:'system',owner:true,coins:0,rules:minigameRules(settings)};
 for(const room of [0,1]){const key='privateWorld/kang-'+room,d=key in loaded?{exists:!!loaded[key],data:()=>loaded[key]}:await tx.get(db.doc(key));
   if(!d.exists||!d.data()?.payload)continue;const source=d.data().payload,out=kangAction(JSON.parse(source),{},sys,{type:'clear',room},mgRng);
   rooms[room]=out.room;mailDelta+=(await kangCommit(tx,room,out.room,ctx,settings,version,writes,updates,source)).mailDelta;}
 settings.migrated={...(settings.migrated||{}),fix13:ctx.now};settings.br={open:false,removed:true,fee:0,playing:false,seated:0};
 return {mailDelta,rooms};
}
const mgStale=input=>{const t=String(input?.type||'');if((/-start$/.test(t)||t==='ready')&&!(Number(input?.v)>=13))refuse('🔄 มีอัปเดตใหม่ รีเฟรชหน้าเกมก่อนเล่นนะคะ (ยังไม่ได้หักอะไร)');};
export const kangActionCloud=callable(async req=>{
 const input=req.data?.input||{},room=input.room;if(!Number.isInteger(room)||room<0||room>1)refuse('ห้องไม่ถูกต้อง');mgStale(input);
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'kang',partIds:['inventory','wallet','animals-minigames'],worldIds:['privateWorld/kang-'+room,'world/minigames','world/minigameOwner'],apply:async(game,worlds,ctx,tx)=>{
   const settings=mgSettings(worlds['world/minigames']),priorSettings=JSON.stringify(settings);ctx.owner=mgOwner(worlds,ctx);const writes={},updates={};
   // Old control panels still send open/fee with "configure": they now edit the shared settings instead of the room.
   if(input.type==='configure'){if(!ctx.owner)refuse('เฉพาะเจ้าของแผงควบคุม','permission-denied');if(input.open!==undefined)minigameConfigure(settings,{type:'control',game:'kang',mode:input.open?'open':'closed'},ctx.now);if(input.fee!==undefined)minigameConfigure(settings,{type:'fees',fees:{kang:input.fee}},ctx.now);}
   const key='privateWorld/kang-'+room,mig=await mgMigrate(tx,settings,ctx,writes,updates,req.data.id,{[key]:worlds[key]});
   ctx.rules=minigameRules(settings);
   const source=mig.rooms[room]?JSON.stringify(mig.rooms[room]):worlds[key]?.payload||null,prior=mig.rooms[room]?null:source;
   let out;try{out=kangAction(source?JSON.parse(source):freshKang(room),game,ctx,input,mgRng);}catch(e){refuse(e.message);}
   const r=out.room;Object.assign(game,out.game);
   const {view,mailDelta}=await kangCommit(tx,room,r,ctx,settings,req.data.id,writes,updates,prior);
   // Shared minigame settings are written only when they change, so card moves do not contend with other games.
   if(JSON.stringify(settings)!==priorSettings||!worlds['world/minigames'])writes['world/minigames']=settings;
   const mine=r.seats.findIndex(s=>s?.uid===ctx.uid);
   return {writes,updates,mailDelta:mailDelta+mig.mailDelta,coins:out.coins,response:{room:view,mine:mine>=0?r.hands[mine]:[],settings,progress:game.sub?.minigames||{},late:out.late||false,notice:out.notice||null,cleared:out.cleared||false,serverNow:ctx.now}};
 }});
});

export const minigamesActionCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'minigames',partIds:['inventory','wallet','animals-minigames'],worldIds:['world/minigames','privateWorld/minigames-'+req.auth.uid,'world/minigameOwner'],apply:async(game,worlds,ctx,tx)=>{
 ctx.nonce=randomUUID();const input=req.data?.input||{};mgStale(input);const settings=mgSettings(worlds['world/minigames']),priorSettings=JSON.stringify(settings);
 const writes={},updates={};
 const mig=await mgMigrate(tx,settings,ctx,writes,updates,req.data.id);let mailDelta=mig.mailDelta;
 if(['control','fees','hours','emergency'].includes(input.type)){
   if(!mgOwner(worlds,ctx))refuse('เฉพาะเจ้าของแผงควบคุมมินิเกม','permission-denied');
   try{minigameConfigure(settings,input,ctx.now);}catch(e){refuse(e.message,'invalid-argument');}
   if(input.type==='emergency'&&input.on){
     // Emergency close: void every live Kang round in this same transaction; stakes and all fees go back by mail.
     ctx.rules=minigameRules(settings);const sys={...ctx,owner:true,coins:0};
     for(const room of [0,1]){const key='privateWorld/kang-'+room,d=mig.rooms[room]?null:await tx.get(db.doc(key)),source=mig.rooms[room]?JSON.stringify(mig.rooms[room]):d?.exists?d.data().payload:null;if(!source)continue;
       const kOut=kangAction(JSON.parse(source),{},sys,{type:'status',room},mgRng);if(JSON.stringify(kOut.room)!==source||mig.rooms[room])mailDelta+=(await kangCommit(tx,room,kOut.room,ctx,settings,req.data.id,writes,updates,mig.rooms[room]?null:source)).mailDelta;}
   }
   writes['world/minigames']=settings;
   return {writes,updates,mailDelta,response:{settings,serverNow:ctx.now}};
 }
 ctx.rules=minigameRules(settings);ctx.controls=settings.solo||{};
 const source=worlds['privateWorld/minigames-'+ctx.uid]?.payload?JSON.parse(worlds['privateWorld/minigames-'+ctx.uid].payload):{};
 let out;try{out=soloAction(source,game,ctx,input,mgRng);}catch(e){refuse(e.message);}Object.assign(game,out.game);
 writes['privateWorld/minigames-'+ctx.uid]={payload:JSON.stringify(out.state)};
 if(JSON.stringify(settings)!==priorSettings)writes['world/minigames']=settings;
 // Positive results collect in one claimable mail per game; negative ones were already taken from merit (never below 0).
 for(const rw of out.rewards||[]){const ref=db.doc('mail/'+ctx.uid+'/items/'+rw.key),pending=writes[ref.path],prior=pending?null:await tx.get(ref),old=pending||(prior.exists?prior.data():{}),items={...(old.items||{})};
   for(const[k,n]of Object.entries(rw.items))items[k]=(items[k]||0)+n;
   writes[ref.path]={title:rw.title,msg:'สะสมรางวัลที่ยังไม่รับจากมินิเกม',icon:rw.icon,kusal:(old.kusal||0)+rw.merit,coins:old.coins||0,items,createdAt:FieldValue.serverTimestamp(),from:'มินิเกม'};
   if(prior&&!prior.exists)mailDelta++;}
 return {writes,updates,mailDelta,coins:out.coins,response:{settings,owner:mgOwner(worlds,ctx),progress:game.sub?.minigames||{},state:soloPublic(out.state),reward:out.reward,rewards:out.rewards||[],refunded:out.voided||[],abandoned:out.abandoned||[],serverNow:ctx.now}};
}}));

/* Applies pending ledger entries (players/{uid}/ledger) right after login. The work happens in core.action. */
export const ledgerCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'ledger',partIds:['inventory','wallet'],apply:async(game,worlds,ctx,tx)=>{
 // fix16: เข้าเกม = ตัดสินขวดที่ครบ 10 นาทีแล้ว · ขวดที่โดนตอนออฟไลน์เริ่มนับ 10 นาทีตอนนี้ (ทีละขวด)
 const vref=db.doc('players/'+ctx.uid+'/gameViews/poison'),vs=await tx.get(vref),writes={};const v0=vs.exists?vs.data():null,unseen=(v0?.hits||[]).some(h=>h&&h.st==='p'&&!h.seen);const pv=poisonSettle(game,v0,ctx.now,unseen?hits=>poisonStartClocks(hits,ctx.now):undefined);if(pv)writes[vref.path]=pv;
 // fix17 🎭 ของปีศาจที่ค้างตอนออฟไลน์: หักตามเวลาจริงทันทีที่เข้าเกม (อ่านเฉพาะคนที่มีของค้าง)
 const updates={};let demonLost=0;if(ctx.dmp){demonLost=(await dmSettleSelf(tx,game,ctx,writes,updates)).lost;}
 // fix17 🎭 ไอเทมปีศาจในไปรษณีย์ที่ไม่กดรับเกิน 24 ชม. → ย้ายเข้ากระเป๋าเอง (เริ่มนับ 48 ชม. ตอนเข้ากระเป๋า)
 const deletes=[];let mailDelta=0,dmMoved=null;
 if(ctx.dmMail){const snap=await tx.get(db.collection('mail/'+ctx.uid+'/items').limit(200));let keep=false;
  for(const d of snap.docs||[]){const m=d.data()||{},items=m.items||{},dk=Object.keys(items).filter(k=>k.startsWith('demon-')&&DEMON[k.slice(6)]&&Number.isSafeInteger(items[k])&&items[k]>0);if(!dk.length)continue;
   const at=typeof m.createdAt?.toMillis==='function'?m.createdAt.toMillis():Number(m.createdAt?.ms||m.createdAt)||ctx.now;if(ctx.now-at<24*3600e3){keep=true;continue;}
   dmMoved ||= {};for(const k of dk){const kind=k.slice(6);game.bag ||= {};game.bag.demon ||= {};game.bag.demon[kind]=(Number(game.bag.demon[kind])||0)+items[k];dmMoved[kind]=(dmMoved[kind]||0)+items[k];}
   const rest=Object.fromEntries(Object.entries(items).filter(([k])=>!dk.includes(k)));
   if(!Object.keys(rest).length&&!(m.kusal>0)&&!(m.coins>0)){deletes.push(d.ref.path);mailDelta--;}else writes[d.ref.path]={...m,items:rest};}
  if(dmMoved)demonSync(game,ctx.x17,ctx.now);updates['players/'+ctx.uid]={...(updates['players/'+ctx.uid]||{}),dmMail:keep};}
 return {writes,updates,deletes,mailDelta,response:{serverNow:ctx.now,...(demonLost?{demonLost}:{}),...(dmMoved?{dmMoved}:{})}};}}));

/* fix15f ยาพิษแม่มด: สาดใส่เพื่อน → ledger ลดกุศลคนโดน (ไม่ต่ำกว่า 0) · แจ้งเตือนทุกหน้า (gameViews/poison) · กระดานรายวัน world/poison · ไม่บอกชื่อคนสาด */
const thaiDayKey=now=>new Date(now+7*3600000).toISOString().slice(0,10);
/* fix16: ยาพิษรอตัดสิน — gameViews/poison.hits[]: {id,k,d,at,st:'p'|'u'|'h',seen?,done?,lost?} · ของเก่าไม่มี st = ตัดสินแล้ว (ledger เดิม) */
const POISON_PENDING_MAX=60;
function poisonTidy(hits,now){const list=(Array.isArray(hits)?hits:[]).filter(h=>h&&typeof h==='object'&&typeof h.id==='string');
 const pend=list.filter(h=>h.st==='p'),done=list.filter(h=>h.st!=='p'&&(h.done||h.at)>now-864e5).slice(-12);return [...done,...pend];}
function poisonSettle(game,view,now,mut){const hits=poisonTidy(view?.hits,now);let changed=!!mut;
 for(const h of hits)if(poisonExpired(h,now)){const r=poisonApply(game,h,false);h.st=r.st;h.lost=r.lost;h.done=now;h.auto=true;changed=true;}
 if(mut)mut(hits);
 return changed?{hits:poisonTidy(hits,now),updatedAt:now}:null;}
async function poisonTarget(tx,uid,want){
 const admins=new Set((await db.collection('admins').limit(50).get()).docs.map(d=>d.id));
 const ok=d=>d.exists&&d.data().storageVersion===2&&(!d.data().approval||d.data().approval==='approved');
 if(typeof want==='string'&&/^[-a-zA-Z0-9_]{1,128}$/.test(want)){if(want===uid)refuse('สาดใส่ตัวเองไม่ได้');if(admins.has(want))refuse('สาดใส่แอดมินไม่ได้');const d=await tx.get(db.doc('players/'+want));if(!ok(d))refuse('ไม่พบเพื่อนคนนี้');return [want,d];}
 const roster=await tx.get(db.doc(ROSTER_PATH)),rows=roster.exists?roster.data().rows||{}:{};const pool=Object.keys(rows).filter(u=>u!==uid&&!admins.has(u)&&rows[u].a==='approved').sort();
 for(let i=0;i<8&&pool.length;i++){const u=pool.splice(randomInt(pool.length),1)[0],d=await tx.get(db.doc('players/'+u));if(ok(d))return [u,d];}
 return null;}// ไม่มีเพื่อนให้สาดเลย → ทิ้งขวดนี้ (ไม่ค้างจนเปิดหีบไม่ได้)
export const marketActionCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'market',partIds:['inventory','wallet','animals-market'],worldIds:['world/market','world/poison'],readOnly:req.data?.input?.type==='bag-quote',apply:async(game,worlds,ctx,tx)=>{
 const input=req.data?.input||{};let target=null;
 // fix16: ยาพิษของตัวเองที่รอตัดสิน (อ่านก่อนเขียนเสมอ)
 const myRef=db.doc('players/'+ctx.uid+'/gameViews/poison'),mySnap=await tx.get(myRef),day=thaiDayKey(ctx.now);
 if(input.type==='poison-throw')target=await poisonTarget(tx,ctx.uid,input.target);
 const writes={};const board=()=>writes['world/poison']||(worlds['world/poison']?.day===day?structuredClone(worlds['world/poison']):{day,rows:{}});
 if(input.type==='poison-seen'||input.type==='poison-resolve'||input.type==='poison-resolve-all'){
  let res=null;const pv=poisonSettle(game,mySnap.exists?mySnap.data():null,ctx.now,hits=>{
   if(input.type==='poison-seen'){poisonStartClocks(hits,ctx.now,typeof input.id==='string'?input.id:null);return;}
   const saved=h=>{if(thaiDayKey(h.at)!==day)return;const b=board(),row=b.rows[ctx.uid];if(row){const sv=Array.isArray(row.sv)&&row.sv.length===4?row.sv:[0,0,0,0];sv[h.k]=(sv[h.k]||0)+1;row.sv=sv;writes['world/poison']=b;}};
   /* fix16: จัดการทั้งหมดทีเดียว — ขวดไหนมีน้ำมนต์คู่กันก็ใช้ ไม่มีก็รับทราบ (use:false = รับทราบทุกขวด) */
   if(input.type==='poison-resolve-all'){const all={n:0,used:0,lost:0,list:[]};for(const h of hits.filter(x=>x.st==='p').sort((a,b)=>a.at-b.at)){const use=input.use===true&&antiHave(game,h.k)>0;const r=poisonApply(game,h,use);h.st=r.st;h.lost=r.lost;h.done=ctx.now;all.n++;if(r.st==='u'){all.used++;saved(h);}all.lost+=r.lost;all.list.push({k:h.k,st:r.st,lost:r.lost});}res={all};return;}
   const h=hits.find(x=>x.id===input.id);if(!h)refuse('ไม่พบยาพิษนี้');if(h.st!=='p'){res={st:h.st,lost:h.lost||0,k:h.k,already:true};return;}
   const r=poisonApply(game,h,input.use===true);h.st=r.st;h.lost=r.lost;h.done=ctx.now;res={st:r.st,lost:r.lost,k:h.k};
   if(r.st==='u')saved(h);
   /* ขวดถัดไปเริ่มนับใหม่ไม่เกิน 10 นาทีจากตอนนี้ */
   let i=0;for(const x of hits.filter(x=>x.st==='p'&&x.seen).sort((a,b)=>a.at-b.at)){x.seen=Math.min(x.seen,ctx.now+(i++)*HW_DECIDE);}});
  if(pv)writes[myRef.path]=pv;
  return {writes,response:{serverNow:ctx.now,...(res?{resolved:res}:{}),antidote:game.bag?.antidote||{}}};
 }
 {const v0=mySnap.exists?mySnap.data():null,unseen=(v0?.hits||[]).some(h=>h&&h.st==='p'&&!h.seen);const pv=poisonSettle(game,v0,ctx.now,unseen?hits=>poisonStartClocks(hits,ctx.now):undefined);if(pv)writes[myRef.path]=pv;}
 const prior=structuredClone(game),out=marketAction(game,worlds['world/market'],ctx,input,mgRng);Object.assign(game,out.game);
 if(JSON.stringify(out.config)!==JSON.stringify(worlds['world/market']))writes['world/market']=out.config;let thrown=null;
 if(out.thrown&&!target)thrown={p:out.thrown.p,d:0,to:null,name:null,none:true};
 if(out.thrown&&target){const [to,doc]=target,P=HW_POISON[out.thrown.p],name=String(doc.data().name||'ผู้เล่น').slice(0,40);
  const vref=db.doc('players/'+to+'/gameViews/poison'),vs=await tx.get(vref),hits=poisonTidy(vs.exists?vs.data().hits:[],ctx.now);
  const hit={id:out.thrown.id,k:out.thrown.p,d:P.d,at:ctx.now,st:'p'};
  // ค้างรอตัดสินเยอะเกิน (ไม่ได้เข้าเกมนาน) → ขวดนี้หักทันทีผ่าน ledger แบบเดิม
  if(hits.filter(h=>h.st==='p').length>=POISON_PENDING_MAX){hit.st='h';hit.done=ctx.now;writes['players/'+to+'/ledger/poison-'+out.thrown.id]={merit:-P.d,title:'🧪 โดนสาด'+P.n,msg:'มีคนสาดยาพิษใส่คุณ',at:FieldValue.serverTimestamp(),source:'poison'};}
  writes[vref.path]={hits:poisonTidy([...hits,hit],ctx.now),updatedAt:ctx.now};
  const b=board();const row=b.rows[to] ||= {n:name,c:[0,0,0,0]};row.n=name;row.c[out.thrown.p]=(row.c[out.thrown.p]||0)+1;writes['world/poison']=b;
  thrown={p:out.thrown.p,d:P.d,to,name};}
 const market=game.sub?.market||{};
 const coins=out.coinsUsed?ctx.coins-out.coinsUsed:undefined;
 return {writes,...(coins!==undefined?{coins}:{}),response:{config:out.config,dividend:out.dividend,gain:(game.merit||0)-(prior.merit||0),serverNow:ctx.now,poison:Array.isArray(market.poison)?market.poison:[],antidote:game.bag?.antidote||{},...(out.sold?{sold:out.sold}:{}),...(out.prizes?{prizes:out.prizes}:{}),...(out.crafted?{crafted:out.crafted}:{}),...(out.extra||{}),...(thrown?{thrown}:{})}};}}));

export const farmActionCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'farm',partIds:['inventory','wallet','house','farm-settings','farm-1','farm-2','farm-3','farm-4','animals-alpaca','animals-campaigns','animals-prank'],worldIds:['world/campaigns'],apply:async(game,worlds,ctx)=>{if(ctx.dmc>ctx.now&&(req.data?.input?.type||'status')!=='status')refuse('⛓️ สวนถูกหีบบัวต้องมนต์ล็อกอยู่ เปิดตราผนึกก่อนนะ');Object.assign(game,farmAction(game,ctx,{type:'status',farm:req.data?.input?.farm??1}).game);recordCampaign(game,worlds['world/campaigns']||{},'pump',0,ctx.now);const prior=structuredClone(game),out=farmAction(game,ctx,req.data?.input||{},()=>randomInt(4294967296)/4294967296);Object.assign(game,out.game);observeGameplay(prior,game,'farm',worlds['world/campaigns']||{},ctx.now,[],()=>randomInt(4294967296)/4294967296,{pumpHarvests:out.pump||0});const halloween=Object.entries(game.bag?.halloween||{}).flatMap(([k,q])=>q>(prior.bag?.halloween?.[k]||0)?[{path:'halloween.'+k,quantity:q-(prior.bag?.halloween?.[k]||0)}]:[]);return {response:{count:out.count,items:out.items,harvested:out.harvested||[],results:out.results||[],outputs:out.outputs||[],consumed:out.consumed||[],...(out.prank?{prank:out.prank}:{}),halloween,pumpPlots:game.sub?.campaigns?.pump?.pumpPlots||0,pumpActive:!!worlds['world/campaigns']?.pump?.start&&worlds['world/campaigns'].pump.start<=ctx.now&&worlds['world/campaigns'].pump.end>ctx.now,serverNow:ctx.now}};}}));
export const friendsActionCloud=callable(async req=>{
 const input=req.data?.input||{},owner=input.owner;if(typeof owner!=='string'||!/^[-a-zA-Z0-9_]{1,128}$/.test(owner)||owner===req.auth.uid)refuse('สวนไม่ถูกต้อง');const farm=input.farm??1;if(!Number.isInteger(farm)||farm<1||farm>4)refuse('ฟาร์มไม่ถูกต้อง');
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'friends',partIds:['inventory','wallet','animals-friends'],apply:async(game,worlds,ctx,tx)=>{
 const rootRef=db.doc('players/'+owner),farmRef=rootRef.collection('saves').doc('farm-'+farm),houseRef=rootRef.collection('saves').doc('house'),settingsRef=rootRef.collection('saves').doc('farm-settings'),prankRef=rootRef.collection('saves').doc('animals-prank');const [profile,part,house,settings,prankPart]=await Promise.all([tx.get(rootRef),tx.get(farmRef),tx.get(houseRef),tx.get(settingsRef),tx.get(prankRef)]);if(!profile.exists||profile.data().storageVersion!==2)refuse('เจ้าของสวนต้องเข้าเกมเพื่อโหลดเซฟก่อน');const ownerAdmin=(await tx.get(db.doc('admins/'+owner))).exists;/* fix19 🏧 ตู้ ATM อยู่สวนแอดมิน */
 const target=joinGame([part,house,settings,prankPart].filter(d=>d.exists).map(d=>d.data()));const out=friendAction(game,target,ctx,input,()=>randomInt(4294967296)/4294967296);Object.assign(game,out.game);const writes={},updates={},next=splitGame(out.target).get('farm-'+farm);
 if(next&&next.payload!==(part.exists?part.data().payload:null)){writes[farmRef.path]={...next,rev:((part.exists?part.data().rev:0)||0)+1,by:profile.data().session,updatedAt:FieldValue.serverTimestamp()};updates[rootRef.path]={saveRevision:FieldValue.increment(1)};}
 const pnext=splitGame(out.target).get('animals-prank');if(pnext&&pnext.payload!==(prankPart.exists?prankPart.data().payload:null)){writes[prankRef.path]={...pnext,rev:((prankPart.exists?prankPart.data().rev:0)||0)+1,by:profile.data().session,updatedAt:FieldValue.serverTimestamp()};updates[rootRef.path]={saveRevision:FieldValue.increment(1)};if(!prankPart.exists)updates[rootRef.path].partCount=FieldValue.increment(1);}
 if(out.notice){const mailRef=db.doc('mail/'+owner+'/items/friend-news'),prior=await tx.get(mailRef);writes[mailRef.path]={title:'การเยี่ยมสวน',msg:ctx.name+' · '+({steal:'ขโมยผัก',water:'รดน้ำ',worm:'กำจัดหนอน',magic:'ร่ายมนต์จันทร์ 3 ชั่วโมง'}[out.notice])+' ฟาร์ม '+farm+' แปลง '+(input.index+1),icon:'👥',kusal:0,coins:0,items:{},createdAt:FieldValue.serverTimestamp(),from:ctx.name};if(!prior.exists)updates[rootRef.path]={...(updates[rootRef.path]||{}),mailCount:FieldValue.increment(1)};}
 const pk=out.target.sub?.prank||{};
 /* S4 ข้อ 180: ส่งเลย์เอาต์ฟาร์ม 3D ของเจ้าของให้ผู้เยี่ยม (เฉพาะตอนเริ่มเยี่ยม · 1 อ่าน) */let deco=null,honey=null;if(input.type==='visit'&&farm===1){try{const d=await tx.get(rootRef.collection('saves').doc('module-s4deco-farm'));deco=d.exists?d.data().payload:null;}catch(e){}/* S4 ข้อ 93: น้องน้ำผึ้งของเพื่อน (รถ/เรือที่จอด) */try{const o=await tx.get(rootRef.collection('saves').doc('outings'));if(o.exists){const g=JSON.parse(o.data().payload||'{}');const h=g&&g.honey;if(h&&typeof h==='object')honey={v:h.v,arriveAt:h.arriveAt,until:h.until,leaveAt:h.leaveAt||0,fail:!!h.fail,n:(h.req||[]).length};}}catch(e){}}
 /* S4 รอบ 3 ข้อ 11: สถานะพื้นที่ฝั่งข้ามสะพานของเจ้าของ (null = ไม่ได้โหลดส่วนนี้) */const ul2=out.target&&out.target.unl?!!out.target.unl.f2:null;
 return {writes,updates,response:{owner,deco,honey,ul2,atm:ownerAdmin,name:profile.data().name,farm,plots:out.target.farms?.[farm]||[],fruit:out.target.fruit||null,quota:game.sub.friends,prankState:{bat:!!pk.bat,signs:(pk.signs||[]).length,scareUntil:pk.scareUntil||0,scareKind:pk.scareKind||1,gardenDay:pk.day?.d===new Date(ctx.now+7*3600000).toISOString().slice(0,10)?pk.day.n||0:0},...(out.prank?{prank:out.prank}:{}),...(out.stolen?{stolen:out.stolen}:{}),serverNow:ctx.now}};
 }});
});

// One scheduled transaction per day; games do not write clock ticks.
export const fishingMidnight=onSchedule({...options,schedule:'0 0 * * *',timeZone:'Asia/Bangkok'},async()=>db.runTransaction(async tx=>{
 const ref=db.doc('privateWorld/fishing'),snap=await tx.get(ref);if(!snap.exists)return;const now=Date.now(),out=fishingAction(snap.data(),{},{uid:'scheduled-rollover',name:'ระบบ',coins:0,now,nonce:randomUUID()},{type:'status'},()=>randomInt(4294967296)/4294967296);
 const recipients=await Promise.all(out.award.map(w=>tx.get(db.doc('players/'+w.uid))));out.award.forEach((w,i)=>{if(!recipients[i].exists)return;tx.set(db.doc('mail/'+w.uid+'/items/fishing-'+snap.data().day),{title:'ท็อป 5 ตกปลา '+snap.data().day,msg:'น้ำหนัก '+w.w+' lb · ติดต่อกัน '+w.st+' วัน · 📦 กล่องมหากุศล 30 กล่อง',icon:'🎣',kusal:w.rw,coins:0,items:{'box-mahakusal':30},createdAt:FieldValue.serverTimestamp(),expireAt:Timestamp.fromMillis(now+60*864e5),from:'บ่อตกปลา'});tx.update(db.doc('players/'+w.uid),{mailCount:FieldValue.increment(1)});});tx.set(ref,out.race);tx.set(db.doc('world/fishing'),fishingPublic(out.race,now));
}));

const boxesHandler=(req,system)=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system,partIds:['inventory','wallet','animals-campaigns','animals-char']/* S4: กล่องสุ่มชุดต้องรู้ตัวละคร */,worldIds:['world/campaigns'],apply:async(game,worlds,ctx,tx)=>{
 const input=req.data?.input||{},request=system==='birdbox'?{...input,box:input.species}:input;
 if(system==='birdbox'&&!['ostrich','dodo'].includes(request.box))refuse('กล่องนกไม่ถูกต้อง');
 const prior=structuredClone(game),out=openLootBoxes(game,request,()=>randomInt(4294967296)/4294967296);
 Object.assign(game,out.game);observeGameplay(prior,game,'boxes',worlds['world/campaigns']||{},ctx.now,out.outcomes);
 let demon={},merges={};if(!ctx.admin&&PET_BOXES.includes(request.box)){/* fix17 🎭 โอกาสซ่อน · ตัวนับการันตีอยู่ฝั่งเซิร์ฟเวอร์ */const pref=db.doc(DM_PRIV(ctx.uid)),ps=await tx.get(pref),pity={n:Number(ps.exists?ps.data().box?.n:0)||0},n0=pity.n;
  demon=boxRoll(game,ctx.x17,request.box,request.quantity,ctx.now,()=>randomInt(4294967296)/4294967296,pity);if(pity.n!==n0)merges[pref.path]={box:{n:pity.n}};}
 const cg=Number.isSafeInteger(out.receipt.coins)&&out.receipt.coins>0?out.receipt.coins:0;return {merges,...(cg?{coins:ctx.coins+cg}:{}),response:{...out.receipt,species:system==='birdbox'?request.box:null,...(Object.keys(demon).length?{demon}:{})}};
}});
export const boxesActionCloud=callable(async req=>boxesHandler(req,'boxes'));
// Keep the deployed legacy callable, with the same server-authoritative tables.
export const birdboxActionCloud=callable(async req=>boxesHandler(req,'birdbox'));

// fix14: ร้านค้ายัยหนูถอดออกทั้งระบบ — ของที่ผู้เล่นซื้อไปแล้วอยู่ในกระเป๋าตามเดิม

export const dropsActionCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'drops',partIds:['inventory','wallet','animals-farmdrops'],apply:async(game,worlds,ctx,tx)=>{const input=req.data?.input||{};if(input.owner&&input.owner!==ctx.uid){const target=await tx.get(db.doc('players/'+input.owner));if(!target.exists||target.data().approval&&target.data().approval!=='approved')refuse('ไม่พบสวนสมาชิกที่อนุมัติแล้ว');}const out=farmDropsAction(game,ctx,input);Object.assign(game,out.game);return {response:{view:out.view,collected:out.collected,krathong:out.krathong||null,serverNow:ctx.now}};}}));

// fix14: ระบบล่อนก (คัมภีร์ → คำขอ → แอดมินอนุมัติ) ถอดออกทั้งระบบ · คำขอที่ค้างไม่ถูกตัดสินอีก · นกที่อนุมัติแล้วยังอยู่ครบ 48 ชม. (birdAdmissions)
// Server clock for pages (48 h lure expiry, campaign timestamps). No reads or writes.
export const serverClockCloud=callable(async()=>({serverNow:Date.now()}));

export const safariActionCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'safari',partIds:['inventory','wallet','animals-safari'],apply:async(game,worlds,ctx)=>{const out=safariAction(game,ctx,req.data?.input||{},()=>randomInt(4294967296)/4294967296);Object.assign(game,out.game);return {response:{view:out.view,receipt:out.receipt,serverNow:ctx.now}};}}));

export const inventoryIntegrityCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'integrity',partIds:['inventory','wallet','animals-alpaca'],apply:async(game,worlds,ctx)=>({response:{checked:true,serverNow:ctx.now}})}));

export const craftActionCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,system:'craft',partIds:req.data?.input?.type==='lux'?['inventory','wallet','house','backyard','animals-campaigns']:['inventory','wallet','house','animals-campaigns'],worldIds:['world/campaigns'],apply:async(game,worlds,ctx)=>{if(req.data?.input?.type==='lux'){const prior=structuredClone(game),inp=req.data.input,out=luxFeedAction(game,ctx,inp,()=>randomInt(4294967296)/4294967296);Object.assign(game,out.game);observeGameplay(prior,game,inp.page,worlds['world/campaigns']||{},ctx.now);return {response:{merit:out.merit,readyAt:out.readyAt,consumed:out.consumed,serverNow:ctx.now}};}const prior=structuredClone(game),out=foodCraftAction(game,ctx,req.data?.input||{},()=>randomInt(4294967296)/4294967296);Object.assign(game,out.game);observeGameplay(prior,game,req.data?.input?.recipe?.startsWith('gfood:')?'backyard':'house',worlds['world/campaigns']||{},ctx.now);return {response:{title:out.title,results:out.results,outputs:out.outputs,consumed:out.consumed,merit:out.merit,serverNow:ctx.now}};}}));
/* ---------- fix16 มินิเกมลอยกระทงของสัตว์ (หาแมวในแก้ว · ร้านซุปแม่มด) — เซิร์ฟเวอร์จ่ายค่าเข้า สุ่มแผน ตัดสิน จ่ายกุศล ---------- */
export const hwminiActionCloud=callable(async req=>core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:req.data?.input,peek:true,system:'hwmini',partIds:['inventory','wallet','animals-hwmini','animals-campaigns'],worldIds:['world/hwmini','world/campaigns'],apply:async(game,worlds,ctx)=>{
 const input=req.data?.input||{},rng=()=>randomInt(4294967296)/4294967296,out=hwmAction(game,ctx,input,worlds['world/hwmini'],rng);
 if(out.world)return {writes:{'world/hwmini':out.world},response:{view:out.view}};
 Object.assign(game,out.game);
 const gain=(out.gain||0)+(out.tidy?.gain||0);if(gain>0)recordCampaign(game,worlds['world/campaigns']||{},'pet',gain,ctx.now);
 return {response:{view:out.view,result:out.result||null,tidy:out.tidy||null}};}}));

export const inventoryRepairReportCloud=callable(async req=>{if(!(await db.doc('admins/'+req.auth.uid).get()).exists)throw new HttpsError('permission-denied','เฉพาะแอดมิน');const uid=req.data?.uid;if(typeof uid!=='string'||!/^[-a-zA-Z0-9_]{1,128}$/.test(uid))throw new HttpsError('invalid-argument','เลือกสมาชิกก่อน');const rows=await db.collection('players/'+uid+'/inventoryRepairs').limit(100).get();return {rows:rows.docs.map(d=>({id:d.id,system:d.data().system,at:d.data().createdAt?.toMillis?.()||0,issues:JSON.parse(d.data().issues||'[]')})).sort((a,b)=>b.at-a.at)};});

/* ---------- fix14 เนเบอร์ฮูด ---------- */
const nbRef=id=>db.doc('neighborhoods/'+id),nbDayRef=(id,day)=>db.doc('neighborhoods/'+id+'/days/'+day),nbInviteRef=uid=>db.doc('nbInvites/'+uid);
const nbIdOk=id=>typeof id==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(id);
const uidOk=id=>typeof id==='string'&&/^[-a-zA-Z0-9_]{1,128}$/.test(id);
/* S4: ของตกแต่งส่งให้เพื่อนบ้านไม่ได้ (ได้จากยัยหนูส่งเท่านั้น) */const NB_CAT=new Map(CATALOG_ALL.filter(c=>!c.p.startsWith('sub.')&&!c.p.startsWith('decor.')&&c.p!=='item.monkey').map(c=>[c.k,c]));
function nbPublic(nb){if(!nb)return null;const {contrib,...rest}=nb;return {...rest,contrib:contrib||{}};}
function nbLog(nb,e,t,now){nb.log=[{e,t,at:now},...(nb.log||[])].slice(0,40);}
function nbRefundMail(writes,updates,uid,items,title,now){
 const clean=Object.fromEntries(Object.entries(items||{}).filter(([k,q])=>Number(q)>0&&NB_COST.some(c=>c[0]===k)));if(!Object.keys(clean).length)return;
 writes['mail/'+uid+'/items/nb-refund-'+now+'-'+Math.floor(Math.random()*1e6)]={title,msg:'คืนของที่ลงขันไว้ครบทุกชิ้น',icon:'🏘️',kusal:0,coins:0,items:clean,createdAt:FieldValue.serverTimestamp(),from:'เนเบอร์ฮูด'};
 updates['players/'+uid]={...(updates['players/'+uid]||{}),mailCount:FieldValue.increment(1)};
}
// fix15: ยอดตัดขน/เก็บดอกไม้ส่งตรงเข้าเควสต์บ้าน ไม่แตะเซฟ กุศล หรือกระเป๋าผู้เล่น (กันหน้าเกมที่เปิดอยู่บันทึกทับ)
const NB_REPORT_CAP={shear:100,flower:200,mkdiaper:300,decor:500};
async function nbReport(uid,input){
 const kind=input.kind,n=input.n,now=Date.now();
 if(!Object.hasOwn(NB_REPORT_CAP,kind)||!Number.isInteger(n)||n<1)refuse('รายการไม่ถูกต้อง');
 return db.runTransaction(async tx=>{
  const me=await tx.get(db.doc('players/'+uid)),nbId=me.data()?.nb;if(!nbIdOk(nbId))return {ok:true,serverNow:now};
  const dayRef=nbDayRef(nbId,nbDay(now)),[nb,ds]=await Promise.all([tx.get(nbRef(nbId)),tx.get(dayRef)]);
  if(!nb.exists||nb.data().status!=='active'||!(nb.data().members||[]).includes(uid))return {ok:true,serverNow:now};
  const had=Number(ds.exists?ds.data().q?.[kind]?.[uid]:0)||0,add=Math.min(50,n,Math.max(0,NB_REPORT_CAP[kind]-had));
  if(add>0){if(ds.exists)tx.update(dayRef,{['q.'+kind+'.'+uid]:had+add});else tx.set(dayRef,{q:{[kind]:{[uid]:add}}});}
  return {ok:true,added:add,serverNow:now};
 });
}
export const nbActionCloud=callable(async req=>{
 const input=req.data?.input||{},type=input.type;
 if(type==='report')return nbReport(req.auth.uid,input);
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input,system:'nb',partIds:['inventory','wallet'],readOnly:type==='status',apply:async(game,worlds,ctx,tx)=>{
  const uid=ctx.uid,now=ctx.now,day=nbDay(now),writes={},updates={};let mailDelta=0;
  const me=await tx.get(db.doc('players/'+uid));const myNb=nbIdOk(me.data()?.nb)?me.data().nb:null;
  const fail=m=>refuse(m);
  const load=async id=>{const s=await tx.get(nbRef(id));return s.exists?s.data():null;};
  let nb=myNb?await load(myNb):null;if(nb&&(nb.status==='disbanded'||!(nb.members||[]).includes(uid)))nb=null;
  const nbId=nb?myNb:null;
  const setRoot=(u,v)=>{updates['players/'+u]={...(updates['players/'+u]||{}),nb:v};};
  const reply=async extra=>{
   const inv=await tx.get(nbInviteRef(uid));const invites=(inv.exists?inv.data().list||[]:[]).filter(x=>x&&nbIdOk(x.nb));
   let today=null,yesterday=null;if(nb&&nb.status==='active'){const [t,y]=await Promise.all([tx.get(nbDayRef(nbId,day)),tx.get(nbDayRef(nbId,nbDay(now-864e5)))]);today=t.exists?t.data():{q:{}};yesterday=y.exists?y.data():null;}
   return {writes,updates,mailDelta,response:{nbId,nb:nbPublic(nb),invites,today:today?{q:today.q||{},gifts:today.gifts||{},log:today.log||[]}:null,yesterday:yesterday?.result||null,day,serverNow:now,...(extra||{})}};
  };
  if(type==='status')return reply();
  // fix15: แจ้งยอดตัดขนอัลปาก้า/เก็บดอกไม้จากหน้าเกม (นับเควสต์ใน cloud-core) ไม่อ่านหรือเขียนอะไรเพิ่ม
  // ---- ผู้เล่นที่ยังไม่มีเนเบอร์ฮูด ----
  if(type==='create'){
   if(nb)fail('คุณอยู่ในเนเบอร์ฮูดแล้ว');const name=cleanName(input.name);if(name.length<2)fail('ตั้งชื่ออย่างน้อย 2 ตัวอักษร');if(!NB_EMBLEMS.includes(input.emblem))fail('เลือกตราประจำบ้าน');
   const id=randomUUID().replace(/-/g,'').slice(0,20);nb={name,emblem:input.emblem,leader:uid,members:[uid],names:{[uid]:ctx.name||'ผู้เล่น'},status:'forming',pool:{},contrib:{},invites:[],joinedAt:{[uid]:now},createdAt:now,log:[]};
   nbLog(nb,'🏗️',(ctx.name||'ผู้เล่น')+' เริ่มสร้างเนเบอร์ฮูด',now);writes['neighborhoods/'+id]=nb;setRoot(uid,id);
   return {writes,updates,response:{nbId:id,nb:nbPublic(nb),invites:[],today:null,day,serverNow:now}};
  }
  if(type==='accept'||type==='decline'){
   const id=input.nb;if(!nbIdOk(id))fail('คำเชิญไม่ถูกต้อง');const inv=await tx.get(nbInviteRef(uid)),list=(inv.exists?inv.data().list||[]:[]);
   const target=await load(id);const rest=list.filter(x=>x.nb!==id);writes['nbInvites/'+uid]={list:rest};
   if(type==='decline'){if(target){target.invites=(target.invites||[]).filter(u=>u!==uid);writes['neighborhoods/'+id]=target;}nb=nb;return reply();}
   if(nb)fail('คุณอยู่ในเนเบอร์ฮูดแล้ว');if(!target||target.status==='disbanded'||target.status==='pending')fail('คำเชิญนี้หมดอายุแล้ว');
   if(!(target.invites||[]).includes(uid))fail('คำเชิญนี้ถูกยกเลิกแล้ว');if((target.members||[]).length>=NB_MAX)fail('เนเบอร์ฮูดเต็ม '+NB_MAX+' คนแล้ว');
   target.invites=target.invites.filter(u=>u!==uid);target.members=[...target.members,uid];target.names={...(target.names||{}),[uid]:ctx.name||'ผู้เล่น'};target.joinedAt={...(target.joinedAt||{}),[uid]:now};
   nbLog(target,'👥',(ctx.name||'ผู้เล่น')+' เข้าร่วมเนเบอร์ฮูด',now);writes['neighborhoods/'+id]=target;setRoot(uid,id);nb=target;
   return {writes,updates,response:{nbId:id,nb:nbPublic(nb),invites:rest,today:null,day,serverNow:now}};
  }
  if(!nb)fail('คุณยังไม่มีเนเบอร์ฮูด');
  const leader=nb.leader===uid,save=()=>{writes['neighborhoods/'+nbId]=nb;};
  if(nbHousesTick(nb,now))save();/* S4 ข้อ 109: ปิดงานอัปเกรดบ้านที่ครบเวลา */
  /* S4 ข้อ 108: ของแต่ง+แบบบ้านของฉันในชุมชน เก็บที่เอกสารชุมชน ให้สมาชิกทุกคนเห็นทันที (แต่งได้เฉพาะช่องของตัวเอง) */
  if(type==='nbDeco'){const d=Array.isArray(input.d)?input.d.slice(0,NB_DECO_MAX):[];for(const r of d){if(!Array.isArray(r)||r.length<3||typeof r[0]!=='string'||r[0].length>40||![1,2,3].every(i=>r[i]===undefined||(Number.isFinite(Number(r[i]))&&Math.abs(Number(r[i]))<100)))fail('ข้อมูลของแต่งไม่ถูกต้อง');}
   nb.deco ||= {};nb.deco[uid]={d:d.map(r=>[String(r[0]),+(+r[1]).toFixed(2),+(+r[2]).toFixed(2),+(+(r[3]||0)).toFixed(3)]),at:now};
   const h=nbHouseOf(nb,uid,now);if(input.st!==undefined&&!h.up){nb.houses ||= {};nb.houses[uid]={lv:h.lv,st:Math.max(0,Math.min(9,input.st|0))};}save();return reply();}
  /* S4 ข้อ 105: ธีมชุมชน หัวหน้าเลือกครั้งแรกครั้งเดียว (ทุกคนเห็นธีมเดียวกัน) */
  if(type==='nbTheme'){if(!leader)fail('หัวหน้าเนเบอร์ฮูดเท่านั้นที่เลือกธีมได้');if(nb.theme&&!ctx.admin)fail('เลือกธีมได้ครั้งเดียว (เลือกแล้ว: '+nb.theme+')');if(!NB_THEMES.includes(input.th))fail('ไม่มีธีมนี้');nb.theme=input.th;nbLog(nb,'🎨',(ctx.name||'หัวหน้า')+' เลือกธีมหมู่บ้าน',now);save();return reply();}
  /* S4 ข้อ 43 (รอบเก็บตก): ต้นไม้ส่วนกลางของหมู่บ้าน ย้ายได้เฉพาะหัวหน้า · เก็บตำแหน่งตามธีม */
  if(type==='nbTrees'){if(!leader)fail('หัวหน้าเนเบอร์ฮูดเท่านั้นที่ย้ายต้นไม้ส่วนกลางได้');const m=input.m&&typeof input.m==='object'&&!Array.isArray(input.m)?input.m:null;if(!m)fail('ข้อมูลต้นไม้ไม่ถูกต้อง');const ks=Object.keys(m);if(ks.length>200)fail('ข้อมูลต้นไม้ไม่ถูกต้อง');const out={};
   for(const k of ks){const v=m[k];if(!/^\d{1,3}$/.test(k)||!Array.isArray(v)||v.length!==2||!v.every(n=>Number.isFinite(Number(n))&&Math.abs(Number(n))<70))fail('ข้อมูลต้นไม้ไม่ถูกต้อง');out[k]=[+(+v[0]).toFixed(2),+(+v[1]).toFixed(2)];}
   nb.trees={th:nb.theme||'forest',m:out};save();return reply();}
  /* S4 ข้อ 109: อัปเกรดบ้านในชุมชน Lv1→2→3 ใช้ดอกไม้/ผลไม้/หญ้า · รอ ≥10 ชม. */
  if(type==='nbUpgrade'){if(nb.status!=='active')fail('อัปเกรดได้เมื่อเนเบอร์ฮูดเปิดใช้แล้ว');const h=nbHouseOf(nb,uid,now);if(h.up)fail('กำลังอัปเกรดอยู่ เสร็จใน '+Math.ceil((h.up.end-now)/3600000)+' ชม.');const to=h.lv+1,c=NB_HOUSE_UP[to];if(!c)fail('บ้านเลเวลสูงสุดแล้ว');
   for(const g of ['flower','fruit','grass'])if(bagTotal(game,g)<c[g])fail({flower:'ดอกไม้',fruit:'ผลไม้',grass:'หญ้า'}[g]+'ไม่พอ (ต้องใช้ '+c[g].toLocaleString('en-US')+' มี '+bagTotal(game,g).toLocaleString('en-US')+')');
   for(const g of ['flower','fruit','grass'])bagTake(game,g,c[g]);
   nb.houses ||= {};nb.houses[uid]={lv:h.lv,st:h.st,up:{to,end:now+c.h*3600000,at:now}};nbLog(nb,'🏗️',(ctx.name||'ผู้เล่น')+' เริ่มอัปเกรดบ้านเป็นเลเวล '+to,now);save();return reply({upgrade:nb.houses[uid]});}
  if(type==='invite'){
   if(nb.status==='pending')fail('รอยัยหนูอนุมัติอยู่ เชิญเพิ่มไม่ได้');const to=input.to;if(!uidOk(to)||to===uid)fail('เลือกผู้เล่น');
   if((nb.members.length+(nb.invites||[]).length)>=NB_MAX)fail('เชิญได้รวมไม่เกิน '+NB_MAX+' คน');if((nb.invites||[]).includes(to))fail('เชิญคนนี้ไปแล้ว');
   const [root,inv]=await Promise.all([tx.get(db.doc('players/'+to)),tx.get(nbInviteRef(to))]);if(!root.exists||(root.data().approval&&root.data().approval!=='approved'))fail('ไม่พบผู้เล่น');
   if(nbIdOk(root.data().nb)){const other=await load(root.data().nb);if(other&&other.status!=='disbanded'&&(other.members||[]).includes(to))fail('ผู้เล่นคนนี้มีเนเบอร์ฮูดแล้ว');}
   nb.invites=[...(nb.invites||[]),to];nb.names={...nb.names,[to]:String(root.data().name||'ผู้เล่น').slice(0,40)};save();
   const list=(inv.exists?inv.data().list||[]:[]).filter(x=>x.nb!==nbId).slice(-9);writes['nbInvites/'+to]={list:[...list,{nb:nbId,name:nb.name,emblem:nb.emblem,from:ctx.name||'ผู้เล่น',at:now}]};
   return reply();
  }
  if(type==='uninvite'){
   const to=input.to;if(!(nb.invites||[]).includes(to))fail('ไม่มีคำเชิญนี้');nb.invites=nb.invites.filter(u=>u!==to);save();
   const inv=await tx.get(nbInviteRef(to));writes['nbInvites/'+to]={list:(inv.exists?inv.data().list||[]:[]).filter(x=>x.nb!==nbId)};return reply();
  }
  if(type==='contribute'){
   if(nb.status!=='forming')fail('ลงขันได้ตอนกำลังสร้างเท่านั้น');const row=NB_COST.find(c=>c[0]===input.item);if(!row)fail('ของนี้ไม่ต้องลงขัน');
   const q=input.qty;if(!Number.isInteger(q)||q<1)fail('จำนวนไม่ถูกต้อง');const left=Math.max(0,row[2]-(Number(nb.pool?.[row[0]])||0)),have=bagGet(game,row[1]),n=Math.min(q,left,have);
   if(left<=0)fail('ของชนิดนี้ครบแล้ว');if(n<=0)fail('ของในกระเป๋าไม่พอ');
   bagPut(game,row[1],have-n);nb.pool={...(nb.pool||{}),[row[0]]:(Number(nb.pool?.[row[0]])||0)+n};nb.contrib ||= {};nb.contrib[uid]={...(nb.contrib[uid]||{}),[row[0]]:(Number(nb.contrib[uid]?.[row[0]])||0)+n};save();
   return reply({given:{item:row[0],qty:n}});
  }
  if(type==='submit'){
   if(!leader)fail('เฉพาะหัวหน้ายื่นคำขอได้');if(nb.status!=='forming')fail('ยื่นคำขอไปแล้ว');if(nb.members.length<NB_MIN)fail('ต้องมีสมาชิกอย่างน้อย '+NB_MIN+' คน');if(!costDone(nb.pool))fail('ลงขันยังไม่ครบ');
   nb.status='pending';nb.submittedAt=now;delete nb.rejectNote;nbLog(nb,'📨','ยื่นคำขอให้ยัยหนูอนุมัติ',now);save();return reply();
  }
  if(type==='withdraw'){if(!leader)fail('เฉพาะหัวหน้า');if(nb.status!=='pending')fail('ไม่มีคำขอที่รออยู่');nb.status='forming';nbLog(nb,'↩️','ยกเลิกคำขอ (ของยังอยู่ครบ)',now);save();return reply();}
  if(type==='leave'){
   if(nb.status==='pending')fail('รอยัยหนูอนุมัติอยู่ ยกเลิกคำขอก่อนจึงออกได้');
   if(nb.status==='forming'){
    if(leader){ // หัวหน้าออก = ยุบ คืนของทุกคนทางไปรษณีย์
     for(const m of nb.members){nbRefundMail(writes,updates,m,nb.contrib?.[m],'🏘️ คืนของลงขัน: '+nb.name,now);if(m!==uid)setRoot(m,null);}
     for(const to of nb.invites||[]){const inv=await tx.get(nbInviteRef(to));writes['nbInvites/'+to]={list:(inv.exists?inv.data().list||[]:[]).filter(x=>x.nb!==nbId)};}
     nb.status='disbanded';nb.members=[];nb.invites=[];nb.pool={};nbLog(nb,'🏚️','ยุบเนเบอร์ฮูด คืนของครบ',now);save();setRoot(uid,null);
    } else {
     nbRefundMail(writes,updates,uid,nb.contrib?.[uid],'🏘️ คืนของลงขัน: '+nb.name,now);
     for(const [k,q]of Object.entries(nb.contrib?.[uid]||{}))nb.pool[k]=Math.max(0,(Number(nb.pool[k])||0)-q);
     if(nb.contrib)delete nb.contrib[uid];nb.members=nb.members.filter(u=>u!==uid);nbLog(nb,'🚪',(ctx.name||'ผู้เล่น')+' ออกจากทีม (คืนของแล้ว)',now);save();setRoot(uid,null);
    }
    if(updates['players/'+uid]?.mailCount){delete updates['players/'+uid].mailCount;mailDelta=1;}
    const out=await reply();out.response.nbId=null;out.response.nb=null;return out;
   }
   const joined=nb.joinedAt?.[uid]||0;if(now<joined+NB_LOCK)fail('ออกได้หลังเข้าครบ 30 ชั่วโมง');
   nb.members=nb.members.filter(u=>u!==uid);nbLog(nb,'🚪',(ctx.name||'ผู้เล่น')+' ออกจากเนเบอร์ฮูด',now);
   if(!nb.members.length){nb.status='disbanded';}else if(leader){nb.leader=[...nb.members].sort((a,b)=>(nb.joinedAt?.[a]||0)-(nb.joinedAt?.[b]||0))[0];nbLog(nb,'👑',(nb.names?.[nb.leader]||'สมาชิก')+' เป็นหัวหน้าคนใหม่',now);}
   save();setRoot(uid,null);const out=await reply();out.response.nbId=null;out.response.nb=null;return out;
  }
  // fix15e: หัวหน้าเชิญสมาชิกออก (ตอนสร้าง: คืนของลงขันทางไปรษณีย์ครบ · ไม่แตะกุศล เหรียญ หรือกระเป๋า)
  if(type==='kick'){
   if(!leader)fail('เฉพาะหัวหน้าเท่านั้น');if(nb.status==='pending')fail('รอยัยหนูอนุมัติอยู่ เชิญออกไม่ได้');
   const to=input.to;if(!uidOk(to)||to===uid||!nb.members.includes(to))fail('เลือกสมาชิกในบ้าน');
   if(nb.status==='forming'){nbRefundMail(writes,updates,to,nb.contrib?.[to],'🏘️ คืนของลงขัน: '+nb.name,now);for(const [k,q]of Object.entries(nb.contrib?.[to]||{}))nb.pool[k]=Math.max(0,(Number(nb.pool[k])||0)-q);if(nb.contrib)delete nb.contrib[to];}
   nb.members=nb.members.filter(u=>u!==to);nbLog(nb,'👢',(ctx.name||'หัวหน้า')+' เชิญ '+(nb.names?.[to]||'สมาชิก')+' ออกจากบ้าน',now);save();setRoot(to,null);
   writes['mail/'+to+'/items/nb-kick-'+now]={title:'🏘️ ออกจากเนเบอร์ฮูด '+nb.name,msg:'หัวหน้าบ้านเชิญคุณออกจากเนเบอร์ฮูดแล้ว · หาบ้านใหม่ได้เลย',icon:'🏘️',kusal:0,coins:0,items:{},createdAt:FieldValue.serverTimestamp(),from:'เนเบอร์ฮูด'};
   updates['players/'+to]={...(updates['players/'+to]||{}),mailCount:FieldValue.increment(1)};
   return reply();
  }
  if(type==='gift'){
   if(nb.status!=='active')fail('ส่งของได้เมื่อเนเบอร์ฮูดเปิดใช้แล้ว');const to=input.to;if(!uidOk(to)||to===uid||!nb.members.includes(to))fail('ส่งได้เฉพาะสมาชิกในเนเบอร์ฮูดเดียวกัน');
   const items=input.items;if(!items||typeof items!=='object'||Array.isArray(items))fail('เลือกของก่อน');const list=Object.entries(items).filter(([,q])=>q!==0);
   if(!list.length)fail('เลือกของก่อน');if(list.length>NB_GIFT_KINDS)fail('ส่งได้ครั้งละไม่เกิน '+NB_GIFT_KINDS+' ชนิด');
   for(const [k,q]of list){const c=NB_CAT.get(k);if(!c)fail('ของนี้ส่งไม่ได้');if(!Number.isInteger(q)||q<1||q>NB_GIFT_MAX)fail('ส่งได้ชนิดละ 1–'+NB_GIFT_MAX);if(bagGet(game,c.p)<q)fail(c.n+' ไม่พอ');}
   const dref=nbDayRef(nbId,day),ds=await tx.get(dref),d=ds.exists?ds.data():{q:{}};d.gifts ||= {};const used=Number(d.gifts[uid])||0;if(used>=NB_GIFT_DAY)fail('วันนี้ส่งครบ '+NB_GIFT_DAY+' ครั้งแล้ว');
   const toRoot=await tx.get(db.doc('players/'+to));if(!toRoot.exists)fail('ไม่พบผู้รับ');
   for(const [k,q]of list){const c=NB_CAT.get(k);bagPut(game,c.p,bagGet(game,c.p)-q);}
   const sticker=NB_STICKERS.includes(input.sticker)?input.sticker:'🎁';
   d.gifts[uid]=used+1;d.log=[{e:'🎁',from:uid,to,items:Object.fromEntries(list),sticker,at:now},...(d.log||[])].slice(0,40);writes[dref.path]=d;
   writes['mail/'+to+'/items/nb-gift-'+uid+'-'+now]={title:sticker+' ของจาก '+(ctx.name||'เพื่อนบ้าน'),msg:'เพื่อนในเนเบอร์ฮูด '+nb.name+' ส่งของมาให้',icon:'🎁',kusal:0,coins:0,items:Object.fromEntries(list),createdAt:FieldValue.serverTimestamp(),from:'เนเบอร์ฮูด'};
   updates['players/'+to]={...(updates['players/'+to]||{}),mailCount:FieldValue.increment(1)};
   return reply({sent:{to,left:NB_GIFT_DAY-used-1}});
  }
  fail('คำสั่งเนเบอร์ฮูดไม่ถูกต้อง');
 }});
});
/* แอดมิน: อนุมัติ/ไม่อนุมัติคำขอสร้าง */
export const nbAdminCloud=callable(async req=>{
 const {nb:id,decision,note}=req.data||{};if(!nbIdOk(id)||!['approve','reject','add','remove','uninvite'].includes(decision))refuse('คำขอไม่ถูกต้อง');
 if(['add','remove','uninvite'].includes(decision))return nbAdminManage(req.auth.uid,id,decision,req.data?.uid);
 return db.runTransaction(async tx=>{
  if(!(await tx.get(db.doc('admins/'+req.auth.uid))).exists)refuse('เฉพาะแอดมิน','permission-denied');
  const ref=nbRef(id),snap=await tx.get(ref);if(!snap.exists)refuse('ไม่พบเนเบอร์ฮูด');const nb=snap.data(),now=Date.now();if(nb.status!=='pending')refuse('คำขอนี้ตัดสินแล้ว');
  if(decision==='approve'){if((nb.members||[]).length<NB_MIN||!costDone(nb.pool))refuse('สมาชิกหรือของลงขันไม่ครบ');nb.status='active';nb.activatedAt=now;nb.joinedAt=Object.fromEntries(nb.members.map(u=>[u,now]));nbLog(nb,'🎉','ยัยหนูอนุมัติแล้ว! เริ่มทำเควสต์ได้เลย',now);}
  else{nb.status='forming';nb.rejectNote=String(note||'').slice(0,120);nbLog(nb,'📝','ยัยหนูยังไม่อนุมัติ'+(nb.rejectNote?' · '+nb.rejectNote:'')+' (ของยังอยู่ครบ)',now);}
  tx.set(ref,nb);return {status:nb.status};
 });
});
/* fix15e แอดมิน: เพิ่ม/เอาสมาชิกออก/ยกเลิกคำเชิญ ของบ้านที่เปิดใช้แล้ว · ไม่แตะกุศล เหรียญ หรือของในกระเป๋าของใคร */
async function nbAdminManage(adminUid,id,decision,to){
 if(!uidOk(to))refuse('เลือกผู้เล่นก่อน');
 return db.runTransaction(async tx=>{
  if(!(await tx.get(db.doc('admins/'+adminUid))).exists)refuse('เฉพาะแอดมิน','permission-denied');
  const ref=nbRef(id),snap=await tx.get(ref);if(!snap.exists)refuse('ไม่พบเนเบอร์ฮูด');const nb=snap.data(),now=Date.now();
  if(nb.status!=='active')refuse('จัดการได้เฉพาะบ้านที่เปิดใช้แล้ว');
  nb.members ||= [];nb.invites ||= [];
  const pref=db.doc('players/'+to),iref=nbInviteRef(to),[root,inv]=await Promise.all([tx.get(pref),tx.get(iref)]);
  const dropInvite=()=>{nb.invites=nb.invites.filter(u=>u!==to);tx.set(iref,{list:(inv.exists?inv.data().list||[]:[]).filter(x=>x.nb!==id)});};
  const notify=(key,title,msg,rootPatch={})=>{if(!root.exists)return;tx.set(db.doc('mail/'+to+'/items/'+key+'-'+now),{title,msg,icon:'🏘️',kusal:0,coins:0,items:{},createdAt:FieldValue.serverTimestamp(),from:'เนเบอร์ฮูด'});tx.update(pref,{...rootPatch,mailCount:FieldValue.increment(1)});};
  if(decision==='add'){
   if(!root.exists||(root.data().approval&&root.data().approval!=='approved'))refuse('ไม่พบผู้เล่น');
   if((await tx.get(db.doc('admins/'+to))).exists)refuse('เพิ่มบัญชีแอดมินไม่ได้');
   if(nb.members.includes(to))refuse('อยู่ในบ้านนี้แล้ว');
   const other=root.data().nb;if(nbIdOk(other)&&other!==id){const o=await tx.get(nbRef(other));if(o.exists&&o.data().status!=='disbanded'&&(o.data().members||[]).includes(to))refuse('ผู้เล่นคนนี้อยู่บ้านอื่นแล้ว');}
   if(nb.members.length>=NB_MAX)refuse('บ้านเต็ม '+NB_MAX+' คนแล้ว');
   const others=nb.invites.filter(u=>u!==to);if(nb.members.length+others.length>=NB_MAX)refuse('ที่ว่างถูกจองด้วยคำเชิญอื่น ยกเลิกคำเชิญก่อน');
   dropInvite();nb.members=[...nb.members,to];nb.names={...(nb.names||{}),[to]:String(root.data().name||'ผู้เล่น').slice(0,40)};nb.joinedAt={...(nb.joinedAt||{}),[to]:now};
   nbLog(nb,'👥','ยัยหนูเพิ่ม '+nb.names[to]+' เข้าบ้าน',now);tx.set(ref,nb);
   notify('nb-add','🏘️ เข้าเนเบอร์ฮูด '+nb.name,'ยัยหนูเพิ่มคุณเข้าเนเบอร์ฮูดแล้ว · ไปทำเควสต์กับเพื่อนบ้านได้เลย',{nb:id});
   return {ok:true,members:nb.members.length};
  }
  if(decision==='remove'){
   if(!nb.members.includes(to))refuse('ไม่ใช่สมาชิกบ้านนี้');
   nb.members=nb.members.filter(u=>u!==to);nbLog(nb,'🚪','ยัยหนูนำ '+(nb.names?.[to]||'สมาชิก')+' ออกจากบ้าน',now);
   if(!nb.members.length)nb.status='disbanded';else if(nb.leader===to){nb.leader=[...nb.members].sort((a,b)=>(nb.joinedAt?.[a]||0)-(nb.joinedAt?.[b]||0))[0];nbLog(nb,'👑',(nb.names?.[nb.leader]||'สมาชิก')+' เป็นหัวหน้าคนใหม่',now);}
   tx.set(ref,nb);
   notify('nb-out','🏘️ ออกจากเนเบอร์ฮูด '+nb.name,'ยัยหนูนำคุณออกจากเนเบอร์ฮูดแล้ว · หาบ้านใหม่ได้เลย',root.exists&&root.data().nb===id?{nb:null}:{});
   return {ok:true,members:nb.members.length};
  }
  if(!nb.invites.includes(to))refuse('ไม่มีคำเชิญนี้');dropInvite();tx.set(ref,nb);return {ok:true};
 });
}
/* เที่ยงคืนไทย: จ่ายตะกร้าเมื่อวาน + หักคนที่ไม่มีเนเบอร์ฮูด (ทำซ้ำได้ ไม่จ่าย/หักซ้ำ) */
async function nbMidnightRun(now=Date.now()){
 const day=nbDay(now-3600000),summary={paid:0,fined:0,skipped:0};
 const settingsRef=db.doc('settings/neighborhood'),settings=await settingsRef.get();let fineFrom=settings.exists?settings.data().fineFrom:null;
 if(!fineFrom){fineFrom=nbDay(now+3*864e5);await settingsRef.set({fineFrom},{merge:true});}
 const lists=await Promise.all(['active','pending'].map(s=>db.collection('neighborhoods').where('status','==',s).get())),safe=new Set();
 for(const d of lists.flatMap(l=>l.docs)){const nb=d.data();for(const u of nb.members||[])safe.add(u);if(nb.status!=='active')continue;
  await db.runTransaction(async tx=>{
   const dref=nbDayRef(d.id,day),ds=await tx.get(dref),dd=ds.exists?ds.data():{q:{}};if(dd.paid)return;
   const prog=nbProgress(dd,nb.members||[],d.id,day),roots=await Promise.all((nb.members||[]).map(u=>tx.get(db.doc('players/'+u))));
   /* เก็บตก 12: บ้านเลเวลสูงได้กุศลตะกร้ามากขึ้น Lv1 ×1 · Lv2 ×1.2 · Lv3 ×1.5 */(nb.members||[]).forEach((u,i)=>{if(!roots[i].exists||prog.net<=0)return;const hl=nbHouseOf(nb,u,Date.now()).lv,mul=hl>=3?1.5:hl===2?1.2:1,net=Math.round(prog.net*mul);tx.set(db.doc('mail/'+u+'/items/nb-basket-'+day),{title:'🧺 ตะกร้าเนเบอร์ฮูด '+day,msg:'เควสต์สำเร็จ '+prog.done+'/'+prog.rows.length+' · ตะกร้า '+prog.base.toLocaleString('en-US')+(prog.cut?' · หัก '+Math.round(prog.cut*100)+'%':'')+(mul>1?' · บ้าน Lv'+hl+' ×'+mul:''),icon:'🧺',kusal:net,coins:0,items:{},createdAt:FieldValue.serverTimestamp(),from:'เนเบอร์ฮูด'});tx.update(db.doc('players/'+u),{mailCount:FieldValue.increment(1)});});
   tx.set(dref,{...dd,paid:true,result:{done:prog.done,base:prog.base,cut:prog.cut,net:prog.net,members:(nb.members||[]).length}});summary.paid++;
  });
 }
 if(day<fineFrom)return {...summary,fineFrom,day};
 const admins=new Set((await db.collection('admins').get()).docs.map(d=>d.id));let last=null;
 for(let page=0;page<100;page++){
  let q=db.collection('players').orderBy(FieldPath.documentId()).limit(200);if(last)q=q.startAfter(last);const snap=await q.get();
  for(const p of snap.docs){const r=p.data();if(admins.has(p.id)||safe.has(p.id)||(r.approval&&r.approval!=='approved')||r.storageVersion!==2){summary.skipped++;continue;}
   const lref=db.doc('players/'+p.id+'/ledger/nb-fine-'+day),mref=db.doc('mail/'+p.id+'/items/nb-fine-'+day);
   await db.runTransaction(async tx=>{const prior=await tx.get(mref);if(prior.exists)return;
    tx.set(lref,{merit:-NB_FINE,title:'🏘️ ยังไม่มีเนเบอร์ฮูด',msg:'หักกุศลเที่ยงคืน '+NB_FINE.toLocaleString('en-US'),at:FieldValue.serverTimestamp(),source:'nb'});
    tx.set(mref,{title:'🏘️ ยังไม่มีเนเบอร์ฮูด −'+NB_FINE.toLocaleString('en-US')+' กุศล',msg:'ระบบหักกุศลเที่ยงคืน เพราะยังไม่มีเนเบอร์ฮูด · เข้าเนเบอร์ฮูดรับสูงสุดวันละ 1,000,000',icon:'🏘️',kusal:0,coins:0,items:{},createdAt:FieldValue.serverTimestamp(),from:'เนเบอร์ฮูด'});
    tx.update(db.doc('players/'+p.id),{ledgerPending:true,mailCount:FieldValue.increment(1)});summary.fined++;});
  }
  if(snap.docs.length<200)break;last=snap.docs.at(-1);
 }
 return {...summary,fineFrom,day};
}
export const nbMidnight=onSchedule({...options,schedule:'0 0 * * *',timeZone:'Asia/Bangkok',timeoutSeconds:540},async event=>nbMidnightRun(event?.testNow||Date.now()));

/* ---------- fix14 แรลลี่กระทง (เล่นพร้อมกัน 6 คน) ----------
   privateWorld/funrun = ห้องจริง (เซิร์ฟเวอร์เท่านั้น) · world/funrun = มุมมองสาธารณะ · ตำแหน่งระหว่างวิ่งอยู่ใน funrunLive/{game}/p/{uid} (หน้าเกมเขียนเอง ไม่เกี่ยวกับเงิน) */
export const funrunActionCloud=callable(async req=>{
 const input=req.data?.input||{};
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input,system:'funrun',partIds:['inventory','wallet','animals-minigames'],worldIds:['privateWorld/funrun','world/minigames'],readOnly:input.type==='status',apply:async(game,worlds,ctx)=>{
  ctx.emergency=!!mgSettings(worlds['world/minigames']).emergency;const prior=worlds['privateWorld/funrun'],out=funrunAction(prior,game,ctx,input);Object.assign(game,out.game);
  const writes={},updates={};let mailDelta=0;
  if(!sameData(out.room,prior||{})){writes['privateWorld/funrun']=out.room;writes['world/funrun']={...funrunPublic(out.room),serverNow:ctx.now};}
  for(const p of out.payouts||[]){if(!p.merit)continue;if(p.uid===ctx.uid){const m0=game.merit||0;game.merit=p.merit<0?m0+p.merit:m0+p.merit;continue;}
   writes['players/'+p.uid+'/ledger/funrun-'+out.room.game+'-'+p.uid]={merit:p.merit,title:'🪷 แรลลี่กระทง',msg:(p.merit>0?'ได้':'เสีย')+' '+Math.abs(p.merit).toLocaleString('en-US')+' กุศล',at:FieldValue.serverTimestamp(),source:'funrun'};}
  for(const x of out.refunds||[]){if(x.self)continue;writes['mail/'+x.uid+'/items/funrun-refund-'+ctx.now]={title:'🪷 คืนค่าเข้าแรลลี่กระทง',msg:'ห้องถูกล้าง คืนค่าเข้าครบ',icon:'🪷',kusal:0,coins:x.fee.coin,items:{hat:x.fee.hat,musicbox:x.fee.mb},createdAt:FieldValue.serverTimestamp(),from:'มินิเกม'};updates['players/'+x.uid]={mailCount:FieldValue.increment(1)};}
  return {writes,updates,mailDelta,coins:out.coins,response:{room:funrunPublic(out.room),serverNow:ctx.now,payouts:out.payouts||null}};
 }});
});

/* ---------- fix15 ข่าวลือ (ส่งจากศูนย์แอดมิน) ----------
   rumors/{uid} = {cur:{id,k:'G'|'B',i,at,until}, last:{...ผล}} ผู้เล่นอ่านของตัวเองเท่านั้น (ฟังเอกสารเดียว ไม่ต้องถามซ้ำ)
   adminRumors/board = {rows:{uid:{k,i,at,until,res,resAt,name}}} สำหรับดูสถานะในศูนย์แอดมิน
   คนหนึ่งมีข่าวค้างได้ทีละ 1 ข่าว · ไม่บอกผู้เล่นว่าใครส่ง */
export const rumorActionCloud=callable(async req=>{
 const input=req.data?.input||{};
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input,system:'rumor',partIds:['inventory','wallet'],apply:async(game,worlds,ctx,tx)=>{
  const ref=db.doc('rumors/'+ctx.uid),snap=await tx.get(ref),board=db.doc('adminRumors/board'),bs=await tx.get(board);
  const out=rumorAction(snap.exists?snap.data():{},game,ctx,input);Object.assign(game,out.game);
  const writes={['rumors/'+ctx.uid]:out.state},updates={};
  if(bs.exists)updates['adminRumors/board']={['rows.'+ctx.uid+'.res']:out.res,['rows.'+ctx.uid+'.resAt']:ctx.now};
  return {writes,updates,coins:out.coins,response:{res:out.res,result:out.result,rumor:out.rumor,serverNow:ctx.now}};
 }});
});
export const rumorAdminCloud=callable(async req=>{
 const input=req.data||{},uid=req.auth.uid;
 if(!(await db.doc('admins/'+uid).get()).exists)refuse('เฉพาะแอดมิน','permission-denied');
 const board=db.doc('adminRumors/board'),now=Date.now();
 if(input.type==='status'){const b=await board.get();return {rows:b.exists?b.data().rows||{}:{},serverNow:now};}
 if(input.type!=='send')refuse('คำสั่งไม่ถูกต้อง','invalid-argument');
 const k=input.k==='B'?'B':'G',list=k==='G'?RUMOR_GOOD:RUMOR_BAD;let i=input.i,c=null;
 /* S4 ข้อ 173: ข่าวที่แอดมินพิมพ์เอง */
 if(input.custom&&typeof input.custom.t==='string'){const t=input.custom.t.trim().slice(0,300),n=Math.round(+input.custom.n||0);if(t.length<5)refuse('พิมพ์ข่าวอย่างน้อย 5 ตัวอักษร','invalid-argument');if(!(n>=1&&n<=1000000000))refuse('ใส่จำนวนกุศล 1–1,000,000,000','invalid-argument');c={t,n};i=-1;}
 else if(!Number.isInteger(i)||!list[i])refuse('เลือกข่าวลือ','invalid-argument');
 let uids=[];
 if(input.all===true){const ps=await db.collection('players').get();uids=ps.docs.filter(d=>(!d.data().approval||d.data().approval==='approved')&&d.data().storageVersion===2).map(d=>d.id);}
 else uids=[...new Set(Array.isArray(input.uids)?input.uids:[])].filter(u=>typeof u==='string'&&/^[-a-zA-Z0-9_]{1,128}$/.test(u));
 if(!uids.length||uids.length>5000)refuse('เลือกผู้รับ','invalid-argument');
 const sent=[],busy=[];
 for(let s=0;s<uids.length;s+=200){
  const chunk=uids.slice(s,s+200);
  await db.runTransaction(async tx=>{
   const [docs,roots,b]=await Promise.all([Promise.all(chunk.map(u=>tx.get(db.doc('rumors/'+u)))),Promise.all(chunk.map(u=>tx.get(db.doc('players/'+u)))),tx.get(board)]);
   const rows=b.exists?{...(b.data().rows||{})}:{};
   chunk.forEach((u,j)=>{if(!roots[j].exists)return;const d=docs[j].exists?docs[j].data():{};if(d.cur){busy.push(u);return;}
    const id=randomUUID().slice(0,12),cur={id,k,i,at:now,until:now+RUMOR_TIME,...(c?{c}:{})};tx.set(db.doc('rumors/'+u),{...d,cur});
    rows[u]={k,i,at:now,until:now+RUMOR_TIME,...(c?{c}:{}),name:String(roots[j].data().name||'ผู้เล่น').slice(0,40)};sent.push(u);});
   tx.set(board,{rows,updatedAt:FieldValue.serverTimestamp()});
  });
 }
 return {sent:sent.length,busy:busy.length,serverNow:now};
});

/* fix17 🎭 ไอเทมปีศาจ: players/{uid}/gameViews/demon = สิ่งที่คนโดนเห็น (ไม่มีชื่อคนแกล้ง) · privateDemon/{uid} = ใครวาง (เซิร์ฟเวอร์เท่านั้น)
   root.dmp = มีของค้างให้ตัดสิน (เข้าเกมแล้วตัดสินทันที) · root.dmc = สวนถูกหีบบัวล็อกถึงเวลา · demonLog/{วัน}/e/* = บันทึกเฉพาะแอดมิน */
const DM_VIEW=u=>'players/'+u+'/gameViews/demon',DM_PRIV=u=>'privateDemon/'+u,dmRng=()=>randomInt(4294967296)/4294967296;
const dmOkPlayer=d=>d.exists&&d.data().storageVersion===2&&(!d.data().approval||d.data().approval==='approved');
async function dmLoad(tx,u,now){const [v,p]=await Promise.all([tx.get(db.doc(DM_VIEW(u))),tx.get(db.doc(DM_PRIV(u)))]);const v0=v.exists?v.data():null;return {d:dmView(v0,now),priv:p.exists?structuredClone(p.data()):{},v0,p0:p.exists?p.data():null};}
function dmSave(writes,updates,u,box,now,{dmc}={}){const {d,priv,v0,p0}=box;const view={...d,updatedAt:now};
 if(!v0||!sameData({...v0,updatedAt:0},{...view,updatedAt:0}))writes[DM_VIEW(u)]=view;
 const pv={cf:priv.cf||{},ht:priv.ht||{},...((priv.gh&&Object.keys(priv.gh).length)||p0?.gh?{gh:priv.gh||{}}:{}),...(priv.box?{box:priv.box}:{})};if(!p0||!sameData(p0,pv))writes[DM_PRIV(u)]=pv;
 const up={dmp:dmActive(d)};if(dmc!==undefined)up.dmc=dmc;updates['players/'+u]={...(updates['players/'+u]||{}),...up};}
const dmLog=(writes,now,row)=>{writes['demonLog/'+thaiDayKey(now)+'/e/'+now.toString(36)+randomInt(1e9).toString(36)]={...row,at:now};};
async function dmTarget(tx,me,to){if(typeof to!=='string'||!/^[-a-zA-Z0-9_]{1,128}$/.test(to)||to===me)refuse(DEMON_NOPE);
 const [d,adm]=await Promise.all([tx.get(db.doc('players/'+to)),tx.get(db.doc('admins/'+to))]);if(!dmOkPlayer(d)||adm.exists)refuse(DEMON_NOPE);return d;}
/* คนโดนตัดสินของค้าง (ใช้ตอนเข้าเกมด้วย) */
async function dmSettleSelf(tx,game,ctx,writes,updates){const box=await dmLoad(tx,ctx.uid,ctx.now);const r=victimSettle(box.d,game,ctx.now);const lock=box.d.cf.length?Math.max(...box.d.cf.map(c=>c.until)):0;dmSave(writes,updates,ctx.uid,box,ctx.now,{dmc:lock});return {box,lost:r.lost};}
export const demonActionCloud=callable(async req=>{
 const input=req.data?.input||{},type=input.type;
 if(type==='log'){/* แอดมินเท่านั้น: บันทึกการแกล้งรายวัน (ไม่ผ่านเซฟ) */
  if(!(await db.doc('admins/'+req.auth.uid).get()).exists)refuse('เฉพาะแอดมิน','permission-denied');const day=typeof input.day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(input.day)?input.day:thaiDayKey(Date.now());
  const rows=await db.collection('demonLog/'+day+'/e').limit(500).get();return {day,rows:rows.docs.map(d=>d.data()).sort((a,b)=>b.at-a.at)};}
 if(!['send','toss','settle','seal','flip','pass','hpay','gsend','gclear','petRoll','sync'].includes(type))refuse('รายการไม่ถูกต้อง','invalid-argument');
 if((await db.doc('admins/'+req.auth.uid).get()).exists)refuse('บัญชีแอดมินไม่ใช้ไอเทมจอมแสบ (ส่งให้ผู้เล่นได้จากศูนย์แอดมิน)');
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input,system:'demon',partIds:['inventory','wallet'],apply:async(game,worlds,ctx,tx)=>{
  const writes={},updates={},now=ctx.now,res={serverNow:now};
  const syncOut=demonSync(game,ctx.x17,now);if(syncOut.boom.length)res.boom=syncOut.boom;
  if(type==='send'){const kind=input.kind;if(!DEMON[kind])refuse('ไอเทมไม่ถูกต้อง');const to=input.to,tdoc=await dmTarget(tx,ctx.uid,to);
   const [box,prank]=await Promise.all([dmLoad(tx,to,now),tx.get(db.doc('players/'+to+'/saves/animals-prank'))]);
   const scare=prank.exists?(joinGame([prank.data()]).sub?.prank?.scareUntil||0):0;
   const out=demonSend({game,ax17:ctx.x17,d:box.d,priv:box.priv,actor:ctx.uid,victim:to,kind,now,scare,rng:dmRng,n:input.n});
   dmSave(writes,updates,to,box,now,out.dmc?{dmc:out.dmc}:{});
   dmLog(writes,now,{w:'send',k:kind,n:out.n||1,from:ctx.uid,fn:String(ctx.name||'').slice(0,40),to,tn:String(tdoc.data().name||'').slice(0,40)});
   res.sent={kind,n:out.n||1,name:String(tdoc.data().name||'ผู้เล่น').slice(0,40)};}
  else if(type==='toss'){res.toss=demonToss(game,ctx.x17,input.kind,now);}
  else if(type==='petRoll'){res.pet=petRoll(game,ctx.x17,input.earned,now,dmRng);}
  else if(type==='sync'){/* ตรวจของหมดอายุ/เริ่มนับ 48 ชม. (ทำไปแล้วข้างบน) */}
  else{/* ของฝั่งคนโดน: settle / seal / flip / pass */
   const box=await dmLoad(tx,ctx.uid,now);let t=null;
   if(type==='pass'||type==='gsend'){t=await dmTarget(tx,ctx.uid,input.to);}
   const tbox=t?await dmLoad(tx,input.to,now):null;
   const r=victimSettle(box.d,game,now);res.lost=r.lost;
   if(type==='seal'){const o=coffinOpen(box.d,box.priv,game,String(input.id||''),input.pick,now,dmRng);res.seal={result:o.result,amt:o.amt,seal:o.seal};
    if(o.reflect)writes['players/'+o.reflect.to+'/ledger/zz-dm-'+String(input.id).slice(0,40)]={merit:o.reflect.merit,title:'⛓️ มนต์หีบบัวสะท้อนกลับ',msg:'มนต์ที่คุณส่งไป ย้อนกลับมาหาคุณ',after:o.reflect.after,at:FieldValue.serverTimestamp(),source:'demon'};
    dmLog(writes,now,{w:'seal',k:'coffin',r:o.result,from:o.reflect?.to||null,to:ctx.uid,tn:String(ctx.name||'').slice(0,40)});}
   if(type==='flip')res.flip=hourFlip(box.d,game,String(input.id||''),now,input.alt);
   if(type==='hpay')res.hpay=heartPay(box.d,box.priv,game,String(input.id||''),input.how,now);
   if(type==='pass'){const o=heartPass({d:box.d,priv:box.priv,td:tbox.d,tpriv:tbox.priv,gx17:ctx.x17,me:ctx.uid,to:input.to,id:String(input.id||''),now,rng:dmRng});
    dmSave(writes,updates,input.to,tbox,now);res.pass={passes:o.passes,name:String(t.data().name||'ผู้เล่น').slice(0,40)};
    dmLog(writes,now,{w:'pass',k:'heart',from:ctx.uid,fn:String(ctx.name||'').slice(0,40),to:input.to,tn:String(t.data().name||'').slice(0,40),n:o.passes});}
   if(type==='gsend'){const o=ghostSend({d:box.d,td:tbox.d,me:ctx.uid,to:input.to,ids:input.ids,now});
    dmSave(writes,updates,input.to,tbox,now);res.gsend={n:o.n,name:String(t.data().name||'ผู้เล่น').slice(0,40)};
    dmLog(writes,now,{w:'gsend',k:'ghost',n:o.n,from:ctx.uid,fn:String(ctx.name||'').slice(0,40),to:input.to,tn:String(t.data().name||'').slice(0,40)});}
   if(type==='gclear')res.gclear=ghostClear(box.d,game,input.ids==='all'?'all':input.ids,input.broom===true,now,dmRng,input.alt);
   const lock=box.d.cf.length?Math.max(...box.d.cf.map(c=>c.until)):0;dmSave(writes,updates,ctx.uid,box,now,{dmc:lock});res.view=box.d;}
  return {writes,updates,response:{...res,demon:game.bag?.demon||{},merit:game.merit||0}};}});
});

/* fix21 🏭 โรงงานแปรรูปอัลปาก้า: สั่งงาน/รับของบนเซิร์ฟเวอร์ · ผีสิง = ของผีสิงเข้ามือคนแปรรูป (gameViews/demon.gh) ต้องส่งต่อใน 10 นาที */
export const alpacaActionCloud=callable(async req=>{
 const input=req.data?.input||{},type=input.type;if(!['order','claim','battery'].includes(type))refuse('รายการไม่ถูกต้อง','invalid-argument');
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input,system:'alpaca',partIds:['inventory','wallet','animals-alpaca','animals-campaigns'],worldIds:['world/campaigns'],apply:async(game,worlds,ctx,tx)=>{
  const writes={},updates={},now=ctx.now,res={serverNow:now};
  if(type==='order')res.order=factoryOrder(game,ctx.x17,input,now,dmRng);
  else if(type==='battery')res.battery=factoryBattery(game,ctx.x17,now,dmRng);
  else{const box=ctx.admin?null:await dmLoad(tx,ctx.uid,now);const prior=structuredClone(game),out=factoryClaim(game,ctx.x17,now,ctx.admin?()=>.999999:dmRng);/* แอดมินไม่โดนผีสิง */observeGameplay(prior,game,'alpaca',worlds['world/campaigns']||{},now);/* fix22d: กุศลจากโรงงานนับเข้าแคมเปญเลี้ยงสัตว์เหมือนเดิม */{const {ALPACA_MENU:AM}=await import('./alpaca-menu.js?h=4c9e1f4e');let pp=0;for(const[k,q]of Object.entries(out.got||{})){const m=AM.find(v=>v.id===k);if(m)pp+=Math.round((m.merit||0)/100)*q;}if(pp>0)recordCampaign(game,worlds['world/campaigns']||{},'proc',pp,now);}/* S4: แคมเปญโรงงานนี้หนูคุม */
   if(out.ghosts.length){victimSettle(box.d,game,now);ghostGive(box.d,box.priv,ctx.uid,out.ghosts,now,dmRng,game);const lock=box.d.cf.length?Math.max(...box.d.cf.map(c=>c.until)):0;dmSave(writes,updates,ctx.uid,box,now,{dmc:lock});res.view=box.d;
    dmLog(writes,now,{w:'ghost',k:'ghost',n:out.ghosts.length,from:ctx.uid,fn:String(ctx.name||'').slice(0,40),to:ctx.uid,tn:String(ctx.name||'').slice(0,40)});}
   res.claim={got:out.got,merit:out.merit,ghosts:out.ghosts.map(x=>({g:x.g,amt:x.amt})),n:out.n};}
  return {writes,updates,response:res};}});
});

/* fix17 📦 กล่องสุ่มมหากุศล: สถานะ/รหัส/การันตีเก็บใน privateMk/{uid} (เซิร์ฟเวอร์เท่านั้น ผู้เล่นอ่านไม่ได้) · หน้าเว็บได้แค่ขนาด ยอดลุ้น และคำใบ้ */
export const mahakusalActionCloud=callable(async req=>{
 const input=req.data?.input||{},type=input.type;if(!['status','open','guess','fast','craft'].includes(type))refuse('รายการไม่ถูกต้อง','invalid-argument');
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input,system:'mahakusal',partIds:['inventory','wallet','animals-alpaca'],readOnly:type==='status',apply:async(game,worlds,ctx,tx)=>{
  const ref=db.doc('privateMk/'+ctx.uid),snap=await tx.get(ref),before=snap.exists?snap.data():{},hold={mk:structuredClone(before)};
  const out=mahakusalAction(game,hold,input,ctx.now,()=>randomInt(4294967296)/4294967296);
  const writes={};if(!sameData(before,hold.mk))writes[ref.path]=hold.mk;
  return {writes,response:{...out,counts:mkBoxCounts(game),merit:game.merit||0,serverNow:ctx.now}};}});
},{...options,minInstances:1});/* fix18: เปิดเครื่องรอไว้ 1 เครื่อง ทายรหัสไม่ต้องรอเปิดเครื่อง */


/* ---------- fix19 🏧 ตู้ ATM กุศล ----------
   privateAtm/{uid} = {pin(แฮช),salt,fails,lockUntil,day,sent:{uid:n},hist:[...]} เซิร์ฟเวอร์เท่านั้น
   atmLog/{id} = บันทึกทุกรายการ (แอดมินอ่าน) · world/atm = {open} · กุศลเข้าไปรษณีย์คนรับทันที */
const atmHash=s=>createHash('sha256').update(String(s)).digest('hex');
const atmBank=(game,priv,now,b)=>({n:BANKS[b].n,ic:BANKS[b].ic,hasCard:atmHasCard(game,b),rate:fxRateCents(now,b),prev:fxRateCents(now-3600000,b),bonus:bankBonus(b,now),prime:bankPrime(now)===b,gold:bankGold(now)===b,fee:atmFeeRate(b,now),uses:atmUses(priv,b),every:ATM_BONUS_EVERY,bonusMerit:ATM_BONUS});
const atmView=(game,priv,open,now,coins=0,bank='lotus')=>({bank,name:BANKS[bank].n,ic:BANKS[bank].ic,hasCard:atmHasCard(game,bank),oldCard:(Number(game.bag?.item?.[ATM_CARD])||0)>0,pinSet:!!priv?.pin,open,locked:(priv?.lockUntil||0)>now?priv.lockUntil:0,today:atmToday(priv,now),sentN:atmSentN(priv,now),perDay:ATM_PER_DAY,feeRate:atmFeeRate(bank,now),bonus:bankBonus(bank,now),prime:bankPrime(now)===bank,gold:bankGold(now)===bank,uses:atmUses(priv,bank),every:ATM_BONUS_EVERY,bonusMerit:ATM_BONUS,hist:(priv?.hist||[]).slice(0,30),merit:game.merit||0,
 banks:{lotus:atmBank(game,priv,now,'lotus'),moon:atmBank(game,priv,now,'moon')},next:(Math.floor((now+7*3600000)/3600000)+1)*3600000-7*3600000,
 fx:{rate:fxRateCents(now,bank),base:fxRateCents(now),prev:fxRateCents(now-3600000,bank),next:(Math.floor((now+7*3600000)/3600000)+1)*3600000-7*3600000,used:fxToday(priv,now),perDay:FX_PER_DAY,max:FX_MAX,coins:Number(coins)||0,cauldron:Number(game.bag?.halloween?.cauldron)||0}});
/* ใช้ครบทุก 100 ครั้งต่อธนาคาร → 100,000 กุศลเข้าไปรษณีย์ */
const atmBonusMail=(writes,uid,bank,n,now)=>{writes['mail/'+uid+'/items/atmbonus-'+bank+'-'+n]={title:'🎁 โบนัสลูกค้าประจำ '+BANKS[bank].n,msg:BANKS[bank].ic+' ใช้บริการครบ '+n.toLocaleString('en-US')+' ครั้ง ธนาคารขอมอบ '+ATM_BONUS.toLocaleString('en-US')+' กุศลเป็นของขวัญ ขอบคุณที่ใช้บริการนะคะ',icon:'🎁',kusal:ATM_BONUS,coins:0,items:{},createdAt:FieldValue.serverTimestamp(),from:'ATM'};};

/* ===== S4 ระบบตัวละคร (3.2 สุ่ม · 3.5 ใส่ชุด · 3.11 ศัลยกรรม · ขายชุดซ้ำ) ===== */
export const charActionCloud=callable(async req=>{
 const input=req.data?.input||{},type=String(input.type||'');if(!['status','roll','wear','sell','surgery'].includes(type))refuse('รายการไม่ถูกต้อง','invalid-argument');
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input,system:'char',partIds:['inventory','wallet','animals-char'],worldIds:[],readOnly:type==='status',apply:async(game,worlds,ctx,tx)=>{
  const out=charAction(game,ctx,input,()=>randomInt(4294967296)/4294967296);
  const writes={};if(out.rolled||out.surgery){writes['players/'+ctx.uid+'/public/char']={tribe:game.sub.char.tribe,wear:game.sub.char.wear,at:ctx.now};}
  if(type==='wear'){writes['players/'+ctx.uid+'/public/char']={tribe:game.sub.char.tribe,wear:game.sub.char.wear,at:ctx.now};}
  return {writes,response:{...out,serverNow:ctx.now}};}});});
/* ศูนย์แอดมิน "ตัวละครผู้เล่น" (3.10): นับคนสุ่มแล้ว/ยังไม่สุ่ม · ต่อตัวละคร · รายชื่อยังไม่สุ่ม · กำหนดตัวละครรายคน */
export const charAdminCloud=callable(async req=>{
 const uid=req.auth.uid;if(!(await db.doc('admins/'+uid).get()).exists)refuse('เฉพาะแอดมิน','permission-denied');
 const input=req.data?.input||{},type=String(input.type||'');
 if(type==='stats'){const ps=await db.collection('players').where('approval','==','approved').limit(500).get();const rows=[];const admins=new Set((await db.collection('admins').get()).docs.map(d=>d.id));/* แอดมินเป็นชมพูอัตโนมัติ ไม่นับในรายชื่อ */
  for(let i=0;i<ps.docs.length;i+=50){const chunk=ps.docs.slice(i,i+50).filter(d=>!admins.has(d.id));const saves=await Promise.all(chunk.map(d=>db.doc('players/'+d.id+'/saves/animals-char').get()));
   chunk.forEach((d,k)=>{let c=null;try{const sv=saves[k];if(sv.exists){const pl=sv.data().payload;c=typeof pl==='string'?JSON.parse(pl):pl;}}catch(e){}rows.push({uid:d.id,name:String(d.data().name||'ผู้เล่น').slice(0,40),tribe:c&&TRIBES[c.tribe]?c.tribe:null,wear:c?c.wear||null:null,by:c?c.by||null:null});});}
  const per=Object.fromEntries(TRIBE_IDS.map(t=>[t,rows.filter(r=>r.tribe===t).length]));
  return {total:rows.length,rolled:rows.filter(r=>r.tribe).length,per,notRolled:rows.filter(r=>!r.tribe).map(r=>({uid:r.uid,name:r.name})),rows};}
 if(type==='set'){const to=String(input.uid||''),tribe=String(input.tribe||'');if(!/^[-a-zA-Z0-9_]{1,128}$/.test(to))refuse('ไม่พบผู้เล่น');if(!TRIBES[tribe])refuse('ไม่มีตัวละครนี้');
  /* เขียนเฉพาะส่วนตัวละคร (ส่วนเซฟของเขา) + ส่งชุดเริ่มต้นทางไปรษณีย์ · ชุดตัวละครเดิมคืนเงินตอนเขาเรียกระบบครั้งถัดไป (cleanup) */
  const ref=db.doc('players/'+to+'/saves/animals-char'),now=Date.now();
  await db.runTransaction(async tx=>{const sv=await tx.get(ref);let c={};try{if(sv.exists){const pl=sv.data().payload;c=typeof pl==='string'?JSON.parse(pl):(pl||{});}}catch(e){c={};}
   const next={tribe,wear:TRIBES[tribe].start,rolledAt:c.rolledAt||now,by:'admin',adminAt:now,cleanup:c.tribe&&c.tribe!==tribe?c.tribe:null};
   tx.set(ref,{path:['sub','char'],system:'char',payload:JSON.stringify(next),rev:(sv.exists&&sv.data().rev||0)+1,by:'admin'},{merge:true});
   tx.set(db.doc('players/'+to+'/public/char'),{tribe,wear:next.wear,at:now,by:'admin'});
   tx.set(db.doc('mail/'+to+'/items/char-start-'+now),{title:'👗 ชุดเริ่มต้น '+TRIBES[tribe].n,msg:'ยัยหนูกำหนดตัวละครให้แล้ว · รับชุดเริ่มต้นเข้าตู้เสื้อผ้า',icon:'👗',kusal:0,coins:0,items:{['outfit-'+TRIBES[tribe].start]:1},createdAt:FieldValue.serverTimestamp(),from:'ยัยหนู'});tx.set(db.doc('players/'+to),{mailCount:FieldValue.increment(1)},{merge:true});});
  return {set:tribe};}
 refuse('รายการไม่ถูกต้อง','invalid-argument');});
export const atmActionCloud=callable(async req=>{
 const input=req.data?.input||{},type=input.type,uid=req.auth.uid,isAdmin=(await db.doc('admins/'+uid).get()).exists;
 if(type&&type.startsWith('admin-')){
  if(!isAdmin)refuse('เฉพาะแอดมิน','permission-denied');
  if(type==='admin-list'){const [rows,w]=await Promise.all([db.collection('atmLog').orderBy('at','desc').limit(300).get(),db.doc('world/atm').get()]);return {open:w.exists?w.data().open!==false:true,rows:rows.docs.map(d=>d.data())};}
  if(type==='admin-open'){await db.doc('world/atm').set({open:input.open===true,at:Date.now()},{merge:true});return {open:input.open===true};}
  if(type==='admin-reset'){const to=String(input.uid||'');if(!/^[-a-zA-Z0-9_]{1,128}$/.test(to))refuse('ไม่พบผู้เล่น');await db.doc('privateAtm/'+to).set({pin:null,salt:null,fails:0,lockUntil:0},{merge:true});return {reset:true};}
  /* S4 เริ่มศูนย์: ล้าง PIN/ประวัติ/ยอดนับของทุกคน (ทุกคนตั้ง PIN ใหม่กับบัตร S4) */
  if(type==='admin-reset-all'){const all=await db.collection('privateAtm').get();let n=0;for(let i=0;i<all.docs.length;i+=400){const b=db.batch();for(const d of all.docs.slice(i,i+400)){b.delete(d.ref);n++;}await b.commit();}return {reset:n};}
  refuse('รายการไม่ถูกต้อง','invalid-argument');}
 if(!['status','pin','transfer','fx'].includes(type))refuse('รายการไม่ถูกต้อง','invalid-argument');
 const bank=bankOk(input.bank)?input.bank:'lotus';
 return core.action({uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input,system:'atm',partIds:['inventory','wallet'],worldIds:['world/atm'],readOnly:type==='status',apply:async(game,worlds,ctx,tx)=>{
  const now=ctx.now,open=worlds['world/atm']?.open!==false,pref=db.doc('privateAtm/'+uid),ps=await tx.get(pref),priv=ps.exists?structuredClone(ps.data()):{};
  if(type==='status')return {response:{atm:atmView(game,priv,open,now,ctx.coins,bank),serverNow:now}};
  if(ctx.admin)refuse('บัญชีแอดมินไม่ใช้ตู้ ATM');
  if(!open)refuse('🏧 ตู้ ATM ปิดอยู่ชั่วคราว');
  if(!atmHasCard(game,bank))refuse('ต้องมี 💳 '+BANKS[bank].cardName+' ถึงจะใช้ตู้'+BANKS[bank].n+'ได้ (รับได้จากยัยหนูเท่านั้น)');
  const writes={},updates={};
  if(type==='pin'){if(priv.pin)refuse('ตั้งรหัส PIN ไปแล้ว');if(!atmPinOk(input.pin))refuse('PIN ต้องเป็นตัวเลข 4 หลัก');
   priv.salt=randomUUID();priv.pin=atmHash(priv.salt+':'+input.pin);priv.fails=0;priv.lockUntil=0;writes[pref.path]=priv;
   return {writes,response:{atm:atmView(game,priv,open,now,ctx.coins,bank),serverNow:now}};}
  /* fix19 💱 แลกเงิน: เหรียญกระทงทอง + กระทงทอง → กุศลเข้าไปรษณีย์ (พร้อมใบเสร็จ) · เรทตามธนาคาร */
  if(type==='fx'){const n=Number(input.n),rate=fxRateCents(now,bank);
   if(Number(input.rate)!==rate)return {response:{rateChanged:true,rate,atm:atmView(game,priv,open,now,ctx.coins,bank),serverNow:now}};
   game.bag ||= {};game.bag.halloween ||= {};fxCheck(n,ctx.coins,game.bag.halloween.cauldron,priv,now);
   if(!atmCheckPin(priv,input.pin,now,atmHash)){writes[pref.path]=priv;return {writes,response:{pinWrong:true,atm:atmView(game,priv,open,now,ctx.coins,bank),serverNow:now}};}
   const amount=fxPay(n,now,bank);game.bag.halloween.cauldron=(Number(game.bag.halloween.cauldron)||0)-n;fxRecord(priv,now);
   const id='FX-'+atmDay(now).replace(/-/g,'').slice(2)+'-'+randomUUID().slice(0,6).toUpperCase(),fn=String(ctx.name||'ผู้เล่น').slice(0,40);
   const receipt={id,kind:'fx',bank,at:now,from:uid,fn,n,rate,amount};atmPushHist(priv,{...receipt,dir:'fx'});
   const hit=atmUse(priv,bank);writes[pref.path]=priv;
   const when=new Date(now+7*3600000).toISOString().slice(0,16).replace('T',' '),r2=(rate/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
   writes['mail/'+uid+'/items/fx-'+id]={title:'💱 แลกเงินที่'+BANKS[bank].n,msg:'🧾 ใบเสร็จ '+id+' · '+when+' · เหรียญกระทงทอง '+n.toLocaleString('en-US')+' + กระทงทอง '+n.toLocaleString('en-US')+' × เรท '+r2+' = '+amount.toLocaleString('en-US')+' กุศล',icon:'💱',kusal:amount,coins:0,items:{},receipt,createdAt:FieldValue.serverTimestamp(),from:'ATM'};
   let md=1;if(hit){atmBonusMail(writes,uid,bank,atmUses(priv,bank),now);md++;}
   writes['atmLog/'+id]={...receipt,day:atmDay(now)};
   return {writes,coins:ctx.coins-n,mailDelta:md,response:{receipt,bonus:hit?ATM_BONUS:0,atm:atmView(game,priv,open,now,ctx.coins-n,bank),serverNow:now}};}
  /* transfer */
  const to=String(input.to||''),amount=Number(input.amount);
  if(!/^[-a-zA-Z0-9_]{1,128}$/.test(to)||to===uid)refuse('เลือกผู้รับให้ถูกต้อง');
  const [tdoc,tadmin,tps]=await Promise.all([tx.get(db.doc('players/'+to)),tx.get(db.doc('admins/'+to)),tx.get(db.doc('privateAtm/'+to))]);
  if(!tdoc.exists||tadmin.exists||(tdoc.data().approval&&tdoc.data().approval!=='approved'))refuse('โอนให้ผู้เล่นคนนี้ไม่ได้');
  const why=atmCanSend(priv,to,now);if(why)refuse(why);
  const {fee,total,rate}=atmCheckAmount(amount,game.merit,bank,now);
  if(!atmCheckPin(priv,input.pin,now,atmHash)){writes[pref.path]=priv;return {writes,response:{pinWrong:true,atm:atmView(game,priv,open,now,ctx.coins,bank),serverNow:now}};}
  game.merit=(game.merit||0)-total;atmRecord(priv,now,to);
  const id='ATM-'+atmDay(now).replace(/-/g,'').slice(2)+'-'+randomUUID().slice(0,6).toUpperCase(),fn=String(ctx.name||'ผู้เล่น').slice(0,40),tn=String(tdoc.data().name||'ผู้เล่น').slice(0,40);
  const receipt={id,bank,at:now,from:uid,fn,to,tn,amount,fee,rate,total};
  atmPushHist(priv,{...receipt,dir:'out'});const hit=atmUse(priv,bank);writes[pref.path]=priv;
  const tpriv=tps.exists?structuredClone(tps.data()):{};atmPushHist(tpriv,{...receipt,dir:'in'});writes['privateAtm/'+to]=tpriv;
  const when=new Date(now+7*3600000).toISOString().slice(0,16).replace('T',' ');
  writes['mail/'+to+'/items/atm-'+id]={title:'🏧 โอนกุศลจาก '+fn,msg:'🧾 ใบเสร็จ '+id+' · '+when+' · '+BANKS[bank].n+' · จาก '+fn+' ถึง '+tn+' · ยอดโอน '+amount.toLocaleString('en-US')+' กุศล',icon:'🏧',kusal:amount,coins:0,items:{},receipt,createdAt:FieldValue.serverTimestamp(),from:'ATM'};
  updates['players/'+to]={mailCount:FieldValue.increment(1)};
  if(hit)atmBonusMail(writes,uid,bank,atmUses(priv,bank),now);
  writes['atmLog/'+id]={...receipt,day:atmDay(now)};
  return {writes,updates,...(hit?{mailDelta:1}:{}),response:{receipt,bonus:hit?ATM_BONUS:0,atm:atmView(game,priv,open,now,ctx.coins,bank),serverNow:now}};
 }});
});


/* ---------- S4 นครยัยหนู (บรีฟ §4–7) ----------
   ความลับต่อบัญชี (ของรักลับ · ของที่อยากได้ · เหตุการณ์) คิดจาก sha256(CITY_SECRET+…) ที่นี่เท่านั้น ไม่ส่งไปหน้าเกม
   world/city = เปิด/ปิด เกณฑ์เข้า เดตที่กำลังเกิด คิวงานแต่ง · cityPresence/{uid} = ตำแหน่งในนคร (ส่งเฉพาะตอนกดเดิน) · world/pageant = การประกวด · cityQuestions/{id} = ธนาคารคำถาม */
const CITY_SECRET='yainoo-city-9f3c1b7e-2026';const cityHash=s=>parseInt(createHash('sha256').update(CITY_SECRET+'|'+s).digest('hex').slice(0,12),16)/0xffffffffffff;
const CITY_PARTS=['inventory','wallet','animals-city','animals-char'];
async function cityRaw(uid,input){const type=String(input?.type||'');
 /* ตำแหน่ง: เขียนเอกสารเดียวต่อคน ไม่ผ่านประตูลำดับ ไม่แตะเซฟ · หมดอายุ 6 นาที (ไม่แตะจอ 5 นาทีหน้าเกมเด้งกลับเอง) */
 if(type==='move'){const n=v=>Math.max(-60,Math.min(60,Number(v)||0));const [root,pub]=await Promise.all([db.doc('players/'+uid).get(),db.doc('players/'+uid+'/public/char').get()]);if(!root.exists)refuse('ไม่พบผู้เล่น');
  const pc=pub.exists?pub.data():{};await db.doc('cityPresence/'+uid).set({uid,name:String(root.data().name||'ผู้เล่น').slice(0,40),o:pc.wear||'punk',tribe:pc.tribe||'pink',x:n(input.x),z:n(input.z),tx:n(input.tx),tz:n(input.tz),at:Date.now(),exp:Date.now()+6*60000,v:input.v?1:0},{merge:true});return {ok:true};}
 if(type==='bye'){await db.doc('cityPresence/'+uid).delete().catch(()=>{});return {ok:true};}
 if(type==='men'){/* สถานะผู้ชายตอนนี้ (public) */const w=await db.doc('world/city').get();const W=w.exists?w.data():{};const now=Date.now();return {now,men:Object.fromEntries(Object.keys(MAN).map(m=>[m,manState(m,now,W).st]))};}
 refuse('รายการไม่ถูกต้อง','invalid-argument');}
export const cityActionCloud=callable(async req=>{
 if(req.data?.raw===true)return cityRaw(req.auth.uid,req.data?.input||{});
 const input=req.data?.input||{},type=String(input.type||'');if(!['status','sync','enter','leave','talk','gift','date','propose','divorce','husband','talkHusband','houseUp','kid','claimReward'].includes(type))refuse('รายการไม่ถูกต้อง','invalid-argument');
 if(type==='enter'){/* รองรับ 50 คนพร้อมกัน (นับก่อนทำรายการ) */const live=await db.collection('cityPresence').where('exp','>',Date.now()).get();if(live.size>=MAX_IN_CITY&&!live.docs.some(d=>d.id===req.auth.uid)&&!(await db.doc('admins/'+req.auth.uid).get()).exists)refuse('นครเต็ม ('+MAX_IN_CITY+' คน) ลองใหม่อีกสักครู่','resource-exhausted');}
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input,system:'city',partIds:CITY_PARTS,worldIds:['world/city'],readOnly:type==='status',apply:async(game,worlds,ctx,tx)=>{
  ctx.h=cityHash;const W0=worlds['world/city']||{};
  const out=cityAction(game,W0,ctx,input,()=>randomInt(4294967296)/4294967296);
  const writes={},updates={};let mailDelta=0;if(out.worldWrite)writes['world/city']=out.worldDoc;
  for(const m of out.mails||[]){writes['mail/'+ctx.uid+'/items/city-'+m.key]={title:m.title,msg:m.msg,icon:'🏙️',kusal:m.kusal||0,coins:0,items:m.items||{},createdAt:FieldValue.serverTimestamp(),from:'นครยัยหนู'};mailDelta++;}
  if(type==='leave')writes['cityPresence/'+ctx.uid]=null;
  const {mails,worldDoc,worldWrite,...resp}=out;return {writes,updates,mailDelta,response:{...resp,serverNow:ctx.now}};}});});
export const cityAdminCloud=callable(async req=>{const uid=req.auth.uid;if(!(await db.doc('admins/'+uid).get()).exists)refuse('เฉพาะแอดมิน','permission-denied');const input=req.data?.input||{},type=String(input.type||'');const now=Date.now();
 if(type==='status'){const [w,pres]=await Promise.all([db.doc('world/city').get(),db.collection('cityPresence').where('exp','>',now).get()]);const W=w.exists?w.data():{};return {world:publicWorld(W,now),inside:pres.docs.map(d=>({uid:d.id,name:d.data().name,o:d.data().o,at:d.data().at}))};}
 if(type==='kickAll'){/* ปิดนคร: ทุกคนเด้งกลับฟาร์ม (หน้าเกมดูธง closedAt) */const W=cityAdmin((await db.doc('world/city').get()).data()||{},{now},{type:'close'});await db.doc('world/city').set(W);const pres=await db.collection('cityPresence').get();await Promise.all(pres.docs.map(d=>d.ref.delete()));return {world:publicWorld(W,now)};}
 if(['open','close','settings','announce'].includes(type)){return db.runTransaction(async tx=>{const ref=db.doc('world/city');const snap=await tx.get(ref);const W=cityAdmin(snap.exists?snap.data():{},{now,uid},input);tx.set(ref,W);return {world:publicWorld(W,now)};});}
 if(type==='kick'){const to=String(input.uid||'');if(!/^[-a-zA-Z0-9_]{1,128}$/.test(to))refuse('ไม่พบผู้เล่น');await db.doc('cityPresence/'+to).delete().catch(()=>{});return {ok:true};}
 refuse('รายการไม่ถูกต้อง','invalid-argument');});
/* ประกวดนางนพมาศ: ผู้ประกวดส่งคำตอบ/โชว์ผ่านประตูลำดับ (กันกดซ้ำ) · การจ่ายของ/พวงมาลัยแตะเซฟ */
export const pageantActionCloud=callable(async req=>{
 if(req.data?.raw===true){/* ดูสถานะ (ไม่แตะเซฟ) */const [p,a]=await Promise.all([db.doc('world/pageant').get(),db.doc('admins/'+req.auth.uid).get()]);return {view:pageantView(p.exists?p.data():{state:'idle'},{uid:req.auth.uid,admin:a.exists,now:Date.now()}),now:Date.now()};}
 const input=req.data?.input||{},type=String(input.type||'');if(!['podium','leave','pay','talent','answer','garland'].includes(type))refuse('รายการไม่ถูกต้อง','invalid-argument');
 return core.action({uid:req.auth.uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input,system:'pageant',partIds:['inventory','wallet','animals-char'],worldIds:['world/pageant'],apply:async(game,worlds,ctx,tx)=>{
  const P0=worlds['world/pageant']||{state:'idle'};let P,extra={};
  if(type==='garland'){P=garland(P0,game,ctx,String(input.to||''));}else{const r=pageantAction(P0,game,ctx,input);P=r.P;const {P:_,...rest}=r;extra=rest;}
  return {writes:{'world/pageant':P},response:{...extra,view:pageantView(P,ctx),serverNow:ctx.now}};}});});
export const pageantAdminCloud=callable(async req=>{const uid=req.auth.uid;if(!(await db.doc('admins/'+uid).get()).exists)refuse('เฉพาะแอดมิน','permission-denied');const input=req.data?.input||{},type=String(input.type||'');const now=Date.now();const ctx={uid,admin:true,now,name:'ยัยหนู'};
 if(type==='qAdd'){const d=questionDoc(input,ctx);const id=randomUUID().replace(/-/g,'').slice(0,20);await db.doc('cityQuestions/'+id).set(d);return {id};}
 if(type==='qDel'){const id=String(input.id||'');if(!/^[A-Za-z0-9]{1,40}$/.test(id))refuse('ไม่พบคำถาม');await db.doc('cityQuestions/'+id).delete();return {ok:true};}
 if(type==='qDedupe'){/* ส่วน ⑥: ลบคำถามซ้ำ (ข้อความเดียวกัน เก็บข้อแรก) */const qs=await db.collection('cityQuestions').limit(1000).get();const seen=new Set();let n=0;for(const d of qs.docs){const k=String(d.data().q||'').trim();if(seen.has(k)){await d.ref.delete();n++;}else seen.add(k);}return {removed:n,left:qs.size-n};}
 if(type==='qSeed'){/* นำเข้าคำถามตั้งต้น (ข้ามข้อที่มีแล้ว ตามข้อความคำถาม · เทียบแบบตัดช่องว่าง กันนำเข้าซ้ำ) */const have=new Set((await db.collection('cityQuestions').limit(1000).get()).docs.map(d=>String(d.data().q||'').trim()));let n=0;for(const [list,kind] of [[YAINOO_QUESTIONS,'yainoo'],[GENERAL_QUESTIONS,'general']])for(const [q,a,correct] of list){if(have.has(String(q).trim()))continue;have.add(String(q).trim());const d=questionDoc({q,a,correct,kind},ctx);await db.doc('cityQuestions/'+randomUUID().replace(/-/g,'').slice(0,20)).set(d);n++;}return {added:n};}
 if(type==='qList'){const qs=await db.collection('cityQuestions').limit(500).get();return {questions:qs.docs.map(d=>({id:d.id,...d.data()}))};}
 const bank=['ask','askRandom'].includes(type)?(await db.collection('cityQuestions').limit(500).get()).docs.map(d=>({id:d.id,...d.data()})):[];
 return db.runTransaction(async tx=>{const ref=db.doc('world/pageant'),cref=db.doc('world/city');const [snap,c]=await Promise.all([tx.get(ref),tx.get(cref)]);const P=pageantAdmin(snap.exists?snap.data():{state:'idle'},ctx,input,()=>randomInt(4294967296)/4294967296,bank);tx.set(ref,P);
  /* วันประกวด: เข้านครฟรี (ตั้งเวลา=เปิด · ยกเลิก/จบ=ปิด) */if(type==='schedule'||type==='cancel'||(type==='next'&&P.state==='idle')){const W=c.exists?c.data():{};W.pageantDay=type==='schedule';W.pageantAt=type==='schedule'?P.startAt:0;tx.set(cref,W);}
  return {view:pageantView(P,ctx)};});});
/* ---------- fix19 🌳🏮 ศึกโคมลอย (7 เนเบอร์ฮูดแข่งกัน วันละ 2 รอบ) ----------
   world/treeWar = สถานะสาธารณะ {on,from,stopAfter,th,mul,round,last,bat,surprise,shields} · world/tw-{nb} = แต้มบ้าน (เขียนจาก cloud-core)
   privateWorld/twPick = การ์ดคว่ำ (เซิร์ฟเวอร์เท่านั้น) · privateWorld/twBat = กุศลค้างคาวของแต่ละคน · privateWorld/twAxes = ขวานที่ถืออยู่
   players/{uid}/gameViews/treeWar = เด้งการ์ดเฉพาะตัว (แผ่นป้ายกุศล / การ์ดแกล้ง / การ์ดเซอร์ไพรส์) */
const TW_STATE='world/treeWar',TW_PICK='privateWorld/twPick',TW_BATDOC='privateWorld/twBat',TW_AXESDOC='privateWorld/twAxes',TW_DAY=864e5;
const twRand=()=>randomInt(4294967296)/4294967296,twUid=u=>typeof u==='string'&&/^[-a-zA-Z0-9_]{1,128}$/.test(u);
const twMoney=n=>Number(n).toLocaleString('en-US');
function twMailTo(tx,to,key,title,msg,{kusal=0,coins=0,items={}}={}){tx.set(db.doc('mail/'+to+'/items/tw-'+key),{title,msg,icon:'🌳',kusal,coins,items,createdAt:FieldValue.serverTimestamp(),from:'ศึกโคมลอย'});tx.set(db.doc('players/'+to),{mailCount:FieldValue.increment(1)},{merge:true});}
function twLedger(tx,to,key,row){const at=Date.now();tx.set(db.doc('players/'+to+'/ledger/tw-'+key),{...row,createdAt:at});tx.set(db.doc('players/'+to),{ledgerPending:true},{merge:true});
 tx.set(db.doc('players/'+to+'/gameViews/treeWar'),{hit:{at,key},updatedAt:at},{merge:true});/* หน้าเว็บของคนที่ออนไลน์อยู่จะเรียก ledger ให้ทันที */}
/* เขียนทับทุกช่องของการ์ดแต่ละชนิด (merge ซ้อนชั้นของ Firestore จะเก็บค่าเก่าอย่าง done:true ไว้ถ้าไม่เขียนทับ) */
const TW_GV0={round:null,bat:null,openAt:null,until:null,nb:null,done:false,v:null,auto:false,card:null,keep:null};
const twGv=(tx,to,data)=>tx.set(db.doc('players/'+to+'/gameViews/treeWar'),{...Object.fromEntries(Object.entries(data).map(([k,v])=>[k,{...TW_GV0,...v}])),updatedAt:Date.now()},{merge:true});
const twHouses=st=>Object.keys(st?.round?.houses||st?.last?.houses||{});
async function twBuildRound(cur,now){
 const snap=await db.collection('neighborhoods').where('status','==','active').get();
 const list=snap.docs.map(d=>({id:d.id,...d.data()})).filter(n=>n.status==='active'&&/^[A-Za-z0-9_-]{1,64}$/.test(n.id)).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0)).slice(0,TW_TREES);
 const trees=twShuffle([0,1,2,3,4,5,6],twRand),houses={},names={};
 list.forEach((n,i)=>{const m=(n.members||[]).filter(twUid);houses[n.id]={n:String(n.name||'บ้าน').slice(0,40),em:String(n.emblem||'pumpkin'),tree:trees[i],slot:i,m};for(const u of m)names[u]=String(n.names?.[u]||'ผู้เล่น').slice(0,40);});
 return {id:cur.id,start:cur.start,end:cur.end,houses,names,at:now};}
async function twStartRound(cur,now){const round=await twBuildRound(cur,now);
 if(Object.keys(round.houses).length<2)return false;/* บ้านเปิดใช้ไม่ถึง 2 บ้าน ไม่เริ่ม */
 return db.runTransaction(async tx=>{const s=await tx.get(db.doc(TW_STATE)),st=s.exists?s.data():{};if(!st.on||cur.start<(st.from||0)||st.round||st.last?.id===cur.id&&!st.last?.cancelled)return false;
  tx.set(db.doc(TW_STATE),{...st,round,shields:{},bat:null,surprise:null,at:now});
  for(const nb of Object.keys(round.houses))tx.set(db.doc('world/tw-'+nb),{round:round.id,pts:{},n:{},cut:0,peak:0,at:0,chops:[]});
  tx.set(db.doc(TW_AXESDOC),{round:round.id,a:{}});return true;});}
async function twFinish(now){return db.runTransaction(async tx=>{const s=await tx.get(db.doc(TW_STATE)),st=s.exists?s.data():null;const rd=st?.round;if(!rd||now<rd.end)return false;
 const nbs=Object.keys(rd.houses),hs=await Promise.all(nbs.map(nb=>tx.get(db.doc('world/tw-'+nb))));
 const rows=nbs.map((nb,i)=>{const h=hs[i].exists&&hs[i].data().round===rd.id?hs[i].data():{};return {nb,n:rd.houses[nb].n,em:rd.houses[nb].em,tree:rd.houses[nb].tree,score:twHouseScore(h),peak:h.peak||0,at:h.at||0};});
 const pk0=await tx.get(db.doc(TW_PICK)),keepSurprise=pk0.exists?pk0.data().surprise||null:null;
 const ranks=twRank(rows),top=ranks[0],winner=top&&top.score>0?top.nb:null,openAt=Math.max(rd.end+TW_PICK_OPEN,now),until=openAt+TW_PICK_TIME;/* ตัวจับเวลามาช้า = ยังได้เลือกครบ 10 นาที */
 const last={id:rd.id,start:rd.start,end:rd.end,ranks,winner,openAt,until,houses:rd.houses,names:rd.names,shields:st.shields||{},done:!winner,prank:null};
 const pick={round:rd.id,decks:{},picked:{},prank:null,...(keepSurprise&&!keepSurprise.done?{surprise:keepSurprise}:{})};
 if(winner){const mem=rd.houses[winner].m||[];for(const u of mem){pick.decks[u]=twShuffle(TW_MERIT,twRand);twGv(tx,u,{merit:{round:rd.id,openAt,until,nb:winner}});}
  if(mem.length){const pu=mem[Math.floor(twRand()*mem.length)];pick.prank={uid:pu,deck:twShuffle(TW_PRANKS,twRand),flipped:null,card:null};last.prank={nb:winner,card:null,targets:null,done:false};twGv(tx,pu,{prank:{round:rd.id,openAt,until}});}}
 tx.set(db.doc(TW_PICK),pick);
 const next={...st,round:null,last,shields:{},at:now};if(st.stopAfter){next.on=false;next.stopAfter=false;}
 tx.set(db.doc(TW_STATE),next);return true;});}
/* ใช้การ์ดแกล้ง (ภายในธุรกรรม) · คนโดนรู้แค่ชื่อบ้าน · โล่ของบ้านที่โดน = ครึ่งเดียว */
async function twAlive(tx,last){const all=[...new Set(Object.values(last.houses||{}).flatMap(h=>h.m||[]))],snaps=await Promise.all(all.map(u=>tx.get(db.doc('players/'+u))));return new Set(all.filter((u,i)=>snaps[i].exists));}
function twExecPrank(tx,last,card,targets,now,alive){const ok=u=>!alive||alive.has(u);const win=last.houses[last.winner],from='“ทีม'+win.n+' กิจกรรมลอยกระทง ร่วมใจ” ได้ทำการ ',key=last.id,half=nb=>last.shields?.[nb]?.5:1,sh=nb=>last.shields?.[nb]?' (🛡️ โล่ช่วยลดให้ครึ่งหนึ่ง)':'';
 const losers=Object.keys(last.houses).filter(nb=>nb!==last.winner),nbOf=u=>losers.find(nb=>(last.houses[nb].m||[]).includes(u));let hit=0;
 if(card==='rob')for(const nb of targets)for(const u of (last.houses[nb]?.m||[]).filter(ok)){const need=Math.max(1,Math.round((TW_ROB[0]+Math.floor(twRand()*(TW_ROB[1]-TW_ROB[0]+1)))*half(nb)));
   twLedger(tx,u,key+'-rob',{merit:0,rob:need,until:now+3*TW_DAY,tw:'rob',title:'🧺 โดนปล้นเสบียง!',msg:from+'ปล้นเสบียงในกระเป๋าของคุณทำให้ เกิดการเปลี่ยนแปลงดังต่อไปนี้'+sh(nb)});hit++;}
 const cut=(u,nb,amt,what)=>{if(!ok(u))return;const m=Math.round(amt*half(nb));twLedger(tx,u,key+'-cut',{merit:-m,tw:'cut',title:'🪓 โดนตัดกุศล!',msg:from+what+' ทำให้ เกิดการเปลี่ยนแปลงดังต่อไปนี้ −'+twMoney(m)+' กุศล'+sh(nb)});hit++;};
 if(card==='cut1')for(const nb of targets)for(const u of last.houses[nb]?.m||[])cut(u,nb,TW_CUT.cut1,'ตัดกุศลบ้านของคุณ');
 if(card==='cutAll')for(const nb of losers)for(const u of last.houses[nb]?.m||[])cut(u,nb,TW_CUT.cutAll,'ตัดกุศลทุกบ้านที่แพ้');
 if(card==='cut4')for(const u of targets){const nb=nbOf(u);if(nb)cut(u,nb,TW_CUT.cut4,'เลือกตัดกุศลของคุณ');}
 return hit;}
function twPrankChoices(last,card){const losers=Object.keys(last.houses).filter(nb=>nb!==last.winner);
 if(card==='cut4')return losers.flatMap(nb=>(last.houses[nb].m||[]).map(u=>({id:u,nb,n:last.names?.[u]||'ผู้เล่น',h:last.houses[nb].n,em:last.houses[nb].em})));
 if(card==='rob'||card==='cut1')return losers.map(nb=>({id:nb,n:last.houses[nb].n,em:last.houses[nb].em,nb}));return [];}
const twNeed=card=>card==='rob'?TW_ROB_HOUSES:card==='cut1'?1:card==='cut4'?TW_CUT4:0;
function twCheckTargets(last,card,targets){const ch=twPrankChoices(last,card).map(c=>c.id),need=Math.min(twNeed(card),ch.length);
 if(!need)return [];if(!Array.isArray(targets))refuse('เลือกเป้าหมายก่อน');const t=[...new Set(targets.map(String))];if(t.length!==need||t.some(x=>!ch.includes(x)))refuse('เลือกเป้าหมายให้ครบ '+need+(card==='cut4'?' คน':' บ้าน'));return t;}
function twAutoTargets(last,card){const ch=twPrankChoices(last,card).map(c=>c.id);return twShuffle(ch,twRand).slice(0,Math.min(twNeed(card),ch.length));}
async function twResolve(now){return db.runTransaction(async tx=>{const [s,p]=await Promise.all([tx.get(db.doc(TW_STATE)),tx.get(db.doc(TW_PICK))]);const st=s.exists?s.data():null,last=st?.last,pick=p.exists?p.data():null;
 if(!last||last.done||now<last.until)return false;const alive=await twAlive(tx,last);
 if(pick&&pick.round===last.id){const low=Math.min(...TW_MERIT);
  for(const u of Object.keys(pick.decks||{}).filter(u=>alive.has(u)))if(!pick.picked?.[u]){pick.picked ||= {};pick.picked[u]={i:-1,v:low,auto:true};twMailTo(tx,u,last.id+'-merit','🏆 แผ่นป้ายกุศล ศึกโคมลอย','บ้านคุณชนะรอบนี้! ไม่ได้เลือกการ์ดภายในเวลา ระบบให้ใบที่น้อยที่สุด',{kusal:low});twGv(tx,u,{merit:{round:last.id,done:true,v:low,auto:true}});}
  const pr=pick.prank;if(pr&&!pr.done){if(pr.card==null){pr.flipped=Math.floor(twRand()*pr.deck.length);pr.card=pr.deck[pr.flipped];}
   const targets=twAutoTargets(last,pr.card);twExecPrank(tx,last,pr.card,targets,now,alive);pr.done=true;pr.auto=true;pr.targets=targets;
   last.prank={...(last.prank||{}),card:pr.card,targets:pr.card==='cut4'?targets.length:targets.map(nb=>last.houses[nb]?.n||''),done:true,auto:true};twGv(tx,pr.uid,{prank:{round:last.id,done:true,card:pr.card,auto:true}});}
  tx.set(db.doc(TW_PICK),pick);}
 tx.set(db.doc(TW_STATE),{...st,last:{...last,done:true},at:now});return true;});}
async function twSettleBat(now){return db.runTransaction(async tx=>{const [s,b]=await Promise.all([tx.get(db.doc(TW_STATE)),tx.get(db.doc(TW_BATDOC))]);const st=s.exists?s.data():null,bat=st?.bat;
 if(!bat||bat.settled||now<bat.end+TW_BAT_SETTLE)return false;const sc=b.exists&&b.data().id===bat.id?b.data():{s:{},n:{}};
 let top=null;for(const [u,v]of Object.entries(sc.s||{}))if(v>0&&(!top||v>top[1]))top=[u,v];
 const next={...st,bat:{...bat,settled:true,top:top?{n:sc.n?.[top[0]]||'ผู้เล่น',v:top[1]}:null},at:now};
 if(top){const until=now+TW_PICK_TIME;next.surprise={bat:bat.id,until,done:false,n:sc.n?.[top[0]]||'ผู้เล่น'};
  const pk=await tx.get(db.doc(TW_PICK)),pick=pk.exists?pk.data():{};pick.surprise={uid:top[0],bat:bat.id,round:bat.round,deck:twShuffle(TW_SURPRISE,twRand),flipped:null,card:null,until,done:false};tx.set(db.doc(TW_PICK),pick);
  twGv(tx,top[0],{surprise:{bat:bat.id,until}});}
 tx.set(db.doc(TW_STATE),next);return true;});}
/* ใช้การ์ดเซอร์ไพรส์ (ภายในธุรกรรม) */
function twSurpriseApply(tx,su,card,keep,st,nbOfUid){const key=su.bat;
 if(card==='merit')twMailTo(tx,su.uid,key+'-sm','💰 การ์ดเซอร์ไพรส์ ศึกโคมลอย','เก็บกุศลจากหิ่งห้อยได้มากที่สุด!',{kusal:TW_SURPRISE_MERIT});
 if(card==='supply'){const s=twSupply(twRand);su.supply={name:s.name,n:s.n};twMailTo(tx,su.uid,key+'-ss','🎁 การ์ดเติมเสบียง ศึกโคมลอย','ได้ '+s.name+' ×'+twMoney(s.n),{coins:s.coins,items:s.items});}
 if(card==='shield'){const can=keep!==false&&nbOfUid&&st.round?.houses?.[nbOfUid]&&st.round.id===su.round;/* ไม่มีบ้านในศึก/รอบจบไปแล้ว = ใช้โล่ไม่ได้ → ได้กุศลแทน */
  if(can){st.shields={...(st.shields||{}),[nbOfUid]:true};su.keep=true;}
  else{twMailTo(tx,su.uid,key+'-sd','🛡️ '+(keep===false?'ทิ้งโล่ รับกุศล':'โล่ใช้ไม่ทันรอบ รับกุศลแทน')+' ศึกโคมลอย','ได้รับกุศลแทนโล่ป้องกัน',{kusal:TW_SHIELD_DROP});su.keep=false;}}
 su.done=true;}
async function twAutoSurprise(now){return db.runTransaction(async tx=>{const [s,p]=await Promise.all([tx.get(db.doc(TW_STATE)),tx.get(db.doc(TW_PICK))]);const st=s.exists?s.data():null,pick=p.exists?p.data():null;
 if(!st?.surprise||st.surprise.done||now<st.surprise.until)return false;const su=pick?.surprise;
 if(su&&su.bat===st.surprise.bat&&!su.done){const root=await tx.get(db.doc('players/'+su.uid));if(su.card==null){su.flipped=Math.floor(twRand()*su.deck.length);su.card=su.deck[su.flipped];}
  twSurpriseApply(tx,su,su.card,true,st,root.exists?root.data().nb:null);su.auto=true;tx.set(db.doc(TW_PICK),pick);twGv(tx,su.uid,{surprise:{bat:su.bat,done:true,card:su.card,auto:true}});}
 tx.set(db.doc(TW_STATE),{...st,surprise:{...st.surprise,done:true,card:su?.card||null},at:now});return true;});}
export async function twTickRun(now=Date.now()){const out=[];const get=async()=>{const s=await db.doc(TW_STATE).get();return s.exists?s.data():null;};let st=await get();if(!st)return out;
 if(st.round&&now>=st.round.end){out.push(['finish',await twFinish(now)]);st=await get();}
 if(st?.last&&!st.last.done&&now>=st.last.until){out.push(['resolve',await twResolve(now)]);st=await get();}
 if(st?.bat&&!st.bat.settled&&now>=st.bat.end+TW_BAT_SETTLE){out.push(['bat',await twSettleBat(now)]);st=await get();}
 if(st?.surprise&&!st.surprise.done&&now>=st.surprise.until){out.push(['surprise',await twAutoSurprise(now)]);st=await get();}
 if(st?.on&&!st.round){const cur=twRoundAt(now);if(cur&&cur.start>=(st.from||0)&&now<cur.end-60000&&st.last?.id!==cur.id)out.push(['start',await twStartRound(cur,now)]);}
 return out;}
export const treeWarTick=onSchedule({...options,schedule:'* * * * *',timeZone:'Asia/Bangkok',timeoutSeconds:120},async event=>twTickRun(event?.testNow||Date.now()));
const twCleanMul=m=>Object.fromEntries(TW_CATS.map(k=>{const v=Number(m?.[k]);return [k,Number.isFinite(v)&&v>=0&&v<=10?Math.round(v*100)/100:1];}));
export const treeWarActionCloud=callable(async req=>{
 const input=req.data?.input||{},type=String(input.type||''),uid=req.auth.uid,now=Date.now();
 if(type.startsWith('admin-')){
  if(!(await db.doc('admins/'+uid).get()).exists)refuse('เฉพาะแอดมิน','permission-denied');
  if(type==='admin-start'){const cur=twRoundAt(now),nowMode=input.when==='now'&&cur&&now<cur.end-10*60000;
   if(nowMode){/* สร้างรอบก่อน ตรวจจำนวนบ้าน แล้วค่อยเขียนทุกอย่างในธุรกรรมเดียว */
    const round=await twBuildRound({id:cur.id+'-'+String(now).slice(-6),start:now,end:cur.end},now);if(Object.keys(round.houses).length<2)refuse('ต้องมีเนเบอร์ฮูดที่เปิดใช้อย่างน้อย 2 บ้าน');
    return db.runTransaction(async tx=>{const s2=await tx.get(db.doc(TW_STATE)),st2=s2.exists?s2.data():{};if(st2.round)refuse('ศึกกำลังแข่งอยู่แล้ว');
     tx.set(db.doc(TW_STATE),{...st2,on:true,from:now,stopAfter:false,th:st2.th||TW_TH,mul:twCleanMul(st2.mul),round,shields:{},bat:null,surprise:null,at:now});
     for(const nb of Object.keys(round.houses))tx.set(db.doc('world/tw-'+nb),{round:round.id,pts:{},n:{},cut:0,peak:0,at:0,chops:[]});tx.set(db.doc(TW_AXESDOC),{round:round.id,a:{}});return {ok:true,started:true};});}
   const nx=cur&&now<cur.start+1?cur:twNextRound(now);
   return db.runTransaction(async tx=>{const s2=await tx.get(db.doc(TW_STATE)),st2=s2.exists?s2.data():{};if(st2.round)refuse('ศึกกำลังแข่งอยู่แล้ว');
    tx.set(db.doc(TW_STATE),{...st2,on:true,from:nx.start,stopAfter:false,th:st2.th||TW_TH,mul:twCleanMul(st2.mul),at:now});return {ok:true,from:nx.start};});}
  if(type==='admin-stop'){return db.runTransaction(async tx=>{const s=await tx.get(db.doc(TW_STATE)),st=s.exists?s.data():{};
   if(input.how==='after'){if(!st.round)refuse('ตอนนี้ไม่มีรอบที่กำลังแข่ง');tx.set(db.doc(TW_STATE),{...st,stopAfter:true,at:now});return {ok:true,after:true};}
   if(input.how==='off'){/* ยกเลิกการเปิดรอบถัดไป (ไม่แตะการ์ดที่กำลังเลือกของรอบที่จบแล้ว) */if(st.round)refuse('ศึกกำลังแข่งอยู่ ใช้ปุ่มหยุดแทน');tx.set(db.doc(TW_STATE),{...st,on:false,stopAfter:false,at:now});return {ok:true};}
   if(input.how!=='emergency')refuse('รายการไม่ถูกต้อง','invalid-argument');
   const next={...st,on:false,stopAfter:false,round:null,bat:null,surprise:st.surprise?{...st.surprise,done:true,cancelled:true}:null,at:now};
   if(st.round)next.cancelled={id:st.round.id,at:now};if(st.last&&!st.last.done)next.last={...st.last,done:true,cancelled:true};tx.set(db.doc(TW_PICK),{round:null,decks:{},picked:{}});
   tx.set(db.doc(TW_STATE),next);return {ok:true};});}
  if(type==='admin-config'){const th=Array.isArray(input.th)?input.th.map(Number):null;
   if(!th||th.length!==12||th[0]!==0||th.some((v,i)=>!Number.isSafeInteger(v)||v<0||v>10000000||(i&&v<=th[i-1])))refuse('แต้มต่อขั้นต้องเรียงจากน้อยไปมาก เริ่มที่ 0 และมี 12 ขั้น');
   return db.runTransaction(async tx=>{const s2=await tx.get(db.doc(TW_STATE)),st2=s2.exists?s2.data():{};tx.set(db.doc(TW_STATE),{...st2,th,mul:twCleanMul(input.mul),at:now});return {ok:true};});}
  if(type==='admin-bat'){const lvl=Number(input.lvl);if(!TW_BAT_LEVELS.includes(lvl))refuse('เลือกระดับ ×1 ×2 ×5');
   return db.runTransaction(async tx=>{const s=await tx.get(db.doc(TW_STATE)),st=s.exists?s.data():{};const rd=st.round;
    if(!st.on||!rd||now<rd.start||now>=rd.end)refuse('เรียกหิ่งห้อยได้เฉพาะตอนศึกกำลังแข่ง');
    if(st.bat&&!st.bat.settled)refuse('หิ่งห้อยรอบก่อนยังไม่จบ');if(st.surprise&&!st.surprise.done)refuse('รอคนเลือกการ์ดเซอร์ไพรส์ก่อน');
    const start=now+TW_BAT_WARN,end=start+TW_BAT_MS;if(end+TW_BAT_SETTLE+TW_PICK_TIME>rd.end)refuse('ใกล้จบรอบแล้ว (ต้องเหลือเกิน 15 นาที) เรียกหิ่งห้อยไม่ได้');
    const bat={id:'bat-'+now.toString(36),lvl,seed:randomInt(2147483647),start,end,round:rd.id,settled:false};
    tx.set(db.doc(TW_STATE),{...st,bat,at:now});tx.set(db.doc(TW_BATDOC),{id:bat.id,s:{},n:{}});return {ok:true,bat};});}
  refuse('รายการไม่ถูกต้อง','invalid-argument');}
 if(type==='batEnd'){
  /* อ่านแค่สถานะศึก (ไม่อ่านเอกสารรวมคะแนน/ขวาน) ทุกคนส่งพร้อมกันตอนจบได้ไม่ชนกัน · คะแนนและขวานเขียนแบบเพิ่มค่า */
  return core.action({uid,session:req.data?.session,id:req.data?.id,seq:req.data?.seq,input:{type},system:'treewar',partIds:['inventory','wallet'],worldIds:[TW_STATE],apply:async(game,worlds,ctx)=>{
   const st=worlds[TW_STATE],bat=st?.bat;
   if(!bat||bat.id!==input.bat||bat.settled||ctx.now<bat.start||ctx.now>bat.end+TW_BAT_SETTLE-3000)refuse('หิ่งห้อยรอบนี้จบไปแล้ว');
   if(ctx.x17.twb===bat.id)refuse('ส่งผลหิ่งห้อยรอบนี้ไปแล้ว');
   const sc=twBatScore(twBatLogic(bat.seed),input.hits,bat.lvl,ctx.now-bat.start+1500),m0=game.merit||0;game.merit=sc.merit<0?m0+sc.merit:m0+sc.merit;ctx.x17.twb=bat.id;
   const merges={[TW_BATDOC]:{s:{[ctx.uid]:sc.merit},n:{[ctx.uid]:String(ctx.name||'ผู้เล่น').slice(0,40)}}},axes=sc.axes;
   if(st.round?.id===bat.round&&(axes.w||axes.s||axes.g))merges[TW_AXESDOC]={a:{[ctx.uid]:Object.fromEntries(['w','s','g'].filter(k=>axes[k]).map(k=>[k,FieldValue.increment(axes[k])]))}};
   return {merges,response:{bat:{merit:sc.merit,plus:sc.plus,minus:sc.minus,n:sc.n,axes},serverNow:ctx.now}};}});}
 const rootSnap=await db.doc('players/'+uid).get();if(!rootSnap.exists)refuse('กรุณาเข้าเกมใหม่');const myNb=rootSnap.data().nb||null,myName=String(rootSnap.data().name||'ผู้เล่น').slice(0,40);
 if(type==='status'){const [s,p,a]=await Promise.all([db.doc(TW_STATE).get(),db.doc(TW_PICK).get(),db.doc(TW_AXESDOC).get()]);const st=s.exists?s.data():{},pick=p.exists?p.data():{},ax=a.exists?a.data():{};
  const last=st.last,me={nb:myNb,axes:st.round&&ax.round===st.round.id?ax.a?.[uid]||{}:{}};
  if(last&&pick.round===last.id){if(pick.decks?.[uid])me.merit={n:pick.decks[uid].length,picked:pick.picked?.[uid]||null,deck:pick.picked?.[uid]?pick.decks[uid]:null};
   if(pick.prank?.uid===uid)me.prank={flipped:pick.prank.flipped,card:pick.prank.card,done:!!pick.prank.done,deck:pick.prank.card!=null?pick.prank.deck:null,choices:pick.prank.card!=null&&!pick.prank.done?twPrankChoices(last,pick.prank.card):null,need:twNeed(pick.prank.card)};}
  if(pick.surprise?.uid===uid&&st.surprise?.bat===pick.surprise.bat)me.surprise={flipped:pick.surprise.flipped,card:pick.surprise.card,done:!!pick.surprise.done,deck:pick.surprise.card!=null?pick.surprise.deck:null,supply:pick.surprise.supply||null,until:pick.surprise.until};
  return {me,serverNow:now};}
 if(type==='merit'){const i=Number(input.i);if(!Number.isInteger(i)||i<0||i>=TW_MERIT.length)refuse('เลือกการ์ดก่อน','invalid-argument');
  return db.runTransaction(async tx=>{const [s,p]=await Promise.all([tx.get(db.doc(TW_STATE)),tx.get(db.doc(TW_PICK))]);const last=s.exists?s.data().last:null,pick=p.exists?p.data():null;
   if(!last||last.done||!pick||pick.round!==last.id||!pick.decks?.[uid])refuse('ไม่มีแผ่นป้ายกุศลให้เลือก');if(now<last.openAt)refuse('ยังไม่ถึงเวลาเปิดการ์ด');
   if(pick.picked?.[uid])return {v:pick.picked[uid].v,i:pick.picked[uid].i,deck:pick.decks[uid],again:true};
   const v=pick.decks[uid][i];pick.picked ||= {};pick.picked[uid]={i,v};tx.set(db.doc(TW_PICK),pick);
   twMailTo(tx,uid,last.id+'-merit','🏆 แผ่นป้ายกุศล ศึกโคมลอย','บ้านคุณชนะรอบนี้! เปิดได้แผ่นป้าย '+twMoney(v)+' กุศล',{kusal:v});twGv(tx,uid,{merit:{round:last.id,done:true,v}});
   return {v,i,deck:pick.decks[uid]};});}
 if(type==='prankFlip'){const i=Number(input.i);if(!Number.isInteger(i)||i<0||i>=TW_PRANKS.length)refuse('เลือกการ์ดก่อน','invalid-argument');
  return db.runTransaction(async tx=>{const [s,p]=await Promise.all([tx.get(db.doc(TW_STATE)),tx.get(db.doc(TW_PICK))]);const last=s.exists?s.data().last:null,pick=p.exists?p.data():null,pr=pick?.prank;
   if(!last||last.done||!pr||pick.round!==last.id||pr.uid!==uid||pr.done)refuse('ไม่มีการ์ดแกล้งให้เลือก');if(now<last.openAt)refuse('ยังไม่ถึงเวลาเปิดการ์ด');
   if(pr.card==null){pr.flipped=i;pr.card=pr.deck[i];tx.set(db.doc(TW_PICK),pick);}
   return {card:pr.card,i:pr.flipped,deck:pr.deck,choices:twPrankChoices(last,pr.card),need:twNeed(pr.card)};});}
 if(type==='prankGo'){
  return db.runTransaction(async tx=>{const [s,p]=await Promise.all([tx.get(db.doc(TW_STATE)),tx.get(db.doc(TW_PICK))]);const st=s.exists?s.data():null,last=st?.last,pick=p.exists?p.data():null,pr=pick?.prank;
   if(!last||last.done||!pr||pick.round!==last.id||pr.uid!==uid||pr.card==null)refuse('ไม่มีการ์ดแกล้งให้ใช้');if(pr.done)return {done:true,again:true};
   const targets=twCheckTargets(last,pr.card,input.targets);const alive=await twAlive(tx,last);const hit=twExecPrank(tx,last,pr.card,targets,now,alive);pr.done=true;pr.targets=targets;tx.set(db.doc(TW_PICK),pick);
   tx.set(db.doc(TW_STATE),{...st,last:{...last,prank:{...(last.prank||{}),card:pr.card,targets:pr.card==='cut4'?targets.length:targets.map(nb=>last.houses[nb]?.n||''),done:true}},at:now});
   twGv(tx,uid,{prank:{round:last.id,done:true,card:pr.card}});return {done:true,hit};});}
 if(type==='surprise'||type==='shield'){
  return db.runTransaction(async tx=>{const [s,p]=await Promise.all([tx.get(db.doc(TW_STATE)),tx.get(db.doc(TW_PICK))]);const st=s.exists?s.data():null,pick=p.exists?p.data():null,su=pick?.surprise;
   if(!st?.surprise||st.surprise.done||!su||su.uid!==uid||su.bat!==st.surprise.bat||su.done)refuse('ไม่มีการ์ดเซอร์ไพรส์ให้เลือก');
   if(type==='surprise'){const i=Number(input.i);if(!Number.isInteger(i)||i<0||i>=su.deck.length)refuse('เลือกการ์ดก่อน','invalid-argument');
    if(su.card!=null)return {card:su.card,i:su.flipped,deck:su.deck,supply:su.supply||null,again:true};su.flipped=i;su.card=su.deck[i];
    if(su.card!=='shield'){twSurpriseApply(tx,su,su.card,true,st,myNb);tx.set(db.doc(TW_STATE),{...st,surprise:{...st.surprise,done:true,card:su.card},at:now});twGv(tx,uid,{surprise:{bat:su.bat,done:true,card:su.card}});}
    tx.set(db.doc(TW_PICK),pick);return {card:su.card,i,deck:su.deck,supply:su.supply||null};}
   if(su.card!=='shield')refuse('ไม่มีโล่ให้เลือก');const keep=input.keep!==false;twSurpriseApply(tx,su,'shield',keep,st,myNb);tx.set(db.doc(TW_PICK),pick);
   tx.set(db.doc(TW_STATE),{...st,surprise:{...st.surprise,done:true,card:'shield'},at:now});twGv(tx,uid,{surprise:{bat:su.bat,done:true,card:'shield',keep:su.keep}});
   return {keep:su.keep,nb:su.keep?myNb:null};});}
 if(type==='axe'){const k=String(input.k||''),to=String(input.nb||'');if(!TW_AXES[k])refuse('เลือกขวานก่อน','invalid-argument');
  return db.runTransaction(async tx=>{const [s,a,h]=await Promise.all([tx.get(db.doc(TW_STATE)),tx.get(db.doc(TW_AXESDOC)),tx.get(db.doc('world/tw-'+(/^[A-Za-z0-9_-]{1,64}$/.test(to)?to:'x')))]);
   const st=s.exists?s.data():null,rd=st?.on?st.round:null,ax=a.exists?a.data():null;
   if(!rd||now<rd.start||now>=rd.end)refuse('ศึกไม่ได้แข่งอยู่ ขวานใช้ไม่ได้');if(!rd.houses?.[to])refuse('เลือกบ้านที่จะตัด');if(to===myNb)refuse('ตัดบ้านตัวเองไม่ได้');
   const mine=ax?.round===rd.id?{...(ax.a?.[uid]||{})}:{};if(!(mine[k]>0))refuse('ไม่มีขวานนี้แล้ว');
   const house=h.exists&&h.data().round===rd.id?h.data():{round:rd.id,pts:{},n:{},cut:0,peak:0,at:0,chops:[]},real=Math.min(TW_AXES[k],twHouseScore(house));
   house.cut=(house.cut||0)+real;house.chops=[...(Array.isArray(house.chops)?house.chops:[]).filter(c=>now-c.at<60000).slice(-9),{at:now,n:real,k}];mine[k]--;
   tx.set(db.doc('world/tw-'+to),house);tx.set(db.doc(TW_AXESDOC),{round:rd.id,a:{...(ax.a||{}),[uid]:mine}},{merge:true});return {ok:true,cut:real,axes:mine};});}
 refuse('รายการไม่ถูกต้อง','invalid-argument');
});
