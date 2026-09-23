/* =========================================================
   Обслуживание ККТ: прайс-листы «Штрих-М» и «Атол», фискальные накопители, договоры.
   Источник: www.sncard.ru/obsluzhivanie-kkt (разбор 22.09.2026)
   Как обновлять: правка этого файла → node sncard/tools/generate.mjs. Цены «договорная» — так на сайте
   ========================================================= */
(function (root) {
  const DATA =
{
  "shtrih": {
    "title": "ККТ «Штрих-М»",
    "anchor": "shtrih",
    "note": "Прайс-лист на ККТ «Штрих-М»",
    "rows": [
      {
        "n": 1,
        "model": "aQsi5-Ф (5.5\" сенс. IPS, 2xSIM 2G/3G/LTE, WiFi+BT, камера 5М",
        "image": "img/kkt/large_aqsi-5b.jpg",
        "price": "договорная",
        "specs": [
          "2G/3G, WI-FI, Bluetooth",
          "58"
        ]
      },
      {
        "n": 2,
        "model": "АСПД Retail-01 (светлый/черный USB +RS),",
        "image": "img/kkt/retail-01.jpg",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM",
          "Автоотрезчик",
          "80, 58"
        ]
      },
      {
        "n": 3,
        "model": "АСПД RR-01 (светлый, USB+RS)",
        "image": "img/kkt/rr-01_f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM",
          "Автоотрезчик",
          "58, 80"
        ]
      },
      {
        "n": 4,
        "model": "АСПД RR-04 (светлый/черный, USB +RS",
        "image": "img/kkt/rr-04k_01.jpg",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM",
          "58"
        ]
      },
      {
        "n": 5,
        "model": "АСПД ШТРИХ -LIGHT 200 для ЕНВД",
        "image": "img/kkt/light_200.jpg",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM",
          "Автоотрезчик",
          "58"
        ]
      },
      {
        "n": 6,
        "model": "АСПД ШТРИХ-М 200 RS/USB (светлый/черный USB +RS)",
        "image": "img/kkt/shtrih-m-200.jpg",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM",
          "Автоотрезчик",
          "58, 80"
        ]
      },
      {
        "n": 7,
        "model": "АСПД ЭЛВЕС-ПРИНТ для ЕНВД ( RS )",
        "image": "img/kkt/elves-print.jpg",
        "price": "договорная",
        "specs": [
          "Последовательный COM",
          "58"
        ]
      },
      {
        "n": 8,
        "model": "Меркурий-185Ф (c GSM и WI-FI модулями) без ФН",
        "image": "img/kkt/merkuri-185.png",
        "price": "договорная",
        "specs": [
          "2G/3G, WI-FI",
          "58"
        ]
      },
      {
        "n": 9,
        "model": "ПИОНЕР-114Ф (Ethernet) без ФН",
        "image": "img/kkt/pioner114.jpg",
        "price": "договорная",
        "specs": [
          "Ethernet - LAN",
          "58"
        ]
      },
      {
        "n": 10,
        "model": "ПИОНЕР-114Ф (Wi-Fi) без ФН",
        "image": "img/kkt/pioner114.jpg",
        "price": "договорная",
        "specs": [
          "WI-FI",
          "58"
        ]
      },
      {
        "n": 11,
        "model": "РИТЕЙЛ-01Ф (RS + USB) без ФН/ЕНВД",
        "image": "img/kkt/retail-01.jpg",
        "price": "договорная",
        "specs": [
          "Последовательный COM, USB",
          "Автоотрезчик",
          "58, 80"
        ]
      },
      {
        "n": 12,
        "model": "РИТЕЙЛ-01Ф (RS+USB+Ethernet) без ФН/ЕНВД",
        "image": "img/kkt/retail-01.jpg",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM, Ethernet - LAN",
          "Автоотрезчик",
          "58, 80"
        ]
      },
      {
        "n": 13,
        "model": "РР-01Ф (USB + Ethernet) без ФН/ЕНВД",
        "image": "img/kkt/rr-01_f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Ethernet - LAN",
          "Автоотрезчик",
          "58, 80"
        ]
      },
      {
        "n": 14,
        "model": "РР-01Ф (USB + RS + Ethernet) без ФН/ЕНВД",
        "image": "img/kkt/rr-01_f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Ethernet - LAN, Последовательный COM",
          "Автоотрезчик",
          "58, 80"
        ]
      },
      {
        "n": 15,
        "model": "РР-02Ф (USB + RS + Ethernet) без ФН",
        "image": "img/kkt/rr-02-f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM, Ethernet - LAN",
          "Автоотрезчик",
          "80"
        ]
      },
      {
        "n": 16,
        "model": "РР-02Ф (USB) без ФН",
        "image": "img/kkt/rr-02-f.jpg",
        "price": "договорная",
        "specs": [
          "USB",
          "Автоотрезчик",
          "80"
        ]
      },
      {
        "n": 17,
        "model": "РР-03Ф (USB + RS+ LAN) без ФН/ЕНВД,",
        "image": "img/kkt/rr-03_f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM, Ethernet - LAN",
          "Автоотрезчик",
          "58"
        ]
      },
      {
        "n": 18,
        "model": "РР-04Ф (USB + RS + LAN) без ФН/ЕНВД",
        "image": "img/kkt/rr-04_04_f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM, Ethernet - LAN",
          "58"
        ]
      },
      {
        "n": 19,
        "model": "РР-04Ф (USB + RS) без ФН/ЕНВД,",
        "image": "img/kkt/rr-04_04_f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM",
          "58"
        ]
      },
      {
        "n": 20,
        "model": "Терминал \"Yarus-С2100\"-HGQOEO (GPRS-модем, аккум)",
        "image": "img/kkt/yarus-c2100.jpg",
        "price": "договорная",
        "specs": [
          "WI-FI, Последовательный COM, 2G/3G, Опциональный Bluetooth",
          "ФН",
          "58"
        ]
      },
      {
        "n": 21,
        "model": "ШТРИХ НАНО (Bluetooth + WiFi) без ФН, без БП",
        "image": "img/kkt/nano.png",
        "price": "договорная",
        "specs": [
          "Bluetooth, Опциональный WI-FI",
          "58"
        ]
      },
      {
        "n": 22,
        "model": "ШТРИХ-LIGHT-01Ф (RS + USB + Ethernet) без ФН",
        "image": "img/kkt/light-01f.png",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM, Ethernet - LAN",
          "Автоотрезчик",
          "58"
        ]
      },
      {
        "n": 23,
        "model": "ШТРИХ-MPAY-Ф (WiFi; GPRS) без ФН",
        "image": "img/kkt/strih-mpay.png",
        "price": "договорная",
        "specs": [
          "WI-FI, 2G/3G",
          "58"
        ]
      },
      {
        "n": 24,
        "model": "ШТРИХ-М-01Ф (RS + USB + Ethernet) без ФН/ЕНВД",
        "image": "img/kkt/m-01-f.png",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM, Ethernet - LAN, WI-FI",
          "Автоотрезчик",
          "Подкл. ДЯ",
          "80"
        ]
      },
      {
        "n": 25,
        "model": "Штрих-ОНЛАЙН (RS + USB + Wi-Fi) без ФН/ЕНВД",
        "image": "img/kkt/online.png",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM, WI-FI",
          "58"
        ]
      },
      {
        "n": 26,
        "model": "ШТРИХ-СМАРТПОС-Ф (7\" 600x1024 IPS,Android 7.0, ПЛЮС Кассир",
        "image": "img/kkt/smart-pos.png",
        "price": "договорная",
        "specs": [
          "WI-FI, Bluetooth, Опциональный 2G/3G",
          "58"
        ]
      },
      {
        "n": 27,
        "model": "ШТРИХ-ФР-02Ф (РИТЕЙЛ-02Ф) (RS + USB) без ФН/ЕНВД",
        "image": "img/kkt/fr-02.png",
        "price": "договорная",
        "specs": [
          "USB, Последовательный COM,",
          "44, 58"
        ]
      },
      {
        "n": 28,
        "model": "ЭЛВЕС-МФ (RS + Wi-Fi + 3G) без ФН",
        "image": "img/kkt/elves-mf.png",
        "price": "договорная",
        "specs": [
          "Последовательный COM, WI-FI, 2G/3G",
          "58"
        ]
      },
      {
        "n": 29,
        "model": "ЭЛВЕС-МФ (RS + Wi-Fi) (без кабеля RS) без ФН",
        "image": "img/kkt/elves-mf.png",
        "price": "договорная",
        "specs": [
          "WI-FI, 2G/3G, Последовательный COM",
          "58"
        ]
      },
      {
        "n": 30,
        "model": "ЭЛВЕС-МФ на базе ФР ЭЛВЕС-ФР-К ( RS + Ethernet)",
        "image": "img/kkt/elves-mf.png",
        "price": "договорная",
        "specs": [
          "Последовательный COM, Ethernet - LAN",
          "58"
        ]
      },
      {
        "n": 31,
        "model": "ЭЛВЕС-ФР-Ф (RS + USB +Ethernet + Wi-Fi) без ФН",
        "image": "img/kkt/elves-fr-f.png",
        "price": "договорная",
        "specs": [
          "Последовательный COM, USB, Ethernet - LAN, WI-FI",
          "Автоотрезчик",
          "Подкл. ДЯ",
          "80"
        ]
      },
      {
        "n": 32,
        "model": "ЯРУС M2100Ф (Цветной дисплей, 3G Dual Sim, Wi-Fi, Contactless, АКБ 3000мАч, без ФН-01, без EFTkkm)",
        "image": "img/kkt/yarus-m2100.jpg",
        "price": "договорная",
        "specs": [
          "2G/3G, WI-FI, Последовательный COM, Опциональный Bluetooth",
          "58"
        ]
      },
      {
        "n": 33,
        "model": "ЯРУС M2100Ф исп.08 (Цветной дисплей, 3G Dual Sim, Wi-Fi, Contactless, АКБ 3000мА",
        "image": "img/kkt/yarus-m2100.jpg",
        "price": "договорная",
        "specs": [
          "WI-FI, 2G/3G, Последовательный COM, Опциональный Bluetooth",
          "58"
        ]
      },
      {
        "n": 34,
        "model": "ЯРУС M2100Ф исп.08 (Цветной дисплей, 3G Dual Sim, Wi-Fi, Contactless, АКБ 3000мАч, ФН-01, EFTkkm)",
        "image": "img/kkt/yarus-m2100.jpg",
        "price": "договорная",
        "specs": [
          "WI-FI, 2G/3G, Последовательный COM, Опциональный Bluetooth",
          "ФН",
          "58"
        ]
      },
      {
        "n": 35,
        "model": "ЯРУС TФ-HGQOE0F(GPRS-модем, аккум, без ФН-01,ПО EFTkkm)",
        "image": "img/kkt/yarus-tf-hg.jpg",
        "price": "договорная",
        "specs": [
          "Ethernet - LAN, 2G/3G, Последовательный COM",
          "58"
        ]
      },
      {
        "n": 36,
        "model": "ЯРУС TФ-HGQOE0F(GPRS-модем, аккум, с ФН-01,ПО EFTkkm)",
        "image": "img/kkt/yarus-tf-hg.jpg",
        "price": "договорная",
        "specs": [
          "Ethernet - LAN, 2G/3G, Последовательный COM",
          "58"
        ]
      },
      {
        "n": 37,
        "model": "PIN pad YARUS K2100 ,круглые кнопки без щитка",
        "image": "img/kkt/pin-pad-yarusk2100.jpg",
        "price": "договорная",
        "specs": []
      },
      {
        "n": 38,
        "model": "PIN pad YARUS P2100 ver 03 EMV Contactless",
        "image": "img/kkt/pin-pad-yarusp2100.jpg",
        "price": "договорная",
        "specs": []
      }
    ]
  },
  "atol": {
    "title": "ККТ ООО «Атол»",
    "anchor": "atol",
    "note": "Прайс-лист на ККТ «Атол»",
    "rows": [
      {
        "n": 1,
        "model": "11Ф. с ФН 1.1. RS+USB",
        "image": "img/kkt/11f.jpg",
        "price": "договорная",
        "specs": [
          "Последовательный COM, USB, Опциональный 2G/3G,",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 2,
        "model": "11Ф. Мобильный. с ФН 1.1. RS+USB (BT, 2G, АКБ)",
        "image": "img/kkt/11f-m.png",
        "price": "договорная",
        "specs": [
          "Последовательный COM, USB, Bluetooth, 2G/3G",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 3,
        "model": "11Ф. Мобильный. с ФН 1.1. RS+USB (Wifi, BT, 2G, АКБ)",
        "image": "img/kkt/11f-m.png",
        "price": "договорная",
        "specs": [
          "Последовательный COM, USB, Bluetooth, 2G/3G, WI-FI",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 4,
        "model": "15Ф. Мобильный. с ФН 1.1. USB (Wifi, BT, АКБ)",
        "image": "img/kkt/15-fm1.jpg",
        "price": "договорная",
        "specs": [
          "USB, WI-FI, Bluetooth",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 5,
        "model": "20Ф. ФН 1.1.\\Без ЕНВД. USB",
        "image": "img/kkt/20f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Опциональный WI-FI, Опциональный Bluetooth, Опциональный 2G/3G",
          "Автоотрезчик",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 6,
        "model": "25Ф. ФН 1.1. RS+USB+Ethernet",
        "image": "img/kkt/25f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Ethernet - LAN, Опциональный WI-FI, Опциональный Bluetooth, Опциональный 2G/3G",
          "Автоотрезчик",
          "ФН",
          "58, 80"
        ]
      },
      {
        "n": 7,
        "model": "30Ф с ФН 1.1. USB+BT",
        "image": "img/kkt/30f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Опциональный WI-FI, Опциональный 2G/3G, Bluetooth",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 8,
        "model": "30Ф. с ФН 1.1. USB",
        "image": "img/kkt/30f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Опциональный WI-FI, Опциональный 2G/3G,",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 9,
        "model": "30Ф+ с ФН 1.1. ДЯ",
        "image": "img/kkt/30f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Опциональный WI-FI, Опциональный 2G/3G",
          "Подкл. ДЯ",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 10,
        "model": "50Ф. ФН 1.1.\\Без ЕНВД. USB",
        "image": "img/kkt/50f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Опциональный WI-FI, Опциональный Bluetooth, Опциональный 2G/3G",
          "Автоотрезчик",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 11,
        "model": "55Ф. ФН 1.1. RS+USB+Ethernet",
        "image": "img/kkt/55f.jpg",
        "price": "договорная",
        "specs": [
          "USB, Опциональный WI-FI, Опциональный Bluetooth, Опциональный 2G/3G, Ethernet - LAN, Последоват",
          "Автоотрезчик",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 12,
        "model": "60Ф с ФН 1.1, PINpad Ingenico IPP320 CTLS, ВТБ-24]",
        "image": "img/kkt/60f.png",
        "price": "договорная",
        "specs": [
          "USB, Bluetooth, 2G/3G",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 13,
        "model": "90Ф (Wifi, 2G, с ФН 1.1, с АКБ, без кабеля USB)",
        "image": "img/kkt/90f.jpg",
        "price": "договорная",
        "specs": [
          "USB, 2G/3G, Опциональный WI-FI",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 14,
        "model": "91Ф (Wifi, 2G, Ethernet , с ФН 1.1,)",
        "image": "img/kkt/91f_krasnaya_2_.jpg",
        "price": "договорная",
        "specs": [
          "Ethernet - LAN, 2G/3G, WI-FI, USB",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 15,
        "model": "92Ф (Wifi, BT, 2G, Ethernet, с ФН 1.1)",
        "image": "img/kkt/92-f.jpg",
        "price": "договорная",
        "specs": [
          "Ethernet - LAN, 2G/3G, WI-FI, USB, Bluetooth",
          "ФН",
          "44, 58"
        ]
      },
      {
        "n": 16,
        "model": "FPrint-22ПТК. ФН 1.1. RS+USB+Ethernet",
        "image": "img/kkt/22-ptk.jpg",
        "price": "договорная",
        "specs": [
          "Последовательный COM, USB, Ethernet - LAN, Опциональный WI-FI, Опциональный 2G/3G",
          "Автоотрезчик",
          "ФН",
          "58, 80"
        ]
      }
    ]
  },
  "fn": {
    "title": "Фискальные накопители",
    "anchor": "fn",
    "note": "Фискальные накопители",
    "rows": [
      {
        "n": 1,
        "model": "Фискальный накопитель (ФН) 15 месяцев в составе ККТ",
        "image": null,
        "price": "8400",
        "specs": []
      },
      {
        "n": 2,
        "model": "Фискальный накопитель (ФН-1.1M) 36 месяцев в составе ККТ",
        "image": null,
        "price": "13500",
        "specs": []
      }
    ]
  },
  "contracts": [
    {
      "href": "https://www.sncard.ru/images/Dogovor/PubOfertaShtrikh01062024.pdf",
      "title": "Сублицензионный договор о предоставлении права на использование программного обеспечения «Штрих-М»"
    },
    {
      "href": "https://www.sncard.ru/images/Dogovor/PubOfertaSublDog4a.pdf",
      "title": "Сублицензионный договор о предоставлении права на использование программного обеспечения «АТОЛ»"
    }
  ]
};

  if (typeof module === 'object' && module.exports) module.exports = DATA;
  else root.SNC_DATA = Object.assign(root.SNC_DATA || {}, { kkt: DATA });
}(typeof window !== 'undefined' ? window : globalThis));
