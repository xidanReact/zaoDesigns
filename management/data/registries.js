/* =========================================================
   СНК · Управление продуктами — описания реестров (шаблон «Реестр»).
   Из каждого описания tools/generate.mjs собирает страницу раздела:
   шапка, таблица с поиском и фильтрами, форма создания/правки в модалке,
   удаление с подтверждением и отменой. Поведение — js/registry.js.
   Поля описания:
     rows(D)   — строки из data/demo.js (D), плоские объекты с id; _href — ссылка из названия
     columns   — колонки (типы — см. js/cells.js)
     filters   — фильтры в панели таблицы: key поля строки, title
     create    — { label, title, noun, fields } или null, если реестр только для чтения
     fields    — key, label, type (text | mono | num | email | select | textarea | switch), span, required, options, pattern, err, hint
     menu      — false: у строк нет меню действий
   Правка: этот файл → node management/tools/generate.mjs
   ========================================================= */
(function (root) {
  const orgName = (D, id) => (D.ORGS.find(o => o.id === id) || {}).name || '—';
  const ORG_OPTS = D => D.ORGS.map(o => o.name);
  const FILTER_ORG = { key: 'orgName', title: 'Все организации' };

  const REG = {
    /* ---------------- СНК-Офис: справочники ---------------- */
    'office/catalogue/service-points.html': {
      sub: 'Точки обслуживания, которые ведёт офис: адреса, терминалы, организации.',
      rows: D => D.stations.map(s => ({ id: s.id, name: s.name, code: s.code, city: s.city, address: s.address, orgName: orgName(D, s.org), terminal: s.terminal, pumps: s.pumps.length, state: D.STATE[s.state].short || D.STATE[s.state].label, st: D.STATE[s.state].st, _href: `../../azs/information.html?to=${s.id}` })),
      columns: [
        { key: 'name', title: 'Точка обслуживания', type: 'main', sub: 'code', sort: 'text' },
        { key: 'address', title: 'Адрес', type: 'text', sort: 'text' },
        { key: 'orgName', title: 'Организация', type: 'text', sort: 'text' },
        { key: 'terminal', title: 'Терминал', type: 'mono', sort: 'text' },
        { key: 'pumps', title: 'ТРК', type: 'num', sort: 'num' },
        { key: 'state', title: 'Состояние', type: 'status', sort: 'text' }
      ],
      filters: [FILTER_ORG, { key: 'state', title: 'Все состояния' }],
      create: { label: 'Добавить ТО', title: 'Новая точка обслуживания', noun: 'Точка обслуживания', fields: [
        { key: 'name', label: 'Название', type: 'text', span: 8, required: true },
        { key: 'code', label: 'Код', type: 'mono', span: 4, required: true, pattern: 'ТО-[0-9]{4}', err: 'Формат: ТО-0000', placeholder: 'ТО-0000' },
        { key: 'address', label: 'Адрес', type: 'text', span: 12, required: true },
        { key: 'orgName', label: 'Организация', type: 'select', span: 6, required: true, options: ORG_OPTS },
        { key: 'terminal', label: 'Терминал', type: 'mono', span: 6, placeholder: 'T-0000' }
      ] }
    },
    'office/catalogue/goods.html': {
      sub: 'Товары и услуги, которые продают на точках обслуживания.',
      import: true,
      rows: D => D.goods.map(g => ({ ...g })),
      columns: [
        { key: 'name', title: 'Наименование', type: 'main', sub: 'code', sort: 'text' },
        { key: 'group', title: 'Группа', type: 'text', sort: 'text' },
        { key: 'unit', title: 'Ед.', type: 'text', sort: 'text' },
        { key: 'price', title: 'Цена, ₽', type: 'money', sort: 'num' },
        { key: 'vat', title: 'НДС', type: 'text', sort: 'text' },
        { key: 'barcode', title: 'Штрихкод', type: 'mono', sort: 'text' },
        { key: 'active', title: 'Продажа', type: 'bool', yes: 'Продаётся', no: 'Снят с продажи', sort: 'num' }
      ],
      filters: [{ key: 'group', title: 'Все группы' }],
      create: { label: 'Добавить товар', title: 'Новый товар', noun: 'Товар', fields: [
        { key: 'name', label: 'Наименование', type: 'text', span: 8, required: true },
        { key: 'code', label: 'Код', type: 'mono', span: 4, required: true, pattern: '[0-9]{1,8}', err: 'Только цифры, до 8 знаков' },
        { key: 'group', label: 'Группа', type: 'select', span: 6, required: true, options: D => [...new Set(D.goods.map(g => g.group))] },
        { key: 'unit', label: 'Единица', type: 'select', span: 3, options: () => ['шт', 'л', 'кг', 'пара'] },
        { key: 'vat', label: 'НДС', type: 'select', span: 3, options: () => ['20%', '10%', 'Без НДС'] },
        { key: 'price', label: 'Цена, ₽', type: 'num', span: 6, required: true, placeholder: '0,00' },
        { key: 'barcode', label: 'Штрихкод', type: 'mono', span: 6, pattern: '[0-9]{8,13}', err: 'EAN: 8 или 13 цифр' },
        { key: 'active', label: 'Продаётся на точках', type: 'switch', span: 12 }
      ] }
    },
    'office/catalogue/legal-entities.html': {
      sub: 'Юридические лица, от имени которых работают точки обслуживания.',
      rows: D => D.ORGS.map((o, i) => ({ id: o.id, name: o.name, inn: `70170000${String(i + 1).padStart(2, '0')}`, kpp: `7017010${String(i + 1).padStart(2, '0')}`, stations: D.stations.filter(s => s.org === o.id).length, address: `634009, г. Томск, ул. Демонстрационная, ${10 + i}` })),
      columns: [
        { key: 'name', title: 'Название', type: 'main', sort: 'text' },
        { key: 'inn', title: 'ИНН', type: 'mono', sort: 'text' },
        { key: 'kpp', title: 'КПП', type: 'mono', sort: 'text' },
        { key: 'address', title: 'Юридический адрес', type: 'text', sort: 'text' },
        { key: 'stations', title: 'Точек', type: 'num', sort: 'num' }
      ],
      filters: [],
      create: { label: 'Добавить юрлицо', title: 'Новое юридическое лицо', noun: 'Юрлицо', fields: [
        { key: 'name', label: 'Название', type: 'text', span: 12, required: true },
        { key: 'inn', label: 'ИНН', type: 'mono', span: 6, required: true, pattern: '[0-9]{10}|[0-9]{12}', err: 'ИНН — 10 или 12 цифр' },
        { key: 'kpp', label: 'КПП', type: 'mono', span: 6, pattern: '[0-9]{9}', err: 'КПП — 9 цифр' },
        { key: 'address', label: 'Юридический адрес', type: 'text', span: 12 }
      ] }
    },
    'office/catalogue/statements.html': {
      sub: 'Ведомости по картам, сменам и инкассации.',
      rows: D => D.statements.map(s => ({ ...s })),
      columns: [
        { key: 'number', title: 'Номер', type: 'main', sort: 'text' },
        { key: 'date', title: 'Дата', type: 'date', sort: 'num' },
        { key: 'kind', title: 'Вид', type: 'text', sort: 'text' },
        { key: 'point', title: 'Точка', type: 'text', sort: 'text' },
        { key: 'sum', title: 'Сумма, ₽', type: 'money', sort: 'num' },
        { key: 'state', title: 'Состояние', type: 'status', sort: 'text' }
      ],
      filters: [{ key: 'kind', title: 'Все виды' }, { key: 'state', title: 'Все состояния' }],
      create: { label: 'Создать ведомость', title: 'Новая ведомость', noun: 'Ведомость', fields: [
        { key: 'kind', label: 'Вид', type: 'select', span: 6, required: true, options: () => ['Ведомость по картам', 'Ведомость инкассации', 'Ведомость по сменам'] },
        { key: 'point', label: 'Точка', type: 'select', span: 6, required: true, options: D => D.stations.slice(0, 20).map(s => s.name) },
        { key: 'date', label: 'Дата', type: 'mono', span: 6, required: true, pattern: '[0-9]{2}\\.[0-9]{2}\\.[0-9]{4}', err: 'Формат: дд.мм.гггг', placeholder: '30.09.2026' }
      ] }
    },
    'office/catalogue/cash-collectors.html': {
      sub: 'Службы инкассации, с которыми работают точки.',
      rows: D => D.cashCollectors.map(c => ({ ...c })),
      columns: [
        { key: 'name', title: 'Название', type: 'main', sort: 'text' },
        { key: 'inn', title: 'ИНН', type: 'mono', sort: 'text' },
        { key: 'phone', title: 'Телефон', type: 'mono', sort: 'text' },
        { key: 'routes', title: 'Направлений', type: 'num', sort: 'num' }
      ],
      filters: [],
      create: { label: 'Добавить инкассатора', title: 'Новая служба инкассации', noun: 'Инкассатор', fields: [
        { key: 'name', label: 'Название', type: 'text', span: 12, required: true },
        { key: 'inn', label: 'ИНН', type: 'mono', span: 6, required: true, pattern: '[0-9]{10}|[0-9]{12}', err: 'ИНН — 10 или 12 цифр' },
        { key: 'phone', label: 'Телефон', type: 'mono', span: 6, placeholder: '+7 (3822) 00-00-00' }
      ] }
    },
    'office/catalogue/cash-collection-directions.html': {
      sub: 'Маршруты инкассации: какие точки и по какому графику.',
      rows: D => D.directions.map(d => ({ ...d })),
      columns: [
        { key: 'name', title: 'Направление', type: 'main', sort: 'text' },
        { key: 'collector', title: 'Инкассатор', type: 'text', sort: 'text' },
        { key: 'points', title: 'Точек', type: 'num', sort: 'num' },
        { key: 'schedule', title: 'График', type: 'text', sort: 'text' }
      ],
      filters: [{ key: 'collector', title: 'Все инкассаторы' }],
      create: { label: 'Добавить направление', title: 'Новое направление', noun: 'Направление', fields: [
        { key: 'name', label: 'Название', type: 'text', span: 12, required: true },
        { key: 'collector', label: 'Инкассатор', type: 'select', span: 6, required: true, options: D => D.cashCollectors.map(c => c.name) },
        { key: 'schedule', label: 'График', type: 'select', span: 6, options: () => ['ежедневно', 'пн, ср, пт', 'вт, чт'] }
      ] }
    },
    'office/catalogue/operators.html': {
      sub: 'Операторы точек обслуживания и их табельные номера.',
      rows: D => D.operators.map(o => ({ ...o })),
      columns: [
        { key: 'name', title: 'Оператор', type: 'main', sub: 'tab', sort: 'text' },
        { key: 'station', title: 'Точка', type: 'text', sort: 'text' },
        { key: 'shiftRole', title: 'Должность', type: 'text', sort: 'text' },
        { key: 'active', title: 'Доступ', type: 'bool', yes: 'Работает', no: 'Отключён', sort: 'num' }
      ],
      filters: [{ key: 'shiftRole', title: 'Все должности' }],
      create: { label: 'Добавить оператора', title: 'Новый оператор', noun: 'Оператор', fields: [
        { key: 'name', label: 'ФИО', type: 'text', span: 8, required: true },
        { key: 'tab', label: 'Табельный номер', type: 'mono', span: 4, required: true, pattern: '[0-9]{3,6}', err: 'От 3 до 6 цифр' },
        { key: 'station', label: 'Точка', type: 'select', span: 6, options: D => D.stations.slice(0, 20).map(s => s.name) },
        { key: 'shiftRole', label: 'Должность', type: 'select', span: 6, options: () => ['Оператор', 'Старший оператор'] },
        { key: 'active', label: 'Может открывать смену', type: 'switch', span: 12 }
      ] }
    },
    'office/catalogue/contractors.html': contractorReg('Поставщик', 'Поставщики топлива и товаров.', 'поставщика'),
    'office/catalogue/cargo-carriers.html': contractorReg('Грузоперевозчик', 'Перевозчики, которые доставляют топливо и товары.', 'перевозчика'),
    'office/catalogue/shippers.html': contractorReg('Грузоотправитель', 'Грузоотправители и грузополучатели для товарно-транспортных накладных.', 'грузоотправителя'),

    /* ---------------- СНК-Офис: склад ---------------- */
    'office/warehouse/orders.html': docReg('orders', 'Поставки товаров и материалов от поставщиков.', 'Новая поставка', [{ key: 'contractor', title: 'Поставщик', type: 'text', sort: 'text' }]),
    'office/warehouse/movements.html': docReg('movements', 'Перемещения товаров между точками.', 'Новое перемещение', [{ key: 'pointTo', title: 'Куда', type: 'text', sort: 'text' }]),
    'office/warehouse/write-offs.html': docReg('write-offs', 'Списания: порча, истёкший срок, недостача.', 'Новое списание', [{ key: 'reason', title: 'Причина', type: 'text', sort: 'text' }]),
    'office/warehouse/postings.html': docReg('postings', 'Оприходование излишков и товаров без документов поставщика.', 'Новое оприходование', []),
    'office/warehouse/price-lists.html': docReg('price-lists', 'Цены на товары по группам точек.', 'Новый прайс-лист', []),

    'office/reports.html': {
      sub: 'Отчёты формируются за выбранный период и скачиваются файлом.',
      select: false,
      rows: D => D.reports.map(r => ({ ...r })),
      columns: [
        { key: 'name', title: 'Отчёт', type: 'main', sub: 'text', subMono: false, sort: 'text' },
        { key: 'format', title: 'Формат', type: 'mono', sort: 'text' },
        { key: 'last', title: 'Последний раз', type: 'date', sort: 'num' },
        { key: 'go', title: '', type: 'button', action: 'build', label: 'Сформировать' }
      ],
      filters: [],
      menu: false,
      create: null
    },

    /* ---------------- СНК-АЗС ---------------- */
    'azs/services-activity.html': {
      sub: 'Какие точки принимают заявки мобильных сервисов и сколько заявок пришло сегодня.',
      rows: D => D.stations.map(s => {
        const reqs = D.requests.filter(r => r.station === s.id);
        const on = s.state !== 0 && s.state !== 6;
        return { id: s.id, name: s.name, code: s.code, city: s.city, orgName: orgName(D, s.org), today: reqs.length, last: reqs[0] ? reqs[0].time : '—', problems: reqs.filter(r => r.kind === 'problem').length, accepts: on, _href: `information.html?to=${s.id}` };
      }),
      columns: [
        { key: 'name', title: 'Точка обслуживания', type: 'main', sub: 'code', sort: 'text' },
        { key: 'city', title: 'Населённый пункт', type: 'text', sort: 'text' },
        { key: 'orgName', title: 'Организация', type: 'text', sort: 'text' },
        { key: 'accepts', title: 'Заявки', type: 'bool', yes: 'Принимает', no: 'Не принимает', sort: 'num' },
        { key: 'today', title: 'Заявок сегодня', type: 'num', sort: 'num' },
        { key: 'problems', title: 'Проблемных', type: 'num', sort: 'num' },
        { key: 'last', title: 'Последняя', type: 'mono', sort: 'text' }
      ],
      filters: [FILTER_ORG],
      create: null
    },

    /* ---------------- Администрирование ---------------- */
    'admin/organizations.html': {
      sub: 'Клиенты СНК: договоры, лицензии, ключи, пользователи и точки.',
      // все организации кабинета: клиенты, партнёры, сервисы; у сервиса карточки нет — ведём в справочник сервисов
      rows: D => D.ORGS_ALL.map((o, i) => ({ id: o.id, name: o.name, type: D.ORG_TYPES[o.type], inn: `70170000${String(i + 1).padStart(2, '0')}`, stations: D.stations.filter(s => s.org === o.id).length, users: D.users.filter(u => u.org === o.id).length, contracts: D.contracts.filter(c => c.org === o.id).length, licenses: D.licenses.filter(l => l.org === o.id).reduce((a, l) => a + l.total, 0), state: 'Обслуживается', st: 'ok', _href: o.type === 3 ? 'catalogues.html' : `organization.html?org=${o.id}` })),
      columns: [
        { key: 'name', title: 'Организация', type: 'main', sub: 'inn', sort: 'text' },
        { key: 'type', title: 'Тип', type: 'text', sort: 'text' },
        { key: 'stations', title: 'Точек', type: 'num', sort: 'num' },
        { key: 'users', title: 'Пользователей', type: 'num', sort: 'num' },
        { key: 'contracts', title: 'Договоров', type: 'num', sort: 'num' },
        { key: 'licenses', title: 'Лицензий', type: 'num', sort: 'num' },
        { key: 'state', title: 'Состояние', type: 'status', sort: 'text' }
      ],
      filters: [{ key: 'type', title: 'Все типы' }],
      create: { label: 'Добавить организацию', title: 'Новая организация', noun: 'Организация', fields: [
        { key: 'name', label: 'Название', type: 'text', span: 8, required: true },
        { key: 'type', label: 'Тип', type: 'select', span: 4, required: true, options: D => Object.values(D.ORG_TYPES) },
        { key: 'inn', label: 'ИНН', type: 'mono', span: 6, required: true, pattern: '[0-9]{10}|[0-9]{12}', err: 'ИНН — 10 или 12 цифр' },
        { key: 'email', label: 'E-mail для уведомлений', type: 'email', span: 6 }
      ] }
    },
    'admin/users.html': {
      sub: 'Учётные записи кабинета. Привилегии и доступные ТО — в карточке пользователя.',
      rows: D => D.users.map(u => ({ ...u, orgName: orgName(D, u.org), _href: `permissions.html?user=${u.id}` })),
      columns: [
        { key: 'name', title: 'Пользователь', type: 'main', sub: 'login', sort: 'text' },
        { key: 'email', title: 'E-mail', type: 'mono', sort: 'text' },
        { key: 'orgName', title: 'Организация', type: 'text', sort: 'text' },
        { key: 'role', title: 'Роль', type: 'text', sort: 'text' },
        { key: 'poses', title: 'ТО', type: 'num', sort: 'num' },
        { key: 'last', title: 'Последний вход', type: 'date', sort: 'num' },
        { key: 'state', title: 'Состояние', type: 'status', sort: 'text' }
      ],
      filters: [FILTER_ORG, { key: 'role', title: 'Все роли' }, { key: 'state', title: 'Все состояния' }],
      create: { label: 'Добавить пользователя', title: 'Новый пользователь', noun: 'Пользователь', fields: [
        { key: 'name', label: 'ФИО', type: 'text', span: 12, required: true },
        { key: 'login', label: 'Логин', type: 'mono', span: 6, required: true, pattern: '[a-z0-9._-]{3,32}', err: 'Латиница, цифры, точка, дефис; от 3 символов' },
        { key: 'email', label: 'E-mail', type: 'email', span: 6, required: true },
        { key: 'orgName', label: 'Организация', type: 'select', span: 6, required: true, options: ORG_OPTS },
        { key: 'role', label: 'Роль', type: 'select', span: 6, options: () => ['Пользователь', 'Администратор'] }
      ] }
    },
    'admin/issuers.html': {
      sub: 'Эмитенты топливных и дисконтных карт, которые принимают точки.',
      rows: D => D.issuers.map(x => ({ ...x, orgName: orgName(D, x.org) })),
      columns: [
        { key: 'name', title: 'Эмитент', type: 'main', sub: 'code', sort: 'text' },
        { key: 'cards', title: 'Карты', type: 'text', sort: 'text' },
        { key: 'orgName', title: 'Организация', type: 'text', sort: 'text' },
        { key: 'active', title: 'Приём карт', type: 'bool', yes: 'Принимаются', no: 'Отключён', sort: 'num' }
      ],
      filters: [{ key: 'cards', title: 'Все виды карт' }],
      create: { label: 'Добавить эмитента', title: 'Новый эмитент', noun: 'Эмитент', fields: [
        { key: 'name', label: 'Название', type: 'text', span: 8, required: true },
        { key: 'code', label: 'Код', type: 'mono', span: 4, required: true, pattern: 'EM-[0-9]{2}', err: 'Формат: EM-00' },
        { key: 'cards', label: 'Вид карт', type: 'select', span: 6, options: () => ['Топливная', 'Дисконтная'] },
        { key: 'orgName', label: 'Организация', type: 'select', span: 6, options: ORG_OPTS },
        { key: 'active', label: 'Принимать карты эмитента', type: 'switch', span: 12 }
      ] }
    },
    'admin/services.html': {
      sub: 'Точки обслуживания сторонних систем, подключённые к сервисам СНК.',
      rows: D => D.services.flatMap((s, i) => [1, 2].map(k => ({ id: `${s.id}-${k}`, name: `${s.name} · точка ${k}`, service: s.name, system: ['Сторонняя АСУ «Демо»', 'Сторонняя АСУ «Пример»'][k - 1], connected: `${String(10 + i * 3).padStart(2, '0')}.0${k + 2}.2026`, active: s.active }))),
      columns: [
        { key: 'name', title: 'Внешняя ТО', type: 'main', sort: 'text' },
        { key: 'service', title: 'Сервис', type: 'text', sort: 'text' },
        { key: 'system', title: 'Система управления', type: 'text', sort: 'text' },
        { key: 'connected', title: 'Подключена', type: 'date', sort: 'num' },
        { key: 'active', title: 'Обмен', type: 'bool', yes: 'Работает', no: 'Отключён', sort: 'num' }
      ],
      filters: [{ key: 'service', title: 'Все сервисы' }],
      create: { label: 'Подключить ТО', title: 'Подключение внешней ТО', noun: 'Внешняя ТО', fields: [
        { key: 'name', label: 'Название', type: 'text', span: 12, required: true },
        { key: 'service', label: 'Сервис', type: 'select', span: 6, required: true, options: D => D.services.map(s => s.name) },
        { key: 'system', label: 'Система управления', type: 'text', span: 6 },
        { key: 'active', label: 'Обмен включён', type: 'switch', span: 12 }
      ] }
    },
    'admin/licenses.html': {
      sub: 'Лицензии клиентов по продуктам: сколько куплено, занято и до какого числа.',
      rows: D => D.licenses.map(l => ({ ...l, orgName: orgName(D, l.org), free: l.total - l.used, state: l.until.slice(3) === '10.2026' ? 'Истекает' : 'Действует', st: l.until.slice(3) === '10.2026' ? 'warn' : 'ok' })),
      columns: [
        { key: 'product', title: 'Продукт', type: 'main', sort: 'text' },
        { key: 'orgName', title: 'Организация', type: 'text', sort: 'text' },
        { key: 'total', title: 'Всего', type: 'num', sort: 'num' },
        { key: 'used', title: 'Занято', type: 'num', sort: 'num' },
        { key: 'free', title: 'Свободно', type: 'num', sort: 'num' },
        { key: 'until', title: 'Действует до', type: 'date', sort: 'num' },
        { key: 'state', title: 'Состояние', type: 'status', sort: 'text' }
      ],
      filters: [FILTER_ORG, { key: 'product', title: 'Все продукты' }, { key: 'state', title: 'Все состояния' }],
      create: { label: 'Выдать лицензии', title: 'Выдача лицензий', noun: 'Лицензии', fields: [
        { key: 'product', label: 'Продукт', type: 'select', span: 6, required: true, options: () => ['СНК-АЗС', 'СНК-Офис', 'Мобильные сервисы'] },
        { key: 'orgName', label: 'Организация', type: 'select', span: 6, required: true, options: ORG_OPTS },
        { key: 'total', label: 'Количество', type: 'num', span: 6, required: true },
        { key: 'until', label: 'Действует до', type: 'mono', span: 6, required: true, pattern: '[0-9]{2}\\.[0-9]{2}\\.[0-9]{4}', err: 'Формат: дд.мм.гггг', placeholder: '31.12.2026' }
      ] }
    },
    'admin/catalogues.html': {
      sub: 'Сервисы-партнёры, которые передают заявки на точки.',
      rows: D => D.catalogueServices.map(s => ({ ...s })),
      columns: [
        { key: 'name', title: 'Сервис', type: 'main', sub: 'code', sort: 'text' },
        { key: 'kind', title: 'Тип', type: 'text', sort: 'text' },
        { key: 'api', title: 'Интеграция', type: 'mono', sort: 'text' },
        { key: 'stations', title: 'Точек', type: 'num', sort: 'num' },
        { key: 'active', title: 'Состояние', type: 'bool', yes: 'Работает', no: 'Отключён', sort: 'num' }
      ],
      filters: [{ key: 'kind', title: 'Все типы' }],
      create: { label: 'Добавить сервис', title: 'Новый сервис', noun: 'Сервис', fields: [
        { key: 'name', label: 'Название', type: 'text', span: 8, required: true },
        { key: 'code', label: 'Код', type: 'mono', span: 4, required: true, pattern: 'SRV-[0-9]{2}', err: 'Формат: SRV-00' },
        { key: 'kind', label: 'Тип', type: 'select', span: 6, options: () => ['Мобильное приложение', 'Агрегатор', 'Навигатор', 'Корпоративный сервис'] },
        { key: 'api', label: 'Интеграция', type: 'select', span: 6, options: () => ['REST', 'gRPC'] },
        { key: 'active', label: 'Сервис работает', type: 'switch', span: 12 }
      ] }
    },
    'admin/change-log.html': {
      sub: 'Кто, когда и что изменил в кабинете. Записи нельзя изменить или удалить.',
      select: false,
      menu: false,
      rows: D => D.changeLog.map(x => ({ ...x })),
      columns: [
        { key: 'when', title: 'Когда', type: 'date', sort: 'num' },
        { key: 'user', title: 'Пользователь', type: 'text', sub: 'ip', sort: 'text' },
        { key: 'section', title: 'Раздел', type: 'text', sort: 'text' },
        { key: 'action', title: 'Действие', type: 'status', sort: 'text' },
        { key: 'object', title: 'Объект', type: 'text', sort: 'text' }
      ],
      filters: [{ key: 'section', title: 'Все разделы' }, { key: 'action', title: 'Все действия' }],
      create: null
    }
  };

  function contractorReg(kind, sub, what) {
    return {
      sub,
      rows: D => D.contractors.filter(c => c.kind === kind).concat(D.contractors.filter(c => c.kind !== kind).slice(0, 2)).map(c => ({ ...c })),
      columns: [
        { key: 'name', title: 'Название', type: 'main', sort: 'text' },
        { key: 'inn', title: 'ИНН', type: 'mono', sort: 'text' },
        { key: 'phone', title: 'Телефон', type: 'mono', sort: 'text' },
        { key: 'contract', title: 'Договор', type: 'mono', sort: 'text' }
      ],
      filters: [],
      create: { label: `Добавить ${what}`, title: `Новый ${kind.toLowerCase()}`, noun: kind, fields: [
        { key: 'name', label: 'Название', type: 'text', span: 12, required: true },
        { key: 'inn', label: 'ИНН', type: 'mono', span: 6, required: true, pattern: '[0-9]{10}|[0-9]{12}', err: 'ИНН — 10 или 12 цифр' },
        { key: 'contract', label: 'Договор', type: 'mono', span: 6 },
        { key: 'phone', label: 'Телефон', type: 'mono', span: 6, placeholder: '+7 (3822) 00-00-00' }
      ] }
    };
  }
  function docReg(kind, sub, createTitle, extraCols) {
    return {
      sub,
      rows: D => D.docs.filter(d => d.kind === kind).map(d => ({ id: d.id, number: d.number, date: d.date, point: d.point, pointTo: d.pointTo, contractor: d.contractor, reason: d.reason, author: d.author, lines: d.lines.length, total: d.total, state: d.state, st: d.st, _href: `document.html?doc=${d.id}` })),
      columns: [
        { key: 'number', title: 'Документ', type: 'main', sub: 'date', sort: 'text' },
        { key: 'point', title: kind === 'movements' ? 'Откуда' : 'Точка', type: 'text', sort: 'text' },
        ...extraCols,
        { key: 'lines', title: 'Позиций', type: 'num', sort: 'num' },
        { key: 'total', title: 'Сумма, ₽', type: 'money', sort: 'num' },
        { key: 'author', title: 'Автор', type: 'text', sort: 'text' },
        { key: 'state', title: 'Состояние', type: 'status', sort: 'text' }
      ],
      filters: [{ key: 'state', title: 'Все состояния' }],
      create: { label: 'Создать документ', title: createTitle, noun: 'Документ', open: 'document.html?doc=new&kind=' + kind, fields: [] }
    };
  }

  const API = { REG };
  if (typeof module === 'object' && module.exports) module.exports = API;
  else root.SNC_REG = API;
})(this);
