/* fix36 🪷 ลอยกระทงที่แม่น้ำนคร — กติกาล้วน ใช้ร่วมเว็บ (แสดงผล) + เซิร์ฟเวอร์ (หักของ/สุ่มกุศล/บันทึกลงแม่น้ำ)
   กระทง 8 แบบ · วัตถุดิบ 7 อย่าง "ทุกอย่าง อย่างละเท่ากัน" ตามแบบ 39/49/59/69/79/89/99/99 · ลอยได้วันละ 20 ใบ/คน (เวลาไทย)
   ลอยแล้วสุ่มกุศล 1–999,999 เท่า ๆ กันทุกเลข (สุ่มที่เซิร์ฟเวอร์) · กระทงอยู่ในแม่น้ำให้ทุกคนเห็น มีชื่อผู้ลอย · เคลียร์ทุกเที่ยงคืนไทย · เก็บไม่เกิน 600 ใบ (เกินแล้วใบเก่าสุดหายก่อน) */
export const LOY_DESIGNS=[
 {k:1,n:'กระทงใบตอง',cost:39},{k:2,n:'กระทงบัวชมพู',cost:49},{k:3,n:'กระทงขนมปัง',cost:59},{k:4,n:'กระทงกะลามะพร้าว',cost:69},
 {k:5,n:'กระทงกุหลาบแดง',cost:79},{k:6,n:'กระทงทองลายไทย',cost:89},{k:7,n:'กระทงคริสตัลสายรุ้ง',cost:99},{k:8,n:'กระทงผีน้อย',cost:99}];
export const LOY_ING=[['item','angel','ปีกนางฟ้า'],['item','coconut','มะพร้าว'],['item','cake','เค้ก'],['item','pestle','สากกะเบือ'],['item','musicbox','กล่องดนตรี'],['item','hat','หมวกกะลาสี'],['wine','*','ไวน์ (รวมทุกชนิด)']];
export const LOY_PER_DAY=20,LOY_MAX=600,LOY_MIN=1,LOY_MAXR=999999;
export const thaiDay=now=>new Date(now+7*3600000).toISOString().slice(0,10);
export function loyHave(game,g,k){const bag=(game&&game.bag)||{};if(k==='*')return Object.values(bag[g]||{}).reduce((a,b)=>a+Math.max(0,Math.floor(Number(b)||0)),0);return Math.max(0,Math.floor(Number((bag[g]||{})[k])||0));}
export function loyCan(game,k){const D=LOY_DESIGNS.find(d=>d.k===Number(k));if(!D)return {ok:false,miss:[],cost:0,have:{}};const have={};const miss=[];for(const [g,key,n] of LOY_ING){const h=loyHave(game,g,key);have[g+'.'+key]=h;if(h<D.cost)miss.push(n);}return {ok:!miss.length,miss,cost:D.cost,have};}
export function loyUsed(game,now){const st=(game&&game.sub&&game.sub.loy)||{};return st.d===thaiDay(now)?(Number(st.n)||0):0;}
export function loyFloat(game,world,{uid,name,now,rng,k}){
 const D=LOY_DESIGNS.find(d=>d.k===Number(k));if(!D)throw Error('เลือกแบบกระทงก่อน');
 game.sub ||= {};const st=game.sub.loy ||= {};const day=thaiDay(now);if(st.d!==day){st.d=day;st.n=0;}
 if((Number(st.n)||0)>=LOY_PER_DAY)throw Error('วันนี้ลอยครบ '+LOY_PER_DAY+' กระทงแล้ว พรุ่งนี้มาลอยใหม่นะ');
 const c=loyCan(game,D.k);if(!c.ok)throw Error('ของไม่พอ: '+D.n+' ต้องใช้ '+c.miss.join(', ')+' อย่างละ '+D.cost);
 const bag=game.bag;for(const [g,key] of LOY_ING){if(key==='*'){let left=D.cost;for(const w of Object.keys(bag[g]).sort()){const h=Math.max(0,Math.floor(Number(bag[g][w])||0));const t=Math.min(left,h);bag[g][w]=h-t;left-=t;if(!left)break;}if(left)throw Error('ไวน์ไม่พอ');}else bag[g][key]=loyHave(game,g,key)-D.cost;}
 const r=LOY_MIN+Math.floor(rng()*(LOY_MAXR-LOY_MIN+1));game.merit=(Number(game.merit)||0)+r;st.n=(Number(st.n)||0)+1;
 const W=world&&typeof world==='object'?world:{};let items=(W.day===day&&Array.isArray(W.items))?W.items.slice():[];
 const id='k'+now.toString(36)+Math.floor(rng()*46656).toString(36);items.push({id,k:D.k,n:String(name||'ผู้เล่น').slice(0,20),u:String(uid||''),at:now,s:Math.floor(rng()*1e6)});
 if(items.length>LOY_MAX)items=items.slice(items.length-LOY_MAX);
 return {world:{day,items,updatedAt:now},r,id,left:LOY_PER_DAY-st.n,k:D.k,name:D.n};}
export function loyPublic(world,now){const day=thaiDay(now);if(!world||world.day!==day||!Array.isArray(world.items))return {day,items:[]};return {day,items:world.items.map(x=>({id:x.id,k:x.k,n:x.n,at:x.at,s:x.s}))};}
