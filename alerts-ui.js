/* fix15f แจ้งเตือนทุกหน้า (เปลือกเกม ไม่ใช่ในฉาก)
   · ยาพิษ: players/{uid}/gameViews/poison = {hits:[{id,k,d,at}]} → แถบเด้งจากด้านบน หายเองใน 45 วินาที ไม่บอกชื่อคนสาด
   · นางเงือก: players/{uid}/gameViews/mermaid = {round,active,earn,check:{n,at,until},dismiss:[{boat,until,crew}],notice}
     เช็กอิน (ตอบใน 5 นาที) · เลือกคนจ้างออกเส้น 350 · ประกาศรับตำแหน่ง/ตัวปลอม/ค่าประกอบวิชาชีพ
   อ่านเอกสารของตัวเองเท่านั้น (กฎ gameViews เดิม) · ทุกการกดส่งผ่านคลาวด์ */
const POISON=[['ยาพิษฟักทอง','#A6E22E'],['ยาพิษค้างคาว','#FFA33A'],['ยาพิษหัวกะโหลก','#B66CFF'],['ยาพิษปีศาจแดง','#FF3A55']];
const CSS=`
.ax-wrap{position:fixed;z-index:9000;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 10px);display:grid;justify-items:center;gap:8px;pointer-events:none;font-family:'Mali',system-ui,sans-serif}
.ax-card{pointer-events:auto;width:min(calc(100vw - 32px),22rem);box-sizing:border-box;background:#FFFBF5;color:#6E4B3A;border:3px solid #fff;border-radius:1.3rem;padding:.75rem .85rem .85rem;position:relative;overflow:hidden;box-shadow:0 0 0 3px var(--glow,#C79BFF),0 0 26px var(--glow,#C79BFF),0 12px 28px rgba(0,0,0,.45);animation:axin .55s cubic-bezier(.2,1.5,.4,1) both}
.ax-card.out{animation:axout .35s ease-in forwards}
@keyframes axin{0%{transform:translateY(-140%) scale(.85)}100%{transform:none}}
@keyframes axout{to{transform:translateY(-150%);opacity:0}}
.ax-row{display:grid;grid-template-columns:4rem 1fr;gap:.65rem;align-items:center}
.ax-row img{width:100%;filter:drop-shadow(0 0 10px var(--glow,#fff))}
.ax-card h3{margin:0;font-family:'Itim','Mali',sans-serif;font-weight:400;font-size:1.2rem;line-height:1.25}
.ax-card p{margin:.15rem 0 0;font-size:.78rem;color:#9A7A68;line-height:1.45}
.ax-card .d{font-weight:800;font-size:1.05rem;color:#D2506A}
.ax-card .cd{font-weight:800;font-variant-numeric:tabular-nums;color:#7A2FD8}
.ax-btn{display:block;width:100%;margin-top:.6rem;border:0;border-radius:999px;font:800 .9rem 'Mali',sans-serif;padding:.55rem;color:#fff;background:linear-gradient(180deg,#8A4FD0,#5B3687);box-shadow:0 3px 0 #3B2357;cursor:pointer}
.ax-btn.r{background:linear-gradient(180deg,#E8566E,#B02A44);box-shadow:0 3px 0 #6E1428}
.ax-btn.g{background:linear-gradient(180deg,#4FD88A,#1F9A55);box-shadow:0 3px 0 #0A5A2A}
.ax-btn:disabled{opacity:.5}
.ax-btn:focus-visible,.ax-crew button:focus-visible{outline:3px solid #6E4B3A}
.ax-bar{position:absolute;left:0;bottom:0;height:4px;background:var(--glow,#C79BFF);animation:axbar linear forwards}
@keyframes axbar{from{width:100%}to{width:0}}
.ax-crew{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.35rem;margin-top:.5rem;max-height:9.5rem;overflow:auto}
.ax-crew button{border:2px solid #EADBF7;background:#fff;border-radius:.9rem;padding:.4rem .2rem;font:700 .75rem 'Mali',sans-serif;color:#6E4B3A;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ax-crew button.on{border-color:#B02A44;background:#FFF0F3}
.ax-card.bad{background:#FFF4F6}
.ax-card .mm{width:4rem;height:4rem;object-fit:contain}
@media (prefers-reduced-motion:reduce){.ax-card{animation:none}}`;
export function startAlerts({watch,act,now,toast}){
  if(!document.getElementById('axcss')){const st=document.createElement('style');st.id='axcss';st.textContent=CSS;document.head.appendChild(st);}
  const wrap=document.createElement('div');wrap.className='ax-wrap';wrap.setAttribute('aria-live','polite');document.body.appendChild(wrap);
  const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
  const fmt=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cards=new Map();
  function card(id,html,{glow,bad,life}={}){drop(id);const c=document.createElement('div');c.className='ax-card'+(bad?' bad':'');c.setAttribute('role','alert');if(glow)c.style.setProperty('--glow',glow);
    c.innerHTML=html+(life?'<i class="ax-bar" style="animation-duration:'+life+'ms"></i>':'');wrap.appendChild(c);cards.set(id,c);if(life)c._t=setTimeout(()=>drop(id),life);return c;}
  function drop(id){const c=cards.get(id);if(!c)return;cards.delete(id);clearTimeout(c._t);clearInterval(c._i);c.classList.add('out');setTimeout(()=>c.remove(),350);}
  /* ---- ยาพิษ ---- */
  const stopPoison=watch('poison',v=>{const hits=(v?.hits||[]).filter(h=>h&&h.at>now()-864e5);const seen=+ls.get('axPoison')||0,fresh=hits.filter(h=>h.at>seen).sort((a,b)=>a.at-b.at);if(!fresh.length)return;
    ls.set('axPoison',String(fresh[fresh.length-1].at));const last=fresh[fresh.length-1],[n,glow]=POISON[last.k]||POISON[0],tot=fresh.reduce((a,h)=>a+(h.d||0),0);
    const c=card('poison','<div class="ax-row"><img src="images/hw-poison-'+((last.k|0)+1)+'.webp" alt=""><div><h3 style="color:#B02A44">☠️ โดนสาดยาพิษ!</h3><p>'+(fresh.length>1?'มีคนสาดยาพิษใส่คุณ '+fresh.length+' ขวด 🤫':'มีคนสาด'+n+'ใส่คุณ 🤫')+'</p><div class="d">−'+tot.toLocaleString('en-US')+' กุศล</div></div></div><button class="ax-btn r">😭 รับทราบ</button>',{glow,life:45000});
    c.querySelector('button').onclick=()=>drop('poison');});
  /* ---- นางเงือก ---- */
  let mm=null,tCheck=0;const busy=new Set();
  function notice(v){const n=v?.notice;if(!n)return;const key='axMm:'+v.round+':'+n.k+':'+(n.at||n.earn||0);if(ls.get(key))return;ls.set(key,'1');
    if(n.k==='appointed'){const c=card('mmn','<div class="ax-row"><img class="mm" src="images/boat-mm.webp" alt=""><div><h3 style="color:#7A2FD8">🧜‍♀️ คุณได้เป็นนางเงือก!</h3><p>ทำหน้าที่กรรมการการแข่งเรือ ได้ส่วนแบ่งจากคอมโบของทุกคน · คอยตอบเมื่อมีอะไรเด้งขึ้นมานะ</p></div></div><button class="ax-btn">✨ รับทราบ</button>',{glow:'#C79BFF',life:45000});c.querySelector('button').onclick=()=>drop('mmn');}
    if(n.k==='fake'){const c=card('mmn','<div class="ax-row"><img class="mm" src="images/boat-mm.webp" alt="" style="filter:grayscale(1)"><div><h3 style="color:#B02A44">💔 นางเงือกตัวปลอม</h3><p>เธอได้ละเลยจากการเป็นนางเงือก ได้แต่งตั้งนางเงือกคนใหม่แล้ว เสียใจด้วย เธอเป็นนางเงือกตัวปลอม</p></div></div><button class="ax-btn r">😢 รับทราบ</button>',{glow:'#FF8AA0',bad:true,life:45000});c.querySelector('button').onclick=()=>drop('mmn');}
    if(n.k==='paid'&&n.earn>0){const c=card('mmn','<div class="ax-row"><img class="mm" src="images/boat-mm.webp" alt=""><div><h3 style="color:#B8601A">📮 ค่าประกอบวิชาชีพนางเงือก</h3><div class="d" style="color:#B8601A">💰 '+Number(n.earn).toLocaleString('en-US')+' กุศล</div><p>ส่งเข้าไปรษณีย์แล้ว กดรับได้เลย</p></div></div><button class="ax-btn">📮 รับทราบ</button>',{glow:'#FFD86B',life:45000});c.querySelector('button').onclick=()=>drop('mmn');}}
  function checkCard(){const ck=mm?.active&&mm.check;clearTimeout(tCheck);if(!ck){drop('mmc');return;}const t=now();
    if(t<ck.at){drop('mmc');tCheck=setTimeout(checkCard,Math.min(ck.at-t+300,2**31-1));return;}
    if(t>=ck.until+15000||ls.get('axMmOk:'+mm.round+':'+ck.n)){drop('mmc');return;}
    if(cards.has('mmc'))return;
    const c=card('mmc','<div class="ax-row"><img class="mm" src="images/boat-mm.webp" alt=""><div><h3 style="color:#7A2FD8">⏰ เช็กอินนางเงือก</h3><p><b>เธอยังปฏิบัติหน้าที่นางเงือกอยู่ไหม?</b></p><div class="cd">⏱️ <span>'+fmt(ck.until-t)+'</span></div></div></div><button class="ax-btn g">✅ ยังปฏิบัติหน้าที่อยู่</button>',{glow:'#C79BFF'});
    c._i=setInterval(()=>{const l=ck.until-now();c.querySelector('.cd span').textContent=fmt(l);if(l<=-15000)drop('mmc');},500);
    c.querySelector('button').onclick=async e=>{const b=e.currentTarget;b.disabled=true;try{await act('boat',{type:'mmCheck'});ls.set('axMmOk:'+mm.round+':'+ck.n,'1');drop('mmc');toast?.('🧜‍♀️ เช็กอินแล้ว ขอบคุณที่ทำหน้าที่!');}catch(err){b.disabled=false;toast?.(err.message||'ลองใหม่อีกครั้ง');}};}
  function dismissCards(){const list=mm?.active?mm.dismiss||[]:[];const ids=new Set(list.map(d=>'mmd'+d.boat));
    for(const id of [...cards.keys()])if(id.startsWith('mmd')&&!ids.has(id))drop(id);
    for(const d of list){const id='mmd'+d.boat;if(cards.has(id)||busy.has(id))continue;let sel=null;
      const c=card(id,'<div class="ax-row"><img src="images/boat-mm-card.webp" alt=""><div><h3 style="color:#7A2FD8">🧜‍♀️ เรือ '+d.boat+' ถึงเส้น 350</h3><p>เลือกลูกเรือ 1 คนให้จ้างออก</p><div class="cd">⏱️ <span>'+fmt(d.until-now())+'</span></div></div></div><div class="ax-crew">'+(d.crew||[]).map(c=>Array.isArray(c)?c:[c.u,c.n]).map(([u,nm])=>'<button data-u="'+esc(u)+'">'+esc(nm)+'</button>').join('')+'</div><button class="ax-btn r" disabled>🔨 จ้างออก</button>',{glow:'#C79BFF'});
      c._i=setInterval(()=>{c.querySelector('.cd span').textContent=fmt(d.until-now());},500);
      c.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{sel=b.dataset.u;c.querySelectorAll('[data-u]').forEach(x=>x.classList.toggle('on',x===b));const go=c.querySelector('.ax-btn');go.disabled=false;go.textContent='🔨 จ้าง '+b.textContent+' ออก';});
      c.querySelector('.ax-btn').onclick=async e=>{const b=e.currentTarget;if(!sel)return;b.disabled=true;busy.add(id);try{await act('boat',{type:'mmFire',boat:d.boat,uid:sel});drop(id);toast?.('🔨 นางเงือกตัดสินแล้ว!');}catch(err){b.disabled=false;toast?.(err.message||'ลองใหม่อีกครั้ง');}finally{busy.delete(id);}};}}
  const stopMm=watch('mermaid',v=>{mm=v;notice(v);checkCard();dismissCards();});
  return ()=>{stopPoison?.();stopMm?.();clearTimeout(tCheck);for(const id of [...cards.keys()])drop(id);wrap.remove();};
}
