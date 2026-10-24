/* fix19 🌳👻 ศึกต้นไม้ผี — หน้าเกม (ข้อมูลจริงจากเซิร์ฟเวอร์ · หน้าเว็บไม่ตัดสินแต้มเอง)
   ฟัง world/treeWar + world/tw-{บ้าน} · ขวาน/ค้างคาว/แผงแอดมิน ส่งผ่านคลาวด์ treeWarActionCloud */
import {TW_TH,TW_CROP,twStage,twHouseScore,twRank,twBatLogic,twRng,TW_BAT_MS,TW_BAT_LIFE,TW_BAT_ITEMS,TW_BAT_AXE,TW_AXES,TW_CATS} from './tree-engine.js?v=ss3-fix19';
const H=parent.__HOST;if(!H)throw new Error('กรุณาเข้าเกมจากหน้าล็อกอิน');
const $=id=>document.getElementById(id),fmt=n=>Math.round(Number(n)||0).toLocaleString('en-US');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const now=()=>H.serverNow?H.serverNow():Date.now(),ME=H.uid;
const PLOT=[106,337,553,768,984,1201,1415].map(x=>x/1536),BASEY=.733;
const TINFO=[[388,414,410],[368,419,414],[360,397,392],[358,391,384],[372,392,388],[364,409,400],[358,397,393]];
const treeSrc=(t,s)=>'images/tw-t'+t+'-'+String(s+1).padStart(2,'0')+'.webp';
const CAT=[['veg','🥬','ผัก'],['fish','🎣','ปลา'],['pet','🐾','สัตว์'],['honey','🐷','น้ำผึ้ง'],['cook','👩‍🍳','อาหาร']];
const AXN={w:['ขวานไม้','axeW'],s:['ขวานเงิน','axeS'],g:['ขวานทองต้องสาป','axeG']};
const emb=e=>'images/nb-emb-'+esc(e||'pumpkin')+'.webp';
let st=null,houses={},HD={},myNb=null,axes={},watchKey='',stops=[],els={},shown={},lastScore={},W=0,HH=0,busy=false;
const cloud=input=>H.cloudRaw('treewar',input);
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2600);}
/* ---------- ข้อมูล ---------- */
const view=()=>{const r=st?.round;if(r)return {mode:'play',id:r.id,houses:r.houses,names:r.names,end:r.end};const l=st?.last;if(l)return {mode:'break',id:l.id,houses:l.houses,names:l.names,last:l};return {mode:'off',houses:{}};};
const hdoc=nb=>{const h=HD[nb],v=view();return h&&h.round===(v.mode==='play'?v.id:v.last?.id)?h:{pts:{},n:{},cut:0,peak:0,at:0,chops:[]};};
const scoreOf=nb=>{const v=view();if(v.mode==='break'&&!HD[nb]){const r=v.last.ranks.find(x=>x.nb===nb);return r?r.score:0;}return twHouseScore(hdoc(nb));};
const peakOf=nb=>Math.max(hdoc(nb).peak||0,view().mode==='break'?(view().last.ranks.find(x=>x.nb===nb)?.peak||0):0);
const TH=()=>Array.isArray(st?.th)&&st.th.length===12?st.th:TW_TH;
/* แต้มที่แสดง = แต้มจริง + ส่วนที่ขวานยังฟันไม่ครบ 30 วินาที (ภาพเท่านั้น) */
const chopLeft=nb=>(hdoc(nb).chops||[]).reduce((a,c)=>{const p=(now()-c.at)/30000;return a+(p<1&&p>=0?Math.ceil((c.n||0)*(1-p)):0);},0);
const shownScore=nb=>scoreOf(nb)+chopLeft(nb);
function order(){const v=view();if(v.mode==='break'&&v.last?.ranks)return v.last.ranks.map(r=>r.nb).filter(nb=>v.houses[nb]);
 return twRank(Object.keys(v.houses).map(nb=>({nb,score:scoreOf(nb),at:hdoc(nb).at||0}))).map(r=>r.nb);}
function watch(){const v=view(),key=Object.keys(v.houses).sort().join(',');if(key===watchKey)return;watchKey=key;stops.forEach(f=>f());stops=[];
 for(const nb of Object.keys(v.houses))stops.push(H.watchWorld('tw-'+nb,d=>{const before=HD[nb];HD[nb]=d;onHouse(nb,before,d);}));}
H.watchWorld('treeWar',d=>{const prevId=view().id;st=d;watch();build();if(view().id!==prevId)status();render();renderAdminIfOpen();batCheck();});
async function status(){try{const r=await cloud({type:'status'});axes=r?.me?.axes||{};myNb=r?.me?.nb||null;renderAxes();render();}catch(e){}}
status();
/* ---------- ฉาก ---------- */
const scene=$('scene'),world=$('world');
function build(){const v=view(),key=v.id+'|'+Object.entries(v.houses).map(([nb,h])=>nb+':'+h.tree+':'+h.slot).join(',');if(build.key===key)return;build.key=key;
 for(const e of Object.values(els)){e.treeEl.remove();e.lbl.remove();}els={};shown={};lastScore={};
 Object.entries(v.houses).forEach(([nb,h],i)=>{const treeEl=document.createElement('div');treeEl.className='tree';treeEl.innerHTML='<img alt=""><img class="next" alt="">';world.appendChild(treeEl);
  const lbl=document.createElement('div');lbl.className='lbl';world.appendChild(lbl);els[nb]={treeEl,lbl,slot:Number.isInteger(h.slot)?h.slot%7:i%7,treeIdx:Number.isInteger(h.tree)?h.tree%7:i%7};});
 layoutFix();if(!build.scrolled&&myNbOf()){build.scrolled=true;setTimeout(()=>focus(myNbOf()),80);}}
function layoutFix(){HH=scene.clientHeight;W=Math.round(HH*1.5);world.style.width=W+'px';
 for(const e of Object.values(els)){const [tw,th,by]=TINFO[e.treeIdx]||TINFO[0],cw=W*.17,sc=cw/tw;
  e.treeEl.style.width=cw+'px';e.treeEl.style.height=th*sc+'px';e.treeEl.style.left=(PLOT[e.slot]*W-cw/2)+'px';e.treeEl.style.top=(BASEY*HH-by*sc)+'px';
  e.lbl.style.left=PLOT[e.slot]*W+'px';e.lbl.style.top=(.795*HH)+'px';e.lbl.style.width=(W*.138)+'px';}}
addEventListener('resize',()=>{layoutFix();});
const myNbOf=()=>{const v=view();if(myNb&&v.houses[myNb])return myNb;return Object.keys(v.houses).find(nb=>(v.houses[nb].m||[]).includes(ME))||null;};
function focus(nb){const e=els[nb];if(e)scene.scrollLeft=PLOT[e.slot]*W-scene.clientWidth/2;}
function setTree(nb,stage,anim){const e=els[nb];if(!e)return;const imgs=e.treeEl.querySelectorAll('img'),src=treeSrc(e.treeIdx,stage);
 if(!anim){imgs[0].src=src;imgs[1].src=src;return;}imgs[1].src=src;e.treeEl.classList.remove('grow','up');void e.treeEl.offsetWidth;e.treeEl.classList.add('grow','up');setTimeout(()=>{imgs[0].src=src;e.treeEl.classList.remove('grow');},950);}
function float(nb,txt,neg){const e=els[nb];if(!e)return;const f=document.createElement('div');f.className='fpt'+(neg?' neg':'');f.textContent=txt;f.style.left=(PLOT[e.slot]*W+(Math.random()*40-20))+'px';f.style.top=(BASEY*HH-60-Math.random()*80)+'px';world.appendChild(f);setTimeout(()=>f.remove(),1300);}
function onHouse(nb,before,after){const v=view();if(v.mode!=='play'||!after||after.round!==v.id){render();return;}
 const s=twHouseScore(after),o=lastScore[nb];if(o!==undefined&&s>o)float(nb,'+'+fmt(s-o));lastScore[nb]=s;
 for(const c of after.chops||[]){const id=nb+':'+c.at;if(chopSeen.has(id))continue;chopSeen.add(id);if(now()-c.at<30000)chop(nb,c);}render();}
function render(){const v=view(),th=TH(),o=order(),mine=myNbOf();
 $('ranks').innerHTML=o.map((nb,r)=>{const h=v.houses[nb];return '<button class="rk'+(r===0&&scoreOf(nb)>0?' r1':'')+(nb===mine?' me':'')+'" data-k="'+esc(nb)+'"><i>'+(r===0&&scoreOf(nb)>0?'👑':r+1)+'</i><img src="'+emb(h.em)+'" alt="">'+esc(String(h.n).slice(0,10))+' <b>'+fmt(shownScore(nb))+'</b></button>';}).join('');
 for(const nb of Object.keys(els)){const h=v.houses[nb],e=els[nb],r=o.indexOf(nb),pk=peakOf(nb),s=twStage(pk,th);
  if(shown[nb]===undefined){shown[nb]=s;setTree(nb,s,false);}else if(s>shown[nb]){shown[nb]=s;setTree(nb,s,true);}else if(s<shown[nb]){shown[nb]=s;setTree(nb,s,false);}
  const nx=s<11?th[s+1]:null,pct=nx?Math.min(100,Math.max(0,(pk-th[s])/(nx-th[s])*100)):100,top=r===0&&scoreOf(nb)>0;
  e.lbl.className='lbl'+(top?' r1':'')+(nb===mine?' me':'');
  e.lbl.innerHTML='<div class="nm"><span class="rkb">'+(top?'👑':'#'+(r+1))+'</span><img src="'+emb(h.em)+'" alt=""><span>'+esc(h.n)+'</span></div><div class="sc">'+fmt(shownScore(nb))+'</div><div class="bar"><span style="width:'+pct+'%"></span></div><div class="nx">ขั้น '+(s+1)+'/12'+(nx?' · อีก '+fmt(nx-pk)+' โต':' · สูงสุด!')+'</div><button data-m="'+esc(nb)+'">👥 สมาชิก</button>';}
 const brk=$('brk');let t='';
 if(v.mode==='off')t='<b>🌙 ศึกต้นไม้ผียังไม่เปิด</b>รอแอดมินประกาศเริ่มศึกนะ';
 else if(v.mode==='break'){const l=v.last,w=l.winner?l.houses[l.winner]:null,nx=nextStart();t='<b>☕ พักเบรก</b>'+(l.cancelled?'รอบนี้ถูกยกเลิก':w?'🏆 '+esc(w.n)+' ชนะรอบที่แล้ว':'รอบที่แล้วไม่มีบ้านชนะ')+(st?.on&&nx?'<br>รอบใหม่เริ่ม '+hm(nx)+' น.':st?.on?'':'<br>ศึกปิดอยู่');}
 brk.innerHTML=t;brk.classList.toggle('on',!!t);
 if(v.mode==='off'&&!Object.keys(els).length)$('ranks').innerHTML='';
 $('bAdmin').hidden=!H.isAdmin?.();
 $('hint').textContent=v.mode==='play'?(Object.values(axes).some(n=>n>0)?'แตะขวานเพื่อตัดต้นไม้บ้านอื่น':'เก็บผัก ตกปลา ทำอาหาร ดูแลสัตว์ = ต้นไม้บ้านคุณโต'):'';}
const hm=t=>{const d=new Date(t+7*3600000);return String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0');};
function nextStart(){const t=now()+7*3600000,d0=Math.floor(t/864e5)*864e5,h=(t-d0)/3600000;const s=h<1?d0+3600000:h<13?d0+13*3600000:d0+25*3600000;return Math.max(s-7*3600000,st?.from||0);}
$('ranks').onclick=e=>{const b=e.target.closest('.rk');if(b)focus(b.dataset.k);};
world.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(b)members(b.dataset.m);});
/* นาฬิการอบ */
setInterval(()=>{const v=view();let a='',b='';
 if(v.mode==='play'){a=(v.id.endsWith('A')?'รอบเช้า':v.id.endsWith('B')?'รอบบ่าย':'รอบพิเศษ')+' · ปิด '+hm(v.end);const left=Math.max(0,v.end-now())/1000;b=Math.floor(left/3600)+':'+String(Math.floor(left%3600/60)).padStart(2,'0')+':'+String(Math.floor(left%60)).padStart(2,'0');}
 else if(v.mode==='break'){a='พักเบรก';b=st?.on?'เริ่ม '+hm(nextStart()):'ปิดอยู่';}else{a='ศึกต้นไม้ผี';b='ยังไม่เปิด';}
 $('rname').textContent=a;$('rtime').textContent=b;
 if(v.mode==='play'&&Object.values(HD).some(h=>(h?.chops||[]).some(c=>now()-c.at<31000)))render();},1000);
/* ---------- สมาชิก ---------- */
function sheet(html){$('sb').innerHTML=html;$('veil').classList.add('on');$('sheet').classList.add('on');$('sheet').scrollTop=0;}
function close(){$('veil').classList.remove('on');$('sheet').classList.remove('on');sheet.admin=false;sheet.dirty=false;}
$('sx').onclick=close;$('veil').onclick=close;
const sum=c=>Object.values(c||{}).reduce((a,n)=>a+(Number(n)||0),0);
function members(nb){const v=view(),h=v.houses[nb],d=hdoc(nb),ids=[...new Set([...(h.m||[]),...Object.keys(d.pts||{})])];
 const rows=ids.map(u=>({u,n:d.n?.[u]||v.names?.[u]||'ผู้เล่น',c:d.pts?.[u]||{},locked:(h.m||[]).includes(u)})).sort((a,b)=>sum(b.c)-sum(a.c));
 sheet('<h3><img src="'+emb(h.em)+'" alt="" style="width:1.4rem;vertical-align:-.25rem"> '+esc(h.n)+'</h3><div style="font-size:.72rem;color:var(--soft);margin-bottom:.3rem">แต้มรอบนี้ของสมาชิกแต่ละคน รวมกันเป็นแต้มของบ้าน</div>'+
  rows.map((m,i)=>'<div class="mem"><span class="badge">'+(i+1)+'</span><span class="n">'+esc(m.n)+(m.u===ME?' (คุณ)':'')+(m.locked?'':' <span class="badge">· ย้ายเข้ากลางรอบ (ไม่ได้รางวัลรอบนี้)</span>')+'</span><span class="t">'+fmt(sum(m.c))+'</span><div class="cats">'+CAT.map(([c,e,t])=>'<span>'+e+' '+t+' '+fmt(m.c[c])+'</span>').join('')+'</div></div>').join('')+
  (d.cut?'<div class="mem cut"><span>🪓</span><span class="n">โดนตัด</span><span class="t">−'+fmt(d.cut)+'</span></div>':'')+'<div class="sum"><span>รวมแต้มบ้าน</span><span style="color:var(--gold)">'+fmt(scoreOf(nb))+'</span></div>');}
/* ---------- กติกา ---------- */
function rules(){const th=TH(),mul=st?.mul||{};
 return {'แต้ม':'<div class="tsc"><table><tr><th>กิจกรรม</th><th></th><th style="text-align:right">แต้ม</th></tr>'+
 [['🥬 ผักบุ้ง · ผักกาด','ต่อแปลง','1'],['🥬 ถั่วลันเตา มะม่วง แครอท พริก ข้าวโพด','','2'],['🥬 มันฝรั่ง ฟักทอง แตงกวา มะเขือเทศ กะหล่ำ ลิ้นจี่','','3'],['🥬 สตรอว์เบอร์รี · แตงโม','','4'],['🥬 องุ่น · กล้วย','','5'],['🥬 มะยม · เห็ด','','6'],['🥬 เมลอน','','7'],['🥬 ไผ่','','8'],['🥬 แพลงก์ตอน','','10'],['🔥 ผักเด่นประจำชั่วโมง (3 ชนิด)','','×1.5'],['🍰 ใช้เค้ก/มะพร้าวเร่งโต','40%','1–4'],['🪽 ปีกนางฟ้า','','เท่าปกติ'],['🎣 ปลาระดับ 1 · 2 · 3 (บ่อธรรมดา)','ต่อตัว','2 · 4 · 7'],['🎣 ใช้เหยื่อวิเศษ','','ครึ่งหนึ่ง'],['🐾 ทุก 2,000 กุศลจากสัตว์','ครั้งละ ≤10','1'],['🐷 ส่งของน้องน้ำผึ้ง (อารมณ์ดี/บูด)','','3 (6/1)'],['👩‍🍳 คราฟอาหารสำเร็จ ง่าย→หรู','ต่อจาน','1 · 2 · 4 · 6 · 10']].map(r=>'<tr><td>'+r[0]+'</td><td style="color:var(--soft)">'+r[1]+'</td><td class="n">'+r[2]+'</td></tr>').join('')+'</table></div>'+
 (TW_CATS.some(k=>(mul[k]??1)!==1)?'<p style="font-size:.72rem;color:var(--gold)">ตัวคูณตอนนี้: '+CAT.map(([c,e,t])=>e+' ×'+(mul[c]??1)).join(' · ')+'</p>':'')+
 '<p style="font-size:.7rem;color:var(--soft)">ทุกกิจกรรมได้ 1–10 แต้ม · ไม่จำกัดแต้มต่อคน · บ่อ VIP ไม่นับ · กุศลจากค้างคาวไม่นับเป็นแต้มต้นไม้</p>',
 'ต้นไม้':'<p class="rules" style="font-size:.78rem;line-height:1.6">ต้นไม้โตตามแต้มสูงสุดของบ้านในรอบนั้น โดนขวานตัดแต้มแล้วต้นไม่หดลงขั้น แต่การตัดสินแพ้ชนะใช้แต้มปัจจุบัน ทุกรอบสุ่มต้นไม้ 7 แบบให้ 7 บ้าน</p><div class="tsc"><table><tr><th>ขั้น</th>'+th.map((_,i)=>'<th>'+(i+1)+'</th>').join('')+'</tr><tr><td>แต้ม</td>'+th.map(t=>'<td class="n">'+fmt(t)+'</td>').join('')+'</tr></table></div>',
 'รอบ & รางวัล':'<div class="rules"><h4>⏰ วันละ 2 รอบ (เวลาไทย)</h4><ul><li>รอบเช้า 01:00–12:00 · รอบบ่าย 13:00–24:00</li><li>12:05 / 00:05 สรุปผล + เลือกการ์ด (ภายใน 10 นาที เด้งขึ้นทุกหน้า)</li><li>12:00–13:00 / 00:00–01:00 พักเบรก</li><li>แต้มเท่ากัน บ้านที่ถึงแต้มนั้นก่อนชนะ</li></ul><h4>👑 แผ่นป้ายกุศล (บ้านที่ชนะ คนละ 1 ใบ)</h4><ul><li>การ์ดคว่ำ 6 ใบ: 5 ล้าน · 5 ล้าน · 10 ล้าน · 10 ล้าน · 30 ล้าน · 50 ล้าน</li><li>ไม่อยู่ในเกม/ไม่เลือกใน 10 นาที = ได้ใบน้อยที่สุดอัตโนมัติ</li><li>ได้รางวัลเฉพาะคนที่อยู่บ้านตั้งแต่เริ่มรอบ (คนย้ายเข้ากลางรอบ แต้มนับให้บ้าน แต่ไม่ได้รางวัล)</li><li>กุศลส่งเข้าไปรษณีย์</li></ul></div>',
 'การ์ดแกล้ง':'<div class="rules"><p>สุ่มคนในบ้านที่ชนะ 1 คน เป็นคนเปิดการ์ดคว่ำ 1 ใน 4 ใบ ได้ใบไหนใช้ใบนั้น (10 นาที ไม่เลือก = ระบบสุ่มให้) · คนโดนรู้แค่ว่ามาจากบ้านไหน ไม่รู้ว่าใครเลือก</p><ul><li>🧺 <b>ปล้นเสบียง 3 บ้าน</b> — ทุกคนใน 3 บ้านโดนทิ้งของ 1,000–5,000 ชิ้น/คน ไม่เกินครึ่งหนึ่งของที่มีแต่ละชนิด (กล่องสุ่ม หมวกกะลาสี ขนอัลปาก้า กล่องดนตรี เหรียญฮาโลวีน แบตเตอรี่ สาก เค้ก มะพร้าว ไวน์ อุปกรณ์ตกปลา) ของในไปรษณีย์ที่ยังไม่กดรับ จะโดนเก็บต่อตอนรับเข้ากระเป๋า</li><li>🪓 <b>ตัด 1 บ้าน</b> — คนละ −10 ล้าน</li><li>💀 <b>ตัดทุกบ้านที่แพ้</b> — คนละ −3 ล้าน</li><li>🎯 <b>ตัด 4 คน</b> (เลือกจากบ้านที่แพ้) — คนละ −15 ล้าน</li></ul><p>รายชื่อบ้านล็อกตั้งแต่เริ่มรอบ · กุศลหักได้ถึง 0 · คนไม่อยู่ในเกมโดนอัตโนมัติ เห็นแจ้งเตือนตอนเข้าเกม</p></div>',
 'ค้างคาว':'<div class="rules"><p>แอดมินกดเรียก (×1 / ×2 / ×5) · เตือน 15 วินาทีทุกหน้า · เล่น 1 นาทีในหน้านี้ · ลากนิ้วฟันของที่ค้างคาวโยน (แตะเฉยๆ ไม่นับ) · กดเกิน 10 ครั้ง/วินาทีไม่นับ</p><table><tr><th>ของ</th><th style="text-align:right">กุศล ×ระดับ</th></tr><tr><td>🍬 ลูกอมส้ม</td><td class="n">+3,000</td></tr><tr><td>🍬 ลูกอมม่วง</td><td class="n">+6,000</td></tr><tr><td>✨ ลูกอมทอง</td><td class="n">+30,000</td></tr><tr><td>🤢 ลูกอมเน่า</td><td class="n">−3,000</td></tr><tr><td>🍭 อมยิ้มพิษ</td><td class="n">−6,000</td></tr><tr><td>😈 ลูกอมต้องสาป</td><td class="n">−8,000</td></tr><tr><td>🐈‍⬛ แมวดำ</td><td class="n">−5,000</td></tr><tr><td>💀 หัวกะโหลก</td><td class="n">−10,000</td></tr><tr><td>🪓 ขวานไม้ · เงิน · ทอง</td><td class="n">ตัดบ้านอื่น 5 · 10 · 20 แต้ม</td></tr></table><h4>🏅 คนเก็บกุศลได้มากที่สุด 1 คน เลือกการ์ดคว่ำ 1 ใน 3</h4><ul><li>🎁 เติมเสบียง (สุ่ม 1 อย่าง): กล่องสุ่ม 500 · สาก 1,000 · ปีกนางฟ้า 999 · มะพร้าว 999 · เค้ก 999 · ไวน์ 100 · หม้อยาแม่มด 30 · หมวกกะลาสี 999 · กล่องดนตรี 999 · เหรียญฮาโลวีน 199</li><li>🛡️ โล่: เก็บไว้ = บ้านคุณแพ้รอบนี้จ่ายแค่ 50% · ทิ้ง = รับ +2,000,000</li><li>💰 +15,000,000 กุศล</li></ul><p>🪓 ใช้ขวาน: ต้นไม้บ้านนั้นโดนฟันต่อเนื่อง 30 วินาที ทุกคนเห็น · ขวานใช้ได้เฉพาะรอบที่เก็บ · ตัดบ้านตัวเองไม่ได้ · แต้มบ้านไม่ต่ำกว่า 0 · ไม่บอกชื่อคนตัด · ถ้ารอบไหนแอดมินไม่เรียกค้างคาว จะไม่มีขวานและการ์ดเซอร์ไพรส์</p></div>'};}
$('bRules').onclick=()=>{const R=rules();sheet('<h3>📜 กติกาศึกต้นไม้ผี</h3><div class="tabs" id="tb">'+Object.keys(R).map((k,i)=>'<button class="'+(i?'':'on')+'">'+k+'</button>').join('')+'</div><div id="tc">'+R['แต้ม']+'</div>');
 $('tb').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('tb').querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');$('tc').innerHTML=rules()[b.textContent];});};
/* ---------- ขวาน ---------- */
function renderAxes(){const v=view();$('axes').innerHTML=v.mode!=='play'?'':['w','s','g'].filter(k=>axes[k]>0).map(k=>'<button class="axe '+k+'" data-a="'+k+'" aria-label="'+AXN[k][0]+' ตัด '+TW_AXES[k]+' แต้ม"><img src="images/tw-'+AXN[k][1]+'.webp" alt=""><b>×'+axes[k]+'</b></button>').join('');}
$('axes').onclick=e=>{const b=e.target.closest('[data-a]');if(b)useAxe(b.dataset.a);};
function useAxe(k){const v=view(),mine=myNbOf();if(v.mode!=='play')return;
 sheet('<h3>🪓 '+AXN[k][0]+' · ตัด '+TW_AXES[k]+' แต้ม</h3><div style="font-size:.75rem;color:var(--soft);margin-bottom:.4rem">เลือกบ้านที่จะตัด (บ้านตัวเองตัดไม่ได้) · บ้านนั้นไม่รู้ว่าใครตัด</div><div class="pick">'+order().filter(nb=>nb!==mine).map(nb=>'<button data-k="'+esc(nb)+'"><img src="'+emb(v.houses[nb].em)+'" alt=""><span>'+esc(v.houses[nb].n)+'<b>'+fmt(scoreOf(nb))+'</b></span></button>').join('')+'</div>');
 $('sb').querySelectorAll('[data-k]').forEach(b=>b.onclick=async()=>{if(busy)return;busy=true;$('sb').querySelectorAll('button').forEach(x=>x.disabled=true);
  try{const r=await cloud({type:'axe',k,nb:b.dataset.k});axes=r.axes||axes;close();renderAxes();focus(b.dataset.k);toast(r.cut?'🪓 ฟันแล้ว! −'+r.cut+' แต้ม':'ต้นนี้ไม่มีแต้มให้ตัดแล้ว');}
  catch(e){toast(e.message||'ทำรายการไม่สำเร็จ');close();status();}finally{busy=false;}});}
const chopSeen=new Set();
function chop(nb,c){const e=els[nb];if(!e)return;const kind=c.k||'w',end=c.at+30000;
 const ax=document.createElement('div');ax.className='chopaxe';ax.style.backgroundImage='url(images/tw-'+(AXN[kind]||AXN.w)[1]+'.webp)';world.appendChild(ax);
 const cd=document.createElement('div');cd.className='chopcd';world.appendChild(cd);
 const place=()=>{ax.style.left=(PLOT[e.slot]*W+W*.03)+'px';ax.style.top=(BASEY*HH-HH*.16)+'px';cd.style.left=PLOT[e.slot]*W+'px';cd.style.top=(BASEY*HH-HH*.36)+'px';};place();
 const hit=()=>{const left=end-now();if(left<=0){clearInterval(t);ax.remove();cd.remove();render();return;}
  e.treeEl.classList.remove('shake');void e.treeEl.offsetWidth;e.treeEl.classList.add('shake');ax.classList.remove('swing');void ax.offsetWidth;ax.classList.add('swing');
  const fx=document.createElement('div');fx.className='chopfx';fx.style.backgroundImage='url(images/tw-chopFx.webp)';fx.style.left=(PLOT[e.slot]*W+W*.03)+'px';fx.style.top=(BASEY*HH-HH*.08)+'px';world.appendChild(fx);setTimeout(()=>fx.remove(),520);
  const ch=document.createElement('div');ch.className='chips';ch.style.left=PLOT[e.slot]*W+'px';ch.style.top=(BASEY*HH-50)+'px';ch.innerHTML=Array.from({length:8},()=>'<i style="--dx:'+(Math.random()*120-60)+'px;--dy:'+(Math.random()*80-70)+'px"></i>').join('');world.appendChild(ch);setTimeout(()=>ch.remove(),800);
  place();cd.textContent='🪓 กำลังโดนฟัน '+Math.ceil(left/1000)+' วิ';render();};
 setTimeout(hit,300);const t=setInterval(hit,1500);}
/* ---------- 🦇 ค้างคาวขนลูกอม ---------- */
const bat=$('bat');let BG=null,batDone=new Set();
function batCheck(){const b=st?.bat;if(!b||b.settled||BG?.id===b.id||batDone.has(b.id))return;if(now()>b.end)return;batOpen(b);}
setInterval(batCheck,1000);
function batOpen(b){BG={id:b.id,b,hits:[],score:0,got:{w:0,s:0,g:0},used:new Set(),list:twBatLogic(b.seed),obs:new Map(),trail:[],down:false,sent:false};
 bat.classList.add('on');bat.innerHTML='<canvas id="trail" style="position:absolute;inset:0;width:100%;height:100%;z-index:5;pointer-events:none"></canvas><div class="bghud"><span>🦇 ×'+b.lvl+'</span><span>กุศล <b id="bs">0</b></span><span>⏳ <b id="bt">60</b></span></div><div class="warn" id="bwarn"><h3>🦇 ค้างคาวขนลูกอมกำลังมา!</h3><div class="cd" id="wcd">15</div><small>ลากนิ้วฟันลูกอม · อย่าฟันแมวดำ หัวกะโหลก ลูกอมเน่า อมยิ้มพิษ ลูกอมต้องสาป<br>🪓 ฟันขวานไว้ตัดต้นไม้บ้านอื่น</small></div>';
 const R=bat.getBoundingClientRect(),cv=$('trail'),dpr=devicePixelRatio||1;cv.width=R.width*dpr;cv.height=R.height*dpr;const cx=cv.getContext('2d');cx.scale(dpr,dpr);BG.w=R.width;BG.h=R.height;BG.cx=cx;
 /* ตำแหน่งบนจอ (หน้าเว็บเท่านั้น) สุ่มจากสายแยก ไม่กระทบรายการของ */
 const g=twRng((b.seed^0x5bd1e995)|0);BG.bats=[0,1,2].map(i=>({el:mk('',74,50),ph:g()*6.28,sp:.45+g()*.35,y:52+i*38}));
 for(const x of BG.list){x.vx=(g()-.5)*90;x.vy=-(60+g()*140);x.vr=(g()-.5)*360;x.sz=x.k==='candyG'?60:x.k.startsWith('axe')?54:52;}
 const pt=e=>{const r=bat.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top,t:performance.now()};};
 bat.onpointerdown=e=>{e.preventDefault();BG.down=true;BG.trail=[pt(e)];try{bat.setPointerCapture(e.pointerId);}catch(_){}};
 bat.onpointermove=e=>{if(!BG||!BG.down)return;const p=pt(e),q=BG.trail[BG.trail.length-1];BG.trail.push(p);if(BG.trail.length>14)BG.trail.shift();
  if(Math.hypot(p.x-q.x,p.y-q.y)<4)return;/* ต้องลากจริง แตะเฉยๆ ไม่นับ */
  const el=now()-BG.b.start;if(el<0||el>TW_BAT_MS+500)return;
  for(const [id,o]of BG.obs){if(o.dead)continue;if(segDist(q,p,o.x+o.sz/2,o.y+o.sz/2)<o.sz*.45)slash(o,Math.atan2(p.y-q.y,p.x-q.x),el);}};
 bat.onpointerup=bat.onpointercancel=()=>{if(BG)BG.down=false;};
 requestAnimationFrame(loop);}
function mk(img,w,h){const el=document.createElement('div');el.className='ob';el.style.width=w+'px';el.style.height=h+'px';if(img)el.style.backgroundImage='url(images/tw-'+img+'.webp)';bat.appendChild(el);return el;}
const IMG={candyO:'candyO',candyP:'candyP',candyG:'candyG',rotten:'rotten',poison:'poison',cursed:'cursed',cat:'cat',skull:'skull',axeW:'axeW',axeS:'axeS',axeG:'axeG'};
function batX(i,t){const b=BG.bats[i];return (BG.w-74)*(.5+.45*Math.sin(t/1000*b.sp*2+b.ph));}
function loop(){if(!BG)return;const t=now(),el=t-BG.b.start,left=Math.max(0,BG.b.end-t);
 const w=$('bwarn');if(el<0){if(w)$('wcd').textContent=Math.ceil(-el/1000);}else if(w)w.remove();
 $('bt').textContent=Math.ceil(Math.min(TW_BAT_MS,left)/1000);
 BG.bats.forEach((b,i)=>{const x=batX(i,Math.max(0,el)),f=Math.floor(t/120)%2;b.el.style.backgroundImage='url(images/tw-'+(f?'bat1':'bat2')+'.webp)';b.el.style.transform='translate('+x+'px,'+b.y+'px)';});
 if(el>=0)for(const x of BG.list){if(BG.used.has(x.id))continue;const dt=(el-x.t0)/1000;let o=BG.obs.get(x.id);
  if(dt<0||dt>TW_BAT_LIFE/1000){if(o){o.el.remove();BG.obs.delete(x.id);}continue;}
  if(!o){o={x0:batX(x.b,x.t0)+10,y0:BG.bats[x.b].y+30,it:x,sz:x.sz,el:mk(IMG[x.k],x.sz,x.sz)};BG.obs.set(x.id,o);}
  o.x=o.x0+x.vx*dt;o.y=o.y0+x.vy*dt+130*dt*dt;if(o.y>BG.h+60){o.el.remove();BG.obs.delete(x.id);BG.used.add(x.id);continue;}
  o.el.style.transform='translate('+o.x+'px,'+o.y+'px) rotate('+(x.vr*dt)+'deg)';}
 const cx=BG.cx,pn=performance.now();cx.clearRect(0,0,BG.w,BG.h);const tr=BG.trail.filter(p=>pn-p.t<160);BG.trail=tr;
 if(tr.length>1){cx.lineCap='round';for(let k=1;k<tr.length;k++){const a=k/tr.length;cx.strokeStyle='rgba(255,236,170,'+a+')';cx.shadowColor='#FFB84D';cx.shadowBlur=14;cx.lineWidth=2+7*a;cx.beginPath();cx.moveTo(tr[k-1].x,tr[k-1].y);cx.lineTo(tr[k].x,tr[k].y);cx.stroke();}}
 if(el>TW_BAT_MS+300){batEnd();return;}requestAnimationFrame(loop);}
function segDist(a,b,x,y){const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy||1;let t=((x-a.x)*dx+(y-a.y)*dy)/l;t=Math.max(0,Math.min(1,t));return Math.hypot(a.x+t*dx-x,a.y+t*dy-y);}
function slash(o,ang,el){o.dead=true;const x=o.it;BG.used.add(x.id);BG.obs.delete(x.id);
 /* กันกดถี่เกิน 10 ครั้ง/วินาที (เซิร์ฟเวอร์ก็ไม่นับ) */
 BG.win=(BG.win||[]).filter(t=>el-t<1000);if(BG.win.length>=10){o.el.remove();return;}BG.win.push(el);
 BG.hits.push([x.id,Math.round(el)]);let txt;const ax=TW_BAT_AXE[x.k];
 if(ax){BG.got[ax]++;txt='🪓 +1';}else{const v=x.v*BG.b.lvl;BG.score+=v;txt=(v>0?'+':'−')+fmt(Math.abs(v));}
 $('bs').textContent=fmt(BG.score);
 [-1,1].forEach(side=>{const h=o.el.cloneNode(true);h.style.clipPath=side<0?'inset(0 50% 0 0)':'inset(0 0 0 50%)';h.style.transition='transform .7s ease-in, opacity .7s';bat.appendChild(h);
  requestAnimationFrame(()=>{h.style.transform='translate('+(o.x+side*38)+'px,'+(o.y+70)+'px) rotate('+(side*70)+'deg)';h.style.opacity=0;});setTimeout(()=>h.remove(),720);});o.el.remove();
 const p=mk('slashFx',80,80);p.style.transform='translate('+(o.x-14)+'px,'+(o.y-14)+'px) rotate('+(ang*57+45)+'deg)';p.style.transition='opacity .45s';setTimeout(()=>p.style.opacity=0,80);setTimeout(()=>p.remove(),500);
 const f=document.createElement('div');f.className='fpt'+(x.v<0?' neg':'');f.textContent=txt;f.style.left=o.x+26+'px';f.style.top=o.y+'px';bat.appendChild(f);setTimeout(()=>f.remove(),1300);}
async function batSend(){if(!BG||BG.sent)return null;BG.sent=true;batDone.add(BG.id);const id=BG.id,hits=BG.hits.slice();
 /* คนส่งพร้อมกันมาก: ลองใหม่ได้ 4 ครั้ง เว้นเวลาสุ่ม (เซิร์ฟเวอร์กันได้กุศลซ้ำเอง) */
 let err='ส่งผลไม่สำเร็จ';for(let k=0;k<4;k++){try{return await H.cloud('treewar',{type:'batEnd',bat:id,hits});}catch(e){err=e.message||err;if(/ไปแล้ว|จบไปแล้ว/.test(err))break;await new Promise(r=>setTimeout(r,800+Math.random()*2500*(k+1)));}}
 return {error:err};}
async function batEnd(){if(!BG)return;const g=BG.got;bat.onpointerdown=bat.onpointermove=bat.onpointerup=bat.onpointercancel=null;const r=await batSend();BG=null;bat.classList.remove('on');bat.innerHTML='';
 if(r?.bat)status();
 const m=r?.bat?.merit??0,ga=g.w+g.s+g.g;
 showPop('<div style="font-size:2.2rem">🦇🍬</div><h2>จบแล้ว! '+(r?.error?'':'คุณได้ '+(m>=0?'+':'−')+fmt(Math.abs(m))+' กุศล')+'</h2><p>'+(r?.error?esc(r.error):'กุศลเข้ากระเป๋าแล้ว'+(ga?' · ได้ขวาน '+ga+' เล่ม (ใช้ได้ถึงจบรอบนี้)':''))+'</p><p>คนที่เก็บกุศลได้มากที่สุดจะได้เลือกการ์ดเซอร์ไพรส์ (ประกาศใน 2 นาที)</p><div class="row"><button class="big" id="ok">ปิด</button></div>');
 $('ok').onclick=hidePop;}
addEventListener('pagehide',()=>{if(BG&&!BG.sent&&now()>=BG.b.start)batSend();stops.forEach(f=>f());});
const pop=$('pop');function showPop(h){pop.innerHTML='<div class="pc">'+h+'</div>';pop.classList.add('on');pop.scrollTop=0;}function hidePop(){pop.classList.remove('on');pop.innerHTML='';}
/* ---------- 👑 แผงแอดมิน ---------- */
function renderAdminIfOpen(){if(sheet.admin&&!sheet.dirty)admin(true);}
function admin(keep){if(!H.isAdmin?.())return;const s=st||{},th=TH(),mul=s.mul||{},v=view(),b=s.bat;
 const state=s.round?'🟢 กำลังแข่ง '+(s.round.id||'')+' · ปิด '+hm(s.round.end)+(s.stopAfter?' · 🏁 จะหยุดหลังจบรอบนี้':''):s.on?'🟡 เปิดศึกอยู่ · รอบถัดไปเริ่ม '+hm(nextStart()):'⚪ ปิดอยู่';
 const html='<h3>👑 แผงควบคุมศึกต้นไม้ผี</h3><div class="admin"><div class="st">'+state+(b&&!b.settled?'<br>🦇 ค้างคาว ×'+b.lvl+' กำลังเล่น/รอสรุป':'')+(s.surprise&&!s.surprise.done?'<br>🎴 รอ '+esc(s.surprise.n)+' เลือกการ์ดเซอร์ไพรส์':'')+(s.last&&!s.last.done?'<br>🎴 รอเลือกการ์ดรอบ '+esc(s.last.id)+' (ถึง '+hm(s.last.until)+')':'')+'</div>'+
  (s.round?'<label>หยุดศึก <span style="display:flex;gap:.3rem"><button class="tog" data-a="after">🏁 หยุดหลังจบรอบนี้</button><button class="tog red" data-a="emergency">⛔ ปิดฉุกเฉิน</button></span></label>':
   '<label>เริ่มศึก <span style="display:flex;gap:.3rem"><button class="tog on" data-a="now">▶️ เริ่มเลย</button><button class="tog" data-a="next">⏭️ เริ่มรอบถัดไป</button></span></label>'+(s.on?'<label>ยกเลิกการเปิดรอบถัดไป <button class="tog red" data-a="off">⏹️ ปิดศึก</button></label>':''))+
  '<label>เรียกค้างคาวขนลูกอม <span style="display:flex;gap:.3rem">'+[1,2,5].map(l=>'<button class="tog" data-bat="'+l+'"'+(s.round&&!(b&&!b.settled)?'':' disabled')+'>🦇 ×'+l+'</button>').join('')+'</span></label>'+
  '<h4>แต้มต่อขั้นต้นไม้</h4>'+th.map((t,i)=>'<label>ขั้น '+(i+1)+' <input id="th'+i+'" type="number" inputmode="numeric" value="'+t+'"'+(i?'':' disabled')+'></label>').join('')+
  '<h4>ตัวคูณแต้มแต่ละหมวด</h4>'+CAT.map(([c,e,t])=>'<label>'+e+' '+t+' <input id="mul'+c+'" type="number" step="0.1" min="0" max="10" value="'+(mul[c]??1)+'"></label>').join('')+
  '<div class="row"><button class="big" id="asave">💾 บันทึกค่า</button></div><p style="font-size:.68rem;color:var(--soft)">หลังอัปเดตศึกปิดอยู่ · "เริ่มเลย" = เริ่มทันที (ถ้าอยู่ในช่วงพักจะเริ่มรอบถัดไป) · ปิดฉุกเฉิน = ยกเลิกรอบนี้ ไม่มีผู้ชนะ</p></div>';
 if(keep){const y=$('sheet').scrollTop;$('sb').innerHTML=html;$('sheet').scrollTop=y;}else sheet(html);sheet.admin=true;sheet.dirty=false;
 $('sb').querySelectorAll('input').forEach(x=>x.oninput=()=>{sheet.dirty=true;});/* กำลังแก้ตัวเลข = ไม่วาดแผงใหม่ทับ */
 $('sb').querySelectorAll('[data-a]').forEach(x=>x.onclick=async()=>{const a=x.dataset.a;if(a==='emergency'&&!confirm('ปิดฉุกเฉิน: รอบนี้ถูกยกเลิก ไม่มีบ้านชนะ แน่ใจไหม?'))return;
  try{const r=await cloud(a==='now'||a==='next'?{type:'admin-start',when:a}:{type:'admin-stop',how:a});toast(a==='now'?(r.started?'▶️ เริ่มศึกแล้ว':'⏭️ จะเริ่ม '+hm(r.from)):a==='next'?'⏭️ จะเริ่ม '+hm(r.from):a==='after'?'🏁 จะหยุดหลังจบรอบนี้':a==='off'?'⏹️ ปิดศึกแล้ว':'⛔ ปิดฉุกเฉินแล้ว');}catch(e){toast(e.message||'ไม่สำเร็จ');}});
 $('sb').querySelectorAll('[data-bat]').forEach(x=>x.onclick=async()=>{try{await cloud({type:'admin-bat',lvl:Number(x.dataset.bat)});toast('🦇 เรียกค้างคาวแล้ว! เตือนทุกหน้า 15 วินาที');close();}catch(e){toast(e.message||'ไม่สำเร็จ');}});
 $('asave').onclick=async()=>{const th2=th.map((_,i)=>Math.floor(Number($('th'+i).value)||0)),m2=Object.fromEntries(CAT.map(([c])=>[c,Number($('mul'+c).value)]));
  try{await cloud({type:'admin-config',th:th2,mul:m2});sheet.dirty=false;toast('💾 บันทึกแล้ว');}catch(e){toast(e.message||'ไม่สำเร็จ');}};}
$('bAdmin').onclick=()=>admin(false);
/* เริ่ม */
setInterval(renderAxes,5000);
