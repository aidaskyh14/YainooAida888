import {quantity,inventoryIssues,inventoryView,assertInventory} from './inventory-integrity.js?v=ss3-fix17';
import {BOXES,getBoxCount} from './loot-box-catalog.js?v=ss3-fix20';
import {lurePen} from './bird-lure-engine.js?v=ss3-fix17';
import {showLootBoxes} from './loot-boxes.js?v=ss3-fix20';
import {observeGameplay} from './campaign-progress.js?v=ss3-fix17';
import {getFunctions,httpsCallable,connectFunctionsEmulator} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js';
import { deliverAdminGift } from './admin-mail.js?v=ss3-recovery6';
import { refillAdminInventory, consolidatePending } from './admin-inventory.js?v=ss3-recovery6';
import {startRumors} from './rumor-ui.js?v=ss3-fix17';
import {startAlerts} from './alerts-ui.js?v=ss3-fix18';
import {startTreeWar} from './tw-alerts.js?v=ss3-fix19';
import {startDemon} from './demon-ui.js?v=ss3-fix23b';
import './mahakusal-ui.js?v=ss3-fix18';import './atm-ui.js?v=ss3-fix24';/* fix19 🏧 *//* fix17c: เปิดกล่องมหากุศลจากกระเป๋าได้ทุกหน้า */
import {RUMOR_GOOD,RUMOR_BAD} from './rumor-engine.js?v=ss3-fix17';
// ในสวนของยัยหนู ซีซั่น 3 — ชุดที่ 1 (รากฐาน)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, orderBy, limit, writeBatch, runTransaction, increment, serverTimestamp, Timestamp, FieldPath, addDoc, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { SplitSaveStore } from './save-store.js?v=ss3-fix17';
import { splitGame,joinGame } from './save-schema.js?v=ss3-fix17';
import { installBackupUI } from './save-backup.js?v=ss3-fix17';
import { CATALOG } from './catalog.js?v=ss3-fix19';

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
 loading:[],farm:['animals-farmdrops','animals-prank','farm-settings','farm-1','farm-2','farm-3','farm-4','module-s3fg-col','module-s3by-entry'],
 house:['house'],backyard:['backyard','module-s3by-entry'],forest:['module-s3forest-v1'],
 barn:['animals-barn'],birds:['animals-birds'],dog:['animals-dog'],alpaca:['animals-alpaca'],
 catpen:['catpen'],safari:['inventory','wallet','animals-safari'],shop:['animals-market'],outings:['outings','house'],
 boat:[],neighborhood:[],treewar:[],funrun:[],farmshop:['animals-farmshop'],fishing:['animals-fishing'],
 minigames:['animals-minigames'],campaigns:['animals-campaigns'],topspenders:[]
};
const sceneSubscriptions=new Set();
let sceneVersion=0,campaignJobs=[];
function stopSceneSubscriptions(){sceneVersion++;for(const stop of sceneSubscriptions)stop();sceneSubscriptions.clear();campaignConfig={};S.campaignConfigAt=0;}
function sceneWatch(ref,fn){const version=sceneVersion;let stop=onSnapshot(ref,snap=>{if(version===sceneVersion)fn(snap.exists()?snap.data():null);},e=>{if(version===sceneVersion)showSave(e.message,true);});sceneSubscriptions.add(stop);return()=>{stop();sceneSubscriptions.delete(stop);};}
// Server-synced clock: offset learned from any cloud response's serverNow (or serverClockCloud when none seen yet).
let rumorStop=null,serverOffset=0,clockSyncedAt=0,clockSync=null,cloudFlushing=false,campaignKick=null;
function noteServerNow(serverNow,sentAt){if(!Number.isFinite(serverNow)||!Number.isFinite(sentAt))return;const recv=Date.now();if(recv-sentAt>20000)return;serverOffset=Math.round(serverNow-(sentAt+recv)/2);clockSyncedAt=recv;}
const serverNow=()=>Date.now()+serverOffset;
function syncClock(){
 if(clockSyncedAt&&Date.now()-clockSyncedAt<30*60000)return Promise.resolve(serverOffset);
 if(clockSync)return clockSync;
 clockSync=(async()=>{const sent=Date.now();try{const out=(await httpsCallable(functions,'serverClockCloud')({})).data;noteServerNow(out?.serverNow,sent);}catch(e){}if(!clockSyncedAt||Date.now()-clockSyncedAt>=30*60000)clockSyncedAt=Date.now()-25*60000;clockSync=null;return serverOffset;})();
 return clockSync;
}
function queueGameplay(before,after,source,boxes){
 const increased=(a,b)=>Object.entries(b||{}).some(([k,v])=>typeof v==='number'&&v>(a?.[k]||0));
 const pet=['barn','birds','dog','alpaca','catpen'].includes(source);
 const craft=['farm','house','backyard'].includes(source);
 const stockChanged=pet&&JSON.stringify(before.bag)!==JSON.stringify(after.bag);
 const meritChanged=pet&&(after.merit||0)>(before.merit||0);
 if(meritChanged&&typeof petEarnBuf==='number')petEarnBuf=Math.min(5e5,petEarnBuf+(after.merit||0)-(before.merit||0));/* fix17 😈 ตั๋วดร็อปจากการดูแลสัตว์ (สุ่มบนเซิร์ฟเวอร์ตอนออกจากหน้าสัตว์) */
 const craftChanged=craft&&['food','gfood','wine','flower','hedge','crop'].some(k=>increased(before.bag?.[k],after.bag?.[k]));
 // `at` is the device clock; the server offset is applied when the job is scored.
 const petEarn=craft&&((after.hedgeEarn||0)>(before.hedgeEarn||0)||(after.ham?.earn||0)>(before.ham?.earn||0));
 if(boxes.length||stockChanged||meritChanged||craftChanged||petEarn)campaignJobs.push({before:clone(before),after:clone(after),source,boxes,petEarn,at:Date.now()});
}
const CAMPAIGN_SOURCES={pet:['barn','birds','dog','alpaca','catpen','house','backyard'],cook:['farm','house','backyard'],pump:['farm','house','backyard']};
// A cached config is only trusted for a job after the fetch when every campaign that job could score is already running.
function configCovers(cfg,job,now){const ids=job.boxes?.length?['box']:Object.keys(CAMPAIGN_SOURCES).filter(id=>CAMPAIGN_SOURCES[id].includes(job.source)&&(id!=='pet'||!['house','backyard'].includes(job.source)||job.petEarn));return ids.every(id=>cfg?.[id]?.start&&cfg[id].start<=now&&now<cfg[id].end);}
async function prepareGameplay(){
 if(!campaignJobs.length)return;
 let jobs=campaignJobs.slice();
 await store.loadIds(['animals-campaigns']);
 await syncClock();
 const jobNow=job=>Number.isFinite(job.at)?job.at+serverOffset:job.now;
 const age=Date.now()-(S.campaignConfigAt||0),stale=!S.campaignConfigAt||age>=60000;
 const uncovered=jobs.findIndex(j=>(j.at??j.now)>=(S.campaignConfigAt||0)&&!configCovers(campaignConfig,j,jobNow(j)));
 if(stale||(uncovered>=0&&age>=5000)){const cfg=await getDoc(doc(db,'world','campaigns'));campaignConfig=cfg.exists()?cfg.data():{};S.campaignConfigAt=Date.now();}
 else if(uncovered>=0){
   // A campaign may have started after the cached read: score these jobs after a fresh read instead of dropping them.
   jobs=jobs.slice(0,uncovered);
   if(!campaignKick)campaignKick=setTimeout(()=>{campaignKick=null;if(campaignJobs.length&&S.user&&!S.blocked){S.dirty.add('g');flush().catch(()=>{});}},5000-age);
   if(!jobs.length)return;
 }
 let progress=clone(S.P.g.sub?.campaigns||joinGame(store.parts.values()).sub?.campaigns||{});
 for(const job of jobs){
   const before=clone(job.before),after=clone(job.after);before.sub ||= {};before.sub.campaigns=progress;
   observeGameplay(before,after,job.source,campaignConfig,jobNow(job),job.boxes);
   progress=after.sub.campaigns;
   for(const[k,n]of Object.entries(after.bag?.halloween||{})){const added=n-(job.after.bag?.halloween?.[k]||0);if(added>0){S.P.g.bag.halloween ||= {};S.P.g.bag.halloween[k]=(S.P.g.bag.halloween[k]||0)+added;}}
 }
 S.P.g.sub ||= {};S.P.g.sub.campaigns=progress;
 store.activeIds.add('animals-campaigns');campaignJobs.splice(0,jobs.length);
}
/* Pending merit changes from other players' games (players/{uid}/ledger), applied by the server on any action. */
function showLedger(rows){/* fix19 🌳 ศึกต้นไม้ผี: โดนปล้น/ตัด = การ์ดค้างจนกว่าจะกดรับทราบ */
  const tw=rows.filter(r=>r.tw==='rob'||r.tw==='cut');if(tw.length){const box=document.createElement('div');box.setAttribute('role','alertdialog');box.style.cssText='position:fixed;inset:0;z-index:9600;display:grid;place-items:center;padding:16px;background:rgba(10,4,20,.6);overflow:auto';
    box.innerHTML='<div style="width:min(100%,22rem);background:#FFFBF5;color:#5a3b2c;border-radius:1.2rem;padding:1rem;box-shadow:0 0 0 3px #FF9DB8,0 0 28px rgba(255,120,160,.6);font-family:Mali,sans-serif">'+tw.map(r=>`<h3 style="margin:0 0 .3rem;font:400 1.2rem Itim,Mali,sans-serif;color:#B02A44">${esc(r.title||'')}</h3><p style="font-size:.8rem;line-height:1.6;margin:.2rem 0">${esc(r.msg||'')}</p>${r.lines?.length?`<ul style="margin:.4rem 0;padding-left:1.1rem;font-size:.85rem;font-weight:700;color:#B02A44">${r.lines.map(l=>`<li>${esc(l)}</li>`).join('')}</ul>`:''}`).join('<hr style="border:0;border-top:1px dashed #F3C9D3;margin:.6rem 0">')+'<button style="display:block;width:100%;margin-top:.6rem;border:0;border-radius:999px;padding:.55rem;font:800 .9rem Mali,sans-serif;color:#fff;background:linear-gradient(180deg,#E8566E,#B02A44);cursor:pointer">รับทราบ</button></div>';
    box.querySelector('button').onclick=()=>box.remove();document.body.appendChild(box);rows=rows.filter(r=>!tw.includes(r));if(!rows.length)return;}
const box=document.createElement('div');box.setAttribute('role','status');box.style.cssText='position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:9999;width:min(92vw,360px);background:#2A2140;color:#fff;border-radius:16px;padding:10px 14px;box-shadow:0 8px 24px rgba(0,0,0,.35);font-size:14px;line-height:1.45;cursor:pointer';
  box.innerHTML='<b style="display:block;color:#FFE9A8;margin-bottom:4px">✨ ปรับกุศลจากกิจกรรม</b>'+rows.map(r=>`<div style="margin-top:4px"><b style="color:${r.merit<0?'#FFB0A8':'#9BF0C8'}">${r.merit>0?'+':''}${fmt(r.merit)}</b> ${esc(r.title||'')}${r.msg?`<br><small style="opacity:.85">${esc(r.msg)}</small>`:''}</div>`).join('')+'<small style="display:block;opacity:.6;margin-top:6px">แตะเพื่อปิด</small>';
  box.onclick=()=>box.remove();document.body.appendChild(box);setTimeout(()=>box.remove(),9000);}
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
  /* fix17e: ข้อความภาษาไทยจากระบบหลังบ้านบอกสาเหตุจริง → แสดงเลย */
  if (e && typeof e.message === 'string' && /[\u0E00-\u0E7F]/.test(e.message)) return e.message;
  return 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง' + (c ? ' (' + c.replace('functions/', '') + ')' : '');
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
  if (!S.user || !S.P || S.blocked || (!S.dirty.size && !campaignJobs.length)) return;
  if (S.saving) { await S.saving; return flush(); }
  if (S.claiming) { await S.claiming.catch(()=>{}); return flush(); }
  // Campaign progress must not be written while a cloud action (which may also write it) is in flight.
  if(cloudPromise&&!cloudFlushing){await cloudPromise.catch(()=>{});return flush();}
  if(S.preparing){await S.preparing;return flush();}
  // fix16: บันทึกของในเกมก่อนเสมอ (ขาย/วาง/ให้อาหารสัตว์ ต้องไม่หายถ้ารีเฟรชเร็ว) แล้วค่อยนับคะแนนแคมเปญเป็นรอบถัดไป
  if (S.dirty.size) {
    const fields = [...S.dirty]; S.dirty.clear();
    const snapshot = {...S.P, g: clone(S.P.g)};
    S.saving = store.save(snapshot, fields);
    try { await S.saving; showSave('บันทึกแล้ว ✓'); }
    catch (e) { fields.forEach(f => S.dirty.add(f)); onSaveError(e); throw e; }
    finally { S.saving = false; if (S.frame && !S.blocked && !S.dirty.size) S.frame.style.pointerEvents = ''; }
  }
  if (campaignJobs.length && !S.blocked && !campaignKick) {
    const before = campaignJobs.length;
    S.preparing=prepareGameplay();try{await S.preparing;}finally{S.preparing=null;}
    if (campaignJobs.length < before) { S.dirty.add('g'); return flush(); }
  }
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
  // fix16: ปิด/รีเฟรชหน้าก่อนบันทึกเสร็จ → เตือนก่อน (กันขายแล้วสัตว์กลับมา / วางแล้วหาย)
  window.addEventListener('beforeunload', e => { try { frameSave(); } catch (_) {} if (S.user && !S.blocked && (S.dirty.size || S.saving || S.claiming || cloudPromise)) { flush().catch(() => {}); e.preventDefault(); e.returnValue = ''; } });
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
    stage='ตรวจความถูกต้องของจำนวนของ';
    if(inventoryIssues(S.P.g).length)await cloudAction('integrity',{type:'repair'});
    stage='ตรวจและเติมกระเป๋าแอดมิน';
    const consolidated = consolidatePending(S.P.g,{"wool": "sub.alpaca.bag.wool", "wool-gold": "sub.alpaca.bag.wool-gold", "ameat": "sub.alpaca.bag.ameat", "ameat-p": "sub.alpaca.bag.ameat-p", "rawwool": "sub.alpaca.bag.rawwool", "rawwool-gold": "sub.alpaca.bag.rawwool-gold", "yarn-white": "sub.alpaca.bag.yarn-white", "yarn-pink": "sub.alpaca.bag.yarn-pink", "yarn-blue": "sub.alpaca.bag.yarn-blue", "scarf-red": "sub.alpaca.bag.scarf-red", "beanie-blue": "sub.alpaca.bag.beanie-blue", "plush-mini": "sub.alpaca.bag.plush-mini", "afood0": "sub.alpaca.bag.afood0", "afood1": "sub.alpaca.bag.afood1", "afood2": "sub.alpaca.bag.afood2"});
    let retired=false;for(const k of ['w1','w2','w3','w4','w5','w6'])if(k in (S.P.g.bag?.gfood||{})){delete S.P.g.bag.gfood[k];retired=true;}
    const refilled = refillAdminInventory(S.P.g,S.admin,CATALOG);
    if(consolidated || refilled || retired){stage='บันทึกกระเป๋าแอดมินบนคลาวด์';await store.save(S.P,['g']);}
    campaignJobs=[];stopSceneSubscriptions();
    stage='เปิดหน้าโหลดสวน';
    startSaver();await loadSettings();if(!S.admin&&!S.settings.open){renderClosed();return;}
    stage='ตรวจกุศลที่รอปรับจากเกมอื่น';await cloudAction('ledger',{type:'status'}).catch(()=>null);
    renderGame('loading');
    // fix15 ข่าวลือ: ฟังเอกสารของตัวเองเอกสารเดียว (แอดมินไม่รับข่าวลือ)
    watchRumors();watchAlerts();
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
async function logout() {
  // Save everything (page state, queued campaign points, any in-flight cloud action) before signing out.
  if(cloudPromise)await cloudPromise;
  frameSave();
  try { await flush(); }
  catch (e) {
    if(!S.blocked){
      const leave=await new Promise(done=>modal('<h2>⚠️ ยังบันทึกไม่สำเร็จ</h2><p>ถ้าออกตอนนี้ ของที่เพิ่งทำอาจหายได้</p><p class="note">'+esc(e.message||thaiError(e))+'</p>',[{t:'ออกเลย',c:'gray',f:()=>done(true)},{t:'ลองบันทึกใหม่',f:()=>done(false)}]));
      if(!leave)return logout();
    }
  }
  stopSceneSubscriptions();rumorStop?.();rumorStop=null;alertStop?.();alertStop=null;twStop?.();twStop=null;S.frame=null;await signOut(auth);
}

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
  const C = SUBS[K], G = inventoryView(S.P.g || {}); const sub = clone((G.sub && G.sub[C.id]) || C.fresh); if (!sub) return null;
  sub.merit = G.merit || 0;
  for (const a in C.maps || {}) setp(sub, a, clone(getp(G, C.maps[a])) ?? (C.maps[a].startsWith('bag.')&&C.maps[a].split('.').length>2?0:{}));
  if (C.mats) { sub.mats = {}; for (const n in C.mats) sub.mats[n] = getp(G, 'bag.' + C.mats[n]) || 0; }
  if (C.flat) { sub.bag = sub.bag || {}; for (const c of FLAT) { const v = getp(G, 'bag.' + c.p); if (v) sub.bag[c.k] = v; else delete sub.bag[c.k]; } }
  return JSON.stringify(sub);
}
// ---- Barn save guards: placed animals may only disappear through a sell/clear the page declared this session ----
const BARN_LIFE_DAYS={chicken:3,fish:3,pig:7,cow:12},BARN_SELL={chicken:5,fish:5,pig:10,cow:20};
const barnReleases=new Set();let barnReloadAt=0;
const barnKey=(t,i,a)=>t+':'+i+':'+(a&&a.born);
function refuseBarn(message,reload){
  showSave(message,true);
  if(reload&&Date.now()-barnReloadAt>3000){barnReloadAt=Date.now();setTimeout(reload,50);}
  throw Object.assign(new Error(message),{code:'save/barn-guard'});
}
function guardBarn(G,o,nowMs){
  if(store&&store.partial&&store.loadedIds&&!store.loadedIds.has('animals-barn'))
    refuseBarn('ข้อมูลโรงเรือนยังโหลดไม่ครบ ไม่บันทึกทับ กำลังโหลดใหม่…',()=>store.loadIds(['animals-barn']).then(()=>{const j=joinGame([...store.parts.values()].filter(p=>p.path?.[0]==='sub'&&p.path?.[1]==='barn'));if(j.sub?.barn){S.P.g.sub ||= {};S.P.g.sub.barn=Object.assign(S.P.g.sub.barn||{},j.sub.barn);}reloadScreen();}).catch(e=>showSave(e.message||'โหลดโรงเรือนไม่สำเร็จ',true)));
  const prev=G.sub?.barn?.animals;if(!prev||typeof prev!=='object')return;
  const lost=[];let sellValue=0;
  for(const [t,slots] of Object.entries(prev)){
    if(!Array.isArray(slots))continue;
    slots.forEach((a,i)=>{
      if(!a)return;const next=o.animals?.[t]?.[i];if(next&&next.born===a.born)return;
      const declared=barnReleases.has(barnKey(t,i,a)),expired=a.born+(BARN_LIFE_DAYS[t]||0)*864e5<=nowMs;
      if(!declared&&!expired){lost.push([t,i,a]);sellValue+=BARN_SELL[t]||0;}
    });
  }
  // Older cached pages do not declare sells; a sale still shows as the matching merit gain in the same save.
  const meritGain=typeof o.merit==='number'?o.merit-(G.merit||0):0;
  if(lost.length&&!(meritGain>0&&meritGain>=sellValue))refuseBarn('ไม่บันทึก: สัตว์ในโรงเรือนจะหายโดยไม่ได้ขาย/ปล่อย กำลังโหลดข้อมูลล่าสุด…',reloadScreen);
  for(const [t,slots] of Object.entries(prev))if(Array.isArray(slots))slots.forEach((a,i)=>{const next=o.animals?.[t]?.[i];if(a&&!(next&&next.born===a.born))barnReleases.delete(barnKey(t,i,a));});
}
function subSet(K, v, scope) {
  const before = JSON.stringify(S.P.g), prior=clone(S.P.g);
  const C = SUBS[K]; let o;
  // fix13: a page may only save the module part its own screen loaded.
  if (scope && !scope.includes('animals-'+C.id)) throw new Error('หน้านี้ไม่ได้เปิดข้อมูลส่วนนี้ ไม่บันทึกทับ'); try { o = JSON.parse(v); } catch (e) { throw new Error('ข้อมูลเซฟของหน้านี้ไม่ถูกต้อง ยังไม่ได้บันทึก'); }
  const G = clone(S.P.g || {}); G.sub = G.sub || {}; const first = !G.sub[C.id];
  if (C.id === 'barn') guardBarn(G, o, typeof serverNow === 'function' ? serverNow() : Date.now());
  if (!first && typeof o.merit === 'number') G.merit = o.merit;
  delete o.merit;
  for (const a in C.maps || {}) { if (!first) setp(G, C.maps[a], getp(o, a) ?? (C.maps[a].startsWith('bag.')&&C.maps[a].split('.').length>2?0:{})); delp(o, a); }
  if (C.mats) { if (!first) for (const n in C.mats) setp(G, 'bag.' + C.mats[n], (o.mats || {})[n] || 0); delete o.mats; }
  if (C.flat) { for (const c of FLAT) { if (!first && o.bag) setp(G, 'bag.' + c.p, o.bag[c.k] || 0); if (o.bag) delete o.bag[c.k]; } }
  if (first && G.sub[C.id] === undefined) { G.sub[C.id] = o; assertInventory(G,prior); S.P.g=G; queueGameplay(prior,G,C.id,campaignBoxes.splice(0)); change('g'); setTimeout(reloadScreen, 50); return; }
  G.sub[C.id] = Object.assign(G.sub[C.id] || {}, o);assertInventory(G,prior);S.P.g=G;queueGameplay(prior,G,C.id,campaignBoxes.splice(0)); if (before !== JSON.stringify(G)) change('g');
}
const SCREENS = {neighborhood:'🏘️ เนเบอร์ฮูด',treewar:'🌳 ศึกต้นไม้ผี',funrun:'🎃 แรลลี่ฟักทอง',minigames:'🎮 มินิเกม',campaigns:'🏅 แคมเปญ',topspenders:'🏆 Top Spenders • กาชาปอง',fishing:'🎣 ตกปลา',farmshop:'🏪 ร้านของเพื่อน',boat:'🚤 แข่งเรือ', safari: '🦓 ซาฟารี', shop: '🏪 ตลาดสวน', loading: '', farm: '', house: '', backyard: '🏡 หลังบ้าน', forest: '🌲 ป่าต้องห้าม', barn: '🐔 โรงเรือนสัตว์วิญญาณ', birds: '🐦 นกน้อยคล้อยบินมาเดียวดาย', catpen: '🐱 คอกแมว', dog: '🐶 คอกหมา', alpaca: '🦙 ทุ่งอัลปาก้า + โรงงาน' };
const LS_CAP = 128 * 1024;
// lastSetError: the latest failed Host.set/subSet (cleared at the start of every set). frameSave(true) throws it.
let lastSetError = null;
function setFailed(e) { if (!(e instanceof Error)) e = new Error(String(e || 'บันทึกไม่สำเร็จ')); e.hostSet = true; lastSetError = e; showSave(e.message || 'บันทึกไม่สำเร็จ', true); return e; }
function frameSave(strict) {
  lastSetError = null; let err = null;
  try { const w = S.frame && S.frame.contentWindow; if (w) w.eval('if(typeof save==="function")save()'); }
  catch (e) { if (e && e.name !== 'SecurityError') err = e; }
  err = lastSetError || err; if (err && !err.hostSet) setFailed(err);
  if (err && strict) throw err;
  return err;
}
const CLOUD_HANDLERS={rumor:'rumorActionCloud',nb:'nbActionCloud',funrun:'funrunActionCloud',integrity:'inventoryIntegrityCloud',craft:'craftActionCloud',hwmini:'hwminiActionCloud',safari:'safariActionCloud',boxes:'boxesActionCloud',drops:'dropsActionCloud',birdbox:'birdboxActionCloud',farm:'farmActionCloud',friends:'friendsActionCloud',market:'marketActionCloud',minigames:'minigamesActionCloud',kang:'kangActionCloud',campaigns:'campaignsActionCloud',events:'eventsActionCloud',fishing:'fishingActionCloud',boat:'boatActionCloud',farmshop:'farmshopActionCloud',outings:'outingsActionCloud',ledger:'ledgerCloud',demon:'demonActionCloud',mahakusal:'mahakusalActionCloud',atm:'atmActionCloud',treewar:'treeWarActionCloud',alpaca:'alpacaActionCloud'};
const cloudPending=new Map(),cloudSequences=new Map();
let cloudBusy=false,cloudPromise=null;
let apiCheckedSession='';
async function checkApi(){if(apiCheckedSession===S.sessionId)return;try{const status=(await httpsCallable(functions,'gameApiStatus')({})).data;if(status.release!=='ss3-recovery6')throw new Error('รุ่นระบบกลางไม่ตรงกับเว็บ กรุณาติดตั้ง cloud-update.zip รุ่น recovery6 ให้ครบ');apiCheckedSession=S.sessionId;}catch(e){if(e.code)throw new Error('ยังตรวจรุ่นระบบกลางไม่ได้ กรุณา deploy Cloud Functions ทั้งชุด recovery6: '+(e.message||e.code));throw e;}}
const nbReportBuf={};let nbReportTimer=0;
async function flushNbReport(){nbReportTimer=0;if(!S.user||S.blocked)return;for(const kind of Object.keys(nbReportBuf)){let n=nbReportBuf[kind];while(n>0){const part=Math.min(50,n);try{await httpsCallable(functions,'nbActionCloud')({input:{type:'report',kind,n:part}});}catch(e){nbReportBuf[kind]=n;if(!nbReportTimer)nbReportTimer=setTimeout(flushNbReport,60000);return;}n-=part;}delete nbReportBuf[kind];}}
globalThis.addEventListener?.('pagehide',()=>{if(Object.keys(nbReportBuf).length)flushNbReport();});
// fix15: รายการที่ทำจากหน้าต่างลอยของ Host (ข่าวลือ) เปลี่ยนกุศล/กระเป๋าโดยหน้าเกมไม่รู้ตัว
// บันทึกหน้าเกมก่อน · ระหว่างทำรายการไม่รับการบันทึกจากหน้าเกมเดิม · เสร็จแล้วโหลดหน้าเกมใหม่ให้ใช้ข้อมูลล่าสุด (แบบเดียวกับกล่องสุ่ม)
async function sceneSafeAction(system,input){
 if(cloudPromise)await cloudPromise;
 if(!S.frame||!S.screen)return cloudAction(system,input);
 frameSave(true);await flush();
 const H=window.__HOST,saved={set:H.set,del:H.del,get:H.get};let doc=null,frozen=true,reloading=false;try{doc=S.frame.contentDocument||null;}catch(e){}
 const thaw=()=>{if(!frozen)return;frozen=false;H.set=saved.set;H.del=saved.del;H.get=saved.get;};
 H.set=()=>{};H.del=()=>{};
 H.get=function(k){let d=null;try{d=S.frame?.contentDocument||null;}catch(e){}if(frozen&&reloading&&d&&d!==doc&&d.URL!=='about:blank')thaw();return saved.get.call(H,k);};
 let changed=false;
 try{const out=await cloudAction(system,input);changed=true;return out;}
 finally{if(!changed||!S.frame||!S.screen)thaw();else{reloading=true;let done=false;const fin=()=>{if(done)return;done=true;thaw();};S.frame.addEventListener('load',fin,{once:true});setTimeout(fin,20000);reloadScreen();}}
}
const hwOpen=()=>{try{return !!S.frame?.contentWindow?.__hwOpen;}catch(e){return false;}};/* fix16: มินิเกมฮาโลวีนเปิดอยู่ (หน้าสัตว์หยุดบันทึก รอโหลดใหม่ตอนปิดเกม) */
const RUMOR_HOLD=new Set(['funrun','minigames','boat','fishing','loading']);// ไม่เด้งข่าวลือระหว่างแข่ง/เล่นมินิเกม รอออกจากหน้านั้นก่อน
/* fix15f แจ้งเตือนทุกหน้า: ยาพิษที่โดนสาด · นางเงือก (เช็กอิน/จ้างออก) — อ่าน gameViews ของตัวเองเท่านั้น */
let alertStop=null,demonStop=null,twStop=null;
/* fix20: โดนไอเทมปีศาจ (ตัดสินอัตโนมัติ/เลือกตราหีบ/ส่งต่อหัวใจ) ไม่โหลดหน้าใหม่แล้ว — ผู้เล่นทำต่อได้ ไม่เด้งกลับหน้าแรก
   หน้าเกมยังถือกุศลเลขเดิม: เก็บส่วนต่างไว้ใน meritShift แล้วบวกคืนตอนหน้าเกมบันทึก (และหักออกตอนหน้าเกมอ่าน) ให้ตรงกับเซิร์ฟเวอร์เสมอ
   ถ้ามีของระเบิดออกจากกระเป๋า (ของในกระเป๋าเปลี่ยน) ค่อยโหลดหน้าใหม่แบบเดิม */
let meritShift=0;
const stableStr=v=>v&&typeof v==='object'?(Array.isArray(v)?'['+v.map(stableStr).join(',')+']':'{'+Object.keys(v).filter(k=>v[k]!==undefined).sort().map(k=>JSON.stringify(k)+':'+stableStr(v[k])).join(',')+'}'):JSON.stringify(v)??'null';
const gNoMerit=()=>{const g=S.P?.g;if(!g)return '';const {merit:_m,...rest}=g;return stableStr(rest);};
async function demonQuiet(sys,input){if(cloudPromise)await cloudPromise;if(!S.frame||!S.screen||S.navigating)return sceneSafeAction(sys,input);
 frameSave(true);await flush();
 const H=window.__HOST,held=H?{set:H.set,del:H.del}:null;if(H){H.set=()=>{};H.del=()=>{};}
 const m0=Number(S.P?.g?.merit)||0,g0=gNoMerit(),frame=S.frame,scr=S.screen;let out,thaw=true;
 try{out=await cloudAction(sys,input);
  /* ของในเกมเปลี่ยนนอกจากกุศล (ระเบิด / รายการค้างที่ส่งซ้ำ) หรือกำลังย้ายหน้า → ปลดหน้าเดิมทิ้งแล้วโหลดใหม่แบบเดิม (หน้าเดิมบันทึกทับไม่ได้อีก) */
  if(out?.boom?.length||gNoMerit()!==g0||S.navigating||S.frame!==frame||S.screen!==scr){thaw=false;reloadScreen();return out;}
  const d=(Number(S.P?.g?.merit)||0)-m0;
  if(d){let put=false;try{put=frame.contentWindow.eval('(function(d){if(typeof S==="object"&&S&&typeof S.merit==="number"){S.merit=Math.max(0,S.merit+d);try{if(typeof pts==="number")pts=Math.max(0,pts+d);}catch(e){}try{var el=document.getElementById("ptsv");if(el)el.textContent=Math.round(S.merit).toLocaleString("en-US");}catch(e){}return true;}return false;})('+d+')')===true;}catch(e){}
   if(!put)meritShift+=d;}
 }catch(e){throw e;}finally{if(thaw&&H&&held){H.set=held.set;H.del=held.del;}}
 return out;}
function watchAlerts(){alertStop?.();alertStop=null;demonStop?.();demonStop=null;twStop?.();twStop=null;if(!S.user)return;
 /* fix19 🌳 ศึกต้นไม้ผี: ทุกคน (รวมแอดมิน) */
 twStop=startTreeWar({watchState:fn=>onSnapshot(doc(db,'world','treeWar'),snap=>fn(snap.exists()?snap.data():null),()=>{}),watchMine:fn=>onSnapshot(doc(db,'players',S.user.uid,'gameViews','treeWar'),snap=>fn(snap.exists()?snap.data():null),()=>{}),call:input=>httpsCallable(functions,'treeWarActionCloud')({input}).then(r=>r.data),now:()=>Date.now()+serverOffset,toast,screen:()=>S.screen,go:n=>goScreen(n),ledger:()=>sceneSafeAction('ledger',{type:'login'}),hold:()=>RUMOR_HOLD.has(S.screen)||S.navigating||hwOpen()});
 if(S.admin)return;
 /* fix17 😈 ไอเทมปีศาจ: ฝั่งคนโดน + กระเป๋า 48 ชม. (อ่าน gameViews/demon ของตัวเองเท่านั้น) */
 demonStop=startDemon({watch:(name,fn)=>onSnapshot(doc(db,'players',S.user.uid,'gameViews',name),snap=>fn(snap.exists()?snap.data():null),()=>{}),act:(sys,input)=>hwOpen()||RUMOR_HOLD.has(S.screen)||S.navigating?cloudAction(sys,input):sys==='demon'&&['settle','sync','seal','pass'].includes(input?.type)&&S.frame&&S.screen?demonQuiet(sys,input):sceneSafeAction(sys,input),now:()=>Date.now()+serverOffset,game:()=>S.P?.g,x17:()=>S.P?.x17||{},uid:S.user.uid,roster:async()=>(await httpsCallable(functions,'gameRoster')({})).data,screen:()=>S.screen});
 alertStop=startAlerts({watch:(name,fn)=>onSnapshot(doc(db,'players',S.user.uid,'gameViews',name),snap=>fn(snap.exists()?snap.data():null),()=>{}),act:(sys,input)=>{/* fix16: ไม่โหลดหน้าใหม่ตอนแค่ "เห็นยาพิษ" หรือระหว่างมินิเกม/แข่ง (หน้าพวกนั้นไม่ได้บันทึกทับ) */return input?.type==='poison-seen'||hwOpen()||RUMOR_HOLD.has(S.screen)?cloudAction(sys,input):sceneSafeAction(sys,input);},now:()=>Date.now()+serverOffset,toast,game:()=>S.P?.g,x17:()=>S.P?.x17||{},screen:()=>S.screen,go:n=>goScreen(n)});}
function watchRumors(){rumorStop?.();rumorStop=null;if(!S.user)return;
 rumorStop=startRumors({watch:fn=>onSnapshot(doc(db,'rumors',S.user.uid),snap=>fn(snap.exists()?snap.data():null),()=>{}),act:input=>sceneSafeAction('rumor',input),paused:()=>RUMOR_HOLD.has(S.screen)||S.navigating||hwOpen(),game:()=>S.P.g||{},coins:()=>S.P.coins||0,now:()=>Date.now()+serverOffset});}
/* fix16: ระหว่างฉากเรียกคลาวด์ (เช่น เตาทำอาหาร) กันการแตะในฉากชั่วคราว ไม่ให้วาง/ขายสัตว์แล้วถูกผลจากคลาวด์ทับจนหาย */
async function sceneCloud(system,input){let shield=document.getElementById('cloudShield');
 if(!shield){shield=document.createElement('div');shield.id='cloudShield';shield.style.cssText='position:fixed;inset:0;z-index:2147483000;background:transparent;cursor:progress';shield.setAttribute('aria-hidden','true');}
 const quiet=input&&input.type==='status'||!['backyard','house','catpen','dog','alpaca','barn','birds'].includes(S.screen);if(!quiet)document.body.appendChild(shield);
 try{return await cloudAction(system,input);}finally{if(!quiet)shield.remove();}}
async function cloudAction(system,input) {
  if(!S.user||S.blocked)throw new Error('กรุณาเข้าเกมใหม่');
  if(cloudBusy)throw new Error('กำลังทำรายการก่อนหน้า กรุณารอสักครู่');
  if(!CLOUD_HANDLERS[system])throw new Error('ไม่พบระบบที่เรียก');
  let finishCloud;cloudPromise=new Promise(resolve=>{finishCloud=resolve;});cloudBusy=true;if(input.type!=='status')showSave('กำลังบันทึกรายการ…');
  try {
    await checkApi();
    if(S.dirty.size||S.saving){cloudFlushing=true;try{await flush();}finally{cloudFlushing=false;}}
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
    const sentAt=Date.now(),response=(await httpsCallable(functions,CLOUD_HANDLERS[system])(pending)).data;noteServerNow(response.serverNow,sentAt);
    store.accept(response.actorParts||[]);
    Object.assign(S.P,response.meta||{});S.P.g=joinGame(store.parts.values());
    cloudSequences.set(system,response.seq);cloudPending.delete(system);
    if(response.ledgerApplied?.length&&typeof showLedger==='function')showLedger(response.ledgerApplied);
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
const HOST_BASE = {
  watchLures:fn=>sceneWatch(doc(db,'birdAdmissions',S.user.uid),state=>fn({birds:lurePen([],state?.birds||[],serverNow())})),
  // Loot boxes open over the live scene (no blank frame). While the overlay owns the inventory the old
  // scene is frozen: its saves are dropped so a stale copy can never write box counts back; it reloads after close.
  openBoxes:async kind=>{const H=window.__HOST;let frozen=null;
    // The freeze ends as soon as the reloaded scene (a new document) first reads the Host, not at its slower load event.
    const freeze=()=>{if(frozen)return;let doc=null;try{doc=S.frame?.contentDocument||null;}catch(e){}frozen={set:H.set,del:H.del,get:H.get,doc};H.set=()=>{};H.del=()=>{};
      H.get=function(k){let d=null;try{d=S.frame?.contentDocument||null;}catch(e){}if(frozen&&reloading&&d&&d!==frozen.doc&&d.URL!=='about:blank')thaw();return (frozen?frozen.get:H.get).call(H,k);};stopSceneSubscriptions();};
    let reloading=false;
    const thaw=()=>{if(!frozen)return;H.set=frozen.set;H.del=frozen.del;H.get=frozen.get;frozen=null;reloading=false;};
    const refreshScene=()=>{if(!frozen)return;if(!S.frame||!S.screen){thaw();return;}reloading=true;let done=false;const fin=()=>{if(done)return;done=true;thaw();};S.frame.addEventListener('load',fin,{once:true});setTimeout(fin,20000);reloadScreen();};
    /* fix17c 📦 กล่องมหากุศล: เปิดจากกระเป๋าได้เลยทุกหน้า (หน้าฉากหยุดบันทึกระหว่างเปิด แล้วโหลดใหม่ให้ตรง) · คราฟอยู่ห้องใต้ดิน */
    /* fix19 🏧 ตู้ ATM: เปิดทับฉากแบบเดียวกับกล่องมหากุศล (ฉากหยุดบันทึกระหว่างโอน แล้วโหลดใหม่) */
    if(kind==='atm'){if(cloudPromise)await cloudPromise;frameSave(true);await flush();
      return window.atmOpen?.({toast,uid:S.user?.uid,cloud:(sys,input)=>{if(input?.type!=='status')freeze();return cloudAction(sys,input);},roster:async()=>(await httpsCallable(functions,'gameRoster')({})).data,onClose:ch=>{if(ch)refreshScene();else thaw();}});}
    if(kind==='mahakusal'){if(cloudPromise)await cloudPromise;frameSave(true);await flush();
      return window.mkOpenMenu?.({toast,cloud:(sys,input)=>{if(input?.type!=='status')freeze();return cloudAction(sys,input);},onClose:ch=>{if(ch)refreshScene();else thaw();}});}
    return showLootBoxes(kind,{commit:async()=>{if(cloudPromise)await cloudPromise;frameSave(true);await flush();},game:()=>S.P.g,
      open:input=>{freeze();return cloudAction('boxes',input);},
      refresh:()=>{if(!frozen)return;if(!S.frame||!S.screen){thaw();return;}reloading=true;let done=false;const fin=()=>{if(done)return;done=true;thaw();};S.frame.addEventListener('load',fin,{once:true});setTimeout(fin,20000);reloadScreen();}});},
  isAdmin(){return !!S.admin;},
  openAtm(){return HOST_BASE.openBoxes('atm');},
  catalogItem(path){return CATALOG.find(c=>c.p===path.replace(/^bag\./,''));},
  catalogName(name){return CATALOG.find(c=>c.n===name||c.k===name);},
  get catalog(){return CATALOG;},
  boxList(){const mk=Number(S.P.g?.bag?.box?.mahakusal);return [...BOXES.map(b=>({id:b.id,image:b.image,name:CAT[b.key].n,count:getBoxCount(S.P.g,b)})),{id:'mahakusal',image:'mahakusal-box.webp',name:'กล่องสุ่มมหากุศล',count:Number.isSafeInteger(mk)&&mk>0?mk:0}];},/* fix17c: กระเป๋าแท็บกล่องสุ่มแสดงกล่องมหากุศลด้วย */
  async commit(){frameSave(true);await flush();if(S.blocked)throw setFailed(new Error('เครื่องนี้หยุดบันทึกแล้ว ของยังไม่เปลี่ยน'));},
  watchGameView(system,fn){return sceneWatch(doc(db,'players',S.user.uid,'gameViews',system),fn);},
  recordCampaignBox(reward){if(campaignBoxes.length<10000)campaignBoxes.push({...reward});},
  get admin() { return S.admin; },
  get coins(){return S.P?.coins||0;},
  openAdmin(){if(S.admin)openAdminOverlay();},
  get uid() { return S.user?.uid||''; },
  serverNow(){return serverNow();},
  cloud:sceneCloud,
  // fix15: ตัดขนอัลปาก้า/เก็บดอกไม้ทำในหน้าเกม แจ้งยอดให้เควสต์เนเบอร์ฮูดแบบรวมเป็นชุด (ไม่เกินทุก 20 วินาที)
  nbReport(kind,n){if(!['shear','flower'].includes(kind)||!(n>0))return;nbReportBuf[kind]=(nbReportBuf[kind]||0)+Math.floor(n);if(!nbReportTimer)nbReportTimer=setTimeout(flushNbReport,20000);},
  roster:async()=>{const rows=(await httpsCallable(functions,'gameRoster')({})).data;return rows;},
  /* fix17: เรียกคลาวด์แบบไม่ผ่านประตูลำดับรายการ (ฝนกุศล: ฟองทอง/คะแนนสด) · ข้อมูลส่วนตัวฝั่งเซิร์ฟเวอร์ (x17) */
  cloudRaw:(system,input)=>CLOUD_HANDLERS[system]?httpsCallable(functions,CLOUD_HANDLERS[system])({raw:true,input}).then(r=>r.data):Promise.reject(new Error('ไม่พบระบบที่เรียก')),
  x17:()=>JSON.parse(JSON.stringify(S.P?.x17||{})),
  watchWorld(system,fn){return sceneWatch(doc(db,'world',system),fn);},
  // fix14 แรลลี่ฟักทอง: ตำแหน่งระหว่างวิ่ง (เขียนเฉพาะของตัวเอง) และเหตุการณ์ไอเทม
  frPublish(game,data){if(!S.user)return;try{setDoc(doc(db,'funrunLive',String(game),'p',S.user.uid),JSON.parse(JSON.stringify(data||{}))).catch(()=>{});}catch(e){}},
  frEvent(game,ev){if(!S.user)return;try{addDoc(collection(db,'funrunLive',String(game),'ev'),{...JSON.parse(JSON.stringify(ev||{})),from:S.user.uid}).catch(()=>{});}catch(e){}},
  frWatch(game,onPlayers,onEvent){const version=sceneVersion,start=Date.now()-5000;
    const a=onSnapshot(collection(db,'funrunLive',String(game),'p'),snap=>{if(version===sceneVersion)onPlayers(snap.docs.map(d=>({uid:d.id,...d.data()})));},()=>{});
    const b=onSnapshot(collection(db,'funrunLive',String(game),'ev'),snap=>{if(version!==sceneVersion)return;for(const ch of snap.docChanges())if(ch.type==='added'){const e=ch.doc.data();if((e.at||0)>=start)onEvent({id:ch.doc.id,...e});}},()=>{});
    sceneSubscriptions.add(a);sceneSubscriptions.add(b);return()=>{a();b();sceneSubscriptions.delete(a);sceneSubscriptions.delete(b);};},
  watchNb(id,fn){return sceneWatch(doc(db,'neighborhoods',String(id)),fn);},
  watchNbDay(id,day,fn){return sceneWatch(doc(db,'neighborhoods',String(id),'days',String(day)),fn);},
  get(k) {
    if (k === GAME_KEY) { if(S.P?.g)refillAdminInventory(S.P.g,S.admin,CATALOG);if(!S.P?.g)return null;const v=inventoryView(S.P.g);if(meritShift&&typeof v==='object')v.merit=(Number(v.merit)||0)-meritShift;return JSON.stringify(v); }
    if (SUBS[k]) { if(S.P?.g)refillAdminInventory(S.P.g,S.admin,CATALOG);return S.P?subGet(k):null; }
    if (k === 's3user') return JSON.stringify({ name: S.P ? S.P.name : '', admin: S.admin });
    const L = S.P && S.P.g && S.P.g._ls; return L && k in L ? L[k] : null;
  },
  set(k, v) { lastSetError = null; try { hostSet(k, v); } catch (e) { throw setFailed(e); } },
  get lastSetError() { return lastSetError; },
  del(k) { const L = S.P && S.P.g && S.P.g._ls; if (L && k in L) { delete L[k]; change('g'); } },
  serverNow:()=>serverNow(),
  syncClock:()=>syncClock(),
  barnRelease(type,slot,born){if(barnReleases.size<200)barnReleases.add(type+':'+slot+':'+born);},
  openMail: () => openMail(), logout: () => logout(), mailCount: () => (S.P && S.P.mailCount) || 0,
  ask(title, body, okLabel, fn) { const acts = [{ t: okLabel ? 'ยกเลิก' : 'ปิด', c: 'gray' }]; if (okLabel) acts.push({ t: okLabel, f: fn }); modal(`<h2>${title}</h2><div>${body}</div>${okLabel ? '' : '<p class="note">ของยังไม่พอ เก็บเพิ่มอีกนิดนะ</p>'}`, acts); }
};
// fix13: every scene document gets its own Host handle, tagged with a generation and the part ids its screen loaded.
// When the scene is retired (navigation, reload, admin overlay) the handle stops saving, so a page that is still running
// (slow unload, timers) can never write its stale snapshot into the parts of the next screen.
let sceneGen=0,staleSaves=0;
function sceneHost(ids){
  const gen=++sceneGen,scope=ids?[...ids]:null,h=Object.create(HOST_BASE);
  h.set=function(k,v){if(gen!==sceneGen){staleSaves++;return;}lastSetError=null;try{hostSet(k,v,scope);}catch(e){throw setFailed(e);}};
  h.del=function(k){if(gen!==sceneGen){staleSaves++;return;}HOST_BASE.del(k);};
  return h;
}
window.__HOST = sceneHost(null);
function hostSet(k, v, scope) {
    if (!S.P || S.blocked) { setFailed(new Error(S.blocked ? 'เครื่องนี้หยุดบันทึกแล้ว ของยังไม่เปลี่ยน' : 'ยังโหลดเซฟไม่เสร็จ ของยังไม่เปลี่ยน')); return; }
    if (k === GAME_KEY) { let o; try { o = JSON.parse(v); } catch (e) { throw new Error('ข้อมูลเซฟของหน้านี้ไม่ถูกต้อง ยังไม่ได้บันทึก'); }if(meritShift&&o&&typeof o==='object')o.merit=Math.max(0,(Number(o.merit)||0)+meritShift);/* fix20: กุศลที่เซิร์ฟเวอร์หักระหว่างที่หน้านี้ไม่ได้โหลดใหม่ */ if(S.screen==='farm')o.farms=S.P.g.farms;const ls = S.P.g && S.P.g._ls; if(ls)o._ls=ls;else delete o._ls; if (JSON.stringify(S.P.g) === JSON.stringify(o)) return; o.sub ||= {};if(S.P.g.sub?.campaigns)o.sub.campaigns=clone(S.P.g.sub.campaigns);else delete o.sub.campaigns;const merged=store.mergeProjection(S.P.g,o,scope);assertInventory(merged,S.P.g);queueGameplay(S.P.g,merged,S.screen,campaignBoxes.splice(0));S.P.g = merged; change('g'); return; }
    if (k === 's3user') return;
    if (SUBS[k]) { subSet(k, v, scope); return; }
    if (new TextEncoder().encode(String(v)).length > LS_CAP) { showSave('ข้อมูล '+k+' ใหญ่เกินขอบเขต ยังไม่ได้บันทึก', true); throw new Error('ข้อมูลระบบใหญ่เกินขอบเขต'); }
    S.P.g = S.P.g || {}; S.P.g._ls = S.P.g._ls || {}; S.P.g._ls[k] = String(v); change('g');
}
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
  const prevIds=store&&store.activeIds?[...store.activeIds]:null;let retired=false;
  try {
    if(cloudPromise)await cloudPromise;frameSave();await flush();
    const ids=[...BASE_PARTS,...SCREEN_PARTS[n]];
    await store.loadIds(ids); // read the next screen's parts while the current page still owns the save scope
    // fix13: close the old page first (its Host handle stops saving, frame goes to about:blank and we wait for it),
    // save what it wrote before that, and only then switch the save scope to the new screen.
    frameSave();retired=true;const nav=await blankScene();await flush();await petFlush();
    S.P.g=await store.loadIds(ids);store.activate(ids);if(inventoryIssues(S.P.g).length)await cloudAction('integrity',{type:'repair'});
    stopSceneSubscriptions();S.screen=n;
    const t=SCREENS[n];$('#gbar').hidden=!t;$('#gttl').textContent=t;document.body.classList.toggle('sub',!!t);
    showScene(n,ids,nav,'');
  }catch(e){toast(e.message||thaiError(e));if(retired){S.navigating=false;if(prevIds)store.activate(prevIds);reloadScreen();}}
  finally{S.navigating=false;if(S.frame&&!S.blocked)S.frame.style.pointerEvents='';}
}
/* fix17 😈 ตั๋วดร็อปจากการดูแลสัตว์: สะสมกุศลที่ได้จากหน้าสัตว์ แล้วสุ่มบนเซิร์ฟเวอร์ตอนออกจากหน้า (หน้าเก่าปิดแล้ว ไม่ทับกระเป๋า) */
var petEarnBuf=0;
async function petFlush(){if(petEarnBuf<5000||!S.user||S.admin)return;const earned=Math.floor(petEarnBuf);petEarnBuf=0;try{await cloudAction('demon',{type:'petRoll',earned});}catch(e){}}
// Retire the scene in the frame: new inert Host handle (old page's saves are refused), navigate to about:blank and wait
// until the old document is gone (or 4 s; the refused handle already protects the save). Resolves with a navigation token.
let sceneNav=0;
function blankScene(){
  const nav=++sceneNav,f=S.frame;window.__HOST=sceneHost([]);
  let cur='';try{cur=(f&&typeof f.getAttribute==='function'&&f.getAttribute('src'))||'';}catch(e){}
  if(!f||typeof f.addEventListener!=='function'||!cur||cur==='about:blank'){if(f)f.src='about:blank';return Promise.resolve(nav);}
  return new Promise(done=>{
    let timer=0;
    const end=()=>{clearTimeout(timer);f.removeEventListener('load',onLoad);done(nav);};
    const onLoad=()=>{let href='';try{href=f.contentWindow.location.href;}catch(e){}if(href==='about:blank')end();};
    f.addEventListener('load',onLoad);timer=setTimeout(end,4000);f.src='about:blank';
  });
}
// Show a screen with a fresh Host handle scoped to the parts that screen loaded; a newer navigation wins.
function showScene(screen,ids,nav,extra){if(nav!==sceneNav||!S.frame)return false;meritShift=0;window.__HOST=sceneHost(ids);S.frame.src='scr-'+screen+'.html?v=ss3-fix24'+extra;return true;}
function reloadScreen() { if (S.navigating) return; stopSceneSubscriptions();if (!S.frame || !S.screen) return;const screen=S.screen,ids=store&&store.activeIds?[...store.activeIds]:null;blankScene().then(nav=>showScene(screen,ids,nav,'&r=' + Date.now())); }
window.addEventListener('message', e => { if (e.data && e.data.go && S.frame && e.source === S.frame.contentWindow) goScreen(e.data.go); });
async function openAdminOverlay() { A.sendLoaded=false;try{await checkApi();if(cloudPromise)await cloudPromise;frameSave();await flush();stopSceneSubscriptions();if(S.frame)blankScene();const o=$('#ov');o.hidden=false;renderAdmin();}catch(e){toast(e.message||thaiError(e));} }
function itemsHtml(items) {
  return Object.entries(items || {}).map(([k, n]) => { const c = CAT[k]; return `<span>${c ? `<img src="${IMG(c.i)}" alt="">` : '🎁'}${esc(c ? c.n : k)} ×${fmt(n)}</span>`; }).join('');
}
function openBag() {
  const list = Object.entries(S.P.bag).filter(([, n]) => n > 0);
  modal(`<h2>🎒 กระเป๋า</h2>${list.length ? `<div class="items">${itemsHtml(Object.fromEntries(list))}</div>` : '<p class="note">กระเป๋ายังว่าง</p>'}`);
}

// ---------- ไปรษณีย์ ----------
// แต่ละซองคือ 1 เอกสาร กดรับ = เพิ่มของเข้ากระเป๋า + ลบซอง ในรายการเดียวกัน (รับซ้ำไม่ได้)
async function openMail(keep) {
  if(cloudPromise)await cloudPromise;
  // fix15f: เปิดซ้ำหลังกดรับ → ไม่แสดงหน้า "กำลังเปิดตู้…" และคงตำแหน่งที่เลื่อนไว้
  const mc=$('#mcard'),top=keep&&mc?mc.scrollTop:0;
  if(!keep)modal('<h2>📮 ไปรษณีย์</h2><p class="note">กำลังเปิดตู้…</p>', [{ t: 'ปิด', c: 'gray' }]);
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
  modal(html, [{ t: 'ปิด', c: 'gray' }]);if(top)$('#mcard').scrollTop=top;
  $('#mcard').querySelectorAll('[data-id]').forEach(b => b.onclick = () => claim(b.dataset.id, b));
}
function gpath(k) { const c = CAT[k], p = c ? c.p : 'pend.' + k; return p.startsWith('pend.') || p.startsWith('sub.') ? 'g.' + p : 'g.bag.' + p; }
function addPath(o, path, n) { const ks = path.split('.'); let t = o; while (ks.length > 1) { const x = ks.shift(); t[x] = t[x] || {}; t = t[x]; } t[ks[0]] = (t[ks[0]] || 0) + n; }
async function claim(id, btn) {
  busy(btn, true, 'กำลังรับ…'); if(cloudPromise)await cloudPromise;frameSave();
  const mref = doc(db, 'mail', S.user.uid, 'items', id);
  let got;
  // fix16: ระหว่างรับของ หยุดรับเซฟจากหน้าฉาก (ตัวจับเวลาสัตว์) ไม่ให้บันทึกชนกันจนของหาย · เสร็จแล้วโหลดฉากใหม่
  const H=window.__HOST,held=H?{set:H.set,del:H.del}:null;let release;
  try {
    await flush();
    if(H){H.set=()=>{};H.del=()=>{};}
    S.claiming=new Promise(r=>{release=r;});
    got = await store.claimMail(mref, (game, mail) => {
      const release=mail.escrowRelease;if(release&&game.sub?.minigames?.escrows?.[release.system]?.round===release.round)delete game.sub.minigames.escrows[release.system];
      if (mail.kusal) game.merit = (game.merit || 0) + mail.kusal;
      for (const [k,n] of Object.entries(mail.items || {})) addPath(game, gpath(k).slice(2), n);
      refillAdminInventory(game,S.admin,CATALOG);
    });
  } catch (e) { busy(btn, false, 'กดรับ'); if (e.code === 'save/conflict') otherDevice(); else if (e.thai) { toast(e.thai); openMail(true); } else toast(thaiError(e)); return; }
  finally { if(H&&held){H.set=held.set;H.del=held.del;} S.claiming=null; release?.(); }
  // ส่งขึ้นระบบสำเร็จแล้ว จึงเพิ่มในเครื่องให้ตรงกัน
  S.P.coins += got.coins || 0; S.P.mailCount = Math.max(0, S.P.mailCount - 1);
  S.P.g=joinGame(store.parts.values());
  refillAdminInventory(S.P.g,S.admin,CATALOG);
  if(!hwOpen())reloadScreen();
  toast('รับแล้ว เข้ากระเป๋าเรียบร้อย'); refreshBar(); openMail(true);
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
    <div class="atabs">${[['approvals', '📋 สมาชิกใหม่ ('+pendingCount+')'], ['send', '🎁 ส่งของ'], ['nb', '🏘️ เนเบอร์ฮูด'], ['rumor', '📰 ข่าวลือ'], ['demon', '😈 บันทึกแกล้ง'], ['atm', '🏧 ATM'], ['players', '👥 ผู้เล่น'], ['inventory', '🎒 ตรวจของ'], ['backup', '💾 สำรอง/กู้คืน'], ['settings', '⚙️ ตั้งค่าเกม']].map(([k, t]) => `<button data-t="${k}" class="${A.tab === k ? 'on' : ''}">${t}</button>`).join('')}</div>
    <div id="aBody"></div></div></div>`;
  $('#aBack').onclick = () => { const o = $('#ov'); if (o && !o.hidden) { o.hidden = true; o.innerHTML = ''; reloadScreen(); } else renderClosed(); };
  document.querySelectorAll('.atabs button').forEach(b => b.onclick = () => { A.tab = b.dataset.t; renderAdmin(); });
  A.fresh=true;({ approvals: tabApprovals, send: tabSend, nb: tabNb, rumor: tabRumor, demon: tabDemon, atm: tabAtm, players: tabPlayers, inventory: tabInventory, backup: tabBackup, settings: tabSettings })[A.tab]();
}
/* fix15f: แท็บแอดมินวาดตัวเองซ้ำ (กดเพิ่มของ/เลือกคน/อนุมัติ) → คงตำแหน่งที่เลื่อนไว้ ทั้งหน้าและรายการย่อย */
const ADMIN_LISTS=['.as-pick','.as-chips','.ppl','.news'];
function keepAdminScroll(fn){return async(...a)=>{const fresh=A.fresh;A.fresh=false;if(fresh)return fn(...a);
  const ov=$('#ov'),host=ov&&!ov.hidden?ov:(document.scrollingElement||document.documentElement),top=host.scrollTop,body=$('#aBody'),inner=ADMIN_LISTS.map(q=>body?.querySelector(q)?.scrollTop||0);
  const out=await fn(...a);host.scrollTop=top;const b2=$('#aBody');ADMIN_LISTS.forEach((q,i)=>{const e=b2?.querySelector(q);if(e&&inner[i])e.scrollTop=inner[i];});return out;};}
/* fix17 😈 บันทึกการแกล้งด้วยไอเทมปีศาจ — เห็นเฉพาะแอดมิน (ผู้เล่นไม่มีทางรู้ว่าใครแกล้ง) */
/* fix19 🏧 ATM: บันทึกการโอนทั้งหมด · เปิด/ปิดตู้ · ล้าง PIN ให้คนที่ลืม (บัตรส่งได้จากแท็บ 🎁 ส่งของ หมวด "บัตร ATM") */
async function tabAtm(){const B=$('#aBody');B.innerHTML='<div class="box">กำลังโหลด…</div>';const call=input=>httpsCallable(functions,'atmActionCloud')({input}).then(r=>r.data);
 try{const out=await call({type:'admin-list'});let q='';const when=t=>new Date(t).toLocaleString('th-TH',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
  const draw=()=>{const rows=out.rows.filter(r=>!q||String(r.fn).includes(q)||String(r.tn||'').includes(q)),tr=rows.filter(r=>r.kind!=='fx'),fx=rows.filter(r=>r.kind==='fx'),sum=tr.reduce((a,r)=>a+r.amount,0),fees=tr.reduce((a,r)=>a+(r.fee||0),0),fxSum=fx.reduce((a,r)=>a+r.amount,0),fxN=fx.reduce((a,r)=>a+(r.n||0),0);
   B.innerHTML='<div class="box"><div class="row" style="justify-content:space-between;align-items:center"><b>🏧 ตู้ ATM กุศล</b><button class="btn sm '+(out.open?'':'gray')+'" id="atmTg">'+(out.open?'✅ เปิดอยู่ (กดเพื่อปิด)':'⛔ ปิดอยู่ (กดเพื่อเปิด)')+'</button></div><p style="font-size:.76rem;color:#9A7A68;margin:.3rem 0">ส่งบัตรได้ที่แท็บ 🎁 ส่งของ หมวด "บัตร ATM" · ผู้เล่นตั้ง PIN เองที่ตู้</p>'
    +'<input id="atmQ" placeholder="🔍 ค้นชื่อคนโอน/คนรับ" value="'+esc(q)+'" style="width:100%;box-sizing:border-box;margin:.3rem 0;padding:.4rem .6rem;border:2px solid #F3E9DE;border-radius:.6rem;font:inherit">'
    +'<p style="font-size:.8rem;margin:.2rem 0">'+rows.length+' รายการ · โอนรวม <b>'+fmt(sum)+'</b> · ค่าธรรมเนียมรวม '+fmt(fees)+' · 💱 แลกเงิน '+fx.length+' ครั้ง ('+fmt(fxN)+' ชุด → '+fmt(fxSum)+' กุศล)</p>'
    +'<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.74rem"><tr style="color:#9A7A68;text-align:left"><th>เวลา</th><th>จาก</th><th>ถึง</th><th style="text-align:right">ยอด</th><th style="text-align:right">ค่าธรรมเนียม</th><th>เลขที่</th></tr>'
    +rows.map(r=>'<tr style="border-top:1px solid #F3E9DE"><td>'+when(r.at)+'</td><td>'+esc(r.fn)+'</td><td>'+(r.kind==='fx'?'💱 แลก '+fmt(r.n)+' ชุด @'+(r.rate/100).toFixed(2):esc(r.tn))+'</td><td style="text-align:right;font-variant-numeric:tabular-nums">'+fmt(r.amount)+'</td><td style="text-align:right;font-variant-numeric:tabular-nums">'+(r.kind==='fx'?'–':fmt(r.fee))+'</td><td style="font-size:.66rem">'+esc(r.id)+'</td></tr>').join('')+'</table></div>'+(rows.length?'':'<p>ยังไม่มีรายการ</p>')
    +'<div style="margin-top:.7rem;border-top:2px dashed #F3E9DE;padding-top:.5rem"><b>🔑 ล้าง PIN (ผู้เล่นลืมรหัส)</b><div class="row" style="gap:.4rem;margin-top:.3rem"><select id="atmU" style="flex:1;padding:.35rem;border-radius:.5rem;border:2px solid #F3E9DE;font:inherit"></select><button class="btn sm" id="atmR">ล้าง PIN</button></div></div></div>';
   $('#atmTg').onclick=async()=>{const r=await call({type:'admin-open',open:!out.open});out.open=r.open;toast(r.open?'🏧 เปิดตู้ ATM แล้ว':'⛔ ปิดตู้ ATM แล้ว');draw();};
   $('#atmQ').onchange=e=>{q=e.target.value.trim();draw();};
   httpsCallable(functions,'gameRoster')({}).then(r=>{const sel=$('#atmU');if(sel)sel.innerHTML=(r.data||[]).filter(x=>!x.admin).sort((a,b)=>String(a.name).localeCompare(String(b.name),'th')).map(x=>'<option value="'+esc(x.uid)+'">'+esc(x.name)+'</option>').join('');}).catch(()=>{});
   $('#atmR').onclick=async()=>{const u=$('#atmU').value;if(!u)return;await call({type:'admin-reset',uid:u});toast('🔑 ล้าง PIN แล้ว ผู้เล่นตั้งใหม่ได้ที่ตู้');};};
  draw();}catch(e){B.innerHTML='<div class="box">'+esc(e.message||'โหลดไม่สำเร็จ')+'</div>';}}
async function tabDemon(day){const B=$('#aBody');const d=day||new Date(Date.now()+serverOffset+7*3600e3).toISOString().slice(0,10);B.innerHTML='<div class="box">กำลังโหลดบันทึก…</div>';
 try{const out=(await httpsCallable(functions,'demonActionCloud')({input:{type:'log',day:d}})).data,E={music:'🎶',hour:'⏳',coffin:'⛓️',heart:'💖'},W={send:'ใช้',pass:'ส่งหัวใจต่อ',seal:'เปิดหีบ'},R={g:'🟢 หลุดคำสาป',r:'🔴 คำสาปเต็ม',x:'🔁 สะท้อนกลับ'};
  const prev=new Date(Date.parse(d)-864e5).toISOString().slice(0,10),next=new Date(Date.parse(d)+864e5).toISOString().slice(0,10);
  B.innerHTML='<div class="box"><div class="row" style="justify-content:space-between"><button class="btn sm gray" id="dlPrev">‹ '+prev.slice(5)+'</button><b>😈 '+d+' · '+out.rows.length+' รายการ</b><button class="btn sm gray" id="dlNext">'+next.slice(5)+' ›</button></div><p style="font-size:.78rem;color:#9A7A68;margin:.3rem 0">เห็นเฉพาะแอดมิน · ผู้เล่นไม่เห็นชื่อคนแกล้ง</p>'
   +(out.rows.length?out.rows.map(r=>'<div style="display:flex;gap:.5rem;align-items:center;padding:.3rem 0;border-top:1px solid #F3E9DE;font-size:.82rem"><span style="color:#9A7A68;font-variant-numeric:tabular-nums">'+new Date(r.at).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})+'</span><span>'+(E[r.k]||'😈')+'</span><span>'+(r.w==='seal'?esc(r.tn||r.to)+' เปิดหีบ → '+(R[r.r]||''):'<b>'+esc(r.fn||r.from)+'</b> '+(W[r.w]||r.w)+' → <b>'+esc(r.tn||r.to)+'</b>'+(r.n?' (ทอด '+r.n+')':''))+'</span></div>').join(''):'<p>ไม่มีรายการ</p>')+'</div>';
  $('#dlPrev').onclick=()=>tabDemon(prev);$('#dlNext').onclick=()=>tabDemon(next);}catch(e){B.innerHTML='<div class="box">'+esc(e.message||'โหลดไม่สำเร็จ')+'</div>';}}
async function tabSend(){
 const B=$('#aBody'),g=A.gift;let ps;
 try{if(!A.players||!A.sendLoaded){B.innerHTML='<div class="box">กำลังอ่านข้อมูลครั้งแรก…</div>';const center=(await httpsCallable(functions,'adminCenterCloud')({type:'status',session:S.sessionId})).data;ps=center.players;A.players=ps;A.templates=center.templates;A.favorites=center.favorites;A.pendingRun=center.pendingRun;A.history=center.history;A.sendLoaded=true;}else ps=A.players;
 }catch(e){console.error('admin center status',e);/* fix17e: โหลดใหม่อัตโนมัติ 1 ครั้ง แล้วแสดงสาเหตุ + ปุ่มลองใหม่ */if(!A.statusRetried){A.statusRetried=true;setTimeout(()=>{if(document.contains(B))tabSend();},1200);B.innerHTML='<div class="box">กำลังลองโหลดอีกครั้ง…</div>';return;}A.statusRetried=false;B.innerHTML='<div class="box"><b>โหลดหน้าส่งของไม่สำเร็จ</b><p>'+esc(thaiError(e))+'</p><button class="btn" id="sendRetry">🔄 โหลดใหม่</button></div>';const rb=document.getElementById('sendRetry');if(rb)rb.onclick=()=>{A.sendLoaded=false;tabSend();};return;}
 A.statusRetried=false;
 if(!document.contains(B))return;
 ps=ps.filter(p=>p.approval!=='rejected');
 const eligible=new Set(ps.map(p=>p.uid));A.sel=new Set([...A.sel].filter(uid=>eligible.has(uid)));
 if(A.pendingRun){const r=A.pendingRun;B.innerHTML=`<div class="box"><h3>รายการส่งค้าง: ${esc(r.body.title)}</h3><button class="btn" id="gResume">ส่งรายการเดิมต่อ</button><p>รายการสำเร็จจะไม่ส่งซ้ำ แม้สมาชิกกดรับไปแล้ว</p></div>`;$('#gResume').onclick=()=>{A.gift={...r.body,operationId:r.operationId};sendGift(r.uids,r.names,r.packs||{});};return;}
 // fix14: หน้าส่งของแบบใหม่ (ตาม Preview) — การ์ด 4 ขั้น + แถบสรุปลอยด้านล่าง · แตะชื่อแล้วอัปเดตทันที · ตั้งแพ็กรายคนได้
 A.packs ||= {};A.pq ??= '';A.tpl ??= -1;const categories=[...new Set(CATALOG.map(c=>c.g))];A.category ||= categories[0];
 const COL=['#F2A23A','#5BB6D4','#B07CC6','#F27E9B','#6CC9A8','#E07A5F','#7C9CE0','#D4A017'],TINT=['#FFEBD9','#EFE6FF','#E4F7EF','#FFF5D6','#FFE3EC','#E3F1FB'];
 const colOf=uid=>COL[Math.max(0,ps.findIndex(p=>p.uid===uid))%COL.length],ini=s=>esc([...String(s||'?')][0].toUpperCase()),nameOf=uid=>ps.find(p=>p.uid===uid)?.name||uid;
 const filt=CATALOG.filter(c=>(A.category==='favorites'?A.favorites.includes(c.k):A.q?true:c.g===A.category)&&(!A.q||c.n.includes(A.q)||c.k.includes(A.q.toLowerCase())));
 const parts=(n=1)=>[g.kusal?['<span class="as-e">💛</span>','กุศล',g.kusal*n,1]:null,g.coins?['<span class="as-e">🪙</span>','เหรียญฮาโลวีน',g.coins*n,1]:null,...Object.entries(g.items).filter(([k])=>CAT[k]).map(([k,q])=>[`<img class="as-e" src="${IMG(CAT[k].i)}" alt="">`,CAT[k].n,q*n,0,k])].filter(Boolean);
 const line=n=>parts(n).map(([e,nm,v])=>`${esc(nm)} ×${fmt(v)}`).join(' · ')||'แพ็กยังว่าง';
 const tplCard=(t,i)=>{const b=t.body||{},its=Object.keys(b.items||{}).filter(k=>CAT[k]);return `<button class="as-tpl${i===A.tpl?' on':''}" style="--tint:${TINT[i%TINT.length]}" data-template="${i}"><span class="as-bi">${its[0]?`<img src="${IMG(CAT[its[0]].i)}" alt="">`:esc(b.icon||'🎁')}</span><b>${esc(t.name)}</b><span class="as-mini">${its.slice(1,5).map(k=>`<img src="${IMG(CAT[k].i)}" alt="">`).join('')}</span><span class="as-ks">${b.kusal?'💛 '+fmt(b.kusal):b.coins?'🪙 '+fmt(b.coins):'📦 '+its.length+' อย่าง'}</span><i data-del-template="${i}" aria-label="ลบแพ็ก">✕</i></button>`;};
 B.innerHTML=`<div class="asd">
 <section class="as-card"><div class="as-ch"><span class="as-n">1</span><div class="as-grow"><h2>เลือกแพ็กเกจ</h2><small>แพ็กที่บันทึกไว้ · ปัดซ้ายขวาดูเพิ่ม</small></div></div>
  <div class="as-tpls">${A.templates.map(tplCard).join('')}<button class="as-tpl add" id="saveTemplate"><span>＋</span>บันทึกแพ็กนี้</button></div></section>
 <section class="as-card"><div class="as-ch"><span class="as-n">2</span><div class="as-grow"><h2>ของใน 1 แพ็ก</h2><small>${esc(g.icon||'🎁')} ${esc(g.title)}</small></div><button class="as-link" id="asEdit">${A.editOpen?'✓ เสร็จ':'✏️ แก้ไข'}</button></div>
  <div class="as-items">${parts().map(([e,nm,v,k,key])=>`<div class="as-it${k?' k':''}">${e}<span>${esc(nm)}</span>${A.editOpen&&key?`<input type="number" min="0" data-k="${key}" value="${v}" aria-label="จำนวน ${esc(nm)}"><button class="as-x" data-rm="${key}" aria-label="ลบ">✕</button>`:`<b>×${fmt(v)}</b>`}</div>`).join('')||'<div class="as-empty" style="grid-column:1/-1"><b>📦</b>แตะ ✏️ แก้ไข เพื่อใส่ของ</div>'}</div>
  <div class="as-editor" ${A.editOpen?'':'hidden'}>
   <div class="as-form"><label>📝 หัวข้อ<input id="gT" value="${esc(g.title)}"></label><label>💬 ข้อความ<input id="gM" value="${esc(g.msg)}"></label><label>💛 กุศล<input id="gK" type="number" min="0" value="${g.kusal||0}"></label><label>🪙 เหรียญ<input id="gC" type="number" min="0" value="${g.coins||0}"></label></div>
   <div class="as-srch">🔍<input id="gQ" placeholder="ค้นหาไอเทมทุกหมวด" value="${esc(A.q)}"></div>
   <div class="as-cats"><button data-cat="favorites" class="${A.category==='favorites'?'on':''}">⭐ โปรด</button>${categories.map(c=>`<button data-cat="${esc(c)}" class="${A.category===c&&!A.q?'on':''}">${esc(c)}</button>`).join('')}</div>
   <div class="as-pick">${filt.map(c=>`<div><img src="${IMG(c.i)}" loading="lazy" alt=""><span>${esc(c.n)}</span><button class="star" data-favorite="${c.k}" aria-label="รายการโปรด">${A.favorites.includes(c.k)?'★':'☆'}</button><button data-add="${c.k}" aria-label="เพิ่ม">＋</button></div>`).join('')||'<p class="note">หมวดนี้ยังไม่มีรายการ</p>'}</div>
  </div></section>
 <section class="as-card"><div class="as-ch"><span class="as-n">3</span><div class="as-grow"><h2>ผู้รับ</h2><small>แตะชื่อเพื่อเลือก</small></div><span class="as-count" id="asCount"></span></div>
  <div class="as-srch">🔍<input id="asQ" placeholder="ค้นหาชื่อผู้เล่น" autocomplete="off" value="${esc(A.pq)}"><button class="as-link" id="sAll">ทุกคน</button><button class="as-link" id="sReload" aria-label="โหลดรายชื่อใหม่">🔄</button></div>
  <div class="as-chips" id="asChips"></div></section>
 <section class="as-card"><div class="as-ch"><span class="as-n">4</span><div class="as-grow"><h2>จำนวนแพ็กของแต่ละคน</h2><small>ระบบคูณยอดให้เอง</small></div></div><div id="asSel"></div></section>
 <details class="as-card as-hist"><summary>📜 ประวัติส่งล่าสุด ${A.history.length} รายการ</summary>${A.history.filter(h=>h.type==='gift').map(h=>`<div class="hist"><b>${esc(h.title)}</b><small> · ${h.at?new Date(typeof h.at==='number'?h.at:h.at.toMillis()).toLocaleString('th-TH'):''}</small><p>${esc((h.to||[]).join(', '))} (${h.count} คน)</p><div class="items">${itemsHtml(h.items||{})}</div><p>กุศลต่อแพ็ก ${fmt(h.kusal)} · เหรียญ ${fmt(h.coins)}</p>${h.packs?'<p>แพ็ก: '+Object.entries(h.packs).map(([uid,n])=>esc(nameOf(uid))+' ×'+n).join(' · ')+'</p>':''}</div>`).join('')||'ยังไม่มีประวัติ'}</details>
 <div class="as-dock"><div class="in"><div class="as-stack" id="asStack"></div><div class="as-sum" id="asSum"></div><button class="as-go" id="gSend">ตรวจยอด →</button></div></div>
 <div class="as-modal" id="asModal"><div class="as-sheet" id="asSheet"></div></div></div>`;
 const keep=()=>{const v=id=>B.querySelector('#'+id);if(v('gT')){g.title=v('gT').value.trim()||'ของขวัญจากยัยหนู';g.msg=v('gM').value.trim();g.kusal=Math.max(0,Math.floor(Number(v('gK').value)||0));g.coins=Math.max(0,Math.floor(Number(v('gC').value)||0));}B.querySelectorAll('[data-k]').forEach(i=>{const n=Math.floor(Number(i.value)||0);if(n>0)g.items[i.dataset.k]=n;else delete g.items[i.dataset.k];});};
 A.captureSend=keep;
 const persist=async()=>{await httpsCallable(functions,'adminCenterCloud')({type:'preferences',session:S.sessionId,templates:A.templates,favorites:A.favorites});};
 const total=()=>[...A.sel].reduce((a,uid)=>a+(A.packs[uid]||1),0);
 const dock=()=>{const sel=[...A.sel],tp=total();$('#asCount').textContent=sel.length+' คน';
  $('#asStack').innerHTML=sel.slice(0,4).map(uid=>`<span style="--c:${colOf(uid)}">${ini(nameOf(uid))}</span>`).join('')+(sel.length>4?`<span style="--c:#C9B6A6">+${sel.length-4}</span>`:'');
  $('#asSum').innerHTML=sel.length?`<b>${sel.length} คน · ${fmt(tp)} แพ็ก</b><small>${g.kusal?'💛 กุศลรวม '+fmt(g.kusal*tp):esc(g.icon||'🎁')+' '+esc(g.title)}</small>`:`<b style="color:var(--soft)">ยังไม่ได้เลือกผู้รับ</b><small>${esc(g.icon||'🎁')} ${esc(g.title)}</small>`;
  $('#gSend').disabled=!sel.length;};
 const chips=()=>{const q=A.pq.toLowerCase(),vis=ps.filter(p=>!q||String(p.name||'').toLowerCase().includes(q));
  $('#asChips').innerHTML=vis.map(p=>`<button class="as-pc${A.sel.has(p.uid)?' on':''}" style="--c:${colOf(p.uid)}" data-u="${esc(p.uid)}" aria-pressed="${A.sel.has(p.uid)}"><span class="av"><b>${ini(p.name)}</b></span>${esc(p.name)}</button>`).join('')||'<span class="note">ไม่พบชื่อนี้</span>';};
 const selList=()=>{const sel=[...A.sel];if(!sel.length){$('#asSel').innerHTML='<div class="as-empty"><b>👆</b>เลือกผู้รับในข้อ 3 ก่อน แล้วตั้งจำนวนแพ็กตรงนี้</div>';dock();return;}
  $('#asSel').innerHTML=`<div class="as-bulk">⚡ ทุกคน = <span class="as-seg">${[1,3,5,10,15].map(n=>`<button data-bulk="${n}">${n}</button>`).join('')}</span> แพ็ก</div><div>${sel.map(uid=>{const n=A.packs[uid]||1;return `<div class="as-sr"><span class="av" style="--c:${colOf(uid)}">${ini(nameOf(uid))}</span><span class="nm">${esc(nameOf(uid))}</span><div class="as-step"><button data-dec="${esc(uid)}" aria-label="ลด">−</button><input data-packs="${esc(uid)}" type="number" min="1" max="1000000" value="${n}" inputmode="numeric" aria-label="จำนวนแพ็กของ ${esc(nameOf(uid))}"><small>แพ็ก</small><button data-inc="${esc(uid)}" aria-label="เพิ่ม">＋</button></div><span class="tot" data-tot="${esc(uid)}">${line(n)}</span><button class="as-rm" data-unsel="${esc(uid)}">เอาออก</button></div>`;}).join('')}</div>`;dock();};
 const setPacks=(uid,n)=>{n=Math.max(1,Math.min(1000000,Math.floor(Number(n)||1)));A.packs[uid]=n;const inp=B.querySelector(`[data-packs="${CSS.escape(uid)}"]`);if(inp&&Number(inp.value)!==n)inp.value=n;const t=B.querySelector(`[data-tot="${CSS.escape(uid)}"]`);if(t)t.textContent=line(n);dock();};
 chips();selList();
 B.querySelector('.asd').onclick=async e=>{const t=e.target;
  const del=t.closest('[data-del-template]');if(del){e.stopPropagation();keep();const i=+del.dataset.delTemplate;if(!confirm('ลบแพ็ก "'+A.templates[i].name+'" ?'))return;A.templates.splice(i,1);if(A.tpl===i)A.tpl=-1;else if(A.tpl>i)A.tpl--;try{await persist();}catch(err){toast(thaiError(err));}tabSend();return;}
  const tp=t.closest('[data-template]');if(tp){keep();A.tpl=+tp.dataset.template;A.gift=clone(A.templates[A.tpl].body);tabSend();return;}
  const u=t.closest('[data-u]');if(u){const id=u.dataset.u;A.sel.has(id)?A.sel.delete(id):A.sel.add(id);u.classList.toggle('on',A.sel.has(id));u.setAttribute('aria-pressed',A.sel.has(id));selList();return;}
  const dc=t.closest('[data-dec]');if(dc)return setPacks(dc.dataset.dec,(A.packs[dc.dataset.dec]||1)-1);
  const ic=t.closest('[data-inc]');if(ic)return setPacks(ic.dataset.inc,(A.packs[ic.dataset.inc]||1)+1);
  const bk=t.closest('[data-bulk]');if(bk){A.sel.forEach(uid=>A.packs[uid]=+bk.dataset.bulk);selList();toast('⚡ ตั้งทุกคนเป็น '+bk.dataset.bulk+' แพ็กแล้ว');return;}
  const un=t.closest('[data-unsel]');if(un){A.sel.delete(un.dataset.unsel);chips();selList();return;}
  const ad=t.closest('[data-add]');if(ad){keep();g.items[ad.dataset.add]=(g.items[ad.dataset.add]||0)+1;A.tpl=-1;tabSend();return;}
  const rm=t.closest('[data-rm]');if(rm){keep();delete g.items[rm.dataset.rm];A.tpl=-1;tabSend();return;}
  const ct=t.closest('[data-cat]');if(ct){keep();A.category=ct.dataset.cat;A.q='';tabSend();return;}
  const fv=t.closest('[data-favorite]');if(fv){keep();const k=fv.dataset.favorite;A.favorites=A.favorites.includes(k)?A.favorites.filter(x=>x!==k):[...A.favorites,k];try{await persist();tabSend();}catch(err){toast(thaiError(err));}return;}
  if(t.closest('[data-close]')||t.id==='asModal'){$('#asModal').classList.remove('on');return;}
 };
 B.querySelector('.asd').oninput=e=>{const p=e.target.dataset.packs;if(p)setPacks(p,e.target.value);};
 B.querySelector('.asd').onchange=e=>{if(e.target.matches('[data-k],#gK,#gC,#gT,#gM')){keep();A.tpl=-1;const it=e.target.dataset.k;if(it||e.target.id==='gK'||e.target.id==='gC'){const pos=e.target.id;tabSend().then(()=>{if(!it)B.querySelector('#'+pos)?.focus();});}}};
 $('#asEdit').onclick=()=>{keep();A.editOpen=!A.editOpen;tabSend();};
 $('#asQ').oninput=e=>{A.pq=e.target.value.trim();chips();};
 $('#sAll').onclick=()=>{const q=A.pq.toLowerCase(),vis=ps.filter(p=>!q||String(p.name||'').toLowerCase().includes(q));const on=vis.every(p=>A.sel.has(p.uid));vis.forEach(p=>on?A.sel.delete(p.uid):A.sel.add(p.uid));chips();selList();};
 $('#sReload').onclick=()=>{keep();A.players=null;A.sendLoaded=false;tabSend();};
 let timer;const gq=$('#gQ');if(gq)gq.oninput=e=>{clearTimeout(timer);timer=setTimeout(()=>{keep();A.q=e.target.value.trim();const pos=e.target.selectionStart;tabSend().then(()=>{$('#gQ')?.focus();$('#gQ')?.setSelectionRange(pos,pos);});},180);};
 $('#saveTemplate').onclick=async()=>{keep();if(!g.kusal&&!g.coins&&!Object.keys(g.items).length)return toast('แพ็กยังว่าง ใส่ของก่อนบันทึก');const name=(prompt('💾 ตั้งชื่อแพ็กนี้',g.title||'')||'').trim();if(!name)return;if(A.templates.length>=30&&!A.templates.some(t=>t.name===name))return toast('เก็บได้ 30 แพ็กเกจ');A.templates=A.templates.filter(t=>t.name!==name);A.templates.push({name,body:{title:g.title,msg:g.msg,icon:g.icon,kusal:g.kusal,coins:g.coins,items:{...g.items}}});A.tpl=A.templates.length-1;try{await persist();toast('💾 บันทึกแพ็ก "'+name+'" แล้ว');tabSend();}catch(e){toast(thaiError(e));}};
 $('#gSend').onclick=()=>{keep();const users=ps.filter(p=>A.sel.has(p.uid));if(!users.length)return toast('เลือกผู้รับก่อน');if(!g.kusal&&!g.coins&&!Object.keys(g.items).length)return toast('แพ็กยังว่าง');
  if([g.kusal,g.coins,...Object.values(g.items)].some(n=>!Number.isSafeInteger(n)||n<0)||users.some(p=>!Number.isSafeInteger(A.packs[p.uid]||1)))return toast('จำนวนต้องเป็นจำนวนเต็ม');
  const tp=total();$('#asSheet').innerHTML=`<div class="as-grip"></div><div class="as-rcpt"><h3>📮 ยืนยันยอดส่ง</h3><div class="meta">${esc(g.icon||'🎁')} ${esc(g.title)} · ${users.length} คน · ${fmt(tp)} แพ็ก</div>${users.map(p=>{const n=A.packs[p.uid]||1;return `<div class="as-rl"><span class="av" style="--c:${colOf(p.uid)}">${ini(p.name)}</span><b>${esc(p.name)}</b><span class="x">×${fmt(n)} แพ็ก</span><small>${line(n)}</small></div>`;}).join('')}<div class="as-grand"><b>รวมทั้งหมด</b>${line(tp)}</div></div><div class="as-acts"><button class="as-ghost" data-close>← กลับไปแก้</button><button class="as-go" id="asSendNow">📮 ส่งเลย</button></div>`;
  $('#asModal').classList.add('on');
  $('#asSendNow').onclick=()=>{$('#asModal').classList.remove('on');sendGift(users.map(p=>p.uid),users.map(p=>p.name),Object.fromEntries(users.map(p=>[p.uid,A.packs[p.uid]||1])));};
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
    A.tpl=-1;modal(`<div style="text-align:center"><div class="as-ok">✓</div><h2>ส่งเรียบร้อย!</h2><p>📮 เข้าไปรษณีย์ ${result.count} คน · รวม ${fmt(Object.values(packs).reduce((a,n)=>a+n,0)||result.count)} แพ็ก</p><p class="note">📜 บันทึกในประวัติส่งแล้ว</p></div>`,[{t:'เสร็จแล้ว',c:'pink'}]); tabSend();
  } catch (e) { modal(`<h2>ส่งไม่สำเร็จ</h2><p>${thaiError(e)}</p><p class="note">กดส่งใหม่ ระบบจะตรวจรายการที่ค้างบนคลาวด์และส่งต่อ คนที่ส่งสำเร็จแล้วจะไม่รับซ้ำ</p>`); } finally { A.sending=false; }
}
// fix14 เนเบอร์ฮูด: อนุมัติคำขอสร้าง + ดูรายการที่เปิดอยู่
/* fix15 📰 ข่าวลือ: เลือกข่าว → เลือกผู้รับ (คนเดียว/หลายคน/ทุกคน) → ส่ง · ดูสถานะของแต่ละคน
   ผู้เล่นไม่เห็นว่าใครส่ง · คนที่ยังมีข่าวค้างส่งข่าวใหม่ไม่ได้ */
const RM={kind:'G',pick:0,sel:new Set(),all:false,q:'',rows:{},players:null,at:0};
const RM_ST={ok:['ok','✅ กดรับแล้ว'],no:['no','✕ ปิดทิ้ง'],exp:['no','⌛ หมดเวลา'],fix:['ok','🙅 แก้ข่าวแล้ว'],acc:['bad','😔 ยอมรับ'],auto:['bad','⌛ ไม่ตอบ (หักแล้ว)']};
function rmStatus(r,now){if(!r)return ['none','—'];if(r.res)return RM_ST[r.res]||['no',r.res];return now<r.until?['wait','⏳ รอตอบ']:['wait','⌛ รอเข้าเกม'];}
async function tabRumor(){const B=$('#aBody');
 if(!document.getElementById('rmAdminCss')){const st=document.createElement('style');st.id='rmAdminCss';st.textContent=`.rma{display:grid;gap:.7rem}.rma .card{background:#fff;border-radius:18px;padding:.75rem .8rem;box-shadow:0 3px 10px rgba(78,53,38,.1)}.rma h3{margin:0 0 .45rem;font-size:.98rem}.rma .seg{display:grid;grid-template-columns:1fr 1fr;gap:4px;background:#F4EADB;border-radius:999px;padding:3px;margin-bottom:.5rem}.rma .seg button{border:0;border-radius:999px;padding:.45rem;font:inherit;font-size:.86rem;background:transparent;color:#957863;cursor:pointer}.rma .seg button.on{background:#6B3FA0;color:#fff}.rma .news{display:grid;gap:.4rem;max-height:46vh;overflow:auto}.rma .nw{display:flex;gap:.5rem;align-items:flex-start;text-align:left;border:2px solid #F1E3D3;background:#FFFDF8;border-radius:14px;padding:.45rem .6rem;font:inherit;font-size:.8rem;line-height:1.45;cursor:pointer;color:#4E3526;white-space:pre-wrap}.rma .nw.on{border-color:#6B3FA0;background:#F6EFFF}.rma .nw b{flex:none;font-size:.72rem;border-radius:999px;padding:.05rem .5rem;white-space:nowrap}.rma .nw .g{background:#FFF1C9;color:#9A6400}.rma .nw .r{background:#FBE1DC;color:#C8372D}.rma .ppl{display:flex;flex-wrap:wrap;gap:.35rem;max-height:30vh;overflow:auto}.rma .ppl button{border:2px solid #F1E3D3;background:#fff;border-radius:999px;padding:.2rem .65rem;font:inherit;font-size:.78rem;cursor:pointer;color:#4E3526}.rma .ppl button.on{border-color:#6B3FA0;background:#F1E8FB}.rma .ppl button:disabled{opacity:.45;cursor:not-allowed}.rma .row{display:flex;gap:.4rem;align-items:center;flex-wrap:wrap}.rma input{flex:1;min-width:0;font:inherit;border:2px solid #F1E3D3;border-radius:12px;padding:.35rem .6rem}.rma table{width:100%;border-collapse:collapse;font-size:.78rem}.rma td{padding:.35rem .2rem;border-bottom:1px solid #F1E6D6;vertical-align:middle}.rma .st{border-radius:999px;padding:.05rem .45rem;font-size:.72rem;white-space:nowrap}.rma .st.wait{background:#FFF1C9;color:#9A6400}.rma .st.ok{background:#DDF3E4;color:#2F7A48}.rma .st.no{background:#F3EAEA;color:#8A6D6D}.rma .st.bad{background:#FBE1DC;color:#C8372D}.rma .note{font-size:.72rem;color:#957863;margin-top:.35rem}`;document.head.appendChild(st);}
 try{if(!RM.players||Date.now()-RM.at>60000){B.innerHTML='<div class="box">กำลังโหลดรายชื่อและสถานะข่าวลือ…</div>';const [center,st]=await Promise.all([httpsCallable(functions,'adminCenterCloud')({type:'status',session:S.sessionId}),httpsCallable(functions,'rumorAdminCloud')({type:'status'})]);RM.players=center.data.players.filter(p=>p.approval==='approved'||!p.approval);RM.rows=st.data.rows||{};RM.at=Date.now();}}catch(e){B.textContent=thaiError(e);return;}
 if(!document.contains(B))return;const now=Date.now(),list=RM.kind==='G'?RUMOR_GOOD:RUMOR_BAD,busyOf=u=>{const r=RM.rows[u];return r&&!r.res;};
 const ppl=RM.players.filter(p=>!RM.q||String(p.name).includes(RM.q));
 B.innerHTML=`<div class="rma">
 <section class="card"><h3>1 · เลือกข่าวลือ</h3><div class="seg"><button data-k="G" class="${RM.kind==='G'?'on':''}">💌 ข่าวดี (${RUMOR_GOOD.length})</button><button data-k="B" class="${RM.kind==='B'?'on':''}">📰 ข่าวร้าย (${RUMOR_BAD.length})</button></div>
  <div class="news">${list.map((x,i)=>`<button class="nw${RM.pick===i?' on':''}" data-i="${i}"><b class="${RM.kind==='G'?'g':'r'}">${RM.kind==='G'?'🎁 +':'⚠️ −'}${fmt(x[1])}</b><span>${i+1}. ${esc(x[0])}</span></button>`).join('')}</div></section>
 <section class="card"><h3>2 · เลือกผู้รับ <small style="color:#957863;font-weight:400">${RM.all?'ทุกคน':RM.sel.size+' คน'}</small></h3>
  <div class="row" style="margin-bottom:.45rem"><input id="rmQ" placeholder="🔍 ค้นหาชื่อ" value="${esc(RM.q)}"><button class="btn sm ${RM.all?'':'gray'}" id="rmAll">${RM.all?'✅ ทุกคน':'👥 ทุกคน'}</button><button class="btn sm gray" id="rmNone">ล้าง</button></div>
  <div class="ppl">${ppl.map(p=>{const busy=busyOf(p.uid);return `<button data-u="${esc(p.uid)}" class="${RM.all||RM.sel.has(p.uid)?'on':''}" ${busy||RM.all?'disabled':''}>${busy?'⏳ ':''}${esc(p.name||'ผู้เล่น')}</button>`;}).join('')||'<span class="note">ไม่พบชื่อ</span>'}</div>
  <div class="note">⏳ = ยังมีข่าวค้างอยู่ ส่งข่าวใหม่ไม่ได้จนกว่าจะตอบ · ผู้เล่นเห็นแค่ "ข่าวลือในหมู่บ้าน" ไม่รู้ว่าใครส่ง</div></section>
 <section class="card"><div class="row"><button class="btn" id="rmSend" ${RM.all||RM.sel.size?'':'disabled'}>📨 ส่งข่าวลือ${RM.all?' ให้ทุกคน':RM.sel.size?' ('+RM.sel.size+' คน)':''}</button><button class="btn sm gray" id="rmRe">🔄 สถานะล่าสุด</button></div></section>
 <section class="card"><h3>📋 สถานะข่าวลือ</h3><table>${RM.players.map(p=>{const r=RM.rows[p.uid],[c,t]=rmStatus(r,now);return r?`<tr><td>${esc(p.name||'ผู้เล่น')}</td><td>${r.k==='G'?'💌':'📰'} #${r.i+1}</td><td><span class="st ${c}">${t}</span></td></tr>`:'';}).join('')||'<tr><td class="note">ยังไม่เคยส่งข่าวลือ</td></tr>'}</table></section></div>`;
 B.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{RM.kind=b.dataset.k;RM.pick=0;tabRumor();});
 B.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{RM.pick=+b.dataset.i;B.querySelectorAll('.nw').forEach(x=>x.classList.toggle('on',x===b));});
 B.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{const u=b.dataset.u;RM.sel.has(u)?RM.sel.delete(u):RM.sel.add(u);tabRumor();});
 $('#rmQ').oninput=e=>{RM.q=e.target.value.trim();const pos=e.target.selectionStart;tabRumor().then(()=>{const q=$('#rmQ');if(q){q.focus();q.setSelectionRange(pos,pos);}});};
 $('#rmAll').onclick=()=>{RM.all=!RM.all;tabRumor();};$('#rmNone').onclick=()=>{RM.all=false;RM.sel.clear();tabRumor();};
 $('#rmRe').onclick=()=>{RM.at=0;tabRumor();};
 $('#rmSend').onclick=async()=>{const n=RM.all?'ทุกคน':RM.sel.size+' คน',x=list[RM.pick];if(!confirm('ส่งข่าวลือ #'+(RM.pick+1)+' ('+(RM.kind==='G'?'ข่าวดี':'ข่าวร้าย')+') ให้ '+n+'?'))return;
  const b=$('#rmSend');b.disabled=true;b.textContent='กำลังส่ง…';
  try{const out=(await httpsCallable(functions,'rumorAdminCloud')({type:'send',k:RM.kind,i:RM.pick,...(RM.all?{all:true}:{uids:[...RM.sel]})})).data;toast('📨 ส่งแล้ว '+out.sent+' คน'+(out.busy?' · ข้าม '+out.busy+' คนที่ยังมีข่าวค้าง':''));RM.sel.clear();RM.all=false;RM.at=0;tabRumor();}catch(e){toast(thaiError(e));b.disabled=false;}};
}
tabSend=keepAdminScroll(tabSend);tabRumor=keepAdminScroll(tabRumor);tabApprovals=keepAdminScroll(tabApprovals);tabNb=keepAdminScroll(tabNb);
async function tabNb(){
  const B=$('#aBody');B.innerHTML='<div class="box"><p class="note">กำลังโหลด…</p></div>';
  let pend=[],act=[];
  try{[pend,act]=await Promise.all(['pending','active'].map(st=>getDocs(query(collection(db,'neighborhoods'),where('status','==',st),limit(200))).then(s=>s.docs.map(d=>({id:d.id,...d.data()})))));}catch(e){B.innerHTML=`<div class="box">${thaiError(e)}</div>`;return;}
  const names=n=>(n.members||[]).map(u=>(u===n.leader?'👑 ':'')+esc(n.names?.[u]||'สมาชิก')).join(' · ');
  B.innerHTML=`<div class="box"><h3>📨 รออนุมัติ (${pend.length})</h3>${pend.map(n=>`<div class="hist"><b>🏘️ ${esc(n.name)}</b> <small>${(n.members||[]).length} คน</small><p>${names(n)}</p><p class="note">ลงขันครบแล้ว · ยื่นเมื่อ ${n.submittedAt?new Date(n.submittedAt).toLocaleString('th-TH'):'-'}</p><div class="row"><button class="btn sm" data-nbok="${esc(n.id)}">✅ อนุมัติ</button><button class="btn sm gray" data-nbno="${esc(n.id)}">ยังไม่อนุมัติ</button></div></div>`).join('')||'<p class="note">ไม่มีคำขอรออยู่</p>'}</div>
  <div class="box"><h3>🏘️ เปิดใช้อยู่ (${act.length})</h3>${act.map(n=>`<div class="hist"><b>${esc(n.name)}</b> <small>${(n.members||[]).length}/4 คน</small><div class="row" style="flex-wrap:wrap;gap:6px;margin:6px 0">${(n.members||[]).map(u=>`<span class="btn sm gray" style="cursor:default">${u===n.leader?'👑 ':''}${esc(n.names?.[u]||'สมาชิก')}<button class="btn sm" style="margin-left:6px;padding:0 8px" data-nbrm="${esc(n.id)}|${esc(u)}" aria-label="นำออก">✖</button></span>`).join('')}${(n.invites||[]).map(u=>`<span class="btn sm gray" style="cursor:default">⏳ ${esc(n.names?.[u]||'ผู้เล่น')} รอตอบ<button class="btn sm" style="margin-left:6px;padding:0 8px" data-nbun="${esc(n.id)}|${esc(u)}" aria-label="ยกเลิกคำเชิญ">✖</button></span>`).join('')}</div>${(n.members||[]).length<4?`<div class="row" style="gap:6px"><select data-nbsel="${esc(n.id)}" style="flex:1;min-width:0"><option value="">➕ เลือกผู้เล่นที่จะเพิ่ม…</option></select><button class="btn sm" data-nbadd="${esc(n.id)}">➕ เพิ่ม</button></div>`:''}</div>`).join('')||'<p class="note">ยังไม่มี</p>'}</div>`;
  const decide=async(id,decision)=>{let note='';if(decision==='reject'){note=prompt('เหตุผล (ไม่ใส่ก็ได้)')||'';}try{await httpsCallable(functions,'nbAdminCloud')({nb:id,decision,note});toast(decision==='approve'?'🎉 อนุมัติแล้ว':'บันทึกแล้ว ของที่ลงขันยังอยู่ครบ');}catch(e){toast(thaiError(e));}tabNb();};
  B.querySelectorAll('[data-nbok]').forEach(b=>b.onclick=()=>decide(b.dataset.nbok,'approve'));B.querySelectorAll('[data-nbno]').forEach(b=>b.onclick=()=>decide(b.dataset.nbno,'reject'));
  // fix15e: เพิ่ม/นำสมาชิกออก/ยกเลิกคำเชิญ (ไม่แตะกุศล เหรียญ หรือของในกระเป๋า)
  const manage=async(id,decision,uid,msg)=>{try{await httpsCallable(functions,'nbAdminCloud')({nb:id,decision,uid});toast(msg);}catch(e){toast(thaiError(e));}tabNb();};
  const inNb=new Set([...pend,...act].flatMap(n=>[...(n.members||[])]));
  if(B.querySelector('[data-nbsel]'))loadPlayers().then(ps=>{const free=ps.filter(p=>!p.admin&&!inNb.has(p.uid)&&(!p.approval||p.approval==='approved'));B.querySelectorAll('[data-nbsel]').forEach(s=>{s.insertAdjacentHTML('beforeend',free.map(p=>`<option value="${esc(p.uid)}">${esc(p.name||p.uid)}</option>`).join(''));});}).catch(()=>{});
  B.querySelectorAll('[data-nbadd]').forEach(b=>b.onclick=()=>{const id=b.dataset.nbadd,s=B.querySelector(`[data-nbsel="${id}"]`),uid=s?.value;if(!uid){toast('เลือกผู้เล่นก่อน');return;}const nm=s.selectedOptions[0].textContent,n=act.find(x=>x.id===id);if(!confirm('เพิ่ม '+nm+' เข้าบ้าน '+(n?.name||'')+' ?'))return;manage(id,'add',uid,'👥 เพิ่ม '+nm+' แล้ว');});
  B.querySelectorAll('[data-nbrm]').forEach(b=>b.onclick=()=>{const [id,uid]=b.dataset.nbrm.split('|'),n=act.find(x=>x.id===id),nm=n?.names?.[uid]||'สมาชิก';if(!confirm('นำ '+nm+' ออกจากบ้าน '+(n?.name||'')+' ?'))return;manage(id,'remove',uid,'🚪 นำ '+nm+' ออกแล้ว');});
  B.querySelectorAll('[data-nbun]').forEach(b=>b.onclick=()=>{const [id,uid]=b.dataset.nbun.split('|'),n=act.find(x=>x.id===id),nm=n?.names?.[uid]||'ผู้เล่น';if(!confirm('ยกเลิกคำเชิญ '+nm+' ?'))return;manage(id,'uninvite',uid,'ยกเลิกคำเชิญแล้ว');});
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
    B.innerHTML = '<div class="box"><h3>🎒 ตรวจของจากคลาวด์</h3><select id="iPlayer">'+users.map(d=>'<option value="'+esc(d.id)+'">'+esc(d.data().name)+'</option>').join('')+'</select> <button class="btn sm" id="iLoad">อ่านล่าสุด</button><button class="btn sm gray" id="iAudit">ประวัติซ่อมจำนวนของ</button><div id="iResult"></div></div>';
    $('#iAudit').onclick=async()=>{const uid=$('#iPlayer').value;if(!uid)return;$('#iResult').textContent='กำลังอ่านประวัติ…';try{const report=(await httpsCallable(functions,'inventoryRepairReportCloud')({uid})).data;$('#iResult').innerHTML='<p>หลักฐานจำนวนที่เสียหายก่อนซ่อม เก็บไว้ตรวจสอบการชดเชย ของที่เป็นจำนวนปกติไม่ได้ถูกเปลี่ยน</p>'+report.rows.map(row=>'<h4>'+esc(new Date(row.at).toLocaleString())+'</h4><table class="pl"><tr><th>ของ</th><th>ก่อนซ่อม</th><th>หลังซ่อม</th></tr>'+row.issues.map(x=>{const c=CATALOG.find(c=>(c.p.startsWith('sub.')?c.p:'bag.'+c.p)===x.path),n=typeof x.raw==='string'&&/^-?\d+$/.test(x.raw)&&Number.isSafeInteger(Number(x.raw))?Number(x.raw):0;return '<tr><td>'+esc(c?.n||x.path)+'</td><td>'+esc(JSON.stringify(x.raw))+'</td><td>'+n+'</td></tr>';}).join('')+'</table>').join('')+(report.rows.length?'':'<p>ไม่มีประวัติซ่อม</p>');}catch(e){$('#iResult').textContent=e.message;}};
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
    <div class="box" id="hwmBox"><h3>🎮 มินิเกมฮาโลวีน</h3><p class="note">กำลังโหลด…</p></div>
    <div class="box"><h3>ℹ️ ข้อมูลเครื่องนี้</h3><p class="note">รหัสบัญชีของคุณ (ใช้ตั้งสิทธิ์แอดมิน): <b>${S.user.uid}</b><br>ขนาดข้อมูลในหน่วยความจำ: ${(sizeOf(S.P) / 1024).toFixed(1)}KB • ข้อมูลเกมใน Firebase แยกตามระบบแล้ว</p></div>`;
  $('#tOpen').onclick = async () => { try { await setDoc(doc(db, 'settings', 'global'), { open: !S.settings.open, at: serverTimestamp() }, { merge: true }); toast('บันทึกแล้ว'); tabSettings(); } catch (e) { toast(thaiError(e)); } };
  hwmAdmin();
}
/* fix16: เปิด/ปิด + เวลาเปิดร้าน ของมินิเกมฮาโลวีน (เก็บที่ world/hwmini · ผู้เล่นเห็นผลตอนเปิดเกมครั้งถัดไป) */
async function hwmAdmin(){const box=$('#hwmBox');if(!box)return;let v;
  try{v=(await cloudAction('hwmini',{type:'status'})).view;}catch(e){box.innerHTML='<h3>🎮 มินิเกมฮาโลวีน</h3><p class="warn">'+esc(thaiError(e))+'</p>';return;}
  if(!document.contains(box))return;
  const G=[['cup','🎩 หาแมวในแก้ว','คอกแมว'],['soup','🎃 ร้านซุปแม่มด','หลังบ้าน']],hh=(n,sel,max)=>Array.from({length:max+1},(_,i)=>i).filter(i=>n==='to'?i>=1:i<=23).map(i=>`<option value="${i}"${i===sel?' selected':''}>${String(i).padStart(2,'0')}:00</option>`).join('');
  box.innerHTML='<h3>🎮 มินิเกมฮาโลวีน</h3>'+G.map(([k,n,where])=>{const c=v.cfg[k];return `<div class="hwm" style="border:2px solid #F3E9DE;border-radius:1rem;padding:.6rem;margin:.4rem 0;background:#fff">
   <div class="row" style="justify-content:space-between"><b>${n} <small style="color:#9A7A68">(${where})</small></b><span>${c.on?(v.open[k]?'<span class="ok">🟢 เปิดอยู่</span>':'<span class="warn">🌙 นอกเวลา</span>'):'<span class="warn">🔴 ปิด</span>'}</span></div>
   <div class="row" style="gap:.4rem;margin-top:.4rem;flex-wrap:wrap"><label>เปิด <select data-hf="${k}">${hh('from',c.from,23)}</select></label><label>ปิด <select data-ht="${k}">${hh('to',c.to,24)}</select></label>
   <button class="btn sm" data-hs="${k}">💾 บันทึกเวลา</button><button class="btn sm ${c.on?'pink':''}" data-ho="${k}">${c.on?'ปิดเกม':'เปิดเกม'}</button></div></div>`}).join('')+'<p class="note">เวลาไทย • เปลี่ยนแล้วมีผลทันทีกับการเริ่มรอบใหม่</p>';
  const save=async(k,set)=>{try{await cloudAction('hwmini',{type:'config',game:k,set});toast('บันทึกแล้ว');hwmAdmin();}catch(e){toast(thaiError(e));}};
  box.querySelectorAll('[data-hs]').forEach(b=>b.onclick=()=>{const k=b.dataset.hs;save(k,{from:+box.querySelector(`[data-hf="${k}"]`).value,to:+box.querySelector(`[data-ht="${k}"]`).value});});
  box.querySelectorAll('[data-ho]').forEach(b=>b.onclick=()=>save(b.dataset.ho,{on:!v.cfg[b.dataset.ho].on}));
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
