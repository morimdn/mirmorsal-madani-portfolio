// DOM-level UI regression checks. Browser visual, WebGL and assistive-tech QA are separate.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
// Entry reveals never observe reduced-motion users and stop observing after entry.
for (const reduced of [false, true]) {
  let callback, disconnected = false, observed = false;
  const diagram = { dataset: {}, listeners: {}, classList: { add(value) { this.value=value; } }, addEventListener(name, fn) { this.listeners[name]=fn; } };
  const doc = { querySelector: selector => selector === '.leadership-diagram' ? diagram : null, querySelectorAll: () => [], addEventListener() {} };
  class Observer { constructor(fn) { callback=fn; } observe() { observed=true; } disconnect() { disconnected=true; } }
  vm.runInNewContext(fs.readFileSync(__dirname+'/ui.js','utf8'), { document: doc, matchMedia: () => ({matches:reduced}), IntersectionObserver: Observer });
  assert.equal(observed, !reduced);
  if (!reduced) {
    callback([{isIntersecting:false}]); assert.equal(diagram.classList.value, undefined);
    callback([{isIntersecting:true,intersectionRatio:.2}]); assert.equal(diagram.classList.value, undefined);
    callback([{isIntersecting:true,intersectionRatio:.5}]); assert(disconnected); assert.equal(diagram.classList.value, 'is-visible');
    diagram.listeners.animationend({animationName:'capability-reveal',target:{style:{getPropertyValue:()=> '7'}}});
    assert.equal(diagram.dataset.motionState,'complete');
  }
}
console.log('PASS: capability-map entry, observer cleanup and reduced-motion fallback.');
class Element {
  constructor(attrs={}) { this.attrs=attrs; this.listeners={}; this.hidden=false; this.dataset={}; this.classes=new Set(); this.focused=false; }
  getAttribute(key){return this.attrs[key];}
  setAttribute(key,value){this.attrs[key]=value;}
  addEventListener(type,fn){this.listeners[type]=fn;}
  focus(){this.focused=true;}
  get classList(){return {add:key=>this.classes.add(key),remove:key=>this.classes.delete(key),contains:key=>this.classes.has(key),toggle:(key,on)=>on?this.classes.add(key):this.classes.delete(key)};}
}
const menu=new Element({'aria-expanded':'false'}),nav=new Element(),filters=new Element(),count=new Element();
// Photo previews must work without hover and dismiss without trapping focus.
{
  const trigger=new Element(), card=new Element(), wrapper=new Element(), events={};
  wrapper.querySelector=()=>card;
  wrapper.contains=target=>target===trigger||target===card;
  const doc={activeElement:null,querySelector:selector=>({'.wordmark':wrapper,'.portrait-trigger':trigger}[selector]),querySelectorAll:()=>[],addEventListener:(name,fn)=>events[name]=fn};
  vm.runInNewContext(fs.readFileSync(__dirname+'/ui.js','utf8'),{document:doc});
  wrapper.listeners.pointerenter({pointerType:'mouse'}); assert.equal(trigger.getAttribute('aria-expanded'),'true');
  wrapper.listeners.pointerleave(); assert.equal(card.getAttribute('aria-hidden'),'true');
  wrapper.listeners.pointerenter({pointerType:'touch'}); assert.equal(trigger.getAttribute('aria-expanded'),'false');
  trigger.listeners.click(); assert.equal(trigger.getAttribute('aria-expanded'),'true');
  events.keydown({key:'Escape'}); assert.equal(trigger.getAttribute('aria-expanded'),'false');
  trigger.listeners.focus(); assert.equal(trigger.getAttribute('aria-expanded'),'true');
  wrapper.listeners.focusout({relatedTarget:null}); assert.equal(trigger.getAttribute('aria-expanded'),'false');
  trigger.listeners.click(); events.click({target:null}); assert.equal(trigger.getAttribute('aria-expanded'),'false');
  console.log('PASS: portrait mouse preview, touch/click, keyboard focus, Escape, focus departure and outside dismissal.');
}
const categories=['All','FinTech','Enterprise','AI','Consumer','Websites'];
const buttons=categories.map(category=>{const element=new Element();element.dataset.filter=category;return element;});
const productMapping=JSON.parse(fs.readFileSync(__dirname+'/ASSET-MAPPING.json','utf8'));
assert.equal(productMapping.projects.length,13);
const cards=productMapping.projects.map(({category})=>{const element=new Element();element.dataset.category=category;return element;});
assert.deepEqual(categories.map(category=>cards.filter(card=>category==='All'||card.dataset.category===category).length),[13,6,3,1,1,2]);
filters.querySelectorAll=()=>buttons;
const nodes={'.menu-toggle':menu,'.nav-links':nav,'.filters':filters,'.project-count':count,'.site-header':new Element()};
const document={listeners:{},querySelector:selector=>nodes[selector],querySelectorAll:()=>cards,addEventListener(type,fn){this.listeners[type]=fn;}};
const desktop={matches:false,addEventListener(type,fn){this.change=fn;}};
vm.runInNewContext(fs.readFileSync(__dirname+'/ui.js','utf8'),{document,matchMedia:()=>desktop});
menu.listeners.click();assert.equal(menu.getAttribute('aria-expanded'),'true');assert(nav.classList.contains('is-open'));
document.listeners.keydown({key:'Escape'});assert.equal(menu.getAttribute('aria-expanded'),'false');assert(menu.focused);
menu.listeners.click();nav.listeners.click({target:{closest:()=>true}});assert(!nav.classList.contains('is-open'));
menu.listeners.click();desktop.matches=true;desktop.change();assert(!nav.classList.contains('is-open'));
menu.listeners.click();document.listeners.click({target:{closest:()=>null}});assert(!nav.classList.contains('is-open'));
assert.equal(filters.hidden,false);
for (const button of buttons){
  filters.listeners.click({target:{closest:()=>button}});
  const expected=cards.filter(card=>button.dataset.filter==='All'||card.dataset.category===button.dataset.filter).length;
  assert.equal(cards.filter(card=>!card.hidden).length,expected);
  assert(count.textContent.startsWith(String(expected)));
  assert.equal(button.getAttribute('aria-pressed'),'true');
  assert.equal(buttons.filter(item=>item.getAttribute('aria-pressed')==='true').length,1);
}
console.log('PASS: menu open/close, Escape + focus return, navigation close, outside close, breakpoint close; all six project filters and live result count.');

// Scrollspy updates exactly one current section and excludes cross-page navigation.
const navLinks = ['#home','#work','#projects','#contact'].map(href => new Element({href}));
navLinks.forEach(link => {link.removeAttribute=key=>delete link.attrs[key];});
nav.querySelectorAll=()=>navLinks;
const hero=new Element();
const sections=navLinks.map((link,index)=>({top:index*1000,getBoundingClientRect(){return {top:this.top};}}));
let updateSection;
const frame=callback=>{updateSection=callback;};
const scrollDocument={...document,querySelector:selector=>selector==='.hero'?hero:selector.startsWith('#')?sections[navLinks.findIndex(link=>link.getAttribute('href')===selector)]:nodes[selector]};
vm.runInNewContext(fs.readFileSync(__dirname+'/ui.js','utf8'),{document:scrollDocument,matchMedia:()=>desktop,requestAnimationFrame:frame});
assert.equal(navLinks[0].getAttribute('aria-current'),'location');
sections[1].top=-10;sections[2].top=100;
scrollDocument.listeners.scroll();updateSection();
assert.equal(navLinks[2].getAttribute('aria-current'),'location');
assert.equal(navLinks.filter(link=>link.getAttribute('aria-current')).length,1);
sections[3].top=400;
scrollDocument.scrollingElement={scrollHeight:4000,clientHeight:1000,scrollTop:3000};
scrollDocument.listeners.scroll();updateSection();
assert.equal(navLinks[3].getAttribute('aria-current'),'location');
scrollDocument.scrollingElement.scrollTop=1500;
scrollDocument.listeners.scroll();updateSection();
assert.equal(navLinks[2].getAttribute('aria-current'),'location');
sections[3].top=120;scrollDocument.listeners.scroll();updateSection();
assert.equal(navLinks[3].getAttribute('aria-current'),'location');
assert.equal(navLinks.filter(link=>link.getAttribute('aria-current')).length,1);
console.log('PASS: navigation current-section state follows reading position without multiple active links.');

// Check image selection, keyboard cycling, close controls and opener focus.
// Native browser focus containment and Escape behavior require browser QA.
for (const numberOfImages of [1,3]) {
  const modal=new Element();
  const children=Object.fromEntries(['image','caption','count','close','prev','next','original'].map(key=>['.lightbox-'+key,new Element()]));
  children['.lightbox-original'].removeAttribute=function(key){delete this[key];};
  children['.lightbox-image'].removeAttribute=function(key){delete this[key];};
  modal.querySelector=key=>children[key];
  modal.showModal=()=>{modal.open=true;};
  modal.close=()=>{modal.open=false;modal.listeners.close();};
  modal.getBoundingClientRect=()=>({left:10,right:100,top:10,bottom:100});
  const links=Array.from({length:numberOfImages},(_,index)=>{
    const link=new Element({href:`image-${index}.webp`});
    link.dataset.caption=`Caption ${index}`;
    link.querySelector=()=>({alt:`Alt ${index}`,getAttribute:key=>key==='width'?'786':index===0?'3562':'500'});return link;
  });
  const galleryDocument={querySelector:key=>key==='#image-lightbox'?modal:null,querySelectorAll:()=>links,addEventListener(){}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/ui.js','utf8'),{document:galleryDocument});
  let prevented=false;
  links[0].listeners.click({preventDefault:()=>{prevented=true;}});
  assert(prevented && modal.open && children['.lightbox-close'].focused);
  assert.equal(children['.lightbox-image'].src,'image-0.webp');
  assert.equal(children['.lightbox-original'].href,'image-0.webp');
  assert.equal(children['.lightbox-original'].hidden,false);
  assert.equal(children['.lightbox-image'].alt,'Alt 0');
  assert.equal(children['.lightbox-image'].width,786);
  assert.equal(children['.lightbox-image'].height,3562);
  assert(modal.classes.has('tall-image'));
  assert.equal(children['.lightbox-caption'].textContent,'Caption 0');
  assert.equal(children['.lightbox-prev'].hidden,numberOfImages===1);
  modal.querySelectorAll=()=>['original','close','prev','next'].map(key=>children['.lightbox-'+key]);
  const lastControl=numberOfImages===1?children['.lightbox-close']:children['.lightbox-next'];
  galleryDocument.activeElement=lastControl;
  let tabPrevented=false;
  modal.listeners.keydown({key:'Tab',preventDefault(){tabPrevented=true;}});
  assert(tabPrevented && children['.lightbox-original'].focused);
  galleryDocument.activeElement=children['.lightbox-original'];
  lastControl.focused=false;
  modal.listeners.keydown({key:'Tab',shiftKey:true,preventDefault(){}});
  assert(lastControl.focused);
  modal.listeners.keydown({key:'ArrowLeft',preventDefault(){}});
  assert.equal(children['.lightbox-image'].src,`image-${numberOfImages-1}.webp`);
  assert.equal(children['.lightbox-original'].href,`image-${numberOfImages-1}.webp`);
  assert.equal(modal.classes.has('tall-image'),numberOfImages===1);
  children['.lightbox-next'].listeners.click();
  assert.equal(children['.lightbox-count'].textContent,`1 / ${numberOfImages}`);
  children['.lightbox-close'].listeners.click();
  assert(!modal.open && links[0].focused);
  assert.equal(children['.lightbox-image'].src,undefined);
  assert.equal(children['.lightbox-original'].href,undefined);
  assert.equal(children['.lightbox-original'].hidden,true);
  links[numberOfImages-1].listeners.click({preventDefault(){}});
  children['.lightbox-prev'].listeners.click();
  modal.listeners.click({target:modal,clientX:50,clientY:50});assert(modal.open);
  modal.listeners.click({target:modal,clientX:0,clientY:0});assert(!modal.open);
  assert(links[numberOfImages-1].focused);
}
console.log('PASS: single/multiple-image lightboxes, captions, alt text, arrow wrapping, next/previous, close/backdrop and opener focus restoration.');

// Reading cue clamps overscroll and remeasures after responsive/project changes.
{
  const bar={style:{}},events={},docEvents={},frames=[];
  const doc={documentElement:{scrollHeight:2000},body:{},querySelector:()=>bar,addEventListener:(n,f)=>docEvents[n]=f};
  const win={innerHeight:500,scrollY:0,addEventListener:(n,f)=>events[n]=f};
  let resize;
  vm.runInNewContext(fs.readFileSync(__dirname+'/reading-progress.js','utf8'),{
    document:doc,window:win,requestAnimationFrame:f=>frames.push(f),
    ResizeObserver:class{constructor(fn){resize=fn;}observe(){}}
  });
  const flush=()=>{while(frames.length)frames.shift()();};
  flush();assert.equal(bar.style.transform,'scaleX(0)');
  win.scrollY=750;events.scroll();events.scroll();assert.equal(frames.length,1);flush();assert.equal(bar.style.transform,'scaleX(0.5)');
  win.scrollY=3000;events.scroll();flush();assert.equal(bar.style.transform,'scaleX(1)');
  win.scrollY=-20;events.scroll();flush();assert.equal(bar.style.transform,'scaleX(0)');
  win.scrollY=750;doc.documentElement.scrollHeight=3500;docEvents['portfolio:project']();flush();assert.equal(bar.style.transform,'scaleX(0.25)');
  doc.documentElement.scrollHeight=500;resize();flush();assert.equal(bar.style.transform,'scaleX(0)');
  doc.documentElement.scrollHeight=2000;win.scrollY=1500;events.pageshow();flush();assert.equal(bar.style.transform,'scaleX(1)');
}
console.log('PASS: reading progress, overscroll clamps, frame batching, project resize and history restoration.');

// The final Contact section participates in keyboard section stepping as well as snap.
{
  let keydown,selected;
  const contact={getBoundingClientRect:()=>({top:800}),scrollIntoView:options=>selected=options};
  const earlier=Array.from({length:5},(_,i)=>({getBoundingClientRect:()=>({top:(i-4)*1000}),scrollIntoView(){}}));
  const doc={querySelectorAll:selector=>selector.includes('main > .contact')?[...earlier,contact]:earlier,querySelector:()=>null,addEventListener:(n,f)=>{if(n==='keydown')keydown=f;}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/main.js','utf8'),{document:doc,matchMedia:()=>({matches:false}),location:{hash:''},window:{addEventListener(){}},requestAnimationFrame:f=>f()});
  let prevented=false;
  keydown({key:'PageDown',target:{closest:()=>null},preventDefault(){prevented=true;}});
  assert(prevented);assert.equal(selected.block,'start');assert.equal(selected.behavior,'smooth');
}
console.log('PASS: PageDown from Research can reach Contact.');
