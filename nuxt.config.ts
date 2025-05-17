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
      title: 'Elegant App',
      meta: [
        { name: 'description', content: 'A beautifully designed app with Nuxt 3 and Vuetify 3' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  
  nitro: {
    prerender: {
      crawlLinks: true,
    }
  }
})
