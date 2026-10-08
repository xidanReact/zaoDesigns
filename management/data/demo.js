/* =========================================================
   СНК · Управление продуктами — ДЕМО-ДАННЫЕ прототипа.
   Всё вымышлено: организации, адреса, номера ТО, суммы. Названия
   населённых пунктов и их координаты настоящие — только для раскладки
   точек на карте-схеме. Реальные данные клиентов сюда не класть.
   Генерация детерминированная (одинаковый результат при каждой сборке),
   файл читают и tools/generate.mjs (статичные строки таблиц), и страницы.
   TODO: в боевой версии — API management.sncard.ru и живые данные по NATS.
   ========================================================= */
(function (root) {
  // Детерминированный генератор случайных чисел (mulberry32)
  let seed = 20260930;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pick = a => a[Math.floor(rnd() * a.length)];
  const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));

  // Типы организаций — как в боевом приложении: 1 Агент, 2 Продавец (это клиенты), 3 Сервис, 4 Партнёр.
  // От типа зависит доступ: СНК-АЗС и СНК-Офис — только клиентам; «Квоты по клиентам» — только партнёрам.
  const ORG_TYPES = { 1: 'Агент', 2: 'Продавец', 3: 'Сервис', 4: 'Партнёр' };
  // Клиенты — владельцы точек обслуживания
  const ORGS = [
    { id: 1, name: 'ООО «Демо-Ойл»', short: 'Демо-Ойл', type: 1 },
    { id: 2, name: 'ООО «Пример-Трейд»', short: 'Пример-Трейд', type: 2 },
    { id: 3, name: 'АО «Тестовая сеть»', short: 'Тестовая сеть', type: 1 },
    { id: 4, name: 'ИП Образцов', short: 'ИП Образцов', type: 2 }
  ];
  // Все организации кабинета: клиенты + партнёры и сервисы (у них нет своих точек)
  const ORGS_ALL = ORGS.concat([
    { id: 5, name: 'ООО «Демо-Заправка»', short: 'Демо-Заправка', type: 4 },
    { id: 6, name: 'ООО «Пример-Pay»', short: 'Пример-Pay', type: 3 }
  ]);

  // Населённые пункты Томской области: [название, широта, долгота, вес]
  const PLACES = [
    ['Томск', 56.4977, 84.9744, 14], ['Северск', 56.6031, 84.8809, 4], ['Асино', 56.9907, 86.1765, 3],
    ['Колпашево', 58.3131, 82.9023, 3], ['Стрежевой', 60.7328, 77.6040, 3], ['Кедровый', 57.5610, 79.5680, 1],
    ['Кожевниково', 56.2600, 83.9700, 2], ['Мельниково', 56.5590, 84.0860, 2], ['Бакчар', 57.0200, 82.0700, 1],
    ['Первомайское', 57.0700, 86.2300, 2], ['Зырянское', 56.8300, 86.6200, 1], ['Каргасок', 59.0600, 80.8600, 2],
    ['Молчаново', 57.5800, 83.7700, 2], ['Тегульдет', 57.3100, 88.1700, 1], ['Белый Яр', 58.4400, 85.0300, 2],
    ['Подгорное', 57.7900, 82.6400, 1], ['Парабель', 58.7000, 81.4800, 2], ['Кривошеино', 57.3400, 83.9300, 2]
  ];
  const STREETS = ['ул. Демонстрационная', 'ул. Примерная', 'ул. Тестовая', 'пр. Образцовый', 'ул. Макетная', 'тракт Проектный'];

  // Состояния ТО (ключи — как в словаре боевого приложения), знак статуса — для .st--*
  const STATE = {
    1: { label: 'В сети', st: 'ok' },
    0: { label: 'Не в сети', st: 'off' },
    2: { label: 'Нестабильное подключение', st: 'warn', short: 'Нестабильно' },
    3: { label: 'Чужая система управления', st: 'warn', short: 'Чужая система' },
    4: { label: 'Не настроен терминал', st: 'warn', short: 'Нет терминала' },
    5: { label: 'Отсутствует лицензия', st: 'err', short: 'Нет лицензии' },
    6: { label: 'Сервис отключен', st: 'off' }
  };
  // Состояния ТРК
  const PUMP = {
    1: { label: 'Свободна', st: 'ok' }, 3: { label: 'Работает', st: 'info' }, 6: { label: 'Пистолет снят', st: 'info' },
    5: { label: 'Остановлена', st: 'warn' }, 7: { label: 'Нет ответа', st: 'err' }, 100: { label: 'Заблокирована', st: 'err' },
    0: { label: 'Отключена', st: 'off' }
  };
  const FUELS = ['АИ-92', 'АИ-95', 'АИ-100', 'ДТ', 'СУГ'];
  const VERSIONS = ['4.12.0', '4.12.0', '4.11.3', '4.11.3', '4.10.8'];

  // Распределение состояний на 48 ТО: большинство в сети, немного проблем
  const STATES = [].concat(Array(38).fill(1), [2, 2, 2, 0, 0, 0, 5, 4, 6, 3]);
  for (let i = STATES.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [STATES[i], STATES[j]] = [STATES[j], STATES[i]]; }

  const placeBag = PLACES.flatMap(p => Array(p[3]).fill(p));
  const stations = STATES.map((state, i) => {
    const place = placeBag[i % placeBag.length];
    const online = state !== 0 && state !== 6;
    const pumpsN = int(2, 6);
    const pumps = Array.from({ length: pumpsN }, (_, k) => {
      let s = online ? pick([1, 1, 1, 3, 3, 6]) : 0;
      if (online && state === 2 && k === 0) s = 7;
      if (online && rnd() < 0.04) s = pick([5, 100]);
      return { n: k + 1, state: s, fuels: FUELS.slice(0, int(2, 4)) };
    });
    // Разброс координат вокруг населённого пункта, чтобы точки не слипались
    const jitter = place[0] === 'Томск' ? 0.1 : 0.16;
    return {
      id: 100 + i * 7,
      code: `ТО-${String(100 + i * 7).padStart(4, '0')}`,
      name: `АЗС № ${i + 3}`,
      org: ORGS[i % ORGS.length].id,
      city: place[0],
      address: `${place[0]}, ${pick(STREETS)}, ${int(1, 120)}`,
      lat: +(place[1] + (rnd() - 0.5) * jitter).toFixed(4),
      lon: +(place[2] + (rnd() - 0.5) * jitter * 1.8).toFixed(4),
      state,
      version: pick(VERSIONS),
      terminal: `T-${1000 + i}`,
      hasp: String(783000 + i * 13),
      shift: { n: online ? int(380, 460) : int(300, 379), open: online },
      sales: online ? int(38, 320) * 1000 + int(0, 99) * 10 : 0,
      // секунд с последнего сеанса
      seen: online ? (state === 2 ? int(60, 900) : int(0, 50)) : int(1800, 90000),
      pumps
    };
  });

  /* ---------- Даты: «сегодня» прототипа — 30.09.2026 ---------- */
  const TODAY = new Date(2026, 8, 30, 14, 5, 0);
  const pad = n => String(n).padStart(2, '0');
  const dt = d => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  const tm = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  // сегодняшние события — не позже «сейчас» (14:05)
  const daysAgo = (n, h = int(8, 20), m = int(0, 59)) => { const d = new Date(TODAY); d.setDate(d.getDate() - n); if (n === 0 && h >= 14) h = 8 + h % 6; d.setHours(h, m, 0, 0); return d; };
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  /* ---------- Люди (вымышленные) ---------- */
  const SURN = ['Петров', 'Смирнова', 'Кузнецов', 'Иванова', 'Соколов', 'Попова', 'Лебедев', 'Козлова', 'Новиков', 'Морозова', 'Волков', 'Павлова', 'Семёнов', 'Голубева', 'Виноградов', 'Богданова', 'Фёдоров', 'Михайлова'];
  const INIT = ['И. С.', 'А. В.', 'Д. Н.', 'Е. П.', 'О. А.', 'М. И.', 'С. Г.', 'Т. Ю.', 'В. К.', 'Н. Л.'];
  const LAT = { 'Петров': 'petrov', 'Смирнова': 'smirnova', 'Кузнецов': 'kuznetsov', 'Иванова': 'ivanova', 'Соколов': 'sokolov', 'Попова': 'popova', 'Лебедев': 'lebedev', 'Козлова': 'kozlova', 'Новиков': 'novikov', 'Морозова': 'morozova', 'Волков': 'volkov', 'Павлова': 'pavlova', 'Семёнов': 'semenov', 'Голубева': 'golubeva', 'Виноградов': 'vinogradov', 'Богданова': 'bogdanova', 'Фёдоров': 'fedorov', 'Михайлова': 'mikhailova' };
  const users = SURN.map((s, i) => {
    const org = ORGS[i % ORGS.length];
    const blocked = i === 7 || i === 13;
    return {
      id: 200 + i, name: `${s} ${INIT[i % INIT.length]}`, login: LAT[s], email: `${LAT[s]}@${['demo-oil', 'primer-trade', 'test-set', 'obraztsov'][org.id - 1]}.example`,
      org: org.id, role: i % 5 === 0 ? 'Администратор' : 'Пользователь', state: blocked ? 'Блокирован' : 'Активен', st: blocked ? 'err' : 'ok',
      poses: int(1, 12), last: blocked ? dt(daysAgo(int(40, 90))) : `${dt(daysAgo(int(0, 6)))} ${tm(daysAgo(0))}`
    };
  });

  /* ---------- Товары ---------- */
  const GOODS_SRC = [
    ['Масло моторное 5W-40, 4 л', 'Автотовары', 'шт', 3190], ['Масло моторное 10W-40, 1 л', 'Автотовары', 'шт', 890], ['Жидкость омывающая −20 °С, 5 л', 'Автотовары', 'шт', 420],
    ['Антифриз G12, 1 л', 'Автотовары', 'шт', 510], ['Щётка стеклоочистителя 60 см', 'Автотовары', 'шт', 760], ['Лампа H7', 'Автотовары', 'шт', 390],
    ['Тосол, 5 л', 'Автотовары', 'шт', 980], ['AdBlue, 10 л', 'Автотовары', 'шт', 1150], ['Кофе американо 0,3 л', 'Кафе', 'шт', 160],
    ['Капучино 0,3 л', 'Кафе', 'шт', 190], ['Чай чёрный 0,3 л', 'Кафе', 'шт', 90], ['Хот-дог классический', 'Кафе', 'шт', 210],
    ['Сэндвич с курицей', 'Кафе', 'шт', 240], ['Вода питьевая 0,5 л', 'Сопутствующие', 'шт', 60], ['Вода питьевая 1,5 л', 'Сопутствующие', 'шт', 95],
    ['Шоколад молочный 90 г', 'Сопутствующие', 'шт', 120], ['Жевательная резинка', 'Сопутствующие', 'шт', 55], ['Салфетки влажные', 'Сопутствующие', 'шт', 85],
    ['Газ в баллоне 5 л', 'Топливо фасованное', 'шт', 650], ['Уголь древесный 3 кг', 'Сопутствующие', 'шт', 270], ['Карта топливная пластиковая', 'Карты', 'шт', 150],
    ['Ароматизатор подвесной', 'Автотовары', 'шт', 180], ['Перчатки рабочие', 'Автотовары', 'пара', 70], ['Трос буксировочный 5 т', 'Автотовары', 'шт', 890]
  ];
  const goods = GOODS_SRC.map(([name, group, unit, price], i) => ({
    id: 300 + i, code: String(100200 + i * 17), name, group, unit, price, vat: group === 'Карты' ? 'Без НДС' : '20%',
    barcode: `46${String(int(10000000000, 99999999999))}`, active: i !== 6 && i !== 19
  }));

  /* ---------- Контрагенты, эмитенты, сервисы ---------- */
  const contractors = ['ООО «Демо-Поставка»', 'ООО «Пример-Логистик»', 'АО «Тестовый нефтесклад»', 'ООО «Макет-Опт»', 'ИП Шаблонов', 'ООО «Образец-Трейд»', 'ООО «Проект-Снаб»', 'АО «Демо-Терминал»']
    .map((name, i) => ({ id: 400 + i, name, inn: `70000000${pad(i + 11)}`, kind: ['Поставщик', 'Грузоперевозчик', 'Грузоотправитель'][i % 3], phone: `+7 (3822) 00-0${i}-${pad(10 + i)}`, contract: `${10 + i}-П/2026` }));
  const issuers = ['Демо-Карт', 'Пример-Процессинг', 'Тест-Флот', 'Макет-Лояльность', 'Образец-Бонус', 'Проект-Корп']
    .map((name, i) => ({ id: 500 + i, name, code: `EM-${pad(i + 1)}`, cards: ['Топливная', 'Дисконтная'][i % 2], active: i !== 4, org: ORGS[i % ORGS.length].id }));
  const services = ['Демо-Заправка', 'Пример-Pay', 'Тест-Навигатор', 'Макет-Флит']
    .map((name, i) => ({ id: 600 + i, name, kind: ['Мобильное приложение', 'Агрегатор', 'Навигатор', 'Корпоративный сервис'][i], stations: int(8, 40), active: i !== 3 }));

  /* ---------- Договоры, спецификации, ключи, лицензии ---------- */
  const CONTRACT_ST = [['Создан', 'off'], ['Требуется подпись', 'warn'], ['Отправлен в ЭДО', 'info'], ['Подписан', 'ok'], ['В работе', 'ok'], ['Закрыт', 'off'], ['Заблокирован', 'err']];
  const contracts = [];
  const specs = [];
  ORGS.forEach(o => {
    const n = o.id === 1 ? 3 : int(1, 2);
    for (let k = 0; k < n; k++) {
      const st = o.id === 1 ? [4, 3, 1][k] : pick([3, 4, 4, 2]);
      const c = { id: 700 + contracts.length, org: o.id, number: `${int(10, 48)}-Д/${2024 + (k % 3)}`, date: dt(daysAgo(int(60, 700))), state: CONTRACT_ST[st][0], st: CONTRACT_ST[st][1], subject: k === 0 ? 'Лицензии и сопровождение СНК-АЗС' : pick(['Лицензии СНК-Офис', 'Сопровождение и обновления', 'Процессинг топливных карт']) };
      contracts.push(c);
      for (let j = 0; j < int(1, 3); j++) specs.push({ id: 800 + specs.length, contract: c.id, org: o.id, number: `${j + 1}`, date: dt(daysAgo(int(10, 400))), total: int(40, 480) * 1000, state: j === 0 ? 'Действует' : pick(['Действует', 'Черновик']), items: int(2, 6) });
    }
  });
  const HASP_ST = [['Активен', 'ok'], ['Блокирован', 'err'], ['Требует активации', 'warn']];
  const hasps = stations.slice(0, 30).map((s, i) => {
    const st = i === 4 ? 2 : i === 11 ? 1 : i === 19 ? 2 : 0;
    return { id: 900 + i, number: s.hasp, org: s.org, station: st === 2 ? null : s.id, stationName: st === 2 ? '—' : `${s.name} · ${s.code}`, kind: i % 6 === 0 ? 'Сервер офиса' : 'Рабочее место АЗС', state: HASP_ST[st][0], st: HASP_ST[st][1], until: dt(daysAgo(-int(20, 400), 0, 0)) };
  });
  const licenses = [];
  ORGS.forEach(o => ['СНК-АЗС', 'СНК-Офис', 'Мобильные сервисы'].forEach((p, k) => {
    if (o.id === 4 && k === 2) return;
    const total = k === 1 ? int(1, 3) : int(4, 20);
    licenses.push({ id: 1000 + licenses.length, org: o.id, product: p, total, used: Math.max(0, total - int(0, 3)), until: dt(daysAgo(-int(15, 380), 0, 0)) });
  }));

  /* ---------- Заявки мобильных сервисов (сегодня) ---------- */
  const REQ_ST = { done: ['Завершена', 'ok'], pour: ['Идёт налив', 'info'], empty: ['Без пролива', 'off'], problem: ['Проблемная', 'err'] };
  const ORDER = ['На литры', 'На сумму', 'Полный бак'];
  const PRICE = { 'АИ-92': 58.9, 'АИ-95': 64.3, 'АИ-100': 79.5, 'ДТ': 71.2, 'СУГ': 32.4 };
  const online = stations.filter(s => s.state !== 0 && s.state !== 6);
  const requests = Array.from({ length: 72 }, (_, i) => {
    const s = pick(online);
    const pumpN = int(1, s.pumps.length);
    const fuel = pick(s.pumps[pumpN - 1].fuels);
    const kind = i < 3 ? 'pour' : i % 29 === 7 ? 'problem' : i % 11 === 3 ? 'empty' : 'done';
    const type = pick(ORDER);
    const litres = type === 'Полный бак' ? int(20, 55) : int(10, 50);
    const got = kind === 'done' ? litres - (type === 'Полный бак' ? 0 : int(0, 1) * 0.3) : kind === 'pour' ? +(litres * 0.4).toFixed(2) : 0;
    const d = new Date(TODAY); d.setMinutes(d.getMinutes() - i * int(6, 14));
    return {
      id: 58214 - i, time: `${tm(d)}:${pad(int(0, 59))}`, hour: d.getHours(), station: s.id, stationName: s.name, code: s.code, pump: pumpN, nozzle: int(1, 3), fuel,
      type, ordered: type === 'На сумму' ? `${(Math.round(litres * PRICE[fuel] / 50) * 50).toLocaleString('ru-RU')} ₽` : type === 'Полный бак' ? 'полный бак' : `${litres} л`,
      litres: +(+got).toFixed(2), amount: Math.round(got * PRICE[fuel] * 100) / 100, service: pick(services.slice(0, 3)).name, card: pick(['Без карты', 'Топливная', 'Дисконтная']),
      person: pick(['Физическое лицо', 'Физическое лицо', 'Юридическое лицо']), kind, state: REQ_ST[kind][0], st: REQ_ST[kind][1]
    };
  });

  /* ---------- Склад: документы ТМЦ ---------- */
  const DOC_KIND = { orders: 'Поставка', movements: 'Перемещение', 'write-offs': 'Списание', postings: 'Оприходование', 'price-lists': 'Прайс-лист' };
  const docs = [];
  Object.keys(DOC_KIND).forEach((kind, ki) => {
    for (let i = 0; i < (kind === 'price-lists' ? 5 : 14); i++) {
      const lines = Array.from({ length: int(3, 9) }, () => { const g = pick(goods); const q = int(1, 40); const price = Math.round(g.price * (kind === 'orders' ? 0.72 : 1)); return { good: g.id, name: g.name, code: g.code, unit: g.unit, qty: q, price, sum: q * price }; });
      const posted = i > 1 || kind === 'price-lists';
      const from = pick(stations), to = pick(stations);
      docs.push({
        id: 1100 + docs.length, kind, kindName: DOC_KIND[kind], number: `${['ПТ', 'ПМ', 'СП', 'ОП', 'ПЛ'][ki]}-${String(412 - i * 3).padStart(5, '0')}`, date: dt(daysAgo(i * 2 + int(0, 1))),
        point: `${from.name} · ${from.city}`, pointTo: kind === 'movements' ? `${to.name} · ${to.city}` : '', contractor: kind === 'orders' ? pick(contractors).name : '',
        reason: kind === 'write-offs' ? pick(['Истёк срок годности', 'Бой, порча', 'Недостача по инвентаризации']) : '', author: pick(users).name,
        state: posted ? 'Проведён' : 'Черновик', st: posted ? 'ok' : 'off', lines, total: lines.reduce((a, l) => a + l.sum, 0)
      });
    }
  });

  /* ---------- Журнал изменений и выпуски ---------- */
  const LOG_ACT = [['Изменён', 'info'], ['Создан', 'ok'], ['Удалён', 'err'], ['Вход', 'off']];
  const changeLog = Array.from({ length: 40 }, (_, i) => {
    const a = LOG_ACT[i % 7 === 3 ? 2 : i % 5 === 0 ? 3 : i % 3 === 0 ? 1 : 0];
    const obj = pick([['Товары', `«${pick(goods).name}»`], ['Пользователи', pick(users).name], ['Спецификации', `спецификация № ${int(1, 3)} к договору ${pick(contracts).number}`], ['Hasp-ключи', `ключ ${pick(hasps).number}`], ['Точки обслуживания', `${pick(stations).name}`], ['Перекодировка топлива', `код ${int(1, 30)} → ${pick(FUELS)}`]]);
    const d = daysAgo(Math.floor(i / 6)); d.setMinutes(d.getMinutes() - i * 13);
    return { id: 1300 + i, when: `${dt(d)} ${tm(d)}`, user: pick(users).name, section: a[0] === 'Вход' ? 'Авторизация' : obj[0], action: a[0], st: a[1], object: a[0] === 'Вход' ? 'Вход в кабинет' : obj[1], ip: `10.0.${int(0, 9)}.${int(2, 250)}` };
  });
  const dkey = s => s.replace(/(d{2}).(d{2}).(d{4}) (d{2}):(d{2})/, '$3$2$1$4$5');
  changeLog.sort((a, b) => dkey(b.when).localeCompare(dkey(a.when)));
  const releases = [
    { version: '4.12.0', product: 'СНК-АЗС', date: '22.09.2026', state: 'Выпущено', st: 'ok', stations: 18, notes: 'Новый протокол обмена с ТРК, ускорена синхронизация смен' },
    { version: '4.11.3', product: 'СНК-АЗС', date: '28.07.2026', state: 'Выпущено', st: 'ok', stations: 19, notes: 'Исправления печати чеков' },
    { version: '4.10.8', product: 'СНК-АЗС', date: '14.04.2026', state: 'Устарело', st: 'off', stations: 11, notes: 'Поддержка ФФД 1.2' },
    { version: '3.8.1', product: 'СНК-Офис', date: '10.09.2026', state: 'Выпущено', st: 'ok', stations: 4, notes: 'Прайс-листы по группам ТО' },
    { version: '4.13.0', product: 'СНК-АЗС', date: '—', state: 'Черновик', st: 'warn', stations: 0, notes: 'Готовится к выпуску' }
  ];

  /* ---------- Прочие справочники ---------- */
  const operators = users.slice(0, 12).map((u, i) => ({ id: 1400 + i, name: u.name, station: pick(stations).name, tab: String(3000 + i * 7), shiftRole: i % 4 === 0 ? 'Старший оператор' : 'Оператор', active: i !== 9 }));
  const cashCollectors = ['ООО «Демо-Инкасс»', 'АО «Пример-Инкассация»', 'Служба инкассации «Тест»'].map((name, i) => ({ id: 1500 + i, name, inn: `70000001${pad(i + 20)}`, phone: `+7 (3822) 00-1${i}-${pad(30 + i)}`, routes: int(2, 7) }));
  const directions = ['Томск — центр', 'Томск — север', 'Северск', 'Асино — Первомайское', 'Колпашево'].map((name, i) => ({ id: 1600 + i, name, collector: cashCollectors[i % 3].name, points: int(2, 9), schedule: pick(['ежедневно', 'пн, ср, пт', 'вт, чт']) }));
  const statements = Array.from({ length: 10 }, (_, i) => ({ id: 1700 + i, number: `В-${String(220 - i).padStart(4, '0')}`, date: dt(daysAgo(i * 3)), kind: pick(['Ведомость по картам', 'Ведомость инкассации', 'Ведомость по сменам']), point: pick(stations).name, sum: int(20, 400) * 1000, state: i < 2 ? 'Черновик' : 'Закрыта', st: i < 2 ? 'off' : 'ok' }));
  const reports = [['Сменный отчёт', 'По смене ТО: продажи, остатки, инкассация'], ['Реализация топлива', 'Литры и суммы по видам топлива за период'], ['Реализация товаров', 'Продажи товаров и услуг по группам'], ['Остатки в резервуарах', 'Остатки и движение топлива по резервуарам'], ['Расход по ТРК', 'Отпуск топлива по колонкам и пистолетам'], ['Продажи по топливным картам', 'Операции по картам эмитентов'], ['Инкассация', 'Суммы и график инкассации по направлениям'], ['Движение ТМЦ', 'Поставки, перемещения, списания за период']]
    .map(([name, text], i) => ({ id: 1800 + i, name, text, format: pick(['XLSX, PDF', 'XLSX', 'PDF']), last: dt(daysAgo(int(0, 20))) }));
  const catalogueServices = services.map((s, i) => ({ ...s, code: `SRV-${pad(i + 1)}`, api: pick(['REST', 'REST', 'gRPC']) }));
  const fuelMap = [['1', 'АИ-92'], ['2', 'АИ-95'], ['3', 'ДТ'], ['4', 'АИ-100'], ['5', 'СУГ'], ['92', 'АИ-92'], ['95', 'АИ-95'], ['DT', 'ДТ']].map(([code, fuel], i) => ({ id: 1900 + i, code, fuel, source: i < 5 ? 'Код ТРК' : 'Код процессинга' }));

  /* ---------- Функции «по объекту» (детерминированно от id) ---------- */
  const seeded = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  // Операции (транзакции) ТО за смену
  const txFor = id => {
    const r = seeded(id * 31), st = stations.find(x => x.id === id);
    return Array.from({ length: 40 }, (_, i) => {
      const p = st.pumps[Math.floor(r() * st.pumps.length)];
      const fuel = p.fuels[Math.floor(r() * p.fuels.length)];
      const l = Math.round((5 + r() * 45) * 100) / 100;
      const d = new Date(TODAY); d.setMinutes(d.getMinutes() - i * 9 - Math.floor(r() * 8));
      const pay = ['Наличные', 'Банковская карта', 'Топливная карта', 'Мобильное приложение'][Math.floor(r() * 4)];
      return { n: 90412 - i, time: tm(d), pump: p.n, fuel, litres: l, price: PRICE[fuel], sum: Math.round(l * PRICE[fuel] * 100) / 100, pay, check: `${Math.floor(r() * 9000) + 1000}` };
    });
  };
  // События ТО
  const eventsFor = id => {
    const r = seeded(id * 17), st = stations.find(x => x.id === id);
    const E = [['Смена открыта', 'ok'], ['Синхронизация справочников', 'info'], ['Нет ответа от ТРК', 'err'], ['Связь восстановлена', 'ok'], ['Инкассация', 'info'], ['Перезапуск сервиса', 'warn'], ['Обновление цен', 'info']];
    return Array.from({ length: 14 }, (_, i) => { const e = E[Math.floor(r() * E.length)]; const d = new Date(TODAY); d.setMinutes(d.getMinutes() - i * 47 - Math.floor(r() * 30)); return { when: `${dt(d)} ${tm(d)}`, text: e[0], st: e[1], src: r() > .5 ? 'АЗС' : 'Сервис СНК', detail: e[0] === 'Нет ответа от ТРК' ? `ТРК ${1 + Math.floor(r() * st.pumps.length)}` : '' }; });
  };
  // Версии файлов на ТО
  const filesFor = id => {
    const st = stations.find(x => x.id === id);
    // [файл, версия на ТО, актуальная версия]
    return [['snk-azs.exe', st.version, '4.12.0'], ['snk-trk-driver.dll', `2.${st.version.split('.')[1]}.4`, '2.12.4'], ['snk-kkt.dll', '1.9.12', '1.9.12'], ['fastreport.dll', '2026.1.8', '2026.1.8'], ['snk-sync.exe', st.version, '4.12.0'], ['config.xml', '—', '—']]
      .map(([name, v, actual], i) => ({ name, version: v, actual, ok: v === actual, size: `${(0.3 + (i * 7 % 11) * 1.7).toFixed(1).replace('.', ',')} МБ`, date: dt(daysAgo(i * 11 + 3)) }));
  };
  // Смена ТО: резервуары, товары, реализация
  const shiftFor = id => {
    const r = seeded(id * 7), st = stations.find(x => x.id === id);
    const fuels = [...new Set(st.pumps.flatMap(p => p.fuels))].slice(0, 4);
    const tanks = fuels.map((f, i) => {
      const cap = [25000, 40000, 20000, 15000][i % 4];
      const start = Math.round(cap * (0.3 + r() * 0.5));
      const inc = r() > 0.6 ? Math.round(cap * 0.3) : 0;
      const sold = Math.round(1500 + r() * 5000);
      const end = Math.min(cap, start + inc - sold);
      return { n: i + 1, fuel: f, cap, start, inc, sold, end, level: Math.round(end / cap * 100), temp: +(8 + r() * 6).toFixed(1), density: +(0.72 + r() * 0.1).toFixed(3), water: +(r() * 4).toFixed(1) };
    });
    const real = fuels.map(f => { const l = Math.round(1500 + r() * 5000); return { fuel: f, litres: l, sum: Math.round(l * PRICE[f]), count: Math.round(l / 32) }; });
    const byPump = st.pumps.map(p => ({ n: p.n, fuel: p.fuels[0], litres: Math.round(400 + r() * 2400), count: Math.round(10 + r() * 90), counterStart: Math.round(100000 + r() * 800000) }));
    const gb = goods.slice(0, 10).map(g => { const s = Math.round(r() * 40); const sold = Math.round(r() * Math.min(12, s)); return { name: g.name, code: g.code, unit: g.unit, start: s, sold, end: s - sold, sum: sold * g.price }; });
    const resources = [['Чековая лента', 'рул.', 24], ['Топливные карты (бланки)', 'шт', 120], ['Пакеты', 'шт', 400]].map(([n, u, s]) => { const used = Math.round(r() * s / 4); return { name: n, unit: u, start: s, used, end: s - used }; });
    const nShift = st.shift.n;
    return { number: nShift, opened: `${dt(daysAgo(0, 8, 0))} 08:00`, closed: st.shift.open ? '' : `${dt(daysAgo(0, 20, 0))} 20:00`, operator: users[id % users.length].name, tanks, real, byPump, goods: gb, resources };
  };

  const DEMO = {
    ORGS, ORGS_ALL, ORG_TYPES, PLACES, STATE, PUMP, FUELS, PRICE, stations, users, goods, contractors, issuers, services, contracts, specs, hasps, licenses,
    requests, docs, changeLog, releases, operators, cashCollectors, directions, statements, reports, catalogueServices, fuelMap,
    txFor, eventsFor, filesFor, shiftFor, today: dt(TODAY), todayIso: iso(TODAY), now: '2026-09-30T14:05:00'
  };
  if (typeof module === 'object' && module.exports) module.exports = DEMO;
  else root.SNC_DEMO = DEMO;
})(this);
