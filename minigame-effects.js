/* Presentation only: no currency, inventory, score or network mutations. */
(()=>{
 const style=document.createElement('style');style.textContent=`
 .mgfx{position:absolute;inset:0;pointer-events:none;z-index:35;overflow:hidden}
 .mgfx-ring{position:absolute;border:3px solid #fff4b8;border-radius:50%;width:8cqw;height:8cqw;transform:translate(-50%,-50%);animation:mg-ring .25s ease-out forwards}
 .mgfx-puff{position:absolute;width:2.4cqw;height:2.4cqw;border-radius:50%;background:var(--color);animation:mg-puff .55s ease-out forwards}
 .mgfx-score{position:absolute;transform:translate(-50%,-50%);font:bold 6cqw Mali,system-ui;text-shadow:0 2px 2px #59417c;color:var(--color);animation:mg-score .95s ease-out forwards;white-space:nowrap}
 .mgfx-flash{position:absolute;width:10cqw;height:10cqw;background:#fff4a4;clip-path:polygon(50% 0,60% 35%,100% 50%,60% 65%,50% 100%,40% 65%,0 50%,40% 35%);animation:mg-flash .13s forwards}
 @keyframes mg-ring{to{opacity:0;scale:1.7}}@keyframes mg-puff{to{translate:var(--dx) var(--dy);opacity:0;scale:.2}}@keyframes mg-score{to{translate:0 -7cqw;opacity:0}}@keyframes mg-flash{to{opacity:0;scale:.4}}
 .mgfx-title{position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);font:bold 12cqw Mali,system-ui;color:#ffe07a;text-shadow:0 1cqw #6b3fa0;animation:mg-title 1.3s forwards}
 @keyframes mg-title{0%{opacity:0;scale:.7}20%,70%{opacity:1;scale:1}100%{opacity:0;scale:1.2}}
 `;document.head.appendChild(style);
 const layer=st=>{let el=st.querySelector('.mgfx');if(!el){el=document.createElement('div');el.className='mgfx';st.appendChild(el);}return el;};
 function add(el,cls,x,y,text,extra=''){const d=document.createElement('div');d.className=cls;d.style.cssText=`left:${x*100}%;top:${y*100}%;${extra}`;d.textContent=text||'';el.appendChild(d);return d;}
 window.miniShotEffect=(st,{x,y,hit,value=0})=>{
  const el=layer(st),group=document.createElement('div');el.appendChild(group);add(group,'mgfx-ring',x,y);add(group,'mgfx-flash',.482,.70);
  if(hit){const colors=value<0?['#5b4a7a','#8f7fb0','#bb9cdd']:['#c9a8ff','#fff3b0','#ffd36e','#e9dcff'];for(let i=0;i<12;i++){const angle=i*Math.PI/6;add(group,'mgfx-puff',hit.x,hit.y,'',`--color:${colors[i%colors.length]};--dx:${Math.cos(angle)*9}cqw;--dy:${Math.sin(angle)*9}cqw`);}add(group,'mgfx-score',hit.x,hit.y,(value>0?'+':'')+Number(value).toLocaleString(),`--color:${value<0?'#ff8a8a':'#ffe07a'}`);}
  setTimeout(()=>group.remove(),1100);
 };
 window.miniTableEffect=(st,title,changes=[])=>{
  const el=layer(st),group=document.createElement('div');el.appendChild(group);add(group,'mgfx-title',.5,.30,title);for(const c of changes)add(group,'mgfx-score',Math.max(.18,Math.min(.82,c.x/100)),c.y/100,(c.amount>0?'+':'')+Number(c.amount).toLocaleString(),`--color:${c.amount<0?'#ff8a8a':'#b9ffe0'}`);setTimeout(()=>group.remove(),1900);
 };
})();
