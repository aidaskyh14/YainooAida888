/* Bounded collection receipts. No clock writes and no writes to the visited owner. */
import {seeded} from './campaigns-engine.js?h=a073b41e';
/* S4 รอบ 3 ข้อ 13: ไม้/หิน/หญ้าขึ้นเร็วขึ้น — ฟาร์มตัวเองทุก 10 นาที (ขึ้นแน่ 2–4 ชิ้น) · ฟาร์มเพื่อนทุก 20 นาที (2–5 ชิ้น มีไม้/หินด้วย) */
export const DROP_OWN_MS=10*60000,DROP_FRIEND_MS=20*60000;
export function farmDropRows(owner,farm,now,friend=false){
 const period=friend?DROP_FRIEND_MS:DROP_OWN_MS,epoch=Math.floor(now/period),rng=seeded(owner+'|'+farm+'|'+epoch+'|'+(friend?'friend':'own'));
 /* fix36: เกิดมากขึ้น (เรา 4–7 · เพื่อน 4–8) + เหล็ก/เชือก */const n=friend?4+Math.floor(rng()*5):4+Math.floor(rng()*4),rows=[];
 for(let i=0;i<n;i++){const kr=rng()*100,kind=kr<50?'grass':kr<70?'wood':kr<85?'stone':kr<93?'steel':'rope';let color='green',w=rng()*100;for(const[k,q]of [['green',40],['yellow',25],['red',20],['pink',10],['blue',5]]){w-=q;if(w<0){color=k;break;}}rows.push({id:i,group:kind==='grass'?'grass':'forest',key:kind==='grass'?color:kind,quantity:kind==='grass'?5+Math.floor(rng()*11):(kind==='steel'||kind==='rope')?3+Math.floor(rng()*6):10+Math.floor(rng()*11),position:i%5});}
 return {epoch,period,rows,nextAt:(epoch+1)*period};
}
export function farmDropsAction(account,ctx,input){
 const game=structuredClone(account),farm=input.farm??1,owner=input.owner||ctx.uid,friend=owner!==ctx.uid;if(!Number.isInteger(farm)||farm<1||farm>4||typeof owner!=='string'||!/^[-\w]{1,128}$/.test(owner))throw Error('ฟาร์มไม่ถูกต้อง');
 game.sub ||= {};const state=game.sub.farmdrops ||= {claims:{}};state.claims ||= {};
 for(const[k,v]of Object.entries(state.claims))if(v.until<=ctx.now)delete state.claims[k];
 const view=farmDropRows(owner,farm,ctx.now,friend),key=owner+'-'+farm+'-'+(friend?'f':'o'),prior=state.claims[key],taken=prior?.epoch===view.epoch?prior.ids:[];
 let available=view.rows.filter(r=>!taken.includes(r.id));const collected=[];
 /* S4 ข้อ 13: กระทงรางวัล 1 ครั้งต่อช่อง 5 นาที (เวลาไทย) ผล +100/−100 สุ่มที่เซิร์ฟเวอร์ (60% ได้) */
 if(input.type==='krathong'){const slot=Math.floor((ctx.now+7*3600000)/300000);if(input.slot!=null&&Number(input.slot)!==slot)throw Error('กระทงลำนี้หมดเวลาแล้ว');
  const kk='kt-'+slot;if(state.claims[kk])throw Error('ช่วงนี้เก็บกระทงรางวัลไปแล้ว รออีกสักครู่นะ');
  const r=seeded(ctx.uid+'|kt|'+slot)();const delta=r<.6?100:-100;game.merit=Math.max(0,(Number(game.merit)||0)+delta);state.claims[kk]={epoch:slot,ids:[],until:(slot+1)*300000-7*3600000+300000};
  return {game,view:{...view,rows:available,owner,farm,friend},collected,krathong:{delta,slot}};}
 if(input.type==='collect'){
  if(input.epoch!==view.epoch)throw Error('ของรอบเดิมหมดเวลาแล้ว กรุณาดูรอบใหม่');
  const ids=input.all?available.map(r=>r.id):[input.index];if(ids.some(i=>!Number.isInteger(i)||!available.some(r=>r.id===i)))throw Error('เก็บของชิ้นนี้แล้วหรือยังไม่มีของ');
  for(const row of available.filter(r=>ids.includes(r.id))){game.bag ||= {};game.bag[row.group] ||= {};game.bag[row.group][row.key]=(game.bag[row.group][row.key]||0)+row.quantity;collected.push(row);}
  if(collected.length)state.claims[key]={epoch:view.epoch,ids:[...taken,...collected.map(r=>r.id)],until:view.nextAt};
  if(Object.keys(state.claims).length>800)throw Error('จำนวนสวนที่เยี่ยมในรอบนี้เกินขอบเขต');available=available.filter(r=>!ids.includes(r.id));
 }else if(input.type!=='status')throw Error('คำสั่งเก็บของไม่ถูกต้อง');
 return {game,view:{...view,rows:available,owner,farm,friend},collected};
}

/* fix36 🗑️ ขยะหน้าบ้านเพื่อน: ทิ้งได้ตอนเยี่ยมเท่านั้น 10 ชิ้น/ชม./คน · หน้าบ้านเก็บสูงสุด 60 ชิ้น · หายเองใน 24 ชม. · เจ้าของกวาดได้ +300/ชิ้น · ไม่บอกชื่อคนทิ้ง */
export const TRASH_KINDS=['can','bottle','banana','paper','fishbone','box','bag','cup','apple'],TRASH_PER_HOUR=10,TRASH_MAX=60,TRASH_TTL=24*3600000,TRASH_SWEEP_MERIT=300;
export function trashLive(view,now){const items=Array.isArray(view&&view.items)?view.items:[];return items.filter(t=>t&&typeof t==='object'&&Number.isFinite(t.at)&&now-t.at<TRASH_TTL&&now>=t.at-60000);}
export function trashQuota(game,now){game.sub ||= {};const fd=game.sub.farmdrops ||= {claims:{}};const st=fd.trash ||= {};const h=Math.floor(now/3600000);if(st.h!==h){st.h=h;st.n=0;}return {left:Math.max(0,TRASH_PER_HOUR-(Number(st.n)||0)),st,resetAt:(h+1)*3600000};}
export function trashThrow(game,view,{actor,owner,now,rng,kind}){if(!owner||owner===actor)throw Error('ทิ้งขยะได้เฉพาะตอนไปเยี่ยมบ้านเพื่อน');const q=trashQuota(game,now);if(q.left<=0)throw Error('ชั่วโมงนี้ทิ้งขยะครบ '+TRASH_PER_HOUR+' ชิ้นแล้ว รออีก '+Math.max(1,Math.ceil((q.resetAt-now)/60000))+' นาที');
 const k=TRASH_KINDS.includes(kind)?kind:TRASH_KINDS[Math.floor(rng()*TRASH_KINDS.length)];let items=trashLive(view,now);if(items.length>=TRASH_MAX)items=items.slice(items.length-TRASH_MAX+1);
 const id='t'+now.toString(36)+Math.floor(rng()*46656).toString(36);items.push({id,k,at:now,by:actor,s:Math.floor(rng()*1e6)});q.st.n=(Number(q.st.n)||0)+1;return {items,left:q.left-1,id,k};}
export function trashSweep(game,view,{owner,actor,now,id}){if(owner!==actor)throw Error('ปัดกวาดได้เฉพาะเจ้าของบ้าน');const items=trashLive(view,now);const take=id?items.filter(t=>t.id===id):items;if(!take.length)throw Error('ไม่มีขยะให้กวาดแล้ว');const gain=take.length*TRASH_SWEEP_MERIT;game.merit=(Number(game.merit)||0)+gain;return {items:items.filter(t=>!take.includes(t)),n:take.length,gain};}
export const trashPublic=items=>items.map(t=>({id:t.id,k:t.k,at:t.at,s:t.s}));
