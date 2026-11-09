/* fix31 · หน้าต่างถาม/แจ้งแบบสวย แทน confirm()/prompt() สีขาวของเบราว์เซอร์
   ใช้: await s4ask({title,msg,img,ok,cancel,danger}) → true/false · await s4prompt({title,msg,img,value,min,max}) → ตัวเลข/ข้อความ หรือ null
   โหลดได้ทั้งหน้าแม่และหน้าใน iframe (สร้างเองในหน้าที่เรียก) */
(function(){
if(window.s4ask)return;
const css=document.createElement('style');css.textContent=`
#s4askW{position:fixed;inset:0;z-index:99990;display:flex;align-items:center;justify-content:center;background:rgba(20,8,40,.5);animation:s4aIn .2s ease;font-family:inherit}
#s4askW .box{width:min(84vw,340px);border-radius:26px;background:linear-gradient(#fffaf3,#f6e7d6);box-shadow:0 20px 60px rgba(0,0,0,.45),inset 0 0 0 3px #fff;padding:18px 18px 16px;text-align:center;animation:s4aPop .35s cubic-bezier(.2,1.4,.4,1);position:relative;overflow:hidden}
#s4askW .box:before{content:'';position:absolute;left:-30%;top:-60%;width:160%;height:120%;background:radial-gradient(ellipse at 50% 100%,rgba(255,214,160,.55),transparent 60%);pointer-events:none}
#s4askW img{width:96px;height:96px;object-fit:contain;filter:drop-shadow(0 8px 14px rgba(0,0,0,.25));margin:2px auto 6px;display:block;position:relative}
#s4askW .ic{font-size:3rem;line-height:1.1;margin:2px 0 6px;position:relative}
#s4askW h3{margin:0 0 6px;font-size:1.15rem;color:#4a2a3a;position:relative}
#s4askW p{margin:0 0 14px;font-size:.92rem;line-height:1.45;color:#6a4a4a;white-space:pre-line;position:relative}
#s4askW .row{display:flex;gap:10px;position:relative}
#s4askW button{flex:1;border:0;border-radius:999px;padding:12px 10px;font:800 1rem inherit;color:#4a2333;background:linear-gradient(#fff3c4,#e8b64c);box-shadow:0 5px 0 #b9852a,0 8px 18px rgba(0,0,0,.18)}
#s4askW button.gray{background:linear-gradient(#fff,#e6dccb);box-shadow:0 5px 0 #b9a995;color:#6a5a4a}
#s4askW button.danger{background:linear-gradient(#ffb3c6,#ff6f99);color:#fff;box-shadow:0 5px 0 #b03a60}
#s4askW button:active{transform:translateY(3px);box-shadow:none}
#s4askW input{width:100%;box-sizing:border-box;border:2px solid #e2cdb8;border-radius:14px;padding:10px 12px;font:800 1.2rem inherit;text-align:center;margin:0 0 14px;background:#fff;color:#4a2a3a;position:relative}
@keyframes s4aIn{from{opacity:0}}@keyframes s4aPop{from{transform:scale(.6);opacity:0}}`;document.head.appendChild(css);
function show(html){const old=document.getElementById('s4askW');if(old)old.remove();const w=document.createElement('div');w.id='s4askW';w.innerHTML='<div class="box">'+html+'</div>';document.body.appendChild(w);return w;}
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
window.s4ask=function(o){o=o||{};return new Promise(res=>{const w=show((o.img?'<img src="'+esc(o.img)+'" onerror="this.remove()">':o.icon?'<div class="ic">'+o.icon+'</div>':'')+'<h3>'+esc(o.title||'ยืนยัน')+'</h3>'+(o.msg?'<p>'+esc(o.msg)+'</p>':'')+'<div class="row">'+(o.cancel===false?'':'<button class="gray" data-r="0">'+esc(o.cancel||'ยกเลิก')+'</button>')+'<button class="'+(o.danger?'danger':'')+'" data-r="1">'+esc(o.ok||'ตกลง')+'</button></div>');
 w.onclick=e=>{const b=e.target.closest('button');if(!b){if(e.target===w&&o.cancel!==false){w.remove();res(false);}return;}w.remove();res(b.dataset.r==='1');};});};
window.s4prompt=function(o){o=o||{};return new Promise(res=>{const w=show((o.img?'<img src="'+esc(o.img)+'" onerror="this.remove()">':o.icon?'<div class="ic">'+o.icon+'</div>':'')+'<h3>'+esc(o.title||'กรอก')+'</h3>'+(o.msg?'<p>'+esc(o.msg)+'</p>':'')+'<input id="s4askI" type="'+(o.type||'text')+'" inputmode="'+(o.type==='number'?'numeric':'text')+'" value="'+esc(o.value==null?'':o.value)+'"'+(o.min!=null?' min="'+o.min+'"':'')+(o.max!=null?' max="'+o.max+'"':'')+' placeholder="'+esc(o.placeholder||'')+'"><div class="row"><button class="gray" data-r="0">'+esc(o.cancel||'ยกเลิก')+'</button><button data-r="1">'+esc(o.ok||'ตกลง')+'</button></div>');
 const inp=w.querySelector('#s4askI');setTimeout(()=>{try{inp.focus();inp.select();}catch(e){}},50);const done=ok=>{const v=inp.value;w.remove();res(ok?v:null);};inp.onkeydown=e=>{if(e.key==='Enter')done(true);};
 w.onclick=e=>{const b=e.target.closest('button');if(!b)return;done(b.dataset.r==='1');};});};
window.s4note=function(o){o=o||{};return window.s4ask(Object.assign({cancel:false,ok:'โอเค'},o));};
})();
