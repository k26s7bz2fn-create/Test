/* Progressive recruitment only. Existing V4 transactions, classes and strength remain authoritative. */
(function(g){'use strict';const R=g.GuildRules,P=g.GuildProgression;
const config=Object.freeze({ranges:Object.freeze([[1,1],[1,2],[1,4],[2,6],[3,8]].map(Object.freeze)),prices:Object.freeze([50,90,150,230,330,460,620,800]),weightDecay:2});
function price(a){if(!Number.isInteger(a.level)||a.level<1||a.level>8)throw Error('Ungültiges Rekrutenlevel');return config.prices[a.level-1];}
function weights(guildLevel){const [min,max]=config.ranges[guildLevel-1];return Array.from({length:max-min+1},(_,i)=>({level:min+i,weight:config.weightDecay**(max-min-i)}));}
function generatePool(s,pool){const guildLevel=P.guildLevel(s),ws=weights(guildLevel),sum=ws.reduce((n,w)=>n+w.weight,0);s.poolGuildLevel=guildLevel;return pool.map((a,i)=>{let pick=parseInt(R.hash('recruitment.level.v1',s.poolSeq,guildLevel,i).slice(0,8),16)/4294967296*sum;let level=ws.at(-1).level;for(const w of ws){if(pick<w.weight){level=w.level;break;}pick-=w.weight;}return{...a,rank:'F',level,xp:R.thresholds[level-1]};});}
const initial=R.initial;R.initial=()=>{const s=initial();s.poolGuildLevel=1;s.candidates=s.candidates.map(a=>({...a,rank:'F'}));return s;};
g.GuildRecruitment={config,price,weights,generatePool};if(typeof module!=='undefined')module.exports=g.GuildRecruitment;
})(typeof globalThis!=='undefined'?globalThis:window);
