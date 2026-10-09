export const BIRD_LIFE=48*60*60*1000,BIRD_CAPACITY=10;
export function lurePen(saved=[],admissions=[],now=Date.now()){
 const live=b=>b&&['ostrich','dodo'].includes(b.sp)&&Number.isFinite(b.born)&&now-b.born<BIRD_LIFE;
 const map=new Map(saved.filter(live).map(b=>[b.id,{...b}]));
 for(const bird of admissions.filter(live))map.set(bird.id,{...bird,cd:map.get(bird.id)?.cd||0});
 return [...map.values()];
}
export function approveLure(saved,admissions,request,now){
 const pen=lurePen(saved,admissions,now),id='lure-'+request.id;
 if(pen.some(b=>b.id===id))return admissions;
 if(pen.length>=BIRD_CAPACITY)throw new Error('คอกคัมภีร์ (คอก 1) เต็ม 10 ตัวแล้ว รอให้นกหมดอายุก่อน');
 return [...admissions.filter(b=>now-b.born<BIRD_LIFE),{id,sp:request.sp,born:now,cd:0,lureRequest:request.id}];
}
