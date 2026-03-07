var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// node_modules/sort-css-media-queries/lib/create-sort.js
var minMaxWidth = /(!?\(\s*min(-device)?-width)(.|\n)+\(\s*max(-device)?-width|\(\s*width\s*>(=)?(.|\n)+\(\s*width\s*<(=)?|(!?\(.*<(=)?\s*width\s*<(=)?)/i;
var minWidth = /\(\s*min(-device)?-width|\(\s*width\s*>(=)?/i;
var maxMinWidth = /(!?\(\s*max(-device)?-width)(.|\n)+\(\s*min(-device)?-width|\(\s*width\s*<(=)?(.|\n)+\(\s*width\s*>(=)?|(!?\(.*>(=)?\s*width\s*>(=)?)/i;
var maxWidth = /\(\s*max(-device)?-width|\(\s*width\s*<(=)?/i;
var isMinWidth = _testQuery(minMaxWidth, maxMinWidth, minWidth);
var isMaxWidth = _testQuery(maxMinWidth, minMaxWidth, maxWidth);
var minMaxHeight = /(!?\(\s*min(-device)?-height)(.|\n)+\(\s*max(-device)?-height|\(\s*height\s*>(=)?(.|\n)+\(\s*height\s*<(=)?|(!?\(.*<(=)?\s*height\s*<(=)?)/i;
var minHeight = /\(\s*min(-device)?-height|\(\s*height\s*>(=)?/i;
var maxMinHeight = /(!?\(\s*max(-device)?-height)(.|\n)+\(\s*min(-device)?-height|\(\s*height\s*<(=)?(.|\n)+\(\s*height\s*>(=)?|(!?\(.*>(=)?\s*height\s*>(=)?)/i;
var maxHeight = /\(\s*max(-device)?-height|\(\s*height\s*<(=)?/i;
var isMinHeight = _testQuery(minMaxHeight, maxMinHeight, minHeight);
var isMaxHeight = _testQuery(maxMinHeight, minMaxHeight, maxHeight);
var lessThan = /<(?!=)/;
var grtrThan = />(?!=)/;
var isPrint = /print/i;
var isPrintOnly = /^print$/i;
var maxValue = Number.MAX_VALUE;
function _getQueryLength(query) {
  let length = /(-?\d*\.?\d+)(ch|em|ex|px|rem)/.exec(query);
  if (length === null && (isMinWidth(query) || isMinHeight(query))) {
    length = /(\d)/.exec(query);
  }
  if (length === "0") {
    return 0;
  }
  if (length === null) {
    return maxValue;
  }
  let number = length[1];
  const unit = length[2];
  switch (unit) {
    case "ch":
      number = parseFloat(number) * 8.8984375;
      break;
    case "em":
    case "rem":
      number = parseFloat(number) * 16;
      break;
    case "ex":
      number = parseFloat(number) * 8.296875;
      break;
    case "px":
      number = parseFloat(number);
      break;
  }
  return +number;
}
function _testQuery(doubleTestTrue, doubleTestFalse, singleTest) {
  return function(query) {
    let result;
    if (doubleTestTrue.test(query)) result = true;
    else if (doubleTestFalse.test(query)) result = false;
    else result = singleTest.test(query);
    return query.includes("not") ? !result : result;
  };
}
function _testIsPrint(a, b) {
  const isPrintA = isPrint.test(a);
  const isPrintOnlyA = isPrintOnly.test(a);
  const isPrintB = isPrint.test(b);
  const isPrintOnlyB = isPrintOnly.test(b);
  if (isPrintA && isPrintB) {
    if (!isPrintOnlyA && isPrintOnlyB) {
      return 1;
    }
    if (isPrintOnlyA && !isPrintOnlyB) {
      return -1;
    }
    return a.localeCompare(b);
  }
  if (isPrintA) {
    return 1;
  }
  if (isPrintB) {
    return -1;
  }
  return null;
}
function createSort(configuration) {
  const config = configuration || {};
  const UNITLESS_MQ_ALWAYS_FIRST = config.unitlessMqAlwaysFirst;
  function sortCSSmq(a, b) {
    const testIsPrint = _testIsPrint(a, b);
    if (testIsPrint !== null) {
      return testIsPrint;
    }
    const minA = isMinWidth(a) || isMinHeight(a);
    const maxA = isMaxWidth(a) || isMaxHeight(a);
    const minB = isMinWidth(b) || isMinHeight(b);
    const maxB = isMaxWidth(b) || isMaxHeight(b);
    if (UNITLESS_MQ_ALWAYS_FIRST && (!minA && !maxA || !minB && !maxB)) {
      if (!minA && !maxA && !minB && !maxB) {
        return a.localeCompare(b);
      }
      return !minB && !maxB ? 1 : -1;
    } else {
      if (minA && maxB) {
        return -1;
      }
      if (maxA && minB) {
        return 1;
      }
      const lengthA = _getQueryLength(a);
      const lengthB = _getQueryLength(b);
      if (lengthA === maxValue && lengthB === maxValue) {
        return a.localeCompare(b);
      } else if (lengthA === maxValue) {
        return 1;
      } else if (lengthB === maxValue) {
        return -1;
      }
      if (lengthA > lengthB) {
        if (maxA) {
          return -1;
        }
        return 1;
      }
      if (lengthA < lengthB) {
        if (maxA) {
          return 1;
        }
        return -1;
      }
      if (lengthA === lengthB) {
        if (maxA && maxB) {
          if (lessThan.test(a) && !lessThan.test(b)) {
            return 1;
          }
          if (!lessThan.test(a) && lessThan.test(b)) {
            return -1;
          }
        }
        if (minA && minB) {
          if (grtrThan.test(a) && !grtrThan.test(b)) {
            return 1;
          }
          if (!grtrThan.test(a) && grtrThan.test(b)) {
            return -1;
          }
        }
      }
      return a.localeCompare(b);
    }
  }
  sortCSSmq.desktopFirst = function(a, b) {
    const testIsPrint = _testIsPrint(a, b);
    if (testIsPrint !== null) {
      return testIsPrint;
    }
    const minA = isMinWidth(a) || isMinHeight(a);
    const maxA = isMaxWidth(a) || isMaxHeight(a);
    const minB = isMinWidth(b) || isMinHeight(b);
    const maxB = isMaxWidth(b) || isMaxHeight(b);
    if (UNITLESS_MQ_ALWAYS_FIRST && (!minA && !maxA || !minB && !maxB)) {
      if (!minA && !maxA && !minB && !maxB) {
        return a.localeCompare(b);
      }
      return !minB && !maxB ? 1 : -1;
    } else {
      if (minA && maxB) {
        return 1;
      }
      if (maxA && minB) {
        return -1;
      }
      const lengthA = _getQueryLength(a);
      const lengthB = _getQueryLength(b);
      if (lengthA === maxValue && lengthB === maxValue) {
        return a.localeCompare(b);
      } else if (lengthA === maxValue) {
        return 1;
      } else if (lengthB === maxValue) {
        return -1;
      }
      if (lengthA > lengthB) {
        if (maxA) {
          return -1;
        }
        return 1;
      }
      if (lengthA < lengthB) {
        if (maxA) {
          return 1;
        }
        return -1;
      }
      if (lengthA === lengthB) {
        if (maxA && maxB) {
          if (lessThan.test(a) && !lessThan.test(b)) {
            return 1;
          }
          if (!lessThan.test(a) && lessThan.test(b)) {
            return -1;
          }
        }
        if (minA && minB) {
          if (grtrThan.test(a) && !grtrThan.test(b)) {
            return 1;
          }
          if (!grtrThan.test(a) && grtrThan.test(b)) {
            return -1;
          }
        }
      }
      return -a.localeCompare(b);
    }
  };
  return sortCSSmq;
}

// src/index.js
function sortAtRules(queries, options, sortCSSmq) {
  if (typeof options.sort !== "function") {
    options.sort = options.sort === "desktop-first" ? sortCSSmq.desktopFirst : sortCSSmq;
  }
  return queries.sort(options.sort);
}
function plugin(options = {}) {
  options = Object.assign(
    {
      sort: "mobile-first",
      configuration: false
    },
    options
  );
  const sortCSSmq = createSort(options.configuration);
  return {
    postcssPlugin: "postcss-sort-media-queries",
    OnceExit(root, { AtRule }) {
      let parents = {
        root: [],
        nested: []
      };
      let processed = /* @__PURE__ */ Symbol("processed");
      root.walkAtRules("media", (atRule) => {
        if (atRule.parent[processed]) {
          return;
        }
        if (atRule.parent.type === "root") {
          parents.root.push(atRule.parent);
        }
        if (atRule.parent.type !== "root") {
          parents.nested.push(atRule.parent);
        }
        atRule.parent[processed] = true;
        return;
      });
      Object.keys(parents).forEach((type) => {
        if (!parents[type].length) {
          return;
        }
        parents[type].forEach((parent) => {
          let media = parent.nodes.filter(
            (n) => n.type === "atrule" && n.name === "media"
          );
          if (!media) {
            return;
          }
          let atRules = [];
          media.forEach((atRule) => {
            let query = atRule.params;
            if (!atRules[query]) {
              atRules[query] = new AtRule({
                name: atRule.name,
                params: atRule.params,
                source: atRule.source
              });
            }
            atRule.nodes.forEach((node) => {
              atRules[query].append(node.clone());
            });
            atRule.remove();
          });
          if (atRules) {
            sortAtRules(Object.keys(atRules), options, sortCSSmq).forEach((query) => {
              parent.append(atRules[query]);
            });
          }
        });
      });
    }
  };
}
plugin.postcss = true;
var index_default = plugin;
