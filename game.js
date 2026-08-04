
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
chili:{name:"พริกผีเปรต",icon:"🌶️",ms:60000,seedImg:"pret-chili-seed.png",sproutImg:"pret-chili-sprout.png",growImg:"pret-chili-grow.png",readyImg:"pret-chili-ready.png"},
pumpkin:{
  name:"ฟักทองกองกอย",
  icon:"🎃",
  ms:30000,
  seedImg:"ghost-pumpkin-seed.png?v=1",
  sproutImg:"ghost-pumpkin-sprout.png?v=1",
  growImg:"ghost-pumpkin-grow.png?v=1",
  readyImg:"ghost-pumpkin-ready.png?v=1"
},
cabbage:{
  name:"ผักกาดบ้านนอก",
  icon:"🥬",
  ms:25000,
  seedImg:"cabbage-seed.png?v=1",
  sproutImg:"cabbage-sprout.png?v=1",
  growImg:"cabbage-grow.png?v=1",
  readyImg:"cabbage-ready.png?v=1"
},
mango:{
  name:"มะม่วงหน้าเน่า",
  icon:"🥭",
  ms:35000,
  seedImg:"mango-seed.png?v=2",
  sproutImg:"mango-sprout.png?v=2",
  growImg:"mango-grow.png?v=2",
  readyImg:"mango-ready.png?v=2"
},
  lychee:{name:"ลิ้นจี่ หลีหอม",icon:"🍒",ms:40000},
  morning:{name:"ผักบุ้ง สะดุ้งเก่ง",icon:"🌿",ms:22000}
};
const STATUS_ICON = {
water: "status-water.png?v=2",
worm: "status-worm.png?v=2",
dead: "status-dead.png?v=2"
};

const RECIPES = [
  {id:"r1",name:"ผัดพริกผีเปรต",icon:"🍛",need:{chili:3,morning:2}},
  {id:"r2",name:"แกงฟักทองกองกอย",icon:"🥘",need:{pumpkin:3,cabbage:2}},
  {id:"r3",name:"ยำมะม่วงหน้าเน่า",icon:"🥗",need:{mango:3,chili:2,lychee:1}},
  {id:"r4",name:"หม้อไฟเปรตเปรต",icon:"🍲",need:{chili:2,pumpkin:2,cabbage:2,mango:2,lychee:2,morning:2}}
];

const $=id=>document.getElementById(id);
let currentMember=null,state=null,ticker=null;

function parseLine(line){
  const cells=[];let cell="",quoted=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){
      if(quoted&&line[i+1]==='"'){cell+='"';i++;} else quoted=!quoted;
    } else if(ch===","&&!quoted){cells.push(cell.trim());cell="";}
    else cell+=ch;
  }
  cells.push(cell.trim());return cells;
}
async function loadMembers(){
  try{
    const r=await fetch("member-codes.csv?v=5",{cache:"no-store"});
    if(!r.ok) throw new Error();
    const text=(await r.text()).replace(/^\uFEFF/,"");
    const rows=text.split(/\r?\n/).filter(Boolean).slice(1);
    const loaded={};
    rows.forEach(row=>{const [name,code]=parseLine(row);if(name&&code)loaded[name]=code;});
    if(Object.keys(loaded).length) MEMBERS=loaded;
  }catch(e){console.warn("ใช้รายชื่อสำรอง");}
  const select=$("memberSelect");
  select.innerHTML=Object.keys(MEMBERS).map(n=>`<option value="${n}">${n}</option>`).join("");
}

function key(){return "yainoo-v5:"+currentMember}
function fresh(player){return{player,plots:Array.from({length:9},()=>({crop:null,at:null})),bag:Object.fromEntries(Object.keys(CROPS).map(k=>[k,0])),dishes:[]}}
function save(){if(state&&currentMember)localStorage.setItem(key(),JSON.stringify(state))}
function load(player){try{const s=JSON.parse(localStorage.getItem(key()));if(s){s.player=player||s.player;return s;}}catch(e){}return fresh(player)}

function start(){
  const member=$("memberSelect").value;
  const code=$("memberCode").value.trim();
  const player=$("playerName").value.trim();
  if(MEMBERS[member]!==code){$("loginError").textContent="ชื่อสมาชิกหรือรหัสไม่ถูกต้อง";return;}
  if(!player){$("loginError").textContent="กรุณาตั้งชื่อผู้เล่นในเกม";return;}
  currentMember=member;state=load(player);save();
  $("displayPlayer").textContent=state.player;
  $("displayMember").textContent=currentMember;
  $("gardenOwner").textContent=state.player;
  $("loginScreen").classList.add("hidden");
  $("gameScreen").classList.remove("hidden");
  draw();ticker=setInterval(draw,1000);
}
function logout(){
  if(ticker)clearInterval(ticker);save();
  $("gameScreen").classList.add("hidden");
  $("loginScreen").classList.remove("hidden");
  $("memberCode").value="";
}

function stage(p){
  if(!p.crop)return"empty";
  const e=Date.now()-p.at,t=CROPS[p.crop].ms;
  if(e>=t)return"ready";if(e>=t*.66)return"grown";if(e>=t*.33)return"sprout";return"seed";
}
function plotStatus(p){
  if(!p.crop) return null;


  const age = Date.now() - p.at;
  const total = CROPS[p.crop].ms;

  if(age >= total) return null;
    if(p.dead) return "dead";

  if(age >= total * 0.20 && age < total * 0.45){
    return "water";
  }

  if(age >= total * 0.45 && age < total * 0.75){
    return "worm";
  }

  if(age >= total * 0.75){
    p.dead = true;
    return "dead";
  }

  return null;
}
function icon(p){
  if(!p.crop) return "+";

  const crop = CROPS[p.crop];

  if(crop.seedImg && crop.sproutImg && crop.growImg && crop.readyImg){
    const age = Date.now() - p.at;
    const total = crop.ms;

    let src = crop.seedImg;
    let cls = "crop-img stage-seed";

    if(age >= total){
      src = crop.readyImg;
      cls = "crop-img stage-ready";
    }else if(age >= total * 0.66){
      src = crop.growImg;
      cls = "crop-img stage-grow";
    }else if(age >= total * 0.33){
      src = crop.sproutImg;
      cls = "crop-img stage-sprout";
    }

const size = cls.includes("stage-ready") ? "86px" : "";

return `<img
  class="${cls}"
  src="${src}"
  alt="${crop.name}"
style="${size ? `width:${size}!important;height:${size}!important;max-width:${size}!important;max-height:${size}!important;transform:translate(-3px,-10px)!important;object-fit:contain!important;` : ""}"
>`;
  }

  return crop.icon || "🌱";
}
function remain(p){return Math.max(0,Math.ceil((CROPS[p.crop].ms-(Date.now()-p.at))/1000))}
function draw(){
  if(!state)return;
  $("plots").innerHTML="";
  state.plots.forEach((p,i)=>{
const s=stage(p),need=plotStatus(p),b=document.createElement("button");
   b.className=`plot ${s}`;
    const name=p.crop?CROPS[p.crop].name:"แปลงว่าง";
const time="";
   b.innerHTML = `
  <span class="plot-no">#${i + 1}</span>
  ${need ? `<img class="status-badge" src="${STATUS_ICON[need]}" alt="${need}">` : ""}
  <div class="plot-inner">
    <div class="crop">${icon(p)}</div>
    <div class="crop-name">${name}</div>
   
  </div>
`;
    b.onclick=()=>tapPlot(i);$("plots").appendChild(b);
  });
}
function tapPlot(i){
  const p=state.plots[i],s=stage(p);
  if(s==="empty")return plantMenu(i);
  if(s==="ready"){
    state.bag[p.crop]=(state.bag[p.crop]||0)+1;
    const n=CROPS[p.crop].name;state.plots[i]={crop:null,at:null};
    save();draw();message("เก็บเกี่ยวสำเร็จ",`ได้ ${n} ×1`);
  } else message("ยังไม่พร้อมเก็บ",`${CROPS[p.crop].name} เหลือประมาณ ${remain(p)} วินาที`);
}
function plantMenu(i){
  $("modalContent").innerHTML=`<h2>เลือกเมล็ดสำหรับแปลง #${i+1}</h2><div class="grid">${Object.entries(CROPS).map(([k,c])=>`<div class="tile"><div class="icon">${c.icon}</div><b>${c.name}</b><p>${c.ms/1000} วินาที</p><button data-crop="${k}">ปลูก</button></div>`).join("")}</div>`;
  document.querySelectorAll("[data-crop]").forEach(btn=>btn.onclick=()=>{state.plots[i]={crop:btn.dataset.crop,at:Date.now()};save();close();draw();});
  open();
}
function inventory(){
  $("modalContent").innerHTML=`<h2>🎒 กระเป๋า</h2><div class="list">${Object.entries(CROPS).map(([k,c])=>`<div class="row"><span>${c.icon} ${c.name}</span><b>×${state.bag[k]||0}</b></div>`).join("")}</div>`;
  open();
}
function can(r){return Object.entries(r.need).every(([k,n])=>(state.bag[k]||0)>=n)}
function kitchen(){
  $("modalContent").innerHTML=`<h2>🍲 ครัวเปรตเปรต</h2><div class="grid">${RECIPES.map(r=>`<div class="tile"><div class="icon">${r.icon}</div><b>${r.name}</b><p>${Object.entries(r.need).map(([k,n])=>CROPS[k].icon+n).join(" ")}</p><button data-recipe="${r.id}" ${can(r)?"":"disabled"}>${can(r)?"คราฟอาหาร":"วัตถุดิบไม่ครบ"}</button></div>`).join("")}</div>`;
  document.querySelectorAll("[data-recipe]").forEach(btn=>btn.onclick=()=>craft(btn.dataset.recipe));
  open();
}
function craft(id){
  const r=RECIPES.find(x=>x.id===id);if(!r||!can(r))return;
  Object.entries(r.need).forEach(([k,n])=>state.bag[k]-=n);
  state.dishes.push({...r,time:new Date().toLocaleString("th-TH")});save();
  $("modalContent").innerHTML=`<h2>คราฟสำเร็จ!</h2><div style="font-size:80px;text-align:center">${r.icon}</div><h3 style="text-align:center">${r.name}</h3><p>สมาชิก: ${currentMember}</p><p>ชื่อในเกม: ${state.player}</p><p>แคปหน้าจอนี้แล้วส่งเข้ากิจกรรม</p>`;
}
function showHow(){
  $("modalContent").innerHTML="<h2>วิธีเล่น</h2><p>เลือกสมาชิก ใส่รหัส ตั้งชื่อในเกม จากนั้นปลูก เก็บเกี่ยว และคราฟอาหารให้ครบ</p>";
  open();
}
function showMenu(){
  $("modalContent").innerHTML=`<h2>สมุดเมนู</h2>${RECIPES.map(r=>`<p>${r.icon} ${r.name}</p>`).join("")}`;open();
}
function showSettings(){message("ตั้งค่า","ระบบตั้งค่าจะเพิ่มในเวอร์ชันถัดไป")}
function showRewards(){message("ของรางวัล","คราฟอาหารสำเร็จแล้วแคปหน้าจอส่งรับรางวัล")}
function message(t,x){$("modalContent").innerHTML=`<h2>${t}</h2><p>${x}</p>`;open()}
function open(){$("modal").classList.remove("hidden")}
function close(){$("modal").classList.add("hidden")}

$("startBtn").onclick=start;
$("howBtn").onclick=showHow;
$("menuBtn").onclick=showMenu;
$("settingsBtn").onclick=showSettings;
$("rewardBtn").onclick=showRewards;
$("inventoryBtn").onclick=inventory;
$("kitchenBtn").onclick=kitchen;
$("logoutBtn").onclick=logout;
$("closeModal").onclick=close;
$("modal").onclick=e=>{if(e.target===$("modal"))close()};

loadMembers();
