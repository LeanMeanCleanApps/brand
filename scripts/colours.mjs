// Colour rules for the ring mark. A rule takes a segment and returns a fill.
import { scales, neutrals } from './brand.mjs';

// Rings alternate light and dark so they stay distinct, and the left half is one shade lighter than the right.
export const DARK_STEPS = { r1: 300, r2: 500, r3: 400, r4: 300, r5: 500 };
export const SLATE_DARK_STEPS = { r1: 200, r2: 400, r3: 300, r4: 200, r5: 400 };
// On light backgrounds the same pattern moves three shades darker so it holds up against paper.
export const LIGHT_STEPS = { r1: 500, r2: 700, r3: 600, r4: 500, r5: 700 };
export const SLATE_LIGHT_STEPS = { r1: 400, r2: 600, r3: 500, r4: 400, r5: 600 };

const clamp = (s) => Math.min(900, s);

export function tonal(hue, steps) {
  return (seg) => scales[hue][clamp(steps[seg.ring] + (seg.side === 'right' ? 100 : 0))];
}

export const mono = (colour) => () => colour;

export const coreFor = (background) => (background === 'light' ? neutrals.ink : neutrals.paper);

// The multi-colour organisation mark. Every current template hue appears, in the arrangement
// of the original full-colour master, shaded the same way as the single-hue marks.
const SPECTRUM = {
  r1: ['emerald', 'emerald', 'emerald', 'emerald', 'amber', 'amber', 'amber', 'amber'],
  r2: ['blue', 'blue', 'emerald', 'amber', 'amber', 'emerald'],
  r3: ['pink', 'pink', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue'],
  r4: ['pink', 'pink', 'violet', 'violet', 'pink', 'pink', 'amber', 'amber'],
  r5: ['pink', 'pink', 'pink', 'violet', 'violet', 'violet', 'pink', 'pink', 'pink', 'amber', 'amber', 'amber'],
};

export function spectrum(steps) {
  return (seg) => scales[SPECTRUM[seg.ring][seg.index]][clamp(steps[seg.ring] + (seg.side === 'right' ? 100 : 0))];
}
