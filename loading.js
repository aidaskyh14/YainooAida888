/* หน้าโหลดจริง: เปอร์เซ็นต์นับจากไฟล์และภาพที่โหลดสำเร็จ */
(() => {
  'use strict';
  const q=id=>document.getElementById(id);
  let runId=0;
  const sea=q('sea'), raft=q('raft'), slot=q('raftSlot');
  if(slot && raft) slot.replaceWith(raft);
  function progress(done,total,label) {
    const p=total ? Math.floor(done*100/total) : 0;
    q('fill').style.width=p+'%';q('pct').textContent=p+'%';q('step').textContent=label;
    if(sea)sea.style.height=(20+p*.42)+'%';
  }
  function image(url) {
    return new Promise((resolve,reject)=>{
      const im=new Image();const timer=setTimeout(()=>{im.src='';reject(new Error(url));},20000);
      im.onload=()=>{clearTimeout(timer);resolve();};
      im.onerror=()=>{clearTimeout(timer);reject(new Error(url));};
      im.src=url;
    });
  }
  async function run() {
    const id=++runId;
    q('load').classList.remove('done');
    q('loadError')?.remove();progress(0,1,'🖼️ กำลังเตรียมสวน…');
    try {
      const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),20000);
      let response,html;
      try {
        response=await fetch('scr-farm.html?v=ss3-recovery6',{signal:ctrl.signal});
        if(!response.ok)throw new Error('scr-farm.html');html=await response.text();
      } finally { clearTimeout(timer); }
      const urls=[...new Set([...html.matchAll(/images\/[A-Za-z0-9_.-]+\.(?:webp|png|jpe?g|gif)/g)].map(m=>m[0]))];
      urls.push('images/honey-raft-loading.webp');
      const failures=[];let next=0,done=1;const total=urls.length+1;
      progress(done,total,'🖼️ กำลังโหลดภาพในสวน…');
      await Promise.all(Array.from({length:Math.min(6,urls.length)},async()=>{
        while(next<urls.length && id===runId) {
          const url=urls[next++];
          try { await image(url);done++; } catch(e) { failures.push(url); }
          if(id===runId)progress(done,total,'🖼️ โหลดแล้ว '+done+'/'+total+' ไฟล์');
        }
      }));
      if(id!==runId)return;
      if(failures.length)throw new Error(failures.slice(0,5).join(', '));
      progress(total,total,'✅ พร้อมแล้ว!');
      await new Promise(r=>setTimeout(r,300));
      if(id!==runId)return;
      q('load').classList.add('done');
      await new Promise(r=>setTimeout(r,500));
      if(id===runId)parent.postMessage({go:'farm'},location.origin);
    } catch(e) {
      if(id!==runId)return;
      q('step').textContent='โหลดบางไฟล์ไม่สำเร็จ ลองอีกครั้งได้';
      const box=document.createElement('div');box.id='loadError';box.style.cssText='position:relative;z-index:10;max-width:85vw;text-align:center';
      const text=document.createElement('p');text.style.cssText='font-size:12px;overflow-wrap:anywhere';text.textContent=e.message;
      const button=document.createElement('button');button.textContent='ลองโหลดอีกครั้ง';button.onclick=run;
      button.style.cssText='border:0;border-radius:20px;padding:12px 24px;background:#F6A9BD;color:#6E4B3A;font:inherit';
      box.append(text,button);q('load').append(box);
    }
  }
  run();
})();
