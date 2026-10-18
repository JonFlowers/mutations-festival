// Final stage times from https://mutationsfestival.com/schedule and its full-size Friday/Saturday timetable images.
const saturdayVenues = [
['Chalk','Pool Valley','Live music by the seafront',[
['15:20','16:00','SNAYX','A Brighton punk trio with distorted bass, sharp hooks and explosive energy.'],
['16:25','17:05','Plantoid','Brighton progressive rock blending psychedelic textures, jazz and heavy riffs.'],
['17:35','18:25','TTSSFU','Dreamy, hazy shoegaze with intimate vocals and layers of guitar.'],
['19:00','19:50','Dove Ellis','Irish singer-songwriter making emotionally charged, expansive chamber pop.'],
['20:30','22:00','Mike D 5D','Beastie Boys co-founder Mike D brings his 5D project to Brighton.'],
['22:30','00:00','DJ Food','Ninja Tune-associated electronic music project, steeped in samples and musical exploration.'],
['00:00','02:00','UNKLE Sounds','James Lavelle’s project brings together hip-hop, electronic music and alternative rock.']]],
['Patterns','Marine Parade','A basement by the sea',[
['16:25','17:05','Benchwarmer','Discover this festival act through the artist profile and Spotify search below.'],
['17:35','18:20','Iguana Death Cult','Rotterdam garage rock with a restless, psychedelic edge.'],
['18:50','19:50','Murkage Dave','A British singer-songwriter mixing soulful vocals with observations of everyday life.'],
['20:30','21:45','Alex Cameron','Australian songwriter pairing character-led storytelling with synth pop and soft rock.']]],
['Revenge','Old Steine','An iconic Brighton club',[
['16:20','16:55','Post Common','Discover this festival act through the artist profile and Spotify search below.'],
['17:20','18:00','Hammok','Norwegian trio working at the noisy intersection of hardcore and experimental rock.'],
['18:30','19:15','ME REX','Indie rock with intricate lyrics, bright piano and interlocking melodies.'],
['19:45','20:35','Pulled Apart By Horses','Leeds rock band known for muscular riffs and ferocious live shows.'],
['21:15','22:15','Panic Shack','Cardiff punk band with irreverent lyrics, big hooks and collective energy.']]],
['The Hope and Ruin','Queens Road','A home for independent music',[
['13:30','14:00','Kitchen Lover','Discover this festival act through the artist profile and Spotify search below.'],
['14:30','15:00','Mleko','Discover this festival act through the artist profile and Spotify search below.'],
['15:30','16:00','Esmeralda Road','Discover this festival act through the artist profile and Spotify search below.'],
['18:30','19:10','Any Young Mechanic','Discover this festival act through the artist profile and Spotify search below.'],
['19:40','20:20','Why Horses?','Discover this festival act through the artist profile and Spotify search below.'],
['21:00','22:00','Tara Clerkin Trio','Bristol trio drawing on electronic experimentation, jazz and quietly unusual songwriting.'],
['22:30','23:10','Painkiller','Discover this festival act through the artist profile and Spotify search below.'],
['23:40','00:20','Alien Chicks','South London trio combining wiry punk, rhythmic shifts and restless experimentation.'],
['00:50','01:30','Cowboy Hunters','Discover this festival act through the artist profile and Spotify search below.']]],
['Green Door Store','Trafalgar Arches','Under the railway arches',[
['13:10','13:40','Sunday Mourners','Discover this festival act through the artist profile and Spotify search below.'],
['14:00','14:30','Really Good Time','Dublin rock band combining big riffs with a playful, experimental streak.'],
['15:00','15:30','Ben Kidson','Discover this festival act through the artist profile and Spotify search below.'],
['16:00','16:30','Casual Smart','Discover this festival act through the artist profile and Spotify search below.'],
['18:15','18:45','Speedial','Discover this festival act through the artist profile and Spotify search below.'],
['19:10','19:40','Hank','Discover this festival act through the artist profile and Spotify search below.'],
['20:05','20:45','The Healing Power of Horses','Discover this festival act through the artist profile and Spotify search below.'],
['21:20','22:10','The Wave Pictures','British indie rock trio with conversational songwriting and fluid guitar playing.']]],
['The Prince Albert','Trafalgar Street','A Brighton institution',[
['13:30','14:00','Jo From School','Discover this festival act through the artist profile and Spotify search below.'],
['14:30','15:00','Warhaus','Maarten Devoldere’s project mixes smoky vocals with cinematic, atmospheric songwriting.'],
['15:30','16:00','Big Long Sun','Discover this festival act through the artist profile and Spotify search below.'],
['19:50','20:20','Alice Costelloe','British songwriter making melodic indie pop with an intimate, reflective feel.'],
['20:50','21:30','Hannah Frances','Singer-songwriter and guitarist exploring the meeting point of folk and progressive composition.'],
['22:00','22:50','Liz Lawrence','British singer-songwriter and multi-instrumentalist making melodic alternative pop.']]],
['Dust','East Street','Intimate basement discoveries',[
['13:30','14:00','Big Red','Discover this festival act through the artist profile and Spotify search below.'],
['14:30','15:00','Ain’t','Discover this festival act through the artist profile and Spotify search below.'],
['15:30','16:00','Little Grandad','Discover this festival act through the artist profile and Spotify search below.'],
['19:45','20:15','Florentenes','Discover this festival act through the artist profile and Spotify search below.'],
['20:40','21:20','Walt Disco','Glasgow band bringing theatrical vocals and art pop colour to post-punk.'],
['21:50','22:35','The North','British indie act with a melody-led guitar sound.']]],
['Daltons','Madeira Drive','Music on the beach',[
['19:50','20:30','Night Swimming','Discover this festival act through the artist profile and Spotify search below.'],
['21:00','21:45','Ninush','Discover this festival act through the artist profile and Spotify search below.'],
['22:15','02:00','Beastie Boys Club Night','A club night celebrating the music of Beastie Boys. Not a live Beastie Boys performance.']]],
['The Folklore Rooms','North Street','Small room, close listening',[
['13:10','13:40','Kelly No Brakes','Discover this festival act through the artist profile and Spotify search below.'],
['14:00','14:30','Foot Foot','Discover this festival act through the artist profile and Spotify search below.'],
['15:00','15:30','Georgia Mooney','Australian singer-songwriter and member of All Our Exes Live in Texas.'],
['16:00','16:30','Tasha','Discover this festival act through the artist profile and Spotify search below.']]],
['Alphabet','Dyke Road','Your next favourite discovery',[
['13:10','13:40','Josephine Illingworth','Discover this festival act through the artist profile and Spotify search below.'],
['14:00','14:30','Plantoid','Brighton progressive rock blending psychedelic textures, jazz and heavy riffs.'],
['15:00','15:30','Speedial','Discover this festival act through the artist profile and Spotify search below.'],
['16:00','16:30','Deary','London dream pop duo weaving ethereal vocals through shimmering guitars.']]]
];

const fridaySets = {"Chalk": [["15:45", "16:25", "Theatre", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["16:55", "17:35", "Silver Gore", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["18:05", "18:50", "Basht.", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["19:20", "20:20", "Squid", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["21:00", "22:20", "Fat Dog", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["22:55", "23:55", "Working Men’s Club", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["00:40", "01:25", "Scaler", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["01:50", "02:30", "Silverwingkiller", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."]], "Patterns": [["15:30", "16:00", "Mouth Ulcers", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["16:25", "17:00", "Uche Yara", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["17:30", "18:05", "World News", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["18:35", "19:15", "MORN", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["19:45", "20:30", "bed", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["21:00", "22:00", "GB", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."]], "Revenge": [["15:55", "16:40", "Hutch", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["17:10", "17:55", "Modern Woman", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["18:25", "19:10", "Death Valley Girls", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["19:40", "20:25", "Lip Critic", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["21:00", "22:10", "Bdrmm", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."]], "The Hope and Ruin": [["18:10", "18:40", "Divebar Youth", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["19:05", "19:35", "Tanzana", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["20:00", "20:35", "Marsy", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["21:05", "22:00", "The Besnard Lakes", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["22:30", "23:10", "Opal Mag", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["23:40", "00:20", "The Itch", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["00:50", "01:30", "Humane", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."]], "Green Door Store": [["19:15", "19:45", "Cyn Cwsg", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["20:15", "20:45", "Maximilian", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["21:15", "22:15", "Jeffrey Lewis & The Voltage", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."]], "The Prince Albert": [["19:45", "20:15", "The Mink", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["20:40", "21:10", "The Stanford Family Band", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["21:35", "22:05", "Oral Habit", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["22:30", "23:00", "Zo Lief", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."]], "Dust": [["18:20", "18:50", "Paper Hats", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["19:15", "19:45", "Max Winter", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["20:15", "20:55", "Holybones", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["21:25", "22:15", "Lauren Auder", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."]], "Daltons": [["20:30", "21:15", "M. Woodroe", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["21:45", "22:30", "Divorce Attorney", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["23:00", "23:45", "O.", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."], ["00:15", "01:00", "Die Twice", "Performing on Friday at Mutations Festival. Explore the artist through the festival lineup and Spotify links below."]]};
const venues = saturdayVenues;
const fridayVenues = venues.map(([name,street,note])=>[name,street,note,fridaySets[name]||[]]);
const pending = [];
const festivalDays = {friday:{name:"Friday",date:"23",after:"SAT 24 OCT",start:900,end:1620,wristband:"14:00",doors:"15:00"},saturday:{name:"Saturday",date:"24",after:"SUN 25 OCT",start:780,end:1560,wristband:"12:00",doors:"13:00"}};
