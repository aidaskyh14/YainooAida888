/* จัดตะกร้าให้แม่มด — client screen (from the approved preview). Orders, timing and scoring come from the server. */
const CSS=__CSS__;
export function mountBasket(host,api){
const root=host.attachShadow({mode:'open'});root.innerHTML=`<style>${CSS}</style><div id="wrap"><div id="stage"></div></div>`;
const IMGS={bg:'images/basket-table-bg.webp',items:'images/basket-items.webp',w_pumpkin:'images/basket-witch-pumpkin.webp',w_moon:'images/basket-witch-moon.webp',w_candy:'images/basket-witch-candy.webp'};
const A=api.assets?{...IMGS,...api.assets}:IMGS;
const WITCHES=[{k:'pumpkin',n:'แม่มดฟักทอง',x:19},{k:'moon',n:'แม่มดจันทร์',x:50},{k:'candy',n:'แม่มดลูกกวาด',x:81}];
const TIME=30,SLOTS=30,MIN=20000;
const cost=()=>api.cost?api.cost():6;
const $=s=>root.querySelector(s), st=$('#stage');
const rnd=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const num=n=>(n>0?'+':n<0?'−':'')+Math.abs(n).toLocaleString('en-US');
$('#wrap').style.setProperty('--bgimg',`url(${A.bg})`);
function icon(id){return `background-image:url(${A.items});background-size:500% 600%;background-position:${(id%5)*25}% ${Math.floor(id/5)*20}%`;}
let ac=null;function snd(kind){try{ac ||= new (window.AudioContext||window.webkitAudioContext)();const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);
 const P={pick:['triangle',660,990,.08,.12],drop:['triangle',520,780,.1,.12],back:['sine',500,300,.1,.1],ok:['triangle',660,1320,.35,.18],bad:['sawtooth',220,90,.35,.12],tick:['square',1200,1200,.04,.05],event:['sine',200,600,.4,.12],win:['triangle',523,1046,.5,.18]}[kind];
 o.type=P[0];o.frequency.setValueAtTime(P[1],t);o.frequency.exponentialRampToValueAtTime(P[2],t+P[3]);g.gain.setValueAtTime(P[4],t);g.gain.exponentialRampToValueAtTime(.001,t+P[3]);o.start(t);o.stop(t+P[3]+.02);}catch(e){}}
let R=null,G=null,dead=false,lobbyTimer=0;
const pieces=o=>Object.values(o).reduce((a,c)=>a+c,0);
function lobbyAction(){const S=api.S,cd=(S.cd.basket||0)-api.time();
 if(api.closed?api.closed():S.solo?.basket==='closed')return '<div class="wait">เกมนี้ปิดชั่วคราว</div>';
 if(cd>0)return `<div class="wait">พักก่อนนะ เล่นได้อีกใน <b>${Math.floor(cd/60000)}:${String(Math.ceil(cd/1000)%60).padStart(2,'0')}</b></div>`;
 const okC=api.lack?!api.lack():S.coins>=cost(),okK=S.kusal>=MIN;
 return `${okC&&okK?'':`<div class="wait">${!okC?(api.lackText?api.lackText():'ใช้ '+cost()+' เหรียญ'):'ต้องมีกุศล '+MIN.toLocaleString('en-US')+' ขึ้นไป'}</div>`}<button class="go" id="goBtn" ${okC&&okK?'':'disabled'}>เริ่มจัดตะกร้า! · ${api.feeText?api.feeText():'🪙 '+cost()}</button>`;}
function lobby(){G=null;R=api.offer();if(!R){st.innerHTML='';return;}
 st.innerHTML=`${WITCHES.map(w=>`<img class="lwitch" src="${A['w_'+w.k]}" style="left:${w.x}%" alt="">`).join('')}<div class="title">จัดตะกร้า<br>ให้แม่มด<small>แม่มด 3 คนรอของอยู่!</small></div>
 <div class="card"><div class="row"><h1>พร้อมช่วยไหม?</h1><button class="ibtn" id="rulesBtn">กติกา</button></div>
 <div class="facts"><div class="fact"><b>3</b><span>ตะกร้า</span></div><div class="fact"><b>30 วิ</b><span>รวมทุกคน</span></div><div class="fact"><b>${R.orders.reduce((a,o)=>a+pieces(o),0)}</b><span>ชิ้นรอบนี้</span></div></div>
 <div id="act">${lobbyAction()}</div></div>`;
 $('#rulesBtn').onclick=rules;bindGo();}
function bindGo(){const b=$('#goBtn');if(b)b.onclick=async()=>{b.disabled=true;const round=await api.start();if(round)play(round);else b.disabled=false;};}
function sheet(html){const s=document.createElement('div');s.className='sheet';s.innerHTML=`<div class="panel">${html}</div>`;st.appendChild(s);s.onclick=e=>{if(e.target===s)s.remove();};return s;}
function rules(){const s=sheet(`<h2>กติกา</h2><div class="rules">
 <div class="rule"><span class="e">👆</span><div><b>แตะของบนโต๊ะ</b><span>ลงตะกร้าที่มีลูกศร หรือลากใส่ตะกร้าไหนก็ได้</span></div></div>
 <div class="rule"><span class="e">↩️</span><div><b>หยิบผิด</b><span>แตะของในตะกร้าเพื่อคืนโต๊ะ</span></div></div>
 <div class="rule"><span class="e">⭐</span><div><b>ซ้ายง่าย ขวายาก</b><span>ส่งได้ครั้งเดียวต่อคน</span></div></div>
 <div class="rule"><span class="e">🦇</span><div><b>ระวังเรื่องแปลก ๆ</b><span>บางรอบมีสิ่งรบกวนโผล่มาเอง</span></div></div>
 <div class="rule"><span class="e">🏆</span><div><b>ถูกครบ 3 คน</b><span>+30,000–50,000 ยิ่งเร็วยิ่งมาก</span></div></div>
 <div class="rule"><span class="e">💎</span><div><b>ครบแบบเร็วมาก</b><span>โบนัส +100,000</span></div></div>
 <div class="rule"><span class="e">✌️</span><div><b>ถูก 2 คน</b><span>+3,000–15,000 คนขวาได้มากสุด</span></div></div>
 <div class="rule"><span class="e">💔</span><div><b>ถูก 1 คนหรือไม่ถูกเลย</b><span>−10,000 ถึง −20,000</span></div></div></div><button class="close">เข้าใจแล้ว</button>`);s.querySelector('.close').onclick=()=>s.remove();}
// --- game
function play(round){R=round;snd('tick');
 const C=2*Math.PI*44;
 st.innerHTML=`<div class="hud"><div class="plate"><b id="sc">0</b><small>ถูกต้อง</small></div><div class="timer" id="tm"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"></circle><circle class="fg" cx="50" cy="50" r="44" stroke-dasharray="${C}" stroke-dashoffset="0"></circle></svg><span>30</span></div><div class="plate r"><b id="sent">0/3</b><small>ส่งแล้ว</small></div></div><div id="dark"></div><div class="hint" id="hint">แตะของ = ลงตะกร้าที่มีลูกศร · แตะแม่มดเพื่อเปลี่ยน</div>`;
 G={over:false,active:0,okN:0,sent:0,C,baskets:R.orders.map(o=>({need:o,got:{},done:null})),items:[],fired:new Set(),count:null};
 WITCHES.forEach((w,i)=>{const el=document.createElement('div');el.className='witch';el.style.left=w.x+'%';el.innerHTML=`<img src="${A['w_'+w.k]}" alt="${w.n}">`;el.onclick=()=>setActive(i);st.appendChild(el);G.baskets[i].wEl=el;
   const b=document.createElement('div');b.className='basket';b.style.left=w.x+'%';b.innerHTML=`<div class="handle"></div><div class="rim"></div><div class="lvl">${'★'.repeat(i+1)}</div><div class="body"></div><button class="send" disabled>ส่ง</button>`;st.appendChild(b);G.baskets[i].el=b;
   b.addEventListener('pointerdown',e=>{if(e.target.closest('.send,.req,.extra'))return;setActive(i);});b.querySelector('.send').onclick=e=>{e.stopPropagation();send(i);};renderBasket(i);});
 layoutTable();
 // a resumed round keeps baskets already sent
 (R.sent||[]).forEach((s,i)=>{if(s)markSent(i,s.ok,false);});
 const first=G.baskets.findIndex(b=>!b.done);if(first>=0)setActive(first);
 if(R.start>api.time()){const c=document.createElement('div');c.className='count';st.appendChild(c);G.count=c;}
 loop();}
function el(){return api.time()-R.start;}
function slotPos(k){const r=Math.floor(k/6),c=k%6,top=48+r*7,spread=62+r*4.5,left=50-spread/2+(c+.5)*spread/6;const j=((k*7919)%100)/100;return [left+(j-.5)*3.6,top+(((k*104729)%100)/100-.5)*2.8];}
function layoutTable(){st.querySelectorAll('.item').forEach(e=>e.remove());const used={};(R.sent||[]).forEach(s=>s&&Object.entries(s.items).forEach(([k,n])=>used[k]=(used[k]||0)+n));
 G.items=R.pieces.map(pc=>{const [x,y]=slotPos(pc.slot);const e=document.createElement('div');e.className='item';e.style.cssText=`left:${x}%;top:${y}%;--rot:${rnd(-18,18)}deg;${icon(pc.id)}`;st.appendChild(e);const it={id:pc.id,el:e,x,y,inBasket:-1,slot:pc.slot};if(used[pc.id]>0){used[pc.id]--;it.inBasket=9;e.classList.add('gone');}bindDrag(it);return it;});}
function setActive(i){if(!G||G.over||G.baskets[i].done)return;G.active=i;G.baskets.forEach((b,j)=>{b.el.classList.toggle('active',j===i);b.wEl.classList.toggle('active',j===i);});}
function nextActive(){const i=G.baskets.findIndex(b=>!b.done);if(i>=0)setActive(i);}
function renderBasket(i){const b=G.baskets[i],body=b.el.querySelector('.body'),shadow=R.shadowList===i;let h='';
 for(const [id,n] of Object.entries(b.need)){const g=b.got[id]||0;h+=`<div class="req ${g===n?'ok':g>n?'over':g?'part':''} ${shadow&&!g?'shadowed':''}" data-id="${id}"><i style="${icon(+id)}"></i><span class="n">${g?g+'/'+n:'×'+n}</span></div>`;}
 for(const [id,n] of Object.entries(b.got))if(!(id in b.need))for(let k=0;k<n;k++)h+=`<div class="extra" data-id="${id}"><i style="${icon(+id)}"></i></div>`;
 body.innerHTML=h;b.el.querySelector('.send').disabled=!pieces(b.got)||!!b.done;
 body.querySelectorAll('.req,.extra').forEach(e=>e.onclick=ev=>{ev.stopPropagation();takeBack(i,+e.dataset.id);});}
function bindDrag(it){let sx,sy,moved=false,pid=null;
 it.el.addEventListener('pointerdown',e=>{if(!G||G.over||it.inBasket>=0||el()<0)return;e.preventDefault();pid=e.pointerId;it.el.setPointerCapture(pid);sx=e.clientX;sy=e.clientY;moved=false;snd('pick');});
 it.el.addEventListener('pointermove',e=>{if(pid!==e.pointerId)return;const r=st.getBoundingClientRect();if(!moved&&Math.hypot(e.clientX-sx,e.clientY-sy)>8){moved=true;it.el.classList.add('drag');}
   if(moved){it.el.style.left=((e.clientX-r.left)/r.width*100)+'%';it.el.style.top=((e.clientY-r.top)/r.height*100)+'%';G.baskets.forEach(b=>b.el.classList.toggle('over',hitBasket(b,e)));}});
 it.el.addEventListener('pointerup',e=>{if(pid!==e.pointerId)return;pid=null;it.el.classList.remove('drag');G.baskets.forEach(b=>b.el.classList.remove('over'));
   if(!moved){toBasket(it,G.active);return;}const i=G.baskets.findIndex(b=>!b.done&&hitBasket(b,e));if(i>=0)toBasket(it,i,true);else{it.el.style.left=it.x+'%';it.el.style.top=it.y+'%';}});
 it.el.addEventListener('pointercancel',()=>{pid=null;it.el.classList.remove('drag');it.el.style.left=it.x+'%';it.el.style.top=it.y+'%';});}
function hitBasket(b,e){const r=b.el.getBoundingClientRect();return e.clientX>r.left-12&&e.clientX<r.right+12&&e.clientY>r.top-30&&e.clientY<r.bottom+12;}
function toBasket(it,i,dropped){const b=G.baskets[i];if(!b||b.done||G.over)return;it.inBasket=i;b.got[it.id]=(b.got[it.id]||0)+1;
 if(!dropped)flyEl(it.el,b.el);it.el.classList.add('gone');snd('drop');renderBasket(i);b.el.querySelector('.body').animate([{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:180});$('#hint').style.opacity=0;}
function takeBack(i,id){const b=G.baskets[i];if(b.done||G.over||!b.got[id])return;b.got[id]--;if(!b.got[id])delete b.got[id];const it=G.items.find(t=>t.inBasket===i&&t.id===id);if(it){it.inBasket=-1;it.el.style.left=it.x+'%';it.el.style.top=it.y+'%';it.el.classList.remove('gone');}snd('back');renderBasket(i);}
function flyEl(src,dst){const s=src.getBoundingClientRect(),d=dst.querySelector('.body').getBoundingClientRect(),r=st.getBoundingClientRect();const f=document.createElement('div');f.className='fly';f.style.cssText=src.style.cssText;f.style.left=(s.left-r.left)+'px';f.style.top=(s.top-r.top)+'px';f.style.transform='';st.appendChild(f);
 const dx=d.left+d.width/2-s.left-s.width/2,dy=d.top+d.height/2-s.top-s.height/2;f.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${dx*.5}px,${dy*.5-r.height*.08}px) scale(.9)`,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(.45)`}],{duration:320,easing:'ease-in'}).onfinish=()=>f.remove();}
// --- send: the look is immediate; the server's check is the one that counts
function check(b){const keys=new Set([...Object.keys(b.need),...Object.keys(b.got)]);return [...keys].every(k=>(b.need[k]||0)===(b.got[k]||0));}
function send(i){const b=G.baskets[i];if(b.done||G.over)return;const ok=check(b);markSent(i,ok,true);
 api.send(R.id,i,{...b.got}).then(out=>{if(out&&out.sent?.[i]&&out.sent[i].ok!==ok)toast('ระบบตรวจตะกร้าใหม่แล้ว');});
 if(G.sent===3)setTimeout(finish,700);else nextActive();}
function markSent(i,ok,live){const b=G.baskets[i];b.done=ok?'ok':'bad';G.sent++;if(ok)G.okN++;
 b.el.classList.add('done');b.el.classList.remove('active');b.wEl.classList.remove('active');b.el.querySelector('.send').disabled=true;
 const stamp=document.createElement('div');stamp.className='stamp '+(ok?'ok':'bad');stamp.textContent=ok?'ถูกต้อง!':'ผิด!';b.el.appendChild(stamp);
 $('#sc').textContent=G.okN;$('#sent').textContent=G.sent+'/3';if(!live)return;
 const r=b.el.getBoundingClientRect(),sr=st.getBoundingClientRect(),cx=r.left-sr.left+r.width/2,cy=r.top-sr.top;
 if(ok){snd('ok');b.wEl.classList.add('happy');sparkle(cx,cy,['#ffe07a','#fff','#c9a8ff','#9ff0c4'],22);hearts(cx,cy-sr.height*.08);popN(cx,cy,'✓','#9ff0c4');}
 else{snd('bad');b.wEl.classList.add('sad');shake();popN(cx,cy,'✗','#ffb0b0');}}
function toast(t){const b=document.createElement('div');b.className='banner';b.textContent=t;st.appendChild(b);setTimeout(()=>b.remove(),1500);}
// --- timeline + events
function loop(){if(dead||!G||G.over)return;const t=el(),left=Math.max(0,Math.min(TIME,(R.until-api.time())/1000));
 if(G.count){if(t<0){const n=Math.ceil(-t/1000);if(G.count.dataset.n!=n){G.count.dataset.n=n;G.count.innerHTML=`<span>${n}</span>`;snd('tick');}}else{G.count.innerHTML='<span>เริ่ม!</span>';const c=G.count;G.count=null;setTimeout(()=>c.remove(),700);}}
 const tm=$('#tm'),s=Math.ceil(left);tm.querySelector('.fg').style.strokeDashoffset=G.C*(1-left/TIME);if(tm.querySelector('span').textContent!=String(s)){tm.querySelector('span').textContent=s;tm.classList.toggle('hot',s<=8);if(s<=5&&s>0&&t>0)snd('tick');}
 for(const e of R.events)if(t>=e.at&&t<e.at+4000&&!G.fired.has(e.k)){G.fired.add(e.k);fire(e.k);}
 if(t>=TIME*1000){finish();return;}requestAnimationFrame(loop);}
function banner(t){const b=document.createElement('div');b.className='banner';b.textContent=t;st.appendChild(b);setTimeout(()=>b.remove(),1500);}
function fire(e){snd('event');
 if(e==='bats'){banner('🦇 ค้างคาวบินผ่าน!');const sw=document.createElement('div');sw.className='bats';sw.style.top='40%';sw.style.height='38%';sw.innerHTML=[...Array(9)].map(()=>`<i style="left:${rnd(0,85)}%;top:${rnd(5,80)}%;${icon(8)};animation-delay:${rnd(0,.25)}s"></i>`).join('');st.appendChild(sw);setTimeout(()=>sw.remove(),3500);}
 if(e==='candle'){banner('🕯️ เทียนดับ!');const d=$('#dark');d.classList.add('on');const mv=ev=>{const r=st.getBoundingClientRect();d.style.setProperty('--lx',(ev.clientX-r.left)+'px');d.style.setProperty('--ly',(ev.clientY-r.top-r.height*.38)+'px');};st.addEventListener('pointermove',mv);st.addEventListener('pointerdown',mv);setTimeout(()=>{d.classList.remove('on');st.removeEventListener('pointermove',mv);st.removeEventListener('pointerdown',mv);},4500);}
 if(e==='wind'){banner('🌀 ลมพัด ของสลับที่!');const free=G.items.filter(t=>t.inBasket<0),slots=shuffle(free.map(t=>t.slot));free.forEach((t,k)=>{t.slot=slots[k];const [x,y]=slotPos(t.slot);t.x=x;t.y=y;t.el.style.left=x+'%';t.el.style.top=y+'%';t.el.style.setProperty('--rot',rnd(-25,25)+'deg');});}}
function part(x,y,css,dx,dy,d,rot=0){const p=document.createElement('div');p.className='pt';p.style.cssText=`left:${x}px;top:${y}px;--dx:${dx}px;--dy:${dy}px;--d:${d}s;--r:${rot}deg;${css}`;st.appendChild(p);setTimeout(()=>p.remove(),d*1000+60);return p;}
function sparkle(x,y,cols,n){const W=st.clientWidth;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=W*rnd(.06,.2),sz=W*rnd(.01,.025);part(x,y,`width:${sz}px;height:${sz}px;border-radius:50%;background:${pick(cols)}`,Math.cos(a)*s,Math.sin(a)*s,rnd(.5,.8));}}
function hearts(x,y){const W=st.clientWidth;for(let i=0;i<5;i++){const p=part(x+rnd(-1,1)*W*.06,y,`font-size:${W*.05}px`,rnd(-1,1)*W*.05,-W*rnd(.08,.16),rnd(.8,1.1),rnd(-20,20));p.textContent=pick(['💜','🧡','✨']);}}
function popN(x,y,s,c){const p=document.createElement('div');p.className='popn';p.style.cssText=`left:${x}px;top:${y}px;color:${c}`;p.textContent=s;st.appendChild(p);setTimeout(()=>p.remove(),1150);}
function shake(){st.classList.remove('shake');void st.offsetWidth;st.classList.add('shake');}
// --- result from the server
async function finish(){if(!G||G.over)return;G.over=true;$('#dark')?.classList.remove('on');
 G.baskets.forEach(b=>{if(!b.done&&b.el){const s=document.createElement('div');s.className='stamp bad';s.textContent='ไม่ทัน!';b.el.appendChild(s);b.wEl.classList.add('sad');}});
 const wait=sheet('<p class="sub">กำลังสรุปผล…</p>');wait.onclick=null;
 let done=null;for(let k=0;k<8&&!done;k++){done=await api.finish(R.id);if(!done)await new Promise(r=>setTimeout(r,1500));}
 wait.remove();if(dead)return;if(!done){sheet('<p class="verdict lose">ยังสรุปผลไม่ได้</p><p class="sub">เปิดเกมนี้ใหม่อีกครั้ง ผลรอบนี้จะสรุปให้อัตโนมัติ</p>');return;}
 const res=done.result,okN=res.n;snd(res.merit>0?'win':'bad');
 const s=sheet(`<p class="verdict ${okN===3?'win':res.merit>0?'mid':'lose'}">${res.jackpot?'💎 เร็วสุดยอด!':okN===3?'ครบทั้ง 3 คน!':okN?'ส่งถูก '+okN+' คน':'แม่มดไม่พอใจ'}</p><p class="sub">${okN===3?'เหลือเวลา '+Math.floor(res.left)+' วินาที':done.tier==='easy'?'รอบนี้โจทย์ง่าย':done.tier==='mid'?'รอบนี้โจทย์กลาง':'รอบนี้โจทย์ยาก'}</p>
  <div class="lines">${WITCHES.map((w,i)=>{const sv=done.sent[i];return `<div class="line"><img src="${A['w_'+w.k]}" alt=""><span>${w.n} ${'★'.repeat(i+1)}<small>${sv?.ok?'ส่งถูกต้อง':sv?'ส่งผิด':'ส่งไม่ทัน'}</small></span><b class="${sv?.ok?'p':'n'}">${sv?.ok?'✓':'✗'}</b></div>`;}).join('')}
  <div class="line tot"><span><b style="font-size:4.4cqw">รวมกุศล</b>${res.jackpot?'<small>โบนัสส่งครบเร็วมาก</small>':''}</span><b class="${res.merit>0?'p':'n'}">${num(res.merit)}</b></div></div>
  <p class="note">${res.merit>0?'รางวัลส่งเข้าไปรษณีย์แล้ว':'หักกุศลแล้ว'}</p><button class="close" id="again">กลับหน้าเกม</button>`);s.onclick=null;s.querySelector('#again').onclick=()=>{G=null;lobby();};}
const cur=api.current();if(cur&&cur.phase==='active'){if(api.time()<cur.until)play(cur);else{R=cur;G={over:false,baskets:[]};finish();}}else lobby();
lobbyTimer=setInterval(()=>{const a=$('#act');if(!G&&R&&a){const h=lobbyAction();if(a.dataset.h!==h){a.dataset.h=h;a.innerHTML=h;bindGo();}}},1000);
return{canLeave(){return !G||G.over;},close(){dead=true;clearInterval(lobbyTimer);}};
}
