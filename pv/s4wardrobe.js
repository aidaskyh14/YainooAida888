/* ซีซั่น 4 · ตู้เสื้อผ้าในห้องนอน (บรีฟ 3.5): ลิ้นชักเลื่อนขึ้นจากด้านล่าง ตัวละครในห้องเปลี่ยนชุดให้ดูทันที (พรีวิวฟรี)
   กด ✓ ใส่ชุดนี้ = บันทึกที่เซิร์ฟเวอร์ (char/wear) · ชุดที่ยังไม่มี = เงาเรืองแสง · ชุดซ้ำขายได้ตามคลาส
   ต้องเบา: ไม่มีฉาก 3D เพิ่ม ใช้ตัวละครในห้องเดิม · เปลี่ยน 100 ครั้ง/วันก็ไม่หน่วง (แค่สลับโมเดล 1 ตัว) */
import {OUTFITS,TRIBES,CLASS,outfitsOf} from '../outfit-catalog.js?h=16ac9bbc';
import {charInfo,rememberChar,fetchGlb,OUTFIT_FILE} from './s4char.js?h=bd13d8c1';
const CC={s:'#7bbf6a',c0:'#9aa3ad',c1:'#4f9be0',c2:'#9a5fd6',c3:'#e8a91e',c4:'#e0457a',q:'#b9852a'};
let EL=null,busy=false;
const host=()=>{try{return parent.__HOST||parent.parent.__HOST;}catch(e){return null;}};
function bagOutfits(){try{const g=JSON.parse(host().get('s3all-v1')||'{}');return (g.bag&&g.bag.outfit)||{};}catch(e){return {};}}
function css(){if(document.getElementById('s4wdCss'))return;const st=document.createElement('style');st.id='s4wdCss';st.textContent=`
#s4wd{position:fixed;inset:0;z-index:70;font-family:Mali,sans-serif;color:#4a2333;pointer-events:none}
#s4wd .veil{position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(255,240,250,.1),rgba(60,30,60,.35));pointer-events:auto}
#s4wd .dr{position:absolute;left:0;right:0;bottom:0;max-height:54%;background:linear-gradient(#fff6f9,#fde9f1);border-top:6px solid #e3a352;border-radius:22px 22px 0 0;display:flex;flex-direction:column;transform:translateY(105%);transition:transform .45s cubic-bezier(.2,.9,.25,1.05);pointer-events:auto;box-shadow:0 -10px 30px rgba(74,35,51,.25)}
#s4wd.on .dr{transform:none}
#s4wd .hd{display:flex;align-items:center;gap:8px;padding:10px 14px 4px}
#s4wd .hd b{font-size:15px}#s4wd .hd .tr{margin-left:auto;font-size:12px;font-weight:700;color:#8a5a6c}
#s4wd .hd .x{width:32px;height:32px;border-radius:50%;border:2.5px solid #4a2333;background:#fffaf6;font:800 14px Mali,sans-serif;box-shadow:0 2px 0 #4a2333;padding:0}
#s4wd .now{display:flex;align-items:center;gap:8px;margin:0 14px 6px;padding:6px 10px;border-radius:14px;background:#fffaf6;border:2.5px solid #4a2333;box-shadow:0 3px 0 #4a2333;font-size:13px;font-weight:700}
#s4wd .now img{width:34px;height:34px;object-fit:contain}#s4wd .now .chip{font-size:10.5px;color:#fff;border-radius:999px;padding:1px 8px}
#s4wd .now button{margin-left:auto;border:2.5px solid #4a2333;border-radius:12px;background:linear-gradient(#fff3c4,#e8b64c);font:800 13px Mali,sans-serif;padding:6px 12px;box-shadow:0 3px 0 #4a2333;color:#4a2333}
#s4wd .now button.sell{background:#fffaf6;font-size:11.5px;padding:5px 9px}
#s4wd .now button:disabled{opacity:.45;box-shadow:none}
#s4wd .grid{flex:1;min-height:0;overflow-y:auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:4px 14px calc(14px + env(safe-area-inset-bottom,0px));align-content:start}
#s4wd .card{position:relative;background:#fffaf6;border:3px solid var(--cc);border-radius:16px;padding:4px 3px 5px;display:flex;flex-direction:column;align-items:center;gap:2px;box-shadow:0 3px 0 var(--cc);transition:transform .12s;font:inherit;color:inherit}
#s4wd .card:active{transform:translateY(2px)}#s4wd .card img{width:100%;aspect-ratio:1;object-fit:contain}
#s4wd .card .nm{font-size:10.5px;font-weight:700;line-height:1.2;text-align:center;min-height:2.4em;display:flex;align-items:center}
#s4wd .card .q{position:absolute;top:3px;right:5px;font-size:10px;font-weight:700;color:#8a5a6c}
#s4wd .card.wear{background:#fff0c9}#s4wd .card.wear::after{content:'ใส่อยู่';position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#ef6f9a;color:#fff;font-size:9.5px;font-weight:700;padding:0 7px;border-radius:999px;border:2px solid #4a2333}
#s4wd .card.pv{outline:3px solid #ef6f9a;outline-offset:2px}
#s4wd .card.q{grid-column:span 2;background:linear-gradient(135deg,#fff6d6,#ffe1ec);box-shadow:0 3px 0 #b9852a,0 0 14px #ffd76a}#s4wd .card.q img{width:60%}
#s4wd .card.lock{overflow:hidden;background:linear-gradient(160deg,#fff7fb,#f1e6f7)}
#s4wd .card.lock img{filter:brightness(0) invert(.22) sepia(1) hue-rotate(230deg) saturate(2.2) blur(1.3px) drop-shadow(0 0 3px rgba(255,214,140,.95)) drop-shadow(0 0 8px rgba(255,150,200,.6));opacity:.72}
#s4wd .card.lock::before{content:'';position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.75) 48%,rgba(255,230,170,.35) 52%,transparent 68%);transform:translateX(-130%);animation:s4shim 3.4s ease-in-out infinite;pointer-events:none}
#s4wd .card.lock:nth-child(3n)::before{animation-delay:1.1s}#s4wd .card.lock:nth-child(3n+1)::before{animation-delay:2.2s}
@keyframes s4shim{55%,100%{transform:translateX(130%)}}
#s4wd .card.lock .nm{color:#8a5a6c}
#s4wd .flash{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.95),rgba(255,226,160,.55) 30%,rgba(255,150,200,0) 65%);opacity:0;transition:opacity .5s}
#s4wd .flash.on{opacity:1;transition:opacity .08s}
#s4wd .tip{position:absolute;left:50%;top:14%;transform:translateX(-50%);background:#4a2333;color:#fffaf6;font-weight:700;font-size:12.5px;padding:6px 14px;border-radius:14px;white-space:nowrap;max-width:90%;overflow:hidden;text-overflow:ellipsis;opacity:0;transition:opacity .25s}
#s4wd .tip.on{opacity:1}`;document.head.appendChild(st);}
let state={tribe:'pink',wear:'punk',pv:null,bag:{}};
function cards(){const L=outfitsOf(state.tribe).filter(o=>o.cls!=='q'||state.bag.queen>0);const order={q:0,s:1,c0:2,c1:3,c2:4,c3:5,c4:6};L.sort((a,b)=>order[a.cls]-order[b.cls]);
 return L.map(o=>{const n=Number(state.bag[o.id])||0,lock=n<1;return `<button type="button" class="card ${o.cls==='q'?'q':''} ${lock?'lock':''} ${state.wear===o.id?'wear':''} ${state.pv===o.id?'pv':''}" data-id="${o.id}" style="--cc:${CC[o.cls]}"><img src="../images/outfit-${o.id}.webp" alt="" loading="lazy" onerror="this.style.visibility='hidden'"><span class="q">${lock?'🔒':n>1?'×'+n:''}</span><span class="nm">${o.n}</span></button>`;}).join('');}
function nowBar(){const id=state.pv||state.wear,o=OUTFITS[id];if(!o)return '';const n=Number(state.bag[id])||0,own=n>0,isWear=state.wear===id,price=CLASS[o.cls].sell,dup=n>1&&price>0&&!state.admin;
 return `<img src="../images/outfit-${id}.webp" alt=""><span>${o.n}</span><span class="chip" style="background:${CC[o.cls]}">${CLASS[o.cls].n}</span>${dup?`<button type="button" class="sell" data-a="sell">ขายซ้ำ ${(price).toLocaleString('en-US')}</button>`:''}<button type="button" data-a="wear" ${(!own||isWear)?'disabled':''}>${isWear?'ใส่อยู่':own?'✓ ใส่ชุดนี้':'ยังไม่มี'}</button>`;}
function render(){if(!EL)return;EL.querySelector('.hd .tr').textContent=TRIBES[state.tribe].n;EL.querySelector('.now').innerHTML=nowBar();EL.querySelector('.grid').innerHTML=cards();}
function tip(t){const e=EL&&EL.querySelector('.tip');if(!e)return;e.textContent=t;e.classList.add('on');clearTimeout(tip.t);tip.t=setTimeout(()=>e.classList.remove('on'),2200);}
async function wearNow(id){const H=host();if(!H||!H.cloud)return tip('เชื่อมต่อไม่ได้');if(busy)return;busy=true;try{const out=await H.cloud('char',{type:'wear',id});const v=out&&out.view;if(v){state.wear=v.wear;state.bag=v.outfits||state.bag;rememberChar({tribe:v.tribe,wear:v.wear});}
  state.pv=null;render();const f=EL.querySelector('.flash');f.classList.add('on');setTimeout(()=>f.classList.remove('on'),120);if(window.__s4wear)window.__s4wear(state.wear);tip('✨ เปลี่ยนชุดแล้ว');}catch(e){tip('⚠️ '+(e&&e.message||'เปลี่ยนชุดไม่สำเร็จ'));}busy=false;}
async function sellDup(id){const H=host();if(!H||!H.cloud||busy)return;const o=OUTFITS[id];if(!confirm('ขายชุดซ้ำ '+o.n+' 1 ชุด ได้กุศล '+CLASS[o.cls].sell.toLocaleString('en-US')+'?'))return;busy=true;try{const out=await H.cloud('char',{type:'sell',id,n:1});const v=out&&out.view;if(v){state.bag=v.outfits||state.bag;}render();tip('💰 ขายแล้ว +'+(out.sold?out.sold.merit.toLocaleString('en-US'):''));}catch(e){tip('⚠️ '+(e&&e.message||'ขายไม่สำเร็จ'));}busy=false;}
export function openWardrobe(){css();const info=charInfo();state={tribe:info.tribe,wear:info.wear,pv:null,bag:bagOutfits()};
 /* โหลดไฟล์ชุดที่มีไว้ล่วงหน้าทีละไฟล์ (ตู้เปิดแล้วลองชุดได้ทันที ไม่หน่วง) */try{const ids=Object.keys(state.bag).filter(id=>state.bag[id]>0&&OUTFIT_FILE[id]&&id!==state.wear);(async()=>{for(const id of ids){try{await fetchGlb('../ch/'+OUTFIT_FILE[id]+'.glb');}catch(e){}}})();}catch(e){}
 if(!EL){EL=document.createElement('div');EL.id='s4wd';EL.innerHTML=`<div class="veil"></div><div class="flash"></div><div class="tip"></div><div class="dr"><div class="hd"><b>👗 ตู้เสื้อผ้า</b><span class="tr"></span><button type="button" class="x" data-a="x">✕</button></div><div class="now"></div><div class="grid"></div></div>`;document.body.appendChild(EL);
  EL.querySelector('.veil').onclick=()=>closeWardrobe();
  EL.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(a){if(a.dataset.a==='x')closeWardrobe();else if(a.dataset.a==='wear')wearNow(state.pv||state.wear);else if(a.dataset.a==='sell')sellDup(state.pv||state.wear);return;}
   const c=e.target.closest('.card');if(!c)return;const id=c.dataset.id;const own=(Number(state.bag[id])||0)>0;state.pv=id;render();if(own){if(window.__s4wear)window.__s4wear(id);}else tip('🔒 '+OUTFITS[id].n+' · '+(OUTFITS[id].cls==='c4'?'ได้จากยัยหนูส่งเท่านั้น':'ลุ้นจากกล่องสุ่มเสื้อผ้า'));});}
 render();EL.classList.add('on');try{document.body.classList.add('s4wardrobe');}catch(e){}
 /* ซิงก์กับเซิร์ฟเวอร์เบื้องหลัง (กันของในเซฟยังไม่อัปเดต) */try{const H=host();if(H&&H.cloud)H.cloud('char',{type:'status'}).then(out=>{const v=out&&out.view;if(!v||!EL)return;if(v.tribe){state.tribe=v.tribe;state.wear=v.wear;state.bag=v.outfits||{};state.admin=!!v.admin;rememberChar({tribe:v.tribe,wear:v.wear});render();}}).catch(()=>{});}catch(e){}}
export function closeWardrobe(){if(!EL)return;EL.classList.remove('on');document.body.classList.remove('s4wardrobe');try{window.__room&&window.__room.zoomTo(1);}catch(e){}if(state.pv&&state.pv!==state.wear&&window.__s4wear)window.__s4wear(state.wear);state.pv=null;}
export const wardrobeOpen=()=>!!(EL&&EL.classList.contains('on'));
