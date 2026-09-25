#!/usr/bin/env node
/* =========================================================
   СНК · zao.sncard.ru — прод-сборка в отдельную папку (без зависимостей).
   Запуск из любой папки:  node zao-sncard/tools/build-prod.mjs

   Что делает:
   1. Пересоздаёт ../zao-sncard-prod (рядом с zao-sncard) — её содержимое
      целиком выкладывается в корень zao.sncard.ru.
   2. Склеивает ../designs/styles.css + styles.css в один styles.css без
      комментариев: прод не зависит от папки designs/.
   3. Копирует только то, что грузит браузер: страницы, скрипты, vendor/, иконки.
      BRIEF.md, tools/, news.js и policies.js (исходники для сборки) не попадают.
   4. В страницах: одна ссылка на стили, ?v=<хеш> у своих css/js (сброс кеша
      после выкладки), canonical и Open Graph.
   5. Пишет robots.txt и sitemap.xml, проверяет, что все локальные ссылки
      ведут на существующие файлы и нигде не осталось «../».

   Исходники остаются в zao-sncard/ — правки делать там и пересобирать.
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DESIGNS = path.resolve(SRC, '..', 'designs');
const OUT = path.resolve(SRC, '..', 'zao-sncard-prod');
const ORIGIN = 'https://zao.sncard.ru';

const PAGES = ['index.html', 'news.html', 'privacy.html', 'cookies.html', 'consent.html'];
const SCRIPTS = ['main.js', 'news-page.js', 'basemap.js', 'stations.js'];
const STATIC = ['favicon.ico', 'favicon.svg'];

const read = f => fs.readFileSync(f, 'utf8');
const hash = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
const esc = s => s.replace(/&(?!(?:amp|lt|gt|quot|#\d+);)/g, '&amp;').replace(/"/g, '&quot;');

/* ---------- 1. Чистая папка ---------- */
if (path.basename(OUT) !== 'zao-sncard-prod') throw new Error(`Неожиданная папка сборки: ${OUT}`);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* ---------- 2. Стили: дизайн-система + свои, без комментариев ---------- */
const stripCss = css => css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').map(l => l.trimEnd()).filter(l => l.trim()).join('\n');
const css = `/* СНК · zao.sncard.ru — собрано из designs/styles.css и zao-sncard/styles.css */\n`
  + stripCss(read(path.join(DESIGNS, 'styles.css'))) + '\n'
  + stripCss(read(path.join(SRC, 'styles.css'))) + '\n';
fs.writeFileSync(path.join(OUT, 'styles.css'), css);

/* ---------- 3. Скрипты, vendor, иконки ---------- */
for (const f of [...SCRIPTS, ...STATIC]) fs.copyFileSync(path.join(SRC, f), path.join(OUT, f));
fs.cpSync(path.join(SRC, 'vendor'), path.join(OUT, 'vendor'), { recursive: true });

const version = { 'styles.css': hash(css) };
for (const f of SCRIPTS) version[f] = hash(read(path.join(SRC, f)));

/* ---------- 4. Страницы ---------- */
for (const page of PAGES) {
  let html = read(path.join(SRC, page));

  html = html
    .replace(/[ \t]*<!-- Дизайн-система:[^>]*-->\r?\n/, '')
    .replace(/[ \t]*<link rel="stylesheet" href="\.\.\/designs\/styles\.css">\r?\n/, '');

  // ?v=хеш у своих стилей и скриптов (vendor закреплён версиями библиотек)
  html = html.replace(/(href|src)="(styles\.css|[\w-]+\.js)"/g, (m, attr, file) =>
    version[file] ? `${attr}="${file}?v=${version[file]}"` : m);

  const url = page === 'index.html' ? `${ORIGIN}/` : `${ORIGIN}/${page}`;
  const title = html.match(/<title>([^<]*)<\/title>/)[1];
  const desc = html.match(/<meta name="description" content="([^"]*)">/)[1];
  const meta = [
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:locale" content="ru_RU">`,
    `<meta property="og:site_name" content="АО «НПФ «Сибнефтекарт»">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${desc}">`,
  ].map(s => `  ${s}\n`).join('');
  html = html.replace(/(<meta name="description"[^>]*>\r?\n)/, `$1${meta}`);

  fs.writeFileSync(path.join(OUT, page), html);
}

/* ---------- 5. robots.txt, sitemap.xml ---------- */
fs.writeFileSync(path.join(OUT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  + PAGES.map(p => `  <url><loc>${ORIGIN}/${p === 'index.html' ? '' : p}</loc><lastmod>${today}</lastmod></url>\n`).join('')
  + `</urlset>\n`);

/* ---------- 6. Проверка ссылок ---------- */
const problems = [];
for (const page of PAGES) {
  const html = read(path.join(OUT, page));
  if (html.includes('../')) problems.push(`${page}: осталась ссылка «../»`);
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|#|\/\/)/i.test(ref)) continue;
    const file = ref.split(/[?#]/)[0];
    if (!fs.existsSync(path.join(OUT, file))) problems.push(`${page}: нет файла ${file}`);
  }
}
for (const [, ref] of css.matchAll(/url\(\s*['"]?([^'")]+)/g)) {
  if (!/^(?:data:|[a-z]+:|#)/i.test(ref) && !fs.existsSync(path.join(OUT, ref))) problems.push(`styles.css: нет файла ${ref}`);
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

const size = dir => fs.readdirSync(dir, { withFileTypes: true })
  .reduce((n, e) => n + (e.isDirectory() ? size(path.join(dir, e.name)) : fs.statSync(path.join(dir, e.name)).size), 0);
console.log(`Готово: ${path.relative(process.cwd(), OUT) || OUT} — ${PAGES.length} страниц, ${(size(OUT) / 1024).toFixed(0)} КБ`);
