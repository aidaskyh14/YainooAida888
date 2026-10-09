/* สิทธิ์มาจาก admins/{uid}; ชื่อที่แสดงไม่ได้ให้สิทธิ์แอดมิน */
export const ADMIN_STOCK = 99999;
const blocked=new Set(['__proto__','constructor','prototype']);
const put=(o,path,n)=>{const ks=path.split('.');if(ks.some(k=>blocked.has(k)))throw new Error('Invalid inventory path');let t=o;for(const k of ks.slice(0,-1))t=t[k] ||= {};const k=ks.at(-1),changed=t[k]!==n;t[k]=n;return changed;};
const fillNumbers=o=>{let changed=false;for(const k of Object.keys(o||{})){if(blocked.has(k))continue;if(typeof o[k]==='number'&&Number.isFinite(o[k])){if(o[k]!==ADMIN_STOCK){o[k]=ADMIN_STOCK;changed=true;}}else if(o[k]&&typeof o[k]==='object'&&!Array.isArray(o[k]))changed=fillNumbers(o[k])||changed;}return changed;};
export function refillAdminInventory(game,isAdmin,catalog) {
  if(!isAdmin)return false;
  let changed=false;game.unl ||= {};for(const k of ['c3','c4','f2','f3','f4'])if(!game.unl[k]){game.unl[k]=true;changed=true;}
  for(const c of catalog){const p=c.p;changed=put(game,p.startsWith('sub.')||p.startsWith('pend.')?p:'bag.'+p,ADMIN_STOCK)||changed;}
  for(const base of ['bag','pend'])if(game[base])changed=fillNumbers(game[base])||changed;
  for(const [id,fields]of Object.entries({barn:['stock'],birds:['vault','food'],dog:['bag'],alpaca:['bag']}))
    for(const f of fields)if(game.sub?.[id]?.[f])changed=fillNumbers(game.sub[id][f])||changed;
  const groups={
    'bag.cat':['calico','cream','explorer','ginger','gray'],
    'bag.catfood':['kibble','shreds','pate','biscuit','salmon','can'],
    'bag.hamster':['gardener','baker','explorer','scholar','wizard','sailor'],
    'sub.dog.bag.dogfood':['rice','stew','trotter','fishegg','cheeseball','feast'],
    'bag.rod':['bamboo','moon','honey','sakura'],
    'bag.fishing':['crab','vip']
  };
  for(const [base,keys]of Object.entries(groups))for(const k of keys)changed=put(game,base+'.'+k,ADMIN_STOCK)||changed;
  return changed;
}
export function consolidatePending(game,mappings) {
  let changed=false;
  for(const [key,path]of Object.entries(mappings)) {
    const n=game.pend?.[key];if(n===undefined)continue;
    if(!Number.isFinite(n)||n<0)throw new Error('ข้อมูลไอเทมรอย้ายไม่ถูกต้อง: '+key);
    const ks=path.split('.');let t=game;for(const k of ks.slice(0,-1))t=t[k] ||= {};
    t[ks.at(-1)]=(t[ks.at(-1)]||0)+n;delete game.pend[key];changed=true;
  }
  if(game.pend&&!Object.keys(game.pend).length)delete game.pend;
  return changed;
}
