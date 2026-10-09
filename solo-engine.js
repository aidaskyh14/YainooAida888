import {seeded,bkkHour} from './campaigns-engine.js';
const fail=m=>{throw new Error(m);},choose=(r,a)=>a[Math.floor(r()*a.length)],int=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const shuffle=(r,a)=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export function birdOffer(seed){const rng=seeded(seed),order=shuffle(rng,[0,1,2,3]),roles=['normal','normal','lucky','cursed'],values={};order.forEach((t,i)=>{const role=roles[i];values[t]={role,val:role==='normal'?int(rng,25,100)*10:role==='lucky'?int(rng,50,100)*50:-int(rng,30,80)*50};});return values;}
export function birdFlights(seed,values){const rng=seeded(seed),rows=[],phases=[{from:0,to:8,iv:1.25,sp:.13},{from:8,to:15,iv:.6,sp:.15},{from:15,to:22,iv:1.4,sp:.15},{from:22,to:30,iv:.5,sp:.19},{from:30,to:35,iv:1.3,sp:.16},{from:35,to:42,iv:.75,sp:.27},{from:42,to:50,iv:.4,sp:.25},{from:50,to:60,iv:.32,sp:.29}],patterns=['straight','wave','zig','dash','uturn','fade'];
 for(const p of phases)for(let t=p.from;t<p.to;t+=p.iv*(.7+rng()*.6)){const type=p.from===35&&rng()<.5?Number(Object.keys(values).find(k=>values[k].role==='lucky')):int(rng,0,3);rows.push({id:rows.length,type,at:Math.round(t*1000),dir:rng()<.5?1:-1,y:.08+rng()*.3,phase:rng()*6,sp:p.sp*(.85+rng()*.4),pattern:choose(rng,patterns)});}
 return rows;
}
export function birdPosition(b,time){const seconds=(time-b.at)/1000;if(seconds<0)return null;let travel=seconds*b.sp,dir=b.dir;if(b.pattern==='dash')travel+=Math.max(0,seconds-1.5)*b.sp*.8;if(b.pattern==='uturn'&&travel>.75){travel=1.5-travel;dir=-dir;}const x=b.dir>0?-.1+travel:1.1-travel;if(x<-.15||x>1.15||seconds>14)return null;let y=b.y;if(['wave','fade','uturn'].includes(b.pattern))y+=Math.sin(seconds*3+b.phase)*.025;if(b.pattern==='zig')y+=Math.sin(seconds*7+b.phase)*.04;const vis=b.pattern==='fade'?Math.max(.2,(Math.sin(seconds*4+b.phase)+1)/2):1;return {x,y,dir,vis};}
export function fireBird(round,shot){const t=shot.t;if(!Number.isFinite(t)||t<0||t>=60000||t<(round.lastShot??-1)||!Number.isFinite(shot.x)||!Number.isFinite(shot.y)||shot.x<0||shot.x>1||shot.y<0||shot.y>1)fail('ตำแหน่งหรือเวลายิงไม่ถูกต้อง');
 if(t<(round.reload||0))fail('กำลังบรรจุกระสุน');if((round.reload||0)&&t>=round.reload){round.ammo=6;round.reload=0;}round.recent=(round.recent||[]).filter(at=>t-at<1000);if(round.recent.length>=4)fail('ปืนร้อน กดรัวเกินไป');round.recent.push(t);round.lastShot=t;round.shots=(round.shots||0)+1;if(round.shots>240)fail('เกินจำนวนนัดสูงสุด');round.ammo--;if(!round.ammo)round.reload=t+1500;
 let hit=null;for(let i=round.flights.length-1;i>=0;i--){const b=round.flights[i];if(round.killed.includes(b.id))continue;const p=birdPosition(b,t);if(!p||p.vis<.5)continue;const radiusX=.075/(941/1672)*.95*.5,radiusY=.075*.48;if(((shot.x-p.x)/radiusX)**2+((shot.y-p.y)/radiusY)**2<=1){hit=b;break;}}
 if(hit){round.killed.push(hit.id);round.hits[hit.type]++;round.count++;round.sum+=round.values[hit.type].val;}return hit;
}
export function soloPublic(state){const out=structuredClone(state);if(out.pk?.phase==='active')delete out.pk.kind;return out;}
export function soloAction(source,account,ctx,input,rng=Math.random){const state=structuredClone(source||{}),game=structuredClone(account);game.sub ||= {};const progress=game.sub.minigames ||= {cd:{},escrows:{}};progress.cd ||= {};let coins=ctx.coins,reward=null;const hours=bkkHour(ctx.now),nonce=ctx.nonce;const opened=(k,scheduled)=>ctx.controls?.[k]==='open'||ctx.controls?.[k]!=='closed'&&scheduled;
 const result=()=>({state,game,coins,reward});
 if(input.type==='status'){state.offer ||= birdOffer(nonce);return result();}
 if(input.type==='pk-start'){
  if(state.pk?.phase==='active')return result();if(!opened('pk',hours>=19||hours<5))fail('จิ้มฟักทองเปิด 19:00–05:00 เวลาไทย');if((progress.cd.pk||0)>ctx.now)fail('พักจิ้มฟักทอง 30 นาที');if(coins<2||(game.merit||0)<25000)fail('ใช้ 2 เหรียญและต้องมีกุศลอย่างน้อย 25,000');coins-=2;const angels=int(rng,5,10);state.pk={id:nonce,phase:'active',start:ctx.now,kind:shuffle(rng,Array.from({length:16},(_,i)=>i<angels?'angel':'devil'))};return result();
 }
 if(input.type==='pk-finish'){
  const r=state.pk;if(!r||r.phase!=='active'||r.id!==input.round)fail('รอบจิ้มฟักทองไม่ถูกต้อง');const picks=input.picks;if(!Array.isArray(picks)||picks.length!==4||new Set(picks).size!==4||picks.some(i=>!Number.isInteger(i)||i<0||i>15))fail('เลือกฟักทอง 4 ลูกที่ต่างกัน');r.picks=picks;r.angels=picks.filter(i=>r.kind[i]==='angel').length;r.phase='done';progress.cd.pk=ctx.now+30*60000;const merit={4:100000,3:20000,2:0,1:-5000,0:-15000}[r.angels];
  if(merit>0)reward={icon:'🎃',title:'จิ้มฟักทอง +'+merit+' กุศล',merit,items:{}};else if(r.angels===2)reward={icon:'📦',title:'รางวัลปลอบใจจิ้มฟักทอง',merit:0,items:{'bird-box-ostrich':10,'bird-box-dodo':10}};else game.merit=Math.max(0,(game.merit||0)+merit);r.gain=merit;return result();
 }
 if(input.type==='bs-start'){
  if(state.bs?.phase==='active'&&ctx.now<state.bs.until)return result();if(state.bs?.phase==='active')fail('รับผลรอบเดิมก่อน');if(!opened('bs',hours>=10&&hours<18))fail('ยิงนกเปิด 10:00–18:00 เวลาไทย');if((progress.cd.bs||0)>ctx.now)fail('พักยิงนก 15 นาที');if(coins<3||(game.merit||0)<10000)fail('ใช้ 3 เหรียญและต้องมีกุศลอย่างน้อย 10,000 สำหรับยอดเสี่ยง');coins-=3;state.offer ||= birdOffer(nonce);state.bs={id:nonce,phase:'active',start:ctx.now,until:ctx.now+60000,values:state.offer,flights:birdFlights(nonce,state.offer),killed:[],hits:[0,0,0,0],count:0,sum:0,ammo:6,reload:0,recent:[],shots:0};return result();
 }
 if(input.type==='bs-shot'||input.type==='bs-shots'){
  const r=state.bs;if(!r||r.phase!=='active'||r.id!==input.round)fail('รอบยิงนกไม่ถูกต้อง');const shots=input.type==='bs-shot'?[input]:input.shots;
  if(!Array.isArray(shots)||!shots.length||shots.length>40)fail('รายการยิงไม่ถูกต้อง');
  const maxAge=input.type==='bs-shot'?2000:15000;
  for(const shot of shots){if(ctx.now>r.until+maxAge||shot.t>ctx.now-r.start+500||ctx.now-r.start-shot.t>maxAge)fail('เวลายิงหมดแล้วหรือรายการเก่า');fireBird(r,shot);}return result();
 }
 if(input.type==='bs-finish'){
  const r=state.bs;if(!r||r.phase!=='active'||r.id!==input.round||ctx.now<r.until)fail('รอบยิงนกยังไม่จบ');r.phase='done';r.gain=Math.max(-10000,r.sum);progress.cd.bs=ctx.now+15*60000;if(r.gain>0)reward={icon:'🐦',title:'ยิงนกฮาโลวีน +'+r.gain+' กุศล',merit:r.gain,items:{}};else game.merit=Math.max(0,(game.merit||0)+r.gain);state.offer=birdOffer(nonce);return result();
 }
 fail('รายการมินิเกมไม่ถูกต้อง');
}
