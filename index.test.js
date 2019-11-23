let fs = require('fs')
let postcss = require('postcss')

let plugin = require('./')

async function run (input, output, opts) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('simple #1. mobile-first', async () => {
  let input = fs.readFileSync('./test/s1-mobile.in.css', 'utf8')
  let output = fs.readFileSync('./test/s1-mobile.out.css', 'utf8')
  await run(input, output, { sort: 'mobile-first' })
})

it('simple #1. desktop-first', async () => {
  let input = fs.readFileSync('./test/s1-desktop.in.css', 'utf8')
  let output = fs.readFileSync('./test/s1-desktop.out.css', 'utf8')
  await run(input, output, { sort: 'desktop-first' })
})

it('simple #2. mobile-first', async () => {
  let input = fs.readFileSync('./test/s2-mobile.in.css', 'utf8')
  let output = fs.readFileSync('./test/s2-mobile.out.css', 'utf8')
  await run(input, output, { sort: 'mobile-first' })
})

it('simple #2. desktop-first', async () => {
  let input = fs.readFileSync('./test/s2-desktop.in.css', 'utf8')
  let output = fs.readFileSync('./test/s2-desktop.out.css', 'utf8')
  await run(input, output, { sort: 'desktop-first' })
})

it('without dimension #1. mobile-first', async () => {
  let input = fs.readFileSync('./test/wd1-mobile.in.css', 'utf8')
  let output = fs.readFileSync('./test/wd1-mobile.out.css', 'utf8')
  await run(input, output, { sort: 'mobile-first' })
})

it('without dimension #1. desktop-first', async () => {
  let input = fs.readFileSync('./test/wd1-desktop.in.css', 'utf8')
  let output = fs.readFileSync('./test/wd1-desktop.out.css', 'utf8')
  await run(input, output, { sort: 'desktop-first' })
})

it('mixed #1. mobile-first', async () => {
  let input = fs.readFileSync('./test/mixed-mobile.in.css', 'utf8')
  let output = fs.readFileSync('./test/mixed-mobile.out.css', 'utf8')
  await run(input, output, { sort: 'mobile-first' })
})

it('mixed #1. desktop-first', async () => {
  let input = fs.readFileSync('./test/mixed-desktop.in.css', 'utf8')
  let output = fs.readFileSync('./test/mixed-desktop.out.css', 'utf8')
  await run(input, output, { sort: 'desktop-first' })
})
