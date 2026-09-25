#!/usr/bin/env node
/* =========================================================
   СНК · zao.sncard.ru — сборка страниц политик (без зависимостей).
   Запуск из любой папки:  node zao-sncard/tools/build-policies.mjs

   Что делает:
   1. Читает тексты из ../policies.js (перенесены с zao.sncard.ru дословно).
   2. Берёт news.html как образец оболочки (шапка, мобильное меню, футер)
      и пишет privacy.html, cookies.html и consent.html — разметка как на sncard:
      шапка страницы (phead) + оглавление + текст с нумерацией пунктов.
   Шапку и футер правьте в index.html / news.html, затем перезапустите скрипт.
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const POLICIES = require(path.join(ROOT, 'policies.js'));
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function policyBlock(P) {
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
          <h2 class="policy__h" id="${id(i)}-t"><span class="policy__num mono">${num.padStart(2, '0')}</span>${esc(s.title.replace(/^\d+\.\s*/, ''))}</h2>
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

function page(key, file) {
  const P = POLICIES[key];
  const main = `<main id="main">

<!-- 2. Шапка страницы -->
<section class="phead">
  <div class="container">
    <div class="phead__sheet">
      <span class="phead__ticks" aria-hidden="true"></span>
      <nav class="crumbs mono" aria-label="Навигационная цепочка">
        <ol>
          <li><a href="index.html">Главная</a></li>
          <li aria-current="page">${esc(P.title)}</li>
        </ol>
      </nav>
      <div class="phead__row">
        <div class="phead__text">
          <h1 class="phead__title">${esc(P.title)}</h1>
        </div>
      </div>
      <span class="phead__stamp mono" aria-hidden="true">СНК · ${esc(P.title)} · Лист 1</span>
    </div>
  </div>
</section>

<!-- 3. Текст документа -->
<section class="policy-wrap">
  <div class="container">
    ${policyBlock(P)}
  </div>
</section>

</main>`;

  let h = read('news.html');
  const swap = (re, to, what) => { if (!re.test(h)) throw new Error(`news.html: не найден ${what}`); h = h.replace(re, to); };
  swap(/<title>[\s\S]*?<\/title>/, `<title>${esc(P.title)} — АО «НПФ «Сибнефтекарт»</title>`, '<title>');
  swap(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(P.title)} АО «НПФ «Сибнефтекарт».">`, 'description');
  swap(/<!-- Список новостей собран[^\n]*-->\n/, `<!-- Файл создан tools/build-policies.mjs из policies.js — правьте данные, а не этот файл -->\n`, 'комментарий сборки');
  swap(/<main id="main">[\s\S]*<\/main>/, main, '<main>');
  swap(/<script src="news-page\.js" defer><\/script>\n/, '', 'news-page.js');
  h = h.replace(/ aria-current="page"(?=>Новости<)/g, ''); // в меню ни один пункт не текущий
  h = h.replace(new RegExp(`<a href="${file}">`), `<a href="${file}" aria-current="page">`);
  fs.writeFileSync(path.join(ROOT, file), h);
  return file;
}

const out = [page('privacy', 'privacy.html'), page('cookies', 'cookies.html'), page('consent', 'consent.html')];
console.log(`Готово: ${out.join(', ')}.`);
