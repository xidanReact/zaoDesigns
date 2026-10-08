/* =========================================================
   СНК · Управление продуктами — экран «Мониторинг ТО».
   Плитки-фильтры, фильтры по организации и версии, вид «таблица / карта»,
   карта-схема точек (SVG без тайлов), имитация живых данных, действия со строками.
   Строки таблицы статичны (tools/generate.mjs из data/demo.js) — JS только оживляет.
   TODO: в боевой версии живые данные приходят по NATS, а не по таймеру.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const SNC = window.SNC;
  const DEMO = window.SNC_DEMO;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dt = $('#to-table');
  if (!dt || !dt.snc || !DEMO) return;

  const allRows = () => $$('tbody > tr:not(.row-detail)', dt);
  // строки выбранной организации (переключатель в верхней панели); таблицу фильтрует общий слой
  const rows = () => allRows().filter(SNC.orgMatch);
  const byId = id => $(`tbody > tr[data-id="${id}"]`, dt);
  const station = id => DEMO.stations.find(s => s.id === Number(id));
  const ago = s => s < 15 ? 'только что' : s < 60 ? `${s} с` : s < 3600 ? `${Math.floor(s / 60)} мин` : s < 86400 ? `${Math.floor(s / 3600)} ч` : `${Math.floor(s / 86400)} д`;
  const flash = el => { if (!el || REDUCED) return; el.classList.remove('is-changed'); void el.offsetWidth; el.classList.add('is-changed'); };
  const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* нет storage */ } } };

  /* ---------- Фильтры ---------- */
  const F = { kpi: 'all', orgs: [], version: '' };
  const resetBtn = $('[data-reset-filters]', dt);
  const apply = () => {
    dt.snc.setFilter(tr =>
      (F.kpi === 'all' || tr.dataset.st === F.kpi) &&
      (!F.orgs.length || F.orgs.includes(tr.dataset.org)) &&
      (!F.version || tr.dataset.version === F.version));
    resetBtn.hidden = F.kpi === 'all' && !F.orgs.length && !F.version;
    Map_.dim();
  };
  $$('[data-kpi]').forEach(b => b.addEventListener('click', () => {
    F.kpi = b.dataset.kpi === F.kpi ? 'all' : b.dataset.kpi; // повторный клик снимает фильтр
    $$('[data-kpi]').forEach(x => { const on = x.dataset.kpi === F.kpi; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
    apply();
    SNC.announce(`Показаны: ${b.querySelector('.kpi__label').textContent.trim()}, ${dt.snc.visible.length}`);
  }));
  $('#f-org').addEventListener('change', e => { if (e.detail) { F.orgs = e.detail.values; apply(); } });
  $('#f-ver').addEventListener('change', e => { if (e.detail) { F.version = e.detail.values[0] || ''; apply(); } });
  const resetAll = () => {
    F.kpi = 'all'; F.orgs = []; F.version = '';
    $$('#f-org .opt').forEach(o => o.setAttribute('aria-selected', 'false'));
    $$('#f-ver .opt').forEach((o, i) => o.setAttribute('aria-selected', String(i === 0)));
    // перерисовать подписи select'ов: клик по «Сбросить» внутри панели
    $('#f-org [data-clear]').click();
    $('#f-ver .opt').click();
    $$('[data-kpi]').forEach(x => { const on = x.dataset.kpi === 'all'; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
    apply();
  };
  resetBtn.addEventListener('click', resetAll);
  dt.addEventListener('dt:reset-filters', resetAll);

  /* ---------- Плитки: пересчёт по строкам ---------- */
  const kpis = () => {
    const all = rows();
    const n = { all: all.length, ok: 0, warn: 0, err: 0, off: 0 };
    all.forEach(tr => { n[tr.dataset.st] = (n[tr.dataset.st] || 0) + 1; });
    Object.entries(n).forEach(([k, v]) => {
      const el = $(`[data-kpi-n="${k}"]`);
      if (el && el.textContent !== String(v)) { el.textContent = v; flash(el); }
    });
    const foot = $('[data-kpi="all"] .kpi__foot'); if (foot) foot.textContent = SNC.org.id ? SNC.org.name : `в ${new Set(all.map(tr => tr.dataset.org)).size} организациях`;
    const share = $('[data-kpi-share="ok"]');
    if (share) share.textContent = `${Math.round(n.ok / n.all * 100)}% точек`;
    $('[data-count-total]').textContent = n.all;
  };

  /* ---------- Смена состояния ТО (живые данные и действия) ---------- */
  function setState(id, state) {
    const tr = byId(id);
    const s = station(id);
    if (!tr || !s) return;
    const st = DEMO.STATE[state];
    s.state = state;
    tr.dataset.state = state; tr.dataset.st = st.st;
    const cell = $('[data-cell="state"]', tr);
    cell.dataset.v = `${st.st}${state}`;
    cell.innerHTML = `<span class="st st--${st.st}">${st.short || st.label}</span>`;
    flash(cell);
    const online = state !== 0 && state !== 6;
    if (!online) { const sales = $('[data-cell="sales"]', tr); sales.textContent = '—'; }
    kpis();
    Map_.update(id);
    dt.snc.paint();
  }

  /* ---------- Вид: таблица / карта ---------- */
  const VIEW_KEY = 'snc-mgmt-monitoring-view';
  const setView = v => {
    $$('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
    $$('[data-view-panel]', dt).forEach(p => { p.hidden = p.dataset.viewPanel !== v; });
    $$('[data-dt-density], [data-dt-cols]', dt).forEach(el => { el.hidden = v === 'map'; });
    if (v === 'map') Map_.render();
    store.set(VIEW_KEY, v);
  };
  $$('[data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));

  /* ---------- Карта-схема ----------
     Лист чертежа: сетка координат, засечки, ТО как условные знаки, связи с сервером СНК.
     Томск и Северск — плотное скопление, поэтому они вынесены в «выносной элемент А»
     в укрупнённом масштабе (приём чертежа). У каждой ТО одна доступная точка:
     в скоплении — во выноске, на основном поле — только знак без фокуса. */
  const Map_ = (() => {
    const host = $('#to-map');
    const NS = 'http://www.w3.org/2000/svg';
    const LON = [76.6, 89.4], LAT = [55.8, 61.3];
    const K = Math.cos(58.5 * Math.PI / 180);
    const W = 1000, PAD = 44;
    const scale = (W - PAD * 2) / ((LON[1] - LON[0]) * K);
    const H = Math.round((LAT[1] - LAT[0]) * scale + PAD * 2);
    const xy = (lat, lon) => [PAD + (lon - LON[0]) * K * scale, PAD + (LAT[1] - lat) * scale];
    // выноска А: Томск и Северск
    const A = { lat: [56.38, 56.72], lon: [84.66, 85.20] };
    const inA = s => s.lat >= A.lat[0] && s.lat <= A.lat[1] && s.lon >= A.lon[0] && s.lon <= A.lon[1];
    const aScale = 300 / ((A.lon[1] - A.lon[0]) * K);
    const aW = 300, aH = Math.round((A.lat[1] - A.lat[0]) * aScale);
    const aX = W - PAD - aW - 24, aY = PAD + 64;
    const xyA = (lat, lon) => [aX + (lon - A.lon[0]) * K * aScale, aY + (A.lat[1] - lat) * aScale];
    const HUB = [56.4977, 84.9744]; // Томск — сервер СНК
    let svg = null, chip = null, layerPk = null;
    const pts = new Map();   // доступные точки (для фильтров и событий)
    const marks = new Map(); // знаки на основном поле для ТО из выноски
    const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); (parent || svg).append(n); return n; };
    const COLOR = { ok: 'var(--st-ok)', warn: 'var(--st-warn)', err: 'var(--st-err)', off: 'var(--st-off)', info: 'var(--st-info)' };
    const shape = (g, st, small) => {
      g.querySelector('.shape')?.remove();
      const c = COLOR[st], k = small ? 0.7 : 1;
      let n;
      if (st === 'warn') n = el('path', { d: `M0,${-7 * k}L${6.5 * k},${5 * k}H${-6.5 * k}Z`, fill: c }, g);
      else if (st === 'err') n = el('rect', { x: -5.5 * k, y: -5.5 * k, width: 11 * k, height: 11 * k, rx: 1.5, fill: c }, g);
      else if (st === 'off') n = el('circle', { r: 5 * k, fill: 'var(--bg)', stroke: c, 'stroke-width': 2 }, g);
      else n = el('circle', { r: 5.5 * k, fill: c }, g);
      n.classList.add('shape');
      if (st === 'off') n.style.stroke = c;
      g.prepend(n);
    };
    const showChip = (g, s) => {
      const b = host.getBoundingClientRect(), r = g.getBoundingClientRect();
      const st = DEMO.STATE[s.state];
      const seen = Number(byId(s.id)?.querySelector('[data-cell="seen"]').dataset.v ?? s.seen);
      chip.innerHTML = `<b>${s.name}</b><span class="mono">${s.code} · ${s.address}</span><div><span class="st st--${st.st}">${st.short || st.label}</span></div><span class="mono">на связи: ${ago(seen)}</span>`;
      chip.classList.add('is-visible');
      const cw = chip.offsetWidth, ch = chip.offsetHeight;
      let x = r.left - b.left + r.width / 2 - cw / 2, y = r.top - b.top - ch - 12;
      if (y < 8) y = r.bottom - b.top + 12;
      chip.style.left = `${Math.max(8, Math.min(b.width - cw - 8, x))}px`;
      chip.style.top = `${y}px`;
    };
    const point = (parent, s, x, y) => {
      const a = el('a', { href: `information.html?to=${s.id}`, class: 'map__pt', transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`, 'aria-label': `${s.name}, ${s.address}: ${DEMO.STATE[s.state].label}` }, parent);
      el('circle', { r: 10, class: 'ring' }, a);
      el('circle', { r: 13, fill: 'transparent' }, a); // область наведения больше знака
      shape(a, DEMO.STATE[s.state].st);
      a.addEventListener('pointerenter', () => showChip(a, s));
      a.addEventListener('focus', () => showChip(a, s));
      a.addEventListener('pointerleave', () => chip.classList.remove('is-visible'));
      a.addEventListener('blur', () => chip.classList.remove('is-visible'));
      pts.set(s.id, a);
    };
    const render = () => {
      if (svg) return;
      svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('role', 'group');
      svg.setAttribute('aria-label', 'Точки обслуживания на карте-схеме Томской области, Томск и Северск — на выноске А. Демо-данные.');
      host.append(svg);
      // сетка координат
      const grid = el('g', {});
      for (let lat = Math.ceil(LAT[0]); lat <= LAT[1]; lat++) {
        const [, y] = xy(lat, LON[0]);
        el('line', { x1: PAD, x2: W - PAD, y1: y, y2: y, class: 'map__grid' }, grid);
        el('text', { x: PAD - 8, y: y + 3, 'text-anchor': 'end', class: 'map__tick' }, grid).textContent = `${lat}°`;
      }
      for (let lon = Math.ceil(LON[0]); lon <= LON[1]; lon += 2) {
        const [x] = xy(LAT[0], lon);
        el('line', { x1: x, x2: x, y1: PAD, y2: H - PAD, class: 'map__grid' }, grid);
        el('text', { x, y: H - PAD + 16, 'text-anchor': 'middle', class: 'map__tick' }, grid).textContent = `${lon}°`;
      }
      el('rect', { x: PAD, y: PAD, width: W - PAD * 2, height: H - PAD * 2, class: 'map__frame' });
      [[PAD, PAD], [W - PAD, PAD], [PAD, H - PAD], [W - PAD, H - PAD]].forEach(([x, y]) => el('path', { d: `M${x - 8},${y}h16M${x},${y - 8}v16`, class: 'map__frame' }));
      el('text', { x: PAD + 10, y: PAD + 20, class: 'map__tick' }).textContent = 'ТОМСКАЯ ОБЛАСТЬ · КАРТА-СХЕМА ТО';

      const hub = xy(...HUB);
      // связи ТО → сервер (для ТО из выноски — внутри выноски)
      const links = el('g', {});
      DEMO.stations.filter(s => !inA(s)).forEach(s => { const [x, y] = xy(s.lat, s.lon); el('line', { x1: hub[0], y1: hub[1], x2: x, y2: y, class: 'map__link' }, links); });
      const cities = el('g', {});
      DEMO.PLACES.forEach(([name, lat, lon]) => { if (inA({ lat, lon })) return; const [x, y] = xy(lat, lon); el('text', { x: x + 10, y: y - 9, class: 'map__city' }, cities).textContent = name; });

      // рамка «А» на основном поле и линия-выноска
      const [ax0, ay0] = xy(A.lat[1], A.lon[0]), [ax1, ay1] = xy(A.lat[0], A.lon[1]);
      el('rect', { x: ax0 - 6, y: ay0 - 6, width: ax1 - ax0 + 12, height: ay1 - ay0 + 12, rx: 4, class: 'map__frame', 'stroke-dasharray': '3 3' });
      el('text', { x: ax1 + 10, y: ay0 + 4, class: 'map__hub-label' }).textContent = 'А';
      el('path', { d: `M${ax1 + 6},${ay0 - 6}L${aX + aW / 2},${aY + aH + 14}`, class: 'map__link', 'stroke-dasharray': '3 3' });

      layerPk = el('g', {});
      const layer = el('g', {});
      // знаки ТО из выноски на основном поле — без фокуса, только для общей картины
      DEMO.stations.filter(inA).forEach(s => {
        const [x, y] = xy(s.lat, s.lon);
        const g = el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`, 'aria-hidden': 'true' }, layer);
        shape(g, DEMO.STATE[s.state].st, true);
        marks.set(s.id, g);
      });
      el('rect', { x: hub[0] - 6, y: hub[1] - 6, width: 12, height: 12, class: 'map__hub', transform: `rotate(45 ${hub[0]} ${hub[1]})` }, layer);
      DEMO.stations.filter(s => !inA(s)).forEach(s => { const [x, y] = xy(s.lat, s.lon); point(layer, s, x, y); });

      // выноска А
      const box = el('g', {});
      el('rect', { x: aX - 16, y: aY - 40, width: aW + 32, height: aH + 64, rx: 8, fill: 'var(--bg)', stroke: 'var(--blueprint)', 'stroke-width': 1 }, box);
      el('text', { x: aX - 4, y: aY - 18, class: 'map__hub-label' }, box).textContent = `А · Томск и Северск, крупнее в ${Math.round(aScale / scale)} раз`;
      el('path', { d: `M${aX - 16},${aY - 8}h${aW + 32}`, class: 'map__grid' }, box);
      const ahub = xyA(...HUB);
      DEMO.stations.filter(inA).forEach(s => { const [x, y] = xyA(s.lat, s.lon); el('line', { x1: ahub[0], y1: ahub[1], x2: x, y2: y, class: 'map__link' }, box); });
      [['Томск', 56.4977, 84.9744], ['Северск', 56.6031, 84.8809]].forEach(([n, lat, lon]) => { const [x, y] = xyA(lat, lon); el('text', { x: x + 14, y: y - 12, class: 'map__city' }, box).textContent = n; });
      el('rect', { x: ahub[0] - 8, y: ahub[1] - 8, width: 16, height: 16, class: 'map__hub', transform: `rotate(45 ${ahub[0]} ${ahub[1]})` }, box);
      // подпись сервера — с выносной линией в свободный нижний угол, чтобы не спорить с точками
      el('path', { d: `M${ahub[0]},${ahub[1] + 8}L${aX + 10},${aY + aH - 4}H${aX + 96}`, class: 'map__link', stroke: 'var(--blueprint)' }, box);
      el('text', { x: aX + 10, y: aY + aH - 10, class: 'map__hub-label' }, box).textContent = 'СЕРВЕР СНК';
      DEMO.stations.filter(inA).forEach(s => { const [x, y] = xyA(s.lat, s.lon); point(box, s, x, y); });

      chip = document.createElement('div'); chip.className = 'map-chip'; chip.setAttribute('aria-hidden', 'true');
      host.append(chip);
      const legend = document.createElement('div');
      legend.className = 'map__legend';
      legend.innerHTML = '<span class="st st--ok">В сети</span><span class="st st--warn">Требуют внимания</span><span class="st st--err">Нет лицензии</span><span class="st st--off">Не в сети</span>';
      host.append(legend);
      dim();
    };
    const update = id => {
      const s = station(id);
      const a = pts.get(Number(id));
      if (a) { shape(a, DEMO.STATE[s.state].st); a.setAttribute('aria-label', `${s.name}, ${s.address}: ${DEMO.STATE[s.state].label}`); }
      const m = marks.get(Number(id));
      if (m) shape(m, DEMO.STATE[s.state].st, true);
    };
    const passes = tr => SNC.orgMatch(tr) && (F.kpi === 'all' || tr.dataset.st === F.kpi) && (!F.orgs.length || F.orgs.includes(tr.dataset.org)) && (!F.version || tr.dataset.version === F.version);
    const dim = () => {
      if (!svg) return;
      rows().forEach(tr => {
        const ok = passes(tr), id = Number(tr.dataset.id);
        const a = pts.get(id);
        a?.classList.toggle('is-dim', !ok);
        a?.setAttribute('tabindex', ok ? '0' : '-1');
        marks.get(id)?.setAttribute('opacity', ok ? '1' : '.14');
      });
    };
    // пакет данных от ТО к серверу — видно, кто только что вышел на связь
    const packet = id => {
      if (!svg || REDUCED || host.closest('[hidden]')) return;
      const s = station(id);
      const [x, y] = inA(s) ? xyA(s.lat, s.lon) : xy(s.lat, s.lon);
      const [hx, hy] = inA(s) ? xyA(...HUB) : xy(...HUB);
      const c = el('circle', { r: 3, class: 'map__packet' }, layerPk.parentNode === svg && inA(s) ? svg : layerPk);
      const d = Math.hypot(hx - x, hy - y);
      c.animate([{ transform: `translate(${x}px, ${y}px)` }, { transform: `translate(${hx}px, ${hy}px)` }], { duration: Math.min(2400, Math.max(500, d * 3.2)), easing: 'linear' }).onfinish = () => c.remove();
    };
    return { render, update, dim, packet };
  })();

  /* ---------- Живые данные (имитация) ---------- */
  const clock = $('[data-clock]');
  const live = $('[data-live]');
  let last = Date.now();
  const tick = () => {
    const now = Date.now();
    const dSec = Math.round((now - last) / 1000);
    last = now;
    clock.textContent = new Date().toLocaleTimeString('ru-RU');
    // все счётчики «на связи» растут
    rows().forEach(tr => {
      const c = $('[data-cell="seen"]', tr);
      const v = Number(c.dataset.v) + dSec;
      c.dataset.v = v;
      const t = ago(v); if (c.textContent !== t) c.textContent = t;
    });
    // две-три точки выходят на связь
    const online = rows().filter(tr => !['0', '6'].includes(tr.dataset.state));
    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
      const tr = online[Math.floor(Math.random() * online.length)];
      const c = $('[data-cell="seen"]', tr);
      c.dataset.v = 0; c.textContent = 'только что';
      if (!tr.hidden) flash(c);
      const sales = $('[data-cell="sales"]', tr);
      const v = Number(sales.dataset.v) + Math.round(Math.random() * 90) * 10;
      sales.dataset.v = v; sales.textContent = v.toLocaleString('ru-RU', { minimumFractionDigits: 2 });
      Map_.packet(tr.dataset.id);
    }
  };
  // Иногда связь у одной ТО становится нестабильной и восстанавливается
  let flips = 0;
  const flip = () => {
    const warn = rows().filter(tr => tr.dataset.state === '2');
    const ok = rows().filter(tr => tr.dataset.state === '1');
    const toOk = flips++ % 2 === 0 && warn.length;
    const tr = toOk ? warn[0] : ok[Math.floor(Math.random() * ok.length)];
    const s = station(tr.dataset.id);
    setState(s.id, toOk ? 1 : 2);
    SNC.toast(toOk
      ? { type: 'ok', title: `${s.name} снова в сети`, text: `${s.code} · ${s.city}` }
      : { type: 'warn', title: `${s.name}: нестабильное подключение`, text: `${s.code} · ${s.city}. Данные могут приходить с задержкой.`, action: { label: 'Показать в таблице', onClick: () => { F.kpi = 'warn'; $('[data-kpi="warn"]').click(); } } });
  };
  let tTick = null, tFlip = null;
  const start = () => { last = Date.now(); tTick = setInterval(tick, 3000); tFlip = setInterval(flip, 24000); live.classList.remove('live--stale'); };
  const stop = () => { clearInterval(tTick); clearInterval(tFlip); };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : (tick(), start())));

  /* ---------- Действия ---------- */
  let targets = [];
  const dlg = $('#dlg-disable');
  const askDisable = trs => {
    targets = trs.filter(tr => !['0', '6'].includes(tr.dataset.state));
    if (!targets.length) { SNC.toast({ type: 'info', title: 'Сервис уже отключён', text: 'У выбранных точек нет связи или сервис выключен.' }); return; }
    const n = targets.length;
    const word = n % 10 === 1 && n % 100 !== 11 ? 'точка' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'точки' : 'точек';
    $('[data-disable-who]').textContent = n === 1 ? `${station(targets[0].dataset.id).name} · ${targets[0].querySelector('.cell-sub').textContent}` : `${n} ${word} обслуживания`;
    $('[data-disable-cta]').textContent = n === 1 ? 'Отключить сервис' : `Отключить у ${n}`;
    SNC.dialog.open('dlg-disable');
  };
  $('#form-disable').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!SNC.validate(form)) return;
    const b = $('[type="submit"]', form);
    b.dataset.loading = 'true'; b.insertAdjacentHTML('beforeend', '<span class="spinner" aria-hidden="true"></span>');
    setTimeout(() => { // TODO: команда на сервер
      delete b.dataset.loading; $('.spinner', b)?.remove();
      const prev = targets.map(tr => [tr.dataset.id, Number(tr.dataset.state)]);
      prev.forEach(([id]) => setState(id, 6));
      SNC.dialog.close('dlg-disable'); form.reset();
      $('[data-dt-clear]', dt).click();
      SNC.toast({ type: 'ok', title: prev.length === 1 ? 'Сервис отключён' : `Сервис отключён у ${prev.length} ТО`, action: { label: 'Вернуть', onClick: () => { prev.forEach(([id, st]) => setState(id, st)); SNC.toast({ type: 'info', title: 'Сервис снова включён' }); } } });
    }, 800);
  });

  dt.addEventListener('rowmenu', e => {
    const { action, row } = e.detail;
    const s = station(row.dataset.id);
    if (action === 'open') window.location.href = `information.html?to=${s.id}`;
    if (action === 'copy') {
      navigator.clipboard?.writeText(s.code).then(
        () => SNC.toast({ type: 'ok', title: `Код ${s.code} скопирован` }),
        () => SNC.toast({ type: 'err', title: 'Не удалось скопировать', text: 'Браузер запретил доступ к буферу обмена. Выделите код в таблице вручную.' }));
    }
    if (action === 'restart') SNC.toast({ type: 'ok', title: 'Команда отправлена', text: `${s.name} перезапустит сервис при следующем сеансе связи.` });
    if (action === 'disable') askDisable([row]);
  });
  const selected = () => rows().filter(tr => $('.col-check input', tr)?.checked);
  $$('[data-bulk]', dt).forEach(b => b.addEventListener('click', () => {
    const sel = selected();
    if (b.dataset.bulk === 'disable') return askDisable(sel);
    if (b.dataset.bulk === 'restart') SNC.toast({ type: 'ok', title: `Команда отправлена на ${sel.length} ТО`, text: 'Сервис перезапустится при следующем сеансе связи.' });
    if (b.dataset.bulk === 'update') SNC.toast({ type: 'ok', title: `Обновление назначено на ${sel.length} ТО`, text: 'Установка — в ближайшую ночь после закрытия смены.' });
  }));
  $('[data-export]').addEventListener('click', () => SNC.toast({ type: 'info', title: 'Выгрузка готовится', text: `${dt.snc.visible.length} строк с учётом фильтров. Файл скачается автоматически.` })); // TODO: выгрузка на сервере

  /* ---------- Старт ---------- */
  kpis();
  apply();
  setView(store.get(VIEW_KEY) === 'map' ? 'map' : 'table');
  start();
})();
