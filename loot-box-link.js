(()=>{
 const kind=document.currentScript?.dataset?.box||'all',H=parent.__HOST;
 const show=()=>{if(typeof closeAll==='function')closeAll();H.openBoxes(kind).catch(e=>{if(typeof ann==='function')ann(e.message,1);});};
 if(kind!=='all'){window.openBox=show;window.openMany=show;return;}
 const fan=document.getElementById('fan');if(!fan)return;
 const button=document.createElement('button');button.innerHTML='<span>🎁</span>กล่องสุ่มทั้งหมด';button.onclick=e=>{e.stopPropagation();show();};fan.appendChild(button);
})();
