// Decorative reading cue. One paint per frame; no layout changes or smooth tweening.
(() => {
  const bar = document.querySelector('.reading-progress span');
  if (!bar) return;
  let pending = false;
  const update = () => {
    pending = false;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    bar.style.transform = `scaleX(${progress})`;
  };
  const schedule = () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  document.addEventListener('portfolio:project', schedule);
  if (typeof ResizeObserver === 'function') new ResizeObserver(schedule).observe(document.body);
  document.fonts?.ready.then(schedule);
  schedule();
})();
