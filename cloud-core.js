import {repairInventory,assertInventory} from './inventory-integrity.js?h=3eda517a';
/* Transaction adapter shared by callable handlers and emulator tests. */
import {splitGame,joinGame,bytes} from './save-schema.js?h=eef4832b';
import {refillAdminInventory} from './admin-inventory.js?h=6c90d59e';
import {CATALOG} from './catalog.js?h=475fbe38';
import {questDeltas,nbDay} from './nb-quest.js?h=02ff82da';
import {swimHook} from './swim-quest.js?h=c301332f';
import {twDeltas,twAddPts,twRobTake,TW_ROB_NAME} from './tree-engine.js?h=4fbc22f0';
import {honeyMultiplier} from './campaigns-engine.js?h=a073b41e';
/* fix17: x17 = ข้อมูลส่วนตัวฝั่งเซิร์ฟเวอร์เล็ก ๆ บนเอกสาร players/{uid} (อ่านอยู่แล้วทุกรายการ ไม่เพิ่มการอ่าน)
   เช่น ภารกิจว่ายกลับ (sq) · เวลาจิ้มนางเงือก · ยอดเปิดกล่องมหากุศลรายวัน · ของแกล้งที่ถืออยู่ */
const x17Of=root=>{const v=root.data().x17;return v&&typeof v==='object'&&!Array.isArray(v)?structuredClone(v):{};};
const sameJson=(a,b)=>JSON.stringify(a,(k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(key=>[key,x[key]])):x)===JSON.stringify(b,(k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(key=>[key,x[key]])):x);
export const actionError=(message,code='failed-precondition')=>Object.assign(new Error(message),{code});
export const refuse=(message,code)=>{throw actionError(message,code);};
let twOff={at:0,off:false};/* fix19: จำว่าศึกปิดอยู่ 30 วินาที (ไม่ต้องอ่านสถานะศึกทุกรายการตอนศึกปิด) */
const LEDGER_PAGE=20,LEDGER_PATH=/^players\/([-a-zA-Z0-9_]{1,128})\/ledger\/[^/]+$/;
const READ_ONLY=Symbol('read-only');
export function createCloudCore(db,timestamp) {
  /* fix13 read-only path (no transaction, no writes): used for page-open 'status' calls.
     readOnly: never writes (the result's writes/updates/part changes are dropped; the next real action persists them).
     peek: answers read-only only when apply wants to change nothing; otherwise returns null and the caller runs the full transaction.
     The action gate is not advanced: the response carries the gate's current seq, so the client's next action uses seq+1 as before. */
  async function view({uid,session,system,id,seq,partIds,worldIds,apply,readOnly}) {
    const rootRef=db.doc('players/'+uid),gateRef=db.doc('players/'+uid+'/actionGates/'+system),adminRef=db.doc('admins/'+uid);
    const refs=[rootRef,gateRef,adminRef,...partIds.map(p=>db.doc('players/'+uid+'/saves/'+p)),...worldIds.map(p=>db.doc(p))];
    const snaps=typeof db.getAll==='function'?await db.getAll(...refs):await Promise.all(refs.map(r=>r.get()));
    const [root,gate,admin]=snaps,docs=snaps.slice(3,3+partIds.length),worldDocs=snaps.slice(3+partIds.length);
    if(!root.exists||root.data().session!==session)refuse('บัญชีนี้เปิดจากเครื่องอื่น กรุณาเข้าเกมใหม่');
    if(!admin.exists && root.data().approval && root.data().approval!=='approved')refuse('รอแอดมินอนุมัติสมาชิกก่อนเข้าเล่น','permission-denied');
    if(root.data().storageVersion!==2)refuse('กรุณาเข้าเกมให้โหลดเซฟเรียบร้อยก่อน');
    const prior=gate.exists?gate.data():{seq:0};
    if(seq===prior.seq&&id===prior.id)return prior.result;
    if(seq!==prior.seq+1)refuse('รายการเก่าหรือรายการส่งซ้อน กรุณาตรวจข้อมูลแล้วลองใหม่','aborted');
    const parts=new Map(docs.flatMap((d,i)=>d.exists?[[partIds[i],d.data()]]:[]));
    const x17Before=x17Of(root),game=joinGame(parts.values()),ctx={uid,admin:admin.exists,now:Date.now(),name:root.data().name,coins:root.data().coins||0,readOnly:true,x17:structuredClone(x17Before),dmc:Number(root.data().dmc)||0,dmp:root.data().dmp===true,dmMail:root.data().dmMail===true};
    const worlds=Object.fromEntries(worldIds.map((p,i)=>[p,worldDocs[i].exists?worldDocs[i].data():null]));
    if(repairInventory(game).length&&!readOnly)return null;
    const tx={get:r=>r.get(),set:()=>{throw READ_ONLY;},update:()=>{throw READ_ONLY;},delete:()=>{throw READ_ONLY;}};
    const beforeAction=structuredClone(game);let result;
    try{result=await apply(game,worlds,ctx,tx);}catch(e){if(e===READ_ONLY&&!readOnly)return null;if(e===READ_ONLY)refuse('รายการนี้ต้องบันทึก ไม่ใช่การดูสถานะ');throw e;}
    assertInventory(game,beforeAction);refillAdminInventory(game,ctx.admin,CATALOG);
    swimHook(ctx.x17,system,beforeAction,game,result.response||{},ctx.now);
    if(!readOnly&&!sameJson(ctx.x17,x17Before))return null;
    if(!readOnly){
      const serialized=splitGame(game);
      const changed=Object.keys(result.writes||{}).length||Object.keys(result.updates||{}).length||Object.keys(result.merges||{}).length||result.mailDelta||(result.coins!==undefined&&result.coins!==ctx.coins)
        ||partIds.some(k=>(serialized.get(k)?.payload??null)!==(parts.get(k)?.payload??null));
      if(changed)return null;
    }
    const actorParts=partIds.filter(k=>parts.has(k)).map(k=>({id:k,part:parts.get(k)}));
    return JSON.parse(JSON.stringify({...(result.response||{}),actorParts,meta:{coins:ctx.coins,mailCount:root.data().mailCount||0,x17:x17Before},seq:prior.seq,id}));
  }
  return {
    async action({uid,session,system,id,seq,partIds=['inventory','wallet'],worldIds=[],apply,readOnly=false,peek=false,input={}}) {
      if(!uid)refuse('กรุณาเข้าสู่ระบบ','unauthenticated');
      if(!/^[a-z][a-z0-9-]{0,39}$/.test(system)||!Number.isSafeInteger(seq)||seq<1||typeof id!=='string'||id.length>100)refuse('รายการไม่ถูกต้อง','invalid-argument');
      if(readOnly||peek){const out=await view({uid,session,system,id,seq,partIds,worldIds,apply,readOnly});if(out)return out;}
      return db.runTransaction(async tx=>{
        const rootRef=db.doc('players/'+uid),gateRef=db.doc('players/'+uid+'/actionGates/'+system),adminRef=db.doc('admins/'+uid);
        const [root,gate,admin]=await Promise.all([tx.get(rootRef),tx.get(gateRef),tx.get(adminRef)]);
        if(!root.exists||root.data().session!==session)refuse('บัญชีนี้เปิดจากเครื่องอื่น กรุณาเข้าเกมใหม่');
        if(!admin.exists && root.data().approval && root.data().approval!=='approved')refuse('รอแอดมินอนุมัติสมาชิกก่อนเข้าเล่น','permission-denied');
        if(root.data().storageVersion!==2)refuse('กรุณาเข้าเกมให้โหลดเซฟเรียบร้อยก่อน');
        const prior=gate.exists?gate.data():{seq:0};
        if(seq===prior.seq&&id===prior.id)return prior.result;
        if(seq!==prior.seq+1)refuse('รายการเก่าหรือรายการส่งซ้อน กรุณาตรวจข้อมูลแล้วลองใหม่','aborted');
        const refs=partIds.map(p=>db.doc('players/'+uid+'/saves/'+p));
        const worldRefs=worldIds.map(p=>db.doc(p));
        const docs=await Promise.all(refs.map(r=>tx.get(r))),worldDocs=await Promise.all(worldRefs.map(r=>tx.get(r)));
        const parts=new Map(docs.flatMap((d,i)=>d.exists?[[partIds[i],d.data()]]:[]));
        const x17Before=x17Of(root),game=joinGame(parts.values()),ctx={uid,admin:admin.exists,now:Date.now(),name:root.data().name,coins:root.data().coins||0,x17:structuredClone(x17Before),dmc:Number(root.data().dmc)||0,dmp:root.data().dmp===true,dmMail:root.data().dmMail===true};
        const worlds=Object.fromEntries(worldIds.map((p,i)=>[p,worldDocs[i].exists?worldDocs[i].data():null]));
        // Pending merit changes written by other players' actions (players/{uid}/ledger). Applied only when merit (wallet) is saved by this action.
        // fix13: queried only when the root flag says entries may exist (ledgerPending true or never set). The login call
        // (system 'ledger') always queries, so an entry written by an older server without the flag is applied at the next login.
        const ledgerApplied=[],ledgerDone=[],ledgerKeep=[];let ledgerFlag;
        if(partIds.includes('wallet')&&typeof db.collection==='function'&&(system==='ledger'||root.data().ledgerPending!==false)){
          const pending=await tx.get(db.collection('players/'+uid+'/ledger').limit(LEDGER_PAGE));ledgerFlag=(pending.docs||[]).length>=LEDGER_PAGE;
          for(const d of pending.docs||[]){const row=d.data()||{};if(Number.isFinite(row.after)&&row.after>ctx.now){ledgerFlag=true;continue;}/* fix17 คำสาปสะท้อน: ถึงเวลาแล้วค่อยหัก */
            /* fix19 🌳 ศึกโคมลอย ปล้นเสบียง: ทิ้งของในกระเป๋า (ชนิดละไม่เกินครึ่ง) · ยังไม่ครบ = ค้างไว้เก็บต่อเมื่อมีของใหม่ (เช่น รับของจากไปรษณีย์) */
            /* ทำเฉพาะตอนเรียก ledger (เข้าเกม / หน้าเว็บเรียกเมื่อโดนปล้น) ไม่แทรกรายการอื่น · ส่วนที่ยังขาดเก็บต่อได้ทุก 6 ชม. ภายใน 3 วัน */
            if(Number.isSafeInteger(row.rob)&&row.rob>0){if(system!=='ledger'||!partIds.includes('inventory'))continue;
              if((row.until||0)<=ctx.now){ledgerDone.push(d.ref);continue;}if((row.nextAt||0)>ctx.now)continue;
              const r=twRobTake(game,row.rob,ctx.coins);ctx.coins-=r.coinsTaken;const lines=Object.entries(r.taken).map(([p,n])=>'−'+n.toLocaleString('en-US')+' '+(TW_ROB_NAME[p]||p));
              if(r.left>0)ledgerKeep.push([d.ref,{...row,rob:r.left,seen:true,nextAt:ctx.now+6*3600000}]);else ledgerDone.push(d.ref);
              if(lines.length||!row.seen)ledgerApplied.push({merit:0,tw:'rob',title:String(row.title||''),msg:String(row.msg||''),lines:lines.length?lines:['(ตอนนี้ไม่มีของให้ปล้น)']});continue;}
            ledgerDone.push(d.ref);if(!Number.isSafeInteger(row.merit)||!row.merit)continue;
            {const m0=game.merit||0;game.merit=row.merit<0?m0+row.merit:m0+row.merit;}ledgerApplied.push({merit:row.merit,title:String(row.title||''),msg:String(row.msg||''),...(row.source==='funrun'?{source:'funrun'}:{}),...(row.tw?{tw:String(row.tw)}:{})});}
        }
        // apply may read additional documents, but all reads must precede writes.
        const priorInventoryIssues=repairInventory(game);
        const beforeAction=structuredClone(game);const result=await apply(game,worlds,ctx,tx);assertInventory(game,beforeAction);
        swimHook(ctx.x17,system,beforeAction,game,result.response||{},ctx.now);
        const x17Changed=!sameJson(ctx.x17,x17Before);
        // fix13: every ledger entry this action writes raises the receiver's flag in the same transaction (receiver must exist).
        const ledgerTargets=[...new Set(Object.keys(result.writes||{}).map(p=>LEDGER_PATH.exec(p)?.[1]).filter(Boolean))];
        if(ledgerTargets.includes(uid))ledgerFlag=true;
        const others=ledgerTargets.filter(t=>t!==uid),targetRoots=await Promise.all(others.map(t=>tx.get(db.doc('players/'+t))));
        others.forEach((t,i)=>{if(!targetRoots[i].exists)return;result.updates ||= {};result.updates['players/'+t]={...(result.updates['players/'+t]||{}),ledgerPending:true};});
        // fix14 เนเบอร์ฮูด: นับเควสต์ของสมาชิกที่อยู่ในเนเบอร์ฮูดที่เปิดใช้แล้ว (อ่าน 2 เอกสารเฉพาะคนที่มีเนเบอร์ฮูด)
        let nbWrite=null;const nbId=root.data().nb;
        if(typeof nbId==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(nbId)){
          let quest=questDeltas(system,beforeAction,game,input||{},result.response||{});
          // fix15: กุศลที่ชนะจากแรลลี่กระทงเข้ามาทาง ledger นับเป็นเควสต์ "ได้กุศลจากมินิเกม"
          const won=ledgerApplied.filter(r=>r.source==='funrun'&&r.merit>0).reduce((a,r)=>a+r.merit,0);if(won){quest ||= {};quest.mgmerit=(quest.mgmerit||0)+won;}
          if(quest){
            const nbRef=db.doc('neighborhoods/'+nbId),dayRef=db.doc('neighborhoods/'+nbId+'/days/'+nbDay(ctx.now));
            const [nb,daySnap]=await Promise.all([tx.get(nbRef),tx.get(dayRef)]);
            if(nb.exists&&nb.data().status==='active'&&(nb.data().members||[]).includes(uid)){
              const day=daySnap.exists?daySnap.data():{q:{}};day.q ||= {};
              for(const [k,n]of Object.entries(quest)){day.q[k] ||= {};day.q[k][uid]=(Number(day.q[k][uid])||0)+n;}
              nbWrite=[dayRef,day];
            }
          }
        }
        // fix19 🌳 ศึกโคมลอย: แต้มจากกิจกรรมเข้าบ้าน (อ่านสถานะศึกเฉพาะรายการที่ได้แต้ม · อ่านบ้านเฉพาะตอนศึกเปิดอยู่)
        let twWrite=null;
        if(typeof nbId==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(nbId)){
          const tq=twDeltas(system,beforeAction,game,input||{},result.response||{},ctx.now,{honeyMult:honeyMultiplier});
          if(tq&&!(twOff.off&&ctx.now-twOff.at<30000)){const ss=await tx.get(db.doc('world/treeWar')),st=ss.exists?ss.data():null;const rd=st?.on?st.round:null;twOff={at:ctx.now,off:!rd};
            if(rd&&ctx.now>=rd.start&&ctx.now<rd.end&&rd.houses?.[nbId]){const hRef=db.doc('world/tw-'+nbId),hs=await tx.get(hRef);let h=hs.exists?hs.data():null;
              if(!h||h.round!==rd.id)h={round:rd.id,pts:{},n:{},cut:0,peak:0,at:0,chops:[]};const r=twAddPts(h,uid,tq,st.mul||{},ctx.now);
              if(r.added){h.n ||= {};h.n[uid]=String(ctx.name||'ผู้เล่น').slice(0,40);twWrite=[hRef,h];}}}
        }
        if(priorInventoryIssues.length){result.writes ||= {};result.writes['players/'+uid+'/inventoryRepairs/'+encodeURIComponent(id)]={system,createdAt:timestamp(),issues:JSON.stringify(priorInventoryIssues),inventoryBefore:parts.get('inventory')?.payload||'{}'};}
        refillAdminInventory(game,ctx.admin,CATALOG);
        const serialized=splitGame(game),actorParts=[];
        let added=0,max=Math.max(0,root.data().maxPartBytes||0);
        for(let i=0;i<partIds.length;i++) {
          const key=partIds[i],p=serialized.get(key);if(!p||p.payload===parts.get(key)?.payload){if(parts.has(key))actorParts.push({id:key,part:parts.get(key)});continue;}
          const row={...p,rev:(parts.get(key)?.rev||0)+1,by:session};max=Math.max(max,bytes(p.payload));
          if(!docs[i].exists)added++;
          tx.set(refs[i],{...row,updatedAt:timestamp()});actorParts.push({id:key,part:row});
        }
        /* S4 ข้อ 156: ขนาดส่วนเซฟปัจจุบัน (ไม่ใช่สถิติสูงสุดตลอดกาล) + ชื่อส่วนที่ใหญ่สุด */let curMax=0,curName='';for(const [k,p] of serialized){const b=bytes(p.payload);if(b>curMax){curMax=b;curName=k;}}max=curMax;
        for(const [path,data]of Object.entries(result.writes||{})){if(data===null)tx.delete(db.doc(path));else tx.set(db.doc(path),data);}/* S4: null = ลบเอกสาร (เช่น ออกจากนคร) */
        for(const [path,data]of Object.entries(result.merges||{}))tx.set(db.doc(path),data,{merge:true});
        if(nbWrite)tx.set(nbWrite[0],nbWrite[1]);
        if(twWrite)tx.set(twWrite[0],twWrite[1]);
        for(const [ref,row]of ledgerKeep)tx.set(ref,row);
        for(const [path,data]of Object.entries(result.updates||{}))tx.update(db.doc(path),data);
        for(const ref of ledgerDone)tx.delete(ref);
        for(const path of result.deletes||[])tx.delete(db.doc(path));
        const coins=result.coins??ctx.coins;
        if(!Number.isSafeInteger(coins)||coins<0)refuse('เหรียญไม่เพียงพอ');
        if((root.data().partCount||0)+added>240)refuse('ส่วนเซฟเกินขอบเขต','resource-exhausted');
        const meta={coins,mailCount:(root.data().mailCount||0)+(result.mailDelta||0),displayMerit:game.merit||0,partCount:(root.data().partCount||0)+added,maxPartBytes:max,maxPartName:curName,saveRevision:(root.data().saveRevision||0)+1,by:session,...(ledgerFlag!==undefined?{ledgerPending:ledgerFlag}:{}),...(x17Changed?{x17:JSON.parse(JSON.stringify(ctx.x17))}:{})};
        tx.update(rootRef,meta);
        const {ledgerPending:_serverOnly,...clientMeta}=meta;clientMeta.x17=JSON.parse(JSON.stringify(ctx.x17||{}));
        const response=JSON.parse(JSON.stringify({...(result.response||{}),...(ledgerApplied.length?{ledgerApplied}:{}),actorParts,meta:clientMeta,seq,id}));
        tx.set(gateRef,{seq,id,result:response,updatedAt:timestamp()});
        return response;
      });
    }
  };
}
