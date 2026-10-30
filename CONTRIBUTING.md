# Contributing

Thanks for wanting to improve the brand. The full guide, with where every script lives and how to add a template, is on the site: [Contributing](https://leanmeancleanapps.github.io/brand/contributing/). The short version:

1. Everything in `assets/` and `tokens/` is generated. Don't edit those files by hand, because the next build will quietly undo your work. Change the scripts in `scripts/` instead.
1. Run `npm ci` and `npm run build` with Node 24, then commit whatever changed. CI runs the same build and fails if the committed files are stale.
1. Branch from `main` as `feature/`, `fix/` or `chore/`, open a pull request and fill in the template.

A few house rules that save a review round:

- One hue per template, and no new hue without a full 50 to 900 scale.
- No glows, gradients, shadows or hand-drawn rings. If the mark needs to change, change the generator.
- Australian spelling: colour, organisation, licence.

Every pull request is reviewed by [Stephen Walsh](https://github.com/stphnwlsh), who builds and maintains all of this in spare time. Bigger ideas are best raised as an issue first, so nobody spends an evening on something that was never going to fit. The [code of conduct](https://github.com/LeanMeanCleanApps/.github/blob/main/CODE_OF_CONDUCT.md), [security policy](https://github.com/LeanMeanCleanApps/.github/blob/main/SECURITY.md) and [support page](https://github.com/LeanMeanCleanApps/.github/blob/main/SUPPORT.md) are shared across the organisation.
