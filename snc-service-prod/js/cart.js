/* =========================================================
   СНК · snc-service — корзина и оформление заказа.
   Корзина → Реквизиты → Подтверждение (+ экран успеха) на одной странице.
   Шаг отражён в хэше (#details, #confirm), назад — без потери данных.
   Данные: SNC.cart (localStorage, js/site.js) + window.SNC_CATALOG.
   Отправка заказа имитируется. TODO: подключить отправку на сервер.
   ========================================================= */
(() => {
  'use strict';
  const S = window.SNC, F = window.SNCFX, CAT = window.SNC_CATALOG;
  if (!S || !F || !CAT) return;
  const { $, $$, ON, G, EASE } = F;
  const root = $('[data-checkout]');
  if (!root) return;
  root.hidden = false;

  const byId = new Map(CAT.products.map(p => [p.id, p]));
  const rub = n => `${Math.round(n).toLocaleString('ru-RU')} ₽`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const STEPS = ['cart', 'details', 'confirm'];
  const DRAFT = 'snc-order-draft';

  const list = $('[data-citems]'), empty = $('[data-cempty]'), undoBox = $('[data-undo]');
  const sumCount = $('[data-sum-count]'), sumTotal = $('[data-sum-total]');
  const next = $('[data-next]'), nextLabel = $('[data-next-label]'), back = $('[data-back]'), cont = $('[data-continue]');
  const status = $('.summary__status');
  const form = $('#cform');
  const bar = $('.stepper__bar span');
  let step = 'cart';

  const items = () => S.cart.items().filter(i => byId.has(i.id));
  const totals = its => its.reduce((a, i) => ({ n: a.n + i.qty, s: a.s + i.qty * byId.get(i.id).price }), { n: 0, s: 0 });

  /* ---------- Итог: числа «доезжают» до нового значения ---------- */
  const shown = { n: 0, s: 0 };
  function renderTotals() {
    const t = totals(items());
    const put = () => { sumCount.textContent = Math.round(shown.n); sumTotal.textContent = rub(shown.s); };
    if (ON) G.to(shown, { n: t.n, s: t.s, duration: 0.6, ease: EASE, onUpdate: put, overwrite: true });
    else { shown.n = t.n; shown.s = t.s; put(); }
    if (step === 'cart') next.disabled = t.n === 0;
  }

  /* ---------- Шаг 1: список ---------- */
  function rowHTML(i) {
    const p = byId.get(i.id);
    const img = p.images[0];
    const url = `equipment/${p.category}/${p.slug}.html`;
    return `<li class="citem" data-id="${p.id}">
      <a class="citem__img" href="${url}" tabindex="-1" aria-hidden="true">${img ? `<img src="${img.src}" alt="" loading="lazy">` : ''}</a>
      <div class="citem__name"><a href="${url}">${esc(p.name)}</a><span class="citem__unit mono">${rub(p.price)} за шт.</span></div>
      <div class="qty qty--sm" data-cqty>
        <button class="qty__btn" type="button" data-cstep="-1" aria-label="Уменьшить количество: ${esc(p.name)}">−</button>
        <input class="qty__input mono" type="number" inputmode="numeric" min="1" max="999" value="${i.qty}" aria-label="Количество: ${esc(p.name)}">
        <button class="qty__btn" type="button" data-cstep="1" aria-label="Увеличить количество: ${esc(p.name)}">+</button>
      </div>
      <span class="citem__sum mono">${rub(p.price * i.qty)}</span>
      <button class="citem__del" type="button" data-del aria-label="Удалить: ${esc(p.name)}"><svg aria-hidden="true"><use href="#i-trash"/></svg></button>
    </li>`;
  }
  function renderList() {
    const its = items();
    list.innerHTML = its.map(rowHTML).join('');
    empty.hidden = its.length > 0;
    renderTotals();
  }
  function setQty(id, qty) {
    const its = S.cart.items();
    const it = its.find(x => x.id === id);
    if (!it) return;
    it.qty = Math.min(999, Math.max(1, Math.round(qty) || 1));
    S.cart.save(its);
    const row = list.querySelector(`[data-id="${id}"]`);
    if (row) {
      $('.qty__input', row).value = it.qty;
      $('.citem__sum', row).textContent = rub(byId.get(id).price * it.qty);
    }
    renderTotals();
  }
  list.addEventListener('click', e => {
    const row = e.target.closest('.citem');
    if (!row) return;
    const id = +row.dataset.id;
    const stepBtn = e.target.closest('[data-cstep]');
    if (stepBtn) setQty(id, +$('.qty__input', row).value + +stepBtn.dataset.cstep);
    if (e.target.closest('[data-del]')) remove(row, id);
  });
  list.addEventListener('change', e => {
    if (!e.target.matches('.qty__input')) return;
    setQty(+e.target.closest('.citem').dataset.id, +e.target.value);
  });

  /* ---------- Удаление со «схлопыванием» и отменой (5 с) ---------- */
  let undo = null;
  function remove(row, id) {
    const its = S.cart.items();
    const idx = its.findIndex(x => x.id === id);
    if (idx < 0) return;
    const [gone] = its.splice(idx, 1);
    clearTimeout(undo?.t);
    undo = { item: gone, idx, t: setTimeout(hideUndo, 5000) };
    S.cart.save(its);
    $('.undo__text', undoBox).textContent = `Удалено: ${byId.get(id).name}`;
    undoBox.hidden = false;
    const done = () => { row.remove(); empty.hidden = items().length > 0; renderTotals(); };
    if (ON) {
      G.to(row, { opacity: 0, x: -12, duration: 0.18, ease: 'power1.out' });
      G.to(row, { height: 0, paddingTop: 0, paddingBottom: 0, duration: 0.3, delay: 0.14, ease: 'power2.inOut', onComplete: done });
    } else done();
  }
  function hideUndo() { undoBox.hidden = true; undo = null; }
  $('[data-undo-btn]').addEventListener('click', () => {
    if (!undo) return;
    const its = S.cart.items();
    its.splice(Math.min(undo.idx, its.length), 0, undo.item);
    clearTimeout(undo.t);
    S.cart.save(its);
    hideUndo();
    renderList();
    const row = list.querySelector(`[data-id="${its[Math.min(undo?.idx ?? 0, its.length - 1)]?.id}"]`);
    if (ON && row) G.from(row, { opacity: 0, y: -8, duration: 0.4, ease: EASE });
  });

  /* ---------- Шаг 2: реквизиты, проверка при уходе с поля ---------- */
  const rules = {
    name: v => v.trim() ? '' : 'Введите имя',
    last: v => v.trim() ? '' : 'Введите фамилию',
    email: v => !v.trim() ? 'Введите адрес электронной почты'
      : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Проверьте адрес: нужны «@» и домен, например name@company.ru',
    phone: v => !v.trim() ? 'Введите телефон'
      : v.replace(/\D/g, '').length >= 10 ? '' : 'В номере должно быть не меньше 10 цифр, например +7 (3822) 65-11-45',
  };
  const shake = el => { el.classList.remove('is-shake'); void el.offsetWidth; el.classList.add('is-shake'); };
  function check(input, withShake = false) {
    const rule = rules[input.name];
    if (!rule) return true;
    const msg = rule(input.value);
    const field = input.closest('.field');
    field.classList.toggle('is-invalid', !!msg);
    $('.field__err', field).textContent = msg;
    if (msg) { input.setAttribute('aria-invalid', 'true'); if (withShake) shake(field); }
    else input.removeAttribute('aria-invalid');
    return !msg;
  }
  const agree = $('input[name="agree"]', form), agreeBox = $('[data-agree]'), agreeErr = $('#f-agree-err');
  function checkAgree(withShake = false) {
    const ok = agree.checked;
    agreeBox.classList.toggle('is-invalid', !ok);
    agreeErr.textContent = ok ? '' : 'Отметьте согласие, чтобы отправить заказ';
    if (!ok && withShake) shake(agreeBox);
    return ok;
  }
  $$('.field__input', form).forEach(inp => {
    inp.addEventListener('blur', () => { if (inp.value || inp.closest('.field').classList.contains('is-invalid')) check(inp); });
    inp.addEventListener('input', () => { if (inp.closest('.field').classList.contains('is-invalid')) check(inp); saveDraft(); });
  });
  agree.addEventListener('change', () => { if (agreeBox.classList.contains('is-invalid')) checkAgree(); saveDraft(); });
  function validateAll() {
    let first = null;
    $$('.field__input', form).forEach(inp => { if (!check(inp, true) && !first) first = inp; });
    const ok = checkAgree(!first);
    if (first) { first.focus(); return false; }
    if (!ok) { agree.focus(); return false; }
    return true;
  }
  const formData = () => Object.fromEntries(new FormData(form));
  function saveDraft() { const d = formData(); d.agree = agree.checked; S.store.set(DRAFT, d); }
  (() => {
    const d = S.store.get(DRAFT, null);
    if (!d) return;
    Object.entries(d).forEach(([k, v]) => { const el = form.elements[k]; if (el && el.type !== 'checkbox') el.value = v; });
    agree.checked = !!d.agree;
  })();

  /* ---------- Шаг 3: сводка ---------- */
  function renderReview() {
    $('[data-review-items]').innerHTML = items().map(i => {
      const p = byId.get(i.id);
      return `<li><span>${esc(p.name)}</span><span class="mono">${i.qty} × ${rub(p.price)} = ${rub(i.qty * p.price)}</span></li>`;
    }).join('');
    const d = formData();
    const rows = [
      ['ФИО', [d.last, d.name, d.middle].filter(Boolean).join(' ')],
      ['E-mail', d.email], ['Телефон', d.phone],
      ...(d.comment?.trim() ? [['Комментарий', d.comment.trim()]] : []),
    ];
    $('[data-review-person]').innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
  }

  /* ---------- Переходы между шагами ---------- */
  const panes = Object.fromEntries($$('[data-pane]').map(p => [p.dataset.pane, p]));
  const tabs = $$('[data-step-tab]');
  function go(to, { push = true, focus = true } = {}) {
    if (to !== 'cart' && to !== 'done' && !items().length) to = 'cart'; // экран успеха — уже с пустой корзиной
    if (to === 'confirm' && !(form.checkValidity() && agree.checked)) to = 'details';
    const from = step;
    step = to;
    const i = STEPS.indexOf(to);
    tabs.forEach((t, k) => {
      t.classList.toggle('is-current', k === i);
      t.classList.toggle('is-done', k < i || to === 'done');
      t.setAttribute('aria-current', k === i ? 'step' : 'false');
    });
    bar.style.transform = `scaleX(${to === 'done' ? 1 : (i + 1) / 3})`;
    Object.entries(panes).forEach(([k, p]) => { p.hidden = k !== to; });
    $('.summary').hidden = to === 'done';
    root.classList.toggle('is-done', to === 'done');
    if (to === 'confirm') renderReview();
    next.hidden = to === 'done';
    back.hidden = !(to === 'details' || to === 'confirm');
    cont.hidden = to !== 'cart';
    next.disabled = to === 'cart' && !items().length;
    nextLabel.textContent = { cart: 'Оформить заказ', details: 'Продолжить', confirm: 'Подтвердить заказ' }[to] || '';
    status.textContent = '';
    if (push && to !== 'done') history.replaceState(null, '', to === 'cart' ? location.pathname : `#${to}`);
    if (ON && from !== to) G.fromTo(panes[to], { opacity: 0, x: STEPS.indexOf(to) >= STEPS.indexOf(from) ? 16 : -16 }, { opacity: 1, x: 0, duration: 0.45, ease: EASE, clearProps: 'transform,opacity' });
    if (focus && from !== to) {
      const h = $('.pane__title', panes[to]);
      h.tabIndex = -1; h.focus({ preventScroll: true });
      const top = root.getBoundingClientRect().top + scrollY - 100;
      if (scrollY > top) window.scrollTo({ top, behavior: ON ? 'smooth' : 'auto' });
    }
  }
  $$('[data-goto]').forEach(b => b.addEventListener('click', () => go(b.dataset.goto)));
  back.addEventListener('click', () => go(STEPS[Math.max(0, STEPS.indexOf(step) - 1)]));
  form.addEventListener('submit', e => { e.preventDefault(); next.click(); });

  next.addEventListener('click', () => {
    if (next.dataset.state !== 'idle') return;
    if (step === 'cart') {
      if (!items().length) { status.textContent = 'Корзина пуста — добавьте оборудование из каталога'; return; }
      go('details');
    } else if (step === 'details') {
      if (validateAll()) go('confirm');
      else status.textContent = 'Проверьте отмеченные поля';
    } else if (step === 'confirm') {
      submit();
    }
  });

  function submit() {
    next.dataset.state = 'loading';
    const d = formData();
    // TODO: подключить отправку заказа (состав + реквизиты) на сервер
    setTimeout(() => {
      next.dataset.state = 'success';
      const num = `СНК-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 900) + 100)}`;
      setTimeout(() => {
        $('[data-order-num]').textContent = `Номер заявки ${num}`;
        $('[data-done-text]').textContent = `Мы свяжемся с вами по телефону ${d.phone} или напишем на ${d.email}, чтобы подтвердить заказ и выставить счёт.`;
        S.cart.save([]);
        S.store.set(DRAFT, null);
        go('done', { push: false });
        history.replaceState(null, '', location.pathname);
        next.dataset.state = 'idle';
        if (ON) {
          const ring = $('.done__ring'), chk = $('.done__check');
          const L = chk.getTotalLength() + 1, R = ring.getTotalLength() + 1;
          G.fromTo(ring, { strokeDasharray: R, strokeDashoffset: R }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' });
          G.fromTo(chk, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.45, delay: 0.5, ease: 'power2.out' });
        }
        renderTotals();
      }, 700);
    }, 1200);
  }

  /* ---------- Синхронизация с другими вкладками ---------- */
  window.addEventListener('storage', e => {
    if (e.key !== 'snc-cart') return;
    renderList();
    if (step !== 'cart' && step !== 'done' && !items().length) go('cart');
  });
  window.addEventListener('hashchange', () => go(location.hash.slice(1) || 'cart', { push: false }));

  renderList();
  go(STEPS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'cart', { push: false, focus: false });
})();
