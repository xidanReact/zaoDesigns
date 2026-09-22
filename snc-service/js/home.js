/* =========================================================
   СНК · snc-service — главная: слой анимаций.
   intro → hero (сборка/разнесение концентратора, этапы) → бегущая строка
   → оборудование (bento) → полный цикл (pin + камера) → карты → контакты.
   Зависит от js/motion.js (window.SNCFX). Без GSAP или при
   prefers-reduced-motion всё остаётся в финальном состоянии,
   интерактив (узлы схемы, этапы, переворот карты) работает.
   ========================================================= */
(() => {
  'use strict';
  const F = window.SNCFX;
  if (!F) return;
  const { $, $$, NS, clamp, damp, RM, FINE, SMALL, ON, G, ST, EASE, DRAW, onTick, watch, isVis, lenis,
    explodePath, collectDraw, drawInto, createPackets, lineReveal, revealHeading, revealGroup } = F;

  /* =========================================================
     0. Intro
     ========================================================= */
  function runIntro(onReveal) {
    const intro = $('#intro');
    let seen = false;
    try { seen = sessionStorage.getItem('snc-service-intro') === '1'; } catch { /* storage недоступен */ }
    if (!ON || seen) { intro?.remove(); onReveal(); return; }
    try { sessionStorage.setItem('snc-service-intro', '1'); } catch { /* ignore */ }

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
      .to(svg, { opacity: 0, y: -8, duration: 0.3, ease: 'power2.out' }, 1.0)
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
     1. Hero — концентратор ТРК
     ========================================================= */
  const hero = watch($('.hero'));
  const sceneWrap = $('#scene');
  const scene = $('.scene', sceneWrap);
  const layerEl = name => $(`.ex-layer[data-layer="${name}"]`, scene);
  // Смещение слоёв (px экрана) в собранном состоянии: слои «садятся» друг на друга
  const ASSEMBLED = { base: 0, board: 80, mods: 140, cover: 250 };
  const LAYERS = ['cover', 'mods', 'board', 'base'];

  function setAssembled(on, animate = true) {
    const items = LAYERS.map(n => [layerEl(n), on ? ASSEMBLED[n] : 0]);
    if (!G || !animate || RM) { items.forEach(([el, y]) => el.setAttribute('transform', y ? `translate(0 ${y})` : '')); return; }
    items.forEach(([el, y], i) => G.to(el, { y, duration: 0.9, delay: on ? i * 0.05 : (3 - i) * 0.05, ease: 'power3.inOut', overwrite: true }));
    G.to($('.ex-axes', scene), { opacity: on ? 0 : 1, duration: 0.4, ease: 'power1.out', overwrite: true });
  }

  function heroTimeline() {
    const tl = G.timeline({ paused: true, defaults: { ease: EASE } });
    G.set('#packets', { opacity: 0 }); // статичные пакеты — только для режима без анимаций
    tl.fromTo('.hero .eyebrow', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0);
    tl.add(lineReveal($('.hero__title')), 0.05);
    const uline = $('.u-mark__line');
    if (uline && getComputedStyle(uline).display !== 'none') {
      tl.fromTo(uline, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.8 }, 0.7);
    }
    tl.fromTo(['.hero__lead', '.verbs', '.hero__actions > *', '.hero .legend'], { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.4);

    // Схема: сначала устройство прорисовывается собранным, затем раскрывается по оси сборки
    tl.fromTo('.layer--back', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power1.out' }, 0.1);
    LAYERS.forEach(n => G.set(layerEl(n), { y: ASSEMBLED[n] }));
    const axes = $('.ex-axes', scene);
    G.set(axes, { opacity: 0 });
    ['base', 'board', 'mods', 'cover'].forEach((n, i) => drawInto(tl, collectDraw([layerEl(n)]), 0.3 + i * 0.22, 0.7));
    // Светодиоды мигают CSS-анимацией (она сильнее inline-opacity) — прячем до прорисовки крышки
    const leds = $$('[data-layer="cover"] circle', scene);
    G.set(leds, { display: 'none' });
    tl.set(leds, { display: '' }, 1.2);
    tl.addLabel('explode', 1.55);
    LAYERS.forEach((n, i) => tl.to(layerEl(n), { y: 0, duration: 1.1, ease: 'expo.inOut' }, `explode+=${i * 0.07}`));
    tl.to(axes, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 'explode+=0.5');

    // Внешние узлы и линии данных — от разъёмов наружу
    drawInto(tl, collectDraw([$('[data-node="pc"]', scene), $('#d-pc', scene)]), 2.25, 0.7);
    drawInto(tl, collectDraw([$('[data-node="reader"]', scene), $('#d-rd', scene)]), 2.45, 0.6);
    drawInto(tl, collectDraw([$('[data-node="trk"]', scene), $('#d-trk', scene)]), 2.55, 0.7);
    // clearProps: дальше прозрачностью выносок управляет CSS (приглушение на этапе «Поставка»)
    tl.fromTo($$('.callout', scene), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, ease: EASE, clearProps: 'opacity,transform' }, 2.35);
    tl.fromTo('.hero .stamp', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 2.8);
    return tl;
  }

  function heroLive() {
    // Пакеты по линиям данных
    const packetsG = $('#packets', scene);
    packetsG.innerHTML = '';
    const sp = SMALL ? 0.8 : 1;
    let boost = 1; // на этапе «Ремонт» — диагностика, пакеты быстрее
    const updatePackets = createPackets(packetsG, [
      { path: $('#d-pc', scene), speed: 64 * sp, count: SMALL ? 1 : 2, mul: () => boost },
      { path: $('#d-rd', scene), speed: 30 * sp, count: 1, mul: () => boost },
      { path: $('#d-trk', scene), speed: 58 * sp, count: SMALL ? 1 : 2, mul: () => boost },
    ]);
    let alpha = 0;
    G.to({}, { duration: 0.6, delay: 0.1, onUpdate() { alpha = this.progress(); } });
    packetsG.style.opacity = 0;
    onTick(dt => {
      if (!isVis(hero)) return;
      updatePackets(dt);
      if (alpha < 1) packetsG.style.opacity = alpha;
      const tgt = sceneWrap.dataset.verb === '3' ? 2.2 : 1;
      boost += (tgt - boost) * damp(3, dt);
    });

    // Цифры на дисплее ТРК
    const digits = $$('[data-digits]', scene).map(el => ({ el, v: parseFloat(el.textContent), acc: 0 }));
    onTick(dt => {
      if (!isVis(hero)) return;
      digits.forEach(d => {
        d.acc += dt;
        if (d.acc < 0.09) return;
        d.acc = 0;
        d.v += 0.03 + Math.random() * 0.06;
        if (d.v > 99.99) d.v = 0;
        d.el.textContent = d.v.toFixed(2).padStart(5, '0');
      });
    });
  }

  /* Этапы «Разработка → Ремонт»: состояние схемы, автосмена с прогрессом */
  function heroVerbs(autoplay) {
    const list = $('.verbs');
    const verbs = $$('.verb', list);
    let cur = 0, hovering = false;
    const set = (i, { user = false } = {}) => {
      if (i === cur && sceneWrap.dataset.verb === String(i)) return;
      const wasAssembled = cur === 2;
      cur = i;
      verbs.forEach((v, k) => { v.classList.toggle('is-active', k === i); v.setAttribute('aria-current', k === i ? 'step' : 'false'); });
      sceneWrap.dataset.verb = String(i);
      if (i === 2) setAssembled(true); else if (wasAssembled) setAssembled(false);
      if (user) list.classList.add('is-user');
    };
    verbs.forEach((v, i) => {
      v.tabIndex = 0;
      v.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hovering = true; set(i, { user: true }); list.classList.add('is-paused'); } });
      v.addEventListener('pointerleave', () => { hovering = false; list.classList.remove('is-paused'); });
      v.addEventListener('focus', () => { set(i, { user: true }); list.classList.add('is-paused'); });
      v.addEventListener('blur', () => list.classList.remove('is-paused'));
      v.addEventListener('click', () => set(i, { user: true }));
      v.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const j = (i + (e.key === 'ArrowRight' ? 1 : verbs.length - 1)) % verbs.length;
          verbs[j].focus();
        }
      });
    });
    sceneWrap.dataset.verb = '0';
    verbs[0].setAttribute('aria-current', 'step');
    if (!autoplay) return;

    // Автосмена: таймером служит CSS-полоса прогресса под активным этапом —
    // пауза полосы (hover, фокус, экран вне видимости) = пауза смены
    list.classList.add('is-auto');
    list.addEventListener('animationend', e => {
      if (e.pseudoElement !== '::after' || hovering) return;
      set((cur + 1) % verbs.length);
    });
    new IntersectionObserver(([e]) => list.classList.toggle('is-offscreen', !e.isIntersecting)).observe(hero);
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

  /* Hover и фокус по узлам: красный контур, связанные линии, чип-ссылка в каталог */
  function heroNodes() {
    const links = {
      pc: ['#d-pc', '#d-rd'],
      reader: ['#d-rd'],
      trk: ['#d-trk'],
      device: ['#d-pc', '#d-trk'],
    };
    let active = null, hideT = null;
    const set = (key, on) => {
      $(`.node[data-node="${key}"]`, scene)?.classList.toggle('is-hot', on);
      links[key].forEach(s => $(s, scene)?.classList.toggle('is-hot', on));
      if (key === 'device') $$('.callout', scene).forEach(c => c.classList.toggle('is-hot', on));
      $(`.chip-spec[data-for="${key}"]`, sceneWrap)?.classList.toggle('is-visible', on);
    };
    const show = key => { clearTimeout(hideT); if (active && active !== key) set(active, false); active = key; set(key, true); };
    const hide = (key, delay = 0) => {
      clearTimeout(hideT);
      hideT = setTimeout(() => { if (active === key) { set(key, false); active = null; } }, delay);
    };
    $$('.node', scene).forEach(node => {
      const key = node.dataset.node;
      if (!links[key]) return;
      node.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') show(key); });
      node.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hide(key, 220); });
      node.addEventListener('focus', () => show(key));
      node.addEventListener('blur', e => { if (!e.relatedTarget?.closest?.(`.chip-spec[data-for="${key}"]`)) hide(key); });
      node.addEventListener('click', () => (active === key ? hide(key) : show(key)));
      node.addEventListener('keydown', e => {
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
     Бегущая строка
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
      const v = dt > 0 ? Math.abs(y - lastY) / dt : 0;
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
     3. Полный цикл: этапы по клику, «камера» переходит к сцене
     ========================================================= */
  const ZONES = ['Разработка', 'Производство', 'Поставка', 'Ремонт'];
  const VIEWS = [
    { cx: 225, cy: 390, s: 1.65 },   // чертёж
    { cx: 612, cy: 320, s: 1.75 },   // сборка
    { cx: 1030, cy: 430, s: 1.55 },  // упаковка
    { cx: 1400, cy: 400, s: 1.6 },   // диагностика
  ];

  function cycleScene() {
    const sys = watch($('#cycle'));
    const cam = $('.cam', sys);
    const stage = $('.stage', sys);
    const steps = $$('.step', sys);
    const bar = $('.steps__bar span', sys);
    const hud = $('.stage__zone', sys);
    const checks = explodePath($('.check-mark', cam));
    const drawn = new Set();

    // Этапы — кнопки (без JS это просто список, схема показана целиком)
    sys.classList.add('is-interactive');
    steps.forEach((s, i) => {
      s.setAttribute('role', 'button');
      s.tabIndex = 0;
      s.setAttribute('aria-controls', 'cycle-stage');
      s.addEventListener('click', () => show(i, { user: true }));
      s.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i, { user: true }); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); steps[(i + 1) % 4].focus(); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); steps[(i + 3) % 4].focus(); }
      });
    });
    stage.id = 'cycle-stage';

    let cur = -1;
    const upd = ON ? createPackets($('.s-packets', cam), [
      { path: $('#s-flow', cam), speed: 160, count: 3, enabled: () => drawn.has(1) },
      { path: $('#s-ship', cam), speed: 60, count: 1, enabled: () => cur === 2 },
    ], 4) : null;
    if (upd) onTick(dt => { if (isVis(sys)) upd(dt); });

    const view = { ...VIEWS[0] };
    const applyCam = () => cam.setAttribute('transform',
      `translate(${(800 - view.cx * view.s).toFixed(2)} ${(380 - view.cy * view.s).toFixed(2)}) scale(${view.s.toFixed(4)})`);

    let show = function (i, { user = false } = {}) {
      if (i === cur) return;
      cur = i;
      steps.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-pressed', String(k === i)); });
      hud.textContent = `Этап ${i + 1}/4 · ${ZONES[i]}`;
      sys.dataset.step = String(i);
      bar.style.transform = `scaleY(${(i + 1) / 4})`;
      if (!ON) { Object.assign(view, VIEWS[i]); applyCam(); drawn.add(i); return; }
      G.to(view, { ...VIEWS[i], duration: 1.1, ease: 'power2.inOut', onUpdate: applyCam, overwrite: true });
      if (!drawn.has(i)) {
        drawn.add(i);
        const tl = G.timeline({ delay: 0.25 });
        drawInto(tl, collectDraw([$(`.zone[data-zone="${i}"]`, cam)]), 0, 1.0);
        if (i === 3) checks.forEach((c, k) => {
          const L = c.getTotalLength() + 1;
          tl.fromTo(c, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.25, ease: DRAW }, 0.8 + k * 0.2);
        });
      }
      // на узком экране схема ниже списка — показать её после клика
      if (user && window.matchMedia('(max-width: 1024px)').matches) {
        const r = stage.getBoundingClientRect();
        if (r.top > innerHeight * 0.6 || r.bottom < 80) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    if (ON) {
      // До первого показа сцены не нарисованы; первый этап открывается, когда секция в экране
      $$('.zone', cam).forEach(z => { const set = collectDraw([z]); G.set(set.lines.map(l => l.el), { opacity: 0 }); G.set([...set.fills, ...set.fades], { opacity: 0 }); });
      const reveal = z => { const set = collectDraw([z]); G.set([...set.lines.map(l => l.el), ...set.fills, ...set.fades], { opacity: 1 }); };
      const origShow = show;
      show = (i, o) => { reveal($(`.zone[data-zone="${i}"]`, cam)); origShow(i, o); };
      G.set(checks, { opacity: 1 });
      checks.forEach(c => { const L = c.getTotalLength() + 1; G.set(c, { strokeDasharray: L, strokeDashoffset: L }); });
      Object.assign(view, VIEWS[0]); applyCam();
      ST.create({ trigger: sys, start: 'top 65%', once: true, onEnter: () => show(0) });
      G.fromTo(steps, { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: EASE, clearProps: 'transform,opacity',
        scrollTrigger: { trigger: $('.steps', sys), start: 'top 82%', once: true },
      });
    } else show(0);
  }

  /* =========================================================
     4. Изготовление карт: веер, наклон с бликом, переворот
     ========================================================= */
  function cardLab() {
    const stage = $('.cardlab__stage');
    const desk = $('.cardlab__desk', stage);
    const top = $('#pcard');
    const glare = $('.pcard__glare', top);
    const hint = $('.cardlab__hint', stage);
    let flipped = false;

    // Карта — кнопка переворота (без JS это просто иллюстрация)
    top.removeAttribute('aria-hidden');
    top.setAttribute('role', 'button');
    top.tabIndex = 0;
    top.setAttribute('aria-pressed', 'false');
    top.setAttribute('aria-label', 'Перевернуть карту: антенна и чип Mifare');
    hint.hidden = false;

    const rot = { x: 0, y: 0, flip: 0 };
    const apply = () => { top.style.transform = `rotateX(${rot.x.toFixed(2)}deg) rotateY(${(rot.y + rot.flip).toFixed(2)}deg)`; };
    const flip = () => {
      flipped = !flipped;
      top.setAttribute('aria-pressed', String(flipped));
      stage.classList.toggle('is-flipped', flipped);
      if (G && !RM) G.to(rot, { flip: flipped ? 180 : 0, duration: 0.9, ease: 'power3.inOut', onUpdate: apply, overwrite: 'auto' });
      else { rot.flip = flipped ? 180 : 0; apply(); }
    };
    top.addEventListener('click', flip);
    top.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });

    if (!ON) return;

    // Наклон за курсором — пружинно (quickTo), блик смещается навстречу
    if (FINE && !SMALL) {
      const tx = G.quickTo(rot, 'x', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
      const ty = G.quickTo(rot, 'y', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
      desk.addEventListener('pointermove', e => {
        const r = desk.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        tx(py * -12); ty(px * 14);
        glare.style.transform = `translate3d(${(-px * 60).toFixed(1)}%, ${(-py * 60).toFixed(1)}%, 0)`;
        glare.style.opacity = '1';
      });
      desk.addEventListener('pointerleave', () => { tx(0); ty(0); glare.style.opacity = '0'; });
    }

    // Появление: карты раздаются веером из стопки, размеры дорисовываются
    const fan = [$('.pcard--3', desk), $('.pcard--2', desk)];
    const tl = G.timeline({ paused: true, defaults: { ease: EASE } });
    tl.fromTo(desk, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 0)
      .from(fan, { rotation: 0, xPercent: 0, yPercent: 0, x: 0, y: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out', clearProps: 'rotation,x,y,xPercent,yPercent' }, 0.25)
      .fromTo($('.cardlab__dims', desk), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0.8)
      .fromTo($$('.cardlab__dim', desk), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.95)
      .fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.3);
    ST.create({ trigger: stage, start: 'top 75%', once: true, onEnter: () => tl.play() });

    revealHeading($('#cards-title'));
    revealGroup([$('.cardlab__lead'), ...$$('.spec > div'), $('.cardlab__text .hero__actions')], { trigger: $('.cardlab__text'), start: 'top 78%', stagger: 0.06 });
  }

  /* =========================================================
     5. Контакты и CTA
     ========================================================= */
  function contacts() {
    revealHeading($('#eq-title'));
    revealHeading($('#reach-title'));

    F.officeReveal();
    revealGroup($$('.reach__lines > *'), { trigger: $('.reach__lines'), start: 'top 82%' });
    revealGroup([$('.dept--wide')], { start: 'top 88%' });

    F.ctaReveal();
  }

  /* =========================================================
     Запуск
     ========================================================= */
  heroNodes();
  cardLab();
  cycleScene();

  if (!ON) {
    // Reduced motion или без библиотек: финальное состояние, этапы переключаются без движения
    $('#intro')?.remove();
    heroVerbs(false);
    return;
  }

  F.inlineIcons();
  const heroTl = heroTimeline();
  let parallaxOn = false;
  runIntro(() => {
    heroTl.play(0);
    G.delayedCall(2.9, () => { heroLive(); heroVerbs(true); });
    heroTl.eventCallback('onComplete', () => { if (FINE && !SMALL && !parallaxOn) { parallaxOn = true; heroParallax(); } });
  });

  marquee();
  F.bentoCards();
  contacts();
})();
