/* ซีซัน 4: เลเวลตึกศูนย์ (ศูนย์ดูแลสัตว์ในฟาร์ม · ศูนย์ดรอปซาฟารี) — ตารางเดียวใช้ทุกหน้า
   ของที่ใช้อัปเกรด: วัสดุจากป่า (ไม้/หิน/เชือก/เหล็ก ชุดเดียวกับอัปเกรดบ้าน) + ผลผลิตของระบบนั้นเอง · เพิ่มขึ้นตามเลเวล
   f = วัสดุในกระเป๋าหลัก (bag.forest) · b = ของในระบบนั้น (ผลผลิตโรงนา / ของจากนก) */
window.S4CC=window.S4CC||{
 farm:{name:'ศูนย์ดูแลสัตว์',icon:'🏡',
  perk:{1:'ดูแลรายคอก ⚡ ＋ 🔍 · 🧺 เก็บทุกคอก · 🍯 รักษา',2:'＋ ใส่สัตว์ทุกคอกในปุ่มเดียว · ตึกใหญ่ขึ้น',3:'🧺 เปิดศูนย์ = เก็บผลผลิตทุกคอกให้อัตโนมัติ · ตึกพรีเมียม'},
  need:{2:[['f','wood',2500,'ไม้'],['f','stone',2500,'หิน'],['f','rope',120,'เชือก'],['f','steel',120,'เหล็ก'],['b','egg',1000,'ไข่ไก่'],['b','milk',500,'นมวัว']],
        3:[['f','wood',6000,'ไม้'],['f','stone',6000,'หิน'],['f','rope',320,'เชือก'],['f','steel',320,'เหล็ก'],['b','egg',3000,'ไข่ไก่'],['b','milk',1500,'นมวัว'],['b','cheese',500,'ชีส']]}},
 safari:{name:'ศูนย์ดรอปซาฟารี',icon:'🦒',
  perk:{1:'🍽️ ให้อาหารนกตามชนิด · 🧺 เก็บของทั้งหมด',2:'🍽️ ให้อาหารนกทุกชนิดในปุ่มเดียว · ตึกใหญ่ขึ้น',3:'🧺 เปิดศูนย์ = เก็บของบนพื้นให้อัตโนมัติ · ตึกพรีเมียม'},
  need:{2:[['f','wood',2500,'ไม้'],['f','stone',2500,'หิน'],['f','rope',120,'เชือก'],['f','steel',120,'เหล็ก'],['b','ostrich-feather',500,'ขนนกกระจอกเทศ'],['b','dodo-pebble',500,'หินกรวดนำโชค']],
        3:[['f','wood',6000,'ไม้'],['f','stone',6000,'หิน'],['f','rope',320,'เชือก'],['f','steel',320,'เหล็ก'],['b','ostrich-feather',1500,'ขนนกกระจอกเทศ'],['b','dodo-pebble',1500,'หินกรวดนำโชค'],['b','ostrich-egg',500,'ไข่นกกระจอกเทศ']]}},
 /* แถวแสดงของที่ต้องใช้: have(row) → จำนวนที่มี */
 html(def,nx,have){const rows=def.need[nx]||[];let ok=true;const h=rows.map(r=>{const n=Math.max(0,Number(have(r))||0),g=n>=r[2];if(!g)ok=false;
   return '<div class="s4ccr" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:3px 2px;font:700 11.5px Mali,sans-serif;color:#6e4b3a;border-bottom:1px dashed rgba(160,120,80,.25)"><span>'+r[3]+'</span><b style="color:'+(g?'#2F8A65':'#C8443D')+'">'+Math.min(n,r[2]).toLocaleString()+' / '+r[2].toLocaleString()+'</b></div>';}).join('');
  return {ok,html:'<div class="s4cct" style="font:800 11px Mali,sans-serif;color:#8a5a2e;margin:2px 0 4px">⬆️ อัปเกรดเป็น Lv'+nx+' · '+def.perk[nx]+'</div>'+h};},
 css:'.s4ccr{display:flex;justify-content:space-between;padding:3px 2px;font:700 11.5px Mali,sans-serif;color:#6e4b3a;border-bottom:1px dashed rgba(160,120,80,.25)}.s4cct{font:800 11px Mali,sans-serif;color:#8a5a2e;margin:2px 0 4px}'};
