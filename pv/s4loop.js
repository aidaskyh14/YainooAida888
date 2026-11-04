/* ซีซัน 4 · ตัวคุมการวาดฉาก 3D ทุกโซน (ลดเครื่องร้อน)
   กติกา: วาดเต็มเฟรมเฉพาะตอน "มีอะไรขยับจริง" (แตะ/ลาก/ซูม · ตัวละครเดิน · กล้องเลื่อน · งานที่สั่ง)
   หลังนิ่ง 1.5 วิ → ลดเหลือ 20 เฟรม/วิ (น้ำ/สัตว์ขยับเบาๆ) · หลังนิ่ง 8 วิ → 1 เฟรม/2 วิ จนกว่าจะมีการแตะ/ข้อความใหม่
   สลับแท็บ/ซ่อนหน้า/มีหน้าต่างทับ (hold) → หยุดวาดทันที
   ใช้: S4LOOP.run(dt=>{...วาด...}) · S4LOOP.wake('เหตุผล') เมื่อมีอะไรเริ่มขยับ · S4LOOP.hold('ชื่อ',true/false) เมื่อเปิด/ปิดหน้าต่างทับ
        S4LOOP.busy(()=>กำลังเดิน/กำลังมีอนิเมชันสำคัญ) บอกว่าเมื่อไหร่ต้องวาดเต็มเฟรม · S4LOOP.every(ms,fn) ตัวจับเวลาที่หยุดตอนหลับ */
(function(){
 if(window.S4LOOP)return;
 const S={last:performance.now(),wakeT:performance.now(),holds:new Set(),busyFns:[],fn:null,raf:0,timers:[],stat:{frames:0,skipped:0,mode:'full'},debug:false};
 const now=()=>performance.now();
 const FULL=1500,AMBIENT=8000,AMB_FPS=20;
 const wake=(why)=>{S.wakeT=now();if(!S.raf&&S.fn)S.raf=requestAnimationFrame(tick);if(S.debug&&why)console.log('[s4loop] wake',why);};
 const hidden=()=>document.hidden||!!window.__s4pause||S.holds.size>0;
 const isBusy=()=>{for(const f of S.busyFns){try{if(f())return true;}catch(e){}}return false;};
 let lastDraw=0;
 function tick(t){S.raf=0;if(!S.fn)return;
  if(hidden()){S.stat.mode='hold';S.last=t;S.raf=requestAnimationFrame(tick);return;}
  const idle=t-S.wakeT;let mode='full';
  if(isBusy())S.wakeT=t;else if(idle>AMBIENT)mode='sleep';else if(idle>FULL)mode='ambient';
  S.stat.mode=mode;
  if(mode==='sleep'){/* หลับ: วาด 1 เฟรมทุก 2 วิ (กันภาพหาย/ถ่ายรูปได้) ตื่นเต็มเมื่อ wake() */if(t-lastDraw<2000){S.stat.skipped++;S.raf=0;setTimeout(()=>{if(!S.raf&&S.fn)S.raf=requestAnimationFrame(tick);},2000-(t-lastDraw));return;}}
  if(mode==='ambient'&&t-lastDraw<1000/AMB_FPS){S.stat.skipped++;S.raf=requestAnimationFrame(tick);return;}
  const dt=Math.min(.05,(t-S.last)/1000);S.last=t;lastDraw=t;S.stat.frames++;
  try{S.fn(dt,t,mode);}catch(e){console.error('[s4loop]',e);}
  S.raf=requestAnimationFrame(tick);}
 function run(fn){S.fn=fn;S.last=now();wake('run');}
 function hold(name,on){if(on)S.holds.add(name);else S.holds.delete(name);if(!on)wake('release '+name);}
 function busy(f){S.busyFns.push(f);}
 function every(ms,f){const o={ms,f,at:now()+ms};S.timers.push(o);return ()=>{const i=S.timers.indexOf(o);if(i>=0)S.timers.splice(i,1);};}
 /* ตัวจับเวลาแบบประหยัด: เช็คทุก 250ms เฉพาะตอนหน้าไม่ซ่อน */
 setInterval(()=>{if(document.hidden)return;const t=now();for(const o of S.timers)if(t>=o.at){o.at=t+o.ms;try{o.f();}catch(e){console.error('[s4loop timer]',e);}}},250);
 /* เหตุการณ์ที่ทำให้ตื่น */
 const WAKE_EV=['pointerdown','pointermove','pointerup','touchstart','touchmove','touchend','wheel','keydown','resize'];
 for(const ev of WAKE_EV)addEventListener(ev,()=>wake(ev),{passive:true,capture:true});
 addEventListener('message',()=>wake('msg'));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake('visible');});
 window.S4LOOP={run,wake,hold,busy,every,stat:()=>({...S.stat,holds:[...S.holds]}),set debug(v){S.debug=v;}};
})();
