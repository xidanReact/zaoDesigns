/* =========================================================
   СНК · Управление продуктами — экран входа.
   Сцена: схема «ТО → сервер СНК → офис» прорисовывается линиями,
   по маршрутам бегут пакеты данных, слои слегка следуют за курсором.
   Единственное «шоу» кабинета: экран видят раз за сессию.
   Инструменты: WAAPI для прорисовки, один rAF-цикл для пакетов и параллакса.
   Форма: проверка, показ пароля, состояния кнопки (idle → loading → success).
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'; // --ease группы

  /* ---------- Форма ---------- */
  const form = $('#login-form');
  const err = $('#login-err');
  const eye = $('[data-eye]');
  const pass = $('#password');
  eye.addEventListener('click', () => {
    const show = pass.type === 'password';
    pass.type = show ? 'text' : 'password';
    eye.setAttribute('aria-pressed', String(show));
    eye.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    eye.querySelector('use').setAttribute('href', show ? '#i-eye-off' : '#i-eye');
    pass.focus();
  });
  const fail = (msg, fields) => {
    err.querySelector('span').textContent = msg;
    err.hidden = false;
    fields.forEach(f => {
      f.closest('.field').classList.add('is-invalid');
      f.setAttribute('aria-invalid', 'true');
      if (!REDUCED) { const w = f.closest('.field'); w.classList.remove('is-shake'); void w.offsetWidth; w.classList.add('is-shake'); }
    });
    fields[0]?.focus();
  };
  form.addEventListener('input', e => {
    const f = e.target.closest('.field');
    if (f) { f.classList.remove('is-invalid'); e.target.removeAttribute('aria-invalid'); }
    if (!$$('.field.is-invalid', form).length) err.hidden = true;
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const login = $('#login');
    const empty = [login, pass].filter(f => !f.value.trim());
    if (empty.length) return fail(empty.length === 2 ? 'Введите логин и пароль.' : empty[0] === login ? 'Введите логин или e-mail.' : 'Введите пароль.', empty);
    const btn = $('.btn--submit', form);
    btn.dataset.state = 'loading';
    btn.setAttribute('aria-busy', 'true');
    // TODO: POST на сервер авторизации. В прототипе пароль «ошибка» показывает отказ.
    setTimeout(() => {
      btn.removeAttribute('aria-busy');
      if (pass.value.trim().toLowerCase() === 'ошибка') {
        btn.dataset.state = 'idle';
        return fail('Неверный логин или пароль. Проверьте раскладку клавиатуры и Caps Lock.', [pass]);
      }
      btn.dataset.state = 'success';
      window.SNC?.announce?.('Вход выполнен');
      setTimeout(() => { window.location.href = form.dataset.next; }, REDUCED ? 200 : 650);
    }, 900);
  });
  // Предупреждение о Caps Lock в поле пароля
  pass.addEventListener('keyup', e => {
    if (typeof e.getModifierState !== 'function') return;
    const on = e.getModifierState('CapsLock');
    const lbl = $('label[for="password"]');
    lbl.textContent = on ? 'Пароль · включён Caps Lock' : 'Пароль';
  });

  /* ---------- Сцена ---------- */
  const scene = $('.login__scene');
  const svg = $('#scene');
  if (!scene || !svg || getComputedStyle(scene).display === 'none') return;

  // 1. Прорисовка: линии в порядке потока данных — лист, ТО, сервер, узлы, связи
  const draws = $$('.ls-draw', svg);
  draws.forEach(el => { const len = Math.ceil(el.getTotalLength ? el.getTotalLength() : 1000); el.style.setProperty('--len', len); });
  const routes = $$('.ls-route', svg);
  const labels = $$('text, .ls-led, .ls-level, .ls-bar, .ls-surface, .ls-accent', svg);
  if (REDUCED) {
    scene.classList.add('is-drawn');
  } else {
    const STEP = 260;
    draws.forEach(el => {
      const len = Number(el.style.getPropertyValue('--len'));
      el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 900, delay: 120 + Number(el.dataset.order) * STEP, easing: EASE, fill: 'forwards' });
    });
    routes.forEach(el => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 120 + Number(el.dataset.order) * STEP, easing: 'ease-out', fill: 'backwards' }));
    labels.forEach((el, i) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 700 + (i % 12) * 40, easing: 'ease-out', fill: 'backwards' }));
    setTimeout(() => {
      scene.classList.add('is-drawn');
      draws.forEach(el => el.getAnimations().forEach(a => a.cancel()));
    }, 120 + 5 * STEP + 950);
  }
  if (REDUCED) return; // без пакетов и параллакса — схема сразу в финальном виде

  // 2. Пакеты: маршрут = цепочка путей; от ТО до сервера, затем от сервера в офис
  const NS = 'http://www.w3.org/2000/svg';
  const layer = $('#packets');
  const path = id => document.getElementById(id);
  const CHAINS = [
    { parts: [path('r-to'), path('r-office')], every: [1400, 2200] },
    { parts: [path('r-n1'), path('r-office')], every: [2600, 3800] },
    { parts: [path('r-n2'), path('r-office')], every: [3000, 4400] }
  ].map(c => ({ ...c, lens: c.parts.map(p => p.getTotalLength()), next: 0 }));
  const packets = [];
  const bar = $('#bar-now');
  const arrive = () => {
    bar?.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.25)' }, { transform: 'scaleY(1)' }], { duration: 420, easing: EASE });
  };
  const spawn = (chain, t) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', '4'); c.setAttribute('class', 'ls-packet');
    c.setAttribute('stroke', '#F7F8FA'); c.setAttribute('stroke-width', '2');
    layer.append(c);
    packets.push({ el: c, chain, born: t, speed: 95 + Math.random() * 40 });
  };

  // 3. Счётчик на дисплее ТРК: идёт налив
  const digits = $('#pump-digits');
  let litres = 12.4, lastDigits = 0;

  // 4. Параллакс слоёв за курсором (только мышь)
  const layers = $$('.ls-layer', svg).map(g => ({ g, depth: Number(g.dataset.depth) || 0, x: 0, y: 0 }));
  let tx = 0, ty = 0;
  if (FINE) window.addEventListener('pointermove', e => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Единый rAF-цикл; на паузе, когда вкладка скрыта
  const t0 = performance.now() + 120 + 5 * 260 + 400; // пакеты — после прорисовки
  let raf = 0;
  const frame = t => {
    raf = requestAnimationFrame(frame);
    if (t > t0) {
      CHAINS.forEach(ch => { if (t >= ch.next) { spawn(ch, t); ch.next = t + ch.every[0] + Math.random() * (ch.every[1] - ch.every[0]); } });
    }
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      let d = (t - p.born) / 1000 * p.speed;
      let k = 0;
      while (k < p.chain.parts.length && d > p.chain.lens[k]) { d -= p.chain.lens[k]; k++; }
      if (k >= p.chain.parts.length) { p.el.remove(); packets.splice(i, 1); arrive(); continue; }
      const pt = p.chain.parts[k].getPointAtLength(d);
      p.el.setAttribute('cx', pt.x.toFixed(1)); p.el.setAttribute('cy', pt.y.toFixed(1));
    }
    if (t - lastDigits > 120) {
      lastDigits = t;
      litres = litres > 58 ? 0 : litres + 0.06 + Math.random() * 0.05;
      digits.textContent = litres.toFixed(2).replace('.', ',');
    }
    if (FINE) layers.forEach(l => {
      l.x += (-tx * l.depth - l.x) * 0.08;
      l.y += (-ty * l.depth - l.y) * 0.08;
      l.g.setAttribute('transform', `translate(${l.x.toFixed(2)} ${l.y.toFixed(2)})`);
    });
  };
  raf = requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else { packets.forEach(p => p.el.remove()); packets.length = 0; raf = requestAnimationFrame(frame); }
  });
})();
