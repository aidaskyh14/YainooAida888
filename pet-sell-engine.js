/* fix20: ขายสัตว์จากกระเป๋าทีละหลายตัว (ปลายซีซั่น) — คำนวณฝั่งเซิร์ฟเวอร์เท่านั้น
   ราคา/ตัว ตามตาราง · ทุก ๆ 100 ตัวที่ขายในวัน (นับเฉพาะ 2,000 ตัวแรกของวัน) ได้ของแถมสุ่ม 1 อย่าง 20–40 ชิ้น */
export const PET_SELL=[
 ['an-chicken','sub.barn.stock.chicken',2000],['an-fish','sub.barn.stock.fish',2000],['an-pig','sub.barn.stock.pig',3000],['an-cow','sub.barn.stock.cow',4000],
 ['bird-ostrich','sub.birds.vault.ostrich',20000],['bird-dodo','sub.birds.vault.dodo',30000],
 ['al-green','sub.alpaca.bag.al-green',5000],['al-lavender','sub.alpaca.bag.al-lavender',5000],['al-blue','sub.alpaca.bag.al-blue',5000],['al-yellow','sub.alpaca.bag.al-yellow',5000],['al-cream','sub.alpaca.bag.al-cream',5000],['al-gold','sub.alpaca.bag.al-cream-gold',50000],
 ...['husky','dalmatian','poodle','bichon','dachshund','pomeranian'].map(k=>['dog-'+k,'sub.dog.bag.dog.'+k,4000]),
 ...['calico','cream','explorer','ginger','gray'].map(k=>['cat-'+k,'bag.cat.'+k,4000]),
 ...['gardener','baker','explorer','scholar','wizard','sailor'].map(k=>['hamster-'+k,'bag.hamster.'+k,3000])];
export const PET_BONUS=[['angel','ปีกนางฟ้า'],['pestle','สากกะเบือ'],['cake','เค้ก'],['coconut','มะพร้าว']];
export const PET_BONUS_EVERY=100,PET_BONUS_DAY=2000,PET_BONUS_MIN=20,PET_BONUS_MAX=40,PET_MAX_ONCE=100000;
const fail=m=>{throw new Error(m);};
const dayKey=now=>new Date(now+7*3600000).toISOString().slice(0,10);
const getP=(o,p)=>p.split('.').reduce((a,k)=>a&&typeof a==='object'?a[k]:undefined,o);
const setP=(o,p,v)=>{const ks=p.split('.');let a=o;for(const k of ks.slice(0,-1)){if(!a[k]||typeof a[k]!=='object')a[k]={};a=a[k];}a[ks.at(-1)]=v;};
export const petHave=(game,path)=>{const n=getP(game,path);return Number.isSafeInteger(n)&&n>0?n:0;};
export const petBonusLeft=(x17,now)=>{const s=x17?.ps;return Math.max(0,PET_BONUS_DAY-(s&&s.d===dayKey(now)?Number(s.n)||0:0));};
/* input.items=[{k,q}] · q เป็นจำนวนเต็มบวก หรือ 'all' */
export function petSell(game,x17,input,now,rng=Math.random){
 const list=Array.isArray(input?.items)?input.items:[];if(!list.length||list.length>PET_SELL.length)fail('เลือกสัตว์ที่จะขายก่อน');
 const seen=new Set(),rows=[];let total=0,count=0;
 for(const it of list){const P=PET_SELL.find(p=>p[0]===it?.k);if(!P||seen.has(P[0]))fail('สัตว์ไม่ถูกต้อง');seen.add(P[0]);
  const have=petHave(game,P[1]),q=it.q==='all'?have:it.q;if(it.q==='all'&&!have)continue;if(!Number.isSafeInteger(q)||q<1)fail('จำนวนไม่ถูกต้อง');if(q>have)fail('มีไม่พอขาย ('+have+')');
  rows.push({k:P[0],path:P[1],q,each:P[2],total:P[2]*q});count+=q;total+=P[2]*q;}
 if(!rows.length)fail('ไม่มีสัตว์ให้ขายแล้ว');if(count>PET_MAX_ONCE)fail('ขายได้ครั้งละไม่เกิน '+PET_MAX_ONCE.toLocaleString('en-US')+' ตัว');
 for(const r of rows)setP(game,r.path,petHave(game,r.path)-r.q);
 game.merit=(Number(game.merit)||0)+total;
 const d=dayKey(now),s=x17.ps&&x17.ps.d===d?x17.ps:{d,n:0},n0=Number(s.n)||0,counted=Math.min(count,Math.max(0,PET_BONUS_DAY-n0)),rolls=Math.floor((n0+counted)/PET_BONUS_EVERY)-Math.floor(n0/PET_BONUS_EVERY);
 x17.ps={d,n:n0+counted};
 const bonus={};game.bag ||= {};game.bag.item ||= {};
 for(let i=0;i<rolls;i++){const r1=rng(),r2=rng();const b=PET_BONUS[Math.min(PET_BONUS.length-1,Math.floor(r1*PET_BONUS.length))][0],q=PET_BONUS_MIN+Math.min(PET_BONUS_MAX-PET_BONUS_MIN,Math.floor(r2*(PET_BONUS_MAX-PET_BONUS_MIN+1)));
  bonus[b]=(bonus[b]||0)+q;const cur=Number(game.bag.item[b]);game.bag.item[b]=(Number.isSafeInteger(cur)&&cur>0?cur:0)+q;}
 return {rows:rows.map(({path,...r})=>r),count,total,bonus,bonusLeft:Math.max(0,PET_BONUS_DAY-x17.ps.n),toNext:x17.ps.n>=PET_BONUS_DAY?0:PET_BONUS_EVERY-(x17.ps.n%PET_BONUS_EVERY)};
}
