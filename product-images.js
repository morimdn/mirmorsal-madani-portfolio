// Optional tonal palettes over the original product images. No reconstruction.
(() => {
  const palettes = [['original','Original'],['ocean','Ocean'],['amber','Amber']];
  // Preserve neutral UI pixels; rotate chromatic differences into opposing accents.
  const matrices = {
    ocean: '.6126 .7152 -.3278 0 0 .3126 .7152 -.0278 0 0 -.2674 .7152 .5522 0 0 0 0 0 1 0',
    amber: '.4126 .7152 -.1278 0 0 .4626 .7152 -.1778 0 0 -.1374 .7152 .4222 0 0 0 0 0 1 0'
  };
  const filters = document.createElementNS('http://www.w3.org/2000/svg','svg');
  filters.setAttribute('width','0'); filters.setAttribute('height','0');
  filters.setAttribute('aria-hidden','true'); filters.setAttribute('focusable','false');
  filters.classList.add('image-palette-defs');
  filters.innerHTML='<defs>'+Object.entries(matrices).map(([name,values])=>
    `<filter id="product-palette-${name}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${values}"/></filter>`).join('')+'</defs>';
  document.body.prepend(filters);
  let current = 'original';
  try { current = localStorage.getItem('portfolio-image-palette') || current; } catch {}
  current = ({blue:'ocean',gold:'amber'})[current] || current;
  if (!palettes.some(([id]) => id === current)) current = 'original';
  function sync(root = document) {
    root.querySelectorAll('.product-image-palette').forEach(image => { image.dataset.imagePalette = current; });
    root.querySelectorAll('[data-image-palette-button]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.imagePaletteButton === current));
    });
  }
  function toolbar(host, before = null) {
    if (host.querySelector(':scope > .product-palette')) return;
    const bar = document.createElement('div');
    bar.className = 'product-palette'; bar.setAttribute('role','group');
    bar.setAttribute('aria-label','Original image color palette');
    bar.innerHTML = '<span>Image palette</span>' + palettes.map(([id,label]) =>
      `<button type="button" data-image-palette-button="${id}" aria-pressed="false" title="${id==='ocean'?'Blue · Copper':id==='amber'?'Gold · Violet':'Unchanged original image'}"><span class="palette-swatch swatch-${id}" aria-hidden="true"></span>${label}</button>`).join('');
    if (before) before.before(bar); else host.prepend(bar);
  }
  function enhance(root = document) {
    root.querySelectorAll('img[src*="assets/projects/"]').forEach(image => {
      image.classList.add('product-image-palette');
    });
    root.querySelectorAll('.case-content,.projects .wrap').forEach(host => {
      if (host.querySelector('img[src*="assets/projects/"]')) toolbar(host);
    });
    sync(root);
  }
  function applyLightbox(dialog) {
    const image = dialog.querySelector('.lightbox-image');
    image.classList.add('product-image-palette'); image.hidden = false;
    toolbar(dialog, dialog.querySelector('figure'));
    dialog.querySelector('.lightbox-original').textContent = 'Open original image ↗';
    sync(dialog);
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-image-palette-button]');
    if (!button) return;
    current = button.dataset.imagePaletteButton;
    try { localStorage.setItem('portfolio-image-palette',current); } catch {}
    sync();
  });
  window.ProductImages = {enhance, applyLightbox};
  enhance();
})();
