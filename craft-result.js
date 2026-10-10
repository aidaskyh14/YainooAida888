/* One durable receipt view for every craft system. Receive acknowledges a committed grant. */
(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 window.showCraftResult=async function(data,again){
  document.getElementById('craftReceipt')?.remove();const overlay=document.createElement('div');overlay.id='craftReceipt';overlay.style.cssText='position:fixed;inset:0;z-index:100;background:#28483c88;display:grid;place-items:center;padding:16px;box-sizing:border-box';
  const fuzzy=name=>{if(!name)return null;let best=null;for(const c of parent.__HOST.catalog||[])if(c.n&&String(name).startsWith(c.n)&&(!best||c.n.length>best.n.length))best=c;return best;};
  const label=row=>{const H=parent.__HOST;const c=H.catalogItem?.(row.path||'')||H.catalogName?.(row.name||'')||fuzzy(row.name);return {name:c?.n||row.name||row.path||'ไอเทม',image:row.image||(c?.i?'images/'+c.i:'')};};
  const rows=(list)=>list.map(r=>{const l=label(r);return `<div style="display:flex;align-items:center;gap:10px;padding:7px;background:#fff3d9;border-radius:15px;margin:5px 0">${l.image?`<img src="${esc(l.image)}" style="width:48px;height:48px;object-fit:contain">`:''}<b>${esc(l.name)} ×${Number(r.quantity||0).toLocaleString()}</b></div>`;}).join('');
  const results=data.results||[],wins=results.filter(Boolean).length,outputs=data.outputs||[],hasReward=outputs.length||data.merit;
  if(data.incomplete){overlay.innerHTML='<section>ยังตรวจผลคราฟไม่ได้ กรุณาตรวจระบบกลาง</section>';document.body.appendChild(overlay);return;}
  overlay.innerHTML=`<section style="background:#fffaf1;color:#563c32;border-radius:28px;padding:20px;box-sizing:border-box;width:min(460px,100%);max-height:86vh;overflow:auto;text-align:center;font:16px system-ui"><h2 style="font-size:22px">${esc(data.title||'ผลการคราฟ')}</h2>${results.length?`<h3>สำเร็จ ${wins} จาก ${results.length} ครั้ง</h3><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">${results.map((r,i)=>`<span style="min-width:30px;font-size:19px"><small style="display:block;font-size:12px">${i+1}</small>${r?'✅':'❌'}</span>`).join('')}</div>`:''}<h3 id="receiptHead">${hasReward?'ของที่ได้จากการคราฟครั้งนี้':'คราฟครั้งนี้ไม่สำเร็จ'}</h3>${rows(data.outputs||[])}${data.merit?`<p>✨ กุศล +${Number(data.merit).toLocaleString()}</p>`:''}${!data.outputs?.length&&!data.merit?'<p>ไม่ได้รับไอเทม · วัตถุดิบถูกใช้ตามสูตร ดูรายละเอียดด้านล่าง</p>':''}<details open><summary>วัตถุดิบ / ของที่ใช้ไป</summary>${rows(data.consumed||[])}</details><p id="receiptStatus">กำลังยืนยันการบันทึก…</p><div style="display:flex;gap:10px;justify-content:center"><button id="receiptAgain" disabled style="padding:13px;border:0;border-radius:22px;background:#ece9e5;color:#563c32;font:inherit">คราฟต่อ</button><button id="receiptReceive" disabled style="padding:13px;border:0;border-radius:22px;background:#76d2ad;color:#254d3d;font:inherit">🎒 รับเข้ากระเป๋า</button></div></section>`;
  document.body.appendChild(overlay);const status=overlay.querySelector('#receiptStatus'),receive=overlay.querySelector('#receiptReceive'),cont=overlay.querySelector('#receiptAgain');
  const resync=()=>{try{if(typeof window.syncFromHost==='function'){window.syncFromHost();return true;}}catch(_){}return false;};
  async function commit(){try{await parent.__HOST.commit();status.textContent='บันทึกแล้ว ✓';overlay.querySelector('#receiptHead').textContent=hasReward?'ของที่ได้จากการคราฟครั้งนี้':'คราฟครั้งนี้ไม่สำเร็จ';cont.textContent='คราฟต่อ';receive.disabled=false;cont.disabled=!again;receive.textContent=hasReward?'🎒 รับเข้ากระเป๋า':'รับทราบ';receive.onclick=()=>overlay.remove();cont.onclick=()=>{overlay.remove();again?.();};}
   catch(e){/* never show success: the screen is reloaded from the Host state, which is what the cloud has */
    const synced=resync(),setFail=!!e?.hostSet;overlay.querySelector('#receiptHead').textContent='ยังไม่ได้รับของ';
    status.innerHTML='<b style="color:#b3261e">บันทึกไม่สำเร็จ ของยังไม่เปลี่ยน กรุณาลองใหม่</b>'+(e?.message?'<br><small>'+esc(e.message)+'</small>':'');
    cont.textContent='ปิด';cont.disabled=false;cont.onclick=()=>{overlay.remove();if(!synced)location.reload();};
    if(setFail){receive.textContent='ตกลง';receive.disabled=false;receive.onclick=cont.onclick;}
    else{receive.textContent='ลองบันทึกอีกครั้ง';receive.disabled=false;receive.onclick=()=>{receive.disabled=true;commit();};}}}
  await commit();
 };
})();
