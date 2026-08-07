let MEMBERS={
  "Kung A":"KUNG2481","Ar Jane":"JANE7314","Blotto Bier":"BIER4826","Mameaw":"MEAW5937",
  "Para":"PARA1642","Porpla":"PORP8753","Pukkie":"PUKK3491","Opor":"OPOR6284",
  "Tangtang":"TANG9165","Sa":"SA4728","Earn":"EARN5831","Mhai":"MHAI7046",
  "Gigs Gee":"GIGS2619","Aimme":"AIMM8357","Phon":"PHON1948","Hana":"HANA5273",
  "Kongkwan":"KONG6482","Noona":"NOON3196","Aida":"YAINOO88"
};

const CROPS={
  morning:{name:"ผักบุ้งสะดุ้งเก่ง",icon:"🌿",selectImg:"06_startled_morning_glory.png?v=2",totalMs:25*60*1000,waterMs:8*60*1000,wormChance:0,seedImg:"morning-seed.png?v=2",sproutImg:"morning-sprout.png?v=2",growImg:"morning-grow.png?v=2",readyImg:"morning-ready.png?v=2"},
  cabbage:{name:"ผักกาดบ้านนอก",icon:"🥬",selectImg:"04_country_cabbage.png?v=2",totalMs:35*60*1000,waterMs:12*60*1000,wormChance:0,seedImg:"cabbage-seed.png?v=1",sproutImg:"cabbage-sprout.png?v=1",growImg:"cabbage-grow.png?v=1",readyImg:"cabbage-ready.png?v=1"},
  mango:{name:"มะม่วงหน้าเน่า",icon:"🥭",selectImg:"03_rotten_mango.png?v=2",totalMs:45*60*1000,waterMs:15*60*1000,wormChance:0,seedImg:"mango-seed.png?v=2",sproutImg:"mango-sprout.png?v=2",growImg:"mango-grow.png?v=2",readyImg:"mango-ready.png?v=2"},
  chili:{name:"พริกผีเปรต",icon:"🌶️",selectImg:"01_ghost_pepper.png?v=2",totalMs:55*60*1000,waterMs:18*60*1000,wormChance:.20,seedImg:"pret-chili-seed.png",sproutImg:"pret-chili-sprout.png",growImg:"pret-chili-grow.png",readyImg:"pret-chili-ready.png"},
  pumpkin:{name:"ฟักทองกองกอย",icon:"🎃",selectImg:"02_ghost_pumpkin.png?v=2",totalMs:70*60*1000,waterMs:25*60*1000,wormChance:.20,seedImg:"ghost-pumpkin-seed.png?v=1",sproutImg:"ghost-pumpkin-sprout.png?v=1",growImg:"ghost-pumpkin-grow.png?v=1",readyImg:"ghost-pumpkin-ready.png?v=1"},
  lychee:{name:"ลิ้นจี่หลีหอม",icon:"🍒",selectImg:"05_fragrant_lychee.png?v=2",totalMs:85*60*1000,waterMs:30*60*1000,wormChance:.20,seedImg:"lychee-seed.png?v=2",sproutImg:"lychee-sprout.png?v=2",growImg:"lychee-grow.png?v=2",readyImg:"lychee-ready.png?v=2"},
  strawberry:{name:"สตรอว์เบอร์รีมรกต",icon:"🍓",selectImg:"07_emerald_strawberry.png?v=1",totalMs:100*60*1000,waterMs:35*60*1000,wormChance:.20,seedImg:"emerald-strawberry-seed.png?v=1",sproutImg:"emerald-strawberry-sprout.png?v=1",growImg:"emerald-strawberry-grow.png?v=1",readyImg:"emerald-strawberry-ready.png?v=1"},
  grape:{name:"องุ่นครุ่นจิต",icon:"🍇",selectImg:"08_grape_kruenjit.png?v=1",totalMs:115*60*1000,waterMs:40*60*1000,wormChance:.20,seedImg:"grape-seed.PNG?v=1",sproutImg:"grape-sprout.PNG?v=1",growImg:"grape-grow.PNG?v=1",readyImg:"grape-ready.PNG?v=1"},
  banana:{name:"กล้วยผีตานีหาย",icon:"🍌",selectImg:"09_ghost_banana.PNG?v=1",selectFallback:"banana-ghost-seed.png?v=1",totalMs:130*60*1000,waterMs:45*60*1000,wormChance:.20,seedImg:"banana-ghost-seed.png?v=1",sproutImg:"banana-ghost-sprout.png?v=1",growImg:"banana-ghost-grow.png?v=1",readyImg:"banana-ghost-ready.png?v=1"},
  gooseberry:{name:"มะยมอมเค",icon:"🫒",selectImg:"10_star_gooseberry.PNG?v=1",selectFallback:"star-gooseberry-seed.png?v=1",totalMs:150*60*1000,waterMs:50*60*1000,wormChance:.20,seedImg:"star-gooseberry-seed.png?v=1",sproutImg:"star-gooseberry-sprout.png?v=1",growImg:"star-gooseberry-grow.png?v=1",readyImg:"star-gooseberry-ready.png?v=1"}
};

const STATUS_ICON={water:"status-water.png?v=3",worm:"status-worm.png?v=3",dead:"status-dead.png?v=3"};
const RECIPES=[
  {id:"r1",name:"แกงเปรตลิ้นยาว",icon:"🍲",image:"01-kaeng-pret-lin-yao.png?v=1",need:{chili:8,mango:8,morning:8},chance:80,reward:[1,3],difficulty:"ง่าย"},
  {id:"r2",name:"ฟักทองต้มกองกอย",icon:"🎃",image:"02-fakthong-tom-kongkoi.png?v=1",need:{pumpkin:10,cabbage:8},chance:75,reward:[1,3],difficulty:"ง่าย"},
  {id:"r3",name:"ตำมรกตผีหลอก",icon:"🍓",image:"03-tam-morakot-phi-lok.png?v=1",need:{strawberry:12,chili:10,mango:8},chance:65,reward:[5,8],difficulty:"กลาง"},
  {id:"r4",name:"ยำองุ่นครุ่นจิต",icon:"🍇",image:"04-yam-angun-khrun-chit.png?v=1",need:{grape:14,chili:12,morning:10},chance:60,reward:[5,8],difficulty:"กลาง"},
  {id:"r5",name:"ข้าวคลุกวิญญาณ",icon:"🍚",image:"05-khao-kluk-winyan.png?v=1",need:{cabbage:16,pumpkin:14,lychee:12,chili:10},chance:55,reward:[5,8],difficulty:"กลาง"},
  {id:"r6",name:"ลิ้นจี่น้ำแข็งหลุมศพ",icon:"🍧",image:"06-lychee-namkhaeng-lumsop.png?v=1",need:{lychee:18,grape:16,strawberry:14},chance:45,reward:[7,10],difficulty:"ยาก"},
  {id:"r7",name:"ก๋วยเตี๋ยวเปรตแตก",icon:"🍜",image:"07-kuaitiao-pret-taek.png?v=1",need:{morning:22,chili:20,cabbage:18,pumpkin:16},chance:35,reward:[7,10],difficulty:"ยาก"},
  {id:"r8",name:"น้ำปั่นคืนชีพ",icon:"🧪",image:"08-nam-pan-khuen-chip.png?v=1",need:{grape:30,strawberry:26,lychee:22,mango:18},chance:25,reward:[7,10],difficulty:"ยาก"},
  {id:"n1",night:true,name:"กอดทอดกอดเปรต",icon:"🍌",image:"01-kod-thot-kod-pret.png?v=1",need:{banana:2,strawberry:1},chance:65,reward:[5,8],difficulty:"กลาง"},
  {id:"n2",night:true,name:"ตำมะยมผสมกุมาร",icon:"👻",image:"02-tam-mayom-phasom-kuman.png?v=1",need:{gooseberry:2,chili:1,mango:1},chance:50,reward:[5,8],difficulty:"กลาง"},
  {id:"n3",night:true,name:"กล้วยคลุกเถ้าผี",icon:"💀",image:"03-kluai-kluk-thao-phi.png?v=1",need:{banana:3,lychee:2,grape:1},chance:35,reward:[7,10],difficulty:"ยาก"},
  {id:"n4",night:true,name:"ยำมะยมสมน้ำหน้า",icon:"🥗",image:"04-yam-mayom-som-nam-na.png?v=1",need:{gooseberry:3,chili:2,morning:1,banana:1},chance:25,reward:[7,10],difficulty:"ยาก"}
];

const SHOP_ITEMS=[
  {id:"chicken",image:"01-chicken-ghost.png?v=1",name:"ไก่เปรต",product:"egg",productName:"ไข่เปรต",productImage:"01-pret-egg.png?v=1",productionMs:3*60*60*1000},
  {id:"fish",image:"03-pig-ghost.png?v=1",name:"ปลาสะกดจิต",product:"fishMeat",productName:"เนื้อปลาผี",productImage:"03-ghost-fish-meat.png?v=1",productionMs:90*60*1000},
  {id:"pig",image:"02-fish-ghost.png?v=1",name:"หมูผี",product:"truffle",productName:"เห็ดทรัฟเฟิลหลอน",productImage:"02-haunted-truffle.png?v=1",productionMs:6*60*60*1000},
  {id:"cow",image:"04-cow-ghost.png?v=1",name:"วัววิญญาณ",product:"milk",productName:"นมวัวอาฆาต",productImage:"04-vengeful-cow-milk.png?v=1",productionMs:5*60*60*1000}
];

const ANIMAL_PRODUCTS={
  egg:{name:"ไข่เปรต",icon:"🥚",image:"01-pret-egg.png?v=1"},
  fishMeat:{name:"เนื้อปลาผี",icon:"🐟",image:"03-ghost-fish-meat.png?v=1"},
  truffle:{name:"เห็ดทรัฟเฟิลหลอน",icon:"🍄",image:"02-haunted-truffle.png?v=1"},
  milk:{name:"นมวัวอาฆาต",icon:"🥛",image:"04-vengeful-cow-milk.png?v=1"}
};

const COCONUT_ITEMS={
  coconut10:{name:"มะพร้าวสาวเสว",image:"coconut-boost-10.png?v=1",boost:10,weight:55,chance:100,need:{egg:5,fishMeat:3},description:"เร่งการเจริญเติบโตของพืชผักชนิดใดก็ได้ 10%"},
  coconut20:{name:"มะพร้าวสาวแก่",image:"coconut-boost-20.png?v=1",boost:20,weight:28,chance:80,need:{egg:3,fishMeat:3,truffle:2},description:"เร่งการเจริญเติบโตของพืชผักชนิดใดก็ได้ 20%"},
  coconut50:{name:"มะพร้าวหาวนอน",image:"coconut-boost-50.png?v=1",boost:50,weight:14,chance:30,need:{fishMeat:10,milk:2},description:"เร่งการเจริญเติบโตของพืชผักชนิดใดก็ได้ 50%"},
  coconut100:{name:"มะพร้าวสาวไอด้า",image:"coconut-boost-100.png?v=1",boost:100,weight:3,chance:null,need:null,description:"เร่งการเจริญเติบโตของพืชผักชนิดใดก็ได้ 100%",locked:true}
};
const COCONUT_TREE_COOLDOWN=2*60*60*1000;

const SCENES={
  house:{image:"ghost-house-interior.jpg?v=1"},
  underwater:{image:"underwater-city-scene.jpg?v=1"},
  chicken:{image:"01_chicken_coop.jpg?v=1"},
  fish:{image:"02_fish_pond.jpg?v=1"},
  pig:{image:"03_pig_pen.jpg?v=1"},
  cow:{image:"04_cow_barn.jpg?v=1"},
  almsSeated:{image:"01_monks-seated-bowls.png?v=1"},
  almsBlessing:{image:"02_monks-standing-blessing.png?v=1"},
  coconut:{image:"coconut-garden-scene.png?v=1"}
};

const REST_DURATIONS={sleep:7*60*60*1000,nap:2*60*60*1000};
const REST_REWARDS={sleep:10,nap:2};
const HOUSE_WORSHIP_COOLDOWN=3*60*60*1000;
const UNDERWATER_COOLDOWN=5*60*60*1000;
const FRIENDLY_GHOST_COOLDOWN=2*60*60*1000;
const CHALLENGE_COST=5;
const CHALLENGE_DURATION=30*1000;
const ANIMAL_BONUS_INTERVAL=2*60*60*1000;
const ALMS_START_MINUTE=6*60;
const ALMS_END_MINUTE=10*60;

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
  if(member==="Aida")setTimeout(checkFirebaseAdminConnection,350);
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


/* ======================================================================
   ระบบเกมชุดใหญ่ — ใช้ฐานหน้าตาเดิมและเพิ่มเฉพาะระบบที่สั่ง
   ====================================================================== */

function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function pad2(n){return String(n).padStart(2,"0")}
function formatHM(ms){
  const total=Math.max(0,Math.ceil(ms/60000));
  return `${pad2(Math.floor(total/60))}:${pad2(total%60)}`;
}
function formatFriendlyCountdown(ms){
  const total=Math.max(0,Math.ceil(ms/60000));
  const h=Math.floor(total/60),m=total%60;
  return h>0?`${h} ชั่วโมง ${m} นาที`:`${m} นาที`;
}
function bangkokPartsFull(date=new Date()){
  const f=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
  const p=Object.fromEntries(f.formatToParts(date).filter(x=>x.type!=="literal").map(x=>[x.type,x.value]));
  return{year:+p.year,month:+p.month,day:+p.day,hour:+p.hour,minute:+p.minute,second:+p.second,dateKey:`${p.year}-${p.month}-${p.day}`};
}
function bangkokMinutesNow(){const p=bangkokPartsFull();return p.hour*60+p.minute}
function msUntilBangkokHour(targetHour){
  const now=bangkokPartsFull();
  const current=now.hour*60+now.minute+(now.second/60);
  let delta=targetHour*60-current;
  if(delta<=0)delta+=24*60;
  return Math.round(delta*60*1000);
}
function isNightCraftOpen(){
  const m=bangkokMinutesNow();
  return m>=22*60||m<2*60;
}
function msUntilNightCraft(){
  if(isNightCraftOpen()){
    const p=bangkokPartsFull();
    const mins=p.hour<2?(2*60-(p.hour*60+p.minute)):((24*60+2*60)-(p.hour*60+p.minute));
    return mins*60*1000;
  }
  return msUntilBangkokHour(22);
}
function updateMeritUI(){
  if(!state)return;
  const el=$("meritTotal");
  if(el)el.textContent=String(Number(state.merit)||0);
}
function changeMerit(delta,reason="",notify=false){
  if(!state)return 0;
  state.merit=(Number(state.merit)||0)+Number(delta||0);
  save();updateMeritUI();
  if(notify){
    const sign=delta>=0?"+":"";
    message(reason||"จำนวนกุศลเปลี่ยนแปลง",`${sign}${delta} กุศล • คงเหลือ ${state.merit}`);
  }
  return state.merit;
}
function addMerit(n,reason="",notify=false){return changeMerit(Math.abs(n),reason,notify)}
function spendMerit(n,reason="",notify=false){return changeMerit(-Math.abs(n),reason,notify)}

function emptyPlot(){return{crop:null,phase:"empty",phaseEndsAt:0,plantedAt:0,wateredAt:0,worm:false}}
function fresh(player){
  return{
    player,
    merit:300,
    plots:Array.from({length:PLOT_COUNT},emptyPlot),
    bag:Object.fromEntries(Object.keys(CROPS).map(k=>[k,0])),
    animalProducts:Object.fromEntries(Object.keys(ANIMAL_PRODUCTS).map(k=>[k,0])),
    dishes:[],
    specials:{},
    houseOfferings:[null,null,null],
    underwaterOffering:null,
    houseWorshipUntil:0,
    underwaterUntil:0,
    restUntil:0,
    restType:null,
    restRewardPending:false,
    almsOfferings:[null,null,null,null],
    lastAlmsDate:"",
    friendlyGhostUntil:0,
    challengeUntil:0,
    animalRequests:{chicken:Array(9).fill(false),fish:Array(9).fill(false),pig:Array(9).fill(false),cow:Array(9).fill(false)},
    animals:{chicken:Array(9).fill(null),fish:Array(9).fill(null),pig:Array(9).fill(null),cow:Array(9).fill(null)},
    animalBonusNextAt:Date.now()+ANIMAL_BONUS_INTERVAL
  };
}
function normalizePlot(plot){
  if(!plot||typeof plot!=="object"||!plot.crop)return emptyPlot();
  if(plot.phase)return plot;
  // แปลงเซฟเก่าที่ใช้ at ให้เป็นระบบใหม่ โดยไม่ลบพืช
  const crop=CROPS[plot.crop];
  if(!crop)return emptyPlot();
  const oldAt=Number(plot.at)||Date.now();
  const elapsed=Math.max(0,Date.now()-oldAt);
  if(elapsed>=crop.totalMs)return{crop:plot.crop,phase:"ready",phaseEndsAt:0,plantedAt:oldAt,wateredAt:oldAt+crop.waterMs,worm:false};
  if(elapsed>=crop.waterMs)return{crop:plot.crop,phase:"growing2",phaseEndsAt:Date.now()+Math.max(1000,crop.totalMs-elapsed),plantedAt:oldAt,wateredAt:oldAt+crop.waterMs,worm:false};
  return{crop:plot.crop,phase:"growing1",phaseEndsAt:oldAt+crop.waterMs,plantedAt:oldAt,wateredAt:0,worm:false};
}
function normalizeState(raw,player){
  const n=raw&&typeof raw==="object"?raw:fresh(player);
  n.player=player||n.player||"ผู้เล่น";
  if(!Number.isFinite(Number(n.merit)))n.merit=300;
  n.merit=Number(n.merit);
  n.plots=Array.isArray(n.plots)?n.plots.slice(0,PLOT_COUNT):[];
  while(n.plots.length<PLOT_COUNT)n.plots.push(emptyPlot());
  n.plots=n.plots.map(normalizePlot);
  n.bag=n.bag&&typeof n.bag==="object"?n.bag:{};
  Object.keys(CROPS).forEach(k=>{if(!Number.isFinite(Number(n.bag[k])))n.bag[k]=0;else n.bag[k]=Number(n.bag[k])});
  n.animalProducts=n.animalProducts&&typeof n.animalProducts==="object"?n.animalProducts:{};
  Object.keys(ANIMAL_PRODUCTS).forEach(k=>{if(!Number.isFinite(Number(n.animalProducts[k])))n.animalProducts[k]=0;else n.animalProducts[k]=Number(n.animalProducts[k])});
  n.dishes=Array.isArray(n.dishes)?n.dishes:[];
  n.specials=n.specials&&typeof n.specials==="object"?n.specials:{};
  n.houseOfferings=Array.isArray(n.houseOfferings)?n.houseOfferings.slice(0,3):[null,null,null];
  while(n.houseOfferings.length<3)n.houseOfferings.push(null);
  n.underwaterOffering=typeof n.underwaterOffering==="string"?n.underwaterOffering:null;
  n.houseWorshipUntil=Number(n.houseWorshipUntil)||0;
  n.underwaterUntil=Number(n.underwaterUntil)||0;
  n.restUntil=Number(n.restUntil)||0;
  n.restType=n.restType==="sleep"||n.restType==="nap"?n.restType:null;
  n.restRewardPending=Boolean(n.restRewardPending);
  n.almsOfferings=Array.isArray(n.almsOfferings)?n.almsOfferings.slice(0,4):[null,null,null,null];
  while(n.almsOfferings.length<4)n.almsOfferings.push(null);
  n.lastAlmsDate=typeof n.lastAlmsDate==="string"?n.lastAlmsDate:"";
  n.friendlyGhostUntil=Number(n.friendlyGhostUntil)||0;
  n.challengeUntil=Number(n.challengeUntil)||0;
  n.animalRequests=n.animalRequests&&typeof n.animalRequests==="object"?n.animalRequests:{};
  n.animals=n.animals&&typeof n.animals==="object"?n.animals:{};
  SHOP_ITEMS.forEach(item=>{
    if(!Array.isArray(n.animalRequests[item.id]))n.animalRequests[item.id]=Array(9).fill(false);
    n.animalRequests[item.id]=n.animalRequests[item.id].slice(0,9);while(n.animalRequests[item.id].length<9)n.animalRequests[item.id].push(false);
    if(!Array.isArray(n.animals[item.id]))n.animals[item.id]=Array(9).fill(null);
    n.animals[item.id]=n.animals[item.id].slice(0,9);while(n.animals[item.id].length<9)n.animals[item.id].push(null);
  });
  n.animalBonusNextAt=Number(n.animalBonusNextAt)||Date.now()+ANIMAL_BONUS_INTERVAL;
  return n;
}

function clearExpiredRest(){
  if(!state)return;
  if(Number(state.restUntil)>0&&Number(state.restUntil)<=Date.now()){
    if(state.restType&&state.restRewardPending){
      const reward=REST_REWARDS[state.restType]||0;
      state.restRewardPending=false;
      state.restUntil=0;
      const finishedType=state.restType;
      state.restType=null;
      state.merit=(Number(state.merit)||0)+reward;
      save();updateMeritUI();
      setTimeout(()=>showWeatherToast(`${finishedType==="nap"?"งีบครบแล้ว":"นอนครบแล้ว"} +${reward} กุศล`),50);
      return;
    }
    state.restUntil=0;state.restType=null;state.restRewardPending=false;save();
  }
}
function isResting(){clearExpiredRest();return Boolean(state&&Number(state.restUntil)>Date.now())}

function ensurePlotPhase(plot){
  if(!plot||!plot.crop)return;
  if(plot.phase==="growing1"&&Date.now()>=Number(plot.phaseEndsAt||0)){
    plot.phase="needsWater";plot.phaseEndsAt=0;save();
  }else if(plot.phase==="growing2"&&Date.now()>=Number(plot.phaseEndsAt||0)){
    plot.phase="ready";plot.phaseEndsAt=0;save();
  }
}
function stage(plot){
  if(!plot||!plot.crop)return"empty";
  ensurePlotPhase(plot);
  if(plot.phase==="ready")return"ready";
  if(plot.phase==="growing2"||plot.phase==="worm")return"grown";
  if(plot.phase==="needsWater")return"sprout";
  if(plot.phase==="growing1"){
    const crop=CROPS[plot.crop];
    const total=crop.waterMs;
    const elapsed=Math.max(0,Date.now()-Number(plot.plantedAt||Date.now()));
    return elapsed>=total*.48?"sprout":"seed";
  }
  return"seed";
}
function plotStatus(plot){
  if(!plot||!plot.crop)return null;
  ensurePlotPhase(plot);
  if(plot.phase==="needsWater")return"water";
  if(plot.phase==="worm")return"worm";
  return null;
}
function cropIcon(plot){
  if(!plot||!plot.crop)return"";
  const crop=CROPS[plot.crop],s=stage(plot);
  const src=s==="ready"?crop.readyImg:s==="grown"?crop.growImg:s==="sprout"?crop.sproutImg:crop.seedImg;
  return `<img class="crop-img stage-${s}" src="${src}" alt="${crop.name}">`;
}
function remain(plot){
  if(!plot||!plot.crop)return 0;
  ensurePlotPhase(plot);
  if(plot.phase==="needsWater"||plot.phase==="worm"||plot.phase==="ready")return 0;
  return Math.max(0,Math.ceil((Number(plot.phaseEndsAt||0)-Date.now())/1000));
}
function plotTimerText(plot){
  ensurePlotPhase(plot);
  if(plot.phase==="needsWater")return"รอรดน้ำ";
  if(plot.phase==="worm")return"มีหนอน";
  if(plot.phase==="ready")return"พร้อมเก็บ";
  const sec=remain(plot);
  const m=Math.ceil(sec/60);
  return m>=60?`${Math.floor(m/60)} ชม. ${m%60} นาที`:`${m} นาที`;
}
function draw(){
  if(!state)return;
  clearExpiredRest();
  processAnimalSystems();
  updateMeritUI();
  updateAlmsButton();
  const plots=$("plots");plots.innerHTML="";
  state.plots.forEach((plot,index)=>{
    ensurePlotPhase(plot);
    const currentStage=stage(plot),status=plotStatus(plot);
    const button=document.createElement("button");
    button.type="button";
    button.className=`plot ${currentStage} ${currentStage==="empty"?"empty":currentStage==="ready"?"ready":"growing"}`;
    const name=plot.crop?CROPS[plot.crop].name:"";
    button.innerHTML=`
      <span class="plot-no">#${index+1}</span>
      ${status?`<img class="status-badge" src="${STATUS_ICON[status]}" alt="${status}">`:""}
      <div class="plot-inner">
        <div class="crop">${cropIcon(plot)}</div>
        ${name?`<div class="crop-name">${name}</div>`:""}
        ${plot.crop?`<div class="timer">${plotTimerText(plot)}</div>`:""}
      </div>`;
    button.onclick=()=>tapPlot(index);
    plots.appendChild(button);
  });
}
function waterPlot(index){
  const plot=state.plots[index],crop=CROPS[plot.crop];
  plot.wateredAt=Date.now();
  const finalMs=Math.max(60*1000,crop.totalMs-crop.waterMs);
  if(Math.random()<Number(crop.wormChance||0)){
    plot.phase="worm";plot.worm=true;plot.phaseEndsAt=0;
    save();draw();showWeatherToast("🐛 เจอหนอนหลังรดน้ำ!");
  }else{
    plot.phase="growing2";plot.worm=false;plot.phaseEndsAt=Date.now()+finalMs;
    save();draw();showWeatherToast("💧 รดน้ำแล้ว ต้นกำลังโต");
  }
}
function clearWorm(index){
  const plot=state.plots[index],crop=CROPS[plot.crop];
  spendMerit(1,"กำจัดหนอน");
  plot.phase="growing2";plot.worm=false;
  plot.phaseEndsAt=Date.now()+Math.max(60*1000,crop.totalMs-crop.waterMs);
  save();draw();
  message("🐛 ไล่หนอนสำเร็จ",`ใช้ 1 กุศล • คงเหลือ ${state.merit} กุศล`);
}
function tapPlot(index){
  if(guardResting())return;
  const plot=state.plots[index];ensurePlotPhase(plot);
  if(!plot.crop){plantMenu(index);return}
  if(plot.phase==="needsWater"){
    $("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>💧 รดน้ำ ${CROPS[plot.crop].name}</h2><p>กดบัวรดน้ำแล้วต้นจะเข้าสู่ขั้นโตต่อไป</p><button id="waterNowBtn" class="primary-spooky-action" type="button">รดน้ำ</button></section>`;
    openModal();$("waterNowBtn").onclick=()=>{closeModal();waterPlot(index)};return;
  }
  if(plot.phase==="worm"){
    $("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>🐛 หนอนมาแล้ว</h2><p>ต้นจะหยุดโตจนกว่าจะกำจัดหนอน ใช้ 1 คะแนนกุศล<br>คะแนนสามารถติดลบได้</p><button id="clearWormBtn" class="danger-action" type="button">ใช้ 1 กุศลกำจัดหนอน</button></section>`;
    openModal();$("clearWormBtn").onclick=()=>{closeModal();clearWorm(index)};return;
  }
  if(plot.phase==="ready"){
    state.bag[plot.crop]=(state.bag[plot.crop]||0)+1;
    const name=CROPS[plot.crop].name;
    state.plots[index]=emptyPlot();save();draw();message("เก็บเกี่ยวสำเร็จ",`ได้ ${name} ×1`);return;
  }
  message("ต้นกำลังเติบโต",`${CROPS[plot.crop].name} เหลือประมาณ ${plotTimerText(plot)}`);
}
function plantMenu(index){
  $("modalContent").innerHTML=`
    <h2>เลือกเมล็ดสำหรับแปลง #${index+1}</h2>
    <div class="grid">
      ${Object.entries(CROPS).map(([key,crop])=>`
        <div class="tile spooky-seed-tile">
          <img src="${crop.selectImg}" alt="${crop.name}" class="seed-choice-img">
          <b>${crop.name}</b>
          <p>เวลาโตประมาณ ${Math.round(crop.totalMs/60000)} นาที</p>
          <button type="button" data-crop="${key}">ปลูก</button>
        </div>`).join("")}
    </div>`;
  document.querySelectorAll("[data-crop]").forEach(button=>button.onclick=()=>{
    const key=button.dataset.crop,crop=CROPS[key],now=Date.now();
    state.plots[index]={crop:key,phase:"growing1",phaseEndsAt:now+crop.waterMs,plantedAt:now,wateredAt:0,worm:false};
    save();closeModal();draw();
  });
  openModal();
}

function dishCounts(){
  const counts={};
  RECIPES.forEach(r=>counts[r.id]=dishCount(r.id));
  return counts;
}
function inventory(tab="crops"){
  if(guardResting())return;
  const dishMap=dishCounts();
  const tabs=[
    ["crops","🌱 พืชพรรณ"],["products","🐾 ผลผลิตสัตว์"],["food","🍲 อาหาร"],["specials","🕯️ ของพิเศษ"]
  ];
  let body="";
  if(tab==="crops"){
    body=Object.entries(CROPS).map(([k,c])=>`<div class="inventory-item"><img src="${c.readyImg}" alt="${c.name}"><span>${c.name}</span><b>×${state.bag[k]||0}</b></div>`).join("");
  }else if(tab==="products"){
    body=Object.entries(ANIMAL_PRODUCTS).map(([k,p])=>`<div class="inventory-item"><img src="${p.image}" alt="${p.name}"><span>${p.name}</span><b>×${state.animalProducts[k]||0}</b></div>`).join("");
  }else if(tab==="food"){
    body=RECIPES.map(r=>`<div class="inventory-item"><img src="${r.image}" alt="${r.name}"><span>${r.name}</span><b>×${dishMap[r.id]||0}</b></div>`).join("");
  }else{
    const entries=Object.entries(state.specials||{});
    body=entries.length?entries.map(([k,n])=>`<div class="inventory-item"><span>🕯️ ${k}</span><b>×${n}</b></div>`).join(""):`<p class="empty-feature">ยังไม่มีของพิเศษ</p>`;
  }
  $("modalContent").innerHTML=`
    <section class="feature-panel inventory-panel">
      <h2>🎒 กระเป๋าผี</h2>
      <div class="inventory-tabs">${tabs.map(([k,label])=>`<button type="button" data-inventory-tab="${k}" class="${k===tab?"active":""}">${label}</button>`).join("")}</div>
      <div class="inventory-grid">${body}</div>
    </section>`;
  document.querySelectorAll("[data-inventory-tab]").forEach(b=>b.onclick=()=>inventory(b.dataset.inventoryTab));
  openModal();
}

function removeDishIds(ids){
  const needed={};
  ids.filter(Boolean).forEach(id=>needed[id]=(needed[id]||0)+1);
  for(const [id,count] of Object.entries(needed)){
    if(dishCount(id)<count)return false;
  }
  for(const [id,count] of Object.entries(needed)){
    let remaining=count;
    state.dishes=state.dishes.filter(d=>{
      if(remaining>0&&d&&d.id===id){remaining--;return false}
      return true;
    });
  }
  return true;
}
function selectedDishQuantities(ids){
  const q={};ids.filter(Boolean).forEach(id=>q[id]=(q[id]||0)+1);return q;
}
function showDishPicker(target,index){
  const selected=target==="house"?state.houseOfferings:target==="alms"?state.almsOfferings:[state.underwaterOffering];
  const selectedQty=selectedDishQuantities(selected);
  const available=RECIPES.filter(r=>dishCount(r.id)>(selectedQty[r.id]||0)-(selected[index]===r.id?1:0));
  if(!available.length){message("ยังไม่มีอาหาร","ต้องคราฟอาหารสำเร็จก่อนจึงจะนำมาใช้ได้");return}
  $("modalContent").innerHTML=`
    <section class="feature-panel dish-picker-panel">
      <h2>เลือกอาหารที่มี</h2>
      <div class="dish-picker-grid">
        ${available.map(r=>`<button type="button" data-pick-dish="${r.id}"><img src="${r.image}" alt="${r.name}"><b>${r.name}</b><small>มี ×${dishCount(r.id)}</small></button>`).join("")}
      </div>
    </section>`;
  document.querySelectorAll("[data-pick-dish]").forEach(button=>button.onclick=()=>{
    if(target==="house")state.houseOfferings[index]=button.dataset.pickDish;
    else if(target==="alms")state.almsOfferings[index]=button.dataset.pickDish;
    else state.underwaterOffering=button.dataset.pickDish;
    save();closeModal();renderScene();
  });
  openModal();
}

function renderHouseScene(){
  setSceneNav({backText:"กลับแปลงผัก",backAction:returnToFarm});
  clearExpiredRest();
  const resting=isResting();
  const worshipRemaining=Math.max(0,Number(state.houseWorshipUntil||0)-Date.now());
  $("sceneInteractiveLayer").innerHTML=`
    <button id="bedHotspot" class="bed-hotspot" type="button" aria-label="เตียงนอน">
      <span id="bedCountdown" class="bed-countdown">${resting?formatLongCountdown(state.restUntil-Date.now()):"แตะเตียง"}</span>
    </button>
    <div class="house-altar-slots">
      ${state.houseOfferings.map((recipeId,index)=>{
        const recipe=recipeById(recipeId);
        return `<button class="offering-slot" type="button" data-house-offering="${index}" ${resting||worshipRemaining>0?"disabled":""}>${recipe?`<img src="${recipe.image}" alt="${recipe.name}">`:"<span>+</span>"}</button>`;
      }).join("")}
    </div>
    <button id="startGhostWorshipBtn" class="scene-action-button house-worship-button" type="button" ${resting||worshipRemaining>0?"disabled":""}>${worshipRemaining>0?`เปรตมารอรับเสบียงรอบต่อไป ${formatHM(worshipRemaining)}`:"เริ่มบูชาผี"}</button>`;
  $("bedHotspot").onclick=showRestOptions;
  if(!resting&&worshipRemaining<=0){
    document.querySelectorAll("[data-house-offering]").forEach(b=>b.onclick=()=>showDishPicker("house",Number(b.dataset.houseOffering)));
    $("startGhostWorshipBtn").onclick=()=>{
      if(state.houseOfferings.some(x=>!x)){message("ยังเริ่มบูชาไม่ได้","กรุณาเลือกอาหารให้ครบทั้ง 3 เมนู");return}
      if(!removeDishIds(state.houseOfferings)){message("อาหารไม่พอ","อาหารที่เลือกบางรายการไม่มีอยู่ในกระเป๋าแล้ว");return}
      const reward=randInt(1,5);
      state.houseOfferings=[null,null,null];
      state.houseWorshipUntil=Date.now()+HOUSE_WORSHIP_COOLDOWN;
      state.merit+=reward;save();updateMeritUI();renderHouseScene();
      message("👻 บูชาผีสำเร็จ",`เปรตได้รับเสบียงแล้ว • ได้รับ ${reward} กุศล<br>เปรตมารอรับเสบียงรอบต่อไปใน 3 ชั่วโมง`);
    };
  }
  stopSceneTimer();
  sceneTimer=setInterval(()=>{
    clearExpiredRest();
    if(currentScene!=="house"){stopSceneTimer();return}
    const needRefresh=(Number(state.houseWorshipUntil||0)>0&&Date.now()>=state.houseWorshipUntil)||(!isResting()&&resting);
    if(needRefresh){renderHouseScene();return}
    const bed=$("bedCountdown");if(bed&&isResting())bed.textContent=formatLongCountdown(state.restUntil-Date.now());
    const btn=$("startGhostWorshipBtn");
    if(btn&&Number(state.houseWorshipUntil)>Date.now())btn.textContent=`เปรตมารอรับเสบียงรอบต่อไป ${formatHM(state.houseWorshipUntil-Date.now())}`;
  },1000);
}
function showRestConfirmation(type){
  const isNap=type==="nap";
  const warning=isNap?"ในระหว่างที่คุณงีบ คุณจะไม่สามารถทำกิจกรรมอะไรในฟาร์มได้จนกว่าเวลาจะครบ":"ระหว่างการเข้านอนจะไม่สามารถทำกิจกรรมใดใดในฟาร์มได้เลย จนกว่าระยะเวลาจะครบ";
  $("modalContent").innerHTML=`
    <section class="feature-panel important-warning-panel">
      <div class="warning-symbol">⚠️</div>
      <h2>${isNap?"ยืนยันการงีบ 2 ชั่วโมง":"ยืนยันการนอน 7 ชั่วโมง"}</h2>
      <p>${warning}</p>
      <p><b>เมื่อครบเวลาได้รับ ${REST_REWARDS[type]} กุศล</b></p>
      <div class="confirm-actions"><button id="confirmRestBtn" class="danger-action" type="button">ยืนยัน</button><button id="cancelRestBtn" class="secondary-action" type="button">${isNap?"ไม่งีบดีกว่า":"ไม่นอนดีกว่า"}</button></div>
    </section>`;
  $("confirmRestBtn").onclick=()=>{
    state.restType=type;state.restUntil=Date.now()+REST_DURATIONS[type];state.restRewardPending=true;
    save();closeModal();renderHouseScene();
  };
  $("cancelRestBtn").onclick=closeModal;
}

function renderUnderwaterScene(){
  setSceneNav({backText:"กลับแปลงผัก",backAction:returnToFarm});
  const remaining=Math.max(0,Number(state.underwaterUntil||0)-Date.now());
  const recipe=recipeById(state.underwaterOffering);
  $("sceneInteractiveLayer").innerHTML=`
    <button id="underwaterOfferingSlot" class="underwater-offering-slot offering-slot" type="button" ${remaining>0?"disabled":""}>${recipe?`<img src="${recipe.image}" alt="${recipe.name}">`:"<span>+</span>"}</button>
    <button id="sendUnderwaterSupplyBtn" class="scene-action-button underwater-send-button" type="button" ${remaining>0?"disabled":""}>${remaining>0?`ส่งเสบียงได้อีกครั้งใน ${formatHM(remaining)}`:"ส่งเสบียงให้เจ้าแม่"}</button>`;
  if(remaining<=0){
    $("underwaterOfferingSlot").onclick=()=>showDishPicker("underwater",0);
    $("sendUnderwaterSupplyBtn").onclick=()=>{
      if(!state.underwaterOffering){message("ยังส่งเสบียงไม่ได้","กรุณาเลือกอาหารก่อน");return}
      if(!removeDishIds([state.underwaterOffering])){message("อาหารไม่พอ","อาหารรายการนี้ไม่มีอยู่ในกระเป๋าแล้ว");return}
      const reward=randInt(1,3);
      state.underwaterOffering=null;state.underwaterUntil=Date.now()+UNDERWATER_COOLDOWN;state.merit+=reward;
      save();updateMeritUI();renderUnderwaterScene();
      message("🫧 เจ้าแม่ได้รับเสบียงแล้ว",`ขอบใจชาวสวนมาก<br>เจ้าแม่มีอะไรจะให้ปลอบใจ +${reward} คะแนนแต้มกุศล`);
    };
  }
  stopSceneTimer();
  sceneTimer=setInterval(()=>{
    if(currentScene!=="underwater"){stopSceneTimer();return}
    if(Number(state.underwaterUntil||0)>0&&Date.now()>=state.underwaterUntil){state.underwaterUntil=0;save();renderUnderwaterScene();return}
    const b=$("sendUnderwaterSupplyBtn");
    if(b&&state.underwaterUntil>Date.now())b.textContent=`ส่งเสบียงได้อีกครั้งใน ${formatHM(state.underwaterUntil-Date.now())}`;
  },60000);
}

function updateAlmsButton(){
  const btn=$("almsBtn");if(!btn)return;
  const small=btn.querySelector("small");
  const p=bangkokPartsFull(),mins=p.hour*60+p.minute;
  const done=state&&state.lastAlmsDate===p.dateKey;
  if(done){small.textContent=`ใส่บาตรวันนี้แล้ว • รอบใหม่ ${formatHM(msUntilBangkokHour(6))}`;return}
  if(mins>=ALMS_START_MINUTE&&mins<ALMS_END_MINUTE){small.textContent=`พระกำลังบิณฑบาต • เหลือ ${formatHM((ALMS_END_MINUTE-mins)*60000)}`;return}
  small.textContent=`พระมารอบต่อไปใน ${formatHM(msUntilBangkokHour(6))}`;
}
function showAlms(){
  if(guardResting())return;
  openScene("almsSeated");
}
function renderAlmsScene(){
  setSceneNav({nextText:"กลับไปที่แปลงผัก",nextAction:returnToFarm});
  const p=bangkokPartsFull(),mins=p.hour*60+p.minute,done=state.lastAlmsDate===p.dateKey;
  const open=mins>=ALMS_START_MINUTE&&mins<ALMS_END_MINUTE&&!done;
  if(done){
    $("sceneScreen").style.backgroundImage=`url("${SCENES.almsBlessing.image}")`;
    $("sceneInteractiveLayer").innerHTML=`<div class="alms-result-card"><b>🙏 วันนี้ใส่บาตรเรียบร้อยแล้ว</b><span>พระมาบิณฑบาตรอบต่อไปใน ${formatHM(msUntilBangkokHour(6))}</span></div>`;
  }else if(!open){
    $("sceneScreen").style.backgroundImage=`url("${SCENES.almsSeated.image}")`;
    const text=mins>=ALMS_END_MINUTE?"วันนี้พระกลับวัดแล้ว":"พระยังไม่มาบิณฑบาต";
    $("sceneInteractiveLayer").innerHTML=`<div class="alms-result-card"><b>${text}</b><span>พระมาบิณฑบาตรอบต่อไปใน ${formatHM(msUntilBangkokHour(6))}</span></div>`;
  }else{
    $("sceneScreen").style.backgroundImage=`url("${SCENES.almsSeated.image}")`;
    $("sceneInteractiveLayer").innerHTML=`
      <div class="alms-slots">${state.almsOfferings.map((id,i)=>{const r=recipeById(id);return `<button class="alms-offering-slot offering-slot" data-alms-slot="${i}" type="button">${r?`<img src="${r.image}" alt="${r.name}">`:"<span>+</span>"}</button>`}).join("")}</div>
      <button id="giveAlmsBtn" class="scene-action-button alms-give-button" type="button">ใส่บาตร</button>`;
    document.querySelectorAll("[data-alms-slot]").forEach(b=>b.onclick=()=>showDishPicker("alms",Number(b.dataset.almsSlot)));
    $("giveAlmsBtn").onclick=()=>{
      if(state.almsOfferings.some(x=>!x)){message("ยังใส่บาตรไม่ได้","กรุณาใส่อาหารให้ครบทั้ง 4 บาตร");return}
      if(!removeDishIds(state.almsOfferings)){message("อาหารไม่พอ","อาหารที่เลือกบางรายการไม่มีอยู่ในกระเป๋าแล้ว");return}
      const reward=randInt(1,5);
      state.almsOfferings=[null,null,null,null];state.lastAlmsDate=p.dateKey;state.merit+=reward;
      save();updateMeritUI();renderAlmsScene();
      message("🙏 ใส่บาตรเรียบร้อย",`พระให้พรแก่ชาวสวน • ได้รับ ${reward} กุศล`);
    };
  }
  stopSceneTimer();sceneTimer=setInterval(()=>{if(currentScene==="almsSeated"||currentScene==="almsBlessing")renderAlmsScene()},60000);
}
function renderScene(){
  if(currentScene==="house"){renderHouseScene();return}
  if(currentScene==="underwater"){renderUnderwaterScene();return}
  if(currentScene==="almsSeated"||currentScene==="almsBlessing"){renderAlmsScene();return}
  renderAnimalScene(currentScene);
}

function challengeFarm(){
  if(guardResting())return;
  if((Number(state.merit)||0)<CHALLENGE_COST){message("กุศลไม่พอ",`ท้าทายภูติผีต้องใช้ ${CHALLENGE_COST} กุศล`);return}
  const active=state.plots.some(p=>{ensurePlotPhase(p);return p.crop&&(p.phase==="growing1"||p.phase==="growing2")});
  if(!active){message("ยังท้าทายไม่ได้","ตอนนี้ไม่มีพืชที่กำลังเติบโต");return}
  $("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>👻 ท้าทายภูติผี</h2><p>ใช้ 5 กุศล • สุ่มฝน หมอกผี หิ่งห้อย หรือดาวตก 30 วินาที<br>และลดเวลาที่เหลือของพืชที่กำลังโต 10%</p><div class="confirm-actions"><button id="confirmChallengeBtn" class="danger-action" type="button">เริ่มท้าทาย</button><button id="cancelChallengeBtn" class="secondary-action" type="button">ยกเลิก</button></div></section>`;
  openModal();
  $("confirmChallengeBtn").onclick=()=>{closeModal();startChallengeEffect()};
  $("cancelChallengeBtn").onclick=closeModal;
}
function startChallengeEffect(){
  spendMerit(CHALLENGE_COST,"ท้าทายภูติผี");
  state.plots.forEach(p=>{
    ensurePlotPhase(p);
    if(p.crop&&(p.phase==="growing1"||p.phase==="growing2")){
      const rem=Math.max(0,p.phaseEndsAt-Date.now());
      p.phaseEndsAt=Date.now()+Math.round(rem*.90);
    }
  });
  const effects=["rain","fog","fireflies","shootingstar"];
  const effect=effects[Math.floor(Math.random()*effects.length)];
  const game=$("gameScreen"),fx=$("challengeFx");
  game.classList.remove("challenge-rain");fx.className="challenge-fx";
  if(effect==="rain")game.classList.add("challenge-rain");
  else fx.classList.add(`fx-${effect}`,"show");
  showWeatherToast({rain:"🌧️ ฝนภูติ",fog:"👻 หมอกผี",fireflies:"✨ หิ่งห้อย",shootingstar:"🌠 ดาวตก"}[effect]+" • พืชเร็วขึ้น 10%");
  save();draw();
  setTimeout(()=>{game.classList.remove("challenge-rain");fx.className="challenge-fx hidden"},CHALLENGE_DURATION);
}

function friendlyGhostReward(){
  if(guardResting())return;
  const remain=Math.max(0,Number(state.friendlyGhostUntil||0)-Date.now());
  if(remain>0){message("👻 กดบ่อยเกินไปค่ะแม่ รอก่อน",`ผีน้อยใจดีมาแจกของได้อีกใน ${formatFriendlyCountdown(remain)}`);return}
  const qty=randInt(1,2);
  const pool=[
    ...Object.keys(CROPS).map(k=>({type:"crop",key:k,name:CROPS[k].name})),
    ...Object.keys(ANIMAL_PRODUCTS).map(k=>({type:"product",key:k,name:ANIMAL_PRODUCTS[k].name})),
    ...RECIPES.map(r=>({type:"dish",key:r.id,name:r.name})),
    {type:"merit",key:"merit",name:"กุศล"}
  ];
  const prize=pool[Math.floor(Math.random()*pool.length)];
  if(prize.type==="crop")state.bag[prize.key]=(state.bag[prize.key]||0)+qty;
  if(prize.type==="product")state.animalProducts[prize.key]=(state.animalProducts[prize.key]||0)+qty;
  if(prize.type==="dish"){const r=recipeById(prize.key);for(let i=0;i<qty;i++)state.dishes.push({id:r.id,name:r.name,image:r.image,time:new Date().toLocaleString("th-TH")})}
  if(prize.type==="merit")state.merit+=qty;
  state.friendlyGhostUntil=Date.now()+FRIENDLY_GHOST_COOLDOWN;
  save();updateMeritUI();
  message("👻 ผีน้อยใจดี",`รับ ${qty}x ${prize.name}`);
}

function showShop(){
  if(guardResting())return;
  $("modalContent").innerHTML=`
    <section class="feature-panel shop-panel">
      <button id="stableEntranceBtn" class="stable-entrance-button" type="button">ทางเข้าโรงเรือน</button>
      <h2>🕯️ ร้านค้าสัตว์วิญญาณ</h2>
      <p class="feature-subtitle">สัตว์จากอีกภพกำลังรอเจ้าของ</p>
      <div class="shop-grid">${SHOP_ITEMS.map(item=>`<article class="shop-card"><img class="shop-animal-img" src="${item.image}" alt="${item.name}"><b>${item.name}</b><button class="shop-worship-button" type="button" data-shop-worship="${item.id}">บูชา</button></article>`).join("")}</div>
    </section>`;
  $("stableEntranceBtn").onclick=()=>{closeModal();openScene("chicken")};
  document.querySelectorAll("[data-shop-worship]").forEach(button=>button.onclick=()=>message("บูชาสัตว์วิญญาณ","แจ้งให้ยัยหนูทราบแล้วเรียบร้อย"));
  openModal();
}
function showAnimalApprovalChoices(sceneName,slotIndex){
  const item=animalById(sceneName);if(!item)return;
  if(state.animalRequests[sceneName][slotIndex]){message("🐾 คำขอถูกส่งแล้ว","ส่งคำขอเรียบร้อยแล้ว");return}
  $("modalContent").innerHTML=`<section class="feature-panel animal-picker-panel"><h2>${item.name}</h2><div class="animal-picker-grid single-animal-choice"><button id="requestAnimalBtn" type="button"><img src="${item.image}" alt="${item.name}"><b>${item.name}</b><small>ต้องได้รับการอนุมัติจากยัยหนูก่อนน๊า</small></button></div></section>`;
  openModal();
  $("requestAnimalBtn").onclick=()=>{
    state.animalRequests[sceneName][slotIndex]=true;save();closeModal();renderAnimalScene(sceneName);message("🐾 สัตว์วิญญาณ","ส่งคำขอเรียบร้อยแล้ว");
  };
}
function animalSlotHTML(sceneName,index){
  const item=animalById(sceneName);
  const animal=state.animals[sceneName][index];
  const pending=state.animalRequests[sceneName][index];
  if(animal){
    const remaining=Math.max(0,Number(animal.readyAt||0)-Date.now());
    const ready=remaining<=0;
    return `<button class="animal-owned-slot ${ready?"product-ready":""}" data-owned-animal="${index}" style="left:${ANIMAL_SLOT_POSITIONS[index][0]}%;top:${ANIMAL_SLOT_POSITIONS[index][1]}%" type="button">
      <img src="${item.image}" alt="${item.name}">${animal.bonus?'<span class="animal-merit-star">⭐</span>':""}<small>${ready?`${item.productName}พร้อมเก็บ`:`กำลังผลิต ${item.productName}<br>${formatHM(remaining)}`}</small>
    </button>`;
  }
  return `<button class="animal-add-slot ${pending?"pending":""}" type="button" data-animal-slot="${index}" style="left:${ANIMAL_SLOT_POSITIONS[index][0]}%;top:${ANIMAL_SLOT_POSITIONS[index][1]}%">${pending?`<img src="${item.image}" alt="${item.name}"><small>รออนุมัติ</small>`:"+"}</button>`;
}
function renderAnimalScene(sceneName){
  const nav={
    chicken:{backText:"กลับแปลงผัก",backAction:returnToFarm,nextText:"คอกต่อไป",nextAction:()=>openScene("fish")},
    fish:{backText:"กลับไปที่คอกไก่",backAction:()=>openScene("chicken"),nextText:"คอกต่อไป",nextAction:()=>openScene("pig")},
    pig:{backText:"กลับไปที่บ่อปลา",backAction:()=>openScene("fish"),nextText:"คอกต่อไป",nextAction:()=>openScene("cow")},
    cow:{nextText:"กลับไปที่แปลงผัก",nextAction:returnToFarm}
  }[sceneName]||{};
  setSceneNav(nav);processAnimalSystems();
  $("sceneInteractiveLayer").innerHTML=`<div class="animal-slots">${ANIMAL_SLOT_POSITIONS.map((_,i)=>animalSlotHTML(sceneName,i)).join("")}</div>`;
  document.querySelectorAll("[data-animal-slot]").forEach(b=>b.onclick=()=>showAnimalApprovalChoices(sceneName,Number(b.dataset.animalSlot)));
  document.querySelectorAll("[data-owned-animal]").forEach(b=>b.onclick=()=>collectAnimal(sceneName,Number(b.dataset.ownedAnimal)));
  stopSceneTimer();sceneTimer=setInterval(()=>{if(currentScene===sceneName)renderAnimalScene(sceneName)},60000);
}
function processAnimalSystems(){
  if(!state||!state.animals)return;
  const now=Date.now();
  if(now>=Number(state.animalBonusNextAt||0)){
    const owned=[];
    SHOP_ITEMS.forEach(item=>state.animals[item.id].forEach((a,i)=>{if(a)owned.push([item.id,i])}));
    owned.forEach(([id,i])=>{if(state.animals[id][i])state.animals[id][i].bonus=false});
    if(owned.length){
      const count=Math.min(owned.length,randInt(1,3));
      owned.sort(()=>Math.random()-.5).slice(0,count).forEach(([id,i])=>state.animals[id][i].bonus=true);
    }
    state.animalBonusNextAt=now+ANIMAL_BONUS_INTERVAL;save();
  }
}
function collectAnimal(sceneName,index){
  const item=animalById(sceneName),animal=state.animals[sceneName][index];if(!item||!animal)return;
  if(animal.bonus){
    const merit=randInt(1,2);animal.bonus=false;state.merit+=merit;save();updateMeritUI();renderAnimalScene(sceneName);message("⭐ โบนัสสัตว์วิญญาณ",`${item.name} มอบ +${merit} กุศล`);return;
  }
  if(Date.now()<Number(animal.readyAt||0)){message("ยังผลิตไม่เสร็จ",`${item.productName} พร้อมใน ${formatHM(animal.readyAt-Date.now())}`);return}
  let qty=1;
  if(Math.random()<.12)qty=Math.random()<.82?2:3;
  state.animalProducts[item.product]=(state.animalProducts[item.product]||0)+qty;
  animal.readyAt=Date.now()+item.productionMs;save();renderAnimalScene(sceneName);
  message("เก็บผลผลิตสำเร็จ",`${item.productName} ×${qty} เพิ่มเข้ากระเป๋าแล้ว`);
}
// ฟังก์ชันนี้เตรียมไว้สำหรับตอนมีระบบอนุมัติกลางในอนาคต
function grantAnimal(sceneName,index){
  const item=animalById(sceneName);if(!item||!state.animals[sceneName]||state.animals[sceneName][index])return false;
  state.animals[sceneName][index]={readyAt:Date.now()+item.productionMs,bonus:false};
  state.animalRequests[sceneName][index]=false;save();return true;
}

function can(recipe){return Object.entries(recipe.need).every(([key,count])=>(state.bag[key]||0)>=count)}
function ingredientText(recipe){return Object.entries(recipe.need).map(([key,count])=>`<span>${CROPS[key].icon} ${CROPS[key].name} ×${count}</span>`).join("")}
function recipeCard(recipe){
  const locked=recipe.night&&!isNightCraftOpen();
  return `<article class="recipe-card ${recipe.night?"night-recipe-card":""}">
    <div class="craft-chance-badge">🎲 ${recipe.chance}%</div>
    <img src="${recipe.image}" alt="${recipe.name}">
    <h3>${recipe.icon} ${recipe.name}</h3>
    <small class="difficulty-label">${recipe.difficulty} • กุศล ${recipe.reward[0]}–${recipe.reward[1]}</small>
    <div class="recipe-needs">${ingredientText(recipe)}</div>
    <button type="button" data-confirm-craft="${recipe.id}" ${locked?"disabled":""}>${locked?"เปิด 22:00–02:00":"คราฟ"}</button>
  </article>`;
}
function kitchen(){
  if(guardResting())return;
  const normal=RECIPES.filter(r=>!r.night),night=RECIPES.filter(r=>r.night);
  const nightOpen=isNightCraftOpen();
  $("modalContent").innerHTML=`
    <section class="feature-panel recipe-catalog-panel">
      <h2>📖 สมุดเมนูอาหาร</h2>
      <div class="recipe-section-title">เมนูทั่วไป</div>
      <div class="recipe-catalog-grid">${normal.map(recipeCard).join("")}</div>
      <div class="night-menu-frame">
        <h2>🌙 เมนูท้าวิญญาณรอบดึก</h2>
        <p>${nightOpen?`เปิดให้คราฟถึง 02:00 น.`:`เปิดเวลา 22:00–02:00 • เปิดอีกใน ${formatHM(msUntilNightCraft())}`}</p>
        <div class="recipe-catalog-grid">${night.map(recipeCard).join("")}</div>
      </div>
    </section>`;
  document.querySelectorAll("[data-confirm-craft]").forEach(b=>b.onclick=()=>confirmCraft(b.dataset.confirmCraft));
  openModal();
}
function confirmCraft(id){
  const recipe=recipeById(id);if(!recipe)return;
  if(recipe.night&&!isNightCraftOpen()){message("🌙 ยังไม่ถึงเวลารอบดึก",`เมนูนี้เปิด 22:00–02:00 เวลาไทย • เหลือ ${formatHM(msUntilNightCraft())}`);return}
  $("modalContent").innerHTML=`
    <section class="feature-panel craft-warning-panel">
      <div class="craft-chance-big">โอกาสสำเร็จ ${recipe.chance}%</div>
      <img src="${recipe.image}" alt="${recipe.name}"><h2>${recipe.name}</h2>
      <p>หากคราฟสำเร็จ คุณจะได้รับ ${recipe.reward[0]}–${recipe.reward[1]} แต้มกุศล หากคราฟไม่สำเร็จ วัตถุดิบที่ใช้ครั้งนี้ก็จะสูญเปล่า</p>
      <div class="confirm-actions"><button id="confirmCraftBtn" class="danger-action" type="button">ยืนยัน</button><button id="cancelCraftBtn" class="secondary-action" type="button">ไม่คราฟค่ะพี่ป๊อด</button></div>
    </section>`;
  $("confirmCraftBtn").onclick=()=>{if(!can(recipe)){message("วัตถุดิบไม่ครบ",`ยังไม่สามารถคราฟ ${recipe.name} ได้`);return}craft(id)};
  $("cancelCraftBtn").onclick=kitchen;
}
function craft(id){
  const recipe=recipeById(id);if(!recipe||!can(recipe))return;
  Object.entries(recipe.need).forEach(([key,count])=>state.bag[key]-=count);
  const success=Math.random()*100<recipe.chance;
  if(success){
    const reward=randInt(recipe.reward[0],recipe.reward[1]);
    state.dishes.push({id:recipe.id,name:recipe.name,image:recipe.image,time:new Date().toLocaleString("th-TH")});
    state.merit+=reward;save();updateMeritUI();
    $("modalContent").innerHTML=`<section class="feature-panel craft-success-panel"><h2>✨ คราฟสำเร็จ!</h2><img src="${recipe.image}" alt="${recipe.name}"><h3>${recipe.name}</h3><p>อาหารเพิ่มลงกระเป๋า ×1<br>ได้รับ +${reward} กุศล</p></section>`;
  }else{
    save();
    $("modalContent").innerHTML=`<section class="feature-panel craft-success-panel"><h2>💨 คราฟไม่สำเร็จ</h2><img src="${recipe.image}" alt="${recipe.name}"><h3>${recipe.name}</h3><p>วัตถุดิบครั้งนี้สูญเปล่าแล้ว</p></section>`;
  }
}

function updateThaiClock(){
  const now=getBangkokTimeParts();
  $("thaiClock").textContent=now.text;
  $("weatherClockEmoji").textContent=now.hour>=6&&now.hour<18?"☀️":"🌙";
  updateAlmsButton();
}
function startGameExtras(){
  updateProfileName();loadAvatar();updateTopPlayerName();applyFarmMode(getSavedFarmMode(),{persist:false});
  updateThaiClock();updateMeritUI();buildRainDrops();
  if(thaiClockTimer)clearInterval(thaiClockTimer);
  thaiClockTimer=setInterval(updateThaiClock,60*1000);
  beginRain();
}


/* ===== PATCH รอบสวนมะพร้าว: ใช้ BASE ล่าสุดและ override เฉพาะระบบที่ระบุ ===== */
function fresh(player){
  return{
    player,merit:300,plots:Array.from({length:PLOT_COUNT},emptyPlot),
    bag:Object.fromEntries(Object.keys(CROPS).map(k=>[k,0])),
    animalProducts:Object.fromEntries(Object.keys(ANIMAL_PRODUCTS).map(k=>[k,0])),
    dishes:[],specials:Object.fromEntries(Object.keys(COCONUT_ITEMS).map(k=>[k,0])),
    coconutTrees:Array(6).fill(0),
    houseOfferings:[null,null,null],underwaterOffering:null,houseWorshipUntil:0,underwaterUntil:0,
    restUntil:0,restType:null,restRewardPending:false,almsOfferings:[null,null,null,null],lastAlmsDate:"",
    friendlyGhostUntil:0,challengeUntil:0,
    animalRequests:{chicken:Array(9).fill(false),fish:Array(9).fill(false),pig:Array(9).fill(false),cow:Array(9).fill(false)},
    animals:{chicken:Array(9).fill(null),fish:Array(9).fill(null),pig:Array(9).fill(null),cow:Array(9).fill(null)},
    animalBonusNextAt:Date.now()+ANIMAL_BONUS_INTERVAL
  };
}
function normalizeState(raw,player){
  const n=raw&&typeof raw==="object"?raw:fresh(player);
  n.player=player||n.player||"ผู้เล่น";
  if(!Number.isFinite(Number(n.merit)))n.merit=300;n.merit=Number(n.merit);
  n.plots=Array.isArray(n.plots)?n.plots.slice(0,PLOT_COUNT):[];while(n.plots.length<PLOT_COUNT)n.plots.push(emptyPlot());n.plots=n.plots.map(normalizePlot);
  n.bag=n.bag&&typeof n.bag==="object"?n.bag:{};Object.keys(CROPS).forEach(k=>{n.bag[k]=Number.isFinite(Number(n.bag[k]))?Number(n.bag[k]):0});
  n.animalProducts=n.animalProducts&&typeof n.animalProducts==="object"?n.animalProducts:{};Object.keys(ANIMAL_PRODUCTS).forEach(k=>{n.animalProducts[k]=Number.isFinite(Number(n.animalProducts[k]))?Number(n.animalProducts[k]):0});
  n.dishes=Array.isArray(n.dishes)?n.dishes:[];
  n.specials=n.specials&&typeof n.specials==="object"?n.specials:{};Object.keys(COCONUT_ITEMS).forEach(k=>{n.specials[k]=Number.isFinite(Number(n.specials[k]))?Number(n.specials[k]):0});
  n.coconutTrees=Array.isArray(n.coconutTrees)?n.coconutTrees.slice(0,6):[];while(n.coconutTrees.length<6)n.coconutTrees.push(0);n.coconutTrees=n.coconutTrees.map(v=>Number(v)||0);
  n.houseOfferings=Array.isArray(n.houseOfferings)?n.houseOfferings.slice(0,3):[null,null,null];while(n.houseOfferings.length<3)n.houseOfferings.push(null);
  n.underwaterOffering=typeof n.underwaterOffering==="string"?n.underwaterOffering:null;n.houseWorshipUntil=Number(n.houseWorshipUntil)||0;n.underwaterUntil=Number(n.underwaterUntil)||0;
  n.restUntil=Number(n.restUntil)||0;n.restType=n.restType==="sleep"||n.restType==="nap"?n.restType:null;n.restRewardPending=Boolean(n.restRewardPending);
  n.almsOfferings=Array.isArray(n.almsOfferings)?n.almsOfferings.slice(0,4):[null,null,null,null];while(n.almsOfferings.length<4)n.almsOfferings.push(null);
  n.lastAlmsDate=typeof n.lastAlmsDate==="string"?n.lastAlmsDate:"";n.friendlyGhostUntil=Number(n.friendlyGhostUntil)||0;n.challengeUntil=Number(n.challengeUntil)||0;
  n.animalRequests=n.animalRequests&&typeof n.animalRequests==="object"?n.animalRequests:{};n.animals=n.animals&&typeof n.animals==="object"?n.animals:{};
  SHOP_ITEMS.forEach(item=>{
    if(!Array.isArray(n.animalRequests[item.id]))n.animalRequests[item.id]=Array(9).fill(false);n.animalRequests[item.id]=n.animalRequests[item.id].slice(0,9);while(n.animalRequests[item.id].length<9)n.animalRequests[item.id].push(false);
    if(!Array.isArray(n.animals[item.id]))n.animals[item.id]=Array(9).fill(null);n.animals[item.id]=n.animals[item.id].slice(0,9);while(n.animals[item.id].length<9)n.animals[item.id].push(null);
  });
  n.animalBonusNextAt=Number(n.animalBonusNextAt)||Date.now()+ANIMAL_BONUS_INTERVAL;
  return n;
}
function seedChoiceImage(crop){
  const fallback=crop.selectFallback||crop.seedImg||"";
  const escapedFallback=String(fallback).replace(/&/g,"&amp;").replace(/\"/g,"&quot;");
  return `<img src="${crop.selectImg}" alt="${crop.name}" class="seed-choice-img" data-fallback="${escapedFallback}" onerror="if(this.dataset.fallback&&this.getAttribute('src')!==this.dataset.fallback){this.setAttribute('src',this.dataset.fallback)}else{this.style.display='none'}">`;
}
function plantMenu(index){
  $("modalContent").innerHTML=`<h2>เลือกเมล็ดสำหรับแปลง #${index+1}</h2><div class="grid">${Object.entries(CROPS).map(([key,crop])=>`<div class="tile spooky-seed-tile">${seedChoiceImage(crop)}<b>${crop.name}</b><p>เวลาโตประมาณ ${Math.round(crop.totalMs/60000)} นาที</p><button type="button" data-crop="${key}">ปลูก</button></div>`).join("")}</div>`;
  document.querySelectorAll("[data-crop]").forEach(button=>button.onclick=()=>{const key=button.dataset.crop,crop=CROPS[key],now=Date.now();state.plots[index]={crop:key,phase:"growing1",phaseEndsAt:now+crop.waterMs,plantedAt:now,wateredAt:0,worm:false};save();closeModal();draw()});openModal();
}
function inventory(tab="crops"){
  if(guardResting())return;const dishMap=dishCounts();const tabs=[["crops","🌱 พืชพรรณ"],["products","🐾 ผลผลิตสัตว์"],["food","🍲 อาหาร"],["specials","🕯️ ของพิเศษ"]];let body="";
  if(tab==="crops")body=Object.entries(CROPS).map(([k,c])=>`<div class="inventory-item"><img src="${c.readyImg}" alt="${c.name}"><span>${c.name}</span><b>×${state.bag[k]||0}</b></div>`).join("");
  else if(tab==="products")body=Object.entries(ANIMAL_PRODUCTS).map(([k,p])=>`<div class="inventory-item"><img src="${p.image}" alt="${p.name}"><span>${p.name}</span><b>×${state.animalProducts[k]||0}</b></div>`).join("");
  else if(tab==="food")body=RECIPES.map(r=>`<div class="inventory-item"><img src="${r.image}" alt="${r.name}"><span>${r.name}</span><b>×${dishMap[r.id]||0}</b></div>`).join("");
  else body=Object.entries(COCONUT_ITEMS).map(([k,item])=>`<div class="inventory-item special-coconut-item"><img src="${item.image}" alt="${item.name}"><span>${item.name}<small style="display:block">เร่งโต ${item.boost}%</small></span><b>×${state.specials[k]||0}</b></div>`).join("");
  $("modalContent").innerHTML=`<section class="feature-panel inventory-panel"><h2>🎒 กระเป๋าผี</h2><div class="inventory-tabs">${tabs.map(([k,label])=>`<button type="button" data-inventory-tab="${k}" class="${k===tab?"active":""}">${label}</button>`).join("")}</div><div class="inventory-grid">${body}</div></section>`;
  document.querySelectorAll("[data-inventory-tab]").forEach(b=>b.onclick=()=>inventory(b.dataset.inventoryTab));openModal();
}
function coconutRemainingText(ms){return formatFriendlyCountdown(Math.max(0,ms))}
function rollCoconutReward(){
  const roll=Math.random()*100;let cursor=0;for(const [key,item] of Object.entries(COCONUT_ITEMS)){cursor+=item.weight;if(roll<cursor)return key}return"coconut10";
}
function harvestCoconutTree(index){
  if(guardResting())return;const nextAt=Number(state.coconutTrees[index]||0);if(nextAt>Date.now()){message("🥥 ต้นนี้ถูกสอยไปแล้ว",`กลับมาใหม่ในอีก ${coconutRemainingText(nextAt-Date.now())}`);return}
  const key=rollCoconutReward(),item=COCONUT_ITEMS[key];state.specials[key]=(state.specials[key]||0)+1;state.coconutTrees[index]=Date.now()+COCONUT_TREE_COOLDOWN;save();renderCoconutScene();
  message("🥥 สอยมะพร้าวสำเร็จ",`ยินดีด้วยนะคะ คุณได้รับ ${item.name} ×1<br>มะพร้าวถูกเก็บไว้ใน กระเป๋า → ของพิเศษ แล้ว`);
}
function coconutIngredientText(item){
  if(!item.need)return"ยังไม่เปิดให้คราฟน๊าา";return Object.entries(item.need).map(([key,count])=>`<span>${ANIMAL_PRODUCTS[key].icon} ${ANIMAL_PRODUCTS[key].name} ×${count}</span>`).join("");
}
function canCraftCoconut(item){return item.need&&Object.entries(item.need).every(([key,count])=>(state.animalProducts[key]||0)>=count)}
function showCoconutCraft(){
  if(guardResting())return;
  $("modalContent").innerHTML=`<section class="feature-panel coconut-craft-panel"><h2>🥥 คราฟไอเท็มพิเศษ</h2><div class="coconut-craft-grid">${Object.entries(COCONUT_ITEMS).map(([key,item])=>`<article class="coconut-craft-card"><div class="coconut-chance">${item.locked?"🔒":`🎲 ${item.chance}%`}</div><img src="${item.image}" alt="${item.name}"><h3>${item.name}</h3><p>${item.description}</p><div class="coconut-needs">${coconutIngredientText(item)}</div><button type="button" data-coconut-craft="${key}" ${item.locked?"disabled":""}>${item.locked?"ยังไม่เปิดให้คราฟน๊าา":"คราฟ"}</button></article>`).join("")}</div><button id="coconutCraftBackBtn" class="coconut-craft-back" type="button">กลับ</button></section>`;
  document.querySelectorAll("[data-coconut-craft]").forEach(btn=>btn.onclick=()=>craftCoconut(btn.dataset.coconutCraft));$("coconutCraftBackBtn").onclick=()=>{closeModal();renderCoconutScene()};openModal();
}
function craftCoconut(key){
  const item=COCONUT_ITEMS[key];if(!item||item.locked)return;if(!canCraftCoconut(item)){message("วัตถุดิบยังไม่ครบ","วัตถุดิบยังไม่ครบ");return}
  Object.entries(item.need).forEach(([product,count])=>state.animalProducts[product]-=count);const success=Math.random()*100<item.chance;
  if(success){state.specials[key]=(state.specials[key]||0)+1;save();message("คราฟสำเร็จ",`ยินดีด้วยนะคะ คุณได้รับ ${item.name} ×1<br>เก็บไว้ใน กระเป๋า → ของพิเศษ แล้ว`)}
  else{save();message("คราฟไม่สำเร็จ","รอบนี้คราฟไม่สำเร็จ วัตถุดิบที่ใช้ถูกหักไปแล้วค่ะ")}
}
const COCONUT_TREE_POSITIONS=[[1,14,38,27],[61,14,38,27],[0,38,38,28],[62,38,38,28],[0,65,38,28],[62,65,38,28]];
function renderCoconutScene(){
  setSceneNav({backText:"กลับแปลงผัก",backAction:returnToFarm});
  $("sceneInteractiveLayer").innerHTML=`${COCONUT_TREE_POSITIONS.map(([left,top,width,height],i)=>{const rem=Math.max(0,Number(state.coconutTrees[i]||0)-Date.now());return `<button class="coconut-tree-hotspot" type="button" data-coconut-tree="${i}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%"><small>${rem>0?coconutRemainingText(rem):"พร้อมสอย"}</small></button>`}).join("")}<button id="coconutBoatHotspot" class="coconut-boat-hotspot" type="button" aria-label="คราฟไอเท็มพิเศษ"><span class="coconut-boat-label">คราฟไอเท็มพิเศษ</span></button>`;
  document.querySelectorAll("[data-coconut-tree]").forEach(btn=>btn.onclick=()=>harvestCoconutTree(Number(btn.dataset.coconutTree)));$("coconutBoatHotspot").onclick=showCoconutCraft;
  stopSceneTimer();sceneTimer=setInterval(()=>{if(currentScene!=="coconut"){stopSceneTimer();return}renderCoconutScene()},60000);
}
function renderScene(){
  if(currentScene==="house"){renderHouseScene();return}if(currentScene==="underwater"){renderUnderwaterScene();return}if(currentScene==="almsSeated"||currentScene==="almsBlessing"){renderAlmsScene();return}if(currentScene==="coconut"){renderCoconutScene();return}renderAnimalScene(currentScene);
}
function coconutOptionsHTML(plot){
  const available=Object.entries(COCONUT_ITEMS).filter(([key,item])=>(state.specials[key]||0)>0&&(item.boost===100||(plot.phase==="growing1"||plot.phase==="growing2")));
  if(!available.length)return"";return `<div class="coconut-boost-panel"><h3>🥥 ใช้มะพร้าวเร่งการเจริญเติบโต</h3><div class="coconut-boost-grid">${available.map(([key,item])=>`<button type="button" class="coconut-boost-btn" data-use-coconut="${key}"><img src="${item.image}" alt="${item.name}"><span>${item.name}<small>เร่งโต ${item.boost}% • มี ×${state.specials[key]||0}</small></span></button>`).join("")}</div></div>`;
}
function useCoconutOnPlot(index,key){
  const plot=state.plots[index],item=COCONUT_ITEMS[key];if(!plot||!plot.crop||!item||(state.specials[key]||0)<=0)return false;ensurePlotPhase(plot);
  if(item.boost===100){plot.phase="ready";plot.phaseEndsAt=0;plot.worm=false}else{if(plot.phase!=="growing1"&&plot.phase!=="growing2"){message("ยังใช้มะพร้าวนี้ไม่ได้","มะพร้าว 10% / 20% / 50% ใช้ได้ในช่วงที่ต้นกำลังนับเวลาเติบโตเท่านั้น");return false}const rem=Math.max(0,Number(plot.phaseEndsAt||0)-Date.now());plot.phaseEndsAt=Date.now()+Math.max(1000,Math.round(rem*(1-item.boost/100)))}
  state.specials[key]-=1;save();closeModal();draw();showWeatherToast(`🥥 ใช้ ${item.name} แล้ว • เร่งโต ${item.boost}%`);return true;
}
function bindCoconutButtons(index){document.querySelectorAll("[data-use-coconut]").forEach(btn=>btn.onclick=()=>useCoconutOnPlot(index,btn.dataset.useCoconut))}
function tapPlot(index){
  if(guardResting())return;const plot=state.plots[index];ensurePlotPhase(plot);if(!plot.crop){plantMenu(index);return}
  if(plot.phase==="ready"){state.bag[plot.crop]=(state.bag[plot.crop]||0)+1;const name=CROPS[plot.crop].name;state.plots[index]=emptyPlot();save();draw();message("เก็บเกี่ยวสำเร็จ",`ได้ ${name} ×1`);return}
  const coconutHTML=coconutOptionsHTML(plot);
  if(plot.phase==="needsWater"){$("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>💧 รดน้ำ ${CROPS[plot.crop].name}</h2><p>กดบัวรดน้ำแล้วต้นจะเข้าสู่ขั้นโตต่อไป</p><button id="waterNowBtn" class="primary-spooky-action" type="button">รดน้ำ</button>${coconutHTML}</section>`;openModal();$("waterNowBtn").onclick=()=>{closeModal();waterPlot(index)};bindCoconutButtons(index);return}
  if(plot.phase==="worm"){$("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>🐛 หนอนมาแล้ว</h2><p>ต้นจะหยุดโตจนกว่าจะกำจัดหนอน ใช้ 1 คะแนนกุศล<br>คะแนนสามารถติดลบได้</p><button id="clearWormBtn" class="danger-action" type="button">ใช้ 1 กุศลกำจัดหนอน</button>${coconutHTML}</section>`;openModal();$("clearWormBtn").onclick=()=>{closeModal();clearWorm(index)};bindCoconutButtons(index);return}
  if(coconutHTML){$("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>🌱 ${CROPS[plot.crop].name}</h2><p>เหลือประมาณ ${plotTimerText(plot)}</p>${coconutHTML}</section>`;openModal();bindCoconutButtons(index);return}
  message("ต้นกำลังเติบโต",`${CROPS[plot.crop].name} เหลือประมาณ ${plotTimerText(plot)}`);
}


/* ===== Firebase: เชื่อมบัญชี Aida/Admin เท่านั้น (รอบทดสอบแรก) ===== */
async function getFirebaseBridge(){
  try{
    if(window.firebaseBridge)return window.firebaseBridge;
    if(!window.firebaseReady)throw new Error("Firebase SDK ยังไม่พร้อม");
    return await Promise.race([
      window.firebaseReady,
      new Promise((_,reject)=>setTimeout(()=>reject(new Error("Firebase ใช้เวลาตอบสนองนานเกินไป")),10000))
    ]);
  }catch(error){
    console.error("Firebase bridge error",error);
    return null;
  }
}

function firebaseAdminLoginForm(messageText=""){
  $("modalContent").innerHTML=`
    <section class="feature-panel confirm-panel">
      <h2>🔥 เชื่อม Firebase Admin</h2>
      <p>${messageText||"เข้าสู่ระบบด้วยบัญชี Firebase ที่สร้างไว้สำหรับ Aida เพื่อทดสอบการอ่านสิทธิ์ admin"}</p>
      <input id="firebaseAdminEmail" type="email" autocomplete="username" placeholder="Email ของ Firebase Admin" style="width:100%;padding:11px 12px;margin:7px 0;border:1px solid #b58b64;border-radius:12px;background:#fffaf0;color:#432c49">
      <input id="firebaseAdminPassword" type="password" autocomplete="current-password" placeholder="Password ของ Firebase Admin" style="width:100%;padding:11px 12px;margin:7px 0 12px;border:1px solid #b58b64;border-radius:12px;background:#fffaf0;color:#432c49">
      <div class="confirm-actions">
        <button id="firebaseAdminLoginBtn" class="danger-action" type="button">เชื่อม Firebase</button>
        <button id="firebaseAdminSkipBtn" class="secondary-action" type="button">ไว้ทีหลัง</button>
      </div>
      <p id="firebaseAdminStatus" style="margin-top:10px;font-size:12px"></p>
    </section>`;
  openModal();
  $("firebaseAdminSkipBtn").onclick=closeModal;
  $("firebaseAdminLoginBtn").onclick=loginFirebaseAdmin;
}

async function checkFirebaseAdminConnection(){
  if(currentMember!=="Aida")return;
  const bridge=await getFirebaseBridge();
  if(!bridge){
    message("Firebase ยังไม่เชื่อม","โหลด Firebase SDK ไม่สำเร็จ แต่เกมส่วนเดิมยังเล่นได้ตามปกติ");
    return;
  }
  try{
    await bridge.waitForAuth();
    const user=bridge.getCurrentUser();
    if(!user){firebaseAdminLoginForm();return}
    const profile=await bridge.getSignedInMember();
    if(profile&&profile.role==="admin"){
      showWeatherToast("🔥 Firebase Admin เชื่อมต่อแล้ว");
      return;
    }
    await bridge.signOut();
    firebaseAdminLoginForm("บัญชี Firebase ที่ค้างอยู่ไม่มีสิทธิ์ admin กรุณาเข้าสู่ระบบด้วยบัญชี Aida/Admin");
  }catch(error){
    console.error("ตรวจ Firebase Admin ไม่สำเร็จ",error);
    firebaseAdminLoginForm("ยังตรวจสิทธิ์ Firebase ไม่สำเร็จ กรุณาเข้าสู่ระบบอีกครั้ง");
  }
}

async function loginFirebaseAdmin(){
  const email=$("firebaseAdminEmail")?.value.trim()||"";
  const password=$("firebaseAdminPassword")?.value||"";
  const status=$("firebaseAdminStatus");
  if(!email||!password){if(status)status.textContent="กรุณากรอก Email และ Password ให้ครบ";return}
  if(status)status.textContent="กำลังเชื่อม Firebase...";
  const button=$("firebaseAdminLoginBtn");
  if(button)button.disabled=true;
  try{
    const bridge=await getFirebaseBridge();
    if(!bridge)throw new Error("Firebase SDK ยังไม่พร้อม");
    await bridge.signIn(email,password);
    const profile=await bridge.getSignedInMember();
    if(!profile)throw new Error("ไม่พบเอกสาร members ของบัญชีนี้");
    if(profile.role!=="admin"){
      await bridge.signOut();
      throw new Error("บัญชีนี้ไม่มีสิทธิ์ admin");
    }
    closeModal();
    message("🔥 Firebase เชื่อมสำเร็จ",`อ่านข้อมูลสมาชิกสำเร็จ<br>ชื่อ: ${profile.displayName||"Aida"}<br>สิทธิ์: ${profile.role}`);
  }catch(error){
    console.error("Firebase Admin login failed",error);
    if(status)status.textContent=`เชื่อมไม่สำเร็จ: ${error.message||"กรุณาตรวจ Email/Password"}`;
    if(button)button.disabled=false;
  }
}

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
  if($("almsBtn"))$("almsBtn").onclick=showAlms;
  if($("challengeBtn"))$("challengeBtn").onclick=challengeFarm;
  if($("friendlyGhostHotspot"))$("friendlyGhostHotspot").onclick=friendlyGhostReward;
  if($("coconutGardenHotspot"))$("coconutGardenHotspot").onclick=()=>{if(!guardResting())openScene("coconut")};
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
