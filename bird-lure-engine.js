export const BIRD_LIFE=48*60*60*1000,BIRD_CAPACITY=10,LURE_SPECIES=['ostrich','dodo'],LURE_ROUTE='pen1-v2';
export const SPECIES_NAME={ostrich:'นกกระจอกเทศ',dodo:'นกโดโด้'};
// Same scroll recipe as scr-birds.html SCROLL (Thai names mapped through app.js MATS to game.bag paths).
export const SCROLL_RECIPES={ostrich:{'hedge.quills':100,'product.cheese':50},dodo:{'product.scale':150,'hedge.tail':100}};
export const SCROLL_MAT_NAMES={'hedge.quills':'ขนเม่น','product.cheese':'ชีส','product.scale':'เกล็ดปลาจันทร์','hedge.tail':'หางเม่น'};
const live=(b,now)=>b&&LURE_SPECIES.includes(b.sp)&&Number.isFinite(b.born)&&now-b.born<BIRD_LIFE;
/* seen = ids the bird scene already placed in pen 1. An admitted bird that was seen but is no longer in the
   saved pen was sold/released by the player and must not be counted (or re-added) again. */
export function lurePen(saved=[],admissions=[],now=Date.now(),seen=null){
 const savedRows=(Array.isArray(saved)?saved:[]).filter(b=>live(b,now)),savedIds=new Set(savedRows.map(b=>b.id));
 const gone=id=>Array.isArray(seen)&&seen.includes(id)&&!savedIds.has(id);
 const map=new Map(savedRows.map(b=>[b.id,{...b}]));
 for(const bird of (Array.isArray(admissions)?admissions:[]).filter(b=>live(b,now)&&!gone(b.id)))map.set(bird.id,{...bird,cd:map.get(bird.id)?.cd||0});
 return [...map.values()];
}
export const lureId=request=>'lure-'+request;
/* Decide an approval: duplicate (already admitted), full (pen 1 has 10 live birds) or admit (returns next admissions). */
export function lureOutcome(saved,admissions,request,now,seen=null){
 const pen=lurePen(saved,admissions,now,seen),id=lureId(request.id);
 if(pen.some(b=>b.id===id)||(admissions||[]).some(b=>b?.id===id&&live(b,now)))return {kind:'duplicate',next:admissions||[],penCount:pen.length};
 if(pen.length>=BIRD_CAPACITY)return {kind:'full',next:admissions||[],penCount:pen.length};
 const next=[...(admissions||[]).filter(b=>b&&now-b.born<BIRD_LIFE),{id,sp:request.sp,born:now,cd:0,lureRequest:request.id}];
 return {kind:'admit',next,penCount:pen.length+1};
}
export function approveLure(saved,admissions,request,now,seen=null){
 const out=lureOutcome(saved,admissions,request,now,seen);
 if(out.kind==='full')throw new Error('คอกคัมภีร์ (คอก 1) เต็ม 10 ตัวแล้ว รอให้นกหมดอายุก่อน');
 return out.next;
}
/* Deduct the scroll materials from a joined game (server action). Throws without changing anything when short. */
export function deductScroll(game,sp){
 const recipe=SCROLL_RECIPES[sp];if(!recipe)throw new Error('ชนิดนกไม่ถูกต้อง');
 const have=p=>{const [g,k]=p.split('.');const n=Number(game.bag?.[g]?.[k]);return Number.isFinite(n)?n:0;};
 const missing=Object.entries(recipe).filter(([p,q])=>have(p)<q).map(([p,q])=>SCROLL_MAT_NAMES[p]+' '+have(p)+'/'+q);
 if(missing.length)throw new Error('วัตถุดิบไม่พอ: '+missing.join(' • '));
 for(const [p,q] of Object.entries(recipe)){const [g,k]=p.split('.');game.bag[g][k]=have(p)-q;}
 return recipe;
}
const millis=v=>typeof v?.toMillis==='function'?v.toMillis():Number(v?._seconds)*1000||Number(v)||0;
/* The old flow mailed stored birds (catalog key bird-<sp>), sometimes from the generic admin gift screen.
   Preference: a single-bird mail linked to the request → a single-bird lure-titled mail → any single-bird mail without
   merit/coins (oldest first). Otherwise a mail that holds the bird among other things (only the bird is taken out). */
export function oldLureMail(mails,request){
 const key='bird-'+request.sp;
 const birds=m=>Number(m.data?.items?.[key])||0;
 const only=m=>{const d=m.data||{},items=d.items||{},keys=Object.keys(items).filter(k=>Number(items[k])>0);return keys.length===1&&keys[0]===key&&birds(m)===1&&!(Number(d.kusal)>0)&&!(Number(d.coins)>0);};
 const linked=m=>m.id.includes(request.id)||[m.data?.request,m.data?.lureRequest,m.data?.req].includes(request.id);
 const lureText=m=>/ล่อนก|คัมภีร์/.test(String(m.data?.title||'')+' '+String(m.data?.msg||''));
 const oldest=list=>list.sort((a,b)=>millis(a.data.createdAt)-millis(b.data.createdAt))[0];
 const all=(mails||[]).filter(m=>m&&typeof m.id==='string'&&birds(m)>=1),pool=all.filter(only);
 // Conservative: only mails tied to the request or worded as a lure reward. Gifts and other rewards are never touched.
 const whole=pool.find(linked)||oldest(pool.filter(lureText));
 if(whole)return {...whole,take:'delete'};
 const part=all.find(linked)||oldest(all.filter(lureText));
 return part?{...part,take:'one'}:null;
}
/* Repair plan for a request approved by the old (mail → storage) flow. Never touches merit or other items.
   mail: delete the unclaimed bird mail (or take just the bird out of it) and admit · vault: take ONE stored bird of the species · skip: nothing to move. */
export function planRepair({request,mails=[],vault={},saved=[],admissions=[],now,seen=null}){
 if(request.status!=='ok'||request.route===LURE_ROUTE)return {kind:'done'};
 const out=lureOutcome(saved,admissions,request,now,seen);
 if(out.kind==='duplicate')return {kind:'admitted',next:out.next,penCount:out.penCount};
 if(out.kind==='full')return {kind:'skip',reason:'full'};
 const mail=oldLureMail(mails,request);
 if(mail)return {kind:'mail',mailId:mail.id,take:mail.take,mailItems:mail.data?.items||{},next:out.next,penCount:out.penCount};
 return {kind:'skip',reason:'nobird'};
}
