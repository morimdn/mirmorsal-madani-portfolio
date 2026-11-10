// Instrument panel. Each capability is a dial; Product Leadership is the attitude
// indicator. Nodes stay draggable inside the panel; needles and the horizon react
// to movement through a damped spring, the way real instruments lag and settle.
// Layout and page content never change; without JS the labels stand alone.
(() => {
  const graph = document.querySelector('.product-system');
  if (!graph) return;
  const NS = 'http://www.w3.org/2000/svg';
  const nodes = [...graph.querySelectorAll('.capability-center,.capability-node')];
  const svg = graph.querySelector('.leadership-connections');
  const pause = graph.querySelector('.network-pause');
  const reset = graph.querySelector('.network-reset');
  const panel = graph.closest('.hero-visual');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // ---- dial artwork -------------------------------------------------------
  const polar = (r, deg) => { const a = (deg - 90) * Math.PI / 180; return [60 + r * Math.cos(a), 60 + r * Math.sin(a)]; };
  const seg = (r1, r2, deg) => { const [x1, y1] = polar(r1, deg), [x2, y2] = polar(r2, deg); return `M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`; };
  const arc = (r, a1, a2) => { const [x1, y1] = polar(r, a1), [x2, y2] = polar(r, a2); return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`; };
  const screws = [45, 135, 225, 315].map(deg => {
    const [x, y] = polar(54.5, deg);
    return `<circle class="screw" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.3"/><path class="screw-slot" d="M${(x - 1.5).toFixed(2)} ${(y + 1.5).toFixed(2)}L${(x + 1.5).toFixed(2)} ${(y - 1.5).toFixed(2)}"/>`;
  }).join('');
  const numeral = (r, deg, text) => { const [x, y] = polar(r, deg); return `<text class="numeral" x="${x.toFixed(2)}" y="${y.toFixed(2)}">${text}</text>`; };
  // Three face families so the panel reads as distinct instruments, not one gauge cloned.
  const scale = (from, to, steps, majorEvery, label) => {
    let minor = '', major = '', nums = '';
    for (let i = 0; i <= steps; i++) {
      const deg = from + i * (to - from) / steps;
      if (i % majorEvery === 0) { major += seg(49, 40, deg); if (label) nums += numeral(32.5, deg, label(i / majorEvery)); }
      else minor += seg(49, 44.5, deg);
    }
    return `<path class="ticks-minor" d="${minor}"/><path class="ticks-major" d="${major}"/>${nums}`;
  };
  // Plain gauges: bezel, face, one tick scale, a needle. Only the attitude indicator carries detail.
  const gauge = () => `
    <circle class="bezel" cx="60" cy="60" r="58"/>
    <circle class="face" cx="60" cy="60" r="50"/>
    ${scale(-135, 135, 24, 3, n => n)}
    <g class="needle"><path d="M60 60L60 19"/></g>
    <circle class="hub" cx="60" cy="60" r="4"/>`;
  let bank = '';
  [-60, -45, -30, -20, -10, 10, 20, 30, 45, 60].forEach(deg => { bank += seg(50, Math.abs(deg) % 30 === 0 ? 42 : 45.5, deg); });
  const attitude = `
    <defs><clipPath id="attitude-clip"><circle cx="60" cy="60" r="50"/></clipPath></defs>
    <circle class="bezel" cx="60" cy="60" r="58"/><circle class="bezel-ring" cx="60" cy="60" r="51.5"/>${screws}
    <g clip-path="url(#attitude-clip)"><g class="horizon">
      <rect class="sky" x="-40" y="-60" width="200" height="120"/><rect class="ground" x="-40" y="60" width="200" height="120"/>
      <path class="horizon-line" d="M-40 60H160"/>
      <path class="ladder" d="M50 50H70M44 40H76M50 70H70M44 80H76"/>
    </g></g>
    <path class="bank-ticks" d="${bank}"/><path class="bank-ticks" d="M60 10L56.5 4H63.5Z" fill="currentColor"/>
    <path class="aircraft" d="M30 60H47L53 66H67L73 60H90"/><circle class="aircraft-dot" cx="60" cy="60" r="2.2"/>
    <circle class="glass" cx="60" cy="60" r="50"/>`;

  const defs = document.createElementNS(NS, 'svg');
  defs.setAttribute('width', '0'); defs.setAttribute('height', '0'); defs.setAttribute('aria-hidden', 'true');
  defs.style.position = 'absolute';
  defs.innerHTML = '<defs><radialGradient id="instrument-glass" cx="35%" cy="25%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".45" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></radialGradient>'
    + '<radialGradient id="instrument-edge-light" cx="50%" cy="50%" r="50%"><stop offset=".72" stop-color="#93f5b6" stop-opacity="0"/><stop offset=".97" stop-color="#93f5b6" stop-opacity=".09"/><stop offset="1" stop-color="#93f5b6" stop-opacity="0"/></radialGradient></defs>';
  graph.prepend(defs);

  const state = nodes.map((node, index) => {
    const center = node.classList.contains('capability-center');
    const dial = document.createElementNS(NS, 'svg');
    dial.setAttribute('viewBox', '0 0 120 120');
    dial.setAttribute('class', center ? 'instrument instrument-attitude' : 'instrument');
    dial.setAttribute('aria-hidden', 'true'); dial.setAttribute('focusable', 'false');
    // each dial rests somewhere inside its green arc; no values are implied
    const variant = index % 3;
    const rest = center ? 0 : Math.round((variant === 1 ? 10 : -10) + 58 * Math.sin(index * 1.9 + .4));
    dial.innerHTML = center ? attitude : gauge(variant, rest, index);
    node.prepend(dial);
    return {
      node, index, center, rest,
      needle: dial.querySelector('.needle'), horizon: dial.querySelector('.horizon'),
      x: 0, y: 0, dx: 0, dy: 0, pdx: 0, pdy: 0, vx: 0, vy: 0,
      baseX: 0, baseY: 0, width: 0, height: 0,
      angle: reduced.matches ? rest : -135, av: 0, pitch: 0, pv: 0
    };
  });

  // ---- connections ------------------------------------------------------
  const edges = state.slice(1).map((item, index) => [0, index + 1]);
  for (let index = 1; index < state.length; index++) edges.push([index, index === state.length - 1 ? 1 : index + 1]);
  svg.replaceChildren();
  const paths = edges.map(() => { const path = document.createElementNS(NS, 'path'); svg.append(path); return path; });

  let width = 0, height = 0, contentTop = 0, contentBottom = 0, drag = null, paused = reduced.matches,
      visible = false, frame = 0, last = 0, poweredAt = 0;
  const live = document.createElement('span');
  live.className = 'network-status'; live.setAttribute('role', 'status'); graph.append(live);
  graph.classList.add('network-ready');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function measure() {
    const box = graph.getBoundingClientRect(); width = box.width; height = box.height;
    const grid = graph.querySelector('.capability-grid').getBoundingClientRect();
    contentTop = grid.top - box.top; contentBottom = grid.bottom - box.top;
    state.forEach(item => {
      item.node.style.translate = 'none';
      const rect = item.node.getBoundingClientRect();
      item.baseX = rect.left - box.left; item.baseY = rect.top - box.top; item.width = rect.width; item.height = rect.height;
      item.x = clamp(item.x, -item.baseX + 2, width - item.baseX - item.width - 2);
      item.y = clamp(item.y, contentTop - item.baseY + 2, contentBottom - item.baseY - item.height - 2);
    });
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    position(last); render();
  }

  // positions: user offset plus a slow drift while motion is on
  function position(time) {
    state.forEach(item => {
      const drift = !paused && !reduced.matches && drag?.item !== item;
      const limitX = Math.min(4, Math.max(0, width - item.width) * .015);
      item.dx = clamp(item.x + (drift ? Math.sin(time * .00035 + item.index * .8) * limitX : 0), -item.baseX + 2, width - item.baseX - item.width - 2);
      item.dy = clamp(item.y + (drift ? Math.cos(time * .0003 + item.index * .7) * 3 : 0), contentTop - item.baseY + 2, contentBottom - item.baseY - item.height - 2);
      item.node.style.translate = `${item.dx}px ${item.dy}px`;
    });
    edges.forEach(([a, b], index) => {
      const first = state[a], second = state[b];
      paths[index].setAttribute('d', `M${first.baseX + first.dx + first.width / 2} ${first.baseY + first.dy + first.width / 2}L${second.baseX + second.dx + second.width / 2} ${second.baseY + second.dy + second.width / 2}`);
    });
  }

  // needles: damped spring toward a target driven by power-on test, drift and motion
  function physics(time, dt) {
    let active = false;
    const sinceOn = poweredAt ? time - poweredAt : Infinity;
    state.forEach(item => {
      item.vx = (item.dx - item.pdx) / Math.max(dt, 1) * 16; item.vy = (item.dy - item.pdy) / Math.max(dt, 1) * 16;
      item.pdx = item.dx; item.pdy = item.dy;
      const selfTest = sinceOn < 520 + item.index * 60;
      const wobble = !paused && !reduced.matches ? Math.sin(time * .0011 + item.index * 2.3) * 2.2 : 0;
      if (item.center) {
        const targetBank = selfTest ? 18 : clamp(-item.vx * 2.4, -40, 40) + wobble;
        const targetPitch = selfTest ? -8 : clamp(item.vy * 1.2, -14, 14) + wobble * .6;
        if (reduced.matches) { item.angle = targetBank; item.pitch = targetPitch; return; }
        const s = dt / 1000;
        item.av += ((targetBank - item.angle) * 90 - item.av * 11) * s; item.angle += item.av * s;
        item.pv += ((targetPitch - item.pitch) * 90 - item.pv * 11) * s; item.pitch += item.pv * s;
        active ||= Math.abs(item.av) > .02 || Math.abs(targetBank - item.angle) > .05;
      } else {
        // throttle: each gauge revs up on its own cycle, then drops back and settles on the spring
        let rev = 0;
        if (!paused && !reduced.matches) {
          const period = 4200 + item.index * 530;
          const phase = ((time + item.index * 1700) % period) / period;
          if (phase < .16) rev = Math.min(125, item.rest + 95) - item.rest;
          else if (phase < .24) rev = (Math.min(125, item.rest + 95) - item.rest) * .55;
        }
        // the needle only ever reads at or above its resting mark; dragging can push it, never below rest
        const push = drag?.item === item ? Math.abs(clamp((item.vx + item.vy) * 3, -70, 70)) : 0;
        const target = selfTest ? 135 : clamp(item.rest + rev + push + Math.abs(wobble), -135, 135);
        if (reduced.matches) { item.angle = target; return; }
        const s = dt / 1000;
        // lively on the way up, critically damped on the way down so it settles without undershooting
        const damping = target < item.angle ? 24 : 13;
        item.av += ((target - item.angle) * 140 - item.av * damping) * s; item.angle += item.av * s;
        if (!selfTest && item.angle < item.rest) { item.angle = item.rest; if (item.av < 0) item.av = 0; }
        active ||= Math.abs(item.av) > .02 || Math.abs(target - item.angle) > .05;
      }
    });
    return active;
  }

  function render() {
    state.forEach(item => {
      if (item.center) item.horizon?.setAttribute('transform', `rotate(${item.angle.toFixed(2)} 60 60) translate(0 ${item.pitch.toFixed(2)})`);
      else item.needle?.setAttribute('transform', `rotate(${item.angle.toFixed(2)} 60 60)`);
    });
  }

  let settling = true;
  function tick(time) {
    const dt = last ? Math.min(48, time - last) : 16; last = time;
    position(time);
    settling = physics(time, dt);
    render();
    frame = (shouldRun()) ? requestAnimationFrame(tick) : 0;
  }
  const shouldRun = () => visible && !document.hidden && (!paused || settling || !!drag || (poweredAt && performance.now() - poweredAt < 1600));
  function wake() { if (!frame && shouldRun() && !reduced.matches) { last = 0; frame = requestAnimationFrame(tick); } }

  function syncMotion() {
    pause.setAttribute('aria-pressed', String(paused));
    pause.disabled = reduced.matches;
    pause.textContent = reduced.matches ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion';
    if (reduced.matches) { cancelAnimationFrame(frame); frame = 0; position(0); physics(0, 16); render(); return; }
    settling = true; wake();
  }

  function move(item, x, y) {
    item.x = clamp(x, -item.baseX + 2, width - item.baseX - item.width - 2);
    item.y = clamp(y, contentTop - item.baseY + 2, contentBottom - item.baseY - item.height - 2);
    if (reduced.matches) { position(0); physics(0, 16); render(); } else { settling = true; wake(); }
  }

  function finish(cancel = false) {
    if (!drag) return;
    const { item, startX, startY, pointerId } = drag;
    if (cancel) move(item, startX, startY);
    item.node.dataset.dragging = 'false';
    graph.classList.remove('is-dragging');
    if (item.node.hasPointerCapture(pointerId)) item.node.releasePointerCapture(pointerId);
    drag = null; settling = true; wake();
  }

  state.forEach(item => {
    const label = item.center ? 'Product Leadership' : item.node.textContent.trim().replace(/\s+/g, ' ');
    item.node.setAttribute('role', 'button'); item.node.tabIndex = 0;
    item.node.setAttribute('aria-label', label + '. Drag or use arrow keys to move.');
    item.node.setAttribute('aria-describedby', 'network-help');
    item.node.addEventListener('pointerdown', event => {
      if (event.button !== 0 || drag) return;
      event.preventDefault();
      item.node.focus({ preventScroll: true });
      drag = { item, startX: item.x, startY: item.y, clientX: event.clientX, clientY: event.clientY, pointerId: event.pointerId };
      item.node.dataset.dragging = 'true'; graph.classList.add('is-dragging');
      item.node.setPointerCapture(event.pointerId); wake();
    });
    item.node.addEventListener('pointermove', event => {
      if (drag?.item !== item || drag.pointerId !== event.pointerId) return;
      move(item, drag.startX + event.clientX - drag.clientX, drag.startY + event.clientY - drag.clientY);
    });
    item.node.addEventListener('pointerup', () => finish());
    item.node.addEventListener('pointercancel', () => finish(true));
    item.node.addEventListener('lostpointercapture', () => finish());
    item.node.addEventListener('keydown', event => {
      if (event.key === 'Escape') { finish(true); return; }
      if (event.key === 'Home') { event.preventDefault(); move(item, 0, 0); live.textContent = label + ' position reset.'; return; }
      const delta = { ArrowLeft: [-8, 0], ArrowRight: [8, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] }[event.key];
      if (!delta) return;
      event.preventDefault(); move(item, item.x + delta[0], item.y + delta[1]);
    });
  });

  pause.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reset.addEventListener('click', () => { finish(); state.forEach(item => { item.x = item.y = 0; }); settling = true; position(last); wake(); live.textContent = 'Network layout reset.'; });
  reduced.addEventListener('change', () => { paused = reduced.matches; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  if (typeof ResizeObserver === 'function') new ResizeObserver(measure).observe(graph);
  else window.addEventListener('resize', measure);

  const powerOn = () => {
    if (poweredAt) return;
    poweredAt = performance.now();
    panel?.classList.add('is-powered');
  };
  if (typeof IntersectionObserver === 'function') {
    new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible && !reduced.matches) powerOn();
      syncMotion();
    }, { threshold: .25 }).observe(graph);
  } else { visible = true; powerOn(); }
  measure(); syncMotion();
})();
