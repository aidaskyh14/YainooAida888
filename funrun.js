/* fix14 แรลลี่ฟักทอง — หน้าเกม (แนวนอน)
   - ห้อง/ค่าเข้า/คะแนน/กุศล: เซิร์ฟเวอร์ (Host.cloud('funrun')) · ห้องสาธารณะ world/funrun
   - ระหว่างวิ่ง: ตัวเราจำลองในเครื่อง · เพื่อนอีก 5 คนเห็นจากตำแหน่งที่แต่ละเครื่องส่ง (funrunLive) วันละไม่กี่ครั้งต่อวินาที
   - ไอเทมที่โดนคนอื่นส่งเป็น "เหตุการณ์" แล้วเครื่องของผู้โดนเป็นคนคิดผลกับตัวเอง (โล่/ไฟกันได้ตามจริง) */
import {FR,FR_CHARS,buildCourse,roundScore} from './funrun-engine.js?v=ss3-fix14';
const H=parent.__HOST;if(!H)throw new Error('กรุณาเข้าเกมจากหน้าล็อกอิน');
const $=id=>document.getElementById(id),A='images/funrun/';
const ME=H.uid,esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CH=[['pig','น้ำผึ้ง'],['hedgehog','เม่นอ้วน'],['cat','แมวแวมไพร์'],['alpaca','อัลปาก้า'],['dog','หมาป่า'],['dodo','โดโด้']];
const CI=k=>Math.max(0,CH.findIndex(c=>c[0]===k));
const COLORS=['#F28C28','#5BB6D4','#B07CC6','#6CC9A8','#F27E9B','#FFC94D'];
const img=s=>{const i=new Image();i.src=A+s;return i};
const IM={};['ch-pig','ch-hedgehog','ch-cat','ch-alpaca','ch-dog','ch-dodo','tl-plank','tl-stone','tl-start','tl-finish','ob-pumpkin','ob-spikes','ob-ghost','ob-bats','ob-cauldron','ob-mud','ob-tomb','it-box','it-candy','it-heart','it-heart-empty','it-storm','it-blizzard','it-shield','it-cannon','it-candyboost','it-web','it-magnet','it-phase','it-mushroom','it-batbox','it-roulette','it-fireshield','it-saw','it-spikes','it-rampage','bg-pumpkin','bg-volcano','bg-ice','gr-pumpkin','gr-volcano','gr-ice'].forEach(k=>IM[k]=img(k+'.webp'));
const SNow=()=>{try{return typeof H.serverNow==='function'?H.serverNow():Date.now();}catch(e){return Date.now();}};
let room={status:'lobby',seats:[]},busy=false,myChar=0,game=null;
async function cloud(input,quiet){if(busy&&input.type!=='report')return null;busy=true;try{const out=await H.cloud('funrun',input);if(out?.room)setRoom(out.room);return out;}catch(e){if(!quiet)toast(e.message||'ทำรายการไม่สำเร็จ');return null;}finally{busy=false;}}
let toastT;function toast(m){const w=$('wait');w.textContent=m;clearTimeout(toastT);toastT=setTimeout(()=>{if(w.textContent===m)w.textContent='';},4000);if(!$('game').hidden)feed(m,true);}
const mySeat=()=>(room.seats||[]).find(s=>s.uid===ME);
const nameOf=uid=>(room.seats||[]).find(s=>s.uid===uid)?.name||'ผู้เล่น';

/* ---------- ห้อง ---------- */
function lobby(){
 const seats=room.seats||[],me=mySeat();
 $('slots').innerHTML=Array.from({length:6},(_,i)=>{const p=seats[i];if(!p)return '<div class="slot empty">＋</div>';return `<div class="slot${p.uid===ME?' me':''}${p.ready?'':' r'}"><span class="spr" style="background-image:url(${A}an/${esc(p.c)}-idle.webp);animation-delay:-${i*.37}s"></span>${esc(p.name)}${p.ready?'<span class="ok">✓</span>':''}</div>`;}).join('');
 if(me)myChar=CI(me.c);
 $('pick').innerHTML=CH.map(([k,n],i)=>`<button aria-pressed="${i===myChar}" data-c="${i}" aria-label="${n}"><img src="${A}ch-${k}.webp" alt=""></button>`).join('');
 const r=seats.filter(p=>p.ready).length;$('cnt').textContent=`${seats.length}/6 · พร้อม ${r}/${seats.length||0}`;
 const b=$('ready');b.classList.toggle('wait',!!me?.ready);
 b.textContent=room.status==='countdown'&&me?'🏁 ครบแล้ว! เตรียมตัว…':room.status!=='lobby'?'🏁 กำลังแข่งอยู่ · รอรอบถัดไป':!me?(seats.length>=6?'ห้องเต็ม 6 คน':'🪑 เข้าห้อง'):me.ready?(seats.length<6?`⏳ รอให้ครบ 6 คน (${seats.length}/6)`:'⏳ รอทุกคนกดพร้อม'):'✅ พร้อม! (จ่ายค่าเข้า)';
 $('adm').hidden=!H.admin;
}
$('pick').onclick=async e=>{const b=e.target.closest('[data-c]');if(!b)return;const me=mySeat();if(me?.ready)return;myChar=+b.dataset.c;lobby();if(me)await cloud({type:'char',c:CH[myChar][0]});};
$('ready').onclick=async()=>{const me=mySeat();if(room.status!=='lobby')return;if(!me)return cloud({type:'sit',c:CH[myChar][0]});if(!me.ready)return cloud({type:'ready'});};
$('back').onclick=async()=>{const me=mySeat();if(me&&room.status==='lobby')await cloud({type:'leave'},true);goHome();};
$('adm2').hidden=!H.admin;$('adm2').onclick=()=>$('adm').onclick();
$('adm').onclick=()=>{if(confirm('ล้างห้องแรลลี่ฟักทอง? ถ้ากำลังแข่งจะยกเลิกและคืนค่าเข้าทางไปรษณีย์'))cloud({type:'clear'});};
function goHome(){try{parent.postMessage({go:'minigames'},location.origin);}catch(e){}}
let lcdT=0;
function setRoom(r){
 const prev=room;room=r||{status:'lobby',seats:[]};
 const seated=!!mySeat();
 if(room.status==='lobby'){if(game){endRace();game=null;clearInterval(rtimer);}showLobby();lobby();return;}
 if(!seated){showLobby();lobby();return;}
 if(room.status==='countdown'){showLobby();lobby();clearInterval(lcdT);const tick=()=>{const left=Math.ceil((room.startAt-SNow())/1000);$('lcd').innerHTML=left>0&&left<=10?`<span>${left}</span>`:'';if(left<=0){clearInterval(lcdT);}};tick();lcdT=setInterval(tick,250);return;}
 $('lcd').innerHTML='';clearInterval(lcdT);
 if(room.status==='race'){if(!game||game.id!==room.game)startRound();else if(game.round!==room.round&&!game.interim)interim();return;}
 if(room.status==='results'){if(!game||!game.final)finalResults();}
}
function showLobby(){$('lobby').hidden=false;$('game').hidden=true;$('results').hidden=true;}

/* ---------- สนาม ---------- */
const cv=$('cv'),cx=cv.getContext('2d');let W,Hh,GY;
const DPR=Math.min(window.devicePixelRatio||1,1.75);let bgC=null,bgKey='',gC=null,GLOW={};
function size(){const r=cv.getBoundingClientRect();cv.width=Math.round(r.width*DPR);cv.height=Math.round(r.height*DPR);W=cv.width;Hh=cv.height;GY=Hh*.74;bgKey='';gC=null}
function off(w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));return c}
const LEN=FR.LEN,SPEED=FR.SPEED;
const ZONES=[
 {bg:'bg-pumpkin',gr:'gr-pumpkin',surf:.33,nm:'🎃 ไร่ฟักทอง',soil:['#5A2E14','#24120A'],pit:['#B6FF6A','#5FD13A','#1F5A1C','120,255,90','230,255,200','210,255,170'],lip:['#5B4636','#7FAE3E'],pitNm:'ตกบ่อเมือก',pitC:'#9BFF6A'},
 {bg:'bg-volcano',gr:'gr-volcano',surf:.09,nm:'🌋 ภูเขาไฟ',soil:['#3A1E3C','#140A18'],pit:['#FFE07A','#FF7A1E','#8A1A0A','255,120,40','255,230,170','255,200,120'],lip:['#2E1A34','#4A2E52'],pitNm:'ตกบ่อลาวา',pitC:'#FF8A2A'},
 {bg:'bg-ice',gr:'gr-ice',surf:.04,nm:'❄️ ปราสาทน้ำแข็ง',soil:['#1E4FA8','#0C1E4A'],pit:['#E6FBFF','#6FD3FF','#1A4FA0','130,220,255','240,252,255','220,245,255'],lip:['#5C8FD0','#F2FAFF'],pitNm:'ตกบ่อน้ำแข็ง',pitC:'#9BE6FF'}];
let round=1;const Z=()=>ZONES[Math.max(0,Math.min(2,(round||1)-1))];
function bgCache(){const bg=IM[Z().bg],key=round+'|'+W+'|'+Hh;if(bgKey===key||!bg.complete)return bgC;
 const bh=Math.ceil(GY*1.04),bw=Math.ceil(bh*bg.width/bg.height),c=off(bw*2,bh),g=c.getContext('2d');g.drawImage(bg,0,0,bw,bh);g.save();g.translate(bw*2,0);g.scale(-1,1);g.drawImage(bg,0,0,bw,bh);g.restore();
 g.fillStyle='rgba(18,8,34,.12)';g.fillRect(0,0,bw*2,bh);bgC=c;bgKey=key;return c}
function groundCache(s){const z=Z();if(gC&&gC.r===round)return gC;const g=IM[z.gr];if(!g.complete)return null;const gh=Math.round(62*s),gw=Math.round(gh*g.width/g.height),step=Math.round(gw*.965),c=off(step*2+gw,gh),x=c.getContext('2d');x.drawImage(g,0,0,gw,gh);x.save();x.translate(step+gw,0);x.scale(-1,1);x.drawImage(g,0,0,gw,gh);x.restore();x.drawImage(g,step*2,0,gw,gh);gC={c,step:step*2,gh,surf:z.surf,r:round};return gC}
function glow(rgb){if(GLOW[rgb])return GLOW[rgb];const c=off(64,64),g=c.getContext('2d'),h=g.createRadialGradient(32,32,0,32,32,32);h.addColorStop(0,`rgba(${rgb},1)`);h.addColorStop(1,`rgba(${rgb},0)`);g.fillStyle=h;g.fillRect(0,0,64,64);return GLOW[rgb]=c}
let pits,plats,obs,boxes,candies,pads,traps,me,remotes,cam,state,myItem,fx,parts,snowT,reported,dimT=0;
const inPit=x=>pits.some(([a,b])=>x>a+10&&x<b-10);
function surfaceUnder(r,prevY){let s=inPit(r.x)?-999:0;for(const p of plats)if(r.x>p.x1&&r.x<p.x2&&prevY>=p.h-2&&p.h>s)s=p.h;return s}

/* ---------- ด่าน ---------- */
function startRound(){
 round=room.round;game={id:room.game,round,final:false};const c=buildCourse(room.seed,round);({pits,plats,obs,boxes,candies,pads}=c);
 const seat=mySeat(),ci=CI(seat?.c);
 me={uid:ME,n:seat?.name||'ฉัน',c:ci,i:0,x:0,y:0,vy:0,hp:5,spd:SPEED,out:false,fin:0,candy:0,boxes:0,trail:[],gotC:new Set(),gotB:new Set()};
 remotes=new Map();(room.seats||[]).forEach((s,k)=>{if(s.uid!==ME)remotes.set(s.uid,{uid:s.uid,n:s.name,c:CI(s.c),i:k+1,x:-k*14,y:0,hp:5,f:0,px:-k*14,py:0,v:0,t:0,trail:[],ghost:0});});
 traps=[];fx=[];parts=[];snowT=0;myItem=null;cam=0;state='cd';reported=false;$('feed').innerHTML='';
 $('lobby').hidden=true;$('results').hidden=true;$('game').hidden=false;$('spect').hidden=true;size();renderHUD();
 liveStop?.();liveStop=H.frWatch?H.frWatch(room.game,onPlayers,onEvent):null;
 banner(`🎃 ด่าน ${round}/${FR.ROUNDS} · ${Z().nm}`);
 const go=()=>{state='run';banner(round===1?'🏁 ไป!  👆 แตะจอเพื่อกระโดด':'🏁 ไป!');};
 const wait=()=>{const left=room.roundStart-SNow();if(left<=0)return go();if(left<=3200){$('gcd').innerHTML=`<span>${Math.ceil(left/1000)}</span>`;}setTimeout(wait,Math.min(250,left));};
 wait();lastT=0;requestAnimationFrame(loop);
}
function endRace(){state='end';liveStop?.();liveStop=null;}
function banner(t){$('hud').querySelectorAll('.banner').forEach(b=>b.remove());const d=document.createElement('div');d.className='banner';d.textContent=t;$('hud').append(d);setTimeout(()=>d.remove(),1600);if(t)$('gcd').innerHTML=''}
function feed(t,mine){const f=$('feed'),d=document.createElement('div');if(mine)d.className='me';d.textContent=t;f.prepend(d);while(f.children.length>3)f.lastChild.remove();setTimeout(()=>d.remove(),4000)}
const S=()=>Math.min(W/420,Hh/560);
const T=(r,k)=>(r[k]||0)>0;
function jump(r){if(r.out||r.fin||T(r,'frozen')||T(r,'webbed')||T(r,'char'))return;if(r.grounded){r.vy=12.5;r.dbl=false;r.grounded=false}else if(!r.dbl){r.vy=10.5;r.dbl=true;r.flip=1}}
const tap=e=>{if(e)e.preventDefault();if(!me||state!=='run')return;jump(me)};$('jump').addEventListener('pointerdown',tap);cv.addEventListener('pointerdown',tap);
function playerUse(k){if(k==='it-saw'){$('aim').hidden=false;return false}useItem(k);return true}
$('use').onclick=e=>{e.stopPropagation();if(!myItem||state!=='run'||!alive(me))return;if(playerUse(myItem)){myItem=null;renderHUD()}};
document.querySelectorAll('[data-dir]').forEach(b=>b.onclick=e=>{e.stopPropagation();$('aim').hidden=true;if(myItem!=='it-saw'||state!=='run')return;useItem('it-saw',+b.dataset.dir);myItem=null;renderHUD();});
const ITEMS=['it-cannon','it-roulette','it-saw','it-candyboost','it-rampage','it-phase','it-storm','it-blizzard','it-mushroom','it-batbox','it-web','it-spikes','it-shield','it-fireshield','it-magnet'];
const INAME={'it-saw':'⚙️ จักรเหวี่ยง','it-spikes':'🌵 วางหนาม','it-rampage':'🔥 พุ่งชนไม่ยั้ง','it-cannon':'🎃 ปืนใหญ่ฟักทอง','it-roulette':'🎡 วงล้อแม่มด','it-candyboost':'🍬 ลูกอมพลังพิเศษ','it-phase':'👻 ร่างผีทะลุ','it-storm':'🌩️ พายุแม่มด','it-blizzard':'❄️ พายุหิมะผี','it-mushroom':'🍄 เห็ดเด้ง','it-batbox':'📦 กล่องค้างคาว','it-web':'🕸️ ใยแมงมุมไฟฟ้า','it-shield':'🫧 ฟองกันภัย','it-fireshield':'🔥 ฟองไฟฟักทอง','it-magnet':'🧲 แม่เหล็กแม่มด'};
const alive=r=>r&&!r.out&&!r.fin;
const others=()=>[...remotes.values()].filter(alive);
const aheadOf=x=>others().filter(o=>o.x>x).sort((a,b)=>a.x-b.x);
function protectedBy(r){if(T(r,'fire'))return true;if(r.shield){r.shield=0;pop(r.x,r.y+30,'🫧 กันได้!','#CFEFFF');burst(r.x,r.y+30,'#CFEFFF',14);return true}return false}
function hit(why){
 if(!alive(me)||protectedBy(me))return;me.hp--;me.dizzy=70;me.stun=40;pop(me.x,me.y+70,'−1 ❤️','#FF8A80');feed(`💥 ${why||'โดนชน'} −1 ❤️`,true);shakeT=14;
 if(me.hp<=0){me.out=true;me.ghost=0;banner('👻 ตกรอบ');report(false);}renderHUD();publish(true);
}
function pop(x,y,t,c){fx.push({k:'txt',x,y,t,c,life:60})}
function burst(x,y,c,n=16,sp=6){for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-.5)*sp,vy:Math.random()*sp*.9,life:35+Math.random()*15,c,r:2+Math.random()*2.5})}
function smoke(x,y){parts.push({x:x+(Math.random()-.5)*14,y,vx:(Math.random()-.5)*.6,vy:.8+Math.random()*.6,life:50,c:'rgba(60,60,60,.55)',r:5+Math.random()*4,smoke:1})}
function shoot(from,to,kind,onHit){fx.push({k:'proj',kind,x:from.x+20,y:from.y+35,to,spin:0,onHit,life:240})}
function boom(x,y){burst(x,y,'#FF9A3D',22,8);burst(x,y,'#FFE08A',12,5);for(let i=0;i<6;i++)smoke(x,y);pop(x,y+40,'ตูม!','#FFB15C')}
const ev=e=>{if(game)try{H.frEvent?.(game.id,{r:round,at:SNow(),...e});}catch(x){}};
/* ไอเทมของเรา: ผลกับตัวเองทำทันที ผลกับคนอื่นส่งเป็นเหตุการณ์ */
function useItem(k,dir){
 const a=aheadOf(me.x),os=others();feed(`${INAME[k].split(' ')[0]} ใช้${INAME[k].slice(INAME[k].indexOf(' '))}`,true);banner(INAME[k]);
 switch(k){
  case 'it-cannon':{const t=a[0]||os[0];fx.push({k:'gun',r:me,life:40});if(t){ev({k,to:t.uid});setTimeout(()=>shoot(me,t,'pumpkin',o=>boom(o.x,o.y+30)),250);}break}
  case 'it-roulette':{fx.push({k:'wheel',r:me,life:70});const t=os[Math.floor(Math.random()*os.length)];if(t){ev({k,to:t.uid});setTimeout(()=>shoot(me,t,'bat',o=>burst(o.x,o.y+30,'#8E6BE8',18)),1150);}setTimeout(()=>{me.boost=70},1150);break}
  case 'it-candyboost':me.boost=170;break;
  case 'it-phase':me.boost=70;me.phase=90;break;
  case 'it-storm':ev({k});dimT=170;break;
  case 'it-blizzard':ev({k});snowT=200;break;
  case 'it-mushroom':case 'it-batbox':case 'it-web':case 'it-spikes':{const t={k,x:me.x-40,y:me.y+40,vy:0,landed:false,owner:ME,hit:false,sq:0,born:performance.now()};traps.push(t);ev({k,x:Math.round(t.x),y:Math.round(t.y)});break}
  case 'it-shield':me.shield=1;break;
  case 'it-fireshield':me.fire=200;me.boost=100;break;
  case 'it-saw':{if(dir===undefined)dir=1;const s={k:'saw',x:me.x+dir*24,y:22,vx:dir*10+(dir>0?me.spd:0),owner:ME,spin:0,life:260};fx.push(s);ev({k,x:Math.round(s.x),d:dir});pop(me.x,me.y+80,dir>0?'โยน ▶':'◀ โยน','#E6E9F5');break}
  case 'it-rampage':me.ram=260;me.boost=260;break;
  case 'it-magnet':{const t=a[0];if(t){ev({k,to:t.uid});shoot(me,t,'magnet',()=>{});}break}
 }
 publish(true);
}
/* เหตุการณ์จากคนอื่น */
const seen=new Set();
function onEvent(e){if(!e||e.from===ME||seen.has(e.id)||!game||e.r!==round||state==='end')return;seen.add(e.id);const src=remotes.get(e.from);if(!src)return;const who=src.n,k=e.k;
 if(INAME[k])feed(`${INAME[k].split(' ')[0]} ${who} ใช้${INAME[k].slice(INAME[k].indexOf(' '))}`,false);
 const target=e.to===ME?me:remotes.get(e.to);
 if((k==='it-cannon'||k==='it-roulette')&&target){if(k==='it-cannon')fx.push({k:'gun',r:src,life:40});else fx.push({k:'wheel',r:src,life:70});
  setTimeout(()=>shoot(src,target,k==='it-cannon'?'pumpkin':'bat',o=>{if(k==='it-cannon')boom(o.x,o.y+30);else burst(o.x,o.y+30,'#8E6BE8',18);if(o===me)hit(k==='it-cannon'?`${who} ยิงปืนใหญ่ใส่`:`วงล้อของ ${who} สุ่มโดน`);}),k==='it-cannon'?250:1150);}
 if(k==='it-magnet'&&target)shoot(src,target,'magnet',o=>{if(o!==me||protectedBy(me))return;me.pull=55;me.pullBy=src;pop(me.x,me.y+70,'ดึงกลับ!','#D9B8FF')});
 if(k==='it-storm'){dimT=170;if(alive(me)){me.cloud=150;setTimeout(()=>{if(!alive(me))return;fx.push({k:'bolt',o:me,life:14});if(!protectedBy(me)){me.char=110;hit(`ฟ้าผ่าจาก ${who}`);}},2500);}}
 if(k==='it-blizzard'){snowT=200;if(alive(me)&&!protectedBy(me))me.frozen=170;}
 if(['it-mushroom','it-batbox','it-web','it-spikes'].includes(k)&&Number.isFinite(e.x))traps.push({k,x:e.x,y:e.y??40,vy:0,landed:false,owner:e.from,hit:false,sq:0,born:performance.now()});
 if(k==='it-saw'&&Number.isFinite(e.x))fx.push({k:'saw',x:e.x,y:22,vx:(e.d<0?-1:1)*10+(e.d>0?SPEED:0),owner:e.from,spin:0,life:260});
}
/* ตำแหน่งเพื่อน */
const FL={boost:1,phase:2,fire:4,shield:8,ram:16,frozen:32,webbed:64,char:128,cloud:256,stun:512,out:1024,fin:2048};
function flagsOf(r){let f=0;for(const [k,b]of Object.entries(FL)){if(k==='shield'?r.shield:(k==='out'||k==='fin')?r[k]:T(r,k))f|=b;}return f}
function onPlayers(list){if(!game)return;const now=SNow();for(const p of list){if(p.uid===ME||p.g!==game.id||p.r!==round)continue;const o=remotes.get(p.uid);if(!o)continue;
 if((p.t||0)<=o.t)continue;o.t=p.t;o.px=p.x;o.py=p.y;o.v=Number(p.v)||0;o.hp=p.hp;o.f=p.f||0;o.at=now;
 for(const [k,b]of Object.entries(FL)){const on=!!(o.f&b);if(k==='out'){if(on&&!o.out){o.out=true;o.ghost=0;feed(`👻 ${o.n} ตกรอบ`,false);}}else if(k==='fin'){if(on&&!o.fin){o.fin=1;feed(`🏁 ${o.n} เข้าเส้นชัย`,false);}}else o[k]=on?(k==='shield'?1:20):0;}}}
let lastPub=0,lastSent='';
function publish(force){if(!game||!me)return;const t=performance.now();if(!force&&t-lastPub<480)return;lastPub=t;
 const data={g:game.id,r:round,x:Math.round(me.x),y:Math.round(me.y),v:alive(me)?Math.round(curV*60):0,hp:me.hp,f:flagsOf(me),t:SNow()};const sig=JSON.stringify({...data,t:0});if(!force&&sig===lastSent)return;lastSent=sig;try{H.frPublish?.(game.id,data);}catch(e){}}
/* รายงานผลด่านของเรา (เซิร์ฟเวอร์ตรวจและคิดคะแนน) */
function report(fin){if(reported||!game)return;reported=true;const time=fin?Math.round(SNow()-room.roundStart):0;
 const g=game.id,rd=round,body={type:'report',game:g,round:rd,fin,time,hp:me.hp,candy:me.candy,boxes:me.boxes};const send=(n=0)=>cloud(body,true).then(o=>{if(!o&&n<8&&room.game===g&&room.round===rd&&room.status==='race')setTimeout(()=>send(n+1),1200);});send();
 $('spect').hidden=false;$('spect').textContent=fin?'🏁 เข้าเส้นแล้ว · รอเพื่อน (ตัดเวลา 20 วิหลังคนแรก)':'👻 ตกรอบ · ดูเพื่อนวิ่งต่อ';}

let curV=0;
function step(){
 if(state!=='run')return;const r=me;
 if(!r.out&&!r.fin){
  ['boost','stun','phase','fire','dizzy','char','cloud','webbed','knock','ram','rammed'].forEach(k=>r[k]=(r[k]||0)-1);
  if(T(r,'char')&&Math.random()<.35)smoke(r.x,r.y+50);
  let v=0;
  if(T(r,'frozen')){r.frozen--;}
  else if(T(r,'webbed')){if(Math.random()<.25)fx.push({k:'zap',r,life:5});}
  else{
   v=r.spd*(T(r,'boost')?1.55:1)*(T(r,'stun')?.35:1)*(T(r,'char')?.6:1);if(r.pull>0){r.pull--;v=-3}if(T(r,'knock'))v=-3.5;
   r.x+=v;const prevY=r.y;r.vy-=.6;r.y+=r.vy;const s=surfaceUnder(r,prevY);
   if(r.y<=s&&s>-999){r.y=s;r.vy=0;r.grounded=true;r.dbl=false;r.air=0}else{r.grounded=false;r.air=(r.air||0)+1}
   if(r.y<-22){const pit=pits.find(([a,b])=>r.x>a-20&&r.x<b+40);burst(r.x,0,Z().pitC,16);r.x=(pit?pit[0]:r.x)-40;r.y=0;r.vy=0;r.grounded=true;hit(Z().pitNm);}
   if(r.flip>0){r.flip+=.12;if(r.flip>1+Math.PI*2)r.flip=0}
   if(T(r,'boost')&&performance.now()%4<1.2)r.trail.push({x:r.x,y:r.y,a:.5});
   for(const p of pads)if(Math.abs(p.x-r.x)<16&&r.y<6&&r.vy<=0){r.vy=17.5;r.grounded=false;r.dbl=false;p.sq=14;pop(p.x,60,'บึ๋ง!','#FFD36B')}
   for(const o of obs){if(!o.dead&&!T(r,'ram')&&Math.abs(o.x-r.x)<20&&!o.h){const oy=o.fly?60:0;if(Math.abs(r.y-oy)<32&&!T(r,'phase')){o.h=1;burst(r.x,r.y+30,'#FFC2A0',10);hit('ชนสิ่งกีดขวาง')}}}
   if(T(r,'ram')){for(const o of obs)if(!o.dead&&Math.abs(o.x-r.x)<34){o.dead=1;burst(o.x,30,'#FF9A3D',18,8);pop(o.x,70,'พัง!','#FFB15C')}for(const t of traps)if(Math.abs(t.x-r.x)<30)t.broken=1}
   // โดนเพื่อนที่กำลังพุ่งชน (ตัดสินที่เครื่องเรา)
   for(const o of others())if(T(o,'ram')&&Math.abs(o.x-r.x)<26&&Math.abs(o.y-r.y)<40&&!T(r,'rammed')){r.rammed=90;r.knock=35;r.vy=10;r.grounded=false;boom(r.x,r.y+30);hit(`${o.n} พุ่งชน`)}
   for(const t of traps){if(!t.landed||t.owner===ME||t.hit)continue;const ty=t.k==='it-batbox'?28:0;if(Math.abs(t.x-r.x)<20&&Math.abs(r.y-ty)<28&&!T(r,'phase')){t.hit=true;if(protectedBy(r))continue;const by=remotes.get(t.owner)?.n||'เพื่อน';
     if(t.k==='it-spikes'){burst(t.x,10,'#B36BFF',14);hit(`เหยียบหนามของ ${by}`)}
     else if(t.k==='it-web'){r.webbed=100;feed(`🕸️ ติดใยของ ${by}`,true)}
     else if(t.k==='it-mushroom'){t.sq=16;r.vy=15;r.grounded=false;r.knock=40;pop(t.x,50,'บึ๋ง!','#FF9AB0');feed(`🍄 เด้งถอยหลัง (${by})`,true)}
     else{t.broken=1;burst(t.x,30,'#B07A45',18);r.knock=35;r.vy=9;r.grounded=false;pop(t.x,60,'ปึก!','#FFD36B');feed(`📦 ชนกล่องค้างคาวของ ${by}`,true)}}}
   boxes.forEach((b,bi)=>{if(!r.gotB.has(bi)&&Math.abs(b.x-r.x)<24&&Math.abs(r.y+35-b.y)<45){r.gotB.add(bi);r.boxes++;burst(b.x,b.y,'#FFE08A',14);if(!myItem){myItem=ITEMS[Math.floor(Math.random()*ITEMS.length)];renderHUD()}}});
   candies.forEach((c,ci)=>{if(!r.gotC.has(ci)&&Math.abs(c.x-r.x)<18&&Math.abs(r.y+30-c.y)<36){r.gotC.add(ci);r.candy++;burst(c.x,c.y,'#FFD36B',5,3)}});
   if(r.x>=LEN&&!r.fin){r.fin=1;banner('🏁 เข้าเส้นชัย!');feed('🏁 เข้าเส้นชัย!',true);report(true);publish(true);}
   if(SNow()-room.roundStart>FR.ROUND_MAX&&!reported){r.out=true;report(false);}
  }
  curV=v;
 } else {curV=0;if(r.out)r.ghost=(r.ghost||0)+1;}
 // เพื่อน: ต่อจากตำแหน่งล่าสุดด้วยความเร็วที่ส่งมา (ไม่เกิน 0.7 วิ) แล้วไล่ให้นุ่ม
 const now=SNow();for(const o of remotes.values()){if(o.out){o.ghost=(o.ghost||0)+1;continue}const lag=Math.min(700,Math.max(0,now-(o.t||now)))/1000,tx=o.px+(o.fin?0:o.v*lag),ty=o.py;o.x+=(tx-o.x)*.25;o.y+=(ty-o.y)*.35;o.grounded=Math.abs(o.y)<2||plats.some(p=>o.x>p.x1&&o.x<p.x2&&Math.abs(o.y-p.h)<3);if(T(o,'boost')&&performance.now()%4<1.2)o.trail.push({x:o.x,y:o.y,a:.5});}
 for(const t of traps)if(!t.landed){t.vy-=.7;t.y+=t.vy;const base=t.k==='it-batbox'?28:0;if(t.y<=base){t.y=base;t.landed=true;t.sq=10;burst(t.x,base,'#D9C2A0',8,4)}}
 traps=traps.filter(t=>!t.broken&&performance.now()-t.born<30000);
 for(const f of fx)if(f.k==='proj'){const tx=f.to.x,ty=f.to.y+35,dx=tx-f.x,dy=ty-f.y,d=Math.hypot(dx,dy),sp=9;f.spin+=.3;
  if(d<14||!alive(f.to)){if(alive(f.to))f.onHit(f.to);f.life=0}else{f.x+=dx/d*sp+(f.to.spd||SPEED);f.y+=dy/d*sp+Math.sin(f.spin)*1.2;if(Math.random()<.7)parts.push({x:f.x,y:f.y,vx:-.5,vy:0,life:18,c:f.kind==='pumpkin'?'rgba(255,170,80,.8)':f.kind==='bat'?'rgba(170,120,255,.8)':'rgba(220,150,255,.8)',r:3})}}
 for(const f of fx)if(f.k==='saw'){f.x+=f.vx;f.spin+=.5;if(Math.random()<.6)parts.push({x:f.x,y:4,vx:-f.vx*.1+(Math.random()-.5)*2,vy:Math.random()*2,life:14,c:'rgba(255,230,150,.9)',r:1.6});
  if(inPit(f.x)){f.life=0;burst(f.x,0,'#9BFF6A',8);continue}
  if(f.owner!==ME&&alive(me)&&Math.abs(me.x-f.x)<22&&me.y<46){f.life=0;burst(me.x,me.y+20,'#E6E9F5',20,8);hit(`จักรของ ${remotes.get(f.owner)?.n||'เพื่อน'}`);me.knock=20}
  else if(f.owner===ME){const v=others().find(o=>Math.abs(o.x-f.x)<22&&o.y<46);if(v){f.life=0;burst(v.x,v.y+20,'#E6E9F5',20,8);}}}
 for(const p of pads)p.sq=Math.max(0,p.sq-1);for(const t of traps)t.sq=Math.max(0,(t.sq||0)-1);if(dimT>0)dimT--;
 const lead=me.out?Math.max(me.x,...others().map(o=>o.x)):me.x;cam+=(lead-W/S()*.3-cam)*.12;
 publish(false);
}
function draw(){
 const s=S(),X=wx=>(wx-cam)*s,Y=wy=>GY-wy*s,now=performance.now();cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,W,Hh);if(shakeT>0){shakeT--;cx.setTransform(1,0,0,1,(Math.random()-.5)*shakeT*1.2,(Math.random()-.5)*shakeT*.8)}
 const bc=bgCache();if(bc){const pw=bc.width,o=-(((cam*s*.25)%pw)+pw)%pw;for(let x=o;x<W;x+=pw)cx.drawImage(bc,Math.round(x),0)}
 if(dimT>0){cx.fillStyle=`rgba(15,5,35,${Math.min(.45,dimT/170*.5)})`;cx.fillRect(0,0,W,Hh)}
 const zz=Z(),zp=zz.pit;
 const soil=cx.createLinearGradient(0,GY,0,Hh);soil.addColorStop(0,zz.soil[0]);soil.addColorStop(1,zz.soil[1]);cx.fillStyle=soil;cx.fillRect(0,GY+14*s,W,Hh);
 const gc=groundCache(s);if(gc){const o=-(((cam*s)%gc.step)+gc.step)%gc.step;for(let x=o;x<W;x+=gc.step-1)cx.drawImage(gc.c,Math.round(x),Math.round(GY-gc.gh*gc.surf-2*s))}
 for(const [pa,pb] of pits){const x1=X(pa),x2=X(pb);if(x2<-30||x1>W+30)continue;const top=GY-3*s,dep=34*s,w=x2-x1;
  cx.save();const sl=cx.createLinearGradient(0,top,0,top+dep);sl.addColorStop(0,zp[0]);sl.addColorStop(.35,zp[1]);sl.addColorStop(1,zp[2]);cx.fillStyle=sl;
  cx.beginPath();cx.moveTo(x1,top);cx.bezierCurveTo(x1+w*.05,top+dep*1.1,x2-w*.05,top+dep*1.1,x2,top);cx.closePath();cx.fill();cx.restore();
  cx.strokeStyle=`rgba(${zp[4]},.75)`;cx.lineWidth=2*s;cx.beginPath();for(let k=0;k<=12;k++){const xx=x1+w*k/12,yy=top+2*s+Math.sin(now/400+k*1.3)*1.6*s;k?cx.lineTo(xx,yy):cx.moveTo(xx,yy)}cx.stroke();
  for(let k=0;k<5;k++){const ph=(now/1600+k*.37+pa%5*.13)%1,bx=x1+w*(.15+.7*((k*.29+pa%3*.2)%1)),by=top+dep*.55-ph*dep*.5;cx.fillStyle=`rgba(${zp[5]},${.8*(1-ph)})`;cx.beginPath();cx.arc(bx,by,(2+ph*3)*s,0,7);cx.fill()}
  for(const [ex,d] of [[x1,1],[x2,-1]]){cx.fillStyle=zz.lip[0];cx.beginPath();cx.ellipse(ex,top+3*s,9*s,7*s,0,0,7);cx.fill();cx.fillStyle=zz.lip[1];cx.beginPath();cx.ellipse(ex+d*s,top-2*s,8*s,3.5*s,0,0,7);cx.fill()}}
 for(const p of plats){const im=IM[p.k];if(!im.complete)continue;const x1=X(p.x1),x2=X(p.x2);if(x2<-50||x1>W+50)continue;const tw=110*s,th=tw*im.height/im.width;for(let x=x1;x<x2-4;x+=tw-6*s)cx.drawImage(im,x,Y(p.h)-th*.25,Math.min(tw,x2-x+6*s),th)}
 const st=IM['tl-start'],fi=IM['tl-finish'];
 if(st.complete){const w=120*s;cx.drawImage(st,X(-20)-w/2,GY-w*st.height/st.width+8*s,w,w*st.height/st.width)}
 if(fi.complete){const w=130*s;cx.drawImage(fi,X(LEN)-w/2,GY-w*fi.height/fi.width+8*s,w,w*fi.height/fi.width)}
 const mu=IM['it-mushroom'];for(const p of pads){const x=X(p.x);if(x<-40||x>W+40)continue;const k=p.sq/14,w=40*s*(1+k*.3),h=40*s*mu.height/mu.width*(1-k*.45);cx.drawImage(mu,x-w/2,GY-h+6*s,w,h)}
 const pulse=.75+.25*Math.sin(now/700),halo=(x,y,r,c)=>{const m=/rgba\(([^,]+,[^,]+,[^,]+),([^)]+)\)/.exec(c);if(!m)return;cx.globalAlpha=Math.min(1,+m[2]);cx.drawImage(glow(m[1].replace(/ /g,'')),x-r,y-r,r*2,r*2);cx.globalAlpha=1};
 const cd=IM['it-candy'],bx=IM['it-box'];
 candies.forEach((c,i)=>{if(me.gotC.has(i))return;const x=X(c.x);if(x<-20||x>W+20)return;halo(x,Y(c.y)+2*s,14*s,`rgba(255,215,110,${.45*pulse})`);cx.drawImage(cd,x-9*s,Y(c.y)-6*s,18*s,18*s*cd.height/cd.width)});
 boxes.forEach((b,i)=>{if(me.gotB.has(i))return;const x=X(b.x);if(x<-40||x>W+40)return;const bob=Math.sin(now/500+b.x)*3*s;halo(x,Y(b.y)+bob+16*s,38*s,`rgba(255,225,120,${.6*pulse})`);cx.drawImage(bx,x-18*s,Y(b.y)+bob,36*s,36*s*bx.height/bx.width)});
 for(const o of obs){if(o.dead)continue;const x=X(o.x);if(x<-80||x>W+80)continue;const im=IM[o.k];const w=(o.k==='ob-bats'||o.k==='ob-mud'?72:56)*s,h=w*im.height/im.width;const y=o.fly?GY-92*s-h+Math.sin(now/300+o.x)*4*s:GY-h+6*s;cx.drawImage(im,x-w/2,y,w,h)}
 for(const t of traps){const im=IM[t.k],x=X(t.x);if(x<-40||x>W+40)continue;const k=(t.sq||0)/16;let w=40*s,h=w*im.height/im.width;
  if(t.k==='it-mushroom'){w*=1+k*.3;h*=1-k*.45}
  const y=Y(t.y)-h+(t.k==='it-batbox'?Math.sin(now/250)*4*s:6*s);
  cx.save();if(t.k==='it-batbox'){cx.translate(x,y+h/2);cx.scale(1+Math.sin(now/90)*.06,1);cx.drawImage(im,-w/2,-h/2,w,h)}else cx.drawImage(im,x-w/2,y,w,h);cx.restore();
  if(t.k==='it-web'&&Math.random()<.2){cx.strokeStyle='rgba(255,240,140,.9)';cx.lineWidth=1.5*s;cx.beginPath();cx.moveTo(x-10*s,y+h/2);cx.lineTo(x,y+h*.3);cx.lineTo(x+10*s,y+h*.6);cx.stroke()}}
 for(const o of remotes.values())drawRunner(o,X,Y,s,now);drawRunner(me,X,Y,s,now);
 for(const f of fx){f.life--;
  if(f.k==='saw'){const im=IM['it-saw'],w=30*s;cx.save();cx.translate(X(f.x),Y(f.y));cx.rotate(f.spin*Math.sign(f.vx));cx.drawImage(im,-w/2,-w/2,w,w);cx.restore()}
  if(f.k==='proj'){const x=X(f.x),y=Y(f.y);cx.save();cx.translate(x,y);
   if(f.kind==='pumpkin'){cx.rotate(f.spin);const im=IM['ob-pumpkin'],w=22*s;cx.drawImage(im,-w/2,-w/2,w,w*im.height/im.width)}
   else if(f.kind==='bat'){const im=IM['ob-bats'],w=34*s;cx.scale(1,1+Math.sin(f.spin*3)*.15);cx.drawImage(im,-w/2,-w/4,w,w*im.height/im.width)}
   else{cx.rotate(Math.sin(f.spin)*.4);const im=IM['it-magnet'],w=24*s;cx.drawImage(im,-w/2,-w/2,w,w*im.height/im.width)}
   cx.restore()}
  if(f.k==='gun'&&alive(f.r)){const im=IM['it-cannon'],w=34*s,x=X(f.r.x)+18*s-(f.life>30?(40-f.life)*1.2*s:0),y=Y(f.r.y)-46*s;cx.drawImage(im,x,y,w,w*im.height/im.width);if(f.life>32){cx.fillStyle='rgba(255,200,120,.8)';cx.beginPath();cx.arc(x+w+4*s,y+w*.3,8*s,0,7);cx.fill()}}
  if(f.k==='wheel'&&alive(f.r)){const im=IM['it-roulette'],w=34*s,x=X(f.r.x),y=Y(f.r.y)-110*s;cx.save();cx.translate(x,y);cx.rotate((70-f.life)*(.05+(f.life/70)*.4));cx.drawImage(im,-w/2,-w/2,w,w*im.height/im.width);cx.restore()}
  if(f.k==='bolt'){const o=f.o,x=X(o.x),y=Y(o.y)-50*s;cx.save();cx.strokeStyle=f.life%4<2?'#FFFFFF':'#FFF07A';cx.lineWidth=4*s;cx.beginPath();cx.moveTo(x+6*s,0);let yy=0;while(yy<y){yy+=22*s;cx.lineTo(x+(Math.random()-.5)*22*s,Math.min(yy,y))}cx.stroke();cx.restore();halo(x,y,40*s,'rgba(255,250,200,.5)')}
  if(f.k==='zap'&&alive(f.r)){const x=X(f.r.x),y=Y(f.r.y)-30*s;cx.strokeStyle='#FFF07A';cx.lineWidth=2*s;cx.beginPath();cx.moveTo(x-16*s,y-10*s);cx.lineTo(x-4*s,y);cx.lineTo(x-10*s,y+6*s);cx.lineTo(x+14*s,y+14*s);cx.stroke()}
  if(f.k==='txt'){f.y+=.6;cx.save();cx.globalAlpha=Math.min(1,f.life/20);cx.font=`400 ${15*s}px Itim, Mali, sans-serif`;cx.textAlign='center';cx.lineWidth=4*s;cx.strokeStyle='rgba(40,15,60,.9)';cx.strokeText(f.t,X(f.x),Y(f.y));cx.fillStyle=f.c;cx.fillText(f.t,X(f.x),Y(f.y));cx.restore()}
 }
 fx=fx.filter(f=>f.life>0);
 for(const p of parts){p.life--;p.x+=p.vx;p.y+=p.vy;if(!p.smoke)p.vy-=.25;else p.r+=.15;cx.globalAlpha=Math.max(0,Math.min(1,p.life/25));cx.fillStyle=p.c;cx.beginPath();cx.arc(X(p.x),Y(p.y),p.r*s,0,7);cx.fill()}cx.globalAlpha=1;parts=parts.filter(p=>p.life>0);
 if(snowT>0){snowT--;cx.fillStyle='rgba(220,240,255,.15)';cx.fillRect(0,0,W,Hh);for(let k=0;k<70;k++){const x=((k*97.3+now/9)%W),y=((k*53.1+now/(5+k%4))%Hh);cx.fillStyle='rgba(255,255,255,.85)';cx.beginPath();cx.arc(x,y,(1.5+k%3)*s,0,7);cx.fill()}}
}
const TC=document.createElement('canvas');TC.width=TC.height=120;const TCX=TC.getContext('2d');
const AN={},ACTS=['idle','run','jump','hit','death','win'];CH.forEach(([k])=>{AN[k]={};ACTS.forEach(a=>AN[k][a]=img('an/'+k+'-'+a+'.webp'))});
const DEATHN={dodo:14,hedgehog:14,alpaca:14};
function pose(r,now){const k=CH[r.c][0];
 if(r.out){const n=DEATHN[k]||16;return ['death',Math.min(n-1,Math.floor((r.ghost||0)/5))]}
 if(r.fin)return ['win',Math.floor(now/70)%16];
 if(state!=='run')return ['idle',Math.floor(now/90)%16];
 if(T(r,'stun')||T(r,'dizzy')||T(r,'knock'))return ['hit',Math.min(15,4+Math.floor(now/60)%12)];
 if(r===me?!r.grounded:!r.grounded){return ['jump',Math.min(15,Math.floor((r.air||8)*16/44))]}
 if(T(r,'frozen')||T(r,'webbed'))return ['run',0];
 return ['run',Math.floor(now/(T(r,'boost')?32:50)+r.i*3)%16]}
function drawRunner(r,X,Y,s,now){
 const x=X(r.x);if(x<-80||x>W+80)return;const [act,fi]=pose(r,now),im=AN[CH[r.c][0]][act];if(!im.complete)return;
 const D=96*s,w=58*s,h=58*s;let by=Y(r.y)+6*s,y=by-h;const mine=r===me;
 const blit=(xx,yy)=>cx.drawImage(im,fi*240,0,240,240,xx-D/2,yy-D,D,D);
 for(const t of r.trail){t.a-=.025;if(t.a<=0)continue;cx.save();cx.globalAlpha=t.a*(mine?1:.5);blit(X(t.x),Y(t.y)+6*s);cx.restore()}r.trail=r.trail.filter(t=>t.a>0);
 cx.save();cx.globalAlpha=mine?1:.75;
 if(r.out){cx.globalAlpha=Math.max(0,(mine?1:.7)-Math.max(0,(r.ghost||0)-70)/200);const up=Math.max(0,(r.ghost||0)-70)*.8*s;by-=up;y-=up}
 let tint=null;if(!r.out&&T(r,'char'))tint='rgba(20,12,10,.85)';else if(!r.out&&T(r,'phase')){cx.globalAlpha*=.5;tint='rgba(120,220,255,.55)'}
 if(T(r,'knock')){cx.translate(x,by-h/2);cx.rotate(-.25);cx.translate(-x,-(by-h/2))}
 if(tint){const g=TCX;g.globalCompositeOperation='copy';g.drawImage(im,fi*240,0,240,240,0,0,120,120);g.globalCompositeOperation='source-atop';g.fillStyle=tint;g.fillRect(0,0,120,120);g.globalCompositeOperation='source-over';cx.drawImage(TC,0,0,120,120,x-D/2,by-D,D,D)}else blit(x,by);cx.restore();
 const cxm=x,cym=y+h/2;
 if(!alive(r))return;
 if(T(r,'cloud')){const ci=IM['it-storm'],cw=40*s;cx.drawImage(ci,cxm-cw/2,y-44*s+Math.sin(now/200)*2*s,cw,cw*ci.height/ci.width);if(mine){const n=Math.ceil(r.cloud/50);cx.font=`400 ${13*s}px Itim, sans-serif`;cx.textAlign='center';cx.fillStyle='#FFF07A';cx.fillText(n,cxm,y-46*s)}}
 if(T(r,'char')){cx.fillStyle='rgba(255,140,40,.8)';for(let k=0;k<3;k++){cx.beginPath();cx.arc(cxm+(k-1)*10*s,cym+h*.1+Math.sin(now/90+k)*2*s,2*s,0,7);cx.fill()}}
 if(T(r,'frozen')){cx.save();const bw=w*1.05,bh=h*1.05;const gr=cx.createLinearGradient(cxm-bw/2,cym-bh/2,cxm+bw/2,cym+bh/2);gr.addColorStop(0,'rgba(220,245,255,.75)');gr.addColorStop(1,'rgba(120,190,240,.55)');cx.fillStyle=gr;cx.strokeStyle='rgba(255,255,255,.95)';cx.lineWidth=2.5*s;cx.beginPath();cx.roundRect(cxm-bw/2,cym-bh/2,bw,bh,8*s);cx.fill();cx.stroke();cx.restore()}
 if(T(r,'webbed')){const wi=IM['it-web'],ww=w*1.1;cx.save();cx.globalAlpha=.9;cx.drawImage(wi,cxm-ww/2,cym-ww/2,ww,ww*wi.height/wi.width);cx.restore()}
 if(T(r,'dizzy')||(!mine&&T(r,'stun'))){for(let k=0;k<3;k++){const a=now/180+k*2.1;cx.fillStyle='#FFE45C';cx.font=`${10*s}px sans-serif`;cx.textAlign='center';cx.fillText('★',cxm+Math.cos(a)*16*s,y-4*s+Math.sin(a)*4*s)}}
 if(r.shield){const gr=cx.createRadialGradient(cxm-8*s,cym-10*s,2*s,cxm,cym,w*.62);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.7,'rgba(170,220,255,.18)');gr.addColorStop(1,'rgba(150,210,255,.55)');cx.fillStyle=gr;cx.beginPath();cx.arc(cxm,cym,w*.62,0,7);cx.fill()}
 if(T(r,'ram')){const gr=cx.createRadialGradient(cxm+10*s,cym,4*s,cxm,cym,w*.85);gr.addColorStop(0,'rgba(255,200,80,.0)');gr.addColorStop(.6,'rgba(255,120,30,.35)');gr.addColorStop(1,'rgba(255,60,20,0)');cx.fillStyle=gr;cx.beginPath();cx.arc(cxm,cym,w*.85,0,7);cx.fill()}
 if(T(r,'fire')){for(let k=0;k<10;k++){const a=k/10*Math.PI*2+now/250,rr=w*.6+Math.sin(now/80+k)*3*s;cx.fillStyle=k%2?'rgba(255,120,30,.75)':'rgba(255,210,80,.75)';cx.beginPath();cx.arc(cxm+Math.cos(a)*rr,cym+Math.sin(a)*rr,4*s,0,7);cx.fill()}}
 if(mine&&r.pull>0&&r.pullBy&&alive(r.pullBy)){const px=X(r.pullBy.x),py=Y(r.pullBy.y)-h/2;cx.save();cx.strokeStyle='rgba(200,120,255,.8)';cx.lineWidth=3*s;cx.setLineDash([6*s,6*s]);cx.lineDashOffset=-now/20;cx.beginPath();cx.moveTo(cxm,cym);cx.lineTo(px,py);cx.stroke();cx.restore()}
 cx.font=`800 ${9.5*s}px Mali, sans-serif`;cx.textAlign='center';const t=r.n,tw=cx.measureText(t).width+10*s;cx.fillStyle=mine?'rgba(242,140,40,.95)':'rgba(26,15,43,.55)';cx.beginPath();cx.roundRect(cxm-tw/2,y-15*s,tw,12*s,6*s);cx.fill();cx.fillStyle='#fff';cx.fillText(t,cxm,y-6*s);
}
let acc=0,lastT=0,shakeT=0,lastHUD=0,liveStop=null;
function loop(t){if($('game').hidden||state==='end'){lastT=0;return}if(!lastT)lastT=t;acc+=Math.min(100,t-lastT);lastT=t;let n=0;requestAnimationFrame(loop);try{while(acc>=16.667&&n<5){step();acc-=16.667;n++}draw();if(t-lastHUD>300){renderHUD();lastHUD=t}}catch(e){acc=0;console.error(e)}}
const HC={};function setH(id,h){if(HC[id]!==h){HC[id]=h;$(id).innerHTML=h}}
function renderHUD(){
 if(!me)return;setH('hearts',[0,1,2,3,4].map(i=>`<img src="${A}it-heart${i<me.hp?'':'-empty'}.webp" alt="">`).join(''));
 const u=$('use'),want=A+(myItem||'it-box')+'.webp';u.classList.toggle('empty',!myItem);if(!$('useimg').src.endsWith(want))$('useimg').src=want;
 const all=[me,...remotes.values()],ord=[...all].sort((a,b)=>((b.fin?1:0)-(a.fin?1:0))||((a.out?1:0)-(b.out?1:0))||b.x-a.x);
 setH('rank',ord.map((r,i)=>`<div class="${r===me?'me':''} ${r.out?'out':''}">${r.out?'💀':i+1}<img src="${A}ch-${CH[r.c][0]}.webp" alt="">${esc(r.n)}</div>`).join(''));
 if($('prog').children.length!==all.length)$('prog').innerHTML=all.map((r,k)=>`<i style="background-image:url(${A}ch-${CH[r.c][0]}.webp);border-color:${COLORS[k%6]}"></i>`).join('');
 all.forEach((r,k)=>{const e=$('prog').children[k];if(!e)return;e.style.left=Math.max(0,Math.min(100,r.x/LEN*100))+'%';e.style.opacity=r.out?.35:1});
}
/* ---------- ผล ---------- */
let rtimer;
function interim(){ // จบด่าน (ไม่ใช่ด่านสุดท้าย): คะแนนจากเซิร์ฟเวอร์
 const prevRound=room.round-1,reps=room.reports?.[prevRound]||{};endRace();game.interim=true;
 const rows=(room.seats||[]).map(s=>({...s,last:roundScore(reps[s.uid]).total,...(room.totals?.[s.uid]||{time:0,heart:0,got:0,total:0})})).sort((a,b)=>b.total-a.total);
 showResults(`🏁 จบด่าน ${prevRound}/${FR.ROUNDS}`,rows,false);
 clearInterval(rtimer);const lab=()=>{const n=Math.max(0,Math.ceil((room.roundStart-FR.ROUND_CD-SNow())/1000));$('rt').textContent=`⏳ ด่าน ${room.round} (${ZONES[room.round-1].nm}) เริ่มใน ${n} วินาที · ทุกคนได้ ❤️ เต็ม`;if(SNow()>=room.roundStart-FR.ROUND_CD){clearInterval(rtimer);startRound();}};lab();rtimer=setInterval(lab,250);
}
function finalResults(){endRace();if(game)game.final=true;else game={final:true};
 const rows=(room.results||[]).map(x=>({...x,...(room.totals?.[x.uid]||{})}));showResults('🏆 สรุปคะแนน 3 ด่าน',rows,true);
 clearInterval(rtimer);const lab=()=>{const n=Math.max(0,Math.ceil((room.doneAt+FR.RESULTS-SNow())/1000));$('rt').textContent=`กลับหน้าห้องใน ${n} วินาที`;if(n<=0){clearInterval(rtimer);cloud({type:'tick'},true);}};lab();rtimer=setInterval(lab,500);}
function showResults(title,rows,fin){
 $('game').hidden=true;$('lobby').hidden=true;$('results').hidden=false;$('rtitle').textContent=title;$('podium').hidden=!fin;$('home').hidden=!fin;
 const top=[rows[1],rows[0],rows[2]],hh=[60,86,44],cc=['#C0C7D4','#FFC94D','#E09A5A'],nn=[2,1,3];
 if(fin)$('podium').innerHTML=top.map((r,i)=>r?`<div class="pod">${i===1?'👑':''}<span class="spr big" style="background-image:url(${A}an/${esc(r.c)}-win.webp)"></span>${esc(r.name)}<div class="b" style="height:${hh[i]}px;width:66px;background:${cc[i]}">${nn[i]}</div></div>`:'').join('');
 $('rlist').innerHTML=rows.map((r,i)=>{const rw=fin?r.merit:null;return `<div class="row${r.uid===ME?' me':''}"><span>${i+1}</span><img src="${A}ch-${esc(r.c)}.webp" alt=""><div><div style="font-weight:800">${esc(r.name)}${!fin?` <small style="color:#B8601A">ด่านนี้ +${r.last}</small>`:''}</div><div class="sc"><span>⏱️ ${r.time||0}</span><span>❤️ ${r.heart||0}</span><span>🍬 ${r.got||0}</span></div></div><div style="text-align:right"><b data-v="${r.total||0}">0</b>${fin?`<div class="rw ${rw>0?'p':rw<0?'n':''}">${rw>0?'+':''}${(rw||0).toLocaleString('en-US')} 💛</div>`:''}</div></div>`;}).join('');
 document.querySelectorAll('#rlist b').forEach(b=>{const v=+b.dataset.v;let k=0;const t=setInterval(()=>{k=Math.min(v,k+Math.ceil(v/25)||v);b.textContent=k;if(k>=v)clearInterval(t)},40)});
 if(fin)for(let i=0;i<24;i++){const c=document.createElement('span');c.className='conf';c.textContent=['🎉','✨','🍬','⭐','🎃'][i%5];c.style.left=Math.random()*100+'%';c.style.setProperty('--dx',(Math.random()*80-40)+'px');c.style.animationDelay=Math.random()*.6+'s';$('results').append(c);setTimeout(()=>c.remove(),3500)}
}
$('home').onclick=()=>{clearInterval(rtimer);goHome();};
/* ห้องเปลี่ยน (ทุกคนฟัง world/funrun) */
function onWorld(r){if(r)setRoom(r);}
/* เส้นตายที่ต้องให้เซิร์ฟเวอร์ชำระ (ใครเห็นก่อนก็เรียกได้ ผลเหมือนกัน) */
const jitter=Math.random()*3000;
setInterval(()=>{const n=SNow();if(busy)return;
 if(room.status==='countdown'&&n>room.startAt+2000+jitter)cloud({type:'tick'},true);
 else if(room.status==='race'&&((room.first&&n>room.first+FR.CUTOFF+6000+jitter)||n>room.roundStart+FR.ROUND_MAX+11000+jitter))cloud({type:'tick'},true);
 else if(room.status==='results'&&n>room.doneAt+FR.RESULTS+1000+jitter)cloud({type:'tick'},true);
},1500);
function warm(){const wc=document.createElement('canvas').getContext('2d');const all=[...Object.values(IM),...Object.values(AN).flatMap(o=>Object.values(o))];all.forEach(i=>{(i.decode?i.decode():Promise.resolve()).then(()=>{try{wc.drawImage(i,0,0,1,1)}catch(e){}}).catch(()=>{})})}
warm();addEventListener('resize',()=>{if(!$('game').hidden)size()});
lobby();
const stopWorld=H.watchWorld('funrun',r=>onWorld(r));addEventListener('pagehide',()=>{stopWorld?.();liveStop?.();},{once:true});
cloud({type:'status'},true).then(o=>{if(o?.room)onWorld(o.room);});
