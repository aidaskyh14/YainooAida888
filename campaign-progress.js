import {recordCampaign,bkkHour,dayKey,HALLOWEEN,featuredMenus} from './campaigns-engine.js';
const at=(g,p)=>p.split('.').reduce((o,k)=>o?.[k],g)||0;
const increase=(a,b,p)=>Math.max(0,at(b,p)-at(a,p));
const values=g=>Object.values(g||{}).reduce((s,n)=>s+(Number(n)||0),0);
const FLOWER_POINTS={daisy:1,tulip:1,marigold:1,rose:2,butterflypea:2,lavender:2,sunflower:3,hibiscus:3,lotus:3,plumeria:4,hydrangea:4,orchid:5};
const FOOD_POINTS=[15,18,20,22,20,30,30,50,10,12,20,15],FOOD_NAMES=['ข้าวผัดไข่','ซุปฟักทอง','ปลาย่างซอสมะม่วง','สตูว์รวมมิตร','ไข่อบชีส','น่องไก่อบครีม','ขนมลิ้นจี่มะยม','จานรวมมิตร','ออมเล็ตโรซี่','ไข่อบอัญชัน','ไข่ตุ๋นหกบุปผา','ไข่ย่างสปาฟลาวเวอร์'];
const GARDEN_CHANCES={"r1":80,"r2":75,"r3":65,"r4":60,"r5":55,"r6":45,"r7":35,"r8":25,"n1":65,"n2":50,"n3":35,"n4":25,"b1":70,"b2":65,"b3":60,"b4":60,"b5":55,"b6":50,"b7":45,"b8":40,"w1":80,"w2":70,"w3":60,"w4":50,"w5":40,"w6":30};
const menuPts=p=>p>=40?10:p>=35?12:p>=30?15:p>=25?18:p>=22?20:p>=20?22:p>=15?30:50;
const DROP_POINTS={'bag.item.boot':50,'sub.alpaca.bag.scarf-red':30,'sub.alpaca.bag.beanie-blue':30,'sub.alpaca.bag.plush-mini':30,'bag.item.potion':40,'bag.item.battery':40,'bag.item.collar':20,'bag.item.bell':10,'bag.item.treat':5,'bag.item.musicbox':5,'sub.alpaca.bag.yarn-white':2,'sub.alpaca.bag.yarn-pink':2,'sub.alpaca.bag.yarn-blue':2};
export function observeGameplay(before,after,source,config,now,boxes=[],rng=Math.random){
 // The prior cloud-backed progress is authoritative over an iframe's older projection.
 after.sub ||= {};after.sub.campaigns=structuredClone(before.sub?.campaigns||{});
 const featured=featuredMenus(now),hour=bkkHour(now),merit=Math.max(0,(after.merit||0)-(before.merit||0));
 if(!boxes.length&&['barn','birds','dog','alpaca','catpen'].includes(source)){
   let pts=merit;for(const[p,w]of Object.entries(DROP_POINTS))pts+=increase(before,after,p)*w;recordCampaign(after,config,'pet',pts,now);
 }
 if(['farm','house','backyard'].includes(source)){
   let cook=0;
   FOOD_NAMES.forEach((name,i)=>cook+=increase(before,after,'bag.food.'+name)*FOOD_POINTS[i]*(featured.includes(i)?3:1)*(hour>=6&&hour<9?2:1));
   for(const[k,q]of Object.entries(after.bag?.gfood||{}))cook+=Math.max(0,q-(before.bag?.gfood?.[k]||0))*menuPts(GARDEN_CHANCES[k]||80)*(hour>=6&&hour<9?2:1);
   for(const[k,w]of Object.entries({moon:20,rose:30,blood:50,eclipse:80}))cook+=increase(before,after,'bag.wine.'+k)*w*(hour>=22||hour<1?2:1);
   for(const[k,w]of Object.entries(FLOWER_POINTS))cook+=increase(before,after,'bag.flower.'+k)*w*(hour>=6&&hour<10?2:1);
   cook+=Math.max(0,values(after.bag?.hedge)-values(before.bag?.hedge))*2*(hour>=20||hour<2?2:1);recordCampaign(after,config,'cook',cook,now);
   let plots=0;for(const[f,rows]of Object.entries(before.farms||{}))for(let i=0;i<rows.length;i++)if(rows[i]?.c==='pumpkin'&&rows[i].ph==='ready'&&!after.farms?.[f]?.[i]&&increase(before,after,'bag.crop.pumpkin'))plots++;
   if(plots){const x=recordCampaign(after,config,'pump',0,now);if(x){const old=x.pumpPlots;x.pumpPlots+=plots;let points=0;for(let i=Math.floor(old/10);i<Math.floor(x.pumpPlots/10);i++){const weights=HALLOWEEN.map(v=>v[hour>=18&&hour<22?4:3]);let r=rng()*values(weights),index=weights.length-1;for(let j=0;j<weights.length;j++){r-=weights[j];if(r<0){index=j;break;}}const item=HALLOWEEN[index];x.items[item[0]]=(x.items[item[0]]||0)+1;after.bag.halloween ||= {};after.bag.halloween[item[0]]=(after.bag.halloween[item[0]]||0)+1;points+=item[2];}recordCampaign(after,config,'pump',points,now);}}
 }
 if(boxes.length){const x=recordCampaign(after,config,'box',0,now);if(x){if(x.box.day!==dayKey(now))x.box={day:dayKey(now),n:0};for(const b of boxes){const pts=b.k==='merit'?(b.q||0)/2:b.k==='salt'?-5:['cat','dog','alpaca','hamster','bird'].includes(b.k)?100:50;recordCampaign(after,config,'box',pts*(x.box.n++<100?5:1),now);}}}
 return after;
}
