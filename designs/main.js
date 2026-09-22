/* =========================================================
   СНК · Сибнефтекарт — главная
   Слой анимаций: GSAP 3 + ScrollTrigger + CustomEase, Lenis.
   Все начальные состояния выставляет JS: без JS страница финальна.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg';
  const mq = q => window.matchMedia(q).matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const damp = (k, dt) => 1 - Math.exp(-k * dt); // lerp, не зависящий от fps

  const RM = mq('(prefers-reduced-motion: reduce)');
  const FINE = mq('(hover: hover) and (pointer: fine)');
  const SMALL = mq('(max-width: 640px)');
  const G = window.gsap;
  const ST = window.ScrollTrigger;

  let EASE = 'expo.out';
  if (G) {
    G.registerPlugin(...[ST, window.CustomEase].filter(Boolean));
    if (window.CustomEase) { window.CustomEase.create('brief', '0.22,1,0.36,1'); EASE = 'brief'; }
  }
  const DRAW = 'power2.inOut'; // прорисовка линии — движение на экране

  /* ---------- Единый rAF-тикер ---------- */
  const ticks = new Set();
  const onTick = fn => ticks.add(fn);
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
     Плавный скролл
     ========================================================= */
  let lenis = null;
  if (!RM && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, allowNestedScroll: true });
    if (G) {
      if (ST) lenis.on('scroll', ST.update);
      G.ticker.add(t => lenis.raf(t * 1000));
      G.ticker.lagSmoothing(0);
    } else {
      onTick((dt, t) => lenis.raf(t * 1000));
    }
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#') { e.preventDefault(); return; } // ссылки-заглушки
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.2 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    if (target !== 0 && target.focus) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  });

  /* =========================================================
     1. Header: сжатие, прогресс чтения, меню
     ========================================================= */
  const header = $('#header');
  const progress = $('.header__progress span');
  let compact = false, lastP = -1;
  onTick(() => {
    const y = window.scrollY;
    const c = y > 40;
    if (c !== compact) { compact = c; header.classList.toggle('is-compact', c); }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? clamp(y / max, 0, 1) : 0;
    if (Math.abs(p - lastP) > 0.0005) { lastP = p; progress.style.transform = `scaleX(${p})`; }
  });

  const nav = $('#nav');

  /* ---------- Выпадающие меню ---------- */
  const ddItems = $$('.has-dd', nav);
  let closeTimer = null;
  function ddOpen(item, focusFirst = false) {
    ddItems.forEach(i => i !== item && ddClose(i));
    item.classList.add('is-open');
    $('.nav__trigger', item).setAttribute('aria-expanded', 'true');
    if (focusFirst) $('.dd__link', item)?.focus();
  }
  function ddClose(item, returnFocus = false) {
    if (!item.classList.contains('is-open')) return;
    item.classList.remove('is-open');
    const trigger = $('.nav__trigger', item);
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
  }
  ddItems.forEach(item => {
    const trigger = $('.nav__trigger', item);
    const links = $$('.dd__link', item);
    trigger.addEventListener('click', () => item.classList.contains('is-open') ? ddClose(item) : ddOpen(item));
    if (FINE) {
      item.addEventListener('pointerenter', () => { clearTimeout(closeTimer); ddOpen(item); });
      item.addEventListener('pointerleave', () => { closeTimer = setTimeout(() => ddClose(item), 140); });
    }
    trigger.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ddOpen(item, true); }
    });
    item.addEventListener('keydown', e => {
      const idx = links.indexOf(document.activeElement);
      if (e.key === 'Escape') { e.preventDefault(); ddClose(item, true); }
      else if (idx > -1 && e.key === 'ArrowDown') { e.preventDefault(); links[(idx + 1) % links.length].focus(); }
      else if (idx > -1 && e.key === 'ArrowUp') { e.preventDefault(); idx === 0 ? trigger.focus() : links[idx - 1].focus(); }
      else if (idx > -1 && (e.key === 'Home' || e.key === 'End')) { e.preventDefault(); links[e.key === 'Home' ? 0 : links.length - 1].focus(); }
    });
    item.addEventListener('focusout', e => { if (!item.contains(e.relatedTarget)) ddClose(item); });
  });
  document.addEventListener('click', e => ddItems.forEach(i => { if (!i.contains(e.target)) ddClose(i); }));

  /* ---------- Мобильное меню ---------- */
  const burger = $('.burger');
  const mmenu = $('#mobile-menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    if (open) {
      mmenu.style.setProperty('--mmenu-top', `${header.getBoundingClientRect().bottom}px`);
      mmenu.hidden = false;
      lenis?.stop();
      document.body.style.overflow = 'hidden';
      if (G && !RM) {
        G.fromTo(mmenu, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' });
        G.fromTo($$('.mmenu__list > li, .mmenu__foot', mmenu), { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: EASE });
      }
    } else {
      mmenu.hidden = true;
      lenis?.start();
      document.body.style.overflow = '';
    }
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  mmenu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* =========================================================
     Утилиты: разбиение на слова, подготовка прорисовки
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

  /* Собирает элементы SVG-группы: линии для прорисовки и элементы для проявления */
  function collectDraw(targets) {
    const lines = [], fills = [], fades = [];
    targets.forEach(root => {
      if (!root) return;
      const shapes = root.matches('path,rect,ellipse,circle,line,polyline,text')
        ? [root] : $$('path,rect,ellipse,circle,line,polyline,text', root);
      shapes.forEach(el => {
        if (el.closest('clipPath,pattern,.packets,.s-packets')) return;
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

  /* =========================================================
     Пакеты данных: getPointAtLength + общий тикер
     ========================================================= */
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
        it.t = (it.t + dt * it.s.speed / it.L) % 1;
        const p = it.s.path.getPointAtLength(it.t * it.L);
        it.c.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
        it.c.style.opacity = clamp(Math.min(it.t, 1 - it.t) / 0.08, 0, 1).toFixed(2);
      }
    };
  }

  /* =========================================================
     0. Intro
     ========================================================= */
  function runIntro(onReveal) {
    const intro = $('#intro');
    let seen = false;
    try { seen = sessionStorage.getItem('snk-intro') === '1'; } catch (e) { /* storage недоступен */ }
    if (RM || seen || !G) { intro.remove(); onReveal(); return; }
    try { sessionStorage.setItem('snk-intro', '1'); } catch (e) { /* ignore */ }

    intro.classList.add('is-on');
    lenis?.stop();
    const svg = $('.intro__mark', intro);
    const strokes = explodePath($('.intro__stroke', intro));
    const cols = $$('.intro__cols i', intro);
    cols.forEach(c => { c.style.backgroundPosition = `${-c.offsetLeft}px 0`; });

    let revealed = false;
    const reveal = () => { if (!revealed) { revealed = true; onReveal(); } };
    const finish = () => { intro.remove(); lenis?.start(); };

    strokes.forEach(p => { const L = p.getTotalLength() + 1; G.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
    const tl = G.timeline({ onComplete: finish });
    tl.to(strokes, { strokeDashoffset: 0, duration: 0.5, stagger: 0.08, ease: DRAW }, 0)
      .to(cols, { '--ly': 1, duration: 0.6, stagger: { each: 0.04, from: 'center' }, ease: EASE }, 0.3)
      .to('.intro__h', { scaleX: 1, duration: 0.7, ease: EASE }, 0.3)
      .to(svg, { opacity: 0, y: -8, duration: 0.3, ease: 'power2.out' }, 1.05)
      .to('.intro__h, .intro__hint', { opacity: 0, duration: 0.2 }, 1.1)
      .add(reveal, 1.15)
      .to(cols, { yPercent: -101, duration: 0.7, stagger: 0.04, ease: 'expo.inOut' }, 1.15);

    const skip = () => {
      reveal();
      if (tl.time() < 1.15) tl.seek(1.15, true);
      tl.timeScale(1.6);
      intro.style.pointerEvents = 'none';
    };
    intro.addEventListener('click', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
  }

  /* =========================================================
     2. Hero
     ========================================================= */
  const hero = watch($('.hero'));
  const sceneWrap = $('#scene');
  const scene = $('.scene', sceneWrap);

  function heroTimeline() {
    const tl = G.timeline({ paused: true, defaults: { ease: EASE } });
    G.set('#packets', { opacity: 0 }); // статичные пакеты — только для режима без анимаций
    tl.fromTo('.hero .eyebrow', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0);
    tl.add(lineReveal($('.hero__title')), 0.05);
    const uline = $('.u-mark__line');
    if (uline && getComputedStyle(uline).display !== 'none') {
      tl.fromTo(uline, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.8 }, 0.8);
    }
    tl.fromTo(['.hero__lead', '.hero__actions > *', '.legend'], { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.45);

    // Схема дорисовывается в порядке потока
    const flow = [
      ['.scene-ground', '[data-node="tank"]', '.scene-dims'],
      ['.pipes'],
      ['[data-node="trk"]', '.canopy', '.callout[data-for="trk"]'],
      ['[data-node="kt"]', '#d-trk-kt', '#d-trk2', '.callout[data-for="kt"]'],
      ['.server', '#d-kt-srv', '.cloud', '#d-srv-cl'],
      ['[data-node="nb"]', '#d-cl-nb']
    ];
    tl.fromTo('.layer--back', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power1.out' }, 0.1);
    flow.forEach((sels, i) => drawInto(tl, collectDraw(sels.map(s => $(s, scene))), 0.25 + i * 0.32));
    tl.fromTo('.stamp', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 2.2);
    return tl;
  }

  function heroLive() {
    // Пакеты
    const packetsG = $('#packets', scene);
    packetsG.innerHTML = '';
    const n = SMALL ? 1 : 2;
    const sp = SMALL ? 0.8 : 1;
    const updatePackets = createPackets(packetsG, [
      { path: $('#p-1'), speed: 38 * sp, count: n },
      { path: $('#p-2'), speed: 30 * sp, count: n },
      { path: $('#d-trk-kt'), speed: 72 * sp, count: SMALL ? 2 : 3 },
      { path: $('#d-trk2'), speed: 26 * sp, count: 1 },
      { path: $('#d-kt-srv'), speed: 48 * sp, count: 1 },
      { path: $('#d-srv-cl'), speed: 58 * sp, count: n },
      { path: $('#d-cl-nb'), speed: 64 * sp, count: n }
    ]);
    let alpha = 0; // плавный вход пакетов после прорисовки
    G.to({}, { duration: 0.6, delay: 0.1, onUpdate() { alpha = this.progress(); } });
    packetsG.style.opacity = 0;
    onTick(dt => {
      if (!isVis(hero)) return;
      updatePackets(dt);
      if (alpha < 1) packetsG.style.opacity = alpha;
    });

    // «Дыхание» уровня
    const loops = [
      G.to('.level--t1', { y: -3, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to('.level--t2', { y: 2.5, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
      G.to('.level--nb', { y: -2.5, duration: 2.9, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    ];

    // Цифры на дисплеях ТРК
    const digits = $$('[data-digits]', scene).map(el => ({ el, v: parseFloat(el.textContent), acc: 0 }));
    onTick(dt => {
      if (!isVis(hero)) return;
      digits.forEach((d, i) => {
        d.acc += dt;
        if (d.acc < 0.09 + i * 0.03) return;
        d.acc = 0;
        d.v += 0.03 + Math.random() * 0.06;
        if (d.v > 99.99) d.v = 0;
        d.el.textContent = d.v.toFixed(2).padStart(5, '0');
      });
    });

    new IntersectionObserver(([e]) => loops.forEach(l => e.isIntersecting ? l.resume() : l.pause())).observe(hero);
  }

  /* Параллакс за курсором, 3 слоя */
  function heroParallax() {
    const layers = $$('.layer', scene).map(el => ({ el, d: parseFloat(el.dataset.depth) || 0 }));
    const tgt = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    hero.addEventListener('pointermove', e => {
      const r = sceneWrap.getBoundingClientRect();
      tgt.x = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1.2, 1.2);
      tgt.y = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1.2, 1.2);
    });
    hero.addEventListener('pointerleave', () => { tgt.x = 0; tgt.y = 0; });
    onTick(dt => {
      if (!isVis(hero)) return;
      const k = damp(5, dt);
      const dx = tgt.x - cur.x, dy = tgt.y - cur.y;
      if (Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005) return;
      cur.x += dx * k; cur.y += dy * k;
      layers.forEach(({ el, d }) => el.setAttribute('transform', `translate(${(cur.x * d * -14).toFixed(2)} ${(cur.y * d * -10).toFixed(2)})`));
    });
  }

  /* Частицы данных на canvas (только desktop, с контролем fps) */
  function heroParticles() {
    const canvas = $('.scene__particles', sceneWrap);
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = sceneWrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    const P = Array.from({ length: 34 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: 4 + Math.random() * 10, vy: -(2 + Math.random() * 6),
      s: 1 + Math.random() * 1.4, a: 0.25 + Math.random() * 0.4, red: Math.random() < 0.08
    }));
    let frames = 0, sum = 0, alive = true, fade = 0;
    onTick(dt => {
      if (!alive || !isVis(hero)) return;
      if (frames < 90) { frames++; sum += dt; if (frames === 90 && sum / 90 > 0.024) { alive = false; ctx.clearRect(0, 0, w, h); return; } }
      fade = Math.min(1, fade + dt * 0.8);
      ctx.clearRect(0, 0, w, h);
      for (const p of P) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4;
        ctx.globalAlpha = p.a * fade;
        ctx.fillStyle = p.red ? '#D32F2F' : '#9FB0C3';
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
    });
  }

  /* Hover по узлам: красный контур, связанные линии, чип спецификации */
  function heroNodes() {
    const links = {
      trk: ['.pipes .pipe-outer', '#d-trk-kt', '#d-trk2'],
      tank: ['.pipes .pipe-outer'],
      kt: ['#d-trk-kt', '#d-kt-srv'],
      nb: ['#d-cl-nb', '#d-srv-cl']
    };
    let active = null;
    const set = (key, on) => {
      const node = $(`.node[data-node="${key}"]`, scene);
      node.classList.toggle('is-hot', on);
      links[key].forEach(s => $(s, scene)?.classList.toggle('is-hot', on));
      $$(`.callout[data-for="${key}"]`, scene).forEach(c => c.classList.toggle('is-hot', on));
      $(`.chip-spec[data-for="${key}"]`, sceneWrap)?.classList.toggle('is-visible', on);
    };
    const show = key => { if (active && active !== key) set(active, false); active = key; set(key, true); };
    const hide = key => { if (active === key) { set(key, false); active = null; } };
    $$('.node', scene).forEach(node => {
      const key = node.dataset.node;
      node.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') show(key); });
      node.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hide(key); });
      node.addEventListener('focus', () => show(key));
      node.addEventListener('blur', () => hide(key));
      node.addEventListener('click', () => (active === key ? hide(key) : show(key)));
      node.addEventListener('keydown', e => { if (e.key === 'Escape') hide(key); });
    });
    document.addEventListener('pointerdown', e => { if (active && !e.target.closest('.node')) hide(active); });
  }

  /* =========================================================
     3. Бегущая строка
     ========================================================= */
  function marquee() {
    const wrap = watch($('.marquee'));
    const track = $('.marquee__track', wrap);
    const group = $('.marquee__group', wrap);
    let gw = group.offsetWidth;
    window.addEventListener('resize', () => { gw = group.offsetWidth; });
    let x = 0, hoverMul = 1, hoverTgt = 1, boost = 0, lastY = window.scrollY;
    wrap.addEventListener('pointerenter', () => { hoverTgt = 0.25; });
    wrap.addEventListener('pointerleave', () => { hoverTgt = 1; });
    onTick(dt => {
      const y = window.scrollY;
      const v = dt > 0 ? Math.abs(y - lastY) / dt : 0; // px/s
      lastY = y;
      if (!isVis(wrap)) return;
      boost += (Math.min(v / 250, 7) - boost) * damp(v / 250 > boost ? 10 : 2.5, dt);
      hoverMul += (hoverTgt - hoverMul) * damp(6, dt);
      x -= 55 * hoverMul * (1 + boost) * dt;
      if (x <= -gw) x += gw;
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    });
  }

  /* =========================================================
     4. «Как работает система»
     ========================================================= */
  const ZONES = ['Резервуарный парк', 'Колонка', 'Касса', 'Офис и сервер', 'Сеть АЗС'];
  const VIEWS = [
    { cx: 800, cy: 380, s: 1 },     // общий вид
    { cx: 330, cy: 590, s: 1.7 },   // резервуарный парк
    { cx: 770, cy: 400, s: 1.6 },   // колонка
    { cx: 1000, cy: 390, s: 1.8 },  // касса
    { cx: 1290, cy: 370, s: 1.6 },  // офис / сервер
    { cx: 1500, cy: 330, s: 1.8 }   // сеть АЗС
  ];

  function systemScene() {
    const sys = watch($('#system'));
    const cam = $('.cam', sys);
    const steps = $$('.step', sys);
    const bar = $('.steps__bar span', sys);
    const hud = $('.stage__zone', sys);
    const connectors = { 1: '#s-pipe', 2: '#s-d1', 3: '#s-d2', 4: '#s-d3' };
    const zoneSet = i => collectDraw([$(`.zone[data-zone="${i}"]`, cam), connectors[i] && $(connectors[i], cam)]);

    let stageP = 0; // прогресс для включения пакетов
    const drawnAt = [0.02, 0.26, 0.45, 0.63, 0.8];
    const upd = createPackets($('.s-packets', cam), [
      { path: $('#s-pipe', cam), speed: 90, count: 3, enabled: () => stageP > drawnAt[1] + 0.05 },
      { path: $('#s-d1', cam), speed: 70, count: 1, enabled: () => stageP > drawnAt[2] + 0.05 },
      { path: $('#s-d2', cam), speed: 80, count: 2, enabled: () => stageP > drawnAt[3] + 0.05 },
      { path: $('#s-d3', cam), speed: 50, count: 1, enabled: () => stageP > drawnAt[4] + 0.05 }
    ], 4);
    onTick(dt => { if (isVis(sys)) upd(dt); });

    let curStep = -1, curZone = -1;
    const setUI = p => {
      stageP = p;
      const step = p < 0.34 ? 0 : p < 0.52 ? 1 : p < 0.7 ? 2 : 3;
      const zone = p < 0.34 ? 0 : p < 0.52 ? 1 : p < 0.7 ? 2 : p < 0.82 ? 3 : 4;
      if (step !== curStep) { curStep = step; steps.forEach((s, i) => s.classList.toggle('is-active', i === step)); }
      if (zone !== curZone) { curZone = zone; hud.textContent = `Зона ${zone + 1}/5 · ${ZONES[zone]}`; }
      bar.style.transform = `scaleY(${Math.max(p, 0.02)})`;
    };

    const view = { ...VIEWS[0] };
    const applyCam = () => cam.setAttribute('transform',
      `translate(${(800 - view.cx * view.s).toFixed(2)} ${(380 - view.cy * view.s).toFixed(2)}) scale(${view.s.toFixed(4)})`);

    const mmx = G.matchMedia();

    // Desktop: pin + scrub + «камера»
    mmx.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
      sys.classList.add('is-pinned');
      Object.assign(view, VIEWS[0]); applyCam();
      const tl = G.timeline({ defaults: { ease: 'none' } });
      const camTo = (i, at, dur = 1.2) => tl.to(view, { ...VIEWS[i], duration: dur, ease: 'power2.inOut', onUpdate: applyCam }, at);

      drawInto(tl, zoneSet(0), 0, 1.2);  camTo(1, 0.2);
      drawInto(tl, zoneSet(1), 2.2, 1.2); camTo(2, 2.2);
      drawInto(tl, zoneSet(2), 4.2, 1.2); camTo(3, 4.2);
      drawInto(tl, zoneSet(3), 6.0, 1.2); camTo(4, 6.0);
      drawInto(tl, zoneSet(4), 7.6, 1.0); camTo(5, 7.6, 1.0);
      camTo(0, 8.9, 1.1);

      const pin = ST.create({ trigger: sys, start: 'top top', end: '+=300%', pin: true, anticipatePin: 1 });
      const scrub = ST.create({
        trigger: sys, start: 'top 55%',
        end: () => `+=${window.innerHeight * 3 + window.innerHeight * 0.55}`,
        animation: tl, scrub: 0.6,
        onUpdate: self => setUI(self.progress)
      });
      setUI(0);
      return () => { pin.kill(); scrub.kill(); sys.classList.remove('is-pinned'); cam.removeAttribute('transform'); };
    });

    // Tablet / mobile: без pin, схема появляется по частям
    mmx.add('(max-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      cam.removeAttribute('transform');
      hud.textContent = 'Схема системы · 5 зон';
      const tl = G.timeline({ paused: true, onUpdate() { stageP = 1; } });
      for (let i = 0; i < 5; i++) drawInto(tl, zoneSet(i), i * 0.35, 0.8);
      const t = ST.create({ trigger: $('.stage', sys), start: 'top 78%', once: true, onEnter: () => tl.play() });
      const stepsT = G.fromTo(steps, { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: EASE,
        scrollTrigger: { trigger: $('.steps', sys), start: 'top 82%', once: true }
      });
      steps.forEach(s => s.classList.add('is-active'));
      return () => { t.kill(); tl.kill(); stepsT.scrollTrigger?.kill(); };
    });
  }

  /* =========================================================
     5. Метрики — одометр
     ========================================================= */
  function odometers() {
    $$('.odo').forEach(el => {
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
      reels.forEach(r => G.set(r.reel, { yPercent: 0 }));
      ST.create({
        trigger: vis, start: 'top 88%', once: true,
        onEnter: () => reels.forEach((r, i) => G.to(r.reel, {
          yPercent: -(10 + r.d) * 5, duration: 1.5 + i * 0.18, delay: i * 0.05, ease: EASE
        }))
      });
    });
  }

  /* =========================================================
     Заголовки секций и CTA
     ========================================================= */
  function sectionReveals() {
    $$('.directions .h2, .news .h2').forEach(h => {
      const tw = lineReveal(h, { duration: 0.8 });
      tw.pause();
      ST.create({ trigger: h, start: 'top 88%', once: true, onEnter: () => tw.play() });
    });
    const cta = $('.cta__box');
    const tl = G.timeline({ paused: true, defaults: { ease: EASE } });
    tl.fromTo('.cta__dim', { scaleX: 0 }, { scaleX: 1, duration: 0.9, transformOrigin: '50% 50%' }, 0)
      .add(lineReveal($('.cta__title'), { duration: 0.9 }), 0.1)
      .fromTo(['.cta__text', '.cta__box .btn'], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.35);
    ST.create({ trigger: cta, start: 'top 75%', once: true, onEnter: () => tl.play() });
  }

  /* =========================================================
     6. Bento
     ========================================================= */
  function bento() {
    const cards = $$('.card');
    G.set(cards, { opacity: 0, scale: 0.96, y: 16 });
    ST.batch(cards, {
      start: 'top 88%', once: true,
      onEnter: batch => G.to(batch, { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.08, ease: EASE })
    });

    // мини-схема: пакет бежит, пока карточка под курсором
    const xl = $('.card--xl');
    const miniG = $('.card__art svg', xl);
    const staticPacket = $('.mini-packet', miniG);
    staticPacket?.remove();
    const pg = document.createElementNS(NS, 'g'); miniG.appendChild(pg);
    const live = () => xl.classList.contains('is-live');
    const upd = createPackets(pg, [
      { path: $('#mini-p'), speed: 110, count: 2, enabled: live },
      { path: $('#mini-d'), speed: 90, count: 1, enabled: live }
    ], 3);
    onTick(dt => upd(dt));

    cards.forEach(card => {
      const spot = document.createElement('span'); spot.className = 'card__spot'; spot.setAttribute('aria-hidden', 'true');
      card.prepend(spot);
      card.addEventListener('pointerenter', () => card.classList.add('is-live'));
      card.addEventListener('pointerleave', () => card.classList.remove('is-live'));
      if (!FINE) return;
      const rx = G.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
      const ry = G.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      G.set(card, { transformPerspective: 1000 });
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        spot.style.transform = `translate3d(${(e.clientX - r.left).toFixed(0)}px, ${(e.clientY - r.top).toFixed(0)}px, 0)`;
        if (!SMALL) { rx((0.5 - py) * 8); ry((px - 0.5) * 8); } // максимум ±4°
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* =========================================================
     7. Новости: drag-scroll с инерцией, курсор «Тяни»
     ========================================================= */
  function newsDrag() {
    const vp = $('.news__viewport');
    const cur = $('.drag-cursor');
    if (!FINE) return;
    vp.classList.add('is-draggable');
    let down = false, dragging = false, startX = 0, startScroll = 0, hist = [], v = 0, moved = 0, pid = 0;
    const pos = { x: 0, y: 0 }, cpos = { x: 0, y: 0 };

    vp.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      down = true; dragging = false; moved = 0; v = 0; pid = e.pointerId;
      startX = e.clientX; startScroll = vp.scrollLeft; hist = [{ x: e.clientX, t: performance.now() }];
      cur.classList.add('is-down');
    });
    vp.addEventListener('pointermove', e => {
      pos.x = e.clientX; pos.y = e.clientY;
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (!dragging && moved > 5) { dragging = true; vp.classList.add('is-dragging'); vp.setPointerCapture(pid); }
      if (!dragging) return;
      vp.scrollLeft = startScroll - dx;
      hist.push({ x: e.clientX, t: performance.now() });
      if (hist.length > 6) hist.shift();
    });
    const up = () => {
      if (!down) return;
      down = false;
      cur.classList.remove('is-down');
      if (dragging) {
        const a = hist[0], b = hist[hist.length - 1];
        const dt = Math.max(b.t - a.t, 1);
        v = performance.now() - b.t > 80 ? 0 : -((b.x - a.x) / dt) * 1000; // px/s
        setTimeout(() => vp.classList.remove('is-dragging'), 0);
      }
      dragging = false;
    };
    vp.addEventListener('pointerup', up);
    vp.addEventListener('pointercancel', up);
    vp.addEventListener('click', e => { if (moved > 5) { e.preventDefault(); e.stopPropagation(); } }, true);
    vp.addEventListener('dragstart', e => e.preventDefault());

    vp.addEventListener('pointerenter', e => { pos.x = cpos.x = e.clientX; pos.y = cpos.y = e.clientY; cur.classList.add('is-on'); cursorState('drag', true); });
    vp.addEventListener('pointerleave', () => { cur.classList.remove('is-on'); cursorState('drag', false); });

    onTick(dt => {
      if (Math.abs(v) > 5 && !down) {
        vp.scrollLeft += v * dt;
        v *= Math.pow(0.05, dt); // экспоненциальное затухание, как при прокрутке
      }
      if (cur.classList.contains('is-on')) {
        const k = damp(14, dt);
        cpos.x += (pos.x - cpos.x) * k; cpos.y += (pos.y - cpos.y) * k;
        cur.style.transform = `translate3d(${cpos.x.toFixed(1)}px, ${cpos.y.toFixed(1)}px, 0)`;
      }
    });
  }

  /* =========================================================
     9. Футер: линии, водяной знак, форма
     ========================================================= */
  function footerFx() {
    const titles = $$('.fcol__title');
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

  function subscribeForm() {
    const form = $('#subscribe');
    const field = $('.field', form);
    const input = $('#sub-email', form);
    const err = $('#sub-email-err', form);
    const check = $('.check', form);
    const agree = $('input[name="agree"]', form);
    const btn = $('.btn--submit', form);
    const status = $('.subscribe__status', form);
    let timer = null;

    const shake = el => { el.classList.remove('is-shake'); void el.offsetWidth; el.classList.add('is-shake'); };
    const clearErr = () => { field.classList.remove('is-invalid'); check.classList.remove('is-invalid'); err.textContent = ''; input.removeAttribute('aria-invalid'); };

    input.addEventListener('input', () => { if (field.classList.contains('is-invalid')) clearErr(); });
    agree.addEventListener('change', () => check.classList.remove('is-invalid'));

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (btn.dataset.state !== 'idle') return;
      clearErr();
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        field.classList.add('is-invalid'); input.setAttribute('aria-invalid', 'true');
        err.textContent = email ? 'Проверьте адрес: в нём должны быть «@» и домен, например name@company.ru' : 'Введите адрес электронной почты';
        shake(field); input.focus();
        return;
      }
      if (!agree.checked) {
        check.classList.add('is-invalid');
        status.textContent = 'Отметьте согласие на получение сообщений, чтобы подписаться';
        shake(check);
        return;
      }
      btn.dataset.state = 'loading';
      status.textContent = 'Оформляем подписку…';
      timer = setTimeout(() => { // имитация без бэкенда
        btn.dataset.state = 'success';
        status.textContent = `Подписка оформлена: письма будут приходить на ${email}`;
      }, 1300);
    });

    form.addEventListener('reset', () => {
      clearTimeout(timer);
      clearErr();
      btn.dataset.state = 'idle';
      status.textContent = '';
    });
  }

  /* =========================================================
     Глобальные эффекты: курсор, магнитные кнопки
     ========================================================= */
  const cursorEl = $('.cursor');
  function cursorState(name, on) { cursorEl?.classList.toggle(`is-${name}`, on); }

  function customCursor() {
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
      cursorState('hover', !!e.target.closest('a, button, input, label, summary, .node, [tabindex="0"]'));
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
     Запуск
     ========================================================= */
  subscribeForm();

  if (!G || !ST || RM) {
    // Reduced motion или без библиотек: всё в финальном состоянии, интерактив работает
    $('#intro')?.remove();
    heroNodes();
    return;
  }

  const heroTl = heroTimeline();
  runIntro(() => {
    heroTl.play(0);
    heroTl.eventCallback('onComplete', () => { if (!SMALL) heroParallaxOnce(); });
    G.delayedCall(2.3, heroLive);
  });
  let parallaxDone = false;
  function heroParallaxOnce() { if (!parallaxDone && FINE) { parallaxDone = true; heroParallax(); } }

  heroNodes();
  if (FINE && !SMALL) heroParticles();
  marquee();
  systemScene();
  odometers();
  sectionReveals();
  bento();
  newsDrag();
  footerFx();
  if (FINE) { customCursor(); magnetic(); }

  // пересчёт после загрузки шрифтов (строки заголовков, pin)
  document.fonts?.ready.then(() => ST.refresh());
  window.addEventListener('load', () => ST.refresh());
})();
