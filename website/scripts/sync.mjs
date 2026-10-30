// Copies the generated assets and tokens into the site, and exports the brand data the pages read.
import fs from 'node:fs';
import path from 'node:path';
import { neutrals, scales, org, templates } from '../../scripts/brand.mjs';

const site = path.resolve(import.meta.dirname, '..');
const repo = path.resolve(site, '..');

for (const dir of ['assets', 'tokens']) {
  fs.rmSync(path.join(site, 'public', dir), { recursive: true, force: true });
  fs.cpSync(path.join(repo, dir), path.join(site, 'public', dir), { recursive: true });
}

fs.mkdirSync(path.join(site, 'src', 'data'), { recursive: true });
fs.cpSync(path.join(repo, 'tokens', 'starlight'), path.join(site, 'src', 'data', 'starlight'), { recursive: true });
fs.copyFileSync(path.join(repo, 'assets/logos/org-slate/svg/org-slate-small-tile.svg'), path.join(site, 'src/data/logo.svg'));
fs.copyFileSync(path.join(repo, 'assets/logos/org-spectrum/svg/org-spectrum.svg'), path.join(site, 'src/data/hero.svg'));
for (const f of ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png']) {
  fs.copyFileSync(path.join(repo, 'assets/logos/org-slate/web', f), path.join(site, 'public', f));
}
fs.writeFileSync(path.join(site, 'src', 'data', 'brand.json'), JSON.stringify({ neutrals, scales, org, templates }, null, 2));
