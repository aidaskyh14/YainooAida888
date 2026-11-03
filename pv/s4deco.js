/* ซีซัน 4: ตกแต่งโซน 3D (สวนหมา · สวนแมว · หลังบ้านแฮมสเตอร์ · ทุ่งอัลปาก้า)
   🎨 แตะปุ่ม = โหมดแต่ง: แตะของในถาดเพื่อวาง · ลากของเพื่อย้าย · 🔄 หมุน · 📦 เก็บกลับ · ✅ เสร็จ
   บันทึกขึ้นเซิร์ฟเวอร์ในเซฟของผู้เล่นเอง (ส่วน module-s4deco-<โซน>) เปิดเครื่องไหนก็เห็นเหมือนกัน · ไม่แตะกระเป๋า/กุศล */
(()=>{
 const NAMES={d_barbecue_grill:'เตาปิ้งย่าง',d_beach_chair_set:'เก้าอี้ชายหาด',d_beehive_cluster:'รังผึ้ง',d_birdhouse:'บ้านนก',d_carousel_horse:'ม้าหมุน',d_cartoon_rowboat:'เรือพาย',d_cute_candy_cart:'รถขนม',
  d_decorative_canister_set:'ชุดโถ',d_decorative_clay_pot:'โอ่งดินเผา',d_decorative_string_light:'ไฟประดับ',d_enchanted_phone_booth:'ตู้โทรศัพท์',d_firewood_stack:'กองฟืน',d_flower_frame:'ซุ้มดอกไม้',d_flower_planter:'กระบะดอกไม้',
  d_flower_pots:'กระถางดอกไม้',d_flower_wheelbarrow:'รถเข็นดอกไม้',d_fountain:'น้ำพุ',d_golden_telescope:'กล้องส่องดาว',d_hanging_flower_basket:'กระเช้าดอกไม้',d_hay_bale:'ฟางก้อน',d_hot_air_balloon:'บอลลูน',
  d_mushroom_stumps:'ตอเห็ด',d_ornate_piano:'เปียโน',d_picnic_basket_food:'ตะกร้าปิกนิก',d_pink_bunny_plush:'ตุ๊กตากระต่าย',d_pink_striped_hammock:'เปลญวน',d_pink_vending_machine:'ตู้กดน้ำ',d_playground_slide:'สไลเดอร์',
  d_purple_polka_teacup:'ถ้วยหมุน',d_rickshaw:'รถลาก',d_rock_cluster:'กองหิน',d_scarecrow_plush:'หุ่นไล่กา',d_stone_well:'บ่อน้ำ',d_stylized_bicycle:'จักรยาน',d_stylized_lanterns:'โคมไฟ',d_sunflowers:'ทานตะวัน',
  d_unicorn_ride_toy:'ม้ายูนิคอร์น',d_vintage_scooter:'สกู๊ตเตอร์',d_water_lily_pond:'บ่อบัว',d_wicker_garden_furniture:'ชุดหวาย',d_windmill:'กังหันลม',d_wooden_barrels:'ถังไม้',d_wooden_dog_house:'บ้านไม้',
  d_wooden_easel:'ขาตั้งวาด',d_wooden_gazebo:'ศาลา',d_wooden_hot_tub:'อ่างไม้',d_wooden_seesaw:'กระดานหก',d_wooden_signpost:'ป้ายไม้',d_wooden_swing:'ชิงช้า',d_wooden_tea_table:'โต๊ะน้ำชา'};
 const SIZE={d_hot_air_balloon:5,d_wooden_gazebo:5.5,d_windmill:5,d_carousel_horse:4,d_fountain:4,d_water_lily_pond:4.5,d_playground_slide:4,d_wooden_hot_tub:3.6,d_purple_polka_teacup:3.6,d_cartoon_rowboat:3.6};
 window.S4DECO={init(o){
  const {THREE,sc,cam,dom,key}=o;const MAX=o.max||60,TH=o.thBase||'../farm3d/th4/';const fitM=o.fit,model=o.model;let H=null;try{H=(parent.parent&&parent.parent.__HOST)||parent.__HOST||null;}catch(e){}
  const SKEY='s4deco-'+key;let LIST=[];try{const v=H&&H.get(SKEY);if(v)LIST=JSON.parse(v)||[];}catch(e){LIST=[];}if(!Array.isArray(LIST))LIST=[];
  const CAT=Object.keys(NAMES);const objs=new Map();let seq=Date.now()%1e6;
  /* แจ้งโซน: ตำแหน่ง+ขนาดของที่วาง (ให้สัตว์/ตัวละครเดินอ้อม) */const chg=()=>{if(!o.onChange)return;try{o.onChange(LIST.map(it=>{const g=objs.get(it.id);if(!g)return null;const b=new THREE.Box3().setFromObject(g),z=b.getSize(new THREE.Vector3());return [g.position.x,g.position.z,Math.max(.6,Math.max(z.x,z.z)*.42)];}).filter(Boolean));}catch(e){}};
  let t=0;const save=()=>{clearTimeout(t);t=setTimeout(()=>{try{if(H)H.set(SKEY,JSON.stringify(LIST.slice(0,MAX)));}catch(e){console.warn('s4deco',e&&e.message);}},900);};
  const spawn=async it=>{try{const src=await model(it.n);const sz=SIZE[it.n]||2.6;const g=fitM(src,sz,sz,sz*1.15);g.position.set(it.x,0,it.z);g.rotation.y=it.r||0;g.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}});g.userData.s4d=it.id;sc.add(g);objs.set(it.id,g);if(o.onPlace)o.onPlace(g,it);chg();return g;}catch(e){console.warn('deco load',it.n,e&&e.message);return null;}};
  LIST=LIST.filter(it=>it&&NAMES[it.n]&&isFinite(it.x)&&isFinite(it.z)).slice(0,MAX);LIST.forEach(spawn);
  /* ---------- หน้าตา ---------- */
  const st=document.createElement('style');st.textContent=`#s4dB{position:fixed;z-index:30;right:12px;top:${o.btnTop||'calc(env(safe-area-inset-top,0px) + 156px)'};display:flex;flex-direction:column;align-items:center;gap:2px;border:0;background:none;padding:0;cursor:pointer;font:800 9.5px Mali,sans-serif;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.7)}#s4dB i{width:46px;height:46px;border-radius:14px;border:3px solid #fff;font-style:normal;font-size:22px;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#d2b4ff,#8a5ce0);box-shadow:0 4px 0 rgba(0,0,0,.18),0 6px 12px rgba(40,20,0,.25)}
#s4dT{position:fixed;left:0;right:0;bottom:0;z-index:31;background:linear-gradient(180deg,rgba(255,250,240,.96),rgba(255,239,214,.97));border-radius:20px 20px 0 0;box-shadow:0 -6px 22px rgba(70,40,10,.22);padding:8px 8px calc(env(safe-area-inset-bottom,0px) + 10px);transform:translateY(105%);transition:transform .24s cubic-bezier(.3,1.25,.5,1);font-family:Mali,sans-serif}
#s4dT.on{transform:none}#s4dT .hd{display:flex;align-items:center;gap:6px;margin:0 2px 6px;font:800 11.5px Mali,sans-serif;color:#8a5a2e}#s4dT .hd .sp{flex:1}
#s4dT .hd button{border:0;border-radius:999px;padding:6px 11px;font:800 11.5px Mali,sans-serif;color:#fff;background:linear-gradient(180deg,#9fe38a,#4bb04a);box-shadow:0 2px 0 rgba(0,0,0,.15)}#s4dT .hd button.g{background:linear-gradient(180deg,#ffd76a,#f39a1e)}#s4dT .hd button.r{background:linear-gradient(180deg,#ff9fb0,#e0566e)}#s4dT .hd button:disabled{opacity:.4}
#s4dT .row{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;padding:2px 2px 4px}#s4dT .row::-webkit-scrollbar{display:none}
#s4dT .it{flex:0 0 auto;width:62px;border:2px solid #fff;border-radius:14px;background:#fff8ec;box-shadow:0 2px 0 #e7c99a;padding:3px 2px;display:flex;flex-direction:column;align-items:center;gap:2px;font:700 9px Mali,sans-serif;color:#6e4b3a}
#s4dT .it img,#s4dT .it i{width:46px;height:46px;object-fit:contain;font-style:normal;font-size:24px;display:flex;align-items:center;justify-content:center}#s4dT .it span{max-width:58px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.s4dedit #s4dB i{background:linear-gradient(180deg,#9fe38a,#4bb04a)}body.s4dedit #callB,body.s4dedit #photoB,body.s4dedit #tip,body.s4photo #s4dB{visibility:hidden}`;document.head.appendChild(st);
  const btn=document.createElement('button');btn.id='s4dB';btn.type='button';btn.innerHTML='<i>🎨</i>ตกแต่ง';btn.title='ตกแต่ง';document.body.appendChild(btn);
  const tray=document.createElement('div');tray.id='s4dT';tray.innerHTML='<div class="hd"><b>🎨 แตะของเพื่อวาง · ลากเพื่อย้าย</b><span class="sp"></span><button class="g" id="s4dR" disabled>🔄</button><button class="r" id="s4dP" disabled>📦</button><button id="s4dOk">✅ เสร็จ</button></div><div class="row"></div>';document.body.appendChild(tray);
  const row=tray.querySelector('.row');row.innerHTML=CAT.map(n=>'<div class="it" data-n="'+n+'"><img loading="lazy" alt="" src="'+TH+n+'.webp"><span>'+NAMES[n]+'</span></div>').join('');
  /* ---------- โหมดแต่ง ---------- */
  let edit=false,sel=null,drag=null;const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),gpl=new THREE.Plane(new THREE.Vector3(0,1,0),0),gp=new THREE.Vector3();
  const ring=new THREE.Mesh(new THREE.RingGeometry(1.1,1.35,40),new THREE.MeshBasicMaterial({color:0xffd24a,transparent:true,opacity:.9,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.visible=false;sc.add(ring);
  const B=o.bounds||{x0:-20,x1:20,z0:-20,z1:20};const clampXZ=(x,z)=>[Math.max(B.x0,Math.min(B.x1,x)),Math.max(B.z0,Math.min(B.z1,z))];
  const setSel=id=>{sel=id;const g=id&&objs.get(id);ring.visible=!!g;if(g){const b=new THREE.Box3().setFromObject(g),s=b.getSize(new THREE.Vector3());ring.scale.setScalar(Math.max(.8,Math.max(s.x,s.z)/2.3));ring.position.set(g.position.x,.06,g.position.z);}
   tray.querySelector('#s4dR').disabled=!g;tray.querySelector('#s4dP').disabled=!g;};
  const setEdit=on=>{edit=on;document.body.classList.toggle('s4dedit',on);tray.classList.toggle('on',on);if(!on){setSel(null);save();}window.__s4dEdit=on;try{parent.postMessage({s4dedit:on},'*');}catch(e){}if(o.onMode)o.onMode(on);};
  btn.onclick=e=>{e.stopPropagation();setEdit(!edit);};tray.querySelector('#s4dOk').onclick=()=>setEdit(false);
  tray.querySelector('#s4dR').onclick=()=>{const it=LIST.find(q=>q.id===sel),g=objs.get(sel);if(!it||!g)return;it.r=((it.r||0)+Math.PI/4)%(Math.PI*2);g.rotation.y=it.r;save();};
  tray.querySelector('#s4dP').onclick=()=>{const g=objs.get(sel);if(!g)return;sc.remove(g);objs.delete(sel);LIST=LIST.filter(q=>q.id!==sel);setSel(null);save();chg();};
  const groundAt=(cx,cy)=>{ndc.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);ray.setFromCamera(ndc,cam);return ray.ray.intersectPlane(gpl,gp)?gp.clone():null;};
  row.addEventListener('click',async e=>{const el=e.target.closest('.it');if(!el)return;if(LIST.length>=MAX){try{o.tip&&o.tip('วางได้สูงสุด '+MAX+' ชิ้นต่อโซนนะ');}catch(_){}return;}if(row.dataset.busy)return;row.dataset.busy='1';setTimeout(()=>{delete row.dataset.busy;},450);
   const c=groundAt(innerWidth/2,innerHeight*.45)||new THREE.Vector3();const [x,z]=clampXZ(c.x+(Math.random()-.5)*1.5,c.z+(Math.random()-.5)*1.5);const it={id:'d'+(++seq),n:el.dataset.n,x:+x.toFixed(2),z:+z.toFixed(2),r:0};LIST.push(it);const g=await spawn(it);if(g&&edit)setSel(it.id);save();});
  const hitDeco=(cx,cy)=>{ndc.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);ray.setFromCamera(ndc,cam);const hs=ray.intersectObjects([...objs.values()],true);if(!hs.length)return null;let p=hs[0].object;while(p&&!p.userData.s4d)p=p.parent;return p?p.userData.s4d:null;};
  addEventListener('pointerdown',e=>{if(!edit||e.target!==dom)return;const id=hitDeco(e.clientX,e.clientY);if(id){e.stopImmediatePropagation();e.preventDefault();setSel(id);drag={id,pid:e.pointerId};}else if(sel){setSel(null);}},true);
  addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pid)return;e.stopImmediatePropagation();e.preventDefault();const p=groundAt(e.clientX,e.clientY);if(!p)return;const [x,z]=clampXZ(p.x,p.z);const g=objs.get(drag.id),it=LIST.find(q=>q.id===drag.id);if(!g||!it)return;g.position.set(x,0,z);it.x=+x.toFixed(2);it.z=+z.toFixed(2);ring.position.set(x,.06,z);},true);
  const up=e=>{if(!drag||e.pointerId!==drag.pid)return;e.stopImmediatePropagation();drag=null;save();chg();};addEventListener('pointerup',up,true);addEventListener('pointercancel',up,true);
  addEventListener('pagehide',()=>{try{if(H)H.set(SKEY,JSON.stringify(LIST.slice(0,MAX)));}catch(e){}});
  return {get edit(){return edit;},list:()=>LIST,setEdit};}};
})();
