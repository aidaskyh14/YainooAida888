
const IMG={"fruit-peach": "images/fruit-peach.webp", "fruit-apple": "images/fruit-apple.webp", "fruit-orange": "images/fruit-orange.webp", "fruit-cherry": "images/fruit-cherry.webp", "flower-marigold": "images/flower-marigold.webp", "flower-hydrangea": "images/flower-hydrangea.webp", "flower-tulip": "images/flower-tulip.webp", "flower-rose": "images/flower-rose.webp", "flower-lavender": "images/flower-lavender.webp", "flower-lotus": "images/flower-lotus.webp", "flower-daisy": "images/flower-daisy.webp", "flower-butterflypea": "images/flower-butterflypea.webp", "flower-plumeria": "images/flower-plumeria.webp", "flower-hibiscus": "images/flower-hibiscus.webp", "flower-sunflower": "images/flower-sunflower.webp", "flower-orchid": "images/flower-orchid.webp", "grass-yellow": "images/forest-grass-yellow.webp", "grass-blue": "images/forest-grass-blue.webp", "grass-green": "images/forest-grass-green.webp", "grass-red": "images/forest-grass-red.webp", "grass-pink": "images/forest-grass-pink.webp", "item-stone": "images/forest-item-stone.webp", "hedge-fang": "images/house-hedge-fang.webp", "hedge-quills": "images/house-hedge-quills.webp", "hedge-claw": "images/house-hedge-claw.webp", "hedge-tail": "images/house-hedge-tail.webp", "crop-carrot": "images/crops-carrot-stage4.webp", "crop-corn": "images/crops-corn-stage4.webp", "crop-pumpkin": "images/crops-pumpkin-stage4.webp", "crop-tomato": "images/crops-tomato-stage4.webp", "crop-cabbage": "images/crops-cabbage-stage4.webp", "crop-potato": "images/crops-potato-stage4.webp", "crop-waterspinach": "images/crops-waterspinach-stage4.webp", "crop-chili": "images/crops-chili-stage4.webp", "fish-koi": "images/fishing-fish-koi.webp", "fish-vip-bg": "images/fishing-fish-vip-bg.webp", "fish-sunbathe": "images/fishing-fish-sunbathe.webp", "fish-trout": "images/fishing-fish-trout.webp", "fish-lobby-bg": "images/fishing-fish-lobby-bg.webp", "rod-sakura": "images/fishing-rod-sakura.webp", "float-sakura": "images/fishing-float-sakura.webp", "vip-card": "images/fishing-vip-card.webp", "fish-goldsheep": "images/fishing-fish-goldsheep.webp", "fish-angelshark": "images/fishing-fish-angelshark.webp", "catalog-spread-peach": "images/fishing-catalog-spread-peach.webp", "float-honey": "images/fishing-float-honey.webp", "fish-pond-bg": "images/fishing-fish-pond-bg.webp", "rod-bamboo": "images/fishing-rod-bamboo.webp", "fish-angelfish": "images/fishing-fish-angelfish.webp", "fish-seahorse": "images/fishing-fish-seahorse.webp", "fish-strawberry": "images/fishing-fish-strawberry.webp", "fish-stonefish": "images/fishing-fish-stonefish.webp", "fish-moldyorange": "images/fishing-fish-moldyorange.webp", "catalog-spread-mint": "images/fishing-catalog-spread-mint.webp", "fish-shihtzu": "images/fishing-fish-shihtzu.webp", "rod-moon": "images/fishing-rod-moon.webp", "fish-guppy": "images/fishing-fish-guppy.webp", "fish-mola": "images/fishing-fish-mola.webp", "catalog-spread-blue": "images/fishing-catalog-spread-blue.webp", "seal-gold": "images/fishing-seal-gold.webp", "fish-betta": "images/fishing-fish-betta.webp", "fish-manta": "images/fishing-fish-manta.webp", "fish-leaf": "images/fishing-fish-leaf.webp", "seal-gray": "images/fishing-seal-gray.webp", "rod-honey": "images/fishing-rod-honey.webp", "fish-clownloach": "images/fishing-fish-clownloach.webp", "fish-durian": "images/fishing-fish-durian.webp", "fish-catshark": "images/fishing-fish-catshark.webp", "fish-elephantnose": "images/fishing-fish-elephantnose.webp", "fish-catfish": "images/fishing-fish-catfish.webp", "catalog-spread-gold": "images/fishing-catalog-spread-gold.webp", "fish-boxfish": "images/fishing-fish-boxfish.webp", "fish-hamster": "images/fishing-fish-hamster.webp", "float-moon": "images/fishing-float-moon.webp", "item-crabscissors": "images/fishing-item-crabscissors.webp", "fish-discus": "images/fishing-fish-discus.webp", "catalog-cover": "images/fishing-catalog-cover.webp", "fish-triggerfish": "images/fishing-fish-triggerfish.webp", "fish-puffer": "images/fishing-fish-puffer.webp", "float-bamboo": "images/fishing-float-bamboo.webp", "fish-hammerhead": "images/fishing-fish-hammerhead.webp", "fish-moneybag": "images/fishing-fish-moneybag.webp", "fish-eel": "images/fishing-fish-eel.webp", "fish-unicorn": "images/fishing-fish-unicorn.webp", "fish-mudskipper": "images/fishing-fish-mudskipper.webp", "fish-arowana": "images/fishing-fish-arowana.webp", "item-cake": "images/item-cake.webp", "item-coconut": "images/item-coconut.webp", "item-angelwings": "images/item-angelwings.webp", "fert-fruit-premium": "images/fruit-fert-fruit-premium.webp", "honey-face-happy": "images/honey-face-happy.webp", "honey-face-oops": "images/honey-face-oops.webp"};
const MIN=60000;
const Host=parent.__HOST;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ME=JSON.parse(Host?.get('s3user')||'{}').name||'ฉัน';
const FISH={
guppy:['ปลาหางนกยูง',1,1.00,1.80],mudskipper:['ปลาตีน',1,1.00,2.00],seahorse:['ม้าน้ำ',1,1.20,2.20],betta:['ปลากัด',1,1.20,2.40],
boxfish:['ปลาปักเป้ากล่อง',1,1.50,2.80],puffer:['ปลาปักเป้าจุด',1,1.50,3.00],leaf:['ปลาใบไม้',1,1.80,3.20],elephantnose:['ปลาจมูกช้าง',1,2.00,3.50],
moldyorange:['ปลาส้มขึ้นรา',2,3.00,4.50],hamster:['ปลาแฮมสเตอร์',2,3.00,4.80],angelfish:['ปลาเทวดา',2,3.20,5.00],clownloach:['ปลาหมูอินโด',2,3.50,5.20],
triggerfish:['ปลาวัวลายจุด',2,3.50,5.50],discus:['ปลาปอมปาดัวร์',2,4.00,5.80],shihtzu:['ปลาหมาชิสุ',2,4.00,6.00],durian:['ปลาทุเรียน',2,4.50,6.50],
eel:['ปลาไหล',3,5.50,7.50],trout:['ปลาเทราต์',3,6.00,8.00],stonefish:['ปลาหิน',3,6.00,8.50],moneybag:['ปลาถุงเงิน',3,6.50,8.80],
sunbathe:['ปลาตากแดด',3,7.00,9.00],koi:['ปลาคาร์ฟ',3,7.00,9.50],catfish:['ปลาดุกช่าง',3,7.50,10.00],arowana:['ปลาอโรวาน่า',3,8.00,10.00],
catshark:['ฉลามแมว',4,50,60],angelshark:['ฉลามนางฟ้า',4,55,65],manta:['กระเบนราหู',4,60,70],hammerhead:['ฉลามหัวค้อน',4,65,78],
mola:['ปลาโมลา',5,70,85],strawberry:['ปลาสตรอว์เบอร์รี',5,78,90],unicorn:['ปลายูนิคอร์น',5,85,95],goldsheep:['ปลาแกะทอง',5,90,100]};
const TIER={1:[],2:[],3:[]};for(const k in FISH){const t=FISH[k][1];if(TIER[t])TIER[t].push(k)}
const RODS={bamboo:{n:'เบ็ดไผ่ลมหวน',e:'🎋',cnt:[85,15,0],tier:[55,35,10]},moon:{n:'เบ็ดจันทร์เสี้ยว',e:'🌙',cnt:[95,5,0],tier:[40,35,25]},
honey:{n:'เบ็ดน้ำผึ้งหวานเจี๊ยบ',e:'🍯',cnt:[60,35,5],tier:[70,25,5]},sakura:{n:'เบ็ดซากุระพลิ้ว',e:'🌸',cnt:[80,20,0],tier:[50,35,15]}};
const RK=Object.keys(RODS);
const VIPL=[['catshark',80],['angelshark',65],['manta',50],['hammerhead',40],['mola',30],['strawberry',22],['unicorn',15],['goldsheep',10]];
const SETS=[{n:'ตู้ปลาจิ๋ว',f:['guppy','betta','seahorse','mudskipper'],m:1,it:'rod',q:20},
{n:'ปักเป้าป่วน',f:['boxfish','puffer','leaf','elephantnose'],m:1,it:'crab',q:20},
{n:'ก๊วนเพี้ยน',f:['moldyorange','hamster','shihtzu','durian'],m:1.25,it:'cake',q:1000},
{n:'ตู้ปลาสวยงาม',f:['angelfish','clownloach','discus','triggerfish'],m:1.25,it:'coconut',q:1000},
{n:'ลำธารก้นบ่อ',f:['eel','trout','stonefish','catfish'],m:1.5,it:'wings',q:20},
{n:'ปลานำโชค',f:['moneybag','sunbathe','koi','arowana'],m:1.5,it:'fertp',q:1000},
{n:'ทีมฉลาม',f:['catshark','angelshark','hammerhead','manta'],m:2,it:'vip',q:10},
{n:'ตำนาน',f:['mola','strawberry','unicorn','goldsheep'],m:3,it:'vip',q:20}];
const ITEM={rod:['เบ็ด (สุ่มแบบ)','rod-bamboo'],crab:['กรรไกรปูจอมแสบ','item-crabscissors'],cake:['เค้ก','item-cake'],coconut:['มะพร้าว','item-coconut'],
wings:['ปีกนางฟ้า','item-angelwings'],fertp:['ปุ๋ยผลไม้พรีเมียม','fert-fruit-premium'],vip:['บัตร VIP','vip-card']};
const LADDER=[10,20,30,40,50,60,70,80,90,100,110,120];
const MERIT=[1000,2000,3000,5000,7500,10000,12500,15000,17500,20000,20000,20000];
const SPREADS=['blue','mint','peach','gold'];
const PONDS={n1:{k:'n',name:'บ่อทั่วไป 1',bg:'fish-pond-bg'},n2:{k:'n',name:'บ่อทั่วไป 2',bg:'fish-pond-bg'},v1:{k:'v',name:'บ่อ VIP 1',bg:'fish-vip-bg'},v2:{k:'v',name:'บ่อ VIP 2',bg:'fish-vip-bg'}};
const SEATPOS={n:[[.115,.23,'l'],[.115,.43,'l'],[.115,.64,'l'],[.885,.23,'r'],[.885,.43,'r'],[.885,.64,'r']],
v:[[.15,.28,'l'],[.15,.40,'l'],[.15,.53,'l'],[.15,.67,'l'],[.86,.28,'r'],[.86,.40,'r'],[.86,.53,'r'],[.86,.67,'r']]};
const FLX={n:{l:.34,r:.66},v:{l:.33,r:.67}};
const NAMES=['มะปราง','น้องฝน','พี่ต้น','แป้งร่ำ','ใบเตย','จุ๊บแจง','นุ่นนิ่ม','เจ้าขุน','ปลายฟ้า','ขิมหวาน','โอ๊ตโอ๊ต','น้ำหวาน','พลอยใส','ต้าร์','ส้มจี๊ด','บัวลอย'];
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=w=>{let s=w.reduce((a,b)=>a+b,0),r=Math.random()*s;for(let i=0;i<w.length;i++){if((r-=w[i])<0)return i}return w.length-1};
const ri=a=>a[Math.floor(Math.random()*a.length)];
const f2=n=>n.toFixed(2);
const nf=n=>Math.round(n).toLocaleString('en-US');
const mm=ms=>{ms=Math.max(0,ms);const s=Math.ceil(ms/MIN*60);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const $=id=>document.getElementById(id);
function wt(k){const f=FISH[k];return Math.round(rnd(f[2],f[3])*100)/100}

/* ---------- state ---------- */
const S={role:Host?.admin?'admin':'player',screen:'lobby',pond:null,open:false,day:0,merit:0,
bag:{rod:Object.fromEntries(RK.map(k=>[k,0])),crab:0,vip:0},myCut:0,cutTaken:{},meTaken:0,pondToday:null,cdEnd:0,tab:'today',lucky:0,
seats:{n1:Array(6).fill(null),n2:Array(6).fill(null),v1:Array(8).fill(null),v2:Array(8).fill(null)},board:{},hist:[],gifts:[],vipUsed:0,vipCd:0,cat:Object.fromEntries(Object.keys(FISH).map(k=>[k,{n:0,best:0}])),claimed:Array(8).fill(0),mini:false};
let serverOffset=0,world=null,quota={},busy=false,stopWatch=null;
const now=()=>Date.now()+serverOffset;
function project(){
 const g=JSON.parse(Host.get('s3all-v1')||'{}'),book=g.sub?.fishing||{};S.merit=g.merit||0;S.bag={rod:Object.fromEntries(RK.map(k=>[k,g.bag?.rod?.[k]||0])),crab:g.bag?.fishing?.crab||0,vip:g.bag?.fishing?.vip||0};S.cat=Object.fromEntries(Object.keys(FISH).map(k=>[k,book.cat?.[k]||{n:0,best:0}]));S.claimed=book.claimed||Array(8).fill(0);S.pondToday=book.pondToday||null;
 for(const[group,items]of Object.entries(g.bag||{}))for(const[k,n]of Object.entries(items))INV[group+'-'+k]=n;
 INV['item-stone']=g.bag?.forest?.stone||0;
 if(world){S.gifts=[];S.open=world.mode==='open'||(world.mode!=='closed'&&!world.closed&&(new Date(now()+7*3600e3).getUTCHours()>=11&&new Date(now()+7*3600e3).getUTCHours()<17||new Date(now()+7*3600e3).getUTCHours()>=21||new Date(now()+7*3600e3).getUTCHours()<7));S.day=world.day;S.seats=structuredClone(world.seats);for(const seats of Object.values(S.seats))for(const seat of seats)if(seat){seat.me=seat.uid===Host.uid;if(seat.ph==='wait'&&seat.t<=now())seat.ph='hook';if(seat.ph==='hook')seat.t=seat.hookUntil;}S.board=Object.fromEntries(Object.entries(world.board||{}).map(([uid,row])=>[uid,row.w]));S.hist=(world.hist||[]).map(h=>({...h,d:h.day}));}
 S.myCut=quota.cut||0;S.meTaken=quota.taken||0;S.cdEnd=quota.cd||0;S.vipCd=quota.vipCd||0;S.vipUsed=quota.vipCount||0;S.lucky=quota.lucky||0;
}
async function act(input){if(busy)return null;busy=true;const sent=Date.now();try{const out=await Host.cloud('fishing',input);serverOffset=out.serverNow-(sent+Date.now())/2;world=out.race;quota=out.quota;project();if(S.screen==='pond')updatePond();else{renderLobby();updateLobby();}return out;}catch(e){ann(e.message,false);return null;}finally{busy=false;}}

function luckyRod(){return RK[S.lucky]}

/* ---------- rolls ---------- */
function rollNormal(rk){const r=RODS[rk];let c=r.cnt.slice(),t=r.tier.slice();
 if(rk===luckyRod()){c=[Math.max(0,c[0]-12),c[1]+9,c[2]+3];t=[Math.max(0,t[0]-10),t[1],t[2]+10]}
 const n=pick(c)+1,out=[];let mx=1;
 for(let i=0;i<n;i++){const tier=pick(t)+1;mx=Math.max(mx,tier);const k=ri(TIER[tier]);out.push({k,w:wt(k)})}
 return{fish:out,tier:mx}}
function vipOdds(st,rk){const p=VIPL[Math.min(st,VIPL.length-1)][1];return(p*(rk===luckyRod()?1.15:1))/100}
function vipTarget(st){return VIPL[Math.min(st,VIPL.length-1)][0]}

/* ---------- ui helpers ---------- */
let annT;function ann(t,ok=true){const a=$('ann');$('anntx').textContent=t;$('annimg').src=IMG[ok?'honey-face-happy':'honey-face-oops'];a.classList.toggle('err',!ok);a.classList.add('show');clearTimeout(annT);annT=setTimeout(()=>a.classList.remove('show'),2600)}
function sheet(h){$('sheet').innerHTML=h;$('sheet').classList.add('on');$('shade').classList.add('on');$('sheet').scrollTop=0}
function closeSheet(){$('sheet').classList.remove('on');$('shade').classList.remove('on')}
$('shade').onclick=closeSheet;
function ask(title,hint,yes,fn){sheet(`<h3>${title}</h3><div class="hint">${hint}</div><div class="btns"><button class="ghost" onclick="closeSheet()">ไว้ก่อน</button><button class="big" id="yesb">${yes}</button></div>`);$('yesb').onclick=()=>{closeSheet();fn()}}
function fitStage(){const st=$('stage'),vw=innerWidth,vh=innerHeight,ar=941/1672;let w=vw,h=w/ar;if(h>vh){h=vh;w=h*ar}st.style.width=w+'px';st.style.height=h+'px'}
addEventListener('resize',()=>{fitStage();if($('book').classList.contains('on'))renderBook()});

/* ---------- top bar ---------- */
function renderTop(){$('top').innerHTML='';}

/* ---------- lobby ---------- */
function boardRows(){return Object.entries(S.board).filter(([n,w])=>w>0||n===Host.uid).sort((a,b)=>b[1]-a[1]);}
function renderLobby(){const st=$('stage');document.documentElement.style.setProperty('--bg',`url(${IMG['fish-lobby-bg']})`);
 st.style.backgroundImage=`url(${IMG['fish-lobby-bg']})`;const lk=S.open?'':' 🔒';
 st.innerHTML=`<div class="sign ${S.open?'':'locked'}" id="pnorm" style="left:27%;top:24%"><div class="plank">🎣 บ่อทั่วไป${lk}<small>${S.pondToday?'วันนี้: '+PONDS[S.pondToday].name.replace('บ่อทั่วไป ','บ่อ '):'เลือกได้วันละ 1 บ่อ'}</small></div><div class="post"></div><div class="rip"></div></div>
 <div class="sign vip ${S.open?'':'locked'}" id="pvip" style="left:73%;top:30%;animation-delay:-1.4s"><div class="plank">👑 บ่อ VIP${lk}<small>${S.vipCd>Date.now()?'⏳ พักอยู่':'บัตรรอบนี้ '+S.vipUsed+'/5'}</small></div><div class="post"></div><div class="rip"></div></div>`;
 $('pnorm').onclick=()=>pondPicker('n');$('pvip').onclick=()=>pondPicker('v');renderLobbyBar()}
function boardSheet(){sheet(`<h3>⚖️ บอร์ดน้ำหนัก</h3><div class="tabs" style="padding:0 0 .3rem"><button class="tab ${S.tab==='today'?'on':''}" data-t="today">วันนี้</button><button class="tab ${S.tab==='hist'?'on':''}" data-t="hist">🏆 ท็อป 5 ย้อนหลัง</button></div><div id="bwrap" style="display:flex;flex-direction:column"></div><div class="hint" style="margin-top:.4rem">อ่านข้อมูลเฉพาะตอนเปิดหน้านี้ · ปิดแล้วหยุดทันที</div><div class="btns"><button class="ghost" onclick="closeSheet()">ปิด</button></div>`);
 $('sheet').querySelectorAll('.tab').forEach(b=>b.onclick=()=>{S.tab=b.dataset.t;boardSheet()});updateLobby()}
function updateLobby(){const w=$('bwrap');if(!w)return;
 if(S.tab==='today'){
  if(!S.open){w.innerHTML=`<div class="closedbox">🌙 บ่อปิดอยู่<br><small>เปิด 11:00–17:00 และ 21:00–07:00<br>บ่อปิดตามเวลาไทย</small></div>`;return}
  const rows=boardRows();
  const html=rows.map(([n,v],i)=>`<div class="row ${i<5?'t5':''} ${n===Host.uid?'me':''}"><span class="rk">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><b>${esc(world?.board?.[n]?.name||ME)+(n===Host.uid?' (ฉัน)':'')}</b><span class="w">${f2(v)} lb</span></div>`).join('');
  w.innerHTML=`<div class="bnote">น้ำหนักรวมวันนี้ · ทุกบ่อรวมกัน · รีเซ็ตเที่ยงคืน · ท็อป 5 รับ 5,000+ กุศล</div><div class="blist" id="blist" style="max-height:52vh">${html}</div>`;
 }else{
  const html=[...S.hist].reverse().map(d=>`<div class="day"><h4>📅 ${esc(d.d)}</h4>${d.top.map((p,i)=>`<div class="r ${p.name===ME?'me':''}"><span>${['🥇','🥈','🥉','4','5'][i]}</span><b>${esc(p.name)}</b><span>${f2(p.w)} lb</span>${p.st>1?`<span class="s">🔥${p.st} วัน</span>`:''}<span class="m">+${nf(p.rw)}</span>${p.name===ME?(S.gifts.some(g=>g.d===d.d)?'<span class="m">🎁</span>':'<span class="m">✅</span>'):''}</div>`).join('')}</div>`).join('');
  w.innerHTML=`<div class="bnote">ติดท็อป 5 วันแรก 5,000 กุศล · ติดต่อกันบวกวันละ 1,000 · ดูย้อนหลัง 5 วัน<br>รางวัลส่งเป็นของขวัญ 🎁 ให้เองทุกเที่ยงคืน · รับรางวัลที่ไปรษณีย์</div><div class="blist" style="max-height:52vh">${html}</div>`}}
function occ(p){return S.seats[p].filter(Boolean).length+'/'+S.seats[p].length}
function renderLobbyBar(){const b=$('bar');const adm=S.role==='admin';
 b.innerHTML=`<div class="ibtns"><button class="ib" id="brdb"><span class="rbtn">⚖️</span><span>บอร์ด</span></button><button class="ib" id="bookbtn"><span class="rbtn">📖</span><span>สมุดปลา</span></button><button class="ib" id="crfb"><span class="rbtn">🔨</span><span>คราฟ</span></button><button class="ib" id="toolbtn"><span class="rbtn">🧰</span><span>กระเป๋า</span></button>${S.gifts.length?`<button class="ib" id="giftb"><span class="rbtn">🎁</span><span class="badge">${S.gifts.length}</span><span>ของขวัญ</span></button>`:''}${adm?'<button class="ib" id="admb"><span class="rbtn">🛠️</span><span>แอดมิน</span></button>':''}</div>`;
 $('brdb').onclick=boardSheet;$('bookbtn').onclick=openBook;$('crfb').onclick=craftMenu;$('toolbtn').onclick=tools;
 if($('giftb'))$('giftb').onclick=giftSheet;if($('admb'))$('admb').onclick=adminPanel}
function giftSheet(){closeSheet();Host.openMail();}
function pondPicker(k){if(!S.open)return ann('บ่อปิดอยู่ เปิด 11:00–17:00 และ 21:00–07:00',false);
 const ps=k==='n'?['n1','n2']:['v1','v2'];
 const card=p=>{const lock=k==='n'&&S.pondToday&&S.pondToday!==p;return`<div class="pcard ${k==='v'?'vip':''} ${lock?'locked':''}" data-p="${p}"><span class="e">${k==='v'?'👑':'🎣'}</span><div>${PONDS[p].name}${lock?' 🔒':''}${S.pondToday===p?' ⭐':''}<small>นั่งอยู่ <span id="oc-${p}">${occ(p)}</span> คน</small></div></div>`};
 const rest=k==='v'&&S.vipCd>Date.now();
 if(rest){sheet(`<h3>👑 บ่อ VIP พักอยู่</h3><div class="catch"><div class="fcard" style="width:12rem"><img src="${IMG['vip-card']}" alt="" style="filter:grayscale(.6)"><div class="w">อีก ${mm(S.vipCd-Date.now())} นาที</div></div></div><div class="hint">ใช้บัตรครบ 5 ใบแล้ว บ่อ VIP พัก 30 นาที<br>ระหว่างนี้ไปตกบ่อทั่วไป ปลูกผัก หรือเล่นอย่างอื่นก่อนนะ<br>พักเสร็จใช้ได้อีก 5 ใบ · ทั้งวันใช้กี่รอบก็ได้</div><div class="btns"><button class="big" onclick="closeSheet()">โอเค</button></div>`);return}
 sheet(`<h3>${k==='v'?'👑 บ่อ VIP':'🎣 บ่อทั่วไป'}</h3><div class="hint">${k==='v'?'บ่อละ 8 ท่า · ใช้บัตร VIP 1 ใบต่อ 1 รอบภารกิจ<br>ใช้ได้ติดกัน 5 ใบ แล้วพัก 30 นาที · รอบนี้ใช้ไป '+S.vipUsed+'/5 ใบ':'บ่อละ 6 ท่า · เลือกได้วันละ 1 บ่อ เปลี่ยนได้หลังเที่ยงคืน'}</div>${ps.map(card).join('')}`);
 $('sheet').querySelectorAll('.pcard').forEach(c=>c.onclick=()=>{closeSheet();goPond(c.dataset.p)})}
function goPond(p){if(!S.open)return ann('บ่อปิดอยู่ เปิด 11:00–17:00 และ 21:00–07:00',false);
 const v=PONDS[p].k==='v';const myp=mySeatPond();
 if(myp&&myp!==p)return ann('ยังนั่งตกอยู่ที่'+PONDS[myp].name,false);
 if(!v){if(S.pondToday&&S.pondToday!==p)return ann('วันนี้เลือก'+PONDS[S.pondToday].name+'ไปแล้ว เปลี่ยนได้หลังเที่ยงคืน',false);
  if(!S.pondToday)return ask('เลือก'+PONDS[p].name+'สำหรับวันนี้?','บ่อทั่วไปเลือกได้วันละ 1 บ่อ<br>เลือกแล้วเปลี่ยนไม่ได้จนถึงเที่ยงคืน (เวลาไทย)','เลือกบ่อนี้',()=>enter(p))}
 enter(p)}
function enter(p){S.screen='pond';S.pond=p;render()}

/* ---------- pond ---------- */
function mySeatPond(){for(const p in S.seats)if(S.seats[p].some(x=>x&&x.me))return p;return null}
function mySeat(){const p=mySeatPond();if(!p)return null;const i=S.seats[p].findIndex(x=>x&&x.me);return{p,i,s:S.seats[p][i]}}
function renderPond(){const p=S.pond,k=PONDS[p].k,st=$('stage'),bg=IMG[PONDS[p].bg];
 document.documentElement.style.setProperty('--bg',`url(${bg})`);st.style.backgroundImage=`url(${bg})`;
 let h=`<svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none">${SEATPOS[k].map((_,i)=>`<line id="ln${i}" x1="0" y1="0" x2="0" y2="0" vector-effect="non-scaling-stroke" style="display:none"/>`).join('')}</svg>`;
 SEATPOS[k].forEach(([x,y,sd],i)=>{h+=`<div class="dock" id="dk${i}" style="left:${x*100}%;top:${y*100}%"><span class="tag" id="tg${i}"></span><img class="rod ${sd}" id="rd${i}" alt="" style="display:none"></div>
 <div class="float" id="fl${i}" style="left:${FLX[k][sd]*100}%;top:${(y+.012)*100}%;display:none"><img id="fi${i}" alt=""></div>`});
 if(k==='v')h+=`<div class="mission" id="mis"></div>`;
 st.innerHTML=h;barKey='';
 SEATPOS[k].forEach((_,i)=>{$('dk'+i).onclick=()=>tapDock(i);$('fl'+i).onclick=()=>tapFloat(i)});
 updatePond()}
function updatePond(){const p=S.pond,k=PONDS[p].k,seats=S.seats[p];const ms=mySeat();const meFishing=ms&&ms.p===p&&(ms.s.ph==='wait'||ms.s.ph==='hook');
 SEATPOS[k].forEach(([x,y,sd],i)=>{const s=seats[i],tg=$('tg'+i),rd=$('rd'+i),fl=$('fl'+i),ln=$('ln'+i);
  if(!s){tg.className='tag empty';tg.textContent='＋ ว่าง';rd.style.display='none';fl.style.display='none';ln.style.display='none';return}
  tg.className='tag'+(s.me?' me':'');tg.textContent=s.me?'⭐ ฉัน':s.who;
  rd.style.display='';rd.src=IMG['rod-'+s.rod];
  const line=s.ph==='wait'||s.ph==='hook';
  fl.style.display=line?'':'none';ln.style.display=line?'':'none';
  if(line){$('fi'+i).src=IMG['float-'+s.rod];fl.classList.toggle('hook',s.ph==='hook');
   const fx=FLX[k][sd];ln.setAttribute('x1',(sd==='l'?x+.075:x-.075)*100);ln.setAttribute('y1',(y-.055)*100);ln.setAttribute('x2',fx*100);ln.setAttribute('y2',(y+.008)*100);
   let c=fl.querySelector('.cut');const can=k==='n'&&meFishing&&!s.me;
   if(can&&!c){c=document.createElement('span');c.className='cut';c.textContent='✂️';fl.appendChild(c)}if(!can&&c)c.remove()}});
 if(k==='v')updateMission();
 renderPondBar()}
function updateMission(){const m=$('mis');if(!m)return;const ms=mySeat();const run=ms&&ms.p===S.pond&&ms.s.vip;
 if(!run){m.className='mission idle';m.innerHTML=`<img src="${IMG['vip-card']}" alt=""><div><div class="t">แตะท่าว่าง แล้วใช้บัตร VIP 1 ใบเริ่มภารกิจ</div><div class="s">ทำภารกิจทีละด่าน · ด่านละ ❤️❤️ พลาดได้ 1 ครั้ง · พลาดครบ 2 ครั้งจบรอบ · ที่นี่ตัดเบ็ดไม่ได้</div></div>`;return}
 const s=ms.s,tk=vipTarget(s.stage);
 m.className='mission';m.innerHTML=`<img src="${IMG['fish-'+tk]}" alt=""><div><div class="t">ด่าน ${s.stage+1} · ตก${FISH[tk][0]}ให้ได้ <span style="white-space:nowrap">${(s.hearts||2)>1?'❤️❤️':'❤️🤍'}</span></div><div class="s">สะสมรอบนี้ ${f2(s.tot)} lb · บัตรเหลือ ${mm(s.card-Date.now())} นาที</div></div>`}
let barKey='';
function renderPondBar(force){const b=$('bar'),ms=mySeat(),now=Date.now()+serverOffset,k=PONDS[S.pond].k;let mid='',key='',cd=0;
 if(ms&&ms.p===S.pond){const s=ms.s;key=s.ph+(s.vip?'v'+s.stage:'');
  if(s.ph==='wait'){cd=s.t-now;mid=`<span class="big info">🎣 รอปลากิน <span id="cd"></span></span>`}
  else if(s.ph==='hook'){cd=s.t-now;mid=`<button class="big hot" id="hookb">❗ รับปลา! <small id="cd"></small></button>`}
  else if(s.ph==='idle')mid=`<button class="big ${s.vip?'gold':''}" id="castb">${s.vip?'🎣 หย่อนเบ็ดด่าน '+(s.stage+1):'🎣 หย่อนเบ็ดใหม่'}</button>`;
 }else if(ms){key='else';mid=`<span class="big info">นั่งอยู่ที่${PONDS[ms.p].name}</span>`}
 else if(S.cdEnd>now){key='cd';cd=S.cdEnd-now;mid=`<span class="big info">😴 พักก่อนตกต่อ <span id="cd"></span></span>`}
 else{key='free';mid=`<span class="big info">แตะท่าที่ว่าง เพื่อนั่งตกปลา</span>`}
 key+='|'+S.pond+'|'+S.myCut+'|'+S.role+'|'+S.lucky;
 if(key===barKey&&!force){const c=$('cd');if(c)c.textContent=mm(cd);return}
 barKey=key;
 const lk=S.role==='admin'?`<button class="chip adm" id="luckyInfo">🍀 เบ็ดนำโชค: ${RODS[luckyRod()].n} ⓘ</button>`:'';
 b.innerHTML=`<div class="lobbyrow"><button class="rbtn" id="homeb" aria-label="กลับล็อบบี้">🏠</button>${mid}<button class="rbtn" id="toolbtn" aria-label="กระเป๋า">🧰</button>${S.role==='admin'?'<button class="rbtn" id="admb2" aria-label="แผงแอดมิน">🛠️</button>':''}</div><div class="lobbyrow"><span class="chip">${k==='v'?'👑':'🎣'} ${PONDS[S.pond].name}${k==='n'?' · ✂️ '+(30-S.myCut)+'/30':''}</span>${lk}</div>`;
 const c=$('cd');if(c)c.textContent=mm(cd);
 if($('luckyInfo'))$('luckyInfo').onclick=()=>sheet('<h3>🍀 เบ็ดนำโชคชั่วโมงนี้</h3><p><b>'+RODS[luckyRod()].n+'</b></p><p>บ่อทั่วไป: เพิ่มโอกาสได้ปลา 2–3 ตัวและปลาระดับสูง</p><p>บ่อ VIP: โอกาสสำเร็จเดิม ×1.15 (เพิ่มแบบสัมพัทธ์ 15%)</p><p>สุ่มชนิดเบ็ดใหม่ในแต่ละชั่วโมง ไม่ต้องกดเปิดโบนัส</p>');
 $('homeb').onclick=()=>{S.screen='lobby';S.pond=null;render()};$('toolbtn').onclick=tools;
 if($('skipb'))$('skipb').onclick=()=>{const m=mySeat();if(m){m.s.t=Date.now();tick()}};
 if($('skipcd'))$('skipcd').onclick=()=>{S.cdEnd=0;updatePond()};
 if($('hookb'))$('hookb').onclick=collect;if($('admb2'))$('admb2').onclick=adminPanel;
 if($('castb'))$('castb').onclick=()=>{const m=mySeat();if(m)chooseRod(m.p,m.i)}}
async function tapDock(i){const p=S.pond,s=S.seats[p][i];if(s){if(s.me){if(s.ph==='idle')chooseRod(p,i);else if(s.ph==='hook')collect();else ann('รอปลากินอยู่ค่ะ');}else ann(s.who+' นั่งอยู่ท่านี้');return;}
 const sit=async()=>{if(await act({type:'sit',pond:p,seat:i}))chooseRod(p,i);};if(PONDS[p].k==='v')ask('ใช้บัตร VIP 1 ใบ?','บัตรใช้ได้หนึ่งชั่วโมง ทำภารกิจ 8 ด่าน','ใช้บัตร',sit);else await sit();}

function chooseRod(p,i){const s=S.seats[p][i];
 const o=RK.map(r=>`<div class="opt ${S.bag.rod[r]?'':'off'}" data-r="${r}"><img src="${IMG['rod-'+r]}" alt=""><div>${RODS[r].e} ${RODS[r].n}</div><span>มี ${S.bag.rod[r]} อัน</span></div>`).join('');
 sheet(`<h3>เลือกเบ็ด</h3><div class="hint">หย่อน 1 ครั้งใช้เบ็ด 1 อัน · รอปลา${s.vip?' 5 นาที (บ่อ VIP)':' 10 นาที'}<br>เบ็ดแต่ละแบบมีดวงต่างกัน ลองเดาเอาเองนะ 😉</div><div class="opts">${o}</div><div class="btns"><button class="ghost" id="leaveb">${s.vip?'ปิด':'ลุกจากท่า'}</button></div>`);
 $('sheet').querySelectorAll('.opt').forEach(x=>x.onclick=()=>{const r=x.dataset.r;if(!S.bag.rod[r])return ann('เบ็ดแบบนี้หมดแล้ว',false);closeSheet();cast(p,i,r)});
 $('leaveb').onclick=()=>{closeSheet();if(!s.vip&&s.ph==='idle'){act({type:'leave'})}}}
async function cast(p,i,r){if(await act({type:'cast',rod:r}))ann('หย่อนเบ็ดแล้ว '+RODS[r].e+' รอปลากินนะ');}
function tapFloat(i){const s=S.seats[S.pond][i];if(!s)return;if(s.me){if(s.ph==='hook')collect();return;}ask('✂️ ตัดเบ็ด '+esc(s.who)+'?','ใช้กรรไกรปู 1 อัน จำกัดวันละ 30 ครั้ง','ตัดเลย',async()=>{if(await act({type:'cut',pond:S.pond,seat:i})){snip(i);ann('ตัดเบ็ดสำเร็จ');}});}

function snip(i){const fl=$('fl'+i);if(!fl)return;const im=document.createElement('img');im.className='snip';im.src=IMG['item-crabscissors'];im.style.left=fl.style.left;im.style.top=fl.style.top;$('stage').appendChild(im);setTimeout(()=>im.remove(),1200)}

/* ---------- collect + minigame ---------- */
async function collect(){if(S.mini)return;const out=await act({type:'prepare'});if(!out)return;const challenge=out.challenge;S.mini=true;const m=$('mini');m.innerHTML=`<div class="mcard"><h3>แตะเมื่อเข็มอยู่ในโซนเขียว</h3><div class="track"><div class="zone" style="left:${challenge.zone}%;width:${challenge.width}%"></div><div class="needle" id="ndl"></div></div><button class="big tapbtn" id="tapb">แตะ!</button><div class="hint">แตะได้ครั้งเดียว</div></div>`;m.classList.add('on');let stopped=false,raf;
 const loop=()=>{if(stopped)return;const phase=((now()-challenge.startedAt)%challenge.period)/challenge.period;const x=(phase<.5?phase*2:2-phase*2)*100;$('ndl').style.left=x+'%';raf=requestAnimationFrame(loop);};loop();
 $('tapb').onpointerdown=async e=>{e.preventDefault();if(stopped)return;stopped=true;cancelAnimationFrame(raf);const hitAt=now();$('tapb').disabled=true;const result=await act({type:'collect',token:challenge.token,hitAt});m.classList.remove('on');S.mini=false;if(!result)return;const cards=(result.caught||[]).map(f=>`<div class="fcard"><img src="${IMG['fish-'+f.k]}">${FISH[f.k][0]}<div class="w">${f2(f.w)} lb</div></div>`).join('');sheet(`<h3>${result.success?'🎉 ได้ปลาแล้ว!':'💦 ปลาหลุด'}</h3><div class="catch">${cards}</div><div class="total">+${f2(result.total||0)} lb</div><div class="hint">น้ำหนักและสมุดปลาบันทึกบนคลาวด์แล้ว</div><div class="btns"><button class="big" onclick="closeSheet()">โอเค</button></div>`);};}
function tick(){if(!world)return;project();if(S.screen==='pond')updatePond();else{renderLobbyBarSoft();updateLobby();}}
setInterval(tick,1000);

function renderLobbyBarSoft(){['n1','n2','v1','v2'].forEach(p=>{const e=$('oc-'+p);if(e)e.textContent=occ(p)})}

function tools(){sheet(`<h3>🧰 กระเป๋า</h3><div class="cat" id="c1">🎣 อุปกรณ์ตกปลา</div><div class="cat" id="c3">🔨 คราฟ</div><div class="cat" id="c2">📋 กติกาตกปลา</div><div class="cat" id="cm">📮 ไปรษณีย์</div>`);$('c1').onclick=bagView;$('c2').onclick=rulesView;$('c3').onclick=craftMenu;$('cm').onclick=()=>{closeSheet();Host.openMail();};}

function bagView(){const it=(img,n,c)=>`<div class="item"><img src="${IMG[img]}" alt=""><b>${n}</b><span>${nf(c)}</span></div>`;
 sheet(`<h3>🎣 อุปกรณ์ตกปลา</h3>${RK.map(r=>it('rod-'+r,RODS[r].e+' '+RODS[r].n,S.bag.rod[r])).join('')}${it('item-crabscissors','🦀 กรรไกรปูจอมแสบ',S.bag.crab)}${it('vip-card','🎫 บัตร VIP',S.bag.vip)}
 <div class="hint" style="margin-top:.5rem">วันนี้ตัดเบ็ดไปแล้ว ${S.myCut}/30 · โดนตัด ${S.meTaken}/30<br>บัตร VIP รับจากกิจกรรมและรางวัลสมุดปลา</div><div class="btns"><button class="ghost" onclick="tools()">◀ กลับ</button></div>`)}
function rulesView(){sheet(`<h3>📋 กติกาตกปลา</h3><div class="rules">
<p>🕘 เปิด 11:00–17:00 และ 21:00–07:00 (เวลาไทย)</p>
<p>🎣 บ่อทั่วไป 2 บ่อ บ่อละ 6 ท่า · เลือกได้วันละ 1 บ่อ</p>
<p>⏳ หย่อนเบ็ด 1 อัน รอประมาณ 10 นาที · ได้ 1–3 ตัว ตัวละ 1–10 lb</p>
<p>❗ ปลาติดแล้วต้องกดรับใน 3 นาที ไม่งั้นปลาหนี</p>
<p>🎯 กดรับแล้วแตะตอนเข็มอยู่ในโซนเขียว พลาด = ปลาหลุด เสียเบ็ด</p>
<p>😴 จบรอบแล้วลุกจากท่า พัก 3–5 นาทีค่อยตกใหม่</p>
<p>✂️ ตัดเบ็ดเพื่อนได้วันละ 30 ครั้ง ต้องหย่อนเบ็ดอยู่ทั้งคู่ · คนหนึ่งโดนตัดได้ไม่เกิน 30 ครั้ง/วัน · บ่อ VIP ตัดไม่ได้</p>
<p>👑 บ่อ VIP 2 บ่อ บ่อละ 8 ท่า ใช้บัตร 1 ใบ (1 ชม.) รอด่านละ 5 นาที ทำภารกิจทีละด่าน ผ่านได้ 50–100 lb ต่อด่าน · ด่านละ ❤️❤️ พลาดครบ 2 ครั้งจบรอบ · ใช้บัตรติดกันได้ 5 ใบ แล้วบ่อ VIP พัก 30 นาที (ทั้งวันกี่รอบก็ได้)</p>
<p>⚖️ น้ำหนักทุกบ่อรวมบอร์ดเดียว รีเซ็ตเที่ยงคืน · ท็อป 5 ได้ 5,000 กุศล ติดต่อกัน +1,000 ทุกวัน</p>
<p>📖 ปลาทุกตัวนับเข้าสมุดสะสม ครบเซ็ตรับรางวัล</p></div><div class="btns"><button class="ghost" onclick="tools()">◀ กลับ</button></div>`)}

/* ---------- craft ---------- */
const FRUITS=[['peach','พีช'],['apple','แอปเปิ้ล'],['orange','ส้ม'],['cherry','เชอร์รี']];
const FLOWERS=[['rose','กุหลาบ'],['sunflower','ทานตะวัน'],['lotus','บัว'],['orchid','กล้วยไม้'],['daisy','เดซี่'],['butterflypea','อัญชัน'],['tulip','ทิวลิป'],['lavender','ลาเวนเดอร์'],['marigold','ดาวเรือง'],['hydrangea','ไฮเดรนเยีย'],['plumeria','ลีลาวดี'],['hibiscus','ชบา']];
const GRASS=[['green','เขียว'],['red','แดง'],['yellow','เหลือง'],['pink','ชมพู'],['blue','ฟ้า']];
const CROPS=[['carrot','แครอท'],['corn','ข้าวโพด'],['pumpkin','ฟักทอง'],['tomato','มะเขือเทศ'],['cabbage','กะหล่ำปลี'],['potato','มันฝรั่ง'],['waterspinach','ผักบุ้ง'],['chili','พริก']];
const HEDGE=[['fang','เขี้ยวเม่น'],['quills','ขนเม่น'],['claw','เล็บเม่น'],['tail','หางเม่น']];
const INV={};
const CF={amt:1,rod:'bamboo',flower:'rose',crop:'carrot'};
function craftMenu(){sheet(`<h3>🔨 คราฟ</h3><div class="cat" id="cr1"><img src="${IMG['rod-bamboo']}" alt="" style="width:2.4rem;height:2.4rem;object-fit:contain"><div>เบ็ดตกปลา<small>ผลไม้ ดอกไม้ หญ้า 5 สี พืชพรรณ · สำเร็จ 80%</small></div></div><div class="cat" id="cr2"><img src="${IMG['item-crabscissors']}" alt="" style="width:2.4rem;height:2.4rem;object-fit:contain"><div>กรรไกรปูจอมแสบ<small>ของดร็อปเม่น หิน พืชพรรณ · สำเร็จ 75%</small></div></div><div class="cat" id="cr3"><img src="${IMG['vip-card']}" style="width:2.4rem"><div>บัตร VIP<small>สำเร็จ 10% · หญ้าฟ้า 1,000</small></div></div>`);
 $('cr1').onclick=craftRod;$('cr2').onclick=craftCrab;$('cr3').onclick=craftVip}
function ingRow(key,img,name,need){const have=INV[key]||0,ok=have>=need;return`<div class="ing ${ok?'ok':'lack'}"><img src="${IMG[img]}" alt=""><span>${name}</span><span class="q">${nf(have)}/${nf(need)}</span></div>`}
function pickerHTML(list,pre,cur,id){return`<div class="picker" id="${id}">${list.map(([k,n])=>`<div class="pk ${k===cur?'on':''}" data-k="${k}"><img src="${IMG[pre+k+(pre==='crop-'?'':'')]}" alt="">${n}<br>${nf(INV[(pre==='crop-'?'crop-':pre)+k]||0)}</div>`).join('')}</div>`}
function stepHTML(){return`<div class="stepper"><button id="am-">−</button><b>${CF.amt}</b><button id="am+">＋</button></div>`}
function bindStep(fn){$('am-').onclick=()=>{CF.amt=Math.max(1,CF.amt-1);fn()};$('am+').onclick=()=>{CF.amt=Math.min(10,CF.amt+1);fn()}}
function craftRod(){const a=CF.amt;const rows=[...FRUITS.map(([k,n])=>ingRow('fruit-'+k,'fruit-'+k,n,80*a)),ingRow('flower-'+CF.flower,'flower-'+CF.flower,(FLOWERS.find(f=>f[0]===CF.flower)[1]),150*a),...GRASS.map(([k,n])=>ingRow('grass-'+k,'grass-'+k,'หญ้า'+n,400*a)),ingRow('crop-'+CF.crop,'crop-'+CF.crop,(CROPS.find(c=>c[0]===CF.crop)[1]),1200*a)];
 const ok=rows.every(r=>!r.includes('lack'));
 sheet(`<h3>🎣 คราฟเบ็ดตกปลา</h3><div class="hint">สำเร็จ 80% ต่อครั้ง · พลาดแล้ววัตถุดิบหายด้วย · คราฟได้ครั้งละ 1–10</div>
 <div class="lbl2">เลือกแบบเบ็ด</div><div class="picker" id="pkr">${RK.map(r=>`<div class="pk ${r===CF.rod?'on':''}" data-k="${r}"><img src="${IMG['rod-'+r]}" alt="">${RODS[r].e}<br>มี ${S.bag.rod[r]}</div>`).join('')}</div>
 <div class="lbl2">ดอกไม้ (เลือก 1 ชนิด)</div>${pickerHTML(FLOWERS,'flower-',CF.flower,'pkf')}
 <div class="lbl2">พืชพรรณ (เลือก 1 ชนิด)</div>${pickerHTML(CROPS,'crop-',CF.crop,'pkc')}
 <div class="lbl2">ใช้ทั้งหมด (×${a})</div><div class="ings">${rows.join('')}</div>${stepHTML()}
 <div class="btns"><button class="ghost" onclick="craftMenu()">◀ กลับ</button><button class="big" id="dock" ${ok?'':'disabled'}>คราฟ ${a} ครั้ง</button></div>`);
 $('pkr').querySelectorAll('.pk').forEach(x=>x.onclick=()=>{CF.rod=x.dataset.k;craftRod()});
 $('pkf').querySelectorAll('.pk').forEach(x=>x.onclick=()=>{CF.flower=x.dataset.k;craftRod()});
 $('pkc').querySelectorAll('.pk').forEach(x=>x.onclick=()=>{CF.crop=x.dataset.k;craftRod()});
 bindStep(craftRod);
 $('dock').onclick=async()=>{const result=await act({type:'craft',recipe:'rod',quantity:a,rod:CF.rod,flower:CF.flower,crop:CF.crop});if(result){if(!Array.isArray(result.results)||!Array.isArray(result.outputs)||!Array.isArray(result.consumed)){ann('ระบบกลางส่งรายละเอียดคราฟไม่ครบ กรุณาอัปเดต Cloud ทั้งชุด',false);return;}closeSheet();showCraftResult({title:'ผลคราฟอุปกรณ์ตกปลา',results:result.results,outputs:result.outputs,consumed:result.consumed},craftRod);}};}

function craftCrab(){const a=CF.amt;const rows=[...HEDGE.map(([k,n])=>ingRow('hedge-'+k,'hedge-'+k,n,20*a)),ingRow('item-stone','item-stone','หิน',300*a),ingRow('crop-'+CF.crop,'crop-'+CF.crop,(CROPS.find(c=>c[0]===CF.crop)[1]),1000*a)];
 const ok=rows.every(r=>!r.includes('lack'));
 sheet(`<h3>🦀 คราฟกรรไกรปูจอมแสบ</h3><div class="hint">สำเร็จ 75% ต่อครั้ง · พลาดแล้ววัตถุดิบหายด้วย · คราฟได้ครั้งละ 1–10 · มีอยู่ ${S.bag.crab} อัน</div>
 <div class="lbl2">พืชพรรณ (เลือก 1 ชนิด)</div>${pickerHTML(CROPS,'crop-',CF.crop,'pkc')}
 <div class="lbl2">ใช้ทั้งหมด (×${a})</div><div class="ings">${rows.join('')}</div>${stepHTML()}
 <div class="btns"><button class="ghost" onclick="craftMenu()">◀ กลับ</button><button class="big" id="dock" ${ok?'':'disabled'}>คราฟ ${a} ครั้ง</button></div>`);
 $('pkc').querySelectorAll('.pk').forEach(x=>x.onclick=()=>{CF.crop=x.dataset.k;craftCrab()});bindStep(craftCrab);
 $('dock').onclick=async()=>{const result=await act({type:'craft',recipe:'crab',quantity:a,crop:CF.crop});if(result){if(!Array.isArray(result.results)||!Array.isArray(result.outputs)||!Array.isArray(result.consumed)){ann('ระบบกลางส่งรายละเอียดคราฟไม่ครบ กรุณาอัปเดต Cloud ทั้งชุด',false);return;}closeSheet();showCraftResult({title:'ผลคราฟอุปกรณ์ตกปลา',results:result.results,outputs:result.outputs,consumed:result.consumed},craftCrab);}};}
function craftVip(){const a=CF.amt,rows=[ingRow('grass-blue','grass-blue','หญ้าฟ้า',1000*a),ingRow('fruit-apple','fruit-apple','แอปเปิล',300*a),ingRow('fruit-cherry','fruit-cherry','เชอร์รี',300*a),ingRow('flower-rose','flower-rose','กุหลาบ',300*a),ingRow('forest-iron','item-stone','เหล็ก',20*a)];const ok=rows.every(r=>!r.includes('lack'));sheet(`<h3>🎫 คราฟบัตร VIP</h3><div class="hint">สำเร็จ 10% · ได้ 1 ใบต่อครั้งสำเร็จ · พลาดใช้วัตถุดิบ</div><div class="ings">${rows.join('')}</div>${stepHTML()}<button class="big" id="dock" ${ok?'':'disabled'}>คราฟ ${a} ครั้ง</button>`);bindStep(craftVip);$('dock').onclick=async()=>{const out=await act({type:'craft',recipe:'vip',quantity:a});if(out){closeSheet();showCraftResult({title:'คราฟบัตร VIP',results:out.results,outputs:out.outputs,consumed:out.consumed},craftVip);}};}
function adminPanel(){if(S.role!=='admin')return;sheet(`<h3>👑 ควบคุมบ่อตกปลา</h3><p>ตอนนี้ ${world?.mode==='open'?'เปิดฉุกเฉิน':world?.mode==='closed'?'ปิดฉุกเฉิน':'ตามเวลาไทย'}</p><div class="btns"><button class="big" data-mode="open">เปิดฉุกเฉิน / ทดสอบ</button><button class="ghost" data-mode="closed">ปิดฉุกเฉิน</button><button class="ghost" data-mode="auto">กลับตามเวลา</button></div><div class="hint">การเปิดมีผลกับผู้เล่นทุกคน เบ็ด บัตร VIP และคะแนนทำงานตามกติกาจริง</div>`);$('sheet').querySelectorAll('[data-mode]').forEach(b=>b.onclick=async()=>{if(await act({type:'admin',mode:b.dataset.mode})){closeSheet();render();}});}


/* ---------- catalog book ---------- */
const BK={mode:'cover',idx:0};
const POS={blue:{r:[.228,.566],b:[.364,.70]},def:{r:[.249,.573],b:[.38,.715]}};
const COLS={l:[.33,.745],r:[.258,.668]},STAMP={l:[.518,.843],r:[.475,.843]};
function wide(){return innerWidth>=innerHeight*1.05}
function openBook(){BK.mode='cover';BK.idx=0;$('book').classList.add('on');renderBook()}
let sw=null;$('book').addEventListener('pointerdown',e=>{sw={x:e.clientX,y:e.clientY}});
$('book').addEventListener('pointerup',e=>{if(!sw)return;const dx=e.clientX-sw.x,dy=e.clientY-sw.y;sw=null;if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy))return;bookGo(dx<0?1:-1)});
function bookGo(d){const max=wide()?3:7;if(BK.mode==='cover'){if(d>0){BK.mode='pages';BK.idx=0;renderBook(true)}return}
 if(d<0){if(BK.idx===0)BK.mode='cover';else BK.idx--}else{if(BK.idx>=max)return;BK.idx++}renderBook(true)}
function setLevel(si){const st=SETS[si];return Math.min(...st.f.map(k=>S.cat[k].n))}
function claimable(si){const mn=setLevel(si);let c=0;for(let l=S.claimed[si];l<12;l++)if(mn>=LADDER[l])c++;return c}
function pageHTML(si,sd,anim,pw,ph){const sp=SPREADS[Math.floor(si/2)],P=POS[sp]||POS.def,st=SETS[si];
 let h=`<div class="ptitle">เซ็ต ${si+1} · ${st.n}</div>`;
 st.f.forEach((k,j)=>{const cx=COLS[sd][j%2],r=Math.floor(j/2),c=S.cat[k],has=c.n>0;
  h+=`<div class="slot" style="left:${cx*100}%;top:${P.r[r]*100}%"><img class="${has?'':'sil'}" src="${IMG['fish-'+k]}" alt=""></div>
  <div class="rib" style="left:${cx*100}%;top:${P.b[r]*100}%">${has?FISH[k][0]:'？？？'}</div>
  <div class="stat" style="left:${cx*100}%;top:${(P.b[r]+.034)*100}%">${has?'🏅 '+f2(c.best)+' lb · '+c.n+' ตัว':'ยังไม่เคยได้'}</div>`});
 const can=claimable(si),done=S.claimed[si]>=12;
 h+=`<div class="seal ${can?'ready':''}" data-si="${si}" style="left:${STAMP[sd][0]*100}%;top:${STAMP[sd][1]*100}%"><img src="${IMG[can||done?'seal-gold':'seal-gray']}" alt="ตราครบเซ็ต"><span class="lv">${done?'ครบ 12 ขั้น':can?'🎁 รับได้ '+can+' ขั้น':'ขั้น '+S.claimed[si]+'/12'}</span></div>`;
 return `<div class="page ${anim?'flip':''}" style="width:${pw}px;height:${ph}px;background-size:200% 100%;background-image:url(${IMG['catalog-spread-'+sp]});background-position:${sd==='l'?'0% 0':'100% 0'}">${h}</div>`}
function renderBook(anim){const b=$('book'),W=innerWidth,H=innerHeight-120;
 const hd=`<div class="bookhd"><span class="chip">📖 สมุดสะสมปลา</span><button class="rbtn" id="bkx" aria-label="ปิดสมุด">✖</button></div>`;
 if(BK.mode==='cover'){const w=Math.min(W*.88,H*.75);
  b.innerHTML=hd+`<div class="cover" id="cov" style="width:${w}px;height:${w/.75}px;background-image:url(${IMG['catalog-cover']})"><div class="ttl">สมุดสะสมปลา</div></div><button class="big gold" id="openb">📖 เปิดสมุด</button>`;
  $('cov').onclick=$('openb').onclick=()=>{BK.mode='pages';BK.idx=0;renderBook(true)}}
 else{const wd=wide();let inner,label,max;
  if(wd){const w=Math.min(W*.96,H*4/3),pw=w/2,ph=w*.75;max=3;label='หน้าคู่ '+(BK.idx+1)+'/4';
   inner=`<div class="spread" style="width:${w}px;height:${ph}px">${pageHTML(BK.idx*2,'l',anim,pw,ph)}${pageHTML(BK.idx*2+1,'r',anim,pw,ph)}</div>`}
  else{const w=Math.min(W*.94,H*2/3),ph=w*1.5;max=7;const si=BK.idx;label='หน้าคู่ '+(Math.floor(si/2)+1)+'/4 · '+(si%2?'ขวา':'ซ้าย');
   inner=`<div class="spread" style="width:${w}px;height:${ph}px">${pageHTML(si,si%2?'r':'l',anim,w,ph)}</div>`}
  b.innerHTML=hd+inner+`<div class="hint" style="color:#cfe6f2;margin:0">ปัดซ้าย–ขวาเพื่อพลิกหน้า</div><div class="nav"><button class="rbtn" id="pv" aria-label="หน้าก่อน">◀</button><span class="pg">${label}</span><button class="rbtn" id="nx" aria-label="หน้าถัดไป">▶</button></div>`;
  $('pv').onclick=()=>bookGo(-1);$('nx').onclick=()=>bookGo(1);
  b.querySelectorAll('.seal').forEach(s=>s.onclick=()=>setSheet(+s.dataset.si))}
 $('bkx').onclick=()=>$('book').classList.remove('on')}
function rewardText(si,l){const st=SETS[si];return nf(MERIT[l]*st.m)+' กุศล + '+ITEM[st.it][0]+' '+nf(st.q)}
function setSheet(si){const st=SETS[si],mn=setLevel(si);
 const pr=st.f.map(k=>`<div><img class="${S.cat[k].n?'':'sil'}" src="${IMG['fish-'+k]}" alt="" style="${S.cat[k].n?'':'filter:brightness(0) opacity(.3)'}">${S.cat[k].n?FISH[k][0]:'？？？'}<br>${S.cat[k].n} ตัว</div>`).join('');
 const lad=LADDER.map((n,l)=>{const ok=l<S.claimed[si],can=!ok&&mn>=n;return`<div class="lad ${ok?'ok':can?'can':''}"><b>ครบตัวละ ${n}</b><span class="rw">${rewardText(si,l)}</span><span class="st">${ok?'✅':can?'🎁':'🔒'}</span></div>`}).join('');
 const c=claimable(si);
 sheet(`<h3>เซ็ต ${si+1} · ${st.n}</h3><div class="hint">ต้องได้ปลาครบทั้ง 4 ตัว ตัวละเท่ากับขั้นนั้น ถึงจะรับรางวัลได้ · กุศล ×${st.m}</div><div class="prog">${pr}</div>${lad}<div class="btns"><button class="ghost" onclick="closeSheet()">ปิด</button>${c?`<button class="big gold" id="clb">🎁 รับรางวัล ${c} ขั้น</button>`:''}</div>`);
 if(c)$('clb').onclick=async()=>{const out=await act({type:'claimSet',set:si});if(out){ann('รับ '+nf(out.reward.merit)+' กุศลแล้ว');closeSheet();renderBook();}};}


/* ---------- render ---------- */
function render(){fitStage();renderTop();if(S.screen==='lobby')renderLobby();else renderPond()}
closeSheet();render();
if(!Host){ann('กรุณาเปิดจากหน้าเกมหลัก',false);}else(async()=>{const result=await act({type:'status'});if(!result)return;render();stopWatch=Host.watchWorld('fishing',data=>{if(data&&(!world?.updatedAt||!data.updatedAt||data.updatedAt>=world.updatedAt)){world=data;project();if(S.screen==='pond')updatePond();else{renderLobby();updateLobby();}}});})();
addEventListener('pagehide',()=>{stopWatch?.();});

