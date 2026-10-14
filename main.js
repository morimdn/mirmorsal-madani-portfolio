// Progressive case studies and native document scrolling; no WebGL dependency.
(() => {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = [...document.querySelectorAll('main .hero, main > .section, main > .contact')];
  // Restore a requested section once the initial asynchronous case has sized the page.
  const entryHash = location.hash, entryTarget = sections.find(section => '#'+section.id === entryHash);
  let entryPending = !!entryTarget;
  const cancelEntry = () => { entryPending = false; };
  window.addEventListener('wheel', cancelEntry, {passive:true,once:true});
  window.addEventListener('touchmove', cancelEntry, {passive:true,once:true});
  const settleEntryAnchor = () => {
    if (!entryPending) return;
    entryPending = false;
    requestAnimationFrame(() => {
      if (location.hash === entryHash) entryTarget.scrollIntoView({behavior:'instant',block:'start'});
    });
  };
  document.addEventListener('keydown', event => {
    if (['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(event.key)) cancelEntry();
  });
  const selector = document.querySelector('.project-selector');
  if (!selector) return;
  const stage=document.querySelector('.project-stage'), content=document.querySelector('.project-stage-content'), message=document.querySelector('.project-message');
  const choices=[...selector.querySelectorAll('[data-project]')], cache=new Map();
  let request=0;
  async function selectProject(choice,{scroll=false,updateHash=true}={}) {
    const token=++request; stage.setAttribute('aria-busy','true'); message.classList.remove('project-status-only'); message.textContent='Loading project…';
    try {
      const url=new URL(choice.getAttribute('href'),location.href);
      let source=cache.get(url.href);
      if (!source) { const response=await fetch(url); if(!response.ok) throw new Error('Case unavailable'); source=await response.text(); cache.set(url.href,source); }
      if(token!==request) return;
      const page=new DOMParser().parseFromString(source,'text/html'), main=page.querySelector('main');
      const prefix=`project-${choice.dataset.project}-`;
      main.querySelectorAll('h1,h2').forEach(h=>{const replacement=document.createElement(h.tagName==='H1'?'h3':'h4');replacement.innerHTML=h.innerHTML;h.replaceWith(replacement);});
      main.querySelectorAll('[id]').forEach(node=>{node.id=prefix+node.id;});
      main.querySelectorAll('[src],[href]').forEach(node=>{for(const attr of ['src','href']){const value=node.getAttribute(attr);if(value)node.setAttribute(attr,value.startsWith('#')?'#'+prefix+value.slice(1):new URL(value,url).href);}});
      main.querySelectorAll('.breadcrumb').forEach(link=>{link.href=url.href;link.textContent='Open standalone case study ↗';});
      main.querySelectorAll('.actions').forEach(node=>node.remove());
      main.querySelectorAll('img').forEach(img=>{img.loading='lazy';});
      content.replaceChildren(...main.childNodes);
      const dialog=page.querySelector('#image-lightbox');if(dialog)content.append(dialog);
      choices.forEach(item=>{if(item===choice)item.setAttribute('aria-current','true');else item.removeAttribute('aria-current');});
      window.ProductImages?.enhance(content); document.dispatchEvent(new Event('portfolio:project'));
      content.classList.remove('is-entering');void content.offsetWidth;content.classList.add('is-entering');message.classList.add('project-status-only');message.textContent=choice.textContent.trim().replace('↗','')+' case study loaded.';
      if(updateHash)history.replaceState(null,'','#project-'+choice.dataset.project);
      if(scroll)stage.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'});
    }catch(error){if(token===request){message.classList.remove('project-status-only');const fallback=document.createElement('a');fallback.href=choice.href;fallback.textContent='Open full case study ↗';message.replaceChildren('Unable to load this preview. ',fallback);}}
    finally{if(token===request){stage.setAttribute('aria-busy','false');settleEntryAnchor();}}
  }
  selector.addEventListener('click',event=>{const choice=event.target.closest('[data-project]');if(!choice||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();selectProject(choice,{scroll:matchMedia('(max-width: 650px)').matches});});
  const fromHash=choices.find(c=>location.hash==='#project-'+c.dataset.project);
  selectProject(fromHash||choices[0],{scroll:!!fromHash,updateHash:false});
  window.addEventListener('hashchange',()=>{const choice=choices.find(c=>location.hash==='#project-'+c.dataset.project);if(choice)selectProject(choice,{scroll:true,updateHash:false});});
})();
