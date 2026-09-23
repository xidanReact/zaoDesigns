/* =========================================================
   СНК · sncard.ru — главная: слой анимаций.
   intro → hero (схема собирается по потоку данных, пакеты, узлы)
   → экосистема (камера между слоями) → витрина snc-service (плитки, веер карт)
   → витрина zao (карта АЗС) → контакты.
   Зависит от js/motion.js (window.SNCFX). Без GSAP всё остаётся
   в финальном состоянии, интерактив (узлы схемы, шаги, точки карты) работает.
   ========================================================= */
(() => {
  'use strict';
  const F = window.SNCFX;
  if (!F) return;
  const { $, $$, clamp, damp, FINE, SMALL, ON, G, ST, EASE, DRAW, onTick, watch, isVis, lenis,
    explodePath, collectDraw, drawInto, createPackets, lineReveal, revealHeading, revealGroup, odometer } = F;

  /* =========================================================
     0. Intro: монограмма прорисовывается, сетка раскрывается
     ========================================================= */
  function runIntro(onReveal) {
    const intro = $('#intro');
    let seen = false;
    try { seen = sessionStorage.getItem('sncard-intro') === '1'; } catch { /* storage недоступен */ }
    if (!ON || seen) { intro?.remove(); onReveal(); return; }
    try { sessionStorage.setItem('sncard-intro', '1'); } catch { /* ignore */ }

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
      // линии знака «уходят» в схему: знак сжимается к центру сцены hero
      .to(svg, { opacity: 0, scale: 0.6, y: -8, duration: 0.35, ease: 'power2.in' }, 1.0)
      .to('.intro__h, .intro__hint', { opacity: 0, duration: 0.2 }, 1.05)
      .add(reveal, 1.05)
      .to(cols, { yPercent: -101, duration: 0.7, stagger: 0.04, ease: 'expo.inOut' }, 1.05);

    const skip = () => {
      reveal();
      if (tl.time() < 1.05) tl.seek(1.05, true);
      tl.timeScale(1.6);
      intro.style.pointerEvents = 'none';
    };
    intro.addEventListener('click', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
  }

  /* =========================================================
     1. Hero — архитектура систем СНК
     ========================================================= */
  const hero = watch($('.hero'));
  const sceneWrap = $('#scene');
  const scene = $('.scene', sceneWrap);
  const node = key => $(`.node[data-node="${key}"]`, scene);
  const line = key => $(`#d-${key}`, scene);
  // Порядок сборки — по потоку данных: объекты на земле → СНК-КС → серверы
  const FLOW = ['neft', 'azs', 'card', 'ks', 'pc', 'office'];

  function heroTimeline() {
    const tl = G.timeline({ paused: true, defaults: { ease: EASE } });
    G.set('#packets', { opacity: 0 }); // статичные пакеты — только для режима без анимаций
    tl.fromTo('.hero .eyebrow', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0);
    tl.add(lineReveal($('.hero__title')), 0.05);
    const uline = $('.u-mark__line');
    if (uline && getComputedStyle(uline).display !== 'none') {
      tl.fromTo(uline, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.8 }, 0.75);
    }
    tl.fromTo(['.hero__lead', '.facts', '.hero__actions > *'], { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.4);

    // Площадка раскрывается, затем узлы прорисовываются линией один за другим
    tl.fromTo('.layer--back', { opacity: 0, scale: 0.94, transformOrigin: '50% 45%' }, { opacity: 1, scale: 1, duration: 1, ease: EASE }, 0.1);
    FLOW.forEach((k, i) => drawInto(tl, collectDraw([node(k)]), 0.35 + i * 0.2, 0.75));
    // Светодиоды мигают CSS-анимацией — прячем до прорисовки корпусов
    const leds = $$('.led, .srv-led', scene);
    G.set(leds, { display: 'none' });
    tl.set(leds, { display: '' }, 1.5);
    // Линии данных тянутся к СНК-КС и от него к серверам
    FLOW.filter(k => line(k)).forEach((k, i) => {
      const p = line(k), L = Math.ceil(p.getTotalLength()) + 1;
      tl.fromTo(p, { opacity: 0, strokeDasharray: `0 ${L}` }, { opacity: 1, strokeDasharray: `${L} 0`, duration: 0.6, ease: DRAW, clearProps: 'strokeDasharray' }, 1.45 + i * 0.1);
    });
    tl.fromTo($$('.callout', scene), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, clearProps: 'opacity,transform' }, 1.8);
    tl.fromTo('.hero .stamp', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 2.3);
    return tl;
  }

  function heroLive() {
    // Пакеты: карта, АЗС, нефтебаза → СНК-КС → СНК-ПЦ и СНК-Офис
    const packetsG = $('#packets', scene);
    packetsG.innerHTML = '';
    const sp = SMALL ? 0.8 : 1, n = SMALL ? 1 : 2;
    let hot = null; // узел под курсором — его линия ускоряется
    const mul = k => () => (hot === k || hot === 'ks' ? 2.2 : 1);
    const updatePackets = createPackets(packetsG, [
      { path: line('card'), speed: 46 * sp, count: 1, mul: mul('card') },
      { path: line('azs'), speed: 40 * sp, count: 1, mul: mul('azs') },
      { path: line('neft'), speed: 52 * sp, count: n, mul: mul('neft') },
      { path: line('pc'), speed: 60 * sp, count: n, mul: mul('pc') },
      { path: line('office'), speed: 50 * sp, count: n, mul: mul('office') },
    ]);
    sceneWrap.addEventListener('snc:node', e => { hot = e.detail.key; });
    let alpha = 0;
    G.to({}, { duration: 0.6, delay: 0.1, onUpdate() { alpha = this.progress(); } });
    packetsG.style.opacity = 0;
    onTick(dt => {
      if (!isVis(hero)) return;
      updatePackets(dt);
      if (alpha < 1) packetsG.style.opacity = alpha;
    });

    // Цифры на дисплее ТРК
    const digits = $$('[data-digits]', scene).map(el => ({ el, v: parseFloat(el.textContent), acc: 0 }));
    // Уровень в резервуарах мягко «дышит»
    const levels = $$('.tank-level', scene).map((el, i) => ({ el, ph: i * 1.7 }));
    let t = 0;
    onTick(dt => {
      if (!isVis(hero)) return;
      t += dt;
      digits.forEach(d => {
        d.acc += dt;
        if (d.acc < 0.09) return;
        d.acc = 0;
        d.v += 0.03 + Math.random() * 0.06;
        if (d.v > 99.99) d.v = 0;
        d.el.textContent = d.v.toFixed(2).padStart(5, '0');
      });
      levels.forEach(l => l.el.setAttribute('transform', `translate(0 ${(Math.sin(t * 0.9 + l.ph) * 2.2).toFixed(2)})`));
    });
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

  /* Hover и фокус по узлам: красный контур, связанные линии, чип-ссылка в раздел ПО */
  function heroNodes() {
    const links = {
      neft: ['neft'], azs: ['azs'], card: ['card'],
      ks: ['neft', 'azs', 'card', 'pc', 'office'],
      pc: ['pc'], office: ['office'],
    };
    let active = null, hideT = null;
    const set = (key, on) => {
      node(key)?.classList.toggle('is-hot', on);
      links[key].forEach(k => line(k)?.classList.toggle('is-hot', on));
      $(`.callout[data-part="${key}"]`, scene)?.classList.toggle('is-hot', on);
      $(`.chip-spec[data-for="${key}"]`, sceneWrap)?.classList.toggle('is-visible', on);
    };
    const emit = key => sceneWrap.dispatchEvent(new CustomEvent('snc:node', { detail: { key } }));
    const show = key => { clearTimeout(hideT); if (active && active !== key) set(active, false); active = key; set(key, true); emit(key); };
    const hide = (key, delay = 0) => {
      clearTimeout(hideT);
      hideT = setTimeout(() => { if (active === key) { set(key, false); active = null; emit(null); } }, delay);
    };
    $$('.node', scene).forEach(el => {
      const key = el.dataset.node;
      if (!links[key]) return;
      el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') show(key); });
      el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hide(key, 220); });
      el.addEventListener('focus', () => show(key));
      el.addEventListener('blur', e => { if (!e.relatedTarget?.closest?.(`.chip-spec[data-for="${key}"]`)) hide(key); });
      el.addEventListener('click', () => (active === key ? hide(key) : show(key)));
      el.addEventListener('keydown', e => {
        if (e.key === 'Escape') hide(key);
        if (e.key === 'Enter') $(`.chip-spec[data-for="${key}"]`, sceneWrap)?.click();
      });
    });
    // чип — ссылка: курсор может перейти на него, не закрыв подсказку
    $$('.chip-spec', sceneWrap).forEach(chip => {
      chip.tabIndex = -1;
      chip.addEventListener('pointerenter', () => { clearTimeout(hideT); });
      chip.addEventListener('pointerleave', () => hide(chip.dataset.for, 160));
    });
    document.addEventListener('pointerdown', e => { if (active && !e.target.closest('.node, .chip-spec')) hide(active); });
  }

  /* =========================================================
     2. Экосистема: шаги по скроллу и клику, камера между слоями,
        в конце — общий вид, все три слоя соединены
     ========================================================= */
  const LAYERS = ['Программное обеспечение', 'Оборудование и карты', 'Сеть АЗС и топливные карты'];
  const VIEWS = [
    { cx: 290, cy: 450, s: 1.5 },   // модули ПО
    { cx: 810, cy: 440, s: 1.5 },   // оборудование и карты
    { cx: 1320, cy: 460, s: 1.5 },  // карта АЗС
    { cx: 800, cy: 530, s: 1 },     // общий вид
  ];

  function ecoScene() {
    const sys = watch($('#ecosystem'));
    const cam = $('.cam', sys);
    const stage = $('.stage', sys);
    const steps = $$('.step', sys);
    const bar = $('.steps__bar span', sys);
    const hud = $('.stage__zone', sys);
    const wide = () => window.matchMedia('(min-width: 1025px)').matches;
    const drawn = new Set();
    let cur = -1;

    sys.classList.add('is-interactive');
    stage.id = 'eco-stage';
    steps.forEach((s, i) => {
      s.setAttribute('role', 'button');
      s.tabIndex = 0;
      s.setAttribute('aria-controls', 'eco-stage');
      s.addEventListener('click', e => { if (!e.target.closest('a')) show(i, { user: true }); });
      s.addEventListener('keydown', e => {
        if (e.target !== s) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i, { user: true }); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); steps[(i + 1) % 3].focus(); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); steps[(i + 2) % 3].focus(); }
      });
    });

    // Пакеты: по шине, от слоёв к шине и между слоями; по линиям карты — на своём слое
    const upd = ON ? createPackets($('.s-packets', cam), [
      { path: $('#e-bus', cam), speed: 220, count: 3, enabled: () => cur === 3 },
      { path: $('#e-z1', cam), speed: 70, count: 1, enabled: () => drawn.has(0) },
      { path: $('#e-z2', cam), speed: 70, count: 1, enabled: () => drawn.has(1) },
      { path: $('#e-z3', cam), speed: 70, count: 1, enabled: () => drawn.has(2) },
      { path: $('#e-12', cam), speed: 50, count: 1, enabled: () => drawn.has(1) },
      { path: $('#e-23', cam), speed: 50, count: 1, enabled: () => drawn.has(2) },
      ...$$('.net-line', cam).map(p => ({ path: p, speed: 90, count: 1, enabled: () => cur === 2 || cur === 3 })),
    ], 4) : null;
    if (upd) {
      $$('.s-packets > circle:not([style])', cam).forEach(c => c.remove()); // статичные пакеты
      onTick(dt => { if (isVis(sys)) upd(dt); });
    }

    const view = { ...VIEWS[3] };
    const applyCam = () => cam.setAttribute('transform',
      `translate(${(800 - view.cx * view.s).toFixed(2)} ${(500 - view.cy * view.s).toFixed(2)}) scale(${view.s.toFixed(4)})`);

    const zone = i => $(`.zone[data-zone="${i}"]`, cam);
    const reveal = i => { const set = collectDraw([zone(i)]); G.set([...set.lines.map(l => l.el), ...set.fills, ...set.fades], { opacity: 1 }); };
    const drawZone = i => {
      if (drawn.has(i)) return;
      drawn.add(i);
      if (!ON) return;
      reveal(i);
      const tl = G.timeline({ delay: 0.2 });
      drawInto(tl, collectDraw([zone(i)]), 0, 1.0);
    };

    function show(i, { user = false } = {}) {
      if (i === cur) return;
      cur = i;
      const all = i === 3;
      steps.forEach((s, k) => {
        const on = all || k === i;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-pressed', String(k === i));
      });
      hud.textContent = all ? 'Слои 1–3 · Одна система' : `Слой ${i + 1}/3 · ${LAYERS[i]}`;
      sys.dataset.step = String(i);
      bar.style.transform = `scaleY(${all ? 1 : (i + 1) / 3})`;
      if (all) [0, 1, 2].forEach(drawZone); else drawZone(i);
      // Камера работает на широком экране; на узком схема целиком и появляется по частям
      const v = wide() ? VIEWS[i] : VIEWS[3];
      if (!ON) { Object.assign(view, v); applyCam(); return; }
      G.to(view, { ...v, duration: 1.1, ease: 'power2.inOut', onUpdate: applyCam, overwrite: true });
      // на узком экране схема ниже списка — показать её после клика
      if (user && !wide()) {
        const r = stage.getBoundingClientRect();
        if (r.top > innerHeight * 0.6 || r.bottom < 80) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    if (!ON) { [0, 1, 2].forEach(i => drawn.add(i)); show(3); return; }

    // До показа слои не нарисованы
    $$('.zone', cam).forEach(z => { const set = collectDraw([z]); G.set([...set.lines.map(l => l.el), ...set.fills, ...set.fades], { opacity: 0 }); });
    Object.assign(view, wide() ? VIEWS[0] : VIEWS[3]); applyCam();

    // Шаги по скроллу: активен шаг, дошедший до середины экрана; после последнего — общий вид
    steps.forEach((s, i) => ST.create({
      trigger: s, start: 'top 62%', end: 'bottom 62%',
      onEnter: () => show(i), onEnterBack: () => show(i),
    }));
    ST.create({ trigger: steps[2], start: 'bottom 45%', onEnter: () => show(3), onLeaveBack: () => show(2) });
    ST.create({ trigger: sys, start: 'top 65%', once: true, onEnter: () => { if (cur < 0) show(0); } });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', () => {
      const v = wide() && cur < 3 && cur >= 0 ? VIEWS[cur] : VIEWS[3];
      G.to(view, { ...v, duration: 0.6, ease: 'power2.inOut', onUpdate: applyCam, overwrite: true });
    });

    revealHeading($('#eco-title'));
    G.fromTo(steps, { opacity: 0, y: 16 }, {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: EASE, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: $('.steps', sys), start: 'top 82%', once: true },
    });
  }

  /* =========================================================
     3. Витрина snc-service: веер карт, наклон верхней карты с бликом
     ========================================================= */
  function cardFan() {
    const fan = $('.fan');
    if (!fan) return;
    const top = $('.fcard--rfid', fan);
    const under = [$('.fcard--mag', fan), $('.fcard--bar', fan)];
    const tl = G.timeline({ paused: true, defaults: { ease: EASE } });
    // Карты «раздаются» из общей стопки под верхней картой
    tl.fromTo(fan, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 0)
      .from(under, { rotation: 3, xPercent: 2, yPercent: 0, duration: 1.1, stagger: 0.09, ease: 'power3.out', clearProps: 'all' }, 0.2);
    ST.create({ trigger: fan, start: 'top 80%', once: true, onEnter: () => tl.play() });

    if (!FINE || SMALL) return;
    const base = { r: 3, x: 2 };
    const rot = { x: 0, y: 0 };
    const apply = () => { top.style.transform = `perspective(1000px) rotate(${base.r}deg) translate(${base.x}%, 0) rotateX(${rot.x.toFixed(2)}deg) rotateY(${rot.y.toFixed(2)}deg)`; };
    const tx = G.quickTo(rot, 'x', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
    const ty = G.quickTo(rot, 'y', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
    const glare = document.createElement('span');
    glare.className = 'fcard__glare';
    top.prepend(glare);
    fan.addEventListener('pointermove', e => {
      const r = fan.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      tx(py * -12); ty(px * 14);
      glare.style.transform = `translate3d(${(-px * 60).toFixed(1)}%, ${(-py * 60).toFixed(1)}%, 0)`;
      glare.style.opacity = '1';
    });
    fan.addEventListener('pointerleave', () => { tx(0); ty(0); glare.style.opacity = '0'; });
  }

  /* =========================================================
     4. Витрина zao: точки загораются от Томска наружу, линии-данные
     ========================================================= */
  function netMap() {
    const fig = $('#netmap');
    if (!fig) return;
    const svg = $('svg', fig);
    const pts = $$('.net-pt', svg);
    const lines = $$('.net-line', svg);
    const hub = $('.net-hub', svg);
    const hx = +hub.getAttribute('cx'), hy = +hub.getAttribute('cy');

    // Чип с адресом АЗС: hover и фокус (данные — из aria-label точки)
    const chip = document.createElement('div');
    chip.className = 'net-chip mono';
    chip.setAttribute('aria-hidden', 'true');
    fig.appendChild(chip);
    const showChip = pt => {
      const [num, ...addr] = pt.getAttribute('aria-label').split(', ');
      chip.innerHTML = `<b>${num}</b><span>${addr.join(', ')}</span>`;
      const c = $('circle', pt), fr = fig.getBoundingClientRect(), cr = c.getBoundingClientRect();
      const x = cr.left + cr.width / 2 - fr.left, y = cr.top - fr.top;
      chip.style.left = `${clamp(x, 130, fr.width - 130).toFixed(0)}px`;
      // у верхних точек чип не помещается сверху — показываем под точкой
      const below = y < 90;
      chip.classList.toggle('net-chip--below', below);
      chip.style.top = `${(below ? y + cr.height : y).toFixed(0)}px`;
      chip.classList.add('is-visible');
      pt.classList.add('is-hot');
    };
    const hideChip = pt => { chip.classList.remove('is-visible'); pt.classList.remove('is-hot'); };
    pts.forEach(pt => {
      pt.addEventListener('pointerenter', () => showChip(pt));
      pt.addEventListener('pointerleave', () => hideChip(pt));
      pt.addEventListener('focus', () => showChip(pt));
      pt.addEventListener('blur', () => hideChip(pt));
    });

    if (!ON) return;
    // Каскад по расстоянию от Томска
    const dist = pts.map(pt => { const c = $('circle', pt); return Math.hypot(+c.getAttribute('cx') - hx, +c.getAttribute('cy') - hy); });
    const maxD = Math.max(...dist) || 1;
    const tl = G.timeline({ paused: true, defaults: { ease: EASE } });
    tl.fromTo($$('.grat, .bp-coord, .ring', svg), { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.015, ease: 'power1.out' }, 0)
      .fromTo(hub, { attr: { r: 2 } }, { attr: { r: 9 }, duration: 0.6, ease: 'back.out(2)' }, 0.2);
    lines.forEach((p, i) => {
      const L = Math.ceil(p.getTotalLength()) + 1;
      tl.fromTo(p, { opacity: 0, strokeDasharray: `0 ${L}` }, { opacity: 1, strokeDasharray: `${L} 0`, duration: 0.5 + dist[i] / maxD * 0.6, ease: DRAW, clearProps: 'strokeDasharray' }, 0.35);
    });
    pts.forEach((pt, i) => {
      const at = 0.45 + dist[i] / maxD * 0.9;
      tl.fromTo($('circle', pt), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(2.5)' }, at)
        .fromTo($('text', pt), { opacity: 0, x: -4 }, { opacity: 1, x: 0, duration: 0.4 }, at + 0.1);
    });
    tl.fromTo($$('.bp-label--accent', svg), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.5);
    ST.create({ trigger: fig, start: 'top 75%', once: true, onEnter: () => tl.play() });

    // Линии-данные: время от времени по линии пробегает пакет
    const pg = document.createElementNS(F.NS, 'g'); svg.appendChild(pg);
    const upd = createPackets(pg, lines.map((p, i) => ({ path: p, speed: 70 + i * 6, count: 1, enabled: () => tl.progress() === 1 })), 3.2);
    watch(fig);
    onTick(dt => { if (isVis(fig)) upd(dt); });
  }

  /* =========================================================
     Секции: заголовки, метрики, контакты, CTA
     ========================================================= */
  function sections() {
    ['#svc-title', '#zao-title', '#reach-title'].forEach(id => revealHeading($(id)));
    $$('.showcase').forEach(sec => revealGroup($$('.site-tag, .section-head__text, .metrics-row, .showcase__main > .hero__actions', sec), { trigger: sec, start: 'top 70%', stagger: 0.07 }));
    revealGroup([$('.showcase__cap'), ...$$('.showcase--svc .spec > div'), $('.showcase--svc .link-more')], { trigger: $('.showcase--svc .showcase__side'), start: 'top 70%', stagger: 0.06 });
    $$('.showcase [data-count]').forEach(el => odometer(el, { start: 'top 85%' }));

    F.officeReveal();
    revealGroup($$('.reach__lines > *'), { trigger: $('.reach__lines'), start: 'top 82%' });
    revealGroup($$('.reach .dept'), { trigger: $$('.reach .dept')[0], start: 'top 88%' });
    F.ctaReveal();
  }

  /* =========================================================
     Запуск
     ========================================================= */
  heroNodes();
  ecoScene();
  netMap();

  if (!ON) {
    // Без библиотек: финальное состояние, интерактив работает без движения
    $('#intro')?.remove();
    return;
  }

  F.inlineIcons();
  const heroTl = heroTimeline();
  let parallaxOn = false;
  runIntro(() => {
    heroTl.play(0);
    G.delayedCall(0.55, () => $$('.facts [data-count]').forEach(el => odometer(el, { immediate: true })));
    G.delayedCall(1.9, heroLive);
    heroTl.eventCallback('onComplete', () => { if (FINE && !SMALL && !parallaxOn) { parallaxOn = true; heroParallax(); } });
  });

  F.tileCards();
  cardFan();
  sections();
})();
