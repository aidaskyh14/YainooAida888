/* ซีซั่น 4 · นครยัยหนู — กติกาทั้งหมดอยู่ที่นี่ที่เดียว (ใช้ทั้งหลังบ้านและเทสต์ · หน้าเกมไม่เห็นความลับ)
   เซฟ: game.sub.city = {car, visits, love:{[man]:{...}}, husband, claimed, ex, pageant}
   โลก: world/city = {open, entry:{outfits,houseLv}, free, hungry, pageantDay, dates:{[man]:{uid,until}}, closedAt}
   ความลับต่อบัญชี (ของรักลับ · ของที่อยากได้สัปดาห์นี้ · เหตุการณ์พิเศษ) คิดจาก ctx.h(str) = ค่า 0–1 จาก sha256(CITY_SECRET,…) ที่เซิร์ฟเวอร์
   ตาราง/อารมณ์ของผู้ชาย (ทุกคนเห็นเหมือนกัน) คิดจาก fnv(day,man) — โค้ดเดียวกันทั้งหน้าเกมและเซิร์ฟเวอร์ (export) */
import {MAN,MEN,BUILDING,DATES,HARD,GIFT_PTS,HEART,HEARTS,LOCK_HEARTS,MOODS,GIFT_KIND,ENTRY_DEFAULT,WED,HUSBAND,HOUSE_UP,KIDS,SEASON_DAYS,HEART_REWARDS,WED_REWARD,PAGEANT,IDLE_KICK_MIN} from './city-catalog.js';
import {CATALOG} from './catalog.js';
import {OUTFITS} from '../outfit-catalog.js';
const fail=m=>{throw new Error(m);};
import {TH,dayOf,hourOf,weekOf,fnv,manState,isRaining} from './city-time.js';export {dayOf,hourOf,weekOf,fnv,manState,isRaining};
export const seasonDay=now=>(dayOf(now)%SEASON_DAYS)+1;export const seasonOf=now=>Math.floor(dayOf(now)/SEASON_DAYS)%4;
const BY_KEY=Object.fromEntries(CATALOG.map(c=>[c.k,c]));
const GIFT_GROUPS=new Set(['ผัก','ดอกไม้','ผลไม้','หญ้า ไม้ หิน','ผลผลิตสัตว์','นก เม่น','อัลปาก้า','ไอเท็ม','อาหารบ้าน','เมนูมีคลาส','อาหารสวน','เครื่องดื่มป่า']);
export const GIFTABLE=CATALOG.filter(c=>GIFT_GROUPS.has(c.g)&&!/^(tree-|license|fuel|collar|fert)/.test(c.k)).map(c=>c.k);
const bagPath=k=>{const c=BY_KEY[k];if(!c||!c.p)return null;return c.p.split('.');};
export const bagGet=(game,k)=>{const p=bagPath(k);if(!p)return 0;const v=p.reduce((o,x)=>o?.[x],game.bag||{});return Math.max(0,Math.floor(Number(v)||0));};
export const bagAdd=(game,k,n)=>{const p=bagPath(k);if(!p)fail('ไม่มีไอเทม '+k);game.bag ||= {};let o=game.bag;for(const x of p.slice(0,-1))o=o[x] ||= {};o[p.at(-1)]=(Math.floor(Number(o[p.at(-1)])||0))+n;};
const bagTake=(game,k,n)=>{if(bagGet(game,k)<n)fail('ของไม่พอ: '+(BY_KEY[k]?.n||k));bagAdd(game,k,-n);};
export function moodOf(manId,now,jealous){if(jealous)return 'jealous';const k=['happy','hungry','tired','sad','bored'];return k[Math.floor(fnv('mood'+dayOf(now)+manId)*k.length)];}
export const isBirthday=(manId,now)=>MAN[manId]&&MAN[manId].bday===seasonDay(now);
/* เหตุการณ์พิเศษปลดล็อกหัวใจ 3/6/9 — เงื่อนไขต่อคน (ยากมาก = 2 เงื่อนไขพร้อมกัน) · ใบ้ในบทพูด */
const EVENTS=[['rain','ตอนฝนตก'],['night','หลัง 2 ทุ่ม'],['morning','ตอนเช้าก่อน 9 โมง'],['weekend','วันเสาร์-อาทิตย์'],['birthday','วันเกิดของเขา'],['evening','ช่วงเย็น 17–19 น.']];
const evOk=(id,now)=>{const h=hourOf(now),wd=new Date(now+TH).getUTCDay();return id==='rain'?isRaining(now):id==='night'?h>=20:id==='morning'?h<9:id==='weekend'?(wd===0||wd===6):id==='evening'?(h>=17&&h<19):false;};
export function eventOf(manId,heart){const m=MAN[manId];const base=Math.floor(fnv('ev'+manId+heart)*EVENTS.length);const a=EVENTS[base];if(m.hard!=='vhard')return {ids:[a[0]],hint:a[1]};
 let b=EVENTS[(base+1+Math.floor(fnv('ev2'+manId+heart)*(EVENTS.length-1)))%EVENTS.length];if(b[0]===a[0]||(a[0]==='night'&&['morning','evening'].includes(b[0]))||(b[0]==='night'&&['morning','evening'].includes(a[0]))||(a[0]==='morning'&&b[0]==='evening')||(a[0]==='evening'&&b[0]==='morning'))b=EVENTS[0][0]===a[0]?EVENTS[3]:EVENTS[0];return {ids:[a[0],b[0]],hint:a[1]+' และ'+b[1]};}
const eventPassed=(manId,heart,now)=>eventOf(manId,heart).ids.every(id=>id==='birthday'?isBirthday(manId,now):evOk(id,now));
/* ---------- ความลับต่อบัญชี ---------- */
const secretLike=(ctx,manId)=>{const m=MAN[manId];const pool=[...m.love,...m.like];return pool[Math.floor(ctx.h('secret'+ctx.uid+manId+Math.floor(ctx.now/(3*3600000)))*pool.length)];};
const weeklyWant=(ctx,manId)=>GIFTABLE[Math.floor(ctx.h('week'+ctx.uid+manId+weekOf(ctx.now))*GIFTABLE.length)];
/* ---------- เซฟ ---------- */
export const cityOf=game=>{game.sub ||= {};const c=game.sub.city ||= {};c.love ||= {};c.claimed ||= {};c.ex ||= {};c.visits ||= 0;return c;};
const loveOf=(c,manId,now)=>{const L=c.love[manId] ||= {p:0,h:0,ev:{},gifts:{},dates:0,first:dayOf(now),seen:dayOf(now),day:dayOf(now),dayPts:0,nGift:0};return L;};
export const heartsOf=L=>Math.min(HEARTS,Math.floor((L.p||0)/HEART));
function settle(L,manId,now){/* หัวใจลดเมื่อไม่มาหา · ดวงไม่เกินล็อก · เซฟไม่โต: ลบประวัติของขวัญเก่ากว่า 7 วัน */const d=dayOf(now);if(d!==L.day){L.day=d;L.dayPts=0;L.nGift=0;if(L.gifts)for(const k of Object.keys(L.gifts))if(now-L.gifts[k]>7*86400000)delete L.gifts[k];}
 const idle=d-(L.seen||d);if(idle>3){const hard=HARD[MAN[manId].hard];const floorH=Math.max(0,...LOCK_HEARTS.filter(h=>L.ev[h]));L.p=Math.max(floorH*HEART,(L.p||0)-hard.decay*(idle-3));L.seen=d-3;}
 let cap=HEARTS;for(const h of LOCK_HEARTS)if(!L.ev[h]){cap=h-1;break;}L.h=Math.min(cap,heartsOf(L));}
const isJealous=(c)=>Object.values(c.love).filter(L=>(L.h||0)>=8).length>=2;
/* ---------- มุมมองที่ส่งให้หน้าเกม (ไม่มีความลับ) ---------- */
export function cityView(game,world,ctx){const c=cityOf(game);const now=ctx.now;const jl=isJealous(c);
 const love={};for(const [id,L] of Object.entries(c.love)){settle(L,id,now);love[id]={h:L.h,p:L.p%HEART,dates:L.dates||0,lock:LOCK_HEARTS.find(h=>!L.ev[h]&&heartsOf(L)>=h)||0,hint:(()=>{const nl=LOCK_HEARTS.find(h=>!L.ev[h]);return nl?eventOf(id,nl).hint:'';})(),bored:L.bored>now};}
 const hb=c.husband?{...c.husband,name:MAN[c.husband.id]?.name,pregnant:c.husband.pregnant||null,pend:(c.husband.pend||[]).map(p=>({id:p.id,type:p.type,msg:p.msg,items:p.items,merit:p.merit,at:p.at}))}:null;
 return {car:c.car||null,cars:ownedCars(game),fuel:bagGet(game,'cityfuel'),ring:bagGet(game,'ring'),visits:c.visits,love,husband:hb,ex:Object.keys(c.ex),moods:Object.fromEntries(MEN.map(m=>[m.id,moodOf(m.id,now,jl&&(c.love[m.id]?.h||0)>=8)])),rain:isRaining(now),seasonDay:seasonDay(now),season:seasonOf(now),entry:entryCheck(game,world,ctx),admin:!!ctx.admin,open:world?.open!==false,pageantDay:!!world?.pageantDay,now};}
/* ---------- เข้านคร ---------- */
export function entryCheck(game,world,ctx){const c=cityOf(game);const e={...ENTRY_DEFAULT,...(world?.entry||{})};const bag=game.bag?.outfit||{};const outfits=Object.keys(bag).filter(k=>OUTFITS[k]&&bag[k]>0).length;const lv=Number(game.lv)||1;const fuel=bagGet(game,'cityfuel');
 const miss=[];if(outfits<e.outfits)miss.push('ชุด '+outfits+'/'+e.outfits);if(lv<e.houseLv)miss.push('บ้าน Lv.'+lv+'/'+e.houseLv);if(!ownedCars(game).length)miss.push('ยังไม่มีรถ (ได้จากยัยหนู)');const free=!!(ctx.admin||world?.free||world?.pageantDay);if(!free&&fuel<e.fuelMin)miss.push('น้ำมัน '+fuel+'/'+e.fuelMin+' แกลลอน');
 return {ok:ctx.admin||(miss.length===0),miss:ctx.admin?[]:miss,free,outfits,lv,fuel,need:e};}
/* ---------- รายการ ---------- */
export function cityAction(game,world,ctx,input,rng=Math.random){const type=String(input.type||'');const c=cityOf(game);const now=ctx.now;world=world||{};const W=structuredClone(world);const out={mails:[]};
 if(world.open===false&&!ctx.admin&&!['status','leave','husband','houseUp','claimReward'].includes(type))fail('นครปิดอยู่');
 /* ส่วน ⑤: รถ = ของตกแต่งหมวด "รถ" 4 คัน (bag.decor.d_city_car_*) วางในฟาร์มได้ · รถรุ่นเก่า (ไอเทม) แปลงให้อัตโนมัติ: รถเล็ก→รถเขียว · รถหรู→รถม่วง · ไม่มีโรงจอดแล้ว */
 {let conv=false;const n1=bagGet(game,'car-luxury');if(n1>0){bagAdd(game,'car-luxury',-n1);bagAdd(game,'decor-d_city_car_purple',n1);conv=true;}const n2=bagGet(game,'car-small');if(n2>0){bagAdd(game,'car-small',-n2);bagAdd(game,'decor-d_city_car_green',n2);conv=true;}const n3=bagGet(game,'decor-carport');if(n3>0){bagAdd(game,'decor-carport',-n3);conv=true;}/* โรงจอดรถเก่า: เก็บออกจากกระเป๋า */if(conv)out.sync=true;const cars=ownedCars(game);c.car=cars[0]||null;c.cars=cars;}
 if(type==='status'||type==='sync'){/* sync = status ที่บันทึก (ใช้เมื่อมีรถรอแปลง) */husbandTick(game,c,ctx,out);return {...out,view:cityView(game,W,ctx),world:publicWorld(W,now),worldDoc:W};}
 if(type==='enter'){const e=entryCheck(game,W,ctx);if(!e.ok)fail('ยังเข้านครไม่ได้: '+e.miss.join(' · '));let used=0;if(!e.free){used=W.hungry?e.need.fuelHungry:Math.min(e.need.fuelMax,e.need.fuelMin+Math.floor(rng()*(e.need.fuelMax-e.need.fuelMin+1)));if(bagGet(game,'cityfuel')<used)used=Math.max(e.need.fuelMin,bagGet(game,'cityfuel'));bagTake(game,'cityfuel',used);}
  c.visits++;c.lastEnter=now;husbandTick(game,c,ctx,out);return {...out,fuelUsed:used,view:cityView(game,W,ctx),world:publicWorld(W,now),worldDoc:W};}
 if(type==='leave'){c.lastLeave=now;return {...out,view:cityView(game,W,ctx)};}
 const man=input.man?String(input.man):null;const M=man&&MAN[man];
 if(['talk','gift','date','propose'].includes(type)){if(!M)fail('ไม่พบผู้ชายคนนี้');if(ctx.admin)fail('บัญชีแอดมินจีบไม่ได้');const st=manState(man,now,W);if(st.st!=='walk')fail(M.name+'ยังไม่ว่าง ('+({work:'กำลังทำงาน',rest:'กำลังพัก',date:'กำลังเดตกับคนอื่น'})[st.st]+')');if(c.husband&&c.husband.id!==man&&(type==='date'||type==='propose'))fail('แต่งงานแล้ว ต้องหย่าก่อน')/* แต่งแล้วยังคุย/ให้ของคนอื่นได้ (สร้างปฏิสัมพันธ์) แต่เดต/ขอแต่งไม่ได้ */;}
 if(type==='talk'){const L=loveOf(c,man,now);settle(L,man,now);const d=dayOf(now);let pts=0,first=false;if(L.talkDay!==d){L.talkDay=d;first=true;pts=GIFT_PTS.talk;}
  /* เหตุการณ์พิเศษ: คุยตอนเงื่อนไขครบ = ปลดล็อกดวงถัดไป */let unlocked=0;const nl=LOCK_HEARTS.find(h=>!L.ev[h]);if(nl&&heartsOf(L)>=nl&&eventPassed(man,nl,now)){L.ev[nl]=true;unlocked=nl;}
  addPts(L,man,pts);L.seen=d;settle(L,man,now);const before=L.h;rewards(c,L,man,ctx,out);
  return {...out,talk:{first,pts,unlocked,hint:lineHint(ctx,man,L,now),mood:moodOf(man,now,isJealous(c)&&L.h>=8),hearts:L.h,p:L.p%HEART},view:cityView(game,W,ctx)};}
 if(type==='gift'){const k=String(input.item||'');if(!GIFTABLE.includes(k))fail('ของชิ้นนี้ให้เป็นของขวัญไม่ได้');const L=loveOf(c,man,now);settle(L,man,now);const d=dayOf(now);const hard=HARD[M.hard];
  if((L.nGift||0)>=3)fail('วันนี้ให้ของ'+M.name+'ครบ 3 ชิ้นแล้ว');bagTake(game,k,1);L.nGift=(L.nGift||0)+1;
  let base,cat;if(M.love.includes(k)){base=GIFT_PTS.love;cat='love';}else if(M.like.includes(k)){base=GIFT_PTS.like;cat='like';}else if(M.hate.includes(k)){base=GIFT_PTS.hate;cat='hate';}else if(M.dislike.includes(k)){base=GIFT_PTS.dislike;cat='dislike';}else{base=GIFT_PTS.neutral;cat='neutral';}
  if(k===secretLike(ctx,man)){base=GIFT_PTS.secret;cat='secret';}
  let weekly=false;if(k===weeklyWant(ctx,man)&&L.weekly!==weekOf(now)){L.weekly=weekOf(now);base=GIFT_PTS.weekly;cat='weekly';weekly=true;}
  const mood=moodOf(man,now,isJealous(c)&&L.h>=8);const kind=GIFT_KIND(k);let mult=1;if(base>0){if(mood==='happy')mult=1.2;else if(mood==='hungry')mult=kind==='food'?2:kind==='flower'?.5:1;else if(mood==='tired')mult=kind==='drink'?2:kind==='heavy'?.5:1;else if(mood==='sad')mult=kind==='flower'?2:kind==='food'?.5:1;else if(mood==='bored')mult=L.gifts[k]?.5:2;else if(mood==='jealous')mult=.5;}
  let repeat=false;if(base>0&&L.gifts[k]&&now-L.gifts[k]<3*3600000){base=GIFT_PTS.repeat;mult=1;repeat=true;L.bored=now+3*3600000;cat='repeat';}
  if(isBirthday(man,now)&&base>0)mult*=3;let pts=Math.round(base*mult*(base>0?hard.gift:1));L.gifts[k]=now;
  addPts(L,man,pts);L.seen=d;settle(L,man,now);rewards(c,L,man,ctx,out);
  return {...out,gift:{item:k,pts,cat,mood,repeat,weekly,birthday:isBirthday(man,now),hearts:L.h,p:L.p%HEART,line:lineGift(man,cat,mood,repeat)},view:cityView(game,W,ctx)};}
 if(type==='date'){const place=DATES[String(input.place||'')];if(!place)fail('เลือกที่เดต');const L=loveOf(c,man,now);settle(L,man,now);const hard=HARD[M.hard];if(place.minHearts&&L.h<place.minHearts)fail('ต้องมี '+place.minHearts+' หัวใจก่อน');if(L.h<2)fail('ต้องมีอย่างน้อย 2 หัวใจก่อนชวนเดต');
  const cost=Math.round(place.merit*hard.dateCost);if((game.merit||0)<cost)fail('กุศลไม่พอ ('+cost.toLocaleString('en-US')+')');const wk=weekOf(now);if(L.dateWeek===wk&&(L.dateN||0)>=3)fail('สัปดาห์นี้เดตกับ'+M.name+'ครบ 3 ครั้งแล้ว');if(L.dateWeek!==wk){L.dateWeek=wk;L.dateN=0;}
  game.merit-=cost;L.dateN++;L.dates=(L.dates||0)+1;L.lastDate=now;addPts(L,man,Math.round(place.pts*hard.gift));L.seen=dayOf(now);settle(L,man,now);
  W.dates ||= {};W.dates[man]={uid:ctx.uid,until:now+place.h*3600000,place:String(input.place)};out.worldWrite=true;rewards(c,L,man,ctx,out);
  return {...out,date:{place:input.place,cost,until:W.dates[man].until,hearts:L.h,dates:L.dates},view:cityView(game,W,ctx),world:publicWorld(W,now),worldDoc:W};}
 if(type==='propose'){if(c.husband)fail('แต่งงานแล้ว ต้องหย่าก่อน');const L=loveOf(c,man,now);settle(L,man,now);const hard=HARD[M.hard];
  if(L.h<HEARTS)fail('ต้องครบ 10 หัวใจก่อน');if((L.dates||0)<hard.dates)fail('ต้องเดตครบ '+hard.dates+' ครั้งก่อน (ตอนนี้ '+(L.dates||0)+')');if(dayOf(now)-(L.first||dayOf(now))<Math.max(WED.minDays,hard.minDays))fail('ต้องรู้จักกันอย่างน้อย '+Math.max(WED.minDays,hard.minDays)+' วัน');
  if(bagGet(game,'ring')<1)fail('ไม่มีแหวน (ได้จากยัยหนูเท่านั้น)');if(String(input.confirm)!==man)fail('ยืนยันชื่อผู้ชายให้ตรง');bagTake(game,'ring',1);
  /* เข้าคิวงานแต่ง: ห่างกันอย่างน้อย 10 นาที · ประกาศ 30 วิ · ฉากทุกคนเห็น */W.weddings ||= [];const last=W.weddings.length?Math.max(...W.weddings.map(w=>w.at)):0;const at=Math.max(now+WED.announceSec*1000,last+WED.queueGapMin*60000);
  const wear=bestOutfit(game);W.weddings.push({uid:ctx.uid,name:ctx.name||'ผู้เล่น',man,manName:M.name,at,wear,tribe:game.sub?.char?.tribe||'pink'});W.weddings=W.weddings.filter(w=>w.at>now-600000);out.worldWrite=true;
  c.husband={id:man,at,happy:HUSBAND.happyStart,house:{lv:1},kids:[],pend:[],lastSlot:slotKey(now)};const cl=c.claimed[man] ||= {h:{}};if(!cl.wed&&!c.ex[man]){cl.wed=true;game.merit=(game.merit||0)+WED_REWARD.merit;out.mails.push({key:'wed-'+man,title:'💍 ของขวัญแต่งงาน',msg:'ยินดีด้วย! แต่งงานกับ'+M.name+'แล้ว',kusal:0,items:{'wine-rose':1,cake:1}});}
  bagAdd(game,'decor-husband-house',1);/* บ้านสามีเข้ากระเป๋าของแต่ง ต้องกดวางเอง */
  return {...out,wedding:{man,at,wear},view:cityView(game,W,ctx),world:publicWorld(W,now),worldDoc:W};}
 if(type==='divorce'){if(!c.husband)fail('ยังไม่ได้แต่งงาน');if(ctx.admin)fail('แอดมินไม่มีคู่');if(String(input.confirm)!=='หย่า')fail('พิมพ์ "หย่า" เพื่อยืนยัน');if((game.merit||0)<WED.divorce)fail('ค่าหย่า '+WED.divorce.toLocaleString('en-US')+' กุศล ไม่พอ');
  game.merit-=WED.divorce;const h=c.husband;c.ex[h.id]=true;const kids=(h.kids||[]).length;c.husband=null;const L=c.love[h.id];if(L){L.p=0;L.h=0;L.dates=0;L.ev={};}
  /* บ้านสามีหายทั้งที่วางและในกระเป๋า · ของในบ้านย้ายเข้ากระเป๋าทำที่หน้าเกม (ของแต่ง) */if(bagGet(game,'decor-husband-house')>0)bagAdd(game,'decor-husband-house',-bagGet(game,'decor-husband-house'));
  W.divorces ||= [];W.divorces.push({uid:ctx.uid,name:ctx.name||'ผู้เล่น',man:h.id,manName:MAN[h.id]?.name,at:now});W.divorces=W.divorces.filter(d=>d.at>now-600000);out.worldWrite=true;
  return {...out,divorce:{man:h.id,kidsGone:kids,msg:kids?'มีคนอุปการะเลี้ยงดูลูกของคุณแล้ว':''},view:cityView(game,W,ctx),world:publicWorld(W,now),worldDoc:W};}
 if(type==='husband'){/* กดยืนยันรายการค้างของสามี (ของขวัญ/บ่น) */if(!c.husband)fail('ยังไม่ได้แต่งงาน');husbandTick(game,c,ctx,out);const id=String(input.id||'');const i=(c.husband.pend||[]).findIndex(p=>p.id===id);if(i<0)fail('ไม่มีรายการนี้');const p=c.husband.pend.splice(i,1)[0];
  if(p.type==='gift'){for(const [k,n] of Object.entries(p.items||{}))bagAdd(game,k,n);}return {...out,husbandDone:p,view:cityView(game,W,ctx)};}
 if(type==='talkHusband'){if(!c.husband)fail('ยังไม่ได้แต่งงาน');const d=dayOf(now);if(c.husband.talkDay!==d){c.husband.talkDay=d;c.husband.happy=Math.min(100,(c.husband.happy||0)+3);}return {...out,view:cityView(game,W,ctx)};}
 if(type==='houseUp'){if(!c.husband)fail('ยังไม่ได้แต่งงาน');const h=c.husband.house ||= {lv:1};if(h.up){if(h.up.end>now)fail('กำลังอัปเกรดอยู่');h.lv=h.up.to;h.up=null;c.husband.happy=Math.min(100,(c.husband.happy||0)+10);return {...out,view:cityView(game,W,ctx)};}
  const to=(h.lv||1)+1;const cost=HOUSE_UP[to];if(!cost)fail('บ้านสามีเลเวลสูงสุดแล้ว');if((game.merit||0)<cost.merit)fail('กุศลไม่พอ');for(const k of ['wood','stone','rope','steel'])if(cost[k]&&bagGet(game,k)<cost[k])fail('ขาด '+BY_KEY[k].n+' '+bagGet(game,k)+'/'+cost[k]);
  game.merit-=cost.merit;for(const k of ['wood','stone','rope','steel'])if(cost[k])bagAdd(game,k,-cost[k]);h.up={to,end:now+cost.h*3600000,at:now};return {...out,houseUp:h.up,view:cityView(game,W,ctx)};}
 if(type==='kid'){/* ตั้งท้อง 2 วัน แล้วค่อยเกิด (เจ้าของเกม 02:47) */if(!c.husband)fail('ยังไม่ได้แต่งงาน');const h=c.husband;h.kids ||= [];const n=h.kids.length;if(n>=KIDS.max)fail('มีลูกครบ 2 คนแล้ว');
  if(h.pregnant){if(now<h.pregnant.due)fail('กำลังตั้งท้องอยู่ อีก '+Math.ceil((h.pregnant.due-now)/3600000)+' ชั่วโมงจะคลอด');const kid=h.pregnant.kid;h.kids.push({id:kid,at:now,name:String(input.name||'').slice(0,20)||('ลูกคนที่ '+(n+1))});h.pregnant=null;h.happy=Math.min(100,(h.happy||0)+10);return {...out,kid:h.kids.at(-1),view:cityView(game,W,ctx)};}
  const need=n===0?KIDS.first:KIDS.second;if(need.days&&dayOf(now)-dayOf(h.at)<need.days)fail('ต้องแต่งงานครบ '+need.days+' วันก่อน');if((h.house?.lv||1)<need.houseLv)fail('บ้านสามีต้อง Lv.'+need.houseLv);if((h.happy||0)<need.happy)fail('ความสุขสามีต้องถึง '+need.happy);
  h.pregnant={at:now,due:now+KIDS.pregnantDays*86400000,kid:1+Math.floor(rng()*8)};return {...out,pregnant:h.pregnant,view:cityView(game,W,ctx)};}
 if(type==='claimReward'){const L=c.love[man];if(!L)fail('ยังไม่รู้จักกัน');rewards(c,L,man,ctx,out);return {...out,view:cityView(game,W,ctx)};}
 fail('รายการไม่ถูกต้อง');
}
function addPts(L,man,pts){const hard=HARD[MAN[man].hard];if(pts>0){const room=Math.max(0,hard.dayCap-(L.dayPts||0));pts=Math.min(pts,room);L.dayPts=(L.dayPts||0)+pts;}L.p=Math.max(0,(L.p||0)+pts);}
function rewards(c,L,man,ctx,out){/* รางวัลหัวใจ รับครั้งเดียวต่อคน (เข้าจดหมาย) · อดีตสามีไม่ได้ซ้ำ */if(c.ex[man])return;const cl=c.claimed[man] ||= {h:{}};for(const [h,r] of Object.entries(HEART_REWARDS)){if(L.h>=+h&&!cl.h[h]){cl.h[h]=true;out.mails.push({key:'heart-'+man+'-'+h,title:'💗 '+MAN[man].name+' หัวใจดวงที่ '+h,msg:'ความสัมพันธ์ก้าวหน้า! ของขวัญจาก'+MAN[man].name,kusal:r.merit||0,items:r.items||{}});}}}
export const CAR_IDS=['yellow','pink','green','purple'];export const ownedCars=game=>CAR_IDS.filter(k=>bagGet(game,'decor-d_city_car_'+k)>0);
function bestOutfit(game){const bag=game.bag?.outfit||{};const order={c4:6,c3:5,q:7,c2:4,c1:3,c0:2,s:1};let best=null,bs=-1;for(const [k,n] of Object.entries(bag)){const o=OUTFITS[k];if(!o||!(n>0))continue;const s=order[o.cls]||0;if(s>bs){bs=s;best=k;}}return best||game.sub?.char?.wear||'punk';}
const slotKey=now=>{const d=dayOf(now),h=hourOf(now);return d*3+(h>=18?2:h>=12?1:0);};/* ช่องเวลา: k%3===1 คือ 12:00 · k%3===2 คือ 18:00 */
const SKILL_GIFTS={sell:{merit:[200000,600000]},cook:{items:[['food-01',100],['food-02',100],['food-05',100],['food-09',100]]},crop:{items:[['corn',300],['potato',300],['tomato',300],['carrot',300]]},flower:{items:[['rose',150],['tulip',150],['daisy',150],['lavender',150]]},barn:{items:[['egg',150],['milk',150],['pork',100],['cheese',60]]},fruit:{items:[['peach',200],['apple',200],['orange',200],['cherry',200]]},alpaca:{items:[['wool',120],['yarn-white',100],['rawwool',150]]},monkey:{items:[['mkdiaper',100],['mkdiaper2',100]]},bird:{items:[['ostrich-egg',100],['dodo-egg',100],['ostrich-feather',120]]}};/* ของฝากสามี: หลักร้อย–พัน (สุ่ม ±30%) × ความยาก × ความสุข × ระดับบ้าน */
const COMPLAINTS=['เธอไม่ทำการบ้านเลยนะ','เธอไม่ล้างจานเลยนะ มัวแต่เอาเวลาไปสังสรรค์','กลับบ้านดึกอีกแล้ว ฉันรอข้าวเย็นจนเย็นชืด','เธอไม่เคยถามเลยว่าวันนี้ฉันเป็นยังไงบ้าง','สวนรกไปหมด ฉันถอนหญ้าคนเดียวทั้งวัน','เธอลืมวันครบรอบของเราใช่ไหม'];
function husbandTick(game,c,ctx,out){/* ช่อง 12:00 และ 18:00: ของขวัญ 70% (ตามทักษะ) · บ่นแล้วหัก 100,000 (30% · ความสุขต่ำ 50%) · ค้างได้ไม่เกิน 2 */const h=c.husband;if(!h)return;const now=ctx.now;h.pend ||= [];const cur=slotKey(now);let k=(h.lastSlot??cur);
 const M=MAN[h.id];const hard=HARD[M.hard];const d=dayOf(now);if(h.talkDay!==undefined&&d-(h.talkDay||d)>2){h.happy=Math.max(0,(h.happy||0)-3*Math.min(5,d-h.talkDay-2));h.talkDay=d-2;}
 let n=0;while(k<cur&&n<6){k++;if(k%3===0)continue;/* เที่ยงคืน ไม่ใช่ช่อง */n++;if(h.pend.length>=HUSBAND.keepPending)continue;
  const happyMult=h.happy>=90?1.1:h.happy>=60?1:h.happy>=30?.75:.5;const lvMult=1+.05*Math.max(0,(h.house?.lv||1)-2);
  const r=ctx.h('hus'+ctx.uid+k);const complainP=h.happy<HUSBAND.complainLowHappy?.5:1-HUSBAND.giftChance;
  if(r<complainP){const msg=COMPLAINTS[Math.floor(ctx.h('cmp'+ctx.uid+k)*COMPLAINTS.length)];game.merit=Math.max(0,(game.merit||0)-HUSBAND.complainPenalty);h.pend.push({id:'p'+k,type:'complain',msg,merit:-HUSBAND.complainPenalty,at:now});}
  else{const g=SKILL_GIFTS[M.skill]||SKILL_GIFTS.crop;const items={};let merit=0;if(g.merit){merit=Math.round((g.merit[0]+ctx.h('gm'+ctx.uid+k)*(g.merit[1]-g.merit[0]))*hard.skill*happyMult*lvMult);game.merit=(game.merit||0)+merit;}else{const pick=g.items[Math.floor(ctx.h('gi'+ctx.uid+k)*g.items.length)];items[pick[0]]=Math.max(1,Math.round(pick[1]*(.7+.6*ctx.h('gq'+ctx.uid+k))*hard.skill*happyMult*lvMult));}
   h.pend.push({id:'p'+k,type:'gift',msg:M.name+'เอาของมาฝาก',items,merit,at:now});}}
 h.lastSlot=cur;}
/* บทพูดใบ้ (ไม่บอกชื่อของตรง ๆ) */
const KIND_HINT={food:'ช่วงนี้หิวบ่อย อยากกินอะไรอร่อย ๆ',drink:'คอแห้งจัง อยากได้อะไรดื่มเย็น ๆ',flower:'เห็นดอกไม้แล้วใจฟูทุกที',heavy:'ช่วงนี้งานซ่อมเยอะ ของแข็ง ๆ ก็มีประโยชน์นะ',other:'ของแปลก ๆ ที่ไม่เคยได้ ก็น่าสนใจดี'};
function lineHint(ctx,man,L,now){const M=MAN[man];const h=L.h;const want=weeklyWant(ctx,man);const nl=LOCK_HEARTS.find(x=>!L.ev[x]);const parts=[];
 if(nl&&heartsOf(L)>=nl)parts.push('เรายังไม่ค่อยรู้จักกันจริง ๆ เลยนะ… ลองมาเจอฉัน'+eventOf(man,nl).hint+'สิ');
 else if(h>=8)parts.push('สัปดาห์นี้ฉันอยากได้ "'+(BY_KEY[want]?.n||'ของดี ๆ')+'" มากเลย');else if(h>=5)parts.push(KIND_HINT[GIFT_KIND(want)]+' (ขึ้นต้นด้วย "'+String(BY_KEY[want]?.n||'').slice(0,2)+'…")');else parts.push(KIND_HINT[GIFT_KIND(want)]);
 if(isBirthday(man,now))parts.push('วันนี้วันเกิดฉันนะ รู้หรือเปล่า');return parts.join(' · ');}
function lineGift(man,cat,mood,repeat){const M=MAN[man];if(repeat)return 'อีกแล้วเหรอ… เพิ่งให้ไปเมื่อกี้เองนะ';return ({love:'นี่มัน…ของโปรดฉันเลย! รู้ได้ยังไง',secret:'ว้าว ไม่เคยบอกใครเลยนะว่าชอบอันนี้',weekly:'พอดีเลย กำลังอยากได้อันนี้พอดี!',like:'ขอบคุณนะ ชอบมากเลย',neutral:'ขอบคุณนะ',dislike:'เอ่อ… ขอบคุณที่ตั้งใจนะ',hate:'…ขอโทษนะ ฉันไม่ชอบอันนี้เลย'})[cat]||'ขอบคุณ';}
export function publicWorld(W,now=Date.now()){return {open:W.open!==false,entry:{...ENTRY_DEFAULT,...(W.entry||{})},free:!!W.free,hungry:!!W.hungry,pageantDay:!!W.pageantDay,pageantAt:W.pageantAt||0,dates:Object.fromEntries(Object.entries(W.dates||{}).filter(([m,d])=>d.until>now).map(([m,d])=>[m,{until:d.until}])),weddings:(W.weddings||[]).map(w=>({uid:w.uid,name:w.name,man:w.man,manName:w.manName,at:w.at,wear:w.wear,tribe:w.tribe})),divorces:W.divorces||[],announce:W.announce||null};}
/* ---------- แอดมิน ---------- */
export function cityAdmin(W,ctx,input){W=structuredClone(W||{});const type=String(input.type||'');
 if(type==='open'){W.open=true;delete W.closedAt;}else if(type==='close'){W.open=false;W.closedAt=ctx.now;}
 else if(type==='settings'){W.entry={...ENTRY_DEFAULT,...(W.entry||{})};for(const k of ['outfits','houseLv','fuelMin','fuelMax'])if(input[k]!==undefined)W.entry[k]=Math.max(0,Math.min(50,Number(input[k])||0));if(input.free!==undefined)W.free=!!input.free;if(input.hungry!==undefined)W.hungry=!!input.hungry;if(input.pageantDay!==undefined)W.pageantDay=!!input.pageantDay;}
 else if(type==='announce'){W.announce={msg:String(input.msg||'').slice(0,200),at:ctx.now};}
 else fail('รายการแอดมินไม่ถูกต้อง');return W;}
