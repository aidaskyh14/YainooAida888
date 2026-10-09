import {BOXES,BOX_QUANTITIES,getBoxCount} from './loot-box-catalog.js?v=ss3-recovery6';
import {CATALOG} from './catalog.js?v=ss3-recovery6';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n).toLocaleString('th-TH');
const itemFor=box=>CATALOG.find(c=>c.k===box.key);
const spriteReady=box=>new Promise(resolve=>{
 const img=new Image(),timer=setTimeout(()=>resolve(null),3000);
 img.onload=()=>{clearTimeout(timer);resolve({width:img.naturalWidth,height:img.naturalHeight});};
 img.onerror=()=>{clearTimeout(timer);resolve(null);};img.src='images/'+box.animation;
});
let overlay=null,initializing=false;
export async function showLootBoxes(kind,host){
 if(overlay||initializing)return;
 initializing=true;
 try{await host.commit();}finally{initializing=false;}
 let selected=BOXES.find(b=>b.id===kind)||BOXES[0],busy=false;
 const root=document.createElement('div');overlay=root;root.id='lootBoxes';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','กล่องสุ่ม');
 root.innerHTML=`<style>
 #lootBoxes{position:fixed;inset:0;z-index:5000;background:#302622b8;display:flex;align-items:center;justify-content:center;padding:16px;color:#624a3c;font:16px sans-serif}
 #lootBoxes *{box-sizing:border-box}#lootBoxes .lbpanel{width:100%;max-width:620px;max-height:90dvh;overflow:auto;background:#fffaf1;border:4px solid #f3dfce;border-radius:28px;padding:20px;text-align:center;box-shadow:0 12px 40px #0004}
 #lootBoxes button{font:inherit;border:2px solid #e8dacb;border-radius:16px;padding:12px;background:#fff;color:#624a3c;cursor:pointer}#lootBoxes button:disabled{opacity:.45;cursor:default}#lootBoxes .lbgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}#lootBoxes .lbchoice{padding:6px;font-size:12px}#lootBoxes .lbchoice img{width:60px;height:60px;object-fit:contain;display:block;margin:auto}#lootBoxes .lbchoice.active{background:#fff0ce;border-color:#d9af51}
 #lootBoxes .lbhero{width:115px;height:115px;object-fit:contain}#lootBoxes .lbquantities{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}#lootBoxes .lbquantities button{background:#65c6a6;color:#fff;border-color:#65c6a6;min-width:65px;font-weight:bold}#lootBoxes .lbnote{font-size:13px;color:#806858;line-height:1.5}#lootBoxes .lbresult{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:16px 0}#lootBoxes .lbaward{border:2px solid #eee1cf;border-radius:18px;padding:10px;overflow-wrap:anywhere}#lootBoxes .lbaward img{width:85px;height:85px;object-fit:contain;max-width:100%;display:block;margin:auto}#lootBoxes .lbaward b{display:block;font-size:13px}#lootBoxes .lbaward span{display:block;font-weight:bold;color:#9a7029;margin-top:6px}#lootBoxes .lbsprite{width:min(65vw,300px);aspect-ratio:1;background-size:400% 400%;margin:auto}#lootBoxes .lbclose{float:right;padding:5px 12px}#lootBoxes .lbsummary{background:#fff0cc;padding:16px;border-radius:18px;font-weight:bold;line-height:1.7}#lootBoxes .lbactions{display:flex;justify-content:center;gap:10px;margin-top:16px}#lootBoxes .lbprimary{background:#65c6a6;color:white;border-color:#65c6a6}#lootBoxes .lberror{color:#a73546;background:#ffe9ed;padding:12px;border-radius:12px}
 @media(max-width:400px){#lootBoxes{padding:8px}#lootBoxes .lbpanel{padding:12px}#lootBoxes .lbgrid{grid-template-columns:repeat(4,minmax(0,1fr))}#lootBoxes .lbchoice{font-size:10px}#lootBoxes .lbchoice img{width:48px;height:48px}#lootBoxes .lbresult{grid-template-columns:repeat(2,minmax(0,1fr))}}
 </style><div class="lbpanel" tabindex="-1"></div>`;
 document.body.append(root);const panel=root.querySelector('.lbpanel');panel.focus();
 const close=()=>{if(busy)return;root.remove();overlay=null;};
 const choice=message=>{
  const game=host.game(),count=getBoxCount(game,selected),name=itemFor(selected).n;
  panel.innerHTML='<button class="lbclose" aria-label="ปิด">×</button><h2>🎁 กล่องสุ่ม</h2><div class="lbgrid">'+BOXES.map(b=>'<button class="lbchoice '+(b.id===selected.id?'active':'')+'" data-box="'+b.id+'"><img src="images/'+b.image+'" alt=""><b>'+escape(itemFor(b).n)+'</b><br>'+fmt(getBoxCount(game,b))+' กล่อง</button>').join('')+'</div><h3>'+escape(name)+'</h3><img class="lbhero" src="images/'+selected.image+'" alt=""><p>มีอยู่ <b>'+fmt(count)+'</b> กล่อง</p>'+(message?'<p class="lberror">'+escape(message)+'</p>':'')+'<div class="lbquantities">'+BOX_QUANTITIES.map(q=>'<button data-open="'+q+'" '+(count<q?'disabled':'')+'>เปิด '+fmt(q)+'</button>').join('')+'</div><p class="lbnote">เลือกจำนวนกล่องที่จะเปิด • เล่นแอนิเมชันหนึ่งรอบ แล้วแสดงของทั้งหมด<br>กล่องรับได้จากไปรษณีย์ที่ยัยหนูส่งให้</p><details><summary>ดูโอกาสสุ่ม</summary>'+selected.rows.map(r=>'<p class="lbnote">'+escape(describe(r,selected))+' — '+r.weight+'%</p>').join('')+'</details>';
  panel.querySelector('.lbclose').onclick=close;
  panel.querySelectorAll('[data-box]').forEach(b=>b.onclick=()=>{selected=BOXES.find(x=>x.id===b.dataset.box);choice();});
  panel.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(Number(b.dataset.open)));
 };
 const receipt=r=>{
  panel.innerHTML='<h2>🎁 เปิด '+fmt(r.quantity)+' กล่อง</h2><p>'+escape(itemFor(selected).n)+'</p><div class="lbsummary">'+(r.merit?'🙏 กุศล +'+fmt(r.merit)+'<br>':'')+'🧂 กล่องเกลือ '+fmt(r.salt)+' กล่อง'+(r.salt?' (ไม่ได้ไอเทม)':'')+'</div><div class="lbresult">'+r.items.map(({key,quantity})=>{const c=CATALOG.find(x=>x.k===key);return '<div class="lbaward"><img src="images/'+c.i+'" alt=""><b>'+escape(c.n)+'</b><span>×'+fmt(quantity)+'</span></div>';}).join('')+'</div><p class="lbnote">หักกล่องแล้ว • ของและกุศลเข้ากระเป๋าและบันทึกแล้ว ✓</p><div class="lbactions"><button data-again>เปิดต่อ</button><button data-done class="lbprimary">รับเข้ากระเป๋า ✓</button></div>';
  panel.querySelector('[data-again]').onclick=()=>choice();panel.querySelector('[data-done]').onclick=close;
 };
 const open=async quantity=>{
  if(busy)return;busy=true;panel.innerHTML='<h2>กำลังเปิดกล่อง…</h2><img class="lbhero" src="images/'+selected.image+'" alt=""><p class="lbnote">กำลังยืนยันและบันทึกรางวัล</p>';
  try{
   const preload=spriteReady(selected),r=await host.open({type:'open',box:selected.id,quantity});host.refresh();
   const sheet=await preload;if(!sheet){busy=false;receipt(r);return;}
   panel.innerHTML='<h2>🎁 '+escape(itemFor(selected).n)+'</h2><div class="lbsprite"></div><p class="lbnote">เปิด '+fmt(quantity)+' กล่อง</p>';
   const sprite=panel.querySelector('.lbsprite');sprite.style.backgroundImage='url("images/'+selected.animation+'")';sprite.style.aspectRatio=sheet.width+'/'+sheet.height;
   await new Promise(resolve=>{let f=0;const timer=setInterval(()=>{sprite.style.backgroundPosition=(f%4)*100/3+'% '+Math.floor(f/4)*100/3+'%';if(++f===16){clearInterval(timer);resolve();}},100);});
   busy=false;receipt(r);
  }catch(e){
   busy=false;
   if(['functions/unavailable','functions/deadline-exceeded','functions/internal','functions/unknown'].includes(e.code)){
    // Keep the old iframe stopped until the pending cloud receipt is recovered.
    panel.innerHTML='<h2>ยังยืนยันผลไม่ได้</h2><p class="lberror">'+escape(e.message||'การเชื่อมต่อขัดข้อง')+'</p><p class="lbnote">คำขอเปิด '+fmt(quantity)+' กล่องอาจบันทึกแล้ว กดตรวจผลเดิมเพื่อรับผลครั้งเดิม</p><button class="lbprimary" data-retry>ตรวจผลเดิม</button>';
    panel.querySelector('[data-retry]').onclick=()=>open(quantity);
   }else{host.refresh();choice(e.message||'ยังยืนยันรางวัลไม่ได้ กรุณาลองอีกครั้ง');}
  }
 };
 choice();
}
function describe(r,b){
 if(r.type==='animal')return itemFor(b).n.replace('กล่องสุ่ม','')+' (สุ่มแบบ/สี)';
 if(r.type==='salt')return 'กล่องเกลือ ไม่ได้อะไร';
 if(r.type==='merit')return 'กุศล '+r.value.join('–');
 if(r.type==='item')return CATALOG.find(c=>c.k===r.value[0]).n+' ×'+r.value[1];
 if(r.type==='medicine')return 'ยาน้ำผึ้งมะนาว '+r.value.join('–');
 return ({grass:'หญ้าครบ 5 สี สีละ '+r.value,food:'อาหารบ้าน/สวน สุ่ม '+r.value+' ชิ้น',drink:'เครื่องดื่มป่า 1 ขวด',rod:'เบ็ดสุ่มแบบ 1 อัน',flower:'ดอกไม้สุ่มชนิด 10 ชิ้น',plants:'ผัก 2–5 ชนิด ชนิดละ 10–150 (ส่วนใหญ่ 30–50)'}[r.type]);
}
