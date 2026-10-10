(()=>{
 const kind=document.currentScript?.dataset?.box||document.querySelector('script[data-box]')?.dataset.box||'all',H=parent.__HOST;
 const show=id=>{if(typeof closeAll==='function')closeAll();H.openBoxes(id).catch(e=>{if(typeof toast==='function')toast(e.message,1);else if(typeof ann==='function')ann(e.message,false);});};
 if(kind!=='all'){window.openBox=()=>show(kind);window.openMany=()=>show(kind);return;}
 const old=window.renderBag;if(!old)return;
 window.renderBag=function(){old();if(bagTab!=='box')return;const boxes=(H.boxList?.()||[]).filter(b=>b.count>0);
  const grid=document.getElementById('bagGrid');
  grid.innerHTML=boxes.length?boxes.map(b=>`<button type="button" class="it" data-open-box="${b.id}" style="font:inherit;color:#563c32;background:#fffaf1;border:2px solid #e8ddd0;border-radius:18px;cursor:pointer"><img src="images/${b.image}" alt="" onerror="this.outerHTML='<span style=&quot;font-size:40px&quot;>🎁</span>'"><b>${b.name}</b><span>×${b.count.toLocaleString()}</span><strong style="color:#258a67">เปิดกล่อง</strong></button>`).join(''):'<div class="empty" style="grid-column:1/-1">ยังไม่มีกล่องสุ่ม</div>';
  grid.querySelectorAll('[data-open-box]').forEach(b=>b.onclick=()=>show(b.dataset.openBox));
 };
})();
