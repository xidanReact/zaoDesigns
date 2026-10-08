/* =========================================================
   СНК · Управление продуктами — «Информация по смене» (СНК-Офис).
   ?to=<id>[&n=<номер смены>]. Резервуары — в разрезе, как чертёж:
   уровень топлива, размерные метки, остатки и движение за смену.
   Реализация, расход по ТРК, остатки товаров и ресурсов. TODO: API.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = window.SNC_DEMO, SNC = window.SNC;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nf = new Intl.NumberFormat('ru-RU'), money = n => Number(n).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const FUEL_COLOR = { 'АИ-92': 'var(--series-1)', 'АИ-95': 'var(--series-2)', 'ДТ': 'var(--series-3)', 'АИ-100': 'var(--series-4)', 'СУГ': 'var(--blueprint)' };

  const q = new URLSearchParams(location.search);
  const mine = D.stations.filter(x => !SNC.org.id || x.org === Number(SNC.org.id));
  const s = D.stations.find(x => x.id === Number(q.get('to'))) || mine.find(x => x.state === 1 && x.pumps.length >= 3) || mine[0] || D.stations[0];
  const sh = D.shiftFor(s.id);
  const n = Number(q.get('n')) || sh.number;
  const current = n === sh.number;
  const closed = !current || !!sh.closed;

  /* ---------- Шапка и выбор ---------- */
  $('[data-f="sub"]').innerHTML = `<a href="../azs/information.html?to=${s.id}">${esc(s.name)}</a> <span class="mono muted">${s.code}</span> · ${esc(s.address)} · <span class="st st--${closed ? 'off' : 'ok'}">${closed ? 'Смена закрыта' : 'Смена открыта'}</span>`;
  $('[data-f="n"]').textContent = `№ ${n}`;
  $('[data-f="opened"]').textContent = current ? sh.opened : `${D.today.replace(/^\d+/, d => String(Number(d) - (sh.number - n)).padStart(2, '0'))} 08:00`;
  $('[data-f="op"]').textContent = sh.operator;
  const sw = $('#sh-to');
  $('.opts', sw).innerHTML = mine.filter(x => x.state !== 0 && x.state !== 6).map(x => `<div class="opt" role="option" data-value="${x.id}" aria-selected="${x.id === s.id}" data-label="${esc(x.name)} · ${x.code}"><span class="opt__text">${esc(x.name)}</span><small>${x.code} · ${esc(x.city)}</small></div>`).join('');
  SNC.initSelect(sw);
  sw.addEventListener('change', e => { const v = e.detail?.values[0]; if (v && Number(v) !== s.id) location.search = `?to=${v}`; });
  const shSel = $('#sh-n');
  shSel.innerHTML = [0, 1, 2, 3].map(k => `<option value="${sh.number - k}"${sh.number - k === n ? ' selected' : ''}>Смена № ${sh.number - k}${k === 0 ? (sh.closed ? '' : ' · текущая') : ''}</option>`).join('');
  shSel.addEventListener('change', () => { location.search = `?to=${s.id}&n=${shSel.value}`; });
  if (!current) $('[data-banner]').innerHTML = '<div class="banner banner--info" role="status"><svg class="ico" aria-hidden="true"><use href="#i-lock"/></svg><div class="banner__text">Смена закрыта<small>Показаны итоговые данные. Изменить их можно только корректирующим документом.</small></div></div>';
  // закрытая смена — другие цифры, но детерминированно
  const k = current ? 1 : 0.9 + ((sh.number - n) * 0.07);

  /* ---------- Резервуары ---------- */
  const tankSvg = t => {
    const W = 260, H = 132, x0 = 20, y0 = 18, w = 200, h = 84, r = 42;
    const lvl = Math.max(0, Math.min(1, t.end / t.cap));
    const liquidTop = y0 + h * (1 - lvl);
    const warn = t.level < 20;
    return `<svg class="tank tank--${warn ? 'warn' : 'ok'}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Резервуар ${t.n}, ${t.fuel}: заполнен на ${t.level}%, ${nf.format(t.end)} из ${nf.format(t.cap)} литров">
      <defs><clipPath id="tk${t.n}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${r}"/></clipPath></defs>
      <path class="tank__ground" d="M4,${y0 - 8}H${W - 4}"/>
      <rect class="tank__shell-fill" x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${r}"/>
      <g clip-path="url(#tk${t.n})"><rect class="tank__liquid" x="${x0}" y="${liquidTop}" width="${w}" height="${y0 + h - liquidTop}" style="fill:${FUEL_COLOR[t.fuel]}" data-liquid/>
        <rect class="tank__water" x="${x0}" y="${y0 + h - Math.max(1.5, t.water)}" width="${w}" height="${Math.max(1.5, t.water)}"/></g>
      <rect class="tank__shell" x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${r}"/>
      <path class="tank__line" d="M${x0 + 60},${y0}V${y0 - 12}h14V${y0}M${x0 + 140},${y0}V${y0 - 8}"/>
      <path class="tank__dim" d="M${x0 + w + 12},${y0}v${h}M${x0 + w + 8},${y0}h8M${x0 + w + 8},${y0 + h}h8M${x0 + w + 6},${liquidTop}h12"/>
      <text class="tank__lbl" x="${x0 + w + 22}" y="${liquidTop + 4}">${t.level}%</text>
      <path class="tank__level" d="M${x0 - 6},${liquidTop}h${w + 12}"/>
      <text class="tank__cap" x="${x0}" y="${H - 6}">${nf.format(t.cap)} л</text>
    </svg>`;
  };
  const tanks = sh.tanks.map(t => ({ ...t, end: Math.round(t.end * (current ? 1 : k)), sold: Math.round(t.sold * k), level: Math.round(t.end * (current ? 1 : k) / t.cap * 100) }));
  $('#tanks').innerHTML = tanks.map(t => `<article class="panel tank-card">
    <header class="tank-card__head"><h2>Резервуар ${t.n}</h2><span class="fuel-key"><i style="background:${FUEL_COLOR[t.fuel]}"></i>${t.fuel}</span>${t.level < 20 ? '<span class="st st--warn">Мало топлива</span>' : ''}</header>
    ${tankSvg(t)}
    <dl class="tank-card__kv">
      <div class="kv"><dt>На конец</dt><dd class="mono">${nf.format(t.end)} л</dd></div>
      <div class="kv"><dt>Реализация</dt><dd class="mono">${nf.format(t.sold)} л</dd></div>
      <div class="kv"><dt>Приход</dt><dd class="mono">${t.inc ? `${nf.format(t.inc)} л` : '—'}</dd></div>
      <div class="kv"><dt>Вода</dt><dd class="mono">${String(t.water).replace('.', ',')} см</dd></div>
    </dl></article>`).join('');
  // уровень поднимается при первом показе — один раз, как на листе чертежа
  if (!REDUCED) $$('[data-liquid]').forEach((el, i) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'bottom'; el.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 900, delay: 120 + i * 90, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }); });
  const tt = $('#tank-table');
  tt.tBodies[0].innerHTML = tanks.map(t => `<tr><td class="mono">№ ${t.n}</td><td><span class="fuel-key"><i style="background:${FUEL_COLOR[t.fuel]}"></i>${t.fuel}</span></td><td class="num-cell">${nf.format(t.cap)}</td><td class="num-cell">${nf.format(t.start)}</td><td class="num-cell">${t.inc ? nf.format(t.inc) : '—'}</td><td class="num-cell">${nf.format(t.sold)}</td><td class="num-cell">${nf.format(t.end)}</td><td class="num-cell">${String(t.temp).replace('.', ',')}</td><td class="num-cell">${String(t.density).replace('.', ',')}</td></tr>`).join('');
  const sum = key => tanks.reduce((a, t) => a + t[key], 0);
  tt.tFoot.innerHTML = `<tr><th scope="row" colspan="2">Итого</th><td class="num-cell">${nf.format(sum('cap'))}</td><td class="num-cell">${nf.format(sum('start'))}</td><td class="num-cell">${nf.format(sum('inc'))}</td><td class="num-cell">${nf.format(sum('sold'))}</td><td class="num-cell">${nf.format(sum('end'))}</td><td></td><td></td></tr>`;

  /* ---------- Реализация: доли видов топлива (категории — цвета серий) ---------- */
  const real = sh.real.map(r => ({ ...r, litres: Math.round(r.litres * k), sum: Math.round(r.sum * k), count: Math.round(r.count * k) }));
  let realDrawn = false;
  const drawReal = () => {
    if (realDrawn) return; realDrawn = true;
    SNC.charts.donut($('#ch-real'), { title: 'Реализация по видам топлива, литры', unit: 'л', centerLabel: 'литров', table: false, items: real.map(r => ({ label: r.fuel, value: r.litres, color: FUEL_COLOR[r.fuel] })) });
  };
  const rt = $('#real-table');
  rt.tBodies[0].innerHTML = real.map(r => `<tr><td><span class="fuel-key"><i style="background:${FUEL_COLOR[r.fuel]}"></i>${r.fuel}</span></td><td class="num-cell">${nf.format(r.litres)}</td><td class="num-cell">${nf.format(r.count)}</td><td class="num-cell">${money(r.sum)}</td></tr>`).join('');
  rt.tFoot.innerHTML = `<tr><th scope="row">Итого</th><td class="num-cell">${nf.format(real.reduce((a, r) => a + r.litres, 0))}</td><td class="num-cell">${nf.format(real.reduce((a, r) => a + r.count, 0))}</td><td class="num-cell">${money(real.reduce((a, r) => a + r.sum, 0))}</td></tr>`;

  /* ---------- Расход по ТРК ---------- */
  const pumps = sh.byPump.map(p => ({ ...p, litres: Math.round(p.litres * k), count: Math.round(p.count * k) }));
  let pumpsDrawn = false;
  const drawPumps = () => {
    if (pumpsDrawn) return; pumpsDrawn = true;
    SNC.charts.bar($('#ch-pumps'), { title: 'Отпуск по колонкам, литры', labels: pumps.map(p => `ТРК ${p.n}`), labelTitle: '', values: pumps.map(p => p.litres), name: 'Литры', unit: 'л', height: 220, table: false });
  };
  $('#pump-table tbody').innerHTML = pumps.map(p => `<tr><td class="mono">ТРК ${p.n}</td><td>${p.fuel}</td><td class="num-cell">${nf.format(p.litres)}</td><td class="num-cell">${p.count}</td><td class="num-cell">${nf.format(p.counterStart)}</td><td class="num-cell">${nf.format(p.counterStart + p.litres)}</td></tr>`).join('');

  /* ---------- Товары и ресурсы ---------- */
  $('#goods-table tbody').innerHTML = sh.goods.map(g => `<tr><td class="cell-main">${esc(g.name)}<span class="cell-sub mono">${g.code}</span></td><td>${g.unit}</td><td class="num-cell">${g.start}</td><td class="num-cell">${g.sold}</td><td class="num-cell">${g.end}</td><td class="num-cell">${money(g.sum)}</td></tr>`).join('');
  $('#res-table tbody').innerHTML = sh.resources.map(r => `<tr><td class="cell-main">${esc(r.name)}</td><td>${r.unit}</td><td class="num-cell">${r.start}</td><td class="num-cell">${r.used}</td><td class="num-cell">${r.end}</td></tr>`).join('');

  // графики рисуем, когда вкладка видна: иначе у них нулевая ширина
  $('.tabs').addEventListener('tabs:change', e => { const id = e.detail.tab.id; if (id === 't-real') drawReal(); if (id === 't-pumps') drawPumps(); });
  $('[data-report]').addEventListener('click', () => SNC.toast({ type: 'info', title: 'Сменный отчёт готовится', text: `Смена № ${n}, ${s.name}. Файл скачается автоматически.` }));
})();
