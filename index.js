const sortCSSmq = require('sort-css-media-queries')

module.exports = (opts = {}) => {
  opts = Object.assign(
    {
      sort: 'mobile-first'
    },
    opts
  )

  return {
    postcssPlugin: 'postcss-sort-media-queries',
    prepare () {
      let atRules = {}

      function sortAtRules (queries, sort) {
        if (typeof sort !== 'function') {
          sort = sort === 'desktop-first' ? sortCSSmq.desktopFirst : sortCSSmq
        }

        return queries.sort(sort)
      }
      return {
        AtRule: {
          media: (atRule, { AtRule }) => {
            let query = atRule.params

            if (!atRules[query]) {
              atRules[query] = new AtRule({
                name: atRule.name,
                params: atRule.params,
                source: atRule.source
              })
            }

            atRule.nodes.forEach(node => {
              atRules[query].append(node.clone())
            })

            atRule.remove()
          }
        },
        OnceExit (root) {
          sortAtRules(Object.keys(atRules), opts.sort).forEach(query => {
            root.append(atRules[query])
          })
        }
      }
    }
  }
}
module.exports.postcss = true
