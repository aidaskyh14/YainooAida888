/* ซีซั่น 4 · ประกวดนางนพมาศ แห่งนครยัยหนู (บรีฟ §7) — กติกาล้วน ใช้หลังบ้าน+เทสต์
   โลก world/pageant = {state, startAt, round, contestants:{uid:{no,name,o,tribe,alive,gray,scores:{talent:[],quiz:[],final:[]},garland}}, lights:{out:[],paid:[]}, talent:{round,seq,startAt,done:{}}, quiz:{id,q,choices,correct?,startAt,answers:{}}, asked:[], result:[], log:[]}
   คำถาม: ธนาคารคำถามอยู่ collection cityQuestions (แอดมินเพิ่มได้ตลอด) · ส่งคำตอบ/จับเวลาที่เซิร์ฟเวอร์ · ตอบถูกเร็วกว่าได้ทศนิยมดีกว่า · ผิด = 0 */
import {PAGEANT} from './city-catalog.js';
import {OUTFITS} from '../outfit-catalog.js';
import {bagGet,bagAdd} from './city-engine.js';
const fail=m=>{throw new Error(m);};
export const STATES=['idle','announce','podium','lights','thai','quiz','cut5','swim','final','count','result','party'];
const NEXT={lights:'thai',thai:'quiz',quiz:'cut5',cut5:'swim',swim:'final',final:'count',count:'result',result:'party',party:'idle'};
const r2=x=>Math.round(x*100)/100;
export const speedScore=(ms,maxMs)=>{if(!(ms>=0))return 0;const k=Math.max(0,Math.min(1,ms/maxMs));return r2(Math.max(0.5,9.99-k*8.5));};/* เร็วสุด 9.99 (ไม่มีใครได้ 10) ช้าสุด 0.5 */
export const TALENT_POOL=['corn','rose','egg','wine-rose','apple','cheese','tulip','lotus','truffle','peach','daisy','milk','lavender','cherry','orange','pumpkin'];
export const QUIZ_MAX_MS=30000,TALENT_MAX_MS=25000;
const hasOutfits=game=>{const bag=game.bag?.outfit||{};const ids=Object.keys(bag).filter(k=>OUTFITS[k]&&bag[k]>0);const has=f=>ids.some(k=>OUTFITS[k][f]);return {swim:has('swim'),thai:has('thai')};};
export const bestOf=(game,field)=>{const bag=game.bag?.outfit||{};const order={q:7,c4:6,c3:5,c2:4,c1:3,c0:2,s:1};let best=null,bs=-1;for(const [k,n] of Object.entries(bag)){const o=OUTFITS[k];if(!o||!(n>0)||!o[field])continue;const s=order[o.cls]||0;if(s>bs){bs=s;best=k;}}return best;};
export const total=c=>r2((c.scores.talent||[]).reduce((a,b)=>a+b,0)+(c.scores.quiz||[]).reduce((a,b)=>a+b,0)+(c.scores.final||[]).reduce((a,b)=>a+b,0));
export function pageantView(P,ctx){if(!P||P.state==='idle')return {state:'idle',startAt:P?.startAt||0};const now=ctx.now;const V={state:P.state,startAt:P.startAt,podiumOpenAt:P.startAt-3*60000,round:P.round||0,asked:(P.asked||[]).length,me:!!P.contestants?.[ctx.uid],n:Object.keys(P.contestants||{}).length,
 contestants:Object.fromEntries(Object.entries(P.contestants||{}).map(([u,c])=>[u,{no:c.no,name:c.name,o:c.o,oThai:c.oThai,oSwim:c.oSwim,tribe:c.tribe,alive:c.alive,gray:!!c.gray,garland:c.garland||0,total:P.state==='final'||P.state==='count'?null:total(c),talent:c.scores.talent,quiz:c.scores.quiz,finalN:(c.scores.final||[]).length,paid:!!c.paid}])),
 lights:P.lights?{out:P.lights.out,paid:P.lights.paid,survived:P.lights.survived||[]}:null,talent:P.talent?{round:P.talent.round,seq:P.talent.seq,startAt:P.talent.startAt,done:Object.keys(P.talent.done||{})}:null,
 quiz:P.quiz?{id:P.quiz.id,q:P.quiz.q,choices:P.quiz.choices,startAt:P.quiz.startAt,answered:Object.keys(P.quiz.answers||{}),kind:P.quiz.kind}:null,result:P.result||null,log:(P.log||[]).slice(-8),swimAt:P.swimAt||0,countAt:P.countAt||0,resultAt:P.resultAt||0,partyAt:P.partyAt||0,gift:P.gift||null,myGarlandAt:(P.garlandAt||{})[ctx.uid]||0};
 if(ctx.admin&&P.quiz)V.quiz.correct=P.quiz.correct;return V;}
/* ---------- แอดมิน ---------- */
export function pageantAdmin(P,ctx,input,rng=Math.random,bank=[]){P=structuredClone(P||{state:'idle'});const type=String(input.type||'');const now=ctx.now;P.log ||= [];const log=m=>{P.log.push({at:now,m});if(P.log.length>40)P.log.shift();};
 if(type==='schedule'){const at=Number(input.startAt)||0;if(at<now+60000)fail('ตั้งเวลาล่วงหน้าอย่างน้อย 1 นาที');P={state:'announce',startAt:at,contestants:{},round:0,asked:[],log:[],usedQ:P.usedQ||[]};log('ตั้งเวลาประกวด');return P;}
 if(type==='cancel'){P={state:'idle',startAt:0,usedQ:P.usedQ||[]};return P;}
 if(type==='start'){if(!['announce','podium'].includes(P.state))fail('ยังไม่ได้ตั้งเวลา');const n=Object.keys(P.contestants).length;if(n<2)fail('ผู้เข้าประกวดต้องอย่างน้อย 2 คน');
  /* รอบดับไฟ: สุ่มตกรอบ 8 คน (ถ้าคนน้อยกว่า 10 ตกรอบ n-2) */const ids=Object.keys(P.contestants).filter(u=>P.contestants[u].alive);const k=Math.min(PAGEANT.eliminate,Math.max(0,ids.length-2));const out=[];const pool=ids.slice();while(out.length<k){out.push(pool.splice(Math.floor(rng()*pool.length),1)[0]);}
  P.state='lights';P.lights={out,paid:[],survived:[],at:now};for(const u of out)P.contestants[u].alive=false;log('ดับไฟ ตกรอบ '+out.length+' คน');return P;}
 if(type==='next'){const nx=NEXT[P.state];if(!nx)fail('กดเริ่มก่อน');
  if(P.state==='lights'){P.state='thai';P.round=0;P.talent=null;}
  else if(P.state==='thai'){if((P.round||0)<PAGEANT.talentRounds)fail('ต้องจัดโชว์ความสามารถครบ '+PAGEANT.talentRounds+' รอบ');P.state='quiz';P.quiz=null;}
  else if(P.state==='quiz'){/* คัดเหลือ 5 */const alive=Object.entries(P.contestants).filter(([u,c])=>c.alive&&!c.gray).sort((a,b)=>total(b[1])-total(a[1]));alive.slice(PAGEANT.finalists).forEach(([u])=>{P.contestants[u].alive=false;});P.state='cut5';P.quiz=null;log('คัดเหลือ '+Math.min(5,alive.length)+' คน');}
  else if(P.state==='cut5'){P.state='swim';P.swimAt=now;}
  else if(P.state==='swim'){P.state='final';P.quiz=null;P.finalN=0;}
  else if(P.state==='final'){P.state='count';P.countAt=now;P.quiz=null;}
  else if(P.state==='count'){const rows=Object.entries(P.contestants).filter(([u,c])=>c.alive&&!c.gray).map(([u,c])=>({uid:u,no:c.no,name:c.name,o:c.o,tribe:c.tribe,total:total(c),garland:c.garland||0})).sort((a,b)=>b.total-a.total||a.no-b.no);P.result=rows.slice(0,5).map((r,i)=>({...r,rank:i+1}));P.state='result';P.resultAt=now;log('ประกาศผล');}
  else if(P.state==='result'){P.state='party';P.partyAt=now;}
  else if(P.state==='party'){P={state:'idle',startAt:0,last:{at:now,result:P.result},usedQ:[...(P.usedQ||[]),...(P.asked||[])].slice(-400)};}
  return P;}
 if(type==='talent'){if(P.state!=='thai')fail('ไม่ใช่รอบโชว์ความสามารถ');if((P.round||0)>=PAGEANT.talentRounds)fail('ครบ 3 รอบแล้ว');P.round=(P.round||0)+1;const seq=[];const pool=TALENT_POOL.slice();for(let i=0;i<6;i++)seq.push(pool.splice(Math.floor(rng()*pool.length),1)[0]);P.talent={round:P.round,seq,startAt:now,done:{}};log('โชว์ความสามารถรอบ '+P.round);return P;}
 if(type==='ask'){if(!['quiz','final'].includes(P.state))fail('ไม่ใช่รอบคำถาม');const q=bank.find(x=>x.id===String(input.id||''));if(!q)fail('ไม่พบคำถาม');if((P.asked||[]).includes(q.id))fail('ถามข้อนี้ไปแล้ว');if(P.state==='final'&&(P.finalN||0)>=3)fail('คำถามสุดท้ายครบ 3 ข้อแล้ว');
  /* สลับตัวเลือก ส่งไปหน้าเกมเฉพาะคำถาม+ตัวเลือก เฉลยอยู่ในเอกสารโลกแต่หน้าเกมไม่ได้รับ (pageantView ตัดออก) */const idx=[0,1,2,3];const sh=[];while(idx.length)sh.push(idx.splice(Math.floor(rng()*idx.length),1)[0]);
  P.quiz={id:q.id,q:q.q,choices:sh.map(i=>q.a[i]),correct:sh.indexOf(q.correct),startAt:now,answers:{},kind:P.state};P.asked=[...(P.asked||[]),q.id];if(P.state==='final')P.finalN=(P.finalN||0)+1;return P;}
 if(type==='askRandom'){/* สุ่มข้อที่ยังไม่เคยถาม (ข้ามรอบด้วย: usedQ ในเอกสารโลก) */if(!['quiz','final'].includes(P.state))fail('ไม่ใช่รอบคำถาม');if(P.state==='final'&&(P.finalN||0)>=3)fail('คำถามสุดท้ายครบแล้ว');const used=new Set([...(P.asked||[]),...(P.usedQ||[])]);const kind=P.state==='final'?'general':null;let pool=bank.filter(q=>!used.has(q.id)&&(!kind||q.kind===kind));if(!pool.length){pool=bank.filter(q=>!(P.asked||[]).includes(q.id)&&(!kind||q.kind===kind));P.usedQ=[];}if(!pool.length)fail('คำถามหมด เพิ่มในธนาคารคำถาม');const q=pool[Math.floor(rng()*pool.length)];return pageantAdmin(P,ctx,{type:'ask',id:q.id},rng,bank);}
 if(type==='closeQ'){if(!P.quiz)fail('ไม่มีคำถามเปิดอยู่');P.quiz=null;return P;}
 if(type==='forfeit'){const u=String(input.uid||'');if(P.contestants?.[u]){P.contestants[u].gray=true;P.contestants[u].alive=false;log(P.contestants[u].name+' สละสิทธิ์');}return P;}
 fail('รายการแอดมินไม่ถูกต้อง');}
/* ---------- ผู้เล่น ---------- */
export function pageantAction(P,game,ctx,input){P=structuredClone(P||{state:'idle'});const type=String(input.type||'');const now=ctx.now;const uid=ctx.uid;const me=P.contestants?.[uid];
 if(type==='podium'){if(ctx.admin)fail('แอดมินเป็นพิธีกร');if(!['announce','podium'].includes(P.state))fail('ยังไม่เปิดให้เลือกโพเดียม');if(now<P.startAt-3*60000)fail('เปิดให้แย่งโพเดียมก่อนเริ่ม 3 นาที');if(now>P.startAt+10*60000)fail('ปิดรับแล้ว');
  const no=Number(input.no)|0;if(no<1||no>PAGEANT.podiums)fail('เลือกเบอร์ 1–16');if(me)fail('คุณอยู่เบอร์ '+me.no+' แล้ว');const of=hasOutfits(game);if(!of.swim||!of.thai)fail('ขาดชุด: '+[!of.swim?'ชุดว่ายน้ำ':'',!of.thai?'ชุดไทย':''].filter(Boolean).join(' · ')+' (ต้องมีทั้งสองชุดก่อนเข้าประกวด)');
  if(Object.values(P.contestants||{}).some(c=>c.no===no))fail('เบอร์นี้มีคนแล้ว');P.state='podium';P.contestants ||= {};P.contestants[uid]={no,name:ctx.name||'ผู้เล่น',o:game.sub?.char?.wear||'punk',oThai:bestOf(game,'thai')||game.sub?.char?.wear||'punk',oSwim:bestOf(game,'swim')||game.sub?.char?.wear||'punk',/* ระบบเปลี่ยนชุดให้เองตามรอบ */tribe:game.sub?.char?.tribe||'pink',alive:true,scores:{talent:[],quiz:[],final:[]},garland:0,at:now};return {P,no};}
 if(type==='leave'){if(!me)fail('ไม่ได้เข้าประกวด');if(['announce','podium'].includes(P.state)){delete P.contestants[uid];}else{me.gray=true;me.alive=false;}return {P};}
 if(!me)fail('ไม่ได้เข้าประกวด');
 if(type==='pay'){/* รอบดับไฟ: คนตกรอบจ่ายเร็วสุด 3 คนแรกอยู่ต่อ · ช้ากว่าได้ของคืน (ไม่หักเลย) */if(P.state!=='lights')fail('ไม่ใช่รอบดับไฟ');if(!P.lights.out.includes(uid))fail('คุณไม่ได้ตกรอบ');if(me.paid)fail('จ่ายแล้ว');
  for(const [k,n] of Object.entries(PAGEANT.payItems))if(bagGet(game,k)<n)fail('ของไม่พอ: '+k+' '+bagGet(game,k)+'/'+n);const wines=['wine-moon','wine-rose','wine-blood','wine-eclipse'];const haveW=wines.reduce((a,k)=>a+bagGet(game,k),0);if(haveW<PAGEANT.payWine)fail('ไวน์ไม่พอ '+haveW+'/'+PAGEANT.payWine);
  if(P.lights.paid.length>=3)fail('มีคนจ่ายครบ 3 คนแล้ว ของไม่ถูกหัก');
  for(const [k,n] of Object.entries(PAGEANT.payItems))bagAdd(game,k,-n);let left=PAGEANT.payWine;for(const k of wines){const t=Math.min(left,bagGet(game,k));if(t>0){bagAdd(game,k,-t);left-=t;}}
  me.paid=true;me.alive=true;P.lights.paid.push(uid);P.lights.survived=P.lights.paid.slice();return {P,survived:true};}
 if(type==='talent'){if(P.state!=='thai'||!P.talent)fail('ไม่ใช่รอบโชว์');if(!me.alive)fail('ตกรอบแล้ว');if(P.talent.done[uid]!==undefined)fail('ส่งรอบนี้แล้ว');const seq=Array.isArray(input.seq)?input.seq.map(String):[];const ok=seq.length===P.talent.seq.length&&seq.every((k,i)=>k===P.talent.seq[i]);const ms=now-P.talent.startAt;const sc=(ok&&ms>=1500)?speedScore(ms,TALENT_MAX_MS):0;/* เร็วกว่า 1.5 วิ = สคริปต์ → 0 */P.talent.done[uid]=sc;me.scores.talent[P.talent.round-1]=sc;return {P,score:sc,ok,ms};}
 if(type==='answer'){if(!P.quiz)fail('ยังไม่มีคำถาม');if(!me.alive)fail('ตกรอบแล้ว');if(P.quiz.answers[uid]!==undefined)fail('ตอบข้อนี้แล้ว');const i=Number(input.i)|0;const ms=now-P.quiz.startAt;const ok=i===P.quiz.correct&&ms<=QUIZ_MAX_MS;const sc=ok?speedScore(ms,QUIZ_MAX_MS):0;P.quiz.answers[uid]={i,ms,sc};const list=P.quiz.kind==='final'?me.scores.final:me.scores.quiz;list.push(sc);return {P,score:sc,ok,ms,correct:P.quiz.correct};}
 fail('รายการไม่ถูกต้อง');}
/* คนดูซื้อพวงมาลัยให้ผู้ประกวด (กุศล) */
export function garland(P,game,ctx,toUid){P=structuredClone(P);const c=P.contestants?.[toUid];if(!c)fail('ไม่พบผู้ประกวด');if(!STATES.slice(2).includes(P.state)||P.state==='idle')fail('ยังไม่เริ่มประกวด');if((game.merit||0)<PAGEANT.garland)fail('กุศลไม่พอ ('+PAGEANT.garland.toLocaleString('en-US')+')');const now=ctx.now||Date.now();const GAP=180000;/* กันกดรัว: พวงมาลัย 1 พวง/3 นาที/คน */P.garlandAt=P.garlandAt||{};const last=P.garlandAt[ctx.uid]||0;if(now-last<GAP){const sec=Math.ceil((GAP-(now-last))/1000);fail('ส่งพวงมาลัยได้อีกใน '+Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')+' นาที');}game.merit-=PAGEANT.garland;c.garland=(c.garland||0)+1;P.garlandAt[ctx.uid]=now;P.gift={from:ctx.name||'ผู้ชม',to:c.name,no:c.no,at:now};return P;}
/* ธนาคารคำถาม (แอดมิน): ตรวจรูปแบบ */
export function questionDoc(input,ctx){const q=String(input.q||'').trim().slice(0,200);const a=(Array.isArray(input.a)?input.a:[]).map(x=>String(x||'').trim().slice(0,80));const correct=Number(input.correct)|0;if(q.length<3)fail('พิมพ์คำถาม');if(a.length!==4||a.some(x=>!x))fail('ต้องมีคำตอบ 4 ข้อ');if(correct<0||correct>3)fail('เลือกข้อที่ถูก');const kind=input.kind==='general'?'general':'yainoo';return {q,a,correct,kind,by:ctx.uid,at:ctx.now};}
