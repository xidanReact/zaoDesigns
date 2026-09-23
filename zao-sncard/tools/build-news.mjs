#!/usr/bin/env node
/* =========================================================
   СНК · zao.sncard.ru — сборка страницы «Все новости» (без зависимостей).
   Запуск из любой папки:  node zao-sncard/tools/build-news.mjs

   Что делает:
   1. Читает новости из ../news.js (единственный источник данных).
   2. Подставляет в news.html между маркерами-комментариями:
        <!-- @filter:start --> … <!-- @filter:end -->   чипы тем со счётчиками
        <!-- @list:start -->   … <!-- @list:end -->     сетка блоков новостей (текст целиком)
        <!-- @count:start -->  … <!-- @count:end -->    подпись «N записей с года»
   3. Проверяет, что анкоры новостей, на которые ссылается карусель
      на index.html, существуют на news.html.

   Разметка страницы статическая — сайт работает без сборки и без JS.
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const NEWS = require(path.join(ROOT, 'news.js'));

const esc = s => String(s ?? '').replace(/&(?!(?:amp|lt|gt|quot|#\d+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* html из data/news.js уже вычищен: разрешены только <a>, <b>, <strong>, <em> */
const inline = s => String(s).replace(/<(?!\/?(?:a|b|strong|em)\b)[^>]*>/g, '');
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const rusDate = iso => { const [y, m, d] = iso.split('-'); return `${+d} ${MONTHS[+m - 1]} ${y}`; };
const plural = (n, [one, few, many]) => {
  const a = n % 10, b = n % 100;
  return (a === 1 && b !== 11) ? one : (a >= 2 && a <= 4 && (b < 10 || b >= 20)) ? few : many;
};

/* Темы в порядке убывания количества записей, «Все» — первой */
const TAGS = [...new Set(NEWS.map(n => n.tag))]
  .map(tag => ({ tag, n: NEWS.filter(x => x.tag === tag).length }))
  .sort((a, b) => b.n - a.n || a.tag.localeCompare(b.tag, 'ru'));

const items = [...NEWS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

function filterHtml() {
  const chip = (label, count, value, on) =>
    `      <button class="nfilter__tab${on ? ' is-current' : ''}" type="button" data-news-tag="${esc(value)}" aria-pressed="${on}">${esc(label)} <span class="mono">${count}</span></button>`;
  return [
    chip('Все', items.length, 'all', true),
    ...TAGS.map(t => chip(t.tag, t.n, t.tag, false)),
  ].join('\n');
}

function bodyHtml(it) {
  return it.body.map(b => {
    if (b.type === 'stations') {
      const rows = b.rows.map(r => `
          <div class="nstations__row">
            <dt>${esc(r.name)}</dt>
            <dd>${esc(r.address)}</dd>
          </div>`).join('');
      return `        <dl class="nstations">${rows}
        </dl>`;
    }
    return `        <p>${inline(b.html)}</p>`;
  }).join('\n');
}

/* Блок новости как на sncard/news.html, но без страницы-карточки:
   текст короткий, поэтому показываем его целиком */
function listHtml() {
  return items.map(it => `      <article class="nblock" id="${esc(it.slug)}" data-tag="${esc(it.tag)}">
        <div class="nblock__meta">
          <time class="mono" datetime="${it.date}">${rusDate(it.date)}</time>
          <span class="tag">${esc(it.tag)}</span>
        </div>
        <h2 class="nblock__title">${esc(it.title)}</h2>
        <div class="nblock__body">
${bodyHtml(it)}
        </div>
      </article>`).join('\n');
}

function countHtml() {
  const from = items[items.length - 1].date.slice(0, 4);
  return `Изменения в сети АЗС, работе личного кабинета и реквизитах компании: <b>${items.length}</b> ${plural(items.length, ['запись', 'записи', 'записей'])} с ${from} года.`;
}

/* ---------- Подстановка между маркерами ---------- */
const file = path.join(ROOT, 'news.html');
let html = fs.readFileSync(file, 'utf8');
const inject = (name, content) => {
  const re = new RegExp(`(<!-- @${name}:start -->)[\\s\\S]*?(<!-- @${name}:end -->)`);
  if (!re.test(html)) throw new Error(`в news.html нет маркеров @${name}:start/@${name}:end`);
  html = html.replace(re, `$1\n${content}\n$2`);
};

inject('filter', filterHtml());
inject('list', listHtml());
inject('count', `      ${countHtml()}`);
fs.writeFileSync(file, html);

/* ---------- Проверка ссылок с главной ---------- */
const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const anchors = new Set(items.map(i => i.slug));
const missing = [...index.matchAll(/news\.html#([\w-]+)/g)].map(m => m[1]).filter(a => !anchors.has(a));

console.log(`news.html собран: ${items.length} новостей, ${TAGS.length} тем (${TAGS.map(t => `${t.tag} ${t.n}`).join(', ')})`);
if (missing.length) {
  console.error('index.html ссылается на несуществующие анкоры:', [...new Set(missing)].join(', '));
  process.exitCode = 1;
}
