
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
chili:{name:"พริกผีเปรต",icon:"🌶️",selectImg:"01_ghost_pepper.png?v=2",ms:60000,seedImg:"pret-chili-seed.png",sproutImg:"pret-chili-sprout.png",growImg:"pret-chili-grow.png",readyImg:"pret-chili-ready.png"},
pumpkin:{
  name:"ฟักทองกองกอย",
  icon:"🎃",
  selectImg:"02_ghost_pumpkin.png?v=2",
  ms:30000,
  seedImg:"ghost-pumpkin-seed.png?v=1",
  sproutImg:"ghost-pumpkin-sprout.png?v=1",
  growImg:"ghost-pumpkin-grow.png?v=1",
  readyImg:"ghost-pumpkin-ready.png?v=1"
},
cabbage:{
  name:"ผักกาดบ้านนอก",
  icon:"🥬",
  selectImg:"04_country_cabbage.png?v=2",
  ms:25000,
  seedImg:"cabbage-seed.png?v=1",
  sproutImg:"cabbage-sprout.png?v=1",
  growImg:"cabbage-grow.png?v=1",
  readyImg:"cabbage-ready.png?v=1"
},
mango:{
  name:"มะม่วงหน้าเน่า",
  icon:"🥭",
  selectImg:"03_rotten_mango.png?v=2",
  ms:35000,
  seedImg:"mango-seed.png?v=2",
  sproutImg:"mango-sprout.png?v=2",
  growImg:"mango-grow.png?v=2",
  readyImg:"mango-ready.png?v=2"
},
lychee:{
  name:"ลิ้นจี่ หลีหอม",
  icon:"🍒",
  selectImg:"05_fragrant_lychee.png?v=2",
  ms:40000,
  seedImg:"lychee-seed.png?v=2",
  sproutImg:"lychee-sprout.png?v=2",
  growImg:"lychee-grow.png?v=2",
  readyImg:"lychee-ready.png?v=2"
},
morning:{
  name:"ผักบุ้ง สะดุ้งเก่ง",
  icon:"🌿",
  selectImg:"06_startled_morning_glory.png?v=2",
  ms:22000,
  seedImg:"morning-seed.png?v=2",
  sproutImg:"morning-sprout.png?v=2",
  growImg:"morning-grow.png?v=2",
  readyImg:"morning-ready.png?v=2"
}
};
const STATUS_ICON = {
  water: "status-water.png?v=3",
  worm: "status-worm.png?v=3",
  dead: "status-dead.png?v=3"
};

const RECIPES = [
  {id:"r1",name:"ผัดพริกผีเปรต",icon:"🍛",need:{chili:3,morning:2}},
  {id:"r2",name:"แกงฟักทองกองกอย",icon:"🥘",need:{pumpkin:3,cabbage:2}},
  {id:"r3",name:"ยำมะม่วงหน้าเน่า",icon:"🥗",need:{mango:3,chili:2,lychee:1}},
  {id:"r4",name:"หม้อไฟเปรตเปรต",icon:"🍲",need:{chili:2,pumpkin:2,cabbage:2,mango:2,lychee:2,morning:2}}
];

const $=id=>document.getElementById(id);
let currentMember=null,state=null,ticker=null;
let thaiClockTimer=null;
let rainTickTimer=null;
let rainToastTimer=null;
let rainNextAt=0;

const RAIN_DURATION_MS=30*1000;
const RAIN_INTERVAL_MS=4*60*60*1000;

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

/* ===== ระบบรูปโปรไฟล์ อัปโหลดจากโทรศัพท์และจำแยกตามสมาชิก ===== */
function avatarKey(){
  return currentMember ? `yainoo-avatar-v1:${currentMember}` : null;
}

function profileNameKey(){
  return currentMember ? `yainoo-profile-name-v1:${currentMember}` : null;
}

function updateProfileName(){
  const button=$("profileNameButton");
  if(!button)return;

  const storageKey=profileNameKey();
  button.textContent=storageKey
    ? localStorage.getItem(storageKey) || "ตั้งชื่อ"
    : "ตั้งชื่อ";
}

function ensureAvatarUI(){
  const gameScreen=$("gameScreen");
  if(!gameScreen)return;

  let avatarButton=$("avatarButton");
  let avatar=$("playerAvatar");
  let upload=$("avatarUpload");
  let profileNameButton=$("profileNameButton");

  if(!avatarButton){
    avatarButton=document.createElement("button");
    avatarButton.id="avatarButton";
    avatarButton.type="button";
    avatarButton.setAttribute("aria-label","เลือกรูปโปรไฟล์");
    gameScreen.appendChild(avatarButton);
  }

  if(!avatar){
    avatar=document.createElement("img");
    avatar.id="playerAvatar";
    avatar.alt="รูปโปรไฟล์";
  }

  if(avatar.parentElement!==avatarButton){
    avatarButton.appendChild(avatar);
  }

  if(!upload){
    upload=document.createElement("input");
    upload.id="avatarUpload";
    upload.type="file";
    upload.accept="image/*";
    upload.hidden=true;
    gameScreen.appendChild(upload);
  }

  if(!profileNameButton){
    profileNameButton=document.createElement("button");
    profileNameButton.id="profileNameButton";
    profileNameButton.type="button";
    profileNameButton.setAttribute("aria-label","ตั้งชื่อบนป้าย");
    gameScreen.appendChild(profileNameButton);
  }

  if(!$("avatarRuntimeStyle")){
    const style=document.createElement("style");
    style.id="avatarRuntimeStyle";
    style.textContent=`
      #gameScreen #avatarButton{
        position:absolute !important;
        left:4.4% !important;
        top:77.8% !important;
        width:19.2% !important;
        aspect-ratio:1/1 !important;
        padding:0 !important;
        margin:0 !important;
        border:0 !important;
        border-radius:50% !important;
        background:transparent !important;
        overflow:hidden !important;
        clip-path:inset(0 0 17% 0 round 50% 50% 42% 42%) !important;
        z-index:45 !important;
        cursor:pointer !important;
        pointer-events:auto !important;
        -webkit-tap-highlight-color:transparent !important;
      }

      #gameScreen #playerAvatar{
        display:none !important;
        width:100% !important;
        height:100% !important;
        max-width:none !important;
        max-height:none !important;
        margin:0 !important;
        padding:0 !important;
        border:0 !important;
        border-radius:50% !important;
        object-fit:cover !important;
        object-position:center 60% !important;
        background:transparent !important;
        box-shadow:none !important;
        transform:scale(1.30) !important;
        pointer-events:none !important;
      }

      #gameScreen #playerAvatar.has-avatar{
        display:block !important;
      }

      #gameScreen #profileNameButton{
        position:absolute !important;
        left:4.4% !important;
        top:84.35% !important;
        width:19.5% !important;
        height:3.6% !important;
        display:flex !important;
        align-items:center !important;
        justify-content:center !important;
        padding:0 4px !important;
        margin:0 !important;
        border:0 !important;
        outline:0 !important;
        background:transparent !important;
        color:#fff !important;
        font-family:inherit !important;
        font-size:13px !important;
        line-height:1 !important;
        font-weight:800 !important;
        text-align:center !important;
        white-space:nowrap !important;
        overflow:hidden !important;
        text-overflow:ellipsis !important;
        text-shadow:0 2px 2px rgba(90,35,45,.85) !important;
        z-index:80 !important;
        transform:rotate(-1deg) !important;
        cursor:pointer !important;
        pointer-events:auto !important;
        -webkit-tap-highlight-color:transparent !important;
      }
    `;
    document.head.appendChild(style);
  }

  avatarButton.onclick=()=>upload.click();
  upload.onchange=handleAvatarUpload;

  profileNameButton.onclick=()=>{
    if(!currentMember)return;

    const storageKey=profileNameKey();
    const oldName=localStorage.getItem(storageKey) || "";
    const typedName=window.prompt("พิมพ์ชื่อบนป้าย",oldName);

    if(typedName===null)return;

    const cleanName=typedName.trim().slice(0,12);
    if(!cleanName)return;

    localStorage.setItem(storageKey,cleanName);
    profileNameButton.textContent=cleanName;
  };

  updateProfileName();
}

function showAvatar(dataUrl){
  ensureAvatarUI();
  const avatar=$("playerAvatar");
  if(!avatar)return;

  if(dataUrl){
    avatar.src=dataUrl;
    avatar.classList.add("has-avatar");
  }else{
    avatar.removeAttribute("src");
    avatar.classList.remove("has-avatar");
  }
}

function loadAvatar(){
  const storageKey=avatarKey();
  showAvatar(storageKey ? localStorage.getItem(storageKey) || "" : "");
}

function resizeAvatar(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();

    reader.onerror=()=>reject(new Error("อ่านไฟล์รูปไม่สำเร็จ"));
    reader.onload=()=>{
      const image=new Image();

      image.onerror=()=>reject(new Error("เปิดรูปไม่สำเร็จ"));
      image.onload=()=>{
        const sourceWidth=image.naturalWidth||image.width;
        const sourceHeight=image.naturalHeight||image.height;
        const cropSize=Math.min(sourceWidth,sourceHeight);
        const sourceX=(sourceWidth-cropSize)/2;
        const sourceY=(sourceHeight-cropSize)/2;

        const canvas=document.createElement("canvas");
        canvas.width=320;
        canvas.height=320;

        const context=canvas.getContext("2d");
        if(!context){
          reject(new Error("เตรียมรูปไม่สำเร็จ"));
          return;
        }

        context.drawImage(
          image,
          sourceX,sourceY,cropSize,cropSize,
          0,0,canvas.width,canvas.height
        );

        resolve(canvas.toDataURL("image/jpeg",0.84));
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
  if(!file.type.startsWith("image/")){
    message("เลือกรูปไม่สำเร็จ","กรุณาเลือกไฟล์รูปภาพ");
    return;
  }

  const storageKey=avatarKey();
  if(!storageKey){
    message("ยังเปลี่ยนรูปไม่ได้","กรุณาเข้าสู่เกมก่อน");
    return;
  }

  try{
    const dataUrl=await resizeAvatar(file);
    localStorage.setItem(storageKey,dataUrl);
    showAvatar(dataUrl);
  }catch(error){
    console.error(error);
    message("บันทึกรูปไม่สำเร็จ","ลองเลือกรูปอื่นอีกครั้ง");
  }
}

/* ===== ชื่อด้านบน เวลาไทย และระบบสภาพอากาศ ===== */
function topPlayerNameKey(){
  return currentMember ? `yainoo-top-player-name-v1:${currentMember}` : null;
}

function updateTopPlayerName(){
  const button=$("topPlayerNameButton");
  if(!button)return;

  const storageKey=topPlayerNameKey();
  button.textContent=storageKey
    ? localStorage.getItem(storageKey) || "ตั้งชื่อ"
    : "ตั้งชื่อ";
}

function setupTopPlayerName(){
  const button=$("topPlayerNameButton");
  if(!button || button.dataset.bound==="1")return;

  button.dataset.bound="1";
  button.onclick=()=>{
    if(!currentMember)return;

    const storageKey=topPlayerNameKey();
    const oldName=localStorage.getItem(storageKey) || "";
    const typedName=window.prompt("พิมพ์ชื่อด้านบน",oldName);

    if(typedName===null)return;

    const cleanName=typedName.trim().slice(0,20);
    if(!cleanName)return;

    localStorage.setItem(storageKey,cleanName);
    button.textContent=cleanName;
  };
}

function getBangkokTimeParts(){
  const formatter=new Intl.DateTimeFormat("en-GB",{
    timeZone:"Asia/Bangkok",
    hour:"2-digit",
    minute:"2-digit",
    hourCycle:"h23"
  });

  const parts=Object.fromEntries(
    formatter.formatToParts(new Date())
      .filter(part=>part.type!=="literal")
      .map(part=>[part.type,part.value])
  );

  return{
    hour:Number(parts.hour||0),
    minute:Number(parts.minute||0),
    text:`${parts.hour||"00"}:${parts.minute||"00"}`
  };
}

function updateThaiClock(){
  const clock=$("thaiClock");
  if(!clock)return;
  clock.textContent=getBangkokTimeParts().text;
}

function getCurrentForecastIndex(){
  const now=getBangkokTimeParts();
  const minutes=(now.hour*60)+now.minute;
  return FORECAST_SLOTS.findIndex(slot=>minutes>=slot.start&&minutes<slot.end);
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
          </div>
        `).join("")}
      </div>
    </div>
  `;

  open();
}

function buildRainDrops(){
  const container=$("rainDrops");
  if(!container || container.childElementCount)return;

  const fragment=document.createDocumentFragment();

  for(let i=0;i<72;i++){
    const drop=document.createElement("span");
    drop.className="rain-drop";
    drop.style.left=`${Math.random()*110-5}%`;
    drop.style.setProperty("--drop-speed",`${0.58+(Math.random()*.72)}s`);
    drop.style.setProperty("--drop-delay",`${-(Math.random()*1.8)}s`);
    drop.style.setProperty("--drop-length",`${11+Math.round(Math.random()*18)}px`);
    drop.style.setProperty("--drop-opacity",`${0.34+(Math.random()*.52)}`);
    fragment.appendChild(drop);
  }

  container.appendChild(fragment);
}

function setupWeatherUI(){
  buildRainDrops();

  const forecastButton=$("forecastBtn");
  if(forecastButton && forecastButton.dataset.bound!=="1"){
    forecastButton.dataset.bound="1";
    forecastButton.onclick=showForecast;
  }
}

function showWeatherToast(text){
  const toast=$("weatherToast");
  if(!toast)return;

  toast.textContent=text;
  toast.classList.add("show");

  if(rainToastTimer)clearTimeout(rainToastTimer);
  rainToastTimer=setTimeout(()=>toast.classList.remove("show"),2800);
}

function formatRainSeconds(milliseconds){
  const totalSeconds=Math.max(0,Math.ceil(milliseconds/1000));
  const minutes=Math.floor(totalSeconds/60);
  const seconds=totalSeconds%60;
  return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function formatRainHoursMinutes(milliseconds){
  const totalMinutes=Math.max(0,Math.ceil(milliseconds/60000));
  const hours=Math.floor(totalMinutes/60);
  const minutes=totalMinutes%60;
  return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}`;
}

function setRainStatus(title,countdown){
  const titleEl=$("rainStatusTitle");
  const countdownEl=$("rainCountdown");

  if(titleEl)titleEl.textContent=title;
  if(countdownEl)countdownEl.textContent=countdown;
}

function beginRain(){
  const screen=$("gameScreen");
  if(!screen || screen.classList.contains("hidden"))return;

  if(rainTickTimer)clearInterval(rainTickTimer);

  screen.classList.add("raining");
  rainNextAt=0;

  const rainEndsAt=Date.now()+RAIN_DURATION_MS;
  setRainStatus("🌧️ ฝนผีกำลังตก","00:30");
  showWeatherToast("🌧️ ฝนผีมาเยือน");

  const updateRain=()=>{
    const remaining=rainEndsAt-Date.now();

    if(remaining<=0){
      stopRainAndStartCountdown();
      return;
    }

    setRainStatus("🌧️ ฝนผีกำลังตก",formatRainSeconds(remaining));
  };

  updateRain();
  rainTickTimer=setInterval(updateRain,250);
}

function stopRainAndStartCountdown(){
  const screen=$("gameScreen");
  if(screen)screen.classList.remove("raining");

  if(rainTickTimer)clearInterval(rainTickTimer);
  rainTickTimer=null;

  rainNextAt=Date.now()+RAIN_INTERVAL_MS;

  const updateCountdown=()=>{
    const remaining=rainNextAt-Date.now();

    if(remaining<=0){
      beginRain();
      return;
    }

    setRainStatus("ฝนตกช่วงต่อไป",formatRainHoursMinutes(remaining));
  };

  updateCountdown();
  rainTickTimer=setInterval(updateCountdown,1000);
}

function startGameExtras(){
  setupTopPlayerName();
  setupWeatherUI();
  updateTopPlayerName();
  updateThaiClock();

  if(thaiClockTimer)clearInterval(thaiClockTimer);
  thaiClockTimer=setInterval(updateThaiClock,60*1000);

  beginRain();
}

function stopGameExtras(){
  if(thaiClockTimer)clearInterval(thaiClockTimer);
  if(rainTickTimer)clearInterval(rainTickTimer);
  if(rainToastTimer)clearTimeout(rainToastTimer);

  thaiClockTimer=null;
  rainTickTimer=null;
  rainToastTimer=null;
  rainNextAt=0;

  const screen=$("gameScreen");
  if(screen)screen.classList.remove("raining");

  const toast=$("weatherToast");
  if(toast)toast.classList.remove("show");

  setRainStatus("🌧️ ฝนผีกำลังตก","00:30");

  const topName=$("topPlayerNameButton");
  if(topName)topName.textContent="ตั้งชื่อ";
}

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
  ensureAvatarUI();
  loadAvatar();
  updateProfileName();
  startGameExtras();
  draw();ticker=setInterval(draw,1000);
}
function logout(){
  if(ticker)clearInterval(ticker);save();
  ticker=null;
  stopGameExtras();
  showAvatar("");
  $("gameScreen").classList.add("hidden");
  $("loginScreen").classList.remove("hidden");
  $("memberCode").value="";
  currentMember=null;
  state=null;
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
  $("modalContent").innerHTML=`
    <h2>เลือกเมล็ดสำหรับแปลง #${i+1}</h2>
    <div class="grid">
      ${Object.entries(CROPS).map(([k,c])=>`
        <div class="tile">
          <img
            src="${c.selectImg}"
            alt="${c.name}"
            class="seed-choice-img"
            style="
              display:block;
              width:118px;
              height:118px;
              max-width:118px;
              max-height:118px;
              object-fit:contain;
              margin:0 auto 8px;
              background:transparent;
              border:0;
              box-shadow:none;
            "
          >
          <b>${c.name}</b>
          <p>${c.ms/1000} วินาที</p>
          <button data-crop="${k}">ปลูก</button>
        </div>
      `).join("")}
    </div>
  `;

  document.querySelectorAll("[data-crop]").forEach(btn=>{
    btn.onclick=()=>{
      state.plots[i]={crop:btn.dataset.crop,at:Date.now()};
      save();
      close();
      draw();
    };
  });

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

ensureAvatarUI();
setupTopPlayerName();
setupWeatherUI();
updateThaiClock();
loadMembers();
