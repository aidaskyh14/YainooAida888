/* ======================================================================
   V197 — WIMAN DOG SAFE NAMESPACE
   Separate file + separate asset namespace. Does NOT use dog-01-* assets.
   ====================================================================== */
(function YN_V197_WIMAN_DOG_SAFE(){
  "use strict";

  const VERSION="197";
  const ASSET={
    bg:`wiman-palace-bg-v1.jpeg?v=${VERSION}`,
    icon:`wiman-palace-dog01-icon.png?v=${VERSION}`,
    idle:`wiman-palace-dog01-idle.png?v=${VERSION}`,
    front:`wiman-palace-dog01-walk-front.png?v=${VERSION}`,
    back:`wiman-palace-dog01-walk-back.png?v=${VERSION}`,
    diag:`wiman-palace-dog01-walk-diag-right.png?v=${VERSION}`,
    special:`wiman-palace-dog01-special.png?v=${VERSION}`
  };

  const NODES=[
    [50,82],[39,77],[61,77],[31,69],[48,69],[68,69],
    [31,60],[43,59],[57,59],[70,60],[36,51],[50,51],
    [64,51],[40,43],[52,43],[61,43],[45,36.5],[55,36.5]
  ];

  let controller=null;

  const byId=id=>document.getElementById(id);

  function isAida(){
    try{
      return String(typeof currentMember!=="undefined"?currentMember:"")==="Aida"
        || String(typeof currentMemberKey!=="undefined"?currentMemberKey:"")==="aida"
        || (typeof adminProfile!=="undefined" && adminProfile?.role==="admin");
    }catch(_){ return false; }
  }

  function storageKey(){
    let key="aida";
    try{ key=String(currentMemberKey||currentMember||"aida"); }catch(_){}
    return `yainoo-wiman-palace-dog01-v1:${key}`;
  }
  function placed(){try{return localStorage.getItem(storageKey())==="1"}catch(_){return false}}
  function setPlaced(v){try{localStorage.setItem(storageKey(),v?"1":"0")}catch(_){}}
  function rand(a,b){return a+Math.random()*(b-a)}
  function pick(a){return a[Math.floor(Math.random()*a.length)]}

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
    stopDog();
    try{
      if(typeof currentScene!=="undefined")currentScene=null;
      if(typeof closeModal==="function")closeModal();
    }catch(_){}
    byId("sceneScreen")?.classList.add("hidden");
    byId("gameScreen")?.classList.remove("hidden");
  }

  function openWiman(){
    if(!isAida()){showComingSoon();return}

    stopDog();
    try{
      if(typeof stopSceneTimer==="function")stopSceneTimer();
      if(typeof currentScene!=="undefined")currentScene="wimanDogSafe";
    }catch(_){}

    byId("gameScreen")?.classList.add("hidden");
    const scene=byId("sceneScreen");
    if(!scene)return;
    scene.classList.remove("hidden");
    scene.dataset.scene="wimanDogSafe";
    scene.style.backgroundImage=`url("${ASSET.bg}")`;

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
    if(placed())mountDog();
  }

  function showInventory(){
    if(!isAida())return;
    const active=placed();
    const modalContent=byId("modalContent");
    if(!modalContent)return;
    modalContent.innerHTML=`
      <section class="feature-panel wiman-dog-inventory-panel">
        <span class="wiman-dog-panel-kicker">WIMAN DOG</span>
        <h2>🐾 หมาที่คุณมี</h2>
        <p class="wiman-dog-panel-sub">น้องหมาสำหรับทดสอบในบัญชี Aida</p>
        <article class="wiman-dog-card">
          <div class="wiman-dog-card-art">
            <img src="${ASSET.icon}" alt="WIMAN-DOG-01">
          </div>
          <div class="wiman-dog-card-copy">
            <b>WIMAN-DOG-01</b>
            <span>น้องหมาโจรสลัดสีชมพู</span>
            <span class="wiman-dog-status-pill">${active?"● กำลังเดินเล่นในวิมาน":"○ อยู่ในรายการของคุณ"}</span>
            <button id="wimanDogPlaceBtn" class="${active?"is-placed":""}" type="button">
              ${active?"เก็บหมากลับ":"วางหมา"}
            </button>
          </div>
        </article>
      </section>
    `;
    if(typeof openModal==="function")openModal();
    const place=byId("wimanDogPlaceBtn");
    if(place)place.onclick=()=>{
      const next=!placed();
      setPlaced(next);
      if(typeof closeModal==="function")closeModal();
      if(next){
        mountDog();
        if(typeof showWeatherToast==="function")showWeatherToast("🐶 วางน้องหมาในวิมานแล้ว");
      }else{
        stopDog();
        const layer=byId("wimanDogPetLayer");
        if(layer)layer.innerHTML="";
        if(typeof showWeatherToast==="function")showWeatherToast("🐾 เก็บน้องหมากลับแล้ว");
      }
    };
  }

  function framePosition(i){
    const col=i%4,row=Math.floor(i/4);
    return `${col*100/3}% ${row*100/3}%`;
  }

  function setFrame(c,kind,frame,left=false){
    if(!c?.sprite)return;
    c.kind=kind;
    c.sprite.dataset.kind=kind;
    c.sprite.classList.toggle("face-left",!!left);
    c.sprite.style.backgroundImage=`url("${ASSET[kind]}")`;
    c.sprite.style.backgroundSize="400% 400%";
    c.sprite.style.backgroundPosition=framePosition(frame%16);
  }

  function clearFrames(c){
    if(c?.frameTimer){clearInterval(c.frameTimer);c.frameTimer=0}
  }

  function animateLoop(c,kind,left=false,ms=180){
    clearFrames(c);
    let f=0;
    setFrame(c,kind,f,left);
    c.frameTimer=setInterval(()=>{
      if(controller!==c)return clearFrames(c);
      f=(f+1)%16;
      setFrame(c,kind,f,left);
    },ms);
  }

  function playSpecial(c,done){
    clearFrames(c);
    c.el.classList.remove("is-moving");
    let f=0;
    setFrame(c,"special",0,false);
    c.frameTimer=setInterval(()=>{
      if(controller!==c)return clearFrames(c);
      f++;
      if(f>=16){
        clearFrames(c);
        setFrame(c,"idle",0,false);
        done?.();
        return;
      }
      setFrame(c,"special",f,false);
    },105);
  }

  function mountDog(){
    if(!isAida()||!placed())return;
    const layer=byId("wimanDogPetLayer");
    if(!layer)return;
    stopDog();

    const el=document.createElement("div");
    el.className="wiman-dog-pet";
    el.tabIndex=0;
    el.innerHTML='<span class="wiman-dog-sprite" data-kind="idle"></span><span class="wiman-dog-touch-hint">แตะเล่นกับน้อง</span>';
    layer.appendChild(el);

    const sprite=el.querySelector(".wiman-dog-sprite");
    const start=[50,78];
    el.style.left=`${start[0]}%`;
    el.style.top=`${start[1]}%`;

    controller={el,sprite,x:start[0],y:start[1],node:-1,timer:0,frameTimer:0};
    const c=controller;
    animateLoop(c,"idle",false,205);

    const touch=()=>{
      if(controller!==c)return;
      if(c.timer)clearTimeout(c.timer);
      playSpecial(c,()=>scheduleNext(c,1000));
    };
    el.onclick=touch;
    el.onkeydown=e=>{
      if(e.key==="Enter"||e.key===" "){e.preventDefault();touch()}
    };
    scheduleNext(c,rand(1600,3000));
  }

  function scheduleNext(c,delay){
    if(controller!==c)return;
    if(c.timer)clearTimeout(c.timer);
    c.timer=setTimeout(()=>{
      if(controller!==c||!placed())return;
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
    const next=chooseNode(c);
    const tx=next.p[0],ty=next.p[1];
    const dx=tx-c.x,dy=ty-c.y;
    const rect=byId("sceneScreen")?.getBoundingClientRect();
    const dist=rect?Math.hypot(dx*rect.width/100,dy*rect.height/100):Math.hypot(dx,dy)*6;

    // Deliberately slower, small-farm friendly movement
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
      if(controller===c){
        c.el.style.left=`${tx}%`;
        c.el.style.top=`${ty}%`;
      }
    });

    c.timer=setTimeout(()=>{
      if(controller!==c)return;
      c.x=tx;c.y=ty;c.node=next.i;
      c.el.classList.remove("is-moving");
      c.el.style.transition="none";
      animateLoop(c,"idle",false,205);
      scheduleNext(c,rand(1700,3900));
    },duration+40);
  }

  function stopDog(){
    const c=controller;
    controller=null;
    if(!c)return;
    if(c.timer)clearTimeout(c.timer);
    if(c.frameTimer)clearInterval(c.frameTimer);
    c.el?.remove();
  }

  // Capture-phase binding that runs after all original code is loaded.
  // For Aida it blocks the legacy "coming soon" handler.
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

  // Keep the visible lock/unlock state in sync with login/Admin state.
  refreshShortcut();
  setTimeout(refreshShortcut,250);
  setTimeout(refreshShortcut,1000);
  setInterval(refreshShortcut,1200);

  // Preload only the Wiman namespace assets
  Object.values(ASSET).forEach(src=>{
    const img=new Image();
    img.decoding="async";
    img.src=src;
  });

  window.YN_WIMAN_DOG_SAFE={
    open:openWiman,
    inventory:showInventory,
    refresh:refreshShortcut,
    stop:stopDog
  };
})();
