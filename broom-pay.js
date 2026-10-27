/* fix23 🧹 จ่ายแทนไม้กวาดแม่มด — ใช้ได้ทั้งเซิร์ฟเวอร์และหน้าเว็บ (ไม่มีกลไกลับ)
   ทุกที่ที่ใช้ไม้กวาด เลือกจ่ายด้วยของ 7 อย่างนี้แทนได้ ราคา ×5 · เลือกอย่างเดียว หรือ 'mix' = คละอัตโนมัติ (หักกองที่เยอะที่สุดก่อน ให้กองเท่า ๆ กัน)
   ของ 7 อย่างนี้ใช้หักหัวใจทับทิมปีศาจด้วย (demon-engine) */
export const ALT_ITEMS=[['pestle','สากกะเบือ','animals-item-pestle.webp'],['coconut','มะพร้าว','item-coconut.webp'],['cake','เค้ก','item-cake.webp'],['fuel','แกลลอนน้ำมัน','honey-fuelcan.webp'],['hat','หมวกกะลาสี','honey-sailorhat.webp'],['musicbox','กล่องดนตรี','animals-item-musicbox.webp'],['angel','ปีกนางฟ้า','item-angelwings.webp']];
export const ALT_X=5;
const num=v=>Number.isSafeInteger(v)&&v>0?v:0;
const fail=m=>{throw Object.assign(new Error(m),{code:'failed-precondition'});};
const fmt=n=>Math.round(n).toLocaleString('en-US');
export const altKeys=ALT_ITEMS.map(x=>x[0]);
export const altQ=(game,k)=>num(game?.bag?.item?.[k]);
export const altHave=(game,k='mix')=>k==='mix'?ALT_ITEMS.reduce((a,[x])=>a+altQ(game,x),0):altQ(game,k);
/* หักของ n ชิ้น: k = ชนิดเดียว หรือ 'mix' · ไม่พอ = หักเท่าที่มี คืน short */
export function altTake(game,n,k='mix'){game.bag ||= {};game.bag.item ||= {};const it=game.bag.item,out={};let left=n;
  if(k!=='mix'){const q=num(it[k]),t=Math.min(q,left);if(t){it[k]=q-t;out[k]=t;left-=t;}return {items:out,n:n-left,short:left};}
  while(left>0){let best=null,bq=0,second=0;for(const x of altKeys){const q=num(it[x]);if(q>bq){second=bq;bq=q;best=x;}else if(q>second)second=q;}if(!best)break;
    const t=Math.min(left,Math.max(1,bq-second));it[best]=bq-t;out[best]=(out[best]||0)+t;left-=t;}
  return {items:out,n:n-left,short:left};}
/* จ่ายค่าไม้กวาด n อัน: alt ว่าง/'broom' = ไม้กวาด · 'mix' หรือชนิดของ = ของ n×5 ชิ้น (ต้องมีพอ) */
export function payBroom(game,n,alt){n=num(n);if(!n)return {broom:0};
  if(!alt||alt==='broom'){const have=num(game.bag?.halloween?.broom);if(have<n)fail('ไม้กวาดแม่มดไม่พอ ต้องมี '+fmt(n)+' (มี '+fmt(have)+') · เลือกจ่ายด้วยของแทนได้');game.bag.halloween.broom=have-n;return {broom:n};}
  if(alt!=='mix'&&!altKeys.includes(alt))fail('เลือกของที่จะใช้แทนไม้กวาด');
  const need=n*ALT_X,have=altHave(game,alt);if(have<need)fail((alt==='mix'?'ของรวม':ALT_ITEMS.find(x=>x[0]===alt)[1])+'ไม่พอ ต้องมี '+fmt(need)+' (มี '+fmt(have)+')');
  const t=altTake(game,need,alt);return {broom:0,items:t.items,n:t.n};}
export const altText=items=>Object.entries(items||{}).map(([k,q])=>(ALT_ITEMS.find(x=>x[0]===k)||[k,k])[1]+' '+fmt(q)).join(' · ');
/* หน้าต่างเลือกวิธีจ่าย (หน้าเว็บ): คืน 'broom' | 'mix' | ชนิดของ | null (ยกเลิก) */
export function altPick(doc,{n,broom,game,title,img='images/'}){return new Promise(res=>{const need=n*ALT_X,mix=altHave(game);
  const ov=doc.createElement('div');ov.setAttribute('style','position:fixed;inset:0;z-index:2147483000;background:rgba(20,8,16,.55);display:flex;align-items:flex-end;justify-content:center;font-family:inherit');
  const row=(v,ic,t,s,ok,hot)=>'<button data-v="'+v+'" '+(ok?'':'disabled ')+'style="display:flex;align-items:center;gap:.6rem;width:100%;margin:.28rem 0;padding:.5rem .7rem;border-radius:14px;border:2px solid '+(hot?'#7C3AED':'#EADFF5')+';background:'+(ok?'#fff':'#F4F0F6')+';opacity:'+(ok?1:.5)+';font:inherit;text-align:left;color:#3B2340;cursor:pointer">'+ic+'<span style="flex:1"><b style="display:block;font-size:.95rem">'+t+'</b><small style="color:#8A6E86">'+s+'</small></span></button>';
  const pic=f=>'<img src="'+img+f+'" alt="" style="width:42px;height:42px;object-fit:contain">';
  ov.innerHTML='<div style="background:#FFFBF5;width:100%;max-width:480px;max-height:86vh;overflow:auto;border-radius:22px 22px 0 0;padding:1rem 1rem 1.2rem;box-shadow:0 -8px 30px rgba(0,0,0,.25)">'
    +'<h3 style="margin:.1rem 0 .2rem;text-align:center;color:#3B2340">'+(title||'🧹 เลือกวิธีจ่าย')+'</h3><div style="text-align:center;font-size:.8rem;color:#8A6E86;margin-bottom:.4rem">ใช้ไม้กวาด '+fmt(n)+' อัน หรือใช้ของแทน ×5 = '+fmt(need)+' ชิ้น</div>'
    +row('broom',pic('halloween-hw-broom.webp'),'🧹 ไม้กวาดแม่มด '+fmt(n)+' อัน','มี '+fmt(broom),broom>=n,broom>=n)
    +row('mix','<span style="width:42px;text-align:center;font-size:1.8rem">🎁</span>','คละของอัตโนมัติ '+fmt(need)+' ชิ้น','หักกองที่มีเยอะก่อน · มีรวม '+fmt(mix),mix>=need,broom<n&&mix>=need)
    +ALT_ITEMS.map(([k,nm,f])=>{const q=altQ(game,k);return row(k,pic(f),nm+' '+fmt(need)+' ชิ้น','มี '+fmt(q),q>=need,false);}).join('')
    +'<button data-v="" style="display:block;margin:.6rem auto 0;padding:.55rem 1.6rem;border-radius:99px;border:0;background:#3B2340;color:#fff;font:inherit;font-weight:700">ยกเลิก</button></div>';
  const done=v=>{ov.remove();res(v||null);};
  ov.addEventListener('click',e=>{if(e.target===ov)return done(null);const b=e.target.closest('button[data-v]');if(b&&!b.disabled)done(b.dataset.v);});
  doc.body.appendChild(ov);});}
