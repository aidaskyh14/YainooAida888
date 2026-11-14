/* ซีซั่น 4 · ระบบตัวละคร (สุ่มตัวละคร · ใส่ชุด · ศัลยกรรม · ขายชุดซ้ำ) — กติกาอยู่ที่นี่ที่เดียว ใช้ทั้งหลังบ้านและทดสอบ
   เก็บใน game.sub.char = {tribe, wear, rolledAt, by} · ชุดอยู่ใน game.bag.outfit[id] (จำนวน · ซ้ำได้)
   กติกา (บรีฟข้อ 3.2 3.5 3.11): สุ่มครั้งเดียวตลอดชีพ 25% เท่ากัน · ได้ชุดเริ่มต้น 1 ชุด · เปลี่ยนตัวละครได้ด้วยบัตรศัลยกรรมเท่านั้น
   ศัลยกรรม: ชุดเดิมทุกชุด (รวมที่ใส่อยู่) ขายคืนอัตโนมัติ 20% ของราคาคลาส · คลาสยัยหนูส่งเท่านั้นคืน 2,000,000/ชุด · ได้ชุดเริ่มต้นของตัวละครใหม่ */
import {OUTFITS,TRIBES,TRIBE_IDS,CLASS,SURGERY_REFUND} from './outfit-catalog.js?h=e8d9e6ca';
const fail=m=>{throw new Error(m);};
export const charOf=game=>{const c=game.sub?.char;return c&&TRIBES[c.tribe]?c:null;};
export const charView=(game,ctx)=>{const c=charOf(game);const bag=game.bag?.outfit||{};
 return {tribe:c?c.tribe:null,wear:c?c.wear:null,rolledAt:c?c.rolledAt||0:0,outfits:Object.fromEntries(Object.entries(bag).filter(([k,n])=>OUTFITS[k]&&n>0)),surgery:Number(game.bag?.item?.surgery)||0,admin:!!ctx.admin};};
function give(game,id,n=1){game.bag ||= {};game.bag.outfit ||= {};game.bag.outfit[id]=(Number(game.bag.outfit[id])||0)+n;}
export function charAction(game,ctx,input,rng=Math.random){
 game.sub ||= {};const type=input.type;
 /* แอดมิน: ไม่ต้องสุ่ม เป็นชมพูอัตโนมัติ (มีทุกชุด + ชุดราชินี) */if(ctx.admin&&!charOf(game)&&type!=='roll')charAction(game,ctx,{type:'roll'},rng);
 if(type==='status'&&!(charOf(game)&&charOf(game).cleanup))return {view:charView(game,ctx)};
 if(type==='roll'){
  if(charOf(game))return {view:charView(game,ctx),already:true};/* กดซ้ำ/รีเฟรช/2 เครื่อง = ผลเดิม */
  let tribe;if(ctx.admin){tribe='pink';}else{const i=Math.min(3,Math.floor(rng()*4));tribe=TRIBE_IDS[i];}
  const start=TRIBES[tribe].start;game.sub.char={tribe,wear:start,rolledAt:ctx.now,by:ctx.admin?'admin':'roll'};give(game,start,1);
  if(ctx.admin){for(const o of Object.values(OUTFITS))if(o.tribe==='pink')give(game,o.id,1);}/* แอดมินมีทุกชุดของตัวละครตัวเอง รวมชุดราชินี */
  return {view:charView(game,ctx),rolled:tribe};}
 const c=charOf(game);if(!c)fail('ยังไม่ได้สุ่มตัวละคร');
 /* แอดมินกำหนดตัวละครให้: ชุดของตัวละครเดิมคืนเงินตอนผู้เล่นเรียกระบบครั้งแรก */if(c.cleanup){const from=c.cleanup;delete c.cleanup;const bag=game.bag?.outfit||{};let refund=0;for(const [id,n] of Object.entries(bag)){const o=OUTFITS[id];if(!o||!(n>0)||o.tribe===c.tribe)continue;refund+=(SURGERY_REFUND[o.cls]||0)*n;delete bag[id];}game.merit=(game.merit||0)+refund;if(!(Number(bag[c.wear])>0))give(game,c.wear,1);}
 if(type==='status')return {view:charView(game,ctx)};
 if(type==='wear'){const id=String(input.id||'');const o=OUTFITS[id];if(!o)fail('ไม่มีชุดนี้');if(o.tribe!==c.tribe)fail('ชุดนี้เป็นของตัวละครอื่น');
  const have=Number(game.bag?.outfit?.[id])||0;if(have<1&&!(ctx.admin&&(o.cls==='q'||o.tribe===c.tribe)))fail('ยังไม่มีชุดนี้ในตู้');
  if(ctx.admin&&have<1)give(game,id,1);c.wear=id;c.wearAt=ctx.now;return {view:charView(game,ctx)};}
 if(type==='sell'){const id=String(input.id||''),n=Math.max(1,Math.min(999,Number(input.n)||1));const o=OUTFITS[id];if(!o)fail('ไม่มีชุดนี้');
  if(ctx.admin)fail('บัญชีแอดมินไม่ขายชุด');const price=CLASS[o.cls].sell;if(!price)fail('ชุดนี้ขายไม่ได้');
  const have=Number(game.bag?.outfit?.[id])||0;const keep=c.wear===id?1:0;if(have-keep<n)fail(keep?'ชุดที่ใส่อยู่ต้องเหลือ 1 ชุด ขายได้เฉพาะชุดซ้ำ':'ชุดซ้ำไม่พอ');
  game.bag.outfit[id]=have-n;game.merit=(game.merit||0)+price*n;return {view:charView(game,ctx),sold:{id,n,merit:price*n}};}
 if(type==='surgery'){if(ctx.admin)fail('บัญชีแอดมินเปลี่ยนตัวละครได้จากศูนย์แอดมิน');const to=String(input.tribe||'');if(!TRIBES[to])fail('เลือกตัวละคร');if(to===c.tribe)fail('เป็นตัวละครนี้อยู่แล้ว');
  const cards=Number(game.bag?.item?.surgery)||0;if(cards<1)fail('ไม่มีบัตรศัลยกรรม · ได้จากยัยหนูเท่านั้น');
  game.bag.item.surgery=cards-1;const bag=game.bag.outfit||{};let refund=0;const sold=[];
  for(const [id,n] of Object.entries(bag)){const o=OUTFITS[id];if(!o||!(n>0))continue;if(o.tribe!==c.tribe)continue;const r=(SURGERY_REFUND[o.cls]||0)*n;refund+=r;sold.push([id,n,r]);delete bag[id];}
  game.merit=(game.merit||0)+refund;const start=TRIBES[to].start;give(game,start,1);
  game.sub.char={tribe:to,wear:start,rolledAt:c.rolledAt||ctx.now,by:'surgery',from:c.tribe,surgeryAt:ctx.now,n:(c.n||0)+1};
  return {view:charView(game,ctx),surgery:{from:c.tribe,to,refund,sold}};}
 fail('รายการไม่ถูกต้อง');
}
/* แอดมินกำหนดตัวละครให้ผู้เล่นรายคน (ศูนย์แอดมิน 3.10) · ชุดเดิมคืนเหมือนศัลยกรรม แต่ไม่ใช้บัตร */
export function charAdminSet(game,ctx,tribe){if(!TRIBES[tribe])fail('ไม่มีตัวละครนี้');const c=charOf(game);game.sub ||= {};
 if(c&&c.tribe===tribe)return {view:charView(game,ctx)};
 if(c){const bag=game.bag?.outfit||{};let refund=0;for(const [id,n] of Object.entries(bag)){const o=OUTFITS[id];if(!o||!(n>0)||o.tribe!==c.tribe)continue;refund+=(SURGERY_REFUND[o.cls]||0)*n;delete bag[id];}game.merit=(game.merit||0)+refund;}
 const start=TRIBES[tribe].start;give(game,start,1);game.sub.char={tribe,wear:start,rolledAt:c?c.rolledAt:ctx.now,by:'admin',adminAt:ctx.now};return {view:charView(game,ctx)};}
