/* V4.2B presentation adapter. Generated whole-character art; no game-state mutation. */
(function(g){'use strict';
const R=g.GuildRules,esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const freeze=o=>{Object.values(o).forEach(v=>{if(v&&typeof v==='object')freeze(v);});return Object.freeze(o);};
const catalog=freeze({
 'class.warrior':{name:'Krieger',asset:'assets/epic/warrior.webp',weapon:'Schwert',material:'Stahl / Bronze / roter Stoff'},
 'class.rogue':{name:'Schurke',asset:'assets/epic/rogue.webp',weapon:'Dolche',material:'Leder / dunkles Petrol'},
 'class.mage':{name:'Magier',asset:'assets/epic/mage.webp',weapon:'Arkaner Stab',material:'Indigo / violetter Stoff'},
 'class.priest':{name:'Priester',asset:'assets/epic/priest.webp',weapon:'Zeremonieller Streitkolben',material:'Elfenbein / Gold / Stoff'}
});
// Future full-body loadout atlases use CLASS|WeaponDef|UpperBodyDef|LegsDef keys.
// The intentionally empty map never invents an equipped item or rarity variant.
const variants=freeze({});
const slots=Object.freeze(['Weapon','UpperBody','Legs']),views=Object.freeze(['three','side','back']);
const supports=a=>!!catalog[a.cls||a.def];
const loadoutKey=a=>[a.cls||a.def,...slots.map(slot=>a.gear?.[slot]?.def||'')].join('|');
function resolve(a){const cls=a.cls||a.def,base=catalog[cls];if(!base)return null;const key=loadoutKey(a),variant=variants[key];return{...base,cls,key,asset:variant?.asset||base.asset,variant:variant?'loadout':'base',equipped:Object.fromEntries(slots.map(slot=>[slot,a.gear?.[slot]?.def||null])),cell:{width:400,height:640},foot:[.5,.95625]};}
const height=stageHeight=>Math.max(98,Math.min(202,stageHeight*.42));
function markup(a,identity){const v=resolve(a);if(!v)return '';return `<div class="visual-shadow epic-shadow"></div><div class="visual-facing epic-facing" data-epic-class="${esc(v.cls)}" data-loadout-key="${esc(v.key)}" data-visual-mode="${v.variant}" style="--identity-hue:${identity.hue}deg;--idle-delay:-${identity.phase}s"><div class="epic-rig">${views.map((view,i)=>`<div class="direction-view direction-${i}" data-epic-view="${view}"><span class="epic-sprite" style="background-image:url('${v.asset}');--epic-x:${i*50}%" role="img" aria-label="${esc(v.name)} · ${esc(v.weapon)} · Klassen-Grundausstattung"></span></div>`).join('')}</div></div>`;}
g.GuildEpicVisuals={catalog,variants,slots,views,supports,loadoutKey,resolve,height,markup};if(typeof module!=='undefined')module.exports=g.GuildEpicVisuals;
})(typeof globalThis!=='undefined'?globalThis:window);
