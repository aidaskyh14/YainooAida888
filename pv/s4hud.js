/* ซีซัน 4: ปุ่มหน้าฟาร์มแบบเกมฟาร์มใหญ่ · มุมขวาล่าง 3 ปุ่มสี่เหลี่ยมใหญ่ (ทางลัด · ฟาร์ม · เมนู)
   กดแล้วแถบเลื่อนขึ้นจากด้านล่าง เป็นชั้นๆ มีปุ่มย้อนกลับ ไม่เด้งกระจาย ไม่มีเบลอ (เบาเครื่อง) */
(()=>{
 const $=id=>document.getElementById(id);const click=id=>{const b=$(id);if(b)b.click();};
 const H=()=>window.__HOST||parent.__HOST;
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const css=document.createElement('style');css.textContent=`
.top,#menuBtn,#toolBtn,#s4side,.pkdock{display:none!important}
#fan{visibility:hidden!important;pointer-events:none!important}
#pumpHarvestStatus{display:none!important}
#s4prof{position:fixed;z-index:7;left:10px;top:calc(env(safe-area-inset-top,0px) + 10px);display:flex;align-items:center;gap:6px;padding:3px 11px 3px 3px;border-radius:999px;background:rgba(48,34,72,.78);border:1px solid rgba(255,255,255,.5);box-shadow:0 4px 12px rgba(20,10,40,.25);color:#fff;font:700 11px Mali,sans-serif;cursor:pointer}
#s4prof .av{width:30px;height:30px;border-radius:50%;background:linear-gradient(145deg,#fff,#ffd1e3);display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 0 0 2px #ffd36b;overflow:hidden}
#s4prof .av img{width:100%;height:100%;object-fit:cover}
#s4prof b{display:block;font-size:11px;max-width:34vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#s4prof small{display:block;font-size:10px;color:#ffe7a6}
#s4prank{position:fixed;z-index:9;left:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 10px);display:none;align-items:center;gap:5px;padding:7px 14px 7px 7px;border:3px solid #fff;border-radius:999px;background:linear-gradient(180deg,#9A6BD8,#6B3FA0);color:#fff;font:700 15px 'Mali',sans-serif;box-shadow:0 4px 12px rgba(60,20,90,.4);animation:s4pk 1.6s ease-in-out infinite}#s4prank.on{display:flex}#s4prank img{width:26px;height:26px;object-fit:contain}@keyframes s4pk{50%{transform:scale(1.06)}}body.s4open #s4prank,body:not(.s4loaded) #s4prank{display:none!important}
#s4dockR{position:fixed;z-index:9;right:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 10px);display:flex;gap:6px;transition:transform .22s ease,opacity .22s}
body:not(.s4loaded) #s4dockR,body:not(.s4loaded) #s4tool,body:not(.s4loaded) #s4strip{opacity:0!important;pointer-events:none!important}/* เก็บตก: แถบเครื่องมือโผล่หลังฉากโหลดครบ 100% เท่านั้น */
body.s4open #s4dockR{transform:translateY(130%);opacity:0;pointer-events:none}
.s4k{position:relative;width:42px;height:42px;border-radius:13px;border:2px solid #fff;padding:0;cursor:pointer;font-size:20px;line-height:1;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 0 rgba(0,0,0,.18),0 6px 12px rgba(40,20,0,.25);transition:transform .1s}
.s4k:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,.18)}
.s4k::after{content:'';position:absolute;left:5px;right:5px;top:3px;height:40%;border-radius:12px 12px 20px 20px;background:linear-gradient(rgba(255,255,255,.55),rgba(255,255,255,0));pointer-events:none}
.s4k.c1{background:linear-gradient(180deg,#8fd0ff,#3f94e4)}.s4k.c2{background:linear-gradient(180deg,#ffd76a,#f39a1e)}.s4k.c3{background:linear-gradient(180deg,#ff9fc0,#e8578a)}.s4k.c4{background:linear-gradient(180deg,#9fe38a,#4bb04a)}.s4k.c5{background:linear-gradient(180deg,#d2b4ff,#8a5ce0)}
.s4k em{position:absolute;top:-7px;right:-7px;min-width:19px;height:19px;border-radius:10px;background:#ff3d6e;color:#fff;font:800 10.5px Mali,sans-serif;font-style:normal;display:flex;align-items:center;justify-content:center;padding:0 4px;box-shadow:0 0 0 2px #fff;z-index:1}
.s4k em:empty{display:none}
#s4strip{position:fixed;z-index:10;left:0;right:0;bottom:0;padding:10px 10px calc(env(safe-area-inset-bottom,0px) + 10px);background:linear-gradient(180deg,#fff9ee,#ffefd6);border-radius:22px 22px 0 0;box-shadow:0 -6px 22px rgba(70,40,10,.22),inset 0 2px 0 #fff;transform:translateY(105%);transition:transform .24s cubic-bezier(.3,1.25,.5,1)}
#s4strip.on{transform:none}
#s4strip .hd{display:flex;align-items:center;gap:8px;margin:0 2px 8px;font:800 12px Mali,sans-serif;color:#8a5a2e}
#s4strip .hd button{width:30px;height:30px;border-radius:50%;border:2px solid #fff;background:#f3dcb8;color:#8a5a2e;font:800 16px sans-serif;box-shadow:0 2px 0 #d2ac78;padding:0;cursor:pointer}
#s4strip .hd .x{margin-left:auto}
#s4strip .row{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding:2px 2px 4px}
#s4strip .row::-webkit-scrollbar{display:none}
#s4strip .t{flex:0 0 auto;width:46px;border:0;background:none;padding:0;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;font:800 9.5px Mali,sans-serif;color:#6e4b3a;position:relative}
#s4strip .t .s4k{width:52px;height:52px;font-size:24px;pointer-events:none}
#s4strip .t span{max-width:62px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#s4strip .t.cur .s4k{box-shadow:0 0 0 3px #ffd36b,0 4px 0 rgba(0,0,0,.18)}
#s4strip .f i{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:800 19px Mali,sans-serif;font-style:normal;color:#fff;border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.22)}
#s4strip .f.me i{box-shadow:0 0 0 3px #ffd36b,0 3px 8px rgba(0,0,0,.22)}
#s4strip .msg{font:700 11px Mali,sans-serif;color:#9a7a68;padding:12px}
#s4strip .t img{width:34px;height:34px;object-fit:contain}
#s4strip .gridw{max-height:62vh;overflow-y:auto;scrollbar-width:none;padding:0 2px}#s4strip .gridw::-webkit-scrollbar{display:none}
#s4strip .gh{font:800 11px Mali,sans-serif;color:#b0784a;margin:6px 2px 6px}
#s4strip .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px 4px;justify-items:center}
#s4strip .grid .t{width:auto}
#s4strip .t em{font-size:9px}
#s4shade{position:fixed;inset:0;z-index:9;display:none}#s4shade.on{display:block}
#s4tool{position:fixed;z-index:8;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 12px);display:none;align-items:center;gap:6px;padding:4px 6px 4px 12px;border-radius:999px;background:rgba(48,34,72,.82);color:#fff;font:800 11px Mali,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.25)}
#s4tool.on{display:flex}#s4tool img{width:22px;height:22px;object-fit:contain}#s4tool button{border:0;border-radius:999px;background:#fff;color:#6e4b3a;font:800 11px Mali,sans-serif;padding:4px 10px;cursor:pointer}
body.s4full #s4prof,body.s4full #s4dockR,body.s4full #s4strip,body.s4full #s4tool{display:none!important}`;
 document.head.appendChild(css);
 // โปรไฟล์ (มุมซ้ายบน)
 const prof=document.createElement('div');prof.id='s4prof';prof.innerHTML='<div class="av">🐷</div><div><b>-</b><small>🪷 0</small></div><i class="shield" style="display:none;position:absolute;right:-6px;top:-6px;width:22px;height:22px;border-radius:50%;background:#ffd24a;border:2px solid #fff;font-size:12px;font-style:normal;display:none;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,.25)">🛡️</i>';prof.style.position=prof.style.position||'fixed';document.body.appendChild(prof);
 /* S4 ข้อ 142: ไอคอนโล่เมื่อมีหุ่นไล่กาเฝ้า (ของเรา/ของเพื่อนตอนเยี่ยม) · แตะดูเวลาที่เหลือ */const shield=prof.querySelector('.shield');const scareU=()=>{try{const f=document.getElementById('f3d');return +((f&&f.contentWindow&&f.contentWindow.__scareUntil)||0);}catch(e){return 0;}};shield.onclick=e=>{e.stopPropagation();const l=Math.max(0,scareU()-Date.now());try{toast('🛡️ หุ่นไล่กาเฝ้าสวนอยู่ · เหลือ '+(l>=3600000?Math.floor(l/3600000)+' ชม. ':'')+Math.ceil(l%3600000/60000)+' นาที');}catch(e){}};
 prof.onclick=()=>{try{if(window.__s4avatar)window.__s4avatar();else click('pname');}catch(e){click('pname');}};
 const upd=()=>{try{shield.style.display=scareU()>Date.now()?'flex':'none';prof.querySelector('b').textContent=($('nm')||{}).textContent||'';prof.querySelector('small').textContent='🪷 '+(($('ptsv')||{}).textContent||'0');const im=$('av')&&$('av').querySelector('img');const pa=prof.querySelector('.av');const cur=pa.querySelector('img');if(im&&(!cur||cur.getAttribute('src')!==im.getAttribute('src'))){pa.innerHTML='';const c=im.cloneNode();c.removeAttribute('style');pa.appendChild(c);}}catch(e){}};
 upd();setInterval(upd,1000);
 // ปุ่มมุมขวาล่าง
 const dockR=document.createElement('div');dockR.id='s4dockR';
 dockR.innerHTML='<button class="s4k c1" data-k="map" title="ทางลัด">🗺️</button><button class="s4k c4" data-k="farm" title="ฟาร์ม">🌾</button><button class="s4k c3" data-k="menu" title="เมนู">☰<em></em></button>';
 const shade=document.createElement('div');shade.id='s4shade';
 const strip=document.createElement('div');strip.id='s4strip';
 const tool=document.createElement('div');tool.id='s4tool';
 document.body.append(shade,strip,tool,dockR);
 /* fix33p: ปุ่มลอยแกล้งเพื่อน (เฉพาะตอนเยี่ยมสวนเพื่อน) */const pkB=document.createElement('button');pkB.id='s4prank';pkB.innerHTML='<img src="images/prank-heart.webp" alt="">🎭 แกล้ง';pkB.onclick=()=>go('scare');document.body.appendChild(pkB);setInterval(()=>{try{const on=visiting()&&!!document.querySelector('.pkdock [data-dm]');pkB.classList.toggle('on',on);}catch(e){}},700);
 {const iv=setInterval(()=>{try{const w=f3w();if(w&&w.__ready){document.body.classList.add('s4loaded');clearInterval(iv);}}catch(e){}},300);setTimeout(()=>{document.body.classList.add('s4loaded');clearInterval(iv);},120000);}
 const f3w=()=>{try{return $('f3d').contentWindow;}catch(e){return null;}};
 const f3click=id=>{const w=f3w();const b=w&&w.document.getElementById(id);if(b)b.click();};
 const bag=()=>{try{return (typeof S!=='undefined'&&S&&S.bag&&S.bag.item)||{};}catch(e){return {};}};
 const nf=n=>(n>9999?Math.floor(n/1000)+'k':String(n||0));
 const isAdm=()=>{const m=$('mAdmin');return m&&m.style.display!=='none';};
 const mailN=()=>{try{return Number(H().mailCount())||0;}catch(e){return 0;}};
 const visiting=()=>{const v=$('visit');return !!(v&&v.classList.contains('on'));};
 // "ทั้งหมด" = เฉพาะแปลงฝั่งที่ตัวละครยืนอยู่ (ฝั่งบน 12 = ฟาร์ม 1 · ข้ามสะพาน 12 = ฟาร์ม 2)
 const zoneFarm=()=>{try{const p=f3w().__pos();return p[1]>=10.5?2:1;}catch(e){return 1;}};
 async function both(type,data){const keep=farm;try{farm=zoneFarm();await cloudFarm(type,data);}catch(e){}farm=keep;try{render();}catch(e){}}
 const T=(ic,lab,act,c,badge)=>({ic,lab,act,c:c||'c2',badge});
 const LV={
  menu:()=>({t:'เมนู',items:[...(visiting()?[T('🏠','กลับบ้าน',()=>{close();click('vHome');},'c4')]:[]),T('👥','เพื่อน',()=>go('friends'),'c1'),T('🎒','กระเป๋า',()=>{close();click('mBag');},'c2'),T('🎨','แต่งฟาร์ม',()=>{close();f3click('bEdit');},'c5'),T('🔋',(()=>{let on=false,why='';try{const w=f3w();on=!!(w&&w.S4LITE);why=(w&&w.S4LITE_WHY)||'';}catch(e){}return 'โหมดประหยัด: '+(on?'เปิด':'ปิด')+(on&&why?' ('+why+')':'');})(),()=>{/* fix35: สลับโหมดประหยัด (ผู้เล่นเลือกเองชนะอัตโนมัติ) แล้วโหลดหน้าใหม่ */let on=false;try{const w=f3w();on=!!(w&&w.S4LITE);}catch(e){}try{localStorage.setItem('s4lite',on?'0':'1');}catch(e){}close();try{toast((on?'🔆 ปิด':'🔋 เปิด')+'โหมดประหยัดแล้ว กำลังโหลดใหม่…');}catch(e){}setTimeout(()=>{try{(window.top||window).location.reload();}catch(e){location.reload();}},700);},'c3'),
    T('📖','สมุดสะสม',()=>{close();f3click('bAlbum');},'c3'),T('🐷','น้ำผึ้ง',()=>{close();click('mHoney');},'c3'),(visiting()?T('🎭','แกล้งเพื่อน (จอมแสบ)',()=>go('scare'),'c1'):T('🛡️','หุ่นไล่กา',()=>go('scare'),'c5')),T('📮','จดหมาย',()=>{close();try{H().openMail();}catch(e){try{openMail();}catch(e2){}}},'c1',mailN()),
    ...(isAdm()?[T('👑','แอดมิน',()=>{close();click('mAdmin');},'c2')]:[]),T('🚪','ออก',()=>{close();click('mLogout');},'c3')]}),
  farm:()=>({t:'ฟาร์ม',items:[T('🚜','เก็บทั้งหมด',()=>{close();both('harvest',{all:true});},'c2'),T('🌱','ปลูกทั้งหมด',()=>{close();plantAllBoth();},'c4'),T('💧','รดน้ำทั้งหมด',()=>{close();both('water',{all:true});},'c1'),
    T('🪱','กำจัดหนอน',()=>{close();both('worm',{all:true});},'c5'),T('⚡','เร่งโต',()=>go('boost'),'c3'),T('✋','ลากนิ้วเก็บ',()=>{close();setTool('auto');},'c2'),
    /* S4 รอบ 3 ข้อ 1/12: ตะกร้าเก็บผลไม้ + คราฟสวนผลไม้ ย้ายมาอยู่แถบเครื่องมือ */T('🧺','ตะกร้าเก็บผลไม้',()=>{close();try{const f=window.__s4f&&__s4f.contentWindow;f&&f.__basketSet&&f.__basketSet(true);}catch(e){}},'c4'),T('🌱','คราฟต้นกล้า',()=>{close();try{if(window.openFruitCraft)window.openFruitCraft('tree');else toast('⚠️ หน้ายังโหลดไม่ครบ ลองใหม่',1);}catch(e){}},'c1'),/* fix29: หน้าต่างยืนยันก่อนหัก */T('🔨','คราฟปุ๋ยผลไม้',()=>{close();try{if(window.openFruitCraftFert)window.openFruitCraftFert();else if(window.openCraftF)window.openCraftF();else toast('⚠️ หน้ายังโหลดไม่ครบ ลองใหม่',1);}catch(e){}},'c5')/* fix29 */]}),
  boost:()=>{const b=bag();return {t:'⚡ ไอเทมเร่งโต',back:'farm',items:[T('<img src="'+(typeof IMG!=='undefined'&&IMG['it-cake']||'')+'">','เค้ก',()=>go('use:cake'),'c3',b.cake||0),T('<img src="'+(typeof IMG!=='undefined'&&IMG['it-coconut']||'')+'">','มะพร้าว',()=>go('use:coconut'),'c4',b.coconut||0),T('<img src="'+(typeof IMG!=='undefined'&&IMG['it-angel']||'')+'">','ปีกนางฟ้า',()=>go('use:angel'),'c1',b.angel||0)]};},
  use:(k)=>{const N={cake:'เค้ก',coconut:'มะพร้าว',angel:'ปีกนางฟ้า'}[k];return {t:N,back:'boost',items:[T('👆','ใช้ทีละแปลง',()=>{close();setTool(k);},'c2'),T('✨','ใช้ทั้งหมด',()=>{close();k==='angel'?both('angel',{all:true}):both('boost',{all:true,item:k});},'c3')]};},
  scare:()=>{const d=document.querySelector('.pkdock');const bs=d?[...d.querySelectorAll('button')].filter(b=>b.style.display!=='none'&&!b.hidden):[];
    return {t:visiting()?'🎭 แกล้งสวนเพื่อน':'🛡️ หุ่นไล่กา',back:'menu',items:bs.map(b=>{const im=b.querySelector('img');return T(im?'<img src="'+im.getAttribute('src')+'">':'🛡️',(b.textContent||'').trim(),()=>{close();b.click();},'c5');}),empty:visiting()?'สวนเพื่อนยังโหลดไม่เสร็จ ปิดแล้วลองใหม่อีกครั้ง':'ตอนนี้ไม่มีอะไรต้องจัดการ'};},
  friends:()=>{setTimeout(openRank,0);return {t:'👥 เพื่อน',back:'menu',items:[],empty:'⏳'};},
  map:()=>{const SY=(window.__s4SYS||[]).filter(s=>s[0]!=='farm'),C=['c4','c2','c1','c3','c5'];const G=[['home','🏡 บ้านของฉัน'],['ani','🐾 สัตว์'],['place','🗺️ สถานที่']];let k=0;
    return {t:'🗺️ ทางลัด',grid:G.map(([g,t])=>({t,items:SY.filter(s=>s[4]===g).map(s=>{const sp=s[1].indexOf(' ');return T(s[1].slice(0,sp),s[1].slice(sp+1),()=>{close();s[3]();},C[(k++)%C.length],s[5]?'🔒':null);})})),items:[]};}};
 /* S4 ข้อ 38/39/134/135: หน้าอันดับ+เพื่อน แบบเกมใหญ่ — โพเดียม 3 อันดับ · แถว 4+ (อันดับ รูป ชื่อ 🪷กุศล ▲▼) · แถวตัวเองไฮไลต์+ปักล่าง · แตะ = เยี่ยมบ้าน · ข้อมูลจาก roster (อ่านเอกสารเดียว) */
 {const st=document.createElement('style');st.textContent=`
#s4rank{position:fixed;inset:0;z-index:60;background:linear-gradient(180deg,#2a1b4e 0,#4b2c7a 38%,#fff6ea 38%,#fff6ea 100%);display:flex;flex-direction:column;font-family:Mali,sans-serif;color:#4a3328}
#s4rank .hd{display:flex;align-items:center;justify-content:space-between;padding:calc(env(safe-area-inset-top,0px) + 12px) 14px 6px;color:#fff;font-weight:800;font-size:17px}
#s4rank .hd button{all:unset;cursor:pointer;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.18);text-align:center;line-height:36px;font-size:18px}
#s4rank .pod{display:flex;align-items:flex-end;justify-content:center;gap:10px;padding:4px 14px 0;height:34%}
#s4rank .pd{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer}
#s4rank .pd .av{width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:#fff;border:4px solid #c0c0c0;box-shadow:0 4px 12px rgba(0,0,0,.3);position:relative;overflow:visible}
#s4rank .pd .av img{width:100%;height:100%;border-radius:50%;object-fit:cover}
#s4rank .pd.g .av{width:80px;height:80px;font-size:32px;border-color:#ffd54a;box-shadow:0 0 0 3px #b8860b,0 6px 16px rgba(0,0,0,.35)}
#s4rank .pd.b .av{border-color:#d58a4a}
#s4rank .pd .crown{position:absolute;top:-26px;left:50%;transform:translateX(-50%);font-size:26px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.4))}
#s4rank .pd .nm{color:#fff;font-weight:800;font-size:12px;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,.5)}
#s4rank .pd .mr{color:#ffe29a;font-weight:800;font-size:12px}
#s4rank .pd .blk{width:100%;border-radius:12px 12px 0 0;background:linear-gradient(180deg,#e6e6ec,#b9b9c4);color:#4a3328;font-weight:900;font-size:22px;text-align:center;padding-top:6px;height:46px}
#s4rank .pd.g .blk{height:74px;background:linear-gradient(180deg,#ffe58a,#f2b53c);font-size:28px}
#s4rank .pd.b .blk{height:34px;background:linear-gradient(180deg,#f0b98a,#c97a3f)}
#s4rank .list{flex:1;overflow:auto;padding:10px 12px 90px}
#s4rank .r{display:flex;align-items:center;gap:10px;padding:8px 10px;margin-bottom:6px;border-radius:16px;background:#fff;border:2px solid #f1e3cf;cursor:pointer}
#s4rank .r.me{background:#fff3c4;border-color:#f2b53c}
#s4rank .r .rk{width:28px;text-align:center;font-weight:900;font-size:15px;color:#8a6a52}
#s4rank .r .av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:17px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.2);overflow:hidden}
#s4rank .r .av img{width:100%;height:100%;object-fit:cover}
#s4rank .r .nm{flex:1;font-weight:800;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#s4rank .r .mr{font-weight:800;font-size:13px;color:#6b4a7a}
#s4rank .r .dl{width:30px;text-align:center;font-size:12px;font-weight:900}#s4rank .r .dl.up{color:#2e9e4f}#s4rank .r .dl.dn{color:#d63a3a}#s4rank .r .dl.eq{color:#b3a79c}
#s4rank .pin{position:fixed;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 12px);z-index:61;display:none}
#s4rank .pin.on{display:block}#s4rank .pin .r{margin:0;box-shadow:0 8px 20px rgba(0,0,0,.25)}
@keyframes s4rkIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}#s4rank .r,#s4rank .pd{animation:s4rkIn .35s ease both}`;document.head.appendChild(st);}
 async function openRank(){let R=document.getElementById('s4rank');if(R)R.remove();R=document.createElement('div');R.id='s4rank';R.innerHTML='<div class="hd"><span>🏆 อันดับกุศล · เพื่อน</span><button data-x="1">✕</button></div><div class="pod"></div><div class="list"><div class="msg" style="text-align:center;padding:30px;color:#9a7a68">⏳ กำลังโหลดอันดับ…</div></div><div class="pin"></div>';
  document.body.appendChild(R);document.body.classList.add('s4sheet');const bye=()=>{R.remove();document.body.classList.remove('s4sheet');try{close();}catch(e){}};R.querySelector('[data-x]').onclick=bye;
  const me=H().uid;let rows=[];try{const h=H();rows=(await h.roster()).filter(r=>!r.admin);}catch(e){R.querySelector('.list').innerHTML='<div class="msg">โหลดรายชื่อไม่สำเร็จ</div>';return;}
  rows.sort((a,b)=>(b.merit||0)-(a.merit||0));
  let prev={};try{prev=JSON.parse(localStorage.getItem('s4rank-prev')||'{}');}catch(e){}
  const nowR={};rows.forEach((r,i)=>nowR[r.uid]=i+1);try{localStorage.setItem('s4rank-prev',JSON.stringify(nowR));}catch(e){}
  /* fix35: รูปโปรไฟล์เพื่อน — roster ส่งมาใน r.av (preset:ชื่อ | data:...) · ไม่มี/โหลดไม่ได้ → น้องน้ำผึ้ง (สุ่มคงที่ตาม uid) · ของตัวเองใช้ค่าล่าสุดในเซฟ */
  const honeyAv=uid=>'images/av-honey-'+(1+[...String(uid||'')].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7)%16)+'.webp';
  const avSrcOf=r=>{let v=r.av||r.photo||r.avatar||'';if(r.uid===me){try{const g=JSON.parse(H().get('s3all-v1')||'{}');if(g.av)v=g.av;}catch(e){}}if(!v)return honeyAv(r.uid);if(/^data:image\//.test(v))return v;if(/^preset:[a-z0-9-]{1,40}$/.test(v))return 'images/'+v.slice(7)+'.webp';return honeyAv(r.uid);};
  const av=(r,i)=>{const src=avSrcOf(r),fb=honeyAv(r.uid);return '<div class="av" style="background:'+COL[i%COL.length]+'"><img src="'+esc(src)+'" alt="" onerror="if(this.dataset.fb!==\'1\'){this.dataset.fb=\'1\';this.src=\''+esc(fb)+'\';}else this.remove();"></div>';};
  const full=n=>(Number(n)||0).toLocaleString('en-US');
  const top=rows.slice(0,3),order=[top[1],top[0],top[2]],cls=['s','g','b'],rk=[2,1,3];
  R.querySelector('.pod').innerHTML=order.map((r,k)=>r?'<div class="pd '+cls[k]+'" data-u="'+esc(r.uid)+'">'+(k===1?'<div style="position:relative">'+av(r,rk[k]-1)+'<span class="crown">👑</span></div>':av(r,rk[k]-1))+'<div class="nm">'+esc(r.uid===me?'ฉัน':r.name)+'</div><div class="mr">🪷 '+full(r.merit)+'</div><div class="blk">'+rk[k]+'</div></div>':'<div class="pd"></div>').join('');
  const row=(r,i)=>{const p=prev[r.uid],d=p?p-(i+1):0;return '<div class="r'+(r.uid===me?' me':'')+'" data-u="'+esc(r.uid)+'"><span class="rk">'+(i+1)+'</span>'+av(r,i)+'<span class="nm">'+esc(r.uid===me?'ฉัน ('+(r.name||'')+')':r.name)+'</span><span class="mr">🪷 '+full(r.merit)+'</span><span class="dl '+(d>0?'up':d<0?'dn':'eq')+'">'+(d>0?'▲'+d:d<0?'▼'+(-d):'–')+'</span></div>';};
  const L=R.querySelector('.list');L.innerHTML=rows.slice(3).map((r,i)=>row(r,i+3)).join('')||'<div class="msg" style="text-align:center;color:#9a7a68">ยังไม่มีเพื่อนคนอื่น</div>';
  const mi=rows.findIndex(r=>r.uid===me);const pin=R.querySelector('.pin');if(mi>=0){pin.innerHTML=row(rows[mi],mi);const upd=()=>{const el=L.querySelector('.r.me');let vis=false;if(el){const a=el.getBoundingClientRect(),b=L.getBoundingClientRect();vis=a.bottom>b.top&&a.top<b.bottom;}else if(mi<3)vis=true;pin.classList.toggle('on',!vis);};L.addEventListener('scroll',upd);setTimeout(upd,50);}
  R.onclick=e=>{const u=e.target.closest('[data-u]');if(!u)return;const uid=u.dataset.u;bye();close();if(uid===me){if(visiting())click('vHome');return;}try{visit(uid);}catch(err){console.error(err);}};}
 let cur=null;
 function close(){strip.classList.remove('on');shade.classList.remove('on');document.body.classList.remove('s4open');cur=null;}
 function go(k){const [a,b]=k.split(':');const L=LV[a](b);cur=k;
  if(L.grid){L.items=[].concat(...L.grid.map(g=>g.items));let n=0;strip.innerHTML='<div class="hd"><span>'+L.t+'</span><button class="x" data-x="1">✕</button></div><div class="gridw">'+L.grid.map(g=>'<div class="gh">'+g.t+'</div><div class="grid">'+g.items.map(it=>'<button class="t" data-i="'+(n++)+'"><div class="s4k '+it.c+'">'+it.ic+(it.badge?'<em>'+it.badge+'</em>':'')+'</div><span>'+esc(it.lab)+'</span></button>').join('')+'</div>').join('')+'</div>';
   strip._L=L;strip.classList.add('on');shade.classList.add('on');document.body.classList.add('s4open');return;}
  strip.innerHTML='<div class="hd">'+(L.back?'<button data-back="'+L.back+'">‹</button>':'')+'<span>'+L.t+'</span><button class="x" data-x="1">✕</button></div><div class="row">'+
   (L.friends?'<div class="msg">⏳</div>':(L.items.length?L.items.map((it,i)=>'<button class="t" data-i="'+i+'"><div class="s4k '+it.c+'">'+it.ic+(it.badge!=null&&it.badge!==''?'<em>'+(it.badge?nf(it.badge):'0')+'</em>':'')+'</div><span>'+esc(it.lab)+'</span></button>').join(''):'<div class="msg">'+(L.empty||'')+'</div>'))+'</div>';
  strip._L=L;strip.classList.add('on');shade.classList.add('on');document.body.classList.add('s4open');if(L.friends)loadFriends();}
 strip.onclick=e=>{const bk=e.target.closest('[data-back]');if(bk)return go(bk.dataset.back);if(e.target.closest('[data-x]'))return close();
  const f=e.target.closest('[data-f]');if(f){const r=FR[+f.dataset.f];close();if(!r)return;if(r.uid===H().uid){if(visiting())click('vHome');return;}try{visit(r.uid);}catch(err){console.error(err);}return;}
  const t=e.target.closest('[data-i]');if(!t||!strip._L)return;const it=strip._L.items[+t.dataset.i];try{it.act();}catch(err){console.error(err);}};
 shade.onclick=close;
 dockR.onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;go(k);};
 // เพื่อน: รูปโปรไฟล์เรียงในแถบ แตะแล้วไปเยี่ยมสวน
 const COL=['#F6A9BD','#8FC9F0','#F5B65B','#7FD1AE','#B9A3F0','#F28C8C'];let FR=[];
 async function loadFriends(){const row=strip.querySelector('.row');try{const h=H();const rows=await h.roster();const me=h.uid;FR=rows.filter(r=>!r.admin||r.uid===me).sort((a,b)=>(b.uid===me)-(a.uid===me)||b.merit-a.merit);
  if(cur!=='friends')return;row.innerHTML=FR.map((r,i)=>'<button class="t f'+(r.uid===me?' me':'')+'" data-f="'+i+'"><i style="background:'+COL[i%COL.length]+'">'+esc((r.name||'?')[0])+'</i><span>'+esc(r.uid===me?'สวนฉัน':r.name)+'</span></button>').join('')||'<div class="msg">ยังไม่มีเพื่อน</div>';}catch(e){row.innerHTML='<div class="msg">โหลดรายชื่อไม่สำเร็จ</div>';}}
 // ปลูกทั้งหมด: เลือกเมล็ด 1 ครั้ง ปลูกทั้ง 2 ฟาร์ม
 let pab=false;function plantAllBoth(){pab=true;try{pending=null;plantAll=true;$('seedTitle').textContent='🌱 ปลูกทั้งหมด ('+(zoneFarm()===2?'ฝั่งข้ามสะพาน':'ฝั่งหน้าบ้าน')+')';closeAll();open('seedSheet');}catch(e){pab=false;}}
 {const sd=$('seeds');if(sd)sd.addEventListener('click',e=>{if(!pab)return;const s=e.target.closest('.seed');if(!s)return;e.stopImmediatePropagation();pab=false;try{closeAll();}catch(_){}both('plant',{crop:s.dataset.k,all:true});},true);}
 // ลากนิ้วใช้ทีละแปลง (เค้ก/มะพร้าว/ปีก) — มีป้ายเล็กด้านบนบอกว่ากำลังใช้อะไร กด ✓ เพื่อเลิก
 function setTool(t){window.__s4curTool=t;const w=f3w();if(w)w.__s4tool=t;if(t==='auto'){tool.classList.remove('on');try{toast('✋ ลากนิ้วผ่านแปลง: เก็บ · รดน้ำ · ไล่หนอน · ปลูกซ้ำ');}catch(e){}return;}
  const N={cake:'เค้ก',coconut:'มะพร้าว',angel:'ปีกนางฟ้า'}[t];tool.innerHTML='<img src="'+(typeof IMG!=='undefined'&&IMG['it-'+t]||'')+'">ลากนิ้วผ่านแปลงเพื่อใช้'+N+' · มี '+nf(bag()[t]||0)+'<button>เสร็จ</button>';tool.classList.add('on');tool.querySelector('button').onclick=()=>setTool('auto');}
 setInterval(()=>{const t=window.__s4curTool;if(tool.classList.contains('on')&&t&&t!=='auto'){const sp=tool.childNodes[1];if(sp&&sp.nodeType===3)sp.textContent='ลากนิ้วผ่านแปลงเพื่อใช้'+({cake:'เค้ก',coconut:'มะพร้าว',angel:'ปีกนางฟ้า'}[t])+' · มี '+nf(bag()[t]||0);}},1500);
 // ผลผลิตเด้งเข้ากระเป๋าแบบเบาเครื่อง: ลอยจากแปลง 3D จริง รูปเดียวต่อแปลง (โชว์ +จำนวน) ไม่มีฟิลเตอร์เงา จำกัดพร้อมกันไม่เกิน 10 ชิ้น
 {const st=document.createElement('style');st.textContent='.s4hp{position:fixed;z-index:50;width:40px;height:40px;margin:-20px 0 0 -20px;pointer-events:none;will-change:transform,opacity}.s4hp img{width:100%;height:100%;object-fit:contain}.s4hp b{position:absolute;right:-8px;bottom:-4px;font:800 12px Mali,sans-serif;color:#fff;text-shadow:0 0 3px #6b3d14,0 1px 0 #6b3d14}';document.head.appendChild(st);
  /* S4: เก็บทั้งหมด = ผักเด้งออกจากแปลงทีละต้น (ห่างกันนิด ๆ) แล้วค่อยลอยเข้ากระเป๋า · ไม่ทิ้งชิ้นไหน แค่ต่อคิว */
  let live=0;const HQ=[];let hqT=0;const hqRun=()=>{hqT=0;if(!HQ.length)return;if(live>=14){hqT=setTimeout(hqRun,140);return;}hpop(...HQ.shift());if(HQ.length)hqT=setTimeout(hqRun,120);};
  window.harvestPop=function(src,rect,q){if(!src)return;if(HQ.length>60)return;HQ.push([src,rect,q]);if(!hqT)hqRun();};
  const hpop=function(src,rect,q){let x=rect?rect.left+rect.width/2:innerWidth/2,y=rect?rect.top+rect.height*.4:innerHeight/2;
   try{if(rect&&typeof plotEls!=='undefined'){const i=plotEls.findIndex(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-rect.left)<1&&Math.abs(r.top-rect.top)<1;});const w=f3w();const XY=i>=0&&w&&w.__s4plotsXY?w.__s4plotsXY(farm===2?1:0)[i]:null;if(XY){x=XY[0];y=XY[1]-20;}}}catch(e){}
   const tg=dockR.querySelector('[data-k="menu"]').getBoundingClientRect(),tx=tg.left+tg.width/2-x,ty=tg.top+tg.height/2-y;
   const el=document.createElement('div');el.className='s4hp';el.style.left=x+'px';el.style.top=y+'px';el.innerHTML='<img src="'+src+'" alt="">'+((q||1)>1?'<b>+'+q+'</b>':'');document.body.appendChild(el);live++;
   const sp=document.createElement('div');sp.className='s4hs';sp.style.left=x+'px';sp.style.top=y+'px';sp.textContent='✨';document.body.appendChild(sp);sp.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:'translate(-50%,-90%) scale(1.6)',opacity:0}],{duration:600,easing:'ease-out'}).onfinish=()=>sp.remove();
   const rz=(Math.random()<.5?-1:1)*(8+Math.random()*8);const a=el.animate([{transform:'translate(0,12px) scale(.2) rotate(0deg)',opacity:0},{transform:'translate(0,-74px) scale(1.28) rotate('+rz+'deg)',opacity:1,offset:.2},{transform:'translate(0,-18px) scale(.92) rotate('+(-rz/2)+'deg)',opacity:1,offset:.34},{transform:'translate(0,-40px) scale(1.06) rotate(0deg)',opacity:1,offset:.44},{transform:'translate(0,-34px) scale(1)',opacity:1,offset:.62},{transform:'translate('+tx+'px,'+ty+'px) scale(.35)',opacity:.35}],{duration:1550,easing:'cubic-bezier(.25,.8,.35,1)',fill:'forwards'});
   const end=()=>{if(!el.parentNode)return;el.remove();live--;try{dockR.querySelector('[data-k="menu"]').animate([{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:260});}catch(e){}};a.onfinish=end;setTimeout(end,1900);};
  {const st2=document.createElement('style');st2.textContent='.s4hs{position:fixed;z-index:41;pointer-events:none;font-size:26px}';document.head.appendChild(st2);}}
 const badge=()=>{const n=mailN();dockR.querySelector('[data-k="menu"] em').textContent=n?(n>99?'99+':n):'';};badge();setInterval(badge,3000);
 /* S4: มีของเข้าไปรษณีย์ใหม่ → แจ้งเตือนสั้นๆ */{let pm=-1;setInterval(()=>{const n=mailN();if(pm>=0&&n>pm){try{toast('📮 มีของเข้าไปรษณีย์ใหม่ '+(n-pm)+' ชิ้น · แตะตู้หน้าบ้านเพื่อรับ');}catch(e){}}pm=n;},3000);}
 // 📸 ถ่ายรูปทั้งฟาร์ม (ใต้ปุ่มกล้อง)
 {const pb=document.createElement('button');pb.id='s4photoB';pb.className='s4k c2';pb.title='ถ่ายรูป';pb.textContent='📸';pb.style.cssText='position:fixed;z-index:7;right:10px;top:calc(env(safe-area-inset-top,0px) + 60px);width:42px;height:42px;font-size:19px;border-radius:13px';document.body.appendChild(pb);
  const st=document.createElement('style');st.textContent='body.s4full #s4photoB{display:none!important}';document.head.appendChild(st);
  pb.onclick=()=>{const w=f3w();if(!w||!window.S4PHOTO)return;const name=(document.getElementById('nm')||{}).textContent||'';
   if(w.__s4photoAngle&&S4PHOTO.mode)S4PHOTO.mode({name,presets:[['wide','🌄 มุมกว้าง'],['tiltL','↙️ เฉียงซ้าย'],['tiltR','↘️ เฉียงขวา'],['mid','🌿 มุมกลาง'],['face','👧 ใกล้ตัวละคร']],set:k=>w.__s4photoAngle(k),restore:()=>w.__s4photoAngle(null),snap:()=>w.__s4photoSnap()});
   else if(w.__s4photo)S4PHOTO.shoot(()=>w.__s4photo(),{name});};}
 // ปุ่มกล้อง (มุมขวาบน) แตะสลับมุม: มองกว้าง → ปกติ → มุมใกล้
 {const cb=document.createElement('button');cb.id='s4cam';cb.className='s4k c5';cb.title='มุมกล้อง';cb.textContent='📷';cb.style.cssText='position:fixed;z-index:7;right:10px;top:calc(env(safe-area-inset-top,0px) + 10px);width:42px;height:42px;font-size:19px;border-radius:13px';document.body.appendChild(cb);
  /* S4 ข้อ 18: กล้องปุ่มเดียว แตะแล้วกางเป็นไอคอน 3 มุม (ไม่มีตัวหนังสือ) เลือกแล้วหุบ */
  let ci=1;try{const v=localStorage.getItem('farm1-cam');if(v!==null)ci=+v;}catch(e){}
  const row=document.createElement('div');row.id='s4camRow';row.style.cssText='position:fixed;z-index:7;right:10px;top:calc(env(safe-area-inset-top,0px) + 58px);display:none;flex-direction:column;gap:6px';
  const ICO=['<svg viewBox="0 0 24 24" width="22" height="22"><rect x="2" y="5" width="20" height="14" rx="3" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M6 9h4M6 15h4M14 9h4M14 15h4" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>','<svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 11l9-7 9 7v9H3z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><rect x="9.5" y="13" width="5" height="7" fill="#fff"/></svg>','<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="10" cy="10" r="6.5" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M15 15l6 6" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>'];
  const paint=()=>{row.querySelectorAll('button').forEach((b,i)=>{b.style.opacity=i===ci?'1':'.55';b.style.transform=i===ci?'scale(1.08)':'';});};
  ICO.forEach((ic,i)=>{const b=document.createElement('button');b.className='s4k c5';b.innerHTML=ic;b.setAttribute('aria-label',['มุมกว้าง','มุมปกติ','มุมใกล้'][i]);b.style.cssText='width:42px;height:42px;border-radius:13px;display:flex;align-items:center;justify-content:center';b.onclick=e=>{e.stopPropagation();ci=i;const w=f3w();if(w&&w.__s4setCam)w.__s4setCam(ci);paint();row.style.display='none';};row.appendChild(b);});
  document.body.appendChild(row);cb.onclick=()=>{const on=row.style.display!=='flex';row.style.display=on?'flex':'none';if(on)paint();};
  document.addEventListener('pointerdown',e=>{if(row.style.display==='flex'&&!row.contains(e.target)&&e.target!==cb)row.style.display='none';},true);
  const st=document.createElement('style');st.textContent='body.s4full #s4cam,body.s4full #s4camRow,body.s4sheet #s4camRow,body.s4photo #s4camRow,body.s4pmode #s4camRow{display:none!important}';document.head.appendChild(st);}
 window.__s4curTool='auto';window.__s4go=go;
 // ---- กระเป๋าแบบเกมใหญ่: ช่องรูปของล้วน ตัวเลขมุมช่อง แตะแล้วโชว์ชื่อด้านบน (ไม่มีตัวหนังสือเต็มจอ) ----
 {const bc=document.createElement('style');bc.textContent=`
#bagSheet{background:linear-gradient(180deg,#fff9ef,#ffeed5)!important;border:3px solid #fff!important;box-shadow:0 -8px 30px rgba(80,40,10,.32),inset 0 0 0 2px #f1cd98!important;padding-top:.6rem!important}
#bagSheet h3{display:inline-flex!important;align-items:center;gap:4px;margin:0 0 .45rem!important;font-size:.9rem!important;padding:.2rem .8rem;border-radius:999px;background:linear-gradient(180deg,#ffd98a,#f5b04a)!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#fff!important;text-shadow:0 1px 0 #b8741f;box-shadow:0 2px 0 #c98a2c}
#bagTabs{display:flex!important;gap:5px!important;overflow-x:auto;flex-wrap:nowrap!important;scrollbar-width:none;padding:2px 1px 6px!important;margin:0!important}
#bagTabs::-webkit-scrollbar{display:none}
#bagTabs button{flex:0 0 auto;font-size:.68rem!important;font-weight:800;padding:.32rem .6rem!important;border-radius:999px!important;border:2px solid #fff!important;background:#f6e2c4!important;color:#8a5a2e!important;box-shadow:0 2px 0 #d9b07a!important}
#bagTabs button.on{background:linear-gradient(180deg,#8fd36f,#5bb04a)!important;color:#fff!important;box-shadow:0 2px 0 #3f8a32!important}
#bagGrid{grid-template-columns:repeat(5,1fr)!important;gap:7px!important;padding:4px 2px!important}
#bagGrid .it{position:relative;aspect-ratio:1;padding:0!important;border:0!important;border-radius:14px!important;background:radial-gradient(circle at 50% 38%,#fffefa 0,#fbecd2 70%,#f1d6ad 100%)!important;box-shadow:inset 0 0 0 2px #fff,0 3px 0 #d8ac74,0 4px 8px rgba(120,70,20,.12)!important;display:flex;align-items:center;justify-content:center;overflow:visible}
#bagGrid .it img{width:76%!important;height:76%!important;aspect-ratio:auto!important;object-fit:contain;filter:drop-shadow(0 2px 2px rgba(90,50,10,.22))}
#bagGrid .it b{display:none!important}
#bagGrid .it span{position:absolute;right:3px;bottom:1px;font:800 10.5px Mali,sans-serif!important;color:#fff!important;text-shadow:-1px -1px 0 #7a4316,1px -1px 0 #7a4316,-1px 1px 0 #7a4316,1px 1px 0 #7a4316}
#bagGrid .it em{position:absolute;left:2px;top:2px;font:800 8px Mali,sans-serif;font-style:normal;background:rgba(255,255,255,.9);border-radius:6px;padding:0 3px;color:#8a5a2e}
#bagGrid .it .cq{position:absolute;right:-4px;top:-5px;font:800 8.5px Mali,sans-serif;font-style:normal;background:#ff6f91;color:#fff;border-radius:8px;padding:1px 4px;z-index:1}
#bagGrid .it.in{box-shadow:inset 0 0 0 2px #ff8fb3,0 3px 0 #e0789a!important}
#bagGrid .it.sel{box-shadow:inset 0 0 0 3px #ffd36b,0 3px 0 #c9922a,0 0 12px rgba(255,211,107,.8)!important;transform:translateY(-2px)}
#bagGrid .it.how::after{font-size:.55rem!important}
#bagGrid .empty{font-size:.78rem;color:#b08a64;padding:1.4rem 0;text-align:center}
#bagGrid .sxbar{grid-column:1/-1;display:flex;align-items:center;justify-content:flex-end;gap:6px;padding:0!important;background:none!important;border:0!important;box-shadow:none!important;margin:0 0 2px}
#bagGrid .sxbar>div{display:none}
#bagGrid .sxbar button{font-size:.68rem!important;padding:.3rem .7rem!important;border-radius:999px!important}
#s4bagInfo{grid-column:1/-1;display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 2px #f3dcb8;min-height:48px}
#s4bagInfo img{width:40px;height:40px;object-fit:contain}#s4bagInfo b{font-size:.82rem;color:#6e4b3a;display:block}#s4bagInfo small{font-size:.68rem;color:#b08060;font-weight:700}
#s4bagInfo .tip{font-size:.7rem;color:#b08a64}`;document.head.appendChild(bc);
  const grid=$('bagGrid');
  const info=(it)=>{let el=$('s4bagInfo');if(!el){el=document.createElement('div');el.id='s4bagInfo';grid.prepend(el);}if(!it){el.innerHTML='<span class="tip">👆 แตะของเพื่อดูชื่อ</span>';return;}
   const im=it.querySelector('img'),nm=(it.querySelector('b')||{}).textContent||'',q=(it.querySelector('span')||{}).textContent||'';el.innerHTML=(im?'<img src="'+im.getAttribute('src')+'">':'')+'<div><b>'+esc(nm)+'</b><small>'+esc(q)+'</small></div>';};
  if(grid){new MutationObserver(()=>{if(!$('s4bagInfo')&&grid.querySelector('.it'))info(null);}).observe(grid,{childList:true});
   grid.addEventListener('click',e=>{const it=e.target.closest('.it');if(!it)return;grid.querySelectorAll('.it.sel').forEach(x=>x.classList.remove('sel'));it.classList.add('sel');info(it);});}}
})();
/* S4: เปิดหน้าต่างไหน ปุ่มมุมขวาล่างหลบให้ (ไม่บังปุ่มในหน้าต่าง) */
(()=>{const st=document.createElement('style');st.textContent='body.s4sheet #s4dockR,body.s4sheet #s4cam,body.s4sheet #s4photoB,body.s4sheet #s4tool{opacity:0!important;pointer-events:none!important;transition:opacity .15s}';document.head.appendChild(st);
 setInterval(()=>{let on=false;try{on=!!document.querySelector('.sheet.on:not(#s4strip),#modal.on,.modal.on,#mini.on,.craft-result.on')}catch(e){}document.body.classList.toggle('s4sheet',on);},250);})();
/* S4: น้องน้ำผึ้งใช้รูปจริง (รถจี๊ป · เรือโจรสลัด · แพไม้ · หน้าน้องน้ำผึ้ง) แทนอีโมจิ */
(()=>{const V={jeep:'images/honey-jeep-in-4x4.webp',ship:'images/honey-boat-in-4x4.webp',raft:'images/honey-raft-in-4x4.webp'};
 const st=document.createElement('style');st.textContent='.hopt i.s4hv{position:relative!important;overflow:hidden!important;font-size:0!important;width:4rem!important;height:4rem!important;min-width:4rem;border-radius:18px!important;background:linear-gradient(180deg,#e9f7ff,#bfe3ff)!important;box-shadow:inset 0 0 0 3px #fff}.hopt i.s4hv img{position:absolute;left:0;top:0;width:400%;height:400%;max-width:none}#honeySheet h3 img.s4hf{width:2.1rem;height:2.1rem;vertical-align:middle;margin-right:.35rem;object-fit:contain}';document.head.appendChild(st);
 const fix=()=>{document.querySelectorAll('.hopt[data-v]').forEach(b=>{const i=b.querySelector('i');const u=V[b.dataset.v];if(!i||!u||i.classList.contains('s4hv'))return;i.classList.add('s4hv');i.textContent='';const im=document.createElement('img');im.src=u;im.alt='';i.appendChild(im);});
  const h=document.querySelector('#honeySheet h3');if(h&&!h.querySelector('img.s4hf')){h.textContent=h.textContent.replace(/^\s*🐷\s*/,'');const im=document.createElement('img');im.className='s4hf';im.src='images/honey-face-happy.webp';im.alt='';h.prepend(im);}};
 fix();setInterval(fix,1500);})();
/* S4: มาจากแผนที่ซาฟารี "โรงเรือนสัตว์" → เข้าฟาร์มแล้วพาไปโซนโรงเรือนเลย */
(()=>{let z=null;try{z=sessionStorage.getItem('s4zone');if(z)sessionStorage.removeItem('s4zone');}catch(e){}if(!z)return;
 const iv=setInterval(()=>{try{const w=document.getElementById('f3d')?.contentWindow;if(w&&w.__ready&&w.__s4zone){clearInterval(iv);setTimeout(()=>w.__s4zone(z),600);}}catch(e){}},400);setTimeout(()=>clearInterval(iv),60000);})();
