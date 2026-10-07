/* Versioned new offers only. Existing frozen quest contracts are never rewritten. */
(function(g){'use strict';const R=g.GuildRules,P=g.GuildProgression,Q=g.GuildDynamicQuests;
const config=Object.freeze({version:'browser.quests.v4.2a',minimumPower:Object.freeze([180,470,760,1150]),multipliers:Object.freeze([.70,.95,1.25,1.65]),rewardSteps:Object.freeze({gold:6,xp:12,guildXP:5}),benchmarkFloors:Q.config.benchmarkFloors,maxBenchmark:Q.config.maxBenchmark});
function values(board,index){const q=Q.values(board,index);q.recommended=Math.max(config.minimumPower[index],Math.round(board.benchmarkPower*config.multipliers[index]));if(index){const previous=values(board,index-1);for(const k of ['gold','xp'])q[k]=Math.min(k==='xp'?Q.config.xp.cap:Number.MAX_SAFE_INTEGER,Math.max(q[k],previous[k]+config.rewardSteps[k]));q.dynamic.guildXP=Math.max(q.dynamic.guildXP,previous.dynamic.guildXP+config.rewardSteps.guildXP);}return q;}
function generate(s){const board={...s.questBoard,rulesVersion:config.version};s.questBoard=board;s.quests.filter(q=>q.status==='Available').forEach((q,i)=>Object.assign(q,values(board,i)));return s;}
const initial=R.initial,change=R.change;R.initial=()=>generate(initial());R.change=(s,op,args={},now=1000)=>{const out=change(s,op,args,now);return op==='offers'?generate(out):out;};
g.GuildEarlyBalance={config,values,generate};if(typeof module!=='undefined')module.exports=g.GuildEarlyBalance;
})(typeof globalThis!=='undefined'?globalThis:window);
