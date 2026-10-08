import { doc, collection, getDocs, getDoc, runTransaction, serverTimestamp, deleteField, query, limit } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { STORAGE_VERSION, MAX_PARTS, bytes, splitGame, joinGame, diffs } from './save-schema.js?v=ss3-20261008-lazy2';
const conflict = () => Object.assign(new Error('เซฟเปลี่ยนจากเครื่องอื่น กรุณาเข้าเกมใหม่ก่อนเล่นต่อ'),{code:'save/conflict'});
const copy = o => JSON.parse(JSON.stringify(o));
export class SplitSaveStore {
  constructor(db,uid,session) { this.db=db;this.uid=uid;this.session=session;this.parts=new Map();this.revs=new Map();this.partial=false;this.loadedIds=new Set();this.activeIds=null; }
  root() { return doc(this.db,'players',this.uid); }
  ref(id) { return doc(this.db,'players',this.uid,'saves',id); }
  async readParts(uid=this.uid,base='players',day) {
    const col=base==='players'?collection(this.db,'players',uid,'saves'):collection(this.db,'backups',day,'players',uid,'saves');
    const snap=await getDocs(query(col,limit(MAX_PARTS+1)));
    if(snap.size>MAX_PARTS)throw new Error('มีส่วนเซฟมากผิดปกติ กรุณาตรวจข้อมูลก่อนเล่น');
    return snap.docs;
  }
  async loadIds(ids) {
    const missing=[...new Set(ids)].filter(id=>!this.loadedIds.has(id));
    const rows=await Promise.all(missing.map(id=>getDoc(this.ref(id))));
    // Commit the cache only after every requested read succeeded.
    rows.forEach((row,i)=>{const id=missing[i];this.loadedIds.add(id);if(row.exists()){this.parts.set(id,row.data());this.revs.set(id,row.data().rev);}else this.revs.set(id,0);});
    return joinGame(this.parts.values());
  }
  activate(ids) { this.activeIds=new Set(ids); }
  scopedNext(game,ids=this.activeIds) {
    const projected=splitGame(game||{});
    if(!this.partial)return projected;
    const next=new Map(this.parts);
    for(const id of ids||this.loadedIds) {
      if(!this.loadedIds.has(id))throw new Error('ยังไม่ได้โหลดส่วนเซฟ '+id+' ห้ามบันทึกทับ');
      if(projected.has(id))next.set(id,projected.get(id));else next.delete(id);
    }
    return next;
  }
  mergeProjection(before,after) {
    if(!this.partial)return after;
    const current=splitGame(before||{}),incoming=splitGame(after||{});
    for(const id of this.activeIds||this.loadedIds){if(!this.loadedIds.has(id))continue;if(incoming.has(id))current.set(id,incoming.get(id));else current.delete(id);}
    return joinGame(current.values());
  }
  accept(rows) {
    for(const row of rows){this.parts.set(row.id,row.part);this.revs.set(row.id,row.part.rev);this.loadedIds.add(row.id);}
  }
  async load(profile,options={}) {
    this.partial=Array.isArray(options.ids);
    if(profile.storageVersion!==STORAGE_VERSION) {
      // สำเนาข้อมูลเก่ายังคงอยู่ จน transaction ย้ายทุกส่วนสำเร็จพร้อมกัน
      const initial=splitGame(profile.g||{});
      const existing=await this.readParts();
      if(existing.length)throw new Error('พบข้อมูลย้ายค้าง กรุณาตรวจข้อมูลก่อนเริ่มย้ายใหม่');
      await runTransaction(this.db,async tx=>{
        const root=await tx.get(this.root());
        if(!root.exists() || root.data().session!==this.session || root.data().storageVersion===STORAGE_VERSION)throw conflict();
        if(JSON.stringify(root.data().g||{})!==JSON.stringify(profile.g||{}))throw conflict();
        for(const [id,p] of initial)tx.set(this.ref(id),{...p,rev:1,by:this.session,updatedAt:serverTimestamp()});
        tx.update(this.root(),{storageVersion:STORAGE_VERSION,partCount:initial.size,maxPartBytes:Math.max(0,...[...initial.values()].map(p=>bytes(p.payload))),g:deleteField(),size:deleteField(),saveRevision:(root.data().saveRevision||0)+1});
      });
      this.parts=initial;this.revs=new Map([...initial.keys()].map(id=>[id,1]));
    } else {
      if(this.partial) {
        await this.loadIds(options.ids);
        this.activate(options.ids);
        return {...profile,g:joinGame(this.parts.values())};
      }
      const docs=await this.readParts();
      if(docs.length!==profile.partCount)throw new Error('เซฟบนคลาวด์ไม่ครบ หยุดเข้าเกมเพื่อไม่ใช้ค่าเริ่มต้นทับข้อมูลเดิม');
      this.parts=new Map(docs.map(d=>[d.id,d.data()]));this.revs=new Map(docs.map(d=>[d.id,d.data().rev]));
    }
    this.loadedIds=new Set([...this.parts.keys(),...(options.ids||[])]);
    if(this.partial)this.activate(options.ids);
    return {...profile,storageVersion:STORAGE_VERSION,partCount:this.parts.size,g:joinGame(this.parts.values())};
  }
  async save(profile,fields) {
    const next=this.scopedNext(profile.g||{}), changes=fields.includes('g')?diffs(this.parts,next):[];
    if(!changes.length && fields.every(f=>f==='g'))return;
    const meta={by:this.session};
    for(const f of fields)if(f!=='g'&&f!=='size'&&f!=='storageVersion')meta[f]=profile[f];
    await runTransaction(this.db,async tx=>{
      const root=await tx.get(this.root());if(!root.exists()||root.data().session!==this.session)throw conflict();
      const snaps=await Promise.all(changes.map(([id])=>tx.get(this.ref(id))));
      snaps.forEach((s,i)=>{if((s.exists()?s.data().rev:0)!==(this.revs.get(changes[i][0])||0))throw conflict();});
      changes.forEach(([id,p],i)=>{if(p)tx.set(this.ref(id),{...p,rev:(this.revs.get(id)||0)+1,by:this.session,updatedAt:serverTimestamp()});else tx.delete(this.ref(id));});
      const added=changes.filter(([id,p])=>p&&!this.parts.has(id)).length,removed=changes.filter(([id,p])=>!p&&this.parts.has(id)).length;
      const count=this.partial?(root.data().partCount||0)+added-removed:next.size;
      if(count>MAX_PARTS)throw new Error('มีส่วนเซฟเกินขอบเขต');
      tx.update(this.root(),{...meta,partCount:count,maxPartBytes:Math.max(root.data().maxPartBytes||0,...[...next.values()].map(p=>bytes(p.payload))),saveRevision:(root.data().saveRevision||0)+1});
    });
    for(const [id,p] of changes){if(p){this.parts.set(id,p);this.revs.set(id,(this.revs.get(id)||0)+1);}else{this.parts.delete(id);this.revs.delete(id);}}
  }
  async claimMail(mailRef,grant) {
    let result,next,changes;
    await runTransaction(this.db,async tx=>{
      const [root,mail]=await Promise.all([tx.get(this.root()),tx.get(mailRef)]);
      if(!root.exists()||root.data().session!==this.session)throw conflict();
      if(!mail.exists())throw Object.assign(new Error('ซองนี้รับไปแล้ว'),{thai:'ซองนี้รับไปแล้ว'});
      const m=mail.data();if(m.expireAt&&m.expireAt.toMillis()<=Date.now())throw Object.assign(new Error('ซองหมดอายุแล้ว'),{thai:'ซองหมดอายุแล้ว'});
      const mailIds=['inventory','wallet'];
      if(m.escrowRelease)mailIds.push('animals-minigames');
      const base=new Map(this.parts),mailDocs=await Promise.all(mailIds.map(id=>tx.get(this.ref(id))));
      mailDocs.forEach((d,i)=>{if(d.exists())base.set(mailIds[i],d.data());else base.delete(mailIds[i]);});
      const game=joinGame(base.values());grant(game,m);const projected=splitGame(game);next=new Map(base);
      for(const id of mailIds){if(projected.has(id))next.set(id,projected.get(id));}
      changes=diffs(base,next);
      const expected=new Map(mailIds.map((id,i)=>[id,mailDocs[i].exists()?mailDocs[i].data().rev:0]));
      const snaps=await Promise.all(changes.map(([id])=>tx.get(this.ref(id))));
      snaps.forEach((s,i)=>{if((s.exists()?s.data().rev:0)!==(expected.get(changes[i][0])??this.revs.get(changes[i][0])??0))throw conflict();});
      changes.forEach(([id,p])=>tx.set(this.ref(id),{...p,rev:(expected.get(id)??this.revs.get(id)??0)+1,by:this.session,updatedAt:serverTimestamp()}));
      tx.update(this.root(),{coins:(root.data().coins||0)+(m.coins||0),mailCount:Math.max(0,(root.data().mailCount||0)-1),by:this.session,partCount:(root.data().partCount||0)+changes.filter(([id,p])=>p&&!base.has(id)).length,maxPartBytes:Math.max(root.data().maxPartBytes||0,...[...next.values()].map(p=>bytes(p.payload))),saveRevision:(root.data().saveRevision||0)+1});
      tx.delete(mailRef);result=m;
      changes=changes.map(([id,p])=>[id,{...p,rev:(expected.get(id)??this.revs.get(id)??0)+1}]);
      mailDocs.forEach((d,i)=>{if(d.exists()&&!changes.some(([id])=>id===mailIds[i]))changes.push([mailIds[i],d.data()]);});
    });
    for(const [id,p] of changes){this.parts.set(id,p);this.revs.set(id,p.rev);this.loadedIds.add(id);}
    return result;
  }
  async readFull(uid) {
    for(let attempt=0;attempt<4;attempt++) {
      const ref=doc(this.db,'players',uid), root=await getDoc(ref);
      if(!root.exists())throw new Error('ไม่พบผู้เล่น');
      const parts=await this.readParts(uid), after=await getDoc(ref);
      if(root.data().storageVersion===STORAGE_VERSION && root.data().partCount!==parts.length)throw new Error('เซฟบนคลาวด์ไม่ครบ ไม่สำรองข้อมูลชุดนี้');
      if(JSON.stringify(root.data())===JSON.stringify(after.data()))return {...root.data(),g:root.data().storageVersion===STORAGE_VERSION?joinGame(parts.map(x=>x.data())):root.data().g};
    }
    throw new Error('ผู้เล่นกำลังเปลี่ยนข้อมูล กรุณาลองสำรองอีกครั้ง');
  }
}
