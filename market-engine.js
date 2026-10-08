const TICK=15*60e3,DAY=864e5;
const ST=[{k:'veg',n:'หุ้นผัก',b:3000,v:.014,lo:2000,hi:4500},{k:'fruit',n:'หุ้นผลไม้',b:4000,v:.02,lo:2500,hi:6500},{k:'fish',n:'หุ้นบ่อปลา',b:4500,v:.02,lo:2500,hi:7500},
{k:'wine',n:'หุ้นไวน์',b:6000,v:.026,lo:3500,hi:10000},{k:'alpaca',n:'หุ้นอัลปาก้า',b:7500,v:.026,lo:4000,hi:12000},{k:'bee',n:'หุ้นซิ่ง',b:5000,v:.05,lo:500,hi:15000}];
const NEWS=[
['🌞','แดดดีทั้งสัปดาห์ ผักงามทั่วสวน!',{veg:15}],['🥬','ตลาดเช้าแย่งกันซื้อผักบุ้งยัยหนู!',{veg:12}],['🥕','เชฟดังสั่งแครอทล็อตใหญ่!',{veg:18}],['💧','ฝนตกพอดี๊พอดี ผักโตไว!',{veg:10}],
['🌧️','พายุเข้า ผักล้มทั้งแปลง!',{veg:-20}],['🐛','หนอนบุกแปลงผัก!',{veg:-15}],['🥵','แล้งจัด ผักเหี่ยว!',{veg:-12}],['📉','ผักล้นตลาด ราคาตก!',{veg:-18}],
['🍑','ร้านขนมในเมืองสั่งพีชล็อตใหญ่!',{fruit:20}],['🍒','เชอร์รียัยหนูได้ขึ้นปกนิตยสาร!',{fruit:18}],['🍎','โรงเรียนแจกแอปเปิลให้เด็กทั้งเมือง!',{fruit:12}],['🍊','หน้าหนาวคนแห่ซื้อส้ม!',{fruit:15}],
['🐛','หนอนบุกสวนผลไม้!',{fruit:-18}],['🐦','ฝูงนกจิกผลไม้ทั้งคืน!',{fruit:-14}],['🍂','ลมแรง ผลร่วงทั้งสวน!',{fruit:-20}],['🧺','ผลไม้นำเข้าราคาถูกตีตลาด!',{fruit:-12}],
['🐟','ฝูงปลาอพยพเข้าบ่อยัยหนู!',{fish:18}],['🎣','ทัวร์นาเมนต์ตกปลาประจำปีมาแล้ว!',{fish:15}],['🍣','ร้านซูชิเปิดใหม่ รับซื้อปลาทั้งหมด!',{fish:20}],['🌊','น้ำใสปิ๊ง ปลาอ้วนพี!',{fish:10}],
['🦦','นากแอบมาขโมยปลาทั้งคืน!',{fish:-20}],['🪣','น้ำในบ่อลดฮวบ!',{fish:-15}],['🐊','ลือกันว่ามีจระเข้ในบ่อ!',{fish:-22}],['🥶','น้ำเย็นจัด ปลาไม่กินเหยื่อ!',{fish:-12}],
['🍷','ไวน์ยัยหนูคว้ารางวัลเหรียญทอง!',{wine:25}],['🎉','งานเลี้ยงใหญ่ในเมือง สั่งไวน์ยกลัง!',{wine:18}],['🍇','องุ่นปีนี้หวานเป็นพิเศษ!',{wine:15}],['💍','คู่รักดังจัดงานแต่งใช้ไวน์ยัยหนู!',{wine:20}],
['🍾','ถังไวน์ระเบิด! เสียหายทั้งห้องใต้ดิน',{wine:-25}],['🧪','ลือว่าไวน์ล็อตใหม่รสเปรี้ยว!',{wine:-15}],['🐀','หนูแอบกัดจุกไวน์!',{wine:-12}],['📦','ไวน์ล้นโกดัง ต้องลดราคา!',{wine:-18}],
['🦙','ดาราใส่ผ้าพันคออัลปาก้าออกทีวี!',{alpaca:25}],['❄️','หิมะแรกของปี คนแห่ซื้อของขนฟู!',{alpaca:20}],['🧶','ไหมพรมอัลปาก้าเป็นเทรนด์ฮิต!',{alpaca:15}],['🏆','อัลปาก้ายัยหนูชนะประกวดความฟู!',{alpaca:18}],
['🥵','ร้อนจัด ไม่มีใครอยากใส่ขนฟู',{alpaca:-22}],['💦','อัลปาก้าถ่มน้ำลายใส่ลูกค้ารายใหญ่!',{alpaca:-18}],['✂️','กรรไกรตัดขนหายทั้งโรงงาน!',{alpaca:-15}],['🧥','ขนสังเคราะห์ราคาถูกตีตลาด!',{alpaca:-12}],
['🐝','ราชินีผึ้งตื่นจากจำศีล!',{bee:40}],['🍯','น้ำผึ้งเดือนห้าขายดีถล่มทลาย!',{bee:30}],['🌸','ดอกไม้บานทั้งเมือง ผึ้งขยันสุดๆ!',{bee:25}],['🚀','หุ้นซิ่งถูกพูดถึงทั่วกลุ่ม!',{bee:35}],
['🐝','ผึ้งหนีรัง!!',{bee:-45}],['🐻','หมีขโมยน้ำผึ้งหมดรัง!',{bee:-35}],['🌧️','ฝนตกทั้งอาทิตย์ ผึ้งไม่ออกจากรัง!',{bee:-25}],['😵','ข่าวลือ: เจ้าของรังผึ้งหายตัว!',{bee:-30}],
['🎉','เทศกาลสวนประจำปีเริ่มแล้ว!',{all:10}],['🎆','ปีใหม่มาแล้ว ทุกคนใช้จ่ายสนุก!',{all:12}],['💰','นักลงทุนต่างเมืองบุกตลาดสวน!',{all:8}],['🐷','น้องน้ำผึ้งบอกว่า…วันนี้ลางดี',{rnd:30}],
['👻','ข่าวลือ: ผีหลอกในตลาด!',{all:-10}],['🌀','พายุใหญ่ผ่านเมือง!',{all:-12}],['🧾','สรรพากรสวนมาตรวจ!',{all:-8}],['🐷','น้องน้ำผึ้งทำแจกันแตก…ลางร้าย',{rnd:-30}],
['🔀','ขาใหญ่ย้ายพอร์ต!',{swap:20}],['🎰','ตลาดปั่นป่วน!!',{chaos:25}],['🧙','แม่มดร่ายมนต์ใส่ตลาด!',{chaos:20}],['🎲','ลูกเต๋ายักษ์กลิ้งผ่านตลาด!',{rnd:25}]];
const WINES=[['rose','ไวน์กุหลาบวิญญาณ',2500],['moon','ไวน์องุ่นแสงจันทร์',4000],['blood','ไวน์องุ่นโลหิต',6000],['eclipse','ไวน์ราชันสุริยคราส',10000]];

export {ST,NEWS,WINES,TICK,DAY};
export function marketMath(S){
function h32(a,b,c){let x=(a*374761393+b*668265263+c*2246822519)>>>0;x=(x^(x>>>13))*1274126177>>>0;return((x^(x>>>16))>>>0)/4294967296}
const daySeed=d=>Math.floor(h32(d,77,9)*1e9); // ของจริง: คนแรกหลังเที่ยงคืนสุ่มแล้วบันทึก
const T0=Math.floor((Date.UTC(2026,9,1)-31*DAY)/TICK);
const BASE={};
const MODES={calm:{n:'🐢 นิ่ง',v:.5,hi:.8},normal:{n:'🙂 ปกติ',v:1,hi:1},hot:{n:'🔥 เดือด',v:1.6,hi:1.5}};
function modeAt(t){let m='normal';S.modes.forEach(x=>{if(x.t<=t)m=x.m});return MODES[m]}
function build(upto){ST.forEach((s,i)=>{let a=BASE[s.k]||(BASE[s.k]=[Math.log(s.b)]);const lb=Math.log(s.b);
 for(let t=T0+a.length;t<=upto;t++){const d=Math.floor(t*TICK/DAY),sd=daySeed(d);const r=h32(sd,i,t)+h32(sd,i+9,t*7)-1;
  const md=modeAt(t);let x=a[a.length-1];x=lb+(x-lb)*.985+r*s.v*1.7*md.v;
  // ตลาดแตก/บูม วันละ 1–2 ครั้ง
  for(let e=0;e<2;e++){const et=Math.floor(h32(sd,100+e,3)*96),es=Math.floor(h32(sd,200+e,5)*6);if(e===1&&h32(sd,300,1)<.5)continue;
   if(es===i&&Math.floor((t*TICK-d*DAY)/TICK)===et)x+=h32(sd,400+e,2)<.5?Math.log(2):-Math.log(2)}
  x=Math.max(Math.log(s.lo),Math.min(Math.log(s.hi*md.hi),x));a.push(x)}})}
const SLOT=12; // 12 รอบ x 15 นาที = 3 ชั่วโมง
const autoCache={};
function autoNews(sl){if(autoCache[sl]!==undefined)return autoCache[sl];const sd=daySeed(Math.floor(sl*SLOT*TICK/DAY));
 const ix=Math.floor(h32(sd,sl,11)*NEWS.length),n=NEWS[ix],t=sl*SLOT+Math.floor(h32(sd,sl,13)*SLOT);
 const o={t,e:n[0],txt:n[1],ef:n[2],auto:true,pick:Math.floor(h32(sd,sl,17)*6),top:Math.floor(h32(sd,sl,19)*6),bot:Math.floor(h32(sd,sl,23)*6)};return autoCache[sl]=o}
function newsAt(sl){const ad=S.news.find(n=>Math.floor(n.t/SLOT)===sl);return ad||autoNews(sl)}
function newsUpTo(t,from){const L=[];for(let sl=Math.floor(from/SLOT);sl<=Math.floor(t/SLOT);sl++){const n=newsAt(sl);if(n.t<=t&&n.t>=from)L.push(n)}return L}
function effect(i,t){let m=1;const s=ST[i].k;
 newsUpTo(t,t-400).forEach(n=>{const dt=t-n.t;if(dt<0||dt>400)return;const f=Math.pow(.985,dt);let p=0;const ef=n.ef;
  if(ef.all)p=ef.all;else if(ef[s]!=null)p=ef[s];else if(ef.rnd&&n.pick===i)p=ef.rnd;else if(ef.swap){if(n.top===i)p=-ef.swap;if(n.bot===i)p=ef.swap}else if(ef.chaos)p=(h32(n.t,i,5)*2-1)*ef.chaos;
  m*=1+p/100*f});
return m}
function price(i,t){build(t);const a=BASE[ST[i].k];return Math.exp(a[t-T0])*effect(i,t)}

return {price,newsUpTo,autoNews,modeAt,daySeed,h32,SLOT,MODES,clear(){for(const k in BASE)delete BASE[k];for(const k in autoCache)delete autoCache[k];}};
}
const fail=m=>{throw new Error(m);};
export function marketAction(account,world,ctx,input){
 const game=structuredClone(account);game.sub ||= {};const market=game.sub.market ||= {lots:[],divGot:{}};market.lots ||= [];market.divGot ||= {};game.bag ||= {};game.bag.wine ||= {};
 const config=structuredClone(world||{news:[],modes:[]});config.news ||= [];config.modes ||= [];const maths=marketMath(config),tick=Math.floor(ctx.now/TICK),day=Math.floor((ctx.now+7*3600000)/DAY),at=day*DAY+13*3600000;let dividend=0;
 if(ctx.now>=at&&!market.divGot[day]){const i=Math.floor(maths.h32(maths.daySeed(day),55,1)*6),h=market.lots.filter(l=>l.i===i&&l.t<=at).reduce((a,l)=>a+l.q,0),per=Math.round(maths.price(i,Math.floor(at/TICK))*.03);dividend=h*per;game.merit=(game.merit||0)+dividend;market.divGot={[day]:true};}
 const price=i=>maths.price(i,tick),result=()=>({game,config,dividend});
 if(input.type==='status'||input.type==='dividend')return result();
 if(input.type==='buy'){
 const i=input.stock,q=input.qty;if(!Number.isInteger(i)||i<0||i>=ST.length||!Number.isInteger(q)||q<1||q>100)fail('หุ้นหรือจำนวนไม่ถูกต้อง');if(market.lots.filter(l=>l.i===i).reduce((a,l)=>a+l.q,0)+q>100)fail('ถือได้ไม่เกิน 100 หุ้นต่อชนิด');const pr=price(i),cost=Math.round(pr*q)+Math.round(pr*q*.02);if((game.merit||0)<cost)fail('กุศลไม่พอ');game.merit-=cost;
 const batch=Math.floor(ctx.now/DAY),lot=market.lots.find(l=>l.i===i&&l.day===batch&&l.t+DAY>ctx.now);if(lot){lot.q+=q;lot.cost+=pr*q;lot.t=ctx.now;}else market.lots.push({i,q,cost:pr*q,t:ctx.now,day:batch});return result();
 }
 if(input.type==='sell'){
 const ix=input.index;if(!Number.isInteger(ix)||!market.lots[ix])fail('ไม่พบหุ้นก้อนนี้');const l=market.lots[ix];if(input.boughtAt!==l.t)fail('พอร์ตเปลี่ยนแล้ว กรุณาตรวจสอบใหม่');if(ctx.now<l.t+DAY)fail('ยังถือไม่ครบ 24 ชั่วโมง');game.merit=(game.merit||0)+Math.round(price(l.i)*l.q*.98);market.lots.splice(ix,1);return result();
 }
 if(input.type==='wine'){
 const w=WINES.find(w=>w[0]===input.wine);if(!w||(game.bag.wine[w[0]]||0)<1)fail('ไม่มีไวน์นี้');game.bag.wine[w[0]]--;game.merit=(game.merit||0)+Math.round(w[2]*(1+Math.min(.2,Math.max(0,price(3)/ST[3].b-1))));return result();
 }
 if(input.type==='news'||input.type==='mode'){
 if(!ctx.admin)fail('เฉพาะแอดมิน');if(input.type==='mode'){if(!maths.MODES[input.mode])fail('รูปแบบตลาดไม่ถูกต้อง');config.modes.push({t:tick+1,m:input.mode});}
 else{const slot=Math.floor(tick/maths.SLOT);if(config.news.some(n=>Math.floor(n.t/maths.SLOT)===slot)||maths.autoNews(slot).t<=tick)fail('รอบข่าวนี้ส่งไปแล้ว');const n=NEWS[input.index];if(!Number.isInteger(input.index)||!n)fail('ข่าวไม่ถูกต้อง');const nw={t:tick,e:n[0],txt:n[1],ef:n[2]};if(n[2].rnd)nw.pick=Math.floor(maths.h32(ctx.now,slot,7)*6);if(n[2].swap){const c=ST.map((_,i)=>price(i)/maths.price(i,tick-96)-1);nw.top=c.indexOf(Math.max(...c));nw.bot=c.indexOf(Math.min(...c));}config.news.push(nw);}
 // Only the latest 35 days influence displayed history. Bound configuration entries.
 config.news=config.news.filter(n=>n.t>=tick-3360).slice(-280);config.modes=config.modes.slice(-128);return result();
 }
 fail('คำสั่งตลาดไม่ถูกต้อง');
}
