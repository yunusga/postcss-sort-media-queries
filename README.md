# PostCSS Sort Media Queries

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/solversgroup/postcss-sort-media-queries.svg
[ci]:      https://travis-ci.org/solversgroup/postcss-sort-media-queries
[MIT]:     https://github.com/solversgroup/postcss-sort-media-queries/blob/master/LICENSE

[![npm](https://img.shields.io/npm/v/postcsspostcss-sort-media-queries.svg)](https://www.npmjs.com/package/postcsspostcss-sort-media-queries) [![Build Status][ci-img]][ci]
[![npm](https://img.shields.io/npm/dt/postcsspostcss-sort-media-queries.svg)](https://www.npmjs.com/package/postcsspostcss-sort-media-queries)

[PostCSS] plugin for sorting CSS media queries with mobile-first or desktop-first methods..

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-sort-media-queries'),
    require('autoprefixer')
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage
