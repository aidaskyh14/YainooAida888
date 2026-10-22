/* fix17 ⛈️ ฝนกุศล (หน้าเรือ) — ฟังก์ชันล้วน ใช้ร่วมกันทั้งหน้าเว็บและเซิร์ฟเวอร์
   · rainLogic(seed): รายการฟอง (id, ชนิด, เวลาเกิด, อายุ, ค่า) — ไม่ใช้ตรีโกณมิติ ทุกเครื่องได้ผลเท่ากันทุกบิต
   · rainGeom(seed,list,laneX): ตำแหน่งบนจอ (หน้าเว็บเท่านั้น · เซิร์ฟเวอร์ไม่ใช้ตำแหน่ง)
   · rainScore(list,taps,miss,lvl,goldsMine): เซิร์ฟเวอร์คิดคะแนนจากลำดับการกดจริง (ฟองละครั้ง · เวลาต้องอยู่ในช่วงที่ฟองลอยอยู่)
   กติกา: ฟองบวก 3,000–10,000 ×ระดับ · ฟองลบ 1,000–5,000 ×ระดับ · ⚓ สมอ = เรือทีมตัวเอง −2 · 👑 ทอง 100,000 ×ระดับ (คนแรกคนเดียว)
          คอมโบ 5/10/20 = ×1.5/×2/×3 · จิ้มน้ำเปล่า 2 ครั้งแรกฟรี ต่อไป −1,000 ×ระดับ · กดเกิน 10 ครั้ง/วินาที = นับเป็นพลาด
          15 วินาทีสุดท้าย = พายุ ค่าฟอง ×2 (รวมในค่าฟองแล้ว) */
export const RAIN_MS=60000,RAIN_WARN=15000,RAIN_STORM=15000,RAIN_GOLD=100000,RAIN_GOLD_LIFE=1000,RAIN_LEVELS=[1,2,5];
export const RAIN_SETTLE=120000,RAIN_LATE=10*60000,RAIN_TEAM_MIN=3,RAIN_TEAM_POS=3,RAIN_TEAM_BACK=10,RAIN_ANCHOR_BACK=2;
export const RAIN_MAX_TAPS=1500,RAIN_FREE_MISS=2,RAIN_MISS=1000,RAIN_RATE=10,RAIN_EARLY=60,RAIN_LAG=300;
export const RAIN_TYPES={small:{r:38,c:[3000,5000]},big:{r:54,c:[6000,9000]},rainbow:{r:46,c:[10000,10000]},neg:{r:[38,54],c:[1000,5000]},anchor:{r:44,c:[0,0]},gold:{r:54,c:[RAIN_GOLD,RAIN_GOLD]}};
export const RAIN_PLUS=new Set(['small','big','rainbow']);
/* mulberry32 — จำนวนเต็ม 32 บิตล้วน ผลตรงกันทุกเครื่อง */
export function rainRng(seed){let a=seed|0;return ()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function pickType(rng,storm){const w=storm?[['small',30],['big',13],['rainbow',6],['neg',43],['anchor',8]]:[['small',38],['big',16],['rainbow',4],['neg',36],['anchor',6]];let s=0;for(const x of w)s+=x[1];let r=rng()*s;for(const[k,v]of w){if((r-=v)<0)return k;}return 'small';}
export function rainLogic(seed){
  const rng=rainRng(seed),list=[];let id=0,t=600,nextBurst=8000+Math.floor(rng()*4000),cluster=0;
  while(t<RAIN_MS-900){
    const storm=t>=RAIN_MS-RAIN_STORM,burst=t>=nextBurst;if(burst)nextBurst=t+9000+Math.floor(rng()*4000);
    const n=burst?10+Math.floor(rng()*3):storm?6+Math.floor(rng()*3):4+Math.floor(rng()*3);
    for(let k=0;k<n;k++){
      const type=burst&&k%2?'neg':pickType(rng,storm||burst),T=RAIN_TYPES[type];
      let v=Math.round((T.c[0]+rng()*(T.c[1]-T.c[0]))/100)*100;if(storm)v*=2;
      list.push({id:id++,type,t0:t+k*(burst?25:45),life:storm?1500:burst?1700:1900,v,c:cluster,k,burst:burst?1:0});
    }
    cluster++;t+=storm?480:820+Math.floor(rng()*220);
  }
  const ng=6+Math.floor(rng()*3),slot=Math.floor((RAIN_MS-6000)/ng);
  for(let i=0;i<ng;i++){const gt=3000+i*slot+Math.floor(rng()*(slot-RAIN_GOLD_LIFE-300));list.push({id:id++,type:'gold',t0:gt,life:RAIN_GOLD_LIFE,v:RAIN_GOLD,c:-1,k:i,burst:0});}
  list.sort((a,b)=>a.t0-b.t0||a.id-b.id);return list;
}
/* ตำแหน่ง (หน้าเว็บ): สุ่มจากสายแยก ไม่กระทบรายการฟอง · วางเป็นกระจุกแน่น ๆ ให้นิ้วอ้วนพลาดโดนฟองลบได้ */
export function rainGeom(seed,list,laneX){
  const rng=rainRng((seed^0x5bd1e995)|0),centers=new Map(),placed=new Map();
  for(const b of list){
    const T=RAIN_TYPES[b.type],r=Array.isArray(T.r)?T.r[0]+rng()*(T.r[1]-T.r[0]):T.r;b.r=r;b.ph=rng()*6.283;b.vy=115+rng()*45;
    if(b.type==='gold'){const gy=620+rng()*700;b.x=laneX(1+rng()*4,gy);b.y=gy;b.vy=20;b.ph=0;continue;}
    let c=centers.get(b.c);if(!c){const cy=560+rng()*820,xl=laneX(.5,cy)+80,xr=laneX(5.5,cy)-80;c={x:xl+rng()*(xr-xl),y:cy};centers.set(b.c,c);placed.set(b.c,[]);}
    const group=placed.get(b.c);let x=c.x,y=c.y;
    if(group.length){let ok=false;for(let tries=0;tries<40&&!ok;tries++){const o=group[Math.floor(rng()*group.length)],a=rng()*6.283,d=o.r+r+1+rng()*5;x=o.x+Math.cos(a)*d;y=o.y+Math.sin(a)*d*.9;
      ok=x>laneX(.5,y)+40&&x<laneX(5.5,y)-40&&group.every(q=>Math.hypot(q.x-x,q.y-y)>=q.r+r);}
      if(!ok){const o=group[group.length-1];x=o.x+(rng()<.5?-1:1)*(o.r+r+2);y=o.y+(rng()-.5)*r;}}
    b.x=x;b.y=y;group.push(b);
  }
  return list;
}
/* คะแนนจากเหตุการณ์ทั้งหมดเรียงตามเวลา (มิลลิวินาทีนับจากฝนเริ่ม)
   taps=[[id,t],...] กดโดนฟอง · miss=[t,...] จิ้มน้ำเปล่า · goldsMine = ฟองทองที่เซิร์ฟเวอร์บันทึกว่าเราได้ */
export function rainScore(list,taps,miss,lvl,goldsMine=[]){
  const m=RAIN_LEVELS.includes(lvl)?lvl:1,byId=new Map(list.map(b=>[b.id,b])),mine=new Set((goldsMine||[]).map(Number));
  const ev=[];
  for(const x of Array.isArray(taps)?taps.slice(0,RAIN_MAX_TAPS):[]){if(!Array.isArray(x))continue;const id=Number(x[0]),t=Number(x[1]);if(Number.isSafeInteger(id)&&Number.isFinite(t))ev.push({t,id});}
  for(const x of Array.isArray(miss)?miss.slice(0,RAIN_MAX_TAPS):[]){const t=Number(Array.isArray(x)?x[0]:x);if(Number.isFinite(t))ev.push({t,id:null});}
  ev.sort((a,b)=>a.t-b.t||(a.id===null)-(b.id===null));
  const s={plus:0,minus:0,pos:0,anc:0,popped:0,misses:0,missPen:0,combo:0,best:0,gold:0,goldV:0},used=new Set(),win=[];
  const missOne=fast=>{s.misses++;if(fast||s.misses>RAIN_FREE_MISS){const p=RAIN_MISS*m;s.minus+=p;s.missPen+=p;}s.combo=0;};
  for(const e of ev){
    if(e.t<-1000||e.t>RAIN_MS+3000)continue;
    while(win.length&&e.t-win[0]>=1000)win.shift();win.push(e.t);
    if(win.length>RAIN_RATE){missOne(true);continue;}
    if(e.id===null){missOne(false);continue;}
    const b=byId.get(e.id);
    if(!b||used.has(e.id)||e.t<b.t0-RAIN_EARLY||e.t>b.t0+b.life+RAIN_LAG){missOne(false);continue;}
    if(b.type==='gold'){if(mine.has(b.id)){used.add(b.id);const v=b.v*m;s.plus+=v;s.pos++;s.gold++;s.goldV+=v;s.popped++;}continue;}
    used.add(b.id);s.popped++;
    if(b.type==='neg'){s.minus+=b.v*m;s.combo=0;continue;}
    if(b.type==='anchor'){s.anc++;s.combo=0;continue;}
    s.combo++;s.best=Math.max(s.best,s.combo);const mult=s.combo>=20?3:s.combo>=10?2:s.combo>=5?1.5:1;
    s.plus+=Math.round(b.v*m*mult);s.pos++;
  }
  /* ทองที่ได้แต่หน้าเว็บส่งรายการไม่ทัน (เช่น ปิดจอกลางฝน) ยังได้เต็ม */
  for(const id of mine)if(!used.has(id)){const b=byId.get(id);if(b&&b.type==='gold'){const v=b.v*m;s.plus+=v;s.pos++;s.gold++;s.goldV+=v;}}
  s.net=s.plus-s.minus;return s;
}
export const rainGoldOpen=(b,elapsed)=>b&&b.type==='gold'&&elapsed>=b.t0&&elapsed<=b.t0+b.life+2500;/* เปิดให้คว้าตอนฟองโผล่ (ไม่ก่อน) */
export const RAIN_GOLD_MAX=3,RAIN_PLUS_CAP=3000000;/* กันสคริปต์: ทองต่อคนต่อฝน · ยอดฟองบวก (ไม่รวมทอง) ต่อระดับ */
