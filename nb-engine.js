/* fix14 เนเบอร์ฮูด — กติกาล้วน (ใช้ทั้งบนคลาวด์และในหน้าเว็บ ไม่มี Firebase) */
import {NB_QUESTS,NB_DAILY,NB_FIXED,nbPicks,nbReward} from './nb-quest.js?v=ss3-fix19';
export {NB_QUESTS,NB_DAILY,NB_FIXED,nbPicks,nbReward};
export const NB_MIN=3,NB_MAX=4;
export const NB_LOCK=30*3600000;            // เข้าแล้วต้องอยู่อย่างน้อย 30 ชม. ถึงออกได้
export const NB_GIFT_DAY=30,NB_GIFT_KINDS=10,NB_GIFT_MAX=999;
export const NB_FINE=5000;                  // ไม่มีเนเบอร์ฮูด หักเที่ยงคืนละ 5,000 (ไม่ติดลบ)
export const NB_PER_QUEST=50000,NB_ALL_BONUS=500000;
export const NB_EMBLEMS=['pumpkin','bee','sakura','mushroom','star','moon','clover','paw'];
export const NB_STICKERS=['👍','🎉','❤️','🌸','🎃'];
/* ค่าสร้าง (ลงขันรวมทั้งทีม) [catalog key, path ในกระเป๋า, จำนวน] */
export const NB_COST=[['wood','forest.wood',5000],['stone','forest.stone',5000],['rope','forest.rope',30],['steel','forest.steel',50],
 ['halloween-candy','halloween.candy',50],['halloween-bat','halloween.bat',50],['halloween-candle','halloween.candle',50],['halloween-web','halloween.web',50],
 ['halloween-hat','halloween.hat',50],['halloween-broom','halloween.broom',50],['halloween-pumpkin','halloween.pumpkin',10],['halloween-cauldron','halloween.cauldron',3]];
/* fix19: รางวัลตามข้อ (ข้อปกติ 50,000 · ข้อพิเศษ 150,000) · doneKeys = รายการข้อที่สำเร็จ (ตัวเลข = รุ่นเก่า คิดข้อละ 50,000) */
export function nbBasket(doneKeys){
 const keys=Array.isArray(doneKeys)?doneKeys:null,done=keys?keys.length:doneKeys,base=(keys?keys.reduce((a,k)=>a+nbReward(k),0):done*NB_PER_QUEST)+(done>=NB_DAILY?NB_ALL_BONUS:0),cut=done>=10?0:done>=7?.2:done>=4?.5:1;
 return {base,cut,net:Math.round(base*(1-cut))};
}
/* ความคืบหน้าของวัน (fix15): 10 ข้อที่สุ่มให้บ้านนี้วันนี้ · เป้า = ยอดรวมทั้งบ้าน · นับเฉพาะสมาชิกปัจจุบัน */
export function nbProgress(day,members,nbId,dayKey){
 const picks=new Set(nbPicks(nbId||'',dayKey||'')),rows=NB_QUESTS.filter(q=>picks.has(q[0])).map(([k,name,goal,unit,icon])=>{
  const by=Object.fromEntries((members||[]).map(u=>[u,Math.max(0,Number(day?.q?.[k]?.[u])||0)])),sum=Object.values(by).reduce((a,n)=>a+n,0);
  return {k,name,per:goal,unit,icon,goal,sum,by,done:sum>=goal,reward:nbReward(k),fixed:NB_FIXED.includes(k)};
 });
 const done=rows.filter(r=>r.done).length;return {rows,done,...nbBasket(rows.filter(r=>r.done).map(r=>r.k))};
}
export const bagGet=(game,path)=>{const v=path.split('.').reduce((o,k)=>o?.[k],game.bag||{});return Number.isFinite(Number(v))?Math.floor(Number(v)):0;};
export const bagPut=(game,path,n)=>{game.bag ||= {};const ks=path.split('.'),last=ks.pop();let o=game.bag;for(const k of ks){o[k] ||= {};o=o[k];}o[last]=n;};
export const costLeft=pool=>NB_COST.map(([k,p,q])=>[k,p,q,Math.max(0,q-(Number(pool?.[k])||0))]);
export const costDone=pool=>costLeft(pool).every(x=>x[3]===0);
export const cleanName=s=>String(s||'').replace(/[<>"'`\\]/g,'').replace(/\s+/g,' ').trim().slice(0,20);
