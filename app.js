import {BOXES,getBoxCount} from './loot-box-catalog.js?v=ss3-recovery6';
import {lurePen} from './bird-lure-engine.js?v=ss3-recovery6';
import {showLootBoxes} from './loot-boxes.js?v=ss3-recovery6';
import {observeGameplay} from './campaign-progress.js?v=ss3-recovery6';
import {getFunctions,httpsCallable,connectFunctionsEmulator} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js';
import { deliverAdminGift } from './admin-mail.js?v=ss3-recovery6';
import { refillAdminInventory, consolidatePending } from './admin-inventory.js?v=ss3-recovery6';
// ในสวนของยัยหนู ซีซั่น 3 — ชุดที่ 1 (รากฐาน)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, orderBy, limit, writeBatch, runTransaction, increment, serverTimestamp, Timestamp, FieldPath, addDoc, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { SplitSaveStore } from './save-store.js?v=ss3-recovery6';
import { splitGame,joinGame } from './save-schema.js?v=ss3-recovery6';
import { installBackupUI } from './save-backup.js?v=ss3-recovery6';
import { CATALOG } from './catalog.js?v=ss3-recovery6';

const firebaseConfig = {
  apiKey: 'AIzaSyAwg72Kj2gMsv9cOCCwmLiEY6CioF_1b64',
  authDomain: 'yainoo-ghost-farm.firebaseapp.com',
  projectId: 'yainoo-ghost-farm',
  storageBucket: 'yainoo-ghost-farm.firebasestorage.app',
  messagingSenderId: '223708504826',
  appId: '1:223708504826:web:8f0f71ebf84cb6c4545f43'
};
const SAVE_VERSION = 1;
const SAVE_EVERY_MS = 30000;          // รวบบันทึกทุก 30 วิ
const SIZE_WARN = 200 * 1024;          // เตือนแอดมินเมื่อเซฟเกิน 200KB
const SIZE_BLOCK = 800 * 1024;         // ไม่ยอมบันทึกเกิน 800KB (เพดาน Firestore 1MB)
const MAIL_DAYS = 60;                  // ซองในไปรษณีย์หมดอายุ 60 วัน

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions=getFunctions(app,'us-central1');
const db = getFirestore(app);
const CAT = Object.fromEntries(CATALOG.map(c => [c.k, c]));
const IMG = n => 'images/' + n;
const COIN_IMG = IMG('gacha-coin.webp');

// ---------- เครื่องมือหน้าจอ ----------
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.round(n || 0).toLocaleString('en-US');
let store;
let campaignConfig={},campaignStop=null,campaignBoxes=[];
const BASE_PARTS=['inventory','wallet'];
const SCREEN_PARTS={
 loading:[],farm:['animals-farmdrops','farm-settings','farm-1','farm-2','farm-3','farm-4','module-s3fg-col','module-s3by-entry'],
 house:['house'],backyard:['backyard','module-s3by-entry'],forest:['module-s3forest-v1'],
 barn:['animals-barn'],birds:['animals-birds'],dog:['animals-dog'],alpaca:['animals-alpaca'],
 catpen:['catpen'],safari:['inventory','wallet','animals-safari'],shop:['animals-market'],outings:['outings','house'],
 boat:[],farmshop:['animals-farmshop'],adminshop:[],fishing:['animals-fishing'],
 minigames:['animals-minigames'],campaigns:['animals-campaigns'],topspenders:[]
};
const sceneSubscriptions=new Set();
let sceneVersion=0,campaignJobs=[];
function stopSceneSubscriptions(){sceneVersion++;for(const stop of sceneSubscriptions)stop();sceneSubscriptions.clear();campaignConfig={};S.campaignConfigAt=0;}
function sceneWatch(ref,fn){const version=sceneVersion;let stop=onSnapshot(ref,snap=>{if(version===sceneVersion)fn(snap.exists()?snap.data():null);},e=>{if(version===sceneVersion)showSave(e.message,true);});sceneSubscriptions.add(stop);return()=>{stop();sceneSubscriptions.delete(stop);};}
function queueGameplay(before,after,source,boxes){
 const increased=(a,b)=>Object.entries(b||{}).some(([k,v])=>typeof v==='number'&&v>(a?.[k]||0));
 const pet=['barn','birds','dog','alpaca','catpen'].includes(source);
 const craft=['farm','house','backyard'].includes(source);
 const stockChanged=pet&&JSON.stringify(before.bag)!==JSON.stringify(after.bag);
 const meritChanged=pet&&(after.merit||0)>(before.merit||0);
 const craftChanged=craft&&['food','gfood','wine','flower','hedge','crop'].some(k=>increased(before.bag?.[k],after.bag?.[k]));
 if(boxes.length||stockChanged||meritChanged||craftChanged)campaignJobs.push({before:clone(before),after:clone(after),source,boxes,now:Date.now()});
}
async function prepareGameplay(){
 if(!campaignJobs.length)return;
 const jobs=campaignJobs.slice();
 await store.loadIds(['animals-campaigns']);
 if(!S.campaignConfigAt||Date.now()-S.campaignConfigAt>=60000){const cfg=await getDoc(doc(db,'world','campaigns'));campaignConfig=cfg.exists()?cfg.data():{};S.campaignConfigAt=Date.now();}
 let progress=clone(S.P.g.sub?.campaigns||joinGame(store.parts.values()).sub?.campaigns||{});
 for(const job of jobs){
   const before=clone(job.before),after=clone(job.after);before.sub ||= {};before.sub.campaigns=progress;
   observeGameplay(before,after,job.source,campaignConfig,job.now,job.boxes);
   progress=after.sub.campaigns;
   for(const[k,n]of Object.entries(after.bag?.halloween||{})){const added=n-(job.after.bag?.halloween?.[k]||0);if(added>0){S.P.g.bag.halloween ||= {};S.P.g.bag.halloween[k]=(S.P.g.bag.halloween[k]||0)+added;}}
 }
 S.P.g.sub ||= {};S.P.g.sub.campaigns=progress;
 store.activeIds.add('animals-campaigns');campaignJobs.splice(0,jobs.length);
}
let toastT;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400); }
function modal(html, acts = [{ t: 'ตกลง' }]) {
  const c = $('#mcard'); c.innerHTML = html + '<div class="acts"></div>'; const a = c.querySelector('.acts');
  acts.forEach(x => { const b = document.createElement('button'); b.className = 'btn ' + (x.c || ''); b.textContent = x.t; b.onclick = async () => { if (!x.keep) closeModal(); if (x.f) await x.f(); }; a.appendChild(b); });
  $('#modal').classList.add('on');
}
function closeModal() { $('#modal').classList.remove('on'); }
function busy(btn, on, label) { if (!btn) return; btn.disabled = on; if (label) btn.textContent = label; }
function thaiError(e) {
  const c = (e && e.code) || '';
  if (c.includes('email-already-in-use')) return 'ชื่อนี้มีคนใช้แล้ว ลองชื่ออื่น';
  if (c.includes('invalid-credential') || c.includes('wrong-password') || c.includes('user-not-found') || c.includes('invalid-email')) return 'ชื่อหรือรหัสผ่านไม่ถูกต้อง';
  if (c.includes('weak-password')) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัว';
  if (c.includes('too-many-requests')) return 'ลองหลายครั้งเกินไป รอสักครู่แล้วลองใหม่';
  if (c.includes('network') || c.includes('unavailable')) return 'อินเทอร์เน็ตหลุด ตรวจสอบเน็ตแล้วลองใหม่';
  if (c.includes('permission-denied')) return 'ไม่มีสิทธิ์ทำรายการนี้';
  return 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง';
}

// ---------- ล้างแคชเก่าของซีซั่น 2 ----------
async function cleanOldCaches() {
  try { if ('serviceWorker' in navigator) for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister(); } catch (e) { }
  try { if (window.caches) for (const k of await caches.keys()) await caches.delete(k); } catch (e) { }
  try { localStorage.clear(); sessionStorage.clear(); } catch (e) { }   // ซีซั่น 3 ไม่เก็บอะไรในเครื่อง
}

// ---------- ชื่อผู้เล่น -> บัญชี ----------
async function emailFor(name) {
  const data = new TextEncoder().encode(name.trim().toLowerCase());
  const h = await crypto.subtle.digest('SHA-256', data);
  return 'p' + [...new Uint8Array(h)].slice(0, 20).map(b => b.toString(16).padStart(2, '0')).join('') + '@yainoo.game';
}
function checkName(n) {
  n = n.trim();
  if (n.length < 2) return 'ชื่อสั้นเกินไป (อย่างน้อย 2 ตัว)';
  if (n.length > 10) return 'ชื่อยาวเกินไป (ไม่เกิน 10 ตัว)';
  if (/[<>"'\\/]/.test(n)) return 'ชื่อมีตัวอักษรพิเศษที่ใช้ไม่ได้';
  return '';
}

// ---------- สถานะ ----------
const S = { user: null, admin: false, settings: { open: false }, sessionId: '', P: null, dirty: new Set(), blocked: false, saving: false, timer: null };
const newSession = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
function defaultPlayer(name) {
  return { v: SAVE_VERSION, name, approval: 'pending', kusal: 0, coins: 0, bag: {}, mailCount: 0, level: 1, createdAt: serverTimestamp(), lastLogin: serverTimestamp(), session: '', by: '' };
}

// ---------- ระบบเซฟ ----------
// หลัก: เปลี่ยนค่าในเครื่องทันที -> จดว่าช่องไหนเปลี่ยน -> รวบส่งทุก 30 วิ และตอนพับแอป
// ของสำคัญใช้ critical() ส่งทันทีแบบสำเร็จหมดหรือไม่เกิดเลย
// แยกเซฟตามระบบใน players/{uid}/saves ไม่เก็บเกมรวมในเอกสารผู้เล่น
// เล่นได้ทีละ 1 เครื่อง: ทุกการบันทึกแนบรหัสเครื่อง กฎ Firebase ปฏิเสธเครื่องเก่า
const playerRef = () => doc(db, 'players', S.user.uid);
let cloudSaveTimer;
function change(field) {
  if(field === 'g' && S.P?.g)refillAdminInventory(S.P.g,S.admin,CATALOG);
  S.dirty.add(field); showSave('กำลังบันทึกบนคลาวด์…');
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => flush().catch(() => {}), 0);
}
function addItem(key, n) { S.P.bag[key] = Math.max(0, (S.P.bag[key] || 0) + n); if (!S.P.bag[key]) delete S.P.bag[key]; change('bag'); }
function sizeOf(o) { return new Blob([JSON.stringify(o)]).size; }
let saveDotT;
function showSave(t, bad) { const d = $('#saveDot'); d.hidden = false; d.textContent = t; d.classList.toggle('bad', !!bad); clearTimeout(saveDotT); if (!bad && t.includes('✓')) saveDotT = setTimeout(() => d.hidden = true, 1500); }
async function flush() {
  if (!S.user || !S.P || S.blocked || !S.dirty.size) return;
  if (S.saving) { await S.saving; return flush(); }
  if(S.preparing){await S.preparing;return flush();}
  S.preparing=prepareGameplay();try{await S.preparing;}finally{S.preparing=null;}
  const fields = [...S.dirty]; S.dirty.clear();
  const snapshot = {...S.P, g: clone(S.P.g)};
  S.saving = store.save(snapshot, fields);
  try { await S.saving; showSave('บันทึกแล้ว ✓'); }
  catch (e) { fields.forEach(f => S.dirty.add(f)); onSaveError(e); throw e; }
  finally { S.saving = false; if (S.frame && !S.blocked && !S.dirty.size) S.frame.style.pointerEvents = ''; }
}
function onSaveError(e) {
  if (e.code === 'save/conflict') { otherDevice(); return; }
  if ((e.code || '').includes('permission-denied')) { showSave('Firebase ไม่อนุญาตให้บันทึก ตรวจ Rules ก่อนเล่นต่อ', true); return; }
  if ((e.code || '').startsWith('save/')) { showSave(e.message, true); return; }
  showSave('ยังบันทึกไม่ได้ จะลองใหม่อัตโนมัติ', true);
}
function otherDevice() {
  S.blocked = true; clearInterval(S.timer);
  modal('<h2>📱 บัญชีนี้เปิดอยู่ที่เครื่องอื่น</h2><p>เล่นได้ทีละ 1 เครื่อง เครื่องนี้หยุดบันทึกแล้ว เพื่อไม่ให้เซฟทับกันจนของหาย</p><p class="note">ถ้าจะเล่นที่เครื่องนี้ต่อ กด "เล่นที่เครื่องนี้" ระบบจะโหลดเซฟล่าสุดจากเครื่องอื่นมาให้</p>',
    [{ t: 'ออกจากระบบ', c: 'gray', f: () => signOut(auth) }, { t: 'เล่นที่เครื่องนี้', f: () => location.reload() }]);
}
async function critical(fn, okMsg) {
  // ส่งค่าที่ค้างก่อน แล้วทำรายการสำคัญใน transaction เดียว
  await flush();
  try { const r = await runTransaction(db, fn); if (okMsg) toast(okMsg); return r; }
  catch (e) { if ((e.code || '').includes('permission-denied')) otherDevice(); else if (e.thai) toast(e.thai); else toast(thaiError(e)); throw e; }
}
function startSaver() {
  clearInterval(S.timer); S.timer = setInterval(() => flush().catch(() => {}), SAVE_EVERY_MS);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush().catch(() => {}); });
  window.addEventListener('pagehide', () => flush().catch(() => {}));
  window.addEventListener('online', () => flush().catch(() => {}));
}

// ---------- เข้าเกม ----------
async function loadSettings() {
  try { const s = await getDoc(doc(db, 'settings', 'global')); S.settings = s.exists() ? s.data() : { open: false }; } catch (e) { S.settings = { open: false }; }
}
async function enter(user) {
  S.user = user; S.sessionId = newSession();cloudPending.clear();cloudSequences.clear();campaignBoxes=[];
  let stage='ตรวจบัญชีและสิทธิ์แอดมิน';
  try {
    const [adm, snap] = await Promise.all([getDoc(doc(db, 'admins', user.uid)), getDoc(playerRef())]);
    S.admin = !!(adm && adm.exists());
    stage='เปิดข้อมูลบัญชีบนคลาวด์';
    if (!snap.exists()) {
      const name = S.pendingName || 'ผู้เล่น';
      const p = defaultPlayer(name); p.session = S.sessionId; p.by = S.sessionId;
      await setDoc(playerRef(), p); S.P = { ...p, bag: {} };
    } else {
      S.P = snap.data(); S.P.bag = S.P.bag || {};
      await updateDoc(playerRef(), { session: S.sessionId, by: S.sessionId, lastLogin: serverTimestamp() });
    }
    S.pendingName = '';
    if(!S.admin && S.P.approval && S.P.approval !== 'approved'){renderApproval();return;}
    if(S.admin)watchPendingMembers();
    stage='โหลดกระเป๋าและเงินจากคลาวด์';
    store = new SplitSaveStore(db, user.uid, S.sessionId);
    S.P = await store.load(S.P,{ids:BASE_PARTS});
    stage='ตรวจและเติมกระเป๋าแอดมิน';
    const consolidated = consolidatePending(S.P.g,{"wool": "sub.alpaca.bag.wool", "wool-gold": "sub.alpaca.bag.wool-gold", "ameat": "sub.alpaca.bag.ameat", "ameat-p": "sub.alpaca.bag.ameat-p", "rawwool": "sub.alpaca.bag.rawwool", "rawwool-gold": "sub.alpaca.bag.rawwool-gold", "yarn-white": "sub.alpaca.bag.yarn-white", "yarn-pink": "sub.alpaca.bag.yarn-pink", "yarn-blue": "sub.alpaca.bag.yarn-blue", "scarf-red": "sub.alpaca.bag.scarf-red", "beanie-blue": "sub.alpaca.bag.beanie-blue", "plush-mini": "sub.alpaca.bag.plush-mini", "afood0": "sub.alpaca.bag.afood0", "afood1": "sub.alpaca.bag.afood1", "afood2": "sub.alpaca.bag.afood2"});
    let retired=false;for(const k of ['w1','w2','w3','w4','w5','w6'])if(k in (S.P.g.bag?.gfood||{})){delete S.P.g.bag.gfood[k];retired=true;}
    const refilled = refillAdminInventory(S.P.g,S.admin,CATALOG);
    if(consolidated || refilled || retired){stage='บันทึกกระเป๋าแอดมินบนคลาวด์';await store.save(S.P,['g']);}
    campaignJobs=[];stopSceneSubscriptions();
    stage='เปิดหน้าโหลดสวน';
    startSaver();await loadSettings();if(!S.admin&&!S.settings.open){renderClosed();return;}renderGame('loading');
  } catch (e) {
    clearInterval(S.timer);
    const message=e?.message||'ไม่พบรายละเอียด',code=e?.code||'ไม่ระบุรหัส';
    $('#app').innerHTML = `<div class="boot"><div style="text-align:center;padding:1rem;max-width:90vw"><h3>ยังเปิดสวนไม่ได้</h3><p>${esc(thaiError(e))}</p><p style="font-size:13px;overflow-wrap:anywhere">ติดขั้นตอน: ${esc(stage)}<br>รหัส: ${esc(code)}<br>${esc(message)}</p><p style="font-size:12px">ถ่ายภาพหน้านี้เพื่อให้ตรวจสาเหตุได้</p><button class="btn" onclick="location.reload()">ลองใหม่</button></div></div>`;
  }
}

// ---------- หน้าล็อกอิน (ตามหน้าทดลอง: ฉากเต็มจอ กด "เข้าสวน" แล้วการ์ดค่อยเลื่อนขึ้น ปิดได้) ----------
const HOF = { 2: { d: '4 ก.ย. – 2 ต.ค. 2569', r: [['Porpla', '7,850,112'], ['Kongkwan', '7,496,899'], ['Earn', '6,838,263']] }, 1: { d: '7 – 26 ส.ค. 2569', r: [['Earn', '369,245'], ['Porpla', '359,478'], ['Kongkwan', '341,483']] } };
let waterOn = false;
function renderLogin() {
  let mode = 'login';
  const L = t => `<div class="L"><span class="b">${t}</span><span class="f">${t}</span><span class="s">${t}</span></div>`;
  $('#app').innerHTML = `<div class="lscene"></div><canvas id="water"></canvas>
    <header class="ltitle"><div class="tw"><div class="t1">${L('ในสวนของยัยหนู')}</div><div class="t2">${L('ซีซั่น 3')}</div></div></header>
    <button class="hof-btn" id="hofBtn" aria-label="หอเกียรติยศ">🏆</button>
    <button class="lstart" id="lstart">เข้าสวน</button>
    <main class="lcard" id="lcard"><button class="lclose" id="lclose" aria-label="ปิด">✕</button>
      <div class="ltabs"><button class="on" data-m="login">เข้าสวน</button><button data-m="reg">สมัครใหม่</button></div>
      <label class="llab" for="ln">ชื่อในเกม</label><div class="lfield"><i>🌱</i><input id="ln" placeholder="เช่น มดแดง" autocomplete="username" maxlength="10"></div>
      <p class="lhint">ตั้งได้ 2–10 ตัวอักษร ชื่อนี้ใช้ทั้งซีซั่นนะ</p>
      <label class="llab" for="lp">รหัสผ่าน</label><div class="lfield"><i>🔑</i><input id="lp" type="password" placeholder="อย่างน้อย 6 ตัว" autocomplete="current-password"></div>
      <div class="lconf"><label class="llab" for="lp2">ยืนยันรหัสผ่าน</label><div class="lfield"><i>🔑</i><input id="lp2" type="password" placeholder="พิมพ์รหัสผ่านอีกครั้ง" autocomplete="new-password"></div></div>
      <div class="err" id="lerr"></div>
      <button class="lgo" id="lgo">เข้าสวนเลย</button><p class="lfoot">ลืมรหัสผ่าน? ทักแอดมินได้เลยจ้า</p></main>`;
  const card = $('#lcard'), go = $('#lgo'), start = $('#lstart');
  start.onclick = () => { card.classList.add('open'); start.classList.add('hide'); };
  $('#lclose').onclick = () => { card.classList.remove('open'); start.classList.remove('hide'); };
  document.querySelectorAll('.ltabs button').forEach(b => b.onclick = () => {
    document.querySelectorAll('.ltabs button').forEach(x => x.classList.toggle('on', x === b));
    mode = b.dataset.m; card.classList.toggle('reg', mode === 'reg'); go.textContent = mode === 'reg' ? 'สมัครแล้วเข้าสวน' : 'เข้าสวนเลย'; $('#lerr').textContent = '';
  });
  $('#hofBtn').onclick = () => {
    const show = n => { const x = HOF[n], col = (i, c) => `<div class="col c${c}"><div class="av">${x.r[i][0][0]}</div><div class="nm">${x.r[i][0]}</div><div class="pt">${x.r[i][1]} pts</div><div class="step">${c}</div></div>`;
      $('#hofD').textContent = x.d; $('#pod').innerHTML = col(1, 2) + col(0, 1) + col(2, 3); document.querySelectorAll('.seg button').forEach(b => b.classList.toggle('on', b.dataset.s == n)); };
    modal(`<div class="hofbox"><div class="ribbon">🏆 หอเกียรติยศ</div><div class="seg"><button data-s="2">ซีซั่น 2</button><button data-s="1">ซีซั่น 1</button></div><div class="dates" id="hofD"></div><div class="podium" id="pod"></div><div class="ground"></div></div>`, [{ t: 'ปิด', c: 'gray' }]);
    document.querySelectorAll('.seg button').forEach(b => b.onclick = () => show(b.dataset.s)); show(2);
  };
  const doGo = async () => {
    const name = $('#ln').value.trim(), pw = $('#lp').value, err = $('#lerr');
    const bad = checkName(name); if (bad) { err.textContent = '🐷 ' + bad; return; }
    if (pw.length < 6) { err.textContent = '🐷 รหัสผ่านต้องมีอย่างน้อย 6 ตัวนะ'; return; }
    if (mode === 'reg' && pw !== $('#lp2').value) { err.textContent = '🐷 รหัสผ่านสองช่องไม่ตรงกันนะ'; return; }
    err.textContent = ''; busy(go, true, 'กำลังเข้าสวน…');
    try {
      const email = await emailFor(name);
      if (mode === 'reg') { S.pendingName = name; await createUserWithEmailAndPassword(auth, email, pw); }
      else await signInWithEmailAndPassword(auth, email, pw);
    } catch (e) { err.textContent = '🐷 ' + thaiError(e); busy(go, false, mode === 'reg' ? 'สมัครแล้วเข้าสวน' : 'เข้าสวนเลย'); }
  };
  go.onclick = doGo;
  card.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') doGo(); }));
  startWater();
}
function startWater() {
  // น้ำกระเซ็น + ประกายน้ำ เป็นภาพเคลื่อนไหวในเครื่องล้วน ไม่แตะฐานข้อมูล
  if (waterOn || matchMedia('(prefers-reduced-motion: reduce)').matches) return; waterOn = true;
  const c = $('#water'); if (!c) { waterOn = false; return; } const x = c.getContext('2d');
  let W, H, drops = [], rings = [], glints = [];
  const size = () => { const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0); };
  size(); addEventListener('resize', size);
  const rnd = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < 26; i++) glints.push({ x: rnd(0, 1), y: rnd(.55, 1), p: rnd(0, 6.28), s: rnd(.6, 2.2) });
  let last = 0, acc = 0;
  const tick = t => {
    if (!document.getElementById('water')) { waterOn = false; return; }
    const dt = Math.min((t - last) / 16.7, 3); last = t; acc += dt;
    if (acc > 9) { acc = 0; const sx = rnd(0, W), sy = rnd(H * .62, H * .97); for (let i = 0; i < (rnd(6, 12) | 0); i++) drops.push({ x: sx, y: sy, vx: rnd(-1.4, 1.4), vy: rnd(-5.5, -2.5), r: rnd(1.5, 4), life: 1 }); rings.push({ x: sx, y: sy + 4, r: 2, a: .7 }); }
    x.clearRect(0, 0, W, H);
    for (const g of glints) { g.p += .05 * dt; const a = Math.max(0, Math.sin(g.p)) * .85; if (a < .05) continue; const gx = g.x * W, gy = g.y * H, s = g.s * 2.2;
      x.fillStyle = 'rgba(255,255,255,' + a + ')'; x.beginPath(); x.moveTo(gx, gy - s * 2); x.lineTo(gx + s * .5, gy); x.lineTo(gx, gy + s * 2); x.lineTo(gx - s * .5, gy); x.fill();
      x.beginPath(); x.moveTo(gx - s * 2, gy); x.lineTo(gx, gy + s * .5); x.lineTo(gx + s * 2, gy); x.lineTo(gx, gy - s * .5); x.fill(); }
    rings = rings.filter(r => r.a > .02); for (const r of rings) { r.r += .9 * dt; r.a *= Math.pow(.95, dt); x.strokeStyle = 'rgba(255,255,255,' + r.a + ')'; x.lineWidth = 1.5; x.beginPath(); x.ellipse(r.x, r.y, r.r * 1.8, r.r * .55, 0, 0, 6.283); x.stroke(); }
    drops = drops.filter(d => d.life > 0 && d.y < H + 10);
    for (const d of drops) { d.vy += .18 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.life -= .012 * dt; x.fillStyle = 'rgba(235,250,255,' + (d.life * .9) + ')'; x.beginPath(); x.arc(d.x, d.y, d.r, 0, 6.283); x.fill(); }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(t => { last = t; tick(t); });
}

// ---------- เกมปิดอยู่ ----------
let approvalStop=null,pendingStop=null,pendingCount=0;
function renderApproval(){
 clearInterval(S.timer);S.frame=null;stopSceneSubscriptions();approvalStop?.();
 const rejected=S.P.approval==='rejected';
 $('#app').innerHTML=`<div class="home"><div class="soon"><h2>${rejected?'คำขอสมัครยังไม่ได้รับอนุมัติ':'📋 สมัครสำเร็จ รอยัยหนูอนุมัติ'}</h2><p>ชื่อ ${esc(S.P.name)} · กระเป๋าและเงินเริ่มต้นเป็นศูนย์</p><p>เมื่ออนุมัติแล้ว ระบบจะเปิดสวนให้เมื่อเกมเปิด ไม่ต้องสมัครใหม่</p><button class="btn" id="approvalRetry">ตรวจสถานะอีกครั้ง</button> <button class="btn gray" id="approvalOut">ออกจากระบบ</button></div></div>`;
 $('#approvalRetry').onclick=()=>enter(S.user);$('#approvalOut').onclick=()=>{approvalStop?.();approvalStop=null;signOut(auth);};
 approvalStop=onSnapshot(playerRef(),snap=>{if(snap.exists()&&snap.data().approval==='approved'){approvalStop?.();approvalStop=null;enter(S.user);} });
}
function watchPendingMembers(){pendingStop?.();pendingStop=onSnapshot(query(collection(db,'players'),where('approval','==','pending'),limit(200)),snap=>{pendingCount=snap.size;const b=document.querySelector('[data-t="approvals"]');if(b)b.textContent='📋 สมาชิกใหม่ ('+pendingCount+')';if(A.tab==='send'&&A.sendLoaded&&document.querySelector('#gT')){A.captureSend?.();A.players=null;A.sendLoaded=false;tabSend();}});}
async function tabApprovals(){
 const B=$('#aBody');B.innerHTML='<div class="box">กำลังอ่านคำขอสมัคร…</div>';
 try{const ps=await loadPlayers(true);B.innerHTML=`<div class="box"><h3>📋 รออนุมัติ (${ps.filter(p=>p.approval==='pending').length})</h3>${ps.filter(p=>p.approval==='pending').map(p=>`<div class="row"><div style="flex:1"><b>${esc(p.name)}</b><small style="display:block">สมัคร ${p.createdAt?.toDate?.().toLocaleString('th-TH')||'-'}</small></div><button class="btn sm" data-approve="${p.uid}">อนุมัติ</button><button class="btn sm gray" data-reject="${p.uid}">ไม่อนุมัติ</button></div>`).join('')||'<p>ไม่มีคำขอรออยู่</p>'}</div><div class="box"><h3>ประวัติการอนุมัติ</h3>${ps.filter(p=>p.approval&&p.approval!=='pending').map(p=>`<p>${esc(p.name)} · ${p.approval==='approved'?'อนุมัติแล้ว':'ไม่อนุมัติ'} · ${p.approvedAt?.toDate?.().toLocaleString('th-TH')||'-'}</p>`).join('')||'<p>ยังไม่มีรายการ</p>'}</div>`;
 const decide=async(uid,status)=>{try{await updateDoc(doc(db,'players',uid),{approval:status,approvedAt:serverTimestamp(),approvedBy:S.user.uid});A.players=null;A.sendLoaded=false;if(status==='rejected'){A.sel.delete(uid);if(A.packs)delete A.packs[uid];}toast(status==='approved'?'อนุมัติแล้ว สมาชิกเข้าเล่นได้เมื่อเกมเปิด':'บันทึกไม่อนุมัติแล้ว');tabApprovals();}catch(e){toast(thaiError(e));}};
 B.querySelectorAll('[data-approve]').forEach(b=>b.onclick=()=>decide(b.dataset.approve,'approved'));B.querySelectorAll('[data-reject]').forEach(b=>b.onclick=()=>decide(b.dataset.reject,'rejected'));
 }catch(e){B.textContent=thaiError(e);}
}
function renderClosed() {
  $('#app').innerHTML = `<div class="home"><div class="soon"><h2>🌙 สวนกำลังจะเปิด</h2><p>ยัยหนูกำลังเตรียมซีซั่น 3 อยู่ เข้าระบบไว้แล้ว รอประกาศในกลุ่มได้เลย</p>
    <div class="grid2"><button class="tile" id="tMail"><span>📮</span>ไปรษณีย์</button><button class="tile" id="tOut"><span>🚪</span>ออกจากระบบ</button></div></div></div>`;
  $('#tMail').onclick = openMail; $('#tOut').onclick = logout;
}
function refreshBar() { }
async function logout() { frameSave(); await flush(); stopSceneSubscriptions();S.frame=null;await signOut(auth); }

// ---------- โฮสต์เกม: แต่ละหน้าเกมโหลดใน iframe และเซฟผ่านตัวกลางนี้ ----------
const GAME_KEY = 's3all-v1';
// g คือภาพข้อมูลในหน่วยความจำเพื่อรองรับหน้าชุด 2–3 เดิม; ฐานข้อมูลแยกเอกสารแล้ว
const MATS = { 'ข้าวโพด': 'crop.corn', 'ฟักทอง': 'crop.pumpkin', 'แตงโม': 'crop.watermelon', 'แตงกวา': 'crop.cucumber', 'แครอท': 'crop.carrot', 'องุ่น': 'crop.grape', 'สตรอว์เบอร์รี': 'crop.strawberry', 'เห็ดไขลาน': 'crop.mushroom', 'มันฝรั่ง': 'crop.potato', 'ขนเม่น': 'hedge.quills', 'หางเม่น': 'hedge.tail', 'ชีส': 'product.cheese', 'เกล็ดปลาจันทร์': 'product.scale' };
const SUBS = {
  ...{"s3safari1": {"id": "safari", "maps": {"bag.c-waterspinach": "bag.crop.waterspinach", "bag.c-lettuce": "bag.crop.lettuce", "bag.c-mango": "bag.crop.mango", "bag.c-chili": "bag.crop.chili", "bag.c-pumpkin": "bag.crop.pumpkin", "bag.c-lychee": "bag.crop.lychee", "bag.c-strawberry": "bag.crop.strawberry", "bag.c-grape": "bag.crop.grape", "bag.c-banana": "bag.crop.banana", "bag.c-gooseberry": "bag.crop.gooseberry", "bag.c-carrot": "bag.crop.carrot", "bag.c-corn": "bag.crop.corn", "bag.c-mushroom": "bag.crop.mushroom", "bag.c-melon": "bag.crop.melon", "bag.c-bamboo": "bag.crop.bamboo", "bag.c-plankton": "bag.crop.plankton", "bag.c-potato": "bag.crop.potato", "bag.c-cucumber": "bag.crop.cucumber", "bag.c-watermelon": "bag.crop.watermelon", "bag.c-cabbage": "bag.crop.cabbage", "bag.c-pea": "bag.crop.pea", "bag.c-tomato": "bag.crop.tomato", "bag.a-egg": "bag.product.egg", "bag.a-feather": "bag.product.feather", "bag.a-drumstick": "bag.product.drumstick", "bag.a-fishmeat": "bag.product.fishmeat", "bag.a-roe": "bag.product.roe", "bag.a-scale": "bag.product.scale", "bag.a-truffle": "bag.product.truffle", "bag.a-pork": "bag.product.pork", "bag.a-trotter": "bag.product.trotter", "bag.a-milk": "bag.product.milk", "bag.a-cheese": "bag.product.cheese", "bag.a-cream": "bag.product.cream", "bag.b-ostrich-egg": "bag.bird.ostrich-egg", "bag.b-ostrich-feather": "bag.bird.ostrich-feather", "bag.b-dodo-egg": "bag.bird.dodo-egg", "bag.b-dodo-feather": "bag.bird.dodo-feather", "bag.b-dodo-pebble": "bag.bird.dodo-pebble", "bag.f-0": "bag.food.ข้าวผัดไข่", "bag.f-1": "bag.food.ซุปฟักทอง", "bag.f-2": "bag.food.ปลาย่างซอสมะม่วง", "bag.f-3": "bag.food.สตูว์รวมมิตร", "bag.f-4": "bag.food.ไข่อบชีส", "bag.f-5": "bag.food.น่องไก่อบครีม", "bag.f-6": "bag.food.ขนมลิ้นจี่มะยม", "bag.f-7": "bag.food.จานรวมมิตร", "bag.f-8": "bag.food.ออมเล็ตโรซี่", "bag.f-9": "bag.food.ไข่อบอัญชัน", "bag.f-10": "bag.food.ไข่ตุ๋นหกบุปผา", "bag.f-11": "bag.food.ไข่ย่างสปาฟลาวเวอร์", "bag.fl-daisy": "bag.flower.daisy", "bag.fl-rose": "bag.flower.rose", "bag.fl-butterflypea": "bag.flower.butterflypea", "bag.fl-sunflower": "bag.flower.sunflower", "bag.fl-lotus": "bag.flower.lotus", "bag.fl-orchid": "bag.flower.orchid", "bag.fl-tulip": "bag.flower.tulip", "bag.fl-lavender": "bag.flower.lavender", "bag.fl-marigold": "bag.flower.marigold", "bag.fl-hydrangea": "bag.flower.hydrangea", "bag.fl-plumeria": "bag.flower.plumeria", "bag.fl-hibiscus": "bag.flower.hibiscus", "bag.w-moon": "bag.wine.moon", "bag.w-rose": "bag.wine.rose", "bag.w-blood": "bag.wine.blood", "bag.w-eclipse": "bag.wine.eclipse", "bag.h-fang": "bag.hedge.fang", "bag.h-quills": "bag.hedge.quills", "bag.h-claw": "bag.hedge.claw", "bag.h-tail": "bag.hedge.tail"}, "fresh": {"merit": 0, "bag": {}, "tasks": {}, "sel": 1, "stats": {"runs": 0, "wins": 0, "fails": 0, "merit": 0}, "log": []}}, "s3market1": {"id": "market", "maps": {"bag.rose": "bag.wine.rose", "bag.moon": "bag.wine.moon", "bag.blood": "bag.wine.blood", "bag.eclipse": "bag.wine.eclipse"}, "fresh": {"lots": [], "bag": {}, "news": [], "modes": [], "divGot": {}, "mailSeen": 0, "mail": []}}},
  's3barn3': { id: 'barn', maps: { items: 'bag.item', bag: 'bag.product' } },
  's3birds1': { id: 'birds', maps: { bag: 'bag.bird' }, mats: MATS },
  's3dog-v1': { id: 'dog', maps: { 'bag.item': 'bag.item', 'bag.grass': 'bag.grass', 'bag.product': 'bag.product', 'bag.crop': 'bag.crop' } },
  's3alpaca-v1': { id: 'alpaca', flat: true }
};
const getp = (o, path) => path.split('.').reduce((t, k) => t == null ? undefined : t[k], o);
const setp = (o, path, v) => { const ks = path.split('.'); let t = o; while (ks.length > 1) { const x = ks.shift(); if (!t[x] || typeof t[x] !== 'object') t[x] = {}; t = t[x]; } t[ks[0]] = v; };
const delp = (o, path) => { const ks = path.split('.'); const last = ks.pop(); const t = ks.reduce((a, k) => a && a[k], o); if (t) delete t[last]; };
const clone = o => o == null ? o : JSON.parse(JSON.stringify(o));
const FLAT = CATALOG.filter(c => !c.p.startsWith('pend.') && !c.p.startsWith('sub.'));
function subGet(K) {
  const C = SUBS[K], G = S.P.g || {}; const sub = clone((G.sub && G.sub[C.id]) || C.fresh); if (!sub) return null;
  sub.merit = G.merit || 0;
  for (const a in C.maps || {}) setp(sub, a, clone(getp(G, C.maps[a])) || {});
  if (C.mats) { sub.mats = {}; for (const n in C.mats) sub.mats[n] = getp(G, 'bag.' + C.mats[n]) || 0; }
  if (C.flat) { sub.bag = sub.bag || {}; for (const c of FLAT) { const v = getp(G, 'bag.' + c.p); if (v) sub.bag[c.k] = v; else delete sub.bag[c.k]; } }
  return JSON.stringify(sub);
}
function subSet(K, v) {
  const before = JSON.stringify(S.P.g), prior=clone(S.P.g);
  const C = SUBS[K]; let o; try { o = JSON.parse(v); } catch (e) { return; }
  S.P.g = S.P.g || {}; const G = S.P.g; G.sub = G.sub || {}; const first = !G.sub[C.id];
  if (!first && typeof o.merit === 'number') G.merit = o.merit;
  delete o.merit;
  for (const a in C.maps || {}) { if (!first) setp(G, C.maps[a], getp(o, a) || {}); delp(o, a); }
  if (C.mats) { if (!first) for (const n in C.mats) setp(G, 'bag.' + C.mats[n], (o.mats || {})[n] || 0); delete o.mats; }
  if (C.flat) { for (const c of FLAT) { if (!first && o.bag) setp(G, 'bag.' + c.p, o.bag[c.k] || 0); if (o.bag) delete o.bag[c.k]; } }
  if (first && G.sub[C.id] === undefined) { G.sub[C.id] = o; change('g'); setTimeout(reloadScreen, 50); return; }
  G.sub[C.id] = Object.assign(G.sub[C.id] || {}, o);queueGameplay(prior,G,C.id,campaignBoxes.splice(0)); if (before !== JSON.stringify(G)) change('g');
}
const SCREENS = {minigames:'🎮 มินิเกม',campaigns:'🏅 แคมเปญ',topspenders:'🏆 Top Spenders • กาชาปอง',fishing:'🎣 ตกปลา',farmshop:'🏪 ร้านของเพื่อน',adminshop:'🛍️ ร้านค้ายัยหนู',boat:'🚤 แข่งเรือ', safari: '🦓 ซาฟารี', shop: '🏪 ตลาดสวน', loading: '', farm: '', house: '', backyard: '🏡 หลังบ้าน', forest: '🌲 ป่าต้องห้าม', barn: '🐔 โรงเรือนสัตว์วิญญาณ', birds: '🦤 นกน้อยคล้อยบินมาเดียวดาย', catpen: '🐱 คอกแมว', dog: '🐶 คอกหมา', alpaca: '🦙 ทุ่งอัลปาก้า + โรงงาน' };
const LS_CAP = 128 * 1024;
function frameSave() { try { S.frame && S.frame.contentWindow.eval('try{save()}catch(e){}'); } catch (e) { } }
const CLOUD_HANDLERS={safari:'safariActionCloud',boxes:'boxesActionCloud',drops:'dropsActionCloud',birdbox:'birdboxActionCloud',farm:'farmActionCloud',friends:'friendsActionCloud',market:'marketActionCloud',br:'brActionCloud',minigames:'minigamesActionCloud',kang:'kangActionCloud',campaigns:'campaignsActionCloud',events:'eventsActionCloud',fishing:'fishingActionCloud',boat:'boatActionCloud',farmshop:'farmshopActionCloud',outings:'outingsActionCloud',adminshop:'adminshopActionCloud'};
const cloudPending=new Map(),cloudSequences=new Map();
let cloudBusy=false,cloudPromise=null;
let apiCheckedSession='';
async function checkApi(){if(apiCheckedSession===S.sessionId)return;try{const status=(await httpsCallable(functions,'gameApiStatus')({})).data;if(status.release!=='ss3-recovery6')throw new Error('รุ่นระบบกลางไม่ตรงกับเว็บ กรุณาติดตั้ง cloud-update.zip รุ่น recovery6 ให้ครบ');apiCheckedSession=S.sessionId;}catch(e){if(e.code)throw new Error('ยังตรวจรุ่นระบบกลางไม่ได้ กรุณา deploy Cloud Functions ทั้งชุด recovery6: '+(e.message||e.code));throw e;}}
async function cloudAction(system,input) {
  if(!S.user||S.blocked)throw new Error('กรุณาเข้าเกมใหม่');
  if(cloudBusy)throw new Error('กำลังทำรายการก่อนหน้า กรุณารอสักครู่');
  if(!CLOUD_HANDLERS[system])throw new Error('ไม่พบระบบที่เรียก');
  let finishCloud;cloudPromise=new Promise(resolve=>{finishCloud=resolve;});cloudBusy=true;if(input.type!=='status')showSave('กำลังบันทึกรายการ…');
  try {
    await checkApi();
    if(S.dirty.size||S.saving)await flush();
    let pending=cloudPending.get(system);
    const recover=pending&&JSON.stringify(pending.input)!==JSON.stringify(input);
    if(!pending) {
      if(!cloudSequences.has(system)) {
        const gate=await getDoc(doc(db,'players',S.user.uid,'actionGates',system));
        cloudSequences.set(system,gate.exists()?gate.data().seq:0);
      }
      pending={input,seq:cloudSequences.get(system)+1,id:crypto.randomUUID(),session:S.sessionId};
      cloudPending.set(system,pending);
    }
    for(let attempt=0;attempt<(recover?2:1);attempt++){
    const response=(await httpsCallable(functions,CLOUD_HANDLERS[system])(pending)).data;
    store.accept(response.actorParts||[]);
    Object.assign(S.P,response.meta||{});S.P.g=joinGame(store.parts.values());
    cloudSequences.set(system,response.seq);cloudPending.delete(system);
    if(recover&&attempt===0){pending={input,seq:response.seq+1,id:crypto.randomUUID(),session:S.sessionId};cloudPending.set(system,pending);continue;}
    if(input.type!=='status')showSave('บันทึกแล้ว ✓');return response;
    }
  } catch(e) {
    const c=e.code||'';
    if(!['functions/unavailable','functions/deadline-exceeded','functions/internal','functions/unknown'].includes(c)){
      cloudPending.delete(system);if(c==='functions/aborted')cloudSequences.delete(system);
    }
    if(input.type!=='status')showSave(e.message||'ยังยืนยันการบันทึกไม่ได้',true);throw e;
  } finally {cloudBusy=false;finishCloud();cloudPromise=null;if(S.frame&&!S.blocked)S.frame.style.pointerEvents='';}
}
window.__HOST = {
  watchLures:fn=>sceneWatch(doc(db,'birdAdmissions',S.user.uid),state=>fn({birds:lurePen([],state?.birds||[])})),
  openBoxes:kind=>showLootBoxes(kind,{commit:async()=>{if(cloudPromise)await cloudPromise;frameSave();await flush();},game:()=>S.P.g,open:input=>{stopSceneSubscriptions();if(S.frame)S.frame.src='about:blank';return cloudAction('boxes',input);},refresh:reloadScreen}),
  catalogItem(path){return CATALOG.find(c=>c.p===path.replace(/^bag\./,''));},
  catalogName(name){return CATALOG.find(c=>c.n===name||c.k===name);},
  get catalog(){return CATALOG;},
  boxList(){return BOXES.map(b=>({id:b.id,image:b.image,name:CAT[b.key].n,count:getBoxCount(S.P.g,b)}));},
  async commit(){frameSave();await flush();},
  watchGameView(system,fn){return sceneWatch(doc(db,'players',S.user.uid,'gameViews',system),fn);},
  recordCampaignBox(reward){if(campaignBoxes.length<10000)campaignBoxes.push({...reward});},
  get admin() { return S.admin; },
  get coins(){return S.P?.coins||0;},
  openAdmin(){if(S.admin)openAdminOverlay();},
  get uid() { return S.user?.uid||''; },
  cloud:cloudAction,
  roster:async()=>{const rows=(await httpsCallable(functions,'gameRoster')({})).data;return rows;},
  watchWorld(system,fn){return sceneWatch(doc(db,'world',system),fn);},
  get(k) {
    if (k === GAME_KEY) { if(S.P?.g)refillAdminInventory(S.P.g,S.admin,CATALOG);return S.P?.g?JSON.stringify(S.P.g):null; }
    if (SUBS[k]) { if(S.P?.g)refillAdminInventory(S.P.g,S.admin,CATALOG);return S.P?subGet(k):null; }
    if (k === 's3user') return JSON.stringify({ name: S.P ? S.P.name : '', admin: S.admin });
    const L = S.P && S.P.g && S.P.g._ls; return L && k in L ? L[k] : null;
  },
  set(k, v) {
    if (!S.P || S.blocked) return;
    if (k === GAME_KEY) { let o; try { o = JSON.parse(v); } catch (e) { return; } if(S.screen==='farm')o.farms=S.P.g.farms;const ls = S.P.g && S.P.g._ls; if(ls)o._ls=ls;else delete o._ls; if (JSON.stringify(S.P.g) === JSON.stringify(o)) return; o.sub ||= {};if(S.P.g.sub?.campaigns)o.sub.campaigns=clone(S.P.g.sub.campaigns);else delete o.sub.campaigns;const merged=store.mergeProjection(S.P.g,o);queueGameplay(S.P.g,merged,S.screen,campaignBoxes.splice(0));S.P.g = merged; change('g'); return; }
    if (k === 's3user') return;
    if (SUBS[k]) { subSet(k, v); return; }
    if (new TextEncoder().encode(String(v)).length > LS_CAP) { showSave('ข้อมูล '+k+' ใหญ่เกินขอบเขต ยังไม่ได้บันทึก', true); throw new Error('ข้อมูลระบบใหญ่เกินขอบเขต'); }
    S.P.g = S.P.g || {}; S.P.g._ls = S.P.g._ls || {}; S.P.g._ls[k] = String(v); change('g');
  },
  del(k) { const L = S.P && S.P.g && S.P.g._ls; if (L && k in L) { delete L[k]; change('g'); } },
  birdReq: sp => { addDoc(collection(db, 'birdReqs'), { uid: S.user.uid, name: S.P.name, sp, status: 'wait', at: serverTimestamp() }).catch(() => toast('ส่งคำขอไม่สำเร็จ ลองใหม่อีกครั้ง')); },
  openMail: () => openMail(), logout: () => logout(), mailCount: () => (S.P && S.P.mailCount) || 0,
  ask(title, body, okLabel, fn) { const acts = [{ t: okLabel ? 'ยกเลิก' : 'ปิด', c: 'gray' }]; if (okLabel) acts.push({ t: okLabel, f: fn }); modal(`<h2>${title}</h2><div>${body}</div>${okLabel ? '' : '<p class="note">ของยังไม่พอ เก็บเพิ่มอีกนิดนะ</p>'}`, acts); }
};
function renderGame(screen) {
  if (!document.getElementById('scr')) {
    $('#app').innerHTML = `<div id="gbar" class="gbar" hidden><button id="gback">🌱 กลับฟาร์ม</button><b id="gttl"></b></div><iframe id="scr" title="ในสวนของยัยหนู"></iframe><div id="ov" class="ov" hidden></div>`;
    $('#gback').onclick = () => goScreen('farm');
    S.frame = $('#scr');
  }
  goScreen(screen);
}
async function goScreen(n) {
  if (n === 'admin') { if (S.admin) openAdminOverlay(); return; }
  if (n === 'login') { logout(); return; }
  if (!(n in SCREENS)) { toast('🚧 ส่วนนี้จะเปิดในอัปเดตถัดไป'); return; }
  if (S.navigating) return; S.navigating = true;
  if(S.frame)S.frame.style.pointerEvents='none';
  try {
    if(cloudPromise)await cloudPromise;frameSave();await flush();
    const ids=[...BASE_PARTS,...SCREEN_PARTS[n]];
    S.P.g=await store.loadIds(ids);store.activate(ids);
    stopSceneSubscriptions();S.screen=n;
    const t=SCREENS[n];$('#gbar').hidden=!t;$('#gttl').textContent=t;document.body.classList.toggle('sub',!!t);
    S.frame.src='scr-'+n+'.html?v=ss3-hotfix7';
  }catch(e){toast(e.message||thaiError(e));}
  finally{S.navigating=false;if(S.frame&&!S.blocked)S.frame.style.pointerEvents='';}
}
function reloadScreen() { stopSceneSubscriptions();if (S.frame && S.screen) S.frame.src = 'scr-' + S.screen + '.html?v=ss3-hotfix7&r=' + Date.now(); }
window.addEventListener('message', e => { if (e.data && e.data.go && S.frame && e.source === S.frame.contentWindow) goScreen(e.data.go); });
async function openAdminOverlay() { A.sendLoaded=false;try{await checkApi();if(cloudPromise)await cloudPromise;frameSave();await flush();stopSceneSubscriptions();if(S.frame)S.frame.src='about:blank';const o=$('#ov');o.hidden=false;renderAdmin();}catch(e){toast(e.message||thaiError(e));} }
function itemsHtml(items) {
  return Object.entries(items || {}).map(([k, n]) => { const c = CAT[k]; return `<span>${c ? `<img src="${IMG(c.i)}" alt="">` : '🎁'}${esc(c ? c.n : k)} ×${fmt(n)}</span>`; }).join('');
}
function openBag() {
  const list = Object.entries(S.P.bag).filter(([, n]) => n > 0);
  modal(`<h2>🎒 กระเป๋า</h2>${list.length ? `<div class="items">${itemsHtml(Object.fromEntries(list))}</div>` : '<p class="note">กระเป๋ายังว่าง</p>'}`);
}

// ---------- ไปรษณีย์ ----------
// แต่ละซองคือ 1 เอกสาร กดรับ = เพิ่มของเข้ากระเป๋า + ลบซอง ในรายการเดียวกัน (รับซ้ำไม่ได้)
async function openMail() {
  if(cloudPromise)await cloudPromise;
  modal('<h2>📮 ไปรษณีย์</h2><p class="note">กำลังเปิดตู้…</p>', [{ t: 'ปิด', c: 'gray' }]);
  let docs = [];
  try { const q = query(collection(db, 'mail', S.user.uid, 'items'), orderBy('createdAt', 'desc'), limit(60)); docs = (await getDocs(q)).docs; }
  catch (e) { modal(`<h2>📮 ไปรษณีย์</h2><p>${thaiError(e)}</p>`); return; }
  const now = Date.now(), live = [], expired = [];
  docs.forEach(d => { const g = d.data(); (g.expireAt && g.expireAt.toMillis() < now ? expired : live).push({ id: d.id, ...g }); });
  expired.forEach(g => deleteDoc(doc(db, 'mail', S.user.uid, 'items', g.id)).catch(() => { }));
  // A page of 60 envelopes is not the full mailbox count. Keep the cloud counter.
  if (!live.length) { modal('<h2>📮 ไปรษณีย์</h2><p class="note">ยังไม่มีของในไปรษณีย์</p>'); return; }
  const html = '<h2>📮 ไปรษณีย์</h2>' + live.map(g => `<div class="mail"><span class="ic">${esc(g.icon || '🎁')}</span><b>${esc(g.title)}<small>${esc(g.msg || '')}</small>
    <span class="items">${g.kusal ? `<span>✨ กุศล ${fmt(g.kusal)}</span>` : ''}${g.coins ? `<span><img src="${COIN_IMG}" alt="">เหรียญฮาโลวีน ×${fmt(g.coins)}</span>` : ''}${itemsHtml(g.items)}</span></b>
    <button class="btn sm" data-id="${g.id}">กดรับ</button></div>`).join('') + `<p class="note">กดรับแล้วซองหายทันที ซองของขวัญทั่วไปหมดอายุใน ${MAIL_DAYS} วัน · เงินทุนคืนและรางวัลสะสมไม่มีวันหมดอายุ</p>`;
  modal(html, [{ t: 'ปิด', c: 'gray' }]);
  $('#mcard').querySelectorAll('[data-id]').forEach(b => b.onclick = () => claim(b.dataset.id, b));
}
function gpath(k) { const c = CAT[k], p = c ? c.p : 'pend.' + k; return p.startsWith('pend.') || p.startsWith('sub.') ? 'g.' + p : 'g.bag.' + p; }
function addPath(o, path, n) { const ks = path.split('.'); let t = o; while (ks.length > 1) { const x = ks.shift(); t[x] = t[x] || {}; t = t[x]; } t[ks[0]] = (t[ks[0]] || 0) + n; }
async function claim(id, btn) {
  busy(btn, true, 'กำลังรับ…'); if(cloudPromise)await cloudPromise;frameSave();
  const mref = doc(db, 'mail', S.user.uid, 'items', id);
  let got;
  try {
    await flush();
    got = await store.claimMail(mref, (game, mail) => {
      const release=mail.escrowRelease;if(release&&game.sub?.minigames?.escrows?.[release.system]?.round===release.round)delete game.sub.minigames.escrows[release.system];
      if (mail.kusal) game.merit = (game.merit || 0) + mail.kusal;
      for (const [k,n] of Object.entries(mail.items || {})) addPath(game, gpath(k).slice(2), n);
      refillAdminInventory(game,S.admin,CATALOG);
    });
  } catch (e) { busy(btn, false, 'กดรับ'); if (e.code === 'save/conflict') otherDevice(); else if (e.thai) { toast(e.thai); openMail(); } else toast(thaiError(e)); return; }
  // ส่งขึ้นระบบสำเร็จแล้ว จึงเพิ่มในเครื่องให้ตรงกัน
  S.P.coins += got.coins || 0; S.P.mailCount = Math.max(0, S.P.mailCount - 1);
  S.P.g=joinGame(store.parts.values());
  refillAdminInventory(S.P.g,S.admin,CATALOG);
  reloadScreen();
  toast('รับแล้ว เข้ากระเป๋าเรียบร้อย'); refreshBar(); openMail();
}

// ---------- ศูนย์แอดมิน ----------
const A = { tab: 'send', players: null, sel: new Set(), gift: { title: 'ของขวัญจากยัยหนู', msg: '', icon: '🎁', kusal: 0, coins: 0, items: {} }, q: '' };
async function loadPlayers(force) {
  if (A.players && !force) return A.players;
  const snap = await getDocs(collection(db, 'players'));
  A.players = snap.docs.map(d=>{const data=d.data();return {uid:d.id,...data,g:{merit:data.displayMerit??data.g?.merit??0},_size:data.maxPartBytes||sizeOf(data)};});
  A.players.sort((a,b)=>(a.name||'').localeCompare(b.name||'','th'));
  return A.players;
}
function renderAdmin() {
  const host = $('#ov') && !$('#ov').hidden ? $('#ov') : $('#app');
  host.innerHTML = `<div class="home" style="background:#FFF4EA"><div class="page">
    <div class="row"><button class="btn sm gray" id="aBack">‹ กลับ</button><b style="font-size:1.05rem">👑 ศูนย์แอดมิน</b></div>
    <div class="atabs">${[['approvals', '📋 สมาชิกใหม่ ('+pendingCount+')'], ['send', '🎁 ส่งของ'], ['birds', '🦤 คำขอล่อนก'], ['players', '👥 ผู้เล่น'], ['inventory', '🎒 ตรวจของ'], ['backup', '💾 สำรอง/กู้คืน'], ['settings', '⚙️ ตั้งค่าเกม']].map(([k, t]) => `<button data-t="${k}" class="${A.tab === k ? 'on' : ''}">${t}</button>`).join('')}</div>
    <div id="aBody"></div></div></div>`;
  $('#aBack').onclick = () => { const o = $('#ov'); if (o && !o.hidden) { o.hidden = true; o.innerHTML = ''; reloadScreen(); } else renderClosed(); };
  document.querySelectorAll('.atabs button').forEach(b => b.onclick = () => { A.tab = b.dataset.t; renderAdmin(); });
  ({ approvals: tabApprovals, send: tabSend, birds: tabBirds, players: tabPlayers, inventory: tabInventory, backup: tabBackup, settings: tabSettings })[A.tab]();
}
async function tabSend(){
 const B=$('#aBody'),g=A.gift;let ps;
 try{if(!A.players||!A.sendLoaded){B.innerHTML='<div class="box">กำลังอ่านข้อมูลครั้งแรก…</div>';const center=(await httpsCallable(functions,'adminCenterCloud')({type:'status',session:S.sessionId})).data;ps=center.players;A.players=ps;A.templates=center.templates;A.favorites=center.favorites;A.pendingRun=center.pendingRun;A.history=center.history;A.sendLoaded=true;}else ps=A.players;
 }catch(e){B.textContent=thaiError(e);return;}
 if(!document.contains(B))return;
 ps=ps.filter(p=>p.approval!=='rejected');
 const eligible=new Set(ps.map(p=>p.uid));A.sel=new Set([...A.sel].filter(uid=>eligible.has(uid)));
 if(A.pendingRun){const r=A.pendingRun;B.innerHTML=`<div class="box"><h3>รายการส่งค้าง: ${esc(r.body.title)}</h3><button class="btn" id="gResume">ส่งรายการเดิมต่อ</button><p>รายการสำเร็จจะไม่ส่งซ้ำ แม้สมาชิกกดรับไปแล้ว</p></div>`;$('#gResume').onclick=()=>{A.gift={...r.body,operationId:r.operationId};sendGift(r.uids,r.names,r.packs||{});};return;}
 A.packs ||= {};const categories=[...new Set(CATALOG.map(c=>c.g))];A.category ||= categories[0];
 const filt=CATALOG.filter(c=>(A.category==='favorites'?A.favorites.includes(c.k):A.q?true:c.g===A.category)&&(!A.q||c.n.includes(A.q)||c.k.includes(A.q.toLowerCase())));
 B.innerHTML=`<div class="box"><h3>1. ผู้รับและจำนวนแพ็ก (${A.sel.size} คน)</h3><div class="row"><button class="btn sm" id="sAll">เลือก / ยกเลิกทุกคน</button><button class="btn sm gray" id="sReload">โหลดรายชื่อใหม่</button></div><div class="plist">${ps.map(p=>`<label class="${A.sel.has(p.uid)?'on':''}"><input type="checkbox" data-u="${p.uid}" ${A.sel.has(p.uid)?'checked':''}>${esc(p.name)}<input type="number" data-packs="${p.uid}" aria-label="จำนวนแพ็กของ ${esc(p.name)}" min="1" max="1000000" value="${A.packs[p.uid]||1}" style="width:4rem"> แพ็ก</label>`).join('')}</div></div>
 <div class="box"><h3>2. รายการต่อ 1 แพ็ก</h3><div class="row">หัวข้อ <input id="gT" value="${esc(g.title)}" style="flex:1"></div><div class="row">ข้อความ <input id="gM" value="${esc(g.msg)}" style="flex:1"></div><div class="row">กุศล <input id="gK" type="number" min="0" value="${g.kusal||0}" style="width:6rem"> เหรียญฮาโลวีน <input id="gC" type="number" min="0" value="${g.coins||0}" style="width:4rem"></div>
 <div class="picked">${Object.entries(g.items).filter(([k])=>CAT[k]).map(([k,n])=>`<div><img src="${IMG(CAT[k].i)}">${esc(CAT[k].n)}<input type="number" min="0" data-k="${k}" value="${n}"><button class="btn sm gray" data-rm="${k}">ลบ</button></div>`).join('')}</div>
 <div class="row"><input id="gQ" placeholder="ค้นหาไอเทมทุกหมวด" value="${esc(A.q)}" style="flex:1"><select id="gCategory"><option value="favorites" ${A.category==='favorites'?'selected':''}>⭐ รายการโปรด</option>${categories.map(c=>`<option ${A.category===c?'selected':''}>${esc(c)}</option>`).join('')}</select></div>
 <div class="cat">${filt.map(c=>`<div style="display:flex;gap:2px"><button data-add="${c.k}" style="flex:1"><img src="${IMG(c.i)}" loading="lazy">${esc(c.n)}</button><button data-favorite="${c.k}" aria-label="รายการโปรด">${A.favorites.includes(c.k)?'★':'☆'}</button></div>`).join('')||'หมวดนี้ยังไม่มีรายการ'}</div></div>
 <div class="box"><h3>3. แพ็กเกจที่บันทึกไว้</h3><div class="row"><input id="templateName" placeholder="ชื่อแพ็กเกจ" style="flex:1"><button class="btn sm" id="saveTemplate">บันทึกแพ็กนี้</button></div>${A.templates.map((t,i)=>`<div class="row"><b style="flex:1">${esc(t.name)}</b><button class="btn sm" data-template="${i}">ใช้แพ็กนี้</button><button class="btn sm gray" data-del-template="${i}">ลบ</button></div>`).join('')}</div>
 <div class="box"><button class="btn pink" id="gSend">📮 ตรวจยอดและส่ง</button><p class="note">จำนวนต่อแพ็ก × จำนวนแพ็กของแต่ละคน ระบบคำนวณให้ทั้งหมด</p></div>
 <details class="box"><summary>📜 ประวัติส่งล่าสุด ${A.history.length} รายการ</summary>${A.history.filter(h=>h.type==='gift').map(h=>`<div style="border-bottom:1px solid #ddd;padding:8px"><b>${esc(h.title)}</b><small> · ${h.at?new Date(typeof h.at==='number'?h.at:h.at.toMillis()).toLocaleString('th-TH'):''}</small><p>${esc((h.to||[]).join(', '))} (${h.count} คน)</p><div class="items">${itemsHtml(h.items||{})}</div><p>กุศลต่อแพ็ก ${fmt(h.kusal)} · เหรียญ ${fmt(h.coins)}</p>${h.packs?'<p>แพ็ก: '+Object.entries(h.packs).map(([uid,n])=>esc(ps.find(p=>p.uid===uid)?.name||uid)+' ×'+n).join(' · ')+'</p>':''}</div>`).join('')||'ยังไม่มีประวัติ'}</details>`;
 const keep=()=>{g.title=$('#gT').value.trim()||'ของขวัญจากยัยหนู';g.msg=$('#gM').value.trim();g.kusal=Math.max(0,Number($('#gK').value)||0);g.coins=Math.max(0,Number($('#gC').value)||0);B.querySelectorAll('[data-k]').forEach(i=>{const n=Number(i.value)||0;if(n>0)g.items[i.dataset.k]=n;else delete g.items[i.dataset.k];});B.querySelectorAll('[data-packs]').forEach(i=>A.packs[i.dataset.packs]=Math.max(1,Number(i.value)||1));};
 A.captureSend=keep;
 const persist=async()=>{await httpsCallable(functions,'adminCenterCloud')({type:'preferences',session:S.sessionId,templates:A.templates,favorites:A.favorites});};
 B.querySelectorAll('[data-u]').forEach(i=>i.onchange=()=>{keep();i.checked?A.sel.add(i.dataset.u):A.sel.delete(i.dataset.u);});
 $('#sAll').onclick=()=>{keep();if(ps.every(p=>A.sel.has(p.uid)))A.sel.clear();else ps.forEach(p=>A.sel.add(p.uid));tabSend();};
 $('#sReload').onclick=()=>{keep();A.players=null;A.sendLoaded=false;tabSend();};
 B.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{keep();g.items[b.dataset.add]=(g.items[b.dataset.add]||0)+1;tabSend();});B.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{keep();delete g.items[b.dataset.rm];tabSend();});
 $('#gCategory').onchange=e=>{keep();A.category=e.target.value;tabSend();};let timer;$('#gQ').oninput=e=>{clearTimeout(timer);timer=setTimeout(()=>{keep();A.q=e.target.value.trim();const pos=e.target.selectionStart;tabSend().then(()=>{$('#gQ')?.focus();$('#gQ')?.setSelectionRange(pos,pos);});},180);};
 B.querySelectorAll('[data-favorite]').forEach(b=>b.onclick=async()=>{keep();const k=b.dataset.favorite;A.favorites=A.favorites.includes(k)?A.favorites.filter(x=>x!==k):[...A.favorites,k];try{await persist();tabSend();}catch(e){toast(thaiError(e));}});
 $('#saveTemplate').onclick=async()=>{keep();const name=$('#templateName').value.trim();if(!name)return toast('ใส่ชื่อแพ็กเกจก่อน');if(A.templates.length>=30&&!A.templates.some(t=>t.name===name))return toast('เก็บได้ 30 แพ็กเกจ');A.templates=A.templates.filter(t=>t.name!==name);A.templates.push({name,body:{title:g.title,msg:g.msg,icon:g.icon,kusal:g.kusal,coins:g.coins,items:{...g.items}}});try{await persist();toast('บันทึกแพ็กเกจบนคลาวด์แล้ว');tabSend();}catch(e){toast(thaiError(e));}};
 B.querySelectorAll('[data-template]').forEach(b=>b.onclick=()=>{keep();A.gift=clone(A.templates[+b.dataset.template].body);tabSend();});B.querySelectorAll('[data-del-template]').forEach(b=>b.onclick=async()=>{keep();A.templates.splice(+b.dataset.delTemplate,1);await persist();tabSend();});
 $('#gSend').onclick=()=>{keep();const users=ps.filter(p=>A.sel.has(p.uid));if(!users.length)return toast('เลือกผู้รับก่อน');if(!g.kusal&&!g.coins&&!Object.keys(g.items).length)return toast('แพ็กยังว่าง');
 if([g.kusal,g.coins,...Object.values(g.items)].some(n=>!Number.isSafeInteger(n)||n<0)||users.some(p=>!Number.isSafeInteger(A.packs[p.uid]||1)))return toast('จำนวนต้องเป็นจำนวนเต็ม');
 modal(`<h2>ยืนยันยอดส่ง</h2><p>${esc(g.title)}</p>${users.map(p=>{const n=A.packs[p.uid]||1;return `<div class="box"><b>${esc(p.name)} ×${n} แพ็ก</b><p>กุศล ${fmt(g.kusal*n)} · เหรียญ ${fmt(g.coins*n)}</p><div class="items">${itemsHtml(Object.fromEntries(Object.entries(g.items).map(([k,q])=>[k,q*n])))}</div></div>`;}).join('')}`,[{t:'ยกเลิก',c:'gray'},{t:'ส่งเลย',c:'pink',f:()=>sendGift(users.map(p=>p.uid),users.map(p=>p.name),A.packs)}]);
 };
}
async function sendGift(uids, names, packs={}) {
  if(A.sending)return;A.sending=true;
  const g = A.gift, exp = Timestamp.fromMillis(Date.now() + MAIL_DAYS * 864e5);
  const body = { title: g.title, msg: g.msg, icon: g.icon, kusal: g.kusal || 0, coins: g.coins || 0, items: { ...g.items }, createdAt: serverTimestamp(), expireAt: exp, from: 'ยัยหนู' };
  toast('กำลังส่ง…');
  try {
    frameSave();await flush();
    A.gift.operationId ||= doc(collection(db,'adminLog')).id;
    const request={id:A.gift.operationId,uids,names,body:{title:body.title,msg:body.msg,icon:body.icon,kusal:body.kusal,coins:body.coins,items:body.items,expireAt:exp.toMillis(),from:body.from},packs};const result=(await httpsCallable(functions,'adminCenterCloud')({type:'send',session:S.sessionId,request})).data;
    const profile=await getDoc(playerRef());S.P.mailCount=profile.data().mailCount||0;refreshBar();
    A.gift = { title: 'ของขวัญจากยัยหนู', msg: '', icon: '🎁', kusal: 0, coins: 0, items: {} }; A.sel.clear();
    A.pendingRun=null;A.sendLoaded=false;
    modal(`<h2>📮 ส่งแล้ว ${result.count} คน</h2><p class="note">ของอยู่ในไปรษณีย์ของผู้รับ รอกดรับ</p>`); tabSend();
  } catch (e) { modal(`<h2>ส่งไม่สำเร็จ</h2><p>${thaiError(e)}</p><p class="note">กดส่งใหม่ ระบบจะตรวจรายการที่ค้างบนคลาวด์และส่งต่อ คนที่ส่งสำเร็จแล้วจะไม่รับซ้ำ</p>`); } finally { A.sending=false; }
}
async function tabBirds() {
  const B = $('#aBody'); B.innerHTML = '<div class="box"><p class="note">กำลังโหลด…</p></div>';
  let rq = [];
  try { rq = (await getDocs(query(collection(db, 'birdReqs'), where('status', '==', 'wait'), limit(100)))).docs.map(d => ({ id: d.id, ...d.data() })); } catch (e) { B.innerHTML = `<div class="box">${thaiError(e)}</div>`; return; }
  const SPN = { ostrich: '🦤 นกกระจอกเทศ', dodo: '🦤 นกโดโด้' };
  B.innerHTML = `<div class="box"><h3>🦤 คำขอล่อนกที่รออนุมัติ (${rq.length})</h3>${rq.map(r => `<div class="row"><b style="flex:1">${esc(r.name)} · ${SPN[r.sp] || r.sp}</b><button class="btn sm" data-ok="${r.id}">อนุมัติ</button><button class="btn sm gray" data-no="${r.id}">ไม่อนุมัติ</button></div>`).join('') || '<p class="note">ไม่มีคำขอรออยู่</p>'}
    <p class="note">อนุมัติ = นกเข้าคอกคัมภีร์ (คอก 1) โดยตรง • คอกละ 10 ตัว อายุ 48 ชั่วโมง · ไม่อนุมัติ = ส่งกุศลปลอบใจ 100–200</p></div>`;
  const done = async (r, ok,repair=false) => {
    try {
      if(cloudPromise)await cloudPromise;frameSave();await flush();
      const result=(await httpsCallable(functions,'birdRequestsCloud')({request:r.id,decision:repair?'repair':ok?'approve':'reject'})).data;
      if(result.actorParts?.length){store.accept(result.actorParts);S.P.g=joinGame(store.parts.values());}
      toast(ok?'อนุมัติแล้ว นกเข้าคอกคัมภีร์ (คอก 1)':'ส่งกุศลปลอบใจแล้ว');tabBirds();
    } catch(e){toast(e.message||thaiError(e));}
  };
  B.querySelectorAll('[data-ok]').forEach(x => x.onclick = () => done(rq.find(r => r.id === x.dataset.ok), true));
  B.querySelectorAll('[data-no]').forEach(x => x.onclick = () => done(rq.find(r => r.id === x.dataset.no), false));
  try{const old=(await getDocs(query(collection(db,'birdReqs'),where('status','==','ok'),limit(100)))).docs.map(d=>({id:d.id,...d.data()})).filter(r=>r.route!=='pen1-v2');
    if(old.length){const repair=document.createElement('div');repair.className='box';repair.innerHTML='<h3>ย้ายนกคัมภีร์เก่าที่เข้าคลังผิด</h3><p class="note">ให้ผู้เล่นรับซองเดิมและออกจากเกมก่อน ย้ายครั้งละ 1 ตัวจากคลังไปคอก 1 ไม่เพิ่มนกใหม่</p>'+old.map(r=>`<div class="row"><b>${esc(r.name)} · ${SPN[r.sp]||r.sp}</b><button class="btn sm" data-repair="${r.id}">ย้ายเข้าคอก 1</button></div>`).join('');B.appendChild(repair);repair.querySelectorAll('[data-repair]').forEach(b=>b.onclick=()=>done(old.find(r=>r.id===b.dataset.repair),true,true));}
  }catch(e){toast(e.message||thaiError(e));}
}
async function tabPlayers() {
  const B = $('#aBody'); B.innerHTML = '<div class="box"><p class="note">กำลังโหลด…</p></div>';
  let ps; try { ps = await loadPlayers(true); } catch (e) { B.innerHTML = `<div class="box">${thaiError(e)}</div>`; return; }
  const big = ps.filter(p => p._size > SIZE_WARN);
  B.innerHTML = `<div class="box"><h3>👥 ผู้เล่นทั้งหมด ${ps.length} คน</h3>${big.length ? `<p class="warn">⚠️ ส่วนเซฟใหญ่เกิน 200KB ${big.length} คน แจ้งผู้พัฒนาได้เลย</p>` : '<p class="ok">✅ ขนาดเซฟทุกคนปกติ</p>'}
    <table class="pl"><tr><th>ชื่อ</th><th>กุศล</th><th>เหรียญ</th><th>ส่วนใหญ่ที่สุด</th><th>เข้าล่าสุด</th></tr>${ps.map(p => `<tr><td>${esc(p.name)}</td><td>${fmt(p.g && p.g.merit)}</td><td>${fmt(p.coins)}</td><td class="${p._size > SIZE_WARN ? 'warn' : ''}">${(p._size / 1024).toFixed(1)}KB</td><td>${p.lastLogin && p.lastLogin.toDate ? p.lastLogin.toDate().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : '-'}</td></tr>`).join('')}</table>
    <p class="note">หน้านี้อ่านข้อมูลเฉพาะตอนกดเปิด ไม่อ่านค้าง</p></div>`;
}
async function tabInventory() {
  const B = $('#aBody'); B.textContent = 'กำลังโหลดรายชื่อ…';
  try {
    const users = (await getDocs(collection(db,'players'))).docs;
    B.innerHTML = '<div class="box"><h3>🎒 ตรวจของจากคลาวด์</h3><select id="iPlayer">'+users.map(d=>'<option value="'+esc(d.id)+'">'+esc(d.data().name)+'</option>').join('')+'</select> <button class="btn sm" id="iLoad">อ่านล่าสุด</button><div id="iResult"></div></div>';
    $('#iLoad').onclick = async () => {
      const uid=$('#iPlayer').value;if(!uid)return;$('#iResult').textContent='กำลังอ่านคลาวด์…';
      try {
        const data=await store.readFull(uid), G=data.g||{};
        $('#iResult').innerHTML='<p>✨ กุศล '+fmt(G.merit)+' · เหรียญฮาโลวีน '+fmt(data.coins)+'</p><p class="note">กุศล: wallet · เหรียญ: ข้อมูลบัญชีผู้เล่น · ของและสัตว์รอวาง: inventory</p><table class="pl"><tr><th>ของ</th><th>จำนวน</th><th>เซฟหลัก</th></tr>'+CATALOG.map(c=>{
          const v=getp(G,c.p.startsWith('sub.')||c.p.startsWith('pend.')?c.p:'bag.'+c.p)||0;
          return '<tr><td>'+esc(c.n)+'</td><td>'+fmt(v)+'</td><td>inventory</td></tr>';
        }).join('')+'</table>';
      } catch(e) { $('#iResult').textContent=e.message||thaiError(e); }
    };
  } catch(e) { B.textContent=e.message||thaiError(e); }
}
const today = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
async function tabBackup() {
  await installBackupUI({ db, store, $ , modal, toast, thaiError, esc, today, S, flush, frameSave });
}
async function tabSettings() {
  await loadSettings();
  $('#aBody').innerHTML = `<div class="box"><h3>⚙️ เปิด/ปิดเกม</h3><p>ตอนนี้: ${S.settings.open ? '<span class="ok">🟢 เปิดให้ผู้เล่นเข้า</span>' : '<span class="warn">🔴 ปิด (เข้าได้เฉพาะแอดมิน)</span>'}</p>
    <button class="btn ${S.settings.open ? 'pink' : ''}" id="tOpen">${S.settings.open ? 'ปิดเกม' : 'เปิดเกมให้ทุกคน'}</button><p class="note">ตอนปิด ผู้เล่นเข้าระบบได้แต่เห็นหน้า "สวนกำลังจะเปิด"</p></div>
    <div class="box"><h3>ℹ️ ข้อมูลเครื่องนี้</h3><p class="note">รหัสบัญชีของคุณ (ใช้ตั้งสิทธิ์แอดมิน): <b>${S.user.uid}</b><br>ขนาดข้อมูลในหน่วยความจำ: ${(sizeOf(S.P) / 1024).toFixed(1)}KB • ข้อมูลเกมใน Firebase แยกตามระบบแล้ว</p></div>`;
  $('#tOpen').onclick = async () => { try { await setDoc(doc(db, 'settings', 'global'), { open: !S.settings.open, at: serverTimestamp() }, { merge: true }); toast('บันทึกแล้ว'); tabSettings(); } catch (e) { toast(thaiError(e)); } };
}

// ---------- เริ่มต้น ----------
window.addEventListener('error', () => { });
(async () => {
  await cleanOldCaches();
  await loadSettings();
  let first = true;
  onAuthStateChanged(auth, async user => {
    if (user) { if (!S.user || S.user.uid !== user.uid) await enter(user); }
    else { approvalStop?.();approvalStop=null;pendingStop?.();pendingStop=null; S.user = null; S.P = null; S.admin = false; clearInterval(S.timer); renderLogin(); }
    first = false;
  });
})();
