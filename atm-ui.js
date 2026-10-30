/* fix19 🏧 ตู้ ATM กุศล (เปลือกเกม · เปิดจากจุดแตะตู้ในสวนแอดมิน) — ทุกการเปลี่ยนแปลงผ่านคลาวด์ (atmActionCloud) */
{
const CSS=`#atmUi .veil{position:fixed;inset:0;background:rgba(30,12,50,.55);z-index:9500;display:none;align-items:center;justify-content:center;padding:1rem max(16px,env(safe-area-inset-left,0px))}
#atmUi .veil.on{display:flex}
#atmUi .panel{position:relative;width:min(100%,21.5rem);max-height:100%;display:flex;flex-direction:column;gap:.5rem;padding:.6rem .65rem .75rem;border-radius:1.4rem 1.4rem 1rem 1rem;background:linear-gradient(180deg,#FFF6EC,#F3E2CF);border:3px solid #fff;box-shadow:0 0 0 2px #E9B9C4,0 14px 30px rgba(60,30,20,.35),inset 0 -6px 0 #E6CDB4;animation:atm-pop .3s cubic-bezier(.2,1.4,.4,1)}
@keyframes atm-pop{from{transform:scale(.8);opacity:0}}
#atmUi .brand{display:flex;align-items:center;justify-content:center;gap:.4rem;background:linear-gradient(180deg,#F7A9BC,#E98AA2);color:#fff;border-radius:.8rem .8rem .4rem .4rem;padding:.3rem;font:400 1.05rem 'Itim','Mali',system-ui,sans-serif;letter-spacing:.04em;box-shadow:inset 0 -3px 0 rgba(0,0,0,.08)}
#atmUi .brand img{width:1.5rem;height:1.5rem;object-fit:contain}
#atmUi .scr{position:relative;min-height:15.5rem;overflow:hidden;color:#EFFFFD;display:flex;flex-direction:column;gap:.4rem;padding:.6rem .7rem;border-radius:.6rem;background:linear-gradient(160deg,#1F6F78,#155660 55%,#0F4650);border:5px solid #5B4A44;box-shadow:inset 0 0 18px rgba(0,0,0,.45),0 2px 0 #fff;font-size:.78rem}
#atmUi .scr::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.14),transparent 40%);pointer-events:none}
#atmUi .scr h3{margin:0;font:400 1.05rem 'Itim','Mali',system-ui,sans-serif;text-align:center;color:#FFF}
#atmUi .scr p{margin:0;line-height:1.45;text-align:center;color:#C9F1EE}
#atmUi .x{position:absolute;right:-.6rem;top:-.6rem;width:2.1rem;height:2.1rem;border-radius:50%;border:2px solid #fff;background:#E98AA2;color:#fff;z-index:2;box-shadow:0 2px 6px rgba(0,0,0,.25)}
#atmUi .slots{display:flex;justify-content:space-between;align-items:center;gap:.6rem;padding:0 .3rem;font-size:.58rem;color:#9A7A68;font-weight:700}
#atmUi .slots div{flex:1;display:flex;flex-direction:column;align-items:center;gap:.15rem}
#atmUi .slots i{display:block;width:80%;height:.5rem;border-radius:999px;background:#3E302B;box-shadow:inset 0 2px 3px #000,0 1px 0 #fff}
#atmUi .slots .cardin i{background:linear-gradient(90deg,#3E302B 0 15%,#7A4FD0 15% 85%,#3E302B 85%)}
#atmUi .keys{display:grid;grid-template-columns:repeat(4,1fr);gap:.3rem}
#atmUi .keys button{border:0;border-radius:.5rem;padding:.42rem 0;font:700 .95rem 'Mali',system-ui,sans-serif;background:linear-gradient(180deg,#FFFFFF,#EADCCB);color:#5B4A44;box-shadow:0 2px 0 #C9B39C;touch-action:manipulation}
#atmUi .keys button:active{transform:translateY(2px);box-shadow:none}
#atmUi .keys .k-x{background:linear-gradient(180deg,#FF9AA8,#E4677D);color:#fff;font-size:.7rem}
#atmUi .keys .k-c{background:linear-gradient(180deg,#FFE08A,#F2B33D);color:#5a3800;font-size:.7rem}
#atmUi .keys .k-o{background:linear-gradient(180deg,#9BE3B8,#4FB883);color:#fff;font-size:.7rem}
#atmUi .keys.off button{opacity:.55}
#atmUi .rslot{position:relative;height:0}
#atmUi .rcw{position:absolute;left:12%;right:12%;top:0;z-index:5;overflow:hidden;height:0;transition:height 1.4s ease-out;filter:drop-shadow(0 6px 10px rgba(0,0,0,.3))}
#atmUi .rcw.on{height:13rem}
#atmUi .bt{border:0;border-radius:.7rem;padding:.45rem .5rem;font:400 .85rem 'Itim','Mali',system-ui,sans-serif;background:linear-gradient(180deg,#FFD36B,#E8962A);color:#4a2700;box-shadow:0 2px 0 #9a5a10}
#atmUi .bt.g{background:rgba(255,255,255,.14);color:#fff;box-shadow:none;border:1.5px solid rgba(255,255,255,.35)}
#atmUi .bt.r{background:linear-gradient(180deg,#FF7A93,#C63A5A);color:#fff;box-shadow:0 2px 0 #7a1a30}
#atmUi .bt:disabled{opacity:.45}
#atmUi .grid2{display:grid;grid-template-columns:1fr 1fr;gap:.35rem}
#atmUi .bal{background:rgba(0,0,0,.25);border-radius:.6rem;padding:.35rem;text-align:center}
#atmUi .bal b{display:block;font:400 1.35rem 'Itim','Mali',system-ui,sans-serif;color:#FFF;font-variant-numeric:tabular-nums}
#atmUi .pin{display:flex;justify-content:center;gap:.35rem;margin:.2rem 0}
#atmUi .pin i{width:2rem;height:2.3rem;border-radius:.4rem;border:1.5px solid rgba(255,255,255,.7);display:grid;place-items:center;font-style:normal;font-size:1rem;background:rgba(255,255,255,.06)}
#atmUi .pad{display:grid;grid-template-columns:repeat(3,1fr);gap:.25rem}
#atmUi .pad button{border:1.5px solid rgba(255,226,140,.45);background:rgba(255,255,255,.08);border-radius:.55rem;padding:.3rem 0;font:600 .9rem 'Mali',system-ui,sans-serif;color:#fff;touch-action:manipulation}
#atmUi .pad button.go{background:linear-gradient(180deg,#FFD36B,#E8962A);color:#4a2700;border-color:#fff;font-size:.72rem}
#atmUi .list{display:flex;flex-direction:column;gap:.25rem;overflow:auto;min-height:0}
#atmUi .list button{display:flex;justify-content:space-between;align-items:center;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.07);border-radius:.6rem;padding:.35rem .5rem;font-size:.75rem;text-align:left}
#atmUi .list button.on{border-color:#FFE29A;background:rgba(255,226,140,.18)}
#atmUi .list small{color:#BFE9E5;font-size:.62rem}
#atmUi .amt{display:flex;flex-wrap:wrap;gap:.25rem;justify-content:center}
#atmUi .amt button{border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.07);border-radius:999px;padding:.2rem .55rem;font-size:.7rem}
#atmUi .amt button.on{background:#FFE29A;color:#4a2700;border-color:#FFE29A}
#atmUi .row{display:flex;justify-content:space-between;gap:.5rem;font-variant-numeric:tabular-nums}
#atmUi .row.t{border-top:1px dashed rgba(255,255,255,.4);padding-top:.25rem;font-weight:700;color:#FFE9A8}
#atmUi .warn{background:rgba(210,80,106,.25);border:1px solid rgba(255,120,150,.6);border-radius:.5rem;padding:.25rem .4rem;text-align:center;font-weight:700}
#atmUi .lim{font-size:.64rem;color:#BFE9E5;text-align:center}
/* receipt */

#atmUi .rcp{position:relative;background:#FFF8EA;color:#6E4B3A;border-radius:.4rem .4rem 0 0;padding:.45rem .55rem .7rem;font-size:.62rem;line-height:1.4;box-shadow:0 4px 10px rgba(0,0,0,.3);-webkit-mask:linear-gradient(#000,#000) top/100% calc(100% - 6px) no-repeat,conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) bottom/10px 6px repeat-x;mask:linear-gradient(#000,#000) top/100% calc(100% - 6px) no-repeat,conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) bottom/10px 6px repeat-x}
#atmUi .rcp b.h{display:block;text-align:center;font:400 .85rem 'Itim','Mali',system-ui,sans-serif;color:#7A2FD8}
#atmUi .rcp .r{display:flex;justify-content:space-between;gap:.4rem;font-variant-numeric:tabular-nums;border-bottom:1px dashed #EADBC5;padding:.05rem 0}
#atmUi .rcp .r.t{font-weight:700;color:#B02A44;border:0}
#atmUi .rcp .st{position:absolute;right:.4rem;top:.3rem;width:1.8rem;opacity:.85;transform:rotate(12deg)}

#atmUi .coin{position:absolute;width:5rem;z-index:4;pointer-events:none;animation:atm-fly 1.2s ease-out forwards}
@keyframes atm-fly{from{transform:translate(-50%,0) scale(.6);opacity:1}to{transform:translate(-50%,-120px) scale(1.1);opacity:0}}
#atmUi .list{max-height:9.5rem}#atmUi .srch{width:100%;box-sizing:border-box;border:1.5px solid rgba(255,255,255,.35);background:rgba(0,0,0,.2);color:#fff;border-radius:.5rem;padding:.3rem .5rem;font:inherit}#atmUi .srch::placeholder{color:#BFE9E5}
#atmUi .amt input{width:6.5rem;border:1.5px solid rgba(255,255,255,.35);background:rgba(0,0,0,.2);color:#fff;border-radius:999px;padding:.2rem .5rem;font:inherit;text-align:center}
#atmUi .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.3rem}#atmUi .grid3 .bt{font-size:.78rem;padding:.45rem .2rem}
#atmUi .fxb{display:flex;align-items:center;justify-content:space-between;gap:.4rem;background:rgba(0,0,0,.28);border:1px solid rgba(255,226,140,.35);border-radius:.6rem;padding:.3rem .5rem;font-variant-numeric:tabular-nums}
#atmUi .fxb b{font:400 1.25rem 'Itim','Mali',system-ui,sans-serif;color:#FFE9A8}#atmUi .fxb .up{color:#8DF0B0;font-weight:700;font-size:.68rem}#atmUi .fxb .dn{color:#FF9DB0;font-weight:700;font-size:.68rem}#atmUi .fxb small{display:block;color:#BFE9E5;font-size:.6rem}
#atmUi .err{color:#FFB3C1;text-align:center;font-weight:700}
@media (prefers-reduced-motion:reduce){#atmUi *{animation:none!important;transition:none!important}}`;
const fmt=n=>Math.round(Number(n)||0).toLocaleString('en-US'),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const IMG={coins:'images/atm-coins.webp',card:'images/atm-card.webp'};
const feeRate=()=>.12,fee=a=>Math.round(a*feeRate(a));
let API=null,root=null,keyH=null,V=null,changed=false,roster=null;
const $=s=>root.querySelector(s);
function mount(){if(!document.getElementById('atmCss')){const st=document.createElement('style');st.id='atmCss';st.textContent=CSS;document.head.appendChild(st);}
 root=document.getElementById('atmUi');if(!root){root=document.createElement('div');root.id='atmUi';document.body.appendChild(root);}
 root.innerHTML='<div class="veil on" id="atmVeil"><div class="panel" id="pn"><button class="x" id="cx" aria-label="ปิด">✕</button><div class="brand"><img src="'+IMG.coins+'" alt="">ATM กุศล</div><div class="scr" id="scr"></div><div class="slots"><div class="cardin" id="cslot"><i></i>ช่องบัตร</div><div><i></i>ช่องใบเสร็จ</div></div><div class="rslot" id="rslot"></div><div class="keys off" id="keys">'+['1','2','3','x','4','5','6','c','7','8','9','o','','0','',''].map(k=>k===''?'<span></span>':'<button type="button" data-k="'+k+'" class="'+(k==='x'?'k-x':k==='c'?'k-c':k==='o'?'k-o':'')+'">'+(k==='x'?'ยกเลิก':k==='c'?'ลบ':k==='o'?'ตกลง':k)+'</button>').join('')+'</div></div></div>';
 $('#cx').onclick=close;$('#atmVeil').onclick=e=>{if(e.target.id==='atmVeil')close();};$('#keys').onclick=e=>{const b=e.target.closest('[data-k]');if(b&&keyH)keyH(b.dataset.k);};}
function close(){if(root)root.innerHTML='';const api=API;API=null;api?.onClose?.(changed);}
function set(h){keyH=null;$('#keys').classList.add('off');$('#rslot').innerHTML='';$('#scr').innerHTML=h;}
function busy(t){set('<h3>⏳</h3><p>'+(t||'กำลังติดต่อธนาคารกุศล…')+'</p>');}
async function call(input){try{const out=await API.cloud('atm',input);if(out?.atm)V=out.atm;if(Number.isFinite(out?.serverNow)&&API)API.offset=out.serverNow-Date.now();return out;}catch(e){set('<h3>ทำรายการไม่สำเร็จ</h3><p class="err">'+esc(e.message||'ลองใหม่อีกครั้ง')+'</p><button class="bt" id="b">กลับ</button>');$('#b').onclick=home;return null;}}
function pinPad(title,sub,done,back){let p='';const draw=()=>{$('#scr').innerHTML='<h3>'+title+'</h3><p>'+sub+'</p><div class="pin">'+[0,1,2,3].map(i=>'<i>'+(p[i]?'●':'')+'</i>').join('')+'</div><p style="font-size:.66rem">กดปุ่มตัวเลขด้านล่าง แล้วกด ตกลง</p>';};
 set('');draw();$('#keys').classList.remove('off');keyH=k=>{if(k==='c')p=p.slice(0,-1);else if(k==='x'){(back||home)();return;}else if(k==='o'){if(p.length===4){keyH=null;done(p);}return;}else if(p.length<4)p+=k;draw();};}
async function start(){busy();const out=await call({type:'status'});if(!out)return;
 if(!V.open)return set('<h3>🏧 ตู้ ATM ปิดอยู่</h3><p>ปิดให้บริการชั่วคราว ลองใหม่ภายหลังนะ</p><button class="bt g" id="b">ปิด</button>'),($('#b').onclick=close);
 if(!V.hasCard)return set('<h3>ATM กุศล</h3><img src="'+IMG.card+'" alt="" style="width:46%;margin:0 auto;opacity:.5;filter:grayscale(.6)"><p>ต้องมี 💳 บัตร ATM กุศล ถึงจะใช้ตู้ได้</p><p style="color:#FFE29A">รับบัตรได้จากยัยหนูเท่านั้น</p><button class="bt g" id="b">ปิด</button>'),($('#b').onclick=close);
 if(!V.pinSet)return setPin();home();}
function setPin(){set('<h3>💳 เปิดใช้บัตร</h3><img src="'+IMG.card+'" alt="" style="width:46%;margin:0 auto"><p>บัตร ATM กุศลจากยัยหนู ใช้ได้จนจบซีซั่น<br>ตั้งรหัส PIN 4 หลัก (ตั้งครั้งเดียว)</p><button class="bt" id="b">ตั้งรหัส PIN</button>');
 $('#b').onclick=()=>pinPad('ตั้งรหัส PIN','ใช้ทุกครั้งที่โอน · จำไว้ให้ดีนะ',p1=>pinPad('ยืนยัน PIN','ใส่อีกครั้ง',async p2=>{if(p1!==p2){set('<h3>❌ PIN ไม่ตรงกัน</h3><button class="bt" id="b">ลองใหม่</button>');$('#b').onclick=setPin;return;}busy();if(await call({type:'pin',pin:p1}))home();}));}
function home(){if(!V)return start();const t=V.today||{},ppl=Object.keys(t).length,nm=u=>esc(roster?.find(r=>r.uid===u)?.name||'เพื่อน');
 set('<h3>ATM กุศล</h3><div class="bal">กุศลของคุณ<b>'+fmt(V.merit)+'</b></div>'+fxBoard()+'<div class="grid3"><button class="bt" id="t">💸 โอน</button><button class="bt" id="fx">💱 แลกเงิน</button><button class="bt g" id="h">🧾 ประวัติ</button></div><div class="lim">💸 โอนได้ไม่จำกัดครั้ง ไม่จำกัดคน · ครั้งละ 1–100 ล้าน · ค่าธรรมเนียม 12%'+(ppl?'<br>วันนี้โอนแล้ว: '+Object.keys(t).map(u=>nm(u)+' '+t[u]+' ครั้ง').join(' · '):'')+'<br>💱 แลกเงินได้ไม่จำกัด ไม่มีค่าธรรมเนียม</div>'+(V.locked?'<p class="err">ใส่ PIN ผิดหลายครั้ง ล็อกถึง '+new Date(V.locked).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})+'</p>':''));
 $('#t').onclick=pick;$('#h').onclick=hist;$('#fx').onclick=()=>fxAmount();fxTick();}
async function pick(){if(!roster){busy('กำลังโหลดรายชื่อ…');try{roster=(await API.roster())||[];}catch(e){roster=[];}}
 const t=V.today||{},full=false,list=roster.filter(r=>r&&r.uid&&!r.admin&&r.uid!==API.uid).sort((a,b)=>String(a.name).localeCompare(String(b.name),'th'));let q='';
 const draw=()=>{const rows=list.filter(r=>!q||String(r.name).includes(q));$('#ls').innerHTML=rows.map(r=>{const n=t[r.uid]||0,dis=false;return '<button type="button" data-u="'+esc(r.uid)+'"'+(dis?' disabled style="opacity:.4"':'')+'><span>'+esc(r.name)+'</span><small>'+(n?'วันนี้ '+n+' ครั้ง':'')+'</small></button>';}).join('')||'<p>ไม่พบชื่อ</p>';};
 set('<h3>💸 โอนให้ใคร</h3>'+(full?'<p style="color:#FFE29A">วันนี้ครบ 3 คนแล้ว โอนได้เฉพาะคนเดิม</p>':'')+'<input class="srch" id="sq" placeholder="🔍 ค้นชื่อ" autocomplete="off"><div class="list" id="ls"></div><button class="bt g" id="bk">กลับ</button>');
 draw();$('#sq').oninput=e=>{q=e.target.value.trim();draw();};$('#ls').onclick=e=>{const b=e.target.closest('[data-u]');if(b&&!b.disabled)amount(list.find(r=>r.uid===b.dataset.u));};$('#bk').onclick=home;}
function amount(f,a0){let a=a0||0;const Q=[1,5,10,20,50,100];const draw=()=>{const fe=fee(a),tot=a+fe,ok=a>=1e6&&a<=1e8&&tot<=V.merit;
  set('<h3>โอนให้ '+esc(f.name)+'</h3><div class="amt">'+Q.map(q=>'<button type="button" data-q="'+q+'" class="'+(a===q*1e6?'on':'')+'">'+q+' ล้าน</button>').join('')+'<input id="am" inputmode="numeric" placeholder="ล้าน" value="'+(a&&!Q.includes(a/1e6)?a/1e6:'')+'"></div>'+(a?'<div class="row"><span>ยอดโอน</span><span>'+fmt(a)+'</span></div><div class="row"><span>ค่าธรรมเนียม '+Math.round(feeRate(a)*100)+'%</span><span>'+fmt(fe)+'</span></div><div class="row t"><span>หักรวม</span><span>'+fmt(tot)+'</span></div>'+(tot>V.merit?'<div class="warn">กุศลไม่พอ</div>':''):'<p>เลือกจำนวน หรือพิมพ์เป็น “ล้าน”</p>')+'<div class="lim">ไม่เกิน 10 ล้าน 10% · ไม่เกิน 50 ล้าน 15% · เกิน 50 ล้าน 20%</div><div class="grid2"><button class="bt g" id="bk">กลับ</button><button class="bt" id="nx"'+(ok?'':' disabled')+'>ถัดไป</button></div>');
  root.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{a=+b.dataset.q*1e6;draw();});$('#am').onchange=e=>{const v=Math.round(Number(e.target.value)*1e6);a=Number.isSafeInteger(v)&&v>0?Math.min(v,1e8):0;draw();};$('#bk').onclick=pick;$('#nx').onclick=()=>confirm(f,a);};draw();}
function confirm(f,a){const fe=fee(a),tot=a+fe;
 set('<h3>ยืนยันโอนกุศล</h3><p>ให้ <b style="color:#FFE29A">'+esc(f.name)+'</b> ใช่ไหม?</p><div class="row"><span>ยอดโอน</span><span>'+fmt(a)+'</span></div><div class="row"><span>ค่าธรรมเนียม '+Math.round(feeRate(a)*100)+'%</span><span>'+fmt(fe)+'</span></div><div class="row t"><span>คุณจะถูกหักรวม</span><span>'+fmt(tot)+'</span></div><div class="row"><span>กุศลคงเหลือหลังโอน</span><span>'+fmt(V.merit-tot)+'</span></div><div class="warn">⚠️ โอนแล้วยกเลิกไม่ได้</div><div class="grid2"><button class="bt g" id="bk">กลับ</button><button class="bt r" id="go">ใส่ PIN ยืนยัน</button></div>');
 $('#bk').onclick=()=>amount(f,a);$('#go').onclick=()=>pinPad('ใส่ PIN','ยืนยันโอน '+fmt(a)+' ให้ '+esc(f.name),async p=>{busy('กำลังโอน…');const out=await call({type:'transfer',to:f.uid,amount:a,pin:p});if(!out)return;
  if(out.pinWrong){set('<h3>❌ PIN ไม่ถูกต้อง</h3><p>ยังไม่ได้โอน'+(V.locked?' · ตู้ล็อกบัตรชั่วคราว':'')+'</p><button class="bt" id="b">'+(V.locked?'กลับ':'ลองใหม่')+'</button>');$('#b').onclick=()=>V.locked?home():confirm(f,a);return;}
  changed=true;done(out.receipt);},()=>confirm(f,a));}
const when=t=>new Date(t).toLocaleString('th-TH',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
function receiptHtml(r){if(r.kind==='fx')return '<div class="rcp"><img class="st" src="'+IMG.card+'" alt=""><div><b class="h">🧾 ใบเสร็จแลกเงิน</b><div class="r"><span>เลขที่</span><span>'+esc(r.id)+'</span></div><div class="r"><span>เวลา</span><span>'+when(r.at)+'</span></div><div class="r"><span>ผู้แลก</span><span>'+esc(r.fn)+'</span></div><div class="r"><span>เหรียญฮาโลวีน</span><span>−'+fmt(r.n)+'</span></div><div class="r"><span>หม้อยาแม่มด</span><span>−'+fmt(r.n)+'</span></div><div class="r"><span>เรท</span><span>'+rate2(r.rate)+'</span></div><div class="r t"><span>ได้รับ (ไปรษณีย์)</span><span>+'+fmt(r.amount)+'</span></div></div></div>';
 return '<div class="rcp"><img class="st" src="'+IMG.card+'" alt=""><div><b class="h">🧾 ใบเสร็จโอนกุศล</b><div class="r"><span>เลขที่</span><span>'+esc(r.id)+'</span></div><div class="r"><span>เวลา</span><span>'+when(r.at)+'</span></div><div class="r"><span>จาก</span><span>'+esc(r.fn)+'</span></div><div class="r"><span>ถึง</span><span>'+esc(r.tn)+'</span></div><div class="r"><span>ยอดโอน</span><span>'+fmt(r.amount)+'</span></div><div class="r"><span>ค่าธรรมเนียม</span><span>'+fmt(r.fee)+'</span></div><div class="r t"><span>หักรวม</span><span>'+fmt(r.total)+'</span></div></div></div>';}
function slip(r){$('#rslot').innerHTML='<div class="rcw" id="rcw">'+receiptHtml(r)+'</div>';$('#rcw').onclick=()=>$('#rcw')?.remove();requestAnimationFrame(()=>requestAnimationFrame(()=>$('#rcw')?.classList.add('on')));}
function done(r){set('<h3>✅ โอนสำเร็จ</h3><p>'+fmt(r.amount)+' กุศล เข้าไปรษณีย์ของ '+esc(r.tn)+' แล้ว</p><div class="grid2"><button class="bt g" id="h">🧾 ประวัติ</button><button class="bt" id="ok">เสร็จ</button></div><p style="font-size:.64rem">แตะใบเสร็จเพื่อเก็บ</p>');
 const c=document.createElement('img');c.src=IMG.coins;c.className='coin';c.alt='';c.style.left='50%';c.style.top='30%';$('#pn').appendChild(c);setTimeout(()=>c.remove(),1300);slip(r);$('#ok').onclick=home;$('#h').onclick=hist;API?.toast?.('🏧 โอนสำเร็จ');}
function hist(){const h=V.hist||[];set('<h3>🧾 ประวัติของฉัน</h3>'+(h.length?'<div class="list" id="ls">'+h.map((r,i)=>'<button type="button" data-i="'+i+'"><span>'+(r.dir==='fx'?'💱 แลก '+fmt(r.n)+' ชุด':r.dir==='in'?'📥 จาก '+esc(r.fn):'💸 ถึง '+esc(r.tn))+'<br><small>'+when(r.at)+'</small></span><span'+(r.dir==='in'||r.dir==='fx'?' style="color:#9FF0C0">+'+fmt(r.amount):'>−'+fmt(r.total))+'</span></button>').join('')+'</div><p style="font-size:.64rem">แตะรายการเพื่อดูใบเสร็จ</p>':'<p>ยังไม่มีรายการ</p>')+'<button class="bt g" id="bk">กลับ</button>');
 $('#bk').onclick=home;$('#ls')?.addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(b)slip(h[+b.dataset.i]);});}
/* ---------- 💱 แลกเงิน (เหรียญฮาโลวีน + หม้อยาแม่มด → กุศล) ---------- */
const rate2=c=>(Number(c)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fxNow=()=>Date.now()+(API?.offset||0);
function fxBoard(){const f=V?.fx;if(!f)return '';const d=f.rate-f.prev,up=d>=0;return '<div class="fxb"><div><small>💱 เรทแลกเงินตอนนี้ (ต่อ 1 ชุด)</small><b>'+rate2(f.rate)+'</b></div><div style="text-align:right"><span class="'+(up?'up':'dn')+'">'+(up?'▲ +':'▼ −')+rate2(Math.abs(d))+'</span><small id="fxT">เปลี่ยนเรทใน –</small></div></div>';}
let fxT=0;function fxTick(){clearInterval(fxT);const f=V?.fx;if(!f)return;const run=()=>{const el=root&&$('#fxT');if(!el){clearInterval(fxT);return;}const l=Math.max(0,f.next-fxNow());if(l<=0){clearInterval(fxT);call({type:'status'}).then(o=>{if(o&&root&&$('#fxT'))home();});return;}el.textContent='เปลี่ยนเรทใน '+Math.floor(l/60000)+':'+String(Math.floor(l/1000)%60).padStart(2,'0');};run();fxT=setInterval(run,1000);}
function fxAmount(n0){const f=V.fx,cap=Math.min(f.max,f.coins,f.cauldron),left=f.perDay-f.used;let n=Math.min(n0||0,cap);const Q=[100,1000,10000];
 const draw=()=>{const get=Math.floor(n*f.rate/100),ok=n>=1&&n<=cap&&left>0;
  set('<h3>💱 แลกเงิน</h3><div class="row t" style="border:0;padding:0"><span>เรท (ต่อ 1 ชุด)</span><span>'+rate2(f.rate)+'</span></div><div class="lim">มี 🪙 เหรียญฮาโลวีน '+fmt(f.coins)+' · 🧪 หม้อยาแม่มด '+fmt(f.cauldron)+'<br>1 ชุด = เหรียญ 1 + หม้อยา 1 · แลกได้ไม่จำกัด · ไม่มีค่าธรรมเนียม</div>'
   +(left<=0?'<div class="warn">วันนี้แลกครบ '+f.perDay+' ครั้งแล้ว</div>':cap<1?'<div class="warn">ต้องมีเหรียญฮาโลวีนและหม้อยาแม่มดอย่างละ 1 ขึ้นไป</div>':'<div class="amt">'+Q.filter(q=>q<=cap).map(q=>'<button type="button" data-q="'+q+'" class="'+(n===q?'on':'')+'">'+fmt(q)+'</button>').join('')+'<button type="button" data-q="'+cap+'" class="'+(n===cap?'on':'')+'">สูงสุด '+fmt(cap)+'</button><input id="am" inputmode="numeric" placeholder="จำนวนชุด" value="'+(n&&!Q.includes(n)&&n!==cap?n:'')+'"></div>'
    +(n?'<div class="row t"><span>ได้รับ '+fmt(n)+' ชุด</span><span>'+fmt(get)+' กุศล</span></div>':''))
   +'<div class="grid2"><button class="bt g" id="bk">กลับ</button><button class="bt" id="nx"'+(ok?'':' disabled')+'>ถัดไป</button></div>');
  root.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{n=+b.dataset.q;draw();});const am=$('#am');if(am)am.onchange=e=>{const v=Math.floor(Number(String(e.target.value).replace(/,/g,'')));n=Number.isSafeInteger(v)&&v>0?Math.min(v,cap):0;draw();};
  $('#bk').onclick=home;$('#nx').onclick=()=>fxConfirm(n);};draw();}
function fxConfirm(n,note){const f=V.fx,get=Math.floor(n*f.rate/100);
 set('<h3>ยืนยันแลกเงิน</h3>'+(note?'<div class="warn">'+note+'</div>':'')+'<div class="row"><span>🪙 เหรียญฮาโลวีน</span><span>−'+fmt(n)+'</span></div><div class="row"><span>🧪 หม้อยาแม่มด</span><span>−'+fmt(n)+'</span></div><div class="row"><span>เรท</span><span>'+rate2(f.rate)+'</span></div><div class="row t"><span>ได้รับ (เข้าไปรษณีย์)</span><span>+'+fmt(get)+'</span></div><div class="warn">⚠️ แลกแล้วยกเลิกไม่ได้</div><div class="grid2"><button class="bt g" id="bk">กลับ</button><button class="bt r" id="go">ใส่ PIN ยืนยัน</button></div>');
 $('#bk').onclick=()=>fxAmount(n);$('#go').onclick=()=>pinPad('ใส่ PIN','ยืนยันแลก '+fmt(n)+' ชุด',async p=>{busy('กำลังแลกเงิน…');const out=await call({type:'fx',n,rate:f.rate,pin:p});if(!out)return;
  if(out.rateChanged){const nn=Math.min(n,V.fx.coins,V.fx.cauldron);return fxConfirm(nn,'เรทเพิ่งเปลี่ยนเป็น '+rate2(V.fx.rate)+' ตรวจยอดใหม่อีกครั้ง');}
  if(out.pinWrong){set('<h3>❌ PIN ไม่ถูกต้อง</h3><p>ยังไม่ได้แลก'+(V.locked?' · ตู้ล็อกบัตรชั่วคราว':'')+'</p><button class="bt" id="b">'+(V.locked?'กลับ':'ลองใหม่')+'</button>');$('#b').onclick=()=>V.locked?home():fxConfirm(n);return;}
  changed=true;fxDone(out.receipt);},()=>fxConfirm(n));}
function fxDone(r){set('<h3>✅ แลกเงินสำเร็จ</h3><p>'+fmt(r.amount)+' กุศล เข้าไปรษณีย์ของคุณแล้ว<br>กดรับที่ 📮 ไปรษณีย์</p><div class="grid2"><button class="bt g" id="h">🧾 ประวัติ</button><button class="bt" id="ok">เสร็จ</button></div><p style="font-size:.64rem">แตะใบเสร็จเพื่อเก็บ</p>');
 const c=document.createElement('img');c.src=IMG.coins;c.className='coin';c.alt='';c.style.left='50%';c.style.top='30%';$('#pn').appendChild(c);setTimeout(()=>c.remove(),1300);slip(r);$('#ok').onclick=home;$('#h').onclick=hist;API?.toast?.('💱 แลกเงินสำเร็จ');}
window.atmOpen=api=>{API=api;changed=false;roster=null;V=null;mount();start();};
}
