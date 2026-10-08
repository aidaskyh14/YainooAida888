import {doc,runTransaction,serverTimestamp,increment,Timestamp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
const CHUNK=180;
const reject=m=>{throw new Error(m);};
export async function deliverAdminGift(db,adminUid,request) {
  const stateRef=doc(db,'adminGiftRuns',adminUid);
  let operation,alreadyDelivered;
  // รายการที่ค้างมี priority: ใช้รายการเดิมบนคลาวด์ แม้เปิดใหม่หรือคำขอก่อนหน้าหลุดกลางทาง
  await runTransaction(db,async tx=>{
    const [current,receipt]=await Promise.all([tx.get(stateRef),tx.get(doc(db,'adminLog',request.id))]);
    if(receipt.exists()){alreadyDelivered=receipt.data();return;}
    if(current.exists()&&(current.data().status==='sending'||current.data().operationId===request.id)){operation=current.data();return;}
    const uids=[...new Set(request.uids)];
    if(!uids.length||uids.length>5000)reject('เลือกผู้รับ 1–5,000 คน');
    if(Object.keys(request.body.items||{}).length>250)reject('รายการไอเทมมากเกินไป');
    for(const n of [request.body.kusal||0,request.body.coins||0,...Object.values(request.body.items||{})])if(!Number.isSafeInteger(n)||n<0)reject('จำนวนของต้องเป็นจำนวนเต็มตั้งแต่ศูนย์');
    operation={operationId:doc(db,'adminLog',request.id).id,uids,names:request.names.slice(0,50),body:request.body,done:[],status:'sending',sender:adminUid,at:serverTimestamp()};
    tx.set(stateRef,operation);
  });
  if(alreadyDelivered)return {count:alreadyDelivered.count,body:alreadyDelivered,uids:[],newlySent:0};
  let newlySent=0;
  for(let start=0;start<operation.uids.length;start+=CHUNK) {
    let sent=0;
    await runTransaction(db,async tx=>{
      sent=0;
      const snap=await tx.get(stateRef);if(!snap.exists())reject('ไม่พบรายการส่ง');
      const op=snap.data();if(op.operationId!==operation.operationId)reject('รายการส่งถูกเปลี่ยน กรุณาเปิดหน้าแอดมินใหม่');
      if(op.done.includes(start))return;
      if(op.status!=='sending')reject('รายการส่งไม่ได้อยู่ระหว่างดำเนินการ');
      const recipients=op.uids.slice(start,start+CHUNK);
      recipients.forEach((uid,j)=>{
        tx.set(doc(db,'mail',uid,'items',op.operationId+'-'+(start+j)),{...op.body,createdAt:serverTimestamp()});
        tx.update(doc(db,'players',uid),{mailCount:increment(1)});
      });
      const done=[...op.done,start],status=done.length===Math.ceil(op.uids.length/CHUNK)?'done':'sending';
      tx.update(stateRef,{done,status,updatedAt:serverTimestamp()});
      if(status==='done')tx.set(doc(db,'adminLog',op.operationId),{at:serverTimestamp(),expireAt:Timestamp.fromMillis(Date.now()+60*864e5),type:'gift',to:op.names,count:op.uids.length,kusal:op.body.kusal,coins:op.body.coins,items:op.body.items,title:op.body.title});
      sent=recipients.length;
    });
    newlySent+=sent;
  }
  return {count:operation.uids.length,body:operation.body,uids:operation.uids,newlySent};
}
