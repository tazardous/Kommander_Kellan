(() => {
const K=window.__KK; window.__KKmanual=true;
function reset(lv,tx,ty,keys){ K.loadLevel(lv); K.setLives(99); const P=K.P; P.x=tx*16+3; P.y=(ty+1)*16-22; P.vy=0; P.hearts=99; if(keys) K.setKeys(Object.assign({},keys)); for(const k in K.down) K.down[k]=false; }
function run(o,cond){
  // o: {pogo, wait, right, jumpAt, jumpLen}
  const P=K.P;
  for(let f=0;f<420;f++){
    const d=K.down; d.right=f>=o.wait&&f<o.wait+o.right; 
    const jf=f-o.wait-o.jumpAt; d.jump=jf>=0&&jf<o.jumpLen;
    if(jf===0) K.hit.add('jump');
    if(o.pogo&&f===o.wait) K.hit.add('pogo');
    K.step();
    if(K.state!=='play'&&K.state!=='levelEnd') return false;
    if(P.dead) return false;
    if(cond()) return true;
  }
  return false;
}
window.tryReach=(name,lv,starts,ty,condSrc,opt={})=>{
  const cond=new Function('K','P','return '+condSrc);
  const waits=opt.waits||[0];
  let tries=0;
  for(const sx of starts) for(const pogo of (opt.pogo===undefined?[false,true]:[opt.pogo])) for(const wait of waits)
   for(const right of (opt.rights||[20,40,60,90,140,400])) for(const jumpAt of (opt.jumpAts||[0,5,10,15,20,25,30,40,55,70])) for(const jumpLen of [4,25,400]){
    tries++; reset(lv,sx,ty,opt.keys);
    if(run({pogo,wait,right,jumpAt,jumpLen},()=>cond(K,K.P))) return {name,ok:true,tries,how:{sx,pogo,wait,right,jumpAt,jumpLen}};
  }
  return {name,ok:false,tries};
};
})();
