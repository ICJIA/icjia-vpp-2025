import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import alpinejs from '@astrojs/alpinejs';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  site: 'https://vpp.icjia.illinois.gov',
  output: 'static',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      ],
    }),
  },
  integrations: [
    mdx(),
    alpinejs({ entrypoint: '/src/alpine' }),
    icon(),
    sitemap({
      // Excluded: /news (built but unlinked placeholder — empty until the News
      // section launches), /plan/ index (noindexed meta-refresh redirect to
      // /plan/front-cover/), /search (noindex utility page).
      filter: (page) =>
        !page.includes('/sandbox') &&
        !page.includes('/404') &&
        !page.includes('/docs') &&
        !page.includes('/news') &&
        !page.endsWith('/plan/') &&
        !page.endsWith('/search/'),
      changefreq: 'weekly',
      priority: 0.5,
    }),
  ],
});
