export const GTM={waterspinach:25,lettuce:35,pea:40,mango:45,carrot:50,chili:55,corn:60,potato:65,pumpkin:70,cucumber:75,tomato:80,cabbage:80,lychee:85,strawberry:100,watermelon:110,grape:115,banana:130,gooseberry:150,mushroom:160,melon:180,bamboo:200,plankton:240};
const SPR={waterspinach:1,lettuce:1,pea:3,mango:3,carrot:3,chili:5,corn:5,potato:5,pumpkin:5,cucumber:8,tomato:8,cabbage:8,lychee:8,strawberry:10,watermelon:10,grape:12,banana:12,gooseberry:15,mushroom:18,melon:20,bamboo:25,plankton:30},NOWORM=new Set(['waterspinach','lettuce','mango','bamboo','plankton']);
const fail=m=>{throw new Error(m);};
import {prankAction,prankFix} from './prank-engine.js?h=352d79c0';
import {decorPrice,THEME_SETS,BOOK_REWARD,bookReward} from './decor-prices.js?h=d1908c7e';
export function farmTick(p,now,fortune){if(!p)return p;if(p.pk)return p;if(p.magicUntil>now)return p;if(p.magicUntil){p.t+=3*3600000;delete p.magicUntil;}const ms=(GTM[p.c]||30)*60000;if(p.ph==='g1'&&now-p.t>=ms*.4*(fortune?.i===1&&fortune.day===new Date(now).toDateString()?.7:1)){p.ph='water';p.t=now;}if(p.ph==='worm'&&now-p.t>=300000){p.ph='g2';p.wormPenalty=true;p.t+=300000;}if(p.ph==='g2'&&now-p.t>=ms*.6){p.ph='ready';p.t=now;}return p;}
export const FRUIT_TREES={peach:{grow:2,every:1,life:3,nF:3,pF:1},apple:{grow:3,every:2,life:4,nF:4,pF:2},orange:{grow:4,every:3,life:4,nF:5,pF:2},cherry:{grow:6,every:4,life:5,nF:6,pF:3}};
const UNLOCKS=[['c3',{wood:500,stone:500,'crop.waterspinach':300}],['c4',{wood:1000,stone:1000,rope:5,'crop.chili':300}],['f2',{wood:3000,stone:3000,rope:10,steel:10,anycrop:500}],['f3',{wood:6000,stone:6000,rope:30,steel:30,anyflower:300}],['f4',{wood:10000,stone:10000,rope:50,steel:50,grass5:300}]];
function extraFarm(game,ctx,input,rng){
 game.bag ||= {};game.bag.item ||= {};game.bag.fruit ||= {};game.fruit ||= {plots:Array(9).fill(null)};
 const consumed=[],bag=game.bag,colors=['green','yellow','red','pink','blue'],consume=needs=>{for(const[g,k,n]of needs)if((bag[g]?.[k]||0)<n)fail('วัตถุดิบไม่พอ');for(const[g,k,n]of needs){bag[g][k]-=n;consumed.push({path:g+'.'+k,quantity:n});}};
 if(input.type==='unlock'){
  /* S4 สมุดผู้เล่น (4 พ.ย.): พื้นที่ฝั่งข้ามสะพาน (ฟาร์ม 2) ปลดด้วยกุญแจดอกบัวจากยัยหนูเท่านั้น · ใช้ครั้งเดียว ถาวร (unl.f2 อยู่ในเซฟ wallet) · แปลงฟาร์ม 1 เปิดครบ 12 ไม่ต้องปลด c3/c4 */
  if(input.unlock==='f2'){game.unl ||= {};if(game.unl.f2)return {game,count:0};game.bag ||= {};game.bag.item ||= {};const kk=Number(game.bag.item.farmkey)||0;if(kk<1)fail('🔑 ต้องมีกุญแจดอกบัวก่อน (รับได้จากยัยหนู)');game.bag.item.farmkey=kk-1;game.unl.f2=true;return {game,count:1,items:{farmkey:-1}};}
  if(input.unlock==='c3'||input.unlock==='c4'){game.unl ||= {};game.unl[input.unlock]=true;return {game,count:1};}
  const ix=UNLOCKS.findIndex(x=>x[0]===input.unlock);if(ix<0)fail('ฟาร์มไม่ถูกต้อง');game.unl ||= {};if(game.unl[input.unlock])return {game,count:0};if(ix>0&&!game.unl[UNLOCKS[ix-1][0]])fail('ปลดล็อกก่อนหน้าก่อน');const needs=[];
  for(const[k,n]of Object.entries(UNLOCKS[ix][1])){if(k==='grass5')colors.forEach(c=>needs.push(['grass',c,n]));else if(k.startsWith('any')){const g=k==='anycrop'?'crop':'flower',best=Object.entries(bag[g]||{}).sort((a,b)=>b[1]-a[1])[0];if(!best)fail('วัตถุดิบไม่พอ');needs.push([g,best[0],n]);}else if(k.startsWith('crop.'))needs.push(['crop',k.slice(5),n]);else needs.push(['forest',k,n]);}consume(needs);game.unl[input.unlock]=true;return {game,count:1};
 }
 if(!game.unl?.f4)fail('สวนผลไม้ยังล็อกอยู่');
 if(input.type==='fruit-craft'){
  if(input.recipe==='tree'){consume([...colors.map(c=>['grass',c,200]),['item','bell',10],['sub','unused',0]] .filter(x=>x[0]!=='sub'));const scarf=game.sub?.alpaca?.bag?.['scarf-red']||0;if(scarf<10)fail('ผ้าพันคอไม่พอ');game.sub.alpaca.bag['scarf-red']-=10;consumed.push({path:'sub.alpaca.bag.scarf-red',quantity:10});bag.tree ||= {};const t=Object.keys(FRUIT_TREES)[Math.floor(rng()*4)];bag.tree[t]=(bag.tree[t]||0)+1;return {game,count:1,items:{[t]:1},results:[true],outputs:[{path:'tree.'+t,quantity:1}],consumed};}
  if(input.recipe==='normal'){consume([...colors.map(c=>['grass',c,3]),['forest','wood',10]]);bag.item.fertfruit=(bag.item.fertfruit||0)+1;}
  else if(input.recipe==='premium'){const crops=Object.entries(bag.crop||{});if(crops.reduce((n,[,q])=>n+q,0)<500)fail('ผักไม่พอ');consume([['item','fertfruit',5]]);let left=500;for(const[k,q]of crops){const n=Math.min(left,q);bag.crop[k]-=n;left-=n;if(n)consumed.push({path:'crop.'+k,quantity:n});}bag.item.fertfruitP=(bag.item.fertfruitP||0)+1;}else fail('สูตรไม่ถูกต้อง');return {game,count:1,results:[true],outputs:[{path:'item.'+(input.recipe==='normal'?'fertfruit':'fertfruitP'),quantity:1}],consumed};
 }
 const ids=input.all?game.fruit.plots.map((_,i)=>i):[input.index];if(ids.some(i=>!Number.isInteger(i)||i<0||i>8))fail('ต้นไม้ไม่ถูกต้อง');let count=0;const items={};
 for(const i of ids){const tree=game.fruit.plots[i];if(input.type==='fruit-plant'){if(tree||!FRUIT_TREES[input.tree])fail('หลุมไม่ว่างหรือต้นไม้ไม่ถูกต้อง');consume([['tree',input.tree,1]]);game.fruit.plots[i]={t:input.tree,at:ctx.now,last:0};count++;continue;}if(!tree)continue;const t=FRUIT_TREES[tree.t];if(!t)continue;const mat=tree.at+t.grow*3600000;if(ctx.now>=tree.at+t.life*86400000){game.fruit.plots[i]=null;continue;}if(ctx.now<mat)continue;const n=tree.full?8:Math.min(8,Math.floor((ctx.now-Math.max(mat,tree.last||0))/(t.every*3600000)));
  if(input.type==='fruit-harvest'&&n>0){let q=0;for(let j=0;j<n;j++)q+=5+Math.floor(rng()*8);q=Math.round(q*(tree.full||1));bag.fruit[tree.t]=(bag.fruit[tree.t]||0)+q;items[tree.t]=(items[tree.t]||0)+q;tree.last=ctx.now;tree.full=null;count++;}
  if(input.type==='fruit-fertilize'&&n<8){const premium=input.kind==='p',need=premium?t.pF:t.nF,key=premium?'fertfruitP':'fertfruit';if(input.all&&(bag.item[key]||0)<need)continue;consume([['item',key,need]]);tree.full=premium?(rng()<.3?2:1):.6;count++;}
 }
 if(!count)fail('ไม่มีต้นไม้พร้อมทำรายการหรือของไม่พอ');return {game,count,items};
}
export function farmAction(account,ctx,input,rng=Math.random){
 const game=structuredClone(account);/* S4 สมุดของตกแต่ง: 💰 ซื้อของแต่งด้วยกุศล (ราคาจากสมุด · ซื้อได้ไม่จำกัด · เซิร์ฟเวอร์หักเอง) *//* S4 ข้อ 10: สมุดสะสม ครบธีม = รับรางวัล (ครั้งเดียวต่อธีม) · ของธีมได้จากยัยหนูส่งเท่านั้น จึงตรวจจากกระเป๋าของแต่ง */if(input.type==='book-claim'){/* รับได้หลายรอบ: รอบที่ n ต้องมีของครบทุกชิ้นอย่างน้อย n ชิ้น · รางวัล 1,000ล้าน / 500ล้าน / 250ล้าน / 200ล้าน / ต่อไป 100ล้าน */const k=String(input.theme||'');const L=THEME_SETS[k];if(!L)fail('ไม่พบธีมนี้');game.unl ||= {};const done=Math.floor(Number(game.unl['book_'+k])||0),round=done+1;const d=(game.bag&&game.bag.decor)||{};const miss=L.filter(id=>(Number(d[id])||0)<round).length;if(miss)fail('รอบที่ '+round+' ต้องมีครบทุกชิ้น ชิ้นละ '+round+' (ขาด '+miss+' ชิ้น)');const reward=bookReward(round);game.unl['book_'+k]=round;game.merit=(Number(game.merit)||0)+reward;return {game,count:1,reward,round};}
 if(input.type==='decor-buy'){const id=String(input.id||'');const price=decorPrice(id);if(!price)fail('ของชิ้นนี้ไม่ได้ขาย');const n=Math.floor(Number(input.n)||1);if(!(n>=1&&n<=99))fail('จำนวนไม่ถูกต้อง');const cost=price*n;if((Number(game.merit)||0)<cost)fail('กุศลไม่พอ (ต้องใช้ '+cost.toLocaleString()+')');game.merit=(Number(game.merit)||0)-cost;game.bag ||= {};game.bag.decor ||= {};game.bag.decor[id]=(Math.floor(Number(game.bag.decor[id]))||0)+n;return {game,count:n,items:{['decor.'+id]:n},spent:cost};}if(input.type==='unlock'||input.type.startsWith('fruit-'))return extraFarm(game,ctx,input,rng);game.farms ||= {};for(let n=1;n<=4;n++)game.farms[n] ||= Array(n===1?12:16).fill(null);game.bag ||= {};game.bag.crop ||= {};game.bag.item ||= {};const farm=input.farm??1;if(!Number.isInteger(farm)||farm<1||farm>4)fail('ฟาร์มไม่ถูกต้อง');const arr=game.farms[farm];arr.forEach(p=>{farmTick(p,ctx.now,game.fortune);if(p?.wormPenalty){const m=game.merit||0;game.merit=m>=10?m-10:Math.min(m,0);delete p.wormPenalty;}});let count=0,pump=0;const items={};
 if(input.type==='status')return {game,count,pump,items};
 if(input.type==='prank-fix'){const prank=prankFix(game,ctx,input);return {game,count:prank.fixed||1,pump,items,prank};}
 const locked=i=>farm===1?false:!game.unl?.['f'+farm];/* S4: ฟาร์ม 1 เปิดครบ 12 แปลง */
 const indices=input.all?arr.map((_,i)=>i).filter(i=>!locked(i)):[input.index];if(indices.some(i=>!Number.isInteger(i)||i<0||i>=arr.length||locked(i)))fail('แปลงยังล็อกหรือไม่ถูกต้อง');
 if(input.type==='plant'){
 if(!GTM[input.crop])fail('เมล็ดไม่ถูกต้อง');const slots=indices.filter(i=>!arr[i]);if(!slots.length)fail('ไม่มีแปลงว่าง');const cost=slots.length*SPR[input.crop];game.merit=(game.merit||0)-cost;/* S4: กุศลติดลบได้ */slots.forEach(i=>arr[i]={c:input.crop,ph:'g1',t:ctx.now});return {game,count:slots.length,pump,items};
 }
 const harvested=[];/* fix19: แปลงที่เก็บจริง (สุกระหว่างรายการนี้ก็นับ) */
 for(const i of indices){const p=arr[i];if(!p||p.magicUntil>ctx.now||p.pk)continue;
 if(input.type==='harvest'&&p.ph==='ready'){harvested.push({c:p.c,bz:p.bz?1:0});const q=p.angel?10:1;game.bag.crop[p.c]=(game.bag.crop[p.c]||0)+q;items[p.c]=(items[p.c]||0)+q;if(p.c==='pumpkin')pump++;arr[i]=null;count++;}
 else if(input.type==='water'&&p.ph==='water'){p.ph=!NOWORM.has(p.c)&&rng()<.35?'worm':'g2';p.t=ctx.now;count++;}
 else if(input.type==='worm'&&p.ph==='worm'&&(game.merit||0)>=1){game.merit--;p.ph='g2';p.t=ctx.now;count++;}
 else if(input.type==='boost'&&p.ph!=='ready'&&['cake','coconut'].includes(input.item)&&(game.bag.item[input.item]||0)>0){game.bag.item[input.item]--;p.ph='ready';p.t=ctx.now;p.bz=1;/* fix19 ศึกโคมลอย: เร่งโต = แต้มน้อยลง */count++;}
 else if(input.type==='angel'&&!p.angel&&(game.bag.item.angel||0)>0){game.bag.item.angel--;p.angel=true;count++;}
 else if(input.type==='dig'){arr[i]=null;count++;}
 }
 /* S4 ข้อ 100: เก็บผัก → สุ่มได้ของลอยกระทง (8 ชนิด) แปลงละ 3% · วันละไม่เกิน 5 ชิ้น (เวลาไทย) · ผมตัดสินใจระดับปานกลาง–ยาก 4 พ.ย. */
 if(input.type==='harvest'&&harvested.length){const LK=['candy','bat','candle','web','hat','broom','pumpkin','cauldron'];const day=new Date(ctx.now+7*3600000).toISOString().slice(0,10);const st=game.lkdrop ||= {};if(st.d!==day){st.d=day;st.n=0;}
  for(let j=0;j<harvested.length&&st.n<5;j++){if(rng()<.03){const k=LK[Math.floor(rng()*LK.length)];game.bag.halloween ||= {};game.bag.halloween[k]=(game.bag.halloween[k]||0)+1;items['lk-'+k]=(items['lk-'+k]||0)+1;st.n++;}}}
 if(!count)fail('ไม่มีแปลงที่ทำรายการนี้ได้ หรือของไม่พอ');return {game,count,pump,items,harvested};
}
export function friendAction(actor,owner,ctx,input,rng=Math.random){
 const game=structuredClone(actor),target=structuredClone(owner);game.sub ||= {};const own=game.sub.friends ||= {day:'',steals:0,magics:0};const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(ctx.now));if(own.day!==day){own.day=day;own.steals=own.magics=0;}const farm=input.farm??1;if(!Number.isInteger(farm)||farm<1||farm>4)fail('ฟาร์มไม่ถูกต้อง');const arr=target.farms?.[farm]||[];arr.forEach(p=>farmTick(p,ctx.now,target.fortune));
 if(input.type==='visit')return {game,target};
 if(input.type==='prank'){own.day=day;const prank=prankAction(game,target,own,ctx,input);return {game,target,prank};}
 const i=input.index;if(!Number.isInteger(i)||i<0||i>=arr.length)fail('แปลงไม่ถูกต้อง');const p=arr[i];if(!p)fail('แปลงว่างแล้ว');if(p.magicUntil>ctx.now)fail('แปลงมีมนต์จันทร์อยู่');if(p.pk)fail('แปลงนี้โดนแกล้งอยู่ ทำอะไรไม่ได้');
 if(input.type==='steal'){if(p.angel)fail('นางฟ้าปกป้องแปลงนี้');if(p.ph!=='ready')fail('ผักยังไม่พร้อมเก็บ');if(own.steals>=15)fail('ขโมยครบ 15 ครั้งวันนี้แล้ว');game.bag ||= {};game.bag.crop ||= {};game.bag.crop[p.c]=(game.bag.crop[p.c]||0)+1;arr[i]=null;own.steals++;return {game,target,notice:'steal',stolen:{crop:p.c,quantity:1}};}
 else if(input.type==='water'){if(p.ph!=='water')fail('แปลงไม่ต้องการน้ำ');p.ph=!NOWORM.has(p.c)&&rng()<.35?'worm':'g2';p.t=ctx.now;}
 else if(input.type==='worm'){if(p.ph!=='worm')fail('ไม่มีหนอน');game.merit=(game.merit||0)-1;p.ph='g2';p.t=ctx.now;}
 else if(input.type==='magic'){if(p.angel)fail('นางฟ้าปกป้องแปลงนี้');if(own.magics>=20)fail('ร่ายมนต์ครบ 20 ครั้งวันนี้แล้ว');p.magicUntil=ctx.now+3*3600000;own.magics++;}
 else fail('คำสั่งเยี่ยมสวนไม่ถูกต้อง');return {game,target,notice:input.type};
}
