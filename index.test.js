let fs = require('fs')
let postcss = require('postcss')
let nested = require('postcss-nested')
let mediaMinMax = require('postcss-media-minmax')
let autoprefixer = require('autoprefixer')
let flexbugsFixes = require('postcss-flexbugs-fixes')

let plugin = require('./')

async function run (input, output, opts) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

async function nestedRun (input, output, opts) {
  let result = await postcss([nested, plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

async function mediaMinmaxBeforeNestedRun (input, output, opts) {
  let result = await postcss([autoprefixer, flexbugsFixes, mediaMinMax, nested, plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

async function mediaMinmaxAfterNestedRun (input, output, opts) {
  let result = await postcss([autoprefixer, flexbugsFixes, nested, mediaMinMax, plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('[mf] simple #1', async () => {
  let input = fs.readFileSync('./test/s1-mobile.in.css', 'utf8')
  let output = fs.readFileSync('./test/s1-mobile.out.css', 'utf8')
  await run(input, output, { sort: 'mobile-first' })
})

it('[df] simple #1', async () => {
  let input = fs.readFileSync('./test/s1-desktop.in.css', 'utf8')
  let output = fs.readFileSync('./test/s1-desktop.out.css', 'utf8')
  await run(input, output, { sort: 'desktop-first' })
})

it('[mf] simple #2', async () => {
  let input = fs.readFileSync('./test/s2-mobile.in.css', 'utf8')
  let output = fs.readFileSync('./test/s2-mobile.out.css', 'utf8')
  await run(input, output, { sort: 'mobile-first' })
})

it('[df] simple #2', async () => {
  let input = fs.readFileSync('./test/s2-desktop.in.css', 'utf8')
  let output = fs.readFileSync('./test/s2-desktop.out.css', 'utf8')
  await run(input, output, { sort: 'desktop-first' })
})

it('[mf] without dimension #1', async () => {
  let input = fs.readFileSync('./test/wd1-mobile.in.css', 'utf8')
  let output = fs.readFileSync('./test/wd1-mobile.out.css', 'utf8')
  await run(input, output, { sort: 'mobile-first' })
})

it('[df] without dimension #1', async () => {
  let input = fs.readFileSync('./test/wd1-desktop.in.css', 'utf8')
  let output = fs.readFileSync('./test/wd1-desktop.out.css', 'utf8')
  await run(input, output, { sort: 'desktop-first' })
})

it('[mf] mixed #1', async () => {
  let input = fs.readFileSync('./test/mixed-mobile.in.css', 'utf8')
  let output = fs.readFileSync('./test/mixed-mobile.out.css', 'utf8')
  await run(input, output, { sort: 'mobile-first' })
})

it('[df] mixed #1', async () => {
  let input = fs.readFileSync('./test/mixed-desktop.in.css', 'utf8')
  let output = fs.readFileSync('./test/mixed-desktop.out.css', 'utf8')
  await run(input, output, { sort: 'desktop-first' })
})

it('[mf] configuration(mixed #1): unitlessMqAlwaysFirst: FALSE', async () => {
  let input = fs.readFileSync('./test/configuration/false-mixed-mobile.in.css', 'utf8')
  let output = fs.readFileSync('./test/configuration/false-mixed-mobile.out.css', 'utf8')

  let options = {
    configuration: {
      unitlessMqAlwaysFirst: false,
    }
  }
  await run(input, output, options)
})

it('[mf] configuration(mixed #1): unitlessMqAlwaysFirst: TRUE', async () => {
  let input = fs.readFileSync('./test/configuration/true-mixed-mobile.in.css', 'utf8')
  let output = fs.readFileSync('./test/configuration/true-mixed-mobile.out.css', 'utf8')

  let options = {
    configuration: {
      unitlessMqAlwaysFirst: true,
    }
  }
  await run(input, output, options)
})

it('[df] configuration(mixed #2): unitlessMqAlwaysFirst: FALSE', async () => {
  let input = fs.readFileSync('./test/configuration/false-mixed-desktop.in.css', 'utf8')
  let output = fs.readFileSync('./test/configuration/false-mixed-desktop.out.css', 'utf8')

  let options = {
    sort: 'desktop-first',
    configuration: {
      unitlessMqAlwaysFirst: false,
    }
  }
  await run(input, output, options)
})

it('[df] configuration(mixed #2): unitlessMqAlwaysFirst: TRUE', async () => {
  let input = fs.readFileSync('./test/configuration/true-mixed-desktop.in.css', 'utf8')
  let output = fs.readFileSync('./test/configuration/true-mixed-desktop.out.css', 'utf8')

  let options = {
    sort: 'desktop-first',
    configuration: {
      unitlessMqAlwaysFirst: true,
    }
  }
  await run(input, output, options)
})

it('postcss nested', async () => {
  let input = fs.readFileSync('./test/postcss.nested.in.css', 'utf8')
  let output = fs.readFileSync('./test/postcss.nested.out.css', 'utf8')
  await nestedRun(input, output)
})

it('postcss media minmax -> nested', async () => {
  let input = fs.readFileSync('./test/postcss.media.minmax.in.css', 'utf8')
  let output = fs.readFileSync('./test/postcss.media.minmax.out.css', 'utf8')
  await mediaMinmaxBeforeNestedRun(input, output)
})

it('postcss nested -> media minmax', async () => {
  let input = fs.readFileSync('./test/postcss.media.minmax.in.css', 'utf8')
  let output = fs.readFileSync('./test/postcss.media.minmax.out.css', 'utf8')
  await mediaMinmaxAfterNestedRun(input, output)
})

it('only top level', async () => {
  let input = fs.readFileSync('./test/only-top-level.in.css', 'utf8')
  let output = fs.readFileSync('./test/only-top-level.out.css', 'utf8')
  await run(input, output, { onlyTopLevel: true })
})
