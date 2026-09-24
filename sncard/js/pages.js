/* =========================================================
   СНК · sncard.ru — внутренние страницы.
   Функциональность работает всегда (в т.ч. без GSAP): галерея продукта,
   поиск по документации и ККТ, фильтр и «Показать ещё» в новостях,
   лайтбокс сертификатов, оглавление политик.
   Анимации — только если включены (SNCFX.ON).
   ========================================================= */
(() => {
  'use strict';
  const F = window.SNCFX;
  if (!F) return;
  const { $, $$, ON, G, ST, EASE, lineReveal, revealHeading, revealGroup } = F;
  const norm = s => s.toLowerCase().replace(/ё/g, 'е');

  /* Лента разделов на узком экране: текущий раздел — в видимой области */
  const catCur = $('.catnav__link.is-current');
  if (catCur) {
    const strip = catCur.closest('ul');
    if (strip.scrollWidth > strip.clientWidth) strip.scrollLeft = catCur.parentElement.offsetLeft - 16;
  }

  /* =========================================================
     Галерея продукта
     ========================================================= */
  const galMain = $('[data-gal-main] .gal__img');
  if (galMain) {
    const thumbs = $$('.gal__thumb');
    thumbs.forEach(th => th.addEventListener('click', () => {
      if (th.classList.contains('is-current')) return;
      thumbs.forEach(x => { x.classList.toggle('is-current', x === th); x.toggleAttribute('aria-current', x === th); });
      const img = $('img', th);
      const swap = () => {
        galMain.src = th.dataset.gal;
        galMain.setAttribute('width', img.getAttribute('width') || '');
        galMain.setAttribute('height', img.getAttribute('height') || '');
      };
      if (ON) G.to(galMain, { opacity: 0, scale: 0.98, duration: 0.15, ease: 'power1.out', onComplete: () => { swap(); G.to(galMain, { opacity: 1, scale: 1, duration: 0.3, ease: EASE }); } });
      else swap();
    }));
  }

  /* =========================================================
     Документация: поиск по названию, текущий раздел в табах
     ========================================================= */
  const docInput = $('[data-docs-search]');
  if (docInput) {
    const empty = $('.docs__empty');
    const groups = $$('.docgroup').map(g => ({
      g, title: norm($('.docgroup__title', g).textContent),
      items: $$('.docitem', g).map(li => ({ li, text: norm(li.textContent) })),
    }));
    let timer = null;
    const run = () => {
      const words = norm(docInput.value.trim()).split(/\s+/).filter(Boolean);
      let shown = 0;
      groups.forEach(({ g, title, items }) => {
        let n = 0;
        items.forEach(({ li, text }) => {
          const hit = !words.length || words.every(w => text.includes(w) || title.includes(w));
          li.hidden = !hit; if (hit) n++;
        });
        g.hidden = n === 0; shown += n;
      });
      empty.hidden = shown > 0;
    };
    docInput.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 120); });
    docInput.addEventListener('keydown', e => { if (e.key === 'Escape') { docInput.value = ''; run(); } });
  }

  /* =========================================================
     ККТ: поиск по модели, подсветка текущего раздела
     ========================================================= */
  const kktInput = $('[data-kkt-search]');
  if (kktInput) {
    const rows = $$('[data-kkt-row]').map(tr => ({ tr, text: norm(tr.textContent) }));
    let timer = null;
    const run = () => {
      const words = norm(kktInput.value.trim()).split(/\s+/).filter(Boolean);
      rows.forEach(({ tr, text }) => { tr.hidden = words.length ? !words.every(w => text.includes(w)) : false; });
      $$('.kkt .docsec').forEach(sec => {
        const n = $$('[data-kkt-row]:not([hidden])', sec).length;
        const count = $('.docsec__count', sec);
        if (count && $('[data-kkt-row]', sec)) count.textContent = words.length ? `найдено: ${n}` : count.dataset.full || count.textContent;
      });
    };
    $$('.kkt .docsec__count').forEach(c => { c.dataset.full = c.textContent; });
    kktInput.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 120); });
    kktInput.addEventListener('keydown', e => { if (e.key === 'Escape') { kktInput.value = ''; run(); } });
  }

  /* Текущий раздел в табах-якорях (документация, ККТ, партнёры) */
  const anchorTabs = $$('.docs__tab[href^="#"]');
  if (anchorTabs.length) {
    const secs = $$('.docsec[id]');
    // текущий — последний раздел, начавшийся выше середины экрана
    const sync = () => {
      const line = window.innerHeight * 0.4;
      let cur = secs[0];
      for (const sec of secs) { if (sec.getBoundingClientRect().top <= line) cur = sec; }
      anchorTabs.forEach(t => t.classList.toggle('is-current', t.getAttribute('href') === `#${cur?.id}`));
    };
    let ticking = false;
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; sync(); }); } }, { passive: true });
    sync();
  }

  /* =========================================================
     Новости: фильтр по тегу и «Показать ещё»
     ========================================================= */
  const newsBox = $('[data-news-items]');
  if (newsBox) {
    const cards = $$('.nblock', newsBox);
    const more = $('[data-news-more]');
    const empty = $('.nlist__empty');
    // Блоки одной высоты: длинный текст прокручивается внутри. Такие блоки отмечаем
    // (градиент снизу, пока текст не дочитан) и даём им фокус с клавиатуры
    const scrollState = body => {
      const can = body.scrollHeight > body.clientHeight + 1;
      body.classList.toggle('is-scroll', can);
      body.classList.toggle('is-end', can && body.scrollTop + body.clientHeight >= body.scrollHeight - 2);
      if (can && !body.hasAttribute('tabindex')) {
        body.tabIndex = 0;
        body.setAttribute('role', 'region');
        body.setAttribute('aria-label', `Текст новости: ${body.closest('.nblock').querySelector('.nblock__title').textContent}`);
      }
    };
    const bodies = cards.map(el => el.querySelector('.nblock__body'));
    bodies.forEach(b => b.addEventListener('scroll', () => scrollState(b), { passive: true }));
    const syncBodies = () => bodies.forEach(b => { if (!b.closest('.nblock').hidden) scrollState(b); });
    window.addEventListener('resize', syncBodies);
    document.fonts?.ready.then(syncBodies);

    const STEP = 12;
    let tag = 'all', shown = STEP;
    const render = ({ animate = false } = {}) => {
      let n = 0, appeared = [];
      cards.forEach(c => {
        const match = tag === 'all' || c.dataset.tag === tag;
        const visible = match && n < shown;
        if (match) n++;
        if (visible && c.hidden && animate) appeared.push(c);
        c.hidden = !visible;
      });
      more.hidden = n <= shown;
      more.textContent = `Показать ещё ${Math.min(STEP, n - shown)}`;
      empty.hidden = n > 0;
      syncBodies();
      if (ON && appeared.length) G.fromTo(appeared, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: EASE, clearProps: 'transform,opacity' });
    };
    more.addEventListener('click', () => { shown += STEP; render({ animate: true }); });
    $$('[data-news-tag]').forEach(btn => btn.addEventListener('click', () => {
      tag = btn.dataset.newsTag; shown = STEP;
      $$('[data-news-tag]').forEach(b => { const on = b === btn; b.classList.toggle('is-current', on); b.setAttribute('aria-pressed', String(on)); });
      render({ animate: true });
      newsBox.scrollIntoView({ block: 'nearest', behavior: ON ? 'smooth' : 'auto' });
    }));
    render();

    /* Новость по ссылке news.html#slug: показываем (даже если скрыта «Показать ещё») и отмечаем рамкой */
    const markTarget = () => {
      const el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!el || !el.classList.contains('nblock')) return;
      if (el.hidden) {
        tag = 'all'; shown = Math.max(STEP, cards.indexOf(el) + 1);
        $$('[data-news-tag]').forEach(b => { const on = b.dataset.newsTag === 'all'; b.classList.toggle('is-current', on); b.setAttribute('aria-pressed', String(on)); });
        render();
      }
      cards.forEach(c => c.classList.remove('is-target'));
      el.classList.add('is-target');
      el.scrollIntoView({ block: 'start' });
    };
    markTarget();
    window.addEventListener('hashchange', markTarget);
  }

  /* =========================================================
     Лайтбокс сертификатов
     ========================================================= */
  const lb = $('#lightbox');
  const galItems = $$('[data-lightbox] button.gallery__item'); // карточки без картинки не кликабельны
  if (lb && galItems.length && typeof lb.showModal === 'function') {
    const img = $('.lightbox__img', lb), cap = $('.lightbox__cap', lb);
    let cur = 0, opener = null;
    const show = i => {
      cur = (i + galItems.length) % galItems.length;
      const it = galItems[cur];
      const title = $('.gallery__cap', it)?.textContent.trim() || '';
      img.src = it.dataset.src; img.alt = title;
      img.removeAttribute('width'); img.removeAttribute('height');
      cap.textContent = `${String(cur + 1).padStart(2, '0')} / ${galItems.length} · ${title}`;
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
  }

  // Продукт: галерея и блок «Запросить»
  const product = $('.product');
  if (product) {
    G.fromTo($('.gal', product), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: EASE, delay: 0.1 });
    G.fromTo($('.product__info', product).children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: EASE, delay: 0.2 });
    lineReveal($('.product__title', product), { duration: 0.9 });
  }

  // Статья: заголовок построчно
  const art = $('.article__title');
  if (art) {
    const tl = G.timeline({ defaults: { ease: EASE } });
    tl.fromTo($('.crumbs'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0)
      .fromTo($('.article__meta'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1)
      .add(lineReveal(art, { duration: 0.9 }), 0.15)
      .fromTo($('.article__body'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.35);
  }

  // Заголовки секций
  $$('main .h2').forEach(h => { if (!h.closest('.cta, .phead')) revealHeading(h); });

  // Карточки каскадом
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
  batch('.pcard', { y: 14 });
  batch('.gallery--certs li', { y: 12, scale: 0.97 });
  batch('.ncard--row:not([hidden])', { y: 14 });
  batch('.depts .dept');
  batch('.lic li', { y: 8 });
  $$('.catnav__link').forEach((l, i) => G.fromTo(l, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.5, delay: 0.15 + i * 0.035, ease: EASE, clearProps: 'transform,opacity' }));

  // Таблицы ККТ: строки каскадом
  $$('.ptable').forEach(t => revealGroup($$('tbody tr', t).slice(0, 20), { trigger: t, start: 'top 80%', y: 10, stagger: 0.04 }));

  // Карточки разделов ПО и схема офиса
  if ($('.bento--cat')) { F.inlineIcons(); F.tileCards(); }
  F.officeReveal();
})();
