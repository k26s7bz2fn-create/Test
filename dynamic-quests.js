/* Version-pinned generation. No wall-clock RNG, no Combat RNG, no live rescaling. */
(function(g){'use strict';
const R=g.GuildRules,P=g.GuildProgression;
const freeze=o=>{Object.values(o).forEach(v=>{if(v&&typeof v==='object')freeze(v);});return Object.freeze(o);};
const config=freeze({version:'browser.quests.v4.1b',partySize:6,benchmarkFloors:[260,400,600,850,1100],maxBenchmark:10000,
 multipliers:[.70,.95,1.25,1.65],minimumPower:[180,240,320,420],rewardDifficulty:[.85,1,1.12,1.25],
 gold:{base:20,perPower:.04},xp:{base:30,perPower:.10,cap:600},guildXP:{base:8,perPower:.022},
 types:[{gold:1,xp:.9,guildXP:1,drop:.03},{gold:1.15,xp:.95,guildXP:1,drop:-.03},{gold:1,xp:1.15,guildXP:1,drop:.03},{gold:.95,xp:1.1,guildXP:1.2,drop:0}],
 distances:{Nah:.95,Mittel:1,Weit:1.15},variationMin:.95,variationMax:1.05,
 drops:[.30,.38,.46,.54],maxDrop:.65,dropGrowth:.06,uncommon:[.05,.28,.5,.55],rare:[0,.02,.10,.25],maxRare:.30,rarityGrowth:.04});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function benchmark(s,now){return Math.max(config.benchmarkFloors[P.guildLevel(s)-1],s.members.filter(a=>R.available(a,now)).map(a=>P.power(a)).sort((a,b)=>b-a).slice(0,config.partySize).reduce((a,b)=>a+b,0));}
const draw=(sequence,index,domain)=>parseInt(R.hash(config.version,String(sequence),String(index),domain).slice(0,8),16)/4294967296;
function values(board,index){const type=Math.floor(draw(board.generationSequence,index,'type')*4),distance=Object.keys(config.distances)[Math.floor(draw(board.generationSequence,index,'distance')*3)],t=config.types[type],d=config.distances[distance],f=config.rewardDifficulty[index];
 const recommended=Math.max(config.minimumPower[index],Math.round(board.benchmarkPower*config.multipliers[index]));
 const variation=config.variationMin+(config.variationMax-config.variationMin)*draw(board.generationSequence,index,'reward');
 const reward=(c,mod)=>Math.max(1,Math.min(c.cap||Number.MAX_SAFE_INTEGER,Math.round((c.base+c.perPower*recommended)*f*d*mod*variation)));
 const growth=clamp((recommended-240)/4000,0,1),rare=Math.min(config.maxRare,config.rare[index]+growth*config.rarityGrowth*(index===0?.25:1)),uncommon=config.uncommon[index];
 return{type,distance,tier:P.config.tiers[index].id,recommended,gold:reward(config.gold,t.gold),xp:reward(config.xp,t.xp),duration:P.config.tiers[index].duration,
 dynamic:{...board,guildXP:reward(config.guildXP,t.guildXP),drop:clamp(config.drops[index]+growth*config.dropGrowth+t.drop+(d-1)*.05,0,config.maxDrop),rarities:[1-uncommon-rare,uncommon,rare],variation}};
}
function generate(s,now){const fresh=s.quests.filter(q=>q.status==='Available'),board={benchmarkPower:benchmark(s,now),guildLevelAtGeneration:P.guildLevel(s),generationSequence:Math.ceil(s.offerSeq/4),rulesVersion:config.version};
 if(fresh.length!==4||board.benchmarkPower>config.maxBenchmark)throw Error('Ungültige Questgenerierung');
 s.questBoard=board;fresh.forEach((q,i)=>{Object.assign(q,values(board,i));q.name=['Kräuter am Waldrand','Lieferung zum Außenposten','Goblin-Spuren','Vermisste Reisende'][q.type];});return s;}
const initial=R.initial,change=R.change;
R.initial=()=>generate(initial(),1000);
R.change=(s,op,args={},now=1000)=>{const out=change(s,op,args,now);if(op==='offers')generate(out,now);return out;};
g.GuildDynamicQuests={config,benchmark,values,generate};if(typeof module!=='undefined')module.exports=g.GuildDynamicQuests;
})(typeof globalThis!=='undefined'?globalThis:window);
