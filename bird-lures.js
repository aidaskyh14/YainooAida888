(()=>{
 const host=parent.__HOST;if(!host?.watchLures)return;
 host.watchLures(state=>{
  const now=Date.now(),active=S.pens[1].filter(b=>now-b.born<48*60*60*1000),old=new Map(active.map(b=>[b.id,b]));
  const rows=(state?.birds||[]).filter(b=>now-b.born<48*60*60*1000);
  let changed=active.length!==S.pens[1].length;S.pens[1]=active;
  for(const bird of rows){const existing=old.get(bird.id);if(!existing){S.pens[1].push({...bird});changed=true;}}
  if(changed){save();draw();ann('📜 คำขอได้รับอนุมัติแล้ว นกเข้าคอก 1 • อายุ 48 ชั่วโมง');}
 });
})();
