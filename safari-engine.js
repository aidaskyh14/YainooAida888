import {useBoost,boostUsed,boostHave,cut30,BOOST_LIMIT} from './boost-engine.js';
/* fix15: รางวัลวิจัยใหม่ (ตัดไวน์ออกจากโจทย์) · จำนวนวัตถุดิบ โอกาสสำเร็จ และ 10 ครั้ง/วัน เท่าเดิม */
export const SAFARI_RULES=[["zebra", "ม้าลาย", 75, 500, 1500, 100, 200], ["giraffe", "ยีราฟ", 60, 1000, 3000, 200, 400], ["hippo", "ฮิปโป", 55, 1500, 4000, 300, 600], ["elephant", "ช้าง", 50, 2000, 5000, 400, 800], ["rhino", "แรด", 40, 3000, 7000, 600, 1200], ["lion", "สิงโต", 25, 5000, 12000, 800, 1600]];
export const SAFARI_ITEMS=[["c-waterspinach", "crop.waterspinach"], ["c-lettuce", "crop.lettuce"], ["c-mango", "crop.mango"], ["c-chili", "crop.chili"], ["c-pumpkin", "crop.pumpkin"], ["c-lychee", "crop.lychee"], ["c-strawberry", "crop.strawberry"], ["c-grape", "crop.grape"], ["c-banana", "crop.banana"], ["c-gooseberry", "crop.gooseberry"], ["c-carrot", "crop.carrot"], ["c-corn", "crop.corn"], ["c-mushroom", "crop.mushroom"], ["c-melon", "crop.melon"], ["c-bamboo", "crop.bamboo"], ["c-plankton", "crop.plankton"], ["c-potato", "crop.potato"], ["c-cucumber", "crop.cucumber"], ["c-watermelon", "crop.watermelon"], ["c-cabbage", "crop.cabbage"], ["c-pea", "crop.pea"], ["c-tomato", "crop.tomato"], ["a-egg", "product.egg"], ["a-feather", "product.feather"], ["a-drumstick", "product.drumstick"], ["a-fishmeat", "product.fishmeat"], ["a-roe", "product.roe"], ["a-scale", "product.scale"], ["a-truffle", "product.truffle"], ["a-pork", "product.pork"], ["a-trotter", "product.trotter"], ["a-milk", "product.milk"], ["a-cheese", "product.cheese"], ["a-cream", "product.cream"], ["b-ostrich-egg", "bird.ostrich-egg"], ["b-ostrich-feather", "bird.ostrich-feather"], ["b-dodo-egg", "bird.dodo-egg"], ["b-dodo-feather", "bird.dodo-feather"], ["b-dodo-pebble", "bird.dodo-pebble"], ["f-0", "food.ข้าวผัดไข่"], ["f-1", "food.ซุปฟักทอง"], ["f-2", "food.ปลาย่างซอสมะม่วง"], ["f-3", "food.สตูว์รวมมิตร"], ["f-4", "food.ไข่อบชีส"], ["f-5", "food.น่องไก่อบครีม"], ["f-6", "food.ขนมลิ้นจี่มะยม"], ["f-7", "food.จานรวมมิตร"], ["f-8", "food.ออมเล็ตโรซี่"], ["f-9", "food.ไข่อบอัญชัน"], ["f-10", "food.ไข่ตุ๋นหกบุปผา"], ["f-11", "food.ไข่ย่างสปาฟลาวเวอร์"], ["fl-daisy", "flower.daisy"], ["fl-rose", "flower.rose"], ["fl-butterflypea", "flower.butterflypea"], ["fl-sunflower", "flower.sunflower"], ["fl-lotus", "flower.lotus"], ["fl-orchid", "flower.orchid"], ["fl-tulip", "flower.tulip"], ["fl-lavender", "flower.lavender"], ["fl-marigold", "flower.marigold"], ["fl-hydrangea", "flower.hydrangea"], ["fl-plumeria", "flower.plumeria"], ["fl-hibiscus", "flower.hibiscus"], ["h-fang", "hedge.fang"], ["h-quills", "hedge.quills"], ["h-claw", "hedge.claw"], ["h-tail", "hedge.tail"]];
const fail=m=>{throw Object.assign(new Error(m),{code:'failed-precondition'});};
const get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o);
const set=(o,p,n)=>{const keys=p.split('.'),last=keys.pop();let v=o;for(const k of keys)v=v[k] ||= {};v[last]=n;};
const count=n=>Number.isSafeInteger(n)&&n>=0?n:0;
export function safariAction(account,ctx,input,rng=Math.random){
 const game=structuredClone(account);game.bag ||= {};game.sub ||= {};const state=game.sub.safari ||= {};
 const day=new Date(ctx.now+7*3600000).toISOString().slice(0,10);
 if(state.quota?.day!==day)state.quota={day,counts:{}};
 state.quota.counts ||= {};
 state.stats ||= {runs:0,wins:0,fails:0,merit:0};state.log=Array.isArray(state.log)?state.log.slice(0,10):[];
 state.tasks ||= {};const newTask=a=>{const pool=[...SAFARI_ITEMS];for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,3).map(([k])=>[k,a[5]+Math.floor(rng()*(a[6]-a[5]+1))]);};
 if(state.rulesVersion!==2){state.tasks={};state.rulesVersion=2;}
 for(const a of SAFARI_RULES){const t=state.tasks[a[0]];if(!Array.isArray(t)||t.length!==3||new Set(t.map(x=>x?.[0])).size!==3||t.some(x=>!Array.isArray(x)||!SAFARI_ITEMS.some(i=>i[0]===x[0])||!Number.isSafeInteger(x[1])||x[1]<a[5]||x[1]>a[6]))state.tasks[a[0]]=newTask(a);}
 let receipt=null;const a=SAFARI_RULES.find(a=>a[0]===input.animal);
 if(input.type!=='status'){
  if(!a)fail('เลือกสัตว์วิจัยให้ถูกต้อง');const used=count(state.quota.counts[a[0]]);
  if(used>=10)fail('สัตว์นี้วิจัยครบ 10 ครั้งวันนี้แล้ว รอ 00:00 น. เวลาไทย');
  if(input.type==='reroll'){if(count(game.merit)<100)fail('กุศลไม่พอ');game.merit-=100;state.tasks[a[0]]=newTask(a);}
  else if(input.type==='research'){
   const task=state.tasks[a[0]];
   if(JSON.stringify(input.task)!==JSON.stringify(task))fail('โจทย์เปลี่ยนแล้ว ตรวจโจทย์ล่าสุดก่อนวิจัย');
   const lens=input.lens===true;if(lens){if(boostHave(game,'lens')<1)fail('ไม่มีแว่นขยายนักวิจัยในกระเป๋า');if(boostUsed(state,'lens',ctx.now)>=BOOST_LIMIT)fail('🔍 แว่นขยายใช้ครบ '+BOOST_LIMIT+' ครั้งวันนี้แล้ว');}
   const consumed=task.map(([key,quantity])=>({key,path:SAFARI_ITEMS.find(i=>i[0]===key)[1],quantity:lens?cut30(quantity):quantity}));
   if(consumed.some(i=>count(get(game.bag,i.path))<i.quantity))fail('วัตถุดิบในกระเป๋าไม่ครบ ไม่ได้หักของหรือใช้โควตา');
   if((state.nextAt||0)>ctx.now)fail('กำลังวิจัย กรุณารอผลรอบก่อน');
   if(lens)useBoost(game,state,'lens',ctx.now);
   for(const i of consumed)set(game.bag,i.path,count(get(game.bag,i.path))-i.quantity);
   const win=rng()*100<a[2],gain=win?a[3]+Math.floor(rng()*(a[4]-a[3]+1)):0;
   game.merit=count(game.merit)+gain;state.quota.counts[a[0]]=used+1;state.nextAt=ctx.now+4000;
   for(const k of ['runs','wins','fails','merit'])state.stats[k]=count(state.stats[k]);
   state.stats.runs++;state.stats[win?'wins':'fails']++;state.stats.merit+=gain;
   state.log.unshift((win?'✅ ':'❌ ')+a[1]+(win?' +'+gain+' กุศล':' ล้มเหลว'));state.log=state.log.slice(0,10);state.tasks[a[0]]=newTask(a);
   receipt={win,gain,consumed,animal:a[0],used:used+1,lens};state.lastReceipt={...receipt,at:ctx.now};
  }else fail('ไม่พบคำสั่งวิจัย');
 }
 const bag=Object.fromEntries(SAFARI_ITEMS.map(([k,p])=>[k,count(get(game.bag,p))]));
 return {game,view:{...state,lens:{have:boostHave(game,'lens'),used:boostUsed(state,'lens',ctx.now),limit:BOOST_LIMIT},tasks:Object.fromEntries(Object.entries(state.tasks).map(([animal,task])=>[animal,task.map(([key,quantity])=>({key,quantity}))])),bag,merit:count(game.merit),limit:10},receipt};
}
