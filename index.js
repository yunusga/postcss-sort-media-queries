let postcss = require('postcss')
const sortCSSmq = require('sort-css-media-queries')

module.exports = postcss.plugin('postcss-sort-media-queries', (opts = { }) => {
  opts = Object.assign({
    sort: 'mobile-first'
  }, opts)

  return root => {
    let atRules = {}

    function sortAtRules (queries, sort) {
      if (typeof sort !== 'function') {
        sort = (sort === 'desktop-first') ? sortCSSmq.desktopFirst : sortCSSmq
      }

      return queries.sort(sort)
    }

    root.walkAtRules('media', atRule => {
      let query = atRule.params

      if (!atRules[query]) {
        atRules[query] = postcss.atRule({
          name: atRule.name,
          params: atRule.params
        })
      }

      atRule.nodes.forEach(node => {
        atRules[query].append(node.clone())
      })

      atRule.remove()
    })

    sortAtRules(Object.keys(atRules), opts.sort).forEach(query => {
      root.append(atRules[query])
    })
  }
})
