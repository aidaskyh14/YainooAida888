import { doc, collection, getDocs, getDoc, setDoc, query, orderBy, limit, runTransaction, serverTimestamp, writeBatch } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { splitGame, joinGame, MAX_PARTS } from './save-schema.js?v=ss3-fix16&h=eef4832b';
export async function installBackupUI({db,store,$,modal,toast,thaiError,esc,today,S,flush,frameSave}) {
  const host=$('#aBody');host.innerHTML='<div class="box">กำลังอ่านข้อมูลสำรอง…</div>';
  try {
    const days=(await getDocs(query(collection(db,'backups'),orderBy('at','desc'),limit(14)))).docs;
    host.innerHTML='<div class="box"><h3>💾 สำรองเซฟแยกตามระบบ</h3><button class="btn" id="bNow">สำรองตอนนี้</button><p class="note">เก็บย้อนหลัง 14 วัน</p></div><div class="box"><h3>♻️ กู้คืนผู้เล่น</h3><select id="rDay">'+days.filter(d=>d.data().status!=='building').map(d=>'<option value="'+esc(d.id)+'">'+esc(d.id)+'</option>').join('')+'</select><button class="btn sm" id="rLoad">ดูรายชื่อ</button><div id="rList"></div></div>';
    async function writeOperations(ops) {for(let n=0;n<ops.length;n+=400){const b=writeBatch(db);ops.slice(n,n+400).forEach(fn=>fn(b));await b.commit();}}
    async function cleanDay(day) {
      const users=(await getDocs(collection(db,'backups',day,'players'))).docs;const ops=[];
      for(const u of users){const parts=await store.readParts(u.id,'backups',day);parts.forEach(p=>ops.push(b=>b.delete(p.ref)));ops.push(b=>b.delete(u.ref));}
      ops.push(b=>b.delete(doc(db,'backups',day)));await writeOperations(ops);
    }
    /* fix35 🔍 ตรวจกุศลผู้เล่น (อ่านอย่างเดียว) */host.insertAdjacentHTML('beforeend','<div class="box"><h3>🔍 ตรวจกุศลผู้เล่น</h3><p class="note">ดูกุศลตอนนี้ เทียบกับชุดสำรองแต่ละวัน + รายการหักล่าสุดที่เซิร์ฟเวอร์จำไว้ (ตัด/ปล้น/ขวด/ปีศาจ) · อ่านอย่างเดียว</p><div class="row"><input id="mQ" placeholder="ชื่อผู้เล่น" style="flex:1"><button class="btn sm" id="mGo">ตรวจ</button></div><div id="mOut"></div></div>');
    const fmtM=n=>Math.round(Number(n)||0).toLocaleString('en-US');const tsM=v=>{try{const d=v&&v.toDate?v.toDate():v?new Date(Number(v.ms||v)):null;return d&&!isNaN(d)?d.toLocaleString('th-TH',{hour12:false}):'';}catch(e){return '';}};
    const wm=p=>{try{let v=JSON.parse(p);if(typeof v==='string')v=JSON.parse(v);return v&&typeof v==='object'?Number(v.merit)||0:null;}catch(e){return null;}};
    $('#mGo').onclick=async()=>{const q=($('#mQ').value||'').trim();const out=$('#mOut');if(!q)return;out.textContent='กำลังตรวจ…';
      try{const all=(await getDocs(collection(db,'players'))).docs.filter(d=>String(d.data().name||'').includes(q)).slice(0,3);if(!all.length){out.textContent='ไม่พบผู้เล่นชื่อมี "'+q+'"';return;}let html='';
        for(const p of all){const uid=p.id,R=p.data();const parts=await store.readParts(uid);const w=parts.find(x=>x.id==='wallet');const cur=w?wm(w.data().payload):null;
          html+='<div class="row" style="flex-direction:column;align-items:stretch"><b>👤 '+esc(R.name)+'</b><div>💰 กุศลตอนนี้ <b>'+(cur==null?'?':fmtM(cur))+'</b> (หน้าอันดับ '+fmtM(R.displayMerit)+') · เซฟล่าสุด '+esc(tsM(w&&w.data().updatedAt))+'</div>';
          const rows=[];for(const d of days){try{const b=await getDoc(doc(db,'backups',d.id,'players',uid,'saves','wallet'));const m=b.exists()?wm(b.data().payload):null;rows.push('<div>📦 '+esc(d.id)+': '+(m==null?'ไม่มี':'<b>'+fmtM(m)+'</b>'+(cur!=null?' ('+(cur-m>=0?'+':'')+fmtM(cur-m)+' เทียบตอนนี้)':''))+'</div>');}catch(e){rows.push('<div>📦 '+esc(d.id)+': อ่านไม่ได้</div>');}}
          html+=rows.join('');
          try{const gates=(await getDocs(collection(db,'players',uid,'actionGates'))).docs.map(g=>({id:g.id,at:g.data().updatedAt,r:g.data().result||{}})).sort((a,b)=>((b.at&&b.at.toMillis?b.at.toMillis():0)-(a.at&&a.at.toMillis?a.at.toMillis():0)));
            html+='<div style="margin-top:6px"><b>🧾 รายการล่าสุดต่อระบบ</b></div>';for(const g of gates.slice(0,14)){const la=g.r.ledgerApplied||[];html+='<div style="font-size:.85rem">'+esc(tsM(g.at))+' · '+esc(g.id)+(g.r.meta&&g.r.meta.displayMerit!=null?' · กุศลหลังรายการ '+fmtM(g.r.meta.displayMerit):'')+'</div>';for(const x of la)html+='<div style="font-size:.85rem;color:#B02A44">⚠️ '+(x.merit?(x.merit>0?'+':'')+fmtM(x.merit)+' ':'')+esc(x.title||'')+' — '+esc(String(x.msg||'').slice(0,120))+(x.lines?' '+esc(x.lines.join(', ').slice(0,160)):'')+'</div>';}}catch(e){html+='<div class="note">อ่านรายการล่าสุดไม่ได้: '+esc(e.message)+'</div>';}
          try{const led=(await getDocs(collection(db,'players',uid,'ledger'))).docs;if(led.length)html+='<div>📨 รายการค้างรอหัก: '+led.map(d=>esc(d.id)+' '+fmtM(d.data().merit)+(d.data().rob?' ปล้น '+d.data().rob:'')).join(' · ')+'</div>';}catch(e){}
          html+='<div class="note">ถ้าหายจริงและจะชดเชย: ไปแท็บ 🎁 ส่งของ ส่งกุศลเท่าส่วนต่างให้ผู้เล่น (ไม่ต้องกู้คืนทั้งเซฟ)</div></div>';}
        out.innerHTML=html;}catch(e){out.textContent='ตรวจไม่ได้: '+(e.message||thaiError(e));}};
    $('#bNow').onclick=async e=>{
      e.target.disabled=true;
      try {
        frameSave();await flush();
        const d=today();const users=(await getDocs(collection(db,'players'))).docs;
        // มีสถานะกำลังสร้าง: ไม่เปิดให้กู้จากชุดที่ยังสำรองไม่ครบ
        await setDoc(doc(db,'backups',d),{at:serverTimestamp(),status:'building',count:users.length});
        const prior=(await getDocs(collection(db,'backups',d,'players'))).docs;
        const cleanup=[];for(const u of prior){for(const p of await store.readParts(u.id,'backups',d))cleanup.push(b=>b.delete(p.ref));cleanup.push(b=>b.delete(u.ref));}await writeOperations(cleanup);
        for(const u of users) {
          const data=await store.readFull(u.id), parts=splitGame(data.g||{});delete data.g;data.storageVersion=2;data.partCount=parts.size;
          const ops=[b=>b.set(doc(db,'backups',d,'players',u.id),data)];
          for(const [id,p] of parts)ops.push(b=>b.set(doc(db,'backups',d,'players',u.id,'saves',id),p));await writeOperations(ops);
        }
        await setDoc(doc(db,'backups',d),{at:serverTimestamp(),status:'ready',count:users.length});
        const all=(await getDocs(query(collection(db,'backups'),orderBy('at','desc')))).docs;
        for(const old of all.slice(14))await cleanDay(old.id);
        toast('สำรองครบแล้ว');await installBackupUI({db,store,$,modal,toast,thaiError,esc,today,S,flush,frameSave});
      }catch(e2){toast(e2.message||thaiError(e2));e.target.disabled=false;}
    };
    $('#rLoad').onclick=async()=>{
      const day=$('#rDay').value;if(!day)return;
      const list=$('#rList');list.textContent='กำลังโหลด…';
      const users=(await getDocs(collection(db,'backups',day,'players'))).docs;
      list.innerHTML=users.map(u=>'<div class="row"><b style="flex:1">'+esc(u.data().name)+'</b><button class="btn sm pink" data-restore="'+esc(u.id)+'">กู้คืน</button></div>').join('');
      list.querySelectorAll('[data-restore]').forEach(b=>b.onclick=()=>modal('<h2>กู้คืน '+esc(users.find(u=>u.id===b.dataset.restore).data().name)+'?</h2><p>ใช้ข้อมูลวันที่ '+esc(day)+' แทนปัจจุบัน · ถ้าผู้เล่นอยู่ในเกม ระบบจะเตะออกให้เองแล้วกู้ ผู้เล่นเข้าเกมใหม่ได้ทันที</p>',[{t:'ยกเลิก',c:'gray'},{t:'กู้คืน',f:async()=>{
        try {
          const uid=b.dataset.restore;const old=users.find(u=>u.id===uid).data();
          const parts=old.storageVersion===2?new Map((await store.readParts(uid,'backups',day)).map(p=>[p.id,p.data()])):splitGame(old.g||{});
          const kick='restored-'+Date.now();/* fix35: เตะผู้เล่นออกก่อนกู้ (ไม่ต้องรอให้ปิดเกม) */try{await setDoc(doc(db,'players',uid),{session:kick},{merge:true});}catch(e){}await new Promise(r=>setTimeout(r,1500));const before=await getDoc(doc(db,'players',uid));const current=await store.readParts(uid);delete old.g;delete old.size;
          await runTransaction(db,async tx=>{
            const status=await tx.get(doc(db,'backups',day));if(!status.exists()||status.data().status==='building')throw new Error('ชุดสำรองนี้ยังไม่พร้อมกู้คืน');
            const root=await tx.get(doc(db,'players',uid));if(JSON.stringify(root.data())!==JSON.stringify(before.data()))throw new Error('เซฟกำลังเปลี่ยน กรุณาปิดเกมผู้เล่นแล้วลองใหม่');
            const snapshots=await Promise.all(current.map(p=>tx.get(p.ref)));
            if(snapshots.some((p,i)=>p.data()?.rev!==current[i].data().rev))throw new Error('เซฟกำลังเปลี่ยน กรุณาปิดเกมผู้เล่นแล้วลองใหม่');
            for(const p of current)if(!parts.has(p.id))tx.delete(p.ref);
            for(const [id,p] of parts)tx.set(doc(db,'players',uid,'saves',id),{path:p.path,system:p.system,payload:p.payload,rev:(current.find(x=>x.id===id)?.data().rev||0)+1,by:kick,updatedAt:serverTimestamp()});
            tx.set(doc(db,'players',uid),{...old,storageVersion:2,partCount:parts.size,session:kick,by:kick});
          });
          toast('กู้คืนแล้ว');if(uid===S.user.uid)location.reload();
        }catch(e){toast(e.message||thaiError(e));}
      }}]));
    };
  }catch(e){host.textContent=e.message||thaiError(e);}
}
