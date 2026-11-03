/* ซีซัน 4: หน้าโหลดมีหน้าเดียว (หน้าโหลดซีซัน 4 ที่อนุมัติแล้ว: น้องผึ้งนั่งกระทงโยนเหรียญ โคมลอย พลุ)
   เปิดทับทั้งเกมตั้งแต่ 0% จนฉากฟาร์ม 3D พร้อม (100%) — ไม่มีการเปลี่ยนหน้า/เปลี่ยนท่าที่ 70% อีก
   หน้าโหลดจริง (ใต้ภาพนี้) แค่ส่งตัวเลขขึ้นมา · ไม่แตะการบันทึก/กติกา */
(()=>{
 if(window.__s4ld)return;
 let F=null,on=false,lastSrc='',t0=0,hidden=false,p=0;
 const doc=()=>{try{return F&&F.contentWindow;}catch(e){return null;}};
 const api=window.__s4ld={get on(){return on;},
  set:(v,txt)=>{if(!on)return;p=Math.max(p,v);const w=doc();try{w&&w.__s4set&&w.__s4set(p,txt||null);}catch(e){}},
  finish:()=>{if(!on)return;on=false;const f=F;F=null;try{const w=f.contentWindow;w.__s4set&&w.__s4set(100);w.__s4done&&w.__s4done();}catch(e){}
   setTimeout(()=>{f.style.opacity='0';setTimeout(()=>f.remove(),700);},1100);},
  show:()=>{if(on)return;on=true;p=0;t0=Date.now();hidden=false;F=document.createElement('iframe');F.id='s4ldf';F.title='กำลังโหลด';F.src='scr-loading.html?ov=1';
   F.style.cssText='position:fixed;inset:0;width:100%;height:100%;border:0;z-index:2147483000;background:#120628;transition:opacity .6s';document.body.appendChild(F);}};
 const frame=()=>document.getElementById('scr');
 setInterval(()=>{const f=frame();if(!f)return;let s='';try{s=f.getAttribute('src')||'';}catch(e){}
  if(s!==lastSrc){lastSrc=s;
   if(/scr-loading\.html/.test(s))api.show();
   else if(on&&!/^about:blank|scr-farm\.html/.test(s))api.finish();}
  if(!on)return;
  if(Date.now()-t0>150000){api.finish();return;}
  /* 0–70%: ตัวเลขจากหน้าโหลดจริง · ถ้าโหลดพลาด ให้เห็นปุ่มลองใหม่ของหน้าเดิม */
  if(/scr-loading\.html/.test(s)){try{const d=f.contentDocument;if(!d)return;const he=!!d.getElementById('loadError');if(he!==hidden){hidden=he;if(F)F.style.display=he?'none':'';}
    const pc=d.getElementById('pct');if(pc){const v=parseInt(pc.textContent,10);if(v>=0)api.set(v);}}catch(e){}}
 },80);
})();
/* ซีซัน 4: เกมเล่นแนวตั้ง — ถ้าเอียงโทรศัพท์เป็นแนวนอน ขึ้นหน้าน่ารัก "หมุนจอตั้งขึ้นนะ" (iPad/จอใหญ่ไม่ขึ้น) */
(()=>{const st=document.createElement('style');st.textContent='#s4rot{display:none}@media (orientation:landscape) and (max-height:540px){#s4rot{position:fixed;inset:0;z-index:2147483600;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:linear-gradient(180deg,#CFEFFF,#F2FBFF);font:700 15px Mali,sans-serif;color:#6E4B3A}#s4rot i{font-style:normal;font-size:44px;animation:s4rotA 1.6s ease-in-out infinite}@keyframes s4rotA{0%,100%{transform:rotate(-90deg)}50%{transform:rotate(0)}}}';
 document.head.appendChild(st);const el=document.createElement('div');el.id='s4rot';el.innerHTML='<i>📱</i>หมุนจอตั้งขึ้นนะ เกมนี้เล่นแนวตั้ง';const add=()=>document.body.appendChild(el);if(document.body)add();else addEventListener('DOMContentLoaded',add);})();
