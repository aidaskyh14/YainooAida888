/* เซฟแยกเอกสาร: JSON เป็นข้อความ เพื่อไม่สร้างดัชนีตามทุกช่องในเกม */
export const STORAGE_VERSION = 2;
export const MAX_PAYLOAD_BYTES = 128 * 1024;
export const MAX_PARTS = 240;
const plain = o => o !== null && typeof o === 'object' && !Array.isArray(o);
export const bytes = s => new TextEncoder().encode(s).length;
export function partId(path) {
  if(path[0]==='@') return path[1]==='farm'?'farm-settings':path[1];
  const prefix={sub:'animals',farms:'farm',_ls:'module'}[path[0]];
  if(prefix)return prefix+'-'+encodeURIComponent(path[1]).replaceAll('.', '%2E');
  return path.map(x => encodeURIComponent(x).replaceAll('.', '%2E')).join('~');
}
function system(path) {
  if (path[0] === 'bag') return 'inventory';
  if (path[0] === 'sub') return path[1];
  if (path[0] === '_ls') return 'module';
  if (['merit','lv','fuel','fuelAt','steals','magics'].includes(path[0])) return 'wallet';
  if (['plots','barrels','hedge','house','rest','fortune','drops','nextDrop'].includes(path[0])) return 'house';
  if (['ham','hamster','hamsters','bbq','picnic','backyard'].includes(path[0])) return 'backyard';
  if (path[0] === 'cat') return 'catpen';
  if (['honey','son'].includes(path[0])) return 'outings';
  return 'farm';
}
export function splitGame(game) {
  const out = new Map(), groups = {};
  function add(path,data,sys) {
    const payload = JSON.stringify(data);
    if (bytes(payload) > MAX_PAYLOAD_BYTES) {
      const e = new Error('ข้อมูลส่วน '+sys+' เกิน 128 KB ต้องตรวจและลดข้อมูลสะสมในระบบนี้ก่อนบันทึก');
      e.code = 'save/part-too-large'; throw e;
    }
    out.set(partId(path), {path,system:sys,payload});
  }
  for (const [key, value] of Object.entries(game || {})) {
    if(value===undefined)continue;
    if (['sub','_ls','farms'].includes(key) && plain(value)) {
      for(const [k,v] of Object.entries(value)) {
        let data=v;
        const privateFields={barn:['stock'],birds:['vault','food'],dog:['bag'],alpaca:['bag']}[k];
        if(key==='sub' && privateFields && plain(v)) {
          data={...v};
          for(const field of privateFields)if(field in data) {
            (groups.inventory ||= {})['$moduleInventory'] ||= [];
            groups.inventory['$moduleInventory'].push({path:['sub',k,field],data:data[field]});delete data[field];
          }
        }
        add([key,k],data,key==='sub'?k:key==='farms'?'farm-'+k:'module-'+k);
      }
    } else {
      const sys=key==='pend'?'inventory':system([key]);
      (groups[sys] ||= {})[key]=value;
    }
  }
  for(const [sys,data] of Object.entries(groups))add(['@',sys],data,sys);
  if (out.size > MAX_PARTS) { const e = new Error('มีส่วนเซฟเกิน '+MAX_PARTS+' ส่วน หยุดบันทึกเพื่อไม่เพิ่มข้อมูลโดยไม่จำกัด'); e.code='save/too-many-parts'; throw e; }
  return out;
}
export function joinGame(parts) {
  const game = {}, inventories = [];
  for (const part of parts) {
    if (!Array.isArray(part.path) || part.path.length < 1 || part.path.length > 2 || part.path.some(k=>['__proto__','constructor','prototype'].includes(k))) throw new Error('รูปแบบเซฟไม่ถูกต้อง');
    const data = JSON.parse(part.payload);
    if (part.path[0] === '@') {
      if(part.path[1]==='inventory' && data['$moduleInventory']) { inventories.push(...data['$moduleInventory']);delete data['$moduleInventory']; }
      if(!plain(data)||Object.keys(data).some(k=>['__proto__','constructor','prototype'].includes(k)))throw new Error('รูปแบบเซฟไม่ถูกต้อง');
      for(const k of Object.keys(data)) {if(k in game)throw new Error('พบข้อมูลหลักซ้ำ: '+k);game[k]=data[k];}
    }
    else if (part.path.length === 1) game[part.path[0]] = data;
    else { game[part.path[0]] ||= {}; game[part.path[0]][part.path[1]] = data; }
  }
  for(const item of inventories) {
    if(!Array.isArray(item.path)||item.path.length!==3||item.path[0]!=='sub'||!['barn','birds','dog','alpaca'].includes(item.path[1])||['__proto__','constructor','prototype'].includes(item.path[2]))throw new Error('ข้อมูลกระเป๋าของระบบไม่ถูกต้อง');
    game.sub ||= {};game.sub[item.path[1]] ||= {};
    if(item.path[2] in game.sub[item.path[1]])throw new Error('พบกระเป๋าซ้ำในเซฟระบบ');
    game.sub[item.path[1]][item.path[2]]=item.data;
  }
  return game;
}
export function diffs(previous, next) {
  const changed=[];
  for(const [id,p] of next) if(previous.get(id)?.payload !== p.payload) changed.push([id,p]);
  for(const id of previous.keys()) if(!next.has(id)) changed.push([id,null]);
  return changed;
}
