import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import postcss from 'postcss'
import prettier from 'prettier'

const fixturesDir = resolve('tests/fixtures')

// Read a fixture file by name from the fixtures directory
function read(name) {
  return readFileSync(join(fixturesDir, name), 'utf8');
}

// Normalize CSS formatting using Prettier (returns trimmed string)
async function normalize(css) {
  return (await prettier.format(css, { parser: 'css' })).trim();
}

// Run a single plugin test: process input, normalize output, and compare
async function runTest(plugin, name, options = {}) {
  const input = read(`${name}.in.css`)
  const expected = read(`${name}.out.css`)

  const result = await postcss([plugin(options)])
    .process(input, { from: undefined })

  const actual = await normalize(result.css)
  const expectedFormatted = await normalize(expected)

  // Write optional debug output into a `.result.css` file in fixtures
  writeFileSync(
    join(fixturesDir, `${name}.result.css`),
    actual
  )

  expect(actual).toBe(expectedFormatted)
}

// Load both builds so tests run against ESM and CJS bundles
const builds = {
  ESM: () => import('../src/index.js'),
  CJS: () => import('../build/wrapper.cjs'),
}

// Test cases (defined once and reused for both builds)
const testCases = [
  {
    title: 'mixed #1. mobile first. unitlessMqAlwaysFirst: FALSE',
    fixture: 'scmq1.mobile.umaf.false',
    options: {
      configuration: { unitlessMqAlwaysFirst: false }
    }
  },
  {
    title: 'mixed #1. mobile first. unitlessMqAlwaysFirst: TRUE',
    fixture: 'scmq1.mobile.umaf.true',
    options: {
      configuration: { unitlessMqAlwaysFirst: true }
    }
  },
  {
    title: 'mixed #2. desktop first. unitlessMqAlwaysFirst: FALSE',
    fixture: 'scmq2.desktop.umaf.false',
    options: {
      sort: 'desktop-first',
      configuration: { unitlessMqAlwaysFirst: false }
    }
  },
  {
    title: 'mixed #2. desktop first. unitlessMqAlwaysFirst: TRUE',
    fixture: 'scmq2.desktop.umaf.true',
    options: {
      sort: 'desktop-first',
      configuration: { unitlessMqAlwaysFirst: true }
    }
  },
  {
    title: 'Ultra. mobile first. unitlessMqAlwaysFirst: FALSE',
    fixture: 'ultra.mobile.umaf.false',
    options: {
      configuration: { unitlessMqAlwaysFirst: false }
    }
  },
]

// Run the same set of tests for both ESM and CJS builds
for (const [buildName, load] of Object.entries(builds)) {
  describe(`(${buildName}) postcss-sort-media-queries`, () => {
    let plugin

    beforeAll(async () => {
      const mod = await load()
      plugin = mod.default
    })

    for (const testCase of testCases) {
      it(testCase.title, async () => {
        await runTest(plugin, testCase.fixture, testCase.options)
      })
    }
  })
}
