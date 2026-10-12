// Navigation and filters stay independent of WebGL and the external Three.js module.
const portrait = document.querySelector('.wordmark');
const portraitTrigger = document.querySelector('.portrait-trigger');
if (portrait && portraitTrigger) {
  const card = portrait.querySelector('.portrait-card');
  let pinned = false;
  const showPortrait = open => {
    portrait.classList.toggle('portrait-open', open);
    portraitTrigger.setAttribute('aria-expanded', String(open));
    card.setAttribute('aria-hidden', String(!open));
  };
  portrait.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') showPortrait(true); });
  portrait.addEventListener('pointerleave', () => { if (!pinned && document.activeElement !== portraitTrigger) showPortrait(false); });
  portraitTrigger.addEventListener('focus', () => showPortrait(true));
  portraitTrigger.addEventListener('click', () => { pinned = !pinned; showPortrait(pinned); });
  portrait.addEventListener('focusout', event => {
    if (!portrait.contains(event.relatedTarget)) { pinned = false; showPortrait(false); }
  });
  document.addEventListener('click', event => {
    if (!portrait.contains(event.target)) { pinned = false; showPortrait(false); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { pinned = false; showPortrait(false); }
  });
}

// A short, one-time map reveal. Static content is the fallback for reduced motion
// and browsers without IntersectionObserver; no continuous animation runs.
const leadershipDiagram = document.querySelector('.leadership-diagram');
if (leadershipDiagram && typeof IntersectionObserver === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  leadershipDiagram.addEventListener('animationstart', () => { leadershipDiagram.dataset.motionState = 'running'; });
  leadershipDiagram.addEventListener('animationend', event => {
    if (event.animationName === 'capability-reveal' && event.target.style.getPropertyValue('--order') === '7') leadershipDiagram.dataset.motionState = 'complete';
  });
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .45)) {
      leadershipDiagram.classList.add('is-visible');
      observer.disconnect();
    }
  }, { threshold: .45 });
  observer.observe(leadershipDiagram);
}

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (menu && nav) {
  document.querySelector('.site-header').classList.add('nav-ready');
  const closeMenu = () => { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  const desktop = matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', () => { if (desktop.matches) closeMenu(); });
}

// Indicate the section being read without making a non-current Contact link active.
// Track the sticky-header reading position, including the end of smooth scrolling.
if (nav && typeof requestAnimationFrame === 'function' && document.querySelector('.hero')) {
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let activeIndex = -1;
  let pending = false;
  const markCurrent = () => {
    let current = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= 140) current = index;
    });
    // The last section may be too short to reach the header at the page bottom.
    const scroller = document.scrollingElement;
    if (scroller && scroller.scrollHeight > scroller.clientHeight &&
        scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) {
      current = sections.length - 1;
    }
    if (current === activeIndex) return;
    activeIndex = current;
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  document.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { markCurrent(); pending = false; });
  }, {passive: true});
  markCurrent();
}
const filters = document.querySelector('.filters');
if (filters) {
  filters.hidden = false;
  const cards = [...document.querySelectorAll('.project-card')];
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => { card.hidden = button.dataset.filter !== 'All' && card.dataset.category !== button.dataset.filter; });
    const count = cards.filter(card => !card.hidden).length;
    document.querySelector('.project-count').textContent = `${count} product ${count === 1 ? 'area' : 'areas'} · case-study overviews`;
  });
}

// Native modal semantics provide focus containment and Escape closing.
// Without JavaScript/support, every thumbnail still links to the real image.
function initializeLightbox(root = document) {
const lightbox = root.querySelector('#image-lightbox');
if (lightbox && typeof lightbox.showModal === 'function') {
  const imageLinks = [...root.querySelectorAll('[data-lightbox]')];
  const image = lightbox.querySelector('.lightbox-image');
  const caption = lightbox.querySelector('.lightbox-caption');
  const count = lightbox.querySelector('.lightbox-count');
  const close = lightbox.querySelector('.lightbox-close');
  const prev = lightbox.querySelector('.lightbox-prev');
  const next = lightbox.querySelector('.lightbox-next');
  const fullSize = lightbox.querySelector('.lightbox-original');
  let current = 0;
  let opener;
  const renderImage = () => {
    const link = imageLinks[current];
    image.src = link.getAttribute('href');
    fullSize.href = image.src;
    fullSize.hidden = false;
    image.alt = link.querySelector('img').alt;
    const thumbnail = link.querySelector('img');
    image.width = Number(thumbnail.getAttribute('width'));
    image.height = Number(thumbnail.getAttribute('height'));
    lightbox.classList.toggle('tall-image', image.height > image.width * 2);
    caption.textContent = link.dataset.caption;
    count.textContent = `${current + 1} / ${imageLinks.length}`;
    prev.hidden = next.hidden = imageLinks.length < 2;
    if (typeof window !== 'undefined') window.ProductImages?.applyLightbox(lightbox, link);
  };
  const move = direction => {
    current = (current + direction + imageLinks.length) % imageLinks.length;
    renderImage();
  };
  imageLinks.forEach((link, index) => link.addEventListener('click', event => {
    event.preventDefault();
    current = index;
    opener = link;
    renderImage();
    lightbox.showModal();
    close.focus();
  }));
  close.addEventListener('click', () => lightbox.close());
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = [...lightbox.querySelectorAll('a[href],button:not([disabled])')].filter(control => !control.hidden);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      const box = lightbox.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) lightbox.close();
    }
  });
  lightbox.addEventListener('close', () => {
    image.removeAttribute('src');
    fullSize.removeAttribute('href');
    fullSize.hidden = true;
    opener?.focus();
  });
}

}
initializeLightbox();
document.addEventListener('portfolio:project', () => initializeLightbox(document.querySelector('.project-stage-content')));
