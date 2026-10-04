/* Standalone JavaScript port for the Browser Playtest. No Unity files are modified. */
(function (g) {
'use strict';
const enc=new TextEncoder(),cmp=(a,b)=>a<b?-1:a>b?1:0,clone=x=>JSON.parse(JSON.stringify(x));
function sha(bytes){
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const n=Math.ceil((bytes.length+9)/64)*64,b=new Uint8Array(n);b.set(bytes);b[bytes.length]=128;
 const v=new DataView(b.buffer);v.setUint32(n-8,Math.floor(bytes.length/536870912));v.setUint32(n-4,(bytes.length*8)>>>0);
 const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),ro=(x,n)=>(x>>>n)|(x<<(32-n));
 for(let o=0;o<n;o+=64){for(let i=0;i<16;i++)w[i]=v.getUint32(o+4*i);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(ro(x,7)^ro(x,18)^(x>>>3))+w[i-7]+(ro(y,17)^ro(y,19)^(y>>>10)))>>>0;}
 let [a,c,d,e,f,j,k,l]=h;for(let i=0;i<64;i++){let t=(l+(ro(f,6)^ro(f,11)^ro(f,25))+((f&j)^(~f&k))+K[i]+w[i])>>>0,u=((ro(a,2)^ro(a,13)^ro(a,22))+((a&c)^(a&d)^(c&d)))>>>0;l=k;k=j;j=f;f=(e+t)>>>0;e=d;d=c;c=a;a=(t+u)>>>0;}[a,c,d,e,f,j,k,l].forEach((x,i)=>h[i]=(h[i]+x)>>>0);}
 return h.map(x=>x.toString(16).padStart(8,'0')).join('');
}
function hash(...fields){const a=[];for(const f of fields){const b=enc.encode(String(f??'')),n=b.length;a.push(n>>>24,(n>>>16)&255,(n>>>8)&255,n&255,...b);}return sha(new Uint8Array(a));}
const classes={
 'class.warrior':{name:'Krieger',role:'Tank / Damage',roles:3,hp:60,mana:0,attack:8,defense:3,crit:1000,front:true,cd:8,color:'#c09150',icon:'♜'},
 'class.rogue':{name:'Schurke',role:'Damage',roles:2,hp:40,mana:0,attack:10,defense:1,crit:2000,front:true,cd:8,color:'#74a786',icon:'◆'},
 'class.mage':{name:'Magier',role:'Damage / Support',roles:10,hp:36,mana:24,attack:9,defense:1,crit:1000,front:false,cd:8,color:'#8c99d4',icon:'✦'},
 'class.priest':{name:'Priester',role:'Healing / Support',roles:12,hp:42,mana:24,attack:5,defense:1,crit:1000,front:false,cd:8,color:'#dfca87',icon:'✚'}
};
const profiles={...classes,
 'enemy.goblin.melee':{name:'Goblin-Nahkämpfer',roles:0,hp:24,mana:0,attack:6,defense:1,crit:1000,front:true,cd:8},
 'enemy.goblin.ranged':{name:'Goblin-Fernkämpfer',roles:0,hp:18,mana:0,attack:5,defense:0,crit:1000,front:false,cd:8},
 'enemy.goblin.brute':{name:'Goblin-Brutalo',roles:0,hp:48,mana:0,attack:9,defense:2,crit:1000,front:true,cd:12},
 'enemy.goblin.boss':{name:'Goblin-Boss',roles:0,hp:96,mana:0,attack:11,defense:3,crit:1000,front:true,cd:12}};
const thresholds=[0,30,70,120,180,250,330,420,520,630],slots=['Weapon','UpperBody','Legs'];
const names=['Arel','Bera','Corin','Daria','Elian','Fara','Joren','Mira'];
// Seeded System.Random compatibility algorithm for the original fixed positive recruitment seed.
function random(seed){let ar=new Array(56).fill(0),mj=161803398-Math.abs(seed),mk=1;ar[55]=mj;
 for(let i=1;i<55;i++){let ii=(21*i)%55;ar[ii]=mk;mk=mj-mk;if(mk<0)mk+=2147483647;mj=ar[ii];}
 for(let k=1;k<5;k++)for(let i=1;i<56;i++){ar[i]-=ar[1+(i+30)%55];if(ar[i]<0)ar[i]+=2147483647;}
 let a=0,b=21;return max=>{if(++a>=56)a=1;if(++b>=56)b=1;let r=ar[a]-ar[b];if(r===2147483647)r--;if(r<0)r+=2147483647;ar[a]=r;return Math.floor(r/2147483647*max);};}
function candidates(seed=7){let rand=random(seed),keys=Object.keys(classes),req=[keys[0],keys[3],keys[1],keys[rand(4)],keys[rand(4)]];
 return req.map((cls,i)=>{const h=sha(enc.encode('playtest.start.v1|candidate|'+i)),bs=h.match(/../g),id=[bs.slice(0,4).reverse().join(''),bs.slice(4,6).reverse().join(''),bs.slice(6,8).reverse().join(''),bs.slice(8,10).join(''),bs.slice(10,16).join('')].join('-');
 const name=names[rand(8)];rand(3);return{id,name,cls,level:1,xp:0,dead:false,recovery:0,leadership:.5,boldness:0,gear:{Weapon:null,UpperBody:null,Legs:null},potion:0};});}
const items=[
 ['item.weapon.training_sword.common','Übungsschwert','Weapon',['class.warrior'],[2,2,0,0]],
 ['item.weapon.training_dagger.common','Übungsdolch','Weapon',['class.rogue'],[0,2,0,0]],
 ['item.weapon.training_staff.common','Übungsstab','Weapon',['class.mage'],[0,2,0,0]],
 ['item.weapon.training_mace.common','Übungsstreitkolben','Weapon',['class.priest'],[0,0,2,2]],
 ['item.armor.training_upper.common','Oberkörperrüstung','UpperBody',Object.keys(classes),[1,1,1,1]],
 ['item.armor.training_legs.common','Beinrüstung','Legs',Object.keys(classes),[1,1,1,1]],
 ['item.potion.healing.basic','Heiltrank',null,[],[]]
].map(([id,name,slot,allowed,values])=>({id,name,slot,allowed,values,rarity:slot?0:null})).sort((a,b)=>cmp(a.id,b.id));
const item=id=>items.find(x=>x.id===id),clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),level=xp=>thresholds.filter(x=>x<=xp).length;
const guid=(cat,n)=>`00000000-0000-0000-${String(cat).padStart(4,'0')}-${String(n).padStart(12,'0')}`;
function addOffers(s){['Kräuter am Waldrand','Lieferung zum Außenposten','Goblin-Spuren','Vermisste Reisende'].forEach((name,i)=>s.quests.push({id:guid(2,++s.offerSeq),name,type:i,distance:['Nah','Mittel','Weit','Mittel'][i],status:'Available',duration:60000,size:2,gold:40,xp:60,party:null,participants:[],result:null,paid:false}));}
const recruitmentConfig=Object.freeze({candidateCost:50,refreshCost:25,poolSize:5,guildCapacity:12});
function newPool(s){s.poolSeq++;s.normalPool=candidates(7+s.poolSeq).map((a,i)=>({...a,id:'browser.candidate.'+s.poolSeq+'.'+i}));}
function initial(){let s={normalPool:[],poolSeq:0,retiredMembers:[],candidates:candidates(),recruited:false,members:[],parties:[],quests:[],gold:0,stock:[],potions:0,partySeq:0,offerSeq:0,itemSeq:0};addOffers(s);return s;}
const get=(xs,id)=>{const x=xs.find(a=>a.id===id);if(!x)throw Error('Unbekannte ID');return x;};
const locked=(s,id)=>s.quests.some(q=>['Active','CompletedPendingResolution'].includes(q.status)&&q.participants.includes(id));
const partyLocked=(s,id)=>s.quests.some(q=>['Active','CompletedPendingResolution'].includes(q.status)&&q.party===id);
const available=(a,now)=>!a.dead&&a.recovery<=now;
function checkParty(s,p){if(p.members.length<1||p.members.length>6||new Set(p.members).size!==p.members.length)throw Error('Gruppe benötigt 1–6 eindeutige Mitglieder.');p.members.forEach(id=>get(s.members,id));if(p.leader&&!p.members.includes(p.leader))throw Error('Leiter muss Gruppenmitglied sein.');}
function validate(s){const assigned=new Set(),instances=new Set();for(const p of s.parties){checkParty(s,p);for(const id of p.members){if(assigned.has(id))throw Error('Doppelte Gruppenzugehörigkeit');assigned.add(id);}}
 for(const e of [...s.stock,...s.members.flatMap(a=>Object.values(a.gear).filter(Boolean))]){if(instances.has(e.instance)||!item(e.def))throw Error('Ungültiger Itembestand');instances.add(e.instance);}
 if(s.members.length>12||s.potions<0||s.members.some(a=>a.potion<0||a.potion>1))throw Error('Bestandsgrenze');
 if(s.quests.filter(q=>['Active','CompletedPendingResolution'].includes(q.status)).length>3)throw Error('Questlimit');
 for(const a of s.members)for(const slot of slots){const e=a.gear[slot];if(e&&(!item(e.def).allowed.includes(a.cls)||item(e.def).slot!==slot))throw Error('Inkompatibles Equipment');}return true;}
function equip(s,ids){for(const id of [...ids].sort(cmp)){const a=get(s.members,id);if(a.dead||locked(s,id))throw Error('Mitglied ist gesperrt.');for(const slot of slots){const score=e=>e?item(e.def).values.reduce((sum,v,i)=>sum+((classes[a.cls].roles&(1<<i))?v:0),0):0;
 const quality=(a,b)=>score(a)-score(b)||(a?item(a.def).rarity:-1)-(b?item(b.def).rarity:-1);
 const options=s.stock.filter(e=>item(e.def).slot===slot&&item(e.def).allowed.includes(a.cls)&&quality(e,a.gear[slot])>0).sort((a,b)=>quality(b,a)||cmp(a.def,b.def)||cmp(a.instance,b.instance));
 if(options.length){const best=options[0];s.stock=s.stock.filter(x=>x.instance!==best.instance);if(a.gear[slot])s.stock.push(a.gear[slot]);a.gear[slot]=best;}}}}
function simulate(q,members,leader,forced){const u=forced||((domain)=>Number(BigInt('0x'+hash('7',q.id,'s7.v1',domain).slice(0,16))>>11n)/9007199254740992);
 let roles=members.reduce((r,a)=>r|classes[a.cls].roles,0),power=members.reduce((p,a)=>p+10*(1+.1*(a.level-1)),0)*(1+(roles&1?.08:0)+(roles&4?.08:0)+(roles&2?.04:0));
 const difficulty=10*q.size,ratio=power/difficulty*(1+.05*(2*u('power')-1)),h=clamp((1-ratio)/.5,0,1),l=members.find(a=>a.id===leader)?.leadership||0,bold=members.reduce((s,a)=>s+a.boldness,0)/members.length;
 const pr=clamp(h*(.45+.4*l-.03*bold),0,.9),ps=clamp(.1+.8*ratio,.05,.98),retreat=u('retreat')<pr,success=!retreat&&u('objective')<ps;
 const pk=clamp(.45*(1-ratio),0,.45)*(retreat?.35:1),pi=clamp(.1+.3*(1-ratio),0,.4)*(retreat?.6:1);
 const out=members.map(a=>({id:a.id,incap:u('incapacitation/'+a.id)<pk,stabilized:false}));const targets=out.filter(a=>a.incap),healers=out.filter((a,i)=>!a.incap&&(classes[members[i].cls].roles&4));
 const collapse=targets.length===members.length;for(let i=0;i<Math.min(targets.length,healers.length);i++)targets[i].stabilized=u('stabilization/'+healers[i].id+'/'+targets[i].id)<.65;
 const pd=clamp(.15+.5*h+(collapse?.2:0),0,.9);out.forEach(a=>{a.dead=a.incap&&!a.stabilized&&u('death/'+a.id)<pd;a.injured=!a.dead&&(a.incap||u('injury/'+a.id)<pi);a.seconds=a.injured?Math.ceil(clamp(60+180*h+(a.incap?60:0),60,300)):0;});
 const wipe=out.every(a=>a.dead),factor=wipe?0:success?1:retreat?.35:.2,xp=Math.floor(q.xp*factor/members.length);
 out.forEach(a=>a.xp=a.dead?0:xp);const loot=[];
 if(success&&!wipe)for(const it of items){const qty=it.slot?1:2,key=hash(it.id,String(qty),String(qty))+'/0';if(u('loot/'+key+'/drop')<.35){u('loot/'+key+'/quantity');loot.push({def:it.id,qty});}}
 return{success,retreat,wipe,power,difficulty,ratio,overload:h,members:out,gold:success&&!wipe?q.gold:0,loot};
}
function refresh(s,now){for(const q of s.quests)if(q.status==='Active'&&now>=q.end)q.status='CompletedPendingResolution';}
function change(state,op,args={},now=1000){const s=clone(state);refresh(s,now);
 if(op==='recruit'){if(s.recruited)throw Error('Rekrutierung bereits abgeschlossen');if(args.ids.length!==3||new Set(args.ids).size!==3||s.members.length+3>12)throw Error('Genau drei auswählen.');s.members.push(...args.ids.map(id=>clone(get(s.candidates,id))));s.recruited=true;newPool(s);}
 else if(op==='hire'){if(!s.recruited)throw Error('Zuerst die kostenlose Startrekrutierung abschließen.');if(args.pool!==s.poolSeq)throw Error('Dieser Kandidatenpool wurde bereits ersetzt.');const a=get(s.normalPool,args.candidate);if(s.members.length>=recruitmentConfig.guildCapacity)throw Error('Die Gilde ist voll ('+recruitmentConfig.guildCapacity+'/'+recruitmentConfig.guildCapacity+').');if(s.gold<recruitmentConfig.candidateCost)throw Error('Nicht genug Gold: '+recruitmentConfig.candidateCost+' Gold erforderlich.');if(s.members.some(m=>m.id===a.id))throw Error('Mitglied bereits aufgenommen.');s.gold-=recruitmentConfig.candidateCost;s.members.push(clone(a));s.normalPool=s.normalPool.filter(c=>c.id!==a.id);}
 else if(op==='refreshPool'){if(!s.recruited)throw Error('Zuerst die Startrekrutierung abschließen.');if(args.pool!==s.poolSeq)throw Error('Diese Suche wurde bereits verarbeitet.');if(s.gold<recruitmentConfig.refreshCost)throw Error('Nicht genug Gold: '+recruitmentConfig.refreshCost+' Gold erforderlich.');s.gold-=recruitmentConfig.refreshCost;newPool(s);}
 else if(op==='removeDead'){const a=get(s.members,args.member);if(args.confirmed!==true)throw Error('Endgültige Entfernung muss bestätigt werden.');if(!a.dead)throw Error('Nur verstorbene Mitglieder können entfernt werden.');if(locked(s,a.id))throw Error('Mitglied ist noch auf einer Quest gebunden.');if(s.quests.some(q=>q.status==='Resolved'&&!q.paid&&q.result?.members.some(m=>m.id===a.id)))throw Error('Zuerst alle offenen Questbelohnungen dieses Mitglieds abholen.');for(const slot of slots)if(a.gear[slot])s.stock.push(a.gear[slot]);s.potions+=a.potion;for(const p of s.parties){p.members=p.members.filter(id=>id!==a.id);if(p.leader===a.id)p.leader=null;}s.parties=s.parties.filter(p=>p.members.length);s.retiredMembers.push({id:a.id,name:a.name,cls:a.cls,level:a.level});s.members=s.members.filter(m=>m.id!==a.id);}
 else if(op==='createParty'){const ids=args.ids;if(ids.length<1||ids.length>6)throw Error('1–6 Mitglieder auswählen');for(const id of ids){const a=get(s.members,id);if(a.dead||s.parties.some(p=>p.members.includes(id)))throw Error('Mitglied nicht verfügbar');}s.parties.push({id:guid(1,++s.partySeq),name:'Gruppe '+s.partySeq,members:ids.slice(),leader:null});}
 else if(['leader','clearLeader','remove','add','transfer','dissolve'].includes(op)){const p=get(s.parties,args.party);if(partyLocked(s,p.id))throw Error('Gruppe ist bis zur Auswertung gesperrt.');
 if(op==='dissolve')s.parties=s.parties.filter(x=>x.id!==p.id);
 else if(op==='clearLeader')p.leader=null;
 else{const a=get(s.members,args.member);if(op==='leader'){if(a.dead||!p.members.includes(a.id))throw Error('Ungültiger Leiter');p.leader=a.id;}
 if(op==='remove'||op==='transfer'){if(!p.members.includes(a.id)||p.members.length<=1)throw Error('Letztes Mitglied: Gruppe auflösen.');if(op==='transfer'){const to=get(s.parties,args.to);if(to.id===p.id||partyLocked(s,to.id)||to.members.length>=6||a.dead)throw Error('Zielgruppe nicht verfügbar');to.members.push(a.id);}p.members=p.members.filter(x=>x!==a.id);if(p.leader===a.id)p.leader=null;}
 if(op==='add'){if(a.dead||locked(s,a.id)||p.members.length>=6||s.parties.some(x=>x.members.includes(a.id)))throw Error('Mitglied kann nicht hinzugefügt werden');p.members.push(a.id);}}}
 else if(op==='offers')addOffers(s);
 else if(op==='start'){const q=get(s.quests,args.quest),p=get(s.parties,args.party);checkParty(s,p);if(q.status!=='Available')throw Error('Quest nicht verfügbar');if(s.quests.filter(q=>['Active','CompletedPendingResolution'].includes(q.status)).length>=3)throw Error('Alle drei Questplätze belegt');if(partyLocked(s,p.id))throw Error('Gruppe ist gebunden');const ms=p.members.map(id=>get(s.members,id));if(ms.some(a=>!available(a,now)||locked(s,a.id)))throw Error('Tote, Verletzte oder gebundene Mitglieder sind nicht einsatzfähig');equip(s,p.members);
 const priority=a=>(classes[a.cls].roles&4)?0:a.id===p.leader?1:2;for(const a of ms.sort((a,b)=>priority(a)-priority(b)||cmp(a.id,b.id)))if(!a.potion&&s.potions){a.potion=1;s.potions--;}
 q.status='Active';q.party=p.id;q.participants=p.members.slice();q.start=now;q.end=now+q.duration;}
 else if(op==='resolve'){const q=get(s.quests,args.quest);if(q.status!=='CompletedPendingResolution')throw Error('Quest nicht auswertungsbereit oder bereits ausgewertet');const p=get(s.parties,q.party),ms=q.participants.map(id=>get(s.members,id)).sort((a,b)=>cmp(a.id,b.id));q.result=simulate(q,ms,p.leader,args.random);
 for(const m of q.result.members){const a=get(s.members,m.id);a.dead=a.dead||m.dead;a.recovery=a.dead?0:m.injured?q.end+m.seconds*1000:0;s.potions+=a.potion;a.potion=0;if(a.dead)for(const slot of slots){if(a.gear[slot])s.stock.push(a.gear[slot]);a.gear[slot]=null;}}q.status='Resolved';}
 else if(op==='reward'){const q=get(s.quests,args.quest);if(q.status!=='Resolved'||!q.result)throw Error('Quest zuerst auswerten');if(q.paid)return state;
 for(const m of q.result.members){const a=get(s.members,m.id);a.xp=Math.min(630,a.xp+m.xp);a.level=level(a.xp);}s.gold+=q.result.gold;
 for(const l of q.result.loot){if(!item(l.def))throw Error('Unbekanntes Item');if(!item(l.def).slot)s.potions+=l.qty;else for(let i=0;i<l.qty;i++)s.stock.push({def:l.def,instance:'browser.item.'+String(++s.itemSeq).padStart(8,'0')});}q.paid=true;}
 else if(op==='equip')equip(s,s.members.filter(a=>!a.dead&&!locked(s,a.id)).map(a=>a.id));
 else if(op==='return'){const a=get(s.members,args.member);if(locked(s,a.id))throw Error('Mitglied auf Quest');for(const slot of slots){if(a.gear[slot])s.stock.push(a.gear[slot]);a.gear[slot]=null;}s.potions+=a.potion;a.potion=0;}
 else throw Error('Unbekannte Aktion');
 validate(s);return s;
}
g.GuildRules={recruitmentConfig,hash,sha,enc,cmp,clone,classes,profiles,items,item,slots,thresholds,level,candidates,initial,change,refresh,available,locked,partyLocked,validate,simulate,equip,guid};
if(typeof module!=='undefined')module.exports=g.GuildRules;
})(typeof globalThis!=='undefined'?globalThis:window);
