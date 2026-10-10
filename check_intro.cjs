// Entry behavior: repeat/internal navigation and restricted storage stay static.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(__dirname+'/index.html','utf8');
const source = html.match(/<script id="homepage-intro">([\s\S]*?)<\/script>/)[1];
function entry({seen=false,referrer='',type='navigate',reduced=false,restricted=false}={}) {
  const classes = new Set();
  const storage = new Map(seen ? [['portfolio-intro-seen','1']] : []);
  vm.runInNewContext(source,{
    URL,
    document:{referrer,documentElement:{classList:{add:name=>classes.add(name)}}},
    location:{origin:'https://morimdn.github.io'},
    performance:{getEntriesByType:()=>[{type}]},
    matchMedia:()=>({matches:reduced}),
    sessionStorage:{getItem:key=>{if(restricted)throw Error('Storage unavailable');return storage.get(key);},setItem:(key,value)=>storage.set(key,value)},
  });
  return {animated:classes.has('intro-entry'),seen:storage.has('portfolio-intro-seen')};
}
assert.deepEqual(entry(),{animated:true,seen:true});
for(const options of [
  {seen:true},
  {referrer:'https://morimdn.github.io/mirmorsal-madani-portfolio/case-studies/mobile-crm.html'},
  {type:'reload'},
  {type:'back_forward'},
  {reduced:true},
  {restricted:true},
]) assert.equal(entry(options).animated,false);
assert.equal(entry({referrer:'https://example.com/'}).animated,true);
assert(!html.includes('Madani<span'));
console.log('PASS: first-entry intro, repeat/internal navigation suppression, reload/history suppression, reduced motion and storage-failure fallback.');
