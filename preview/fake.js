/* พรีวิวนครยัยหนู — โฮสต์จำลอง: ใช้ "กติกาจริง" (city-engine / pageant-engine ชุดเดียวกับหลังบ้าน) แต่ข้อมูลอยู่ในเครื่องนี้ ไม่แตะเซิร์ฟเวอร์จริง
   ความลับ (ของชอบ/คะแนน) ในพรีวิวเป็นค่าสุ่ม ไม่ใช่ค่าจริง */
import {cityAction,cityAdmin,cityView,publicWorld,manState} from './city-engine.js';
import {pageantAdmin,pageantAction,pageantView,garland,STATES} from './pageant-engine.js';
import {MAN,MEN,PAGEANT} from './city-catalog.js';
import {OUTFITS} from '../outfit-catalog.js';
import {QUESTIONS} from './city-questions.js';
const Q=new URLSearchParams(location.search);
const ME='preview-me';const NAME=Q.get('name')||'ยัยหนู';let ADMIN=Q.get('as')!=='player';
const fnv=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;return (h>>>0)/4294967296;};
const hsec=s=>fnv('preview-secret|'+s);
let OFFSET=0;const now=()=>Date.now()+OFFSET;
/* เซฟของฉัน (มีของให้ครบสำหรับทดสอบ) */
const mkGame=(tribe,wear,extra={})=>({merit:8000000,lv:3,bag:{item:{cityfuel:40,ring:1,hat:2000,angel:2000,musicbox:2000},decor:{d_city_car_yellow:1,d_city_car_purple:1},outfit:{[wear]:1,...extra},flower:{rose:12,daisy:8,sunflower:5,tulip:6,lotus:4},food:{'ข้าวผัดไข่':6,'ซุปฟักทอง':4,'ปลาย่างซอสมะม่วง':3},crop:{mango:20,strawberry:15,corn:30,grape:9},wine:{rose:25,moon:10},forest:{wood:3000,stone:3000,rope:200,steel:100}},sub:{char:{tribe,wear},city:{}}});
const T={pink:{wear:'punk',swim:'swim',thai:'thaiR'},mint:{wear:'m01',swim:'m05',thai:'m10'},red:{wear:'r01',swim:'r05',thai:'r10'},bob:{wear:'b01',swim:'b05',thai:'b10'}};
const tribe=Q.get('tribe')||'pink';const myWear=Q.get('wear')||T[tribe].wear;
const games={[ME]:mkGame(tribe,myWear,{[T[tribe].swim]:1,[T[tribe].thai]:1,fairy:1,formal:1,cat:1})};
const world={city:{open:true,entry:{outfits:5,houseLv:2}},pageant:{state:'idle'}};
const presence={};const watchers={city:[],presence:[],pageant:[]};
const notify=k=>{for(const cb of watchers[k])try{cb(k==='city'?publicWorld(world.city,now()):k==='pageant'?world.pageant:Object.values(presence));}catch(e){console.warn(e);}};
const ctxOf=uid=>({uid,admin:uid===ME&&ADMIN,now:now(),name:uid===ME?NAME:(BOTS[uid]?.name||uid),h:hsec});
const toast=(m)=>{const t=document.getElementById('ptoast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),3200);};
const CITY_TYPES=['status','sync','enter','leave','talk','gift','date','propose','divorce','husband','talkHusband','houseUp','kid','claimReward'];
async function city(uid,input){const t=String(input.type||'');await new Promise(r=>setTimeout(r,80));
 if(t==='move'){presence[uid]={uid,name:ctxOf(uid).name,o:games[uid].sub.char.wear,x:input.x,z:input.z,tx:input.tx,tz:input.tz,exp:now()+180000};return {ok:true};}
 if(t==='bye'){delete presence[uid];notify('presence');return {ok:true};}
 if(t==='men')return {now:now(),men:Object.fromEntries(MEN.map(m=>[m.id,manState(m.id,now(),world.city).st]))};
 if(!CITY_TYPES.includes(t))throw new Error('พรีวิว: ไม่รู้จัก '+t);
 const game=games[uid];const out=cityAction(game,world.city,ctxOf(uid),input,Math.random);
 if(out.worldWrite){world.city=out.worldDoc;notify('city');}
 for(const m of out.mails||[])toast('📬 '+m.title);
 if(t==='leave'){delete presence[uid];notify('presence');}
 const {mails,worldDoc,worldWrite,...resp}=out;return {...resp,serverNow:now()};}
async function pageant(uid,input){const t=String(input.type||'');await new Promise(r=>setTimeout(r,80));const P0=world.pageant;const game=games[uid];const ctx=ctxOf(uid);let P,extra={};
 if(t==='garland'){P=garland(P0,game,ctx,String(input.to||''));}else{const r=pageantAction(P0,game,ctx,input);P=r.P;const {P:_,...rest}=r;extra=rest;}
 world.pageant=P;notify('pageant');return {...extra,view:pageantView(P,ctx),serverNow:now()};}
function pgAdmin(input){const bank=QUESTIONS.map((q,i)=>({id:'q'+i,...q}));const P=pageantAdmin(world.pageant,{uid:ME,admin:true,now:now(),name:'ยัยหนู'},input,Math.random,bank);world.pageant=P;
 if(input.type==='schedule'||input.type==='cancel'||(input.type==='next'&&P.state==='idle')){world.city.pageantDay=input.type==='schedule';world.city.pageantAt=input.type==='schedule'?P.startAt:0;notify('city');}
 notify('pageant');return pageantView(P,{uid:ME,admin:true,now:now()});}
window.__HOST={uid:ME,get:k=>k==='s3all-v1'?JSON.stringify(games[ME]):null,set:()=>{},del:()=>{},isAdmin:()=>ADMIN,myName:()=>NAME,
 cityDrive:()=>Q.get('drive')==='0'?null:{car:Q.get('car')||'yellow',fuel:'⛽ ใช้น้ำมัน 4 แกลลอน · เหลือ 36'},
 cloud:(n,i)=>n==='city'?city(ME,i):n==='pageant'?pageant(ME,i):n==='pageantAdmin'?Promise.resolve().then(()=>({view:pgAdmin(i)})):Promise.reject(new Error('พรีวิว: ไม่มี '+n)),cloudRaw:(n,i)=>n==='city'?city(ME,i):Promise.resolve({}),
 watchCity:cb=>{watchers.city.push(cb);cb(publicWorld(world.city,now()));},watchPresence:cb=>{watchers.presence.push(cb);cb(Object.values(presence));},watchPageant:cb=>{watchers.pageant.push(cb);cb(world.pageant);}};
/* ---------- บอท (ผู้เล่นคนอื่น) สำหรับประกวด/คนในนคร ---------- */
const BOTS={};const BOTN=['ออม','มิลิน','ป๊อปล่า','น้ำหวาน','เอมมี่','แพรว','บัว','ฟ้า','มะลิ','จ๋า','นุ่น','เบล','พลอย','ไอซ์','ปุ้ย','แนน','โบว์','กิ๊ฟ','มิ้นท์','ต้นข้าว'];
function bot(i){const id='bot'+i;if(BOTS[id])return id;const tr=['pink','mint','red','bob'][i%4];const w=T[tr];BOTS[id]={name:BOTN[i%BOTN.length]+(i>=BOTN.length?i:'')};games[id]=mkGame(tr,w.wear,{[w.swim]:1,[w.thai]:1});return id;}
/* ---------- แผงทดสอบ (พรีวิวเท่านั้น) ---------- */
const $=s=>document.querySelector(s);const panel=$('#tp');
function paintPanel(){const P=world.pageant;const n=Object.keys(P.contestants||{}).length;const alive=Object.values(P.contestants||{}).filter(c=>c.alive).length;
 panel.querySelector('.st').textContent=`👑 ${P.state} · คน ${n} · อยู่ ${alive}`+(P.quiz?' · ❓':'')+(P.talent?' · 🎯'+P.talent.round:'');panel.querySelector('.who').textContent=(ADMIN?'🧑‍💼 แอดมิน':'👩 ผู้เล่น')+' · '+NAME+' · เวลา+'+Math.round(OFFSET/3600000)+'ชม.';}
const acts={
 role:()=>{const u=new URL(location.href);u.searchParams.set('as',ADMIN?'player':'admin');location.href=u.toString();},
 schedule:()=>{try{pgAdmin({type:'schedule',startAt:now()+90000});toast('👑 ตั้งประกวด เริ่มใน 1.5 นาที (เปิดแย่งโพเดียมแล้ว)');}catch(e){toast(e.message);}},
 bots:async()=>{let k=0;for(let i=0;i<15;i++){const id=bot(i);const taken=new Set(Object.values(world.pageant.contestants||{}).map(c=>c.no));let no=1;while(taken.has(no))no++;if(no>PAGEANT.podiums)break;try{await pageant(id,{type:'podium',no});k++;}catch(e){console.warn('bot',id,e.message);}}toast('🤖 บอทเข้า '+k+' คน');},
 start:()=>{try{pgAdmin({type:'start'});toast('🏁 เริ่ม');}catch(e){toast(e.message);}},
 next:()=>{try{const v=pgAdmin({type:'next'});toast('⏭️ → '+v.state);}catch(e){toast(e.message);}},
 talent:()=>{try{pgAdmin({type:'talent'});toast('🎯 โชว์รอบ '+(world.pageant.talent?.round||'')+' เริ่ม');setTimeout(()=>botsAnswer(),2000);}catch(e){toast(e.message);}},
 ask:()=>{try{pgAdmin({type:'askRandom'});toast('❓ ส่งคำถาม');setTimeout(()=>botsAnswer(),2500);}catch(e){toast(e.message);}},
 closeq:()=>{try{pgAdmin({type:'closeQ'});toast('⏱️ ปิดคำถาม');}catch(e){toast(e.message);}},
 botsgo:()=>botsAnswer(),
 cancel:()=>{try{pgAdmin({type:'cancel'});toast('✖️ ยกเลิก');}catch(e){toast(e.message);}},
 love:(id)=>{/* เลือกคนที่อยู่ข้างนอกตอนนี้ (ถ้าไม่ระบุ) */if(!id){id=MEN.find(m=>manState(m.id,now(),world.city).st==='walk')?.id||'m01';}const c=games[ME].sub.city;c.love=c.love||{};const L=c.love[id]||(c.love[id]={h:0,p:0,dates:0,ev:{},gifts:{}});L.h=10;L.p=1000;L.dates=7;L.first=Math.floor((now()+7*3600000)/86400000)-9;L.since=now()-8*86400000;L.ev={3:true,6:true,9:true};toast('💘 หัวใจเต็มกับ'+MAN[id].name+' ('+id+') แล้ว · แตะตัวเขาแล้วกด 💍');return id;},
 day:()=>{OFFSET+=86400000;toast('⏩ ข้ามไป 1 วัน');},
 hour:()=>{OFFSET+=3600000;toast('⏩ ข้ามไป 1 ชม.');},
 noon:()=>{const d=new Date(now()+7*3600000);const h=d.getUTCHours()+d.getUTCMinutes()/60;const to=h<12?12:h<18?18:36;OFFSET+=(to-h)*3600000+60000;toast('⏩ ข้ามไปเวลาสามีกลับบ้าน');},
};
panel.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;e.stopPropagation();const f=acts[b.dataset.a];if(f)f();});
$('#tpBtn').onclick=()=>{panel.classList.toggle('on');};
/* บอทตอบคำถาม/โชว์ (เร็วช้าต่างกัน) */
async function botsAnswer(){const P=world.pageant;for(const [uid,c] of Object.entries(P.contestants||{})){if(!BOTS[uid]||!c.alive)continue;const d=500+Math.random()*4000;setTimeout(async()=>{try{const P2=world.pageant;if(P2.quiz&&!(uid in (P2.quiz.answers||{}))){const i=Math.random()<.7?P2.quiz.correct:Math.floor(Math.random()*4);await pageant(uid,{type:'answer',i,id:P2.quiz.id});}else if(P2.talent&&P2.state==='thai'&&!P2.talent.done?.[uid]){await pageant(uid,{type:'talent',seq:Math.random()<.8?P2.talent.seq:P2.talent.seq.slice().reverse()});}}catch(e){}},d);}}
/* บอทจ่ายอยู่ต่อในรอบดับไฟ (2 คน) */
let lightsDone=false;setInterval(()=>{const P=world.pageant;if(P.state==='lights'&&!lightsDone){lightsDone=true;const outs=(P.lights?.out||[]).filter(u=>BOTS[u]).slice(0,2);outs.forEach((u,i)=>setTimeout(()=>pageant(u,{type:'pay'}).catch(()=>{}),800+i*600));}if(P.state!=='lights')lightsDone=false;paintPanel();},1000);
/* งานแต่ง/หย่า: โชว์ฉากเหมือนเกมจริง (city3d/wed.html) */
const seen=new Set();setInterval(()=>{const W=world.city;const t=now();for(const w of W.weddings||[]){const k='w'+w.uid+w.at;if(seen.has(k))continue;if(w.at-t>45000)continue;seen.add(k);const wait=Math.max(0,w.at-t);toast('💒 งานแต่งของ '+w.name+' กับ '+w.manName+' จะเริ่มใน '+Math.round(wait/1000)+' วิ');setTimeout(()=>overlay('../city3d/wed.html?mode=wedding&bride='+encodeURIComponent(w.wear||'punk')+'&tribe='+encodeURIComponent(w.tribe||'pink')+'&name='+encodeURIComponent(w.name)+'&man='+encodeURIComponent(w.man)+'&manName='+encodeURIComponent(w.manName||''),75000),wait);}
 for(const d of W.divorces||[]){const k='d'+d.uid+d.at;if(seen.has(k))continue;seen.add(k);overlay('../city3d/wed.html?mode=divorce&name='+encodeURIComponent(d.name)+'&man='+encodeURIComponent(d.man)+'&manName='+encodeURIComponent(d.manName||''),12000);}},1500);
function overlay(src,ms){let o=document.getElementById('ov');if(o)o.remove();o=document.createElement('div');o.id='ov';o.innerHTML='<iframe src="'+src+'"></iframe><button>✕</button>';document.body.appendChild(o);o.querySelector('button').onclick=()=>o.remove();setTimeout(()=>o.remove(),ms);}
addEventListener('message',e=>{const m=e.data;if(m&&m.go==='farm'){document.getElementById('bye').style.display='flex';}});
document.getElementById('bye').onclick=()=>location.reload();
window.__fake={games,world,presence,watchers,acts,city,pageant,pgAdmin,bot,BOTS,MAN,get ME(){return ME;},get now(){return now();},setOffset:v=>{OFFSET=v;}};
paintPanel();
/* โหลดหน้านครหลังจาก __HOST พร้อมแล้วเท่านั้น (กัน race) */{const f=document.getElementById('scr');f.src=f.dataset.src;}
