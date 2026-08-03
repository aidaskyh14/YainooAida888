
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
  chili:   { name:"พริกผีเปรต", icon:"🌶️", growMs:20000 },
  pumpkin: { name:"ฟักทองกองกอย", icon:"🎃", growMs:30000 },
  cabbage: { name:"ผักกาดบ้านนอก", icon:"🥬", growMs:25000 },
  mango:   { name:"มะม่วงหน้าเน่า", icon:"🥭", growMs:35000 },
  lychee:  { name:"ลิ้นจี่ หลีหอม", icon:"🍒", growMs:40000 },
  morning: { name:"ผักบุ้ง สะดุ้งเก่ง", icon:"🌿", growMs:22000 }
};

const RECIPES = [
  { id:"ghost_stir", name:"ผัดพริกผีเปรต", icon:"🍛", need:{chili:3,morning:2} },
  { id:"pumpkin_curry", name:"แกงฟักทองกองกอย", icon:"🥘", need:{pumpkin:3,cabbage:2} },
  { id:"rotten_mango", name:"ยำมะม่วงหน้าเน่า", icon:"🥗", need:{mango:3,chili:2,lychee:1} },
  { id:"pret_hotpot", name:"หม้อไฟเปรตเปรต", icon:"🍲", need:{chili:2,pumpkin:2,cabbage:2,mango:2,lychee:2,morning:2} }
];

let currentMember = null;
let state = null;
let ticker = null;

const $ = (id) => document.getElementById(id);
const loginScreen = $("loginScreen");
const gameScreen = $("gameScreen");
const modal = $("modal");
const modalContent = $("modalContent");

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  values.push(current.trim());
  return values;
}

async function loadMembers() {
  try {
    const response = await fetch("member-codes.csv", { cache: "no-store" });
    if (!response.ok) throw new Error("โหลดรายชื่อไม่สำเร็จ");
    const text = (await response.text()).replace(/^\uFEFF/, "");
    const lines = text.split(/\r?\n/).filter(Boolean);
    const loaded = {};
    for (let i = 1; i < lines.length; i++) {
      const [name, code] = parseCsvLine(lines[i]);
      if (name && code) loaded[name] = code;
    }
    if (Object.keys(loaded).length) MEMBERS = loaded;
  } catch (error) {
    console.warn("ใช้รายชื่อสำรองใน game.js:", error);
  }
  initMembers();
}

function storageKey(member) { return "yainooFarm:" + member; }

function freshState(member, player) {
  return {
    member,
    player,
    plots: Array.from({length:9}, () => ({crop:null, plantedAt:null})),
    inventory: Object.fromEntries(Object.keys(CROPS).map(k => [k, 0])),
    dishes: [],
    updatedAt: Date.now()
  };
}

function save() {
  if (!state || !currentMember) return;
  state.updatedAt = Date.now();
  localStorage.setItem(storageKey(currentMember), JSON.stringify(state));
}

function load(member, player) {
  const raw = localStorage.getItem(storageKey(member));
  if (!raw) return freshState(member, player);
  try {
    const data = JSON.parse(raw);
    data.player = player || data.player;
    return data;
  } catch {
    return freshState(member, player);
  }
}

function initMembers() {
  const select = $("memberSelect");
  select.innerHTML = "";
  Object.keys(MEMBERS).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

function startGame() {
  const member = $("memberSelect").value;
  const code = $("memberCode").value.trim();
  const player = $("playerName").value.trim();

  if (MEMBERS[member] !== code) {
    $("loginError").textContent = "ชื่อสมาชิกหรือรหัสสมาชิกไม่ถูกต้อง";
    return;
  }
  if (!player) {
    $("loginError").textContent = "กรุณาตั้งชื่อผู้เล่นในเกม";
    return;
  }

  currentMember = member;
  state = load(member, player);
  save();

  $("displayPlayer").textContent = state.player;
  $("displayMember").textContent = state.member;
  $("gardenOwner").textContent = state.player;

  loginScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  renderPlots();

  if (ticker) clearInterval(ticker);
  ticker = setInterval(renderPlots, 1000);
}

function logout() {
  if (ticker) clearInterval(ticker);
  save();
  gameScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  $("memberCode").value = "";
}

function cropStage(plot) {
  if (!plot.crop) return "empty";
  const elapsed = Date.now() - plot.plantedAt;
  const total = CROPS[plot.crop].growMs;
  if (elapsed >= total) return "ready";
  if (elapsed >= total * 0.66) return "growing";
  if (elapsed >= total * 0.33) return "sprout";
  return "seed";
}

function stageIcon(plot) {
  const stage = cropStage(plot);
  if (stage === "empty") return "➕";
  if (stage === "seed") return "🫘";
  if (stage === "sprout") return "🌱";
  if (stage === "growing") return "🌿";
  return CROPS[plot.crop].icon;
}

function remaining(plot) {
  const ms = Math.max(0, CROPS[plot.crop].growMs - (Date.now() - plot.plantedAt));
  return Math.ceil(ms / 1000);
}

function renderPlots() {
  if (!state) return;
  const box = $("plots");
  box.innerHTML = "";

  state.plots.forEach((plot, i) => {
    const stage = cropStage(plot);
    const btn = document.createElement("button");
    btn.className = "plot" + (stage === "ready" ? " ready" : "");

    let label = "แปลงว่าง";
    let timerText = "";
    if (plot.crop) {
      label = CROPS[plot.crop].name;
      timerText = stage === "ready" ? "พร้อมเก็บ!" : `เหลือ ${remaining(plot)} วินาที`;
    }

    btn.innerHTML = `
      <span class="plot-no">#${i + 1}</span>
      <div class="plot-content">
        <div class="crop-icon">${stageIcon(plot)}</div>
        <div class="crop-name">${label}</div>
        ${timerText ? `<div class="timer">${timerText}</div>` : ""}
      </div>`;

    btn.addEventListener("click", () => handlePlot(i));
    box.appendChild(btn);
  });
}

function handlePlot(i) {
  const plot = state.plots[i];
  const stage = cropStage(plot);

  if (stage === "empty") {
    openPlantModal(i);
    return;
  }

  if (stage === "ready") {
    state.inventory[plot.crop] = (state.inventory[plot.crop] || 0) + 1;
    const cropName = CROPS[plot.crop].name;
    state.plots[i] = {crop:null, plantedAt:null};
    save();
    renderPlots();
    openMessage("เก็บเกี่ยวสำเร็จ", `ได้ ${cropName} ×1 เข้ากระเป๋าแล้ว`);
    return;
  }

  openMessage("ยังไม่โตเต็มที่", `${CROPS[plot.crop].name} เหลืออีกประมาณ ${remaining(plot)} วินาที`);
}

function openPlantModal(index) {
  modalContent.innerHTML = `
    <h2>เลือกเมล็ดสำหรับแปลง #${index + 1}</h2>
    <div class="crop-grid">
      ${Object.entries(CROPS).map(([key, crop]) => `
        <div class="choice">
          <div class="big">${crop.icon}</div>
          <strong>${crop.name}</strong>
          <p class="note">โตใน ${crop.growMs / 1000} วินาที</p>
          <button data-crop="${key}">ปลูก</button>
        </div>`).join("")}
    </div>`;

  modalContent.querySelectorAll("[data-crop]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.plots[index] = {crop:btn.dataset.crop, plantedAt:Date.now()};
      save();
      closeModal();
      renderPlots();
    });
  });

  openModal();
}

function openInventory() {
  modalContent.innerHTML = `
    <h2>🎒 กระเป๋าวัตถุดิบ</h2>
    <div class="inventory-list">
      ${Object.entries(CROPS).map(([key, crop]) => `
        <div class="inventory-row">
          <span>${crop.icon} ${crop.name}</span>
          <strong>×${state.inventory[key] || 0}</strong>
        </div>`).join("")}
    </div>
    <h3>อาหารที่คราฟแล้ว</h3>
    <div class="inventory-list">
      ${state.dishes.length
        ? state.dishes.map(d => `<div class="inventory-row"><span>${d.icon} ${d.name}</span><strong>✓</strong></div>`).join("")
        : "<p>ยังไม่มีอาหาร</p>"}
    </div>`;
  openModal();
}

function canCraft(recipe) {
  return Object.entries(recipe.need).every(([key, amount]) => (state.inventory[key] || 0) >= amount);
}

function openKitchen() {
  modalContent.innerHTML = `
    <h2>🍲 ครัวเปรตเปรต</h2>
    <div class="recipe-grid">
      ${RECIPES.map((recipe) => {
        const need = Object.entries(recipe.need)
          .map(([key, amount]) => `${CROPS[key].icon}${amount}`)
          .join(" ");
        const available = canCraft(recipe);
        return `
          <div class="recipe">
            <div class="big">${recipe.icon}</div>
            <strong>${recipe.name}</strong>
            <p>${need}</p>
            <button data-recipe="${recipe.id}" ${available ? "" : "disabled"}>
              ${available ? "คราฟอาหาร" : "วัตถุดิบไม่ครบ"}
            </button>
          </div>`;
      }).join("")}
    </div>`;

  modalContent.querySelectorAll("[data-recipe]").forEach((btn) => {
    btn.addEventListener("click", () => craft(btn.dataset.recipe));
  });

  openModal();
}

function craft(id) {
  const recipe = RECIPES.find(r => r.id === id);
  if (!recipe || !canCraft(recipe)) return;

  Object.entries(recipe.need).forEach(([key, amount]) => {
    state.inventory[key] -= amount;
  });

  const result = {
    ...recipe,
    craftedAt: new Date().toLocaleString("th-TH"),
    code: "PRET-" + Math.random().toString(36).slice(2, 7).toUpperCase()
  };

  state.dishes.push(result);
  save();

  modalContent.innerHTML = `
    <div class="result-card">
      <div class="badge">คราฟสำเร็จ!</div>
      <div class="dish">${recipe.icon}</div>
      <h2>${recipe.name}</h2>
      <p><strong>ชื่อสมาชิก:</strong> ${state.member}</p>
      <p><strong>ชื่อผู้เล่น:</strong> ${state.player}</p>
      <p><strong>เวลา:</strong> ${result.craftedAt}</p>
      <p><strong>รหัสผลงาน:</strong> ${result.code}</p>
      <p class="note">แคปหน้าจอนี้แล้วส่งเข้ากิจกรรม</p>
    </div>`;
}

function openMessage(title, text) {
  modalContent.innerHTML = `<h2>${title}</h2><p>${text}</p>`;
  openModal();
}

function openModal() { modal.classList.remove("hidden"); }
function closeModal() { modal.classList.add("hidden"); }

$("startBtn").addEventListener("click", startGame);
$("logoutBtn").addEventListener("click", logout);
$("inventoryBtn").addEventListener("click", openInventory);
$("kitchenBtn").addEventListener("click", openKitchen);
$("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

loadMembers();
