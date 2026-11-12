/* fix35 🔋 โหมดประหยัด — ตัดสินใจก่อนโหลดฉาก 3D (ไฟล์นี้ต้องมาก่อน module)
   window.S4LITE = true/false · S4LITE_SET(true|false|null) ตั้งค่าเอง (null = อัตโนมัติ) แล้วโหลดหน้าใหม่ */
(function(){
 const LS=k=>{try{return localStorage.getItem(k);}catch(e){return null;}};
 const user=LS('s4lite');/* '1' เปิด · '0' ปิด · ไม่มี = อัตโนมัติ */
 const ua=navigator.userAgent||'';const mem=navigator.deviceMemory||0,cpu=navigator.hardwareConcurrency||0;
 const smallIphone=/iPhone/.test(ua)&&Math.max(screen.width,screen.height)<=736;/* iPhone 8/8+/SE และเก่ากว่า */
 const crashed=LS('s4lite-auto')==='1';/* เคย WebGL หลุด/หน้าพัง */
 const auto=(mem>0&&mem<=3)||(cpu>0&&cpu<=2)||smallIphone||crashed;
 window.S4LITE=user==='1'?true:user==='0'?false:auto;
 window.S4LITE_WHY=user!=null?'ตั้งเอง':crashed?'เคยค้าง':mem&&mem<=3?'แรมน้อย':smallIphone?'มือถือรุ่นเล็ก':cpu&&cpu<=2?'ซีพียูน้อย':'';
 window.S4LITE_SET=v=>{try{if(v===null)localStorage.removeItem('s4lite');else localStorage.setItem('s4lite',v?'1':'0');}catch(e){}};
 /* WebGL หลุด (แรมเต็ม) → ครั้งหน้าเปิดโหมดประหยัดให้เอง */
 addEventListener('webglcontextlost',()=>{try{localStorage.setItem('s4lite-auto','1');}catch(e){}},true);
 /* ปรับตัวคุมเฟรม: โหมดประหยัดวาดไม่เกิน 30 เฟรม/วิ */
 if(window.S4LITE)window.__s4fullFps=30;
 try{if(window.S4LITE)document.documentElement.classList.add('s4lite');}catch(e){}
})();