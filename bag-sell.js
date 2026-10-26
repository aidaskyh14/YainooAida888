/* fix20: ขายของจากกระเป๋า — 🐾 สัตว์ทีละหลายตัว (+ของแถม) · 🍷 ไวน์ (80% ของราคาตลาดสวน)
   ราคาจริงคิดที่เซิร์ฟเวอร์ทุกครั้ง หน้านี้แค่แสดง */
import {PET_SELL,PET_BONUS,PET_BONUS_EVERY,PET_BONUS_DAY,PET_BONUS_MIN,PET_BONUS_MAX,petHave} from './pet-sell-engine.js';
const H=parent.__HOST,W=window;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nf=n=>Math.round(Number(n)||0).toLocaleString('en-US');
const BN=Object.fromEntries(PET_BONUS);
const cat=path=>{try{return H.catalogItem(path)||null;}catch(e){return null;}};
const petInfo=P=>{const c=cat(P[1]);return {k:P[0],path:P[1],each:P[2],name:c?.n?.replace(/\s*\(.*\)$/,'')||P[0],img:c?.i?'images/'+c.i:'',rare:P[2]>=20000};};
const SPR=/birds-(ostrich|dodo)-idle\.webp$/;
const pic=(src,cls)=>!src?'<div style="font-size:1.8rem">🐾</div>':SPR.test(src)?'<div class="spr '+(cls||'')+'" style="background-image:url(\''+esc(src)+'\')"></div>':'<img src="'+esc(src)+'" alt="">';
const pets=()=>PET_SELL.map(P=>({...petInfo(P),have:petHave(S,P[1])})).filter(p=>p.have>0);
let busy=false,quote=null,quoteAt=0;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function call(input){for(let i=0;;i++){try{return await H.cloud('market',input);}catch(e){if(i<4&&/รายการก่อนหน้า/.test(e?.message||'')){await sleep(1200);continue;}throw e;}}}
const refresh=()=>{const from=Number(pts)||0;try{Object.assign(S,JSON.parse(H.get('s3all-v1')));pts=S.merit;}catch(e){}
 try{const el=$('ptsv'),to=Number(pts)||0,t0=performance.now();if(el&&to!==from){(function step(t){const k=Math.min(1,(t-t0)/600);el.textContent=fmt(Math.round(from+(to-from)*k));if(k<1)requestAnimationFrame(step);})(t0);const p=$('pts');p.classList.remove('up','dn');void p.offsetWidth;p.classList.add(to>from?'up':'dn');}}catch(e){}try{render();}catch(e){}try{renderBag();}catch(e){}};
async function getQuote(force){if(!force&&quote&&Date.now()-quoteAt<60000)return quote;const out=await call({type:'bag-quote'});quote={wine:out.wineQuote||{},left:Number(out.petBonusLeft)||0};quoteAt=Date.now();return quote;}

/* ---------- หน้าตา ---------- */
const css=document.createElement('style');css.textContent=`
#bsell{position:fixed;inset:0;z-index:11;background:rgba(40,25,15,.45);display:none;align-items:flex-end;justify-content:center}
#bsell.on{display:flex}
#bsell .bx{background:#FFF8EE;width:100%;max-width:480px;max-height:88vh;overflow:auto;border-radius:1.3rem 1.3rem 0 0;padding:1rem 1rem calc(1rem + env(safe-area-inset-bottom,0px));box-sizing:border-box;color:#5B3B2A}
#bsell h4{margin:.1rem 0 .5rem;font-size:1.05rem;display:flex;gap:.6rem;align-items:center}
#bsell h4 img{width:3.2rem;height:3.2rem;object-fit:contain;background:#fff;border-radius:.8rem;border:2px solid #F3E9DE}
#bsell .row{display:flex;justify-content:space-between;font-size:.85rem;padding:.25rem 0;border-bottom:1px dashed #EBD9C4}
#bsell .row b{color:#B9761F}
#bsell .chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:.7rem 0 .4rem}
#bsell .chips button{flex:1 1 4.2rem;padding:.55rem .3rem;border-radius:.8rem;border:2px solid #EBD9C4;background:#fff;font-weight:700;color:#7A5034;font-size:.85rem}
#bsell .chips button.on{background:#F6B43C;border-color:#E09A1E;color:#fff}
#bsell .chips button:disabled{opacity:.35}
#bsell input{width:100%;box-sizing:border-box;padding:.6rem;border-radius:.8rem;border:2px solid #EBD9C4;font-size:1rem;text-align:center;font-weight:700;color:#5B3B2A}
#bsell .tot{margin:.7rem 0;padding:.7rem;border-radius:1rem;background:#fff;text-align:center;font-size:.9rem}
#bsell .tot b{display:block;font-size:1.35rem;color:#2E8B57}
#bsell .note{font-size:.75rem;color:#8A6A55;line-height:1.45;margin:.3rem 0}
#bsell .bb{display:flex;gap:.5rem;margin-top:.6rem}
#bsell .bb button{flex:1;padding:.75rem;border-radius:1rem;border:0;font-weight:800;font-size:.95rem}
#bsell .bb .no{background:#EFE3D5;color:#7A5034}#bsell .bb .go{background:#2E8B57;color:#fff}#bsell .bb .go:disabled{opacity:.5}
#bsell .gift{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center;margin:.5rem 0}
#bsell .gift span{background:#fff;border:2px solid #F3E9DE;border-radius:.8rem;padding:.35rem .6rem;font-size:.82rem;font-weight:700}
.bagsellbar{grid-column:1/-1;display:flex;gap:.4rem;align-items:center;justify-content:space-between;background:#FFF1DC;border-radius:.9rem;padding:.45rem .6rem;font-size:.72rem;color:#7A5034}
.bagsellbar button{border:0;border-radius:.7rem;background:#2E8B57;color:#fff;font-weight:800;padding:.45rem .6rem;font-size:.75rem;white-space:nowrap}
.spr{width:100%;aspect-ratio:1;background-size:400% 400%;background-position:0 0;background-repeat:no-repeat}#bsell h4 .spr.h{width:3.2rem;height:3.2rem;flex:none;background-color:#fff;border-radius:.8rem;border:2px solid #F3E9DE}
.it.sell{position:relative}.it.sell::after{content:'💰';position:absolute;top:.15rem;right:.25rem;font-size:.8rem}
.it.sell em{display:block;font-style:normal;font-size:.62rem;color:#2E8B57;font-weight:700}
`;document.head.appendChild(css);
const box=document.createElement('div');box.id='bsell';box.innerHTML='<div class="bx"></div>';document.body.appendChild(box);
const bx=box.querySelector('.bx');box.onclick=e=>{if(e.target===box&&!busy)close();};
const close=()=>{box.classList.remove('on');};
const show=html=>{bx.innerHTML=html;box.classList.add('on');};

/* ---------- แผนก 🐾 ขายสัตว์ ในกระเป๋า ---------- */
const oldTabs=bagTabsAll;bagTabsAll=function(){const t=oldTabs();if(pets().length)t.pets='🐾 ขายสัตว์';return t;};
const oldRender=renderBag;renderBag=function(){
 if(bagTab!=='pets'){oldRender();markSell();return;}
 if(!pets().length){bagTab='crop';oldRender();markSell();return;}
 oldRender();/* วาดแท็บ (แผนกนี้ไม่มีใน S.bag จึงขึ้นว่าง แล้ววาดทับ) */
 const list=pets(),sum=list.reduce((a,p)=>a+p.have*p.each,0),n=list.reduce((a,p)=>a+p.have,0);
 $('bagGrid').innerHTML='<div class="bagsellbar"><span>🐾 แตะตัวที่จะขาย · มีทั้งหมด '+nf(n)+' ตัว ≈ '+nf(sum)+' กุศล</span><button id="bsAll">💰 ขายทุกตัว</button></div>'+
  list.map(p=>'<div class="it sell" data-pk="'+esc(p.k)+'">'+pic(p.img)+'<b>'+esc(p.name)+(p.rare?' ✨':'')+'</b><span>×'+nf(p.have)+'</span><em>'+nf(p.each)+'/ตัว</em></div>').join('');
 $('bsAll').onclick=e=>{e.stopPropagation();sellAllSheet();};};
/* ไวน์/แมว/แฮมสเตอร์ในแผนกเดิม ก็แตะขายได้ */
function markSell(){if(!['wine','cat','hamster'].includes(bagTab))return;for(const el of $('bagGrid').querySelectorAll('.it[data-k]')){if(bagTab==='wine'||PET_SELL.some(P=>P[1]==='bag.'+bagTab+'.'+el.dataset.k))el.classList.add('sell');}}
$('bagGrid').addEventListener('click',e=>{const it=e.target.closest('.it.sell');if(!it)return;e.stopImmediatePropagation();
 if(it.dataset.pk)return petSheet(it.dataset.pk);
 if(it.dataset.g==='wine')return wineSheet(it.dataset.k);
 const P=PET_SELL.find(P=>P[1]==='bag.'+it.dataset.g+'.'+it.dataset.k);if(P)petSheet(P[0]);},true);

/* ---------- แผ่นขาย (ใช้ร่วมกันทั้งสัตว์และไวน์) ---------- */
function qtySheet({title,img,have,each,eachNote,extra,onSell}){
 let q=Math.min(have,1);const chips=[1,10,100,1000];
 show('<h4>'+(img?pic(img,'h'):'')+'<span>'+title+'</span></h4>'+
  '<div class="row"><span>มีในกระเป๋า</span><b>'+nf(have)+'</b></div><div class="row"><span>ราคาขาย</span><b>'+(each==null?'กำลังดูราคา…':nf(each)+' กุศล/ชิ้น')+'</b></div>'+(eachNote?'<div class="note">'+eachNote+'</div>':'')+
  '<div class="chips">'+chips.map(c=>'<button data-q="'+c+'"'+(c>have?' disabled':'')+'>'+nf(c)+'</button>').join('')+'<button data-q="all">ทั้งหมด</button></div>'+
  '<input id="bsQ" type="number" inputmode="numeric" min="1" max="'+have+'" value="'+q+'">'+
  '<div class="tot">ได้รับ<b id="bsT">-</b><div id="bsX" class="note"></div></div>'+(extra||'')+
  '<div class="bb"><button class="no" id="bsNo">ยกเลิก</button><button class="go" id="bsGo">💰 ขาย</button></div>');
 const inp=$('bsQ'),upd=()=>{q=Math.max(0,Math.min(have,Math.floor(Number(inp.value)||0)));for(const b of bx.querySelectorAll('.chips button'))b.classList.toggle('on',b.dataset.q==='all'?q===have:Number(b.dataset.q)===q);
  $('bsT').textContent=each==null?'-':'+'+nf(q*each)+' กุศล';$('bsGo').disabled=!q||each==null;if(onSell.preview)$('bsX').textContent=onSell.preview(q);};
 bx.querySelector('.chips').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;inp.value=b.dataset.q==='all'?have:b.dataset.q;upd();};
 inp.oninput=upd;$('bsNo').onclick=close;upd();
 $('bsGo').onclick=async()=>{if(busy||!q)return;busy=true;$('bsGo').disabled=true;$('bsGo').textContent='⏳ กำลังขาย…';
  try{await onSell(q===have?'all':q);}catch(e){toast(e?.message||'ขายไม่สำเร็จ',1);$('bsGo').disabled=false;$('bsGo').textContent='💰 ขาย';}finally{busy=false;}};
 return {setEach(v,note){each=v;const r=bx.querySelectorAll('.row b')[1];if(r)r.textContent=nf(v)+' กุศล/ชิ้น';if(note!=null){const n=bx.querySelector('.note');if(n)n.innerHTML=note;}upd();}};
}
const bonusNote=left=>left>0?'🎁 ขายครบทุก '+PET_BONUS_EVERY+' ตัว ได้ของแถมสุ่ม 1 อย่าง '+PET_BONUS_MIN+'–'+PET_BONUS_MAX+' ชิ้น ('+PET_BONUS.map(b=>b[1]).join(' / ')+') · วันนี้ยังนับของแถมได้อีก '+nf(left)+' ตัว':'🎁 วันนี้รับของแถมครบแล้ว (ขายต่อได้ตามปกติ ได้แค่กุศล) · พรุ่งนี้นับใหม่';
function doneSheet(head,total,bonus,more){
 const g=Object.entries(bonus||{}).filter(([,q])=>q>0);
 show('<h4><span>'+head+'</span></h4><div class="tot">ได้รับ<b>+'+nf(total)+' กุศล</b></div>'+(g.length?'<div class="note" style="text-align:center">🎁 ของแถมเข้ากระเป๋าแล้ว</div><div class="gift">'+g.map(([k,q])=>'<span>'+esc(BN[k]||k)+' ×'+nf(q)+'</span>').join('')+'</div>':'')+(more?'<div class="note" style="text-align:center">'+more+'</div>':'')+'<div class="bb"><button class="go" id="bsOk">เยี่ยมเลย</button></div>');
 $('bsOk').onclick=close;}
function petSheet(k){const P=PET_SELL.find(P=>P[0]===k);if(!P)return;const p=petInfo(P),have=petHave(S,P[1]);if(!have)return toast('ไม่มีตัวนี้แล้ว',1);
 let left=null;const sell=async q=>{const out=await call({type:'pet-sell',items:[{k,q}]});refresh();const r=out.petSold;if(quote)quote.left=r.bonusLeft;
  doneSheet('🐾 ขาย'+esc(p.name)+' '+nf(r.count)+' ตัว',r.total,r.bonus,r.bonusLeft>0?'อีก '+nf(r.toNext)+' ตัว ได้ของแถมชิ้นถัดไป':'วันนี้รับของแถมครบแล้ว');};
 sell.preview=q=>{if(left==null)return '';if(left<=0)return 'วันนี้ของแถมครบแล้ว';const n0=PET_BONUS_DAY-left,r=Math.floor((n0+Math.min(q,left))/PET_BONUS_EVERY)-Math.floor(n0/PET_BONUS_EVERY);return r?'+ ของแถม '+r+' ครั้ง ('+PET_BONUS_MIN+'–'+PET_BONUS_MAX+' ชิ้น/ครั้ง)':'อีก '+nf(PET_BONUS_EVERY-n0%PET_BONUS_EVERY-q)+' ตัว ได้ของแถม';};
 const sh=qtySheet({title:'ขาย'+esc(p.name)+(p.rare?' ✨':''),img:p.img,have,each:p.each,eachNote:quote?bonusNote(quote.left):'🎁 กำลังดูของแถมวันนี้…',onSell:sell});
 getQuote().then(qq=>{left=qq.left;sh.setEach(p.each,bonusNote(left));}).catch(()=>{});}
function sellAllSheet(){const list=pets();if(!list.length)return;const n=list.reduce((a,p)=>a+p.have,0),sum=list.reduce((a,p)=>a+p.have*p.each,0);
 if(n>100000)return toast('สัตว์เยอะมาก ขายทีละชนิดนะ',1);
 show('<h4><span>💰 ขายสัตว์ทุกตัวในกระเป๋า</span></h4>'+list.map(p=>'<div class="row"><span>'+esc(p.name)+' ×'+nf(p.have)+'</span><b>'+nf(p.have*p.each)+'</b></div>').join('')+
  '<div class="tot">รวมได้รับ<b>+'+nf(sum)+' กุศล</b>'+nf(n)+' ตัว</div><div class="note">'+bonusNote(quote?quote.left:PET_BONUS_DAY)+'</div><div class="note">⚠️ ขายแล้วเอาคืนไม่ได้ · สัตว์ที่เลี้ยงอยู่ในคอก/บ้านไม่ถูกขาย (ขายเฉพาะในกระเป๋า)</div>'+
  '<div class="bb"><button class="no" id="bsNo">ยกเลิก</button><button class="go" id="bsGo">ยืนยันขายทั้งหมด</button></div>');
 $('bsNo').onclick=close;$('bsGo').onclick=async()=>{if(busy)return;busy=true;$('bsGo').disabled=true;$('bsGo').textContent='⏳ กำลังขาย…';
  try{const out=await call({type:'pet-sell',items:list.map(p=>({k:p.k,q:'all'}))});refresh();const r=out.petSold;if(quote)quote.left=r.bonusLeft;doneSheet('🐾 ขายสัตว์ '+nf(r.count)+' ตัว',r.total,r.bonus);}
  catch(e){toast(e?.message||'ขายไม่สำเร็จ',1);$('bsGo').disabled=false;$('bsGo').textContent='ยืนยันขายทั้งหมด';}finally{busy=false;}};}
function wineSheet(k){const have=Math.max(0,Math.floor(Number(S.bag?.wine?.[k])||0));if(!have)return toast('ไม่มีไวน์นี้แล้ว',1);
 const sell=async q=>{const out=await call({type:'wine-bag',wine:k,qty:q});refresh();const r=out.wineSold;quote=null;doneSheet('🍷 ขาย'+esc(bagName('wine',k))+' '+nf(r.qty)+' ขวด',r.total);};
 const sh=qtySheet({title:'ขาย'+esc(bagName('wine',k)),img:bagImg('wine',k),have,each:null,eachNote:'ราคา 80% ของตลาดสวน (ขึ้นลงตามหุ้นไวน์) · ขายได้ทีละหลายขวด',onSell:sell});
 getQuote(true).then(qq=>{const v=qq.wine[k];if(v)sh.setEach(v);else toast('ดูราคาไวน์นี้ไม่ได้',1);}).catch(e=>toast(e?.message||'ดูราคาไม่ได้',1));}
W.bagSellReady=true;
