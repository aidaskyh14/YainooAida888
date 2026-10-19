/* fix16 🎃 ร้านซุปแม่มด — กติกาเกมชุดเดียว ใช้ทั้งหน้าเกม (เล่นจริง) และเซิร์ฟเวอร์ (เล่นซ้ำจากบันทึกการกดเพื่อตัดสินผล)
   เวลาทั้งหมดเป็นมิลลิวินาทีนับจากเริ่มด่าน · ทุกเหตุการณ์ (ลูกค้ามา/หมดความอดทน/เดินออก/หม้อเดือด/ล้น) เกิดตามเวลาแน่นอน ไม่ขึ้นกับความเร็วเครื่อง */
export const SOUP_HAM=['vamp','witch','pump','mummy','ghost','devil'];
export const SOUPT=['candy','batchip','web'],CAKET=['eye','minipump'];
export const SOUP_LEAVE=1280,SOUP_REFILL=900,SOUP_FIRST=600;
/* แผนลูกค้า (เซิร์ฟเวอร์สุ่ม): [{h, order:[{k,t?,f?}], r}] */
export function soupPlan(stage,L,rng){const pick=a=>a[Math.min(a.length-1,Math.floor(rng()*a.length))];
  const dish=()=>rng()<.45?{k:'soup',t:pick(SOUPT)}:{k:'cake',f:rng()<.5?'p':'o',t:pick(CAKET)};
  const order=()=>stage===0?(rng()<.5?[dish(),{k:'potion'}]:[dish()]):stage===1?(rng()<.4?[dish(),dish()]:[dish(),{k:'potion'}]):(rng()<.6?[dish(),dish(),{k:'potion'}]:[dish(),dish()]);
  return Array.from({length:L.total},()=>({h:pick(SOUP_HAM),order:order(),r:Math.floor(rng()*1000)/1000}));}
export const soupSame=(a,b)=>a.k===b.k&&(a.k==='potion'||(a.t===b.t&&(a.k==='soup'||a.f===b.f)));
export function soupNew(L,plan){return {L,plan,t:0,plate:null,drink:false,slots:[null,null,null],idx:0,served:0,missed:0,nextAt:SOUP_FIRST,end:L.time*1000,cd:{s:'idle',t:0},over:null,ev:[]};}
function nextEvent(S){let best=null;const take=(time,k,c)=>{if(best===null||time<best.time)best={time,k,c};};
  S.slots.forEach(c=>{if(!c)return;if(c.busy)take(c.freeAt,'free',c);else take(c.born+c.pat,'expire',c);});
  if(S.idx<S.plan.length)take(S.nextAt,'spawn');
  if(S.cd.s==='brew')take(S.cd.t+S.L.brew,'ready');else if(S.cd.s==='ready')take(S.cd.t+S.L.win,'boil');
  take(S.end,'end');return best;}
function check(S,time){if(S.over)return;if(S.served>=S.L.need)S.over={win:true,t:time};else if(S.missed>S.L.total-S.L.need)S.over={win:false,t:time};}
/* เดินเวลาไปถึง t (ประมวลเหตุการณ์ทีละอันตามลำดับเวลา) */
export function soupAdvance(S,t){let guard=0;
  while(!S.over&&guard++<10000){const e=nextEvent(S);if(!e||e.time>t)break;const time=e.time;
    if(e.k==='end'){S.over={win:S.served>=S.L.need,t:time};break;}
    if(e.k==='free'){S.slots[e.c.slot]=null;S.nextAt=Math.min(S.nextAt,time+SOUP_REFILL);S.ev.push({k:'free',c:e.c});}
    else if(e.k==='expire'){e.c.busy=true;e.c.ok=false;e.c.freeAt=time+SOUP_LEAVE;S.missed++;S.ev.push({k:'expire',c:e.c});check(S,time);}
    else if(e.k==='spawn'){const free=[0,1,2].filter(i=>!S.slots[i]);
      if(free.length){const p=S.plan[S.idx],slot=free[Math.min(free.length-1,Math.floor(p.r*free.length))];
        const c={i:S.idx,h:p.h,slot,order:p.order.map(o=>({...o,done:false})),born:time,pat:S.L.pat,busy:false};S.slots[slot]=c;S.idx++;S.ev.push({k:'spawn',c});}
      S.nextAt=time+S.L.gap;}
    else if(e.k==='ready'){S.cd={s:'ready',t:time};S.ev.push({k:'cauld'});}
    else if(e.k==='boil'){S.cd={s:'boil',t:time};S.ev.push({k:'cauld'});}}
  if(!S.over)S.t=Math.max(S.t,t);return S;}
/* การกด: soup | cake | fp | fo | tr:<topping> | trash | cauld | serve (ci = เลขลูกค้า) → {ok,hit?,done?} */
export function soupAct(S,t,a,ci){soupAdvance(S,t);if(S.over)return {ok:false};const p=S.plate;
  if(a==='soup'||a==='cake'){if(p)return {ok:false};S.plate={k:a};return {ok:true};}
  if(a==='fp'||a==='fo'){if(!p||p.k!=='cake'||p.f)return {ok:false};p.f=a==='fp'?'p':'o';return {ok:true};}
  if(typeof a==='string'&&a.startsWith('tr:')){const x=a.slice(3);if(!p||p.t)return {ok:false};
    if(p.k==='soup'&&SOUPT.includes(x)){p.t=x;return {ok:true};}if(p.k==='cake'&&CAKET.includes(x)&&p.f){p.t=x;return {ok:true};}return {ok:false};}
  if(a==='trash'){if(!p)return {ok:false};S.plate=null;return {ok:true};}
  if(a==='cauld'){const c=S.cd;if(c.s==='idle'){S.cd={s:'brew',t};return {ok:true};}if(c.s==='ready'){if(S.drink)return {ok:false};S.drink=true;S.cd={s:'idle',t};return {ok:true};}
    if(c.s==='boil'){S.cd={s:'idle',t};return {ok:true};}return {ok:false};}
  if(a==='serve'){const c=S.slots.find(x=>x&&x.i===ci);if(!c||c.busy)return {ok:false};let hit=false;
    if(S.plate){const o=c.order.find(o=>!o.done&&o.k!=='potion'&&soupSame(o,S.plate));if(o){o.done=true;S.plate=null;hit=true;}}
    if(!hit&&S.drink){const o=c.order.find(o=>!o.done&&o.k==='potion');if(o){o.done=true;S.drink=false;hit=true;}}
    if(!hit){c.born-=c.pat*.25;return {ok:true,hit:false};}
    let done=false;if(c.order.every(o=>o.done)){c.busy=true;c.ok=true;c.freeAt=t+SOUP_LEAVE;S.served++;done=true;check(S,t);}
    return {ok:true,hit:true,done};}
  return {ok:false};}
/* เซิร์ฟเวอร์: เล่นซ้ำจากบันทึก [[t,a,ci],...] → {win,t} */
export function soupReplay(L,plan,log){if(!Array.isArray(log)||log.length>3000)return {win:false,why:'log'};const S=soupNew(L,plan);let last=0;
  for(const e of log){if(!Array.isArray(e))return {win:false,why:'log'};const [t,a,ci]=e;
    if(!Number.isFinite(t)||t<last||t>S.end||typeof a!=='string'||a.length>12||(ci!==undefined&&ci!==null&&!Number.isInteger(ci)))return {win:false,why:'log'};
    last=t;soupAct(S,t,a,ci);if(S.over)break;}
  if(!S.over)soupAdvance(S,last);
  return S.over&&S.over.win?{win:true,t:S.over.t}:{win:false,t:S.over?S.over.t:last};}
