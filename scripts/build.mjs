// Generates every asset in assets/ and every token file in tokens/ from scripts/brand.mjs.
// Run with `npm run build`. The output is committed, and CI checks it is up to date.
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { neutrals, scales, org, templates } from './brand.mjs';
import { tonal, spectrum, mono, DARK_STEPS, LIGHT_STEPS, SLATE_DARK_STEPS, SLATE_LIGHT_STEPS } from './colours.mjs';
import { logoSvg, markBody } from './logo.mjs';
import { socialSvg } from './social.mjs';
import { outline } from './text.mjs';
import { writeTokens } from './tokens.mjs';

const root = path.resolve(import.meta.dirname, '..');
const out = (...p) => path.join(root, ...p);

fs.rmSync(out('assets'), { recursive: true, force: true });
fs.rmSync(out('tokens'), { recursive: true, force: true });

const write = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
};
const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();

// A favicon.ico holding PNG images (supported by every current browser).
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
}

// ---------- Marks ----------

const marks = [
  { key: 'org-slate', name: `${org.name} (slate)`, dark: tonal('slate', SLATE_DARK_STEPS), light: tonal('slate', SLATE_LIGHT_STEPS), accent: scales.slate },
  { key: 'org-leaf', name: `${org.name} (leaf)`, dark: tonal('leaf', DARK_STEPS), light: tonal('leaf', LIGHT_STEPS), accent: scales.leaf },
  { key: 'org-spectrum', name: `${org.name} (spectrum)`, dark: spectrum(DARK_STEPS), light: spectrum(LIGHT_STEPS), accent: scales.slate },
  ...templates.map((t) => ({ key: t.key, name: t.name, dark: tonal(t.hue, DARK_STEPS), light: tonal(t.hue, LIGHT_STEPS), accent: scales[t.hue], template: t })),
];

const SMALL_MAX = 48;
const sizes = {
  square: [16, 32, 48, 64, 128, 180, 192, 256, 512, 1024],
  tile: [16, 32, 48, 64, 128, 256, 512, 1024],
  circle: [256, 512, 1024],
  none: [256, 512, 1024],
  light: [256, 512, 1024],
};

for (const m of marks) {
  const dir = (...p) => out('assets', 'logos', m.key, ...p);
  const dark = { fill: m.dark, core: neutrals.paper, title: m.name };
  const light = { fill: m.light, core: neutrals.ink, title: m.name };
  const svgs = {
    [m.key]: logoSvg(dark),
    [`${m.key}-light`]: logoSvg(light),
    [`${m.key}-tile`]: logoSvg({ ...dark, frame: 'tile' }),
    [`${m.key}-square`]: logoSvg({ ...dark, frame: 'square' }),
    [`${m.key}-circle`]: logoSvg({ ...dark, frame: 'circle' }),
    [`${m.key}-small`]: logoSvg({ ...dark, size: 'small' }),
    [`${m.key}-small-light`]: logoSvg({ ...light, size: 'small' }),
    [`${m.key}-small-tile`]: logoSvg({ ...dark, size: 'small', frame: 'tile' }),
    [`${m.key}-small-square`]: logoSvg({ ...dark, size: 'small', frame: 'square' }),
    [`${m.key}-layered`]: logoSvg({ ...dark, frame: 'tile', layered: true }),
  };
  for (const [name, svg] of Object.entries(svgs)) write(dir('svg', `${name}.svg`), svg);

  const pick = (frame, size) => svgs[`${m.key}${size <= SMALL_MAX ? '-small' : ''}${frame === 'none' ? '' : `-${frame}`}`];
  for (const s of sizes.square) write(dir('png', `${m.key}-square-${s}.png`), png(pick('square', s), s));
  for (const s of sizes.tile) write(dir('png', `${m.key}-tile-${s}.png`), png(pick('tile', s), s));
  for (const s of sizes.circle) write(dir('png', `${m.key}-circle-${s}.png`), png(svgs[`${m.key}-circle`], s));
  for (const s of sizes.none) write(dir('png', `${m.key}-${s}.png`), png(svgs[m.key], s));
  for (const s of sizes.light) write(dir('png', `${m.key}-light-${s}.png`), png(svgs[`${m.key}-light`], s));

  // Ready-made icons for a website: favicons, the Apple touch icon and web manifest icons.
  write(dir('web', 'favicon.svg'), svgs[`${m.key}-small-tile`]);
  write(dir('web', 'favicon.ico'), ico([16, 32, 48].map((size) => ({ size, data: png(svgs[`${m.key}-small-tile`], size) }))));
  write(dir('web', 'apple-touch-icon.png'), png(svgs[`${m.key}-square`], 180));
  write(dir('web', 'icon-192.png'), png(svgs[`${m.key}-square`], 192));
  write(dir('web', 'icon-512.png'), png(svgs[`${m.key}-square`], 512));
  write(dir('web', 'icon-maskable-512.png'), png(logoSvg({ ...dark, frame: 'square', scale: 0.72 }), 512));
}

// One silhouette in a single colour, for print, embossing and watermarks.
for (const [name, colour] of [['ink', neutrals.ink], ['paper', neutrals.paper]]) {
  const dir = (...p) => out('assets', 'logos', 'mono', ...p);
  const fullSvg = logoSvg({ fill: mono(colour), core: colour, title: org.name });
  const smallSvg = logoSvg({ fill: mono(colour), core: colour, size: 'small', title: org.name });
  write(dir('svg', `mono-${name}.svg`), fullSvg);
  write(dir('svg', `mono-${name}-small.svg`), smallSvg);
  for (const s of [256, 512, 1024]) write(dir('png', `mono-${name}-${s}.png`), png(fullSvg, s));
  for (const s of [16, 32, 48]) write(dir('png', `mono-${name}-small-${s}.png`), png(smallSvg, s));
}

// ---------- Social templates ----------

const byKey = Object.fromEntries(marks.map((m) => [m.key, m]));
const current = templates.filter((t) => !t.reserved);
const familyMarks = current.map((t) => ({ fill: byKey[t.key].dark, core: neutrals.paper }));

const socials = [
  ...current.map((t) => ({
    file: t.repo,
    width: 1280,
    height: 640,
    kicker: org.name,
    title: t.name,
    tagline: `Clean Architecture for ${t.what}, minus the ceremony.`,
    chip: `dotnet new install ${t.package}`,
    logo: { fill: byKey[t.key].dark, core: neutrals.paper },
    accent: scales[t.hue],
  })),
  ...['slate', 'leaf', 'spectrum'].map((v) => ({
    file: `${org.handle}-${v}`,
    width: 1280,
    height: 640,
    kicker: 'Open source templates for .NET',
    title: org.name,
    tagline: org.tagline,
    marks: familyMarks,
    logo: { fill: byKey[`org-${v}`].dark, core: neutrals.paper },
    accent: byKey[`org-${v}`].accent,
  })),
  {
    file: 'brand',
    width: 1280,
    height: 640,
    kicker: org.name,
    title: 'Brand',
    tagline: 'Logos, colours, type and social templates for every template we make.',
    marks: familyMarks,
    logo: { fill: byKey['org-spectrum'].dark, core: neutrals.paper },
    accent: scales.slate,
  },
  {
    file: 'banner',
    width: 1500,
    height: 500,
    title: org.name,
    tagline: org.tagline,
    marks: familyMarks,
    logo: { fill: byKey['org-spectrum'].dark, core: neutrals.paper },
    accent: scales.slate,
  },
  {
    file: 'og-image',
    width: 1200,
    height: 630,
    kicker: 'Open source templates for .NET',
    title: org.name,
    tagline: org.tagline,
    marks: familyMarks,
    logo: { fill: byKey['org-spectrum'].dark, core: neutrals.paper },
    accent: scales.slate,
  },
];

for (const s of socials) {
  const svg = socialSvg(s);
  write(out('assets', 'social', 'svg', `${s.file}.svg`), svg);
  write(out('assets', 'social', 'source', `${s.file}.svg`), socialSvg(s, { editable: true }));
  write(out('assets', 'social', 'png', `${s.file}.png`), png(svg, s.width));
}

// ---------- README banners ----------
// A short strip for the top of each template's README and NuGet page. Dark, so it reads on light and dark pages alike.

for (const t of current) {
  const spec = {
    width: 1280,
    height: 320,
    scale: 0.8,
    radius: 20,
    kicker: org.name,
    title: t.name,
    tagline: `Clean Architecture for ${t.what}, minus the ceremony.`,
    logo: { fill: byKey[t.key].dark, core: neutrals.paper },
    accent: scales[t.hue],
  };
  const svg = socialSvg(spec);
  write(out('assets', 'banners', 'svg', `${t.key}.svg`), svg);
  write(out('assets', 'banners', 'source', `${t.key}.svg`), socialSvg(spec, { editable: true }));
  write(out('assets', 'banners', 'png', `${t.key}.png`), png(svg, 1280));
}

// ---------- Preview for the README ----------

{
  const W = 1600;
  const H = 900;
  const short = { minimalapi: 'Minimal API', webapi: 'Web API', graphql: 'GraphQL', mcp: 'MCP', lambda: 'Lambda', grpc: 'gRPC', worker: 'Worker', cli: 'CLI' };
  const cell = (x, y, size, m, label, note) => {
    const s = size / 1024;
    const name = outline({ text: label, role: 'body', weight: 600, size: 24, x: x + 8, y: y + size + 34, fill: scales.slate[100] });
    const sub = note ? outline({ text: note, role: 'body', weight: 400, size: 20, x: x + 8, y: y + size + 62, fill: scales.slate[400] }) : '';
    return `<g transform="translate(${x} ${y}) scale(${s})">${markBody({ fill: m.dark, core: neutrals.paper })}</g>${name}${sub}`;
  };
  const heading =
    outline({ text: org.name, role: 'display', weight: 800, size: 60, x: 80, y: 120, fill: neutrals.paper, tracking: -0.02 }) +
    outline({ text: 'Brand', role: 'body', weight: 400, size: 28, x: 84, y: 168, fill: scales.slate[300] });
  const orgRow = [['org-spectrum', 'Spectrum', 'Default'], ['org-slate', 'Slate', 'Quiet'], ['org-leaf', 'Leaf', 'Alternative']]
    .map(([k, l, n], i) => cell(80 + i * 330, 230, 270, byKey[k], l, n)).join('');
  const tRow = templates.map((t, i) => cell(80 + i * 184, 650, 150, byKey[t.key], short[t.key], t.reserved ? 'Reserved' : null)).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${neutrals.ink}"/>${heading}${orgRow}${tRow}</svg>\n`;
  write(out('assets', 'preview.svg'), svg);
  write(out('assets', 'preview.png'), png(svg, W));
}

writeTokens(out('tokens'));

const count = (dir) => fs.readdirSync(dir, { recursive: true }).filter((f) => fs.statSync(path.join(dir, f)).isFile()).length;
console.log(`Built ${count(out('assets'))} assets and ${count(out('tokens'))} token files.`);
