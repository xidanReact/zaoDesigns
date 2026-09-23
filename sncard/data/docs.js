/* =========================================================
   Документация: руководства, инструкции и обновления ПО СНК.
   Источник: www.sncard.ru/dokumentatsiya (разбор 22.09.2026)
   Как обновлять: правка этого файла → node sncard/tools/generate.mjs. Файлы не скачиваем — ссылки ведут на sncard.ru
   ========================================================= */
(function (root) {
  const DATA =
[
  {
    "title": "СНК-ПЦ - процессинговый центр топливных, дисконтных и бонусных карт",
    "slug": "snk-pts-protsessingovyy-tsentr",
    "items": [
      {
        "title": "СНК-ПЦ Руководство Пользователя",
        "href": "https://www.sncard.ru/images/files/SNC_PC/ManualOperatorSNC-PC.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "СНК-ПЦ Руководство по работе с картами Пользователя",
        "href": "https://www.sncard.ru/images/files/SNC_PC/ManualReaderCardSNC-PC.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "СНК-ПЦ Руководство Администратора СНК-ПЦ",
        "href": "https://www.sncard.ru/images/files/SNC_PC/ManualManagerSNC-PC.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Загрузить последнее обновление СНК-ПЦ",
        "href": "http://cloud.sncard.ru/files/",
        "type": "link",
        "article": null
      },
      {
        "title": "Описание загрузки/выгрузки данных из/в СНК-ПЦ, DBF формат",
        "href": "https://www.sncard.ru/images/files/SNC_PC/DescriptionDataSNC-PC_to_DBF.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Минимальные технические требования к персональному компьютеру",
        "href": "https://www.sncard.ru/images/files/SNC_PC/TechnicalRequirementsToPKSNC_PC.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Настройка репликации БД",
        "href": "https://www.sncard.ru/images/files/SNC_OFFICE/ReplicaSettings_PC_Office.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по установке виртуальных (программных) лицензий",
        "href": "https://www.sncard.ru/images/files/SNC_PC/Manual_Virtual_Lic.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-HTTP - сервер обработки HTTP запросов",
    "slug": "snk-http-server-obrabotki-http-zaprosov",
    "items": [
      {
        "title": "Руководство по установке СНК-HTTP службы запросов",
        "href": "https://www.sncard.ru/images/files/SNC_HTTP/Manual_Install_SNC_HTTP.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-АЗС - программа для АЗС/АЗК/АГЗС",
    "slug": "snk-azs-programma-dlya-azs-azk-agzs",
    "items": [
      {
        "title": "Скачать презентацию СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/presentation/Presentation%20SNC-AZS.rar",
        "type": "rar",
        "article": null
      },
      {
        "title": "Демо-версия пакета СНК-АЗС",
        "href": "http://cloud.sncard.ru/download/demo/demo_azs/",
        "type": "link",
        "article": null
      },
      {
        "title": "Скачать последнее обновление СНК-АЗС",
        "href": "http://cloud.sncard.ru/files/",
        "type": "link",
        "article": null
      },
      {
        "title": "Скачать последнее обновление отчетов СНК-АЗС",
        "href": "http://cloud.sncard.ru/files/",
        "type": "link",
        "article": null
      },
      {
        "title": "Минимальные технические требования к персональному компьютеру",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/TechnicalRequirementsToPK.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Опросный лист для внедрения СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/AnketaForSNC_AZS.doc",
        "type": "doc",
        "article": null
      },
      {
        "title": "Руководство по установке и эксплуатации СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualSNC_AZS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство оператора СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualOperatorSNC-AZS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство менеджера СНК-АЗС (Бэк СНК-АЗС)",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualManagerSNC-AZS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Модуль расширения. Управление складом в СНК-АЗС (приложение \"СНК-Управление товарами\")",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualManagerTNP.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство оператора по настройке и использованию панели быстрых товаров в СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualQuickPanelTnpSNC-AZS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке Витрины продаж в СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualSalesShowcase.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по администрированию СНК-АЗС (приложение Управление конфигурацией)",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualAdminSNC-AZS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке дополнительного рабочего места оператора/менеджера СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualSNC-AZSconnectTwoPlace.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция менеджера СНК-АЗС по передаче данных в операционный центр",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/TransferDataToOC.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Сервер оборудования СНК. Настройка основного и дополнительных рабочих мест",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/equipment_server_workplaces.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "СНК-Управление ценниками. Руководство администратора и пользователя",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/Manual_SNC_YC.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке управления электронными чеками в СНК-АЗС и СНК-ПЦ",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualElectronChek.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по обновлению программного обеспечения СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/InstUpdateSNC-AZS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке сети эмитентов",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualSettihgSetiSNC-AZS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Технологии учета движения топлива в резервуарах",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/FuelMovTankSNC-AZS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "СНК-Управление персональными данными в СНК-АЗС. Руководство пользователя",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/Control_Person_Data_SNK-AZS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Описание командной строки для реализации автоматической загрузки-выгрузки данных из/в БЭК СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/CommandLineSNC_AZS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке подключения к ПЦ Копилка",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingKopilka.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "Работа с базой данных",
    "slug": "rabota-s-bazoy-dannyh",
    "items": [
      {
        "title": "Руководство по инсталляции СУБД MySQL",
        "href": "https://www.sncard.ru/images/files/MySQL/ManualInstallMySql.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по инсталляции СУБД MariaDB",
        "href": "https://www.sncard.ru/images/files/MariaDB/ManualInstallMariaDB.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по Восстановлению таблиц MariaDB вер2-1",
        "href": "https://www.sncard.ru/images/files/MariaDB/ManualRestoreMariaDB.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Рекомендации по настройке дополнительных механизмов резервного копирования и восстановления данных Фронт СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ArcAndRecoverData.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "Банковские и расчетные терминалы. Оплата через СБП",
    "slug": "bankovskie-i-raschetnye-terminaly",
    "items": [
      {
        "title": "Инструкция по настройке подключения любого банковского терминала, работающего по протоколу Arcus 2 CAP от компании Инженико",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingArcus.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по подключению терминалов ИНПАС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/inpas.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке подключения банковского терминала от Альфа банк",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingAlfa.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке подключения банковского терминала от Сбербанк",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingSB2.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке подключения к ПЦ ОЕ-Медиа",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingOEmedia.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке подключения терминалов Петрол Плюс",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingPetrolPlus.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке подключения терминалов Svoy.Club",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualSvoyClub.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке подключения банковского терминала SmartPOS (Республика Казахстан)",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualSmartPOS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке подключения банковского терминала Оптима Банк (Республика Киргизия)",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualOptimaBank.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке подключения банковского терминала MBank (Республика Киргизия)",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualSNC_Mbank.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке СНК-АЗС для расчетов по системе быстрых платежей (СБП)",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/qps.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "Мобильные сервисы",
    "slug": "mobilnye-servisy",
    "items": [
      {
        "title": "Рекомендации по подготовки АЗС к внедрению мобильных сервисов. Особенности обслуживания в СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/FeaturesMobileService.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Контроль средств по мобильным сервисам",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ControlMobileService.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с мобильным приложением Бензубер",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ProgramSetupSNC_AZS-Benzuber.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с мобильным приложением Яндекс.Заправка",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/Settingsyandex.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с мобильным приложением Fuelup",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/Settingsfuelup.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с мобильным приложением компании РусГаз",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualRusGaz.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с мобильным приложением GasPro",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/GasPro.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с мобильным приложением Монополия.Онлайн",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingsMonopoliy.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом Toplain",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingsTopline.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом Метаника",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualSNC_Metanica.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом E1 CARD",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingsE1CARD.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом НКС-Лояльность (Киргизия)",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingsNKCCard.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом О! Деньги",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingsODengi.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом Мост-Сервис",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/Settingsmostservice.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом Телемедиа",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/Settingstelemedia.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом СНК-ГлоПро",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/Settingglopro.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом СНК-Компания 2000",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingsComp2000.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом СНК-Дизель-Гарант",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingsDiselGarant.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом Ситидом",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SettingsSitydom.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом Гранд-Мобайл",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/Settings_grand_mobile.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по настройке СНК-АЗС для работы с сервисом Aurika 2026",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/Settings_Aurika_2026.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "Документация по ККТ",
    "slug": "dokumentatsiya-po-kkt",
    "items": [
      {
        "title": "Инструкция по смене системы налогообложения",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ManualChangeNalog.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке онлайн кассы iКасса",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/ikassa.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "СНК-АЗС. Разрешительный порядок при розничной продаже маркированного товара",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/SNC-AZS Razreshitelnuy porudok pri prodaze markirovannogo tovara.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Подключение локального модуля ЧЗ к СНК-АЗС",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/Podklyuchenie lokalnogo modulya ChZ k SNK-AZS.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке подключения к СНК-АЗС совместимого модуля ТС ПИоТ",
        "href": "https://www.sncard.ru/images/files/SNC_AZS/Manual_SNC-AZS_TC_PioT.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "Руководства по настройке СНК-АЗС для работы с ТСО",
    "slug": "rukovodstva-po-nastroyke-snk-azs-dlya",
    "items": [
      {
        "title": "Инструкция по настройке СНК-АЗС подключения ТСО от компании ИНИТ",
        "href": "https://www.sncard.ru/images/files/SNC_TCO/ManualTCOInit.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Инструкция по настройке СНК-АЗС подключения ТСО от компании СКОН",
        "href": "https://www.sncard.ru/images/files/SNC_TCO/ManualTcoCKON.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "Руководства по настройке СНК-АЗС для различных ТРК",
    "slug": "rukovodstva-po-nastroyke-snk-azs-dlya",
    "items": [
      {
        "title": "Подключение ТРК Топаз",
        "href": "https://www.sncard.ru/dokumentatsiya?view=article&id=147&catid=2",
        "type": "article",
        "article": 147
      },
      {
        "title": "Подключение ТРК Gilbarco",
        "href": "https://www.sncard.ru/dokumentatsiya?view=article&id=148&catid=2",
        "type": "article",
        "article": 148
      },
      {
        "title": "Подключение ТРК ПК-Электроникс",
        "href": "https://www.sncard.ru/dokumentatsiya?view=article&id=143&catid=2",
        "type": "article",
        "article": 143
      },
      {
        "title": "Подключение ТРК Adast",
        "href": "https://www.sncard.ru/dokumentatsiya?view=article&id=137&catid=2",
        "type": "article",
        "article": 137
      },
      {
        "title": "Подключение ТРК Dresser Wayne",
        "href": "https://www.sncard.ru/dokumentatsiya?view=article&id=138&catid=2",
        "type": "article",
        "article": 138
      },
      {
        "title": "Подключение ТРК Ливна",
        "href": "https://www.sncard.ru/dokumentatsiya?view=article&id=136&catid=2",
        "type": "article",
        "article": 136
      },
      {
        "title": "Подключение ТРК Tokheim",
        "href": "https://www.sncard.ru/dokumentatsiya?view=article&id=149&catid=2",
        "type": "article",
        "article": 149
      },
      {
        "title": "Подключение ТРК CenStar",
        "href": "https://www.sncard.ru/dokumentatsiya?view=article&id=158&catid=2",
        "type": "article",
        "article": 158
      },
      {
        "title": "Подключение УЗСГ от Технопроект",
        "href": "https://www.sncard.ru/dokumentatsiya?view=article&id=159&catid=2",
        "type": "article",
        "article": 159
      },
      {
        "title": "Подключение УНСГ-01 (весы) от компании Технопроект",
        "href": "https://www.sncard.ru/dokumentatsiya?view=article&id=225&catid=2",
        "type": "article",
        "article": 225
      }
    ]
  },
  {
    "title": "СНК-КСО - касса самообслуживания",
    "slug": "snk-kso-kassa-samoobsluzhivaniya",
    "items": [
      {
        "title": "СНК-КСО. Руководство по эксплуатации",
        "href": "https://www.sncard.ru/images/files/SNC_KCO/SNK_SSR_Operation.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "СНК-КСО. Руководство администратора по настройке СНК-КСО",
        "href": "https://www.sncard.ru/images/files/SNC_KCO/SNK_SSR_Setup.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "СНК-КСО. Руководство администратора по кастомизации интерфейса",
        "href": "https://www.sncard.ru/images/files/SNC_KCO/SNK_SSR_Interface_setup.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-Офис - управление сетью АЗС",
    "slug": "snk-ofis-upravlenie-setyu-azs",
    "items": [
      {
        "title": "Скачать презентацию СНК-Офис",
        "href": "https://www.sncard.ru/images/files/presentation/Presentation%20SNC-Office.rar",
        "type": "rar",
        "article": null
      },
      {
        "title": "Руководство по установке и эксплуатации СНК-Офис",
        "href": "https://www.sncard.ru/images/files/SNC_OFFICE/ManualSNC-Office.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство менеджера СНК-Офис",
        "href": "https://www.sncard.ru/images/files/SNC_OFFICE/ManualManagerSNC-Office.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Скачать последнее обновление СНК-Офис",
        "href": "http://cloud.sncard.ru/files/",
        "type": "link",
        "article": null
      },
      {
        "title": "Скачать последнее обновление отчетов СНК-Офис",
        "href": "http://cloud.sncard.ru/files/",
        "type": "link",
        "article": null
      },
      {
        "title": "Описание командной строки для реализации автоматической загрузки-выгрузки данных из/в СНК-ОФИС",
        "href": "https://www.sncard.ru/images/files/SNC_OFFICE/command%20line%20description%20SNC-Office.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Пример BAT-файла командной строки СНК-ОФИС",
        "href": "https://www.sncard.ru/images/files/SNC_OFFICE/sncoffice_exp.rar",
        "type": "rar",
        "article": null
      },
      {
        "title": "Описание стандартной выгрузки данных из\\в СНК-Офис, DBF формат",
        "href": "https://www.sncard.ru/images/files/SNC_OFFICE/Description%20data%20SNC-Office%20standart%20to%20DBF.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Описание расширенной выгрузки данных из\\в СНК-Офис, DBF формат",
        "href": "https://www.sncard.ru/images/files/SNC_OFFICE/Description%20data%20SNC-Office%20special%20to%20DBF.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Настройка репликации БД",
        "href": "https://www.sncard.ru/images/files/SNC_OFFICE/ReplicaSettings_PC_Office.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "СНК-Офис. Разрешительный порядок при розничной продаже маркированного товара",
        "href": "https://www.sncard.ru/images/files/SNC_OFFICE/SNC-OFFICE Razreshitelnuy porudok pri prodaze markirovannogo tovara.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "СНК-Управление ценниками. Руководство администратора и пользователя",
        "href": "https://www.sncard.ru/images/files/SNC_OFFICE/Manual_SNC_YC.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-WEB-Офис - web версия СНК-Офис через ЛК СНК-Менеджмент",
    "slug": "snk-web-ofis-web-versiya-snk-ofis",
    "items": [
      {
        "title": "Руководство оператора СНК-Web-Офис",
        "href": "https://www.sncard.ru/images/files/SNC_Web_Office/Manual_User_SNC-Web-Office.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по администрированию СНК-Web-Офис",
        "href": "https://www.sncard.ru/images/files/SNC_Web_Office/Manual_Admin_SNC-Web-Office.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-АСН - программа для нефтебаз",
    "slug": "snk-asn-programma-dlya-neftebaz",
    "items": [
      {
        "title": "Скачать презентацию пакета СНК-АСН",
        "href": "https://www.sncard.ru/images/files/presentation/Presentation%20SNC-ASN.rar",
        "type": "rar",
        "article": null
      },
      {
        "title": "Руководство по эксплуатации СНК-АСН",
        "href": "https://www.sncard.ru/images/files/SNC_ASN/ManualOperatorSNC-ASN.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Скачать последнее обновление СНК-АСН",
        "href": "http://cloud.sncard.ru/files/",
        "type": "link",
        "article": null
      },
      {
        "title": "Скачать последнее обновление отчетов СНК-АСН",
        "href": "http://cloud.sncard.ru/files/",
        "type": "link",
        "article": null
      },
      {
        "title": "Скачать демо версию СНК-АСН",
        "href": "http://cloud.sncard.ru/download/demo/demo_asn",
        "type": "link",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-КС - коммуникационный сервер передачи данных между программными продуктами СНК",
    "slug": "snk-ks-kommunikatsionnyy-server",
    "items": [
      {
        "title": "Руководство по установке и настройке коммуникационного сервера СНК-КС4 (версия 4)",
        "href": "https://www.sncard.ru/images/files/SNC_KC/Manual_KC4.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство по установке и настройке коммуникационного сервера СНК-КС5 (версия 5)",
        "href": "https://www.sncard.ru/images/files/SNC_KC/Manual_KC5.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-МСО - программное обеспечение сервисного обслуживания",
    "slug": "snk-mso-programmnoe-obespechenie",
    "items": [
      {
        "title": "Руководство по эксплуатации СНК-МСО",
        "href": "https://www.sncard.ru/images/files/SNCMCO/ManualSNC-MCO.rar",
        "type": "rar",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-TMS - программное обеспечение для централизованного управления автономными терминалами СНК-S380",
    "slug": "snk-tms-programmnoe-obespechenie-dlya",
    "items": [
      {
        "title": "Руководство по эксплуатации СНК-TMS",
        "href": "https://www.sncard.ru/images/files/SNC_TMS/InstrManualSNC-TMS.rar",
        "type": "rar",
        "article": null
      },
      {
        "title": "Руководство администратора СНК-TMS",
        "href": "https://www.sncard.ru/images/files/SNC_TMS/ManualSNC-TMS.rar",
        "type": "rar",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-S380 - автономный терминал расчета по топливным, дисконтным и бонусным картам СНК",
    "slug": "snk-s380-avtonomnyy-terminal-rascheta",
    "items": [
      {
        "title": "Руководство оператора автономного терминала СНК-S380",
        "href": "https://www.sncard.ru/images/files/SNC-POS/ManualSNC-S380.rar",
        "type": "rar",
        "article": null
      },
      {
        "title": "Скачать презентацию СНК-S380",
        "href": "https://www.sncard.ru/images/files/presentation/Presentation%20SNC-POS.rar",
        "type": "rar",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-МКО - программное обеспечение управления кассовыми операциями",
    "slug": "snk-mko-programmnoe-obespechenie",
    "items": [
      {
        "title": "СНК-МКО руководство администратора",
        "href": "https://www.sncard.ru/images/files/SNC_MKO/ManualAdminSNC-MKO.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "СНК-МКО руководство оператора",
        "href": "https://www.sncard.ru/images/files/SNC_MKO/ManualOperatorSNC-MKO.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "СНК-МКО установка дополнительных модулей",
        "href": "https://www.sncard.ru/images/files/SNC_MKO/InstallDonProgrammToSNC-MKO.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-УП - программное обеспечение управления платежами",
    "slug": "snk-up-programmnoe-obespechenie",
    "items": [
      {
        "title": "Руководство пользователя СНК-УП",
        "href": "https://www.sncard.ru/images/files/SNC_UP/ManualOperatorSNC-UP.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-УС - программное обеспечение централизованного управления скидками",
    "slug": "snk-us-programmnoe-obespechenie",
    "items": [
      {
        "title": "Руководство Пользователя СНК-УС",
        "href": "https://www.sncard.ru/images/files/SNC_YS/OperSNC_YS.rar",
        "type": "rar",
        "article": null
      },
      {
        "title": "Руководство Администратора СНК-УС",
        "href": "https://www.sncard.ru/images/files/SNC_YS/AdmSNC_YS.rar",
        "type": "rar",
        "article": null
      },
      {
        "title": "Скачать презентацию СНК-УС",
        "href": "https://www.sncard.ru/images/files/presentation/Presentation%20SNC-YS.rar",
        "type": "rar",
        "article": null
      },
      {
        "title": "Скачать последнее обновление СНК-УС",
        "href": "http://cloud.sncard.ru/snc-dm/files/",
        "type": "link",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-ЛК - личный кабинет клиента процессинговой компании",
    "slug": "snk-lk-lichnyy-kabinet-klienta",
    "items": [
      {
        "title": "Личный кабинет. Руководство пользователя-администратор",
        "href": "https://www.sncard.ru/images/files/SNC_PA/personal_account_administrator.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Личный кабинет владельца карты. Руководство пользователя-юридические лица",
        "href": "https://www.sncard.ru/images/files/SNC_PA/personal_account_organization.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Личный кабинет владельца карты. Руководство пользователя-физические лица",
        "href": "https://www.sncard.ru/images/files/SNC_PA/personal_account_card_owner.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Личный кабинет контрагента. Руководство пользователя",
        "href": "https://www.sncard.ru/images/files/SNC_LK/Manual_LK_Partner.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Личный кабинет продавца. Руководство пользователя",
        "href": "https://www.sncard.ru/images/files/SNC_LK/Manual_LK_Seller.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Личный кабинет владельца группы карт лояльности. Руководство пользователя",
        "href": "https://www.sncard.ru/images/files/SNC_LK/Manual_LK_GroupCard.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Схемы API Личный кабинет 3.0",
        "href": "https://www.sncard.ru/images/files/SNC_LK/schemes_API_Personal_account_3.0.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "СНК-Менеджмент - личный кабинет клиента для управления продуктами СНК",
    "slug": "snk-menedzhment-lichnyy-kabinet-klienta",
    "items": [
      {
        "title": "Руководство по централизованному управлению продуктами СНК",
        "href": "https://www.sncard.ru/images/files/SNC_Managment/managment.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "Документация общего характера",
    "slug": "dokumentatsiya-obschego-haraktera",
    "items": [
      {
        "title": "Инструкция по установке СУБД MySQL",
        "href": "https://www.sncard.ru/images/files/MySQL/ManualInstallMySql.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Руководство пользователя FastReport",
        "href": "https://www.sncard.ru/images/files/SNC_UO/FastRep.pdf",
        "type": "pdf",
        "article": null
      },
      {
        "title": "Презентация по основным пакетам группы компаний Сибнефтекарт",
        "href": "https://www.sncard.ru/images/files/presentation/SNC presentation.rar",
        "type": "rar",
        "article": null
      },
      {
        "title": "Настройка репликации БД",
        "href": "https://www.sncard.ru/images/files/SNC_OFFICE/ReplicaSettings_PC_Office.pdf",
        "type": "pdf",
        "article": null
      }
    ]
  },
  {
    "title": "Драйвера и системное ПО",
    "slug": "drayvera-i-sistemnoe-po",
    "items": [
      {
        "title": "Драйвера",
        "href": "http://cloud.sncard.ru/download/drivers/",
        "type": "link",
        "article": null
      },
      {
        "title": "Системное ПО",
        "href": "http://cloud.sncard.ru/download/soft/",
        "type": "link",
        "article": null
      }
    ]
  }
];

  if (typeof module === 'object' && module.exports) module.exports = DATA;
  else root.SNC_DATA = Object.assign(root.SNC_DATA || {}, { docs: DATA });
}(typeof window !== 'undefined' ? window : globalThis));
