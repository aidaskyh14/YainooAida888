/* S4 ข้อ 157/162/162b 🧹 เริ่มศูนย์ซีซั่น — กติกาล้วน (ใช้ทั้งเซิร์ฟเวอร์และหน้าแอดมิน)
   · เก็บ "กระเป๋า" ทุกชิ้นตามจำนวนเดิม: game.bag ทั้งก้อน + กระเป๋าของระบบ (barn.stock · birds.vault/food · dog.bag · alpaca.bag)
   · ล้างอย่างอื่นทั้งหมด: กุศล 0 · เลเวล 1 · น้ำมัน 100 · แปลงว่าง 4 ฟาร์ม · บ้าน/หลังบ้าน/แมว/น้องน้ำผึ้ง/สัตว์ที่วาง/ตัวจับเวลา/ประวัติ
     · _ls (เลย์เอาต์ 3D ทุกโซน · ธง migration · สมุดปลา · พอร์ตหุ้น ฯลฯ) · pend (ของค้างรับ)
   · ข้อยกเว้นที่เธอสั่ง: ลบบัตร ATM ซีซั่น 3 (item.atmcard) · เก็บรูปโปรไฟล์ (av) ไว้ */
export const RESET_KEEP_SUB={barn:['stock'],birds:['vault','food'],dog:['bag'],alpaca:['bag']};
export const RESET_DROP_BAG=['item.atmcard'];
const plain=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
const clone=o=>o===undefined?undefined:JSON.parse(JSON.stringify(o));
function prune(o){/* ตัดช่องศูนย์/ว่าง */if(!plain(o))return o;for(const k of Object.keys(o)){const v=o[k];if(plain(v)){prune(v);if(!Object.keys(v).length)delete o[k];}else if(typeof v==='number'&&!(v>0))delete o[k];}return o;}
export function resetGame(game){
 const g=game||{};const bag=clone(g.bag)||{};
 for(const p of RESET_DROP_BAG){const [a,b]=p.split('.');if(plain(bag[a]))delete bag[a][b];}
 prune(bag);
 const sub={};for(const [k,fields] of Object.entries(RESET_KEEP_SUB)){const src=g.sub&&g.sub[k];if(!plain(src))continue;for(const f of fields)if(f in src){(sub[k] ||= {})[f]=clone(src[f]);}}
 const out={merit:0,lv:1,fuel:100,unl:{},bag,farms:{1:Array(12).fill(null),2:Array(12).fill(null),3:Array(12).fill(null),4:Array(12).fill(null)},sub};
 if(typeof g.av==='string'&&g.av.length<20000)out.av=g.av;
 return out;}
/* สรุปของในกระเป๋าเป็นแผนที่ path→จำนวน (ไว้เทียบก่อน/หลัง ต้องตรงทุกชิ้น) */
export function bagSummary(game){const out={};const walk=(o,pre)=>{if(!plain(o))return;for(const [k,v] of Object.entries(o)){if(plain(v))walk(v,pre+k+'.');else if(typeof v==='number'&&v>0)out[pre+k]=v;else if(v!==undefined&&v!==null&&typeof v!=='number')out[pre+k]=JSON.stringify(v);}};
 walk(game&&game.bag,'bag.');
 for(const [k,fields] of Object.entries(RESET_KEEP_SUB)){const src=game&&game.sub&&game.sub[k];if(!plain(src))continue;for(const f of fields)if(f in src){const v=src[f];if(plain(v))walk(v,'sub.'+k+'.'+f+'.');else out['sub.'+k+'.'+f]=typeof v==='number'?v:JSON.stringify(v);}}
 return out;}
export function bagDiff(before,after){const d=[];const keys=new Set([...Object.keys(before),...Object.keys(after)]);for(const k of keys){if(RESET_DROP_BAG.some(p=>k==='bag.'+p))continue;if(before[k]!==after[k])d.push([k,before[k]??0,after[k]??0]);}return d;}
