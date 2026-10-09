/* Canonical inventory quantities. Never use object defaults for numeric leaves. */
export const quantity=n=>Number.isSafeInteger(n)&&n>=0?n:0;
export function inventoryIssues(game){
 const issues=[];const visit=(value,path,depth)=>{
  if(value&&typeof value==='object'&&!Array.isArray(value)){
   const entries=Object.entries(value);if(!entries.length&&depth>=2){issues.push({path,raw:value});return;}
   for(const[k,v]of entries)visit(v,path+'.'+k,depth+1);return;
  }
  if(!Number.isSafeInteger(value))issues.push({path,raw:value===undefined?null:value});
 };
 if(game.bag&&typeof game.bag==='object')for(const[k,v]of Object.entries(game.bag))visit(v,'bag.'+k,1);
 if(game.sub?.alpaca?.bag)for(const[k,v]of Object.entries(game.sub.alpaca.bag))visit(v,'sub.alpaca.bag.'+k,2);
 return issues;
}
export function repairInventory(game){const issues=inventoryIssues(game);for(const {path,raw}of issues){let o=game;const k=path.split('.'),last=k.pop();for(const x of k)o=o[x];const number=typeof raw==='string'&&/^-?\d+$/.test(raw)?Number(raw):NaN;o[last]=Number.isSafeInteger(number)?number:0;}return issues;}
export function inventoryView(game){const out=structuredClone(game);repairInventory(out);return out;}
export function assertInventory(game,before=game){
 const bad=inventoryIssues(game);const prior=p=>p.split('.').reduce((o,k)=>o?.[k],before);
 const visit=(o,path)=>{if(o&&typeof o==='object'){for(const[k,v]of Object.entries(o))visit(v,path?path+'.'+k:k);}else if(Number.isSafeInteger(o)&&o<0&&o<Math.min(0,Number.isSafeInteger(prior(path))?prior(path):0))bad.push({path,raw:o});};
 visit(game.bag,'bag');visit(game.sub?.alpaca?.bag,'sub.alpaca.bag');
 if(bad.length)throw Object.assign(new Error('จำนวนของไม่ถูกต้อง หยุดรายการเพื่อไม่ให้ของติดลบเพิ่ม กรุณาโหลดข้อมูลล่าสุด'),{code:'failed-precondition'});
}
