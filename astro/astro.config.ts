import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import alpinejs from '@astrojs/alpinejs';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

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
  integrations: [
    alpinejs(),
    icon(),
    sitemap({
      filter: (page) => !page.includes('/sandbox') && !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.5,
    }),
  ],
});
