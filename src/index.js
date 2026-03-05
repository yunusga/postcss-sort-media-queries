import postcss from 'postcss';
import createSort from 'sort-css-media-queries/create-sort';

function sortAtRules(queries, options, sortCSSmq) {
  if (typeof options.sort !== 'function') {
    options.sort = options.sort === 'desktop-first' ? sortCSSmq.desktopFirst : sortCSSmq;
  }

  return queries.sort(options.sort);
}

export default (options = {}) => {

  options = Object.assign(
    {
      sort: 'mobile-first',
      configuration: false,
    },
    options
  );

  const sortCSSmq = createSort(options.configuration);

  return {
    postcssPlugin: 'postcss-sort-media-queries',

    OnceExit(root, { AtRule }) {
      let parents = {
        root: [],
        nested: [],
      };

      let processed = Symbol('processed');

      root.walkAtRules('media', (atRule) => {
        if (atRule.parent[processed]) {
          return;
        }

        // root
        if (atRule.parent.type === 'root') {
          parents.root.push(atRule.parent);
        }

        // nested
        if (atRule.parent.type !== 'root') {
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
            n => n.type === 'atrule' && n.name === 'media'
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

export const postcss = true;
