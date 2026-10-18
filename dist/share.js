let sharedPreview=false,ownSchedule=null,ownDay=null;
function parseScheduleLink(hash){
 const params=new URLSearchParams(hash.replace(/^#/,''));
 if(!params.has('schedule'))return null;
 const value=params.get('schedule');if(value.length>4000||!value.startsWith('v1:'))throw new Error('This schedule link is not supported.');
 const raw=value.slice(3).split(',').filter(Boolean);
 if(!raw.length||raw.some(id=>!allActs.some(a=>a.id===id)))throw new Error('This schedule link contains unavailable acts.');
 const ids=[...new Set(raw)],day=params.get('day');
 return {ids,day:festivalDays[day]&&ids.some(id=>allActs.some(a=>a.id===id&&a.day===day))?day:allActs.find(a=>a.id===ids[0]).day};
}
function scheduleShareUrl(){
 const url=new URL(location.href);url.search='';
 const ids=allActs.filter(a=>saved.has(a.id)).map(a=>a.id);
 if(!ids.length)return null;
 url.hash=new URLSearchParams({schedule:'v1:'+ids.join(','),day:selectedDay}).toString();return url.href;
}
function applyScheduleLink(){
 if(typeof location==='undefined')return;
 try{
  const plan=parseScheduleLink(location.hash);if(!plan)return;
  if(!sharedPreview){ownSchedule=new Set(saved);ownDay=selectedDay;}
  sharedPreview=true;saved=new Set(plan.ids);selectedDay=plan.day;acts=allActs.filter(a=>a.day===selectedDay);mode='saved';venue='all';query='';period='all';
 }catch(error){announce(error.message);}
}
function persistSchedule(){try{localStorage.setItem('mutations26-saturday',JSON.stringify([...saved]));return true;}catch{announce('Your schedule is available this session; browser storage is unavailable.');return false;}}
function dismissSharedLink(){if(typeof history!=='undefined')history.replaceState(null,'',location.pathname+location.search);}
function saveSharedSchedule(){
 if(!sharedPreview)return;
 saved=new Set([...ownSchedule,...saved]);sharedPreview=false;ownSchedule=null;persistSchedule();dismissSharedLink();render();announce('Shared acts added to your schedule for both days.');
}
function restoreOwnSchedule(){
 if(!sharedPreview)return;
 saved=ownSchedule;selectedDay=ownDay;acts=allActs.filter(a=>a.day===selectedDay);sharedPreview=false;ownSchedule=null;dismissSharedLink();render();
}
async function shareMySchedule(){
 const url=scheduleShareUrl();if(!url){announce('Select at least one act to share your schedule.');return;}
 if(navigator.share){try{await navigator.share({title:'My Mutations Festival schedule',text:'Here are my picks for Mutations Festival — Friday and Saturday.',url});return;}catch(e){if(e.name==='AbortError')return;}}
 try{await navigator.clipboard.writeText(url);announce('Schedule link copied — includes picks from both days.');}
 catch{const box=$('#share-link-box');box.hidden=false;$('#share-link').value=url;$('#share-link').focus();$('#share-link').select();}
}
document.addEventListener('click',event=>{
 if(event.target.closest('#share-schedule'))shareMySchedule();
 if(event.target.closest('#save-shared'))saveSharedSchedule();
 if(event.target.closest('#restore-schedule'))restoreOwnSchedule();
 if(event.target.closest('#close-share-link'))$('#share-link-box').hidden=true;
});

if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('hashchange',()=>{applyScheduleLink();render();});
