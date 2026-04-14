# PostCSS Media So'rovlarini Tartiblash

[![npm](https://img.shields.io/npm/v/postcss-sort-media-queries.svg)](https://www.npmjs.com/package/postcss-sort-media-queries)
[![Node.js
CI](https://github.com/yunusga/postcss-sort-media-queries/actions/workflows/test.yml/badge.svg?branch=main&event=status)](https://github.com/yunusga/postcss-sort-media-queries/actions/workflows/test.yml)
![license](https://img.shields.io/badge/License-MIT-orange.svg)
[![npm](https://img.shields.io/npm/dt/postcss-sort-media-queries.svg)](https://www.npmjs.com/package/postcss-sort-media-queries)

<img src="logo.svg?sanitize=true" align="right" title="PostCSS sort media queries logotype" width="100" height="100">

🌏 [**English**](README.md) ▫ **O'zbek** ▫ [**简体中文**](README-ZH.md)

[PostCSS](https://github.com/postcss/postcss) plagini CSS **media
so'rovlarini tartiblash va birlashtirish** uchun mo'ljallangan.

Plagin **mobile-first** va **desktop-first** metodologiyalarini
qo'llab-quvvatlaydi va CSS faylingizdagi media so'rovlarini optimal
tartibga keltirishga yordam beradi.

> v6.0.0 versiyasidan boshlab plagin **nested (ichma-ich) media
> so'rovlarini** va **ESM modul formatini** qo'llab-quvvatlaydi.

---

## Mundarija

- [Onlayn demo](#onlayn-demo)
- [Misollar](#misollar)
  - [Mobile first tartiblash](#mobile-first-tartiblash)
  - [Desktop first tartiblash](#desktop-first-tartiblash)
  - [Ichma-ich media so'rovlarini
    tartiblash](#ichma-ich-media-sorovlarini-tartiblash)
- [O'rnatish](#ornatish)
- [Foydalanish](#foydalanish)
- [Opsiyalar](#opsiyalar)
  - [sort](#sort)
  - [Maxsus tartiblash funksiyasi](#maxsus-tartiblash-funksiyasi)
  - [Tartiblash konfiguratsiyasi](#tartiblash-konfiguratsiyasi)
- [O'zgarishlar jurnali](#ozgarishlar-jurnali)
- [Litsenziya](#litsenziya)
- [Boshqa PostCSS plaginlari](#boshqa-postcss-plaginlari)
- [Rahmat](#rahmat)

---

## Onlayn demo

Plaginning ishlashini brauzerda sinab ko'rishingiz mumkin:

👉 [Online Demo](https://yunusga.uz/postcss-sort-media-queries/)

---

## Misollar

### Mobile first tartiblash

**Oldin**

```css
@media (min-width: 1400px) {
}
@media (min-width: 1200px) {
}

@layer reset {
  @media (min-width: 1200px) {
    @media (min-width: 992px) {
    }
    @media (min-width: 768px) {
    }
  }

  @media (min-width: 768px) {
    @media (min-width: 640px) {
    }
    @media (min-width: 320px) {
    }
  }
}
```

**Keyin**

```css
@layer reset {
  @media (min-width: 768px) {
    @media (min-width: 320px) {
    }
    @media (min-width: 640px) {
    }
  }

  @media (min-width: 1200px) {
    @media (min-width: 768px) {
    }
    @media (min-width: 992px) {
    }
  }
}

@media (min-width: 1200px) {
}
@media (min-width: 1400px) {
}
```

---

### Desktop first tartiblash

**Oldin**

```css
@media screen and (width < 640px) {
  .header {
    color: #cdcdcd;
  }
}
@media screen and (min-width: 760px) {
  .desktop-first {
    color: #cdcdcd;
  }
}
@media screen and (width < 640px) {
  .main {
    color: #cdcdcd;
  }
}
@media screen and (min-width: 1280px) {
  .desktop-first {
    color: #cdcdcd;
  }
}
@media screen and (max-width: 760px) {
  .footer {
    color: #cdcdcd;
  }
}
@media screen and (max-width: 640px) {
  .footer {
    color: #cdcdcd;
  }
}
```

**Keyin**

```css
@media screen and (max-width: 760px) {
  .footer {
    color: #cdcdcd;
  }
}
@media screen and (width < 640px) {
  /* combined */
  .header {
    color: #cdcdcd;
  }
  .main {
    color: #cdcdcd;
  }
  .footer {
    color: #cdcdcd;
  }
}
@media screen and (min-width: 760px) {
  .desktop-first {
    color: #cdcdcd;
  }
}
@media screen and (min-width: 1280px) {
  .desktop-first {
    color: #cdcdcd;
  }
}
```

---

## O'rnatish

Avvalo modulni o'rnating:

    npm install postcss postcss-sort-media-queries --save-dev

---

## Foydalanish

Loyihangizda mavjud **PostCSS konfiguratsiyasini** tekshiring:

- `postcss.config.js`
- `package.json` ichidagi `"postcss"` bo'limi
- yoki bundler konfiguratsiyasi

### Import qilish

```js
// CJS
let sortCssMq = require("postcss-sort-media-queries");

// ESM
import sortCssMq from "postcss-sort-media-queries";
```

Agar siz allaqachon PostCSS ishlatayotgan bo'lsangiz, plaginni `plugins`
ro'yxatiga qo'shing:

```diff
module.exports = {
  plugins: [
+   require('postcss-sort-media-queries')({
+     sort: 'mobile-first'
+   }),
    require('autoprefixer')
  ]
}
```

Yoki **maxsus tartiblash funksiyasi** bilan:

```diff
module.exports = {
  plugins: [
+   require('postcss-sort-media-queries')({
+     sort: function(a, b) {
+        // custom sorting function
+     }
+   }),
    require('autoprefixer')
  ]
}
```

Agar siz PostCSS ishlatmasangiz, uni [official
docs](https://github.com/postcss/postcss#usage) bo'yicha o'rnatib, ushbu
plaginni konfiguratsiyaga qo'shing.

---

## Opsiyalar

> Tartiblash
> [OlehDutchenko/sort-css-media-queries](https://github.com/OlehDutchenko/sort-css-media-queries)
> funksiyasiga asoslangan.

### sort

Ushbu parametr **string** yoki **function** qiymatlarini qabul qiladi.

- `{string}` `'mobile-first'` --- (standart) mobile-first tartiblash
- `{string}` `'desktop-first'` --- desktop-first tartiblash
- `{function}` --- o'zingiz yozgan tartiblash funksiyasi

#### mobile-first

```js
postcss([
  sortMediaQueries({
    sort: "mobile-first",
  }),
]).process(css);
```

#### desktop-first

```js
postcss([
  sortMediaQueries({
    sort: "desktop-first",
  }),
]).process(css);
```

---

### Maxsus tartiblash funksiyasi

```js
postcss([
  sortMediaQueries({
    function(a, b) {
      return a.localeCompare(b);
    },
  }),
]).process(css);
```

Bu misolda barcha media so'rovlari **A dan Z gacha** tartibda
saralanadi.

Funksiya to'g'ridan-to'g'ri `Array.sort()` metodiga uzatiladi.

---

### Tartiblash konfiguratsiyasi

Ushbu konfiguratsiya orqali tartiblash xatti-harakatini boshqarishingiz
mumkin.

```js
postcss([
  sortMediaQueries({
    configuration: {
      unitlessMqAlwaysFirst: true,
    },
  }),
]).process(css);
```

Yoki loyiha ildizida `sort-css-mq.config.json` faylini yaratishingiz
mumkin.

Shuningdek `package.json` ichida ham sozlash mumkin:

```json
{
  "sortCssMQ": {}
}
```

---

## O'zgarishlar jurnali

Qarang: [Releases
history](https://github.com/yunusga/postcss-sort-media-queries/blob/master/CHANGELOG.md)

---

## Litsenziya

[MIT](https://github.com/yunusga/postcss-sort-media-queries/blob/master/LICENSE)

---

## Boshqa PostCSS plaginlari

- [`postcss-momentum-scrolling`](https://github.com/solversgroup/postcss-momentum-scrolling)
  --- iOS qurilmalarida overflow (`scroll`, `auto`) elementlari uchun
  **momentum scrolling** qo'shadi.

---

## Rahmat

Quyidagi insonlar loyiha rivojiga hissa qo'shgan:

- Andrey Sitnik [@ai](https://github.com/ai)
- Oleh Dutchenko [@OlehDutchenko](https://github.com/OlehDutchenko)
- Jakub Caban [@Lustmored](https://github.com/Lustmored)
- Dmytro Symonov [@Kassaila](https://github.com/Kassaila)
- Kai Falkowski [@SassNinja](https://github.com/SassNinja)
- Khayot Razzakov [@Khayotbek1](https://github.com/Khayotbek1)
- ReindDooyeweerd [@ReindDooyeweerd](https://github.com/ReindDooyeweerd)
- msev [@msev](https://github.com/msev)
