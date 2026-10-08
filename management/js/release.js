/* =========================================================
   СНК · Управление продуктами — выпуск обновления (шаблон «Форма»).
   Сборка (загрузка файла), описание, получатели, подтверждение
   с последствиями, журнал выпусков. TODO: загрузка и выпуск на сервере.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = window.SNC_DEMO, SNC = window.SNC;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const form = $('#rel-form');
  const releases = D.releases.map(r => ({ ...r }));

  /* ---------- Журнал выпусков ---------- */
  const table = () => {
    $('#rel-table tbody').innerHTML = releases.map(r => `<tr><td class="cell-main mono">${r.version}</td><td>${r.product}</td><td class="mono">${r.date}</td><td class="wrap">${esc(r.notes)}</td><td class="num-cell">${r.stations}</td><td><span class="st st--${r.st}">${r.state}</span></td></tr>`).join('');
  };
  table();

  /* ---------- Версия: подсказка о текущей ---------- */
  const current = p => releases.filter(r => r.product === p && r.st === 'ok').map(r => r.version).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0];
  const verHint = () => { $('[data-ver-hint]').textContent = `Сейчас выпущена ${current($('#r-product').value)}`; };
  $('#r-product').addEventListener('change', () => { $('#r-version').value = $('#r-product').value === 'СНК-Офис' ? '3.9.0' : '4.13.0'; verHint(); });
  verHint();

  /* ---------- Получатели ---------- */
  const orgs = $('#r-orgs');
  $('.opts', orgs).innerHTML = D.ORGS.map(o => `<div class="opt" role="option" data-value="${o.id}" aria-selected="false"><span class="opt__text">${esc(o.name)}</span></div>`).join('');
  SNC.initSelect(orgs);
  let chosen = [];
  orgs.addEventListener('change', e => { if (e.detail) { chosen = e.detail.values; if (chosen.length) $('[data-orgs-err]').textContent = ''; } });
  $$('input[name="r-to"]').forEach(r => r.addEventListener('change', () => { $('[data-orgs]').hidden = $('input[name="r-to"]:checked').value !== 'some'; }));

  /* ---------- Проверка и выпуск ---------- */
  const checkAll = () => {
    let ok = SNC.validate(form);
    const ver = $('#r-version').value.trim();
    const cur = current($('#r-product').value);
    if (ok && cur && ver.localeCompare(cur, undefined, { numeric: true }) <= 0) {
      const f = $('#r-version').closest('.fld'); f.classList.add('is-invalid'); $('.fld__err', f).textContent = `Версия должна быть выше ${cur}`; $('#r-version').focus(); ok = false;
    }
    const files = $$('#rel-files .file.is-done');
    if (ok && !files.length) { $('#rel-file-err').textContent = 'Загрузите файл сборки'; $('.drop').classList.add('is-invalid'); $('.drop input').focus(); ok = false; }
    if (ok && $('input[name="r-to"]:checked').value === 'some' && !chosen.length) { $('[data-orgs-err]').textContent = 'Выберите хотя бы одну организацию'; $('.sel__btn', orgs).focus(); ok = false; }
    return ok;
  };
  $('[data-release]').addEventListener('click', () => {
    if (!checkAll()) return;
    const ver = $('#r-version').value.trim(), prod = $('#r-product').value;
    const who = $('input[name="r-to"]:checked').value === 'all' ? 'всем организациям' : `${chosen.length} организациям`;
    const n = $('input[name="r-to"]:checked').value === 'all' ? D.stations.length : D.stations.filter(s => chosen.includes(String(s.org))).length;
    $('[data-rel-sub]').textContent = `${prod} ${ver} — ${who}`;
    $('[data-rel-list]').innerHTML = `<li>${n} точек скачают сборку и установят её ночью после закрытия смены</li><li>Версия ${esc(current(prod))} останется доступной для отката 30 дней</li>${$('#r-notify').checked ? '<li>Пользователи получат уведомление с описанием изменений</li>' : ''}`;
    SNC.dialog.open('dlg-release');
  });
  $('[data-release-ok]').addEventListener('click', e => {
    const b = e.currentTarget;
    b.dataset.loading = 'true'; b.insertAdjacentHTML('beforeend', '<span class="spinner" aria-hidden="true"></span>');
    setTimeout(() => {
      delete b.dataset.loading; $('.spinner', b)?.remove();
      const ver = $('#r-version').value.trim(), prod = $('#r-product').value;
      releases.forEach(r => { if (r.product === prod && r.st === 'warn' && r.version === ver) r.hide = true; });
      releases.splice(0, releases.length, { version: ver, product: prod, date: D.today, state: 'Выпущено', st: 'ok', stations: 0, notes: $('#r-text').value.trim() }, ...releases.filter(r => !r.hide));
      table();
      $('#rel-table tbody tr').classList.add('is-changed');
      SNC.dialog.close('dlg-release');
      form.dispatchEvent(new Event('reset'));
      SNC.toast({ type: 'ok', title: `${prod} ${ver} выпущено`, text: 'Точки начнут установку сегодня ночью.' });
    }, 1000);
  });
  $('[data-draft]').addEventListener('click', () => { form.dispatchEvent(new Event('reset')); SNC.toast({ type: 'ok', title: 'Черновик выпуска сохранён', text: 'Точки его не получат, пока вы не выпустите обновление.' }); });
  form.addEventListener('submit', e => e.preventDefault());
  form.dispatchEvent(new Event('reset'));
})();
