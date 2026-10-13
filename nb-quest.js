/* fix14 เนเบอร์ฮูด: นับความคืบหน้าเควสต์จากผลของรายการบนเซิร์ฟเวอร์ (ฟังก์ชันล้วน)
   นับเฉพาะสิ่งที่เซิร์ฟเวอร์เป็นคนตัดสินผล ไม่เชื่อตัวเลขจากหน้าเว็บ */
export const NB_QUESTS=[
 // [key, ชื่อ, เป้าต่อคน, หน่วย, ไอคอน]
 ['harvest','เก็บผัก/ผลไม้ในแปลง',250,'แปลง','img:nb-q-harvest'],
 ['pumpkin','เก็บแปลงฟักทอง',80,'แปลง','img:nb-q-pumpkin'],
 ['tree','เก็บผลจากต้นไม้',30,'ครั้ง','🌳'],
 ['cook','ทำอาหาร',15,'จาน','img:nb-q-cook'],
 ['fish','ตกปลา',8,'ตัว','img:nb-q-fish'],
 ['minigame','เล่นมินิเกมจบรอบ',3,'รอบ','img:nb-q-minigame'],
 ['delivery','ส่งของกับน้องน้ำผึ้ง',5,'ครั้ง','img:nb-q-delivery'],
 ['box','เปิดกล่องสุ่ม',20,'กล่อง','img:nb-q-box'],
 ['help','ช่วยสวนเพื่อน (รดน้ำ/หนอน)',30,'ครั้ง','💧'],
 ['sell','ขายของในร้านของเพื่อน',5,'ครั้ง','🏪']
];
export const NB_KEYS=NB_QUESTS.map(q=>q[0]);
const at=(g,p)=>{const v=p.split('.').reduce((o,k)=>o?.[k],g);return Number.isFinite(Number(v))?Number(v):0;};
const sum=o=>Object.values(o||{}).reduce((a,n)=>a+(Number.isFinite(Number(n))?Number(n):0),0);
const BOX_PATHS=['bag.item.boxdog','sub.alpaca.bag.box'];
export function questDeltas(system,before,after,input={},response={}){
 const q={},add=(k,n)=>{if(n>0)q[k]=(q[k]||0)+n;};
 const type=input?.type;
 if(system==='farm'&&type==='harvest'){
  for(const [f,rows]of Object.entries(before?.farms||{}))(rows||[]).forEach((p,i)=>{if(p?.ph==='ready'&&!after?.farms?.[f]?.[i]){add('harvest',1);if(p.c==='pumpkin')add('pumpkin',1);}});
 }
 if(system==='farm'&&type==='fruit-harvest'){
  const b=before?.fruit?.plots||[],a=after?.fruit?.plots||[];a.forEach((t,i)=>{if(t&&b[i]&&(t.last||0)>(b[i].last||0))add('tree',1);});
 }
 if(system==='craft'){add('cook',Math.max(0,sum(after?.bag?.food)+sum(after?.bag?.gfood)-sum(before?.bag?.food)-sum(before?.bag?.gfood)));}
 if(system==='fishing'){const n=g=>Object.values(g?.sub?.fishing?.cat||{}).reduce((s,c)=>s+(Number(c?.n)||0),0);add('fish',Math.max(0,n(after)-n(before)));}
 if(system==='minigames'||system==='funrun'){const b=before?.sub?.minigames?.cd||{},a=after?.sub?.minigames?.cd||{};for(const k of Object.keys(a))if((a[k]||0)>(b[k]||0))add('minigame',1);}
 if(system==='outings'&&type==='deliver'&&!before?.honey?.delivered&&after?.honey?.delivered)add('delivery',1);
 if(system==='boxes'||system==='birdbox'){
  const total=g=>sum(g?.bag?.box)+sum(g?.bag?.birdbox)+BOX_PATHS.reduce((s,p)=>s+at(g,p),0);add('box',Math.max(0,total(before)-total(after)));
 }
 if(system==='friends'&&(type==='water'||type==='worm'))add('help',1);
 if(system==='farmshop'&&type==='clear')add('sell',1);
 return Object.keys(q).length?q:null;
}
/* วันของเนเบอร์ฮูด = วันตามเวลาไทย (เที่ยงคืนไทยรีเซ็ต) */
export const nbDay=now=>new Date(now+7*3600000).toISOString().slice(0,10);
