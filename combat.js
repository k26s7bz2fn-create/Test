(function(g){'use strict';const R=g.GuildRules||(typeof require!=='undefined'?require('./rules.js'):null);
const ability=(id,cd,mana=0,raw=null,status=null,kind='attack')=>({id,cd,mana,raw,status,kind});
const A={
'class.warrior':[ability('combat.warrior.shield_bash',24,0,null,'Stun'),ability('combat.warrior.strike',8)],
'class.rogue':[ability('combat.rogue.bleeding_cut',24,0,null,'Bleed'),ability('combat.rogue.strike',8)],
'class.mage':[ability('combat.mage.burning_bolt',24,6,null,'Burn'),ability('combat.mage.bolt',8,4),ability('combat.mage.staff_strike',8,0,3)],
'class.priest':[ability('combat.priest.stabilize',16,6,null,null,'stabilize'),ability('combat.priest.heal',8,6,null,null,'heal'),ability('combat.priest.strike',8)]};
for(const [id,p] of Object.entries(R.profiles))if(id.startsWith('enemy.'))A[id]=[...(id.endsWith('ranged')?[ability('combat.goblin.poison_shot',24,0,null,'Poison')]:id.endsWith('brute')?[ability('combat.goblin.stunning_blow',24,0,null,'Stun')]:[]),ability('combat.enemy.basic_attack',p.cd)];
function input(id,def,source='',gear=[],hp){const p=R.profiles[def];if(!p)throw Error('Unbekanntes Combatprofil');return{id,def,source,gear:gear.length?R.clone(gear):[null,null,null],hp:hp??p.hp};}
class Combat{
 constructor(inputs,seed=7n){seed=BigInt(seed);if(seed<0n||seed>18446744073709551615n)throw Error('Ungültiger Seed');this.seed=seed.toString(16).padStart(16,'0');const ids=new Set(),sources=new Set(),equipment=new Set();let allies=0,enemies=0;
 const sorted=R.clone(inputs).sort((a,b)=>R.cmp(a.id,b.id));for(const m of sorted){const p=R.profiles[m.def];if(!p||!m.id||m.id!==m.id.trim()||ids.has(m.id)||m.hp<1||m.hp>p.hp)throw Error('Ungültiger Combatinput');ids.add(m.id);if(m.def.startsWith('class.')){allies++;if(!m.source||sources.has(m.source))throw Error('Ungültige Quelle');sources.add(m.source);}else enemies++;
 m.gear.forEach((e,i)=>{if(!e)return;const it=R.item(e.def);if(equipment.has(e.instance)||!it||it.slot!==R.slots[i]||!it.allowed.includes(m.def))throw Error('Ungültiges Equipment');equipment.add(e.instance);});}
 if(allies<1||allies>6||enemies<1||enemies>6)throw Error('1–6 Teilnehmer pro Seite erforderlich');
 const fields=['combat.input.v1','combat.rules.v1',String(sorted.length)];for(const m of sorted){const p=R.profiles[m.def];fields.push(m.id,m.def.startsWith('class.')?'Adventurer':'Enemy',m.source,m.def,String(p.roles),String(m.hp),String(p.mana));for(const e of m.gear)fields.push(e?.def||'',e?.instance||'');}fields.push(this.seed);this.fingerprint=R.hash(...fields);
 this.state={tick:0,phase:'Running',sequence:0,victory:null,result:null,events:[],members:sorted.map(m=>({...m,p:R.profiles[m.def],faction:m.def.startsWith('class.')?'Adventurer':'Enemy',mana:R.profiles[m.def].mana,life:'Alive',ready:{},next:0,statuses:{},history:[],target:null,wasIncap:false,deathTick:null,deadline:null,stabilization:'None'}))};this.log=[];this.speed=1;this.pending=0;
 }
 draw(s,id,purpose){return parseInt(R.hash('combat.rng.sha256.v1','combat.rules.v1',this.seed,this.fingerprint,String(s.tick),id,String(s.sequence++),purpose).slice(0,8),16);}
 pass(draw,bp){return draw*10000<bp*4294967296;}
 damage(m,n,t){m.hp=Math.max(0,m.hp-n);if(m.hp||m.life!=='Alive')return;m.statuses={};if(m.faction==='Enemy'){m.life='Dead';m.deathTick=t;}else{m.life='Incapacitated';m.wasIncap=true;m.deadline=t+32;}}
 applyStatus(m,kind,source,t){if(m.life!=='Alive')return;const old=m.statuses[kind];m.statuses[kind]={source:old?.source||source,end:t+(kind==='Stun'?4:16),pulse:old?old.pulse:kind==='Stun'?0:t+4};if(!m.history.includes(kind))m.history.push(kind);}
 event(s,a,t,kind,amount=0,critical=false){s.events.push({tick:s.tick,actor:a,target:t,kind,amount,critical});}
 death(s,m,collapse){const dead=this.pass(this.draw(s,m.id,collapse?'death.collapse':'death.normal'),collapse?6000:2500);m.deadline=null;m.statuses={};m.life=dead?'Dead':'Stabilized';m.hp=dead?0:1;if(dead)m.deathTick=s.tick;else m.stabilization='UnaidedSurvival';this.event(s,m.id,m.id,collapse?'death.collapse':'death.normal',dead?1:0);}
 step(){if(['Completed','TechnicalAbort'].includes(this.state.phase))return false;const s=R.clone(this.state);s.tick++;s.events=[];const ms=s.members,t=s.tick;
 if(s.phase==='Running'){
 for(const m of ms)for(const kind of ['Poison','Bleed','Burn']){if(m.life!=='Alive')break;const st=m.statuses[kind];if(st&&st.pulse<=t&&t<=st.end){const n=kind==='Poison'?1:2;this.damage(m,n,t);this.event(s,st.source,m.id,'status.'+kind,n);if(m.life==='Alive')m.statuses[kind]={...st,pulse:st.pulse+4};}}
 for(const m of ms)for(const kind of Object.keys(m.statuses))if(m.statuses[kind].end<=t)delete m.statuses[kind];}
 for(const m of ms)if(m.life==='Alive'&&(s.phase==='Running'||m.def==='class.priest'))m.mana=Math.min(m.p.mana,m.mana+1);
 const offset=(t-1)%ms.length;for(let i=0;i<ms.length;i++){const a=ms[(offset+i)%ms.length];if(a.life!=='Alive'||a.next>t||a.statuses.Stun||(s.phase==='Aftermath'&&a.def!=='class.priest'))continue;
 let attack=null;if(s.phase==='Running'){let candidates=ms.filter(m=>m.life==='Alive'&&m.faction!==a.faction);if(candidates.some(m=>m.p.front))candidates=candidates.filter(m=>m.p.front);if(candidates.some(m=>m.faction==='Adventurer'&&m.p.front&&(m.p.roles&1)))candidates=candidates.filter(m=>m.p.roles&1);attack=candidates.find(m=>m.id===a.target)||candidates[0]||null;a.target=attack?.id||null;}
 for(const ab of A[a.def]){if(s.phase==='Aftermath'&&ab.kind!=='stabilize')continue;if((a.ready[ab.id]||0)>t||a.mana<ab.mana)continue;
 let target=attack;
 if(ab.kind==='stabilize')target=ms.filter(m=>m.faction==='Adventurer'&&m.life==='Incapacitated').sort((a,b)=>a.deadline-b.deadline||R.cmp(a.id,b.id))[0];
 if(ab.kind==='heal')target=ms.filter(m=>m.faction==='Adventurer'&&m.life==='Alive'&&2*m.hp<=m.p.hp).sort((a,b)=>a.hp*b.p.hp-b.hp*a.p.hp||R.cmp(a.id,b.id))[0];
 if(!target||(ab.status&&target.statuses[ab.status]))continue;
 if(ab.kind==='stabilize'){target.life='Stabilized';target.hp=1;target.deadline=null;target.stabilization='Healer';target.statuses={};this.event(s,a.id,target.id,ab.id,1);}
 else if(ab.kind==='heal'){const before=target.hp;target.hp=Math.min(target.p.hp,target.hp+12);this.event(s,a.id,target.id,ab.id,target.hp-before);}
 else{const crit=this.pass(this.draw(s,a.id,'critical'),a.p.crit),amount=Math.max(1,(ab.raw??a.p.attack)-target.p.defense)*(crit?2:1);this.damage(target,amount,t);this.event(s,a.id,target.id,ab.id,amount,crit);if(ab.status)this.applyStatus(target,ab.status,a.id,t);}
 a.mana-=ab.mana;a.ready[ab.id]=t+ab.cd;a.next=t+4;break;}}
 const complete=outcome=>{for(const m of ms)m.statuses={};s.phase='Completed';s.result={outcome,wipe:ms.filter(m=>m.faction==='Adventurer').every(m=>m.life==='Dead'),duration:t*250,consumedPotions:[],participants:ms.map(m=>({id:m.id,life:m.life,hp:m.hp,mana:m.mana,recovery:m.faction==='Adventurer'&&m.wasIncap&&m.life!=='Dead'?120:0}))};};
 if(!ms.some(m=>m.faction==='Adventurer'&&m.life==='Alive')){for(const m of ms)if(m.faction==='Adventurer'&&m.life==='Incapacitated')this.death(s,m,true);complete('Defeat');}
 else{for(const m of ms)if(m.faction==='Adventurer'&&m.life==='Incapacitated'&&m.deadline<=t)this.death(s,m,false);
 if(!ms.some(m=>m.faction==='Enemy'&&m.life==='Alive')){if(s.victory===null)s.victory=t;if(!ms.some(m=>m.faction==='Adventurer'&&m.life==='Incapacitated'))complete('Victory');else{s.phase='Aftermath';for(const m of ms)m.statuses={};}}
 if(s.phase==='Running'&&t>=480)s.phase='TechnicalAbort';}
 this.state=s;this.log.push(...s.events);this.log=this.log.slice(-120);return true;
 }
 advance(ms){if(!Number.isFinite(ms)||ms<0)throw Error('Ungültige Zeit');if(!this.speed||this.terminal)return;this.pending+=ms*this.speed;while(this.pending>=250&&!this.terminal){this.step();this.pending-=250;}}
 get terminal(){return ['Completed','TechnicalAbort'].includes(this.state.phase);}
 signature(){const s=this.state;return`${s.tick}|${s.phase}|${s.sequence}|${s.result?s.result.outcome+'/'+(s.result.wipe?'True':'False'):''}|`+s.members.map(m=>`${m.id},${m.hp},${m.mana},${m.life},${m.stabilization},${m.deathTick??''}`).join(';');}
}
g.GuildCombat={Combat,input,abilities:A};if(typeof module!=='undefined')module.exports=g.GuildCombat;
})(typeof globalThis!=='undefined'?globalThis:window);
