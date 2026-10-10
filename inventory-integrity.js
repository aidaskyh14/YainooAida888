/* Canonical inventory quantities. Never use object defaults for numeric leaves. */
export const quantity=n=>Number.isSafeInteger(n)&&n>=0?n:0;
/* Module inventories stored beside the main bag (save-schema $moduleInventory).
   depth = depth of their direct children: 1 when children are groups (bag.crop.x), 2 when children are counts. */
export const MODULE_INVENTORIES=[['alpaca','bag',2],['dog','bag',1],['birds','food',2],['birds','vault',2],['barn','stock',2]];
const plain=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
function roots(game){
 const out=[];if(plain(game?.bag))out.push(['bag',game.bag,1]);
 for(const[id,field,depth]of MODULE_INVENTORIES){const v=game?.sub?.[id]?.[field];if(plain(v))out.push(['sub.'+id+'.'+field,v,depth]);}
 return out;
}
export function inventoryIssues(game){
 const issues=[];const visit=(value,path,depth)=>{
  if(value&&typeof value==='object'&&!Array.isArray(value)){
   const entries=Object.entries(value);if(!entries.length&&depth>=2){issues.push({path,raw:value});return;}
   for(const[k,v]of entries)visit(v,path+'.'+k,depth+1);return;
  }
  if(!Number.isSafeInteger(value))issues.push({path,raw:value===undefined?null:value});
 };
 for(const[path,obj,depth]of roots(game))for(const[k,v]of Object.entries(obj))visit(v,path+'.'+k,depth);
 return issues;
}
export function repairInventory(game){const issues=inventoryIssues(game);for(const {path,raw}of issues){let o=game;const k=path.split('.'),last=k.pop();for(const x of k)o=o[x];const number=typeof raw==='string'&&/^-?\d+$/.test(raw)?Number(raw):NaN;o[last]=Number.isSafeInteger(number)?number:0;}return issues;}
export function inventoryView(game){const out=structuredClone(game);repairInventory(out);return out;}
export function assertInventory(game,before=game){
 /* An issue already present unchanged in `before` was not introduced by this change (it is repaired by the server's
    integrity action); only new corruption blocks the write. With no separate `before`, every issue blocks. */
 const old=before===game?new Set():new Set(inventoryIssues(before).map(i=>i.path+'\u0000'+JSON.stringify(i.raw)));
 const bad=inventoryIssues(game).filter(i=>!old.has(i.path+'\u0000'+JSON.stringify(i.raw)));const prior=p=>p.split('.').reduce((o,k)=>o?.[k],before);
 const visit=(o,path)=>{if(o&&typeof o==='object'){for(const[k,v]of Object.entries(o))visit(v,path?path+'.'+k:k);}else if(Number.isSafeInteger(o)&&o<0&&o<Math.min(0,Number.isSafeInteger(prior(path))?prior(path):0))bad.push({path,raw:o});};
 for(const[path,obj]of roots(game))visit(obj,path);
 if(bad.length)throw Object.assign(new Error('จำนวนของไม่ถูกต้อง หยุดรายการเพื่อไม่ให้ของติดลบเพิ่ม กรุณาโหลดข้อมูลล่าสุด'),{code:'failed-precondition'});
}
