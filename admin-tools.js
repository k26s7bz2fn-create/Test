/* DEVELOPMENT ONLY. Draft -> existing validation -> durable save -> UI commit. No rule overrides. */
(function(g){'use strict';
const R=g.GuildRules,P=g.GuildProgression,N=g.GuildRecruitment,S=g.GuildSave,D=g.GuildDungeon,F=g.GuildAdventureFlow,Q=g.GuildEarlyBalance||g.GuildDynamicQuests;
const BUILD='V4.2B · AdminTools 1',copy=R.clone;
const dangerous=Object.freeze(['storage-clear','starter-reset','member-restore','dungeon-clear','save-primary-delete','save-backup-delete','save-corrupt','new-guild']);
const fail=m=>{throw Error(m);},integer=(n,min,max)=>{n=Number(n);if(!Number.isSafeInteger(n)||n<min||n>max)fail('Ungültiger Testwert.');return n;};
const by=(rows,id,label)=>rows.find(a=>a.id===id)||fail(label+' auswählen.');
function validate(s,clock){R.validate(s);P.validate(s);if(D)D.validate(s,true);if(F)F.validate(s);S.createSaveData(s,clock,0);return true;}
function prepare(state,clock,op,args={},confirmed=false){
 if(dangerous.includes(op)&&confirmed!==true)fail('Diese DEV-Aktion muss ausdrücklich bestätigt werden.');
 let s=copy(state),time=clock,message='',resetView=false;
 const change=(action,data={})=>{s=R.change(s,action,data,time);};
 const advance=to=>{time=Math.max(time,to);R.refresh(s,time);if(D)s=D.advance(s,time);};
 const level=(a,n)=>{a.xp=R.thresholds[n-1];a.level=R.level(a.xp);};
 const pool=()=>{if(!s.recruited)fail('Zuerst die drei Starter rekrutieren.');const gold=s.gold;s.gold=Math.max(gold,R.recruitmentConfig.refreshCost);change('refreshPool',{pool:s.poolSeq});s.gold=gold;};
 const alive=()=>s.members.filter(a=>!a.dead);
 switch(op){
 case'gold-add':{const n=integer(args.amount,100,1000);if(![100,500,1000].includes(n))fail('Unbekannter Goldschritt.');s.gold+=n;message='+'+n+' Gold hinzugefügt';break;}
 case'gold-zero':s.gold=0;message='Gold auf 0 gesetzt';break;
 case'guild-xp':{const n=integer(args.amount,50,250);if(![50,250].includes(n))fail('Unbekannter XP-Schritt.');s.guild.xp=Math.min(1000,s.guild.xp+n);message='Gilden-XP: '+s.guild.xp+' · Level '+P.guildLevel(s);break;}
 case'guild-next':{const n=P.next(s);s.guild.xp=n?n.xp:s.guild.xp;message=n?'Gilden-XP bis Level '+n.level+' aufgefüllt':'Gildenlevel 5 bereits erreicht';break;}
 case'guild-level':{const n=integer(args.level,1,5);s.guild.xp=P.config.guild[n-1].xp;message='Gilden-XP bis Level '+n+' gesetzt';break;}
 case'members-level':alive().forEach(a=>level(a,Math.min(10,a.level+1)));message='Alle lebenden Mitglieder +1 Level (max. F10)';break;
 case'member-level':case'member-max':{const a=by(s.members,args.member,'Mitglied');if(a.dead)fail('Verstorbenes Mitglied zuerst DEV-only wiederherstellen.');level(a,op==='member-max'?10:Math.min(10,a.level+1));message=a.name+' auf Rang F · Lvl. '+a.level+' gesetzt';break;}
 case'members-heal':case'members-ready':alive().forEach(a=>a.recovery=0);message='Alle Verletzungen geheilt. Laufende Einsatzbindungen bleiben erhalten.';break;
 case'member-restore':{const a=by(s.members,args.member,'Verstorbenes Mitglied');if(!a.dead)fail('Dieses Mitglied lebt bereits.');if(R.locked(s,a.id)||s.quests.some(q=>!q.paid&&q.result&&q.participants.includes(a.id))||D?.runs(s).some(d=>!d.paid&&d.participants.includes(a.id)))fail('Zuerst Einsatz und offene Belohnungen abschließen.');a.dead=false;a.recovery=0;message='DEV-ONLY: '+a.name+' wiederhergestellt; keine Items dupliziert';break;}
 case'pool-refresh':pool();message='Neuer Kandidatenpool ohne Goldkosten erzeugt';break;
 case'pool-high':case'candidate-add':{
  const n=op==='pool-high'?8:integer(args.level,1,8);if(![1,5,8].includes(n))fail('Testkandidaten: F1, F5 oder F8.');const guild=n===1?1:n===5?4:5;
  s.guild.xp=Math.max(s.guild.xp,P.config.guild[guild-1].xp);pool();const context={poolSeq:s.poolSeq,guild:{xp:P.config.guild[guild-1].xp}};
  s.normalPool=N.generatePool(context,s.normalPool);s.poolGuildLevel=guild;
  const targets=op==='pool-high'?s.normalPool:[s.normalPool[0]];targets.forEach(a=>{level(a,n);a.name='DEV F'+n+' · '+a.name;});
  message=(op==='pool-high'?'F8-Testpool':'F'+n+'-Testkandidat in neuem Pool')+' erzeugt · Gildenlevel '+P.guildLevel(s)+' · normale Kaufpreise gelten';break;
 }
 case'loot-add':case'rare-set':{
  const rarity=op==='rare-set'?2:integer(args.rarity,0,2),a=op==='rare-set'?by(s.members,args.member,'Mitglied'):null;
  const items=R.items.filter(it=>it.slot&&it.rarity===rarity&&(!a||it.allowed.includes(a.cls)));
  for(const it of items)s.stock.push({def:it.id,instance:'browser.item.'+String(++s.itemSeq).padStart(8,'0')});
  message=P.config.rarityNames[rarity]+'-Testloot hinzugefügt · '+items.length+' Items';break;
 }
 case'potions-add':s.potions+=5;message='+5 Heiltränke hinzugefügt';break;
 case'storage-clear':s.stock=[];s.potions=0;message='Freies Storage geleert; getragene Items und zugeteilte Tränke erhalten';break;
 case'board-new':case'board-easy':case'board-strong':{
  change('offers');if(op!=='board-new'){
   const floor=Q.config.benchmarkFloors[P.guildLevel(s)-1];s.questBoard.benchmarkPower=op==='board-easy'?floor:Math.min(Q.config.maxBenchmark,Math.max(2000,Math.round(s.questBoard.benchmarkPower*1.8)));
   s.quests.filter(q=>q.status==='Available').forEach(q=>Object.assign(q,Q.values(s.questBoard,(Number(q.id.slice(-12))-1)%4)));
  }message=(op==='board-easy'?'Leichtes DEV-Board (kleinste zulässige Basis)':op==='board-strong'?'Starkes dynamisches DEV-Board':'Neues dynamisches Questboard')+' erzeugt; Einsatzverträge unverändert';break;
 }
 case'quest-advance':advance(time+60000);message='Spieluhr +60s · Quests, Erholung und Dungeons vorgespult';break;
 case'quests-ready':{const active=s.quests.filter(q=>q.status==='Active');advance(Math.max(time,...active.map(q=>q.end)));message='Alle aktiven Quests auswertungsbereit · keine Rewards ausgezahlt';break;}
 case'quest-finish':{
  let q=by(s.quests,args.quest,'Quest');if(q.paid){message='Bereits bezahlt – keine doppelte Belohnung';break;}
  if(q.status==='Available'){change('start',{quest:q.id,party:args.party,confirmed:true});q=by(s.quests,args.quest,'Quest');}
  if(q.status==='Active')advance(q.end);change('finish-quest',{id:q.id});message='Quest regulär ausgewertet und einmalig abgerechnet';resetView=true;break;
 }
 case'dungeon-unlock':if(!D)fail('Dungeon-System noch nicht verfügbar.');s.guild.xp=Math.max(s.guild.xp,P.config.guild[D.config.unlock-1].xp);message='Dungeon über Gilden-XP freigeschaltet';break;
 case'dungeon-start':if(!D)fail('Dungeon-System noch nicht verfügbar.');change('dungeon-start',{party:args.party});message='Dungeon mit ausgewählter Gruppe gestartet';break;
 case'dungeon-skip':case'dungeon-decision':case'dungeon-finish':{
  if(!D)fail('Dungeon-System noch nicht verfügbar.');let d=by(D.runs(s),args.run,'Dungeon');
  if(d.paid){message='Dungeon bereits bezahlt – keine doppelte Belohnung';break;}
  const all=op==='dungeon-finish';
  for(let i=0;i<4;i++){
   d=by(D.runs(s),args.run,'Dungeon');if(d.status==='Combat'){
    if(!d.current.speed)change('dungeon-speed',{id:d.id,speed:1});
    advance(time+D.config.maxTicks*250+1000);d=by(D.runs(s),args.run,'Dungeon');
   }
   if(!all||!D.active(d))break;
   if(d.status==='Decision')change('dungeon-next',{id:d.id,room:d.room});
  }
  d=by(D.runs(s),args.run,'Dungeon');if(all){if(D.active(d))fail('Dungeon konnte innerhalb der bestehenden Tickgrenze nicht beendet werden.');change('finish-dungeon',{id:d.id});resetView=true;}
  message='Dungeon: '+d.status+(all?' · reguläres Ergebnis einmalig übernommen':' · normaler Kampf simuliert; kein Sieg erzwungen');break;
 }
 case'dungeon-clear':if(!D)fail('Dungeon-System noch nicht verfügbar.');s.expeditions={...D.empty(),portalAnnounced:P.guildLevel(s)>=2};s.adventureUI=F.empty();resetView=true;message='DEV-Dungeonhistorie und Bindungen gelöscht. Bereits gebuchte Ressourcen bleiben erhalten.';break;
 case'new-guild':case'starter-reset':s=R.initial();time=1000;resetView=true;message=op==='starter-reset'?'Starterrunde zurückgesetzt · neue leere Gilde':'Neue leere Gilde gestartet';break;
 default:fail('Unbekannte DEV-Aktion.');
 }
 if(D&&P.guildLevel(s)>=D.config.unlock&&['guild-xp','guild-next','guild-level','dungeon-unlock','pool-high','candidate-add'].includes(op))s.expeditions.portalAnnounced=true;
 try{validate(s,time);}catch(e){if(op==='guild-level')fail('Levelwechsel nicht möglich: bestehende Mitglieder, Gruppen, Pool- oder Questverträge benötigen das bisherige Level. '+e.message);throw e;}
 return{state:s,clock:time,message,resetView,wipeSaves:['new-guild','starter-reset'].includes(op),changed:['new-guild','starter-reset'].includes(op)||time!==clock||JSON.stringify(s)!==JSON.stringify(state)};
}
/* Copy-on-write localStorage adapter. Normal saves pass through; DEV writes stage first.
   Cross-key rollback is best effort because localStorage has no native transactions. */
function storageAdapter(storage){
 const keys=Object.values(S.KEYS);let known=new Map(keys.map(k=>[k,storage.getItem(k)])),stage=null,paused=false,locked=false;
 const api={
  getItem:k=>stage?.has(k)?stage.get(k):storage.getItem(k),
  setItem(k,v){if(locked||(!stage&&paused))fail('DEV: Autosave pausiert. Im Adminpanel ausdrücklich fortsetzen.');v=String(v);if(stage)stage.set(k,v);else{storage.setItem(k,v);if(known.has(k))known.set(k,v);}},
  removeItem(k){if(locked||(!stage&&paused))fail('DEV: Autosave pausiert. Im Adminpanel ausdrücklich fortsetzen.');if(stage)stage.set(k,null);else{storage.removeItem(k);if(known.has(k))known.set(k,null);}},
  get paused(){return paused||locked;},set paused(v){paused=!!v;},
  atomic(work,allowPaused=false){
   if(locked)fail('Speicher-Rollback fehlgeschlagen. Exportieren und Seite neu laden.');
   if(paused&&!allowPaused)fail('DEV: Autosave zuerst ausdrücklich fortsetzen.');if(stage)fail('Verschachtelte Speicheraktion gesperrt.');
   const before=new Map(keys.map(k=>[k,storage.getItem(k)]));if(keys.some(k=>before.get(k)!==known.get(k)))fail('Save wurde in einem anderen Tab geändert. Neu laden oder aktuellen Stand exportieren.');
   stage=new Map();let out,changes;
   try{out=work(api);changes=stage;}catch(e){stage=null;throw e;}stage=null;
   try{
    if(keys.some(k=>storage.getItem(k)!==before.get(k)))fail('Save während der Vorbereitung geändert.');
    for(const [k,v]of changes)if(v===null)storage.removeItem(k);else storage.setItem(k,v);
   }catch(error){
    for(const [k,v]of before){try{const actual=storage.getItem(k);if(actual===v)continue;if(actual!==changes.get(k)){locked=true;continue;}if(v===null)storage.removeItem(k);else storage.setItem(k,v);}catch(_){locked=true;}}
    if(locked)paused=true;throw Error('DEV-Speichern fehlgeschlagen; Spielzustand nicht übernommen. '+(locked?'Rollback nicht vollständig möglich; Export und Reload erforderlich. ': 'Vorherige Saves erhalten. ')+error.message);
   }
   known=new Map(before);for(const [k,v]of changes)if(known.has(k))known.set(k,v);return out;
  }
 };return api;
}
function persist(adapter,result,replace=false,now=Date.now()){
 if(!adapter)fail('Lokaler Speicher nicht verfügbar.');
 const store=adapter.atomic(io=>{const st=S.createStore(io);st.loadGame(now);if(result.wipeSaves)st.deleteSave(true);if(replace)st.importSave(JSON.stringify(S.createSaveData(result.state,result.clock,now)),now);else st.saveGame(result.state,result.clock,now);return st;},replace);
 if(replace)adapter.paused=false;return store;
}
function storageAction(adapter,state,clock,op,confirmed=false,now=Date.now()){
 if(!adapter)fail('Lokaler Speicher nicht verfügbar.');if(dangerous.includes(op)&&!confirmed)fail('Gefährliche Save-Aktion zuerst bestätigen.');
 if(op==='save-fallback'){
  const primary=adapter.getItem(S.KEYS.primary),backup=adapter.getItem(S.KEYS.backup);let valid=backup;
  try{S.parse(valid);}catch(_){valid=primary;S.parse(valid);}
  const map=new Map([[S.KEYS.primary,'{ DEV broken copy'],[S.KEYS.backup,valid]]),memory={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
  const result=S.createStore(memory).loadGame(now);if(result.kind!=='backup')fail('Backup-Fallback fehlgeschlagen.');validate(result.state,result.clock);return{message:'Backup-Fallback erfolgreich geprüft (isolierte Kopie; echter Save unverändert)',kind:'backup'};
 }
 if(op==='save-resume')return{store:persist(adapter,{state,clock},true,now),message:'Autosave fortgesetzt · aktueller Stand gespeichert'};
 if(!['save-primary-delete','save-backup-delete','save-corrupt'].includes(op))fail('Unbekannte Speicher-Testaktion.');
 adapter.atomic(io=>{if(op==='save-corrupt'){io.setItem(S.KEYS.backup,JSON.stringify(S.createSaveData(state,clock,now)));io.setItem(S.KEYS.primary,'{ DEV-ONLY damaged primary');}else io.removeItem(op==='save-primary-delete'?S.KEYS.primary:S.KEYS.backup);},true);
 adapter.paused=true;const st=S.createStore(adapter);const loaded=st.loadGame(now);
 return{store:st,message:(op==='save-corrupt'?'Primary TEST-ONLY beschädigt; gültiges Backup angelegt':op==='save-primary-delete'?'Primary Save gelöscht':'Backup Save gelöscht')+' · Autosave pausiert bis „Fortsetzen & speichern“ oder Reload',loadKind:loaded.kind};
}
function inspect(state,clock,storage,status=''){const lim=P.limits(state),q=state.quests;let version='kein Primary',primary='fehlt',backup='fehlt';
 for(const k of ['primary','backup'])try{const raw=storage?.getItem(S.KEYS[k]);const valid=raw===null||raw===undefined?'fehlt':(S.parse(raw),'gültig');if(k==='primary'){primary=valid;if(valid==='gültig')version=JSON.parse(raw).saveVersion;}else backup=valid;}catch(_){if(k==='primary'){primary='beschädigt / nicht lesbar';version='nicht lesbar';}else backup='beschädigt / nicht lesbar';}
 return{build:BUILD,gold:state.gold,guildXP:state.guild.xp,guildLevel:P.guildLevel(state),members:state.members.length+'/'+lim.members,groups:state.parties.length+'/'+lim.groups,missions:(D?D.missions(state):q.filter(q=>['Active','CompletedPendingResolution'].includes(q.status)).length)+'/'+lim.missions,activeQuests:q.filter(q=>q.status==='Active').length,pendingQuests:q.filter(q=>q.status==='CompletedPendingResolution'||q.status==='Resolved'&&!q.paid).length,paidQuests:q.filter(q=>q.paid).length,dungeons:D?D.runs(state).filter(D.active).map(d=>d.id+' · '+d.status).join(', ')||'keine':'nicht verfügbar',saveVersion:version,primary,backup,autosave:storage?.paused?'DEV: pausiert':status,clock};}
g.GuildAdminTools={BUILD,dangerous,prepare,validate,storageAdapter,persist,storageAction,inspect};if(typeof module!=='undefined')module.exports=g.GuildAdminTools;
})(typeof globalThis!=='undefined'?globalThis:window);
