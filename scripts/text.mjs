// Turns text into SVG outlines with HarfBuzz, so the social templates look the same everywhere,
// with or without the fonts installed.
import fs from 'node:fs';
import * as hb from 'harfbuzzjs';

const root = new URL('../fonts/', import.meta.url);
const files = {
  display: 'bricolagegrotesque/BricolageGrotesque[opsz,wdth,wght].ttf',
  body: 'inter/Inter[opsz,wght].ttf',
  mono: 'jetbrainsmono/JetBrainsMono[wght].ttf',
};
export const families = { display: 'Bricolage Grotesque', body: 'Inter', mono: 'JetBrains Mono' };

const faces = {};
function face(role) {
  if (!faces[role]) {
    const data = fs.readFileSync(new URL(files[role], root));
    const blob = new hb.Blob(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
    faces[role] = new hb.Face(blob, 0);
  }
  return faces[role];
}

const fonts = new Map();
function font(role, weight, size) {
  const opsz = role === 'display' ? Math.min(96, Math.max(12, size)) : role === 'body' ? Math.min(32, Math.max(14, size)) : null;
  const key = `${role}/${weight}/${opsz}`;
  if (!fonts.has(key)) {
    const f = new hb.Font(face(role));
    const v = [new hb.Variation('wght', weight)];
    if (opsz) v.push(new hb.Variation('opsz', opsz));
    f.setVariations(v);
    fonts.set(key, { font: f, glyphs: new Map() });
  }
  return fonts.get(key);
}

function shape({ text, role, weight, size, tracking = 0 }) {
  const { font: f, glyphs } = font(role, weight, size);
  const upem = face(role).upem;
  const scale = size / upem;
  const buffer = new hb.Buffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  hb.shape(f, buffer);
  const infos = buffer.getGlyphInfos();
  const positions = buffer.getGlyphPositions();
  const out = [];
  let x = 0;
  infos.forEach((info, i) => {
    const gid = info.codepoint;
    if (!glyphs.has(gid)) glyphs.set(gid, f.glyphToPath(gid));
    const d = glyphs.get(gid);
    if (d) out.push({ d, x: x + positions[i].xOffset * scale, y: -positions[i].yOffset * scale });
    x += positions[i].xAdvance * scale + tracking * size;
  });
  buffer.destroy?.();
  return { glyphs: out, width: x - tracking * size, scale };
}

export const measure = (opts) => shape(opts).width;

// Greedy word wrap. Returns the lines that fit in maxWidth.
export function wrap(opts, maxWidth) {
  const words = opts.text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (line && measure({ ...opts, text: next }) > maxWidth) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

const r = (v) => Number(v.toFixed(2));

// Outlined text: one group per line, baseline at y.
export function outline({ x, y, fill, ...opts }) {
  const { glyphs, scale } = shape(opts);
  const paths = glyphs.map((g) => `<path transform="translate(${r(g.x / scale)} ${r(-g.y / scale)})" d="${g.d}"/>`).join('');
  return `<g fill="${fill}" transform="translate(${r(x)} ${r(y)}) scale(${r(scale * 1e4) / 1e4} ${-r(scale * 1e4) / 1e4})">${paths}</g>`;
}

// Live text for the editable source files.
export function live({ x, y, fill, text, role, weight, size, tracking = 0 }) {
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const ls = tracking ? ` letter-spacing="${r(tracking * size)}"` : '';
  return `<text x="${r(x)}" y="${r(y)}" fill="${fill}" font-family="${families[role]}" font-weight="${weight}" font-size="${size}"${ls}>${esc}</text>`;
}
