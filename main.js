// Preserve the original sphere, orbital rings, particles and pointer response.
// Lazy-loading keeps the static portfolio useful if the CDN or WebGL is unavailable.
const canvas = document.querySelector('#space');
const container = canvas?.parentElement;
const toggle = document.querySelector('.motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;
let visible = true;
let renderer;
let frame = 0;
let activeTime = 0;
let lastTime = 0;
let pointerX = 0;
let pointerY = 0;
// Tablets and coarse pointers retain the sphere with a smaller rendering budget.
const compactGlobe = innerWidth < 1050 || matchMedia('(pointer: coarse)').matches;

async function initGlobe() {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 8);
  renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
  const group = new THREE.Group();
  scene.add(group);
  const geometry = new THREE.IcosahedronGeometry(1.8, compactGlobe ? 4 : 7);
  const material = new THREE.MeshStandardMaterial({color:0x2f7fd3,roughness:0.42,metalness:0.7,emissive:0x65d8c2,emissiveIntensity:0.12,wireframe:true});
  group.add(new THREE.Mesh(geometry, material));
  const ringMaterial = new THREE.MeshBasicMaterial({color:0xC8A96B,transparent:true,opacity:0.38});
  for(let i=0;i<3;i+=1){
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4+i*0.42,0.008,12,100),ringMaterial);
    ring.rotation.x = Math.PI/(2.4+i*0.2);
    ring.rotation.y = i*0.72;
    group.add(ring);
  }
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = compactGlobe ? 120 : 320;
  const positions = new Float32Array(particleCount*3);
  for(let i=0;i<particleCount;i+=1){positions[i*3]=(Math.random()-0.5)*18;positions[i*3+1]=(Math.random()-0.5)*12;positions[i*3+2]=(Math.random()-0.5)*12;}
  particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const particles = new THREE.Points(particleGeometry,new THREE.PointsMaterial({color:0xe8f2ff,size:0.018,transparent:true,opacity:0.55}));
  scene.add(particles);
  const keyLight = new THREE.PointLight(0x4cc9a6,6,18);keyLight.position.set(-3,3,5);scene.add(keyLight);
  const warmLight = new THREE.PointLight(0xC8A96B,4,16);warmLight.position.set(4,-2,4);scene.add(warmLight);
  function draw(){
    const t=activeTime*0.001;
    group.rotation.y=t*0.18+pointerX*0.18;
    group.rotation.x=Math.sin(t*0.34)*0.12+pointerY*0.12;
    particles.rotation.y=t*0.035;particles.rotation.x=t*0.012;
    renderer.render(scene,camera);
  }
  function resize(){
    const {width,height}=container.getBoundingClientRect();
    camera.aspect=width/height;camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio,compactGlobe?1.25:1.5));
    renderer.setSize(width,height,false);draw();
  }
  function animate(time){
    frame=0;
    if(paused||!visible||document.hidden)return;
    if(!lastTime)lastTime=time;
    const elapsed=time-lastTime;
    if(elapsed>=1000/30){activeTime+=Math.min(elapsed,100);lastTime=time;draw();}
    frame=requestAnimationFrame(animate);
  }
  function sync(){
    cancelAnimationFrame(frame);frame=0;lastTime=0;
    toggle.textContent=paused?'Resume globe':'Pause globe';
    toggle.setAttribute('aria-pressed',String(paused));
    if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(animate);
    else draw();
  }
  toggle.addEventListener('click',()=>{paused=!paused;sync();});
  reducedMotion.addEventListener('change',event=>{paused=event.matches;pointerX=0;pointerY=0;sync();});
  container.addEventListener('pointermove',event=>{
    if(paused||reducedMotion.matches||event.pointerType==='touch')return;
    const rect=container.getBoundingClientRect();
    pointerX=((event.clientX-rect.left)/rect.width-0.5)*2;
    pointerY=((event.clientY-rect.top)/rect.height-0.5)*2;
  });
  container.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(container);
  new ResizeObserver(resize).observe(container);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();paused=true;cancelAnimationFrame(frame);container.classList.remove('globe-ready');toggle.hidden=true;});
  resize();container.classList.add('globe-ready');toggle.hidden=false;sync();
}
if(canvas&&container) initGlobe().catch(()=>{canvas.hidden=true;toggle.hidden=true;});
