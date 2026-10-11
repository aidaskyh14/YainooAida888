/* One durable receipt view for every craft system. Receive acknowledges a committed grant.
   fix13: presentation only — this file never changes what was credited or consumed; it only shows the server result. */
(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=n=>Number(n||0).toLocaleString('th-TH');
 /* Every row gets an icon: explicit image → catalog (path, name, longest name prefix) → emoji by keyword → 🎁. */
 const EMOJI=[
  [/ไวน์|^wine\./,'🍷'],[/น้ำมัน|item\.fuel/,'⛽'],[/หมวกกะลาสี|item\.hat$/,'👒'],[/หมวก/,'🎩'],[/เบ็ด|^rod\./,'🎣'],[/กรรไกรปู|crab/,'🦀'],[/บัตร|vip/,'🎫'],
  [/หุ้น|^stock/,'📈'],[/เหรียญ|^coins?$/,'🪙'],[/กุศล|^merit$/,'✨'],[/กล่องดนตรี|musicbox/,'🎵'],[/กล่อง|box/,'🎁'],[/กระดิ่ง|bell/,'🔔'],
  [/น้ำผึ้ง|honey/,'🍯'],[/น้ำ|ชา|สมูท|ปั่น|^drink\./,'🥤'],[/ไข่|egg|roe/,'🥚'],[/ไหมพรม|yarn/,'🧶'],[/ขน|wool|feather|quills/,'🪶'],
  [/หญ้า|^grass\./,'🌿'],[/ต้นกล้า|^tree\./,'🌱'],[/ดอก|กุหลาบ|^flower\./,'🌸'],[/ผลไม้|แอปเปิล|ส้ม|พีช|เชอร์รี|^fruit\./,'🍎'],
  [/ปุ๋ย|fert/,'🧪'],[/ยา|potion|medicine|spray/,'🧴'],[/เค้ก|cake/,'🍰'],[/มะพร้าว|coconut/,'🥥'],[/ปีก|angel/,'👼'],[/สาก|pestle/,'🥢'],
  [/อัลปาก้า|alpaca/,'🦙'],[/หมา|dog/,'🐶'],[/แมว|^cat/,'🐱'],[/แฮมสเตอร์|hamster/,'🐹'],[/นก|bird/,'🐦'],[/เม่น|hedge/,'🦔'],
  [/ปลา|fish/,'🐟'],[/ฟักทอง|halloween/,'🎃'],[/ไม้|wood/,'🪵'],[/หิน|stone|pebble/,'🪨'],[/เหล็ก|steel/,'⚙️'],[/เชือก|rope/,'🪢'],
  [/แบต|battery/,'🔋'],[/ใบอนุญาต|license/,'📜'],[/ผ้า|scarf|beanie/,'🧣'],[/ตุ๊กตา|plush/,'🧸'],[/รองเท้า|boot/,'👢'],[/ปลอกคอ|collar/,'📿'],
  [/ขนม|treat/,'🍪'],[/นม|milk|cream|ชีส|cheese/,'🧀'],[/เนื้อ|หมู|ไก่|meat|pork|drumstick|trotter/,'🍖'],
  [/อาหาร|food|แกง|ข้าว|ซุป|ยำ|ตำ|สตูว์|ก๋วยเตี๋ยว|^crop\./,'🍲']];
 const DEFAULT_EMOJI='🎁';
 const host=()=>{try{return parent.__HOST||null;}catch(_){return null;}};
 function fuzzy(name){if(!name)return null;let best=null;for(const c of host()?.catalog||[])if(c.n&&String(name).startsWith(c.n)&&(!best||c.n.length>best.n.length))best=c;return best;}
 function craftIcon(row){
  row=row||{};const H=host(),path=String(row.path||'');
  if(row.coins||path==='coins')return {name:row.name||'เหรียญฮาโลวีน',image:row.image||'images/gacha-coin.webp',emoji:'🪙'};
  let c=null;try{c=(path&&H?.catalogItem?.(path))||(row.name&&H?.catalogName?.(row.name))||fuzzy(row.name);}catch(_){c=null;}
  const name=row.name||c?.n||path||'ไอเทม',image=row.image||(c?.i?'images/'+c.i:''),key=name+' '+path;
  const emoji=row.emoji||(EMOJI.find(([re])=>re.test(path)||re.test(name))||[])[1]||DEFAULT_EMOJI;
  return {name,image,emoji,known:!!(row.image||c?.i||row.emoji||EMOJI.some(([re])=>re.test(path)||re.test(name))),key};
 }
 window.craftIcon=craftIcon;window.CRAFT_ICON_DEFAULT=DEFAULT_EMOJI;
 const pic=(icon,cls)=>icon.image?`<span class="${cls}"><img src="${esc(icon.image)}" alt="" onerror="this.parentNode.textContent='${icon.emoji}'"></span>`:`<span class="${cls}">${icon.emoji}</span>`;
 const CSS=`#craftReceipt{position:fixed;inset:0;z-index:100;background:rgba(52,36,60,.55);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:grid;place-items:center;padding:14px;box-sizing:border-box;font-family:'Mali',system-ui,sans-serif;animation:crFade .2s ease-out}
#craftReceipt *{box-sizing:border-box}
#craftReceipt .cr{position:relative;width:min(440px,100%);max-height:calc(100vh - 28px);max-height:calc(100dvh - 28px);overflow:auto;border-radius:28px;padding:0 16px 16px;text-align:center;background:linear-gradient(#fff6df,#fffaf1 180px);color:#5a3d2e;border:3px solid #ffd98a;box-shadow:0 18px 50px rgba(40,20,40,.45);animation:crPop .38s cubic-bezier(.2,1.5,.4,1)}
#craftReceipt .cr.fail{background:linear-gradient(#e6e1ef,#f4f1f8 180px);color:#4c4361;border-color:#c9bfdc;box-shadow:0 18px 50px rgba(30,20,50,.5)}
#craftReceipt .hero{position:relative;height:150px;margin:0 -16px;display:grid;place-items:center;overflow:hidden;border-radius:25px 25px 0 0}
#craftReceipt .rays{position:absolute;left:50%;top:50%;width:340px;height:340px;margin:-170px 0 0 -170px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,206,84,.55) 0 9deg,rgba(255,240,190,0) 9deg 22.5deg);-webkit-mask:radial-gradient(circle,#000 18%,transparent 66%);mask:radial-gradient(circle,#000 18%,transparent 66%);animation:crSpin 9s linear infinite}
#craftReceipt .glow{position:absolute;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(255,236,160,.95),rgba(255,214,102,0) 70%)}
#craftReceipt .heroPic{position:relative;width:104px;height:104px;display:grid;place-items:center;font-size:70px;filter:drop-shadow(0 6px 10px rgba(150,90,0,.35));animation:crBounce .6s cubic-bezier(.2,1.6,.4,1) both .1s}
#craftReceipt .heroPic img{display:block;width:104px;height:104px;object-fit:contain}
#craftReceipt .spk{position:absolute;color:#ffc53d;font-size:18px;text-shadow:0 0 8px #fff3b0;animation:crTwinkle 1.6s ease-in-out infinite}
#craftReceipt .fail .hero{background:radial-gradient(circle at 50% 60%,#d7cfe6,#bfb4d3 75%)}
#craftReceipt .oops{position:relative;font-size:76px;line-height:1;animation:crWobble 1.4s ease-in-out infinite}
#craftReceipt .oops i{position:absolute;right:-10px;top:4px;font-size:30px;font-style:normal;animation:crDrip 1.4s ease-in infinite}
#craftReceipt .oopsTxt{position:absolute;bottom:10px;left:0;right:0;font-weight:800;font-size:15px;color:#6a5a86}
#craftReceipt h2{margin:6px 0 0;font-size:21px;font-weight:800}
#craftReceipt #receiptHead{margin:2px 0 6px;font-size:16px;font-weight:700;color:#b06d00}
#craftReceipt .fail #receiptHead{color:#7a6c97}
#craftReceipt .sum{margin:6px auto 4px;display:inline-flex;align-items:baseline;gap:6px;font-weight:800;font-size:15px}
#craftReceipt .sum b{font-size:34px;line-height:1;color:#2f9e6a}
#craftReceipt .fail .sum b{color:#8b7aa8}
#craftReceipt .coins{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;margin:4px 0 8px}
#craftReceipt .coin{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:15px;background:#e8f8ee;box-shadow:inset 0 0 0 2px #9fdfba;position:relative;opacity:0;animation:crCoin .32s cubic-bezier(.2,1.7,.4,1) forwards}
#craftReceipt .coin.x{background:#efeaf5;box-shadow:inset 0 0 0 2px #cfc5df}
#craftReceipt .coins.many .coin{width:22px;height:22px;font-size:11px;box-shadow:inset 0 0 0 1.5px #9fdfba}#craftReceipt .coins.many .coin.x{box-shadow:inset 0 0 0 1.5px #cfc5df}#craftReceipt .coins.many small{display:none}
#craftReceipt .coin small{position:absolute;top:-5px;right:-5px;font-size:9px;background:#fff;border-radius:8px;padding:0 3px;color:#8a7a70}
#craftReceipt .lbl{margin:10px 0 6px;font-size:13px;font-weight:700;opacity:.8}
#craftReceipt .gains{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,150px));justify-content:center;gap:9px}
#craftReceipt .gain{position:relative;padding:10px 6px 8px;border-radius:18px;background:linear-gradient(#f2fff6,#d9f7e5);box-shadow:0 0 0 2px #7fdcaa,0 0 16px rgba(80,220,140,.55);animation:crGlow 2s ease-in-out infinite,crRise .45s cubic-bezier(.2,1.5,.4,1) both}
#craftReceipt .gain .gp{display:grid;place-items:center;width:64px;height:64px;margin:0 auto;font-size:44px}
#craftReceipt .gain .gp img{display:block;width:64px;height:64px;object-fit:contain}
#craftReceipt .gain .gn{display:block;font-size:12px;font-weight:600;line-height:1.5;margin-top:8px;word-break:break-word}
#craftReceipt .gain .gq{display:block;font-size:20px;font-weight:800;color:#1f8a57}
#craftReceipt .badges{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px}
#craftReceipt .badge{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:999px;font-weight:800;font-size:17px;color:#6b4300;background:linear-gradient(135deg,#fff1b8,#ffcf4a 55%,#f3a712);box-shadow:0 0 0 2px #e6a100,0 4px 14px rgba(230,160,0,.45);animation:crRise .45s cubic-bezier(.2,1.5,.4,1) both .15s}
#craftReceipt .badge img{width:24px;height:24px;object-fit:contain}
#craftReceipt .none{margin:8px 0;font-size:13px;opacity:.85}
#craftReceipt details{margin-top:12px;border-radius:16px;background:rgba(255,255,255,.6);padding:6px 8px}
#craftReceipt summary{cursor:pointer;font-size:13px;font-weight:700;opacity:.8;list-style-position:inside}
#craftReceipt .used{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;padding-top:6px}
#craftReceipt .use{display:inline-flex;align-items:center;gap:3px;padding:3px 8px 3px 4px;border-radius:12px;background:#fff;box-shadow:inset 0 0 0 1px #eadbc9;font-size:12px;font-weight:700;color:#a14b3c}
#craftReceipt .use .up{width:26px;height:26px;display:grid;place-items:center;font-size:18px}
#craftReceipt .use .up img{display:block;width:26px;height:26px;object-fit:contain}
#craftReceipt #receiptStatus{margin:10px 0 8px;font-size:12px;opacity:.8}
#craftReceipt .acts{position:sticky;bottom:-16px;display:grid;gap:8px;margin:0 0 -16px;padding:8px 0 16px;background:linear-gradient(rgba(255,250,241,0),#fffaf1 14px)}
#craftReceipt .fail .acts{background:linear-gradient(rgba(244,241,248,0),#f4f1f8 14px)}
#craftReceipt #receiptReceive{width:100%;padding:15px;border:0;border-radius:20px;font:800 18px 'Mali',system-ui,sans-serif;color:#fff;background:linear-gradient(#5fd39a,#2fae70);box-shadow:0 5px 0 #23875a,0 8px 20px rgba(40,170,110,.4);text-shadow:0 1px 2px rgba(0,80,40,.4)}
#craftReceipt #receiptReceive:not(:disabled){animation:crPulse 1.6s ease-in-out infinite}
#craftReceipt #receiptReceive:disabled{filter:grayscale(.5);opacity:.75;animation:none}
#craftReceipt #receiptAgain{width:100%;padding:10px;border:0;border-radius:16px;font:700 14px 'Mali',system-ui,sans-serif;background:#efe7dc;color:#6a4c3c}
#craftReceipt .fail #receiptAgain{background:#e4ddef;color:#5a4d75}
#craftReceipt .fail #receiptReceive{background:linear-gradient(#a596c4,#7f6fa3);box-shadow:0 5px 0 #66588a,0 8px 20px rgba(100,80,150,.35)}
#craftReceipt .noagain #receiptAgain{display:none}
@keyframes crFade{from{opacity:0}}@keyframes crPop{from{transform:scale(.7);opacity:0}}@keyframes crSpin{to{transform:rotate(360deg)}}
@keyframes crBounce{from{transform:scale(.2) rotate(-12deg);opacity:0}}@keyframes crTwinkle{0%,100%{transform:scale(.4);opacity:.2}50%{transform:scale(1.15);opacity:1}}
@keyframes crWobble{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}@keyframes crDrip{0%{transform:translateY(0);opacity:1}100%{transform:translateY(18px);opacity:0}}
@keyframes crCoin{from{transform:scale(0) translateY(10px);opacity:0}to{transform:none;opacity:1}}@keyframes crRise{from{transform:translateY(14px) scale(.85);opacity:0}}
@keyframes crGlow{0%,100%{box-shadow:0 0 0 2px #7fdcaa,0 0 10px rgba(80,220,140,.4)}50%{box-shadow:0 0 0 2px #5fd39a,0 0 22px rgba(80,220,140,.8)}}
@keyframes crPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
@media (prefers-reduced-motion:reduce){#craftReceipt *{animation:none!important}#craftReceipt .coin{opacity:1}}`;
 function ensureCss(){if(document.getElementById('craftReceiptCss'))return;const st=document.createElement('style');st.id='craftReceiptCss';st.textContent=CSS;(document.head||document.body).appendChild(st);}
 const SPARKS=[[12,22,0],[80,18,.4],[24,70,.8],[86,64,.2],[50,8,1.1],[66,82,.6],[8,48,1.3],[92,40,.9]];
 window.showCraftResult=async function(data,again){
  document.getElementById('craftReceipt')?.remove();ensureCss();const overlay=document.createElement('div');overlay.id='craftReceipt';
  if(data.incomplete){overlay.innerHTML='<section class="cr fail"><p>ยังตรวจผลคราฟไม่ได้ กรุณาตรวจระบบกลาง</p></section>';document.body.appendChild(overlay);return;}
  const results=Array.isArray(data.results)?data.results:[],wins=results.filter(Boolean).length,outputs=(data.outputs||[]).filter(r=>Number(r?.quantity)>0),consumed=(data.consumed||[]).filter(r=>Number(r?.quantity)>0);
  const merit=Number(data.merit)||0,coins=Number(data.coins)||0,hasReward=!!(outputs.length||merit||coins);
  const heroIcon=outputs.length?craftIcon(outputs[0]):coins&&!merit?craftIcon({path:'coins'}):{image:'',emoji:merit?'✨':'🎉'};
  const hero=hasReward?`<div class="hero"><div class="rays"></div><div class="glow"></div>${pic(heroIcon,'heroPic')}${SPARKS.map(([x,y,d])=>`<span class="spk" style="left:${x}%;top:${y}%;animation-delay:${d}s">✦</span>`).join('')}</div>`
   :`<div class="hero"><div class="oops">🐷<i>💦</i></div><div class="oopsTxt">อุ๊ย! พลาดไปนิดเดียว</div></div>`;
  const step=results.length>1?Math.min(90,2200/results.length):0;
  const coinRow=results.length>1?`<div class="sum">สำเร็จ <b>${wins}</b> จาก ${results.length} ครั้ง</div><div class="coins${results.length>20?' many':''}">${results.map((r,i)=>`<span class="coin${r?'':' x'}" style="animation-delay:${Math.round(i*step)}ms"><small>${i+1}</small>${r?'✅':'❌'}</span>`).join('')}</div>`:'';
  const gains=outputs.length?`<div class="lbl">🎁 ของที่ได้</div><div class="gains">${outputs.map((r,i)=>{const ic=craftIcon(r);return `<div class="gain" style="animation-delay:0s,${.1+i*.08}s">${pic(ic,'gp')}<span class="gn">${esc(ic.name)}</span><span class="gq">+${fmt(r.quantity)}</span></div>`;}).join('')}</div>`:'';
  const badges=merit||coins?`<div class="badges">${merit?`<span class="badge">✨ กุศล +${fmt(merit)}</span>`:''}${coins?`<span class="badge"><img src="images/gacha-coin.webp" alt="" onerror="this.replaceWith('🪙')">เหรียญฮาโลวีน +${fmt(coins)}</span>`:''}</div>`:'';
  const none=hasReward?'':'<p class="none">ไม่ได้รับไอเทม · วัตถุดิบถูกใช้ตามสูตร</p>';
  const used=consumed.length?`<details open><summary>📦 ของที่ใช้ไป (${consumed.length})</summary><div class="used">${consumed.map(r=>{const ic=craftIcon(r);return `<span class="use" title="${esc(ic.name)}">${pic(ic,'up')}−${fmt(r.quantity)}</span>`;}).join('')}</div></details>`:'';
  const head=hasReward?(results.length&&wins<results.length?'สำเร็จบางส่วน ได้ของแล้ว!':outputs.length?'สำเร็จ! ได้ของแล้ว':'สำเร็จ! ได้รางวัลแล้ว'):'คราฟครั้งนี้ไม่สำเร็จ';
  overlay.innerHTML=`<section class="cr${hasReward?'':' fail'}${again?'':' noagain'}" role="dialog" aria-modal="true">${hero}<h2>${esc(data.title||'ผลการคราฟ')}</h2><div id="receiptHead">${head}</div>${coinRow}${gains}${badges}${none}${used}<p id="receiptStatus">⏳ กำลังยืนยันการบันทึก…</p><div class="acts"><button id="receiptReceive" disabled>🎒 รับเข้ากระเป๋า</button><button id="receiptAgain" disabled>🔁 คราฟต่อ</button></div></section>`;
  document.body.appendChild(overlay);const status=overlay.querySelector('#receiptStatus'),receive=overlay.querySelector('#receiptReceive'),cont=overlay.querySelector('#receiptAgain'),card=overlay.querySelector('.cr');
  const resync=()=>{try{if(typeof window.syncFromHost==='function'){window.syncFromHost();return true;}}catch(_){}return false;};
  async function commit(){try{await parent.__HOST.commit();status.textContent='บันทึกแล้ว ✓';overlay.querySelector('#receiptHead').textContent=head;cont.textContent='🔁 คราฟต่อ';receive.disabled=false;cont.disabled=!again;receive.textContent=hasReward?'🎒 รับเข้ากระเป๋า':'รับทราบ';receive.onclick=()=>overlay.remove();cont.onclick=()=>{overlay.remove();again?.();};}
   catch(e){/* never show success: the screen is reloaded from the Host state, which is what the cloud has */
    const synced=resync(),setFail=!!e?.hostSet;overlay.querySelector('#receiptHead').textContent='ยังไม่ได้รับของ';card.classList.remove('noagain');
    status.innerHTML='<b style="color:#b3261e">บันทึกไม่สำเร็จ ของยังไม่เปลี่ยน กรุณาลองใหม่</b>'+(e?.message?'<br><small>'+esc(e.message)+'</small>':'');
    cont.textContent='ปิด';cont.disabled=false;cont.onclick=()=>{overlay.remove();if(!synced)location.reload();};
    if(setFail){receive.textContent='ตกลง';receive.disabled=false;receive.onclick=cont.onclick;}
    else{receive.textContent='ลองบันทึกอีกครั้ง';receive.disabled=false;receive.onclick=()=>{receive.disabled=true;commit();};}}}
  await commit();
 };
})();
