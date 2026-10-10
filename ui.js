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
