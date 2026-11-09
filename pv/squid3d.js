/* fix30 · ท่าตกหมึก 3D สร้างใหม่ (ฝั่งฉากนคร city3d)
   เรือแล่นจริงจากท่าริมเมืองออกไปท่ากลางน้ำ · ยืนริมท่าถือเบ็ด (ท่าเดียวกับบ่อตกปลา) · เหวี่ยง → ทุ่นลงน้ำ → เงาหมึกว่ายเข้ามา → "!" → ดึงทัน = ได้
   หลายที่ยืน (6) เห็นเพื่อนที่มาตกด้วยกัน · เรือมารับกลับ · ค่าปรับแต่งทุกอย่างอยู่ใน TUNE (ปรับผ่าน ?sqtune=1 ได้)
   ใช้: import {installSquid} from '../pv/squid3d.js'; installSquid(ctx) โดย ctx มาจาก city3d (ดูท้ายไฟล์) */
export function installSquid(C){
 const {THREE,sc,cam,loader,getMe,play,post,RIVER_Z,fitW,IS_MOB,shrinkTex,setCamMode,getCamMode,setFollow,VIEW,getZYAW,setZYAW,sqWater}=C;
 let Q=new URLSearchParams(location.search);try{if(!Q.get('sqtune')&&top&&top.location&&top.location.search)Q=new URLSearchParams(top.location.search);}catch(e){}
 /* ---------- ค่าปรับแต่ง ---------- */
 const TUNE=Object.assign({
  farX:46,farZ:-108,            /* ท่ากลางน้ำ */
  deckW:26,deckD:6.2,deckY:1.55, /* แท่นยืน */
  spots:6,                     /* ที่ยืน */
  boatDockX:40,boatDockZ:-61,  /* เรือจอดท่าริมเมือง */
  boatDeck:1.25,               /* ความสูงพื้นเรือที่ยืน (ปรับตามโมเดล) */
  boatHead:0,                  /* หมุนหัวเรือเพิ่ม (เรเดียน) ถ้าโมเดลหันผิดทาง */
  rideSec:15,                  /* เวลาแล่น */
  camBackZ:8.5,camUp:7.5,camSideX:1.4,camLookZ:-9,camLookY:.4,fov:48,rodTilt:-.85,bowZ:2.3, /* กล้องตอนตก (เฉียงจากบน แบบ SoS) */
  rideCamX:9,rideCamY:11,rideCamZ:-16,
  castDist:6.2,                /* ทุ่นห่างจากท่า */
 },(()=>{try{const t=JSON.parse(localStorage.getItem('sq3tune')||'{}');/* fix31: มุมกล้องตอนแล่นใช้ค่าใหม่เสมอ (ค่าที่เคยจูนไว้ในเครื่องไม่ทับ) */delete t.rideCamX;delete t.rideCamY;delete t.rideCamZ;return t;}catch(e){return {};}})());
 window.__sq3tune=TUNE;
 const FAR=()=>({x:TUNE.farX,z:TUNE.farZ});
 const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
 const mat=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.9,metalness:0},o));
 /* ---------- ท่ากลางน้ำ ---------- */
 const pier=new THREE.Group();sc.add(pier);let pierBuilt=false;const DECK={top:null,sign:null};
 /* เดินบนท่า: แตะพื้นท่า (เฉพาะตอนว่าง) */const _ptr=new THREE.Vector2(),_ray=new THREE.Raycaster();
 function onDeck(x,z){const F=FAR();return Math.abs(x-F.x)<=TUNE.deckW/2-.6&&Math.abs(z-F.z)<=TUNE.deckD/2-.5;}
 function deckY(){return TUNE.deckY+.16;}
 function tapDeck(cx,cy){const me=getMe();if(!me||FS.mode!=='fish'||!DECK.top)return false;if(FS.state!=='idle')return false;_ptr.set((cx/innerWidth)*2-1,-(cy/innerHeight)*2+1);_ray.setFromCamera(_ptr,cam);const h=_ray.intersectObject(DECK.top,false);if(!h.length)return false;const F=FAR();const x=Math.max(F.x-TUNE.deckW/2+.8,Math.min(F.x+TUNE.deckW/2-.8,h[0].point.x)),z=Math.max(F.z-TUNE.deckD/2+.6,Math.min(F.z+TUNE.deckD/2-.7,h[0].point.z));me.tgt=new THREE.Vector3(x,deckY(),z);me.onArrive=()=>faceWater(me);ripple(x,z,.5,0xfff0b0);post({s:'move',x:me.g.position.x,z:me.g.position.z,tx:x,tz:z});return true;}
 function buildPier(){if(pierBuilt)return;pierBuilt=true;const F=FAR();pier.position.set(F.x,0,F.z);
  const wood=mat(0xd9a066),dark=mat(0xa8743f);
  const top=new THREE.Mesh(new THREE.BoxGeometry(TUNE.deckW,.32,TUNE.deckD),wood);top.position.y=TUNE.deckY;top.castShadow=top.receiveShadow=true;pier.add(top);DECK.top=top;/* fix30 พื้นไม้กระดาน (ภาพจริง) */try{const pt=new THREE.TextureLoader().load('../city3d/tx-wood-plank.webp');pt.wrapS=pt.wrapT=THREE.RepeatWrapping;pt.repeat.set(TUNE.deckW/4.2,TUNE.deckD/4.2);pt.colorSpace=THREE.SRGBColorSpace;const pm=new THREE.Mesh(new THREE.PlaneGeometry(TUNE.deckW,TUNE.deckD),new THREE.MeshStandardMaterial({map:pt,roughness:.9}));pm.rotation.x=-Math.PI/2;pm.position.y=TUNE.deckY+.165;pm.receiveShadow=true;pier.add(pm);}catch(e){}
  /* ร่องไม้กระดาน */for(let i=0;i<0;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(.06,.02,TUNE.deckD),dark);s.position.set(-TUNE.deckW/2+.55+i*1.1,TUNE.deckY+.17,0);pier.add(s);}
  /* เสา */{const NP=Math.max(4,Math.round(TUNE.deckW/5));for(let i=0;i<=NP;i++)for(const dz of [-TUNE.deckD/2+.3,TUNE.deckD/2-.3]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.17,.2,TUNE.deckY+.6,8),dark);p.position.set(-TUNE.deckW/2+.4+i*(TUNE.deckW-.8)/NP,(TUNE.deckY+.6)/2-.4,dz);p.castShadow=true;pier.add(p);}}
  /* ราวกันตกด้านหลัง + โคมไฟ 2 ดวง */{const rail=new THREE.Mesh(new THREE.BoxGeometry(TUNE.deckW,.08,.08),dark);rail.position.set(0,TUNE.deckY+1.0,TUNE.deckD/2-.15);pier.add(rail);{const NB=Math.max(4,Math.round(TUNE.deckW/3.2));for(let i=0;i<=NB;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.08,1.0,.08),dark);b.position.set(-TUNE.deckW/2+.4+i*(TUNE.deckW-.8)/NB,TUNE.deckY+.5,TUNE.deckD/2-.15);pier.add(b);}}
   for(const x of [-TUNE.deckW/2+.5,TUNE.deckW/2-.5]){const pole=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,2.4,8),dark);pole.position.set(x,TUNE.deckY+1.2,TUNE.deckD/2-.4);pier.add(pole);const lamp=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),new THREE.MeshStandardMaterial({color:0xfff0b0,emissive:0xffb347,emissiveIntensity:1.1}));lamp.position.set(x,TUNE.deckY+2.5,TUNE.deckD/2-.4);pier.add(lamp);try{const LU=(window.__sqModels||{}).lantern;if(LU){loader.load(LU,g=>{const m=g.scene;shrinkTex&&shrinkTex(m,512);const bb=new THREE.Box3().setFromObject(m),sz=bb.getSize(new THREE.Vector3());m.scale.setScalar(1.1/(sz.y||1));const b2=new THREE.Box3().setFromObject(m);m.position.set(x-(b2.min.x+b2.max.x)/2,TUNE.deckY+1.9-b2.min.y,TUNE.deckD/2-.4-(b2.min.z+b2.max.z)/2);m.rotation.y=Math.PI;pier.add(m);lamp.visible=false;pole.visible=false;},undefined,()=>{});}}catch(e){}}}
  /* ป้าย */try{if(C.label){const sp=C.label('🦑 ท่าตกหมึกกลางน้ำ',{sc:7,fs:44,sign:true,h:104});sp.position.set(0,TUNE.deckY+4.2,TUNE.deckD/2);pier.add(sp);DECK.sign=sp;}}catch(e){}
  /* ฟองรอบเสา */
 }
 const spotPos=i=>{const F=FAR();const n=TUNE.spots,x=F.x-TUNE.deckW/2+1.6+i*((TUNE.deckW-3.2)/(n-1));return {x,y:TUNE.deckY+.16,z:F.z-TUNE.deckD/2+.9};};
 const mySpot=()=>{let h=0;try{const u=String(C.uid&&C.uid()||'');for(let i=0;i<u.length;i++)h=(h*31+u.charCodeAt(i))>>>0;}catch(e){}return h%TUNE.spots;};
 /* ---------- น้ำกว้างขึ้นให้มีน้ำเลยท่าไป ---------- */
 function widenWater(){try{const W=sqWater();const F=FAR();W.g.geometry.dispose();W.g.geometry=new THREE.PlaneGeometry(170,110,1,1);W.g.position.set(F.x,.07,RIVER_Z-58);W.g.visible=true;(W.foams||[]).forEach(f=>f.visible=false);}catch(e){}}
 /* ---------- เงาหมึก / ทุ่น / เอ็น / "!" ---------- */
 const canvasTex=(draw,w=128,h=128)=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;};
 const shadowTex=canvasTex((g,w,h)=>{const r=g.createRadialGradient(w/2,h/2,8,w/2,h/2,w/2);r.addColorStop(0,'rgba(6,30,70,.75)');r.addColorStop(.6,'rgba(6,30,70,.45)');r.addColorStop(1,'rgba(6,30,70,0)');g.fillStyle=r;g.beginPath();g.ellipse(w/2,h/2,w*.42,h*.3,0,0,Math.PI*2);g.fill();for(let i=0;i<8;i++){g.beginPath();g.moveTo(w/2,h/2+h*.12);g.quadraticCurveTo(w/2+(i-3.5)*9,h/2+h*.33,w/2+(i-3.5)*12,h/2+h*.44);g.lineWidth=6;g.strokeStyle='rgba(6,30,70,.35)';g.stroke();}});
 const bangTex=canvasTex((g,w,h)=>{g.fillStyle='#fff';g.strokeStyle='#5a3e2b';g.lineWidth=5;const r=18;g.beginPath();g.roundRect(8,6,w-16,h-30,r);g.fill();g.stroke();g.beginPath();g.moveTo(w/2-12,h-24);g.lineTo(w/2,h-4);g.lineTo(w/2+12,h-24);g.fill();g.stroke();g.fillStyle='#f39c12';g.font='bold 86px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('!',w/2,h/2-10);},128,128);
 const shadow=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.6),new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false,opacity:0}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.085;shadow.renderOrder=3;shadow.visible=false;sc.add(shadow);
 const bang=new THREE.Sprite(new THREE.SpriteMaterial({map:bangTex,transparent:true,depthTest:false}));bang.scale.set(1.3,1.3,1);bang.visible=false;bang.renderOrder=9;sc.add(bang);
 const ripG=new THREE.RingGeometry(.3,.4,28).rotateX(-Math.PI/2);const RIP=[];
 function ripple(x,z,s=1,col=0xffffff){const m=new THREE.Mesh(ripG,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.85,depthWrite:false}));m.position.set(x,.09,z);m.renderOrder=4;sc.add(m);RIP.push({m,t:0,s});}
 /* ---------- คันเบ็ด (วิธีเดียวกับบ่อตกปลา: หาปลายคัน/ด้ามจากรูปทรงจริง แล้วถือที่มือขวา) ---------- */
 let ROD=null,rodBusy=false;
 async function ensureRod(){if(ROD||rodBusy)return ROD;rodBusy=true;try{
  const SQM_=(window.__sqModels||{});const REAL=!!SQM_.rod;const [rg,fg]=await Promise.all([new Promise((ok,no)=>loader.load(SQM_.rod||'../fish3d/m/fz_rod_bamboo.gltf.json',ok,undefined,no)),new Promise((ok,no)=>loader.load(SQM_.float||'../fish3d/m/fz_float_bamboo.gltf.json',ok,undefined,no))]);
  const rod=rg.scene;shrinkTex&&shrinkTex(rod,512);fitW(rod,1.65);rod.updateMatrixWorld(true);if(!REAL)rod.traverse(m=>{if(m.isMesh&&m.material&&m.material.clone){m.material=m.material.clone();m.material.color.set(0x6b4426);m.material.map=null;m.material.roughness=.6;}});
  let tip=null,butt=null;const v=new THREE.Vector3();rod.traverse(m=>{if(!m.isMesh)return;const p=m.geometry.attributes.position;for(let i=0;i<p.count;i+=3){v.fromBufferAttribute(p,i).applyMatrix4(m.matrixWorld);if(!tip||v.y>tip.y)tip=v.clone();}});
  rod.traverse(m=>{if(!m.isMesh)return;const p=m.geometry.attributes.position;for(let i=0;i<p.count;i+=3){v.fromBufferAttribute(p,i).applyMatrix4(m.matrixWorld);if(!butt||v.distanceTo(tip)>butt.distanceTo(tip))butt=v.clone();}});
  const inner=new THREE.Group();inner.add(rod);const grip=butt.clone().lerp(tip,.2);rod.position.sub(grip);const dir=tip.clone().sub(butt);inner.rotation.y=dir.x>0?Math.PI/2:-Math.PI/2;
  const piv=new THREE.Group();piv.add(inner);sc.add(piv);const tipL=tip.clone().sub(grip);{if(!REAL){const g=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),new THREE.MeshStandardMaterial({color:0xffc0e0,emissive:0xff5fa8,emissiveIntensity:1.6}));g.position.copy(tipL);inner.add(g);}const pl=new THREE.PointLight(0xff7fc0,.9,3);pl.position.copy(tipL);inner.add(pl);}
  const bob=fg.scene;shrinkTex&&shrinkTex(bob,256);{const bb=new THREE.Box3().setFromObject(bob),sz=bb.getSize(new THREE.Vector3());const k=.42/(sz.y||1);bob.scale.setScalar(k);const bb2=new THREE.Box3().setFromObject(bob);bob.position.y-=bb2.min.y;}sc.add(bob);
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([v3(0,0,0),v3(0,0,0)]),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.9}));sc.add(line);
  ROD={piv,inner,tipL,bob,line,tw:new THREE.Vector3(),target:new THREE.Vector3()};setRodVisible(false);
 }catch(e){console.log('sq3 rod',e&&e.message);}rodBusy=false;return ROD;}
 function setRodVisible(on){if(!ROD)return;ROD.piv.visible=on;ROD.bob.visible=on&&FS.state!=='idle';ROD.line.visible=ROD.bob.visible;}
 /* ---------- สถานะ ---------- */
 const FS={mode:'off',state:'idle',t:0,wait:0,biteAt:0,k:null,hand:null,saved:null,spot:0,ride:null};
 const hp=new THREE.Vector3();
 function faceWater(me){me.g.rotation.y=Math.PI;}
 /* ---------- เรือ ---------- */
 const wake=[];const wakeG=new THREE.RingGeometry(.4,.6,20).rotateX(-Math.PI/2);
 function wakeAt(x,z){const m=new THREE.Mesh(wakeG,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.7,depthWrite:false}));m.position.set(x,.1,z);m.renderOrder=4;sc.add(m);wake.push({m,t:0});}
 const boat=()=>window.__sqBoat||null;
 /* fix31: เงาปลาว่ายใต้น้ำระหว่างแล่น */const FISH=[];let fishOn=false;function showFish(B){if(!fishOn){fishOn=true;for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.1+Math.random()*.8,.55+Math.random()*.3),new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false,opacity:.55}));m.rotation.x=-Math.PI/2;m.position.y=.06;m.renderOrder=3;m.userData={ox:(Math.random()-.5)*14,oz:(Math.random()-.5)*14,sp:.6+Math.random()*.9,ph:Math.random()*6,dir:Math.random()*6.3};sc.add(m);FISH.push(m);}}for(const f of FISH)f.visible=true;}
 function fishTickRide(dt,B,t){if(!fishOn)return;for(const f of FISH){const u=f.userData;u.ox+=Math.sin(u.dir)*u.sp*dt;u.oz+=Math.cos(u.dir)*u.sp*dt;u.dir+=Math.sin(t*.7+u.ph)*dt*.6;if(Math.hypot(u.ox,u.oz)>11){u.dir+=Math.PI;u.ox*=.8;u.oz*=.8;}f.position.x=B.position.x+u.ox;f.position.z=B.position.z+u.oz;f.rotation.z=u.dir+Math.sin(t*5+u.ph)*.2;f.material.opacity=.35+.25*Math.sin(t*1.3+u.ph);}}
 function hideFish(){for(const f of FISH)f.visible=false;}
 let SPL=null;function bowSplash(B){if(!SPL){try{const t=new THREE.TextureLoader().load('../city3d/fx-splash.png');t.colorSpace=THREE.SRGBColorSpace;SPL=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,opacity:.95}));SPL.scale.set(2.2,1.7,1);SPL.renderOrder=5;}catch(e){return;}}if(SPL.parent!==B){if(SPL.parent)SPL.parent.remove(SPL);B.add(SPL);}SPL.position.set(0,.35,TUNE.bowZ);SPL.visible=true;}
 function hideSplash(){if(SPL)SPL.visible=false;}
 let boatHome=null;
 function boatMoor(){const F=FAR();return {x:F.x-TUNE.deckW/2-3.2,z:F.z+1.5};}
 /* นั่งเรือ: on=true ออกไปท่ากลางน้ำ · false กลับฝั่ง · คืน Promise เมื่อถึง */
 function ride(out){return new Promise(res=>{const me=getMe(),B=boat();if(!me||!B){res(false);return;}
  buildPier();widenWater();if(!boatHome)boatHome={x:B.position.x,z:B.position.z,ry:B.rotation.y};
  const from=out?{x:boatHome.x,z:boatHome.z}:boatMoor(),to=out?boatMoor():{x:boatHome.x,z:boatHome.z};
  B.position.set(from.x,B.position.y,from.z);
  /* fix31: ระหว่างแล่น ไม่มีคนบนเรือ (เรือเด่น) → ซ่อนตัวเรา */me.tgt=null;me.onArrive=null;if(me.tag)me.tag.visible=false;me.g.visible=false;play(me,'idle');
  if(!FS.saved)FS.saved={pos:out?me.g.position.clone():null,cm:getCamMode(),dist:VIEW.dist,yaw:getZYAW(),vx:VIEW.x,vz:VIEW.z};
  setCamMode('squid');setFollow(false);FS.mode='ride';FS.ride={from,to,t:0,out,res,B,me,wk:0};post({s:'sq',ev:out?'depart':'return'});});}
 function rideTick(dt){const R=FS.ride;if(!R)return;R.t+=dt;const k=Math.min(1,R.t/TUNE.rideSec),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;/* เร่ง-ชะลอ */
  const bx=R.from.x+(R.to.x-R.from.x)*e,bz=R.from.z+(R.to.z-R.from.z)*e;const B=R.B;
  const dx=R.to.x-R.from.x,dz=R.to.z-R.from.z;B.rotation.y=Math.atan2(dx,dz)+TUNE.boatHead;B.position.x=bx;B.position.z=bz;B.position.y=.2+Math.sin(R.t*2.1)*.06;B.rotation.z=Math.sin(R.t*1.7)*.03;B.rotation.x=Math.sin(R.t*2.6)*.02;
  R.wk+=dt;const spd=Math.sin(k*Math.PI);showFish(B);fishTickRide(dt,B,R.t);if(R.wk>.16&&k>.03&&k<.97){R.wk=0;wakeAt(bx-Math.sin(B.rotation.y)*2.2,bz-Math.cos(B.rotation.y)*2.2);const sx=Math.cos(B.rotation.y),sz=-Math.sin(B.rotation.y);wakeAt(bx+Math.sin(B.rotation.y)*1.4+sx*1.1,bz+Math.cos(B.rotation.y)*1.4+sz*1.1);wakeAt(bx+Math.sin(B.rotation.y)*1.4-sx*1.1,bz+Math.cos(B.rotation.y)*1.4-sz*1.1);}if(spd>.15){bowSplash(B);if(SPL){const pz=Math.sin(R.t*9);SPL.scale.set(1.6+spd*1.2+pz*.15,1.2+spd*.9+pz*.12,1);SPL.material.opacity=.5+spd*.5;}}else hideSplash();
  if(k>=1){const me=R.me;me.g.visible=true;FS.ride=null;hideSplash();hideFish();if(DECK.sign)DECK.sign.visible=!R.out;
   if(R.out){FS.spot=mySpot();const S=spotPos(FS.spot);me.g.position.set(S.x,S.y,S.z);faceWater(me);FS.mode='fish';FS.state='idle';ensureRod().then(()=>setRodVisible(true));post({s:'sq',ev:'arrive',x:S.x,z:S.z});post({s:'move',x:S.x,z:S.z,tx:S.x,tz:S.z});}
   else{const sv=FS.saved;const P=sv&&sv.pos?sv.pos:{x:boatHome.x+3,z:boatHome.z+6};me.g.position.set(boatHome.x+3,0,RIVER_Z+2.5);me.g.rotation.y=0;if(me.tag)me.tag.visible=true;setRodVisible(false);FS.mode='off';FS.state='idle';setCamMode('follow');if(sv){VIEW.dist=sv.dist;setZYAW(sv.yaw);}VIEW.x=me.g.position.x;VIEW.z=me.g.position.z;setFollow(true);FS.saved=null;B.position.set(boatHome.x,.2,boatHome.z);B.rotation.set(0,boatHome.ry,0);post({s:'sq',ev:'left'});post({s:'move',x:me.g.position.x,z:me.g.position.z,tx:me.g.position.x,tz:me.g.position.z});}
   R.res(true);}}
 /* ---------- ตก ---------- */
 function cast(k,power){if(FS.mode!=='fish'||!ROD)return false;if(FS.state!=='idle')return false;const me=getMe();FS.k=k||'pink';FS.state='cast';FS.t=0;FS.wait=2.2+Math.random()*3.8;const pw=Math.max(0,Math.min(1,Number(power)));FS.pw=Number.isFinite(pw)?pw:.5;
  const S={x:me.g.position.x,z:me.g.position.z};const dist=TUNE.castDist*(.55+.95*FS.pw);ROD.target.set(S.x+(Math.random()-.5)*1.2,0,S.z-dist-Math.random()*.8);ROD.bob.visible=true;ROD.line.visible=true;
  shadow.visible=false;shadow.material.opacity=0;post({s:'sq',ev:'cast'});return true;}
 /* ดึง: คืน {ok,late} · ok = กดภายในช่วงกัด */
 function pull(){if(FS.mode!=='fish')return {ok:false,early:true};if(FS.state==='bite'){const dtm=Date.now()-FS.biteAt;FS.state='reel';FS.t=0;bang.visible=false;return {ok:true,ms:dtm};}
  if(FS.state==='wait'||FS.state==='cast'){/* ดึงก่อนกัด = หมึกตกใจ */FS.state='reel';FS.t=0;shadow.visible=false;return {ok:false,early:true};}return {ok:false};}
 function result(hit,k){try{const T=ROD?ROD.target:null;if(T){ripple(T.x,T.z,1.6,hit?0x9bf0c8:0xffffff);ripple(T.x,T.z,1.1);if(hit)splashAt(T.x,T.z);}}catch(e){}}
 const SPLS=[];let splTex=null;function splashAt(x,z){try{if(!splTex){splTex=new THREE.TextureLoader().load('../city3d/fx-splash.png');splTex.colorSpace=THREE.SRGBColorSpace;}const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:splTex,transparent:true,depthWrite:false,opacity:1}));sp.position.set(x,.4,z);sp.scale.set(.6,.5,1);sp.renderOrder=6;sc.add(sp);SPLS.push({sp,t:0});}catch(e){}}
 function fishTick(dt,t){const me=getMe();if(!me||!ROD)return;const r=ROD;
  if(!FS.hand){try{FS.hand=me.g.getObjectByName('R_Hand')||null;}catch(e){}}
  if(FS.hand)FS.hand.getWorldPosition(hp);else{hp.copy(me.g.position);hp.y+=1.0;hp.x-=.25;}
  r.piv.position.copy(hp);const lift=FS.state==='cast'&&FS.t<.35?-.6+Math.max(0,FS.t)*2:FS.state==='reel'?Math.sin(t*20)*.08-.25:0;
  r.piv.rotation.set(0,0,-.32);r.inner.rotation.x=0;r.piv.rotation.x=TUNE.rodTilt+lift+(FS.state==='bite'?-.12+Math.sin(t*26)*.05:0);if(DECK.sign)DECK.sign.visible=false;
  r.piv.updateMatrixWorld(true);r.tw.copy(r.tipL);r.inner.localToWorld(r.tw);
  const T=r.target;let bx=T.x,bz=T.z,by=.02+Math.sin(t*2.2+T.x)*.03;
  if(FS.state==='cast'){const k=Math.max(0,Math.min(1,(FS.t-.25)/.7));bx=r.tw.x+(T.x-r.tw.x)*k;bz=r.tw.z+(T.z-r.tw.z)*k;by=r.tw.y+(.02-r.tw.y)*k+Math.sin(k*Math.PI)*1.6;r.bob.visible=FS.t>.2;}
  if(FS.state==='bite'){by=-.22+Math.sin(t*24)*.09;}
  if(FS.state==='reel'){const k=Math.min(1,FS.t/.5);bx=T.x+(r.tw.x-T.x)*k;bz=T.z+(r.tw.z-T.z)*k;by=.02+(r.tw.y-.4)*k;}
  r.bob.position.set(bx,by,bz);r.bob.rotation.z=FS.state==='bite'?Math.sin(t*18)*.3:Math.sin(t*1.7)*.08;
  const p=r.line.geometry.attributes.position;p.setXYZ(0,r.tw.x,r.tw.y,r.tw.z);p.setXYZ(1,bx,by+.36,bz);p.needsUpdate=true;r.line.visible=r.bob.visible;
  FS.t+=dt;
  if(FS.state==='cast'&&FS.t>1){FS.state='wait';FS.t=0;ripple(bx,bz);/* เงาหมึกโผล่ไกลๆ แล้วว่ายเข้ามา */const a=Math.random()*Math.PI*2,d=5+Math.random()*3;shadow.position.set(T.x+Math.cos(a)*d,.085,T.z+Math.sin(a)*d*.6);shadow.visible=true;shadow.material.opacity=0;shadow.userData.from=shadow.position.clone();}
  else if(FS.state==='wait'){const k=Math.min(1,FS.t/FS.wait);const f=shadow.userData.from;if(f){shadow.position.x=f.x+(T.x-f.x)*k;shadow.position.z=f.z+(T.z-f.z)*k;shadow.material.opacity=Math.min(.95,k*1.6);shadow.rotation.z=Math.atan2(T.x-f.x,T.z-f.z)+Math.sin(t*3)*.15;}
   if(FS.t>FS.wait){FS.state='bite';FS.t=0;FS.biteAt=Date.now();ripple(bx,bz,1.3);splashAt(bx,bz);bang.position.set(me.g.position.x,me.g.position.y+2.4,me.g.position.z);bang.visible=true;post({s:'sq',ev:'bite',at:FS.biteAt});}}
  else if(FS.state==='bite'){bang.position.y=me.g.position.y+2.4+Math.sin(t*12)*.08;if(FS.t>1.1){/* ช้าไป หมึกหนี */FS.state='reel';FS.t=0;bang.visible=false;shadow.visible=false;post({s:'sq',ev:'miss'});}}
  else if(FS.state==='reel'&&FS.t>.6){FS.state='idle';FS.t=0;r.bob.visible=false;r.line.visible=false;shadow.visible=false;post({s:'sq',ev:'ready'});}
 }
 /* ---------- กล้อง ---------- */
 const camTarget=new THREE.Vector3();
 function camTick(dt){const me=getMe();if(!me)return false;
  if(FS.mode==='ride'&&FS.ride){const B=FS.ride.B;const tx=B.position.x+TUNE.rideCamX,ty=TUNE.rideCamY,tz=B.position.z+TUNE.rideCamZ;cam.position.x+=(tx-cam.position.x)*Math.min(1,dt*2.5);cam.position.y+=(ty-cam.position.y)*Math.min(1,dt*2.5);cam.position.z+=(tz-cam.position.z)*Math.min(1,dt*2.5);camTarget.set(B.position.x,.8,B.position.z+1);cam.lookAt(camTarget);if(Math.abs(cam.fov-46)>.1){cam.fov+=(46-cam.fov)*Math.min(1,dt*2);cam.updateProjectionMatrix();}return true;}
  if(FS.mode==='fish'){const P=me.g.position;const tx=P.x+TUNE.camSideX,ty=P.y+TUNE.camUp,tz=P.z+TUNE.camBackZ;cam.position.x+=(tx-cam.position.x)*Math.min(1,dt*3);cam.position.y+=(ty-cam.position.y)*Math.min(1,dt*3);cam.position.z+=(tz-cam.position.z)*Math.min(1,dt*3);camTarget.set(P.x,P.y+TUNE.camLookY,P.z+TUNE.camLookZ);cam.lookAt(camTarget);if(Math.abs(cam.fov-TUNE.fov)>.1){cam.fov+=(TUNE.fov-cam.fov)*Math.min(1,dt*3);cam.updateProjectionMatrix();}return true;}
  return false;}
 /* ---------- วนทุกเฟรม ---------- */
 let T0=performance.now();
 function tick(dt){const t=(performance.now()-T0)/1000;
  for(let i=RIP.length-1;i>=0;i--){const r=RIP[i];r.t+=dt;const k=r.t/1.4;r.m.scale.setScalar(1+k*3*r.s);r.m.material.opacity=.85*(1-k);if(k>=1){sc.remove(r.m);r.m.material.dispose();RIP.splice(i,1);}}
  for(let i=wake.length-1;i>=0;i--){const w=wake[i];w.t+=dt;const k=w.t/1.8;w.m.scale.setScalar(1+k*4);w.m.material.opacity=.7*(1-k);if(k>=1){sc.remove(w.m);w.m.material.dispose();wake.splice(i,1);}}
  for(let i=SPLS.length-1;i>=0;i--){const q=SPLS[i];q.t+=dt;const k=q.t/.9;q.sp.scale.set(.6+k*2.6,.5+k*2.2,1);q.sp.position.y=.4+Math.sin(Math.min(1,k)*Math.PI)*.9;q.sp.material.opacity=1-k;if(k>=1){sc.remove(q.sp);q.sp.material.dispose();SPLS.splice(i,1);}}
  if(FS.mode==='ride')rideTick(dt);else if(FS.mode==='fish')fishTick(dt,t);
  if(FS.mode==='fish'&&ROD&&FS.state==='idle'){/* ถือเบ็ดนิ่งๆ ชี้ลงน้ำ */}
 }
 /* ---------- ปรับแต่งสดบนมือถือ (?sqtune=1): ปุ่ม +/− แล้วส่งตัวเลขให้ผม ---------- */
 if(Q.get('sqtune')==='1')try{const box=document.createElement('div');box.style.cssText='position:fixed;left:8px;top:40%;z-index:99999;background:rgba(0,0,0,.6);color:#fff;font:12px monospace;padding:6px;border-radius:8px;max-height:50vh;overflow:auto';const keys=['farZ','deckW','deckY','boatDeck','boatHead','bowZ','rodTilt','camBackZ','camUp','camLookZ','fov','castDist'];const step={farZ:1,deckW:1,deckY:.1,boatDeck:.1,boatHead:.26,bowZ:.2,rodTilt:.1,camBackZ:.5,camUp:.5,camLookZ:.5,fov:2,castDist:.5};const draw=()=>{box.innerHTML=keys.map(k=>'<div>'+k+' <b>'+(+TUNE[k]).toFixed(2)+'</b> <button data-k="'+k+'" data-d="-1">−</button><button data-k="'+k+'" data-d="1">+</button></div>').join('')+'<button id="sqtSave">บันทึก</button> <button id="sqtReset">ค่าเดิม</button>';};draw();document.body.appendChild(box);box.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='sqtSave'){localStorage.setItem('sq3tune',JSON.stringify(TUNE));alert('บันทึกแล้ว · ถ่ายภาพหน้านี้ส่งให้ผม:\n'+JSON.stringify(TUNE));return;}if(b.id==='sqtReset'){localStorage.removeItem('sq3tune');location.reload();return;}const k=b.dataset.k;TUNE[k]=+(TUNE[k]+step[k]*(+b.dataset.d)).toFixed(2);if(k==='farZ'||k==='deckY'){pier.position.z=TUNE.farZ;}draw();};}catch(e){}
 /* ทะเลและท่ากลางน้ำมีให้เห็นตั้งแต่เข้านคร */setTimeout(()=>{try{buildPier();widenWater();}catch(e){}},1500);
 const api={ride,cast,pull,result,tick,cam:camTick,state:()=>({mode:FS.mode,state:FS.state}),TUNE,buildPier,tapDeck,onDeck,deckY,castTarget:()=>ROD&&ROD.target.clone()};window.__sq3=api;return api;
}
