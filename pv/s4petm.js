/* ซีซัน 4: ส่งท่าทางสัตว์จากหน้าเดิม (ซีซัน 3) ไปให้สวน 3D ทุก 0.12 วิ — โยนบอล ขุดสมบัติ กินข้าว อาบน้ำ ลังแมว ของตกพื้น เห็นในฉาก 3D จริง
   + ให้อาหารทั้งคอกในครั้งเดียว (กติกาเดิม: ตัวละ 1 ชาม เฉพาะตัวที่หิว) + เรียกมารวมจุดที่แตะ */
(()=>{const K=/catpen/.test(location.pathname)?'cat':'dog';
 const list=()=>{try{return K==='dog'?(typeof penDogs==='function'?penDogs():S.dog.list):S.cat.list;}catch(e){return [];}};
 const post=m=>{try{const f=window.__s4f;if(f&&f.contentWindow)f.contentWindow.postMessage(m,'*');}catch(e){}};
 try{const _fx=fx;fx=function(x,y,t){post({s4fx:[x/W,y/H,String(t)]});return _fx.apply(this,arguments);};}catch(e){}
 const pct=v=>parseFloat(v)/100;
 setInterval(()=>{try{const A=[];for(const c of list()){const a=actors[c.id];if(!a)continue;A.push([c.id,a.x/W,a.y/H,a.pose||'idle',a.flip?1:0,a.inbox?1:0,c.type||'']);}
  const st=document.getElementById('stage');const bl=st&&st.querySelector('img.ball');const ball=bl?[pct(bl.style.left),pct(bl.style.top)]:null;
  const mounds=st?[...st.querySelectorAll('img.mound')].map(e=>[pct(e.style.left),pct(e.style.top),+(e.style.opacity||1)]):[];
  const box=K==='cat'&&S.cat.cboxAt?[S.cat.cboxAt[0]/W,S.cat.cboxAt[1]/H]:null;
  const dl=K==='dog'?S.dog.drops.filter(d=>(d.pen||0)===(S.dog.cur||0)):S.cat.drops;
  const drops=dl.slice(0,30).map(d=>{let u='';try{u=typeof dImg==='function'?(K==='dog'?dImg(d):dImg(d.k)):'';}catch(e){}return [d.x/W,d.y/H,u];});
  post({s4m:{k:K,a:A,ball,mounds,box,drops}});}catch(e){}},120);
 /* 🔔 เรียกมารวมที่จุดที่แตะ (จุดในสวน 3D แปลงกลับเป็นพิกัดหน้าเดิม) */
 window.__s4gather=id=>{const [nx,ny]=String(id||'').split(',').map(Number);if(!(nx>=0))return;const x=nx*W,y=ny*H;let n=0;
  for(const c of list()){const a=actors[c.id];if(!a||a.busy||a.inbox)continue;const ox=(n%3-1)*55,oy=Math.floor(n/3)*40;n++;
   if(typeof goTo==='function')goTo(a,x+ox,y+oy,'sit',{speed:30});else{a.mode='walk';a.tx=x+ox;a.ty=y+oy;a.next='sit';}}
  try{parent.toast(n?'🔔 เรียก '+n+' ตัวมารวมแล้ว':'ไม่มีตัวที่ว่างตอนนี้');}catch(e){}};
 /* 🍽️ ให้อาหารทั้งคอก: เลือกอาหาร 1 ชนิด → ให้ทุกตัวที่หิว ตัวละ 1 ชาม (หักของ/ได้กุศลตามกติกาเดิมทีละตัว) */
 window.s4FeedAll=()=>{try{closeAll();}catch(e){}const L=list().filter(c=>{try{return hungry(c);}catch(e){return false;}});const BAG=K==='dog'?S.bag.dogfood:S.bag.catfood;
  const nm=K==='dog'?'น้องหมา':'น้องแมว';
  open('<h3>🍽️ ให้อาหาร'+nm+'ทั้งคอก</h3><div class="hint">หิวอยู่ '+L.length+' ตัว • ตัวละ 1 ชาม</div><div class="grid">'+FOOD.map(f=>{const have=BAG[f.id]||0;return '<div class="cell" data-ff="'+f.id+'" style="'+(have&&L.length?'':'opacity:.45')+'"><img src="'+IMG['food-'+f.id]+'" alt=""><b>'+f.n+'</b><span>มี '+have+'</span></div>';}).join('')+'</div>');
  document.querySelectorAll('[data-ff]').forEach(el=>el.onclick=()=>{if(el.dataset.s4once)return;el.dataset.s4once='1';const fid=el.dataset.ff;let n=0;for(const c of L){if(!((BAG[fid]||0)>0))break;try{feed(c,fid);n++;}catch(e){}}
   try{closeAll();}catch(e){}try{parent.toast(n?'🍽️ ให้อาหาร '+n+' ตัวแล้ว':'อาหารไม่พอ หรือยังไม่มีตัวที่หิว');}catch(e){}});};
})();
