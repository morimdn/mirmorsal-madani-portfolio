// Bounded, draggable SVG network. Movement never changes layout or page content.
(() => {
  const graph = document.querySelector('.product-system');
  if (!graph) return;
  const nodes = [...graph.querySelectorAll('.capability-center,.capability-node')];
  const svg = graph.querySelector('.leadership-connections');
  const pause = graph.querySelector('.network-pause');
  const reset = graph.querySelector('.network-reset');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const state = nodes.map((node,index) => ({node,index,x:0,y:0,dx:0,dy:0,baseX:0,baseY:0,width:0,height:0}));
  const edges = state.slice(1).map((item,index) => [0,index+1]);
  for (let index=1;index<state.length;index++) edges.push([index,index===state.length-1?1:index+1]);
  svg.replaceChildren();
  const paths = edges.map(() => {
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    svg.append(path); return path;
  });
  let width=0,height=0,contentTop=0,contentBottom=0,drag=null,paused=reduced.matches,visible=true,frame=0,last=0;
  const live = document.createElement('span');
  live.className='network-status';live.setAttribute('role','status');graph.append(live);
  graph.classList.add('network-ready');
  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
  function measure() {
    const box=graph.getBoundingClientRect();width=box.width;height=box.height;
    const grid=graph.querySelector('.capability-grid').getBoundingClientRect();contentTop=grid.top-box.top;contentBottom=grid.bottom-box.top;
    state.forEach(item => {
      item.node.style.translate='none';
      const rect=item.node.getBoundingClientRect();
      item.baseX=rect.left-box.left;item.baseY=rect.top-box.top;item.width=rect.width;item.height=rect.height;
      item.x=clamp(item.x,-item.baseX+2,width-item.baseX-item.width-2);
      item.y=clamp(item.y,contentTop-item.baseY+2,contentBottom-item.baseY-item.height-2);
    });
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);draw(0);
  }
  function draw(time) {
    state.forEach(item => {
      const drift = !paused&&!reduced.matches&&drag?.item!==item;
      const limitX=Math.min(6,Math.max(0,width-item.width)*.02);
      const limitY=4;
      item.dx=clamp(item.x+(drift?Math.sin(time*.00035+item.index*.8)*limitX:0),-item.baseX+2,width-item.baseX-item.width-2);
      item.dy=clamp(item.y+(drift?Math.cos(time*.0003+item.index*.7)*limitY:0),contentTop-item.baseY+2,contentBottom-item.baseY-item.height-2);
      item.node.style.translate=`${item.dx}px ${item.dy}px`;
    });
    edges.forEach(([a,b],index) => {
      const first=state[a],second=state[b];
      paths[index].setAttribute('d',`M${first.baseX+first.dx+first.width/2} ${first.baseY+first.dy+first.height/2}L${second.baseX+second.dx+second.width/2} ${second.baseY+second.dy+second.height/2}`);
    });
  }
  function tick(time) {
    if(time-last>=33){draw(time);last=time;}
    frame=requestAnimationFrame(tick);
  }
  function syncMotion() {
    cancelAnimationFrame(frame);frame=0;
    pause.setAttribute('aria-pressed',String(paused));
    pause.disabled=reduced.matches;
    pause.textContent=reduced.matches?'Reduced motion':paused?'Resume motion':'Pause motion';
    if(!paused&&!reduced.matches&&visible&&!document.hidden) frame=requestAnimationFrame(tick);
    else draw(0);
  }
  function move(item,x,y) {
    item.x=clamp(x,-item.baseX+2,width-item.baseX-item.width-2);
    item.y=clamp(y,contentTop-item.baseY+2,contentBottom-item.baseY-item.height-2);
    draw(last);
  }
  function finish(cancel=false) {
    if(!drag)return;
    const {item,startX,startY,pointerId}=drag;
    if(cancel)move(item,startX,startY);
    item.node.dataset.dragging='false';
    if(item.node.hasPointerCapture(pointerId))item.node.releasePointerCapture(pointerId);
    drag=null;draw(last);
  }
  state.forEach(item => {
    const label=item.node.classList.contains('capability-center')?'Product Leadership':item.node.textContent.trim().replace(/\s+/g,' ');
    item.node.setAttribute('role','button');item.node.tabIndex=0;
    item.node.setAttribute('aria-label',label+'. Drag or use arrow keys to move.');
    item.node.setAttribute('aria-describedby','network-help');
    item.node.addEventListener('pointerdown',event => {
      if(event.button!==0||drag)return;
      event.preventDefault();
      item.node.focus({preventScroll:true});
      drag={item,startX:item.x,startY:item.y,clientX:event.clientX,clientY:event.clientY,pointerId:event.pointerId};
      item.node.dataset.dragging='true';item.node.setPointerCapture(event.pointerId);
    });
    item.node.addEventListener('pointermove',event => {
      if(drag?.item!==item||drag.pointerId!==event.pointerId)return;
      move(item,drag.startX+event.clientX-drag.clientX,drag.startY+event.clientY-drag.clientY);
    });
    item.node.addEventListener('pointerup',() => finish());
    item.node.addEventListener('pointercancel',() => finish(true));
    item.node.addEventListener('lostpointercapture',() => finish());
    item.node.addEventListener('keydown',event => {
      if(event.key==='Escape'){finish(true);return;}
      if(event.key==='Home'){event.preventDefault();move(item,0,0);live.textContent=label+' position reset.';return;}
      const delta={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-8],ArrowDown:[0,8]}[event.key];
      if(!delta)return;
      event.preventDefault();move(item,item.x+delta[0],item.y+delta[1]);
    });
  });
  pause.addEventListener('click',() => {paused=!paused;syncMotion();});
  reset.addEventListener('click',() => {finish();state.forEach(item=>{item.x=item.y=0;});draw(last);live.textContent='Network layout reset.';});
  reduced.addEventListener('change',() => {paused=reduced.matches;syncMotion();});
  document.addEventListener('visibilitychange',syncMotion);
  if(typeof ResizeObserver==='function')new ResizeObserver(measure).observe(graph);
  else window.addEventListener('resize',measure);
  if(typeof IntersectionObserver==='function')new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting);syncMotion();},{threshold:.05}).observe(graph);
  measure();syncMotion();
})();
