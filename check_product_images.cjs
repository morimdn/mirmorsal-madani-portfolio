const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const {blocked,stored,expected} of [{blocked:false,stored:'invalid',expected:'original'},{blocked:true,stored:'invalid',expected:'original'},{blocked:false,stored:'blue',expected:'ocean'},{blocked:false,stored:'gold',expected:'amber'}]) {
  const handlers={},saved={};
  const image={dataset:{},classList:{add(value){this.value=value;}}};
  Object.defineProperty(image,'src',{get:()=> 'assets/projects/risk-overview.webp',set:()=>{throw Error('Original source mutated');}});
  const doc={
    body:{prepend(){}},createElementNS:()=>({setAttribute(){},classList:{add(){}}}),
    querySelectorAll:selector=>selector==='img[src*="assets/projects/"]'||selector==='.product-image-palette'?[image]:[],
    addEventListener:(name,fn)=>{handlers[name]=fn;}
  };
  const storage={getItem(){if(blocked)throw Error('Blocked');return stored;},setItem(k,v){if(blocked)throw Error('Blocked');saved[k]=v;}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/product-images.js','utf8'),{document:doc,window:{},localStorage:storage});
  assert.equal(image.dataset.imagePalette,expected);
  for(const palette of ['ocean','amber','original']) {
    handlers.click({target:{closest:()=>({dataset:{imagePaletteButton:palette}})}});
    assert.equal(image.dataset.imagePalette,palette);
    assert.equal(image.src,'assets/projects/risk-overview.webp');
  }
}
console.log('PASS: palette switching and blocked/corrupt storage preserve the original image URL.');
for(const reduced of [false,true]) {
  const make=(classes=[])=>({dataset:{},style:{},listeners:{},attrs:{},
    classList:{add(v){classes.push(v);},contains(v){return classes.includes(v);}},
    addEventListener(n,fn){this.listeners[n]=fn;},setAttribute(k,v){this.attrs[k]=v;},focus(){},
    setPointerCapture(id){this.capture=id;},hasPointerCapture(id){return this.capture===id;},releasePointerCapture(){this.capture=null;}
  });
  const nodes=Array.from({length:9},(_,i)=>{const n=make(i===0?['capability-center']:['capability-node']);n.textContent='Capability '+i;n.getBoundingClientRect=()=>({left:i===0?250:20+(i%3)*160,top:i===0?160:30+Math.floor(i/3)*100,width:100,height:70});return n;});
  const paths=[],svg={replaceChildren(){paths.length=0;},append(p){paths.push(p);},setAttribute(){}};
  const pause=make(),reset=make(),graph=make();
  graph.querySelectorAll=()=>nodes;graph.getBoundingClientRect=()=>({left:0,top:0,width:600,height:520});graph.append=()=>{};
  graph.querySelector=selector=>({'.leadership-connections':svg,'.network-pause':pause,'.network-reset':reset,'.capability-grid':{getBoundingClientRect:()=>({top:20,bottom:420})}}[selector]);
  const doc={hidden:false,querySelector:()=>graph,createElement:()=>make(),createElementNS:()=>make(),addEventListener(){}};
  let frames=0;
  vm.runInNewContext(fs.readFileSync(__dirname+'/product-network.js','utf8'),{
    document:doc,window:{addEventListener(){}},matchMedia:()=>({matches:reduced,addEventListener(){}}),
    requestAnimationFrame(){frames++;return frames;},cancelAnimationFrame(){}
  });
  assert.equal(paths.length,16);assert.equal(frames,reduced?0:1);assert.equal(pause.disabled,reduced);
  if(!reduced)pause.listeners.click();
  const before=paths[0].attrs.d;
  nodes[1].listeners.pointerdown({button:0,pointerId:1,clientX:0,clientY:0,preventDefault(){}});
  nodes[1].listeners.pointermove({pointerId:1,clientX:50,clientY:25});
  assert.notEqual(paths[0].attrs.d,before);assert(nodes[1].style.translate.includes('50px'));
  nodes[1].listeners.pointerup();assert.equal(nodes[1].dataset.dragging,'false');
  nodes[1].listeners.keydown({key:'Home',preventDefault(){}});assert.equal(nodes[1].style.translate,'0px 0px');
  nodes[1].listeners.keydown({key:'ArrowRight',preventDefault(){}});assert.equal(nodes[1].style.translate,'8px 0px');
  reset.listeners.click();assert.equal(nodes[1].style.translate,'0px 0px');
  nodes[1].listeners.pointerdown({button:0,pointerId:2,clientX:0,clientY:0,preventDefault(){}});
  nodes[1].listeners.pointermove({pointerId:2,clientX:9999,clientY:9999});
  const [x,y]=nodes[1].style.translate.split(' ').map(parseFloat);assert(x<=320&&y<=318);
}
console.log('PASS: pointer dragging, edge updates, bounds, keyboard movement, reset and reduced-motion behavior.');

// Gray UI pixels must stay neutral, while opposite chroma gets opposite accents.
const paletteSource=fs.readFileSync(__dirname+'/product-images.js','utf8');
for(const name of ['ocean','amber']) {
  const matrix=paletteSource.match(new RegExp(name+": '([^']+)'"))[1].split(' ').map(Number);
  assert.equal(matrix.length,20);
  for(let row=0;row<3;row++) assert(Math.abs(matrix.slice(row*5,row*5+3).reduce((a,b)=>a+b,0)-1)<1e-8);
  const apply=pixel=>[0,1,2].map(row=>pixel.reduce((sum,v,i)=>sum+v*matrix[row*5+i],0));
  for(const gray of [0,.2,.5,.8,1]) apply([gray,gray,gray]).forEach(v=>assert(Math.abs(v-gray)<1e-8));
  const warm=apply([.7,.5,.3]),cool=apply([.3,.5,.7]);
  assert(warm[0]>warm[2]);assert(cool[2]>cool[0]);
}
console.log('PASS: neutral brightness preserved and opposite chroma receives complementary accents.');
