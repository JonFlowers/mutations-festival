let myScheduleView='timeline';
function buildScheduleStops(items){
 const {timed}=scheduleLayout(items),stops=[];
 timed.forEach(a=>{let stop=stops[stops.length-1];if(!stop||stop.venue!==a.venue){stop={number:stops.length+1,venue:a.venue,sets:[]};stops.push(stop);}stop.sets.push(a);});
 return stops;
}
function routeLeg(from,to){
 const previous=from.sets[from.sets.length-1],next=to.sets[0],walk=walkingMinutes(from.venue,to.venue),gap=minute(next.start)-minute(previous.end);
 const url='https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(from.venue+' '+venueLocations[from.venue][2]+' Brighton')+'&destination='+encodeURIComponent(to.venue+' '+venueLocations[to.venue][2]+' Brighton')+'&travelmode=walking';
 return {walk,gap,url,short:gap<0||(walk!==null&&gap<walk)};
}
function routeSet(a){const overlap=clashes(a);const listening=a.name==='Beastie Boys Club Night'?'Beastie Boys':a.name==='Mike D 5D'?'Mike D':a.name;return `<div class="route-set"><strong>${scheduleClock(minute(a.start))}–${scheduleClock(minute(a.end))}</strong><span>${esc(a.name)}</span><a href="https://open.spotify.com/search/${encodeURIComponent(listening)}" target="_blank" rel="noopener" aria-label="Find ${esc(listening)} on Spotify">Spotify ↗</a>${overlap.length?`<span class="has-clash">Clashes with ${esc(overlap.map(b=>b.name).join(', '))}</span>`:''}</div>`;}
function renderScheduleRoute(items){
 const stops=buildScheduleStops(items),generation=mapGeneration;
 const legs=stops.slice(1).map((s,i)=>routeLeg(stops[i],s));
 const total=legs.reduce((sum,l)=>sum+(l.walk||0),0);
 $('#results').innerHTML=`<section class="my-route"><div class="schedule-summary"><div><b>${stops.length}</b> stops</div><div><b>${new Set(stops.map(s=>s.venue)).size}</b> venues</div><div><b>~${total}</b> min walking</div><div class="${legs.some(l=>l.short)?'has-clash':''}"><b>${legs.filter(l=>l.short).length}</b> tight transfers</div></div><p class="schedule-help">${esc(activeSchedule().name)} · ${festivalDays[selectedDay].name} ${festivalDays[selectedDay].date} October. Stops follow set start times, including return visits to a venue. Walking totals are estimates. Clashing sets are alternatives, not a feasible full-set route.</p>${stops.length?`<div class="map-toolbar"><p>Tap a venue to see all your bands and times there.</p><button class="outline" id="fit-schedule-route">Fit full route</button></div><div id="schedule-route-map" role="region" aria-label="Map of your selected festival route"><p class="map-loading" role="status">Loading your route…</p></div><p class="map-note" id="schedule-route-status">Dashed lines show the order of stops, not walkable street routes. Use each Walking route link for directions. Red connections indicate overlapping sets or insufficient walking time.</p><ol class="route-stops">${stops.map((stop,i)=>{const [lat,lng,address]=venueLocations[stop.venue],leg=legs[i];return `<li><article class="route-stop"><div class="route-stop-heading"><span class="map-number">${stop.number}</span><div><h3>${esc(stop.venue)}</h3><p>${esc(address)}</p></div><button class="outline" data-route-stop="${stop.number}">On map</button></div>${stop.sets.map(routeSet).join('')}</article>${leg?`<div class="route-connection ${leg.short?'route-connection-short':''}"><strong>↓ ~${leg.walk} min walk to stop ${stop.number+1}</strong><span>${leg.gap<0?`⚠ Sets overlap by ${-leg.gap} min`:leg.gap<leg.walk?`⚠ ${leg.walk-leg.gap} min short · ${leg.gap} min gap`:`${leg.gap} min gap · ${leg.gap-leg.walk} min spare`}</span><a href="${leg.url}" target="_blank" rel="noopener">Walking route ↗</a></div>`:''}</li>`;}).join('')}</ol>`:'<p class="schedule-help">Select timed sets to plot a route.</p>'}</section>`;
 if(!stops.length)return;
 const byVenue=new Map();stops.forEach(stop=>{if(!byVenue.has(stop.venue))byVenue.set(stop.venue,[]);byVenue.get(stop.venue).push(stop);});
 loadMapLibrary().then(()=>{
  if(mode!=='saved'||myScheduleView!=='map'||generation!==mapGeneration||!$('#schedule-route-map'))return;
  const L=window.L;$('#schedule-route-map').innerHTML='';venueMap=L.map('schedule-route-map',{scrollWheelZoom:false});
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(venueMap);
  tiles.on('tileerror',()=>{if($('#schedule-route-status'))$('#schedule-route-status').textContent='Street tiles could not load. The ordered stops below and walking links remain available. Dashed connections are schematic.';});
  stops.slice(1).forEach((stop,i)=>L.polyline([venueLocations[stops[i].venue].slice(0,2),venueLocations[stop.venue].slice(0,2)],{color:legs[i].short?'#b7472e':'#536d25',weight:4,dashArray:'8 7',opacity:.8}).addTo(venueMap));
  const markers=new Map();byVenue.forEach((visits,name)=>{
   const coordinates=venueLocations[name].slice(0,2),numbers=visits.map(s=>s.number).join(', ');
   const icon=L.divIcon({className:'festival-map-pin route-pin',html:`<span>${numbers}</span>`,iconSize:[44,36],iconAnchor:[22,36]});
   const marker=L.marker(coordinates,{icon,title:`${name}, stops ${numbers}`,alt:name,keyboard:true}).addTo(venueMap).bindPopup(`<div class="map-popup"><h3>${esc(name)}</h3><p>Stops ${numbers} · ${esc(venueLocations[name][2])}</p>${visits.map(s=>`<h4>Stop ${s.number}</h4>${s.sets.map(routeSet).join('')}`).join('')}</div>`);
   visits.forEach(s=>markers.set(s.number,marker));
  });
  const fit=()=>venueMap?.fitBounds(stops.map(s=>venueLocations[s.venue].slice(0,2)),{padding:[35,35],maxZoom:17});fit();$('#fit-schedule-route').onclick=fit;
  document.querySelectorAll('[data-route-stop]').forEach(button=>{button.onclick=()=>{const stop=stops[Number(button.dataset.routeStop)-1];venueMap.setView(venueLocations[stop.venue].slice(0,2),17);markers.get(stop.number).openPopup();$('#schedule-route-map').scrollIntoView({behavior:'smooth',block:'center'});};});
 }).catch(()=>{if(generation===mapGeneration&&$('#schedule-route-map'))$('#schedule-route-map').innerHTML='<p class="map-loading" role="status">The map could not load. Your complete ordered route, bands and walking links are available below.</p>';});
}
document.addEventListener('click',event=>{const button=event.target.closest('[data-schedule-view]');if(button){myScheduleView=button.dataset.scheduleView;render();}});
