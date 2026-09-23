/* =========================================================
   СНК · sncard.ru — общий слой для всех страниц.
   Шапка (сжатие, прогресс чтения), выпадающие меню с клавиатурой,
   мобильное меню, копирование контактов, форма рассылки.
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
    document.body.style.overflow = open ? 'hidden' : '';
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
     Рассылка: idle → loading → success (имитация без бэкенда)
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
      // TODO: подключить отправку в сервис рассылки
      timer = setTimeout(() => {
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
})();
