// @ts-check

/**
 * @typedef {import('postcss/lib/postcss').Plugin} Plugin
 * @typedef {import('postcss/lib/postcss').Root} Root
 * @typedef {import('postcss/lib/postcss').AtRule} AtRule
 * @typedef {import('sort-css-media-queries/lib')} SortCSSmq
 */

/**
 * Sort function declaration
 * @callback sortFn
 * @param {string} A - previous
 * @param {string} B - next
 * @returns {number}
 */

/**
 * @typedef {object} sortCSSMediaQueriesOptions
 * @property {boolean=} unitlessMqAlwaysFirst unitless media queries first. Defaults to false
 */

/**
 * @typedef {object} pluginOptions
 * @property {'mobile-first'|'desktop-first'|sortFn=} sort Sort strategy.
 * @property {false|sortCSSMediaQueriesOptions=} configuration sort-css-media-queries options.
 * @property {boolean=} onlyTopLevel Whether to sort the top level only or not. Defaults to false.
 * @property {boolean=} recursive Whether to sort recursively or not. Defaults to false.
 * @property {string|RegExp=} pattern string or regex pattern to math media querie like atRules. Defaults to 'media'.
 */

/**
 * Plugin constructor
 * @param {pluginOptions} opts - plugin options
 * @returns {Plugin} - plugin object
 */
module.exports = (opts = {}) => {
  const {sort, configuration, onlyTopLevel, pattern, recursive} = Object.assign(
    {
      sort: 'mobile-first',
      pattern: 'media',
    },
    opts
  )

  const createSort = require('sort-css-media-queries/lib/create-sort');
  /** @type {SortCSSmq} */
  const sortCSSmq = configuration ? createSort(configuration) : require('sort-css-media-queries');

  return {
    postcssPlugin: 'postcss-sort-media-queries',
    OnceExit (root, {AtRule}) {
      /**
       * Sort query strings
       * @param {string[]} queries - Query string array
       */
      function sortAtRules(queries) {
        if (typeof sort !== 'function') {
          return queries.sort(sort === 'desktop-first' ? sortCSSmq.desktopFirst : sortCSSmq)
        }

        return queries.sort(sort)
      }

      /**
       * Recursively sort CSS media queries
       * @template {AtRule|Root} T
       * @param {T} localRoot - Root or atRule instance
       */
      function recursivelySort(localRoot){
        /** @type {{[key: string]: AtRule}} */
        const atRules = {};

        localRoot.walkAtRules(pattern, atRule => {
          const atRuleIndex = localRoot.index(atRule)
          const query = atRule.params;

          if (atRuleIndex === -1 || onlyTopLevel && atRule.parent && atRule.parent.type !== 'root') return;

          if (!atRules[query]) {
            atRules[query] = new AtRule({
              name: atRule.name,
              params: atRule.params,
              source: atRule.source
            })
          }

          atRules[query].append(atRule.nodes);

          atRule.remove();
        })

        const atRulesKeys = Object.keys(atRules);

        if (!atRulesKeys.length) return;

        sortAtRules(atRulesKeys).forEach(query => {
          if (recursive) recursivelySort(atRules[query]);

          localRoot.append(atRules[query]);
        });
      }

      recursivelySort(root);
    }
  }
}
module.exports.postcss = true
