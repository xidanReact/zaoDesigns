/* =========================================================
   СНК · zao.sncard.ru — главная
   Приёмы и утилиты перенесены из ../designs/main.js (его нельзя
   подключить напрямую: он рассчитан на hero-сцену и pinned-блок).
   Данные АЗС — stations.js. Без JS страница читаема.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg';
  const mq = q => window.matchMedia(q).matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Анимации включены всегда: системная настройка prefers-reduced-motion
  // (часто выключена «анимация Windows» на рабочих ПК) намеренно игнорируется
  const RM = false;
  const FINE = mq('(hover: hover) and (pointer: fine)');
  const SMALL = mq('(max-width: 640px)');
  const DESKTOP = () => mq('(min-width: 1025px)');
  const MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  /* Хуки слоя анимаций: заполняются ниже, если анимации включены */
  const FX = {};

  /* ---------- Единый rAF-тикер ---------- */
  const ticks = new Set();
  const onTick = fn => ticks.add(fn);
  let last = performance.now();
  const loop = now => {
    const dt = Math.min(now - last, 64) / 1000; last = now;
    ticks.forEach(f => f(dt, now / 1000));
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* ---------- Якорные ссылки ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#') { e.preventDefault(); return; }
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (target === 0) window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    else {
      target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
      target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
    }
  });

  /* =========================================================
     Шапка: сжатие и прогресс чтения
     ========================================================= */
  const header = $('#header');
  const progress = $('.header__progress span');
  let compact = false, lastP = -1;
  onTick(() => {
    const y = window.scrollY;
    const c = y > 40;
    if (c !== compact) { compact = c; header.classList.toggle('is-compact', c); }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? clamp(y / max, 0, 1) : 0;
    if (Math.abs(p - lastP) > 0.0005) { lastP = p; progress.style.transform = `scaleX(${p})`; }
  });

  /* ---------- Мобильное меню ---------- */
  const burger = $('.burger');
  const mmenu = $('#mobile-menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    if (open) {
      mmenu.style.setProperty('--mmenu-top', `${header.getBoundingClientRect().bottom}px`);
      mmenu.hidden = false;
      document.body.style.overflow = 'hidden';
      FX.menuIn?.();
    } else {
      mmenu.hidden = true;
      document.body.style.overflow = '';
      FX.menuOut?.();
    }
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  mmenu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* =========================================================
     2. Карта АЗС
     ========================================================= */
  /* Блока карты нет на внутренних страницах (news.html) — всё ниже включается только с ним */
  const DATA = window.SNK;
  const atlas = $('#map');
  const stage = atlas && $('.atlas__stage', atlas);
  const panel = atlas && $('.atlas__panel', atlas);
  const list = atlas && $('#station-list');
  const SIDES = ['right', 'left', 'top', 'bottom']; // стороны подписи у значка
  const CARD_FULL = { ibutton: 'электронные таблетки iButton', rfid: 'бесконтактные карты RFID' };
  const fuelName = f => (/^\d+$/.test(f) ? `АИ-${f}` : f);

  /* Значок АЗС: кольцо и колонка */
  function stationSVG(st, cls = 'mk__svg') {
    return `<svg class="${cls}" viewBox="-18 -18 36 36" aria-hidden="true">
      <circle class="mk__ring" r="12.5"/>
      <path class="mk__glyph" d="M-5 6v-11a1.5 1.5 0 0 1 1.5-1.5h4.5a1.5 1.5 0 0 1 1.5 1.5v11M-6.5 6h10M-3 -2.5h3.5M2.5 -1.5h1.6l1.4 1.4v4.3a1 1 0 0 0 2 0v-5.6l-1.8-1.8"/>
    </svg>`;
  }
  const HUB_SVG = `<svg class="mk__svg" viewBox="-18 -18 36 36" aria-hidden="true">
      <circle class="mk__hub-halo" r="16"/><circle class="mk__hub" r="9"/><circle class="mk__hub-in" r="3.4"/>
    </svg>`;

  const toDMS = (v, pos, neg) => {
    const a = Math.abs(v);
    let d = Math.floor(a), m = Math.floor((a - d) * 60), s = Math.round(((a - d) * 60 - m) * 60);
    if (s === 60) { s = 0; m++; } if (m === 60) { m = 0; d++; }
    return `${d}°${String(m).padStart(2, '0')}′${String(s).padStart(2, '0')}″ ${v >= 0 ? pos : neg}`;
  };
  const fmtLL = ll => `${toDMS(ll.lat, 'с. ш.', 'ю. ш.')} · ${toDMS(ll.lng, 'в. д.', 'з. д.')}`;

  const state = { cards: new Set(), active: null };
  const rows = new Map(); // id → { li, btn, more }
  const marks = new Map(); // id → { marker, link, el }

  /* ---------- Список ---------- */
  function renderList() {
    DATA.stations.forEach(st => {
      const li = document.createElement('li');
      li.className = 'station';
      li.dataset.id = st.id;
      const moreId = `st-more-${st.id}`;
      li.innerHTML = `
        <button class="station__btn" type="button" aria-expanded="false" aria-controls="${moreId}">
          <span class="station__icon">${stationSVG(st, 'station__svg')}</span>
          <span class="station__main">
            <span class="station__name">${esc(st.place)}<span class="station__num">${esc(st.num)}</span></span>
            <span class="station__addr">${esc(st.address)}</span>
            <span class="station__fuel" aria-label="Топливо: ${st.fuel.map(fuelName).join(', ')}">${st.fuel.map(f => `<span>${esc(f)}</span>`).join('')}</span>
          </span>
        </button>
        <div class="station__more" id="${moreId}" hidden>
          <dl class="station__dl">
            <div class="station__row"><dt>оператор</dt><dd>${esc(DATA.operators[st.operator])}</dd></div>
            <div class="station__row"><dt>топливо</dt><dd>${st.fuel.map(fuelName).join(', ')}</dd></div>
            <div class="station__row"><dt>карты</dt><dd>${st.cards.map(c => CARD_FULL[c]).join(', ')}</dd></div>
          </dl>
          ${st.approx ? '<p class="station__approx">Точка на карте приблизительная — ориентируйтесь на адрес.</p>' : ''}
          <div class="station__actions">
            <a class="btn btn--outline" href="https://yandex.ru/maps/?rtext=~${st.lat},${st.lng}&amp;rtt=auto" target="_blank" rel="noopener">
              <svg aria-hidden="true"><use href="#i-route"/></svg><span>Маршрут</span>
            </a>
          </div>
        </div>`;
      list.appendChild(li);
      const btn = $('.station__btn', li);
      rows.set(st.id, { li, btn, more: $('.station__more', li) });
      btn.addEventListener('click', () => select(state.active === st.id ? null : st.id, { fly: true }));
      li.addEventListener('pointerenter', () => hot(st.id, true));
      li.addEventListener('pointerleave', () => hot(st.id, false));
    });
    $('[data-count]').textContent = DATA.stations.length;
  }

  /* ---------- Фильтры по типу карты ---------- */
  const CARD_FILTERS = [
    { id: 'ibutton', name: 'Электронные таблетки iButton', note: 'самообслуживание' },
    { id: 'rfid', name: 'Бесконтактные пластиковые карты RFID Mifare Standart S50', note: 'сервисное обслуживание' }
  ];
  function renderFilters() {
    const row = $('[data-filter="cards"]');
    CARD_FILTERS.forEach(f => {
      const b = chip('cards', f.id, 'chip chip--card');
      b.innerHTML = `<span class="lg ${f.id === 'ibutton' ? 'lg--st' : 'lg--card'}" aria-hidden="true"></span>
        <span class="chip__text">${esc(f.name)}<small>${esc(f.note)}</small></span>`;
      row.appendChild(b);
    });
    $('.filters', atlas).insertAdjacentHTML('afterbegin', '<span class="filters__label">Какая у вас карта</span>');
  }
  function chip(key, value, cls) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      const on = !state[key].has(value);
      on ? state[key].add(value) : state[key].delete(value);
      b.setAttribute('aria-pressed', String(on));
      applyFilters();
    });
    return b;
  }

  const matches = st => {
    // карты — по «или»: АЗС принимает хотя бы одну из отмеченных
    if (state.cards.size && !st.cards.some(c => state.cards.has(c))) return false;
    return true;
  };

  function applyFilters() {
    const before = FX.flipFirst?.();
    let shown = 0;
    DATA.stations.forEach(st => {
      const ok = matches(st);
      if (ok) shown++;
      rows.get(st.id).li.hidden = !ok;
      const m = marks.get(st.id);
      if (m) { m.el?.classList.toggle('is-off', !ok); m.link.getElement()?.classList.toggle('is-off', !ok); }
      if (!ok && state.active === st.id) select(null);
    });
    const total = DATA.stations.length;
    const filtered = state.cards.size;
    $('[data-shown]').textContent = filtered ? `Показано ${shown} из ${total}` : '';
    $('[data-empty]').hidden = shown > 0;
    FX.flipPlay?.(before);
  }

  $('[data-reset]')?.addEventListener('click', () => {
    state.cards.clear();
    $$('.chip', atlas).forEach(c => c.setAttribute('aria-pressed', 'false'));
    applyFilters();
  });

  /* ---------- Подсветка и выбор ---------- */
  function hot(id, on) {
    rows.get(id)?.li.classList.toggle('is-hot', on);
    const m = marks.get(id);
    if (!m) return;
    m.el?.classList.toggle('is-hot', on);
    m.link.getElement()?.classList.toggle('is-hot', on || state.active === id);
    if (on) m.marker.setZIndexOffset(1000); else if (state.active !== id) m.marker.setZIndexOffset(0);
  }

  let map = null, hubMarker = null;
  function select(id, { fly = false } = {}) {
    const prev = state.active;
    if (prev && rows.get(prev)) {
      const r = rows.get(prev);
      r.li.classList.remove('is-active'); r.btn.setAttribute('aria-expanded', 'false'); r.more.hidden = true;
      const m = marks.get(prev);
      if (m) { m.el?.classList.remove('is-active'); m.link.getElement()?.classList.remove('is-hot'); m.marker.setZIndexOffset(0); }
    }
    state.active = id;
    if (!id) return;
    const r = rows.get(id);
    r.li.classList.add('is-active'); r.btn.setAttribute('aria-expanded', 'true'); r.more.hidden = false;
    FX.more?.(r.more);
    const m = marks.get(id);
    if (m) { m.el?.classList.add('is-active'); m.link.getElement()?.classList.add('is-hot'); m.marker.setZIndexOffset(1000); }
    if (fly && map) flyToStation(DATA.stations.find(s => s.id === id));
  }

  /* Видимая часть карты: на десктопе слева её закрывает панель */
  function visibleOffsetX() {
    if (!DESKTOP()) return 0;
    const sr = stage.getBoundingClientRect(), pr = panel.getBoundingClientRect();
    return (pr.right - sr.left) / 2;
  }
  function flyToStation(st) {
    const z = Math.max(map.getZoom(), 11);
    const pt = map.project([st.lat, st.lng], z).subtract([visibleOffsetX(), 0]);
    const c = map.unproject(pt, z);
    if (RM) map.setView(c, z, { animate: false });
    else map.flyTo(c, z, { duration: 1.1 });
  }

  /* ---------- Подложка-чертёж (basemap.js, Natural Earth) ---------- */
  const flip = c => c.map(p => [p[1], p[0]]);
  function drawBasemap(L) {
    const B = window.SNK_BASEMAP;
    if (!B) return;
    map.createPane('base'); map.getPane('base').style.zIndex = 250;
    map.createPane('baseLabels'); map.getPane('baseLabels').style.zIndex = 420;
    const renderer = L.svg({ pane: 'base', padding: 0.5 });
    const opt = cls => ({ pane: 'base', renderer, className: cls, interactive: false, smoothFactor: 1.2 });
    if (B.region) L.polygon(flip(B.region), opt('bm-region')).addTo(map);
    B.roads.forEach(r => L.polyline(flip(r.c), opt(r.w ? 'bm-road bm-road--main' : 'bm-road')).addTo(map));
    B.rivers.forEach(r => L.polyline(flip(r.c), opt(r.w ? 'bm-river bm-river--main' : 'bm-river')).addTo(map));
    B.borders.forEach(c => L.polyline(flip(c), opt('bm-border')).addTo(map));

    // Подписи: города (кроме тех, где уже стоит значок АЗС или офис), реки, области
    const taken = new Set(['Томск', ...DATA.stations.map(s => s.place)]);
    const placeMarks = [];
    B.places.filter(p => !taken.has(p.t)).forEach(p => {
      const m = L.marker(p.ll, {
        pane: 'baseLabels', interactive: false, keyboard: false,
        icon: L.divIcon({ className: 'bm-place', iconSize: [6, 6], iconAnchor: [3, 3], html: `<span>${esc(p.t)}</span>` })
      }).addTo(map);
      placeMarks.push({ m, r: p.r });
    });
    B.labels.forEach(l => {
      L.marker(l.ll, {
        pane: 'baseLabels', interactive: false, keyboard: false,
        icon: L.divIcon({ className: `bm-label${l.k ? ` bm-label--${l.k}` : ''}`, iconSize: [0, 0],
          html: `<span style="transform:translate(-50%,-50%) rotate(${l.a}deg)">${esc(l.t)}</span>` })
      }).addTo(map);
    });
    const byZoom = () => {
      const z = map.getZoom();
      placeMarks.forEach(({ m, r }) => { const el = m.getElement(); if (el) el.hidden = r > z + 0.5; });
    };
    map.on('zoomend', byZoom);
    map.whenReady(byZoom);
    map.setMaxBounds(L.latLngBounds(B.bounds).pad(0.05));
    map.attributionControl.addAttribution('Подложка: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>');
  }

  /* ---------- Leaflet ---------- */
  function initMap() {
    const L = window.L;
    if (!L) {
      $('#atlas-map').innerHTML = '<p class="atlas__fail">Карта не загрузилась. Все АЗС — в списке.</p>';
      $('.atlas__zoom', atlas).remove(); $('.atlas__hud', atlas).remove();
      return;
    }
    map = L.map('atlas-map', {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
      dragging: FINE,          // на тач-экранах одним пальцем листается страница
      touchZoom: true,
      tap: false,
      zoomSnap: 0.25, zoomDelta: 0.5,
      minZoom: 5, maxZoom: 12,
      keyboard: true, keyboardPanDelta: 120
    });
    map.attributionControl.setPrefix(false);
    // Кадр: все точки, с учётом панели и легенды
    const fit = () => {
      const pts = [[DATA.office.lat, DATA.office.lng], ...DATA.stations.map(s => [s.lat, s.lng])];
      const sr = stage.getBoundingClientRect();
      let tl = [48, 64], br = [48, 64];
      if (DESKTOP()) {
        const pr = panel.getBoundingClientRect();
        const lg = $('.legend-card', atlas).getBoundingClientRect();
        tl = [pr.right - sr.left + 72, 72];
        br = [Math.min(lg.width + 64, 360), 72];
      }
      map.fitBounds(pts, { paddingTopLeft: tl, paddingBottomRight: br, animate: false });
    };
    fit();
    drawBasemap(L);

    const O = DATA.office;
    const hubLL = [O.lat, O.lng];

    // Линии связи: процессинговый центр → АЗС
    DATA.stations.forEach(st => {
      const link = L.polyline([hubLL, [st.lat, st.lng]], { className: 'mk-link', interactive: false, smoothFactor: 1 }).addTo(map);
      marks.set(st.id, { link });
    });

    // Центр
    const hub = L.marker(hubLL, {
      icon: L.divIcon({ className: 'mk-icon mk-icon--hub', iconSize: [36, 36], iconAnchor: [18, 18],
        html: `<div class="mk mk--hub"><span class="mk__pulse" aria-hidden="true"></span>${HUB_SVG}<span class="mk__label">Офис СНК<small>Томск</small></span></div>` }),
      keyboard: false, zIndexOffset: 500
    }).addTo(map);
    hubMarker = hub;

    // АЗС
    DATA.stations.forEach(st => {
      const marker = L.marker([st.lat, st.lng], {
        icon: L.divIcon({ className: 'mk-icon', iconSize: [36, 36], iconAnchor: [18, 18],
          html: `<div class="mk"><svg class="mk__leader" aria-hidden="true"><line/></svg><div class="mk__body">${stationSVG(st)}<span class="mk__label">${esc(st.place)}<small>${esc(st.num)} · ${st.fuel.join(' ')}</small><span class="mk__spec"><span>${esc(st.address)}</span></span></span></div></div>` }),
        keyboard: true, riseOnHover: true
      }).addTo(map);
      const el = marker.getElement();
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', `${st.num}, ${st.place}: ${st.address}`);
      Object.assign(marks.get(st.id), { marker, el });
      marker.on('click', () => {
        const next = state.active === st.id ? null : st.id;
        select(next, { fly: !!next });
        if (next) rows.get(st.id).li.scrollIntoView({ block: 'nearest', behavior: RM ? 'auto' : 'smooth' });
      });
      marker.on('mouseover', () => hot(st.id, true));
      marker.on('mouseout', () => hot(st.id, false));
      el.addEventListener('focus', () => hot(st.id, true));
      el.addEventListener('blur', () => hot(st.id, false));
    });

    map.on('click', () => select(null));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.active) select(null); });


    // Масштаб по Ctrl/⌘ + колесо (и жест щипка на тачпаде)
    const hint = $('[data-hint]');
    let hintT = null;
    const showHint = text => {
      hint.textContent = text; hint.classList.add('is-on');
      clearTimeout(hintT); hintT = setTimeout(() => hint.classList.remove('is-on'), 1400);
    };
    stage.addEventListener('wheel', e => {
      if (e.target.closest('.legend-card')) return;
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const z = map.getZoom() - clamp(e.deltaY, -100, 100) / (e.deltaMode ? 3 : 120);
        map.setZoomAround(map.mouseEventToContainerPoint(e), clamp(z, map.getMinZoom(), map.getMaxZoom()), { animate: false });
      } else {
        showHint(MAC ? 'Масштаб — ⌘ + прокрутка' : 'Масштаб — Ctrl + колесо мыши');
      }
    }, { passive: false });
    if (!FINE) {
      stage.addEventListener('touchstart', e => { if (e.touches.length === 1 && !e.target.closest('.legend-card, .atlas__zoom')) showHint('Двумя пальцами — перемещение и масштаб'); }, { passive: true });
    }
    $$('[data-zoom]', atlas).forEach(b => b.addEventListener('click', () => map.setZoom(map.getZoom() + Number(b.dataset.zoom))));

    // Координатная рамка, масштабная линейка, координаты курсора
    const tx = $('.atlas__ticks--x', atlas), ty = $('.atlas__ticks--y', atlas), frame = $('.atlas__frame', atlas);
    const coords = $('[data-coords]'), scale = $('[data-scale]');
    const STEPS = [0.05, 0.1, 0.25, 0.5, 1, 2, 5];
    const fmtDeg = v => {
      const d = Math.floor(v + 1e-9), m = Math.round((v - d) * 60);
      return m ? `${d}°${String(m).padStart(2, '0')}′` : `${d}°`;
    };
    const niceKm = m => {
      const km = m / 1000;
      const p = Math.pow(10, Math.floor(Math.log10(km)));
      const n = [5, 2, 1].map(k => k * p).find(v => v <= km) || p;
      return n;
    };
    let rafFrame = 0;
    const drawFrame = () => {
      rafFrame = 0;
      const inset = frame.offsetLeft;
      const w = frame.clientWidth, h = frame.clientHeight;
      const b = map.getBounds();
      const pick = (span, px) => STEPS.find(s => span / s <= px / 150) || 5;
      let htmlX = '', htmlY = '', lines = '';
      const sLon = pick(b.getEast() - b.getWest(), w);
      for (let lon = Math.ceil(b.getWest() / sLon) * sLon; lon <= b.getEast(); lon += sLon) {
        const x = map.latLngToContainerPoint([b.getCenter().lat, lon]).x - inset;
        if (x < 24 || x > w - 24) continue;
        htmlX += `<span class="tick" style="left:${x.toFixed(1)}px"><span>${fmtDeg(lon)}</span></span>`;
        lines += `<i class="gridline gridline--x" style="left:${x.toFixed(1)}px"></i>`;
      }
      const sLat = pick(b.getNorth() - b.getSouth(), h);
      for (let lat = Math.ceil(b.getSouth() / sLat) * sLat; lat <= b.getNorth(); lat += sLat) {
        const y = map.latLngToContainerPoint([lat, b.getCenter().lng]).y - inset;
        if (y < 24 || y > h - 24) continue;
        htmlY += `<span class="tick" style="top:${y.toFixed(1)}px"><span>${fmtDeg(lat)}</span></span>`;
        lines += `<i class="gridline gridline--y" style="top:${y.toFixed(1)}px"></i>`;
      }
      tx.innerHTML = htmlX; ty.innerHTML = htmlY;
      $$('.gridline', frame).forEach(n => n.remove());
      frame.insertAdjacentHTML('beforeend', lines);

      if (scale) {
        const cy = map.getSize().y / 2;
        const m100 = map.distance(map.containerPointToLatLng([0, cy]), map.containerPointToLatLng([100, cy]));
        const km = niceKm(m100 * 1.2);
        const px = km * 1000 / m100 * 100;
        scale.style.setProperty('--sw', `${px.toFixed(0)}px`);
        $('b', scale).textContent = km >= 1 ? `${km} км` : `${km * 1000} м`;
      }
      declutter();
    };
    const queue = () => { if (!rafFrame) rafFrame = requestAnimationFrame(drawFrame); };
    map.on('move zoom resize', queue);
    drawFrame();

    if (coords) {
      coords.textContent = fmtLL(L.latLng(hubLL));
      map.on('mousemove', e => { coords.textContent = fmtLL(e.latlng); });
      map.on('mouseout', () => { coords.textContent = fmtLL(map.getCenter()); });
    }

    /* Выноски: близкие значки разводятся, от настоящей точки тянется линия */
    function declutter() {
      const R = 40;
      const nodes = [{ p: map.latLngToLayerPoint(hubLL), o: { x: 0, y: 0 }, fixed: true }];
      DATA.stations.forEach(st => nodes.push({ id: st.id, p: map.latLngToLayerPoint([st.lat, st.lng]), o: { x: 0, y: 0 } }));
      for (let it = 0; it < 40; it++) {
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = (b.p.x + b.o.x) - (a.p.x + a.o.x), dy = (b.p.y + b.o.y) - (a.p.y + a.o.y);
          let d = Math.hypot(dx, dy);
          if (d >= R) continue;
          if (d < 0.01) { dx = 0.6; dy = -0.8; d = 1; }
          const push = (R - d) / (a.fixed || b.fixed ? 1 : 2);
          const ux = dx / d, uy = dy / d;
          if (!a.fixed) { a.o.x -= ux * push; a.o.y -= uy * push; }
          if (!b.fixed) { b.o.x += ux * push; b.o.y += uy * push; }
        }
      }
      nodes.forEach(n => {
        if (!n.id) return;
        const m = marks.get(n.id);
        const body = $('.mk__body', m.el), leader = $('.mk__leader', m.el), ln = $('line', leader);
        const has = Math.hypot(n.o.x, n.o.y) > 1;
        body.style.transform = has ? `translate(${n.o.x.toFixed(1)}px, ${n.o.y.toFixed(1)}px)` : '';
        m.el.classList.toggle('has-leader', has);
        if (has) {
          ln.setAttribute('x1', 18); ln.setAttribute('y1', 18);
          ln.setAttribute('x2', (18 + n.o.x).toFixed(1)); ln.setAttribute('y2', (18 + n.o.y).toFixed(1));
        }
      });
      placeLabels(nodes);
    }

    /* Подписи: для каждого значка — сторона без пересечений (жадно, по приоритету) */
    function placeLabels(nodes) {
      const G = 22, pad = 4;
      const items = nodes.map(n => {
        const el = n.id ? marks.get(n.id).el : hub.getElement();
        const lab = $('.mk__label', el);
        return { n, el, w: lab.offsetWidth, h: lab.offsetHeight, c: { x: n.p.x + n.o.x, y: n.p.y + n.o.y } };
      });
      const placed = items.map(it => ({ x: it.c.x - 16, y: it.c.y - 16, w: 32, h: 32 })); // значки
      const rectFor = (it, side) => {
        const { c, w, h } = it;
        if (side === 'right') return { x: c.x + G, y: c.y - h / 2, w, h };
        if (side === 'left') return { x: c.x - G - w, y: c.y - h / 2, w, h };
        if (side === 'top') return { x: c.x - w / 2, y: c.y - G - h, w, h };
        return { x: c.x - w / 2, y: c.y + G, w, h };
      };
      const overlap = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) + pad) *
                                Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) + pad);
      // приоритет: центр, выбранная АЗС, остальные
      const order = items.slice().sort((a, b) => (a.n.fixed ? -2 : a.n.id === state.active ? -1 : 0) - (b.n.fixed ? -2 : b.n.id === state.active ? -1 : 0));
      order.forEach(it => {
        const own = items.indexOf(it);
        // предпочитаем сторону, куда значок отодвинут
        const pref = Math.abs(it.n.o.x) > Math.abs(it.n.o.y) ? (it.n.o.x < 0 ? 'left' : 'right') : it.n.o.y < -1 ? 'top' : it.n.o.y > 1 ? 'bottom' : 'right';
        const sides = [pref, ...SIDES.filter(s => s !== pref)];
        let best = sides[0], bestScore = Infinity, bestRect = null;
        for (const s of sides) {
          const r = rectFor(it, s);
          let score = 0;
          placed.forEach((p, k) => { if (k !== own) score += overlap(r, p); });
          if (score < bestScore) { bestScore = score; best = s; bestRect = r; }
          if (score === 0) break;
        }
        placed.push(bestRect);
        SIDES.forEach(s => it.el.classList.toggle(`lbl-${s}`, s === best));
      });
    }

    // Пересчёт кадра при смене раскладки
    let lastDesk = DESKTOP();
    window.addEventListener('resize', () => {
      map.invalidateSize({ animate: false });
      if (DESKTOP() !== lastDesk) { lastDesk = DESKTOP(); fit(); }
    });
  }

  if (DATA && list) {
    if (SMALL) $('.legend-card', atlas)?.removeAttribute('open');
    renderList();
    renderFilters();
    applyFilters();
    initMap();
  }

  /* =========================================================
     5. Контакты: копирование
     ========================================================= */
  const live = document.createElement('p');
  live.className = 'sr-only'; live.setAttribute('role', 'status');
  document.body.appendChild(live);
  $$('[data-copy]').forEach(btn => {
    let t = null;
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try { await navigator.clipboard.writeText(text); }
      catch (e) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (err) { /* ignore */ }
        ta.remove();
      }
      btn.classList.add('is-done');
      live.textContent = `Скопировано: ${text}`;
      clearTimeout(t); t = setTimeout(() => btn.classList.remove('is-done'), 1600);
    });
  });

  /* =========================================================
     Футер: форма рассылки (из designs/, имитация без бэкенда)
     ========================================================= */
  (function subscribeForm() {
    const form = $('#subscribe');
    if (!form) return;
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
      timer = setTimeout(() => {
        btn.dataset.state = 'success';
        status.textContent = `Подписка оформлена: письма будут приходить на ${email}`;
      }, 1300);
    });

    form.addEventListener('reset', () => {
      clearTimeout(timer); clearErr();
      btn.dataset.state = 'idle'; status.textContent = '';
    });
  })();

  /* =========================================================
     Слой анимаций: GSAP 3 + ScrollTrigger + CustomEase, Lenis.
     Утилиты — из ../designs/main.js. Без библиотек
     всё остаётся в финальном состоянии.
     ========================================================= */
  const G = window.gsap;
  const ST = window.ScrollTrigger;
  let EASE = 'expo.out';
  if (G) {
    G.registerPlugin(...[ST, window.CustomEase].filter(Boolean));
    if (window.CustomEase) { window.CustomEase.create('brief', '0.22,1,0.36,1'); EASE = 'brief'; }
  }
  const DRAW = 'power2.inOut'; // прорисовка линии — движение на экране
  const EZ = 'cubic-bezier(0.22, 1, 0.36, 1)'; // та же кривая для WAAPI
  const MOTION = !!(G && ST && !RM);
  const damp = (k, dt) => 1 - Math.exp(-k * dt);

  /* ---------- Видимость (пауза циклов вне экрана) ---------- */
  const visible = new WeakMap();
  const vio = new IntersectionObserver(es => es.forEach(e => visible.set(e.target, e.isIntersecting)), { rootMargin: '80px' });
  const watch = el => { if (el) { visible.set(el, true); vio.observe(el); } return el; };
  const isVis = el => visible.get(el) !== false;

  /* ---------- Индикатор активного пункта меню (scroll-spy + FLIP) ---------- */
  (function navSpy() {
    const navList = $('.nav__list');
    if (!navList) return;
    const bar = document.createElement('span');
    bar.className = 'nav__bar'; bar.setAttribute('aria-hidden', 'true');
    navList.appendChild(bar);
    const links = $$('.nav__link', navList);
    // На внутренних страницах пункты ведут на index.html#… — следить не за чем,
    // индикатор просто встаёт под текущий раздел (aria-current="page")
    const secs = links.map(a => {
      const href = a.getAttribute('href') || '';
      return href.startsWith('#') ? $(href) : null;
    });
    let cur = null;
    const place = a => {
      const lr = navList.getBoundingClientRect(), r = a.getBoundingClientRect();
      bar.style.transform = `translateX(${(r.left - lr.left + 14).toFixed(1)}px) scaleX(${((r.width - 28) / 100).toFixed(3)})`;
    };
    const jump = a => { bar.style.transition = 'none'; place(a); void bar.offsetWidth; bar.style.transition = ''; };
    const move = (a, mark = true) => {
      if (a === cur) return;
      const first = !cur;
      cur = a;
      if (mark) links.forEach(l => (l === a ? l.setAttribute('aria-current', 'location') : l.removeAttribute('aria-current')));
      first ? jump(a) : place(a);
      bar.classList.add('is-on');
    };
    const current = links.find(a => a.getAttribute('aria-current') === 'page');
    if (current) move(current, false);
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { const i = secs.indexOf(e.target); if (i > -1) move(links[i]); }
    }), { rootMargin: '-40% 0px -55% 0px' });
    secs.forEach(sec => sec && spy.observe(sec));
    window.addEventListener('resize', () => { if (cur) jump(cur); });
    document.fonts?.ready.then(() => { if (cur) jump(cur); });
  })();

  if (!MOTION) {
    // Финальные состояния: рельс истории заполнен, узлы отмечены
    $('#intro')?.remove();
    const tlEl = $('.timeline');
    if (tlEl) { tlEl.style.setProperty('--rail', 1); $$('.tl', tlEl).forEach(t => t.classList.add('is-on')); }
    return;
  }

  /* ---------- Плавный скролл ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, allowNestedScroll: true });
    lenis.on('scroll', ST.update);
    onTick((dt, t) => lenis.raf(t * 1000));
    // якоря — через Lenis (перехват раньше обработчика без анимаций)
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.stopImmediatePropagation();
      e.preventDefault();
      lenis.scrollTo(target, { offset: target === 0 ? 0 : -64, duration: 1.2 });
      if (target !== 0) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    }, true);
  }

  /* ---------- Утилиты (из designs/) ---------- */
  function splitWords(el) {
    const inners = [];
    const wrap = node => {
      const w = document.createElement('span'); w.className = 'w';
      const i = document.createElement('span'); i.className = 'w__in';
      w.appendChild(i);
      if (node.parentNode) node.parentNode.insertBefore(w, node);
      i.appendChild(node);
      inners.push(i);
      return w;
    };
    const walk = parent => {
      Array.from(parent.childNodes).forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/([ \t\n]+)/).forEach(part => {
            if (!part) return;
            if (/^[ \t\n]+$/.test(part)) frag.appendChild(document.createTextNode(' '));
            else frag.appendChild(wrap(document.createTextNode(part)));
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.namespaceURI !== NS) walk(n);
      });
    };
    walk(el);
    return inners;
  }
  function lineReveal(el, opts = {}) {
    const inners = splitWords(el);
    const tops = [];
    const lineOf = inners.map(i => {
      const top = Math.round(i.parentNode.offsetTop);
      let idx = tops.findIndex(t => Math.abs(t - top) < 8);
      if (idx === -1) { tops.push(top); idx = tops.length - 1; }
      return idx;
    });
    return G.fromTo(inners, { yPercent: 118 }, {
      yPercent: 0, duration: opts.duration || 0.9, ease: EASE,
      stagger: i => lineOf[i] * (opts.each || 0.08)
    });
  }
  function explodePath(path) {
    const parts = path.getAttribute('d').split(/(?=M)/).map(x => x.trim()).filter(Boolean);
    const out = parts.map(d => { const q = path.cloneNode(false); q.setAttribute('d', d); path.parentNode.insertBefore(q, path); return q; });
    path.remove();
    return out;
  }
  function collectDraw(targets) {
    const lines = [], fills = [], fades = [];
    targets.forEach(root => {
      if (!root) return;
      const shapes = root.matches('path,rect,ellipse,circle,line,polyline,text') ? [root] : $$('path,rect,ellipse,circle,line,polyline,text', root);
      shapes.forEach(el => {
        const cs = getComputedStyle(el);
        if (el.tagName === 'text') { fades.push(el); return; }
        const stroked = cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0;
        const dashed = cs.strokeDasharray && cs.strokeDasharray !== 'none';
        if (stroked && !dashed && el.getTotalLength) {
          lines.push({ el, L: Math.ceil(el.getTotalLength()) + 1 });
          if (cs.fill !== 'none' && !/url/.test(cs.fill)) fills.push(el);
        } else fades.push(el);
      });
    });
    return { lines, fills, fades };
  }
  function drawInto(tl, set, at, dur = 0.7) {
    set.lines.forEach(({ el, L }) => {
      tl.fromTo(el, { strokeDasharray: L, strokeDashoffset: L },
        { strokeDashoffset: 0, duration: dur, ease: DRAW, clearProps: 'strokeDasharray,strokeDashoffset' }, at);
    });
    if (set.fills.length) tl.fromTo(set.fills, { fillOpacity: 0 }, { fillOpacity: 1, duration: dur * 0.6, ease: 'power1.out' }, at + dur * 0.5);
    if (set.fades.length) tl.fromTo(set.fades, { opacity: 0 }, { opacity: 1, duration: dur * 0.7, ease: 'power1.out' }, at + dur * 0.3);
  }

  /* ---------- Реакции интерфейса ---------- */
  FX.more = el => el.animate(
    [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }],
    { duration: 220, easing: EZ });

  // FLIP списка АЗС при фильтрации
  FX.flipFirst = () => {
    const m = new Map();
    rows.forEach(r => { if (!r.li.hidden) m.set(r.li, r.li.getBoundingClientRect()); });
    return m;
  };
  FX.flipPlay = before => {
    if (!before) return;
    let k = 0;
    rows.forEach(r => {
      const li = r.li;
      if (li.hidden) return;
      const now = li.getBoundingClientRect();
      const was = before.get(li);
      if (was) {
        const dx = was.left - now.left, dy = was.top - now.top;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) li.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 260, easing: EZ });
      } else {
        li.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: EZ, delay: 40 + 40 * k++, fill: 'backwards' });
      }
    });
  };

  // Мобильное меню: пункты каскадом
  FX.menuIn = () => {
    G.fromTo(mmenu, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' });
    G.fromTo($$('.mmenu__list > li, .mmenu__foot', mmenu), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: EASE });
    lenis?.stop();
  };
  FX.menuOut = () => lenis?.start();

  /* =========================================================
     Карта: проявление от Томска и поток транзакций
     ========================================================= */
  function hubPulse() {
    const ring = hubMarker && $('.mk__pulse', hubMarker.getElement());
    let lastT = 0;
    return () => {
      const now = performance.now();
      if (!ring || now - lastT < 900) return;
      lastT = now;
      ring.animate([{ transform: 'scale(.6)', opacity: 0.6 }, { transform: 'scale(2.2)', opacity: 0 }], { duration: 1000, easing: EZ });
    };
  }

  // Пакеты данных бегут от АЗС к процессинговому центру
  function startPackets() {
    const wrap = document.createElement('div');
    wrap.className = 'atlas__packets'; wrap.setAttribute('aria-hidden', 'true');
    stage.insertBefore(wrap, $('.atlas__frame', atlas));
    const hubLL = window.L.latLng(DATA.office.lat, DATA.office.lng);
    const per = SMALL ? 1 : 2;
    const items = [];
    DATA.stations.forEach((st, i) => {
      for (let k = 0; k < per; k++) {
        const el = document.createElement('i'); el.className = 'pkt'; wrap.appendChild(el);
        items.push({ st, el, t: (k / per + i * 0.17) % 1, v: 64 + ((i * 37 + k * 53) % 40) });
      }
    });
    let zooming = false, alpha = 0;
    map.on('zoomstart', () => { zooming = true; alpha = 0; wrap.style.opacity = 0; });
    map.on('zoomend', () => { zooming = false; });
    const pulse = hubPulse();
    onTick(dt => {
      if (zooming || !isVis(atlas)) return;
      if (alpha < 1) { alpha = Math.min(1, alpha + dt * 1.6); wrap.style.opacity = alpha.toFixed(2); }
      const hp = map.latLngToContainerPoint(hubLL);
      for (const it of items) {
        const sp = map.latLngToContainerPoint([it.st.lat, it.st.lng]);
        const len = Math.hypot(hp.x - sp.x, hp.y - sp.y);
        if (rows.get(it.st.id).li.hidden || len < 28) { if (it.el.style.opacity !== '0') it.el.style.opacity = 0; continue; }
        it.t += dt * it.v / len;
        if (it.t >= 1) { it.t -= 1; pulse(); }
        const x = sp.x + (hp.x - sp.x) * it.t, y = sp.y + (hp.y - sp.y) * it.t;
        it.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        it.el.style.opacity = clamp(Math.min(it.t, 1 - it.t) / 0.12, 0, 1).toFixed(2);
      }
    });
  }

  // Единственный оркестрованный момент: волна от офиса проявляет лист,
  // АЗС зажигаются в тот момент, когда до них доходит фронт
  function mapReveal() {
    if (!atlas) return G.timeline(); // страница без карты: пустая раскадровка
    const head = $('.atlas__title', atlas);
    const panelParts = [$('.atlas__lead', atlas), $('.atlas__tools', atlas), ...$$('.station', atlas).filter(li => !li.hidden)].filter(Boolean);
    const tl = G.timeline({ paused: true, defaults: { ease: EASE } });
    G.set(panelParts, { opacity: 0, y: 12 });
    if (DESKTOP()) { G.set(panel, { opacity: 0, x: -16 }); tl.to(panel, { opacity: 1, x: 0, duration: 0.8, clearProps: 'transform,opacity' }, 0); }
    tl.add(lineReveal(head), 0.05);
    tl.to(panelParts, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, clearProps: 'transform,opacity' }, 0.3);
    if (!map) return tl;

    const hubLL = [DATA.office.lat, DATA.office.lng];
    const size = map.getSize();
    const hc = map.latLngToContainerPoint(hubLL);
    const hl = map.latLngToLayerPoint(hubLL);
    const far = Math.max(...[[0, 0], [size.x, 0], [0, size.y], [size.x, size.y]].map(([x, y]) => Math.hypot(x - hc.x, y - hc.y)));
    const panes = [map.getPane('base'), map.getPane('overlayPane')].filter(Boolean);
    const clip = { r: 0 };
    const applyClip = () => panes.forEach(pn => { pn.style.clipPath = `circle(${clip.r.toFixed(1)}px at ${hl.x.toFixed(1)}px ${hl.y.toFixed(1)}px)`; });
    applyClip();

    const wave = document.createElementNS(NS, 'svg');
    wave.setAttribute('class', 'atlas__wave'); wave.setAttribute('aria-hidden', 'true');
    wave.innerHTML = `<circle cx="${hc.x.toFixed(1)}" cy="${hc.y.toFixed(1)}" r="0"/>`;
    stage.insertBefore(wave, $('.atlas__frame', atlas));
    const ring = wave.firstChild;

    const labels = map.getPane('baseLabels');
    const hubEl = $('.mk', hubMarker.getElement());
    const sts = DATA.stations.map(st => {
      const m = marks.get(st.id);
      const q = map.latLngToContainerPoint([st.lat, st.lng]);
      return { mk: $('.mk', m.el), d: Math.hypot(q.x - hc.x, q.y - hc.y) };
    });
    const ui = $$('.atlas__frame, .legend-card, .atlas__hud, .atlas__zoom', atlas);
    const marksEls = [hubEl, ...sts.map(x => x.mk)];
    G.set(labels, { opacity: 0 });
    G.set(marksEls, { opacity: 0, scale: 0.9 });
    G.set(ui, { opacity: 0 });
    map.dragging.disable(); // пока идёт проявление, кадр не сдвигается

    const SPREAD = 1.4, AT = 0.25;
    const inv = y => (y < 0.5 ? Math.sqrt(y / 2) : 1 - Math.sqrt((1 - y) / 2)); // обратная к power2.inOut
    tl.to(hubEl, { opacity: 1, scale: 1, duration: 0.5 }, 0.15);
    tl.add(hubPulse(), 0.2);
    tl.to(clip, { r: far, duration: SPREAD, ease: 'power2.inOut', onUpdate: applyClip }, AT);
    tl.fromTo(ring, { attr: { r: 0 }, opacity: 0.8 }, { attr: { r: far }, opacity: 0, duration: SPREAD, ease: 'power2.inOut' }, AT);
    sts.forEach(x => tl.to(x.mk, { opacity: 1, scale: 1, duration: 0.5 }, AT + SPREAD * inv(Math.min(x.d / far, 1))));
    tl.to(labels, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0.9);
    tl.to(ui, { opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power1.out' }, 1.0);
    tl.eventCallback('onComplete', () => {
      panes.forEach(pn => { pn.style.clipPath = ''; });
      wave.remove();
      G.set([...marksEls, labels, ...ui], { clearProps: 'opacity,transform,scale' });
      if (FINE) map.dragging.enable();
      startPackets();
    });
    return tl;
  }

  /* ---------- Вступление (из designs/) ---------- */
  function runIntro(onReveal) {
    const intro = $('#intro');
    let seen = false;
    try { seen = sessionStorage.getItem('snk-intro') === '1'; } catch (e) { /* storage недоступен */ }
    if (seen || !intro) { intro?.remove(); onReveal(); return; }
    try { sessionStorage.setItem('snk-intro', '1'); } catch (e) { /* ignore */ }

    intro.classList.add('is-on');
    lenis?.stop();
    const svg = $('.intro__mark', intro);
    const strokes = explodePath($('.intro__stroke', intro));
    const cols = $$('.intro__cols i', intro);
    cols.forEach(c => { c.style.backgroundPosition = `${-c.offsetLeft}px 0`; });
    let revealed = false;
    const reveal = () => { if (!revealed) { revealed = true; onReveal(); } };
    const finish = () => { intro.remove(); lenis?.start(); };

    strokes.forEach(pth => { const L = pth.getTotalLength() + 1; G.set(pth, { strokeDasharray: L, strokeDashoffset: L }); });
    const tl = G.timeline({ onComplete: finish });
    tl.to(strokes, { strokeDashoffset: 0, duration: 0.5, stagger: 0.08, ease: DRAW }, 0)
      .to(cols, { '--ly': 1, duration: 0.6, stagger: { each: 0.04, from: 'center' }, ease: EASE }, 0.3)
      .to('.intro__h', { scaleX: 1, duration: 0.7, ease: EASE }, 0.3)
      .to(svg, { opacity: 0, y: -8, duration: 0.3, ease: 'power2.out' }, 1.0)
      .to('.intro__h, .intro__hint', { opacity: 0, duration: 0.2 }, 1.05)
      .add(reveal, 1.1)
      .to(cols, { yPercent: -101, duration: 0.7, stagger: 0.04, ease: 'expo.inOut' }, 1.1);
    const skip = () => {
      reveal();
      if (tl.time() < 1.1) tl.seek(1.1, true);
      tl.timeScale(1.6);
      intro.style.pointerEvents = 'none';
    };
    intro.addEventListener('click', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
  }

  /* =========================================================
     О компании
     ========================================================= */
  // Одна транзакция: пакет идёт карта → АЗС → процессинг → кабинет, узлы вспыхивают по приходу
  function flowFx() {
    const svg = $('.flow__svg');
    if (!svg) return;
    watch(svg);
    const nodes = $$('.flow__node', svg);
    const tl = G.timeline({ paused: true });
    nodes.forEach((n, i) => drawInto(tl, collectDraw([n]), i * 0.22, 0.6));
    tl.fromTo($$('.data', svg), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.22, ease: 'power1.out' }, 0.35);
    drawInto(tl, collectDraw([$('.dim', svg), $('.bp-coord', svg)]), 0.9, 0.6);
    ST.create({ trigger: svg, start: 'top 80%', once: true, onEnter: () => tl.play() });

    const segs = ['#flow-1', '#flow-2', '#flow-3'].map(id => $(id, svg));
    const lens = segs.map(sg => sg.getTotalLength());
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('r', 4); dot.setAttribute('class', 'packet'); dot.style.opacity = 0;
    $('.flow__packets', svg).appendChild(dot);
    let running = false, seg = 0, t = 0, wait = 0.6, started = false;
    const flash = el => { el.classList.add('is-hot'); setTimeout(() => el.classList.remove('is-hot'), 520); };
    tl.eventCallback('onComplete', () => { running = true; });
    onTick(dt => {
      if (!running || !isVis(svg)) return;
      if (wait > 0) { wait -= dt; dot.style.opacity = 0; return; }
      if (!started) { started = true; flash(nodes[0]); }
      t += dt * 110 / lens[seg];
      if (t >= 1) {
        flash(nodes[seg + 1]);
        t = 0; seg++;
        if (seg === segs.length) { seg = 0; wait = 1.6; started = false; } else wait = 0.35;
        dot.style.opacity = 0;
        return;
      }
      const q = segs[seg].getPointAtLength(t * lens[seg]);
      dot.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`);
      dot.style.opacity = 1;
    });
  }

  // Рельс истории заполняется по скроллу, узлы отмечаются по мере прохождения
  function timelineFx() {
    const tlEl = $('.timeline');
    if (!tlEl) return;
    const items = $$('.tl', tlEl);
    ST.create({
      trigger: tlEl, start: 'top 65%', end: 'bottom 65%',
      onUpdate: self => {
        const p = self.progress;
        tlEl.style.setProperty('--rail', p.toFixed(4));
        const h = tlEl.offsetHeight;
        items.forEach(it => it.classList.toggle('is-on', (it.offsetTop + 36) / h <= p + 0.002));
      }
    });
  }

  function odometers() {
    $$('.odo').forEach(el => {
      const str = String(el.dataset.target ?? el.textContent).trim();
      const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = str;
      const vis = document.createElement('span'); vis.className = 'odo'; vis.setAttribute('aria-hidden', 'true');
      const reels = [];
      [...str].forEach(ch => {
        if (!/\d/.test(ch)) { const x = document.createElement('span'); x.textContent = ch; vis.appendChild(x); return; }
        const col = document.createElement('span'); col.className = 'odo__col';
        const reel = document.createElement('span'); reel.className = 'odo__reel';
        for (let k = 0; k < 20; k++) { const d = document.createElement('span'); d.textContent = k % 10; reel.appendChild(d); }
        col.appendChild(reel); vis.appendChild(col);
        reels.push({ reel, d: +ch });
      });
      el.replaceWith(sr, vis);
      ST.create({
        trigger: vis, start: 'top 88%', once: true,
        onEnter: () => reels.forEach((r, i) => G.to(r.reel, { yPercent: -(10 + r.d) * 5, duration: 1.5 + i * 0.18, delay: i * 0.05, ease: EASE }))
      });
    });
  }

  function sectionReveals() {
    $$('.company__title, .history__title, #news-title, #reach-title, .phead__title').forEach(h => {
      const tw = lineReveal(h, { duration: 0.8 });
      tw.pause();
      ST.create({ trigger: h, start: 'top 88%', once: true, onEnter: () => tw.play() });
    });
    const leads = $$('.company__lead');
    if (leads.length) {
      G.set(leads, { opacity: 0, y: 14 });
      ST.create({ trigger: leads[0], start: 'top 88%', once: true, onEnter: () => G.to(leads, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: EASE, delay: 0.15 }) });
    }

    // Схема офиса дорисовывается
    const plan = $('.office__plan svg');
    if (plan) {
      const tl = G.timeline({ paused: true });
      tl.fromTo($$('.office__water, .office__minor', plan), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0);
      // дома проявляются волной от офиса
      tl.fromTo($('#bld-reveal circle', plan), { attr: { r: 0 } }, { attr: { r: 400 }, duration: 1.4, ease: 'power2.inOut' }, 0.1);
      drawInto(tl, collectDraw([$('.office__streets', plan), $('.office__street--main', plan)]), 0.1, 0.9);
      drawInto(tl, collectDraw([$('.office__building', plan), $('.leader', plan), ...$$('text', plan)]), 0.6, 0.6);
      tl.fromTo($$('.net-hub, .office__dot', plan), { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.5, ease: EASE }, 1.0);
      ST.create({ trigger: plan, start: 'top 82%', once: true, onEnter: () => tl.play() });
    }

    const cta = $('.cta__box');
    if (cta) {
      const tl = G.timeline({ paused: true, defaults: { ease: EASE } });
      tl.fromTo('.cta__dim', { scaleX: 0 }, { scaleX: 1, duration: 0.9, transformOrigin: '50% 50%' }, 0)
        .add(lineReveal($('.cta__title'), { duration: 0.9 }), 0.1)
        .fromTo(['.cta__text', '.cta__box .btn'], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.35);
      ST.create({ trigger: cta, start: 'top 75%', once: true, onEnter: () => tl.play() });
    }
  }

  /* ---------- Новости: drag-scroll с инерцией, курсор «Тяни» (из designs/) ---------- */
  const cursorEl = $('.cursor');
  const cursorState = (name, on) => cursorEl?.classList.toggle(`is-${name}`, on);
  function newsDrag() {
    const vp = $('.news__viewport');
    const cur = $('.drag-cursor');
    if (!FINE || !vp) return;
    vp.classList.add('is-draggable');
    let down = false, dragging = false, startX = 0, startScroll = 0, hist = [], v = 0, moved = 0, pid = 0;
    const pos = { x: 0, y: 0 }, cpos = { x: 0, y: 0 };
    vp.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      down = true; dragging = false; moved = 0; v = 0; pid = e.pointerId;
      startX = e.clientX; startScroll = vp.scrollLeft; hist = [{ x: e.clientX, t: performance.now() }];
      cur.classList.add('is-down');
    });
    vp.addEventListener('pointermove', e => {
      pos.x = e.clientX; pos.y = e.clientY;
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (!dragging && moved > 5) { dragging = true; vp.classList.add('is-dragging'); vp.setPointerCapture(pid); }
      if (!dragging) return;
      vp.scrollLeft = startScroll - dx;
      hist.push({ x: e.clientX, t: performance.now() });
      if (hist.length > 6) hist.shift();
    });
    const up = () => {
      if (!down) return;
      down = false;
      cur.classList.remove('is-down');
      if (dragging) {
        const a = hist[0], b = hist[hist.length - 1];
        const dt = Math.max(b.t - a.t, 1);
        v = performance.now() - b.t > 80 ? 0 : -((b.x - a.x) / dt) * 1000; // px/s
        setTimeout(() => vp.classList.remove('is-dragging'), 0);
      }
      dragging = false;
    };
    vp.addEventListener('pointerup', up);
    vp.addEventListener('pointercancel', up);
    vp.addEventListener('click', e => { if (moved > 5) { e.preventDefault(); e.stopPropagation(); } }, true);
    vp.addEventListener('dragstart', e => e.preventDefault());
    vp.addEventListener('pointerenter', e => { pos.x = cpos.x = e.clientX; pos.y = cpos.y = e.clientY; cur.classList.add('is-on'); cursorState('drag', true); });
    vp.addEventListener('pointerleave', () => { cur.classList.remove('is-on'); cursorState('drag', false); });
    onTick(dt => {
      if (Math.abs(v) > 5 && !down) { vp.scrollLeft += v * dt; v *= Math.pow(0.05, dt); }
      if (cur.classList.contains('is-on')) {
        const k = damp(14, dt);
        cpos.x += (pos.x - cpos.x) * k; cpos.y += (pos.y - cpos.y) * k;
        cur.style.transform = `translate3d(${cpos.x.toFixed(1)}px, ${cpos.y.toFixed(1)}px, 0)`;
      }
    });
  }

  /* ---------- Футер (из designs/) ---------- */
  function footerFx() {
    const titles = $$('.fcol__title');
    G.set(titles, { '--lx': 0 });
    ST.create({ trigger: '.footer__grid', start: 'top 85%', once: true, onEnter: () => G.to(titles, { '--lx': 1, duration: 0.8, stagger: 0.12, ease: EASE }) });
    const mark = $('.footer__mark');
    const parts = explodePath($('path', mark));
    const tl = G.timeline();
    parts.forEach((pth, i) => {
      const L = pth.getTotalLength() + 1;
      tl.fromTo(pth, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1, ease: 'none' }, i * 0.25);
    });
    ST.create({ trigger: '.footer', start: 'top 90%', end: 'bottom bottom', scrub: 0.5, animation: tl });
    G.fromTo(mark, { y: 80 }, { y: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  }

  /* ---------- Курсор и магнитные кнопки (из designs/) ---------- */
  function customCursor() {
    document.documentElement.classList.add('has-cursor');
    const dot = $('.cursor__dot', cursorEl), ring = $('.cursor__ring', cursorEl);
    const pt = { x: -100, y: -100 }, d = { x: -100, y: -100 }, r = { x: -100, y: -100 };
    let seen = false;
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      pt.x = e.clientX; pt.y = e.clientY;
      if (!seen) { seen = true; d.x = r.x = pt.x; d.y = r.y = pt.y; cursorState('hidden', false); }
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => cursorState('hidden', true));
    document.documentElement.addEventListener('mouseenter', () => cursorState('hidden', false));
    document.addEventListener('pointerover', e => {
      cursorState('hover', !!e.target.closest('a, button, input, label, summary, .mk-icon:not(.mk-icon--hub), [tabindex="0"]'));
    });
    cursorState('hidden', true);
    onTick(dt => {
      const kd = damp(40, dt), kr = damp(12, dt);
      d.x += (pt.x - d.x) * kd; d.y += (pt.y - d.y) * kd;
      r.x += (pt.x - r.x) * kr; r.y += (pt.y - r.y) * kr;
      dot.style.transform = `translate3d(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px, 0)`;
      ring.style.transform = `translate3d(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px, 0)`;
    });
  }
  function magnetic() {
    const R = 80, MAX = 8;
    const els = $$('.magnetic').map(el => ({
      el, x: G.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' }), y: G.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' }), on: false
    }));
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      for (const m of els) {
        const b = m.el.getBoundingClientRect();
        if (b.bottom < 0 || b.top > window.innerHeight) continue;
        const cx = b.left + b.width / 2 - (G.getProperty(m.el, 'x') || 0);
        const cy = b.top + b.height / 2 - (G.getProperty(m.el, 'y') || 0);
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const ex = Math.max(Math.abs(dx) - b.width / 2, 0), ey = Math.max(Math.abs(dy) - b.height / 2, 0);
        const dist = Math.hypot(ex, ey);
        if (dist < R) {
          const f = 1 - dist / R * 0.5;
          m.x(clamp(dx / (b.width / 2 + R), -1, 1) * MAX * f);
          m.y(clamp(dy / (b.height / 2 + R), -1, 1) * MAX * f);
          m.on = true;
        } else if (m.on) { m.x(0); m.y(0); m.on = false; }
      }
    }, { passive: true });
  }

  /* ---------- Запуск ---------- */
  watch(atlas);
  const revealTl = mapReveal();
  runIntro(() => revealTl.play(0));
  flowFx();
  timelineFx();
  odometers();
  sectionReveals();
  newsDrag();
  footerFx();
  if (FINE) { customCursor(); magnetic(); }
  document.fonts?.ready.then(() => ST.refresh());
  window.addEventListener('load', () => ST.refresh());
})();
