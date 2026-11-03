/* Bounded collection receipts. No clock writes and no writes to the visited owner. */
import {seeded} from './campaigns-engine.js?h=4c0a763a';
export const DROP_OWN_MS=20*60000,DROP_FRIEND_MS=45*60000;
export function farmDropRows(owner,farm,now,friend=false){
 const period=friend?DROP_FRIEND_MS:DROP_OWN_MS,epoch=Math.floor(now/period),rng=seeded(owner+'|'+farm+'|'+epoch+'|'+(friend?'friend':'own'));
 const n=friend?2+Math.floor(rng()*4):rng()<.5?1+Math.floor(rng()*3):0,rows=[];
 for(let i=0;i<n;i++){const kind=friend?'grass':rng()<.6?'grass':rng()<.5?'wood':'stone';let color='green',w=rng()*100;for(const[k,q]of [['green',40],['yellow',25],['red',20],['pink',10],['blue',5]]){w-=q;if(w<0){color=k;break;}}rows.push({id:i,group:kind==='grass'?'grass':'forest',key:kind==='grass'?color:kind,quantity:kind==='grass'?5+Math.floor(rng()*11):10+Math.floor(rng()*11),position:i});}
 return {epoch,period,rows,nextAt:(epoch+1)*period};
}
export function farmDropsAction(account,ctx,input){
 const game=structuredClone(account),farm=input.farm??1,owner=input.owner||ctx.uid,friend=owner!==ctx.uid;if(!Number.isInteger(farm)||farm<1||farm>4||typeof owner!=='string'||!/^[-\w]{1,128}$/.test(owner))throw Error('ฟาร์มไม่ถูกต้อง');
 game.sub ||= {};const state=game.sub.farmdrops ||= {claims:{}};state.claims ||= {};
 for(const[k,v]of Object.entries(state.claims))if(v.until<=ctx.now)delete state.claims[k];
 const view=farmDropRows(owner,farm,ctx.now,friend),key=owner+'-'+farm+'-'+(friend?'f':'o'),prior=state.claims[key],taken=prior?.epoch===view.epoch?prior.ids:[];
 let available=view.rows.filter(r=>!taken.includes(r.id));const collected=[];
 if(input.type==='collect'){
  if(input.epoch!==view.epoch)throw Error('ของรอบเดิมหมดเวลาแล้ว กรุณาดูรอบใหม่');
  const ids=input.all?available.map(r=>r.id):[input.index];if(ids.some(i=>!Number.isInteger(i)||!available.some(r=>r.id===i)))throw Error('เก็บของชิ้นนี้แล้วหรือยังไม่มีของ');
  for(const row of available.filter(r=>ids.includes(r.id))){game.bag ||= {};game.bag[row.group] ||= {};game.bag[row.group][row.key]=(game.bag[row.group][row.key]||0)+row.quantity;collected.push(row);}
  if(collected.length)state.claims[key]={epoch:view.epoch,ids:[...taken,...collected.map(r=>r.id)],until:view.nextAt};
  if(Object.keys(state.claims).length>800)throw Error('จำนวนสวนที่เยี่ยมในรอบนี้เกินขอบเขต');available=available.filter(r=>!ids.includes(r.id));
 }else if(input.type!=='status')throw Error('คำสั่งเก็บของไม่ถูกต้อง');
 return {game,view:{...view,rows:available,owner,farm,friend},collected};
}
