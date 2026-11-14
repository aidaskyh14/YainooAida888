import { doc, collection, getDocs, getDoc, runTransaction, serverTimestamp, deleteField, query, limit } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { STORAGE_VERSION, MAX_PARTS, bytes, splitGame, joinGame, diffs } from './save-schema.js?v=ss3-fix16&h=eef4832b';
const conflict = () => Object.assign(new Error('เซฟเปลี่ยนจากเครื่องอื่น กรุณาเข้าเกมใหม่ก่อนเล่นต่อ'),{code:'save/conflict'});
const copy = o => JSON.parse(JSON.stringify(o));
/* fix38 🔀 รวม 3 ทาง: base = ส่วนเซฟที่เครื่องนี้เคยอ่าน · mine = ค่าในเครื่อง · theirs = ค่าบนคลาวด์ตอนนี้ (ถูกระบบกลาง/แอดมิน/เพื่อนแก้)
   ฝั่งไหนไม่เปลี่ยน → เอาอีกฝั่ง · เปลี่ยนทั้งคู่: ตัวเลขนับได้ = คลาวด์ + ส่วนต่างของเรา (ไม่ติดลบ) · เวลา/อย่างอื่น = ของเรา (เครื่องที่กำลังเล่น) · รายการ (array) = คลาวด์ */
const isObjM=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function merge3(base,mine,theirs){
  if(same(mine,base))return theirs;if(same(theirs,base))return mine;if(same(mine,theirs))return mine;
  if(isObjM(mine)&&isObjM(theirs)){const b=isObjM(base)?base:{},out={};const keys=new Set([...Object.keys(b),...Object.keys(mine),...Object.keys(theirs)]);
    for(const k of keys){if(['__proto__','constructor','prototype'].includes(k))continue;const inB=k in b,inM=k in mine,inT=k in theirs;
      if(!inM&&!inT)continue;
      if(!inM){if(inB&&same(theirs[k],b[k]))continue;out[k]=theirs[k];continue;}/* เราลบ · คลาวด์ไม่เปลี่ยน → ลบ · คลาวด์เปลี่ยน → เอาคลาวด์ */
      if(!inT){if(inB&&same(mine[k],b[k]))continue;out[k]=mine[k];continue;}
      const v=merge3(inB?b[k]:undefined,mine[k],theirs[k]);if(v!==undefined)out[k]=v;}
    return out;}
  if(typeof mine==='number'&&typeof theirs==='number'){const bn=typeof base==='number'?base:0;
    if(Math.abs(mine)<1e11&&Math.abs(theirs)<1e11&&Math.abs(bn)<1e11){const v=theirs+(mine-bn);return (bn>=0&&mine>=0&&theirs>=0)?Math.max(0,Math.round(v*1e6)/1e6):v;}
    return mine;}
  if(Array.isArray(mine)||Array.isArray(theirs))return theirs;
  return mine;}
/* fix13 second guard: these parts hold placed animals / pens / house slots. A write may empty them (sold, expired, released)
   but must never make the collection itself disappear (part missing, key missing, or {} / []), which is what a stale page
   that never loaded the part produces. Such a write keeps the stored part instead. */
export const COLLECTION_PARTS={'animals-barn':['animals'],'animals-birds':['pens'],'animals-dog':['dog'],'animals-alpaca':['pens'],'catpen':['cat'],'house':['plots','barrels'],'backyard':['ham']};
const filled=v=>Array.isArray(v)?v.length>0:v!==null&&typeof v==='object'?Object.keys(v).length>0:false;
const payloadOf=p=>{try{return p?JSON.parse(p.payload):null;}catch(e){return null;}};
export function collectionWipe(id,current,next){
  const keys=COLLECTION_PARTS[id];if(!keys||!current)return false;
  const was=payloadOf(current),now=payloadOf(next);if(!was||typeof was!=='object')return false;
  return keys.some(k=>filled(was[k])&&!(now&&typeof now==='object'&&filled(now[k])));
}
export class SplitSaveStore {
  constructor(db,uid,session) { this.db=db;this.uid=uid;this.session=session;this.parts=new Map();this.revs=new Map();this.partial=false;this.loadedIds=new Set();this.activeIds=null;this.wipesBlocked=0; }
  keepCollection(id,current,next) {
    if(!collectionWipe(id,current,next))return false;
    this.wipesBlocked++;try{console.warn('save guard: kept '+id+' (write would remove its animals/slots)');}catch(e){}
    return true;
  }
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
    if(!this.partial){for(const id of Object.keys(COLLECTION_PARTS))if(this.parts.has(id)&&this.keepCollection(id,this.parts.get(id),projected.get(id)))projected.set(id,this.parts.get(id));return projected;}
    const next=new Map(this.parts);
    for(const id of ids||this.loadedIds) {
      if(!this.loadedIds.has(id))throw new Error('ยังไม่ได้โหลดส่วนเซฟ '+id+' ห้ามบันทึกทับ');
      if(this.keepCollection(id,this.parts.get(id),projected.get(id)))continue;
      if(projected.has(id))next.set(id,projected.get(id));else next.delete(id);
    }
    return next;
  }
  // scope = the part ids the writing page was opened with (fix13). A page only ever writes parts it loaded and that are
  // still active; a page from an earlier screen therefore cannot replace the next screen's parts with its stale snapshot.
  mergeProjection(before,after,scope) {
    if(!this.partial)return after;
    const current=splitGame(before||{}),incoming=splitGame(after||{});
    const active=this.activeIds||this.loadedIds,ids=scope?[...scope].filter(id=>active.has(id)):active;
    for(const id of ids){if(!this.loadedIds.has(id))continue;if(this.keepCollection(id,current.get(id),incoming.get(id)))continue;if(incoming.has(id))current.set(id,incoming.get(id));else current.delete(id);}
    return joinGame(current.values());
  }
  accept(rows) {
    for(const row of rows){this.parts.set(row.id,row.part);this.revs.set(row.id,row.part.rev);this.loadedIds.add(row.id);if(row.id==='wallet'){/* fix35b: ค่าจากระบบกลาง = ฐานใหม่ */try{const mm=Number(JSON.parse(row.part.payload).merit)||0;this.mA={m:mm,t:Date.now()};this.mPeak=mm;}catch(e){}}}
  }
  async load(profile,options={}) {this.mA=null;this.mPeak=0;/* fix35b: โหลดใหม่ = ตั้งฐานใหม่จากค่าในคลาวด์ */
    this.partial=Array.isArray(options.ids);
    if(profile.storageVersion!==STORAGE_VERSION) {
      // Migrate from the transaction's authoritative cloud snapshot.
      // Keep the original save until every part commits atomically.
      const existing=await this.readParts();
      let migratedParts=null;
      profile=await runTransaction(this.db,async tx=>{
        const root=await tx.get(this.root());
        if(!root.exists() || root.data().session!==this.session)throw conflict();
        const current=root.data();
        if(current.storageVersion===STORAGE_VERSION){migratedParts=null;return current;}
        if(existing.length)throw new Error('พบข้อมูลย้ายค้าง กรุณาตรวจข้อมูลก่อนเริ่มย้ายใหม่');
        const initial=splitGame(current.g||{});
        for(const [id,p] of initial)tx.set(this.ref(id),{...p,rev:1,by:this.session,updatedAt:serverTimestamp()});
        const metadata={storageVersion:STORAGE_VERSION,partCount:initial.size,maxPartBytes:Math.max(0,...[...initial.values()].map(p=>bytes(p.payload))),saveRevision:(current.saveRevision||0)+1};
        tx.update(this.root(),{...metadata,g:deleteField(),size:deleteField()});
        migratedParts=initial;
        return {...current,...metadata};
      });
      if(migratedParts){this.parts=migratedParts;this.revs=new Map([...migratedParts.keys()].map(id=>[id,1]));}
      else return this.load(profile,options);
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
    /* fix21: ด่านสุดท้าย กันกุศลหาย */try{const w=changes.find(([id])=>id==='wallet');if(w&&w[1]&&this.parts.has('wallet')){const m=x=>{try{return Number(JSON.parse(x.payload).merit)||0;}catch(e){return 0;}};const o=m(this.parts.get('wallet')),n=m(w[1]);if((o>=1e5&&n<o*.5)||(o>=1e3&&n<=0))throw Object.assign(new Error('🛡️ กันกุศลหาย: กุศลจะลดจาก '+o.toLocaleString()+' เหลือ '+n.toLocaleString()+' ในครั้งเดียว ไม่บันทึก กรุณารีเฟรช'),{code:'save/merit-guard'});}}catch(e){if(e.code==='save/merit-guard')throw e;}
/* fix35b 🛡️ ด่านกันกุศลหายแบบสะสม: ฐาน = ค่าที่คลาวด์ยืนยันล่าสุด (โหลด/รายการระบบกลาง) หรือจุดสูงสุดที่เครื่องนี้เซฟใน 60 นาที · ลดเกิน 25% และ ≥ 200,000 (หรือ ≥ 2 ล้าน) โดยไม่ผ่านระบบกลาง = ไม่บันทึก · จดทุกครั้งที่ลด */try{const w=changes.find(([id])=>id==='wallet');if(w&&w[1]&&this.parts.has('wallet')){const m=x=>{try{return Number(JSON.parse(x.payload).merit)||0;}catch(e){return 0;}};const o=m(this.parts.get('wallet')),n=m(w[1]);const now=Date.now();if(!this.mA||now-this.mA.t>3600e3){this.mA={m:o,t:now};this.mPeak=o;}this.mPeak=Math.max(this.mPeak||0,o);if(n<o){const base=Math.max(this.mA.m,this.mPeak,o),drop=base-n;let trips=0;try{trips=Number(sessionStorage.getItem('s4mg-'+this.uid))||0;}catch(e){}const bad=(drop>=200000&&drop>base*.25)||drop>=2e6||(trips>=2&&drop>=50000);try{if(window.__meritLog)window.__meritLog({from:o,to:n,base,blocked:bad,trips});}catch(e){}if(bad){try{sessionStorage.setItem('s4mg-'+this.uid,String(trips+1));}catch(e){}throw Object.assign(new Error('🛡️ กันกุศลหาย: กุศลลดจาก '+base.toLocaleString()+' เหลือ '+n.toLocaleString()+' ภายใน 1 ชั่วโมงโดยไม่ผ่านระบบกลาง ไม่บันทึก · ดึงค่าจริงกลับมาแล้ว'),{code:'save/merit-guard'});}}}}catch(e){if(e.code==='save/merit-guard')throw e;}
    /* fix29: ด่านสุดท้าย กันกระเป๋าหายยกใบ */try{const w=changes.find(([id])=>id==='inventory');if(w&&w[1]&&this.parts.has('inventory')){const tot=x=>{let t=0;const walk=o=>{for(const v of Object.values(o||{})){if(v&&typeof v==='object'&&!Array.isArray(v))walk(v);else if(typeof v==='number'&&v>0)t+=v;}};try{const p=JSON.parse(x.payload);walk(p.bag);for(const m of (p.$moduleInventory||[]))walk(m&&m.data);}catch(e){}return t;};const o=tot(this.parts.get('inventory')),n=tot(w[1]);if(o>=20&&n<o*.4)throw Object.assign(new Error('🛡️ กันกระเป๋าหาย: ของจะลดจาก '+o.toLocaleString()+' เหลือ '+n.toLocaleString()+' ชิ้นในครั้งเดียว ไม่บันทึก'),{code:'save/inv-guard'});}}catch(e){if(e.code==='save/inv-guard')throw e;}
    if(!changes.length && fields.every(f=>f==='g'))return;
    const meta={by:this.session};
    for(const f of fields)if(f!=='g'&&f!=='size'&&f!=='storageVersion')meta[f]=profile[f];
    // fix16: จำ rev ที่ใช้คำนวณก่อนเริ่ม · ถ้าระหว่างนั้นมีรายการอื่นบันทึกส่วนเดียวกัน (เช่น รับไปรษณีย์) ต้องไม่เขียนทับของเขา
    const expected=new Map(changes.map(([id])=>[id,this.revs.get(id)||0]));
    await runTransaction(this.db,async tx=>{
      const root=await tx.get(this.root());if(!root.exists()||root.data().session!==this.session)throw conflict();
      const snaps=await Promise.all(changes.map(([id])=>tx.get(this.ref(id))));
      /* fix38: rev ไม่ตรงแต่ session ตรง = ส่วนนั้นถูกระบบกลาง/แอดมิน/เพื่อนแก้ ไม่ใช่เครื่องอื่น → แจ้งรายชื่อส่วนให้ไปดึงมารวมใหม่ */{const stale=[];snaps.forEach((s,i)=>{if((s.exists()?s.data().rev:0)!==expected.get(changes[i][0]))stale.push(changes[i][0]);});if(stale.length)throw Object.assign(new Error('ส่วนเซฟ '+stale.join(', ')+' ถูกแก้จากระบบกลาง กำลังรวมข้อมูลใหม่'),{code:'save/stale',ids:stale});}
      changes.forEach(([id,p],i)=>{if(p)tx.set(this.ref(id),{...p,rev:expected.get(id)+1,by:this.session,updatedAt:serverTimestamp()});else tx.delete(this.ref(id));});
      const added=changes.filter(([id,p])=>p&&!this.parts.has(id)).length,removed=changes.filter(([id,p])=>!p&&this.parts.has(id)).length;
      const count=this.partial?(root.data().partCount||0)+added-removed:next.size;
      if(count>MAX_PARTS)throw new Error('มีส่วนเซฟเกินขอบเขต');
      tx.update(this.root(),{...meta,...(next.has("wallet")?{displayMerit:joinGame(next.values()).merit||0}:{}),partCount:count,maxPartBytes:Math.max(root.data().maxPartBytes||0,...[...next.values()].map(p=>bytes(p.payload))),saveRevision:(root.data().saveRevision||0)+1});
    });
    for(const [id,p] of changes){if(p){this.parts.set(id,p);this.revs.set(id,expected.get(id)+1);}else{this.parts.delete(id);this.revs.delete(id);}}
  }
  /* fix38 🔀 ดึงส่วนเซฟที่ระบุ (หรือทั้งหมด) จากคลาวด์มาใหม่ แล้วรวมกับค่าในเครื่องแบบ 3 ทาง · คืนเกมที่รวมแล้ว (parts/revs = ค่าคลาวด์ ให้รอบเซฟถัดไปเขียนเฉพาะส่วนต่าง) */
  async resync(ids,mineGame){
    const base=joinGame([...this.parts.values()]);
    const docs=ids?await Promise.all(ids.map(id=>getDoc(this.ref(id)))):await this.readParts();
    const rows=[];docs.forEach((d,i)=>{const id=ids?ids[i]:d.id;if(d.exists()){rows.push({id,part:d.data()});}else{this.parts.delete(id);this.revs.set(id,0);this.loadedIds.add(id);}});
    if(!ids){for(const id of [...this.parts.keys()])if(!rows.some(r=>r.id===id)){this.parts.delete(id);this.revs.delete(id);}}
    this.accept(rows);
    const theirs=joinGame([...this.parts.values()]),mine=mineGame||base;const out={};
    const keys=new Set([...Object.keys(base),...Object.keys(mine),...Object.keys(theirs)]);
    for(const k of keys){if(k==='_ls'){/* เลย์เอาต์ 3D: เครื่องที่กำลังเล่นชนะรายคีย์ */const b=base._ls||{},m=mine._ls||{},t=theirs._ls||{},o={};for(const kk of new Set([...Object.keys(m),...Object.keys(t)])){if(kk in m&&kk in t)o[kk]=same(m[kk],b[kk])?t[kk]:m[kk];else if(kk in m){if(!(kk in b)||!same(m[kk],b[kk]))o[kk]=m[kk];}else if(!(kk in b)||!same(t[kk],b[kk]))o[kk]=t[kk];}out._ls=o;continue;}
      const v=merge3(base[k],mine[k],theirs[k]);if(v!==undefined)out[k]=v;}
    this.resynced=(this.resynced||0)+1;return out;}
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
      tx.update(this.root(),{displayMerit:game.merit||0,avatar:(g=>{const v=g&&g.av;if(typeof v==='string'&&/^preset:[a-z0-9-]{1,40}$/.test(v))return v;const t=g&&g.avs;return typeof t==='string'&&t.startsWith('data:image/')&&t.length<4000?t:null;})(game),coins:(root.data().coins||0)+(m.coins||0),mailCount:Math.max(0,(root.data().mailCount||0)-1),by:this.session,partCount:(root.data().partCount||0)+changes.filter(([id,p])=>p&&!base.has(id)).length,maxPartBytes:Math.max(root.data().maxPartBytes||0,...[...next.values()].map(p=>bytes(p.payload))),saveRevision:(root.data().saveRevision||0)+1});
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
