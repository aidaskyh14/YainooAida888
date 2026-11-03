/* fix17 🏊 ภารกิจว่ายกลับเรือ — นับความคืบหน้าจากผลรายการบนเซิร์ฟเวอร์ (ฟังก์ชันล้วน)
   ภารกิจอยู่ใน players/{uid}.x17.sq = {round,kind,need,got,until,key?,base?,doneAt?}
   · mg   ได้กุศลจากมินิเกม (นับเฉพาะรอบที่ชนะ · ไม่รวมไพ่แคง) 200,000
   · cook คราฟเมนูที่สุ่มให้สำเร็จ 20–50 จาน
   · box  เปิดกล่องสุ่ม 300–500 กล่อง
   · bird เก็บของนกกระจอกเทศ/โดโด้ 40–60 ชิ้น (หน้านกบันทึกจากเครื่อง → เทียบยอดในกระเป๋าตอนกดว่ายกลับ ไม่นับที่นี่) */
export const SWIM_HOOK_SLACK=10*60000;
const sum=o=>Object.values(o||{}).reduce((a,n)=>a+(Number.isFinite(Number(n))?Number(n):0),0);
const at=(g,p)=>{const v=p.split('.').reduce((o,k)=>o?.[k],g);return Number.isFinite(Number(v))?Number(v):0;};
const BOX_PATHS=['bag.item.boxdog','sub.alpaca.bag.box'];
export function swimDelta(sq,system,before,after,response){
  if(sq.kind==='mg'&&system==='minigames'){const won=(response?.rewards||[]).reduce((s,x)=>s+Math.max(0,Number(x?.merit)||0),0);return won+Math.max(0,(Number(after?.merit)||0)-(Number(before?.merit)||0));}
  if(sq.kind==='cook'&&system==='craft'&&typeof sq.key==='string'){const p='bag.'+sq.key;return Math.max(0,at(after,p)-at(before,p));}
  if(sq.kind==='box'&&(system==='boxes'||system==='birdbox')){const total=g=>sum(g?.bag?.box)+sum(g?.bag?.birdbox)+BOX_PATHS.reduce((s,p)=>s+at(g,p),0);return Math.max(0,total(before)-total(after));}
  return 0;
}
/* คืน true เมื่อ x17 เปลี่ยน */
export function swimHook(x17,system,before,after,response,now){
  const sq=x17?.sq;if(!sq||typeof sq!=='object'||sq.kind==='bird'||sq.doneAt||!(now<=Number(sq.until)+SWIM_HOOK_SLACK))return false;
  const d=swimDelta(sq,system,before,after,response);if(!(d>0))return false;
  sq.got=Math.min(Number.MAX_SAFE_INTEGER,(Number(sq.got)||0)+Math.floor(d));if(sq.got>=sq.need)sq.doneAt=now;return true;
}
