/* =========================================================
   СНК · Управление продуктами — дашборд (стартовый экран после входа).
   Сводка по трём продуктам из демо-данных: главные цифры, проблемные ТО,
   события, заявки по часам, быстрые переходы, последние заявки.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const D = window.SNC_DEMO, SNC = window.SNC, esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nf = new Intl.NumberFormat('ru-RU');
  const ago = s => s < 15 ? 'только что' : s < 60 ? `${s} с` : s < 3600 ? `${Math.floor(s / 60)} мин` : s < 86400 ? `${Math.floor(s / 3600)} ч` : `${Math.floor(s / 86400)} д`;

  /* ---------- Данные выбранной организации (переключатель в верхней панели) ---------- */
  const inOrg = s => !SNC.org.id || s.org === Number(SNC.org.id);
  const ST = D.stations.filter(inOrg);
  const RQ = D.requests.filter(r => inOrg(D.stations.find(s => s.id === r.station) || {}));

  // подзаголовок и режим партнёра / сервиса: у них нет точек — показываем, что им доступно
  $('[data-scope]').textContent = SNC.org.id ? `Сводка: ${SNC.org.name}` : 'Сводка по всем организациям';
  if (!SNC.org.isClient) {
    ['#dash-kpis', '#h-attn', '#h-hours', '#h-last'].forEach(sel => { const el = $(sel); (el.closest('section') || el).hidden = true; });
    $('.phead').insertAdjacentHTML('afterend', `<div class="banner banner--info" role="status"><svg class="ico" aria-hidden="true"><use href="#i-org"/></svg><div class="banner__text">${esc(SNC.org.name)} — ${SNC.org.type === 4 ? 'партнёр' : 'сервис'}, своих точек обслуживания нет<small>Доступны договоры, пользователи${SNC.org.type === 4 ? ', квоты по клиентам' : ''} и справочники администрирования.</small></div><a class="btn btn--outline btn--xs" href="admin/organization.html?org=${SNC.org.id}">Карточка организации</a></div>`);
  }

  /* ---------- Главные цифры ---------- */
  const online = ST.filter(s => s.state === 1).length;
  const problems = RQ.filter(r => r.kind === 'problem').length;
  const litres = RQ.reduce((a, r) => a + r.litres, 0);
  const sales = ST.reduce((a, s) => a + s.sales, 0);
  const expiring = D.licenses.filter(l => l.until.slice(3) === '10.2026').length + D.hasps.filter(h => h.st === 'warn').length;
  const hours = Array.from({ length: 24 }, (_, h) => RQ.filter(r => r.hour === h).length);
  const spark = hours.slice(Math.max(0, 14 - 11), 15);
  const tiles = [
    { href: 'azs/monitoring.html', label: '<span class="st st--ok">ТО в сети</span>', value: `${online}<small>из ${ST.length}</small>`, foot: `${ST.length - online} требуют внимания` },
    { href: 'azs/requests.html', label: 'Заявок сегодня', value: nf.format(RQ.length), foot: `${nf.format(Math.round(litres))} л отпущено`, spark },
    { href: 'azs/requests.html?kind=problem', label: '<span class="st st--err">Проблемные заявки</span>', value: problems, foot: 'нужно разобрать вручную' },
    { href: 'office/shift.html', label: 'Выручка открытых смен', value: `${nf.format(Math.round(sales / 1000))}<small>тыс ₽</small>`, foot: 'по всем точкам' },
    { href: 'admin/licenses.html', label: '<span class="st st--warn">Лицензии и ключи</span>', value: expiring, foot: 'истекают или ждут активации' }
  ];
  $('#dash-kpis').innerHTML = tiles.map(t => `<a class="kpi" href="${t.href}"><span class="kpi__label">${t.label}</span><span class="kpi__value">${t.value}</span><span class="kpi__foot">${t.foot}${t.spark ? '<svg class="spark" aria-hidden="true" data-spark></svg>' : ''}</span></a>`).join('');
  const sp = $('[data-spark]'); if (sp) SNC.charts.spark(sp, spark);

  /* ---------- Требуют внимания ---------- */
  const attn = ST.filter(s => s.state !== 1).sort((a, b) => ({ err: 0, warn: 1, off: 2 }[D.STATE[a.state].st] - { err: 0, warn: 1, off: 2 }[D.STATE[b.state].st]));
  const why = s => ({
    0: 'Точка не выходит на связь — проверьте интернет на АЗС.', 2: 'Связь прерывается, данные приходят с задержкой.', 3: 'Точкой управляет другая система — обмен с СНК ограничен.',
    4: 'Не настроен платёжный терминал — безналичная оплата недоступна.', 5: 'Нет лицензии — продажи через СНК-АЗС остановлены.', 6: 'Сервис отключён вручную.'
  })[s.state];
  $('#dash-attn').innerHTML = attn.slice(0, 6).map(s => `<li class="attn__item">
      <span class="st st--${D.STATE[s.state].st}">${esc(D.STATE[s.state].short || D.STATE[s.state].label)}</span>
      <a class="attn__name" href="azs/information.html?to=${s.id}">${esc(s.name)} <span class="mono muted">${s.code}</span></a>
      <span class="attn__why">${esc(why(s))}</span>
      <span class="mono muted attn__seen">${ago(s.seen)}</span>
    </li>`).join('') + (attn.length > 6 ? `<li class="attn__more"><a class="link-more" href="azs/monitoring.html">Ещё ${attn.length - 6}</a></li>` : '');

  /* ---------- Лента событий ---------- */
  $('#dash-feed').innerHTML = D.changeLog.slice(0, 7).map(e => `<li class="feed__item"><span class="st st--plain st--${e.st}" aria-hidden="true"></span><div><p><b>${esc(e.user)}</b> · ${esc(e.action.toLowerCase())} · ${esc(e.object)}</p><time class="mono">${esc(e.when)}</time></div></li>`).join('');

  /* ---------- Заявки по часам ---------- */
  const labels = hours.map((_, h) => String(h).padStart(2, '0'));
  SNC.charts.bar($('#dash-hours'), { title: 'Заявки мобильных сервисов по часам, сегодня', labels, labelTitle: 'Час', values: hours.map((v, h) => (h <= 14 ? v : 0)), name: 'Заявки', unit: 'шт', height: 220 });

  /* ---------- Последние заявки ---------- */
  $('#dash-last tbody').innerHTML = RQ.slice(0, 6).map(r => `<tr>
    <td class="mono">${r.id}</td><td class="mono">${r.time}</td>
    <td class="cell-main"><a href="azs/information.html?to=${r.station}">${esc(r.stationName)}</a><span class="cell-sub mono">${r.code} · ТРК ${r.pump}</span></td>
    <td>${r.fuel}</td><td class="mono">${esc(r.ordered)}</td><td class="num-cell">${r.litres.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}</td>
    <td>${esc(r.service)}</td><td><span class="st st--${r.st}">${r.state}</span></td></tr>`).join('');

  /* ---------- Живые данные (имитация): новые заявки ----------
     TODO: подписка на NATS. Цифра в плитке и строка таблицы обновляются на месте. */
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onlineStations = ST.filter(s => s.state === 1);
  let count = RQ.length, lit = litres, next = (RQ[0] || D.requests[0]).id + 1;
  const reqTile = $('#dash-kpis .kpi:nth-child(2)');
  setInterval(() => {
    if (document.hidden || !onlineStations.length) return;
    const s = onlineStations[Math.floor(Math.random() * onlineStations.length)];
    const p = s.pumps[Math.floor(Math.random() * s.pumps.length)];
    const fuel = p.fuels[0], l = Math.round((15 + Math.random() * 35) * 100) / 100;
    count++; lit += l;
    const v = $('.kpi__value', reqTile);
    v.textContent = nf.format(count);
    if (!REDUCED) { v.classList.remove('is-changed'); void v.offsetWidth; v.classList.add('is-changed'); }
    $('.kpi__foot', reqTile).firstChild.textContent = `${nf.format(Math.round(lit))} л отпущено`;
    const tb = $('#dash-last tbody');
    const d = new Date();
    tb.insertAdjacentHTML('afterbegin', `<tr><td class="mono">${next++}</td><td class="mono">${d.toLocaleTimeString('ru-RU')}</td>
      <td class="cell-main"><a href="azs/information.html?to=${s.id}">${esc(s.name)}</a><span class="cell-sub mono">${s.code} · ТРК ${p.n}</span></td>
      <td>${fuel}</td><td class="mono">${Math.round(l)} л</td><td class="num-cell">${l.toLocaleString('ru-RU', { minimumFractionDigits: 2 })}</td>
      <td>${esc(D.services[Math.floor(Math.random() * 3)].name)}</td><td><span class="st st--info">Идёт налив</span></td></tr>`);
    tb.lastElementChild.remove();
    if (!REDUCED) tb.firstElementChild.animate([{ backgroundColor: 'rgba(47,109,174,.10)' }, { backgroundColor: 'transparent' }], { duration: 1600, easing: 'ease-out' });
  }, 8000);

  /* ---------- Часы ---------- */
  const clock = $('[data-clock]');
  const tick = () => { const d = new Date(); clock.textContent = d.toLocaleTimeString('ru-RU'); };
  tick(); setInterval(tick, 1000);
  const h = new Date().getHours();
  $('.phead__title').textContent = `${h < 6 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер'}, Иван`;
})();
