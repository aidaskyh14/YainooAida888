/* ======================================================================
   V199 — WIMAN DOG MULTI TEST / SIZE + PERFORMANCE
   - Separate Wiman namespace; does NOT use dog-01-* assets.
   - Multi-dog test only: place/remove, idle, walk front/back/diag, special.
   - Keeps the existing Wiman shadow system from style.css unchanged.
   - Dogs render clearly larger for easier visual testing.
   - Diagonal pose is compensated in code so it no longer shrinks visually.
   - One shared requestAnimationFrame drives all sprite frames (not one interval per dog).
   - Animation sheets are loaded on demand (no preload of all heavy sprites).
   ====================================================================== */
(function YN_V199_WIMAN_DOG_MULTI_TEST(){
  "use strict";

  const VERSION="199";
  const DOG_SIZE="clamp(64px,16vw,110px)"; // clearly larger than V198
  const DIAG_WIDTH="94%";   // keep diagonal frame aspect while compensating its smaller source canvas
  const DIAG_HEIGHT="113%";

  const bg=`wiman-palace-bg-v1.jpeg?v=${VERSION}`;

  const makeAssets=n=>{
    const nn=String(n).padStart(2,"0");
    const base=`wiman-palace-dog${nn}`;
    return {
      icon:`${base}-icon.png?v=${VERSION}`,
      idle:`${base}-idle.png?v=${VERSION}`,
      front:`${base}-walk-front.png?v=${VERSION}`,
      back:`${base}-walk-back.png?v=${VERSION}`,
      diag:`${base}-walk-diag-right.png?v=${VERSION}`,
      special:`${base}-special.png?v=${VERSION}`
    };
  };

  const DOGS=Array.from({length:8},(_,i)=>{
    const n=i+1;
    const nn=String(n).padStart(2,"0");
    return {
      id:`WIMAN-DOG-${nn}`,
      n,
      name:n===1?"น้องหมาโจรสลัดสีชมพู":`น้องหมาทดสอบตัวที่ ${n}`,
      asset:makeAssets(n)
    };
  });

  const DOG_BY_ID=new Map(DOGS.map(d=>[d.id,d]));

  const NODES=[
    [50,82],[39,77],[61,77],[31,69],[48,69],[68,69],
    [31,60],[43,59],[57,59],[70,60],[36,51],[50,51],
    [64,51],[40,43],[52,43],[61,43],[45,36.5],[55,36.5]
  ];

  // Spread initial positions so several dogs can be tested together.
  const STARTS=[
    [39,77],[61,77],[31,69],[48,69],
    [68,69],[31,60],[50,59],[70,60]
  ];

  const controllers=new Map();
  let animationRaf=0;

  const byId=id=>document.getElementById(id);
  const rand=(a,b)=>a+Math.random()*(b-a);
  const pick=a=>a[Math.floor(Math.random()*a.length)];

  function isAida(){
    try{
      return String(typeof currentMember!=="undefined"?currentMember:"")==="Aida"
        || String(typeof currentMemberKey!=="undefined"?currentMemberKey:"")==="aida"
        || (typeof adminProfile!=="undefined" && adminProfile?.role==="admin");
    }catch(_){ return false; }
  }

  function memberStoragePart(){
    try{return String(currentMemberKey||currentMember||"aida")}
    catch(_){return "aida"}
  }

  function storageKey(dogId){
    const dog=DOG_BY_ID.get(dogId);
    const nn=String(dog?.n||1).padStart(2,"0");
    // DOG-01 keeps the exact V197 key so the existing placement is preserved.
    if(nn==="01")return `yainoo-wiman-palace-dog01-v1:${memberStoragePart()}`;
    return `yainoo-wiman-palace-dog${nn}-v1:${memberStoragePart()}`;
  }

  function placed(dogId){
    try{return localStorage.getItem(storageKey(dogId))==="1"}
    catch(_){return false}
  }

  function setPlaced(dogId,v){
    try{localStorage.setItem(storageKey(dogId),v?"1":"0")}
    catch(_){}
  }

  function refreshShortcut(){
    const btn=byId("shortcutDogPalaceBtn");
    if(!btn)return;
    const ok=isAida();
    const small=btn.querySelector("small");
    const tail=btn.querySelector("i");
    btn.classList.toggle("wiman-aida-unlocked",ok);
    if(small)small.textContent=ok?"พื้นที่ส่วนตัวของ Aida":"โปรดติดตามซีซั่นต่อไป";
    if(tail)tail.textContent=ok?"›":"🔒";
  }

  function showComingSoon(){
    if(typeof message==="function")message("🏰 วิมานหมา","โปรดติดตามซีซั่นต่อไป");
  }

  function leaveWiman(){
    stopAllDogs();
    try{
      if(typeof currentScene!=="undefined")currentScene=null;
      if(typeof closeModal==="function")closeModal();
    }catch(_){}
    byId("sceneScreen")?.classList.add("hidden");
    byId("gameScreen")?.classList.remove("hidden");
  }

  function openWiman(){
    if(!isAida()){showComingSoon();return}

    stopAllDogs();
    try{
      if(typeof stopSceneTimer==="function")stopSceneTimer();
      if(typeof currentScene!=="undefined")currentScene="wimanDogSafe";
    }catch(_){}

    byId("gameScreen")?.classList.add("hidden");
    const scene=byId("sceneScreen");
    if(!scene)return;
    scene.classList.remove("hidden");
    scene.dataset.scene="wimanDogSafe";
    scene.style.backgroundImage=`url("${bg}")`;

    const back=byId("sceneBackBtn");
    const next=byId("sceneNextBtn");
    if(back){
      back.classList.remove("hidden");
      back.textContent="กลับไปที่แปลงผัก";
      back.onclick=leaveWiman;
    }
    if(next)next.classList.add("hidden");

    const layer=byId("sceneInteractiveLayer");
    if(!layer)return;
    layer.innerHTML=`
      <button id="wimanDogInventoryBtn" class="wiman-dog-inventory-button" type="button">
        <span class="paw">🐾</span><span>หมาที่คุณมี</span>
      </button>
      <div id="wimanDogPetLayer" class="wiman-dog-pet-layer" aria-label="พื้นที่เดินเล่นของน้องหมา"></div>
    `;

    byId("wimanDogInventoryBtn").onclick=showInventory;

    DOGS.forEach((dog,i)=>{
      if(placed(dog.id))mountDog(dog,i);
    });
  }

  function dogCardHTML(dog){
    const active=placed(dog.id);
    return `
      <article class="wiman-dog-card" data-wiman-dog-card="${dog.id}">
        <div class="wiman-dog-card-art">
          <img src="${dog.asset.icon}" alt="${dog.id}" loading="lazy" decoding="async">
        </div>
        <div class="wiman-dog-card-copy">
          <b>${dog.id}</b>
          <span>${dog.name}</span>
          <span class="wiman-dog-status-pill">${active?"● กำลังเดินเล่นในวิมาน":"○ อยู่ในรายการของคุณ"}</span>
          <button data-wiman-dog-toggle="${dog.id}" class="${active?"is-placed":""}" type="button">
            ${active?"เก็บหมากลับ":"วางหมา"}
          </button>
        </div>
      </article>
    `;
  }

  function showInventory(){
    if(!isAida())return;
    const modalContent=byId("modalContent");
    if(!modalContent)return;

    modalContent.innerHTML=`
      <section class="feature-panel wiman-dog-inventory-panel">
        <span class="wiman-dog-panel-kicker">WIMAN DOG TEST V199</span>
        <h2>🐾 หมาที่คุณมี</h2>
        <p class="wiman-dog-panel-sub">DOG-01 ถึง DOG-08 • เลือกวางเพื่อทดสอบการเดินและแอนิเมชัน</p>
        <div class="wiman-dog-test-list" style="display:grid;gap:10px;max-height:58vh;overflow:auto;padding:2px 3px 8px">
          ${DOGS.map(dogCardHTML).join("")}
        </div>
        <p class="wiman-dog-panel-note">ทดสอบขนาด/ทิศทาง/ความลื่นไหล • ใช้วงรอบแอนิเมชันร่วมกันเพื่อลดภาระเมื่อวางหลายตัว</p>
      </section>
    `;

    if(typeof openModal==="function")openModal();

    modalContent.querySelectorAll("[data-wiman-dog-toggle]").forEach(btn=>{
      btn.onclick=()=>{
        const dogId=btn.dataset.wimanDogToggle;
        const dog=DOG_BY_ID.get(dogId);
        if(!dog)return;

        const next=!placed(dogId);
        setPlaced(dogId,next);

        if(next){
          mountDog(dog,DOGS.indexOf(dog));
          if(typeof showWeatherToast==="function")showWeatherToast(`🐶 วาง ${dogId} ในวิมานแล้ว`);
        }else{
          stopDog(dogId);
          if(typeof showWeatherToast==="function")showWeatherToast(`🐾 เก็บ ${dogId} กลับแล้ว`);
        }

        // Refresh just this card without closing the list, making multi-dog tests quicker.
        const card=modalContent.querySelector(`[data-wiman-dog-card="${dogId}"]`);
        if(card){
          const fresh=document.createElement("div");
          fresh.innerHTML=dogCardHTML(dog).trim();
          card.replaceWith(fresh.firstElementChild);
          const newBtn=modalContent.querySelector(`[data-wiman-dog-toggle="${dogId}"]`);
          if(newBtn)newBtn.onclick=btn.onclick;
        }
      };
    });
  }

  function framePosition(i){
    const col=i%4,row=Math.floor(i/4);
    return `${col*100/3}% ${row*100/3}%`;
  }

  function alive(c){
    return !!c && controllers.get(c.dog.id)===c;
  }

  function setFrame(c,kind,frame,left=false){
    if(!alive(c)||!c.sprite)return;
    c.kind=kind;
    c.sprite.dataset.kind=kind;
    c.sprite.classList.toggle("face-left",!!left);

    // style.css V195 intentionally renders diagonal at 66% x 80%.
    // Override it only at render time; source PNG files remain untouched.
    if(kind==="diag"){
      c.sprite.style.width=DIAG_WIDTH;
      c.sprite.style.height=DIAG_HEIGHT;
    }else{
      c.sprite.style.width="100%";
      c.sprite.style.height="100%";
    }

    c.sprite.style.backgroundImage=`url("${c.dog.asset[kind]}")`;
    c.sprite.style.backgroundSize="400% 400%";
    c.sprite.style.backgroundPosition=framePosition(frame%16);
  }

  function ensureAnimationRaf(){
    if(animationRaf || !controllers.size)return;
    animationRaf=requestAnimationFrame(animationTick);
  }

  function animationTick(now){
    animationRaf=0;
    if(!controllers.size)return;

    controllers.forEach(c=>{
      if(!alive(c)||!c.anim)return;
      if(now<c.anim.nextAt)return;

      // Do not "catch up" dozens of frames after a background-tab pause.
      c.anim.nextAt=now+c.anim.ms;
      c.anim.frame++;

      if(c.anim.once && c.anim.frame>=16){
        const done=c.anim.done;
        setAnimation(c,"idle",false,205,false,null,now);
        if(typeof done==="function")done();
        return;
      }

      c.anim.frame%=16;
      setFrame(c,c.anim.kind,c.anim.frame,c.anim.left);
    });

    if(controllers.size)animationRaf=requestAnimationFrame(animationTick);
  }

  function setAnimation(c,kind,left=false,ms=180,once=false,done=null,now=performance.now()){
    if(!alive(c))return;
    c.anim={kind,left,ms,once,done,frame:0,nextAt:now+ms};
    setFrame(c,kind,0,left);
    ensureAnimationRaf();
  }

  function animateLoop(c,kind,left=false,ms=180){
    setAnimation(c,kind,left,ms,false,null);
  }

  function playSpecial(c,done){
    if(!alive(c))return;
    c.el.classList.remove("is-moving");
    setAnimation(c,"special",false,105,true,done);
  }

  function mountDog(dog,index=0){
    if(!isAida()||!dog||!placed(dog.id))return;
    const layer=byId("wimanDogPetLayer");
    if(!layer)return;

    // Remount only this dog; never stop the other dogs.
    stopDog(dog.id);

    const el=document.createElement("div");
    el.className="wiman-dog-pet";
    el.dataset.wimanDogId=dog.id;
    el.tabIndex=0;

    // Bigger visual size only. Shadow CSS remains exactly the same system/rules.
    el.style.setProperty("--wiman-dog-size",DOG_SIZE);

    el.innerHTML=`<span class="wiman-dog-sprite" data-kind="idle"></span><span class="wiman-dog-touch-hint">แตะเล่นกับน้อง</span>`;
    layer.appendChild(el);

    const sprite=el.querySelector(".wiman-dog-sprite");
    const start=STARTS[index%STARTS.length];
    el.style.left=`${start[0]}%`;
    el.style.top=`${start[1]}%`;
    el.style.zIndex=String(30+Math.round(start[1]));

    const c={
      dog,el,sprite,
      x:start[0],y:start[1],
      node:-1,timer:0,anim:null
    };
    controllers.set(dog.id,c);

    // Only the idle sheet is requested immediately for a placed dog.
    animateLoop(c,"idle",false,205);

    const touch=()=>{
      if(!alive(c))return;
      if(c.timer)clearTimeout(c.timer);
      playSpecial(c,()=>scheduleNext(c,1000));
    };
    el.onclick=touch;
    el.onkeydown=e=>{
      if(e.key==="Enter"||e.key===" "){e.preventDefault();touch()}
    };

    // Stagger starts so 8 dogs do not move in lockstep.
    scheduleNext(c,rand(1600,3200)+(index*120));
  }

  function scheduleNext(c,delay){
    if(!alive(c))return;
    if(c.timer)clearTimeout(c.timer);
    c.timer=setTimeout(()=>{
      if(!alive(c)||!placed(c.dog.id))return;
      if(Math.random()<.18)return playSpecial(c,()=>scheduleNext(c,rand(1700,3200)));
      walkNext(c);
    },delay);
  }

  function chooseNode(c){
    const candidates=NODES.map((p,i)=>({p,i}))
      .filter(x=>x.i!==c.node)
      .filter(x=>Math.hypot(x.p[0]-c.x,x.p[1]-c.y)>8);
    return pick(candidates.length?candidates:NODES.map((p,i)=>({p,i})));
  }

  function walkNext(c){
    if(!alive(c))return;
    const next=chooseNode(c);
    const tx=next.p[0],ty=next.p[1];
    const dx=tx-c.x,dy=ty-c.y;
    const rect=byId("sceneScreen")?.getBoundingClientRect();
    const dist=rect?Math.hypot(dx*rect.width/100,dy*rect.height/100):Math.hypot(dx,dy)*6;

    // Same movement speed/range as DOG-01 V197.
    const duration=Math.max(3000,Math.min(7000,dist/rand(24,29)*1000));

    const ax=Math.abs(dx),ay=Math.abs(dy);
    let kind="diag";
    const left=dx<0;
    if(ay>ax*.92)kind=dy>0?"front":"back";

    c.el.classList.add("is-moving");
    animateLoop(c,kind,kind==="diag"&&left,155);
    c.el.style.zIndex=String(30+Math.round(ty));
    c.el.style.transition=`left ${duration}ms linear, top ${duration}ms linear`;

    requestAnimationFrame(()=>{
      if(alive(c)){
        c.el.style.left=`${tx}%`;
        c.el.style.top=`${ty}%`;
      }
    });

    c.timer=setTimeout(()=>{
      if(!alive(c))return;
      c.x=tx;c.y=ty;c.node=next.i;
      c.el.classList.remove("is-moving");
      c.el.style.transition="none";
      animateLoop(c,"idle",false,205);
      scheduleNext(c,rand(1700,3900));
    },duration+40);
  }

  function stopDog(dogId){
    const c=controllers.get(dogId);
    if(!c)return;
    controllers.delete(dogId);
    if(c.timer)clearTimeout(c.timer);
    c.anim=null;
    c.el?.remove();

    if(!controllers.size && animationRaf){
      cancelAnimationFrame(animationRaf);
      animationRaf=0;
    }
  }

  function stopAllDogs(){
    [...controllers.keys()].forEach(stopDog);
    if(animationRaf){
      cancelAnimationFrame(animationRaf);
      animationRaf=0;
    }
  }

  // Capture-phase binding that runs after the original game code.
  document.addEventListener("click",e=>{
    const btn=e.target?.closest?.("#shortcutDogPalaceBtn");
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    refreshShortcut();
    if(isAida())openWiman();
    else showComingSoon();
  },true);

  refreshShortcut();
  setTimeout(refreshShortcut,250);
  setTimeout(refreshShortcut,1000);
  setInterval(refreshShortcut,1200);

  // Keep initial game load light: preload only the Wiman background.
  // Icons load when inventory opens; heavy 4x4 animation sheets load on demand.
  try{
    const img=new Image();
    img.decoding="async";
    img.src=bg;
  }catch(_){}

  window.YN_WIMAN_DOG_SAFE={
    open:openWiman,
    inventory:showInventory,
    refresh:refreshShortcut,
    stop:stopAllDogs,
    stopDog,
    dogs:DOGS.map(d=>d.id)
  };
})();
