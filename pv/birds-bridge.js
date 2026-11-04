/* ซีซัน 4: ให้ฉากซาฟารี 3D ใช้ข้อมูลนกจริงของซีซัน 3 (กติกาเดิมทุกอย่าง: อาหารต่อตัว เวลารอ ผลผลิต กุศล) */
/* S4 ข้อ 51 🐒 ลิง: ได้จากยัยหนูเท่านั้น (item.monkey ในกระเป๋าหลัก สูงสุด 3 ตัวที่โหนซิปไลน์) · ทุก 6 ชม. ต่อตัว ได้ผ้าอ้อมลิง 1 ชิ้น (bird.mkdiaper · ขายได้ 2,000,000) · เก็บค้างได้สูงสุด 12 ชิ้น */
const MK_EVERY=6*3600000,MK_MAX=3,MK_CAP=12;
function mkCount(){try{const g=JSON.parse(parent.__HOST.get('s3all-v1')||'{}');return Math.min(MK_MAX,Math.max(0,(g.bag&&g.bag.item&&g.bag.item.monkey)|0));}catch(e){return 0;}}
function mkTick(){const n=mkCount();if(!n){S.mkAt=0;return 0;}const now=NOW();if(!S.mkAt){S.mkAt=now;save();return 0;}let got=0;while(now-S.mkAt>=MK_EVERY&&(S.bag.mkdiaper||0)<MK_CAP){S.mkAt+=MK_EVERY;S.bag.mkdiaper=(S.bag.mkdiaper||0)+n;got+=n;}if((S.bag.mkdiaper||0)>=MK_CAP)S.mkAt=now;if(got)save();return got;}
window.__bsync=()=>{const n={ostrich:0,dodo:0},h={ostrich:0,dodo:0},now=NOW();let dr=0;let mkGot=0;try{mkGot=mkTick();}catch(e){}if(mkGot){try{ann('🐒 ลิงให้ผ้าอ้อมลิง +'+mkGot+' ชิ้น (ขายได้ชิ้นละ 2,000,000)',0,4000);}catch(e){}}
 for(const p of [1,2]){for(const b of (S.pens[p]||[]).filter(alive)){n[b.sp]++;if(b.cd<=now)h[b.sp]++;}dr+=(S.drops[p]||[]).length;}
 return{birds:1,n,h,food:Object.assign({},S.food),drops:dr,merit:S.merit,cclv:Math.max(1,Math.min(3,(+S.s4cc|0)||1)),mk:mkCount(),mkGot,mkNext:S.mkAt?Math.max(0,S.mkAt+MK_EVERY-NOW()):0,diapers:S.bag.mkdiaper||0};};
window.__bfeed=k=>{const f=FOOD[k];if(!f)return{t:'feed',n:0};const now=NOW();const list=[];
 for(const p of [1,2])for(const b of (S.pens[p]||[]).filter(alive))if(b.sp===f[0]&&b.cd<=now)list.push([p,b]);
 if(!list.length)return{t:'feed',n:0,msg:'ยังไม่มีนกที่พร้อมกิน รอ ⏳ ก่อนนะ'};
 const need=f[2]*list.length;if((S.food[k]||0)<need)return{t:'feed',n:0,msg:'อาหารไม่พอ ต้องใช้ '+need+' มี '+(S.food[k]||0)+' · คราฟอาหารได้ในเมนูนก'};
 S.food[k]-=need;
 list.forEach(([p,b])=>{b.cd=now+f[3]*MIN;const a=(typeof actors!=='undefined'?actors:[]).find(x=>x.b.id===b.id);const[ox,oy]=a?[a.x,a.y]:rndPt();const[pk,q]=f[4][Math.floor(Math.random()*f[4].length)];
  S.drops[p].push({k:pk,q,x:Math.max(80,Math.min(860,ox+(Math.random()*90-45))),y:Math.max(500,Math.min(1250,oy+10+Math.random()*30))});if(a)a.b.cd=b.cd;});
 save();try{drawDrops();}catch(e){}
 return{t:'feed',n:list.length,k,sp:f[0],left:S.food[k]};};
window.__bcollect=()=>{const got={};let cm=0,c=0;
 for(const p of [1,2]){for(const d of (S.drops[p]||[])){got[d.k]=(got[d.k]||0)+d.q;S.bag[d.k]=(S.bag[d.k]||0)+d.q;cm+=(DROP_MER[d.k]||0)*d.q;c++;}S.drops[p]=[];}
 if(!c)return{t:'col',n:0};if(cm>0)S.merit=(S.merit||0)+cm;save();try{drawDrops();}catch(e){}
 return{t:'col',n:c,got:Object.entries(got).map(([k,q])=>[PN[k]||k,q]),merit:cm};};
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
