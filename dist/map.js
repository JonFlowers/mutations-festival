// Venue locations checked against festival venue information and OpenStreetMap / Photon.
const venueLocations = {
  'Chalk': [50.8198765,-0.1384385,'13 Pool Valley'],
  'Patterns': [50.8200752,-0.1351138,'10 Marine Parade'],
  'Revenge': [50.8201608,-0.1364027,'32–34 Old Steine (Club Revenge)'],
  'The Hope and Ruin': [50.8247825,-0.1431387,'11–12 Queens Road'],
  'Green Door Store': [50.82877,-0.14012,'Trafalgar Arches, Lower Goods Yard'],
  'The Prince Albert': [50.8284867,-0.1406336,'48 Trafalgar Street'],
  'Dust': [50.819841,-0.1389406,'77 East Street'],
  'Daltons': [50.8190212,-0.1343909,'Madeira Drive, Lower Promenade'],
  'The Folklore Rooms': [50.8240815,-0.1434446,'Above The Quadrant, 12 North Street'],
  'Alphabet': [50.8242198,-0.1450714,'11 Dyke Road']
};
let venueMap=null, mapLoadPromise=null, mapGeneration=0;
function clearVenueMap(){mapGeneration++;if(venueMap){venueMap.remove();venueMap=null;}}
function loadMapLibrary(){
 if(window.L)return Promise.resolve();
 if(!mapLoadPromise)mapLoadPromise=new Promise((resolve,reject)=>{
  const link=document.createElement('link');link.rel='stylesheet';link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(link);
  const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.onload=resolve;script.onerror=()=>{script.remove();mapLoadPromise=null;reject(new Error('Map unavailable'));};document.head.appendChild(script);
 });
 return mapLoadPromise;
}
function renderVenueMap(items){
 const shown=venues.filter(v=>items.some(a=>a.venue===v[0]));
 const generation=mapGeneration;
 $('#results').innerHTML=`<section class="venue-map-view"><div class="map-toolbar"><p>Tap a numbered marker to explore a venue.</p><button class="outline" id="fitvenues">Show all markers</button></div><div id="venue-map" role="region" aria-label="Interactive map of Brighton festival venues"><p class="map-loading" role="status">Loading Brighton venue map…</p></div><p class="map-note" id="map-status">Locations are approximate; use Directions for the venue entrance. <a href="https://mutationsfestival.com/venues" target="_blank" rel="noopener">Festival venue guide ↗</a></p><div class="map-venue-list">${shown.map(v=>{
  const name=v[0],n=venues.indexOf(v)+1,address=venueLocations[name][2];
  return `<article class="map-venue"><span class="map-number">${n}</span><div><h3>${esc(name)}</h3><p>${esc(address)} · ${items.filter(a=>a.venue===name).length} matching sets</p><div class="links"><button class="map-schedule" data-map-schedule="${esc(name)}">See schedule →</button><a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(name+' '+address+' Brighton')}&travelmode=walking" target="_blank" rel="noopener">Walking directions ↗</a></div></div></article>`;
 }).join('')}</div></section>`;
 loadMapLibrary().then(()=>{
  if(mode!=='map'||generation!==mapGeneration||!$('#venue-map'))return;
  const L=window.L;$('#venue-map').innerHTML='';
  venueMap=L.map('venue-map',{scrollWheelZoom:false}).setView([50.824,-0.14],15);
  const tile=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(venueMap);
  tile.on('tileerror',()=>{if($('#map-status'))$('#map-status').textContent='Street tiles could not load. Venue markers and the address list are still available; use Directions for navigation.';});
  const bounds=[];
  shown.forEach(v=>{const name=v[0],[lat,lng,address]=venueLocations[name],n=venues.indexOf(v)+1;bounds.push([lat,lng]);
   const icon=L.divIcon({className:'festival-map-pin',html:`<span>${n}</span>`,iconSize:[34,34],iconAnchor:[17,34],popupAnchor:[0,-30]});
   L.marker([lat,lng],{icon,title:name,alt:name,keyboard:true}).addTo(venueMap).bindPopup(`<div class="map-popup"><h3>${esc(name)}</h3><p>${esc(address)}</p><button class="map-schedule" data-map-schedule="${esc(name)}">See Saturday schedule →</button><p><a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(name+' '+address+' Brighton')}&travelmode=walking" target="_blank" rel="noopener">Walking directions ↗</a></p></div>`).bindTooltip(name,{direction:'top',offset:[0,-30]});
  });
  const fit=()=>{if(venueMap)venueMap.fitBounds(bounds,{padding:[35,35],maxZoom:17});};fit();$('#fitvenues').onclick=fit;
 }).catch(()=>{if(mode==='map'&&generation===mapGeneration&&$('#venue-map'))$('#venue-map').innerHTML='<p class="map-loading" role="status">The interactive map could not load. Use the venue addresses and walking directions below.</p>';});
}
document.addEventListener('click',event=>{const b=event.target.closest('[data-map-schedule]');if(b){venue=b.dataset.mapSchedule;mode='venues';render();$('.content').scrollIntoView({behavior:'smooth',block:'start'});}});
