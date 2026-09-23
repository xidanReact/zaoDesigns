/* =========================================================
   СНК · zao.sncard.ru — страница «Все новости».
   Разметка статическая (собрана из news.js), здесь только поведение:
   фильтр по темам, подсветка новости, на которую ведёт ссылка с главной.
   Без JS страница остаётся полным списком новостей.
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const feed = $('.nfeed');
  if (!feed) return;

  const chips = $$('.nfilter__chip');
  const items = $$('.nitem', feed);
  const years = $$('.nyear', feed);
  const shown = $('.nfilter__shown');
  const empty = $('.nlist__empty');
  const plural = (n, [one, few, many]) => {
    const a = n % 10, b = n % 100;
    return (a === 1 && b !== 11) ? one : (a >= 2 && a <= 4 && (b < 10 || b >= 20)) ? few : many;
  };

  function apply(tag) {
    let n = 0;
    items.forEach(li => {
      const ok = tag === 'all' || li.dataset.tag === tag;
      li.hidden = !ok;
      if (ok) n++;
    });
    // Год остаётся, только если под ним что-то осталось
    years.forEach(y => {
      let has = false;
      for (let el = y.nextElementSibling; el && !el.classList.contains('nyear'); el = el.nextElementSibling) {
        if (el.classList.contains('nitem') && !el.hidden) { has = true; break; }
      }
      y.hidden = !has;
    });
    if (empty) empty.hidden = n > 0;
    if (shown) {
      shown.textContent = tag === 'all'
        ? ''
        : `${n} ${plural(n, ['запись', 'записи', 'записей'])} по теме «${tag}» из ${items.length}`;
    }
  }

  chips.forEach(chip => chip.addEventListener('click', () => {
    const tag = chip.dataset.newsTag;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    apply(tag);
    // Адрес хранит выбранную тему: ссылку со страницы можно переслать
    const url = new URL(location.href);
    url.hash = '';
    if (tag === 'all') url.searchParams.delete('tema');
    else url.searchParams.set('tema', tag);
    history.replaceState(null, '', url.searchParams.toString() ? url : location.pathname);
  }));

  // Тема из адреса (?tema=Сеть АЗС) — например, из закладки
  const start = new URLSearchParams(location.search).get('tema');
  const preset = start && chips.find(c => c.dataset.newsTag === start);
  if (preset) {
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === preset)));
    apply(start);
  }

  /* Новость, на которую ведёт ссылка с главной: отмечаем засечкой */
  function markTarget() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const li = document.getElementById(id);
    if (!li || !li.classList.contains('nitem')) return;
    if (li.hidden) { // ссылка пришла на новость, скрытую фильтром — показываем все
      chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.newsTag === 'all')));
      apply('all');
    }
    items.forEach(x => x.classList.remove('is-target'));
    li.classList.add('is-target');
  }
  markTarget();
  window.addEventListener('hashchange', markTarget);
})();
