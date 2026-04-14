"use strict";

const mod = require("./index.cjs");

const plugin = mod.default;

plugin.postcss = mod.postcss;

module.exports = plugin;
