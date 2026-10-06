/* V4 browser-only management balance. No Combat profile/stat mutations. */
(function(g){'use strict';
const R=g.GuildRules||(typeof require==='function'?require('./rules.js'):null);
const freeze=o=>{Object.values(o).forEach(v=>{if(v&&typeof v==='object')freeze(v);});return Object.freeze(o);};
const config=freeze({version:'browser.progression.v4',power:{hp:1,attack:4,defense:6,perLevel:25,suitability:10},
 guild:[{xp:0,members:6,groups:1,missions:1},{xp:80,members:8,groups:2,missions:2},{xp:240,members:12,groups:3,missions:3},{xp:520,members:16,groups:4,missions:3},{xp:1000,members:20,groups:5,missions:4}],
 tiers:[{id:'easy',name:'Leicht',stars:1,recommended:200,gold:40,xp:60,guildXP:20,duration:60000,drop:.35,rarities:[1,0,0]},
 {id:'medium',name:'Mittel',stars:2,recommended:450,gold:65,xp:100,guildXP:40,duration:75000,drop:.4,rarities:[.7,.28,.02]},
 {id:'hard',name:'Schwer',stars:3,recommended:800,gold:100,xp:160,guildXP:70,duration:90000,drop:.45,rarities:[.4,.5,.1]},
 {id:'elite',name:'Elite',stars:4,recommended:1200,gold:150,xp:240,guildXP:110,duration:120000,drop:.5,rarities:[.2,.55,.25]}],
 risk:[{min:1.5,label:'Deutlich stärker'},{min:1.2,label:'Niedriges Risiko'},{min:.9,label:'Angemessen'},{min:.65,label:'Hohes Risiko'},{min:0,label:'Extremes Risiko'}],
 rarityNames:['Common','Uncommon','Rare'],itemBonus:[0,1,3],sellBase:{Weapon:12,UpperBody:10,Legs:8},sellMultiplier:[1,2,4],valuable:40,potionSellValue:3});
const bases=R.items.filter(i=>i.slot).slice();
for(const base of bases)for(const rarity of [1,2])R.items.push({...base,id:base.id.replace(/\.common$/,rarity===1?'.uncommon':'.rare'),name:(rarity===1?'Verstärkte ':'Meisterliche ')+base.name,values:base.values.map(v=>v>0?v+config.itemBonus[rarity]:0),rarity});
R.items.sort((a,b)=>R.cmp(a.id,b.id));
const guildLevel=s=>config.guild.filter(l=>l.xp<=(s.guild?.xp||0)).length;
const limits=s=>({...config.guild[guildLevel(s)-1],level:guildLevel(s)});
const next=s=>{const l=guildLevel(s),n=config.guild[l];return n?{...n,level:l+1,remaining:n.xp-s.guild.xp,extraMembers:n.members-limits(s).members,extraGroups:n.groups-limits(s).groups,extraMissions:n.missions-limits(s).missions}:null;};
const suitability=(a,def)=>{const it=typeof def==='string'?R.item(def):def;return it?it.values.reduce((n,v,i)=>n+((R.classes[a.cls].roles&(1<<i))?v:0),0):0;};
function power(a,gear=a.gear){const b=R.classes[a.cls],c=config.power;return Math.round(b.hp*c.hp+b.attack*c.attack+b.defense*c.defense+c.perLevel*(a.level-1)+c.suitability*Object.values(gear).filter(Boolean).reduce((n,e)=>n+suitability(a,e.def),0));}
const partyPower=(s,p,now=1000)=>p?p.members.map(id=>s.members.find(a=>a.id===id)).filter(a=>a&&R.available(a,now)).reduce((n,a)=>n+power(a),0):0;
const tier=q=>{const t=config.tiers.find(t=>t.id===q.tier)||config.tiers[0];return q.dynamic?{...t,recommended:q.recommended,gold:q.gold,xp:q.xp,duration:q.duration,guildXP:q.dynamic.guildXP,drop:q.dynamic.drop,rarities:q.dynamic.rarities}:t;};
const risk=(strength,recommended)=>({...config.risk.find(r=>strength/recommended>=r.min),ratio:strength/recommended,delta:strength-recommended,warn:strength/recommended<.9});
function decorate(s){for(const q of s.quests)if(!q.tier){const t=config.tiers[(Number(q.id.slice(-12))-1)%config.tiers.length];Object.assign(q,{tier:t.id,recommended:t.recommended,gold:t.gold,xp:t.xp,duration:t.duration});}return s;}
function loot(q,u){const t=tier(q),out=[];for(const b of [...bases,R.item('item.potion.healing.basic')]){if(u('v4.loot/'+b.id+'/drop')>=t.drop)continue;let def=b.id;if(b.slot){const r=u('v4.loot/'+b.id+'/rarity'),rarity=r<t.rarities[0]?0:r<t.rarities[0]+t.rarities[1]?1:2;def=rarity?b.id.replace(/\.common$/,rarity===1?'.uncommon':'.rare'):b.id;}out.push({def,qty:b.slot?1:2});}return out;}
function sellValue(def){const it=R.item(def);if(it?.id==='item.potion.healing.basic')return config.potionSellValue;return it?.slot?config.sellBase[it.slot]*config.sellMultiplier[it.rarity]:0;}
function compare(a,e){const it=R.item(e.def);if(!it?.slot)throw Error('Kein Ausrüstungsgegenstand');const old=a.gear[it.slot],before=power(a),after=power(a,{...a.gear,[it.slot]:e});return{member:a.id,slot:it.slot,current:old,selected:e,compatible:it.allowed.includes(a.cls),before,after,delta:after-before,oldValues:old?R.item(old.def).values:[0,0,0,0],values:it.values.slice(),oldSuitability:suitability(a,old?.def),suitability:suitability(a,it),sell:sellValue(it.id)};}
function validate(s){if(!s.guild||!Number.isSafeInteger(s.guild.xp)||s.guild.xp<0||s.guild.xp>config.guild.at(-1).xp)throw Error('Ungültige Gilden-XP');if(!Number.isSafeInteger(s.gold)||s.gold<0)throw Error('Ungültiges Gold');const l=limits(s);if(s.members.length>l.members||s.parties.length>l.groups||s.quests.filter(q=>['Active','CompletedPendingResolution'].includes(q.status)).length>l.missions)throw Error('Gildenfreischaltung überschritten');return true;}
const originalInitial=R.initial,originalChange=R.change;
function initial(){const s=originalInitial();s.guild={xp:0};return decorate(s);}
function previewStart(s,quest,party,now=1000){const draft=originalChange(s,'start',{quest,party},now),q=draft.quests.find(q=>q.id===quest),p=draft.parties.find(p=>p.id===party);const strength=partyPower(draft,p,now);return{strength,recommended:q.recommended,...risk(strength,q.recommended)};}
function change(state,op,args={},now=1000){
 R.validate(state);validate(state);
 if(op==='sellPotion'){if(args.expectedQuantity!==state.potions||state.potions<1)throw Error('Trankbestand geändert oder leer. Verkauf nicht erneut ausgeführt.');const s=R.clone(state);s.potions--;s.gold+=config.potionSellValue;R.validate(s);validate(s);return s;}
 if(['sell','equipItem'].includes(op)){const s=R.clone(state),e=s.stock.find(e=>e.instance===args.instance);if(!e)throw Error('Item nicht im Lager oder bereits verkauft/ausgerüstet.');const it=R.item(e.def);if(!it?.slot)throw Error('Item nicht verkaufbar/ausrüstbar.');
 if(op==='sell'){if((it.rarity===2||sellValue(it.id)>=config.valuable)&&args.confirmed!==true)throw Error('Wertvollen Gegenstand zuerst bestätigen.');s.stock=s.stock.filter(x=>x.instance!==e.instance);s.gold+=sellValue(e.def);}
 else{const a=s.members.find(a=>a.id===args.member);if(!a)throw Error('Unbekanntes Mitglied');if(a.dead||R.locked(s,a.id))throw Error('Mitglied ist tot oder auf einer Quest gebunden.');if(!it.allowed.includes(a.cls))throw Error('Item ist für diese Klasse nicht geeignet.');const old=a.gear[it.slot];s.stock=s.stock.filter(x=>x.instance!==e.instance);if(old)s.stock.push(old);a.gear[it.slot]=e;}
 R.validate(s);validate(s);return s;}
 if(op==='createParty'&&state.parties.length>=limits(state).groups)throw Error('Gruppenplatz gesperrt. Nächstes Gilden-Level erforderlich.');
 if(op==='start'){const preview=previewStart(state,args.quest,args.party,now);if(preview.warn&&args.confirmed!==true)throw Error('WARNUNG: Gruppe schwächer als empfohlen. Trotzdem starten bestätigen.');}
 let s=originalChange(state,op,args,now);if(s===state)return state;
 if(op==='offers'){const oldAvailable=new Set(state.quests.filter(q=>q.status==='Available').map(q=>q.id));s.quests=s.quests.filter(q=>!oldAvailable.has(q.id));decorate(s);}
 if(op==='reward'){const q=s.quests.find(q=>q.id===args.quest);s.guild.xp=Math.min(config.guild.at(-1).xp,s.guild.xp+(q.result.guildXP||0));}
 validate(s);return s;
}
g.GuildProgression={config,guildLevel,limits,next,suitability,power,partyPower,tier,risk,decorate,loot,sellValue,compare,validate,previewStart};
R.initial=initial;R.change=change;
if(typeof module!=='undefined')module.exports=g.GuildProgression;
})(typeof globalThis!=='undefined'?globalThis:window);
