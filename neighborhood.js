/* fix14 เนเบอร์ฮูด — หน้าเกม (หน้าตาตามที่อนุมัติ) · ทุกอย่างที่เปลี่ยนข้อมูลทำบนเซิร์ฟเวอร์ (Host.cloud('nb',…)) */
import {NB_QUESTS,NB_MIN,NB_MAX,NB_LOCK,NB_GIFT_DAY,NB_GIFT_KINDS,NB_GIFT_MAX,NB_EMBLEMS,NB_STICKERS,NB_COST,nbProgress,nbBasket,costLeft,costDone} from './nb-engine.js?v=ss3-fix14';
const H=parent.__HOST;if(!H)throw new Error('กรุณาเข้าเกมจากหน้าล็อกอิน');
const $=id=>document.getElementById(id),fmt=n=>Math.round(Number(n)||0).toLocaleString('en-US');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ME=H.uid,COL=['#F2A23A','#5BB6D4','#B07CC6','#6CC9A8','#F27E9B','#E07A5F'],SLOTS=[[15,29],[40,33.5],[76,30],[89,39]];
const CAT=H.catalog||[],catBy=k=>CAT.find(c=>c.k===k);
let V={nbId:null,nb:null,invites:[],today:null,day:'',serverNow:Date.now()},off=0,busy=false,stopNb=null,stopDay=null,watchKey='';
const SNow=()=>Date.now()+off;
const game=()=>{try{return JSON.parse(H.get('s3all-v1')||'{}');}catch(e){return {};}};
const bagGet=(g,path)=>{const v=path.split('.').reduce((o,k)=>o?.[k],g.bag||{});return Number.isFinite(Number(v))?Math.floor(Number(v)):0;};
const nameOf=uid=>V.nb?.names?.[uid]||(uid===ME?'คุณ':'เพื่อนบ้าน');
const colOf=uid=>COL[Math.max(0,(V.nb?.members||[]).indexOf(uid))%COL.length];
const ini=uid=>esc([...String(nameOf(uid))][0]||'?');
const icon=ic=>ic.startsWith('img:')?'<img src="images/'+ic.slice(4)+'.webp" alt="">':ic;

/* ---------- เซิร์ฟเวอร์ ---------- */
async function act(input,quiet){if(busy)return null;busy=true;try{const out=await H.cloud('nb',input);take(out);return out;}catch(e){if(!quiet)toast('nb-lock',esc(e.message||'ทำรายการไม่สำเร็จ'),true);return null;}finally{busy=false;}}
function take(out){if(!out)return;if(Number.isFinite(out.serverNow))off=out.serverNow-Date.now();V={...V,...out};watch();render();}
function watch(){const key=V.nbId&&V.nb?V.nbId+'|'+V.day:'';if(key===watchKey)return;watchKey=key;stopNb?.();stopDay?.();stopNb=stopDay=null;if(!key||!H.watchNb)return;
 stopNb=H.watchNb(V.nbId,data=>{if(!data)return;V.nb={...data,contrib:data.contrib||{}};if(!(V.nb.members||[]).includes(ME)&&V.nb.status!=='forming')return act({type:'status'},true);render();});
 if(V.nb.status==='active')stopDay=H.watchNbDay(V.nbId,V.day,data=>{V.today={q:data?.q||{},gifts:data?.gifts||{},log:data?.log||[]};render();});}
addEventListener('pagehide',()=>{stopNb?.();stopDay?.();},{once:true});

/* ---------- ฉาก ---------- */
const AR=941/1672;
function fit(){const v=$('view').getBoundingClientRect();let w=v.width,h=w/AR;if(h>v.height){h=v.height;w=h*AR;}const s=$('stage');s.style.width=w+'px';s.style.height=h+'px';s.style.fontSize=Math.max(11,Math.min(15,w/30))+'px';}
addEventListener('resize',fit);
function prog(){return V.nb&&V.nb.status==='active'?nbProgress(V.today||{q:{}},V.nb.members||[]):null;}
function render(){fit();const nb=V.nb,st=$('stage'),hud=$('hud');
 if(!nb){st.className='stage gray';st.innerHTML='';hud.innerHTML=`<div class="center"><img class="hero" src="images/nb-home.webp" alt=""><h4>ยังไม่มีเนเบอร์ฮูด</h4><span class="warn">⚠️ ทุกเที่ยงคืน −5,000 กุศล</span>
  <p style="font-size:.78rem;margin:.6rem 0 .2rem">🧺 เข้าเนเบอร์ฮูด รับกุศลสูงสุดวันละ <b style="color:#C47A00">1,000,000</b></p>
  <div class="row"><button class="btn r" id="bInv"><img src="images/nb-invite.webp" alt="">คำเชิญ ${V.invites.length}</button><button class="btn y" id="bCreate">🏗️ สร้าง</button></div></div>`;
  $('bInv').onclick=openInvites;$('bCreate').onclick=openCreate;return;}
 if(nb.status==='forming'||nb.status==='pending'){st.className='stage gray';st.innerHTML=[[15,27],[40,31.5],[76,28]].map(([x,y])=>`<span class="sp" style="left:${x}%;top:${y}%;font-size:1.6em;animation:none">🚧</span>`).join('');
  const lead=nb.leader===ME,left=costLeft(nb.pool),okMats=costDone(nb.pool),pend=nb.status==='pending';
  hud.innerHTML=`<div class="center"><img class="hero" src="images/nb-emb-${esc(nb.emblem)}.webp" alt=""><h4>${esc(nb.name)}</h4>
   <span class="pill ${pend?'p-gold':'p-mint'}" style="font-size:.8rem">${pend?'⏳ รอยัยหนูอนุมัติ':'🏗️ กำลังสร้าง'}</span>
   ${nb.rejectNote&&!pend?`<p style="font-size:.72rem;color:#C23A33;margin:.3rem 0">📝 ยัยหนู: ${esc(nb.rejectNote)}</p>`:''}
   <div class="ppl">${nb.members.map(u=>`<span class="pill p-mint">${u===nb.leader?'👑':'✅'} ${esc(nameOf(u))}</span>`).join('')}${(nb.invites||[]).map(u=>`<span class="pill p-gray">⏳ ${esc(nameOf(u))}</span>`).join('')}</div>
   <p style="font-size:.72rem;color:var(--soft);margin:.2rem 0">👥 ${nb.members.length}/${NB_MIN}–${NB_MAX} คน · 🤝 ลงขัน ${left.filter(x=>!x[3]).length}/${left.length} ชนิดครบ</p>
   ${pend?`<p style="font-size:.72rem;color:var(--soft);margin:.2rem 0">🛡️ ระหว่างรอไม่โดนหัก · ยกเลิกได้ ของยังอยู่ครบ</p><div class="row">${lead?'<button class="btn gray" id="bWithdraw">↩️ ยกเลิกคำขอ</button>':''}</div>`
   :`<div class="row"><button class="btn g" id="bGive">🤝 ลงขัน</button>${lead?'<button class="btn r" id="bInvite"><img src="images/nb-invite.webp" alt="">เชิญ</button>':''}</div>
    <div class="row">${lead?`<button class="btn y" id="bSubmit" ${nb.members.length>=NB_MIN&&okMats?'':'disabled'}>📨 ยื่นคำขอ</button>`:''}<button class="btn gray" id="bLeave">${lead?'🏚️ ยุบ':'🚪 ออก'}</button></div>`}</div>`;
  if($('bWithdraw'))$('bWithdraw').onclick=()=>confirmPop('↩️ ยกเลิกคำขอ?','กลับไปแก้ไขได้ ของที่ลงขันยังอยู่ครบ',()=>act({type:'withdraw'}));
  if($('bGive'))$('bGive').onclick=openMats;if($('bInvite'))$('bInvite').onclick=openInvitePicker;
  if($('bSubmit'))$('bSubmit').onclick=()=>act({type:'submit'}).then(o=>o&&toast('nb-home','📨 ยื่นคำขอแล้ว รอยัยหนูอนุมัตินะ'));
  if($('bLeave'))$('bLeave').onclick=()=>confirmPop(lead?'🏚️ ยุบเนเบอร์ฮูด?':'🚪 ออกจากทีม?',lead?'ของที่ทุกคนลงขันจะคืนเข้าไปรษณีย์ครบทุกชิ้น':'ของที่คุณลงขันจะคืนเข้าไปรษณีย์ครบ',()=>act({type:'leave'}));
  return;}
 // active
 const p=prog(),done=p.done,cut=p.cut;st.className='stage';
 st.innerHTML=nb.members.slice(0,4).map((u,i)=>{const [x,y]=SLOTS[i];return `<button class="tagm${u===ME?' me':''}" style="left:${x}%;top:${y}%" ${u===ME?'':`data-gift="${esc(u)}"`} aria-label="${esc(nameOf(u))}"><span class="bub"><span class="av" style="background:${colOf(u)}">${ini(u)}${u===nb.leader?'<img src="images/nb-crown.webp" alt="">':''}</span>${esc(nameOf(u))}${u===ME?'':'<img class="gf" src="images/nb-gift.webp" alt="">'}</span><span class="pin"></span></button>`;}).join('')
  +`<button class="hot" style="left:14%;top:53%" data-open="quest"><span class="lab"><img src="images/nb-q-harvest.webp" alt="">${done}/10</span></button>`
  +`<button class="hot" style="left:62%;top:51%" data-open="basket"><span class="glow"></span><span class="lab"><img src="images/nb-basket.webp" alt="">${fmt(p.base)}</span>${cut?`<span class="cut">⏰ −${Math.round(cut*100)}% → ${fmt(p.net)}</span>`:''}</button>`
  +[[55,58],[70,56],[60,62],[67,61.5]].map(([x,y],i)=>`<span class="sp" style="left:${x}%;top:${y}%;animation-delay:${i*.6}s">✨</span>`).join('');
 const giftsLeft=Math.max(0,NB_GIFT_DAY-(Number(V.today?.gifts?.[ME])||0));
 hud.innerHTML=`<div class="top"><div class="namechip"><img src="images/nb-emb-${esc(nb.emblem)}.webp" alt=""><div style="min-width:0"><b>${esc(nb.name)}</b><small>👥 ${nb.members.length}/${NB_MAX} · 👑 ${esc(nameOf(nb.leader))}</small></div></div><div class="grow"></div>
  <button class="rbtn" data-open="log" aria-label="บันทึกกิจกรรม">📜</button>${nb.leader===ME&&nb.members.length+(nb.invites||[]).length<NB_MAX?'<button class="rbtn" id="bInvite" aria-label="เชิญสมาชิก"><img src="images/nb-invite.webp" alt=""></button>':''}</div>
  <div class="clockchip">🕛 รีเซ็ตใน <span id="cd">--:--:--</span></div>
  <div class="bar"><button class="bb" data-open="quest"><span class="c"><img src="images/nb-q-harvest.webp" alt=""><span class="badge">${done}/10</span></span><span>เควสต์</span></button>
   <button class="bb main" data-open="basket"><span class="c"><img src="images/nb-basket.webp" alt=""></span><span>ตะกร้า</span></button>
   <button class="bb" data-open="members"><span class="c"><img src="images/nb-gift.webp" alt=""><span class="badge" style="background:#6CC9A8">${giftsLeft}</span></span><span>ส่งของ</span></button></div>`;
 if($('bInvite'))$('bInvite').onclick=openInvitePicker;tick();
 if(openId&&['quest','basket','members','log'].includes(openId))openSheet(openId,true);
}
function tick(){const el=$('cd');if(!el)return;const l=86400e3-((SNow()+7*3600e3)%86400e3);el.textContent=[l/3600e3,l/60e3%60,l/1e3%60].map(v=>String(Math.floor(v)).padStart(2,'0')).join(':');const lk=$('lockcd');if(lk){const t=Math.max(0,(V.nb?.joinedAt?.[ME]||0)+NB_LOCK-SNow())/1000;lk.textContent=[t/3600,t/60%60,t%60].map(v=>String(Math.floor(v)).padStart(2,'0')).join(':');}}
setInterval(tick,1000);

/* ---------- แผ่นเลื่อน ---------- */
let openId=null;
function sheet(id,html){openId=id;$('sheet').innerHTML='<div class="grip"></div>'+html;$('sheet').classList.add('on');$('shade').classList.add('on');}
function closeSheet(){openId=null;$('sheet').classList.remove('on');$('shade').classList.remove('on');}
$('shade').onclick=closeSheet;
const head=(img,title,extra)=>`<div class="sh">${img}<h3>${title}</h3>${extra||''}<button class="x" data-close aria-label="ปิด">✕</button></div>`;
function openSheet(id,refresh){const nb=V.nb;if(!nb)return;const p=prog();
 if(id==='quest'){const mem=nb.members;sheet(id,head('<img src="images/nb-q-harvest.webp" alt="">','เควสต์รวมพลัง','<span class="pill p-gold">✅ '+p.done+'/10</span>')
  +'<div class="legend">'+mem.map(u=>`<span><i style="background:${colOf(u)}"></i>${esc(nameOf(u))}</span>`).join('')+'</div>'
  +p.rows.map(r=>{let acc=0;const seg=mem.map(u=>{const w=Math.max(0,Math.min(r.by[u]||0,r.goal-acc));acc+=w;return `<i style="width:${w/r.goal*100}%;background:${colOf(u)}"></i>`;}).join('');
   return `<div class="cc${r.done?' done':''}"><div class="ic" style="background:#FFF6E6">${icon(r.icon)}</div><div class="mid"><b>${esc(r.name)}</b><small>${fmt(Math.min(r.sum,r.goal))} / ${fmt(r.goal)} ${esc(r.unit)} · คนละ ${fmt(r.per)}</small><div class="trk">${seg}</div></div>${r.done?'<span class="ok">✅</span>':'<span class="pill p-gray">⏳</span>'}</div>`;}).join(''));}
 if(id==='basket'){const T=[['10','ไม่หัก','1,000,000',10,10,'c-ok'],['7–9','−20%','≤360,000',7,9,'c-w'],['4–6','−50%','≤150,000',4,6,'c-w'],['0–3','−100%','0',0,3,'c-bad']];const y=V.yesterday;
  sheet(id,head('<img src="images/nb-basket.webp" alt="">','ตะกร้ารางวัล')+`<div class="bk"><img src="images/nb-basket.webp" alt=""><div class="amt">${fmt(p.base)} <small>กุศล/คน</small></div><div class="net">${p.cut?`⏰ ถ้าหมดเวลาตอนนี้ <span class="pill ${p.cut===1?'p-red':'p-gold'}">−${Math.round(p.cut*100)}%</span> ได้จริง <b class="${p.cut===1?'c-bad':'c-w'}">${fmt(p.net)}</b>`:'<span class="pill p-mint">🌟 ครบ 10 ข้อ ไม่โดนหัก</span>'}</div></div>
   <div class="tiers">${T.map(([a,b,c,lo,hi,cl])=>`<div class="tier${p.done>=lo&&p.done<=hi?' on':''}"><b>${a} ข้อ</b><span class="${cl}" style="font-weight:700">${b}</span><br>${c}</div>`).join('')}</div>
   <div class="row" style="justify-content:center;font-size:.72rem;color:var(--soft)">✅ ข้อละ 50,000 · 🌟 ครบ 10 ข้อ +500,000 · 📮 จ่ายเที่ยงคืน</div>${y?`<div class="row" style="justify-content:center;font-size:.74rem">🧺 เมื่อวาน ${y.done}/10 ข้อ · ได้ <b>&nbsp;${fmt(y.net)}&nbsp;</b> กุศล/คน</div>`:''}`);}
 if(id==='members'){const left=Math.max(0,NB_GIFT_DAY-(Number(V.today?.gifts?.[ME])||0)),lockLeft=(nb.joinedAt?.[ME]||0)+NB_LOCK-SNow();
  sheet(id,head('<img src="images/nb-gift.webp" alt="">','สมาชิก &amp; ส่งของ','<span class="pill p-mint">🎁 '+left+'/'+NB_GIFT_DAY+'</span>')
   +nb.members.map(u=>{const fresh=SNow()-(nb.joinedAt?.[u]||0)<NB_LOCK,helped=p.rows.reduce((a,r)=>a+(r.by[u]>0?1:0),0);return `<div class="mr"><div class="av" style="background:${colOf(u)}">${ini(u)}${u===nb.leader?'<img src="images/nb-crown.webp" alt="">':''}</div><div class="mid"><b>${esc(nameOf(u))}${u===nb.leader?'<span class="pill p-gold">👑 หัวหน้า</span>':''}${u===ME?'<span class="pill p-mint">ฉัน</span>':''}${fresh?'<span class="pill p-gray">🔒 เพิ่งเข้า</span>':''}</b><small>วันนี้ช่วย ${helped} เควสต์</small></div>${u===ME?'':`<button class="btn r" data-gift="${esc(u)}" ${left?'':'disabled'}><img src="images/nb-gift.webp" alt="">ส่ง</button>`}</div>`;}).join('')
   +(lockLeft>0?`<div class="lockbar"><img src="images/nb-lock.webp" alt=""><span style="flex:1">ออกจากเนเบอร์ฮูดได้ใน</span><b id="lockcd">--:--:--</b></div>`:'')
   +`<div class="row"><button class="btn gray" id="bLeave" ${lockLeft>0?'disabled':''}>🚪 ออก</button></div>`);
  $('bLeave').onclick=()=>confirmPop('🚪 ออกจากเนเบอร์ฮูด?',nb.leader===ME?'หัวหน้าจะส่งต่อให้สมาชิกที่อยู่นานที่สุด · หลังออก ถ้ายังไม่มีเนเบอร์ฮูด เที่ยงคืนโดนหัก 5,000':'หลังออก ถ้ายังไม่มีเนเบอร์ฮูด เที่ยงคืนโดนหัก 5,000',()=>act({type:'leave'}));tick();}
 if(id==='log'){const t=s=>new Date(s).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});
  const rows=[...(V.today?.log||[]).map(x=>({e:x.sticker||'🎁',t:'<b>'+esc(nameOf(x.from))+'</b> ส่งของ '+Object.entries(x.items||{}).map(([k,q])=>esc(catBy(k)?.n||k)+'×'+fmt(q)).join(' ')+' ให้ <b>'+esc(nameOf(x.to))+'</b>',at:x.at})),...(nb.log||[]).map(x=>({e:x.e,t:esc(x.t),at:x.at}))].sort((a,b)=>b.at-a.at).slice(0,40);
  sheet(id,head('<span style="font-size:1.8rem">📜</span>','บันทึกล่าสุด')+(rows.map(r=>`<div class="lg"><span class="e">${r.e}</span><span class="mid">${r.t}</span><time>${t(r.at)}</time></div>`).join('')||'<div class="empty">ยังไม่มีบันทึก</div>'));}
}
/* ---------- ส่งของ ---------- */
let giftTo=null,giftQ={},sticker='❤️',giftSearch='';
function giftables(){const g=game();return CAT.filter(c=>!c.p.startsWith('sub.')&&bagGet(g,c.p)>0).map(c=>({c,have:bagGet(g,c.p)}));}
function openGift(uid){giftTo=uid;giftQ={};giftSearch='';drawGift();}
function drawGift(){const list=giftables().filter(x=>!giftSearch||x.c.n.includes(giftSearch)),left=Math.max(0,NB_GIFT_DAY-(Number(V.today?.gifts?.[ME])||0));
 sheet('gift',head('<img src="images/nb-gift.webp" alt="">','ส่งให้ '+esc(nameOf(giftTo)))+`<div class="ppl" style="margin-bottom:.5rem"><span class="pill p-mint">🔁 เหลือ ${left}/${NB_GIFT_DAY}</span><span class="pill p-gold" id="gk">📦 0/${NB_GIFT_KINDS} ชนิด</span><span class="pill p-gray">🔢 ชนิดละ ≤${NB_GIFT_MAX}</span></div>
  <div class="srch">🔍<input id="gsearch" placeholder="ค้นหาของในกระเป๋า" value="${esc(giftSearch)}"></div>
  <div class="items" id="items">${list.map(({c,have})=>`<label class="it${giftQ[c.k]?' sel':''}" data-k="${esc(c.k)}"><img src="images/${esc(c.i)}" alt="" onerror="this.style.visibility='hidden'">${esc(c.n)}<small>มี ${fmt(have)}</small><input type="number" min="0" max="${Math.min(NB_GIFT_MAX,have)}" value="${giftQ[c.k]||0}" inputmode="numeric" data-q="${esc(c.k)}"></label>`).join('')||'<div class="empty">กระเป๋ายังว่าง</div>'}</div>
  <div class="stk" id="stk">${NB_STICKERS.map(s=>`<button aria-pressed="${s===sticker}" data-st="${s}">${s}</button>`).join('')}</div>
  <div class="sum" id="gsum">แตะของที่จะส่ง</div><div class="row" style="justify-content:flex-end"><button class="btn gray" data-close>ยกเลิก</button><button class="btn r" id="gsend" disabled><img src="images/nb-gift.webp" alt="">ส่งเลย</button></div>`);
 recalc();
 $('gsearch').oninput=e=>{giftSearch=e.target.value.trim();const pos=e.target.selectionStart;drawGift();$('gsearch').focus();$('gsearch').setSelectionRange(pos,pos);};
 $('items').oninput=e=>{const k=e.target.dataset.q;if(!k)return;let v=Math.floor(+e.target.value||0);const mx=+e.target.max;if(v>mx){v=mx;e.target.value=mx;}if(v<0){v=0;e.target.value=0;}if(v>0)giftQ[k]=v;else delete giftQ[k];e.target.closest('.it').classList.toggle('sel',v>0);recalc();};
 $('items').onclick=e=>{const l=e.target.closest('.it');if(!l||e.target.tagName==='INPUT')return;const inp=l.querySelector('input');if(+inp.value===0){inp.value=Math.min(10,+inp.max);inp.dispatchEvent(new Event('input',{bubbles:true}));}};
 $('stk').onclick=e=>{const b=e.target.closest('[data-st]');if(!b)return;sticker=b.dataset.st;$('stk').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));};
 $('gsend').onclick=async()=>{const items={...giftQ},n=Object.keys(items).length;if(!n||n>NB_GIFT_KINDS)return;const to=giftTo,st=sticker;const out=await act({type:'gift',to,items,sticker:st});if(!out)return;closeSheet();
  pop(`<img class="face" src="images/nb-gift.webp" alt=""><h4>ส่งของแล้ว! ${esc(st)}</h4><p>📮 ของเข้าตู้ไปรษณีย์ของ <b style="color:#FFE08A">${esc(nameOf(to))}</b> แล้ว</p><div class="row"><button class="btn r" data-pclose>เยี่ยมเลย</button></div>`,true);};}
function recalc(){const ks=Object.keys(giftQ),k=ks.length,left=Math.max(0,NB_GIFT_DAY-(Number(V.today?.gifts?.[ME])||0));if(!$('gk'))return;
 $('gk').textContent=`📦 ${k}/${NB_GIFT_KINDS} ชนิด`;$('gk').className='pill '+(k>NB_GIFT_KINDS?'p-red':'p-gold');
 $('gsum').innerHTML=k?(k>NB_GIFT_KINDS?'<b class="c-bad">เลือกได้ไม่เกิน '+NB_GIFT_KINDS+' ชนิด</b>':ks.map(x=>esc(catBy(x)?.n||x)+'×'+fmt(giftQ[x])).join(' · ')):'แตะของที่จะส่ง';$('gsend').disabled=!k||k>NB_GIFT_KINDS||left<=0;}

/* ---------- สร้าง / เชิญ / ลงขัน ---------- */
let emblem=NB_EMBLEMS[0];
function openCreate(){sheet('create',head('<img src="images/nb-home.webp" alt="">','สร้างเนเบอร์ฮูด')+`<label class="fld" for="nbname">🪧 ชื่อ<input id="nbname" maxlength="20" placeholder="ตั้งชื่อบ้านของทีม"></label>
 <div class="embs" id="embs">${NB_EMBLEMS.map(k=>`<button aria-pressed="${k===emblem}" data-emb="${k}" aria-label="${k}"><img src="images/nb-emb-${k}.webp" alt=""></button>`).join('')}</div>
 <div class="sec">👥 สมาชิก <span class="pill p-gold">${NB_MIN}–${NB_MAX} คน</span></div><p style="font-size:.74rem;color:var(--soft);margin:.1rem 0">สร้างแล้วเชิญเพื่อน · ช่วยกันลงขัน · ยื่นให้ยัยหนูอนุมัติ</p>
 <div class="sec">🤝 ของที่ต้องลงขัน (รวมทั้งทีม)</div>${NB_COST.map(([k,,q])=>{const c=catBy(k);return `<div class="mat"><img src="images/${esc(c?.i||'')}" alt="">${esc(c?.n||k)}<span class="grow"></span><small>${fmt(q)}</small></div>`;}).join('')}
 <div class="row" style="justify-content:flex-end"><button class="btn y" id="bMake">🏗️ สร้างเลย</button></div>`);
 $('embs').onclick=e=>{const b=e.target.closest('[data-emb]');if(!b)return;emblem=b.dataset.emb;$('embs').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));};
 $('bMake').onclick=async()=>{const name=$('nbname').value.trim();if(name.length<2)return toast('nb-home','ตั้งชื่ออย่างน้อย 2 ตัวอักษร',true);if(await act({type:'create',name,emblem})){closeSheet();toast('nb-home','🏗️ สร้างแล้ว! เชิญเพื่อนและลงขันกันเลย');}};}
function openInvites(){sheet('invites',head('<img src="images/nb-invite.webp" alt="">','คำเชิญ')+(V.invites.length?V.invites.map(x=>`<div class="pick"><img src="images/nb-emb-${esc(x.emblem||'pumpkin')}.webp" alt="" style="width:2.4rem"><b>${esc(x.name)}<small style="display:block;color:var(--soft);font-weight:600">จาก ${esc(x.from)}</small></b><button class="btn g" data-acc="${esc(x.nb)}">เข้าร่วม</button><button class="btn gray" data-dec="${esc(x.nb)}">ปฏิเสธ</button></div>`).join(''):'<div class="empty">ยังไม่มีคำเชิญ · ลองสร้างเองเลย!</div>'));
 $('sheet').querySelectorAll('[data-acc]').forEach(b=>b.onclick=async()=>{if(await act({type:'accept',nb:b.dataset.acc})){closeSheet();pop('<img class="face" src="images/nb-home.webp" alt=""><h4>🏘️ เข้าร่วมแล้ว!</h4><p>ยินดีต้อนรับเพื่อนบ้านใหม่</p><div class="row"><button class="btn y" data-pclose>เยี่ยมเลย</button></div>',true);}});
 $('sheet').querySelectorAll('[data-dec]').forEach(b=>b.onclick=async()=>{if(await act({type:'decline',nb:b.dataset.dec}))openInvites();});}
async function openInvitePicker(){sheet('picker',head('<img src="images/nb-invite.webp" alt="">','เชิญเพื่อนบ้าน')+'<div class="empty">กำลังโหลดรายชื่อ…</div>');let rows=[];try{rows=(await H.roster()).filter(p=>!p.admin&&p.uid!==ME&&!(V.nb?.members||[]).includes(p.uid));}catch(e){toast('nb-lock',esc(e.message),true);return;}
 let q='';const draw=()=>{const inv=V.nb?.invites||[],list=rows.filter(p=>!q||String(p.name).includes(q));$('plist').innerHTML=list.map((p,i)=>`<div class="pick"><span class="av" style="background:${COL[i%COL.length]}">${esc([...String(p.name)][0]||'?')}</span><b>${esc(p.name)}</b>${inv.includes(p.uid)?`<button class="btn gray" data-un="${esc(p.uid)}">ยกเลิกเชิญ</button>`:`<button class="btn r" data-to="${esc(p.uid)}"><img src="images/nb-invite.webp" alt="">เชิญ</button>`}</div>`).join('')||'<div class="empty">ไม่พบชื่อนี้</div>';
  $('plist').querySelectorAll('[data-to]').forEach(b=>b.onclick=async()=>{if(await act({type:'invite',to:b.dataset.to})){toast('nb-invite','💌 ส่งคำเชิญแล้ว');draw();}});
  $('plist').querySelectorAll('[data-un]').forEach(b=>b.onclick=async()=>{if(await act({type:'uninvite',to:b.dataset.un}))draw();});};
 sheet('picker',head('<img src="images/nb-invite.webp" alt="">','เชิญเพื่อนบ้าน','<span class="pill p-gold">👥 '+(V.nb?.members||[]).length+'/'+NB_MAX+'</span>')+'<div class="srch">🔍<input id="pq" placeholder="ค้นหาชื่อผู้เล่น"></div><div id="plist"></div>');
 $('pq').oninput=e=>{q=e.target.value.trim();draw();};draw();}
function openMats(){const nb=V.nb,g=game(),mine=nb.contrib?.[ME]||{};
 sheet('mats',head('<span style="font-size:1.8rem">🤝</span>','ลงขันสร้างบ้าน')+costLeft(nb.pool).map(([k,path,q,left])=>{const c=catBy(k),have=bagGet(g,path),n=Math.min(left,have);
  return `<div class="mat${left?'':' ok'}"><img src="images/${esc(c?.i||'')}" alt=""><div class="mid">${esc(c?.n||k)} <small>· ฉันลง ${fmt(mine[k]||0)} · มี ${fmt(have)}</small><div class="trk"><i style="width:${(q-left)/q*100}%"></i></div></div><small>${left?'':'✅ '}${fmt(q-left)}/${fmt(q)}</small><button class="give" data-give="${esc(k)}" data-n="${n}" ${n>0?'':'disabled'}>${left?'+'+fmt(n):'ครบ'}</button></div>`;}).join('')
  +'<p style="font-size:.7rem;color:var(--soft);text-align:center">💡 กดแล้วลงเท่าที่ยังขาด (ไม่เกินที่มี) · ยุบหรือออกก่อนอนุมัติ ได้ของคืนครบ</p>');
 $('sheet').querySelectorAll('[data-give]').forEach(b=>b.onclick=async()=>{const out=await act({type:'contribute',item:b.dataset.give,qty:+b.dataset.n});if(out?.given){toast('nb-home','🤝 ลงขัน '+esc(catBy(out.given.item)?.n||'')+' ×'+fmt(out.given.qty));openMats();}});}

/* ---------- ป๊อปอัป / แจ้งเตือน ---------- */
function pop(html,confetti){const p=$('pop');p.innerHTML=html;p.classList.add('on');if(confetti)for(let i=0;i<18;i++){const c=document.createElement('span');c.className='conf';c.textContent=['✨','🎉','💛','⭐'][i%4];c.style.left=Math.random()*100+'%';c.style.animationDelay=Math.random()*.6+'s';p.append(c);}}
function confirmPop(title,msg,fn){pop(`<img class="face" src="images/nb-home.webp" alt=""><h4>${title}</h4><p>${msg}</p><div class="row"><button class="btn gray" data-pclose>ยกเลิก</button><button class="btn y" id="pYes">ยืนยัน</button></div>`);$('pYes').onclick=async()=>{$('pop').classList.remove('on');await fn();};}
let tt;function toast(img,html,bad){document.querySelector('.toast')?.remove();const d=document.createElement('div');d.className='toast'+(bad?' bad':'');d.innerHTML=`<img src="images/${img}.webp" alt="">${html}`;document.body.append(d);requestAnimationFrame(()=>d.classList.add('on'));clearTimeout(tt);tt=setTimeout(()=>{d.classList.remove('on');setTimeout(()=>d.remove(),300);},2600);}
document.addEventListener('click',e=>{
 const o=e.target.closest('[data-open]');if(o){openSheet(o.dataset.open);return;}
 const g=e.target.closest('[data-gift]');if(g&&!g.disabled){openGift(g.dataset.gift);return;}
 if(e.target.closest('[data-close]'))closeSheet();
 if(e.target.closest('[data-pclose]'))$('pop').classList.remove('on');
});
fit();render();act({type:'status'});
setInterval(()=>{if(!document.hidden&&!busy&&!H.watchNb)act({type:'status'},true);},60000);
