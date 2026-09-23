/* =========================================================
   Партнёры: производители оборудования, поставщики технологий, сервисные компании, сети АЗС.
   Источник: www.sncard.ru/partnery (разбор 22.09.2026)
   Как обновлять: правка этого файла → node sncard/tools/generate.mjs
   ========================================================= */
(function (root) {
  const DATA =
[
  {
    "anchor": "equipment",
    "title": "Производители и поставщики оборудования для АЗС и нефтебаз",
    "items": [
      {
        "name": "ПК Электроникс",
        "desc": "Производитель и поставщик оборудования и программного обеспечения для АЗС и нефтебаз, г. Новосибирск.",
        "url": "http://www.pk-electronics.ru",
        "logo": "img/partners/pc-electronics.jpg"
      },
      {
        "name": "ООО \"Контур-М\"",
        "desc": "Производитель и поставщик измерительного оборудования для АЗС и нефтебаз, г. Казань.",
        "url": "http://merniki.ru",
        "logo": "img/partners/logo_kontur.gif"
      },
      {
        "name": "ООО \"Сибтехносервис\"",
        "desc": "Поставщик оборудования для АЗС и нефтебаз, г. Новосибирск.",
        "url": "http://www.a3c.ru/",
        "logo": "img/partners/sts_1.png"
      },
      {
        "name": "ООО \"МУФТА ПРО\"",
        "desc": "Инжиниринговая компания, производитель мобильных топливных блоков (МТБ), полная интеграция с \"СНК-АЗС\".",
        "url": "http://muftapro.ru/index.html",
        "logo": "img/partners/logo_muftapro.jpg"
      },
      {
        "name": "Компания \"ИНИТ-плюс\"",
        "desc": "Производитель терминалов самообслуживания (ТСО), автоматических мини АЗС.",
        "url": "http://www.init-plus.com",
        "logo": "img/partners/logo_init.png"
      },
      {
        "name": "ООО \"Саллес\", г. Екатеринбург",
        "desc": "Производитель терминалов самообслуживания (ТСО), автоматических мини АЗС.",
        "url": "http://promo.miniazs.com/",
        "logo": "img/partners/logo_ckon.png"
      },
      {
        "name": "АО \"ППМТС \"Пермьснабсбыт\", г. Пермь",
        "desc": "Производитель электрических зарядных станций для электротраспорта",
        "url": "http://pss.ru/product/zaryadnye-stantsii-dlya-elektrotransporta/",
        "logo": "img/partners/logo_pss.png"
      },
      {
        "name": "Компания ChargeLink, г.Томск",
        "desc": "Производитель электрических зарядных станций для электротраспорта",
        "url": "https://chargelink.ru/",
        "logo": "img/partners/logo_chlink.png"
      }
    ]
  },
  {
    "anchor": "technology",
    "title": "Поставщики технологий",
    "items": [
      {
        "name": "ООО \"Инженико\"",
        "desc": "Разработчик и поставщик POS-терминалов Ingenico и платёжных решений на их основе. Разработчик технологии Arcus 2 CAP.",
        "url": "http://www.ingenico.ru/about.html",
        "logo": "img/partners/logoingenico.jpg"
      },
      {
        "name": "Группа предприятий \"СКОН\"",
        "desc": "Разработчик первого в России онлайн-сервиса оплаты топлива на АЗС с помощью мобильного приложения.",
        "url": "http://www.benzuber.ru/",
        "logo": "img/partners/pastedgraphic-1.jpg"
      },
      {
        "name": "Яндекс.Заправки",
        "desc": "Разработчик и оператор онлайн-сервиса оплаты топлива на АЗС с помощью мобильного приложения.",
        "url": "https://zapravki.yandex.ru/",
        "logo": "img/partners/yandex_zapravra.svg"
      },
      {
        "name": "FUELUP",
        "desc": "Разработчик и оператор онлайн-сервиса оплаты топлива на АЗС с помощью мобильного приложения.",
        "url": "https://fuelup.ru/",
        "logo": "img/partners/fuelup_logo.svg"
      },
      {
        "name": "КРП",
        "desc": "Разработчик и оператор онлайн-сервиса оплаты топлива на АЗС с помощью мобильного приложения.",
        "url": "https://krp-online.ru/",
        "logo": "img/partners/logo_krp.png"
      },
      {
        "name": "Senim",
        "desc": "Разработчик и оператор онлайн-сервиса оплаты топлива на АЗС с помощью мобильного приложения.",
        "url": "https://senim.kz/",
        "logo": "img/partners/logo_senim.png"
      },
      {
        "name": "Монополия.Онлайн. Мультисервис заправки транспорта",
        "desc": "Мобильное приложение Мультисервиса. С ним водители могут заправляться и пользоваться придорожными услугами, а также видеть установленные лимиты.",
        "url": "https://monopoly.online/",
        "logo": "img/partners/monopoliy.png"
      },
      {
        "name": "СберБанк. Партнерская программа для бизнеса",
        "desc": "Партнерская программа оплаты топлива на АЗС через терминал СберБанка.",
        "url": "https://sb-oem.ru/",
        "logo": "img/partners/logo_sb_orange.png"
      },
      {
        "name": "Топливный процессинг.",
        "desc": "Интеграция и автоматизация, а так же разработка и внедрение процессинговых центров в сфере топливного рынка.",
        "url": "https://svoy.club/",
        "logo": "img/partners/svoyclub.png"
      }
    ]
  },
  {
    "anchor": "company",
    "title": "Сервисные компании",
    "items": [
      {
        "name": "ООО \"Центрнефтекарт\"",
        "desc": "Сервисная компания по сопровождению программно-аппаратных продуктов СНК в Новосибирской области, г. Новосибирск.",
        "url": "http://cnk.nsk.ru/",
        "logo": "img/partners/logo_cnk.gif"
      },
      {
        "name": "ОсОО Мастер",
        "desc": "Дилер ООО \"СНК\". Центр Технического Обслуживания и реализации ККТ, Республика Кыргыстан, г. Ош, тел.(03222 5 66 85), +996 773 02 47 65",
        "url": "http://kkm-online.mya5.ru/",
        "logo": "img/partners/logo_master.jpeg"
      }
    ]
  },
  {
    "anchor": "networks",
    "title": "Сети АЗС",
    "items": [
      {
        "name": "ООО \"Севернефтепродукт\"",
        "desc": "Сеть АЗС и магазинов для охотников и рыбаков в Томской области.",
        "url": null,
        "logo": "img/partners/logo_sever.jpg"
      },
      {
        "name": "ООО \"Сибгаз\"",
        "desc": "Сеть АЗС/АГЗС \"Гранд\" г.Новосибирск и НО",
        "url": "https://sibgaz-nsk.ru/set-azs/",
        "logo": "img/partners/logo_sibgas.png"
      },
      {
        "name": "ООО \"Сибгазсеть\"",
        "desc": "Сеть АЗС/АГЗС \"ГазПро\" в Томской, Кемеровской, Новосибирской, Омской областях, Алтайском и Красноярском крае",
        "url": "http://sibgazset.ru",
        "logo": "img/partners/sibgazset.png"
      },
      {
        "name": "АО \"Красноярскнефтепродукт\"",
        "desc": "Предприятие нефтепродуктообеспечения краевого подчинения, сеть АЗС\\АЗК по Красноярскому краю, г. Красноярск.",
        "url": "http://knp.krsn.ru/",
        "logo": "img/partners/logo_knp.jpg"
      },
      {
        "name": "ООО \"Глостер\"",
        "desc": "Сеть АЗС по Красноярскому краю под маркой 25 часов.",
        "url": "http://green-bonus.ru/",
        "logo": "img/partners/logo_25.jpg"
      },
      {
        "name": "ООО \"ГазОйл\"",
        "desc": "Сеть АГЗС/АЗС в Новосибирской, Кемеровской, Томской областях, Бурятии, Красноярскому и Алтайскому краях, г. Новосибирск",
        "url": "https://gk-gazoil.ru",
        "logo": "img/partners/logo_gazoil.png"
      },
      {
        "name": "ООО \"Перекресток Ойл\"",
        "desc": "Сеть АЗС \"Перекресток\" в Кемеровской области, г. Кемерово.",
        "url": "http://perekrestok-oil.livejournal.com/",
        "logo": "img/partners/logo_perek.jpg"
      },
      {
        "name": "Томский международный аэропорт имени Камова",
        "desc": "Ведомственная АЗС самообслуживания, г. Томск.",
        "url": "https://tomskairport.ru",
        "logo": "img/partners/tomskaero.png"
      },
      {
        "name": "Кемеровский международный аэропорт имени Леонова",
        "desc": "Ведомственная АЗС самообслуживания, г. Кемерово.",
        "url": "https://airkem.ru",
        "logo": "img/partners/kemerovoaero.png"
      },
      {
        "name": "ООО \"Тавриданефтепродукт\"",
        "desc": "Сеть АЗС в Республике Крым",
        "url": null,
        "logo": null
      },
      {
        "name": "ООО \"Сеть АЗС НИКА\"",
        "desc": "Сеть АЗС \"НИКА\" в Алтайском крае, Р. Алтай.",
        "url": "http://firma-nika.ru/",
        "logo": "img/partners/logo_nika.jpg"
      },
      {
        "name": "ИП Васнев А.Н.",
        "desc": "Сеть АЗС в Алтайском крае, г. Бийск.",
        "url": null,
        "logo": "img/partners/logo_vasnev.png"
      },
      {
        "name": "ООО \"Ф-Консалтинг\"",
        "desc": "Сеть АЗС \"ТопЛайн\" в Омской области, г. Омск.",
        "url": "http://www.azs-topline.ru/",
        "logo": "img/partners/logo_topline.jpg"
      },
      {
        "name": "ООО \"Тринити\"",
        "desc": "Сеть АЗС \"VIP\" в Кемеровской области, г. Новокузнецк.",
        "url": "http://www.trinity-nk.ru/",
        "logo": "img/partners/logo_trinity.gif"
      },
      {
        "name": "ООО \"Мега Ойл\"",
        "desc": "Сеть АЗС \"VIP\" в Кемеровской области, г. Новокузнецк.",
        "url": "http://www.barrel-azs.ru/",
        "logo": "img/partners/logo_barrel.png"
      },
      {
        "name": "ЗАО \"АСС-СТРАТЕГ\"",
        "desc": "Сеть АЗС под маркой ЕУ в г. Москва и Московской обл.",
        "url": null,
        "logo": "img/partners/logo_acc.jpg"
      },
      {
        "name": "ООО \"Техносервис\"",
        "desc": "Сеть АЗС Техносервис р. Казахстан.",
        "url": null,
        "logo": "img/partners/techservice_logo.jpg"
      },
      {
        "name": "ООО \"Элит-Авто\"",
        "desc": "Сеть АЗС г. Иркутск и Иркутская область.",
        "url": null,
        "logo": "img/partners/logo_rusneft.jpg"
      },
      {
        "name": "ООО \"АЗС-Н1\"",
        "desc": "Сеть АЗС г. Тюмень.",
        "url": "http://www.azs-n1.ru/",
        "logo": "img/partners/logo_n1.jpg"
      },
      {
        "name": "ТОО \"АУРИКА\"",
        "desc": "Сеть АЗС р. Казахстан.",
        "url": "http://aurika.kz/ru/",
        "logo": "img/partners/logo_aurika.jpg"
      },
      {
        "name": "ООО \"Нефтяная Топливная Компания\"",
        "desc": "Сеть АЗС г. Котлас, Архангельской области.",
        "url": "http://azsntk.ru/",
        "logo": "img/partners/htk_logo.jpg"
      },
      {
        "name": "ООО \"Иртышнефтепродукт\"",
        "desc": "Сеть АЗС \"Иртышнефтепродукт\", ХМАО.",
        "url": "http://www.irtishoil.ru/",
        "logo": "img/partners/irt.jpg"
      },
      {
        "name": "ИП Коротченко Л.И.",
        "desc": "Сеть АЗК \"Техас\", Красноярский край.",
        "url": "http://texas24.ru/",
        "logo": "img/partners/texas.png"
      },
      {
        "name": "ООО \"Регион 24\"",
        "desc": "Сеть АЗС г.Красноярск.",
        "url": "http://азс-регион24.рф/",
        "logo": "img/partners/logoregion24.png"
      },
      {
        "name": "ООО \"Нефтегазсервис\"",
        "desc": "Сеть АЗС г. Братск.",
        "url": null,
        "logo": "img/partners/logo_neftegazservice.png"
      },
      {
        "name": "ООО \"ТСК\"",
        "desc": "Сеть АЗС \"Альянс\", г. Томск.",
        "url": null,
        "logo": null
      },
      {
        "name": "ООО \"УРАЛКОМ\"",
        "desc": "Сеть АГЗС, р. Башкирия, г. Уфа.",
        "url": null,
        "logo": "img/partners/uralcom.jpg"
      },
      {
        "name": "ООО \"КИТ\"",
        "desc": "Сеть АЗС г.Красноярск.",
        "url": null,
        "logo": null
      },
      {
        "name": "ИП Родина С.С.",
        "desc": "Сеть АЗС \"ГазСервис\" г. Тобольск, Тюменская область.",
        "url": null,
        "logo": null
      },
      {
        "name": "Tipat Firmasi",
        "desc": "Сеть АЗС г. Баку, р. Азербайджан.",
        "url": null,
        "logo": null
      },
      {
        "name": "ООО \"СибТрансПеревозки\"",
        "desc": "Сеть АЗС г. Сургут.",
        "url": "http://stp86.ru/",
        "logo": null
      },
      {
        "name": "ЗАО \"Паритет\"",
        "desc": "Сеть АГЗС г. Волжский, Волгоградской области.",
        "url": null,
        "logo": null
      },
      {
        "name": "ООО \"АЗС-ПРОСТОР\"",
        "desc": "Сеть АЗС г. Сургут.",
        "url": null,
        "logo": null
      },
      {
        "name": "ИП Карякин С.В.",
        "desc": "Сеть АЗС р. Алтай.",
        "url": null,
        "logo": null
      },
      {
        "name": "Сеть АГЗС \"ЭКОТОП\"",
        "desc": "в Челябинской области",
        "url": "http://www.gpi74.ru/",
        "logo": "img/partners/ecotop.png"
      },
      {
        "name": "Сеть АЗС \"Башснабгаз\"",
        "desc": "Республика Башкортостан",
        "url": "https://bsg-azs.ru/",
        "logo": "img/partners/bashsnabgaz.png"
      },
      {
        "name": "Сеть АГЗС \"НордГаз\"",
        "desc": "Республика Башкортостан",
        "url": "https://nordgaz.su/",
        "logo": "img/partners/energy.png"
      },
      {
        "name": "Сеть АЗС \"ЭЛЛИА\"",
        "desc": "ХМАО г. Нягань",
        "url": null,
        "logo": "img/partners/ellia.png"
      },
      {
        "name": "Сеть АЗС \"Компания 2000\"",
        "desc": "Республика Коми, г.Сыктывкар",
        "url": "https://k2000-rk.ru/",
        "logo": "img/partners/logo_company2000.png"
      },
      {
        "name": "АЗС \"Сангилен+\"",
        "desc": "Красноярский край, г.Красноярск",
        "url": "https://www.sangilen.ru/",
        "logo": "img/partners/logo_sangilen.png"
      },
      {
        "name": "сеть АЗС \"ЮграНефтегазСервис\"",
        "desc": "ХМАО",
        "url": "https://oooungs.ru/",
        "logo": "img/partners/ugraneftegazservice.png"
      },
      {
        "name": "Сеть АЗС ИП Сомова Екатерина Александровна",
        "desc": "Республика Хакасия, г.Абакан",
        "url": null,
        "logo": null
      },
      {
        "name": "Сеть АЗС \"Кавказ-Дизель\"",
        "desc": "Ставропольский край, г.Ставрополь",
        "url": "https://kavkaz-autogas.ru/stations/",
        "logo": "img/partners/logo_kavkaz.png"
      },
      {
        "name": "Сеть АЗС \"РОСГАЗ\"",
        "desc": "Ставропольский край, г.Ставрополь",
        "url": "https://rosgazneft.ru/",
        "logo": "img/partners/logo_rosgaz.png"
      },
      {
        "name": "Сеть АЗС ТОО \"ОЙЛ\"",
        "desc": "Республика Казахстан",
        "url": null,
        "logo": "img/partners/logo_too_oil.jpg"
      },
      {
        "name": "Сеть АЗС \"Костанай Автогаз\"",
        "desc": "Республика Казахстан",
        "url": null,
        "logo": null
      },
      {
        "name": "Сеть АЗС \"Техносервис\"",
        "desc": "Республика Казахстан, г.Байконур",
        "url": null,
        "logo": null
      },
      {
        "name": "Сеть АЗС \"TNK Petroleum\"",
        "desc": "Республика Казахстан, Акмолинская область",
        "url": "https://agrotnk.kz/tnkinvest.kz/too-incom-plus/contacts/",
        "logo": "img/partners/logo_inkomplus.png"
      }
    ]
  }
];

  if (typeof module === 'object' && module.exports) module.exports = DATA;
  else root.SNC_DATA = Object.assign(root.SNC_DATA || {}, { partners: DATA });
}(typeof window !== 'undefined' ? window : globalThis));
