// Navigation and filters stay independent of WebGL and the external Three.js module.
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
  const desktop = matchMedia('(min-width: 761px)');
  desktop.addEventListener('change', () => { if (desktop.matches) closeMenu(); });
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
const lightbox = document.querySelector('#image-lightbox');
if (lightbox && typeof lightbox.showModal === 'function') {
  const imageLinks = [...document.querySelectorAll('[data-lightbox]')];
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
    caption.textContent = link.dataset.caption;
    count.textContent = `${current + 1} / ${imageLinks.length}`;
    prev.hidden = next.hidden = imageLinks.length < 2;
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
