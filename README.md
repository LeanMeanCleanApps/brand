<p align="center">
  <img src="assets/preview.png" alt="The Lean Mean Clean Apps marks: slate, leaf and spectrum organisation marks above one ring mark per template." width="100%">
</p>

# Lean Mean Clean Apps design library

Logos, colours, type, design tokens and social templates for the [Lean Mean Clean Apps](https://github.com/LeanMeanCleanApps) .NET templates. Every file is generated from a handful of scripts, so the whole family stays in step.

**Docs:** [leanmeancleanapps.github.io/design-library](https://leanmeancleanapps.github.io/design-library/)

## The files you probably want

| What | File |
| --- | --- |
| Organisation avatar (GitHub, NuGet, Docker Hub) | [org-slate-square-512.png](assets/logos/org-slate/png/org-slate-square-512.png) |
| Organisation profile banner | [banner.png](assets/social/png/banner.png) |
| Repository social previews | [assets/social/png/](assets/social/png/) |
| NuGet package icons | `assets/logos/<template>/png/<template>-square-128.png` |
| Website favicons and manifest icons | `assets/logos/<mark>/web/` |
| Colours as CSS variables | [tokens/tokens.css](tokens/tokens.css) |
| Colours as design tokens | [tokens/tokens.json](tokens/tokens.json) |
| Starlight themes | [tokens/starlight/](tokens/starlight/) |

[Using the assets](https://leanmeancleanapps.github.io/design-library/kit/platforms/) says where each one goes.

## The marks

| Mark | Hue | Used for |
| --- | --- | --- |
| Organisation, slate | Slate | The default: avatars, profile pictures, favicons |
| Organisation, leaf | Leaf | The alternative, and the accent on organisation websites |
| Organisation, spectrum | Every template hue | Banners and link previews, where colour is the point |
| Clean Minimal API | Emerald | [CleanMinimalApi](https://github.com/stphnwlsh/CleanMinimalApi) |
| Clean Web API | Blue | [CleanWebApi](https://github.com/stphnwlsh/CleanWebApi) |
| Clean GraphQL API | Pink | [CleanGraphQLApi](https://github.com/stphnwlsh/CleanGraphQLApi) |
| Clean Model Context Protocol | Violet | [CleanModelContextProtocol](https://github.com/stphnwlsh/CleanModelContextProtocol) |
| Clean Lambda Function | Amber | [CleanLamdaFunction](https://github.com/stphnwlsh/CleanLamdaFunction) |
| gRPC, Worker, CLI | Cyan, red, lime | Reserved for templates that don't exist yet |

Each mark comes as SVG and PNG, on dark and light backgrounds, bare or in a tile, square or circle, plus a small version drawn for 48 pixels and below and a layered SVG for editing.

## What's in here

```text
assets/
  logos/<mark>/svg/     SVG logos in every variant
  logos/<mark>/png/     PNG logos from 16 to 1024 pixels
  logos/<mark>/web/     favicon.svg, favicon.ico, apple-touch-icon.png, manifest icons
  logos/mono/           Single-colour ink and paper versions
  social/png/           Social previews, banner and link preview, ready to upload
  social/svg/           The same, with text as outlines
  social/source/        The same, with live text and named layers for editing
tokens/                 tokens.json, tokens.css and Starlight themes
scripts/                The generator: brand, geometry, colours, logo, text, social, tokens
fonts/                  Bricolage Grotesque, Inter and JetBrains Mono (SIL Open Font Licence)
website/                The Starlight docs site
```

## Building

Everything in `assets/` and `tokens/` is generated. You need Node 24.

```sh
npm ci
npm run build
```

Commit what changes. CI runs the same build and fails if the committed files are out of date. To add a template, add it to `scripts/brand.mjs` and build. The [contributing guide](https://leanmeancleanapps.github.io/design-library/contributing/) has more.

To run the docs site locally:

```sh
cd website
npm ci
npm run dev
```

## Licence

[MIT](LICENSE.md). The fonts in `fonts/` are under the [SIL Open Font Licence](https://openfontlicense.org), with a copy next to each one.
