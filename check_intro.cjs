const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(__dirname+'/index.html','utf8');
const source = html.match(/<script id="homepage-intro">([\s\S]*?)<\/script>/)[1];
function entry({referrer='',type='navigate',reduced=false}={}) {
  const classes = new Set(), events={}, frames=[],dataset={};
  vm.runInNewContext(source,{
    URL,
    document:{referrer,documentElement:{dataset,classList:{add:name=>classes.add(name),remove:name=>classes.delete(name)}},addEventListener:(name,callback)=>events[name]=callback},
    location:{origin:'https://morimdn.github.io'},
    performance:{getEntriesByType:()=>[{type}]},
    matchMedia:()=>({matches:reduced}),
    requestAnimationFrame:callback=>frames.push(callback),
  });
  return {classes,events,frames,dataset};
}
for(const options of [{},{type:'reload'},{referrer:'https://example.com/'}]) {
  const state=entry(options);
  assert(state.classes.has('intro-pending'));
  assert(!state.classes.has('intro-entry'));
  state.events.DOMContentLoaded();
  assert(!state.classes.has('intro-entry'));
  state.frames.shift()();state.frames.shift()();
  assert(state.classes.has('intro-entry')&&!state.classes.has('intro-pending'));
  assert.equal(state.dataset.introState,'running');
  for(const animationName of ['logo-reveal','name-reveal','hero-settle']) state.events.animationstart({animationName});
  assert.equal(state.dataset.introStarted.trim(),'logo-reveal name-reveal hero-settle');
  state.events.animationend({animationName:'hero-settle'});
  assert.equal(state.dataset.introState,'complete');
}
for(const options of [{referrer:'https://morimdn.github.io/mirmorsal-madani-portfolio/case-studies/mobile-crm.html'},{type:'back_forward'},{reduced:true}]) assert.equal(entry(options).classes.size,0);
assert(!html.includes('sessionStorage')&&!html.includes('Madani<span'));
console.log('PASS: direct/reload entry, DOM-ready reveal, real animation event tracking, internal/history suppression and reduced motion.');
