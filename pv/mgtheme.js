/* ซีซัน 4: ธีมมินิเกม — ค่าเริ่มต้น 🪷 ลอยกระทง · เลือก 🎃 ฮาโลวีน (รูปชุดเดิมซีซัน 3) ได้ โดยค่าเข้าเกมเดี่ยว ×2 (เซิร์ฟเวอร์คิดเงินเอง)
   เก็บตัวเลือกไว้ในเครื่องผู้เล่น · รูปฮาโลวีนอยู่ที่ images/hw/ ชื่อไฟล์เดิม */
(()=>{
 if(window.MGT)return;
 let hw=false;try{hw=localStorage.getItem('s4mgtheme')==='hw';}catch(e){}
 try{if(!hw&&window.parent!==window&&parent.MGT)hw=!!parent.MGT.hw;}catch(e){}
 const RE=/^(?:\.\.\/)?images\/((?:bs|mole|pk|basket|wg|cf)-[A-Za-z0-9_.-]+\.(?:webp|png|jpg))/;
 window.MGT={hw,
  img:p=>{if(!hw||typeof p!=='string')return p;const m=p.match(RE);return m?p.replace('images/'+m[1],'images/hw/'+m[1]):p;},
  set:v=>{try{localStorage.setItem('s4mgtheme',v?'hw':'lk');}catch(e){}hw=!!v;window.MGT.hw=hw;}};
})();
