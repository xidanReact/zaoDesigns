/* =========================================================
   СНК · sncard.ru — общий слой для всех страниц.
   Шапка (сжатие, прогресс чтения), выпадающие меню с клавиатурой,
   мобильное меню, копирование контактов, форма рассылки,
   уведомление «Запросить» в каталоге ПО.
   Логика перенесена из ../designs/main.js и ../snc-service/js/site.js
   в том же стиле; корзины на этом сайте нет.
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
    if (open) mmenu.style.setProperty('--mmenu-top', `${header.getBoundingClientRect().bottom}px`);
    mmenu.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.dispatchEvent(new CustomEvent('snc:menu', { detail: { open } }));
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
     не работают (рассылка, «Запросить» в каталоге ПО)
     ========================================================= */
  const toast = Object.assign(document.createElement('div'), { className: 'toast' });
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = '<p class="toast__text"></p><button class="toast__close" type="button" aria-label="Закрыть уведомление"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
  document.body.append(toast);
  let toastTimer = null;
  const hideToast = () => { clearTimeout(toastTimer); toast.classList.remove('is-visible'); };
  const showToast = text => {
    $('.toast__text', toast).textContent = text;
    toast.classList.remove('is-visible'); void toast.offsetWidth; // повторный клик — анимация заново
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 6000);
  };
  $('.toast__close', toast).addEventListener('click', hideToast);
  toast.addEventListener('pointerenter', () => clearTimeout(toastTimer));
  toast.addEventListener('pointerleave', () => { toastTimer = setTimeout(hideToast, 3000); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideToast(); });

  /* =========================================================
     Рассылка: проверка полей → уведомление о недоступности (бэкенда нет)
     ========================================================= */
  const form = $('#subscribe');
  if (form) {
    const field = $('.field', form);
    const input = $('#sub-email', form);
    const err = $('#sub-email-err', form);
    const check = $('.check', form);
    const agree = $('input[name="agree"]', form);
    const btn = $('.btn--submit', form);
    const status = $('.subscribe__status', form);

    const shake = el => { el.classList.remove('is-shake'); void el.offsetWidth; el.classList.add('is-shake'); };
    const clearErr = () => { field.classList.remove('is-invalid'); check.classList.remove('is-invalid'); err.textContent = ''; input.removeAttribute('aria-invalid'); };

    input.addEventListener('input', () => { if (field.classList.contains('is-invalid')) clearErr(); });
    agree.addEventListener('change', () => check.classList.remove('is-invalid'));

    // «Подписаться» доступна, только когда введён адрес и отмечено согласие
    const syncBtn = () => { if (btn.dataset.state === 'idle') btn.disabled = !(input.value.trim() && agree.checked); };
    input.addEventListener('input', syncBtn);
    agree.addEventListener('change', syncBtn);
    syncBtn();

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
      // TODO: подключить отправку в сервис рассылки; пока сообщаем, что функция недоступна
      showToast('Подписка на рассылку временно недоступна. Следите за новостями компании в разделе «Новости».');
    });

    form.addEventListener('reset', () => {
      clearErr();
      btn.dataset.state = 'idle';
      status.textContent = '';
      hideToast();
      setTimeout(syncBtn); // поля очищаются после события reset
    });
  }
})();
