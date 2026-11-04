/* fix19 🏧 ตู้ ATM กุศล — กติกาล้วน (ใช้ทั้งบนคลาวด์และในหน้าเว็บ)
   · ตู้อยู่หน้าบ้านในสวนแอดมินเท่านั้น · ต้องมี 💳 บัตร ATM กุศล (แอดมินส่งให้เท่านั้น ใช้ได้จนจบซีซั่น)
   · ตั้ง PIN 4 หลักครั้งแรกครั้งเดียว (เก็บแบบแฮชใน privateAtm/{uid} ฝั่งเซิร์ฟเวอร์ ผู้เล่นอ่านไม่ได้) · ผิด 5 ครั้งล็อก 15 นาที
   · fix24: โอนได้ไม่จำกัดครั้ง ไม่จำกัดคน · ครั้งละ 1–100 ล้าน
   · ค่าธรรมเนียม 12% ทุกยอด (คนโอนจ่ายเพิ่ม หายไปจากเกม)
   · โอนแล้วยกเลิกไม่ได้ · กุศลเข้าไปรษณีย์ของคนรับทันที พร้อมใบเสร็จ */
export const ATM_MIN=1000000,ATM_MAX=100000000,ATM_PEOPLE=3,ATM_PER=5,ATM_PIN_TRIES=5,ATM_LOCK=15*60000,ATM_HIST=30;
/* S4 ข้อ 153–155/175: 2 ธนาคาร · บัตรใครบัตรมัน ตู้ใครตู้มัน · บัตร S3 (item.atmcard) ใช้ไม่ได้แล้ว
   · ธนาคารเด่นตามเวลา: ดอกบัวบาน 06–18 / พระจันทร์ยิ้ม 18–06 → เรทแลก +5%
   · ✨ ชั่วโมงทอง: เซิร์ฟเวอร์สุ่ม 1 ธนาคารต่อชั่วโมง → เรทแลก +10% + ค่าธรรมเนียมโอน 10% (ปกติ 12%)
   · ใช้ครบทุก 100 ครั้งต่อธนาคาร (โอน+แลก) → 100,000 กุศลเข้าไปรษณีย์ · โอนได้ 15 ครั้ง/วัน (รวมทุกธนาคาร กี่คนก็ได้) */
export const BANKS={lotus:{n:'ธนาคารดอกบัวบาน',ic:'🪷',card:'atmlotus',cardName:'บัตรดอกบัวบาน',h0:6,h1:18},moon:{n:'ธนาคารพระจันทร์ยิ้ม',ic:'🌙',card:'atmmoon',cardName:'บัตรพระจันทร์ยิ้ม',h0:18,h1:6}};
export const ATM_CARD='atmcard';/* S3 (เลิกใช้) */
export const ATM_PER_DAY=15,ATM_BONUS_EVERY=100,ATM_BONUS=100000;
export const ATM_FEE=.12,ATM_FEE_GOLD=.10;
export const thaiHour=now=>new Date(now+7*3600000).getUTCHours();
export const bankOk=b=>b==='lotus'||b==='moon';
export const bankPrime=now=>{const h=thaiHour(now);return h>=6&&h<18?'lotus':'moon';};
export const bankGold=now=>fxHash('atm-gold|'+fxHour(now))%2?'moon':'lotus';
export const bankBonus=(bank,now)=>(bankPrime(now)===bank?5:0)+(bankGold(now)===bank?10:0);
export const atmFeeRate=(bank,now)=>bankGold(now)===bank?ATM_FEE_GOLD:ATM_FEE;
export const atmFee=(a,bank,now)=>Math.round(a*atmFeeRate(bank,now));
export const atmDay=now=>new Date(now+7*3600000).toISOString().slice(0,10);
export const atmHasCard=(game,bank)=>(Number(game?.bag?.item?.[BANKS[bank]?.card])||0)>0;
export const atmUses=(priv,bank)=>Number(priv?.use?.[bank])||0;
/* นับการใช้ตู้ (โอน/แลก) ต่อธนาคาร · คืน true เมื่อครบรอบ 100 */
export function atmUse(priv,bank){priv.use=priv.use&&typeof priv.use==='object'?priv.use:{};priv.use[bank]=(Number(priv.use[bank])||0)+1;return priv.use[bank]%ATM_BONUS_EVERY===0;}
export const atmSentN=(priv,now)=>{const t=atmToday(priv,now);return Object.values(t).reduce((a,b)=>a+(Number(b)||0),0);};
const fail=m=>{throw Object.assign(new Error(m),{code:'failed-precondition'});};
/* สถานะรายวันใน privateAtm: {day, sent:{uid:n}} */
export function atmToday(priv,now){const d=atmDay(now);return priv?.day===d&&priv.sent&&typeof priv.sent==='object'?priv.sent:{};}
export function atmCanSend(priv,to,now){return atmSentN(priv,now)>=ATM_PER_DAY?'วันนี้โอนครบ '+ATM_PER_DAY+' ครั้งแล้ว (รวมทุกธนาคาร) พรุ่งนี้โอนได้ใหม่':null;}
export function atmCheckAmount(a,merit,bank,now){
 if(!Number.isSafeInteger(a)||a<ATM_MIN||a>ATM_MAX)fail('โอนได้ครั้งละ 1,000,000–100,000,000 กุศล');
 const fee=atmFee(a,bank,now),total=a+fee;if((Number(merit)||0)<total)fail('กุศลไม่พอ (ต้องมี '+total.toLocaleString('en-US')+' รวมค่าธรรมเนียม)');
 return {fee,total,rate:atmFeeRate(bank,now)};}
/* แฮช PIN (เซิร์ฟเวอร์ส่ง hash ฟังก์ชันจริงเข้ามา) */
export function atmPinOk(pin){return typeof pin==='string'&&/^\d{4}$/.test(pin);}
export function atmCheckPin(priv,pin,now,hash){
 if(!priv?.pin)fail('ยังไม่ได้ตั้งรหัส PIN');
 if((priv.lockUntil||0)>now)fail('ใส่ PIN ผิดหลายครั้ง ตู้ล็อกบัตรไว้ '+Math.ceil((priv.lockUntil-now)/60000)+' นาที');
 if(!atmPinOk(pin)||hash(priv.salt+':'+pin)!==priv.pin){priv.fails=(priv.fails||0)+1;if(priv.fails>=ATM_PIN_TRIES){priv.fails=0;priv.lockUntil=now+ATM_LOCK;}return false;}
 priv.fails=0;return true;}
export function atmRecord(priv,now,to){const d=atmDay(now);if(priv.day!==d){priv.day=d;priv.sent={};}priv.sent[to]=(priv.sent[to]||0)+1;}
export function atmPushHist(priv,row){priv.hist=[row,...(Array.isArray(priv.hist)?priv.hist:[])].slice(0,ATM_HIST);}
/* fix19 💱 แลกเงิน: เหรียญกระทงทอง 1 + กระทงทอง 1 = กุศลตามเรท (ทศนิยม 2 ตำแหน่ง) · เรทเปลี่ยนทุกชั่วโมงไทย ทุกคนเห็นเท่ากัน
   · ปกติ 13,000–18,000 · 🏮 18:00–22:00 18,000–25,000 · fix24: แลกได้ไม่จำกัด ไม่มีค่าธรรมเนียม · กุศลเข้าไปรษณีย์ (ยอด = ชุด × เรท ปัดเศษทิ้ง) */
export const FX_PER_DAY=1e9,FX_MAX=100000000;
const fxHash=s=>{let h=2166136261>>>0;for(const c of String(s)){h^=c.codePointAt(0);h=Math.imul(h,16777619)>>>0;}h^=h>>>13;h=Math.imul(h,0x5bd1e995)>>>0;h^=h>>>15;return h>>>0;};
export const fxHour=now=>Math.floor((now+7*3600000)/3600000);
export const fxHaunt=now=>{const h=new Date(now+7*3600000).getUTCHours();return h>=18&&h<22;};
/* เรทเป็นหน่วย "สตางค์" (×100) เป็นจำนวนเต็ม กันทศนิยมคลาดเคลื่อน */
export function fxBaseCents(now){const hour=fxHour(now),[lo,hi]=fxHaunt(now)?[1800000,2500000]:[1300000,1800000];return lo+fxHash('atm-fx|'+hour)%(hi-lo+1);}
/* เรทของธนาคาร = เรทกลาง × (100+โบนัส)% (โบนัส: เด่นตามเวลา +5 · ชั่วโมงทอง +10) */
export function fxRateCents(now,bank){const b=fxBaseCents(now);return bank?Math.round(b*(100+bankBonus(bank,now))/100):b;}
export const fxRate=(now,bank)=>fxRateCents(now,bank)/100;
export const fxPay=(n,now,bank)=>Math.floor(n*fxRateCents(now,bank)/100);
export function fxToday(priv,now){return priv?.fxDay===atmDay(now)?Number(priv.fxN)||0:0;}
export function fxCheck(n,coins,cauldron,priv,now){
 if(!Number.isSafeInteger(n)||n<1||n>FX_MAX)fail('แลกได้ครั้งละ 1–'+FX_MAX.toLocaleString('en-US')+' ชุด');
 if(fxToday(priv,now)>=FX_PER_DAY)fail('วันนี้แลกครบ '+FX_PER_DAY+' ครั้งแล้ว');
 if((Number(coins)||0)<n)fail('เหรียญกระทงทองไม่พอ (มี '+(Number(coins)||0).toLocaleString('en-US')+')');
 if((Number(cauldron)||0)<n)fail('กระทงทองไม่พอ (มี '+(Number(cauldron)||0).toLocaleString('en-US')+')');}
export function fxRecord(priv,now){const d=atmDay(now);if(priv.fxDay!==d){priv.fxDay=d;priv.fxN=0;}priv.fxN=(priv.fxN||0)+1;}
