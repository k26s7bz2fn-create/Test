/* DOM puppets driven only by HallModel snapshots. No gameplay references retained. */
(function(g){'use strict';
const classIndex={'class.warrior':0,'class.rogue':1,'class.mage':2,'class.priest':3};
function puppet(cls){const index=classIndex[cls]??0;return `<div class="hall-puppet class-rig-${index}"><div class="rig-shadow"></div><div class="rig-body"><span class="rig-piece rig-leg-left"></span><span class="rig-piece rig-leg-right"></span><span class="rig-piece rig-torso"></span><span class="rig-piece rig-arm-left"></span><span class="rig-piece rig-arm-right"></span><span class="rig-piece rig-head"></span></div></div>`;}
class HallView{
 constructor(model,onMember){this.model=model;this.onMember=onMember;this.nodes=new Map();this.layer=null;this.size={width:0,height:0};this.observer=null;}
 mount(layer){if(this.layer===layer)return;this.observer?.disconnect();this.layer=layer;this.nodes.clear();if(layer){layer.innerHTML='';const stage=layer.parentElement;const measure=()=>{this.size={width:stage.clientWidth,height:stage.clientHeight};};measure();if(typeof ResizeObserver!=='undefined'){this.observer=new ResizeObserver(measure);this.observer.observe(stage);}}}
 draw(){if(!this.layer)return;const actors=this.model.snapshot(),ids=new Set(actors.map(a=>a.id));for(const [id,node]of this.nodes)if(!ids.has(id)){node.remove();this.nodes.delete(id);}
 for(const a of actors){let node=this.nodes.get(a.id);if(!node){node=document.createElement('button');node.type='button';node.className='hall-resident';node.innerHTML=puppet(a.cls)+'<span class="resident-label"></span><span class="resident-activity"></span>';node.addEventListener('click',()=>this.onMember(a.id));this.layer.appendChild(node);this.nodes.set(a.id,node);}
 node.style.setProperty('--hall-x',(a.x*this.size.width)+'px');node.style.setProperty('--hall-y',(a.y*this.size.height)+'px');node.style.zIndex=String(a.z);node.style.setProperty('--depth',String(a.scale));node.style.setProperty('--face',String(a.facing));node.style.setProperty('--idle-delay',(-a.variant)+'s');node.style.setProperty('--tone',a.point==='fire'?'drop-shadow(0 0 5px #ecad6260)':a.point==='portal'?'drop-shadow(0 0 5px #929ce670)':'none');
 node.dataset.mode=a.mode;node.dataset.activity=a.injured?'rest':a.social?'talk':a.point;node.dataset.injured=a.injured?'true':'false';node.dataset.variant=String(a.variant);node.querySelector('.resident-label').textContent=a.name;node.querySelector('.resident-activity').textContent=a.activity;node.setAttribute('aria-label',a.name+' · '+a.activity+' · Mitgliederprofil öffnen');}
 }
}
g.GuildHallView={HallView,puppet};if(typeof module!=='undefined')module.exports=g.GuildHallView;
})(typeof globalThis!=='undefined'?globalThis:window);
