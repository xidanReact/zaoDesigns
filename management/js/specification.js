/* =========================================================
   СНК · Управление продуктами — спецификация к договору (шаблон «Форма»).
   ?spec=<id> — правка, ?contract=<id> — новая к договору. Позиции с
   пересчётом сумм и НДС, ключи, срок; липкая панель действий,
   предупреждение о несохранённых изменениях. TODO: API.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = window.SNC_DEMO, SNC = window.SNC;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => Number(n).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const num = v => Number(String(v).replace(/\s/g, '').replace(',', '.')) || 0;
  const q = new URLSearchParams(location.search);
  const spec = D.specs.find(s => s.id === Number(q.get('spec')));
  const contract = D.contracts.find(c => c.id === (spec ? spec.contract : Number(q.get('contract')))) || D.contracts[0];
  const org = D.ORGS.find(o => o.id === contract.org);
  const form = $('#spec-form');
  const back = `organization.html?org=${org.id}#t-contracts`;
  $$('[data-cancel], [data-leave]').forEach(a => { a.href = back; });

  /* ---------- Шапка ---------- */
  const title = spec ? `Спецификация № ${spec.number}` : 'Новая спецификация';
  $('[data-f="title"]').textContent = title;
  $('[data-f="sub"]').innerHTML = `К договору <span class="mono">${esc(contract.number)}</span> · <a href="${back}">${esc(org.name)}</a>`;
  $('[data-f="contract"]').textContent = contract.number;
  document.title = `${title} · Управление продуктами СНК`;
  const crumb = $('.crumbs [aria-current]');
  if (crumb) { crumb.textContent = title; crumb.insertAdjacentHTML('beforebegin', `<a href="${back}">${esc(org.name)}</a><span class="crumbs__sep" aria-hidden="true">/</span>`); }

  /* ---------- Основное ---------- */
  $('#sp-contract').innerHTML = D.contracts.filter(c => c.org === org.id).map(c => `<option value="${c.id}"${c.id === contract.id ? ' selected' : ''}>${esc(c.number)} · ${esc(c.subject)}</option>`).join('');
  $('#sp-number').value = spec ? spec.number : String(D.specs.filter(s => s.contract === contract.id).length + 1);
  const stateSeg = $('[data-state-seg]');
  const setState = v => $$('.seg__btn', stateSeg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
  setState(spec ? spec.state : 'Черновик');
  stateSeg.addEventListener('click', e => { const b = e.target.closest('.seg__btn'); if (b) { setState(b.dataset.v); form.dispatchEvent(new Event('change')); } });

  /* ---------- Позиции ---------- */
  const PRODUCTS = [['Лицензия СНК-АЗС, рабочее место', 24000], ['Лицензия СНК-АЗС, сервер офиса', 48000], ['Лицензия СНК-Офис', 36000], ['Подключение ТО к мобильным сервисам', 6000], ['Сопровождение и обновления, месяц', 3500]];
  const tbody = $('#lines tbody');
  const lineHtml = (pi, qty) => `<tr>
    <td><select class="in" aria-label="Продукт или услуга" data-l="product">${PRODUCTS.map((p, i) => `<option value="${i}"${i === pi ? ' selected' : ''}>${esc(p[0])}</option>`).join('')}</select></td>
    <td><div class="num" style="width:130px"><button type="button" data-step="-1" aria-label="Меньше"><svg class="ico" aria-hidden="true"><use href="#i-minus"/></svg></button><input type="number" min="1" max="999" step="1" value="${qty}" aria-label="Количество" data-l="qty"><button type="button" data-step="1" aria-label="Больше"><svg class="ico" aria-hidden="true"><use href="#i-plus"/></svg></button></div></td>
    <td><input class="in in--mono" style="text-align:right" inputmode="decimal" aria-label="Цена без НДС, рублей" data-l="price" value="${money(PRODUCTS[pi][1])}"></td>
    <td class="num-cell" data-l="sum">0,00</td>
    <td class="col-actions"><button class="icon-btn icon-btn--sm" type="button" data-line-del aria-label="Удалить позицию"><svg class="ico" aria-hidden="true"><use href="#i-trash"/></svg></button></td>
  </tr>`;
  const bindNum = tr => { const n = $('.num', tr), input = $('input', n); $$('[data-step]', n).forEach(b => b.addEventListener('click', () => { input.value = Math.min(999, Math.max(1, (Number(input.value) || 1) + Number(b.dataset.step))); input.dispatchEvent(new Event('input', { bubbles: true })); })); };
  const recalc = () => {
    let net = 0;
    $$('tr', tbody).forEach(tr => { const s = num($('[data-l="qty"]', tr).value) * num($('[data-l="price"]', tr).value); $('[data-l="sum"]', tr).textContent = money(s); net += s; });
    const vat = net * 0.2;
    $('[data-sum="net"]').textContent = money(net); $('[data-sum="vat"]').textContent = money(vat); $('[data-sum="total"]').textContent = money(net + vat);
    $('[data-f="total"]').textContent = money(net + vat);
  };
  const addLine = (pi, qty) => { tbody.insertAdjacentHTML('beforeend', lineHtml(pi, qty)); bindNum(tbody.lastElementChild); recalc(); };
  const init = spec ? [[0, Math.max(2, Math.round(spec.total / 30000))], [4, 12], [3, 2]].slice(0, Math.min(3, spec.items)) : [[0, 1]];
  init.forEach(([p, qn]) => addLine(p, qn));
  tbody.addEventListener('input', recalc);
  tbody.addEventListener('change', e => { const s = e.target.closest('[data-l="product"]'); if (s) { $('[data-l="price"]', s.closest('tr')).value = money(PRODUCTS[s.value][1]); recalc(); } });
  tbody.addEventListener('focusout', e => { const p = e.target.closest('[data-l="price"]'); if (p) p.value = money(num(p.value)); });
  tbody.addEventListener('click', e => {
    const b = e.target.closest('[data-line-del]'); if (!b) return;
    if ($$('tr', tbody).length === 1) { SNC.toast({ type: 'warn', title: 'В спецификации нужна хотя бы одна позиция' }); return; }
    b.closest('tr').remove(); recalc(); form.dispatchEvent(new Event('change'));
    $('[data-line-add]').focus();
  });
  $('[data-line-add]').addEventListener('click', () => { addLine(0, 1); $('[data-l="product"]', tbody.lastElementChild).focus(); form.dispatchEvent(new Event('change')); });

  /* ---------- Hasp-ключи ---------- */
  const keys = D.hasps.filter(h => h.org === org.id);
  const box = $('#sp-keys');
  $('.opts', box).innerHTML = keys.map((h, i) => `<div class="opt" role="option" data-value="${h.number}" aria-selected="${spec ? i < 2 : false}"><span class="opt__text mono">${h.number}</span><small>${h.st === 'warn' ? 'ждёт активации' : esc(h.stationName)}</small></div>`).join('');
  $$('.opt', box).forEach(o => { o.dataset.label = o.dataset.value; });
  SNC.initSelect(box);
  const hint = $('[data-keys-hint]');
  const upd = vals => { hint.textContent = vals.length ? `Выбрано ключей: ${vals.length}` : 'Ключи можно добавить позже.'; };
  box.addEventListener('change', e => { if (e.detail) { upd(e.detail.values); form.dispatchEvent(new Event('change')); } });
  upd(spec ? keys.slice(0, 2) : []);
  // начальная отрисовка select'а шлёт change — это не правка пользователя
  form.dispatchEvent(new Event('reset'));

  /* ---------- Действия ---------- */
  // сохранение по «Сохранить» делает общий слой (data-dirty-watch): проверка, загрузка, тост
  $('[data-draft]').addEventListener('click', () => {
    form.dispatchEvent(new Event('reset')); // синтетический reset только снимает флаг изменений, значения остаются
    setState('Черновик');
    SNC.toast({ type: 'ok', title: 'Черновик сохранён', text: 'Организация его не видит, пока спецификация не станет действующей.' });
  });
  $('[data-cancel]').addEventListener('click', e => { if (form.hasAttribute('data-dirty')) { e.preventDefault(); SNC.dialog.open('dlg-leave'); } });
  // уход по ссылке «Уйти без сохранения» — без системного вопроса браузера
  $('[data-leave]').addEventListener('click', () => { form.dispatchEvent(new Event('reset')); });
})();
