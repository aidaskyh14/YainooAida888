/* S4 ข้อ 151/63 🎁 ของเข้ากระเป๋าให้เห็น: ทุกหน้าโซน (หมา/แมว/แฮมสเตอร์/อัลปาก้า/นก/โรงเรือน/บ้าน) เฝ้า S.bag
   ถ้าจำนวนชิ้นไหนเพิ่ม → ไอคอน/ชื่อของ "+n" เด้งกลางจอ ลอยขึ้น แล้วบินเข้าปุ่ม 🎒/☰ มุมล่าง · ไม่แตะเอนจิน S3 */
(function(){
 if(window.__s4gain)return;window.__s4gain=1;
 const NAME={};let prev=null,q=[],busy=0;
 const flat=(o,pre,out)=>{if(!o||typeof o!=='object')return out;for(const k in o){const v=o[k];if(v&&typeof v==='object'&&!Array.isArray(v))flat(v,pre+k+'.',out);else if(typeof v==='number')out[pre+k]=v;}return out;};
 const getS=()=>{try{return (0,eval)('typeof S!=="undefined"?S:null');}catch(e){return null;}};
 const snap=()=>{try{const S=getS();if(!S||!S.bag)return null;return flat(S.bag,'',{});}catch(e){return null;}};
 function label(path){const k=path.split('.').pop();try{const H=parent&&parent.__HOST;const c=H&&H.catalogItem&&H.catalogItem(path);if(c&&(c.n||c.i))return {n:c.n,i:c.i};}catch(e){}
  try{const g=(0,eval)('typeof FB!=="undefined"?FB:typeof DROPS!=="undefined"?DROPS:typeof CROPN!=="undefined"?CROPN:null');if(g&&g[k])return {n:typeof g[k]==='string'?g[k]:(g[k].n||g[k][0]||k)};}catch(e){}return {n:k};}
 const target=()=>{const t=document.getElementById('s4dock')||document.querySelector('#s4dbar button')||null;if(!t)return {x:innerWidth-40,y:innerHeight-40};const r=t.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};};
 if(!document.getElementById('s4gainCss')){const st=document.createElement('style');st.id='s4gainCss';st.textContent=`.s4gain{position:fixed;left:50%;top:46%;z-index:980;transform:translate(-50%,-50%) scale(.3);display:flex;align-items:center;gap:.35rem;background:#fff9ec;border:2px solid #f3c98a;border-radius:999px;padding:.3rem .8rem .3rem .4rem;box-shadow:0 6px 18px rgba(90,60,20,.3);font:800 15px Mali,sans-serif;color:#5B3B2A;pointer-events:none;visibility:visible!important;white-space:nowrap}@keyframes s4gainK{0%{transform:translate(-50%,-50%) scale(.3);opacity:0}18%{transform:translate(-50%,-60%) scale(1.08);opacity:1}60%{transform:translate(-50%,-62%) scale(1);opacity:1}100%{transform:translate(calc(var(--tx) - 50%),calc(var(--ty) - 50%)) scale(.25);opacity:.2}}.s4gain img{width:34px;height:34px;object-fit:contain}.s4gain i{font-style:normal;font-size:26px}.s4gain b{color:#1f9d55;margin-left:.2rem}`;document.head.appendChild(st);}
 function show(path,n){const L=label(path);const el=document.createElement('div');el.className='s4gain s4ov';el.innerHTML=(L.i?'<img src="'+(L.i.startsWith('images/')||L.i.startsWith('../')?L.i:'images/'+L.i)+'" alt="">':'<i>🎁</i>')+'<span>'+String(L.n||path).replace(/</g,'')+'</span><b>+'+n+'</b>';document.body.appendChild(el);
  const T=target();el.style.setProperty('--tx',(T.x-innerWidth/2)+'px');el.style.setProperty('--ty',(T.y-innerHeight*.46)+'px');el.style.animation='s4gainK 1.9s cubic-bezier(.4,0,.6,1) forwards';
  setTimeout(()=>{el.remove();const t=document.getElementById('s4dock');if(t){t.animate([{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:260});}},1950);}
 function pump(){if(busy||!q.length)return;busy=1;const [p,n]=q.shift();show(p,n);setTimeout(()=>{busy=0;pump();},q.length>3?300:650);}
 setInterval(()=>{const now=snap();if(!now)return;if(!prev){prev=now;return;}const gains=[];for(const k in now){const d=now[k]-(prev[k]||0);if(d>0&&d<100000&&!/^(item\.(fert|cake|coconut)|_)/.test(k))gains.push([k,d]);}
  if(gains.length&&gains.length<=12){for(const g of gains)q.push(g);pump();}prev=now;},700);
})();
