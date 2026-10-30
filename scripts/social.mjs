// Social templates: repository previews, organisation cards and banners.
// Each one comes out twice: outlined text (looks identical everywhere) and live text (editable).
import { neutrals, scales } from './brand.mjs';
import { markBody } from './logo.mjs';
import { outline, live, measure, wrap } from './text.mjs';

const r = (v) => Number(v.toFixed(2));
const layer = (label, inner) => `<g id="${label.toLowerCase().replace(/\s+/g, '-')}" inkscape:groupmode="layer" inkscape:label="${label}">${inner}</g>`;

// spec: { width, height, kicker, title, tagline, chip, marks: [{ fill, core }], logo: { fill, core }, accent }
export function socialSvg(spec, { editable = false } = {}) {
  const { width: W, height: H } = spec;
  const u = H / 640;
  const text = editable ? live : outline;

  // The mark is cropped by the right edge, centred vertically.
  const D = 1.32 * H;
  const cx = W - 0.32 * H;
  const cy = H / 2;
  const ringLeft = cx - (480 / 1024) * D;
  const left = Math.max(0.12 * H, 0.06 * W);
  const maxWidth = ringLeft - left - 28 * u;

  const kicker = spec.kicker && { text: spec.kicker.toUpperCase(), role: 'mono', weight: 600, size: 22 * u, tracking: 0.14 };
  let title = { text: spec.title, role: 'display', weight: 800, size: 84 * u, tracking: -0.03 };
  let titleLines = wrap(title, maxWidth);
  while ((titleLines.length > 2 || titleLines.some((l) => measure({ ...title, text: l }) > maxWidth)) && title.size > 56 * u) {
    title = { ...title, size: title.size - 2 * u };
    titleLines = wrap(title, maxWidth);
  }
  const tag = spec.tagline && { text: spec.tagline, role: 'body', weight: 400, size: 29 * u };
  const tagLines = tag ? wrap(tag, maxWidth) : [];
  let chip = spec.chip && { text: spec.chip, role: 'mono', weight: 600, size: 19 * u };
  if (chip) while (measure(chip) + 46 * u > maxWidth && chip.size > 13 * u) chip = { ...chip, size: chip.size - 0.5 * u };

  // Stack the block and centre it vertically.
  const titleLead = title.size * 0.98;
  const tagLead = 29 * u * 1.35;
  const tile = 56 * u;
  const parts = [];
  if (kicker) parts.push({ kind: 'kicker', h: kicker.size, gap: 30 * u });
  parts.push({ kind: 'title', h: titleLead * titleLines.length, gap: 28 * u });
  if (tag) parts.push({ kind: 'tagline', h: tagLead * tagLines.length, gap: 38 * u });
  if (chip) parts.push({ kind: 'chip', h: chip.size + 32 * u, gap: 0 });
  else if (spec.marks) parts.push({ kind: 'marks', h: tile, gap: 0 });
  const total = parts.reduce((a, p, i) => a + p.h + (i < parts.length - 1 ? p.gap : 0), 0);
  let y = (H - total) / 2;

  const layers = { kicker: '', title: '', tagline: '', footer: '' };
  for (const p of parts) {
    if (p.kind === 'kicker') layers.kicker = text({ ...kicker, x: left, y: y + kicker.size * 0.8, fill: spec.accent[300] });
    if (p.kind === 'title') titleLines.forEach((l, i) => (layers.title += text({ ...title, text: l, x: left - 0.04 * title.size, y: y + title.size * 0.8 + i * titleLead, fill: neutrals.paper })));
    if (p.kind === 'tagline') tagLines.forEach((l, i) => (layers.tagline += text({ ...tag, text: l, x: left, y: y + tag.size * 0.95 + i * tagLead, fill: scales.slate[300] })));
    if (p.kind === 'chip') {
      const w = measure(chip) + 46 * u;
      layers.footer = `<rect x="${r(left)}" y="${r(y)}" width="${r(w)}" height="${r(p.h)}" rx="${r(12 * u)}" fill="${spec.accent[300]}"/>` + text({ ...chip, x: left + 23 * u, y: y + 16 * u + chip.size * 0.78, fill: neutrals.ink });
    }
    if (p.kind === 'marks') {
      layers.footer = spec.marks
        .map((m, i) => {
          const x = left + i * (tile + 14 * u);
          const s = tile / 1024;
          return `<g transform="translate(${r(x)} ${r(y)}) scale(${r(s * 1e4) / 1e4})"><rect width="1024" height="1024" rx="224" fill="${scales.slate[800]}"/><g transform="translate(512 512) scale(0.86) translate(-512 -512)">${markBody({ ...m, size: 'small' })}</g></g>`;
        })
        .join('');
    }
    y += p.h + p.gap;
  }

  const ds = D / 1024;
  const logo = `<g transform="translate(${r(cx - D / 2)} ${r(cy - D / 2)}) scale(${r(ds * 1e4) / 1e4})">${markBody(spec.logo)}</g>`;
  const body = [
    layer('Background', `<rect width="${W}" height="${H}" fill="${neutrals.ink}"/>`),
    layer('Logo', logo),
    kicker ? layer('Kicker', layers.kicker) : '',
    layer('Title', layers.title),
    tag ? layer('Tagline', layers.tagline) : '',
    layers.footer ? layer(chip ? 'Command' : 'Templates', layers.footer) : '',
  ].join('');
  const label = ` role="img" aria-label="${spec.title}${spec.tagline ? `. ${spec.tagline}` : ''}"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"${label}><clipPath id="frame"><rect width="${W}" height="${H}"/></clipPath><g clip-path="url(#frame)">${body}</g></svg>\n`;
}
