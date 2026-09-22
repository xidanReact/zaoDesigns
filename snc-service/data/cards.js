/* =========================================================
   Изготовление пластиковых карт: прайс и примеры дизайна.
   Источник: snc-service.sncard.ru/izgotovlenie-plastikovykh-kart (разбор 22.09.2026).
   prices.rows[].prices — руб. за карту с НДС 5 % по тиражам prices.tirages; пустая строка — нет цены.
   examples[].src — файлы в snc-service/img/cards/.
   Как обновлять: правка этого файла → node snc-service/tools/generate.mjs
   ========================================================= */
(function (root) {
  const DATA =
{
  "prices": {
    "caption": "Тираж / стоимость за карту с НДС 5%",
    "tirages": [
      "100",
      "200",
      "500",
      "1000",
      "2000",
      "5000",
      "10 000",
      "20 000",
      "30 000",
      "50 000"
    ],
    "rows": [
      {
        "name": "Карты со штрих-кодом, 4+4",
        "prices": [
          "22,05",
          "20,58",
          "17,64",
          "14",
          "11,76",
          "11,61",
          "8,82",
          "8,08",
          "7,86",
          "7,64"
        ]
      },
      {
        "name": "Карты с магнитной полосой и номером",
        "prices": [
          "26,46",
          "23,52",
          "20,58",
          "17,64",
          "14,7",
          "11,03",
          "10,3",
          "9,85",
          "9,15",
          "8,68"
        ]
      },
      {
        "name": "Карты Mifare 1k, 13,56 МГц с печатной нумерацией",
        "prices": [
          "58,8",
          "39,7",
          "35,28",
          "33,81",
          "30,87",
          "29,4",
          "27,93",
          "27,2",
          "26,46",
          "23,52"
        ]
      },
      {
        "name": "Карты Mifare c ЛАКИРОВКОЙ 1+1, лак печать 4+4, нумерация входит в цену",
        "prices": [
          "73,5",
          "58,8",
          "47,04",
          "44,1",
          "39,69",
          "36,75",
          "33,81",
          "33,08",
          "32,34",
          "28,93"
        ]
      },
      {
        "name": "Карты Mifare на серебристой подложке + белила. Печать офсет 4+4, шелкография 2+2, нумерация входит в цену",
        "prices": [
          "88,2",
          "66,15",
          "55,86",
          "51,45",
          "48,51",
          "47,04",
          "42,63",
          "41,16",
          "38,22",
          "36,75"
        ]
      },
      {
        "name": "Под заказ чип оригинал Mifare plus SE, 1kb 7 buid цена",
        "prices": [
          "",
          "",
          "",
          "",
          "110",
          "101,22",
          "98,96",
          "",
          "",
          ""
        ]
      },
      {
        "name": "Под заказ чип оригинал Mifare plus SE, 2kb 7 buid",
        "prices": [
          "",
          "",
          "",
          "",
          "122,85",
          "111,93",
          "109,2",
          "",
          "",
          ""
        ]
      }
    ]
  },
  "examples": [
    {
      "src": "img/cards/barrel.jpg",
      "alt": "Barrel",
      "w": 448,
      "h": 276
    },
    {
      "src": "img/cards/chern.jpg",
      "alt": "chern",
      "w": 448,
      "h": 274
    },
    {
      "src": "img/cards/ayrika.jpg",
      "alt": "Ayrika",
      "w": 448,
      "h": 281
    },
    {
      "src": "img/cards/azs-h1.jpg",
      "alt": "AZS H1",
      "w": 448,
      "h": 276
    },
    {
      "src": "img/cards/azs-sibir.jpg",
      "alt": "AZS Sibir",
      "w": 448,
      "h": 282
    },
    {
      "src": "img/cards/club-card.jpg",
      "alt": "club card",
      "w": 448,
      "h": 305
    },
    {
      "src": "img/cards/draev.jpg",
      "alt": "Draev",
      "w": 448,
      "h": 247
    },
    {
      "src": "img/cards/expert.jpg",
      "alt": "Expert",
      "w": 448,
      "h": 282
    },
    {
      "src": "img/cards/forus.jpg",
      "alt": "Forus",
      "w": 448,
      "h": 283
    },
    {
      "src": "img/cards/gaznp.jpg",
      "alt": "gaznp",
      "w": 448,
      "h": 266
    },
    {
      "src": "img/cards/gazprom.jpg",
      "alt": "GazProm",
      "w": 448,
      "h": 282
    },
    {
      "src": "img/cards/gloster.jpg",
      "alt": "Gloster",
      "w": 448,
      "h": 274
    },
    {
      "src": "img/cards/irtush.jpg",
      "alt": "Irtush",
      "w": 448,
      "h": 289
    },
    {
      "src": "img/cards/kkg-d.jpg",
      "alt": "kkg d",
      "w": 495,
      "h": 302
    },
    {
      "src": "img/cards/knp.jpg",
      "alt": "knp",
      "w": 655,
      "h": 410
    },
    {
      "src": "img/cards/koksa.jpg",
      "alt": "Koksa",
      "w": 448,
      "h": 268
    },
    {
      "src": "img/cards/likesotrudnik.jpg",
      "alt": "LikeSotrudnik",
      "w": 448,
      "h": 284
    },
    {
      "src": "img/cards/matrix.jpg",
      "alt": "matrix",
      "w": 497,
      "h": 305
    },
    {
      "src": "img/cards/nika.jpg",
      "alt": "nika",
      "w": 491,
      "h": 295
    },
    {
      "src": "img/cards/ntk.jpg",
      "alt": "NTK",
      "w": 448,
      "h": 276
    },
    {
      "src": "img/cards/poil-d.jpg",
      "alt": "poil d",
      "w": 448,
      "h": 281
    },
    {
      "src": "img/cards/posp.jpg",
      "alt": "posp",
      "w": 316,
      "h": 195
    },
    {
      "src": "img/cards/prostor.jpg",
      "alt": "Prostor",
      "w": 448,
      "h": 275
    },
    {
      "src": "img/cards/region.jpg",
      "alt": "Region",
      "w": 448,
      "h": 289
    },
    {
      "src": "img/cards/rusneft.jpg",
      "alt": "RusNeft",
      "w": 448,
      "h": 277
    },
    {
      "src": "img/cards/snc.jpg",
      "alt": "snc",
      "w": 494,
      "h": 301
    },
    {
      "src": "img/cards/technos.jpg",
      "alt": "technos",
      "w": 647,
      "h": 402
    },
    {
      "src": "img/cards/tehnoservice.jpg",
      "alt": "TehnoService",
      "w": 448,
      "h": 281
    },
    {
      "src": "img/cards/tobolsk.jpg",
      "alt": "Tobolsk",
      "w": 448,
      "h": 247
    },
    {
      "src": "img/cards/topline.jpg",
      "alt": "TopLine",
      "w": 448,
      "h": 278
    },
    {
      "src": "img/cards/tzk-ygol.jpg",
      "alt": "TZK Ygol",
      "w": 448,
      "h": 286
    },
    {
      "src": "img/cards/vip-d.jpg",
      "alt": "vip d",
      "w": 661,
      "h": 410
    },
    {
      "src": "img/cards/vip-t.jpg",
      "alt": "vip t",
      "w": 660,
      "h": 408
    },
    {
      "src": "img/cards/yanacaq.jpg",
      "alt": "YANACAQ",
      "w": 448,
      "h": 276
    },
    {
      "src": "img/cards/yralgaz.jpg",
      "alt": "YralGaz",
      "w": 448,
      "h": 280
    }
  ]
}
;
  if (typeof module === 'object' && module.exports) module.exports = DATA;
  else root.SNC_CARDS = DATA;
})(typeof self !== 'undefined' ? self : this);
