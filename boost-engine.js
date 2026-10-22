/* fix15 ไอเทมบูสต์ 3 ชิ้น: ใช้ครั้งละ 1 ชิ้น · fix17: ไม่จำกัดจำนวนครั้งต่อวัน (ยังนับไว้ดูสถิติ) · ลด 30% (เหยื่อวิเศษ: รอปลา 5 นาที)
   bait  = เหยื่อวิเศษ  ลดเวลารอปลากินเบ็ด (บ่อทั่วไปเท่านั้น ไม่ใช่ห้อง VIP)
   lens  = แว่นขยาย     ลดจำนวนวัตถุดิบวิจัยซาฟารี
   gear  = เฟืองเร่ง     ลดเวลาแปรรูปโรงงานอัลปาก้า */
export const BOOST_KINDS=['bait','lens','gear'];
export const BOOST_LIMIT=10,BOOST_CUT=.3;
export const BOOST_NAMES={bait:'เหยื่อวิเศษ',lens:'แว่นขยายนักวิจัย',gear:'เฟืองเร่งเครื่อง'};
export const BOOST_ICONS={bait:'🎣',lens:'🔍',gear:'⚙️'};
export const thaiDay=now=>new Date(now+7*3600000).toISOString().slice(0,10);
const num=n=>Number.isSafeInteger(n)&&n>=0?n:0;
export const boostHave=(game,kind)=>num(game?.bag?.boost?.[kind]);
/* state = ที่เก็บตัวนับของระบบนั้น (เช่น game.sub.safari) · คืนจำนวนที่ใช้ไปแล้ววันนี้ */
export function boostUsed(state,kind,now){const d=thaiDay(now);if(state.boostDay?.day!==d)state.boostDay={day:d,n:{}};return num(state.boostDay.n?.[kind]);}
/* หักไอเทม 1 ชิ้นและนับโควตา · โยน error ถ้าไม่มีของหรือครบโควตา */
export function useBoost(game,state,kind,now){
 if(!BOOST_KINDS.includes(kind))throw Object.assign(new Error('ไอเทมบูสต์ไม่ถูกต้อง'),{code:'invalid-argument'});
 const used=boostUsed(state,kind,now);
 if(boostHave(game,kind)<1)throw Object.assign(new Error('ไม่มี'+BOOST_NAMES[kind]+'ในกระเป๋า'),{code:'failed-precondition'});
 game.bag ||= {};game.bag.boost ||= {};game.bag.boost[kind]=boostHave(game,kind)-1;
 state.boostDay.n ||= {};state.boostDay.n[kind]=used+1;return used+1;
}
export const cut30=q=>Math.max(1,Math.ceil(q*(1-BOOST_CUT)));
