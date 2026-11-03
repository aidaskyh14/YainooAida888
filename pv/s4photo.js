/* ซีซัน 4: 📸 ถ่ายรูปทั้งพื้นที่ (ซ่อนปุ่มทั้งหมด · ใส่ป้ายชื่อเกมมุมรูป) → บันทึก/แชร์ลงเฟซบุ๊กได้
   ใช้: S4PHOTO.shoot(()=>Promise<dataURL>, {name}) */
(()=>{
 if(window.S4PHOTO)return;
 const st=document.createElement('style');st.textContent=`#s4ph{position:fixed;inset:0;z-index:2147483100;background:rgba(20,12,30,.82);display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px}
#s4ph.on{display:flex}#s4ph img{max-width:100%;max-height:72vh;border-radius:14px;border:4px solid #fff;box-shadow:0 10px 30px rgba(0,0,0,.45);animation:s4phIn .35s cubic-bezier(.2,1.4,.4,1)}
@keyframes s4phIn{from{transform:scale(.8) rotate(-3deg);opacity:0}}
#s4ph .b{display:flex;gap:10px}#s4ph .b button{border:3px solid #fff;border-radius:16px;padding:9px 16px;font:800 12.5px Mali,sans-serif;color:#fff;box-shadow:0 4px 0 rgba(0,0,0,.2);cursor:pointer}#s4ph .cx{position:absolute;top:calc(env(safe-area-inset-top,0px) + 14px);right:14px;width:38px;height:38px;border-radius:50%;border:0;padding:0;background:rgba(255,255,255,.92);box-shadow:0 3px 10px rgba(0,0,0,.3);cursor:pointer}#s4ph .cx::before,#s4ph .cx::after{content:'';position:absolute;left:50%;top:50%;width:16px;height:2.6px;border-radius:2px;background:#6e4b3a;transform:translate(-50%,-50%) rotate(45deg)}#s4ph .cx::after{transform:translate(-50%,-50%) rotate(-45deg)}#s4ph .rt{background:linear-gradient(180deg,#8fd0ff,#3f94e4)}
#s4ph .sv{background:linear-gradient(180deg,#9fe38a,#4bb04a)}#s4ph .x{background:linear-gradient(180deg,#ff9fc0,#e8578a)}#s4ph small{color:#fff;font:700 11px Mali,sans-serif;opacity:.85}
#s4flash{position:fixed;inset:0;z-index:2147483099;background:#fff;opacity:0;pointer-events:none;transition:opacity .35s}
body.s4photo #s4prof,body.s4photo #s4dockR,body.s4photo #s4cam,body.s4photo #s4photoB,body.s4photo #s4dock,body.s4photo .gbar{visibility:hidden!important}`;document.head.appendChild(st);
 const ov=document.createElement('div');ov.id='s4ph';ov.innerHTML='<button class="cx" aria-label="ปิด"></button><img alt="รูปถ่าย"><small>กดค้างที่รูปเพื่อบันทึกลงเครื่องได้ด้วยนะ</small><div class="b"><button class="rt">🔁 ถ่ายใหม่</button><button class="sv">💾 บันทึก / แชร์</button></div>';
 const fl=document.createElement('div');fl.id='s4flash';
 const add=()=>{document.body.append(fl,ov);};if(document.body)add();else document.addEventListener('DOMContentLoaded',add);
 const stamp=(url,name)=>new Promise(res=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
   const s=Math.max(1,im.width/400),t='🌾 ในสวนของยัยหนู ซีซั่น 4'+(name?' · '+name:'');x.font='800 '+Math.round(13*s)+'px Mali,sans-serif';const w=x.measureText(t).width+20*s,h=26*s,X=im.width-w-10*s,Y=im.height-h-10*s;
   x.fillStyle='rgba(48,34,72,.72)';x.beginPath();x.roundRect?x.roundRect(X,Y,w,h,h/2):x.rect(X,Y,w,h);x.fill();x.fillStyle='#fff';x.textBaseline='middle';x.fillText(t,X+10*s,Y+h/2+1);res(c.toDataURL('image/jpeg',.92));};im.onerror=()=>res(url);im.src=url;});
 let cur=null;
 ov.querySelector('.cx').onclick=()=>{ov.classList.remove('on');endMode();};ov.querySelector('.rt').onclick=()=>{ov.classList.remove('on');if(MODE)bar.classList.add('on');};
 ov.querySelector('.sv').onclick=async()=>{if(!cur)return;try{const b=await (await fetch(cur)).blob();const f=new File([b],'yainoo-farm.jpg',{type:'image/jpeg'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'ในสวนของยัยหนู'});return;}}catch(e){}
  const a=document.createElement('a');a.href=cur;a.download='yainoo-farm.jpg';document.body.appendChild(a);a.click();a.remove();};
 /* 📐 เลือกมุมก่อนถ่าย: แถบปุ่มมุมกล้อง + ปุ่มชัตเตอร์ (ฉากยังเห็นเต็มจอ ลาก/ซูมเองได้) */
 const st2=document.createElement('style');st2.textContent=`#s4pm{position:fixed;left:0;right:0;bottom:0;z-index:2147483090;display:none;flex-direction:column;align-items:center;gap:10px;padding:12px 10px calc(env(safe-area-inset-bottom,0px) + 16px);background:linear-gradient(180deg,rgba(20,12,30,0),rgba(20,12,30,.55));pointer-events:none}
#s4pm.on{display:flex}#s4pm .an{display:flex;gap:8px;pointer-events:auto;flex-wrap:wrap;justify-content:center}#s4pm .an button{border:2px solid #fff;border-radius:999px;padding:6px 11px;font:800 11.5px Mali,sans-serif;color:#6e4b3a;background:rgba(255,255,255,.9);box-shadow:0 2px 6px rgba(0,0,0,.25)}#s4pm .an button.on{background:linear-gradient(180deg,#ffd76a,#f39a1e);color:#fff}
#s4pm .sh{display:flex;align-items:center;gap:22px;pointer-events:auto}#s4pm .go{width:66px;height:66px;border-radius:50%;border:5px solid #fff;background:radial-gradient(circle,#fff 52%,#ffd1e0 54%);box-shadow:0 4px 14px rgba(0,0,0,.35)}#s4pm .go:active{transform:scale(.92)}
#s4pm .cx2{width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.92);position:relative;box-shadow:0 3px 10px rgba(0,0,0,.3)}#s4pm .cx2::before,#s4pm .cx2::after{content:'';position:absolute;left:50%;top:50%;width:16px;height:2.6px;border-radius:2px;background:#6e4b3a;transform:translate(-50%,-50%) rotate(45deg)}#s4pm .cx2::after{transform:translate(-50%,-50%) rotate(-45deg)}#s4pm .sp{width:40px}
body.s4pmode #dropCollectVisible,body.s4pmode .toast,body.s4pmode #toast,body.s4pmode .s4pt,body.s4pmode .s4mb,body.s4pmode #s4prof,body.s4pmode #s4dockR,body.s4pmode #s4cam,body.s4pmode #s4photoB,body.s4pmode #s4dock,body.s4pmode .gbar,body.s4pmode #s4ghbar{visibility:hidden!important}`;document.head.appendChild(st2);
 const bar=document.createElement('div');bar.id='s4pm';bar.innerHTML='<div class="an"></div><div class="sh"><button class="cx2" aria-label="ปิด"></button><button class="go" aria-label="ถ่าย"></button><span class="sp"></span></div>';
 const add2=()=>document.body.appendChild(bar);if(document.body)add2();else document.addEventListener('DOMContentLoaded',add2);
 let MODE=null;const endMode=()=>{if(!MODE)return;const m=MODE;MODE=null;bar.classList.remove('on');document.body.classList.remove('s4pmode');try{m.restore&&m.restore();}catch(e){}};
 bar.querySelector('.cx2').onclick=endMode;
 bar.querySelector('.go').onclick=async()=>{if(!MODE)return;bar.classList.remove('on');const m=MODE;await window.S4PHOTO.shoot(m.snap,{name:m.name,keep:1});};
 window.S4PHOTO={mode(m){MODE=m;const an=bar.querySelector('.an');an.innerHTML=(m.presets||[]).map((p,i)=>'<button data-i="'+i+'"'+(i===0?' class="on"':'')+'>'+p[1]+'</button>').join('');
   an.querySelectorAll('button').forEach(b=>b.onclick=()=>{an.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));try{m.set(m.presets[+b.dataset.i][0]);}catch(e){}});
   document.body.classList.add('s4pmode');bar.classList.add('on');try{if(m.presets&&m.presets[0])m.set(m.presets[0][0]);}catch(e){}},
  async shoot(grab,opt={}){document.body.classList.add('s4photo');try{const url=await grab();if(!url)return;fl.style.transition='none';fl.style.opacity='1';requestAnimationFrame(()=>{fl.style.transition='opacity .35s';fl.style.opacity='0';});
   cur=await stamp(url,opt.name);ov.querySelector('img').src=cur;ov.classList.add('on');}finally{document.body.classList.remove('s4photo');}}};
})();
