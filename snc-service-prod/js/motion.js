/* =========================================================
   СНК · snc-service — общий слой анимаций (все страницы).
   GSAP 3 + ScrollTrigger + CustomEase, Lenis. Приёмы перенесены
   из ../designs/main.js в том же стиле: единый rAF-тикер,
   IntersectionObserver, начальные состояния выставляет JS.
   Экспортирует утилиты в window.SNCFX для скриптов страниц.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg';
  const mq = q => window.matchMedia(q).matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const damp = (k, dt) => 1 - Math.exp(-k * dt); // lerp, не зависящий от fps

  // Анимации включены всегда: системная настройка prefers-reduced-motion
  // (часто выключена «анимация Windows» на рабочих ПК) намеренно игнорируется
  const RM = false;
  const FINE = mq('(hover: hover) and (pointer: fine)');
  const SMALL = mq('(max-width: 640px)');
  const G = window.gsap;
  const ST = window.ScrollTrigger;
  const ON = !!(G && ST && !RM); // анимации включены

  let EASE = 'expo.out';
  if (G) {
    G.registerPlugin(...[ST, window.CustomEase].filter(Boolean));
    if (window.CustomEase) { window.CustomEase.create('brief', '0.22,1,0.36,1'); EASE = 'brief'; }
  }
  const DRAW = 'power2.inOut'; // прорисовка линии — движение на экране

  /* ---------- Единый rAF-тикер ---------- */
  const ticks = new Set();
  const onTick = fn => { ticks.add(fn); return () => ticks.delete(fn); };
  if (G) {
    G.ticker.add((t, dms) => { const dt = Math.min(dms, 64) / 1000; ticks.forEach(f => f(dt, t)); });
  } else {
    let last = performance.now();
    const loop = now => { const dt = Math.min(now - last, 64) / 1000; last = now; ticks.forEach(f => f(dt, now / 1000)); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  /* ---------- Видимость секций (пауза циклов вне экрана) ---------- */
  const visible = new WeakMap();
  const io = new IntersectionObserver(es => es.forEach(e => visible.set(e.target, e.isIntersecting)), { rootMargin: '80px' });
  const watch = el => { if (el) { visible.set(el, true); io.observe(el); } return el; };
  const isVis = el => visible.get(el) !== false;

  /* =========================================================
     Плавный скролл и якоря
     ========================================================= */
  let lenis = null;
  if (ON && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, allowNestedScroll: true });
    lenis.on('scroll', ST.update);
    G.ticker.add(t => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.target) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return; // якорь на другой странице
    const id = decodeURIComponent(url.hash);
    const target = id === '#top' ? 0 : document.getElementById(id.slice(1));
    if (target == null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.2 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    if (target !== 0) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    history.replaceState(null, '', id === '#top' ? location.pathname : id);
  });

  /* Мобильное меню: остановка скролла и каскад пунктов */
  document.addEventListener('snc:menu', e => {
    const open = e.detail.open;
    if (open) lenis?.stop(); else lenis?.start();
    if (!open || !ON) return;
    const mmenu = $('#mobile-menu');
    G.fromTo(mmenu, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' });
    G.fromTo($$('.mmenu__list > li, .mmenu__foot', mmenu), { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: EASE });
  });

  /* =========================================================
     Утилиты: разбиение на слова, прорисовка, пакеты
     ========================================================= */
  function splitWords(el) {
    const inners = [];
    const wrap = node => {
      const w = document.createElement('span'); w.className = 'w';
      const i = document.createElement('span'); i.className = 'w__in';
      w.appendChild(i);
      if (node.parentNode) node.parentNode.insertBefore(w, node);
      i.appendChild(node);
      inners.push(i);
      return w;
    };
    const walk = parent => {
      Array.from(parent.childNodes).forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/([ \t\n]+)/).forEach(part => {
            if (!part) return;
            if (/^[ \t\n]+$/.test(part)) frag.appendChild(document.createTextNode(' '));
            else frag.appendChild(wrap(document.createTextNode(part)));
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.namespaceURI !== NS) {
          if (getComputedStyle(n).whiteSpace === 'nowrap') wrap(n).classList.add('w--deep');
          else walk(n);
        }
      });
    };
    walk(el);
    return inners;
  }

  /* Построчное появление: маска + translateY, stagger по строкам */
  function lineReveal(el, opts = {}) {
    const inners = splitWords(el);
    const tops = [];
    const lineOf = inners.map(i => {
      const top = Math.round(i.parentNode.offsetTop);
      let idx = tops.findIndex(t => Math.abs(t - top) < 8);
      if (idx === -1) { tops.push(top); idx = tops.length - 1; }
      return idx;
    });
    return G.fromTo(inners, { yPercent: 118 }, {
      yPercent: 0, duration: opts.duration || 0.9, ease: EASE,
      stagger: i => lineOf[i] * (opts.each || 0.08)
    });
  }

  /* Разбивает путь из нескольких M-сегментов на отдельные пути */
  function explodePath(path) {
    const parts = path.getAttribute('d').split(/(?=M)/).map(s => s.trim()).filter(Boolean);
    const out = parts.map(d => {
      const p = path.cloneNode(false);
      p.setAttribute('d', d);
      path.parentNode.insertBefore(p, path);
      return p;
    });
    path.remove();
    return out;
  }

  /* Собирает элементы SVG-групп: линии для прорисовки и элементы для проявления */
  function collectDraw(targets) {
    const lines = [], fills = [], fades = [];
    targets.forEach(root => {
      if (!root) return;
      const shapes = root.matches('path,rect,ellipse,circle,line,polyline,text')
        ? [root] : $$('path,rect,ellipse,circle,line,polyline,text', root);
      shapes.forEach(el => {
        if (el.closest('clipPath,pattern,defs,.packets,.s-packets')) return;
        const cs = getComputedStyle(el);
        if (el.tagName === 'text') { fades.push(el); return; }
        const stroked = cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0;
        const dashed = cs.strokeDasharray && cs.strokeDasharray !== 'none';
        if (stroked && !dashed && el.getTotalLength) {
          lines.push({ el, L: Math.ceil(el.getTotalLength()) + 1 });
          if (cs.fill !== 'none' && !/url/.test(cs.fill)) fills.push(el);
        } else fades.push(el);
      });
    });
    return { lines, fills, fades };
  }

  function drawInto(tl, set, at, dur = 0.7) {
    set.lines.forEach(({ el, L }) => {
      tl.fromTo(el, { strokeDasharray: L, strokeDashoffset: L },
        { strokeDashoffset: 0, duration: dur, ease: DRAW, clearProps: 'strokeDasharray,strokeDashoffset' }, at);
    });
    if (set.fills.length) tl.fromTo(set.fills, { fillOpacity: 0 }, { fillOpacity: 1, duration: dur * 0.6, ease: 'power1.out' }, at + dur * 0.5);
    if (set.fades.length) tl.fromTo(set.fades, { opacity: 0 }, { opacity: 1, duration: dur * 0.7, ease: 'power1.out' }, at + dur * 0.3);
  }

  /* Пакеты данных вдоль путей: getPointAtLength + общий тикер */
  function createPackets(group, specs, r = 2.6) {
    const items = [];
    specs.forEach(s => {
      if (!s.path) return;
      const L = s.path.getTotalLength();
      for (let i = 0; i < s.count; i++) {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('r', r);
        c.setAttribute('class', 'packet');
        c.style.opacity = 0;
        group.appendChild(c);
        items.push({ s, L, c, t: i / s.count + Math.random() * 0.08 });
      }
    });
    return dt => {
      for (const it of items) {
        if (it.s.enabled && !it.s.enabled()) { if (it.c.style.opacity !== '0') it.c.style.opacity = 0; continue; }
        const mul = it.s.mul ? it.s.mul() : 1;
        it.t = (it.t + dt * it.s.speed * mul / it.L) % 1;
        const p = it.s.path.getPointAtLength(it.t * it.L);
        it.c.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
        it.c.style.opacity = clamp(Math.min(it.t, 1 - it.t) / 0.08, 0, 1).toFixed(2);
      }
    };
  }

  /* Одометр: цифры прокручиваются барабаном */
  function odometer(el, { start = 'top 88%', immediate = false } = {}) {
    const str = String(el.dataset.target ?? el.textContent).trim();
    const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = str;
    const vis = document.createElement('span'); vis.className = 'odo'; vis.setAttribute('aria-hidden', 'true');
    const reels = [];
    [...str].forEach(ch => {
      if (!/\d/.test(ch)) { const s = document.createElement('span'); s.textContent = ch; vis.appendChild(s); return; }
      const col = document.createElement('span'); col.className = 'odo__col';
      const reel = document.createElement('span'); reel.className = 'odo__reel';
      for (let k = 0; k < 20; k++) { const d = document.createElement('span'); d.textContent = k % 10; reel.appendChild(d); }
      col.appendChild(reel); vis.appendChild(col);
      reels.push({ reel, d: +ch });
    });
    el.replaceWith(sr, vis);
    const run = () => reels.forEach((r, i) => G.to(r.reel, { yPercent: -(10 + r.d) * 5, duration: 1.5 + i * 0.18, delay: i * 0.05, ease: EASE }));
    if (immediate) run(); else ST.create({ trigger: vis, start, once: true, onEnter: run });
  }

  /* Заголовки: построчное появление при входе в экран */
  function revealHeading(h, start = 'top 88%') {
    const tw = lineReveal(h, { duration: 0.8 });
    tw.pause();
    ST.create({ trigger: h, start, once: true, onEnter: () => tw.play() });
    return tw;
  }

  /* Каскад появления группы элементов */
  function revealGroup(els, { trigger, start = 'top 85%', y = 16, stagger = 0.08 } = {}) {
    if (!els.length) return;
    G.set(els, { opacity: 0, y });
    ST.create({
      trigger: trigger || els[0], start, once: true,
      onEnter: () => G.to(els, { opacity: 1, y: 0, duration: 0.7, stagger, ease: EASE, clearProps: 'transform' })
    });
  }

  /* =========================================================
     Карточки категорий (главная и витрина каталога)
     ========================================================= */
  /* <use> → встроенный SVG, чтобы части иконки (волны, порты) анимировались */
  function inlineIcons(scope = document) {
    $$('.card__icon', scope).forEach(svg => {
      const use = $('use', svg);
      const sym = use && document.getElementById(use.getAttribute('href').slice(1));
      if (!sym) return;
      svg.setAttribute('viewBox', sym.getAttribute('viewBox'));
      use.replaceWith(...Array.from(sym.childNodes).map(n => n.cloneNode(true)));
    });
  }

  function bentoCards(scope = document) {
    const cards = $$('.bento--cat .card', scope);
    if (!cards.length) return;
    G.set(cards, { opacity: 0 });
    ST.batch(cards, {
      start: 'top 88%', once: true,
      onEnter: batch => G.fromTo(batch, { opacity: 0, scale: 0.96, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.08, ease: EASE, clearProps: 'opacity,y' }),
    });

    // Мини-схема концентратора: пакеты бегут, пока карточка под курсором
    const xl = $('.bento--cat .card--xl', scope);
    const miniSvg = xl && $('.card__art svg', xl);
    if (miniSvg) {
      $('.mini-packet', miniSvg)?.remove();
      const pg = document.createElementNS(NS, 'g'); miniSvg.appendChild(pg);
      const live = () => xl.classList.contains('is-live');
      const upd = createPackets(pg, [
        { path: $('#mini-d1', miniSvg), speed: 90, count: 1, enabled: live },
        { path: $('#mini-d2', miniSvg), speed: 110, count: 2, enabled: live },
        { path: $('#mini-d3', miniSvg), speed: 70, count: 1, enabled: live },
      ], 3);
      onTick(dt => upd(dt));
    }

    cards.forEach(card => {
      const spot = $('.card__spot', card);
      const on = () => card.classList.add('is-live');
      const off = () => card.classList.remove('is-live');
      card.addEventListener('pointerenter', on);
      card.addEventListener('pointerleave', off);
      card.addEventListener('focusin', on);
      card.addEventListener('focusout', off);
      if (!FINE) return;
      const rx = G.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
      const ry = G.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      G.set(card, { transformPerspective: 1000 });
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        if (spot) spot.style.transform = `translate3d(${(e.clientX - r.left).toFixed(0)}px, ${(e.clientY - r.top).toFixed(0)}px, 0)`;
        if (!SMALL) { rx((0.5 - py) * 8); ry((px - 0.5) * 8); } // максимум ±4°
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* CTA перед футером: размерная линия, заголовок построчно, кнопка */
  function ctaReveal() {
    const cta = $('.cta__box');
    if (!cta) return;
    const tl = G.timeline({ paused: true, defaults: { ease: EASE } });
    tl.fromTo($('.cta__dim', cta), { scaleX: 0 }, { scaleX: 1, duration: 0.9, transformOrigin: '50% 50%' }, 0)
      .add(lineReveal($('.cta__title', cta), { duration: 0.9 }), 0.1)
      .fromTo([$('.cta__text', cta), $('.btn', cta)], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.35);
    ST.create({ trigger: cta, start: 'top 75%', once: true, onEnter: () => tl.play() });
  }

  /* Схема района офиса: застройка раскрывается кругом от офиса */
  function officeReveal() {
    const clip = $('#bld-reveal circle');
    if (!clip) return;
    const plan = clip.closest('.office__plan');
    clip.setAttribute('r', '0');
    const tl = G.timeline({ paused: true });
    tl.to(clip, { attr: { r: 400 }, duration: 1.6, ease: 'power2.out' }, 0)
      .fromTo($('.net-hub', plan), { attr: { r: 2 } }, { attr: { r: 8 }, duration: 0.6, ease: 'back.out(2)' }, 0.1)
      .fromTo($('.leader', plan), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.6)
      .fromTo($('.bp-label--accent', plan), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.5, ease: EASE }, 0.7);
    ST.create({ trigger: plan, start: 'top 78%', once: true, onEnter: () => tl.play() });
  }

  /* =========================================================
     Шапка: FLIP-подложка под пунктом меню (hover / открытый пункт)
     ========================================================= */
  function navIndicator() {
    const list = $('.nav__list');
    if (!list || !FINE) return;
    const pill = document.createElement('span');
    pill.className = 'nav__pill'; pill.setAttribute('aria-hidden', 'true');
    list.prepend(pill);
    list.classList.add('has-pill');
    const links = $$('.nav__link', list);
    const cur = { x: 0, w: 0 }, tgt = { x: 0, w: 0 };
    let placed = false, hovered = null;
    // Куда встать: пункт под курсором → открытое меню → фокус с клавиатуры. Иначе — скрыться.
    const target = () => hovered
      || $('.has-dd.is-open .nav__link', list)
      || links.find(l => l === document.activeElement && l.matches(':focus-visible'))
      || null;
    const sync = () => {
      const t = target();
      if (!t) { placed = false; if (pill.classList.contains('is-on')) pill.classList.remove('is-on'); return; }
      const lr = list.getBoundingClientRect(), r = t.getBoundingClientRect();
      tgt.x = r.left - lr.left; tgt.w = r.width;
      if (!placed) { cur.x = tgt.x; cur.w = tgt.w; placed = true; }
      if (!pill.classList.contains('is-on')) pill.classList.add('is-on');
    };
    links.forEach(l => {
      l.addEventListener('pointerenter', () => { hovered = l; sync(); });
      l.addEventListener('pointerleave', () => { if (hovered === l) hovered = null; sync(); });
      l.addEventListener('focus', sync);
      l.addEventListener('blur', () => setTimeout(sync, 0));
    });
    // меню закрылось (в т.ч. по таймеру после ухода курсора) — пересчитать
    // (изменения самой подложки не учитываем — иначе цикл)
    new MutationObserver(recs => { if (recs.some(r => r.target !== pill)) sync(); })
      .observe(list, { subtree: true, attributes: true, attributeFilter: ['class'] });
    onTick(dt => {
      if (!placed) return;
      const k = damp(18, dt);
      cur.x += (tgt.x - cur.x) * k; cur.w += (tgt.w - cur.w) * k;
      pill.style.transform = `translate3d(${cur.x.toFixed(1)}px,0,0)`;
      pill.style.width = `${cur.w.toFixed(1)}px`;
    });
  }

  /* Счётчик корзины: «подпрыгивание» при изменении */
  function cartBump() {
    document.addEventListener('snc:cart', () => {
      $$('[data-cart-count]').forEach(b => { b.classList.remove('is-bump'); void b.offsetWidth; b.classList.add('is-bump'); });
      $$('[data-cart-link] .cart-ic').forEach(i => { i.classList.remove('is-shake'); void i.getBoundingClientRect(); i.classList.add('is-shake'); });
    });
  }

  /* =========================================================
     Футер: линии под заголовками, водяной знак
     ========================================================= */
  function footerFx() {
    const titles = $$('.fcol__title');
    if (!titles.length) return;
    G.set(titles, { '--lx': 0 });
    ST.create({
      trigger: '.footer__grid', start: 'top 85%', once: true,
      onEnter: () => G.to(titles, { '--lx': 1, duration: 0.8, stagger: 0.12, ease: EASE })
    });
    const mark = $('.footer__mark');
    const parts = explodePath($('path', mark));
    const tl = G.timeline();
    parts.forEach((p, i) => {
      const L = p.getTotalLength() + 1;
      tl.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1, ease: 'none' }, i * 0.25);
    });
    ST.create({ trigger: '.footer', start: 'top 90%', end: 'bottom bottom', scrub: 0.5, animation: tl });
    G.fromTo(mark, { y: 80 }, { y: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  }

  /* =========================================================
     Курсор и магнитные кнопки (только pointer: fine)
     ========================================================= */
  const cursorEl = $('.cursor');
  const cursorState = (name, on) => cursorEl?.classList.toggle(`is-${name}`, on);

  function customCursor() {
    if (!cursorEl) return;
    document.documentElement.classList.add('has-cursor');
    const dot = $('.cursor__dot', cursorEl), ring = $('.cursor__ring', cursorEl);
    const p = { x: -100, y: -100 }, d = { x: -100, y: -100 }, r = { x: -100, y: -100 };
    let seen = false;
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      p.x = e.clientX; p.y = e.clientY;
      if (!seen) { seen = true; d.x = r.x = p.x; d.y = r.y = p.y; cursorState('hidden', false); }
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => cursorState('hidden', true));
    document.documentElement.addEventListener('mouseenter', () => cursorState('hidden', false));
    document.addEventListener('pointerover', e => {
      cursorState('hover', !!e.target.closest('a, button, input, label, summary, .node, [tabindex="0"], [role="button"]'));
    });
    cursorState('hidden', true);
    onTick(dt => {
      const kd = damp(40, dt), kr = damp(12, dt);
      d.x += (p.x - d.x) * kd; d.y += (p.y - d.y) * kd;
      r.x += (p.x - r.x) * kr; r.y += (p.y - r.y) * kr;
      dot.style.transform = `translate3d(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px, 0)`;
      ring.style.transform = `translate3d(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px, 0)`;
    });
  }

  function magnetic() {
    const R = 80, MAX = 8;
    const els = $$('.magnetic').map(el => ({
      el, x: G.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' }), y: G.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' }), on: false
    }));
    if (!els.length) return;
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      for (const m of els) {
        const b = m.el.getBoundingClientRect();
        if (b.bottom < 0 || b.top > window.innerHeight) continue;
        const cx = b.left + b.width / 2 - (G.getProperty(m.el, 'x') || 0);
        const cy = b.top + b.height / 2 - (G.getProperty(m.el, 'y') || 0);
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const ex = Math.max(Math.abs(dx) - b.width / 2, 0), ey = Math.max(Math.abs(dy) - b.height / 2, 0);
        const dist = Math.hypot(ex, ey);
        if (dist < R) {
          const f = 1 - dist / R * 0.5;
          m.x(clamp(dx / (b.width / 2 + R), -1, 1) * MAX * f);
          m.y(clamp(dy / (b.height / 2 + R), -1, 1) * MAX * f);
          m.on = true;
        } else if (m.on) { m.x(0); m.y(0); m.on = false; }
      }
    }, { passive: true });
  }

  /* =========================================================
     Запуск общего слоя
     ========================================================= */
  cartBump();
  if (ON) {
    navIndicator();
    footerFx();
    if (FINE) { customCursor(); magnetic(); }
    document.fonts?.ready.then(() => ST.refresh());
    window.addEventListener('load', () => ST.refresh());
  }

  window.SNCFX = {
    $, $$, NS, clamp, damp, RM, FINE, SMALL, ON, G, ST, EASE, DRAW,
    onTick, watch, isVis, lenis, cursorState,
    splitWords, lineReveal, explodePath, collectDraw, drawInto, createPackets,
    odometer, revealHeading, revealGroup,
    inlineIcons, bentoCards, ctaReveal, officeReveal,
  };
})();
