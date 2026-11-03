/* ซีซัน 4: ต้นไม้ใบฟูแบบเดียวกับฟาร์มหลัก (ดึงโค้ดชุดเดียวกันจาก farm3d) ใช้ในทุกหน้า: สวนหมาแมว อัลปาก้า หลังบ้าน เนเบอร์ฮูด */
export function makeTreeKit(THREE,BGU,PROTO){const {mergeGeometries,mergeVertices}=BGU;
function fitModel(src,{h,w}){const o=src.clone(true);const b=new THREE.Box3().setFromObject(o),s=b.getSize(new THREE.Vector3());o.scale.setScalar(h?h/s.y:w/Math.max(s.x,s.z));
  const b2=new THREE.Box3().setFromObject(o),c=b2.getCenter(new THREE.Vector3());o.position.set(-c.x,-b2.min.y,-c.z);const g=new THREE.Group();g.add(o);return g;}
function rnd(seed){let s=(seed*9301+49297)%233280;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
function blob(rad,c1,c2,rng,det=4){let g=new THREE.IcosahedronGeometry(rad,det);g.deleteAttribute('normal');g.deleteAttribute('uv');g=mergeVertices(g);const p=g.attributes.position,c=[],v=new THREE.Vector3(),a=new THREE.Color(c1),b=new THREE.Color(c2),t=new THREE.Color(),ph=rng()*10;
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const n=v.clone().normalize();const k=1+.09*Math.sin(n.x*7+ph)*Math.sin(n.y*6+ph*.7)*Math.sin(n.z*7+ph*1.3)+.05*Math.sin(n.x*17+n.z*13+ph);v.copy(n).multiplyScalar(rad*k);p.setXYZ(i,v.x,v.y,v.z);
    t.copy(a).lerp(b,THREE.MathUtils.clamp(n.y*.5+.5+(rng()-.5)*.12,0,1));c.push(t.r,t.g,t.b);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));g.computeVertexNormals();return g;}
const leafM=new THREE.MeshLambertMaterial({vertexColors:true}),barkM=new THREE.MeshLambertMaterial({color:0x8b5a33});
function makeTree(h=5,seed=1){const rng=rnd(seed),g=new THREE.Group();
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(h*.05,h*.08,h*.5,10),barkM);tr.position.y=h*.25;tr.castShadow=true;g.add(tr);
  const R=h*.28,parts=[];for(const [x,y,z,s] of [[0,.68,0,1],[.42,.6,.1,.72],[-.4,.6,-.05,.75],[.05,.62,.4,.7],[-.05,.6,-.4,.7],[.15,.88,.05,.68],[-.18,.84,.15,.6]]){const b=blob(R*s,0x4f8f22,0xc5e04a,rng,3);b.translate(x*R*1.5,y*h,z*R*1.5);parts.push(b);}
  const m=new THREE.Mesh(mergeGeometries(parts),leafM);m.castShadow=true;m.receiveShadow=true;g.add(m);
  return g;}
const flowerM=[new THREE.MeshLambertMaterial({color:0xffffff}),new THREE.MeshLambertMaterial({color:0xfff2a0})],flowerG=new THREE.SphereGeometry(.05,6,5);
function makeBush(s=1,seed=3){const rng=rnd(seed),g=new THREE.Group();
  const parts=[];for(const [x,y,z,k] of [[0,.32,0,1],[.38,.24,.05,.75],[-.36,.24,.08,.78],[.05,.22,.3,.7],[-.05,.22,-.28,.7]]){const b=blob(.38*k*s,0x4a8a26,0xa9d24a,rng,3);b.translate(x*s,y*s,z*s);parts.push(b);}
  for(let i=0;i<14;i++){const th=rng()*6.28,ph=rng()*1.2;let f=new THREE.IcosahedronGeometry(.055,0);f.deleteAttribute('uv');f=mergeVertices(f);const c=i%2?[1,.95,.63]:[1,1,1],cc=[];for(let j=0;j<f.attributes.position.count;j++)cc.push(...c);f.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));f.translate(Math.cos(th)*Math.cos(ph)*.42*s,(.3+Math.sin(ph)*.36)*s,Math.sin(th)*Math.cos(ph)*.42*s);parts.push(f);}
  const m=new THREE.Mesh(mergeGeometries(parts),leafM);m.castShadow=true;g.add(m);
  return g;}
// ---- forest & hills around the farm (scenery: cannot be touched) ----
const treeTime={value:0};const TMAT={};
function prepTreeGeo(proto){proto.traverse(m=>{if(!m.isMesh||m.geometry.userData.prepped)return;const g=m.geometry;g.computeBoundingBox();const bb=g.boundingBox,H=bb.max.y-bb.min.y;
  const p=g.attributes.position,n=g.attributes.normal,c=[];const cx=(bb.min.x+bb.max.x)/2,cz=(bb.min.z+bb.max.z)/2,cy=bb.min.y+H*.62,rx=(bb.max.x-bb.min.x)/2,rz=(bb.max.z-bb.min.z)/2,ry=H*.4;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const t=(y-bb.min.y)/H;const out=Math.min(1,Math.hypot((x-cx)/rx,(y-cy)/ry,(z-cz)/rz));
    let b=.5+.55*Math.pow(out,1.6)+.18*t+(n?.12*n.getY(i):0);if(t<.32)b=.85+.15*t;b=Math.min(1.25,Math.max(.4,b));c.push(b,b,b);}
  g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));g.userData.prepped={y0:bb.min.y,H};});}
function treeMat(base,hue,sat,val,y0,H){const key=base.uuid+hue+sat+val;if(TMAT[key])return TMAT[key];const m=new THREE.MeshLambertMaterial({map:base.map,vertexColors:true,side:THREE.DoubleSide});
  m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,{uT:treeTime,uHue:{value:hue},uSat:{value:sat},uVal:{value:val},uY0:{value:y0},uH:{value:H}});
    sh.vertexShader='uniform float uT,uY0,uH;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat sw=max(0.,(position.y-uY0)/uH);sw*=sw;transformed.x+=sin(uT*1.4+position.x*3.+position.z*2.)*.018*uH*sw;transformed.z+=cos(uT*1.1+position.x*2.)*.012*uH*sw;');
    sh.fragmentShader='uniform float uHue,uSat,uVal;\nvec3 r2h(vec3 c){vec4 K=vec4(0.,-1./3.,2./3.,-1.);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);float e=1e-10;return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);}\nvec3 h2r(vec3 c){vec4 K=vec4(1.,2./3.,1./3.,3.);vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);}\n'+
      sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n{vec3 hv=r2h(diffuseColor.rgb);bool bark=hv.x>.02&&hv.x<.14&&hv.y>.2&&hv.z<.7;if(!bark){hv.x=fract(hv.x+uHue);hv.y=clamp(hv.y*uSat,0.,1.);hv.z=clamp(hv.z*uVal,0.,1.);diffuseColor.rgb=h2r(hv);}}');};
  m.customProgramCacheKey=()=>'nicetree';TMAT[key]=m;return m;}
const LEAF={sakura:{src:'sakura',c:[0xb84f74,0xec88a8,0xffc9da],dots:0xffffff},green:{src:'oak',c:[0x226f2a,0x4fae34,0xc2e85a]},purple:{src:'jaca',c:[0x4a2f8c,0x7c5cc8,0xc2a9f2],dots:0xf3eaff},maple:{src:'oak',c:[0xa8361a,0xe0662a,0xffb04a]},birch:{src:'oak',c:[0x5f8f1c,0x9cc93a,0xe6f27a],trunk:0x9b6a3c},willow:{src:'oak',c:[0x3d7a22,0x76b23a,0xc6e86a],weep:1},gold:{src:'oak',c:[0x9a6608,0xe0a91c,0xffe266]}};
const TRUNK={};
function trunkOf(name){if(TRUNK[name])return TRUNK[name];const root=PROTO[name];root.updateMatrixWorld(true);const out=[];let mat=null,bb=new THREE.Box3(),leafBox=new THREE.Box3();
  root.traverse(m=>{if(!m.isMesh)return;const img=m.material.map&&m.material.map.image;if(!img)return;mat=new THREE.MeshLambertMaterial({map:m.material.map});
    const cv=document.createElement('canvas');cv.width=img.width;cv.height=img.height;const cx=cv.getContext('2d');cx.drawImage(img,0,0);const px=cx.getImageData(0,0,cv.width,cv.height).data;
    let g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(m.matrixWorld);const p=g.attributes.position,uv=g.attributes.uv,col=new THREE.Color(),hsl={};
    const isBark=i=>{let u=uv.getX(i)%1,v=uv.getY(i)%1;if(u<0)u+=1;if(v<0)v+=1;const X=Math.min(cv.width-1,u*cv.width|0),Y=Math.min(cv.height-1,(1-v)*cv.height|0),o=(Y*cv.width+X)*4;col.setRGB(px[o]/255,px[o+1]/255,px[o+2]/255);col.getHSL(hsl);return hsl.h>.02&&hsl.h<.13&&hsl.s>.15&&hsl.l<.62;};
    const keep=[];for(let t=0;t<p.count;t+=3){const b=isBark(t)&&isBark(t+1)&&isBark(t+2);for(let k=0;k<3;k++){const v=new THREE.Vector3().fromBufferAttribute(p,t+k);if(b)bb.expandByPoint(v);else leafBox.expandByPoint(v);}if(b)keep.push(t);}
    const np=[],nu=[];for(const t of keep)for(let k=0;k<3;k++){np.push(p.getX(t+k),p.getY(t+k),p.getZ(t+k));nu.push(uv.getX(t+k),uv.getY(t+k));}
    const ng=new THREE.BufferGeometry();ng.setAttribute('position',new THREE.Float32BufferAttribute(np,3));ng.setAttribute('uv',new THREE.Float32BufferAttribute(nu,2));ng.computeVertexNormals();out.push(ng);});
  TRUNK[name]={geo:mergeGeometries(out),mat,bb,leafBox};return TRUNK[name];}
const TOON=(()=>{const d=new Uint8Array([105,105,105,255,170,170,170,255,225,225,225,255,255,255,255,255]);const t=new THREE.DataTexture(d,4,1);t.minFilter=t.magFilter=THREE.LinearFilter;t.needsUpdate=true;return t;})();
const LMAT={};
function leafMat(key,y0,H){if(LMAT[key])return LMAT[key];const m=new THREE.MeshToonMaterial({vertexColors:true,gradientMap:TOON});
  m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,{uT:treeTime,uY0:{value:y0},uH:{value:H}});sh.vertexShader='uniform float uT,uY0,uH;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat sw=clamp((position.y-uY0)/uH,0.,1.);transformed.x+=sin(uT*1.3+position.y*2.)*.012*uH*sw;transformed.z+=cos(uT*1.05+position.y*1.7)*.008*uH*sw;');};
  m.customProgramCacheKey=()=>'leafsway';LMAT[key]=m;return m;}
const LEAFQ=(()=>{const sh=new THREE.Shape();sh.moveTo(0,-.12);sh.quadraticCurveTo(.34,.05,.26,.42);sh.quadraticCurveTo(.16,.66,0,.82);sh.quadraticCurveTo(-.16,.66,-.26,.42);sh.quadraticCurveTo(-.34,.05,0,-.12);const g=new THREE.ShapeGeometry(sh,1);g.deleteAttribute('uv');g.translate(0,-.05,0);g.computeVertexNormals();return g;})();
const leafTex=(()=>{const cv=document.createElement('canvas');cv.width=cv.height=128;const x=cv.getContext('2d');x.scale(2,2);x.fillStyle='#fff';x.beginPath();x.moveTo(32,3);x.bezierCurveTo(61,19,57,47,32,61);x.bezierCurveTo(7,47,3,19,32,3);x.fill();
  x.strokeStyle='rgba(0,0,0,.18)';x.lineWidth=2;x.beginPath();x.moveTo(32,8);x.lineTo(32,58);x.stroke();const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;})();
const LCM={};function leafCardMat(key,y0,H){if(LCM[key])return LCM[key];const m=new THREE.MeshToonMaterial({side:THREE.DoubleSide,gradientMap:TOON});
  m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,{uT:treeTime,uY0:{value:y0},uH:{value:H}});sh.vertexShader='uniform float uT,uY0,uH;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvec4 ip=instanceMatrix*vec4(0.,0.,0.,1.);float sw=clamp((ip.y-uY0)/uH,0.,1.);transformed.x+=sin(uT*2.2+ip.x*5.+ip.y*3.)*.05*sw;transformed.y+=cos(uT*1.9+ip.z*4.)*.04*sw;');};
  m.customProgramCacheKey=()=>'leafcard';LCM[key]=m;return m;}
const PALS=[{n:'เขียว',c:[0x226f2a,0x4fae34,0xc2e85a]},{n:'ชมพู',c:[0xb84f74,0xec88a8,0xffc9da]},{n:'ส้ม',c:[0xa8361a,0xe0662a,0xffb04a]},{n:'เหลือง',c:[0x9a6608,0xe0a91c,0xffe266]},{n:'ม่วง',c:[0x4a2f8c,0x7c5cc8,0xc2a9f2]},{n:'ฟ้า',c:[0x1f5f9e,0x4aa3e0,0xa8e2ff]},{n:'แดง',c:[0x8c1f2a,0xd8434e,0xff9a8a]},{n:'มิ้นต์',c:[0x1f7a66,0x45c2a2,0xb8f2dc]}];
function lushTree(kind,seed=1,HH=5.4,pal){const L=pal!=null?Object.assign({},LEAF[kind],{c:PALS[pal].c}):LEAF[kind],T=trunkOf(L.src),rng=rnd(seed+7);
  const lb=T.leafBox,c=T.bb.getCenter(new THREE.Vector3());const y0=T.bb.min.y,Ht=Math.max(lb.max.y,T.bb.max.y)-y0;const RY=Ht*(L.slim?.27:.34),R=RY*(L.slim?.85:1.08);const cy=y0+Ht*.6;
  const parts=[],cA=new THREE.Color(L.c[0]),cB=new THREE.Color(L.c[1]),cC=new THREE.Color(L.c[2]),t=new THREE.Color();
  const PF=[];const puff=(x,y,z,r)=>{PF.push([x,y,z,r]);let g=new THREE.IcosahedronGeometry(r,3);g.deleteAttribute('uv');g.deleteAttribute('normal');g=mergeVertices(g);const p=g.attributes.position,cols=[],v=new THREE.Vector3(),ph=rng()*9;
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const n=v.clone().normalize();const k=1+.07*Math.sin(n.x*9+ph)*Math.sin(n.y*8+ph)*Math.sin(n.z*9+ph*1.3)+.04*Math.sin(n.x*21+n.z*17+ph);v.copy(n).multiplyScalar(r*k).add(new THREE.Vector3(x,y,z));p.setXYZ(i,v.x,v.y,v.z);
      const wy=(v.y-(cy-RY))/(2*RY),out=Math.min(1,Math.hypot((v.x-c.x)/R,(v.y-cy)/RY,(v.z-c.z)/R));const lit=THREE.MathUtils.clamp(wy*.35+Math.pow(out,2)*.25+n.y*.38+(rng()-.5)*.05,0,1);
      if(lit<.5)t.copy(cA).lerp(cB,lit*2);else t.copy(cB).lerp(cC,(lit-.5)*2);cols.push(t.r,t.g,t.b);}
    g.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));g.computeVertexNormals();parts.push(g);};
  puff(c.x,cy,c.z,Math.min(R,RY)*.78);
  const tiers=[[-.4,6,.72,.5],[.15,7,.74,.52],[.7,4,.55,.5],[1.15,2,.3,.45]];for(const [el0,n,dist,rr] of tiers)for(let i=0;i<n;i++){const th=i/n*Math.PI*2+el0*2+rng()*.5,el=el0+(rng()-.5)*.25;puff(c.x+Math.cos(th)*Math.cos(el)*R*dist,cy+Math.sin(el)*RY*.8,c.z+Math.sin(th)*Math.cos(el)*R*dist,RY*(rr+rng()*.12));}
  puff(c.x,cy+RY*.75,c.z,RY*.5);
  const g=new THREE.Group();{const tp=[],th=cy-y0;const tr=new THREE.CylinderGeometry(RY*.2,RY*.32,th,10,4);const tpp=tr.attributes.position;for(let i=0;i<tpp.count;i++){const yy=tpp.getY(i)/th+.5;tpp.setX(i,tpp.getX(i)+Math.sin(yy*3)*RY*.05);}tr.translate(c.x,y0+th/2,c.z);tp.push(tr);
    for(let k=0;k<4;k++){const a=k*Math.PI/2+.4,rt=new THREE.CylinderGeometry(RY*.05,RY*.13,RY*.34,6);rt.rotateZ(Math.PI/3.2);rt.rotateY(a);rt.translate(c.x+Math.cos(a)*RY*.22,y0+RY*.08,c.z-Math.sin(a)*RY*.22);tp.push(rt);}
    for(let k=0;k<3;k++){const a=k*2.1,br=new THREE.CylinderGeometry(RY*.05,RY*.1,RY*.9,6);br.rotateZ(.7);br.rotateY(a);br.translate(c.x+Math.cos(a)*RY*.25,cy-RY*.25,c.z-Math.sin(a)*RY*.25);tp.push(br);}
    const tm=new THREE.Mesh(mergeGeometries(tp.map(q=>{q.deleteAttribute('uv');return q.toNonIndexed();})),new THREE.MeshToonMaterial({color:L.trunk||0x9b6a3c,gradientMap:TOON}));tm.castShadow=true;g.add(tm);}
  const cm=new THREE.Mesh(mergeGeometries(parts),leafMat(kind+T.leafBox.min.y,cy-RY,2*RY));cm.castShadow=true;cm.receiveShadow=true;cm.scale.setScalar(.93);cm.position.set(c.x*.07,cy*.07,c.z*.07);g.add(cm);
  // Heartopia-style: thousands of small leaves covering each puff
  {const NL=2600,im=new THREE.InstancedMesh(LEAFQ,leafCardMat(kind+T.leafBox.min.y,cy-RY,2*RY),NL),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),n=new THREE.Vector3(),pos=new THREE.Vector3(),sc3=new THREE.Vector3(),up=new THREE.Vector3(0,0,1),col=new THREE.Color();
   let i=0;while(i<NL){const P=PF[Math.floor(rng()*PF.length)];n.set(rng()*2-1,rng()*2-1,rng()*2-1);if(n.lengthSq()>1||n.lengthSq()<.01)continue;n.normalize();
     const off=P[3]*(1+rng()*.09);pos.set(P[0]+n.x*off,P[1]+n.y*off,P[2]+n.z*off);
     // skip leaves buried inside other puffs
     if(PF.some(Q=>Q!==P&&Math.hypot(pos.x-Q[0],pos.y-Q[1],pos.z-Q[2])<Q[3]*.92))continue;
     q.setFromUnitVectors(up,n);const roll=new THREE.Quaternion().setFromAxisAngle(n,rng()*6.28);const tilt=new THREE.Quaternion().setFromEuler(e.set((rng()-.5)*.9,(rng()-.5)*.9,0));q.premultiply(roll).multiply(tilt);
     const k=RY*(.14+rng()*.05);m4.compose(pos,q,sc3.set(k,k*1.35,k));im.setMatrixAt(i,m4);
     const wy=(pos.y-(cy-RY))/(2*RY),out=Math.min(1,Math.hypot((pos.x-c.x)/R,(pos.y-cy)/RY,(pos.z-c.z)/R));let crease=9;for(const Q of PF){if(Q===P)continue;crease=Math.min(crease,(Math.hypot(pos.x-Q[0],pos.y-Q[1],pos.z-Q[2])-Q[3])/P[3]);}const ao=THREE.MathUtils.clamp(crease/.45,0,1);const lit=THREE.MathUtils.clamp((wy*.28+out*.12+n.y*.52+(rng()-.5)*.05)*(.45+.55*ao),0,1);
     if(lit<.5)col.copy(cA).lerp(cB,lit*2);else col.copy(cB).lerp(cC,(lit-.5)*2);im.setColorAt(i,col);i++;}
   im.castShadow=true;g.add(im);
   if(L.weep){const NS=70,PER=11,wm=new THREE.InstancedMesh(LEAFQ,leafCardMat('weep'+kind,cy-RY*2.2,RY*3),NS*PER);let j=0;
     for(let s2=0;s2<NS;s2++){const th=rng()*6.28,el=-.15+rng()*.45;const sx=c.x+Math.cos(th)*R*.95*Math.cos(el),sz=c.z+Math.sin(th)*R*.95*Math.cos(el),sy=cy+Math.sin(el)*RY*.9;const len=RY*(1.1+rng()*.7);
       for(let k=0;k<PER;k++){const t2=k/(PER-1);pos.set(sx+Math.cos(th)*t2*RY*.12,sy-t2*len,sz+Math.sin(th)*t2*RY*.12);q.setFromEuler(e.set((rng()-.5)*.6,th+Math.PI/2,Math.PI+(rng()-.5)*.5));const kk=RY*(.08+rng()*.03);m4.compose(pos,q,sc3.set(kk,kk*1.5,kk));wm.setMatrixAt(j,m4);
         const lit=.35+.5*(1-t2)+(rng()-.5)*.2;if(lit<.5)col.copy(cA).lerp(cB,lit*2);else col.copy(cB).lerp(cC,(lit-.5)*2);wm.setColorAt(j,col);j++;}}
     wm.castShadow=true;g.add(wm);}}
  if(false&&L.dots){const dg=[];for(let i=0;i<34;i++){const th=rng()*6.28,el=rng()*1.2-.3;let d=new THREE.SphereGeometry(RY*.05,6,4);d.translate(c.x+Math.cos(th)*Math.cos(el)*R*1.02,cy+Math.sin(el)*RY*1.05,c.z+Math.sin(th)*Math.cos(el)*R*1.02);d.deleteAttribute('uv');dg.push(d);}
    g.add(new THREE.Mesh(mergeGeometries(dg),new THREE.MeshLambertMaterial({color:L.dots})));}
  return fitModel(g,{h:HH});}
function leafCards(pts,cols,key,y0,H,size,rng){const im=new THREE.InstancedMesh(LEAFQ,leafCardMat(key,y0,H),pts.length),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),up=new THREE.Vector3(0,0,1),col=new THREE.Color(),sc3=new THREE.Vector3();
  const [a,b,c]=cols.map(x=>new THREE.Color(x));pts.forEach(([p,n,lit,sx,sy],i)=>{q.setFromUnitVectors(up,n);q.multiply(new THREE.Quaternion().setFromAxisAngle(up,rng()*6.28));const k=size*(.8+rng()*.4);m4.compose(p,q,sc3.set(k*(sx||1),k*(sy||1.35),k));im.setMatrixAt(i,m4);
    if(lit<.5)col.copy(a).lerp(b,lit*2);else col.copy(b).lerp(c,(lit-.5)*2);im.setColorAt(i,col);});im.castShadow=true;return im;}
const barkM2=c=>new THREE.MeshLambertMaterial({color:c});
function tube(a,b,r0,r1,seg=7){const d=new THREE.Vector3().subVectors(b,a),L=d.length();const g=new THREE.CylinderGeometry(r1,r0,L,seg,1);g.translate(0,L/2,0);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(a.x,a.y,a.z);g.deleteAttribute('uv');return g.index?g.toNonIndexed():g;}
function makeTallPine(seed){const rng=rnd(seed+31),g=new THREE.Group(),H=9,parts=[],pts=[];
  g.add(new THREE.Mesh(tube(new THREE.Vector3(0,0,0),new THREE.Vector3(0,H*.4,0),.28,.18,8),barkM2(0x7a4a2a)));
  const cA=new THREE.Color(0x1f5a2c),cB=new THREE.Color(0x3e8a3a),cC=new THREE.Color(0x8cc65a),col=new THREE.Color();
  for(let i=0;i<6;i++){const t=i/6,r=2.3*(1-t*.82),h=2.2*(1-t*.35),y=1.4+i*1.18;let cg=new THREE.ConeGeometry(r,h,16,3);cg.deleteAttribute('uv');cg=cg.toNonIndexed();const p=cg.attributes.position,cs=[];
    for(let j=0;j<p.count;j++){const yy=p.getY(j),x=p.getX(j),z=p.getZ(j),ang=Math.atan2(z,x);if(yy<-h/2+.01){const k=1+.14*Math.cos(ang*8);p.setX(j,x*k);p.setZ(j,z*k);p.setY(j,yy-.12*(1+Math.cos(ang*8)));}
      const lit=(yy/h+.5)*.7+.15;col.copy(cA).lerp(cB,Math.min(1,lit*1.3));if(lit>.75)col.lerp(cC,(lit-.75)*2);cs.push(col.r,col.g,col.b);}
    cg.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));cg.computeVertexNormals();cg.translate(0,y+h/2,0);parts.push(cg);
    for(let k=0;k<300;k++){const a=rng()*6.28,v=rng();const rr=r*(1-v)*.98,py=y+v*h;const n=new THREE.Vector3(Math.cos(a),r/h*.9,Math.sin(a)).normalize();pts.push([new THREE.Vector3(Math.cos(a)*rr,py,Math.sin(a)*rr),n,.25+v*.55+(rng()-.5)*.2]);}}
  const cm=new THREE.Mesh(mergeGeometries(parts),new THREE.MeshLambertMaterial({vertexColors:true}));cm.castShadow=true;g.add(cm);g.add(leafCards(pts,[0x1d5428,0x3f8c3c,0x9ad064],'pine',0,H,.15,rng));return fitModel(g,{h:8.5});}
function makeBare(seed){const rng=rnd(seed+57),parts=[];const br=(a,dir,len,r,dep)=>{const b=a.clone().addScaledVector(dir,len);parts.push(tube(a,b,r,r*.68,6));if(dep===0)return;const n=dep>2?2:3;
    for(let i=0;i<n;i++){const d=dir.clone();d.applyAxisAngle(new THREE.Vector3(0,1,0),rng()*6.28);const t=new THREE.Vector3(1,0,0).applyAxisAngle(new THREE.Vector3(0,1,0),rng()*6.28);d.applyAxisAngle(t,.45+rng()*.35);d.y=Math.max(.15,d.y);d.normalize();br(b,d,len*(.66+rng()*.15),r*.7,dep-1);}};
  br(new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0),1.5,.42,4);
  for(let k=0;k<4;k++){const a=k*1.57+.3;parts.push(tube(new THREE.Vector3(0,.25,0),new THREE.Vector3(Math.cos(a)*.6,0,Math.sin(a)*.6),.16,.05,5));}
  const g=new THREE.Group(),m=new THREE.Mesh(mergeGeometries(parts),new THREE.MeshToonMaterial({color:0x8a6a52,gradientMap:TOON}));m.castShadow=true;g.add(m);return fitModel(g,{h:4.6});}
function makeCactus(seed,pal=0){const P0=pal?PALS[pal].c:[0,0x4c9a46,0x8fd06a];const rng=rnd(seed+13),parts=[],green=new THREE.Color(P0[1]),hi=new THREE.Color(P0[2]),col=new THREE.Color();
  const col_=(h,r,x,y,z,rx=0)=>{let g=new THREE.CylinderGeometry(r,r,h,24,6);g.deleteAttribute('uv');g=g.toNonIndexed();const p=g.attributes.position,cs=[];for(let i=0;i<p.count;i++){const X=p.getX(i),Z=p.getZ(i),a=Math.atan2(Z,X),k=1+.1*Math.cos(a*8);p.setX(i,X*k);p.setZ(i,Z*k);col.copy(green).lerp(hi,.5+.5*Math.cos(a*8)*.6);cs.push(col.r,col.g,col.b);}
    g.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));g.computeVertexNormals();if(rx)g.rotateZ(rx);g.translate(x,y,z);parts.push(g);
    let cap=new THREE.SphereGeometry(r*1.08,24,8,0,6.29,0,Math.PI/2);cap.deleteAttribute('uv');cap=cap.toNonIndexed();const cc=[];for(let i=0;i<cap.attributes.position.count;i++)cc.push(green.r*1.15,green.g*1.1,green.b);cap.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));return cap;};
  const top=col_(2.0,.5,0,1.0,0);top.translate(0,2.2,0);parts.push(top);
  const a1=col_(.9,.3,-.62,1.15,0,Math.PI/2);const a1t=col_(.7,.3,-1.0,1.5,0);a1t.translate(-1.0,1.85,0);parts.push(a1t);
  const a2=col_(.7,.27,.6,1.5,0,Math.PI/2);const a2t=col_(.55,.27,.92,1.8,0);a2t.translate(.92,2.08,0);parts.push(a2t);
  const g=new THREE.Group();const m=new THREE.Mesh(mergeGeometries(parts),new THREE.MeshToonMaterial({vertexColors:true,gradientMap:TOON}));m.castShadow=true;g.add(m);
  const sp=new THREE.InstancedMesh(new THREE.ConeGeometry(.02,.09,4),new THREE.MeshLambertMaterial({color:0xfff6dc}),90),m4=new THREE.Matrix4(),q=new THREE.Quaternion();for(let i=0;i<90;i++){const a=Math.floor(rng()*8)/8*6.28,y=.2+rng()*2;const n=new THREE.Vector3(Math.cos(a),0,Math.sin(a));q.setFromUnitVectors(new THREE.Vector3(0,1,0),n);m4.compose(new THREE.Vector3(n.x*.56,y*.95,n.z*.56),q,new THREE.Vector3(1,1,1));sp.setMatrixAt(i,m4);}g.add(sp);
  const fl=new THREE.Mesh(new THREE.SphereGeometry(.13,10,6),new THREE.MeshLambertMaterial({color:0xff7fb0}));fl.scale.y=.6;fl.position.set(0,2.5,0);fl.scale.set(1.6,1,1.6);g.add(fl);
  return fitModel(g,{h:2.6});}
const frondTex=(()=>{const cv=document.createElement('canvas');cv.width=64;cv.height=256;const x=cv.getContext('2d');x.strokeStyle='#fff';x.lineCap='round';x.lineWidth=5;x.beginPath();x.moveTo(32,0);x.lineTo(32,256);x.stroke();
  for(let y=8;y<250;y+=9){const L=26*Math.sin(Math.PI*y/256)+4;x.lineWidth=4;x.beginPath();x.moveTo(32,y);x.quadraticCurveTo(32-L*.6,y+6,32-L,y+16);x.moveTo(32,y);x.quadraticCurveTo(32+L*.6,y+6,32+L,y+16);x.stroke();}
  const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;})();
function makePalm(seed,pal=0){const rng=rnd(seed+91),g=new THREE.Group(),parts=[];let p=new THREE.Vector3(0,0,0);const lean=new THREE.Vector3(.18,1,0).normalize();
  for(let i=0;i<9;i++){const d=lean.clone();d.x+=i*.02;d.normalize();const q2=p.clone().addScaledVector(d,.5);parts.push(tube(p,q2,.36-i*.012,.33-i*.012,10));const ring=new THREE.TorusGeometry(.34-i*.012,.05,6,14);ring.deleteAttribute('uv');ring.rotateX(Math.PI/2);ring.translate(q2.x,q2.y,q2.z);parts.push(ring.toNonIndexed());p=q2;}
  const tm=new THREE.Mesh(mergeGeometries(parts),new THREE.MeshToonMaterial({color:0xa97b4c,gradientMap:TOON}));tm.castShadow=true;g.add(tm);
  const fm=new THREE.MeshToonMaterial({map:frondTex,alphaTest:.5,side:THREE.DoubleSide,color:pal?PALS[pal].c[1]:0x5cb53e,gradientMap:TOON});
  for(let f=0;f<11;f++){const a=f/11*6.28+rng()*.3,seg=8,pos=[],uv=[],idx=[];for(let i=0;i<=seg;i++){const t=i/seg,dist=t*2.3,drop=t*t*1.3-t*.35;const cx=p.x+Math.cos(a)*dist,cz=p.z+Math.sin(a)*dist,cy=p.y+.1-drop;const w=.8*Math.sin(Math.PI*Math.min(1,t*1.1+.05));
      const sx=-Math.sin(a)*w,sz=Math.cos(a)*w;pos.push(cx-sx,cy+.06,cz-sz,cx+sx,cy+.06,cz+sz);uv.push(0,1-t,1,1-t);if(i<seg){const b=i*2;idx.push(b,b+2,b+1,b+1,b+2,b+3);}}
    const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));fg.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));fg.setIndex(idx);fg.computeVertexNormals();const fr=new THREE.Mesh(fg,fm);fr.castShadow=true;g.add(fr);}
  for(let k=0;k<4;k++){const co=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),new THREE.MeshToonMaterial({color:0x7a5230,gradientMap:TOON}));co.position.set(p.x+Math.cos(k*2.1)*.15,p.y-.12,p.z+Math.sin(k*2.1)*.15);g.add(co);}
  return fitModel(g,{h:5.6});}
function makeChubbyPine(seed,H,pal=0){const P0=pal?PALS[pal].c:[0x1f6a34,0x3f9a45,0xa6d968];const rng=rnd(seed+31),g=new THREE.Group(),parts=[],cA=new THREE.Color(P0[0]),cB=new THREE.Color(P0[1]),cC=new THREE.Color(P0[2]),col=new THREE.Color();
  const tr=tube(new THREE.Vector3(0,0,0),new THREE.Vector3(0,1.1,0),.42,.32,10);const tm=new THREE.Mesh(tr,new THREE.MeshToonMaterial({color:0x9b6a3c,gradientMap:TOON}));tm.castShadow=true;g.add(tm);
  const tiers=4;for(let i=0;i<tiers;i++){const t=i/tiers,R0=1.85*(1-t*.62),h=1.55*(1-t*.2),y=.9+i*1.0;const pts=[];
    for(let k=0;k<=12;k++){const u=k/12;const r=R0*(1-u)*(1+.55*Math.sin(Math.PI*Math.min(1,u*1.6))*.35)+.02;pts.push(new THREE.Vector2(Math.max(.02,r*(u<.12?.75+u*2:1)),u*h-(u<.12?.12*(1-u/.12):0)));}
    let lg=new THREE.LatheGeometry(pts,28);lg.deleteAttribute('uv');lg=lg.toNonIndexed();const p=lg.attributes.position,cs=[];
    for(let j=0;j<p.count;j++){const x=p.getX(j),z=p.getZ(j),yy=p.getY(j),a=Math.atan2(z,x),bump=1+.08*Math.sin(a*9+i);p.setX(j,x*bump);p.setZ(j,z*bump);const lit=THREE.MathUtils.clamp(yy/h*.7+.15+.15*Math.sin(a*9+i),0,1);if(lit<.5)col.copy(cA).lerp(cB,lit*2);else col.copy(cB).lerp(cC,(lit-.5)*2);cs.push(col.r,col.g,col.b);}
    lg.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));lg.computeVertexNormals();lg.translate(0,y,0);parts.push(lg);}
  let top=new THREE.SphereGeometry(.28,12,8);top.deleteAttribute('uv');top=top.toNonIndexed();const tc=[];for(let j=0;j<top.attributes.position.count;j++)tc.push(cC.r,cC.g,cC.b);top.setAttribute('color',new THREE.Float32BufferAttribute(tc,3));top.translate(0,.9+tiers*1.0+.25,0);parts.push(top);
  const m=new THREE.Mesh(mergeGeometries(parts),new THREE.MeshToonMaterial({vertexColors:true,gradientMap:TOON}));m.castShadow=true;m.receiveShadow=true;g.add(m);return fitModel(g,{h:H});}
function niceTree(name,hue,sat,val){prepTreeGeo(PROTO[name]);const g=fitModel(PROTO[name],{h:6.2});const o=g.children[0];o.scale.z*=1.35;o.scale.x*=1.08;
  o.traverse(m=>{if(m.isMesh){const u=m.geometry.userData.prepped;m.material=treeMat(m.material,hue,sat,val,u.y0,u.H);m.castShadow=true;m.receiveShadow=true;}});
  const b=new THREE.Box3().setFromObject(g),c=b.getCenter(new THREE.Vector3());o.position.x-=c.x-g.position.x;o.position.z-=c.z-g.position.z;return g;}
return {lushTree,makeChubbyPine,makeBush,makeTree,makePalm,treeTime,PALS,LEAF};}
