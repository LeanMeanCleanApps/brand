// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';

const site = 'https://leanmeancleanapps.github.io';
const base = '/brand';
const repo = 'https://github.com/LeanMeanCleanApps/brand';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Lean Mean Clean Apps',
      description: 'Logos, colours, type and social templates for every Lean Mean Clean Apps template.',
      logo: { src: './src/data/logo.svg', alt: 'Lean Mean Clean Apps' },
      favicon: '/favicon.svg',
      social: [
        { icon: 'github', label: 'GitHub', href: repo },
        { icon: 'heart', label: 'Sponsor', href: 'https://github.com/sponsors/stphnwlsh' },
      ],
      editLink: { baseUrl: `${repo}/edit/main/website/` },
      lastUpdated: true,
      credits: false,
      customCss: [
        '@fontsource-variable/bricolage-grotesque',
        '@fontsource-variable/inter',
        '@fontsource-variable/jetbrains-mono',
        './src/data/starlight/base.css',
        './src/data/starlight/org.css',
        './src/styles/site.css',
      ],
      expressiveCode: {
        themes: ['github-dark-default', 'github-light-default'],
        styleOverrides: { borderRadius: '0.75rem', codeFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace" },
      },
      head: [
        { tag: 'link', attrs: { rel: 'icon', href: `${base}/favicon.ico`, sizes: '48x48' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${base}/apple-touch-icon.png` } },
        { tag: 'meta', attrs: { property: 'og:image', content: `${site}${base}/assets/social/png/brand.png` } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${site}${base}/assets/social/png/brand.png` } },
      ],
      components: {
        Footer: './src/components/Footer.astro',
      },
      sidebar: [
        { label: 'Start here', items: ['downloads'] },
        {
          label: 'Brand',
          items: ['brand/logo', 'brand/organisation', 'brand/templates', 'brand/colour', 'brand/typography', 'brand/voice'],
        },
        { label: 'The kit', items: ['kit/logos', 'kit/social', 'kit/platforms', 'kit/tokens'] },
        'contributing',
      ],
      plugins: [
        starlightLlmsTxt({
          projectName: 'Lean Mean Clean Apps brand',
          description: 'Logos, colours, type, tokens and social templates for the Lean Mean Clean Apps .NET templates.',
        }),
      ],
    }),
  ],
});
