#!/usr/bin/env node
/* =========================================================
   СНК · sncard.ru — докачка картинок и файлов с sncard.ru в sncard/img/ и sncard/files/.
   Запуск:  node sncard/tools/fetch-images.mjs [--force]

   Что делает: читает data/images.json (карта «путь на sncard.ru → файл в img/»)
   и data/files.json (документы, архивы: «путь → файл в files/», null — файла
   нет и на старом сайте, генератор убирает такие ссылки), скачивает то,
   чего ещё нет, и пропускает уже скачанное.
   После загрузки нужно пересобрать страницы: node sncard/tools/generate.mjs
   — генератор сам подставит <img> вместо чертёжных заглушек и проставит размеры.
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.sncard.ru';
const FORCE = process.argv.includes('--force');
const load = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const man = { ...load('data/images.json'), ...load('data/files.json') };

let ok = 0, skip = 0, fail = [];
for (const [remote, dest] of Object.entries(man)) {
  if (!dest) continue; // файла нет и на старом сайте
  const abs = path.join(ROOT, dest);
  if (!FORCE && fs.existsSync(abs)) { skip++; continue; }
  const url = /^https?:/.test(remote) ? remote : SITE + remote;
  try {
    const res = await fetch(encodeURI(url), { headers: { 'user-agent': 'Mozilla/5.0', referer: SITE + '/' }, signal: AbortSignal.timeout(300000) });
    if (!res.ok) { fail.push(`${res.status} ${url}`); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) { fail.push(`пустой файл ${url}`); continue; }
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, buf);
    ok++;
  } catch (e) {
    fail.push(`${e.name === 'TimeoutError' ? 'таймаут' : e.message} ${url}`);
  }
}
console.log(`Скачано: ${ok}, уже было: ${skip}, не удалось: ${fail.length}`);
if (fail.length) console.log(fail.slice(0, 15).map(s => '  ' + s).join('\n'));
if (ok) console.log('Дальше: node sncard/tools/generate.mjs — страницы подхватят картинки и файлы.');
