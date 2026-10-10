(()=>{
 const host=parent.__HOST;if(!host?.watchLures)return;
 const LIFE=48*60*60*1000,CAP=10;
 // 48 h expiry uses the server-synced clock, not the raw device clock.
 const clock=()=>{try{return typeof host.serverNow==='function'?host.serverNow():Date.now();}catch(e){return Date.now();}};
 host.watchLures(state=>{
  const now=clock(),all=(state?.birds||[]).filter(b=>b&&b.id),rows=all.filter(b=>now-b.born<LIFE);
  // lureSeen remembers admissions already placed, so a bird the player sold is not put back.
  let changed=false;
  if(!Array.isArray(S.lureSeen)){S.lureSeen=S.pens[1].filter(b=>b&&String(b.id).startsWith('lure-')).map(b=>b.id);if(S.lureSeen.length)changed=true;}
  const active=S.pens[1].filter(b=>now-b.born<LIFE),have=new Set(active.map(b=>b.id));
  if(active.length!==S.pens[1].length)changed=true;S.pens[1]=active;
  let added=0;
  for(const bird of rows){
   if(have.has(bird.id)||S.lureSeen.includes(bird.id))continue;
   if(S.pens[1].length>=CAP)break;
   S.pens[1].push({...bird});S.lureSeen.push(bird.id);have.add(bird.id);changed=true;added++;
  }
  const ids=new Set(all.map(b=>b.id)),kept=S.lureSeen.filter(id=>ids.has(id)||have.has(id));
  if(kept.length!==S.lureSeen.length){S.lureSeen=kept;changed=true;}
  if(changed){save();draw();}
  if(added)ann('📜 คำขอได้รับอนุมัติแล้ว นกเข้าคอก 1 • อายุ 48 ชั่วโมง');
 });
})();
