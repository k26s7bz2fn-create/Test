/* Presentation-only activity model. Reads snapshots; never writes gameplay state or draws Combat RNG. */
(function(g){'use strict';
const points=Object.freeze({entrance:{x:.09,y:.54,activity:'Tritt ein'},recruitment:{x:.20,y:.54,activity:'Begrüßt Reisende'},fire:{x:.30,y:.47,activity:'Wärmt die Hände'},seat:{x:.39,y:.45,activity:'Ruht sich aus'},board:{x:.68,y:.49,activity:'Liest einen Auftrag'},table:{x:.51,y:.65,activity:'Studiert die Karte'},chest:{x:.78,y:.66,activity:'Prüft die Ausrüstung'},portal:{x:.90,y:.50,activity:'Bereitet die Waffe vor'},desk:{x:.47,y:.73,activity:'Wartet am Schreibtisch'},left:{x:.26,y:.62},front:{x:.49,y:.70},right:{x:.74,y:.61},rear:{x:.53,y:.43}});
const edges=[['entrance','recruitment'],['recruitment','left'],['left','fire'],['fire','seat'],['seat','rear'],['rear','board'],['board','right'],['right','portal'],['right','chest'],['left','front'],['front','right'],['front','table'],['front','desk']];
const activities=['fire','board','table','chest','portal','seat','recruitment','desk'];
const copy=x=>JSON.parse(JSON.stringify(x)),hash=s=>{let n=2166136261;for(const c of s)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
function route(from,to){const queue=[[from]],seen=new Set([from]);while(queue.length){const p=queue.shift(),last=p.at(-1);if(last===to)return p.slice(1);for(const [a,b] of edges){const next=a===last?b:b===last?a:null;if(next&&!seen.has(next)){seen.add(next);queue.push([...p,next]);}}}throw Error('Unbekannter Hallenweg');}
const bound=(s,id)=>s.quests.some(q=>['Active','CompletedPendingResolution'].includes(q.status)&&q.participants.includes(id));
class HallModel{
 constructor(){this.actors=new Map();this.visualTime=0;this.memberIds=new Set();this.questStatus=new Map();this.initialized=false;this.reduced=false;}
 make(a,arrival){const h=hash(a.id),point=arrival?'entrance':activities[h%activities.length],p=points[point];return{id:a.id,name:a.name,cls:a.cls,point,target:point,x:p.x,y:p.y,mode:arrival?'Arrival':'Idle',wait:arrival?.12:(h%25)/10+1,queue:[],facing:1,sequence:0,injured:false,departing:false,departAge:0,variant:h%4,offset:((h%5)-2)*.007};}
 sync(state,now){const live=new Map(state.members.filter(a=>!a.dead).map(a=>[a.id,a]));
 for(const [id] of this.actors)if(!live.has(id))this.actors.delete(id);
 for(const q of state.quests){const prev=this.questStatus.get(q.id);if(this.initialized&&q.status==='Active'&&prev==='Available'){for(const id of q.participants){const a=live.get(id);if(!a)continue;let actor=this.actors.get(id);if(!actor){actor=this.make(a,false);this.actors.set(id,actor);}actor.departing=true;actor.departAge=0;actor.mode='Gather';actor.wait=.3;actor.queue=[];actor.target='front';}}
 if(this.initialized&&q.status==='Resolved'&&['Active','CompletedPendingResolution'].includes(prev)){for(const id of q.participants){const a=live.get(id);if(a&&!bound(state,id)){const actor=this.make(a,true);actor.mode='Return';this.actors.set(id,actor);}}}
 this.questStatus.set(q.id,q.status);}
 for(const a of live.values()){const locked=bound(state,a.id),injured=a.recovery>now;let actor=this.actors.get(a.id);if(locked){if(actor&&!actor.departing)this.actors.delete(a.id);continue;}if(!actor){actor=this.make(a,this.initialized&&!this.memberIds.has(a.id));this.actors.set(a.id,actor);}actor.name=a.name;actor.cls=a.cls;
 if(injured&&!actor.injured){actor.injured=true;actor.target='seat';if(!['Arrival','Return'].includes(actor.mode))this.walk(actor,'seat');}else if(!injured&&actor.injured){actor.injured=false;actor.mode='Idle';actor.wait=1;}
 }
 this.memberIds=new Set(state.members.map(a=>a.id));this.initialized=true;
 }
 walk(a,destination){a.target=destination;a.queue=route(a.point,destination);a.mode=a.departing?'Depart':'Walk';if(!a.queue.length){a.mode=a.departing?'Preparing':'Activity';a.wait=a.departing?.35:4;}}
 update(seconds,reduced=false){if(!Number.isFinite(seconds)||seconds<0)throw Error('Invalid visual delta');this.reduced=reduced;const dt=Math.min(seconds,.1);this.visualTime+=dt;
 for(const [id,a] of this.actors){if(a.departing){a.departAge+=dt;if(a.departAge>=3.4){this.actors.delete(id);continue;}}
 if(reduced){if(a.departing){this.actors.delete(id);continue;}if(['Arrival','Return','Walk'].includes(a.mode)){const destination=a.injured?'seat':a.target==='entrance'?'recruitment':a.target;a.point=destination;a.x=points[destination].x;a.y=points[destination].y;a.queue=[];a.mode='Activity';a.wait=8;}continue;}
 if(a.queue.length){const p=points[a.queue[0]],dx=p.x-a.x,dy=p.y-a.y,d=Math.hypot(dx,dy);const speed=(a.departing?.54:a.injured?.045:.078)*dt;a.facing=dx>=0?1:-1;
 if(d<=speed){a.x=p.x;a.y=p.y;a.point=a.queue.shift();if(!a.queue.length){if(a.departing&&a.point==='entrance'){this.actors.delete(id);continue;}a.mode=a.departing?'Preparing':'Activity';a.wait=a.departing?.3:4+(hash(a.id+':stay:'+a.sequence)%40)/10;}}else{a.x+=dx/d*speed;a.y+=dy/d*speed;}continue;}
 a.wait-=dt;if(a.wait>0)continue;
 if(a.mode==='Gather'){this.walk(a,'front');continue;}
 if(a.mode==='Preparing'){this.walk(a,'entrance');continue;}
 if(a.mode==='Arrival'||a.mode==='Return'){this.walk(a,a.injured?'seat':'recruitment');continue;}
 if(a.injured){if(a.point!=='seat')this.walk(a,'seat');else{a.mode='Activity';a.wait=8;}continue;}
 if(a.mode==='Activity'){a.mode='Idle';a.wait=1.4;continue;}
 a.sequence++;const choices=activities.filter(p=>p!==a.point);this.walk(a,choices[hash(a.id+':activity:'+a.sequence)%choices.length]);
 }
 }
 snapshot(){const all=[...this.actors.values()];return all.map(a=>{const peers=!a.injured&&a.mode==='Activity'&&all.some(b=>b.id!==a.id&&!b.injured&&b.mode==='Activity'&&b.point===a.point);return{...copy(a),x:a.x+a.offset,scale:.70+(a.y-.43)*1.6,z:Math.round(a.y*1000),activity:a.departing?'Bricht zur Quest auf':a.injured?'Ruht sich aus':peers?'Im Gespräch':points[a.point].activity||'Unterwegs',social:peers};});}
}
g.GuildHall={HallModel,points,route,activities};if(typeof module!=='undefined')module.exports=g.GuildHall;
})(typeof globalThis!=='undefined'?globalThis:window);
