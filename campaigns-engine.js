export const CAMPAIGNS=[
 {id:'fish',ic:'🎣',bg:'#DDF1FB',n:'ศึกสาวเบ็ดในตำนาน',d:'ตกปลาตำนาน 8 ตัวในบ่อ VIP นับทุกตัว ไม่จำกัด',th:[300,800,1500,2400,3400,4500,5700,7000,8500,10000]},
 {id:'pet',ic:'🛡️',bg:'#E7F7EF',n:'ผู้พิทักษ์ Pet Care',d:'นับกุศลจากสัตว์ทุกระบบ + โรงงานแปรรูป + ของดรอปพิเศษ',th:[50000,120000,250000,450000,700000,1000000,1400000,1900000,2500000,3200000]},
 {id:'box',ic:'🎰',bg:'#FFF3C9',n:'ยี่สุ่มมาแล้วววววว',d:'เปิดกล่องสุ่ม • กุศลนับครึ่ง • ไอเท็ม +50 • สัตว์ +100 • เกลือ −5 • 100 กล่องแรกของวัน ×5',th:[200000,500000,1000000,2000000,3500000,5000000,7000000,10000000,14000000,20000000]},
 {id:'honey',ic:'🐷',bg:'#FFE9D6',n:'น้ำผึ้งนายแน่มาก',d:'นับเฉพาะกุศลที่ได้จากน้องน้ำผึ้ง • มีช่วงอารมณ์ดี ×2 และช่วงง่วง ×0.5',th:[20000,50000,100000,180000,300000,450000,650000,900000,1200000,1600000]},
 {id:'cook',ic:'👩‍🍳',bg:'#FFE3EC',n:'เสน่ห์ปลายจวัก',d:'คราฟอาหารบ้าน/สวน หมักไวน์ เก็บดอกไม้ เก็บของเม่น • มีช่วงเวลาพิเศษ + เมนูเด่นรายวัน ×3',th:[5000,12000,25000,40000,60000,85000,115000,150000,200000,260000]},
 {id:'pump',ic:'🎃',bg:'#FFE4CC',n:'หนูรักษ์โลก: ฟักทองฮาโลวีน',d:'ทุก 10 แปลงฟักทองที่เก็บ = ไอเท็มฮาโลวีน 1 ชิ้น • นับเป็นแปลง • หลอนฮาโลวีน 18:00–22:00 ได้ของหายากง่ายสุด',th:[1000,2500,5000,8000,12000,17000,23000,30000,38000,50000]}];
export const FISH_EVENTS=[['g','🌊 น้ำขึ้นสูง','ปลาตำนานออกง่าย ×2',{legend:2}],['g','🌈 รุ้งกินน้ำ','ยูนิคอร์น/แกะทอง ×3',{uni:3}],['g','✨ จันทร์เต็มดวง','แกะทอง ×5',{gold:5}],['g','🦈 ฉลามว่ายเข้าบ่อ','ฉลาม 4 ตัว ×2',{shark:2}],['g','🍀 ลมเย็นนำโชค','คะแนน ×1.5',{pts:1.5}],['g','🎣 ปลากินเหยื่อดี','ได้ 2 ตัวต่อตา',{two:1}],
 ['b','🏜️ น้ำลด','ปลาตำนาน ×0.5',{legend:.5}],['b','🌫️ หมอกลง','ปลาหายาก ×0.5',{rare:.5}],['b','🌧️ พายุเข้า','รอนานขึ้น 2 เท่า',{slow:1}],['b','🐊 จระเข้ป่วน','คะแนนฉลาม ×0.5',{sharkpts:.5}],['b','🪣 บ่อขุ่น','คะแนน ×0.7',{pts:.7}],['b','🐙 หมึกยักษ์ขโมยเหยื่อ','30% ตกได้ปลาว่าง',{miss:.3}]];
export const HALLOWEEN=[['candy','ลูกอมผี',1,30,20],['bat','ค้างคาวจิ๋ว',1,25,18],['candle','เทียนผี',2,18,16],['web','ใยแมงมุม',3,12,15],['hat','หมวกแม่มด',5,6,10],['broom','ไม้กวาดแม่มด',5,6,10],['pumpkin','ฟักทองแกะสลักเรืองแสง',10,2.5,8],['cauldron','หม้อยาแม่มด',20,.5,3]];

export const CAMPAIGN_REWARDS=[10000,25000,50000,80000,120000,180000,250000,350000,500000,1000000];
export const bkkHour=now=>+new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Bangkok',hour:'2-digit',hour12:false}).format(new Date(now));
export const dayKey=now=>new Date(now+7*3600e3).toISOString().slice(0,10);
export function recordCampaign(game,config,id,points,now,extra={}){
 const c=config?.[id];if(!c||!c.start||now<c.start||now>=c.end)return null;
 game.sub ||= {};const all=game.sub.campaigns ||= {},x=all[id]?.round===c.round?all[id]:(all[id]={round:c.round,score:0,claimed:[],box:{day:'',n:0},pumpPlots:0,items:{}});
 x.score=Math.max(0,Math.round((x.score+points)*10)/10);Object.assign(x,extra);return x;
}
export function campaignControl(config,input,ctx){
 const out=structuredClone(config||{}),c=CAMPAIGNS.find(c=>c.id===input.campaign);if(!c)throw new Error('ไม่พบแคมเปญ');if(!ctx.admin)throw new Error('เฉพาะแอดมิน');
 if(input.type==='start'){const prior=out[c.id];if(prior?.end>ctx.now)throw new Error('แคมเปญนี้กำลังแข่งขัน');out[c.id]={round:(prior?.round||0)+1,start:ctx.now,end:ctx.now+8*864e5,ev:null,evHour:-1};}
 else if(input.type==='stop'){if(!out[c.id]?.start)throw new Error('ยังไม่เริ่ม');out[c.id].end=ctx.now;}
 else if(input.type==='news'){if(c.id!=='fish'||!out.fish?.start||out.fish.end<=ctx.now)throw new Error('การแข่งขันตกปลายังไม่เปิด');const hour=Math.floor(ctx.now/3600e3);if(out.fish.evHour===hour)throw new Error('แจ้งข่าวได้ชั่วโมงละครั้ง');if(!Number.isInteger(input.event)||!FISH_EVENTS[input.event])throw new Error('ข่าวไม่ถูกต้อง');out.fish.ev=input.event;out.fish.evHour=hour;}
 else throw new Error('รายการไม่ถูกต้อง');return out;
}
export function claimCampaign(game,config,input){
 const c=CAMPAIGNS.find(c=>c.id===input.campaign),current=config?.[input.campaign],x=game.sub?.campaigns?.[input.campaign],step=input.step;
 if(!c||!current||x?.round!==current.round||!Number.isInteger(step)||step<0||step>=10||x.score<c.th[step])throw new Error('คะแนนยังไม่ถึงขั้นนี้');if(x.claimed.includes(step))throw new Error('รับรางวัลแล้ว');x.claimed.push(step);game.merit=(game.merit||0)+CAMPAIGN_REWARDS[step];return CAMPAIGN_REWARDS[step];
}

export function seeded(str){let h=2166136261;for(const ch of str){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return((h>>>0)%10000)/10000;};}
export function featuredMenus(now){const rng=seeded('cook'+dayKey(now)),list=Array.from({length:12},(_,i)=>i);for(let i=11;i>0;i--){const j=Math.floor(rng()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list.slice(0,3);}
export function honeyMultiplier(now){const rng=seeded('honey'+dayKey(now)),a=Math.floor(rng()*22);let b=Math.floor(rng()*22);if(Math.abs(a-b)<3)b=(a+8)%22;const h=bkkHour(now);return h>=a&&h<a+2?2:h>=b&&h<b+2?.5:1;}
