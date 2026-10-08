/* =========================================================
   СНК · Управление продуктами — документ ТМЦ (шаблон «Документ»).
   ?doc=<id> — открыть, ?doc=new&kind=orders — новый черновик.
   Черновик редактируется, проведённый — только просмотр
   (правка после отмены проведения). TODO: API и проведение на сервере.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = window.SNC_DEMO, SNC = window.SNC;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => Number(n).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const KIND = { orders: ['Поставка ТМЦ', 'orders.html', 'Поставки ТМЦ'], movements: ['Перемещение ТМЦ', 'movements.html', 'Перемещение ТМЦ'], 'write-offs': ['Списание ТМЦ', 'write-offs.html', 'Списание ТМЦ'], postings: ['Оприходование ТМЦ', 'postings.html', 'Оприходование ТМЦ'], 'price-lists': ['Прайс-лист', 'price-lists.html', 'Прайс-листы'] };
  const q = new URLSearchParams(location.search);
  const isNew = q.get('doc') === 'new';
  let doc = isNew
    ? { kind: KIND[q.get('kind')] ? q.get('kind') : 'orders', number: 'новый', date: D.today, point: `${D.stations[0].name} · ${D.stations[0].city}`, pointTo: '', contractor: '', reason: '', author: 'Петров И. С.', state: 'Черновик', st: 'off', lines: [] }
    : (D.docs.find(d => d.id === Number(q.get('doc'))) || D.docs[0]);
  doc = JSON.parse(JSON.stringify(doc));
  const [kindName, listPage, listTitle] = KIND[doc.kind];

  // крошки и подсветка меню — от своего журнала, а не от «Поставок»
  const crumbs = $('.crumbs');
  if (crumbs) { const links = $$('a', crumbs); const parent = links[links.length - 1]; if (parent) { parent.href = listPage; parent.textContent = listTitle; } }
  $$('.sb__link[aria-current="true"]').forEach(a => a.removeAttribute('aria-current'));
  $(`.sb__link[href$="${listPage}"]`)?.setAttribute('aria-current', 'true');

  const tbody = $('#doc-lines tbody');
  const draft = () => doc.state === 'Черновик';

  /* ---------- Шапка ---------- */
  const head = () => {
    const title = `${kindName} ${isNew ? '(новый)' : `№ ${doc.number}`}`;
    $('[data-f="title"]').textContent = title;
    document.title = `${title} · Управление продуктами СНК`;
    $('.crumbs [aria-current]') && ($('.crumbs [aria-current]').textContent = isNew ? 'Новый документ' : doc.number);
    $('[data-f="date"]').innerHTML = `<span class="mono">${doc.date}</span> · ${esc(doc.author)}`;
    $('[data-f="state"]').innerHTML = `<span class="st st--${draft() ? 'off' : 'ok'}">${doc.state}</span>`;
    $('[data-f="number"]').textContent = doc.number;
    $('[data-actions]').innerHTML = draft()
      ? `<button class="btn btn--primary btn--sm" type="button" data-post><span>Провести</span></button><button class="btn btn--outline btn--sm" type="button" data-save><span>Сохранить черновик</span></button><button class="btn btn--danger btn--sm" type="button" data-dialog="dlg-doc-del"><svg class="ico" aria-hidden="true"><use href="#i-trash"/></svg><span>Удалить</span></button>`
      : `<button class="btn btn--outline btn--sm" type="button" data-unpost><span>Отменить проведение</span></button><button class="btn btn--outline btn--sm" type="button" data-print><svg class="ico" aria-hidden="true"><use href="#i-report"/></svg><span>Печатная форма</span></button>`;
    $('[data-banner]').innerHTML = draft() ? '' : '<div class="banner banner--info" role="status"><svg class="ico" aria-hidden="true"><use href="#i-lock"/></svg><div class="banner__text">Документ проведён<small>Остатки на точке уже изменены. Чтобы поправить документ, отмените проведение.</small></div></div>';
    const points = D.stations.slice(0, 24).map(s => `${s.name} · ${s.city}`);
    const opt = (list, v) => [...new Set([v, ...list])].filter(Boolean).map(x => `<option${x === v ? ' selected' : ''}>${esc(x)}</option>`).join('');
    const dis = draft() ? '' : ' disabled';
    const f = [`<div class="fld span-4"><label class="fld__label" for="d-point">${doc.kind === 'movements' ? 'Откуда' : 'Точка'} <span class="fld__req" aria-hidden="true">*</span></label><select class="in" id="d-point" required${dis}><option value="">Выберите</option>${opt(points, doc.point)}</select><span class="fld__err"></span></div>`];
    if (doc.kind === 'orders') f.push(`<div class="fld span-4"><label class="fld__label" for="d-ctr">Поставщик <span class="fld__req" aria-hidden="true">*</span></label><select class="in" id="d-ctr" required${dis}><option value="">Выберите</option>${opt(D.contractors.map(c => c.name), doc.contractor)}</select><span class="fld__err"></span></div>`);
    if (doc.kind === 'movements') f.push(`<div class="fld span-4"><label class="fld__label" for="d-to">Куда <span class="fld__req" aria-hidden="true">*</span></label><select class="in" id="d-to" required${dis}><option value="">Выберите</option>${opt(points, doc.pointTo)}</select><span class="fld__err"></span></div>`);
    if (doc.kind === 'write-offs') f.push(`<div class="fld span-4"><label class="fld__label" for="d-reason">Причина <span class="fld__req" aria-hidden="true">*</span></label><select class="in" id="d-reason" required${dis}><option value="">Выберите</option>${opt(['Истёк срок годности', 'Бой, порча', 'Недостача по инвентаризации'], doc.reason)}</select><span class="fld__err"></span></div>`);
    f.push(`<div class="fld span-4"><label class="fld__label" for="d-date">Дата</label><input class="in in--mono" id="d-date" value="${doc.date}"${dis} pattern="[0-9]{2}\\.[0-9]{2}\\.[0-9]{4}" data-err="Формат: дд.мм.гггг"><span class="fld__err"></span></div>`);
    f.push(`<div class="fld span-12"><label class="fld__label" for="d-note">Комментарий</label><textarea class="in" id="d-note" style="min-height:64px"${dis} placeholder="Номер накладной поставщика, особые условия"></textarea></div>`);
    $('[data-head]').innerHTML = f.join('');
    $('[data-add]').hidden = !draft();
  };

  /* ---------- Табличная часть ---------- */
  const lines = () => {
    tbody.innerHTML = doc.lines.length ? doc.lines.map((l, i) => `<tr data-i="${i}">
      <td class="mono">${i + 1}</td>
      <td class="cell-main">${esc(l.name)}<span class="cell-sub mono">${l.code}</span></td>
      <td>${l.unit}</td>
      <td>${draft() ? `<div class="num" style="width:130px"><button type="button" data-step="-1" aria-label="Меньше"><svg class="ico" aria-hidden="true"><use href="#i-minus"/></svg></button><input type="number" min="1" max="9999" value="${l.qty}" aria-label="Количество: ${esc(l.name)}" data-qty><button type="button" data-step="1" aria-label="Больше"><svg class="ico" aria-hidden="true"><use href="#i-plus"/></svg></button></div>` : `<span class="mono">${l.qty}</span>`}</td>
      <td class="num-cell">${money(l.price)}</td>
      <td class="num-cell" data-lsum>${money(l.qty * l.price)}</td>
      <td class="col-actions">${draft() ? `<button class="icon-btn icon-btn--sm" type="button" data-del aria-label="Удалить строку: ${esc(l.name)}"><svg class="ico" aria-hidden="true"><use href="#i-trash"/></svg></button>` : ''}</td></tr>`).join('')
      : '<tr><td colspan="7"><div class="empty" style="padding:28px"><div class="empty__title">Строк пока нет</div><p class="empty__text">Выберите товар ниже и нажмите «Добавить строку».</p></div></td></tr>';
    totals();
  };
  const totals = () => {
    const t = doc.lines.reduce((a, l) => a + l.qty * l.price, 0);
    $('[data-sum]').textContent = money(t); $('[data-f="total"]').textContent = money(t); $('[data-f="count"]').textContent = doc.lines.length;
  };
  tbody.addEventListener('click', e => {
    const st = e.target.closest('[data-step]');
    if (st) { const tr = st.closest('tr'), l = doc.lines[tr.dataset.i]; l.qty = Math.max(1, l.qty + Number(st.dataset.step)); $('[data-qty]', tr).value = l.qty; $('[data-lsum]', tr).textContent = money(l.qty * l.price); totals(); return; }
    const del = e.target.closest('[data-del]');
    if (del) { const i = Number(del.closest('tr').dataset.i); const [l] = doc.lines.splice(i, 1); lines(); SNC.toast({ type: 'ok', title: 'Строка удалена', text: l.name, action: { label: 'Вернуть', onClick: () => { doc.lines.splice(i, 0, l); lines(); } } }); }
  });
  tbody.addEventListener('input', e => { const inp = e.target.closest('[data-qty]'); if (!inp) return; const tr = inp.closest('tr'), l = doc.lines[tr.dataset.i]; l.qty = Math.max(1, Number(inp.value) || 1); $('[data-lsum]', tr).textContent = money(l.qty * l.price); totals(); });
  $('#add-good').innerHTML = D.goods.map(g => `<option value="${g.id}">${esc(g.name)} · ${money(g.price)} ₽</option>`).join('');
  $('[data-line-add]').addEventListener('click', () => {
    const g = D.goods.find(x => x.id === Number($('#add-good').value));
    const ex = doc.lines.find(l => l.good === g.id);
    if (ex) { ex.qty++; SNC.toast({ type: 'info', title: 'Товар уже в документе', text: `Количество «${g.name}» увеличено до ${ex.qty}.` }); }
    else doc.lines.push({ good: g.id, name: g.name, code: g.code, unit: g.unit, qty: 1, price: Math.round(g.price * (doc.kind === 'orders' ? 0.72 : 1)) });
    lines();
    tbody.lastElementChild?.classList.add('is-changed');
  });

  /* ---------- Действия ---------- */
  const busy = (b, ms, fn) => { b.dataset.loading = 'true'; b.insertAdjacentHTML('beforeend', '<span class="spinner" aria-hidden="true"></span>'); setTimeout(() => { delete b.dataset.loading; $('.spinner', b)?.remove(); fn(); }, ms); };
  document.addEventListener('click', e => {
    const post = e.target.closest('[data-post]');
    if (post) {
      if (!SNC.validate($('#doc-form'))) return;
      if (!doc.lines.length) { SNC.toast({ type: 'err', title: 'Нечего проводить', text: 'Добавьте в документ хотя бы одну строку.' }); return; }
      busy(post, 900, () => { doc.state = 'Проведён'; if (isNew) doc.number = 'ПТ-00415'; head(); lines(); SNC.toast({ type: 'ok', title: 'Документ проведён', text: `Остатки на точке «${doc.point}» обновлены.` }); });
    }
    if (e.target.closest('[data-unpost]')) { doc.state = 'Черновик'; head(); lines(); SNC.toast({ type: 'ok', title: 'Проведение отменено', text: 'Остатки вернулись к состоянию до документа. Документ снова можно править.' }); }
    const save = e.target.closest('[data-save]');
    if (save) busy(save, 600, () => SNC.toast({ type: 'ok', title: 'Черновик сохранён' }));
    if (e.target.closest('[data-print]')) SNC.toast({ type: 'info', title: 'Печатная форма готовится', text: 'Файл PDF скачается автоматически.' });
    if (e.target.closest('[data-doc-del-ok]')) { SNC.dialog.close('dlg-doc-del'); SNC.toast({ type: 'ok', title: 'Черновик удалён' }); setTimeout(() => { location.href = listPage; }, 900); }
  });
  $('#doc-form').addEventListener('submit', e => e.preventDefault());

  head(); lines();
})();
