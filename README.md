# PostCSS Sort Media Queries

[PostCSS]: https://github.com/postcss/postcss
[official docs]: https://github.com/postcss/postcss#usage
[Online Demo]: https://yunusga.uz/postcss-sort-media-queries/
[MIT]: https://github.com/yunusga/postcss-sort-media-queries/blob/master/LICENSE
[Releases history]: https://github.com/yunusga/postcss-sort-media-queries/blob/master/CHANGELOG.md

[![npm](https://img.shields.io/npm/v/postcss-sort-media-queries.svg)](https://www.npmjs.com/package/postcss-sort-media-queries) [![Node.js CI](https://github.com/yunusga/postcss-sort-media-queries/actions/workflows/test.yml/badge.svg?branch=main&event=status)](https://github.com/yunusga/postcss-sort-media-queries/actions/workflows/test.yml)
![license](https://img.shields.io/badge/License-MIT-orange.svg)
[![npm](https://img.shields.io/npm/dt/postcss-sort-media-queries.svg)](https://www.npmjs.com/package/postcss-sort-media-queries)

<img src="logo.svg?sanitize=true" align="right" title="PostCSS sort media queries logotype" width="100" height="100">

🌏 **English** ▫ [**O'zbek**](README-UZ.md) ▫ [**简体中文**](README-ZH.md)

**PostcSS Sort Qedia Queries** is a powerful and flexible [PostCSS] plugin for sorting and combining CSS media queries using **mobile-first** or **desktop-first** methodologies. It helps maintain a clean, predictable stylesheet structure, improves readability, and prevents unexpected style overrides.

A key advantage of this plugin is its **full support for nested media queries**, ensuring correct processing and ordering even in complex, deeply structured stylesheets. This makes it perfectly suited for modern CSS workflows that rely on nesting via PostCSS or preprocessor-like patterns.

In addition, the plugin fully supports **CSS Media Queries Level 4**, including modern **range syntax**.

Sorting works based on [OlehDutchenko/sort-css-media-queries](https://github.com/OlehDutchenko/sort-css-media-queries).

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Options](#options)
  - [sort](#sort)
  - [Custom sort function](#custom-sort-function)
  - [Sort configuration](#sort-configuration)
- [Online demo](#online-demo)
- [Examples (with nested media queries)](#examples)
  - [Sorting options](#mobile-first-sorting)
  - [Desktop first sorting](#desktop-first-sorting)
- [Changelog](#changelog)
- [License](#license)
- [Other PostCSS plugins](#other-postcss-plugins)
- [Thanks 💪](#thanks)

## Install

```
npm install postcss postcss-sort-media-queries --save-dev
```

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

```js
// CJS
let sortCssMq = require("postcss-sort-media-queries");

// ESM
import sortCssMq from "postcss-sort-media-queries";
```

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-sort-media-queries')({
+     sort: 'mobile-first' | 'desktop-first' | function // default ('mobile-first')
+   }),
  ]
}
```

or with custom sort function

```diff
module.exports = {
  plugins: [
+   require('postcss-sort-media-queries')({
+     sort: function(a, b) {
+        // custom sorting function
+     }
+   }),
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

## Options

> Sorting works based on [OlehDutchenko/sort-css-media-queries](https://github.com/OlehDutchenko/sort-css-media-queries)

### Sort

This option support **string** or **function** values.

- `{string}` `'mobile-first'` - (default) mobile first sorting
- `{string}` `'desktop-first'` - desktop first sorting
- `{function}` your own sorting function

#### `'mobile-first'` or `'desktop-first'`

```js
postcss([
  sortMediaQueries({
    sort: "mobile-first" | "desktop-first", // default (mobile-first)
  }),
]).process(css);
```

### Custom sort function

```js
postcss([
  sortMediaQueries({
    function(a, b) {
      return a.localeCompare(b);
    },
  }),
]).process(css);
```

In this example, all your media queries will sort by A-Z order.

This sorting function is directly passed to Array#sort() method of an array of all your media queries.

### Sort configuration

By this configuration you can control sorting behaviour.

```js
postcss([
  sortMediaQueries({
    configuration: {
      unitlessMqAlwaysFirst: true, // or false
    },
  }),
]).process(css);
```

Or alternatively create a `sort-css-mq.config.json` file in the root of your project. Or add property `sortCssMQ: {}` in your `package.json`.

## Online demo

And here is the [Online Demo]

## Examples

### Mobile first sorting (with nested media queries)

#### Before

```bash
root
│
├── (min-width: 1400px)
├── (min-width: 1200px)
│
└── @layer reset
   │
   ├── (min-width: 1200px)
   │   ├── (min-width: 992px)
   │   └── (min-width: 768px)
   │
   └── (min-width: 768px)
       ├── (min-width: 640px)
       └── (min-width: 320px)
```

#### After

```bash
root
│
├── @layer reset
│  │
│  ├── (min-width: 768px)
│  │   ├── (min-width: 320px)
│  │   └── (min-width: 640px)
│  │
│  └── (min-width: 1200px)
│      ├── (min-width: 768px)
│      └── (min-width: 992px)
│
├── (min-width: 1200px)
└── (min-width: 1400px)
```

### Desktop first sorting

**Before**

```css
root
│
├── (width < 640px)
├── (min-width: 760px)
├── (width < 640px)
├── (min-width: 1280px)
├── (max-width: 760px)
└── (max-width: 640px)
```

**After**

```bash
root
│
├── (min-width: 760px)
├── (max-width: 640px)
├── (width < 640px)
├── (max-width: 760px)
└── (min-width: 1280px)
```

---

## Changelog

See [Releases history]

## License

[MIT]

## Other PostCSS plugins

- [`postcss-momentum-scrolling`](https://github.com/solversgroup/postcss-momentum-scrolling) - plugin for adding **momentum** style scrolling behavior (`-webkit-overflow-scrolling:touch`) for elements with overflow (scroll, auto) on iOS (**deprecated for modern Safari**)

## Thanks

- Andrey Sitnik [@ai](https://github.com/ai)
- Oleh Dutchenko [@OlehDutchenko](https://github.com/OlehDutchenko)
- Jakub Caban [@Lustmored](https://github.com/Lustmored)
- Dmytro Symonov [@Kassaila](https://github.com/Kassaila)
- Kai Falkowski [@SassNinja](https://github.com/SassNinja)
- Khayot Razzakov [@Khayotbek1](https://github.com/Khayotbek1)
- ReindDooyeweerd [@ReindDooyeweerd](https://github.com/ReindDooyeweerd)
- msev [@msev](https://github.com/msev)
- ajiho [@ajiho](https://github.com/ajiho)
