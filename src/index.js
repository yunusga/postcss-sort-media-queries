import createSort from "sort-css-media-queries/create-sort";
import { nanoid } from "nanoid";

// PostCSS plugin to sort CSS @media rules according to a configurable order.
// The plugin groups top-level and nested media at-rules, merges rules
// with identical queries, and re-inserts them in the desired order.

// Helper that ensures `options.sort` is a function and sorts queries.
function sortAtRules(queries, options, sortCSSmq) {
  if (typeof options.sort !== "function") {
    options.sort =
      options.sort === "desktop-first" ? sortCSSmq.desktopFirst : sortCSSmq;
  }

  return queries.sort(options.sort);
}

function getDepth(node) {
  let depth = 0;

  for (let p = node.parent; p; p = p.parent) {
    depth++;
  }

  return depth;
}

function plugin(options = {}) {
  // Set default options and allow user overrides
  options = Object.assign(
    {
      sort: "mobile-first",
      configuration: false,
    },
    options,
  );

  // Create a sorter based on configuration (from sort-css-media-queries)
  const sortCSSmq = createSort(options.configuration);

  return {
    postcssPlugin: "postcss-sort-media-queries",

    // Execute once after the entire tree has been parsed
    OnceExit(root, { AtRule }) {
      // Collect parent nodes that contain media at-rules. We separate
      // top-level (`root`) parents from nested parents so ordering
      // semantics can be preserved independently.
      let parents = [];

      // Walk all @media at-rules and group their parents
      root.walkAtRules("media", (atRule) => {
        if (!atRule.parent.groupId) {
          let groupId = nanoid();

          atRule.parent.groupId = groupId;

          parents[groupId] = {
            parent: atRule.parent,
            depth: getDepth(atRule.parent),
          };
        }

        return;
      });

      if (!parents) {
        return;
      }

      parents = Object.fromEntries(
        Object.entries(parents).sort(([, a], [, b]) => {
          return b.depth - a.depth;
        }),
      );

      Object.keys(parents).forEach((groupId) => {
        let { parent } = parents[groupId];

        // Filter only @media nodes from the parent's children
        let medias = parent.nodes.filter(
          (node) => node.type === "atrule" && node.name === "media",
        );

        if (!medias) {
          return;
        }

        let atRules = [];

        medias.forEach((atRule) => {
          if (!atRules[atRule.params]) {
            atRules[atRule.params] = new AtRule({
              name: atRule.name,
              params: atRule.params,
              source: atRule.source,
            });
          }

          [...atRule.nodes].forEach((node) => {
            atRules[atRule.params].append(node);
          });

          // Remove the original at-rule since its contents have been
          // merged into `atRules[atRule.params]`.
          atRule.remove();
        });

        // Sort query keys and append merged at-rules back to the parent
        if (atRules) {
          sortAtRules(Object.keys(atRules), options, sortCSSmq).forEach(
            (query) => {
              parent.append(atRules[query]);
            },
          );
        }
      });

      root.walkAtRules("media", (parent) => {
        // Filter only @media nodes from the parent's children
        let medias = parent.nodes.filter(
          (node) => node.type === "atrule" && node.name === "media",
        );

        if (!medias) {
          return;
        }

        medias.forEach((atRule) => {
          parent.append(atRule);
        });
      });
    },
  };
}

plugin.postcss = true;

export default plugin;
