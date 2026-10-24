/* fix19 🌳👻 ศึกต้นไม้ผี — เด้งทุกหน้า (เปลือกเกม)
   · 🦇 เตือนค้างคาว 15 วินาที + ป้ายระหว่างเล่น (แตะไปหน้าศึก)
   · 12:05 / 00:05 สรุปผลรอบ (ทุกคน ครั้งเดียว) · แผ่นป้ายกุศล (บ้านที่ชนะ) · การ์ดแกล้ง (คนที่ถูกสุ่ม) · การ์ดเซอร์ไพรส์ (คนเก็บค้างคาวได้มากสุด)
   ข้อมูลการ์ดอยู่บนเซิร์ฟเวอร์ทั้งหมด หน้าเว็บรู้หน้าการ์ดหลังเปิดแล้วเท่านั้น */
const CSS=`
.tw-ov{position:fixed;inset:0;z-index:9500;display:flex;flex-direction:column;align-items:center;padding:calc(env(safe-area-inset-top,0px) + 1rem) 16px calc(env(safe-area-inset-bottom,0px) + 1rem);background:radial-gradient(circle at 50% 40%,rgba(70,30,110,.96),rgba(12,5,24,.98) 70%);color:#FFF4E2;text-align:center;overflow:auto;font-family:'Mali',system-ui,sans-serif}
.tw-pc{margin:auto 0;width:100%;max-width:22rem;display:flex;flex-direction:column;align-items:center;padding-block:.5rem}
.tw-ov h2{margin:.2rem 0;font:400 1.5rem 'Itim','Mali',sans-serif;text-wrap:balance}
.tw-ov p{margin:.2rem 0;font-size:.8rem;color:#CDB8E6;line-height:1.55}
.tw-ov .tm{font:400 1rem 'Itim','Mali',sans-serif;color:#FFD36B;font-variant-numeric:tabular-nums}
.tw-min{position:absolute;right:max(12px,env(safe-area-inset-right,0px));top:calc(env(safe-area-inset-top,0px) + 10px);width:2.3rem;height:2.3rem;border-radius:50%;border:1.5px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#fff;font-size:1rem;cursor:pointer}
.tw-cards{display:grid;gap:.5rem;width:100%;margin:.6rem 0}.tw-cards.c6,.tw-cards.c3{grid-template-columns:repeat(3,1fr)}.tw-cards.c4{grid-template-columns:repeat(2,minmax(0,8.5rem));justify-content:center}
.tw-cw{display:flex;flex-direction:column;gap:.25rem;min-width:0}
.tw-card{position:relative;aspect-ratio:2/3;width:100%;perspective:800px;border:0;background:none;padding:0;cursor:pointer}
.tw-card .in{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .6s}
.tw-card.flip .in{transform:rotateY(180deg)}
.tw-card .f,.tw-card .b{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:.6rem;background-size:contain;background-position:center;background-repeat:no-repeat}
.tw-card .f{transform:rotateY(180deg)}
.tw-card .fx{position:absolute;inset:-25%;background:url(images/tw-fxBurst.webp) center/contain no-repeat;opacity:0;pointer-events:none}
.tw-card.flip .fx{animation:twburst .8s ease-out}
@keyframes twburst{0%{opacity:1;transform:scale(.4)}100%{opacity:0;transform:scale(1.3)}}
.tw-card.dim{opacity:.45;filter:grayscale(.5)}
.tw-card:disabled{cursor:default}
.tw-cap{font:400 .85rem 'Itim','Mali',sans-serif;color:#FFD36B;line-height:1.15;visibility:hidden;min-height:2.1em}
.tw-cap small{display:block;font:600 .62rem 'Mali',sans-serif;color:#CDB8E6}
.tw-cw.show .tw-cap{visibility:visible}.tw-cw.dimw .tw-cap{color:#CDB8E6}
.tw-big{border:0;border-radius:999px;padding:.6rem 1.3rem;font:400 1.05rem 'Itim','Mali',sans-serif;background:linear-gradient(180deg,#FFD36B,#E8962A);color:#4a2700;box-shadow:0 3px 0 #9a5a10;cursor:pointer}
.tw-big.ghost{background:transparent;color:#FFF4E2;border:1.5px solid rgba(255,255,255,.35);box-shadow:none}
.tw-big.red{background:linear-gradient(180deg,#FF7A93,#C63A5A);color:#fff;box-shadow:0 3px 0 #7a1a30}
.tw-big:disabled{opacity:.5}
.tw-row{display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center;margin-top:.5rem}
.tw-pick{display:grid;grid-template-columns:repeat(2,1fr);gap:.35rem;width:100%;margin:.5rem 0;max-height:16rem;overflow:auto}
.tw-pick button{border:1.5px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);border-radius:.8rem;padding:.45rem;font:600 .75rem 'Mali',sans-serif;color:#FFF4E2;text-align:left;display:flex;gap:.35rem;align-items:center;cursor:pointer}
.tw-pick button img{width:1.3rem;height:1.3rem;object-fit:contain;flex:none}
.tw-pick button small{display:block;color:#CDB8E6;font-size:.62rem}
.tw-pick button.on{border-color:#FF5C7A;background:rgba(255,92,122,.2)}
.tw-rk{width:100%;margin:.5rem 0;border-collapse:collapse;font-size:.8rem}.tw-rk td{padding:.3rem .25rem;border-bottom:1px solid rgba(255,255,255,.1);text-align:left}.tw-rk td.n{text-align:right;color:#FFD36B;font-variant-numeric:tabular-nums}.tw-rk img{width:1.1rem;vertical-align:-.2rem}
.tw-pill{position:fixed;z-index:8996;left:max(.35rem,env(safe-area-inset-left,0px));top:calc(env(safe-area-inset-top,0px) + 12.2rem);display:flex;align-items:center;gap:.3rem;border:1.5px solid #FFD36B;border-radius:999px;background:rgba(42,26,69,.94);color:#FFF4E2;font:700 .7rem 'Mali',sans-serif;padding:.3rem .6rem;box-shadow:0 0 12px rgba(255,211,107,.5);cursor:pointer;animation:twpulse 1.6s ease-in-out infinite}
@keyframes twpulse{50%{box-shadow:0 0 20px rgba(255,211,107,.9)}}
.tw-warn{position:fixed;z-index:9400;left:50%;top:calc(env(safe-area-inset-top,0px) + 14%);transform:translateX(-50%);width:min(calc(100vw - 32px),21rem);background:#2A1A45;color:#FFF4E2;border:2px solid #FFD36B;border-radius:1.2rem;padding:1rem;text-align:center;box-shadow:0 0 30px rgba(255,211,107,.45);font-family:'Mali',sans-serif}
.tw-warn h3{margin:0;font:400 1.2rem 'Itim','Mali',sans-serif}.tw-warn .cd{font:400 2.4rem 'Itim',sans-serif;color:#FFD36B}.tw-warn p{font-size:.74rem;color:#CDB8E6;margin:.2rem 0 .5rem;line-height:1.5}
@media (prefers-reduced-motion:reduce){.tw-card .in{transition:none}.tw-pill{animation:none}}`;
const MIMG={5000000:'mBronze',10000000:'mSilver',30000000:'mGold',50000000:'mRainbow'};
const PR={rob:['pRob','🧺 ปล้นเสบียง 3 บ้าน','ทุกคนใน 3 บ้าน โดนทิ้งของ 1,000–5,000 ชิ้น/คน'],cut1:['pCut1','🪓 ตัด 1 บ้าน','ทุกคนในบ้านนั้น −10 ล้าน'],cutAll:['pCutAll','💀 ตัดทุกบ้านที่แพ้','ทุกคน −3 ล้าน'],cut4:['pCut4','🎯 ตัด 4 คน','เลือก 4 คนจากบ้านที่แพ้ คนละ −15 ล้าน']};
const SU={supply:['sSupply','🎁 เติมเสบียง'],shield:['sShield','🛡️ โล่ป้องกัน'],merit:['sMerit','💰 +15,000,000']};
export function startTreeWar({watchState,watchMine,call,now,go,screen,toast,ledger,hold}){
 if(!document.getElementById('twcss')){const s=document.createElement('style');s.id='twcss';s.textContent=CSS;document.head.appendChild(s);}
 const fmt=n=>Math.round(Number(n)||0).toLocaleString('en-US'),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
 const clock=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
 const emb=e=>'images/nb-emb-'+esc(e||'pumpkin')+'.webp';
 const hitDone=new Set(),doneKeys=new Set();let st=null,mine=null,ov=null,ovKey='',mini=new Set(),busy=false,opening=false,warnEl=null,pill=null;
 const stopA=watchState(v=>{st=v;tick();}),stopB=watchMine(v=>{mine=v;tick();});
 const T=setInterval(tick,1000);
 function closeOv(){ov?.remove();ov=null;ovKey='';}
 function open(key,html){if(ovKey===key&&ov)return ov;closeOv();ov=document.createElement('div');ov.className='tw-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.innerHTML='<button class="tw-min" aria-label="ย่อไว้ก่อน" title="ย่อไว้ก่อน">–</button><div class="tw-pc">'+html+'</div>';
  ov.querySelector('.tw-min').onclick=()=>{mini.add(key);closeOv();tick();};document.body.appendChild(ov);ovKey=key;return ov;}
 const pc=()=>ov?.querySelector('.tw-pc');
 function cardsHtml(n,back,cls){return '<div class="tw-cards '+cls+'">'+Array.from({length:n},(_,i)=>'<div class="tw-cw"><button class="tw-card" data-i="'+i+'" aria-label="การ์ดใบที่ '+(i+1)+'"><div class="in"><div class="b" style="background-image:url(images/tw-'+back+'.webp)"></div><div class="f"></div></div><div class="fx"></div></button><div class="tw-cap"></div></div>').join('')+'</div>';}
 /* เปิดการ์ด: ใบที่เลือกพลิกก่อน แล้วค่อยเปิดใบที่เหลือ (จางลง) */
 function reveal(root,deck,i,face,cap){const cs=[...root.querySelectorAll('.tw-card')];cs.forEach((c,j)=>{c.disabled=true;c.querySelector('.f').style.backgroundImage='url(images/tw-'+face(deck[j])+'.webp)';c.parentNode.querySelector('.tw-cap').innerHTML=cap(deck[j]);});
  cs[i].classList.add('flip');cs[i].parentNode.classList.add('show');setTimeout(()=>cs.forEach((c,j)=>{if(j!==i){c.classList.add('flip','dim');c.parentNode.classList.add('show','dimw');}}),700);}
 function timer(el,until){const f=()=>{if(el.isConnected)el.textContent='⏳ '+clock(until-now());};f();const t=setInterval(()=>{if(!el.isConnected)return clearInterval(t);f();},500);}
 const sumSeen=new Set();const lastOk=()=>st?.last&&!st.last.done&&!st.last.cancelled;
 function tick(){const t=now(),scr=screen?.();
  /* 🦇 */
  const b=st?.bat;const batLive=b&&!b.settled&&t<b.end&&st.round;
  if(batLive&&t<b.start&&scr!=='treewar'){if(!warnEl){warnEl=document.createElement('div');warnEl.className='tw-warn';warnEl.setAttribute('role','alert');warnEl.innerHTML='<h3>🦇 ค้างคาวขนลูกอมกำลังมา!</h3><div class="cd"></div><p>ไปหน้าศึกต้นไม้ผี ลากนิ้วฟันลูกอมรับกุศล ×'+b.lvl+' และเก็บขวานไว้ตัดต้นไม้บ้านอื่น</p><button class="tw-big">🌳 ไปฟันลูกอม</button>';
    warnEl.querySelector('button').onclick=()=>{warnEl?.remove();warnEl=null;go?.('treewar');};document.body.appendChild(warnEl);}
   warnEl.querySelector('.cd').textContent=Math.ceil((b.start-t)/1000);}else if(warnEl){warnEl.remove();warnEl=null;}
  /* โดนปล้น/ตัดตอนออนไลน์: เรียก ledger ให้หักและแจ้งทันที (ไม่ทำระหว่างเล่นมินิเกม/แข่ง/ค้างคาว) */
  const hit=mine?.hit;if(hit?.at&&!hitDone.has(hit.at)&&ledger&&!hold?.()&&!(batLive&&scr==='treewar')){hitDone.add(hit.at);ledger().catch(()=>hitDone.delete(hit.at));}
  /* งานที่รอ */
  const jobs=[];
  if(batLive&&t>=b.start&&scr!=='treewar')jobs.push(['bat','🦇 ฟันลูกอม ⏳ '+clock(b.end-t),()=>go?.('treewar')]);
  const L=st?.last;
  if(lastOk()&&t>=L.openAt&&t<L.until+60000){
   if(mine?.merit?.round===L.id&&!mine.merit.done)jobs.push(['merit:'+L.id,'🏆 เลือกแผ่นป้ายกุศล ⏳ '+clock(L.until-t),()=>meritPop(L)]);
   if(mine?.prank?.round===L.id&&!mine.prank.done)jobs.push(['prank:'+L.id,'😈 เลือกการ์ดแกล้ง ⏳ '+clock(L.until-t),()=>prankPop(L)]);}
  const S=st?.surprise;if(S&&!S.done&&mine?.surprise?.bat===S.bat&&!mine.surprise.done&&t<S.until+60000)jobs.push(['surprise:'+S.bat,'🎴 การ์ดเซอร์ไพรส์ ⏳ '+clock(S.until-t),()=>surprisePop(S)]);
  /* สรุปผลรอบ (ทุกคน ครั้งเดียว) */
  if(L&&!L.cancelled&&t>=L.openAt&&t<L.openAt+20*60000&&!ls.get('twSum:'+L.id)&&!sumSeen.has(L.id)&&!jobs.some(j=>j[0].startsWith('merit')||j[0].startsWith('prank'))&&!ov)summaryPop(L);
  for(let i=jobs.length-1;i>=0;i--)if(doneKeys.has(jobs[i][0]))jobs.splice(i,1);
  const auto=jobs.find(j=>j[0]!=='bat'&&!mini.has(j[0]));if(auto&&!ov&&!busy&&!opening)auto[2]();
  if(ov&&ovKey&&!jobs.some(j=>j[0]===ovKey)&&!ovKey.startsWith('sum:')&&!ovKey.startsWith('done:'))closeOv();
  const show=jobs.filter(j=>j[0]!==ovKey);
  if(show.length){if(!pill){pill=document.createElement('button');pill.type='button';pill.className='tw-pill';document.body.appendChild(pill);}
   const j=show[0];pill.textContent=j[1];pill.onclick=()=>{mini.delete(j[0]);j[2]();};}else if(pill){pill.remove();pill=null;}}
 function summaryPop(L){const w=L.winner?L.houses[L.winner]:null;ls.set('twSum:'+L.id,'1');sumSeen.add(L.id);
  const o=open('sum:'+L.id,'<div style="font-size:2.4rem">'+(w?'🏆':'🌙')+'</div><h2>'+(w?esc(w.n)+' ชนะ!':'รอบนี้ไม่มีบ้านชนะ')+'</h2><p>สรุปผลศึกต้นไม้ผี '+(L.id.endsWith('A')?'รอบเช้า':L.id.endsWith('B')?'รอบบ่าย':'')+'</p><table class="tw-rk">'+(L.ranks||[]).map((r,i)=>'<tr><td>'+(i===0&&w?'👑':i+1)+'</td><td><img src="'+emb(r.em)+'" alt=""> '+esc(r.n)+'</td><td class="n">'+fmt(r.score)+'</td></tr>').join('')+'</table>'+(w?'<p>สมาชิก '+esc(w.n)+' ได้เลือกแผ่นป้ายกุศลคนละ 1 ใบ · สุ่ม 1 คนเปิดการ์ดแกล้ง</p>':'')+'<div class="tw-row"><button class="tw-big" data-x>ปิด</button></div>');
  o.querySelector('[data-x]').onclick=closeOv;}
 async function meritPop(L){const key='merit:'+L.id;const o=open(key,'<div style="font-size:2.4rem">🏆</div><h2>'+esc(L.houses[L.winner]?.n)+' ชนะ!</h2><p>ทุกคนในบ้านได้เลือกแผ่นป้ายกุศลคนละ 1 ใบ</p><div class="tm"></div>'+cardsHtml(6,'mBack','c6')+'<p>ไม่เลือกใน 10 นาที ระบบเลือกใบที่น้อยที่สุดให้ · กุศลส่งเข้าไปรษณีย์</p>');
  timer(o.querySelector('.tm'),L.until);
  o.querySelectorAll('.tw-card').forEach(c=>c.onclick=async()=>{if(busy)return;busy=true;o.querySelectorAll('.tw-card').forEach(x=>x.disabled=true);
   try{const r=await call({type:'merit',i:Number(c.dataset.i)});ovKey='done:'+key;doneKeys.add(key);reveal(o,r.deck,r.i,v=>MIMG[v]||'mBronze',v=>fmt(v)+'<small>กุศล</small>');
    setTimeout(()=>{if(!o.isConnected)return;o.querySelector('.tw-pc').insertAdjacentHTML('beforeend','<h2 style="color:#FFD36B">+'+fmt(r.v)+' กุศล</h2><p>📮 ส่งเข้าไปรษณีย์แล้ว</p><div class="tw-row"><button class="tw-big" data-x>✨ เยี่ยม!</button></div>');o.querySelector('[data-x]').onclick=closeOv;},800);}
   catch(e){toast?.(e.message||'ลองใหม่อีกครั้ง');closeOv();}finally{busy=false;}});}
 async function prankPop(L){const key='prank:'+L.id;let me=null;opening=true;try{me=(await call({type:'status'}))?.me?.prank;}catch(e){}finally{opening=false;}
  if(me?.card&&!me.done)return targets(L,me.card,me.choices||[],me.need||0,key);
  const o=open(key,'<div style="font-size:2.2rem">😈</div><h2>ระบบสุ่มให้คุณเป็นคนเลือกการ์ดแกล้ง</h2><p>เปิดการ์ดคว่ำ 1 ใบ ได้ใบไหนใช้ใบนั้น · บ้านที่โดนรู้แค่ว่ามาจากบ้านคุณ ไม่รู้ว่าใครเลือก</p><div class="tm"></div>'+cardsHtml(4,'pBack','c4')+'<p>ไม่เปิดใน 10 นาที ระบบเปิดและเลือกเป้าหมายให้</p>');
  timer(o.querySelector('.tm'),L.until);
  o.querySelectorAll('.tw-card').forEach(c=>c.onclick=async()=>{if(busy)return;busy=true;o.querySelectorAll('.tw-card').forEach(x=>x.disabled=true);
   try{const r=await call({type:'prankFlip',i:Number(c.dataset.i)});reveal(o,r.deck,r.i,k=>PR[k][0],k=>PR[k][1]+'<small>'+PR[k][2]+'</small>');
    setTimeout(()=>{if(!o.isConnected)return;o.querySelector('.tw-pc').insertAdjacentHTML('beforeend','<h2 style="color:#FF5C7A">'+PR[r.card][1]+'</h2><div class="tw-row"><button class="tw-big red" data-n>เลือกเป้าหมาย</button></div>');o.querySelector('[data-n]').onclick=()=>targets(L,r.card,r.choices,r.need,key);},800);}
   catch(e){toast?.(e.message||'ลองใหม่อีกครั้ง');closeOv();}finally{busy=false;}});}
 function targets(L,card,choices,need,key){need=Math.min(need,choices.length);const sel=[];closeOv();
  const o=open(key,'<h2>'+PR[card][1]+'</h2><p>'+PR[card][2]+'</p><div class="tm"></div>'+(need?'<p>เลือก '+need+' '+(card==='cut4'?'คน':'บ้าน')+' (<b class="cn">0</b>/'+need+')</p><div class="tw-pick">'+choices.map(x=>'<button data-id="'+esc(x.id)+'"><img src="'+emb(x.em)+'" alt=""><span>'+esc(x.n)+(card==='cut4'?'<small>'+esc(x.h)+'</small>':'')+'</span></button>').join('')+'</div>':'<p>บ้านที่แพ้ทุกบ้าน ทุกคนโดน −3,000,000</p>')+'<div class="tw-row"><button class="tw-big red" data-go'+(need?' disabled':'')+'>😈 ใช้การ์ด</button></div>');
  timer(o.querySelector('.tm'),L.until);const go=o.querySelector('[data-go]');
  o.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{const id=b.dataset.id,i=sel.indexOf(id);if(i>=0){sel.splice(i,1);b.classList.remove('on');}else if(sel.length<need){sel.push(id);b.classList.add('on');}o.querySelector('.cn').textContent=sel.length;go.disabled=sel.length!==need;});
  go.onclick=async()=>{if(busy)return;busy=true;go.disabled=true;try{await call({type:'prankGo',targets:sel});doneKeys.add(key);closeOv();const d=open('done:'+key,'<div style="font-size:2.4rem">😈</div><h2>ใช้การ์ดแล้ว!</h2><p>ระบบหักให้อัตโนมัติ ทั้งคนที่อยู่และไม่อยู่ในเกม · คนโดนเห็นแจ้งเตือนตอนเข้าเกม · ไม่บอกชื่อคนเลือก</p><div class="tw-row"><button class="tw-big" data-x>ปิด</button></div>');d.querySelector('[data-x]').onclick=closeOv;}
   catch(e){toast?.(e.message||'ลองใหม่อีกครั้ง');go.disabled=sel.length!==need;}finally{busy=false;}};}
 async function surprisePop(S){const key='surprise:'+S.bat;let me=null;opening=true;try{me=(await call({type:'status'}))?.me?.surprise;}catch(e){}finally{opening=false;}
  if(me?.card==='shield'&&!me.done)return shieldPick(S,key);
  const o=open(key,'<div style="font-size:2.2rem">🏅</div><h2>คุณเก็บกุศลจากค้างคาวได้มากที่สุด!</h2><p>เลือกการ์ดเซอร์ไพรส์ 1 ใบ</p><div class="tm"></div>'+cardsHtml(3,'sBack','c3')+'<p>ไม่เลือกใน 10 นาที ระบบเลือกให้</p>');
  timer(o.querySelector('.tm'),S.until);
  o.querySelectorAll('.tw-card').forEach(c=>c.onclick=async()=>{if(busy)return;busy=true;o.querySelectorAll('.tw-card').forEach(x=>x.disabled=true);
   try{const r=await call({type:'surprise',i:Number(c.dataset.i)});reveal(o,r.deck,r.i,k=>SU[k][0],k=>SU[k][1]);
    if(r.card!=='shield'){ovKey='done:'+key;doneKeys.add(key);}
    setTimeout(()=>{if(!o.isConnected)return;if(r.card==='shield'){shieldPick(S,key);return;}const pcx=o.querySelector('.tw-pc');
     pcx.insertAdjacentHTML('beforeend',r.card==='supply'?'<h2 style="color:#FFD36B">🎁 '+esc(r.supply?.name||'เสบียง')+' ×'+fmt(r.supply?.n)+'</h2><p>📮 ส่งเข้าไปรษณีย์แล้ว</p>':'<h2 style="color:#FFD36B">💰 +15,000,000 กุศล</h2><p>📮 ส่งเข้าไปรษณีย์แล้ว</p>');
     pcx.insertAdjacentHTML('beforeend','<div class="tw-row"><button class="tw-big" data-x>เยี่ยม!</button></div>');o.querySelector('[data-x]').onclick=closeOv;},800);}
   catch(e){toast?.(e.message||'ลองใหม่อีกครั้ง');closeOv();}finally{busy=false;}});}
 function shieldPick(S,key){closeOv();const o=open(key,'<img src="images/tw-sShield.webp" alt="" style="width:7rem"><h2 style="color:#FFD36B">🛡️ โล่ป้องกัน</h2><p>เก็บไว้: ถ้าบ้านคุณแพ้รอบนี้ โดนปล้น/ตัดแค่ 50%<br>ทิ้ง: รับ +2,000,000 กุศลทันที (ส่งเข้าไปรษณีย์)</p><div class="tm"></div><div class="tw-row"><button class="tw-big" data-k="1">🛡️ เก็บโล่</button><button class="tw-big ghost" data-k="0">ทิ้ง รับ +2,000,000</button></div><p>ไม่เลือกใน 10 นาที = เก็บโล่ไว้</p>');
  timer(o.querySelector('.tm'),S.until);
  o.querySelectorAll('[data-k]').forEach(b=>b.onclick=async()=>{if(busy)return;busy=true;o.querySelectorAll('[data-k]').forEach(x=>x.disabled=true);try{const r=await call({type:'shield',keep:b.dataset.k==='1'});doneKeys.add(key);closeOv();toast?.(r.keep?'🛡️ เก็บโล่แล้ว บ้านคุณปลอดภัยขึ้นครึ่งหนึ่ง':'💰 ทิ้งโล่ รับ 2,000,000 กุศลในไปรษณีย์');}catch(e){toast?.(e.message||'ลองใหม่อีกครั้ง');o.querySelectorAll('[data-k]').forEach(x=>x.disabled=false);}finally{busy=false;}});}
 return ()=>{clearInterval(T);stopA?.();stopB?.();closeOv();warnEl?.remove();pill?.remove();};
}
