(() => { const K=window.__KK; window.__KKmanual=true; const r={};
K.loadLevel(4); K.setLives(99); const P=K.P; P.x=81*16+3; P.y=12*16-22; K.setAmmo(40);
let i=0, fired=0; const hp=[]; while(K.boss&&i<3000){ P.inv=99999; P.hearts=99; P.face=K.boss.x>P.x?1:-1; if(i%14===0&&K.ammo>0){ K.hit.add('zap'); fired++; } K.step(); if(i%200===0) hp.push(K.boss?K.boss.hp:0); i++; }
for(let j=0;j<3;j++) K.step();
r.frames=i; r.fired=fired; r.hp=hp.join(','); r.dead=!K.boss; r.part=!!K.ents.find(e=>e.type==='part'); r.exit=!K.ents.find(e=>e.type==='exit').locked; r.reopen=K.LV.t[10][76]===' ';
return r; })()
