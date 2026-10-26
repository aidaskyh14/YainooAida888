import {petSell,petBonusLeft} from './pet-sell-engine.js';
const TICK=15*60e3,DAY=864e5;
const ST=[{k:'veg',n:'หุ้นผัก',b:3000,v:.014,lo:2000,hi:4500},{k:'fruit',n:'หุ้นผลไม้',b:4000,v:.02,lo:2500,hi:6500},{k:'fish',n:'หุ้นบ่อปลา',b:4500,v:.02,lo:2500,hi:7500},
{k:'wine',n:'หุ้นไวน์',b:6000,v:.026,lo:3500,hi:10000},{k:'alpaca',n:'หุ้นอัลปาก้า',b:7500,v:.026,lo:4000,hi:12000},{k:'bee',n:'หุ้นซิ่ง',b:5000,v:.05,lo:500,hi:15000}];
const NEWS=[
['🌞','แดดดีทั้งสัปดาห์ ผักงามทั่วสวน!',{veg:15}],['🥬','ตลาดเช้าแย่งกันซื้อผักบุ้งยัยหนู!',{veg:12}],['🥕','เชฟดังสั่งแครอทล็อตใหญ่!',{veg:18}],['💧','ฝนตกพอดี๊พอดี ผักโตไว!',{veg:10}],
['🌧️','พายุเข้า ผักล้มทั้งแปลง!',{veg:-20}],['🐛','หนอนบุกแปลงผัก!',{veg:-15}],['🥵','แล้งจัด ผักเหี่ยว!',{veg:-12}],['📉','ผักล้นตลาด ราคาตก!',{veg:-18}],
['🍑','ร้านขนมในเมืองสั่งพีชล็อตใหญ่!',{fruit:20}],['🍒','เชอร์รียัยหนูได้ขึ้นปกนิตยสาร!',{fruit:18}],['🍎','โรงเรียนแจกแอปเปิลให้เด็กทั้งเมือง!',{fruit:12}],['🍊','หน้าหนาวคนแห่ซื้อส้ม!',{fruit:15}],
['🐛','หนอนบุกสวนผลไม้!',{fruit:-18}],['🐦','ฝูงนกจิกผลไม้ทั้งคืน!',{fruit:-14}],['🍂','ลมแรง ผลร่วงทั้งสวน!',{fruit:-20}],['🧺','ผลไม้นำเข้าราคาถูกตีตลาด!',{fruit:-12}],
['🐟','ฝูงปลาอพยพเข้าบ่อยัยหนู!',{fish:18}],['🎣','ทัวร์นาเมนต์ตกปลาประจำปีมาแล้ว!',{fish:15}],['🍣','ร้านซูชิเปิดใหม่ รับซื้อปลาทั้งหมด!',{fish:20}],['🌊','น้ำใสปิ๊ง ปลาอ้วนพี!',{fish:10}],
['🦦','นากแอบมาขโมยปลาทั้งคืน!',{fish:-20}],['🪣','น้ำในบ่อลดฮวบ!',{fish:-15}],['🐊','ลือกันว่ามีจระเข้ในบ่อ!',{fish:-22}],['🥶','น้ำเย็นจัด ปลาไม่กินเหยื่อ!',{fish:-12}],
['🍷','ไวน์ยัยหนูคว้ารางวัลเหรียญทอง!',{wine:25}],['🎉','งานเลี้ยงใหญ่ในเมือง สั่งไวน์ยกลัง!',{wine:18}],['🍇','องุ่นปีนี้หวานเป็นพิเศษ!',{wine:15}],['💍','คู่รักดังจัดงานแต่งใช้ไวน์ยัยหนู!',{wine:20}],
['🍾','ถังไวน์ระเบิด! เสียหายทั้งห้องใต้ดิน',{wine:-25}],['🧪','ลือว่าไวน์ล็อตใหม่รสเปรี้ยว!',{wine:-15}],['🐀','หนูแอบกัดจุกไวน์!',{wine:-12}],['📦','ไวน์ล้นโกดัง ต้องลดราคา!',{wine:-18}],
['🦙','ดาราใส่ผ้าพันคออัลปาก้าออกทีวี!',{alpaca:25}],['❄️','หิมะแรกของปี คนแห่ซื้อของขนฟู!',{alpaca:20}],['🧶','ไหมพรมอัลปาก้าเป็นเทรนด์ฮิต!',{alpaca:15}],['🏆','อัลปาก้ายัยหนูชนะประกวดความฟู!',{alpaca:18}],
['🥵','ร้อนจัด ไม่มีใครอยากใส่ขนฟู',{alpaca:-22}],['💦','อัลปาก้าถ่มน้ำลายใส่ลูกค้ารายใหญ่!',{alpaca:-18}],['✂️','กรรไกรตัดขนหายทั้งโรงงาน!',{alpaca:-15}],['🧥','ขนสังเคราะห์ราคาถูกตีตลาด!',{alpaca:-12}],
['🐝','ราชินีผึ้งตื่นจากจำศีล!',{bee:40}],['🍯','น้ำผึ้งเดือนห้าขายดีถล่มทลาย!',{bee:30}],['🌸','ดอกไม้บานทั้งเมือง ผึ้งขยันสุดๆ!',{bee:25}],['🚀','หุ้นซิ่งถูกพูดถึงทั่วกลุ่ม!',{bee:35}],
['🐝','ผึ้งหนีรัง!!',{bee:-45}],['🐻','หมีขโมยน้ำผึ้งหมดรัง!',{bee:-35}],['🌧️','ฝนตกทั้งอาทิตย์ ผึ้งไม่ออกจากรัง!',{bee:-25}],['😵','ข่าวลือ: เจ้าของรังผึ้งหายตัว!',{bee:-30}],
['🎉','เทศกาลสวนประจำปีเริ่มแล้ว!',{all:10}],['🎆','ปีใหม่มาแล้ว ทุกคนใช้จ่ายสนุก!',{all:12}],['💰','นักลงทุนต่างเมืองบุกตลาดสวน!',{all:8}],['🐷','น้องน้ำผึ้งบอกว่า…วันนี้ลางดี',{rnd:30}],
['👻','ข่าวลือ: ผีหลอกในตลาด!',{all:-10}],['🌀','พายุใหญ่ผ่านเมือง!',{all:-12}],['🧾','สรรพากรสวนมาตรวจ!',{all:-8}],['🐷','น้องน้ำผึ้งทำแจกันแตก…ลางร้าย',{rnd:-30}],
['🔀','ขาใหญ่ย้ายพอร์ต!',{swap:20}],['🎰','ตลาดปั่นป่วน!!',{chaos:25}],['🧙','แม่มดร่ายมนต์ใส่ตลาด!',{chaos:20}],['🎲','ลูกเต๋ายักษ์กลิ้งผ่านตลาด!',{rnd:25}]];
export const WINE_BAG_RATE=.8;
const WINES=[['rose','ไวน์กุหลาบวิญญาณ',2500],['moon','ไวน์องุ่นแสงจันทร์',4000],['blood','ไวน์องุ่นโลหิต',6000],['eclipse','ไวน์ราชันสุริยคราส',10000]];

export {ST,NEWS,WINES,TICK,DAY};
export function marketMath(S){
function h32(a,b,c){let x=(a*374761393+b*668265263+c*2246822519)>>>0;x=(x^(x>>>13))*1274126177>>>0;return((x^(x>>>16))>>>0)/4294967296}
const daySeed=d=>Math.floor(h32(d,77,9)*1e9); // ของจริง: คนแรกหลังเที่ยงคืนสุ่มแล้วบันทึก
const T0=Math.floor((Date.UTC(2026,9,1)-31*DAY)/TICK);
const BASE={};
const MODES={calm:{n:'🐢 นิ่ง',v:.5,hi:.8},normal:{n:'🙂 ปกติ',v:1,hi:1},hot:{n:'🔥 เดือด',v:1.6,hi:1.5}};
function modeAt(t){let m='normal';S.modes.forEach(x=>{if(x.t<=t)m=x.m});return MODES[m]}
function build(upto){ST.forEach((s,i)=>{let a=BASE[s.k]||(BASE[s.k]=[Math.log(s.b)]);const lb=Math.log(s.b);
 for(let t=T0+a.length;t<=upto;t++){const d=Math.floor(t*TICK/DAY),sd=daySeed(d);const r=h32(sd,i,t)+h32(sd,i+9,t*7)-1;
  const md=modeAt(t);let x=a[a.length-1];x=lb+(x-lb)*.985+r*s.v*1.7*md.v;
  // ตลาดแตก/บูม วันละ 1–2 ครั้ง
  for(let e=0;e<2;e++){const et=Math.floor(h32(sd,100+e,3)*96),es=Math.floor(h32(sd,200+e,5)*6);if(e===1&&h32(sd,300,1)<.5)continue;
   if(es===i&&Math.floor((t*TICK-d*DAY)/TICK)===et)x+=h32(sd,400+e,2)<.5?Math.log(2):-Math.log(2)}
  x=Math.max(Math.log(s.lo),Math.min(Math.log(s.hi*md.hi),x));a.push(x)}})}
const SLOT=12; // 12 รอบ x 15 นาที = 3 ชั่วโมง
const autoCache={};
function autoNews(sl){if(autoCache[sl]!==undefined)return autoCache[sl];const sd=daySeed(Math.floor(sl*SLOT*TICK/DAY));
 const ix=Math.floor(h32(sd,sl,11)*NEWS.length),n=NEWS[ix],t=sl*SLOT+Math.floor(h32(sd,sl,13)*SLOT);
 const o={t,e:n[0],txt:n[1],ef:n[2],auto:true,pick:Math.floor(h32(sd,sl,17)*6),top:Math.floor(h32(sd,sl,19)*6),bot:Math.floor(h32(sd,sl,23)*6)};return autoCache[sl]=o}
function newsAt(sl){const ad=S.news.find(n=>Math.floor(n.t/SLOT)===sl);return ad||autoNews(sl)}
function newsUpTo(t,from){const L=[];for(let sl=Math.floor(from/SLOT);sl<=Math.floor(t/SLOT);sl++){const n=newsAt(sl);if(n.t<=t&&n.t>=from)L.push(n)}return L}
function effect(i,t){let m=1;const s=ST[i].k;
 newsUpTo(t,t-400).forEach(n=>{const dt=t-n.t;if(dt<0||dt>400)return;const f=Math.pow(.985,dt);let p=0;const ef=n.ef;
  if(ef.all)p=ef.all;else if(ef[s]!=null)p=ef[s];else if(ef.rnd&&n.pick===i)p=ef.rnd;else if(ef.swap){if(n.top===i)p=-ef.swap;if(n.bot===i)p=ef.swap}else if(ef.chaos)p=(h32(n.t,i,5)*2-1)*ef.chaos;
  m*=1+p/100*f});
return m}
function price(i,t){build(t);const a=BASE[ST[i].k];return Math.exp(a[t-T0])*effect(i,t)}

return {price,newsUpTo,autoNews,modeAt,daySeed,h32,SLOT,MODES,clear(){for(const k in BASE)delete BASE[k];for(const k in autoCache)delete autoCache[k];}};
}

/* fix14 มุมฮาโลวีน: ขายของฮาโลวีน (ช่วงหลอน 18:00–22:00 เวลาไทย +20%) + หีบแม่มด (ชนิดละ 3 ครบ 8 ชนิด) */
export const HW_ITEMS=[['candy','ลูกอมผี',200],['bat','ค้างคาวจิ๋ว',200],['candle','เทียนผี',400],['web','ใยแมงมุม',600],['hat','หมวกแม่มด',1200],['broom','ไม้กวาดแม่มด',1200],['pumpkin','ฟักทองแกะสลักเรืองแสง',3000],['cauldron','หม้อยาแม่มด',10000]];
export const HW_CHEST_COST=3,HW_HAUNT_BONUS=.2;
export const hwHaunting=now=>{const h=new Date(now+7*3600000).getUTCHours();return h>=18&&h<22;};
export const hwPrice=(k,now)=>{const it=HW_ITEMS.find(x=>x[0]===k);return it?Math.round(it[2]*(hwHaunting(now)?1+HW_HAUNT_BONUS:1)):0;};
export const HW_GFOOD=['r1','r2','r3','r4','r5','r6','r7','r8','n1','n2','n3','n4','b1','b2','b3','b4','b5','b6','b7','b8'];
// [โอกาส %, ชนิด] รวม 100
// fix15: กุศล 25→22 แบ่ง 3% ให้ไอเทมบูสต์ (ได้ 1–3 ชิ้น ชนิดเดียวแบบสุ่ม)
// fix15f: ยาพิษแม่มด 20% (เล็ก 10 · กลาง 6 · ใหญ่ 3 · ใหญ่สุด 1) แบ่งมาจากของเดิม
export const HW_PRIZES=[[15,'merit'],[3,'boost'],[8,'wine'],[8,'gfood'],[8,'box'],[7,'musicbox'],[7,'hat'],[7,'cake'],[7,'wings'],[6,'coconut'],[4,'fert'],[10,'p0'],[6,'p1'],[3,'p2'],[1,'p3']];
/* ยาพิษ: ได้แล้วต้องสาดใส่เพื่อนทันที (เลือกใน 1 นาที ไม่เลือก = ระบบสุ่มเพื่อน) · คนโดนลดกุศลผ่าน ledger · ไม่บอกชื่อคนสาด */
export const HW_POISON=[{n:'ยาพิษฟักทอง',size:'ขวดเล็ก',d:20000},{n:'ยาพิษค้างคาว',size:'ขวดกลาง',d:50000},{n:'ยาพิษหัวกะโหลก',size:'ขวดใหญ่',d:100000},{n:'ยาพิษปีศาจแดง',size:'ขวดใหญ่สุด',d:200000}];// fix19: ×4 (เดิม 5k/12k/25k/50k) · ขวดที่สาดไปแล้วหักตามค่าที่บันทึกตอนสาด
/* fix16 น้ำมนต์แก้พิษ: คู่กับยาพิษ 1:1 (a0 แก้ขวดเล็กเท่านั้น …) · คราฟสำเร็จ 100% · เก็บที่ bag.antidote.a0..a3 */
/* fix19: ของคราฟ ×2 */
export const HW_ANTI=[{n:'น้ำมนต์ดอกมะลิ',coin:16,items:{candy:10,bat:10},pestle:100},{n:'น้ำมนต์โบว์ฟ้า',coin:30,items:{candle:10,web:10},pestle:200},
 {n:'น้ำมนต์ปีกเทวดา',coin:60,items:{hat:6,broom:6},pestle:400},{n:'น้ำมนต์นางฟ้า',coin:120,items:{pumpkin:6,cauldron:4},pestle:800}];
export const HW_DECIDE=10*60000,HW_UNSEEN_MAX=864e5;
export const antiHave=(game,k)=>{const n=Number(game.bag?.antidote?.['a'+k]);return Number.isFinite(n)&&n>0?Math.floor(n):0;};
/* ตัดสินยาพิษที่โดน: ใช้น้ำมนต์คู่กัน (ไม่หัก) หรือรับทราบ (หักกุศล ไม่ต่ำกว่า 0) */
export function poisonApply(game,hit,use){
 if(use){if(antiHave(game,hit.k)<1)throw new Error('ไม่มี'+HW_ANTI[hit.k].n);game.bag ||= {};game.bag.antidote ||= {};game.bag.antidote['a'+hit.k]=antiHave(game,hit.k)-1;return {st:'u',lost:0};}
 const before=Math.max(0,game.merit||0);game.merit=Math.max(0,before-hit.d);return {st:'h',lost:before-game.merit};}
/* ยาพิษค้างเกินเวลา: เห็นแล้ว 10 นาที หรือยังไม่เคยเห็นเกิน 24 ชม. → นับว่ารับทราบ */
export const poisonExpired=(h,now)=>h.st==='p'&&!!h.seen&&now>=h.seen+HW_DECIDE;
/* fix16: เริ่มนับ 10 นาทีทีละขวด (ขวดถัดไปเริ่มนับต่อจากขวดก่อนหน้า) · onlyId = เฉพาะขวดที่เพิ่งขึ้นจอ */
export function poisonStartClocks(hits,now,onlyId){let t=now;for(const h of hits.filter(x=>x.st==='p').sort((a,b)=>a.at-b.at)){if(h.seen){t=Math.max(t,h.seen+HW_DECIDE);continue;}if(onlyId&&h.id!==onlyId)continue;h.seen=t;t+=HW_DECIDE;}}
export const HW_POISON_TIME=60000;
export function hwRollPrize(rng){
 const pick=(n)=>Math.min(n-1,Math.floor(rng()*n));let x=rng()*100,kind='merit';for(const [w,k] of HW_PRIZES){if(x<w){kind=k;break;}x-=w;}
 if(kind[0]==='p'&&/^p[0-3]$/.test(kind)){const p=+kind[1];return {kind:'poison',p,d:HW_POISON[p].d};}
 switch(kind){
  case 'merit':return {kind,merit:3000+pick(28)*1000};
  case 'boost':{const k=['bait','lens','gear'][pick(3)];return {kind,path:['boost',k],key:'boost-'+k,q:1+pick(3)};}
  case 'wine':{const w=WINES[pick(WINES.length)];return {kind,path:['wine',w[0]],key:'wine-'+w[0],name:w[1],q:2+pick(9)};}
  case 'gfood':{const g=HW_GFOOD[pick(HW_GFOOD.length)];return {kind,path:['gfood',g],key:'gfood-'+g,q:2+pick(4)};}
  case 'box':return pick(2)?{kind,path:['box','fruit'],key:'box-fruit',q:10}:{kind,path:['box','plant'],key:'box-plant',q:10};
  case 'musicbox':return {kind,path:['item','musicbox'],key:'musicbox',q:50};
  case 'hat':return {kind,path:['item','hat'],key:'hat',q:50};
  case 'cake':return {kind,path:['item','cake'],key:'cake',q:100};
  case 'wings':return {kind,path:['item','angel'],key:'wings',q:100};
  case 'coconut':return {kind,path:['item','coconut'],key:'coconut',q:100};
  default:return {kind:'fert',path:['item','fertfruitP'],key:'fertfruitP',q:100};
 }
}
const hwHave=(game,k)=>{const n=Number(game.bag?.halloween?.[k]);return Number.isFinite(n)&&n>0?Math.floor(n):0;};
const fail=m=>{throw new Error(m);};
export function marketAction(account,world,ctx,input,rng=Math.random){
 const game=structuredClone(account);game.sub ||= {};const market=game.sub.market ||= {lots:[],divGot:{}};market.lots ||= [];market.divGot ||= {};game.bag ||= {};game.bag.wine ||= {};
 const config=structuredClone(world||{news:[],modes:[]});config.news ||= [];config.modes ||= [];const maths=marketMath(config),tick=Math.floor(ctx.now/TICK),day=Math.floor((ctx.now+7*3600000)/DAY),at=day*DAY+13*3600000;let dividend=0;
 if(ctx.now>=at&&!market.divGot[day]){const i=Math.floor(maths.h32(maths.daySeed(day),55,1)*6),h=market.lots.filter(l=>l.i===i&&l.t<=at).reduce((a,l)=>a+l.q,0),per=Math.round(maths.price(i,Math.floor(at/TICK))*.03);dividend=h*per;game.merit=(game.merit||0)+dividend;market.divGot={[day]:true};}
 const price=i=>maths.price(i,tick),result=()=>({game,config,dividend});
 if(input.type==='status'||input.type==='dividend')return result();
 if(input.type==='buy'){
 const i=input.stock,q=input.qty;if(!Number.isInteger(i)||i<0||i>=ST.length||!Number.isInteger(q)||q<1||q>100)fail('หุ้นหรือจำนวนไม่ถูกต้อง');if(market.lots.filter(l=>l.i===i).reduce((a,l)=>a+l.q,0)+q>100)fail('ถือได้ไม่เกิน 100 หุ้นต่อชนิด');const pr=price(i),cost=Math.round(pr*q)+Math.round(pr*q*.02);if((game.merit||0)<cost)fail('กุศลไม่พอ');game.merit-=cost;
 const batch=Math.floor(ctx.now/DAY),lot=market.lots.find(l=>l.i===i&&l.day===batch&&l.t+DAY>ctx.now);if(lot){lot.q+=q;lot.cost+=pr*q;lot.t=ctx.now;}else market.lots.push({i,q,cost:pr*q,t:ctx.now,day:batch});return result();
 }
 if(input.type==='sell'){
 const ix=input.index;if(!Number.isInteger(ix)||!market.lots[ix])fail('ไม่พบหุ้นก้อนนี้');const l=market.lots[ix];if(input.boughtAt!==l.t)fail('พอร์ตเปลี่ยนแล้ว กรุณาตรวจสอบใหม่');if(ctx.now<l.t+DAY)fail('ยังถือไม่ครบ 24 ชั่วโมง');game.merit=(game.merit||0)+Math.round(price(l.i)*l.q*.98);market.lots.splice(ix,1);return result();
 }
 if(input.type==='wine'){
 const w=WINES.find(w=>w[0]===input.wine);if(!w||(game.bag.wine[w[0]]||0)<1)fail('ไม่มีไวน์นี้');game.bag.wine[w[0]]--;game.merit=(game.merit||0)+Math.round(w[2]*(1+Math.min(.2,Math.max(0,price(3)/ST[3].b-1))));return result();
 }
 /* fix20: ขายไวน์จากกระเป๋า (80% ของราคาตลาดสวน) · ขายสัตว์ทีละหลายตัว · ใบเสนอราคา */
 const wineEach=w=>Math.round(w[2]*(1+Math.min(.2,Math.max(0,price(3)/ST[3].b-1))));
 if(input.type==='bag-quote')return {...result(),extra:{wineQuote:Object.fromEntries(WINES.map(w=>[w[0],Math.round(wineEach(w)*WINE_BAG_RATE)])),petBonusLeft:petBonusLeft(ctx.x17,ctx.now)}};
 if(input.type==='wine-bag'){
 const w=WINES.find(w=>w[0]===input.wine),have=w?Math.max(0,Math.floor(Number(game.bag.wine[w[0]])||0)):0,q=input.qty==='all'?have:input.qty;
 if(!w)fail('ไม่มีไวน์นี้');if(!Number.isSafeInteger(q)||q<1||q>100000)fail('จำนวนไม่ถูกต้อง');if(have<q)fail('ไวน์ไม่พอขาย ('+have+')');
 const each=Math.round(wineEach(w)*WINE_BAG_RATE);game.bag.wine[w[0]]=have-q;game.merit=(game.merit||0)+each*q;
 return {...result(),extra:{wineSold:{wine:w[0],qty:q,each,total:each*q}}};
 }
 if(input.type==='pet-sell'){if(!ctx.x17||typeof ctx.x17!=='object')fail('ระบบยังไม่พร้อม');const petSold=petSell(game,ctx.x17,input,ctx.now,rng);return {...result(),extra:{petSold}};}
 if(input.type==='hw-sell'){
 const k=input.item,q=input.qty;if(!HW_ITEMS.some(x=>x[0]===k)||!Number.isInteger(q)||q<1||q>9999)fail('ของหรือจำนวนไม่ถูกต้อง');
 if(hwHave(game,k)<q)fail('ของไม่พอขาย');const each=hwPrice(k,ctx.now);game.bag.halloween[k]=hwHave(game,k)-q;game.merit=(game.merit||0)+each*q;
 return {...result(),sold:{item:k,qty:q,each,total:each*q,haunting:hwHaunting(ctx.now)}};
 }
 if(input.type==='anti-craft'){
 const k=input.k,n=input.qty??1,R=HW_ANTI[k];if(!Number.isInteger(k)||!R||!Number.isInteger(n)||n<1||n>10)fail('น้ำมนต์หรือจำนวนไม่ถูกต้อง');
 const coins=Number.isSafeInteger(ctx.coins)?ctx.coins:0,pestle=Number(game.bag?.item?.pestle)||0;
 const short=[...Object.entries(R.items).filter(([i,q])=>hwHave(game,i)<q*n).map(([i,q])=>HW_ITEMS.find(x=>x[0]===i)[1]+' '+hwHave(game,i)+'/'+q*n),...(pestle<R.pestle*n?['สากกะเบือ '+pestle+'/'+R.pestle*n]:[]),...(coins<R.coin*n?['เหรียญฮาโลวีน '+coins+'/'+R.coin*n]:[])];
 if(short.length)fail('วัตถุดิบไม่พอ: '+short.join(' • '));
 game.bag.halloween ||= {};for(const [i,q] of Object.entries(R.items))game.bag.halloween[i]=hwHave(game,i)-q*n;game.bag.item ||= {};game.bag.item.pestle=pestle-R.pestle*n;
 game.bag.antidote ||= {};game.bag.antidote['a'+k]=antiHave(game,k)+n;
 return {...result(),crafted:{k,qty:n,have:game.bag.antidote['a'+k]},coinsUsed:R.coin*n};
 }
 if(input.type==='poison-throw'){
 // คลาวด์ตรวจเป้า (มีบัญชี อนุมัติแล้ว ไม่ใช่แอดมิน ไม่ใช่ตัวเอง) แล้วเรียกขั้นนี้เพื่อหยิบขวดแรกออกจากคิว
 const q=Array.isArray(market.poison)?market.poison:[];if(!q.length)fail('ไม่มียาพิษที่ต้องสาด');const it=q.shift();market.poison=q;if(q.length)q[0].until=ctx.now+HW_POISON_TIME;
 return {...result(),thrown:{p:it.p,d:HW_POISON[it.p].d,id:it.id}};
 }
 if(input.type==='hw-chest'){
 if(Array.isArray(market.poison)&&market.poison.length)fail('☠️ สาดยาพิษที่ได้ให้เสร็จก่อนนะ');
 const n=input.count??1;if(!Number.isInteger(n)||n<1||n>10)fail('จำนวนหีบไม่ถูกต้อง');
 const short=HW_ITEMS.filter(([k])=>hwHave(game,k)<HW_CHEST_COST*n);if(short.length)fail('ของยังไม่ครบ: '+short.map(([k,nm])=>nm+' '+hwHave(game,k)+'/'+HW_CHEST_COST*n).join(' • '));
 for(const [k] of HW_ITEMS)game.bag.halloween[k]=hwHave(game,k)-HW_CHEST_COST*n;
 const prizes=[];for(let i=0;i<n;i++){const p=hwRollPrize(rng);prizes.push(p);if(p.kind==='poison'){const q=market.poison=Array.isArray(market.poison)?market.poison:[];q.push({p:p.p,id:ctx.now.toString(36)+'-'+i+'-'+Math.floor(rng()*1e6).toString(36),at:ctx.now,until:ctx.now+HW_POISON_TIME});continue;}if(p.merit)game.merit=(game.merit||0)+p.merit;else{const [g,k]=p.path;game.bag[g] ||= {};const cur=Number(game.bag[g][k]);game.bag[g][k]=(Number.isFinite(cur)?cur:0)+p.q;}}
 return {...result(),prizes};
 }
 if(input.type==='news'||input.type==='mode'){
 if(!ctx.admin)fail('เฉพาะแอดมิน');if(input.type==='mode'){if(!maths.MODES[input.mode])fail('รูปแบบตลาดไม่ถูกต้อง');config.modes.push({t:tick+1,m:input.mode});}
 else{const slot=Math.floor(tick/maths.SLOT);if(config.news.some(n=>Math.floor(n.t/maths.SLOT)===slot)||maths.autoNews(slot).t<=tick)fail('รอบข่าวนี้ส่งไปแล้ว');const n=NEWS[input.index];if(!Number.isInteger(input.index)||!n)fail('ข่าวไม่ถูกต้อง');const nw={t:tick,e:n[0],txt:n[1],ef:n[2]};if(n[2].rnd)nw.pick=Math.floor(maths.h32(ctx.now,slot,7)*6);if(n[2].swap){const c=ST.map((_,i)=>price(i)/maths.price(i,tick-96)-1);nw.top=c.indexOf(Math.max(...c));nw.bot=c.indexOf(Math.min(...c));}config.news.push(nw);}
 // Only the latest 35 days influence displayed history. Bound configuration entries.
 config.news=config.news.filter(n=>n.t>=tick-3360).slice(-280);config.modes=config.modes.slice(-128);return result();
 }
 fail('คำสั่งตลาดไม่ถูกต้อง');
}
