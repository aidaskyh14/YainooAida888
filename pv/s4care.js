/* S4 ข้อ 59 🛁 ฉากดูแล: เริ่มอาบน้ำ/นวด/เอนเตอร์เทน → โชว์ภาพฉากสวย ๆ ~10 วิ แตะปิดได้ · ตัดอิโมจิรัว (เหลือเบา ๆ 1 ใน 4) */
(function(){
 const pet=/scr-catpen/.test(location.pathname)?'cat':/scr-alpaca/.test(location.pathname)?'alpaca':'dog';
 const NAME={bath:'อาบน้ำ',massage:'นวดตัว',music:'เอนเตอร์เทน',feed:'กินอาหาร'};
 let el=null,tm=0;
 window.__careScene=function(k,txt){try{if(el)el.remove();
  el=document.createElement('div');el.id='careScene';el.style.cssText='position:fixed;inset:0;z-index:950;background:rgba(255,245,235,.72);backdrop-filter:blur(3px);display:flex;flex-direction:column;align-items:center;justify-content:center;animation:cfade .35s ease';
  el.innerHTML='<style>@keyframes cfade{from{opacity:0}to{opacity:1}}@keyframes cpop{0%{transform:scale(.6)}70%{transform:scale(1.06)}100%{transform:scale(1)}}#careScene img{width:min(78vw,360px);filter:drop-shadow(0 10px 18px rgba(120,80,40,.35));animation:cpop .5s cubic-bezier(.3,1.4,.5,1)}#careScene b{margin-top:.8rem;font-size:1.05rem;color:#5B3B2A;background:#fff;border:2px solid #F3C4A4;border-radius:999px;padding:.35rem 1rem}#careScene small{margin-top:.5rem;color:#9A7B66}</style>'
   +'<img src="images/care-'+pet+'-'+k+'.webp" alt=""><b>'+(txt||NAME[k]||'')+'</b><small>แตะเพื่อปิด</small>';
  el.onclick=()=>{clearTimeout(tm);el.remove();el=null;};document.body.appendChild(el);
  clearTimeout(tm);tm=setTimeout(()=>{if(el){el.remove();el=null;}},10000);}catch(e){console.error(e);}};
 /* ลดอิโมจิรัว: ห่อ fx ให้ผ่าน 1 ใน 4 เฉพาะอิโมจิดูแล */
 const CARE_FX=new Set(['🫧','💧','💗','💕','💖','🎶','🎵']);
 window.addEventListener('load',()=>{try{if(typeof fx==='function'&&!window.__fxWrapped){const raw=fx;window.fx=function(x,y,e){if(CARE_FX.has(e)&&Math.random()>.25)return;return raw.apply(this,arguments);};window.__fxWrapped=1;}}catch(e){}});
})();
