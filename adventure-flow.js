/* One completion transaction over existing Resolve/Reward operations; no new RNG. */
(function(g){'use strict';const R=g.GuildRules,D=g.GuildDungeon,copy=R.clone;
const empty=()=>({mode:'manager',watch:null,result:null});
function entry(s,ref){if(!ref||!['quest','dungeon'].includes(ref.type))throw Error('Ungültige Abenteuerreferenz');return ref.type==='quest'?s.quests.find(q=>q.id===ref.id):D.runs(s).find(d=>d.id===ref.id);}
function validate(s){const ui=s.adventureUI;if(!ui)return true;const keys=o=>Object.keys(o).sort().join('|');if(keys(ui)!=='mode|result|watch'||!['watch','manager'].includes(ui.mode)||(ui.mode==='watch'&&!ui.watch))throw Error('Ungültiger Ansichtsstatus');for(const k of ['watch','result'])if(ui[k]){const ref=ui[k],v=entry(s,ref);if(keys(ref)!=='id|type'||!v||v.status==='Available')throw Error('Ungültige gespeicherte Abenteueransicht');if(k==='result'&&(ref.type==='quest'?!['CompletedPendingResolution','Resolved'].includes(v.status):D.active(v)))throw Error('Ergebnis noch nicht verfügbar');}return true;}
function preview(s,id){const q=s.quests.find(q=>q.id===id);if(!q||!['CompletedPendingResolution','Resolved'].includes(q.status))throw Error('Quest noch nicht abgeschlossen');if(q.result)return copy(q.result);const p=s.parties.find(p=>p.id===q.party),members=q.participants.map(id=>s.members.find(a=>a.id===id)).sort((a,b)=>R.cmp(a.id,b.id));return R.simulate(q,copy(members),p.leader);}
const initial=R.initial,change=R.change;R.initial=()=>({...initial(),adventureUI:empty()});
R.change=(state,op,args={},now=1000)=>{let s=state;if(['view-mode','result-open','result-close'].includes(op)){s=copy(state);s.adventureUI??=empty();if(op==='view-mode'){if(!['watch','manager'].includes(args.mode))throw Error('Ungültiger Modus');s.adventureUI.mode=args.mode;if(args.mode==='watch')s.adventureUI.watch={type:args.type,id:args.id};}else s.adventureUI.result=op==='result-close'?null:{type:args.type,id:args.id};validate(s);return s;}
 if(op==='finish-quest'){const q=state.quests.find(q=>q.id===args.id);if(!q)throw Error('Quest fehlt');if(q.paid)return state;if(q.status==='CompletedPendingResolution')s=change(s,'resolve',{quest:q.id},now);else if(q.status!=='Resolved')throw Error('Quest noch nicht abgeschlossen');s=change(s,'reward',{quest:q.id},now);s=change(s,'equip',{},now);}
 else if(op==='finish-dungeon'){const d=D.runs(state).find(d=>d.id===args.id);if(!d)throw Error('Dungeon fehlt');if(d.paid)return state;s=change(s,'dungeon-claim',{id:d.id},now);s=change(s,'equip',{},now);}
 else return change(state,op,args,now);
 s.adventureUI=empty();validate(s);return s;};
g.GuildAdventureFlow={empty,entry,validate,preview};if(typeof module!=='undefined')module.exports=g.GuildAdventureFlow;
})(typeof globalThis!=='undefined'?globalThis:window);
