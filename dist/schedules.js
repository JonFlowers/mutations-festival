let schedulePlans=[],activeScheduleId='default',scheduleEditAction=null;
function activeSchedule(){return schedulePlans.find(p=>p.id===activeScheduleId);}
function newScheduleId(){return 'plan-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);}
function loadNamedSchedules(){
 try{
  const data=JSON.parse(localStorage.getItem('mutations26-schedules')||'null');
  if(data?.version===1&&Array.isArray(data.plans)){
   const seen=new Set();schedulePlans=data.plans.filter(p=>p&&typeof p.id==='string'&&!seen.has(p.id)&&seen.add(p.id)&&typeof p.name==='string'&&Array.isArray(p.ids)).map(p=>({id:p.id,name:p.name.trim().slice(0,60)||'Untitled schedule',ids:[...new Set(p.ids.filter(id=>allActs.some(a=>a.id===id)))]}));
   if(schedulePlans.length){activeScheduleId=schedulePlans.some(p=>p.id===data.activeId)?data.activeId:schedulePlans[0].id;saved=new Set(activeSchedule().ids);return;}
  }
 }catch{}
 schedulePlans=[{id:'default',name:'My Schedule',ids:[...saved]}];activeScheduleId='default';
}
function persistNamedSchedules(){
 const plan=activeSchedule();if(plan)plan.ids=[...saved];
 try{localStorage.setItem('mutations26-schedules',JSON.stringify({version:1,activeId:activeScheduleId,plans:schedulePlans}));localStorage.setItem('mutations26-saturday',JSON.stringify([...saved]));return true;}
 catch{announce('Schedules are available this session; browser storage is unavailable.');return false;}
}
function renderScheduleManager(){
 $('#schedule-manager').hidden=sharedPreview;
 $('#schedule-picker').innerHTML=schedulePlans.map(p=>`<option value="${esc(p.id)}">${esc(p.name)} (${p.id===activeScheduleId?saved.size:p.ids.length})</option>`).join('');
 $('#schedule-picker').value=activeScheduleId;$('#delete-schedule').disabled=schedulePlans.length<2;
}
function switchSchedule(id){
 if(!schedulePlans.some(p=>p.id===id))return;
 if(sharedPreview)restoreOwnSchedule();
 activeScheduleId=id;saved=new Set(activeSchedule().ids);persistNamedSchedules();$('#schedule-editor').hidden=true;$('#share-link-box').hidden=true;render();
}
function beginScheduleEdit(action){
 scheduleEditAction=action;const deleting=action==='delete';
 $('#schedule-editor').hidden=false;$('#schedule-edit-title').textContent=deleting?`Delete “${activeSchedule().name}”? Its selections will be removed.`:action==='rename'?'Rename schedule':action==='duplicate'?'Copy this schedule':'Create a schedule';
 $('#schedule-name-label').hidden=deleting;$('#schedule-name').disabled=deleting;
 $('#schedule-name').value=action==='rename'?activeSchedule().name:action==='duplicate'?activeSchedule().name+' copy':'';
 $('#schedule-edit-submit').textContent=deleting?'Delete schedule':'Save schedule';
 if(!deleting)$('#schedule-name').focus();
}
function commitScheduleEdit(name){
 const action=scheduleEditAction;
 if(action==='delete'){
  if(schedulePlans.length<2)return;
  schedulePlans=schedulePlans.filter(p=>p.id!==activeScheduleId);activeScheduleId=schedulePlans[0].id;saved=new Set(activeSchedule().ids);
 }else{
  name=String(name).trim().slice(0,60);if(!name)return;
  if(action==='rename')activeSchedule().name=name;
  else if(action==='new'||action==='duplicate'){
   const plan={id:newScheduleId(),name,ids:action==='duplicate'?[...saved]:[]};schedulePlans.push(plan);activeScheduleId=plan.id;saved=new Set(plan.ids);
  }else return;
 }
 persistNamedSchedules();$('#schedule-editor').hidden=true;$('#share-link-box').hidden=true;render();announce('Schedule saved.');
}
function saveSharedAsNew(){
 if(!sharedPreview)return;
 const ids=[...saved];saved=ownSchedule;sharedPreview=false;ownSchedule=null;
 const plan={id:newScheduleId(),name:'Shared schedule',ids};schedulePlans.push(plan);activeScheduleId=plan.id;saved=new Set(ids);persistNamedSchedules();dismissSharedLink();render();announce('Shared plan saved as a separate schedule.');
}
document.addEventListener('click',event=>{
 const action=event.target.closest('[data-schedule-action]');if(action)beginScheduleEdit(action.dataset.scheduleAction);
 if(event.target.closest('#cancel-schedule-edit'))$('#schedule-editor').hidden=true;
 if(event.target.closest('#save-shared-new'))saveSharedAsNew();
});
document.addEventListener('change',event=>{if(event.target.id==='schedule-picker')switchSchedule(event.target.value);});
document.addEventListener('submit',event=>{if(event.target.id==='schedule-editor'){event.preventDefault();commitScheduleEdit($('#schedule-name').value);}});
