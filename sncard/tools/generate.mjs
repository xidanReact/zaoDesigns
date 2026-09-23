#!/usr/bin/env node
/* =========================================================
   СНК · sncard.ru — генератор статических страниц (без зависимостей).
   Запуск из любой папки:  node sncard/tools/generate.mjs

   Что делает:
   1. Строит страницы из data/*.js:
        software/index.html, software/<раздел>.html, software/<раздел>/<продукт>.html,
        news.html, news/<slug>.html, company.html, kkt.html,
        docs.html, docs/<статья>.html, partners.html, contacts.html,
        privacy.html, cookies.html, consent.html
   2. Во все страницы (включая index.html) вставляет общие блоки
      между маркерами-комментариями:
        <!-- @sprite:start --> … <!-- @sprite:end -->   (иконки; эталон — index.html)
        <!-- @header:start --> … <!-- @header:end -->   (шапка + мобильное меню)
        <!-- @footer:start --> … <!-- @footer:end -->   (футер + курсор)
   Активный пункт меню берётся из <body data-page="…">.
   Картинки: пути берутся из data/images.json; если файла ещё нет в img/,
   вместо <img> ставится чертёжная заглушка (докачать: node tools/fetch-images.mjs).
   Сгенерированные файлы хранятся в репозитории — сайт работает без сборки.
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const SOFT = require(path.join(ROOT, 'data/software.js'));
const NEWS = require(path.join(ROOT, 'data/news.js'));
const KKT = require(path.join(ROOT, 'data/kkt.js'));
const DOCS = require(path.join(ROOT, 'data/docs.js'));
const PARTNERS = require(path.join(ROOT, 'data/partners.js'));
const POLICIES = require(path.join(ROOT, 'data/policies.js'));
const COMPANY = require(path.join(ROOT, 'data/company.js'));

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
/* Любая ссылка на внешний ресурс открывается в новой вкладке */
function externalize(html) {
  return html.replace(/<a\s[^>]*>/g, tag => {
    if (!/href="https?:\/\//.test(tag) || /\starget=/.test(tag)) return tag;
    const withRel = /\srel="/.test(tag)
      ? tag.replace(/\srel="([^"]*)"/, (m, v) => ` rel="${v.includes('noopener') ? v : `${v} noopener`}"`)
      : tag.replace(/>$/, ' rel="noopener">');
    return withRel.replace(/>$/, ' target="_blank">');
  });
}
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), externalize(s)); };
const exists = f => fs.existsSync(path.join(ROOT, f));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nb = s => String(s).replace(/ /g, ' ');
const rub = n => nb(n.toLocaleString('ru-RU').replace(/ | /g, ' ')) + ' ₽';
const plural = (n, [one, few, many]) => {
  const a = n % 10, b = n % 100;
  return (a === 1 && b !== 11) ? one : (a >= 2 && a <= 4 && (b < 10 || b >= 20)) ? few : many;
};
const prods = n => `${n} ${plural(n, ['продукт', 'продукта', 'продуктов'])}`;
const filesN = n => `${n} ${plural(n, ['файл', 'файла', 'файлов'])}`;
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const rusDate = iso => { const [y, m, d] = iso.split('-'); return `${+d} ${MONTHS[+m - 1]} ${y}`; };

/* ---------- Внешние ссылки группы ---------- */
const SVC = 'https://xidanreact.github.io/zaoDesigns/snc-service/';
const ZAO = 'https://xidanreact.github.io/zaoDesigns/zao-sncard/';
const KB = 'https://doc.sncard.ru/bin/view/Main/';
const MAIL = 'sncard@sncard.ru';
const EXT = '<svg class="dd__ext" aria-hidden="true"><use href="#i-ext"/></svg><span class="sr-only"> — другой сайт группы, откроется в новой вкладке</span>';
const ARROW = '<svg aria-hidden="true"><use href="#i-arrow"/></svg>';
const DOT = '<span class="dd__dot" aria-hidden="true"></span>';

/* ---------- Производные каталога ПО ---------- */
const SECTIONS = SOFT.sections;
const PRODUCTS = SOFT.products;
const bySection = slug => PRODUCTS.filter(p => p.section === slug);
const secUrl = (r, slug) => `${r}software/${slug}.html`;
const prodUrl = (r, p) => `${r}software/${p.section}/${p.slug}.html`;
const prodById = id => PRODUCTS.find(p => p.id === id);
const askHref = name => `mailto:${MAIL}?subject=${encodeURIComponent(`Запрос: ${name}`)}`;

/* =========================================================
   Ссылки и картинки внутри перенесённого контента
   ========================================================= */
function mapLinks(html, r) {
  return html.replace(/href="https:\/\/www\.sncard\.ru([^"]*)"/g, (m, p) => {
    const [pathname, hash = ''] = decodeURI(p).split('#');
    const h = hash ? `#${hash}` : '';
    const prod = pathname.match(/\/component\/jshopping\/product\/view\/\d+\/(\d+)/)
      || (pathname === '/azs-menu-product' ? [, '1'] : null)
      || (pathname === '/azs-menu-product-192' ? [, '17'] : null);
    if (prod) { const p = prodById(+prod[1]); if (p) return `href="${prodUrl(r, p)}"`; }
    const sec = pathname.match(/^\/programmnoe-obespechenie\/([\w-]+)\/?$/);
    if (sec && SECTIONS.some(s => s.slug === sec[1])) return `href="${secUrl(r, sec[1])}"`;
    const map = {
      '/programmnoe-obespechenie': 'software/index.html',
      '/company': 'company.html',
      '/news': 'news.html',
      '/partnery': 'partners.html',
      '/contacts': 'contacts.html',
      '/dokumentatsiya': 'docs.html',
      '/privacy-policy': 'privacy.html',
      '/cookie-policy': 'cookies.html',
      '/agreement-newsletter': 'consent.html',
      '/obsluzhivanie-kkt/shtrikh-m': 'kkt.html#shtrih',
      '/obsluzhivanie-kkt/kkt-ooo-atol': 'kkt.html#atol',
      '/obsluzhivanie-kkt/fiskalnye-nakopiteli': 'kkt.html#fn',
      '/obsluzhivanie-kkt/dogovory': 'kkt.html#contracts',
    };
    const local = map[pathname.replace(/\/$/, '')];
    if (local) return `href="${r}${local.replace('#certs', '#certificates')}${h === '#certs' ? '#certificates' : h}"`;
    return m; // файлы (/images/…) и прочее остаются на sncard.ru
  }).replace(/href="https:\/\/snc-service\.sncard\.ru([^"]*)"/g, () => `href="${SVC}"`);
}
/* Картинки: показываем только скачанные, иначе убираем (заглушку ставит вёрстка) */
function resolveImgs(html, r) {
  return html.replace(/<img[^>]*src="\{\{root\}\}([^"]+)"[^>]*>/g, (m, src) => {
    if (!exists(src)) return '';
    const size = imgSize(src);
    return m.replace('{{root}}' + src, r + src).replace('<img', `<img${size}`);
  });
}
const content = (html, r) => resolveImgs(mapLinks(String(html || ''), r), r);

/* Размеры картинки из файла (PNG/JPEG/GIF/WEBP) — чтобы не «прыгала» вёрстка */
const sizeCache = new Map();
function imgSize(src) {
  if (sizeCache.has(src)) return sizeCache.get(src);
  let attr = '';
  try {
    const b = fs.readFileSync(path.join(ROOT, src));
    let w = 0, h = 0;
    if (b[0] === 0x89 && b[1] === 0x50) { w = b.readUInt32BE(16); h = b.readUInt32BE(20); }
    else if (b[0] === 0x47 && b[1] === 0x49) { w = b.readUInt16LE(6); h = b.readUInt16LE(8); }
    else if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) { h = b.readUInt16BE(i + 5); w = b.readUInt16BE(i + 7); break; }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
    if (w && h) attr = ` width="${w}" height="${h}"`;
  } catch { /* файла нет — без размеров */ }
  sizeCache.set(src, attr);
  return attr;
}

/* Чертёжная заглушка вместо фото */
const PLACEHOLDER = (label = 'нет изображения') => `<svg class="noimg" viewBox="0 0 320 240" role="img" aria-label="${esc(label)}">
            <rect class="bp-soft-dash" x="20" y="20" width="280" height="200" rx="6"/>
            <path class="bp-thin" d="M20 20 300 220M300 20 20 220"/>
            <rect class="bp fill-w" x="110" y="90" width="100" height="60" rx="4"/>
            <path class="bp-thin" d="M124 122h72M124 134h48"/>
            <text class="bp-label bp-label--sm" x="160" y="200" text-anchor="middle">НЕТ ФОТО</text>
          </svg>`;

/* =========================================================
   Общие блоки: шапка, мобильное меню, футер
   ========================================================= */
const NAV = [
  {
    key: 'company', label: 'Компания', links: [
      ['company.html', 'О компании'], ['company.html#actions', 'Направления деятельности'],
      ['company.html#certificates', 'Сертификаты'], ['news.html', 'Новости'], ['partners.html', 'Партнёры'],
    ],
  },
  { key: 'software', label: 'Программное обеспечение', mega: true },
  {
    key: 'equipment', label: 'Оборудование и карты', ext: [
      [`${SVC}equipment/index.html`, 'Каталог оборудования'],
      [`${SVC}cards.html`, 'Изготовление карт'],
      [SVC, 'ООО «Сибнефтекарт-сервис»', 'разработка, производство, ремонт'],
    ],
  },
  {
    key: 'kkt', label: 'Обслуживание ККТ', links: [
      ['kkt.html#shtrih', 'ККТ «Штрих-М»'], ['kkt.html#atol', 'ККТ ООО «Атол»'],
      ['kkt.html#fn', 'Фискальные накопители'], ['kkt.html#contracts', 'Договоры'],
    ],
  },
  {
    key: 'docs', label: 'Документация', links: [['docs.html', 'Программное обеспечение']],
    extTail: [[`${SVC}docs.html#equipment`, 'Оборудование для АЗС'], [KB, 'База знаний', null, true]],
  },
  { key: 'contacts', label: 'Контакты', href: 'contacts.html' },
];

function header(r, page, here = '') {
  const cur = href => (here && href === here ? ' aria-current="page"' : '');
  const extLink = ([href, label, note, blank]) =>
    `              <li><a class="dd__link${note ? ' dd__link--note' : ''}" href="${href}"${blank ? ' target="_blank" rel="noopener"' : ''}>${note ? `<span>${label}<small>${note}</small></span>` : label} ${EXT.replace('другой сайт группы', blank ? 'откроется в новой вкладке' : 'другой сайт группы')}</a></li>`;

  const items = NAV.map(n => {
    const isCur = n.key === page;
    if (n.href) {
      return `        <li class="nav__item${isCur ? ' is-current' : ''}" data-nav="${n.key}">
          <a class="nav__link" href="${r}${n.href}"${cur(n.href)}>${n.label}</a>
        </li>`;
    }
    let inner;
    if (n.mega) {
      inner = `          <div class="dd dd--mega" id="dd-${n.key}">
            <ul class="dd__list">
${SECTIONS.map(s => `              <li><a class="dd__link" href="${secUrl(r, s.slug)}"${cur(`software/${s.slug}.html`)}><svg class="dd__ic" aria-hidden="true"><use href="#${s.icon}"/></svg><span>${esc(s.title)}</span><small class="mono">${bySection(s.slug).length}</small></a></li>`).join('\n')}
              <li class="dd__all"><a class="dd__link" href="${r}software/index.html"${cur('software/index.html')}><span>Всё программное обеспечение</span><small class="mono">${PRODUCTS.length}</small></a></li>
            </ul>
          </div>`;
    } else {
      const rows = [
        ...(n.links || []).map(([h, t]) => `              <li><a class="dd__link" href="${r}${h}"${cur(h)}>${t} ${DOT}</a></li>`),
        ...(n.ext || []).map(extLink),
        ...(n.extTail || []).map(extLink),
      ];
      inner = `          <div class="dd" id="dd-${n.key}">
            <ul class="dd__list">
${rows.join('\n')}
            </ul>
          </div>`;
    }
    return `        <li class="nav__item has-dd${isCur ? ' is-current' : ''}" data-nav="${n.key}">
          <button class="nav__link nav__trigger" type="button" aria-expanded="false" aria-controls="dd-${n.key}">
            ${n.label} <svg class="nav__chev" aria-hidden="true"><use href="#i-chevron"/></svg>
          </button>
${inner}
        </li>`;
  }).join('\n');

  const mitems = NAV.map(n => {
    if (n.href) return `      <li><a class="mmenu__link" href="${r}${n.href}"${cur(n.href)}>${n.label}</a></li>`;
    const links = n.mega
      ? [...SECTIONS.map(s => [`software/${s.slug}.html`, s.title]), ['software/index.html', 'Всё программное обеспечение']]
      : (n.links || []);
    const ext = [...(n.ext || []), ...(n.extTail || [])].filter(e => !e[2] || e[3]);
    return `      <li>
        <details class="mmenu__group"${n.key === page ? ' open' : ''}>
          <summary class="mmenu__link">${n.label} <svg aria-hidden="true"><use href="#i-chevron"/></svg></summary>
${links.map(([h, t]) => `          <a href="${r}${h}"${cur(h)}>${esc(t)}</a>`).join('\n')}
${ext.map(([h, t, , blank]) => `          <a href="${h}"${blank ? ' target="_blank" rel="noopener"' : ''}>${esc(t)} ↗<span class="sr-only"> — ${blank ? 'откроется в новой вкладке' : 'другой сайт группы'}</span></a>`).join('\n')}
        </details>
      </li>`;
  }).join('\n');

  return `<header class="header" id="header">
  <div class="header__progress" aria-hidden="true"><span></span></div>
  <div class="header__inner container">
    <a class="brand" href="${r}index.html" aria-label="Сибнефтекарт — на главную">
      <svg class="brand__mark" viewBox="0 0 120 48" aria-hidden="true">
        <path d="M38 11H22.5A12.5 12.5 0 0 0 10 23.5v1A12.5 12.5 0 0 0 22.5 37H38 M48 11v26 M72 11v26 M48 24h24 M84 11v26 M106 11L86.5 24 106 37" fill="none" stroke="#D32F2F" stroke-width="5" stroke-linecap="square"/>
      </svg>
      <span class="brand__text">
        <span class="brand__name">Сибнефтекарт</span>
        <span class="brand__sub">общество с ограниченной ответственностью</span>
      </span>
    </a>

    <nav class="nav" id="nav" aria-label="Главное меню">
      <ul class="nav__list">
${items}
      </ul>
    </nav>

    <a class="hotline" href="tel:+78002500534" aria-label="Круглосуточная поддержка СНК-АЗС: 8 800 250-05-34">
      <svg class="hotline__ic" aria-hidden="true"><use href="#i-headset"/></svg>
      <span class="hotline__text">
        <span class="hotline__num mono">8 800 250-05-34</span>
        <span class="hotline__label">поддержка 24/7</span>
      </span>
    </a>

    <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Открыть меню">
      <span></span><span></span>
    </button>
  </div>
</header>

<!-- Мобильное меню -->
<div class="mmenu" id="mobile-menu" hidden>
  <div class="mmenu__inner container">
    <ul class="mmenu__list">
${mitems}
    </ul>
    <div class="mmenu__foot">
      <a class="btn btn--outline" href="tel:+78002500534"><svg class="hotline__ic" aria-hidden="true"><use href="#i-headset"/></svg><span>8 800 250-05-34 · 24/7</span></a>
      <a class="mmenu__phone mono" href="tel:+73822651030">+7 (3822) 65-10-30 · приёмная</a>
    </div>
  </div>
</div>`;
}

function footer(r) {
  return `<footer class="footer">
  <svg class="footer__mark" viewBox="0 0 120 48" aria-hidden="true">
    <path d="M38 11H22.5A12.5 12.5 0 0 0 10 23.5v1A12.5 12.5 0 0 0 22.5 37H38 M48 11v26 M72 11v26 M48 24h24 M84 11v26 M106 11L86.5 24 106 37"/>
  </svg>
  <div class="container footer__grid">
    <div class="fcol">
      <h2 class="fcol__title">Контактная информация</h2>
      <ul class="contacts">
        <li><svg aria-hidden="true"><use href="#i-pin"/></svg><span>634009, г. Томск, ул. Розы Люксембург, д. 55</span></li>
        <li><svg aria-hidden="true"><use href="#i-mail"/></svg><a href="mailto:${MAIL}">${MAIL}</a></li>
        <li><svg aria-hidden="true"><use href="#i-phone"/></svg><span><a href="tel:+73822651030">+7 (3822) 65-10-30</a><small>многоканальный</small></span></li>
        <li><svg aria-hidden="true"><use href="#i-headset"/></svg><span><a href="tel:+78002500534">8 800 250-05-34</a><small>круглосуточная поддержка СНК-АЗС</small></span></li>
      </ul>
    </div>
    <div class="fcol">
      <h2 class="fcol__title">Правовая информация</h2>
      <ul class="legal">
        <li><a href="${r}privacy.html">Политика конфиденциальности</a></li>
        <li><a href="${r}cookies.html">Политика использования Cookies</a></li>
        <li><a href="${r}consent.html">Согласие на получение новостных сообщений</a></li>
      </ul>
      <h2 class="fcol__title fcol__title--gap">Сайты группы</h2>
      <ul class="legal">
        <li><a href="${SVC}">Оборудование и карты <span class="ext mono" aria-hidden="true">↗</span><span class="sr-only"> — другой сайт группы, откроется в новой вкладке</span></a></li>
        <li><a href="${ZAO}">АО «НПФ «Сибнефтекарт» <span class="ext mono" aria-hidden="true">↗</span><span class="sr-only"> — другой сайт группы, откроется в новой вкладке</span></a></li>
        <li><a href="${KB}" target="_blank" rel="noopener">База знаний <span class="ext mono" aria-hidden="true">↗</span><span class="sr-only"> — откроется в новой вкладке</span></a></li>
      </ul>
    </div>
    <div class="fcol fcol--form">
      <h2 class="fcol__title">Рассылка ООО «Сибнефтекарт»</h2>
      <form class="subscribe" id="subscribe" novalidate>
        <div class="field">
          <input class="field__input" id="sub-email" name="email" type="email" placeholder=" " autocomplete="email" required aria-describedby="sub-email-err">
          <label class="field__label" for="sub-email">Электронная почта</label>
          <span class="field__err" id="sub-email-err" role="alert"></span>
        </div>
        <label class="check">
          <input type="checkbox" name="agree" required>
          <span class="check__box" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg></span>
          <span class="check__text">Соглашаюсь получать рекламно-информационные сообщения (<a href="${r}consent.html">согласие</a>)</span>
        </label>
        <div class="subscribe__actions">
          <button class="btn btn--primary btn--submit" type="submit" data-state="idle">
            <span class="bstate bstate--idle">Подписаться</span>
            <span class="bstate bstate--loading" aria-hidden="true"><i class="spinner"></i></span>
            <span class="bstate bstate--success" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg>Вы подписаны</span>
          </button>
          <button class="btn btn--ghost" type="reset">Отменить</button>
        </div>
        <p class="subscribe__status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>
  <div class="footer__bottom">
    <div class="container footer__bottom-inner">
      <span>© ООО «Сибнефтекарт», 2026</span>
      <span class="mono">ОГРН 1177031075066 · ИНН 7017426216 · 56°29′ с. ш. · 84°57′ в. д.</span>
    </div>
  </div>
</footer>

<div class="cursor" aria-hidden="true"><span class="cursor__ring"></span><span class="cursor__dot"></span></div>`;
}

const SPRITE = (() => {
  const m = read('index.html').match(/<!-- @sprite:start -->\n([\s\S]*?)\n<!-- @sprite:end -->/);
  if (!m) throw new Error('В index.html нет блока @sprite');
  return m[1];
})();

const LIBS = r => `<!-- Библиотеки лежат локально, как в snc-service: GSAP 3.15.0, Lenis 1.3.26 -->
<script src="${r}js/vendor/gsap.min.js" defer></script>
<script src="${r}js/vendor/ScrollTrigger.min.js" defer></script>
<script src="${r}js/vendor/CustomEase.min.js" defer></script>
<script src="${r}js/vendor/lenis.min.js" defer></script>`;

function shell({ r, page, here, title, desc, main, scripts = ['js/site.js', 'js/motion.js', 'js/pages.js'] }) {
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <script>document.documentElement.classList.add('js');</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@500;600;700;800&display=swap&subset=cyrillic" rel="stylesheet">
  <!-- Дизайн-система: эталон в designs/, здесь только новые компоненты -->
  <link rel="stylesheet" href="${r}../designs/styles.css">
  <link rel="stylesheet" href="${r}styles.css">
</head>
<body data-page="${page}">
<!-- Файл создан tools/generate.mjs из data/*.js — правьте данные, а не этот файл -->

<a class="skip-link" href="#main">Перейти к содержимому</a>

<!-- @sprite:start -->
${SPRITE}
<!-- @sprite:end -->

<!-- @header:start -->
${header(r, page, here)}
<!-- @header:end -->

<main id="main">
${main}
</main>

<!-- @footer:start -->
${footer(r)}
<!-- @footer:end -->

${LIBS(r)}
${scripts.map(s => `<script src="${r}${s}" defer></script>`).join('\n')}
</body>
</html>
`;
}

/* ---------- Шапка страницы и крошки ---------- */
function crumbs(r, trail) {
  return `<nav class="crumbs mono" aria-label="Навигационная цепочка">
        <ol>
          <li><a href="${r}index.html">Главная</a></li>
${trail.map(([t, h], i) => i === trail.length - 1
    ? `          <li aria-current="page">${esc(t)}</li>`
    : `          <li><a href="${h}">${esc(t)}</a></li>`).join('\n')}
        </ol>
      </nav>`;
}
function phead({ r, trail, title, lead = '', sheet = '', aside = '' }) {
  return `<section class="phead">
  <div class="container">
    <div class="phead__sheet">
      <span class="phead__ticks" aria-hidden="true"></span>
      ${crumbs(r, trail)}
      <div class="phead__row">
        <div class="phead__text">
          <h1 class="phead__title">${title}</h1>
          ${lead ? `<p class="phead__lead">${lead}</p>` : ''}
        </div>
        ${aside}
      </div>
      <span class="phead__stamp mono" aria-hidden="true">${sheet}</span>
    </div>
  </div>
</section>`;
}
const facts = items => `<dl class="phead__facts mono">
${items.map(([dt, dd]) => `          <div><dt>${dt}</dt><dd>${dd}</dd></div>`).join('\n')}
        </dl>`;

/* ---------- Блок лицензий (на страницах ПО) ---------- */
const licenseBlock = () => `<ul class="lic">
${SOFT.license.map(l => `        <li><a class="lic__link" href="${l.href}" target="_blank" rel="noopener"><span class="ftype mono" data-type="pdf">pdf</span><span>${esc(l.title)}</span><svg class="docitem__ic" aria-hidden="true"><use href="#i-doc"/></svg></a></li>`).join('\n')}
      </ul>`;

/* =========================================================
   Карточка продукта в списке
   ========================================================= */
function prodCard(r, p, { headingLevel = 3 } = {}) {
  const img = p.images.find(i => exists(i.src));
  const h = `h${headingLevel}`;
  return `<article class="prod" data-reveal-item>
        <a class="prod__media" href="${prodUrl(r, p)}" tabindex="-1" aria-hidden="true">
          ${img ? `<img src="${r}${img.src}"${imgSize(img.src)} alt="" loading="lazy" decoding="async">` : PLACEHOLDER(p.name)}
          ${p.isNew ? '<span class="prod__new mono">New</span>' : ''}
        </a>
        <div class="prod__body">
          <${h} class="prod__title"><a class="prod__link" href="${prodUrl(r, p)}">${esc(p.name)}</a></${h}>
          ${p.short ? `<p class="prod__text">${esc(p.short)}</p>` : ''}
          <div class="prod__foot">
            <div class="prod__price">
              ${p.price ? `<span class="prod__sum mono">${rub(p.price)}</span>` : ''}
              <span class="prod__stock mono">лицензия</span>
            </div>
            <a class="btn btn--outline btn--ask" href="${askHref(p.name)}">Запросить</a>
          </div>
        </div>
      </article>`;
}

/* =========================================================
   Страницы: программное обеспечение
   ========================================================= */
function pageSoftwareIndex() {
  const r = '../';
  const main = `${phead({
    r, trail: [['Программное обеспечение']], title: 'Программное&nbsp;обеспечение',
    lead: `${PRODUCTS.length} продуктов СНК в&nbsp;четырёх направлениях: управление АЗС и&nbsp;АЗК, сеть АЗС, процессинг топливных карт, нефтебазы. Поставка по&nbsp;лицензии, сопровождение 12&nbsp;месяцев в&nbsp;составе поставки.`,
    sheet: 'СНК · ПО · Лист 1',
    aside: facts([['продуктов', PRODUCTS.length], ['направления', SECTIONS.length], ['реестр ПО', '№&nbsp;2022616071']]),
  })}

<section class="catalog-index">
  <div class="container">
    <ul class="bento bento--cat">
${SECTIONS.map((s, i) => {
    const list = bySection(s.slug);
    return `      <li class="card${i === 0 ? ' card--half' : ''}" data-cat="${s.slug}">
        <span class="card__spot" aria-hidden="true"></span>
        <div class="card__top"><span class="card__num mono">0${i + 1}</span><svg class="card__icon" aria-hidden="true"><use href="#${s.icon}"/></svg></div>
        <h2 class="card__title"><a class="card__cover-link" href="${secUrl(r, s.slug)}">${esc(s.title)}</a></h2>
        <p class="card__text">${esc(s.h1)}</p>
        <p class="card__meta mono">${prods(list.length)}</p>
        <span class="card__arrow" aria-hidden="true">${ARROW}</span>
      </li>`;
  }).join('\n\n')}
    </ul>

    <div class="lic-box">
      <h2 class="h2 lic-box__title">Условия поставки</h2>
      <p class="lic-box__text">Программы поставляются по&nbsp;оферте «Лицензионное соглашение к&nbsp;программам и&nbsp;сервисам компании ООО&nbsp;«СНК» и&nbsp;договору лицензионной поставки. В&nbsp;поставку входит сопровождение 12&nbsp;месяцев; после гарантийного периода&nbsp;— по&nbsp;оферте «Условия оказания информационных услуг по&nbsp;сопровождению».</p>
      ${licenseBlock()}
    </div>
  </div>
</section>`;
  return shell({ r, page: 'software', here: 'software/index.html', title: 'Программное обеспечение СНК — Сибнефтекарт', desc: 'Программы СНК для автоматизации АЗС, управления сетью АЗС, процессинга топливных карт и автоматизации нефтебаз.', main });
}

function pageSection(s) {
  const r = '../';
  const list = bySection(s.slug);
  const nav = `<aside class="catalog__side">
        <nav class="catnav" aria-label="Разделы ПО">
          <p class="catnav__title mono">Разделы</p>
          <ul>
${SECTIONS.map(x => `            <li><a class="catnav__link${x.slug === s.slug ? ' is-current' : ''}" href="${secUrl(r, x.slug)}"${x.slug === s.slug ? ' aria-current="page"' : ''}><svg class="catnav__ic" aria-hidden="true"><use href="#${x.icon}"/></svg><span>${esc(x.title)}</span><small class="mono">${bySection(x.slug).length}</small></a></li>`).join('\n')}
            <li><a class="catnav__link catnav__link--all" href="${r}software/index.html"><span>Всё ПО</span>${ARROW}</a></li>
          </ul>
        </nav>
      </aside>`;
  const main = `${phead({
    r, trail: [['Программное обеспечение', `${r}software/index.html`], [s.title]], title: esc(s.title),
    lead: esc(s.h1) + '.',
    sheet: `СНК · ${s.title} · Лист 1`,
    aside: facts([['продуктов', list.length]]),
  })}

<section class="catalog">
  <div class="container catalog__grid">
      ${nav}
      <div class="catalog__list">
${list.map(p => '        ' + prodCard(r, p, { headingLevel: 2 })).join('\n')}
      </div>
  </div>
</section>`;
  return shell({ r, page: 'software', here: `software/${s.slug}.html`, title: `${s.title} — программное обеспечение СНК`, desc: s.h1, main });
}

function pageProduct(p) {
  const r = '../../';
  const s = SECTIONS.find(x => x.slug === p.section);
  const imgs = p.images.filter(i => exists(i.src));
  const related = bySection(p.section).filter(x => x.id !== p.id).slice(0, 3);
  const gallery = `<div class="gal">
        <div class="gal__main${imgs.length ? '' : ' gal__main--empty'}" data-gal-main>
          <span class="gal__ticks" aria-hidden="true"></span>
          ${imgs.length ? `<img class="gal__img" src="${r}${imgs[0].src}"${imgSize(imgs[0].src)} alt="${esc(p.name)}" decoding="async">` : PLACEHOLDER(p.name)}
          <span class="gal__stamp mono" aria-hidden="true">${esc(s.title)}</span>
        </div>
        ${imgs.length > 1 ? `<div class="gal__thumbs" role="group" aria-label="Изображения продукта">
${imgs.map((im, i) => `          <button class="gal__thumb${i === 0 ? ' is-current' : ''}" type="button" data-gal="${r}${im.src}" aria-label="Изображение ${i + 1}"><img src="${r}${im.src}"${imgSize(im.src)} alt="" loading="lazy" decoding="async"></button>`).join('\n')}
        </div>` : ''}
      </div>`;

  const main = `<section class="product">
  <div class="container">
    ${crumbs(r, [['Программное обеспечение', `${r}software/index.html`], [s.title, secUrl(r, s.slug)], [p.name]])}
    <div class="product__grid">
      ${gallery}
      <div class="product__info">
        <p class="product__cat mono"><a href="${secUrl(r, s.slug)}">${esc(s.title)}</a>${p.isNew ? '<span class="prod__new prod__new--inline mono">New</span>' : ''}</p>
        <h1 class="product__title">${esc(p.name)}</h1>
        ${p.short ? `<p class="product__lead">${esc(p.short)}</p>` : ''}
        <div class="buy">
          <div class="buy__row">
            ${p.price ? `<span class="buy__price mono">${rub(p.price)}</span><span class="buy__note mono">цена лицензии по прайс-листу</span>` : '<span class="buy__note mono">цена по запросу</span>'}
          </div>
          <div class="buy__row buy__row--act">
            <a class="btn btn--primary btn--lg" href="${askHref(p.name)}">Запросить</a>
            <a class="btn btn--outline" href="${r}contacts.html#departments">Отдел ПО</a>
          </div>
          <p class="buy__status mono">Поставка по лицензионному соглашению, сопровождение 12 месяцев в составе поставки.</p>
        </div>
        ${licenseBlock()}
      </div>
    </div>
  </div>
</section>

${p.description ? `<section class="pdesc">
  <div class="container pdesc__grid">
    <p class="pdesc__label mono">Описание</p>
    <div class="prose">
${content(p.description, r)}
    </div>
  </div>
</section>` : ''}

${related.length ? `<section class="related">
  <div class="container">
    <div class="section-head section-head--row">
      <h2 class="h2">Другие продукты раздела</h2>
      <a class="link-more" href="${secUrl(r, s.slug)}">Весь раздел ${ARROW}</a>
    </div>
    <div class="related__list">
${related.map(x => '      ' + prodCard(r, x)).join('\n')}
    </div>
  </div>
</section>` : ''}`;
  return shell({
    r, page: 'software', here: `software/${p.section}.html`,
    title: `${p.name} — СНК`, desc: p.short || `${p.name}: описание, цена лицензии, условия поставки.`, main,
  });
}

/* =========================================================
   Новости
   ========================================================= */
const TAGS = [...new Set(NEWS.map(n => n.tag))];
function newsCard(r, n) {
  return `<article class="ncard ncard--row" data-tag="${esc(n.tag)}" data-reveal-item>
        <div class="ncard__meta">
          <time datetime="${n.date}" class="mono">${rusDate(n.date)}</time>
          <span class="tag">${esc(n.tag)}</span>
        </div>
        <h2 class="ncard__title"><a href="${r}news/${n.slug}.html">${esc(n.title)}</a></h2>
        <p class="ncard__lead">${esc(n.lead)}…</p>
        <span class="ncard__more">Читать</span>
      </article>`;
}
function pageNewsIndex() {
  const r = '';
  const main = `${phead({
    r, trail: [['Новости']], title: 'Новости',
    lead: `Обновления программ СНК, изменения в&nbsp;законодательстве и&nbsp;работе сервисов: ${NEWS.length} записей с&nbsp;${NEWS.at(-1).date.slice(0, 4)} года.`,
    sheet: 'СНК · Новости · Лист 1',
  })}

<section class="news-list">
  <div class="container">
    <div class="docs__bar">
      <div class="docs__tabs" role="group" aria-label="Фильтр новостей">
        <button class="docs__tab is-current" type="button" data-news-tag="all" aria-pressed="true">Все <span class="mono">${NEWS.length}</span></button>
${TAGS.map(t => `        <button class="docs__tab" type="button" data-news-tag="${esc(t)}" aria-pressed="false">${esc(t)} <span class="mono">${NEWS.filter(n => n.tag === t).length}</span></button>`).join('\n')}
      </div>
    </div>
    <div class="news-list__items" data-news-items>
${NEWS.map(n => '      ' + newsCard(r, n)).join('\n')}
    </div>
    <p class="news-list__empty" hidden>По этому фильтру новостей нет.</p>
    <div class="news-list__more">
      <button class="btn btn--outline" type="button" data-news-more hidden>Показать ещё</button>
    </div>
  </div>
</section>`;
  return shell({ r, page: 'company', here: 'news.html', title: 'Новости — Сибнефтекарт', desc: 'Обновления программ СНК-АЗС, СНК-Офис, СНК-ПЦ и других продуктов, новости компании.', main });
}

function pageNewsItem(n, i) {
  const r = '../';
  const prev = NEWS[i + 1], next = NEWS[i - 1];
  const main = `<article class="article">
  <div class="container">
    ${crumbs(r, [['Новости', `${r}news.html`], [n.title]])}
    <header class="article__head">
      <p class="article__meta mono"><time datetime="${n.date}">${rusDate(n.date)}</time> <span class="tag">${esc(n.tag)}</span></p>
      <h1 class="article__title">${esc(n.title)}</h1>
    </header>
    <div class="prose article__body">
${content(n.body, r)}
    </div>
    <nav class="article__nav" aria-label="Другие новости">
      ${next ? `<a class="article__nav-link article__nav-link--prev" href="${r}news/${next.slug}.html"><span class="mono">Следующая</span><span>${esc(next.title)}</span></a>` : '<span></span>'}
      ${prev ? `<a class="article__nav-link article__nav-link--next" href="${r}news/${prev.slug}.html"><span class="mono">Предыдущая</span><span>${esc(prev.title)}</span></a>` : '<span></span>'}
    </nav>
    <p class="article__back"><a class="link-more" href="${r}news.html">Все новости ${ARROW}</a></p>
  </div>
</article>`;
  return shell({ r, page: 'company', here: 'news.html', title: `${n.title} — новости СНК`, desc: n.lead.slice(0, 160), main });
}

/* =========================================================
   О компании
   ========================================================= */
function pageCompany() {
  const r = '';
  const certs = COMPANY.certificates;
  const main = `${phead({
    r, trail: [['О компании']], title: 'О компании',
    lead: 'ООО «Сибнефтекарт», Томск: собственное программное обеспечение под&nbsp;брендом СНК для&nbsp;автоматизации учёта топлива и&nbsp;товаров на&nbsp;АЗС и&nbsp;нефтебазах, его внедрение и&nbsp;сопровождение.',
    sheet: 'СНК · О компании · Лист 1',
    aside: facts([['в ИТ', 'с&nbsp;2017'], ['реестр ПО', '№&nbsp;2022616071'], ['ОКВЭД', '62.01']]),
  })}

<section class="about" id="actions">
  <div class="container about__grid">
    <div class="about__intro">
      <p class="about__lead">Ключевой продукт компании&nbsp;— программное обеспечение для&nbsp;АЗС «СНК-АЗС», с&nbsp;2022 года зарегистрировано в&nbsp;российском реестре программного обеспечения под&nbsp;номером 2022616071.</p>
      <ul class="stack mono" aria-label="Технологический стек">
${['C#', 'C++', 'Go', 'TypeScript / Vue', '1С', '.NET 9', '.NET Framework 4.7', 'FastReport', 'MySQL', 'PostgreSQL', 'Docker']
    .map(t => `        <li>${t}</li>`).join('\n')}
      </ul>
      <a class="link-more" href="${r}software/index.html">Программное обеспечение ${ARROW}</a>
    </div>
    <div class="about__dirs prose">
${content(COMPANY.about, r)}
    </div>
  </div>
</section>

<section class="certs" id="certificates">
  <div class="container">
    <div class="section-head section-head--row">
      <div class="section-head__col">
        <h2 class="h2">Сертификаты</h2>
        <p class="section-head__text">Регистрация в&nbsp;Роспатенте, сертификаты соответствия и&nbsp;интеграции с&nbsp;оборудованием партнёров.</p>
      </div>
    </div>
    <ul class="gallery gallery--certs" data-lightbox>
${certs.map((c, i) => exists(c.src)
    ? `      <li><button class="gallery__item" type="button" data-index="${i}" data-src="${r}${c.src}" aria-label="Открыть: ${esc(c.title)}">
        <img src="${r}${c.src}"${imgSize(c.src)} alt="${esc(c.title)}" loading="lazy" decoding="async">
        <span class="gallery__cap">${esc(c.title)}</span>
      </button></li>`
    // картинка ещё не скачана (node tools/fetch-images.mjs) — карточка не кликабельна
    : `      <li><div class="gallery__item gallery__item--empty">
        ${PLACEHOLDER(c.title)}
        <span class="gallery__cap">${esc(c.title)} <a href="${c.url}" target="_blank" rel="noopener">смотреть на sncard.ru ↗</a></span>
      </div></li>`).join('\n')}
    </ul>
  </div>
</section>

<dialog class="lightbox" id="lightbox" aria-label="Сертификат">
  <div class="lightbox__frame">
    <img class="lightbox__img" src="" alt="">
    <p class="lightbox__cap mono"></p>
  </div>
  <button class="lightbox__btn lightbox__btn--prev" type="button" data-lb="-1" aria-label="Предыдущий сертификат"><svg aria-hidden="true"><use href="#i-arrow"/></svg></button>
  <button class="lightbox__btn lightbox__btn--next" type="button" data-lb="1" aria-label="Следующий сертификат"><svg aria-hidden="true"><use href="#i-arrow"/></svg></button>
  <button class="lightbox__close" type="button" data-lb-close aria-label="Закрыть"><svg aria-hidden="true"><use href="#i-close"/></svg></button>
</dialog>`;
  return shell({ r, page: 'company', here: 'company.html', title: 'О компании — ООО «Сибнефтекарт»', desc: 'ООО «Сибнефтекарт»: направления деятельности, технологический стек, сертификаты.', main });
}

/* =========================================================
   Обслуживание ККТ
   ========================================================= */
function kktTable(group) {
  const specCols = Math.max(0, ...group.rows.map(r => r.specs.length));
  return `<div class="ptable-wrap">
        <table class="ptable ptable--kkt">
          <caption class="sr-only">${esc(group.note)}</caption>
          <thead><tr><th scope="col" class="ptable__corner mono">№</th><th scope="col">Модель</th><th scope="col" class="mono">Цена</th>${specCols ? '<th scope="col">Характеристики</th>' : ''}</tr></thead>
          <tbody>
${group.rows.map(row => `            <tr data-kkt-row>
              <td class="mono">${row.n}</td>
              <th scope="row">${esc(row.model)}</th>
              <td class="mono">${esc(row.price || '—')}</td>
              ${specCols ? `<td class="ptable__specs">${row.specs.map(s => `<span class="chip-mini mono">${esc(s)}</span>`).join(' ')}</td>` : ''}
            </tr>`).join('\n')}
          </tbody>
        </table>
      </div>`;
}
function pageKkt() {
  const r = '';
  const total = KKT.shtrih.rows.length + KKT.atol.rows.length;
  const main = `${phead({
    r, trail: [['Обслуживание ККТ']], title: 'Обслуживание ККТ',
    lead: `Контрольно-кассовая техника «Штрих-М» и&nbsp;«Атол», фискальные накопители и&nbsp;сублицензионные договоры. Цены на&nbsp;кассы договорные&nbsp;— напишите нам, подберём модель под&nbsp;вашу АЗС.`,
    sheet: 'СНК · ККТ · Лист 1',
    aside: facts([['моделей ККТ', total], ['накопители', KKT.fn.rows.length]]),
  })}

<section class="kkt">
  <div class="container">
    <div class="docs__bar">
      <div class="docs__tabs" role="group" aria-label="Разделы">
        <a class="docs__tab" href="#shtrih">ККТ «Штрих-М» <span class="mono">${KKT.shtrih.rows.length}</span></a>
        <a class="docs__tab" href="#atol">ККТ «Атол» <span class="mono">${KKT.atol.rows.length}</span></a>
        <a class="docs__tab" href="#fn">Фискальные накопители <span class="mono">${KKT.fn.rows.length}</span></a>
        <a class="docs__tab" href="#contracts">Договоры <span class="mono">${KKT.contracts.length}</span></a>
      </div>
      <div class="docs__search">
        <svg aria-hidden="true"><use href="#i-search"/></svg>
        <input class="docs__input" type="search" id="kkt-search" placeholder="Поиск по модели" aria-label="Поиск по модели ККТ" data-kkt-search>
      </div>
    </div>

${[KKT.shtrih, KKT.atol, KKT.fn].map(g => `    <section class="docsec" id="${g.anchor}" aria-labelledby="${g.anchor}-t">
      <div class="docsec__head">
        <h2 class="h2" id="${g.anchor}-t">${esc(g.title)}</h2>
        <p class="docsec__count mono">${g.rows.length} ${plural(g.rows.length, ['позиция', 'позиции', 'позиций'])}</p>
      </div>
      ${kktTable(g)}
    </section>`).join('\n\n')}

    <section class="docsec" id="contracts" aria-labelledby="contracts-t">
      <div class="docsec__head">
        <h2 class="h2" id="contracts-t">Договоры</h2>
        <p class="docsec__count mono">${filesN(KKT.contracts.length)}</p>
      </div>
      <ul class="lic">
${KKT.contracts.map(c => `        <li><a class="lic__link" href="${c.href}" target="_blank" rel="noopener"><span class="ftype mono" data-type="pdf">pdf</span><span>${esc(c.title)}</span><svg class="docitem__ic" aria-hidden="true"><use href="#i-doc"/></svg></a></li>`).join('\n')}
      </ul>
    </section>

    <p class="kkt__note">Стоимость ККТ уточняется под конфигурацию: напишите на <a href="mailto:${MAIL}">${MAIL}</a> или позвоните в приёмную <a href="tel:+73822651030">+7 (3822) 65-10-30</a>.</p>
  </div>
</section>`;
  return shell({ r, page: 'kkt', here: 'kkt.html', title: 'Обслуживание ККТ — Сибнефтекарт', desc: 'Кассовая техника «Штрих-М» и «Атол», фискальные накопители, сублицензионные договоры.', main });
}

/* =========================================================
   Документация
   ========================================================= */
const TRK = COMPANY.articlesTrk;
const trkBySlug = new Map(TRK.map(a => [a.id, a]));
function docsBlock(r) {
  const total = DOCS.reduce((n, g) => n + g.items.length, 0);
  return { total, html: `<div class="docsec__groups">
${DOCS.map(g => `      <section class="docgroup" data-group>
        <div class="docgroup__head">
          <h2 class="docgroup__title">${esc(g.title)}</h2>
          <p class="docgroup__count mono">${filesN(g.items.length)}</p>
        </div>
        <ul class="doclist">
${g.items.map(it => {
    const art = it.article && trkBySlug.get(it.article);
    const href = art ? `${r}docs/${art.slug}.html` : it.href;
    const type = art ? 'txt' : it.type;
    const blank = art ? '' : ' target="_blank" rel="noopener"';
    return `          <li class="docitem" data-doc><a class="docitem__link" href="${href}"${blank}>
            <span class="ftype mono" data-type="${esc(type)}">${esc(type === 'link' ? 'web' : type)}</span>
            <span class="docitem__title">${esc(it.title)}</span>
            <svg class="docitem__ic" aria-hidden="true"><use href="#${art ? 'i-arrow' : 'i-download'}"/></svg>
          </a></li>`;
  }).join('\n')}
        </ul>
      </section>`).join('\n')}
    </div>` };
}
function pageDocs() {
  const r = '';
  const { total, html } = docsBlock(r);
  const main = `${phead({
    r, trail: [['Документация']], title: 'Документация',
    lead: `Руководства, инструкции по&nbsp;подключению оборудования и&nbsp;ссылки на&nbsp;обновления программ СНК: ${filesN(total)} в&nbsp;${DOCS.length} группах.`,
    sheet: 'СНК · Документация · Лист 1',
    aside: facts([['файлов', total], ['групп', DOCS.length]]),
  })}

<section class="docs">
  <div class="container">
    <div class="docs__bar">
      <div class="docs__tabs">
        <a class="docs__tab" href="${SVC}docs.html#equipment">Оборудование для АЗС <span class="mono">↗</span></a>
        <a class="docs__tab" href="${KB}" target="_blank" rel="noopener">База знаний <span class="mono">↗</span></a>
      </div>
      <div class="docs__search">
        <svg aria-hidden="true"><use href="#i-search"/></svg>
        <input class="docs__input" type="search" id="docs-search" placeholder="Поиск по названию" aria-label="Поиск по документации" data-docs-search>
      </div>
    </div>
    <p class="docs__empty" hidden>Ничего не нашлось. Попробуйте другое слово или посмотрите <a href="${KB}" target="_blank" rel="noopener">Базу знаний</a>.</p>
    ${html}
  </div>
</section>`;
  return shell({ r, page: 'docs', here: 'docs.html', title: 'Документация — программное обеспечение СНК', desc: 'Руководства пользователя и администратора, инструкции по подключению ТРК, банковских терминалов и мобильных сервисов.', main });
}
function pageTrkArticle(a) {
  const r = '../';
  const main = `<article class="article">
  <div class="container">
    ${crumbs(r, [['Документация', `${r}docs.html`], [a.title]])}
    <header class="article__head">
      <p class="article__meta mono">Инструкция по подключению</p>
      <h1 class="article__title">${esc(a.title)}</h1>
    </header>
    <div class="prose article__body">
${content(a.body, r)}
    </div>
    <p class="article__back"><a class="link-more" href="${r}docs.html">Вся документация ${ARROW}</a></p>
  </div>
</article>`;
  return shell({ r, page: 'docs', here: 'docs.html', title: `${a.title} — документация СНК`, desc: `${a.title}: инструкция по подключению к СНК-АЗС.`, main });
}

/* =========================================================
   Партнёры
   ========================================================= */
function pagePartners() {
  const r = '';
  const total = PARTNERS.reduce((n, g) => n + g.items.length, 0);
  const main = `${phead({
    r, trail: [['Партнёры']], title: 'Партнёры',
    lead: `Производители и&nbsp;поставщики оборудования, разработчики технологий и&nbsp;мобильных сервисов, сервисные компании и&nbsp;сети АЗС, работающие на&nbsp;программах СНК.`,
    sheet: 'СНК · Партнёры · Лист 1',
    aside: facts([['компаний', total], ['групп', PARTNERS.length]]),
  })}

<section class="partners">
  <div class="container">
    <div class="docs__bar">
      <div class="docs__tabs">
${PARTNERS.map(g => `        <a class="docs__tab" href="#${g.anchor}">${esc(g.title.replace(/^Производители и поставщики оборудования.*/, 'Оборудование'))} <span class="mono">${g.items.length}</span></a>`).join('\n')}
      </div>
    </div>
${PARTNERS.map(g => `    <section class="docsec" id="${g.anchor}" aria-labelledby="${g.anchor}-t">
      <div class="docsec__head">
        <h2 class="h2" id="${g.anchor}-t">${esc(g.title)}</h2>
        <p class="docsec__count mono">${g.items.length}</p>
      </div>
      <ul class="pgrid">
${g.items.map(p => `        <li class="pcard" data-reveal-item>
          <div class="pcard__logo">${p.logo && exists(p.logo) ? `<img src="${r}${p.logo}"${imgSize(p.logo)} alt="" loading="lazy" decoding="async">` : `<span class="pcard__mono mono">${esc(p.name.replace(/[«»"]/g, '').split(' ').slice(0, 2).join(' '))}</span>`}</div>
          <h3 class="pcard__name">${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a>` : esc(p.name)}</h3>
          ${p.desc ? `<p class="pcard__text">${esc(p.desc)}</p>` : ''}
        </li>`).join('\n')}
      </ul>
    </section>`).join('\n\n')}
  </div>
</section>`;
  return shell({ r, page: 'company', here: 'partners.html', title: 'Партнёры — Сибнефтекарт', desc: 'Партнёры ООО «Сибнефтекарт»: поставщики оборудования и технологий, сервисные компании, сети АЗС.', main });
}

/* =========================================================
   Контакты
   ========================================================= */
const DEPTS = [
  {
    id: 'support', title: 'Информационная и техническая поддержка систем управления для АЗС и нефтебаз', people: [
      ['Бондаренко Евгений Владимирович', 'информационная поддержка систем управления для АЗС, нефтебаз', 'bev@sncard.ru'],
      ['Драганов Владимир Александрович', 'начальник отдела программного обеспечения', 'dva@sncard.ru'],
      ['Апет Юрий Геннадьевич', 'начальник технического отдела', 'kkt@sncard.ru'],
    ],
  },
  {
    id: 'processing', title: 'Информационная и техническая поддержка процессингового центра', people: [
      ['Клименко Анатолий Яковлевич', 'заместитель генерального директора', 'kaj@sncard.ru'],
      ['Чащин Алексей Валентинович', 'информационная поддержка процессингового центра', 'cav@sncard.ru'],
    ],
  },
  {
    id: 'admin', title: 'Администрация', people: [
      ['Матусевич Леонид Робертович', 'генеральный директор', 'mlr@sncard.ru'],
      ['Белоусова Елена Игоревна', 'главный бухгалтер', 'bei@sncard.ru'],
    ],
  },
];
function pageContacts() {
  const r = '';
  const officePlan = (read('index.html').match(/<!-- gen:office -->\n([\s\S]*?)\n<!-- \/gen:office -->/) || [, ''])[1];
  const main = `${phead({
    r, trail: [['Контакты']], title: 'Контакты',
    lead: 'Поддержка программ СНК, вопросы по&nbsp;лицензиям, внедрению, процессингу и&nbsp;обслуживанию ККТ.',
    sheet: 'СНК · Контакты · Лист 1',
    aside: facts([['поддержка', '24/7'], ['приёмная', '<a href="tel:+73822651030">65-10-30</a>']]),
  })}

<section class="reach reach--page">
  <div class="container">
    <div class="reach__grid">
      <article class="office" id="adress">
        <div class="office__plan" aria-hidden="true">
${officePlan}
        </div>
        <div class="office__body">
          <h2 class="office__title">Офис в&nbsp;Томске</h2>
          <p class="office__addr">634009, г. Томск, ул. Розы Люксембург, д. 55</p>
          <p class="office__coords mono">56°29′55″ с. ш. · 84°57′05″ в. д.</p>
          <a class="link-more" href="https://yandex.ru/maps/?rtext=~56.49865,84.95144&amp;rtt=auto" target="_blank" rel="noopener">Построить маршрут <svg aria-hidden="true"><use href="#i-route"/></svg><span class="sr-only"> — Яндекс Карты, откроется в новой вкладке</span></a>
        </div>
      </article>

      <div class="reach__lines" id="main">
        <div class="line-card line-card--hot">
          <span class="line-card__label">Круглосуточная поддержка СНК-АЗС</span>
          <a class="line-card__value" href="tel:+78002500534">8 800 250-05-34</a>
          <span class="line-card__sub">горячая линия: <a href="tel:+79138503307">+7 (913) 850-33-07</a> · Telegram <a href="https://t.me/+79833460050" target="_blank" rel="noopener">+7 (983) 346-00-50</a></span>
          <button class="copy" type="button" data-copy="8 800 250-05-34" aria-label="Скопировать телефон поддержки">
            <svg class="copy__icon" aria-hidden="true"><use href="#i-copy"/></svg>
            <svg class="copy__done" aria-hidden="true"><use href="#i-check"/></svg>
          </button>
        </div>
        <div class="line-card">
          <span class="line-card__label">Приёмная, многоканальный</span>
          <a class="line-card__value" href="tel:+73822651030">+7 (3822) 65-10-30</a>
          <button class="copy" type="button" data-copy="+7 (3822) 65-10-30" aria-label="Скопировать телефон приёмной">
            <svg class="copy__icon" aria-hidden="true"><use href="#i-copy"/></svg>
            <svg class="copy__done" aria-hidden="true"><use href="#i-check"/></svg>
          </button>
        </div>
        <div class="line-card">
          <span class="line-card__label">Электронная почта</span>
          <a class="line-card__value" href="mailto:${MAIL}">${MAIL}</a>
          <button class="copy" type="button" data-copy="${MAIL}" aria-label="Скопировать адрес почты">
            <svg class="copy__icon" aria-hidden="true"><use href="#i-copy"/></svg>
            <svg class="copy__done" aria-hidden="true"><use href="#i-check"/></svg>
          </button>
        </div>
      </div>

      <div class="depts" id="departments">
${DEPTS.map(d => `        <div class="dept" id="${d.id}">
          <h2 class="dept__title">${esc(d.title)}</h2>
          <ul class="dept__people">
${d.people.map(([name, role, mail]) => `            <li><span class="dept__name">${esc(name)}</span><span class="dept__role">${esc(role)}</span><a class="dept__mail mono" href="mailto:${mail}">${mail}</a></li>`).join('\n')}
          </ul>
          <a class="dept__phone mono" href="tel:+73822651030">8 (3822) 65-10-30</a>
        </div>`).join('\n')}
      </div>

      <p class="people__note">Обработка персональных данных для распространения осуществляется на основании отдельного согласия указанных сотрудников, оформленного в соответствии с требованиями статьи 10.1 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».</p>
    </div>
  </div>
</section>`;
  return shell({ r, page: 'contacts', here: 'contacts.html', title: 'Контакты — ООО «Сибнефтекарт»', desc: 'Телефоны поддержки и приёмной, почта, отделы и специалисты, адрес офиса в Томске.', main });
}

/* =========================================================
   Политики
   ========================================================= */
function policyBlock(key) {
  const P = POLICIES[key];
  const id = i => `p-${i + 1}`;
  const toc = P.sections.map((s, i) => `            <li><a class="toc__link" href="#${id(i)}">${esc(s.title.replace(/^\d+\.\s*/, ''))}</a></li>`).join('\n');
  const body = [
    ...P.intro.map(t => `        <p class="policy__intro">${esc(t)}</p>`),
    ...P.sections.map((s, i) => {
      const blocks = [];
      let list = null;
      for (const b of s.blocks) {
        if (/^[–—-]\s/.test(b)) { (list ||= []).push(b.replace(/^[–—-]\s*/, '')); continue; }
        if (list) { blocks.push(`          <ul>${list.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`); list = null; }
        const m = b.match(/^(\d+\.\d+\.)\s*(.*)$/);
        blocks.push(m
          ? `          <p class="policy__p"><span class="policy__n mono">${m[1]}</span>${esc(m[2])}</p>`
          : `          <p>${esc(b)}</p>`);
      }
      if (list) blocks.push(`          <ul>${list.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`);
      const num = (s.title.match(/^(\d+)\./) || [, String(i + 1)])[1];
      return `        <section class="policy__sec" id="${id(i)}" aria-labelledby="${id(i)}-t">
          <h2 class="policy__h" id="${id(i)}-t"><span class="policy__num mono">${String(num).padStart(2, '0')}</span>${esc(s.title.replace(/^\d+\.\s*/, ''))}</h2>
${blocks.join('\n')}
        </section>`;
    }),
  ].join('\n');
  return `<div class="policy__grid">
      <nav class="toc" aria-label="Содержание">
        <p class="toc__title mono">Содержание</p>
        <ol class="toc__list">
${toc}
        </ol>
      </nav>
      <div class="policy prose">
${body}
      </div>
    </div>`;
}
function pagePolicy(key, file, page) {
  const r = '';
  const P = POLICIES[key];
  const main = `${phead({
    r, trail: [[P.title]], title: esc(P.title),
    lead: 'Текст документа перенесён с&nbsp;сайта sncard.ru без&nbsp;изменений.',
    sheet: `СНК · ${P.title} · Лист 1`,
  })}

<section class="policy-wrap">
  <div class="container">
    ${policyBlock(key)}
  </div>
</section>`;
  return shell({ r, page, here: file, title: `${P.title} — Сибнефтекарт`, desc: `${P.title} ООО «Сибнефтекарт».`, main });
}

/* =========================================================
   Сборка
   ========================================================= */
const out = [];
const put = (f, html) => { write(f, html); out.push(f); };

put('software/index.html', pageSoftwareIndex());
for (const s of SECTIONS) put(`software/${s.slug}.html`, pageSection(s));
for (const p of PRODUCTS) put(`software/${p.section}/${p.slug}.html`, pageProduct(p));
put('news.html', pageNewsIndex());
NEWS.forEach((n, i) => put(`news/${n.slug}.html`, pageNewsItem(n, i)));
put('company.html', pageCompany());
put('kkt.html', pageKkt());
put('docs.html', pageDocs());
for (const a of TRK) put(`docs/${a.slug}.html`, pageTrkArticle(a));
put('partners.html', pagePartners());
put('contacts.html', pageContacts());
put('privacy.html', pagePolicy('privacy', 'privacy.html', 'privacy'));
put('cookies.html', pagePolicy('cookies', 'cookies.html', 'cookies'));
put('consent.html', pagePolicy('consent', 'consent.html', 'consent'));

/* Главная: обновляем общие блоки */
{
  const f = 'index.html';
  let h = read(f);
  const page = (h.match(/<body[^>]*data-page="([^"]+)"/) || [, ''])[1];
  const block = (name, contentHtml) => {
    const re = new RegExp(`(<!-- @${name}:start -->)[\\s\\S]*?(<!-- @${name}:end -->)`);
    if (!re.test(h)) throw new Error(`${f}: нет блока @${name}`);
    h = h.replace(re, (m, a, b) => `${a}\n${contentHtml}\n${b}`);
  };
  block('header', header('', page, f));
  block('footer', footer(''));
  write(f, h);
  out.push(f);
}

const missing = [...new Set(out.flatMap(f => [...read(f).matchAll(/class="noimg"/g)].map(() => f)))].length;
console.log(`Готово: ${out.length} страниц. Страниц с заглушками вместо фото: ${missing}.`);
