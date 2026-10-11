/* ฮาโลวีนวุ่น ตุ่นบุกสวน! — client screen (locked to preview v2). Round data and scoring come from the server. */
const CSS=__CSS__;
export function mountMole(host,api){
const root=host.attachShadow({mode:'open'});root.innerHTML=`<style>${CSS}</style><div id="wrap"><div id="stage"></div></div>`;
const IMGS={bg:'images/mole-bg.webp',hammer:'images/mole-hammer.webp'};
const CELLS={pumpkin:[186,253],vampire:[208,148],ghost:[216,206],witch:[193,197],mummy:[228,240],devil:[173,171]};
const NAMES={pumpkin:'ฟักทอง',vampire:'แวมไพร์',ghost:'ผี',witch:'แม่มด',mummy:'มัมมี่',devil:'ปีศาจ'};
const TYPES=Object.keys(CELLS);Object.assign(IMGS,{pumpkin:'images/mole-hit-pumpkin.webp',vampire:'images/mole-hit-vampire.webp',ghost:'images/mole-hit-ghost.webp',witch:'images/mole-hit-witch.webp',mummy:'images/mole-hit-mummy.webp',devil:'images/mole-hit-devil.webp'});
const A=api.assets?{...IMGS,...api.assets}:IMGS;
const HOLES=[[22.9,35.0],[50.2,35.0],[77.6,35.0],[22.6,45.4],[50.6,45.4],[78.0,45.3],[22.1,56.3],[49.8,56.5],[78.1,56.2],[21.7,67.6],[50.3,67.7],[78.3,67.6]];
const R0={GOLD_NEED:6,WIN:75000,BONUS:50000,LOSE:-15000,NEAR:.8,COST:2,MIN:15000};
const cost=()=>api.cost?api.cost():R0.COST;
const $=s=>root.querySelector(s), st=$('#stage');
const fmt=n=>(n>0?'+':n<0?'−':'')+Math.abs(Math.round(n)).toLocaleString('en-US');
const num=n=>Math.round(n).toLocaleString('en-US');
const rnd=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
$('#wrap').style.setProperty('--bgimg',`url(${A.bg})`);
function spriteStyle(type,displayW,frame=0){const [cw,ch]=CELLS[type],s=displayW/168;return `width:${cw*s}px;height:${ch*s}px;background-image:url(${A[type]});background-size:${cw*s*4}px ${ch*s*3}px;background-position:${(frame%4)*100/3}% ${Math.floor(frame/4)*50}%`;}
function iconStyle(type,box){const [cw,ch]=CELLS[type],s=box/Math.max(cw,ch)*1.05;return `background-image:url(${A[type]});background-size:${cw*s*4}px ${ch*s*3}px;background-position:${(box-cw*s)/2}px ${(box-ch*s)}px`;}
let ac=null,muted=false;function snd(kind){if(muted)return;try{ac ||= new (window.AudioContext||window.webkitAudioContext)();const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);
 const P={bonk:['square',220,90,.12,.18],gold:['triangle',880,1760,.25,.15],curse:['sawtooth',160,60,.3,.12],miss:['sine',120,70,.08,.12],tick:['square',1200,1200,.04,.05],win:['triangle',523,1046,.5,.18],lose:['sine',300,120,.5,.15]}[kind];
 o.type=P[0];o.frequency.setValueAtTime(P[1],t);o.frequency.exponentialRampToValueAtTime(P[2],t+P[3]);g.gain.setValueAtTime(P[4],t);g.gain.exponentialRampToValueAtTime(.001,t+P[3]);o.start(t);o.stop(t+P[3]+.02);}catch(e){}}
let R=null,G=null,W=0,H=0,holes=[],raf=0,dead=false,lobbyTimer=0;
function measure(){const r=st.getBoundingClientRect();W=r.width;H=r.height;}
function chipHTML(cls,box){return TYPES.map(t=>`<div class="${cls} ${R.roles[t]==='normal'?'':R.roles[t]}" title="${NAMES[t]}"><div class="ic" style="${iconStyle(t,box)}"></div><b>${fmt(R.values[t])}</b></div>`).join('');}
function lobbyAction(){const S=api.S,cd=(S.cd.mole||0)-api.time(),closed=api.closed?api.closed():S.solo?.mole==='closed';
 if(closed)return '<div class="wait">เกมนี้ปิดชั่วคราว</div>';
 if(cd>0)return `<div class="wait">พักก่อนนะ เล่นได้อีกใน <b>${Math.floor(cd/60000)}:${String(Math.ceil(cd/1000)%60).padStart(2,'0')}</b></div>`;
 const okC=api.lack?!api.lack():S.coins>=cost(),okK=S.kusal>=R0.MIN;
 return `${okC&&okK?'':`<div class="wait">${!okC?(api.lackText?api.lackText():'ใช้ '+cost()+' เหรียญ'):'ต้องมีกุศล '+num(R0.MIN)+' ขึ้นไป'}</div>`}<button class="go" id="goBtn" ${okC&&okK?'':'disabled'}>เริ่มตี! · ${api.feeText?api.feeText():'🪙 '+cost()}</button>`;}
function lobby(){cancelAnimationFrame(raf);G=null;R=api.offer();measure();if(!R){st.innerHTML='<div class="title">กำลังโหลด…</div>';return;}
 st.innerHTML=`<div class="title">ฮาโลวีนวุ่น<br>ตุ่นบุกสวน!<small>ตีตุ่นให้ถึงเป้าใน 60 วินาที</small></div>
 <div class="card"><div class="row"><h1>ค่าตุ่นรอบนี้</h1><button class="ibtn" id="rulesBtn">กติกา</button></div>
 <div class="vals">${chipHTML('v',W*.115)}</div>
 <div class="goal"><div class="t"><small>เป้าหมายรอบนี้</small><b>${num(R.target)}</b>${R.easy?'<br><span class="lucky">🍀 รอบดวงดี เป้าง่าย</span>':''}</div><div class="gb">ถึงเป้า +75,000<br>ตุ่นทอง ${R0.GOLD_NEED}/${R.goldTotal} +50,000</div></div>
 <div id="act">${lobbyAction()}</div></div>`;
 $('#rulesBtn').onclick=rules;bindGo();}
function bindGo(){const b=$('#goBtn');if(b)b.onclick=async()=>{b.disabled=true;const round=await api.start();if(round)play(round);else{b.disabled=false;}};}
function sheet(html){const s=document.createElement('div');s.className='sheet';s.innerHTML=`<div class="panel">${html}</div>`;st.appendChild(s);s.onclick=e=>{if(e.target===s)s.remove();};return s;}
function rules(){const s=sheet(`<h2>กติกา</h2><div class="rules">
 <div class="rule"><span class="e">🔨</span><div><b>แตะตุ่นเพื่อตี</b><span>60 วินาที ยิ่งท้ายยิ่งเร็ว</span></div></div>
 <div class="rule"><span class="e">🎯</span><div><b>ถึงเป้า +75,000</b><span>แต้มรวมต้องถึงเป้า</span></div></div>
 <div class="rule"><span class="e">✨</span><div><b>ตุ่นทอง ${R?.goldTotal||7} ตัว</b><span>ตีได้ 6 ตัว + ถึงเป้า = โบนัส +50,000</span></div></div>
 <div class="rule"><span class="e">☠️</span><div><b>ตุ่นต้องสาป</b><span>ตีโดนแล้วแต้มลด</span></div></div>
 <div class="rule"><span class="e">😮</span><div><b>เกือบถึง (80%)</b><span>ไม่ได้ ไม่เสีย</span></div></div>
 <div class="rule"><span class="e">💔</span><div><b>ต่ำกว่านั้น</b><span>เสีย 15,000 กุศล</span></div></div>
 <div class="rule wide"><span class="e">🎲</span><div><b>ค่าตุ่นและเป้าสุ่มใหม่ทุกรอบ</b><span>ดูค่าบนการ์ดก่อนกดเริ่ม · ${api.feeText?api.feeText():'🪙 '+cost()+' เหรียญ'} · พัก ${api.cdMin?api.cdMin():15} นาที</span></div></div></div><button class="close">เข้าใจแล้ว</button>`);s.querySelector('.close').onclick=()=>s.remove();}
// --- game (server timeline: round.start is when the first second begins; round.until is the end)
function play(round){R=round;measure();
 st.innerHTML=`<div class="hud"><div class="plate score"><b id="sc">0</b><small>เป้า ${num(R.target)}</small><div class="bar" id="bar"><i></i></div></div><div class="timer" id="tm">60</div><div class="plate goldbox" id="gb"><div class="gm" style="${iconStyle(R.gold,W*.08)}"></div><b id="gc">0/${R.goldTotal}</b></div></div>
 <div class="combo" id="combo"></div><div class="callout" id="call"></div><div class="legend">${chipHTML('chip',W*.1)}</div><button class="mute" id="mute">${muted?'🔇':'🔊'}</button>`;
 $('#mute').onclick=e=>{e.stopPropagation();muted=!muted;e.target.textContent=muted?'🔇':'🔊';};
 holes=HOLES.map(([x,y],i)=>{const el=document.createElement('div');el.className='hole';el.style.cssText=`left:${x}%;top:${y-17}%;height:17.6%;transform:translateX(-50%);z-index:${10+Math.floor(i/3)}`;el.innerHTML='<div class="glow"></div><div class="lip"></div>';st.appendChild(el);return {el,x:x/100*W,y:y/100*H,busy:null};});
 const already=new Set(R.hit||[]);
 G={score:R.score||0,golds:R.golds||0,combo:0,last:0,next:0,active:new Set(),over:false,queue:[],sending:false,done:already,count:null};
 updateHud();
 const pre=R.start-api.time();if(pre>0){const c=document.createElement('div');c.className='count';st.appendChild(c);G.count=c;}
 st.addEventListener('pointerdown',tap);G.flushIv=setInterval(flush,1500);raf=requestAnimationFrame(loop);}
function el(){return api.time()-R.start;}
function loop(){if(dead||!G||G.over)return;const t=el(),left=Math.max(0,(R.until-api.time())/1000);
 if(G.count){if(t<0){const n=Math.ceil(-t/1000);if(G.count.dataset.n!=n){G.count.dataset.n=n;G.count.innerHTML=`<span>${n}</span>`;snd('tick');}}else{G.count.innerHTML='<span>ตี!</span>';const c=G.count;G.count=null;setTimeout(()=>c.remove(),700);}}
 while(G.next<R.pops.length&&R.pops[G.next].at<=t){const p=R.pops[G.next++];if(t<p.at+p.up&&!G.done.has(p.i))spawn(p,t);}
 const nowp=performance.now();for(const m of [...G.active])if(!m.hit&&nowp>m.until)retire(m,false);
 const tm=$('#tm'),s=Math.ceil(Math.min(60,left));if(tm.textContent!=String(s)){tm.textContent=s;tm.classList.toggle('hot',s<=10);if(s<=5&&s>0&&t>0)snd('tick');}
 if(left<=0){finish();return;}raf=requestAnimationFrame(loop);}
function moleW(){return W*.19;}
function spawn(p,t){const h=holes[p.hole];if(h.busy)retire(h.busy,false);const m=document.createElement('div');m.className='mole';const ss=spriteStyle(p.type,moleW()),wh=ss.match(/width:[^;]+;height:[^;]+/)[0];m.style.cssText=wh+';bottom:-'+(H*.012)+'px';m.innerHTML=`<div class="spr" style="${ss}"></div>`;h.el.appendChild(m);h.el.classList.toggle('lit',R.roles[p.type]==='gold');
 const mole={p,h,el:m,type:p.type,born:performance.now(),until:performance.now()+(p.at+p.up-t),hit:false};h.busy=mole;G.active.add(mole);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{m.classList.add('up');setTimeout(()=>{if(!mole.hit&&m.classList.contains('up'))m.classList.add('idle');},140);}));dirt(h.x,h.y,4);}
function retire(m,hit){G.active.delete(m);m.h.el.classList.remove('lit');m.el.classList.remove('idle');if(!hit){m.el.classList.remove('up');m.el.classList.add('down');}setTimeout(()=>{m.el.remove();if(m.h.busy===m)m.h.busy=null;},hit?900:200);}
function tap(e){if(!G||G.over||el()<0)return;if(e.target.closest&&e.target.closest('#mute'))return;e.preventDefault();const r=st.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,now=performance.now();
 swing(x,y);let target=null,best=1e9;
 for(const m of G.active){if(m.hit||now-m.born<70)continue;const mw=moleW(),hx=m.h.x,hy=m.h.y;if(Math.abs(x-hx)<mw*.6&&y<hy+H*.02&&y>hy-mw*1.25){const d=Math.hypot(x-hx,y-(hy-mw*.5));if(d<best){best=d;target=m;}}}
 if(!target){G.combo=0;dust(x,y);snd('miss');return;}
 hitMole(target,now);}
function hitMole(m,now){m.hit=true;G.done.add(m.p.i);G.queue.push({i:m.p.i,t:Math.round(el())});if(G.queue.length>=10)flush();
 const v=R.values[m.type],role=R.roles[m.type],hx=m.h.x,hy=m.h.y-moleW()*.55;G.score+=v;
 m.el.classList.remove('idle');m.el.classList.add('hit');const sp=m.el.firstChild;let f=0;const iv=setInterval(()=>{f++;if(f>11){clearInterval(iv);m.el.classList.add('sink');m.el.classList.remove('up');return;}sp.style.backgroundPosition=`${(f%4)*100/3}% ${Math.floor(f/4)*50}%`;},45);
 retire(m,true);ring(hx,m.h.y-H*.01);
 if(role==='cursed'){G.combo=0;snd('curse');shake();vign('radial-gradient(ellipse at center,transparent 45%,rgba(150,20,80,.6))');burst(hx,hy,['#4a2a63','#7d4aa8','#2a1638'],14,true);popText(hx,hy,fmt(v),'#ffb3c4',false);call('☠️ ตุ่นต้องสาป!','#ffb3c4');}
 else{G.combo=now-G.last<1300?G.combo+1:1;G.last=now;
  if(role==='gold'){G.golds++;snd('gold');shake();vign('radial-gradient(ellipse at center,rgba(255,220,120,.35),transparent 70%)');burst(hx,hy,['#ffe07a','#ffc93c','#fff6cf','#ffffff'],26,false);stars(hx,hy,8);popText(hx,hy,fmt(v),'var(--gold)',true);
   if(G.golds===R0.GOLD_NEED){$('#gb').classList.add('ok');call('✨ ครบเงื่อนไขโบนัส!','var(--gold)');}else call('✨ ตุ่นทอง!','var(--gold)');}
  else{snd('bonk');burst(hx,hy,['#ffe9b0','#fff','#ffd36e'],10,false);stars(hx,hy,4);popText(hx,hy,fmt(v),'#fff',false);}
  if(G.combo>=3){const c=$('#combo');c.textContent=`คอมโบ x${G.combo}${G.combo>=6?' 🔥':''}`;c.classList.remove('on');void c.offsetWidth;c.classList.add('on');}}
 updateHud();}
function updateHud(){$('#sc').textContent=num(G.score);$('#gc').textContent=`${G.golds}/${R.goldTotal}`;const pct=Math.max(0,Math.min(1,G.score/R.target));$('#bar i').style.width=pct*100+'%';$('#bar').classList.toggle('done',G.score>=R.target);}
async function flush(){if(!G||G.sending||!G.queue.length)return true;G.sending=true;const batch=G.queue.splice(0,40);const ok=await api.hits(R.id,batch);if(!ok)G.queue.unshift(...batch);G.sending=false;return ok;}
// --- effects
function swing(x,y){const h=document.createElement('img');h.className='hammer';h.src=A.hammer;const w=W*.22;h.style.left=(x-w*.5)+'px';h.style.top=(y-w*.3)+'px';st.appendChild(h);
 h.animate([{transform:'rotate(48deg)'},{transform:'rotate(-6deg)',offset:.55},{transform:'rotate(0deg)'}],{duration:150,easing:'ease-in'}).onfinish=()=>h.animate([{opacity:1},{opacity:0}],{duration:160,delay:80,fill:'forwards'}).onfinish=()=>h.remove();}
function ring(x,y){const r=document.createElement('div');r.className='ring';r.style.left=x+'px';r.style.top=y+'px';st.appendChild(r);setTimeout(()=>r.remove(),400);}
function part(x,y,css,dx,dy,d,rot=0){const p=document.createElement('div');p.className='pt';p.style.cssText=`left:${x}px;top:${y}px;--dx:${dx}px;--dy:${dy}px;--d:${d}s;--r:${rot}deg;${css}`;st.appendChild(p);setTimeout(()=>p.remove(),d*1000+50);return p;}
function burst(x,y,cols,n,smoke){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=W*rnd(.08,.2),sz=W*rnd(.012,.03);part(x,y,`width:${sz}px;height:${sz}px;border-radius:50%;background:${pick(cols)}`,Math.cos(a)*s,Math.sin(a)*s-W*.03,rnd(.4,.7));}
 if(smoke)for(let i=0;i<6;i++){const sz=W*rnd(.06,.1);part(x+rnd(-1,1)*W*.04,y,`width:${sz}px;height:${sz}px;border-radius:50%;background:rgba(80,40,110,.7);filter:blur(2px)`,rnd(-1,1)*W*.04,-W*rnd(.05,.12),.8);}}
function stars(x,y,n){for(let i=0;i<n;i++){const a=-Math.PI*rnd(.1,.9),s=W*rnd(.1,.22);const p=part(x,y,'font-size:'+W*.05+'px;color:#ffe07a;text-shadow:0 0 6px #ffb800',Math.cos(a)*s,Math.sin(a)*s,rnd(.5,.8),rnd(-180,180));p.textContent='★';}}
function dirt(x,y,n){for(let i=0;i<n;i++){const d=document.createElement('div');d.className='dirt';d.style.left=(x+rnd(-1,1)*W*.04)+'px';d.style.top=(y-H*.005)+'px';d.style.setProperty('--dx',rnd(-1,1)*W*.05+'px');d.style.setProperty('--dy',-W*rnd(.03,.07)+'px');st.appendChild(d);setTimeout(()=>d.remove(),500);}}
function dust(x,y){ring(x,y);for(let i=0;i<7;i++){const sz=W*rnd(.025,.05);part(x,y,`width:${sz}px;height:${sz}px;border-radius:50%;background:rgba(150,110,70,.65)`,rnd(-1,1)*W*.07,-W*rnd(0,.05),.45);}}
function popText(x,y,s,c,big){const p=document.createElement('div');p.className='pop'+(big?' big':'');p.style.cssText=`left:${x}px;top:${y}px;color:${c}`;p.textContent=s;st.appendChild(p);setTimeout(()=>p.remove(),950);}
function call(s,c){const e=$('#call');e.textContent=s;e.style.color=c;e.classList.remove('on');void e.offsetWidth;e.classList.add('on');}
function shake(){st.classList.remove('shake');void st.offsetWidth;st.classList.add('shake');}
function vign(bg){const v=document.createElement('div');v.className='vign';v.style.background=bg;st.appendChild(v);setTimeout(()=>v.remove(),600);}
// --- result (the server decides the final score)
async function finish(){if(G.over)return;G.over=true;clearInterval(G.flushIv);st.removeEventListener('pointerdown',tap);for(const m of [...G.active])retire(m,false);
 const wait=sheet('<p class="sub">กำลังสรุปผล…</p>');wait.onclick=null;
 for(let k=0;k<6&&G.queue.length;k++){if(!await flush())await new Promise(r=>setTimeout(r,1200));}
 let done=null;for(let k=0;k<6&&!done;k++){done=await api.finish(R.id);if(!done)await new Promise(r=>setTimeout(r,1500));}
 wait.remove();if(dead)return;if(!done){sheet('<p class="verdict lose">ยังสรุปผลไม่ได้</p><p class="sub">เปิดเกมนี้ใหม่อีกครั้ง ผลรอบนี้จะสรุปให้อัตโนมัติ</p>');return;}
 const res=done.result,score=done.score,golds=done.golds,pass=res.pass,bonus=res.bonus,near=res.near,merit=res.merit;snd(pass?'win':'lose');
 const pct=Math.max(0,Math.min(1.15,score/done.target));
 const s=sheet(`<p class="verdict ${pass?'win':near?'near':'lose'}">${bonus?'สุดยอด! โบนัสทอง':pass?'ถึงเป้าแล้ว!':near?'เกือบแล้ว!':'ไม่ถึงเป้า'}</p>
  <p class="sub">ได้ ${num(score)} แต้ม จากเป้า ${num(done.target)}</p>
  <div class="meter"><i style="width:${Math.min(100,pct/1.15*100)}%"></i><div class="mk" style="left:${R0.NEAR/1.15*100}%"><span>80%</span></div><div class="mk" style="left:${1/1.15*100}%"><span>เป้า</span></div></div>
  <div class="lines"><div class="line"><span>ผลรอบนี้</span><b class="${pass?'p':near?'z':'n'}">${pass?fmt(R0.WIN):near?'0':fmt(R0.LOSE)}</b></div>
  <div class="line gold"><span>ตุ่นทอง ${golds}/${done.goldTotal}${pass?'':' · ต้องถึงเป้าก่อน'}</span><b class="${bonus?'p':'z'}">${bonus?fmt(R0.BONUS):'—'}</b></div>
  <div class="line"><span><b style="font-size:4cqw">รวมกุศล</b></span><b class="${merit>0?'p':merit<0?'n':'z'}">${merit===0?'0':fmt(merit)}</b></div></div>
  <p class="note">${merit>0?'รางวัลส่งเข้าไปรษณีย์แล้ว':merit<0?'หักกุศลแล้ว':'ไม่ได้ ไม่เสีย'}</p><button class="close" id="again">กลับหน้าเกม</button>`);
 s.onclick=null;s.querySelector('#again').onclick=()=>{G=null;lobby();};}
// resume an unfinished round after reopening the game
const cur=api.current();if(cur&&cur.phase==='active'){if(api.time()<cur.until)play(cur);else{R=cur;measure();G={over:false,active:new Set(),queue:[],score:cur.score,golds:cur.golds};finish();}}else lobby();
lobbyTimer=setInterval(()=>{const a=$('#act');if(!G&&R&&a){const h=lobbyAction();if(a.dataset.h!==h){a.dataset.h=h;a.innerHTML=h;bindGo();}}},1000);
return{canLeave(){return !G||G.over;},close(){dead=true;cancelAnimationFrame(raf);clearInterval(lobbyTimer);if(G)clearInterval(G.flushIv);}};
}
