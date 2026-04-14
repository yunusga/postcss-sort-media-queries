# PostCSS 排序媒体查询（Sort Media Queries）

[PostCSS]: https://github.com/postcss/postcss
[official docs]: https://github.com/postcss/postcss#usage
[Online Demo]: https://yunusga.uz/postcss-sort-media-queries/
[MIT]: https://github.com/yunusga/postcss-sort-media-queries/blob/master/LICENSE
[Releases history]: https://github.com/yunusga/postcss-sort-media-queries/blob/master/CHANGELOG.md

[![npm](https://img.shields.io/npm/v/postcss-sort-media-queries.svg)](https://www.npmjs.com/package/postcss-sort-media-queries) [![Node.js CI](https://github.com/yunusga/postcss-sort-media-queries/actions/workflows/test.yml/badge.svg?branch=main&event=status)](https://github.com/yunusga/postcss-sort-media-queries/actions/workflows/test.yml)
![license](https://img.shields.io/badge/License-MIT-orange.svg)
[![npm](https://img.shields.io/npm/dt/postcss-sort-media-queries.svg)](https://www.npmjs.com/package/postcss-sort-media-queries)

<img src="logo.svg?sanitize=true" align="right" title="PostCSS sort media queries 标志" width="100" height="100">

🌏 [**English**](README.md) ▫ [**O'zbek**](README-UZ.md) ▫ **简体中文**

**PostcSS Sort Media Queries** 是一个强大且灵活的 [PostCSS] 插件，用于按照 **移动优先（mobile-first）** 或 **桌面优先（desktop-first）** 的方式对 CSS 媒体查询进行排序与合并。它可以帮助保持样式表结构清晰、可预测，提高可读性，并防止意外的样式覆盖。

该插件的一个关键优势是 **完全支持嵌套媒体查询**，即使在复杂、深层嵌套的样式结构中也能正确处理与排序。这使它非常适用于现代 CSS 工作流，例如 PostCSS 嵌套或类似预处理器的写法。

此外，该插件完全支持 **CSS Media Queries Level 4**，包括现代的 **范围语法（range syntax）**。

排序逻辑基于 [OlehDutchenko/sort-css-media-queries](https://github.com/OlehDutchenko/sort-css-media-queries)。

## 目录

- [安装](#install)
- [使用](#usage)
- [选项](#options)
  - [sort](#sort)
  - [自定义排序函数](#custom-sort-function)
  - [排序配置](#sort-configuration)

- [在线演示](#online-demo)
- [示例（包含嵌套媒体查询）](#examples)
  - [排序选项](#mobile-first-sorting)
  - [桌面优先排序](#desktop-first-sorting)

- [更新日志](#changelog)
- [许可证](#license)
- [其他 PostCSS 插件](#other-postcss-plugins)
- [致谢 💪](#thanks)

## 安装

```bash
npm install postcss postcss-sort-media-queries --save-dev
```

## 使用

检查你的 PostCSS 配置是否已存在：项目根目录下的 `postcss.config.js`，
或 `package.json` 中的 `"postcss"` 字段，或构建工具配置中的 `postcss`。

```js
// CJS
let sortCssMq = require("postcss-sort-media-queries");

// ESM
import sortCssMq from "postcss-sort-media-queries";
```

如果你已经在使用 PostCSS，将插件添加到 plugins 列表中：

```diff
module.exports = {
  plugins: [
+   require('postcss-sort-media-queries')({
+     sort: 'mobile-first' | 'desktop-first' | function // 默认（mobile-first）
+   }),
  ]
}
```

或使用自定义排序函数：

```diff
module.exports = {
  plugins: [
+   require('postcss-sort-media-queries')({
+     sort: function(a, b) {
+        // 自定义排序函数
+     }
+   }),
  ]
}
```

如果你没有使用 PostCSS，请参考 [官方文档] 并在配置中添加该插件。

## 选项

> 排序逻辑基于 [OlehDutchenko/sort-css-media-queries](https://github.com/OlehDutchenko/sort-css-media-queries)

### sort

该选项支持 **字符串** 或 **函数** 类型。

- `{string}` `'mobile-first'` -（默认）移动优先排序
- `{string}` `'desktop-first'` - 桌面优先排序
- `{function}` 自定义排序函数

#### `'mobile-first'` 或 `'desktop-first'`

```js
postcss([
  sortMediaQueries({
    sort: "mobile-first" | "desktop-first", // 默认（mobile-first）
  }),
]).process(css);
```

### 自定义排序函数

```js
postcss([
  sortMediaQueries({
    sort: function (a, b) {
      return a.localeCompare(b);
    },
  }),
]).process(css);
```

在这个例子中，所有媒体查询将按 A-Z 顺序排序。

该排序函数会直接传递给 `Array#sort()` 方法，用于所有媒体查询数组。

### 排序配置

通过该配置，你可以控制排序行为。

```js
postcss([
  sortMediaQueries({
    configuration: {
      unitlessMqAlwaysFirst: true, // 或 false
    },
  }),
]).process(css);
```

或者你也可以在项目根目录创建 `sort-css-mq.config.json` 文件，或者在 `package.json` 中添加 `sortCssMQ: {}` 字段。

## 在线演示

这里是 [在线演示](https://yunusga.uz/postcss-sort-media-queries/)

## 示例

### 移动优先排序（包含嵌套媒体查询）

#### 之前

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

#### 之后

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

### 桌面优先排序

**之前**

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

**之后**

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

## 更新日志

查看 [Releases history]

## 许可证

[MIT]

## 其他 PostCSS 插件

- [`postcss-momentum-scrolling`](https://github.com/solversgroup/postcss-momentum-scrolling) - 用于为 iOS 中 overflow（scroll、auto）元素添加 **惯性滚动（momentum scrolling）**（`-webkit-overflow-scrolling:touch`）的插件（**现代 Safari 已弃用**）

## 致谢

- Andrey Sitnik [@ai](https://github.com/ai)
- Oleh Dutchenko [@OlehDutchenko](https://github.com/OlehDutchenko)
- Jakub Caban [@Lustmored](https://github.com/Lustmored)
- Dmytro Symonov [@Kassaila](https://github.com/Kassaila)
- Kai Falkowski [@SassNinja](https://github.com/SassNinja)
- Khayot Razzakov [@Khayotbek1](https://github.com/Khayotbek1)
- ReindDooyeweerd [@ReindDooyeweerd](https://github.com/ReindDooyeweerd)
- msev [@msev](https://github.com/msev)
- ajiho [@ajiho](https://github.com/ajiho)
