import {SHOP_CATALOG} from './farmshop-catalog.js?h=3e5ba50b';
const ITEMS=Object.fromEntries(SHOP_CATALOG.flatMap(c=>c.items.map(([key,name,price])=>[key,{name,price}])));
const fail=m=>{throw new Error(m);};
export const farmshopDay=now=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
export const farmshopOpen=now=>{const h=+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',hour:'2-digit',hour12:false}).format(new Date(now));return h>=6&&h<18;};
export const freshFarmshop=(uid,name,now)=>({uid,ownerName:name,name:'',note:'ผักสดจากสวน ไข่ไก่เพิ่งเก็บ 🥚',slots:Array(18).fill(null),day:farmshopDay(now),listed:0,earnedToday:0});
export function shopInventoryPath(key){if(key.startsWith('c-'))return 'bag.crop.'+key.slice(2);if(key.startsWith('a-'))return 'bag.product.'+key.slice(2);if(key.startsWith('b-'))return 'bag.bird.'+key.slice(2);if(key.startsWith('f-'))return 'bag.food.'+ITEMS[key].name;if(key.startsWith('fl-'))return 'bag.flower.'+key.slice(3);if(key.startsWith('w-'))return 'bag.wine.'+key.slice(2);if(key.startsWith('h-'))return 'bag.hedge.'+key.slice(2);throw new Error('ไอเทมร้านค้าไม่ถูกต้อง');}
const get=(o,p)=>p.split('.').reduce((v,k)=>v?.[k],o)||0;
const put=(o,p,n)=>{const ks=p.split('.');let t=o;for(const k of ks.slice(0,-1))t=t[k] ||= {};t[ks.at(-1)]=n;};
export function farmshopAction(source,account,ctx,input){
 const shop=structuredClone(source),game=structuredClone(account),day=farmshopDay(ctx.now);
 if(shop.day!==day){shop.day=day;shop.listed=0;shop.earnedToday=0;}
 const owner=shop.uid===ctx.uid;
 if(['name','note'].includes(input.type)){
   if(!owner)fail('เฉพาะเจ้าของร้าน');const value=String(input.value||'').trim();if(/[<>]/.test(value)||value.length>(input.type==='name'?14:40))fail('ข้อความไม่ถูกต้อง');shop[input.type]=value;return {shop,game};
 }
 if(!farmshopOpen(ctx.now))fail('ร้านเปิด 06:00–17:59 เวลาไทย');
 if(!Number.isInteger(input.slot)||input.slot<0||input.slot>17)fail('ลังไม่ถูกต้อง');
 while(shop.slots.length<18)shop.slots.push(null);const slot=shop.slots[input.slot];
 if(input.type==='clear') {if(!owner||!slot?.sold)fail('ยังล้างลังไม่ได้');shop.slots[input.slot]=null;return {shop,game};}
 if(input.type==='cancel'){if(!owner||!slot||slot.sold)fail('ยกเลิกลังนี้ไม่ได้');const p=shopInventoryPath(slot.k);put(game,p,get(game,p)+slot.q);shop.slots[input.slot]=null;return {shop,game};}
 if(input.type==='list') {
   if(!owner)fail('เฉพาะเจ้าของร้าน');if(slot)fail('ลังนี้มีของอยู่แล้ว');if(shop.listed>=30)fail('วางขายครบ 30 ครั้งวันนี้');
   const item=ITEMS[input.key];if(!item)fail('สินค้าไม่ถูกต้อง');
   const min=Math.max(1,Math.round(item.price*.65)),max=Math.max(2,Math.round(item.price*1.45)),q=input.quantity,p=input.price;
   if(!Number.isInteger(q)||q<1||q>100||!Number.isInteger(p)||p<min||p>max)fail('จำนวนหรือราคาไม่ถูกต้อง');
   const path=shopInventoryPath(input.key),have=get(game,path);if(have<q)fail('ของในกระเป๋าไม่พอ');
   put(game,path,have-q);shop.slots[input.slot]={k:input.key,q,p,sold:false};shop.listed++;return {shop,game};
 }
 if(input.type==='buy'){
   if(owner)fail('ซื้อร้านตัวเองไม่ได้');if(!slot||slot.sold)fail('มีคนซื้อไปแล้ว ไม่หักกุศล');
   game.sub ||= {};let quota=game.sub.farmshop;if(!quota||quota.day!==day)quota=game.sub.farmshop={day,buys:{}};
   const n=quota.buys[shop.uid]||0;if(n>=30)fail('ซื้อร้านนี้ครบ 30 ครั้งวันนี้');
   if(Object.keys(quota.buys).length>=200&&!quota.buys[shop.uid])fail('จำนวนร้านวันนี้มากเกินไป');
   const total=slot.q*slot.p;if((game.merit||0)<total)fail('กุศลไม่พอ');
   game.merit-=total;const path=shopInventoryPath(slot.k);put(game,path,get(game,path)+slot.q);quota.buys[shop.uid]=n+1;slot.sold=true;shop.earnedToday+=total;
   return {shop,game,proceeds:total,receipt:{key:slot.k,quantity:slot.q,buyer:ctx.name}};
 }
 fail('คำสั่งร้านค้าไม่ถูกต้อง');
}
