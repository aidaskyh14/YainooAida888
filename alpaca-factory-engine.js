/* fix21 🏭 โรงงานแปรรูปอัลปาก้า — คิดบนเซิร์ฟเวอร์ (สั่งงาน / รับของ) · ไฟล์นี้อยู่ฝั่งเซิร์ฟเวอร์เท่านั้น (โอกาสผีสิงไม่ส่งไปหน้าเว็บ)
   ของในเกม: คีย์แคตตาล็อก → ที่เก็บจริง (bag.* / sub.*) · คีย์ที่ไม่อยู่ในแคตตาล็อก (ของที่แปรรูปได้) = sub.alpaca.bag.<คีย์>
   'wine' = ไวน์ทุกชนิดรวมกัน (หักกองใหญ่ก่อน) · 'anyflower' = ดอกไม้กองที่มากที่สุดกองเดียว — เหมือนหน้าโรงงานเดิมทุกอย่าง */
import {CATALOG} from './catalog.js?h=17d0dd51';
import {ALPACA_MB} from './alpaca-menu.js?h=4c9e1f4e';
export const GHOST_ODDS={old:.5,hw:.5},JOBS_MAX=100,ORDER_MAX=10,HOUR=3600e3,GEAR_KEY='boost-gear',GEAR_CUT=.7,CLAIM_BONUS=1.2;
const fail=m=>{throw Object.assign(new Error(m),{code:'failed-precondition'});};
const num=v=>{const n=Number(v);return Number.isSafeInteger(n)&&n>0?n:0;};
const CP=new Map(CATALOG.map(c=>[c.k,c.p]));
export const pathOf=k=>{const p=CP.get(k);if(!p)return ['sub','alpaca','bag',k];return (/^(sub|pend)\./.test(p)?p:'bag.'+p).split('.');};
const getQ=(g,k)=>{let o=g;for(const x of pathOf(k)){if(!o||typeof o!=='object')return 0;o=o[x];}return num(o);};
const setQ=(g,k,v)=>{const ps=pathOf(k);let o=g;for(const x of ps.slice(0,-1)){if(!o[x]||typeof o[x]!=='object')o[x]={};o=o[x];}o[ps.at(-1)]=Math.max(0,v);};
const WINES=CATALOG.filter(c=>c.p.startsWith('wine.')).map(c=>c.k),FLOWERS=CATALOG.filter(c=>c.p.startsWith('flower.')).map(c=>c.k);
function stacks(g,k){const ks=k==='wine'?['wine',...WINES]:k==='anyflower'?FLOWERS:null;return ks&&ks.map(x=>[x,getQ(g,x)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]||(a[0]<b[0]?-1:1));}
export function have(g,k){const st=stacks(g,k);if(!st)return getQ(g,k);return k==='wine'?st.reduce((t,x)=>t+x[1],0):(st[0]?st[0][1]:0);}
function take(g,k,n){if(have(g,k)<n)fail('วัตถุดิบไม่พอ');const st=stacks(g,k);if(!st){setQ(g,k,getQ(g,k)-n);return;}
  if(k==='anyflower'){setQ(g,st[0][0],st[0][1]-n);return;}let left=n;for(const [x,c] of st){if(!left)break;const d=Math.min(c,left);setQ(g,x,c-d);left-=d;}}
const alp=g=>{const a=g.sub?.alpaca;if(!a||typeof a!=='object')fail('ยังไม่ได้เปิดฟาร์มอัลปาก้า');a.jobs=Array.isArray(a.jobs)?a.jobs.filter(j=>j&&typeof j==='object'):[];return a;};
const menu=id=>typeof id==='string'&&Object.hasOwn(ALPACA_MB,id)&&Number.isSafeInteger(ALPACA_MB[id].merit)?ALPACA_MB[id]:null;
/* งานที่เซิร์ฟเวอร์สร้าง: ทะเบียนจริงอยู่ใน x17.af (ผู้เล่นแก้ไม่ได้) = [{s:รหัส, id:เมนู, m:เครื่อง, st, e}] · งานในเซฟต้องมี sk ตรงกับทะเบียน
   งานเก่าก่อน fix21 (ไม่มี sk): รายการแรกบนเซิร์ฟเวอร์รับเข้าทะเบียนครั้งเดียว (x17.afm) → ลุ้นผีสิงเหมือนงานใหม่ · หลังจากนั้นงานไม่มี sk = ปลอม ไม่นับ
   เวลาเสร็จของงานจากทะเบียนใช้เวลาเซิร์ฟเวอร์เท่านั้น */
const reg=x17=>{if(!x17||typeof x17!=='object')fail('ระบบยังไม่พร้อม');x17.af=Array.isArray(x17.af)?x17.af.filter(r=>r&&typeof r.s==='string'&&menu(r.id)&&Number.isFinite(r.e)):[];return x17.af;};
const freeAt=(a,af,m,now)=>Math.max(now,...af.filter(r=>r.m===m).map(r=>r.e));
/* รับงานเก่าเข้าทะเบียนครั้งเดียว (เมนูเดิมเท่านั้น · เวลาไม่เกินเวลาจริงของเมนู · งานที่หน้าเว็บบอกว่าเสร็จแล้ว = เสร็จ) */
function adopt(a,x17,now,rng){if(x17.afm)return;x17.afm=1;const af=x17.af;let i=0;
  for(const j of a.jobs){if(j.sk)continue;const x=menu(j.id);if(!x||x.hw||af.length>=JOBS_MAX)continue;const m=[0,1,2,3].includes(j.m)?j.m:(x.side==='wool'?0:2),st=Math.min(Number(j.start)||now,now),cap=now+Math.round(x.h*HOUR),e=j.dn?Math.min(Number(j.end)||now,now):Math.min(Math.max(Number(j.end)||now,st),cap);
   const s='old'+now.toString(36)+Math.floor(rng()*1e9).toString(36)+'-'+(i++);af.push({s,id:x.id,m,st,e});j.sk=s;}}
/* สั่งงาน: หักวัตถุดิบ (+เฟือง) ทันที · ลงเครื่องที่ว่างก่อน (ขน 0–1 / เนื้อ 2–3) */
export function factoryOrder(game,x17,input,now,rng){const x=menu(input?.id),q=input?.q;if(!x)fail('ไม่พบเมนูนี้');
  if(!Number.isSafeInteger(q)||q<1||q>ORDER_MAX)fail('จำนวนไม่ถูกต้อง (1–'+ORDER_MAX+')');const a=alp(game),af=reg(x17);
  adopt(a,x17,now,rng);syncJobs(a,af);if(a.jobs.length+q>JOBS_MAX)fail('งานเต็ม '+JOBS_MAX+' แล้ว กดรับก่อนนะ');
  if(Object.entries(x.need).some(([k,n])=>have(game,k)<n*q))fail('วัตถุดิบไม่พอ');
  const g=input.gear===true?q:0;if(g&&getQ(game,GEAR_KEY)<g)fail('⚙️ เฟืองมีไม่พอ ลดจำนวนงานหรือปิดเฟือง');
  for(const [k,n] of Object.entries(x.need))take(game,k,n*q);if(g)setQ(game,GEAR_KEY,getQ(game,GEAR_KEY)-g);
  const ms=x.side==='wool'?[0,1]:[2,3];
  for(let i=0;i<q;i++){const m=freeAt(a,af,ms[0],now)<=freeAt(a,af,ms[1],now)?ms[0]:ms[1],st=freeAt(a,af,m,now),e=st+Math.round(x.h*HOUR*(g?GEAR_CUT:1)),s=(()=>{let k;do{k=now.toString(36)+Math.floor(rng()*1e9).toString(36)+'-'+(af.length+i)+Math.floor(Math.random()*1e6).toString(36);}while(af.some(r=>r.s===k));return k;})();
    af.push({s,id:x.id,m,st,e});a.jobs.push({id:x.id,m,start:st,end:e,sk:s,...(g?{gear:1}:{})});}
  return {id:x.id,q,gear:g};}
/* งานในเซฟให้ตรงทะเบียน: งานที่มี sk แต่ไม่อยู่ในทะเบียน = ทิ้ง (ปลอม/ซ้ำ) · งานในทะเบียนที่หายจากเซฟ = ใส่คืน · เวลาตามทะเบียน */
function syncJobs(a,af){const seen=new Set(),out=[];for(const j of a.jobs){if(!j.sk)continue;const r=af.find(r=>r.s===j.sk);if(!r||seen.has(r.s))continue;seen.add(r.s);out.push({...j,id:r.id,m:r.m,start:r.st,end:r.e,dn:undefined});}
  for(const r of af)if(!seen.has(r.s))out.push({id:r.id,m:r.m,start:r.st,end:r.e,sk:r.s});a.jobs=out.map(j=>{const {dn,...k}=j;return j.sk?k:j;});}
/* 🔋 แบตเตอรี่: งานที่ใกล้เสร็จที่สุดเสร็จทันที · งานที่รอคิวต่อในเครื่องเดียวกันเลื่อนขึ้น */
export function factoryBattery(game,x17,now,rng=Math.random){const a=alp(game),af=reg(x17);adopt(a,x17,now,rng);syncJobs(a,af);if(getQ(game,'battery')<1)fail('ไม่มีแบตเตอรี่');
  const run=af.filter(r=>r.e>now).sort((x,y)=>x.e-y.e)[0];if(!run)fail('ไม่มีงานที่กำลังทำ');const cut=run.e-now;
  for(const r of af)if(r!==run&&r.m===run.m&&r.st>=run.st){r.st-=cut;r.e-=cut;}run.e=now;setQ(game,'battery',getQ(game,'battery')-1);syncJobs(a,af);return {id:run.id};}
/* รับของ: งานที่เสร็จ → ของ + กุศล (×1.2 เหมือนเดิม) · งานจากทะเบียนบางชิ้นผีสิง (ไม่ได้ของ/กุศล · ได้ของผีสิงที่ต้องส่งต่อ) */
export function factoryClaim(game,x17,now,rng){const a=alp(game),af=reg(x17);adopt(a,x17,now,rng);syncJobs(a,af);
  const done=a.jobs.filter(j=>af.find(r=>r.s===j.sk)?.e<=now);if(!done.length)fail('ยังไม่มีงานที่เสร็จ');
  const got={},ghosts=[];let merit=0;
  for(const j of done){const x=menu(j.id);if(!x)continue;
    if(rng()<(x.hw?GHOST_ODDS.hw:GHOST_ODDS.old)){ghosts.push({g:x.id,amt:x.merit*2});continue;}
    setQ(game,x.id,getQ(game,x.id)+1);got[x.id]=(got[x.id]||0)+1;merit+=Math.round(x.merit*CLAIM_BONUS);}
  const ds=new Set(done.map(j=>j.sk).filter(Boolean));x17.af=af.filter(r=>!ds.has(r.s));a.jobs=a.jobs.filter(j=>!done.includes(j));game.merit=(Number(game.merit)||0)+merit;
  return {got,merit,ghosts,n:done.length};}
