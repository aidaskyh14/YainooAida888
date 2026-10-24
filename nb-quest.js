/* fix14 เนเบอร์ฮูด: นับความคืบหน้าเควสต์จากผลของรายการบนเซิร์ฟเวอร์ (ฟังก์ชันล้วน)
   นับเฉพาะสิ่งที่เซิร์ฟเวอร์เป็นคนตัดสินผล ไม่เชื่อตัวเลขจากหน้าเว็บ */
/* fix15: เควสต์ 13 แบบ สุ่มวันละ 10 ข้อ แยกแต่ละบ้าน · เป้าเป็นยอดรวมทั้งบ้าน (บ้าน 3 คนและ 4 คนเป้าเท่ากัน) */
export const NB_QUESTS=[
 // [key, ชื่อ, เป้ารวมทั้งบ้าน, หน่วย, ไอคอน]
 ['harvest','เก็บผักในแปลง',1400,'แปลง','img:nb-q-harvest'],
 ['pumpkin','เก็บแปลงฟักทอง',600,'แปลง','img:nb-q-pumpkin'],
 ['tree','เก็บผลไม้จากต้น',200,'ครั้ง','🍑'],
 ['cook','ทำอาหาร',60,'จาน','img:nb-q-cook'],
 ['fish','ตกปลา',50,'ตัว','img:nb-q-fish'],
 ['mgmerit','ได้กุศลจากมินิเกม',750000,'กุศล','img:nb-q-minigame'],
 ['delivery','ส่งของกับน้องน้ำผึ้ง',50,'ครั้ง','img:nb-q-delivery'],
 ['box','เปิดกล่องสุ่ม',1000,'กล่อง','img:nb-q-box'],
 ['prank','แกล้งสวนเพื่อน',20,'ครั้ง','😈'],
 ['sell','ขายของในร้านของเพื่อน',100,'ครั้ง','🏪'],
 ['shear','ตัดขนอัลปาก้า',100,'ตัว','🦙'],
 ['research','วิจัยซาฟารี',40,'ครั้ง','🔬'],
 ['flower','เก็บดอกไม้',200,'แปลง','🌸'],
 /* fix19 ภารกิจพิเศษ ขึ้นทุกวันทุกบ้าน · ข้อละ 150,000 (ต่อคน) · [.., รางวัล, ทุกวัน] */
 ['poison','ปรุงยาพิษจากหีบแม่มด',150,'แต้ม','🧪',150000,true],
 ['demon','ป่วนด้วยไอเทมปีศาจ',40,'แต้ม','😈',150000,true],
 ['mkcode','นักถอดรหัสมหากุศล',80,'แต้ม','📦',150000,true]
];
export const NB_FIXED=NB_QUESTS.filter(q=>q[6]).map(q=>q[0]);
export const nbReward=k=>NB_QUESTS.find(q=>q[0]===k)?.[5]||50000;
export const NB_DAILY=10;
/* เควสต์ของวัน: สุ่มแบบกำหนดผลได้จากรหัสบ้าน + วัน (ทุกเครื่องเห็นชุดเดียวกัน แต่ละบ้านไม่เหมือนกัน) */
export function nbPicks(nbId,day){
 let h=2166136261>>>0;for(const ch of String(nbId)+'|'+String(day)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0;}
 const rnd=()=>{h=(h+0x6D2B79F5)>>>0;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
 /* fix19: ข้อพิเศษขึ้นทุกวัน + สุ่มข้อปกติจนครบ 10 (ลำดับสุ่มของข้อปกติเหมือนเดิม) */
 const keys=NB_QUESTS.filter(q=>!q[6]).map(q=>q[0]);for(let i=keys.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[keys[i],keys[j]]=[keys[j],keys[i]];}
 const pick=new Set([...NB_FIXED,...keys.slice(0,NB_DAILY-NB_FIXED.length)]);return NB_QUESTS.map(q=>q[0]).filter(k=>pick.has(k));
}
export const NB_KEYS=NB_QUESTS.map(q=>q[0]);
const at=(g,p)=>{const v=p.split('.').reduce((o,k)=>o?.[k],g);return Number.isFinite(Number(v))?Number(v):0;};
const sum=o=>Object.values(o||{}).reduce((a,n)=>a+(Number.isFinite(Number(n))?Number(n):0),0);
const BOX_PATHS=['bag.item.boxdog','sub.alpaca.bag.box'];
export function questDeltas(system,before,after,input={},response={}){
 const q={},add=(k,n)=>{if(n>0)q[k]=(q[k]||0)+n;};
 const type=input?.type;
 if(system==='farm'&&type==='harvest'){
  /* fix19: ใช้รายการแปลงที่เก็บจริงจากเซิร์ฟเวอร์ (แปลงที่สุกระหว่างรายการก็นับ) */
  if(Array.isArray(response?.harvested))for(const p of response.harvested){add('harvest',1);if(p?.c==='pumpkin')add('pumpkin',1);}
  else for(const [f,rows]of Object.entries(before?.farms||{}))(rows||[]).forEach((p,i)=>{if(p?.ph==='ready'&&!after?.farms?.[f]?.[i]){add('harvest',1);if(p.c==='pumpkin')add('pumpkin',1);}});
 }
 if(system==='farm'&&type==='fruit-harvest'){
  const b=before?.fruit?.plots||[],a=after?.fruit?.plots||[];a.forEach((t,i)=>{if(t&&b[i]&&(t.last||0)>(b[i].last||0))add('tree',1);});
 }
 if(system==='craft'){add('cook',Math.max(0,sum(after?.bag?.food)+sum(after?.bag?.gfood)-sum(before?.bag?.food)-sum(before?.bag?.gfood)));}
 if(system==='fishing'){const n=g=>Object.values(g?.sub?.fishing?.cat||{}).reduce((s,c)=>s+(Number(c?.n)||0),0);add('fish',Math.max(0,n(after)-n(before)));}
 // กุศลที่ได้จากมินิเกม (นับเฉพาะยอดที่ได้ ยอดที่เสียไม่นับ)
 // fix15d: มินิเกมเดี่ยว (ยิงนก ตุ่น แม่มด ฯลฯ) จ่ายกุศลที่ชนะเป็นซองจดหมาย จึงนับจากรางวัลในผลของรายการนั้นด้วย
 if(system==='minigames'){const won=(response?.rewards||[]).reduce((s,x)=>s+Math.max(0,Number(x?.merit)||0),0);add('mgmerit',won+Math.max(0,(Number(after?.merit)||0)-(Number(before?.merit)||0)));}
 else if(system==='funrun'||system==='kang')add('mgmerit',Math.max(0,(Number(after?.merit)||0)-(Number(before?.merit)||0)));
 if(system==='outings'&&type==='deliver'&&!before?.honey?.delivered&&after?.honey?.delivered)add('delivery',1);
 if(system==='boxes'||system==='birdbox'){
  const total=g=>sum(g?.bag?.box)+sum(g?.bag?.birdbox)+BOX_PATHS.reduce((s,p)=>s+at(g,p),0);add('box',Math.max(0,total(before)-total(after)));
 }
 if(system==='friends'&&type==='prank')add('prank',1);
 if(system==='safari'&&type==='research'&&response?.receipt)add('research',1);
 // ตัดขนอัลปาก้า / เก็บดอกไม้ เกิดในหน้าเกม แจ้งผ่านเนเบอร์ฮูด (จำกัดต่อครั้ง)
 if(system==='nb'&&type==='report'&&['shear','flower'].includes(input?.kind)&&Number.isInteger(input?.n))add(input.kind,Math.min(50,Math.max(0,input.n)));
 if(system==='farmshop'&&type==='clear')add('sell',1);
 /* fix19 ภารกิจพิเศษ: ยาพิษจากหีบแม่มด (เล็ก1 กลาง2 ใหญ่4 ปีศาจแดง10) · ไอเทมปีศาจที่ส่งสำเร็จ (1/2/3/4 · ส่งต่อหัวใจ 4) · เดารหัสมหากุศลถูก (ครั้งที่ 1/2/3 = 3/2/1) */
 if(system==='market'&&type==='hw-chest')for(const p of response?.prizes||[])if(p?.kind==='poison'&&[0,1,2,3].includes(p.p))add('poison',[1,2,4,10][p.p]);
 if(system==='demon'&&type==='send'&&response?.sent?.kind)add('demon',{music:1,hour:2,coffin:3,heart:4}[response.sent.kind]||0);
 if(system==='demon'&&type==='pass'&&response?.pass)add('demon',4);
 if(system==='mahakusal'&&type==='guess'&&response?.result?.win&&[1,2,3].includes(response.result.tries))add('mkcode',4-response.result.tries);
 return Object.keys(q).length?q:null;
}
/* วันของเนเบอร์ฮูด = วันตามเวลาไทย (เที่ยงคืนไทยรีเซ็ต) */
export const nbDay=now=>new Date(now+7*3600000).toISOString().slice(0,10);
