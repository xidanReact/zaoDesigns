#!/usr/bin/env node
/* =========================================================
   СНК · snc-service — генератор статических страниц (без зависимостей).
   Запуск из любой папки:  node snc-service/tools/generate.mjs

   Что делает:
   1. Строит страницы каталога из data/catalog.js:
        equipment/index.html, equipment/<категория>.html,
        equipment/<категория>/<товар>.html
   2. Во все страницы сайта вставляет одинаковые общие блоки
      между маркерами-комментариями:
        <!-- @sprite:start --> … <!-- @sprite:end -->   (иконки; эталон — index.html)
        <!-- @header:start --> … <!-- @header:end -->   (шапка + мобильное меню)
        <!-- @footer:start --> … <!-- @footer:end -->   (футер + курсор)
      и блоки данных <!-- gen:имя --> … <!-- /gen:имя -->:
        home-bento (index), docs (docs.html), prices / examples (cards.html),
        policy (privacy.html, cookies.html).
   Активный пункт меню берётся из <body data-page="…">.
   Сгенерированные файлы хранятся в репозитории — сайт работает без сборки.
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const CATALOG = require(path.join(ROOT, 'data/catalog.js'));
const DOCS = require(path.join(ROOT, 'data/docs.js'));
const CARDS = require(path.join(ROOT, 'data/cards.js'));
const POLICIES = require(path.join(ROOT, 'data/policies.js'));

const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const write = (f, s) => {
  fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, f), mapLinks(s, '../'.repeat(f.split('/').length - 1)));
};

/* ---------- Файлы со старого сайта → локальные копии в files/ ----------
   Карта data/files.json «путь на старом сайте → файл в files/» (качает
   tools/fetch-files.mjs); null — файла нет и на старом сайте: пункт списка
   со ссылкой убирается, в тексте остаётся подпись без ссылки. */
const FILES = fs.existsSync(path.join(ROOT, 'data/files.json')) ? JSON.parse(read('data/files.json')) : {};
const SNCARD = 'https://xidanreact.github.io/zaoDesigns/sncard/';
const DEAD_FILE = '#dead-file';
function mapOld(url, r) {
  const u = new URL(url);
  const pathname = decodeURI(u.pathname);
  if (pathname in FILES) {
    const f = FILES[pathname];
    if (!f) return DEAD_FILE;
    return fs.existsSync(path.join(ROOT, f)) ? r + f : url; // ещё не скачан — пока ведём на исходный
  }
  if (pathname === '/azs-menu-product') return `${SNCARD}software/avtomatizatsiya-azs/snk-azs-programma-dlya-avtomatizatsii-azs.html`;
  return url;
}
const isDead = href => /^https?:\/\/(snc-service\.sncard\.ru|www\.sncard\.ru)\//.test(href || '') && mapOld(href, '') === DEAD_FILE;
function mapLinks(html, r) {
  return html
    .replace(/(href|src)="(https?:\/\/(?:snc-service\.sncard\.ru|www\.sncard\.ru)[^"]*)"/g, (m, attr, url) => `${attr}="${mapOld(url.replace(/^http:/, 'https:'), r)}"`)
    .replace(/<li[^>]*>\s*<a [^>]*href="#dead-file"[^>]*>[\s\S]*?<\/a>\s*<\/li>\s*/g, '')
    .replace(/<a [^>]*href="#dead-file"[^>]*>([\s\S]*?)<\/a>/g, '$1');
}
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nb = s => String(s).replace(/ /g, ' ');
const rub = n => nb(n.toLocaleString('ru-RU').replace(/ | /g, ' ')) + ' ₽';
const plural = (n, [one, few, many]) => {
  const a = n % 10, b = n % 100;
  return (a === 1 && b !== 11) ? one : (a >= 2 && a <= 4 && (b < 10 || b >= 20)) ? few : many;
};
const goods = n => `${n} ${plural(n, ['товар', 'товара', 'товаров'])}`;
const files = n => `${n} ${plural(n, ['файл', 'файла', 'файлов'])}`;
const fmtSize = b => b >= 1048576 ? `${(b / 1048576).toFixed(1).replace('.', ',')} МБ` : `${Math.max(1, Math.round(b / 1024))} КБ`;

/* ---------- Каталог: производные данные ---------- */
const CATS = CATALOG.categories;
const PRODUCTS = CATALOG.products;
const byCat = slug => PRODUCTS.filter(p => p.category === slug);
const minPrice = slug => Math.min(...byCat(slug).map(p => p.price));
const catMeta = {
  'kontrollery-upravleniya': { icon: 'c-ctrl', blurb: 'Концентраторы ТРК, блоки сопряжения с&nbsp;ГНК&nbsp;УЗСГ и&nbsp;весовыми установками УНСГ, блок управления СНК-МВ и&nbsp;контроллеры расширения.' },
  'preobrazovateli-interfejsov': { icon: 'c-conv', blurb: 'USB, RS232 и&nbsp;Ethernet в&nbsp;токовую петлю, RS485 и&nbsp;интерфейс ТРК Tokheim.' },
  'pos-terminaly': { icon: 'c-term', blurb: 'ТБР, СНК-S380 и&nbsp;PinPad СНК-Р90.' },
  'schityvateli': { icon: 'c-read', blurb: 'Бесконтактные карты Mifare, подключение по&nbsp;USB.' },
  'modemy-gprs': { icon: 'c-modem', blurb: 'Кабель DB9M-DB9F.' },
  'gromkaya-svyaz': { icon: 'c-voice', blurb: 'ПГУ «Клиент» для АЗС и&nbsp;АЗК, рупорный громкоговоритель 25ГРДП.' },
  'rasshiriteli-som-portov': { icon: 'c-com', blurb: 'Платы Orient на&nbsp;2 и&nbsp;4 порта для PCI и&nbsp;PCI-E.' },
  'komplektatsiya-dlya-tbr': { icon: 'c-tbr', blurb: 'Переходник, блок питания и&nbsp;кабели для терминала.' },
};
const catMetaLine = c => {
  const n = byCat(c.slug).length;
  return `${goods(n)} · ${n > 1 ? 'от ' : ''}${rub(minPrice(c.slug))}`;
};
const catUrl = (r, slug) => `${r}equipment/${slug}.html`;
const prodUrl = (r, p) => `${r}equipment/${p.category}/${p.slug}.html`;

/* =========================================================
   Общие блоки: шапка, мобильное меню, футер
   ========================================================= */
const NAV = [
  { key: 'company', label: 'О компании', links: [['company.html', 'О компании'], ['company.html#actions', 'Направления деятельности']] },
  { key: 'equipment', label: 'Оборудование', mega: true },
  { key: 'cards', label: 'Изготовление карт', links: [['cards.html#rfid', 'Бесконтактные карты Mifare'], ['cards.html#examples', 'Примеры дизайна карт']] },
  { key: 'docs', label: 'Документация', links: [['docs.html#equipment', 'Оборудование для АЗС'], ['docs.html#useful', 'Полезное']] },
  { key: 'contacts', label: 'Контакты', links: [['contacts.html#main', 'Основные'], ['contacts.html#admin', 'Администрация'], ['contacts.html#adress', 'Местоположение на карте']] },
];
const ARROW = '<svg aria-hidden="true"><use href="#i-arrow"/></svg>';
const DOT = '<span class="dd__dot" aria-hidden="true"></span>'; // пункт без подменю

function header(r, page, here = '') {
  const cur = href => (here && href === here ? ' aria-current="page"' : '');
  const items = NAV.map(n => {
    const isCur = n.key === page;
    let dd;
    if (n.mega) {
      dd = `          <div class="dd dd--mega" id="dd-${n.key}">
            <ul class="dd__list">
${CATS.map(c => `              <li><a class="dd__link" href="${catUrl(r, c.slug)}"${cur(`equipment/${c.slug}.html`)}><svg class="dd__ic" aria-hidden="true"><use href="#${catMeta[c.slug].icon}"/></svg><span>${esc(c.title)}</span><small class="mono">${byCat(c.slug).length}</small></a></li>`).join('\n')}
              <li class="dd__all"><a class="dd__link" href="${r}equipment/index.html"${cur('equipment/index.html')}><span>Весь каталог</span><small class="mono">${PRODUCTS.length}</small></a></li>
            </ul>
          </div>`;
    } else {
      dd = `          <div class="dd" id="dd-${n.key}">
            <ul class="dd__list">
${n.links.map(([h, t]) => `              <li><a class="dd__link" href="${r}${h}"${cur(h)}>${t} ${DOT}</a></li>`).join('\n')}
            </ul>
          </div>`;
    }
    return `        <li class="nav__item has-dd${isCur ? ' is-current' : ''}" data-nav="${n.key}">
          <button class="nav__link nav__trigger" type="button" aria-expanded="false" aria-controls="dd-${n.key}">
            ${n.label} <svg class="nav__chev" aria-hidden="true"><use href="#i-chevron"/></svg>
          </button>
${dd}
        </li>`;
  }).join('\n');

  const mitems = NAV.map(n => {
    const links = n.mega
      ? [...CATS.map(c => [`equipment/${c.slug}.html`, c.title]), ['equipment/index.html', 'Весь каталог']]
      : n.links;
    return `      <li>
        <details class="mmenu__group"${n.key === page ? ' open' : ''}>
          <summary class="mmenu__link">${n.label} <svg aria-hidden="true"><use href="#i-chevron"/></svg></summary>
${links.map(([h, t]) => `          <a href="${r}${h}"${cur(h)}>${esc(t)}</a>`).join('\n')}
        </details>
      </li>`;
  }).join('\n');

  return `<header class="header" id="header">
  <div class="header__progress" aria-hidden="true"><span></span></div>
  <div class="header__inner container">
    <a class="brand" href="${r}index.html" aria-label="Сибнефтекарт-сервис — на главную">
      <svg class="brand__mark" viewBox="0 0 120 48" aria-hidden="true">
        <path d="M38 11H22.5A12.5 12.5 0 0 0 10 23.5v1A12.5 12.5 0 0 0 22.5 37H38 M48 11v26 M72 11v26 M48 24h24 M84 11v26 M106 11L86.5 24 106 37" fill="none" stroke="#D32F2F" stroke-width="5" stroke-linecap="square"/>
      </svg>
      <span class="brand__text">
        <span class="brand__name">Сибнефтекарт-сервис</span>
        <span class="brand__sub">общество с ограниченной ответственностью</span>
      </span>
    </a>

    <nav class="nav" id="nav" aria-label="Главное меню">
      <ul class="nav__list">
${items}
      </ul>
    </nav>

    <a class="btn btn--outline btn--cart" href="${r}cart.html" data-cart-link aria-label="Корзина"${page === 'cart' ? ' aria-current="page"' : ''}>
      <svg class="cart-ic" aria-hidden="true"><use href="#i-cart"/></svg>
      <span class="btn--cart__label">Корзина</span>
      <span class="cart-badge mono" data-cart-count hidden>0</span>
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
      <a class="btn btn--outline" href="${r}cart.html"><svg class="cart-ic" aria-hidden="true"><use href="#i-cart"/></svg><span>Корзина</span><span class="cart-badge mono" data-cart-count hidden>0</span></a>
      <a class="mmenu__phone mono" href="tel:+73822651145">+7 (3822) 65-11-45</a>
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
        <li><svg aria-hidden="true"><use href="#i-mail"/></svg><a href="mailto:sncard-service@sncard.ru">sncard-service@sncard.ru</a></li>
        <li><svg aria-hidden="true"><use href="#i-phone"/></svg><span><a href="tel:+73822651145">+7 (3822) 65-11-45</a><small>многоканальный</small></span></li>
      </ul>
    </div>
    <div class="fcol">
      <h2 class="fcol__title">Правовая информация</h2>
      <ul class="legal">
        <li><a href="${r}privacy.html">Политика конфиденциальности</a></li>
        <li><a href="${r}cookies.html">Политика использования Cookies</a></li>
      </ul>
    </div>
  </div>
  <div class="footer__bottom">
    <div class="container footer__bottom-inner">
      <span>© ООО «Сибнефтекарт-сервис», 2026</span>
      <span class="mono">Группа компаний «Сибнефтекарт» · 56°29′ с. ш. · 84°57′ в. д.</span>
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

/* ---------- Оболочка сгенерированной страницы ---------- */
const LIBS = r => `<!-- Библиотеки лежат локально: cdnjs/jsDelivr (Cloudflare) у части провайдеров РФ зависают,
     а из-за defer вместе с ними не запускались и наши скрипты. GSAP 3.15.0, Lenis 1.3.26 -->
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
  <link rel="icon" href="${r}favicon.ico" sizes="any">
  <link rel="icon" href="${r}favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${r}../designs/styles.css">
  <link rel="stylesheet" href="${r}styles.css">
</head>
<body data-page="${page}">
<!-- Файл создан tools/generate.mjs из data/catalog.js — правьте данные, а не этот файл -->

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
function phead({ r, trail, title, lead = '', sheet = '', aside = '', icon = '' }) {
  return `<section class="phead">
  <div class="container">
    <div class="phead__sheet">
      <span class="phead__ticks" aria-hidden="true"></span>
      ${crumbs(r, trail)}
      <div class="phead__row">
        <div class="phead__text">
          <h1 class="phead__title">${icon}${title}</h1>
          ${lead ? `<p class="phead__lead">${lead}</p>` : ''}
        </div>
        ${aside}
      </div>
      <span class="phead__stamp mono" aria-hidden="true">${sheet}</span>
    </div>
  </div>
</section>`;
}

/* =========================================================
   Карточки категорий (главная и витрина каталога)
   ========================================================= */
const XL_ART = `<div class="card__art" aria-hidden="true">
          <svg viewBox="0 0 520 220">
            <!-- Концентратор: вид сверху, 8 мест под каналы, 2 заняты -->
            <rect class="bp fill-w" x="150" y="40" width="220" height="140" rx="6"/>
            <rect class="bp-thin fill-s" x="170" y="62" width="44" height="44" rx="2"/>
            <path class="bp-thin" d="M214 72h24M214 84h24M214 96h24"/>
            <g class="mini-slots">
              <rect class="bp fill-s" x="252" y="56" width="10" height="78"/><rect class="bp fill-s" x="266" y="56" width="10" height="78"/>
              <rect class="bp-soft-dash" x="280" y="56" width="10" height="78"/><rect class="bp-soft-dash" x="294" y="56" width="10" height="78"/>
              <rect class="bp-soft-dash" x="308" y="56" width="10" height="78"/><rect class="bp-soft-dash" x="322" y="56" width="10" height="78"/>
              <rect class="bp-soft-dash" x="336" y="56" width="10" height="78"/><rect class="bp-soft-dash" x="350" y="56" width="10" height="78"/>
            </g>
            <rect class="bp fill-w" x="176" y="150" width="54" height="30"/>
            <rect class="bp fill-w" x="258" y="152" width="70" height="28"/>
            <!-- Связи: ПК слева, две ТРК справа -->
            <path class="data mini-data" id="mini-d1" d="M176 165H96V120H70"/>
            <path class="data mini-data" id="mini-d2" d="M293 180V200H440V160H452"/>
            <path class="data mini-data" id="mini-d3" d="M370 100H452"/>
            <rect class="bp fill-w" x="10" y="92" width="60" height="44" rx="3"/><rect class="screen" x="16" y="98" width="48" height="28" rx="1.5"/>
            <rect class="bp fill-w" x="452" y="70" width="44" height="66" rx="4"/><rect class="screen" x="458" y="78" width="32" height="16" rx="1.5"/>
            <rect class="bp fill-w" x="452" y="146" width="44" height="66" rx="4" transform="translate(0 -6)"/><rect class="screen" x="458" y="148" width="32" height="16" rx="1.5"/>
            <text class="bp-label bp-label--sm" x="150" y="30">КОНЦЕНТРАТОР ТРК · 2 из 8</text>
            <circle class="packet mini-packet" cx="120" cy="165" r="3"/>
          </svg>
        </div>`;
const CARD_CLASS = ['card card--xl', 'card card--half', 'card', 'card', 'card', 'card', 'card', 'card'];
function catCards(r) {
  return `<ul class="bento bento--cat">
${CATS.map((c, i) => `      <li class="${CARD_CLASS[i] || 'card'}" data-cat="${c.slug}">
        <span class="card__spot" aria-hidden="true"></span>
        <div class="card__top"><span class="card__num mono">${String(i + 1).padStart(2, '0')}</span><svg class="card__icon" aria-hidden="true"><use href="#${catMeta[c.slug].icon}"/></svg></div>
        ${i === 0 ? XL_ART : ''}
        <h3 class="card__title"><a class="card__cover-link" href="${catUrl(r, c.slug)}">${esc(c.title)}</a></h3>
        <p class="card__text">${catMeta[c.slug].blurb}</p>
        <p class="card__meta mono">${catMetaLine(c)}</p>
        <span class="card__arrow" aria-hidden="true">${ARROW}</span>
      </li>`).join('\n\n')}
    </ul>`;
}

/* =========================================================
   Товар: карточка в списке
   ========================================================= */
function prodCard(r, p, { headingLevel = 3 } = {}) {
  const img = p.images[0];
  const h = `h${headingLevel}`;
  return `<article class="prod" data-reveal-item>
        <a class="prod__media" href="${prodUrl(r, p)}" tabindex="-1" aria-hidden="true">
          ${img ? `<img src="${r}${img.src}" width="${img.w}" height="${img.h}" alt="" loading="lazy" decoding="async">` : '<span class="prod__noimg mono">нет фото</span>'}
          ${p.isNew ? '<span class="prod__new mono">New</span>' : ''}
        </a>
        <div class="prod__body">
          <${h} class="prod__title"><a class="prod__link" href="${prodUrl(r, p)}">${esc(p.name)}</a></${h}>
          ${p.short ? `<p class="prod__text">${esc(p.short)}</p>` : ''}
          <div class="prod__foot">
            <div class="prod__price">
              <span class="prod__sum mono">${rub(p.price)}</span>
              ${p.inStock ? '<span class="prod__stock mono">в наличии</span>' : ''}
            </div>
            <button class="btn btn--primary btn--add" type="button" data-add="${p.id}" aria-label="В корзину: ${esc(p.name)}">
              <span class="bstate bstate--idle"><svg class="cart-ic" aria-hidden="true"><use href="#i-cart"/></svg>В корзину</span>
              <span class="bstate bstate--success" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg>Добавлено</span>
            </button>
          </div>
        </div>
      </article>`;
}

/* =========================================================
   Страницы каталога
   ========================================================= */
function pageEquipmentIndex() {
  const r = '../';
  const main = `${phead({
    r, trail: [['Оборудование']], title: 'Оборудование',
    lead: `${PRODUCTS.length} позиции в&nbsp;восьми категориях&nbsp;— от&nbsp;кабеля до&nbsp;терминала самообслуживания. Разрабатываем, выпускаем мелкими сериями, поставляем и&nbsp;ремонтируем.`,
    sheet: 'СНК · Каталог · Лист 1',
  })}

<section class="directions catalog-home catalog-index" aria-label="Категории оборудования">
  <div class="container">
    ${catCards(r)}
  </div>
</section>

${ctaBlock()}`;
  return shell({ r, page: 'equipment', here: 'equipment/index.html', title: 'Оборудование для АЗС и нефтебаз — Сибнефтекарт-сервис', desc: 'Каталог оборудования ООО «Сибнефтекарт-сервис»: контроллеры ТРК, преобразователи интерфейсов, терминалы, считыватели карт.', main });
}

function catNav(r, current) {
  return `<nav class="catnav" aria-label="Категории оборудования">
        <p class="catnav__title mono">Категории</p>
        <ul>
${CATS.map(c => `          <li><a class="catnav__link${c.slug === current ? ' is-current' : ''}" href="${catUrl(r, c.slug)}"${c.slug === current ? ' aria-current="page"' : ''}><svg class="catnav__ic" aria-hidden="true"><use href="#${catMeta[c.slug].icon}"/></svg><span>${esc(c.title)}</span><small class="mono">${byCat(c.slug).length}</small></a></li>`).join('\n')}
          <li><a class="catnav__link catnav__link--all" href="${r}equipment/index.html"><span>Весь каталог</span>${ARROW}</a></li>
        </ul>
      </nav>`;
}

function pageCategory(c) {
  const r = '../';
  const items = byCat(c.slug);
  const icon = `<svg class="phead__icon" aria-hidden="true"><use href="#${catMeta[c.slug].icon}"/></svg>`;
  const main = `${phead({
    r, trail: [['Оборудование', `${r}equipment/index.html`], [c.title]], title: esc(c.title), icon,
    lead: catMeta[c.slug].blurb,
    aside: `<dl class="phead__facts mono"><div><dt>Позиций</dt><dd>${items.length}</dd></div><div><dt>${items.length > 1 ? 'Цена от' : 'Цена'}</dt><dd>${rub(minPrice(c.slug))}</dd></div></dl>`,
    sheet: `СНК · ${esc(c.title)} · Лист ${CATS.indexOf(c) + 2}`,
  })}

<section class="catalog" aria-label="Товары категории">
  <div class="container catalog__grid">
    <aside class="catalog__side">
      ${catNav(r, c.slug)}
    </aside>
    <div class="catalog__list">
      ${items.map(p => prodCard(r, p, { headingLevel: 2 })).join('\n      ')}
    </div>
  </div>
</section>

${ctaBlock()}`;
  return shell({ r, page: 'equipment', here: `equipment/${c.slug}.html`, title: `${c.title} — оборудование для АЗС — Сибнефтекарт-сервис`, desc: `${c.title}: ${goods(items.length)}, цены и описание. ООО «Сибнефтекарт-сервис», Томск.`, main });
}

function pageProduct(p) {
  const r = '../../';
  const c = CATS.find(x => x.slug === p.category);
  const imgs = p.images;
  const related = byCat(c.slug).filter(x => x.id !== p.id).slice(0, 3);
  const desc = (p.description || '').replace(/\{\{root\}\}/g, r);
  const gallery = imgs.length ? `<div class="gal" data-gallery>
        <div class="gal__main">
          <span class="gal__ticks" aria-hidden="true"></span>
          <img class="gal__img" src="${r}${imgs[0].src}" width="${imgs[0].w}" height="${imgs[0].h}" alt="${esc(p.name)}${imgs.length > 1 ? ' — фото 1' : ''}" decoding="async">
          <span class="gal__stamp mono" aria-hidden="true">${esc(c.title)} · ${String(p.id).padStart(3, '0')}</span>
        </div>
        ${imgs.length > 1 ? `<ul class="gal__thumbs" aria-label="Фотографии товара">
${imgs.map((im, i) => `          <li><button class="gal__thumb${i === 0 ? ' is-current' : ''}" type="button" data-src="${r}${im.src}" data-w="${im.w}" data-h="${im.h}" data-alt="${esc(p.name)} — фото ${i + 1}" aria-label="Фото ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}><img src="${r}${im.src}" alt="" loading="lazy"></button></li>`).join('\n')}
        </ul>` : ''}
      </div>` : `<div class="gal"><div class="gal__main gal__main--empty mono">Фото нет</div></div>`;

  const main = `<section class="product" aria-labelledby="p-title">
  <div class="container">
    ${crumbs(r, [['Оборудование', `${r}equipment/index.html`], [c.title, catUrl(r, c.slug)], [p.name]])}
    <div class="product__grid">
      ${gallery}
      <div class="product__info">
        <p class="product__cat mono"><a href="${catUrl(r, c.slug)}">${esc(c.title)}</a>${p.isNew ? '<span class="prod__new prod__new--inline">New</span>' : ''}</p>
        <h1 class="product__title" id="p-title">${esc(p.name)}</h1>
        ${p.short ? `<p class="product__lead">${esc(p.short)}</p>` : ''}
        <div class="buy" data-buy>
          <div class="buy__row">
            <span class="buy__price mono">${rub(p.price)}</span>
            ${p.inStock ? '<span class="prod__stock mono">в наличии</span>' : ''}
          </div>
          <div class="buy__row buy__row--act">
            <div class="qty" data-qty>
              <button class="qty__btn" type="button" data-step="-1" aria-label="Уменьшить количество">−</button>
              <input class="qty__input mono" type="number" inputmode="numeric" min="1" max="999" value="1" aria-label="Количество">
              <button class="qty__btn" type="button" data-step="1" aria-label="Увеличить количество">+</button>
            </div>
            <button class="btn btn--primary btn--lg btn--add magnetic" type="button" data-add="${p.id}" data-fly>
              <span class="bstate bstate--idle"><svg class="cart-ic" aria-hidden="true"><use href="#i-cart"/></svg>В корзину</span>
              <span class="bstate bstate--success" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg>Добавлено</span>
            </button>
          </div>
          <p class="buy__status" role="status" aria-live="polite"></p>
          <noscript><p class="buy__noscript">Чтобы оформить заказ, позвоните <a href="tel:+73822651145">+7 (3822) 65-11-45</a> или напишите <a href="mailto:sncard-service@sncard.ru">sncard-service@sncard.ru</a>.</p></noscript>
        </div>
        <dl class="spec spec--product">
          <div><dt>Категория</dt><dd><a href="${catUrl(r, c.slug)}">${esc(c.title)}</a></dd></div>
          <div><dt>Код товара</dt><dd class="mono">${String(p.id).padStart(3, '0')}</dd></div>
          <div><dt>Документация</dt><dd><a href="${r}docs.html#equipment">Паспорта, схемы, прошивки</a></dd></div>
        </dl>
      </div>
    </div>
  </div>
</section>

${desc ? `<section class="pdesc" aria-labelledby="pdesc-title">
  <div class="container pdesc__grid">
    <h2 class="pdesc__label mono" id="pdesc-title">Описание</h2>
    <div class="prose">
${desc}
    </div>
  </div>
</section>` : ''}

${related.length ? `<section class="related" aria-labelledby="rel-title">
  <div class="container">
    <div class="section-head section-head--row">
      <h2 class="h2" id="rel-title">Ещё в&nbsp;категории</h2>
      <a class="link-more" href="${catUrl(r, c.slug)}">${esc(c.title)} ${ARROW}</a>
    </div>
    <div class="related__list">
      ${related.map(x => prodCard(r, x)).join('\n      ')}
    </div>
  </div>
</section>` : ''}`;
  return shell({ r, page: 'equipment', here: `equipment/${p.category}/${p.slug}.html`, title: `${p.name} — ${c.title} — Сибнефтекарт-сервис`, desc: p.short || `${p.name}: цена ${p.price} руб., описание.`, main });
}

function ctaBlock() {
  return `<section class="cta" aria-labelledby="cta-title">
  <div class="container">
    <div class="cta__box">
      <svg class="cta__dim" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 12H1000 M0 4v16 M1000 4v16"/>
      </svg>
      <h2 class="cta__title" id="cta-title">Обсудим вашу задачу?</h2>
      <p class="cta__text">Подберём оборудование для вашей АЗС или нефтебазы и&nbsp;ответим по&nbsp;ремонту.</p>
      <a class="btn btn--primary btn--lg magnetic" href="mailto:sncard-service@sncard.ru?subject=%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20snc-service.sncard.ru"><span>Написать нам</span></a>
    </div>
  </div>
</section>`;
}

/* =========================================================
   Блоки данных для статических страниц
   ========================================================= */
const FTYPE = { pdf: 'PDF', rar: 'RAR', zip: 'ZIP', doc: 'DOC', docx: 'DOC', page: 'СТР' };
function docsBlock() {
  // без файлов, которых нет и на старом сайте (иначе счётчики врут)
  const docs = DOCS.map(sec => ({ ...sec, groups: sec.groups.map(g => ({ ...g, items: g.items.filter(it => !isDead(it.href)) })) }));
  return docs.map(sec => `<section class="docsec" id="${sec.id}" aria-labelledby="docsec-${sec.id}">
      <div class="docsec__head">
        <h2 class="h2" id="docsec-${sec.id}">${sec.id === 'equipment' ? 'Оборудование для АЗС' : esc(sec.title)}</h2>
        <p class="docsec__count mono">${files(sec.groups.reduce((s, g) => s + g.items.filter(i => i.href).length, 0))}</p>
      </div>
      <div class="docsec__groups">
${sec.groups.map(g => {
    const n = g.items.filter(i => i.href).length;
    return `        <article class="docgroup" data-doc-group>
          <header class="docgroup__head">
            <h3 class="docgroup__title">${esc(g.title)}</h3>
            <span class="docgroup__count mono">${files(n)}</span>
          </header>
          <ul class="doclist">
${g.items.map(it => it.sub
      ? `            <li class="docsub mono">${esc(it.sub)}</li>`
      : `            <li class="docitem" data-doc-item>
              <a class="docitem__link" href="${esc(it.type === 'page' ? 'docs.html#useful' : it.href)}"${it.type === 'page' ? '' : ' target="_blank" rel="noopener"'}>
                <span class="ftype mono" data-type="${it.type}">${FTYPE[it.type] || it.type.toUpperCase()}</span>
                <span class="docitem__title">${esc(it.title)}</span>
                <span class="docitem__size mono">${it.size ? fmtSize(it.size) : (it.missing ? 'нет ответа' : '')}</span>
                <svg class="docitem__ic" aria-hidden="true"><use href="#i-download"/></svg>
              </a>
            </li>`).join('\n')}
          </ul>
        </article>`;
  }).join('\n')}
      </div>
    </section>`).join('\n\n    ');
}

function pricesBlock() {
  const P = CARDS.prices;
  const head = P.tirages.map(t => `<th scope="col" class="mono">${nb(t)}</th>`).join('');
  const rows = P.rows.map((row, i) => `            <tr>
              <th scope="row"><span class="ptable__n mono">${i + 1}</span>${esc(row.name)}</th>
${row.prices.map((v, k) => `              <td class="mono" data-col="${k}">${v ? esc(v) : '<span class="ptable__none" aria-label="нет цены">—</span>'}</td>`).join('\n')}
            </tr>`).join('\n');
  const opts = P.tirages.map((t, k) => `<option value="${k}"${k === 4 ? ' selected' : ''}>${nb(t)} шт.</option>`).join('');
  const mob = P.rows.map((row, i) => `            <li class="plist__row">
              <span class="plist__name"><span class="ptable__n mono">${i + 1}</span>${esc(row.name)}</span>
              <span class="plist__vals">${row.prices.map((v, k) => `<span class="plist__v mono" data-col="${k}"${k === 4 ? '' : ' hidden'}>${v ? esc(v) + ' ₽' : 'нет цены'}</span>`).join('')}</span>
            </li>`).join('\n');
  return `<div class="ptable-wrap">
        <table class="ptable">
          <caption class="sr-only">${esc(P.caption)}, руб.</caption>
          <thead><tr><th scope="col" class="ptable__corner mono">Тираж, шт. →</th>${head}</tr></thead>
          <tbody>
${rows}
          </tbody>
        </table>
      </div>
      <div class="plist">
        <label class="plist__label" for="tirage">Тираж</label>
        <div class="select">
          <select id="tirage" class="select__input mono" data-tirage>${opts}</select>
          <svg aria-hidden="true"><use href="#i-chevron"/></svg>
        </div>
        <ul class="plist__rows">
${mob}
        </ul>
      </div>`;
}

function examplesBlock() {
  return `<ul class="gallery" data-lightbox>
${CARDS.examples.map((e, i) => `        <li><button class="gallery__item" type="button" data-index="${i}" data-src="${e.src}" data-w="${e.w}" data-h="${e.h}" aria-label="Открыть пример ${i + 1}: ${esc(e.alt)}"><img src="${e.src}" width="${e.w}" height="${e.h}" alt="Пример дизайна карты: ${esc(e.alt)}" loading="lazy" decoding="async"></button></li>`).join('\n')}
      </ul>`;
}

function policyInline(t, r = '') {
  return esc(t).replace(/\[\[([^|\]]+)\|([^\]]*)\]\]/g, (m, text, href) => {
    const h = href.replace(/&amp;/g, '&');
    const map = { '/contacts': 'contacts.html', '/privacy-policy': 'privacy.html', '/cookie-policy': 'cookies.html' };
    const local = map[h.replace(/^https?:\/\/snc-service\.sncard\.ru/, '')];
    return local ? `<a href="${r}${local}">${text}</a>` : `<a href="${esc(h)}" target="_blank" rel="noopener">${text}</a>`;
  });
}
function policyBlock(key) {
  const P = POLICIES[key];
  const id = i => `p-${i + 1}`;
  const toc = P.sections.map((s, i) => `            <li><a class="toc__link" href="#${id(i)}">${esc(s.title)}</a></li>`).join('\n');
  const body = [
    ...P.intro.map(t => `        <p class="policy__intro">${policyInline(t)}</p>`),
    ...P.sections.map((s, i) => {
      const blocks = [];
      let list = null;
      for (const b of s.blocks) {
        if (/^[–—-]\s/.test(b)) { (list ||= []).push(b.replace(/^[–—-]\s*/, '')); continue; }
        if (list) { blocks.push(`          <ul>${list.map(x => `<li>${policyInline(x)}</li>`).join('')}</ul>`); list = null; }
        const m = b.match(/^(\d+\.\d+\.)\s*(.*)$/);
        blocks.push(m
          ? `          <p class="policy__p"><span class="policy__n mono">${m[1]}</span>${policyInline(m[2])}</p>`
          : `          <p>${policyInline(b)}</p>`);
      }
      if (list) blocks.push(`          <ul>${list.map(x => `<li>${policyInline(x)}</li>`).join('')}</ul>`);
      const title = s.title.replace(/^(\d+)\.\s*/, '');
      const num = (s.title.match(/^(\d+)\./) || [, String(i + 1)])[1];
      return `        <section class="policy__sec" id="${id(i)}" aria-labelledby="${id(i)}-t">
          <h2 class="policy__h" id="${id(i)}-t"><span class="policy__num mono">${num.padStart(2, '0')}</span>${esc(title)}</h2>
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

/* =========================================================
   Сборка
   ========================================================= */
const out = [];
write('equipment/index.html', pageEquipmentIndex()); out.push('equipment/index.html');
for (const c of CATS) { write(`equipment/${c.slug}.html`, pageCategory(c)); out.push(`equipment/${c.slug}.html`); }
for (const p of PRODUCTS) { write(`equipment/${p.category}/${p.slug}.html`, pageProduct(p)); out.push(`equipment/${p.category}/${p.slug}.html`); }

// Статические страницы: общие блоки и блоки данных
const GEN = {
  'home-bento': () => catCards(''),
  docs: docsBlock,
  prices: pricesBlock,
  examples: examplesBlock,
  'policy-privacy': () => policyBlock('privacy'),
  'policy-cookies': () => policyBlock('cookies'),
};
const STATIC = ['index.html', 'company.html', 'cards.html', 'docs.html', 'contacts.html', 'cart.html', 'privacy.html', 'cookies.html'];
for (const f of STATIC) {
  if (!fs.existsSync(path.join(ROOT, f))) { console.warn('нет файла', f); continue; }
  let h = read(f);
  const page = (h.match(/<body[^>]*data-page="([^"]+)"/) || [, ''])[1];
  const block = (name, content) => {
    const re = new RegExp(`(<!-- @${name}:start -->)[\\s\\S]*?(<!-- @${name}:end -->)`);
    if (!re.test(h)) throw new Error(`${f}: нет блока @${name}`);
    h = h.replace(re, (m, a, b) => `${a}\n${content}\n${b}`);
  };
  if (f !== 'index.html') block('sprite', SPRITE);
  block('header', header('', page, f));
  block('footer', footer(''));
  h = h.replace(/(<!-- gen:([\w-]+) -->)[\s\S]*?(<!-- \/gen:\2 -->)/g, (m, a, name, b) => {
    if (!GEN[name]) return m; // чужие маркеры (например, сцена hero) не трогаем
    return `${a}\n      ${GEN[name]()}\n      ${b}`;
  });
  write(f, h); out.push(f);
}
console.log(`Готово: ${out.length} страниц.`);
