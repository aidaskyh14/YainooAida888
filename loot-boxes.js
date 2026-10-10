import {BOXES,BOX_QUANTITIES,getBoxCount} from './loot-box-catalog.js?v=ss3-recovery6';
import {CATALOG} from './catalog.js?v=ss3-fix12';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n).toLocaleString('th-TH');
const itemFor=box=>CATALOG.find(c=>c.k===box.key)||{n:'กล่องสุ่ม',i:box.image};
const byKey=k=>CATALOG.find(c=>c.k===k);
const IMG='images/';
// Backdrop tint per box: [light centre, glow, deep edge].
const TINT={dog:['#fff1ec','#f4877b','#6e1f2b'],cat:['#f6efff','#a98be8','#352561'],hamster:['#f7fcff','#9fd6f5','#2e5579'],alpaca:['#fff7fb','#e3c8f2','#5f6c9c'],
 ostrich:['#fff3ec','#f7a284','#6f2e24'],dodo:['#effffb','#5fcab8','#164d4f'],plant:['#f3ffec','#8fd477','#24502a'],fruit:['#fff2f7','#f6a0c4','#6d2449']};
const ANIMAL_GROUPS=['สัตว์','แมว','แฮมสเตอร์'];
const isAnimal=c=>!!c&&ANIMAL_GROUPS.includes(c.g)&&/^(dog|cat|hamster|al|bird)-/.test(c.k)&&!/^bird-box-/.test(c.k);
const birdOf=c=>/^bird-(ostrich|dodo)$/.exec(c?.k||'')?.[1]||null;
const FRAME_MS=1000/12,HOLD_MS=600,PRELOAD_MS=8000;
const sheets=new Map();
// Resolves {url,w,h} once the 4x4 opening sheet is decoded, or null after PRELOAD_MS / on error.
function loadSheet(box){
 if(sheets.has(box.id))return sheets.get(box.id);
 const p=new Promise(resolve=>{
  const img=new Image();let done=false;const finish=v=>{if(done)return;done=true;clearTimeout(timer);if(!v)sheets.delete(box.id);resolve(v);};
  const timer=setTimeout(()=>finish(null),PRELOAD_MS);
  img.onload=()=>finish(img.naturalWidth>=4&&img.naturalHeight>=4?{url:img.src,w:img.naturalWidth,h:img.naturalHeight}:null);
  img.onerror=()=>finish(null);img.src=IMG+box.animation;
 });
 sheets.set(box.id,p);return p;
}
// Plays the 16 frames at ~12 fps, frame size taken from the real sheet, then holds the last frame.
function playSheet(el,sheet){
 return new Promise(resolve=>{
  const fw=sheet.w/4,fh=sheet.h/4;el.style.aspectRatio=fw+' / '+fh;el.style.backgroundImage='url("'+sheet.url+'")';el.style.backgroundRepeat='no-repeat';
  let f=0;const draw=()=>{const w=el.clientWidth||300,h=el.clientHeight||w*fh/fw;el.style.backgroundSize=(w*4)+'px '+(h*4)+'px';el.style.backgroundPosition=(-(f%4)*w)+'px '+(-Math.floor(f/4)*h)+'px';};
  draw();const timer=setInterval(()=>{if(f>=15){clearInterval(timer);setTimeout(resolve,HOLD_MS);return;}f++;draw();},FRAME_MS);
 });
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function sparkles(n){let h='';for(let i=0;i<n;i++){const x=(i*37+11)%100,y=(i*53+7)%100,d=(i%5)*.7,s=4+(i%3)*3;h+='<i style="left:'+x+'%;top:'+y+'%;width:'+s+'px;height:'+s+'px;animation-delay:-'+d+'s;animation-duration:'+(2.6+(i%4)*.6)+'s"></i>';}return '<div class="lbsparkles" aria-hidden="true">'+h+'</div>';}
const CSS=`
#lootBoxes{position:fixed;inset:0;z-index:5000;display:flex;align-items:center;justify-content:center;padding:16px;color:#5e4638;font:16px sans-serif;
 --t0:#fff7f0;--t1:#f3c9a0;--t2:#5a3a2a;background:radial-gradient(circle at 50% 42%,var(--t0) 0%,var(--t1) 38%,var(--t2) 100%);transition:background .4s;animation:lbIn .25s ease-out}
#lootBoxes *{box-sizing:border-box}
#lootBoxes .lbsparkles{position:absolute;inset:0;pointer-events:none;overflow:hidden}
#lootBoxes .lbsparkles i{position:absolute;border-radius:50%;background:#fff;box-shadow:0 0 8px 2px #fff8;opacity:0;animation:lbTwinkle 3s ease-in-out infinite}
#lootBoxes .lbpanel{position:relative;width:100%;max-width:620px;max-height:92dvh;overflow:auto;background:#fffaf3ee;border:3px solid #ffffffcc;border-radius:28px;padding:18px;text-align:center;box-shadow:0 14px 40px #0003}
#lootBoxes .lbpanel.bare{background:transparent;border-color:transparent;box-shadow:none;overflow:visible}
#lootBoxes h2{margin:.2em 0 .4em;font-size:1.3em}#lootBoxes h3{margin:.5em 0 .2em}
#lootBoxes button{font:inherit;border:2px solid #e8dacb;border-radius:16px;padding:12px;background:#fff;color:#5e4638;cursor:pointer}#lootBoxes button:disabled{opacity:.45;cursor:default}
#lootBoxes .lbgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}#lootBoxes .lbchoice{padding:6px;font-size:12px}#lootBoxes .lbchoice img{width:60px;height:60px;object-fit:contain;display:block;margin:auto}#lootBoxes .lbchoice.active{background:#fff0ce;border-color:#d9af51}
#lootBoxes .lbhero{width:115px;height:115px;object-fit:contain;animation:lbFloat 2.4s ease-in-out infinite}
#lootBoxes .lbquantities{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}#lootBoxes .lbquantities button{background:#65c6a6;color:#fff;border-color:#65c6a6;min-width:65px;font-weight:bold}
#lootBoxes .lbnote{font-size:13px;color:#7a6253;line-height:1.5}
#lootBoxes .lbclose{position:absolute;right:12px;top:12px;padding:4px 12px;z-index:2}
#lootBoxes .lbstage{display:flex;flex-direction:column;align-items:center;gap:10px;color:#fff;text-shadow:0 2px 8px #0006}
#lootBoxes .lbstage .lbtitle{font-weight:bold;font-size:1.2em}
#lootBoxes .lbclosed{width:min(62vw,280px);aspect-ratio:1;object-fit:contain;filter:drop-shadow(0 10px 18px #0004)}
#lootBoxes .lbshake{animation:lbShake 1.1s ease-in-out infinite}
#lootBoxes .lbsprite{width:min(72vw,320px);aspect-ratio:1;filter:drop-shadow(0 10px 18px #0004);transition:opacity .35s,transform .35s}
#lootBoxes .lbfade{opacity:0;transform:scale(1.08)}
#lootBoxes .lbreveal{animation:lbPop .45s cubic-bezier(.2,1.4,.4,1)}
#lootBoxes .lbbig{margin:6px auto 10px;width:min(70vw,260px);padding:14px;border-radius:24px;background:linear-gradient(#fff,#fff6e4);border:3px solid #f6d58b;box-shadow:0 0 0 6px #fff6,0 0 40px #ffe08a;position:relative;isolation:isolate}
#lootBoxes .lbbig .lbic{width:100%;aspect-ratio:1;object-fit:contain;display:block}
#lootBoxes .lbbig b{display:block;font-size:1.1em;margin-top:6px}#lootBoxes .lbbig span{display:block;color:#9a7029;font-weight:bold;font-size:1.2em}
#lootBoxes .lbbig.animal{border-color:#ffcf4a;background:radial-gradient(circle at 50% 35%,#fffbe8,#ffe8a8)}
#lootBoxes .lbbig.animal{animation:lbGlow 1.4s ease-in-out infinite alternate}
#lootBoxes .lbemoji{font-size:84px;line-height:1.3;display:block}
#lootBoxes .lbbird{width:100%;aspect-ratio:1;background-repeat:no-repeat;background-size:400% 400%;background-position:0 0;display:flex;align-items:center;justify-content:center}
#lootBoxes .lbbig .lbemoji{font-size:110px}#lootBoxes .lbbig .lbic.lbemoji{display:flex;align-items:center;justify-content:center}#lootBoxes .lbbird .lbemoji{line-height:1}#lootBoxes .lbaward .lbemoji{font-size:44px;line-height:64px}
#lootBoxes .lbbird.scroll{background-size:contain;background-position:center}
#lootBoxes .lbanimals{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:8px 0 12px}
#lootBoxes .lbanimals .lbaward{width:118px;border-color:#ffcf4a;background:radial-gradient(circle at 50% 35%,#fffbe8,#ffe7a3);box-shadow:0 0 18px #ffd86a}
#lootBoxes .lbresult{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:10px 0}
#lootBoxes .lbaward{border:2px solid #eee1cf;border-radius:18px;padding:8px;background:#fff;overflow-wrap:anywhere;animation:lbPop .4s both}
#lootBoxes .lbaward .lbic,#lootBoxes .lbaward .lbbird{width:64px;height:64px;object-fit:contain;max-width:100%;display:block;margin:auto}#lootBoxes .lbaward .lbbird{display:flex}
#lootBoxes .lbaward b{display:block;font-size:12px;line-height:1.3}#lootBoxes .lbaward span{display:block;font-weight:bold;color:#9a7029;margin-top:3px}
#lootBoxes .lbchips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}#lootBoxes .lbchip{background:#fff0cc;border-radius:999px;padding:6px 12px;font-weight:bold;font-size:14px}
#lootBoxes .lbsec{font-weight:bold;margin:10px 0 2px;font-size:14px}
#lootBoxes .lbactions{display:flex;justify-content:center;gap:10px;margin-top:14px}#lootBoxes .lbprimary{background:#65c6a6;color:#fff;border-color:#65c6a6}
#lootBoxes .lberror{color:#a73546;background:#ffe9ed;padding:12px;border-radius:12px}
@keyframes lbIn{from{opacity:0}to{opacity:1}}
@keyframes lbTwinkle{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:.9;transform:scale(1)}}
@keyframes lbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes lbShake{0%,55%,100%{transform:rotate(0)}62%{transform:rotate(-4deg) translateY(-2px)}70%{transform:rotate(4deg)}78%{transform:rotate(-3deg)}86%{transform:rotate(2deg)}93%{transform:rotate(-1deg)}}
@keyframes lbPop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
@keyframes lbGlow{from{box-shadow:0 0 0 6px #fff6,0 0 22px #ffd54a}to{box-shadow:0 0 0 8px #fff9,0 0 52px #ffc93a}}
@media(max-width:400px){#lootBoxes{padding:8px}#lootBoxes .lbpanel{padding:12px}#lootBoxes .lbchoice{font-size:10px}#lootBoxes .lbchoice img{width:48px;height:48px}#lootBoxes .lbresult{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(prefers-reduced-motion:reduce){#lootBoxes .lbshake,#lootBoxes .lbhero,#lootBoxes .lbsparkles i,#lootBoxes .lbbig.animal{animation:none}}
`;
// Replace broken images with an emoji so a missing file never shows a broken icon.
function guardImages(scope){
 scope.querySelectorAll('img').forEach(img=>{if(img.dataset.guard)return;img.dataset.guard='1';img.addEventListener('error',()=>{const s=document.createElement('span');s.className=(img.className||'')+' lbemoji';s.style.fontSize=Math.max(28,Math.min(84,img.clientWidth*.7||48))+'px';s.textContent=img.dataset.fb||'🎁';img.replaceWith(s);},{once:true});});
 scope.querySelectorAll('[data-bird]').forEach(el=>{if(el.dataset.guard)return;el.dataset.guard='1';const probe=new Image();probe.onload=()=>{};probe.onerror=()=>{const scroll=new Image();scroll.onload=()=>{el.classList.add('scroll');el.style.backgroundImage='url("'+IMG+el.dataset.scroll+'")';};scroll.onerror=()=>{el.style.backgroundImage='none';el.innerHTML='<span class="lbemoji">'+(el.dataset.bird==='dodo'?'🦤':'🐦')+'</span>';};scroll.src=IMG+el.dataset.scroll;};probe.src=IMG+'birds-'+el.dataset.bird+'-idle.webp';});
}
function iconHTML(c,fallback){
 const bird=birdOf(c);
 if(bird)return '<div class="lbbird lbic" data-bird="'+bird+'" data-scroll="'+escape(c.i)+'" style="background-image:url(&quot;'+IMG+'birds-'+bird+'-idle.webp&quot;)" role="img" aria-label="'+escape(c.n)+'"></div>';
 return '<img class="lbic" src="'+IMG+escape(c?.i||'')+'" alt="" data-fb="'+(fallback||'🎁')+'">';
}
const nameOf=c=>birdOf(c)?'นก'+c.n.replace(/^นก/,''):c.n;
let overlay=null,initializing=false;
export async function showLootBoxes(kind,host){
 if(overlay||initializing)return;
 initializing=true;
 try{await host.commit();}finally{initializing=false;}
 let selected=BOXES.find(b=>b.id===kind)||BOXES[0],busy=false,opened=false;
 const root=document.createElement('div');overlay=root;root.id='lootBoxes';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','กล่องสุ่ม');
 root.innerHTML='<style>'+CSS+'</style>'+sparkles(22)+'<div class="lbpanel" tabindex="-1"></div>';
 document.body.append(root);const panel=root.querySelector('.lbpanel');panel.focus();
 const tint=()=>{const t=TINT[selected.id]||TINT.dog;root.style.setProperty('--t0',t[0]);root.style.setProperty('--t1',t[1]);root.style.setProperty('--t2',t[2]);};
 const close=()=>{if(busy)return;root.remove();overlay=null;document.removeEventListener('keydown',onKey);if(opened)host.refresh();};
 const onKey=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',onKey);
 const show=(html,bare)=>{panel.classList.toggle('bare',!!bare);panel.innerHTML=html;guardImages(panel);panel.scrollTop=0;};
 const choice=message=>{
  tint();loadSheet(selected);
  const game=host.game(),count=getBoxCount(game,selected),name=itemFor(selected).n;
  show('<button class="lbclose" aria-label="ปิด">×</button><h2>🎁 กล่องสุ่ม</h2><div class="lbgrid">'+BOXES.map(b=>'<button class="lbchoice '+(b.id===selected.id?'active':'')+'" data-box="'+b.id+'"><img src="'+IMG+b.image+'" alt=""><b>'+escape(itemFor(b).n)+'</b><br>'+fmt(getBoxCount(game,b))+' กล่อง</button>').join('')+'</div><h3>'+escape(name)+'</h3><img class="lbhero" src="'+IMG+selected.image+'" alt=""><p>มีอยู่ <b>'+fmt(count)+'</b> กล่อง</p>'+(message?'<p class="lberror">'+escape(message)+'</p>':'')+'<div class="lbquantities">'+BOX_QUANTITIES.map(q=>'<button data-open="'+q+'" '+(count<q?'disabled':'')+'>เปิด '+fmt(q)+'</button>').join('')+'</div><p class="lbnote">เปิดหลายกล่อง = แอนิเมชันรอบเดียว แล้วสรุปของทั้งหมด<br>กล่องรับได้จากไปรษณีย์ที่ยัยหนูส่งให้</p><details><summary>ดูโอกาสสุ่ม</summary>'+selected.rows.map(r=>'<p class="lbnote">'+escape(describe(r,selected))+' — '+r.weight+'%</p>').join('')+'</details>');
  panel.querySelector('.lbclose').onclick=close;
  panel.querySelectorAll('[data-box]').forEach(b=>b.onclick=()=>{selected=BOXES.find(x=>x.id===b.dataset.box);choice();});
  panel.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>open(Number(b.dataset.open)));
 };
 const actions='<div class="lbactions"><button data-again>เปิดต่อ</button><button data-done class="lbprimary">รับเข้ากระเป๋า ✓</button></div>';
 const bindActions=()=>{panel.querySelector('[data-again]').onclick=()=>choice();panel.querySelector('[data-done]').onclick=close;};
 const reveal=r=>{
  const rows=(r.items||[]).map(({key,quantity})=>({c:byKey(key)||{k:key,n:key,i:''},quantity}));
  const animals=rows.filter(x=>isAnimal(x.c)),others=rows.filter(x=>!isAnimal(x.c));
  const box=escape(itemFor(selected).n);
  if(r.quantity===1){
   let card;
   if(animals.length){const a=animals[0];card='<h2>🎉 ได้'+(birdOf(a.c)?'นก':'สัตว์')+'ตัวใหม่!</h2><div class="lbbig animal lbreveal">'+iconHTML(a.c,'🐾')+'<b>'+escape(nameOf(a.c))+'</b></div>';}
   else if(others.length===1){const o=others[0];card='<h2>ได้รับ</h2><div class="lbbig lbreveal">'+iconHTML(o.c)+'<b>'+escape(o.c.n)+'</b><span>×'+fmt(o.quantity)+'</span></div>';}
   else if(others.length){card='<h2>ได้รับ</h2><div class="lbresult lbreveal">'+others.map((o,i)=>award(o,i)).join('')+'</div>';}
   else if(r.merit){card='<h2>ได้รับ</h2><div class="lbbig lbreveal"><span class="lbemoji">🙏</span><b>กุศล</b><span>+'+fmt(r.merit)+'</span></div>';}
   else card='<h2>กล่องเกลือ</h2><div class="lbbig lbreveal"><span class="lbemoji">🧂</span><b>ครั้งนี้ไม่ได้ไอเทม</b><span>ลองใหม่นะ</span></div>';
   const extra=(animals.length||others.length)&&r.merit?'<div class="lbchips"><span class="lbchip">🙏 กุศล +'+fmt(r.merit)+'</span></div>':'';
   show('<p class="lbnote">'+box+'</p>'+card+extra+'<p class="lbnote">ของเข้ากระเป๋าและบันทึกแล้ว ✓</p>'+actions);
  }else{
   const chips=(r.merit?'<span class="lbchip">🙏 กุศล +'+fmt(r.merit)+'</span>':'')+(r.salt?'<span class="lbchip">🧂 กล่องเกลือ '+fmt(r.salt)+'</span>':'');
   show('<h2>🎁 เปิด '+fmt(r.quantity)+' กล่อง</h2><p class="lbnote">'+box+'</p>'+
    (animals.length?'<div class="lbsec">✨ สัตว์ที่ได้</div><div class="lbanimals">'+animals.map((a,i)=>award(a,i,true)).join('')+'</div>':'')+
    (chips?'<div class="lbchips">'+chips+'</div>':'')+
    (others.length?'<div class="lbsec">ของที่ได้</div><div class="lbresult">'+others.map((o,i)=>award(o,i+animals.length)).join('')+'</div>':'')+
    (!animals.length&&!others.length&&!r.merit?'<p class="lbnote">ได้กล่องเกลือทั้งหมด ไม่ได้ไอเทม</p>':'')+
    '<p class="lbnote">หักกล่องแล้ว • ของและกุศลเข้ากระเป๋าและบันทึกแล้ว ✓</p>'+actions);
  }
  bindActions();
 };
 const open=async quantity=>{
  if(busy)return;busy=true;opened=true;
  show('<div class="lbstage"><div class="lbtitle">🎁 '+escape(itemFor(selected).n)+'</div><img class="lbclosed lbshake" src="'+IMG+selected.image+'" alt="" data-fb="🎁"><div class="lbnote" style="color:#fff">กำลังเปิดกล่อง…</div></div>',true);
  try{
   const preload=loadSheet(selected),r=await host.open({type:'open',box:selected.id,quantity});
   const sheet=await preload;
   if(sheet){
    show('<div class="lbstage"><div class="lbtitle">🎁 '+escape(itemFor(selected).n)+(quantity>1?' ×'+fmt(quantity):'')+'</div><div class="lbsprite"></div></div>',true);
    const sprite=panel.querySelector('.lbsprite');await playSheet(sprite,sheet);sprite.classList.add('lbfade');await wait(350);
   }
   busy=false;reveal(r);
  }catch(e){
   busy=false;
   if(['functions/unavailable','functions/deadline-exceeded','functions/internal','functions/unknown'].includes(e.code)){
    // Keep the scene frozen until the pending cloud receipt is recovered.
    show('<h2>ยังยืนยันผลไม่ได้</h2><p class="lberror">'+escape(e.message||'การเชื่อมต่อขัดข้อง')+'</p><p class="lbnote">คำขอเปิด '+fmt(quantity)+' กล่องอาจบันทึกแล้ว กดตรวจผลเดิมเพื่อรับผลครั้งเดิม</p><button class="lbprimary" data-retry>ตรวจผลเดิม</button>');
    panel.querySelector('[data-retry]').onclick=()=>open(quantity);
   }else choice(e.message||'ยังยืนยันรางวัลไม่ได้ กรุณาลองอีกครั้ง');
  }
 };
 choice();
}
function award({c,quantity},i,animal){
 return '<div class="lbaward" style="animation-delay:'+Math.min(i,20)*40+'ms">'+iconHTML(c,animal?'🐾':'🎁')+'<b>'+escape(nameOf(c))+'</b><span>×'+fmt(quantity)+'</span></div>';
}
function describe(r,b){
 if(r.type==='animal')return itemFor(b).n.replace('กล่องสุ่ม','')+(['ostrich','dodo'].includes(b.id)?' (ตัวนก)':' (สุ่มแบบ/สี)');
 if(r.type==='salt')return 'กล่องเกลือ ไม่ได้อะไร';
 if(r.type==='merit')return 'กุศล '+r.value.join('–');
 if(r.type==='item')return (byKey(r.value[0])?.n||r.value[0])+' ×'+r.value[1];
 if(r.type==='medicine')return 'ยาน้ำผึ้งมะนาว '+r.value.join('–');
 return ({grass:'หญ้าครบ 5 สี สีละ '+r.value,food:'อาหารบ้าน/สวน สุ่ม '+r.value+' ชิ้น',drink:'เครื่องดื่มป่า 1 ขวด',rod:'เบ็ดสุ่มแบบ 1 อัน',flower:'ดอกไม้สุ่มชนิด 10 ชิ้น',plants:'ผัก 2–5 ชนิด ชนิดละ 10–150 (ส่วนใหญ่ 30–50)'}[r.type]);
}
