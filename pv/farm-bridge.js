/* ตัวอย่างซีซัน 4: หน้าฟาร์มซีซัน 3 ตัวจริง (ปุ่ม เมนู กระเป๋า ทางลัด ระบบปลูก/รดน้ำ/เก็บ) แต่ฉากเป็นฟาร์ม 3D ซีซัน 4
   ฉาก 3D อยู่ใน farm3d/ · แตะแปลง/ต้นไม้/อาคารใน 3D → เรียกฟังก์ชันเดิมของหน้านี้ */
(()=>{
 const f=document.createElement('iframe');f.id='f3d';f.title='ฟาร์ม 3D';f.src='farm3d/index.html?embed=1&h=28995398';
 f.style.cssText='position:fixed;inset:0;width:100%;height:100%;border:0;z-index:0;background:#7fb85a';
 document.body.insertBefore(f,document.body.firstChild);
 const css=document.createElement('style');css.textContent='#view{visibility:hidden!important;pointer-events:none!important}body{background:#7fb85a}';document.head.appendChild(css);
 const W3=()=>{try{return f.contentWindow;}catch(e){return null;}};
 const sync=()=>{const w=W3();if(!w||!w.__s3sync)return;const vis=!!visiting;const src=vis?(window.__ffc||{}):S.farms||{};
  const pl=a=>(a||[]).slice(0,12).map(p=>{if(!p)return null;let st=0,pr=0;try{st=pstage(p);pr=pprog(p);}catch(e){st=p.ph==='ready'?4:2;}return {c:p.c,ph:p.ph,st,pr,angel:!!p.angel,magic:!!(p.magicUntil>Date.now()),pk:(p.pk&&p.pk.k)||null};});
  let fr=[];try{const F4=window.__F4;fr=(vis?(window.friendFarm&&window.friendFarm.fruit&&window.friendFarm.fruit.plots)||[]:(S.fruit&&S.fruit.plots)||[]).map(p=>{if(!p)return null;const I=F4?F4.info(p):{grow:1,fr:0};return {t:p.t,grow:I.grow,fr:I.fr};});}catch(e){}
  let hn=null;try{if(!vis&&S.honey&&S.honey.v){const h=S.honey,n=Date.now();let ph;try{ph=typeof hPhase==='function'?hPhase():null;}catch(e){ph=null;}if(!ph){if(h.leaveAt){ph=(n<h.leaveAt&&!h.fail)?'parked':n<h.leaveAt+3000?'leaving':'gone';}else ph=n<(h.arriveAt||0)?'coming':n<(h.until||0)?'parked':'late';}if(ph!=='home'&&ph!=='gone')hn={v:h.v,ph,arriveAt:h.arriveAt||n,until:h.until||n,leaveAt:h.leaveAt||0,fail:!!h.fail,req:(h.req||[]).map(r=>{let img=null,ok=false;try{img=fImg(r);}catch(e){}try{ok=fHave(r)>=r[2];}catch(e){}return {img,n:r[2],ok};})};}}catch(e){console.error('honey sync',e);}
  /* S4 ข้อ 93: ตอนเยี่ยม เห็นรถ/เรือน้ำผึ้งของเพื่อนจอดอยู่ (ไม่เห็นรายการของ) */try{if(vis&&window.__fhoney){const h=window.__fhoney,n=Date.now();let ph;if(h.leaveAt){ph=(n<h.leaveAt&&!h.fail)?'parked':n<h.leaveAt+4000?'leaving':'gone';}else ph=n<h.arriveAt?'coming':n<h.until?'parked':'late';if(ph!=='gone')hn={v:h.v,ph,arriveAt:h.arriveAt,until:h.until,leaveAt:h.leaveAt||0,fail:!!h.fail,req:[],vis:1};}}catch(e){}
  try{if(w.__visitLayout){const ff=vis&&window.friendFarm;if(ff&&ff.deco!==undefined){if(ff.deco)window.__fdeco=ff.deco;}w.__visitLayout(vis?(window.__fdeco||'{}'):null,vis?(ff&&ff.owner)||'x':null);if(!vis)window.__fdeco=null;}}catch(e){}
  try{if(!vis){const lv=Math.min(3,Math.max(1,Number(S.lv)||1));if(w.__setFarmHouseLv&&w.__hlvSent!==lv){w.__hlvSent=lv;w.__setFarmHouseLv(lv);}}}catch(e){}
  try{w.__s3sync({ul2:vis?!(window.friendFarm&&window.friendFarm.ul2===false):!!((S.unl||{}).f2),dr:(vis?[]:(window.__dropRows||[])),tr:(window.__trashRows||[]),tl:window.__trashLeft,/* fix36 🗑️ */fa:!!(vis&&window.friendFarm&&window.friendFarm.atm),h:hn,f1:pl(src[1]),f2:pl(src[2]),fr,g:(()=>{try{if(vis){const t=(window.friendFarm&&window.friendFarm.prankState)||{};return {vis:1,bat:!!t.bat,signs:+t.signs||0,sc:(+t.scareUntil||0)>Date.now()?(+t.scareKind||1):0,scU:+t.scareUntil||0};}const t=(S.sub&&S.sub.prank)||{};return {vis:0,bat:!!t.bat,signs:(t.signs||[]).length,sc:(+t.scareUntil||0)>Date.now()?(+t.scareKind||1):0,scU:+t.scareUntil||0};}catch(e){return null;}})()});}catch(e){console.warn(e);}};
 setInterval(()=>{if(!document.hidden)sync();},450);
 let lastFarm=0;const followFarm=()=>{const w=W3();if(!w||!w.__s3farm||farm===lastFarm)return;lastFarm=farm;try{w.__s3farm(farm===3?2:farm);}catch(e){}};
 setInterval(()=>{if(!document.hidden)followFarm();},300);
 const useFarm=n=>{if(farm!==n){farm=n;try{render();}catch(e){}}lastFarm=n;};
 window.__S4B={
  ready(){sync();lastFarm=farm;followFarm();/* fix29: เริ่มที่หน้าประตูบ้าน ไม่วาร์ปไปแปลงผัก (ปัดเปลี่ยนฟาร์มยังวาร์ปตามเดิม) */try{const w=W3();if(!visiting&&w&&w.__s4walkHome)w.__s4walkHome();}catch(e){}},
  plot(n,i){if(visiting){if(farm!==n){farm=n;}const ff=window.__ffc&&window.__ffc[n];if(ff&&window.friendFarm){window.friendFarm.plots=ff;FRIEND_PLOTS.length=0;ff.forEach(p=>FRIEND_PLOTS.push(!p?'empty':p.magicUntil>Date.now()?'magic':p.angel?'angel':p.ph==='g1'||p.ph==='g2'?'grow':p.ph));}try{friendPlot(i);}catch(e){console.error(e);}return;}if(n===2&&!(S.unl||{}).f2){useFarm(1);showUnlock&&showUnlock('f2');return;}useFarm(n);try{tapPlot(i);}catch(e){console.error(e);toast(e.message,1);}setTimeout(sync,60);},
  fruit(i){if(visiting){toast('🍑 ดูได้อย่างเดียว เด็ดไม่ได้นะ');return;}if(!(S.unl||{}).f4){showUnlock&&showUnlock('f4');return;}useFarm(4);const F4=window.__F4;if(!F4)return;const p=S.fruit.plots[i];try{p?F4.tapTree(i):F4.openPlant(i);}catch(e){console.error(e);}setTimeout(sync,60);},
  go(g,opt){if(visiting){toast('👀 กำลังเยี่ยมสวนเพื่อน');return;}/* ส่วน ⑤: แตะรถคันไหนในฟาร์ม = ขับคันนั้นเข้านคร */try{window.__S4PICKCAR=opt&&opt.car||null;/* เก็บตก: ต้องส่งถึงหน้าแม่ (app.js อ่านจาก window ของหน้าแม่) */(window.top||parent).__S4PICKCAR=opt&&opt.car||null;}catch(e){}goScreen(g);},
  mail(){openMail();},
  fruitPick(i){/* S4 ข้อ 3: ตะกร้าเก็บผลไม้ (ลากนิ้วผ่านหลายต้น) */if(visiting)return null;if(!(S.unl||{}).f4)return null;const p=S.fruit&&S.fruit.plots&&S.fruit.plots[i];if(!p)return null;if(window.fruitCommand)return window.fruitCommand('fruit-harvest',{index:i});return null;},
  trashThrow(){if(!visiting){toast('🗑️ ทิ้งขยะได้ตอนไปเยี่ยมบ้านเพื่อนเท่านั้น');return null;}if(window.__trashThrow)return window.__trashThrow();return null;},
  trashSweep(){if(visiting){toast('🧹 กวาดได้เฉพาะบ้านตัวเอง');return null;}if(window.__trashSweep)return window.__trashSweep();return null;},
  fruitAll(){/* fix35b 🧺 เก็บผลไม้ทุกต้นที่มีผล (ปุ่มในฟาร์ม 3D) */if(visiting){toast('👀 กำลังเยี่ยมสวนเพื่อน');return null;}if(!(S.unl||{}).f4){showUnlock&&showUnlock('f4');return null;}useFarm(4);if(window.fruitCommand)return window.fruitCommand('fruit-harvest',{all:true});return null;},
  lock2(){if(visiting)return;try{showUnlock('f2');}catch(e){toast('🔒 ใช้กุญแจดอกบัวจากยัยหนูเพื่อปลดล็อก');}},
  honey(){/* S4 ข้อ 12: ระฆังท่าเรือ = เรียกน้องน้ำผึ้ง (กติกาเดียวกับเมนู) */if(visiting)return toast('👀 กำลังเยี่ยมสวนเพื่อน');const b=document.getElementById('mHoney');if(b)b.click();},
  ccLv(){try{return window.__s4ccF?window.__s4ccF.lv():1;}catch(e){return 1;}},
  mailN(){try{const H=window.__HOST||parent.__HOST;return Number(H&&H.mailCount&&H.mailCount())||0;}catch(e){return 0;}},
  house(){if(visiting)return toast('👀 กำลังเยี่ยมสวนเพื่อน');closeAll();const w=W3();w&&w.__s4openHouse&&w.__s4openHouse();},
  stall(){if(visiting)return toast('👀 กำลังเยี่ยมสวนเพื่อน');goScreen('farmshop');},
  zone(z){const w=W3();w&&w.__s4zone&&w.__s4zone(z);},
  /* S4 ข้อ 153/175 🏦 ตู้ธนาคาร 2 ตู้ที่ฟาร์มยัยหนู · แอดมินเองเปิดไม่ได้ (ดูรายการที่ศูนย์แอดมิน) */
  atm(bank){const Hh=window.__HOST||parent.__HOST;try{if(Hh.isAdmin&&Hh.isAdmin()&&!visiting){toast('🏦 ตู้ธนาคารของผู้เล่น · ดูรายการโอนได้ที่ 👑 ศูนย์แอดมิน → 🏧 ATM',1);return;}}catch(e){}closeAll();Hh.openAtm&&Hh.openAtm(bank);},
  wave(){try{window.__s4wave&&window.__s4wave();}catch(e){}},
  atmBoard(){const Hh=window.__HOST||parent.__HOST;return Hh.cloud('atm',{type:'status',bank:'lotus'}).then(o=>o&&o.atm&&o.atm.banks||null).catch(()=>null);},
  krathong(slot){const Hh=window.__HOST||parent.__HOST;return Hh.cloud('drops',{type:'krathong',owner:Hh.uid,farm:1,slot}).then(out=>{try{Object.assign(S,JSON.parse(Hh.get('s3all-v1')));pts=S.merit;render();}catch(e){}const k=out&&out.krathong;if(k){const w=W3();if(w)w.__ktDone=k.slot;}return k||null;});},
  res(g,k,n){S.bag[g]=S.bag[g]||{};S.bag[g][k]=(S.bag[g][k]||0)+n;try{save();}catch(e){console.error(e);}}
 };
 // ---- บ้าน/เรือนกระจก: ใช้กติกาและของในกระเป๋าซีซัน 3 ผ่านหน้าบ้านเดิมที่ซ่อนอยู่ (เห็นแค่หน้าต่างเลือก) ----
 if(!window.__HOST)try{window.__HOST=parent.__HOST;}catch(e){}
 const hf=document.createElement('iframe');hf.id='s3host';hf.src='scr-house.html?s4host=1';hf.title='บ้าน';
 hf.style.cssText='position:fixed;inset:0;width:100%;height:100%;border:0;z-index:40;background:transparent;visibility:hidden;pointer-events:none';hf.setAttribute('allowtransparency','true');document.body.appendChild(hf);
 const HW=()=>{try{return hf.contentWindow;}catch(e){return null;}};
 const hostShow=on=>{hf.style.setProperty('visibility',on?'visible':'hidden','important');hf.style.pointerEvents=on?'auto':'none';if(on){const w=HW();try{if(w&&w.__s4reload)w.__s4reload();}catch(e){}}else{const f=W3();try{if(f&&f.S4LOOP)f.S4LOOP.wake('host-close');}catch(e){}}};
 let hostAt=0,hostOn=false;
setInterval(()=>{try{const w=W3();if(w){const sh=document.getElementById('shade');const pz=hostOn||!!(sh&&sh.classList.contains('on'))||!!document.getElementById('craftReceipt');if(w.__s4pause!==pz){w.__s4pause=pz;if(!pz&&w.S4LOOP)w.S4LOOP.wake('unpause');}}}catch(e){}},300);
 setInterval(()=>{const w=HW();if(!w||!w.__s4busy)return;let b=false;try{b=w.__s4busy();}catch(e){}if(b){if(!hostOn){hostOn=true;hostShow(true);}}else if(hostOn||hf.style.visibility!=='hidden'){if(Date.now()-hostAt<900)return;hostOn=false;hostShow(false);}},200);
 // เบื้องหลังเพิ่มเติม (โหลดเมื่อใช้ครั้งแรก): ป่าเดิม = เครื่องดื่มป่า/เชือก/เหล็ก · โรงเรือนเดิม = สัตว์ภาคการเกษตร
 const XH={};const XK={drinks:'forest',craftDrink:'forest',tools:'forest',bpen:'barn',bcc:'barn',bboost:'barn',bcollect:'barn',bcure:'barn',bbag:'barn'};
 const XSRC={forest:'scr-forest.html?s4host=1',barn:'scr-barn.html?s4host=1'};
 const xMake=n=>{if(XH[n])return XH[n];const el=document.createElement('iframe');el.id='s3'+n;el.src=XSRC[n];el.style.cssText=hf.style.cssText;el.style.visibility='hidden';el.style.pointerEvents='none';el.setAttribute('allowtransparency','true');document.body.appendChild(el);
  const H={el,on:false,at:0,w:()=>{try{return el.contentWindow;}catch(e){return null;}}};XH[n]=H;
  setInterval(()=>{const w=H.w();if(!w||!w.__s4busy)return;let b=false;try{b=w.__s4busy();}catch(e){}if(b){if(!H.on){H.on=true;hostOn=true;el.style.visibility='visible';el.style.pointerEvents='auto';}}else if(H.on){if(Date.now()-H.at<900)return;H.on=false;hostOn=false;el.style.visibility='hidden';el.style.pointerEvents='none';}},200);return H;};
 const xact=(k,i,n=0)=>{const H=xMake(XK[k]);H.at=Date.now();const w=H.w();if(!w||!w.__s4h||!w.__s4h[k]){if(n<40){setTimeout(()=>xact(k,i,n+1),250);if(n===0)toast('⏳ กำลังเปิด…');}return;}H.el.style.visibility='visible';try{if(w.__s4reload)w.__s4reload();}catch(e){}/* fix29: อ่านค่าล่าสุดก่อนทำรายการ */try{w.__s4h[k](i);}catch(err){console.error(err);}};
 window.__S4B.xstate=n=>{const H=XH[n];const w=H&&H.w();try{return w&&w.__s4h&&w.__s4h.state?w.__s4h.state():null;}catch(e){return null;}};
 window.__S4B.xwarm=n=>xMake(n);
 const hact=(k,i)=>{if(XK[k])return xact(k,i);hostAt=Date.now();const w=HW();if(!w||!w.__s4h||!w.__s4h[k]){toast('⏳ กำลังเตรียมบ้าน ลองอีกครั้งนะ');return;}hf.style.visibility='visible';try{w.__s4h[k](i);}catch(err){console.error(err);}};
 setInterval(()=>{const w=HW(),f3=W3();if(!w||!w.__s4h||!f3||!f3.__ghSync)return;try{f3.__ghSync(w.__s4h.state());}catch(e){}},1000);
 window.__S4B.hact=hact;
 window.__S4B.honeyTap=()=>{try{if(visiting){toast('🚚 น้องน้ำผึ้งของเพื่อนมาส่งของอยู่ 👀');return;}if(typeof hPhase==='function'&&hPhase()==='parked')openReq();else{closeAll();if(typeof renderHoney==='function')renderHoney();open('honeySheet');}}catch(e){console.error(e);}};
 // แตะในฉาก 3D / หน้าต่างบ้าน = ยังเล่นอยู่ (ไม่ให้ขึ้น "พักสวน" ระหว่างเล่น)
 const bump=()=>{try{if(!$('sleep').classList.contains('on')){clearTimeout(idleT);idleT=setTimeout(sleep,3*60*1000);}}catch(e){}};
 for(const fr of [f,hf])fr.addEventListener('load',()=>{try{fr.contentWindow.addEventListener('pointerdown',bump,true);}catch(e){}});

 // ---- ลากนิ้วผ่านแปลง: ใช้คำสั่งเดิมของซีซัน 3 (คลาวด์) ทีละแปลง ของเข้ากระเป๋าจริง หักของจริง ----
 let LASTSEED=null;document.addEventListener('click',e=>{const sd=e.target.closest&&e.target.closest('#seeds .seed');if(sd)LASTSEED=sd.dataset.k;},true);
 window.__S4B.sweep=async(n,i,tool)=>{if(visiting||!window.cloudFarm)return null;try{const w=W3();if(w&&!w.__visiting)w.__visiting=()=>!!visiting;}catch(e){}if(n===2&&!(S.unl||{}).f2)return null;useFarm(n);const p=(S.farms[n]||[])[i];let r=null;
  try{if(tool==='cake'||tool==='coconut'){if(p&&/^g|water|worm/.test(p.ph||'')&&p.ph!=='ready'){if(((S.bag.item||{})[tool]||0)<1){toast('ไม่มี'+(tool==='cake'?'🍰 เค้ก':'🥥 มะพร้าว')+'แล้วนะ',1);return null;}await cloudFarm('boost',{index:i,item:tool});r='boost';}}
   else if(tool==='angel'){/* fix36 🪽 ใส่ได้ทุกแปลงที่มีผัก (รวมพร้อมเก็บ) · มีแล้วบอก */if(!p)r='empty';else if(p.angel)r='angelHas';else{if(((S.bag.item||{}).angel||0)<1){toast('ไม่มีปีกนางฟ้าแล้วนะ',1);return null;}await cloudFarm('angel',{index:i});r='angel';}}
   else if(!p){const k=tool&&tool.startsWith('seed:')?tool.slice(5):LASTSEED;if(k){await cloudFarm('plant',{crop:k,index:i,all:false});r='plant';}else{pending=i;plantAll=false;try{tapPlot(i);}catch(e){}}}
   else if(p.ph==='ready'){const c=p.c,q=p.angel?10:1;await cloudFarm('harvest',{index:i});r={h:c,q,img:(typeof IMG!=='undefined'&&(IMG['p-'+c]||IMG[c+'4']))||''};}
   else if(p.ph==='water'){await cloudFarm('water',{index:i});r='water';}
   else if(p.ph==='worm'){await cloudFarm('worm',{index:i});r='worm';}}catch(e){console.error(e);}
  setTimeout(sync,30);return r;};
 window.__S4B.bagc=()=>{const it=(S.bag&&S.bag.item)||{};return{cake:it.cake||0,coconut:it.coconut||0,angel:it.angel||0,seed:LASTSEED};};

 // น้องน้ำผึ้งส่งของ: ให้ฉาก 3D เล่นเรือ/แพ/รถด้วย
 /* S4 ข้อ 11/43: น้องน้ำผึ้ง 3D ขับเคลื่อนจาก S.honey ผ่าน sync (ไม่ใช้ wrapper เดิมที่เรียกก่อนเซิร์ฟเวอร์ตอบ) */
 // ปุ่ม 🌾 เลือกฟาร์ม: ซีซัน 4 มีฟาร์ม 1 (หน้าบ้าน 12 แปลง) · ฟาร์ม 2 (ข้ามสะพาน 12 แปลง) · สวนผลไม้
 const fb=document.getElementById('farmBtn');if(fb)fb.onclick=()=>{closeAll();const L=[[1,'🌾 ฟาร์ม 1 · หน้าบ้าน'],[2,'🌾 ฟาร์ม 2 · ข้ามสะพาน'],[4,'🍑 สวนผลไม้']];
  $('fgrid').innerHTML=L.map(([n,t])=>'<div class="fcard'+(n===farm?' cur':'')+(n>1&&!(S.unl||{})['f'+n]?' lk':'')+(n===4?' fruit4':'')+'" data-f="'+n+'" style="background:linear-gradient(160deg,#a7dc7c,#5fae4a)"><b>'+(n===farm?'📍 ':'')+t+'</b></div>').join('');open('farmSheet');};
 const fg=document.getElementById('fgrid');if(fg)fg.onclick=e=>{const c=e.target.closest('.fcard');if(!c)return;const n=+c.dataset.f;closeAll();if(n>1&&!(S.unl||{})['f'+n]){showUnlock&&showUnlock('f'+n);return;}useFarm(n);const w=W3();w&&w.__s3farm&&w.__s3farm(n);};

 // ปุ่ม 🎨 แต่งฟาร์ม · 📖 สมุดสะสม (ใต้ปุ่ม 🌾 🗺️)
 {const st=document.createElement('style');st.textContent='#s4side{position:fixed;right:.75rem;top:calc(env(safe-area-inset-top,0px) + 4.9rem);display:flex;flex-direction:column;gap:.45rem;z-index:6}#s4side button{width:2.9rem;height:2.9rem;border-radius:50%;border:0;font-size:1.35rem;background:radial-gradient(circle at 35% 30%,#fffdf6,#ffe3b0);box-shadow:0 3px 0 rgba(160,110,50,.35),0 4px 10px rgba(0,0,0,.15)}#s4side small{display:block;font-size:.5rem;font-weight:800;color:#6e4b3a;margin-top:-.15rem}';document.head.appendChild(st);
  const box=document.createElement('div');box.id='s4side';box.innerHTML='<button type="button" data-a="edit" aria-label="แต่งฟาร์ม">🎨</button><button type="button" data-a="album" aria-label="สมุดสะสม">📖</button>';document.body.appendChild(box);
  box.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;if(visiting)return toast('👀 กำลังเยี่ยมสวนเพื่อน');const w=W3();if(!w)return;try{const d=w.document;if(b.dataset.a==='edit'){d.getElementById('bEdit').click();}else{d.getElementById('bAlbum').click();}}catch(err){console.error(err);}};}

 // ตอนแต่งฟาร์ม / เปิดสมุด / อยู่ในบ้าน 3D: ซ่อนปุ่มซีซัน 3 ไม่ให้บังวิว
 {const st=document.createElement('style');st.textContent='body.s4full>*:not(#f3d):not(#toast):not(.toast):not(#s3host):not(#s3forest):not(#s3barn){visibility:hidden!important}';document.head.appendChild(st);
  setInterval(()=>{const w=W3();let full=false;try{const d=w.document,vis=el=>{if(!el||el.hidden)return false;const cs=w.getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden';};const hv=d.querySelector('.hvTop');full=vis(d.getElementById('tray'))||vis(d.getElementById('selBar'))||vis(d.getElementById('album'))||vis(d.getElementById('book3'))||(hv&&hv.parentNode&&vis(hv.parentNode))||!!(w.__room&&w.__room.on);}catch(e){}document.body.classList.toggle('s4full',full);},350);}
 window.harvestPop=(fn=>function(src,rect,n){if(!rect||!rect.width)rect={left:innerWidth/2-30,top:innerHeight/2-30,width:60,height:60,right:innerWidth/2+30,bottom:innerHeight/2+30};return fn?fn.call(this,src,rect,n):null;})(window.harvestPop);
})();

// ---- ซีซัน 4: เยี่ยมสวนเพื่อน = เห็นผักที่เพื่อนปลูกจริงทั้ง 2 ฝั่งสะพาน (โหลดฟาร์ม 1 แล้วตามด้วยฟาร์ม 2) ----
(()=>{const tryWrap=()=>{if(typeof window.cloudFriend!=='function'||typeof visit!=='function'){setTimeout(tryWrap,500);return;}
 window.__ffc={};const keepProject=window.__ffProject;
 // จำแปลงของเพื่อนแยกตามฟาร์มทุกครั้งที่โหลด
 setInterval(()=>{const ff=window.friendFarm;if(visiting&&ff&&ff.plots){window.__ffc[ff.farm||farm]=ff.plots;}if(!visiting)window.__ffc={};},400);
 /* S4 ข้อ 180/181: ส่งตำแหน่งตัวเรา (ฟาร์มที่อยู่ = ของเรา หรือของเพื่อนที่กำลังเยี่ยม) · ฟังคนอื่นในฟาร์มเดียวกัน 1 listener */
 (()=>{const H=window.__HOST||parent.__HOST;if(!H||!H.prWrite)return;let prPub=null,prList=[],prOwner=null,prLast=0,prPos=null,prStop=null,waveN=0;const W3=()=>{try{const f=document.getElementById('f3d');return f&&f.contentWindow;}catch(e){return null;}};
  const me=()=>{const w=W3();return w&&w.__me?w.__me():null;};
  window.__s4wave=()=>{waveN++;prLast=0;};
  setInterval(()=>{try{const w=W3();if(!w||!w.__me||!H.uid)return;const owner=visiting?(window.friendFarm&&window.friendFarm.owner):H.uid;if(!owner)return;
    if(owner!==prOwner){if(prOwner)H.prLeave(prOwner);if(prStop)prStop();prOwner=owner;prPos=null;prLast=0;const own=owner;prPub=null;prList=[];const pushPeers=()=>{const w2=W3();if(!w2||!w2.__peers||prOwner!==own)return;const now=Date.now();const L=prList.filter(r=>r.uid!==H.uid&&now-(+r.t||0)<90000);if(visiting&&own!==H.uid&&!L.some(r=>r.uid===own))L.push({uid:own,n:String((window.friendFarm&&window.friendFarm.name)||'เจ้าบ้าน').slice(0,24),home:1,o:(prPub&&prPub.wear)||null,t:now});w2.__peers(L,{notify:false});};
    prStop=H.prWatch(own,list=>{prList=list||[];pushPeers();});if(visiting&&own!==H.uid&&H.pubChar){H.pubChar(own).then(d=>{if(prOwner!==own)return;prPub=d||{};pushPeers();});}}
    const m=me();if(!m)return;const now=Date.now();const moved=!prPos||Math.hypot(m.x-prPos.x,m.z-prPos.z)>.2||m.s!==prPos.s||m.o!==prPos.o||Math.abs(m.d-prPos.d)>.6;
    if((moved&&now-prLast>1200)||now-prLast>25000){prLast=now;prPos=m;H.prWrite(owner,{n:String((typeof USER!=='undefined'&&USER&&USER.name)||'เพื่อน').slice(0,24),x:+m.x.toFixed(1),z:+m.z.toFixed(1),d:+(+m.d||0).toFixed(2),s:m.s||null,o:m.o||null,...(waveN?{w:waveN}:{})});}}catch(e){console.log('pres',e&&e.message);}},400);
  addEventListener('pagehide',()=>{try{if(prOwner)H.prLeave(prOwner);}catch(e){}});
 })();
 const v0=visit;visit=async function(uid){window.__ffc={};await v0(uid);try{if(window.friendFarm){window.__ffc[1]=window.friendFarm.plots;farm=2;await window.cloudFriend('visit');if(window.friendFarm)window.__ffc[2]=window.friendFarm.plots;farm=1;window.friendFarm.plots=window.__ffc[1];}}catch(e){console.error(e);}
  try{const w=W3();if(w&&w.__s4walkHome)w.__s4walkHome();}catch(e){}};};tryWrap();})();
// ป้ายเยี่ยมสวนแบบซีซัน 4 (เล็ก กลางบน) แทนแถบซีซัน 3
{const st=document.createElement('style');st.textContent='#visit{position:fixed!important;left:50%!important;right:auto!important;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 10px)!important;z-index:9!important;display:none;align-items:center;gap:8px;padding:4px 4px 4px 12px!important;border-radius:999px!important;background:rgba(48,34,72,.85)!important;border:1.5px solid rgba(255,255,255,.6)!important;color:#fff!important;font:800 11px Mali,sans-serif!important;box-shadow:0 4px 12px rgba(0,0,0,.25)!important;visibility:visible!important}#visit.on{display:flex!important}#visit small{color:#ffe7a6;margin-left:4px;font-size:9.5px}#visit button{width:32px;height:32px;border-radius:50%;border:2px solid #fff;background:linear-gradient(180deg,#9fe38a,#4bb04a);font-size:15px;padding:0}';document.head.appendChild(st);}
/* S4: แตะของที่เพื่อนแกล้งในฉาก 3D → ใช้ปุ่มของระบบแกล้งเดิม (ไล่หิ่งห้อย / อ่านป้าย) */
try{window.__S4B=window.__S4B||{};window.__S4B.prank=k=>{const d=document.querySelector('.pkdock [data-f="'+k+'"]')||document.querySelector('.pkdock [data-p="'+k+'"]');if(d){d.click();return true;}return false;};}catch(e){}

/* S4: เลเวลศูนย์ดูแลสัตว์ (เก็บในเซฟฟาร์ม S.s4cc.farm) · หักวัสดุป่าจากกระเป๋าหลักของหน้านี้ (หน้าฟาร์มเป็นเจ้าของกระเป๋าหลัก) */
window.__s4ccF={lv(){const v=+(S&&S.s4cc&&S.s4cc.farm)||1;return Math.max(1,Math.min(3,v|0));},
 have(k){return Math.max(0,Number(((S&&S.bag&&S.bag.forest)||{})[k])||0);},
 take(list,nx){if(typeof visiting!=='undefined'&&visiting)return false;if(this.lv()+1!==nx||nx>3)return false;for(const [k,n] of list)if(this.have(k)<n)return false;
  S.bag.forest=S.bag.forest||{};for(const [k,n] of list)S.bag.forest[k]=this.have(k)-n;S.s4cc=Object.assign({},S.s4cc||{},{farm:nx});save();return true;}};
