/* =========================================================
   СНК · snc-service — внутренние страницы.
   Функциональность работает всегда (в т.ч. при reduced-motion и без GSAP):
   добавление в корзину, количество, галерея товара, поиск по документации,
   прайс карт (подсветка, выбор тиража), лайтбокс примеров, оглавление политик.
   Анимации — только если включены (SNCFX.ON).
   ========================================================= */
(() => {
  'use strict';
  const F = window.SNCFX;
  const S = window.SNC;
  if (!F || !S) return;
  const { $, $$, clamp, ON, FINE, G, ST, EASE, lineReveal, revealHeading, revealGroup, odometer } = F;

  /* Лента категорий на узком экране: текущая категория — в видимой области */
  const catCur = $('.catnav__link.is-current');
  if (catCur) {
    const strip = catCur.closest('ul');
    if (strip.scrollWidth > strip.clientWidth) strip.scrollLeft = catCur.parentElement.offsetLeft - 16;
  }

  /* =========================================================
     Количество: кнопки −/+ и ввод
     ========================================================= */
  $$('[data-qty]').forEach(q => {
    const input = $('.qty__input', q);
    const set = v => { input.value = clamp(Math.round(+v || 1), 1, 999); input.dispatchEvent(new Event('change', { bubbles: true })); };
    $$('[data-step]', q).forEach(b => b.addEventListener('click', () => set(+input.value + +b.dataset.step)));
    input.addEventListener('blur', () => set(input.value));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); set(input.value); } });
  });

  /* =========================================================
     В корзину: состояние кнопки, статус, «полёт» миниатюры к шапке
     ========================================================= */
  const cartTarget = () => $$('[data-cart-link]').find(a => a.offsetParent !== null) || $('.burger');
  function fly(from, imgSrc) {
    if (!ON || !imgSrc) return;
    const to = cartTarget();
    if (!to) return;
    const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'fly';
    el.innerHTML = `<img src="${imgSrc}" alt="">`;
    document.body.appendChild(el);
    const x0 = a.left + a.width / 2 - 28, y0 = a.top + a.height / 2 - 28;
    const x1 = b.left + b.width / 2 - 28, y1 = b.top + b.height / 2 - 28;
    // дуга: горизонталь линейно, вертикаль с «подбросом»
    G.set(el, { x: x0, y: y0, scale: 1 });
    G.to(el, { x: x1, duration: 0.75, ease: 'power1.inOut' });
    G.to(el, { y: y1, duration: 0.75, ease: 'back.in(1.6)' });
    G.to(el, { scale: 0.35, opacity: 0.2, duration: 0.75, ease: 'power2.in', onComplete: () => el.remove() });
  }

  $$('[data-add]').forEach(btn => {
    let t = null;
    btn.addEventListener('click', () => {
      const id = +btn.dataset.add;
      const box = btn.closest('[data-buy]');
      const qty = box ? clamp(+$('.qty__input', box).value || 1, 1, 999) : 1;
      const card = btn.closest('.prod, .product');
      const img = card && ($('.gal__img', card) || $('.prod__media img', card));
      if (btn.hasAttribute('data-fly') || card?.classList.contains('prod')) fly(img || btn, img?.currentSrc || img?.src);
      // счётчик меняется, когда миниатюра «долетела»
      setTimeout(() => S.cart.add(id, qty), ON ? 620 : 0);
      btn.dataset.state = 'success';
      clearTimeout(t);
      t = setTimeout(() => { btn.dataset.state = 'idle'; }, 1600);
      const status = box && $('.buy__status', box);
      if (status) {
        const root = document.querySelector('.brand').getAttribute('href').replace('index.html', '');
        status.innerHTML = `Добавлено в&nbsp;корзину: ${qty}&nbsp;шт. <a href="${root}cart.html">Оформить заказ</a>`;
      }
    });
  });

  /* =========================================================
     Галерея товара
     ========================================================= */
  $$('[data-gallery]').forEach(gal => {
    const main = $('.gal__img', gal);
    // маленькие фото с сайта: не больше чем вдвое от натурального размера
    const cap = img => { const w = +img.getAttribute('width') || img.naturalWidth; if (w) img.style.setProperty('--iw', `${w * 2}px`); };
    cap(main);
    $$('.gal__thumb', gal).forEach(th => th.addEventListener('click', () => {
      if (th.classList.contains('is-current')) return;
      $$('.gal__thumb', gal).forEach(x => { x.classList.toggle('is-current', x === th); x.toggleAttribute('aria-current', x === th); });
      const swap = () => {
        main.src = th.dataset.src; main.alt = th.dataset.alt;
        main.setAttribute('width', th.dataset.w); main.setAttribute('height', th.dataset.h);
        cap(main);
      };
      if (ON) G.to(main, { opacity: 0, scale: 0.98, duration: 0.15, ease: 'power1.out', onComplete: () => { swap(); G.to(main, { opacity: 1, scale: 1, duration: 0.3, ease: EASE }); } });
      else swap();
    }));
  });

  /* =========================================================
     Документация: поиск, текущий раздел
     ========================================================= */
  const docInput = $('#doc-q');
  if (docInput) {
    $('.docs__search').hidden = false;
    const empty = $('.docs__empty');
    const groups = $$('[data-doc-group]');
    const norm = s => s.toLowerCase().replace(/ё/g, 'е');
    const idx = groups.map(g => ({
      g, title: norm($('.docgroup__title', g).textContent),
      items: $$('[data-doc-item]', g).map(li => ({ li, text: norm(li.textContent) })),
      subs: $$('.docsub', g),
    }));
    let timer = null;
    const run = () => {
      const q = norm(docInput.value.trim());
      const words = q.split(/\s+/).filter(Boolean);
      let shown = 0;
      idx.forEach(({ g, title, items, subs }) => {
        let n = 0;
        items.forEach(({ li, text }) => {
          const hit = !words.length || words.every(w => text.includes(w) || title.includes(w));
          li.hidden = !hit; if (hit) n++;
        });
        subs.forEach(s => { s.hidden = !!words.length; });
        g.hidden = n === 0; shown += n;
      });
      $$('.docsec').forEach(sec => { sec.hidden = !$$('[data-doc-group]:not([hidden])', sec).length; });
      empty.hidden = shown > 0;
    };
    docInput.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 120); });
    docInput.addEventListener('keydown', e => { if (e.key === 'Escape') { docInput.value = ''; run(); } });

    const tabs = $$('.docs__tab');
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) tabs.forEach(t => t.classList.toggle('is-current', t.getAttribute('href') === `#${e.target.id}`));
    }), { rootMargin: '-40% 0px -55% 0px' });
    $$('.docsec').forEach(s => io.observe(s));
  }

  /* =========================================================
     Прайс карт: перекрестье строки и столбца, выбор тиража на mobile
     ========================================================= */
  const ptable = $('.ptable');
  if (ptable) {
    const heads = $$('thead th', ptable).slice(1);
    const clear = () => { $$('.is-col, .is-cross', ptable).forEach(x => x.classList.remove('is-col', 'is-cross')); };
    ptable.addEventListener('pointerover', e => {
      const td = e.target.closest('td[data-col]');
      clear();
      if (!td) return;
      const k = td.dataset.col;
      $$(`td[data-col="${k}"]`, ptable).forEach(c => c.classList.add('is-col'));
      heads[+k]?.classList.add('is-col');
      td.classList.add('is-cross');
    });
    ptable.addEventListener('pointerleave', clear);
  }
  const tirage = $('[data-tirage]');
  if (tirage) {
    tirage.addEventListener('change', () => {
      $$('.plist__v').forEach(v => { v.hidden = v.dataset.col !== tirage.value; });
      if (ON) G.fromTo($$('.plist__v:not([hidden])'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: EASE });
    });
  }

  /* =========================================================
     Лайтбокс примеров дизайна карт
     ========================================================= */
  const lb = $('#lightbox');
  const galItems = $$('[data-lightbox] .gallery__item');
  if (lb && galItems.length && typeof lb.showModal === 'function') {
    const img = $('.lightbox__img', lb), cap = $('.lightbox__cap', lb);
    let cur = 0, opener = null;
    const show = i => {
      cur = (i + galItems.length) % galItems.length;
      const it = galItems[cur], src = $('img', it);
      img.src = it.dataset.src; img.alt = src.alt;
      img.width = +it.dataset.w; img.height = +it.dataset.h;
      cap.textContent = `${String(cur + 1).padStart(2, '0')} / ${galItems.length} · ${src.alt.replace('Пример дизайна карты: ', '')}`;
    };
    galItems.forEach((it, i) => it.addEventListener('click', () => { opener = it; show(i); lb.showModal(); }));
    $$('[data-lb]', lb).forEach(b => b.addEventListener('click', () => show(cur + +b.dataset.lb)));
    $('[data-lb-close]', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
    });
    lb.addEventListener('close', () => opener?.focus());
  }

  /* =========================================================
     Оглавление политик: подсветка текущего раздела
     ========================================================= */
  const toc = $$('.toc__link');
  if (toc.length) {
    const map = new Map(toc.map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      toc.forEach(a => a.classList.remove('is-current'));
      map.get(e.target.id)?.classList.add('is-current');
    }), { rootMargin: '-30% 0px -60% 0px' });
    $$('.policy__sec').forEach(s => io.observe(s));
  }

  /* =========================================================
     Анимации появления
     ========================================================= */
  if (!ON) return;

  // Шапка страницы: заголовок построчно, остальное каскадом
  const ph = $('.phead');
  if (ph) {
    const tl = G.timeline({ defaults: { ease: EASE } });
    tl.fromTo($('.crumbs', ph), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0)
      .add(lineReveal($('.phead__title', ph), { duration: 0.9 }), 0.05)
      .fromTo([$('.phead__lead', ph), $('.phead__facts', ph)].filter(Boolean), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.3)
      .fromTo($('.phead__ticks', ph), { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0);
    $$('.phead .odo').forEach(el => odometer(el, { immediate: true }));
    const icon = $('.phead__icon', ph);
    if (icon) tl.fromTo(icon, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }, 0.2);
  }

  // Товар: галерея и блок покупки
  const product = $('.product');
  if (product) {
    G.fromTo($('.gal', product), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: EASE, delay: 0.1 });
    const info = $('.product__info', product);
    G.fromTo(info.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: EASE, delay: 0.2 });
    lineReveal($('.product__title', product), { duration: 0.9 });
  }

  // Заголовки секций
  $$('main .h2').forEach(h => { if (!h.closest('.cta, .phead')) revealHeading(h); });

  // Карточки товаров, групп документации, примеров, людей
  const batch = (sel, opts = {}) => {
    const els = $$(sel);
    if (!els.length) return;
    G.set(els, { opacity: 0 });
    ST.batch(els, {
      start: 'top 90%', once: true,
      onEnter: b => G.fromTo(b, { opacity: 0, y: opts.y ?? 18, scale: opts.scale ?? 1 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.06, ease: EASE, clearProps: 'transform,opacity' }),
    });
  };
  batch('.prod');
  batch('.docgroup');
  batch('.gallery li', { y: 12, scale: 0.97 });
  batch('.person, .reach__cards > *, .where__links > li');
  batch('.req__list li', { y: 10 });
  $$('.catnav__link').forEach((l, i) => G.fromTo(l, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.5, delay: 0.15 + i * 0.035, ease: EASE, clearProps: 'transform,opacity' }));

  // Прайс: строки таблицы каскадом
  if (ptable) revealGroup($$('.ptable tbody tr'), { trigger: ptable, start: 'top 80%', y: 10, stagger: 0.05 });

  // Чертёж макета: линии дорисовываются
  const req = $('.req__svg');
  if (req) {
    const set = F.collectDraw([req]);
    const tl = G.timeline({ paused: true });
    F.drawInto(tl, set, 0, 1.1);
    ST.create({ trigger: req, start: 'top 80%', once: true, onEnter: () => tl.play() });
  }

  // О компании: линия направлений дорисовывается при появлении, узлы загораются по очереди
  const dirs = $('.dirs');
  if (dirs) {
    const line = document.createElement('span');
    line.className = 'dirs__line'; line.setAttribute('aria-hidden', 'true');
    dirs.prepend(line);
    const items = $$('.dir', dirs);
    ST.create({
      trigger: dirs, start: 'top 75%', once: true,
      onEnter: () => {
        G.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: 'power2.inOut', transformOrigin: '50% 0' });
        items.forEach((d, i) => G.delayedCall(0.15 + i * (1.4 / Math.max(1, items.length - 1)), () => d.classList.add('is-on')));
      },
    });
    revealGroup(items.map(d => $('.dir__body', d)), { trigger: dirs, start: 'top 80%', stagger: 0.1 });
    revealGroup([$('.about__lead'), $('.stages')].filter(Boolean), { start: 'top 85%' });
  }

  // Витрина каталога, CTA, схема офиса
  if ($('.bento--cat')) { F.inlineIcons(); F.bentoCards(); }
  F.ctaReveal();
  F.officeReveal();
})();
