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
      title: 'Illinois Violent Prevention Project',
      meta: [
        { name: 'description', content: 'Illinois Violent Prevention Project' }
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
    }
  },

})
