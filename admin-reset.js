/* S4 ข้อ 162/162b/157 🧹 เริ่มศูนย์ผู้เล่น (เซิร์ฟเวอร์ · แอดมินเท่านั้น)
   type:'status'  → ทำรีเซ็ตทั้งหมดไปหรือยัง (world/season.resetAt) + บันทึกล่าสุด
   type:'preview' → ดูก่อน (อ่านอย่างเดียว): รายคน ขนาดก่อน→หลัง · จำนวนส่วนเซฟ · ของในกระเป๋าตรงทุกชิ้นไหม
   type:'run'     → ล้างจริง: ต้องพิมพ์ confirm='รีเซ็ต' · สำรองก่อนทุกคน (resetBackups/{uid} + /parts/{id}) · ทั้งหมดทำได้ครั้งเดียวต่อซีซั่น (force=true ข้ามได้)
   ต่อคน: ล้างจดหมาย · ledger · privateAtm (PIN/ประวัติ ATM) · เหรียญ 0 · x17 · session ใหม่ (เครื่องที่เปิดค้างต้องเข้าใหม่) · ส่วนเซฟเหลือตาม resetGame */
import {splitGame,joinGame,bytes} from './save-schema.js?h=eef4832b';
import {resetGame,bagSummary,bagDiff} from './reset-engine.js?h=47933142';
const fail=(message,code='invalid-argument')=>{throw Object.assign(new Error(message),{code});};
const UID=/^[-a-zA-Z0-9_]{1,128}$/;
async function loadParts(db,uid){const s=await db.collection('players/'+uid+'/saves').get();const parts=new Map();for(const d of s.docs||[])parts.set(d.id,d.data());return parts;}
function analyze(parts){const game=joinGame(parts.values());const before=[...parts.values()].reduce((a,p)=>a+bytes(p.payload||''),0);
 const ng=resetGame(game),sp=splitGame(ng),after=[...sp.values()].reduce((a,p)=>a+bytes(p.payload),0);
 const sb=bagSummary(game),sa=bagSummary(ng);return {game,ng,sp,before,after,nBefore:parts.size,nAfter:sp.size,diff:bagDiff(sb,sa),bagN:Object.keys(sb).length,merit:Number(game.merit)||0};}
async function delAll(db,path){const s=await db.collection(path).get();const docs=s.docs||[];for(let i=0;i<docs.length;i+=40)await Promise.all(docs.slice(i,i+40).map(d=>db.doc(path+'/'+d.id).delete()));return docs.length;}
async function resetOne(db,uid,name,fields,by){
 const parts=await loadParts(db,uid);const a=analyze(parts);
 if(a.diff.length)fail('กระเป๋าของ '+name+' ไม่ตรงหลังรีเซ็ต ('+a.diff.slice(0,3).map(d=>d[0]).join(', ')+') หยุดทำ','failed-precondition');
 const rootSnap=await db.doc('players/'+uid).get();if(!rootSnap.exists)fail('ไม่พบผู้เล่น '+name);
 const now=Date.now();
 /* 1) สำรอง */
 await db.doc('resetBackups/'+uid).set({at:now,by,name,root:JSON.parse(JSON.stringify(rootSnap.data(),(k,v)=>v&&typeof v==='object'&&typeof v.toMillis==='function'?v.toMillis():v)),nParts:parts.size,bytes:a.before});
 const pe=[...parts.entries()];for(let i=0;i<pe.length;i+=20)await Promise.all(pe.slice(i,i+20).map(([id,p])=>db.doc('resetBackups/'+uid+'/parts/'+id).set({path:p.path,system:p.system,payload:p.payload,rev:p.rev||0})));
 /* 2) ล้างของนอกเซฟ */
 const mails=await delAll(db,'mail/'+uid+'/items');await delAll(db,'players/'+uid+'/ledger');
 try{await db.doc('privateAtm/'+uid).delete();}catch(e){}
 /* 3) เขียนเซฟใหม่ในทรานแซกชันเดียว */
 await db.runTransaction(async tx=>{
  const root=await tx.get(db.doc('players/'+uid));if(!root.exists)fail('ไม่พบผู้เล่น '+name);
  const cur=await tx.get(db.collection('players/'+uid+'/saves'));
  for(const d of cur.docs||[])if(!a.sp.has(d.id))tx.delete(db.doc('players/'+uid+'/saves/'+d.id));
  let max=0,maxName='';
  for(const [id,p] of a.sp){const b=bytes(p.payload);if(b>max){max=b;maxName=id;}tx.set(db.doc('players/'+uid+'/saves/'+id),{path:p.path,system:p.system,payload:p.payload,rev:((parts.get(id)||{}).rev||0)+1,by:'reset',updatedAt:fields.timestamp()});}
  tx.update(db.doc('players/'+uid),{coins:0,mailCount:0,displayMerit:0,partCount:a.sp.size,maxPartBytes:max,maxPartName:maxName,saveRevision:(root.data().saveRevision||0)+1,by:'reset',session:'reset-'+now,ledgerPending:false,dmc:0,dmp:false,dmMail:false,x17:{},resetAt:now,resetBy:by});
 });
 return {uid,name,before:a.before,after:a.after,nBefore:a.nBefore,nAfter:a.nAfter,bagN:a.bagN,merit:a.merit,mails};}
export async function adminReset(db,uid,input,fields){
 const [owner,profile]=await Promise.all([db.doc('admins/'+uid).get(),db.doc('players/'+uid).get()]);
 if(!owner.exists)fail('เฉพาะบัญชีแอดมิน','permission-denied');
 if(!profile.exists||(input.type!=='status'&&profile.data().session!==input.session))fail('บัญชีแอดมินเปิดอยู่อีกเครื่อง กดรีเฟรชหน้านี้แล้วส่งใหม่','failed-precondition');
 const seasonRef=db.doc('world/season'),ss=await seasonRef.get(),sd=ss.exists?ss.data():{};
 if(input.type==='status')return {resetAt:sd.resetAt||0,resetBy:sd.resetBy||'',resetCount:sd.resetCount||0,resetNames:sd.resetNames||[]};
 const admins=new Set((await db.collection('admins').limit(200).get()).docs.map(d=>d.id));
 const ps=(await db.collection('players').limit(5000).get()).docs.map(d=>({uid:d.id,...(d.data()||{})}));
 let targets;
 if(input.all)targets=ps.filter(p=>!admins.has(p.uid)&&p.approval!=='rejected');
 else{const t=String(input.uid||'');if(!UID.test(t))fail('เลือกผู้เล่น');const p=ps.find(x=>x.uid===t);if(!p)fail('ไม่พบผู้เล่น');targets=[p];}
 const nm=p=>String(p.name||'ผู้เล่น').slice(0,60);
 if(input.type==='preview'){
  const rows=[];for(const p of targets){try{const parts=await loadParts(db,p.uid);const a=analyze(parts);rows.push({uid:p.uid,name:nm(p),merit:a.merit,before:a.before,after:a.after,nBefore:a.nBefore,nAfter:a.nAfter,bagN:a.bagN,ok:!a.diff.length,diff:a.diff.slice(0,10),mails:Number(p.mailCount)||0,coins:Number(p.coins)||0});}
   catch(e){rows.push({uid:p.uid,name:nm(p),error:String(e&&e.message||e).slice(0,200),ok:false});}}
  const tot={n:rows.length,before:rows.reduce((a,r)=>a+(r.before||0),0),after:rows.reduce((a,r)=>a+(r.after||0),0),bad:rows.filter(r=>!r.ok).length};
  return {rows,tot,resetAt:sd.resetAt||0};}
 if(input.type==='run'){
  if(input.confirm!=='รีเซ็ต')fail('พิมพ์คำว่า รีเซ็ต เพื่อยืนยัน');
  if(input.all&&sd.resetAt&&!input.force)fail('รีเซ็ตทั้งหมดทำไปแล้วเมื่อ '+new Date(sd.resetAt+7*3600000).toISOString().slice(0,16).replace('T',' ')+' (ทำได้ครั้งเดียวต่อซีซั่น)','failed-precondition');
  const rows=[],errors=[];
  for(const p of targets){try{rows.push(await resetOne(db,p.uid,nm(p),fields,uid));}catch(e){errors.push({uid:p.uid,name:nm(p),error:String(e&&e.message||e).slice(0,200)});}}
  const now=Date.now();
  if(input.all)await seasonRef.set({resetAt:now,resetBy:uid,resetCount:rows.length,resetNames:rows.map(r=>r.name).slice(0,100)},{merge:true});
  await db.doc('adminLog/reset-'+now).set({sender:uid,at:fields.timestamp(),type:'reset',all:!!input.all,count:rows.length,to:rows.map(r=>r.name).slice(0,100),errors:errors.length,title:'🧹 เริ่มศูนย์ผู้เล่น'+(input.all?'ทั้งหมด':'รายคน'),msg:rows.length+' คน'+(errors.length?' · ผิดพลาด '+errors.length:'')});
  return {rows,errors,resetAt:input.all?now:(sd.resetAt||0)};}
 fail('ไม่พบคำสั่ง');
}
