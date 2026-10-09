import {ST,NEWS,WINES,TICK,DAY,marketMath} from './market-engine.js?v=ss3-recovery6';
const __H=parent.__HOST;if(!__H)throw new Error('กรุณาเข้าเกมจากหน้าล็อกอิน');const __LS={getItem:k=>__H.get(k),setItem:(k,v)=>{__H.set(k,String(v));if(__H.admin){const fresh=JSON.parse(__H.get(k)||'null');if(fresh)Object.assign(S,fresh)}},removeItem:k=>__H.del(k)};

const IMG={"shop-bg":"images/shop-bg.webp","item-coinbag":"images/shop-item-coinbag.webp","stock-veg":"images/shop-stock-veg.webp","stock-fruit":"images/shop-stock-fruit.webp","stock-fish":"images/shop-stock-fish.webp","stock-wine":"images/shop-stock-wine.webp","stock-alpaca":"images/shop-stock-alpaca.webp","stock-bee":"images/shop-stock-bee.webp","wine-rose":"images/house-wine-rose.webp","wine-moon":"images/house-wine-moon.webp","wine-blood":"images/house-wine-blood.webp","wine-eclipse":"images/house-wine-eclipse.webp"};

const SOON=['ผ้าพันคอสายรุ้ง','ตุ๊กตาอัลปาก้า','สเต็กอัลปาก้า','ชุดเนื้อราชวงศ์'];
const $=id=>document.getElementById(id);const nf=n=>Math.round(n).toLocaleString('en-US');
const S={role:'player',off:0,merit:0,lots:[],bag:{rose:0,moon:0,blood:0,eclipse:0},news:[],mail:[],mailSeen:0,modes:[],divGot:{},tab:'1d'};
Object.assign(S,JSON.parse(__LS.getItem('s3market1')));S.role=JSON.parse(__LS.getItem('s3user')).admin?'admin':'player';S.off=0;
function save(){}
let marketBusy=false,stopMarket=null;async function marketCloud(input){if(marketBusy)return;marketBusy=true;try{const out=await __H.cloud('market',input),fresh=JSON.parse(__H.get('s3market1'));Object.assign(S,fresh);Object.assign(S,out.config);clearPrices();return out;}catch(e){ann(e.message,false);}finally{marketBusy=false;}}
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
 <div class="counter"><button class="cbtn" id="b1"><img src="${IMG['wine-moon']}" alt="">รับซื้อของ</button><button class="cbtn" id="b2"><img src="${IMG['item-coinbag']}" alt="">พอร์ตของฉัน</button></div><div class="counter" style="top:80.5%;grid-template-columns:1fr"><button class="cbtn" id="b3">📰 ข่าวตลาดย้อนหลัง</button></div>`;
 st.querySelectorAll('.srow').forEach(r=>r.onclick=()=>stock(+r.dataset.i));
 $('b1').onclick=sellShop;$('b2').onclick=port;$('b3').onclick=newsList;renderTop()}
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
async function sell(ix){const l=S.lots[ix];if(!l)return;const out=await marketCloud({type:'sell',index:ix,boughtAt:l.t});if(out){closeSheet();render();showCraftResult({title:'ผลการขายหุ้น',outputs:[],merit:out.gain,consumed:[{name:ST[l.i].n,quantity:l.q}]},port);}}
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

setInterval(()=>{if(!S.open&&!$('sheet').classList.contains('on'))render();else renderTop()},15000);
render();marketCloud({type:'status'}).then(()=>render());stopMarket=__H.watchWorld('market',data=>{if(data){Object.assign(S,data);clearPrices();render();}});addEventListener('pagehide',()=>stopMarket?.());setTimeout(()=>ann('แตะหุ้นบนกระดานเพื่อดูกราฟและซื้อ · ราคาเปลี่ยนทุก 15 นาที'),500);

// UI state changes are batched once after each click; unchanged snapshots do not write.
document.addEventListener('click',()=>setTimeout(save,0));
