/* ซีซัน 4: การจัด/ตกแต่งฟาร์ม 3D บันทึกขึ้นเซิร์ฟเวอร์ (เซฟของผู้เล่นเอง ส่วน module-s4deco-farm)
   เดิมเก็บแค่ในเครื่อง → เปลี่ยนเครื่อง/ล็อกอินใหม่แล้วฟาร์มกลับเป็นค่าเริ่มต้น
   วิธี: ค่า localStorage ที่ขึ้นต้น farm1- ของหน้า 3D นี้ อ่าน/เขียนผ่านเซฟบนคลาวด์แทน (ไม่แตะกระเป๋า/กุศล) */
(()=>{const DS=(document.currentScript&&document.currentScript.dataset)||{};const KEY=DS.key||'s4deco-farm',RE=DS.re?new RegExp(DS.re):/^farm1-(?!roomphoto-)/;/* S4: ใช้ซ้ำได้กับโซนอื่นผ่าน data-key/data-re (ซาฟารี) *//* รูปถ่ายห้อง (ไฟล์ใหญ่) ยังเก็บในเครื่อง */let H=null;
 try{H=(parent.parent&&parent.parent.__HOST)||parent.__HOST||null;}catch(e){H=null;}
 if(!H||typeof H.get!=='function'||typeof H.set!=='function'||window.__SHOW)return;
 let MEM={};try{const v=H.get(KEY);if(v)MEM=JSON.parse(v)||{};}catch(e){console.warn('s4store init err',e&&e.message);MEM={};}
 const P=Storage.prototype,g=P.getItem,s=P.setItem,r=P.removeItem,kf=P.key;
 const isLS=st=>{try{return st===window.localStorage;}catch(e){return false;}};
 let t=0,warned=0;const queue=()=>{clearTimeout(t);t=setTimeout(flush,1200);};
 const CH=32000,CHN={};/* fix36: คีย์ใหญ่แบ่งเป็นชิ้น ชิ้นละ ≤32,000 ตัวอักษร เก็บคนละส่วนเซฟ (KEY#คีย์#ลำดับ) · ส่วนเซฟละ ≤128KB แน่นอน */
 function flush(){clearTimeout(t);try{backup();const small={},big=[];for(const [kk,v] of Object.entries(MEM)){const sv=String(v);if(sv.length>CH)big.push([kk,sv]);else small[kk]=sv;}
  for(const [kk,sv] of big){const parts=[];for(let i=0;i<sv.length;i+=CH)parts.push(sv.slice(i,i+CH));small[kk]={$chunks:parts.length};parts.forEach((p,i)=>H.set(KEY+'#'+kk+'#'+(i+1),p));const prev=CHN[kk]||0;for(let i=parts.length+1;i<=prev;i++){try{H.del&&H.del(KEY+'#'+kk+'#'+i);}catch(e){}}CHN[kk]=parts.length;}
  for(const kk of Object.keys(CHN))if(!big.some(([k])=>k===kk)){for(let i=1;i<=CHN[kk];i++){try{H.del&&H.del(KEY+'#'+kk+'#'+i);}catch(e){}}delete CHN[kk];}
  H.set(KEY,JSON.stringify(small));if(big.length&&!window.__s4chunked){window.__s4chunked=1;console.log('s4store: แบ่งเลย์เอาต์ใหญ่เป็นชิ้น',big.map(([k,v])=>k+':'+v.length).join(' '));}}catch(e){console.warn('s4store',e&&e.message);}}
 /* fix36: อ่านคีย์ที่ถูกแบ่งชิ้นกลับมาต่อกัน (ถ้าชิ้นหาย ใช้สำรองในเครื่อง) */
 try{for(const [kk,v] of Object.entries(MEM)){if(v&&typeof v==='object'&&v.$chunks>0){let out='',okc=true;for(let i=1;i<=v.$chunks;i++){const p=H.get(KEY+'#'+kk+'#'+i);if(typeof p!=='string'){okc=false;break;}out+=p;}if(okc){MEM[kk]=out;CHN[kk]=v.$chunks;}else{let bk=null;try{bk=JSON.parse(g.call(window.localStorage,'s4bak:'+KEY)||'null');}catch(e){}if(bk&&typeof bk[kk]==='string'){console.warn('s4store: ชิ้นเลย์เอาต์หาย ใช้สำรองในเครื่อง',kk);MEM[kk]=bk[kk];}else{console.warn('s4store: ชิ้นเลย์เอาต์หายและไม่มีสำรอง',kk);delete MEM[kk];}}}}}catch(e){console.warn('s4store chunks',e&&e.message);}
 /* ครั้งแรกของบัญชีนี้: เอาฟาร์มที่จัดไว้ในเครื่องนี้ขึ้นเซิร์ฟเวอร์ */
 if(!Object.keys(MEM).length){try{const ls=window.localStorage;for(let i=0;i<ls.length;i++){const kk=kf.call(ls,i);if(kk&&RE.test(kk))MEM[kk]=g.call(ls,kk);}}catch(e){}if(Object.keys(MEM).length)queue();}
 /* เก็บตก (กันฟาร์มหาย): ① สำรองเลย์เอาต์ล่าสุดที่ดีไว้ในเครื่อง ② ถ้าเซิร์ฟเวอร์ให้เลย์เอาต์ว่าง/ไม่มี แต่เครื่องมีสำรอง → ใช้สำรองแล้วส่งกลับขึ้นเซิร์ฟเวอร์ ③ ห้ามเขียนทับด้วยเลย์เอาต์ที่ของหายเกินครึ่งในครั้งเดียว */
 const BK='s4bak:'+KEY,LK=[...Object.keys(MEM),'farm1-layout6','safari-pv-decor-v4'].find(k=>/layout|decor/.test(k)&&RE.test(k))||'farm1-layout6';
 const cnt=v=>{try{const a=JSON.parse(v);if(Array.isArray(a))return a.length;if(a&&Array.isArray(a.d))return a.d.length;}catch(e){}return 0;};
 try{const bk=JSON.parse(g.call(window.localStorage,BK)||'null');if(bk&&typeof bk==='object'){const bn=cnt(bk[LK]),mn=cnt(MEM[LK]);if(bn>=10&&mn<bn*.5){console.warn('s4store: ใช้สำรองในเครื่อง',mn,'→',bn);MEM=bk;queue();window.__s4restored=bn;}}}catch(e){}
 const backup=()=>{try{if(cnt(MEM[LK])>=10)s.call(window.localStorage,BK,JSON.stringify(MEM));}catch(e){}};backup();
 P.getItem=function(kk){if(isLS(this)&&RE.test(kk))return Object.prototype.hasOwnProperty.call(MEM,kk)?MEM[kk]:null;return g.call(this,kk);};
 const crit=v=>{const c={pen:0,gh:0,house:0};try{const a=JSON.parse(v);const rows=Array.isArray(a)?a:(a&&Array.isArray(a.d)?a.d:[]);for(const r of rows){const t=Array.isArray(r)?r[0]:(r&&r.t);if(typeof t!=='string')continue;if(/^pen/.test(t))c.pen++;else if(t==='ghouse')c.gh++;else if(t==='house')c.house++;}}catch(e){}return c;};/* fix29 */
 let BLK=null;/* fix36: กันครั้งแรก + บอก · จัดแบบเดิมต่อเนื่อง (จำนวนเท่าเดิม ≥3 ครั้ง ห่าง ≥6 วิ) = ตั้งใจ → ยอมบันทึก */const confirmDrop=(o,n)=>{const now=Date.now();if(BLK&&Math.abs(BLK.n-n)<=Math.max(2,n*.05)){if(now-BLK.at>=6000){BLK.times++;BLK.at=now;}if(BLK.times>=3){console.warn('s4store: ยอมบันทึกตามที่จัดใหม่ (ยืนยันซ้ำ)',o,'→',n);BLK=null;return true;}return false;}BLK={n,at:now,times:1};try{(typeof toast==='function'?toast:(parent&&parent.toast))('🛡️ ระบบกันของหาย: ของในสวนลดจาก '+o+' เหลือ '+n+' ชิ้น ยังไม่บันทึก · ถ้าตั้งใจเก็บเข้ากระเป๋าเอง เล่นต่อได้ปกติ ระบบจะบันทึกให้ในอีกครู่',1);}catch(e){}return false;};
 P.setItem=function(kk,v){if(isLS(this)&&RE.test(kk)){const sv=String(v);if(kk===LK){const o=cnt(MEM[kk]),n=cnt(sv);if(o>=15&&n<o*.6&&!confirmDrop(o,n)){console.warn('s4store: ไม่บันทึก ของหายเกินครึ่ง',o,'→',n);window.__s4blocked=(window.__s4blocked||0)+1;return;}/* fix29: คอกทั้งหมด/กรีนเฮาส์/บ้าน หายพร้อมกันในครั้งเดียว = หน้าค้าง ไม่ใช่ผู้เล่นทำ */const oc=crit(MEM[kk]),nc=crit(sv);if((oc.pen>=3&&nc.pen===0)||(oc.gh>=1&&nc.gh===0&&oc.pen>0&&nc.pen<oc.pen)||(oc.house>=1&&nc.house===0)){console.warn('s4store fix29: ไม่บันทึก คอก/กรีนเฮาส์/บ้านหายยกชุด',oc,'→',nc);window.__s4blocked=(window.__s4blocked||0)+1;return;}}if(MEM[kk]!==sv){MEM[kk]=sv;queue();}return;}return s.call(this,kk,v);};
 P.removeItem=function(kk){if(isLS(this)&&RE.test(kk)){if(Object.prototype.hasOwnProperty.call(MEM,kk)){delete MEM[kk];queue();}return;}return r.call(this,kk);};
 addEventListener('pagehide',flush);window.__s4storeFlush=flush;window.__s4storeSize=()=>JSON.stringify(MEM).length;
})();
