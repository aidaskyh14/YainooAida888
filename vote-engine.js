/* fix37 🗳️ โหวตสวนสวย — กติกาล้วน ใช้ร่วมเว็บ (แสดงผล) + เซิร์ฟเวอร์ (นับคะแนน/กันโกง)
   ผู้โหวต 1 "เครื่อง" (หรือ 1 บัญชีผู้เล่น) มี 5 ใจ/ชั่วโมง แจกให้บ้านไหนก็ได้ (บ้านเดียวซ้ำได้) · เครือข่ายเดียวกัน (IP) รวมไม่เกิน 15 ใจ/ชม. และ 60 ใจ/วัน
   ต้องเปิดดูสวนก่อน ≥10 วิ (โทเคนจากเซิร์ฟเวอร์) · โหวตได้เฉพาะช่วงเวลาที่แอดมินเปิด · ผู้เล่นโหวตตัวเองไม่ได้ */
export const VOTE_HEARTS=5,VOTE_IP_HOUR=40,VOTE_IP_DAY=400,VOTE_VIEW_MS=10000,VOTE_TOKEN_MAX=2*3600000,VOTE_TOP_AVATAR=60,VOTE_FARM_IP_HOUR=120;
export const thaiDay=now=>new Date(now+7*3600000).toISOString().slice(0,10);
export const hourKey=now=>Math.floor(now/3600000);
/* ช่วงเวลาเปิดโหวต: cfg={open,from,to,title,round} */
export function voteWindow(cfg,now){const c=cfg||{};if(!c.open)return {on:false,why:'closed',msg:'ยังไม่เปิดโหวต'};
 if(c.from&&now<c.from)return {on:false,why:'notyet',at:c.from,msg:'เปิดโหวต '+thaiTime(c.from)};
 if(c.to&&now>c.to)return {on:false,why:'ended',at:c.to,msg:'ปิดโหวตแล้วเมื่อ '+thaiTime(c.to)};
 return {on:true,...(c.to?{until:c.to}:{})};}
export const thaiTime=ms=>{try{const d=new Date(ms+7*3600000);return d.getUTCDate()+'/'+(d.getUTCMonth()+1)+' '+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0')+' น.';}catch(e){return '';}};
/* ตัวนับต่อผู้โหวต (เครื่อง/บัญชี): g={h,n} → ใจที่เหลือในชั่วโมงนี้ */
export function heartsLeft(g,now){const h=hourKey(now);if(!g||g.h!==h)return VOTE_HEARTS;return Math.max(0,VOTE_HEARTS-(Number(g.n)||0));}
export function heartsUse(g,now){const h=hourKey(now);const cur=(g&&g.h===h)?(Number(g.n)||0):0;if(cur>=VOTE_HEARTS)throw Object.assign(new Error('หมดใจในชั่วโมงนี้แล้ว (5 ใจ/ชั่วโมง) รอชั่วโมงถัดไปนะ'),{code:'resource-exhausted',wait:(h+1)*3600000-now});return {h,n:cur+1};}
/* ตัวนับต่อเครือข่าย (IP): g={h,n,d,dn} */
export function ipUse(g,now){const h=hourKey(now),d=thaiDay(now);const n=(g&&g.h===h)?(Number(g.n)||0):0,dn=(g&&g.d===d)?(Number(g.dn)||0):0;
 if(n>=VOTE_IP_HOUR)throw Object.assign(new Error('เครือข่ายนี้โหวตครบโควตาชั่วโมงนี้แล้ว'),{code:'resource-exhausted',wait:(h+1)*3600000-now});
 if(dn>=VOTE_IP_DAY)throw Object.assign(new Error('เครือข่ายนี้โหวตครบโควตาวันนี้แล้ว'),{code:'resource-exhausted'});return {h,n:n+1,d,dn:dn+1};}
/* ใส่คะแนน */
export function voteApply(world,cand,now){const W=world&&typeof world==='object'?world:{};const counts={...(W.counts||{})};counts[cand]=(Number(counts[cand])||0)+1;return {...W,counts,total:(Number(W.total)||0)+1,lastAt:now};}
/* จัดอันดับ: rows=[{uid,name,avatar?}] */
export function voteRank(world,rows){const counts=(world&&world.counts)||{};const list=rows.map(r=>({uid:r.uid,n:String(r.name||'ผู้เล่น').slice(0,24),v:Number(counts[r.uid])||0,...(r.avatar?{a:r.avatar}:{})}));
 list.sort((a,b)=>b.v-a.v||a.n.localeCompare(b.n,'th'));let rank=0,prev=null;list.forEach((x,i)=>{if(x.v!==prev){rank=i+1;prev=x.v;}x.r=rank;});return list;}
/* แปลงแปลงผักให้ฉาก 3D (ไม่ส่งรายละเอียดส่วนตัว) */
export function plotsPublic(arr,now){return (arr||[]).slice(0,12).map(p=>{if(!p||!p.c)return null;const ready=p.ph==='ready';return {c:p.c,ph:p.ph||'grow',st:ready?4:2,pr:ready?1:.6,angel:!!p.angel,magic:!!(p.magicUntil>now),pk:(p.pk&&p.pk.k)||null};});}
export function fruitPublic(fr){return ((fr&&fr.plots)||[]).slice(0,12).map(p=>p&&p.t?{t:p.t,grow:1,fr:0}:null);}
/* โทเคนดูสวน: payload ที่เซ็น */
export const tokenPayload=({cand,dev,iph,uid,t})=>[cand,dev||'',iph||'',uid||'',t].join('|');
export function tokenCheck(p,{cand,dev,iph,uid,now}){if(!p)return 'ยังไม่ได้เปิดดูสวนนี้';if(p.cand!==cand)return 'โทเคนไม่ตรงสวน';if((p.dev||'')!==(dev||''))return 'โทเคนไม่ตรงเครื่อง';if((p.iph||'')!==(iph||''))return 'โทเคนไม่ตรงเครือข่าย';if((p.uid||'')!==(uid||''))return 'โทเคนไม่ตรงบัญชี';
 const age=now-Number(p.t||0);if(age<VOTE_VIEW_MS)return 'ดูสวนให้ครบ 10 วินาทีก่อนโหวตนะ';if(age>VOTE_TOKEN_MAX)return 'เปิดดูสวนนานเกินไป กดดูสวนใหม่อีกครั้ง';return null;}
export const devOk=d=>typeof d==='string'&&/^[A-Za-z0-9_-]{16,48}$/.test(d);
