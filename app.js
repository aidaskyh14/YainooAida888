// ในสวนของยัยหนู ซีซั่น 3 — ชุดที่ 1 (รากฐาน)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, orderBy, limit, writeBatch, runTransaction, increment, serverTimestamp, Timestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { CATALOG } from './catalog.js?v=1';

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
const db = getFirestore(app);
const CAT = Object.fromEntries(CATALOG.map(c => [c.k, c]));
const IMG = n => 'images/' + n;
const COIN_IMG = IMG('gacha-coin.webp');

// ---------- เครื่องมือหน้าจอ ----------
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.round(n || 0).toLocaleString('en-US');
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
  return { v: SAVE_VERSION, name, kusal: 0, coins: 0, bag: {}, mailCount: 0, level: 1, createdAt: serverTimestamp(), lastLogin: serverTimestamp(), session: '', by: '' };
}

// ---------- ระบบเซฟ ----------
// หลัก: เปลี่ยนค่าในเครื่องทันที -> จดว่าช่องไหนเปลี่ยน -> รวบส่งทุก 30 วิ และตอนพับแอป
// ของสำคัญใช้ critical() ส่งทันทีแบบสำเร็จหมดหรือไม่เกิดเลย
// เซฟเดียวต่อคน เก็บเป็นตัวเลขเท่านั้น และตรวจขนาดก่อนส่งทุกครั้ง
// เล่นได้ทีละ 1 เครื่อง: ทุกการบันทึกแนบรหัสเครื่อง กฎ Firebase ปฏิเสธเครื่องเก่า
const playerRef = () => doc(db, 'players', S.user.uid);
function change(field) { S.dirty.add(field); showSave('รอบันทึก…'); }
function addItem(key, n) { S.P.bag[key] = Math.max(0, (S.P.bag[key] || 0) + n); if (!S.P.bag[key]) delete S.P.bag[key]; change('bag'); }
function sizeOf(o) { return new Blob([JSON.stringify(o)]).size; }
let saveDotT;
function showSave(t, bad) { const d = $('#saveDot'); d.hidden = false; d.textContent = t; d.classList.toggle('bad', !!bad); clearTimeout(saveDotT); if (!bad && t.includes('✓')) saveDotT = setTimeout(() => d.hidden = true, 1500); }
async function flush() {
  if (!S.user || !S.P || S.blocked || S.saving || !S.dirty.size) return;
  const size = sizeOf(S.P);
  if (size > SIZE_BLOCK) { showSave('เซฟใหญ่เกิน แจ้งแอดมิน', true); return; }
  const fields = [...S.dirty]; S.dirty.clear(); S.saving = true;
  const data = { by: S.sessionId, v: SAVE_VERSION, size };
  fields.forEach(f => data[f] = S.P[f]);
  try { await updateDoc(playerRef(), data); showSave('บันทึกแล้ว ✓'); }
  catch (e) { fields.forEach(f => S.dirty.add(f)); onSaveError(e); }
  finally { S.saving = false; }
}
function onSaveError(e) {
  if ((e.code || '').includes('permission-denied')) { otherDevice(); return; }
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
  clearInterval(S.timer); S.timer = setInterval(flush, SAVE_EVERY_MS);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  window.addEventListener('pagehide', flush);
  window.addEventListener('online', flush);
}

// ---------- เข้าเกม ----------
async function loadSettings() {
  try { const s = await getDoc(doc(db, 'settings', 'global')); S.settings = s.exists() ? s.data() : { open: false }; } catch (e) { S.settings = { open: false }; }
}
async function enter(user) {
  S.user = user; S.sessionId = newSession();
  try {
    const [adm, snap] = await Promise.all([getDoc(doc(db, 'admins', user.uid)).catch(() => null), getDoc(playerRef())]);
    S.admin = !!(adm && adm.exists());
    if (!snap.exists()) {
      const name = S.pendingName || 'ผู้เล่น';
      const p = defaultPlayer(name); p.session = S.sessionId; p.by = S.sessionId;
      await setDoc(playerRef(), p); S.P = { ...p, bag: {} };
    } else {
      S.P = snap.data(); S.P.bag = S.P.bag || {};
      await updateDoc(playerRef(), { session: S.sessionId, by: S.sessionId, lastLogin: serverTimestamp() });
    }
    S.pendingName = '';
    startSaver(); renderHome();
  } catch (e) {
    $('#app').innerHTML = `<div class="boot"><div style="text-align:center;padding:1rem"><p>${thaiError(e)}</p><button class="btn" onclick="location.reload()">ลองใหม่</button></div></div>`;
  }
}

// ---------- หน้าล็อกอิน (ตามหน้าทดลอง: ฉากเต็มจอ กด "เข้าสวน" แล้วการ์ดค่อยเลื่อนขึ้น ปิดได้) ----------
const HOF = { 2: { d: '4 ก.ย. – 2 ต.ค. 2569', r: [['Porpla', '7,850,112'], ['Kongkwan', '7,496,899'], ['Earn', '6,838,263']] }, 1: { d: '7 – 26 ส.ค. 2569', r: [['Earn', '369,245'], ['Porpla', '359,478'], ['Kongkwan', '341,483']] } };
let waterOn = false;
function renderLogin() {
  let mode = 'login';
  const L = t => `<div class="L"><span class="b">${t}</span><span class="f">${t}</span><span class="s">${t}</span></div>`;
  $('#app').innerHTML = `<div class="lscene"></div><canvas id="water"></canvas>
    <header class="ltitle"><div class="tw"><div class="t1">${L('ในสวนของยัยหนู')}</div><div class="t2">${L('ซีซั่น 3')}</div></div>${S.settings.open ? '' : '<div><span class="ltag">เร็วๆ นี้</span></div>'}</header>
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

// ---------- หน้าหลัก (ชั่วคราวในชุดที่ 1) ----------
function barHtml() {
  return `<div class="bar"><span class="nm">🌱 ${esc(S.P.name)}${S.admin ? ' 👑' : ''}</span>
    <span class="chip">✨${fmt(S.P.kusal)}</span><span class="chip"><img src="${COIN_IMG}" alt="">${fmt(S.P.coins)}</span>
    <button class="chip btnc" id="mailBtn">📮${S.P.mailCount > 0 ? `<i>${S.P.mailCount}</i>` : ''}</button></div>`;
}
function renderHome() {
  const closed = !S.settings.open && !S.admin;
  $('#app').innerHTML = `<div class="home">${barHtml()}
    <div class="soon">${closed ? `<h2>🌙 สวนกำลังจะเปิด</h2><p>ยัยหนูกำลังเตรียมซีซั่น 3 อยู่ เข้าระบบไว้แล้ว รอประกาศในกลุ่มได้เลย</p>` :
      `<h2>🌱 ยินดีต้อนรับสู่ซีซั่น 3</h2><p class="note">ฟาร์ม สัตว์ และระบบอื่นๆ จะทยอยเปิดในอัปเดตถัดไป ตอนนี้รับของขวัญในไปรษณีย์ได้แล้ว</p>`}
      <div class="grid2"><button class="tile" id="tMail"><span>📮</span>ไปรษณีย์</button>${S.admin ? '<button class="tile" id="tAdmin"><span>👑</span>ศูนย์แอดมิน</button>' : '<button class="tile" id="tBag"><span>🎒</span>กระเป๋า</button>'}
      ${S.admin ? '<button class="tile" id="tBag"><span>🎒</span>กระเป๋า</button>' : ''}<button class="tile" id="tOut"><span>🚪</span>ออกจากระบบ</button></div></div></div>`;
  $('#mailBtn').onclick = openMail; $('#tMail').onclick = openMail; $('#tBag').onclick = openBag;
  $('#tOut').onclick = () => modal('<h2>ออกจากระบบ?</h2><p class="note">ระบบจะบันทึกของล่าสุดก่อนออก</p>', [{ t: 'ยกเลิก', c: 'gray' }, { t: 'ออก', c: 'pink', f: async () => { await flush(); await signOut(auth); } }]);
  const a = $('#tAdmin'); if (a) a.onclick = renderAdmin;
}
function refreshBar() { const b = document.querySelector('.bar'); if (b) { b.outerHTML = barHtml(); $('#mailBtn').onclick = openMail; } }
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
  modal('<h2>📮 ไปรษณีย์</h2><p class="note">กำลังเปิดตู้…</p>', [{ t: 'ปิด', c: 'gray' }]);
  let docs = [];
  try { const q = query(collection(db, 'mail', S.user.uid, 'items'), orderBy('createdAt', 'desc'), limit(60)); docs = (await getDocs(q)).docs; }
  catch (e) { modal(`<h2>📮 ไปรษณีย์</h2><p>${thaiError(e)}</p>`); return; }
  const now = Date.now(), live = [], expired = [];
  docs.forEach(d => { const g = d.data(); (g.expireAt && g.expireAt.toMillis() < now ? expired : live).push({ id: d.id, ...g }); });
  expired.forEach(g => deleteDoc(doc(db, 'mail', S.user.uid, 'items', g.id)).catch(() => { }));
  if (S.P.mailCount !== live.length) { S.P.mailCount = live.length; change('mailCount'); refreshBar(); }
  if (!live.length) { modal('<h2>📮 ไปรษณีย์</h2><p class="note">ยังไม่มีของในไปรษณีย์</p>'); return; }
  const html = '<h2>📮 ไปรษณีย์</h2>' + live.map(g => `<div class="mail"><span class="ic">${esc(g.icon || '🎁')}</span><b>${esc(g.title)}<small>${esc(g.msg || '')}</small>
    <span class="items">${g.kusal ? `<span>✨ กุศล ${fmt(g.kusal)}</span>` : ''}${g.coins ? `<span><img src="${COIN_IMG}" alt="">เหรียญฮาโลวีน ×${fmt(g.coins)}</span>` : ''}${itemsHtml(g.items)}</span></b>
    <button class="btn sm" data-id="${g.id}">กดรับ</button></div>`).join('') + `<p class="note">กดรับแล้วซองหายทันที ซองหมดอายุใน ${MAIL_DAYS} วัน</p>`;
  modal(html, [{ t: 'ปิด', c: 'gray' }]);
  $('#mcard').querySelectorAll('[data-id]').forEach(b => b.onclick = () => claim(b.dataset.id, b));
}
async function claim(id, btn) {
  busy(btn, true, 'กำลังรับ…');
  const mref = doc(db, 'mail', S.user.uid, 'items', id);
  let got;
  try {
    got = await critical(async tx => {
      const m = await tx.get(mref);
      if (!m.exists()) { const e = new Error('gone'); e.thai = 'ซองนี้รับไปแล้ว'; throw e; }
      const g = m.data(), upd = { by: S.sessionId, mailCount: increment(-1) };
      if (g.kusal) upd.kusal = increment(g.kusal);
      if (g.coins) upd.coins = increment(g.coins);
      for (const [k, n] of Object.entries(g.items || {})) upd['bag.' + k] = increment(n);
      tx.update(playerRef(), upd); tx.delete(mref);
      return g;
    });
  } catch (e) { busy(btn, false, 'กดรับ'); if (e.thai) openMail(); return; }
  // ส่งขึ้นระบบสำเร็จแล้ว จึงเพิ่มในเครื่องให้ตรงกัน
  S.P.kusal += got.kusal || 0; S.P.coins += got.coins || 0; S.P.mailCount = Math.max(0, S.P.mailCount - 1);
  for (const [k, n] of Object.entries(got.items || {})) S.P.bag[k] = (S.P.bag[k] || 0) + n;
  toast('รับแล้ว เข้ากระเป๋าเรียบร้อย'); refreshBar(); openMail();
}

// ---------- ศูนย์แอดมิน ----------
const A = { tab: 'send', players: null, sel: new Set(), gift: { title: 'ของขวัญจากยัยหนู', msg: '', icon: '🎁', kusal: 0, coins: 0, items: {} }, q: '' };
async function loadPlayers(force) {
  if (A.players && !force) return A.players;
  const snap = await getDocs(collection(db, 'players'));
  A.players = snap.docs.map(d => ({ uid: d.id, ...d.data(), _size: sizeOf(d.data()) })).sort((a, b) => (a.name || '').localeCompare(b.name || '', 'th'));
  return A.players;
}
function renderAdmin() {
  $('#app').innerHTML = `<div class="home" style="background:#FFF4EA">${barHtml()}<div class="page">
    <div class="row"><button class="btn sm gray" id="aBack">‹ กลับ</button><b style="font-size:1.05rem">👑 ศูนย์แอดมิน</b></div>
    <div class="atabs">${[['send', '🎁 ส่งของ'], ['players', '👥 ผู้เล่น'], ['backup', '💾 สำรอง/กู้คืน'], ['settings', '⚙️ ตั้งค่าเกม']].map(([k, t]) => `<button data-t="${k}" class="${A.tab === k ? 'on' : ''}">${t}</button>`).join('')}</div>
    <div id="aBody"></div></div></div>`;
  $('#aBack').onclick = renderHome; $('#mailBtn').onclick = openMail;
  document.querySelectorAll('.atabs button').forEach(b => b.onclick = () => { A.tab = b.dataset.t; renderAdmin(); });
  ({ send: tabSend, players: tabPlayers, backup: tabBackup, settings: tabSettings })[A.tab]();
}
async function tabSend() {
  const B = $('#aBody'), g = A.gift;
  B.innerHTML = '<div class="box"><p class="note">กำลังโหลดรายชื่อ…</p></div>';
  let ps; try { ps = await loadPlayers(); } catch (e) { B.innerHTML = `<div class="box">${thaiError(e)}</div>`; return; }
  const filt = CATALOG.filter(c => !A.q || c.n.includes(A.q) || c.k.includes(A.q.toLowerCase()));
  B.innerHTML = `<div class="box"><h3>1. เลือกผู้รับ (${A.sel.size}/${ps.length})</h3>
      <div class="row"><button class="btn sm" id="sAll">${A.sel.size === ps.length && ps.length ? 'ยกเลิกทั้งหมด' : '👥 เลือกทุกคน'}</button><button class="btn sm gray" id="sReload">↻ โหลดรายชื่อใหม่</button></div>
      <div class="plist">${ps.map(p => `<label class="${A.sel.has(p.uid) ? 'on' : ''}"><input type="checkbox" data-u="${p.uid}" ${A.sel.has(p.uid) ? 'checked' : ''}>${esc(p.name)}</label>`).join('') || '<span class="note">ยังไม่มีผู้เล่น</span>'}</div></div>
    <div class="box"><h3>2. ของในซอง</h3>
      <div class="row">หัวข้อ <input type="text" id="gT" value="${esc(g.title)}" style="flex:1"></div>
      <div class="row">ข้อความ <input type="text" id="gM" value="${esc(g.msg)}" placeholder="เช่น ขอบคุณที่อุดหนุนนะคะ" style="flex:1"></div>
      <div class="row">✨ กุศล <input type="number" id="gK" min="0" value="${g.kusal || ''}" style="width:8rem"> <img src="${COIN_IMG}" style="width:1.4rem" alt=""> เหรียญฮาโลวีน <input type="number" id="gC" min="0" value="${g.coins || ''}" style="width:5rem"></div>
      <div class="picked" id="gPicked">${Object.entries(g.items).map(([k, n]) => `<div><img src="${IMG(CAT[k].i)}" alt="">${esc(CAT[k].n)}<input type="number" min="0" data-k="${k}" value="${n}"><button class="btn sm gray" data-rm="${k}">ลบ</button></div>`).join('')}</div>
      <div class="row" style="margin-top:.5rem">🔎 <input type="text" id="gQ" placeholder="ค้นหาของ เช่น ไม้ หิน กุหลาบ" value="${esc(A.q)}" style="flex:1"></div>
      <div class="cat">${filt.map(c => `<button data-add="${c.k}"><img src="${IMG(c.i)}" alt="">${esc(c.n)}</button>`).join('')}</div></div>
    <div class="box" style="text-align:center"><button class="btn pink" id="gSend">📮 ส่งเข้าไปรษณีย์</button><p class="note">ผู้รับต้องกดรับเอง กดรับแล้วซองหาย รับซ้ำไม่ได้</p></div>`;
  const keep = () => { g.title = $('#gT').value.trim() || 'ของขวัญจากยัยหนู'; g.msg = $('#gM').value.trim(); g.kusal = Math.max(0, parseInt($('#gK').value) || 0); g.coins = Math.max(0, parseInt($('#gC').value) || 0); B.querySelectorAll('[data-k]').forEach(i => { const n = Math.max(0, parseInt(i.value) || 0); if (n) g.items[i.dataset.k] = n; else delete g.items[i.dataset.k]; }); };
  B.querySelectorAll('[data-u]').forEach(i => i.onchange = () => { keep(); i.checked ? A.sel.add(i.dataset.u) : A.sel.delete(i.dataset.u); tabSend(); });
  $('#sAll').onclick = () => { keep(); if (A.sel.size === ps.length) A.sel.clear(); else ps.forEach(p => A.sel.add(p.uid)); tabSend(); };
  $('#sReload').onclick = async () => { keep(); A.players = null; tabSend(); };
  B.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { keep(); g.items[b.dataset.add] = (g.items[b.dataset.add] || 0) + 1; tabSend(); });
  B.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { keep(); delete g.items[b.dataset.rm]; tabSend(); });
  let qt; $('#gQ').oninput = e => { clearTimeout(qt); qt = setTimeout(() => { keep(); A.q = e.target.value.trim(); tabSend(); }, 350); };
  $('#gSend').onclick = () => {
    keep();
    if (!A.sel.size) { toast('ยังไม่ได้เลือกผู้รับ'); return; }
    if (!g.kusal && !g.coins && !Object.keys(g.items).length) { toast('ซองยังว่าง ใส่ของก่อนนะ'); return; }
    const names = ps.filter(p => A.sel.has(p.uid)).map(p => p.name);
    modal(`<h2>ยืนยันการส่ง</h2><p><b>${esc(g.title)}</b></p><div class="items">${g.kusal ? `<span>✨ กุศล ${fmt(g.kusal)}</span>` : ''}${g.coins ? `<span><img src="${COIN_IMG}" alt="">×${fmt(g.coins)}</span>` : ''}${itemsHtml(g.items)}</div><p class="note">ส่งให้ ${names.length} คน: ${esc(names.slice(0, 12).join(', '))}${names.length > 12 ? ' …' : ''}</p>`,
      [{ t: 'ยกเลิก', c: 'gray' }, { t: 'ส่งเลย', c: 'pink', f: () => sendGift([...A.sel], names) }]);
  };
}
async function sendGift(uids, names) {
  const g = A.gift, exp = Timestamp.fromMillis(Date.now() + MAIL_DAYS * 864e5);
  const body = { title: g.title, msg: g.msg, icon: g.icon, kusal: g.kusal || 0, coins: g.coins || 0, items: { ...g.items }, createdAt: serverTimestamp(), expireAt: exp, from: 'ยัยหนู' };
  toast('กำลังส่ง…');
  try {
    for (let i = 0; i < uids.length; i += 200) {
      const b = writeBatch(db);
      uids.slice(i, i + 200).forEach(u => { b.set(doc(collection(db, 'mail', u, 'items')), body); b.update(doc(db, 'players', u), { mailCount: increment(1) }); });
      await b.commit();
    }
    await setDoc(doc(collection(db, 'adminLog')), { at: serverTimestamp(), type: 'gift', to: names.slice(0, 50), count: uids.length, kusal: body.kusal, coins: body.coins, items: body.items, title: body.title });
    if (uids.includes(S.user.uid)) { S.P.mailCount += 1; refreshBar(); }
    A.gift = { title: 'ของขวัญจากยัยหนู', msg: '', icon: '🎁', kusal: 0, coins: 0, items: {} }; A.sel.clear();
    modal(`<h2>📮 ส่งแล้ว ${uids.length} คน</h2><p class="note">ของอยู่ในไปรษณีย์ของผู้รับ รอกดรับ</p>`); tabSend();
  } catch (e) { modal(`<h2>ส่งไม่สำเร็จ</h2><p>${thaiError(e)}</p><p class="note">ไม่มีใครได้ของซ้ำ กดส่งใหม่ได้เลย</p>`); }
}
async function tabPlayers() {
  const B = $('#aBody'); B.innerHTML = '<div class="box"><p class="note">กำลังโหลด…</p></div>';
  let ps; try { ps = await loadPlayers(true); } catch (e) { B.innerHTML = `<div class="box">${thaiError(e)}</div>`; return; }
  const big = ps.filter(p => p._size > SIZE_WARN);
  B.innerHTML = `<div class="box"><h3>👥 ผู้เล่นทั้งหมด ${ps.length} คน</h3>${big.length ? `<p class="warn">⚠️ เซฟใหญ่เกิน 200KB ${big.length} คน แจ้งผู้พัฒนาได้เลย</p>` : '<p class="ok">✅ ขนาดเซฟทุกคนปกติ</p>'}
    <table class="pl"><tr><th>ชื่อ</th><th>กุศล</th><th>เหรียญ</th><th>เซฟ</th><th>เข้าล่าสุด</th></tr>${ps.map(p => `<tr><td>${esc(p.name)}</td><td>${fmt(p.kusal)}</td><td>${fmt(p.coins)}</td><td class="${p._size > SIZE_WARN ? 'warn' : ''}">${(p._size / 1024).toFixed(1)}KB</td><td>${p.lastLogin && p.lastLogin.toDate ? p.lastLogin.toDate().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }) : '-'}</td></tr>`).join('')}</table>
    <p class="note">หน้านี้อ่านข้อมูลเฉพาะตอนกดเปิด ไม่อ่านค้าง</p></div>`;
}
const today = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
async function tabBackup() {
  const B = $('#aBody'); B.innerHTML = '<div class="box"><p class="note">กำลังโหลด…</p></div>';
  let days = [];
  try { days = (await getDocs(query(collection(db, 'backups'), orderBy('at', 'desc'), limit(14)))).docs.map(d => ({ id: d.id, ...d.data() })); } catch (e) { }
  const done = days.some(d => d.id === today());
  B.innerHTML = `<div class="box"><h3>💾 สำรองข้อมูล</h3><p>${done ? '<span class="ok">✅ วันนี้สำรองแล้ว</span>' : '<span class="warn">⚠️ วันนี้ยังไม่ได้สำรอง</span>'}</p>
      <button class="btn" id="bNow">สำรองตอนนี้</button><p class="note">เก็บเซฟของทุกคนไว้ 1 ชุดต่อวัน (เก็บย้อนหลัง 14 วัน) ใช้เวลาไม่กี่วินาที</p></div>
    <div class="box"><h3>♻️ กู้คืนผู้เล่น</h3>${days.length ? `<div class="row">วันที่ <select id="rDay">${days.map(d => `<option value="${d.id}">${d.id} (${d.count || 0} คน)</option>`).join('')}</select> <button class="btn sm gray" id="rLoad">ดูรายชื่อ</button></div><div id="rList"></div>` : '<p class="note">ยังไม่มีข้อมูลสำรอง</p>'}
      <p class="note">กู้คืนแล้ว เครื่องของผู้เล่นคนนั้นจะหยุดบันทึกทันทีและต้องเข้าเกมใหม่ กันเซฟเก่าทับของที่กู้</p></div>`;
  $('#bNow').onclick = async e => {
    busy(e.target, true, 'กำลังสำรอง…');
    try {
      const ps = await loadPlayers(true), d = today();
      for (let i = 0; i < ps.length; i += 400) { const b = writeBatch(db); ps.slice(i, i + 400).forEach(p => { const { _size, uid, ...data } = p; b.set(doc(db, 'backups', d, 'players', uid), data); }); await b.commit(); }
      await setDoc(doc(db, 'backups', d), { at: serverTimestamp(), count: ps.length });
      const old = days.filter(x => x.id !== d).slice(13);
      for (const o of old) { const pl = await getDocs(collection(db, 'backups', o.id, 'players')); const b = writeBatch(db); pl.docs.forEach(x => b.delete(x.ref)); b.delete(doc(db, 'backups', o.id)); await b.commit(); }
      toast(`สำรองแล้ว ${ps.length} คน`); tabBackup();
    } catch (er) { busy(e.target, false, 'สำรองตอนนี้'); toast(thaiError(er)); }
  };
  const rl = $('#rLoad'); if (rl) rl.onclick = async () => {
    const d = $('#rDay').value, L = $('#rList'); L.innerHTML = '<p class="note">กำลังโหลด…</p>';
    const pl = (await getDocs(collection(db, 'backups', d, 'players'))).docs;
    L.innerHTML = pl.map(x => `<div class="row"><b style="flex:1">${esc(x.data().name)}</b><span class="note">✨${fmt(x.data().kusal)}</span><button class="btn sm pink" data-r="${x.id}">กู้คืน</button></div>`).join('') || '<p class="note">ไม่มีข้อมูล</p>';
    L.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
      const src = pl.find(x => x.id === b.dataset.r).data();
      modal(`<h2>กู้คืน ${esc(src.name)}?</h2><p>เซฟปัจจุบันของคนนี้จะถูกแทนด้วยเซฟวันที่ ${d}</p>`, [{ t: 'ยกเลิก', c: 'gray' }, {
        t: 'กู้คืน', c: 'pink', f: async () => {
          try { const kick = 'restored-' + Date.now(); await setDoc(doc(db, 'players', b.dataset.r), { ...src, session: kick, by: kick }); await setDoc(doc(collection(db, 'adminLog')), { at: serverTimestamp(), type: 'restore', who: src.name, day: d }); toast('กู้คืนแล้ว'); }
          catch (e) { toast(thaiError(e)); }
        }
      }]);
    });
  };
}
async function tabSettings() {
  await loadSettings();
  $('#aBody').innerHTML = `<div class="box"><h3>⚙️ เปิด/ปิดเกม</h3><p>ตอนนี้: ${S.settings.open ? '<span class="ok">🟢 เปิดให้ผู้เล่นเข้า</span>' : '<span class="warn">🔴 ปิด (เข้าได้เฉพาะแอดมิน)</span>'}</p>
    <button class="btn ${S.settings.open ? 'pink' : ''}" id="tOpen">${S.settings.open ? 'ปิดเกม' : 'เปิดเกมให้ทุกคน'}</button><p class="note">ตอนปิด ผู้เล่นเข้าระบบได้แต่เห็นหน้า "สวนกำลังจะเปิด"</p></div>
    <div class="box"><h3>ℹ️ ข้อมูลเครื่องนี้</h3><p class="note">รหัสบัญชีของคุณ (ใช้ตั้งสิทธิ์แอดมิน): <b>${S.user.uid}</b><br>ขนาดเซฟของคุณ: ${(sizeOf(S.P) / 1024).toFixed(1)}KB</p></div>`;
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
    else { S.user = null; S.P = null; S.admin = false; clearInterval(S.timer); renderLogin(); }
    first = false;
  });
})();
