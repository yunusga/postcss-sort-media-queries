import createSort from 'sort-css-media-queries/create-sort';

// PostCSS plugin to sort CSS @media rules according to a configurable order.
// The plugin groups top-level and nested media at-rules, merges rules
// with identical queries, and re-inserts them in the desired order.

// Helper that ensures `options.sort` is a function and sorts queries.
function sortAtRules(queries, options, sortCSSmq) {
  if (typeof options.sort !== 'function') {
    options.sort = options.sort === 'desktop-first' ? sortCSSmq.desktopFirst : sortCSSmq;
  }

  return queries.sort(options.sort);
}

function plugin(options = {}) {

  // Set default options and allow user overrides
  options = Object.assign(
    {
      sort: 'mobile-first',
      configuration: false,
    },
    options
  );

  // Create a sorter based on configuration (from sort-css-media-queries)
  const sortCSSmq = createSort(options.configuration);

  return {
    postcssPlugin: 'postcss-sort-media-queries',

    // Execute once after the entire tree has been parsed
    OnceExit(root, { AtRule }) {
      // Collect parent nodes that contain media at-rules. We separate
      // top-level (`root`) parents from nested parents so ordering
      // semantics can be preserved independently.
      let parents = {
        root: [],
        nested: [],
      };

      // Symbol used to mark parents that we've already collected
      let processed = Symbol('processed');

      // Walk all @media at-rules and group their parents
      root.walkAtRules('media', (atRule) => {
        if (atRule.parent[processed]) {
          return;
        }

        // If the parent is the root of the document, add to root list
        if (atRule.parent.type === 'root') {
          parents.root.push(atRule.parent);
        }

        // Otherwise treat it as a nested parent
        if (atRule.parent.type !== 'root') {
          parents.nested.push(atRule.parent);
        }

        // Mark this parent so we don't collect it twice
        atRule.parent[processed] = true;

        return;
      });

      // For each parent group, merge and sort its media at-rules
      Object.keys(parents).forEach((type) => {
        if (!parents[type].length) {
          return;
        }

        parents[type].forEach((parent) => {
          // Filter only @media nodes from the parent's children
          let media = parent.nodes.filter(
            n => n.type === 'atrule' && n.name === 'media'
          );

          if (!media) {
            return;
          }

          // Combine at-rules with identical query params into a single
          // AtRule instance, cloning their children to preserve content.
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

            // Remove the original at-rule since its contents have been
            // merged into `atRules[query]`.
            atRule.remove();
          });

          // Sort query keys and append merged at-rules back to the parent
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

export default plugin;
