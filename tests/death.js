// Real-time check (game loop running normally): every way of losing a try must land back on the map, or game over on the last life.
(async () => {
const K=window.__KK; window.__KKmanual=false; const wait=ms=>new Promise(r=>setTimeout(r,ms)); const out={};
const t0=()=>K.step;
// 1) fall into the goo pit in Gloop Gardens
K.loadLevel(0); K.setLives(3); K.P.x=21*16+3; K.P.y=150; K.P.vy=0;
await wait(3000); out.fall={state:K.state, lives:K.lives};
// the map must still respond: walk right for a moment
const mx=K.MH_.x; K.down.right=true; await wait(600); K.down.right=false; out.mapMoves=K.MH_.x!==mx;
// 2) lose all hearts to spikes-free damage: touch a gloop with one heart left
K.loadLevel(0); K.setLives(2); const g=K.ents.find(e=>e.type==='gloop'); K.P.hearts=1; K.P.inv=0; K.P.x=g.x; K.P.y=g.y-4; K.P.vy=0;
await wait(3000); out.hearts={state:K.state, lives:K.lives};
// 3) last life: game over screen, then back to the title
K.loadLevel(2); K.setLives(0); K.P.x=31*16+3; K.P.y=100; K.P.vy=0;
await wait(3000); out.lastLife=K.state;
await wait(1500); K.hit.add('start'); await wait(300); out.afterGameOver=K.state;
return out;
})()
