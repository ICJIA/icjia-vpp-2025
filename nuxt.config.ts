// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/css/main.scss',
  ],

  modules: [
    '@nuxtjs/google-fonts','@nuxt/content'
  ],

  // @ts-ignore - Known module configuration
  googleFonts: {
    families: {
      'Inter': [300, 400, 500, 600, 700],
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
  },

  build: {
    transpile: ['vuetify'],
  },

  app: {
    head: {
      title: 'Violence Prevention Plan for Illinois: 2025-2029',
      meta: [
        { name: 'description', content: 'Violence Prevention Plan for Illinois: 2025-2029' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        // Explicitly include accessibility documentation HTML files
        '/accessibility-documentation.html',
        '/audit-log-accessibility.html'
      ],
      ignore: [
        // Exclude sandbox page from being crawled
        '/sandbox'
      ]
    }
  },

})
