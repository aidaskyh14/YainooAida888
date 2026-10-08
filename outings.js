/* Loaded after the farm preview scripts; actions commit before the animation. */
const OutingsHost=parent.__HOST;
let outingBusy=false;
async function outingAction(input){if(outingBusy)return null;outingBusy=true;try{const out=await OutingsHost.cloud('outings',input);Object.assign(S,JSON.parse(OutingsHost.get('s3all-v1')));fuel=S.fuel;pts=S.merit;render();return out;}catch(e){toast(e.message,1);return null;}finally{outingBusy=false;}}
callHoney=async kind=>{if(await outingAction({type:'call',vehicle:kind==='ship'||kind==='raft'?kind:'jeep'})){closeAll();toast('🐷 น้องน้ำผึ้งกำลังมา');}};
openReq=function(){const h=S.honey;if(!h||h.leaveAt||hPhase()!=='parked')return;const c=HV[h.v];$('delSheet').innerHTML='<h3>🐷 น้องน้ำผึ้งอยากได้…</h3>'+h.req.map(r=>'<div class="dreq '+(fHave(r)>=r[2]?'ok':'no')+'"><img src="'+fImg(r)+'"><b>'+fName(r)+'</b><span>มี '+fHave(r)+'/'+r[2]+'</span></div>').join('')+'<button class="big" id="sendHoney" '+(h.req.every(r=>fHave(r)>=r[2])?'':'disabled')+'>ส่งอาหาร</button><div class="hint">'+c.nm+' • กุศล '+c.mer[0]+'–'+c.mer[1]+'</div>';open('delSheet');$('sendHoney').onclick=async()=>{const out=await outingAction({type:'deliver'});if(out){closeAll();toast('🐷 ส่งสำเร็จ +'+fmt(out.gain)+' กุศล'+(out.items?.pestle?' • สากกะเบือ ×1':'')+(out.items?.medicine?' • ยาน้ำผึ้งมะนาว ×1':''));}};};
$('mHoney').onclick=()=>{closeAll();renderHoney();open('honeySheet');};
$('dFuel').onclick=async()=>{if(await outingAction({type:'refuel'})){closeAll();toast('⛽ เติมน้ำมันเต็มแล้ว');}};
setInterval(()=>{fuel=Math.min(100,(S.fuel||0)+Math.floor(Math.max(0,Date.now()-(S.fuelAt||Date.now()))/6000)*10);},1000);
outingAction({type:'status'});
