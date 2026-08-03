
let MEMBERS = {
  "Kung A": "KUNG2481",
  "Ar Jane": "JANE7314",
  "Blotto Bier": "BIER4826",
  "Mameaw": "MEAW5937",
  "Para": "PARA1642",
  "Porpla": "PORP8753",
  "Pukkie": "PUKK3491",
  "Opor": "OPOR6284",
  "Tangtang": "TANG9165",
  "Sa": "SA4728",
  "Earn": "EARN5831",
  "Mhai": "MHAI7046",
  "Gigs Gee": "GIGS2619",
  "Aimme": "AIMM8357",
  "Phon": "PHON1948",
  "Hana": "HANA5273",
  "Kongkwan": "KONG6482",
  "Noona": "NOON3196",
  "Aida": "YAINOO88"
};

const CROPS = {
  chili:{name:"พริกผีเปรต",icon:"🌶️",ms:20000},
  pumpkin:{name:"ฟักทองกองกอย",icon:"🎃",ms:30000},
  cabbage:{name:"ผักกาดบ้านนอก",icon:"🥬",ms:25000},
  mango:{name:"มะม่วงหน้าเน่า",icon:"🥭",ms:35000},
  lychee:{name:"ลิ้นจี่ หลีหอม",icon:"🍒",ms:40000},
  morning:{name:"ผักบุ้ง สะดุ้งเก่ง",icon:"🌿",ms:22000}
};

const RECIPES = [
  {id:"r1",name:"ผัดพริกผีเปรต",icon:"🍛",need:{chili:3,morning:2}},
  {id:"r2",name:"แกงฟักทองกองกอย",icon:"🥘",need:{pumpkin:3,cabbage:2}},
  {id:"r3",name:"ยำมะม่วงหน้าเน่า",icon:"🥗",need:{mango:3,chili:2,lychee:1}},
  {id:"r4",name:"หม้อไฟเปรตเปรต",icon:"🍲",need:{chili:2,pumpkin:2,cabbage:2,mango:2,lychee:2,morning:2}}
];

const $ = id => document.getElementById(id);
let memberName = null, state = null, timer = null;

function parseCSVLine(line) {
  const result = [];
  let cell = "", quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) {
      result.push(cell.trim()); cell = "";
    } else cell += ch;
  }
  result.push(cell.trim());
  return result;
}

async function loadMemberList() {
  try {
    const response = await fetch("member-codes.csv?v=3", {cache:"no-store"});
    if (!response.ok) throw new Error("CSV load failed");
    const text = (await response.text()).replace(/^\uFEFF/, "");
    const rows = text.split(/\r?\n/).filter(Boolean).slice(1);
    const loaded = {};
    rows.forEach(row => {
      const [name, code] = parseCSVLine(row);
      if (name && code) loaded[name] = code;
    });
    if (Object.keys(loaded).length) MEMBERS = loaded;
  } catch (error) {
    console.warn("Using fallback member list", error);
  }
  init();
}

function key() { return "yainoo-complete:" + memberName; }
function fresh(nick) {
  return {
    nick,
    plots:Array.from({length:9},()=>({crop:null,at:null})),
    bag:Object.fromEntries(Object.keys(CROPS).map(k=>[k,0])),
    dishes:[]
  };
}
function save() { if (state && memberName) localStorage.setItem(key(), JSON.stringify(state)); }
function load(nick) {
  try {
    const saved = JSON.parse(localStorage.getItem(key()));
    if (saved) { saved.nick = nick || saved.nick; return saved; }
  } catch (_) {}
  return fresh(nick);
}

function init() {
  $("member").innerHTML = Object.keys(MEMBERS)
    .map(name => `<option value="${name}">${name}</option>`)
    .join("");
}

function login() {
  const name = $("member").value;
  const code = $("code").value.trim();
  const nick = $("nickname").value.trim();

  if (MEMBERS[name] !== code) {
    $("login-msg").textContent = "ชื่อสมาชิกหรือรหัสไม่ถูกต้อง";
    return;
  }
  if (!nick) {
    $("login-msg").textContent = "กรุณาตั้งชื่อผู้เล่นในเกม";
    return;
  }

  memberName = name;
  state = load(nick);
  save();

  $("nickView").textContent = state.nick;
  $("memberView").textContent = memberName;
  $("owner").textContent = state.nick;
  $("login").classList.add("hidden");
  $("game").classList.remove("hidden");
  draw();

  if (timer) clearInterval(timer);
  timer = setInterval(draw, 1000);
}

function logout() {
  if (timer) clearInterval(timer);
  save();
  $("game").classList.add("hidden");
  $("login").classList.remove("hidden");
  $("code").value = "";
}

function stage(plot) {
  if (!plot.crop) return "empty";
  const elapsed = Date.now() - plot.at;
  const total = CROPS[plot.crop].ms;
  if (elapsed >= total) return "ready";
  if (elapsed >= total * .66) return "grown";
  if (elapsed >= total * .33) return "sprout";
  return "seed";
}
function icon(plot) {
  const s = stage(plot);
  if (s === "empty") return "➕";
  if (s === "seed") return "🫘";
  if (s === "sprout") return "🌱";
  if (s === "grown") return "🌿";
  return CROPS[plot.crop].icon;
}
function left(plot) {
  return Math.max(0, Math.ceil((CROPS[plot.crop].ms - (Date.now() - plot.at)) / 1000));
}

function draw() {
  if (!state) return;
  $("plots").innerHTML = "";
  state.plots.forEach((plot, i) => {
    const s = stage(plot);
    const button = document.createElement("button");
    button.className = "plot" + (s === "ready" ? " ready" : "");
    const name = plot.crop ? CROPS[plot.crop].name : "แปลงว่าง";
    const timeText = plot.crop ? (s === "ready" ? "พร้อมเก็บ!" : `เหลือ ${left(plot)} วินาที`) : "";
    button.innerHTML = `<span class="plot-no">#${i+1}</span>
      <div class="plot-inner">
        <div class="crop">${icon(plot)}</div>
        <div class="crop-name">${name}</div>
        ${timeText ? `<div class="timer">${timeText}</div>` : ""}
      </div>`;
    button.onclick = () => tapPlot(i);
    $("plots").appendChild(button);
  });
}

function tapPlot(i) {
  const plot = state.plots[i];
  const s = stage(plot);
  if (s === "empty") return plantMenu(i);
  if (s === "ready") {
    state.bag[plot.crop] = (state.bag[plot.crop] || 0) + 1;
    const cropName = CROPS[plot.crop].name;
    state.plots[i] = {crop:null,at:null};
    save(); draw();
    message("เก็บเกี่ยวสำเร็จ", `ได้ ${cropName} ×1`);
  } else {
    message("ยังไม่พร้อมเก็บ", `${CROPS[plot.crop].name} เหลืออีกประมาณ ${left(plot)} วินาที`);
  }
}

function plantMenu(i) {
  $("modalBody").innerHTML = `<h2>เลือกเมล็ดสำหรับแปลง #${i+1}</h2>
    <div class="crop-grid">
      ${Object.entries(CROPS).map(([k,c]) => `<div class="tile">
        <div class="icon">${c.icon}</div><b>${c.name}</b>
        <p class="small-note">${c.ms/1000} วินาที</p>
        <button data-k="${k}">ปลูก</button></div>`).join("")}
    </div>`;
  document.querySelectorAll("[data-k]").forEach(btn => btn.onclick = () => {
    state.plots[i] = {crop:btn.dataset.k, at:Date.now()};
    save(); close(); draw();
  });
  open();
}

function bag() {
  $("modalBody").innerHTML = `<h2>🎒 กระเป๋าวัตถุดิบ</h2><div class="list">
    ${Object.entries(CROPS).map(([k,c]) => `<div class="row"><span>${c.icon} ${c.name}</span><b>×${state.bag[k]||0}</b></div>`).join("")}
  </div>`;
  open();
}

function can(recipe) {
  return Object.entries(recipe.need).every(([k,n]) => (state.bag[k]||0) >= n);
}

function kitchen() {
  $("modalBody").innerHTML = `<h2>🍲 ครัวเปรตเปรต</h2><div class="recipe-grid">
    ${RECIPES.map(r => `<div class="tile"><div class="icon">${r.icon}</div><b>${r.name}</b>
      <p>${Object.entries(r.need).map(([k,n]) => CROPS[k].icon+n).join(" ")}</p>
      <button data-r="${r.id}" ${can(r) ? "" : "disabled"}>${can(r) ? "คราฟอาหาร" : "วัตถุดิบไม่ครบ"}</button>
    </div>`).join("")}
  </div>`;
  document.querySelectorAll("[data-r]").forEach(btn => btn.onclick = () => craft(btn.dataset.r));
  open();
}

function craft(id) {
  const recipe = RECIPES.find(r => r.id === id);
  if (!recipe || !can(recipe)) return;
  Object.entries(recipe.need).forEach(([k,n]) => state.bag[k] -= n);
  const done = {
    id:recipe.id, name:recipe.name, icon:recipe.icon,
    time:new Date().toLocaleString("th-TH"),
    code:"PRET-"+Math.random().toString(36).slice(2,7).toUpperCase()
  };
  state.dishes.push(done);
  save();
  $("modalBody").innerHTML = `<div class="success"><span class="badge">คราฟสำเร็จ!</span>
    <div class="dish">${recipe.icon}</div><h2>${recipe.name}</h2>
    <p><b>สมาชิก:</b> ${memberName}</p><p><b>ชื่อในเกม:</b> ${state.nick}</p>
    <p><b>เวลา:</b> ${done.time}</p><p><b>รหัสผลงาน:</b> ${done.code}</p>
    <p class="small-note">แคปหน้าจอนี้แล้วส่งเข้ากิจกรรม</p></div>`;
}

function book() {
  $("modalBody").innerHTML = `<h2>📖 สมุดเมนู</h2><div class="list">
    ${RECIPES.map(r => {
      const done = state.dishes.some(x => x.id === r.id);
      return `<div class="row"><span>${done ? r.icon : "❔"} ${done ? r.name : "เมนูยังไม่ปลดล็อก"}</span><b>${done ? "สำเร็จ ✓" : "ยังไม่สำเร็จ"}</b></div>`;
    }).join("")}
  </div>`;
  open();
}

function how() {
  $("modalBody").innerHTML = `<h2>วิธีเล่น</h2>
    <p>1. เลือกชื่อสมาชิก ใส่รหัส และตั้งชื่อในเกม</p>
    <p>2. แตะแปลงว่างเพื่อเลือกผัก</p>
    <p>3. รอให้โตแล้วแตะเก็บเกี่ยว</p>
    <p>4. เปิดครัวและคราฟเมนูเมื่อวัตถุดิบครบ</p>
    <p>5. แคปหน้าคราฟสำเร็จส่งรับรางวัล</p>`;
  open();
}

function message(title, text) {
  $("modalBody").innerHTML = `<h2>${title}</h2><p>${text}</p>`;
  open();
}
function open() { $("modal").classList.remove("hidden"); }
function close() { $("modal").classList.add("hidden"); }

$("play").onclick = login;
$("exitBtn").onclick = logout;
$("bagBtn").onclick = bag;
$("cookBtn").onclick = kitchen;
$("bookBtn").onclick = book;
$("howLogin").onclick = how;
$("close").onclick = close;
$("modal").onclick = e => { if (e.target === $("modal")) close(); };

loadMemberList();
