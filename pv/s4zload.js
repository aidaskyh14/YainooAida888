/* ซีซัน 4: หน้าโหลดของทุกโซน 3D = หน้าโหลดซีซัน 4 หน้าเดียวกับตอนเข้าเกม (น้องผึ้งนั่งกระทง โคมลอย พลุ)
   ตัวเลข % อ่านจากแถบโหลดเดิมของโซน · ข้อความ = ชื่อโซน · ปิดเมื่อโซนพร้อม */
(()=>{
 const css=document.createElement('style');css.textContent='#load{visibility:hidden!important}';document.head.appendChild(css);
 /* บอกหน้าแม่ (ทุกชั้น) ว่าหน้านี้ส่ง % เอง */try{let w=window;for(let i=0;i<4&&w!==w.parent;i++){w=w.parent;w.__s4zl=1;}}catch(e){}
 const go=()=>{if(!window.__s4ovMake)return;const txt=()=>{const l=document.getElementById('load');if(!l)return null;const d=l.querySelector('#lt,.t,div:not(.bar)');return d?d.textContent.trim():null;};
  let P=null;try{let w=window;for(let i=0;i<4&&w!==w.parent;i++){w=w.parent;if(w.__s4ld&&w.__s4ld.on){P=w.__s4ld;break;}}}catch(e){P=null;}
  const L=P?{set:(v,t)=>P.set(v,t),finish:()=>P.finish()}:window.__s4ovMake('../',{p:0,say:txt()||''});let p=0,t0=Date.now(),gone=false;
  const iv=setInterval(()=>{const l=document.getElementById('load');let done=!l||!!window.__ready;
   if(l&&!done){const cs=getComputedStyle(l);if(+cs.opacity<.5||l.classList.contains('done')||cs.display==='none')done=true;}
   if(done||Date.now()-t0>90000){clearInterval(iv);if(!gone){gone=true;L.finish();}return;}
   const bi=l.querySelector('.bar i');let v=bi?parseFloat(bi.style.width)||0:0;p=Math.max(p+(95-p)*.012,Math.min(97,v));L.set(p,txt());},120);};
 if(document.body)go();else document.addEventListener('DOMContentLoaded',go);
})();
