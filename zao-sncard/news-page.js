/* =========================================================
   СНК · zao.sncard.ru — страница «Все новости».
   Разметка статическая (собрана из news.js), здесь только поведение:
   фильтр по темам, «Показать ещё», подсветка новости, на которую
   ведёт ссылка с главной. Без JS страница остаётся полным списком новостей.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const box = $('.nlist__items');
  if (!box) return;

  const tabs = $$('.nfilter__tab');
  const items = $$('.nblock', box);
  const more = $('.nlist__more .btn');
  const empty = $('.nlist__empty');
  const STEP = 12;
  let tag = 'all', limit = STEP;

  function render() {
    let n = 0;
    items.forEach(el => {
      const match = tag === 'all' || el.dataset.tag === tag;
      el.hidden = !(match && n < limit);
      if (match) n++;
    });
    if (empty) empty.hidden = n > 0;
    if (more) {
      more.hidden = n <= limit;
      more.textContent = `Показать ещё ${Math.min(STEP, n - limit)}`;
    }
  }

  function select(value) {
    tag = value;
    limit = STEP;
    tabs.forEach(t => {
      const on = t.dataset.newsTag === value;
      t.classList.toggle('is-current', on);
      t.setAttribute('aria-pressed', String(on));
    });
    render();
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    select(tab.dataset.newsTag);
    // Адрес хранит выбранную тему: ссылку со страницы можно переслать
    const url = new URL(location.href);
    url.hash = '';
    if (tag === 'all') url.searchParams.delete('tema');
    else url.searchParams.set('tema', tag);
    history.replaceState(null, '', url.searchParams.toString() ? url : location.pathname);
  }));

  if (more) more.addEventListener('click', () => { limit += STEP; render(); });

  // Тема из адреса (?tema=Сеть АЗС) — например, из закладки
  const start = new URLSearchParams(location.search).get('tema');
  select(start && tabs.some(t => t.dataset.newsTag === start) ? start : 'all');

  /* Новость, на которую ведёт ссылка с главной: показываем и отмечаем рамкой */
  function markTarget() {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (!el || !el.classList.contains('nblock')) return;
    if (el.hidden) { // скрыта фильтром или «Показать ещё» — открываем все
      select('all');
      limit = items.length;
      render();
    }
    items.forEach(x => x.classList.remove('is-target'));
    el.classList.add('is-target');
    el.scrollIntoView({ block: 'start' });
  }
  markTarget();
  window.addEventListener('hashchange', markTarget);
})();
