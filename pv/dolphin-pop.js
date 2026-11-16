/* fix51 🐬 หน้าต่างกระทงโลมา (ใช้ร่วม: บ่อตกปลา · ท่าตกหมึก · กระเป๋าหน้าฟาร์ม)
   __dolphinPop({k})            → เพิ่งตกได้: โมเดลหมุน 360° (ลากนิ้วหมุนเองได้) + ปุ่ม "ลอยเลย" / "เก็บไว้ก่อน" — ลอยได้ตรงนั้น ไม่ต้องออกจากหน้า
   __dolphinPop({mode:'bag',k}) → เปิดจากกระเป๋า: เลือกแบบ + จำนวน แล้วลอยทีเดียว
   ภาพหมุนเป็นแผ่นภาพ 20 เฟรม (ไม่เปิดฉาก 3D เพิ่ม → ไม่หน่วง ไม่ร้อน) · หยุดหมุนเองเมื่อปิดหน้าต่าง/พับจอ */
(function(){
 if(window.__dolphinPop)return;
 const DOL={dol1:{n:'กระทงโลมามาลัย',pts:10,c:'#4fb3ee'},dol2:{n:'กระทงโลมาดาวเรือง',pts:30,c:'#ff86b0'},dol3:{n:'กระทงโลมานางรำ',pts:50,c:'#a678ea'},dol4:{n:'กระทงโลมาเทวา',pts:100,c:'#eaa91f'}};
 const BASE=(()=>{try{const s=document.currentScript&&document.currentScript.src;if(s)return new URL('../images/dolphin/',s).href;}catch(e){}return 'images/dolphin/';})();
 const host=()=>{try{return window.__HOST||parent.__HOST;}catch(e){return window.__HOST||null;}};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const CSS=`.dlp-ov{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:radial-gradient(circle at 50% 42%,rgba(140,215,255,.30),rgba(8,20,48,.72) 68%);font-family:Mali,'Noto Sans Thai',system-ui,sans-serif;-webkit-tap-highlight-color:transparent;animation:dlpf .25s ease-out}
@keyframes dlpf{from{opacity:0}to{opacity:1}}
.dlp{position:relative;width:min(17.5rem,90vw);box-sizing:border-box;text-align:center;color:#5b3a22;background:linear-gradient(180deg,#fffdf6,#eaf7ff);border-radius:24px;padding:.7rem .8rem .8rem;box-shadow:0 14px 36px rgba(0,0,0,.5),inset 0 0 0 2px #fff,inset 0 0 0 4px var(--dc,#7fd0ff);animation:dlpin .45s cubic-bezier(.3,1.5,.5,1) both}
@keyframes dlpin{from{transform:translateY(18px) scale(.86);opacity:0}to{transform:none;opacity:1}}
.dlp .x{position:absolute;right:-.4rem;top:-.4rem;width:1.9rem;height:1.9rem;border-radius:50%;border:2px solid #fff;background:#ff8fab;color:#fff;font-weight:700;font-size:.9rem;line-height:1;padding:0;box-shadow:0 3px 0 rgba(0,0,0,.2);cursor:pointer}
.dlp h3{margin:.05rem 0 0;font-size:1rem;line-height:1.35;color:#2f7fb8}.dlp .nm{font-weight:700;font-size:.92rem}.dlp .sub{font-size:.72rem;color:#8a7a66;line-height:1.4;margin:.1rem 0 .35rem}
.dlp .tw{position:relative;width:9.4rem;height:9.4rem;margin:.1rem auto 0;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}
.dlp .tw::before{content:"";position:absolute;left:8%;right:8%;bottom:6%;height:22%;border-radius:50%;background:radial-gradient(ellipse at center,rgba(90,180,255,.55),rgba(90,180,255,0) 70%);animation:dlpw 2.2s ease-in-out infinite}
@keyframes dlpw{0%,100%{transform:scale(.9);opacity:.7}50%{transform:scale(1.08);opacity:1}}
.dlp .tn{position:absolute;inset:0;background-repeat:no-repeat;background-size:500% 400%;animation:dlpb 2.4s ease-in-out infinite}
@keyframes dlpb{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.dlp .hint{font-size:.62rem;color:#a9b6c4;margin-top:-.2rem}
.dlp .pt{display:inline-block;margin:.25rem 0 .1rem;padding:.08rem .7rem;border-radius:999px;color:#fff;font-weight:700;font-size:.8rem;background:var(--dc,#4fb3ee);box-shadow:0 2px 0 rgba(0,0,0,.15)}
.dlp .bt{display:flex;gap:.4rem;margin-top:.45rem}.dlp .bt button{flex:1;border:0;border-radius:999px;padding:.55rem .3rem;font:700 .88rem Mali,'Noto Sans Thai',system-ui,sans-serif;cursor:pointer}
.dlp .go{color:#fff;background:linear-gradient(180deg,#7fd6ff,#3aa0f0);box-shadow:0 3px 0 #2a7cc4}.dlp .go:disabled{filter:grayscale(.5);opacity:.7}.dlp .kp{color:#8a5a2e;background:#f4e6d2;box-shadow:0 3px 0 #dcc6a6}
.dlp .msg{font-size:.74rem;line-height:1.45;margin:.35rem 0 0;padding:.35rem .5rem;border-radius:12px;background:#fff1f4;color:#b03a5c}
.dlp .ok{background:#eafaf1;color:#2b7a55}
.dlp .ks{display:grid;grid-template-columns:repeat(4,1fr);gap:.3rem;margin:.35rem 0 .1rem}.dlp .ks button{position:relative;border:2px solid #e6eef6;background:#fff;border-radius:14px;padding:.2rem 0 .1rem;font:700 .68rem Mali,sans-serif;color:#6a5a48;cursor:pointer}.dlp .ks button.on{border-color:var(--dc,#4fb3ee);background:#f1f9ff}.dlp .ks button:disabled{opacity:.35}
.dlp .ks i{display:block;width:2.5rem;height:2.5rem;margin:0 auto;background-repeat:no-repeat;background-size:500% 400%;background-position:25% 0}
.dlp .qty{display:flex;align-items:center;justify-content:center;gap:.5rem;margin-top:.3rem}.dlp .qty button{width:2rem;height:2rem;border-radius:50%;border:0;background:#e3f2ff;color:#2f7fb8;font-weight:700;font-size:1.1rem;cursor:pointer}.dlp .qty b{min-width:2.2rem;font-size:1.05rem}
.dlp.done .tn{animation:dlpgo 1.6s ease-in forwards}@keyframes dlpgo{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(8rem,-1.2rem) scale(.55);opacity:0}}
@media (prefers-reduced-motion: reduce){.dlp,.dlp-ov,.dlp .tn,.dlp .tw::before{animation:none!important}}`;
 let styled=false;const style=()=>{if(styled)return;styled=true;const s=document.createElement('style');s.textContent=CSS;document.head.appendChild(s);};
 const sprite=k=>BASE+k+'-turn.webp';const NF=20;
 /* ภาพหมุน: เดินเฟรมด้วยตัวจับเวลา ~10 เฟรม/วิ · ลากเพื่อหมุนเอง · คืนฟังก์ชันหยุด */
 function spin(box,k){const el=box.querySelector('.tn');let f=0,drag=false,x0=0,f0=0,idle=0,alive=true;el.style.backgroundImage='url("'+sprite(k)+'")';
  const set=()=>{const c=((f%NF)+NF)%NF;el.style.backgroundPosition=(c%5)*25+'% '+(Math.floor(c/5)*100/3)+'%';};set();
  const iv=setInterval(()=>{if(!alive||drag||document.hidden||Date.now()<idle)return;f++;set();},100);
  const dn=e=>{drag=true;x0=e.clientX;f0=f;try{box.setPointerCapture(e.pointerId);}catch(_){}} ,mv=e=>{if(!drag)return;f=f0-Math.round((e.clientX-x0)/9);set();},up=()=>{if(drag){drag=false;idle=Date.now()+900;}};
  box.addEventListener('pointerdown',dn);box.addEventListener('pointermove',mv);box.addEventListener('pointerup',up);box.addEventListener('pointercancel',up);
  return {stop(){alive=false;clearInterval(iv);},kind(k2){k=k2;el.style.backgroundImage='url("'+sprite(k)+'")';}};}
 const queue=[];let open=false;
 function show(o){if(open){queue.push(o);return;}open=true;style();const bag=o&&o.mode==='bag';let k=DOL[o&&o.k]?o.k:'dol1',have=null,n=1,sp=null,busy=false,nbName='';
  const ov=document.createElement('div');ov.className='dlp-ov';ov.id='dlpOv';document.body.appendChild(ov);
  const close=()=>{if(sp)sp.stop();ov.remove();open=false;try{o&&o.onClose&&o.onClose();}catch(e){}const nx=queue.shift();if(nx)setTimeout(()=>show(nx),250);};
  const cloud=async input=>{const H=host();if(!H||!H.cloud)throw new Error('รีเฟรชเกม 1 ครั้งแล้วลองใหม่นะ');return H.cloud('loyd',input);};
  function paint(msg,okMsg){const d=DOL[k];if(sp)sp.stop();
   ov.innerHTML='<div class="dlp" style="--dc:'+d.c+'"><button class="x" id="dlpX" aria-label="ปิด">✕</button><h3>'+(bag?'🐬 ลอยกระทงโลมา':'🐬 ได้กระทงโลมา!')+'</h3><div class="nm">'+esc(d.n)+(bag&&have?' <small style="font-weight:400;color:#8a7a66">มี '+(have[k]||0)+' ตัว</small>':'')+'</div>'
    +'<div class="tw" id="dlpT"><div class="tn"></div></div><div class="hint">ลากซ้าย–ขวาเพื่อหมุนดูรอบตัว</div><span class="pt">ลอยแล้วบ้านได้ +'+d.pts+' แต้ม</span>'
    +(bag&&have?'<div class="ks">'+Object.keys(DOL).map(x=>'<button data-k="'+x+'" class="'+(x===k?'on':'')+'" '+((have[x]||0)<1?'disabled':'')+' style="--dc:'+DOL[x].c+'"><i style="background-image:url(&quot;'+sprite(x)+'&quot;)"></i>×'+(have[x]||0)+'</button>').join('')+'</div><div class="qty"><button id="dlpM" aria-label="ลด">−</button><b id="dlpN">'+n+'</b><button id="dlpP" aria-label="เพิ่ม">+</button></div>':'')
    +(msg?'<div class="msg'+(okMsg?' ok':'')+'">'+msg+'</div>':(bag?'':'<div class="sub">ลอยตรงนี้ได้เลย ไม่ต้องออกจากหน้านี้<br>กระทงจะไปอยู่ในแม่น้ำลอยกระทงของบ้านเรา</div>'))
    +'<div class="bt"><button class="kp" id="dlpK">'+(bag?'ปิด':'🎒 เก็บไว้ก่อน')+'</button><button class="go" id="dlpG">🌊 ลอยเลย'+(bag&&n>1?' ×'+n:'')+'</button></div></div>';
   sp=spin(ov.querySelector('#dlpT'),k);ov.querySelector('#dlpX').onclick=close;ov.querySelector('#dlpK').onclick=close;ov.onclick=e=>{if(e.target===ov&&!busy)close();};
   const g=ov.querySelector('#dlpG');if(bag&&have&&(have[k]||0)<1)g.disabled=true;g.onclick=go;
   if(bag&&have){ov.querySelectorAll('.ks [data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;n=1;paint();});const mx=()=>Math.max(1,Math.min(20,have[k]||0));ov.querySelector('#dlpM').onclick=()=>{n=Math.max(1,n-1);paint();};ov.querySelector('#dlpP').onclick=()=>{n=Math.min(mx(),n+1);paint();};}}
  async function go(){if(busy)return;busy=true;const g=ov.querySelector('#dlpG');g.disabled=true;g.textContent='กำลังลอย…';
   try{const out=await cloud({type:'float',k,n:bag?n:1});busy=false;const fl=out&&out.floated;if(!fl)throw new Error('ลอยไม่สำเร็จ ลองใหม่อีกครั้งนะ');if(out.have)have=out.have;nbName=(out.nb&&out.nb.name)||'';
    const card=ov.querySelector('.dlp');card.classList.add('done');const m=document.createElement('div');m.className='msg ok';m.innerHTML='🌊 ลอยแล้ว '+fl.n+' ลำ · บ้าน'+(nbName?' '+esc(nbName):'เรา')+' <b>+'+fl.pts+' แต้ม</b><br>ป้ายชื่อบนกระทง: '+esc(fl.name||'');const old=card.querySelector('.msg,.sub');if(old)old.replaceWith(m);else card.querySelector('.bt').before(m);
    const bt=card.querySelector('.bt');const left=bag&&have?Object.values(have).reduce((a,b)=>a+(b||0),0):0;bt.innerHTML=(left>0?'<button class="go" id="dlpMore">ลอยตัวต่อไป</button>':'')+'<button class="kp" id="dlpOk">เรียบร้อย</button>';bt.querySelector('#dlpOk').onclick=close;const mo=bt.querySelector('#dlpMore');if(mo)mo.onclick=()=>{k=Object.keys(DOL).find(x=>(have[x]||0)>0)||k;n=1;paint();};
    try{o&&o.onFloat&&o.onFloat(fl,out);}catch(e){}if(!bag)setTimeout(()=>{if(document.body.contains(ov)&&!ov.querySelector('#dlpG'))close();},3200);}
   catch(e){busy=false;const t=String((e&&e.message)||'ลอยไม่สำเร็จ');paint(esc(/กำลังทำรายการ/.test(t)?'ระบบกำลังบันทึกรายการก่อนหน้า รอ 2–3 วินาทีแล้วกดลอยอีกครั้งนะ':t)+(bag?'':'<br><b>กระทงโลมาอยู่ในกระเป๋าแล้ว</b> ลอยทีหลังได้จากกระเป๋า'));}}
  if(bag){ov.innerHTML='<div class="dlp"><h3>🐬 ลอยกระทงโลมา</h3><div class="sub">กำลังเปิดกระเป๋า…</div></div>';cloud({type:'status'}).then(s=>{have=(s&&s.have)||{};if(!(have[k]>0))k=Object.keys(DOL).find(x=>(have[x]||0)>0)||k;const tot=Object.values(have).reduce((a,b)=>a+(b||0),0);paint(tot<1?'ยังไม่มีกระทงโลมาในกระเป๋า':(s&&!s.nb?'ต้องอยู่ในเนเบอร์ฮู้ดก่อน ถึงจะลอยได้':(s&&!s.open?'เทศกาลลอยกระทงยังไม่เปิด เก็บไว้ก่อนนะ':'')))}).catch(e=>{have={};paint(esc((e&&e.message)||'เปิดไม่สำเร็จ'));});}
  else paint();}
 window.__dolphinPop=show;window.__dolphinInfo=DOL;
})();
