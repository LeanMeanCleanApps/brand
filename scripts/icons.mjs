// Small icons for the items inside a template, such as the tools, prompts and resources of the MCP server.
// Each one sits on the same ink tile as the logos, drawn flat in the template's hue, with the left side one shade
// lighter than the right and the paper accent standing in for the logo's core, so it reads on light and dark pages.
import { scales, neutrals } from './brand.mjs';

const shapes = {
  // A film frame with a play triangle.
  movie: (light, dark, accent) =>
    `<path d="M212 300a56 56 0 0 1 56-56h244v536H268a56 56 0 0 1-56-56z" fill="${light}"/>` +
    `<path d="M512 244h244a56 56 0 0 1 56 56v424a56 56 0 0 1-56 56H512z" fill="${dark}"/>` +
    `<path d="M428 380v264l216-132z" fill="${accent}"/>`,
  // A head above a pair of shoulders.
  author: (light, dark, accent) =>
    `<circle cx="512" cy="356" r="132" fill="${accent}"/>` +
    `<path d="M512 544c-158 0-268 92-268 216v20h268z" fill="${light}"/>` +
    `<path d="M512 544c158 0 268 92 268 216v20H512z" fill="${dark}"/>`,
  // A star, split down the middle.
  review: (light, dark) =>
    `<path d="M512 196v508L316 808l38-218-158-154 218-32z" fill="${light}"/>` +
    `<path d="M512 196v508l196 104-38-218 158-154-218-32z" fill="${dark}"/>`,
  // Two stacked server units with a status light each.
  server: (light, dark, accent) =>
    [264, 544]
      .map((y) =>
        `<path d="M212 ${y + 48}a48 48 0 0 1 48-48h252v216H260a48 48 0 0 1-48-48z" fill="${light}"/>` +
        `<path d="M512 ${y}h252a48 48 0 0 1 48 48v120a48 48 0 0 1-48 48H512z" fill="${dark}"/>` +
        `<circle cx="324" cy="${y + 108}" r="44" fill="${accent}"/>`)
      .join(''),
};

export const iconNames = Object.keys(shapes);

export function iconBody(name, hue) {
  return `<rect width="1024" height="1024" rx="224" fill="${neutrals.ink}"/>${shapes[name](scales[hue][300], scales[hue][400], neutrals.paper)}`;
}

export function iconSvg(name, hue) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024" role="img" aria-label="${name}"><title>${name}</title>${iconBody(name, hue)}</svg>\n`;
}
