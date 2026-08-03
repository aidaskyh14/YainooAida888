
const MEMBERS = {
  "Kung Anamnart": "KUNG0828",
  "Beer": "BEER0925",
  "Mameaw": "MAME1022",
  "Para": "PARA1119",
  "Pukkie Freedomgirlz": "PUKK1216",
  "Porpla": "PORP1313",
  "Tangtang": "TANG1410",
  "Mhai Maneetanawat": "MHAI1507",
  "Sa": "SA1604",
  "Earn Piliwan": "EARN1701",
  "Aimme": "AIMM1798",
  "ม่าม๊า กิ๊กกี๋": "มามา1895",
  "ของขวัญ’บิวตี้ช้อป": "ของข1992",
  "ศรัณยา หนูนา": "ศรณย2089",
  "Yo Hana": "YOHA2186",
  "Phon": "PHON2283",
  "Opor": "OPOR2380",
  "น้องไอด้าเซ็กซี่": "YAINOO88"
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

const $=id=>document.getElementById(id);
let memberName=null,state=null,timer=null;

function key(){return "yainoo-complete:"+memberName}
function fresh(nick){return {nick,plots:Array.from({length:9},()=>({crop:null,at:null})),bag:Object.fromEntries(Object.keys(CROPS).map(k=>[k,0])),dishes:[]}}
function save(){localStorage.setItem(key(),JSON.stringify(state))}
function load(nick){try{const x=JSON.parse(localStorage.getItem(key()));if(x){x.nick=nick||x.nick;return x}}catch(e){}return fresh(nick)}

function init(){
 $("member").innerHTML=Object.keys(MEMBERS).map(n=>`<option>${n}</option>`).join("");
}
function login(){
 const n=$("member").value,c=$("code").value.trim(),nick=$("nickname").value.trim();
 if(MEMBERS[n]!==c){$("login-msg").textContent="ชื่อสมาชิกหรือรหัสไม่ถูกต้อง";return}
 if(!nick){$("login-msg").textContent="กรุณาตั้งชื่อผู้เล่นในเกม";return}
 memberName=n;state=load(nick);save();
 $("nickView").textContent=state.nick;$("memberView").textContent=memberName;$("owner").textContent=state.nick;
 $("login").classList.add("hidden");$("game").classList.remove("hidden");
 draw();timer=setInterval(draw,1000);
}
function logout(){
 clearInterval(timer);save();$("game").classList.add("hidden");$("login").classList.remove("hidden");$("code").value="";
}
function stage(p){
 if(!p.crop)return "empty";
 const e=Date.now()-p.at,t=CROPS[p.crop].ms;
 if(e>=t)return "ready";if(e>=t*.66)return "grown";if(e>=t*.33)return "sprout";return "seed";
}
function icon(p){
 const s=stage(p);if(s==="empty")return "➕";if(s==="seed")return "🫘";if(s==="sprout")return "🌱";if(s==="grown")return "🌿";return CROPS[p.crop].icon;
}
function left(p){return Math.max(0,Math.ceil((CROPS[p.crop].ms-(Date.now()-p.at))/1000))}
function draw(){
 $("plots").innerHTML="";
 state.plots.forEach((p,i)=>{
   const s=stage(p),b=document.createElement("button");b.className="plot"+(s==="ready"?" ready":"");
   const name=p.crop?CROPS[p.crop].name:"แปลงว่าง";
   const t=p.crop?(s==="ready"?"พร้อมเก็บ!":`เหลือ ${left(p)} วินาที`):"";
   b.innerHTML=`<span class="plot-no">#${i+1}</span><div class="plot-inner"><div class="crop">${icon(p)}</div><div class="crop-name">${name}</div>${t?`<div class="timer">${t}</div>`:""}</div>`;
   b.onclick=()=>tapPlot(i);$("plots").appendChild(b);
 });
}
function tapPlot(i){
 const p=state.plots[i],s=stage(p);
 if(s==="empty")return plantMenu(i);
 if(s==="ready"){
   state.bag[p.crop]=(state.bag[p.crop]||0)+1;
   const n=CROPS[p.crop].name;state.plots[i]={crop:null,at:null};save();draw();message("เก็บเกี่ยวสำเร็จ",`ได้ ${n} ×1`);
 }else message("ยังไม่พร้อมเก็บ",`${CROPS[p.crop].name} เหลืออีกประมาณ ${left(p)} วินาที`);
}
function plantMenu(i){
 $("modalBody").innerHTML=`<h2>เลือกเมล็ดสำหรับแปลง #${i+1}</h2><div class="crop-grid">${Object.entries(CROPS).map(([k,c])=>`<div class="tile"><div class="icon">${c.icon}</div><b>${c.name}</b><p class="small-note">${c.ms/1000} วินาที</p><button data-k="${k}">ปลูก</button></div>`).join("")}</div>`;
 document.querySelectorAll("[data-k]").forEach(x=>x.onclick=()=>{state.plots[i]={crop:x.dataset.k,at:Date.now()};save();close();draw()});
 open();
}
function bag(){
 $("modalBody").innerHTML=`<h2>🎒 กระเป๋าวัตถุดิบ</h2><div class="list">${Object.entries(CROPS).map(([k,c])=>`<div class="row"><span>${c.icon} ${c.name}</span><b>×${state.bag[k]||0}</b></div>`).join("")}</div>`;
 open();
}
function can(r){return Object.entries(r.need).every(([k,n])=>(state.bag[k]||0)>=n)}
function kitchen(){
 $("modalBody").innerHTML=`<h2>🍲 ครัวเปรตเปรต</h2><div class="recipe-grid">${RECIPES.map(r=>`<div class="tile"><div class="icon">${r.icon}</div><b>${r.name}</b><p>${Object.entries(r.need).map(([k,n])=>CROPS[k].icon+n).join(" ")}</p><button data-r="${r.id}" ${can(r)?"":"disabled"}>${can(r)?"คราฟอาหาร":"วัตถุดิบไม่ครบ"}</button></div>`).join("")}</div>`;
 document.querySelectorAll("[data-r]").forEach(x=>x.onclick=()=>craft(x.dataset.r));open();
}
function craft(id){
 const r=RECIPES.find(x=>x.id===id);if(!r||!can(r))return;
 Object.entries(r.need).forEach(([k,n])=>state.bag[k]-=n);
 const done={id:r.id,name:r.name,icon:r.icon,time:new Date().toLocaleString("th-TH"),code:"PRET-"+Math.random().toString(36).slice(2,7).toUpperCase()};
 state.dishes.push(done);save();
 $("modalBody").innerHTML=`<div class="success"><span class="badge">คราฟสำเร็จ!</span><div class="dish">${r.icon}</div><h2>${r.name}</h2><p><b>สมาชิก:</b> ${memberName}</p><p><b>ชื่อในเกม:</b> ${state.nick}</p><p><b>เวลา:</b> ${done.time}</p><p><b>รหัสผลงาน:</b> ${done.code}</p><p class="small-note">แคปหน้าจอนี้แล้วส่งเข้ากิจกรรม</p></div>`;
}
function book(){
 $("modalBody").innerHTML=`<h2>📖 สมุดเมนู</h2><div class="list">${RECIPES.map(r=>{const d=state.dishes.some(x=>x.id===r.id);return `<div class="row"><span>${d?r.icon:"❔"} ${d?r.name:"เมนูยังไม่ปลดล็อก"}</span><b>${d?"สำเร็จ ✓":"ยังไม่สำเร็จ"}</b></div>`}).join("")}</div>`;
 open();
}
function how(){
 $("modalBody").innerHTML=`<h2>วิธีเล่น</h2><p>1. เลือกชื่อสมาชิก ใส่รหัส และตั้งชื่อในเกม</p><p>2. แตะแปลงว่างเพื่อเลือกผัก</p><p>3. รอให้โตแล้วแตะเก็บเกี่ยว</p><p>4. เปิดครัวและคราฟเมนูเมื่อของครบ</p><p>5. แคปหน้าคราฟสำเร็จส่งรับรางวัล</p>`;
 open();
}
function message(a,b){$("modalBody").innerHTML=`<h2>${a}</h2><p>${b}</p>`;open()}
function open(){$("modal").classList.remove("hidden")}
function close(){$("modal").classList.add("hidden")}

$("play").onclick=login;$("exitBtn").onclick=logout;$("bagBtn").onclick=bag;$("cookBtn").onclick=kitchen;$("bookBtn").onclick=book;$("howLogin").onclick=how;$("close").onclick=close;
$("modal").onclick=e=>{if(e.target===$("modal"))close()};
init();
