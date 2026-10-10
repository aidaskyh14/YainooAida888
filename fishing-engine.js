import {FISH_EVENTS} from './campaigns-engine.js';
import {FISH,RODS,RK,VIPL,SETS,LADDER,MERIT,PONDS} from './fishing-catalog.js';
const fail=m=>{throw new Error(m);};
const pick=(rng,a)=>a[Math.floor(rng()*a.length)];
const int=(rng,a,b)=>a+Math.floor(rng()*(b-a+1));
const weighted=(rng,list)=>{let x=rng()*list.reduce((n,w)=>n+w,0);for(let i=0;i<list.length;i++){x-=list[i];if(x<0)return i;}return list.length-1;};
export const fishDay=now=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
export const fishOpen=now=>{const h=+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',hour:'2-digit',hour12:false}).format(new Date(now));return (h>=11&&h<17)||h>=21||h<7;};
// Touch latency grace: a tap counts if the needle was inside the zone at any moment in [hitAt-TAP_GRACE, hitAt].
export const TAP_GRACE=120;
const needleX=(m,t)=>{const ph=((((t-m.startedAt)%m.period)+m.period)%m.period)/m.period;return (ph<.5?ph*2:2-ph*2)*100;};
export function needleInZone(m,at){const lo=Math.max(m.startedAt,at-TAP_GRACE),hi=Math.max(lo,at),xs=[needleX(m,lo),needleX(m,hi)],half=m.period/2;
 for(let k=Math.ceil((lo-m.startedAt)/half);m.startedAt+k*half<hi;k++){const t=m.startedAt+k*half;if(t>lo)xs.push(needleX(m,t));}
 return Math.max(...xs)>=m.zone&&Math.min(...xs)<=m.zone+m.width;}
const fishWeight=(rng,k)=>Math.round((FISH[k][2]+rng()*(FISH[k][3]-FISH[k][2]))*100)/100;
export const freshFishing=now=>({day:fishDay(now),closed:false,seats:{n1:Array(6).fill(null),n2:Array(6).fill(null),v1:Array(8).fill(null),v2:Array(8).fill(null)},board:{},hist:[],cuts:{},taken:{},cd:{},vipCount:{},vipCd:{},lucky:int(Math.random,0,3)});
export function fishingPublic(r,now){const view=structuredClone(r);delete view.lucky;delete view.cuts;delete view.taken;delete view.cd;delete view.vipCount;delete view.vipCd;view.open=r.mode==='open'||(r.mode!=='closed'&&!r.closed&&fishOpen(now));for(const seats of Object.values(view.seats))for(const s of seats)if(s){delete s.res;delete s.hit;delete s.mini;delete s.event;}return view;}
export function fishingAction(source,account,ctx,input,rng=Math.random){
 const r=structuredClone(source),game=structuredClone(account);game.sub ||= {};const f=game.sub.fishing ||= {cat:{},claimed:Array(8).fill(0)};f.cat ||= {};f.claimed ||= Array(8).fill(0);for(const k of Object.keys(FISH))f.cat[k] ||= {n:0,best:0};
 game.bag ||= {};game.bag.rod ||= {};game.bag.fishing ||= {};game.bag.item ||= {};
 r.updatedAt=ctx.now;const award=[];const hour=Math.floor(ctx.now/3600000);if(r.luckyHour!==hour){r.luckyHour=hour;r.lucky=int(rng,0,3);}
 if(r.day!==fishDay(ctx.now)) {
   const prev=r.hist.at(-1),top=Object.entries(r.board).sort((a,b)=>b[1].w-a[1].w).slice(0,5).map(([uid,row])=>{const old=prev?.top.find(p=>p.uid===uid),consecutive=prev&&Date.parse(r.day)-Date.parse(prev.day)===864e5,st=old&&consecutive?old.st+1:1;const winner={uid,name:row.name,w:row.w,st,rw:5000+1000*(st-1)};award.push(winner);return winner;});
   if(top.length)r.hist.push({day:r.day,top});r.hist=r.hist.slice(-5);r.day=fishDay(ctx.now);r.board={};r.cuts={};r.taken={};r.cd={};r.vipCount={};r.vipCd={};r.lucky=int(rng,0,3);
 }
 if(f.day!==r.day){f.day=r.day;f.pondToday=null;}
 const release=(p,i)=>{const s=r.seats[p][i];if(!s)return;r.cd[s.uid]=ctx.now+int(rng,3,5)*60000;if(s.vip&&(r.vipCount[s.uid]||0)>=5){r.vipCd[s.uid]=ctx.now+30*60000;r.vipCount[s.uid]=0;}r.seats[p][i]=null;};
 for(const[p,seats]of Object.entries(r.seats))for(let i=0;i<seats.length;i++){
  const s=seats[i];if(!s)continue;
  if(s.vip&&s.card<=ctx.now){release(p,i);continue;}
  if(s.ph==='idle'&&!s.vip&&s.idle<=ctx.now){release(p,i);continue;}
  if(s.ph==='wait'&&s.t<=ctx.now){s.ph='hook';s.hookUntil=s.t+3*60000;}
  if(s.ph==='hook'&&s.hookUntil<=ctx.now){if(s.vip&&s.hearts>1){s.hearts--;s.ph='idle';delete s.res;delete s.mini;delete s.event;}else release(p,i);}
 }
 const locate=uid=>{for(const[p,seats]of Object.entries(r.seats)){const i=seats.findIndex(s=>s?.uid===uid);if(i>=0)return {p,i,s:seats[i]};}return null;};
 const found=locate(ctx.uid),own=found?.s;
 const result=extra=>({race:r,game,award,...extra});
 if(input.type==='status')return result({mine:found});
 if(input.type==='admin'){if(!ctx.admin)fail('เฉพาะแอดมิน');if(input.mode&&!['auto','open','closed'].includes(input.mode))fail('โหมดไม่ถูกต้อง');r.mode=input.mode||(input.closed?'closed':'auto');r.closed=r.mode==='closed';return result({mine:found});}
 if(input.type==='claimSet'){
  const index=input.set;if(!Number.isInteger(index)||index<0||index>=8)fail('เซ็ตไม่ถูกต้อง');const st=SETS[index],count=Math.min(...st.f.map(k=>f.cat[k].n));let gain=0,q=0;
  while(f.claimed[index]<LADDER.length&&count>=LADDER[f.claimed[index]]){gain+=MERIT[f.claimed[index]]*st.m;q+=st.q;f.claimed[index]++;}
  if(!q)fail('ยังไม่มีขั้นที่รับได้');game.merit=(game.merit||0)+gain;
  if(st.it==='rod'){for(let i=0;i<q;i++){const k=pick(rng,RK);game.bag.rod[k]=(game.bag.rod[k]||0)+1;}}
  else {const group=['crab','vip'].includes(st.it)?game.bag.fishing:game.bag.item,key={wings:'angel',fertp:'fertfruitP'}[st.it]||st.it;group[key]=(group[key]||0)+q;}
  return result({reward:{merit:gain,quantity:q,item:st.it},mine:found});
 }
 if(input.type==='craft'){
  const q=input.quantity;if(!Number.isInteger(q)||q<1||q>10)fail('คราฟครั้งละ 1–10');const crop=input.crop,flower=input.flower;
  const validCrop=['carrot','corn','pumpkin','tomato','cabbage','potato','waterspinach','chili'];
  if(input.recipe!=='vip'&&!validCrop.includes(crop))fail('พืชพรรณไม่ถูกต้อง');let needs;
  if(input.recipe==='rod'){
   if(!RK.includes(input.rod)||!['daisy','rose','butterflypea','sunflower','lotus','orchid','tulip','lavender','marigold','hydrangea','plumeria','hibiscus'].includes(flower))fail('เบ็ดหรือดอกไม้ไม่ถูกต้อง');
   needs=[...['peach','apple','orange','cherry'].map(k=>['fruit',k,80]),['flower',flower,150],...['green','yellow','red','pink','blue'].map(k=>['grass',k,400]),['crop',crop,1200]];
  }else if(input.recipe==='crab')needs=[...['fang','quills','claw','tail'].map(k=>['hedge',k,20]),['forest','stone',300],['crop',crop,1000]];else if(input.recipe==='vip')needs=[['grass','blue',1000],['fruit','apple',300],['fruit','cherry',300],['flower','rose',300],['forest','steel',20]];else fail('สูตรไม่ถูกต้อง');
  if(needs.some(([group,k,n])=>(game.bag[group]?.[k]||0)<n*q))fail('วัตถุดิบไม่พอ');for(const[group,k,n]of needs)game.bag[group][k]-=n*q;
  const results=Array.from({length:q},()=>rng()<(input.recipe==='rod'?.8:input.recipe==='crab'?.75:.1)),wins=results.filter(Boolean).length;const group=input.recipe==='rod'?game.bag.rod:game.bag.fishing,key=input.recipe==='rod'?input.rod:input.recipe;group[key]=(group[key]||0)+wins;return result({crafted:wins,results,outputs:wins?[{path:(input.recipe==='rod'?'rod.':'fishing.')+key,quantity:wins}]:[],consumed:needs.map(([g,k,n])=>({path:g+'.'+k,quantity:n*q})),mine:found});
 }
 if(r.mode==='closed'||r.mode!=='open'&&(r.closed||!fishOpen(ctx.now)))fail('บ่อปิด เปิด 11:00–17:00 และ 21:00–07:00 เวลาไทย');
 if(input.type==='sit'){
  if(found)fail('คุณนั่งอยู่แล้ว');if((r.cd[ctx.uid]||0)>ctx.now)fail('ยังอยู่ในช่วงพักตกปลา');const p=input.pond,i=input.seat;
  if(!PONDS[p]||!Number.isInteger(i)||i<0||i>=r.seats[p].length)fail('ท่าไม่ถูกต้อง');if(r.seats[p][i])fail('มีคนนั่งก่อนแล้ว');const vip=PONDS[p].k==='v';
  if(vip){if((r.vipCd[ctx.uid]||0)>ctx.now)fail('บ่อ VIP ยังพักอยู่');if((game.bag.fishing.vip||0)<1)fail('ไม่มีบัตร VIP');game.bag.fishing.vip--;r.vipCount[ctx.uid]=(r.vipCount[ctx.uid]||0)+1;}
  else {if(f.pondToday&&f.pondToday!==p)fail('บ่อทั่วไปเลือกได้วันละหนึ่งบ่อ');f.pondToday=p;}
  r.seats[p][i]={uid:ctx.uid,who:ctx.name,rod:'bamboo',ph:'idle',vip,stage:0,tot:0,hearts:2,card:ctx.now+60*60000,idle:ctx.now+3*60000};return result({mine:locate(ctx.uid)});
 }
 if(input.type==='cut'){
  const target=r.seats[input.pond]?.[input.seat];if(!own||found.p!==input.pond||own.vip||target?.vip||!target||target.uid===ctx.uid||!['wait','hook'].includes(own.ph)||!['wait','hook'].includes(target.ph))fail('ตัดเบ็ดนี้ไม่ได้');
  if((r.cuts[ctx.uid]||0)>=30||(r.taken[target.uid]||0)>=30)fail('ครบโควตาตัดเบ็ดวันนี้');if((game.bag.fishing.crab||0)<1)fail('ไม่มีกรรไกรปู');game.bag.fishing.crab--;r.cuts[ctx.uid]=(r.cuts[ctx.uid]||0)+1;r.taken[target.uid]=(r.taken[target.uid]||0)+1;target.ph='idle';target.idle=ctx.now+3*60000;delete target.res;delete target.mini;return result({mine:found});
 }
 if(!own)fail('คุณยังไม่ได้นั่งตกปลา');
 if(input.type==='leave'){if(own.ph!=='idle')fail('ต้องจบรอบก่อนลุก');release(found.p,found.i);return result({mine:null});}
 if(input.type==='cast'){
  if(own.ph!=='idle')fail('หย่อนเบ็ดอยู่แล้ว');const rod=input.rod;if(!RK.includes(rod)||(game.bag.rod[rod]||0)<1)fail('ไม่มีเบ็ดแบบนี้');game.bag.rod[rod]--;own.rod=rod;own.ph='wait';const ev=ctx.fishEvent?.start&&ctx.fishEvent.end>ctx.now&&ctx.fishEvent.evHour===Math.floor(ctx.now/3600e3)?FISH_EVENTS[ctx.fishEvent.ev]?.[3]||{}:{};own.event=ev;own.t=ctx.now+(own.vip?5:10)*60000*(ev.slow?2:1);own.hookUntil=own.t+3*60000;delete own.mini;
  if(own.vip){const key=VIPL[own.stage][0],base=VIPL[own.stage][1]/100;let odds=base*(RK[r.lucky]===rod?1.15:1);if(ev.legend)odds*=ev.legend;if(ev.uni&&['unicorn','goldsheep'].includes(key))odds*=ev.uni;if(ev.gold&&key==='goldsheep')odds*=ev.gold;if(ev.shark&&own.stage<4)odds*=ev.shark;if(ev.rare&&own.stage>=4)odds*=ev.rare;own.hit=rng()<Math.min(1,odds)&&!(ev.miss&&rng()<ev.miss);}
  else {const info=RODS[rod],counts=[...info.cnt],tiers=[...info.tier];if(RK[r.lucky]===rod){counts[0]-=12;counts[1]+=9;counts[2]+=3;tiers[0]-=10;tiers[2]+=10;}const n=weighted(rng,counts)+1,caught=[];let level=1;for(let j=0;j<n;j++){const tier=weighted(rng,tiers)+1;level=Math.max(level,tier);const key=pick(rng,Object.keys(FISH).filter(k=>FISH[k][1]===tier));caught.push({k:key,w:fishWeight(rng,key)});}own.res={fish:caught,tier:level};}
  return result({mine:found});
 }
 if(input.type==='prepare'){
  if(own.ph!=='hook')fail('ปลายังไม่ติดเบ็ด');if(!own.mini){const level=own.vip?4+own.stage:own.res.tier;let [period,width]=level<=3?({1:[2000,30],2:[1600,24],3:[1300,18]}[level]):[Math.max(650,1200-70*(level-4)),Math.max(8,15-(level-4))];const mood=weighted(rng,[35,45,20]);if(mood===0){period*=1.7;width*=1.6;}if(mood===2){period*=.85;width*=.85;}width=Math.min(45,width);own.mini={level,period,width,zone:8+rng()*(84-width),startedAt:ctx.now,token:ctx.nonce};}return result({challenge:own.mini,mine:found});
 }
 if(input.type==='collect'){
  const m=own.mini;if(own.ph!=='hook'||!m||input.token!==m.token)fail('รอบตกปลาไม่ถูกต้อง');const at=input.hitAt;
  if(!Number.isFinite(at)||at<m.startedAt||at>ctx.now+1500||ctx.now-at>6000)fail('เวลาจับปลาไม่ถูกต้อง');const success=needleInZone(m,at);
  const caught=success?(own.vip?(own.hit?[{k:VIPL[own.stage][0],w:fishWeight(rng,VIPL[own.stage][0])}]:[]):own.res.fish):[];
  if(caught.length&&own.event?.two)caught.push(...structuredClone(caught));let total=0;for(const fish of caught){const c=f.cat[fish.k];c.n++;c.best=Math.max(c.best,fish.w);total+=fish.w;}if(total){if(Object.keys(r.board).length>=200&&!r.board[ctx.uid])fail('สมาชิกในบอร์ดมากเกินไป');const row=r.board[ctx.uid] ||= {name:ctx.name,w:0};row.w=Math.round((row.w+total)*100)/100;own.tot+=total;}
  if(own.vip){if(caught.length){own.stage=Math.min(7,own.stage+1);own.hearts=2;}else own.hearts--;if(own.hearts<=0)release(found.p,found.i);else{own.ph='idle';delete own.mini;delete own.res;}}
  else release(found.p,found.i);
  return result({caught,total,success:caught.length>0,timing:success,mine:locate(ctx.uid)});
 }
 fail('คำสั่งตกปลาไม่ถูกต้อง');
}
