/* =========================================================
   СНК · Управление продуктами — карточка ТО («Информация по ТО»).
   ?to=<id> — какая точка; без параметра — первая ТО в сети с 4+ колонками. Вкладки заполняются
   из демо-данных: сведения, ТРК (схемы колонок), операции, события,
   версии файлов, заявки, команды. TODO: API и живые данные по NATS.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = window.SNC_DEMO, SNC = window.SNC;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nf = new Intl.NumberFormat('ru-RU'), money = n => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const ago = s => s < 15 ? 'только что' : s < 60 ? `${s} с` : s < 3600 ? `${Math.floor(s / 60)} мин` : s < 86400 ? `${Math.floor(s / 3600)} ч` : `${Math.floor(s / 86400)} д`;

  // без параметра — показательная точка: в сети и с 4+ колонками
  const id = Number(new URLSearchParams(location.search).get('to'));
  // точки выбранной организации; прямую ссылку на чужую точку всё равно открываем
  const mine = D.stations.filter(x => !SNC.org.id || x.org === Number(SNC.org.id));
  const s = D.stations.find(x => x.id === id) || mine.find(x => x.state === 1 && x.pumps.length >= 4) || mine[0] || D.stations[0];
  const org = D.ORGS.find(o => o.id === s.org);
  const state = D.STATE[s.state];
  const online = s.state !== 0 && s.state !== 6;
  document.title = `${s.name} · Информация по ТО · Управление продуктами СНК`;

  /* ---------- Шапка ---------- */
  const set = (k, v, html) => $$(`[data-f="${k}"]`).forEach(el => { if (html) el.innerHTML = v; else el.textContent = v; });
  set('name', s.name);
  set('address', s.address);
  set('state', `<span class="st st--${state.st}">${esc(state.label)}</span>`, true);
  set('code', s.code);
  set('version', s.version);
  set('shift', `№ ${s.shift.n}${s.shift.open ? '' : ' · закр.'}`);
  let seen = s.seen;
  set('seen', ago(seen));
  const live = $('[data-f="live"]');
  if (!online) live.classList.add('live--off'); else if (s.state === 2) live.classList.add('live--stale');
  $('[data-f-href="shift"]').href = `../office/shift.html?to=${s.id}`;
  $('.crumbs [aria-current]')?.insertAdjacentText('beforeend', ` · ${s.name}`);
  if (!online || s.state === 5) {
    const msg = s.state === 5
      ? ['banner--err', 'i-alert', 'Нет лицензии — продажи через СНК-АЗС остановлены', 'Лицензии организации заняты или истекли. Выдайте лицензию в карточке организации.', `<a class="btn btn--outline btn--xs" href="../admin/organization.html?org=${s.org}#t-lic">Лицензии организации</a>`]
      : ['banner--warn', 'i-wifi-off', s.state === 6 ? 'Сервис отключён вручную' : 'Точка не выходит на связь', `Последний сеанс — ${ago(s.seen)} назад. Данные ниже могут быть неактуальны.`, ''];
    $('#to-banner').innerHTML = `<div class="banner ${msg[0]}" role="status"><svg class="ico" aria-hidden="true"><use href="#${msg[1]}"/></svg><div class="banner__text">${msg[2]}<small>${msg[3]}</small></div>${msg[4]}</div>`;
  }

  /* ---------- Переключатель ТО ---------- */
  const sw = $('#to-switch');
  $('.opts', sw).innerHTML = (mine.includes(s) ? mine : [s, ...mine]).map(x => `<div class="opt" role="option" data-value="${x.id}" aria-selected="${x.id === s.id}"><span class="opt__text">${esc(x.name)}</span><small>${x.code} · ${esc(x.city)}</small></div>`).join('');
  $$('.opt', sw).forEach(o => { o.dataset.label = `${o.querySelector('.opt__text').textContent} · ${o.querySelector('small').textContent.split(' · ')[0]}`; });
  SNC.initSelect(sw);
  sw.addEventListener('change', e => { const v = e.detail?.values[0]; if (v && Number(v) !== s.id) location.search = `?to=${v}`; });

  /* ---------- Информация ---------- */
  const fuels = [...new Set(s.pumps.flatMap(p => p.fuels))];
  const hasp = D.hasps.find(h => h.station === s.id);
  const kv = [
    ['Организация', `<a href="../admin/organization.html?org=${org.id}">${esc(org.name)}</a>`],
    ['Адрес', esc(s.address)],
    ['Координаты', `<span class="mono">${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}</span> <a class="link-more" href="https://yandex.ru/maps/?pt=${s.lon},${s.lat}&z=15&l=map" target="_blank" rel="noopener">На карте</a>`],
    ['Терминал', `<span class="mono">${s.terminal}</span>`],
    ['Hasp-ключ', hasp ? `<span class="mono">${hasp.number}</span> <span class="st st--${hasp.st}">${hasp.state}</span>` : '<span class="muted">не привязан</span>'],
    ['Версия СНК-АЗС', `<span class="mono">${s.version}</span> ${s.version === '4.12.0' ? '<span class="st st--ok">актуальная</span>' : '<span class="st st--warn">доступна 4.12.0</span>'}`],
    ['Смена', `<span class="mono">№ ${s.shift.n}</span> · ${s.shift.open ? 'открыта' : 'закрыта'}`],
    ['Продажи за смену', `<span class="mono">${online ? `${money(s.sales)} ₽` : '—'}</span>`],
    ['Виды топлива', esc(fuels.join(', '))],
    ['ТРК', `${s.pumps.length}, работают ${s.pumps.filter(p => [1, 3, 6].includes(p.state)).length}`]
  ];
  $('#info-kv').innerHTML = kv.map(([k, v]) => `<div class="kv"><dt>${k}</dt><dd>${v}</dd></div>`).join('');

  /* ---------- ТРК: схема колонки + пистолеты ---------- */
  const pumpSvg = (p, st) => {
    const nozzles = p.fuels.length;
    const hooks = Array.from({ length: nozzles }, (_, i) => { const y = 58 + i * 22; return `<path class="pc-line" d="M96,${y}h10v14"/><rect class="pc-fill pc-line" x="102" y="${y + 12}" width="8" height="10" rx="2"/>`; }).join('');
    const disp = st === 'info' ? (8 + (p.n * 7.3) % 40).toFixed(2).replace('.', ',') : '0,00';
    return `<svg class="pc-svg pc--${st}" viewBox="0 0 140 170" aria-hidden="true">
      <path class="pc-soft" d="M8,160H132"/>
      <rect class="pc-fill pc-body" x="34" y="18" width="62" height="136" rx="5"/>
      <rect class="pc-screen" x="42" y="28" width="46" height="22" rx="2"/>
      <text class="pc-digits" x="65" y="43" text-anchor="middle">${disp}</text>
      <path class="pc-line" d="M42,62h46M42,74h46"/>
      ${hooks}
      <text class="pc-label" x="65" y="146" text-anchor="middle">ТРК ${p.n}</text>
      <path class="pc-soft" d="M20,18V154M16,18h8M16,154h8"/><text class="pc-dim" x="14" y="90" text-anchor="middle" transform="rotate(-90 14 90)">1 850</text>
    </svg>`;
  };
  const renderPumps = () => {
    $('#pump-grid').innerHTML = s.pumps.map(p => {
      const ps = D.PUMP[p.state];
      const blocked = p.state === 100;
      return `<article class="pump-card pump-card--${ps.st}" data-pump="${p.n}">
        <header class="pump-card__head"><h2>ТРК ${p.n}</h2><span class="st st--${ps.st}">${ps.label}</span></header>
        ${pumpSvg(p, ps.st)}
        <table class="table pump-card__nz"><caption class="sr-only">Пистолеты ТРК ${p.n}</caption><thead><tr><th scope="col">Пист.</th><th scope="col">Топливо</th><th scope="col" class="num-cell">Цена</th></tr></thead>
          <tbody>${p.fuels.map((f, i) => `<tr><td class="mono">${i + 1}</td><td>${f}</td><td class="num-cell">${money(D.PRICE[f])}</td></tr>`).join('')}</tbody></table>
        <footer class="pump-card__foot">${online ? `<button class="btn btn--${blocked ? 'outline' : 'danger'} btn--xs" type="button" data-pump-toggle="${p.n}"><span>${blocked ? 'Разблокировать' : 'Заблокировать'}</span></button>` : '<span class="muted" style="font-size:12.5px">Нет связи с точкой</span>'}</footer>
      </article>`;
    }).join('');
  };
  renderPumps();
  $('#pump-grid').addEventListener('click', e => {
    const b = e.target.closest('[data-pump-toggle]'); if (!b) return;
    const p = s.pumps.find(x => x.n === Number(b.dataset.pumpToggle));
    const prev = p.state;
    p.state = prev === 100 ? 1 : 100;
    renderPumps();
    SNC.toast({ type: 'ok', title: `ТРК ${p.n} ${p.state === 100 ? 'заблокирована' : 'разблокирована'}`, text: 'Команда уйдёт на точку при ближайшем сеансе связи.', action: { label: 'Вернуть', onClick: () => { p.state = prev; renderPumps(); } } });
  });

  /* ---------- Операции ---------- */
  const tx = D.txFor(s.id);
  $('#ops-table tbody').innerHTML = online ? tx.map(t => `<tr><td class="mono" data-v="${t.n}">${t.n}</td><td class="mono">${t.time}</td><td class="mono" data-v="${t.pump}">${t.pump}</td><td>${t.fuel}</td>
    <td class="num-cell" data-v="${t.litres}">${money(t.litres)}</td><td class="num-cell" data-v="${t.price}">${money(t.price)}</td><td class="num-cell" data-v="${t.sum}">${money(t.sum)}</td><td>${t.pay}</td><td class="mono" data-v="${t.check}">${t.check}</td></tr>`).join('') : '';
  const sumL = tx.reduce((a, t) => a + t.litres, 0), sumR = tx.reduce((a, t) => a + t.sum, 0);
  $('[data-ops-total]').textContent = online ? `Итого: ${money(sumL)} л · ${money(sumR)} ₽` : '';
  SNC.initTable($('#ops-table'));

  /* ---------- События ---------- */
  const ev = D.eventsFor(s.id);
  $('#events').innerHTML = ev.map(e => `<li class="kv${e.st === 'err' ? ' is-err' : ''}"><span class="kv__k mono">${e.when} · ${e.src}</span><span class="kv__v">${esc(e.text)}${e.detail ? ` <span class="muted">· ${esc(e.detail)}</span>` : ''}</span></li>`).join('');

  /* ---------- Версии файлов ---------- */
  const files = D.filesFor(s.id);
  const outdated = files.filter(f => !f.ok).length;
  $('#files tbody').innerHTML = files.map(f => `<tr><td class="cell-main mono">${f.name}</td><td class="mono">${f.version}</td><td class="mono">${f.actual}</td>
    <td>${f.ok ? '<span class="st st--ok">Актуальная</span>' : '<span class="st st--warn">Устарела</span>'}</td><td class="num-cell">${f.size}</td><td class="mono">${f.date}</td></tr>`).join('');
  if (outdated) $('#files-banner').innerHTML = `<div class="banner banner--info" style="margin-bottom:16px" role="status"><svg class="ico" aria-hidden="true"><use href="#i-update"/></svg><div class="banner__text">Доступно обновление СНК-АЗС 4.12.0<small>Устарело файлов: ${outdated}. Установка — ночью после закрытия смены, торговля не прервётся.</small></div><button class="btn btn--outline btn--xs" type="button" data-update><span>Назначить обновление</span></button></div>`;
  $('#files-banner').addEventListener('click', e => { if (e.target.closest('[data-update]')) { e.target.closest('.banner').remove(); SNC.toast({ type: 'ok', title: 'Обновление назначено', text: `${s.name} обновится до 4.12.0 сегодня ночью.` }); } });

  /* ---------- Заявки ---------- */
  const reqs = D.requests.filter(r => r.station === s.id);
  $('#req-box').innerHTML = reqs.length
    ? `<div class="dt__scroll"><table class="table"><caption class="sr-only">Заявки мобильных сервисов на этой ТО</caption><thead><tr><th scope="col">№</th><th scope="col">Время</th><th scope="col">ТРК</th><th scope="col">Топливо</th><th scope="col">Заказ</th><th scope="col" class="num-cell">Отпущено, л</th><th scope="col">Сервис</th><th scope="col">Состояние</th></tr></thead>
      <tbody>${reqs.map(r => `<tr><td class="mono"><a href="requests.html?id=${r.id}">${r.id}</a></td><td class="mono">${r.time}</td><td class="mono">${r.pump} / ${r.nozzle}</td><td>${r.fuel}</td><td class="mono">${esc(r.ordered)}</td><td class="num-cell">${money(r.litres)}</td><td>${esc(r.service)}</td><td><span class="st st--${r.st}">${r.state}</span></td></tr>`).join('')}</tbody></table></div>`
    : `<div class="empty"><svg class="empty__art" viewBox="0 0 176 112" aria-hidden="true"><rect class="bp-soft" x="8" y="8" width="160" height="96" rx="4"/><rect class="bp" x="66" y="26" width="44" height="64" rx="4"/><path class="bp" d="M74 38h28M74 50h28"/></svg><div class="empty__title">Сегодня заявок не было</div><p class="empty__text">Заявки мобильных сервисов появятся здесь, как только водитель оплатит топливо в приложении на этой точке.</p></div>`;

  /* ---------- Счётчики на вкладках ---------- */
  const cnt = { pumps: s.pumps.length, ops: online ? tx.length : 0, events: ev.length, files: outdated || '', req: reqs.length };
  Object.entries(cnt).forEach(([k, v]) => { const el = $(`[data-count="${k}"]`); if (el) { el.textContent = v; el.hidden = v === '' || v === 0; } });

  /* ---------- Команды ---------- */
  const hist = $('#cmd-hist tbody');
  const addCmd = (when, name, who, st, label) => { hist.insertAdjacentHTML('afterbegin', `<tr><td class="mono">${when}</td><td>${esc(name)}</td><td>${esc(who)}</td><td><span class="st st--${st}">${label}</span></td></tr>`); return hist.firstElementChild; };
  [['30.09.2026 09:12', 'Обновить цены', 'Смирнова А. В.'], ['29.09.2026 21:40', 'Выгрузить журнал', 'Петров И. С.'], ['29.09.2026 08:03', 'Перезапустить сервис', 'Кузнецов Д. Н.']].reverse().forEach(c => addCmd(c[0], c[1], c[2], 'ok', 'Выполнена'));
  const send = name => {
    if (!online) { SNC.toast({ type: 'err', title: 'Команда не отправлена', text: 'Точка не на связи. Команда уйдёт, когда связь восстановится, — повторите позже.' }); return; }
    const d = new Date();
    const tr = addCmd(`${d.toLocaleDateString('ru-RU')} ${d.toLocaleTimeString('ru-RU').slice(0, 5)}`, name, 'Петров И. С.', 'info', 'Отправлена');
    SNC.toast({ type: 'ok', title: 'Команда отправлена', text: `${name} — ${s.name}` });
    setTimeout(() => { tr.cells[3].innerHTML = '<span class="st st--ok">Выполнена</span>'; tr.cells[3].classList.add('is-changed'); }, 3500);
  };
  $('#cmd-form').addEventListener('submit', e => { e.preventDefault(); if (!SNC.validate(e.currentTarget)) return; send($('#cmd-kind').value); e.currentTarget.reset(); });
  $$('[data-cmd]').forEach(b => b.addEventListener('click', () => { SNC.pop.close(); send(b.dataset.cmd); }));

  /* ---------- Налив на работающих колонках (имитация) ----------
     Цифры на дисплее идут, пока вкладка «ТРК» открыта; в режиме «меньше движения» — стоят. */
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (online && !REDUCED) setInterval(() => {
    if (document.hidden || $('#p-pumps').hidden) return;
    $$('.pump-card--info .pc-digits').forEach(t => {
      const v = Number(t.textContent.replace(',', '.')) + 0.07 + Math.random() * 0.05;
      t.textContent = (v > 60 ? 0 : v).toFixed(2).replace('.', ',');
    });
  }, 140);

  /* ---------- «На связи» тикает ---------- */
  if (online) setInterval(() => { seen = seen > 25 ? 0 : seen + 5; set('seen', ago(seen)); }, 5000);

  // Открыть вкладку по якорю (#t-ops и т. п.)
  const tab = location.hash && $(`${location.hash}[role="tab"]`);
  if (tab) tab.click();
})();
