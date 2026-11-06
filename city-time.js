/* ซีซั่น 4 · นคร — เวลาไทย ตารางผู้ชาย ฝน (ไม่มีความลับ · ใช้ทั้งหลังบ้านและหน้าเกม ให้ทุกเครื่องเห็นเหมือนกัน) */
export const TH=7*3600000;export const dayOf=now=>Math.floor((now+TH)/86400000);export const hourOf=now=>new Date(now+TH).getUTCHours();export const hourF=now=>new Date(now+TH).getUTCHours()+new Date(now+TH).getUTCMinutes()/60;export const weekOf=now=>Math.floor(dayOf(now)/7);
/* ส่วน ②: fnv เดิมกระจายไม่ดีเมื่อสตริงต่างกันแค่ท้าย (ผู้ชาย 35/40 ได้กะเดียวกัน) → เพิ่มขั้นผสมบิตท้าย (murmur3 fmix) */
export const fnv=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return (h>>>0)/4294967296;};
/* ส่วน ②: 6 แบบกะ (4–8 ชม./กะ) — ทำงาน 8 ชม. พัก 3 ชม. ที่เหลือ 13 ชม. อยู่นอกอาคาร — ทุกชั่วโมงมีคนอยู่ข้างนอกอย่างน้อยครึ่ง (20–27 คน) · 'walk' = อยู่ข้างนอก (เดิน/นั่งสวน/ยืนหน้าที่ทำงาน) · 'work' = อยู่ในอาคาร · 'rest' = หายไป */
export const PATTERNS=[
 [['walk',0,2],['rest',2,5],['walk',5,9],['work',9,13],['walk',13,17],['work',17,21],['walk',21,24]],
 [['rest',0,2],['walk',2,6],['work',6,10],['walk',10,14],['work',14,18],['walk',18,23],['rest',23,24]],
 [['walk',0,3],['rest',3,6],['walk',6,11],['work',11,15],['walk',15,19],['work',19,23],['walk',23,24]],
 [['walk',0,1],['rest',1,4],['walk',4,7],['work',7,11],['walk',11,15],['work',15,19],['walk',19,24]],
 [['walk',0,4],['rest',4,7],['walk',7,13],['work',13,17],['walk',17,20],['work',20,24]],
 [['work',0,3],['walk',3,5],['rest',5,8],['walk',8,10],['work',10,14],['walk',14,24]]];
export function manState(manId,now,world){const d=dayOf(now),h=hourF(now);const pat=PATTERNS[Math.floor(fnv('sch'+d+manId)*PATTERNS.length)];
 const dt=world?.dates?.[manId];if(dt&&dt.until>now)return {st:'date',until:dt.until,with:dt.uid};
 for(const [st,a,b] of pat)if(h>=a&&h<b)return {st,until:now+((b-h)*3600000),next:b};return {st:'rest'};}
export const isRaining=now=>fnv('rain'+dayOf(now)+'-'+Math.floor(hourOf(now)/3))<.25;
