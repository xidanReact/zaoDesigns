/* =========================================================
   Программное обеспечение СНК: разделы и продукты.
   Источник: www.sncard.ru/programmnoe-obespechenie (разбор 22.09.2026)
   Как обновлять: правка этого файла → node sncard/tools/generate.mjs
   ========================================================= */
(function (root) {
  const DATA =
{
  "sections": [
    {
      "slug": "avtomatizatsiya-azs",
      "title": "Автоматизация АЗС",
      "h1": "Программное обеспечение для автоматизации АЗС",
      "icon": "s-azs"
    },
    {
      "slug": "tsentralizorovannoe-upravlenie-setyu",
      "title": "Управление сетью АЗС",
      "h1": "Программное обеспечение для управления сетью АЗС",
      "icon": "s-net"
    },
    {
      "slug": "protsessing",
      "title": "Процессинг топливных карт",
      "h1": "Программное обеспечение процессинга топливных карт и карт лояльности",
      "icon": "s-proc"
    },
    {
      "slug": "avtomatizatsiya-neftebaz",
      "title": "Автоматизация нефтебаз",
      "h1": "Программное обеспечение для автоматизации нефтебаз",
      "icon": "s-neft"
    }
  ],
  "license": [
    {
      "title": "Лицензионное соглашение к программам и сервисам компании ООО «СНК»",
      "href": "https://sncard.ru/images/certifications/Licdogovor.pdf"
    },
    {
      "title": "Условия оказания информационных услуг по сопровождению программного обеспечения ООО «СНК»",
      "href": "https://sncard.ru/images/certifications/Service.pdf"
    }
  ],
  "products": [
    {
      "id": 77,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-ts-piot",
      "name": "СНК-ТС ПИоТ",
      "price": 3200,
      "inStock": true,
      "isNew": true,
      "short": "Программное обеспечение со стороны СНК-АЗС для обеспечения требований к Техническим средствам получения информации о товаре (ТС ПИоТ)",
      "images": [
        {
          "src": "img/software/snk-ts-piot/full_snc-tcpiot.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_SNC-TCPIOT.PNG"
        }
      ],
      "description": "С 28 декабря вступило в действие новое требование (согласно ППР № 515 и 303) для розничных продавцов: на кассовых зонах необходимо предусмотреть установку специализированного программного обеспечения ТС ПИоТ (Технические Средства Получения Информации о Товаре). ТС ПИоТ направлен на проверку основных критериев разрешительного режима.</p>\r\n\r\nООО СНК выполнила программную интеграцию с программным обеспечением ТС ПИот от компании АО \"ЕСП\" (https://ao-esp.ru/)</p>\r\n\r\n<p><strong>Основные критерии проверки разрешительным режимом:</strong></p>\r\n<ul>\r\n<li>Отсутствие в системе маркировки «Честный знак» информации о коде маркировки на товаре;</li>\r\n<li>Отсутствие информации о нанесении кода маркировки на товар, а также о вводе в оборот;</li>\r\n<li>Наличие информации, что товар с таким кодом маркировки ранее уже был выведен из оборота;</li>\r\n<li>Истечение срока годности товара;</li>\r\n<li>Товар заблокирован по решению органа государственной власти;</li>\r\n<li>Некорректный результат проверки криптографической подписи (кода проверки);</li></p>\r\n\r\n Для выполнения требований необходимо приобрести программное обеспечение от компании АО \"ЕСП\" или другого производителя, зарегистрированный в Реестре технических средств получения информации о товаре (ТС ПИоТ) и лицензию от ООО СНК \"СНК-ТС ПИоТ\".</p>\r\n \r\n <p> <style=\"text-align: justify;\"><strong>Скачать Инструкцию по настройке СНК-АЗС для подключения ТС ПИоТ <a href=\"https://www.sncard.ru/images/files/SNC_AZS/Manual_SNC-AZS_TC_PioT.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a></p>\r\n <p><strong>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></strong></p>"
    },
    {
      "id": 78,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-upk",
      "name": "СНК-УПК",
      "price": 100,
      "inStock": true,
      "isNew": true,
      "short": "Программный модуль в составе СНК-АЗС, позволяет оплатить покупку через Универсальный Платежный Код (УПК).",
      "images": [
        {
          "src": "img/software/snk-upk/full_snc-upc.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_SNC-UPC.png"
        }
      ],
      "description": "<p> С 1 сентября 2026 года, в СНК-АЗС (с версии 1.77.16) у покупателей появилась возможность оплатить покупку цифровым рублем (ЦР) через считывание на банковском терминале универсального платежного кода (УПК) в форме QR. </p>\r\n<p> Обязанность обеспечить возможность операций с цифровыми рублями ложится на крупнейшие банки и крупные торговые компании (с выручкой свыше 120 млн рублей за предыдущий год). Позже подключатся другие категории. ЦР - это третья форма российской национальной валюты. Наряду с наличными (банкноты и монеты) и безналичными деньгами (средства на счетах в банках) он будет существовать параллельно. Выпускает его Банк России. По сути, это тот же рубль, только в цифровом виде: уникальный цифровой код, который хранится в «цифровом кошельке» на специальной платформе Банка России. При этом 1 цифровой рубль всегда равен 1 наличному или 1 безналичному рублю — никакой курсовой разницы нет.</p>\r\n<p>В версии СНК-АЗС 1.77.14 выполнена программная интеграция с программным обеспечением Сбербанка. В последующих релизах будет реализована интеграция с ГПБ и Райффайзен банком. Дополнительных настроек в СНК-АЗС нет. Для подключения банковского терминала используйте соответствующую инструкцию.</p>\r\n\r\n<p><strong>Как это работает:</strong></p>\r\n<ul>\r\n<li>Вы открываете цифровой кошелёк (счёт цифрового рубля) через мобильное приложение любого банка, который подключён к платформе Банка России. При считывании УПК, в мобильном приложении вашего банка вам должны предложить варианты способа оплаты, в т.ч. ЦР.</li>\r\n</ul>\r\n \r\n<p><p span><strong>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></strong>"
    },
    {
      "id": 1,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-azs-programma-dlya-avtomatizatsii-azs",
      "name": "СНК-АЗС. Программа для автоматизации АЗС.",
      "price": 89700,
      "inStock": true,
      "isNew": false,
      "short": "Программа СНК-АЗС. Управление технологическими процессами приема-отпуска топлива на АЗС и АЗК, магазин, склад, услуги.",
      "images": [
        {
          "src": "img/software/snk-azs-programma-dlya-avtomatizatsii-azs/full_sncazsview.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_SncAzsView.jpg"
        }
      ],
      "description": "<p><strong>СНК-АЗС</strong> - это программа для автоматизации технологии приема-отпуска топлива, учета движения товаров народного потребления и услуг на АЗС и АЗК. Программное обеспечение зарегистрировано в <a href=\"https://www.sncard.ru/images/certifications/Registration_SNC_AZS_Rospatent.PNG\" target=\"_blank\" rel=\"noopener\">Роспатент России</a>, сертифицировано на применение в <a href=\"https://www.sncard.ru/company#certs\" target=\"_blank\" rel=\"noopener\">Российской федерации и зоне Таможенного союза.</a></p>\r\n\r\n<p><a href=\"https://www.sncard.ru/images/files/azs/SncAzsView.JPG\" target=\"_blank\" rel=\"noopener\"><img src=\"{{root}}img/software/snk-azs-programma-dlya-avtomatizatsii-azs/in-sncazsview.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SncAzsView.jpg\" alt=\"SncAzsView\" loading=\"lazy\" decoding=\"async\"></a></p>\r\n\r\n\r\n<p><strong>Программа СНК-АЗС выполняет следующие функции:</strong></p>\r\n<ul>\r\n<li>автоматический учет отпущенного и принятого объема топлива в литрах и килограммах, в книжных и фактических остатках;</li>\r\n<li>учет топлива в килограммах по фактической плотности в момент продаж или по средней плотности;</li>\r\n<li>отпуск топлива \"по объему\", \"на сумму\", \"до полного бака\";</li>\r\n<li>отпуск топлива и товара по видам оплат: НАЛИЧНЫЕ, БАНКОВСКИЕ КАРТЫ, ДИСКОНТНЫЕ КАРТЫ, ТОПЛИВНЫЕ КАРТЫ, ЭЛ. ВЕДОМОСТИ, ТАЛОНЫ;</li>\r\n<li>продажа топлива и товара в корзине с регистрацией на ККТ одним чеком;</li>\r\n<li>индикация состояния ТРК;</li>\r\n<li>округление заказа до целого значения вверх, вниз или фиксация суммы заказа;</li>\r\n<li>поддержка одновременной работы разнотипных ТРК, систем измерения уровня, фискальных регистраторов и т.п.;</li>\r\n<li>протоколирование всех действий оператора и событий системы;</li>\r\n<li>генерация сменных отчетов по смене и за период смен;</li>\r\n<li>экспорт отчетов в форматы Word, Excel, txt, XML для дальнейшей обработки;</li>\r\n<li>печать чека продажи до отпуска топлива (предоплата), после отпуска (постоплата);</li>\r\n<li>поддержка терминала самообслуживания (Терминал Безналичных Расчетов) по топливным картам собственного производства;</li>\r\n<li>работа в автономном режиме (ВЕДОМСТВЕННАЯ АЗС), отпуск топлива по топливным картам  через терминала самообслуживания (Терминал Безналичных Расчетов);</li>\r\n<li>поддержка обслуживания по топливным картам через оператора АЗС;</li>\r\n<li>автоматизация складского учета товаров и взаиморасчетов с контрагентами;</li>\r\n<li>продажа весового и составного товара;</li>\r\n<li>продажа и автоматический учет нефтепродуктов через ТРК;</li>\r\n</ul>\r\n<p><strong>Программа СНК-АЗС работает с топливораздаточными колонками:</strong></p>\r\n<ul>\r\n<li>ТРК серии НАРА и все другие с импульсным протоколом управления;</li>\r\n<li>ТРК серий НАРА, СЕВЕР и все другие с интерфейсным управлением (RS485, протокол 2.0);</li>\r\n<li><a href=\"https://www.sncard.ru/?view=article&id=136:podklyuchenie-trk-livna&catid=2\" target=\"_blank\" rel=\"noopener\">ТРК ЛИВЕНКА (с отсчетными устройствами КУП1...19);</a></li>\r\n<li><a href=\"https://www.sncard.ru/?view=article&id=143:podklyuchenie-trk-pk-elektroniks&catid=2\" target=\"_blank\" rel=\"noopener\">ТРК Альфа, Гамма, Бэтта от компании ПК-Электроникс (г. Новосибирск);</a></li>\r\n<li><a href=\"https://www.sncard.ru/?view=article&id=137:podklyuchenie-trk-adast&catid=2\" target=\"_blank\" rel=\"noopener\">ТРК Adast;</a></li>\r\n<li>ТРК ШЕЛЬФ;</li>\r\n<li><a href=\"https://www.sncard.ru/?view=article&id=147:podklyuchenie-trk-topaz&catid=2\" target=\"_blank\" rel=\"noopener\">ТРК ТОПАЗ и отсчетными устройствами Топаз;</a></li>\r\n<li><a href=\"https://www.sncard.ru/?view=article&id=188:podklyuchenie-trk-tatsuno&catid=2\" target=\"_blank\" rel=\"noopener\">ТРК Татсуно С-БЕНЧ;</a></li>\r\n<li><a href=\"https://www.sncard.ru/?view=article&id=138:podklyuchenie-trk-dresser-wayne&catid=2\" target=\"_blank\" rel=\"noopener\">ТРК DRESSER WAYNE;</a></li>\r\n<li><a href=\"https://www.sncard.ru/?view=article&id=148:podklyuchenie-trk-gilbarco&catid=2\" target=\"_blank\" rel=\"noopener\">ТРК Gilbarco;</a></li>\r\n<li><a href=\"https://www.sncard.ru/?view=article&id=158:podklyuchenie-trk-censtar&catid=2\" target=\"_blank\" rel=\"noopener\">ТРК CENSTAR;</a></li>\r\n<li>ТРК LangFen;</li>\r\n<li>ТРК и ГНК от компани FAS (с электроникой Топаз);</li>\r\n<li>ГНК от компании ТИМ;</li>\r\n<li>ТРК серии ПЕТРО от компании ШТРИХ-М;</li>\r\n<li>ТРК Scheidt & Bachmann;</li>\r\n<li>ТРК IronSystems (Айрон-Системс г. Барнаул);</li>\r\n<li><a href=\"https://www.sncard.ru/?view=article&id=149:podklyuchenie-trk-tokheim&catid=2\" target=\"_blank\" rel=\"noopener\">ТРК Tokheim;</a></li>\r\n<li>ТРК HongYang;</li>\r\n<li><a href=\"https://www.sncard.ru/?view=article&id=159:podklyuchenie-gnk-tekhnoproekt&catid=2\" target=\"_blank\" rel=\"noopener\">ГНК УЗСГ-01 (компания Технопроект)</a></li>\r\n<li><a href=\"https://www.sncard.ru/?view=article&id=225:podklyuchenie-unsg-01-vesy-ot-kompanii-tekhnoproekt&catid=2:uncategorised\" target=\"_blank\" rel=\"noopener\">УНСГ-01 - установка для заправки газовых баллонов (компания Технопроект)</a></li>\r\n<li>Электрическими зарядными станциями для электротранспорта производителя Корпорация ПСС г. Пермь;</li>\r\n<li>Электрическими зарядными станциями для электротранспорта производителя ChargeLink г. Томск;</li>\r\n</ul>\r\n<p><strong><strong>Программа СНК-АЗС работает c</strong> фискальными регистраторами:</strong></p>\r\n<ul>\r\n<li>серия Штрих;</li>\r\n<li>серия Прим;</li>\r\n<li>серия Атол;</li>\r\n<li>серия ViKi.</li>\r\n</ul>\r\n<p><strong><strong>Программа СНК-АЗС работает c</strong> уровнемерами:</strong></p>\r\n<ul>\r\n<li>ПМП-118, ПМП-201 (компания <a href=\"http://www.nppsensor.ru/\" target=\"_blank\" rel=\"noopener\">СЕНСОР</a>);</li>\r\n<li>Струна-М (компания <a href=\"http://www.novinteh.ru\" target=\"_blank\" rel=\"noopener\">Новинтех</a>);</li>\r\n<li>Игла (<a href=\"http://www.igla.info\" target=\"_blank\" rel=\"noopener\">компания ИИТ</a>);</li>\r\n<li>Veeder Root (производитель Gilbarco, поставщики <a href=\"https://www.azsk74.ru\" target=\"_blank\" rel=\"noopener\">АЗС Комплект</a>, <a href=\"http://neftprod.ru\" target=\"_blank\" rel=\"noopener\">НефтепродуктТехника</a>, <a href=\"https://vengo-trade.ru/company/\" target=\"_blank\" rel=\"noopener\">Vengo</a>), INCON, COLIBRI;</li>\r\n<li>PetroVend (<a href=\"http://www.opwglobal.com/opw-fms\" target=\"_blank\" rel=\"noopener\">производитель OPW</a>, поставщик <a href=\"http://azs.com.ru/urovnemeryi/sitesentinel/?_openstat=ZGlyZWN0LnlhbmRleC5ydTs4OTkwMzUzOzQxODc4Njg5NDt5YW5kZXgucnU6cHJlbWl1bQ&yclid=4108974024150241091\" target=\"_blank\" rel=\"noopener\">Лимтекс</a>) </li>\r\n</ul>\r\n<p><strong><strong>Программа СНК-АЗС работает терминалами банковского эквайринга:</strong></strong></p>\r\n<ul>\r\n<li>Сбербанк  (Инструкцию по настройке можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/SettingSB2.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>)</li>\r\n<li>любого другого банка, терминалы которого поддерживают технологию <a href=\"http://ingenico.ru/solu-3-reshenie_ARCUS2.html\" target=\"_blank\" rel=\"noopener\">Arcus 2 CAP</a>  (Инструкцию по настройке можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/SettingArcus.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>)</li>\r\n<li>Платежные терминалы от компании <a href=\"https://www.inpas.ru\" target=\"_blank\" rel=\"noopener\">INPAS</a>  (Инструкцию по настройке можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/inpas.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>)</li>\r\n<li>UCS </li>\r\n<li>Системой быстрых платежей (СБП) банков Открытие, Райффайзенбанк, Газпромбанк, Альфа Банк.  (Инструкцию по настройке можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/qps.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>)</li>\r\n</ul>\r\n<p><strong>Программа СНК-АЗС работает с терминалами эмитентов топливных карт:</strong></p>\r\n<ul>\r\n<li>Сибнефтекарт (СНК)</li>\r\n<li>Magic6000, 6100, Sagem (Петрол Плюс)</li>\r\n<li>Е-100 и многие другие</li>\r\n</ul>\r\n<p><strong>Программа СНК-АЗС работает с терминалами самообслуживания:</b><br /></strong></p>\r\n<ul>\r\n<li>ТБР (терминал безналичных расчетов Сибнефтекарт)</li>\r\n<li>Express POS (Петрол Плюс)</li>\r\n<li>АТП \"ПРИМ\"</li>\r\n<li><a href=\"https://init-plus.com\" target=\"_blank\" rel=\"noopener\">ТСО от компании \"ИНИТ\"</a></li>\r\n<li><a href=\"http://miniazs.com\" target=\"_blank\" rel=\"noopener\">ТСО от компании \"СКОН\"</a></li>\r\n</ul>\r\n<p><b>В СНК-АЗС интегрированы технологии приема карт сторонних эмитентов и сервисы:</b></p>\r\n<ul>\r\n<li>Топливные и дисконтные карты Петрол Плюс;</li>\r\n<li>Карты  лояльности Город скидок;</li>\r\n<li>Карты лояльности Золотая середина;</li>\r\n<li>Карты лояльности LSPoint;</li>\r\n<li>Карты лояльности Региональная сберегательная карта;</li>\r\n<li>Карты лояльности Эдис;</li>\r\n<li>Карты лояльности Малина;</li>\r\n<li>Карты лояльности Копилка  (инструкция по настройке  можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/SettingKopilka.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>);</li>\r\n<li>Карты Сбербанка по программе  СПАСИБО;</li>\r\n<li><a href=\"https://benzuber.ru\" target=\"_blank\" rel=\"noopener\">Сервис самообслуживания через мобильное приложение Бензубер</a> (инструкция по настройке СНК-АЗС можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/ProgramSetupSNC_AZS-Benzuber.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>);</li>\r\n<li>Сервис самообслуживания через мобильное приложение <a href=\"https://zapravki.yandex.ru/\" target=\"_blank\" rel=\"noopener\">Яндекс.Заправка</a> (инструкция по настройке СНК-АЗС можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/Settingsyandex.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>);</li>\r\n<li>Сервис самообслуживания через мобильное приложение <a href=\"https://fuelup.ru/\" target=\"_blank\" rel=\"noopener\">FuelUp</a> (инструкция по настройке СНК-АЗС можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/Settingsfuelup.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>);</li>\r\n</li>\r\n<li>Сервис самообслуживания через мобильное приложение <a href=\"http://e100online.ru/\" target=\"_blank\" rel=\"noopener\">Е-100</a> (инструкция по настройке СНК-АЗС можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/SettingsE100.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>);</li>\r\n</li>\r\n<li>Сервис самообслуживания через мобильное приложение <a href=\"https://monopoly.online/\" target=\"_blank\" rel=\"noopener\">Монополия-Онлайн</a> (инструкция по настройке СНК-АЗС можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/SettingsMonopoliy.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>);</li>\r\n</li>\r\n<li>Сервис самообслуживания через мобильное приложение <a href=\"https://sb-oem.ru/\" target=\"_blank\" rel=\"noopener\">Топливное решение от СБ (ОЕ-Медиа)</a> (инструкция по настройке СНК-АЗС можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/SettingOEmedia.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>);</li>\r\n</li>\r\n<li>Сервис самообслуживания через мобильное приложение <a href=\"https://www.azs-topline.ru/\" target=\"_blank\" rel=\"noopener\">Сети АЗС \"Топлайн\"</a> (инструкция по настройке СНК-АЗС можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/SettingsTopline.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>);</li>\r\n</li>\r\n<li>Сервис самообслуживания через мобильное приложение <a href=\"https://sibgazset.ru/\" target=\"_blank\" rel=\"noopener\">Сети АЗС \"GazPro\"</a> (инструкция по настройке СНК-АЗС можно скачать <a href=\"https://www.sncard.ru/images/files/SNC_AZS/GasPro.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>);</li>\r\n</ul>\r\n<p><strong>Обмен данными с вышестоящими управляющими системами:</strong></p>\r\n<p>в регламентном обмене с СНК-ПЦ передаются  (последовательность действий <a href=\"https://www.sncard.ru/images/files/SNC_AZS/TransferDataToOC.pdf\" target=\"_blank\" rel=\"noopener\">здесь</a>):</p>\r\n<ul>\r\n<li>\r\n<ul>\r\n<li>список запретов на карты;</li>\r\n<li>цены для предприятий;</li>\r\n<li>продажи по картам;</li>\r\n<li>платежи для ведомственных заправок;</li>\r\n</ul>\r\n</li>\r\n</ul>\r\n<p>в регламентном обмене с СНК-Офис передаются:</p>\r\n<ul>\r\n<li>\r\n<ul>\r\n<li>тарифные планы скидок;</li>\r\n<li>тарифные планы начисления и списания бонусов;</li>\r\n<li>статусные схемы расчета дисконтным скидок;</li>\r\n<li>справочники ТНП, контрагентов и цен;</li>\r\n<li>сменные отчеты, протоколы событий, транзакции продаж.</li>\r\n</ul>\r\n</li>\r\n</ul>\r\n<p><strong>Система цен и скидок на топливо, товары и услуги позволяет строить различные схемы лояльности:</strong></p>\r\n<ul>\r\n<li>абсолютные или процентные скидки по индивидуальному тарифному плану для каждого типа топлива;</li>\r\n<li>скидки по результатам прошедшего периода;</li>\r\n<li>бесплатный литр;</li>\r\n<li>статусные скидки;</li>\r\n<li>подарочные схемы.</li>\r\n</ul>\r\n<p><strong>Отличительные особенности СНК-АЗС:</strong></p>\r\n<p>Многослойность архитектуры по схеме front и back-office на базе реляционной СУБД через фреймверк ODBC (Open Database Connectivity) обеспечивает высокий уровень надежности, управляемости и безопасности и подпадает по GPL лицензию свободно распространяемых СУБД, например MariaBD, MySQL, PostgreSQL.</p>\r\n<p>Масштабируемость — клиент-серверная архитектура, легкое подключение новых рабочих мест (оператора, менеджера).</p>\r\n<p>Открытость — обмен информацией с другими автоматизированными системами:</p>\r\n<ul>\r\n<li>Petrol+ (компания «НКТ», г. Москва);</li>\r\n<li>1С:Бухгалтерия (компания «1С», г. Москва);</li>\r\n<li>«Сибинтек АЗС».</li>\r\n</ul>\r\n<p>Многоэмитентность — совместно с собственной системой безналичных расчетов СНК-АЗС поддерживает системы сторонних эмитентов:</p>\r\n<ul>\r\n<li>PetrolPlus расчетные и дисконтные карты;</li>\r\n<li>дисконтные карты Золотая середина;</li>\r\n<li>дисконтные карты Малина.</li>\r\n</ul>\r\n<p>Надежность — использование транзакционной архитектуры работы с на базе реляционной СУБД через фреймверк ODBC (Open Database Connectivity), протоколирование транзакций с возможностью восстановления итоговых данных, разделенность сервера и клиентских приложений.</p>\r\n<p>Безопасность — использование электронной подписи транзакций, защищенные смарт-карты, использование современных сертифицированных криптографических средств, использование мощных средств предотвращения несанкционированного доступа</p>\r\n<p>Дружественность — возможность обслуживания по топливным картам в режиме самообслуживания через терминалы СНК-ТБР уличного исполнения, (голосовое сопровождение диалога), гибкая настройка видеограмм и отчетов, гарантийное и постгарантийное сопровождение.</p>\r\n\r\n<p><strong><a href=\"https://www.sncard.ru/images/files/presentation/Presentation%20SNC-AZS.rar\" target=\"_blank\" rel=\"noopener\">Скачать презентацию пакета СНК-АЗС</a><br /></strong></p>\r\n<p><strong><a href=\"http://cloud.sncard.ru/download/demo/demo_azs/\" target=\"_blank\" rel=\"noopener\">Скачать Демо-версию пакета СНК-АЗС</a><br /></strong></p>\r\n<p><a href=\"http://cloud.sncard.ru/snc-azs/files/\" target=\"_blank\" rel=\"noopener\"><strong>Скачать последнее обновление СНК-АЗС</strong></a></p>\r\n<p><a href=\"http://cloud.sncard.ru/files/?v=files/595b4ed101c6e\" target=\"_blank\" rel=\"noopener\"><strong>Скачать последнее обновление отчетов СНК-АЗС</strong></a></p>\r\n<p><a href=\"https://www.sncard.ru/images/files/azs/Doc/AZS/AnketaForSNC_AZS.doc\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить анкету для заказа СНК-АЗС</strong></a></p>\r\n<p><strong>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></strong></p>"
    },
    {
      "id": 76,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-kso",
      "name": "СНК-КСО",
      "price": 85800,
      "inStock": true,
      "isNew": true,
      "short": "СНК-КСО - касса самообслуживания клиента без участия оператора АЗС.",
      "images": [
        {
          "src": "img/software/snk-kso/full___ybor________2.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full___ybor________2.png"
        },
        {
          "src": "img/software/snk-kso/full___obro_pojalovat.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full___obro_pojalovat.png"
        },
        {
          "src": "img/software/snk-kso/full___orzina.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full___orzina.png"
        }
      ],
      "description": "СНК-КСО - программное обеспечение для кассы самообслуживания на АЗС. Позволяет оформить покупку топлива и товаров без участия оператора АЗС. К расчету принимаются OnLine/OffLine топливные, дисконтные, бонусные карты СНК. \r\nВстроенное программное обеспечение кастомизации интерфейса позволяет через графический интерфейс применить цветовые решения Заказчика, использовать свою символику и рекламный материал. СНК-КСО работает под управлением СНК-АЗС.\r\n \r\n \r\n\r\n\r\n<p><a href=\"https://www.sncard.ru/images/files/SNC_KCO/SNK_SSR_Operation.pdf\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить Руководство оператора СНК-КСО</strong></a></p>\r\n<p><a href=\"https://www.sncard.ru/images/files/SNC_KCO/SNK_SSR_Setup.pdf\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить Руководство администратора по настройке СНК-КСО</strong></a></p>\r\n<p><a href=\"https://www.sncard.ru/images/files/SNC_KCO/SNK_SSR_Interface_setup.pdf\" target=\"_blank\" rel=\"noopener\"><strong>Загрузить Руководство администратора по кастомизации интерфейса СНК-КСО</strong></a></p>\r\n\r\n\r\n<p><strong>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></strong></p>"
    },
    {
      "id": 2,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-mf-programmnyy-modul-obsluzhivaniya-kart-snk",
      "name": "СНК-МФ. Программный модуль обслуживания карт СНК.",
      "price": 8855,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Обеспечивает работу с бесконтактными топливными, дисконтными и бонусными картами.",
      "images": [
        {
          "src": "img/software/snk-mf-programmnyy-modul-obsluzhivaniya-kart-snk/full_toplivnue-kartu.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_toplivnue-kartu.jpg"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Обеспечивает работу с бесконтактными топливными, дисконтными и бонусными картами."
    },
    {
      "id": 3,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-ks-programma-obmena-dannymi-dlya-snk-azs",
      "name": "СНК-КС. Программа обмена данными для СНК-АЗС.",
      "price": 10626,
      "inStock": true,
      "isNew": false,
      "short": "Программа для СНК-АЗС. Программа СНК-Коммуникационный сервер, для защищенного обмена данными между зарегистрированными абонентами в сети программных продуктов СНК.",
      "images": [
        {
          "src": "img/software/snk-ks-programma-obmena-dannymi-dlya-snk-azs/full_photo_2023-02-16_16-47-531.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_photo_2023-02-16_16-47-531.jpg"
        }
      ],
      "description": "<h1>Программное обеспечение для передачи корпоративных данных</h1>\r\n<p><strong>СНК - КС</strong> - программное обеспечение Коммуникационный сервер, предназначено для организации оперативного обмена данными между зарегистрированными абонентами по защищенным канал приема-передачи. В качестве абонентов могут выступать Процессинговые центры, Региональные офисы, Точки обслуживания и другие программные комплексы.</p>\r\n<p><img src=\"{{root}}img/software/snk-ks/in-snckcview_full.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SncKCView_full.jpg\" alt=\"SncKCView full\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p>Структура построения сети передачи информации при помощи СНК - КС представлена на рисунке ниже.</p>\r\n<p><img src=\"{{root}}img/software/snk-ks/in-siovsnk.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SiovSNK.JPG\" alt=\"SiovSNK\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><strong>Используемые каналы передачи:</strong></p>\r\n<ul>\r\n<li>локальная сеть;</li>\r\n<li>сеть Internet;</li>\r\n<li>телефонная сеть или GPRS/CDMA.</li>\r\n</ul>\r\n<p>Каждый из перечисленных каналов также может быть неоднократно продублирован.</p>\r\n<p><strong>Способы передачи информации:</strong></p>\r\n<ul>\r\n<li>по электронной почте;</li>\r\n<li>прямому модемному соединению;</li>\r\n<li>по протоколу TCP/IP.</li>\r\n</ul>\r\n<p>Обмен информацией независим от каналов передачи. Возможна транзитная передача данных внутри коммуникационной сети. Одни и те же данные могут отправляться сразу нескольким абонентам. Использование механизмов шифрования и электронной подписи, позволяет осуществлять транспортировку по открытым каналам, например, в глобальной сети Internet.</p>\r\n<p>Скачать руководство по эксплуатации для <a href=\"https://www.sncard.ru/images/files/azs/Doc/AZS/SNK_KC20.rar\" target=\"_blank\" rel=\"noopener\">версии 2.0</a></p>\r\n<p>Скачать руководство по эксплуатации для <a href=\"https://www.sncard.ru/images/files/azs/Doc/AZS/ManualOperatorSNC-KC.pdf\" target=\"_blank\" rel=\"noopener\">версии 3.х</a></p>"
    },
    {
      "id": 4,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-mko-programmnyy-modul-ucheta-dvizheniya",
      "name": "СНК-МКО. Программный модуль учета движения наличных средств в СНК-АЗС.",
      "price": 12810,
      "inStock": true,
      "isNew": false,
      "short": "Программа для СНК-АЗС. Модуль управления кассовыми операциями движения наличных денежных средств на АЗС/АЗК.",
      "images": [
        {
          "src": "img/software/snk-mko-programmnyy-modul-ucheta-dvizheniya/full_tovar_v_kassu.webp",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_tovar_v_kassu.webp"
        }
      ],
      "description": "<h1>Программа учета кассовых операций для обособленных подразделений нефтепродуктообеспечения</h1>\r\n<p><strong>СНК - МКО</strong> предназначен для автоматизированного учета операций с наличными денежными средствами на АЗС и АЗК в соответствии с положением предприятия нефтепродуктообеспечения о порядке ведения кассовых операций обособленными подразделениями.</p>\r\n<p><strong>СНК - МКО</strong> формирует печатные и электронные формы бухгалтерской отчетности КО-1 (Приходный кассовый ордер), КО-2 (расходный кассовый ордер), КО-3 (Журнал учета ордеров) и КО-4 (Кассовая книга) на основании данных о реализации системы управления <a href=\"https://www.sncard.ru/programmnoe-obespechenie?view=article&id=18:snk-azs-sistema-upravleniya-dlya-azs-i-azk&catid=2\" target=\"_blank\" rel=\"noopener\">СНК-АЗС</a> (автоматическое формирование документов) и любых других СУ (ручное формирование документов).</p>\r\n<p><strong>СНК - МКО состоит из следующих программных модулей:</strong></p>\r\n<ul>\r\n<li>конвертор данных из СУ <a href=\"https://www.sncard.ru/programmnoe-obespechenie?view=article&id=18:snk-azs-sistema-upravleniya-dlya-azs-i-azk&catid=2\" target=\"_blank\" rel=\"noopener\">СНК-АЗС</a>;</li>\r\n<li>рабочее место кассира – операциониста.</li>\r\n</ul>\r\n<p><img src=\"{{root}}img/software/snk-mso/in-sncmco1.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/sncmco1.jpg\" alt=\"\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><img src=\"{{root}}img/software/snk-mko-programmnyy-modul-ucheta-dvizheniya/in-sncmco2.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/sncmco2.jpg\" alt=\"\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><strong>Функции пакета СНК-МКО</strong></p>\r\n<p>Руководство оператора СНК-МКО <a href=\"https://www.sncard.ru/images/files/azs/Doc/AZS/ManualOperatorSNC-MKO.pdf\" target=\"_blank\" rel=\"noopener\">скачать</a></p>\r\n<p>Руководство администратора СНК-МКО <a href=\"https://www.sncard.ru/images/files/azs/Doc/AZS/ManualAdminSNC-MKO.pdf\" target=\"_blank\" rel=\"noopener\">скачать</a></p>\r\n<p>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></p>"
    },
    {
      "id": 5,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-virtualnyy-terminal",
      "name": "СНК-Виртуальный терминал.",
      "price": 62100,
      "inStock": true,
      "isNew": false,
      "short": "Интеграционное программное обеспечение для обслуживания клиентов по картам СНК (топливные, дисконтные и бонусные) на ТСО от компании ИНИТ, СКОН и других производителей через API.",
      "images": [
        {
          "src": "img/software/snk-virtualnyy-terminal/full_png-transparent-virtual-terminal-feature-phone-computer-terminal-credit-card-merchant-services-credit-card-gadget-electronics-computer1.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_png-transparent-virtual-terminal-feature-phone-computer-terminal-credit-card-merchant-services-credit-card-gadget-electronics-computer1.png"
        }
      ],
      "description": "Интеграционное программное обеспечение для обслуживания клиентов по картам СНК (топливные, дисконтные и бонусные) на ТСО от компании ИНИТ, СКОН и других производителей через API."
    },
    {
      "id": 6,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-yandeks-zapravka",
      "name": "СНК-Яндекс.Заправка",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Поддержка сервиса \"Яндекс.Заправка\" - заправка с помощью приложения для смартфона",
      "images": [
        {
          "src": "img/software/snk-yandeks-zapravka/full_910344_600.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_910344_600.jpg"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Поддержка сервиса \"Яндекс.Заправка\" - заправка с помощью приложения для смартфона"
    },
    {
      "id": 7,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-fuelup",
      "name": "СНК-FuelUp",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Поддержка сервиса \"FUELUP\" - заправка с помощью приложения для смартфона",
      "images": [
        {
          "src": "img/software/snk-fuelup/full_i.webp",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_i.webp"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Поддержка сервиса \"FUELUP\" - заправка с помощью приложения для смартфона"
    },
    {
      "id": 8,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-benzuber",
      "name": "СНК-Бензубер",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Поддержка сервиса \"BENZUBER\" - заправка с помощью приложения для смартфона",
      "images": [
        {
          "src": "img/software/snk-benzuber/full_799425_normal.webp",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_799425_normal.webp"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Поддержка сервиса \"BENZUBER\" - заправка с помощью приложения для смартфона"
    },
    {
      "id": 9,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-smart-zapravka",
      "name": "СНК-Смарт Заправка",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Поддержка сервиса \"Смарт Заправка\" - заправка с помощью приложения для смартфона",
      "images": [
        {
          "src": "img/software/snk-smart-zapravka/full_unnamed.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_unnamed.jpg"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Поддержка сервиса \"Смарт Заправка\" - заправка с помощью приложения для смартфона"
    },
    {
      "id": 10,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-toplivnoe-reshenie",
      "name": "СНК-Топливное решение",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Поддержка обслуживания карт \"Дальнобойщик\" (партнерская программа СБ \"Топливное решение\", эмитент ОЕ-Медиа) через банковский терминал СБ.",
      "images": [
        {
          "src": "img/software/snk-toplivnoe-reshenie/full_83fb6f867c3f3537c54663bed3.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_83fb6f867c3f3537c54663bed3.png"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Поддержка обслуживания карт \"Дальнобойщик\" (партнерская программа СБ \"Топливное решение\", эмитент ОЕ-Медиа) через банковский терминал СБ."
    },
    {
      "id": 11,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-e-taksi",
      "name": "СНК-Ё-такси",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Поддержка обслуживания штрих кодовых карт для процессинговой компании ООО \"Бизнес софт\".",
      "images": [
        {
          "src": "img/software/snk-e-taksi/full_8f2ea94ab81ef902e9ae4b67d549639c.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_8f2ea94ab81ef902e9ae4b67d549639c.png"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Поддержка обслуживания штрих кодовых карт для процессинговой компании ООО \"Бизнес софт\"."
    },
    {
      "id": 12,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-sbp",
      "name": "СНК-СБП",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Поддержка расчетов по системе СБП через QR код (вывод QR кода на отдельный монитор/устройство, отображение корзины продажи/рекламной информации)",
      "images": [
        {
          "src": "img/software/snk-sbp/full_9661_31f6ccd6a1ff9790461bc94837803934.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_9661_31f6ccd6a1ff9790461bc94837803934.jpg"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Поддержка расчетов по системе СБП через QR код (вывод QR кода на отдельный монитор/устройство, отображение корзины продажи/рекламной информации)"
    },
    {
      "id": 58,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-mso",
      "name": "СНК-МСО",
      "price": 1,
      "inStock": true,
      "isNew": false,
      "short": "Программа для СНК-АЗС. Модуль сервисного обслуживания. Централизованное администрирование ПК с программным обеспечением СНК-АЗС.",
      "images": [
        {
          "src": "img/software/snk-mso/full_snc_mco.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_SNC_MCO.jpg"
        }
      ],
      "description": "<h1>Подсистема управления ТО</h1>\r\n<p><strong>СНК - МСО</strong> – дополнительный программный модуль для <a href=\"https://www.sncard.ru/programmnoe-obespechenie?view=article&id=19:snk-ofis-programmnyj-kompleks-dlya-upravleniya-setyu-azs&catid=2\" target=\"_blank\" rel=\"noopener\">СНК–Офис</a>, позволяет с помощью механизма адаптивных команд администрировать удаленный персональный компьютер с установленным программным комплексом СНК-АЗС. </p>\r\n<p><img src=\"{{root}}img/software/snk-mso/in-snc_mco.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SNC_MCO.JPG\" alt=\"SNC MCO\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><strong>С помощью СНК - МСО на удаленном ПК возможно выполнять следующие действия:</strong></p>\r\n<ul>\r\n<li>получать оперативные данные о реализации и остатках в СНК-АЗС с установленной периодичностью</li>\r\n<li>производить удаленное выполнение скриптов и получать результат</li>\r\n<li>производить обновление программного обеспечения</li>\r\n<li>производить удаленное конфигурирование точки обслуживания</li>\r\n<li>производить прием и передачу необходимых файлов</li>\r\n<li>производить выполнение скриптов по расписанию</li>\r\n<li>производить прием и исполнение запросов на оповещение оператора точки обслуживания</li>\r\n</ul>\r\n<p><strong>Для работы СНК-МСО необходима установка следующих компонентов:</strong></p>\r\n<ul>\r\n<li><a href=\"https://www.sncard.ru/programmnoe-obespechenie?view=article&id=22:snk-ks-podsistema-garantirovannoj-peredachi-korporativnykh-dannykh&catid=2\" target=\"_blank\" rel=\"noopener\">СНК – КС</a>;</li>\r\n<li>исполняемая среда .NET Frimework 4.0.</li>\r\n</ul>\r\n<p><img src=\"{{root}}img/software/snk-mso/in-sncmco1.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/sncmco1.jpg\" alt=\"sncmco1\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></p>"
    },
    {
      "id": 59,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-monopoliya-onlayn",
      "name": "СНК-Монополия.Онлайн",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Поддержка сервиса \"Монополия.Онлайн\" - заправка с помощью приложения для смартфона",
      "images": [
        {
          "src": "img/software/snk-monopoliya-onlayn/full_monopoliy.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_Monopoliy.png"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Поддержка сервиса \"Монополия.Онлайн\" - заправка с помощью приложения для смартфона"
    },
    {
      "id": 60,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-toplivnye-karty-svoy-club",
      "name": "СНК-Топливные карты Svoy.Club",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Поддержка обслуживания топливных карт эмитента Svoy.Club.",
      "images": [
        {
          "src": "img/software/snk-toplivnye-karty-svoy-club/full_svoyclub.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_SvoyClub.png"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Поддержка обслуживания топливных карт эмитента Svoy.Club."
    },
    {
      "id": 62,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-upravlenie-personalnymi-dannymi",
      "name": "СНК-Управление персональными данными",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Дополнительная функция для СНК-АЗС. Позволяет оператору АЗС самостоятельно ввести персональные данные клиента, выпустить виртуальную карту лояльности.",
      "images": [
        {
          "src": "img/software/snk-upravlenie-personalnymi-dannymi/full_virtualcard.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_VirtualCard.jpg"
        }
      ],
      "description": "При наличии на ключе СНК-АЗС лицензии \"СНК-Управление персональными данными\", оепратору АЗС становится доступны следующие операции с картами лояльности клиента:\r\n• Выпустить виртуальную карту лояльности, обслуживание по которой в дальнейшем возможно через ввод оператором АЗС зарегистрированного номера сотового телефона;\r\n• Выдавать карты лояльности, предварительно зарегистрированные в СНК-ПЦ и переданные на АЗС для передачи конечному клиенту;\r\n• Для карт лояльности, обслуживание которых приостановлено из-за отсутствия обязательных реквизитов (клиент не воспользовался личным кабинетом), на АЗС, через оператора клиент может сообщить недостающие регистрационные данные и продолжить пользоваться картой.\r\n\r\nВся введенная оператором информация передается и сохраняются в «СНК-ПЦ» незамедлительно.\r\n\r\nТребования к СНК-АЗС и СНК-ПЦ:\r\n• Версия ПО «СНК-АЗС» должна быть не ниже 1.74.22.\r\n• Ввод персональных данных применяется к картам, работающим в режиме онлайн.\r\n• На стороне «СНК-ПЦ» должна быть настроена и запущена в работу с СМС-шлюзом служба «СНК-Диспетчер запросов»."
    },
    {
      "id": 71,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-e1-card",
      "name": "СНК-E1 CARD",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Обслуживание топливных карт \"E1 CARD\" через мобильное приложение для смартфона.",
      "images": [
        {
          "src": "img/software/snk-e1-card/full_e1card.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_E1Card.PNG"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Обслуживание топливных карт \"E1 CARD\" через мобильное приложение для смартфона."
    },
    {
      "id": 73,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-metanika",
      "name": "СНК-Метаника",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-АЗС. Поддержка сервиса обслуживания топливных карт \"Метаника\" - заправка с помощью приложения для смартфона",
      "images": [
        {
          "src": "img/software/snk-metanika/full_logo_methanica.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_Logo_methanica.PNG"
        }
      ],
      "description": "Программный модуль для СНК-АЗС. Поддержка сервиса обслуживания топливных карт \"Метаника\" - заправка с помощью приложения для смартфона"
    },
    {
      "id": 75,
      "section": "avtomatizatsiya-azs",
      "slug": "snk-onlayn-kupony-i-sertifikaty",
      "name": "СНК-Онлайн купоны и сертификаты",
      "price": 5750,
      "inStock": true,
      "isNew": false,
      "short": "СНК-Онлайн купоны и сертификаты - программный модуль для чтения и обработки купонов и сертификатов в составе СНК-АЗС.",
      "images": [],
      "description": "СНК-Онлайн купоны и сертификаты - программный модуль для чтения и обработки купонов и сертификатов в составе СНК-АЗС."
    },
    {
      "id": 13,
      "section": "avtomatizatsiya-neftebaz",
      "slug": "snk-asn-programma-avtomatizatsii-dlya-neftebaz",
      "name": "СНК-АСН. Программа автоматизации для нефтебаз.",
      "price": 114700,
      "inStock": true,
      "isNew": false,
      "short": "Программа для нефтебаз. Управление технологическими процессами приема-отпуска топлива на нефтебазе.",
      "images": [
        {
          "src": "img/software/snk-asn-programma-avtomatizatsii-dlya-neftebaz/full_snc-asn_view_w.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_SNC-ASN_view_w.jpg"
        }
      ],
      "description": "<h1>Программно-аппаратный комплекс для нефтебаз</h1>\r\n<p><strong>СНК - АСН</strong> - это программно-аппаратный комплекс для управления наливом на нефтебазах через АСН.</p>\r\n<p><img src=\"{{root}}img/software/snk-asn-programma-avtomatizatsii-dlya-neftebaz/in-snc-asn_view_w.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SNC-ASN_view_w.JPG\" alt=\"SNC ASN\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><strong> </strong></p>\r\n<p><b><i>Базовая поставка СНК-АСН включает следующие основные функции:</i></b></p>\r\n<ul>\r\n<li>Отпуск топлива через <b>все типы АСН </b><b>без ограничения</b> их количества;</li>\r\n<li>Разрешением на отпуск топлива является <i>НАКЛАДНАЯ</i>.</li>\r\n<li>Настраиваемые два режима работы:\r\n<ul>\r\n<li><strong>Ручной</strong>. Ввод накладной  выполняется оператором СНК-АСН;</li>\r\n<li><strong>Автоматический</strong>. Накладная на отпуск топлива поступает в СНК-АСН электронном виде. Итог отпуска по конкретной накладной выгружается в электронный вид. Формат электронной <i>накладной</i> предоставляется.</li>\r\n</ul>\r\n</li>\r\n</ul>\r\n<ul>\r\n<li>Применение режима работы СНК-АСН <strong><i>АВТОМАТИЧЕСКИЙ</i> </strong>позволяет реализовать интегрирование СНК-АСН в выше стоящую систему управления нефтебазы (например, 1С);</li>\r\n<li>Поддержка режима дополнительного отпуска к заданному объему  по накладной;</li>\r\n<li>Поддержка вариантов закрытия итогов отпуска по накладной:\r\n<ul>\r\n<li>по фактическим показаниям АСН;</li>\r\n<li>по начальным данным накладной;</li>\r\n<li>с учетом дополнительного отпуска.</li>\r\n</ul>\r\n</li>\r\n<li>Формирование накладной по форме ТТН-1, ТОРГ-12;</li>\r\n<li>Поддержка основных типов уровнемеров: <b>Струна, Гамма (УИП 9602), ПМП, Игла, Ve</b><b>ede</b><b>r</b><b>Root, СЕНС, Petrovend</b>;</li>\r\n</ul>\r\n<p>Система управления СНК-АСН работает под управлением операционной системы Windows XP Pro, Windows 7,8. Для хранения данных использует базу данных MySQL.</p>\r\n<p>Руководство оператора СНК-АСН <a href=\"https://www.sncard.ru/images/files/SNC_ASN/ManualOperatorSNC-ASN.pdf\" target=\"_blank\" rel=\"noopener\">скачать</a></p>\r\n<p><a href=\"http://cloud.sncard.ru/snc-asn/files/\" target=\"_blank\" rel=\"noopener\">Скачать последнее обновление СНК-АСН</a></p>\r\n<p><a href=\"https://www.sncard.ru/images/files/presentation/Presentation%20SNC-ASN.rar\" target=\"_blank\" rel=\"noopener\">Скачать презентацию пакета СНК-АСН</a></p>\r\n<p><a href=\"http://cloud.sncard.ru/files/\" target=\"_blank\" rel=\"noopener\">Скачать последнее обновление отчетов СНК-АСН</a></p>\r\n<p><a href=\"http://cloud.sncard.ru/download/demo/demo_asn\" target=\"_blank\" rel=\"noopener\">Скачать демо версию СНК-АСН</a></p>\r\n<p>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></p>"
    },
    {
      "id": 72,
      "section": "avtomatizatsiya-neftebaz",
      "slug": "snk-ks-dlya-snk-asn-programma-dlya-obmena-dannymi",
      "name": "СНК-КС для СНК-АСН. Программа для обмена данными.",
      "price": 17500,
      "inStock": true,
      "isNew": false,
      "short": "Программа для СНК-АСН. Программа СНК-Коммуникационный сервер, для обмена данными между СНК-АСН и СНК-Офис.",
      "images": [],
      "description": "<h1>Программное обеспечение для передачи корпоративных данных</h1>\r\n<p><strong>СНК - КС</strong> - программное обеспечение Коммуникационный сервер, предназначено для организации оперативного обмена данными между зарегистрированными абонентами по защищенным канал приема-передачи. В качестве абонентов могут выступать Процессинговые центры, Региональные офисы, Точки обслуживания и другие программные комплексы.</p>\r\n<p><img src=\"{{root}}img/software/snk-ks/in-snckcview_full.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SncKCView_full.jpg\" alt=\"SncKCView full\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p>Структура построения сети передачи информации при помощи СНК - КС представлена на рисунке ниже.</p>\r\n<p><img src=\"{{root}}img/software/snk-ks/in-siovsnk.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SiovSNK.JPG\" alt=\"SiovSNK\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><strong>Используемые каналы передачи:</strong></p>\r\n<ul>\r\n<li>локальная сеть;</li>\r\n<li>сеть Internet;</li>\r\n<li>телефонная сеть или GPRS/CDMA.</li>\r\n</ul>\r\n<p>Каждый из перечисленных каналов также может быть неоднократно продублирован.</p>\r\n<p><strong>Способы передачи информации:</strong></p>\r\n<ul>\r\n<li>по электронной почте;</li>\r\n<li>прямому модемному соединению;</li>\r\n<li>по протоколу TCP/IP.</li>\r\n</ul>\r\n<p>Обмен информацией независим от каналов передачи. Возможна транзитная передача данных внутри коммуникационной сети. Одни и те же данные могут отправляться сразу нескольким абонентам. Использование механизмов шифрования и электронной подписи, позволяет осуществлять транспортировку по открытым каналам, например, в глобальной сети Internet.</p>\r\n<p>Скачать руководство по эксплуатации для <a href=\"https://www.sncard.ru/images/files/azs/Doc/AZS/SNK_KC20.rar\" target=\"_blank\" rel=\"noopener\">версии 2.0</a></p>\r\n<p>Скачать руководство по эксплуатации для <a href=\"https://www.sncard.ru/images/files/azs/Doc/AZS/ManualOperatorSNC-KC.pdf\" target=\"_blank\" rel=\"noopener\">версии 3.х</a></p>"
    },
    {
      "id": 17,
      "section": "protsessing",
      "slug": "snk-pts-rdp",
      "name": "СНК-ПЦ (RDP)",
      "price": 307000,
      "inStock": true,
      "isNew": false,
      "short": "Процессинговый центр. Пакет программ для обеспечения процессинга по топливным, бонусным и дисконтным картам Сибнефтекарт.",
      "images": [
        {
          "src": "img/software/snk-pts-rdp/full_snc_pc_view.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_SNC_PC_View.jpg"
        }
      ],
      "description": "<p><strong>СНК-ПЦ - Процессинговой Центр</strong> - пакет программ для обеспечения процессинга по топливным, бонусным, дисконтным картам, талонам, электронной ведомости и купонам от компании Сибнефтекарт.</p>\r\n<p><img src=\"{{root}}img/software/snk-pts-rdp/in-snc_pc_view.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SNC_PC_View.jpg\" alt=\"SNC PC View\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><strong>СНК-ПЦ</strong> выполняет следующие задачи:</p>\r\n<p>1. Сопровождение договоров с контрагентами:</p>\r\n<ul>\r\n<li>покупателями – владельцами карт;</li>\r\n<li>продавцами – владельцами точек обслуживания;</li>\r\n<li>другими (транзитными) процессинговыми центрами;</li>\r\n<li>центральной Процессинговой Компанией, объединяющей несколько ПЦ и являющейся единым плательщиком;</li>\r\n<li>владельцами карт  лояльности;</li>\r\n<li>агентами процессингово центра;</li>\r\n<li>концернами, являющиеся едиными плательщиками за обьединение покупателей;</li>\r\n<li>все контрагенты связаны друг с другом счетами, в каждом из которых один из контрагентов является покупателем, а другой – продавцом.</li>\r\n<li>кроме оплаты за товары контрагенты могут предоставлять друг - другу свои услуги, связанные с расчетами и оплачиваемые через комиссию;</li>\r\n</ul>\r\n<p>2. Ведение счетов по договорам с контрагентами</p>\r\n<p>3. Подготовка и выпуск карт</p>\r\n<p>4. Сбор информации с точек обслуживания о совершенных продажах по картам</p>\r\n<p>5. Формирование для точек обслуживания «черного» и «серого» списков запретов на обслуживание карт</p>\r\n<p>6. Формирование полного перечня технологической и бухгалтерской документации для контрагентов</p>\r\n<p>7. Формирование оперативной отчетности</p>\r\n<p>8. Обеспечение широкого набора возможностей по предоставлению лояльности контрагентам</p>\r\n<p><strong>СНК-ПЦ</strong>  взаимодействует со следующими программными модулями:</p>\r\n<ul>\r\n<li>СНК-КС - программа Коммуникационного Сервера, обеспечивающая гарантированный обмен данными с точкой обслуживания;</li>\r\n<li>СНК-TMS - программа Terminal Manager System, обеспечивающая управление автономными терминалами СНК-S380;</li>\r\n<li>СНК-УС - программа централизованного Управления Скидками по  дисконтными и бонусными картам СНК;</li>\r\n<li>СНК-OnLine - программа для обслуживания топливных и бонусных карт в режиме реального времени.</li>\r\n</ul>\r\n<p><a href=\"http://cloud.sncard.ru/snc-pc/files/\" target=\"_blank\" rel=\"noopener\">Скачать последнее обновление СНК-ПЦ</a></p>\r\n<p>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></p>"
    },
    {
      "id": 18,
      "section": "protsessing",
      "slug": "snk-ks",
      "name": "СНК-КС",
      "price": 17500,
      "inStock": true,
      "isNew": false,
      "short": "Программа для СНК-ПЦ. Программа для защищенного обмена данными между СНК-ПЦ и СНК-АЗС",
      "images": [
        {
          "src": "img/software/snk-ks/full_photo_2023-02-16_16-47-53.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_photo_2023-02-16_16-47-53.jpg"
        }
      ],
      "description": "<p><strong>СНК - КС</strong> - программное обеспечение Коммуникационный сервер, предназначено для организации оперативного обмена данными между зарегистрированными абонентами по защищенным канал приема-передачи. В качестве абонентов могут выступать Процессинговые центры, Региональные офисы, Точки обслуживания и другие программные комплексы.</p>\r\n<p><img src=\"{{root}}img/software/snk-ks/in-snckcview_full.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SncKCView_full.jpg\" alt=\"SncKCView full\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p>Структура построения сети передачи информации при помощи СНК - КС представлена на рисунке ниже.</p>\r\n<p><img src=\"{{root}}img/software/snk-ks/in-siovsnk.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SiovSNK.JPG\" alt=\"SiovSNK\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><strong>Используемые каналы передачи:</strong></p>\r\n<ul>\r\n<li>локальная сеть;</li>\r\n<li>сеть Internet;</li>\r\n<li>телефонная сеть или GPRS/CDMA.</li>\r\n</ul>\r\n<p>Каждый из перечисленных каналов также может быть неоднократно продублирован.</p>\r\n<p><strong>Способы передачи информации:</strong></p>\r\n<ul>\r\n<li>по электронной почте;</li>\r\n<li>прямому модемному соединению;</li>\r\n<li>по протоколу TCP/IP.</li>\r\n</ul>\r\n<p>Обмен информацией независим от каналов передачи. Возможна транзитная передача данных внутри коммуникационной сети. Одни и те же данные могут отправляться сразу нескольким абонентам. Использование механизмов шифрования и электронной подписи, позволяет осуществлять транспортировку по открытым каналам, например, в глобальной сети Internet.</p>\r\n<p>Скачать руководство по эксплуатации для <a href=\"https://www.sncard.ru/images/files/azs/Doc/AZS/SNK_KC20.rar\" target=\"_blank\" rel=\"noopener\">версии 2.0</a></p>\r\n<p>Скачать руководство по эксплуатации для <a href=\"https://www.sncard.ru/images/files/azs/Doc/AZS/ManualOperatorSNC-KC.pdf\" target=\"_blank\" rel=\"noopener\">версии 3.х</a></p>"
    },
    {
      "id": 19,
      "section": "protsessing",
      "slug": "snk-us-rdp",
      "name": "СНК-УС (RDP)",
      "price": 118335,
      "inStock": true,
      "isNew": false,
      "short": "Программа централизованного управления скидками, предоставляемые в СНК-АЗС по всем типам расчета.",
      "images": [
        {
          "src": "img/software/snk-us-rdp/full_viewyc_full.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_ViewYC_Full.jpg"
        }
      ],
      "description": "<p><strong>СНК-УС</strong> - пакет программ централизованного управления скидками, предоставляемыми по картам на Точках обслуживания через систему управления <a href=\"https://www.sncard.ru/azs-menu-product\" target=\"_blank\" rel=\"noopener\">СНК-АЗС</a>\r\nи автономные терминалы СНК-POS.</p>\r\n<p><img src=\"{{root}}img/software/snk-us-rdp/in-viewyc_full.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/ViewYC_Full.jpg\" alt=\"ViewYC Full\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p>Взаимодействия СНК – УС с другими программными продуктами линейки СНК показаны на рисунке ниже.</p>\r\n<p><img src=\"{{root}}img/software/snk-us-rdp/in-snc_ys1.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SNC_YS1.JPG\" alt=\"SNC YS1\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p>В <strong>СНК - УС</strong> реализованы несколько шаблонов программ скидок, показанные на рисунке. Шаблоны программ скидок постоянно дополняются.</p>\r\n<p><img src=\"{{root}}img/software/snk-us-rdp/in-snc_ys2.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SNC_YS2.JPG\" alt=\"SNC YS2\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><a href=\"https://www.sncard.ru/images/files/presentation/Presentation%20SNC-YS.rar\" target=\"_blank\" rel=\"noopener\">Скачать презентацию пакета СНК-УС</a></p>\r\n<p><a href=\"http://cloud.sncard.ru/snc-dm/files/\" target=\"_blank\" rel=\"noopener\">Скачать последнее обновление СНК-УС</a></p>\r\n<p>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></p>"
    },
    {
      "id": 20,
      "section": "protsessing",
      "slug": "snk-lk",
      "name": "СНК-ЛК",
      "price": 86095,
      "inStock": true,
      "isNew": false,
      "short": "Личный кабинет. Информационно-управляющий WEB сервис для контрагента СНК-ПЦ.",
      "images": [
        {
          "src": "img/software/snk-lk/full_snclkkontragent_full.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_SncLkKontragent_full.png"
        }
      ],
      "description": "<p><strong>СНК - ЛК </strong>информационный сервис контрагента <a href=\"https://www.sncard.ru/azs-menu-product-192\" target=\"_blank\" rel=\"noopener\">СНК-АЗС</a> на корпоративном сайте компании. Сервис предназначен для контроля остатка средств и получения информации о покупках и услугах, совершенные на точках обслуживания. С помощью данного сервиса клиенты и партнеры компании могут осуществлять гибкое управление набором информационных услуг.</p>\r\n<p><strong>СНК - ЛК предоставляет следующие возможности:</strong></p>\r\n<ul>\r\n<li>пополнять остатки кошельков карт через механизм распределения платежей</li>\r\n<li>изменять реквизиты карт:\r\n<ul>\r\n<li>лимиты</li>\r\n<li>разрешенные к отпуску типы топлив</li>\r\n<li>срок действия карт</li>\r\n</ul>\r\n</li>\r\n<li>контроллировать остатки средств на счете </li>\r\n<li>получать оперативную информацию о совершенных покупках</li>\r\n<li>получать пакет  документов (протокол заправок, счет фактура, накладная) предварительной отчетности</li>\r\n<li>получать информационные оповещения подписного характера</li>\r\n<li>управлять личными настройками</li>\r\n</ul>\r\n<p><img src=\"{{root}}img/software/snk-lk/in-snclkkontragent_full.png\" data-remote=\"https://www.sncard.ru/images/files/SNC_LK/SncLkKontragent_full.png\" alt=\"SncLKView full\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><strong>Сервис СНК - ЛК состоит из следующих подсистем:</strong></p>\r\n<ul>\r\n<li>подсистема централизованного хранения данных;</li>\r\n<li>HTTP сервер;</li>\r\n<li>сервер информационного обслуживания;</li>\r\n<li>модуль синхронизации;</li>\r\n<li>база данных процессинговой компании.</li>\r\n</ul>\r\n<p><strong>Подсистема хранения данных</strong> предоставляет сервисы хранения, управления и многопользовательского доступа к единому источнику данных. Данная подсистема обеспечивает надежность сохраненных данных и санкционированный доступ к ним.</p>\r\n<p><strong>HTTP-сервер</strong> дает возможность клиентам получить доступ к данным не только с помощью специализированных программ, но и посредством протокола HTTP, что позволяет пользователю «Личного кабинета» осуществлять просмотр и управление через любой WEB-браузер и на любом компьютере, подключенном к сети Internet.</p>\r\n<p><strong>Сервер информационного обслуживания</strong> обеспечивает выполнение различного рода задач сервиса, которые являются достаточно трудоемкими по времени и требовательны к ресурсам или имеют некоторые условия выполнения, например по времени или установленным порогам каких либо параметров.</p>\r\n<p><strong>Модуль синхронизации</strong> обеспечивает синхронизацию данных между центральным хранилищем и другими источниками данных, одним из которых и является база данных процессингового центра.</p>\r\n<p><strong>База данных процессинговой компании</strong> является основным источником данных. Через механизм синхронизации данные из нее попадают в центральное хранилище сервиса и становятся доступными для просмотра.<br /> </p>\r\n<p><a href=\"https://www.sncard.ru/images/files/presentation/Presentation%20SNC-LK.rar\" target=\"_blank\" rel=\"noopener\">Скачать презентацию пакета СНК-ЛК</a></p>\r\n<p>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></p>"
    },
    {
      "id": 74,
      "section": "protsessing",
      "slug": "snk-onlayn-kupony-i-sertifikaty",
      "name": "СНК-Онлайн Купоны и сертификаты",
      "price": 28750,
      "inStock": true,
      "isNew": false,
      "short": "СНК-Онлайн Купоны и сертификаты, программное обеспечение для генерации купонов и сертификатов.",
      "images": [],
      "description": "СНК-Онлайн Купоны и сертификаты это дополнительный функционал в СНК-ПЦ, позволяющий выпускать купоны и сертификаты для избранных покупателей или групп карт лояльности. Подробнее о купонах можно прочитать в Руководстве оператора СНК-ПЦ, раздел 37.5.2"
    },
    {
      "id": 14,
      "section": "tsentralizorovannoe-upravlenie-setyu",
      "slug": "snk-ofis-rdp",
      "name": "СНК-Офис (RDP)",
      "price": 166635,
      "inStock": true,
      "isNew": false,
      "short": "Программа для централизованного технологического управления сетью АЗС/АГЗС и АЗК. Единый справочник товаров, интеграция с 1С.",
      "images": [
        {
          "src": "img/software/snk-ofis-rdp/full_cnk-office_full.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_CNK-Office_full.jpg"
        }
      ],
      "description": "<p><strong>СНК - Офис</strong> - программа централизованного управления сетью АЗС и АЗК. <strong>СНК-Офис</strong> обеспечивает сбор информации с АЗС\\АЗК, формирование консолидированной технологической, бухгалтерской и статистической отчетности, централизованное ведение справочников товаров и контрагентов.</p>\r\n<p><img src=\"{{root}}img/software/snk-ofis-rdp/in-cnk-office_full.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/CNK-Office_full.jpg\" alt=\"CNK Office\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><strong>Функции:</strong></p>\r\n<ul>\r\n<li>сбор данных от систем \r\n\r\n<a href=\"https://www.sncard.ru/azs-menu-product\" target=\"_blank\" rel=\"noopener\">СНК-АЗС</a>\r\n\r\n с использованием коммуникационного сервера через локальную сеть, сеть Internet, телефонную сеть или GPRS/CDMA;</li>\r\n<li>накопление и обработка данных с использованием СУБД MySQL;</li>\r\n<li>формирование и передача на АЗС справочников товаров и контрагентов;</li>\r\n<li>формирование различных документов (протоколов, накопительных ведомостей, сменных отчетов);</li>\r\n<li>организация обмена данными с вышестоящими системами (1С, S-Market, КАС Бизнес Люкс).</li>\r\n</ul>\r\n<p>Пакет программ СНК-Офис является связующим звеном между корпоративной системой управления предприятием и автоматизированными системами управления технологическими процессами.</p>\r\n<p><strong>Архитектуру пакета программ СНК - Офис составляют следующие подсистемы:</strong></p>\r\n<ul>\r\n<li>генератор документов;</li>\r\n<li>подсистема ведения и согласования справочников;</li>\r\n<li>подсистема хранения данных;</li>\r\n<li>подсистема обработки протоколов;</li>\r\n<li>коммуникационный сервер.</li>\r\n</ul>\r\n<p>За основу выходного формата для документов взят формат книги MS Excel из пакета Microsoft Office. Выбор был продиктован широким распространением данного формата в межотраслевых каналах обмена документами. В то же время исключается процесс обучения персонала, который в большинстве случаев знаком с данным форматом. Наравне с форматом от Microsoft используется формат книги OpenOffice.org Calc, бесплатного офисного пакета, набирающего всё большую популярность. Реализованная подсистема генерации отчетных документов представляет собой отдельный модуль. Ядро подсистемы поддерживает различные источники данных (Oracle, MySQL, ODBC, файлы и т. д.).</p>\r\n<p>Руководство оператора СНК-Офис <a href=\"https://www.sncard.ru/images/files/SNC_OFFICE/ManualSNC-Office.pdf\" target=\"_blank\" rel=\"noopener\">скачать</a></p>\r\n<p><a href=\"https://www.sncard.ru/images/files/presentation/Presentation%20SNC-Office.rar\" target=\"_blank\" rel=\"noopener\">Скачать презентацию пакета СНК-Офис</a></p>\r\n<p><a href=\"http://cloud.sncard.ru/snc-office/files/\" target=\"_blank\" rel=\"noopener\">Скачать последнее обновление СНК-Офис</a></p>\r\n<p><a href=\"http://cloud.sncard.ru/files/?v=files/595b56c7bb168\" target=\"_blank\" rel=\"noopener\">Скачать последнее обновление отчетов СНК-Офис</a></p>\r\n<p>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></p>"
    },
    {
      "id": 15,
      "section": "tsentralizorovannoe-upravlenie-setyu",
      "slug": "snk-ks-dlya-snk-pts-i-snk-ofis",
      "name": "СНК-КС для СНК-ПЦ и СНК-Офис",
      "price": 17500,
      "inStock": true,
      "isNew": false,
      "short": "Программа для СНК-Офис. Программа для защищенного обмена данными между СНК-Офис и СНК-АЗС",
      "images": [],
      "description": "<h1>Программное обеспечение для передачи корпоративных данных</h1>\r\n<p><strong>СНК - КС</strong> - программное обеспечение Коммуникационный сервер, предназначено для организации оперативного обмена данными между зарегистрированными абонентами по защищенным канал приема-передачи. В качестве абонентов могут выступать Процессинговые центры, Региональные офисы, Точки обслуживания и другие программные комплексы.</p>\r\n<p><img src=\"{{root}}img/software/snk-ks/in-snckcview_full.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SncKCView_full.jpg\" alt=\"SncKCView full\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p>Структура построения сети передачи информации при помощи СНК - КС представлена на рисунке ниже.</p>\r\n<p><img src=\"{{root}}img/software/snk-ks/in-siovsnk.jpg\" data-remote=\"https://www.sncard.ru/images/pgrams-images/SiovSNK.JPG\" alt=\"SiovSNK\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><strong>Используемые каналы передачи:</strong></p>\r\n<ul>\r\n<li>локальная сеть;</li>\r\n<li>сеть Internet;</li>\r\n<li>телефонная сеть или GPRS/CDMA.</li>\r\n</ul>\r\n<p>Каждый из перечисленных каналов также может быть неоднократно продублирован.</p>\r\n<p><strong>Способы передачи информации:</strong></p>\r\n<ul>\r\n<li>по электронной почте;</li>\r\n<li>прямому модемному соединению;</li>\r\n<li>по протоколу TCP/IP.</li>\r\n</ul>\r\n<p>Обмен информацией независим от каналов передачи. Возможна транзитная передача данных внутри коммуникационной сети. Одни и те же данные могут отправляться сразу нескольким абонентам. Использование механизмов шифрования и электронной подписи, позволяет осуществлять транспортировку по открытым каналам, например, в глобальной сети Internet.</p>\r\n<p>Скачать руководство по эксплуатации для <a href=\"https://www.sncard.ru/images/files/azs/Doc/AZS/SNK_KC20.rar\" target=\"_blank\" rel=\"noopener\">версии 2.0</a></p>\r\n<p>Скачать руководство по эксплуатации для <a href=\"https://www.sncard.ru/images/files/azs/Doc/AZS/ManualOperatorSNC-KC.pdf\" target=\"_blank\" rel=\"noopener\">версии 3.х</a></p>"
    },
    {
      "id": 16,
      "section": "tsentralizorovannoe-upravlenie-setyu",
      "slug": "snk-web-ofis",
      "name": "СНК-Web-Офис",
      "price": 90560,
      "inStock": true,
      "isNew": false,
      "short": "Web приложение для владельцев сетей АЗС, дающее доступ к информации по своим АЗС через стандартный Web браузер.",
      "images": [
        {
          "src": "img/software/snk-web-ofis/full_rezerv.png",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_Rezerv.png"
        }
      ],
      "description": "<h1>Программа для владельцев АЗС</h1>\r\n<p><strong>СНК-WEB-Офис</strong> - это программный продукт, позволяющий получить доступ к базе данных СНК-Офис через стандартный Web интерфейс с помощью любого браузера.  </p>\r\n<p>Продукт рассчитан на владельцев сетей АЗС. С помощью интуитивно понятного интерфейса, зарегистрированному пользователю, предоставляется информация</p>\r\n<p>о движении и остатках топлива в резервуарах по выбранной АЗС и смене:</p>\r\n<p><img src=\"{{root}}img/software/snk-web-ofis/in-rezerv.png\" data-remote=\"https://www.sncard.ru/images/files/SNC_Web_Office/Rezerv.png\" alt=\"Rezerv\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p>Движении топлива по сортам:</p>\r\n<p><img src=\"{{root}}img/software/snk-web-ofis/in-sort.png\" data-remote=\"https://www.sncard.ru/images/files/SNC_Web_Office/Sort.png\" alt=\"Sort\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p>Движении по ТНП:</p>\r\n<p><img src=\"{{root}}img/software/snk-web-ofis/in-tnp.png\" data-remote=\"https://www.sncard.ru/images/files/SNC_Web_Office/TNP.png\" alt=\"TNP\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p>Реализации нефтепродукта по типам оплаты:</p>\r\n<p><img src=\"{{root}}img/software/snk-web-ofis/in-np.png\" data-remote=\"https://www.sncard.ru/images/files/SNC_Web_Office/NP.png\" alt=\"NP\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p>И блок аналитики, включающий динамику реализации нефтепродуктов за выбранный период:</p>\r\n<p><img src=\"{{root}}img/software/snk-web-ofis/in-analitic.png\" data-remote=\"https://www.sncard.ru/images/files/SNC_Web_Office/Analitic.png\" alt=\"Analitic\" loading=\"lazy\" decoding=\"async\"></p>\r\n<p><a href=\"https://www.sncard.ru/images/files/presentation/Presentation%20SNC-Web-Office.rar\" target=\"_blank\" rel=\"noopener\">Скачать презентацию пакета СНК-Web-Офис</a></p>\r\n<p>Перейти в раздел <a href=\"https://www.sncard.ru/dokumentatsiya#apps\" target=\"_blank\" rel=\"noopener\">Документация</a></p>"
    },
    {
      "id": 61,
      "section": "tsentralizorovannoe-upravlenie-setyu",
      "slug": "snk-upravlenie-tsennikami",
      "name": "СНК-Управление ценниками",
      "price": 84000,
      "inStock": true,
      "isNew": false,
      "short": "Программный модуль для СНК-Офис. Централизованное управление (создание) шаблонов ценников для СНК-АЗС.",
      "images": [
        {
          "src": "img/software/snk-upravlenie-tsennikami/full_snc_uc.jpg",
          "url": "https://www.sncard.ru/components/com_jshopping/files/img_products/full_Snc_uc.jpg"
        }
      ],
      "description": "Программное обеспечение СНК-Управление ценниками (СНК-УЦ) предназначено для самостоятельного создания шаблонов ценников из набора доступных обьектов, с последующей отправкой в СНК-АЗС на точку обслуживания. СНК-УЦ состоит из двух программных плагинов:\r\n- плагин, встраиваемый в СНК-Офис, позволяет создавать и редактировать ценники. Для его работы, на ключ с лицензией СНК-Офис, требуется лицензия дополнительная лицензия СНУ-УЦ.\r\n- плагин, встраиваемый в Бэк СНК-АЗС, позволяет напечатать, созданные в плагине СНК-УЦ в СНК-Офис ценники. Дополнительной лицензии не требуется.\r\n\r\n</p>\r\n<p><a href=\"http://cloud.sncard.ru/files/?v=files/595b4ed101c6e\" target=\"_blank\" rel=\"noopener\"><strong>Скачать руководство по использованию программного обеспечения СНК-Управление ценниками </strong></a></p>"
    }
  ]
};

  if (typeof module === 'object' && module.exports) module.exports = DATA;
  else root.SNC_DATA = Object.assign(root.SNC_DATA || {}, { software: DATA });
}(typeof window !== 'undefined' ? window : globalThis));
