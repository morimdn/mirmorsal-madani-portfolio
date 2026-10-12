const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(__dirname + '/product-scenes.js','utf8');
// Rendering must not require storage access; unsupported/corrupt preferences reset safely.
for (const storage of [{getItem(){throw Error('Storage blocked');}}, {getItem(){return 'invalid';}}]) {
  const events = {};
  const slot = {dataset:{}};
  const doc = {
    querySelectorAll(selector){return selector==='[data-product-slot],.lightbox-code'?[slot]:[];}, addEventListener(name,fn){events[name]=fn;},
    createElement(){return {dataset:{}, attrs:{}, setAttribute(k,v){this.attrs[k]=v;}, classList:{add(){}}, innerHTML:''};}
  };
  const win = {};
  vm.runInNewContext(source,{document:doc,window:win,localStorage:storage});
  const files = ['projects.html', ...fs.readdirSync(__dirname+'/case-studies').filter(x=>x.endsWith('.html')).map(x=>'case-studies/'+x)];
  const referenced = new Set(files.flatMap(file=>[...fs.readFileSync(path.join(__dirname,file),'utf8').matchAll(/assets\/projects\/([\w-]+)\.webp/g)].map(m=>m[1])));
  for(const key of referenced) {
    const scene = win.ProductScenes.render(key);
    assert(scene, 'Unreconstructed public image: '+key);
    assert(scene.innerHTML.includes('Reconstructed interface · sample data'));
    assert(!/<img\b|<canvas\b|background-image/i.test(scene.innerHTML),key+': raster-dependent reconstruction');
    assert(scene.innerHTML.length>350,key+': empty reconstruction');
  }
  assert.equal(win.ProductScenes.render('unknown'),null);
  const risk=win.ProductScenes.render('risk-overview').innerHTML;
  const crm=win.ProductScenes.render('crm-trader-room').innerHTML;
  assert(risk.includes('Overall Risk') && risk.includes('Top Exposure') && !risk.includes('Latest Transactions'));
  assert(crm.includes('Latest Transactions') && crm.includes('Quick Access') && !crm.includes('Overall Risk'));
  assert(win.ProductScenes.render('loyalty-quest-builder').innerHTML.includes('Activation conditions'));
  assert(win.ProductScenes.render('social-follow').innerHTML.includes('Risk multiplier'));
  assert(win.ProductScenes.render('crm-native-mobile-original').innerHTML.includes('AI Analysis'));
  assert(events.click);
  assert.equal(slot.dataset.productTheme,'navy');
  events.click({target:{closest:selector=>selector==='[data-product-theme-button]'?{dataset:{productThemeButton:'light'}}:null}});
  assert.equal(slot.dataset.productTheme,'light');
  events.click({target:{closest:selector=>selector==='[data-product-mode-button]'?{dataset:{productModeButton:'original'}}:null}});
  assert.equal(slot.dataset.productMode,'original');
  console.log(`PASS: ${referenced.size} public image references have raster-free, labeled interface reconstructions; distinct workflows; storage fallbacks.`);
}
// Section stepping must honor reduced motion and leave editing/modal keys alone.
for(const reduced of [false,true]) {
  let handler, moved, prevented=false;
  const sections=[0,700,1400].map(top=>({getBoundingClientRect:()=>({top}),scrollIntoView:options=>{moved={top,options};}}));
  const doc={querySelectorAll:()=>sections,querySelector:()=>null,addEventListener:(name,fn)=>{handler=fn;}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/main.js','utf8'),{document:doc,matchMedia:()=>({matches:reduced})});
  handler({key:'PageDown',target:{closest:()=>false},preventDefault(){prevented=true;}});
  assert(prevented);assert.equal(moved.top,700);assert.equal(moved.options.behavior,reduced?'instant':'smooth');
  moved=null;handler({key:'PageDown',target:{closest:()=>true}});assert.equal(moved,null);
}
console.log('PASS: section stepping, reduced motion and editable/modal key exclusions.');
