/* =========================================================
   СНК · Управление продуктами — «Контроль заявок».
   Заявки мобильных сервисов за день: плитки-фильтры по состоянию,
   фильтры по сервису и топливу, подробности в боковой панели с этапами,
   ручное завершение проблемной заявки, поток новых заявок (имитация).
   ?kind=problem — сразу отфильтровать; ?id=58214 — открыть заявку.
   TODO: API и живые данные по NATS.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = window.SNC_DEMO, SNC = window.SNC;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nf = new Intl.NumberFormat('ru-RU'), money = n => Number(n).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const KIND = { done: ['Завершена', 'ok'], pour: ['Идёт налив', 'info'], empty: ['Без пролива', 'off'], problem: ['Проблемная', 'err'] };
  // только точки выбранной организации (переключатель в верхней панели)
  const orgOf = id => D.stations.find(s => s.id === id)?.org;
  const inOrg = s => !SNC.org.id || s.org === Number(SNC.org.id);
  const reqs = D.requests.filter(r => !SNC.org.id || orgOf(r.station) === Number(SNC.org.id)).map(r => ({ ...r }));
  const byId = id => reqs.find(r => r.id === Number(id));
  const dt = $('#req-table');
  const tbody = $('tbody', dt);

  /* ---------- Строки ---------- */
  const rowHtml = r => `<tr data-id="${r.id}" data-org="${orgOf(r.station)}" data-kind="${r.kind}" data-service="${esc(r.service)}" data-fuel="${r.fuel}">
    <td class="cell-main mono" data-v="${r.id}"><button class="link-btn" type="button" data-open="${r.id}" aria-label="Заявка ${r.id}: подробности">${r.id}</button></td>
    <td class="mono">${r.time}</td>
    <td data-v="${esc(r.stationName)}"><a href="information.html?to=${r.station}">${esc(r.stationName)}</a><span class="cell-sub mono">${r.code}</span></td>
    <td class="mono">${r.pump} / ${r.nozzle}</td>
    <td>${r.fuel}</td>
    <td>${r.type}</td>
    <td class="mono">${esc(r.ordered)}</td>
    <td class="num-cell" data-v="${r.litres}" data-c="litres">${money(r.litres)}</td>
    <td class="num-cell" data-v="${r.amount}" data-c="amount">${money(r.amount)}</td>
    <td>${esc(r.service)}</td>
    <td data-v="${r.state}" data-c="state"><span class="st st--${r.st}">${r.state}</span></td>
  </tr>`;
  tbody.innerHTML = reqs.map(rowHtml).join('');
  SNC.initTable(dt);

  /* ---------- Фильтры ---------- */
  const F = { kind: 'all', services: [], fuels: [] };
  const fill = (id, values) => { $(`#${id} .opts`).innerHTML = values.map(v => `<div class="opt" role="option" data-value="${esc(v)}" aria-selected="false"><span class="opt__text">${esc(v)}</span></div>`).join(''); SNC.initSelect($(`#${id}`)); };
  fill('f-service', [...new Set(reqs.map(r => r.service))].sort());
  fill('f-fuel', D.FUELS.filter(f => reqs.some(r => r.fuel === f)));
  const apply = () => dt.snc.setFilter(tr => (F.kind === 'all' || tr.dataset.kind === F.kind) && (!F.services.length || F.services.includes(tr.dataset.service)) && (!F.fuels.length || F.fuels.includes(tr.dataset.fuel)));
  $('#f-service').addEventListener('change', e => { if (e.detail) { F.services = e.detail.values; apply(); } });
  $('#f-fuel').addEventListener('change', e => { if (e.detail) { F.fuels = e.detail.values; apply(); } });
  const setKind = k => {
    F.kind = k;
    $$('[data-kind]', $('#req-kpis')).forEach(b => { const on = b.dataset.kind === k; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    apply();
  };
  $$('#req-kpis [data-kind]').forEach(b => b.addEventListener('click', () => setKind(b.dataset.kind === F.kind ? 'all' : b.dataset.kind)));
  dt.addEventListener('dt:reset-filters', () => { $$('#f-service [data-clear], #f-fuel [data-clear]').forEach(b => b.click()); setKind('all'); });

  /* ---------- Плитки ---------- */
  const kpis = () => {
    const n = { all: reqs.length, done: 0, pour: 0, empty: 0, problem: 0 };
    reqs.forEach(r => { n[r.kind]++; });
    Object.entries(n).forEach(([k, v]) => { const el = $(`[data-n="${k}"]`); if (el.textContent !== String(v)) { el.textContent = v; if (!REDUCED) { el.classList.remove('is-changed'); void el.offsetWidth; el.classList.add('is-changed'); } } });
    $('[data-litres]').textContent = `${nf.format(Math.round(reqs.reduce((a, r) => a + r.litres, 0)))} л отпущено`;
    $('[data-share="done"]').textContent = `${n.all ? Math.round(n.done / n.all * 100) : 0}% всех заявок`;
    $('[data-total]').textContent = n.all;
  };
  kpis();

  /* ---------- Подробности ---------- */
  const stages = r => {
    const t = r.time.slice(0, 5);
    const base = [['Сервис СНК', 'Заявка создана, оплата заблокирована на карте водителя'], ['АЗС', `ТРК ${r.pump} зарезервирована, пистолет ${r.nozzle}`]];
    if (r.kind === 'problem') return [...base, ['АЗС', 'Нет ответа от ТРК — налив не подтверждён', true]];
    if (r.kind === 'empty') return [...base, ['АЗС', 'Пистолет не снят за 3 минуты'], ['Сервис СНК', 'Заявка закрыта без пролива, блокировка снята']];
    if (r.kind === 'pour') return [...base, ['АЗС', 'Пистолет снят, идёт налив'], ['АЗС', `Отпущено ${money(r.litres)} л`]];
    return [...base, ['АЗС', 'Налив начат'], ['АЗС', `Налив завершён: ${money(r.litres)} л`], ['Сервис СНК', `Списано ${money(r.amount)} ₽, чек отправлен`]];
  };
  let cur = null;
  const open = id => {
    const r = byId(id); if (!r) return;
    cur = r;
    $('#drw-req-t').innerHTML = `Заявка <span class="mono">№ ${r.id}</span>`;
    $('[data-d="state"]').innerHTML = `<span class="st st--${r.st}">${r.state}</span>`;
    $('[data-d="banner"]').innerHTML = r.kind === 'problem' ? '<div class="banner banner--err" role="status"><svg class="ico" aria-hidden="true"><use href="#i-alert"/></svg><div class="banner__text">Налив не подтверждён<small>Проверьте с оператором ТО, отпущено ли топливо, и завершите заявку вручную.</small></div></div>' : '';
    const kv = [['Точка', `<a href="information.html?to=${r.station}">${esc(r.stationName)}</a> <span class="mono muted">${r.code}</span>`], ['ТРК / пистолет', `<span class="mono">${r.pump} / ${r.nozzle}</span>`], ['Топливо', r.fuel], ['Тип заказа', r.type], ['Заказано', `<span class="mono">${esc(r.ordered)}</span>`], ['Отпущено', `<span class="mono">${money(r.litres)} л</span>`], ['Сумма', `<span class="mono">${money(r.amount)} ₽</span>`], ['Сервис', esc(r.service)], ['Карта', r.card], ['Клиент', r.person]];
    $('[data-d="kv"]').innerHTML = kv.map(([k, v]) => `<div class="kv"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    const t0 = r.time.slice(0, 5);
    $('[data-d="stages"]').innerHTML = stages(r).map(([src, text, err], i) => `<li class="kv${err ? ' is-err' : ''}"><span class="kv__k mono">${t0}:${String(10 + i * 7).padStart(2, '0')} · ${src}</span><span class="kv__v">${esc(text)}</span></li>`).join('');
    const fin = $('#form-finish');
    fin.hidden = r.kind !== 'problem'; fin.reset();
    $('[data-d="foot"]').innerHTML = r.kind === 'problem'
      ? '<button class="btn btn--ghost btn--sm" type="button" data-close>Закрыть</button><button class="btn btn--outline btn--sm" type="button" data-retry><span>Повторить запрос на ТО</span></button><button class="btn btn--primary btn--sm" type="submit" form="form-finish"><span>Завершить вручную</span></button>'
      : '<button class="btn btn--ghost btn--sm" type="button" data-close>Закрыть</button>';
    SNC.dialog.open('drw-req');
    history.replaceState(null, '', `?id=${r.id}`);
  };
  dt.addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) open(b.dataset.open); });
  $('#drw-req').addEventListener('close', () => history.replaceState(null, '', location.pathname));
  $('#drw-req').addEventListener('click', e => {
    if (e.target.closest('[data-retry]')) SNC.toast({ type: 'info', title: 'Запрос отправлен на ТО', text: 'Если ТРК ответит, заявка завершится автоматически.' });
  });
  const setKindOf = (r, kind, litres) => {
    r.kind = kind; r.state = KIND[kind][0]; r.st = KIND[kind][1];
    if (litres !== undefined) { r.litres = litres; r.amount = Math.round(litres * D.PRICE[r.fuel] * 100) / 100; }
    const tr = $(`tr[data-id="${r.id}"]`, tbody);
    if (tr) {
      tr.dataset.kind = kind;
      const st = $('[data-c="state"]', tr); st.dataset.v = r.state; st.innerHTML = `<span class="st st--${r.st}">${r.state}</span>`;
      $('[data-c="litres"]', tr).textContent = money(r.litres); $('[data-c="amount"]', tr).textContent = money(r.amount);
      if (!REDUCED) { st.classList.remove('is-changed'); void st.offsetWidth; st.classList.add('is-changed'); }
    }
    kpis(); dt.snc.paint();
  };
  $('#form-finish').addEventListener('submit', e => {
    e.preventDefault();
    if (!SNC.validate(e.currentTarget)) return;
    const r = cur;
    setKindOf(r, 'done', Math.round((10 + Math.random() * 30) * 100) / 100);
    SNC.dialog.close('drw-req');
    SNC.toast({ type: 'ok', title: `Заявка № ${r.id} завершена вручную`, text: `${money(r.litres)} л, ${money(r.amount)} ₽. Чек отправлен водителю.` });
  });

  /* ---------- Поток новых заявок (имитация) ---------- */
  let liveOn = true;
  $('[data-live-toggle]').addEventListener('change', e => { liveOn = e.target.checked; });
  const online = D.stations.filter(s => s.state === 1 && inOrg(s));
  let next = (reqs[0] || D.requests[0]).id + 1;
  const clock = $('[data-clock]');
  setInterval(() => { clock.textContent = new Date().toLocaleTimeString('ru-RU'); }, 1000);
  setInterval(() => {
    if (!liveOn || document.hidden || !online.length) return;
    // идущие наливы завершаются
    reqs.filter(r => r.kind === 'pour' && Math.random() < 0.5).forEach(r => setKindOf(r, 'done', Math.round((r.litres + 8 + Math.random() * 20) * 100) / 100));
    const s = online[Math.floor(Math.random() * online.length)];
    const p = s.pumps[Math.floor(Math.random() * s.pumps.length)];
    const fuel = p.fuels[Math.floor(Math.random() * p.fuels.length)];
    const d = new Date();
    const r = { id: next++, time: d.toLocaleTimeString('ru-RU'), station: s.id, stationName: s.name, code: s.code, pump: p.n, nozzle: 1 + Math.floor(Math.random() * p.fuels.length), fuel, type: 'На литры', ordered: `${10 + Math.floor(Math.random() * 40)} л`, litres: 0, amount: 0, service: D.services[Math.floor(Math.random() * 3)].name, card: 'Без карты', person: 'Физическое лицо', kind: 'pour', state: KIND.pour[0], st: KIND.pour[1] };
    reqs.unshift(r);
    tbody.insertAdjacentHTML('afterbegin', rowHtml(r));
    const tr = tbody.firstElementChild;
    if (!REDUCED) tr.animate([{ backgroundColor: 'rgba(47,109,174,.10)' }, { backgroundColor: 'transparent' }], { duration: 1600, easing: 'ease-out' });
    kpis(); dt.snc.paint();
  }, 7000);

  /* ---------- Параметры адреса ---------- */
  const q = new URLSearchParams(location.search);
  if (q.get('kind') && KIND[q.get('kind')]) setKind(q.get('kind'));
  if (q.get('id')) open(q.get('id'));
  $('[data-export]').addEventListener('click', () => SNC.toast({ type: 'info', title: 'Выгрузка готовится', text: `${dt.snc.visible.length} заявок с учётом фильтров. Файл скачается автоматически.` }));
})();
