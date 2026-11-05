// ฉากนั่งตกปลา 3D ของแต่ละแท่น — โหลดเมื่อกด "นั่งตกปลา" บนแผนที่เท่านั้น
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as SU from 'three/addons/utils/SkeletonUtils.js';
const $=id=>document.getElementById(id);
const MOBILE=/iPad|iPhone|iPod|Android/.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Macintosh/.test(navigator.userAgent));

// ---------- กติกาเดิมจากซีซั่น 3 (fishing-catalog.js) ----------
const FISH={guppy:['ปลาหางนกยูง',1,1.00,1.80],mudskipper:['ปลาตีน',1,1.00,2.00],seahorse:['ม้าน้ำ',1,1.20,2.20],betta:['ปลากัด',1,1.20,2.40],
boxfish:['ปลาปักเป้ากล่อง',1,1.50,2.80],puffer:['ปลาปักเป้าจุด',1,1.50,3.00],leaf:['ปลาใบไม้',1,1.80,3.20],elephantnose:['ปลาจมูกช้าง',1,2.00,3.50],
moldyorange:['ปลาส้มขึ้นรา',2,3.00,4.50],hamster:['ปลาแฮมสเตอร์',2,3.00,4.80],angelfish:['ปลาเทวดา',2,3.20,5.00],clownloach:['ปลาหมูอินโด',2,3.50,5.20],
triggerfish:['ปลาวัวลายจุด',2,3.50,5.50],discus:['ปลาปอมปาดัวร์',2,4.00,5.80],shihtzu:['ปลาหมาชิสุ',2,4.00,6.00],durian:['ปลาทุเรียน',2,4.50,6.50],
eel:['ปลาไหล',3,5.50,7.50],trout:['ปลาเทราต์',3,6.00,8.00],stonefish:['ปลาหิน',3,6.00,8.50],moneybag:['ปลาถุงเงิน',3,6.50,8.80],
sunbathe:['ปลาตากแดด',3,7.00,9.00],koi:['ปลาคาร์ฟ',3,7.00,9.50],catfish:['ปลาดุกช่าง',3,7.50,10.00],arowana:['ปลาอโรวาน่า',3,8.00,10.00],
catshark:['ฉลามแมว',4,50,60],angelshark:['ฉลามนางฟ้า',4,55,65],manta:['กระเบนราหู',4,60,70],hammerhead:['ฉลามหัวค้อน',4,65,78],
mola:['ปลาโมลา',5,70,85],strawberry:['ปลาสตรอว์เบอร์รี',5,78,90],unicorn:['ปลายูนิคอร์น',5,85,95],goldsheep:['ปลาแกะทอง',5,90,100]};
const TIER={1:[],2:[],3:[]};for(const k in FISH){const t=FISH[k][1];if(TIER[t])TIER[t].push(k);}
const RODS={bamboo:{n:'เบ็ดไผ่ลมหวน',cnt:[85,15,0],tier:[55,35,10]},moon:{n:'เบ็ดจันทร์เสี้ยว',cnt:[95,5,0],tier:[40,35,25]},
honey:{n:'เบ็ดน้ำผึ้งหวานเจี๊ยบ',cnt:[60,35,5],tier:[70,25,5]},sakura:{n:'เบ็ดซากุระพลิ้ว',cnt:[80,20,0],tier:[50,35,15]}};
const VIPL=[['catshark',80],['angelshark',65],['manta',50],['hammerhead',40],['mola',30],['strawberry',22],['unicorn',15],['goldsheep',10]];
const weighted=l=>{let x=Math.random()*l.reduce((n,w)=>n+w,0);for(let i=0;i<l.length;i++){x-=l[i];if(x<0)return i;}return l.length-1;};
const pick=a=>a[Math.floor(Math.random()*a.length)];
// VIP: ปลาชุดเดียวกัน แต่มีโอกาสได้น้ำหนักมากกว่า
const lb=(k,vip)=>{const[, ,a,b]=FISH[k];const u=vip?1-Math.pow(1-Math.random(),2.6):Math.random();return Math.round((a+u*(b-a))*100)/100;};

// ---------- renderer (สร้างครั้งเดียว ใช้ซ้ำทุกแท่น) ----------
let R,sc,cam,root,sun,waterU,raf=0,S=null;
const LD=new GLTFLoader(),cache={};
async function loadJ(name){/* S4: ตัวละครโหลดจากไฟล์เดียวกับฟาร์ม (ไฟล์ไบนารีที่โหลดไว้แล้ว) — เร็วกว่าและไม่ต้องโหลดไฟล์ใหญ่อีกก้อน (iPhone เคยไม่ขึ้นตัวละคร) */if(name==='punk'){try{const ab=await (await fetch('../farm3d/punk.gltf.json')).arrayBuffer();if(new DataView(ab).getUint32(0,true)===0x46546C67)return await new Promise((res,rej)=>LD.parse(ab,new URL('../farm3d/',location.href).href,res,rej));}catch(e){console.log('punk glb',e&&e.message);}}/* S4: ไฟล์โมเดลถูกแปลงเป็นไบนารีตอนสร้างพรีวิว → อ่านตรงๆ ไม่ต้องถอดรหัส base64 บนเครื่อง (ช้ามากบน iPhone = ค้าง) */const __ab=await (await fetch('m/'+name+'.gltf.json')).arrayBuffer();if(new DataView(__ab).getUint32(0,true)===0x46546C67)return await new Promise((res,rej)=>LD.parse(__ab,new URL('./m/',location.href).href,res,rej));
  const j=JSON.parse(new TextDecoder().decode(__ab));const __b64=j.buffers[0].uri.split(',')[1];const bin=new Uint8Array(await (await fetch('data:application/octet-stream;base64,'+__b64)).arrayBuffer());delete j.buffers[0].uri;
  const js=new TextEncoder().encode(JSON.stringify(j));const jl=Math.ceil(js.length/4)*4,bl=Math.ceil(bin.length/4)*4;
  const out=new Uint8Array(28+jl+bl);const dv=new DataView(out.buffer);
  dv.setUint32(0,0x46546C67,true);dv.setUint32(4,2,true);dv.setUint32(8,out.length,true);dv.setUint32(12,jl,true);dv.setUint32(16,0x4E4F534A,true);out.fill(0x20,20,20+jl);out.set(js,20);
  dv.setUint32(20+jl,bl,true);dv.setUint32(24+jl,0x004E4942,true);out.set(bin,28+jl);
  return new Promise((res,rej)=>LD.parse(out.buffer,new URL('./m/',location.href).href,res,rej));}
let need=0,got=0;
function get(n){if(!cache[n]){need++;cache[n]=loadJ(n).then(g=>{got++;prog();g.scene.traverse(o=>{if(o.isMesh&&!o.isSkinnedMesh){o.castShadow=true;o.receiveShadow=true;const m=o.material;if(m&&m.isMeshStandardMaterial)o.material=new THREE.MeshLambertMaterial({map:m.map,color:m.color,transparent:m.transparent,alphaTest:m.alphaTest,side:m.side});}});return g;});}else if(!cache[n].done){}return cache[n];}
function prog(){const b=$('p3bar');if(b)b.style.width=Math.round(got/Math.max(1,need)*100)+'%';}
function fit(src,{h,w,sy=1}){const o=src.clone(true);const b=new THREE.Box3().setFromObject(o),s=b.getSize(new THREE.Vector3());const k=h?h/s.y:w/Math.max(s.x,s.z);o.scale.set(k,k*sy,k);
  const b2=new THREE.Box3().setFromObject(o),c=b2.getCenter(new THREE.Vector3());o.position.set(-c.x,-b2.min.y,-c.z);const g=new THREE.Group();g.add(o);return g;}
const RC=new THREE.Raycaster();
function hitY(obj,x,z,maxY=1e9){obj.updateMatrixWorld(true);RC.set(new THREE.Vector3(x,60,z),new THREE.Vector3(0,-1,0));for(const h of RC.intersectObject(obj,true))if(h.point.y<maxY)return h.point.y;return null;}
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function labelTex(txt,bg,fg,w=256,h=80){return canvasTex(w,h,(x)=>{x.fillStyle=bg;x.beginPath();x.roundRect(4,4,w-8,h-8,h/2-4);x.fill();x.lineWidth=5;x.strokeStyle='#fff';x.stroke();x.fillStyle=fg;x.font=`700 ${h*.46}px Mali, Itim, sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(txt,w/2,h/2+2);});}

function init(){
  R=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
  R.setPixelRatio(Math.min(MOBILE?1.5:1.75,devicePixelRatio||1));R.outputColorSpace=THREE.SRGBColorSpace;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
  R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFShadowMap;$('p3stage').appendChild(R.domElement);
  sc=new THREE.Scene();cam=new THREE.PerspectiveCamera(56,1,.3,400);
  sc.add(new THREE.HemisphereLight(0xfffbea,0x6aa7c0,1.6));
  sun=new THREE.DirectionalLight(0xfff0d0,2.1);sun.position.set(-8,16,10);sun.castShadow=true;sun.shadow.mapSize.set(MOBILE?1024:2048,MOBILE?1024:2048);
  Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:1,far:60});sun.shadow.bias=-.0008;sun.shadow.normalBias=.04;sc.add(sun,sun.target);
  // น้ำ: ใสอมฟ้า แสงระยิบ จางเข้าขอบฟ้า
  waterU={t:{value:0},deep:{value:new THREE.Color()},shal:{value:new THREE.Color()},fogc:{value:new THREE.Color()},cp:{value:new THREE.Vector3()}};
  const wm=new THREE.ShaderMaterial({uniforms:waterU,transparent:true,depthWrite:false,
    vertexShader:`varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform float t;uniform vec3 deep,shal,fogc,cp;varying vec3 vW;
    float n(vec2 p){return sin(p.x)*sin(p.y);}
    void main(){float d=length(vW.xz-vec2(0.,-3.));vec3 c=mix(shal,deep,smoothstep(3.,34.,d));
      float caus=n(vW.xz*1.25+vec2(t*.6,t*.4))+n(vW.xz*1.8-vec2(t*.5,-t*.7))+n(vW.xz*.7+vec2(-t*.3,t*.2));
      c+=vec3(.12,.15,.15)*smoothstep(.9,2.4,caus)*(1.-smoothstep(8.,40.,d));
      float gl=n(vW.xz*3.1+vec2(t*1.3,-t*.9))*n(vW.xz*2.3-vec2(t*.7,t*1.1));c+=vec3(.9)*smoothstep(.55,.85,gl)*(1.-smoothstep(5.,26.,d))*.5;
      float fd=length(vW-cp);c=mix(c,fogc,smoothstep(40.,150.,fd));
      gl_FragColor=vec4(c,mix(.74,1.,smoothstep(4.,30.,d)));}`});
  const water=new THREE.Mesh(new THREE.PlaneGeometry(600,600),wm);water.rotation.x=-Math.PI/2;water.renderOrder=2;sc.add(water);
  sc.userData.floor=new THREE.Mesh(new THREE.PlaneGeometry(600,600),new THREE.MeshBasicMaterial({color:0x1f7fb0}));sc.userData.floor.rotation.x=-Math.PI/2;sc.userData.floor.position.y=-2.2;sc.add(sc.userData.floor);
  addEventListener('resize',size);
  // ลากเพื่อหมุนมองซ้ายขวา / ถ่างนิ้วซูม
  const cv=R.domElement,P=new Map();let pd=null;
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY});if(P.size===2){const[a,b]=[...P.values()];pd={d:Math.hypot(a.x-b.x,a.y-b.y),k:S.dist};}});
  cv.addEventListener('pointermove',e=>{const p=P.get(e.pointerId);if(!p||!S)return;if(P.size===2&&pd){P.set(e.pointerId,{x:e.clientX,y:e.clientY});const[a,b]=[...P.values()];S.dist=Math.max(.7,Math.min(1.5,pd.k*pd.d/Math.max(20,Math.hypot(a.x-b.x,a.y-b.y))));return;}
    S.yaw=Math.max(-1.65,Math.min(1.65,S.yaw-(e.clientX-p.x)*.005));S.pitch=Math.max(-.15,Math.min(.45,S.pitch+(e.clientY-p.y)*.003));P.set(e.pointerId,{x:e.clientX,y:e.clientY});});
  const up=e=>{P.delete(e.pointerId);if(P.size<2)pd=null;};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();if(S)S.dist=Math.max(.7,Math.min(1.5,S.dist*(e.deltaY>0?1.08:.93)));},{passive:false});
}
function size(){if(!R)return;const w=innerWidth,h=innerHeight;R.setSize(w,h);cam.aspect=w/h;cam.fov=w<h?58:44;cam.updateProjectionMatrix();}

// ---------- หน้าตาแต่ละโซน ----------
const ZONE={
  lotus:{plat:'fz_plat_wood',sky:['#8fd6f5','#e9f8ff'],deep:'#2a8fb8',shal:'#5fd0c4',walk:[0xd79a5c,0xc4864a,0x8a5a33]},
  bamboo:{plat:'fz_plat_bamboo',sky:['#86d3ee','#e6f7f2'],deep:'#22869a',shal:'#5cc9b0',walk:[0x9bc45a,0x86b04a,0x5d8a33]},
  beach:{plat:'fz_plat_drift',sky:['#6fcdf6','#eefaff'],deep:'#1593c9',shal:'#6fe0dc',walk:[0xe2c493,0xd2b07c,0x9c7a50]},
  falls:{plat:'fz_plat_stone',sky:['#8cd0ef','#eaf6fb'],deep:'#1d7fb4',shal:'#59c4dc',walk:[0xc9a77a,0xb8946a,0x7f6a5a]},
  vip:{plat:'fz_vip_pav',sky:['#7fc9f2','#fff4df'],deep:'#168fbe',shal:'#62dbd0',walk:[0xfdf6ea,0xf3e6cc,0xe6b84a]}};
const GAP=3.25,DECK=.55;
// [model, ขนาด, x(จากกลางโซน), z, {y, ry, sy}]
const LANDS={
  lotus:[['fz_island',{w:22,sy:.3},-7,-30],['fz_hill',{w:24,sy:.45},10,-40,{ry:.4}],['fz_island',{w:16,sy:.28},-16,-52],['fz_mountains_twin',{w:46,sy:.8},2,-92]],
  bamboo:[['fz_hill',{w:19,sy:.5},-10,-28,{ry:1.2}],['fz_hill',{w:19,sy:.5},11,-33,{ry:-1.1}],['fz_mountain_snow',{w:50,sy:.9},-10,-96],['fz_mountain_snow',{w:40,sy:.8},24,-102]],
  beach:[['fz_island',{w:28,sy:.28},0,-32],['fz_hill',{w:24,sy:.35},-22,-52,{ry:.3}],['fz_island',{w:14,sy:.25},18,-46],['fz_mountains_twin',{w:40,sy:.7},14,-96]],
  falls:[['fz_hill',{w:18,sy:.5},-14,-30,{ry:1}],['fz_hill',{w:18,sy:.5},15,-32,{ry:-1}],['fz_mountains_twin',{w:40,sy:.9},-24,-64],['fz_mountain_snow',{w:42,sy:.95},24,-68],['fz_mountain_snow',{w:60,sy:1},0,-112]],
  vip:[['fz_island',{w:24,sy:.3},0,-33],['fz_hill',{w:22,sy:.4},-21,-36,{ry:.6}],['fz_hill',{w:22,sy:.4},21,-38,{ry:-.6}],['fz_mountains_twin',{w:50,sy:.8},0,-100]]};
const ONLAND={
  lotus:[['fz_tree_pink',{h:6},-11,-30],['fz_tree_green',{h:6.5},-5,-27],['fz_tree_pink',{h:5.5},-8,-35],['fz_tree_green',{h:7},8,-40],['fz_tree_pink',{h:6},13,-38],['fz_tree_green',{h:5.5},-16,-52],['fz_shop',{w:4.5},-1,-31]],
  bamboo:[['fz_bamboo',{h:7},-11,-25],['fz_bamboo',{h:8},-7,-30],['fz_bamboo',{h:6.5},-14,-31],['fz_bamboo',{h:7.5},10,-30],['fz_bamboo',{h:8},14,-36],['fz_bamboo',{h:6.5},7,-36]],
  beach:[['fz_umbrella',{h:3.2},-6,-29],['fz_umbrella',{h:3.2},5,-28],['fz_tree_orange',{h:6.5},-10,-34],['fz_tree_orange',{h:6},9,-36],['fz_tree_orange',{h:5.5},12,-31],['fz_driftwood',{w:3},1,-27],['fz_shop',{w:4.5},-1,-35],['fz_tree_orange',{h:5},18,-46]],
  falls:[['fz_tree_green',{h:6.5},-12,-27],['fz_tree_green',{h:6},-17,-32],['fz_tree_green',{h:6.5},13,-29],['fz_tree_orange',{h:6},17,-34]],
  vip:[['fz_vip_gate',{h:6},0,-30],['fz_tree_pink',{h:6},-7,-33],['fz_tree_pink',{h:6},7,-33],['fz_vip_lamp',{h:3.4},-3.6,-28],['fz_vip_lamp',{h:3.4},3.6,-28],['fz_tree_pink',{h:5.5},-20,-36],['fz_tree_pink',{h:5.5},20,-38]]};
const INWATER={
  lotus:[['fz_log',{w:3.4},6,-14,{y:-.25,ry:.4}],['fz_stones',{w:7},-9,-17,{y:-.1,ry:.25}]],
  bamboo:[['fz_rocks',{w:3},-7,-12,{y:-.3}],['fz_rocks',{w:2.4},8,-14,{y:-.3,ry:2}],['fz_bridge',{w:9},0,-31,{y:.2}]],
  beach:[['fz_rocks',{w:3},-7,-12,{y:-.3}],['fz_rocks',{w:2.2},8,-11,{y:-.3,ry:1}],['fz_driftwood',{w:3},6,-17,{y:-.2,ry:.8}]],
  falls:[['fz_waterfall',{w:22},0,-52,{y:-.6}],['fz_boulder',{w:3},-7,-12,{y:-.4}],['fz_boulder',{w:2.5},8,-14,{y:-.4,ry:1.4}],['fz_boulder',{w:2},-10,-19,{y:-.3}]],
  vip:[['fz_vip_fountain',{w:4},-7,-12,{y:-.3}],['fz_vip_fountain',{w:4},7,-12,{y:-.3}]]};
const PADS={lotus:[22,9],bamboo:[6,0],beach:[0,0],falls:[0,0],vip:[8,5]};

// ---------- สร้างฉาก ----------
async function build(o){
  const Z=ZONE[o.zone];if(root)sc.remove(root);root=new THREE.Group();sc.add(root);
  sc.background=canvasTex(4,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,Z.sky[0]);g.addColorStop(.62,Z.sky[1]);g.addColorStop(1,Z.sky[1]);x.fillStyle=g;x.fillRect(0,0,w,h);});
  waterU.deep.value.set(Z.deep);waterU.shal.value.set(Z.shal);waterU.fogc.value.set(Z.sky[1]);sc.userData.floor.material.color.set(Z.deep).multiplyScalar(.7);
  sc.fog=new THREE.Fog(Z.sky[1],55,190);
  const NSEAT=Math.max(3,Math.min(8,(o.seats||[]).length||4)),cx=((NSEAT-1)/2-o.idx)*GAP,X=k=>(k-o.idx)*GAP;
  const names=[Z.plat,'fz_basket','fz_bucket','fz_net','punk',...new Set([...LANDS[o.zone],...ONLAND[o.zone],...INWATER[o.zone]].map(d=>d[0]))];
  if(PADS[o.zone][0])names.push('fz_lotus_leaves');if(PADS[o.zone][1])names.push('fz_lotus_flower');if(o.zone==='vip')names.push('fz_vip_lamp');
  const G={};await Promise.all(names.map(async n=>G[n]=await get(n)));
  // แท่นทั้ง 4 ของโซน
  const P=fit(G[Z.plat].scene,o.zone==='vip'?{w:3.0}:{w:2.8});const hTop=new THREE.Box3().setFromObject(P).max.y;
  const deck0=hitY(P,0,-1.05,o.zone==='vip'?hTop*.45:1e9)??hTop*.6;
  const mY=o.zone==='vip'?hTop*.45:1e9,cush0=Math.max(...[[.32,0],[-.32,0],[0,.32],[0,-.32]].map(([a,b])=>hitY(P,a,b,mY)??deck0+.3));S.seatY=DECK-deck0+cush0;
  S.seats=[];for(let k=0;k<NSEAT;k++){const p=P.clone(true);p.position.set(X(k),DECK-deck0,0);root.add(p);if(o.zone==='vip')ghostTop(p,S.seatY+.06,X(k),DECK+.06);S.seats.push({k,x:X(k),who:o.seats[k]});}
  // สะพานไม้ยาวด้านหลัง เชื่อมทุกแท่น
  const [c1,c2,cp]=Z.walk;const pl1=new THREE.MeshLambertMaterial({color:c1}),pl2=new THREE.MeshLambertMaterial({color:c2}),po=new THREE.MeshLambertMaterial({color:cp});
  const plG=new THREE.BoxGeometry(.42,.12,1.8),poG=new THREE.CylinderGeometry(.11,.13,1.6,8),cnG=new THREE.BoxGeometry(1.2,.12,.42);
  const A=[],B=[],Q=[],C=[];const WZ=3.1;
  for(let x=cx-40;x<cx+40;x+=.46){const m=new THREE.Matrix4().makeTranslation(x,DECK-.06,WZ);(Math.round(x/.46)%3?A:B).push(m);}
  for(let x=cx-40;x<cx+40;x+=2.3)for(const s of [-1,1])Q.push(new THREE.Matrix4().makeTranslation(x,DECK-.75,WZ+s*.85));
  for(const s of S.seats)for(let z=1.25;z<WZ-.8;z+=.46)C.push(new THREE.Matrix4().makeTranslation(s.x,DECK-.06,z));
  const inst=(g,m,l,sh=true)=>{if(!l.length)return;const im=new THREE.InstancedMesh(g,m,l.length);l.forEach((x,i)=>im.setMatrixAt(i,x));im.castShadow=sh;im.receiveShadow=true;root.add(im);};
  inst(plG,pl1,A);inst(plG,pl2,B);inst(poG,po,Q);inst(cnG,pl1,C);
  // ของข้างตัว: ตะกร้า ถังน้ำ สวิง
  const mx=X(o.idx);const deco=(n,opt,x,z,y=DECK,ry=0)=>{const g=fit(G[n].scene,opt);g.position.set(x,y,z);g.rotation.y=ry;root.add(g);return g;};
  if(o.zone!=='vip'){deco('fz_basket',{h:.55},mx+.95,.05,DECK,.4);deco('fz_bucket',{h:.5},mx-1.0,.15,DECK,-.3);deco('fz_net',{w:1.1},mx-.55,.85,DECK,.9);}
  else{deco('fz_basket',{h:.5},mx+1.05,.35,DECK,.4);deco('fz_bucket',{h:.45},mx-1.05,.4,DECK,-.3);}
  // ภูเขา เกาะ ต้นไม้
  const land=new THREE.Group();root.add(land);
  for(const [n,opt,x,z,e={}] of LANDS[o.zone]){const g=fit(G[n].scene,opt);g.position.set(x,e.y??-.35,z);g.rotation.y=e.ry||0;land.add(g);g.traverse(m=>{if(m.isMesh){m.castShadow=false;}});}
  for(const [n,opt,x,z] of ONLAND[o.zone]){const y=hitY(land,x,z)??0;const g=fit(G[n].scene,opt);g.position.set(x,y-.05,z);g.rotation.y=Math.sin(x*7+z)*.6;g.traverse(m=>{if(m.isMesh)m.castShadow=false;});root.add(g);}
  for(const [n,opt,x,z,e={}] of INWATER[o.zone]){const g=fit(G[n].scene,opt);g.position.set(x,e.y??0,z);g.rotation.y=e.ry||0;root.add(g);}
  // ใบบัว ดอกบัว (ไม่บังทุ่นและสะพาน)
  const busy=(x,z)=>z>-1.8||S.seats.some(s=>Math.abs(x-s.x)<1.9&&z>-9)||hitY(land,x,z)!=null||(Math.hypot(x,z+45)<14&&o.zone==='falls')||INWATER[o.zone].some(d=>Math.hypot(x-d[2],z-d[3])<2.6);
  let sd=7;const rn=()=>(sd=(sd*16807)%2147483647)/2147483647;
  const place=(n,cnt,opt,y)=>{let tries=0;for(let i=0;i<cnt&&tries<cnt*12;tries++){const x=cx+(rn()-.5)*36,z=-2-rn()*24;if(busy(x,z))continue;const g=fit(G[n].scene,{w:opt*(0.7+rn()*.6)});g.position.set(x,y,z);g.rotation.y=rn()*6.3;g.traverse(m=>{if(m.isMesh)m.castShadow=false;});root.add(g);i++;}};
  if(PADS[o.zone][0])place('fz_lotus_leaves',PADS[o.zone][0],2.2,.02);if(PADS[o.zone][1])place('fz_lotus_flower',PADS[o.zone][1],1.1,0);
  if(o.zone==='vip')for(const s of S.seats)aura(s.x);
  // คน: ฉัน + เพื่อนบนแท่นข้างๆ
  S.girl=G.punk;S.people=[];
  for(const s of S.seats){if(s.k===o.idx)S.me=makeChar(s,'ฉัน',true);else if(s.who&&s.who!=='ฉัน')makeChar(s,s.who,false);}
  // ปลาว่ายใต้น้ำ
  S.swim=[];const TL=new THREE.TextureLoader(),pool=Object.keys(FISH).filter(k=>FISH[k][1]<=3);
  const fg=new THREE.PlaneGeometry(1,1);fg.rotateX(-Math.PI/2);
  for(let i=0;i<(MOBILE?12:18);i++){const k=pool[i%pool.length];const tx=TL.load('fish/'+k+'.webp');tx.colorSpace=THREE.SRGBColorSpace;
    /* S4 แบบ Hay Day: เห็นเงาปลาสีเข้มหลายขนาดว่ายใต้ผิวน้ำ */const f=new THREE.Mesh(fg,new THREE.MeshBasicMaterial({map:tx,transparent:true,opacity:.55,color:0x0b3346,depthWrite:false}));const s=.7+Math.random()*1.0;f.scale.set(s,1,s);f.renderOrder=1;
    const x=cx+(Math.random()-.5)*20,z=-3-Math.random()*12;f.position.set(x,-.1,z);root.add(f);S.swim.push({f,x,z,a:Math.random()*6.3,sp:.5+Math.random()*.7,turn:0,cx});}
  sun.position.set(-8,16,10);sun.target.position.set(0,0,-2);
}
// แท่น VIP: ใช้ฐานศาลาทองขาว (ตัดหลังคาออก) จะได้เห็นตัวเองนั่งตกปลา
function ghostTop(obj,cut,cx,low){obj.traverse(m=>{if(!m.isMesh)return;m.material=m.material.clone();
  m.material.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWY;').replace('#include <project_vertex>','#include <project_vertex>\nvWY=(modelMatrix*vec4(transformed,1.)).xyz;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vWY;').replace('#include <dithering_fragment>','#include <dithering_fragment>\nif(vWY.y>'+cut.toFixed(3)+'||(vWY.y>'+low.toFixed(3)+'&&length(vWY.xz-vec2('+cx.toFixed(3)+',0.))>.95))discard;');};
  m.material.customProgramCacheKey=()=>'ghost'+cut.toFixed(2)+cx.toFixed(2);});}
// ---------- ออร่าทอง VIP: เสาแสง + วงแหวนบนน้ำ + ประกายลอยขึ้น ----------
let auraG=null;
function aura(x){auraG??={col:new THREE.CylinderGeometry(1.75,1.85,5,40,1,true).translate(0,2.5,0),ring:new THREE.RingGeometry(1.55,2.05,48).rotateX(-Math.PI/2)};
  const colM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{t:{value:0}},
    vertexShader:`varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform float t;varying vec2 vU;void main(){float a=pow(1.-vU.y,1.6)*(.55+.45*sin(vU.x*6.2832*6.+t*2.));a*=.55;gl_FragColor=vec4(vec3(1.,.78,.3)*a,a);}`});
  const col=new THREE.Mesh(auraG.col,colM);col.position.set(x,DECK-.1,0);col.renderOrder=4;root.add(col);
  const ringM=new THREE.MeshBasicMaterial({color:0xffd25a,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending});
  const ring=new THREE.Mesh(auraG.ring,ringM);ring.position.set(x,.04,0);ring.renderOrder=4;root.add(ring);
  const N=MOBILE?26:40,pos=new Float32Array(N*3),sp=[];for(let i=0;i<N;i++){const a=Math.random()*6.28,r=1.2+Math.random()*.6;sp.push({a,r,y:Math.random()*4,v:.4+Math.random()*.6});}
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const dot=canvasTex(32,32,(g,w,h)=>{const r=g.createRadialGradient(16,16,0,16,16,16);r.addColorStop(0,'rgba(255,250,220,1)');r.addColorStop(.4,'rgba(255,210,90,.8)');r.addColorStop(1,'rgba(255,200,80,0)');g.fillStyle=r;g.fillRect(0,0,w,h);});
  const pts=new THREE.Points(pg,new THREE.PointsMaterial({map:dot,size:.22,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));pts.renderOrder=5;root.add(pts);
  S.aura.push({x,colM,ringM,ring,pg,sp});}
function auraTick(dt,t){for(const A of S.aura){A.colM.uniforms.t.value=t;const k=(t*.5+A.x)%1;A.ring.scale.setScalar(1+k*.35);A.ringM.opacity=.85*(1-k);
  const p=A.pg.attributes.position;A.sp.forEach((q,i)=>{q.y+=q.v*dt;q.a+=dt*.4;if(q.y>4.2)q.y=0;p.setXYZ(i,A.x+Math.cos(q.a)*q.r,DECK+q.y,Math.sin(q.a)*q.r);});p.needsUpdate=true;}}
// ---------- ตัวละคร + เบ็ด + ทุ่น ----------
function makeChar(seat,name,me){const body=SU.clone(S.girl.scene);body.traverse(o=>{if(o.isMesh){o.frustumCulled=false;o.castShadow=true;}});
  const b=new THREE.Box3().setFromObject(body);const s=1.75/(b.max.y-b.min.y);body.scale.setScalar(s);body.position.y=-b.min.y*s;
  const g=new THREE.Group();g.add(body);root.add(g);g.position.set(seat.x,S.seatY-.12,.05);g.rotation.y=Math.PI;
  const mx=new THREE.AnimationMixer(body);const clip=p=>S.girl.animations.find(c=>c.name.startsWith(p));const a=mx.clipAction(clip('A girl sits upright'));a.play();mx.update(Math.random()*2);
  const tag=new THREE.Sprite(new THREE.SpriteMaterial({map:labelTex(name,me?'#ffcf5a':'rgba(255,248,236,.95)','#4a2a14',256,72),depthTest:false}));tag.scale.set(1.1,.3,1);tag.position.set(seat.x,S.seatY+1.05,0);tag.renderOrder=6;tag.visible=!me;root.add(tag);
  const c={seat,name,me,g,body,mx,hand:body.getObjectByName('R_Hand'),state:'idle',t:0,tag};S.people.push(c);
  setRod(c,me?S.rod:pick(Object.keys(RODS)));if(!me){c.state='cast';c.t=-Math.random()*3;}return c;}
async function setRod(c,kind){const [rg,fg]=await Promise.all([get('fz_rod_'+kind),get('fz_float_'+kind)]);
  if(c.rod){root.remove(c.rod.piv,c.rod.bob,c.rod.line);}
  const rod=fit(rg.scene,{w:1.45});rod.updateMatrixWorld(true);
  // หาปลายคันกับด้ามจับจากรูปทรงจริง
  let tip=null,butt=null;const v=new THREE.Vector3();rod.traverse(m=>{if(!m.isMesh)return;const p=m.geometry.attributes.position;for(let i=0;i<p.count;i+=3){v.fromBufferAttribute(p,i).applyMatrix4(m.matrixWorld);if(!tip||v.y>tip.y)tip=v.clone();}});
  rod.traverse(m=>{if(!m.isMesh)return;const p=m.geometry.attributes.position;for(let i=0;i<p.count;i+=3){v.fromBufferAttribute(p,i).applyMatrix4(m.matrixWorld);if(!butt||v.distanceTo(tip)>butt.distanceTo(tip))butt=v.clone();}});
  const inner=new THREE.Group();inner.add(rod);const grip=butt.clone().lerp(tip,.2);rod.position.sub(grip);
  const dir=tip.clone().sub(butt);inner.rotation.y=dir.x>0?Math.PI/2:-Math.PI/2;
  const piv=new THREE.Group();piv.add(inner);root.add(piv);
  const tipL=tip.clone().sub(grip);
  const bob=fit(fg.scene,{h:.42});root.add(bob);
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.9}));root.add(line);
  c.rod={piv,inner,tipL,bob,line,kind,tw:new THREE.Vector3()};c.target=new THREE.Vector3(c.seat.x+(c.me?.2:(Math.random()-.5)),0,-6.2-Math.random()*.6);bob.visible=c.state!=='idle';}
const hp=new THREE.Vector3();
function tickChar(c,dt,t){c.mx.update(dt);if(!c.rod)return;
  c.hand?c.hand.getWorldPosition(hp):hp.set(c.seat.x+.25,S.seatY+.4,-.2);
  const r=c.rod;r.piv.position.copy(hp);const lift=c.state==='cast'&&c.t<.35?-.6+Math.max(0,c.t)*2:c.state==='reel'?Math.sin(t*20)*.08-.25:0;
  r.piv.rotation.set(0,0,-.32);r.inner.rotation.x=0;r.piv.rotation.x=lift+ (c.state==='bite'?-.12+Math.sin(t*26)*.05:0);
  r.piv.updateMatrixWorld(true);r.tw.copy(r.tipL);r.inner.localToWorld(r.tw);
  const T=c.target;let bx=T.x,bz=T.z,by=-.1+Math.sin(t*2.2+T.x)*.03;
  if(c.state==='cast'){const k=Math.max(0,Math.min(1,(c.t-.25)/.7));bx=r.tw.x+(T.x-r.tw.x)*k;bz=r.tw.z+(T.z-r.tw.z)*k;by=r.tw.y+(-.1-r.tw.y)*k+Math.sin(k*Math.PI)*1.4;r.bob.visible=c.t>.2;}
  if(c.state==='bite'){by=-.28+Math.sin(t*24)*.09;}
  if(c.state==='reel'){const k=Math.min(1,c.t/.5);bx=T.x+(r.tw.x-T.x)*k;bz=T.z+(r.tw.z-T.z)*k;by=-.1+(r.tw.y-.4)*k;}
  r.bob.position.set(bx,by,bz);r.bob.rotation.z=c.state==='bite'?Math.sin(t*18)*.3:Math.sin(t*1.7)*.08;
  const p=r.line.geometry.attributes.position;p.setXYZ(0,r.tw.x,r.tw.y,r.tw.z);p.setXYZ(1,bx,by+.36,bz);p.needsUpdate=true;r.line.visible=r.bob.visible;
  c.t+=dt;
  if(c.me)return;
  if(c.state==='cast'&&c.t>1){c.state='wait';c.t=0;c.wait=6+Math.random()*12;ripple(bx,bz);}
  else if(c.state==='wait'&&c.t>c.wait){c.state='bite';c.t=0;ripple(bx,bz);}
  else if(c.state==='bite'&&c.t>1.1){c.state='reel';c.t=0;const k=pick(Object.keys(FISH).filter(k=>FISH[k][1]<=3));leap(c,k);feed('🐟 '+c.name+' ได้'+FISH[k][0]);}
  else if(c.state==='reel'&&c.t>1.6){c.state='cast';c.t=0;}}
// ---------- น้ำกระเพื่อม ปลากระโดด ----------
const RIP=[],DROPS=[],JUMP=[];let ripG,dropG,dropM;
function ripple(x,z,s=1){ripG??=new THREE.RingGeometry(.35,.45,32).rotateX(-Math.PI/2);const m=new THREE.Mesh(ripG,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85,depthWrite:false}));m.position.set(x,.03,z);m.renderOrder=3;root.add(m);RIP.push({m,t:0,s});}
function splash(x,z){ripple(x,z,1.6);ripple(x,z,1);dropG??=new THREE.SphereGeometry(.06,6,4);dropM??=new THREE.MeshBasicMaterial({color:0xeefcff});for(let i=0;i<12;i++){const m=new THREE.Mesh(dropG,dropM);m.position.set(x,.1,z);const a=Math.random()*6.3,s=.8+Math.random()*1.4;root.add(m);DROPS.push({m,vx:Math.cos(a)*s,vz:Math.sin(a)*s,vy:2.6+Math.random()*2.2});}}
function leap(c,k,done){const tx=new THREE.TextureLoader().load('fish/'+k+'.webp');tx.colorSpace=THREE.SRGBColorSpace;const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,depthTest:false}));sp.scale.set(1.1,1.1,1);sp.renderOrder=7;root.add(sp);
  const from=c.rod.bob.position.clone();JUMP.push({sp,from,to:new THREE.Vector3(c.seat.x+(c.me?.95:0),DECK+.6,c.me?.05:0),t:0,done});splash(from.x,from.z);}
function fx(dt){for(let i=RIP.length-1;i>=0;i--){const r=RIP[i];r.t+=dt;const k=r.t/1.3;r.m.scale.setScalar(1+k*2.6*r.s);r.m.material.opacity=.85*(1-k);if(k>=1){root.remove(r.m);RIP.splice(i,1);}}
  for(let i=DROPS.length-1;i>=0;i--){const d=DROPS[i];d.vy-=9.8*dt;d.m.position.x+=d.vx*dt;d.m.position.z+=d.vz*dt;d.m.position.y+=d.vy*dt;if(d.m.position.y<0){root.remove(d.m);DROPS.splice(i,1);}}
  for(let i=JUMP.length-1;i>=0;i--){const j=JUMP[i];j.t+=dt/1.1;const k=Math.min(1,j.t);j.sp.position.lerpVectors(j.from,j.to,k);j.sp.position.y+=Math.sin(k*Math.PI)*2.6;j.sp.material.rotation=Math.sin(k*12)*.4;if(k>=1){root.remove(j.sp);JUMP.splice(i,1);j.done&&j.done();}}
  /* เงาปลาว่ายเข้าหาทุ่นตอนรอปลา · ปลากินเบ็ด = พุ่งเข้าหาทุ่น */const me=S.me,lu=me&&me.rod&&me.rod.bob&&(me.state==='wait'||me.state==='bite')?me.rod.bob.position:null;
  if(!lu)S.lure=null;else if(!S.lure&&S.swim.length){let b=null,bd=1e9;for(const q of S.swim){const d=Math.hypot(q.x-lu.x,q.z-lu.z);if(d<bd){bd=d;b=q;}}S.lure=b;}
  for(const s of S.swim){if(s===S.lure&&lu){const dx=lu.x-s.x,dz=lu.z-s.z,d=Math.hypot(dx,dz),want=Math.atan2(dz,dx),bite=me.state==='bite',stop=bite?.15:.9;let da=Math.atan2(Math.sin(want-s.a),Math.cos(want-s.a));s.a+=da*Math.min(1,dt*3);
    if(d>stop){const sp=(bite?2.4:.55)*Math.min(1,d);s.x+=Math.cos(s.a)*sp*dt;s.z+=Math.sin(s.a)*sp*dt;}else s.a+=dt*.8;s.f.position.x=s.x;s.f.position.z=s.z;s.f.rotation.y=-s.a;continue;}
  s.turn-=dt;if(s.turn<=0){s.a+=(Math.random()-.5)*1.5;s.turn=1.5+Math.random()*3;}const nx=s.x+Math.cos(s.a)*s.sp*dt,nz=s.z+Math.sin(s.a)*s.sp*dt;
    if(nz>-2.2||nz<-16||Math.abs(nx-s.cx)>12){s.a+=Math.PI*.8;continue;}s.x=nx;s.z=nz;s.f.position.x=nx;s.f.position.z=nz;s.f.rotation.y=-s.a;}}

// ---------- หน้าจอ / กติกา (เหมือนซีซั่น 3) ----------
function feed(t){const f=$('p3feed');const d=document.createElement('div');d.textContent=t;f.prepend(d);while(f.children.length>3)f.lastChild.remove();setTimeout(()=>{d.classList.add('out');setTimeout(()=>d.remove(),700);},4000);}
const WAIT_DEMO=6; // ของจริง: บ่อทั่วไปรอ 10 นาที · VIP 5 นาที
function ui(){const me=S.me,st=me?.state||'idle';const b=$('p3act');
  $('p3rods').style.display=st==='idle'&&!S.real?'':'none';$('p3bar2').classList.toggle('on',st==='mini'&&!S.real);
  if(S.real&&S.standby){b.textContent='🎣 นั่งตกต่อที่แท่นนี้';b.className='act';}
  else if(st==='idle'){b.textContent=S.real?'🎣 เลือกเบ็ด แล้วหย่อนเบ็ด':'🎣 หย่อนเบ็ด';b.className='act';}
  else if(st==='cast'||st==='wait'){b.textContent='⏳ รอปลากินเบ็ด '+(S.real?mmss(S.waitEnd-performance.now()):'…');b.className='act wait';}
  else if(st==='bite'){b.textContent='❗ ปลากินเบ็ดแล้ว แตะเลย!';b.className='act bite';}
  else if(st==='mini'){b.textContent='ดึง!';b.className='act pull';}
  else{b.textContent='🎣 กำลังดึง…';b.className='act wait';}
  {const row=$('p3row');if(row){row.hidden=!S.real||!!S.standby;const bb=$('p3bait');bb.hidden=!(S.real&&(st==='wait'||st==='cast')&&!S.baited&&!S.vipSeat&&S.baitHave>0);bb.textContent='⚡ ใช้บูสเตอร์ (เหลือ '+S.baitHave+')';}}
  $('p3mis').style.display='none';
  $('p3bag').textContent='🧺 '+S.bag;}
function rodsUI(){$('p3rods').innerHTML=Object.entries(RODS).map(([k,r])=>`<button data-k="${k}" class="${k===S.rod?'on':''}"><img src="fish/rod-${k}.webp" alt=""><span>${r.n.replace('เบ็ด','')}</span></button>`).join('');
  $('p3rods').querySelectorAll('button').forEach(b=>b.onclick=()=>{S.rod=b.dataset.k;rodsUI();setRod(S.me,S.rod);});}
function act(){const me=S.me;if(!me)return;
  if(S.real){const st=me.state;if(S.standby){S.post('resit');return;}if(st==='idle')S.post('p3rod');else if(st==='bite')S.post('p3collect');else if(st==='wait'||st==='cast')feed('⏳ รอปลากินเบ็ดอีก '+mmss(S.waitEnd-performance.now()));return;}
  if(me.state==='idle'){me.state='cast';me.t=0;me.rod.bob.visible=true;setTimeout(()=>{if(me.state==='cast'){me.state='wait';me.t=0;ripple(me.target.x,me.target.z);S.waitEnd=performance.now()+WAIT_DEMO*1000*(S.vip?.6:1)+Math.random()*3000;}},1000);}
  else if(me.state==='bite'){startMini();}
  else if(me.state==='mini'){pull();}
  ui();}
function startMini(){const me=S.me;let level;
  S.res=rollCatch();level=Math.max(...S.res.map(k=>FISH[k][1]));
  let [period,width]=level<=3?({1:[2000,30],2:[1600,24],3:[1300,18]}[level]):[Math.max(650,1200-70*(level-4)),Math.max(8,15-(level-4))];
  const mood=weighted([35,45,20]);if(mood===0){period*=1.7;width*=1.6;}if(mood===2){period*=.85;width*=.85;}width=Math.min(45,width);
  S.mini={period,width,zone:8+Math.random()*(84-width),at:performance.now()};$('p3zone').style.left=S.mini.zone+'%';$('p3zone').style.width=width+'%';me.state='mini';ui();}
function needle(now){const m=S.mini;const ph=(((now-m.at)%m.period)+m.period)%m.period/m.period;return (ph<.5?ph*2:2-ph*2)*100;}
function rollCatch(){const r=RODS[S.rod];const n=1+weighted(r.cnt);const out=[];for(let i=0;i<n;i++)out.push(pick(TIER[1+weighted(r.tier)]));return out;}
function pull(){const me=S.me,now=performance.now();const x=[needle(now-120),needle(now)];const ok=Math.max(...x)>=S.mini.zone&&Math.min(...x)<=S.mini.zone+S.mini.width;
  me.state='reel';me.t=0;ui();
  if(ok){const fs=S.res;leap(me,fs[0],()=>{card(fs,fs.length>1?`ได้ ${fs.length} ตัว!`:'ได้ปลาแล้ว!');S.bag+=fs.length;});}
  else{splash(me.rod.bob.position.x,me.rod.bob.position.z);setTimeout(()=>card([],'ดึงพลาดจังหวะ ปลาหนีไปแล้ว'),700);}}
function card(fs,title){const c=$('p3card');c.querySelector('h3').textContent=(fs.length?'🎉 ':'💦 ')+title;
  c.querySelector('.fs').innerHTML=fs.map(k=>`<div class="f"><img src="fish/${k}.webp" alt=""><b>${FISH[k][0]}</b><span>${S.vip?'👑 ':''}${lb(k,S.vip)} lb · ${'⭐'.repeat(FISH[k][1])}</span></div>`).join('')||`<div class="f none"><img src="fish/rod-${S.rod}.webp" alt=""></div>`;
  c.classList.add('on');}
$('p3ok').onclick=()=>{$('p3card').classList.remove('on');if(S.me){S.me.state='idle';S.me.rod.bob.visible=false;}ui();};
$('p3act').onclick=act;
/* S4 ข้อ 40/41: ปุ่มลุกจากที่นั่ง (ถามยืนยันก่อน แล้วกลับหน้าแผนที่ตกปลา) · ปุ่มบูสเตอร์ระหว่างรอปลา */
$('p3bait').onclick=e=>{e.stopPropagation();if(S&&S.real)S.post('p3bait');};
$('p3leave').onclick=e=>{e.stopPropagation();if(!S||!S.real)return;S.leaving=Date.now();S.post('p3leave');};
$('p3back').onclick=()=>close();

// ---------- เปิด / ปิด ----------
let onClose=null,last=0;
export async function openPond(o){if(!R)init();onClose=o.onClose;
  S={real:!!o.post,post:o.post||null,waitEnd:0,aura:[],zone:o.zone,vip:o.zone==='vip',rod:o.zone==='vip'?'moon':'bamboo',yaw:1.05,pitch:.04,dist:1,stage:0,hearts:2,bag:0,people:[],swim:[]};
  $('p3').classList.add('on');$('p3load').classList.remove('done');$('p3title').textContent=(S.vip?'👑 ':'🎣 ')+'แท่น'+o.name;
  size();need=0;got=0;prog();rodsUI();ui();
  await build(o);
  $('p3load').classList.add('done');ui();
  feed(S.vip?'👑 นั่งแท่น VIP แล้ว · ปลาตัวใหญ่กว่าปกติ':'🎣 นั่งที่แท่น'+o.name+' แล้ว');
  cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop);}
/* ---------- ผูกกับกติกาจริงของซีซัน 3: สถานะแท่นของเรามาจากหน้าเกมทุก 1 วินาที ---------- */
const mmss=ms=>{const t=Math.max(0,Math.ceil(ms/1000));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');};
export function standby(){if(!S||!S.me)return;if(S.leaving&&Date.now()-S.leaving<90000){S.leaving=0;close();return;}S.standby=true;const me=S.me;if(me.state!=='reel'){me.state='idle';me.rod.bob.visible=false;}ui();}
export function sync(s){if(!S||!S.me||!s)return;const me=S.me,now=performance.now();S.ph=s.ph;S.standby=false;S.baited=!!s.b;S.vipSeat=!!s.v;S.baitHave=s.bh|0;
  if(s.ph==='wait'){S.waitEnd=now+(s.l||0);if(me.state==='idle'){me.state='cast';me.t=0;me.rod.bob.visible=true;setTimeout(()=>{if(S&&S.me===me&&me.state==='cast'){me.state='wait';me.t=0;ripple(me.target.x,me.target.z);ui();}},1000);}}
  else if(s.ph==='hook'){if(me.state!=='bite'&&me.state!=='reel'){me.state='bite';me.t=0;me.rod.bob.visible=true;ripple(me.target.x,me.target.z);splash(me.target.x,me.target.z);feed('❗ ปลากินเบ็ดแล้ว แตะปุ่มด้านล่างเลย!');}}
  else if(me.state!=='idle'&&me.state!=='reel'){me.state='idle';me.rod.bob.visible=false;}
  ui();}
export function result(r){if(!S||!S.me||!r)return;const me=S.me;me.state='reel';me.t=0;ui();
  const f=(r.caught||[])[0];if(r.ok&&f&&FISH[f.k]){leap(me,f.k,()=>{if(!S)return;S.bag+=(r.caught||[]).length;me.state='idle';me.rod.bob.visible=false;ui();});}
  else{splash(me.rod.bob.position.x,me.rod.bob.position.z);setTimeout(()=>{if(S&&S.me===me){me.state='idle';me.rod.bob.visible=false;ui();}},900);}}
export function isOpen(){return !!S;}
export function shut(){if(S)close();}
function close(){cancelAnimationFrame(raf);$('p3').classList.remove('on');$('p3card').classList.remove('on');if(root){sc.remove(root);root=null;}RIP.length=DROPS.length=JUMP.length=0;S=null;onClose&&onClose();}
function loop(now){raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;waterU.t.value=t;
  const me=S.me;if(S.real&&me&&(me.state==='wait'||me.state==='cast')){const sec=Math.ceil((S.waitEnd-now)/1000);if(sec!==S.lastSec){S.lastSec=sec;ui();}}
  if(!S.real&&me&&me.state==='wait'&&now>S.waitEnd){me.state='bite';me.t=0;ripple(me.target.x,me.target.z);splash(me.target.x,me.target.z);ui();}
  if(me&&me.state==='mini')$('p3needle').style.left=needle(now)+'%';
  for(const c of S.people)tickChar(c,dt,t);fx(dt);auraTick(dt,t);
    // กล้อง: อยู่หลังตัวเรา มองออกไปที่ทุ่น
  const L=innerWidth>innerHeight,d=(L?14:15)*(1-.45*Math.min(1,Math.abs(S.yaw)/1.3))*S.dist,yaw=S.yaw,el=(L?.36:.42)+S.pitch;const sw=Math.min(1,Math.abs(yaw)/1.3);const tg=new THREE.Vector3(0,(L?1.1:.6)-(L?.25:-.25)*sw,(L?-4.2:-3)+(L?3.6:2.4)*sw);
  cam.position.set(tg.x+Math.sin(yaw)*Math.cos(el)*d,tg.y+Math.sin(el)*d,tg.z+Math.cos(yaw)*Math.cos(el)*d);cam.lookAt(tg);for(const c of S.people)if(!c.me)c.tag.visible=c.tag.position.distanceTo(cam.position)>6;waterU.cp.value.copy(cam.position);
  R.render(sc,cam);}
window.__P3={get S(){return S}};
