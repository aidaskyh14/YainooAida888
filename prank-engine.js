/* fix15 แกล้งสวนเพื่อน (ทำที่หน้าเยี่ยมสวน) — กติกาล้วน ใช้ทั้งบนคลาวด์และหน้าเว็บ
   คนแกล้งจ่ายของฮาโลวีน · เจ้าของสวนแก้เอง เลือกจ่ายกุศล (ติดลบได้) หรือไม้กวาดแม่มด (ต้องมีพอ) อย่างใดอย่างหนึ่ง
   แกล้งแปลง: แปลงหยุดโต เก็บ/ขโมย/ถอนไม่ได้ จนกว่าเจ้าของจะแก้ (เวลาที่หยุดไปไม่นับ)
   ค้างคาว: สวนมืดทั้งสวน (ทีละ 1) · ป้ายแซว: สูงสุด 20 ป้าย เจ้าของต้องเปิดอ่าน (ค้างคาวบังป้าย)
   หุ่นไล่กา: ไม้กวาด 150 ฟักทอง 30 เทียน 50 ใยแมงมุม 50 กันการแกล้ง 59 นาที (ไม่กันขโมย) · คนหนึ่งแกล้งได้วันละ 30 · สวนหนึ่งโดนได้วันละ 30 · ไม่บอกชื่อคนแกล้ง */
export const PRANKS={
 worm:{n:'ปล่อยหนอน',icon:'🪱',img:'prank-worm',pay:['candy',20],merit:30000,broom:50,plot:true,desc:'หนอนกินผัก แปลงนี้หยุดโตและเก็บไม่ได้'},
 dry:{n:'ดินแห้งแตกระแหง',icon:'🏜️',img:'prank-dry',pay:['candle',15],merit:30000,broom:50,plot:true,desc:'ดินแห้ง ผักหยุดโต'},
 snail:{n:'หอยทากเกาะแปลง',icon:'🐌',img:'prank-snail',pay:['web',15],merit:50000,broom:75,plot:true,desc:'หอยทากเกาะ ผักหยุดโต'},
 pumpkin:{n:'ฟักทองผีขวางแปลง',icon:'🎃',img:'prank-pumpkin',pay:['pumpkin',5],merit:80000,broom:125,plot:true,desc:'ฟักทองผีนั่งทับ เก็บ/ถอนไม่ได้'},
 bat:{n:'ค้างคาวบังสวน',icon:'🦇',img:'prank-bat',pay:['bat',20],merit:50000,broom:75,plot:false,desc:'สวนมืดสนิท ฟ้าผ่าเป็นระยะ'},
 sign:{n:'ปักป้ายแซว',icon:'🪧',img:'prank-sign',pay:['candy',5],merit:15000,broom:25,plot:false,desc:'เจ้าของสวนต้องเปิดอ่าน'}};
export const HW_NAMES={candy:'ลูกอมผี',candle:'เทียนผี',web:'ใยแมงมุม',pumpkin:'ฟักทองแกะสลักเรืองแสง',bat:'ค้างคาวจิ๋ว',broom:'ไม้กวาดแม่มด'};
export const PRANK_MSGS=['ปลูกบ้างนะผักอ่ะเล่นแต่มินิเกม','นอนบ้างนะจ๊ะ จะชนะให้ได้เลยมั้ง','อย่างอแงค่ะ','จุ๊กกรู้วววว มีใครอยู่บ้างไหม ร้างหมดแล้วบ้าน','สวนอะไรดูเหมือนไม่ได้รับการดูแลมานาน','ไม่เลิศ','ว่างๆ ปลูกผักบ้างเด้อ','ซีซั่นนี้ยังเล่นอยู่ไหม ถ้า ไม่ จะได้ไปแจ้งความคนหายสาปสูญ','ป๊าาาาาดนอนดึกเกินไปป๊ะ','เห็นเล่นตลอด แต่แอ๊บ ทำเป็นไม่ค่อยได้เล่น รู้ทันนะ','แหมๆๆ เก่งทุกอย่าง ยกเว้นการปลูกผัก','เติมโปรบ้างนะ จะได้เอาไอเท็มมาปลูกผัก ไม่ใช่เติมแต่โปรเหรียญ'];
export const PRANK_DAY=30,PRANK_GARDEN_DAY=30,SIGN_MAX=20,SCARE_COST={broom:750,pumpkin:150,candle:250,web:250}/* fix19: ×5 (กุศลแก้ ×10 · ไม้กวาด ×5) */,SCARE_TIME=59*60000;
const fail=m=>{throw Object.assign(new Error(m),{code:'failed-precondition'});};
const num=n=>Number.isSafeInteger(Number(n))&&Number(n)>0?Math.floor(Number(n)):0;
export const thaiDay=now=>new Date(now+7*3600000).toISOString().slice(0,10);
export function prankState(game){game.sub ||= {};const s=game.sub.prank ||= {};s.signs=Array.isArray(s.signs)?s.signs:[];if(s.bat&&!s.bat.at)s.bat=null;return s;}
/* คนแกล้ง: actor = เกมคนแกล้ง (จ่ายของ) · target = เกมเจ้าของสวน (ฟาร์มที่เปิด + sub.prank) · own = ตัวนับรายวันของคนแกล้ง */
export function prankAction(actor,target,own,ctx,input){
 const k=input.prank,P=PRANKS[k];if(!P)fail('การแกล้งไม่ถูกต้อง');
 const st=prankState(target),now=ctx.now,day=thaiDay(now);
 if((st.scareUntil||0)>now)fail('🛡️ สวนนี้มีหุ่นไล่กาเฝ้าอยู่ แกล้งไม่ได้');
 if(own.pday!==day){own.pday=day;own.pranks=0;}if(num(own.pranks)>=PRANK_DAY)fail('วันนี้แกล้งครบ '+PRANK_DAY+' ครั้งแล้ว');
 if(st.day?.d!==day)st.day={d:day,n:0};if(num(st.day.n)>=PRANK_GARDEN_DAY)fail('สวนนี้โดนแกล้งครบ '+PRANK_GARDEN_DAY+' ครั้งวันนี้แล้ว');
 const [item,q]=P.pay,have=num(actor.bag?.halloween?.[item]);if(have<q)fail(HW_NAMES[item]+'ไม่พอ ต้องมี '+q);
 let where=null;
 if(P.plot){
  const farm=input.farm??1,arr=target.farms?.[farm]||[],i=input.index;if(!Number.isInteger(i)||i<0||i>=arr.length)fail('แปลงไม่ถูกต้อง');const p=arr[i];
  if(!p||!p.c)fail('แปลงว่าง แกล้งไม่ได้');if(p.pk)fail('แปลงนี้โดนแกล้งอยู่แล้ว');if(p.magicUntil>now)fail('แปลงมีมนต์ดำอยู่');
  p.pk={k,at:now};where={farm,index:i,crop:p.c};
 } else if(k==='bat'){if(st.bat)fail('สวนนี้มีค้างคาวอยู่แล้ว');st.bat={at:now};}
 else {const m=input.msg;if(!Number.isInteger(m)||!PRANK_MSGS[m])fail('เลือกข้อความบนป้าย');if(st.signs.length>=SIGN_MAX)fail('สวนนี้มีป้ายครบ '+SIGN_MAX+' ป้ายแล้ว');st.signs.push({m,at:now});}
 actor.bag.halloween[item]=have-q;own.pranks=num(own.pranks)+1;st.day.n=num(st.day.n)+1;st.last=now;
 return {prank:k,where,paid:{item,q}};
}
/* เจ้าของสวนแก้: how = 'merit' (ติดลบได้) | 'broom' (ต้องมีพอ) */
function pay(game,P,n,how){
 const merit=P.merit*n,broom=P.broom*n;
 if(how==='merit'){game.merit=(Number(game.merit)||0)-merit;return {merit};}
 if(how==='broom'){const have=num(game.bag?.halloween?.broom);if(have<broom)fail('ไม้กวาดแม่มดไม่พอ ต้องมี '+broom+' (มี '+have+')');game.bag.halloween.broom=have-broom;return {broom};}
 fail('เลือกวิธีแก้');
}
const unfreeze=(p,now)=>{const d=Math.max(0,now-(p.pk?.at||now));if(Number.isFinite(p.t))p.t+=d;delete p.pk;};
export function prankFix(game,ctx,input){
 const st=prankState(game),now=ctx.now,kind=input.kind;
 if(kind==='plot'){
  const farm=input.farm??1,arr=game.farms?.[farm]||[],ids=input.all?arr.map((p,i)=>p?.pk?i:-1).filter(i=>i>=0):[input.index];
  if(!ids.length)fail('ไม่มีแปลงที่โดนแกล้ง');const plots=ids.map(i=>{if(!Number.isInteger(i)||!arr[i]?.pk)fail('แปลงนี้ไม่ได้โดนแกล้ง');return arr[i];});
  // จ่ายตามชนิดของแต่ละแปลง
  const out={merit:0,broom:0};const need={};for(const p of plots)need[p.pk.k]=(need[p.pk.k]||0)+1;
  if(input.how==='broom'){const total=Object.entries(need).reduce((a,[k,n])=>a+PRANKS[k].broom*n,0),have=num(game.bag?.halloween?.broom);if(have<total)fail('ไม้กวาดแม่มดไม่พอ ต้องมี '+total+' (มี '+have+')');}
  for(const [k,n]of Object.entries(need)){const r=pay(game,PRANKS[k],n,input.how);out.merit+=r.merit||0;out.broom+=r.broom||0;}
  for(const p of plots)unfreeze(p,now);return {fixed:plots.length,...out};
 }
 if(kind==='bat'){if(!st.bat)fail('ไม่มีค้างคาวแล้ว');const r=pay(game,PRANKS.bat,1,input.how);st.bat=null;return {fixed:1,...r};}
 if(kind==='sign'){
  const ids=input.all?st.signs.map((_,i)=>i):Array.isArray(input.ids)?[...new Set(input.ids)]:[];if(!ids.length||ids.some(i=>!Number.isInteger(i)||!st.signs[i]))fail('เลือกป้ายที่จะถอน');
  const r=pay(game,PRANKS.sign,ids.length,input.how);st.signs=st.signs.filter((_,i)=>!ids.includes(i));return {fixed:ids.length,...r};
 }
 if(kind==='scare'){if((st.scareUntil||0)>now)fail('หุ่นไล่กายังเฝ้าอยู่');const hwb=game.bag?.halloween||{},lack=Object.entries(SCARE_COST).filter(([k,q])=>num(hwb[k])<q).map(([k,q])=>HW_NAMES[k]+' อีก '+(q-num(hwb[k])));if(lack.length)fail('ของไม่พอ: '+lack.join(' · '));for(const[k,q]of Object.entries(SCARE_COST))game.bag.halloween[k]=num(game.bag.halloween[k])-q;st.scareUntil=now+SCARE_TIME;return {scare:st.scareUntil,paid:{...SCARE_COST}};}
 if(kind==='seen'){st.seen=now;return {seen:now};}
 fail('คำสั่งแก้การแกล้งไม่ถูกต้อง');
}
