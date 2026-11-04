/* ซีซัน 4: การจัด/ตกแต่งฟาร์ม 3D บันทึกขึ้นเซิร์ฟเวอร์ (เซฟของผู้เล่นเอง ส่วน module-s4deco-farm)
   เดิมเก็บแค่ในเครื่อง → เปลี่ยนเครื่อง/ล็อกอินใหม่แล้วฟาร์มกลับเป็นค่าเริ่มต้น
   วิธี: ค่า localStorage ที่ขึ้นต้น farm1- ของหน้า 3D นี้ อ่าน/เขียนผ่านเซฟบนคลาวด์แทน (ไม่แตะกระเป๋า/กุศล) */
(()=>{const DS=(document.currentScript&&document.currentScript.dataset)||{};const KEY=DS.key||'s4deco-farm',RE=DS.re?new RegExp(DS.re):/^farm1-(?!roomphoto-)/;/* S4: ใช้ซ้ำได้กับโซนอื่นผ่าน data-key/data-re (ซาฟารี) *//* รูปถ่ายห้อง (ไฟล์ใหญ่) ยังเก็บในเครื่อง */let H=null;
 try{H=(parent.parent&&parent.parent.__HOST)||parent.__HOST||null;}catch(e){H=null;}
 if(!H||typeof H.get!=='function'||typeof H.set!=='function'||window.__SHOW)return;
 let MEM={};try{const v=H.get(KEY);if(v)MEM=JSON.parse(v)||{};}catch(e){MEM={};}
 const P=Storage.prototype,g=P.getItem,s=P.setItem,r=P.removeItem,kf=P.key;
 const isLS=st=>{try{return st===window.localStorage;}catch(e){return false;}};
 let t=0,warned=0;const queue=()=>{clearTimeout(t);t=setTimeout(flush,1200);};
 function flush(){clearTimeout(t);try{const out=JSON.stringify(MEM);if(new TextEncoder().encode(out).length>126000){if(!warned++)console.warn('s4store: layout too big',out.length);return;}H.set(KEY,out);}catch(e){console.warn('s4store',e&&e.message);}}
 /* ครั้งแรกของบัญชีนี้: เอาฟาร์มที่จัดไว้ในเครื่องนี้ขึ้นเซิร์ฟเวอร์ */
 if(!Object.keys(MEM).length){try{const ls=window.localStorage;for(let i=0;i<ls.length;i++){const kk=kf.call(ls,i);if(kk&&RE.test(kk))MEM[kk]=g.call(ls,kk);}}catch(e){}if(Object.keys(MEM).length)queue();}
 P.getItem=function(kk){if(isLS(this)&&RE.test(kk))return Object.prototype.hasOwnProperty.call(MEM,kk)?MEM[kk]:null;return g.call(this,kk);};
 P.setItem=function(kk,v){if(isLS(this)&&RE.test(kk)){const sv=String(v);if(MEM[kk]!==sv){MEM[kk]=sv;queue();}return;}return s.call(this,kk,v);};
 P.removeItem=function(kk){if(isLS(this)&&RE.test(kk)){if(Object.prototype.hasOwnProperty.call(MEM,kk)){delete MEM[kk];queue();}return;}return r.call(this,kk);};
 addEventListener('pagehide',flush);window.__s4storeFlush=flush;window.__s4storeSize=()=>JSON.stringify(MEM).length;
})();
