// Regular Friday/Saturday hours checked on restaurant websites, 20 October 2026.
const foodPlaces=[
 {name:'Honest Burgers',address:'8 Duke Street',lat:50.8227226,lng:-0.1427266,type:'Burgers · eat in or takeaway',open:660,close:1380,source:'https://www.honestburgers.co.uk/locations/brighton/'},
 {name:'Burger Brothers',address:'97 North Road',lat:50.8255651,lng:-0.137869,type:'Burgers · takeaway',open:720,close:1245,source:'https://www.burgerbrothersbrighton.co.uk/'},
 {name:'La Choza',address:'36 Gloucester Road',lat:50.826959,lng:-0.1394232,type:'Mexican street food · eat in or takeaway',open:690,close:1320,source:'https://lachoza.co.uk/'}
];
let foodMealMinutes=30,foodBaseVenue=null;
function foodWalk(a,b){
 const rad=x=>x*Math.PI/180,dlat=rad(b[0]-a[0]),dlon=rad(b[1]-a[1]);
 const h=Math.sin(dlat/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dlon/2)**2;
 return Math.ceil(6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))*1.3/80)+2;
}
function foodGaps(items){
 const timed=scheduleLayout(items).timed,blocks=[];
 timed.forEach(a=>{const start=minute(a.start),end=minute(a.end),last=blocks[blocks.length-1];
  if(last&&start<=last.end){if(end>last.end){last.end=end;last.after=a;}}
  else blocks.push({start,end,before:a,after:a});
 });
 return blocks.slice(1).map((next,i)=>({start:blocks[i].end,end:next.start,from:blocks[i].after,to:next.before}));
}
function foodOptions(gap,meal=foodMealMinutes){
 return foodPlaces.map(place=>{
  const point=[place.lat,place.lng],out=foodWalk(venueLocations[gap.from.venue],point),onward=foodWalk(point,venueLocations[gap.to.venue]);
  const arrival=Math.max(gap.start+out,place.open),leave=arrival+meal,latestLeave=gap.end-onward-10;
  return {place,out,onward,arrival,leave,latestLeave,spare:latestLeave-leave,fits:leave<=place.close&&leave<=latestLeave};
 }).filter(x=>x.fits).sort((a,b)=>a.out-b.out||b.spare-a.spare);
}
function foodDirections(from,place){return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(from+' '+venueLocations[from][2]+' Brighton')+'&destination='+encodeURIComponent(place.name+' '+place.address+' Brighton')+'&travelmode=walking';}
function foodPlaceCard(place,from,option){
 const walk=option?.out??foodWalk(venueLocations[from],[place.lat,place.lng]);
 return `<article class="food-place"><div><h4>${esc(place.name)}</h4><p>${esc(place.type)}<br>${esc(place.address)} · regular Fri/Sat ${scheduleClock(place.open)}–${scheduleClock(place.close)}</p>${option?`<p class="food-fit">Food stop ${scheduleClock(option.arrival)}–${scheduleClock(option.leave)} · ~${option.onward} min onward walk · ${option.spare} min spare after a 10 min venue buffer</p>`:''}<div class="links"><a href="${foodDirections(from,place)}" target="_blank" rel="noopener">Walk there ↗</a><a href="${place.source}" target="_blank" rel="noopener">Menu & check hours ↗</a></div></div><strong class="food-walk">~${walk}<span>min walk</span></strong></article>`;
}
function renderFood(items){
 const timed=scheduleLayout(items).timed,gaps=foodGaps(items),suggestions=gaps.map(g=>({gap:g,options:foodOptions(g)})).filter(x=>x.options.length);
 if(!foodBaseVenue||!venueLocations[foodBaseVenue])foodBaseVenue=timed[0]?.venue||venues[0][0];
 const nearby=foodPlaces.slice().sort((a,b)=>foodWalk(venueLocations[foodBaseVenue],[a.lat,a.lng])-foodWalk(venueLocations[foodBaseVenue],[b.lat,b.lng]));
 $('#results').innerHTML=`<section class="food-view"><div class="schedule-summary"><div><b>${suggestions.length}</b> food opportunities</div><div><b>${foodMealMinutes}</b> min to order & eat</div><div><b>10</b> min venue buffer</div></div><p class="schedule-help">Suggestions use gaps with no selected bands playing. Each allows for the walk from your previous venue, food, the onward walk and 10 minutes before the next set. Times are estimates; service and queues may take longer. Clashing picks are treated as occupied time, not food breaks.</p><label class="food-duration">Time to order and eat <select id="food-duration"><option value="20" ${foodMealMinutes===20?'selected':''}>20 min · quick bite</option><option value="30" ${foodMealMinutes===30?'selected':''}>30 min · food break</option><option value="45" ${foodMealMinutes===45?'selected':''}>45 min · longer meal</option><option value="60" ${foodMealMinutes===60?'selected':''}>60 min · relaxed meal</option></select></label><h3>When could we eat?</h3>${suggestions.length?suggestions.map(({gap,options})=>`<section class="food-window"><header><strong>${scheduleClock(gap.start)}–${scheduleClock(gap.end)}</strong><span>${gap.end-gap.start} min between bands</span></header><p>After <b>${esc(gap.from.name)}</b> at ${esc(gap.from.venue)}; before <b>${esc(gap.to.name)}</b> at ${esc(gap.to.venue)} (${gap.to.start}). Ranked by proximity to ${esc(gap.from.venue)}.</p>${foodPlaceCard(options[0].place,gap.from.venue,options[0])}${options.length>1?`<details><summary>${options.length-1} other nearby option${options.length>2?'s':''} that fit</summary>${options.slice(1).map(o=>foodPlaceCard(o.place,gap.from.venue,o)).join('')}</details>`:''}</section>`).join(''):`<div class="empty"><strong>${timed.length<2?'Choose at least two sets to find food gaps.':'No food stop fits these selections yet.'}</strong><p>${timed.length<2?'Nearby places are listed below.':'Try a shorter food break or leave a longer gap between bands. No recommendation is made when walking, eating and the venue buffer will not fit.'}</p></div>`}<h3>Food near where you are</h3><label class="food-location">Current venue <select id="food-origin">${venues.map(v=>`<option value="${esc(v[0])}" ${foodBaseVenue===v[0]?'selected':''}>${esc(v[0])}</option>`).join('')}</select></label><p class="schedule-help">Choose your venue manually; this does not use GPS. These nearby places are not a promise of being open now or of fitting the next set. Use the food windows above for schedule checks.</p>${nearby.map(p=>foodPlaceCard(p,foodBaseVenue)).join('')}<p class="schedule-help">A small curated selection, not an exhaustive food directory. Regular Friday/Saturday hours and addresses checked on the linked restaurant websites on 20 October 2026. Holiday hours, kitchen closing times, queues and availability may differ. Walking estimates use venue coordinates rather than street routing.</p></section>`;
}
document.addEventListener('change',event=>{
 if(event.target.id==='food-duration'){const value=Number(event.target.value);if([20,30,45,60].includes(value)){foodMealMinutes=value;render();}}
 if(event.target.id==='food-origin'&&venueLocations[event.target.value]){foodBaseVenue=event.target.value;render();}
});
