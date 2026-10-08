/* =========================================================
   СНК · Управление продуктами — привилегии пользователя (шаблон «Дерево»).
   ?user=<id>. Дерево прав строится из карты разделов (data/nav.js):
   продукт → раздел → «просмотр» / «изменение». Готовые наборы,
   доступные ТО, блокировка и сброс пароля. TODO: API.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = window.SNC_DEMO, NAV = window.SNC_NAV, SNC = window.SNC;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const uid = Number(new URLSearchParams(location.search).get('user')) || D.users[1].id;
  const u = { ...(D.users.find(x => x.id === uid) || D.users[1]) };
  const org = D.ORGS.find(o => o.id === u.org);
  const form = $('#perm-form');
  const admin = u.role === 'Администратор';

  /* ---------- Шапка ---------- */
  const head = () => {
    $('[data-f="name"]').textContent = u.name;
    $('[data-f="sub"]').innerHTML = `<span class="mono">${u.login}</span> · <a href="organization.html?org=${org.id}">${esc(org.name)}</a> · <span class="st st--${u.st}">${u.state}</span>`;
    $('[data-f="role"]').textContent = u.role; $('[data-f="last"]').textContent = u.last;
    $('[data-block-label]').textContent = u.st === 'err' ? 'Разблокировать' : 'Заблокировать';
    $('[data-block]').className = `btn btn--${u.st === 'err' ? 'outline' : 'danger'} btn--sm`;
  };
  head();
  document.title = `${u.name} · Привилегии · Управление продуктами СНК`;
  const crumb = $('.crumbs [aria-current]'); if (crumb) crumb.textContent = u.name;

  /* ---------- Дерево привилегий ---------- */
  const cb = (label, checked) => `<label class="cb"><input type="checkbox" tabindex="-1" aria-label="${esc(label)}"${checked ? ' checked' : ''}><span class="cb__box"><svg viewBox="0 0 12 12"><path class="cb__tick" d="M2.5 6.2l2.3 2.3L9.5 3.5"/><path class="cb__dash" d="M3 6h6"/></svg></span></label>`;
  const twist = '<button class="tree__twist" type="button" tabindex="-1" aria-hidden="true"><svg><use href="#i-chevron-right"/></svg></button>';
  const granted = (prod, i, kind) => admin || (prod.id === 'azs' && (kind === 'view' || i < 2)) || (prod.id === 'office' && kind === 'view' && i < 4);
  let rows = '';
  NAV.PRODUCTS.forEach(p => {
    const items = p.groups.flatMap(g => g.items);
    rows += `<div class="tree__row" role="treeitem" aria-level="1" aria-expanded="${p.id === 'azs'}" data-prod="${p.id}"><div class="tree__main">${twist}${cb(p.title)}<span class="tree__name">${esc(p.title)}</span></div><span class="tree__meta">${items.length} разделов</span></div>`;
    items.forEach((it, i) => {
      rows += `<div class="tree__row" role="treeitem" aria-level="2" aria-expanded="false"><div class="tree__main">${twist}${cb(it.title)}<span class="tree__name">${esc(it.title)}</span></div><span class="tree__meta">${it.code}</span></div>`;
      [['view', 'Просмотр'], ['edit', 'Изменение']].forEach(([k, l]) => {
        if (k === 'edit' && ['analytics', 'monitoring'].includes(it.tpl)) return; // в аналитике и мониторинге править нечего
        rows += `<div class="tree__row" role="treeitem" aria-level="3" data-perm="${k}"><div class="tree__main"><span class="tree__leaf"></span>${cb(`${it.title}: ${l.toLowerCase()}`, granted(p, i, k))}<span class="tree__name">${l}</span></div><span class="tree__meta">${k === 'view' ? 'чтение' : 'создание, правка, удаление'}</span></div>`;
      });
    });
  });
  const tree = $('#perm-tree');
  tree.innerHTML = rows;
  tree.setAttribute('data-tree', '');
  SNC.initTree(tree);

  // Готовые наборы: отмечаем листья и пересчитываем родителей через событие change
  const leaves = () => $$('.tree__row[aria-level="3"] input', tree);
  const setLeaves = fn => {
    leaves().forEach(c => { c.checked = fn(c.closest('.tree__row')); });
    // пересчёт родителей: по одному событию на каждый раздел
    $$('.tree__row[aria-level="3"]', tree).forEach(r => { const n = r.nextElementSibling; if (!n || n.getAttribute('aria-level') !== '3') $('input', r).dispatchEvent(new Event('change', { bubbles: true })); });
    form.dispatchEvent(new Event('change'));
  };
  $('[data-preset]').addEventListener('click', e => {
    const b = e.target.closest('[data-p]'); if (!b) return;
    const prodOf = r => { let p = r.previousElementSibling; while (p && p.getAttribute('aria-level') !== '1') p = p.previousElementSibling; return p?.dataset.prod; };
    if (b.dataset.p === 'none') setLeaves(() => false);
    if (b.dataset.p === 'view') setLeaves(r => r.dataset.perm === 'view');
    if (b.dataset.p === 'azs') setLeaves(r => prodOf(r) === 'azs');
    SNC.toast({ type: 'info', title: `Набор «${b.textContent}» применён`, text: 'Проверьте отметки и сохраните.' });
  });

  /* ---------- ТО пользователя ---------- */
  const st = D.stations.filter(s => s.org === u.org);
  const list = $('#poses');
  list.innerHTML = st.map((s, i) => `<li class="pos"><label class="pos__label">${cb(`${s.name}, ${s.code}`, i < u.poses).replace('tabindex="-1" ', '')}<span><b>${esc(s.name)}</b> <span class="mono muted">${s.code}</span><small>${esc(s.address)}</small></span></label><span class="st st--${D.STATE[s.state].st}">${D.STATE[s.state].short || D.STATE[s.state].label}</span></li>`).join('');
  const posCount = () => { const n = $$('input', list).filter(c => c.checked).length; $('[data-f="poses"]').textContent = `${n} из ${st.length}`; $('[data-f="poses-count"]').textContent = n; };
  posCount();
  list.addEventListener('change', posCount);
  $('[data-pos-all]').addEventListener('click', () => { $$('input', list).forEach(c => { if (!c.closest('.pos').hidden) c.checked = true; }); posCount(); form.dispatchEvent(new Event('change')); });
  $('[data-pos-none]').addEventListener('click', () => { $$('input', list).forEach(c => { c.checked = false; }); posCount(); form.dispatchEvent(new Event('change')); });
  $('[data-pos-search]').addEventListener('input', e => { const q = e.target.value.trim().toLowerCase(); $$('.pos', list).forEach(li => { li.hidden = q && !li.textContent.toLowerCase().includes(q); }); });

  /* ---------- Действия ---------- */
  $('[data-reset-pass]').addEventListener('click', () => SNC.toast({ type: 'ok', title: 'Ссылка для нового пароля отправлена', text: `На ${u.email}. Ссылка действует 24 часа.` }));
  $('[data-block]').addEventListener('click', () => {
    const was = { state: u.state, st: u.st };
    const blocking = u.st !== 'err';
    Object.assign(u, blocking ? { state: 'Блокирован', st: 'err' } : { state: 'Активен', st: 'ok' });
    head();
    SNC.toast({ type: 'ok', title: blocking ? 'Пользователь заблокирован' : 'Пользователь разблокирован', text: blocking ? 'Текущие сеансы завершены, войти он не сможет.' : 'Он снова может войти в кабинет.', action: { label: 'Вернуть', onClick: () => { Object.assign(u, was); head(); } } });
  });
  // начальная отрисовка не считается правкой
  form.dispatchEvent(new Event('reset'));
})();
