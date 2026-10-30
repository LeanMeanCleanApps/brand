import { full, small, segments, segmentPath } from './geometry.mjs';
import { neutrals } from './brand.mjs';

const layer = (layered, label, inner, id) =>
  layered ? `<g id="${id}" inkscape:groupmode="layer" inkscape:label="${label}">${inner}</g>` : inner;

// The rings and core, outermost ring first, without any background.
export function markBody({ fill, core, size = 'full', layered = false }) {
  const g = size === 'small' ? small : full;
  const rings = new Map();
  for (const seg of segments(g)) {
    if (!rings.has(seg.ring)) rings.set(seg.ring, []);
    rings.get(seg.ring).push(`<path d="${segmentPath(seg, g.gap)}" fill="${fill(seg)}"/>`);
  }
  const body = [...rings].reverse().map(([id, paths]) => layer(layered, `Ring ${id.slice(1)}`, paths.join(''), `ring-${id.slice(1)}`));
  body.push(layer(layered, 'Core', `<circle cx="512" cy="512" r="${g.core}" fill="${core}"/>`, 'core'));
  return body.join('');
}

export const FRAME_SCALE = { none: 1, tile: 0.86, square: 0.86, circle: 0.94 };

// frame: 'none' (transparent), 'tile' (rounded square), 'square' (full bleed, for avatars the platform crops), 'circle'.
export function logoSvg({ fill, core, frame = 'none', size = 'full', frameColour = neutrals.ink, title, layered = false, scale }) {
  const s = scale ?? FRAME_SCALE[frame];
  const out = [];
  if (title) out.push(`<title>${title}</title>`);
  const bg = {
    tile: `<rect width="1024" height="1024" rx="224" fill="${frameColour}"/>`,
    square: `<rect width="1024" height="1024" fill="${frameColour}"/>`,
    circle: `<circle cx="512" cy="512" r="512" fill="${frameColour}"/>`,
  }[frame];
  if (bg) out.push(layer(layered, 'Background', bg, 'background'));
  const t = s === 1 ? '' : ` transform="translate(512 512) scale(${s}) translate(-512 -512)"`;
  out.push(`<g${t}>${markBody({ fill, core, size, layered })}</g>`);
  const label = title ? ` role="img" aria-label="${title}"` : '';
  const ns = layered ? ' xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg"${ns} viewBox="0 0 1024 1024" width="1024" height="1024"${label}>${out.join('')}</svg>\n`;
}
