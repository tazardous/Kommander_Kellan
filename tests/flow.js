(() => {
const K=window.__KK; window.__KKmanual=true;
const steps=(n,f)=>{ for(let i=0;i<n;i++){ if(f) f(i); K.step(); } };
const clear=()=>{ for(const k in K.down) K.down[k]=false; };
const tp=(tx,ty)=>{ const P=K.P; P.x=tx*16+3; P.y=(ty+1)*16-P.h; P.vy=0; P.vx=0; };
const out={};
// elevator: hop on at the bottom, ride up, walk onto the ledge
K.loadLevel(3); K.setLives(99); K.P.hearts=99;
const lift=K.ents.find(e=>e.lift&&e.by<e.ay);
// wait for the lift to be at the bottom, put Kellan on it
steps(400,()=>{}); let guard=0; while(!(lift.p<0.02&&lift.pd===1)&&guard++<600) K.step();
K.P.x=lift.x+10; K.P.y=lift.y-K.P.h; K.P.vy=0; clear();
let top=1e9; let g2=0; while(!(lift.p>=1)&&g2++<400){ K.step(); top=Math.min(top,K.P.y+K.P.h); }
K.down.right=true; steps(60); clear();
out.elevator={minFeet:top, ledgeTop:80, x:K.P.x/16, onLedge:K.P.x>90*16&&K.P.y+K.P.h<=81, dead:!!K.P.dead};
// boss
K.loadLevel(4); K.setLives(99); tp(81,11); K.P.hearts=99; K.P.inv=99999; K.P.face=1;
K.setAmmo(40); steps(5); out.bossAwake=K.boss&&!K.boss.dormant;
let i=0; while(K.boss&&i<4000){ K.P.inv=99999; K.P.hearts=99; K.P.face=K.boss.x>K.P.x?1:-1; if(i%14===0){ K.hit.add('zap'); } if(K.ammo<3) {/*refill*/} K.step(); i++; }
steps(3); out.bossFrames=i; out.bossDead=!K.boss;
const part=K.ents.find(e=>e.type==='part'); const exit=K.ents.find(e=>e.type==='exit');
out.partDropped=!!part; out.exitUnlocked=exit&&!exit.locked;
const arenaOpen=K.LV.t[10][76]===' '; out.arenaReopened=arenaOpen;
out.ammoLeft=K.ammo;
// full run: new game -> levels -> gate -> castle -> ending
localStorage.clear();
K.state='title'; clear(); K.hit.add('start'); K.step(); out.afterNew=K.state;
steps(40); K.hit.add('start'); K.step(); out.afterStory=K.state;
const play=(lv,partTx,partTy,exitTx)=>{
  K.loadLevel(lv); K.setLives(99);
  if(partTx!=null){ tp(partTx,partTy); steps(10); }
  tp(exitTx,11); steps(10);
  const s=K.state; steps(120); K.hit.add('start'); K.step(); return s+'->'+K.state;
};
out.L1=play(0,112,10,123); out.L2=play(1,128,10,134); out.L3=play(2,132,11,145);
steps(120); out.gate=K.game.gate; out.parts=Object.keys(K.game.parts).join(',');
out.L4=play(3,null,null,124);
// castle: kill king quickly
K.loadLevel(4); K.setLives(99); tp(81,11); steps(3); K.boss.hp=1; K.P.face=1; K.P.inv=9999; for(let j=0;j<300&&K.boss;j++){ K.P.face=K.boss.x>K.P.x?1:-1; if(j%14===0) K.hit.add('zap'); K.step(); } steps(3);
out.castleBoss={boss:!!K.boss,hp:K.boss&&K.boss.hp,dormant:K.boss&&K.boss.dormant,px:K.P.x/16,state:K.state,ammo:K.ammo}; const pt=K.ents.find(e=>e.type==='part'); if(!pt) return out; K.P.x=pt.x; K.P.y=pt.y; steps(5); out.thruster=K.partGot;
tp(105,11); steps(10); out.castleEnd=K.state; steps(120); K.hit.add('start'); K.step(); out.final=K.state;
steps(450); K.hit.add('start'); K.step(); out.afterEnding=K.state;
// game over
K.loadLevel(0); K.setLives(0); K.P.hearts=1; K.P.inv=0; tp(20,11); K.P.x=21*16+4; steps(200,()=>{}); out.gameOver=K.state;
return out;
})()
