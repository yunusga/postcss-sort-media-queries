'use strict';

const mod = require('../build/index.cjs');

const plugin = mod.default;

console.log('asdasdasd');

plugin.postcss = mod.postcss;

module.exports = plugin;
