// Walking estimates: straight-line distance x 1.3 for street layout, 80 m/min,
// plus 2 minutes for venue exits/entrances. Not a routed or live journey time.
function walkingMinutes(from,to){
 if(from===to)return 0;
 const a=venueLocations[from],b=venueLocations[to];if(!a||!b)return null;
 const rad=x=>x*Math.PI/180;
 const dlat=rad(b[0]-a[0]),dlon=rad(b[1]-a[1]);
 const h=Math.sin(dlat/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dlon/2)**2;
 const metres=6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
 return Math.ceil(metres*1.3/80)+2;
}
function scheduleLayout(items){
 const timed=items.filter(a=>!a.pending).slice().sort((a,b)=>minute(a.start)-minute(b.start)||minute(a.end)-minute(b.end)||a.id.localeCompare(b.id));
 const ends=[];
 return {timed:timed.map(a=>{let lane=ends.findIndex(end=>end<=minute(a.start));if(lane<0)lane=ends.length;ends[lane]=minute(a.end);return {...a,lane};}),lanes:Math.max(1,ends.length)};
}
function scheduleTransfers(timed){
 return timed.slice(1).map((next,i)=>{const previous=timed[i],walk=walkingMinutes(previous.venue,next.venue),gap=minute(next.start)-minute(previous.end);return {previous,next,walk,gap,short:gap<0||(walk!==null&&gap<walk),missing:walk===null};});
}
function scheduleClock(value){const h=Math.floor(value/60),m=value%60;return `${String(h%24).padStart(2,'0')}:${String(m).padStart(2,'0')}${h>=24?' Sun':''}`;}
function timelineWalks(transfers,start,scale){
 let bottom=0;
 const cards=transfers.map(t=>{
  const {previous:a,next:b,walk,gap}=t;
  const anchor=(Math.min(minute(a.end),minute(b.start))-start)*scale;
  const top=Math.max(anchor,bottom?bottom+10:25);bottom=top+132;
  const route='https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(a.venue+' '+venueLocations[a.venue][2]+' Brighton')+'&destination='+encodeURIComponent(b.venue+' '+venueLocations[b.venue][2]+' Brighton')+'&travelmode=walking';
  const status=gap<0?`⚠ Sets overlap by ${-gap} min`:walk===null?'Estimate unavailable':gap<walk?`⚠ ${walk-gap} min short · ${gap} min gap`:`${gap-walk} min spare · ${gap} min gap`;
  return `<aside class="timeline-walk ${t.short?'timeline-walk-short':''}" style="top:${top}px" aria-label="${esc(a.venue)} to ${esc(b.venue)}, ${walk===null?'walking time unavailable':walk+' minutes estimated walking'}. ${esc(status)}"><div class="walk-heading">${walk===0?'SAME VENUE':'WALK TO NEXT SET'} · after ${a.end}${minute(a.end)>=1440?' Sun':''}</div><div class="walk-main"><strong>${walk===null?'—':walk===0?'Stay here':`~${walk}<small> min walk</small>`}</strong>${a.venue!==b.venue?`<a href="${route}" target="_blank" rel="noopener" aria-label="Walking route from ${esc(a.venue)} to ${esc(b.venue)}">Route ↗</a>`:''}</div><div class="walk-venues">${esc(a.venue)} → ${esc(b.venue)}</div><div class="walk-status">${status}</div></aside>`;
 }).join('');
 return {cards,bottom};
}
function renderMySchedule(items){
 const {timed,lanes}=scheduleLayout(items),unknown=items.filter(a=>a.pending),transfers=scheduleTransfers(timed);
 const pairs=timed.reduce((n,a,i)=>n+timed.slice(i+1).filter(b=>minute(b.start)<minute(a.end)&&minute(b.end)>minute(a.start)).length,0);
 const start=780,end=Math.max(1560,...timed.map(a=>minute(a.end))),scale=1.65;
 const walks=timelineWalks(transfers,start,scale);
 const ticks=[];for(let t=start;t<=end;t+=60)ticks.push(`<div class="schedule-hour" style="top:${(t-start)*scale}px"><span>${scheduleClock(t)}</span></div>`);
 $('#results').innerHTML=`<section class="my-schedule"><div class="schedule-summary"><div><b>${items.length}</b> selected sets</div><div class="${pairs?'has-clash':''}"><b>${pairs}</b> time clash${pairs===1?'':'es'}</div><div class="${transfers.some(t=>t.short)?'has-clash':''}"><b>${transfers.filter(t=>t.short).length}</b> tight transfer${transfers.filter(t=>t.short).length===1?'':'s'}</div></div><p class="schedule-help">Select acts with <b>＋ My Schedule</b> in the lineup. Your choices stay in this browser. Red sets overlap. Walking times appear beside the sets; red walking cards flag overlaps or gaps that are too short. All walks are estimates, excluding queues. Scroll sideways if sets overlap.</p><div class="schedule-legend"><span>● Selected set</span><span>↗ Estimated walk between sets</span><span class="has-clash">● Clash</span><span>Saturday 24 Oct → Sunday 25 Oct · Brighton time</span></div>${timed.length?`<div class="schedule-scroll" tabindex="0" role="region" aria-label="Selected bands on a timeline from 13:00 Saturday to 02:00 Sunday. Scroll horizontally for overlapping sets."><div class="schedule-board" style="height:${Math.max((end-start)*scale+35,walks.bottom+20)}px;min-width:${Math.max(680,lanes*210+310)}px;--lanes:${lanes}">${ticks.join('')}<div class="walk-column-title">WALKS BETWEEN SETS</div>${walks.cards}${timed.map(a=>{const overlap=clashes(a);return `<article class="schedule-block ${overlap.length?'schedule-conflict':''}" style="top:${(minute(a.start)-start)*scale}px;height:${(minute(a.end)-minute(a.start))*scale}px;left:calc(70px + (100% - 310px) / ${lanes} * ${a.lane});width:calc((100% - 310px) / ${lanes} - 5px)" aria-label="${esc(a.name)}, ${esc(a.venue)}, ${a.start} to ${a.end}${overlap.length?', clashes with '+esc(overlap.map(b=>b.name).join(', ')):''}"><div class="schedule-block-title"><strong>${esc(a.name)}</strong><button data-save="${a.id}" aria-label="Remove ${esc(a.name)} from My Schedule">×</button></div><span>${esc(a.venue)} · ${a.start}–${a.end}</span>${overlap.length?`<span class="schedule-clash-label">Clash: ${esc(overlap.map(b=>b.name).join(', '))}</span>`:''}</article>`;}).join('')}</div></div>`:''}${unknown.length?`<section class="schedule-pending"><h3>Time to be announced</h3><p>These selections cannot yet be placed on the timeline or checked for clashes.</p>${unknown.map(a=>card(a,true)).join('')}</section>`:''}<section class="schedule-journeys"><h3>Between your sets</h3><p class="schedule-help">Walking times are estimates from venue coordinates, adjusted for streets at 80 m/min, plus 2 minutes for exits and entrances. They exclude queues and are not routed journey times. Use the walking route link to check the journey. Clashing selections are alternative plans, not a feasible itinerary.</p>${transfers.length?transfers.map(t=>{const {previous:a,next:b,walk,gap}=t;const route='https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(a.venue+' '+venueLocations[a.venue][2]+' Brighton')+'&destination='+encodeURIComponent(b.venue+' '+venueLocations[b.venue][2]+' Brighton')+'&travelmode=walking';return `<article class="schedule-transfer ${t.short?'transfer-short':''}"><div><strong>${esc(a.name)} → ${esc(b.name)}</strong><p>${esc(a.venue)} → ${esc(b.venue)}</p><p>${gap<0?`⚠ Sets overlap by ${-gap} min`:t.missing?'Walking estimate unavailable':gap<walk?`⚠ ${gap} min gap · allow about ${walk} min walking · ${walk-gap} min short`:`${gap} min gap · ${walk===0?'same venue':`about ${walk} min walking`} · ${gap-walk} min spare`}</p></div><div class="transfer-time"><b>${walk===null?'—':walk===0?'Stay here':`~${walk} min`}</b>${a.venue!==b.venue?`<a href="${route}" target="_blank" rel="noopener">Walking route ↗</a>`:''}</div></article>`;}).join(''):'<p class="schedule-help">Select at least two timed sets to see the gaps and walks between them.</p>'}</section><button class="outline" data-mode="venues">＋ Choose more bands</button></section>`;
}
