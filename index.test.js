// @ts-check

const fs = require('fs')
const postcss = require('postcss')
const nested = require('postcss-nested')
const mediaMinMax = require('postcss-media-minmax')
const autoprefixer = require('autoprefixer')
const flexbugsFixes = require('postcss-flexbugs-fixes')

const plugin = require('./')

async function run (inputFileName, outputFileName, opts = {}, plugins = []) {
  const input = fs.readFileSync(`./test/${inputFileName}.css`, 'utf8');
  const output = fs.readFileSync(`./test/${outputFileName}.css`, 'utf8');
  const result = await postcss([...plugins, plugin(opts)]).process(input, { from: undefined });

  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

it('[mf] simple #1', async () => {
  await run('s1-mobile.in', 's1-mobile.out', { sort: 'mobile-first' });
});

it('[df] simple #1', async () => {
  await run('s1-desktop.in', 's1-desktop.out', { sort: 'desktop-first' });
});

it('[mf] simple #2', async () => {
  await run('s2-mobile.in', 's2-mobile.out', { sort: 'mobile-first' });
});

it('[df] simple #2', async () => {
  await run('s2-desktop.in', 's2-desktop.out', { sort: 'desktop-first' });
});

it('[mf] without dimension #1', async () => {
  await run('wd1-mobile.in', 'wd1-mobile.out', { sort: 'mobile-first' });
});

it('[df] without dimension #1', async () => {
  await run('wd1-desktop.in', 'wd1-desktop.out', { sort: 'desktop-first' });
});

it('[mf] mixed #1', async () => {
  await run('mixed-mobile.in', 'mixed-mobile.out', { sort: 'mobile-first' });
});

it('[df] mixed #1', async () => {
  await run('mixed-desktop.in', 'mixed-desktop.out', { sort: 'desktop-first' });
});

it('use custom sort function', async () => {
  await run('custom-sort.in', 'custom-sort.out', { sort: (a, b) => a.length < b.length }, []);
});

it('sort recursively', async () => {
  await run('recursive-sort.in', 'recursive-sort.out', { recursive: true }, []);
});

it('[mf] configuration(mixed #1): unitlessMqAlwaysFirst: FALSE', async () => {
  const options = {
    configuration: {
      unitlessMqAlwaysFirst: false,
    }
  }
  await run('configuration/false-mixed-mobile.in', 'configuration/false-mixed-mobile.out', options)
});

it('[mf] configuration(mixed #1): unitlessMqAlwaysFirst: TRUE', async () => {
  const options = {
    configuration: {
      unitlessMqAlwaysFirst: true,
    }
  }
  await run('configuration/true-mixed-mobile.in', 'configuration/true-mixed-mobile.out', options)
});

it('[df] configuration(mixed #2): unitlessMqAlwaysFirst: FALSE', async () => {
  const options = {
    sort: 'desktop-first',
    configuration: {
      unitlessMqAlwaysFirst: false,
    }
  }
  await run('configuration/false-mixed-desktop.in', 'configuration/false-mixed-desktop.out', options)
});

it('[df] configuration(mixed #2): unitlessMqAlwaysFirst: TRUE', async () => {
  const options = {
    sort: 'desktop-first',
    configuration: {
      unitlessMqAlwaysFirst: true,
    }
  }
  await run('configuration/true-mixed-desktop.in', 'configuration/true-mixed-desktop.out', options)
});

it('postcss nested', async () => {
  await run('postcss.nested.in', 'postcss.nested.out', {}, [nested])
});

it('postcss media minmax -> nested', async () => {
  await run('postcss.media.minmax.in', 'postcss.media.minmax.out', {}, [autoprefixer, flexbugsFixes, mediaMinMax, nested])
});

it('postcss nested -> media minmax', async () => {
  await run('postcss.media.minmax.in', 'postcss.media.minmax.out', {}, [autoprefixer, flexbugsFixes, nested, mediaMinMax])
});

it('only top level', async () => {
  await run('only-top-level.in', 'only-top-level.out', { onlyTopLevel: true })
});
