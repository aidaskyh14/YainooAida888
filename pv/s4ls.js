/* ซีซัน 4 · ตัวกลางเซฟของหน้าซีซัน 3 (scr-farm / scr-house / scr-forest ที่ใช้คีย์ s3all-v1 ร่วมกัน)
   ปัญหาเดิม: แต่ละหน้าถือสำเนา S ทั้งก้อนแล้ว setItem ทับทั้งก้อน → หน้าหนึ่งเซฟ ของอีกหน้าหาย/กลับมา (diag/house.md #2)
   วิธีแก้: setItem(KEY) = อ่านค่าสดจาก HOST ก่อน แล้ว "รวม" เฉพาะที่หน้านี้เปลี่ยนจากสำเนาที่มันอ่านครั้งล่าสุด
     · ช่องตัวเลขใน bag.* (ของในกระเป๋า) และ merit/fuel: ใช้ส่วนต่าง (สด + (ใหม่ − สำเนาเดิม)) → ของไม่หาย/ไม่ซ้ำ
     · ช่องอื่น (plots/barrels/rest/farms/fruit/...): เปลี่ยนเฉพาะช่องที่ค่าต่างจากสำเนาเดิม (ช่องที่หน้านี้ไม่ได้แตะ คงค่าสดไว้)
   หลัง set สำเร็จ สำเนาเดิม = ค่าที่เพิ่งรวม · หน้าอื่นที่เปิดอยู่จะได้รับ postMessage {s4ls:KEY} ให้โหลดใหม่ */
(function(){
 const H=(()=>{try{return parent.__HOST;}catch(e){return null;}})();
 const MERGE_KEYS=new Set(['s3all-v1']);
 const base={};/* สำเนาล่าสุดที่หน้านี้อ่าน ต่อคีย์ */
 const isNum=v=>typeof v==='number'&&isFinite(v);
 const isObj=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const eq=(a,b)=>a===b||JSON.stringify(a)===JSON.stringify(b);
 function mergeBag(live,old,neu){/* ตัวเลขซ้อนกัน: ส่วนต่าง · อย่างอื่น: ของใหม่ถ้าเปลี่ยน */
  const out=isObj(live)?{...live}:{};const keys=new Set([...Object.keys(isObj(old)?old:{}),...Object.keys(isObj(neu)?neu:{})]);
  for(const k of keys){const o=old?old[k]:undefined,n=neu?neu[k]:undefined,l=out[k];
   if(isNum(n)||isNum(o)){const d=(isNum(n)?n:0)-(isNum(o)?o:0);const r=isNum(l)?Math.max(0,l+d):(isNum(n)?n:0);if(r>0)out[k]=r;else delete out[k];}
   else if(isObj(n)||isObj(o)){const m=mergeBag(isObj(l)?l:{},o,n);if(Object.keys(m).length)out[k]=m;else delete out[k];}
   else if(!eq(o,n)){if(n===undefined)delete out[k];else out[k]=n;}}
  return out;}
 function merge(live,old,neu){if(!isObj(live)||!isObj(old))return neu;const out={...live};
  for(const k of new Set([...Object.keys(old),...Object.keys(neu)])){const o=old[k],n=neu[k];
   if(k==='bag'){out.bag=mergeBag(live.bag,o,n);continue;}
   if((k==='merit'||k==='fuel')&&(isNum(n)||isNum(o))){const d=(isNum(n)?n:0)-(isNum(o)?o:0);out[k]=Math.max(0,(isNum(live[k])?live[k]:(isNum(n)?n:0))+(isNum(live[k])?d:0));continue;}
   if(!eq(o,n)){if(n===undefined)delete out[k];else out[k]=n;}}
  return out;}
 const LS={
  getItem:k=>{const v=H?H.get(k):null;if(MERGE_KEYS.has(k)){try{base[k]=v?JSON.parse(v):null;}catch(e){base[k]=null;}}return v;},
  setItem:(k,v)=>{if(!H)return;let out=String(v);
   if(MERGE_KEYS.has(k)){try{const neu=JSON.parse(out),liveS=H.get(k),live=liveS?JSON.parse(liveS):null;if(live&&base[k]){const m=merge(live,base[k],neu);out=JSON.stringify(m);base[k]=m;if(typeof S!=='undefined'&&isObj(S))Object.assign(S,m);}else base[k]=neu;}catch(e){}}
   H.set(k,out);
   if(H.admin){try{const fresh=JSON.parse(H.get(k)||'null');if(fresh&&typeof S!=='undefined')Object.assign(S,fresh);}catch(e){}}
   try{parent.postMessage({s4ls:k,from:location.pathname},'*');}catch(e){}},
  removeItem:k=>{if(H)H.del(k);}};
 /* หน้าอื่นเซฟคีย์เดียวกัน → โหลด S ใหม่ (ถ้าหน้านั้นมี __s4reload) */
 addEventListener('message',e=>{const d=e.data||{};if(d.s4ls&&MERGE_KEYS.has(d.s4ls)&&d.from!==location.pathname){try{window.__s4reload&&window.__s4reload();}catch(err){}}});
 window.__S4LS=LS;window.__S4LS_base=base;
})();
