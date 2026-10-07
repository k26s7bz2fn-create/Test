/* Adapts the existing hall navigation graph to real leaders; only projected snapshots are changed. */
(function(g){'use strict';const H=g.GuildHall,V=g.GuildCharacterPresentation,P=g.GuildProgression,D=g.GuildDungeon;
class LeaderHall extends H.HallModel{
 constructor(){super();this.characters=new Map();this.previousRuns=new Map();this.partyLabels=new Map();}
 make(a,arrival){const actor=super.make(a,arrival),index=[...this.partyLabels.keys()].indexOf(a.id);if(!arrival&&index>=0){const point=['table','board','chest','fire','desk'][index%5];Object.assign(actor,{point,target:point,x:H.points[point].x,y:H.points[point].y});}return actor;}
 sync(s,now){const ids=new Set(s.parties.slice(0,P.limits(s).groups).filter(p=>p.members.length&&p.leader&&p.members.includes(p.leader)).map(p=>p.leader)),members=s.members.filter(a=>ids.has(a.id)),returns=new Set();this.characters=new Map(members.map(a=>[a.id,a]));this.partyLabels=new Map(s.parties.filter(p=>ids.has(p.leader)).map(p=>[p.leader,p.name]));
 const dungeon=D.runs(s).map(d=>{if(this.previousRuns.get(d.id)&&D.active(this.previousRuns.get(d.id))&&!D.active(d))d.participants.forEach(id=>returns.add(id));return{id:d.id,status:D.active(d)?'Active':'Resolved',participants:d.participants};});
 // A new run has no Available quest state; seed only the presentation transition.
 for(const q of dungeon)if(!this.questStatus.has(q.id)&&this.initialized&&q.status==='Active')this.questStatus.set(q.id,'Available');
 super.sync({...s,members,quests:[...s.quests,...dungeon]},now);
 for(const a of this.actors.values()){a.exitPoint=D.bound(s,a.id)?'portal':'entrance';if(returns.has(a.id)&&a.mode==='Return'){a.point='portal';a.x=H.points.portal.x;a.y=H.points.portal.y;a.entryPortal=true;a.mode='ExitPortal';a.fade=0;a.wait=.4;}if(a.departing&&a.mode==='Preparing')a.wait=Math.min(a.wait,.35);}
 this.previousRuns=new Map(D.runs(s).map(d=>[d.id,{status:d.status}]));
 }
 update(seconds,reduced=false){if(!Number.isFinite(seconds)||seconds<0)throw Error('Invalid visual delta');const dt=Math.min(seconds,.1);this.visualTime+=dt;this.delta=dt;this.reduced=reduced;
 for(const [id,a]of this.actors){if(reduced){if(a.departing){a.fade=(a.fade??1)-dt*5;if(a.fade<=0)this.actors.delete(id);continue;}a.mode=a.injured?'Sit':'Idle';a.fade=1;continue;}
 if(a.mode==='ExitPortal'){a.fade=Math.min(1,(a.fade||0)+dt*3);a.wait-=dt;if(a.wait<=0){a.fade=1;a.mode='Return';a.wait=0;}continue;}
 if(a.mode==='EnterPortal'||a.mode==='ExitHall'){a.fade=(a.fade??1)-dt*3;if(a.fade<=0)this.actors.delete(id);continue;}
 if(a.queue.length){const point=H.points[a.queue[0]],done=V.move(a,point,dt,a.departing?.29:a.injured?.048:.095);a.mode=a.departing?'Depart':'Walk';if(done){a.point=a.queue.shift();if(!a.queue.length){a.velocity=0;if(a.departing&&a.point===a.exitPoint){a.mode=a.exitPoint==='portal'?'EnterPortal':'ExitHall';a.fade=1;}else{a.mode=a.departing?'Preparing':'Activity';a.wait=a.departing?.3:3.5+V.hash(a.id+':'+a.sequence)%35/10;}}}continue;}
 a.wait-=dt;if(a.wait>0)continue;
 if(a.mode==='Gather'){this.walk(a,a.exitPoint==='portal'?'right':'front');continue;}
 if(a.mode==='Preparing'){this.walk(a,a.exitPoint);continue;}
 if(a.mode==='Arrival'||a.mode==='Return'){this.walk(a,a.injured?'seat':a.entryPortal?'chest':'recruitment');continue;}
 if(a.injured){if(a.point!=='seat')this.walk(a,'seat');else{a.mode='Activity';a.wait=8;}continue;}
 if(a.mode==='Activity'){a.mode='Idle';a.wait=1.4;continue;}a.sequence++;const choices=H.activities.filter(p=>p!==a.point);this.walk(a,choices[V.hash(a.id+':activity:'+a.sequence)%choices.length]);
 }}
 snapshot(){const actors=super.snapshot();return actors.map(a=>({...a,facing:a.social?((actors.find(b=>b.id!==a.id&&b.point===a.point)?.x??a.x)>a.x?1:-1):a.facing,opacity:a.fade??1,character:this.characters.get(a.id),leaderLabel:(this.partyLabels.get(a.id)||'Gruppe')+' · '+g.GuildRules.classes[a.cls].name+' · '+(a.departing?'Im Aufbruch':a.injured?'Verletzt · ruht':a.activity),view:a.mode==='Activity'&&['board','portal','chest'].includes(a.point)?'back':a.view||'three',pose:['Walk','Depart'].includes(a.mode)?'Walk':a.mode==='Gather'||a.mode==='Preparing'?'Prepare':['EnterPortal','ExitPortal'].includes(a.mode)?a.mode:a.injured?'Sit':a.mode==='Activity'?'Interact':'Idle'}));}
}
class LeaderHallView{
 constructor(model,onMember){this.model=model;this.scene=new V.Scene(onMember);}
 mount(layer){this.scene.mount(layer);}
 draw(){const snapshot=this.model.snapshot();if(this.scene.layer?.parentElement?.dataset)this.scene.layer.parentElement.dataset.portalActive=String(snapshot.some(a=>['EnterPortal','ExitPortal'].includes(a.pose)));this.scene.draw(snapshot.filter(a=>a.character).map(a=>({...a,label:a.leaderLabel,scale:a.scale*.78})),[],this.model.delta||1/60,this.model.reduced);}
}
g.GuildAdventureHall={LeaderHall,LeaderHallView};if(typeof module!=='undefined')module.exports=g.GuildAdventureHall;
})(typeof globalThis!=='undefined'?globalThis:window);
