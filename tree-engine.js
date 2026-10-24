/* fix19 🌳👻 ศึกต้นไม้ผี (เนเบอร์ฮูดแข่งกัน) — กติกาล้วน ใช้ร่วมกันทั้งเซิร์ฟเวอร์และหน้าเว็บ
   · วันละ 2 รอบ (เวลาไทย): 01:00–12:00 และ 13:00–24:00 · จบรอบ +5 นาทีเปิดการ์ด เลือกภายใน 10 นาที · ที่เหลือเป็นพักเบรก
   · แต้มจากกิจกรรม 1–10 แต้มต่อครั้ง (ไม่จำกัดต่อคน) · ต้นไม้ 12 ขั้นตามแต้มสูงสุดของบ้านในรอบ (โดนขวานต้นไม่หด)
   · บ้านชนะ: ทุกคนเลือกแผ่นป้ายกุศลคว่ำ 1 ใบ · สุ่ม 1 คนเปิดการ์ดแกล้ง 1 ใบ (ปล้นเสบียง/ตัดบ้าน/ตัดทุกบ้าน/ตัด 4 คน) */
import {FISH} from './fishing-catalog.js';
import {FOOD_RECIPES} from './food-craft-engine.js';
export const TW_TH=[0,150,400,750,1200,1800,2600,3600,4800,6200,7800,9600];
export const TW_TREES=7,TW_PICK_OPEN=5*60000,TW_PICK_TIME=10*60000;
export const TW_MERIT=[5e6,5e6,10e6,10e6,30e6,50e6];
export const TW_PRANKS=['rob','cut1','cutAll','cut4'],TW_CUT={cut1:10e6,cutAll:3e6,cut4:15e6},TW_ROB=[1000,5000],TW_ROB_HOUSES=3,TW_CUT4=4;
export const TW_SURPRISE=['supply','shield','merit'],TW_SURPRISE_MERIT=15e6,TW_SHIELD_DROP=2e6;
export const TW_SUPPLY=[['box','กล่องสุ่ม',500],['item.pestle','สากกะเบือ',1000],['item.angel','ปีกนางฟ้า',999],['item.coconut','มะพร้าว',999],['item.cake','เค้ก',999],['wine','ไวน์',100],['halloween.cauldron','หม้อยาแม่มด',30],['item.hat','หมวกกะลาสี',999],['item.musicbox','กล่องดนตรี',999],['coins','เหรียญฮาโลวีน',199]];
export const TW_AXES={w:5,s:10,g:20},TW_CATS=['veg','fish','pet','honey','cook'];
/* ---------- เวลา ---------- */
const H=3600000,thai=now=>now+7*H;
export const twDayKey=now=>new Date(thai(now)).toISOString().slice(0,10);
/* รอบที่กำลังแข่ง ณ เวลานี้ (null = พักเบรก) */
export function twRoundAt(now){const t=thai(now),d0=Math.floor(t/864e5)*864e5,h=(t-d0)/H,day=new Date(d0).toISOString().slice(0,10);
 if(h>=1&&h<12)return {id:day+'A',start:d0+H-7*H,end:d0+12*H-7*H};
 if(h>=13)return {id:day+'B',start:d0+13*H-7*H,end:d0+24*H-7*H};return null;}
/* รอบถัดไปที่จะเริ่ม (ใช้ตอนแอดมินกด "เริ่มรอบถัดไป") */
export function twNextRound(now){const t=thai(now),d0=Math.floor(t/864e5)*864e5,h=(t-d0)/H,day=x=>new Date(x).toISOString().slice(0,10);
 if(h<1)return {id:day(d0)+'A',start:d0+H-7*H,end:d0+12*H-7*H};if(h<13)return {id:day(d0)+'B',start:d0+13*H-7*H,end:d0+24*H-7*H};
 return {id:day(d0+864e5)+'A',start:d0+864e5+H-7*H,end:d0+864e5+12*H-7*H};}
export const twStage=(peak,th=TW_TH)=>{let s=0;for(let i=0;i<th.length;i++)if(peak>=th[i])s=i;return s;};
/* ---------- แต้มจากกิจกรรม ---------- */
export const TW_CROP={waterspinach:1,lettuce:1,pea:2,mango:2,carrot:2,chili:2,corn:2,potato:3,pumpkin:3,cucumber:3,tomato:3,cabbage:3,lychee:3,strawberry:4,watermelon:4,grape:5,banana:5,gooseberry:6,mushroom:6,melon:7,bamboo:8,plankton:10};
export const twBoosted=p=>Math.max(1,Math.round(p*.4));
const hash=s=>{let h=2166136261>>>0;for(const ch of String(s)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0;}return h;};
/* ผักเด่นประจำชั่วโมง (3 ชนิด สุ่มจากชั่วโมงไทย · ทุกเครื่องเห็นเหมือนกัน) ×1.5 ปัดลง ไม่เกิน 10 */
export function twFeatured(now){const hour=Math.floor(thai(now)/H),keys=Object.keys(TW_CROP);let h=hash('tw-feat|'+hour);const out=[];
 while(out.length<3){h=Math.imul(h^(h>>>13),0x5bd1e995)>>>0;const k=keys[h%keys.length];if(!out.includes(k))out.push(k);}return out;}
export function twCropPts(crop,boosted,now){const base=TW_CROP[crop]||0;if(!base)return 0;if(boosted)return twBoosted(base);return twFeatured(now).includes(crop)?Math.min(10,Math.floor(base*1.5)):base;}
const fishTier=k=>Number(FISH[k]?.[1])||0;
export const twFishPts=(k,bait)=>{const p=[0,2,4,7][fishTier(k)]||0;/* ระดับ 4 = ปลาบ่อ VIP ไม่นับ */return p&&bait?Math.max(1,Math.floor(p/2)):p;};
/* โอกาสสำเร็จของเมนู (ยิ่งยากยิ่งได้มาก) */
export const twCookPts=chance=>chance>=70?1:chance>=50?2:chance>=35?4:chance>=25?6:10;
const CHANCE=Object.fromEntries(Object.values(FOOD_RECIPES).map(r=>[r.output,r.classy?0:Number(r.chance)||50]));
export const twFoodPts=out=>twCookPts(CHANCE[out]??50);/* อาหารหรู (classy) = 10 */
const sumObj=o=>Object.values(o||{}).reduce((a,n)=>a+(Number.isFinite(Number(n))?Number(n):0),0);
/* แต้มของรายการนี้ (เซิร์ฟเวอร์เท่านั้นตัดสิน) · honeyMult(now) ส่งเข้ามาจากเซิร์ฟเวอร์ */
export function twDeltas(system,before,after,input={},response={},now=Date.now(),opt={}){
 const q={},add=(k,n)=>{if(n>0)q[k]=(q[k]||0)+n;};const type=input?.type;
 if(system==='farm'&&type==='harvest')for(const p of Array.isArray(response?.harvested)?response.harvested:[])add('veg',twCropPts(p?.c,!!p?.bz,now));
 if(system==='fishing'&&type==='collect'&&response?.pond&&!response.pond.vip)for(const f of response?.caught||[])add('fish',twFishPts(f?.k,!!response.pond.bait));
 if(system==='outings'&&type==='deliver'&&!before?.honey?.delivered&&after?.honey?.delivered){const m=opt.honeyMult?opt.honeyMult(now):1;add('honey',m>=2?6:m<1?1:3);}
 if(system==='craft')for(const g of ['food','gfood'])for(const [k,n]of Object.entries(after?.bag?.[g]||{})){const d=(Number(n)||0)-(Number(before?.bag?.[g]?.[k])||0);if(d>0)add('cook',d*twFoodPts(g+'.'+k));}
 /* สัตว์: นับจากตั๋วที่เซิร์ฟเวอร์ยอมรับจริง (ตั๋วละ 5,000 กุศล · วันละไม่เกิน 40 ตั๋ว) ไม่เชื่อยอดที่หน้าเว็บส่งมา */
 if(system==='demon'&&type==='petRoll'&&response?.pet?.tickets>0)add('pet',Math.min(10,Math.floor(response.pet.tickets*5000/2000)));
 if(system==='hwmini'){const g=(Number(after?.merit)||0)-(Number(before?.merit)||0);if(g>0)add('pet',Math.min(10,Math.floor(g/2000)));}
 return Object.keys(q).length?q:null;
}
/* ---------- บ้าน ---------- */
export const twHouseScore=h=>Math.max(0,Object.values(h?.pts||{}).reduce((a,c)=>a+sumObj(c),0)-(Number(h?.cut)||0));
export function twAddPts(house,uid,deltas,mul={},now){const h=house||{pts:{},cut:0,peak:0,at:0};h.pts ||= {};const me=h.pts[uid] ||= {};let added=0;
 for(const [k,n]of Object.entries(deltas)){const v=Math.max(0,Math.round(n*(Number.isFinite(mul?.[k])?mul[k]:1)));if(!v)continue;me[k]=(Number(me[k])||0)+v;added+=v;}
 const s=twHouseScore(h);if(s>(h.peak||0))h.peak=s;if(added)h.at=now;return {house:h,added};}
/* อันดับ: แต้มมากกว่าชนะ · เท่ากัน = บ้านที่ทำแต้มล่าสุดได้ก่อน (at น้อยกว่า) ชนะ */
export const twRank=list=>[...list].sort((a,b)=>b.score-a.score||(a.at||Infinity)-(b.at||Infinity)||String(a.nb).localeCompare(String(b.nb)));
/* ---------- สุ่ม ---------- */
export function twShuffle(arr,rng){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
/* ---------- ปล้นเสบียง (ทิ้งของ ไม่เข้าใคร) ---------- */
export const TW_ROB_PATHS=['bag.item.boxdog','bag.box.cat','bag.box.hamster','bag.box.plant','bag.box.fruit','bag.box.mahakusal','bag.birdbox.ostrich','bag.birdbox.dodo','sub.alpaca.bag.box',
 'bag.item.hat','sub.alpaca.bag.wool','bag.item.musicbox','bag.item.battery','bag.item.pestle','bag.item.cake','bag.item.coconut','bag.wine.moon','bag.wine.rose','bag.wine.blood','bag.wine.eclipse',
 'bag.rod.bamboo','bag.rod.moon','bag.rod.honey','bag.rod.sakura','bag.boost.bait','bag.fishing.crab'];
export const TW_ROB_NAME={'bag.item.boxdog':'กล่องสุ่มหมา','bag.box.cat':'กล่องสุ่มแมว','bag.box.hamster':'กล่องสุ่มแฮมสเตอร์','bag.box.plant':'กล่องสุ่มพืช','bag.box.fruit':'กล่องสุ่มผลไม้','bag.box.mahakusal':'กล่องสุ่มมหากุศล','bag.birdbox.ostrich':'กล่องสุ่มนกกระจอกเทศ','bag.birdbox.dodo':'กล่องสุ่มโดโด้','sub.alpaca.bag.box':'กล่องสุ่มอัลปาก้า',
 'bag.item.hat':'หมวกกะลาสี','sub.alpaca.bag.wool':'ขนอัลปาก้า','bag.item.musicbox':'กล่องดนตรี','bag.item.battery':'แบตเตอรี่โรงงาน','bag.item.pestle':'สากกะเบือ','bag.item.cake':'เค้ก','bag.item.coconut':'มะพร้าว','bag.wine.moon':'ไวน์จันทร์','bag.wine.rose':'ไวน์กุหลาบ','bag.wine.blood':'ไวน์เลือด','bag.wine.eclipse':'ไวน์สุริยคราส',
 'bag.rod.bamboo':'เบ็ดไผ่','bag.rod.moon':'เบ็ดจันทร์เสี้ยว','bag.rod.honey':'เบ็ดน้ำผึ้ง','bag.rod.sakura':'เบ็ดซากุระ','bag.boost.bait':'เหยื่อวิเศษ','bag.fishing.crab':'กรรไกรปู',coins:'เหรียญฮาโลวีน'};
const getP=(g,p)=>{const v=p.split('.').reduce((o,k)=>o?.[k],g);return Number.isSafeInteger(v)&&v>0?v:0;};
const setP=(g,p,n)=>{const ks=p.split('.'),last=ks.pop();let o=g;for(const k of ks){o[k] ||= {};o=o[k];}o[last]=n;};
/* เอาของออกรวมไม่เกิน need ชิ้น · แต่ละชนิดไม่เกินครึ่งหนึ่งของที่มี (ครั้งนี้) · coins = เหรียญฮาโลวีนบนบัญชี */
export function twRobTake(game,need,coins=0){const have=TW_ROB_PATHS.map(p=>[p,getP(game,p)]).filter(x=>x[1]>1);if(coins>1)have.push(['coins',coins]);
 const taken={};let left=Math.max(0,Math.floor(need));
 for(let pass=0;pass<200&&left>0;pass++){const open=have.filter(([p,n])=>Math.floor(n/2)-(taken[p]||0)>0);if(!open.length)break;const share=Math.max(1,Math.ceil(left/open.length));
  for(const [p,n]of open){if(left<=0)break;const t=Math.min(share,Math.floor(n/2)-(taken[p]||0),left);if(t>0){taken[p]=(taken[p]||0)+t;left-=t;}}}
 let coinsTaken=0;for(const [p,t]of Object.entries(taken)){if(p==='coins'){coinsTaken=t;continue;}setP(game,p,getP(game,p)-t);}
 return {taken,coinsTaken,left};}
/* การ์ดเติมเสบียง (สุ่ม 1 อย่าง) → ส่งเป็นจดหมาย (คีย์ของแคตตาล็อก) */
const SUP_KEYS={box:['box-dog','box-cat','box-hamster','box-alpaca','box-plant','box-fruit','bird-box-ostrich','bird-box-dodo'],wine:['wine-moon','wine-rose','wine-blood','wine-eclipse'],
 'item.pestle':'pestle','item.angel':'wings','item.coconut':'coconut','item.cake':'cake','halloween.cauldron':'halloween-cauldron','item.hat':'hat','item.musicbox':'musicbox'};
export function twSupply(rng){const [path,name,n]=TW_SUPPLY[Math.floor(rng()*TW_SUPPLY.length)];
 if(path==='coins')return {name,n,coins:n,items:{}};const k=SUP_KEYS[path];const key=Array.isArray(k)?k[Math.floor(rng()*k.length)]:k;return {name,n,coins:0,items:{[key]:n},key};}
/* ---------- 🦇 ค้างคาวขนลูกอม (1 นาที · ลากนิ้วฟัน) — รายการของเหมือนกันทุกเครื่องจาก seed · เซิร์ฟเวอร์คิดกุศลจากรายการที่ฟันจริง ---------- */
export const TW_BAT_MS=60000,TW_BAT_WARN=15000,TW_BAT_LIFE=3400,TW_BAT_RATE=10,TW_BAT_SETTLE=120000,TW_BAT_LEVELS=[1,2,5],TW_BAT_MAX_HITS=600;
export const TW_BAT_ITEMS={candyO:[3000,36],candyP:[6000,22],candyG:[30000,4],rotten:[-3000,9],poison:[-6000,6],cursed:[-8000,5],cat:[-5000,9],skull:[-10000,7],axeW:[0,4],axeS:[0,2],axeG:[0,1]};
export const TW_BAT_AXE={axeW:'w',axeS:'s',axeG:'g'};
export function twRng(seed){let a=seed|0;return ()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function twBatLogic(seed){const rng=twRng(seed),keys=Object.keys(TW_BAT_ITEMS),tot=keys.reduce((a,k)=>a+TW_BAT_ITEMS[k][1],0),list=[];let t=700,id=0;
 const pick=()=>{let r=rng()*tot;for(const k of keys){r-=TW_BAT_ITEMS[k][1];if(r<0)return k;}return 'candyO';};
 while(t<TW_BAT_MS-TW_BAT_LIFE+400){const n=rng()<.28?2:1;for(let j=0;j<n;j++){const k=pick();list.push({id:id++,k,v:TW_BAT_ITEMS[k][0],t0:t+j*120,b:Math.floor(rng()*3)});}t+=260+Math.floor(rng()*220);}
 return list;}
/* hits=[[id,t],...] (t = มิลลิวินาทีนับจากเริ่ม) · ชิ้นละครั้ง · ต้องอยู่ในช่วงที่ลอยอยู่ · เกิน 10 ครั้ง/วินาทีไม่นับ */
export const TW_BAT_AXE_MAX={w:4,s:2,g:1};/* ขวานต่อคนต่อค้างคาว 1 รอบ */
export function twBatScore(list,hits,lvl,maxT=Infinity){const m=TW_BAT_LEVELS.includes(lvl)?lvl:1,by=new Map(list.map(x=>[x.id,x])),used=new Set(),win=[];
 const ev=[];for(const h of Array.isArray(hits)?hits.slice(0,TW_BAT_MAX_HITS):[]){if(!Array.isArray(h))continue;const id=Number(h[0]),t=Number(h[1]);if(Number.isSafeInteger(id)&&Number.isFinite(t))ev.push({id,t});}
 ev.sort((a,b)=>a.t-b.t);const s={merit:0,plus:0,minus:0,n:0,axes:{w:0,s:0,g:0}};
 for(const e of ev){while(win.length&&e.t-win[0]>=1000)win.shift();if(win.length>=TW_BAT_RATE)continue;win.push(e.t);
  if(e.t>maxT)continue;/* เวลาที่ยังมาไม่ถึง = ส่งล่วงหน้า ไม่นับ */const x=by.get(e.id);if(!x||used.has(e.id)||e.t<x.t0-150||e.t>x.t0+TW_BAT_LIFE+400)continue;used.add(e.id);s.n++;
  if(TW_BAT_AXE[x.k]){const a=TW_BAT_AXE[x.k];if(s.axes[a]<TW_BAT_AXE_MAX[a])s.axes[a]++;continue;}const v=x.v*m;s.merit+=v;if(v>0)s.plus+=v;else s.minus-=v;}
 /* กันสคริปต์: กุศลบวกต่อคนต่อรอบไม่เกิน 1.5 ล้าน × ระดับ */
 if(s.plus>TW_BAT_PLUS_CAP*m){s.merit-=s.plus-TW_BAT_PLUS_CAP*m;s.plus=TW_BAT_PLUS_CAP*m;}
 return s;}
export const TW_BAT_PLUS_CAP=1500000;
