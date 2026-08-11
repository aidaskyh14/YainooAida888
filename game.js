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
const COCONUT_TREE_COOLDOWN=1*60*60*1000;

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

const PLOT_COUNT=24;
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

let SERVER_CLOCK_OFFSET_MS=0;
let SERVER_CLOCK_EPOCH_MS=0;
let SERVER_CLOCK_PERF_BASE=0;
let cloudSessionId="";
let cloudSessionSuperseded=false;

function gameNow(){
  if(SERVER_CLOCK_EPOCH_MS>0&&globalThis.performance&&typeof globalThis.performance.now==="function"){
    return SERVER_CLOCK_EPOCH_MS+(globalThis.performance.now()-SERVER_CLOCK_PERF_BASE);
  }
  return new Date().getTime()+SERVER_CLOCK_OFFSET_MS;
}
function newCloudSessionId(){
  return globalThis.crypto?.randomUUID?.()||`session-${new Date().getTime()}-${Math.random().toString(36).slice(2)}`;
}
function ownPlayerKeyMatches(player){
  return Boolean(currentMemberKey&&player&&memberKeyFromName(player)===currentMemberKey);
}
function assertCurrentCloudSession(raw,player){
  if(!raw||!cloudSessionId||!ownPlayerKeyMatches(player))return;
  const remoteSession=String(raw.activeSessionId||"");
  if(remoteSession&&remoteSession!==cloudSessionId){
    throw new Error("เซสชันเครื่องนี้เก่าแล้ว กรุณาเข้าสู่เกมใหม่เพื่อโหลดข้อมูลล่าสุด");
  }
}

function emptyPlot(){return{crop:null,at:null}}
function stateKey(){return currentMember?`yainoo-v5:${currentMember}`:null}
function avatarKey(){return currentMember?`yainoo-avatar-v1:${currentMember}`:null}
function profileNameKey(){return currentMember?`yainoo-profile-name-v1:${currentMember}`:null}
function topPlayerNameKey(){return currentMember?`yainoo-top-player-name-v1:${currentMember}`:null}
function farmModeKey(){return currentMember?`yainoo-farm-mode-v1:${currentMember}`:null}

function recipeById(id){return RECIPES.find(recipe=>recipe.id===id)||null}
function animalById(id){return SHOP_ITEMS.find(item=>item.id===id)||null}
function clearExpiredRest(){
  if(state&&Number(state.restUntil)>0&&Number(state.restUntil)<=gameNow()){
    state.restUntil=0;
    state.restType=null;
    save();
  }
}
function isResting(){clearExpiredRest();return Boolean(state&&Number(state.restUntil)>gameNow())}
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
  message(`⏳ ${label}`,`เหลือเวลา ${formatLongCountdown(state.restUntil-gameNow())} ระหว่างนี้ยังไม่สามารถทำกิจกรรมในฟาร์มได้`);
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
  const parts=Object.fromEntries(formatter.formatToParts(new Date(gameNow())).filter(part=>part.type!=="literal").map(part=>[part.type,part.value]));
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
  const rainEndsAt=gameNow()+RAIN_DURATION_MS;
  setRainStatus("🌧️ ฝนผีกำลังตก","00:30");
  showWeatherToast("🌧️ ฝนผีมาเยือน");
  const update=()=>{
    const remaining=rainEndsAt-gameNow();
    if(remaining<=0){stopRainAndStartCountdown();return}
    setRainStatus("🌧️ ฝนผีกำลังตก",formatRainSeconds(remaining));
  };
  update();
  rainTickTimer=setInterval(update,250);
}

function stopRainAndStartCountdown(){
  $("gameScreen").classList.remove("raining");
  if(rainTickTimer)clearInterval(rainTickTimer);
  rainNextAt=gameNow()+RAIN_INTERVAL_MS;
  const update=()=>{
    const remaining=rainNextAt-gameNow();
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
  const elapsed=gameNow()-plot.at;
  const total=CROPS[plot.crop].ms;
  if(elapsed>=total)return"ready";
  if(elapsed>=total*.66)return"grown";
  if(elapsed>=total*.33)return"sprout";
  return"seed";
}

function plotStatus(plot){
  if(!plot.crop)return null;
  const age=gameNow()-plot.at;
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
  const age=gameNow()-plot.at;
  const total=crop.ms;
  let src=crop.seedImg;
  let cls="stage-seed";
  if(age>=total){src=crop.readyImg;cls="stage-ready"}
  else if(age>=total*.66){src=crop.growImg;cls="stage-grow"}
  else if(age>=total*.33){src=crop.sproutImg;cls="stage-sprout"}
  return `<img class="crop-img ${cls}" src="${src}" alt="${crop.name}">`;
}

function remain(plot){return Math.max(0,Math.ceil((CROPS[plot.crop].ms-(gameNow()-plot.at))/1000))}

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
      state.plots[index]={crop:button.dataset.crop,at:gameNow()};
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
      <span id="bedCountdown" class="bed-countdown">${resting?formatLongCountdown(state.restUntil-gameNow()):"แตะเตียง"}</span>
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
      if(countdown)countdown.textContent=formatLongCountdown(state.restUntil-gameNow());
    },1000);
  }
}

function showRestOptions(){
  if(isResting()){
    message(state.restType==="nap"?"กำลังงีบ":"กำลังนอน",`เหลือเวลา ${formatLongCountdown(state.restUntil-gameNow())}`);
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
    state.restUntil=gameNow()+REST_DURATIONS[type];
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
function bangkokPartsFull(date=new Date(gameNow())){
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
    animalBonusNextAt:gameNow()+ANIMAL_BONUS_INTERVAL
  };
}
function normalizePlot(plot){
  if(!plot||typeof plot!=="object"||!plot.crop)return emptyPlot();
  if(plot.phase)return plot;
  // แปลงเซฟเก่าที่ใช้ at ให้เป็นระบบใหม่ โดยไม่ลบพืช
  const crop=CROPS[plot.crop];
  if(!crop)return emptyPlot();
  const oldAt=Number(plot.at)||gameNow();
  const elapsed=Math.max(0,gameNow()-oldAt);
  if(elapsed>=crop.totalMs)return{crop:plot.crop,phase:"ready",phaseEndsAt:0,plantedAt:oldAt,wateredAt:oldAt+crop.waterMs,worm:false};
  if(elapsed>=crop.waterMs)return{crop:plot.crop,phase:"growing2",phaseEndsAt:gameNow()+Math.max(1000,crop.totalMs-elapsed),plantedAt:oldAt,wateredAt:oldAt+crop.waterMs,worm:false};
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
  n.animalBonusNextAt=Number(n.animalBonusNextAt)||gameNow()+ANIMAL_BONUS_INTERVAL;
  return n;
}

function clearExpiredRest(){
  if(!state)return;
  if(Number(state.restUntil)>0&&Number(state.restUntil)<=gameNow()){
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
function isResting(){clearExpiredRest();return Boolean(state&&Number(state.restUntil)>gameNow())}

function ensurePlotPhase(plot){
  if(!plot||!plot.crop)return;
  if(plot.phase==="growing1"&&gameNow()>=Number(plot.phaseEndsAt||0)){
    plot.phase="needsWater";plot.phaseEndsAt=0;save();
  }else if(plot.phase==="growing2"&&gameNow()>=Number(plot.phaseEndsAt||0)){
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
    const elapsed=Math.max(0,gameNow()-Number(plot.plantedAt||gameNow()));
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
  return Math.max(0,Math.ceil((Number(plot.phaseEndsAt||0)-gameNow())/1000));
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
  plot.wateredAt=gameNow();
  const finalMs=Math.max(60*1000,crop.totalMs-crop.waterMs);
  if(Math.random()<Number(crop.wormChance||0)){
    plot.phase="worm";plot.worm=true;plot.phaseEndsAt=0;
    save();draw();showWeatherToast("🐛 เจอหนอนหลังรดน้ำ!");
  }else{
    plot.phase="growing2";plot.worm=false;plot.phaseEndsAt=gameNow()+finalMs;
    save();draw();showWeatherToast("💧 รดน้ำแล้ว ต้นกำลังโต");
  }
}
function clearWorm(index){
  const plot=state.plots[index],crop=CROPS[plot.crop];
  spendMerit(1,"กำจัดหนอน");
  plot.phase="growing2";plot.worm=false;
  plot.phaseEndsAt=gameNow()+Math.max(60*1000,crop.totalMs-crop.waterMs);
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
    const key=button.dataset.crop,crop=CROPS[key],now=gameNow();
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
  const worshipRemaining=Math.max(0,Number(state.houseWorshipUntil||0)-gameNow());
  $("sceneInteractiveLayer").innerHTML=`
    <button id="bedHotspot" class="bed-hotspot" type="button" aria-label="เตียงนอน">
      <span id="bedCountdown" class="bed-countdown">${resting?formatLongCountdown(state.restUntil-gameNow()):"แตะเตียง"}</span>
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
      const reward=randInt(5,12);
      state.houseOfferings=[null,null,null];
      state.houseWorshipUntil=gameNow()+HOUSE_WORSHIP_COOLDOWN;
      state.merit+=reward;save();updateMeritUI();renderHouseScene();
      message("👻 บูชาผีสำเร็จ",`เปรตได้รับเสบียงแล้ว • ได้รับ ${reward} กุศล<br>เปรตมารอรับเสบียงรอบต่อไปใน 3 ชั่วโมง`);
    };
  }
  stopSceneTimer();
  sceneTimer=setInterval(()=>{
    clearExpiredRest();
    if(currentScene!=="house"){stopSceneTimer();return}
    const needRefresh=(Number(state.houseWorshipUntil||0)>0&&gameNow()>=state.houseWorshipUntil)||(!isResting()&&resting);
    if(needRefresh){renderHouseScene();return}
    const bed=$("bedCountdown");if(bed&&isResting())bed.textContent=formatLongCountdown(state.restUntil-gameNow());
    const btn=$("startGhostWorshipBtn");
    if(btn&&Number(state.houseWorshipUntil)>gameNow())btn.textContent=`เปรตมารอรับเสบียงรอบต่อไป ${formatHM(state.houseWorshipUntil-gameNow())}`;
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
    state.restType=type;state.restUntil=gameNow()+REST_DURATIONS[type];state.restRewardPending=true;
    save();closeModal();renderHouseScene();
  };
  $("cancelRestBtn").onclick=closeModal;
}

function renderUnderwaterScene(){
  setSceneNav({backText:"กลับแปลงผัก",backAction:returnToFarm});
  const remaining=Math.max(0,Number(state.underwaterUntil||0)-gameNow());
  const recipe=recipeById(state.underwaterOffering);
  $("sceneInteractiveLayer").innerHTML=`
    <button id="underwaterOfferingSlot" class="underwater-offering-slot offering-slot" type="button" ${remaining>0?"disabled":""}>${recipe?`<img src="${recipe.image}" alt="${recipe.name}">`:"<span>+</span>"}</button>
    <button id="sendUnderwaterSupplyBtn" class="scene-action-button underwater-send-button" type="button" ${remaining>0?"disabled":""}>${remaining>0?`ส่งเสบียงได้อีกครั้งใน ${formatHM(remaining)}`:"ส่งเสบียงให้เจ้าแม่"}</button>`;
  if(remaining<=0){
    $("underwaterOfferingSlot").onclick=()=>showDishPicker("underwater",0);
    $("sendUnderwaterSupplyBtn").onclick=()=>{
      if(!state.underwaterOffering){message("ยังส่งเสบียงไม่ได้","กรุณาเลือกอาหารก่อน");return}
      if(!removeDishIds([state.underwaterOffering])){message("อาหารไม่พอ","อาหารรายการนี้ไม่มีอยู่ในกระเป๋าแล้ว");return}
      const reward=randInt(8,15);
      state.underwaterOffering=null;state.underwaterUntil=gameNow()+UNDERWATER_COOLDOWN;state.merit+=reward;
      save();updateMeritUI();renderUnderwaterScene();
      message("🫧 เจ้าแม่ได้รับเสบียงแล้ว",`ขอบใจชาวสวนมาก<br>เจ้าแม่มีอะไรจะให้ปลอบใจ +${reward} คะแนนแต้มกุศล`);
    };
  }
  stopSceneTimer();
  sceneTimer=setInterval(()=>{
    if(currentScene!=="underwater"){stopSceneTimer();return}
    if(Number(state.underwaterUntil||0)>0&&gameNow()>=state.underwaterUntil){state.underwaterUntil=0;save();renderUnderwaterScene();return}
    const b=$("sendUnderwaterSupplyBtn");
    if(b&&state.underwaterUntil>gameNow())b.textContent=`ส่งเสบียงได้อีกครั้งใน ${formatHM(state.underwaterUntil-gameNow())}`;
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
      const reward=randInt(8,18);
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
      const rem=Math.max(0,p.phaseEndsAt-gameNow());
      p.phaseEndsAt=gameNow()+Math.round(rem*.90);
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
  const remain=Math.max(0,Number(state.friendlyGhostUntil||0)-gameNow());
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
  state.friendlyGhostUntil=gameNow()+FRIENDLY_GHOST_COOLDOWN;
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
    const remaining=Math.max(0,Number(animal.readyAt||0)-gameNow());
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
  const now=gameNow();
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
  if(gameNow()<Number(animal.readyAt||0)){message("ยังผลิตไม่เสร็จ",`${item.productName} พร้อมใน ${formatHM(animal.readyAt-gameNow())}`);return}
  let qty=1;
  if(Math.random()<.12)qty=Math.random()<.82?2:3;
  state.animalProducts[item.product]=(state.animalProducts[item.product]||0)+qty;
  animal.readyAt=gameNow()+item.productionMs;save();renderAnimalScene(sceneName);
  message("เก็บผลผลิตสำเร็จ",`${item.productName} ×${qty} เพิ่มเข้ากระเป๋าแล้ว`);
}
// ฟังก์ชันนี้เตรียมไว้สำหรับตอนมีระบบอนุมัติกลางในอนาคต
function grantAnimal(sceneName,index){
  const item=animalById(sceneName);if(!item||!state.animals[sceneName]||state.animals[sceneName][index])return false;
  state.animals[sceneName][index]={readyAt:gameNow()+item.productionMs,bonus:false};
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
    animalBonusNextAt:gameNow()+ANIMAL_BONUS_INTERVAL
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
  n.animalBonusNextAt=Number(n.animalBonusNextAt)||gameNow()+ANIMAL_BONUS_INTERVAL;
  return n;
}
function seedChoiceImage(crop){
  const fallback=crop.selectFallback||crop.seedImg||"";
  const escapedFallback=String(fallback).replace(/&/g,"&amp;").replace(/\"/g,"&quot;");
  return `<img src="${crop.selectImg}" alt="${crop.name}" class="seed-choice-img" data-fallback="${escapedFallback}" onerror="if(this.dataset.fallback&&this.getAttribute('src')!==this.dataset.fallback){this.setAttribute('src',this.dataset.fallback)}else{this.style.display='none'}">`;
}
function plantMenu(index){
  $("modalContent").innerHTML=`<h2>เลือกเมล็ดสำหรับแปลง #${index+1}</h2><div class="grid">${Object.entries(CROPS).map(([key,crop])=>`<div class="tile spooky-seed-tile">${seedChoiceImage(crop)}<b>${crop.name}</b><p>เวลาโตประมาณ ${Math.round(crop.totalMs/60000)} นาที</p><button type="button" data-crop="${key}">ปลูก</button></div>`).join("")}</div>`;
  document.querySelectorAll("[data-crop]").forEach(button=>button.onclick=()=>{const key=button.dataset.crop,crop=CROPS[key],now=gameNow();state.plots[index]={crop:key,phase:"growing1",phaseEndsAt:now+crop.waterMs,plantedAt:now,wateredAt:0,worm:false};save();closeModal();draw()});openModal();
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
  if(guardResting())return;const nextAt=Number(state.coconutTrees[index]||0);if(nextAt>gameNow()){message("🥥 ต้นนี้ถูกสอยไปแล้ว",`กลับมาใหม่ในอีก ${coconutRemainingText(nextAt-gameNow())}`);return}
  const key=rollCoconutReward(),item=COCONUT_ITEMS[key];state.specials[key]=(state.specials[key]||0)+1;state.coconutTrees[index]=gameNow()+COCONUT_TREE_COOLDOWN;save();renderCoconutScene();
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
  $("sceneInteractiveLayer").innerHTML=`${COCONUT_TREE_POSITIONS.map(([left,top,width,height],i)=>{const rem=Math.max(0,Number(state.coconutTrees[i]||0)-gameNow());return `<button class="coconut-tree-hotspot" type="button" data-coconut-tree="${i}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%"><small>${rem>0?coconutRemainingText(rem):"พร้อมสอย"}</small></button>`}).join("")}<button id="coconutBoatHotspot" class="coconut-boat-hotspot" type="button" aria-label="คราฟไอเท็มพิเศษ"><span class="coconut-boat-label">คราฟไอเท็มพิเศษ</span></button>`;
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
  if(item.boost===100){plot.phase="ready";plot.phaseEndsAt=0;plot.worm=false}else{if(plot.phase!=="growing1"&&plot.phase!=="growing2"){message("ยังใช้มะพร้าวนี้ไม่ได้","มะพร้าว 10% / 20% / 50% ใช้ได้ในช่วงที่ต้นกำลังนับเวลาเติบโตเท่านั้น");return false}const rem=Math.max(0,Number(plot.phaseEndsAt||0)-gameNow());plot.phaseEndsAt=gameNow()+Math.max(1000,Math.round(rem*(1-item.boost/100)))}
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


/* ======================================================================
   V1 ONLINE LAUNCH — Firebase shared save / friends / admin / gifts
   เพิ่มเฉพาะระบบที่ตกลงกัน โดยคงระบบเกมเดิมที่ใช้งานได้ไว้
   ====================================================================== */
const LAUNCH_VERSION="launch-v1-2026-08-07";
const MEMBER_EMAIL_DOMAIN="yainoo.example.com";
const SPECIAL_DAILY_LIMIT=20;
const FRIEND_GIFT_DAILY_LIMIT=30;
const ANIMAL_CAPACITY=9;
const COCONUT_QUOTA_PER_ROUND=2;
const COCONUT_QUOTA_WINDOW_MS=COCONUT_TREE_COOLDOWN;

const ANIMAL_META={
  chicken:{price:30,lifeMs:5*24*60*60*1000},
  fish:{price:50,lifeMs:5*24*60*60*1000},
  pig:{price:100,lifeMs:7*24*60*60*1000},
  cow:{price:300,lifeMs:12*24*60*60*1000}
};

const CAKE_ITEMS={
  cake10:{name:"เค้กฮมอยอนุบาล",image:"cake-boost-10.png?v=1",boost:10,description:"เร่งการเจริญเติบโต 10% ของพืชทุกชนิด"},
  cake20:{name:"เค้กฮมอยประถม",image:"cake-boost-20.png?v=1",boost:20,description:"เร่งการเจริญเติบโต 20% ของพืชทุกชนิด"},
  cake50:{name:"เค้กฮมอยมัธยม",image:"cake-boost-50.png?v=1",boost:50,description:"เร่งการเจริญเติบโต 50% ของพืชทุกชนิด"},
  cake100:{name:"เค้กฮมอยมหาลัย",image:"cake-boost-100.png?v=1",boost:100,description:"เร่งการเจริญเติบโต 100% ของพืชทุกชนิด",shopPrice:20}
};

const PESTLE_ITEMS={
  pestle10:{name:"สากกะเบือชั้นต่ำ",image:"pestle-boost-10.png?v=1",boost:10,chance:100,description:"เร่งการออกผลผลิตของสัตว์เลี้ยงทุกชนิด 10%",dishAny:3,need:{milk:1}},
  pestle20:{name:"สากกะเบือบ้านนอก",image:"pestle-boost-20.png?v=1",boost:20,chance:100,description:"เร่งการออกผลผลิตของสัตว์เลี้ยงทุกชนิด 20%",dishAny:3,need:{truffle:3}},
  pestle50:{name:"สากกะเบือชุบตัว",image:"pestle-boost-50.png?v=1",boost:50,chance:100,description:"เร่งการออกผลผลิตของสัตว์เลี้ยงทุกชนิด 50%",meritNeed:2,need:{egg:2,fishMeat:5,truffle:1,milk:1}},
  pestle100:{name:"สากกะเบือไฮโซ",image:"pestle-boost-100.png?v=1",boost:100,chance:null,description:"เร่งการออกผลผลิตของสัตว์เลี้ยงทุกชนิด 100%",shopPrice:20,locked:true}
};

const SPECIAL_ITEMS={
  ...Object.fromEntries(Object.entries(COCONUT_ITEMS).map(([key,item])=>[key,{...item,kind:"crop",group:"coconut",shopPrice:key==="coconut100"?20:null}])),
  ...Object.fromEntries(Object.entries(CAKE_ITEMS).map(([key,item])=>[key,{...item,kind:"crop",group:"cake"}])),
  ...Object.fromEntries(Object.entries(PESTLE_ITEMS).map(([key,item])=>[key,{...item,kind:"animal",group:"pestle"}]))
};

const SPECIAL_SHOP_KEYS=["coconut100","cake100","pestle100"];
const COCONUT_TREE_POSITIONS_V1=[[1,14,38,27],[61,14,38,27],[0,38,38,28],[62,38,38,28],[0,65,38,28],[62,65,38,28]];

let ownState=null;
let currentMemberKey="";
let cloudReady=false;
let cloudSaveTimer=null;
let ownGardenUnsubscribe=null;
let notificationTimer=null;
let visitContext=null;
let adminProfile=null;
let lastGardenHash="";
let sharedCoconutCache=null;

function memberKeyFromName(name){
  return String(name||"").trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"member";
}
function memberEmailFromName(name){return `member-${memberKeyFromName(name)}@${MEMBER_EMAIL_DOMAIN}`}
function cloneData(value){return value==null?value:JSON.parse(JSON.stringify(value))}
function activeState(){return visitContext?ownState:(ownState||state)}
function specialCount(key,s=activeState()){return Number(s?.specials?.[key]||0)}
function animalProductCount(key,s=activeState()){return Number(s?.animalProducts?.[key]||0)}
function missionDefs(){return Array.isArray(window.DAILY_MISSIONS)?window.DAILY_MISSIONS.slice():[]}
function currentBangkokDateKey(){return bangkokPartsFull().dateKey}
function currentCoconutWindowKey(){return Math.floor(gameNow()/COCONUT_QUOTA_WINDOW_MS)}
function formatAnimalLife(ms){
  const totalHours=Math.max(0,Math.ceil(ms/3600000));
  const days=Math.floor(totalHours/24),hours=totalHours%24;
  return `${days} วัน ${hours} ชม.`;
}
function timestampMillis(value){
  if(!value)return 0;
  if(typeof value==="number")return value;
  if(typeof value.toMillis==="function")return value.toMillis();
  if(typeof value.seconds==="number")return value.seconds*1000;
  return Number(value)||0;
}
function bangkokTimeText(value){
  const ms=timestampMillis(value);
  if(!ms)return"--:--";
  return new Intl.DateTimeFormat("th-TH",{timeZone:"Asia/Bangkok",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(ms));
}
function safeHtml(value){return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}
function plotHash(plots){try{return JSON.stringify(plots||[])}catch{return""}}

function makeMissionState(){
  return{dateKey:currentBangkokDateKey(),progress:Object.fromEntries(missionDefs().map(m=>[m.id,0])),claimed:Object.fromEntries(missionDefs().map(m=>[m.id,false]))};
}
function ensureMissionStateFor(target){
  if(!target)return false;
  const dateKey=currentBangkokDateKey();
  let changed=false;
  if(!target.missions||target.missions.dateKey!==dateKey){target.missions=makeMissionState();changed=true}
  if(!target.missions.progress||typeof target.missions.progress!=="object"){target.missions.progress={};changed=true}
  if(!target.missions.claimed||typeof target.missions.claimed!=="object"){target.missions.claimed={};changed=true}
  missionDefs().forEach(m=>{
    if(!Number.isFinite(Number(target.missions.progress[m.id]))){target.missions.progress[m.id]=0;changed=true}
    if(typeof target.missions.claimed[m.id]!=="boolean"){target.missions.claimed[m.id]=false;changed=true}
  });
  return changed;
}
function ensureDailyLimitsFor(target){
  if(!target)return false;
  const key=currentBangkokDateKey();
  if(!target.dailyLimits||target.dailyLimits.dateKey!==key){target.dailyLimits={dateKey:key,giftsSent:0,specialPurchases:0};return true}
  target.dailyLimits.giftsSent=Number(target.dailyLimits.giftsSent)||0;
  target.dailyLimits.specialPurchases=Number(target.dailyLimits.specialPurchases)||0;
  return false;
}
function incrementMissionOn(target,id,amount=1){
  if(!target)return;
  ensureMissionStateFor(target);
  const def=missionDefs().find(m=>m.id===id);if(!def)return;
  target.missions.progress[id]=Math.min(Number(def.target)||0,(Number(target.missions.progress[id])||0)+Math.max(0,Number(amount)||0));
}
function incrementOwnMission(id,amount=1){
  const target=ownState||state;if(!target)return;
  incrementMissionOn(target,id,amount);
  if(!visitContext)state=target;
  save();
}

function fresh(player){
  const specials=Object.fromEntries(Object.keys(SPECIAL_ITEMS).map(k=>[k,0]));
  return{
    launchVersion:LAUNCH_VERSION,
    player,merit:300,
    plots:Array.from({length:PLOT_COUNT},emptyPlot),
    bag:Object.fromEntries(Object.keys(CROPS).map(k=>[k,0])),
    animalProducts:Object.fromEntries(Object.keys(ANIMAL_PRODUCTS).map(k=>[k,0])),
    dishes:[],specials,
    houseOfferings:[null,null,null],underwaterOffering:null,houseWorshipUntil:0,underwaterUntil:0,
    restUntil:0,restType:null,restRewardPending:false,
    almsOfferings:[null,null,null,null],lastAlmsDate:"",
    friendlyGhostUntil:0,challengeUntil:0,
    animalRequests:{chicken:Array(9).fill(false),fish:Array(9).fill(false),pig:Array(9).fill(false),cow:Array(9).fill(false)},
    animals:{chicken:Array(9).fill(null),fish:Array(9).fill(null),pig:Array(9).fill(null),cow:Array(9).fill(null)},
    pendingAnimals:{chicken:1,fish:1,pig:1,cow:1},
    purchasePendingCounts:{chicken:0,fish:0,pig:0,cow:0},
    animalBonusNextAt:gameNow()+ANIMAL_BONUS_INTERVAL,
    missions:makeMissionState(),
    dailyLimits:{dateKey:currentBangkokDateKey(),giftsSent:0,specialPurchases:0},
    coconutQuotaResetAt:0,coconutQuotaCount:0,
    lastSeenYainooAt:0
  };
}
function normalizeState(raw,player){
  const n=raw&&typeof raw==="object"?raw:fresh(player);
  n.launchVersion=n.launchVersion||LAUNCH_VERSION;
  n.player=player||n.player||"ผู้เล่น";
  n.merit=Number.isFinite(Number(n.merit))?Number(n.merit):300;
  n.plots=Array.isArray(n.plots)?n.plots.slice(0,PLOT_COUNT):[];while(n.plots.length<PLOT_COUNT)n.plots.push(emptyPlot());n.plots=n.plots.map(normalizePlot);
  n.bag=n.bag&&typeof n.bag==="object"?n.bag:{};Object.keys(CROPS).forEach(k=>{n.bag[k]=Number.isFinite(Number(n.bag[k]))?Number(n.bag[k]):0});
  n.animalProducts=n.animalProducts&&typeof n.animalProducts==="object"?n.animalProducts:{};Object.keys(ANIMAL_PRODUCTS).forEach(k=>{n.animalProducts[k]=Number.isFinite(Number(n.animalProducts[k]))?Number(n.animalProducts[k]):0});
  n.dishes=Array.isArray(n.dishes)?n.dishes:[];
  n.specials=n.specials&&typeof n.specials==="object"?n.specials:{};Object.keys(SPECIAL_ITEMS).forEach(k=>{n.specials[k]=Number.isFinite(Number(n.specials[k]))?Number(n.specials[k]):0});
  n.houseOfferings=Array.isArray(n.houseOfferings)?n.houseOfferings.slice(0,3):[null,null,null];while(n.houseOfferings.length<3)n.houseOfferings.push(null);
  n.underwaterOffering=typeof n.underwaterOffering==="string"?n.underwaterOffering:null;n.houseWorshipUntil=Number(n.houseWorshipUntil)||0;n.underwaterUntil=Number(n.underwaterUntil)||0;
  n.restUntil=Number(n.restUntil)||0;n.restType=n.restType==="sleep"||n.restType==="nap"?n.restType:null;n.restRewardPending=Boolean(n.restRewardPending);
  n.almsOfferings=Array.isArray(n.almsOfferings)?n.almsOfferings.slice(0,4):[null,null,null,null];while(n.almsOfferings.length<4)n.almsOfferings.push(null);
  n.lastAlmsDate=typeof n.lastAlmsDate==="string"?n.lastAlmsDate:"";n.friendlyGhostUntil=Number(n.friendlyGhostUntil)||0;n.challengeUntil=Number(n.challengeUntil)||0;
  n.animalRequests=n.animalRequests&&typeof n.animalRequests==="object"?n.animalRequests:{};
  n.animals=n.animals&&typeof n.animals==="object"?n.animals:{};
  n.pendingAnimals=n.pendingAnimals&&typeof n.pendingAnimals==="object"?n.pendingAnimals:{};
  n.purchasePendingCounts=n.purchasePendingCounts&&typeof n.purchasePendingCounts==="object"?n.purchasePendingCounts:{};
  SHOP_ITEMS.forEach(item=>{
    if(!Array.isArray(n.animalRequests[item.id]))n.animalRequests[item.id]=Array(9).fill(false);n.animalRequests[item.id]=n.animalRequests[item.id].slice(0,9);while(n.animalRequests[item.id].length<9)n.animalRequests[item.id].push(false);
    if(!Array.isArray(n.animals[item.id]))n.animals[item.id]=Array(9).fill(null);n.animals[item.id]=n.animals[item.id].slice(0,9);while(n.animals[item.id].length<9)n.animals[item.id].push(null);
    n.animals[item.id]=n.animals[item.id].map(a=>{
      if(!a||typeof a!=="object")return null;
      const placedAt=Number(a.placedAt)||gameNow();
      return{...a,placedAt,expiresAt:Number(a.expiresAt)||placedAt+ANIMAL_META[item.id].lifeMs,readyAt:Number(a.readyAt)||placedAt+item.productionMs,bonus:Boolean(a.bonus),name:typeof a.name==="string"?a.name:""};
    });
    n.pendingAnimals[item.id]=Math.max(0,Number(n.pendingAnimals[item.id])||0);
    n.purchasePendingCounts[item.id]=Math.max(0,Number(n.purchasePendingCounts[item.id])||0);
  });
  n.animalBonusNextAt=Number(n.animalBonusNextAt)||gameNow()+ANIMAL_BONUS_INTERVAL;
  ensureMissionStateFor(n);ensureDailyLimitsFor(n);
  n.coconutQuotaResetAt=Math.max(0,Number(n.coconutQuotaResetAt)||0);
  n.coconutQuotaCount=Math.max(0,Number(n.coconutQuotaCount)||0);
  if(n.coconutQuotaResetAt>0&&n.coconutQuotaResetAt<=gameNow()){n.coconutQuotaResetAt=0;n.coconutQuotaCount=0}
  n.lastSeenYainooAt=Number(n.lastSeenYainooAt)||0;
  return n;
}

async function getFirebaseContext(){
  const bridge=await getFirebaseBridge();if(!bridge)throw new Error("Firebase SDK ยังไม่พร้อม");
  return{bridge,db:bridge.db,fs:bridge.firestore};
}
let cloudSaveInFlight=null;
function queueCloudSave(){
  if(!cloudReady||!currentMemberKey||visitContext)return;
  if(cloudSaveTimer)clearTimeout(cloudSaveTimer);
  cloudSaveTimer=setTimeout(()=>{
    cloudSaveTimer=null;
    flushCloudSave().catch(error=>console.error("บันทึก Firebase ไม่สำเร็จ",error));
  },320);
}
async function settlePendingCloudSave(){
  if(cloudSaveTimer){
    clearTimeout(cloudSaveTimer);
    cloudSaveTimer=null;
    await flushCloudSave();
    return;
  }
  if(cloudSaveInFlight){
    try{await cloudSaveInFlight}catch{}
  }
}
function saveLocalOnly(target=ownState||state){
  if(!target)return;
  const key=stateKey();
  if(key)localStorage.setItem(key,JSON.stringify(target));
}
function save(){
  const target=ownState||state;if(!target)return;
  if(!visitContext){ownState=target;state=target}
  const key=stateKey();if(key)localStorage.setItem(key,JSON.stringify(target));
  queueCloudSave();
}
async function flushCloudSave(){
  if(!cloudReady||!currentMemberKey||!ownState)return;
  const {db,fs}=await getFirebaseContext();
  ensureMissionStateFor(ownState);ensureDailyLimitsFor(ownState);
  const payload=cloneData(ownState);payload.launchVersion=LAUNCH_VERSION;payload.updatedAt=fs.serverTimestamp();
  await fs.setDoc(fs.doc(db,"saves",currentMemberKey),payload,{merge:false});
  const currentHash=plotHash(ownState.plots);
  if(currentHash!==lastGardenHash){
    await fs.setDoc(fs.doc(db,"gardens",currentMemberKey),{memberKey:currentMemberKey,displayName:currentMember,plots:cloneData(ownState.plots),updatedAt:fs.serverTimestamp()},{merge:true});
    lastGardenHash=currentHash;
  }
  await fs.setDoc(fs.doc(db,"publicProfiles",currentMemberKey),{memberKey:currentMemberKey,displayName:currentMember,merit:Number(ownState.merit)||0,initialized:true,uid:(await getFirebaseBridge()).getCurrentUser()?.uid||"",updatedAt:fs.serverTimestamp()},{merge:true});
}

async function ensureMemberAuth(member,code){
  const {bridge,db,fs}=await getFirebaseContext();
  const email=memberEmailFromName(member);
  let user=bridge.getCurrentUser();
  if(user&&String(user.email||"").toLowerCase()!==email.toLowerCase()){await bridge.signOut();user=null}
  if(!user)user=await bridge.signInOrCreate(email,code);
  const ref=fs.doc(db,"members",user.uid),snap=await fs.getDoc(ref);
  const memberKey=memberKeyFromName(member);
  if(!snap.exists()){
    await fs.setDoc(ref,{displayName:member,memberKey,role:"member",welcomeGiftClaimed:false,createdAt:fs.serverTimestamp()});
  }else{
    const data=snap.data();
    if(data.role!=="member")throw new Error("บัญชีนี้ไม่ได้เป็นสมาชิกทั่วไป");
    if(data.memberKey&&data.memberKey!==memberKey)throw new Error("บัญชี Firebase นี้ผูกกับสมาชิกรหัสอื่นแล้ว");
    if(!data.memberKey)await fs.setDoc(ref,{memberKey,displayName:member},{merge:true});
  }
  return user;
}

async function initializeOrLoadCloudState(member,memberKey){
  const {db,fs}=await getFirebaseContext();
  const saveRef=fs.doc(db,"saves",memberKey),gardenRef=fs.doc(db,"gardens",memberKey);
  const [saveSnap,gardenSnap]=await Promise.all([fs.getDoc(saveRef),fs.getDoc(gardenRef)]);
  let loaded;
  if(saveSnap.exists()&&saveSnap.data()?.launchVersion===LAUNCH_VERSION){loaded=normalizeState(saveSnap.data(),member)}
  else{
    // One-time launch reset: ไม่ย้ายของทดสอบจาก localStorage เพื่อให้สมาชิกทุกคนเริ่มเท่ากัน
    loaded=fresh(member);
    await fs.setDoc(saveRef,{...cloneData(loaded),updatedAt:fs.serverTimestamp()},{merge:false});
  }
  if(gardenSnap.exists()&&Array.isArray(gardenSnap.data()?.plots))loaded.plots=gardenSnap.data().plots.map(normalizePlot);
  ownState=normalizeState(loaded,member);state=ownState;
  lastGardenHash=plotHash(ownState.plots);
  await fs.setDoc(gardenRef,{memberKey,displayName:member,plots:cloneData(ownState.plots),updatedAt:fs.serverTimestamp()},{merge:true});
  await fs.setDoc(fs.doc(db,"publicProfiles",memberKey),{memberKey,displayName:member,merit:Number(ownState.merit)||0,initialized:true,uid:(await getFirebaseBridge()).getCurrentUser()?.uid||"",updatedAt:fs.serverTimestamp()},{merge:true});
  cloudReady=true;
  const localKey=stateKey();if(localKey)localStorage.setItem(localKey,JSON.stringify(ownState));
  subscribeOwnGarden();
  startNotificationPolling();
  return ownState;
}
function subscribeOwnGarden(){
  if(ownGardenUnsubscribe){ownGardenUnsubscribe();ownGardenUnsubscribe=null}
  if(!cloudReady||!currentMemberKey)return;
  getFirebaseContext().then(({db,fs})=>{
    ownGardenUnsubscribe=fs.onSnapshot(fs.doc(db,"gardens",currentMemberKey),snap=>{
      if(!snap.exists()||!ownState)return;
      const remote=snap.data();if(!Array.isArray(remote.plots))return;
      const hash=plotHash(remote.plots);if(hash===lastGardenHash)return;
      ownState.plots=remote.plots.map(normalizePlot);lastGardenHash=hash;
      if(!visitContext){state=ownState;draw()}
    },error=>console.warn("garden listener",error));
  }).catch(()=>{});
}
function stopOnlineListeners(){
  if(ownGardenUnsubscribe){ownGardenUnsubscribe();ownGardenUnsubscribe=null}
  if(notificationTimer)clearInterval(notificationTimer);notificationTimer=null;
  if(cloudSaveTimer)clearTimeout(cloudSaveTimer);cloudSaveTimer=null;
}

function updateMeritUI(){
  const target=ownState||state;if(!target)return;
  const el=$("meritTotal");if(el)el.textContent=String(Number(target.merit)||0);
}
function changeMerit(delta,reason="",notify=false){
  const target=ownState||state;if(!target)return 0;
  target.merit=(Number(target.merit)||0)+Number(delta||0);
  if(!visitContext)state=target;
  save();updateMeritUI();
  if(notify){const sign=delta>=0?"+":"";message(reason||"จำนวนกุศลเปลี่ยนแปลง",`${sign}${delta} กุศล • คงเหลือ ${target.merit}`)}
  return target.merit;
}
function addMerit(n,reason="",notify=false){return changeMerit(Math.abs(n),reason,notify)}
function spendMerit(n,reason="",notify=false){return changeMerit(-Math.abs(n),reason,notify)}

function draw(){
  if(!state)return;
  if(!visitContext){clearExpiredRest();processAnimalSystems();if(ensureMissionStateFor(ownState))save()}
  updateMeritUI();if(!visitContext)updateAlmsButton();
  const plots=$("plots");plots.innerHTML="";
  state.plots.forEach((plot,index)=>{
    ensurePlotPhase(plot);
    const currentStage=stage(plot),status=plotStatus(plot);
    const button=document.createElement("button");button.type="button";
    button.className=`plot ${currentStage} ${currentStage==="empty"?"empty":currentStage==="ready"?"ready":"growing"}`;
    const name=plot.crop?CROPS[plot.crop].name:"";
    button.innerHTML=`<span class="plot-no">#${index+1}</span>${status?`<img class="status-badge" src="${STATUS_ICON[status]}" alt="${status}">`:""}<div class="plot-inner"><div class="crop">${cropIcon(plot)}</div>${name?`<div class="crop-name">${name}</div>`:""}${plot.crop?`<div class="timer">${plotTimerText(plot)}</div>`:""}</div>`;
    button.onclick=()=>tapPlot(index);plots.appendChild(button);
  });
}
function waterPlot(index){
  const plot=state.plots[index],crop=CROPS[plot.crop];if(!plot||!crop)return;
  plot.wateredAt=gameNow();const finalMs=Math.max(60*1000,crop.totalMs-crop.waterMs);
  if(Math.random()<Number(crop.wormChance||0)){plot.phase="worm";plot.worm=true;plot.phaseEndsAt=0;save();draw();showWeatherToast("🐛 เจอหนอนหลังรดน้ำ!")}
  else{plot.phase="growing2";plot.worm=false;plot.phaseEndsAt=gameNow()+finalMs;save();draw();showWeatherToast("💧 รดน้ำแล้ว ต้นกำลังโต")}
}
function clearWorm(index){
  const plot=state.plots[index],crop=CROPS[plot.crop];if(!plot||!crop)return;
  spendMerit(1,"กำจัดหนอน");plot.phase="growing2";plot.worm=false;plot.phaseEndsAt=gameNow()+Math.max(60*1000,crop.totalMs-crop.waterMs);
  incrementOwnMission("clearWorms",1);save();draw();message("🐛 ไล่หนอนสำเร็จ",`ใช้ 1 กุศล • คงเหลือ ${ownState.merit} กุศล`);
}
function cropBoostOptionsHTML(plot){
  const available=Object.entries(SPECIAL_ITEMS).filter(([key,item])=>item.kind==="crop"&&specialCount(key)>0&&(item.boost===100||(plot.phase==="growing1"||plot.phase==="growing2")));
  if(!available.length)return"";
  return `<div class="coconut-boost-panel"><h3>⚡ ไอเท็มเร่งการเจริญเติบโต</h3><div class="coconut-boost-grid">${available.map(([key,item])=>`<button type="button" class="coconut-boost-btn" data-use-crop-boost="${key}"><img src="${item.image}" alt="${item.name}"><span>${item.name}<small>เร่งโต ${item.boost}% • มี ×${specialCount(key)}</small></span></button>`).join("")}</div></div>`;
}
function useCropBoostOnPlot(index,key){
  const plot=state.plots[index],item=SPECIAL_ITEMS[key];if(!plot||!plot.crop||!item||item.kind!=="crop"||specialCount(key)<=0)return false;ensurePlotPhase(plot);
  if(item.boost===100){plot.phase="ready";plot.phaseEndsAt=0;plot.worm=false}
  else{
    if(plot.phase!=="growing1"&&plot.phase!=="growing2"){message("ยังใช้ไอเท็มนี้ไม่ได้","ไอเท็ม 10% / 20% / 50% ใช้ได้ตอนต้นกำลังนับเวลาเติบโตเท่านั้น");return false}
    const rem=Math.max(0,Number(plot.phaseEndsAt||0)-gameNow());plot.phaseEndsAt=gameNow()+Math.max(1000,Math.round(rem*(1-item.boost/100)));
  }
  ownState.specials[key]-=1;save();closeModal();draw();showWeatherToast(`⚡ ใช้ ${item.name} แล้ว • เร่งโต ${item.boost}%`);return true;
}
function bindCropBoostButtons(index){document.querySelectorAll("[data-use-crop-boost]").forEach(btn=>btn.onclick=()=>useCropBoostOnPlot(index,btn.dataset.useCropBoost))}
async function tapPlot(index){
  if(visitContext){await tapFriendPlot(index);return}
  if(guardResting())return;
  const plot=state.plots[index];ensurePlotPhase(plot);
  if(!plot.crop){plantMenu(index);return}
  if(plot.phase==="ready"){
    state.bag[plot.crop]=(state.bag[plot.crop]||0)+1;const name=CROPS[plot.crop].name;state.plots[index]=emptyPlot();incrementMissionOn(state,"harvestCrops",1);save();draw();message("เก็บเกี่ยวสำเร็จ",`ได้ ${name} ×1`);return;
  }
  const boostHTML=cropBoostOptionsHTML(plot);
  if(plot.phase==="needsWater"){
    $("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>💧 รดน้ำ ${CROPS[plot.crop].name}</h2><p>กดบัวรดน้ำแล้วต้นจะเข้าสู่ขั้นโตต่อไป</p><button id="waterNowBtn" class="primary-spooky-action" type="button">รดน้ำ</button>${boostHTML}</section>`;
    openModal();$("waterNowBtn").onclick=()=>{closeModal();waterPlot(index)};bindCropBoostButtons(index);return;
  }
  if(plot.phase==="worm"){
    $("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>🐛 หนอนมาแล้ว</h2><p>ต้นจะหยุดโตจนกว่าจะกำจัดหนอน ใช้ 1 คะแนนกุศล<br>คะแนนสามารถติดลบได้</p><button id="clearWormBtn" class="danger-action" type="button">ใช้ 1 กุศลกำจัดหนอน</button>${boostHTML}</section>`;
    openModal();$("clearWormBtn").onclick=()=>{closeModal();clearWorm(index)};bindCropBoostButtons(index);return;
  }
  if(boostHTML){$("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>🌱 ${CROPS[plot.crop].name}</h2><p>เหลือประมาณ ${plotTimerText(plot)}</p>${boostHTML}</section>`;openModal();bindCropBoostButtons(index);return}
  message("ต้นกำลังเติบโต",`${CROPS[plot.crop].name} เหลือประมาณ ${plotTimerText(plot)}`);
}

function inventory(tab="crops"){
  if(guardResting())return;
  const s=ownState||state,dishMap=dishCounts();
  const tabs=[["crops","🌱 พืชพรรณ"],["products","🐾 ผลผลิตสัตว์"],["food","🍲 อาหาร"],["specials","🕯️ ของพิเศษ"]];let body="";
  if(tab==="crops")body=Object.entries(CROPS).map(([k,c])=>`<div class="inventory-item"><img src="${c.readyImg}" alt="${c.name}"><span>${c.name}</span><b>×${s.bag[k]||0}</b></div>`).join("");
  else if(tab==="products")body=Object.entries(ANIMAL_PRODUCTS).map(([k,p])=>`<div class="inventory-item"><img src="${p.image}" alt="${p.name}"><span>${p.name}</span><b>×${s.animalProducts[k]||0}</b></div>`).join("");
  else if(tab==="food")body=RECIPES.map(r=>`<div class="inventory-item"><img src="${r.image}" alt="${r.name}"><span>${r.name}</span><b>×${dishMap[r.id]||0}</b></div>`).join("");
  else body=Object.entries(SPECIAL_ITEMS).map(([k,item])=>`<div class="inventory-item special-coconut-item"><img src="${item.image}" alt="${item.name}"><span>${item.name}<small style="display:block">${item.kind==="animal"?"เร่งผลผลิตสัตว์":"เร่งโตพืช"} ${item.boost}%</small></span><b>×${s.specials[k]||0}</b></div>`).join("");
  $("modalContent").innerHTML=`<section class="feature-panel inventory-panel"><h2>🎒 กระเป๋าผี</h2><div class="inventory-tabs">${tabs.map(([k,label])=>`<button type="button" data-inventory-tab="${k}" class="${k===tab?"active":""}">${label}</button>`).join("")}</div><div class="inventory-grid">${body}</div></section>`;
  document.querySelectorAll("[data-inventory-tab]").forEach(b=>b.onclick=()=>inventory(b.dataset.inventoryTab));openModal();
}

function craft(id){
  const recipe=recipeById(id);if(!recipe||!can(recipe))return;
  Object.entries(recipe.need).forEach(([key,count])=>state.bag[key]-=count);
  const success=Math.random()*100<recipe.chance;
  if(success){
    const reward=randInt(recipe.reward[0],recipe.reward[1]);state.dishes.push({id:recipe.id,name:recipe.name,image:recipe.image,time:new Date().toLocaleString("th-TH")});state.merit+=reward;incrementMissionOn(state,"craftFood",1);save();updateMeritUI();
    $("modalContent").innerHTML=`<section class="feature-panel craft-success-panel"><h2>✨ คราฟสำเร็จ!</h2><img src="${recipe.image}" alt="${recipe.name}"><h3>${recipe.name}</h3><p>อาหารเพิ่มลงกระเป๋า ×1<br>ได้รับ +${reward} กุศล</p></section>`;
  }else{save();$("modalContent").innerHTML=`<section class="feature-panel craft-success-panel"><h2>💨 คราฟไม่สำเร็จ</h2><img src="${recipe.image}" alt="${recipe.name}"><h3>${recipe.name}</h3><p>วัตถุดิบครั้งนี้สูญเปล่าแล้ว</p></section>`}
}
function friendlyGhostReward(){
  if(guardResting())return;const target=ownState||state;
  const rem=Math.max(0,Number(target.friendlyGhostUntil||0)-gameNow());if(rem>0){message("👻 กดบ่อยเกินไปค่ะแม่ รอก่อน",`ผีน้อยใจดีมาแจกของได้อีกใน ${formatFriendlyCountdown(rem)}`);return}
  const qty=randInt(1,2);const pool=[...Object.keys(CROPS).map(k=>({type:"crop",key:k,name:CROPS[k].name})),...Object.keys(ANIMAL_PRODUCTS).map(k=>({type:"product",key:k,name:ANIMAL_PRODUCTS[k].name})),...RECIPES.map(r=>({type:"dish",key:r.id,name:r.name})),{type:"merit",key:"merit",name:"กุศล"}];
  const prize=pool[Math.floor(Math.random()*pool.length)];
  if(prize.type==="crop")target.bag[prize.key]=(target.bag[prize.key]||0)+qty;
  if(prize.type==="product")target.animalProducts[prize.key]=(target.animalProducts[prize.key]||0)+qty;
  if(prize.type==="dish"){const r=recipeById(prize.key);for(let i=0;i<qty;i++)target.dishes.push({id:r.id,name:r.name,image:r.image,time:new Date().toLocaleString("th-TH")})}
  if(prize.type==="merit")target.merit+=qty;
  target.friendlyGhostUntil=gameNow()+FRIENDLY_GHOST_COOLDOWN;incrementMissionOn(target,"friendlyGhost",qty);save();updateMeritUI();message("👻 ผีน้อยใจดี",`รับ ${qty}x ${prize.name}`);
}

async function showMissions(){
  if(guardResting())return;const target=ownState||state;if(ensureMissionStateFor(target))save();
  const defs=missionDefs(),m=target.missions;
  $("modalContent").innerHTML=`<section class="feature-panel mission-panel"><h2>👻 ภารกิจประจำวัน</h2><p class="feature-subtitle">รีเซ็ตทุกวันเวลา 00:00 น. ตามเวลาไทย</p><div class="mission-list">${defs.map((def,index)=>{const progress=Math.min(def.target,Number(m.progress[def.id])||0),done=progress>=def.target,claimed=Boolean(m.claimed[def.id]);return `<div class="mission-item mission-item-v1"><span class="mission-number">${index+1}</span><span class="mission-text"><b>${safeHtml(def.title)}</b><small>${progress}/${def.target} • รางวัล ${def.reward} กุศล</small></span><button type="button" data-claim-mission="${def.id}" ${!done||claimed?"disabled":""}>${claimed?"รับแล้ว":done?"รับรางวัล":"กำลังทำ"}</button></div>`}).join("")}</div></section>`;
  document.querySelectorAll("[data-claim-mission]").forEach(btn=>btn.onclick=()=>claimMissionReward(btn.dataset.claimMission));openModal();
}
async function claimMissionReward(id){
  if(!cloudReady){message("ยังรับรางวัลไม่ได้","กรุณาเชื่อม Firebase ก่อน");return}
  const def=missionDefs().find(m=>m.id===id);if(!def)return;
  try{
    const {db,fs}=await getFirebaseContext(),ref=fs.doc(db,"saves",currentMemberKey),profileRef=fs.doc(db,"publicProfiles",currentMemberKey);
    let nextState;
    await fs.runTransaction(db,async tx=>{
      const snap=await tx.get(ref);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");
      const s=normalizeState(snap.data(),currentMember);ensureMissionStateFor(s);
      if(s.missions.claimed[id])throw new Error("รับรางวัลภารกิจนี้แล้ว");
      if((Number(s.missions.progress[id])||0)<def.target)throw new Error("ภารกิจยังไม่สำเร็จ");
      s.missions.claimed[id]=true;s.merit=(Number(s.merit)||0)+Number(def.reward||0);nextState=s;
      tx.set(ref,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(profileRef,{memberKey:currentMemberKey,displayName:currentMember,merit:s.merit,initialized:true,updatedAt:fs.serverTimestamp()},{merge:true});
    });
    ownState=normalizeState(nextState,currentMember);if(!visitContext)state=ownState;updateMeritUI();showMissions();showWeatherToast(`🙏 รับ +${def.reward} กุศลแล้ว`);
  }catch(error){message("รับรางวัลไม่ได้",error.message||"กรุณาลองใหม่")}
}

function animalIsExpired(animal){return Boolean(animal&&gameNow()>=Number(animal.expiresAt||0))}
function animalPlacedCount(type,s=ownState||state){return Array.isArray(s?.animals?.[type])?s.animals[type].filter(Boolean).length:0}
function animalCapacityUsed(type,s=ownState||state){return animalPlacedCount(type,s)+(Number(s?.pendingAnimals?.[type])||0)+(Number(s?.purchasePendingCounts?.[type])||0)}
function animalSlotHTML(sceneName,index){
  const s=ownState||state,item=animalById(sceneName),animal=s.animals[sceneName][index];
  if(animal){
    const expired=animalIsExpired(animal),remaining=Math.max(0,Number(animal.readyAt||0)-gameNow()),ready=!expired&&remaining<=0;
    return `<button class="animal-owned-slot ${ready?"product-ready":""} ${expired?"animal-expired":""}" data-owned-animal="${index}" style="left:${ANIMAL_SLOT_POSITIONS[index][0]}%;top:${ANIMAL_SLOT_POSITIONS[index][1]}%" type="button"><img src="${item.image}" alt="${item.name}">${animal.bonus&&!expired?'<span class="animal-merit-star">⭐</span>':""}<small>${expired?"หมดอายุแล้ว":ready?`${item.productName}พร้อมเก็บ`:`${formatAnimalLife(animal.expiresAt-gameNow())}`}</small></button>`;
  }
  return `<button class="animal-add-slot" type="button" data-animal-slot="${index}" style="left:${ANIMAL_SLOT_POSITIONS[index][0]}%;top:${ANIMAL_SLOT_POSITIONS[index][1]}%">+</button>`;
}
function renderAnimalScene(sceneName){
  const nav={chicken:{backText:"กลับแปลงผัก",backAction:returnToFarm,nextText:"คอกต่อไป",nextAction:()=>openScene("fish")},fish:{backText:"กลับไปที่คอกไก่",backAction:()=>openScene("chicken"),nextText:"คอกต่อไป",nextAction:()=>openScene("pig")},pig:{backText:"กลับไปที่บ่อปลา",backAction:()=>openScene("fish"),nextText:"คอกต่อไป",nextAction:()=>openScene("cow")},cow:{nextText:"กลับไปที่แปลงผัก",nextAction:returnToFarm}}[sceneName]||{};
  setSceneNav(nav);processAnimalSystems();const s=ownState||state,item=animalById(sceneName),waiting=Number(s.pendingAnimals[sceneName])||0;
  $("sceneInteractiveLayer").innerHTML=`<div class="animal-ready-banner">${item.name} รอวาง ×${waiting} • ใช้พื้นที่ ${animalPlacedCount(sceneName,s)}/${ANIMAL_CAPACITY}</div><div class="animal-slots">${ANIMAL_SLOT_POSITIONS.map((_,i)=>animalSlotHTML(sceneName,i)).join("")}</div>`;
  document.querySelectorAll("[data-animal-slot]").forEach(b=>b.onclick=()=>showAnimalApprovalChoices(sceneName,Number(b.dataset.animalSlot)));
  document.querySelectorAll("[data-owned-animal]").forEach(b=>b.onclick=()=>showAnimalDetails(sceneName,Number(b.dataset.ownedAnimal)));
  stopSceneTimer();sceneTimer=setInterval(()=>{if(currentScene===sceneName)renderAnimalScene(sceneName)},60000);
}
function showAnimalApprovalChoices(sceneName,slotIndex){
  const s=ownState||state,item=animalById(sceneName);if(!item)return;
  if(s.animals[sceneName][slotIndex]){showAnimalDetails(sceneName,slotIndex);return}
  const waiting=Number(s.pendingAnimals[sceneName])||0;
  if(waiting<=0){message("ยังไม่มีสัตว์รอวาง",`ตอนนี้ไม่มี ${item.name} ที่ได้รับสิทธิ์แล้ว<br>ซื้อเพิ่มได้ที่ร้านค้าสัตว์วิญญาณ`);return}
  $("modalContent").innerHTML=`<section class="feature-panel animal-picker-panel"><h2>วาง ${item.name}</h2><div class="animal-picker-grid single-animal-choice"><button id="placeAnimalBtn" type="button"><img src="${item.image}" alt="${item.name}"><b>${item.name}</b><small>มีรอวาง ×${waiting}<br>อายุจะเริ่มนับทันทีเมื่อกดวาง</small></button></div></section>`;
  openModal();$("placeAnimalBtn").onclick=()=>placeAnimal(sceneName,slotIndex);
}
function placeAnimal(sceneName,slotIndex){
  const s=ownState||state,item=animalById(sceneName),meta=ANIMAL_META[sceneName];if(!item||!meta)return;
  if(s.animals[sceneName][slotIndex])return;if((Number(s.pendingAnimals[sceneName])||0)<=0){message("ไม่มีสัตว์รอวาง","กรุณาซื้อหรือรอการอนุมัติก่อน");return}
  const now=gameNow();s.pendingAnimals[sceneName]-=1;s.animals[sceneName][slotIndex]={name:"",placedAt:now,expiresAt:now+meta.lifeMs,readyAt:now+item.productionMs,bonus:false};save();closeModal();renderAnimalScene(sceneName);showWeatherToast(`🐾 วาง ${item.name} แล้ว`);
}
function processAnimalSystems(){
  const s=ownState||state;if(!s||!s.animals)return;const now=gameNow();
  if(now>=Number(s.animalBonusNextAt||0)){
    const owned=[];SHOP_ITEMS.forEach(item=>s.animals[item.id].forEach((a,i)=>{if(a&&!animalIsExpired(a))owned.push([item.id,i])}));
    owned.forEach(([id,i])=>{if(s.animals[id][i])s.animals[id][i].bonus=false});
    if(owned.length){const count=Math.min(owned.length,randInt(1,3));owned.sort(()=>Math.random()-.5).slice(0,count).forEach(([id,i])=>s.animals[id][i].bonus=true)}
    s.animalBonusNextAt=now+ANIMAL_BONUS_INTERVAL;save();
  }
}
function animalPestleHTML(sceneName,index){
  const animal=(ownState||state).animals[sceneName][index];if(!animal||animalIsExpired(animal)||gameNow()>=Number(animal.readyAt||0))return"";
  const available=Object.entries(PESTLE_ITEMS).filter(([key])=>specialCount(key)>0);if(!available.length)return"";
  return `<div class="animal-boost-panel"><h3>🥄 เร่งผลผลิตสัตว์</h3>${available.map(([key,item])=>`<button type="button" data-use-pestle="${key}"><img src="${item.image}" alt="${item.name}"><span>${item.name}<small>${item.boost}% • มี ×${specialCount(key)}</small></span></button>`).join("")}</div>`;
}
function showAnimalDetails(sceneName,index){
  const s=ownState||state,item=animalById(sceneName),animal=s.animals[sceneName][index];if(!item||!animal)return;
  const expired=animalIsExpired(animal),life=expired?"0 วัน 0 ชม.":formatAnimalLife(animal.expiresAt-gameNow()),productRemaining=Math.max(0,Number(animal.readyAt||0)-gameNow()),ready=!expired&&productRemaining<=0;
  $("modalContent").innerHTML=`<section class="feature-panel animal-detail-panel"><img class="animal-detail-img" src="${item.image}" alt="${item.name}"><h2>${safeHtml(animal.name||item.name)}</h2><p><b>ชนิด:</b> ${item.name}<br><b>อายุคงเหลือ:</b> ${life}<br><b>ผลผลิต:</b> ${expired?"หยุดผลิตแล้ว":ready?`${item.productName} พร้อมเก็บ`:`เหลือ ${formatHM(productRemaining)}`}</p><div class="animal-detail-actions">${expired?`<button id="removeExpiredAnimalBtn" class="danger-action" type="button">นำสัตว์หมดอายุออกจากคอก</button>`:`<button id="renameAnimalBtn" class="secondary-action" type="button">ตั้งชื่อ</button>${animal.bonus?`<button id="collectAnimalBtn" class="primary-spooky-action" type="button">⭐ รับโบนัสกุศล</button>`:ready?`<button id="collectAnimalBtn" class="primary-spooky-action" type="button">เก็บ ${item.productName}</button>`:""}`}</div>${!expired?animalPestleHTML(sceneName,index):""}</section>`;
  openModal();
  if(expired){$("removeExpiredAnimalBtn").onclick=()=>removeExpiredAnimal(sceneName,index);return}
  $("renameAnimalBtn").onclick=()=>renameAnimal(sceneName,index);
  const collect=$("collectAnimalBtn");if(collect)collect.onclick=()=>collectAnimal(sceneName,index);
  document.querySelectorAll("[data-use-pestle]").forEach(btn=>btn.onclick=()=>usePestleOnAnimal(sceneName,index,btn.dataset.usePestle));
}
function renameAnimal(sceneName,index){
  const animal=(ownState||state).animals[sceneName][index];if(!animal)return;const typed=window.prompt("ตั้งชื่อสัตว์เลี้ยง",animal.name||"");if(typed===null)return;animal.name=typed.trim().slice(0,16);save();showAnimalDetails(sceneName,index);
}
function removeExpiredAnimal(sceneName,index){
  const s=ownState||state,animal=s.animals[sceneName][index];if(!animal||!animalIsExpired(animal))return;s.animals[sceneName][index]=null;save();closeModal();renderAnimalScene(sceneName);showWeatherToast("👻 วิญญาณกลับภพแล้ว • ช่องว่างพร้อมใช้งาน");
}
function collectAnimal(sceneName,index){
  const s=ownState||state,item=animalById(sceneName),animal=s.animals[sceneName][index];if(!item||!animal)return;
  if(animalIsExpired(animal)){showAnimalDetails(sceneName,index);return}
  if(animal.bonus){const merit=randInt(1,2);animal.bonus=false;s.merit+=merit;save();updateMeritUI();showAnimalDetails(sceneName,index);showWeatherToast(`⭐ +${merit} กุศล`);return}
  if(gameNow()<Number(animal.readyAt||0)){message("ยังผลิตไม่เสร็จ",`${item.productName} พร้อมใน ${formatHM(animal.readyAt-gameNow())}`);return}
  let qty=1;if(Math.random()<.12)qty=Math.random()<.82?2:3;
  s.animalProducts[item.product]=(s.animalProducts[item.product]||0)+qty;animal.readyAt=gameNow()+item.productionMs;incrementMissionOn(s,"collectAnimal",1);save();closeModal();renderAnimalScene(sceneName);message("เก็บผลผลิตสำเร็จ",`${item.productName} ×${qty} เพิ่มเข้ากระเป๋าแล้ว`);
}
function usePestleOnAnimal(sceneName,index,key){
  const s=ownState||state,item=PESTLE_ITEMS[key],animal=s.animals[sceneName][index];if(!item||!animal||animalIsExpired(animal)||specialCount(key)<=0)return;
  const rem=Math.max(0,Number(animal.readyAt||0)-gameNow());if(rem<=0){message("ผลผลิตพร้อมแล้ว","ไม่จำเป็นต้องใช้สากกะเบือ");return}
  if(item.boost===100)animal.readyAt=gameNow();else animal.readyAt=gameNow()+Math.max(1000,Math.round(rem*(1-item.boost/100)));
  s.specials[key]-=1;save();showAnimalDetails(sceneName,index);showWeatherToast(`🥄 ใช้ ${item.name} แล้ว • ${item.boost}%`);
}

async function showShop(tab="animals"){
  if(guardResting())return;const s=ownState||state;ensureDailyLimitsFor(s);
  const animalCards=SHOP_ITEMS.map(item=>{const meta=ANIMAL_META[item.id],used=animalCapacityUsed(item.id,s),full=used>=ANIMAL_CAPACITY;return `<article class="shop-card"><img class="shop-animal-img" src="${item.image}" alt="${item.name}"><b>${item.name}</b><small class="shop-price">${meta.price} ⭐️ • ใช้พื้นที่ ${used}/${ANIMAL_CAPACITY}</small><button class="shop-worship-button" type="button" data-buy-animal="${item.id}" ${full?"disabled":""}>${full?"คอกเต็มแล้ว":"ส่งคำขอซื้อ"}</button></article>`}).join("");
  const specialUsed=Number(s.dailyLimits.specialPurchases)||0,specialRemain=Math.max(0,SPECIAL_DAILY_LIMIT-specialUsed);
  const specialCards=SPECIAL_SHOP_KEYS.map(key=>{const item=SPECIAL_ITEMS[key];return `<article class="shop-card"><img class="shop-animal-img" src="${item.image}" alt="${item.name}"><b>${item.name}</b><small class="shop-price">20 ⭐️ • ${item.boost}%</small><button class="shop-worship-button" type="button" data-buy-special="${key}" ${specialRemain<=0?"disabled":""}>${specialRemain<=0?"ครบลิมิตวันนี้แล้ว":"ส่งคำขอซื้อ"}</button></article>`}).join("");
  $("modalContent").innerHTML=`<section class="feature-panel shop-panel"><button id="stableEntranceBtn" class="stable-entrance-button" type="button">ทางเข้าโรงเรือน</button><h2>🕯️ ร้านค้า</h2><div class="shop-category-tabs"><button type="button" data-shop-tab="animals" class="${tab==="animals"?"active":""}">🐾 สัตว์วิญญาณ</button><button type="button" data-shop-tab="specials" class="${tab==="specials"?"active":""}">🎁 ของพิเศษ</button></div>${tab==="animals"?`<p class="feature-subtitle">ดาวเป็นราคาที่แสดงเท่านั้น • ชำระกับยัยหนูทาง Facebook แล้วรออนุมัติ</p><div class="shop-grid">${animalCards}</div>`:`<p class="feature-subtitle">ซื้อของพิเศษรวมได้วันละ ${SPECIAL_DAILY_LIMIT} ชิ้น • วันนี้ใช้ ${specialUsed}/${SPECIAL_DAILY_LIMIT}</p><div class="shop-grid">${specialCards}</div>`}</section>`;
  $("stableEntranceBtn").onclick=()=>{closeModal();openScene("chicken")};
  document.querySelectorAll("[data-shop-tab]").forEach(btn=>btn.onclick=()=>showShop(btn.dataset.shopTab));
  document.querySelectorAll("[data-buy-animal]").forEach(btn=>btn.onclick=()=>requestAnimalPurchase(btn.dataset.buyAnimal));
  document.querySelectorAll("[data-buy-special]").forEach(btn=>btn.onclick=()=>requestSpecialPurchase(btn.dataset.buySpecial));openModal();
}
async function requestAnimalPurchase(type){
  if(!cloudReady){message("ยังซื้อไม่ได้","กรุณาเชื่อม Firebase ก่อน");return}const item=animalById(type),meta=ANIMAL_META[type];if(!item||!meta)return;
  try{
    const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey),requestRef=fs.doc(fs.collection(db,"purchaseRequests"));let next;
    await fs.runTransaction(db,async tx=>{
      const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(snap.data(),currentMember);
      const used=animalPlacedCount(type,s)+(Number(s.pendingAnimals[type])||0)+(Number(s.purchasePendingCounts[type])||0);if(used>=ANIMAL_CAPACITY)throw new Error("คอกสัตว์ชนิดนี้เต็มแล้ว");
      s.purchasePendingCounts[type]=(Number(s.purchasePendingCounts[type])||0)+1;next=s;
      tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(requestRef,{category:"animal",itemKey:type,itemName:item.name,price:meta.price,qty:1,status:"pending",memberKey:currentMemberKey,memberName:currentMember,dateKey:currentBangkokDateKey(),createdAt:fs.serverTimestamp()});
    });
    ownState=normalizeState(next,currentMember);state=ownState;message("🐾 ส่งคำขอแล้ว",`${item.name} ${meta.price}⭐️\nรอการอนุมัติจากยัยหนู`);refreshNotificationBadge();
  }catch(error){message("ส่งคำขอไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function requestSpecialPurchase(key){
  if(!cloudReady){message("ยังซื้อไม่ได้","กรุณาเชื่อม Firebase ก่อน");return}const item=SPECIAL_ITEMS[key];if(!item||!SPECIAL_SHOP_KEYS.includes(key))return;
  try{
    const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey),requestRef=fs.doc(fs.collection(db,"purchaseRequests"));let next;
    await fs.runTransaction(db,async tx=>{
      const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(snap.data(),currentMember);ensureDailyLimitsFor(s);
      if((Number(s.dailyLimits.specialPurchases)||0)>=SPECIAL_DAILY_LIMIT)throw new Error(`ซื้อของพิเศษครบ ${SPECIAL_DAILY_LIMIT} ชิ้นสำหรับวันนี้แล้ว`);
      s.dailyLimits.specialPurchases+=1;next=s;
      tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(requestRef,{category:"special",itemKey:key,itemName:item.name,price:20,qty:1,status:"pending",memberKey:currentMemberKey,memberName:currentMember,dateKey:currentBangkokDateKey(),createdAt:fs.serverTimestamp()});
    });
    ownState=normalizeState(next,currentMember);state=ownState;message("🎁 ส่งคำขอแล้ว",`${item.name} 20⭐️\nรอการอนุมัติจากยัยหนู`);refreshNotificationBadge();
  }catch(error){message("ส่งคำขอไม่ได้",error.message||"กรุณาลองใหม่")}
}

function dishCountInState(recipeId,s){return Array.isArray(s?.dishes)?s.dishes.filter(d=>d&&d.id===recipeId).length:0}
function removeDishesFromState(s,recipeId,qty){let left=qty;s.dishes=s.dishes.filter(d=>{if(left>0&&d?.id===recipeId){left--;return false}return true});return left===0}
function giftableEntries(s=ownState||state){
  const entries=[];
  Object.entries(ANIMAL_PRODUCTS).forEach(([key,item])=>{const count=Number(s.animalProducts[key])||0;if(count>0)entries.push({type:"product",key,name:item.name,image:item.image,count})});
  RECIPES.forEach(r=>{const count=dishCountInState(r.id,s);if(count>0)entries.push({type:"dish",key:r.id,name:r.name,image:r.image,count})});
  Object.entries(SPECIAL_ITEMS).forEach(([key,item])=>{const count=Number(s.specials[key])||0;if(count>0)entries.push({type:"special",key,name:item.name,image:item.image,count})});
  return entries;
}
function addGiftItemToState(s,gift){
  const qty=Math.max(1,Number(gift.qty)||1);
  if(gift.itemType==="product")s.animalProducts[gift.itemKey]=(Number(s.animalProducts[gift.itemKey])||0)+qty;
  else if(gift.itemType==="special")s.specials[gift.itemKey]=(Number(s.specials[gift.itemKey])||0)+qty;
  else if(gift.itemType==="dish"){
    const r=recipeById(gift.itemKey);if(!r)throw new Error("ไม่พบเมนูอาหาร");for(let i=0;i<qty;i++)s.dishes.push({id:r.id,name:r.name,image:r.image,time:new Date().toLocaleString("th-TH")});
  }else throw new Error("ประเภทของขวัญไม่รองรับ");
}
function removeGiftItemFromState(s,itemType,itemKey,qty){
  qty=Math.max(1,Number(qty)||1);
  if(itemType==="product"){if((Number(s.animalProducts[itemKey])||0)<qty)return false;s.animalProducts[itemKey]-=qty;return true}
  if(itemType==="special"){if((Number(s.specials[itemKey])||0)<qty)return false;s.specials[itemKey]-=qty;return true}
  if(itemType==="dish"){if(dishCountInState(itemKey,s)<qty)return false;return removeDishesFromState(s,itemKey,qty)}
  return false;
}

async function showFriends(){
  if(guardResting())return;
  let profileMap={};
  if(cloudReady){
    try{const {db,fs}=await getFirebaseContext(),snap=await fs.getDocs(fs.collection(db,"publicProfiles"));snap.forEach(docSnap=>profileMap[docSnap.id]=docSnap.data())}catch(error){console.warn("rank load",error)}
  }
  const rows=Object.keys(MEMBERS).filter(name=>name!=="Aida").map(name=>{const key=memberKeyFromName(name),p=profileMap[key]||{};return{name,key,merit:Number(p.merit??300),initialized:Boolean(p.initialized)}}).sort((a,b)=>b.merit-a.merit||a.name.localeCompare(b.name));
  $("modalContent").innerHTML=`<section class="feature-panel friends-panel"><h2>👥 เพื่อน & Rank กุศล</h2><p class="feature-subtitle">เรียงจากคะแนนกุศลมากที่สุด</p><div class="friend-list friend-rank-list">${rows.map((row,index)=>`<div class="friend-row friend-rank-row"><span class="friend-rank">#${index+1}</span><span class="friend-avatar" aria-hidden="true">👻</span><span class="friend-info"><b>${safeHtml(row.name)}</b><small>🙏 ${row.merit} กุศล${row.initialized?"":" • ยังไม่เข้าสวนครั้งแรก"}</small></span>${row.name===currentMember?`<span class="friend-self">คุณ</span>`:`<span class="friend-actions"><button type="button" data-visit-friend="${row.key}" data-friend-name="${safeHtml(row.name)}" ${!row.initialized?"disabled":""}>เยี่ยมสวน</button><button type="button" data-gift-friend="${row.key}" data-friend-name="${safeHtml(row.name)}">ส่งของ</button></span>`}</div>`).join("")}</div></section>`;
  document.querySelectorAll("[data-visit-friend]").forEach(btn=>btn.onclick=()=>visitFriend(btn.dataset.visitFriend,btn.dataset.friendName));
  document.querySelectorAll("[data-gift-friend]").forEach(btn=>btn.onclick=()=>showGiftComposer(btn.dataset.giftFriend,btn.dataset.friendName));openModal();
}
async function showGiftComposer(targetKey,targetName){
  const s=ownState||state;ensureDailyLimitsFor(s);const entries=giftableEntries(s),remain=Math.max(0,FRIEND_GIFT_DAILY_LIMIT-(Number(s.dailyLimits.giftsSent)||0));
  if(!entries.length){message("ยังส่งของขวัญไม่ได้","ในกระเป๋ายังไม่มีอาหาร ผลผลิตสัตว์ หรือของพิเศษสำหรับส่ง");return}
  if(remain<=0){message("ครบลิมิตวันนี้แล้ว",`วันนี้ส่งของขวัญครบ ${FRIEND_GIFT_DAILY_LIMIT} ชิ้นแล้ว`);return}
  $("modalContent").innerHTML=`<section class="feature-panel gift-panel"><h2>🎁 ส่งของให้ ${safeHtml(targetName)}</h2><p class="feature-subtitle">ส่งได้รวมวันละ ${FRIEND_GIFT_DAILY_LIMIT} ชิ้น • เหลือ ${remain}</p><div class="gift-item-list">${entries.map((e,i)=>`<label class="gift-item-option"><input type="radio" name="giftItem" value="${i}" ${i===0?"checked":""}><img src="${e.image}" alt="${e.name}"><span>${safeHtml(e.name)}<small>มี ×${e.count}</small></span></label>`).join("")}</div><label class="gift-qty-label">จำนวน <input id="giftQty" type="number" min="1" max="${remain}" value="1"></label><button id="sendFriendGiftBtn" class="primary-spooky-action gift-send-btn" type="button">ส่งของขวัญ</button></section>`;
  openModal();$("sendFriendGiftBtn").onclick=()=>{const idx=Number(document.querySelector('input[name="giftItem"]:checked')?.value||0),entry=entries[idx],qty=Math.max(1,Number($("giftQty").value)||1);sendFriendGift(targetKey,targetName,entry,qty)};
}
async function sendFriendGift(targetKey,targetName,entry,qty){
  if(!cloudReady||!entry)return;qty=Math.max(1,Math.floor(qty));
  try{
    const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey),giftRef=fs.doc(fs.collection(db,"gifts")),mailRef=fs.doc(db,"mailboxes",targetKey,"items",giftRef.id);let next;
    await fs.runTransaction(db,async tx=>{
      const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟผู้ส่ง");const s=normalizeState(snap.data(),currentMember);ensureDailyLimitsFor(s);
      const remain=FRIEND_GIFT_DAILY_LIMIT-(Number(s.dailyLimits.giftsSent)||0);if(qty>remain)throw new Error(`วันนี้ส่งได้อีก ${Math.max(0,remain)} ชิ้น`);
      if(!removeGiftItemFromState(s,entry.type,entry.key,qty))throw new Error("ของในกระเป๋าไม่พอ");s.dailyLimits.giftsSent+=qty;incrementMissionOn(s,"sendFriendGift",1);next=s;
      const gift={fromKey:currentMemberKey,fromName:currentMember,toKey:targetKey,toName:targetName,itemType:entry.type,itemKey:entry.key,itemName:entry.name,itemImage:entry.image,qty,status:"pending",createdAt:fs.serverTimestamp()};
      tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(giftRef,gift);tx.set(mailRef,{source:"friend",type:"gift",giftId:giftRef.id,fromKey:currentMemberKey,fromName:currentMember,title:`${currentMember} ส่งของขวัญให้คุณ 🎁`,text:`${entry.name} ×${qty}`,read:false,createdAt:fs.serverTimestamp()});
    });
    ownState=normalizeState(next,currentMember);if(!visitContext)state=ownState;closeModal();message("🎁 ส่งของขวัญแล้ว",`${entry.name} ×${qty} ส่งให้ ${targetName} แล้ว\nของถูกหักจากกระเป๋าของคุณเรียบร้อย`);
  }catch(error){message("ส่งของขวัญไม่ได้",error.message||"กรุณาลองใหม่")}
}

function ensurePlotPhaseStandalone(plot){
  if(!plot?.crop)return plot;const p=normalizePlot(cloneData(plot));
  if(p.phase==="growing1"&&gameNow()>=Number(p.phaseEndsAt||0)){p.phase="needsWater";p.phaseEndsAt=0}
  else if(p.phase==="growing2"&&gameNow()>=Number(p.phaseEndsAt||0)){p.phase="ready";p.phaseEndsAt=0}
  return p;
}
async function visitFriend(targetKey,targetName){
  if(!cloudReady){message("ยังเยี่ยมสวนไม่ได้","กรุณาเชื่อม Firebase ก่อน");return}
  try{
    const {db,fs}=await getFirebaseContext(),snap=await fs.getDoc(fs.doc(db,"gardens",targetKey));if(!snap.exists())throw new Error("เพื่อนคนนี้ยังไม่เปิดสวนครั้งแรก");
    ownState=ownState||state;visitContext={memberKey:targetKey,name:targetName};state=fresh(targetName);state.plots=(snap.data().plots||[]).map(normalizePlot);while(state.plots.length<PLOT_COUNT)state.plots.push(emptyPlot());
    closeModal();$("gameScreen").classList.add("visiting-friend");showVisitorBanner(targetName);draw();
  }catch(error){message("เข้าเยี่ยมสวนไม่ได้",error.message||"กรุณาลองใหม่")}
}
function showVisitorBanner(name){
  let el=$("visitorBanner");if(!el){el=document.createElement("div");el.id="visitorBanner";el.className="visitor-banner";$("gameScreen").appendChild(el)}
  el.innerHTML=`<span>👥 กำลังเยี่ยมสวน ${safeHtml(name)}</span><button id="returnOwnGardenBtn" type="button">กลับสวนของฉัน</button>`;$("returnOwnGardenBtn").onclick=returnFromFriendVisit;
}
function returnFromFriendVisit(){
  if(!visitContext)return;visitContext=null;state=ownState;$("gameScreen").classList.remove("visiting-friend");$("visitorBanner")?.remove();draw();
}
async function tapFriendPlot(index){
  if(!visitContext)return;const plot=state.plots[index];ensurePlotPhase(plot);
  if(plot?.phase!=="needsWater"&&plot?.phase!=="worm"){message("เยี่ยมสวนเพื่อน","คุณทำได้เฉพาะรดน้ำต้นไม้ที่ต้องการน้ำ หรือกำจัดหนอนให้เพื่อนเท่านั้น");return}
  const action=plot.phase==="needsWater"?"water":"worm",targetKey=visitContext.memberKey,targetName=visitContext.name;
  try{
    const {db,fs}=await getFirebaseContext(),gardenRef=fs.doc(db,"gardens",targetKey),ownSaveRef=fs.doc(db,"saves",currentMemberKey),mailRef=fs.doc(fs.collection(db,"mailboxes",targetKey,"items"));let nextOwn,newPlots;
    await fs.runTransaction(db,async tx=>{
      const [gardenSnap,ownSnap]=await Promise.all([tx.get(gardenRef),tx.get(ownSaveRef)]);if(!gardenSnap.exists()||!ownSnap.exists())throw new Error("ข้อมูลสวนไม่พร้อม");
      const plots=(gardenSnap.data().plots||[]).map(ensurePlotPhaseStandalone);const p=plots[index];if(!p?.crop)throw new Error("แปลงนี้ว่างแล้ว");
      const own=normalizeState(ownSnap.data(),currentMember);
      if(action==="water"){
        if(p.phase!=="needsWater")throw new Error("ต้นนี้ไม่ต้องการน้ำแล้ว");const crop=CROPS[p.crop],finalMs=Math.max(60000,crop.totalMs-crop.waterMs);p.wateredAt=gameNow();
        if(Math.random()<Number(crop.wormChance||0)){p.phase="worm";p.worm=true;p.phaseEndsAt=0}else{p.phase="growing2";p.worm=false;p.phaseEndsAt=gameNow()+finalMs}
        incrementMissionOn(own,"waterFriends",1);
      }else{
        if(p.phase!=="worm")throw new Error("หนอนถูกกำจัดไปแล้ว");const crop=CROPS[p.crop];p.phase="growing2";p.worm=false;p.phaseEndsAt=gameNow()+Math.max(60000,crop.totalMs-crop.waterMs);incrementMissionOn(own,"clearWorms",1);
      }
      plots[index]=p;nextOwn=own;newPlots=plots;
      tx.set(gardenRef,{memberKey:targetKey,displayName:targetName,plots:cloneData(plots),updatedAt:fs.serverTimestamp()},{merge:true});
      tx.set(ownSaveRef,{...cloneData(own),updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(mailRef,{source:"friend",type:action==="water"?"friendWater":"friendWorm",fromKey:currentMemberKey,fromName:currentMember,title:action==="water"?`${currentMember} เข้ามารดน้ำพืชพันธุ์ให้คุณ 💧`:`${currentMember} เข้ามากำจัดหนอนให้คุณ 🐛`,text:"",read:false,createdAt:fs.serverTimestamp()});
    });
    ownState=normalizeState(nextOwn,currentMember);state.plots=newPlots.map(normalizePlot);draw();showWeatherToast(action==="water"?"💧 รดน้ำให้เพื่อนแล้ว":"🐛 กำจัดหนอนให้เพื่อนแล้ว");
  }catch(error){message("ช่วยสวนไม่สำเร็จ",error.message||"กรุณาลองใหม่")}
}

function normalizeSharedCoconut(data){
  const trees=Array.isArray(data?.trees)?data.trees.slice(0,6):[];while(trees.length<6)trees.push({nextAt:0,lastByName:"",lastByKey:""});
  return{trees:trees.map(t=>({nextAt:Number(t?.nextAt)||0,lastByName:String(t?.lastByName||""),lastByKey:String(t?.lastByKey||"")}))};
}
async function loadSharedCoconut(){
  const {db,fs}=await getFirebaseContext(),ref=fs.doc(db,"shared","coconutGarden"),snap=await fs.getDoc(ref);
  if(!snap.exists()){
    const initial=normalizeSharedCoconut(null);await fs.setDoc(ref,{...initial,updatedAt:fs.serverTimestamp()});sharedCoconutCache=initial;
  }else sharedCoconutCache=normalizeSharedCoconut(snap.data());
  return sharedCoconutCache;
}
async function renderCoconutScene(){
  setSceneNav({backText:"กลับแปลงผัก",backAction:returnToFarm});
  if(!cloudReady){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">กำลังเชื่อมสวนมะพร้าวส่วนกลาง...</div>';return}
  try{await loadSharedCoconut()}catch(error){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">โหลดสวนมะพร้าวไม่สำเร็จ</div>';return}
  const s=ownState||state,quotaActive=Number(s.coconutQuotaResetAt||0)>gameNow(),used=quotaActive?(Number(s.coconutQuotaCount)||0):0;
  $("sceneInteractiveLayer").innerHTML=`<div class="coconut-quota-label">🥥 โควตารอบนี้ ${used}/${COCONUT_QUOTA_PER_ROUND}</div><button id="coconutHistoryBtn" class="coconut-history-btn" type="button">ประวัติ 50 รายการ</button>${COCONUT_TREE_POSITIONS_V1.map(([left,top,width,height],i)=>{const tree=sharedCoconutCache.trees[i],rem=Math.max(0,tree.nextAt-gameNow());const label=rem>0?`${tree.lastByName||"มีคน"} สอยแล้ว • ${coconutRemainingText(rem)}`:"พร้อมสอย";return `<button class="coconut-tree-hotspot" type="button" data-coconut-tree="${i}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%"><small>${safeHtml(label)}</small></button>`}).join("")}<button id="coconutBoatHotspot" class="coconut-boat-hotspot" type="button" aria-label="คราฟไอเท็มพิเศษ"><span class="coconut-boat-label">คราฟไอเท็มพิเศษ</span></button>`;
  document.querySelectorAll("[data-coconut-tree]").forEach(btn=>btn.onclick=()=>harvestCoconutTree(Number(btn.dataset.coconutTree)));$("coconutBoatHotspot").onclick=showCoconutCraft;$("coconutHistoryBtn").onclick=showCoconutHistory;
  stopSceneTimer();sceneTimer=setInterval(()=>{if(currentScene!=="coconut"){stopSceneTimer();return}renderCoconutScene()},60000);
}
async function harvestCoconutTree(index){
  if(guardResting())return;if(!cloudReady){message("ยังสอยไม่ได้","กรุณาเชื่อม Firebase ก่อน");return}
  const rewardKey=rollCoconutReward(),reward=SPECIAL_ITEMS[rewardKey],now=gameNow();
  try{
    const {db,fs}=await getFirebaseContext(),gardenRef=fs.doc(db,"shared","coconutGarden"),saveRef=fs.doc(db,"saves",currentMemberKey),historyRef=fs.doc(fs.collection(db,"coconutHistory"));let nextState,nextGarden;
    await fs.runTransaction(db,async tx=>{
      const [gardenSnap,saveSnap]=await Promise.all([tx.get(gardenRef),tx.get(saveRef)]);if(!saveSnap.exists())throw new Error("ไม่พบเซฟสมาชิก");
      const garden=normalizeSharedCoconut(gardenSnap.exists()?gardenSnap.data():null),s=normalizeState(saveSnap.data(),currentMember);
      if(Number(s.coconutQuotaResetAt||0)<=now){s.coconutQuotaResetAt=0;s.coconutQuotaCount=0}
      if((Number(s.coconutQuotaCount)||0)>=COCONUT_QUOTA_PER_ROUND)throw new Error(`รอบนี้คุณสอยครบ 2 ต้นแล้ว กลับมาใหม่ในอีก ${coconutRemainingText(Number(s.coconutQuotaResetAt||0)-now)}`);
      const tree=garden.trees[index];if(!tree)throw new Error("ไม่พบต้นมะพร้าว");if(Number(tree.nextAt)>now)throw new Error(`${tree.lastByName||"มีคน"} สอยต้นนี้ไปแล้ว กลับมาใหม่ในอีก ${coconutRemainingText(tree.nextAt-now)}`);
      tree.nextAt=now+COCONUT_TREE_COOLDOWN;tree.lastByName=currentMember;tree.lastByKey=currentMemberKey;if((Number(s.coconutQuotaCount)||0)===0)s.coconutQuotaResetAt=now+COCONUT_QUOTA_WINDOW_MS;s.coconutQuotaCount+=1;s.specials[rewardKey]=(Number(s.specials[rewardKey])||0)+1;incrementMissionOn(s,"harvestCoconut",1);nextState=s;nextGarden=garden;
      tx.set(gardenRef,{...garden,updatedAt:fs.serverTimestamp()},{merge:false});tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(historyRef,{memberKey:currentMemberKey,memberName:currentMember,rewardKey,rewardName:reward.name,rewardBoost:reward.boost,createdAt:fs.serverTimestamp()});
    });
    ownState=normalizeState(nextState,currentMember);state=ownState;sharedCoconutCache=nextGarden;renderCoconutScene();message("🥥 สอยมะพร้าวสำเร็จ",`ยินดีด้วยนะคะ คุณได้รับ ${reward.name} ×1<br>เก็บไว้ใน กระเป๋า → ของพิเศษ แล้ว`);
  }catch(error){message("🥥 สอยมะพร้าวไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function showCoconutHistory(){
  try{
    const {db,fs}=await getFirebaseContext(),q=fs.query(fs.collection(db,"coconutHistory"),fs.orderBy("createdAt","desc"),fs.limit(30)),snap=await fs.getDocs(q),rows=[];snap.forEach(d=>rows.push(d.data()));
    $("modalContent").innerHTML=`<section class="feature-panel coconut-history-panel"><h2>🥥 ประวัติสวนมะพร้าว</h2><p class="feature-subtitle">50 รายการล่าสุด</p><div class="notification-list">${rows.length?rows.map(r=>`<div class="notification-card"><b>${safeHtml(r.memberName||"สมาชิก")}</b><span>ได้รับ ${safeHtml(r.rewardName||`มะพร้าว ${r.rewardBoost||""}%`)}</span><small>${bangkokTimeText(r.createdAt)} น.</small></div>`).join(""):'<p class="empty-feature">ยังไม่มีประวัติ</p>'}</div></section>`;openModal();
  }catch(error){message("เปิดประวัติไม่ได้",error.message||"กรุณาลองใหม่")}
}

function coconutIngredientText(item){if(!item.need)return"ยังไม่เปิดให้คราฟน๊าา";return Object.entries(item.need).map(([key,count])=>`<span>${ANIMAL_PRODUCTS[key].icon} ${ANIMAL_PRODUCTS[key].name} ×${count}</span>`).join("")}
function pestleIngredientText(item){
  const parts=[];if(item.dishAny)parts.push(`<span>🍲 อาหารที่คราฟแล้ว อะไรก็ได้ ×${item.dishAny}</span>`);if(item.meritNeed)parts.push(`<span>🙏 คะแนนกุศล ×${item.meritNeed}</span>`);Object.entries(item.need||{}).forEach(([key,count])=>parts.push(`<span>${ANIMAL_PRODUCTS[key].icon} ${ANIMAL_PRODUCTS[key].name} ×${count}</span>`));return parts.join("")||"ยังไม่เปิดให้คราฟน๊าา";
}
function showCoconutCraft(){
  if(guardResting())return;
  const coconutCards=Object.entries(COCONUT_ITEMS).map(([key,item])=>`<article class="coconut-craft-card"><div class="coconut-chance">${item.locked?"🔒":`🎲 ${item.chance}%`}</div><img src="${item.image}" alt="${item.name}"><h3>${item.name}</h3><p>${item.description}</p><div class="coconut-needs">${coconutIngredientText(item)}</div><button type="button" data-coconut-craft="${key}" ${item.locked?"disabled":""}>${item.locked?"ซื้อได้ที่ร้านของพิเศษ":"คราฟ"}</button></article>`).join("");
  const pestleCards=Object.entries(PESTLE_ITEMS).map(([key,item])=>`<article class="coconut-craft-card"><div class="coconut-chance">${item.locked?"🔒":"🎲 100%"}</div><img src="${item.image}" alt="${item.name}"><h3>${item.name}</h3><p>${item.description}</p><div class="coconut-needs">${pestleIngredientText(item)}</div><button type="button" data-pestle-craft="${key}" ${item.locked?"disabled":""}>${item.locked?"ซื้อได้ที่ร้านของพิเศษ":"คราฟ"}</button></article>`).join("");
  $("modalContent").innerHTML=`<section class="feature-panel coconut-craft-panel"><h2>🥥 คราฟไอเท็มพิเศษ</h2><div class="special-craft-section-title">มะพร้าวเร่งพืช</div><div class="coconut-craft-grid">${coconutCards}</div><div class="special-craft-section-title">สากกะเบือเร่งผลผลิตสัตว์</div><div class="coconut-craft-grid">${pestleCards}</div><button id="coconutCraftBackBtn" class="coconut-craft-back" type="button">กลับ</button></section>`;
  document.querySelectorAll("[data-coconut-craft]").forEach(btn=>btn.onclick=()=>craftCoconut(btn.dataset.coconutCraft));document.querySelectorAll("[data-pestle-craft]").forEach(btn=>btn.onclick=()=>craftPestle(btn.dataset.pestleCraft));$("coconutCraftBackBtn").onclick=()=>{closeModal();renderCoconutScene()};openModal();
}
function canCraftCoconut(item){return item.need&&Object.entries(item.need).every(([key,count])=>(Number((ownState||state).animalProducts[key])||0)>=count)}
function craftCoconut(key){
  const s=ownState||state,item=COCONUT_ITEMS[key];if(!item||item.locked)return;if(!canCraftCoconut(item)){message("วัตถุดิบยังไม่ครบ","วัตถุดิบยังไม่ครบ");return}
  Object.entries(item.need).forEach(([product,count])=>s.animalProducts[product]-=count);const success=Math.random()*100<item.chance;
  if(success){s.specials[key]=(s.specials[key]||0)+1;save();message("คราฟสำเร็จ",`ยินดีด้วยนะคะ คุณได้รับ ${item.name} ×1<br>เก็บไว้ใน กระเป๋า → ของพิเศษ แล้ว`)}else{save();message("คราฟไม่สำเร็จ","รอบนี้คราฟไม่สำเร็จ วัตถุดิบที่ใช้ถูกหักไปแล้วค่ะ")}
}
function craftPestle(key){
  const s=ownState||state,item=PESTLE_ITEMS[key];if(!item||item.locked)return;
  if(item.dishAny&&s.dishes.length<item.dishAny){message("วัตถุดิบยังไม่ครบ",`ต้องมีอาหารที่คราฟแล้วอย่างน้อย ${item.dishAny} ชิ้น`);return}
  if(item.meritNeed&&(Number(s.merit)||0)<item.meritNeed){message("กุศลไม่พอ",`ต้องใช้ ${item.meritNeed} คะแนนกุศล`);return}
  if(!Object.entries(item.need||{}).every(([k,n])=>(Number(s.animalProducts[k])||0)>=n)){message("วัตถุดิบยังไม่ครบ","ผลผลิตสัตว์ยังไม่ครบตามสูตร");return}
  if(item.dishAny)s.dishes.splice(0,item.dishAny);if(item.meritNeed)s.merit-=item.meritNeed;Object.entries(item.need||{}).forEach(([k,n])=>s.animalProducts[k]-=n);s.specials[key]=(s.specials[key]||0)+1;save();updateMeritUI();message("คราฟสำเร็จ",`ยินดีด้วยนะคะ คุณได้รับ ${item.name} ×1<br>โอกาสสำเร็จ 100%`);
}

const broadcastClaimCache=new Map();
let notificationBadgeInFlight=null;
let notificationBadgeLastAt=0;
const NOTIFICATION_BADGE_MIN_INTERVAL_MS=12000;
function broadcastClaimCacheKey(id){return `${currentMemberKey}:${id}`}
async function fetchBroadcastClaimCached(broadcastId){
  const key=broadcastClaimCacheKey(broadcastId);
  if(broadcastClaimCache.has(key))return broadcastClaimCache.get(key);
  const claim=await fetchBroadcastClaim(broadcastId);
  broadcastClaimCache.set(key,claim||null);
  return claim||null;
}

async function fetchMailboxItems(){
  if(!cloudReady||!currentMemberKey)return[];const {db,fs}=await getFirebaseContext(),ref=fs.collection(db,"mailboxes",currentMemberKey,"items");
  try{const snap=await fs.getDocs(fs.query(ref,fs.orderBy("createdAt","desc"),fs.limit(60))),rows=[];snap.forEach(d=>rows.push({id:d.id,...d.data()}));return rows}catch{const snap=await fs.getDocs(ref),rows=[];snap.forEach(d=>rows.push({id:d.id,...d.data()}));return rows.sort((a,b)=>timestampMillis(b.createdAt)-timestampMillis(a.createdAt)).slice(0,100)}
}
async function fetchBroadcasts(){
  if(!cloudReady)return[];const {db,fs}=await getFirebaseContext();try{const snap=await fs.getDocs(fs.query(fs.collection(db,"broadcasts"),fs.orderBy("createdAt","desc"),fs.limit(50))),rows=[];snap.forEach(d=>rows.push({id:d.id,...d.data()}));return rows}catch{const snap=await fs.getDocs(fs.collection(db,"broadcasts")),rows=[];snap.forEach(d=>rows.push({id:d.id,...d.data()}));return rows.sort((a,b)=>timestampMillis(b.createdAt)-timestampMillis(a.createdAt)).slice(0,50)}
}
async function fetchBroadcastClaim(broadcastId){
  const {db,fs}=await getFirebaseContext(),snap=await fs.getDoc(fs.doc(db,"broadcasts",broadcastId,"claims",currentMemberKey));return snap.exists()?snap.data():null;
}
async function refreshNotificationBadge(force=false){
  const badge=$("notificationBadge");if(!badge)return;if(!cloudReady){badge.classList.add("hidden");return}
  const now=Date.now();
  if(!force&&notificationBadgeInFlight)return notificationBadgeInFlight;
  if(!force&&now-notificationBadgeLastAt<NOTIFICATION_BADGE_MIN_INTERVAL_MS)return;
  notificationBadgeInFlight=(async()=>{
    try{
      const [mail,broadcasts]=await Promise.all([fetchMailboxItems(),fetchBroadcasts()]);let count=mail.filter(x=>!x.read).length;const lastSeen=Number((ownState||state)?.lastSeenYainooAt)||0;count+=broadcasts.filter(b=>timestampMillis(b.createdAt)>lastSeen).length;
      if(currentMember==="Aida"&&adminProfile?.role==="admin"){
        const {db,fs}=await getFirebaseContext(),snap=await fs.getDocs(fs.query(fs.collection(db,"purchaseRequests"),fs.where("status","==","pending")));count+=snap.size;
      }
      badge.textContent=String(count);badge.classList.toggle("hidden",count<=0);notificationBadgeLastAt=Date.now();
    }catch(error){console.warn("notification badge",error)}
  })();
  try{return await notificationBadgeInFlight}finally{notificationBadgeInFlight=null}
}
function startNotificationPolling(){
  if(notificationTimer)clearInterval(notificationTimer);refreshNotificationBadge();notificationTimer=setInterval(refreshNotificationBadge,60000);
}
async function markMailboxRead(items){
  const unread=items.filter(x=>!x.read);if(!unread.length)return;try{const {db,fs}=await getFirebaseContext(),batch=fs.writeBatch(db);unread.forEach(item=>batch.set(fs.doc(db,"mailboxes",currentMemberKey,"items",item.id),{read:true},{merge:true}));await batch.commit()}catch(error){console.warn("mark read",error)}
}
async function showNotifications(tab="friend"){
  if(!cloudReady){message("การแจ้งเตือนยังไม่พร้อม","กรุณาเชื่อม Firebase ก่อน");return}
  try{
    const [mail,broadcasts]=await Promise.all([fetchMailboxItems(),fetchBroadcasts()]);const friendItems=mail.filter(x=>x.source==="friend"),yainooItems=mail.filter(x=>x.source==="yainoo");
    let body="";
    if(tab==="friend"){
      body=friendItems.length?friendItems.map(item=>`<div class="notification-card ${item.read?"":"unread"}"><b>${safeHtml(item.title||"แจ้งเตือนจากเพื่อน")}</b>${item.text?`<span>${safeHtml(item.text)}</span>`:""}<small>${bangkokTimeText(item.createdAt)} น.</small>${item.type==="gift"?`<div class="notification-actions">${item.resolved?`<button disabled>${item.status==="claimed"?"รับแล้ว":"ทิ้งแล้ว"}</button>`:`<button type="button" data-claim-gift="${item.giftId||item.id}" data-gift-action="accept">รับของขวัญ</button><button type="button" data-claim-gift="${item.giftId||item.id}" data-gift-action="discard">ทิ้ง</button>`}</div>`:""}</div>`).join(""):'<p class="empty-feature">ยังไม่มีแจ้งเตือนจากเพื่อน</p>';
      await markMailboxRead(friendItems);
    }else{
      const broadcastCards=[];
      for(const b of broadcasts){const claim=b.type==="gift"?await fetchBroadcastClaim(b.id):null;broadcastCards.push(`<div class="notification-card"><b>${safeHtml(b.title||"ข้อความจากยัยหนู")}</b>${b.body?`<span>${safeHtml(b.body)}</span>`:""}${b.type==="gift"?`<span>🎁 ${safeHtml(b.itemName)} ×${Number(b.qty)||1}</span><div class="notification-actions">${claim?`<button disabled>${claim.status==="accepted"?"รับแล้ว":"ทิ้งแล้ว"}</button>`:`<button type="button" data-claim-broadcast="${b.id}" data-broadcast-action="accept">รับของขวัญ</button><button type="button" data-claim-broadcast="${b.id}" data-broadcast-action="discard">ทิ้ง</button>`}</div>`:""}<small>${bangkokTimeText(b.createdAt)} น.</small></div>`)}
      body=[...yainooItems.map(item=>`<div class="notification-card ${item.read?"":"unread"}"><b>${safeHtml(item.title||"แจ้งเตือนจากยัยหนู")}</b>${item.text?`<span>${safeHtml(item.text)}</span>`:""}<small>${bangkokTimeText(item.createdAt)} น.</small></div>`),...broadcastCards].join("")||'<p class="empty-feature">ยังไม่มีแจ้งเตือนจากยัยหนู</p>';
      await markMailboxRead(yainooItems);(ownState||state).lastSeenYainooAt=gameNow();save();
    }
    $("modalContent").innerHTML=`<section class="feature-panel notification-panel"><h2>🔔 การแจ้งเตือน</h2><div class="notification-tabs"><button type="button" data-notification-tab="friend" class="${tab==="friend"?"active":""}">👥 จากเพื่อน</button><button type="button" data-notification-tab="yainoo" class="${tab==="yainoo"?"active":""}">👑 จากยัยหนู</button></div>${currentMember==="Aida"&&adminProfile?.role==="admin"?'<button id="adminCenterBtn" class="admin-center-entry" type="button">🛡️ ศูนย์แอดมิน</button>':""}<div class="notification-list">${body}</div></section>`;
    document.querySelectorAll("[data-notification-tab]").forEach(btn=>btn.onclick=()=>showNotifications(btn.dataset.notificationTab));
    document.querySelectorAll("[data-claim-gift]").forEach(btn=>btn.onclick=()=>claimFriendGift(btn.dataset.claimGift,btn.dataset.giftAction==="accept"));
    document.querySelectorAll("[data-claim-broadcast]").forEach(btn=>btn.onclick=()=>claimBroadcastGift(btn.dataset.claimBroadcast,btn.dataset.broadcastAction==="accept"));
    if($("adminCenterBtn"))$("adminCenterBtn").onclick=showAdminCenter;openModal();refreshNotificationBadge();
  }catch(error){message("เปิดการแจ้งเตือนไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function claimFriendGift(giftId,accept){
  try{
    const {db,fs}=await getFirebaseContext(),giftRef=fs.doc(db,"gifts",giftId),saveRef=fs.doc(db,"saves",currentMemberKey),mailRef=fs.doc(db,"mailboxes",currentMemberKey,"items",giftId);let next;
    await fs.runTransaction(db,async tx=>{
      const [giftSnap,saveSnap]=await Promise.all([tx.get(giftRef),tx.get(saveRef)]);if(!giftSnap.exists()||!saveSnap.exists())throw new Error("ไม่พบของขวัญ");const gift=giftSnap.data();if(gift.toKey!==currentMemberKey)throw new Error("ของขวัญนี้ไม่ได้ส่งถึงคุณ");if(gift.status!=="pending")throw new Error("ของขวัญนี้ถูกจัดการแล้ว");const s=normalizeState(saveSnap.data(),currentMember);
      if(accept)addGiftItemToState(s,gift);next=s;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(giftRef,{status:accept?"claimed":"discarded",resolvedAt:fs.serverTimestamp()},{merge:true});tx.set(mailRef,{read:true,resolved:true,status:accept?"claimed":"discarded"},{merge:true});
    });
    ownState=normalizeState(next,currentMember);if(!visitContext)state=ownState;showNotifications("friend");showWeatherToast(accept?"🎁 รับของขวัญแล้ว":"🗑️ ทิ้งของขวัญแล้ว • ไม่คืนผู้ส่ง");
  }catch(error){message("จัดการของขวัญไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function claimBroadcastGift(broadcastId,accept){
  try{
    const {db,fs}=await getFirebaseContext(),broadcastRef=fs.doc(db,"broadcasts",broadcastId),claimRef=fs.doc(db,"broadcasts",broadcastId,"claims",currentMemberKey),saveRef=fs.doc(db,"saves",currentMemberKey);let next;
    await fs.runTransaction(db,async tx=>{
      const [bSnap,cSnap,sSnap]=await Promise.all([tx.get(broadcastRef),tx.get(claimRef),tx.get(saveRef)]);if(!bSnap.exists()||!sSnap.exists())throw new Error("ไม่พบของขวัญจากยัยหนู");if(cSnap.exists())throw new Error("คุณจัดการของขวัญนี้แล้ว");const b=bSnap.data();if(b.type!=="gift")throw new Error("รายการนี้ไม่ใช่ของขวัญ");const s=normalizeState(sSnap.data(),currentMember);if(accept)addGiftItemToState(s,{itemType:b.itemType,itemKey:b.itemKey,qty:b.qty});next=s;
      tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(claimRef,{memberKey:currentMemberKey,status:accept?"accepted":"discarded",resolvedAt:fs.serverTimestamp()});
    });
    ownState=normalizeState(next,currentMember);if(!visitContext)state=ownState;showNotifications("yainoo");showWeatherToast(accept?"🎁 รับของขวัญจากยัยหนูแล้ว":"🗑️ ทิ้งของขวัญแล้ว");
  }catch(error){message("จัดการของขวัญไม่ได้",error.message||"กรุณาลองใหม่")}
}

function adminGiftCatalog(){
  return[
    ...Object.entries(ANIMAL_PRODUCTS).map(([key,item])=>({type:"product",key,name:item.name})),
    ...RECIPES.map(r=>({type:"dish",key:r.id,name:r.name})),
    ...Object.entries(SPECIAL_ITEMS).map(([key,item])=>({type:"special",key,name:item.name}))
  ];
}
async function seedPublicProfilesAsAdmin(){
  if(adminProfile?.role!=="admin")return;
  try{
    const {db,fs}=await getFirebaseContext(),snap=await fs.getDocs(fs.collection(db,"publicProfiles")),existing=new Set();snap.forEach(d=>existing.add(d.id));const batch=fs.writeBatch(db);let changed=false;
    Object.keys(MEMBERS).forEach(name=>{const key=memberKeyFromName(name);if(existing.has(key))return;batch.set(fs.doc(db,"publicProfiles",key),{memberKey:key,displayName:name,merit:300,initialized:false,uid:"",updatedAt:fs.serverTimestamp()});changed=true});if(changed)await batch.commit();
  }catch(error){console.warn("seed profiles",error)}
}
async function showAdminCenter(){
  if(adminProfile?.role!=="admin"){message("ไม่มีสิทธิ์","เมนูนี้เปิดเฉพาะ Aida/Admin");return}
  try{
    const {db,fs}=await getFirebaseContext(),snap=await fs.getDocs(fs.query(fs.collection(db,"purchaseRequests"),fs.where("status","==","pending"))),requests=[];snap.forEach(d=>requests.push({id:d.id,...d.data()}));requests.sort((a,b)=>timestampMillis(b.createdAt)-timestampMillis(a.createdAt));const catalog=adminGiftCatalog();
    $("modalContent").innerHTML=`<section class="feature-panel admin-panel"><h2>🛡️ ศูนย์แอดมิน Aida</h2><div class="admin-section"><h3>คำขอซื้อที่รออนุมัติ (${requests.length})</h3><div class="admin-request-list">${requests.length?requests.map(r=>`<div class="admin-request-card"><b>${safeHtml(r.memberName)} • ${safeHtml(r.itemName)}</b><span>${Number(r.price)||0}⭐️ • ${r.category==="animal"?"สัตว์":"ของพิเศษ"}</span><small>${bangkokTimeText(r.createdAt)} น.</small><div><button type="button" data-admin-approve="${r.id}">อนุมัติ</button><button type="button" data-admin-reject="${r.id}">ปฏิเสธ</button></div></div>`).join(""):'<p class="empty-feature">ไม่มีคำขอค้าง</p>'}</div></div><div class="admin-section"><h3>ส่งแจ้งเตือนจากยัยหนู</h3><input id="adminNoticeTitle" type="text" placeholder="หัวข้อ" maxlength="80"><textarea id="adminNoticeBody" placeholder="ข้อความที่ต้องการส่ง" maxlength="500"></textarea><button id="adminSendNoticeBtn" type="button">ส่งให้ทุกคน</button></div><div class="admin-section"><h3>ส่งของขวัญให้ทุกคน</h3><select id="adminGiftItem">${catalog.map((e,i)=>`<option value="${i}">${safeHtml(e.name)}</option>`).join("")}</select><input id="adminGiftQty" type="number" min="1" max="999" value="1"><button id="adminSendGiftBtn" type="button">ส่งของขวัญให้ทุกคน</button></div></section>`;
    document.querySelectorAll("[data-admin-approve]").forEach(btn=>btn.onclick=()=>resolvePurchaseRequest(btn.dataset.adminApprove,true));document.querySelectorAll("[data-admin-reject]").forEach(btn=>btn.onclick=()=>resolvePurchaseRequest(btn.dataset.adminReject,false));$("adminSendNoticeBtn").onclick=sendAdminNotice;$("adminSendGiftBtn").onclick=()=>{const e=catalog[Number($("adminGiftItem").value)||0],qty=Math.max(1,Number($("adminGiftQty").value)||1);sendAdminGlobalGift(e,qty)};openModal();
  }catch(error){message("เปิดศูนย์แอดมินไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function resolvePurchaseRequest(requestId,approve){
  try{
    const {db,fs}=await getFirebaseContext(),requestRef=fs.doc(db,"purchaseRequests",requestId),noticeId=`purchase-${requestId}`;let memberKey="",memberName="";
    await fs.runTransaction(db,async tx=>{
      const reqSnap=await tx.get(requestRef);if(!reqSnap.exists())throw new Error("ไม่พบคำขอ");const req=reqSnap.data();if(req.status!=="pending")throw new Error("คำขอนี้ถูกจัดการแล้ว");memberKey=req.memberKey;memberName=req.memberName;const saveRef=fs.doc(db,"saves",memberKey),saveSnap=await tx.get(saveRef);if(!saveSnap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(saveSnap.data(),memberName);
      if(req.category==="animal"){
        s.purchasePendingCounts[req.itemKey]=Math.max(0,(Number(s.purchasePendingCounts[req.itemKey])||0)-1);if(approve)s.pendingAnimals[req.itemKey]=(Number(s.pendingAnimals[req.itemKey])||0)+1;
      }else if(req.category==="special"){
        if(approve)s.specials[req.itemKey]=(Number(s.specials[req.itemKey])||0)+Math.max(1,Number(req.qty)||1);
        else if(req.dateKey===currentBangkokDateKey()){ensureDailyLimitsFor(s);s.dailyLimits.specialPurchases=Math.max(0,(Number(s.dailyLimits.specialPurchases)||0)-Math.max(1,Number(req.qty)||1))}
      }
      tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(requestRef,{status:approve?"approved":"rejected",resolvedAt:fs.serverTimestamp(),resolvedBy:"Aida"},{merge:true});tx.set(fs.doc(db,"mailboxes",memberKey,"items",noticeId),{source:"yainoo",type:"purchase",title:approve?`ยัยหนูอนุมัติ ${req.itemName} แล้ว ✅`:`ยัยหนูไม่อนุมัติ ${req.itemName}`,text:approve?(req.category==="animal"?"ไปที่โรงเรือนแล้วกด + เพื่อวางสัตว์ได้เลย":"ของถูกเพิ่มเข้า กระเป๋า → ของพิเศษ แล้ว"):"คำขอนี้ถูกปฏิเสธ",read:false,createdAt:fs.serverTimestamp()});
    });
    showWeatherToast(approve?`✅ อนุมัติ ${memberName} แล้ว`:`❌ ปฏิเสธคำขอแล้ว`);showAdminCenter();refreshNotificationBadge();
  }catch(error){message("จัดการคำขอไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function sendAdminNotice(){
  const title=$("adminNoticeTitle")?.value.trim()||"แจ้งเตือนจากยัยหนู",body=$("adminNoticeBody")?.value.trim()||"";if(!body){message("ยังส่งไม่ได้","กรุณาพิมพ์ข้อความก่อน");return}
  try{const {db,fs}=await getFirebaseContext();await fs.addDoc(fs.collection(db,"broadcasts"),{type:"notice",title,body,from:"Aida",createdAt:fs.serverTimestamp()});showWeatherToast("📣 ส่งแจ้งเตือนให้ทุกคนแล้ว");showAdminCenter()}catch(error){message("ส่งไม่สำเร็จ",error.message||"กรุณาลองใหม่")}
}
async function sendAdminGlobalGift(entry,qty){
  if(!entry)return;try{const {db,fs}=await getFirebaseContext();await fs.addDoc(fs.collection(db,"broadcasts"),{type:"gift",title:"🎁 ของขวัญจากยัยหนู",body:"กดรับเพื่อเพิ่มของเข้ากระเป๋า",itemType:entry.type,itemKey:entry.key,itemName:entry.name,qty:Math.max(1,Math.floor(qty)),from:"Aida",createdAt:fs.serverTimestamp()});showWeatherToast("🎁 ส่งของขวัญให้ทุกคนแล้ว");showAdminCenter()}catch(error){message("ส่งของขวัญไม่สำเร็จ",error.message||"กรุณาลองใหม่")}
}

function enterGameScreen(){
  $("loginError").textContent="";$("loginScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");startGameExtras();draw();if(ticker)clearInterval(ticker);ticker=setInterval(tickFarmUI,1000);
}
async function completeAidaCloudSession(profile){
  const {db,fs}=await getFirebaseContext(),user=(await getFirebaseBridge()).getCurrentUser();if(!user)throw new Error("ยังไม่ได้เข้าสู่ Firebase Admin");
  currentMemberKey="aida";adminProfile={...profile,role:"admin",memberKey:"aida"};await fs.setDoc(fs.doc(db,"members",user.uid),{memberKey:"aida",displayName:"Aida"},{merge:true});await initializeOrLoadCloudState("Aida","aida");await seedPublicProfilesAsAdmin();draw();refreshNotificationBadge();return ownState;
}
async function start(){
  const member=$("memberSelect").value,code=$("memberCode").value.trim();if(MEMBERS[member]!==code){$("loginError").textContent="ชื่อสมาชิกหรือรหัสไม่ถูกต้อง";return}
  stopOnlineListeners();cloudReady=false;adminProfile=null;visitContext=null;currentMember=member;currentMemberKey=memberKeyFromName(member);ownState=fresh(member);state=ownState;$("loginError").textContent="กำลังเชื่อมข้อมูลส่วนกลาง...";
  if(member==="Aida"){
    try{
      const bridge=await getFirebaseBridge();await bridge?.waitForAuth();const profile=bridge?await bridge.getSignedInMember():null;if(profile?.role==="admin"){await completeAidaCloudSession(profile);enterGameScreen();showWeatherToast("🔥 Firebase Admin เชื่อมต่อแล้ว");return}
    }catch(error){console.warn("Aida session",error)}
    enterGameScreen();setTimeout(()=>checkFirebaseAdminConnection(),250);return;
  }
  try{
    await ensureMemberAuth(member,code);await initializeOrLoadCloudState(member,currentMemberKey);enterGameScreen();showWeatherToast("☁️ โหลดเซฟส่วนกลางแล้ว");
  }catch(error){console.error("member cloud login",error);currentMember=null;currentMemberKey="";ownState=state=null;$("loginError").textContent=`เชื่อม Firebase ไม่สำเร็จ: ${error.message||"กรุณาลองใหม่"}`}
}
async function checkFirebaseAdminConnection(){
  if(currentMember!=="Aida")return;const bridge=await getFirebaseBridge();if(!bridge){message("Firebase ยังไม่เชื่อม","โหลด Firebase SDK ไม่สำเร็จ");return}
  try{
    await bridge.waitForAuth();const user=bridge.getCurrentUser();if(!user){firebaseAdminLoginForm("เข้าสู่ระบบ Firebase Admin เพื่อเปิดเซฟกลางและศูนย์แอดมิน");return}
    const profile=await bridge.getSignedInMember();if(profile?.role==="admin"){await completeAidaCloudSession(profile);showWeatherToast("🔥 Firebase Admin เชื่อมต่อแล้ว");return}
    await bridge.signOut();firebaseAdminLoginForm("บัญชี Firebase ที่ค้างอยู่ไม่มีสิทธิ์ admin กรุณาเข้าสู่บัญชี Aida/Admin");
  }catch(error){console.error(error);firebaseAdminLoginForm("ยังตรวจสิทธิ์ Firebase ไม่สำเร็จ กรุณาเข้าสู่ระบบอีกครั้ง")}
}
async function loginFirebaseAdmin(){
  const email=$("firebaseAdminEmail")?.value.trim()||"",password=$("firebaseAdminPassword")?.value||"",status=$("firebaseAdminStatus"),button=$("firebaseAdminLoginBtn");if(!email||!password){if(status)status.textContent="กรุณากรอก Email และ Password ให้ครบ";return}
  if(status)status.textContent="กำลังเชื่อม Firebase...";if(button)button.disabled=true;
  try{
    const bridge=await getFirebaseBridge();if(!bridge)throw new Error("Firebase SDK ยังไม่พร้อม");await bridge.signIn(email,password);const profile=await bridge.getSignedInMember();if(!profile)throw new Error("ไม่พบเอกสาร members ของบัญชีนี้");if(profile.role!=="admin"){await bridge.signOut();throw new Error("บัญชีนี้ไม่มีสิทธิ์ admin")}
    await completeAidaCloudSession(profile);closeModal();message("🔥 Firebase เชื่อมสำเร็จ",`ชื่อ: ${profile.displayName||"Aida"}<br>สิทธิ์: admin<br>เซฟกลาง V1 พร้อมใช้งาน`);
  }catch(error){console.error("Firebase Admin login failed",error);if(status)status.textContent=`เชื่อมไม่สำเร็จ: ${error.message||"กรุณาตรวจ Email/Password"}`;if(button)button.disabled=false}
}
async function logout(){
  if(ticker)clearInterval(ticker);ticker=null;if(cloudReady){try{await flushCloudSave()}catch(error){console.warn(error)}}stopGameExtras();stopOnlineListeners();showAvatar("");$("gameScreen").classList.add("hidden");$("sceneScreen").classList.add("hidden");stopSceneTimer();currentScene=null;$("visitorBanner")?.remove();$("gameScreen").classList.remove("visiting-friend");$("loginScreen").classList.remove("hidden");$("memberCode").value="";
  try{const bridge=await getFirebaseBridge();if(bridge?.getCurrentUser())await bridge.signOut()}catch{}
  currentMember=null;currentMemberKey="";ownState=null;state=null;visitContext=null;cloudReady=false;adminProfile=null;const badge=$("notificationBadge");if(badge)badge.classList.add("hidden");
}

function renderScene(){
  if(currentScene==="house"){renderHouseScene();return}if(currentScene==="underwater"){renderUnderwaterScene();return}if(currentScene==="almsSeated"||currentScene==="almsBlessing"){renderAlmsScene();return}if(currentScene==="coconut"){renderCoconutScene();return}renderAnimalScene(currentScene);
}
function bindEvents(){
  $("startBtn").onclick=start;$("howBtn").onclick=showHow;$("menuBtn").onclick=showMenu;$("settingsBtn").onclick=showSettings;$("rewardBtn").onclick=showRewards;$("closeModal").onclick=closeModal;$("modal").onclick=event=>{if(event.target===$("modal"))closeModal()};$("forecastBtn").onclick=showForecast;$("modeBtn").onclick=showModeChooser;if($("notificationBtn"))$("notificationBtn").onclick=()=>showNotifications("friend");if($("almsBtn"))$("almsBtn").onclick=showAlms;if($("challengeBtn"))$("challengeBtn").onclick=challengeFarm;if($("friendlyGhostHotspot"))$("friendlyGhostHotspot").onclick=friendlyGhostReward;if($("coconutGardenHotspot"))$("coconutGardenHotspot").onclick=()=>{if(!guardResting())openScene("coconut")};if($("riverHotspot"))$("riverHotspot").onclick=()=>{if(!guardResting())openScene("jellyfish")};$("closeModeOverlay").onclick=closeModeChooser;$("modeOverlay").onclick=event=>{if(event.target===$("modeOverlay"))closeModeChooser()};document.querySelectorAll("[data-mode-choice]").forEach(button=>{button.onclick=()=>{const mode=button.dataset.modeChoice;applyFarmMode(mode);closeModeChooser();showWeatherToast(`เปลี่ยนเป็นโหมด ${FARM_MODES[mode].name} แล้ว`)}});$("houseHotspot").onclick=showHouseChoices;$("wellHotspot").onclick=showWellChoices;$("gardenNavBtn").onclick=confirmReturnToLogin;$("inventoryNavBtn").onclick=inventory;$("shopNavBtn").onclick=showShop;$("missionsNavBtn").onclick=showMissions;$("friendsNavBtn").onclick=showFriends;$("menuNavBtn").onclick=showMenu;setupProfile();setupTopPlayerName();
}

/* ======================================================================
   MAJOR UPDATE V2 — 2026-08-07
   เพิ่มธีม / พืชใหม่ / สวนแพนด้า / บ่อแมงกะพรุน / ขโมยพืช /
   สไตล์สัตว์ / ร้านค้าจำนวนหลายชิ้น / สิทธิ์ Admin
   หมายเหตุ: ไม่แก้หน้า Login, Authentication, ภารกิจประจำวัน หรือระบบบ้านเดิม
   ====================================================================== */

const MAJOR_V2_SCHEMA=2;
const SHOP_REQUEST_MAX_QTY=999;
const JELLY_BOX_DAILY_LIMIT=7;
const JELLY_BOX_PRICE=50;
const JELLY_LIFETIME_MS=3*24*60*60*1000;
const JELLY_LOVE_COOLDOWN_MS=60*60*1000;
const JELLY_POISON_REDUCE_MS=3*60*60*1000;
const FRIEND_STEAL_DAILY_LIMIT=10;
const ADMIN_STOCK_QTY=9999;

// ===== เพิ่มพืช 2 ชนิด และปรับหนอนพืชเดิมเป็น 30% =====
CROPS.babyBamboo={
  name:"เบบี้แบมบรู๊ววว",icon:"🎋",selectImg:"baby-bamboo-seed.PNG?v=1",
  totalMs:8*60*1000,waterMs:3*60*1000,wormChance:0,seedCostMerit:2,
  seedImg:"baby-bamboo-seed.png?v=1",sproutImg:"baby-bamboo-sprout.png?v=1",growImg:"baby-bamboo-grow.png?v=1",readyImg:"baby-bamboo-ready.png?v=1"
};
CROPS.hauntedPlankton={
  name:"แพลงก์ตอนหลอนปิ๊",icon:"🫧",selectImg:"haunted-plankton-seed.PNG?v=1",
  totalMs:8*60*1000,waterMs:3*60*1000,wormChance:0,seedCostMerit:2,
  seedImg:"haunted-plankton-seed.png?v=1",sproutImg:"haunted-plankton-sprout.png?v=1",growImg:"haunted-plankton-grow.png?v=1",readyImg:"haunted-plankton-ready.png?v=1"
};
["morning","cabbage","mango","chili","pumpkin","lychee","strawberry","grape","banana","gooseberry"].forEach(key=>{if(CROPS[key])CROPS[key].wormChance=.30});

// ===== ธีมและฉากใหม่ =====
FARM_MODES.village={name:"หมู่บ้านหรรษา",emoji:"🏡",image:"farm-theme-fantasy-village.jpg?v=1"};
FARM_MODES.sea={name:"ทะเล",emoji:"🌊",image:"farm-theme-sea.jpg?v=1"};
SCENES.panda={image:"panda-forest.jpg?v=1"};
SCENES.jellyfish={image:"jellyfish-pond.jpg?v=1"};

// ===== ทรัพยากรใหม่ =====
SPECIAL_ITEMS.bambooLeaf={name:"ใบไผ่",image:"baby-bamboo-ready.png?v=1",kind:"resource",group:"panda",description:"ใช้ให้อาหารแพนด้า"};
SPECIAL_ITEMS.jellyfishLaxative={name:"ยาถ่ายแมงกะพรุน",image:"jellyfish_Laxative_Bag.png?v=1",kind:"resource",group:"jellyfish",description:"ลดอายุแมงกะพรุน 3 ชั่วโมง"};

const JELLYFISH_TYPES={
  jelly1:{name:"พรุนวารี",image:"chubby-jellyfish-1.png?v=1"},
  jelly2:{name:"พรุนพงไพร",image:"chubby-jellyfish-2.png?v=1"},
  jelly3:{name:"พรุนรัตติกาล",image:"chubby-jellyfish-3.png?v=1"},
  jelly4:{name:"พรุนสุริยันต์",image:"chubby-jellyfish-4.png?v=1"},
  jelly5:{name:"พรุนจักรกล",image:"chubby-jellyfish-5.png?v=1"},
  jelly6:{name:"พรุนรุ้งดิสโก้",image:"chubby-jellyfish-6.png?v=1"},
  jelly7:{name:"พรุนเพลิงทมิฬ",image:"chubby-jellyfish-7.png?v=1"},
  jelly8:{name:"พรุนหวานละมุน",image:"chubby-jellyfish-8.png?v=1"}
};
const JELLY_BOX={name:"กล่องสุ่มแมงกะพรุน",image:"rainbow-jellyfish-mystery-box.png?v=1",price:JELLY_BOX_PRICE};

// ===== สไตล์สัตว์: ปลาใช้ของเดิมเท่านั้น =====
const ANIMAL_STYLES={
  chicken:["01-chicken-ghost.png?v=1","chicken-pret-style-2.png?v=1","chicken-pret-style-3.png?v=1","chicken-pret-style-4.png?v=1"],
  pig:["02-fish-ghost.png?v=1","ghost-pig-style-2.png?v=1","ghost-pig-style-3.png?v=1","ghost-pig-style-4.png?v=1"],
  cow:["04-cow-ghost.png?v=1","spirit-cow-style-2.png?v=1","spirit-cow-style-3.png?v=1","spirit-cow-style-4.png?v=1"]
};
function animalImageForStyle(type,style=1){
  const item=animalById(type);if(!item)return"";
  const list=ANIMAL_STYLES[type];if(!list)return item.image;
  return list[Math.min(list.length-1,Math.max(0,(Number(style)||1)-1))]||item.image;
}

// ===== State V2: additive migration, ห้ามรีเซ็ตเซฟเดิม =====
function ensureDailyLimitsFor(target){
  if(!target)return false;
  const key=currentBangkokDateKey();
  if(!target.dailyLimits||target.dailyLimits.dateKey!==key){
    target.dailyLimits={dateKey:key,giftsSent:0,specialPurchases:0,jellyBoxes:0,steals:0,stolenFromKeys:[]};
    return true;
  }
  target.dailyLimits.giftsSent=Math.max(0,Number(target.dailyLimits.giftsSent)||0);
  target.dailyLimits.specialPurchases=Math.max(0,Number(target.dailyLimits.specialPurchases)||0);
  target.dailyLimits.jellyBoxes=Math.max(0,Number(target.dailyLimits.jellyBoxes)||0);
  target.dailyLimits.steals=Math.max(0,Number(target.dailyLimits.steals)||0);
  target.dailyLimits.stolenFromKeys=Array.isArray(target.dailyLimits.stolenFromKeys)?[...new Set(target.dailyLimits.stolenFromKeys.map(String))]:[];
  return false;
}
function makeEmptyDishInventory(){return Object.fromEntries(RECIPES.map(r=>[r.id,0]))}
function fresh(player){
  const specials=Object.fromEntries(Object.keys(SPECIAL_ITEMS).map(k=>[k,0]));
  return{
    launchVersion:LAUNCH_VERSION,schemaVersion:MAJOR_V2_SCHEMA,
    player,merit:300,
    plots:Array.from({length:PLOT_COUNT},emptyPlot),
    bag:Object.fromEntries(Object.keys(CROPS).map(k=>[k,0])),
    animalProducts:Object.fromEntries(Object.keys(ANIMAL_PRODUCTS).map(k=>[k,0])),
    dishes:[],dishInventory:makeEmptyDishInventory(),specials,
    specialAnimals:Object.fromEntries(Object.keys(JELLYFISH_TYPES).map(k=>[k,0])),
    mysteryBoxes:0,
    houseOfferings:[null,null,null],underwaterOffering:null,houseWorshipUntil:0,underwaterUntil:0,
    restUntil:0,restType:null,restRewardPending:false,
    almsOfferings:[null,null,null,null],lastAlmsDate:"",
    friendlyGhostUntil:0,challengeUntil:0,
    animalRequests:{chicken:Array(9).fill(false),fish:Array(9).fill(false),pig:Array(9).fill(false),cow:Array(9).fill(false)},
    animals:{chicken:Array(9).fill(null),fish:Array(9).fill(null),pig:Array(9).fill(null),cow:Array(9).fill(null)},
    pendingAnimals:{chicken:0,fish:0,pig:0,cow:0},
    purchasePendingCounts:{chicken:0,fish:0,pig:0,cow:0},
    animalBonusNextAt:gameNow()+ANIMAL_BONUS_INTERVAL,
    missions:makeMissionState(),
    dailyLimits:{dateKey:currentBangkokDateKey(),giftsSent:0,specialPurchases:0,jellyBoxes:0,steals:0,stolenFromKeys:[]},
    coconutQuotaResetAt:0,coconutQuotaCount:0,lastSeenYainooAt:0,
    adminStockV2Seeded:false
  };
}
function normalizeState(raw,player){
  const n=raw&&typeof raw==="object"?raw:fresh(player);
  n.launchVersion=n.launchVersion||LAUNCH_VERSION;n.schemaVersion=MAJOR_V2_SCHEMA;
  n.player=player||n.player||"ผู้เล่น";
  n.merit=Number.isFinite(Number(n.merit))?Number(n.merit):300;
  n.plots=Array.isArray(n.plots)?n.plots.slice(0,PLOT_COUNT):[];while(n.plots.length<PLOT_COUNT)n.plots.push(emptyPlot());n.plots=n.plots.map(normalizePlot);
  n.bag=n.bag&&typeof n.bag==="object"?n.bag:{};Object.keys(CROPS).forEach(k=>{n.bag[k]=Number.isFinite(Number(n.bag[k]))?Math.max(0,Number(n.bag[k])):0});
  n.animalProducts=n.animalProducts&&typeof n.animalProducts==="object"?n.animalProducts:{};Object.keys(ANIMAL_PRODUCTS).forEach(k=>{n.animalProducts[k]=Number.isFinite(Number(n.animalProducts[k]))?Math.max(0,Number(n.animalProducts[k])):0});
  // ย้ายอาหารเดิมจาก array เป็นจำนวน เพื่อรองรับสต๊อก Admin 999 โดยไม่ทำ Firestore document ใหญ่เกินไป
  const hadDishInventory=n.dishInventory&&typeof n.dishInventory==="object";
  n.dishInventory=hadDishInventory?n.dishInventory:{};
  RECIPES.forEach(r=>{if(!Number.isFinite(Number(n.dishInventory[r.id])))n.dishInventory[r.id]=0;else n.dishInventory[r.id]=Math.max(0,Number(n.dishInventory[r.id]))});
  if(!hadDishInventory&&Array.isArray(n.dishes))n.dishes.forEach(d=>{if(d?.id&&Object.prototype.hasOwnProperty.call(n.dishInventory,d.id))n.dishInventory[d.id]+=1});
  n.dishes=[];
  n.specials=n.specials&&typeof n.specials==="object"?n.specials:{};Object.keys(SPECIAL_ITEMS).forEach(k=>{n.specials[k]=Number.isFinite(Number(n.specials[k]))?Math.max(0,Number(n.specials[k])):0});
  n.specialAnimals=n.specialAnimals&&typeof n.specialAnimals==="object"?n.specialAnimals:{};Object.keys(JELLYFISH_TYPES).forEach(k=>{n.specialAnimals[k]=Number.isFinite(Number(n.specialAnimals[k]))?Math.max(0,Number(n.specialAnimals[k])):0});
  n.mysteryBoxes=Number.isFinite(Number(n.mysteryBoxes))?Math.max(0,Math.floor(Number(n.mysteryBoxes))):0;
  n.houseOfferings=Array.isArray(n.houseOfferings)?n.houseOfferings.slice(0,3):[null,null,null];while(n.houseOfferings.length<3)n.houseOfferings.push(null);
  n.underwaterOffering=typeof n.underwaterOffering==="string"?n.underwaterOffering:null;n.houseWorshipUntil=Number(n.houseWorshipUntil)||0;n.underwaterUntil=Number(n.underwaterUntil)||0;
  n.restUntil=Number(n.restUntil)||0;n.restType=n.restType==="sleep"||n.restType==="nap"?n.restType:null;n.restRewardPending=Boolean(n.restRewardPending);
  n.almsOfferings=Array.isArray(n.almsOfferings)?n.almsOfferings.slice(0,4):[null,null,null,null];while(n.almsOfferings.length<4)n.almsOfferings.push(null);
  n.lastAlmsDate=typeof n.lastAlmsDate==="string"?n.lastAlmsDate:"";n.friendlyGhostUntil=Number(n.friendlyGhostUntil)||0;n.challengeUntil=Number(n.challengeUntil)||0;
  n.animalRequests=n.animalRequests&&typeof n.animalRequests==="object"?n.animalRequests:{};
  n.animals=n.animals&&typeof n.animals==="object"?n.animals:{};
  n.pendingAnimals=n.pendingAnimals&&typeof n.pendingAnimals==="object"?n.pendingAnimals:{};
  n.purchasePendingCounts=n.purchasePendingCounts&&typeof n.purchasePendingCounts==="object"?n.purchasePendingCounts:{};
  SHOP_ITEMS.forEach(item=>{
    if(!Array.isArray(n.animalRequests[item.id]))n.animalRequests[item.id]=Array(9).fill(false);n.animalRequests[item.id]=n.animalRequests[item.id].slice(0,9);while(n.animalRequests[item.id].length<9)n.animalRequests[item.id].push(false);
    if(!Array.isArray(n.animals[item.id]))n.animals[item.id]=Array(9).fill(null);n.animals[item.id]=n.animals[item.id].slice(0,9);while(n.animals[item.id].length<9)n.animals[item.id].push(null);
    n.animals[item.id]=n.animals[item.id].map(a=>{
      if(!a||typeof a!=="object")return null;const placedAt=Number(a.placedAt)||gameNow();
      return{...a,placedAt,expiresAt:Number(a.expiresAt)||placedAt+ANIMAL_META[item.id].lifeMs,readyAt:Number(a.readyAt)||placedAt+item.productionMs,bonus:Boolean(a.bonus),name:typeof a.name==="string"?a.name:"",style:ANIMAL_STYLES[item.id]?Math.min(4,Math.max(1,Number(a.style)||1)):1};
    });
    n.pendingAnimals[item.id]=Math.max(0,Number(n.pendingAnimals[item.id])||0);n.purchasePendingCounts[item.id]=Math.max(0,Number(n.purchasePendingCounts[item.id])||0);
  });
  n.animalBonusNextAt=Number(n.animalBonusNextAt)||gameNow()+ANIMAL_BONUS_INTERVAL;
  ensureMissionStateFor(n);ensureDailyLimitsFor(n);
  n.coconutQuotaResetAt=Math.max(0,Number(n.coconutQuotaResetAt)||0);n.coconutQuotaCount=Math.max(0,Number(n.coconutQuotaCount)||0);
  if(n.coconutQuotaResetAt>0&&n.coconutQuotaResetAt<=gameNow()){n.coconutQuotaResetAt=0;n.coconutQuotaCount=0}
  n.lastSeenYainooAt=Number(n.lastSeenYainooAt)||0;n.adminStockV2Seeded=Boolean(n.adminStockV2Seeded);
  return n;
}

function dishCountInState(recipeId,s=ownState||state){return Math.max(0,Number(s?.dishInventory?.[recipeId])||0)}
function dishCount(recipeId){return dishCountInState(recipeId,ownState||state)}
function dishCounts(){return Object.fromEntries(RECIPES.map(r=>[r.id,dishCount(r.id)]))}
function addDishToState(s,recipeId,qty=1){if(!s.dishInventory)s.dishInventory=makeEmptyDishInventory();s.dishInventory[recipeId]=(Number(s.dishInventory[recipeId])||0)+Math.max(0,Math.floor(qty));return s.dishInventory[recipeId]}
function removeDishesFromState(s,recipeId,qty){qty=Math.max(1,Math.floor(Number(qty)||1));if(dishCountInState(recipeId,s)<qty)return false;s.dishInventory[recipeId]-=qty;return true}
function removeDishIds(ids){
  const s=ownState||state;if(!s)return false;const needs={};ids.filter(Boolean).forEach(id=>needs[id]=(needs[id]||0)+1);if(Object.entries(needs).some(([id,n])=>dishCountInState(id,s)<n))return false;Object.entries(needs).forEach(([id,n])=>s.dishInventory[id]-=n);save();return true;
}
function totalDishCount(s=ownState||state){return RECIPES.reduce((sum,r)=>sum+dishCountInState(r.id,s),0)}
function consumeAnyDishes(s,qty){let left=qty;for(const r of RECIPES){const have=dishCountInState(r.id,s),take=Math.min(have,left);if(take>0){s.dishInventory[r.id]-=take;left-=take}if(left<=0)break}return left===0}
function totalAnimalProductCount(s=ownState||state){return Object.keys(ANIMAL_PRODUCTS).reduce((sum,k)=>sum+(Number(s?.animalProducts?.[k])||0),0)}
function consumeAnyAnimalProducts(s,qty){let left=qty;for(const k of Object.keys(ANIMAL_PRODUCTS)){const have=Number(s.animalProducts[k])||0,take=Math.min(have,left);if(take>0){s.animalProducts[k]-=take;left-=take}if(left<=0)break}return left===0}

function ensureAdminStock(target){
  if(currentMember!=="Aida"||adminProfile?.role!=="admin"||!target||target.adminStockV2Seeded)return false;
  Object.keys(CROPS).forEach(k=>target.bag[k]=Math.max(ADMIN_STOCK_QTY,Number(target.bag[k])||0));
  Object.keys(ANIMAL_PRODUCTS).forEach(k=>target.animalProducts[k]=Math.max(ADMIN_STOCK_QTY,Number(target.animalProducts[k])||0));
  RECIPES.forEach(r=>target.dishInventory[r.id]=Math.max(ADMIN_STOCK_QTY,Number(target.dishInventory[r.id])||0));
  Object.keys(SPECIAL_ITEMS).forEach(k=>target.specials[k]=Math.max(ADMIN_STOCK_QTY,Number(target.specials[k])||0));
  Object.keys(JELLYFISH_TYPES).forEach(k=>target.specialAnimals[k]=Math.max(ADMIN_STOCK_QTY,Number(target.specialAnimals[k])||0));
  target.mysteryBoxes=Math.max(ADMIN_STOCK_QTY,Number(target.mysteryBoxes)||0);
  target.adminStockV2Seeded=true;return true;
}

// Firebase load: อ่านเซฟเดิมทุก version และสร้าง fresh เฉพาะเมื่อยืนยันว่าเอกสารไม่มีจริงเท่านั้น
async function initializeOrLoadCloudState(member,memberKey){
  const {db,fs}=await getFirebaseContext();const saveRef=fs.doc(db,"saves",memberKey),gardenRef=fs.doc(db,"gardens",memberKey);
  // ถ้าการอ่านล้มเหลว Promise จะ throw ก่อนมีการเขียนใด ๆ จึงไม่เอา state ว่างไปทับของเดิม
  const [saveSnap,gardenSnap]=await Promise.all([fs.getDoc(saveRef),fs.getDoc(gardenRef)]);
  let loaded;
  if(saveSnap.exists())loaded=normalizeState(saveSnap.data(),member);
  else{loaded=fresh(member);await fs.setDoc(saveRef,{...cloneData(loaded),updatedAt:fs.serverTimestamp()},{merge:false})}
  if(gardenSnap.exists()&&Array.isArray(gardenSnap.data()?.plots))loaded.plots=gardenSnap.data().plots.map(normalizePlot);
  ownState=normalizeState(loaded,member);state=ownState;lastGardenHash=plotHash(ownState.plots);
  // ถ้ามี garden อยู่แล้ว ห้ามเขียนทับตอน login เพราะอาจชนกับเพื่อนที่กำลังรดน้ำ/กำจัดหนอน/ขโมย
  if(!gardenSnap.exists()){
    await fs.setDoc(gardenRef,{memberKey,displayName:member,plots:cloneData(ownState.plots),updatedAt:fs.serverTimestamp()},{merge:false});
  }
  await fs.setDoc(fs.doc(db,"publicProfiles",memberKey),{memberKey,displayName:member,merit:Number(ownState.merit)||0,initialized:true,uid:(await getFirebaseBridge()).getCurrentUser()?.uid||"",updatedAt:fs.serverTimestamp()},{merge:true});
  cloudReady=true;const localKey=stateKey();if(localKey)localStorage.setItem(localKey,JSON.stringify(ownState));subscribeOwnGarden();startNotificationPolling();return ownState;
}

async function completeAidaCloudSession(profile){
  const {db,fs}=await getFirebaseContext(),user=(await getFirebaseBridge()).getCurrentUser();if(!user)throw new Error("ยังไม่ได้เข้าสู่ Firebase Admin");
  currentMemberKey="aida";adminProfile={...profile,role:"admin",memberKey:"aida"};await fs.setDoc(fs.doc(db,"members",user.uid),{memberKey:"aida",displayName:"Aida"},{merge:true});
  await initializeOrLoadCloudState("Aida","aida");if(ensureAdminStock(ownState)){state=ownState;save();await flushCloudSave()}
  await seedPublicProfilesAsAdmin();draw();refreshNotificationBadge();return ownState;
}

// ===== ปลูก / เก็บเกี่ยว =====
function plantMenu(index){
  $("modalContent").innerHTML=`<h2>เลือกเมล็ดสำหรับแปลง #${index+1}</h2><div class="grid">${Object.entries(CROPS).map(([key,crop])=>`<div class="tile spooky-seed-tile"><img src="${crop.selectImg}" alt="${crop.name}" class="seed-choice-img" decoding="async"><b>${crop.name}</b><p>เวลาโตประมาณ ${Math.round(crop.totalMs/60000)} นาที${crop.seedCostMerit?`<br><strong>ราคา ${crop.seedCostMerit} กุศล / 1 เมล็ด</strong>`:""}</p><button type="button" data-crop="${key}">ปลูก</button></div>`).join("")}</div>`;
  document.querySelectorAll("[data-crop]").forEach(button=>button.onclick=()=>{
    if(button.disabled)return;
    const s=ownState||state;
    if(!s?.plots||!s.plots[index])return;
    if(s.plots[index]?.crop){closeModal();draw();return}
    const key=button.dataset.crop,crop=CROPS[key],cost=Number(crop.seedCostMerit)||0;
    if(cost>0&&(Number(s.merit)||0)<cost){message("กุศลไม่พอ",`${crop.name} ใช้ ${cost} กุศล / 1 เมล็ด`);return}
    button.disabled=true;
    if(cost>0){s.merit-=cost;updateMeritUI()}
    const now=gameNow();s.plots[index]={crop:key,phase:"growing1",phaseEndsAt:now+crop.waterMs,plantedAt:now,wateredAt:0,worm:false};
    if(!visitContext){ownState=s;state=s}
    save();closeModal();draw();
  });openModal();
}
function grantHarvestYield(s,cropKey,qty=1){
  qty=Math.max(1,Math.floor(Number(qty)||1));s.bag[cropKey]=(Number(s.bag[cropKey])||0)+qty;
  if(cropKey==="babyBamboo")s.specials.bambooLeaf=(Number(s.specials.bambooLeaf)||0)+qty;
}
async function harvestOwnPlot(index){
  if(!state||index<0||index>=PLOT_COUNT)return;
  const localPlot=state.plots[index];ensurePlotPhase(localPlot);
  if(!localPlot?.crop||localPlot.phase!=="ready")return;

  // ถ้า cloud ยังไม่พร้อม ให้ fallback แบบ local เพื่อไม่ทำให้เกมค้าง
  if(!cloudReady||!currentMemberKey){
    const cropKey=localPlot.crop,name=CROPS[cropKey].name;
    grantHarvestYield(state,cropKey,1);
    state.plots[index]=emptyPlot();
    incrementMissionOn(state,"harvestCrops",1);
    save();draw();
    message("เก็บเกี่ยวสำเร็จ",cropKey==="babyBamboo"?`ได้ ${name} ×1 และ ใบไผ่ ×1`:`ได้ ${name} ×1`);
    return;
  }

  try{
    const {db,fs}=await getFirebaseContext();
    const saveRef=fs.doc(db,"saves",currentMemberKey);
    const gardenRef=fs.doc(db,"gardens",currentMemberKey);
    let nextState=null,cropKey="",nextPlots=null;

    await fs.runTransaction(db,async tx=>{
      const [saveSnap,gardenSnap]=await Promise.all([tx.get(saveRef),tx.get(gardenRef)]);
      if(!saveSnap.exists())throw new Error("ไม่พบเซฟสมาชิก");
      const s=normalizeState(saveSnap.data(),currentMember);
      assertCurrentCloudSession(saveSnap.data(),currentMember);

      // ใช้ garden กลางเป็น source of truth ของแปลงเมื่อมีอยู่
      const plots=(gardenSnap.exists()&&Array.isArray(gardenSnap.data()?.plots)
        ? gardenSnap.data().plots
        : s.plots).map(normalizePlot);
      const p=plots[index];
      ensurePlotPhaseStandalone(p);
      if(!p?.crop||p.phase!=="ready")throw new Error("ต้นนี้ไม่พร้อมเก็บแล้ว กรุณารีเฟรชสวน");

      cropKey=p.crop;
      grantHarvestYield(s,cropKey,1);
      incrementMissionOn(s,"harvestCrops",1);
      plots[index]=emptyPlot();
      s.plots=plots.map(normalizePlot);
      nextPlots=s.plots;
      nextState=s;

      tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(gardenRef,{memberKey:currentMemberKey,displayName:currentMember,plots:cloneData(plots),updatedAt:fs.serverTimestamp()},{merge:true});
    });

    ownState=normalizeState(nextState,currentMember);
    state=ownState;
    lastGardenHash=plotHash(nextPlots);
    const key=stateKey();if(key)localStorage.setItem(key,JSON.stringify(ownState));
    draw();
    const name=CROPS[cropKey].name;
    message("เก็บเกี่ยวสำเร็จ",cropKey==="babyBamboo"?`ได้ ${name} ×1 และ ใบไผ่ ×1`:`ได้ ${name} ×1`);
  }catch(error){
    message("เก็บเกี่ยวไม่สำเร็จ",error.message||"กรุณาลองใหม่");
  }
}

function tapPlot(index){
  if(visitContext){tapFriendPlot(index);return}if(guardResting())return;const plot=state.plots[index];ensurePlotPhase(plot);
  if(!plot.crop){plantMenu(index);return}
  if(plot.phase==="ready"){harvestOwnPlot(index);return}
  const boostHTML=cropBoostOptionsHTML(plot);
  if(plot.phase==="needsWater"){$("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>💧 รดน้ำ ${CROPS[plot.crop].name}</h2><p>กดบัวรดน้ำแล้วต้นจะเข้าสู่ขั้นโตต่อไป</p><button id="waterNowBtn" class="primary-spooky-action" type="button">รดน้ำ</button>${boostHTML}</section>`;openModal();$("waterNowBtn").onclick=()=>{closeModal();waterPlot(index)};bindCropBoostButtons(index);return}
  if(plot.phase==="worm"){$("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>🐛 หนอนมาแล้ว</h2><p>ต้นจะหยุดโตจนกว่าจะกำจัดหนอน ใช้ 1 คะแนนกุศล<br>คะแนนสามารถติดลบได้</p><button id="clearWormBtn" class="danger-action" type="button">ใช้ 1 กุศลกำจัดหนอน</button>${boostHTML}</section>`;openModal();$("clearWormBtn").onclick=()=>{closeModal();clearWorm(index)};bindCropBoostButtons(index);return}
  if(boostHTML){$("modalContent").innerHTML=`<section class="feature-panel confirm-panel"><h2>🌱 ${CROPS[plot.crop].name}</h2><p>เหลือประมาณ ${plotTimerText(plot)}</p>${boostHTML}</section>`;openModal();bindCropBoostButtons(index);return}
  message("ต้นกำลังเติบโต",`${CROPS[plot.crop].name} เหลือประมาณ ${plotTimerText(plot)}`);
}
function draw(){
  if(!state)return;if(!visitContext){clearExpiredRest();processAnimalSystems();if(ensureMissionStateFor(ownState))save()}updateMeritUI();if(!visitContext)updateAlmsButton();const plots=$("plots");plots.innerHTML="";
  state.plots.forEach((plot,index)=>{ensurePlotPhase(plot);const currentStage=stage(plot),status=plotStatus(plot);const button=document.createElement("button");button.type="button";button.className=`plot ${currentStage} ${currentStage==="empty"?"empty":currentStage==="ready"?"ready":"growing"}`;const name=plot.crop?CROPS[plot.crop].name:"";const steal=visitContext&&currentStage==="ready"&&!["babyBamboo","hauntedPlankton"].includes(plot.crop)?'<span class="steal-badge">🧤 ขโมย</span>':"";button.innerHTML=`<span class="plot-no">#${index+1}</span>${status?`<img class="status-badge" src="${STATUS_ICON[status]}" alt="${status}">`:""}${steal}<div class="plot-inner"><div class="crop">${cropIcon(plot)}</div>${name?`<div class="crop-name">${name}</div>`:""}${plot.crop?`<div class="timer">${plotTimerText(plot)}</div>`:""}</div>`;button.onclick=()=>tapPlot(index);plots.appendChild(button)});
}

// ===== อาหารแบบ count map =====
function craft(id){
  const recipe=recipeById(id);if(!recipe||!can(recipe))return;Object.entries(recipe.need).forEach(([key,count])=>state.bag[key]-=count);const success=Math.random()*100<recipe.chance;
  if(success){const reward=randInt(recipe.reward[0],recipe.reward[1]);addDishToState(state,recipe.id,1);state.merit+=reward;incrementMissionOn(state,"craftFood",1);save();updateMeritUI();$("modalContent").innerHTML=`<section class="feature-panel craft-success-panel"><h2>✨ คราฟสำเร็จ!</h2><img src="${recipe.image}" alt="${recipe.name}"><h3>${recipe.name}</h3><p>อาหารเพิ่มลงกระเป๋า ×1<br>ได้รับ +${reward} กุศล</p></section>`}
  else{save();$("modalContent").innerHTML=`<section class="feature-panel craft-success-panel"><h2>💨 คราฟไม่สำเร็จ</h2><img src="${recipe.image}" alt="${recipe.name}"><h3>${recipe.name}</h3><p>วัตถุดิบครั้งนี้สูญเปล่าแล้ว</p></section>`}
}
function craftPestle(key){
  const s=ownState||state,item=PESTLE_ITEMS[key];if(!item||item.locked)return;if(item.dishAny&&totalDishCount(s)<item.dishAny){message("วัตถุดิบยังไม่ครบ",`ต้องมีอาหารที่คราฟแล้วอย่างน้อย ${item.dishAny} ชิ้น`);return}if(item.meritNeed&&(Number(s.merit)||0)<item.meritNeed){message("กุศลไม่พอ",`ต้องใช้ ${item.meritNeed} คะแนนกุศล`);return}if(!Object.entries(item.need||{}).every(([k,n])=>(Number(s.animalProducts[k])||0)>=n)){message("วัตถุดิบยังไม่ครบ","ผลผลิตสัตว์ยังไม่ครบตามสูตร");return}
  if(item.dishAny)consumeAnyDishes(s,item.dishAny);if(item.meritNeed)s.merit-=item.meritNeed;Object.entries(item.need||{}).forEach(([k,n])=>s.animalProducts[k]-=n);s.specials[key]=(s.specials[key]||0)+1;save();updateMeritUI();message("คราฟสำเร็จ",`ยินดีด้วยนะคะ คุณได้รับ ${item.name} ×1<br>โอกาสสำเร็จ 100%`);
}

// ===== กระเป๋า: สมาชิกทั่วไป + สัตว์พิเศษ =====
function inventory(tab="crops"){
  if(guardResting())return;const s=ownState||state,dishMap=dishCounts();const tabs=[["crops","🌱 พืชพรรณ"],["products","🐾 ผลผลิตสัตว์"],["food","🍲 อาหาร"],["specials","🕯️ ของพิเศษ"],["specialAnimals","🪼 สัตว์พิเศษ"],["mysteryBoxes","🎲 กล่องสุ่ม"]];let body="";
  if(tab==="crops")body=Object.entries(CROPS).map(([k,c])=>`<div class="inventory-item"><img src="${c.readyImg}" alt="${c.name}"><span>${c.name}</span><b>×${s.bag[k]||0}</b></div>`).join("");
  else if(tab==="products")body=Object.entries(ANIMAL_PRODUCTS).map(([k,p])=>`<div class="inventory-item"><img src="${p.image}" alt="${p.name}"><span>${p.name}</span><b>×${s.animalProducts[k]||0}</b></div>`).join("");
  else if(tab==="food")body=RECIPES.map(r=>`<div class="inventory-item"><img src="${r.image}" alt="${r.name}"><span>${r.name}</span><b>×${dishMap[r.id]||0}</b></div>`).join("");
  else if(tab==="specialAnimals")body=Object.entries(JELLYFISH_TYPES).map(([k,j])=>`<div class="inventory-item"><img src="${j.image}" alt="${j.name}"><span>${j.name}<small style="display:block">ยังไม่เริ่มนับอายุจนกว่าจะวางลงบ่อ</small></span><b>×${s.specialAnimals[k]||0}</b></div>`).join("");
  else if(tab==="mysteryBoxes")body=`<div class="inventory-item special-coconut-item"><img src="${JELLY_BOX.image}" alt="${JELLY_BOX.name}"><span>${JELLY_BOX.name}<small style="display:block">กดใช้งานเพื่อเปิดกล่องและสุ่มรางวัล</small></span><b>×${s.mysteryBoxes||0}</b>${(Number(s.mysteryBoxes)||0)>0?'<button type="button" id="useJellyBoxBtn">ใช้งาน</button>':""}</div>`;
  else body=Object.entries(SPECIAL_ITEMS).map(([k,item])=>{const desc=item.kind==="animal"?`เร่งผลผลิตสัตว์ ${item.boost}%`:item.kind==="crop"?`เร่งโตพืช ${item.boost}%`:(item.description||"");return `<div class="inventory-item special-coconut-item"><img src="${item.image}" alt="${item.name}"><span>${item.name}<small style="display:block">${desc}</small></span><b>×${s.specials[k]||0}</b></div>`}).join("");
  $("modalContent").innerHTML=`<section class="feature-panel inventory-panel"><h2>🎒 กระเป๋าผี</h2><div class="inventory-tabs inventory-tabs-v2">${tabs.map(([k,label])=>`<button type="button" data-inventory-tab="${k}" class="${k===tab?"active":""}">${label}</button>`).join("")}</div><div class="inventory-grid">${body}</div></section>`;document.querySelectorAll("[data-inventory-tab]").forEach(b=>b.onclick=()=>inventory(b.dataset.inventoryTab));if($("useJellyBoxBtn"))$("useJellyBoxBtn").onclick=showJellyBoxUse;openModal();
}

// ===== ผีน้อย: เพิ่มโอกาสยาถ่ายแมงกะพรุน =====
function friendlyGhostReward(){
  if(guardResting())return;const target=ownState||state,rem=Math.max(0,Number(target.friendlyGhostUntil||0)-gameNow());if(rem>0){message("👻 กดบ่อยเกินไปค่ะแม่ รอก่อน",`ผีน้อยใจดีมาแจกของได้อีกใน ${formatFriendlyCountdown(rem)}`);return}
  const pool=[...Object.keys(CROPS).map(k=>({type:"crop",key:k,name:CROPS[k].name})),...Object.keys(ANIMAL_PRODUCTS).map(k=>({type:"product",key:k,name:ANIMAL_PRODUCTS[k].name})),...RECIPES.map(r=>({type:"dish",key:r.id,name:r.name})),{type:"merit",key:"merit",name:"กุศล"},{type:"special",key:"jellyfishLaxative",name:"ยาถ่ายแมงกะพรุน"}];const prize=pool[Math.floor(Math.random()*pool.length)],qty=prize.key==="jellyfishLaxative"?1:randInt(1,2);
  if(prize.type==="crop")target.bag[prize.key]=(target.bag[prize.key]||0)+qty;if(prize.type==="product")target.animalProducts[prize.key]=(target.animalProducts[prize.key]||0)+qty;if(prize.type==="dish")addDishToState(target,prize.key,qty);if(prize.type==="special")target.specials[prize.key]=(target.specials[prize.key]||0)+qty;if(prize.type==="merit")target.merit+=qty;
  target.friendlyGhostUntil=gameNow()+FRIENDLY_GHOST_COOLDOWN;incrementMissionOn(target,"friendlyGhost",qty);save();updateMeritUI();message("👻 ผีน้อยใจดี",`รับ ${qty}x ${prize.name}`);
}

// ===== สไตล์สัตว์ตอนวาง =====
function animalSlotHTML(sceneName,index){
  const s=ownState||state,item=animalById(sceneName),animal=s.animals[sceneName][index];if(animal){const expired=animalIsExpired(animal),remaining=Math.max(0,Number(animal.readyAt||0)-gameNow()),ready=!expired&&remaining<=0,img=animalImageForStyle(sceneName,animal.style);return `<button class="animal-owned-slot ${ready?"product-ready":""} ${expired?"animal-expired":""}" data-owned-animal="${index}" style="left:${ANIMAL_SLOT_POSITIONS[index][0]}%;top:${ANIMAL_SLOT_POSITIONS[index][1]}%" type="button"><img src="${img}" alt="${item.name}">${animal.bonus&&!expired?'<span class="animal-merit-star">⭐</span>':""}<small>${expired?"หมดอายุแล้ว":ready?`${item.productName}พร้อมเก็บ`:`${formatAnimalLife(animal.expiresAt-gameNow())}`}</small></button>`}return `<button class="animal-add-slot" type="button" data-animal-slot="${index}" style="left:${ANIMAL_SLOT_POSITIONS[index][0]}%;top:${ANIMAL_SLOT_POSITIONS[index][1]}%">+</button>`;
}
function showAnimalApprovalChoices(sceneName,slotIndex){
  const s=ownState||state,item=animalById(sceneName);if(!item)return;if(s.animals[sceneName][slotIndex]){showAnimalDetails(sceneName,slotIndex);return}const waiting=Number(s.pendingAnimals[sceneName])||0;if(waiting<=0){message("ยังไม่มีสัตว์รอวาง",`ตอนนี้ไม่มี ${item.name} ที่ได้รับสิทธิ์แล้ว<br>ซื้อเพิ่มได้ที่ร้านค้าสัตว์วิญญาณ`);return}
  const styles=ANIMAL_STYLES[sceneName];if(!styles){$("modalContent").innerHTML=`<section class="feature-panel animal-picker-panel"><h2>วาง ${item.name}</h2><div class="animal-picker-grid single-animal-choice"><button id="placeAnimalBtn" type="button"><img src="${item.image}" alt="${item.name}"><b>${item.name}</b><small>มีรอวาง ×${waiting}<br>อายุจะเริ่มนับทันทีเมื่อกดวาง</small></button></div></section>`;openModal();$("placeAnimalBtn").onclick=()=>placeAnimal(sceneName,slotIndex,1);return}
  $("modalContent").innerHTML=`<section class="feature-panel animal-picker-panel"><h2>เลือกสไตล์ ${item.name}</h2><p class="feature-subtitle">มีรอวาง ×${waiting} • เลือกสไตล์ของตัวนี้ก่อนวาง</p><div class="animal-style-grid">${styles.map((img,i)=>`<button type="button" data-animal-style="${i+1}"><img src="${img}" alt="${item.name} สไตล์ ${i+1}"><b>สไตล์ ${i+1}</b></button>`).join("")}</div></section>`;document.querySelectorAll("[data-animal-style]").forEach(btn=>btn.onclick=()=>placeAnimal(sceneName,slotIndex,Number(btn.dataset.animalStyle)));openModal();
}
function placeAnimal(sceneName,slotIndex,style=1){
  const s=ownState||state,item=animalById(sceneName),meta=ANIMAL_META[sceneName];if(!item||!meta)return;if(s.animals[sceneName][slotIndex])return;if((Number(s.pendingAnimals[sceneName])||0)<=0){message("ไม่มีสัตว์รอวาง","กรุณาซื้อหรือรอการอนุมัติก่อน");return}const now=gameNow();s.pendingAnimals[sceneName]-=1;s.animals[sceneName][slotIndex]={name:"",style:ANIMAL_STYLES[sceneName]?Math.min(4,Math.max(1,Number(style)||1)):1,placedAt:now,expiresAt:now+meta.lifeMs,readyAt:now+item.productionMs,bonus:false};save();closeModal();renderAnimalScene(sceneName);showWeatherToast(`🐾 วาง ${item.name} แล้ว`);
}
function showAnimalDetails(sceneName,index){
  const s=ownState||state,item=animalById(sceneName),animal=s.animals[sceneName][index];if(!item||!animal)return;const expired=animalIsExpired(animal),life=expired?"0 วัน 0 ชม.":formatAnimalLife(animal.expiresAt-gameNow()),productRemaining=Math.max(0,Number(animal.readyAt||0)-gameNow()),ready=!expired&&productRemaining<=0,img=animalImageForStyle(sceneName,animal.style);
  $("modalContent").innerHTML=`<section class="feature-panel animal-detail-panel"><img class="animal-detail-img" src="${img}" alt="${item.name}"><h2>${safeHtml(animal.name||item.name)}</h2><p><b>ชนิด:</b> ${item.name}${ANIMAL_STYLES[sceneName]?` • สไตล์ ${animal.style||1}`:""}<br><b>อายุคงเหลือ:</b> ${life}<br><b>ผลผลิต:</b> ${expired?"หยุดผลิตแล้ว":ready?`${item.productName} พร้อมเก็บ`:`เหลือ ${formatHM(productRemaining)}`}</p><div class="animal-detail-actions">${expired?`<button id="removeExpiredAnimalBtn" class="danger-action" type="button">นำสัตว์หมดอายุออกจากคอก</button>`:`<button id="renameAnimalBtn" class="secondary-action" type="button">ตั้งชื่อ</button>${animal.bonus?`<button id="collectAnimalBtn" class="primary-spooky-action" type="button">⭐ รับโบนัสกุศล</button>`:ready?`<button id="collectAnimalBtn" class="primary-spooky-action" type="button">เก็บ ${item.productName}</button>`:""}`}</div>${!expired?animalPestleHTML(sceneName,index):""}</section>`;openModal();if(expired){$("removeExpiredAnimalBtn").onclick=()=>removeExpiredAnimal(sceneName,index);return}$("renameAnimalBtn").onclick=()=>renameAnimal(sceneName,index);const collect=$("collectAnimalBtn");if(collect)collect.onclick=()=>collectAnimal(sceneName,index);document.querySelectorAll("[data-use-pestle]").forEach(btn=>btn.onclick=()=>usePestleOnAnimal(sceneName,index,btn.dataset.usePestle));
}

// ===== ร้านค้า: เลือกจำนวน 1–10 / กล่องสุ่มแยกหมวด =====
function qtyInput(id,max){return `<label class="shop-qty-label">จำนวน <input id="${id}" class="shop-qty-input" type="number" min="1" max="${Math.max(1,max)}" value="1"></label>`}
async function showShop(tab="animals"){
  if(guardResting())return;const s=ownState||state;ensureDailyLimitsFor(s);
  const animalCards=SHOP_ITEMS.map(item=>{const meta=ANIMAL_META[item.id],used=animalCapacityUsed(item.id,s),remain=Math.max(0,ANIMAL_CAPACITY-used),max=Math.min(SHOP_REQUEST_MAX_QTY,remain);return `<article class="shop-card"><img class="shop-animal-img" src="${item.image}" alt="${item.name}"><b>${item.name}</b><small class="shop-price">${meta.price} ⭐️ / ตัว • ใช้พื้นที่ ${used}/${ANIMAL_CAPACITY}</small>${max>0?qtyInput(`animalQty-${item.id}`,max):""}<button class="shop-worship-button" type="button" data-buy-animal="${item.id}" ${max<=0?"disabled":""}>${max<=0?"คอกเต็มแล้ว":"ส่งคำขอซื้อ"}</button></article>`}).join("");
  const specialUsed=Number(s.dailyLimits.specialPurchases)||0,specialRemain=Math.max(0,SPECIAL_DAILY_LIMIT-specialUsed);const specialCards=SPECIAL_SHOP_KEYS.map(key=>{const item=SPECIAL_ITEMS[key],max=Math.min(SHOP_REQUEST_MAX_QTY,specialRemain);return `<article class="shop-card"><img class="shop-animal-img" src="${item.image}" alt="${item.name}"><b>${item.name}</b><small class="shop-price">20 ⭐️ / ชิ้น • ${item.boost}%</small>${max>0?qtyInput(`specialQty-${key}`,max):""}<button class="shop-worship-button" type="button" data-buy-special="${key}" ${max<=0?"disabled":""}>${max<=0?"ครบลิมิตวันนี้แล้ว":"ส่งคำขอซื้อ"}</button></article>`}).join("");
  const jellyUsed=Number(s.dailyLimits.jellyBoxes)||0,jellyRemain=Math.max(0,JELLY_BOX_DAILY_LIMIT-jellyUsed),jellyMax=Math.min(JELLY_BOX_DAILY_LIMIT,jellyRemain);const mysteryCard=`<article class="shop-card mystery-box-card"><img class="shop-animal-img" src="${JELLY_BOX.image}" alt="${JELLY_BOX.name}"><b>${JELLY_BOX.name}</b><small class="shop-price">${JELLY_BOX.price} ⭐️ / กล่อง</small><div class="mystery-rules"><strong>ซื้อได้สูงสุด ${JELLY_BOX_DAILY_LIMIT} กล่อง/วัน/คน</strong><span>โอกาสได้รับแมงกะพรุน 10%</span><span>ถ้าไม่ออกพรุน สุ่ม: อาหารคราฟ x2 / ใบไผ่ x5 / แพลงก์ตอน x2 / กุศล +5 / ยาถ่ายแมงกะพรุน x1</span><span>วันนี้ใช้ ${jellyUsed}/${JELLY_BOX_DAILY_LIMIT}</span></div>${jellyMax>0?qtyInput("jellyBoxQty",jellyMax):""}<button class="shop-worship-button" id="buyJellyBoxBtn" type="button" ${jellyMax<=0?"disabled":""}>${jellyMax<=0?"ครบ 7 กล่องวันนี้แล้ว":"ส่งคำขอซื้อ"}</button></article>`;
  $("modalContent").innerHTML=`<section class="feature-panel shop-panel"><button id="stableEntranceBtn" class="stable-entrance-button" type="button">ทางเข้าโรงเรือน</button><h2>🕯️ ร้านค้า</h2><div class="shop-category-tabs shop-category-tabs-v2"><button type="button" data-shop-tab="animals" class="${tab==="animals"?"active":""}">🐾 สัตว์วิญญาณ</button><button type="button" data-shop-tab="specials" class="${tab==="specials"?"active":""}">🎁 ของพิเศษ</button><button type="button" data-shop-tab="mystery" class="${tab==="mystery"?"active":""}">🎲 กล่องสุ่ม</button></div>${tab==="animals"?`<p class="feature-subtitle">เลือกจำนวนได้สูงสุด 10 ตัวต่อคำขอ • ดาวเป็นราคาที่แสดงเท่านั้น</p><div class="shop-grid">${animalCards}</div>`:tab==="specials"?`<p class="feature-subtitle">เลือกจำนวนได้สูงสุด 10 ชิ้นต่อคำขอ • ของพิเศษรวมวันละ ${SPECIAL_DAILY_LIMIT} ชิ้น • วันนี้ใช้ ${specialUsed}/${SPECIAL_DAILY_LIMIT}</p><div class="shop-grid">${specialCards}</div>`:`<p class="feature-subtitle">กล่องสุ่มแมงกะพรุน • จำกัดรายวันชัดเจน</p><div class="shop-grid mystery-shop-grid">${mysteryCard}</div>`}</section>`;
  $("stableEntranceBtn").onclick=()=>{closeModal();openScene("chicken")};document.querySelectorAll("[data-shop-tab]").forEach(btn=>btn.onclick=()=>showShop(btn.dataset.shopTab));document.querySelectorAll("[data-buy-animal]").forEach(btn=>btn.onclick=()=>requestAnimalPurchase(btn.dataset.buyAnimal,Number($(`animalQty-${btn.dataset.buyAnimal}`)?.value)||1));document.querySelectorAll("[data-buy-special]").forEach(btn=>btn.onclick=()=>requestSpecialPurchase(btn.dataset.buySpecial,Number($(`specialQty-${btn.dataset.buySpecial}`)?.value)||1));if($("buyJellyBoxBtn"))$("buyJellyBoxBtn").onclick=()=>requestMysteryBoxPurchase(Number($("jellyBoxQty")?.value)||1);openModal();
}
async function requestAnimalPurchase(type,qty=1){
  if(!cloudReady){message("ยังซื้อไม่ได้","กรุณาเชื่อม Firebase ก่อน");return}const item=animalById(type),meta=ANIMAL_META[type];if(!item||!meta)return;qty=Math.max(1,Math.min(SHOP_REQUEST_MAX_QTY,Math.floor(Number(qty)||1)));
  try{const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey),requestRef=fs.doc(fs.collection(db,"purchaseRequests"));let next;await fs.runTransaction(db,async tx=>{const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(snap.data(),currentMember),used=animalPlacedCount(type,s)+(Number(s.pendingAnimals[type])||0)+(Number(s.purchasePendingCounts[type])||0),free=ANIMAL_CAPACITY-used;if(free<=0)throw new Error("คอกสัตว์ชนิดนี้เต็มแล้ว");if(qty>free)throw new Error(`วางเพิ่มได้สูงสุด ${free} ตัว`);s.purchasePendingCounts[type]=(Number(s.purchasePendingCounts[type])||0)+qty;next=s;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(requestRef,{category:"animal",itemKey:type,itemName:item.name,price:meta.price,qty,status:"pending",memberKey:currentMemberKey,memberName:currentMember,dateKey:currentBangkokDateKey(),createdAt:fs.serverTimestamp()})});ownState=normalizeState(next,currentMember);state=ownState;message("🐾 ส่งคำขอแล้ว",`${item.name} ×${qty}<br>${meta.price*qty}⭐️ รวม<br>รอการอนุมัติจากยัยหนู`);refreshNotificationBadge()}catch(error){message("ส่งคำขอไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function requestSpecialPurchase(key,qty=1){
  if(!cloudReady){message("ยังซื้อไม่ได้","กรุณาเชื่อม Firebase ก่อน");return}const item=SPECIAL_ITEMS[key];if(!item||!SPECIAL_SHOP_KEYS.includes(key))return;qty=Math.max(1,Math.min(SHOP_REQUEST_MAX_QTY,Math.floor(Number(qty)||1)));
  try{const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey),requestRef=fs.doc(fs.collection(db,"purchaseRequests"));let next;await fs.runTransaction(db,async tx=>{const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(snap.data(),currentMember);ensureDailyLimitsFor(s);const remain=SPECIAL_DAILY_LIMIT-(Number(s.dailyLimits.specialPurchases)||0);if(qty>remain)throw new Error(`วันนี้ซื้อของพิเศษได้อีก ${Math.max(0,remain)} ชิ้น`);s.dailyLimits.specialPurchases+=qty;next=s;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(requestRef,{category:"special",itemKey:key,itemName:item.name,price:20,qty,status:"pending",memberKey:currentMemberKey,memberName:currentMember,dateKey:currentBangkokDateKey(),createdAt:fs.serverTimestamp()})});ownState=normalizeState(next,currentMember);state=ownState;message("🎁 ส่งคำขอแล้ว",`${item.name} ×${qty}<br>${20*qty}⭐️ รวม<br>รอการอนุมัติจากยัยหนู`);refreshNotificationBadge()}catch(error){message("ส่งคำขอไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function requestMysteryBoxPurchase(qty=1){
  if(!cloudReady){message("ยังซื้อไม่ได้","กรุณาเชื่อม Firebase ก่อน");return}qty=Math.max(1,Math.min(JELLY_BOX_DAILY_LIMIT,Math.floor(Number(qty)||1)));
  try{const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey),requestRef=fs.doc(fs.collection(db,"purchaseRequests"));let next;await fs.runTransaction(db,async tx=>{const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(snap.data(),currentMember);ensureDailyLimitsFor(s);const remain=JELLY_BOX_DAILY_LIMIT-(Number(s.dailyLimits.jellyBoxes)||0);if(qty>remain)throw new Error(`วันนี้ซื้อกล่องสุ่มได้อีก ${Math.max(0,remain)} กล่อง`);s.dailyLimits.jellyBoxes+=qty;next=s;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(requestRef,{category:"mystery",itemKey:"jellyfishBox",itemName:JELLY_BOX.name,price:JELLY_BOX.price,qty,status:"pending",memberKey:currentMemberKey,memberName:currentMember,dateKey:currentBangkokDateKey(),createdAt:fs.serverTimestamp()})});ownState=normalizeState(next,currentMember);state=ownState;message("🎲 ส่งคำขอแล้ว",`${JELLY_BOX.name} ×${qty}<br>${JELLY_BOX.price*qty}⭐️ รวม<br>รอการอนุมัติจากยัยหนู`);refreshNotificationBadge()}catch(error){message("ส่งคำขอไม่ได้",error.message||"กรุณาลองใหม่")}
}
function rollMysteryBoxRewardOnState(s){
  if(Math.random()<.10){const keys=Object.keys(JELLYFISH_TYPES),key=keys[Math.floor(Math.random()*keys.length)];s.specialAnimals[key]=(Number(s.specialAnimals[key])||0)+1;return `🪼 ${JELLYFISH_TYPES[key].name} x1`}
  const roll=Math.floor(Math.random()*5);
  if(roll===0){const r=RECIPES[Math.floor(Math.random()*RECIPES.length)];addDishToState(s,r.id,2);return `🍲 ${r.name} x2`}
  if(roll===1){s.specials.bambooLeaf=(Number(s.specials.bambooLeaf)||0)+5;return"🎋 ใบไผ่ x5"}
  if(roll===2){s.bag.hauntedPlankton=(Number(s.bag.hauntedPlankton)||0)+2;return"🫧 แพลงก์ตอนหลอนปิ๊ x2"}
  if(roll===3){s.merit=(Number(s.merit)||0)+5;return"🙏 กุศล +5"}
  s.specials.jellyfishLaxative=(Number(s.specials.jellyfishLaxative)||0)+1;return"🧪 ยาถ่ายแมงกะพรุน x1";
}
function showJellyBoxUse(){
  const s=ownState||state,count=Math.max(0,Number(s?.mysteryBoxes)||0);if(count<=0){message("ไม่มีกล่องสุ่ม","ตอนนี้คุณไม่มีกล่องสุ่มแมงกะพรุนในกระเป๋า");return}
  $("modalContent").innerHTML=`<section class="feature-panel mystery-box-open-panel"><img class="shop-animal-img" src="${JELLY_BOX.image}" alt="${JELLY_BOX.name}"><h2>${JELLY_BOX.name}</h2><p>มีอยู่ <b>×${count}</b><br>เปิดครั้งละ 1 กล่อง แล้วระบบจะสุ่มรางวัลให้ทันที</p><button id="openJellyBoxBtn" class="primary-spooky-action" type="button">เปิดกล่อง</button><button id="cancelJellyBoxBtn" class="secondary-action" type="button">ยังไม่เปิด</button></section>`;openModal();$("openJellyBoxBtn").onclick=openOneJellyBox;$("cancelJellyBoxBtn").onclick=()=>inventory("mysteryBoxes");
}
async function openOneJellyBox(){
  if(!cloudReady){message("ยังเปิดกล่องไม่ได้","กรุณาเชื่อม Firebase ก่อน");return}
  const btn=$("openJellyBoxBtn");if(btn)btn.disabled=true;
  try{const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey);let next,reward="";await fs.runTransaction(db,async tx=>{const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(snap.data(),currentMember);if((Number(s.mysteryBoxes)||0)<1)throw new Error("กล่องสุ่มหมดแล้ว");s.mysteryBoxes-=1;reward=rollMysteryBoxRewardOnState(s);next=s;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false})});ownState=normalizeState(next,currentMember);state=ownState;updateMeritUI();message("🎁 เปิดกล่องแล้ว!",`คุณได้รับ<br><b>${reward}</b><br><br>กล่องสุ่มคงเหลือ ×${ownState.mysteryBoxes||0}`)}catch(error){message("เปิดกล่องไม่ได้",error.message||"กรุณาลองใหม่")}
}

// ===== สมาชิกส่งได้เฉพาะอาหาร + ผลผลิตสัตว์; Admin แยกสิทธิ์ด้านล่าง =====
function giftableEntries(s=ownState||state){
  const entries=[];Object.entries(ANIMAL_PRODUCTS).forEach(([key,item])=>{const count=Number(s.animalProducts[key])||0;if(count>0)entries.push({type:"product",key,name:item.name,image:item.image,count})});RECIPES.forEach(r=>{const count=dishCountInState(r.id,s);if(count>0)entries.push({type:"dish",key:r.id,name:r.name,image:r.image,count})});return entries;
}
function addGiftItemToState(s,gift){
  const qty=Math.max(1,Number(gift.qty)||1);if(gift.itemType==="product")s.animalProducts[gift.itemKey]=(Number(s.animalProducts[gift.itemKey])||0)+qty;else if(gift.itemType==="crop")s.bag[gift.itemKey]=(Number(s.bag[gift.itemKey])||0)+qty;else if(gift.itemType==="special")s.specials[gift.itemKey]=(Number(s.specials[gift.itemKey])||0)+qty;else if(gift.itemType==="jelly")s.specialAnimals[gift.itemKey]=(Number(s.specialAnimals[gift.itemKey])||0)+qty;else if(gift.itemType==="dish"){if(!recipeById(gift.itemKey))throw new Error("ไม่พบเมนูอาหาร");addDishToState(s,gift.itemKey,qty)}else if(gift.itemType==="merit")s.merit=(Number(s.merit)||0)+qty;else throw new Error("ประเภทของขวัญไม่รองรับ");
}
function removeGiftItemFromState(s,itemType,itemKey,qty){
  qty=Math.max(1,Number(qty)||1);if(itemType==="product"){if((Number(s.animalProducts[itemKey])||0)<qty)return false;s.animalProducts[itemKey]-=qty;return true}if(itemType==="crop"){if((Number(s.bag[itemKey])||0)<qty)return false;s.bag[itemKey]-=qty;return true}if(itemType==="special"){if((Number(s.specials[itemKey])||0)<qty)return false;s.specials[itemKey]-=qty;return true}if(itemType==="jelly"){if((Number(s.specialAnimals[itemKey])||0)<qty)return false;s.specialAnimals[itemKey]-=qty;return true}if(itemType==="dish")return removeDishesFromState(s,itemKey,qty);if(itemType==="merit")return true;return false;
}
function showGiftComposer(targetKey,targetName){
  const s=ownState||state;ensureDailyLimitsFor(s);const entries=giftableEntries(s),remain=Math.max(0,FRIEND_GIFT_DAILY_LIMIT-(Number(s.dailyLimits.giftsSent)||0));if(!entries.length){message("ยังส่งของขวัญไม่ได้","สมาชิกทั่วไปส่งได้เฉพาะอาหารที่คราฟแล้ว และผลผลิตจากสัตว์");return}if(remain<=0){message("ครบลิมิตวันนี้แล้ว",`วันนี้ส่งของขวัญครบ ${FRIEND_GIFT_DAILY_LIMIT} ชิ้นแล้ว`);return}
  $("modalContent").innerHTML=`<section class="feature-panel gift-panel"><h2>🎁 ส่งของให้ ${safeHtml(targetName)}</h2><p class="feature-subtitle">ส่งได้เฉพาะอาหาร + ผลผลิตสัตว์ • รวมวันละ ${FRIEND_GIFT_DAILY_LIMIT} ชิ้น • เหลือ ${remain}</p><div class="gift-item-list">${entries.map((e,i)=>`<label class="gift-item-option"><input type="radio" name="giftItem" value="${i}" ${i===0?"checked":""}><img src="${e.image}" alt="${e.name}"><span>${safeHtml(e.name)}<small>มี ×${e.count}</small></span></label>`).join("")}</div><label class="gift-qty-label">จำนวน <input id="giftQty" type="number" min="1" max="${remain}" value="1"></label><button id="sendFriendGiftBtn" class="primary-spooky-action gift-send-btn" type="button">ส่งของขวัญ</button></section>`;openModal();$("sendFriendGiftBtn").onclick=()=>{const idx=Number(document.querySelector('input[name="giftItem"]:checked')?.value||0),entry=entries[idx],qty=Math.max(1,Number($("giftQty").value)||1);sendFriendGift(targetKey,targetName,entry,qty)};
}

// ===== ขโมยพืชเพื่อน: 5 คน/วัน และคนเดิมซ้ำไม่ได้ =====
function showStealConfirmation(index){
  const plot=state.plots[index];if(!plot?.crop)return;$("modalContent").innerHTML=`<section class="feature-panel steal-confirm-panel"><h2>คุณแน่ใจนะว่าจะทำสันดานแบบนี้</h2><p>🧤 ${CROPS[plot.crop].name} พร้อมเก็บอยู่ตรงหน้าแล้ว</p><div class="steal-confirm-actions"><button id="confirmStealBtn" class="danger-action" type="button">พี่ลำบากพี่ต้องทำ</button><button id="cancelStealBtn" class="secondary-action" type="button">ไม่ดีกว่า กลับใจ</button></div></section>`;openModal();$("confirmStealBtn").onclick=()=>stealFriendPlot(index);$("cancelStealBtn").onclick=closeModal;
}
async function tapFriendPlot(index){
  if(!visitContext)return;const plot=state.plots[index];ensurePlotPhase(plot);if(plot?.phase==="ready"){showStealConfirmation(index);return}if(plot?.phase!=="needsWater"&&plot?.phase!=="worm"){message("เยี่ยมสวนเพื่อน","คุณสามารถรดน้ำ กำจัดหนอน หรือขโมยต้นที่พร้อมเก็บได้");return}
  const action=plot.phase==="needsWater"?"water":"worm",targetKey=visitContext.memberKey,targetName=visitContext.name;
  try{const {db,fs}=await getFirebaseContext(),gardenRef=fs.doc(db,"gardens",targetKey),ownSaveRef=fs.doc(db,"saves",currentMemberKey),mailRef=fs.doc(fs.collection(db,"mailboxes",targetKey,"items"));let nextOwn,newPlots;await fs.runTransaction(db,async tx=>{const [gardenSnap,ownSnap]=await Promise.all([tx.get(gardenRef),tx.get(ownSaveRef)]);if(!gardenSnap.exists()||!ownSnap.exists())throw new Error("ข้อมูลสวนไม่พร้อม");const plots=(gardenSnap.data().plots||[]).map(ensurePlotPhaseStandalone),p=plots[index];if(!p?.crop)throw new Error("แปลงนี้ว่างแล้ว");const own=normalizeState(ownSnap.data(),currentMember);if(action==="water"){if(p.phase!=="needsWater")throw new Error("ต้นนี้ไม่ต้องการน้ำแล้ว");const crop=CROPS[p.crop],finalMs=Math.max(60000,crop.totalMs-crop.waterMs);p.wateredAt=gameNow();if(Math.random()<Number(crop.wormChance||0)){p.phase="worm";p.worm=true;p.phaseEndsAt=0}else{p.phase="growing2";p.worm=false;p.phaseEndsAt=gameNow()+finalMs}incrementMissionOn(own,"waterFriends",1)}else{if(p.phase!=="worm")throw new Error("หนอนถูกกำจัดไปแล้ว");const crop=CROPS[p.crop];p.phase="growing2";p.worm=false;p.phaseEndsAt=gameNow()+Math.max(60000,crop.totalMs-crop.waterMs);incrementMissionOn(own,"clearWorms",1)}plots[index]=p;nextOwn=own;newPlots=plots;tx.set(gardenRef,{memberKey:targetKey,displayName:targetName,plots:cloneData(plots),updatedAt:fs.serverTimestamp()},{merge:true});tx.set(ownSaveRef,{...cloneData(own),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(mailRef,{source:"friend",type:action==="water"?"friendWater":"friendWorm",fromKey:currentMemberKey,fromName:currentMember,title:action==="water"?`${currentMember} เข้ามารดน้ำพืชพันธุ์ให้คุณ 💧`:`${currentMember} เข้ามากำจัดหนอนให้คุณ 🐛`,text:"",read:false,createdAt:fs.serverTimestamp()})});ownState=normalizeState(nextOwn,currentMember);state.plots=newPlots.map(normalizePlot);draw();showWeatherToast(action==="water"?"💧 รดน้ำให้เพื่อนแล้ว":"🐛 กำจัดหนอนให้เพื่อนแล้ว")}catch(error){message("ช่วยสวนไม่สำเร็จ",error.message||"กรุณาลองใหม่")}
}
async function stealFriendPlot(index){
  if(!visitContext||!cloudReady)return;const targetKey=visitContext.memberKey,targetName=visitContext.name;
  try{const {db,fs}=await getFirebaseContext(),gardenRef=fs.doc(db,"gardens",targetKey),ownSaveRef=fs.doc(db,"saves",currentMemberKey),mailRef=fs.doc(fs.collection(db,"mailboxes",targetKey,"items"));let nextOwn,cropKey="";await fs.runTransaction(db,async tx=>{const [gardenSnap,ownSnap]=await Promise.all([tx.get(gardenRef),tx.get(ownSaveRef)]);if(!gardenSnap.exists()||!ownSnap.exists())throw new Error("ข้อมูลสวนไม่พร้อม");const plots=(gardenSnap.data().plots||[]).map(ensurePlotPhaseStandalone),p=plots[index];if(!p?.crop||p.phase!=="ready")throw new Error("ต้นนี้ไม่พร้อมให้ขโมยแล้ว");const own=normalizeState(ownSnap.data(),currentMember);ensureDailyLimitsFor(own);if((Number(own.dailyLimits.steals)||0)>=FRIEND_STEAL_DAILY_LIMIT)throw new Error(`วันนี้ขโมยครบ ${FRIEND_STEAL_DAILY_LIMIT} ครั้งแล้ว`);if(own.dailyLimits.stolenFromKeys.includes(targetKey))throw new Error("วันนี้คุณขโมยสวนคนนี้ไปแล้ว ต้องไปขโมยคนอื่น");cropKey=p.crop;grantHarvestYield(own,cropKey,1);own.dailyLimits.steals+=1;own.dailyLimits.stolenFromKeys.push(targetKey);nextOwn=own;tx.set(ownSaveRef,{...cloneData(own),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(mailRef,{source:"friend",type:"cropSteal",fromKey:currentMemberKey,title:"มีคนขี้ลัก เข้ามาขโมยพืชผักของคุณ",text:"",read:false,createdAt:fs.serverTimestamp()})});ownState=normalizeState(nextOwn,currentMember);closeModal();draw();showWeatherToast(`🧤 ขโมย ${CROPS[cropKey].name} สำเร็จ • เจ้าของยังเก็บของตัวเองได้`)}catch(error){message("ขโมยไม่ได้",error.message||"กรุณาลองใหม่")}
}

// ===== สวนแพนด้า =====
const PANDA_POSITIONS=[[11,16,27,16],[61,38,30,15],[16,43,25,18],[66,53,27,19],[4,65,33,16],[43,71,31,19]];
const PANDA_META=[{leaf:1,min:1,max:3},{leaf:1,min:1,max:3},{leaf:2,min:5,max:9},{leaf:2,min:5,max:9},{leaf:3,min:4,max:12},{leaf:3,min:4,max:12}];
function renderPandaScene(){
  setSceneNav({backText:"กลับไปที่แปลง",backAction:returnToFarm,nextText:"คราฟใบไผ่",nextAction:showBambooLeafCraft});const leaves=specialCount("bambooLeaf");$("sceneInteractiveLayer").innerHTML=`<div class="panda-leaf-banner">🎋 ใบไผ่ของคุณ ×${leaves}</div>${PANDA_POSITIONS.map(([l,t,w,h],i)=>`<button class="panda-hotspot" data-panda="${i}" type="button" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%" aria-label="แพนด้าตัวที่ ${i+1}"></button>`).join("")}`;document.querySelectorAll("[data-panda]").forEach(btn=>btn.onclick=()=>showPandaFeed(Number(btn.dataset.panda)));
}
function showPandaFeed(index){
  const meta=PANDA_META[index],leaves=specialCount("bambooLeaf");$("modalContent").innerHTML=`<section class="feature-panel panda-feed-panel"><h2>🐼 แพนด้าตัวที่ ${index+1}</h2><p>มีใบไผ่ <b>×${leaves}</b><br>ใช้ใบไผ่ ×${meta.leaf} ต่อครั้ง<br>กุศลหลักสุ่ม ${meta.min}–${meta.max} และมีโอกาสได้อาหารหรือยาถ่ายแมงกะพรุน</p><button id="feedPandaBtn" class="primary-spooky-action" type="button">ให้อาหารแพนด้า</button></section>`;openModal();$("feedPandaBtn").onclick=()=>feedPanda(index);
}
async function feedPanda(index){
  const meta=PANDA_META[index];if(!meta)return;try{const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey);let next,result="";await fs.runTransaction(db,async tx=>{const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(snap.data(),currentMember);if((Number(s.specials.bambooLeaf)||0)<meta.leaf)throw new Error("ใบไผ่ไม่มียังจะเสร่อกด");s.specials.bambooLeaf-=meta.leaf;const roll=Math.random();if(roll<.12){s.specials.jellyfishLaxative=(Number(s.specials.jellyfishLaxative)||0)+1;result="🧪 ยาถ่ายแมงกะพรุน ×1"}else if(roll<.30){const r=RECIPES[Math.floor(Math.random()*RECIPES.length)],qty=randInt(1,2);addDishToState(s,r.id,qty);result=`🍲 ${r.name} ×${qty}`}else{const merit=randInt(meta.min,meta.max);s.merit+=merit;result=`🙏 +${merit} กุศล`}next=s;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false})});ownState=normalizeState(next,currentMember);state=ownState;updateMeritUI();closeModal();renderPandaScene();message("🐼 แพนด้ารับใบไผ่แล้ว",result)}catch(error){message("ให้อาหารไม่ได้",error.message||"กรุณาลองใหม่")}
}
function showBambooLeafCraft(){
  const s=ownState||state;$("modalContent").innerHTML=`<section class="feature-panel bamboo-craft-panel"><h2>🎋 คราฟใบไผ่</h2><p class="feature-subtitle">โอกาสสำเร็จ 50% • ถ้าพลาดวัตถุดิบถูกใช้ไป</p><div class="bamboo-craft-grid"><article><h3>🍲 สูตรอาหาร</h3><p>อาหารที่คราฟแล้วอะไรก็ได้รวม 3 จาน → ใบไผ่ ×1<br>มีอาหารรวม ${totalDishCount(s)} จาน</p><button id="craftLeafFoodBtn" type="button">คราฟด้วยอาหาร 3 จาน</button></article><article><h3>🐾 สูตรผลผลิตสัตว์</h3><p>ไข่ / เนื้อปลา / ทรัฟเฟิล / นม รวม 3 ชิ้น → ใบไผ่ ×1<br>มีผลผลิตรวม ${totalAnimalProductCount(s)} ชิ้น</p><button id="craftLeafAnimalBtn" type="button">คราฟด้วยผลผลิต 3 ชิ้น</button></article></div></section>`;openModal();$("craftLeafFoodBtn").onclick=()=>craftBambooLeaf("food");$("craftLeafAnimalBtn").onclick=()=>craftBambooLeaf("animal");
}
async function craftBambooLeaf(kind){
  try{const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey);let next,success=false;await fs.runTransaction(db,async tx=>{const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(snap.data(),currentMember);if(kind==="food"){if(totalDishCount(s)<3)throw new Error("อาหารที่คราฟแล้วยังไม่ครบ 3 จาน");consumeAnyDishes(s,3)}else{if(totalAnimalProductCount(s)<3)throw new Error("ผลผลิตสัตว์ยังไม่ครบ 3 ชิ้น");consumeAnyAnimalProducts(s,3)}success=Math.random()<.50;if(success)s.specials.bambooLeaf=(Number(s.specials.bambooLeaf)||0)+1;next=s;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false})});ownState=normalizeState(next,currentMember);state=ownState;showBambooLeafCraft();showWeatherToast(success?"🎋 คราฟสำเร็จ • ใบไผ่ +1":"💨 คราฟไม่สำเร็จ • วัตถุดิบหายแล้ว") }catch(error){message("คราฟใบไผ่ไม่ได้",error.message||"กรุณาลองใหม่")}
}

// เพิ่มปุ่มสวนป่าของด้าในสวนมะพร้าว
async function renderCoconutScene(){
  setSceneNav({backText:"กลับแปลงผัก",backAction:returnToFarm});if(!cloudReady){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">กำลังเชื่อมสวนมะพร้าวส่วนกลาง...</div>';return}try{await loadSharedCoconut()}catch(error){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">โหลดสวนมะพร้าวไม่สำเร็จ</div>';return}
  const s=ownState||state,quotaActive=Number(s.coconutQuotaResetAt||0)>gameNow(),used=quotaActive?(Number(s.coconutQuotaCount)||0):0;$("sceneInteractiveLayer").innerHTML=`<div class="coconut-quota-label">🥥 โควตารอบนี้ ${used}/${COCONUT_QUOTA_PER_ROUND}</div><button id="coconutHistoryBtn" class="coconut-history-btn" type="button">ประวัติ 50 รายการ</button>${COCONUT_TREE_POSITIONS_V1.map(([left,top,width,height],i)=>{const tree=sharedCoconutCache.trees[i],rem=Math.max(0,tree.nextAt-gameNow()),label=rem>0?`${tree.lastByName||"มีคน"} สอยแล้ว • ${coconutRemainingText(rem)}`:"พร้อมสอย";return `<button class="coconut-tree-hotspot" type="button" data-coconut-tree="${i}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%"><small>${safeHtml(label)}</small></button>`}).join("")}<button id="coconutBoatHotspot" class="coconut-boat-hotspot" type="button" aria-label="คราฟไอเท็มพิเศษ"><span class="coconut-boat-label">คราฟไอเท็มพิเศษ</span></button><button id="pandaForestBtn" class="panda-forest-entry" type="button">สวนป่าของด้า</button>`;document.querySelectorAll("[data-coconut-tree]").forEach(btn=>btn.onclick=()=>harvestCoconutTree(Number(btn.dataset.coconutTree)));$("coconutBoatHotspot").onclick=showCoconutCraft;$("coconutHistoryBtn").onclick=showCoconutHistory;$("pandaForestBtn").onclick=()=>openScene("panda");stopSceneTimer();sceneTimer=setInterval(()=>{if(currentScene!=="coconut"){stopSceneTimer();return}renderCoconutScene()},60000);
}

// ===== บ่อแมงกะพรุนส่วนกลาง 12 สล็อต =====
const JELLY_SLOT_POSITIONS=[[27,25],[50,24],[73,26],[27,40],[50,39],[73,41],[27,55],[50,54],[73,56],[27,70],[50,69],[73,71]];
let jellyPondCache=null,jellyPondUnsubscribe=null;
function emptyJellyPond(){return{slots:Array(12).fill(null)}}
function normalizeJellyPond(data,dropExpired=false){
  const now=gameNow(),slots=Array.isArray(data?.slots)?data.slots.slice(0,12):[];while(slots.length<12)slots.push(null);return{slots:slots.map(slot=>{if(!slot||typeof slot!=="object"||!JELLYFISH_TYPES[slot.typeKey])return null;const normalized={id:String(slot.id||""),typeKey:slot.typeKey,ownerKey:String(slot.ownerKey||""),ownerName:String(slot.ownerName||"สมาชิก"),customName:String(slot.customName||"").slice(0,20),placedAt:Number(slot.placedAt)||now,expiresAt:Number(slot.expiresAt)||now+JELLY_LIFETIME_MS,feedCount:Math.max(0,Math.min(5,Number(slot.feedCount)||0)),cooldownUntil:Math.max(0,Number(slot.cooldownUntil)||0)};if(dropExpired&&normalized.expiresAt<=now)return null;return normalized})};
}
function stopJellyPondSubscription(){if(jellyPondUnsubscribe){jellyPondUnsubscribe();jellyPondUnsubscribe=null}jellyPondCache=null}
async function loadSharedJellyPond(){
  const {db,fs}=await getFirebaseContext(),ref=fs.doc(db,"shared","jellyfishPond"),snap=await fs.getDoc(ref);if(!snap.exists()){const init=emptyJellyPond();await fs.setDoc(ref,{...init,updatedAt:fs.serverTimestamp()});jellyPondCache=init;return init}
  // ตัดตัวหมดอายุเฉพาะในมุมมองก่อน เพื่อลด write และไม่ให้ cleanup ธรรมดาไปทับ transaction ของคนที่กำลังให้อาหารพร้อมกัน
  const clean=normalizeJellyPond(snap.data(),true);jellyPondCache=clean;return clean;
}
function ensureJellyPondSubscription(){
  if(jellyPondUnsubscribe||!cloudReady)return;getFirebaseContext().then(({db,fs})=>{jellyPondUnsubscribe=fs.onSnapshot(fs.doc(db,"shared","jellyfishPond"),snap=>{if(!snap.exists())return;jellyPondCache=normalizeJellyPond(snap.data(),true);if(currentScene==="jellyfish")drawJellyfishPond(jellyPondCache)},error=>console.warn("jelly pond listener",error))}).catch(()=>{});
}
function jellyHoursLeft(slot){return Math.max(0,Math.ceil((Number(slot.expiresAt||0)-gameNow())/3600000))}
function drawJellyfishPond(pond){
  const slots=pond?.slots||Array(12).fill(null),occupied=slots.filter(Boolean).length,pondStatus=occupied>=12?"บ่อเต็ม • รอแมงกะพรุนหมดอายุแล้วค่อยวาง":"แตะพื้นที่ว่างในน้ำเพื่อวางพรุน";$("sceneInteractiveLayer").innerHTML=`<div class="jelly-pond-banner">🪼 บ่อส่วนกลาง ${occupied}/12 • ${pondStatus}</div>${JELLY_SLOT_POSITIONS.map(([left,top],i)=>{const slot=slots[i];if(!slot)return `<button class="jelly-slot jelly-slot-empty" type="button" data-jelly-slot="${i}" style="left:${left}%;top:${top}%" aria-label="สล็อตแมงกะพรุนว่าง ${i+1}"></button>`;const type=JELLYFISH_TYPES[slot.typeKey],ready=slot.feedCount>=5&&Number(slot.cooldownUntil||0)<=gameNow(),cooldown=Number(slot.cooldownUntil||0)>gameNow();return `<button class="jelly-slot jelly-slot-owned ${ready?"jelly-ready-love":""}" type="button" data-jelly-slot="${i}" style="left:${left}%;top:${top}%"><img src="${type.image}" alt="${type.name}"><small>${safeHtml(slot.customName||type.name)}<br>${jellyHoursLeft(slot)} ชม.${cooldown?" • คูลดาวน์":slot.feedCount>=5?" • พร้อมท้ารัก":` • ${slot.feedCount}/5`}</small></button>`}).join("")}`;document.querySelectorAll("[data-jelly-slot]").forEach(btn=>btn.onclick=()=>openJellySlot(Number(btn.dataset.jellySlot)));
}
async function renderJellyfishScene(){
  setSceneNav({backText:"กลับไปที่แปลงผัก",backAction:returnToFarm});if(!cloudReady){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">กำลังเชื่อมบ่อแมงกะพรุนส่วนกลาง...</div>';return}try{const pond=await loadSharedJellyPond();drawJellyfishPond(pond);ensureJellyPondSubscription();stopSceneTimer();sceneTimer=setInterval(async()=>{if(currentScene!=="jellyfish"){stopSceneTimer();return}try{drawJellyfishPond(await loadSharedJellyPond())}catch{}},60000)}catch(error){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">โหลดบ่อแมงกะพรุนไม่สำเร็จ</div>'}
}
function openJellySlot(index){const slot=jellyPondCache?.slots?.[index]||null;if(slot)showJellyDetails(index,slot);else showJellyPlacement(index)}
function showJellyPlacement(index){
  const s=ownState||state,available=Object.entries(JELLYFISH_TYPES).filter(([k])=>(Number(s.specialAnimals[k])||0)>0);if(!available.length){message("ยังไม่มีแมงกะพรุน","แมงกะพรุนที่สุ่มได้จะอยู่ใน กระเป๋า → สัตว์พิเศษ ก่อน และยังไม่เริ่มนับอายุจนกว่าจะวาง");return}$("modalContent").innerHTML=`<section class="feature-panel jelly-place-panel"><h2>🪼 เลือกแมงกะพรุนลงสล็อต ${index+1}</h2><p class="feature-subtitle">เมื่อวางแล้วจะเริ่มนับอายุ 72 ชั่วโมงทันที</p><div class="jelly-picker-grid">${available.map(([k,j])=>`<button type="button" data-place-jelly="${k}"><img src="${j.image}" alt="${j.name}"><b>${j.name}</b><small>มี ×${s.specialAnimals[k]}</small></button>`).join("")}</div></section>`;document.querySelectorAll("[data-place-jelly]").forEach(btn=>btn.onclick=()=>placeJellyfish(index,btn.dataset.placeJelly));openModal();
}
async function placeJellyfish(index,typeKey){
  try{const {db,fs}=await getFirebaseContext(),pondRef=fs.doc(db,"shared","jellyfishPond"),saveRef=fs.doc(db,"saves",currentMemberKey);let next,pond;await fs.runTransaction(db,async tx=>{const [pondSnap,saveSnap]=await Promise.all([tx.get(pondRef),tx.get(saveRef)]);if(!saveSnap.exists())throw new Error("ไม่พบเซฟสมาชิก");const p=normalizeJellyPond(pondSnap.exists()?pondSnap.data():null,true),s=normalizeState(saveSnap.data(),currentMember);if(p.slots[index])throw new Error("สล็อตนี้มีแมงกะพรุนแล้ว กรุณาเลือกช่องอื่น");if((Number(s.specialAnimals[typeKey])||0)<=0)throw new Error("แมงกะพรุนตัวนี้ไม่มีอยู่ในกระเป๋าแล้ว");s.specialAnimals[typeKey]-=1;const now=gameNow();p.slots[index]={id:(globalThis.crypto?.randomUUID?.()||`${currentMemberKey}-${now}-${Math.random().toString(36).slice(2)}`),typeKey,ownerKey:currentMemberKey,ownerName:currentMember,customName:"",placedAt:now,expiresAt:now+JELLY_LIFETIME_MS,feedCount:0,cooldownUntil:0};next=s;pond=p;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(pondRef,{slots:p.slots,updatedAt:fs.serverTimestamp()},{merge:false})});ownState=normalizeState(next,currentMember);state=ownState;jellyPondCache=pond;closeModal();drawJellyfishPond(pond);showWeatherToast(`🪼 วาง ${JELLYFISH_TYPES[typeKey].name} แล้ว • อายุ 72 ชั่วโมง`)}catch(error){message("วางแมงกะพรุนไม่ได้",error.message||"กรุณาลองใหม่")}
}
function showJellyDetails(index,slot){
  const type=JELLYFISH_TYPES[slot.typeKey],isOwner=slot.ownerKey===currentMemberKey,now=gameNow(),cooldown=Math.max(0,Number(slot.cooldownUntil||0)-now),ready=slot.feedCount>=5&&cooldown<=0;$("modalContent").innerHTML=`<section class="feature-panel jelly-detail-panel"><img class="jelly-detail-img" src="${type.image}" alt="${type.name}"><h2>${safeHtml(slot.customName||type.name)}</h2><p><b>สายพันธุ์:</b> ${type.name}<br><b>เจ้าของ:</b> ${safeHtml(slot.ownerName)}<br><b>อายุคงเหลือ:</b> ${jellyHoursLeft(slot)} ชั่วโมง<br><b>แพลงก์ตอน:</b> ${slot.feedCount}/5${cooldown>0?`<br><b>คูลดาวน์:</b> ${formatHM(cooldown)}`:""}</p><div class="jelly-action-grid"><button id="feedJellyBtn" type="button" ${ready||cooldown>0?"disabled":""}>🫧 ให้อาหาร</button>${ready?'<button id="jellyLoveBtn" class="primary-spooky-action" type="button">💗 พร้อมท้ารัก</button>':""}${isOwner?'<button id="renameJellyBtn" type="button">✏️ ตั้งชื่อ</button>':'<button id="poisonJellyBtn" class="danger-action" type="button">🧪 วางยา</button>'}</div></section>`;openModal();if($("feedJellyBtn"))$("feedJellyBtn").onclick=()=>feedJellyfish(index);if($("jellyLoveBtn"))$("jellyLoveBtn").onclick=()=>claimJellyLove(index);if($("renameJellyBtn"))$("renameJellyBtn").onclick=()=>renameJellyfish(index);if($("poisonJellyBtn"))$("poisonJellyBtn").onclick=()=>poisonJellyfish(index);
}
async function renameJellyfish(index){
  const slot=jellyPondCache?.slots?.[index];if(!slot||slot.ownerKey!==currentMemberKey){message("ตั้งชื่อไม่ได้","เฉพาะเจ้าของแมงกะพรุนเท่านั้นที่ตั้งชื่อได้");return}const typed=window.prompt("ตั้งชื่อแมงกะพรุน",slot.customName||JELLYFISH_TYPES[slot.typeKey].name);if(typed===null)return;const clean=typed.trim().slice(0,20);try{const {db,fs}=await getFirebaseContext(),ref=fs.doc(db,"shared","jellyfishPond");await fs.runTransaction(db,async tx=>{const snap=await tx.get(ref),p=normalizeJellyPond(snap.exists()?snap.data():null,true),current=p.slots[index];if(!current||current.ownerKey!==currentMemberKey)throw new Error("คุณไม่ใช่เจ้าของแมงกะพรุนตัวนี้");current.customName=clean;tx.set(ref,{slots:p.slots,updatedAt:fs.serverTimestamp()},{merge:false})});closeModal();showWeatherToast("✏️ เปลี่ยนชื่อแมงกะพรุนแล้ว")}catch(error){message("ตั้งชื่อไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function feedJellyfish(index){
  try{const {db,fs}=await getFirebaseContext(),pondRef=fs.doc(db,"shared","jellyfishPond"),saveRef=fs.doc(db,"saves",currentMemberKey);let next,pond;await fs.runTransaction(db,async tx=>{const [pondSnap,saveSnap]=await Promise.all([tx.get(pondRef),tx.get(saveRef)]);if(!pondSnap.exists()||!saveSnap.exists())throw new Error("ข้อมูลไม่พร้อม");const p=normalizeJellyPond(pondSnap.data(),true),slot=p.slots[index],s=normalizeState(saveSnap.data(),currentMember);if(!slot)throw new Error("แมงกะพรุนตัวนี้หมดอายุแล้ว");if(Number(slot.cooldownUntil||0)>gameNow())throw new Error(`ยังอยู่ในคูลดาวน์ ${formatHM(slot.cooldownUntil-gameNow())}`);if(slot.feedCount>=5)throw new Error("แมงกะพรุนอิ่มครบ 5/5 แล้ว");if((Number(s.bag.hauntedPlankton)||0)<1)throw new Error("ไม่มีแพลงก์ตอนหลอนปิ๊ในกระเป๋า");s.bag.hauntedPlankton-=1;s.merit=(Number(s.merit)||0)+1;slot.feedCount=Math.min(5,slot.feedCount+1);next=s;pond=p;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(pondRef,{slots:p.slots,updatedAt:fs.serverTimestamp()},{merge:false})});ownState=normalizeState(next,currentMember);state=ownState;jellyPondCache=pond;updateMeritUI();closeModal();drawJellyfishPond(pond);showWeatherToast("🫧 ให้อาหารสำเร็จ • +1 กุศล")}catch(error){message("ให้อาหารไม่ได้",error.message||"กรุณาลองใหม่")}
}
function rollJellyLoveReward(s){
  const roll=Math.floor(Math.random()*5);if(roll===0){const merit=randInt(2,5);s.merit+=merit;return `🙏 +${merit} กุศล`}if(roll===1){const r=RECIPES[Math.floor(Math.random()*RECIPES.length)],qty=randInt(1,2);addDishToState(s,r.id,qty);return `🍲 ${r.name} ×${qty}`}if(roll===2){const keys=Object.keys(ANIMAL_PRODUCTS),k=keys[Math.floor(Math.random()*keys.length)],qty=randInt(1,2);s.animalProducts[k]=(Number(s.animalProducts[k])||0)+qty;return `🐾 ${ANIMAL_PRODUCTS[k].name} ×${qty}`}if(roll===3){const keys=Object.keys(CROPS),k=keys[Math.floor(Math.random()*keys.length)],qty=randInt(1,2);s.bag[k]=(Number(s.bag[k])||0)+qty;return `🌱 ${CROPS[k].name} ×${qty}`}const keys=Object.keys(SPECIAL_ITEMS),k=keys[Math.floor(Math.random()*keys.length)],qty=k==="jellyfishLaxative"?1:randInt(1,2);s.specials[k]=(Number(s.specials[k])||0)+qty;return `🎁 ${SPECIAL_ITEMS[k].name} ×${qty}`;
}
async function claimJellyLove(index){
  const cached=jellyPondCache?.slots?.[index];if(cached&&cached.ownerKey!==currentMemberKey){message("กดไม่ได้","คุณไม่ใช่เจ้าของจะกดเพื่อ?");return}try{const {db,fs}=await getFirebaseContext(),pondRef=fs.doc(db,"shared","jellyfishPond"),saveRef=fs.doc(db,"saves",currentMemberKey);let next,pond,rewardText="";await fs.runTransaction(db,async tx=>{const [pondSnap,saveSnap]=await Promise.all([tx.get(pondRef),tx.get(saveRef)]);if(!pondSnap.exists()||!saveSnap.exists())throw new Error("ข้อมูลไม่พร้อม");const p=normalizeJellyPond(pondSnap.data(),true),slot=p.slots[index],s=normalizeState(saveSnap.data(),currentMember);if(!slot)throw new Error("แมงกะพรุนหมดอายุแล้ว");if(slot.ownerKey!==currentMemberKey)throw new Error("คุณไม่ใช่เจ้าของจะกดเพื่อ?");if(slot.feedCount<5)throw new Error("ยังให้อาหารไม่ครบ 5/5");if(Number(slot.cooldownUntil||0)>gameNow())throw new Error("ยังอยู่ในคูลดาวน์");rewardText=rollJellyLoveReward(s);slot.feedCount=0;slot.cooldownUntil=gameNow()+JELLY_LOVE_COOLDOWN_MS;next=s;pond=p;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(pondRef,{slots:p.slots,updatedAt:fs.serverTimestamp()},{merge:false})});ownState=normalizeState(next,currentMember);state=ownState;jellyPondCache=pond;updateMeritUI();closeModal();drawJellyfishPond(pond);message("💗 ท้ารักสำเร็จ",`${rewardText}<br>พัก 1 ชั่วโมง แล้วจะกลับมาหิวแพลงก์ตอน 0/5 ใหม่`)}catch(error){message("ท้ารักไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function poisonJellyfish(index){
  const cached=jellyPondCache?.slots?.[index];if(cached?.ownerKey===currentMemberKey){message("วางยาไม่ได้","จะวางยาถ่ายแมงกะพรุนของตัวเองเพื่อ?");return}if(specialCount("jellyfishLaxative")<=0){message("ไม่มียาถ่ายแมงกะพรุน","ยาถ่ายแมงกะพรุนสุ่มได้จากแพนด้า ผีน้อย และกล่องสุ่ม");return}
  try{const {db,fs}=await getFirebaseContext(),pondRef=fs.doc(db,"shared","jellyfishPond"),saveRef=fs.doc(db,"saves",currentMemberKey);let next,pond,ownerKey="";await fs.runTransaction(db,async tx=>{const [pondSnap,saveSnap]=await Promise.all([tx.get(pondRef),tx.get(saveRef)]);if(!pondSnap.exists()||!saveSnap.exists())throw new Error("ข้อมูลไม่พร้อม");const p=normalizeJellyPond(pondSnap.data(),true),slot=p.slots[index],s=normalizeState(saveSnap.data(),currentMember);if(!slot)throw new Error("แมงกะพรุนหมดอายุแล้ว");if(slot.ownerKey===currentMemberKey)throw new Error("วางยาตัวเองไม่ได้");if((Number(s.specials.jellyfishLaxative)||0)<1)throw new Error("ไม่มียาถ่ายแมงกะพรุน");s.specials.jellyfishLaxative-=1;ownerKey=slot.ownerKey;slot.expiresAt-=JELLY_POISON_REDUCE_MS;if(slot.expiresAt<=gameNow())p.slots[index]=null;next=s;pond=p;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(pondRef,{slots:p.slots,updatedAt:fs.serverTimestamp()},{merge:false});if(ownerKey)tx.set(fs.doc(fs.collection(db,"mailboxes",ownerKey,"items")),{source:"friend",type:"jellyPoison",fromKey:currentMemberKey,title:"มีคนใจร้ายแอบวางยาถ่ายแมงกะพรุนของคุณ 🧪",text:"อายุแมงกะพรุนลดลง 3 ชั่วโมง",read:false,createdAt:fs.serverTimestamp()})});ownState=normalizeState(next,currentMember);state=ownState;jellyPondCache=pond;closeModal();drawJellyfishPond(pond);showWeatherToast("🧪 วางยาสำเร็จ • อายุลดลง 3 ชั่วโมง")}catch(error){message("วางยาไม่ได้",error.message||"กรุณาลองใหม่")}
}

// ===== Scene router: บ้าน/บาดาล/โรงเรือนเดิมไม่เปลี่ยน =====
function openScene(sceneName){
  if(!SCENES[sceneName])return;if(currentScene==="jellyfish"&&sceneName!=="jellyfish")stopJellyPondSubscription();currentScene=sceneName;stopSceneTimer();$("gameScreen").classList.add("hidden");$("sceneScreen").classList.remove("hidden");$("sceneScreen").dataset.scene=sceneName;$("sceneScreen").style.backgroundImage=`url("${SCENES[sceneName].image}")`;renderScene();
}
function returnToFarm(){if(currentScene==="jellyfish")stopJellyPondSubscription();stopSceneTimer();currentScene=null;closeModal();$("sceneScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden")}
function renderScene(){if(currentScene==="house"){renderHouseScene();return}if(currentScene==="underwater"){renderUnderwaterScene();return}if(currentScene==="almsSeated"||currentScene==="almsBlessing"){renderAlmsScene();return}if(currentScene==="coconut"){renderCoconutScene();return}if(currentScene==="panda"){renderPandaScene();return}if(currentScene==="jellyfish"){renderJellyfishScene();return}renderAnimalScene(currentScene)}

// ===== Admin: ส่งอะไรก็ได้ให้ใครก็ได้ / ไม่มี daily send limit =====
function adminGiftCatalog(){
  return[
    {type:"merit",key:"merit",name:"คะแนนกุศล"},
    ...Object.entries(CROPS).map(([key,item])=>({type:"crop",key,name:item.name})),
    ...Object.entries(ANIMAL_PRODUCTS).map(([key,item])=>({type:"product",key,name:item.name})),
    ...RECIPES.map(r=>({type:"dish",key:r.id,name:r.name})),
    ...Object.entries(SPECIAL_ITEMS).map(([key,item])=>({type:"special",key,name:item.name})),
    ...Object.entries(JELLYFISH_TYPES).map(([key,item])=>({type:"jelly",key,name:item.name}))
  ];
}
function adminEntryCount(s,entry){if(entry.type==="merit")return Infinity;if(entry.type==="crop")return Number(s.bag[entry.key])||0;if(entry.type==="product")return Number(s.animalProducts[entry.key])||0;if(entry.type==="dish")return dishCountInState(entry.key,s);if(entry.type==="special")return Number(s.specials[entry.key])||0;if(entry.type==="jelly")return Number(s.specialAnimals[entry.key])||0;return 0}
async function showAdminCenter(){
  if(adminProfile?.role!=="admin"){message("ไม่มีสิทธิ์","เมนูนี้เปิดเฉพาะ Aida/Admin");return}try{const {db,fs}=await getFirebaseContext(),snap=await fs.getDocs(fs.query(fs.collection(db,"purchaseRequests"),fs.where("status","==","pending"))),requests=[];snap.forEach(d=>requests.push({id:d.id,...d.data()}));requests.sort((a,b)=>timestampMillis(b.createdAt)-timestampMillis(a.createdAt));const catalog=adminGiftCatalog(),targets=Object.keys(MEMBERS).filter(n=>n!=="Aida");
    $("modalContent").innerHTML=`<section class="feature-panel admin-panel"><h2>🛡️ ศูนย์แอดมิน Aida</h2><p class="feature-subtitle">Admin ไม่มีลิมิตจำนวนครั้งในการส่งของ • สต๊อกเริ่มต้นอย่างละ 999</p><div class="admin-section"><h3>คำขอซื้อที่รออนุมัติ (${requests.length})</h3><div class="admin-request-list">${requests.length?requests.map(r=>{const qty=Math.max(1,Number(r.qty)||1),total=(Number(r.price)||0)*qty;return `<div class="admin-request-card"><b>${safeHtml(r.memberName)} • ${safeHtml(r.itemName)} ×${qty}</b><span>${total}⭐️ รวม • ${r.category==="animal"?"สัตว์":r.category==="mystery"?"กล่องสุ่ม":"ของพิเศษ"}</span><small>${bangkokTimeText(r.createdAt)} น.</small><div><button type="button" data-admin-approve="${r.id}">อนุมัติ</button><button type="button" data-admin-reject="${r.id}">ปฏิเสธ</button></div></div>`}).join(""):'<p class="empty-feature">ไม่มีคำขอค้าง</p>'}</div></div><div class="admin-section"><h3>ส่งแจ้งเตือนจากยัยหนู</h3><input id="adminNoticeTitle" type="text" placeholder="หัวข้อ" maxlength="80"><textarea id="adminNoticeBody" placeholder="ข้อความที่ต้องการส่ง" maxlength="500"></textarea><button id="adminSendNoticeBtn" type="button">ส่งให้ทุกคน</button></div><div class="admin-section"><h3>ส่งของให้สมาชิกคนเดียว</h3><select id="adminTargetMember">${targets.map(name=>`<option value="${memberKeyFromName(name)}" data-name="${safeHtml(name)}">${safeHtml(name)}</option>`).join("")}</select><select id="adminTargetGiftItem">${catalog.map((e,i)=>`<option value="${i}">${safeHtml(e.name)}</option>`).join("")}</select><input id="adminTargetGiftQty" type="number" min="1" max="999" value="1"><button id="adminSendTargetGiftBtn" type="button">ส่งให้คนนี้</button></div><div class="admin-section"><h3>ส่งของขวัญให้ทุกคน</h3><select id="adminGiftItem">${catalog.map((e,i)=>`<option value="${i}">${safeHtml(e.name)}</option>`).join("")}</select><input id="adminGiftQty" type="number" min="1" max="999" value="1"><button id="adminSendGiftBtn" type="button">ส่งของขวัญให้ทุกคน</button></div></section>`;
    document.querySelectorAll("[data-admin-approve]").forEach(btn=>btn.onclick=()=>resolvePurchaseRequest(btn.dataset.adminApprove,true));document.querySelectorAll("[data-admin-reject]").forEach(btn=>btn.onclick=()=>resolvePurchaseRequest(btn.dataset.adminReject,false));$("adminSendNoticeBtn").onclick=sendAdminNotice;$("adminSendGiftBtn").onclick=()=>{const e=catalog[Number($("adminGiftItem").value)||0],qty=Math.max(1,Number($("adminGiftQty").value)||1);sendAdminGlobalGift(e,qty)};$("adminSendTargetGiftBtn").onclick=()=>{const select=$("adminTargetMember"),option=select.options[select.selectedIndex],targetKey=select.value,targetName=option?.textContent||targetKey,e=catalog[Number($("adminTargetGiftItem").value)||0],qty=Math.max(1,Number($("adminTargetGiftQty").value)||1);sendAdminTargetGift(targetKey,targetName,e,qty)};openModal();
  }catch(error){message("เปิดศูนย์แอดมินไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function sendAdminTargetGift(targetKey,targetName,entry,qty){
  if(!entry||adminProfile?.role!=="admin")return;qty=Math.max(1,Math.floor(Number(qty)||1));try{const {db,fs}=await getFirebaseContext(),adminSaveRef=fs.doc(db,"saves","aida"),giftRef=fs.doc(fs.collection(db,"gifts")),mailRef=fs.doc(db,"mailboxes",targetKey,"items",giftRef.id);let next;await fs.runTransaction(db,async tx=>{const snap=await tx.get(adminSaveRef);if(!snap.exists())throw new Error("ไม่พบสต๊อก Admin");const s=normalizeState(snap.data(),"Aida");if(entry.type!=="merit"&&!removeGiftItemFromState(s,entry.type,entry.key,qty))throw new Error(`สต๊อก ${entry.name} ไม่พอ`);next=s;const gift={fromKey:"aida",fromName:"Aida",toKey:targetKey,toName:targetName,itemType:entry.type,itemKey:entry.key,itemName:entry.name,itemImage:"",qty,status:"pending",createdAt:fs.serverTimestamp()};tx.set(adminSaveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(giftRef,gift);tx.set(mailRef,{source:"yainoo",type:"gift",giftId:giftRef.id,fromKey:"aida",fromName:"Aida",title:"ยัยหนูส่งของขวัญให้คุณ 🎁",text:`${entry.name} ×${qty}`,read:false,createdAt:fs.serverTimestamp()})});ownState=normalizeState(next,"Aida");state=ownState;showWeatherToast(`🎁 ส่ง ${entry.name} ×${qty} ให้ ${targetName} แล้ว`);showAdminCenter()}catch(error){message("ส่งของไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function sendAdminGlobalGift(entry,qty){
  if(!entry||adminProfile?.role!=="admin")return;qty=Math.max(1,Math.floor(Number(qty)||1));const recipientCount=Object.keys(MEMBERS).filter(n=>n!=="Aida").length,totalQty=qty*recipientCount;try{const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves","aida"),broadcastRef=fs.doc(fs.collection(db,"broadcasts"));let next;await fs.runTransaction(db,async tx=>{const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบสต๊อก Admin");const s=normalizeState(snap.data(),"Aida");if(entry.type!=="merit"&&!removeGiftItemFromState(s,entry.type,entry.key,totalQty))throw new Error(`สต๊อก ${entry.name} ไม่พอสำหรับแจกทุกคน (${totalQty} ชิ้น)`);next=s;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(broadcastRef,{type:"gift",title:"🎁 ของขวัญจากยัยหนู",body:"กดรับเพื่อเพิ่มของเข้ากระเป๋า",itemType:entry.type,itemKey:entry.key,itemName:entry.name,qty,from:"Aida",createdAt:fs.serverTimestamp()})});ownState=normalizeState(next,"Aida");state=ownState;showWeatherToast("🎁 ส่งของขวัญให้ทุกคนแล้ว");showAdminCenter()}catch(error){message("ส่งของขวัญไม่สำเร็จ",error.message||"กรุณาลองใหม่")}
}
async function resolvePurchaseRequest(requestId,approve){
  try{const {db,fs}=await getFirebaseContext(),requestRef=fs.doc(db,"purchaseRequests",requestId),noticeId=`purchase-${requestId}`;let memberKey="",memberName="",noticeText="";await fs.runTransaction(db,async tx=>{const reqSnap=await tx.get(requestRef);if(!reqSnap.exists())throw new Error("ไม่พบคำขอ");const req=reqSnap.data();if(req.status!=="pending")throw new Error("คำขอนี้ถูกจัดการแล้ว");memberKey=req.memberKey;memberName=req.memberName;const saveRef=fs.doc(db,"saves",memberKey),saveSnap=await tx.get(saveRef);if(!saveSnap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(saveSnap.data(),memberName),qty=Math.max(1,Number(req.qty)||1);
      if(req.category==="animal"){s.purchasePendingCounts[req.itemKey]=Math.max(0,(Number(s.purchasePendingCounts[req.itemKey])||0)-qty);if(approve)s.pendingAnimals[req.itemKey]=(Number(s.pendingAnimals[req.itemKey])||0)+qty;noticeText=approve?`ไปที่โรงเรือนแล้วกด + เพื่อวางสัตว์ได้เลย • รอวาง ×${qty}`:"คำขอนี้ถูกปฏิเสธ"}
      else if(req.category==="special"){if(approve)s.specials[req.itemKey]=(Number(s.specials[req.itemKey])||0)+qty;else if(req.dateKey===currentBangkokDateKey()){ensureDailyLimitsFor(s);s.dailyLimits.specialPurchases=Math.max(0,(Number(s.dailyLimits.specialPurchases)||0)-qty)}noticeText=approve?`ของถูกเพิ่มเข้า กระเป๋า → ของพิเศษ ×${qty} แล้ว`:"คำขอนี้ถูกปฏิเสธ"}
      else if(req.category==="mystery"){if(approve){s.mysteryBoxes=(Number(s.mysteryBoxes)||0)+qty;noticeText=`กล่องถูกเพิ่มเข้า กระเป๋า → กล่องสุ่ม ×${qty} แล้ว • กดใช้งานเพื่อเปิดกล่อง`}else if(req.dateKey===currentBangkokDateKey()){ensureDailyLimitsFor(s);s.dailyLimits.jellyBoxes=Math.max(0,(Number(s.dailyLimits.jellyBoxes)||0)-qty);noticeText="คำขอนี้ถูกปฏิเสธ"}}
      tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(requestRef,{status:approve?"approved":"rejected",resolvedAt:fs.serverTimestamp(),resolvedBy:"Aida"},{merge:true});tx.set(fs.doc(db,"mailboxes",memberKey,"items",noticeId),{source:"yainoo",type:"purchase",title:approve?`ยัยหนูอนุมัติ ${req.itemName} ×${qty} แล้ว ✅`:`ยัยหนูไม่อนุมัติ ${req.itemName}`,text:noticeText,read:false,createdAt:fs.serverTimestamp()})});showWeatherToast(approve?`✅ อนุมัติ ${memberName} แล้ว`:`❌ ปฏิเสธคำขอแล้ว`);showAdminCenter();refreshNotificationBadge()}catch(error){message("จัดการคำขอไม่ได้",error.message||"กรุณาลองใหม่")}
}


// ===== Notifications V2: ของขวัญจาก Admin รับ/ทิ้งได้ในแท็บ "จากยัยหนู" =====
async function showNotifications(tab="friend"){
  if(!cloudReady){message("การแจ้งเตือนยังไม่พร้อม","กรุณาเชื่อม Firebase ก่อน");return}
  try{
    const [mail,broadcasts]=await Promise.all([fetchMailboxItems(),fetchBroadcasts()]);
    const friendItems=mail.filter(x=>x.source==="friend"),yainooItems=mail.filter(x=>x.source==="yainoo");
    const mailboxCard=(item,returnTab)=>`<div class="notification-card ${item.read?"":"unread"}"><b>${safeHtml(item.title||"แจ้งเตือน")}</b>${item.text?`<span>${safeHtml(item.text)}</span>`:""}<small>${bangkokTimeText(item.createdAt)} น.</small>${item.type==="gift"?`<div class="notification-actions">${item.resolved?`<button disabled>${item.status==="claimed"?"รับแล้ว":"ทิ้งแล้ว"}</button>`:`<button type="button" data-claim-gift="${item.giftId||item.id}" data-gift-action="accept" data-return-tab="${returnTab}">รับของขวัญ</button><button type="button" data-claim-gift="${item.giftId||item.id}" data-gift-action="discard" data-return-tab="${returnTab}">ทิ้ง</button>`}</div>`:""}</div>`;
    let body="";
    if(tab==="friend"){
      body=friendItems.length?friendItems.map(item=>mailboxCard(item,"friend")).join(""):'<p class="empty-feature">ยังไม่มีแจ้งเตือนจากเพื่อน</p>';
      await markMailboxRead(friendItems);
    }else{
      const broadcastCards=[];
      for(const b of broadcasts){
        const claim=b.type==="gift"?await fetchBroadcastClaim(b.id):null;
        broadcastCards.push(`<div class="notification-card"><b>${safeHtml(b.title||"ข้อความจากยัยหนู")}</b>${b.body?`<span>${safeHtml(b.body)}</span>`:""}${b.type==="gift"?`<span>🎁 ${safeHtml(b.itemName)} ×${Number(b.qty)||1}</span><div class="notification-actions">${claim?`<button disabled>${claim.status==="accepted"?"รับแล้ว":"ทิ้งแล้ว"}</button>`:`<button type="button" data-claim-broadcast="${b.id}" data-broadcast-action="accept">รับของขวัญ</button><button type="button" data-claim-broadcast="${b.id}" data-broadcast-action="discard">ทิ้ง</button>`}</div>`:""}<small>${bangkokTimeText(b.createdAt)} น.</small></div>`);
      }
      body=[...yainooItems.map(item=>mailboxCard(item,"yainoo")),...broadcastCards].join("")||'<p class="empty-feature">ยังไม่มีแจ้งเตือนจากยัยหนู</p>';
      await markMailboxRead(yainooItems);(ownState||state).lastSeenYainooAt=gameNow();save();
    }
    $("modalContent").innerHTML=`<section class="feature-panel notification-panel"><h2>🔔 การแจ้งเตือน</h2><div class="notification-tabs"><button type="button" data-notification-tab="friend" class="${tab==="friend"?"active":""}">👥 จากเพื่อน</button><button type="button" data-notification-tab="yainoo" class="${tab==="yainoo"?"active":""}">👑 จากยัยหนู</button></div>${currentMember==="Aida"&&adminProfile?.role==="admin"?'<button id="adminCenterBtn" class="admin-center-entry" type="button">🛡️ ศูนย์แอดมิน</button>':""}<div class="notification-list">${body}</div></section>`;
    document.querySelectorAll("[data-notification-tab]").forEach(btn=>btn.onclick=()=>showNotifications(btn.dataset.notificationTab));
    document.querySelectorAll("[data-claim-gift]").forEach(btn=>btn.onclick=()=>claimFriendGift(btn.dataset.claimGift,btn.dataset.giftAction==="accept",btn.dataset.returnTab||"friend"));
    document.querySelectorAll("[data-claim-broadcast]").forEach(btn=>btn.onclick=()=>claimBroadcastGift(btn.dataset.claimBroadcast,btn.dataset.broadcastAction==="accept"));
    if($("adminCenterBtn"))$("adminCenterBtn").onclick=showAdminCenter;openModal();refreshNotificationBadge();
  }catch(error){message("เปิดการแจ้งเตือนไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function claimFriendGift(giftId,accept,returnTab="friend"){
  try{
    const {db,fs}=await getFirebaseContext(),giftRef=fs.doc(db,"gifts",giftId),saveRef=fs.doc(db,"saves",currentMemberKey),mailRef=fs.doc(db,"mailboxes",currentMemberKey,"items",giftId);let next;
    await fs.runTransaction(db,async tx=>{
      const [giftSnap,saveSnap]=await Promise.all([tx.get(giftRef),tx.get(saveRef)]);if(!giftSnap.exists()||!saveSnap.exists())throw new Error("ไม่พบของขวัญ");const gift=giftSnap.data();if(gift.toKey!==currentMemberKey)throw new Error("ของขวัญนี้ไม่ได้ส่งถึงคุณ");if(gift.status!=="pending")throw new Error("ของขวัญนี้ถูกจัดการแล้ว");const s=normalizeState(saveSnap.data(),currentMember);
      if(accept)addGiftItemToState(s,gift);next=s;tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});tx.set(giftRef,{status:accept?"claimed":"discarded",resolvedAt:fs.serverTimestamp()},{merge:true});tx.set(mailRef,{read:true,resolved:true,status:accept?"claimed":"discarded"},{merge:true});
    });
    ownState=normalizeState(next,currentMember);if(!visitContext)state=ownState;showNotifications(returnTab);showWeatherToast(accept?"🎁 รับของขวัญแล้ว":"🗑️ ทิ้งของขวัญแล้ว • ไม่คืนผู้ส่ง");
  }catch(error){message("จัดการของขวัญไม่ได้",error.message||"กรุณาลองใหม่")}
}



/* ======================================================================
   ADMIN DELIVERY HOTFIX
   แก้เฉพาะระบบอนุมัติ/ส่งของขวัญ/รีเซ็ตสัตว์และแมงกะพรุน
   ====================================================================== */

function ensureAdminStock(target){
  if(currentMember!=="Aida"||adminProfile?.role!=="admin"||!target)return false;
  let changed=false;
  const topup=(obj,key)=>{
    const old=Number(obj[key])||0;
    if(old<ADMIN_STOCK_QTY){obj[key]=ADMIN_STOCK_QTY;changed=true}
  };
  Object.keys(CROPS).forEach(k=>topup(target.bag,k));
  Object.keys(ANIMAL_PRODUCTS).forEach(k=>topup(target.animalProducts,k));
  RECIPES.forEach(r=>topup(target.dishInventory,r.id));
  Object.keys(SPECIAL_ITEMS).forEach(k=>topup(target.specials,k));
  Object.keys(JELLYFISH_TYPES).forEach(k=>topup(target.specialAnimals,k));
  if((Number(target.mysteryBoxes)||0)<ADMIN_STOCK_QTY){target.mysteryBoxes=ADMIN_STOCK_QTY;changed=true}
  if((Number(target.merit)||0)<ADMIN_STOCK_QTY){target.merit=ADMIN_STOCK_QTY;changed=true}
  if(!target.adminStockV2Seeded){target.adminStockV2Seeded=true;changed=true}
  return changed;
}

function adminGiftCatalog(){
  return[
    {type:"merit",key:"merit",name:"คะแนนกุศล"},
    ...SHOP_ITEMS.map(item=>({type:"animal",key:item.id,name:item.name})),
    {type:"mystery",key:"jellyfishBox",name:JELLY_BOX.name},
    ...Object.entries(CROPS).map(([key,item])=>({type:"crop",key,name:item.name})),
    ...Object.entries(ANIMAL_PRODUCTS).map(([key,item])=>({type:"product",key,name:item.name})),
    ...RECIPES.map(r=>({type:"dish",key:r.id,name:r.name})),
    ...Object.entries(SPECIAL_ITEMS).map(([key,item])=>({type:"special",key,name:item.name})),
    ...Object.entries(JELLYFISH_TYPES).map(([key,item])=>({type:"jelly",key,name:item.name}))
  ];
}

function addGiftItemToState(s,gift){
  if(Array.isArray(gift?.items)){
    gift.items.forEach(item=>addGiftItemToState(s,{
      itemType:item.type,itemKey:item.key,qty:item.qty
    }));
    return;
  }
  const qty=Math.max(1,Math.floor(Number(gift.qty)||1));
  const type=gift.itemType||gift.type;
  const key=gift.itemKey||gift.key;
  if(type==="product")s.animalProducts[key]=(Number(s.animalProducts[key])||0)+qty;
  else if(type==="crop")s.bag[key]=(Number(s.bag[key])||0)+qty;
  else if(type==="special")s.specials[key]=(Number(s.specials[key])||0)+qty;
  else if(type==="jelly")s.specialAnimals[key]=(Number(s.specialAnimals[key])||0)+qty;
  else if(type==="dish"){if(!recipeById(key))throw new Error("ไม่พบเมนูอาหาร");addDishToState(s,key,qty)}
  else if(type==="merit")s.merit=(Number(s.merit)||0)+qty;
  else if(type==="animal"){if(!animalById(key))throw new Error("ไม่พบสัตว์");s.pendingAnimals[key]=(Number(s.pendingAnimals[key])||0)+qty}
  else if(type==="mystery")s.mysteryBoxes=(Number(s.mysteryBoxes)||0)+qty;
  else throw new Error("ประเภทของขวัญไม่รองรับ");
}

async function resolvePurchaseRequest(requestId,approve){
  try{
    const {db,fs}=await getFirebaseContext();
    const requestRef=fs.doc(db,"purchaseRequests",requestId);
    const noticeId=`purchase-${requestId}`;
    let memberKey="",memberName="",itemName="",qty=1;
    await fs.runTransaction(db,async tx=>{
      const reqSnap=await tx.get(requestRef);
      if(!reqSnap.exists())throw new Error("ไม่พบคำขอ");
      const req=reqSnap.data();
      if(req.status!=="pending")throw new Error("คำขอนี้ถูกจัดการแล้ว");
      memberKey=req.memberKey;memberName=req.memberName;itemName=req.itemName||"รายการ";qty=Math.max(1,Number(req.qty)||1);

      let saveChanged=false,saveRef=null,s=null;
      if(req.category==="animal" || (!approve&&(req.category==="special"||req.category==="mystery"))){
        saveRef=fs.doc(db,"saves",memberKey);
        const saveSnap=await tx.get(saveRef);
        if(saveSnap.exists()){
          s=normalizeState(saveSnap.data(),memberName);
          if(req.category==="animal"){
            s.purchasePendingCounts[req.itemKey]=Math.max(0,(Number(s.purchasePendingCounts[req.itemKey])||0)-qty);
            saveChanged=true;
          }else if(!approve&&req.dateKey===currentBangkokDateKey()){
            ensureDailyLimitsFor(s);
            if(req.category==="special"){
              s.dailyLimits.specialPurchases=Math.max(0,(Number(s.dailyLimits.specialPurchases)||0)-qty);
              saveChanged=true;
            }else if(req.category==="mystery"){
              s.dailyLimits.jellyBoxes=Math.max(0,(Number(s.dailyLimits.jellyBoxes)||0)-qty);
              saveChanged=true;
            }
          }
        }
      }
      if(saveChanged&&saveRef&&s)tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});

      tx.set(requestRef,{status:approve?"approved":"rejected",resolvedAt:fs.serverTimestamp(),resolvedBy:"Aida"},{merge:true});
      tx.set(fs.doc(db,"mailboxes",memberKey,"items",noticeId),{
        source:"yainoo",type:"purchase",
        title:approve?`ยัยหนูอนุมัติ ${itemName} ×${qty} แล้ว ✅`:`ยัยหนูไม่อนุมัติ ${itemName}`,
        text:approve?"คำขอได้รับการอนุมัติแล้ว กรุณารอรับของขวัญจากยัยหนู":"คำขอนี้ถูกปฏิเสธ",
        read:false,createdAt:fs.serverTimestamp()
      });
    });
    showWeatherToast(approve?`✅ อนุมัติ ${memberName} แล้ว`:`❌ ปฏิเสธคำขอแล้ว`);
    showAdminCenter();refreshNotificationBadge();
  }catch(error){message("จัดการคำขอไม่ได้",error.message||"กรุณาลองใหม่")}
}

function adminBundleRows(catalog){
  return catalog.map((entry,index)=>`
    <label class="gift-item-option" style="display:grid;grid-template-columns:auto 1fr 78px;align-items:center;gap:8px">
      <input type="checkbox" data-admin-bundle-check="${index}">
      <span>${safeHtml(entry.name)}</span>
      <input type="number" min="1" max="100" value="1" data-admin-bundle-qty="${index}">
    </label>`).join("");
}

async function showAdminCenter(){
  if(adminProfile?.role!=="admin"){message("ไม่มีสิทธิ์","เมนูนี้เปิดเฉพาะ Aida/Admin");return}
  try{
    const {db,fs}=await getFirebaseContext();
    const snap=await fs.getDocs(fs.query(fs.collection(db,"purchaseRequests"),fs.where("status","==","pending")));
    const requests=[];snap.forEach(d=>requests.push({id:d.id,...d.data()}));
    requests.sort((a,b)=>timestampMillis(b.createdAt)-timestampMillis(a.createdAt));
    const catalog=adminGiftCatalog();
    const targets=Object.keys(MEMBERS).filter(n=>n!=="Aida");

    $("modalContent").innerHTML=`
      <section class="feature-panel admin-panel">
        <h2>🛡️ ศูนย์แอดมิน Aida</h2>
        <p class="feature-subtitle">อนุมัติคำขอ = แจ้งผลเท่านั้น • ของจริงส่งด้วยกล่องของขวัญด้านล่าง<br>Aida ส่งได้ทุกอย่าง • 1 กล่องรวมได้สูงสุด 100 ชิ้น</p>

        <div class="admin-section"><h3>คำขอซื้อที่รออนุมัติ (${requests.length})</h3><div class="admin-request-list">
        ${requests.length?requests.map(r=>{
          const q=Math.max(1,Number(r.qty)||1),total=(Number(r.price)||0)*q;
          return `<div class="admin-request-card"><b>${safeHtml(r.memberName)} • ${safeHtml(r.itemName)} ×${q}</b><span>${total}⭐️ รวม • ${r.category==="animal"?"สัตว์":r.category==="mystery"?"กล่องสุ่ม":"ของพิเศษ"}</span><small>${bangkokTimeText(r.createdAt)} น.</small><div><button type="button" data-admin-approve="${r.id}">อนุมัติ</button><button type="button" data-admin-reject="${r.id}">ปฏิเสธ</button></div></div>`;
        }).join(""):'<p class="empty-feature">ไม่มีคำขอค้าง</p>'}
        </div></div>

        <div class="admin-section">
          <h3>🎁 ส่งกล่องของขวัญรายบุคคล</h3>
          <select id="adminBundleTarget">${targets.map(name=>`<option value="${memberKeyFromName(name)}">${safeHtml(name)}</option>`).join("")}</select>
          <p class="feature-subtitle">ติ๊กได้หลายอย่าง • ใส่จำนวนแต่ละรายการ • รวมทั้งกล่องไม่เกิน 100 ชิ้น</p>
          <div class="gift-item-list">${adminBundleRows(catalog)}</div>
          <button id="adminSendBundleBtn" class="primary-spooky-action" type="button">ส่งกล่องของขวัญให้คนนี้</button>
        </div>

        <div class="admin-section"><h3>ส่งแจ้งเตือนจากยัยหนู</h3><input id="adminNoticeTitle" type="text" placeholder="หัวข้อ" maxlength="80"><textarea id="adminNoticeBody" placeholder="ข้อความที่ต้องการส่ง" maxlength="500"></textarea><button id="adminSendNoticeBtn" type="button">ส่งให้ทุกคน</button></div>

        <div class="admin-section"><h3>⚠️ รีเซ็ตสัตว์และแมงกะพรุนสมาชิก</h3><p class="feature-subtitle">ไม่แตะกุศล พืช อาหาร ผลผลิตสัตว์ หรือของพิเศษอื่น</p><button id="adminResetAnimalsBtn" class="danger-action" type="button">รีเซ็ตสัตว์และแมงกะพรุนทั้งหมด</button></div>
      </section>`;

    document.querySelectorAll("[data-admin-approve]").forEach(btn=>btn.onclick=()=>resolvePurchaseRequest(btn.dataset.adminApprove,true));
    document.querySelectorAll("[data-admin-reject]").forEach(btn=>btn.onclick=()=>resolvePurchaseRequest(btn.dataset.adminReject,false));
    $("adminSendNoticeBtn").onclick=sendAdminNotice;
    $("adminSendBundleBtn").onclick=()=>sendAdminBundleGift(catalog);
    $("adminResetAnimalsBtn").onclick=resetAllMemberAnimalsAndJellyfish;
    openModal();
  }catch(error){message("เปิดศูนย์แอดมินไม่ได้",error.message||"กรุณาลองใหม่")}
}

async function sendAdminBundleGift(catalog){
  if(adminProfile?.role!=="admin")return;
  const targetSelect=$("adminBundleTarget");
  const targetKey=targetSelect?.value||"";
  const targetName=targetSelect?.options?.[targetSelect.selectedIndex]?.textContent||targetKey;
  const items=[];

  document.querySelectorAll("[data-admin-bundle-check]").forEach(check=>{
    if(!check.checked)return;
    const index=Number(check.dataset.adminBundleCheck),entry=catalog[index];
    if(!entry)return;
    const qtyInput=document.querySelector(`[data-admin-bundle-qty="${index}"]`);
    const qty=Math.max(1,Math.min(100,Math.floor(Number(qtyInput?.value)||1)));
    items.push({type:entry.type,key:entry.key,name:entry.name,qty});
  });

  if(!targetKey){message("ยังส่งไม่ได้","กรุณาเลือกสมาชิก");return}
  if(!items.length){message("ยังส่งไม่ได้","กรุณาติ๊กของอย่างน้อย 1 รายการ");return}
  const total=items.reduce((sum,item)=>sum+item.qty,0);
  if(total>100){message("ของเยอะเกินไป",`1 กล่องส่งได้รวมสูงสุด 100 ชิ้น ตอนนี้เลือก ${total} ชิ้น`);return}

  try{
    const {db,fs}=await getFirebaseContext();
    const giftRef=fs.doc(fs.collection(db,"gifts"));
    const mailRef=fs.doc(db,"mailboxes",targetKey,"items",giftRef.id);
    const summary=items.map(i=>`${i.name} ×${i.qty}`).join(" • ");
    const batch=fs.writeBatch(db);

    batch.set(giftRef,{
      fromKey:"aida",fromName:"Aida",toKey:targetKey,toName:targetName,
      bundle:true,items:items.map(i=>({type:i.type,key:i.key,name:i.name,qty:i.qty})),
      totalQty:total,status:"pending",createdAt:fs.serverTimestamp()
    });
    batch.set(mailRef,{
      source:"yainoo",type:"gift",giftId:giftRef.id,fromKey:"aida",fromName:"Aida",
      title:"ยัยหนูส่งกล่องของขวัญให้คุณ 🎁",text:summary,read:false,createdAt:fs.serverTimestamp()
    });

    await batch.commit();
    showWeatherToast(`🎁 ส่งกล่อง ${total} ชิ้นให้ ${targetName} แล้ว`);
    showAdminCenter();
  }catch(error){message("ส่งของไม่ได้",error.message||"กรุณาลองใหม่")}
}

async function claimFriendGift(giftId,accept,returnTab="friend"){
  try{
    // ปิด race: autosave แบบ full document ต้องจบก่อน transaction รับของ
    await settlePendingCloudSave();
    const {db,fs}=await getFirebaseContext();
    const giftRef=fs.doc(db,"gifts",giftId),saveRef=fs.doc(db,"saves",currentMemberKey),mailRef=fs.doc(db,"mailboxes",currentMemberKey,"items",giftId);
    let next;

    await fs.runTransaction(db,async tx=>{
      const [giftSnap,saveSnap]=await Promise.all([tx.get(giftRef),tx.get(saveRef)]);
      if(!giftSnap.exists()||!saveSnap.exists())throw new Error("ไม่พบของขวัญ");
      const gift=giftSnap.data();
      if(gift.toKey!==currentMemberKey)throw new Error("ของขวัญนี้ไม่ได้ส่งถึงคุณ");
      if(gift.status!=="pending")throw new Error("ของขวัญนี้ถูกจัดการแล้ว");

      const s=normalizeState(saveSnap.data(),currentMember);
      if(accept)addGiftItemToState(s,gift);
      next=s;
      tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(giftRef,{status:accept?"claimed":"discarded",resolvedAt:fs.serverTimestamp()},{merge:true});
      tx.set(mailRef,{read:true,resolved:true,status:accept?"claimed":"discarded"},{merge:true});
    });

    ownState=normalizeState(next,currentMember);
    if(!visitContext)state=ownState;
    saveLocalOnly(ownState);
    updateMeritUI();
    showNotifications(returnTab);
    showWeatherToast(accept?"🎁 รับของขวัญแล้ว":"🗑️ ทิ้งของขวัญแล้ว • ไม่คืนผู้ส่ง");
  }catch(error){message("จัดการของขวัญไม่ได้",error.message||"กรุณาลองใหม่")}
}

async function resetAllMemberAnimalsAndJellyfish(){
  if(adminProfile?.role!=="admin")return;
  const ok=window.confirm("ยืนยันรีเซ็ตสัตว์และแมงกะพรุนของสมาชิกทั้งหมด?\n\nกุศล พืช อาหาร ผลผลิต และของพิเศษอื่นจะไม่ถูกแตะ");
  if(!ok)return;

  try{
    const {db,fs}=await getFirebaseContext();
    const savesSnap=await fs.getDocs(fs.collection(db,"saves"));
    const batch=fs.writeBatch(db);
    let count=0;

    savesSnap.forEach(docSnap=>{
      if(docSnap.id==="aida")return;
      batch.set(fs.doc(db,"saves",docSnap.id),{
        animals:{chicken:Array(9).fill(null),fish:Array(9).fill(null),pig:Array(9).fill(null),cow:Array(9).fill(null)},
        animalRequests:{chicken:Array(9).fill(false),fish:Array(9).fill(false),pig:Array(9).fill(false),cow:Array(9).fill(false)},
        pendingAnimals:{chicken:0,fish:0,pig:0,cow:0},
        purchasePendingCounts:{chicken:0,fish:0,pig:0,cow:0},
        specialAnimals:Object.fromEntries(Object.keys(JELLYFISH_TYPES).map(k=>[k,0])),
        updatedAt:fs.serverTimestamp()
      },{merge:true});
      count++;
    });

    batch.set(fs.doc(db,"shared","jellyfishPond"),{slots:Array(12).fill(null),updatedAt:fs.serverTimestamp()},{merge:false});
    await batch.commit();

    showWeatherToast(`✅ รีเซ็ตสัตว์และแมงกะพรุน ${count} สมาชิกแล้ว`);
    showAdminCenter();
  }catch(error){message("รีเซ็ตไม่สำเร็จ",error.message||"กรุณาลองใหม่")}
}

bindEvents();
updateThaiClock();
loadMembers();

let ownSaveUnsubscribe=null;
function subscribeOwnGarden(){
  if(ownGardenUnsubscribe){ownGardenUnsubscribe();ownGardenUnsubscribe=null}
  if(ownSaveUnsubscribe){ownSaveUnsubscribe();ownSaveUnsubscribe=null}
  if(!cloudReady||!currentMemberKey)return;
  getFirebaseContext().then(({db,fs})=>{
    ownGardenUnsubscribe=fs.onSnapshot(fs.doc(db,"gardens",currentMemberKey),snap=>{
      if(!snap.exists()||!ownState||snap.metadata?.hasPendingWrites)return;const remote=snap.data();if(!Array.isArray(remote.plots))return;const hash=plotHash(remote.plots);if(hash===lastGardenHash)return;ownState.plots=remote.plots.map(normalizePlot);lastGardenHash=hash;if(!visitContext){state=ownState;draw()}
    },error=>console.warn("garden listener",error));
    ownSaveUnsubscribe=fs.onSnapshot(fs.doc(db,"saves",currentMemberKey),snap=>{
      if(!snap.exists()||!ownState||snap.metadata?.hasPendingWrites)return;const remote=normalizeState(snap.data(),currentMember);remote.plots=ownState.plots;const localComparable=cloneData(ownState),remoteComparable=cloneData(remote);delete localComparable.updatedAt;delete remoteComparable.updatedAt;if(JSON.stringify(localComparable)===JSON.stringify(remoteComparable))return;ownState=remote;if(!visitContext){state=ownState;updateMeritUI();draw();if(currentScene&&["chicken","fish","pig","cow"].includes(currentScene))renderAnimalScene(currentScene)}const key=stateKey();if(key)localStorage.setItem(key,JSON.stringify(ownState));refreshNotificationBadge();
    },error=>console.warn("save listener",error));
  }).catch(()=>{});
}
function stopOnlineListeners(){
  if(ownGardenUnsubscribe){ownGardenUnsubscribe();ownGardenUnsubscribe=null}if(ownSaveUnsubscribe){ownSaveUnsubscribe();ownSaveUnsubscribe=null}if(notificationTimer)clearInterval(notificationTimer);notificationTimer=null;if(cloudSaveTimer)clearTimeout(cloudSaveTimer);cloudSaveTimer=null;if(typeof stopJellyPondSubscription==="function")stopJellyPondSubscription();
}



/* ======================================================================
   MAJOR UPDATE V3 — 2026-08-08
   Time safety / admin bundles / animal purchase queue / theft V3 /
   jelly feeding choices / boat-race season / boat-supply drinks
   ====================================================================== */

const BOAT_COOLDOWN_MS=3*60*1000;
const BOAT_TARGET=200;
const BOAT_SUPPLY_DRINKS=[
  {id:"boatDrink1",name:"สมูทตี้กล้วยบดตดเปรต",image:"boat-supply-drink-1.png?v=1",chance:50,meritCost:1,meritReward:12,milk:1,need:{banana:5,lychee:3,gooseberry:2}},
  {id:"boatDrink2",name:"เจลาโต้มะยม (มั้ง)",image:"boat-supply-drink-2.png?v=1",chance:46,meritCost:2,meritReward:14,milk:1,need:{gooseberry:6,strawberry:4,chili:2}},
  {id:"boatDrink3",name:"อย่างมะม่วง แมงโก้ (ดริ้งๆ)",image:"boat-supply-drink-3.png?v=1",chance:42,meritCost:3,meritReward:16,milk:2,need:{mango:7,banana:5,lychee:3}},
  {id:"boatDrink4",name:"องุ่นรุ่นแก่",image:"boat-supply-drink-4.png?v=1",chance:38,meritCost:4,meritReward:19,milk:2,need:{grape:8,gooseberry:6,strawberry:4,banana:2}},
  {id:"boatDrink5",name:"ฟัก(วัย)ทอง ซาบซ่าน",image:"boat-supply-drink-5.png?v=1",chance:34,meritCost:5,meritReward:22,milk:3,need:{pumpkin:9,mango:7,banana:5,lychee:3}},
  {id:"boatDrink6",name:"รวมมิตร คิดถึงผัวเขา",image:"boat-supply-drink-6.png?v=1",chance:30,meritCost:6,meritReward:25,milk:4,need:{strawberry:10,grape:8,mango:6,gooseberry:5,chili:3}}
];
const BOAT_DRINK_BY_ID=Object.fromEntries(BOAT_SUPPLY_DRINKS.map(item=>[item.id,item]));
SCENES.boatRace={image:"boat-race-supply-background.jpeg?v=1"};

let boatRaceCache=null;
let boatRaceUnsubscribe=null;

function ensureBoatState(target){
  if(!target)return target;
  target.boatDrinks=target.boatDrinks&&typeof target.boatDrinks==="object"?target.boatDrinks:{};
  BOAT_SUPPLY_DRINKS.forEach(item=>{
    target.boatDrinks[item.id]=Math.max(0,Math.floor(Number(target.boatDrinks[item.id])||0));
  });
  return target;
}

/* Final state normalization: additive only; unknown old fields are retained. */
function fresh(player){
  const specials=Object.fromEntries(Object.keys(SPECIAL_ITEMS).map(k=>[k,0]));
  return{
    launchVersion:LAUNCH_VERSION,schemaVersion:MAJOR_V2_SCHEMA,
    player,merit:300,
    plots:Array.from({length:PLOT_COUNT},emptyPlot),
    bag:Object.fromEntries(Object.keys(CROPS).map(k=>[k,0])),
    animalProducts:Object.fromEntries(Object.keys(ANIMAL_PRODUCTS).map(k=>[k,0])),
    dishes:[],dishInventory:makeEmptyDishInventory(),specials,
    specialAnimals:Object.fromEntries(Object.keys(JELLYFISH_TYPES).map(k=>[k,0])),
    mysteryBoxes:0,
    boatDrinks:Object.fromEntries(BOAT_SUPPLY_DRINKS.map(item=>[item.id,0])),
    houseOfferings:[null,null,null],underwaterOffering:null,houseWorshipUntil:0,underwaterUntil:0,
    restUntil:0,restType:null,restRewardPending:false,
    almsOfferings:[null,null,null,null],lastAlmsDate:"",
    friendlyGhostUntil:0,challengeUntil:0,
    animalRequests:{chicken:Array(9).fill(false),fish:Array(9).fill(false),pig:Array(9).fill(false),cow:Array(9).fill(false)},
    animals:{chicken:Array(9).fill(null),fish:Array(9).fill(null),pig:Array(9).fill(null),cow:Array(9).fill(null)},
    pendingAnimals:{chicken:0,fish:0,pig:0,cow:0},
    purchasePendingCounts:{chicken:0,fish:0,pig:0,cow:0},
    animalBonusNextAt:gameNow()+ANIMAL_BONUS_INTERVAL,
    missions:makeMissionState(),
    dailyLimits:{dateKey:currentBangkokDateKey(),giftsSent:0,specialPurchases:0,jellyBoxes:0,steals:0,stolenFromKeys:[]},
    coconutQuotaResetAt:0,coconutQuotaCount:0,lastSeenYainooAt:0,
    adminStockV2Seeded:false,
    activeSessionId:""
  };
}

function normalizeState(raw,player){
  assertCurrentCloudSession(raw,player);
  const n=raw&&typeof raw==="object"?raw:fresh(player);
  n.launchVersion=n.launchVersion||LAUNCH_VERSION;n.schemaVersion=MAJOR_V2_SCHEMA;
  n.player=player||n.player||"ผู้เล่น";
  n.merit=Number.isFinite(Number(n.merit))?Number(n.merit):300;
  n.plots=Array.isArray(n.plots)?n.plots.slice(0,PLOT_COUNT):[];while(n.plots.length<PLOT_COUNT)n.plots.push(emptyPlot());n.plots=n.plots.map(normalizePlot);
  n.bag=n.bag&&typeof n.bag==="object"?n.bag:{};Object.keys(CROPS).forEach(k=>{n.bag[k]=Number.isFinite(Number(n.bag[k]))?Math.max(0,Number(n.bag[k])):0});
  n.animalProducts=n.animalProducts&&typeof n.animalProducts==="object"?n.animalProducts:{};Object.keys(ANIMAL_PRODUCTS).forEach(k=>{n.animalProducts[k]=Number.isFinite(Number(n.animalProducts[k]))?Math.max(0,Number(n.animalProducts[k])):0});
  const hadDishInventory=n.dishInventory&&typeof n.dishInventory==="object";
  n.dishInventory=hadDishInventory?n.dishInventory:{};
  RECIPES.forEach(r=>{if(!Number.isFinite(Number(n.dishInventory[r.id])))n.dishInventory[r.id]=0;else n.dishInventory[r.id]=Math.max(0,Number(n.dishInventory[r.id]))});
  if(!hadDishInventory&&Array.isArray(n.dishes))n.dishes.forEach(d=>{if(d?.id&&Object.prototype.hasOwnProperty.call(n.dishInventory,d.id))n.dishInventory[d.id]+=1});
  n.dishes=[];
  n.specials=n.specials&&typeof n.specials==="object"?n.specials:{};Object.keys(SPECIAL_ITEMS).forEach(k=>{n.specials[k]=Number.isFinite(Number(n.specials[k]))?Math.max(0,Number(n.specials[k])):0});
  n.specialAnimals=n.specialAnimals&&typeof n.specialAnimals==="object"?n.specialAnimals:{};Object.keys(JELLYFISH_TYPES).forEach(k=>{n.specialAnimals[k]=Number.isFinite(Number(n.specialAnimals[k]))?Math.max(0,Number(n.specialAnimals[k])):0});
  n.mysteryBoxes=Number.isFinite(Number(n.mysteryBoxes))?Math.max(0,Math.floor(Number(n.mysteryBoxes))):0;
  ensureBoatState(n);
  n.houseOfferings=Array.isArray(n.houseOfferings)?n.houseOfferings.slice(0,3):[null,null,null];while(n.houseOfferings.length<3)n.houseOfferings.push(null);
  n.underwaterOffering=typeof n.underwaterOffering==="string"?n.underwaterOffering:null;n.houseWorshipUntil=Number(n.houseWorshipUntil)||0;n.underwaterUntil=Number(n.underwaterUntil)||0;
  n.restUntil=Number(n.restUntil)||0;n.restType=n.restType==="sleep"||n.restType==="nap"?n.restType:null;n.restRewardPending=Boolean(n.restRewardPending);
  n.almsOfferings=Array.isArray(n.almsOfferings)?n.almsOfferings.slice(0,4):[null,null,null,null];while(n.almsOfferings.length<4)n.almsOfferings.push(null);
  n.lastAlmsDate=typeof n.lastAlmsDate==="string"?n.lastAlmsDate:"";n.friendlyGhostUntil=Number(n.friendlyGhostUntil)||0;n.challengeUntil=Number(n.challengeUntil)||0;
  n.animalRequests=n.animalRequests&&typeof n.animalRequests==="object"?n.animalRequests:{};
  n.animals=n.animals&&typeof n.animals==="object"?n.animals:{};
  n.pendingAnimals=n.pendingAnimals&&typeof n.pendingAnimals==="object"?n.pendingAnimals:{};
  n.purchasePendingCounts=n.purchasePendingCounts&&typeof n.purchasePendingCounts==="object"?n.purchasePendingCounts:{};
  SHOP_ITEMS.forEach(item=>{
    if(!Array.isArray(n.animalRequests[item.id]))n.animalRequests[item.id]=Array(9).fill(false);n.animalRequests[item.id]=n.animalRequests[item.id].slice(0,9);while(n.animalRequests[item.id].length<9)n.animalRequests[item.id].push(false);
    if(!Array.isArray(n.animals[item.id]))n.animals[item.id]=Array(9).fill(null);n.animals[item.id]=n.animals[item.id].slice(0,9);while(n.animals[item.id].length<9)n.animals[item.id].push(null);
    n.animals[item.id]=n.animals[item.id].map(a=>{
      if(!a||typeof a!=="object")return null;const placedAt=Number(a.placedAt)||gameNow();
      return{...a,placedAt,expiresAt:Number(a.expiresAt)||placedAt+ANIMAL_META[item.id].lifeMs,readyAt:Number(a.readyAt)||placedAt+item.productionMs,bonus:Boolean(a.bonus),name:typeof a.name==="string"?a.name:"",style:ANIMAL_STYLES[item.id]?Math.min(4,Math.max(1,Number(a.style)||1)):1};
    });
    n.pendingAnimals[item.id]=Math.max(0,Number(n.pendingAnimals[item.id])||0);n.purchasePendingCounts[item.id]=Math.max(0,Number(n.purchasePendingCounts[item.id])||0);
  });
  n.animalBonusNextAt=Number(n.animalBonusNextAt)||gameNow()+ANIMAL_BONUS_INTERVAL;
  ensureMissionStateFor(n);ensureDailyLimitsFor(n);
  n.coconutQuotaResetAt=Math.max(0,Number(n.coconutQuotaResetAt)||0);n.coconutQuotaCount=Math.max(0,Number(n.coconutQuotaCount)||0);
  if(n.coconutQuotaResetAt>0&&n.coconutQuotaResetAt<=gameNow()){n.coconutQuotaResetAt=0;n.coconutQuotaCount=0}
  n.lastSeenYainooAt=Number(n.lastSeenYainooAt)||0;n.adminStockV2Seeded=Boolean(n.adminStockV2Seeded);
  n.activeSessionId=String(n.activeSessionId||"");
  delete n.updatedAt;delete n.clockProbeAt;delete n.activeSessionAt;
  if(player==="Aida"&&currentMember==="Aida"&&adminProfile?.role==="admin")ensureAdminStock(n);
  return n;
}

function ensureAdminStock(target){
  if(currentMember!=="Aida"||adminProfile?.role!=="admin"||!target)return false;
  let changed=false;
  const exact=(obj,key)=>{
    if(Number(obj[key])!==ADMIN_STOCK_QTY){obj[key]=ADMIN_STOCK_QTY;changed=true}
  };
  Object.keys(CROPS).forEach(k=>exact(target.bag,k));
  Object.keys(ANIMAL_PRODUCTS).forEach(k=>exact(target.animalProducts,k));
  RECIPES.forEach(r=>exact(target.dishInventory,r.id));
  Object.keys(SPECIAL_ITEMS).forEach(k=>exact(target.specials,k));
  Object.keys(JELLYFISH_TYPES).forEach(k=>exact(target.specialAnimals,k));
  BOAT_SUPPLY_DRINKS.forEach(item=>exact(target.boatDrinks,item.id));
  SHOP_ITEMS.forEach(item=>exact(target.pendingAnimals,item.id));
  if(Number(target.mysteryBoxes)!==ADMIN_STOCK_QTY){target.mysteryBoxes=ADMIN_STOCK_QTY;changed=true}
  if(Number(target.merit)!==ADMIN_STOCK_QTY){target.merit=ADMIN_STOCK_QTY;changed=true}
  if(!target.adminStockV2Seeded){target.adminStockV2Seeded=true;changed=true}
  return changed;
}

function save(){
  const target=ownState||state;if(!target)return;
  if(!visitContext){ownState=target;state=target}
  if(currentMember==="Aida"&&adminProfile?.role==="admin")ensureAdminStock(target);
  saveLocalOnly(target);
  queueCloudSave();
}

async function stampActiveSessionAndSyncClock(saveRef,fs){
  cloudSessionId=newCloudSessionId();cloudSessionSuperseded=false;
  await fs.setDoc(saveRef,{activeSessionId:cloudSessionId,activeSessionAt:fs.serverTimestamp(),clockProbeAt:fs.serverTimestamp()},{merge:true});
  const snap=await fs.getDoc(saveRef);
  const serverMs=timestampMillis(snap.data()?.clockProbeAt);
  if(serverMs){
    SERVER_CLOCK_OFFSET_MS=serverMs-new Date().getTime();
    SERVER_CLOCK_EPOCH_MS=serverMs;
    SERVER_CLOCK_PERF_BASE=(globalThis.performance&&typeof globalThis.performance.now==="function")?globalThis.performance.now():0;
  }
  return snap;
}

async function initializeOrLoadCloudState(member,memberKey){
  const {db,fs}=await getFirebaseContext();
  const saveRef=fs.doc(db,"saves",memberKey),gardenRef=fs.doc(db,"gardens",memberKey);
  // สำคัญ: อ่านทั้ง save + garden ให้สำเร็จก่อนเขียน เพื่อไม่ให้ read error สร้าง state ว่างไปทับของจริง
  let [saveSnap,gardenSnap]=await Promise.all([fs.getDoc(saveRef),fs.getDoc(gardenRef)]);
  if(!saveSnap.exists()){
    const initial=fresh(member);
    await fs.setDoc(saveRef,{...cloneData(initial),createdAt:fs.serverTimestamp(),updatedAt:fs.serverTimestamp()},{merge:false});
  }
  const syncedSnap=await stampActiveSessionAndSyncClock(saveRef,fs);
  let loaded=normalizeState(syncedSnap.data(),member);
  loaded.activeSessionId=cloudSessionId;
  if(gardenSnap.exists()&&Array.isArray(gardenSnap.data()?.plots))loaded.plots=gardenSnap.data().plots.map(normalizePlot);
  ownState=normalizeState(loaded,member);state=ownState;lastGardenHash=plotHash(ownState.plots);
  const loginWrites=[
    fs.setDoc(fs.doc(db,"publicProfiles",memberKey),{memberKey,displayName:member,merit:Number(ownState.merit)||0,initialized:true,uid:(await getFirebaseBridge()).getCurrentUser()?.uid||"",updatedAt:fs.serverTimestamp()},{merge:true})
  ];
  // สวนที่มีอยู่แล้วไม่ต้องเขียนซ้ำตอน login: ลด network และไม่ชนกับเพื่อนที่กำลังช่วยสวน
  if(!gardenSnap.exists())loginWrites.push(fs.setDoc(gardenRef,{memberKey,displayName:member,plots:cloneData(ownState.plots),updatedAt:fs.serverTimestamp()},{merge:false}));
  await Promise.all(loginWrites);
  cloudReady=true;
  const localKey=stateKey();if(localKey)localStorage.setItem(localKey,JSON.stringify(ownState));
  subscribeOwnGarden();startNotificationPolling();return ownState;
}

async function flushCloudSave(){
  if(!cloudReady||!currentMemberKey||!ownState||cloudSessionSuperseded)return;
  if(cloudSaveInFlight)return cloudSaveInFlight;
  cloudSaveInFlight=(async()=>{
    const {db,fs}=await getFirebaseContext();
    ensureMissionStateFor(ownState);ensureDailyLimitsFor(ownState);ensureBoatState(ownState);
    if(currentMember==="Aida"&&adminProfile?.role==="admin")ensureAdminStock(ownState);
    const saveRef=fs.doc(db,"saves",currentMemberKey);
    const payload=cloneData(ownState);payload.launchVersion=LAUNCH_VERSION;payload.activeSessionId=cloudSessionId;
    await fs.runTransaction(db,async tx=>{
      const snap=await tx.get(saveRef);
      if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");
      const remoteSession=String(snap.data()?.activeSessionId||"");
      if(remoteSession&&remoteSession!==cloudSessionId)throw new Error("เครื่องนี้ไม่ใช่เซสชันล่าสุด");
      tx.set(saveRef,{...payload,updatedAt:fs.serverTimestamp()},{merge:false});
    });
    const currentHash=plotHash(ownState.plots);
    const writes=[];
    if(currentHash!==lastGardenHash){
      writes.push(fs.setDoc(fs.doc(db,"gardens",currentMemberKey),{memberKey:currentMemberKey,displayName:currentMember,plots:cloneData(ownState.plots),updatedAt:fs.serverTimestamp()},{merge:true}));
    }
    writes.push(fs.setDoc(fs.doc(db,"publicProfiles",currentMemberKey),{memberKey:currentMemberKey,displayName:currentMember,merit:Number(ownState.merit)||0,initialized:true,uid:(await getFirebaseBridge()).getCurrentUser()?.uid||"",updatedAt:fs.serverTimestamp()},{merge:true}));
    await Promise.all(writes);
    if(currentHash!==lastGardenHash)lastGardenHash=currentHash;
  })();
  try{return await cloudSaveInFlight}finally{cloudSaveInFlight=null}
}

function subscribeOwnGarden(){
  if(ownGardenUnsubscribe){ownGardenUnsubscribe();ownGardenUnsubscribe=null}
  if(ownSaveUnsubscribe){ownSaveUnsubscribe();ownSaveUnsubscribe=null}
  if(!cloudReady||!currentMemberKey)return;
  getFirebaseContext().then(({db,fs})=>{
    ownGardenUnsubscribe=fs.onSnapshot(fs.doc(db,"gardens",currentMemberKey),snap=>{
      if(!snap.exists()||!ownState||snap.metadata?.hasPendingWrites)return;
      const remote=snap.data();if(!Array.isArray(remote.plots))return;
      const hash=plotHash(remote.plots);if(hash===lastGardenHash)return;
      ownState.plots=remote.plots.map(normalizePlot);lastGardenHash=hash;
      if(!visitContext){state=ownState;draw()}
    },error=>console.warn("garden listener",error));
    ownSaveUnsubscribe=fs.onSnapshot(fs.doc(db,"saves",currentMemberKey),snap=>{
      if(!snap.exists()||!ownState||snap.metadata?.hasPendingWrites)return;
      const raw=snap.data(),remoteSession=String(raw.activeSessionId||"");
      if(cloudSessionId&&remoteSession&&remoteSession!==cloudSessionId){
        if(!cloudSessionSuperseded){
          cloudSessionSuperseded=true;cloudReady=false;
          message("ข้อมูลถูกเปิดจากอีกเครื่องแล้ว","เครื่องนี้จะหยุดบันทึกข้อมูลเพื่อป้องกัน state เก่าทับข้อมูลใหม่ กรุณาเข้าสู่เกมใหม่หากต้องการเล่นต่อบนเครื่องนี้");
        }
        return;
      }
      const remote=normalizeState(raw,currentMember);remote.plots=ownState.plots;
      const localComparable=cloneData(ownState),remoteComparable=cloneData(remote);
      delete localComparable.updatedAt;delete remoteComparable.updatedAt;
      if(JSON.stringify(localComparable)===JSON.stringify(remoteComparable))return;
      // รักษา object เดิมไว้ เพื่อไม่ให้ modal ที่เปิดอยู่ถือ reference เก่าแล้วกดไม่ติด
      const preservedPlots=ownState.plots;
      Object.keys(ownState).forEach(key=>{if(key!=="plots"&&!(key in remote))delete ownState[key]});
      Object.assign(ownState,remote);ownState.plots=preservedPlots;
      if(!visitContext){state=ownState;updateMeritUI();draw();if(currentScene&&["chicken","fish","pig","cow"].includes(currentScene))renderAnimalScene(currentScene)}
      saveLocalOnly(ownState);refreshNotificationBadge();
    },error=>console.warn("save listener",error));
  }).catch(()=>{});
}

function stopOnlineListeners(){
  if(ownGardenUnsubscribe){ownGardenUnsubscribe();ownGardenUnsubscribe=null}
  if(ownSaveUnsubscribe){ownSaveUnsubscribe();ownSaveUnsubscribe=null}
  if(notificationTimer)clearInterval(notificationTimer);notificationTimer=null;
  if(cloudSaveTimer)clearTimeout(cloudSaveTimer);cloudSaveTimer=null;
  if(typeof stopJellyPondSubscription==="function")stopJellyPondSubscription();
  stopBoatRaceSubscription();
}

/* ร้านค้าสัตว์: ซื้อสะสมได้ ไม่เอาจำนวนในคอกมาบล็อก */
function showShop(tab="animals"){
  if(guardResting())return;const s=ownState||state;ensureDailyLimitsFor(s);
  const animalCards=SHOP_ITEMS.map(item=>{
    const meta=ANIMAL_META[item.id];
    return `<article class="shop-card"><img class="shop-animal-img" src="${item.image}" alt="${item.name}"><b>${item.name}</b><small class="shop-price">${meta.price} ⭐️ / ตัว</small>${qtyInput(`animalQty-${item.id}`,SHOP_REQUEST_MAX_QTY)}<button class="shop-worship-button" type="button" data-buy-animal="${item.id}">ส่งคำขอซื้อ</button></article>`;
  }).join("");
  const specialUsed=Number(s.dailyLimits.specialPurchases)||0,specialRemain=Math.max(0,SPECIAL_DAILY_LIMIT-specialUsed);
  const specialCards=SPECIAL_SHOP_KEYS.map(key=>{const item=SPECIAL_ITEMS[key],max=Math.min(10,specialRemain);return `<article class="shop-card"><img class="shop-animal-img" src="${item.image}" alt="${item.name}"><b>${item.name}</b><small class="shop-price">20 ⭐️ / ชิ้น • ${item.boost}%</small>${max>0?qtyInput(`specialQty-${key}`,max):""}<button class="shop-worship-button" type="button" data-buy-special="${key}" ${max<=0?"disabled":""}>${max<=0?"ครบลิมิตวันนี้แล้ว":"ส่งคำขอซื้อ"}</button></article>`}).join("");
  const jellyUsed=Number(s.dailyLimits.jellyBoxes)||0,jellyRemain=Math.max(0,JELLY_BOX_DAILY_LIMIT-jellyUsed),jellyMax=Math.min(JELLY_BOX_DAILY_LIMIT,jellyRemain);
  const mysteryCard=`<article class="shop-card mystery-box-card"><img class="shop-animal-img" src="${JELLY_BOX.image}" alt="${JELLY_BOX.name}"><b>${JELLY_BOX.name}</b><small class="shop-price">${JELLY_BOX.price} ⭐️ / กล่อง</small><div class="mystery-rules"><strong>ซื้อได้สูงสุด ${JELLY_BOX_DAILY_LIMIT} กล่อง/วัน/คน</strong><span>โอกาสได้รับแมงกะพรุน 10%</span><span>ถ้าไม่ออกพรุน สุ่ม: อาหารคราฟ x2 / ใบไผ่ x5 / แพลงก์ตอน x2 / กุศล +5 / ยาถ่ายแมงกะพรุน x1</span><span>วันนี้ใช้ ${jellyUsed}/${JELLY_BOX_DAILY_LIMIT}</span></div>${jellyMax>0?qtyInput("jellyBoxQty",jellyMax):""}<button class="shop-worship-button" id="buyJellyBoxBtn" type="button" ${jellyMax<=0?"disabled":""}>${jellyMax<=0?"ครบ 7 กล่องวันนี้แล้ว":"ส่งคำขอซื้อ"}</button></article>`;
  $("modalContent").innerHTML=`<section class="feature-panel shop-panel"><button id="stableEntranceBtn" class="stable-entrance-button" type="button">ทางเข้าโรงเรือน</button><h2>🕯️ ร้านค้า</h2><div class="shop-category-tabs shop-category-tabs-v2"><button type="button" data-shop-tab="animals" class="${tab==="animals"?"active":""}">🐾 สัตว์วิญญาณ</button><button type="button" data-shop-tab="specials" class="${tab==="specials"?"active":""}">🎁 ของพิเศษ</button><button type="button" data-shop-tab="mystery" class="${tab==="mystery"?"active":""}">🎲 กล่องสุ่ม</button></div>${tab==="animals"?`<p class="feature-subtitle">ซื้อสะสมไว้ใน “รอวาง” ได้ ไม่จำกัดด้วยจำนวนช่องในคอก • จำกัด 9 ช่องเฉพาะตอนวางจริง</p><div class="shop-grid">${animalCards}</div>`:tab==="specials"?`<p class="feature-subtitle">ของพิเศษรวมวันละ ${SPECIAL_DAILY_LIMIT} ชิ้น • วันนี้ใช้ ${specialUsed}/${SPECIAL_DAILY_LIMIT}</p><div class="shop-grid">${specialCards}</div>`:`<p class="feature-subtitle">กล่องสุ่มแมงกะพรุน • จำกัดรายวันชัดเจน</p><div class="shop-grid mystery-shop-grid">${mysteryCard}</div>`}</section>`;
  $("stableEntranceBtn").onclick=()=>{closeModal();openScene("chicken")};
  document.querySelectorAll("[data-shop-tab]").forEach(btn=>btn.onclick=()=>showShop(btn.dataset.shopTab));
  document.querySelectorAll("[data-buy-animal]").forEach(btn=>btn.onclick=()=>requestAnimalPurchase(btn.dataset.buyAnimal,Number($(`animalQty-${btn.dataset.buyAnimal}`)?.value)||1));
  document.querySelectorAll("[data-buy-special]").forEach(btn=>btn.onclick=()=>requestSpecialPurchase(btn.dataset.buySpecial,Number($(`specialQty-${btn.dataset.buySpecial}`)?.value)||1));
  if($("buyJellyBoxBtn"))$("buyJellyBoxBtn").onclick=()=>requestMysteryBoxPurchase(Number($("jellyBoxQty")?.value)||1);
  openModal();
}

async function requestAnimalPurchase(type,qty=1){
  if(!cloudReady){message("ยังซื้อไม่ได้","กรุณาเชื่อม Firebase ก่อน");return}
  const item=animalById(type),meta=ANIMAL_META[type];if(!item||!meta)return;
  qty=Math.max(1,Math.min(SHOP_REQUEST_MAX_QTY,Math.floor(Number(qty)||1)));
  try{
    const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey),requestRef=fs.doc(fs.collection(db,"purchaseRequests"));let next;
    await fs.runTransaction(db,async tx=>{
      const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");
      const s=normalizeState(snap.data(),currentMember);
      s.purchasePendingCounts[type]=(Number(s.purchasePendingCounts[type])||0)+qty;next=s;
      tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(requestRef,{category:"animal",itemKey:type,itemName:item.name,price:meta.price,qty,status:"pending",memberKey:currentMemberKey,memberName:currentMember,dateKey:currentBangkokDateKey(),createdAt:fs.serverTimestamp()});
    });
    ownState=normalizeState(next,currentMember);state=ownState;
    message("🐾 ส่งคำขอแล้ว",`${item.name} ×${qty}<br>${meta.price*qty}⭐️ รวม<br>อนุมัติแล้วจะยังไม่เข้ากระเป๋า ต้องรอยัยหนูส่งเป็นของขวัญ`);
    refreshNotificationBadge();
  }catch(error){message("ส่งคำขอไม่ได้",error.message||"กรุณาลองใหม่")}
}

/* รายชื่อเพื่อนรวม Aida และ Aida ไม่มี immunity */
async function showFriends(){
  if(guardResting())return;
  let profileMap={};
  if(cloudReady){
    try{const {db,fs}=await getFirebaseContext(),snap=await fs.getDocs(fs.collection(db,"publicProfiles"));snap.forEach(docSnap=>profileMap[docSnap.id]=docSnap.data())}catch(error){console.warn("rank load",error)}
  }
  const rows=Object.keys(MEMBERS).map(name=>{const key=memberKeyFromName(name),p=profileMap[key]||{};return{name,key,merit:Number(p.merit??300),initialized:Boolean(p.initialized)}}).sort((a,b)=>b.merit-a.merit||a.name.localeCompare(b.name));
  $("modalContent").innerHTML=`<section class="feature-panel friends-panel"><h2>👥 เพื่อน & Rank กุศล</h2><p class="feature-subtitle">Aida อยู่ในรายชื่อเยี่ยมฟาร์มเหมือนสมาชิกคนอื่น</p><div class="friend-list friend-rank-list">${rows.map((row,index)=>`<div class="friend-row friend-rank-row"><span class="friend-rank">#${index+1}</span><span class="friend-avatar" aria-hidden="true">👻</span><span class="friend-info"><b>${safeHtml(row.name)}</b><small>🙏 ${row.merit} กุศล${row.initialized?"":" • ยังไม่เข้าสวนครั้งแรก"}</small></span>${row.name===currentMember?`<span class="friend-self">คุณ</span>`:`<span class="friend-actions"><button type="button" data-visit-friend="${row.key}" data-friend-name="${safeHtml(row.name)}" ${!row.initialized?"disabled":""}>เยี่ยมสวน</button><button type="button" data-gift-friend="${row.key}" data-friend-name="${safeHtml(row.name)}">ส่งของ</button></span>`}</div>`).join("")}</div></section>`;
  document.querySelectorAll("[data-visit-friend]").forEach(btn=>btn.onclick=()=>visitFriend(btn.dataset.visitFriend,btn.dataset.friendName));
  document.querySelectorAll("[data-gift-friend]").forEach(btn=>btn.onclick=()=>showGiftComposer(btn.dataset.giftFriend,btn.dataset.friendName));openModal();
}

function showStealConfirmation(index){
  const plot=state.plots[index];if(!plot?.crop)return;
  if(["babyBamboo","hauntedPlankton"].includes(plot.crop)){message("ขโมยไม่ได้","พืชชนิดนี้เป็นพืชคุ้มครอง ขโมยไม่ได้เด็ดขาด");return}
  $("modalContent").innerHTML=`<section class="feature-panel steal-confirm-panel"><h2>คุณแน่ใจนะว่าจะทำสันดานแบบนี้</h2><p>🧤 ${CROPS[plot.crop].name} พร้อมเก็บอยู่ตรงหน้าแล้ว</p><div class="steal-confirm-actions"><button id="confirmStealBtn" class="danger-action" type="button">พี่ลำบากพี่ต้องทำ</button><button id="cancelStealBtn" class="secondary-action" type="button">ไม่ดีกว่า กลับใจ</button></div></section>`;
  openModal();$("confirmStealBtn").onclick=()=>stealFriendPlot(index);$("cancelStealBtn").onclick=closeModal;
}

async function tapFriendPlot(index){
  if(!visitContext)return;
  const plot=state.plots[index];ensurePlotPhase(plot);
  if(plot?.phase==="ready"){
    if(["babyBamboo","hauntedPlankton"].includes(plot.crop)){message("ขโมยไม่ได้","เบบี้แบมบรู๊ววว และ แพลงก์ตอนหลอนปิ๊ ขโมยไม่ได้");return}
    showStealConfirmation(index);return;
  }
  if(plot?.phase!=="needsWater"&&plot?.phase!=="worm"){message("เยี่ยมสวนเพื่อน","คุณสามารถรดน้ำ กำจัดหนอน หรือขโมยต้นที่พร้อมเก็บได้");return}
  const action=plot.phase==="needsWater"?"water":"worm",targetKey=visitContext.memberKey,targetName=visitContext.name;
  try{
    const {db,fs}=await getFirebaseContext(),gardenRef=fs.doc(db,"gardens",targetKey),ownSaveRef=fs.doc(db,"saves",currentMemberKey),mailRef=fs.doc(fs.collection(db,"mailboxes",targetKey,"items"));let nextOwn,newPlots;
    await fs.runTransaction(db,async tx=>{
      const [gardenSnap,ownSnap]=await Promise.all([tx.get(gardenRef),tx.get(ownSaveRef)]);if(!gardenSnap.exists()||!ownSnap.exists())throw new Error("ข้อมูลสวนไม่พร้อม");
      const plots=(gardenSnap.data().plots||[]).map(ensurePlotPhaseStandalone),p=plots[index];if(!p?.crop)throw new Error("แปลงนี้ว่างแล้ว");
      const own=normalizeState(ownSnap.data(),currentMember);
      if(action==="water"){
        if(p.phase!=="needsWater")throw new Error("ต้นนี้ไม่ต้องการน้ำแล้ว");
        const crop=CROPS[p.crop],finalMs=Math.max(60000,crop.totalMs-crop.waterMs);p.wateredAt=gameNow();
        if(Math.random()<Number(crop.wormChance||0)){p.phase="worm";p.worm=true;p.phaseEndsAt=0}else{p.phase="growing2";p.worm=false;p.phaseEndsAt=gameNow()+finalMs}
        incrementMissionOn(own,"waterFriends",1);
      }else{
        if(p.phase!=="worm")throw new Error("หนอนถูกกำจัดไปแล้ว");
        const crop=CROPS[p.crop];p.phase="growing2";p.worm=false;p.phaseEndsAt=gameNow()+Math.max(60000,crop.totalMs-crop.waterMs);incrementMissionOn(own,"clearWorms",1);
      }
      plots[index]=p;nextOwn=own;newPlots=plots;
      tx.set(gardenRef,{memberKey:targetKey,displayName:targetName,plots:cloneData(plots),updatedAt:fs.serverTimestamp()},{merge:true});
      tx.set(ownSaveRef,{...cloneData(own),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(mailRef,{source:"friend",type:action==="water"?"friendWater":"friendWorm",fromKey:currentMemberKey,fromName:currentMember,title:action==="water"?`${currentMember} เข้ามารดน้ำพืชพันธุ์ให้คุณ 💧`:`${currentMember} เข้ามากำจัดหนอนให้คุณ 🐛`,text:"",read:false,createdAt:fs.serverTimestamp()});
    });
    ownState=normalizeState(nextOwn,currentMember);state.plots=newPlots.map(normalizePlot);draw();showWeatherToast(action==="water"?"💧 รดน้ำให้เพื่อนแล้ว":"🐛 กำจัดหนอนให้เพื่อนแล้ว");
  }catch(error){message("ช่วยสวนไม่สำเร็จ",error.message||"กรุณาลองใหม่")}
}

async function stealFriendPlot(index){
  if(!visitContext||!cloudReady)return;
  const targetKey=visitContext.memberKey,targetName=visitContext.name;
  try{
    const {db,fs}=await getFirebaseContext(),gardenRef=fs.doc(db,"gardens",targetKey),ownSaveRef=fs.doc(db,"saves",currentMemberKey),mailRef=fs.doc(fs.collection(db,"mailboxes",targetKey,"items"));
    let nextOwn,cropKey="",newPlots;
    await fs.runTransaction(db,async tx=>{
      const [gardenSnap,ownSnap]=await Promise.all([tx.get(gardenRef),tx.get(ownSaveRef)]);
      if(!gardenSnap.exists()||!ownSnap.exists())throw new Error("ข้อมูลสวนไม่พร้อม");
      const plots=(gardenSnap.data().plots||[]).map(ensurePlotPhaseStandalone),p=plots[index];
      if(!p?.crop||p.phase!=="ready")throw new Error("ต้นนี้ไม่พร้อมให้ขโมยแล้ว");
      if(["babyBamboo","hauntedPlankton"].includes(p.crop))throw new Error("พืชชนิดนี้ขโมยไม่ได้เด็ดขาด");
      const own=normalizeState(ownSnap.data(),currentMember);ensureDailyLimitsFor(own);
      if((Number(own.dailyLimits.steals)||0)>=FRIEND_STEAL_DAILY_LIMIT)throw new Error(`วันนี้ขโมยครบ ${FRIEND_STEAL_DAILY_LIMIT} ครั้งแล้ว`);
      cropKey=p.crop;grantHarvestYield(own,cropKey,1);own.dailyLimits.steals+=1;incrementMissionOn(own,"stealFriendCrop",1);
      plots[index]=emptyPlot();newPlots=plots;nextOwn=own;
      tx.set(gardenRef,{memberKey:targetKey,displayName:targetName,plots:cloneData(plots),updatedAt:fs.serverTimestamp()},{merge:true});
      tx.set(ownSaveRef,{...cloneData(own),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(mailRef,{source:"friend",type:"cropSteal",fromKey:currentMemberKey,title:"มีคนขี้ลัก เข้ามาขโมยพืชผักของคุณ",text:"",read:false,createdAt:fs.serverTimestamp()});
    });
    ownState=normalizeState(nextOwn,currentMember);state.plots=newPlots.map(normalizePlot);closeModal();draw();
    showWeatherToast(`🧤 ขโมย ${CROPS[cropKey].name} สำเร็จ • แปลงเจ้าของว่างแล้ว`);
  }catch(error){message("ขโมยไม่ได้",error.message||"กรุณาลองใหม่")}
}

/* ผีน้อย: กุศล 1–5 เมื่อสุ่มได้กุศล */
function friendlyGhostReward(){
  if(guardResting())return;const target=ownState||state,rem=Math.max(0,Number(target.friendlyGhostUntil||0)-gameNow());
  if(rem>0){message("👻 กดบ่อยเกินไปค่ะแม่ รอก่อน",`ผีน้อยใจดีมาแจกของได้อีกใน ${formatFriendlyCountdown(rem)}`);return}
  const pool=[...Object.keys(CROPS).map(k=>({type:"crop",key:k,name:CROPS[k].name})),...Object.keys(ANIMAL_PRODUCTS).map(k=>({type:"product",key:k,name:ANIMAL_PRODUCTS[k].name})),...RECIPES.map(r=>({type:"dish",key:r.id,name:r.name})),{type:"merit",key:"merit",name:"กุศล"},{type:"special",key:"jellyfishLaxative",name:"ยาถ่ายแมงกะพรุน"}];
  const prize=pool[Math.floor(Math.random()*pool.length)],qty=prize.type==="merit"?randInt(1,5):(prize.key==="jellyfishLaxative"?1:randInt(1,2));
  if(prize.type==="crop")target.bag[prize.key]=(target.bag[prize.key]||0)+qty;
  if(prize.type==="product")target.animalProducts[prize.key]=(target.animalProducts[prize.key]||0)+qty;
  if(prize.type==="dish")addDishToState(target,prize.key,qty);
  if(prize.type==="special")target.specials[prize.key]=(target.specials[prize.key]||0)+qty;
  if(prize.type==="merit")target.merit+=qty;
  target.friendlyGhostUntil=gameNow()+FRIENDLY_GHOST_COOLDOWN;incrementMissionOn(target,"friendlyGhost",qty);save();updateMeritUI();message("👻 ผีน้อยใจดี",`รับ ${qty}x ${prize.name}`);
}

/* แมงกะพรุน: ครบ 5 ครั้ง, เลือกแพลงก์ตอน x1 หรือทรัฟเฟิล x2 */
function normalizeJellyPond(data,dropExpired=false){
  const now=gameNow(),slots=Array.isArray(data?.slots)?data.slots.slice(0,12):[];
  while(slots.length<12)slots.push(null);
  return{slots:slots.map(slot=>{
    if(!slot||typeof slot!=="object"||!JELLYFISH_TYPES[slot.typeKey])return null;
    const normalized={id:String(slot.id||""),typeKey:slot.typeKey,ownerKey:String(slot.ownerKey||""),ownerName:String(slot.ownerName||"สมาชิก"),customName:String(slot.customName||"").slice(0,20),placedAt:Number(slot.placedAt)||now,expiresAt:Number(slot.expiresAt)||now+JELLY_LIFETIME_MS,feedCount:Math.max(0,Math.min(5,Number(slot.feedCount)||0)),cooldownUntil:Math.max(0,Number(slot.cooldownUntil)||0)};
    if(dropExpired&&normalized.expiresAt<=now)return null;
    if(normalized.cooldownUntil>0&&normalized.cooldownUntil<=now){normalized.cooldownUntil=0;normalized.feedCount=0}
    return normalized;
  })};
}

function showJellyDetails(index,slot){
  const type=JELLYFISH_TYPES[slot.typeKey],isOwner=slot.ownerKey===currentMemberKey,now=gameNow(),cooldown=Math.max(0,Number(slot.cooldownUntil||0)-now),ready=slot.feedCount>=5&&cooldown<=0;
  const laxativeCount=specialCount("jellyfishLaxative");
  $("modalContent").innerHTML=`<section class="feature-panel jelly-detail-panel"><img class="jelly-detail-img" src="${type.image}" alt="${type.name}"><h2>${safeHtml(slot.customName||type.name)}</h2><p><b>สายพันธุ์:</b> ${type.name}<br><b>เจ้าของ:</b> ${safeHtml(slot.ownerName)}<br><b>อายุคงเหลือ:</b> ${jellyHoursLeft(slot)} ชั่วโมง<br><b>อาหาร:</b> ${slot.feedCount}/5${cooldown>0?`<br><b>คูลดาวน์:</b> ${formatHM(cooldown)}`:""}</p><div class="jelly-action-grid"><button id="feedJellyBtn" type="button" ${ready||cooldown>0?"disabled":""}>🍽️ ให้อาหาร</button>${ready?'<button id="jellyLoveBtn" class="primary-spooky-action" type="button">💗 พร้อมท้ารัก</button>':""}${isOwner?'<button id="renameJellyBtn" type="button">✏️ ตั้งชื่อ</button>':""}<button id="poisonJellyBtn" class="danger-action" type="button" ${laxativeCount<=0?"disabled":""}>🧪 ใช้ยาถ่าย ×1</button></div></section>`;
  openModal();
  if($("feedJellyBtn"))$("feedJellyBtn").onclick=()=>showJellyFoodChoices(index);
  if($("jellyLoveBtn"))$("jellyLoveBtn").onclick=()=>claimJellyLove(index);
  if($("renameJellyBtn"))$("renameJellyBtn").onclick=()=>renameJellyfish(index);
  if($("poisonJellyBtn"))$("poisonJellyBtn").onclick=()=>poisonJellyfish(index);
}

function showJellyFoodChoices(index){
  const s=ownState||state,plankton=Number(s?.bag?.hauntedPlankton)||0,truffle=Number(s?.animalProducts?.truffle)||0;
  $("modalContent").innerHTML=`<section class="feature-panel jelly-food-panel"><h2>🍽️ เลือกอาหารแมงกะพรุน</h2><p class="feature-subtitle">ให้อาหารสำเร็จ 1 ครั้ง = ผู้ให้อาหาร +1 กุศล</p><div class="jelly-food-grid"><button type="button" data-jelly-food="plankton" ${plankton<1?"disabled":""}><b>แพลงก์ตอนหลอนปิ๊ ×1</b><small>มี ×${plankton}</small></button><button type="button" data-jelly-food="truffle" ${truffle<2?"disabled":""}><b>เห็ดทรัฟเฟิล ×2</b><small>มี ×${truffle}</small></button></div></section>`;
  document.querySelectorAll("[data-jelly-food]").forEach(btn=>btn.onclick=()=>feedJellyfish(index,btn.dataset.jellyFood));openModal();
}

async function feedJellyfish(index,foodType="plankton"){
  try{
    const {db,fs}=await getFirebaseContext(),pondRef=fs.doc(db,"shared","jellyfishPond"),saveRef=fs.doc(db,"saves",currentMemberKey);let next,pond;
    await fs.runTransaction(db,async tx=>{
      const [pondSnap,saveSnap]=await Promise.all([tx.get(pondRef),tx.get(saveRef)]);if(!pondSnap.exists()||!saveSnap.exists())throw new Error("ข้อมูลไม่พร้อม");
      const p=normalizeJellyPond(pondSnap.data(),true),slot=p.slots[index],s=normalizeState(saveSnap.data(),currentMember);if(!slot)throw new Error("แมงกะพรุนตัวนี้หมดอายุแล้ว");
      if(Number(slot.cooldownUntil||0)>gameNow())throw new Error(`ยังอยู่ในคูลดาวน์ ${formatHM(slot.cooldownUntil-gameNow())}`);
      if(slot.feedCount>=5)throw new Error("แมงกะพรุนอิ่มครบ 5/5 แล้ว");
      if(foodType==="truffle"){
        if((Number(s.animalProducts.truffle)||0)<2)throw new Error("เห็ดทรัฟเฟิลไม่ครบ 2 ชิ้น");
        s.animalProducts.truffle-=2;
      }else{
        if((Number(s.bag.hauntedPlankton)||0)<1)throw new Error("ไม่มีแพลงก์ตอนหลอนปิ๊ในกระเป๋า");
        s.bag.hauntedPlankton-=1;
      }
      s.merit=(Number(s.merit)||0)+1;slot.feedCount=Math.min(5,slot.feedCount+1);incrementMissionOn(s,"feedJellyfish",1);next=s;pond=p;
      tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(pondRef,{slots:p.slots,updatedAt:fs.serverTimestamp()},{merge:false});
    });
    ownState=normalizeState(next,currentMember);state=ownState;jellyPondCache=pond;updateMeritUI();closeModal();drawJellyfishPond(pond);showWeatherToast("🍽️ ให้อาหารสำเร็จ • +1 กุศล");
  }catch(error){message("ให้อาหารไม่ได้",error.message||"กรุณาลองใหม่")}
}

function rollJellyLoveReward(s){
  if(Math.random()<.55){
    const merit=randInt(5,12);s.merit+=merit;return `🙏 +${merit} กุศล`;
  }
  const group=randInt(1,4),qty=randInt(1,2);
  if(group===1){const r=RECIPES[Math.floor(Math.random()*RECIPES.length)];addDishToState(s,r.id,qty);return `🍲 ${r.name} ×${qty}`}
  if(group===2){const keys=Object.keys(ANIMAL_PRODUCTS),k=keys[Math.floor(Math.random()*keys.length)];s.animalProducts[k]=(Number(s.animalProducts[k])||0)+qty;return `🐾 ${ANIMAL_PRODUCTS[k].name} ×${qty}`}
  if(group===3){const keys=Object.keys(CROPS),k=keys[Math.floor(Math.random()*keys.length)];s.bag[k]=(Number(s.bag[k])||0)+qty;return `🌱 ${CROPS[k].name} ×${qty}`}
  const keys=Object.keys(SPECIAL_ITEMS),k=keys[Math.floor(Math.random()*keys.length)],specialQty=k==="jellyfishLaxative"?1:qty;s.specials[k]=(Number(s.specials[k])||0)+specialQty;return `🎁 ${SPECIAL_ITEMS[k].name} ×${specialQty}`;
}

async function claimJellyLove(index){
  const cached=jellyPondCache?.slots?.[index];if(cached&&cached.ownerKey!==currentMemberKey){message("กดไม่ได้","คุณไม่ใช่เจ้าของจะกดเพื่อ?");return}
  try{
    const {db,fs}=await getFirebaseContext(),pondRef=fs.doc(db,"shared","jellyfishPond"),saveRef=fs.doc(db,"saves",currentMemberKey);let next,pond,rewardText="";
    await fs.runTransaction(db,async tx=>{
      const [pondSnap,saveSnap]=await Promise.all([tx.get(pondRef),tx.get(saveRef)]);if(!pondSnap.exists()||!saveSnap.exists())throw new Error("ข้อมูลไม่พร้อม");
      const p=normalizeJellyPond(pondSnap.data(),true),slot=p.slots[index],s=normalizeState(saveSnap.data(),currentMember);if(!slot)throw new Error("แมงกะพรุนหมดอายุแล้ว");
      if(slot.ownerKey!==currentMemberKey)throw new Error("คุณไม่ใช่เจ้าของจะกดเพื่อ?");
      if(slot.feedCount<5)throw new Error("ยังให้อาหารไม่ครบ 5/5");
      if(Number(slot.cooldownUntil||0)>gameNow())throw new Error("ยังอยู่ในคูลดาวน์");
      rewardText=rollJellyLoveReward(s);
      slot.feedCount=5;slot.cooldownUntil=gameNow()+JELLY_LOVE_COOLDOWN_MS;next=s;pond=p;
      tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(pondRef,{slots:p.slots,updatedAt:fs.serverTimestamp()},{merge:false});
    });
    ownState=normalizeState(next,currentMember);state=ownState;jellyPondCache=pond;updateMeritUI();closeModal();drawJellyfishPond(pond);
    message("💗 ท้ารักสำเร็จ",`${rewardText}<br>คูลดาวน์ 1 ชั่วโมง • ครบเวลาแล้วจะกลับเป็น 0/5`);
  }catch(error){message("ท้ารักไม่ได้",error.message||"กรุณาลองใหม่")}
}

async function poisonJellyfish(index){
  if(specialCount("jellyfishLaxative")<=0){message("ไม่มียาถ่ายแมงกะพรุน","ยาถ่ายแมงกะพรุนสุ่มได้จากแพนด้า ผีน้อย และกล่องสุ่ม");return}
  try{
    const {db,fs}=await getFirebaseContext(),pondRef=fs.doc(db,"shared","jellyfishPond"),saveRef=fs.doc(db,"saves",currentMemberKey);let next,pond,ownerKey="";
    await fs.runTransaction(db,async tx=>{
      const [pondSnap,saveSnap]=await Promise.all([tx.get(pondRef),tx.get(saveRef)]);if(!pondSnap.exists()||!saveSnap.exists())throw new Error("ข้อมูลไม่พร้อม");
      const p=normalizeJellyPond(pondSnap.data(),true),slot=p.slots[index],s=normalizeState(saveSnap.data(),currentMember);if(!slot)throw new Error("แมงกะพรุนหมดอายุแล้ว");
      if((Number(s.specials.jellyfishLaxative)||0)<1)throw new Error("ไม่มียาถ่ายแมงกะพรุน");
      s.specials.jellyfishLaxative-=1;ownerKey=slot.ownerKey;slot.expiresAt-=JELLY_POISON_REDUCE_MS;if(slot.expiresAt<=gameNow())p.slots[index]=null;next=s;pond=p;
      tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(pondRef,{slots:p.slots,updatedAt:fs.serverTimestamp()},{merge:false});
      if(ownerKey&&ownerKey!==currentMemberKey)tx.set(fs.doc(fs.collection(db,"mailboxes",ownerKey,"items")),{source:"friend",type:"jellyPoison",fromKey:currentMemberKey,title:"มีคนใช้ยาถ่ายแมงกะพรุนของคุณ 🧪",text:"อายุแมงกะพรุนลดลง 3 ชั่วโมง",read:false,createdAt:fs.serverTimestamp()});
    });
    ownState=normalizeState(next,currentMember);state=ownState;jellyPondCache=pond;closeModal();drawJellyfishPond(pond);showWeatherToast("🧪 ใช้ยาถ่ายสำเร็จ • อายุลดลง 3 ชั่วโมง");
  }catch(error){message("ใช้ยาถ่ายไม่ได้",error.message||"กรุณาลองใหม่")}
}

async function renderJellyfishScene(){
  setSceneNav({backText:"เทศกาลเรือพาย",backAction:()=>openScene("boatRace"),nextText:"กลับไปที่แปลง",nextAction:returnToFarm});
  if(!cloudReady){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">กำลังเชื่อมบ่อแมงกะพรุนส่วนกลาง...</div>';return}
  try{
    const pond=await loadSharedJellyPond();drawJellyfishPond(pond);ensureJellyPondSubscription();stopSceneTimer();
    sceneTimer=setInterval(async()=>{if(currentScene!=="jellyfish"){stopSceneTimer();return}try{drawJellyfishPond(await loadSharedJellyPond())}catch{}},60000);
  }catch(error){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">โหลดบ่อแมงกะพรุนไม่สำเร็จ</div>'}
}

/* เครื่องดื่มนักพาย — แถบสีชมพูใน Craft */
function boatDrinkIngredientHTML(recipe){
  const cropNeeds=Object.entries(recipe.need).map(([key,count])=>`<span>${CROPS[key].icon} ${CROPS[key].name} ×${count}</span>`).join("");
  return `${cropNeeds}<span>🥛 ${ANIMAL_PRODUCTS.milk.name} ×${recipe.milk}</span><span>🙏 กุศล ×${recipe.meritCost}</span>`;
}
function canCraftBoatDrink(recipe,s=ownState||state){
  return Object.entries(recipe.need).every(([key,count])=>(Number(s.bag[key])||0)>=count)
    && (Number(s.animalProducts.milk)||0)>=recipe.milk
    && (Number(s.merit)||0)>=recipe.meritCost;
}
function boatDrinkCard(recipe){
  return `<article class="recipe-card boat-recipe-card"><div class="craft-chance-badge">🎲 ${recipe.chance}%</div><img src="${recipe.image}" alt="${recipe.name}"><h3>🚣 ${recipe.name}</h3><small class="difficulty-label">คราฟสำเร็จ +${recipe.meritReward} กุศล • นม ×${recipe.milk}</small><div class="recipe-needs">${boatDrinkIngredientHTML(recipe)}</div><button type="button" data-confirm-boat-craft="${recipe.id}">คราฟ</button></article>`;
}
function kitchen(){
  if(guardResting())return;
  const normal=RECIPES.filter(r=>!r.night),night=RECIPES.filter(r=>r.night),nightOpen=isNightCraftOpen();
  $("modalContent").innerHTML=`<section class="feature-panel recipe-catalog-panel"><h2>📖 สมุดเมนูอาหาร</h2><div class="recipe-section-title">เมนูทั่วไป</div><div class="recipe-catalog-grid">${normal.map(recipeCard).join("")}</div><div class="night-menu-frame"><h2>🌙 เมนูท้าวิญญาณรอบดึก</h2><p>${nightOpen?`เปิดให้คราฟถึง 02:00 น.`:`เปิดเวลา 22:00–02:00 • เปิดอีกใน ${formatHM(msUntilNightCraft())}`}</p><div class="recipe-catalog-grid">${night.map(recipeCard).join("")}</div></div><div class="boat-menu-frame"><h2>🩷 เครื่องดื่มนักพาย</h2><p>เสบียงสำหรับเทศกาลเรือพายเท่านั้น • ใช้นมวัวทุกเมนู</p><div class="recipe-catalog-grid">${BOAT_SUPPLY_DRINKS.map(boatDrinkCard).join("")}</div></div></section>`;
  document.querySelectorAll("[data-confirm-craft]").forEach(b=>b.onclick=()=>confirmCraft(b.dataset.confirmCraft));
  document.querySelectorAll("[data-confirm-boat-craft]").forEach(b=>b.onclick=()=>confirmBoatDrinkCraft(b.dataset.confirmBoatCraft));
  openModal();
}
function confirmBoatDrinkCraft(id){
  const recipe=BOAT_DRINK_BY_ID[id];if(!recipe)return;
  $("modalContent").innerHTML=`<section class="feature-panel craft-warning-panel boat-craft-warning"><div class="craft-chance-big">โอกาสสำเร็จ ${recipe.chance}%</div><img src="${recipe.image}" alt="${recipe.name}"><h2>${recipe.name}</h2><p>ใช้วัตถุดิบตามสูตร + นมวัว ×${recipe.milk} + กุศล ×${recipe.meritCost}<br>ถ้าสำเร็จได้รับเครื่องดื่ม ×1 และ +${recipe.meritReward} กุศล<br>ถ้าพลาด วัตถุดิบทั้งหมดจะถูกใช้ไป</p><div class="confirm-actions"><button id="confirmBoatCraftBtn" class="danger-action" type="button">ยืนยันคราฟ</button><button id="cancelBoatCraftBtn" class="secondary-action" type="button">กลับ</button></div></section>`;
  $("confirmBoatCraftBtn").onclick=()=>craftBoatDrink(id);$("cancelBoatCraftBtn").onclick=kitchen;
}
function craftBoatDrink(id){
  const s=ownState||state,recipe=BOAT_DRINK_BY_ID[id];if(!recipe)return;
  if(!canCraftBoatDrink(recipe,s)){message("วัตถุดิบไม่ครบ",`ยังไม่สามารถคราฟ ${recipe.name} ได้`);return}
  Object.entries(recipe.need).forEach(([key,count])=>s.bag[key]-=count);s.animalProducts.milk-=recipe.milk;s.merit-=recipe.meritCost;
  const success=Math.random()*100<recipe.chance;
  if(success){ensureBoatState(s);s.boatDrinks[id]+=1;s.merit+=recipe.meritReward;incrementMissionOn(s,"craftFood",1);save();updateMeritUI();$("modalContent").innerHTML=`<section class="feature-panel craft-success-panel boat-craft-success"><h2>🩷 คราฟสำเร็จ!</h2><img src="${recipe.image}" alt="${recipe.name}"><h3>${recipe.name}</h3><p>เครื่องดื่มนักพาย +1<br>ได้รับ +${recipe.meritReward} กุศล</p></section>`}
  else{save();updateMeritUI();$("modalContent").innerHTML=`<section class="feature-panel craft-success-panel boat-craft-success"><h2>💨 คราฟไม่สำเร็จ</h2><img src="${recipe.image}" alt="${recipe.name}"><h3>${recipe.name}</h3><p>วัตถุดิบ นม และกุศลที่ใช้ครั้งนี้สูญเปล่าแล้ว</p></section>`}
}

/* กระเป๋าเพิ่มหมวดเสบียงเรือ */
function inventory(tab="crops"){
  if(guardResting())return;const s=ownState||state;ensureBoatState(s);const dishMap=dishCounts();
  const tabs=[["crops","🌱 พืชพรรณ"],["products","🐾 ผลผลิตสัตว์"],["food","🍲 อาหาร"],["boatDrinks","🩷 เสบียงเรือ"],["specials","🕯️ ของพิเศษ"],["specialAnimals","🪼 สัตว์พิเศษ"],["mysteryBoxes","🎲 กล่องสุ่ม"]];let body="";
  if(tab==="crops")body=Object.entries(CROPS).map(([k,c])=>`<div class="inventory-item"><img src="${c.readyImg}" alt="${c.name}"><span>${c.name}</span><b>×${s.bag[k]||0}</b></div>`).join("");
  else if(tab==="products")body=Object.entries(ANIMAL_PRODUCTS).map(([k,p])=>`<div class="inventory-item"><img src="${p.image}" alt="${p.name}"><span>${p.name}</span><b>×${s.animalProducts[k]||0}</b></div>`).join("");
  else if(tab==="food")body=RECIPES.map(r=>`<div class="inventory-item"><img src="${r.image}" alt="${r.name}"><span>${r.name}</span><b>×${dishMap[r.id]||0}</b></div>`).join("");
  else if(tab==="boatDrinks")body=BOAT_SUPPLY_DRINKS.map(r=>`<div class="inventory-item boat-drink-inventory"><img src="${r.image}" alt="${r.name}"><span>${r.name}<small style="display:block">ใช้เติมเรือเท่านั้น</small></span><b>×${s.boatDrinks[r.id]||0}</b></div>`).join("");
  else if(tab==="specialAnimals")body=Object.entries(JELLYFISH_TYPES).map(([k,j])=>`<div class="inventory-item"><img src="${j.image}" alt="${j.name}"><span>${j.name}<small style="display:block">ยังไม่เริ่มนับอายุจนกว่าจะวางลงบ่อ</small></span><b>×${s.specialAnimals[k]||0}</b></div>`).join("");
  else if(tab==="mysteryBoxes")body=`<div class="inventory-item special-coconut-item"><img src="${JELLY_BOX.image}" alt="${JELLY_BOX.name}"><span>${JELLY_BOX.name}<small style="display:block">กดใช้งานเพื่อเปิดกล่องและสุ่มรางวัล</small></span><b>×${s.mysteryBoxes||0}</b>${(Number(s.mysteryBoxes)||0)>0?'<button type="button" id="useJellyBoxBtn">ใช้งาน</button>':""}</div>`;
  else body=Object.entries(SPECIAL_ITEMS).map(([k,item])=>{const desc=item.kind==="animal"?`เร่งผลผลิตสัตว์ ${item.boost}%`:item.kind==="crop"?`เร่งโตพืช ${item.boost}%`:(item.description||"");return `<div class="inventory-item special-coconut-item"><img src="${item.image}" alt="${item.name}"><span>${item.name}<small style="display:block">${desc}</small></span><b>×${s.specials[k]||0}</b></div>`}).join("");
  $("modalContent").innerHTML=`<section class="feature-panel inventory-panel"><h2>🎒 กระเป๋าผี</h2><div class="inventory-tabs inventory-tabs-v2">${tabs.map(([k,label])=>`<button type="button" data-inventory-tab="${k}" class="${k===tab?"active":""}">${label}</button>`).join("")}</div><div class="inventory-grid">${body}</div></section>`;
  document.querySelectorAll("[data-inventory-tab]").forEach(b=>b.onclick=()=>inventory(b.dataset.inventoryTab));if($("useJellyBoxBtn"))$("useJellyBoxBtn").onclick=showJellyBoxUse;openModal();
}

/* เทศกาลเรือพาย shared Firestore */
function emptyBoatRace(seasonId=1){return{boat1Progress:0,boat2Progress:0,boat3Progress:0,target:BOAT_TARGET,winner:null,seasonLocked:false,cooldowns:{},seasonId:Math.max(1,Number(seasonId)||1)}}
function normalizeBoatRace(data){
  const target=BOAT_TARGET,p=data&&typeof data==="object"?data:{};
  const winner=[1,2,3].includes(Number(p.winner))?Number(p.winner):null;
  return{
    boat1Progress:Math.max(0,Math.min(target,Number(p.boat1Progress)||0)),
    boat2Progress:Math.max(0,Math.min(target,Number(p.boat2Progress)||0)),
    boat3Progress:Math.max(0,Math.min(target,Number(p.boat3Progress)||0)),
    target,winner,seasonLocked:Boolean(p.seasonLocked||winner),
    cooldowns:p.cooldowns&&typeof p.cooldowns==="object"?p.cooldowns:{},
    seasonId:Math.max(1,Number(p.seasonId)||1)
  };
}
function boatProgressKey(boatNo){return `boat${boatNo}Progress`}
function boatCooldownKey(boatNo){return `boat${boatNo}`}
function boatCooldownRemaining(race,boatNo,memberKey=currentMemberKey){
  const value=race?.cooldowns?.[memberKey]?.[boatCooldownKey(boatNo)];
  return Math.max(0,(timestampMillis(value)+BOAT_COOLDOWN_MS)-gameNow());
}
function boatRewardRoll(){
  const r=Math.random();if(r<.50)return 0;if(r<.75)return 1;if(r<.92)return 2;return 3;
}
function boatRewardMessage(n){return n===0?"+0 กุศล มู๊แง":n===1?"+1 กุศล พอมีวาสนาอยู่":n===2?"+2 กุศล ดวงดีน๊า วันนี้เจ๊":"+3 กุศล เริดเลยแหละ!"}
async function loadSharedBoatRace(){
  const {db,fs}=await getFirebaseContext(),ref=fs.doc(db,"shared","boatRace");
  let data=null;
  await fs.runTransaction(db,async tx=>{
    const snap=await tx.get(ref);
    if(snap.exists()){data=snap.data();return}
    const init=emptyBoatRace();
    tx.set(ref,{...init,updatedAt:fs.serverTimestamp()},{merge:false});
    data=init;
  });
  boatRaceCache=normalizeBoatRace(data);return boatRaceCache;
}
function stopBoatRaceSubscription(){if(boatRaceUnsubscribe){boatRaceUnsubscribe();boatRaceUnsubscribe=null}boatRaceCache=null}
function ensureBoatRaceSubscription(){
  if(boatRaceUnsubscribe||!cloudReady)return;
  getFirebaseContext().then(({db,fs})=>{
    boatRaceUnsubscribe=fs.onSnapshot(fs.doc(db,"shared","boatRace"),snap=>{if(!snap.exists())return;boatRaceCache=normalizeBoatRace(snap.data());if(currentScene==="boatRace")drawBoatRace(boatRaceCache)},error=>console.warn("boat race listener",error));
  }).catch(()=>{});
}
function boatTopPercent(progress){return 77-(Math.max(0,Math.min(BOAT_TARGET,progress))/BOAT_TARGET)*58}
function drawBoatRace(race){
  const s=ownState||state;ensureBoatState(s);const winner=race.winner;
  const lanes=[1,2,3].map((boatNo,i)=>{
    const progress=Number(race[boatProgressKey(boatNo)])||0,remaining=boatCooldownRemaining(race,boatNo),left=[18,50,82][i],disabled=race.seasonLocked||remaining>0;
    return `<div class="boat-lane" style="left:${left}%"><div class="boat-lane-progress">${progress}/${race.target}</div><button class="boat-racer ${winner===boatNo?"winner":""}" type="button" data-boat-supply="${boatNo}" style="top:${boatTopPercent(progress)}%" ${disabled?"disabled":""}><img src="boat-race-${boatNo}.png?v=1" alt="เรือ ${boatNo}"><small>${race.seasonLocked?(winner===boatNo?"ผู้ชนะ 🏁":"ซีซั่นจบแล้ว"):remaining>0?`รอ ${formatHM(remaining)}`:"ส่งเสบียง"}</small></button></div>`;
  }).join("");
  $("sceneInteractiveLayer").innerHTML=`<div class="boat-finish-label">🏁 เส้นชัย • 200</div><div class="boat-progress-marks"><span style="top:62%">50</span><span style="top:48%">100</span><span style="top:33%">150</span><span style="top:18%">200</span></div>${lanes}${race.seasonLocked?`<div class="boat-season-result"><b>ซีซั่นนี้มีผู้ชนะแล้ว</b><span>ขออนุญาตสมน้ำหน้ากับผู้แพ้ทั้งสองทีม<br>อีกไกลเลย สู้ต่อหน่อยนะ ซีซั่นหน้า</span></div>`:""}${currentMember==="Aida"?'<button id="resetBoatRaceBtn" class="boat-reset-button" type="button">🔄 รีเซ็ตการแข่งขัน</button>':""}`;
  document.querySelectorAll("[data-boat-supply]").forEach(btn=>btn.onclick=()=>showBoatSupplyPicker(Number(btn.dataset.boatSupply)));
  if($("resetBoatRaceBtn"))$("resetBoatRaceBtn").onclick=resetBoatRace;
}
async function renderBoatRaceScene(){
  setSceneNav({backText:"กลับไปที่บ่อแมงกะพรุน",backAction:()=>openScene("jellyfish"),nextText:"กลับไปที่แปลง",nextAction:returnToFarm});
  if(!cloudReady){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">กำลังเชื่อมการแข่งขันเรือ...</div>';return}
  try{
    const race=await loadSharedBoatRace();drawBoatRace(race);ensureBoatRaceSubscription();stopSceneTimer();
    sceneTimer=setInterval(()=>{if(currentScene!=="boatRace"){stopSceneTimer();return}if(boatRaceCache)drawBoatRace(boatRaceCache)},1000);
  }catch(error){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">โหลดการแข่งขันเรือไม่สำเร็จ</div>'}
}
function showBoatSupplyPicker(boatNo){
  const race=boatRaceCache;if(!race)return;if(race.seasonLocked){message("ซีซั่นจบแล้ว","ซีซั่นนี้มีผู้ชนะแล้ว รอ Aida เปิดซีซั่นใหม่");return}
  const rem=boatCooldownRemaining(race,boatNo);if(rem>0){message("เรือลำนี้ยังพักอยู่",`ส่งเรือ ${boatNo} ได้อีกใน ${formatHM(rem)} แต่คุณยังส่งเรือลำอื่นได้ทันที`);return}
  const s=ownState||state;ensureBoatState(s);const available=BOAT_SUPPLY_DRINKS.filter(item=>(Number(s.boatDrinks[item.id])||0)>0);
  if(!available.length){message("ไม่มีเสบียงเรือ","ต้องคราฟเครื่องดื่มนักพาย 6 เมนูในหน้า Craft ก่อน");return}
  $("modalContent").innerHTML=`<section class="feature-panel boat-supply-picker"><h2>🚣 ส่งเสบียงให้เรือ ${boatNo}</h2><p class="feature-subtitle">เลือกเครื่องดื่ม 1 ชิ้น • สำเร็จ = เรือ +1</p><div class="boat-supply-grid">${available.map(item=>`<button type="button" data-send-boat-drink="${item.id}"><img src="${item.image}" alt="${item.name}"><b>${item.name}</b><small>มี ×${s.boatDrinks[item.id]}</small></button>`).join("")}</div></section>`;
  document.querySelectorAll("[data-send-boat-drink]").forEach(btn=>btn.onclick=()=>sendBoatSupply(boatNo,btn.dataset.sendBoatDrink));openModal();
}
async function sendBoatSupply(boatNo,drinkId){
  const drink=BOAT_DRINK_BY_ID[drinkId];if(!drink||![1,2,3].includes(boatNo))return;
  const meritReward=boatRewardRoll();
  try{
    const {db,fs}=await getFirebaseContext(),raceRef=fs.doc(db,"shared","boatRace"),saveRef=fs.doc(db,"saves",currentMemberKey);let nextState=null,winner=null;
    await fs.runTransaction(db,async tx=>{
      const [raceSnap,saveSnap]=await Promise.all([tx.get(raceRef),tx.get(saveRef)]);if(!raceSnap.exists()||!saveSnap.exists())throw new Error("ข้อมูลการแข่งขันยังไม่พร้อม");
      const race=normalizeBoatRace(raceSnap.data()),s=normalizeState(saveSnap.data(),currentMember);ensureBoatState(s);
      if(race.seasonLocked||race.winner)throw new Error("ซีซั่นนี้มีผู้ชนะแล้ว");
      const last=timestampMillis(race.cooldowns?.[currentMemberKey]?.[boatCooldownKey(boatNo)]);
      const rem=Math.max(0,last+BOAT_COOLDOWN_MS-gameNow());if(rem>0)throw new Error(`เรือ ${boatNo} ต้องรออีก ${formatHM(rem)}`);
      if((Number(s.boatDrinks[drinkId])||0)<1)throw new Error("เครื่องดื่มนี้หมดแล้ว");
      s.boatDrinks[drinkId]-=1;s.merit=(Number(s.merit)||0)+meritReward;incrementMissionOn(s,"boatSupply",1);
      const progressKey=boatProgressKey(boatNo);race[progressKey]=Math.min(race.target,(Number(race[progressKey])||0)+1);
      const cooldowns={...(raceSnap.data().cooldowns||{})},mine={...(cooldowns[currentMemberKey]||{})};mine[boatCooldownKey(boatNo)]=fs.serverTimestamp();cooldowns[currentMemberKey]=mine;
      if(race[progressKey]>=race.target){race.winner=boatNo;race.seasonLocked=true;winner=boatNo}
      nextState=s;
      tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(raceRef,{boat1Progress:race.boat1Progress,boat2Progress:race.boat2Progress,boat3Progress:race.boat3Progress,target:race.target,winner:race.winner,seasonLocked:race.seasonLocked,cooldowns,seasonId:race.seasonId,updatedAt:fs.serverTimestamp()},{merge:false});
    });
    ownState=normalizeState(nextState,currentMember);state=ownState;updateMeritUI();closeModal();
    try{await loadSharedBoatRace();drawBoatRace(boatRaceCache)}catch{}
    message(winner?`🏁 เรือ ${winner} ชนะแล้ว!`:`🚣 ส่งเสบียงเรือ ${boatNo} สำเร็จ`,`${drink.name} ถูกใช้ ×1<br>${boatRewardMessage(meritReward)}${winner?"<br><br>ซีซั่นถูกล็อกทันที":""}`);
  }catch(error){message("ส่งเสบียงไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function resetBoatRace(){
  if(currentMember!=="Aida"){message("ไม่มีสิทธิ์","ปุ่มนี้ใช้ได้เฉพาะ Aida");return}
  const ok=window.confirm("ยืนยันที่จะรีเซ็ตการแข่งขันกลับไปเริ่มต้นใหม่หรือไม่?");
  if(!ok)return;
  try{
    const {db,fs}=await getFirebaseContext(),ref=fs.doc(db,"shared","boatRace");let next;
    await fs.runTransaction(db,async tx=>{
      const snap=await tx.get(ref),old=normalizeBoatRace(snap.exists()?snap.data():null);next=emptyBoatRace(old.seasonId+1);tx.set(ref,{...next,updatedAt:fs.serverTimestamp()},{merge:false});
    });
    boatRaceCache=next;drawBoatRace(next);showWeatherToast("🏁 รีเซ็ตการแข่งขันแล้ว • เริ่มซีซั่นใหม่ 0/200");
  }catch(error){message("รีเซ็ตการแข่งขันไม่ได้",error.message||"กรุณาลองใหม่")}
}

/* Scene router final */
function openScene(sceneName){
  if(!SCENES[sceneName])return;
  if(currentScene==="jellyfish"&&sceneName!=="jellyfish")stopJellyPondSubscription();
  if(currentScene==="boatRace"&&sceneName!=="boatRace")stopBoatRaceSubscription();
  currentScene=sceneName;stopSceneTimer();$("gameScreen").classList.add("hidden");$("sceneScreen").classList.remove("hidden");$("sceneScreen").dataset.scene=sceneName;$("sceneScreen").style.backgroundImage=`url("${SCENES[sceneName].image}")`;renderScene();
}
function returnToFarm(){
  if(currentScene==="jellyfish")stopJellyPondSubscription();
  if(currentScene==="boatRace")stopBoatRaceSubscription();
  stopSceneTimer();currentScene=null;closeModal();$("sceneScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");
}
function renderScene(){
  if(currentScene==="house"){renderHouseScene();return}
  if(currentScene==="underwater"){renderUnderwaterScene();return}
  if(currentScene==="almsSeated"||currentScene==="almsBlessing"){renderAlmsScene();return}
  if(currentScene==="coconut"){renderCoconutScene();return}
  if(currentScene==="panda"){renderPandaScene();return}
  if(currentScene==="jellyfish"){renderJellyfishScene();return}
  if(currentScene==="boatRace"){renderBoatRaceScene();return}
  renderAnimalScene(currentScene);
}

/* Admin bundle: รายบุคคลรวม Aida + ส่งทุกคนหลายรายการ */
function adminGiftCatalog(){
  return[
    {type:"merit",key:"merit",name:"คะแนนกุศล"},
    ...SHOP_ITEMS.map(item=>({type:"animal",key:item.id,name:item.name})),
    {type:"mystery",key:"jellyfishBox",name:JELLY_BOX.name},
    ...Object.entries(CROPS).map(([key,item])=>({type:"crop",key,name:item.name})),
    ...Object.entries(ANIMAL_PRODUCTS).map(([key,item])=>({type:"product",key,name:item.name})),
    ...RECIPES.map(r=>({type:"dish",key:r.id,name:r.name})),
    ...BOAT_SUPPLY_DRINKS.map(r=>({type:"boatDrink",key:r.id,name:r.name})),
    ...Object.entries(SPECIAL_ITEMS).map(([key,item])=>({type:"special",key,name:item.name})),
    ...Object.entries(JELLYFISH_TYPES).map(([key,item])=>({type:"jelly",key,name:item.name}))
  ];
}
function addGiftItemToState(s,gift){
  ensureBoatState(s);
  if(Array.isArray(gift?.items)){gift.items.forEach(item=>addGiftItemToState(s,{itemType:item.type,itemKey:item.key,qty:item.qty}));return}
  const qty=Math.max(1,Math.floor(Number(gift.qty)||1)),type=gift.itemType||gift.type,key=gift.itemKey||gift.key;
  if(type==="product")s.animalProducts[key]=(Number(s.animalProducts[key])||0)+qty;
  else if(type==="crop")s.bag[key]=(Number(s.bag[key])||0)+qty;
  else if(type==="special")s.specials[key]=(Number(s.specials[key])||0)+qty;
  else if(type==="jelly")s.specialAnimals[key]=(Number(s.specialAnimals[key])||0)+qty;
  else if(type==="dish"){if(!recipeById(key))throw new Error("ไม่พบเมนูอาหาร");addDishToState(s,key,qty)}
  else if(type==="boatDrink"){if(!BOAT_DRINK_BY_ID[key])throw new Error("ไม่พบเครื่องดื่มนักพาย");s.boatDrinks[key]=(Number(s.boatDrinks[key])||0)+qty}
  else if(type==="merit")s.merit=(Number(s.merit)||0)+qty;
  else if(type==="animal"){if(!animalById(key))throw new Error("ไม่พบสัตว์");s.pendingAnimals[key]=(Number(s.pendingAnimals[key])||0)+qty}
  else if(type==="mystery")s.mysteryBoxes=(Number(s.mysteryBoxes)||0)+qty;
  else throw new Error("ประเภทของขวัญไม่รองรับ");
}
function adminBundleRows(catalog,prefix="admin-bundle"){
  return catalog.map((entry,index)=>`<label class="gift-item-option admin-bundle-row"><input type="checkbox" data-${prefix}-check="${index}"><span>${safeHtml(entry.name)}</span><input type="number" min="1" max="9999" value="1" data-${prefix}-qty="${index}"></label>`).join("");
}
function selectedAdminBundle(catalog,prefix){
  const items=[];
  document.querySelectorAll(`[data-${prefix}-check]`).forEach(check=>{
    if(!check.checked)return;const index=Number(check.getAttribute(`data-${prefix}-check`)),entry=catalog[index];if(!entry)return;
    const qtyInput=document.querySelector(`[data-${prefix}-qty="${index}"]`),qty=Math.max(1,Math.min(9999,Math.floor(Number(qtyInput?.value)||1)));
    items.push({type:entry.type,key:entry.key,name:entry.name,qty});
  });
  return items;
}
async function showAdminCenter(){
  if(adminProfile?.role!=="admin"){message("ไม่มีสิทธิ์","เมนูนี้เปิดเฉพาะ Aida/Admin");return}
  try{
    ensureAdminStock(ownState||state);
    const {db,fs}=await getFirebaseContext(),snap=await fs.getDocs(fs.query(fs.collection(db,"purchaseRequests"),fs.where("status","==","pending"))),requests=[];snap.forEach(d=>requests.push({id:d.id,...d.data()}));requests.sort((a,b)=>timestampMillis(b.createdAt)-timestampMillis(a.createdAt));
    const catalog=adminGiftCatalog(),targets=Object.keys(MEMBERS);
    $("modalContent").innerHTML=`<section class="feature-panel admin-panel"><h2>🛡️ ศูนย์แอดมิน Aida</h2><p class="feature-subtitle">Aida สต๊อก/กุศล 9999 • ไม่มี daily gift limit • อนุมัติคำขอ = เปลี่ยนสถานะ + แจ้งเตือนเท่านั้น</p><div class="admin-section"><h3>คำขอซื้อที่รออนุมัติ (${requests.length})</h3><div class="admin-request-list">${requests.length?requests.map(r=>{const q=Math.max(1,Number(r.qty)||1),total=(Number(r.price)||0)*q;return `<div class="admin-request-card"><b>${safeHtml(r.memberName)} • ${safeHtml(r.itemName)} ×${q}</b><span>${total}⭐️ รวม • ${r.category==="animal"?"สัตว์":r.category==="mystery"?"กล่องสุ่ม":"ของพิเศษ"}</span><small>${bangkokTimeText(r.createdAt)} น.</small><div><button type="button" data-admin-approve="${r.id}">อนุมัติ</button><button type="button" data-admin-reject="${r.id}">ไม่อนุมัติ</button></div></div>`}).join(""):'<p class="empty-feature">ไม่มีคำขอค้าง</p>'}</div></div><div class="admin-section"><h3>🎁 ส่งรายบุคคล — หลายรายการในกล่องเดียว</h3><select id="adminBundleTarget">${targets.map(name=>`<option value="${memberKeyFromName(name)}">${safeHtml(name)}${name==="Aida"?" (ตัวเอง)":""}</option>`).join("")}</select><div class="gift-item-list">${adminBundleRows(catalog,"admin-bundle")}</div><button id="adminSendBundleBtn" class="primary-spooky-action" type="button">ส่งกล่องนี้</button></div><div class="admin-section"><h3>🎁 ส่งให้ทุกคน — หลายรายการครั้งเดียว</h3><label class="admin-include-aida"><input id="adminIncludeAida" type="checkbox"> รวม Aida ด้วย</label><div class="gift-item-list">${adminBundleRows(catalog,"admin-global")}</div><button id="adminSendGlobalBundleBtn" class="primary-spooky-action" type="button">ส่งชุดนี้ให้ทุกคน</button></div><div class="admin-section"><h3>ส่งแจ้งเตือนจากยัยหนู</h3><input id="adminNoticeTitle" type="text" placeholder="หัวข้อ" maxlength="80"><textarea id="adminNoticeBody" placeholder="ข้อความที่ต้องการส่ง" maxlength="500"></textarea><button id="adminSendNoticeBtn" type="button">ส่งให้ทุกคน</button></div><div class="admin-section"><h3>⚠️ รีเซ็ตสัตว์และแมงกะพรุนสมาชิก</h3><p class="feature-subtitle">ไม่แตะกุศล พืช อาหาร ผลผลิตสัตว์ หรือของพิเศษอื่น • Aida ไม่โดนรีเซ็ต</p><button id="adminResetAnimalsBtn" class="danger-action" type="button">รีเซ็ตสัตว์และแมงกะพรุนทั้งหมด</button></div></section>`;
    document.querySelectorAll("[data-admin-approve]").forEach(btn=>btn.onclick=()=>resolvePurchaseRequest(btn.dataset.adminApprove,true));
    document.querySelectorAll("[data-admin-reject]").forEach(btn=>btn.onclick=()=>resolvePurchaseRequest(btn.dataset.adminReject,false));
    $("adminSendNoticeBtn").onclick=sendAdminNotice;
    $("adminSendBundleBtn").onclick=()=>sendAdminBundleGift(catalog);
    $("adminSendGlobalBundleBtn").onclick=()=>sendAdminGlobalBundleGift(catalog);
    $("adminResetAnimalsBtn").onclick=resetAllMemberAnimalsAndJellyfish;openModal();
  }catch(error){message("เปิดศูนย์แอดมินไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function sendAdminBundleGift(catalog){
  if(adminProfile?.role!=="admin")return;
  const targetSelect=$("adminBundleTarget"),targetKey=targetSelect?.value||"",targetName=targetSelect?.options?.[targetSelect.selectedIndex]?.textContent?.replace(" (ตัวเอง)","")||targetKey,items=selectedAdminBundle(catalog,"admin-bundle");
  if(!targetKey){message("ยังส่งไม่ได้","กรุณาเลือกสมาชิก");return}
  if(!items.length){message("ยังส่งไม่ได้","กรุณาติ๊กของอย่างน้อย 1 รายการ");return}
  try{
    const {db,fs}=await getFirebaseContext(),giftRef=fs.doc(fs.collection(db,"gifts")),mailRef=fs.doc(db,"mailboxes",targetKey,"items",giftRef.id),summary=items.map(i=>`${i.name} ×${i.qty}`).join(" • "),batch=fs.writeBatch(db);
    batch.set(giftRef,{fromKey:"aida",fromName:"Aida",toKey:targetKey,toName:targetName,bundle:true,items:items.map(i=>({type:i.type,key:i.key,name:i.name,qty:i.qty})),status:"pending",createdAt:fs.serverTimestamp()});
    batch.set(mailRef,{source:"yainoo",type:"gift",giftId:giftRef.id,fromKey:"aida",fromName:"Aida",title:"ยัยหนูส่งกล่องของขวัญให้คุณ 🎁",text:summary,read:false,createdAt:fs.serverTimestamp()});
    await batch.commit();showWeatherToast(`🎁 ส่งกล่องให้ ${targetName} แล้ว`);showAdminCenter();
  }catch(error){message("ส่งของไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function sendAdminGlobalBundleGift(catalog){
  if(adminProfile?.role!=="admin")return;
  const items=selectedAdminBundle(catalog,"admin-global"),includeAida=Boolean($("adminIncludeAida")?.checked);
  if(!items.length){message("ยังส่งไม่ได้","กรุณาติ๊กของอย่างน้อย 1 รายการ");return}
  try{
    const {db,fs}=await getFirebaseContext(),summary=items.map(i=>`${i.name} ×${i.qty}`).join(" • ");
    await fs.addDoc(fs.collection(db,"broadcasts"),{type:"gift",bundle:true,items:items.map(i=>({type:i.type,key:i.key,name:i.name,qty:i.qty})),title:"🎁 ของขวัญจากยัยหนู",body:summary,includeAida,from:"Aida",createdAt:fs.serverTimestamp()});
    showWeatherToast(`🎁 ส่งชุดของขวัญให้ทุกคนแล้ว${includeAida?" • รวม Aida":""}`);showAdminCenter();
  }catch(error){message("ส่งของขวัญไม่สำเร็จ",error.message||"กรุณาลองใหม่")}
}
async function claimBroadcastGift(broadcastId,accept){
  try{
    await settlePendingCloudSave();
    const {db,fs}=await getFirebaseContext(),broadcastRef=fs.doc(db,"broadcasts",broadcastId),claimRef=fs.doc(db,"broadcasts",broadcastId,"claims",currentMemberKey),saveRef=fs.doc(db,"saves",currentMemberKey);let next;
    await fs.runTransaction(db,async tx=>{
      const [bSnap,cSnap,sSnap]=await Promise.all([tx.get(broadcastRef),tx.get(claimRef),tx.get(saveRef)]);if(!bSnap.exists()||!sSnap.exists())throw new Error("ไม่พบของขวัญจากยัยหนู");if(cSnap.exists())throw new Error("คุณจัดการของขวัญนี้แล้ว");
      const b=bSnap.data();if(b.type!=="gift")throw new Error("รายการนี้ไม่ใช่ของขวัญ");if(currentMember==="Aida"&&b.includeAida===false)throw new Error("ของขวัญรอบนี้ไม่ได้รวม Aida");
      const s=normalizeState(sSnap.data(),currentMember);if(accept){if(Array.isArray(b.items))addGiftItemToState(s,{items:b.items});else addGiftItemToState(s,{itemType:b.itemType,itemKey:b.itemKey,qty:b.qty})}next=s;
      tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});tx.set(claimRef,{memberKey:currentMemberKey,status:accept?"accepted":"discarded",resolvedAt:fs.serverTimestamp()});
    });
    ownState=normalizeState(next,currentMember);if(!visitContext)state=ownState;saveLocalOnly(ownState);updateMeritUI();broadcastClaimCache.set(broadcastClaimCacheKey(broadcastId),{memberKey:currentMemberKey,status:accept?"accepted":"discarded"});showNotifications("yainoo");showWeatherToast(accept?"🎁 รับของขวัญจากยัยหนูแล้ว":"🗑️ ทิ้งของขวัญแล้ว");
  }catch(error){message("จัดการของขวัญไม่ได้",error.message||"กรุณาลองใหม่")}
}
async function showNotifications(tab="friend"){
  if(!cloudReady){message("การแจ้งเตือนยังไม่พร้อม","กรุณาเชื่อม Firebase ก่อน");return}
  try{
    const mail=await fetchMailboxItems();
    const friendItems=mail.filter(x=>x.source==="friend"),yainooItems=mail.filter(x=>x.source==="yainoo");
    const mailboxCard=(item,returnTab)=>`<div class="notification-card ${item.read?"":"unread"}"><b>${safeHtml(item.title||"แจ้งเตือน")}</b>${item.text?`<span>${safeHtml(item.text)}</span>`:""}<small>${bangkokTimeText(item.createdAt)} น.</small>${item.type==="gift"?`<div class="notification-actions">${item.resolved?`<button disabled>${item.status==="claimed"?"รับแล้ว":"ทิ้งแล้ว"}</button>`:`<button type="button" data-claim-gift="${item.giftId||item.id}" data-gift-action="accept" data-return-tab="${returnTab}">รับของขวัญ</button><button type="button" data-claim-gift="${item.giftId||item.id}" data-gift-action="discard" data-return-tab="${returnTab}">ทิ้ง</button>`}</div>`:""}</div>`;
    let body="";
    if(tab==="friend"){
      body=friendItems.length?friendItems.map(item=>mailboxCard(item,"friend")).join(""):'<p class="empty-feature">ยังไม่มีแจ้งเตือนจากเพื่อน</p>';
      await markMailboxRead(friendItems);
    }else{
      const broadcasts=await fetchBroadcasts();
      // เดิมอ่าน claim ทีละรายการ (สูงสุด 50 round-trips) — เปลี่ยนเป็น parallel + cache
      const claims=await Promise.all(broadcasts.map(b=>b.type==="gift"?fetchBroadcastClaimCached(b.id):Promise.resolve(null)));
      const broadcastCards=broadcasts.map((b,i)=>{
        const claim=claims[i],isExcludedAida=currentMember==="Aida"&&b.type==="gift"&&b.includeAida===false;
        const giftSummary=Array.isArray(b.items)?b.items.map(item=>`${item.name||item.key} ×${Number(item.qty)||1}`).join(" • "):(b.type==="gift"?`${b.itemName||"ของขวัญ"} ×${Number(b.qty)||1}`:"");
        return `<div class="notification-card"><b>${safeHtml(b.title||"ข้อความจากยัยหนู")}</b>${b.body?`<span>${safeHtml(b.body)}</span>`:""}${b.type==="gift"&&giftSummary?`<span>🎁 ${safeHtml(giftSummary)}</span>`:""}${b.type==="gift"?`<div class="notification-actions">${isExcludedAida?'<button disabled>รอบนี้ไม่รวม Aida</button>':claim?`<button disabled>${claim.status==="accepted"?"รับแล้ว":"ทิ้งแล้ว"}</button>`:`<button type="button" data-claim-broadcast="${b.id}" data-broadcast-action="accept">รับของขวัญ</button><button type="button" data-claim-broadcast="${b.id}" data-broadcast-action="discard">ทิ้ง</button>`}</div>`:""}<small>${bangkokTimeText(b.createdAt)} น.</small></div>`;
      });
      body=[...yainooItems.map(item=>mailboxCard(item,"yainoo")),...broadcastCards].join("")||'<p class="empty-feature">ยังไม่มีแจ้งเตือนจากยัยหนู</p>';
      await markMailboxRead(yainooItems);
      const s=ownState||state;if(s){s.lastSeenYainooAt=gameNow();saveLocalOnly(s)}
    }
    $("modalContent").innerHTML=`<section class="feature-panel notification-panel"><h2>🔔 การแจ้งเตือน</h2><div class="notification-tabs"><button type="button" data-notification-tab="friend" class="${tab==="friend"?"active":""}">👥 จากเพื่อน</button><button type="button" data-notification-tab="yainoo" class="${tab==="yainoo"?"active":""}">👑 จากยัยหนู</button></div>${currentMember==="Aida"&&adminProfile?.role==="admin"?'<button id="adminCenterBtn" class="admin-center-entry" type="button">🛡️ ศูนย์แอดมิน</button>':""}<div class="notification-list">${body}</div></section>`;
    document.querySelectorAll("[data-notification-tab]").forEach(btn=>btn.onclick=()=>showNotifications(btn.dataset.notificationTab));
    document.querySelectorAll("[data-claim-gift]").forEach(btn=>btn.onclick=()=>{btn.disabled=true;btn.textContent="กำลังจัดการ...";claimFriendGift(btn.dataset.claimGift,btn.dataset.giftAction==="accept",btn.dataset.returnTab||"friend").catch(()=>{})});
    document.querySelectorAll("[data-claim-broadcast]").forEach(btn=>btn.onclick=()=>{btn.disabled=true;btn.textContent="กำลังจัดการ...";claimBroadcastGift(btn.dataset.claimBroadcast,btn.dataset.broadcastAction==="accept").catch(()=>{})});
    if($("adminCenterBtn"))$("adminCenterBtn").onclick=showAdminCenter;openModal();refreshNotificationBadge();
  }catch(error){message("เปิดการแจ้งเตือนไม่ได้",error.message||"กรุณาลองใหม่")}
}

/* ข้อความอนุมัติคำขอ: ไม่แจกของอัตโนมัติ */
async function resolvePurchaseRequest(requestId,approve){
  try{
    const {db,fs}=await getFirebaseContext(),requestRef=fs.doc(db,"purchaseRequests",requestId),noticeId=`purchase-${requestId}`;let memberKey="",memberName="",itemName="",qty=1;
    await fs.runTransaction(db,async tx=>{
      const reqSnap=await tx.get(requestRef);if(!reqSnap.exists())throw new Error("ไม่พบคำขอ");const req=reqSnap.data();if(req.status!=="pending")throw new Error("คำขอนี้ถูกจัดการแล้ว");
      memberKey=req.memberKey;memberName=req.memberName;itemName=req.itemName||"รายการ";qty=Math.max(1,Number(req.qty)||1);
      let saveChanged=false,saveRef=null,s=null;
      if(req.category==="animal"||(!approve&&(req.category==="special"||req.category==="mystery"))){
        saveRef=fs.doc(db,"saves",memberKey);const saveSnap=await tx.get(saveRef);
        if(saveSnap.exists()){
          s=normalizeState(saveSnap.data(),memberName);
          if(req.category==="animal"){s.purchasePendingCounts[req.itemKey]=Math.max(0,(Number(s.purchasePendingCounts[req.itemKey])||0)-qty);saveChanged=true}
          else if(!approve&&req.dateKey===currentBangkokDateKey()){ensureDailyLimitsFor(s);if(req.category==="special"){s.dailyLimits.specialPurchases=Math.max(0,(Number(s.dailyLimits.specialPurchases)||0)-qty);saveChanged=true}else if(req.category==="mystery"){s.dailyLimits.jellyBoxes=Math.max(0,(Number(s.dailyLimits.jellyBoxes)||0)-qty);saveChanged=true}}
        }
      }
      if(saveChanged&&saveRef&&s)tx.set(saveRef,{...cloneData(s),updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(requestRef,{status:approve?"approved":"rejected",resolvedAt:fs.serverTimestamp(),resolvedBy:"Aida"},{merge:true});
      tx.set(fs.doc(db,"mailboxes",memberKey,"items",noticeId),{source:"yainoo",type:"purchase",title:approve?`ยัยหนูอนุมัติ ${itemName} ×${qty} แล้ว ✅`:`ยัยหนูไม่อนุมัติ ${itemName}`,text:approve?"คำขอร้องถูกอนุมัติแล้ว รอยัยหนูส่งของขวัญให้นะ อย่าลืมเช็กที่กล่องของขวัญแล้วกดรับด้วย":"คำขอนี้ถูกปฏิเสธ",read:false,createdAt:fs.serverTimestamp()});
    });
    showWeatherToast(approve?`✅ อนุมัติ ${memberName} แล้ว • ยังไม่ได้แจกของ`:`❌ ปฏิเสธคำขอแล้ว`);showAdminCenter();refreshNotificationBadge();
  }catch(error){message("จัดการคำขอไม่ได้",error.message||"กรุณาลองใหม่")}
}

/* ======================================================================
   PERFORMANCE HOTFIX — 2026-08-10
   Gift reliability / notification reads / planting taps / login / redraw
   ====================================================================== */

/* ======================================================================
   UPDATE V4 — 2026-08-09
   Fishing pond / plots 13–24 / coconut river / fast-hand bonus / save backup
   Additive migration only: do not reset existing bag, merit, animals or plots 1–12.
   ====================================================================== */

const FISHING_BAITS={
  bait1:{name:"เหยื่อตกปลาฝึกหัด",image:"fishing-bait-01.png?v=1",chance:75,durationMs:25*60*1000,needBag:{babyBamboo:8},needProducts:{},dishAny:0},
  bait2:{name:"เหยื่อตกปลาสมัครเล่น",image:"fishing-bait-02.png?v=1",chance:75,durationMs:16*60*1000,needBag:{babyBamboo:8},needProducts:{truffle:5,milk:5},dishAny:0},
  bait3:{name:"เหยื่อตกปลามืออาชีพ",image:"fishing-bait-03.png?v=1",chance:100,durationMs:8*60*1000,needBag:{babyBamboo:15,hauntedPlankton:5},needProducts:{milk:10},dishAny:0},
  bait4:{name:"เหยื่อตกปลามือโปร",image:"fishing-bait-04.png?v=1",chance:100,durationMs:3*60*1000,needBag:{babyBamboo:22,hauntedPlankton:3},needProducts:{milk:2},dishAny:4}
};
const FISHING_FISH={
  fish01:{name:"ปลาคาร์ฟวิญญาณ",image:"fishing-fish-01.png?v=1",tier:1,min:0.15,max:2.50},
  fish02:{name:"ปลาปักเป้าเด้าหน้า",image:"fishing-fish-02.png?v=1",tier:1,min:0.15,max:2.50},
  fish03:{name:"ปลาตะเกียงรัตติกาล",image:"fishing-fish-03.png?v=1",tier:1,min:0.15,max:2.50},
  fish04:{name:"ปลาพริ้วม่วงมายา",image:"fishing-fish-04.png?v=1",tier:1,min:0.15,max:2.50},
  fish05:{name:"ปลาหนามเพลิงชาด",image:"fishing-fish-05.png?v=1",tier:2,min:2.20,max:5.90},
  fish06:{name:"ปลาปักเป้าทองคำ",image:"fishing-fish-06.png?v=1",tier:2,min:2.20,max:5.90},
  fish07:{name:"ปลาดุกจันทร์ทมิฬ",image:"fishing-fish-07.png?v=1",tier:2,min:2.20,max:5.90},
  fish08:{name:"ปลาหงส์เพลิงวารี",image:"fishing-fish-08.png?v=1",tier:2,min:2.20,max:5.90},
  fish09:{name:"กระเบนศิลาพิฆาต",image:"fishing-fish-09.png?v=1",tier:3,min:7.50,max:14.00},
  fish10:{name:"กระเบนดาราพราย",image:"fishing-fish-10.png?v=1",tier:3,min:7.50,max:14.00},
  fish11:{name:"เนตรนาคา",image:"fishing-fish-11.png?v=1",tier:3,min:7.50,max:14.00},
  fish12:{name:"พญาวารีเกลียวคลื่น",image:"fishing-fish-12.png?v=1",tier:3,min:7.50,max:14.00}
};
const FISHING_CONFIG={
  bait1:{counts:[[1,.95],[2,.05]],tiers:[[1,.75],[2,.25]]},
  bait2:{counts:[[1,.80],[2,.18],[3,.02]],tiers:[[1,.60],[2,.40]]},
  bait3:{counts:[[1,.45],[2,.45],[3,.10]],tiers:[[1,.15],[2,.60],[3,.25]]},
  bait4:{counts:[[1,.25],[2,.50],[3,.25]],tiers:[[1,.05],[2,.50],[3,.45]]}
};
const FISHING_DOCK_POSITIONS=[[5,31,20,15],[5,50,20,15],[7,69,20,15],[75,31,20,15],[75,50,20,15],[73,69,20,15]];
const FISHING_CLAIM_MS=5*60*1000;
const NAGA_OFFERING_COOLDOWN_MS=2*60*60*1000;
const COCONUT_RIVER_COOLDOWN_MS=60*60*1000;
const COCONUT_RIVER_POSITIONS=[[31.5,67.5,11,7.5],[47.5,72.5,11,7.5],[30.5,79,11,7.5],[46.5,84,11,7.5]];
const COCONUT_RIVER_ITEMS={
  frog1:{kind:"frog",index:1,name:"กบสวนมะพร้าว 1",image:"coconut-river-frog-01.png?v=1"},
  frog2:{kind:"frog",index:2,name:"กบสวนมะพร้าว 2",image:"coconut-river-frog-02.png?v=1"},
  frog3:{kind:"frog",index:3,name:"กบสวนมะพร้าว 3",image:"coconut-river-frog-03.png?v=1"},
  frog4:{kind:"frog",index:4,name:"กบสวนมะพร้าว 4",image:"coconut-river-frog-04.png?v=1"},
  fish1:{kind:"fish",index:1,name:"ปลาสวนมะพร้าว 1",image:"coconut-river-fish-01.png?v=1"},
  fish2:{kind:"fish",index:2,name:"ปลาสวนมะพร้าว 2",image:"coconut-river-fish-02.png?v=1"},
  fish3:{kind:"fish",index:3,name:"ปลาสวนมะพร้าว 3",image:"coconut-river-fish-03.png?v=1"},
  fish4:{kind:"fish",index:4,name:"ปลาสวนมะพร้าว 4",image:"coconut-river-fish-04.png?v=1"}
};
const COCONUT_RIVER_KEYS=Object.keys(COCONUT_RIVER_ITEMS);
SCENES.underwater.image="naga-fishing-pond-background.png?v=1";

let farmPlotPage=0;
let fishingSlotsCache=Array(6).fill(null);
let fishingSlotsUnsubscribe=null;
let v4Dirty=false;

function makeFishingBaitInventory(){return Object.fromEntries(Object.keys(FISHING_BAITS).map(k=>[k,0]))}
function makeCoconutRiverInventory(){return Object.fromEntries(COCONUT_RIVER_KEYS.map(k=>[k,0]))}
function ensureV4State(target){
  if(!target)return target;
  target.fishingBaits=target.fishingBaits&&typeof target.fishingBaits==="object"?target.fishingBaits:{};
  Object.keys(FISHING_BAITS).forEach(k=>target.fishingBaits[k]=Math.max(0,Math.floor(Number(target.fishingBaits[k])||0)));
  target.coconutRiverItems=target.coconutRiverItems&&typeof target.coconutRiverItems==="object"?target.coconutRiverItems:{};
  COCONUT_RIVER_KEYS.forEach(k=>target.coconutRiverItems[k]=Math.max(0,Math.floor(Number(target.coconutRiverItems[k])||0)));
  const dateKey=currentBangkokDateKey();
  if(!target.coconutQuickBonus||target.coconutQuickBonus.dateKey!==dateKey){target.coconutQuickBonus={dateKey,frogClaimed:false,fishClaimed:false}}
  target.coconutQuickBonus.frogClaimed=Boolean(target.coconutQuickBonus.frogClaimed);
  target.coconutQuickBonus.fishClaimed=Boolean(target.coconutQuickBonus.fishClaimed);
  if(!Array.isArray(target.plots))target.plots=[];
  while(target.plots.length<PLOT_COUNT)target.plots.push(emptyPlot());
  target.plots=target.plots.slice(0,PLOT_COUNT).map(normalizePlot);
  return target;
}

const __freshBeforeV4=fresh;
fresh=function(player){return ensureV4State(__freshBeforeV4(player))};
const __normalizeStateBeforeV4=normalizeState;
normalizeState=function(raw,player){return ensureV4State(__normalizeStateBeforeV4(raw,player))};

const __ensureAdminStockBeforeV4=ensureAdminStock;
ensureAdminStock=function(target){
  const changedBase=__ensureAdminStockBeforeV4(target);if(!target)return changedBase;
  ensureV4State(target);let changed=Boolean(changedBase);
  if(currentMember==="Aida"&&adminProfile?.role==="admin"){
    Object.keys(FISHING_BAITS).forEach(k=>{if(Number(target.fishingBaits[k])!==ADMIN_STOCK_QTY){target.fishingBaits[k]=ADMIN_STOCK_QTY;changed=true}});
    COCONUT_RIVER_KEYS.forEach(k=>{if(Number(target.coconutRiverItems[k])!==ADMIN_STOCK_QTY){target.coconutRiverItems[k]=ADMIN_STOCK_QTY;changed=true}});
  }
  return changed;
};

const __saveBeforeV4=save;
save=function(){v4Dirty=true;return __saveBeforeV4()};
const __flushCloudSaveBeforeV4=flushCloudSave;
flushCloudSave=async function(){const result=await __flushCloudSaveBeforeV4();if(cloudReady)v4Dirty=false;return result};
setInterval(()=>{if(v4Dirty&&cloudReady&&!cloudSessionSuperseded)flushCloudSave().catch(()=>{})},45000);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&v4Dirty&&cloudReady)flushCloudSave().catch(()=>{})});
window.addEventListener("pagehide",()=>{if(v4Dirty&&cloudReady)flushCloudSave().catch(()=>{})});

function setFarmPlotPage(page){
  farmPlotPage=page===1?1:0;
  const screen=$("gameScreen");screen.classList.toggle("plot-page-2",farmPlotPage===1);
  $("plotPageNextBtn")?.classList.toggle("hidden",farmPlotPage===1);
  $("plotPagePrevBtn")?.classList.toggle("hidden",farmPlotPage!==1);
  draw();
}
function drawV4Plots(){
  if(!state)return;if(!visitContext){clearExpiredRest();processAnimalSystems();if(ensureMissionStateFor(ownState))save()}updateMeritUI();if(!visitContext)updateAlmsButton();ensureV4State(state);
  const plotsEl=$("plots");plotsEl.innerHTML="";const start=farmPlotPage*12;
  for(let localIndex=0;localIndex<12;localIndex++){
    const index=start+localIndex,plot=state.plots[index]||emptyPlot();ensurePlotPhase(plot);const currentStage=stage(plot),status=plotStatus(plot);const button=document.createElement("button");button.type="button";button.dataset.plotIndex=String(index);button.dataset.plotStage=currentStage;button.dataset.plotPhase=String(plot.phase||"");button.className=`plot ${currentStage} ${currentStage==="empty"?"empty":currentStage==="ready"?"ready":"growing"}`;const name=plot.crop?CROPS[plot.crop].name:"";const steal=visitContext&&currentStage==="ready"&&!['babyBamboo','hauntedPlankton'].includes(plot.crop)?'<span class="steal-badge">🧤 ขโมย</span>':"";button.innerHTML=`<span class="plot-no">#${index+1}</span>${status?`<img class="status-badge" src="${STATUS_ICON[status]}" alt="${status}">`:""}${steal}<div class="plot-inner"><div class="crop">${cropIcon(plot)}</div>${name?`<div class="crop-name">${name}</div>`:""}${plot.crop?`<div class="timer">${plotTimerText(plot)}</div>`:""}</div>`;button.onclick=()=>tapPlot(index);plotsEl.appendChild(button);
  }
}
draw=drawV4Plots;
function tickFarmUI(){
  if(!state||document.hidden||$("gameScreen")?.classList.contains("hidden"))return;
  if(!visitContext)processAnimalSystems();
  let redraw=false;
  document.querySelectorAll('#plots [data-plot-index]').forEach(button=>{
    if(redraw)return;
    const index=Number(button.dataset.plotIndex),plot=state.plots[index];
    if(!plot)return;
    ensurePlotPhase(plot);
    const nextStage=stage(plot),nextPhase=String(plot.phase||"");
    if(button.dataset.plotStage!==nextStage||button.dataset.plotPhase!==nextPhase){redraw=true;return}
    const timer=button.querySelector('.timer');
    if(timer&&plot.crop)timer.textContent=plotTimerText(plot);
  });
  if(redraw)draw();
}
if($("plotPageNextBtn"))$("plotPageNextBtn").onclick=()=>setFarmPlotPage(1);
if($("plotPagePrevBtn"))$("plotPagePrevBtn").onclick=()=>setFarmPlotPage(0);

function baitNeedHTML(bait){
  const rows=[];Object.entries(bait.needBag||{}).forEach(([k,n])=>rows.push(`${CROPS[k]?.icon||"🌱"} ${CROPS[k]?.name||k} ×${n}`));Object.entries(bait.needProducts||{}).forEach(([k,n])=>rows.push(`${ANIMAL_PRODUCTS[k]?.icon||"🐾"} ${ANIMAL_PRODUCTS[k]?.name||k} ×${n}`));if(bait.dishAny)rows.push(`🍲 อาหารที่คราฟแล้วอะไรก็ได้รวม ×${bait.dishAny}`);return rows.join("<br>");
}
function canCraftFishingBait(s,bait){return Object.entries(bait.needBag||{}).every(([k,n])=>(Number(s.bag[k])||0)>=n)&&Object.entries(bait.needProducts||{}).every(([k,n])=>(Number(s.animalProducts[k])||0)>=n)&&(!bait.dishAny||totalDishCount(s)>=bait.dishAny)}
function showFishingBaitCraft(){
  const s=ensureV4State(ownState||state);$("modalContent").innerHTML=`<section class="feature-panel"><h2>🎣 คราฟเหยื่อตกปลา</h2><p class="feature-subtitle">คราฟสำเร็จแล้วเหยื่อจะเข้า กระเป๋า → เหยื่อตกปลา • สูตร 75% ถ้าพลาดวัตถุดิบจะถูกใช้ไป</p><div class="fishing-bait-grid">${Object.entries(FISHING_BAITS).map(([key,b])=>`<article class="fishing-bait-card"><img src="${b.image}" alt="${b.name}"><h3>${b.name}</h3><small>${baitNeedHTML(b)}<br>โอกาสสำเร็จ ${b.chance}% • ใช้ตก ${Math.round(b.durationMs/60000)} นาที<br>มีในกระเป๋า ×${s.fishingBaits[key]||0}</small><button type="button" data-craft-fishing-bait="${key}" ${canCraftFishingBait(s,b)?"":"disabled"}>คราฟ</button></article>`).join("")}</div></section>`;document.querySelectorAll("[data-craft-fishing-bait]").forEach(btn=>btn.onclick=()=>craftFishingBait(btn.dataset.craftFishingBait));openModal();
}
async function craftFishingBait(key){
  const bait=FISHING_BAITS[key];if(!bait||!cloudReady)return;
  try{const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey);let next,success=false;await fs.runTransaction(db,async tx=>{const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(snap.data(),currentMember);assertCurrentCloudSession(snap.data(),currentMember);if(!canCraftFishingBait(s,bait))throw new Error("วัตถุดิบไม่ครบตามสูตร");Object.entries(bait.needBag||{}).forEach(([k,n])=>s.bag[k]-=n);Object.entries(bait.needProducts||{}).forEach(([k,n])=>s.animalProducts[k]-=n);if(bait.dishAny)consumeAnyDishes(s,bait.dishAny);success=Math.random()*100<bait.chance;if(success)s.fishingBaits[key]=(Number(s.fishingBaits[key])||0)+1;next=s;tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false})});ownState=normalizeState(next,currentMember);state=ownState;showFishingBaitCraft();showWeatherToast(success?`🎣 คราฟ ${bait.name} สำเร็จ • เข้ากระเป๋า +1`:"💨 คราฟเหยื่อไม่สำเร็จ • วัตถุดิบถูกใช้ไปแล้ว")}catch(error){message("คราฟเหยื่อไม่ได้",error.message||"กรุณาลองใหม่")}
}

function weightedPick(rows){let r=Math.random(),sum=0;for(const [value,weight] of rows){sum+=weight;if(r<=sum)return value}return rows[rows.length-1][0]}
function randomWeight(min,max){const lo=Math.round(min*100),hi=Math.round(max*100);return (lo+Math.floor(Math.random()*(hi-lo+1)))/100}
function rollFishingCatches(baitKey){
  const cfg=FISHING_CONFIG[baitKey],count=weightedPick(cfg.counts),catches=[];
  for(let i=0;i<count;i++){const tier=weightedPick(cfg.tiers),pool=Object.entries(FISHING_FISH).filter(([,f])=>f.tier===tier),[fishKey,fish]=pool[Math.floor(Math.random()*pool.length)],weight=randomWeight(fish.min,fish.max);catches.push({fishKey,name:fish.name,image:fish.image,weight:Number(weight.toFixed(2))})}
  const total=Number(catches.reduce((a,c)=>a+c.weight,0).toFixed(2));return{catches,total};
}
function normalizeFishingSlot(data,index){if(!data||typeof data!=="object")return null;const catches=Array.isArray(data.catches)?data.catches.slice(0,3).map(c=>({fishKey:String(c.fishKey||""),name:String(c.name||FISHING_FISH[c.fishKey]?.name||"ปลา"),image:String(c.image||FISHING_FISH[c.fishKey]?.image||""),weight:Number(Number(c.weight||0).toFixed(2))})):[];return{slot:Number(data.slot)||index+1,ownerKey:String(data.ownerKey||""),ownerName:String(data.ownerName||"สมาชิก"),baitKey:String(data.baitKey||""),status:String(data.status||"fishing"),startAt:Number(data.startAt)||0,finishAt:Number(data.finishAt)||0,claimDeadline:Number(data.claimDeadline)||0,catches,totalWeight:Number(Number(data.totalWeight||0).toFixed(2)),claimedAt:Number(data.claimedAt)||0}}
async function loadFishingSlots(){const {db,fs}=await getFirebaseContext();const snaps=await Promise.all(Array.from({length:6},(_,i)=>fs.getDoc(fs.doc(db,"fishingSlots",String(i+1)))));fishingSlotsCache=snaps.map((s,i)=>s.exists()?normalizeFishingSlot(s.data(),i):null);return fishingSlotsCache}
function stopFishingSubscription(){if(fishingSlotsUnsubscribe){fishingSlotsUnsubscribe();fishingSlotsUnsubscribe=null}fishingSlotsCache=Array(6).fill(null)}
function ensureFishingSubscription(){if(fishingSlotsUnsubscribe||!cloudReady)return;getFirebaseContext().then(({db,fs})=>{fishingSlotsUnsubscribe=fs.onSnapshot(fs.collection(db,"fishingSlots"),snap=>{const slots=Array(6).fill(null);snap.forEach(d=>{const i=Math.max(0,Math.min(5,Number(d.id)-1));slots[i]=normalizeFishingSlot(d.data(),i)});fishingSlotsCache=slots;if(currentScene==="underwater")drawFishingPond()},error=>console.warn("fishing slots",error))}).catch(()=>{})}
function fishingCountdown(ms){const total=Math.max(0,Math.ceil(ms/1000)),m=Math.floor(total/60),s=total%60;return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}
function fishingSlotIsAvailable(slot,now=gameNow()){return !slot||slot.status==="claimed"||Number(slot.claimDeadline||0)<=now}
function fishingDockHTML(slot,index){
  const [l,t,w,h]=FISHING_DOCK_POSITIONS[index],now=gameNow();let inner="";
  if(!slot||fishingSlotIsAvailable(slot,now)){if(slot&&slot.status!=="claimed"&&slot.claimDeadline>0&&slot.claimDeadline<=now)inner=`<span class="fishing-dock-status">ปลาหนีไปแล้ว ช้ามาก ทำอะไรชักช้าตลอด<br>ท่านี้ว่างแล้ว</span>`;else if(slot?.status==="claimed")inner=`<span class="fishing-dock-status">รับน้ำหนักแล้ว • ท่านี้ว่าง</span>`;return `<button class="fishing-dock" data-fishing-dock="${index}" type="button" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%">${inner}</button>`}
  if(now<slot.finishAt){inner=`<span class="fishing-dock-status">${safeHtml(slot.ownerName)} กำลังตกปลา<br>${fishingCountdown(slot.finishAt-now)}</span>`}
  else{const imgs=slot.catches.map(c=>`<img src="${c.image}" alt="${safeHtml(c.name)}">`).join("");inner=`<span class="fishing-result-fishes">${imgs}</span><span class="fishing-dock-status">สำเร็จ ปลาติดเบ็ดแล้วแม่!<br>${Number(slot.totalWeight).toFixed(2)} lbs • รับภายใน ${fishingCountdown(slot.claimDeadline-now)}</span>${slot.ownerKey===currentMemberKey?'<span class="fishing-claim-mini">รับ</span>':""}`}
  return `<button class="fishing-dock" data-fishing-dock="${index}" type="button" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%">${inner}</button>`;
}
function drawFishingPond(){
  if(currentScene!=="underwater")return;setSceneNav({backText:"กลับไปที่แปลงผัก",backAction:returnToFarm,nextText:"คราฟเหยื่อตกปลา",nextAction:showFishingBaitCraft});
  $("sceneInteractiveLayer").innerHTML=`<div class="fishing-scene-banner">🎣 บ่อบาดาลส่วนกลาง • 6 ท่า</div><button id="fishingDashboardBtn" class="fishing-dashboard-btn" type="button">แดชบอร์ด</button><button id="nagaOfferingHotspot" class="naga-offering-hotspot" type="button" aria-label="ถวายเสบียงเจ้าแม่"></button>${fishingSlotsCache.map((slot,i)=>fishingDockHTML(slot,i)).join("")}`;
  $("fishingDashboardBtn").onclick=()=>showFishingDashboard("today");$("nagaOfferingHotspot").onclick=openNagaOffering;document.querySelectorAll("[data-fishing-dock]").forEach(btn=>btn.onclick=()=>openFishingDock(Number(btn.dataset.fishingDock)));
}
async function renderUnderwaterScene(){
  if(!cloudReady){setSceneNav({backText:"กลับไปที่แปลงผัก",backAction:returnToFarm,nextText:"คราฟเหยื่อตกปลา",nextAction:showFishingBaitCraft});$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">กำลังเชื่อมบ่อบาดาลส่วนกลาง...</div>';return}
  try{await loadFishingSlots();drawFishingPond();ensureFishingSubscription();stopSceneTimer();sceneTimer=setInterval(()=>{if(currentScene!=="underwater"){stopSceneTimer();return}drawFishingPond()},1000)}catch(error){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">โหลดบ่อบาดาลไม่สำเร็จ</div>'}
}
async function getMyFishingLock(){if(!cloudReady)return null;const {db,fs}=await getFirebaseContext(),snap=await fs.getDoc(fs.doc(db,"fishingPlayers",currentMemberKey));return snap.exists()?snap.data():null}
async function openFishingDock(index){
  const now=gameNow(),slot=fishingSlotsCache[index];
  try{const lock=await getMyFishingLock();if(lock&&Number(lock.claimDeadline||0)>now){const mySlot=Math.max(0,Number(lock.slot||1)-1);if(mySlot!==index){message("🎣 รอก่อนแม่","โลภมากไม่ไหว รอก่อน ให้คนอื่นมาตกบ้าง ตกเสร็จบ่อนี้ก่อนเนาะ");return}const mine=fishingSlotsCache[mySlot];if(mine&&now>=mine.finishAt)showFishingResultModal(mine);else message("🎣 กำลังตกปลา",`ท่าของคุณกำลังทำงานอยู่ เหลือ ${fishingCountdown(Math.max(0,(mine?.finishAt||lock.finishAt)-now))}`);return}}
  catch{}
  if(slot&&!fishingSlotIsAvailable(slot,now)){if(now>=slot.finishAt){showFishingResultModal(slot);return}message("ท่านี้มีคนตกปลาอยู่",`${slot.ownerName} กำลังตกปลา • เหลือ ${fishingCountdown(slot.finishAt-now)}`);return}
  showFishingBaitChoice(index);
}
function showFishingBaitChoice(index){
  const s=ensureV4State(ownState||state),available=Object.entries(FISHING_BAITS).filter(([k])=>(Number(s.fishingBaits[k])||0)>0);if(!available.length){message("🎣 ไม่มีเหยื่อ","เสร่อมาก เหยื่อไม่มีแต่อยากจะกด");return}
  $("modalContent").innerHTML=`<section class="feature-panel"><h2>🎣 เลือกเหยื่อสำหรับท่า ${index+1}</h2><div class="fishing-bait-grid">${available.map(([key,b])=>`<article class="fishing-bait-card"><img src="${b.image}" alt="${b.name}"><h3>${b.name}</h3><small>มี ×${s.fishingBaits[key]} • ใช้เวลา ${Math.round(b.durationMs/60000)} นาที</small><button type="button" data-start-fishing="${key}">ใช้เหยื่อนี้</button></article>`).join("")}</div></section>`;document.querySelectorAll("[data-start-fishing]").forEach(btn=>btn.onclick=()=>startFishing(index,btn.dataset.startFishing));openModal();
}
async function startFishing(index,baitKey){
  const bait=FISHING_BAITS[baitKey];if(!bait||!cloudReady)return;const rolled=rollFishingCatches(baitKey),now=gameNow(),finishAt=now+bait.durationMs,claimDeadline=finishAt+FISHING_CLAIM_MS;
  try{const {db,fs}=await getFirebaseContext(),slotRef=fs.doc(db,"fishingSlots",String(index+1)),playerRef=fs.doc(db,"fishingPlayers",currentMemberKey),saveRef=fs.doc(db,"saves",currentMemberKey);let next,slotData;await fs.runTransaction(db,async tx=>{const [slotSnap,playerSnap,saveSnap]=await Promise.all([tx.get(slotRef),tx.get(playerRef),tx.get(saveRef)]);if(!saveSnap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(saveSnap.data(),currentMember);assertCurrentCloudSession(saveSnap.data(),currentMember);const lock=playerSnap.exists()?playerSnap.data():null;if(lock&&Number(lock.claimDeadline||0)>now)throw new Error("โลภมากไม่ไหว รอก่อน ให้คนอื่นมาตกบ้าง ตกเสร็จบ่อนี้ก่อนเนาะ");const oldSlot=slotSnap.exists()?normalizeFishingSlot(slotSnap.data(),index):null;if(oldSlot&&!fishingSlotIsAvailable(oldSlot,now))throw new Error(`${oldSlot.ownerName} กำลังใช้ท่านี้อยู่`);if((Number(s.fishingBaits[baitKey])||0)<1)throw new Error("เหยื่อนี้หมดจากกระเป๋าแล้ว");s.fishingBaits[baitKey]-=1;slotData={slot:index+1,ownerKey:currentMemberKey,ownerName:currentMember,baitKey,status:"fishing",startAt:now,finishAt,claimDeadline,catches:rolled.catches,totalWeight:rolled.total,claimedAt:0};next=s;tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});tx.set(slotRef,{...slotData,updatedAt:fs.serverTimestamp()},{merge:false});tx.set(playerRef,{memberKey:currentMemberKey,memberName:currentMember,slot:index+1,finishAt,claimDeadline,updatedAt:fs.serverTimestamp()},{merge:false})});ownState=normalizeState(next,currentMember);state=ownState;fishingSlotsCache[index]=slotData;closeModal();drawFishingPond();showWeatherToast(`🎣 เริ่มตกปลาท่า ${index+1} แล้ว • ${Math.round(bait.durationMs/60000)} นาที`)}catch(error){message("เริ่มตกปลาไม่ได้",error.message||"กรุณาลองใหม่")}
}
function showFishingResultModal(slot){
  const now=gameNow(),expired=now>Number(slot.claimDeadline||0),owner=slot.ownerKey===currentMemberKey;$("modalContent").innerHTML=`<section class="feature-panel"><h2>${expired?"💨 ปลาหนีไปแล้ว":"🎣 สำเร็จ ปลาติดเบ็ดแล้วแม่!"}</h2>${expired?'<p class="feature-subtitle">ปลาหนีไปแล้ว ช้ามาก ทำอะไรชักช้าตลอด</p>':`<div class="fishing-result-grid">${slot.catches.map(c=>`<article class="fishing-result-card"><img src="${c.image}" alt="${safeHtml(c.name)}"><h3>${safeHtml(c.name)}</h3><small>${Number(c.weight).toFixed(2)} lbs</small></article>`).join("")}</div><div class="fishing-total-weight">น้ำหนักรวม ${Number(slot.totalWeight).toFixed(2)} lbs</div><p class="feature-subtitle">${owner?`เหลือเวลารับ ${fishingCountdown(slot.claimDeadline-now)}`:`ของ ${safeHtml(slot.ownerName)} • คุณดูผลได้แต่รับแทนไม่ได้`}</p>${owner?'<button id="claimFishingWeightBtn" class="fishing-claim-button" type="button">รับน้ำหนักเข้าการแข่งขัน</button>':""}`}</section>`;if($("claimFishingWeightBtn"))$("claimFishingWeightBtn").onclick=()=>claimFishingCatch(slot.slot-1);openModal();
}
async function claimFishingCatch(index){
  const now=gameNow(),dateKey=currentBangkokDateKey();try{const {db,fs}=await getFirebaseContext(),slotRef=fs.doc(db,"fishingSlots",String(index+1)),playerRef=fs.doc(db,"fishingPlayers",currentMemberKey),saveRef=fs.doc(db,"saves",currentMemberKey),dailyRef=fs.doc(db,"fishingDaily",dateKey);let next,newSlot;await fs.runTransaction(db,async tx=>{const [slotSnap,playerSnap,saveSnap,dailySnap]=await Promise.all([tx.get(slotRef),tx.get(playerRef),tx.get(saveRef),tx.get(dailyRef)]);if(!slotSnap.exists()||!saveSnap.exists())throw new Error("ไม่พบผลการตกปลา");const slot=normalizeFishingSlot(slotSnap.data(),index);if(slot.ownerKey!==currentMemberKey)throw new Error("ปลาชุดนี้ไม่ใช่ของคุณ");if(now<slot.finishAt)throw new Error("ปลายังไม่ติดเบ็ด");if(now>slot.claimDeadline)throw new Error("ปลาหนีไปแล้ว ช้ามาก ทำอะไรชักช้าตลอด");if(slot.status==="claimed")throw new Error("รับน้ำหนักรอบนี้แล้ว");const s=normalizeState(saveSnap.data(),currentMember);assertCurrentCloudSession(saveSnap.data(),currentMember);const daily=dailySnap.exists()?dailySnap.data():{scores:{},names:{}};daily.scores=daily.scores&&typeof daily.scores==="object"?daily.scores:{};daily.names=daily.names&&typeof daily.names==="object"?daily.names:{};daily.scores[currentMemberKey]=Number(((Number(daily.scores[currentMemberKey])||0)+slot.totalWeight).toFixed(2));daily.names[currentMemberKey]=currentMember;incrementMissionOn(s,"fishingWeight",slot.totalWeight);slot.status="claimed";slot.claimedAt=now;next=s;newSlot=slot;tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});tx.set(dailyRef,{dateKey,scores:daily.scores,names:daily.names,updatedAt:fs.serverTimestamp()},{merge:false});tx.set(slotRef,{...slot,updatedAt:fs.serverTimestamp()},{merge:false});if(playerSnap.exists())tx.delete(playerRef)});ownState=normalizeState(next,currentMember);state=ownState;fishingSlotsCache[index]=newSlot;closeModal();drawFishingPond();showWeatherToast(`🏆 รับน้ำหนัก ${Number(newSlot.totalWeight).toFixed(2)} lbs เข้าการแข่งขันแล้ว`)}catch(error){message("รับน้ำหนักไม่ได้",error.message||"กรุณาลองใหม่")}
}

function previousBangkokDateKey(dateKey=currentBangkokDateKey()){const [y,m,d]=dateKey.split("-").map(Number),dt=new Date(Date.UTC(y,m-1,d)-86400000);return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth()+1).padStart(2,"0")}-${String(dt.getUTCDate()).padStart(2,"0")}`}
function topFishingRows(daily){const scores=daily?.scores&&typeof daily.scores==="object"?daily.scores:{},names=daily?.names&&typeof daily.names==="object"?daily.names:{};return Object.entries(scores).map(([key,value])=>({memberKey:key,name:names[key]||key,weight:Number(Number(value||0).toFixed(2))})).sort((a,b)=>b.weight-a.weight||a.name.localeCompare(b.name)).slice(0,3)}
async function maybeArchivePreviousFishingDay(){
  if(!cloudReady)return;const prev=previousBangkokDateKey();try{const {db,fs}=await getFirebaseContext(),dailyRef=fs.doc(db,"fishingDaily",prev),histRef=fs.doc(db,"fishingHistory",prev),[dailySnap,histSnap]=await Promise.all([fs.getDoc(dailyRef),fs.getDoc(histRef)]);if(histSnap.exists()||!dailySnap.exists())return;await fs.setDoc(histRef,{dateKey:prev,top3:topFishingRows(dailySnap.data()),createdAt:fs.serverTimestamp()},{merge:false})}catch(error){console.warn("archive fishing history",error)}
}
async function showFishingDashboard(tab="today"){
  if(!cloudReady)return;await maybeArchivePreviousFishingDay();try{const {db,fs}=await getFirebaseContext(),dateKey=currentBangkokDateKey();if(tab==="today"){const snap=await fs.getDoc(fs.doc(db,"fishingDaily",dateKey)),daily=snap.exists()?snap.data():{scores:{},names:{}},members=Object.keys(MEMBERS).filter(n=>n!=="Aida"),rows=members.map(name=>({name,key:memberKeyFromName(name),weight:Number(daily.scores?.[memberKeyFromName(name)]||0)})).sort((a,b)=>b.weight-a.weight||a.name.localeCompare(b.name));$("modalContent").innerHTML=`<section class="feature-panel"><h2>🎣 แดชบอร์ดตกปลา</h2><div class="fishing-dashboard-tabs"><button class="active" data-fishing-dashboard-tab="today">อันดับวันนี้</button><button data-fishing-dashboard-tab="history">สถิติผู้ชนะ</button></div><p class="feature-subtitle">รีเซ็ตทุกวันเวลา 00:00 น. เวลาไทย • นับเฉพาะปลาที่กดรับทันเวลา</p><div class="fishing-rank-list">${rows.map((r,i)=>`<div class="fishing-rank-row"><strong>${i+1}</strong><b>${safeHtml(r.name)}</b><span>${r.weight.toFixed(2)} lbs</span></div>`).join("")}</div></section>`}
    else{const q=fs.query(fs.collection(db,"fishingHistory"),fs.orderBy("dateKey","desc"),fs.limit(28)),snap=await fs.getDocs(q),days=[];snap.forEach(d=>days.push(d.data()));$("modalContent").innerHTML=`<section class="feature-panel"><h2>🎣 แดชบอร์ดตกปลา</h2><div class="fishing-dashboard-tabs"><button data-fishing-dashboard-tab="today">อันดับวันนี้</button><button class="active" data-fishing-dashboard-tab="history">สถิติผู้ชนะ</button></div><p class="feature-subtitle">เก็บสถิติผู้ชนะ Top 3 ย้อนหลัง 28 วันล่าสุด</p>${days.length?days.map(day=>`<div class="fishing-history-day"><h3>วันที่ ${safeHtml(day.dateKey||"")}</h3>${(day.top3||[]).map((r,i)=>`<div><b>${i+1}. ${safeHtml(r.name)}</b><span>${Number(r.weight||0).toFixed(2)} lbs</span></div>`).join("")||'<div>ยังไม่มีผู้ชนะ</div>'}</div>`).join(""):'<p class="empty-feature">ยังไม่มีประวัติการแข่งขัน</p>'}</section>`}
    document.querySelectorAll("[data-fishing-dashboard-tab]").forEach(btn=>btn.onclick=()=>showFishingDashboard(btn.dataset.fishingDashboardTab));openModal();
  }catch(error){message("เปิดแดชบอร์ดไม่ได้",error.message||"กรุณาลองใหม่")}
}

function openNagaOffering(){
  const s=ownState||state,remaining=Math.max(0,Number(s.underwaterUntil||0)-gameNow());if(remaining>0){message("🐍 เจ้าแม่กำลังพัก",`ส่งเสบียงได้อีกครั้งใน ${formatFriendlyCountdown(remaining)}`);return}const available=RECIPES.filter(r=>dishCountInState(r.id,s)>0);if(!available.length){message("ยังถวายไม่ได้","ไม่มีอาหารที่คราฟแล้วในกระเป๋า");return}$("modalContent").innerHTML=`<section class="feature-panel"><h2>🐍 ถวายเสบียงเจ้าแม่บาดาล</h2><p class="feature-subtitle">เลือกอาหาร 1 อย่าง • สุ่มรับกุศล 3–10 • คูลดาวน์ 2 ชั่วโมง</p><div class="fishing-bait-grid">${available.map(r=>`<article class="fishing-bait-card"><img src="${r.image}" alt="${r.name}"><h3>${r.name}</h3><small>มี ×${dishCountInState(r.id,s)}</small><button type="button" data-naga-offer="${r.id}">ถวายชิ้นนี้</button></article>`).join("")}</div></section>`;document.querySelectorAll("[data-naga-offer]").forEach(btn=>btn.onclick=()=>offerToNaga(btn.dataset.nagaOffer));openModal();
}
async function offerToNaga(recipeId){const now=gameNow(),reward=randInt(3,10);try{const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey),profileRef=fs.doc(db,"publicProfiles",currentMemberKey);let next;await fs.runTransaction(db,async tx=>{const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(snap.data(),currentMember);assertCurrentCloudSession(snap.data(),currentMember);if(Number(s.underwaterUntil||0)>now)throw new Error(`ส่งเสบียงได้อีกครั้งใน ${formatFriendlyCountdown(s.underwaterUntil-now)}`);if(!removeDishesFromState(s,recipeId,1))throw new Error("อาหารชิ้นนี้ไม่มีแล้ว");s.underwaterUntil=now+NAGA_OFFERING_COOLDOWN_MS;s.underwaterOffering=null;s.merit=(Number(s.merit)||0)+reward;next=s;tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});tx.set(profileRef,{memberKey:currentMemberKey,displayName:currentMember,merit:s.merit,initialized:true,updatedAt:fs.serverTimestamp()},{merge:true})});ownState=normalizeState(next,currentMember);state=ownState;updateMeritUI();closeModal();showWeatherToast(`🐍 เจ้าแม่ให้พร +${reward} กุศล`)}catch(error){message("ถวายเสบียงไม่ได้",error.message||"กรุณาลองใหม่")}}

function randomCoconutRiverKey(){return COCONUT_RIVER_KEYS[Math.floor(Math.random()*COCONUT_RIVER_KEYS.length)]}
const __normalizeSharedCoconutBeforeV4=normalizeSharedCoconut;
normalizeSharedCoconut=function(data){
  const base=__normalizeSharedCoconutBeforeV4(data),now=gameNow(),raw=Array.isArray(data?.riverSlots)?data.riverSlots.slice(0,4):[];while(raw.length<4)raw.push(null);base.riverSlots=raw.map(slot=>{const s=slot&&typeof slot==="object"?slot:{};let creatureKey=COCONUT_RIVER_ITEMS[s.creatureKey]?s.creatureKey:null,nextCreatureKey=COCONUT_RIVER_ITEMS[s.nextCreatureKey]?s.nextCreatureKey:null,nextAt=Math.max(0,Number(s.nextAt)||0);if(!creatureKey&&nextAt>0&&nextAt<=now){creatureKey=nextCreatureKey||randomCoconutRiverKey();nextCreatureKey=null;nextAt=0}return{creatureKey,nextCreatureKey,nextAt,lastByName:String(s.lastByName||""),lastByKey:String(s.lastByKey||"")}});return base;
};
loadSharedCoconut=async function(){
  const {db,fs}=await getFirebaseContext(),ref=fs.doc(db,"shared","coconutGarden");let result;await fs.runTransaction(db,async tx=>{const snap=await tx.get(ref),garden=normalizeSharedCoconut(snap.exists()?snap.data():null);let changed=!snap.exists();garden.riverSlots.forEach(slot=>{if(!slot.creatureKey&&slot.nextAt<=0){slot.creatureKey=randomCoconutRiverKey();changed=true}});result=garden;if(changed)tx.set(ref,{...garden,updatedAt:fs.serverTimestamp()},{merge:false})});sharedCoconutCache=result;return result;
};
function coconutRiverRemainingText(ms){return `${Math.max(1,Math.ceil(ms/60000))} นาที`}
renderCoconutScene=async function(){
  setSceneNav({backText:"กลับแปลงผัก",backAction:returnToFarm});if(!cloudReady){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">กำลังเชื่อมสวนมะพร้าวส่วนกลาง...</div>';return}try{await loadSharedCoconut()}catch(error){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">โหลดสวนมะพร้าวไม่สำเร็จ</div>';return}
  const s=ownState||state,quotaActive=Number(s.coconutQuotaResetAt||0)>gameNow(),used=quotaActive?(Number(s.coconutQuotaCount)||0):0,now=gameNow();$("sceneInteractiveLayer").innerHTML=`<div class="coconut-quota-label">🥥 โควตารอบนี้ ${used}/${COCONUT_QUOTA_PER_ROUND}</div><button id="coconutHistoryBtn" class="coconut-history-btn" type="button">ประวัติ 50 รายการ</button><button id="coconutFastBonusBtn" class="coconut-fast-bonus-btn" type="button">โบนัสคนมือไว</button>${COCONUT_TREE_POSITIONS_V1.map(([left,top,width,height],i)=>{const tree=sharedCoconutCache.trees[i],rem=Math.max(0,tree.nextAt-now),label=rem>0?`${tree.lastByName||"มีคน"} สอยแล้ว • ${coconutRemainingText(rem)}`:"พร้อมสอย";return `<button class="coconut-tree-hotspot" type="button" data-coconut-tree="${i}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%"><small>${safeHtml(label)}</small></button>`}).join("")}${sharedCoconutCache.riverSlots.map((slot,i)=>{const [l,t,w,h]=COCONUT_RIVER_POSITIONS[i],rem=Math.max(0,slot.nextAt-now),item=slot.creatureKey?COCONUT_RIVER_ITEMS[slot.creatureKey]:null;if(rem>0&&!item)return `<button class="coconut-river-slot cooldown" type="button" disabled style="left:${l}%;top:${t}%;width:${w}%;height:${h}%"><small>${safeHtml(slot.lastByName||"มีคน")} จับไปแล้ว ซอรี่นะ มาใหม่ อีก ${coconutRiverRemainingText(rem)}</small></button>`;if(!item)return `<button class="coconut-river-slot" type="button" data-coconut-river-slot="${i}" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%"></button>`;return `<button class="coconut-river-slot" type="button" data-coconut-river-slot="${i}" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%"><img src="${item.image}" alt="${item.name}"><small>แตะจับ ${safeHtml(item.name)}</small></button>`}).join("")}<button id="coconutBoatHotspot" class="coconut-boat-hotspot" type="button" aria-label="คราฟไอเท็มพิเศษ"><span class="coconut-boat-label">คราฟไอเท็มพิเศษ</span></button><button id="pandaForestBtn" class="panda-forest-entry" type="button">สวนป่าของด้า</button>`;document.querySelectorAll("[data-coconut-tree]").forEach(btn=>btn.onclick=()=>harvestCoconutTree(Number(btn.dataset.coconutTree)));document.querySelectorAll("[data-coconut-river-slot]").forEach(btn=>btn.onclick=()=>catchCoconutRiverCreature(Number(btn.dataset.coconutRiverSlot)));$("coconutBoatHotspot").onclick=showCoconutCraft;$("coconutHistoryBtn").onclick=showCoconutHistory;$("coconutFastBonusBtn").onclick=showCoconutFastBonus;$("pandaForestBtn").onclick=()=>openScene("panda");stopSceneTimer();sceneTimer=setInterval(()=>{if(currentScene!=="coconut"){stopSceneTimer();return}renderCoconutScene()},1000);
};
async function catchCoconutRiverCreature(index){
  const now=gameNow();try{const {db,fs}=await getFirebaseContext(),gardenRef=fs.doc(db,"shared","coconutGarden"),saveRef=fs.doc(db,"saves",currentMemberKey);let next,garden,itemKey;await fs.runTransaction(db,async tx=>{const [gSnap,sSnap]=await Promise.all([tx.get(gardenRef),tx.get(saveRef)]);if(!sSnap.exists())throw new Error("ไม่พบเซฟสมาชิก");const g=normalizeSharedCoconut(gSnap.exists()?gSnap.data():null),s=normalizeState(sSnap.data(),currentMember),slot=g.riverSlots[index];if(!slot)throw new Error("ไม่พบจุดจับ");if(slot.nextAt>now&&!slot.creatureKey)throw new Error(`${slot.lastByName||"มีคน"} จับไปแล้ว ซอรี่นะ มาใหม่ อีก ${coconutRiverRemainingText(slot.nextAt-now)}`);if(!slot.creatureKey)slot.creatureKey=slot.nextCreatureKey||randomCoconutRiverKey();itemKey=slot.creatureKey;if(!COCONUT_RIVER_ITEMS[itemKey])throw new Error("สัตว์น้ำยังไม่พร้อม");s.coconutRiverItems[itemKey]=(Number(s.coconutRiverItems[itemKey])||0)+1;slot.creatureKey=null;slot.nextCreatureKey=randomCoconutRiverKey();slot.nextAt=now+COCONUT_RIVER_COOLDOWN_MS;slot.lastByName=currentMember;slot.lastByKey=currentMemberKey;next=s;garden=g;tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});tx.set(gardenRef,{...g,updatedAt:fs.serverTimestamp()},{merge:false})});ownState=normalizeState(next,currentMember);state=ownState;sharedCoconutCache=garden;renderCoconutScene();message("🌴 จับสำเร็จ",`ได้รับ ${COCONUT_RIVER_ITEMS[itemKey].name} ×1<br>เก็บไว้ใน กระเป๋า → อื่นๆจากสวนมะพร้าว แล้ว`)}catch(error){message("จับไม่ได้",error.message||"กรุณาลองใหม่")}
}
function collectionKeys(kind){return [1,2,3,4].map(i=>`${kind}${i}`)}
function collectionReady(s,kind){return collectionKeys(kind).every(k=>(Number(s.coconutRiverItems[k])||0)>=1)}
function showCoconutFastBonus(){
  const s=ensureV4State(ownState||state);
  if(currentMember==="Aida"&&adminProfile?.role==="admin")ensureAdminStock(s);
  const frogClaimed=s.coconutQuickBonus.frogClaimed,fishClaimed=s.coconutQuickBonus.fishClaimed;
  const block=kind=>collectionKeys(kind).map(k=>{const item=COCONUT_RIVER_ITEMS[k];return `<div class="coconut-collection-item"><img src="${item.image}" alt="${item.name}"><b>${item.name}</b><span>×${s.coconutRiverItems[k]||0}</span></div>`}).join("");
  const exchangeBlock=(kind)=>{
    const isFrog=kind==="frog",itemKey=isFrog?"frog4":"fish4",productKey=isFrog?"milk":"fishMeat",reward=isFrog?20:30,item=COCONUT_RIVER_ITEMS[itemKey],product=ANIMAL_PRODUCTS[productKey],itemQty=Number(s.coconutRiverItems[itemKey])||0,productQty=Number(s.animalProducts?.[productKey])||0;
    return `<div class="coconut-exchange-row coconut-exchange-row-v2"><div class="coconut-exchange-items"><div class="coconut-exchange-item"><img src="${item.image}" alt="${item.name}"><b>${item.name}</b><span>มี ×${itemQty} • ใช้ ×1</span></div><div class="coconut-exchange-plus">+</div><div class="coconut-exchange-item"><img src="${product.image}" alt="${product.name}"><b>${product.name}</b><span>มี ×${productQty} • ใช้ ×10</span></div></div><div class="coconut-exchange-reward">→ ${reward} กุศล</div><button type="button" data-coconut-exchange="${kind}">แลก</button></div>`;
  };
  $("modalContent").innerHTML=`<section class="feature-panel"><h2>⚡ โบนัสคนมือไว</h2><p class="feature-subtitle">คอลเล็กชั่นหลักรับได้อย่างละ 1 ครั้ง/วัน • รีเซ็ต 00:00 น. เวลาไทย</p><div class="coconut-bonus-section"><h3>🐸 กบครบ 4 ตัว → 50 กุศล</h3><div class="coconut-collection-grid">${block("frog")}</div><button id="claimFrogCollectionBtn" type="button" ${frogClaimed||!collectionReady(s,"frog")?"disabled":""}>${frogClaimed?"รับวันนี้แล้ว":"วางกบครบ 4 ช่อง • รับ 50 กุศล"}</button>${exchangeBlock("frog")}</div><div class="coconut-bonus-section"><h3>🐟 ปลาครบ 4 ตัว → 50 กุศล</h3><div class="coconut-collection-grid">${block("fish")}</div><button id="claimFishCollectionBtn" type="button" ${fishClaimed||!collectionReady(s,"fish")?"disabled":""}>${fishClaimed?"รับวันนี้แล้ว":"วางปลาครบ 4 ช่อง • รับ 50 กุศล"}</button>${exchangeBlock("fish")}</div></section>`;
  $("claimFrogCollectionBtn").onclick=()=>claimCoconutCollection("frog");
  $("claimFishCollectionBtn").onclick=()=>claimCoconutCollection("fish");
  document.querySelectorAll("[data-coconut-exchange]").forEach(btn=>{btn.onclick=()=>exchangeCoconutDuplicate(btn.dataset.coconutExchange)});
  openModal();
}
async function claimCoconutCollection(kind){const dateKey=currentBangkokDateKey();try{const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey),profileRef=fs.doc(db,"publicProfiles",currentMemberKey);let next;await fs.runTransaction(db,async tx=>{const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");const s=normalizeState(snap.data(),currentMember);if(s.coconutQuickBonus.dateKey!==dateKey)s.coconutQuickBonus={dateKey,frogClaimed:false,fishClaimed:false};const field=kind==="frog"?"frogClaimed":"fishClaimed";if(s.coconutQuickBonus[field])throw new Error("คอลเล็กชั่นนี้รับรางวัลวันนี้แล้ว");if(!collectionReady(s,kind))throw new Error("ยังมีไม่ครบทั้ง 4 ตัว อย่างละหนึ่ง");collectionKeys(kind).forEach(k=>s.coconutRiverItems[k]-=1);s.coconutQuickBonus[field]=true;s.merit=(Number(s.merit)||0)+50;next=s;tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});tx.set(profileRef,{memberKey:currentMemberKey,displayName:currentMember,merit:s.merit,initialized:true,updatedAt:fs.serverTimestamp()},{merge:true})});ownState=normalizeState(next,currentMember);state=ownState;updateMeritUI();showCoconutFastBonus();showWeatherToast("⚡ รับ +50 กุศลจากโบนัสคนมือไวแล้ว")}catch(error){message("รับโบนัสไม่ได้",error.message||"กรุณาลองใหม่")}}
async function exchangeCoconutDuplicate(kind){
  const isFrog=kind==="frog",itemKey=isFrog?"frog4":"fish4",productKey=isFrog?"milk":"fishMeat",productQty=10,reward=isFrog?20:30;
  try{
    const {db,fs}=await getFirebaseContext(),saveRef=fs.doc(db,"saves",currentMemberKey),profileRef=fs.doc(db,"publicProfiles",currentMemberKey);let next;
    await fs.runTransaction(db,async tx=>{
      const snap=await tx.get(saveRef);if(!snap.exists())throw new Error("ไม่พบเซฟสมาชิก");
      const s=normalizeState(snap.data(),currentMember);
      if(currentMember==="Aida"&&adminProfile?.role==="admin")ensureAdminStock(s);
      const caughtQty=Number(s.coconutRiverItems?.[itemKey])||0,stockQty=Number(s.animalProducts?.[productKey])||0;
      if(caughtQty<1)throw new Error(`${COCONUT_RIVER_ITEMS[itemKey].name} ยังไม่พอ ต้องมีอย่างน้อย 1 ตัว`);
      if(stockQty<productQty)throw new Error(`${ANIMAL_PRODUCTS[productKey].name} ยังไม่พอ ต้องมีอย่างน้อย ${productQty}`);
      s.coconutRiverItems[itemKey]=caughtQty-1;s.animalProducts[productKey]=stockQty-productQty;s.merit=(Number(s.merit)||0)+reward;
      next=s;
      tx.set(saveRef,{...cloneData(s),activeSessionId:cloudSessionId,updatedAt:fs.serverTimestamp()},{merge:false});
      tx.set(profileRef,{memberKey:currentMemberKey,displayName:currentMember,merit:s.merit,initialized:true,updatedAt:fs.serverTimestamp()},{merge:true});
    });
    ownState=normalizeState(next,currentMember);state=ownState;updateMeritUI();save();showCoconutFastBonus();showWeatherToast(`♻️ แลกสำเร็จ +${reward} กุศล`);
  }catch(error){console.error("coconut duplicate exchange",error);message("แลกไม่ได้",error.message||"กรุณาลองใหม่")}
}

/* กระเป๋าเพิ่ม เหยื่อตกปลา + อื่นๆจากสวนมะพร้าว */
inventory=function(tab="crops"){
  if(guardResting())return;const s=ensureV4State(ownState||state);ensureBoatState(s);const dishMap=dishCounts();const tabs=[["crops","🌱 พืชพรรณ"],["products","🐾 ผลผลิตสัตว์"],["food","🍲 อาหาร"],["fishingBaits","🎣 เหยื่อตกปลา"],["coconutRiver","🌴 อื่นๆจากสวนมะพร้าว"],["boatDrinks","🩷 เสบียงเรือ"],["specials","🕯️ ของพิเศษ"],["specialAnimals","🪼 สัตว์พิเศษ"],["mysteryBoxes","🎲 กล่องสุ่ม"]];let body="";
  if(tab==="crops")body=Object.entries(CROPS).map(([k,c])=>`<div class="inventory-item"><img src="${c.readyImg}" alt="${c.name}"><span>${c.name}</span><b>×${s.bag[k]||0}</b></div>`).join("");
  else if(tab==="products")body=Object.entries(ANIMAL_PRODUCTS).map(([k,p])=>`<div class="inventory-item"><img src="${p.image}" alt="${p.name}"><span>${p.name}</span><b>×${s.animalProducts[k]||0}</b></div>`).join("");
  else if(tab==="food")body=RECIPES.map(r=>`<div class="inventory-item"><img src="${r.image}" alt="${r.name}"><span>${r.name}</span><b>×${dishMap[r.id]||0}</b></div>`).join("");
  else if(tab==="fishingBaits")body=Object.entries(FISHING_BAITS).map(([k,b])=>`<div class="inventory-item fishing-bait-inventory"><img src="${b.image}" alt="${b.name}"><span>${b.name}<small style="display:block">ใช้ตกปลา ${Math.round(b.durationMs/60000)} นาที</small></span><b>×${s.fishingBaits[k]||0}</b></div>`).join("");
  else if(tab==="coconutRiver")body=Object.entries(COCONUT_RIVER_ITEMS).map(([k,item])=>`<div class="inventory-item coconut-river-inventory"><img src="${item.image}" alt="${item.name}"><span>${item.name}</span><b>×${s.coconutRiverItems[k]||0}</b></div>`).join("");
  else if(tab==="boatDrinks")body=BOAT_SUPPLY_DRINKS.map(r=>`<div class="inventory-item boat-drink-inventory"><img src="${r.image}" alt="${r.name}"><span>${r.name}<small style="display:block">ใช้เติมเรือเท่านั้น</small></span><b>×${s.boatDrinks[r.id]||0}</b></div>`).join("");
  else if(tab==="specialAnimals")body=Object.entries(JELLYFISH_TYPES).map(([k,j])=>`<div class="inventory-item"><img src="${j.image}" alt="${j.name}"><span>${j.name}<small style="display:block">ยังไม่เริ่มนับอายุจนกว่าจะวางลงบ่อ</small></span><b>×${s.specialAnimals[k]||0}</b></div>`).join("");
  else if(tab==="mysteryBoxes")body=`<div class="inventory-item special-coconut-item"><img src="${JELLY_BOX.image}" alt="${JELLY_BOX.name}"><span>${JELLY_BOX.name}<small style="display:block">กดใช้งานเพื่อเปิดกล่องและสุ่มรางวัล</small></span><b>×${s.mysteryBoxes||0}</b>${(Number(s.mysteryBoxes)||0)>0?'<button type="button" id="useJellyBoxBtn">ใช้งาน</button>':""}</div>`;
  else body=Object.entries(SPECIAL_ITEMS).map(([k,item])=>{const desc=item.kind==="animal"?`เร่งผลผลิตสัตว์ ${item.boost}%`:item.kind==="crop"?`เร่งโตพืช ${item.boost}%`:(item.description||"");return `<div class="inventory-item special-coconut-item"><img src="${item.image}" alt="${item.name}"><span>${item.name}<small style="display:block">${desc}</small></span><b>×${s.specials[k]||0}</b></div>`}).join("");
  $("modalContent").innerHTML=`<section class="feature-panel inventory-panel"><h2>🎒 กระเป๋าผี</h2><div class="inventory-tabs inventory-tabs-v2">${tabs.map(([k,label])=>`<button type="button" data-inventory-tab="${k}" class="${k===tab?"active":""}">${label}</button>`).join("")}</div><div class="inventory-grid">${body}</div></section>`;document.querySelectorAll("[data-inventory-tab]").forEach(b=>b.onclick=()=>inventory(b.dataset.inventoryTab));if($("useJellyBoxBtn"))$("useJellyBoxBtn").onclick=showJellyBoxUse;openModal();
};
if($("inventoryNavBtn"))$("inventoryNavBtn").onclick=()=>inventory();

/* Admin สามารถส่งไอเท็มใหม่ได้ด้วย */
const __adminGiftCatalogBeforeV4=adminGiftCatalog;
adminGiftCatalog=function(){return[...__adminGiftCatalogBeforeV4(),...Object.entries(FISHING_BAITS).map(([key,b])=>({type:"fishingBait",key,name:b.name})),...Object.entries(COCONUT_RIVER_ITEMS).map(([key,item])=>({type:"coconutRiver",key,name:item.name}))]};
const __addGiftItemBeforeV4=addGiftItemToState;
addGiftItemToState=function(s,gift){ensureV4State(s);if(Array.isArray(gift?.items)){gift.items.forEach(item=>addGiftItemToState(s,{itemType:item.type,itemKey:item.key,qty:item.qty}));return}const type=gift.itemType||gift.type,key=gift.itemKey||gift.key,qty=Math.max(1,Math.floor(Number(gift.qty)||1));if(type==="fishingBait"){if(!FISHING_BAITS[key])throw new Error("ไม่พบเหยื่อตกปลา");s.fishingBaits[key]=(Number(s.fishingBaits[key])||0)+qty;return}if(type==="coconutRiver"){if(!COCONUT_RIVER_ITEMS[key])throw new Error("ไม่พบของจากสวนมะพร้าว");s.coconutRiverItems[key]=(Number(s.coconutRiverItems[key])||0)+qty;return}return __addGiftItemBeforeV4(s,gift)};
const __removeGiftItemBeforeV4=removeGiftItemFromState;
removeGiftItemFromState=function(s,itemType,itemKey,qty){ensureV4State(s);qty=Math.max(1,Math.floor(Number(qty)||1));if(itemType==="fishingBait"){if((Number(s.fishingBaits[itemKey])||0)<qty)return false;s.fishingBaits[itemKey]-=qty;return true}if(itemType==="coconutRiver"){if((Number(s.coconutRiverItems[itemKey])||0)<qty)return false;s.coconutRiverItems[itemKey]-=qty;return true}return __removeGiftItemBeforeV4(s,itemType,itemKey,qty)};
const __adminEntryCountBeforeV4=adminEntryCount;
adminEntryCount=function(s,entry){ensureV4State(s);if(entry.type==="fishingBait")return Number(s.fishingBaits[entry.key])||0;if(entry.type==="coconutRiver")return Number(s.coconutRiverItems[entry.key])||0;return __adminEntryCountBeforeV4(s,entry)};

/* Maintenance backup: export exact save documents before opening the update */
async function exportMaintenanceBackup(){
  if(adminProfile?.role!=="admin"){message("ไม่มีสิทธิ์","เมนูนี้เปิดเฉพาะ Aida/Admin");return}try{const {db,fs}=await getFirebaseContext(),[saveSnap,gardenSnap,profileSnap]=await Promise.all([fs.getDocs(fs.collection(db,"saves")),fs.getDocs(fs.collection(db,"gardens")),fs.getDocs(fs.collection(db,"publicProfiles"))]),pack={exportedAt:new Date().toISOString(),bangkokDate:currentBangkokDateKey(),saves:{},gardens:{},publicProfiles:{}};saveSnap.forEach(d=>pack.saves[d.id]=d.data());gardenSnap.forEach(d=>pack.gardens[d.id]=d.data());profileSnap.forEach(d=>pack.publicProfiles[d.id]=d.data());const blob=new Blob([JSON.stringify(pack,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`yainoo-backup-${currentBangkokDateKey()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showWeatherToast("📦 สำรองข้อมูลสมาชิกเรียบร้อยแล้ว")}catch(error){message("สำรองข้อมูลไม่สำเร็จ",error.message||"กรุณาลองใหม่")}
}
const __showAdminCenterBeforeV4=showAdminCenter;
showAdminCenter=async function(){await __showAdminCenterBeforeV4();const panel=document.querySelector(".admin-panel");if(!panel||$("adminMaintenanceBackupBtn"))return;const section=document.createElement("div");section.className="admin-section";section.innerHTML='<h3>📦 สำรองข้อมูลก่อนปิดปรับปรุง</h3><p class="feature-subtitle">ดาวน์โหลด snapshot ของ saves / gardens / publicProfiles ทุกคนไว้เทียบกระเป๋าและกุศลหลังอัปเดต</p><button id="adminMaintenanceBackupBtn" class="primary-spooky-action" type="button">ดาวน์โหลด Backup ตอนนี้</button>';panel.insertBefore(section,panel.children[2]||null);$("adminMaintenanceBackupBtn").onclick=exportMaintenanceBackup};

/* Well -> fishing pond directly */
showWellChoices=function(){if(guardResting())return;openScene("underwater")};
if($("wellHotspot"))$("wellHotspot").onclick=showWellChoices;

const __openSceneBeforeV4=openScene;
openScene=function(sceneName){if(currentScene==="underwater"&&sceneName!=="underwater")stopFishingSubscription();return __openSceneBeforeV4(sceneName)};
const __returnToFarmBeforeV4=returnToFarm;
returnToFarm=function(){if(currentScene==="underwater")stopFishingSubscription();const result=__returnToFarmBeforeV4();farmPlotPage=0;$("gameScreen")?.classList.remove("plot-page-2");$("plotPageNextBtn")?.classList.remove("hidden");$("plotPagePrevBtn")?.classList.add("hidden");if(state)draw();return result};

/* first paint keeps original 1–12 page */
setFarmPlotPage(0);

/* V4.1 lightweight live redraws — avoid Firestore polling every second */
let coconutSharedUnsubscribe=null;
function stopCoconutSharedSubscription(){if(coconutSharedUnsubscribe){coconutSharedUnsubscribe();coconutSharedUnsubscribe=null}}
function ensureCoconutSharedSubscription(){if(coconutSharedUnsubscribe||!cloudReady)return;getFirebaseContext().then(({db,fs})=>{coconutSharedUnsubscribe=fs.onSnapshot(fs.doc(db,"shared","coconutGarden"),snap=>{if(!snap.exists())return;sharedCoconutCache=normalizeSharedCoconut(snap.data());if(currentScene==="coconut")drawCoconutSceneV4FromCache()},error=>console.warn("coconut shared",error))}).catch(()=>{})}
function drawCoconutSceneV4FromCache(){
  if(currentScene!=="coconut"||!sharedCoconutCache)return;setSceneNav({backText:"กลับแปลงผัก",backAction:returnToFarm});const s=ownState||state,quotaActive=Number(s.coconutQuotaResetAt||0)>gameNow(),used=quotaActive?(Number(s.coconutQuotaCount)||0):0,now=gameNow();$("sceneInteractiveLayer").innerHTML=`<div class="coconut-quota-label">🥥 โควตารอบนี้ ${used}/${COCONUT_QUOTA_PER_ROUND}</div><button id="coconutHistoryBtn" class="coconut-history-btn" type="button">ประวัติ 50 รายการ</button><button id="coconutFastBonusBtn" class="coconut-fast-bonus-btn" type="button">โบนัสคนมือไว</button>${COCONUT_TREE_POSITIONS_V1.map(([left,top,width,height],i)=>{const tree=sharedCoconutCache.trees[i],rem=Math.max(0,tree.nextAt-now),label=rem>0?`${tree.lastByName||"มีคน"} สอยแล้ว • ${coconutRemainingText(rem)}`:"พร้อมสอย";return `<button class="coconut-tree-hotspot" type="button" data-coconut-tree="${i}" style="left:${left}%;top:${top}%;width:${width}%;height:${height}%"><small>${safeHtml(label)}</small></button>`}).join("")}${sharedCoconutCache.riverSlots.map((slot,i)=>{const [l,t,w,h]=COCONUT_RIVER_POSITIONS[i],rem=Math.max(0,slot.nextAt-now),item=slot.creatureKey?COCONUT_RIVER_ITEMS[slot.creatureKey]:null;if(rem>0&&!item)return `<button class="coconut-river-slot cooldown" type="button" disabled style="left:${l}%;top:${t}%;width:${w}%;height:${h}%"><small>${safeHtml(slot.lastByName||"มีคน")} จับไปแล้ว ซอรี่นะ มาใหม่ อีก ${coconutRiverRemainingText(rem)}</small></button>`;if(!item)return `<button class="coconut-river-slot" type="button" data-coconut-river-slot="${i}" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%"></button>`;return `<button class="coconut-river-slot" type="button" data-coconut-river-slot="${i}" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%"><img src="${item.image}" alt="${item.name}"><small>แตะจับ ${safeHtml(item.name)}</small></button>`}).join("")}<button id="coconutBoatHotspot" class="coconut-boat-hotspot" type="button" aria-label="คราฟไอเท็มพิเศษ"><span class="coconut-boat-label">คราฟไอเท็มพิเศษ</span></button><button id="pandaForestBtn" class="panda-forest-entry" type="button">สวนป่าของด้า</button>`;document.querySelectorAll("[data-coconut-tree]").forEach(btn=>btn.onclick=()=>harvestCoconutTree(Number(btn.dataset.coconutTree)));document.querySelectorAll("[data-coconut-river-slot]").forEach(btn=>btn.onclick=()=>catchCoconutRiverCreature(Number(btn.dataset.coconutRiverSlot)));$("coconutBoatHotspot").onclick=showCoconutCraft;$("coconutHistoryBtn").onclick=showCoconutHistory;$("coconutFastBonusBtn").onclick=showCoconutFastBonus;$("pandaForestBtn").onclick=()=>openScene("panda");
}
renderCoconutScene=async function(){setSceneNav({backText:"กลับแปลงผัก",backAction:returnToFarm});if(!cloudReady){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">กำลังเชื่อมสวนมะพร้าวส่วนกลาง...</div>';return}try{await loadSharedCoconut();drawCoconutSceneV4FromCache();ensureCoconutSharedSubscription();stopSceneTimer();sceneTimer=setInterval(()=>{if(currentScene!=="coconut"){stopSceneTimer();return}drawCoconutSceneV4FromCache()},1000)}catch(error){$("sceneInteractiveLayer").innerHTML='<div class="coconut-loading">โหลดสวนมะพร้าวไม่สำเร็จ</div>'}};

const __openSceneBeforeV41=openScene;
openScene=function(sceneName){if(currentScene==="coconut"&&sceneName!=="coconut")stopCoconutSharedSubscription();return __openSceneBeforeV41(sceneName)};
const __returnToFarmBeforeV41=returnToFarm;
returnToFarm=function(){if(currentScene==="coconut")stopCoconutSharedSubscription();return __returnToFarmBeforeV41()};

/* history excludes Aida because contest board is the 18 regular members */
topFishingRows=function(daily){const scores=daily?.scores&&typeof daily.scores==="object"?daily.scores:{},names=daily?.names&&typeof daily.names==="object"?daily.names:{};return Object.entries(scores).filter(([key])=>key!=="aida").map(([key,value])=>({memberKey:key,name:names[key]||key,weight:Number(Number(value||0).toFixed(2))})).sort((a,b)=>b.weight-a.weight||a.name.localeCompare(b.name)).slice(0,3)};

/* claimed results remain visible until another player takes the free dock */
const __fishingDockHTMLBeforeV41=fishingDockHTML;
fishingDockHTML=function(slot,index){if(slot?.status==="claimed"){const [l,t,w,h]=FISHING_DOCK_POSITIONS[index],imgs=(slot.catches||[]).map(c=>`<img src="${c.image}" alt="${safeHtml(c.name)}">`).join("");return `<button class="fishing-dock" data-fishing-dock="${index}" type="button" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%"><span class="fishing-result-fishes">${imgs}</span><span class="fishing-dock-status">${safeHtml(slot.ownerName)} รับแล้ว • ${Number(slot.totalWeight).toFixed(2)} lbs<br>ท่านี้ว่าง</span></button>`}return __fishingDockHTMLBeforeV41(slot,index)};

/* ===== ห้องทดลองสัตว์ Aida: local visual only, ไม่เขียน Firebase ===== */
const AIDA_FARM_PET_ROWS=[35.8,49.8,62,74.4,86.2];
const AIDA_FARM_PET_COLS=[10,33.5,65.5,90];
const AIDA_FARM_PET_POSES={idleA:0,idleB:1,sit:2,scratch:3,lie:4,sleep:5,happy:6,startled:7,sniff:8,stretch:9,groom:10,paw:11};
const AIDA_FARM_PET_POSE_LABELS=["อยู่เฉย ๆ","หายใจเบา ๆ","นั่ง","เกาหัว","นอนมอง","หลับ","ดีใจ","ตกใจ","ดมพื้น","ยืดตัว","เลียอุ้งเท้า","ยกอุ้งเท้า"];
let aidaFarmPet=null;
let aidaFarmPetSprite=null;
let aidaFarmPetNode=5;
let aidaFarmPetTimer=0;
let aidaFarmPetFrameTimer=0;
let aidaFarmPetTransitionTimer=0;
let aidaFarmPetMotion=null;
let aidaFarmPetRunToken=0;
let aidaFarmPetHorizontalDirection=1;
let aidaFarmPetPreviousNode=-1;
let aidaFarmPetType="dog";
let aidaFarmPetNumber=1;
let aidaFarmPetSpeed=1;
let aidaFarmPetAutoWalk=true;
let aidaFarmPetForcedDirection="";
let aidaFarmPetTestActive=false;
let aidaFarmPetAssetBase="";

try{
  const saved=JSON.parse(sessionStorage.getItem("aidaPetTesterV1")||"null");
  if(saved?.type==="cat"||saved?.type==="dog")aidaFarmPetType=saved.type;
  if(Number(saved?.number)>=1&&Number(saved?.number)<=8)aidaFarmPetNumber=Math.floor(Number(saved.number));
  if(Number(saved?.speed)>=.75&&Number(saved?.speed)<=1.3)aidaFarmPetSpeed=Number(saved.speed);
}catch(error){console.warn("pet tester settings",error)}

function saveAidaFarmPetTestSettings(){
  try{sessionStorage.setItem("aidaPetTesterV1",JSON.stringify({type:aidaFarmPetType,number:aidaFarmPetNumber,speed:aidaFarmPetSpeed}))}catch(error){}
}
function aidaFarmPetBasePath(){
  const folder=aidaFarmPetType==="cat"?"cats":"dogs",prefix=aidaFarmPetType==="cat"?"cat":"dog",number=String(aidaFarmPetNumber).padStart(2,"0");
  return aidaFarmPetAssetBase||`pet-assets/${folder}/${prefix}-${number}`;
}
function aidaFarmPetImage(kind){
  const base=aidaFarmPetBasePath();
  if(kind==="pose")return `${base}-pose-sheet.png?v=3`;
  return `${base}-walk-${kind}.png?v=3`;
}

function aidaFarmPetOwnerKey(){return visitContext?String(visitContext.memberKey||memberKeyFromName(visitContext.name)):String(currentMemberKey||memberKeyFromName(currentMember))}
function shouldShowAidaFarmPet(){
  const screen=$("gameScreen");
  return Boolean(aidaFarmPetTestActive&&currentMember==="Aida"&&screen&&!screen.classList.contains("hidden")&&!screen.classList.contains("plot-page-2")&&aidaFarmPetOwnerKey()==="aida");
}
function setAidaFarmPetPose(index){
  if(!aidaFarmPetSprite)return;
  const col=index%4,row=Math.floor(index/4);
  aidaFarmPet?.classList.remove("is-walking");
  const widePose=index===AIDA_FARM_PET_POSES.lie||index===AIDA_FARM_PET_POSES.sleep;
  aidaFarmPet?.style.setProperty("--pet-shadow-width",widePose?"72%":index===AIDA_FARM_PET_POSES.sit?"52%":"48%");
  aidaFarmPet?.style.setProperty("--pet-shadow-bottom",widePose?"11.5%":"11.5%");
  aidaFarmPetSprite.classList.remove("is-walking","walk-front","walk-back","face-left");
  aidaFarmPetSprite.style.setProperty("--pet-art-scale","1");
  aidaFarmPetSprite.style.backgroundImage=`url("${aidaFarmPetImage("pose")}")`;
  aidaFarmPetSprite.style.backgroundSize="400% 300%";
  aidaFarmPetSprite.style.backgroundPosition=`${col*(100/3)}% ${row*50}%`;
}
function setAidaFarmPetWalkFrame(index,direction="right"){
  if(!aidaFarmPetSprite)return;
  const frame=((index%8)+8)%8,col=frame%4,row=Math.floor(frame/4);
  aidaFarmPet?.classList.add("is-walking");
  aidaFarmPet?.style.setProperty("--pet-shadow-width",direction==="front"||direction==="back"?"42%":"48%");
  aidaFarmPet?.style.setProperty("--pet-shadow-bottom",direction==="front"||direction==="back"?"7.5%":"11.5%");
  aidaFarmPetSprite.classList.add("is-walking");
  aidaFarmPetSprite.classList.toggle("walk-front",direction==="front");
  aidaFarmPetSprite.classList.toggle("walk-back",direction==="back");
  aidaFarmPetSprite.classList.toggle("face-left",direction==="left");
  const walkKind=direction==="front"?"front":direction==="back"?"back":"side";
  aidaFarmPetSprite.style.setProperty("--pet-art-scale","1");
  aidaFarmPetSprite.style.backgroundImage=`url("${aidaFarmPetImage(walkKind)}")`;
  aidaFarmPetSprite.style.backgroundSize="400% 200%";
  aidaFarmPetSprite.style.backgroundPosition=`${col*(100/3)}% ${row*100}%`;
}
function transitionAidaFarmPetSprite(change,token,done){
  if(token!==aidaFarmPetRunToken||!aidaFarmPetSprite)return;
  clearTimeout(aidaFarmPetTransitionTimer);
  aidaFarmPetSprite.classList.add("is-changing-pose");
  aidaFarmPetTransitionTimer=setTimeout(()=>{
    if(token!==aidaFarmPetRunToken||!aidaFarmPetSprite)return;
    change();
    requestAnimationFrame(()=>{
      if(token!==aidaFarmPetRunToken||!aidaFarmPetSprite)return;
      aidaFarmPetSprite.classList.remove("is-changing-pose");
      aidaFarmPetTransitionTimer=setTimeout(()=>{
        if(token===aidaFarmPetRunToken)done?.();
      },170);
    });
  },140);
}
function aidaFarmPetPoint(index){
  const layer=$("aidaFarmPetLayer"),rect=layer.getBoundingClientRect();
  const row=Math.floor(index/AIDA_FARM_PET_COLS.length),col=index%AIDA_FARM_PET_COLS.length;
  const petRect=aidaFarmPet?.getBoundingClientRect()||{width:0,height:0};
  return{x:rect.width*AIDA_FARM_PET_COLS[col]/100-petRect.width/2,y:rect.height*AIDA_FARM_PET_ROWS[row]/100-petRect.height*.82};
}
function nextAidaFarmPetNode(index){
  const cols=AIDA_FARM_PET_COLS.length,rows=AIDA_FARM_PET_ROWS.length,row=Math.floor(index/cols),col=index%cols;
  if(aidaFarmPetForcedDirection){
    const direction=aidaFarmPetForcedDirection;aidaFarmPetForcedDirection="";
    const delta=direction==="left"?[0,-1]:direction==="right"?[0,1]:direction==="back"?[-1,0]:[1,0];
    const forcedRow=Math.max(0,Math.min(rows-1,row+delta[0])),forcedCol=Math.max(0,Math.min(cols-1,col+delta[1]));
    if(forcedRow!==row||forcedCol!==col)return forcedRow*cols+forcedCol;
    const oppositeRow=Math.max(0,Math.min(rows-1,row-delta[0])),oppositeCol=Math.max(0,Math.min(cols-1,col-delta[1]));
    return oppositeRow*cols+oppositeCol;
  }
  const offsets=[[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[-1,1],[1,-1],[1,1]];
  let choices=offsets.map(([dr,dc])=>({row:row+dr,col:col+dc})).filter(p=>p.row>=0&&p.row<rows&&p.col>=0&&p.col<cols).map(p=>p.row*cols+p.col);
  const fresh=choices.filter(node=>node!==aidaFarmPetPreviousNode);if(fresh.length)choices=fresh;
  return choices[Math.floor(Math.random()*choices.length)];
}
function clearAidaFarmPetActivity(remove=false){
  aidaFarmPetRunToken++;
  clearTimeout(aidaFarmPetTimer);clearInterval(aidaFarmPetFrameTimer);clearTimeout(aidaFarmPetTransitionTimer);aidaFarmPetTimer=0;aidaFarmPetFrameTimer=0;aidaFarmPetTransitionTimer=0;
  if(aidaFarmPetMotion){aidaFarmPetMotion.cancel();aidaFarmPetMotion=null}
  if(remove){aidaFarmPet?.remove();aidaFarmPet=null;aidaFarmPetSprite=null}
}
function scheduleAidaFarmPetPause(token){
  if(token!==aidaFarmPetRunToken||!aidaFarmPet)return;
  const idlePoses=[AIDA_FARM_PET_POSES.idleA,AIDA_FARM_PET_POSES.idleB,AIDA_FARM_PET_POSES.scratch,AIDA_FARM_PET_POSES.sit,AIDA_FARM_PET_POSES.lie,AIDA_FARM_PET_POSES.sleep];
  const pose=idlePoses[Math.floor(Math.random()*idlePoses.length)];
  const wait=pose===AIDA_FARM_PET_POSES.sleep?1900+Math.random()*1200:900+Math.random()*1500;
  transitionAidaFarmPetSprite(()=>setAidaFarmPetPose(AIDA_FARM_PET_POSES.idleA),token,()=>{
    if(pose===AIDA_FARM_PET_POSES.idleA){aidaFarmPetTimer=setTimeout(()=>moveAidaFarmPet(token),wait);return}
    aidaFarmPetTimer=setTimeout(()=>transitionAidaFarmPetSprite(()=>setAidaFarmPetPose(pose),token,()=>{
      aidaFarmPetTimer=setTimeout(()=>moveAidaFarmPet(token),wait);
    }),260);
  });
}
function moveAidaFarmPet(token){
  if(token!==aidaFarmPetRunToken||!shouldShowAidaFarmPet()){syncAidaFarmPet();return}
  const next=nextAidaFarmPetNode(aidaFarmPetNode),from=aidaFarmPetPoint(aidaFarmPetNode),to=aidaFarmPetPoint(next),dx=to.x-from.x,dy=to.y-from.y;
  const direction=Math.abs(dy)>Math.abs(dx)*.7?(dy>0?"front":"back"):(dx<0?"left":"right");
  const distance=Math.hypot(dx,dy),walkCycle=944/aidaFarmPetSpeed;
  const rawDuration=Math.max(2900,Math.min(7300,distance*20))/aidaFarmPetSpeed,duration=Math.max(walkCycle*2,Math.round(rawDuration/walkCycle)*walkCycle);
  transitionAidaFarmPetSprite(()=>setAidaFarmPetPose(AIDA_FARM_PET_POSES.idleA),token,()=>{
    aidaFarmPetTimer=setTimeout(()=>transitionAidaFarmPetSprite(()=>setAidaFarmPetWalkFrame(0,direction),token,()=>{
      if(token!==aidaFarmPetRunToken||!aidaFarmPet)return;
      let walkFrame=0;clearInterval(aidaFarmPetFrameTimer);
      aidaFarmPetFrameTimer=setInterval(()=>{walkFrame=(walkFrame+1)%8;setAidaFarmPetWalkFrame(walkFrame,direction)},118/aidaFarmPetSpeed);
      aidaFarmPetMotion=aidaFarmPet.animate([{transform:`translate3d(${from.x}px,${from.y}px,0)`},{transform:`translate3d(${to.x}px,${to.y}px,0)`}],{duration,easing:"linear",fill:"forwards"});
      aidaFarmPetMotion.onfinish=()=>{if(token!==aidaFarmPetRunToken)return;clearInterval(aidaFarmPetFrameTimer);aidaFarmPetFrameTimer=0;aidaFarmPetPreviousNode=aidaFarmPetNode;aidaFarmPetNode=next;aidaFarmPet.style.transform=`translate3d(${to.x}px,${to.y}px,0)`;aidaFarmPetMotion=null;if(aidaFarmPetAutoWalk)scheduleAidaFarmPetPause(token);else transitionAidaFarmPetSprite(()=>setAidaFarmPetPose(AIDA_FARM_PET_POSES.idleA),token)};
    }),220);
  });
}
function startAidaFarmPet(){
  const layer=$("aidaFarmPetLayer");if(!layer||aidaFarmPet)return;
  aidaFarmPet=document.createElement("div");aidaFarmPet.className="aida-farm-pet";
  aidaFarmPet.setAttribute("role","button");aidaFarmPet.setAttribute("aria-label","เปิดเมนูสัตว์ที่กำลังทดลอง");aidaFarmPet.tabIndex=0;
  aidaFarmPetSprite=document.createElement("div");aidaFarmPetSprite.className="aida-farm-pet-sprite";aidaFarmPet.appendChild(aidaFarmPetSprite);layer.appendChild(aidaFarmPet);
  const openActivePanel=()=>$("petTestActivePanel")?.classList.remove("hidden");
  aidaFarmPet.onclick=openActivePanel;aidaFarmPet.onkeydown=event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();openActivePanel()}};
  const start=aidaFarmPetPoint(aidaFarmPetNode);aidaFarmPet.style.transform=`translate3d(${start.x}px,${start.y}px,0)`;setAidaFarmPetPose(AIDA_FARM_PET_POSES.idleA);
  const token=++aidaFarmPetRunToken;aidaFarmPetTimer=setTimeout(()=>moveAidaFarmPet(token),1600);
}
function syncAidaFarmPet(){
  if(!shouldShowAidaFarmPet()){clearAidaFarmPetActivity(true);return}
  if(!aidaFarmPet)requestAnimationFrame(startAidaFarmPet);
}
function preloadAidaFarmPetSelection(){
  ["pose","side","front","back"].forEach(kind=>{const image=new Image();image.decoding="async";image.src=aidaFarmPetImage(kind)});
}
function resolveAidaFarmPetAssetBase(){
  const folder=aidaFarmPetType==="cat"?"cats":"dogs",prefix=aidaFarmPetType==="cat"?"cat":"dog",number=String(aidaFarmPetNumber).padStart(2,"0"),base=`${prefix}-${number}`;
  const candidates=[`pet-assets/${folder}/${base}`,base,`pet-assets/${base}`,`${folder}/${base}`];
  return new Promise(resolve=>{
    let index=0;
    const tryNext=()=>{
      if(index>=candidates.length){resolve("");return}
      const candidate=candidates[index++],image=new Image(),timeout=setTimeout(()=>{image.onload=image.onerror=null;tryNext()},3500);
      image.onload=()=>{clearTimeout(timeout);resolve(candidate)};
      image.onerror=()=>{clearTimeout(timeout);tryNext()};
      image.src=`${candidate}-pose-sheet.png?v=3`;
    };
    tryNext();
  });
}
function syncAidaFarmPetTesterVisibility(){
  const button=$("petTestBtn"),panel=$("petTestPanel"),activePanel=$("petTestActivePanel");if(!button)return;
  const ownAidaFarm=currentMember==="Aida"&&aidaFarmPetOwnerKey()==="aida"&&!$("gameScreen")?.classList.contains("hidden");
  button.classList.toggle("hidden",!ownAidaFarm);
  if(!ownAidaFarm){panel?.classList.add("hidden");activePanel?.classList.add("hidden")}
}
function restartAidaFarmPetSelection(){
  saveAidaFarmPetTestSettings();preloadAidaFarmPetSelection();clearAidaFarmPetActivity(true);aidaFarmPetNode=5;aidaFarmPetPreviousNode=-1;aidaFarmPetAutoWalk=true;syncAidaFarmPet();
}
async function beginAidaFarmPetTest(type,number){
  if(farmPlotPage!==0||$("gameScreen")?.classList.contains("plot-page-2"))setFarmPlotPage(0);
  aidaFarmPetType=type==="cat"?"cat":"dog";aidaFarmPetNumber=Math.max(1,Math.min(8,Number(number)||1));aidaFarmPetSpeed=1;aidaFarmPetAssetBase="";aidaFarmPetTestActive=false;
  $("petTestPanel")?.classList.add("hidden");$("petTestActivePanel")?.classList.add("hidden");
  const label=`${aidaFarmPetType==="cat"?"แมว":"หมา"}ตัวที่ ${aidaFarmPetNumber}`;if($("petTestActiveName"))$("petTestActiveName").textContent=`กำลังทดลอง${label}`;
  clearAidaFarmPetActivity(true);
  aidaFarmPetAssetBase=await resolveAidaFarmPetAssetBase();
  if(!aidaFarmPetAssetBase){alert(`ยังไม่พบไฟล์รูป${label}ใน GitHub กรุณาตรวจว่าอัปไฟล์ ${aidaFarmPetType==="cat"?"cat":"dog"}-${String(aidaFarmPetNumber).padStart(2,"0")}-pose-sheet.png แล้ว`);return}
  aidaFarmPetTestActive=true;
  restartAidaFarmPetSelection();
}
function stopAidaFarmPetTest(){
  $("petTestActivePanel")?.classList.add("hidden");aidaFarmPetTestActive=false;
  clearTimeout(aidaFarmPetTimer);clearInterval(aidaFarmPetFrameTimer);clearTimeout(aidaFarmPetTransitionTimer);if(aidaFarmPetMotion){aidaFarmPetMotion.cancel();aidaFarmPetMotion=null}
  if(!aidaFarmPet){clearAidaFarmPetActivity(true);return}
  const pet=aidaFarmPet,sprite=aidaFarmPetSprite,rect=pet.getBoundingClientRect(),direction=rect.left<innerWidth/2?"left":"right";setAidaFarmPetWalkFrame(0,direction);
  let frame=0;aidaFarmPetFrameTimer=setInterval(()=>{frame=(frame+1)%8;setAidaFarmPetWalkFrame(frame,direction)},118);
  pet.animate([{transform:pet.style.transform,opacity:1},{transform:`translate3d(${direction==="left"?-rect.width*2:innerWidth+rect.width}px,${Math.max(0,rect.top)}px,0)`,opacity:.2}],{duration:850,easing:"ease-in",fill:"forwards"}).onfinish=()=>{clearInterval(aidaFarmPetFrameTimer);clearAidaFarmPetActivity(true)};
}
function initializeAidaFarmPetTester(){
  const dogs=$("petTestDogList"),cats=$("petTestCatList");if(!dogs||!cats||dogs.children.length)return;
  const choices=type=>Array.from({length:8},(_,index)=>`<button class="pet-test-choice" type="button" data-pet-choice="${type}" data-pet-number="${index+1}">ตัวที่ ${index+1}</button>`).join("");dogs.innerHTML=choices("dog");cats.innerHTML=choices("cat");
  $("petTestBtn").onclick=()=>{if(aidaFarmPetTestActive){$("petTestActivePanel").classList.remove("hidden");return}$("petTestPanel").classList.toggle("hidden")};
  $("petTestCloseBtn").onclick=()=>$("petTestPanel").classList.add("hidden");
  document.querySelectorAll("[data-pet-choice]").forEach(button=>button.onclick=()=>beginAidaFarmPetTest(button.dataset.petChoice,button.dataset.petNumber));
  $("petTestContinueBtn").onclick=()=>$("petTestActivePanel").classList.add("hidden");$("petTestStopBtn").onclick=stopAidaFarmPetTest;
}
initializeAidaFarmPetTester();
const __drawBeforeAidaFarmPet=draw;
draw=function(){const result=__drawBeforeAidaFarmPet();syncAidaFarmPet();syncAidaFarmPetTesterVisibility();return result};
document.addEventListener("visibilitychange",()=>{if(document.hidden)clearAidaFarmPetActivity(true);else syncAidaFarmPet()});
window.addEventListener("resize",()=>{if(aidaFarmPet){clearAidaFarmPetActivity(true);syncAidaFarmPet()}});
