/* fix24 💰 ราคาขายของทุกอย่างในกระเป๋า (ปลายซีซั่น) — ใช้ร่วมกันทั้งหน้าเว็บและเซิร์ฟเวอร์ (เซิร์ฟเวอร์คิดเงินจริง)
   ราคาเป็นกุศลต่อชิ้น · ไวน์ = 80% ราคาตลาดสวน (ขึ้นลงตามหุ้น) · ของฮาโลวีน 8 อย่าง = ราคาร้านฮาโลวีนเดิม (ช่วงผีออกได้โบนัส)
   สัตว์ = ราคาเดิมจากระบบขายสัตว์ (มีของแถมทุก 100 ตัว) · ของแปรรูปอัลปาก้า = 30% ของกุศลเมนู
   💳 บัตร ATM ขายได้ใบละ 100,000,000 (ขายแล้วใช้ตู้ ATM ไม่ได้จนกว่าจะได้บัตรใหม่) */
import {CATALOG} from './catalog.js';
import {ALPACA_MENU} from './alpaca-menu.js';
import {PET_SELL} from './pet-sell-engine.js';
const T=(list,p)=>Object.fromEntries(list.map(k=>[k,p]));
export const SELL_PRICE={
 /* 🥬 ผัก (ตามราคาเมล็ด/เวลาปลูก) */
 waterspinach:10,lettuce:10,pea:20,mango:20,carrot:20,chili:30,corn:30,potato:30,pumpkin:30,cucumber:40,tomato:40,cabbage:40,lychee:40,
 strawberry:50,watermelon:50,grape:60,banana:60,gooseberry:70,mushroom:80,melon:90,bamboo:100,plankton:120,
 /* 🌸 ดอกไม้ */
 daisy:30,rose:30,butterflypea:30,sunflower:30,lotus:40,orchid:40,tulip:50,lavender:50,marigold:50,hydrangea:60,plumeria:60,hibiscus:60,
 /* 🍎 ผลไม้ + 🌳 ต้นผลไม้ */
 peach:30,apple:40,orange:50,cherry:70,'tree-peach':2000,'tree-apple':3000,'tree-orange':4000,'tree-cherry':6000,
 /* 🌿 หญ้า · 🪵 วัสดุป่า */
 'g-green':5,'g-yellow':5,'g-red':5,'g-pink':8,'g-blue':8,wood:3,stone:3,rope:300,steel:500,
 /* 🥚 ผลผลิตสัตว์ */
 egg:40,feather:60,drumstick:100,fishmeat:40,roe:60,scale:100,truffle:40,pork:60,trotter:100,milk:40,cheese:60,cream:100,
 /* 🪶 ของนก · 🦔 ของเม่น */
 'ostrich-egg':80,'ostrich-feather':120,'dodo-egg':80,'dodo-feather':120,'dodo-pebble':200,fang:80,quills:80,claw:80,tail:80,
 /* 🦙 อัลปาก้า */
 wool:50,'wool-gold':500,ameat:50,'ameat-p':500,license:500,rawwool:10,'rawwool-gold':100,'yarn-white':20,'yarn-pink':20,'yarn-blue':20,
 potion:300,battery:1000,spray:200,'scarf-red':300,'beanie-blue':300,'plush-mini':300,
 /* ✨ ไอเทม */
 musicbox:50,bell:300,fuel:10,hat:300,cake:200,coconut:100,wings:300,fert:100,pestle:30,hay:20,medicine:200,fertfruit:100,treat:100,collar:300,boot:50,
 afood0:200,afood1:300,afood2:500,fertfruitP:300,
 /* 🎁 กล่องสุ่ม */
 'box-dog':200,'box-cat':200,'box-hamster':200,'box-plant':200,'box-fruit':200,'box-alpaca':300,'bird-box-ostrich':500,'bird-box-dodo':500,'box-mahakusal':500,
 /* 🍲 อาหาร: อาหารบ้าน 2,000 · เมนูมีคลาส 6,000 · อาหารสวนตามระดับ */
 ...T(['food-01','food-02','food-03','food-04','food-05','food-06','food-07','food-08','food-09','food-10','food-11','food-12'],2000),
 ...T(['food-13','food-14','food-15','food-16','food-17','food-18','food-19','food-20'],6000),
 ...T(['gfood-r1','gfood-r2','gfood-b1','gfood-b2'],1000),...T(['gfood-r3','gfood-r4','gfood-r5','gfood-n1','gfood-n2','gfood-b3','gfood-b4','gfood-b5','gfood-b6'],1500),
 ...T(['gfood-r6','gfood-r7','gfood-r8','gfood-n3','gfood-n4','gfood-b7','gfood-b8'],2000),
 /* 🐟 อาหารแมว · 🦴 อาหารหมา · 🌽 อาหารนก */
 'catfood-kibble':200,'catfood-shreds':300,'catfood-pate':400,'catfood-biscuit':600,'catfood-salmon':800,'catfood-can':1000,
 'dogfood-rice':200,'dogfood-stew':300,'dogfood-trotter':400,'dogfood-fishegg':600,'dogfood-cheeseball':800,'dogfood-feast':1000,
 'birdfood-corn':200,'birdfood-pumpkin':300,'birdfood-melon':400,'birdfood-carrot':600,'birdfood-fruit':800,'birdfood-mushroom':1000,
 /* 🎣 ตกปลา */
 'rod-bamboo':500,'rod-moon':1500,'rod-honey':2500,'rod-sakura':4000,'fishing-crab':300,'fishing-vip':1000,'fishing-eel':1000,
 /* 🧪 น้ำมนต์ (80% ของวัตถุดิบฮาโลวีน) */
 'antidote-0':3200,'antidote-1':8000,'antidote-2':11500,'antidote-3':46400,
 /* 🧃 เครื่องดื่มป่า · ⚙️ ไอเทมบูสต์ */
 'drink-watermelon':500,'drink-butterflypea':800,'drink-smoothie':1200,'drink-elixir':2000,'boost-bait':1000,'boost-lens':1000,'boost-gear':1500,
 /* 😈 ไอเทมปีศาจ */
 'demon-music':500,'demon-hour':1000,'demon-coffin':1500,'demon-heart':2500,
 /* 💳 บัตร ATM */
 'atm-card':100000000};
export const SELL_NO=new Set();
export const WINE_KEYS={'wine-moon':'moon','wine-rose':'rose','wine-blood':'blood','wine-eclipse':'eclipse'};
export const HW_KEYS={'halloween-candy':'candy','halloween-bat':'bat','halloween-candle':'candle','halloween-web':'web','halloween-hat':'hat','halloween-broom':'broom','halloween-pumpkin':'pumpkin','halloween-cauldron':'cauldron'};
export const ALP_RATE=.3;
const PET=new Map(PET_SELL.map(p=>[p[0],p]));
/* ทุกแถวที่ขายได้: {k,n,img,g,path,kind:'fixed'|'wine'|'hw'|'pet',price} · path แบบจุด (bag.crop.corn / sub.alpaca.bag.wool) */
export const SELL_ROWS=(()=>{const out=[],seen=new Set();
 for(const c of CATALOG){if(SELL_NO.has(c.k)||seen.has(c.k))continue;seen.add(c.k);
  const path=/^(sub|pend)\./.test(c.p)?c.p:'bag.'+c.p,img=c.i?(c.i.startsWith('images/')?c.i:'images/'+c.i):'',base={k:c.k,n:String(c.n).replace(/\s*\(.*\)$/,''),img,g:c.g,path};
  if(PET.has(c.k)){const P=PET.get(c.k);out.push({...base,path:P[1],kind:'pet',price:P[2]});continue;}
  if(WINE_KEYS[c.k]){out.push({...base,kind:'wine',price:0,w:WINE_KEYS[c.k]});continue;}
  if(HW_KEYS[c.k]){out.push({...base,kind:'hw',price:0,h:HW_KEYS[c.k]});continue;}
  if(Number.isSafeInteger(SELL_PRICE[c.k])&&SELL_PRICE[c.k]>0)out.push({...base,kind:'fixed',price:SELL_PRICE[c.k]});}
 for(const P of PET_SELL)if(!seen.has(P[0])){seen.add(P[0]);out.push({k:P[0],n:P[0],img:'',g:'สัตว์',path:P[1],kind:'pet',price:P[2]});}
 for(const m of ALPACA_MENU)if(!seen.has(m.id)){seen.add(m.id);out.push({k:m.id,n:m.n,img:m.img||'',g:'ของแปรรูป',path:'sub.alpaca.bag.'+m.id,kind:'fixed',price:Math.max(10,Math.round(m.merit*ALP_RATE/10)*10)});}
 return out;})();
export const SELL_BY_KEY=new Map(SELL_ROWS.map(r=>[r.k,r]));
export const SELL_BY_PATH=new Map(SELL_ROWS.map(r=>[r.path,r]));
export const getPath=(o,p)=>p.split('.').reduce((a,k)=>a&&typeof a==='object'?a[k]:undefined,o);
export const sellHave=(game,path)=>{const n=Number(getPath(game,path));return Number.isSafeInteger(n)&&n>0?n:0;};
