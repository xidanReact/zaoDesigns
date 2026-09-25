#!/usr/bin/env node
/* =========================================================
   СНК · snc-service — докачка документов и архивов со старого сайта в snc-service/files/.
   Запуск:  node snc-service/tools/fetch-files.mjs [--force]

   Что делает: читает data/files.json (карта «путь на старом сайте → файл в files/»;
   null — файла нет и на старом сайте, генератор убирает такие ссылки),
   скачивает то, чего ещё нет, и пропускает уже скачанное. Файл ищется
   на snc-service.sncard.ru, при 404 — на www.sncard.ru.
   После загрузки нужно пересобрать страницы: node snc-service/tools/generate.mjs
   ========================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOSTS = ['https://snc-service.sncard.ru', 'https://www.sncard.ru'];
const FORCE = process.argv.includes('--force');
const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/files.json'), 'utf8'));

let ok = 0, skip = 0, fail = [];
for (const [remote, dest] of Object.entries(man)) {
  if (!dest) continue; // файла нет и на старом сайте
  const abs = path.join(ROOT, dest);
  if (!FORCE && fs.existsSync(abs)) { skip++; continue; }
  let err = '';
  for (const host of HOSTS) {
    const url = host + encodeURI(remote);
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0', referer: host + '/' }, signal: AbortSignal.timeout(300000) });
      if (!res.ok) { err = `${res.status} ${url}`; continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) { err = `пустой файл ${url}`; continue; }
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, buf);
      ok++; err = '';
      break;
    } catch (e) {
      err = `${e.name === 'TimeoutError' ? 'таймаут' : e.message} ${url}`;
    }
  }
  if (err) fail.push(err);
}
console.log(`Скачано: ${ok}, уже было: ${skip}, не удалось: ${fail.length}`);
if (fail.length) console.log(fail.slice(0, 15).map(s => '  ' + s).join('\n'));
if (ok) console.log('Дальше: node snc-service/tools/generate.mjs — страницы подхватят файлы.');
