/* ซีซั่น 4 · นคร — เวลาไทย ตารางผู้ชาย ฝน (ไม่มีความลับ · ใช้ทั้งหลังบ้านและหน้าเกม ให้ทุกเครื่องเห็นเหมือนกัน) */
export const TH=7*3600000;export const dayOf=now=>Math.floor((now+TH)/86400000);export const hourOf=now=>new Date(now+TH).getUTCHours();export const hourF=now=>new Date(now+TH).getUTCHours()+new Date(now+TH).getUTCMinutes()/60;export const weekOf=now=>Math.floor(dayOf(now)/7);
export const fnv=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)/4294967296;};
/* 4 แบบกะ: ทุกชั่วโมง 6:00–23:00 มีคนเดินเล่นเสมอ · กลางคืนดึก (23–6) ทุกคนพัก */
export const PATTERNS=[
 [['rest',0,8],['walk',8,11],['work',11,15],['walk',15,17],['work',17,20],['walk',20,22],['rest',22,24]],
 [['rest',0,7],['work',7,12],['walk',12,15],['work',15,18],['walk',18,21],['rest',21,24]],
 [['rest',0,9],['work',9,13],['walk',13,16],['rest',16,18],['walk',18,20],['work',20,23],['rest',23,24]],
 [['rest',0,6],['walk',6,9],['work',9,14],['walk',14,17],['work',17,19],['walk',19,23],['rest',23,24]]];
export function manState(manId,now,world){const d=dayOf(now),h=hourF(now);const pat=PATTERNS[Math.floor(fnv('sch'+d+manId)*PATTERNS.length)];
 const dt=world?.dates?.[manId];if(dt&&dt.until>now)return {st:'date',until:dt.until,with:dt.uid};
 for(const [st,a,b] of pat)if(h>=a&&h<b)return {st,until:now+((b-h)*3600000),next:b};return {st:'rest'};}
export const isRaining=now=>fnv('rain'+dayOf(now)+'-'+Math.floor(hourOf(now)/3))<.25;
