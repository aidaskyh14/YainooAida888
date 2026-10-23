/* fix15f แจ้งเตือนทุกหน้า (เปลือกเกม ไม่ใช่ในฉาก)
   · ยาพิษ (fix16): players/{uid}/gameViews/poison = {hits:[{id,k,d,at,st,seen}]} → การ์ดค้างจนกว่าจะเลือก ใช้น้ำมนต์ / รับทราบ · 10 นาที = รับทราบ
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
.ax-pick{display:flex;align-items:center;gap:.5rem;margin-top:.5rem;background:#EAF8F2;border:2px dashed #A9E2CB;border-radius:1rem;padding:.3rem .6rem;font-size:.74rem;color:#2F6A55}
.ax-pick img{width:2.4rem;filter:drop-shadow(0 0 6px #7FE0B8)}
.ax-two{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}.ax-two .ax-btn{margin-top:.5rem}
.ax-btn.all{background:linear-gradient(180deg,#FFB547,#E07B12);box-shadow:0 3px 0 #A5560A;margin-top:.45rem}.ax-card .ax-sum{margin:.25rem 0 0;text-align:center;font-size:.72rem;font-weight:800;color:#6E4B3A}
.ax-tmr{text-align:center;font-size:.68rem!important;margin-top:.4rem!important}
.ax-off{border-color:#FF9DB8!important;background:rgba(120,24,58,.9)!important;box-shadow:0 0 12px rgba(255,90,140,.7)!important}
.ax-swim{position:fixed;z-index:8995;left:max(.35rem,env(safe-area-inset-left,0px));top:calc(env(safe-area-inset-top,0px) + 9.4rem);display:flex;align-items:center;gap:.3rem;flex-wrap:wrap;max-width:11rem;border:1.5px solid #8FD8FF;border-radius:999px;background:rgba(18,52,78,.86);color:#fff;font:700 .64rem 'Mali',sans-serif;padding:.15rem .5rem .15rem .2rem;box-shadow:0 0 10px rgba(143,216,255,.6);cursor:pointer;font-variant-numeric:tabular-nums}
.ax-swim .i{font-size:1rem}.ax-swim .t{color:#BDEBFF}.ax-swim .more{display:none;width:100%;font-weight:600;font-size:.6rem;color:#DDF3FF;padding:.1rem 0 .1rem .2rem}.ax-swim.open{border-radius:1rem}.ax-swim.open .more{display:block}
@media (prefers-reduced-motion:reduce){.ax-card{animation:none}}`;
const ANTI=['น้ำมนต์ดอกมะลิ','น้ำมนต์โบว์ฟ้า','น้ำมนต์ปีกเทวดา','น้ำมนต์นางฟ้า'],DECIDE=10*60000;
export function startAlerts({watch,act,now,toast,game,go,x17,screen}){
  if(!document.getElementById('axcss')){const st=document.createElement('style');st.id='axcss';st.textContent=CSS;document.head.appendChild(st);}
  const wrap=document.createElement('div');wrap.className='ax-wrap';wrap.setAttribute('aria-live','polite');document.body.appendChild(wrap);
  const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
  const fmt=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cards=new Map();
  function card(id,html,{glow,bad,life}={}){drop(id);const c=document.createElement('div');c.className='ax-card'+(bad?' bad':'');c.setAttribute('role','alert');if(glow)c.style.setProperty('--glow',glow);
    c.innerHTML=html+(life?'<i class="ax-bar" style="animation-duration:'+life+'ms"></i>':'');wrap.appendChild(c);cards.set(id,c);if(life)c._t=setTimeout(()=>drop(id),life);return c;}
  function drop(id){const c=cards.get(id);if(!c)return;cards.delete(id);clearTimeout(c._t);clearInterval(c._i);c.classList.add('out');setTimeout(()=>c.remove(),350);}
  /* ---- ยาพิษ (fix16): เด้งค้างจนกว่าจะเลือก ใช้น้ำมนต์คู่กัน หรือ รับทราบ · ไม่เลือกใน 10 นาที = รับทราบอัตโนมัติ ---- */
  const seenAsk=new Set();let pzBusy=false,pzShown=null;
  const antiHave=k=>{try{const n=Number(game?.()?.bag?.antidote?.['a'+k]);return Number.isFinite(n)&&n>0?Math.floor(n):0;}catch(e){return 0;}};
  function pzResult(r){if(!r)return;const [n,glow]=POISON[r.k]||POISON[0];
    if(r.st==='u')card('pzr','<div class="ax-row"><img src="images/anti-'+((r.k|0)+1)+'.webp" alt=""><div><h3 style="color:#2F8F6C">🛡️ ล้างพิษสำเร็จ!</h3><p>'+ANTI[r.k]+' ช่วยไว้ ✨</p><div class="d" style="color:#2F8F6C">กุศลไม่ถูกหัก</div></div></div>',{glow:'#7FE0B8',life:3500});
    else card('pzr','<div class="ax-row"><img src="images/hw-poison-'+((r.k|0)+1)+'.webp" alt=""><div><h3 style="color:#B02A44">😵 โดนพิษเต็ม ๆ</h3><p>'+n+'</p><div class="d">−'+Number(r.lost||0).toLocaleString('en-US')+' กุศล</div></div></div>',{glow,life:3500,bad:true});}
  function pzShow(v){const pend=(v?.hits||[]).filter(h=>h&&h.st==='p').sort((a,b)=>a.at-b.at);
    if(!pend.length){if(cards.has('poison'))drop('poison');pzShown=null;return;}
    const h=pend[0];if(!h.seen&&!seenAsk.has(h.id)){seenAsk.add(h.id);act('market',{type:'poison-seen',id:h.id}).catch(()=>seenAsk.delete(h.id));}
    const key=h.id+'|'+(h.seen||0)+'|'+pend.length+'|'+antiHave(h.k);if(pzShown===key&&cards.has('poison'))return;pzShown=key;
    const [n,glow]=POISON[h.k]||POISON[0],have=antiHave(h.k),until=(h.seen||now())+DECIDE;
    const c=card('poison','<div class="ax-row"><img src="images/hw-poison-'+((h.k|0)+1)+'.webp" alt=""><div><h3 style="color:#B02A44">☠️ โดนสาดยาพิษ!</h3><p>มีคนสาด'+n+'ใส่คุณ 🤫'+(pend.length>1?' · รออีก '+(pend.length-1)+' ขวด':'')+'</p><div class="d">−'+Number(h.d||0).toLocaleString('en-US')+' กุศล</div></div></div>'
      +'<div class="ax-pick"><img src="images/anti-'+((h.k|0)+1)+'.webp" alt=""><span>ใช้ล้างได้: <b>'+ANTI[h.k]+'</b><br>มีอยู่ '+have+' ขวด</span></div>'
      +'<div class="ax-two">'+(have?'<button class="ax-btn g" data-a="use">🛡️ ใช้น้ำมนต์</button>':'<button class="ax-btn" data-a="craft">🧪 ไปคราฟท์</button>')+'<button class="ax-btn r" data-a="ack">😵 รับทราบ</button></div>'
      +(pend.length>1?(()=>{let use=0,lose=0;const left=[0,1,2,3].map(antiHave);for(const x of pend){if(left[x.k]>0){left[x.k]--;use++;}else lose+=Number(x.d||0);}
        return '<button class="ax-btn all" data-a="all">⚡ จัดการทั้งหมด '+pend.length+' ขวด</button><p class="ax-sum">'+(use?'🛡️ ใช้น้ำมนต์ '+use+' ขวด':'')+(use&&lose?' · ':'')+(lose?'😵 หัก −'+lose.toLocaleString('en-US'):'')+'</p>';})():'')
      +'<p class="ax-tmr">⏰ <b class="cd">'+fmt(until-now())+'</b> ไม่เลือกภายในเวลา = หักกุศลอัตโนมัติ</p>',{glow});
    const resolve=async use=>{if(pzBusy)return;pzBusy=true;c.querySelectorAll('button').forEach(b=>b.disabled=true);try{const out=await act('market',{type:'poison-resolve',id:h.id,use});pzShown=null;pzResult(out?.resolved);}catch(err){toast?.(err.message||'ลองใหม่อีกครั้ง');pzShown=null;c.querySelectorAll('button').forEach(b=>b.disabled=false);}finally{pzBusy=false;}};
    const resolveAll=async()=>{if(pzBusy)return;pzBusy=true;c.querySelectorAll('button').forEach(b=>b.disabled=true);try{const out=await act('market',{type:'poison-resolve-all',use:true});pzShown=null;const a=out?.resolved?.all;
      if(a)card('pzr','<div class="ax-row"><img src="images/hw-poison-4.webp" alt=""><div><h3>⚡ จัดการ '+a.n+' ขวดแล้ว</h3>'+(a.used?'<p style="color:#2F8F6C">🛡️ น้ำมนต์ช่วยไว้ '+a.used+' ขวด</p>':'')+(a.lost?'<div class="d">−'+Number(a.lost).toLocaleString('en-US')+' กุศล</div>':'<div class="d" style="color:#2F8F6C">กุศลไม่ถูกหัก</div>')+'</div></div>',{glow:a.lost?'#E5534B':'#7FE0B8',life:3500,bad:!!a.lost});}
      catch(err){toast?.(err.message||'ลองใหม่อีกครั้ง');pzShown=null;c.querySelectorAll('button').forEach(b=>b.disabled=false);}finally{pzBusy=false;}};
    c.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='all')resolveAll();else if(a==='use')resolve(true);else if(a==='ack')resolve(false);else{try{sessionStorage.setItem('ss3OpenHw','1');}catch(e){}go?.('shop');}});
    c._i=setInterval(()=>{const l=until-now(),el=c.querySelector('.ax-tmr .cd');if(el)el.textContent=fmt(l);if(l<=0&&!pzBusy){clearInterval(c._i);resolve(false);}},500);}
  let pzView=null;const stopPoison=watch('poison',v=>{pzView=v;pzShow(v);});
  const pzRe=setInterval(()=>{if(pzView&&!pzBusy)pzShow(pzView);},4000);
  /* ---- นางเงือก ---- */
  let mm=null,tCheck=0;const busy=new Set();
  function notice(v){const n=v?.notice;if(!n)return;const key='axMm:'+v.round+':'+n.k+':'+(n.at||n.earn||0);if(ls.get(key))return;ls.set(key,'1');
    if(n.k==='appointed'){const c=card('mmn','<div class="ax-row"><img class="mm" src="images/boat-mm.webp" alt=""><div><h3 style="color:#7A2FD8">🧜‍♀️ คุณได้เป็นนางเงือก!</h3><p>แข่งกับนางเงือกอีกตนส่งถาดให้ครบ 100 ก่อน · ได้ส่วนแบ่งคอมโบ 40% · ไปส่งถาดที่หน้าแข่งเรือ</p></div></div><button class="ax-btn">🚤 ไปหน้าแข่งเรือ</button>',{glow:'#C79BFF',life:45000});c.querySelector('button').onclick=()=>{drop('mmn');go?.('boat');};}
    if(n.k==='real'){const c=card('mmn','<div class="ax-row"><img class="mm" src="images/boat-mm.webp" alt=""><div><h3 style="color:#B8601A">👑 คุณคือนางเงือกตัวจริง!</h3><p>เรือที่ถึงเส้น 350 สองลำแรก คุณเลือกจ้างลูกเรือออกได้ลำละ 2 คน</p></div></div><button class="ax-btn">✨ รับทราบ</button>',{glow:'#FFD86B',life:30000});c.querySelector('button').onclick=()=>drop('mmn');}
    if(n.k==='lost'){const c=card('mmn','<div class="ax-row"><img class="mm" src="images/boat-mm.webp" alt="" style="filter:grayscale(1)"><div><h3 style="color:#B02A44">💔 นางเงือกสลายแล้ว</h3><p>'+(n.late?'เรือถึงเส้น 350 ก่อนส่งครบ 100':'นางเงือกอีกตนส่งครบ 100 ก่อน')+' · ค่าประกอบวิชาชีพที่สะสมส่งเข้าไปรษณีย์แล้ว</p></div></div><button class="ax-btn r">😢 รับทราบ</button>',{glow:'#FF8AA0',bad:true,life:30000});c.querySelector('button').onclick=()=>drop('mmn');}
    if(n.k==='fake'){const c=card('mmn','<div class="ax-row"><img class="mm" src="images/boat-mm.webp" alt="" style="filter:grayscale(1)"><div><h3 style="color:#B02A44">💔 นางเงือกตัวปลอม</h3><p>เธอได้ละเลยจากการเป็นนางเงือก ได้แต่งตั้งนางเงือกคนใหม่แล้ว เสียใจด้วย เธอเป็นนางเงือกตัวปลอม</p></div></div><button class="ax-btn r">😢 รับทราบ</button>',{glow:'#FF8AA0',bad:true,life:45000});c.querySelector('button').onclick=()=>drop('mmn');}
    if(n.k==='paid'&&n.earn>0){const c=card('mmn','<div class="ax-row"><img class="mm" src="images/boat-mm.webp" alt=""><div><h3 style="color:#B8601A">📮 ค่าประกอบวิชาชีพนางเงือก</h3><div class="d" style="color:#B8601A">💰 '+Number(n.earn).toLocaleString('en-US')+' กุศล</div><p>ส่งเข้าไปรษณีย์แล้ว กดรับได้เลย</p></div></div><button class="ax-btn">📮 รับทราบ</button>',{glow:'#FFD86B',life:45000});c.querySelector('button').onclick=()=>drop('mmn');}}
  function checkCard(){const ck=mm?.active&&mm.check;clearTimeout(tCheck);if(!ck){drop('mmc');return;}const t=now();
    if(t<ck.at){drop('mmc');tCheck=setTimeout(checkCard,Math.min(ck.at-t+300,2**31-1));return;}
    if(t>=ck.until+15000||ls.get('axMmOk:'+mm.round+':'+ck.n)){drop('mmc');return;}
    if(cards.has('mmc'))return;
    const c=card('mmc','<div class="ax-row"><img class="mm" src="images/boat-mm.webp" alt=""><div><h3 style="color:#7A2FD8">⏰ เช็กอินนางเงือก</h3><p><b>เธอยังปฏิบัติหน้าที่นางเงือกอยู่ไหม?</b></p><div class="cd">⏱️ <span>'+fmt(ck.until-t)+'</span></div></div></div><button class="ax-btn g">✅ ยังปฏิบัติหน้าที่อยู่</button>',{glow:'#C79BFF'});
    c._i=setInterval(()=>{const l=ck.until-now();c.querySelector('.cd span').textContent=fmt(l);if(l<=-15000)drop('mmc');},500);
    c.querySelector('button').onclick=async e=>{const b=e.currentTarget;b.disabled=true;try{await act('boat',{type:'mmCheck'});ls.set('axMmOk:'+mm.round+':'+ck.n,'1');drop('mmc');toast?.('🧜‍♀️ เช็กอินแล้ว ขอบคุณที่ทำหน้าที่!');}catch(err){b.disabled=false;toast?.(err.message||'ลองใหม่อีกครั้ง');}};}
  function dismissCards(){const list=mm?.active?mm.dismiss||[]:[];const key=d=>'mmd'+d.boat+'-'+(d.left??1)+'-'+(d.crew||[]).length;const ids=new Set(list.map(key));
    for(const id of [...cards.keys()])if(id.startsWith('mmd')&&!ids.has(id)&&!busy.has(id))drop(id);
    for(const d of list){const id=key(d);if(cards.has(id)||busy.has(id))continue;const crew=(d.crew||[]).map(c=>Array.isArray(c)?c:[c.u,c.n]),need=Math.max(1,Math.min(d.left??1,crew.length-1));const sel=[];
      const c=card(id,'<div class="ax-row"><img src="images/boat-mm-card.webp" alt=""><div><h3 style="color:#7A2FD8">🧜‍♀️ เรือ '+d.boat+' ถึงเส้น 350</h3><p>เลือกลูกเรือ '+need+' คนให้จ้างออก</p><div class="cd">⏱️ <span>'+fmt(d.until-now())+'</span></div></div></div><div class="ax-crew">'+crew.map(([u,nm])=>'<button data-u="'+esc(u)+'">'+esc(nm)+'</button>').join('')+'</div><button class="ax-btn r" disabled>🔨 จ้างออก</button>',{glow:'#C79BFF'});
      c._i=setInterval(()=>{c.querySelector('.cd span').textContent=fmt(d.until-now());},500);
      const go=c.querySelector('.ax-btn'),sync=()=>{c.querySelectorAll('[data-u]').forEach(x=>x.classList.toggle('on',sel.includes(x.dataset.u)));go.disabled=sel.length!==need;go.textContent=sel.length===need?'🔨 จ้างออก '+need+' คน':'🔨 เลือกอีก '+(need-sel.length)+' คน';};sync();
      c.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{const u=b.dataset.u,i=sel.indexOf(u);if(i>=0)sel.splice(i,1);else{if(sel.length>=need)sel.shift();sel.push(u);}sync();});
      go.onclick=async e=>{const b=e.currentTarget;if(sel.length!==need)return;b.disabled=true;busy.add(id);try{await act('boat',{type:'mmFire',boat:d.boat,uids:sel.slice()});drop(id);toast?.('🔨 นางเงือกตัดสินแล้ว!');}catch(err){b.disabled=false;toast?.(err.message||'ลองใหม่อีกครั้ง');}finally{busy.delete(id);}};}}
  /* ---- fix17 ⛈️ ฝนกุศล: เตือน 15 วินาทีทุกหน้า (หน้าแข่งเรือมีเตือนของตัวเองแล้ว) · ไม่บอกให้ไปหน้าไหน ---- */
  let rainT=0;function rainCard(v){const r=v?.rain;clearInterval(rainT);if(!r||!r.start){drop('rain');return;}
    const left=()=>r.start-now();if(left()<=0||screen?.()==='boat'){drop('rain');return;}
    if(!cards.has('rain')){card('rain','<div class="ax-row"><div style="font-size:2.6rem;text-align:center;filter:drop-shadow(0 0 10px #9FD8FF)">⛈️</div><div><h3 style="color:#2F5FA8">⛈️ ฝนกุศลกำลังจะตก</h3><p>เตรียมรับกุศล!</p><div class="cd">⏱️ <span>'+Math.ceil(left()/1000)+'</span> วินาที</div></div></div>',{glow:'#9FD8FF'});}
    rainT=setInterval(()=>{const l=left();const c=cards.get('rain');if(l<=0||screen?.()==='boat'){clearInterval(rainT);drop('rain');return;}if(c)c.querySelector('.cd span').textContent=Math.ceil(l/1000);},250);}
  /* ---- fix17 🏊 ว่ายกลับเรือ: ภารกิจติดตามทุกหน้า · ครบแล้วกลับเรือให้อัตโนมัติ ---- */
  const BIRD=['ostrich-egg','ostrich-feather','dodo-egg','dodo-feather','dodo-pebble'],UNIT={mg:'กุศล',cook:'จาน',bird:'ชิ้น',box:'กล่อง'},ICON={mg:'🎮',cook:'🍳',bird:'🦢',box:'🎁'},TXT={mg:'ได้กุศลจากมินิเกม',cook:'คราฟเมนูที่สุ่มให้',bird:'เก็บของนกกระจอกเทศ/โดโด้',box:'เปิดกล่องสุ่ม'};
  let swimBusy=false,swimAsk=0,swimKey='';
  function swimProg(sq){if(sq.kind==='bird'){const g=game?.()||{};return Math.max(0,BIRD.reduce((a,k)=>a+(Number(g.bag?.bird?.[k])||0),0)-(Number(sq.base)||0));}return Math.max(0,Number(sq.got)||0);}
  function swimCard(){const sq=x17?.()?.sq;if(!sq||!sq.until||screen?.()==='boat'||now()>sq.until+60000){drop('swim');dropSwim();swimKey='';return;}
    const p=swimProg(sq),need=Number(sq.need)||0,done=need>0&&p>=need,key=sq.at+'|'+Math.min(p,need)+'|'+done;
    if(done&&!swimBusy&&Date.now()-swimAsk>10000){swimAsk=Date.now();swimBusy=true;act('boat',{type:'swimDone'}).then(out=>{if(out?.swimBack){drop('swim');dropSwim();card('swimok','<div class="ax-row"><div style="font-size:2.4rem;text-align:center">🎉🚣</div><div><h3 style="color:#2F8F6C">ว่ายกลับเรือสำเร็จ!</h3><div class="d" style="color:#2F8F6C">+1,000,000 กุศล</div><p>🛡️ โล่กันเตะ 30 นาที</p></div></div>',{glow:'#7FE0B8',life:6000});}}).catch(()=>{}).finally(()=>{swimBusy=false;});}
    /* fix17e: ป้ายเล็กชิดขอบซ้าย (ไม่ทับแถบบน/ปุ่มของหน้า) · แตะเพื่อดูรายละเอียด */
    let pill=document.getElementById('axSwim');if(!pill){pill=document.createElement('button');pill.id='axSwim';pill.type='button';pill.className='ax-swim';pill.onclick=()=>{pill.classList.toggle('open');};document.body.appendChild(pill);}
    pill.innerHTML='<span class="i">🏊</span><b>'+Math.min(p,need).toLocaleString('en-US')+'/'+need.toLocaleString('en-US')+'</b><span class="t">'+(done?'✅':'⏳ '+fmt(sq.until-now()))+'</span><span class="more">'+ICON[sq.kind]+' '+TXT[sq.kind]+' ('+UNIT[sq.kind]+') · ทำครบแล้วกลับเรือให้เอง</span>';
    pill.setAttribute('aria-label','ภารกิจว่ายกลับเรือ '+Math.min(p,need)+' จาก '+need+' '+UNIT[sq.kind]);}
  function dropSwim(){document.getElementById('axSwim')?.remove();}
  const swimT=setInterval(swimCard,1000);
  const stopMm=watch('mermaid',v=>{mm=v;notice(v);checkCard();dismissCards();rainCard(v);});
  /* fix18: โดนเตะจากเรือแล้วอยู่หน้าอื่น → ป้ายเล็กนับถอยหลัง แตะกลับไปตัดสินใจ · หมดเวลาตอบให้อัตโนมัติ (กติกาเดิม)
     ไม่อยู่ในเกมจนเซิร์ฟเวอร์ตัดสินให้ออก → การ์ดแจ้งครั้งเดียวตอนกลับมา (ข้อความของแอดมินตามตัวอักษร) */
  const AWAY_MSG='ระหว่างที่คุณ ไม่อยู่ในเกมการแข่งขันเรือได้เริ่มขึ้นและคุณคือคนที่ถูกเตะออกจากเรือ  ระบบได้ให้เวลาแล้วแต่คุณไม่รักษาสิทธิ์ตัวเองขอโทษด้วยนะคะ';
  let boff=null,offAsk='';
  function dropOff(){document.getElementById('axOff')?.remove();}
  function offTick(){const o=boff?.offer;if(!o||!o.until||screen?.()==='boat'||now()>o.until+120000){dropOff();return;}
    const ms=o.until-now(),key=o.until+'|'+o.n;
    if(ms<=-1500&&offAsk!==key){offAsk=key;act('boat',{type:'stay',accept:null}).catch(()=>{});}
    let pill=document.getElementById('axOff');if(!pill){pill=document.createElement('button');pill.id='axOff';pill.type='button';pill.className='ax-swim ax-off';pill.onclick=()=>go?.('boat');document.body.appendChild(pill);}
    pill.innerHTML='<span class="i">🦶</span><b>'+(o.swim?'ว่ายกลับ?':'โดนเตะ!')+'</b><span class="t">⏳ '+(ms>0?fmt(ms):'0:00')+'</span>';
    pill.setAttribute('aria-label','โดนเตะจากเรือ แตะเพื่อไปตัดสินใจ เหลือเวลา '+(ms>0?fmt(ms):'0:00'));}
  function awayCard(v){const w=v?.away;if(!w?.at||ls.get('axAway:'+w.at))return;
    const c=card('away','<div class="ax-row"><div style="font-size:2.4rem;text-align:center">🚣💦</div><div><h3 style="color:#B02A44">ออกจากเรือแล้ว</h3><p>'+AWAY_MSG+'</p></div></div><button class="ax-btn r" type="button">รับทราบ</button>',{glow:'#FF9DB8'});
    c.querySelector('button').onclick=()=>{ls.set('axAway:'+w.at,'1');drop('away');};}
  const offT=setInterval(offTick,500);
  const stopOff=watch('boatOffer',v=>{boff=v;offTick();awayCard(v);});
  return ()=>{clearInterval(offT);dropOff();stopOff?.();clearInterval(pzRe);clearInterval(swimT);dropSwim();clearInterval(rainT);stopPoison?.();stopMm?.();clearTimeout(tCheck);for(const id of [...cards.keys()])drop(id);wrap.remove();};
}
