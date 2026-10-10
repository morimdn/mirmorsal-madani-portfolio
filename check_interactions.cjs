// DOM-level UI regression checks. Browser visual, WebGL and assistive-tech QA are separate.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
class Element {
  constructor(attrs={}) { this.attrs=attrs; this.listeners={}; this.hidden=false; this.dataset={}; this.classes=new Set(); this.focused=false; }
  getAttribute(key){return this.attrs[key];}
  setAttribute(key,value){this.attrs[key]=value;}
  addEventListener(type,fn){this.listeners[type]=fn;}
  focus(){this.focused=true;}
  get classList(){return {add:key=>this.classes.add(key),remove:key=>this.classes.delete(key),contains:key=>this.classes.has(key),toggle:(key,on)=>on?this.classes.add(key):this.classes.delete(key)};}
}
const menu=new Element({'aria-expanded':'false'}),nav=new Element(),filters=new Element(),count=new Element();
const buttons=['All','FinTech','Enterprise','AI'].map(category=>{const element=new Element();element.dataset.filter=category;return element;});
const cards=['FinTech','FinTech','FinTech','FinTech','FinTech','Enterprise','AI','FinTech','Enterprise','Enterprise','FinTech','FinTech'].map(category=>{const element=new Element();element.dataset.category=category;return element;});
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
console.log('PASS: menu open/close, Escape + focus return, navigation close, outside close, breakpoint close; all four project filters and live result count.');
