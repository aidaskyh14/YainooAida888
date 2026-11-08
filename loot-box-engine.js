import {CATALOG} from './catalog.js?h=f385b8f0';
import {BOXES,BOX_QUANTITIES,getBoxCount,MERIT_TABLE,SPEED_TABLE} from './loot-box-catalog.js?h=03cb46b1';
import {decorBoxPool} from './decor-prices.js?h=d1908c7e';
import {OUTFITS,BOX_CLASS} from './outfit-catalog.js?h=16ac9bbc';
let POOLS=null;const pools=()=>{if(POOLS)return POOLS;POOLS={};for(const c of CATALOG){if(!c.p.startsWith('decor.'))continue;const k=decorBoxPool(c.p.slice(6));if(k)(POOLS[k] ||= []).push(c);}return POOLS;};
const fullPath=c=>/^(sub|pend)\./.test(c.p)?c.p:'bag.'+c.p;
const error=message=>{throw Object.assign(new Error(message),{code:'invalid-argument'});};
function add(game,path,amount){const keys=path.split('.');let o=game;for(const k of keys.slice(0,-1))o=o[k]||=( {} );const k=keys.at(-1);o[k]=(o[k]||0)+amount;}
export function openLootBoxes(game,input,rng=Math.random){
 const box=BOXES.find(b=>b.id===input.box),quantity=input.quantity;
 if(input.type!=='open'||!box||!BOX_QUANTITIES.includes(quantity))error('กล่องหรือจำนวนไม่ถูกต้อง');
 if(getBoxCount(game,box)<quantity)error('กล่องสุ่มไม่พอ');
 const next=structuredClone(game),totals=new Map(),outcomes=[];let merit=0,salt=0,coins=0;
 const rand=()=>{const n=rng();if(!Number.isFinite(n)||n<0||n>=1)throw new Error('ผลสุ่มไม่ถูกต้อง');return n;};
 const int=(lo,hi)=>lo+Math.floor(rand()*(hi-lo+1));
 const pick=pool=>{if(!pool.length)throw new Error('ไม่พบรายการรางวัล');return pool[Math.floor(rand()*pool.length)];};
 const grant=(item,n)=>{if(!item)throw new Error('ไม่พบไอเทมรางวัล');add(next,fullPath(item),n);totals.set(item.k,(totals.get(item.k)||0)+n);};
 const byKey=k=>CATALOG.find(c=>c.k===k);
 const wpick=t=>{let r=rand()*t.reduce((a,x)=>a+x[1],0);for(const x of t){r-=x[1];if(r<0)return x[0];}return t.at(-1)[0];};
 add(next,box.path,-quantity);
 for(let i=0;i<quantity;i++){
  let chance=rand()*100;const row=box.rows.find(r=>(chance-=r.weight)<0)||box.rows.at(-1);let category='item',amount=0;
  switch(row.type){
   case 'salt':salt++;category='salt';break;
   case 'merit':amount=int(...row.value);merit+=amount;next.merit=(next.merit||0)+amount;category='merit';break;
   case 'animal':{
    category=['ostrich','dodo'].includes(box.id)?'bird':box.id;
    let item;
    if(category==='bird')item=byKey('bird-'+box.id);
    else if(box.id==='alpaca')item=rand()<.1?byKey('al-gold'):pick(CATALOG.filter(c=>/^al-(green|lavender|blue|yellow|cream)$/.test(c.k)));
    else item=pick(CATALOG.filter(c=>c.k.startsWith(box.id+'-')&&!c.k.startsWith(box.id+'-box')&&c.g===({dog:'สัตว์',cat:'แมว',hamster:'แฮมสเตอร์'}[box.id])));
    grant(item,1);break;
   }
   case 'item':grant(byKey(row.value[0]),row.value[1]);break;
   case 'medicine':grant(byKey('medicine'),int(...row.value));break;
   case 'grass':for(const color of ['green','yellow','red','pink','blue'])grant(byKey('g-'+color),row.value);break;
   case 'food':for(let n=0;n<row.value;n++)grant(pick(CATALOG.filter(c=>/^(food|gfood)\./.test(c.p)&&c.g!=='เมนูมีคลาส')),1);break;
   case 'drink':grant(pick(CATALOG.filter(c=>c.p.startsWith('drink.'))),row.value);break;
   case 'rod':grant(pick(CATALOG.filter(c=>c.p.startsWith('rod.'))),row.value);break;
   case 'flower':grant(pick(CATALOG.filter(c=>c.p.startsWith('flower.'))),row.value);break;
   case 'plants':{
    const pool=CATALOG.filter(c=>c.p.startsWith('crop.')),n=int(2,5);
    for(let j=0;j<n;j++){const c=pool.splice(Math.floor(rand()*pool.length),1)[0],bias=rand();grant(c,bias<.8?int(30,50):bias<.95?int(10,29):int(51,150));}break;
   }
   case 'meritT':amount=wpick(MERIT_TABLE);merit+=amount;next.merit=(next.merit||0)+amount;category='merit';break;
   case 'speed':grant(byKey(wpick(SPEED_TABLE)),int(1,3));break;
   case 'coins':amount=int(...row.value);coins+=amount;category='coins';break;
   case 'decor':{const pool=pools()[row.value]||pools().small;grant(pick(pool),1);category='decor';break;}
   /* S4 3.7 กล่องเสื้อผ้า */
   case 'animalProduct':grant(pick(CATALOG.filter(c=>c.p.startsWith('product.')||(c.p.startsWith('bird.')&&/-(egg|feather|pebble)$/.test(c.k)))),int(1,3));category='animal';break;
   case 'farmMat':grant(pick(CATALOG.filter(c=>c.p.startsWith('forest.')||c.p.startsWith('grass.'))),int(5,20));category='mat';break;
   case 'lk':grant(pick(CATALOG.filter(c=>c.p.startsWith('halloween.'))),int(1,3));category='lk';break;
   case 'drops':grant(pick(CATALOG.filter(c=>c.p.startsWith('hedge.')||c.p.startsWith('boost.'))),int(1,3));category='drop';break;
   case 'outfit':{const tribe=game.sub?.char?.tribe;if(!tribe){salt++;category='salt';break;}const cls=wpick(BOX_CLASS);const pool=Object.values(OUTFITS).filter(o=>o.tribe===tribe&&o.cls===cls);const o=pick(pool);add(next,'bag.outfit.'+o.id,1);totals.set('outfit-'+o.id,(totals.get('outfit-'+o.id)||0)+1);category='outfit';break;}
   default:throw new Error('ตารางกล่องไม่ครบ');
  }
  outcomes.push({k:category,q:amount});
 }
 const items=[...totals].map(([key,quantity])=>({key,quantity}));
 return {game:next,outcomes,receipt:{box:box.id,quantity,merit,salt,coins,items,remaining:getBoxCount(next,box)}};
}
