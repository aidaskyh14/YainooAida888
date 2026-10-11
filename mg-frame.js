/* fix13 — สะพานระหว่างหน้ามินิเกมเต็มจอ (iframe) กับหน้ามินิเกมหลัก. ใช้ร่วมกันโดย witch-game.js และ candy-game.js
   คุยกับหน้าแม่ผ่าน postMessage เท่านั้น (same-origin):
   page→parent  {mg:'ready'} · {mg:'start'} · {mg:'checkpoint',cp} · {mg:'finish',report} · {mg:'close'}
   parent→page  {mg:'init',game,fee:{coin,hat,mb},cooldownUntil,serverOffset,active,canPlay,why,[cdMin],[lack:{coin,hat,mb}]}
                {mg:'started',round} · {mg:'result',result:{gain,breakdown}} · {mg:'error',msg}
   finish ของรอบที่ค้าง (โหลดหน้าใหม่กลางเกม) = {mg:'finish',report:{abandon:true}} → เซิร์ฟเวอร์คิดผลแบบ abandon */
const $=id=>document.getElementById(id);
const fmt=n=>Math.round(n).toLocaleString('en-US');
const ICON={coin:'images/gacha-coin.webp',hat:'images/honey-sailorhat.webp',mb:'images/animals-item-musicbox.webp'};
const NAME={coin:'เหรียญ',hat:'หมวกกะลาสี',mb:'กล่องดนตรี'};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mmss=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};

export function mgFrame(game,hooks){
  const parent=window.parent&&window.parent!==window?window.parent:null;
  const target=location.origin&&location.origin!=='null'?location.origin:'*';
  const st={init:null,initAt:0,cdReason:false,phase:'idle',startTimer:null,lastReport:null,cps:0};
  const goTxt=$('goBtn').innerHTML;
  const post=m=>{if(!parent)return;try{parent.postMessage(m,target);}catch(e){}};
  const serverNow=()=>Date.now()+(Number(st.init&&st.init.serverOffset)||0);
  let noteT=null;
  function toast(msg,ms=3600){const n=$('note');n.textContent=msg;n.classList.remove('hide');clearTimeout(noteT);noteT=setTimeout(()=>n.classList.add('hide'),ms);}

  function status(){
    const i=st.init,go=$('goBtn'),fee=$('fee'),stat=$('stat'),stale=$('stale');
    if(st.phase!=='idle')return;
    if(!parent){fee.innerHTML='';stat.innerHTML='<span class="no">🎮 เปิดเล่นผ่านหน้ามินิเกมในเกม</span>';go.classList.add('off');stale.classList.add('hide');return;}
    if(!i){stat.innerHTML='<span class="wait">⏳ กำลังโหลด…</span>';go.classList.add('off');return;}
    const f=i.fee||{},lack=i.lack||{};
    fee.innerHTML=['coin','hat','mb'].map(k=>'<span class="'+(lack[k]?'no':'')+'" title="'+NAME[k]+'"><img src="'+ICON[k]+'" alt="'+NAME[k]+'">'+fmt(+f[k]||0)+'</span>').join('')+
      (i.cdMin?'<span class="cd">⏳ '+fmt(i.cdMin)+'′</span>':'');
    if(i.active){
      go.classList.add('hide');stat.innerHTML='';stale.classList.remove('hide');
      const other=i.active.game&&i.active.game!==game;
      stale.innerHTML='<h3>⚠️ รอบเดิมค้างอยู่</h3>'+
        (other?'<div class="sub">มีรอบมินิเกมอื่นที่ยังไม่จบ<br>กลับไปปิดรอบนั้นก่อนนะ</div>'
          :'<div class="sub">เกมถูกปิดไประหว่างเล่น · ปิดรอบนี้ก่อนเริ่มใหม่</div>'+(hooks.staleInfo?hooks.staleInfo(i.active):'')+
           '<button class="go" id="staleGo">📮 ปิดรอบนี้และดูผล</button><div class="hint">คิดผลจากจุดเช็กล่าสุด เหมือนเสียหัวใจที่เหลือตรงนั้น</div>');
      const b=$('staleGo');if(b)b.onclick=abandon;
      return;
    }
    stale.classList.add('hide');go.classList.remove('hide');
    const left=(+i.cooldownUntil||0)-serverNow();
    if(left>0){stat.innerHTML='<span class="wait">⏳ พักอีก '+mmss(left)+' นาที</span>';go.classList.add('off');return;}
    if(!i.canPlay&&!st.cdReason){stat.innerHTML='<span class="no">🚫 '+esc(i.why||'ยังเล่นไม่ได้ตอนนี้')+'</span>';go.classList.add('off');return;}
    stat.innerHTML='';go.classList.remove('off');
  }
  setInterval(()=>{if(st.phase==='idle'&&st.init&&!$('start').classList.contains('hide'))status();},1000);

  function setPhase(p){st.phase=p;if(p==='idle'){const g=$('goBtn');g.innerHTML=goTxt;status();}}
  function start(){
    if(st.phase!=='idle')return;
    const go=$('goBtn');
    if(go.classList.contains('off')){go.classList.remove('shake');void go.offsetWidth;go.classList.add('shake');
      const t=$('stat').textContent.trim();if(t)toast(t);return;}
    st.phase='starting';go.innerHTML='⏳ กำลังเริ่ม…';st.cps=0;
    post({mg:'start'});
    clearTimeout(st.startTimer);st.startTimer=setTimeout(()=>{if(st.phase==='starting'){setPhase('idle');toast('📶 เชื่อมต่อช้า ลองกดอีกครั้งนะ');post({mg:'ready'});}},25000);
  }
  function checkpoint(cp){if(st.phase!=='play'||st.cps>=10)return;st.cps++;post({mg:'checkpoint',cp});}
  function finish(report){st.lastReport=report;st.phase='sending';post({mg:'finish',report});}
  function retry(){if(st.lastReport){st.phase='sending';post({mg:'finish',report:st.lastReport});}}
  function abandon(){if(st.phase!=='idle')return;hooks.onSending&&hooks.onSending(true);finish({abandon:true});}
  function close(){st.lastReport=null;setPhase('idle');post({mg:'close'});}

  addEventListener('message',e=>{
    if(!parent||e.source!==parent)return;if(target!=='*'&&e.origin!==target)return;
    const m=e.data;if(!m||typeof m!=='object')return;
    if(m.mg==='init'){
      if(m.game&&m.game!==game)return;
      st.init=m;st.initAt=Date.now();st.cdReason=!m.canPlay&&(+m.cooldownUntil||0)>serverNow();
      if(st.phase==='idle')status();
    }else if(m.mg==='started'){
      if(st.phase!=='starting'||!m.round||typeof m.round.seed!=='string')return;
      clearTimeout(st.startTimer);st.phase='play';$('goBtn').innerHTML=goTxt;
      if(st.init)st.init={...st.init,active:null};
      hooks.onStarted(m.round);
    }else if(m.mg==='result'){
      if(st.phase!=='sending'||!m.result)return;
      st.phase='result';st.lastReport=null;if(st.init)st.init={...st.init,active:null};
      hooks.onResult(m.result);
    }else if(m.mg==='error'){
      const msg=String(m.msg||'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง');
      if(st.phase==='starting'){clearTimeout(st.startTimer);setPhase('idle');toast('⚠️ '+msg,4500);}
      else if(st.phase==='sending'){st.phase='error';hooks.onFinishError(msg);}
      else if(st.phase==='idle')toast('⚠️ '+msg,4500);
    }
  });
  status();post({mg:'ready'});
  return {start,checkpoint,finish,retry,close,toast,status,setPhase,get phase(){return st.phase;},get init(){return st.init;},canRetry:()=>!!st.lastReport};
}
