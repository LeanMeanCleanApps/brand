// The ring mark is drawn on a 1024 unit canvas centred on 512. Angles are degrees clockwise from 12 o'clock.
// Each ring is cut by straight, parallel-sided gaps, so a gap is the same width from its inner edge to its outer edge.

export const full = {
  core: 104,
  gap: 20,
  rings: [
    { id: 'r1', inner: 130, outer: 200, cuts: [0, 45, 90, 135, 180, 225, 270, 315] },
    { id: 'r2', inner: 220, outer: 274, cuts: [0, 45, 135, 180, 225, 315] },
    { id: 'r3', inner: 294, outer: 364, cuts: [0, 45, 90, 135, 180, 225, 270, 315] },
    { id: 'r4', inner: 384, outer: 424, cuts: [0, 45, 90, 135, 180, 225, 270, 315] },
    { id: 'r5', inner: 444, outer: 480, cuts: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] },
  ],
};

// For 32px and below: the core and two rings with wider cuts, so the shape survives the downscale.
export const small = {
  core: 150,
  gap: 64,
  rings: [
    { id: 'r1', inner: 214, outer: 330, cuts: [0, 45, 135, 180, 225, 315] },
    { id: 'r3', inner: 394, outer: 500, cuts: [0, 45, 90, 135, 180, 225, 270, 315] },
  ],
};

const C = 512;
const n = (v) => Number(v.toFixed(2));
const pt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [n(C + r * Math.sin(a)), n(C - r * Math.cos(a))];
};

export function* segments(geometry) {
  for (const ring of geometry.rings) {
    const cuts = [...ring.cuts].sort((a, b) => a - b);
    for (let i = 0; i < cuts.length; i++) {
      const start = cuts[i];
      let end = cuts[(i + 1) % cuts.length];
      if (end <= start) end += 360;
      const mid = ((start + end) / 2) % 360;
      yield { ring: ring.id, index: i, start, end, inner: ring.inner, outer: ring.outer, side: mid > 180 ? 'left' : 'right' };
    }
  }
}

export function segmentPath(seg, gap) {
  const dOut = (Math.asin(gap / 2 / seg.outer) * 180) / Math.PI;
  const dIn = (Math.asin(gap / 2 / seg.inner) * 180) / Math.PI;
  const [a, b] = [seg.start + dOut, seg.end - dOut];
  const [c, d] = [seg.end - dIn, seg.start + dIn];
  const largeOut = b - a > 180 ? 1 : 0;
  const largeIn = c - d > 180 ? 1 : 0;
  const p1 = pt(seg.outer, a), p2 = pt(seg.outer, b), p3 = pt(seg.inner, c), p4 = pt(seg.inner, d);
  return `M${p1[0]} ${p1[1]}A${seg.outer} ${seg.outer} 0 ${largeOut} 1 ${p2[0]} ${p2[1]}L${p3[0]} ${p3[1]}A${seg.inner} ${seg.inner} 0 ${largeIn} 0 ${p4[0]} ${p4[1]}Z`;
}
