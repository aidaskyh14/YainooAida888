/* ซีซัน 4: ให้ฉากซาฟารี 3D ใช้ข้อมูลนกจริงของซีซัน 3 (กติกาเดิมทุกอย่าง: อาหารต่อตัว เวลารอ ผลผลิต กุศล) */
/* S4 ข้อ 51 🐒 ลิง: ได้จากยัยหนูเท่านั้น (item.monkey ในกระเป๋าหลัก สูงสุด 3 ตัวที่โหนซิปไลน์) · ทุก 6 ชม. ต่อตัว ได้ผ้าอ้อมลิง 1 ชิ้น (bird.mkdiaper · ขายได้ 2,000,000) · เก็บค้างได้สูงสุด 12 ชิ้น */
/* S4 ข้อ 17 (5 พ.ย.): ลิงไม่จำกัดตัว ผ้าอ้อมไม่จำกัด · ให้อาหารแบบนก 3 เมนู → ครบเวลา มีโอกาสหล่นผ้าอ้อม 4 แบบบนพื้น → กด 🧺 เก็บ */
const MKF={banana:['กล้วยหอม',3,.40,'produce-banana.webp'],smoothie:['สมูทตี้กล้วยนม',5,.60,'mk-food-smoothie.webp'],cake:['เค้กกล้วย',8,.85,'mk-food-cake.webp']};
const MKR={smoothie:{'กล้วย':250,'นมวัว':30,'ไข่ไก่':10},cake:{'กล้วย':600,'ไข่ไก่':60,'นมวัว':60,'ชีส':20}},MK_BANANA=100,MK_OK=.5;
const MKD=[['mkdiaper',60,1,'ผ้าอ้อมขาว','s4-mkdiaper.webp'],['mkdiaper2',28,3,'ผ้าอ้อมกล้วย','s4-mkdiaper-2.webp'],['mkdiaper3',10,8,'ผ้าอ้อมดาว','s4-mkdiaper-3.webp'],['mkdiaper4',2,25,'ผ้าอ้อมทอง','s4-mkdiaper-4.webp']];
const mkPick=()=>{let r=Math.random()*100;for(const d of MKD){r-=d[1];if(r<0)return d[0];}return 'mkdiaper';};
const MKDI=Object.fromEntries(MKD.map(d=>[d[0],d]));
/* S4 ลิง (คำตอบยัยหนู 4 พ.ย.): ยัยหนูส่ง → รับที่ไปรษณีย์ → อยู่ในกระเป๋า (item.monkey) → กด 🐒 วางลิง ในซาฟารี → เริ่มนับ 36 ชม. · วางได้ไม่จำกัด · เก็บในเซฟนก S.mk */
const MK_LIFE=36*3600000;function mkAlive(){const now=NOW();S.mk=(S.mk||[]).filter(r=>r&&now<r.at+MK_LIFE);return S.mk;}
function mkExpire(){const before=(S.mk||[]).length;const left=mkAlive().length;if(left<before){save();try{ann('👋 ลิง '+(before-left)+' ตัว ครบ 36 ชม. กลับป่าแล้ว',0,3500);}catch(e){}}}
function mkCount(){try{return mkAlive().length;}catch(e){return 0;}}
let mkBusy=0;window.__mkPlace=()=>{if(Date.now()-mkBusy<1200)return{t:'mkp',ok:0,msg:''};mkBusy=Date.now();const G=s4ccMain();if(!G||!G.bag)return{t:'mkp',ok:0,msg:'ยังโหลดกระเป๋าไม่เสร็จ ลองใหม่อีกครั้งนะ'};
 const have=Math.max(0,(G.bag.item&&G.bag.item.monkey)|0);if(have<1)return{t:'mkp',ok:0,msg:'🐒 ไม่มีลิงในกระเป๋า · ลิงได้จากยัยหนูส่งให้เท่านั้น'};
 G.bag.item.monkey=have-1;try{__H.set(S4CCGK,JSON.stringify(G));}catch(e){return{t:'mkp',ok:0,msg:(e&&e.message)||'บันทึกไม่สำเร็จ'};}
 mkAlive();S.mk.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),at:NOW()});save();
 return{t:'mkp',ok:1,msg:'🐒 วางลิงแล้ว อยู่ได้ 36 ชม. · ให้อาหารลิงที่ 🐒 ให้อาหารลิง · เหลือในกระเป๋า '+(have-1)+' ตัว',mkl:S.mk.map(r=>[r.id,r.at])};};
function mkTick(){S.mkdrop=Array.isArray(S.mkdrop)?S.mkdrop:[];return 0;}/* ผ้าอ้อมมาจากการให้อาหารเท่านั้น */
const mkReady=()=>{const now=NOW();return (S.mkdrop||[]).filter(d=>d&&d.t<=now);};
const mkHungry=()=>{const now=NOW();return mkAlive().filter(r=>!(r.cd>now));};
window.__mkfeed=k=>{const f=MKF[k];if(!f)return{t:'mkfeed',n:0};const list=mkHungry();if(!list.length)return{t:'mkfeed',n:0,msg:mkAlive().length?'🐒 ลิงยังอิ่มอยู่ รอ ⏳ ก่อนนะ':'🐒 ยังไม่มีลิงในซาฟารี · กด 🐒 วางลิงก่อน'};
 const n=list.length;if(k==='banana'){const need=MK_BANANA*n,have=S.mats['กล้วย']||0;if(have<need)return{t:'mkfeed',n:0,msg:'🍌 กล้วยไม่พอ ต้องใช้ '+need.toLocaleString()+' มี '+have.toLocaleString()};S.mats['กล้วย']=have-need;}
 else{const key='mk-'+k,have=S.bag[key]||0;if(have<n)return{t:'mkfeed',n:0,msg:f[0]+' ไม่พอ ต้องใช้ '+n+' มี '+have+' · คราฟได้ที่ 🍳 คราฟอาหาร'};S.bag[key]=have-n;}
 const now=NOW();S.mkdrop=S.mkdrop||[];let lucky=0;for(const r of list){r.cd=now+f[1]*3600000;if(Math.random()<f[2]){S.mkdrop.push({k:mkPick(),t:r.cd,m:r.id});lucky++;}}
 save();return{t:'mkfeed',n,k,lucky,h:f[1]};};
/* ⚡ เร่งลิง: ใช้แบตเตอรี่ (กระเป๋าหลัก) ตัวละ 1 → ครบเวลาทันที · ผ้าอ้อมที่เร่ง นับแต้มแคมเปญครึ่งเดียว */
window.__mkboost=()=>{const now=NOW(),list=mkAlive().filter(r=>r.cd>now);if(!list.length)return{t:'mkboost',n:0,msg:'ไม่มีลิงที่กำลังย่อยอาหาร'};const G=s4ccMain();if(!G||!G.bag)return{t:'mkboost',n:0,msg:'ยังโหลดกระเป๋าไม่เสร็จ'};
 G.bag.item=G.bag.item||{};const have=Math.max(0,G.bag.item.battery|0),n=Math.min(have,list.length);if(n<1)return{t:'mkboost',n:0,msg:'🔋 ไม่มีแบตเตอรี่'};
 G.bag.item.battery=have-n;try{__H.set(S4CCGK,JSON.stringify(G));}catch(e){return{t:'mkboost',n:0,msg:(e&&e.message)||'บันทึกไม่สำเร็จ'};}
 for(const r of list.slice(0,n)){r.cd=now;for(const d of S.mkdrop||[])if(d.m===r.id&&d.t>now){d.t=now;d.h=1;}}save();return{t:'mkboost',n,left:have-n};};
window.__mkcollect=()=>{const now=NOW(),take=mkReady();if(!take.length)return{n:0,got:{},pts:0};const got={};let pts=0;for(const d of take){S.bag[d.k]=(S.bag[d.k]||0)+1;got[d.k]=(got[d.k]||0)+1;pts+=(MKDI[d.k]?MKDI[d.k][2]:1)*(d.h?.5:1);}
 try{const H=window.__H||parent.__HOST;H&&H.nbReport&&H.nbReport('mkdiaper',take.length);}catch(e){}/* S4 ภารกิจชุมชน */S.mkdrop=(S.mkdrop||[]).filter(d=>!(d.t<=now));S.mkpts=Math.round(((S.mkpts||0)+pts)*10)/10;return{n:take.length,got,pts};};
window.__mkcraft=(k,q)=>{const r=MKR[k];q=Math.max(1,Math.min(10,q|0));if(!r)return null;for(const[a,n]of Object.entries(r))if((S.mats[a]||0)<n*q)return{err:'วัตถุดิบไม่พอสำหรับ '+q+' ครั้ง'};
 for(const[a,n]of Object.entries(r))S.mats[a]-=n*q;const res=[];for(let i=0;i<q;i++)res.push(Math.random()<MK_OK);const w=res.filter(Boolean).length;S.bag['mk-'+k]=(S.bag['mk-'+k]||0)+w;save();return{res,w};};
window.__MK={MKF,MKR,MKD,MK_BANANA};
window.__bsync=()=>{const n={ostrich:0,dodo:0},h={ostrich:0,dodo:0},now=NOW();let dr=0;let mkGot=0;try{mkTick();}catch(e){}
 for(const p of [1,2]){for(const b of (S.pens[p]||[]).filter(alive)){n[b.sp]++;if(b.cd<=now)h[b.sp]++;}dr+=(S.drops[p]||[]).length;}
 try{mkExpire();}catch(e){}return{birds:1,mkl:(S.mk||[]).map(r=>[r.id,r.at]),n,h,food:Object.assign({},S.food),drops:dr,merit:S.merit,cclv:Math.max(1,Math.min(3,(+S.s4cc|0)||1)),mk:mkCount(),mkGot,mkd:mkReady().map(d=>[d.m,d.k]),mkh:mkHungry().length,diapers:MKD.reduce((t,d)=>t+(S.bag[d[0]]||0),0)};};
window.__bfeed=k=>{const f=FOOD[k];if(!f)return{t:'feed',n:0};const now=NOW();const list=[];
 for(const p of [1,2])for(const b of (S.pens[p]||[]).filter(alive))if(b.sp===f[0]&&b.cd<=now)list.push([p,b]);
 if(!list.length)return{t:'feed',n:0,msg:'ยังไม่มีนกที่พร้อมกิน รอ ⏳ ก่อนนะ'};
 const need=f[2]*list.length;if((S.food[k]||0)<need)return{t:'feed',n:0,msg:'อาหารไม่พอ ต้องใช้ '+need+' มี '+(S.food[k]||0)+' · คราฟอาหารได้ในเมนูนก'};
 S.food[k]-=need;
 list.forEach(([p,b])=>{b.cd=now+f[3]*MIN;const a=(typeof actors!=='undefined'?actors:[]).find(x=>x.b.id===b.id);const[ox,oy]=a?[a.x,a.y]:rndPt();const[pk,q]=f[4][Math.floor(Math.random()*f[4].length)];
  S.drops[p].push({k:pk,q,x:Math.max(80,Math.min(860,ox+(Math.random()*90-45))),y:Math.max(500,Math.min(1250,oy+10+Math.random()*30))});if(a)a.b.cd=b.cd;});
 save();try{drawDrops();}catch(e){}
 return{t:'feed',n:list.length,k,sp:f[0],left:S.food[k]};};
window.__bcollect=()=>{const got={};let cm=0,c=0;{const m=window.__mkcollect();for(const[k,q]of Object.entries(m.got)){got[k]=(got[k]||0)+q;c+=q;}}
 for(const p of [1,2]){for(const d of (S.drops[p]||[])){got[d.k]=(got[d.k]||0)+d.q;S.bag[d.k]=(S.bag[d.k]||0)+d.q;cm+=(DROP_MER[d.k]||0)*d.q;c++;}S.drops[p]=[];}
 if(!c)return{t:'col',n:0};if(cm>0)S.merit=(S.merit||0)+cm;save();try{drawDrops();}catch(e){}
 return{t:'col',n:c,got:Object.entries(got).map(([k,q])=>[PN[k]||(MKDI[k]&&MKDI[k][3])||k,q]),merit:cm};};
/* S4: เลเวลศูนย์ดรอปซาฟารี (เก็บในเซฟนก S.s4cc) · ของนกหักจากกระเป๋านก · วัสดุป่าหักจากกระเป๋าหลัก (หน้านี้ไม่มีหน้าอื่นเขียนกระเป๋าหลักพร้อมกัน) */
const S4CCGK='s3all-v1';const s4ccMain=()=>{try{const v=__H&&__H.get(S4CCGK);return v?JSON.parse(v):null;}catch(e){return null;}};
const s4ccHave=(r,G)=>r[0]==='f'?Math.max(0,Number(((G&&G.bag&&G.bag.forest)||{})[r[1]])||0):Math.max(0,Number((S.bag||{})[r[1]])||0);
window.__bccinfo=()=>{const D=window.S4CC&&S4CC.safari,lv=Math.max(1,Math.min(3,(+S.s4cc|0)||1));if(!D||lv>=3)return{t:'ccinfo',lv,max:lv>=3};const G=s4ccMain();
 return{t:'ccinfo',lv,nx:lv+1,rows:D.need[lv+1].map(r=>[r[3],s4ccHave(r,G),r[2]])};};
let s4ccBusy=0;window.__bccup=()=>{const D=window.S4CC&&S4CC.safari,lv=Math.max(1,Math.min(3,(+S.s4cc|0)||1)),nx=lv+1;if(!D||nx>3)return{t:'ccup',ok:0,lv,msg:'ศูนย์เลเวลสูงสุดแล้ว'};
 if(Date.now()-s4ccBusy<1500)return{t:'ccup',ok:0,lv,busy:1};s4ccBusy=Date.now();
 const G=s4ccMain();if(!G||!G.bag)return{t:'ccup',ok:0,lv,msg:'ยังโหลดกระเป๋าไม่เสร็จ ลองใหม่อีกครั้งนะ'};const need=D.need[nx];
 if(need.some(r=>s4ccHave(r,G)<r[2]))return{t:'ccup',ok:0,lv,msg:'ของยังไม่พอ'};
 G.bag.forest=G.bag.forest||{};for(const r of need)if(r[0]==='f')G.bag.forest[r[1]]=s4ccHave(r,G)-r[2];
 try{__H.set(S4CCGK,JSON.stringify(G));}catch(e){return{t:'ccup',ok:0,lv,msg:(e&&e.message)||'บันทึกไม่สำเร็จ ของยังไม่เปลี่ยน'};}
 for(const r of need)if(r[0]==='b')S.bag[r[1]]=s4ccHave(r,G)-r[2];S.s4cc=nx;save();return{t:'ccup',ok:1,lv:nx};};
/* S4 ข้อ 48/49: ไม่มีนกตัวอย่าง — นกมาจากกล่องนก/คลังนกจริงเท่านั้น */

/* S4 (s4anim): หน้าเดิมซ่อนอยู่หลังฉาก 3D — หยุดภาพเคลื่อนไหว 2D ที่มองไม่เห็น (ไม่ให้แย่งเครื่องจนซาฟารีหน่วง) กติกา/ข้อมูลยังทำงานครบ */
{const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=f=>f&&f.name==='anim'?0:raf(f);}
/* S4 ข้อ 17: หน้าเมนูลิง (ให้อาหาร · เร่ง · คราฟอาหารลิงใน 🍳 คราฟอาหาร · เก็บผ้าอ้อมพร้อมของนก) */
try{for(const d of MKD){PN[d[0]]=d[3];IMG[d[0]]='images/'+d[4];TIER[d[0]]=Math.min(3,MKD.indexOf(d)+1);}for(const k of ['smoothie','cake']){PN['mk-'+k]=MKF[k][0];IMG['mk-'+k]='images/'+MKF[k][3];TIER['mk-'+k]=1;}}catch(e){}
function mkFmt(n){return Number(n||0).toLocaleString('en-US');}
window.mkFeedMenu=function(){const all=mkAlive().length,hun=mkHungry().length,now=NOW();const busy=mkAlive().filter(r=>r.cd>now);
 const nx=busy.length?Math.min(...busy.map(r=>r.cd))-now:0;const ready=mkReady().length;
 const opt=(k)=>{const f=MKF[k],have=k==='banana'?(S.mats['กล้วย']||0):(S.bag['mk-'+k]||0),need=k==='banana'?MK_BANANA*hun:hun,ok=hun>0&&have>=need;
  return '<button class="opt" data-mkf="'+k+'"'+(ok?'':' disabled')+'><img src="images/'+f[3]+'"><b>'+f[0]+'<small>'+(k==='banana'?'กล้วย '+MK_BANANA+' ลูก/ตัว':'1 ชิ้น/ตัว')+' · '+f[1]+' ชม. · โอกาสได้ผ้าอ้อม '+Math.round(f[2]*100)+'%</small></b><span>'+(k==='banana'?'มีกล้วย ':'มี ')+mkFmt(have)+(hun?'<br>ใช้ '+mkFmt(need):'')+'</span></button>';};
 open('<h3>🐒 ให้อาหารลิง</h3><div class="hint">ลิงในซาฟารี '+all+' ตัว · หิว '+hun+' ตัว'+(busy.length?' · ตัวถัดไปหิวใน '+Math.ceil(nx/60000)+' นาที':'')+(ready?' · <b>ผ้าอ้อมบนพื้น '+ready+' ชิ้น</b>':'')+'</div>'+['banana','smoothie','cake'].map(opt).join('')+
  '<div class="hint" style="margin-top:.4rem">ผ้าอ้อม: 🤍 ขาว 60% · 🍌 กล้วย 28% · ⭐ ดาว 10% · 👑 ทอง 2% · สมูทตี้/เค้ก คราฟที่ 🍳 คราฟอาหาร</div>'+
  '<div class="row"><button class="btn gray" id="mkBoost"'+(busy.length?'':' disabled')+'>⚡ เร่งลิง (แบตเตอรี่ตัวละ 1)</button>'+(ready?'<button class="btn g" id="mkCol">🧺 เก็บผ้าอ้อม</button>':'')+'</div><div class="hint">ผ้าอ้อมที่ได้จากการเร่ง นับแต้มแคมเปญครึ่งเดียว</div>');
 document.querySelectorAll('[data-mkf]').forEach(b=>b.onclick=()=>{const r=window.__mkfeed(b.dataset.mkf);if(!r.n)return ann(r.msg||'ให้อาหารไม่ได้',1);closeAll();ann('🐒 ให้'+MKF[r.k][0]+' '+r.n+' ตัว · อีก '+r.h+' ชม. มีผ้าอ้อมหล่น '+r.lucky+' ชิ้น');try{parent.__s4sync&&parent.__s4sync();}catch(e){}});
 const bb=$('mkBoost');if(bb)bb.onclick=()=>{const r=window.__mkboost();if(!r.n)return ann(r.msg,1);closeAll();ann('⚡ เร่งลิง '+r.n+' ตัว · เหลือแบตเตอรี่ '+r.left);};
 const bc=$('mkCol');if(bc)bc.onclick=()=>{closeAll();collect(null);};};
{const _oc=openCraft;openCraft=function(){_oc();try{const box=document.createElement('div');let q=+(window.__mkq||1);
  const draw=()=>{box.innerHTML='<h3 style="margin-top:.8rem">🐒 คราฟอาหารลิง</h3><div class="hint">สำเร็จ 50% ต่อครั้ง · ของที่ได้เข้ากระเป๋า · วัตถุดิบใช้ทุกครั้งที่คราฟ</div><div class="row" style="justify-content:center;align-items:center;gap:.5rem"><button class="btn gray" id="mkqm">−</button><b>คราฟ '+q+' ครั้ง</b><button class="btn gray" id="mkqp">+</button></div>'+
   ['smoothie','cake'].map(k=>{const n=Object.fromEntries(Object.entries(MKR[k]).map(([a,v])=>[a,v*q]));const[ok,h]=needHTML(n);return '<button class="opt" data-mkc="'+k+'"'+(ok?'':' disabled')+'><img src="images/'+MKF[k][3]+'"><b>'+MKF[k][0]+' ×'+q+' ครั้ง<small><span class="need" style="justify-content:flex-start">'+h+'</span></small></b><span>มี '+(S.bag['mk-'+k]||0)+'</span></button>';}).join('');
   box.querySelector('#mkqm').onclick=()=>{q=Math.max(1,q-1);window.__mkq=q;draw();};box.querySelector('#mkqp').onclick=()=>{q=Math.min(10,q+1);window.__mkq=q;draw();};
   box.querySelectorAll('[data-mkc]').forEach(b=>b.onclick=()=>{const k=b.dataset.mkc,r=window.__mkcraft(k,q);if(!r||r.err)return ann((r&&r.err)||'คราฟไม่ได้',1);closeAll();
    showCraftResult({title:'คราฟ'+MKF[k][0],results:r.res,outputs:r.w?[{name:MKF[k][0],image:'images/'+MKF[k][3],quantity:r.w}]:[],consumed:Object.entries(MKR[k]).map(([a,v])=>({name:a,quantity:v*q}))},openCraft);});};
  draw();$('sb').appendChild(box);}catch(e){console.log('mkcraft',e&&e.message);}};}
{const _col=collect;collect=function(idx){if(idx)return _col(idx);const m=window.__mkcollect();if(!m.n)return _col(idx);save();try{drawDrops();}catch(e){}
  const has=(S.drops[pen]||[]).length;const list=Object.entries(m.got);open('<h3>🧺 เก็บผ้าอ้อมลิงแล้ว!</h3><div class="grid">'+list.map(([k,q])=>'<div class="cell"><img src="'+IMG[k]+'"><b>'+PN[k]+'</b><span>×'+q+'</span></div>').join('')+'</div><div class="hint">🏅 แต้มแคมเปญแม่ลิงขยันเก็บ +'+m.pts+'</div><div class="row"><button class="btn g" id="okc">เยี่ยมเลย</button></div>');$('okc').onclick=()=>{closeAll();if(has)_col(null);};};}
try{const st=document.createElement('style');st.textContent='#sb{padding-bottom:120px!important}';document.head.appendChild(st);}catch(e){}
