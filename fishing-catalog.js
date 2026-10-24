export const FISH={
guppy:['ปลาหางนกยูง',1,1.00,1.80],mudskipper:['ปลาตีน',1,1.00,2.00],seahorse:['ม้าน้ำ',1,1.20,2.20],betta:['ปลากัด',1,1.20,2.40],
boxfish:['ปลาปักเป้ากล่อง',1,1.50,2.80],puffer:['ปลาปักเป้าจุด',1,1.50,3.00],leaf:['ปลาใบไม้',1,1.80,3.20],elephantnose:['ปลาจมูกช้าง',1,2.00,3.50],
moldyorange:['ปลาส้มขึ้นรา',2,3.00,4.50],hamster:['ปลาแฮมสเตอร์',2,3.00,4.80],angelfish:['ปลาเทวดา',2,3.20,5.00],clownloach:['ปลาหมูอินโด',2,3.50,5.20],
triggerfish:['ปลาวัวลายจุด',2,3.50,5.50],discus:['ปลาปอมปาดัวร์',2,4.00,5.80],shihtzu:['ปลาหมาชิสุ',2,4.00,6.00],durian:['ปลาทุเรียน',2,4.50,6.50],
eel:['ปลาไหล',3,5.50,7.50],trout:['ปลาเทราต์',3,6.00,8.00],stonefish:['ปลาหิน',3,6.00,8.50],moneybag:['ปลาถุงเงิน',3,6.50,8.80],
sunbathe:['ปลาตากแดด',3,7.00,9.00],koi:['ปลาคาร์ฟ',3,7.00,9.50],catfish:['ปลาดุกช่าง',3,7.50,10.00],arowana:['ปลาอโรวาน่า',3,8.00,10.00],
catshark:['ฉลามแมว',4,50,60],angelshark:['ฉลามนางฟ้า',4,55,65],manta:['กระเบนราหู',4,60,70],hammerhead:['ฉลามหัวค้อน',4,65,78],
mola:['ปลาโมลา',5,70,85],strawberry:['ปลาสตรอว์เบอร์รี',5,78,90],unicorn:['ปลายูนิคอร์น',5,85,95],goldsheep:['ปลาแกะทอง',5,90,100]};
const TIER={1:[],2:[],3:[]};for(const k in FISH){const t=FISH[k][1];if(TIER[t])TIER[t].push(k)}
export const RODS={bamboo:{n:'เบ็ดไผ่ลมหวน',e:'🎋',cnt:[85,15,0],tier:[55,35,10]},moon:{n:'เบ็ดจันทร์เสี้ยว',e:'🌙',cnt:[95,5,0],tier:[40,35,25]},
honey:{n:'เบ็ดน้ำผึ้งหวานเจี๊ยบ',e:'🍯',cnt:[60,35,5],tier:[70,25,5]},sakura:{n:'เบ็ดซากุระพลิ้ว',e:'🌸',cnt:[80,20,0],tier:[50,35,15]}};
export const RK=Object.keys(RODS);
export const VIPL=[['catshark',80],['angelshark',65],['manta',50],['hammerhead',40],['mola',30],['strawberry',22],['unicorn',15],['goldsheep',10]];
export const SETS=[{n:'ตู้ปลาจิ๋ว',f:['guppy','betta','seahorse','mudskipper'],m:1,it:'rod',q:20},
{n:'ปักเป้าป่วน',f:['boxfish','puffer','leaf','elephantnose'],m:1,it:'crab',q:20},
{n:'ก๊วนเพี้ยน',f:['moldyorange','hamster','shihtzu','durian'],m:1.25,it:'cake',q:1000},
{n:'ตู้ปลาสวยงาม',f:['angelfish','clownloach','discus','triggerfish'],m:1.25,it:'coconut',q:1000},
{n:'ลำธารก้นบ่อ',f:['eel','trout','stonefish','catfish'],m:1.5,it:'wings',q:20},
{n:'ปลานำโชค',f:['moneybag','sunbathe','koi','arowana'],m:1.5,it:'fertp',q:1000},
{n:'ทีมฉลาม',f:['catshark','angelshark','hammerhead','manta'],m:2,it:'vip',q:10},
{n:'ตำนาน',f:['mola','strawberry','unicorn','goldsheep'],m:3,it:'vip',q:20}];
export const ITEM={rod:['เบ็ด (สุ่มแบบ)','rod-bamboo'],crab:['กรรไกรปูจอมแสบ','item-crabscissors'],cake:['เค้ก','item-cake'],coconut:['มะพร้าว','item-coconut'],
wings:['ปีกนางฟ้า','item-angelwings'],fertp:['ปุ๋ยผลไม้พรีเมียม','fert-fruit-premium'],vip:['บัตร VIP','vip-card']};
export const LADDER=[10,20,30,40,50,60,70,80,90,100,110,120];
export const MERIT=[1000,2000,3000,5000,7500,10000,12500,15000,17500,20000,20000,20000];
const SPREADS=['blue','mint','peach','gold'];
export const PONDS={n1:{k:'n',name:'บ่อทั่วไป 1',bg:'fish-pond-bg'},n2:{k:'n',name:'บ่อทั่วไป 2',bg:'fish-pond-bg'},v1:{k:'v',name:'บ่อ VIP 1',bg:'fish-vip-bg'},v2:{k:'v',name:'บ่อ VIP 2',bg:'fish-vip-bg'}};
const SEATPOS={n:[[.115,.23,'l'],[.115,.43,'l'],[.115,.64,'l'],[.885,.23,'r'],[.885,.43,'r'],[.885,.64,'r']],
v:[[.15,.28,'l'],[.15,.40,'l'],[.15,.53,'l'],[.15,.67,'l'],[.86,.28,'r'],[.86,.40,'r'],[.86,.53,'r'],[.86,.67,'r']]};
const FLX={n:{l:.34,r:.66},v:{l:.33,r:.67}};
