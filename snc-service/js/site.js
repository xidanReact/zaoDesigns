/* =========================================================
   СНК · snc-service — общий слой для всех страниц.
   Шапка (сжатие, прогресс чтения), выпадающие меню с клавиатурой,
   мобильное меню, копирование контактов, счётчик корзины,
   уведомление в левом нижнем углу.
   Логика меню перенесена из ../designs/main.js в том же стиле.
   Анимации страниц — в отдельных файлах (этап 3).
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const mq = q => window.matchMedia(q).matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const FINE = mq('(hover: hover) and (pointer: fine)');

  /* ---------- Cookie-баннер: одинаковый на трёх сайтах группы, стили — designs/styles.css ----------
     Выбор хранится в localStorage «snc-cookie-consent»: { v: 'all' | 'necessary', t: дата }.
     Аналитику подключать только при window.SNC_COOKIES.analytics === true
     (или по событию «snc:cookie-consent» на document). */
  (() => {
    const KEY = 'snc-cookie-consent';
    const apply = v => {
      window.SNC_COOKIES = { choice: v, analytics: v === 'all' };
      document.dispatchEvent(new CustomEvent('snc:cookie-consent', { detail: window.SNC_COOKIES }));
    };
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* storage недоступен */ }
    if (saved && (saved.v === 'all' || saved.v === 'necessary')) { apply(saved.v); return; }
    window.SNC_COOKIES = { choice: null, analytics: false };

    // ссылка на политику — из футера: у вложенных страниц свой относительный путь
    const policy = document.querySelector('a[href$="cookies.html"]')?.getAttribute('href') || 'cookies.html';
    const box = document.createElement('section');
    box.className = 'cookie';
    box.setAttribute('aria-label', 'Уведомление об использовании cookies');
    box.innerHTML = `
      <p class="cookie__text">Сайт использует cookies. Обязательные нужны для работы сайта, аналитические — только с&nbsp;вашего согласия. Подробнее — в&nbsp;<a href="${policy}">Политике использования Cookies</a>.</p>
      <div class="cookie__actions">
        <button class="btn btn--primary" type="button" data-cookie="all">Принять</button>
        <button class="btn btn--outline" type="button" data-cookie="necessary">Только обязательные</button>
      </div>`;
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-cookie]');
      if (!b) return;
      try { localStorage.setItem(KEY, JSON.stringify({ v: b.dataset.cookie, t: new Date().toISOString() })); } catch (e2) { /* выбор действует до перезагрузки */ }
      apply(b.dataset.cookie);
      box.classList.remove('is-visible');
      setTimeout(() => box.remove(), 400);
    });
    document.body.append(box);
    requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('is-visible')));
  })();

  /* ---------- Хранилище: localStorage может быть недоступен ---------- */
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch { return false; }
    },
  };

  /* =========================================================
     Кнопка «Наверх»: появляется, когда страница прокручена
     примерно на экран. Плавный скролл к #top — в motion.js (Lenis)
     ========================================================= */
  const toTop = Object.assign(document.createElement('a'), { className: 'totop', href: '#top', tabIndex: -1 });
  toTop.setAttribute('aria-label', 'Наверх страницы');
  toTop.setAttribute('aria-hidden', 'true');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  document.body.append(toTop);
  let toTopOn = false;
  const toggleToTop = y => {
    const on = y > window.innerHeight * 0.9;
    if (on === toTopOn) return;
    toTopOn = on;
    toTop.classList.toggle('is-visible', on);
    toTop.tabIndex = on ? 0 : -1;
    toTop.setAttribute('aria-hidden', String(!on));
  };

  /* =========================================================
     Шапка: сжатие и прогресс чтения
     ========================================================= */
  const header = $('#header');
  const progress = $('.header__progress span');
  let compact = false, lastP = -1, ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    const c = y > 40;
    if (c !== compact) { compact = c; header.classList.toggle('is-compact', c); }
    toggleToTop(y);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? clamp(y / max, 0, 1) : 0;
    if (Math.abs(p - lastP) > 0.0005) { lastP = p; progress.style.transform = `scaleX(${p})`; }
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* =========================================================
     Выпадающие меню
     ========================================================= */
  const nav = $('#nav');
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
    const mega = !!$('.dd--mega', item);
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
      if (e.key === 'Escape') { e.preventDefault(); ddClose(item, true); return; }
      if (idx < 0) return;
      // В мега-меню две колонки: ←/→ — соседняя колонка, ↑/↓ — по списку
      const step = mega && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') ? (e.key === 'ArrowRight' ? 1 : -1) : 0;
      if (step) { e.preventDefault(); links[clamp(idx + step, 0, links.length - 1)].focus(); }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const j = idx + (mega ? 2 : 1);
        links[j < links.length ? j : (idx === links.length - 1 ? 0 : links.length - 1)].focus();
      }
      else if (e.key === 'ArrowUp') { e.preventDefault(); const j = idx - (mega ? 2 : 1); j < 0 ? trigger.focus() : links[j].focus(); }
      else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); links[e.key === 'Home' ? 0 : links.length - 1].focus(); }
    });
    item.addEventListener('focusout', e => { if (!item.contains(e.relatedTarget)) ddClose(item); });
  });
  document.addEventListener('click', e => ddItems.forEach(i => { if (!i.contains(e.target)) ddClose(i); }));

  /* =========================================================
     Мобильное меню
     ========================================================= */
  const burger = $('.burger');
  const mmenu = $('#mobile-menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    if (open) {
      mmenu.style.setProperty('--mmenu-top', `${header.getBoundingClientRect().bottom}px`);
      mmenu.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      document.dispatchEvent(new CustomEvent('snc:menu', { detail: { open } }));
    } else {
      mmenu.hidden = true;
      document.documentElement.style.overflow = '';
      document.dispatchEvent(new CustomEvent('snc:menu', { detail: { open } }));
    }
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  mmenu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* =========================================================
     Копирование телефона и почты
     ========================================================= */
  $$('[data-copy]').forEach(btn => {
    let t = null;
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; }
      catch {
        const ta = Object.assign(document.createElement('textarea'), { value: text });
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.append(ta); ta.select();
        try { ok = document.execCommand('copy'); } catch { ok = false; }
        ta.remove();
      }
      if (!ok) return;
      const label = btn.getAttribute('aria-label');
      btn.classList.add('is-done');
      btn.setAttribute('aria-label', 'Скопировано');
      clearTimeout(t);
      t = setTimeout(() => { btn.classList.remove('is-done'); btn.setAttribute('aria-label', label); }, 1600);
    });
  });

  /* =========================================================
     Уведомление в левом нижнем углу: функции, которые пока
     не работают (добавление в корзину). Справа внизу — .totop
     ========================================================= */
  const toastEl = Object.assign(document.createElement('div'), { className: 'toast' });
  toastEl.setAttribute('role', 'status');
  toastEl.setAttribute('aria-live', 'polite');
  toastEl.innerHTML = '<p class="toast__text"></p><button class="toast__close" type="button" aria-label="Закрыть уведомление"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
  document.body.append(toastEl);
  let toastTimer = null;
  const hideToast = () => { clearTimeout(toastTimer); toastEl.classList.remove('is-visible'); };
  const toast = text => {
    $('.toast__text', toastEl).textContent = text;
    toastEl.classList.remove('is-visible'); void toastEl.offsetWidth; // повторный клик — анимация заново
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 6000);
  };
  $('.toast__close', toastEl).addEventListener('click', hideToast);
  toastEl.addEventListener('pointerenter', () => clearTimeout(toastTimer));
  toastEl.addEventListener('pointerleave', () => { toastTimer = setTimeout(hideToast, 3000); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideToast(); });

  /* =========================================================
     Корзина: счётчик в шапке, синхронизация между вкладками
     Формат в localStorage: snc-cart = [{ id, qty }]
     ========================================================= */
  const CART_KEY = 'snc-cart';
  const cart = {
    items: () => store.get(CART_KEY, []).filter(i => i && i.id && i.qty > 0),
    save(items) { store.set(CART_KEY, items); render(); document.dispatchEvent(new CustomEvent('snc:cart', { detail: { items } })); },
    count() { return this.items().reduce((s, i) => s + i.qty, 0); },
    add(id, qty = 1) {
      const items = this.items();
      const it = items.find(i => i.id === id);
      if (it) it.qty += qty; else items.push({ id, qty });
      this.save(items);
    },
  };
  function render() {
    const n = cart.count();
    $$('[data-cart-count]').forEach(b => { b.textContent = n; b.hidden = n === 0; });
    $$('[data-cart-link]').forEach(a => a.setAttribute('aria-label', n ? `Корзина, товаров: ${n}` : 'Корзина'));
  }
  window.addEventListener('storage', e => { if (e.key === CART_KEY) render(); });
  render();

  window.SNC = Object.assign(window.SNC || {}, { store, cart, toast });
})();
