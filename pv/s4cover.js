/* ซีซัน 4: ช่วง 70–100% ของหน้าโหลด (รอฉากฟาร์ม 3D วาดเสร็จจริง)
   มาจากหน้าโหลดแรก → ใช้หน้าโหลดตัวเดิมที่หน้าแม่เปิดค้างไว้ (อนิเมชันเดียวต่อเนื่อง ไม่เปลี่ยนที่ 70%)
   เข้าฟาร์มจากหน้าอื่น → เปิดหน้าโหลดซีซัน 4 หน้าเดียวกันเริ่มที่ 70% */
(()=>{
 let P=null;try{P=parent!==window&&parent.__s4ld&&parent.__s4ld.on?parent.__s4ld:null;}catch(e){P=null;}
 let own=null;if(!P&&window.__s4ovMake)own=window.__s4ovMake('',{p:70,say:'🌱 กำลังจัดสวน…'});
 const set=(v,t)=>{if(P)P.set(v,t);else if(own)own.set(v,t);};
 let p=70,t0=Date.now(),done=false,r=0;set(70,'🌱 กำลังจัดสวน…');
 const finish=()=>{if(done)return;done=true;clearInterval(tick);if(P)P.finish();else if(own)own.finish();};
 const tick=setInterval(()=>{let ok=false;try{const w=document.getElementById('f3d')?.contentWindow;ok=!!(w&&w.__ready);}catch(e){}
  if(ok){if(!r)r=Date.now();if(Date.now()-r>700)finish();}
  p+=(97-p)*.035;set(p,'🌱 กำลังจัดสวน…');if(Date.now()-t0>120000)finish();},200);
 window.__s4coverDone=finish;
})();
