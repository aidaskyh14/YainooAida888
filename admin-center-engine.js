import {CATALOG} from './catalog.js?h=f37a59df';
const fail=(message,code='invalid-argument')=>{throw Object.assign(new Error(message),{code});};
const cleanText=(s,max)=>typeof s==='string'?s.slice(0,max):'';
export async function adminCenter(db,uid,input,fields){
 const [owner,profile]=await Promise.all([db.doc('admins/'+uid).get(),db.doc('players/'+uid).get()]);
 if(!owner.exists)fail('เฉพาะบัญชีแอดมิน','permission-denied');
 if(!profile.exists||(input.type!=='status'&&profile.data().session!==input.session))fail('บัญชีแอดมินเปิดอยู่อีกเครื่อง กดรีเฟรชหน้านี้แล้วส่งใหม่ (ของยังไม่ถูกส่ง)','failed-precondition');
 const pref=db.doc('adminPreferences/'+uid),state=db.doc('adminGiftRuns/'+uid);
 if(input.type==='status'){
  /* fix17e: โหลดหน้าแอดมินได้เสมอ — ส่วนไหนอ่านไม่ได้ก็ข้ามส่วนนั้น (ไม่ให้ทั้งหน้าพัง) · ส่งกลับเป็นข้อมูลธรรมดาเท่านั้น */
  const safe=async(f,fb)=>{try{return await f();}catch(e){console.error('adminCenter status part failed',e.code||'',e.message);return fb;}};
  const ms=v=>typeof v?.toMillis==='function'?v.toMillis():Number(v?.ms??v)||0;
  const plain=v=>{try{return JSON.parse(JSON.stringify(v??null,(k,x)=>x&&typeof x==='object'&&typeof x.toMillis==='function'?x.toMillis():x));}catch(e){return null;}};
  const [ps,p,run,logs]=await Promise.all([db.collection('players').limit(5000).get(),safe(()=>pref.get(),null),safe(()=>state.get(),null),safe(()=>db.collection('adminLog').orderBy('at','desc').limit(30).get(),{docs:[]})]);
  const history=(logs?.docs||[]).map(d=>{try{const x=d.data()||{};return plain({...x,at:ms(x.at),expireAt:ms(x.expireAt)});}catch(e){return null;}}).filter(Boolean);
  let pendingRun=run?.exists&&run.data().status==='sending'?run.data():null;
  if(pendingRun){delete pendingRun.at;delete pendingRun.updatedAt;pendingRun=plain(pendingRun);if(!pendingRun?.body||!Array.isArray(pendingRun.uids))pendingRun=null;}
  const pd=p?.exists?p.data():{};
  const players=ps.docs.map(d=>{const x=d.data()||{};return {uid:d.id,name:String(x.name??'ผู้เล่น').slice(0,60)||'ผู้เล่น',approval:typeof x.approval==='string'?x.approval:'approved'};}).filter(x=>x.approval!=='rejected').sort((a,b)=>a.name.localeCompare(b.name,'th'));
  return {players,templates:Array.isArray(pd.templates)?plain(pd.templates):[],favorites:Array.isArray(pd.favorites)?pd.favorites.filter(k=>typeof k==='string'):[],pendingRun,history};
 }
 if(input.type==='preferences'){
  if(!Array.isArray(input.templates)||input.templates.length>30||!Array.isArray(input.favorites)||input.favorites.length>300||JSON.stringify(input).length>100000)fail('รายการโปรดหรือแพ็กเกจเกินขอบเขต');
  await pref.set({templates:input.templates,favorites:input.favorites,updatedAt:fields.timestamp()});return {saved:true};
 }
 if(input.type!=='send')fail('ไม่พบคำสั่งแอดมิน');
 const req=input.request||{},id=req.id;
 if(typeof id!=='string'||!/^[-a-zA-Z0-9_]{1,100}$/.test(id))fail('รหัสรายการส่งไม่ถูกต้อง');
 const log=db.doc('adminLog/'+id);let operation,prior;
 await db.runTransaction(async tx=>{
  const [current,receipt]=await Promise.all([tx.get(state),tx.get(log)]);
  if(receipt.exists){if(receipt.data().sender&&receipt.data().sender!==uid)fail('รายการนี้ไม่ใช่ของแอดมินบัญชีนี้');prior=receipt.data();return;}
  if(current.exists&&current.data().status==='sending'){operation=current.data();return;}
  const uids=Array.isArray(req.uids)?[...new Set(req.uids)]:[];
  if(!uids.length||uids.length>5000||uids.some(u=>typeof u!=='string'||!/^[-a-zA-Z0-9_]{1,128}$/.test(u)))fail('เลือกผู้รับ 1–5,000 คน');
  const b=req.body||{},items=b.items||{};if(Object.keys(items).length>250||Object.keys(items).some(k=>!CATALOG.some(c=>c.k===k)))fail('มีไอเทมที่ไม่อยู่ในระบบ');
  for(const n of [b.kusal||0,b.coins||0,...Object.values(items)])if(!Number.isSafeInteger(n)||n<0)fail('จำนวนของต้องเป็นจำนวนเต็มตั้งแต่ศูนย์');
  const packs=Object.fromEntries(uids.map(u=>[u,req.packs?.[u]??1]));
  for(const n of Object.values(packs))if(!Number.isSafeInteger(n)||n<1||n>1000000||[b.kusal||0,b.coins||0,...Object.values(items)].some(q=>!Number.isSafeInteger(q*n)))fail('จำนวนแพ็กไม่ถูกต้อง');
  const profiles=await Promise.all(uids.map(u=>tx.get(db.doc('players/'+u))));if(profiles.some(d=>!d.exists))fail('ไม่พบสมาชิกบางคน กรุณาโหลดรายชื่อใหม่');
  if(profiles.some(d=>d.data().approval==='rejected'))fail('มีบัญชีที่ถูกปฏิเสธ กรุณาโหลดรายชื่อใหม่และเลือกผู้รับอีกครั้ง','failed-precondition');
  const body={title:cleanText(b.title,200)||'ของขวัญจากยัยหนู',msg:cleanText(b.msg,2000),icon:cleanText(b.icon,30)||'🎁',from:'ยัยหนู',kusal:b.kusal||0,coins:b.coins||0,items};
  operation={sender:uid,operationId:id,uids,names:profiles.map(d=>d.data().name||'ผู้เล่น').slice(0,50),packs,body,done:[],chunk:150,status:'sending',at:fields.timestamp()};tx.set(state,operation);
 });
 if(prior)return {count:prior.count,newlySent:0};
 let newlySent=0;const chunk=operation.chunk||180;
 for(let start=0;start<operation.uids.length;start+=chunk){
  await db.runTransaction(async tx=>{
   const current=await tx.get(state);const op=current.data();if(op.operationId!==operation.operationId)fail('รายการส่งถูกเปลี่ยน กรุณาเปิดหน้าแอดมินใหม่','failed-precondition');if(op.done.includes(start))return;
   const recipients=op.uids.slice(start,start+chunk);
   for(const [i,to]of recipients.entries()){
    const n=op.packs[to];tx.set(db.doc('mail/'+to+'/items/'+op.operationId+'-'+(start+i)),{...op.body,kusal:op.body.kusal*n,coins:op.body.coins*n,items:Object.fromEntries(Object.entries(op.body.items).map(([k,q])=>[k,q*n])),createdAt:fields.timestamp(),expireAt:fields.expires(Date.now()+60*864e5)});
    tx.update(db.doc('players/'+to),{mailCount:fields.increment(1),...(Object.keys(op.body.items||{}).some(k=>k.startsWith('demon-'))?{dmMail:true}:{})});/* fix17 🎭 ไอเทมปีศาจในไปรษณีย์ย้ายเข้ากระเป๋าเองหลัง 24 ชม. */
   }
   const done=[...op.done,start],status=done.length===Math.ceil(op.uids.length/chunk)?'done':'sending';tx.update(state,{done,status,updatedAt:fields.timestamp()});
   if(status==='done')tx.set(db.doc('adminLog/'+op.operationId),{sender:uid,at:fields.timestamp(),expireAt:fields.expires(Date.now()+60*864e5),type:'gift',packs:op.packs,to:op.names,count:op.uids.length,...op.body});
  });
  newlySent+=operation.uids.slice(start,start+chunk).length;
 }
 return {count:operation.uids.length,newlySent};
}
