/* =========================================================
   СНК · Управление продуктами — шаблон «Аналитика».
   Две страницы на одном скрипте (body[data-analytics]):
     requests — «Статистика заявок» (СНК-АЗС)
     sales    — «Динамика реализации» (СНК-Офис)
   Период переключается сегментом; ряды по дням строятся детерминированно
   от демо-данных, чтобы цифры не прыгали между перезагрузками.
   TODO: данные — из API отчётов.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = window.SNC_DEMO, SNC = window.SNC, C = SNC.charts;
  const mode = document.body.dataset.analytics;
  const nf = new Intl.NumberFormat('ru-RU'), money = n => Math.round(n).toLocaleString('ru-RU');
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // детерминированный шум по дню
  const noise = (d, k) => { const x = Math.sin(d * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const dayLabel = back => { const d = new Date(2026, 8, 30 - back); return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }); };
  const periodName = n => n === 1 ? 'сегодня' : `${n} дней`;
  const tiles = list => { $('#an-kpis').innerHTML = list.map(t => `<div class="kpi"><span class="kpi__label">${t.label}</span><span class="kpi__value">${t.value}</span><span class="kpi__foot">${t.foot || ''}</span></div>`).join(''); };
  const delta = (cur, prev, goodUp = true) => { if (!prev) return ''; const p = Math.round((cur - prev) / prev * 100); const good = goodUp ? p >= 0 : p <= 0; return `<span class="delta delta--${good ? 'good' : 'bad'}">${p >= 0 ? '▲' : '▼'} ${Math.abs(p)}%</span> к прошлому периоду`; };

  /* ================= Статистика заявок ================= */
  function requests(days) {
    // заявки точек выбранной организации (переключатель в верхней панели)
    const today = D.requests.filter(r => !SNC.org.id || D.stations.find(s => s.id === r.station)?.org === Number(SNC.org.id));
    const share = today.length / D.requests.length; // доля организации — для прошлых дней
    const perDay = back => back === 0 ? today.length : Math.round((58 + noise(back, 1) * 30 + (back % 7 === 5 ? 18 : 0)) * share);
    const series = Array.from({ length: days }, (_, i) => perDay(days - 1 - i));
    const prev = Array.from({ length: days }, (_, i) => perDay(days + days - 1 - i));
    const total = series.reduce((a, b) => a + b, 0), totalPrev = prev.reduce((a, b) => a + b, 0);
    const litres = days === 1 ? today.reduce((a, r) => a + r.litres, 0) : total * 31.4;
    const problems = days === 1 ? today.filter(r => r.kind === 'problem').length : Math.round(total * 0.034);
    tiles([
      { label: 'Заявок', value: nf.format(total), foot: delta(total, totalPrev) },
      { label: 'Отпущено', value: `${nf.format(Math.round(litres))}<small>л</small>`, foot: `${(litres / total).toFixed(1).replace('.', ',')} л на заявку` },
      { label: 'Выручка', value: `${money(litres * 63.5 / 1000)}<small>тыс ₽</small>`, foot: 'по средней цене' },
      { label: '<span class="st st--err">Проблемные</span>', value: problems, foot: `${(problems / total * 100).toFixed(1).replace('.', ',')}% заявок` }
    ]);
    // главный график: по часам за день или по дням за период
    if (days === 1) {
      $('[data-title="main"]').textContent = 'Заявки по часам';
      const hours = Array.from({ length: 24 }, (_, h) => today.filter(r => r.hour === h).length);
      C.bar($('#ch-main'), { title: 'Заявки по часам, сегодня', labels: hours.map((_, h) => String(h).padStart(2, '0')), labelTitle: 'Час', values: hours, name: 'Заявки', unit: 'шт' });
    } else {
      $('[data-title="main"]').textContent = 'Заявки по дням';
      C.bar($('#ch-main'), { title: `Заявки по дням за ${days} дней`, labels: series.map((_, i) => dayLabel(days - 1 - i)), labelTitle: 'Дата', values: series, name: 'Заявки', unit: 'шт' });
    }
    // по состоянию — статусные цвета и знаки
    const k = days === 1 ? { done: 0, empty: 0, problem: 0, pour: 0 } : null;
    if (k) today.forEach(r => { k[r.kind]++; });
    const items = k
      ? [['Завершены', k.done, 'ok'], ['Без пролива', k.empty, 'off'], ['Проблемные', k.problem, 'err'], ['Идёт налив', k.pour, 'info']]
      : [['Завершены', Math.round(total * 0.86), 'ok'], ['Без пролива', Math.round(total * 0.106), 'off'], ['Проблемные', problems, 'err']];
    C.donut($('#ch-donut'), { title: 'Заявки по состоянию', unit: 'шт', centerLabel: 'заявок', items: items.map(([label, value, st]) => ({ label, value, status: st, color: `var(--st-${st})` })) });
    // по сервисам за 30 дней — линии
    const svc = D.services.slice(0, 3);
    C.line($('#ch-line'), { title: 'Заявки по сервисам за 30 дней', unit: 'шт', labelTitle: 'Дата', labels: Array.from({ length: 30 }, (_, i) => dayLabel(29 - i)),
      series: svc.map((s, j) => ({ name: s.name, values: Array.from({ length: 30 }, (_, i) => Math.round(perDay(29 - i) * [0.48, 0.34, 0.18][j] * (0.85 + noise(i, j + 3) * 0.3))) })) });
    // топ точек
    const by = new Map();
    today.forEach(r => { const o = by.get(r.station) || { name: r.stationName, code: r.code, id: r.station, n: 0, l: 0, s: 0, p: 0 }; o.n++; o.l += r.litres; o.s += r.amount; if (r.kind === 'problem') o.p++; by.set(r.station, o); });
    const mul = days === 1 ? 1 : days * 0.93;
    $('#an-top tbody').innerHTML = [...by.values()].sort((a, b) => b.n - a.n).slice(0, 8).map(o => `<tr><td class="cell-main"><a href="information.html?to=${o.id}">${esc(o.name)}</a><span class="cell-sub mono">${o.code}</span></td><td class="num-cell">${nf.format(Math.round(o.n * mul))}</td><td class="num-cell">${nf.format(Math.round(o.l * mul))}</td><td class="num-cell">${money(o.s * mul)}</td><td class="num-cell">${Math.round(o.p * mul)}</td></tr>`).join('');
  }

  /* ================= Динамика реализации ================= */
  let measure = 'litres';
  function sales(days) {
    const fuels = ['АИ-92', 'АИ-95', 'ДТ', 'АИ-100'];
    const base = { 'АИ-92': 9200, 'АИ-95': 6400, 'ДТ': 4800, 'АИ-100': 900 };
    const val = (back, f, j) => Math.round(base[f] * (0.82 + noise(back, j) * 0.36) * (back % 7 === 5 ? 1.18 : 1));
    const labels = Array.from({ length: days }, (_, i) => dayLabel(days - 1 - i));
    const rows = labels.map((l, i) => ({ l, v: fuels.map((f, j) => val(days - 1 - i, f, j)) }));
    const k = f => measure === 'sum' ? D.PRICE[f] : 1;
    const tot = fuels.map((f, j) => rows.reduce((a, r) => a + r.v[j] * k(f), 0));
    const prevTot = fuels.map((f, j) => Array.from({ length: days }, (_, i) => val(days * 2 - 1 - i, f, j)).reduce((a, b) => a + b * k(f), 0));
    const unit = measure === 'sum' ? '₽' : 'л';
    const fmt = v => measure === 'sum' ? `${money(v / 1000)}<small>тыс ₽</small>` : `${nf.format(Math.round(v))}<small>л</small>`;
    tiles(fuels.map((f, j) => ({ label: f, value: fmt(tot[j]), foot: delta(tot[j], prevTot[j]) })));
    $('[data-title="main"]').textContent = measure === 'sum' ? 'Реализация по дням, рубли' : 'Реализация по дням, литры';
    // АИ-100 мало — на общей оси он прижмётся к нулю; показываем три основных вида, АИ-100 — в таблице
    C.line($('#ch-line'), { title: 'Реализация по дням', unit, labelTitle: 'Дата', labels, height: 280,
      series: fuels.slice(0, 3).map((f, j) => ({ name: f, values: rows.map(r => Math.round(r.v[j] * k(f))) })) });
    const t = $('#an-days');
    t.tHead.innerHTML = `<tr><th scope="col">Дата</th>${fuels.map(f => `<th scope="col" class="num-cell">${f}, ${unit}</th>`).join('')}<th scope="col" class="num-cell">Итого, ${unit}</th></tr>`;
    t.tBodies[0].innerHTML = rows.slice().reverse().map(r => { const vs = r.v.map((v, j) => v * k(fuels[j])); return `<tr><td class="mono">${r.l}</td>${vs.map(v => `<td class="num-cell">${nf.format(Math.round(v))}</td>`).join('')}<td class="num-cell"><b>${nf.format(Math.round(vs.reduce((a, b) => a + b, 0)))}</b></td></tr>`; }).join('');
    t.tFoot.innerHTML = `<tr><th scope="row">Итого</th>${tot.map(v => `<td class="num-cell"><b>${nf.format(Math.round(v))}</b></td>`).join('')}<td class="num-cell"><b>${nf.format(Math.round(tot.reduce((a, b) => a + b, 0)))}</b></td></tr>`;
  }

  /* ---------- Период и показатель ---------- */
  const run = days => { $('[data-period-label]').textContent = periodName(days); (mode === 'sales' ? sales : requests)(days); };
  let days = Number($('[data-period] [aria-pressed="true"]').dataset.days);
  $$('[data-period] .seg__btn').forEach(b => b.addEventListener('click', () => {
    $$('[data-period] .seg__btn').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    days = Number(b.dataset.days); run(days);
  }));
  $$('[data-measure] .seg__btn').forEach(b => b.addEventListener('click', () => {
    $$('[data-measure] .seg__btn').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    measure = b.dataset.m; run(days);
  }));
  $('[data-export]')?.addEventListener('click', () => SNC.toast({ type: 'info', title: 'Выгрузка готовится', text: `Данные за ${periodName(days)}. Файл скачается автоматически.` }));
  run(days);
})();
