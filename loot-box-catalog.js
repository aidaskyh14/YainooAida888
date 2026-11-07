// Confirmed Season 3 material book. Weights total 100 for every box.
const row=(weight,type,value)=>({weight,type,value});
const common=[row(10,'animal'),row(20,'salt'),row(30,'merit',[10,300]),row(6,'grass',10),row(6,'item',['musicbox',3]),row(6,'item',['fuel',100]),row(5,'item',['hat',1]),row(6,'food',2),row(6,'drink',1),row(5,'rod',1)];
const box=(id,key,path,image,rows)=>({id,key,path,image,animation:image.replace('.webp','-open-4x4.webp'),rows});
export const BOXES=[
 box('dog','box-dog','bag.item.boxdog','dog-box-dog.webp',common),
 box('cat','box-cat','bag.box.cat','cat-box-cat.webp',common),
 box('hamster','box-hamster','bag.box.hamster','hamster-box-hamster.webp',[...common.slice(0,-1),row(3,'rod',1),row(2,'medicine',[3,5])]),
 box('alpaca','box-alpaca','sub.alpaca.bag.box','boxes-box-alpaca.webp',[row(10,'animal'),row(30,'salt'),row(12,'item',['hay',10]),row(12,'item',['musicbox',10]),row(12,'item',['pestle',30]),row(12,'grass',30),row(12,'item',['license',10])]),
 box('ostrich','bird-box-ostrich','bag.birdbox.ostrich','boxes-box-ostrich.webp',[row(20,'animal'),row(30,'salt'),row(3,'merit',[500,1000]),row(10,'food',5),row(10,'grass',30),row(9,'item',['license',10]),row(9,'item',['cake',10]),row(9,'item',['coconut',30])]),
 box('dodo','bird-box-dodo','bag.birdbox.dodo','boxes-box-dodo.webp',[row(10,'animal'),row(50,'salt'),row(3,'merit',[100,500]),row(8,'item',['hay',100]),row(8,'item',['hat',30]),row(7,'item',['wings',30]),row(7,'item',['coconut',30]),row(7,'medicine',[3,5])]),
 box('plant','box-plant','bag.box.plant','boxes-box-clover.webp',[row(85,'plants'),row(10,'salt'),row(5,'merit',[100,300])]),
 box('fruit','box-fruit','bag.box.fruit','boxes-box-berry.webp',[row(19,'item',['peach',30]),row(19,'item',['orange',30]),row(19,'item',['apple',30]),row(19,'item',['cherry',30]),row(21,'flower',10),row(3,'merit',[300,1800])])
];
/* S4 ข้อ 19 (5 พ.ย.): ทุกกล่อง (ยกเว้นมหากุศล) ได้เกลือ 22% · ช่องอื่นลดลงตามสัดส่วนเดิม รวมยัง 100 */
const SALT=22;for(const b of BOXES){const rows=b.rows.map(r=>({...r})),other=rows.filter(r=>r.type!=='salt'),tot=other.reduce((t,r)=>t+r.weight,0);for(const r of other)r.weight=Math.round(r.weight*(100-SALT)/tot*1000)/1000;const d=Math.round((100-SALT-other.reduce((t,r)=>t+r.weight,0))*1000)/1000;other.at(-1).weight=Math.round((other.at(-1).weight+d)*1000)/1000;const sr=rows.find(r=>r.type==='salt');if(sr)sr.weight=SALT;else rows.push(row(SALT,'salt'));b.rows=rows;}/* ลำดับช่องเดิม (เกลืออยู่ตำแหน่งเดิม) */
/* S4 ข้อ 18: 🎁 กล่องสุ่มของประดับตกแต่ง (ยัยหนูส่งทางไปรษณีย์เท่านั้น · ไม่แสดงอัตรา) · ของแต่งเฉลี่ย ~8.5 ชิ้น ต่อ 1,000 กล่อง */
BOXES.push(box('decor','box-decor','bag.box.decor','box-decor2.webp',[row(25,'salt'),row(50,'meritT'),row(21.65,'speed'),row(2,'item',['cityfuel',3]),row(.5,'coins',[1,5]),row(.3,'decor','theme'),row(.35,'decor','small'),row(.15,'decor','normal'),row(.04,'decor','rare'),row(.01,'decor','house')]));/* S4 3.8: น้ำมันรถ 2% ครั้งละ 3 แกลลอน */
/* S4 3.7: 👗 กล่องสุ่มเสื้อผ้า (ยัยหนูส่งเท่านั้น) · ชุด 0.25% เฉพาะตัวละครที่เป็นอยู่ (คลาส 80/16/3.5/0.5) · ผลผลิตสัตว์ 50% · กุศล 22% (300–3,000) · วัสดุฟาร์ม 10% · ของลอยกระทง 5% · ดรอป 5.75% · เกลือ 5% · น้ำมันรถ 2% */
BOXES.push(box('outfit','box-outfit','bag.box.outfit','box-outfit.webp',[row(50,'animalProduct'),row(22,'merit',[300,3000]),row(10,'farmMat'),row(5,'lk'),row(5.75,'drops'),row(5,'salt'),row(2,'item',['cityfuel',3]),row(.25,'outfit')]));
export const MERIT_TABLE=[[100,50],[300,30],[500,15],[2000,4.5],[10000,.45],[100000,.05]];
export const SPEED_TABLE=[['fert',17],['fertfruit',17],['potion',17],['battery',17],['boost-bait',17],['fertfruitP',5],['boost-lens',5],['boost-gear',5]];
export const BOX_QUANTITIES=[1,10,50,100,500,1000,2000,5000];
export const getBoxCount=(game,box)=>box.path.split('.').reduce((o,k)=>o?.[k],game)||0;
