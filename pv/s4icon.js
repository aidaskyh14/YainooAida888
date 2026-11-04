/* ซีซัน 4: ข้อความแจ้งเตือนทุกอันต้องมีไอคอน
   ถ้าข้อความเด้ง (toast/ann/say/banner) ขึ้นต้นด้วยตัวหนังสือเฉย ๆ และไม่มีรูปประกอบ → เติมอีโมจิให้ตามความหมาย
   ไม่แตะกติกาเกม แค่เปลี่ยนสิ่งที่แสดง */
(()=>{
 if(window.__s4icon)return;window.__s4icon=1;
 const SEL='#toast,#ann,#aTxt,#tTxt,#anntx,#note,#now,#wait,.toast,.banner,.rmtoast,.ann,.s4toast,#s4say';
 const R=[
  [/ไม่สำเร็จ|ผิดพลาด|ล้มเหลว|ลองใหม่|error|ขัดข้อง/i,'⚠️'],
  [/ขโมย/,'🦝'],[/แกล้ง|จอมแสบ|ต้องมนต์|ยาพิษ/,'🎭'],
  [/ไม่ได้|ห้าม|ถูกเตะ|ถูกคัดออก|ปิดอยู่|ยังไม่เปิด/,'🚫'],
  [/ขาย|รายได้|ราคา/,'💰'],[/ซื้อ|ร้าน/,'🛒'],
  [/(^|\s)รอ|รอสัก|รอให้|รอก่อน|ยังไม่ถึง|อีก\s*\d|นาที|ชั่วโมง|วินาที|พักการ|กำลังพัก|พักผ่อน|พักอยู่|ช่วงพัก/,'⏳'],
  [/ไม่พอ|ขาด/,'🧺'],[/เต็มแล้ว|เต็ม/,'📦'],[/ยังไม่มี|ไม่มี|ว่าง/,'🔎'],
  [/กล่อง|สุ่ม/,'🎁'],
  [/เรือ|แข่ง|ทีม|ถาด|เสบียง/,'🚣'],[/ตกปลา|บ่อ|เบ็ด|ปลา/,'🎣'],
  [/ให้อาหาร|อิ่ม|หิว|อาหาร|เมนู|ทำอาหาร/,'🍲'],[/สัตว์|คอก|ป่วย|รักษา|ผลผลิต/,'🐾'],
  [/ปลูก|แปลง|รดน้ำ|ปุ๋ย|เก็บเกี่ยว|ดอกไม้|ผัก/,'🌱'],[/ต้นไม้|ตัดไม้|ไม้|เชือก|หิน|เหล็ก/,'🪵'],
  [/กุศล/,'🙏'],[/กระเป๋า|รับแล้ว|ได้รับ|เก็บได้|เข้ากระเป๋า/,'🎒'],
  [/บันทึก|สำรอง|กู้คืน|คลาวด์/,'💾'],[/จดหมาย|ไปรษณีย์/,'📮'],[/เพื่อน|เยี่ยม/,'👭'],
  [/ชื่อ/,'✏️'],[/แตะ|ลาก|วาง|เลื่อน/,'👆'],[/รูป|ถ่าย/,'📸'],
  [/สำเร็จ|เรียบร้อย|แล้ว/,'✅']];
 const EMO=/^[\s​]*(?:[←-⯿⌀-⏿☀-➿〰〽㊗㊙]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF]|[×+−\-]?\d)/;
 const pick=(t,bad)=>{for(const[r,e]of R)if(r.test(t))return bad&&e==='✅'?'⚠️':e;return bad?'⚠️':'💬';};
 const firstText=el=>{const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.data.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP});return w.nextNode();};
 const fix=el=>{try{if(!el||!el.isConnected)return;if(el.querySelector('img,canvas,svg,.ico,.spr'))return;
   const outer=el.closest('#ann,.ann,.toast');if(outer&&outer!==el&&outer.querySelector('img[src]:not([src=""]),canvas'))return;
   const n=firstText(el);if(!n||EMO.test(n.data))return;const t=el.textContent.trim();if(!/[฀-๿]/.test(t)||t.length<2)return;
   const bad=!!el.closest('.err,.bad,.r,.error');const lead=n.data.match(/^\s*/)[0];n.data=lead+pick(t,bad)+' '+n.data.slice(lead.length);}catch(e){}};
 const q=new Set();let raf=0;const flush=()=>{raf=0;for(const el of q)fix(el);q.clear();};
 const want=node=>{const el=node.nodeType===3?node.parentElement:node;if(!el||!el.closest)return;const m=el.closest(SEL);if(m){q.add(el.matches(SEL)?el:m);if(!raf)raf=requestAnimationFrame(flush);setTimeout(()=>{if(raf)flush();},60);}};
 const start=()=>{new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')want(m.target);else{want(m.target);for(const n of m.addedNodes)if(n.nodeType===1&&n.matches&&n.matches(SEL))q.add(n);}}if(q.size&&!raf)raf=requestAnimationFrame(flush);}).observe(document.documentElement,{subtree:true,childList:true,characterData:true});};
 if(document.documentElement)start();else document.addEventListener('DOMContentLoaded',start);
 window.__s4iconPick=pick;
})();
