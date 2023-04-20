# PostCSS tartiblash media so'rovlari

[PostCSS]:          https://github.com/postcss/postcss
[ci-img]:           https://travis-ci.org/solversgroup/postcss-sort-media-queries.svg
[ci]:               https://travis-ci.org/solversgroup/postcss-sort-media-queries
[MIT]:              https://github.com/solversgroup/postcss-sort-media-queries/blob/master/LICENSE
[official docs]:    https://github.com/postcss/postcss#usage
[Releases history]: https://github.com/solversgroup/postcss-sort-media-queries/blob/master/CHANGELOG.md

[![npm](https://img.shields.io/npm/v/postcss-sort-media-queries.svg)](https://www.npmjs.com/package/postcss-sort-media-queries) [![Build Status][ci-img]][ci]
[![npm](https://img.shields.io/npm/dt/postcss-sort-media-queries.svg)](https://www.npmjs.com/package/postcss-sort-media-queries)

<img src="logo.svg?sanitize=true" align="right" title="PostCSS sort media queries logotype" width="100" height="100">

🌏 [**English**](README.md) ▫ **O'zbek**

[PostCSS] CSS media so'rovlarini **mobil qurilma** va **ish stoli kompyuter**  metodologiyalari bilan ularni saralash va birlashtirish uchun xizmat qiladi.



> 5.0.0 plaginini qo'llab-quvvatlaydigan [Media funksiyasi turlari: “diapazon”](https://www.w3.org/TR/mediaqueries-4/#mq-ranges)


## Mundarija

 - [Onlayn demo](#onlayn-demo)
 - [Misollar](#misollar)
   - [Mobil qurilmalarni tartiblash](#mobil-qurilmalarni-tartiblash)
   - [Ish stoli kompyuter qurilmalarni tartiblash](#ish-stoli-kompyuter-qurilmalarni-tartiblash)
 - [O'rnatish](#ornatish)
 - [Foydalanish](#foydalanish)
 - [Variantlar](#variantlar)
   - [Saralash](#saralash)
   - [Maxsus tartiblash funksiyasi](#maxsus-tartiblash-funksiyasi)
   - [Saralash konfiguratsiyasi](#saralash-konfiguratsiyasi)
 - [O'zgarishlar jurnali](#ozgarishlar-jurnali)
 - [Litsenziya](#litsenziya)
 - [Boshqa PostCSS plaginlari](#boshqa-postCSS-plaginlari)
 - [Rahmat 💪](#rahmat)


## Onlayn demo

bu yerda [onlayn demo](https://postcss-sort-media-queries.github.io)


## Misollar

### Mobil qurilmalarni tartiblash

**oldin**

```css
@media screen and (max-width: 640px) {
  .head { color: #cfcfcf }
}
@media screen and (max-width: 768px) {
  .footer { color: #cfcfcf }
}
@media screen and (max-width: 640px) {
  .main { color: #cfcfcf }
}
@media screen and (min-width: 1280px) {
  .mobile-first { color: #cfcfcf }
}
@media screen and (min-width: 640px) {
  .mobile-first { color: #cfcfcf }
}
@media screen and (max-width: 640px) {
  .footer { color: #cfcfcf }
}
```

**keyin**

```css
@media screen and (min-width: 640px) {
  .mobile-first { color: #cfcfcf }
}
@media screen and (min-width: 1280px) {
  .mobile-first { color: #cfcfcf }
}
@media screen and (max-width: 768px) {
  .footer { color: #cfcfcf }
}
@media screen and (max-width: 640px) {
  /* birlashtirilgan */
  .head { color: #cfcfcf }
  .main { color: #cfcfcf }
  .footer { color: #cfcfcf }
}
```

### Ish stoli kompyuter qurilmalarni tartiblash

**oldin**
```css
@media screen and (max-width: 640px) {
  .header { color: #cdcdcd }
}
@media screen and (min-width: 760px) {
  .desktop-first { color: #cdcdcd }
}
@media screen and (max-width: 640px) {
  .main { color: #cdcdcd }
}
@media screen and (min-width: 1280px) {
  .desktop-first { color: #cdcdcd }
}
@media screen and (max-width: 760px) {
  .footer { color: #cdcdcd }
}
@media screen and (max-width: 640px) {
  .footer { color: #cdcdcd }
}
```

**keyin**

```css
@media screen and (max-width: 760px) {
  .footer { color: #cdcdcd }
}
@media screen and (max-width: 640px) {
  /* combined */
  .header { color: #cdcdcd }
  .main { color: #cdcdcd }
  .footer { color: #cdcdcd }
}
@media screen and (min-width: 760px) {
  .desktop-first { color: #cdcdcd }
}
@media screen and (min-width: 1280px) {
  .desktop-first { color: #cdcdcd }
}
```

## O'rnatish

Birinchi navbatda, modulni o'rnating:

```
npm install postcss postcss-sort-media-queries --save-dev
```

## Foydalanish

Mavjud PostCSS konfiguratsiyasi uchun loyihangizni tekshiring: `postcss.config.js`
loyiha ildizida, `package.json` ichidagi `"postcss"` bo`limida
yoki to'plam konfiguratsiyasida "postcss".

Agar siz allaqachon PostCSS-dan foydalansangiz, plaginni plaginlar ro'yxatiga qo'shing:

```diff
module.exports = {
  plugins: [
+   require('postcss-sort-media-queries')({
+     sort: 'mobile-first' default value
+   }),
    require('autoprefixer')
  ]
}
```

yoki maxsus tartiblash funksiyasi bilan
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

Agar siz PostCSS-dan foydalanmasangiz, uni [official docs] ga
muvofiq qo'shing va sozlamalarda ushbu plaginni o'rnating.
