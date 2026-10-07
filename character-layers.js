/* V4.3 read-only visual derivation. No RNG, persistence, rules or item definitions. */
(function(g){'use strict';
const R=g.GuildRules,P=g.GuildProgression;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=s=>{let n=2166136261;for(const c of String(s))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
const classes=['class.warrior','class.rogue','class.mage','class.priest'];
const palettes=[['#647a87','#4e6378','#737d67','#76595a'],['#59724d','#536b72','#82643e','#6c536b'],['#655784','#3e7083','#805477','#515f90'],['#e4d7ac','#cedbcc','#dcd0e3','#d4dfe7']];
function identity(a){const cls=a.cls||a.def,index=Math.max(0,classes.indexOf(cls)),pick=(key,n)=>hash(a.id+':'+key)%n;return{id:a.id,cls,index,hue:0,build:[1.06,.93,.98,.97][index]+pick('build',5)*.015,phase:pick('phase',23)/10,accessory:pick('accessory',3),hair:pick('hair',4),hairColor:['#38291f','#a25a32','#d6bd79','#b3b7b7'][pick('hair-color',4)],tone:pick('tone',3),cloth:palettes[index][pick('cloth',4)]};}
const levelMark=a=>Math.max(0,Math.min(3,Math.floor(((a.level||1)-1)/3)));
function equipment(a){return Object.fromEntries(R.slots.map(slot=>{const e=a.gear?.[slot],it=e?R.item(e.def):null;return[slot,{def:e?.def||'',rarity:it?.rarity??-1}];}));}
const path=(d,fill,stroke='#435052',width=.7)=>`<path d="${d}" fill="${fill}" fill-opacity=".74" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;
const svg=(body,view='0 0 100 200')=>`<svg viewBox="${view}" fill="none" aria-hidden="true" focusable="false">${body}</svg>`;
const colors=(v,r)=>({cloth:v.cloth,metal:['#85857a','#bec9c2','#d9e3ed'][r],trim:['#aba18a','#91c29c','#9ddcfa'][r],dark:['#434b4d','#3c6061','#344b70'][r],gem:['#807563','#92ccab','#8cddff'][r]});
function upper(v,r,view){const c=colors(v,r),rear=view===2,side=view===1;let body='';
 if(v.index===0){body=path(side?'M38 54L60 49 72 64 70 91 40 97 31 75Z':'M26 55L53 46 76 57 79 91 33 100 21 73Z',c.dark)+path(side?'M41 59L59 55 67 66 63 85 42 91Z':'M32 61L51 54 69 64 68 85 36 93Z',c.metal);body+=path('M18 53L31 44 42 51 37 67 17 64Z',c.metal)+path('M65 49L79 55 85 70 68 66Z',c.metal);}
 else if(v.index===1){body=path('M35 55L61 51 73 66 66 90 38 101 27 78Z',c.cloth)+path('M34 57L41 54 69 87 64 95Z','#65503e')+path('M27 50L39 46 43 59 27 69 19 64Z',c.dark);}
 else{body=path(v.index===2?'M24 48L47 43 72 52 82 73 59 69 51 88 20 72Z':'M25 50L46 43 67 49 82 71 66 77 49 62 34 79 17 72Z',c.cloth)+path('M36 64L46 67 41 110 30 115Z',c.dark)+path('M57 65L65 63 73 109 62 107Z',c.dark);}
 body+=path('M32 93L70 86 73 94 34 102Z','#63533f')+path('M48 91L57 89 59 97 49 99Z',c.trim);
 if(r>0)body+=path(v.index===0?'M25 57L30 53 37 56M37 74L53 80 65 73':'M26 55L45 49 70 59M37 78L43 71M60 76L65 80','none',c.trim,1.8);
 if(r===2){body+=path(rear?'M49 63L54 70 49 79 44 70Z':'M51 57L56 64 51 72 46 64Z',c.gem,c.trim,1.3);body+=path('M16 58L18 50 27 45 26 54Z',c.metal,c.trim);}
 return svg(`<g transform="${side?'translate(8 0) scale(.86 1)':'translate(0 0)'}">${body}</g>`);
}
function legs(v,r,view){const c=colors(v,r),side=view===1;let body='';
 if(v.index<2){body=path('M31 112L45 115 42 151 34 171 21 168 27 143Z',v.index===0?c.metal:c.cloth)+path('M57 110L70 108 77 142 76 164 63 164 63 138Z',v.index===0?c.metal:c.cloth)+path('M22 157L36 159 34 182 23 186 16 184Z',c.dark)+path('M64 152L77 153 79 178 90 183 88 188 64 183Z',c.dark);
 if(r>0)body+=path('M23 159L35 162M64 156L76 158M29 131L40 131M64 129L73 128','none',c.trim,2);
 if(r===2)body+=path('M31 125L39 135 33 144 27 134Z',c.trim)+path('M67 123L75 133 69 141 63 132Z',c.trim);
 }else{body=path('M31 112L67 106 79 156 83 179 54 189 18 180 23 152Z',c.cloth)+path('M46 113L53 112 51 181 32 178Z',c.dark)+path('M60 112L68 111 75 174 62 180Z',c.dark);body+=path('M20 174L52 182 81 173 83 180 54 190 18 181Z',r?c.trim:'#918979');if(r>0)body+=path('M32 121L27 167M65 121L74 164','none',c.trim,1.5);if(r===2)body+=path(v.index===2?'M53 151L59 163 54 175 48 163Z':'M54 151L58 160 66 164 58 168 54 178 50 168 42 164 50 160Z',c.gem,c.trim);}
 return svg(`<g transform="${side?'translate(10 0) scale(.84 1)':'translate(0 0)'}">${body}</g>`);
}
function weapon(kind,r){const c=colors({cloth:'#777'},r);let b='';
 if(kind==='sword'||kind==='dagger'){const short=kind==='dagger',tip=short?46:4;b=path(`M20 112L${r===2?13:16} ${tip+22} 21 ${tip} ${r===2?29:25} ${tip+22} 25 111Z`,c.metal)+path(`M21 ${tip+14}L22 106`,'none',r?c.trim:'#b6b5a2',1.4)+path(r===2?'M8 107L14 112 31 110 36 103 35 117 9 120Z':'M11 110L32 107 34 114 12 118Z',c.trim)+path('M18 118L26 117 27 145 21 147Z','#70513c');}
 else if(kind==='staff'){b=path('M19 49L25 48 25 190 21 190Z','#805a3d')+path(r===0?'M21 53L11 33 17 20 28 21 34 34 26 51Z':r===1?'M20 53L9 38 11 22 21 12 35 26 32 43 25 53Z':'M20 54L8 43 5 27 14 11 21 3 33 17 40 32 34 47 25 55Z',c.dark,c.trim,2)+path(r===0?'M18 27L27 26 29 36 22 44 15 36Z':'M21 17L31 32 23 46 14 34Z',c.gem);if(r===2)b+=path('M21 12L24 26M13 33L19 34','none','#e0f6ff',1.7);}
 else if(kind==='mace'){b=path('M19 69L25 68 26 145 21 147Z','#805a3d')+path(r===0?'M12 36L30 33 35 54 29 70 13 68 7 54Z':r===1?'M19 24L25 25 37 45 33 66 24 76 11 69 6 49Z':'M20 14L28 27 38 33 35 50 41 57 30 76 13 73 3 57 10 47 7 32 17 27Z',c.metal,c.trim,1.7)+path('M21 33L26 50 23 66 18 50Z',r===2?c.gem:c.dark);}
 if(r>0)b+=path('M18 122L26 121M19 129L26 128','none',c.trim,2);
 if(r===2&&kind!=='staff')b+=path('M22 108L26 113 23 118 19 114Z',c.gem,c.trim);
 return svg(b,'0 0 46 200');
}
function head(v,view){const rear=view===2,h=v.hairColor,c=v.cloth;let b='';
 // The atlas supplies the face; these silhouettes, hair caps and clasps remain tied to the ID.
 const hair=[rear?'M41 12Q41 0 60 3L72 12 72 25 65 20 61 14 46 25Z':'M42 12Q44 0 61 3L73 12 66 16 62 9 50 20 41 24Z',rear?'M40 19Q34 1 55 1L67 6 76 17 72 35 63 27 43 34Z':'M40 17Q38 2 55 1L67 7 72 15 61 10 52 14 47 29 38 27Z',rear?'M41 15L40 5 50 8 54 0 59 8 69 4 67 11 76 18 68 24Z':'M43 13L42 4 50 8 55 0 59 8 69 4 65 12 73 14 66 19 59 12 48 22Z',rear?'M40 13Q44 1 60 3L74 17 68 29 76 42 68 45 62 29 40 24Z':'M42 13Q42 2 59 3L69 8 70 14 59 12 52 18 49 36 40 33Z'][v.hair];
 b+=path(hair,h,'#302a27',.8);
 if(v.index===1)b+=path('M35 34L32 19 39 5 56 0 73 12 76 20 67 13 54 8 41 18 43 35Z',c,'#353e2f',.9);
 if(v.accessory===0)b+=path('M41 20L49 15 63 12 67 15 51 19 43 24Z','#c7ae73','#675641',.65);
 if(v.accessory===1)b+=path('M38 24L43 20 45 38 36 44Z',c,'#253036',.75);
 if(v.accessory===2)b+=path('M37 51L42 47 47 53 42 58Z','#c8b179','#4c4a3b',.8);
 b+=path('M45 12Q52 6 61 10M43 19L49 13','none',h,1.4);
 return svg(`<g transform="translate(${v.index===3?-8:0} ${[10,14,9,14][v.index]})">${b}</g>`);
}
function layers(a,v,view=0){const eq=equipment(a),kind=eq.Weapon.def.includes('staff')?'staff':eq.Weapon.def.includes('mace')?'mace':eq.Weapon.def.includes('dagger')?'dagger':eq.Weapon.def?'sword':'empty';
 const part=(slot,kindName,art)=>`<span class="equipment-layer ${kindName} rarity-${eq[slot].rarity}" data-layer="${slot}" data-visual-equipment="${esc(eq[slot].def)}" data-rarity="${eq[slot].rarity}">${eq[slot].def?art():''}</span>`;
 return part('Legs','legs-layer',()=>legs(v,eq.Legs.rarity,view))+part('UpperBody','upper-layer',()=>upper(v,eq.UpperBody.rarity,view))+`<span class="identity-layer" data-hair="${v.hair}" data-tone="${v.tone}">${head(v,view)}</span>`+part('Weapon','weapon-layer weapon-'+kind+'-layer',()=>weapon(kind,eq.Weapon.rarity))+`<span class="v43-rank rank-${levelMark(a)}" aria-hidden="true">${'◆'.repeat(levelMark(a))}</span>`;
}
// Reports actual changes only. Per-slot deltas isolate equipment from simultaneous level gains.
function changes(before,after){if(!P)return[];const out=[];for(const a of after.members){const old=before.members.find(b=>b.id===a.id);if(!old)continue;const gear={...old.gear};for(const slot of R.slots){const prev=old.gear[slot]||null,next=a.gear[slot]||null;if(prev?.instance===next?.instance)continue;const from=prev?R.item(prev.def):null,to=next?R.item(next.def):null,beforePower=P.power(a,gear),oldSuitability=P.suitability(a,from),suitability=P.suitability(a,to);gear[slot]=next;const afterPower=P.power(a,gear);out.push({member:a.id,name:a.name,slot,from:prev,to:next,before:beforePower,after:afterPower,delta:afterPower-beforePower,oldSuitability,suitability,reason:!next?'Ausrüstung zurückgegeben':!prev?'Leerer Slot belegt':suitability>oldSuitability?'Höhere Rolleneignung':suitability===oldSuitability&&to.rarity>from.rarity?'Höhere Rarity bei gleicher Rolleneignung':'Manuelle Auswahl',characterBefore:{...a,gear:{...old.gear}},characterAfter:a});}}return out;}
g.GuildCharacterLayers={identity,equipment,levelMark,layers,changes};if(typeof module!=='undefined')module.exports=g.GuildCharacterLayers;
})(typeof globalThis!=='undefined'?globalThis:window);
