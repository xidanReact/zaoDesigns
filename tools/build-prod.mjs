#!/usr/bin/env node
/* =========================================================
   СНК · прод-сборка сайтов группы в отдельные папки (без зависимостей).
   Запуск из любой папки:
     node tools/build-prod.mjs                  все сайты
     node tools/build-prod.mjs sncard zao-sncard только перечисленные

   Для каждого сайта <site>/ пересоздаёт <site>-prod/ — её содержимое
   целиком выкладывается в корень домена сайта. Исходники не меняются:
   правки делать в <site>/ и пересобирать.

   Что делает:
   1. Копирует файлы сайта, кроме служебных: BRIEF.md, tools/, *.mjs,
      исходники данных (data/*.js и прочее из SITES[].exclude), если
      страницы их не подключают.
   2. Склеивает designs/styles.css + <site>/styles.css в один styles.css
      без комментариев: прод не зависит от папки designs/.
   3. В страницах: одна ссылка на стили, ?v=<хеш> у своих css/js (сброс
      кеша после выкладки), превью соседних сайтов на github.io заменены
      их боевыми доменами, canonical и Open Graph.
   4. Пишет robots.txt и sitemap.xml.
   5. Проверяет, что все локальные ссылки ведут на существующие файлы
      внутри папки сайта и не осталось ссылок на превью.
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DESIGNS_CSS = path.join(REPO, 'designs', 'styles.css');
const PREVIEW = 'https://xidanreact.github.io/zaoDesigns/';

const SITES = {
  'zao-sncard': {
    origin: 'https://zao.sncard.ru',
    siteName: 'АО «НПФ «Сибнефтекарт»',
    exclude: ['news.js', 'policies.js'], // исходники для tools/build-*.mjs
  },
  'snc-service': {
    origin: 'https://snc-service.sncard.ru',
    siteName: 'ООО «Сибнефтекарт-сервис»',
    exclude: [],
    noSitemap: ['cart.html'],
  },
  sncard: {
    origin: 'https://www.sncard.ru',
    siteName: 'ООО «Сибнефтекарт»',
    exclude: [],
  },
};
const ORIGINS = Object.fromEntries(Object.entries(SITES).map(([k, v]) => [k, v.origin]));

const read = f => fs.readFileSync(f, 'utf8');
const hash = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
const esc = s => s.replace(/&(?!(?:amp|lt|gt|quot|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');
const posix = p => p.split(path.sep).join('/');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const isLocal = ref => !/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(ref);

function build(site) {
  const cfg = SITES[site];
  const SRC = path.join(REPO, site);
  const OUT = path.join(REPO, `${site}-prod`);
  const files = walk(SRC).map(f => posix(path.relative(SRC, f)));
  const pages = files.filter(f => f.endsWith('.html'));

  /* ---------- 1. Что копировать ---------- */
  const html = Object.fromEntries(pages.map(p => [p, read(path.join(SRC, p))]));
  // файлы, на которые ссылаются страницы (относительно корня сайта)
  const referenced = new Set();
  for (const [page, src] of Object.entries(html)) {
    for (const [, ref] of src.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (isLocal(ref)) referenced.add(posix(path.join(path.dirname(page), ref.split(/[?#]/)[0])));
    }
  }
  const skip = f => f === 'BRIEF.md' || f.startsWith('tools/') || f.endsWith('.mjs')
    || f === 'styles.css' || pages.includes(f)
    || ((f.startsWith('data/') || cfg.exclude.includes(f)) && !referenced.has(f));
  const assets = files.filter(f => !skip(f));

  /* ---------- 2. Чистая папка, стили, ассеты ---------- */
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const stripCss = css => css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n').map(l => l.trimEnd()).filter(l => l.trim()).join('\n');
  const css = `/* СНК · ${cfg.origin.replace('https://', '')} — собрано из designs/styles.css и ${site}/styles.css */\n`
    + stripCss(read(DESIGNS_CSS)) + '\n' + stripCss(read(path.join(SRC, 'styles.css'))) + '\n';
  fs.writeFileSync(path.join(OUT, 'styles.css'), css);

  for (const f of assets) {
    fs.mkdirSync(path.join(OUT, path.dirname(f)), { recursive: true });
    fs.copyFileSync(path.join(SRC, f), path.join(OUT, f));
  }

  // хеши своих css/js; vendor/ закреплён версиями библиотек
  const version = { 'styles.css': hash(css) };
  for (const f of assets) {
    if (/\.(?:css|js)$/.test(f) && !/(?:^|\/)vendor\//.test(f)) version[f] = hash(read(path.join(SRC, f)));
  }

  /* ---------- 3. Страницы ---------- */
  const urlOf = page => `${cfg.origin}/${page.replace(/(?:^|\/)index\.html$/, m => m.startsWith('/') ? '/' : '')}`;
  for (const page of pages) {
    let src = html[page];

    src = src
      .replace(/[ \t]*<!-- Дизайн-система:[^>]*-->\r?\n/, '')
      .replace(/[ \t]*<link rel="stylesheet" href="(?:\.\.\/)+designs\/styles\.css">\r?\n/, '');

    // превью соседних сайтов на github.io → боевые домены
    src = src.replace(new RegExp(`${PREVIEW.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}([\\w-]+)/`, 'g'),
      (m, s) => ORIGINS[s] ? `${ORIGINS[s]}/` : m);

    src = src.replace(/(href|src)="([^"?#:]+\.(?:css|js))"/g, (m, attr, ref) => {
      const v = version[posix(path.join(path.dirname(page), ref))];
      return v ? `${attr}="${ref}?v=${v}"` : m;
    });

    const url = urlOf(page);
    const title = src.match(/<title>([^<]*)<\/title>/)?.[1];
    const desc = src.match(/<meta name="description" content="([^"]*)">/)?.[1];
    const meta = [
      `<link rel="canonical" href="${url}">`,
      `<meta property="og:type" content="website">`,
      `<meta property="og:locale" content="ru_RU">`,
      `<meta property="og:site_name" content="${esc(cfg.siteName)}">`,
      `<meta property="og:url" content="${url}">`,
      title && `<meta property="og:title" content="${esc(title)}">`,
      desc && `<meta property="og:description" content="${desc}">`,
    ].filter(Boolean).map(s => `  ${s}\n`).join('');
    const anchor = desc ? /(<meta name="description"[^>]*>\r?\n)/ : /(<title>[^<]*<\/title>\r?\n)/;
    src = src.replace(anchor, `$1${meta}`);

    html[page] = src;
    fs.mkdirSync(path.join(OUT, path.dirname(page)), { recursive: true });
    fs.writeFileSync(path.join(OUT, page), src);
  }

  /* ---------- 4. robots.txt, sitemap.xml ---------- */
  fs.writeFileSync(path.join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${cfg.origin}/sitemap.xml\n`);
  const today = new Date().toISOString().slice(0, 10);
  const inSitemap = pages.filter(p => !(cfg.noSitemap || []).includes(p))
    .sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    + inSitemap.map(p => `  <url><loc>${urlOf(p)}</loc><lastmod>${today}</lastmod></url>\n`).join('')
    + `</urlset>\n`);

  /* ---------- 5. Проверка ---------- */
  const problems = [];
  for (const [page, src] of Object.entries(html)) {
    if (src.includes(PREVIEW)) problems.push(`${page}: осталась ссылка на превью ${PREVIEW}`);
    if (/designs\//.test(src.replace(/<!--[\s\S]*?-->/g, ''))) problems.push(`${page}: осталась ссылка на designs/`);
    for (const [, ref] of src.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (!isLocal(ref)) continue;
      const file = path.resolve(OUT, path.dirname(page), ref.split(/[?#]/)[0]);
      if (!file.startsWith(OUT + path.sep) && file !== OUT) problems.push(`${page}: ссылка за пределы сайта ${ref}`);
      else if (!fs.existsSync(file)) problems.push(`${page}: нет файла ${ref}`);
    }
  }
  if (problems.length) {
    console.error(`${site}: ${problems.length} проблем\n` + [...new Set(problems)].slice(0, 30).join('\n'));
    return false;
  }

  const size = walk(OUT).reduce((n, f) => n + fs.statSync(f).size, 0);
  console.log(`${site}-prod: ${pages.length} страниц, ${assets.length + 1} файлов ресурсов, ${(size / 1024 / 1024).toFixed(1)} МБ → ${cfg.origin}`);
  return true;
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SITES);
const unknown = targets.filter(s => !SITES[s]);
if (unknown.length) {
  console.error(`Неизвестные сайты: ${unknown.join(', ')}. Есть: ${Object.keys(SITES).join(', ')}`);
  process.exit(1);
}
const ok = targets.map(build).every(Boolean);
process.exit(ok ? 0 : 1);
