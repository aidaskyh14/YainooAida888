/* ซีซัน 4: เปิดหน้าโหลดซีซัน 4 (scr-loading.html?ov=1 น้องผึ้งนั่งกระทง โคมลอย พลุ) ทับหน้านี้ — ทุกที่ใช้หน้าโหลดหน้าเดียวกัน
   window.__s4ovMake(base,{p,say}) → {set(p,text),finish()} */
window.__s4ovMake=window.__s4ovMake||((base,o={})=>{const f=document.createElement('iframe');f.title='กำลังโหลด';
 f.src=(base||'')+'scr-loading.html?ov=1&p='+(o.p||0)+(o.say?'&say='+encodeURIComponent(o.say):'');
 f.style.cssText='position:fixed;inset:0;width:100%;height:100%;border:0;z-index:2147480000;background:#120628;transition:opacity .6s';
 (document.body||document.documentElement).appendChild(f);let p=o.p||0,gone=false;const w=()=>{try{return f.contentWindow;}catch(e){return null;}};
 return {set(v,t){if(gone)return;p=Math.max(p,v);try{const x=w();x&&x.__s4set&&x.__s4set(p,t||null);}catch(e){}},
  finish(){if(gone)return;gone=true;try{const x=w();x&&x.__s4set&&x.__s4set(100);x&&x.__s4done&&x.__s4done();}catch(e){}setTimeout(()=>{f.style.opacity='0';setTimeout(()=>f.remove(),700);},1000);},get gone(){return gone;}};});
