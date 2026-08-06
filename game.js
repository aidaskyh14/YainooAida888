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
  {id:"r1",name:"แกงเปรตลิ้นยาว",icon:"🍲",image:"01-kaeng-pret-lin-yao.png?v=1",need:{chili:8,mango:8,morning:8}},
  {id:"r2",name:"ฟักทองต้มกองกอย",icon:"🎃",image:"02-fakthong-tom-kongkoi.png?v=1",need:{pumpkin:10,cabbage:8}},
  {id:"r3",name:"ตำมรกตผีหลอก",icon:"🍓",image:"03-tam-morakot-phi-lok.png?v=1",need:{strawberry:12,chili:10,mango:8}},
  {id:"r4",name:"ยำองุ่นครู่นจิต",icon:"🍇",image:"04-yam-angun-khrun-chit.png?v=1",need:{grape:14,chili:12,morning:10}},
  {id:"r5",name:"ข้าวคลุกวิญญาณ",icon:"🍚",image:"05-khao-kluk-winyan.png?v=1",need:{cabbage:16,pumpkin:14,lychee:12,chili:10}},
  {id:"r6",name:"ลิ้นจี่น้ำแข็งหลุมศพ",icon:"🍧",image:"06-lychee-namkhaeng-lumsop.png?v=1",need:{lychee:18,grape:16,strawberry:14}},
  {id:"r7",name:"ก๋วยเตี๋ยวเปรตแตก",icon:"🍜",image:"07-kuaitiao-pret-taek.png?v=1",need:{morning:22,chili:20,cabbage:18,pumpkin:16}},
  {id:"r8",name:"น้ำปั่นคืนชีพ",icon:"🧪",image:"08-nam-pan-khuen-chip.png?v=1",need:{grape:30,strawberry:26,lychee:22,mango:18}}
];

const SHOP_ITEMS=[
  {id:"chicken",image:"01_chicken_pret.png?v=1",name:"ไก่เปรต"},
  {id:"fish",image:"02_hypno_fish.png?v=1",name:"ปลาสะกดจิต"},
  {id:"pig",image:"03_ghost_pig.png?v=1",name:"หมูผี"},
  {id:"cow",image:"04_spirit_cow.png?v=1",name:"วัววิญญาณ"}
];

const SCENES={
  house:{image:"ghost-house-interior.jpg?v=1"},
  underwater:{image:"underwater-city-scene.jpg?v=1"},
  chicken:{image:"01_chicken_coop.jpg?v=1"},
  fish:{image:"02_fish_pond.jpg?v=1"},
  pig:{image:"03_pig_pen.jpg?v=1"},
  cow:{image:"04_cow_barn.jpg?v=1"}
};

const REST_DURATIONS={sleep:7*60*60*1000,nap:2*60*60*1000};

const FARM_MODES={
  original:{name:"ดั้งเดิม",emoji:"🌿",image:"farm-page-template.jpeg?v=4"},
  haunted:{name:"กลางคืนหลอน",emoji:"🌙",image:"farm-mode-haunted-night.png?v=1"},
  winter:{name:"ฤดูหนาว",emoji:"❄️",image:"farm-mode-winter.png?v=1"},
  festival:{name:"งานวัดผี",emoji:"🏮",image:"farm-mode-ghost-festival.png?v=1"}
};

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
let sceneTimer=null;
let currentScene=null;

function emptyPlot(){return{crop:null,at:null}}
function stateKey(){return currentMember?`yainoo-v5:${currentMember}`:null}
function avatarKey(){return currentMember?`yainoo-avatar-v1:${currentMember}`:null}
function profileNameKey(){return currentMember?`yainoo-profile-name-v1:${currentMember}`:null}
function topPlayerNameKey(){return currentMember?`yainoo-top-player-name-v1:${currentMember}`:null}
function farmModeKey(){return currentMember?`yainoo-farm-mode-v1:${currentMember}`:null}

function recipeById(id){return RECIPES.find(recipe=>recipe.id===id)||null}
function animalById(id){return SHOP_ITEMS.find(item=>item.id===id)||null}
function clearExpiredRest(){
  if(state&&Number(state.restUntil)>0&&Number(state.restUntil)<=Date.now()){
    state.restUntil=0;
    state.restType=null;
    save();
  }
}
function isResting(){clearExpiredRest();return Boolean(state&&Number(state.restUntil)>Date.now())}
function formatLongCountdown(milliseconds){
  const total=Math.max(0,Math.ceil(milliseconds/1000));
  const hours=Math.floor(total/3600);
  const minutes=Math.floor((total%3600)/60);
  const seconds=total%60;
  return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}
function guardResting(){
  if(!isResting())return false;
  const label=state.restType==="nap"?"กำลังงีบ":"กำลังนอน";
  message(`⏳ ${label}`,`เหลือเวลา ${formatLongCountdown(state.restUntil-Date.now())} ระหว่างนี้ยังไม่สามารถทำกิจกรรมในฟาร์มได้`);
  return true;
}
function dishCount(recipeId){return state?.dishes?.filter(dish=>dish&&dish.id===recipeId).length||0}

function fresh(player){
  return{
    player,
    plots:Array.from({length:PLOT_COUNT},emptyPlot),
    bag:Object.fromEntries(Object.keys(CROPS).map(k=>[k,0])),
    dishes:[],
    houseOfferings:[null,null,null],
    underwaterOffering:null,
    restUntil:0,
    restType:null
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
  normalized.houseOfferings=Array.isArray(normalized.houseOfferings)?normalized.houseOfferings.slice(0,3):[null,null,null];
  while(normalized.houseOfferings.length<3)normalized.houseOfferings.push(null);
  normalized.underwaterOffering=typeof normalized.underwaterOffering==="string"?normalized.underwaterOffering:null;
  normalized.restUntil=Number.isFinite(Number(normalized.restUntil))?Number(normalized.restUntil):0;
  normalized.restType=normalized.restType==="sleep"||normalized.restType==="nap"?normalized.restType:null;
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
  $("weatherClockEmoji").textContent=now.hour>=6&&now.hour<18?"☀️":"🌙";
}

function showForecast(){
  if(guardResting())return;
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

/* ===== โหมดฉากสวน 4 แบบ ===== */
function getSavedFarmMode(){
  const key=farmModeKey();
  const saved=key?localStorage.getItem(key):"";
  return FARM_MODES[saved]?saved:"original";
}

function applyFarmMode(mode,{persist=true}={}){
  const selected=FARM_MODES[mode]?mode:"original";
  const config=FARM_MODES[selected];
  const gameScreen=$("gameScreen");
  gameScreen.dataset.farmMode=selected;
  gameScreen.style.backgroundImage=`url("${config.image}")`;
  if(persist){
    const key=farmModeKey();
    if(key)localStorage.setItem(key,selected);
  }
}

function updateModeOverlaySelection(){
  const current=$("gameScreen").dataset.farmMode||getSavedFarmMode();
  document.querySelectorAll("[data-mode-choice]").forEach(button=>{
    const selected=button.dataset.modeChoice===current;
    button.classList.toggle("selected",selected);
    const small=button.querySelector("small");
    if(small)small.textContent=selected?"กำลังใช้งาน":({original:"สวนปัจจุบัน",haunted:"สวนรัตติกาล",winter:"สวนหิมะ",festival:"สวนเทศกาล"}[button.dataset.modeChoice]||"แตะเพื่อเปลี่ยน");
  });
}

function showModeChooser(){
  if(guardResting())return;
  updateModeOverlaySelection();
  $("modeOverlay").classList.remove("hidden");
}

function closeModeChooser(){
  $("modeOverlay").classList.add("hidden");
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
  applyFarmMode(getSavedFarmMode(),{persist:false});
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
  if(guardResting())return;
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
  if(guardResting())return;
  $("modalContent").innerHTML=`<h2>🎒 กระเป๋า</h2><div class="list">${Object.entries(CROPS).map(([key,crop])=>`<div class="row"><span>${crop.icon} ${crop.name}</span><b>×${state.bag[key]||0}</b></div>`).join("")}</div>`;
  openModal();
}


/* ===== ร้านค้า / ภารกิจ / เพื่อน ===== */
function showShop(){
  if(guardResting())return;
  $("modalContent").innerHTML=`
    <section class="feature-panel shop-panel">
      <button id="stableEntranceBtn" class="stable-entrance-button" type="button">ทางเข้าโรงเรือน</button>
      <h2>🕯️ ร้านค้าสัตว์วิญญาณ</h2>
      <p class="feature-subtitle">สัตว์จากอีกภพกำลังรอเจ้าของ</p>
      <div class="shop-grid">
        ${SHOP_ITEMS.map(item=>`
          <article class="shop-card">
            <img class="shop-animal-img" src="${item.image}" alt="${item.name}">
            <b>${item.name}</b>
            <button class="shop-worship-button" type="button" data-shop-worship="${item.id}">บูชา</button>
          </article>`).join("")}
      </div>
    </section>`;
  $("stableEntranceBtn").onclick=()=>{closeModal();openScene("chicken")};
  document.querySelectorAll("[data-shop-worship]").forEach(button=>{
    button.onclick=()=>message("บูชาสัตว์วิญญาณ","แจ้งให้ยัยหนูทราบแล้วเรียบร้อย");
  });
  openModal();
}

function showMissions(){
  if(guardResting())return;
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
  if(guardResting())return;
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

function showHouseChoices(){
  $("modalContent").innerHTML=`
    <section class="feature-panel scene-choice-panel">
      <div class="scene-choice-icon" aria-hidden="true">🏠</div>
      <h2>ประตูบ้านผี</h2>
      <div class="scene-choice-actions">
        <button id="enterHouseBtn" class="primary-spooky-action" type="button">เข้าบ้าน</button>
        <button id="closeHouseChoiceBtn" class="secondary-action" type="button">กดเล่นเฉยๆว่าง</button>
      </div>
    </section>`;
  $("enterHouseBtn").onclick=()=>{closeModal();openScene("house")};
  $("closeHouseChoiceBtn").onclick=closeModal;
  openModal();
}

function showWellChoices(){
  if(guardResting())return;
  $("modalContent").innerHTML=`
    <section class="feature-panel scene-choice-panel">
      <div class="scene-choice-icon" aria-hidden="true">🕳️</div>
      <h2>บ่อน้ำผี</h2>
      <div class="scene-choice-actions">
        <button id="enterUnderworldBtn" class="primary-spooky-action" type="button">ลงใต้บาดาล</button>
        <button id="closeWellChoiceBtn" class="secondary-action" type="button">กดเล่นเฉยๆว่าง</button>
      </div>
    </section>`;
  $("enterUnderworldBtn").onclick=()=>{closeModal();openScene("underwater")};
  $("closeWellChoiceBtn").onclick=closeModal;
  openModal();
}

function setSceneNav({backText="",backAction=null,nextText="",nextAction=null}={}){
  const back=$("sceneBackBtn");
  const next=$("sceneNextBtn");
  back.classList.toggle("hidden",!backText);
  next.classList.toggle("hidden",!nextText);
  back.textContent=backText;
  next.textContent=nextText;
  back.onclick=backAction;
  next.onclick=nextAction;
}

function stopSceneTimer(){if(sceneTimer)clearInterval(sceneTimer);sceneTimer=null}
function openScene(sceneName){
  if(!SCENES[sceneName])return;
  currentScene=sceneName;
  stopSceneTimer();
  $("gameScreen").classList.add("hidden");
  $("sceneScreen").classList.remove("hidden");
  $("sceneScreen").dataset.scene=sceneName;
  $("sceneScreen").style.backgroundImage=`url("${SCENES[sceneName].image}")`;
  renderScene();
}

function returnToFarm(){
  stopSceneTimer();
  currentScene=null;
  closeModal();
  $("sceneScreen").classList.add("hidden");
  $("gameScreen").classList.remove("hidden");
}

function renderScene(){
  if(currentScene==="house"){renderHouseScene();return}
  if(currentScene==="underwater"){renderUnderwaterScene();return}
  renderAnimalScene(currentScene);
}

function renderHouseScene(){
  setSceneNav({backText:"กลับแปลงผัก",backAction:returnToFarm});
  const resting=isResting();
  $("sceneInteractiveLayer").innerHTML=`
    <button id="bedHotspot" class="bed-hotspot" type="button" aria-label="เตียงนอน">
      <span id="bedCountdown" class="bed-countdown">${resting?formatLongCountdown(state.restUntil-Date.now()):"แตะเตียง"}</span>
    </button>
    <div class="house-altar-slots">
      ${state.houseOfferings.map((recipeId,index)=>{
        const recipe=recipeById(recipeId);
        return `<button class="offering-slot" type="button" data-house-offering="${index}" aria-label="เลือกอาหารช่องที่ ${index+1}" ${resting?"disabled":""}>${recipe?`<img src="${recipe.image}" alt="${recipe.name}">`:"<span>+</span>"}</button>`;
      }).join("")}
    </div>
    <button id="startGhostWorshipBtn" class="scene-action-button house-worship-button" type="button" ${resting?"disabled":""}>เริ่มบูชาผี</button>`;
  $("bedHotspot").onclick=showRestOptions;
  if(!resting){
    document.querySelectorAll("[data-house-offering]").forEach(button=>{
      button.onclick=()=>showDishPicker("house",Number(button.dataset.houseOffering));
    });
    $("startGhostWorshipBtn").onclick=()=>{
      if(!state.houseOfferings.some(Boolean)){message("ยังเริ่มบูชาไม่ได้","กรุณาเลือกอาหารอย่างน้อย 1 เมนูก่อน");return}
      message("เริ่มบูชาผี","จัดอาหารบนแท่นบูชาเรียบร้อยแล้ว");
    };
  }
  if(resting){
    sceneTimer=setInterval(()=>{
      clearExpiredRest();
      if(!isResting()){stopSceneTimer();renderHouseScene();return}
      const countdown=$("bedCountdown");
      if(countdown)countdown.textContent=formatLongCountdown(state.restUntil-Date.now());
    },1000);
  }
}

function showRestOptions(){
  if(isResting()){
    message(state.restType==="nap"?"กำลังงีบ":"กำลังนอน",`เหลือเวลา ${formatLongCountdown(state.restUntil-Date.now())}`);
    return;
  }
  $("modalContent").innerHTML=`
    <section class="feature-panel rest-choice-panel">
      <h2>🛏️ โหมดการนอน</h2>
      <div class="rest-choice-actions">
        <button type="button" data-rest-choice="sleep"><b>นอน</b><small>7 ชั่วโมง</small></button>
        <button type="button" data-rest-choice="nap"><b>งีบ</b><small>2 ชั่วโมง</small></button>
      </div>
    </section>`;
  document.querySelectorAll("[data-rest-choice]").forEach(button=>button.onclick=()=>showRestConfirmation(button.dataset.restChoice));
  openModal();
}

function showRestConfirmation(type){
  const isNap=type==="nap";
  const warning=isNap
    ?"ในระหว่างที่คุณงีบ คุณจะไม่สามารถทำกิจกรรมอะไรในฟาร์มได้จนกว่าเวลาจะครบ"
    :"ระหว่างการเข้านอนจะไม่สามารถทำกิจกรรมใดใดในฟาร์มได้เลย จนกว่าระยะเวลาจะครบ";
  $("modalContent").innerHTML=`
    <section class="feature-panel important-warning-panel">
      <div class="warning-symbol">⚠️</div>
      <h2>${isNap?"ยืนยันการงีบ 2 ชั่วโมง":"ยืนยันการนอน 7 ชั่วโมง"}</h2>
      <p>${warning}</p>
      <div class="confirm-actions">
        <button id="confirmRestBtn" class="danger-action" type="button">ยืนยัน</button>
        <button id="cancelRestBtn" class="secondary-action" type="button">${isNap?"ไม่งีบดีกว่า":"ไม่นอนดีกว่า"}</button>
      </div>
    </section>`;
  $("confirmRestBtn").onclick=()=>{
    state.restType=type;
    state.restUntil=Date.now()+REST_DURATIONS[type];
    save();
    closeModal();
    renderHouseScene();
  };
  $("cancelRestBtn").onclick=closeModal;
}

function renderUnderwaterScene(){
  setSceneNav({backText:"กลับแปลงผัก",backAction:returnToFarm});
  const recipe=recipeById(state.underwaterOffering);
  $("sceneInteractiveLayer").innerHTML=`
    <button id="underwaterOfferingSlot" class="underwater-offering-slot offering-slot" type="button" aria-label="เลือกเสบียงให้เจ้าแม่">${recipe?`<img src="${recipe.image}" alt="${recipe.name}">`:"<span>+</span>"}</button>
    <button id="sendUnderwaterSupplyBtn" class="scene-action-button underwater-send-button" type="button">ส่งเสบียงให้เจ้าแม่</button>`;
  $("underwaterOfferingSlot").onclick=()=>showDishPicker("underwater",0);
  $("sendUnderwaterSupplyBtn").onclick=()=>{
    if(!state.underwaterOffering){message("ยังส่งเสบียงไม่ได้","กรุณาเลือกอาหารก่อน");return}
    message("ส่งเสบียงให้เจ้าแม่","จัดเตรียมเสบียงให้เจ้าแม่เมืองบาดาลเรียบร้อยแล้ว");
  };
}

function showDishPicker(target,index){
  const available=RECIPES.filter(recipe=>dishCount(recipe.id)>0);
  if(!available.length){message("ยังไม่มีอาหาร","ต้องคราฟอาหารสำเร็จก่อนจึงจะนำมาวางได้");return}
  $("modalContent").innerHTML=`
    <section class="feature-panel dish-picker-panel">
      <h2>เลือกอาหารที่มี</h2>
      <div class="dish-picker-grid">
        ${available.map(recipe=>`<button type="button" data-pick-dish="${recipe.id}"><img src="${recipe.image}" alt="${recipe.name}"><b>${recipe.name}</b><small>มี ×${dishCount(recipe.id)}</small></button>`).join("")}
      </div>
    </section>`;
  document.querySelectorAll("[data-pick-dish]").forEach(button=>{
    button.onclick=()=>{
      if(target==="house")state.houseOfferings[index]=button.dataset.pickDish;
      else state.underwaterOffering=button.dataset.pickDish;
      save();
      closeModal();
      renderScene();
    };
  });
  openModal();
}

const ANIMAL_SLOT_POSITIONS=[
  [11,37],[42,37],[73,37],
  [11,50.5],[42,50.5],[73,50.5],
  [11,64],[42,64],[73,64]
];

function renderAnimalScene(sceneName){
  const nav={
    chicken:{backText:"กลับแปลงผัก",backAction:returnToFarm,nextText:"คอกต่อไป",nextAction:()=>openScene("fish")},
    fish:{backText:"กลับไปที่คอกไก่",backAction:()=>openScene("chicken"),nextText:"คอกต่อไป",nextAction:()=>openScene("pig")},
    pig:{backText:"กลับไปที่บ่อปลา",backAction:()=>openScene("fish"),nextText:"คอกต่อไป",nextAction:()=>openScene("cow")},
    cow:{nextText:"กลับไปที่แปลงผัก",nextAction:returnToFarm}
  }[sceneName]||{};
  setSceneNav(nav);
  $("sceneInteractiveLayer").innerHTML=`<div class="animal-slots">${ANIMAL_SLOT_POSITIONS.map(([left,top],index)=>`<button class="animal-add-slot" type="button" data-animal-slot="${index}" style="left:${left}%;top:${top}%" aria-label="เพิ่มสัตว์ช่องที่ ${index+1}">+</button>`).join("")}</div>`;
  document.querySelectorAll("[data-animal-slot]").forEach(button=>button.onclick=showAnimalApprovalChoices);
}

function showAnimalApprovalChoices(){
  $("modalContent").innerHTML=`
    <section class="feature-panel animal-picker-panel">
      <h2>เลือกสัตว์วิญญาณ</h2>
      <div class="animal-picker-grid">
        ${SHOP_ITEMS.map(item=>`<button type="button" data-pick-animal="${item.id}"><img src="${item.image}" alt="${item.name}"><b>${item.name}</b></button>`).join("")}
      </div>
    </section>`;
  document.querySelectorAll("[data-pick-animal]").forEach(button=>{
    button.onclick=()=>message("สัตว์วิญญาณ","ต้องได้รับการอนุมัติจากยัยหนูก่อนน๊า");
  });
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
function ingredientText(recipe){return Object.entries(recipe.need).map(([key,count])=>`<span>${CROPS[key].icon} ${CROPS[key].name} ×${count}</span>`).join("")}
function kitchen(){
  if(guardResting())return;
  $("modalContent").innerHTML=`
    <section class="feature-panel recipe-catalog-panel">
      <h2>📖 สมุดเมนูอาหาร</h2>
      <div class="recipe-catalog-grid">
        ${RECIPES.map(recipe=>`
          <article class="recipe-card">
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.icon} ${recipe.name}</h3>
            <div class="recipe-needs">${ingredientText(recipe)}</div>
            <button type="button" data-confirm-craft="${recipe.id}">คราฟ</button>
          </article>`).join("")}
      </div>
    </section>`;
  document.querySelectorAll("[data-confirm-craft]").forEach(button=>button.onclick=()=>confirmCraft(button.dataset.confirmCraft));
  openModal();
}

function confirmCraft(id){
  const recipe=recipeById(id);
  if(!recipe)return;
  $("modalContent").innerHTML=`
    <section class="feature-panel craft-warning-panel">
      <img src="${recipe.image}" alt="${recipe.name}">
      <h2>${recipe.name}</h2>
      <p>หากคราฟสำเร็จ คุณจะได้รับแต้มกุศล หากคราฟไม่สำเร็จ วัตถุดิบที่ใช้ครั้งนี้ก็จะสูญเปล่า</p>
      <div class="confirm-actions">
        <button id="confirmCraftBtn" class="danger-action" type="button">ยืนยัน</button>
        <button id="cancelCraftBtn" class="secondary-action" type="button">ไม่คราฟค่ะพี่ป๊อด</button>
      </div>
    </section>`;
  $("confirmCraftBtn").onclick=()=>{
    if(!can(recipe)){message("วัตถุดิบไม่ครบ",`ยังไม่สามารถคราฟ ${recipe.name} ได้`);return}
    craft(id);
  };
  $("cancelCraftBtn").onclick=kitchen;
}

function craft(id){
  const recipe=recipeById(id);
  if(!recipe||!can(recipe))return;
  Object.entries(recipe.need).forEach(([key,count])=>state.bag[key]-=count);
  state.dishes.push({id:recipe.id,name:recipe.name,image:recipe.image,time:new Date().toLocaleString("th-TH")});
  save();
  $("modalContent").innerHTML=`<section class="feature-panel craft-success-panel"><h2>คราฟสำเร็จ!</h2><img src="${recipe.image}" alt="${recipe.name}"><h3>${recipe.name}</h3><p>อาหารเพิ่มลงในรายการอาหารที่มีแล้ว ×1</p></section>`;
}

/* ===== เข้าและออกเกม ===== */
function start(){
  const member=$("memberSelect").value;
  const code=$("memberCode").value.trim();
  if(MEMBERS[member]!==code){$("loginError").textContent="ชื่อสมาชิกหรือรหัสไม่ถูกต้อง";return}
  currentMember=member;
  state=load(member);
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
  $("sceneScreen").classList.add("hidden");
  stopSceneTimer();
  currentScene=null;
  $("loginScreen").classList.remove("hidden");
  $("memberCode").value="";
  currentMember=null;
  state=null;
}

function showHow(){message("วิธีเล่น","แตะแปลงว่างเพื่อเลือกเมล็ด แตะแปลงที่โตเต็มวัยเพื่อเก็บเกี่ยว ตอนนี้ปลูกได้ครบทั้ง 12 แปลง")}
function showMenu(){kitchen()}
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
  $("modeBtn").onclick=showModeChooser;
  $("closeModeOverlay").onclick=closeModeChooser;
  $("modeOverlay").onclick=event=>{if(event.target===$("modeOverlay"))closeModeChooser()};
  document.querySelectorAll("[data-mode-choice]").forEach(button=>{
    button.onclick=()=>{
      const mode=button.dataset.modeChoice;
      applyFarmMode(mode);
      closeModeChooser();
      showWeatherToast(`เปลี่ยนเป็นโหมด ${FARM_MODES[mode].name} แล้ว`);
    };
  });
  $("houseHotspot").onclick=showHouseChoices;
  $("wellHotspot").onclick=showWellChoices;
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
