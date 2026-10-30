/* fix24 💰 ขายของได้ทุกอย่างในกระเป๋า — อย่างละหลายชิ้น หลายอย่างในรอบเดียว (ตะกร้าขาย) + ประเมินราคาโดยรวม
   (ต่อจาก fix20: ขายสัตว์ทีละหลายตัว + ของแถม · ไวน์ 80% ของตลาดสวน)
   ราคาจริงคิดที่เซิร์ฟเวอร์ทุกครั้ง หน้านี้แค่แสดง · ราคาอยู่ใน sell-price.js */
import {ALPACA_MENU} from './alpaca-menu.js?v=ss3-fix22';
import {PET_BONUS,PET_BONUS_EVERY,PET_BONUS_DAY,PET_BONUS_MIN,PET_BONUS_MAX} from './pet-sell-engine.js';
import {SELL_ROWS,SELL_BY_KEY,sellHave} from './sell-price.js?v=ss3-fix24';
const H=parent.__HOST,W=window;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nf=n=>Math.round(Number(n)||0).toLocaleString('en-US');
const BN=Object.fromEntries(PET_BONUS),BIMG={angel:'wings',pestle:'pestle',cake:'cake',coconut:'coconut'};
const SPR=/birds-(ostrich|dodo)-idle\.webp$/;
const pic=(src,cls)=>!src?'<div class="noimg">✨</div>':SPR.test(src)?'<div class="spr '+(cls||'')+'" style="background-image:url(\''+esc(src)+'\')"></div>':'<img src="'+esc(src)+'" alt="">';
const ROWMAX=300,sleep=ms=>new Promise(r=>setTimeout(r,ms));
let busy=false,quote=null,quoteAt=0,sellMode=false;const cart=new Map();
async function call(input){for(let i=0;;i++){try{return await H.cloud('market',input);}catch(e){if(i<4&&/รายการก่อนหน้า/.test(e?.message||'')){await sleep(1200);continue;}throw e;}}}
const refresh=()=>{const from=Number(pts)||0;try{Object.assign(S,JSON.parse(H.get('s3all-v1')));pts=S.merit;}catch(e){}
 try{const el=$('ptsv'),to=Number(pts)||0,t0=performance.now();if(el&&to!==from){(function step(t){const k=Math.min(1,(t-t0)/600);el.textContent=fmt(Math.round(from+(to-from)*k));if(k<1)requestAnimationFrame(step);})(t0);const p=$('pts');p.classList.remove('up','dn');void p.offsetWidth;p.classList.add(to>from?'up':'dn');}}catch(e){}
 for(const [k,q] of cart){const r=SELL_BY_KEY.get(k),h=r?haveOf(r):0;if(!h)cart.delete(k);else if(q>h)cart.set(k,h);}try{render();}catch(e){}try{renderBag();}catch(e){}};
async function getQuote(force){if(!force&&quote&&Date.now()-quoteAt<60000)return quote;const out=await call({type:'bag-quote'});quote={wine:out.wineQuote||{},hw:out.hwQuote||{},left:Number(out.petBonusLeft)||0};quoteAt=Date.now();return quote;}
const haveOf=r=>sellHave(S,r.path);
const priceOf=r=>r.kind==='wine'?(quote?.wine?.[r.w]??null):r.kind==='hw'?(quote?.hw?.[r.h]??null):r.price;
const imgOf=r=>{if(r.img)return r.img;const m=r.path.match(/^bag\.([^.]+)\.(.+)$/);try{return m?bagImg(m[1],m[2]):'';}catch(e){return '';}};
/* แต่ละแผนกขายอะไรบ้าง */
const isAlp=r=>r.g==='ของแปรรูป';
function rowsFor(tab){const all=SELL_ROWS.filter(r=>haveOf(r)>0);
 if(tab==='pets')return all.filter(r=>r.kind==='pet');if(tab==='alp')return all.filter(isAlp);
 if(tab==='subx')return all.filter(r=>r.kind!=='pet'&&!isAlp(r)&&r.path.startsWith('sub.'));
 return all.filter(r=>r.path.startsWith('bag.'+tab+'.'));}
const worth=list=>{let v=0,unk=0;for(const r of list){const p=priceOf(r);if(p==null)unk++;else v+=p*haveOf(r);}return {v,unk};};
const cartTotal=()=>{let v=0,n=0,unk=0;for(const [k,q] of cart){const r=SELL_BY_KEY.get(k),p=r&&priceOf(r);if(p==null)unk++;else v+=p*q;n++;}return {v,n,unk};};

/* ---------- หน้าตา ---------- */
const css=document.createElement('style');css.textContent=`
#bsell{position:fixed;inset:0;z-index:11;background:rgba(40,25,15,.45);display:none;align-items:flex-end;justify-content:center}
#bsell.on{display:flex}
#bsell .bx{position:relative;background:linear-gradient(#FFFDF8,#FFF6E8);width:100%;max-width:480px;max-height:88vh;overflow:auto;border-radius:1.4rem 1.4rem 0 0;padding:1rem 1rem calc(1rem + env(safe-area-inset-bottom,0px));box-sizing:border-box;color:#5B3B2A;box-shadow:0 -10px 30px rgba(90,50,20,.25)}
#bsell h4{margin:.1rem 2rem .6rem 0;font-size:1.05rem;display:flex;gap:.6rem;align-items:center}
#bsell h4 img,#bsell h4 .noimg{width:3.4rem;height:3.4rem;object-fit:contain;background:#fff;border-radius:1rem;border:2px solid #F3E2CC;flex:none;display:grid;place-items:center;font-size:1.6rem}
#bsell .xx{position:absolute;top:.7rem;right:.8rem;border:0;background:#F3E6D6;color:#7A5034;width:2rem;height:2rem;border-radius:50%;font-weight:800}
#bsell .row{display:flex;justify-content:space-between;align-items:center;font-size:.85rem;padding:.3rem 0;border-bottom:1px dashed #EBD9C4}
#bsell .row b{color:#B9761F}
#bsell .chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:.7rem 0 .45rem}
#bsell .chips button{flex:1 1 3.6rem;padding:.55rem .3rem;border-radius:.9rem;border:2px solid #EBD9C4;background:#fff;font-weight:800;color:#7A5034;font-size:.85rem}
#bsell .chips button.on{background:#F6B43C;border-color:#E09A1E;color:#fff;box-shadow:0 3px 0 #D88A12}
#bsell .chips button:disabled{opacity:.35}
#bsell input{width:100%;box-sizing:border-box;padding:.6rem;border-radius:.9rem;border:2px solid #EBD9C4;font-size:1.05rem;text-align:center;font-weight:800;color:#5B3B2A;background:#fff}
#bsell .tot{margin:.7rem 0;padding:.75rem;border-radius:1.1rem;background:#fff;text-align:center;font-size:.85rem;border:2px solid #E5F3E9}
#bsell .tot b{display:block;font-size:1.45rem;color:#2E8B57}
#bsell .note{font-size:.74rem;color:#8A6A55;line-height:1.45;margin:.3rem 0}
#bsell .bb{display:flex;gap:.5rem;margin-top:.6rem}
#bsell .bb button{flex:1;padding:.8rem .4rem;border-radius:1.1rem;border:0;font-weight:800;font-size:.92rem}
#bsell .bb .no{background:#EFE3D5;color:#7A5034}#bsell .bb .cart{background:#FFE7B8;color:#9A5B0C;border:2px solid #F3C66A}#bsell .bb .go{background:linear-gradient(#3FAE6E,#2E8B57);color:#fff;box-shadow:0 4px 0 #23704A}#bsell .bb button:disabled{opacity:.5}
#bsell .cl{display:flex;align-items:center;gap:.55rem;padding:.4rem .2rem;border-bottom:1px dashed #EBD9C4}
#bsell .cl img,#bsell .cl .noimg,#bsell .cl .spr{width:2.6rem;height:2.6rem;flex:none;object-fit:contain;background:#fff;border-radius:.7rem}
#bsell .cl div{flex:1;font-size:.8rem;line-height:1.3}#bsell .cl small{display:block;color:#9A7A68}
#bsell .cl b{color:#2E8B57;font-size:.85rem;white-space:nowrap}#bsell .cl button{border:0;background:#FCE3E3;color:#C0392B;border-radius:50%;width:1.7rem;height:1.7rem;font-weight:800}
#bsell .done{text-align:center}#bsell .done .dbig{font-size:3rem;animation:sxpop .6s cubic-bezier(.2,1.6,.4,1)}
#bsell .done .sum{font-size:1.9rem;font-weight:900;color:#2E8B57;text-shadow:0 2px 0 #fff,0 0 18px rgba(63,174,110,.35);animation:sxpop .6s .1s both cubic-bezier(.2,1.6,.4,1)}
#bsell .sold{display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem;margin:.7rem 0}
#bsell .sold div{background:#fff;border-radius:.9rem;border:2px solid #F3E9DE;padding:.3rem .2rem;font-size:.62rem;line-height:1.25;animation:sxin .4s both}
#bsell .sold img,#bsell .sold .noimg,#bsell .sold .spr{width:100%;aspect-ratio:1;object-fit:contain}#bsell .sold b{display:block;color:#2E8B57;font-size:.66rem}
#bsell .gift{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center;margin:.5rem 0}
#bsell .gift span{display:flex;align-items:center;gap:.3rem;background:#FFF4D6;border:2px solid #F6D58A;border-radius:1rem;padding:.25rem .6rem;font-size:.8rem;font-weight:800;color:#9A5B0C}#bsell .gift img{width:1.6rem;height:1.6rem;object-fit:contain}
@keyframes sxpop{from{transform:scale(.3);opacity:0}}@keyframes sxin{from{transform:translateY(8px);opacity:0}}
.sxcoin{position:fixed;z-index:12;font-size:1.6rem;pointer-events:none;animation:sxcoin 1.3s ease-in forwards}
@keyframes sxcoin{0%{transform:translate(0,0) scale(.6);opacity:0}15%{opacity:1}100%{transform:translate(var(--dx),-70vh) rotate(var(--r)) scale(1.1);opacity:0}}
.sxbar{grid-column:1/-1;display:flex;gap:.4rem;align-items:center;background:linear-gradient(90deg,#FFF1D0,#E9F8EE);border:2px solid #F3D58C;border-radius:1rem;padding:.45rem .55rem;font-size:.72rem;color:#7A5034}
.sxbar>div{flex:1;line-height:1.3}.sxbar b{font-size:.8rem;color:#5B3B2A}.sxbar small{display:block;color:#8A6A55}
.sxbar button{border:0;border-radius:.8rem;font-weight:800;padding:.45rem .55rem;font-size:.72rem;white-space:nowrap;background:#2E8B57;color:#fff}
.sxbar button.lt{background:#fff;color:#9A5B0C;border:2px solid #F3C66A}.sxbar button.x{background:#EFE3D5;color:#7A5034;padding:.45rem .6rem}
.it.sx{position:relative;cursor:pointer}.it.sx em{display:block;font-style:normal;font-size:.6rem;color:#2E8B57;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.it.sx.in{border-color:#F6B43C;background:#FFF8E6}.it.sx i.cq{position:absolute;top:-.35rem;right:-.3rem;background:#F6B43C;color:#fff;font-style:normal;font-size:.58rem;font-weight:800;border-radius:1rem;padding:.05rem .35rem;box-shadow:0 2px 0 #D88A12}
.it .noimg{font-size:1.8rem;aspect-ratio:1;display:grid;place-items:center}
.sxdock{grid-column:1/-1;position:sticky;bottom:0;z-index:2;display:flex;align-items:center;gap:.45rem;background:#5B3B2A;color:#fff;border-radius:1.1rem;padding:.5rem .6rem;box-shadow:0 6px 16px rgba(60,30,10,.35);font-size:.75rem;animation:sxin .3s}
.sxdock>div{flex:1;line-height:1.25}.sxdock b{font-size:.95rem;color:#FFE08A}.sxdock button{border:0;border-radius:.8rem;font-weight:800;padding:.5rem .6rem;font-size:.75rem}
.sxdock .v{background:#FFE7B8;color:#7A4A10}.sxdock .g{background:#3FAE6E;color:#fff}
.spr{width:100%;aspect-ratio:1;background-size:400% 400%;background-position:0 0;background-repeat:no-repeat}#bsell h4 .spr.h{width:3.4rem;height:3.4rem;flex:none;background-color:#fff;border-radius:1rem;border:2px solid #F3E2CC}
.bagghost{grid-column:1/-1;display:flex;align-items:center;gap:.5rem;background:linear-gradient(90deg,#F3E8FF,#E9FFF2);border:2px dashed #C9A9F0;border-radius:1rem;padding:.45rem .6rem}.bagghost img{width:2.4rem;height:2.4rem}.bagghost div{flex:1;font-size:.75rem}.bagghost small{display:block;color:#7A4FA8}.bagghost button{border:0;border-radius:.8rem;background:#8E4FD8;color:#fff;font-weight:800;padding:.45rem .6rem;font-size:.72rem}
`;document.head.appendChild(css);
const box=document.createElement('div');box.id='bsell';box.innerHTML='<div class="bx"></div>';document.body.appendChild(box);
const bx=box.querySelector('.bx');box.onclick=e=>{if(e.target===box&&!busy)close();};
const close=()=>{box.classList.remove('on');};
const show=html=>{bx.innerHTML='<button class="xx" id="bsX0" aria-label="ปิด">✕</button>'+html;box.classList.add('on');bx.scrollTop=0;$('bsX0').onclick=()=>{if(!busy)close();};};

/* ---------- แผนกในกระเป๋า ---------- */
const ghostsHeld=()=>{try{return (parent.__DEMON?.view?.gh||[]).slice().sort((a,b)=>a.until-b.until);}catch(e){return [];}};
const hms2=ms=>{ms=Math.max(0,ms);const h=Math.floor(ms/3600e3),m=Math.floor(ms%3600e3/60e3);return h?h+' ชม. '+m+' น.':m+' นาที';};
const oldTabs=bagTabsAll;bagTabsAll=function(){const t=oldTabs();if(rowsFor('alp').length||ghostsHeld().length)t.alp='🏭 ของแปรรูป';if(rowsFor('pets').length)t.pets='🐾 สัตว์';if(rowsFor('subx').length)t.subx='🦙 ของสัตว์เลี้ยง';return t;};
const OWN={alp:1,pets:1,subx:1};
const cell=r=>{const q=cart.get(r.k),p=priceOf(r);return '<div class="it sx'+(q?' in':'')+'" data-sk="'+esc(r.k)+'">'+(q?'<i class="cq">🧺'+nf(q)+'</i>':'')+pic(imgOf(r))+'<b>'+esc(r.n)+'</b><span>×'+nf(haveOf(r))+'</span><em>💰 '+(p==null?'…':nf(p))+'</em></div>';};
function dock(){const c=cartTotal();if(!c.n)return '';return '<div class="sxdock"><div>🧺 ตะกร้าขาย '+c.n+' อย่าง<br><b>≈ '+nf(c.v)+'</b> กุศล'+(c.unk?' +':'')+'</div><button class="v" data-a="cart">ดูตะกร้า</button><button class="g" data-a="sellcart">💰 ขายเลย</button></div>';}
const oldRender=renderBag;renderBag=function(){
 const own=!!OWN[bagTab];if(own&&!bagTabsAll()[bagTab])bagTab='crop';oldRender();
 const grid=$('bagGrid');if(!grid)return;
 if(!OWN[bagTab]&&!sellMode){const all=worth(SELL_ROWS.filter(r=>haveOf(r)>0));
  grid.insertAdjacentHTML('afterbegin','<div class="sxbar"><div><b>💰 ขายของได้ทุกอย่างในกระเป๋า</b><small>ทั้งกระเป๋ามูลค่าประมาณ '+nf(all.v)+(all.unk?'+':'')+' กุศล</small></div><button data-a="on">💰 เริ่มขาย</button></div>');
  grid.insertAdjacentHTML('beforeend',dock());return;}
 const list=rowsFor(bagTab),w=worth(list),g=bagTab==='alp'?ghostsHeld():[];
 grid.innerHTML=(g.length?'<div class="bagghost"><img src="images/alpaca-hw-ghost.webp" alt=""><div><b>👻 ของผีสิงในมือ ×'+g.length+'</b><small>ต้องส่งให้เพื่อนภายใน '+hms2(g[0].until-Date.now())+' ไม่งั้นระเบิดใส่ตัวเอง</small></div><button id="bgSend">💌 ส่งให้เพื่อน</button></div>':'')+
  '<div class="sxbar"><div><b>💰 แตะของที่จะขาย</b><small>แผนกนี้ '+nf(list.length)+' อย่าง ≈ '+nf(w.v)+(w.unk?'+':'')+' กุศล</small></div>'+(list.length?'<button class="lt" data-a="tab">🧺 ใส่ทั้งแผนก</button>':'')+(OWN[bagTab]?'':'<button class="x" data-a="off" aria-label="ออกจากโหมดขาย">✕</button>')+'</div>'+
  (list.length?list.map(cell).join(''):'<div class="empty" style="grid-column:1/-1">ไม่มีของที่ขายได้ในแผนกนี้</div>')+dock();
 const bs=$('bgSend');if(bs)bs.onclick=e=>{e.stopPropagation();try{closeAll();parent.__DEMON?.openGhost?.();}catch(err){}};
 if(!quote||list.some(r=>r.kind!=='fixed'&&r.kind!=='pet'))getQuote().then(()=>{if(OWN[bagTab]||sellMode)for(const el of grid.querySelectorAll('.it.sx em')){const r=SELL_BY_KEY.get(el.parentNode.dataset.sk),p=r&&priceOf(r);if(p!=null)el.textContent='💰 '+nf(p);}}).catch(()=>{});};
$('bagGrid').addEventListener('click',e=>{const a=e.target.closest('[data-a]'),it=e.target.closest('.it.sx');if(!a&&!it)return;e.stopImmediatePropagation();e.preventDefault();
 if(it)return itemSheet(it.dataset.sk);
 const k=a.dataset.a;if(k==='on'){sellMode=true;renderBag();getQuote().then(()=>renderBag()).catch(()=>{});}
 else if(k==='off'){sellMode=false;renderBag();}
 else if(k==='tab'){for(const r of rowsFor(bagTab))cart.set(r.k,haveOf(r));renderBag();toast('🧺 ใส่ทั้งแผนกลงตะกร้าแล้ว');}
 else if(k==='cart')cartSheet();else if(k==='sellcart')sellCart();},true);

/* ---------- แผ่นขายทีละอย่าง ---------- */
const bonusNote=left=>left>0?'🎁 สัตว์ขายครบทุก '+PET_BONUS_EVERY+' ตัว ได้ของแถมสุ่ม 1 อย่าง '+PET_BONUS_MIN+'–'+PET_BONUS_MAX+' ชิ้น ('+PET_BONUS.map(b=>b[1]).join(' / ')+') · วันนี้นับของแถมได้อีก '+nf(left)+' ตัว':'🎁 วันนี้รับของแถมจากการขายสัตว์ครบแล้ว (ขายต่อได้ตามปกติ)';
const kindNote=r=>r.k==='atm-card'?'⚠️ ขายบัตรแล้วจะใช้ตู้ ATM (โอน/แลกเงิน) ไม่ได้อีก':r.kind==='wine'?'🍷 ราคา 80% ของตลาดสวน ขึ้นลงตามหุ้นไวน์':r.kind==='hw'?'🎃 ราคาร้านฮาโลวีน ช่วงผีออกได้โบนัส':r.kind==='pet'?bonusNote(quote?quote.left:PET_BONUS_DAY):'';
function itemSheet(k){const r=SELL_BY_KEY.get(k);if(!r)return;const have=haveOf(r);if(!have)return toast('ไม่มีของนี้แล้ว',1);
 let q=Math.min(have,cart.get(k)||1);const chips=[1,10,100,1000];
 show('<h4>'+pic(imgOf(r),'h')+'<span>ขาย'+esc(r.n)+'</span></h4>'+
  '<div class="row"><span>🎒 มีในกระเป๋า</span><b>'+nf(have)+'</b></div><div class="row"><span>💰 ราคาขาย</span><b id="bsE">-</b></div>'+(kindNote(r)?'<div class="note" id="bsN">'+kindNote(r)+'</div>':'')+
  '<div class="chips">'+chips.map(c=>'<button data-q="'+c+'"'+(c>have?' disabled':'')+'>'+nf(c)+'</button>').join('')+'<button data-q="all">ทั้งหมด</button></div>'+
  '<input id="bsQ" type="number" inputmode="numeric" min="1" max="'+have+'" value="'+q+'" aria-label="จำนวนที่จะขาย">'+
  '<div class="tot">ประเมินได้รับ<b id="bsT">-</b></div>'+
  '<div class="bb"><button class="cart" id="bsC">🧺 ใส่ตะกร้า</button><button class="go" id="bsGo">💰 ขายเลย</button></div>');
 const inp=$('bsQ'),upd=()=>{const p=priceOf(r);q=Math.max(0,Math.min(have,Math.floor(Number(inp.value)||0)));for(const b of bx.querySelectorAll('.chips button'))b.classList.toggle('on',b.dataset.q==='all'?q===have:Number(b.dataset.q)===q);
  $('bsE').textContent=p==null?'กำลังดูราคา…':nf(p)+' กุศล/ชิ้น';$('bsT').textContent=p==null?'-':'+'+nf(q*p)+' กุศล';$('bsGo').disabled=!q||p==null;$('bsC').disabled=!q;};
 bx.querySelector('.chips').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;inp.value=b.dataset.q==='all'?have:b.dataset.q;upd();};
 inp.oninput=upd;upd();
 if(r.kind!=='fixed')getQuote().then(()=>{upd();const n=$('bsN');if(n)n.innerHTML=kindNote(r);}).catch(e=>toast(e?.message||'ดูราคาไม่ได้',1));
 $('bsC').onclick=()=>{if(!q)return;cart.set(k,q);close();renderBag();toast('🧺 ใส่'+r.n+' ×'+nf(q)+' ลงตะกร้าแล้ว');};
 $('bsGo').onclick=()=>{if(!q)return;sellNow([{k,q:q===have?'all':q}]);};}

/* ---------- ตะกร้าขาย ---------- */
function cartSheet(){const rows=[...cart].map(([k,q])=>[SELL_BY_KEY.get(k),q]).filter(([r])=>r);if(!rows.length){close();return renderBag();}const c=cartTotal();
 show('<h4><span>🧺 ตะกร้าขาย · '+rows.length+' อย่าง</span></h4>'+rows.map(([r,q])=>{const p=priceOf(r);return '<div class="cl">'+pic(imgOf(r))+'<div>'+esc(r.n)+'<small>×'+nf(q)+' · '+(p==null?'…':nf(p))+'/ชิ้น</small></div><b>'+(p==null?'…':'+'+nf(p*q))+'</b><button data-rm="'+esc(r.k)+'" aria-label="เอาออก">✕</button></div>';}).join('')+
  '<div class="tot">ประเมินได้รับทั้งหมด<b>+'+nf(c.v)+(c.unk?'+':'')+' กุศล</b></div>'+(rows.some(([r])=>r.kind==='pet')?'<div class="note">'+bonusNote(quote?quote.left:PET_BONUS_DAY)+'</div>':'')+
  '<div class="note">⚠️ ขายแล้วเอาคืนไม่ได้ · ขายเฉพาะของในกระเป๋า (สัตว์ที่เลี้ยงอยู่ในคอก/บ้านไม่ถูกขาย)</div>'+
  '<div class="bb"><button class="no" id="bsClr">🗑️ ล้างตะกร้า</button><button class="go" id="bsGo">💰 ขายทั้งหมด</button></div>');
 bx.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{cart.delete(b.dataset.rm);renderBag();cartSheet();});
 $('bsClr').onclick=()=>{cart.clear();close();renderBag();};$('bsGo').onclick=sellCart;
 if(rows.some(([r])=>r.kind!=='fixed')&&(!quote||Date.now()-quoteAt>60000))getQuote().then(()=>{if(box.classList.contains('on')&&bx.querySelector('#bsClr'))cartSheet();}).catch(()=>{});}
function sellCart(){const items=[...cart].map(([k,q])=>{const r=SELL_BY_KEY.get(k),h=r?haveOf(r):0;return r&&h?{k,q:q>=h?'all':q}:null;}).filter(Boolean);if(!items.length){cart.clear();return renderBag();}sellNow(items,true);}

/* ---------- ขายจริง (ทีละไม่เกิน 300 อย่างต่อรอบ) ---------- */
async function sellNow(items,fromCart){if(busy)return;busy=true;const go=$('bsGo');if(go){go.disabled=true;go.textContent='⏳ กำลังขาย…';}else show('<div class="done"><div class="dbig">⏳</div><div class="note">กำลังขาย…</div></div>');
 const all={rows:[],total:0,count:0,bonus:{}};let err=null;
 for(let i=0;i<items.length;i+=ROWMAX){try{const out=await call({type:'bag-sell',items:items.slice(i,i+ROWMAX)});const s=out.bagSold;all.rows.push(...s.rows);all.total+=s.total;all.count+=s.count;for(const [k,q] of Object.entries(s.bonus||{}))all.bonus[k]=(all.bonus[k]||0)+q;if(quote)quote.left=s.bonusLeft;}
  catch(e){err=e;break;}}
 busy=false;if(all.rows.length){for(const x of all.rows)cart.delete(x.k);refresh();doneSheet(all,err);}
 else{toast(err?.message||'ขายไม่สำเร็จ',1);if(go){go.disabled=false;go.textContent=fromCart?'💰 ขายทั้งหมด':'💰 ขายเลย';}else close();}}
function coins(){for(let i=0;i<18;i++){const c=document.createElement('div');c.className='sxcoin';c.textContent=i%3?'🪙':'✨';c.style.left=(15+Math.random()*70)+'vw';c.style.top=(70+Math.random()*20)+'vh';c.style.setProperty('--dx',(Math.random()*40-20)+'vw');c.style.setProperty('--r',(Math.random()*720-360)+'deg');c.style.animationDelay=(Math.random()*.5)+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),2000);}}
function doneSheet(s,err){const g=Object.entries(s.bonus||{}).filter(([,q])=>q>0),list=s.rows.slice(0,24);
 show('<div class="done"><div class="dbig">💰</div><div style="font-weight:800">ขายเรียบร้อย '+nf(s.rows.length)+' อย่าง · '+nf(s.count)+' ชิ้น</div><div class="sum">+'+nf(s.total)+' กุศล</div>'+
  '<div class="sold">'+list.map((x,i)=>{const r=SELL_BY_KEY.get(x.k)||{n:x.k};return '<div style="animation-delay:'+(i*.04)+'s">'+pic(r.path?imgOf(r):'')+esc(r.n)+'<br>×'+nf(x.q)+'<b>+'+nf(x.total)+'</b></div>';}).join('')+'</div>'+
  (s.rows.length>list.length?'<div class="note">และอีก '+nf(s.rows.length-list.length)+' อย่าง</div>':'')+
  (g.length?'<div class="note">🎁 ของแถมจากการขายสัตว์ เข้ากระเป๋าแล้ว</div><div class="gift">'+g.map(([k,q])=>{const r=SELL_BY_KEY.get(BIMG[k]||k);return '<span>'+(r?pic(imgOf(r)):'🎁')+esc(BN[k]||k)+' ×'+nf(q)+'</span>';}).join('')+'</div>':'')+
  (err?'<div class="note" style="color:#C0392B">⚠️ บางส่วนยังไม่ได้ขาย: '+esc(err.message||'')+'</div>':'')+
  '<div class="bb"><button class="go" id="bsOk">เยี่ยมเลย 🎉</button></div></div>');
 coins();$('bsOk').onclick=close;}
W.bagSellReady=true;
