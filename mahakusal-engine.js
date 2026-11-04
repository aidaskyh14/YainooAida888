/* fix17 📦 กล่องสุ่มมหากุศล — กติกาล้วน (คลาวด์เท่านั้น) · กลไกซ่อนทั้งหมดอยู่ที่นี่ ไม่ส่งให้หน้าเว็บ
   สุ่มขนาด → ยอดลุ้น + รหัส 4 หลัก (เก็บบนเซิร์ฟเวอร์) → ทาย 3 ครั้ง (ถูก 100% / 80% / 60% · ผิดหมดได้ปลอบใจ)
   ทุกครั้งที่ผิดบอก ⬆️⬇️✅ รายหลัก · คำใบ้โบนัสซ่อน · 10 กล่องแรกของวันถูกแน่ 2–3 กล่อง (ซ่อน)
   เปิดด่วนทีละ ≥500 · วันละไม่เกิน 30,000 กล่อง (ทายเอง+เปิดด่วน) · เกิน 10,000 ต่อวันได้ครึ่ง (ซ่อน) · รีเซ็ตเที่ยงคืนไทย
   คราฟ: กล่องสุ่ม 8 ชนิด อย่างละ 3 → 1–4 กล่อง (40/30/20/10%) */
import {BOXES,getBoxCount} from './loot-box-catalog.js?h=5f019114';
export const MK_TIERS=[{k:'s',w:50,min:1,max:9999,miss:900,fast:450},{k:'m',w:35,min:10000,max:59999,miss:3000,fast:1500},{k:'l',w:15,min:60000,max:100000,miss:7000,fast:3500}];
/* S4 ข้อ 21: ตัดระบบทายรหัส → เปิดปกติ (fast) ตั้งแต่ 1 กล่อง · จำนวนที่เลือกได้ 1/10/100/500/1000/ทั้งหมด */export const MK_PAY=[1,.8,.6],MK_FAST_MIN=1,MK_FAST_Q=[1,10,100,500,1000,1500,2000],MK_DAY_MAX=30000,MK_HALF_AFTER=10000,MK_LUCKY_FIRST=10;
export const MK_HINT=[.4,.2],MK_CRAFT_W=[[1,40],[2,30],[3,20],[4,10]],MK_CRAFT_EACH=3,MK_CRAFT_MAX=1000;
export const MK_FISH_DROP=.004;/* ตกปลาได้ (ต่อครั้งที่ได้ปลา) — ซ่อน อยู่ฝั่งคลาวด์เท่านั้น */
export const MK_BOXES=['dog','cat','hamster','alpaca','ostrich','dodo','plant','fruit'];
const thaiDay=now=>new Date(now+7*3600000).toISOString().slice(0,10);
const num=n=>Number.isSafeInteger(n)&&n>0?n:0;
const fail=m=>{throw Object.assign(new Error(m),{code:'failed-precondition'});};
export const mkHave=game=>num(game?.bag?.box?.mahakusal);
function mkAdd(game,n){game.bag ||= {};game.bag.box ||= {};game.bag.box.mahakusal=Math.max(0,mkHave(game)+n);}
/* สถานะรายวันใน x17.mk = {d,n(เปิดวันนี้),g(ลำดับกล่องวันนี้),lk:{ลำดับ:ครั้งที่ถูก},cur?,pl(กล่องใหญ่ที่เก็บไว้ทาย)} */
export function mkState(x17,now,rng){const s=x17.mk&&typeof x17.mk==='object'?x17.mk:(x17.mk={});const day=thaiDay(now);
  if(s.d!==day){s.d=day;s.n=0;s.g=0;const idx=[...Array(MK_LUCKY_FIRST).keys()];for(let i=idx.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
    const k=2+(rng()<.5?1:0);s.lk={};for(const i of idx.slice(0,k)){const r=rng();s.lk[i+1]=r<.4?1:r<.75?2:3;}}
  s.n=num(s.n);s.g=num(s.g);s.pl=num(s.pl);s.lk ||= {};return s;}
export const mkLeft=s=>Math.max(0,MK_DAY_MAX-s.n);
function rollTier(rng){let r=rng()*100;for(const t of MK_TIERS){if((r-=t.w)<0)return t;}return MK_TIERS[0];}
const ri=(rng,a,b)=>a+Math.floor(rng()*(b-a+1));
/* fix18 (ซ่อน): โอกาสถูกลับตามชั่วโมงไทย เฉพาะกล่องที่ทายรหัสเอง (เปิดด่วนไม่ได้)
   ชั่วโมงทอง 12–13 · 20–22 = 30% · ปกติ 10% · ชั่วโมงอับ 03–06 = 0% (ไม่มีคำใบ้โบนัส ไม่ใช้สิทธิ์การันตี 10 กล่องแรก) */
export const MK_HOUR_GOLD=[12,20,21],MK_HOUR_DEAD=[3,4,5],MK_HOUR_LUCK={gold:.3,norm:.1,dead:0};
export const mkHourKind=now=>{const h=new Date(now+7*3600000).getUTCHours();return MK_HOUR_DEAD.includes(h)?'dead':MK_HOUR_GOLD.includes(h)?'gold':'norm';};
function newBox(s,rng,tier,now,guess){const t=tier||rollTier(rng),hk=guess&&Number.isFinite(now)?mkHourKind(now):'norm';
  if(hk==='dead')return {t:t.k,val:ri(rng,t.min,t.max),code:[0,1,2,3].map(()=>ri(rng,0,9)),tries:0,hist:[],lucky:0,hp:0};
  s.g++;let lucky=s.g<=MK_LUCKY_FIRST?num(s.lk[s.g]):0;
  if(!lucky&&guess&&rng()<MK_HOUR_LUCK[hk])lucky=1+Math.floor(rng()*3);
  return {t:t.k,val:ri(rng,t.min,t.max),code:[0,1,2,3].map(()=>ri(rng,0,9)),tries:0,hist:[],lucky,hp:s.g<=MK_LUCKY_FIRST?MK_HINT[0]:MK_HINT[1]};}
const T=k=>MK_TIERS.find(t=>t.k===k);
/* หน้าเว็บเห็นแค่: ขนาด · ยอดลุ้น · จำนวนครั้ง · ประวัติ (ไม่มีรหัส/โอกาส/การันตี) */
export const mkPublic=b=>b?{t:b.t,val:b.val,tries:b.tries,hist:b.hist}:null;
export function mkView(game,x17,now,rng){const s=mkState(x17,now,rng);return {have:mkHave(game),left:mkLeft(s),kept:s.pl,cur:mkPublic(s.cur)};}
const floorAdd=(m0,d)=>(Number(m0)||0)+d;// มหากุศลมีแต่ได้ ไม่มีหัก
export function mahakusalAction(game,x17,input,now,rng){
  const s=mkState(x17,now,rng),type=input?.type,out={};
  if(type==='status')return {view:mkView(game,x17,now,rng)};
  if(type==='open'){/* เปิดลุ้นรหัส 1 กล่อง (มีกล่องค้างอยู่ = เล่นกล่องเดิมต่อ) */
    if(s.cur)return {box:mkPublic(s.cur),resume:true,view:mkView(game,x17,now,rng)};
    if(input.kept){if(!s.pl)fail('ไม่มีกล่องใหญ่ที่เก็บไว้');s.pl--;s.cur=newBox(s,rng,T('l'),now,true);}
    else{if(mkHave(game)<1)fail('ไม่มีกล่องมหากุศล');if(!mkLeft(s))fail('🌙 วันนี้เปิดครบแล้ว กลับมาเปิดต่อได้หลังเที่ยงคืน');mkAdd(game,-1);s.n++;s.cur=newBox(s,rng,null,now,true);}
    return {box:mkPublic(s.cur),view:mkView(game,x17,now,rng)};}
  if(type==='guess'){const b=s.cur;if(!b)fail('ยังไม่ได้เปิดกล่อง');const g=input.code;
    if(!Array.isArray(g)||g.length!==4||g.some(d=>!Number.isInteger(d)||d<0||d>9))fail('ใส่รหัสให้ครบ 4 หลัก');
    b.tries++;const ok=g.join('')===b.code.join('')||(b.lucky&&b.tries>=b.lucky);
    if(ok){const pay=Math.round(b.val*MK_PAY[b.tries-1]);game.merit=floorAdd(game.merit,pay);const code=b.lucky&&g.join('')!==b.code.join('')?g.slice():b.code;s.cur=null;
      return {result:{win:true,tries:b.tries,pay,code,t:b.t},view:mkView(game,x17,now,rng)};}
    const row={g:g.slice()};
    if(b.tries>=3){const pay=T(b.t).miss;game.merit=floorAdd(game.merit,pay);s.cur=null;return {result:{win:false,pay,code:b.code,t:b.t,last:row},view:mkView(game,x17,now,rng)};}
    row.a=g.map((d,k)=>d===b.code[k]?0:d<b.code[k]?1:-1);// 1 = ตัวจริงมากกว่า · −1 = น้อยกว่า · 0 = ถูก
    if(rng()<b.hp){const k=ri(rng,0,3);row.b=rng()<.5?{pos:k,d:b.code[k]}:{has:b.code[k]};}
    b.hist.push(row);return {box:mkPublic(b),view:mkView(game,x17,now,rng)};}
  if(type==='fast'){const have=mkHave(game),left=mkLeft(s);let n=input.n==='max'?Math.min(have,left):Number(input.n);
    if(input.n!=='max'&&!MK_FAST_Q.includes(n))fail('เลือกจำนวนกล่อง');if(have<MK_FAST_MIN)fail('ยังไม่มีกล่อง');
    if(!left)fail('🌙 วันนี้เปิดครบแล้ว กลับมาเปิดต่อได้หลังเที่ยงคืน');n=Math.min(n,have,left);if(n<1)fail('กล่องไม่พอ');
    const cnt={s:0,m:0,l:0};let total=0,kept=0,lucky=0;
    for(let i=0;i<n;i++){const b=newBox(s,rng);if(input.keep===true&&b.t==='l'){s.pl++;kept++;continue;}cnt[b.t]++;
      if(b.lucky){total+=Math.round(b.val*MK_PAY[b.lucky-1]);lucky++;}else total+=T(b.t).fast*(s.n+i<MK_HALF_AFTER?1:.5);}
    total=Math.round(total);mkAdd(game,-n);s.n+=n;game.merit=floorAdd(game.merit,total);
    return {fast:{n,cnt,kept,total},view:mkView(game,x17,now,rng)};/* ไม่บอกว่ากล่องไหนการันตี */}
  if(type==='craft'){const q=Number(input.quantity);if(!Number.isSafeInteger(q)||q<1||q>MK_CRAFT_MAX)fail('จำนวนไม่ถูกต้อง');
    const boxes=MK_BOXES.map(id=>BOXES.find(b=>b.id===id));const lack=boxes.filter(b=>getBoxCount(game,b)<MK_CRAFT_EACH*q);if(lack.length)fail('กล่องสุ่มไม่พอ');
    for(const b of boxes){const path=b.path.split('.'),last=path.pop();let o=game;for(const k of path){o[k] ||= {};o=o[k];}o[last]=getBoxCount(game,b)-MK_CRAFT_EACH*q;}
    let got=0;const rolls=[];for(let i=0;i<q;i++){let r=rng()*100,n=1;for(const [k,w] of MK_CRAFT_W){if((r-=w)<0){n=k;break;}}got+=n;if(i<4)rolls.push(n);}
    mkAdd(game,got);return {craft:{q,got,rolls,consumed:boxes.map(b=>({box:b.id,quantity:MK_CRAFT_EACH*q}))},view:mkView(game,x17,now,rng)};}
  fail('รายการไม่ถูกต้อง');
}
export const mkBoxCounts=game=>Object.fromEntries(MK_BOXES.map(id=>[id,getBoxCount(game,BOXES.find(b=>b.id===id))]));
