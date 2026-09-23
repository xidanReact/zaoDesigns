/* =========================================================
   Генератор схем главной (sncard/index.html):
   · изометрическая «архитектура» СНК в hero — АЗС, нефтебаза, коммуникационный
     сервер СНК-КС, серверы СНК-ПЦ и СНК-Офис, терминал с топливной картой;
   · карты-схемы АЗС по zao-sncard/stations.js (экосистема и витрина zao);
   · план офиса — тот же, что в snc-service.
   Результат вставляется между маркерами <!-- gen:имя --> … <!-- /gen:имя -->.
   Запуск: node sncard/tools/scene.mjs
   ========================================================= */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const C = 0.866, S = 0.5, K = 1.3;         // изометрия, масштаб
const OX = 400, OY = 150;
const r1 = n => Math.round(n * 10) / 10;
const P = (x, y, z = 0) => [r1(OX + (x - y) * C * K), r1(OY + ((x + y) * S - z) * K)];
const pt = p => `${p[0]} ${p[1]}`;
const poly = pts => 'M' + pts.map(pt).join('L') + 'Z';
const line = pts => 'M' + pts.map(pt).join('L');

/* Параллелепипед: видимы верх, грань +y (левая) и грань +x (правая) */
function box(x, y, z, w, d, h, cls = 'bp', { top = 'fill-w', left = 'fill-w', right = 'fill-s' } = {}) {
  const L = poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)]);
  const R = poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)]);
  const T = poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]);
  return `<path class="${cls} ${left}" d="${L}"/><path class="${cls} ${right}" d="${R}"/><path class="${cls} ${top}" d="${T}"/>`;
}
/* Вертикальный цилиндр (резервуар) */
function tank(cx, cy, r, h, level) {
  const [sx, sb] = P(cx, cy, 0), [, st] = P(cx, cy, h);
  const rx = r1(r * C * Math.SQRT2 * K), ry = r1(r * S * Math.SQRT2 * K);
  const body = `M${r1(sx - rx)} ${st}L${r1(sx - rx)} ${sb}A${rx} ${ry} 0 0 0 ${r1(sx + rx)} ${sb}L${r1(sx + rx)} ${st}Z`;
  let out = `<path class="bp fill-s" d="${body}"/>`;
  if (level) { // уровень топлива — пунктир по стенке
    const [, sl] = P(cx, cy, level);
    out += `<path class="bp-thin bp-dash tank-level" d="M${r1(sx - rx)} ${sl}A${rx} ${ry} 0 0 0 ${r1(sx + rx)} ${sl}"/>`;
  }
  out += `<ellipse class="bp fill-w" cx="${sx}" cy="${st}" rx="${rx}" ry="${ry}"/>`;
  out += `<ellipse class="bp-thin" cx="${sx}" cy="${st}" rx="${r1(rx * 0.4)}" ry="${r1(ry * 0.4)}"/>`;
  return out;
}
/* Текст на грани: top — на верхней плоскости, left — на грани +y, right — на грани +x */
function plate(face, x, y, z, text, cls = 'ex-plate') {
  const [tx, ty] = P(x, y, z);
  const m = face === 'top' ? `0.866 0.5 -0.866 0.5` : face === 'left' ? `0.866 0.5 0 1` : `0.866 -0.5 0 1`;
  return `<text class="${cls}" transform="matrix(${m} ${tx} ${ty})">${text}</text>`;
}

const g = [];
const add = s => g.push(s);

/* ---------- Координатная площадка ---------- */
const G0 = -90, G1 = 330;
const ground = [];
for (let i = G0; i <= G1; i += 30) ground.push(line([P(i, G0), P(i, G1)]), line([P(G0, i), P(G1, i)]));
add(`<g class="layer layer--back" data-depth="0.25">`);
add(`<path class="iso-grid" d="${ground.join(' ')}"/>`);
add(`<path class="bp-soft-dash" d="${poly([P(G0, G0), P(G1, G0), P(G1, G1), P(G0, G1)])}"/>`);
add(`</g>`);

/* ---------- Линии данных по земле: всё сходится в СНК-КС ---------- */
const HUB = { x: 130, y: 110, w: 34, d: 34 };
const lines = {
  // топливная карта → терминал → СНК-КС
  card: [P(282, 127), P(HUB.x + HUB.w, 127)],
  // АЗС (СНК-АЗС) → СНК-КС
  azs: [P(148, 214), P(148, HUB.y + HUB.d)],
  // нефтебаза (СНК-АСН) → СНК-КС
  neft: [P(40, 200), P(40, 128), P(HUB.x, 128)],
  // СНК-КС → процессинг СНК-ПЦ
  pc: [P(140, HUB.y), P(140, 20), P(80, 20), P(80, -20)],
  // СНК-КС → сеть СНК-Офис
  office: [P(156, HUB.y), P(156, -20)],
};
add(`<g class="layer" data-depth="0.6">`);
add(`<g class="data-lines">`);
for (const [id, pts] of Object.entries(lines)) add(`<path class="data" id="d-${id}" d="${line(pts)}"/>`);
add(`</g>`);

/* ---------- Серверы: СНК-ПЦ и СНК-Офис ---------- */
function rack(x, y, h, name, led2) {
  let s = box(x, y, 0, 40, 40, h);
  for (let z = 16; z < h - 8; z += 12) s += `<path class="bp-thin" d="${line([P(x + 5, y + 40, z), P(x + 35, y + 40, z)])}"/>`;
  const [lx, ly] = P(x + 32, y + 40, h - 10);
  s += `<circle class="led" cx="${lx}" cy="${ly}" r="2.4"/><circle class="srv-led${led2 ? ' srv-led--2' : ''}" cx="${r1(lx - 8)}" cy="${r1(ly - 4.5)}" r="2.4"/>`;
  s += plate('right', x + 40, y + 35, h - 26, name);
  return s;
}
add(`<g class="node" data-node="pc" tabindex="0" aria-label="Процессинговый центр СНК-ПЦ">`);
add(`<g class="node__stroke">${rack(60, -60, 104, 'СНК-ПЦ', false)}</g>`);
add(`</g>`);
add(`<g class="node" data-node="office" tabindex="0" aria-label="Сервер сети АЗС СНК-Офис">`);
add(`<g class="node__stroke">${rack(136, -60, 84, 'СНК-ОФИС', true)}</g>`);
add(`</g>`);

/* ---------- Нефтебаза: резервуарный парк и операторная ---------- */
add(`<g class="node" data-node="neft" tabindex="0" aria-label="Нефтебаза: система управления СНК-АСН">`);
add(`<g class="node__stroke">`);
add(tank(-40, 120, 20, 62, 40));
add(tank(10, 120, 20, 62, 26));
add(tank(-40, 172, 20, 62, 48));
add(box(12, 176, 0, 40, 30, 26));
add(`</g>`);
add(plate('left', 15, 206, 9, 'СНК-АСН'));
add(`</g>`);

/* ---------- Коммуникационный сервер СНК-КС ---------- */
add(`<g class="node" data-node="ks" tabindex="0" aria-label="Коммуникационный сервер СНК-КС: обмен данными между программами СНК">`);
add(`<g class="node__stroke">${box(HUB.x, HUB.y, 0, HUB.w, HUB.d, 16)}</g>`);
for (let i = 0; i < 4; i++) { const [lx, ly] = P(HUB.x + 7 + i * 6, HUB.y + HUB.d, 8); add(`<circle class="${i === 1 ? 'led' : 'srv-led'}" cx="${lx}" cy="${ly}" r="1.6"/>`); }
add(plate('top', HUB.x + 6, HUB.y + 10, 16, 'СНК-КС', 'ex-plate ex-plate--sm'));
add(`</g>`);

/* ---------- Терминал и топливная карта ---------- */
add(`<g class="node" data-node="card" tabindex="0" aria-label="Топливная карта и терминал на АЗС">`);
add(`<g class="node__stroke">`);
add(box(282, 112, 0, 22, 22, 50));
add(`<path class="bp-thin fill-s" d="${poly([P(285, 134, 44), P(301, 134, 44), P(301, 134, 32), P(285, 134, 32)])}"/>`);
add(`<path class="bp-thin" d="${line([P(287, 134, 24), P(299, 134, 24)])} ${line([P(287, 134, 18), P(299, 134, 18)])}"/>`);
add(box(292, 52, 78, 54, 34, 2.5, 'bp', { top: 'fill-w', left: 'fill-s', right: 'fill-s' }));
add(`<path class="bp-thin fill-s" d="${poly([P(300, 60, 80.5), P(311, 60, 80.5), P(311, 69, 80.5), P(300, 69, 80.5)])}"/>`);
add(`</g>`);
const [wx, wy] = P(300, 100, 64);
add(`<g class="waves"><path class="bp-thin wave" d="M${wx} ${wy}a12 12 0 0 1 -12 10"/><path class="bp-thin wave" d="M${r1(wx + 8)} ${r1(wy - 5)}a22 22 0 0 1 -22 18"/></g>`);
add(plate('top', 318, 58, 80.5, 'MIFARE', 'ex-plate ex-plate--sm'));
add(`</g>`);

/* ---------- АЗС: операторная с ККТ, две ТРК под навесом ---------- */
add(`<g class="node" data-node="azs" tabindex="0" aria-label="АЗС: система управления СНК-АЗС">`);
add(`<g class="node__stroke">`);
add(box(126, 214, 0, 44, 50, 38));             // операторная
add(`<path class="bp-thin fill-s" d="${poly([P(170, 224, 30), P(170, 244, 30), P(170, 244, 16), P(170, 224, 16)])}"/>`); // окно
add(box(134, 222, 38, 18, 14, 7, 'bp-thin'));  // ККТ
add(box(196, 244, 0, 14, 22, 40));             // ТРК 1
add(box(238, 244, 0, 14, 22, 40));             // ТРК 2
for (const [x, y] of [[188, 234], [264, 234], [188, 292], [264, 292]]) add(`<path class="bp" d="${line([P(x, y, 0), P(x, y, 82)])}"/>`);
add(box(180, 226, 82, 92, 74, 8));             // навес
add(`</g>`);
add(plate('left', 128, 264, 14, 'СНК-АЗС'));
add(`<text class="digits" data-digits transform="matrix(0.866 0.5 0 1 ${P(197, 266, 30).join(' ')})">48.20</text>`);
add(`</g>`);

add(`<g class="packets" id="packets">`);
for (const pts of Object.values(lines)) { const a = pts[0], b = pts[1]; add(`<circle class="packet" cx="${r1((a[0] + b[0]) / 2)}" cy="${r1((a[1] + b[1]) / 2)}" r="3"/>`); }
add(`</g>`);
add(`</g>`);

/* ---------- Выноски: короткие, подпись слева или справа ---------- */
const callouts = [
  { node: 'neft', at: P(-40, 120, 62), to: [118, 142], label: 'НЕФТЕБАЗА', sub: 'СНК-АСН' },
  { node: 'pc', at: P(80, -40, 104), to: [300, 36], label: 'ПРОЦЕССИНГ', sub: 'СНК-ПЦ · СНК-ЛК' },
  { node: 'office', at: P(176, -40, 84), to: [660, 92], label: 'СЕТЬ АЗС', sub: 'СНК-ОФИС' },
  { node: 'ks', at: P(HUB.x + HUB.w, HUB.y + HUB.d / 2, 16), to: [500, 480], label: 'ОБМЕН ДАННЫМИ', sub: 'СНК-КС' },
  { node: 'azs', at: P(126, 264, 38), to: [180, 520], label: 'АЗС / АЗК', sub: 'СНК-АЗС · ККТ' },
  { node: 'card', at: P(346, 52, 80.5), to: [770, 400], side: 'left', label: 'ТОПЛИВНАЯ КАРТА', sub: 'ТЕРМИНАЛ · ПЦ' },
];
add(`<g class="layer layer--front" data-depth="1">`);
for (const c of callouts) {
  const [ax, ay] = c.at, [bx, by] = c.to;
  const right = c.side ? c.side === 'right' : bx >= ax;
  const ex = r1(bx + (right ? 16 : -16));
  const tx = r1(ex + (right ? 6 : -6)), anchor = right ? '' : ' text-anchor="end"';
  add(`<g class="callout" data-part="${c.node}"><path class="leader" d="M${ax} ${ay}L${bx} ${by}H${ex}"/><circle class="callout__dot" cx="${ax}" cy="${ay}" r="2.5"/>` +
    `<text class="bp-label bp-label--accent" x="${tx}" y="${by - 3}"${anchor}>${c.label}</text>` +
    `<text class="bp-label bp-label--sm" x="${tx}" y="${by + 12}"${anchor}>${c.sub}</text></g>`);
}
add(`</g>`);


/* =========================================================
   Карта-схема АЗС по данным zao-sncard/stations.js
   Равнопромежуточная проекция: x — долгота × cos(φ₀), y — широта
   ========================================================= */
const SNK = (() => {
  const src = readFileSync(join(ROOT, '..', 'zao-sncard', 'stations.js'), 'utf8');
  const window = {};
  new Function('window', src)(window);
  return window.SNK;
})();

function netmap({ x0, y0, w, h, k, labels = true, lngStep = 1, rings = [], prefix = 'm' }) {
  const pts = [SNK.office, ...SNK.stations];
  const lat0 = 57.2, cos = Math.cos(lat0 * Math.PI / 180);
  const lats = pts.map(p => p.lat), lngs = pts.map(p => p.lng);
  const cLat = (Math.max(...lats) + Math.min(...lats)) / 2;
  const cLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
  const proj = (lat, lng) => [r1(x0 + w / 2 + (lng - cLng) * cos * k), r1(y0 + h / 2 - (lat - cLat) * k)];
  const out = [];
  // градусная сетка — реальные параллели и меридианы
  for (let lat = 55; lat <= 60; lat++) {
    const [, y] = proj(lat, cLng);
    if (y < y0 + 8 || y > y0 + h - 8) continue;
    out.push(`<path class="grat" d="M${x0} ${y}H${x0 + w}"/><text class="bp-coord" x="${x0 + 8}" y="${r1(y - 5)}">${lat}° с. ш.</text>`);
  }
  for (let lng = 80; lng <= 86; lng++) {
    const [x] = proj(cLat, lng);
    if (x < x0 + 8 || x > x0 + w - 8) continue;
    out.push(`<path class="grat" d="M${x} ${y0}V${y0 + h}"/>`);
    if ((lng - 80) % lngStep === 0) out.push(`<text class="bp-coord" x="${r1(x + 5)}" y="${y0 + h - 8}">${lng}° в. д.</text>`);
  }
  const [hx, hy] = proj(SNK.office.lat, SNK.office.lng);
  // кольца расстояний от офиса: 1° широты ≈ 111,2 км (обрезаны рамкой карты)
  out.push(`<clipPath id="${prefix}-clip"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${prefix}-clip)">`);
  rings.forEach(km => {
    const r = r1(km / 111.2 * k);
    out.push(`<circle class="ring" cx="${hx}" cy="${hy}" r="${r}"/><text class="bp-coord ring__t" x="${r1(hx + r * 0.72 + 4)}" y="${r1(hy + r * 0.72 + 12)}">${km} км</text>`);
  });
  out.push(`</g>`);
  // линии данных: офис → каждая АЗС (ломаная по сетке)
  out.push(`<g class="net-lines">`);
  SNK.stations.forEach((s, i) => {
    const [sx, sy] = proj(s.lat, s.lng);
    out.push(`<path class="data net-line" id="${prefix}-l${i}" d="M${hx} ${hy}V${sy}H${sx}"/>`);
  });
  out.push(`</g>`);
  SNK.stations.forEach(s => {
    const [sx, sy] = proj(s.lat, s.lng);
    let label = '';
    if (labels) {
      // подпись со стороны, противоположной линии к офису; у близких к Томску точек — сверху
      const near = Math.abs(sx - hx) < 40 && Math.abs(sy - hy) < 40;
      const left = sx < hx;
      const lx = near ? r1(sx + (left ? -8 : 8)) : r1(sx + (left ? -10 : 10));
      const ly = near ? r1(sy - 12) : r1(sy + 3.5);
      const anchor = left ? ' text-anchor="end"' : '';
      label = `<text class="bp-label bp-label--sm net-pt__t" x="${lx}" y="${ly}"${anchor}>${s.place.toUpperCase()}</text>`;
    }
    out.push(`<g class="net-pt" data-id="${s.id}" tabindex="0" aria-label="${s.num}, ${s.address}">` +
      `<circle class="net-hit" cx="${sx}" cy="${sy}" r="16"/><circle class="net-node" cx="${sx}" cy="${sy}" r="5"/>${label}</g>`);
  });
  out.push(`<circle class="net-hub" cx="${hx}" cy="${hy}" r="9"/><circle class="office__dot" cx="${hx}" cy="${hy}" r="3.5"/>`);
  if (labels) out.push(`<text class="bp-label bp-label--accent" x="${r1(hx + 14)}" y="${r1(hy + 20)}">ТОМСК · ОФИС СНК</text>`);
  return out.join('\n');
}

const zaoMap = [
  `<rect class="bp-frame" x="0.5" y="0.5" width="639" height="559" rx="12"/>`,
  netmap({ x0: 20, y0: 20, w: 600, h: 520, k: 118, lngStep: 2, rings: [100, 200, 300], prefix: 'z' }),
  `<g class="bp-tick"><path d="M8 20h10M13 15v10 M622 20h10M627 15v10 M8 540h10M13 535v10 M622 540h10M627 535v10"/></g>`,
].join('\n');
const ecoMap = netmap({ x0: 1110, y0: 250, w: 420, h: 420, k: 96, labels: false, lngStep: 2, rings: [100, 200], prefix: 'e' });

/* План офиса — тот же, что в snc-service (данные OpenStreetMap, ODbL) */
const svcHtml = readFileSync(join(ROOT, '..', 'snc-service', 'index.html'), 'utf8');
const officeSvg = (svcHtml.match(/<div class="office__plan"[^>]*>\s*(<svg[\s\S]*?<\/svg>)/) || [])[1];
if (!officeSvg) throw new Error('Не найден план офиса в snc-service/index.html');

const file = join(ROOT, 'index.html');
let html = readFileSync(file, 'utf8');
const put = (name, content) => {
  const re = new RegExp(`(<!-- gen:${name} -->)[\\s\\S]*?(<!-- /gen:${name} -->)`);
  if (!re.test(html)) throw new Error(`В index.html нет маркеров gen:${name}`);
  html = html.replace(re, (_, a, b) => `${a}\n${content}\n${b}`);
};
put('scene', g.join('\n'));
put('zao-map', zaoMap);
put('eco-map', ecoMap);
put('office', officeSvg);
writeFileSync(file, html);
console.log(`scene: ${g.length} фрагментов, карты АЗС (${SNK.stations.length} точек) и план офиса записаны в index.html`);
