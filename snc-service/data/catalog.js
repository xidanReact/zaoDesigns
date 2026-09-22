/* =========================================================
   Каталог оборудования ООО «Сибнефтекарт-сервис».
   Источник: snc-service.sncard.ru/elektronnoe-oborudovanie (разбор 22.09.2026).
   price — руб., целое; images — файлы в snc-service/img/products/<категория>/;
   description — очищенный HTML с сайта ({{root}} — путь к корню сайта, подставляет генератор).
   Как обновлять: правка этого файла → node snc-service/tools/generate.mjs
   ========================================================= */
(function (root) {
  const DATA =
{
  "categories": [
    {
      "slug": "kontrollery-upravleniya",
      "title": "Контроллеры управления ТРК",
      "menuTitle": "Контроллеры управления ТРК / Блоки сопряжения",
      "image": "img/categories/kontrollery-upravleniya.jpg"
    },
    {
      "slug": "preobrazovateli-interfejsov",
      "title": "Преобразователи интерфейсов",
      "menuTitle": "Преобразователи интерфейсов",
      "image": "img/categories/preobrazovateli-interfejsov.jpg"
    },
    {
      "slug": "pos-terminaly",
      "title": "Терминалы СНК",
      "menuTitle": "Терминалы СНК",
      "image": "img/categories/pos-terminaly.jpg"
    },
    {
      "slug": "schityvateli",
      "title": "Считыватели карт",
      "menuTitle": "Считыватели карт",
      "image": "img/categories/schityvateli.jpg"
    },
    {
      "slug": "modemy-gprs",
      "title": "Модемы GPRS",
      "menuTitle": "Модемы GPRS",
      "image": "img/categories/modemy-gprs.jpg"
    },
    {
      "slug": "gromkaya-svyaz",
      "title": "Громкая связь",
      "menuTitle": "Громкая связь",
      "image": "img/categories/gromkaya-svyaz.jpg"
    },
    {
      "slug": "rasshiriteli-som-portov",
      "title": "Расширители СОМ портов",
      "menuTitle": "Расширители СОМ портов",
      "image": "img/categories/rasshiriteli-som-portov.png"
    },
    {
      "slug": "komplektatsiya-dlya-tbr",
      "title": "Комплектация для ТБР",
      "menuTitle": "Комплектация для ТБР",
      "image": "img/categories/komplektatsiya-dlya-tbr.png"
    }
  ],
  "products": [
    {
      "id": 23,
      "category": "kontrollery-upravleniya",
      "slug": "blok-sopryazheniya-snk-uzsg-unsg-01",
      "name": "Блок сопряжения СНК-УЗСГ/УНСГ-01",
      "price": 14750,
      "isNew": true,
      "inStock": true,
      "short": "Блок сопряжения предназначен для подключения к СНК-АЗС 1-ой ГНК УЗСГ или 1-ой весовой установки УНСГ от компании Технопроект.",
      "images": [
        {
          "src": "img/products/kontrollery-upravleniya/blok-sopryazheniya-snk-uzsg-unsg-01-1.jpg",
          "w": 520,
          "h": 268
        }
      ],
      "description": "<p>Блок сопряжения СНК-УЗСГ/УНСГ-01 предназначен для подключения к персональному компьютеру одной ГНК УЗСГ-01 или УНСГ от компании Технопроект. Блок выпускается в двух вариантах: связь с персональным компьютером по каналу связи USB или RS232. Для питания ГНК возможно использовать имеющийся блок питания от компании Технопроект или внешний блок питания 9 вольт (приобретается дополнительно). УЗСГ или УНСГ подключается через стандартный разьем РП10-7, т.е. для подключения достаточно переключить разьем от пульта или блока питания Технопроекта к блоку сопряжения СНК-УЗСГ-01.</p>\n<h3>Блок сопряжения СНК-УЗСГ-01 позволяет подключить ГНК компании Технопроект</h3>\n<ul><li>одной УЗСГ-01;</li><li>одной весовой установкой УНСГ;</li>\n</ul>\n<h3>При заказе необходимо выбрать тип интерфейса Блока</h3>\n<ul><li>RS232 ;</li><li>USB;</li>\n</ul>\n<h3>Протоколы обмена с системой управления</h3>\n<ul><li>1.72 Искра с дополнениями от компании Технопроект;</li><li>Протокол АСУ-Весы для весовой установки УНСГ</li>\n</ul>\n<h3>Базовая комплектация</h3>\n<ul><li>один канал для подключения УЗСГ или УНСГ;</li><li>внешний блок питания 9 вольт (приобретается отдельно);</li><li>кабель USB или RS232-RS232;</li><li><a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">драйвер виртуального СОМ порта</a>.</li>\n</ul>\n<h3>Обновление программного обеспечения</h3>\n<ul><li>программное обеспечение обновляется с помощью FirmWareAPP.exe.</li>\n</ul>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Prog_azs/SNC_YZSG/UZSG_USB_main_v20.zip\" target=\"_blank\" rel=\"noopener\">Скачать текущую версию программного</a> обеспечения контроллера.</p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Prog_azs/SNC_YZSG/PassportYZSG-01.pdf\" target=\"_blank\" rel=\"noopener\">Скачать паспорт на Блок сопряжения СНК-УЗСГ/УНСГ-01</a></p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a> на контроллеры.</p>"
    },
    {
      "id": 26,
      "category": "kontrollery-upravleniya",
      "slug": "kontsentrator-trk-censtar-ili-lanfeng",
      "name": "Концентратор ТРК CenStar или LanFeng",
      "price": 29900,
      "isNew": false,
      "inStock": true,
      "short": "Концентратор (HUB), предназначен для подключения 2-х двухсторонних или 4-е однопостовых ТРК CenStar.",
      "images": [
        {
          "src": "img/products/kontrollery-upravleniya/kontsentrator-trk-censtar-ili-lanfeng-1.jpg",
          "w": 297,
          "h": 80
        }
      ],
      "description": "<p>Контроллер предназначен для управления ТРК серии CenStar и LanFeng.</p>\n<p>Контроллер позволяет:</p>\n<ul><li>управлять 2-мя двухсторонними ТРК или 4-мя односторонними ТРК до 6 пистолетов на каждой из сторон;</li><li>поддерживает протоколы обмена:\n<ul><li>фирменный протокол CenStar - GazKit Link;</li><li>фирменный протокол Сибнефтекарт.</li>\n</ul></li><li>тип физического интерфейса с системой управления - USB;</li><li>контролировать и индицировать состояние внутреннего питания Контроллера, процесс обмена с ТРК и внешней системой управления.</li>\n</ul>\n<p>Спецификация поставки:</p>\n<ul><li>внешний источник питания 12 вольт;</li><li>кабель связи USB;</li><li>Руководство по эксплуатации на Контроллер Концентратор ТРК CenStar и LanFeng;</li>\n</ul>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a>.</p>"
    },
    {
      "id": 27,
      "category": "kontrollery-upravleniya",
      "slug": "kontsentrator-trk-snk",
      "name": "Концентратор ТРК СНК",
      "price": 36750,
      "isNew": false,
      "inStock": true,
      "short": "Концентратор ТРК СНК, предназначен для управления ТРК с импульсным способом управления. В базовой комплектации поддерживает управление 2-мя рукавами (расширяется до 8-ми рукавов).",
      "images": [
        {
          "src": "img/products/kontrollery-upravleniya/kontsentrator-trk-snk-1.jpg",
          "w": 200,
          "h": 120
        },
        {
          "src": "img/products/kontrollery-upravleniya/kontsentrator-trk-snk-2.jpg",
          "w": 200,
          "h": 110
        },
        {
          "src": "img/products/kontrollery-upravleniya/kontsentrator-trk-snk-3.jpg",
          "w": 203,
          "h": 102
        }
      ],
      "description": "<p>Контроллер предназначен для управления ТРК с импульсным способом управления включая ТРК, оснащенные отсчетными устройствами Топаз-106ЦМ. Для обмена данными с управляющей системой используется физический интерфейс RS232 или USB (<a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">виртуальный СОМ порт</a>). В базовой комплектации Концентратор ТРК поставляется с двумя каналами управления ТРК (2 рукава). Позволяет расширить количество рукавов до 8-ми установкой дополнительных <a href=\"{{root}}equipment/kontrollery-upravleniya/kontroller-modul-rasshireniya-dlya-kontsentratora-trk.html\">контроллеров модулей расширения.</a></p>\n<h3>Контроллер \"Концентратор ТРК\" позволяет управлять ТРК, оснащенные</h3>\n<ul><li>механическим отсчетным устройством;</li><li>электронными отсчетными устройствами с импульсным (не интерфейсным) управлением (в том числе Топаз-106ЦМ);</li><li>количество рукавов управления до 8-ми.</li>\n</ul>\n<p><strong>Интерфейс с СУ RS232 или USB (<a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">виртуальный СОМ порт</a>) по выбору.</strong></p>\n<h3>Протоколы обмена с системой управления</h3>\n<ul><li>фирменный протокол СНК;</li><li>протокол Искра 1.72 с поддержкой команд расширенного запроса от Топаза.</li>\n</ul>\n<h3>Базовая комплектация</h3>\n<ul><li>два канала управления;</li><li>внешний блок питания 12 вольт;</li><li>кабель USB;</li><li>кабель RS232-RS232;</li><li><a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">драйвер виртуального СОМ порта</a>.</li>\n</ul>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Prog_azs/Konc/K46_m85.rar\" target=\"_blank\" rel=\"noopener\">Скачать текущую версию программного</a> обеспечения контроллера.</p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a> на контроллеры.</p>"
    },
    {
      "id": 28,
      "category": "kontrollery-upravleniya",
      "slug": "kontroller-modul-rasshireniya-dlya-kontsentratora-trk",
      "name": "Контроллер, модуль расширения для Концентратора ТРК СНК",
      "price": 12500,
      "isNew": false,
      "inStock": true,
      "short": "Контроллер, дополнительный модуль для Концентратора ТРК СНК, предназначен для управления 1-м рукавом ТРК с импульсным способом управления.",
      "images": [
        {
          "src": "img/products/kontrollery-upravleniya/kontroller-modul-rasshireniya-dlya-kontsentratora-trk-1.jpg",
          "w": 203,
          "h": 102
        }
      ],
      "description": "<p>Контроллер предназначен для управления ТРК с импульсным способом управления и снятия сигналов включая, оснащенные отсчетными устройствами Топаз-106ЦМ. Для обмена данными с управляющей системой используется физический интерфейс RS232 или USB (<a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">виртуальный СОМ порт</a>). В базовой комплектации Концентратор ТРК поставляется с двумя каналами управления ТРК (2 рукава). Позволяет расширить количество рукавов до 8-ми.</p>\n<h3>Контроллер \"Концентратор ТРК\" позволяет управлять ТРК, оснащенные</h3>\n<ul><li>механическим отсчетным устройством;</li><li>электронными отсчетными устройствами с импульсным (не интерфейсным) управлением (в том числе Топаз-106ЦМ);</li><li>количество рукавов управления до 8-ми.</li>\n</ul>\n<p><strong>Интерфейс с СУ RS232 или USB (<a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">виртуальный СОМ порт</a>) по выбору.</strong></p>\n<h3>Протоколы обмена с системой управления</h3>\n<ul><li>фирменный протокол СНК;</li><li>протокол Искра 1.72 с поддержкой команд расширенного запроса от Топаза.</li>\n</ul>\n<h3>Базовая комплектация</h3>\n<ul><li>два канала управления;</li><li>внешний блок питания 12 вольт;</li><li>кабель USB;</li><li>кабель RS232-RS232;</li><li><a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">драйвер виртуального СОМ порта</a>.</li>\n</ul>\n<p><a href=\"https://www.sncard.ru/images/files/azs/Prog_azs/Konc/K46_m85.rar\" target=\"_blank\" rel=\"noopener\">Скачать текущую версию программного</a> обеспечения контроллера.</p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a> на контроллеры.</p>"
    },
    {
      "id": 22,
      "category": "kontrollery-upravleniya",
      "slug": "blok-sopryazheniya-snk-uzsg-unsg-02",
      "name": "Блок сопряжения СНК-УЗСГ/УНСГ-02",
      "price": 21790,
      "isNew": true,
      "inStock": true,
      "short": "Блок предназначен для подключения к СНК-АЗС до 2-х ГНК УЗСГ или 2-х весовых установок УНСГ от компании Технопроект.",
      "images": [
        {
          "src": "img/products/kontrollery-upravleniya/blok-sopryazheniya-snk-uzsg-unsg-02-1.jpg",
          "w": 1041,
          "h": 395
        }
      ],
      "description": "<p>Блок предназначен для подключения двух ГНК УЗСГ-01 или одной УЗСГ-02 или двух установок УНСГ (только в составе СНК-АЗС) от компании Технопроект. Для обмена данными с СУ СНК-АЗС доступны каналы связи RS232 и USB. Для питания ГНК возможно использовать имеющийся блок питания от компании Технопроект или внешний блок питания 9 вольт. УЗСГ или УНСГ подключается через стандартный разьем РП10-7, т.е. для подключения достаточно переключить разьем РП10-7 от пульта или блока питания Технопроекта в один из каналов контроллера СНК-УЗСГ-02.</p>\n<h3>Блок сопряжения СНК-УЗСГ/УНСГ-02 позволяет управлять ГНК компании Технопроект</h3>\n<ul><li>одной УЗСГ-02;</li><li>двумя УЗСГ-01;</li><li>одной весовой установкой УНСГ при работе со сторонней СУ</li><li>двумя весовыми установками УНСГ при работе с СУ СНК-АЗС</li>\n</ul>\n<h3>Интерфейс с компьютером RS232 и USB.</h3>\n<h3>Протоколы обмена с системой управления</h3>\n<ul><li>1.72 Искра с дополнениями от компании Технопроект;</li><li>Протокол АСУ-Весы для весовой установки УНСГ</li><li>Протокол АСУ-Весы с расширением от СНК для работы с двумя весовыми установками УНСГ</li>\n</ul>\n<h3>Базовая комплектация</h3>\n<ul><li>два канала для подключения УЗСГ и или один для УНСГ;</li><li>внешний блок питания 9 вольт (приобретается отдельно);</li><li>кабель USB;</li><li>кабель RS232-RS232;</li><li><a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">драйвер виртуального СОМ порта</a>.</li>\n</ul>\n<h3>Обновление программного обеспечения</h3>\n<ul><li>программное обеспечение обновляется с помощью FirmWareAPP.exe.</li>\n</ul>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Prog_azs/SNC_YZSG/UZSG_2_Canal_164main_v7.zip\" target=\"_blank\" rel=\"noopener\">Скачать текущую версию программного обеспечения для контроллера с чипом ATmega164</a></p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Prog_azs/SNC_YZSG/UZSG_2_Canal_324main_v7.zip\" target=\"_blank\" rel=\"noopener\">Скачать текущую версию программного обеспечения для контроллера с чипом ATmega324</a></p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Prog_azs/SNC_YZSG/PassportYZSG-02.pdf\" target=\"_blank\" rel=\"noopener\">Скачать паспорт на Блок сопряжения СНК-УЗСГ/УНСГ-02</a></p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a> на контроллеры.</p>"
    },
    {
      "id": 68,
      "category": "kontrollery-upravleniya",
      "slug": "snk-mv",
      "name": "СНК-МВ",
      "price": 36750,
      "isNew": true,
      "inStock": true,
      "short": "Блок управления ТРК \"СНК-МВ\". Управление одним пистолетом на стороне двухсторонней топливораздаточной колонки.",
      "images": [
        {
          "src": "img/products/kontrollery-upravleniya/snk-mv-1.jpg",
          "w": 1400,
          "h": 625
        },
        {
          "src": "img/products/kontrollery-upravleniya/snk-mv-2.jpg",
          "w": 1400,
          "h": 682
        }
      ],
      "description": "<p>Блок управления ТРК \"СНК-МВ\" (далее БУ СНК-МВ) предназначен для управления двусторонней топливораздаточной колонкой (далее – колонка, ТРК), имеющей до 5 рукавов на стороне, оснащенной одним из типов индикаторных табло (далее – табло):</p><p>− модуль \"ТОПАЗ-160-3/21М\";</p><p>− Lanfeng LFXS-HC-8+5ZP01d.</p><p>БУ СНК-МВ обеспечивает одновременный отпуск топлива по одному рукаву с каждой стороны колонки, управление исполнительными устройствами ТРК и выдачу на табло информации о цене, количестве и стоимости отпущенного топлива.\nУправление двухрукавной колонкой осуществляется непосредственно блоком.</p><p>Управление колонкой с большим количеством рукавов осуществляется блоком подключенными к нему контроллерами расширения \"СНК-EXP-2\". Количество подключаемых к БУ СНК-МВ контроллеров расширения определяются количеством рукавов колонки.</p><p>Обмен информацией между системой управления (далее – СУ) и БУ СНК-МВ осуществляется по фирменному протоколу \"СНК-коммуникационный протокол ТРК\".</p><p>В качестве СУ используется <a href=\"https://snc-service.sncard.ru/azs-menu-product\" target=\"_blank\" rel=\"noopener\">СНК-АЗС</a></p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/SNC_MB/Manual%20SNC-MB.pdf\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить руководство по эксплуатации СНК-МВ</strong></a></p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/SNC_MB/Passport%20SNC_MB.pdf\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить паспорт СНК-МВ</strong></a></p>"
    },
    {
      "id": 69,
      "category": "kontrollery-upravleniya",
      "slug": "kontroller-rasshireniya-snk-exp-2",
      "name": "Контроллер расширения СНК-EXP-2",
      "price": 18000,
      "isNew": true,
      "inStock": true,
      "short": "Подключается к Блоку управления СНК-МВ и дает возможность подключить к управлению дополнительно по одному пистолету на каждой из сторон топливораздаточной колонки.",
      "images": [
        {
          "src": "img/products/kontrollery-upravleniya/kontroller-rasshireniya-snk-exp-2-1.jpg",
          "w": 1400,
          "h": 667
        },
        {
          "src": "img/products/kontrollery-upravleniya/kontroller-rasshireniya-snk-exp-2-2.jpg",
          "w": 1400,
          "h": 666
        }
      ],
      "description": "<p>Контроллер расширения СНК-EXP-2. Подключается к Блоку управления <a href=\"{{root}}equipment/kontrollery-upravleniya/snk-mv.html\">СНК-МВ</a> и дает возможность подключить к управлению дополнительно по одному пистолету на каждой из сторон топливораздаточной колонки.</p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/SNC_EXP2/Passport%20SNC_EXP2.pdf\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить паспорт СНК-EXP-2</strong></a></p>"
    },
    {
      "id": 70,
      "category": "kontrollery-upravleniya",
      "slug": "kontroller-rasshireniya-snk-exp-2h3",
      "name": "Контроллер расширения СНК-EXP-2х3",
      "price": 25500,
      "isNew": true,
      "inStock": true,
      "short": "Подключается к Блоку управления СНК-МВ и дает возможность подключить к управлению до 3-х дополнительных пистолетов на каждой из сторон топливораздаточной колонки.",
      "images": [
        {
          "src": "img/products/kontrollery-upravleniya/kontroller-rasshireniya-snk-exp-2h3-1.jpg",
          "w": 804,
          "h": 418
        },
        {
          "src": "img/products/kontrollery-upravleniya/kontroller-rasshireniya-snk-exp-2h3-2.jpg",
          "w": 867,
          "h": 422
        }
      ],
      "description": "<p>Контроллер расширения СНК-EXP-2х3. Подключается к Блоку управления <a href=\"{{root}}equipment/kontrollery-upravleniya/snk-mv.html\">СНК-МВ</a> и дает возможность подключить к управлению до 3-х дополнительных пистолетов на каждой из сторон топливораздаточной колонки.</p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/SNC_EXP2x3/Passport%20SNC-Exp2x3.pdf\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить паспорт СНК-EXP2x3</strong></a></p>"
    },
    {
      "id": 29,
      "category": "kontrollery-upravleniya",
      "slug": "kontsentrator-tokovoy-petli",
      "name": "Концентратор токовой петли",
      "price": 29900,
      "isNew": false,
      "inStock": true,
      "short": "Концентратор каналов токовой петли, предназначен для подключения до 6-ти ТРК с интерфейсом \"Токовая петля 20\\42мА\" к персональному компьютеру по интерфейсу RS232 или USB.",
      "images": [
        {
          "src": "img/products/kontrollery-upravleniya/kontsentrator-tokovoy-petli-1.jpg",
          "w": 200,
          "h": 125
        }
      ],
      "description": "<p>Контроллер концентратор 20/42ма токовая петля предназначен для согласования уровней между устройствами с интерфейсами RS232 или USB - Токовая Петля. Применяется для подключения ТРК Gilbarco (протокол \"Two-wire\"), Ливенка, ГНК УИЖГЭ. У контроллера 6 независимых друг от друга каналов приема передачи с интеллектуальной логикой контроля и отключения канала при его обрыве и восстановлении.</p>\n<ul><li>питание от внешнего источника 12 вольт;</li><li>скорость приема-передачи до 57600;</li><li>режим работы - полудуплексный;</li><li>ток в линии 20\\42 ма (настраивается);</li><li>общее число каналов Токовая петля 6 (шесть);</li><li>для подключения к устройствам управления используется интерфейсы RS232 или USB (виртуальный СОМ порт) и стандартные кабели RS232 или USB;</li><li>светодиодная индикация активности по каждому каналу Токовая линия;</li><li>светодиодная индикация внешнего питания;</li><li>масса преобразователя не более 0,5 кг.</li>\n</ul>\n<p>В комплект поставки входит: преобразователь, кабель RS232 и USB, паспорт.</p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a></p>"
    },
    {
      "id": 30,
      "category": "preobrazovateli-interfejsov",
      "slug": "preobrazovateli-iz-rs232-ili-usb-v-tokovuyu-petlyu",
      "name": "Преобразователи из RS232 или USB в токовую петлю",
      "price": 12880,
      "isNew": false,
      "inStock": true,
      "short": "Преобразователи интерфейсов из RS232 или USB в интерфейс \"Токовая петля 20\\42мА\" (1 канал). Гальваническая развязка, питание от USB. Подходит для подключения ТРК Ливенка, Gilbarco, Macroni. Способ подключения к ПК: RS232 или USB.",
      "images": [
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovateli-iz-rs232-ili-usb-v-tokovuyu-petlyu-1.jpg",
          "w": 301,
          "h": 292
        },
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovateli-iz-rs232-ili-usb-v-tokovuyu-petlyu-2.jpg",
          "w": 263,
          "h": 262
        },
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovateli-iz-rs232-ili-usb-v-tokovuyu-petlyu-3.jpg",
          "w": 200,
          "h": 156
        }
      ],
      "description": "<p>Преобразователи интерфейсов Токовая петля 20\\42 ма предназначены для согласования физических уровней приема/передачи между устройствами с интерфейсами RS232 или USB и Токовой Петлей. Обеспечивает гальваническую развязку интерфейсов и защиту от бросков напряжения. Может применяться для подключения ТРК Ливенка, Gilbarco и других ТРК и устройств с интерфейсом Токовая петля.</p>\n<ul><li>питание от внешнего источника 5 вольт, например USB;</li><li>скорость приема-передачи до 19200;</li><li>режим работы - полудуплексный;</li><li>ток в линии 20\\42 ма. Для ТРК Gilbarco 42 ма, для ТРК Ливны 20 ма (изменяется установкой или снятием перемычки на плате преобразователя);</li><li>подключение абонентов последовательное, общее число до 4-х;</li><li>для подключения к устройствам с интерфейсом RS232 используется нуль модемное соединение и стандартный кабель с разьемами DB-9;</li><li>для подключения к устройствам с интерфейсом USB используется стандартный кабель c разьемами USBA - USBB;</li><li>для подключения к устройствам с интерфейсом 20\\42ма токовая петля используется разьем ME010-50802 для крепление кабеля под винт;</li><li>светодиодная индикация активности в Токовой линии;</li><li>светодиодная индикация внешнего питания;</li><li>масса преобразователя не более 0,1 кг.</li>\n</ul>\n<p>В комплект поставки входит: преобразователь, кабель RS232 или USBA-USBB, паспорт, <a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">драйвер виртуального СОМ порта</a> (для USB версии).</p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a></p>"
    },
    {
      "id": 31,
      "category": "preobrazovateli-interfejsov",
      "slug": "preobrazovatel-iz-rs232-ili-usb-v-rs485-poludupleks",
      "name": "Преобразователь из RS232 или USB в RS485 полудуплекс",
      "price": 12880,
      "isNew": false,
      "inStock": true,
      "short": "Преобразователи интерфейсов из RS232 или USB в интерфейс RS485 полудуплекс. Гальваническая развязка, питание от USB. Подходит для подключения всех моделей ТРК с интерфейсом связи RS485. Способ подключения к ПК: RS232 или USB.",
      "images": [
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-iz-rs232-ili-usb-v-rs485-poludupleks-1.jpg",
          "w": 279,
          "h": 261
        },
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-iz-rs232-ili-usb-v-rs485-poludupleks-2.jpg",
          "w": 272,
          "h": 257
        },
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-iz-rs232-ili-usb-v-rs485-poludupleks-3.jpg",
          "w": 200,
          "h": 156
        }
      ],
      "description": "<p>Преобразователи интерфейсов RS485 предназначены для согласования физических уровней приема/передачи между устройствами с интерфейсами RS232 или USB и RS485 полудуплекс. Обеспечивают гальваническую развязку интерфейсов и защиту от бросков напряжения по каналу RS485.</p>\n<ul><li>питание +5 вольт от внешнего источника (разьем USB);</li><li>скорость приема-передачи до 115200;</li><li>режим работы - полудуплексный;</li><li>переключение между режимами приема-передачи автоматическое;</li><li>для подключения к интерфейсу RS232 используется нуль модемное соединение, кабель с разьемами DB-9;</li><li>для подключения к устройствам с интерфейсом USB используется стандартный кабель c разьемами USBA - USBB;</li><li>для подключения к устройствам с интерфейсом RS485 используется разьем ME010-50803 для крепление кабеля под винт;</li><li>светодиодная индикация активности по линиям RS485;</li><li>светодиодная индикация внешнего питания;</li><li>масса преобразователя не более 0,1 кг.</li>\n</ul>\n<p>В комплект поставки входит: преобразователь, кабель RS232 или USBA-USBB, паспорт, <a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">драйвер виртуального СОМ порта</a> (для USB версии).</p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a></p>"
    },
    {
      "id": 32,
      "category": "preobrazovateli-interfejsov",
      "slug": "preobrazovatel-usb-rs232",
      "name": "Преобразователь USB-RS232",
      "price": 12880,
      "isNew": false,
      "inStock": true,
      "short": "Преобразователь интерфейсов USB-RS232. Гальваническая развязка, питание от USB. Способ подключения к ПК: USB.",
      "images": [
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-usb-rs232-1.jpg",
          "w": 327,
          "h": 294
        },
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-usb-rs232-2.jpg",
          "w": 383,
          "h": 330
        }
      ],
      "description": "<p>Преобразователь <strong>USB-RS232</strong> предназначен для согласования уровней между устройствами с интерфейсами USB и RS232. Он обеспечивает гальваническую развязку интерфейсов и защиту от бросков напряжения по каналу RS232.</p>\n<ul><li>питание от штатного источника USB 5 вольт;</li><li>скорость приема-передачи до 115200;</li><li>режим работы RS232 - null modem;</li><li>переключение между режимами приема-передачи автоматическое;</li><li>для подключения к устройствам с интерфейсом USB используется стандартный кабель c разьемами USBA - USBB;</li><li>для подключения к устройствам с интерфейсом RS232 используется стандартный нуль модемный кабель DB9(мама)-DB9(мама);</li><li>светодиодная индикация активности по линиям USB и питания 5 вольт;</li><li>масса преобразователя не более 0,1 кг</li>\n</ul>\n<p>В комплект поставки входит: преобразователь, кабель USBA-USBB, паспорт, <a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">драйвер виртуального СОМ порта</a></p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a></p>"
    },
    {
      "id": 33,
      "category": "preobrazovateli-interfejsov",
      "slug": "preobrazovatel-interfeysov-usb-ili-rs232-v-interfeys",
      "name": "Преобразователь интерфейсов USB или RS232 в интерфейс ТРК Tokheim",
      "price": 12800,
      "isNew": false,
      "inStock": true,
      "short": "Преобразователь интерфейсов из USB или RS232 для подключения ТРК Tokheim. Позволяет подключить до 2-х ТРК. Гальваническая развязка, питание от USB. Способ подключения к ПК: RS232 или USB.",
      "images": [
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-interfeysov-usb-ili-rs232-v-interfeys-1.jpg",
          "w": 367,
          "h": 336
        },
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-interfeysov-usb-ili-rs232-v-interfeys-2.jpg",
          "w": 394,
          "h": 327
        },
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-interfeysov-usb-ili-rs232-v-interfeys-3.jpg",
          "w": 395,
          "h": 336
        }
      ],
      "description": "<p>Преобразователь предназначен для сопряжения физических интерфейсов устройств (персональный компьютер) с интерфейсом USB или RS232 с интерфейсом ТРК Tokheim серии Quantium, оснащенным интерфейсными платами типа \"WWC 0EL 021.0 COMM TOKHEIM INTERFACE\".</p>\n<h3>Технические характеристики</h3>\n<p>Значения Напряжение питания, В</p>\n<p>Ток потребления, мА</p>\n<p>Напряжение высокого уровня входа \"TTC\", В</p>\n<p>Напряжение низкого уровня входа \"TTC\", В</p>\n<p>Втекающий ток входа \"TTC\", мА</p>\n<p>Втекающий ток выхода \"TTD\", мА</p>\n<p>Скорость обмена данными, бит/с</p>\n<p>Количество подключаемых ТРК</p>\n<p>Габаритные размеры без блока питания, мм</p>\n<p>Масса, кг</p>\n<p>5±0,5</p>\n<p>не более 100</p>\n<p>не менее 3,0</p>\n<p>не более 1,0</p>\n<p>не более 10</p>\n<p>не более 100</p>\n<p>9600</p>\n<p>2</p>\n<p>не более 50 × 90 × 25</p>\n<p>не более 0,25</p>\n<h3>Комплект поставки содержит</h3>\n<p>преобразователь RS232-Tokheim</p>\n<p>кабель связи с разьемом питания USBA (версия RS232)</p>\n<p>кабель связи USBA (версия USB)</p>\n<p>розетку MC200-50803</p>\n<p>руководство по эксплуатации</p>\n<p>1 шт.</p>\n<p>1 шт.</p>\n<p>1 шт.</p>\n<p>2 шт.</p>\n<p>1 экз.</p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a></p>\n<p>Схема электрическая принципиальная RS232 <a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/Konv232_Tokheim/Konv232-TokheimSCH.rar\" target=\"_blank\" rel=\"noopener\">Скачать</a></p>\n<p>Схема электрическая принципиальная USB <a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/KonvUSB_Tokheim/KonvUSB_TokheimSCH.rar\" target=\"_blank\" rel=\"noopener\">Скачать</a></p>\n<p>Схема размещения элементов RS232 <a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/Konv232_Tokheim/Konv232-TokheimPCB.rar\" target=\"_blank\" rel=\"noopener\">Скачать</a></p>\n<p>Схема размещения элементов USB <a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/KonvUSB_Tokheim/KonvUSB_TokheimPCB.rar\" target=\"_blank\" rel=\"noopener\">Скачать</a></p>\n<p>Спецификация элементов RS232 <a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/Konv232_Tokheim/Konv232-TokheimSpec.rar\" target=\"_blank\" rel=\"noopener\">Скачать</a></p>\n<p>Спецификация элементов USB <a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/KonvUSB_Tokheim/KonvUSB_TokheimSpec.rar\" target=\"_blank\" rel=\"noopener\">Скачать</a></p>"
    },
    {
      "id": 63,
      "category": "preobrazovateli-interfejsov",
      "slug": "preobrazovateli-interfeysov-rs232-ili-usb-v-rs422-rs485",
      "name": "Преобразователи интерфейсов RS232 или USB в RS422/RS485 дуплекс",
      "price": 14850,
      "isNew": false,
      "inStock": true,
      "short": "Преобразователи интерфейсов RS232 / USB в интерфейс RS422/RS485 дуплекс. Гальваническая развязка, питание от USB. Подходит для подключения внешних изделий с независимыми линиями приема и передачи (RS422). Способ подключения к ПК: RS232 или USB.",
      "images": [
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovateli-interfeysov-rs232-ili-usb-v-rs422-rs485-1.jpg",
          "w": 1400,
          "h": 1020
        }
      ],
      "description": "<p>Преобразователи интерфейсов предназначены для согласования физических уровней приема/передачи между устройствами с интерфейсами RS232 или USB с устройствами с интерфейсом RS422/RS485 дуплекс (независимые каналы приема и передачи). Обеспечивают гальваническую развязку интерфейсов и защиту от бросков напряжения по каналу RS485/RS422.</p>\n<ul><li>питание +5 вольт от внешнего источника (разьем USB);</li><li>скорость приема-передачи до 115200;</li><li>режим работы - полудуплексный;</li><li>переключение между режимами приема-передачи автоматическое;</li><li>для подключения к интерфейсу RS232 используется нуль модемное соединение, кабель с разьемами DB-9;</li><li>для подключения к устройствам с интерфейсом USB используется стандартный кабель c разьемами USBA - USBB;</li><li>для подключения к устройствам с интерфейсом RS485/RS422 используется разьем ME010-50805 для крепление кабеля под винт;</li><li>светодиодная индикация активности по линиям RS485/RS422;</li><li>светодиодная индикация внешнего питания;</li><li>масса преобразователя не более 0,1 кг.</li>\n</ul>\n<p>В комплект поставки входит: преобразователь, кабель RS232 или USBA-USBB, паспорт, <a href=\"http://cloud.sncard.ru/download/drivers/FTDI/\" target=\"_blank\" rel=\"noopener\">драйвер виртуального СОМ порта</a> (для USB версии).</p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a></p>"
    },
    {
      "id": 64,
      "category": "preobrazovateli-interfejsov",
      "slug": "preobrazovatel-interfeysov-ethernet-rs485-poludupleks",
      "name": "Преобразователь интерфейсов Ethernet-RS485 полудуплекс",
      "price": 17325,
      "isNew": true,
      "inStock": true,
      "short": "Преобразователь интерфейсов Ethernet-RS485 полудуплекс.",
      "images": [
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-interfeysov-ethernet-rs485-poludupleks-1.jpg",
          "w": 1304,
          "h": 1064
        },
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-interfeysov-ethernet-rs485-poludupleks-2.jpg",
          "w": 1178,
          "h": 946
        }
      ],
      "description": "<p>Преобразователь интерфейсов Ethernet-RS485 полудуплекс предназначен для обеспечения подключения Изделий с интерфейсом RS485 полудуплекс к персональному компьютеру. Обмен информацией со стороны компьютера производится через Ethernet. RS485 и Ethernet гальванически развязаны. Установка локального IP адреса производится через утилиту, все настройки сохраняются. Возможен возврат к заводским установкам.</p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/KonvTCPIP-RS485%20simplex/Passport%20SNC-Ethernet-RS485%20simplex.pdf\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить паспорт СНК-Ethernet-RS485 simplex</strong></a></p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/EbyteConfigTool/Ebyte%20config%20tool.exe\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить утилиту настройки параметров сети Ethernet \"Ebyte config tool\"</strong></a></p>"
    },
    {
      "id": 65,
      "category": "preobrazovateli-interfejsov",
      "slug": "preobrazovatel-interfeysov-ethernet-rs485-dupleks",
      "name": "Преобразователь интерфейсов Ethernet-RS485 дуплекс",
      "price": 19425,
      "isNew": true,
      "inStock": true,
      "short": "Преобразователь интерфейсов Ethernet-RS485 дуплекс.",
      "images": [
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-interfeysov-ethernet-rs485-dupleks-1.jpg",
          "w": 1304,
          "h": 993
        },
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-interfeysov-ethernet-rs485-dupleks-2.jpg",
          "w": 1178,
          "h": 946
        }
      ],
      "description": "<p>Преобразователь интерфейсов Ethernet-RS485 дуплекс предназначен для обеспечения подключения Изделий с интерфейсом RS485/RS422 дуплекс к персональному компьютеру. Обмен информацией со стороны компьютера производится через Ethernet. RS485/RS422 и Ethernet гальванически развязаны. Установка локального IP адреса производится через утилиту, все настройки сохраняются. Возможен возврат к заводским установкам.</p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/KonvTCPIP-RS485%20duplex/Passport%20SNC-Ethernet-RS485%20duplex.pdf\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить паспорт СНК-Ethernet-RS485 duplex</strong></a></p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/EbyteConfigTool/Ebyte%20config%20tool.exe\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить утилиту настройки параметров сети Ethernet \"Ebyte config tool\"</strong></a></p>"
    },
    {
      "id": 66,
      "category": "preobrazovateli-interfejsov",
      "slug": "preobrazovatel-interfeysov-ethernet-20-45ma-tokovaya",
      "name": "Преобразователь интерфейсов Ethernet-20/45ма токовая петля",
      "price": 17325,
      "isNew": true,
      "inStock": true,
      "short": "Преобразователь интерфейсов Ethernet-20/45ма токовая петля",
      "images": [
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-interfeysov-ethernet-20-45ma-tokovaya-1.jpg",
          "w": 1208,
          "h": 917
        },
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-interfeysov-ethernet-20-45ma-tokovaya-2.jpg",
          "w": 1178,
          "h": 946
        }
      ],
      "description": "<p>Преобразователь интерфейсов Ethernet-20/45ма токовая петля предназначен для обеспечения подключения Изделий с токовым интерфейсом 20 или 45 мА к персональному компьютеру. Обмен информацией со стороны компьютера производится через Ethernet. Интерфейс 20/45мА и Ethernet гальванически развязаны. Установка локального IP адреса производится через утилиту, все настройки сохраняются. Возможен возврат к заводским установкам.</p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/KonvTCPIP-20ma/Passport%20SNC-Ethernet-20mA.pdf\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить паспорт СНК-Ethernet-20/45mA</strong></a></p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/EbyteConfigTool/Ebyte%20config%20tool.exe\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить утилиту настройки параметров сети Ethernet \"Ebyte config tool\"</strong></a></p>"
    },
    {
      "id": 67,
      "category": "preobrazovateli-interfejsov",
      "slug": "preobrazovatel-interfeysov-ethernet-trk-tokheim",
      "name": "Преобразователь интерфейсов Ethernet- ТРК Tokheim",
      "price": 19425,
      "isNew": true,
      "inStock": true,
      "short": "Преобразователь интерфейсов Ethernet- ТРК Tokheim.",
      "images": [
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-interfeysov-ethernet-trk-tokheim-1.jpg",
          "w": 1282,
          "h": 862
        },
        {
          "src": "img/products/preobrazovateli-interfejsov/preobrazovatel-interfeysov-ethernet-trk-tokheim-2.jpg",
          "w": 1178,
          "h": 946
        }
      ],
      "description": "<p>Преобразователь интерфейсов Ethernet-Tokheim предназначен для подключения топливораздаточных и газонаполнительных колонок Tokheim серии Quantium, оснащенным интерфейсными платами типа \"WWC 0EL 021.0 COMM TOKHEIM INTERFACE\" к персональному компьютеру по интерфейсу Ethernet. Интерфейс Tokheim и Ethernet гальванически развязаны. Установка локального IP адреса производится через утилиту, все настройки сохраняются. Возможен возврат к заводским установкам.</p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/KonvTCPIP-Tokheim/Passport%20SNC-Ethernet-Tokheim.pdf\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить паспорт СНК-Ethernet-Tokheim</strong></a></p>\n<p><a href=\"https://snc-service.sncard.ru/images/files/azs/Doc/Manufac/EbyteConfigTool/Ebyte%20config%20tool.exe\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить утилиту настройки параметров сети Ethernet \"Ebyte config tool\"</strong></a></p>"
    },
    {
      "id": 34,
      "category": "pos-terminaly",
      "slug": "terminal-beznalichnyh-raschetov-tbr",
      "name": "Терминал безналичных расчетов (ТБР)",
      "price": 78750,
      "isNew": false,
      "inStock": true,
      "short": "Терминал для самообслуживания клиентов по топливным и дисконтным картам СНК. Имеет вандалоустойчивое исполнение, внутреннюю систему климат контроля. Предназначен для эксплуатации при температуре окружающей среды от -40С до +40С.",
      "images": [
        {
          "src": "img/products/pos-terminaly/terminal-beznalichnyh-raschetov-tbr-1.jpg",
          "w": 200,
          "h": 275
        }
      ],
      "description": "<p>Терминал СНК-ТБР выполнен в вандалоустойчивом, уличном исполнении. Работает только в составе\n<a href=\"https://snc-service.sncard.ru/azs-menu-product\" target=\"_blank\" rel=\"noopener\">СНК-АЗС</a></p>\n<h3>Описание</h3>\n<ul><li>процессор: CPU Mega128, основная частота: 11 МГц;</li><li>память: 4Кб памяти (RAM); 128 Мб FLASH (BOOT и область приложения);</li><li>дисплей ЖК 1х16;</li><li>RFID-считыватель бесконтактных (MIFARE) смарт-карт стандарта ISO14443 typeA/typeB, 13.56 МГц;</li><li>считыватель IButton 1992, 1963;</li><li>подсветка дисплея;</li><li>вандалозащищенная клавиатура 4х4;</li><li>звуковое сопровождение диалога;</li><li>встроенная система климат-контроля.</li>\n</ul>\n<h3>Интерфейс</h3>\n<ul><li>1xRS232 или 1хRS485</li>\n</ul>\n<p><strong>Питание</strong><strong><br></strong></p>\n<ul><li>переменное напряжение 220 вольт;</li><li>потребляемая мощность до 15 ватт.</li>\n</ul>\n<p>Терминал поставляется с комплектом кабелей: информационный и обогрев, каждый по 4 метра. Кабели большей длины изготовляются под заказ.</p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a>.</p>"
    },
    {
      "id": 35,
      "category": "pos-terminaly",
      "slug": "terminal-snk-s380",
      "name": "Терминал СНК-S380",
      "price": 74000,
      "isNew": false,
      "inStock": true,
      "short": "Автономный терминал, предназначен для осуществление продаж по топливным, дисконтным и бонусным картам СНК. Выполнен в виде многофункционального устройства по принципу \"все в одном\".",
      "images": [
        {
          "src": "img/products/pos-terminaly/terminal-snk-s380-1.jpg",
          "w": 200,
          "h": 138
        }
      ],
      "description": "<p>Терминал предназначен для осуществления продаж на точках обслуживания по топливным, дисконтным и бонусным картам СНК. Терминал поддерживает режимы работы: автономный и подключенный. Выполнен в виде многофункционального устройства по принципу \"all-in-one\" (\"всё в одном\", все необходимые для работы устройства встроены в единый корпус). Достоинство такого типа решения - возможность использования в любом месте независимо от наличия и качества линий связи и электропитания, а также в качестве носимого терминала.</p>\n<h3>Функциональные возможности в работе с бесконтактными картами MF</h3>\n<ul><li>обслуживает топливные карты СНК:\n<ul><li>лимитные;</li><li>дебетные стоимостные (ЭК);</li><li>партии топлив (дебетные литровые).</li>\n</ul></li><li>обслуживает дисконтные карты СНК (схемы дисконта принимаются из пакета СНК-УС);</li><li>обслуживает бонусные карты СНК (схемы накопления и списания принимаются из пакета СНК-УС);</li><li>читает магнитные карты формата записи ISO 7811 3-и дорожки;</li><li>читает штрих-код через внешний сканер (подключение через СОМ или USB).</li>\n</ul>\n<h3>Возможности коммуникации</h3>\n<ul><li>встроенный LAN, GPRS (1 SIM), 2-COM, 1-USB;</li><li>инкассация доступна по любому каналу связи;</li><li>обновление программного обеспечение производится автоматически, по любому каналу связи через единый центр управления терминалами \"СНК-TMS\"</li><li>связь с управляющей системой по любому доступному каналу связи</li>\n</ul>\n<h3>Спецификация терминала</h3>\n<ul><li>процессор: 32-bit ARM11;</li><li>память: 128Мб памяти (SDRAM); 64Мб FLASH (BOOT и операционной системы);</li><li>дисплей 3.5'' TFT 320 × 240 pixel, color backlit, touch screen;</li><li>поддержка беспроводной связи: GPRS,CDMA,Wi-Fi и 3G;</li><li>интерфейсы: LAN, USB, RS232;</li><li>аппаратная защита PIN-клавиатуры;</li><li>считыватели магнитных карт ISO 7811 1/2/3 дорожки;</li><li>RFID-считыватель бесконтактных (MIFARE) смарт-карт стандарта ISO14443 typeA/typeB, 13.56 МГц;</li><li>высокоскоростной термопринтер 16 lines / sec;</li><li>стандартный размер рулона бумаги для термопринтера: 58mm ± 0.5mm (2.25 in.);</li><li>подсветка дисплея и клавиатуры;</li><li>защита от несанкционированного вскрытия.</li>\n</ul>\n<p>Терминал поставляется с прикладным программным обеспечением СНК-POS, обеспечивающее обслуживание топливных и дисконтных карт СНК и программным обеспечением СНК-TMS, предназначенное для дистанционного управления, настройки и инкассации сети терминалов.</p>\n<p><a href=\"https://www.sncard.ru/images/files/presentation/Presentation%20SNC-POS.rar\" target=\"_blank\" rel=\"noopener\">Скачать презентацию на Терминал СНК-S380 и PinPad клавиатуру СНК-Р90</a></p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a>.</p>"
    },
    {
      "id": 36,
      "category": "pos-terminaly",
      "slug": "pinpad-klaviatura-snk-r90",
      "name": "PinPad клавиатура СНК-Р90",
      "price": 20160,
      "isNew": false,
      "inStock": true,
      "short": "Выносная клавиатура для ввода покупателем ПИН кода топливных и бонусных карт СНК. Может подключаться к СОМ порту персонального компьютера и использоваться в составе автономного терминала СНК-S380.",
      "images": [
        {
          "src": "img/products/pos-terminaly/pinpad-klaviatura-snk-r90-1.jpg",
          "w": 200,
          "h": 180
        }
      ],
      "description": "<p><strong>СНК - P90</strong> является внешним устройством для ввода покупателем ПИН кода при расчете за покупку при помощи карты. Поддерживает DES и 3DES алгоритмы шифрование.</p>\n<p><strong>СНК - P90</strong> оснащен 32-разрядным процессором высокой производительности и встроенным бесконтактным кард-ридером (опция).</p>\n<ul><li>процессор: 32-bit ARM11 CPU;</li><li>дисплей: отображение 2х строк, LED подсветка;</li><li>клавиатура: 10 цифровых кнопок, 3 кнопки управления, 3 функциональные кнопки;</li><li>RFID считыватель (опция): поддержка стандартов ISO14443 Type A/B и qPBOC2.0;</li><li>алгоритмы шифрования: DES, 3DES, SHA-1, SHA-256;</li><li>интерфейс: 1 x RS232;</li><li>размеры: 134мм x 76мм x 54мм;</li><li>условия эксплуатации: температура: 0 -- 50С влажность: 5% -- 90%;</li><li>сертификат: PIN security certificate PCI 3.X.</li>\n</ul>\n<p><a href=\"https://www.sncard.ru/images/files/presentation/Presentation%20SNC-POS.rar\" target=\"_blank\" rel=\"noopener\">Скачать презентацию на Терминал СНК-S380 и PinPad клавиатуру СНК-Р90</a></p>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a>.</p>"
    },
    {
      "id": 38,
      "category": "schityvateli",
      "slug": "schityvatel-beskontaktnyh-kart-serii-mifare-cr522-au",
      "name": "Считыватель бесконтактных карт серии Mifare CR522-AU",
      "price": 11670,
      "isNew": false,
      "inStock": true,
      "short": "Считыватель бесконтактных карт серии Mifare. Способ подключения к ПК: USB (виртуальный СОМ порт). Применяется для обслуживания карт СНК в составе системы управления \"СНК-АЗС\".",
      "images": [
        {
          "src": "img/products/schityvateli/schityvatel-beskontaktnyh-kart-serii-mifare-cr522-au-1.jpg",
          "w": 200,
          "h": 169
        }
      ],
      "description": "<p>Настольный считыватель бесконтактных смарт-карт и меток стандартов MIFARE® ISO14443 A/B (MIFARE®, MIFARE® Ultralight C и др.).</p>\n<h3>Описание</h3>\n<ul><li>выполняет операции чтения и записи карт;</li><li>встроенная антенна, дальность считывания до 50 мм;</li><li>поддержка карты стандарта ISO 14443 типов A и B, технологии Mifare, 13.56 МГц;</li><li>интерфейс USB (виртуальный СОМ порт);</li><li>двухцветный светодиод и зуммер;</li><li>компактный размер: 98 мм (Д) x 65 мм (Ш) x 12.8 мм (В);</li><li>малый вес: 70 г;</li><li>поддерживаемые операционные системы: Windows ® 98, ME, 2000, Server 2003, XP, Vista, Server 2008, Server 2008 R2, 7,8,8.1, Windows ® CE 5.0 и 6.0, Linux, Mac</li>\n</ul>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a>.</p>"
    },
    {
      "id": 42,
      "category": "modemy-gprs",
      "slug": "kabel-db9m-db9f",
      "name": "Кабель DB9M-DB9F",
      "price": 550,
      "isNew": false,
      "inStock": true,
      "short": "",
      "images": [
        {
          "src": "img/products/modemy-gprs/kabel-db9m-db9f-1.jpg",
          "w": 357,
          "h": 254
        }
      ],
      "description": ""
    },
    {
      "id": 43,
      "category": "gromkaya-svyaz",
      "slug": "pgu-azs-klient-peregovornoe-gromkogovoryaschee",
      "name": "ПГУ АЗС «Клиент» (переговорное громкоговорящее устройство)",
      "price": 31970,
      "isNew": false,
      "inStock": true,
      "short": "Переговорное громкоговорящее устройство для АЗС. Позволяет проводить оповещение территории АЗС через внешние громкоговорители 25ГРДП, вести переговоры оператора АЗС с клиентами без прямого с ними контакта.",
      "images": [
        {
          "src": "img/products/gromkaya-svyaz/pgu-azs-klient-peregovornoe-gromkogovoryaschee-1.jpg",
          "w": 200,
          "h": 144
        }
      ],
      "description": "<p>Громкоговорящая связь «АЗС-Клиент» предназначена для оповещения территории АЗС и проведения переговоров оператора АЗС с клиентами.</p>\n<h3>Описание. Базовый блок</h3>\n<ul><li>число подключаемых блоков клиента - 1;</li><li>выходная мощность на внешний динамик – 25 Вт;</li><li>сопротивление внешнего динамика – 8 Ом;</li><li>выходная мощность на внутренний динамик – 3 Вт;</li><li>вход микрофона – 1 шт.;</li><li>управление – стандартный манипулятор «мышь»;</li><li>генерация тревожного сигнала;</li><li>питание устройства ~ 220В;</li><li>максимальный ток потребления – 0,5А;</li><li>габаритные размеры 245х175х70 мм.</li>\n</ul>\n<h3>Описание. Блок клиента</h3>\n<ul><li>мощность динамика – 3 Вт;</li><li>сопротивление динамика – 16 Ом;</li><li>габаритные размеры 140 х 85 х 40 мм.</li>\n</ul>\n<h3>\"АЗС-Клиент\" поставляется в следующем комплекте</h3>\n<ul><li>базовый блок - 1;</li><li>блок клиента - 1;</li><li>микрофон на подставке - 1;</li><li>манипулятор «Мышь» (3-х кнопочный) - 1;</li><li>кабель подключения блока клиента - 4м;</li><li>паспорт - 1.</li>\n</ul>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a>.</p>"
    },
    {
      "id": 44,
      "category": "gromkaya-svyaz",
      "slug": "pgu-azk-klient-peregovornoe-gromkogovoryaschee",
      "name": "ПГУ АЗК «Клиент» (переговорное громкоговорящее устройство)",
      "price": 31970,
      "isNew": false,
      "inStock": true,
      "short": "Переговорное громкоговорящее устройство для АЗК (комплекса). Позволяет проводить оповещение территории АЗК через внешние громкоговорители 25ГРДП, с двух рабочих мест.",
      "images": [
        {
          "src": "img/products/gromkaya-svyaz/pgu-azk-klient-peregovornoe-gromkogovoryaschee-1.jpg",
          "w": 200,
          "h": 144
        }
      ],
      "description": "<p>Громкоговорящая связь «АЗК-Клиент» предназначена для оповещения территории АЗК с двух рабочих мест операторов АЗК.</p>\n<h3>Описание. Базовый блок</h3>\n<ul><li>выходная мощность на внешний динамик – 25 Вт;</li><li>сопротивление внешнего динамика – 8 Ом;</li><li>возможно параллельное подключение двух 25-ваттных динамиков сопротивлением 8 Ом;</li><li>вход микрофона – 2 шт.;</li><li>управление (настройка) – стандартный манипулятор «мышь»;</li><li>генерация тревожного сигнала;</li><li>питание устройства ~ 220В;</li><li>максимальный ток потребления – 0,5А;</li><li>габаритные размеры 245х175х70 мм.</li>\n</ul>\n<h3>\"АЗК-Клиент\" поставляется в следующем комплекте</h3>\n<ul><li>базовый блок - 1;</li><li>микрофон на подставке - 2;</li><li>манипулятор «Мышь» (3-х кнопочный) - 1;</li><li>паспорт - 1.</li>\n</ul>\n<p>Перейти в раздел <a href=\"{{root}}docs.html#equipment\">Документация</a>.</p>"
    },
    {
      "id": 45,
      "category": "gromkaya-svyaz",
      "slug": "gromkogovoritel-rupornyy-25grdp",
      "name": "Громкоговоритель рупорный 25ГРДП",
      "price": 8400,
      "isNew": false,
      "inStock": true,
      "short": "Громкоговоритель всепогодного исполнения мощностью 25 Вт, активное сопротивление 8 Ом. Рекомендуется использовать в составе ПГУ АЗС \"Клиент\" или ПГУ АЗК \"Клиент\".",
      "images": [
        {
          "src": "img/products/gromkaya-svyaz/gromkogovoritel-rupornyy-25grdp-1.jpg",
          "w": 1350,
          "h": 629
        }
      ],
      "description": "<p>Громкоговоритель всепогодного исполнения мощностью 25 Вт, активное сопротивление 8 Ом. Рекомендуется использовать в составе ПГУ АЗС \"Клиент\" или ПГУ АЗК \"Клиент\".</p>"
    },
    {
      "id": 46,
      "category": "rasshiriteli-som-portov",
      "slug": "orient-xwt-ps050",
      "name": "Orient XWT-PS050",
      "price": 1970,
      "isNew": false,
      "inStock": true,
      "short": "Контроллер расширитель СОМ портов (2xCOM9M) для персонального компьютера для шины PCI.",
      "images": [
        {
          "src": "img/products/rasshiriteli-som-portov/orient-xwt-ps050-1.png",
          "w": 200,
          "h": 101
        }
      ],
      "description": "<p>Контроллер расширитель СОМ портов (2xCOM9M) для персонального компьютера для шины PCI.</p>"
    },
    {
      "id": 47,
      "category": "rasshiriteli-som-portov",
      "slug": "orient-xwt-ps054",
      "name": "Orient XWT-PS054",
      "price": 2650,
      "isNew": false,
      "inStock": true,
      "short": "Контроллер расширитель СОМ портов (4хСОМ9М) персонального компьютера для шины PCI.",
      "images": [
        {
          "src": "img/products/rasshiriteli-som-portov/orient-xwt-ps054-1.png",
          "w": 200,
          "h": 131
        }
      ],
      "description": "<p>Контроллер расширитель СОМ портов (4хСОМ9М) персонального компьютера для шины PCI.</p>"
    },
    {
      "id": 48,
      "category": "rasshiriteli-som-portov",
      "slug": "orient-xwt-pe2s",
      "name": "Orient XWT-PE2S",
      "price": 2050,
      "isNew": false,
      "inStock": true,
      "short": "Контроллер расширитель СОМ портов (2хСОМ9М) персонального компьютера для шины PCI-Ex1.",
      "images": [
        {
          "src": "img/products/rasshiriteli-som-portov/orient-xwt-pe2s-1.png",
          "w": 200,
          "h": 106
        }
      ],
      "description": "<p>Контроллер расширитель СОМ портов (2хСОМ9М) персонального компьютера для шины PCI-Ex1.</p>"
    },
    {
      "id": 49,
      "category": "rasshiriteli-som-portov",
      "slug": "orient-xwt-pe4s",
      "name": "Orient XWT-PE4S",
      "price": 3370,
      "isNew": false,
      "inStock": true,
      "short": "Контроллер расширитель СОМ портов (4хСОМ9М) персонального компьютера для шины PCI-Ex1.",
      "images": [
        {
          "src": "img/products/rasshiriteli-som-portov/orient-xwt-pe4s-1.png",
          "w": 200,
          "h": 283
        }
      ],
      "description": "<p>Контроллер расширитель СОМ портов (4хСОМ9М) персонального компьютера для шины PCI-Ex1.</p>"
    },
    {
      "id": 50,
      "category": "komplektatsiya-dlya-tbr",
      "slug": "perehodnik-dlya-podklyucheniya-tbr",
      "name": "Переходник для подключения ТБР",
      "price": 1320,
      "isNew": false,
      "inStock": true,
      "short": "Переходник для подключения ТБР (с версией исполнения контроллера 5 и 6) к СОМ порту персонального компьютера.",
      "images": [
        {
          "src": "img/products/komplektatsiya-dlya-tbr/perehodnik-dlya-podklyucheniya-tbr-1.png",
          "w": 200,
          "h": 194
        }
      ],
      "description": "<p>Дополнительно требуется приобрести внешний блок питания для ТБР +12 вольт.</p>"
    },
    {
      "id": 51,
      "category": "komplektatsiya-dlya-tbr",
      "slug": "blok-pitaniya-dlya-tbr",
      "name": "Блок питания для ТБР",
      "price": 4650,
      "isNew": false,
      "inStock": true,
      "short": "Внешний блок питания для подключения ТБР (с версией внутреннего контроллера 5 и 6) к СОМ порту персонального компьютера.",
      "images": [
        {
          "src": "img/products/komplektatsiya-dlya-tbr/blok-pitaniya-dlya-tbr-1.png",
          "w": 200,
          "h": 127
        }
      ],
      "description": "<p>Дополнительно требуется приобрести Переходник для подключения ТБР.</p>"
    },
    {
      "id": 55,
      "category": "komplektatsiya-dlya-tbr",
      "slug": "kabel-informatsionnyy-tbr-rs232-dlina-4m",
      "name": "Кабель информационный ТБР - RS232, длина 4м",
      "price": 7875,
      "isNew": false,
      "inStock": true,
      "short": "",
      "images": [
        {
          "src": "img/products/komplektatsiya-dlya-tbr/kabel-informatsionnyy-tbr-rs232-dlina-4m-1.jpg",
          "w": 1350,
          "h": 629
        }
      ],
      "description": ""
    },
    {
      "id": 56,
      "category": "komplektatsiya-dlya-tbr",
      "slug": "kabel-silovoy-tbr-220-volt-dlina-4m",
      "name": "Кабель силовой ТБР - 220 вольт, длина 4м",
      "price": 7875,
      "isNew": false,
      "inStock": true,
      "short": "",
      "images": [
        {
          "src": "img/products/komplektatsiya-dlya-tbr/kabel-silovoy-tbr-220-volt-dlina-4m-1.jpg",
          "w": 1350,
          "h": 629
        }
      ],
      "description": ""
    }
  ]
}
;
  if (typeof module === 'object' && module.exports) module.exports = DATA;
  else root.SNC_CATALOG = DATA;
})(typeof self !== 'undefined' ? self : this);
