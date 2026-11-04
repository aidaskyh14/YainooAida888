/* S4 ข้อ 32–36/53/104/111 🎒 สิทธิ์ของตกแต่ง (ใช้ร่วมฟาร์มหลัก + โซนสัตว์ทุกโซน)
   มีได้ = ฟรี(ชิ้นละ 1 · ตาม S4FREE) + bag.decor[id] ที่ยัยหนูส่ง − ที่วางอยู่รวมทุกโซน
   · พื้น/ทางเดิน/รั้ว ไม่จำกัด · ของที่วางอยู่ไม่หักจากกระเป๋า (เก็บเข้าถุง = นับคืนอัตโนมัติ) · เซิร์ฟเวอร์เก็บ bag.decor แบบจำนวนเต็มไม่ติดลบ
   แก้สิทธิ์ฟรีได้ที่ S4FREE ด้านล่าง (ตามสมุดเล่ม 2 เมื่อเธอติ๊ก) */
(function(){
 const S4FREE={_default:1,_inf:/^(tile_|fz_|path$|erase$|fence$)/,oak:3,bush:3,pine:2,sakura:2,tree:2,bench:2,d_stylized_lanterns:2,d_flower_planter:2,d_flower_pots:2,d_sunflowers:2,fspot:0,plot:0};
 const H=(()=>{try{let w=window;for(let i=0;i<4;i++){if(w.__HOST)return w.__HOST;if(w===w.parent)break;w=w.parent;}}catch(e){}return null;})();
 const ZONES=['dog','cat','hamster','alpaca'];
 let cache=null,cacheAt=0;
 function read(){const now=Date.now();if(cache&&now-cacheAt<800)return cache;const placed={farm:{}},owned={};
  try{const g=H&&JSON.parse(H.get('s3all-v1')||'null');const d=g&&g.bag&&g.bag.decor;if(d)for(const k in d)owned[k]=Number(d[k])||0;}catch(e){}
  try{const m=H&&JSON.parse(H.get('s4deco-farm')||'null');const lay=m&&m['farm1-layout6']&&JSON.parse(m['farm1-layout6']);if(Array.isArray(lay))for(const r of lay){const t=r[0];placed.farm[t]=(placed.farm[t]||0)+1;}}catch(e){}
  placed.safari={};try{const m=H&&JSON.parse(H.get('s4deco-safari')||'null');const sv=m&&m['safari-pv-decor-v4']&&JSON.parse(m['safari-pv-decor-v4']);if(sv&&Array.isArray(sv.d))for(const r of sv.d)placed.safari[r[0]]=(placed.safari[r[0]]||0)+1;}catch(e){}
  for(const z of ZONES){placed[z]={};try{const l=H&&JSON.parse(H.get('s4deco-'+z)||'null');if(Array.isArray(l))for(const it of l)if(it&&it.n)placed[z][it.n]=(placed[z][it.n]||0)+1;}catch(e){}}
  cache={placed,owned};cacheAt=now;return cache;}
 const free=t=>S4FREE._inf.test(t)?Infinity:(t in S4FREE?S4FREE[t]:S4FREE._default);
 /* local={src:'farm'|'dog'|..., n:จำนวนที่วางในโซนนี้ตอนนี้ (สด แทนค่าที่เซฟไว้ของโซนนั้น)} */
 const placedN=(t,local)=>{const c=read();let n=0;for(const src in c.placed){if(local&&src===local.src)continue;n+=c.placed[src][t]||0;}return n+(local?local.n:0);};
 window.S4OWN={free,
  owned:t=>read().owned[t]||0,
  placed:placedN,
  avail:(t,local)=>{const f=free(t);if(f===Infinity)return Infinity;return Math.max(0,f+(read().owned[t]||0)-placedN(t,local));},
  total:t=>{const f=free(t);return f===Infinity?Infinity:f+(read().owned[t]||0);},
  invalidate:()=>{cache=null;},
  rules:S4FREE};
})();
