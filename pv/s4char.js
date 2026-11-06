/* ซีซั่น 4 · ตัวละครของผู้เล่นในทุกหน้า 3D (ฟาร์ม · บ้าน · โซนสัตว์ · ซาฟารี · ตกปลา · ชุมชน)
   - ตัวละคร 4 แบบ × ชุด 20 (+ ชุดราชินี) อยู่ใน ch/<file>.glb (กระดูกชุดเดียวกัน 78 ชิ้น)
   - ท่าทาง: 38 ท่าเดิมอยู่ใน ch/pink-punk.glb · 12 ท่าใหม่ (ไหว้ คุย พยักหน้า ...) อยู่ใน ch/moves2.glb
   - ชุดที่ใส่อยู่อ่านจากเซฟ (sub.char) ผ่าน __HOST ของหน้าแม่ · ยังไม่สุ่ม = ชมพู punk
   - ท่าทางย้ายไปใส่ชุดอื่นด้วย retarget ตามท่ายืนตั้งต้น (สูตรเดียวกับเพื่อนในฟาร์ม) */
export const OUTFIT_FILE={queen:'pink-queen',punk:'pink-punk',figure:'pink-figure',cute:'pink-cute',play:'pink-play',swim:'pink-swim',n4:'pink-n4',cat:'pink-cat',n1:'pink-n1',n5:'pink-n5',girl:'pink-girl',formal:'pink-formal',thaiO:'pink-thaiO',thaiG:'pink-thaiG',thaiB:'pink-thaiB',n2:'pink-n2',fairy:'pink-fairy',n3:'pink-n3',princess:'pink-princess',prin2:'pink-prin2',thaiR:'pink-thaiR'};
for(const p of ['m','r','b'])for(let i=1;i<=20;i++){const id=p+String(i).padStart(2,'0');OUTFIT_FILE[id]=id;}
export const MOVES={walk:'walk.001',run:'run.001',idle:'A girl stands relaxed',water:'A girl stands upright holding a watering can',sit:'A girl sits upright on a bench',wave:'A cheerful girl stands upright and waves',admire:'A girl stands upright, turns slightly',feed:'A girl stands upright and pours food',plant:'A girl crouches down with her back upright, presses a small see',dig:'dig.001',cry:'cry.001',greet:'greet_01',lie:'A girl lies down on her back on the ground with arms resting at',sitGround:'A girl sits on the ground with legs crossed',dock:'A girl sits on the edge of a high wooden dock with both lower l',cook:'A girl stands upright in front of a cooking pot',eat:'A girl sits upright on a chair, brings a spoon',harvest:'A girl bends her knees with her back upright, grabs a plant',jump:'A girl jumps up happily',happy:'A delighted girl bounces',clasp:'A delighted girl clasps',pet:'A girl kneels down on one knee and gently strokes',carry:'A girl walks forward at a relaxed pace in a loop, holding a box',sigh:'A girl stands upright, lowers her shoulders',kneel:'A girl kneels sitting back',squat:'A girl squats down on the ground with knees bent wide apart and',crouch:'A girl bends both knees and squats',stand:'A girl stands upright with her back straight and head level',bowl:'A girl stands upright holding a small bowl',sitCross:'A girl sitting cross-legged on the ground puts one hand on the ',sleep:'A girl lies on her back with her arms resting at her sides, eye',
 dance:'mv_dance',nod:'mv_nod',shock:'mv_shock',sulk:'mv_sulk',kiss:'mv_kiss',shy:'mv_shy',receive:'mv_receive',wai:'mv_wai',shake:'mv_shake',talk:'mv_talk',laugh:'mv_laugh',think:'mv_think'};
const host=()=>{try{if(window.__HOST&&window.__HOST.get)return window.__HOST;}catch(e){}try{if(parent.__HOST&&parent.__HOST.get)return parent.__HOST;}catch(e){}try{if(parent.parent.__HOST&&parent.parent.__HOST.get)return parent.parent.__HOST;}catch(e){}return null;};
/* ตัวละคร/ชุดที่ใส่อยู่ตอนนี้ */
export function charInfo(){let c=null;try{const H=host();const g=H&&JSON.parse(H.get('s3all-v1')||'{}');c=g&&g.sub&&g.sub.char||null;}catch(e){}
 if(!c){try{c=JSON.parse(sessionStorage.getItem('s4char')||'null');}catch(e){}}
 const tribe=c&&['pink','mint','red','bob'].includes(c.tribe)?c.tribe:'pink';const wear=c&&OUTFIT_FILE[c.wear]?c.wear:({pink:'punk',mint:'m01',red:'r01',bob:'b01'})[tribe];
 return {tribe,wear,file:OUTFIT_FILE[wear],rolled:!!(c&&c.tribe)};}
export function rememberChar(c){try{sessionStorage.setItem('s4char',JSON.stringify(c));}catch(e){}}
/* ตัวดาวน์โหลด (เก็บผลไว้ต่อหน้า) */
const BUF={};export function fetchGlb(url){return BUF[url]||(BUF[url]=fetch(url).then(r=>{if(!r.ok)throw new Error('โหลดไม่ได้ '+url);return r.arrayBuffer();}));}
const PARSED={};export function parseGlb(loader,url,base){return PARSED[url]||(PARSED[url]=fetchGlb(url).then(ab=>new Promise((res,rej)=>loader.parse(ab,base,res,rej))));}
/* ท่ายืนตั้งต้นของทุกกระดูก · names = ชื่อกระดูกที่ต้องการ (ไฟล์ท่าทางล้วน เช่น moves2.glb ไม่มี skin กระดูกเลยเป็น Object3D ธรรมดา ต้องจับด้วยชื่อ) */
export function restOf(THREE,root,names){root.updateMatrixWorld(true);const rest={};root.traverse(o=>{if(o===root||!o.parent)return;if(o.isBone||(names&&names.has(o.name)))rest[o.name]={p:o.position.clone(),w:o.getWorldQuaternion(new THREE.Quaternion()),pw:o.parent.getWorldQuaternion(new THREE.Quaternion())};});return rest;}
const boneNames=root=>{const s=new Set();root.traverse(o=>{if(o.isBone)s.add(o.name);});return s;};
export function retargetClip(THREE,clip,S,Tr){if(!clip)return null;const tracks=[],q=new THREE.Quaternion();
 for(const t of clip.tracks){const dot=t.name.lastIndexOf('.'),bn=t.name.slice(0,dot),prop=t.name.slice(dot+1);if(!S[bn]||!Tr[bn])continue;
  if(prop==='quaternion'){const A=Tr[bn].pw.clone().invert().multiply(S[bn].pw),B=S[bn].w.clone().invert().multiply(Tr[bn].w);const v=new Float32Array(t.values.length);for(let i=0;i<v.length;i+=4){q.fromArray(t.values,i);q.premultiply(A).multiply(B).normalize().toArray(v,i);}tracks.push(new THREE.QuaternionKeyframeTrack(t.name,t.times,v));}
  else if(prop==='position'&&bn==='Hip'){const ps=S[bn].p,pt=Tr[bn].p,v=new Float32Array(t.values.length);for(let i=0;i<v.length;i+=3){v[i]=pt.x+(t.values[i]-ps.x);v[i+1]=pt.y+(t.values[i+1]-ps.y);v[i+2]=pt.z+(t.values[i+2]-ps.z);}tracks.push(new THREE.VectorKeyframeTrack(t.name,t.times,v));}}
 return new THREE.AnimationClip(clip.name,clip.duration,tracks);}
const stripRoot=g=>{for(const c of g.animations)c.tracks=c.tracks.filter(t=>!(t.name.endsWith('.position')&&/BoneRoot|Armature/.test(t.name)));};
/* โหลดตัวละคร + ท่าทางครบ (ท่าที่ไม่มีในไฟล์ = ไม่มีใน clips)
   base = path ไปโฟลเดอร์ ch/ จากหน้านี้ เช่น '../ch/' · wearId = ชุดที่ต้องการ (ไม่ใส่ = ชุดที่ใส่อยู่) */
export async function loadCharacter({THREE,loader,base='../ch/',wear,tribe}={}){
 const info=charInfo();const id=wear&&OUTFIT_FILE[wear]?wear:info.wear;const file=OUTFIT_FILE[id];
 const [punk,mv2,own]=await Promise.all([parseGlb(loader,base+'pink-punk.glb',base),parseGlb(loader,base+'moves2.glb',base).catch(()=>null),file==='pink-punk'?null:parseGlb(loader,base+file+'.glb',base)]);
 stripRoot(punk);if(mv2)stripRoot(mv2);
 const srcBody=punk.scene,body=own?own.scene.clone?cloneSkinned(THREE,own.scene):own.scene:cloneSkinned(THREE,punk.scene);
 /* แคชท่าต่อชุด: ตัวที่สองของชุดเดียวกัน (เพื่อนในนคร/บ่อ) ไม่ต้องย้ายท่าใหม่ → ไม่หน่วง */if(CLIPS_BY_FILE[file])return {body,clips:CLIPS_BY_FILE[file],tribe:info.tribe,wear:id,file,info};
 const clips={};const find=(list,p)=>list.find(c=>c.name.startsWith(p));
 const NAMES=boneNames(body);const TR=restOf(THREE,body);const SR=file==='pink-punk'?null:restOf(THREE,srcBody);const SR2=mv2?restOf(THREE,mv2.scene,NAMES):null;
 for(const [key,prefix] of Object.entries(MOVES)){let c=find(punk.animations,prefix),fromMv2=false;if(!c&&mv2){c=find(mv2.animations,prefix);fromMv2=true;}if(!c)continue;
  if(fromMv2){/* ท่าใหม่จาก moves2: ย้ายจากท่ายืนของไฟล์ท่าไปท่ายืนของชุดนี้ (รวมชุด punk เอง) */const rc=retargetClip(THREE,c,SR2,TR);if(rc&&rc.tracks.length)clips[key]=rc;}
  else if(SR){const rc=retargetClip(THREE,c,SR,TR);if(rc&&rc.tracks.length)clips[key]=rc;}else clips[key]=c;}
 CLIPS_BY_FILE[file]=clips;return {body,clips,tribe:info.tribe,wear:id,file,info};}
const CLIPS_BY_FILE={};
function cloneSkinned(THREE,src){/* SkeletonUtils.clone แบบย่อ (ไม่ต้อง import เพิ่ม) */const srcBones=[];src.traverse(o=>{if(o.isBone)srcBones.push(o);});const clone=src.clone(true);const map=new Map();const dst=[];clone.traverse(o=>{if(o.isBone)dst.push(o);});srcBones.forEach((b,i)=>map.set(b,dst[i]));
 clone.traverse(o=>{if(!o.isSkinnedMesh)return;const sk=o.skeleton;const bones=sk.bones.map(b=>map.get(b)||b);o.bind(new THREE.Skeleton(bones,sk.boneInverses),o.bindMatrix);});return clone;}
/* ออร่าตอนเปลี่ยนชุด (ใช้ในฉาก): เรียก burstAt(scene, x,y,z) แล้วลบเองใน 1.2 วิ */
export function auraBurst(THREE,scene,pos,color=0xffd6f0){const g=new THREE.Group();g.position.copy(pos);scene.add(g);const ring=new THREE.Mesh(new THREE.RingGeometry(.3,.5,32),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;g.add(ring);
 const sp=new THREE.PointLight(color,2.5,6);sp.position.y=1;g.add(sp);const t0=performance.now();const tick=()=>{const k=(performance.now()-t0)/1200;if(k>=1){scene.remove(g);return;}ring.scale.setScalar(1+k*5);ring.material.opacity=.9*(1-k);sp.intensity=2.5*(1-k);requestAnimationFrame(tick);};tick();}

/* ท่าของผู้ชาย (โมเดล Meshy ริกเดียวกับชุดสาว): ย้ายท่าจาก moves2 มาใส่ตัวผู้ชาย → ยืน/ไหว้/คุย/จูบ/เต้น ไม่ต้องอัดท่าใส่ทุกไฟล์ */
export async function manClips({THREE,loader,base='../ch/',body,walkClips=[]}){const clips={};const w=walkClips.find(a=>/walk/i.test(a.name))||walkClips[0];if(w)clips.walk=w;
 try{const mv2=await parseGlb(loader,base+'moves2.glb',base);stripRoot(mv2);const NAMES=boneNames(body);const TR=restOf(THREE,body);const SR2=restOf(THREE,mv2.scene,NAMES);
  const M={idle:'mv_nod',talk:'mv_talk',wai:'mv_wai',shy:'mv_shy',kiss:'mv_kiss',dance:'mv_dance',laugh:'mv_laugh',think:'mv_think',sulk:'mv_sulk',receive:'mv_receive',shock:'mv_shock',shake:'mv_shake'};
  for(const [k,n] of Object.entries(M)){const c=mv2.animations.find(a=>a.name.startsWith(n));if(!c)continue;const rc=retargetClip(THREE,c,SR2,TR);if(rc&&rc.tracks.length)clips[k]=rc;}}catch(e){}
 return clips;}
