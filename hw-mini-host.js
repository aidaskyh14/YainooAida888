/* fix16 เปิดมินิเกมฮาโลวีนทับหน้าสัตว์ (คอกแมว → หาแมวในแก้ว · หลังบ้าน → ร้านซุปแม่มด)
   ระหว่างเปิดเกม หน้าสัตว์ด้านหลัง "หยุดบันทึก" (กันเซฟเก่าทับกุศล/ของที่เซิร์ฟเวอร์เพิ่งเปลี่ยน) · ปิดเกมแล้วโหลดข้อมูลล่าสุดใหม่
   HwMini.mount({game:'cup'|'soup', page:'hw-cup.html', save:()=>save(), load:()=>load(), reload:fresh=>{...}}) */
(function(){
function mount(o){
 const H=parent.__HOST;let fr=null,frozen=null;
 /* หยุดเฉพาะการบันทึกของหน้านี้ (__LS ของหน้าสัตว์) ไม่ไปยุ่งกับ Host ที่ระบบอื่นใช้ร่วม */
 const LS=typeof __LS!=='undefined'?__LS:null;
 function freeze(){if(frozen||!LS)return;frozen={s:LS.setItem,r:LS.removeItem};LS.setItem=function(){};LS.removeItem=function(){};window.__hwOpen=true;}
 function thaw(){window.__hwOpen=false;if(!frozen)return;LS.setItem=frozen.s;LS.removeItem=frozen.r;frozen=null;}
 window.__HWAPI={
  cloud:input=>H.cloud('hwmini',input),
  serverNow:()=>{try{return H.serverNow();}catch(e){return Date.now();}},
  fresh:()=>{const s=o.load()||{};return {merit:Number(s.merit)||0,hw:(s.bag&&s.bag.halloween)||{},item:(s.bag&&s.bag.item)||{}};},
  close:()=>{if(fr){fr.remove();fr=null;}thaw();try{o.reload();}catch(e){}}
 };
 function open(){if(fr)return;try{o.save();}catch(e){}freeze();
  fr=document.createElement('iframe');fr.src=o.page+'?v=ss3-fix23b';fr.title=o.game==='cup'?'หาแมวในแก้ว':'ร้านซุปแม่มด';
  fr.style.cssText='position:fixed;inset:0;width:100%;height:100%;border:0;z-index:2147480000;background:#1E1030';document.body.appendChild(fr);}
 addEventListener('pagehide',thaw);
 return {open};
}
window.HwMini={mount};
})();
