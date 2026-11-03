import {payBroom,altHave,ALT_X} from './broom-pay.js?h=92e78b5b';
/* fix16 มินิเกมลอยกระทงของสัตว์ (เซิร์ฟเวอร์ตัดสิน)
   🐱 cup  = หาแมวในแก้ว (คอกแมว)      ค่าเข้า พวงมาลัย/ใบตองทอง/ดอกดาวเรือง อย่างละ 20
   🐹 soup = ร้านซุปแม่มด (หลังบ้าน)    ค่าเข้า หม้อยา/ฟักทอง/ธูปหอม อย่างละ 20
   3 ด่าน · ผ่านแล้วเลือก "พอแค่นี้" (รับกุศลของด่านล่าสุด) หรือ "ไปต่อ" (พลาด = ไม่ได้อะไร)
   พลาดด่าน 1 = เสีย 500–3,000 กุศล · จบรอบแล้วคูลดาวน์ 5 นาที (นับต่อแม้ออกจากเกม)
   เปิด 10:00–18:00 เวลาไทย (แอดมินเปิด/ปิด/แก้เวลาได้ใน world/hwmini) · กุศลที่ได้นับแคมเปญ Pet Care
   ข้อมูลผู้เล่น: game.sub.hwmini = {cd:{cup,soup}, r:{g,st,ph,at,dl,bank,plan,ans,need}, n:{cup,soup}} */
export const HWM_GAMES=['cup','soup'];
export const HWM_FEE={cup:{hat:20,broom:20,candy:20},soup:{cauldron:20,pumpkin:20,candle:20}};
export const HWM_PRIZE=[[4000,6000],[10000,15000],[20000,30000]];
export const HWM_LOSS=[500,3000];
export const HWM_COOLDOWN=5*60000;
export const HWM_DEFAULT={on:true,from:10,to:18};
export const HWM_CUP=[{swaps:12,ms:300,mix:[.7,.3,0],t:4,fake:0},{swaps:18,ms:220,mix:[.4,.35,.25],t:3,fake:.18},{swaps:24,ms:160,mix:[.25,.4,.35],t:3,fake:.18}];
export const HWM_SOUP=[{total:6,need:6,gap:3500,pat:20000,time:75,win:3500,brew:3500},{total:8,need:8,gap:3000,pat:17000,time:80,win:2800,brew:4000},{total:10,need:10,gap:2500,pat:15000,time:85,win:2200,brew:4500}];
const SLACK=8000;
import {soupPlan,soupReplay} from './soup-sim.js?h=ec743e0e';
function fail(m){const e=new Error(m);e.code='failed-precondition';throw e;}
const int=(rng,lo,hi)=>lo+Math.floor(rng()*(hi-lo+1));
const r100=(rng,[lo,hi])=>Math.round(int(rng,lo,hi)/100)*100;
export const bkkHourF=now=>{const d=new Date(now+7*3600000);return d.getUTCHours()+d.getUTCMinutes()/60;};
export function hwmConfig(world){const out={};for(const g of HWM_GAMES){const c=world?.[g]||{};const h=v=>Number.isInteger(v)&&v>=0&&v<=24;
  out[g]={on:c.on!==false,from:h(c.from)?c.from:HWM_DEFAULT.from,to:h(c.to)?c.to:HWM_DEFAULT.to};}return out;}
export function hwmOpen(cfg,now){if(!cfg.on)return false;const h=bkkHourF(now);return cfg.from<cfg.to?h>=cfg.from&&h<cfg.to:cfg.from>cfg.to?(h>=cfg.from||h<cfg.to):false;}
/* แผนสลับแก้ว: สตริง "s:a,b" สลับ 2 ใบ · "d:a,b,c,d" สลับ 2 คู่พร้อมกัน · "r:a,b,c" หมุน 3 ใบ (a→b→c→a) · "f:p" แก้วกระตุกหลอก */
export function cupPlan(stage,rng){const L=HWM_CUP[stage],slot=int(rng,0,4),ops=[];
  const pickN=k=>{const a=[0,1,2,3,4];for(let i=4;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,k);};
  for(let s=0;s<L.swaps;s++){const r=rng(),t=r<L.mix[0]?0:r<L.mix[0]+L.mix[1]?1:2;
    if(t===0)ops.push('s:'+pickN(2).join(','));else if(t===1)ops.push('d:'+pickN(4).join(','));else ops.push('r:'+pickN(3).join(','));
    if(L.fake&&rng()<L.fake)ops.push('f:'+pickN(1)[0]);}
  return {slot,ops,ms:L.ms,t:L.t};}
export function cupAnswer(plan){let p=plan.slot;for(const op of plan.ops){const [k,v]=op.split(':'),a=v.split(',').map(Number);
  if(k==='s'||k==='d'){for(let i=0;i<a.length;i+=2){if(p===a[i]){p=a[i+1];break;}if(p===a[i+1]){p=a[i];break;}}}
  else if(k==='r'){const i=a.indexOf(p);if(i>=0)p=a[(i+1)%3];}}
  return p;}
/* เวลาที่หน้าเกมใช้: ซ่อนแมว ~2.4 วิ + สลับ (ms+30)/ครั้ง + กระตุก + เวลาเลือก */
export function cupDuration(plan){let ms=2400;for(const op of plan.ops)ms+=op.startsWith('f:')?Math.max(140,plan.ms*.6):plan.ms+30;return Math.round(ms+plan.t*1000);}
function newRound(m,g,stage,now,rng){
  if(g==='cup'){const plan=cupPlan(stage,rng);m.r={g,st:stage,ph:'play',at:now,dl:now+cupDuration(plan)+SLACK,min:Math.max(0,cupDuration(plan)-plan.t*1000-2500),bank:m.r?.bank||0,plan,ans:cupAnswer(plan)};}
  else{const L=HWM_SOUP[stage];m.r={g,st:stage,ph:'play',at:now,dl:now+L.time*1000+SLACK,bank:m.r?.bank||0,need:L.need,plan:soupPlan(stage,L,rng)};}
}
/* สิ่งที่ส่งให้หน้าเกม (ไม่ส่งคำตอบ) */
export function hwmView(m,cfg,now,g){const r=m.r&&(!g||m.r.g===g)?m.r:null;
  return {cfg,open:Object.fromEntries(HWM_GAMES.map(k=>[k,hwmOpen(cfg[k],now)])),cd:{cup:m.cd?.cup||0,soup:m.cd?.soup||0},
    round:r?{g:r.g,st:r.st,ph:r.ph,at:r.at,dl:r.dl,bank:r.bank,...(r.plan&&r.g==='cup'?{plan:{slot:r.plan.slot,ops:r.plan.ops,ms:r.plan.ms,t:r.plan.t}}:{}),...(r.plan&&r.g==='soup'?{plan:r.plan}:{}),...(r.g==='soup'?{need:r.need}:{})}:null,serverNow:now};}
function settleLoss(game,m,now,rng){const r=m.r;let loss=0;if(r.st===0){loss=Math.min(r100(rng,HWM_LOSS),Math.max(0,game.merit||0));game.merit=(game.merit||0)-loss;}
  m.cd ||= {};m.cd[r.g]=now+HWM_COOLDOWN;m.r=null;return loss;}
function settleTake(game,m,now){const r=m.r,gain=r.bank||0;game.merit=(game.merit||0)+gain;m.cd ||= {};m.cd[r.g]=now+HWM_COOLDOWN;m.r=null;return gain;}
/* รอบค้าง (ปิดแอป/รีเฟรช): กำลังเล่นแล้วเกินเวลา = แพ้ · รอเลือกพอ/ไปต่อเกิน 10 นาที = รับรางวัลให้อัตโนมัติ */
export function hwmTidy(game,now,rng){const m=game.sub?.hwmini;if(!m?.r)return null;const r=m.r;
  if(r.ph==='play'&&now>r.dl){const g=r.g,stage=r.st,loss=settleLoss(game,m,now,rng);return {g,result:'lose',stage,loss,auto:true};}
  if(r.ph==='decide'&&now>r.at+10*60000){const g=r.g,stage=r.st,gain=settleTake(game,m,now);return {g,result:'take',stage,gain,auto:true};}
  return null;}
export function hwmAction(account,ctx,input,world,rng=Math.random){
  const game=structuredClone(account),now=ctx.now,cfg=hwmConfig(world);game.sub ||= {};const had=!!game.sub.hwmini,m=game.sub.hwmini ||= {cd:{},n:{}};m.cd ||= {};m.n ||= {};
  const type=input?.type,g=input?.game;
  if(type==='config'){if(!ctx.admin)fail('เฉพาะแอดมิน');const next=hwmConfig({...cfg,[g]:{...cfg[g],...input.set}});
    if(!HWM_GAMES.includes(g))fail('ไม่พบเกมนี้');const s=input.set||{};
    if('from' in s&&!(Number.isInteger(s.from)&&s.from>=0&&s.from<=23))fail('เวลาเปิดไม่ถูกต้อง');if('to' in s&&!(Number.isInteger(s.to)&&s.to>=1&&s.to<=24))fail('เวลาปิดไม่ถูกต้อง');
    if(next[g].from===next[g].to)fail('เวลาเปิดและปิดต้องไม่เท่ากัน');
    return {game:account,world:next,view:hwmView(m,next,now,null)};}
  const tidy=hwmTidy(game,now,rng);
  if(type==='status')return {game:tidy||had?game:account,view:hwmView(m,cfg,now,g),tidy};
  if(!HWM_GAMES.includes(g))fail('ไม่พบเกมนี้');
  if(type==='start'){
    if(m.r)fail('ยังมีรอบที่เล่นค้างอยู่');
    if(!hwmOpen(cfg[g],now))fail(cfg[g].on?'ร้านปิดแล้ว เปิด '+String(cfg[g].from).padStart(2,'0')+':00–'+String(cfg[g].to).padStart(2,'0')+':00 น.':'ปิดปรับปรุงชั่วคราว');
    if((m.cd[g]||0)>now)fail('เล่นได้อีกใน '+Math.ceil((m.cd[g]-now)/60000)+' นาที');
    const bag=game.bag ||= {},hw=bag.halloween ||= {},fee=HWM_FEE[g];
    const alt=fee.broom&&input.alt&&input.alt!=='broom'?input.alt:null;/* fix23: ใบตองทองใช้ของแทนได้ ×5 */
    if(Object.entries(fee).some(([k,q])=>!(alt&&k==='broom')&&!(Number.isSafeInteger(hw[k])&&hw[k]>=q)))fail('ของลอยกระทงไม่พอจ่ายค่าเข้า');
    if(alt&&altHave(game,alt)<fee.broom*ALT_X)fail('ของแทนใบตองทองไม่พอ ต้องมี '+(fee.broom*ALT_X)+' ชิ้น');
    for(const [k,q] of Object.entries(fee)){if(alt&&k==='broom'){payBroom(game,q,alt);continue;}hw[k]-=q;}
    m.n[g]=(m.n[g]||0)+1;newRound(m,g,0,now,rng);m.r.bank=0;
    return {game,view:hwmView(m,cfg,now,g),tidy,fee};}
  const r=m.r;
  if(!r||r.g!==g){if(tidy&&tidy.g===g)return {game,view:hwmView(m,cfg,now,g),tidy,result:tidy};fail('ไม่มีรอบที่กำลังเล่น');}
  if(type==='pick'||type==='finish'){
    if(r.ph!=='play')fail('รอบนี้ตัดสินไปแล้ว');
    let win;
    if(g==='cup'){if(type!=='pick')fail('รายการไม่ถูกต้อง');const pos=input.pos;if(!(Number.isInteger(pos)&&pos>=-1&&pos<=4))fail('เลือกแก้วไม่ถูกต้อง');win=pos===r.ans&&now<=r.dl&&now>=r.at+(r.min||0);}
    else{if(type!=='finish')fail('รายการไม่ถูกต้อง');/* เล่นซ้ำจากบันทึกการกดด้วยกติกาเดียวกับหน้าเกม · ต้องใช้เวลาจริงไม่น้อยกว่าในเกม */
      const rep=input.win===true&&Array.isArray(r.plan)?soupReplay(HWM_SOUP[r.st],r.plan,input.log):{win:false};win=rep.win&&now>=r.at+rep.t-500&&now<=r.dl;}
    const stage=r.st,ans=r.ans;
    if(!win){const loss=settleLoss(game,m,now,rng);return {game,view:hwmView(m,cfg,now,g),result:{g,result:'lose',stage,loss,...(g==='cup'?{ans}:{})}};}
    r.bank=r100(rng,HWM_PRIZE[stage]);
    if(stage>=2){const gain=settleTake(game,m,now);return {game,view:hwmView(m,cfg,now,g),result:{g,result:'take',stage,gain,ans,all:true},gain};}
    r.ph='decide';r.at=now;delete r.plan;delete r.ans;
    return {game,view:hwmView(m,cfg,now,g),result:{g,result:'win',stage,bank:r.bank,...(g==='cup'?{ans}:{})}};}
  if(type==='take'){if(r.ph!=='decide')fail('ยังเลือกไม่ได้');const stage=r.st,gain=settleTake(game,m,now);return {game,view:hwmView(m,cfg,now,g),result:{g,result:'take',stage,gain},gain};}
  if(type==='next'){if(r.ph!=='decide')fail('ยังไปต่อไม่ได้');const bank=r.bank;newRound(m,g,r.st+1,now,rng);m.r.bank=bank;return {game,view:hwmView(m,cfg,now,g)};}
  fail('รายการไม่ถูกต้อง');
}
