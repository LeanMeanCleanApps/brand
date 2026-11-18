// The LinkedIn company page cover. LinkedIn shows it at 1128 x 191 and puts the page logo over
// the bottom-left corner, so the text starts to the right of the logo and the mark stays clear
// of the edges the mobile app trims.
import { neutrals, scales, org } from './brand.mjs';
import { markBody } from './logo.mjs';
import { outline, live } from './text.mjs';

const W = 1128;
const H = 191;
const r = (v) => Number(v.toFixed(2));
const layer = (label, inner) => `<g id="${label.toLowerCase().replace(/\s+/g, '-')}" inkscape:groupmode="layer" inkscape:label="${label}">${inner}</g>`;

// spec: { kicker, title, tagline, logo: { fill, core } }
export function linkedinCoverSvg(spec, { editable = false } = {}) {
  const text = editable ? live : outline;
  const left = 300; // the page logo covers roughly x 34 to 262 from y 70 down
  const D = 150;
  const logo = `<g transform="translate(${W - 120 - D} ${r((H - D) / 2)}) scale(${r((D / 1024) * 1e4) / 1e4})">${markBody(spec.logo)}</g>`;
  const body = [
    layer('Background', `<rect width="${W}" height="${H}" fill="${neutrals.ink}"/>`),
    layer('Logo', logo),
    layer('Kicker', text({ text: spec.kicker.toUpperCase(), role: 'mono', weight: 600, size: 13, tracking: 0.14, x: left, y: 50, fill: scales.slate[300] })),
    layer('Title', text({ text: spec.title, role: 'display', weight: 800, size: 46, tracking: -0.03, x: left - 2, y: 100, fill: neutrals.paper })),
    layer('Tagline', text({ text: spec.tagline, role: 'body', weight: 400, size: 19, x: left, y: 134, fill: scales.slate[300] })),
  ].join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${spec.title}. ${spec.tagline}">${body}</svg>\n`;
}

export const linkedinCover = { width: W, height: H };
