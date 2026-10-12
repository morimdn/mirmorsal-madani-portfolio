// Optional tonal palettes over the original product images. No reconstruction.
(() => {
  const palettes = [['original','Original'],['blue','Blue tone'],['gold','Gold tone']];
  let current = 'original';
  try { current = localStorage.getItem('portfolio-image-palette') || current; } catch {}
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
      `<button type="button" data-image-palette-button="${id}" aria-pressed="false"><span class="palette-swatch swatch-${id}" aria-hidden="true"></span>${label}</button>`).join('');
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
