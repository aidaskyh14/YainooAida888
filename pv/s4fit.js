/* เก็บตก ข้อ 1 (ซีซัน 4): บนมือถือ เครื่องมือ/ปุ่ม/แถบที่ลอยอยู่บนจอทุกระบบใหญ่เกินไป (iPad พอดีแล้ว)
   → ย่อทุกชิ้นที่ "ลอยบนจอ" (position:fixed) ลง 20% เฉพาะจอกว้าง ≤ 480px · ไม่แตะฉาก/ภาพพื้น/หน้าต่างเต็มจอ/หน้าโหลด
   ใช้ไฟล์เดียวทุกหน้า (หน้าซีซัน 3 ที่ซ่อน · ฟาร์ม 3D · โซน 3D · ซาฟารี · ตกปลา · ชุมชน) */
(()=>{
 if(window.__s4fit)return;window.__s4fit=1;
 const Z=.8;
 const phone=()=>Math.min(innerWidth,innerHeight)<=480&&innerWidth<=480;
 const SKIP=/^(s4ldf|s4ld|s4rot|cloudShield|s4trip|stage|f3d|s3host|s3forest|s3barn|scr|view|toast)$/;
 const fit=()=>{if(!phone()||!document.body)return;const W=innerWidth,H=innerHeight;
  for(const el of document.body.children){if(!(el instanceof HTMLElement)||el.dataset.s4z||SKIP.test(el.id||''))continue;
   const tn=el.tagName;if(tn==='CANVAS'||tn==='IFRAME'||tn==='SCRIPT'||tn==='STYLE'||tn==='LINK')continue;
   const cs=getComputedStyle(el);if(cs.position!=='fixed'&&cs.position!=='absolute')continue;if(cs.display==='none')continue;
   const r=el.getBoundingClientRect();if(!r.width||!r.height)continue;
   if(r.width>=W*.9&&r.height>=H*.9)continue;/* หน้าต่างเต็มจอ/ม่าน: ไม่ย่อ */
   el.dataset.s4z='1';el.style.zoom=String(Z);}};
 /* เก็บตก ข้อ 1: ตัวเลข "0" ที่ไม่มีประโยชน์ (ป้ายจำนวน/วงแดง เช่น ตะกร้าปลา 0) ซ่อน · มีของเมื่อไหร่ค่อยขึ้น */
 const ZERO=/^(0|×0|x0|0\s*(ชิ้น|ตัว|ใบ|อัน))$/;
 const zero=()=>{for(const el of document.querySelectorAll('em,.badge,.cnt,.num,.count,.bd,.pill,.n,.qty')){const t=(el.textContent||'').trim();const z=ZERO.test(t)&&el.children.length===0;if(z&&!el.dataset.s4z0){el.dataset.s4z0='1';el.style.setProperty('display','none','important');}else if(!z&&el.dataset.s4z0){delete el.dataset.s4z0;el.style.removeProperty('display');}}};
 const go=()=>{try{fit();}catch(e){}try{zero();}catch(e){}};
 if(document.body)go();addEventListener('DOMContentLoaded',go);addEventListener('load',go);addEventListener('resize',go);
 setInterval(go,800);
 /* ปุ่ม/แถบที่โผล่ตอนหน้ายังโหลดไม่ถึง 100%: ซ่อนไว้จนหน้าโหลด (s4ldf) หายไป */
 const st=document.createElement('style');st.textContent='body.s4loading>*:not(#s4ldf):not(#scr):not(#s4rot):not(script):not(style){visibility:hidden!important}';
 const add=()=>{document.head.appendChild(st);};if(document.head)add();else addEventListener('DOMContentLoaded',add);
 const inLoad=()=>{const ld=document.getElementById('s4ldf');if(ld&&ld.style.opacity!=='0')return true;
  /* หน้าระบบในกรอบ (#scr) กำลังโหลดฉาก 3D (#s4ld ของหน้านั้น) → ปุ่มของหน้าแม่ (กลับฟาร์ม ฯลฯ) ต้องยังไม่ขึ้น */
  const f=document.getElementById('scr');if(f){try{const d=f.contentDocument;const l=d&&d.getElementById('s4ld');if(l&&getComputedStyle(l).display!=='none'&&+getComputedStyle(l).opacity>.05)return true;}catch(e){}}
  return false;};
 setInterval(()=>{try{document.body.classList.toggle('s4loading',inLoad());}catch(e){}},120);
})();
