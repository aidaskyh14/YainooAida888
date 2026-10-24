import {ST,NEWS,WINES,TICK,DAY,marketMath,HW_ITEMS,HW_CHEST_COST,hwHaunting,hwPrice,HW_POISON,HW_ANTI} from './market-engine.js?v=ss3-fix19';
const __H=parent.__HOST;if(!__H)throw new Error('กรุณาเข้าเกมจากหน้าล็อกอิน');const __LS={getItem:k=>__H.get(k),setItem:(k,v)=>{__H.set(k,String(v));if(__H.admin){const fresh=JSON.parse(__H.get(k)||'null');if(fresh)Object.assign(S,fresh)}},removeItem:k=>__H.del(k)};

const IMG={"shop-bg":"images/shop-bg.webp","item-coinbag":"images/shop-item-coinbag.webp","stock-veg":"images/shop-stock-veg.webp","stock-fruit":"images/shop-stock-fruit.webp","stock-fish":"images/shop-stock-fish.webp","stock-wine":"images/shop-stock-wine.webp","stock-alpaca":"images/shop-stock-alpaca.webp","stock-bee":"images/shop-stock-bee.webp","wine-rose":"images/house-wine-rose.webp","wine-moon":"images/house-wine-moon.webp","wine-blood":"images/house-wine-blood.webp","wine-eclipse":"images/house-wine-eclipse.webp"};

const SOON=['ผ้าพันคอสายรุ้ง','ตุ๊กตาอัลปาก้า','สเต็กอัลปาก้า','ชุดเนื้อราชวงศ์'];
const $=id=>document.getElementById(id);const nf=n=>Math.round(n).toLocaleString('en-US');
const S={role:'player',off:0,merit:0,lots:[],bag:{rose:0,moon:0,blood:0,eclipse:0},news:[],mail:[],mailSeen:0,modes:[],divGot:{},tab:'1d'};
Object.assign(S,JSON.parse(__LS.getItem('s3market1')));S.role=JSON.parse(__LS.getItem('s3user')).admin?'admin':'player';S.off=0;
function save(){}
let marketBusy=false,stopMarket=null;async function marketCloud(input){if(marketBusy)return;marketBusy=true;try{const out=await __H.cloud('market',input),fresh=JSON.parse(__H.get('s3market1'));Object.assign(S,fresh);Object.assign(S,out.config);if(Array.isArray(out.poison))PZQ=out.poison;clearPrices();return out;}catch(e){ann(e.message,false);}finally{marketBusy=false;}}
const now=()=>Date.now()+S.off;
const {price,newsUpTo,autoNews,modeAt,daySeed,h32,SLOT,MODES,clear:clearPrices}=marketMath(S);
const tnow=()=>Math.floor(now()/TICK);
function chg(i){const t=tnow();return(price(i,t)/price(i,t-96)-1)*100}
function spark(i,n,w,hgt,col){const t=tnow(),step=Math.max(1,Math.floor(n/120));const pts=[];for(let k=t-n;k<=t;k+=step)pts.push(price(i,k));
 const mn=Math.min(...pts),mx=Math.max(...pts);return pts.map((p,j)=>`${(j/(pts.length-1)*w).toFixed(1)},${(hgt-(p-mn)/(mx-mn||1)*hgt).toFixed(1)}`).join(' ')}
let annT;function ann(t,ok=true){const a=$('ann');a.textContent=t;a.classList.toggle('err',!ok);a.classList.add('show');clearTimeout(annT);annT=setTimeout(()=>a.classList.remove('show'),2600)}
function sheet(h){$('sheet').innerHTML=h;$('sheet').classList.add('on');$('shade').classList.add('on')}
function closeSheet(){$('sheet').classList.remove('on');$('shade').classList.remove('on');S.open=null}
$('shade').onclick=closeSheet;
function fit(){const st=$('stage'),ar=941/1672;let w=innerWidth,h=w/ar;if(h>innerHeight){h=innerHeight;w=h*ar}st.style.width=w+'px';st.style.height=h+'px'}
addEventListener('resize',fit);
function fmtT(ms){const m=Math.max(0,Math.ceil(ms/6e4));return Math.floor(m/60)+':'+String(m%60).padStart(2,'0')}
const held=i=>S.lots.filter(l=>l.i===i).reduce((a,l)=>a+l.q,0);
/* ---------- main ---------- */
function render(){fit();document.documentElement.style.setProperty('--bg',`url(${IMG['shop-bg']})`);const st=$('stage');st.style.backgroundImage=`url(${IMG['shop-bg']})`;
 const last=S.news[S.news.length-1];const tk=[...newsUpTo(tnow(),tnow()-96).slice(-3).reverse().map(n=>`📰 ${n.e} ${n.txt}`),'📈 ตลาดหุ้นสวนยัยหนู · ราคาเปลี่ยนทุก 15 นาที · ปันผลสุ่มทุก 2 ทุ่ม'].join('   ✦   ');
 st.innerHTML=`<div class="board"><div class="ticker"><span>${tk}</span></div>${ST.map((s,i)=>{const c=chg(i);return`<div class="srow" data-i="${i}"><img src="${IMG['stock-'+s.k]}" alt=""><b>${s.n}</b><svg viewBox="0 0 100 30" preserveAspectRatio="none"><polyline fill="none" stroke="${c>=0?'#8EF0B5':'#FFA3B5'}" stroke-width="1.6" points="${spark(i,96,100,28)}"/></svg><span class="p">${nf(price(i,tnow()))}</span><span class="c ${c>=0?'up':'dn'}">${c>=0?'▲':'▼'}${Math.abs(c).toFixed(1)}%</span></div>`}).join('')}</div>
 <div class="counter"><button class="cbtn" id="b1"><img src="${IMG['wine-moon']}" alt="">รับซื้อของ</button><button class="cbtn" id="b2"><img src="${IMG['item-coinbag']}" alt="">พอร์ตของฉัน</button></div><div class="counter" style="top:80.5%"><button class="cbtn" id="b3">📰 ข่าวตลาด</button><button class="cbtn" id="b4" style="background:linear-gradient(#6A3F9E,#3B2357);color:#FFE08A;box-shadow:0 1.2cqw 0 #24143a,0 2cqw 4cqw rgba(0,0,0,.35)">🎃 มุมฮาโลวีน</button></div>`;
 st.querySelectorAll('.srow').forEach(r=>r.onclick=()=>stock(+r.dataset.i));
 $('b1').onclick=sellShop;$('b2').onclick=port;$('b3').onclick=newsList;$('b4').onclick=hwOpen;renderTop()}
function renderTop(){const adm=S.role==='admin';const d=new Date(now());
 $('top').innerHTML=`<span class="chip">💛 ${nf(S.merit)}</span><span class="chip">🕘 ${d.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}${S.off?' (+'+Math.round(S.off/36e5)+' ชม.)':''}</span><span class="sp"></span><span class="chip btn" id="mb">📮 ${(()=>{const c=newsUpTo(tnow(),Math.max(S.mailSeen+1,tnow()-96)).length;return c?'<b style="color:#E8677E">'+c+'</b>':''})()}</span><span class="chip btn ${adm?'adm':''}" id="rb">${adm?'👑 แอดมิน':'🙂 ผู้เล่น'}</span>${adm?'<span class="chip btn adm" id="ab">🛠️</span>':''}`;
 $('rb').onclick=()=>ann(adm?'สิทธิ์แอดมินของบัญชีนี้':'บัญชีผู้เล่น');$('mb').onclick=mailbox;if(adm)$('ab').onclick=admin}
/* ---------- stock detail ---------- */
function chartSVG(i,n){const t=tnow(),step=Math.max(1,Math.floor(n/150)),pts=[];for(let k=t-n;k<=t;k+=step)pts.push([k,price(i,k)]);
 const ps=pts.map(p=>p[1]),mn=Math.min(...ps),mx=Math.max(...ps),W=300,H=120;const X=k=>(k-(t-n))/n*W,Y=p=>H-6-(p-mn)/(mx-mn||1)*(H-18);
 const line=pts.map(p=>`${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ');const up=ps[ps.length-1]>=ps[0];const col=up?'#8EF0B5':'#FFA3B5';
 const pins=newsUpTo(t,t-n).filter(nw=>(nw.ef.all||nw.ef[ST[i].k]!=null||nw.pick===i||nw.ef.chaos||nw.top===i||nw.bot===i)).map(nw=>`<text class="pin" data-nt="${nw.t}" x="${X(nw.t)}" y="12" font-size="12" text-anchor="middle">📰</text>`).join('');
 return`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".45"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
 <polygon points="0,${H} ${line} ${W},${H}" fill="url(#g)"/><polyline points="${line}" fill="none" stroke="${col}" stroke-width="2"/>
 <text x="4" y="${H-4}" fill="#cfe" font-size="9">${nf(mn)}</text><text x="4" y="22" fill="#cfe" font-size="9">${nf(mx)}</text>${pins}</svg>`}
let qty=10;
function stock(i){S.open=['stock',i];const s=ST[i],p=price(i,tnow()),h=held(i);const n={'1d':96,'7d':672,'30d':2880}[S.tab];
 const fee=Math.round(p*qty*.02),cost=Math.round(p*qty)+fee,room=100-h;
 sheet(`<h3><img src="${IMG['stock-'+s.k]}" alt="" style="width:1.8rem;vertical-align:middle"> ${s.n}</h3>
 <div class="tabs">${['1d','7d','30d'].map(x=>`<button class="tab ${S.tab===x?'on':''}" data-t="${x}">${{'1d':'1 วัน','7d':'7 วัน','30d':'30 วัน'}[x]}</button>`).join('')}</div>
 <div class="chart">${chartSVG(i,n)}</div>
 <div class="kv"><div>ราคาตอนนี้<b>${nf(p)}</b></div><div>เปลี่ยน 24 ชม.<b class="${chg(i)>=0?'up':'dn'}" style="color:${chg(i)>=0?'var(--up)':'var(--dn)'}">${chg(i)>=0?'+':''}${chg(i).toFixed(1)}%</b></div><div>ถืออยู่<b>${h}/100 หุ้น</b></div><div>ช่วงราคา<b style="font-size:.75rem">${nf(s.lo)}–${nf(s.hi)}</b></div></div>
 <div class="stepper"><button data-q="-10">−10</button><button data-q="-1">−1</button><b>${qty}</b><button data-q="1">+1</button><button data-q="10">+10</button></div>
 <div class="hint">ซื้อ ${qty} หุ้น = ${nf(p*qty)} + ค่าธรรมเนียม 2% (${nf(fee)}) = <b>${nf(cost)}</b> กุศล<br>ซื้อแล้วต้องถือ 24 ชั่วโมงถึงขายได้ · ถือได้ตัวละไม่เกิน 100 หุ้น</div>
 <div class="btns"><button class="big" id="buy" ${qty>room||cost>S.merit?'disabled':''}>ซื้อ ${qty} หุ้น</button><button class="ghost" id="tp">ขาย / ดูพอร์ต</button></div>`);
 $('sheet').querySelectorAll('.tab').forEach(b=>b.onclick=()=>{S.tab=b.dataset.t;stock(i)});
 $('sheet').querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{qty=Math.max(1,Math.min(100,qty+ +b.dataset.q));stock(i)});
 $('sheet').querySelectorAll('.pin').forEach(pn=>pn.onclick=()=>{const nw=newsUpTo(tnow(),tnow()-2880).find(x=>x.t==pn.dataset.nt);if(nw)ann(nw.e+' '+nw.txt)});
 $('buy').onclick=async()=>{if(await marketCloud({type:'buy',stock:i,qty})){ann('ซื้อหุ้นแล้ว ถือให้ครบ 24 ชั่วโมงก่อนขาย');render();stock(i);}};
 $('tp').onclick=port}
/* ---------- portfolio ---------- */
function port(){S.open=['port'];if(!S.lots.length)return sheet(`<h3>💼 พอร์ตของฉัน</h3><div class="hint">ยังไม่มีหุ้น แตะหุ้นบนกระดานเพื่อซื้อได้เลย</div><div class="btns"><button class="ghost" onclick="closeSheet()">ปิด</button></div>`);
 let tot=0,val=0;const rows=S.lots.map((l,ix)=>{const p=price(l.i,tnow()),v=p*l.q,avg=l.cost/l.q,pl=v-l.cost;tot+=l.cost;val+=v;const lock=l.t+DAY-now();
  return`<div class="lot"><img src="${IMG['stock-'+ST[l.i].k]}" alt="" style="width:1.8rem"><div class="m"><b>${ST[l.i].n}</b> ×${l.q}<br><small>ซื้อเฉลี่ย ${nf(avg)} · ตอนนี้ ${nf(p)}</small></div><span class="pl" style="color:${pl>=0?'var(--up)':'var(--dn)'}">${pl>=0?'+':''}${nf(pl)}</span>${lock>0?`<button class="ghost" disabled style="font-size:.66rem">🔒 ${fmtT(lock)}</button>`:`<button class="big red" style="font-size:.72rem;padding:.35rem .7rem" data-sell="${ix}">ขาย</button>`}</div>`}).join('');
 sheet(`<h3>💼 พอร์ตของฉัน</h3><div class="kv"><div>ต้นทุนรวม<b>${nf(tot)}</b></div><div>มูลค่าตอนนี้<b style="color:${val>=tot?'var(--up)':'var(--dn)'}">${nf(val)}</b></div></div>${rows}<div class="hint">🔒 = ยังไม่ครบ 24 ชม. · ขายทั้งก้อน หักค่าธรรมเนียม 2%</div><div class="btns"><button class="ghost" onclick="closeSheet()">ปิด</button></div>`);
 $('sheet').querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>sell(+b.dataset.sell))}
async function sell(ix){const l=S.lots[ix];if(!l)return;const out=await marketCloud({type:'sell',index:ix,boughtAt:l.t});if(out){closeSheet();render();showCraftResult({title:'ผลการขายหุ้น',outputs:[],merit:out.gain,consumed:[{name:ST[l.i].n,image:IMG['stock-'+ST[l.i].k],quantity:l.q}]},port);}}
/* ---------- sell goods ---------- */
function sellShop(){S.open=['sell'];const wi=ST.findIndex(s=>s.k==='wine');const bonus=Math.max(0,price(wi,tnow())/ST[wi].b-1);const b=Math.min(.2,bonus);
 sheet(`<h3>🏪 รับซื้อของ</h3><div class="hint">ราคาปกติตลอด · ถ้าหุ้นไวน์สูงกว่าราคาตั้งต้น ได้โบนัสเพิ่มสูงสุด +20% (หุ้นลงก็ยังได้ราคาปกติ)</div>
 ${WINES.map(([k,n,pr])=>`<div class="item"><img src="${IMG['wine-'+k]}" alt=""><div class="m"><b>${n}</b><small>มี ${S.bag[k]} ขวด · ราคาปกติ ${nf(pr)}${b>0?` <span class="bonus">+${Math.round(b*100)}%</span>`:''}</small></div><button class="big" style="font-size:.72rem;padding:.35rem .7rem" data-w="${k}" ${S.bag[k]?'':'disabled'}>ขาย 1</button></div>`).join('')}

 <div class="btns"><button class="ghost" onclick="closeSheet()">ปิด</button></div>`);
 $('sheet').querySelectorAll('[data-w]').forEach(x=>x.onclick=async()=>{const out=await marketCloud({type:'wine',wine:x.dataset.w});if(out){closeSheet();showCraftResult({title:'ผลการขายไวน์',outputs:[],merit:out.gain,consumed:[{path:'wine.'+x.dataset.w,quantity:1}]},sellShop);renderTop();}})}
/* ---------- news list + mail ---------- */
function newsList(){S.open=['news'];const L=newsUpTo(tnow(),tnow()-672).reverse();sheet(`<h3>📰 ข่าวตลาด</h3><div class="hint">ข่าวจากระบบ ออกทุก 3 ชั่วโมง มีผลกับราคาหุ้นทันที แล้วค่อยๆ จางลง · ย้อนหลัง 7 วัน</div>${L.length?L.map(n=>`<div class="news"><span>${n.e}</span><div class="m">${n.txt}<br><small style="color:var(--soft)">${new Date(n.t*TICK).toLocaleString('th-TH',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</small></div></div>`).join(''):'<div class="hint">ยังไม่มีข่าว</div>'}<div class="btns"><button class="ghost" onclick="closeSheet()">ปิด</button></div>`)}
function mailbox(){S.open=['mail'];S.mailSeen=tnow();renderTop();const L=newsUpTo(tnow(),tnow()-96).reverse();
 sheet(`<h3>📮 ไปรษณีย์ · จากยัยหนู</h3>${L.length?L.map(m=>`<div class="news"><span>${m.e}</span><div class="m"><b>ข่าวตลาดหุ้น</b><br>${m.txt}</div></div>`).join(''):'<div class="hint">ยังไม่มีจดหมาย</div>'}<div class="btns"><button class="ghost" onclick="closeSheet()">ปิด</button></div>`)}
/* ---------- admin ---------- */
function admin(){const sl0=Math.floor(tnow()/SLOT),sent=S.news.some(n=>Math.floor(n.t/SLOT)===sl0),au=autoNews(sl0),left=fmtT((sl0+1)*SLOT*TICK-now());
 sheet(`<h3>🛠️ แอดมิน (ผู้เล่นไม่เห็น)</h3>
 <div class="tabs"><button class="tab on">📰 ส่งข่าว (${NEWS.length} ข่าว)</button></div>
 <div class="hint">ส่งได้ 1 ข่าวต่อ 3 ชั่วโมง · ถ้าไม่ส่ง ระบบสุ่มให้เอง<br>${sent?'✅ รอบนี้ส่งแล้ว · รอบใหม่ใน '+left+' ชม.':au.t<=tnow()?'🎲 รอบนี้ระบบสุ่มไปแล้ว: '+au.e+' '+au.txt+' · รอบใหม่ใน '+left+' ชม.':'⏳ ยังส่งได้ · ถ้าไม่ส่ง ระบบจะสุ่มข่าวออกเองในรอบนี้'}</div>
 ${NEWS.map((n,ix)=>`<div class="news" data-n="${ix}"><span>${n[0]}</span><div class="m">${n[1]}</div><span class="e">${Object.entries(n[2]).map(([k,v])=>({all:'ทุกตัว',rnd:'สุ่ม 1',swap:'สลับ',chaos:'มั่ว'}[k]||ST.find(s=>s.k===k).n.replace('หุ้น',''))+' '+(v>0&&!['swap','chaos'].includes(k)?'+':'')+(['swap','chaos'].includes(k)?'±':'')+v+'%').join(' · ')}</span></div>`).join('')}
 <h3 style="margin-top:.6rem">🎚️ ความแรงของตลาด</h3><div class="hint">มีผลตั้งแต่ตอนกดเป็นต้นไป ประวัติเก่าไม่เปลี่ยน · ตอนนี้: <b>${modeAt(tnow()).n}</b></div>
 <div class="btns">${Object.entries(MODES).map(([k,m])=>`<button class="ghost" data-m="${k}">${m.n}</button>`).join('')}</div>
 <table style="width:100%;font-size:.66rem;border-collapse:collapse;margin-top:.3rem;background:#fff">${'<tr><th>หุ้น</th><th>🐢 สูงสุด</th><th>🙂 สูงสุด</th><th>🔥 สูงสุด</th></tr>'+ST.map(x=>`<tr style="text-align:center"><td>${x.n}</td><td>${nf(x.hi*.8)}</td><td>${nf(x.hi)}</td><td>${nf(x.hi*1.5)}</td></tr>`).join('')}</table>
 <div class="hint">🐢 นิ่ง: แกว่งครึ่งเดียว เพดานต่ำลง · 🔥 เดือด: แกว่งแรงขึ้น 1.6 เท่า เพดานสูงขึ้น 1.5 เท่า สำหรับคนกล้าลงทุน</div>
 <h3 style="margin-top:.6rem">⏩ ทดลองเวลา</h3><div class="btns"><button class="ghost" id="f1">+1 ชม.</button><button class="ghost" id="f24">+24 ชม.</button><button class="big gold" id="dv">💰 จำลองปันผล 2 ทุ่ม</button></div>`);
 $('sheet').querySelectorAll('[data-n]').forEach(x=>x.onclick=async()=>{if(await marketCloud({type:'news',index:+x.dataset.n})){closeSheet();ann('ข่าวตลาดเผยแพร่ให้ทุกบัญชีแล้ว');render();}});
 $('sheet').querySelectorAll('[data-m]').forEach(x=>x.onclick=async()=>{if(await marketCloud({type:'mode',mode:x.dataset.m})){closeSheet();render();}});
 $('f1').hidden=$('f24').hidden=true;$('dv').textContent='ตรวจปันผล 20:00 เวลาไทย';$('dv').onclick=async()=>{const out=await marketCloud({type:'dividend'});if(out){ann(out.dividend?'รับปันผล '+nf(out.dividend)+' กุศลแล้ว':'ปันผลตรวจตามเวลาไทยวันละหนึ่งครั้ง');render();}};
}

/* ---------- fix14 มุมฮาโลวีน ---------- */
const HW_IMG=k=>'images/halloween-hw-'+k+'.webp',HW_RAR={candy:['ธรรมดา','#A3A3B5','#FFE3F0'],bat:['ธรรมดา','#A3A3B5','#EDE3FF'],candle:['ธรรมดา','#A3A3B5','#FFF3D6'],web:['ไม่ค่อยเจอ','#5BB6D4','#EEF0F4'],hat:['หายาก','#8E6BE8','#EFE3FF'],broom:['หายาก','#8E6BE8','#FFF0D9'],pumpkin:['หายากมาก','#E0582A','#FFE6CF'],cauldron:['ตำนาน','#E8A21A','#E8FAD0']};
const HW_PRIZE_IMG={'boost-bait':'boost-bait.webp','boost-lens':'boost-lens.webp','boost-gear':'boost-gear.webp','wine-rose':'house-wine-rose.webp','wine-moon':'house-wine-moon.webp','wine-blood':'house-wine-blood.webp','wine-eclipse':'house-wine-eclipse.webp','box-plant':'boxes-box-clover.webp','box-fruit':'boxes-box-berry.webp',musicbox:'animals-item-musicbox.webp',hat:'honey-sailorhat.webp',cake:'item-cake.webp',wings:'item-angelwings.webp',coconut:'item-coconut.webp',fertfruitP:'fruit-fert-fruit-premium.webp'};
const HW_PRIZE_NAME={'boost-bait':'เหยื่อวิเศษ','boost-lens':'แว่นขยายนักวิจัย','boost-gear':'เฟืองเร่งเครื่อง','box-plant':'กล่องสุ่มพืช','box-fruit':'กล่องสุ่มผลไม้',musicbox:'กล่องดนตรี',hat:'หมวกกะลาสี',cake:'เค้ก',wings:'ปีกนางฟ้า',coconut:'มะพร้าว',fertfruitP:'ปุ๋ยผลไม้พรีเมียม'};
const HW_ODDS=[['💛 กุศล 3,000–30,000',15],['⚡ ไอเทมบูสต์ 1–3 ชิ้น',3],['🍷 ไวน์ 2–10 ขวด (สุ่ม 1 ชนิด)',8],['🍲 อาหารสวน 2–5 ชิ้น (สุ่ม 1 เมนู)',8],['📦 กล่องสุ่มพืช/ผลไม้ 10 กล่อง',8],['🎵 กล่องดนตรี 50',7],['🎩 หมวกกะลาสี 50',7],['🍰 เค้ก 100',7],['🪽 ปีกนางฟ้า 100',7],['🥥 มะพร้าว 100',6],['🧪 ปุ๋ยผลไม้พรีเมียม 100',4],['☠️ ยาพิษแม่มด (ต้องสาดใส่เพื่อนทันที)',20]];
/* fix15f ยาพิษแม่มด: ได้แล้วต้องสาดใส่เพื่อนทันที (1 นาที ไม่เลือก = สุ่ม) · เพื่อนไม่รู้ว่าใครสาด · กระดานรายวันจาก world/poison */
const POISON=HW_POISON.map((x,i)=>({...x,img:'images/hw-poison-'+(i+1)+'.webp',...[{glow:'#A6E22E',dark:'#2E5A00',tint:'#ECFFD6'},{glow:'#FFA33A',dark:'#7A3A00',tint:'#FFEBD6'},{glow:'#B66CFF',dark:'#3E1270',tint:'#F1E3FF'},{glow:'#FF3A55',dark:'#5A0010',tint:'#FFE0E6'}][i]}));
const ME_UID=__H.uid;let PZQ=[],PB=null,pbAll=false,hwOdds=false,friends=null;
const pvEsc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pvDay=()=>new Date(now()+7*3600000).toISOString().slice(0,10);

/* fix16 น้ำมนต์แก้พิษ: คู่กับยาพิษ 1:1 · คราฟสำเร็จ 100% (เหรียญ + ของฮาโลวีน + สากกะเบือ) */
const ANTI=HW_ANTI.map((a,i)=>({...a,img:'images/anti-'+(i+1)+'.webp',glow:['#7FE0B8','#7CC8FF','#9FD8FF','#F2B6FF'][i],tint:['#E6FBF3','#E4F3FF','#EAF6FF','#FBEBFF'][i]}));
const anHave=i=>{const n=Number(hwGame().bag?.antidote?.['a'+i]);return Number.isFinite(n)&&n>0?Math.floor(n):0};
const anPestle=()=>{const n=Number(hwGame().bag?.item?.pestle);return Number.isFinite(n)&&n>0?Math.floor(n):0};
const anCoins=()=>Number(__H.coins)||0;
const anCan=a=>anCoins()>=a.coin&&anPestle()>=a.pestle&&Object.entries(a.items).every(([k,q])=>hwHave(k)>=q);
function antiCraft(){return `<section class="card"><div class="ch"><h2>🧪 คราฟท์น้ำมนต์แก้พิษ</h2><span class="pill p-grape">🛡️ ล้างพิษคู่กันเท่านั้น</span></div>
 <div class="note">💡 โดนขวดไหน ต้องใช้น้ำมนต์คู่ของขวดนั้น · โดนแล้วกดใช้ได้ทันที กุศลไม่ถูกหัก</div>
 <div class="anbal"><span><img src="images/gacha-coin.webp" alt="">เหรียญฮาโลวีน <b>${nf(anCoins())}</b></span><span><img src="images/animals-item-pestle.webp" alt="">สากกะเบือ <b>${nf(anPestle())}</b></span></div>
 ${ANTI.map((a,i)=>{const P=POISON[i],ok=anCan(a);return `<div class="an" style="--g:${a.glow};--t:${a.tint}">
  <div class="anpic"><img src="${a.img}" alt="${a.n}"><span class="anhave">×${anHave(i)}</span></div>
  <div class="anbody"><b>${a.n}</b><div class="pair"><img src="${P.img}" alt="">คู่กับ ${P.n}</div><div class="pair"><i>🛡️ กันได้ ${nf(P.d)} กุศล</i></div>
   <div class="anreq"><span class="${anCoins()>=a.coin?'ok':'no'}"><img src="images/gacha-coin.webp" alt="เหรียญ">${a.coin}</span>${Object.entries(a.items).map(([k,q])=>`<span class="${hwHave(k)>=q?'ok':'no'}"><img src="${HW_IMG(k)}" alt="">${q}</span>`).join('')}<span class="${anPestle()>=a.pestle?'ok':'no'}"><img src="images/animals-item-pestle.webp" alt="สาก">${a.pestle}</span></div></div>
  <button class="anbtn" data-anc="${i}" ${ok&&!hwBusy?'':'disabled'}>✨ คราฟท์</button></div>`}).join('')}</section>`;}
async function anCraft(i){const a=ANTI[i];if(hwBusy||!anCan(a))return ann('วัตถุดิบยังไม่พอ',false);hwBusy=true;
 try{const out=await marketCloud({type:'anti-craft',k:i,qty:1});if(out?.crafted){const fx=document.createElement('div');fx.className='anfx';fx.style.setProperty('--g',a.glow);fx.innerHTML=`<div class="anfx-in"><img src="${a.img}" alt=""><b>✨ คราฟท์สำเร็จ!</b><span>${a.n} ×1 · มีทั้งหมด ${nf(out.crafted.have)} ขวด</span></div>`;document.body.append(fx);fx.onclick=()=>fx.remove();setTimeout(()=>fx.remove(),2200);}}
 finally{hwBusy=false;hwRender();}}
function poisonBoard(){const rows=PB&&PB.day===pvDay()?Object.entries(PB.rows||{}).map(([u,r])=>({u,n:r.n||'ผู้เล่น',c:r.c||[0,0,0,0]})).map(r=>({...r,cnt:r.c.reduce((a,b)=>a+(b||0),0),sv:Array.isArray(PB.rows[r.u]?.sv)?PB.rows[r.u].sv:[0,0,0,0]})).map(r=>({...r,saved:r.sv.reduce((a,b)=>a+(b||0),0),lost:r.c.reduce((a,b,i)=>a+Math.max(0,(b||0)-(r.sv[i]||0))*POISON[i].d,0)})).filter(r=>r.cnt).sort((a,b)=>b.cnt-a.cnt||b.lost-a.lost||a.n.localeCompare(b.n,'th')):[];
 const show=pbAll?rows:rows.slice(0,5),mine=rows.findIndex(r=>r.u===ME_UID);
 const row=(r,i)=>`<div class="pr${i===0?' t1':''}${r.u===ME_UID?' me':''}"><span class="rk">${['🥇','🥈','🥉'][i]||i+1}</span><div class="nm"><b>${pvEsc(r.n)}${r.u===ME_UID?' (คุณ)':''}</b><div class="bt">${r.c.map((c,k)=>c?`<span><img src="${POISON[k].img}" alt="${POISON[k].n}">×${c}</span>`:'').join('')}</div></div><div class="tt"><b>☠️ ${r.cnt}${r.saved?` <em class="sv">🛡️${r.saved}</em>`:''}</b><small>−${nf(r.lost)}</small></div></div>`;
 return `<div class="ch"><h2>☠️ วันนี้ใครโดนยาพิษ</h2><span class="pill p-pump">🕛 รีเซ็ตเที่ยงคืน</span></div><div class="pb">${rows.length?show.map(row).join('')+(!pbAll&&mine>=5?row(rows[mine],mine):'')+(rows.length>5?`<button class="pmore" id="pbMore">${pbAll?'ย่อ ▲':'ดูทั้งหมด '+rows.length+' คน ▼'}</button>`:''):'<div class="pempty">วันนี้ยังไม่มีใครโดน 😇</div>'}</div>`;}
function boardRefresh(){const el=$('pboard');if(!el)return;const h=poisonBoard();if(el.dataset.h===h)return;el.dataset.h=h;el.innerHTML=h;if($('pbMore'))$('pbMore').onclick=()=>{pbAll=!pbAll;boardRefresh();};}
const hwQty={};let hwBusy=false;
const hwGame=()=>{try{return JSON.parse(__H.get('s3all-v1')||'{}')}catch(e){return {}}};
const hwHave=k=>{const n=Number(hwGame().bag?.halloween?.[k]);return Number.isFinite(n)&&n>0?Math.floor(n):0};
const hwCatName=key=>{try{return __H.catalogName?.(key)?.n}catch(e){return null}};
function hwOpen(){$('hw').classList.add('on');hwRender();if(PZQ.length&&!hwBusy)poisonResume();}
function hwClose(){$('hw').classList.remove('on');render();}
function hwRender(){
 const haunt=hwHaunting(now()),merit=hwGame().merit??S.merit,can=Math.min(...HW_ITEMS.map(([k])=>Math.floor(hwHave(k)/HW_CHEST_COST)));
 $('hw').innerHTML=`<div class="bats">${[0,1,2].map(i=>`<span class="bat" style="top:${8+i*22}%;animation-duration:${14+i*5}s;animation-delay:${-i*4}s">🦇</span>`).join('')}</div><div class="wrap">
 <div class="hbar"><button class="back" id="hwBack">‹ กลับตลาด</button><span class="mchip">💛 ${nf(merit)}</span></div>
 <div class="banner" role="img" aria-label="น้องน้ำผึ้งในชุดแม่มดกำลังคนหม้อยา"><div class="tt"><h1><span>🎃 มุม</span>ฮาโลวีน</h1><p><i>🏪 ขายของผี</i><i>🧙‍♀️ หีบแม่มด</i></p></div><span class="spark" style="left:8%;top:14%">✦</span><span class="spark" style="left:34%;top:10%;animation-delay:.8s">✦</span><span class="spark" style="left:22%;top:84%;animation-delay:1.5s">✦</span></div>
 <div class="haunt ${haunt?'on':''}"><span class="g">👻</span><div><b>${haunt?'👻 ช่วงหลอนมาแล้ว!':'ช่วงหลอน 18:00–22:00'}</b><span>${haunt?'ราคาขายทุกชิ้น +20% ถึง 22:00':'ราคาขาย +20% ทุกวัน'}</span></div></div>
 <section class="card"><div class="ch"><h2>🧙‍♀️ หีบแม่มด</h2><span class="pill p-grape">${can?'แลกได้ '+nf(can)+' ใบ':'ของยังไม่ครบ'}</span></div>
  <div class="chest"><img src="images/hw-chest.webp" alt="หีบแม่มด"><div><div style="font-size:.72rem;font-weight:700;margin-bottom:.3rem">ใช้ของครบ 8 ชนิด ชนิดละ ${HW_CHEST_COST}</div><div class="req">${HW_ITEMS.map(([k,n])=>`<span class="rq ${hwHave(k)>=HW_CHEST_COST?'ok':'no'}" title="${n}"><img src="${HW_IMG(k)}" alt="">${Math.min(hwHave(k),99)}/${HW_CHEST_COST}</span>`).join('')}</div></div></div>
  <button class="bigp" id="hwOpenBtn" ${can?'':'disabled'}>✨ แลกหีบแม่มด</button>
  <details class="odds" id="hwOdds"${hwOdds?' open':''}><summary>🎲 ดูโอกาสได้ของ</summary><table>${HW_ODDS.map(([a,b])=>`<tr><td>${a}</td><td>${b}%</td></tr>`).join('')}</table></details></section>
 ${antiCraft()}
 <section class="card" id="pboard"></section>
 <section class="card"><div class="ch"><h2>🏪 ขายของฮาโลวีน</h2><span class="pill ${haunt?'p-grape':'p-pump'}">${haunt?'👻 +20%':'ราคาปกติ'}</span></div>
  <div class="note">💡 ของฮาโลวีนใช้ลงขันสร้างเนเบอร์ฮูด และแลกหีบแม่มดได้ด้วยนะ</div>
  ${HW_ITEMS.map(([k,n,p])=>{const have=hwHave(k),q=Math.max(1,Math.min(have||1,hwQty[k]||1)),r=HW_RAR[k];return `<div class="it"><span class="ic" style="--tint:${r[2]}"><img src="${HW_IMG(k)}" alt=""></span><div style="min-width:0"><b>${n}<span class="rar" style="--r:${r[1]}">${r[0]}</span></b><small>มี ${nf(have)} · <span class="price">${haunt?`<s>${nf(p)}</s>`:''}${nf(hwPrice(k,now()))}</span>/ชิ้น</small></div><div class="act"><div class="step"><button data-hdec="${k}" aria-label="ลด">−</button><input data-hq="${k}" type="number" min="1" value="${q}" inputmode="numeric" aria-label="จำนวน ${n}"><button data-hinc="${k}" aria-label="เพิ่ม">＋</button></div><button class="sell" data-hsell="${k}" ${have?'':'disabled'}>ขาย</button></div></div>`}).join('')}
 </section></div>`;
 $('hwBack').onclick=hwClose;$('hwOpenBtn').onclick=hwChest;document.querySelectorAll('[data-anc]').forEach(b=>b.onclick=()=>anCraft(+b.dataset.anc));$('hwOdds').ontoggle=e=>{hwOdds=e.target.open;};boardRefresh();
}
async function hwSell(k){if(hwBusy)return;const have=hwHave(k),q=Math.max(1,Math.min(have,hwQty[k]||1));if(!have)return;hwBusy=true;
 try{const out=await marketCloud({type:'hw-sell',item:k,qty:q});if(out?.sold){hwQty[k]=1;ann(`🎃 ขาย ${HW_ITEMS.find(x=>x[0]===k)[1]} ×${nf(q)} · +${nf(out.sold.total)} กุศล 💛`);}}finally{hwBusy=false;hwRender();}}
function hwPrizeView(p){if(p.kind==='merit')return {img:null,e:'💛',amt:'+'+nf(p.merit)+' กุศล',name:'กุศล'};
 const name=p.name||HW_PRIZE_NAME[p.key]||hwCatName(p.key)||'ของรางวัล',im=HW_PRIZE_IMG[p.key]||(p.key.startsWith('gfood-')?p.key+'.webp':null);return {img:im?'images/'+im:null,e:'🎁',amt:'×'+nf(p.q),name};}
async function hwChest(){if(hwBusy)return;if(PZQ.length)return poisonResume();if(HW_ITEMS.some(([k])=>hwHave(k)<HW_CHEST_COST))return ann('ของยังไม่ครบ 8 ชนิด ชนิดละ '+HW_CHEST_COST,false);hwBusy=true;
 const st=$('hwst');st.innerHTML=`<div class="rays"></div><h3 id="hwsh">🧙‍♀️ กำลังเปิดหีบแม่มด…</h3><div class="cimg" id="hwcimg"><img id="hwcimgI" src="images/hw-chest.webp" alt=""></div><div class="prize" id="hwprize"></div><div class="row" id="hwsrow" hidden><button class="btn gray" id="hwsClose">ปิด</button><button class="btn" id="hwsAgain">✨ เปิดอีก</button></div>`;
 st.classList.add('on');const c=$('hwcimg');c.classList.add('shake');
 let out=null;try{[out]=await Promise.all([marketCloud({type:'hw-chest',count:1}),new Promise(r=>setTimeout(r,900))]);}finally{hwBusy=false;}
 if(!out?.prizes?.length){st.classList.remove('on');hwRender();return;}
 if(out.prizes[0].kind==='poison')return poisonGot(out.prizes[0].p);
 const v=hwPrizeView(out.prizes[0]);$('hwcimgI').src='images/hw-chest-open.webp';c.className='cimg boom';$('hwsh').textContent='✨ ได้ของจากหีบแม่มด!';
 $('hwprize').innerHTML=(v.img?`<img class="e" src="${v.img}" alt="">`:`<span class="e">${v.e}</span>`)+`<b>${v.amt}</b><small>${v.name}</small>`;$('hwprize').className='prize on';$('hwsrow').hidden=false;
 for(let i=0;i<26;i++){const f=document.createElement('span');f.className='cf';f.textContent=['✨','🍬','⭐','🦇','💜'][i%5];f.style.left=Math.random()*100+'%';f.style.setProperty('--dx',(Math.random()*80-40)+'px');f.style.animationDelay=Math.random()*.5+'s';st.append(f);setTimeout(()=>f.remove(),3200)}
 $('hwsAgain').disabled=HW_ITEMS.some(([k])=>hwHave(k)<HW_CHEST_COST);$('hwsAgain').onclick=hwChest;$('hwsClose').onclick=()=>{st.classList.remove('on');hwRender();};
 hwRender();
}
$('hw').addEventListener('click',e=>{const d=e.target.closest('[data-hdec]'),i=e.target.closest('[data-hinc]'),s=e.target.closest('[data-hsell]');
 if(d||i){const k=(d||i).dataset[d?'hdec':'hinc'],have=hwHave(k);hwQty[k]=Math.max(1,Math.min(have||1,(hwQty[k]||1)+(d?-1:1)));const inp=$('hw').querySelector(`[data-hq="${k}"]`);if(inp)inp.value=hwQty[k];}
 if(s)hwSell(s.dataset.hsell);});
$('hw').addEventListener('input',e=>{const k=e.target.dataset.hq;if(k){const have=hwHave(k);hwQty[k]=Math.max(1,Math.min(have||1,Math.floor(+e.target.value||1)));}});
setInterval(()=>{if($('hw').classList.contains('on'))return;if(!S.open&&!$('sheet').classList.contains('on'))render();else renderTop()},15000);
render();marketCloud({type:'status'}).then(()=>render());stopMarket=__H.watchWorld('market',data=>{if(data){Object.assign(S,data);clearPrices();render();}});addEventListener('pagehide',()=>stopMarket?.());setTimeout(()=>ann('แตะหุ้นบนกระดานเพื่อดูกราฟและซื้อ · ราคาเปลี่ยนทุก 15 นาที'),500);

// UI state changes are batched once after each click; unchanged snapshots do not write.
document.addEventListener('click',()=>setTimeout(save,0));

/* ---------- fix15f ยาพิษ: ได้ → เลือกเพื่อน (1 นาที) → สาด ---------- */
const pvSleep=ms=>new Promise(r=>setTimeout(r,ms));
try{if(sessionStorage.getItem('ss3OpenHw')){sessionStorage.removeItem('ss3OpenHw');setTimeout(hwOpen,300);}}catch(e){}
const stopPoisonBoard=__H.watchWorld('poison',d=>{PB=d;boardRefresh();});addEventListener('pagehide',()=>stopPoisonBoard?.());
async function loadFriends(){if(friends)return friends;try{friends=(await __H.roster()).filter(p=>!p.admin&&p.uid!==ME_UID).map(p=>[p.uid,String(p.name||'ผู้เล่น')]).sort((a,b)=>a[1].localeCompare(b[1],'th'));}catch(e){friends=[];}return friends;}
async function poisonGot(k){const P=POISON[k],st=$('hwst');hwBusy=true;st.style.setProperty('--glow',P.glow);st.style.setProperty('--dark',P.dark);
 $('hwcimgI').src='images/hw-chest-open.webp';$('hwcimg').className='cimg boom';$('hwsh').textContent='😱 มีอะไรบางอย่างพุ่งออกมา…';loadFriends();await pvSleep(700);
 st.innerHTML=`<div class="rays" style="background:repeating-conic-gradient(${P.glow}33 0 9deg,transparent 9deg 18deg)"></div><img class="pot in" src="${P.img}" alt="${P.n}"><div class="pname">${P.n}!</div><div class="psub">${P.size}</div><div class="pdmg">☠️ ลดกุศล −${nf(P.d)}</div><div class="must">⚠️ ต้องสาดใส่เพื่อนทันที!</div>`;
 pvSplash(innerWidth/2,innerHeight*.35,P.glow,26);await pvSleep(1700);poisonPick(k);}
function poisonResume(){const it=PZQ[0];if(!it)return;const st=$('hwst');hwBusy=true;st.classList.add('on');st.style.setProperty('--glow',POISON[it.p].glow);st.style.setProperty('--dark',POISON[it.p].dark);loadFriends().then(()=>poisonPick(it.p));}
async function poisonPick(k){const P=POISON[k],st=$('hwst');let sel=null,q='';const list0=await loadFriends();
 const until=PZQ[0]?.until||now()+60000;let left=Math.ceil((until-now())/1000);
 const list=()=>list0.filter(([,n])=>n.includes(q));
 st.innerHTML=`<div class="rays" style="background:repeating-conic-gradient(${P.glow}22 0 9deg,transparent 9deg 18deg)"></div><img class="pot bob" src="${P.img}" alt="" style="width:min(30vw,7rem)"><div class="pick"><div class="ph"><img src="${P.img}" alt=""><b>สาด${P.n}ใส่ใครดี?</b><span class="cd" id="pcd">⏱️ ${Math.floor(Math.max(0,left)/60)}:${String(Math.max(0,left)%60).padStart(2,'0')}</span></div><input id="pq" placeholder="🔍 ค้นหาชื่อเพื่อน" aria-label="ค้นหาชื่อเพื่อน"><div class="fl" id="pfl"></div><div class="ph2">⏳ ไม่เลือกในเวลา ระบบสุ่มเพื่อนให้ · 🤫 เพื่อนไม่รู้ว่าใครสาด</div><button class="go" id="pgo" disabled>☠️ เลือกเพื่อนก่อน</button></div>`;
 const draw=()=>{const fl=$('pfl'),top=fl.scrollTop;fl.innerHTML=list().map(([u,n])=>`<button class="${sel===u?'on':''}" data-pf="${pvEsc(u)}"><i>${pvEsc([...n][0]||'🙂')}</i><span>${pvEsc(n)}</span></button>`).join('')||'<div class="ph2" style="grid-column:1/-1">ไม่พบชื่อนี้</div>';fl.scrollTop=top;
  fl.querySelectorAll('[data-pf]').forEach(b=>b.onclick=()=>{sel=b.dataset.pf;draw();$('pgo').disabled=false;$('pgo').textContent='☠️ สาดใส่ '+(list0.find(f=>f[0]===sel)?.[1]||'');});};
 draw();$('pq').oninput=e=>{q=e.target.value.trim();draw();};
 const t=setInterval(()=>{left--;const c=$('pcd');if(c)c.textContent='⏱️ '+Math.floor(Math.max(0,left)/60)+':'+String(Math.max(0,left)%60).padStart(2,'0');if(left<=0){clearInterval(t);poisonThrow(k,null);}},1000);
 if(left<=0){clearInterval(t);return poisonThrow(k,null);}
 $('pgo').onclick=()=>{if(!sel)return;clearInterval(t);poisonThrow(k,sel);};}
function pvSplash(x,y,col,n){const st=$('hwst');for(let i=0;i<n;i++){const d=document.createElement('span');d.className='sp';const a=Math.random()*6.28,r=40+Math.random()*90;d.style.cssText=`left:${x}px;top:${y}px;background:${i%3?col:'#fff'};--x:${Math.cos(a)*r}px;--y:${Math.sin(a)*r-20}px`;st.append(d);setTimeout(()=>d.remove(),950);}}
async function poisonThrow(k,uid){const P=POISON[k],st=$('hwst'),go=$('pgo');if(go){go.disabled=true;go.textContent=uid?'☠️ กำลังสาด…':'🎲 หมดเวลา ระบบสุ่มเพื่อนให้…';}
 let out=null;for(let i=0;i<10&&!out;i++){out=await marketCloud({type:'poison-throw',target:uid});if(!out){if(i>=1)uid=null;await pvSleep(500);}}// เป้าใช้ไม่ได้ (เช่นถูกระงับ) → ระบบสุ่มให้
 if(!out?.thrown){hwBusy=false;if(!PZQ.length){st.classList.remove('on');hwRender();}else if(go){go.disabled=false;go.textContent='☠️ ลองอีกครั้ง';go.onclick=()=>poisonThrow(k,uid);}return;}
 if(out.thrown.none){hwBusy=false;ann('ยังไม่มีเพื่อนให้สาด ขวดนี้สลายไปแล้ว',false);if(PZQ.length)return poisonResume();st.classList.remove('on');hwRender();return;}
 const who=out.thrown.name,tid=out.thrown.to;let tgt=$('pfl')?.querySelector(`[data-pf="${CSS.escape(tid)}"]`);
 if(!tgt&&$('pfl')){$('pfl').insertAdjacentHTML('afterbegin',`<button class="on" data-pf="${pvEsc(tid)}"><i>${pvEsc([...who][0]||'🙂')}</i><span>${pvEsc(who)}</span></button>`);tgt=$('pfl').firstElementChild;}
 if(tgt){tgt.scrollIntoView({block:'nearest'});const r=tgt.getBoundingClientRect(),tx=r.left+r.width/2,ty=r.top+r.height*.4,sx=innerWidth/2,sy=innerHeight*.12;
  const f=document.createElement('img');f.className='fly';f.src=P.img;st.append(f);const t0=performance.now();
  await new Promise(res=>{(function run(n){const q=Math.min(1,(n-t0)/700),x=sx+(tx-sx)*q,y=sy+(ty-sy)*q-Math.sin(Math.PI*q)*120;f.style.left=x-36+'px';f.style.top=y-48+'px';f.style.transform=`rotate(${q*540}deg) scale(${1-q*.4})`;if(q<1)requestAnimationFrame(run);else res();})(t0);});
  f.remove();tgt.classList.add('hit','on');tgt.style.background=P.tint;pvSplash(tx,ty,P.glow,30);
  for(let i=0;i<3;i++){const m=document.createElement('span');m.className='smk';m.style.cssText=`left:${tx+(i-1)*14}px;top:${ty}px;background:${P.glow};animation-delay:${i*.12}s`;st.append(m);setTimeout(()=>m.remove(),1900);}
  const ng=document.createElement('span');ng.className='neg';ng.style.left=tx+'px';ng.style.top=ty-20+'px';ng.textContent='−'+nf(P.d);st.append(ng);setTimeout(()=>ng.remove(),1700);}
 await pvSleep(1100);$('pgo')?.remove();$('hwst').querySelector('.pick')?.insertAdjacentHTML('afterend',`<div class="done">☠️ สาดใส่ ${pvEsc(who)} แล้ว!</div><div class="dnote">🤫 ${pvEsc(who)} ไม่รู้ว่าใครสาด · ขึ้นกระดานยาพิษแล้ว</div><div class="row"><button class="btn gray" id="hwsClose">ปิด</button><button class="btn" id="hwsAgain">${PZQ.length?'☠️ สาดขวดต่อไป':'✨ เปิดอีก'}</button></div>`);
 hwBusy=false;$('hwsAgain').disabled=!PZQ.length&&HW_ITEMS.some(([k])=>hwHave(k)<HW_CHEST_COST);$('hwsAgain').onclick=hwChest;$('hwsClose').onclick=()=>{if(PZQ.length)return poisonResume();st.classList.remove('on');hwRender();};hwRender();}
