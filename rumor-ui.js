/* fix15 ข่าวลือในหมู่บ้าน — ป๊อปอัปบนหน้าหลัก (ทับทุกหน้าเกม) ฟังเอกสาร rumors/{uid} เอกสารเดียว ไม่ถามซ้ำ
   ทุกการกดส่งไปเซิร์ฟเวอร์ (rumorActionCloud) · เวลา 10 นาทีนับจากเวลาเซิร์ฟเวอร์ (cur.until) */
import {RUMOR_GOOD,RUMOR_BAD,RUMOR_GROUPS,rumorName} from './rumor-engine.js?v=ss3-fix16';
const css=`
#rmr{position:fixed;inset:0;z-index:90;overflow-y:auto;padding:max(4vh,env(safe-area-inset-top,0px)) 4vw 6vh;display:flex;flex-direction:column;animation:rmfade .25s;font-family:'Mali','Itim',sans-serif;container-type:inline-size}
#rmr.bad{background:radial-gradient(circle at 50% 40%,rgba(40,22,14,.35),rgba(20,10,6,.75))}
#rmr.good{background:radial-gradient(circle at 50% 40%,rgba(255,190,215,.35),rgba(70,25,45,.68))}
@keyframes rmfade{from{opacity:0}}
#rmr .pop{position:relative;width:min(76vw,330px);margin:auto;container-type:inline-size}
#rmr .g-top{position:relative;height:30cqw;margin-bottom:-11cqw;z-index:2;pointer-events:none}
#rmr .g-rib{position:absolute;left:-2cqw;top:0;width:72cqw;aspect-ratio:428/255;background:url(images/rumor-ribbon.webp) center/contain no-repeat;animation:rmswing 3s ease-in-out infinite;transform-origin:50% 20%}
#rmr .g-rib span{position:absolute;left:12%;right:12%;top:52%;transform:translateY(-50%) rotate(-1deg);text-align:center;font-family:'Chonburi','Mali',serif;font-size:4.6cqw;color:#8A4A12;text-shadow:0 1px 0 #FFF2B8,0 0 6px rgba(255,240,180,.8);white-space:nowrap}
@keyframes rmswing{50%{transform:rotate(1.5deg) translateY(-1px)}}
#rmr .g-birds{position:absolute;right:-2cqw;top:-1cqw;width:32cqw;aspect-ratio:1;background:url(images/rumor-birds.webp) center/contain no-repeat;animation:rmhop 1.8s ease-in-out infinite}
@keyframes rmhop{0%,100%{transform:translateY(0)}45%{transform:translateY(-1.6cqw) rotate(-2deg)}55%{transform:translateY(0)}}
#rmr .letter{position:relative;width:100%;aspect-ratio:416/411;background:url(images/rumor-letter.webp) center/100% 100% no-repeat;animation:rmpop .5s cubic-bezier(.3,1.6,.5,1);filter:drop-shadow(0 3cqw 4cqw rgba(90,20,50,.4))}
@keyframes rmpop{from{transform:scale(.6) rotate(-4deg);opacity:0}}
#rmr .letter .txt{position:absolute;left:21%;right:15%;top:30%;bottom:27%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;transform:rotate(-1.2deg);overflow:hidden}
#rmr .letter .from{font-size:3.8cqw;color:#C46D8E;margin-bottom:1.2cqw}
#rmr .story{font-weight:500;line-height:1.5;margin:0;white-space:pre-wrap;word-break:break-word}
#rmr .letter .story{font-size:5cqw;color:#6A3A48}
#rmr .letter .reward{position:absolute;left:21%;right:15%;bottom:16%;display:flex;justify-content:center;transform:rotate(-1.2deg)}
#rmr .letter .reward b{font-family:'Chonburi','Mali',serif;font-weight:400;font-size:5cqw;color:#B5641A;background:linear-gradient(180deg,#FFF6D2,#FFE39A);border:.6cqw solid #fff;border-radius:999px;padding:.4cqw 3.4cqw;box-shadow:0 1cqw 2cqw rgba(181,100,26,.3)}
#rmr .spark{position:absolute;font-size:4cqw;animation:rmtw 1.8s ease-in-out infinite;pointer-events:none}
@keyframes rmtw{50%{transform:scale(1.5) rotate(25deg);opacity:.4}}
#rmr .tray{position:relative;margin-top:2cqw;display:grid;gap:2cqw}
#rmr .clock{display:flex;align-items:center;justify-content:center;gap:2cqw}
#rmr .hg{width:8cqw;aspect-ratio:87/140;background:center/contain no-repeat;animation:rmflip 10s ease-in-out infinite}
@keyframes rmflip{0%,90%{transform:rotate(0)}100%{transform:rotate(180deg)}}
#rmr .time{font-size:5.2cqw;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;text-shadow:0 .4cqw 1cqw rgba(0,0,0,.45);min-width:16cqw}
#rmr .time.hot{color:#FFD0C8;animation:rmblink 1s steps(2) infinite}@keyframes rmblink{50%{opacity:.5}}
#rmr .gacts{display:grid;grid-template-columns:1fr auto;gap:2cqw}
#rmr button{font-family:inherit}
#rmr .g1{border:0;border-radius:4cqw;padding:3cqw;font-size:5cqw;font-weight:700;cursor:pointer;background:linear-gradient(180deg,#FF9DBA,#F0709A);color:#fff;box-shadow:0 1.2cqw 0 #C24E78,0 2cqw 4cqw rgba(0,0,0,.25)}
#rmr .gx{border:.6cqw solid #fff;border-radius:4cqw;width:15cqw;font-size:5cqw;cursor:pointer;background:rgba(255,240,246,.9);color:#C77A92}
#rmr .conf{position:absolute;inset:-20% 0 0;pointer-events:none}
#rmr .conf i{position:absolute;top:0;width:2cqw;height:3cqw;border-radius:.5cqw;animation:rmfall 1.6s ease-in forwards}
@keyframes rmfall{to{transform:translateY(160cqw) rotate(540deg)}}
#rmr .b-wrap{position:relative;padding-top:21cqw}
#rmr .b-crows{position:absolute;right:-3cqw;top:-1cqw;width:40cqw;aspect-ratio:320/305;background:url(images/rumor-crows.webp) center/contain no-repeat;z-index:3;pointer-events:none}
#rmr .news{position:relative;width:100%;aspect-ratio:432/468;background:url(images/rumor-paper.webp) center/100% 100% no-repeat;animation:rmdrop .5s cubic-bezier(.3,1.5,.5,1);filter:drop-shadow(0 3cqw 4cqw rgba(0,0,0,.5))}
@keyframes rmdrop{from{transform:translateY(-25%) rotate(-6deg);opacity:0}}
#rmr .news .mast{position:absolute;left:19%;top:16.5%;font-family:'Chonburi','Mali',serif;font-size:3.8cqw;color:#FFF4DE;background:linear-gradient(180deg,#4A362B,#2E211B);border-radius:1.2cqw;padding:.6cqw 3cqw;box-shadow:0 .6cqw 1.4cqw rgba(0,0,0,.3);white-space:nowrap;transform:rotate(-1deg)}
#rmr .news .ed{position:absolute;left:19%;top:24.8%;font-size:2.9cqw;color:#6E5844;background:rgba(243,231,204,.9);border-radius:1cqw;padding:0 1.4cqw}
#rmr .news .txt{position:absolute;left:15%;right:13%;top:34%;bottom:19%;display:flex;flex-direction:column;justify-content:center;padding:0 1cqw;border-radius:4cqw;background:rgba(243,231,204,.86);box-shadow:0 0 4cqw 3cqw rgba(243,231,204,.86);overflow:hidden}
#rmr .news .story{font-size:4.9cqw;color:#3A2A22}
#rmr .news .pen{position:absolute;right:9%;bottom:8.5%;font-size:4cqw;font-weight:700;color:#C8372D;background:rgba(255,240,232,.92);border:.5cqw dashed rgba(200,55,45,.6);border-radius:999px;padding:.4cqw 2.6cqw}
#rmr .stamp{position:absolute;display:grid;place-items:center;background:center/contain no-repeat;font-family:'Chonburi','Mali',serif;pointer-events:none}
#rmr .stamp.tag{left:-3cqw;top:-2cqw;width:28cqw;aspect-ratio:285/184;background-image:url(images/rumor-stamp-tag.webp);transform:rotate(-8deg);color:#C8372D;font-size:4.6cqw;animation:rmstamp .4s cubic-bezier(.3,1.8,.5,1) .35s both;z-index:2}
#rmr .stamp.tag span{transform:rotate(-13deg)}
#rmr .stamp.big{left:50%;top:48%;transform:translate(-50%,-50%) rotate(-10deg);z-index:4;animation:rmstampb .45s cubic-bezier(.3,1.8,.5,1) both}
#rmr .stamp.real{width:50cqw;aspect-ratio:1;background-image:url(images/rumor-stamp-real.webp);color:#C8372D;font-size:8cqw}
#rmr .stamp.fake{width:66cqw;aspect-ratio:285/184;background-image:url(images/rumor-stamp-fake.webp);color:#2F8A4C;font-size:8cqw}
#rmr .stamp.fake span{transform:rotate(-14deg)}
@keyframes rmstamp{from{transform:scale(2.6) rotate(-8deg);opacity:0}}@keyframes rmstampb{from{transform:translate(-50%,-50%) scale(2.4) rotate(-10deg);opacity:0}}
#rmr .acts{display:grid;gap:2cqw}
#rmr .b1{border:0;border-radius:4cqw;padding:3cqw;font-size:5cqw;font-weight:700;cursor:pointer;background:linear-gradient(180deg,#F4B85A,#E2902E);color:#fff;box-shadow:0 1.2cqw 0 #A9631A,0 2cqw 4cqw rgba(0,0,0,.25)}
#rmr .b2{border:.5cqw solid rgba(255,255,255,.55);border-radius:4cqw;padding:2.4cqw;font-size:4.4cqw;cursor:pointer;background:rgba(40,25,18,.55);color:#F3E6D2}
#rmr .b1:disabled,#rmr .b2:disabled,#rmr .g1:disabled{opacity:.45;cursor:not-allowed}
#rmr .fix{background:#FBF3E2;border-radius:4cqw;padding:3cqw;display:grid;gap:2cqw;border:.6cqw solid #E4D2AE;box-shadow:0 2cqw 4cqw rgba(0,0,0,.3);color:#4E3526}
#rmr .fix[hidden]{display:none}
#rmr .fix .hd{font-size:3.6cqw;color:#957863;text-align:center}
#rmr .need{background:#fff;border:.5cqw solid #E9D8BE;border-radius:3cqw;padding:2cqw 2.6cqw;font-size:3.8cqw}
#rmr .need .t{display:flex;justify-content:space-between;gap:2cqw}
#rmr .ok{color:#2F8A4C}#rmr .no{color:#C8372D}
#rmr .chips{display:flex;flex-wrap:wrap;gap:1.2cqw;margin-top:1.4cqw}
#rmr .chips button{border:.5cqw solid #E9D8BE;background:#FFFDF8;border-radius:999px;padding:.6cqw 2.4cqw;font-size:3.4cqw;cursor:pointer;color:#4E3526}
#rmr .chips button[aria-pressed=true]{border-color:#6B3FA0;background:#F1E8FB}
#rmr .chips button:disabled{opacity:.4}
#rmr .mix{font-size:3.3cqw;color:#957863;margin-top:1cqw}
.rmtoast{position:fixed;left:50%;bottom:12%;transform:translateX(-50%);z-index:95;background:rgba(255,251,245,.97);border:3px solid #fff;border-radius:16px;padding:.55rem .9rem;font:600 .9rem 'Mali',sans-serif;color:#4E3526;text-align:center;box-shadow:0 8px 22px rgba(0,0,0,.25);width:min(86vw,340px);animation:rmfade .3s}
@media (prefers-reduced-motion:reduce){#rmr *{animation:none!important}}`;
let styled=false;const fmt=n=>(n<0?'−':'')+Math.abs(n).toLocaleString('en-US');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){document.querySelector('.rmtoast')?.remove();const d=document.createElement('div');d.className='rmtoast';d.innerHTML=t;document.body.appendChild(d);setTimeout(()=>d.remove(),4200);}
function fit(box){const p=box?.querySelector('.story');if(!p)return;let f=parseFloat(getComputedStyle(p).fontSize);while(box.scrollHeight>box.clientHeight+1&&f>9){f-=.5;p.style.fontSize=f+'px';}}
const full=p=>/^(sub|pend)\./.test(p)?p:'bag.'+p;
const have=(g,p)=>{const v=full(p).split('.').reduce((o,k)=>o?.[k],g);return Number.isSafeInteger(Number(v))&&Number(v)>0?Number(v):0;};
/* api: {watch(fn)→stop, act(input)→Promise, game()→game, coins()→n, now()→serverNow} */
export function startRumors(api){
 if(!styled){const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);const ln=document.createElement('link');ln.rel='stylesheet';ln.href='https://fonts.googleapis.com/css2?family=Chonburi&display=swap';document.head.appendChild(ln);styled=true;}
 let cur=null,timer=0,busy=false,shownId=null,settling=null,finishing=false;
 const now=()=>api.now?api.now():Date.now();
 const close=()=>{clearInterval(timer);document.getElementById('rmr')?.remove();shownId=null;finishing=false;};
 async function send(input,quiet){if(busy)return null;busy=true;try{return await api.act(input);}catch(e){if(!quiet)toast('⚠️ '+esc(e.message||'ทำรายการไม่สำเร็จ'));return null;}finally{busy=false;}}
 let tries=0;
 function tickEl(el,until){const left=Math.max(0,Math.ceil((until-now())/1000));el.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');el.classList.toggle('hot',left<=60);return left;}
 async function settle(c){if(settling===c.id)return;settling=c.id;const out=await send({type:'settle'},true);
  if(!out){settling=null;tries++;return;}tries=0;
  if(c.k==='B'&&out.result?.merit)toast('⌛ ไม่ได้แก้ข่าวลือทันเวลา<br>ถือว่ายอมรับ <b>'+fmt(out.result.merit)+'</b> กุศล');else if(c.k==='G')toast('⌛ ข่าวดีหายไปแล้ว ไม่ได้กดรับภายใน 10 นาที');}
 function showGood(c){const [txt,amt]=RUMOR_GOOD[c.i]||[];if(txt==null)return;const v=document.createElement('div');v.id='rmr';v.className='good';
  v.innerHTML=`<div class="pop" role="dialog" aria-label="ข่าวลือดีๆ"><div class="g-top"><div class="g-rib"><span>ข่าวลือดีๆ ในหมู่บ้าน</span></div><div class="g-birds"></div></div>
   <div class="letter"><span class="spark" style="left:2%;top:40%">✨</span><span class="spark" style="right:0;top:48%;animation-delay:.6s">💖</span><span class="spark" style="left:30%;bottom:2%;animation-delay:1.1s">⭐</span>
    <div class="txt"><div class="from">🐦 นกน้อยกระซิบมาว่า…</div><p class="story">${esc(txt)}</p></div><div class="reward"><b>🙏 +${fmt(amt)} กุศล</b></div></div>
   <div class="tray"><div class="clock"><span class="hg" style="background-image:url(images/rumor-hg-pink.webp)"></span><span class="time"></span></div>
    <div class="gacts"><button class="g1" id="rmOk">🎁 กดรับ</button><button class="gx" id="rmNo" aria-label="ปิด">✕</button></div></div></div>`;
  document.body.appendChild(v);fit(v.querySelector('.letter .txt'));const el=v.querySelector('.time');
  timer=setInterval(()=>{if(tickEl(el,c.until)<=0){close();settle(c);}},500);tickEl(el,c.until);
  v.querySelector('#rmOk').onclick=async()=>{finishing=true;const out=await send({type:'claim'});if(!out){finishing=false;return;}clearInterval(timer);v.querySelectorAll('button').forEach(b=>b.disabled=true);
   if(out.res!=='ok'){close();return toast('⌛ ข่าวดีหมดเวลาแล้ว');}
   const conf=document.createElement('div');conf.className='conf';conf.innerHTML=Array.from({length:44},(_,k)=>`<i style="left:${Math.random()*100}%;background:${['#FF9DB7','#FFD95A','#7ED6A0','#9DC8FF','#C7A4EE'][k%5]};animation-delay:${Math.random()*.4}s"></i>`).join('');v.querySelector('.pop').append(conf);
   setTimeout(()=>{close();toast('🎉 ได้รับ <b>+'+fmt(out.result?.merit||amt)+'</b> กุศล');},1400);};
  v.querySelector('#rmNo').onclick=async()=>{const out=await send({type:'close'});if(out)close();};}
 function showBad(c){const [txt,pen,needs]=RUMOR_BAD[c.i]||[];if(txt==null)return;const v=document.createElement('div');v.id='rmr';v.className='bad';
  v.innerHTML=`<div class="pop" role="dialog" aria-label="ข่าวลือ"><div class="b-wrap"><div class="b-crows"></div>
   <div class="news"><div class="stamp tag"><span>ข่าวลือ!</span></div><div class="mast">ซุบซิบหมู่บ้าน</div><div class="ed">ฉบับพิเศษ · เขาลือกันว่า…</div>
    <div class="txt"><p class="story">${esc(txt)}</p></div><div class="pen">ถ้าเป็นข่าวจริง −${fmt(pen)} กุศล</div></div></div>
   <div class="tray"><div class="clock"><span class="hg" style="background-image:url(images/rumor-hg-wood.webp)"></span><span class="time"></span></div>
    <div class="acts"><button class="b1" id="rmFix">🙅 ข่าวมั่ว!</button><button class="b2" id="rmAcc">มันก็คงจะเป็นอย่างที่เขาลือกันแหละ</button></div>
    <div class="fix" id="rmFx" hidden></div></div></div>`;
  document.body.appendChild(v);fit(v.querySelector('.news .txt'));const el=v.querySelector('.time'),paper=v.querySelector('.news'),sel={};
  timer=setInterval(()=>{if(tickEl(el,c.until)<=0){clearInterval(timer);v.querySelectorAll('button').forEach(b=>b.disabled=true);paper.insertAdjacentHTML('beforeend','<div class="stamp big real"><span>ข่าวจริง!</span></div>');setTimeout(()=>{close();settle(c);},1500);}},500);tickEl(el,c.until);
  const stampDone=(cls,word,msg)=>{finishing=true;clearInterval(timer);v.querySelectorAll('button').forEach(b=>b.disabled=true);paper.insertAdjacentHTML('beforeend',`<div class="stamp big ${cls}"><span>${word}</span></div>`);v.scrollTo({top:0,behavior:'smooth'});setTimeout(()=>{close();toast(msg);},1600);};
  v.querySelector('#rmAcc').onclick=async()=>{finishing=true;const out=await send({type:'accept'});if(!out)finishing=false;if(out)stampDone('real','ข่าวจริง!','😔 ยอมรับข่าวนี้ <b>'+fmt(out.result?.merit||-pen)+'</b> กุศล');};
  function drawFix(){const fx=v.querySelector('#rmFx'),g=api.game(),coins=api.coins();let all=true;
   fx.innerHTML='<div class="hd">🧺 ใช้ของในกระเป๋าเพื่อแก้ข่าว · ไม่เสียกุศล</div>'+needs.map(([label,q,spec,mode],j)=>{
    if(spec==='$coin'){const ok=coins>=q;all=all&&ok;return `<div class="need"><div class="t"><span>${esc(label)} ×${q}</span><span class="${ok?'ok':'no'}">มี ${fmt(coins)}</span></div></div>`;}
    if(!spec.startsWith('@')){const h=have(g,spec),ok=h>=q;all=all&&ok;return `<div class="need"><div class="t"><span>${esc(label)} ×${fmt(q)}</span><span class="${ok?'ok':'no'}">มี ${fmt(h)}</span></div></div>`;}
    const pool=(RUMOR_GROUPS[spec.slice(1)]||[]).map(p=>({p,n:have(g,p)}));
    if(mode==='one'){const s=sel[j],ok=s!=null&&have(g,s)>=q;all=all&&ok;return `<div class="need"><div class="t"><span>${esc(label)} ×${fmt(q)}</span><span class="${ok?'ok':'no'}">${s?'เลือก '+esc(rumorName(s)):'เลือกชนิด'}</span></div><div class="chips">${pool.filter(x=>x.n>0).map(x=>`<button data-j="${j}" data-p="${esc(x.p)}" aria-pressed="${s===x.p}" ${x.n<q?'disabled':''}>${esc(rumorName(x.p))} ${fmt(x.n)}</button>`).join('')||'<span class="no">ไม่มีของชนิดนี้</span>'}</div></div>`;}
    const tot=pool.reduce((a,x)=>a+x.n,0),ok=tot>=q;all=all&&ok;let r=q;const take=[...pool].sort((a,b)=>b.n-a.n).map(x=>{const t=Math.min(x.n,r);r-=t;return t?rumorName(x.p)+' '+fmt(t):'';}).filter(Boolean).join(' · ');
    return `<div class="need"><div class="t"><span>${esc(label)} ×${fmt(q)}</span><span class="${ok?'ok':'no'}">มีรวม ${fmt(tot)}</span></div><div class="mix">${ok?'จะหัก: '+esc(take):'ของไม่พอ'}</div></div>`;}).join('')
    +`<button class="b1" id="rmPay" ${all?'':'disabled'}>📢 แก้ข่าว! ยืนยันใช้ของ</button>`;
   fx.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{sel[b.dataset.j]=b.dataset.p;drawFix();});
   fx.querySelector('#rmPay').onclick=async()=>{finishing=true;const out=await send({type:'fix',picks:{...sel}});if(!out)finishing=false;if(out)stampDone('fake','ข่าวปลอม!','📢 แก้ข่าวสำเร็จ! ไม่เสียกุศล');};}
  v.querySelector('#rmFix').onclick=()=>{const fx=v.querySelector('#rmFx');fx.hidden=!fx.hidden;if(!fx.hidden){drawFix();fx.scrollIntoView({behavior:'smooth',block:'nearest'});}};}
 let last=null;
 function onDoc(d){last=d;cur=d?.cur||null;if(!cur){if(shownId&&!finishing)close();return;}if(shownId===cur.id)return;
  if(api.paused?.())return;
  if(now()>cur.until+3000){if(tries<=30)settle(cur);return;}close();shownId=cur.id;cur.k==='B'?showBad(cur):showGood(cur);}
 const stop=api.watch(onDoc),poll=setInterval(()=>{if(cur&&shownId!==cur.id&&settling!==cur.id)onDoc(last);},3000);
 return ()=>{clearInterval(poll);stop?.();close();};
}
