let MEMBERS={
  "Kung A":"KUNG2481","Ar Jane":"JANE7314","Blotto Bier":"BIER4826","Mameaw":"MEAW5937",
  "Para":"PARA1642","Porpla":"PORP8753","Pukkie":"PUKK3491","Opor":"OPOR6284",
  "Tangtang":"TANG9165","Sa":"SA4728","Earn":"EARN5831","Mhai":"MHAI7046",
  "Gigs Gee":"GIGS2619","Aimme":"AIMM8357","Phon":"PHON1948","Hana":"HANA5273",
  "Kongkwan":"KONG6482","Noona":"NOON3196","Aida":"YAINOO88"
};

const CROPS={
  chili:{name:"พริกผีเปรต",icon:"🌶️",selectImg:"01_ghost_pepper.png?v=2",ms:60000,seedImg:"pret-chili-seed.png",sproutImg:"pret-chili-sprout.png",growImg:"pret-chili-grow.png",readyImg:"pret-chili-ready.png"},
  pumpkin:{name:"ฟักทองกองกอย",icon:"🎃",selectImg:"02_ghost_pumpkin.png?v=2",ms:30000,seedImg:"ghost-pumpkin-seed.png?v=1",sproutImg:"ghost-pumpkin-sprout.png?v=1",growImg:"ghost-pumpkin-grow.png?v=1",readyImg:"ghost-pumpkin-ready.png?v=1"},
  cabbage:{name:"ผักกาดบ้านนอก",icon:"🥬",selectImg:"04_country_cabbage.png?v=2",ms:25000,seedImg:"cabbage-seed.png?v=1",sproutImg:"cabbage-sprout.png?v=1",growImg:"cabbage-grow.png?v=1",readyImg:"cabbage-ready.png?v=1"},
  mango:{name:"มะม่วงหน้าเน่า",icon:"🥭",selectImg:"03_rotten_mango.png?v=2",ms:35000,seedImg:"mango-seed.png?v=2",sproutImg:"mango-sprout.png?v=2",growImg:"mango-grow.png?v=2",readyImg:"mango-ready.png?v=2"},
  lychee:{name:"ลิ้นจี่ หลีหอม",icon:"🍒",selectImg:"05_fragrant_lychee.png?v=2",ms:40000,seedImg:"lychee-seed.png?v=2",sproutImg:"lychee-sprout.png?v=2",growImg:"lychee-grow.png?v=2",readyImg:"lychee-ready.png?v=2"},
  morning:{name:"ผักบุ้ง สะดุ้งเก่ง",icon:"🌿",selectImg:"06_startled_morning_glory.png?v=2",ms:22000,seedImg:"morning-seed.png?v=2",sproutImg:"morning-sprout.png?v=2",growImg:"morning-grow.png?v=2",readyImg:"morning-ready.png?v=2"},
  strawberry:{name:"สตรอว์เบอร์รีมรกต",icon:"🍓",selectImg:"07_emerald_strawberry.png?v=1",ms:50000,seedImg:"emerald-strawberry-seed.png?v=1",sproutImg:"emerald-strawberry-sprout.png?v=1",growImg:"emerald-strawberry-grow.png?v=1",readyImg:"emerald-strawberry-ready.png?v=1"},
  grape:{name:"องุ่น ครุ่นจิต",icon:"🍇",selectImg:"08_grape_kruenjit.png?v=1",ms:45000,seedImg:"grape-seed.PNG?v=1",sproutImg:"grape-sprout.PNG?v=1",growImg:"grape-grow.PNG?v=1",readyImg:"grape-ready.PNG?v=1"}
};

const STATUS_ICON={water:"status-water.png?v=3",worm:"status-worm.png?v=3",dead:"status-dead.png?v=3"};
const RECIPES=[
  {id:"r1",name:"ผัดพริกผีเปรต",icon:"🍛",need:{chili:3,morning:2}},
  {id:"r2",name:"แกงฟักทองกองกอย",icon:"🥘",need:{pumpkin:3,cabbage:2}},
  {id:"r3",name:"ยำมะม่วงหน้าเน่า",icon:"🥗",need:{mango:3,chili:2,lychee:1}},
  {id:"r4",name:"หม้อไฟเปรตเปรต",icon:"🍲",need:{chili:2,pumpkin:2,cabbage:2,mango:2,lychee:2,morning:2}}
];

const SHOP_ITEMS=[
  {emoji:"🐔",name:"ไก่เปรต"},
  {emoji:"🐟",name:"ปลาสะกดจิต"},
  {emoji:"🐷",name:"หมูผี"},
  {emoji:"🐄",name:"วัววิญญาณ"}
];

const FORECAST_SLOTS=[
  {start:0,end:240,time:"00:00–04:00",emoji:"🌧️",name:"ฝนผี"},
  {start:240,end:360,time:"04:00–06:00",emoji:"🌅",name:"ฟ้าสางนางไม้"},
  {start:360,end:600,time:"06:00–10:00",emoji:"☀️",name:"ฟ้าดีผีหลับ"},
  {start:600,end:720,time:"10:00–12:00",emoji:"🍀",name:"ฤกษ์มงคล"},
  {start:720,end:900,time:"12:00–15:00",emoji:"🌪️",name:"แปรปรวน สรวนจิต"},
  {start:900,end:1080,time:"15:00–18:00",emoji:"👻",name:"ผีตากผ้าอ้อม"},
  {start:1080,end:1200,time:"18:00–20:00",emoji:"🌆",name:"พลบค่ำ รำไทย"},
  {start:1200,end:1260,time:"20:00–21:00",emoji:"🌃",name:"ย่ำค่ำ ผีเดินสวน"},
  {start:1260,end:1440,time:"21:00–00:00",emoji:"🌙",name:"นอนไหม ผีอยากอำ"}
];

const PLOT_COUNT=12;
const RAIN_DURATION_MS=30*1000;
const RAIN_INTERVAL_MS=4*60*60*1000;
const $=id=>document.getElementById(id);

let currentMember=null;
let state=null;
let ticker=null;
let thaiClockTimer=null;
let rainTickTimer=null;
let rainToastTimer=null;
let rainNextAt=0;

function emptyPlot(){return{crop:null,at:null}}
function stateKey(){return currentMember?`yainoo-v5:${currentMember}`:null}
function avatarKey(){return currentMember?`yainoo-avatar-v1:${currentMember}`:null}
function profileNameKey(){return currentMember?`yainoo-profile-name-v1:${currentMember}`:null}
function topPlayerNameKey(){return currentMember?`yainoo-top-player-name-v1:${currentMember}`:null}

function fresh(player){
  return{
    player,
    plots:Array.from({length:PLOT_COUNT},emptyPlot),
    bag:Object.fromEntries(Object.keys(CROPS).map(k=>[k,0])),
    dishes:[]
  };
}

function normalizeState(raw,player){
  const normalized=raw&&typeof raw==="object"?raw:fresh(player);
  normalized.player=player||normalized.player||"ผู้เล่น";
  normalized.plots=Array.isArray(normalized.plots)?normalized.plots.slice(0,PLOT_COUNT):[];
  while(normalized.plots.length<PLOT_COUNT)normalized.plots.push(emptyPlot());
  normalized.plots=normalized.plots.map(plot=>plot&&typeof plot==="object"?plot:emptyPlot());
  normalized.bag=normalized.bag&&typeof normalized.bag==="object"?normalized.bag:{};
  Object.keys(CROPS).forEach(key=>{if(!Number.isFinite(normalized.bag[key]))normalized.bag[key]=0});
  normalized.dishes=Array.isArray(normalized.dishes)?normalized.dishes:[];
  return normalized;
}

function save(){
  const key=stateKey();
  if(state&&key)localStorage.setItem(key,JSON.stringify(state));
}

function load(player){
  const key=stateKey();
  if(key){
    try{
      const saved=JSON.parse(localStorage.getItem(key));
      if(saved)return normalizeState(saved,player);
    }catch(error){console.warn("อ่านข้อมูลสวนเดิมไม่สำเร็จ",error)}
  }
  return fresh(player);
}

function parseLine(line){
  const cells=[];
  let cell="",quoted=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){
      if(quoted&&line[i+1]==='"'){cell+='"';i++}else quoted=!quoted;
    }else if(ch===","&&!quoted){cells.push(cell.trim());cell=""}
    else cell+=ch;
  }
  cells.push(cell.trim());
  return cells;
}

async function loadMembers(){
  try{
    const response=await fetch("member-codes.csv?v=5",{cache:"no-store"});
    if(!response.ok)throw new Error("โหลดรายชื่อไม่สำเร็จ");
    const text=(await response.text()).replace(/^\uFEFF/,"");
    const loaded={};
    text.split(/\r?\n/).filter(Boolean).slice(1).forEach(row=>{
      const [name,code]=parseLine(row);
      if(name&&code)loaded[name]=code;
    });
    if(Object.keys(loaded).length)MEMBERS=loaded;
  }catch(error){console.warn("ใช้รายชื่อสำรอง")}
  $("memberSelect").innerHTML=Object.keys(MEMBERS).map(name=>`<option value="${name}">${name}</option>`).join("");
}

/* ===== รูปโปรไฟล์และชื่อโปรไฟล์ ===== */
function updateProfileName(){
  const key=profileNameKey();
  $("profileNameButton").textContent=key?(localStorage.getItem(key)||state?.player||"ตั้งชื่อ"):"ตั้งชื่อ";
}

function setupProfile(){
  $("avatarButton").onclick=()=>$("avatarUpload").click();
  $("avatarUpload").onchange=handleAvatarUpload;
  $("profileNameButton").onclick=()=>{
    if(!currentMember)return;
    const key=profileNameKey();
    const oldName=localStorage.getItem(key)||state?.player||"";
    const typed=window.prompt("พิมพ์ชื่อใต้รูปโปรไฟล์",oldName);
    if(typed===null)return;
    const clean=typed.trim().slice(0,12);
    if(!clean)return;
    localStorage.setItem(key,clean);
    updateProfileName();
  };
}

function showAvatar(dataUrl){
  const avatar=$("playerAvatar");
  if(dataUrl){
    avatar.src=dataUrl;
    avatar.classList.add("has-avatar");
  }else{
    avatar.removeAttribute("src");
    avatar.classList.remove("has-avatar");
  }
}

function loadAvatar(){
  const key=avatarKey();
  showAvatar(key?(localStorage.getItem(key)||""):"");
}

function resizeAvatar(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onerror=()=>reject(new Error("อ่านไฟล์รูปไม่สำเร็จ"));
    reader.onload=()=>{
      const image=new Image();
      image.onerror=()=>reject(new Error("เปิดรูปไม่สำเร็จ"));
      image.onload=()=>{
        const width=image.naturalWidth||image.width;
        const height=image.naturalHeight||image.height;
        const cropSize=Math.min(width,height);
        const sourceX=(width-cropSize)/2;
        const sourceY=(height-cropSize)/2;
        const canvas=document.createElement("canvas");
        canvas.width=360;
        canvas.height=360;
        const context=canvas.getContext("2d");
        if(!context){reject(new Error("เตรียมรูปไม่สำเร็จ"));return}
        context.drawImage(image,sourceX,sourceY,cropSize,cropSize,0,0,360,360);
        resolve(canvas.toDataURL("image/jpeg",.86));
      };
      image.src=reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleAvatarUpload(event){
  const file=event.target.files&&event.target.files[0];
  event.target.value="";
  if(!file)return;
  if(!file.type.startsWith("image/")){message("เลือกรูปไม่สำเร็จ","กรุณาเลือกไฟล์รูปภาพ");return}
  const key=avatarKey();
  if(!key){message("ยังเปลี่ยนรูปไม่ได้","กรุณาเข้าสู่เกมก่อน");return}
  try{
    const dataUrl=await resizeAvatar(file);
    localStorage.setItem(key,dataUrl);
    showAvatar(dataUrl);
  }catch(error){
    console.error(error);
    message("บันทึกรูปไม่สำเร็จ","ลองเลือกรูปอื่นอีกครั้ง");
  }
}

/* ===== ชื่ออิสระบนป้ายไม้ ===== */
function updateTopPlayerName(){
  const key=topPlayerNameKey();
  $("topPlayerNameButton").textContent=key?(localStorage.getItem(key)||"แตะเพื่อตั้งชื่อ"):"แตะเพื่อตั้งชื่อ";
}

function setupTopPlayerName(){
  $("topPlayerNameButton").onclick=()=>{
    if(!currentMember)return;
    const key=topPlayerNameKey();
    const oldName=localStorage.getItem(key)||"";
    const typed=window.prompt("พิมพ์ข้อความบนป้ายไม้",oldName);
    if(typed===null)return;
    const clean=typed.trim().slice(0,24);
    if(!clean)return;
    localStorage.setItem(key,clean);
    updateTopPlayerName();
  };
}

/* ===== เวลาไทยและพยากรณ์ ===== */
function getBangkokTimeParts(){
  const formatter=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Bangkok",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
  const parts=Object.fromEntries(formatter.formatToParts(new Date()).filter(part=>part.type!=="literal").map(part=>[part.type,part.value]));
  return{hour:Number(parts.hour||0),minute:Number(parts.minute||0),text:`${parts.hour||"00"}:${parts.minute||"00"}`};
}

function getCurrentForecastIndex(){
  const now=getBangkokTimeParts();
  const minutes=(now.hour*60)+now.minute;
  return FORECAST_SLOTS.findIndex(slot=>minutes>=slot.start&&minutes<slot.end);
}

function updateThaiClock(){
  const now=getBangkokTimeParts();
  $("thaiClock").textContent=now.text;
  const index=getCurrentForecastIndex();
  $("weatherClockEmoji").textContent=index>=0?FORECAST_SLOTS[index].emoji:"🌤️";
}

function showForecast(){
  const currentIndex=getCurrentForecastIndex();
  $("modalContent").innerHTML=`
    <div class="forecast-panel">
      <h2>🔮 พยากรณ์สวนผี</h2>
      <p class="forecast-subtitle">อ้างอิงเวลาประเทศไทย</p>
      <div class="forecast-list">
        ${FORECAST_SLOTS.map((slot,index)=>`
          <div class="forecast-row ${index===currentIndex?"current":""}">
            <span class="forecast-emoji">${slot.emoji}</span>
            <span class="forecast-time">${slot.time}</span>
            <span class="forecast-name">${slot.name}</span>
          </div>`).join("")}
      </div>
    </div>`;
  openModal();
}

/* ===== ฝนตกทันที 30 วินาที แล้วนับ 4 ชั่วโมง ===== */
function buildRainDrops(){
  const container=$("rainDrops");
  if(container.childElementCount)return;
  const fragment=document.createDocumentFragment();
  for(let i=0;i<110;i++){
    const drop=document.createElement("span");
    drop.className="rain-drop";
    drop.style.left=`${Math.random()*110-5}%`;
    drop.style.setProperty("--drop-speed",`${.48+(Math.random()*.7)}s`);
    drop.style.setProperty("--drop-delay",`${-(Math.random()*2)}s`);
    drop.style.setProperty("--drop-length",`${13+Math.round(Math.random()*22)}px`);
    drop.style.setProperty("--drop-opacity",`${.42+(Math.random()*.5)}`);
    fragment.appendChild(drop);
  }
  container.appendChild(fragment);
}

function showWeatherToast(text){
  const toast=$("weatherToast");
  toast.textContent=text;
  toast.classList.add("show");
  if(rainToastTimer)clearTimeout(rainToastTimer);
  rainToastTimer=setTimeout(()=>toast.classList.remove("show"),2800);
}

function formatRainSeconds(milliseconds){
  const totalSeconds=Math.max(0,Math.ceil(milliseconds/1000));
  return `${String(Math.floor(totalSeconds/60)).padStart(2,"0")}:${String(totalSeconds%60).padStart(2,"0")}`;
}

function formatRainHoursMinutes(milliseconds){
  const totalMinutes=Math.max(0,Math.ceil(milliseconds/60000));
  return `${String(Math.floor(totalMinutes/60)).padStart(2,"0")}:${String(totalMinutes%60).padStart(2,"0")}`;
}

function setRainStatus(title,countdown){
  $("rainStatusTitle").textContent=title;
  $("rainCountdown").textContent=countdown;
}

function beginRain(){
  if($("gameScreen").classList.contains("hidden"))return;
  if(rainTickTimer)clearInterval(rainTickTimer);
  $("gameScreen").classList.add("raining");
  rainNextAt=0;
  const rainEndsAt=Date.now()+RAIN_DURATION_MS;
  setRainStatus("🌧️ ฝนผีกำลังตก","00:30");
  showWeatherToast("🌧️ ฝนผีมาเยือน");
  const update=()=>{
    const remaining=rainEndsAt-Date.now();
    if(remaining<=0){stopRainAndStartCountdown();return}
    setRainStatus("🌧️ ฝนผีกำลังตก",formatRainSeconds(remaining));
  };
  update();
  rainTickTimer=setInterval(update,250);
}

function stopRainAndStartCountdown(){
  $("gameScreen").classList.remove("raining");
  if(rainTickTimer)clearInterval(rainTickTimer);
  rainNextAt=Date.now()+RAIN_INTERVAL_MS;
  const update=()=>{
    const remaining=rainNextAt-Date.now();
    if(remaining<=0){beginRain();return}
    setRainStatus("ฝนตกช่วงต่อไป",formatRainHoursMinutes(remaining));
  };
  update();
  rainTickTimer=setInterval(update,1000);
}

function startGameExtras(){
  updateProfileName();
  loadAvatar();
  updateTopPlayerName();
  updateThaiClock();
  buildRainDrops();
  if(thaiClockTimer)clearInterval(thaiClockTimer);
  thaiClockTimer=setInterval(updateThaiClock,60*1000);
  beginRain();
}

function stopGameExtras(){
  if(thaiClockTimer)clearInterval(thaiClockTimer);
  if(rainTickTimer)clearInterval(rainTickTimer);
  if(rainToastTimer)clearTimeout(rainToastTimer);
  thaiClockTimer=rainTickTimer=rainToastTimer=null;
  rainNextAt=0;
  $("gameScreen").classList.remove("raining");
  $("weatherToast").classList.remove("show");
  setRainStatus("🌧️ ฝนผีกำลังตก","00:30");
}

/* ===== ระบบปลูก 12 แปลง ===== */
function stage(plot){
  if(!plot.crop)return"empty";
  const elapsed=Date.now()-plot.at;
  const total=CROPS[plot.crop].ms;
  if(elapsed>=total)return"ready";
  if(elapsed>=total*.66)return"grown";
  if(elapsed>=total*.33)return"sprout";
  return"seed";
}

function plotStatus(plot){
  if(!plot.crop)return null;
  const age=Date.now()-plot.at;
  const total=CROPS[plot.crop].ms;
  if(age>=total)return null;
  if(plot.dead)return"dead";
  if(age>=total*.20&&age<total*.45)return"water";
  if(age>=total*.45&&age<total*.75)return"worm";
  if(age>=total*.75){plot.dead=true;save();return"dead"}
  return null;
}

function cropIcon(plot){
  if(!plot.crop)return"";
  const crop=CROPS[plot.crop];
  const age=Date.now()-plot.at;
  const total=crop.ms;
  let src=crop.seedImg;
  let cls="stage-seed";
  if(age>=total){src=crop.readyImg;cls="stage-ready"}
  else if(age>=total*.66){src=crop.growImg;cls="stage-grow"}
  else if(age>=total*.33){src=crop.sproutImg;cls="stage-sprout"}
  return `<img class="crop-img ${cls}" src="${src}" alt="${crop.name}">`;
}

function remain(plot){return Math.max(0,Math.ceil((CROPS[plot.crop].ms-(Date.now()-plot.at))/1000))}

function draw(){
  if(!state)return;
  const plots=$("plots");
  plots.innerHTML="";
  state.plots.forEach((plot,index)=>{
    const currentStage=stage(plot);
    const status=plotStatus(plot);
    const button=document.createElement("button");
    button.type="button";
    button.className=`plot ${currentStage} ${currentStage==="empty"?"empty":currentStage==="ready"?"ready":"growing"}`;
    const name=plot.crop?CROPS[plot.crop].name:"";
    const timerText=plot.crop?(currentStage==="ready"?"พร้อมเก็บ":`${remain(plot)} วินาที`):"";
    button.innerHTML=`
      <span class="plot-no">#${index+1}</span>
      ${status?`<img class="status-badge" src="${STATUS_ICON[status]}" alt="${status}">`:""}
      <div class="plot-inner">
        <div class="crop">${cropIcon(plot)}</div>
        ${name?`<div class="crop-name">${name}</div>`:""}
        ${timerText?`<div class="timer">${timerText}</div>`:""}
      </div>`;
    button.onclick=()=>tapPlot(index);
    plots.appendChild(button);
  });
}

function tapPlot(index){
  const plot=state.plots[index];
  const currentStage=stage(plot);
  if(currentStage==="empty"){plantMenu(index);return}
  if(currentStage==="ready"){
    state.bag[plot.crop]=(state.bag[plot.crop]||0)+1;
    const name=CROPS[plot.crop].name;
    state.plots[index]=emptyPlot();
    save();
    draw();
    message("เก็บเกี่ยวสำเร็จ",`ได้ ${name} ×1`);
    return;
  }
  message("ยังไม่พร้อมเก็บ",`${CROPS[plot.crop].name} เหลือประมาณ ${remain(plot)} วินาที`);
}

function plantMenu(index){
  $("modalContent").innerHTML=`
    <h2>เลือกเมล็ดสำหรับแปลง #${index+1}</h2>
    <div class="grid">
      ${Object.entries(CROPS).map(([key,crop])=>`
        <div class="tile">
          <img src="${crop.selectImg}" alt="${crop.name}" class="seed-choice-img">
          <b>${crop.name}</b>
          <p>${crop.ms/1000} วินาที</p>
          <button type="button" data-crop="${key}">ปลูก</button>
        </div>`).join("")}
    </div>`;
  document.querySelectorAll("[data-crop]").forEach(button=>{
    button.onclick=()=>{
      state.plots[index]={crop:button.dataset.crop,at:Date.now()};
      save();
      closeModal();
      draw();
    };
  });
  openModal();
}

function inventory(){
  $("modalContent").innerHTML=`<h2>🎒 กระเป๋า</h2><div class="list">${Object.entries(CROPS).map(([key,crop])=>`<div class="row"><span>${crop.icon} ${crop.name}</span><b>×${state.bag[key]||0}</b></div>`).join("")}</div>`;
  openModal();
}


/* ===== ร้านค้า / ภารกิจ / เพื่อน ===== */
function showShop(){
  $("modalContent").innerHTML=`
    <section class="feature-panel shop-panel">
      <h2>🕯️ ร้านค้าสัตว์วิญญาณ</h2>
      <p class="feature-subtitle">สัตว์จากอีกภพกำลังรอเจ้าของ</p>
      <div class="shop-grid">
        ${SHOP_ITEMS.map(item=>`
          <article class="shop-card">
            <div class="shop-emoji" aria-hidden="true">${item.emoji}</div>
            <b>${item.name}</b>
            <button type="button" disabled>ซื้อ — เร็ว ๆ นี้</button>
          </article>`).join("")}
      </div>
    </section>`;
  openModal();
}

function showMissions(){
  const missions=Array.isArray(window.DAILY_MISSIONS)?window.DAILY_MISSIONS.slice(0,7):[];
  $("modalContent").innerHTML=`
    <section class="feature-panel mission-panel">
      <h2>👻 ภารกิจประจำวัน</h2>
      <p class="feature-subtitle">รายการสำหรับวันนี้</p>
      <div class="mission-list">
        ${missions.map((mission,index)=>`
          <div class="mission-item">
            <span class="mission-number">${index+1}</span>
            <span class="mission-text">${mission}</span>
          </div>`).join("") || '<p class="empty-feature">ยังไม่มีภารกิจประจำวัน</p>'}
      </div>
    </section>`;
  openModal();
}

function getFriendNames(){
  return Object.keys(MEMBERS)
    .filter(name=>name.trim().toLowerCase()!=="aida")
    .slice(0,18);
}

function showFriends(){
  const friends=getFriendNames();
  $("modalContent").innerHTML=`
    <section class="feature-panel friends-panel">
      <h2>👥 รายชื่อเพื่อน</h2>
      <p class="feature-subtitle">สมาชิกทั้งหมด ${friends.length} คน</p>
      <div class="friend-list">
        ${friends.map(name=>`
          <div class="friend-row">
            <span class="friend-avatar" aria-hidden="true">👻</span>
            <b>${name}</b>
          </div>`).join("")}
      </div>
    </section>`;
  openModal();
}

function confirmReturnToLogin(){
  $("modalContent").innerHTML=`
    <section class="feature-panel confirm-panel">
      <div class="confirm-ghost" aria-hidden="true">👻</div>
      <h2>กลับไปหน้าล็อกอิน?</h2>
      <p>ข้อมูลสวนและของในกระเป๋าจะถูกบันทึกไว้ตามเดิม</p>
      <div class="confirm-actions">
        <button id="cancelReturnBtn" class="secondary-action" type="button">อยู่ในสวนต่อ</button>
        <button id="confirmReturnBtn" class="danger-action" type="button">กลับหน้าล็อกอิน</button>
      </div>
    </section>`;
  $("cancelReturnBtn").onclick=closeModal;
  $("confirmReturnBtn").onclick=()=>{
    closeModal();
    logout();
  };
  openModal();
}

function can(recipe){return Object.entries(recipe.need).every(([key,count])=>(state.bag[key]||0)>=count)}
function kitchen(){
  $("modalContent").innerHTML=`<h2>🍲 ครัวเปรตเปรต</h2><div class="grid">${RECIPES.map(recipe=>`<div class="tile"><div style="font-size:42px">${recipe.icon}</div><b>${recipe.name}</b><p>${Object.entries(recipe.need).map(([key,count])=>CROPS[key].icon+count).join(" ")}</p><button type="button" data-recipe="${recipe.id}" ${can(recipe)?"":"disabled"}>${can(recipe)?"คราฟอาหาร":"วัตถุดิบไม่ครบ"}</button></div>`).join("")}</div>`;
  document.querySelectorAll("[data-recipe]").forEach(button=>button.onclick=()=>craft(button.dataset.recipe));
  openModal();
}

function craft(id){
  const recipe=RECIPES.find(item=>item.id===id);
  if(!recipe||!can(recipe))return;
  Object.entries(recipe.need).forEach(([key,count])=>state.bag[key]-=count);
  state.dishes.push({...recipe,time:new Date().toLocaleString("th-TH")});
  save();
  $("modalContent").innerHTML=`<h2>คราฟสำเร็จ!</h2><div style="font-size:80px;text-align:center">${recipe.icon}</div><h3 style="text-align:center">${recipe.name}</h3><p>สมาชิก: ${currentMember}</p><p>ชื่อในเกม: ${state.player}</p><p>แคปหน้าจอนี้แล้วส่งเข้ากิจกรรม</p>`;
}

/* ===== เข้าและออกเกม ===== */
function start(){
  const member=$("memberSelect").value;
  const code=$("memberCode").value.trim();
  const player=$("playerName").value.trim();
  if(MEMBERS[member]!==code){$("loginError").textContent="ชื่อสมาชิกหรือรหัสไม่ถูกต้อง";return}
  if(!player){$("loginError").textContent="กรุณาตั้งชื่อผู้เล่นในเกม";return}
  currentMember=member;
  state=load(player);
  save();
  $("loginError").textContent="";
  $("loginScreen").classList.add("hidden");
  $("gameScreen").classList.remove("hidden");
  startGameExtras();
  draw();
  if(ticker)clearInterval(ticker);
  ticker=setInterval(draw,1000);
}

function logout(){
  if(ticker)clearInterval(ticker);
  ticker=null;
  save();
  stopGameExtras();
  showAvatar("");
  $("gameScreen").classList.add("hidden");
  $("loginScreen").classList.remove("hidden");
  $("memberCode").value="";
  currentMember=null;
  state=null;
}

function showHow(){message("วิธีเล่น","แตะแปลงว่างเพื่อเลือกเมล็ด แตะแปลงที่โตเต็มวัยเพื่อเก็บเกี่ยว ตอนนี้ปลูกได้ครบทั้ง 12 แปลง")}
function showMenu(){$("modalContent").innerHTML=`<h2>สมุดเมนู</h2>${RECIPES.map(recipe=>`<p>${recipe.icon} ${recipe.name}</p>`).join("")}`;openModal()}
function showSettings(){message("ตั้งค่า","ระบบตั้งค่าจะเพิ่มในเวอร์ชันถัดไป")}
function showRewards(){message("ของรางวัล","คราฟอาหารสำเร็จแล้วแคปหน้าจอส่งรับรางวัล")}
function message(title,text){$("modalContent").innerHTML=`<h2>${title}</h2><p>${text}</p>`;openModal()}
function openModal(){$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden")}

function bindEvents(){
  $("startBtn").onclick=start;
  $("howBtn").onclick=showHow;
  $("menuBtn").onclick=showMenu;
  $("settingsBtn").onclick=showSettings;
  $("rewardBtn").onclick=showRewards;
  $("closeModal").onclick=closeModal;
  $("modal").onclick=event=>{if(event.target===$("modal"))closeModal()};
  $("forecastBtn").onclick=showForecast;
  $("gardenNavBtn").onclick=confirmReturnToLogin;
  $("inventoryNavBtn").onclick=inventory;
  $("shopNavBtn").onclick=showShop;
  $("missionsNavBtn").onclick=showMissions;
  $("friendsNavBtn").onclick=showFriends;
  $("menuNavBtn").onclick=showMenu;
  setupProfile();
  setupTopPlayerName();
}

bindEvents();
updateThaiClock();
loadMembers();
