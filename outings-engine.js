import {CATALOG} from './catalog.js';
export const VEHICLES={jeep:{trays:[3,6],menus:[1,2],wait:20,merit:[300,600],chance:.2,oil:300,hat:0},ship:{trays:[7,12],menus:[2,3],wait:10,merit:[800,1500],chance:.3,oil:100,hat:50},raft:{trays:[13,20],menus:[3,4],wait:5,merit:[5000,10000],chance:.5,oil:500,hat:100}};
const int=(rng,a,b)=>a+Math.floor(rng()*(b-a+1));
const fail=m=>{throw new Error(m);};
export const thaiHour=now=>+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',hour:'2-digit',hour12:false}).format(new Date(now));
const day=now=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
export const vehicleOpen=(v,now)=>v==='jeep'||(v==='ship'?(thaiHour(now)>=18||thaiHour(now)<6):thaiHour(now)>=6&&thaiHour(now)<18);
export function availableFuel(game,now){return Math.min(100,Math.max(0,game.fuel||0)+Math.max(0,now-(game.fuelAt??now))*100/(4*3600000));}
const TABLE=[
 ['item.angel',[[20,60],[60,120],[120,200]]],['item.cake',[[20,60],[60,120],[120,200]]],['item.coconut',[[20,60],[60,120],[120,200]]],
 ['item.pestle',[[30,50],[60,100],[120,200]]],['item.medicine',[[3,6],[6,12],[12,24]]],['item.hay',[[10,20],[20,40],[40,80]]],
 ['item.license',[[30,60],[60,100],[100,150]]],['item.musicbox',[[10,20],[20,40],[40,80]]],['item.bell',[[3,6],[6,12],[12,24]]],
 ['item.fuel',[[30,50],[60,100],[120,200]]],['item.hat',[[5,10],[10,20],[20,40]]],['sub.alpaca.bag.wool-gold',[[10,20],[20,40],[40,80]]],
 ['boxes',[[1,1],[2,2],[4,4]]],['grass',[[30,50],[60,100],[120,200]]]
];
/* fix13: เรือ/แพไม้ — ไม่ได้กุศลจะได้ 1 ใน 11 อย่าง (โอกาสเท่ากัน) จำนวน [เรือ, แพ]; จี๊ปยังใช้ TABLE เดิม */
export const SEA_TABLE=[
 ['item.musicbox',[30,70]],['item.pestle',[300,1000]],['coins',[2,4]],['item.angel',[300,500]],
 [['box.plant','box.fruit'],[30,10]],['sub.alpaca.bag.box',[10,10]],['item.medicine',[20,30]],
 [['tree.apple','tree.orange','tree.peach','tree.cherry'],[1,1]],['grass',[200,300]],['sub.alpaca.bag.wool-gold',[10,20]],
 [['rod.bamboo','rod.moon','rod.honey','rod.sakura'],[3,10]]
];
export const GRASS_COLORS=['green','yellow','red','pink','blue'];
function add(game,path,q){let o=game;const keys=path.split('.');for(const k of keys.slice(0,-1))o=o[k] ||= {};const k=keys.at(-1);o[k]=(o[k]||0)+q;}
export const HONEY_RECIPES={fuel:{chance:1,need:[['bird','ostrich-egg',100],['bird','dodo-egg',100],['hedge','claw',100],['product','roe',100],['crop','corn',300],['item','musicbox',10],['item','bell',5],['sub.alpaca.bag','scarf-red',5]]},hat:{chance:.5,need:[['bird','dodo-feather',100],['product','feather',100],['sub.alpaca.bag','yarn-white',100],['sub.alpaca.bag','yarn-blue',100],['hedge','fang',100]]}};
function inventory(game,group){if(group==='sub.alpaca.bag'){game.sub ||= {};game.sub.alpaca ||= {};return game.sub.alpaca.bag ||= {};}return game.bag[group] ||= {};}
export function outingsAction(account,ctx,input,rng=Math.random){
 const game=structuredClone(account);game.bag ||= {};game.bag.item ||= {};game.fuel=availableFuel(game,ctx.now);game.fuelAt=ctx.now;
 if(game.honey&&ctx.now>=(game.honey.leaveAt?game.honey.leaveAt+3000:game.honey.until+3000))game.honey=null;
 if(game.honey&&!game.honey.delivered){const valid=CATALOG.filter(c=>c.p.startsWith('food.')||c.p.startsWith('gfood.'));game.honey.req=game.honey.req.map(([k,id,q],i)=>valid.some(c=>c.p===(k==='h'?'food.':'gfood.')+id)?[k,id,q]:[valid[i%valid.length].p.startsWith('food.')?'h':'g',valid[i%valid.length].p.split('.').slice(1).join('.'),q]);}
 if(input.type==='status')return {game};
 if(input.type==='craft'){
  const r=HONEY_RECIPES[input.recipe],q=input.quantity;if(!r||!Number.isInteger(q)||q<1||q>100)fail('คราฟได้ครั้งละ 1–100');
  if(r.need.some(([group,k,n])=>(inventory(game,group)[k]||0)<n*q))fail('วัตถุดิบไม่พอ');for(const[group,k,n]of r.need)inventory(game,group)[k]-=n*q;
  const results=Array.from({length:q},()=>rng()<r.chance),wins=results.filter(Boolean).length;game.bag.item[input.recipe]=(game.bag.item[input.recipe]||0)+wins*10;return {game,crafted:wins,quantity:wins*10,results,outputs:wins?[{path:'item.'+input.recipe,quantity:wins*10}]:[],consumed:r.need.map(([g,k,n])=>({path:(g==='sub.alpaca.bag'?g+'.':g+'.')+k,quantity:n*q}))};
 }
 if(input.type==='refuel')fail('เลือกเรียกรถจี๊ป: ใช้น้ำมัน 300 แกลลอน หรือรอแถบเต็ม 4 ชั่วโมง');
 if(input.type==='call'){
  if(game.honey)fail('น้องน้ำผึ้งกำลังทำงานอยู่');const v=VEHICLES[input.vehicle];if(!v)fail('พาหนะไม่ถูกต้อง');if(!vehicleOpen(input.vehicle,ctx.now))fail(input.vehicle==='ship'?'เรือเปิด 18:00–05:59 เวลาไทย':'แพเปิด 06:00–17:59 เวลาไทย');
  const free=input.vehicle==='jeep'&&game.fuel>=100;
  if(!free&&(game.bag.item.fuel||0)<v.oil)fail('แกลลอนน้ำมันไม่พอ ต้องใช้ '+v.oil);
  if((game.bag.item.hat||0)<v.hat)fail('หมวกกะลาสีไม่พอ ต้องใช้ '+v.hat);
  if(free){game.fuel=0;game.fuelAt=ctx.now;}else game.bag.item.fuel-=v.oil;
  if(v.hat)game.bag.item.hat-=v.hat;
  const pool=CATALOG.filter(c=>c.p.startsWith('food.')||c.p.startsWith('gfood.')).map(c=>[c.p.startsWith('food.')?'h':'g',c.p.split('.').slice(1).join('.')]);
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  const count=int(rng,...v.menus),trays=int(rng,...v.trays),req=pool.slice(0,count).map(([k,id])=>[k,id,1]);for(let i=count;i<trays;i++)req[int(rng,0,count-1)][2]++;
  game.honey={v:input.vehicle,req,arriveAt:ctx.now+3000,until:ctx.now+3000+v.wait*60000};return {game};
 }
 if(input.type==='deliver'){
  const h=game.honey;if(!h||h.delivered||h.leaveAt||ctx.now<h.arriveAt||ctx.now>=h.until)fail('รายการนี้ยังส่งไม่ได้หรือหมดเวลาแล้ว');
  for(const[k,id,q]of h.req)if((game.bag[k==='h'?'food':'gfood']?.[id]||0)<q)fail('อาหารไม่ครบ');for(const[k,id,q]of h.req)game.bag[k==='h'?'food':'gfood'][id]-=q;
  const v=VEHICLES[h.v];let gain=0;const items={};
  let coins=0;
  if(rng()<v.chance){gain=int(rng,...v.merit)*(game.fortune?.i===3&&game.fortune.day===day(ctx.now)?2:1);game.merit=(game.merit||0)+gain;}
  else if(h.v==='ship'||h.v==='raft'){
   const [pick,amounts]=SEA_TABLE[int(rng,0,SEA_TABLE.length-1)],n=amounts[h.v==='ship'?0:1];
   if(pick==='coins')coins=n;
   else if(pick==='grass')for(const k of GRASS_COLORS)items['grass.'+k]=n;
   else items[Array.isArray(pick)?pick[int(rng,0,pick.length-1)]:pick]=n;
   for(const[path,q]of Object.entries(items))add(game,path.startsWith('sub.')?path:'bag.'+path,q);
  }
  else{
   const [path,ranges]=TABLE[int(rng,0,TABLE.length-1)],n=int(rng,...ranges[['jeep','ship','raft'].indexOf(h.v)]);
   if(path==='grass')for(const k of ['green','yellow','red','pink','blue'])items['grass.'+k]=n;
   else if(path==='boxes'){const boxes=CATALOG.filter(c=>c.p.startsWith('box.')||c.p.startsWith('birdbox.')||c.p==='sub.alpaca.bag.box'||c.p==='item.boxdog');items[boxes[int(rng,0,boxes.length-1)].p]=n;}
   else items[path]=n;
   for(const[path,q]of Object.entries(items))add(game,path.startsWith('sub.')?path:'bag.'+path,q);
  }
  h.delivered=true;h.leaveAt=ctx.now;return {game,gain,items,coins};
 }
 fail('คำสั่งน้ำผึ้งไม่ถูกต้อง');
}
