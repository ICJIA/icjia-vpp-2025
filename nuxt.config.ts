/**
 * Nuxt Configuration File
 *
 * This file configures the Nuxt 3 application for the Violence Prevention Plan for Illinois: 2025-2029.
 * It includes settings for:
 * - CSS and styling (Vuetify, Material Design Icons, custom styles)
 * - Modules (@nuxt/content, Google Fonts)
 * - Build configuration
 * - SEO and metadata
 * - Static site generation settings
 *
 * @see https://nuxt.com/docs/api/configuration/nuxt-config
 */
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Set compatibility date for Nuxt features
  compatibilityDate: '2024-04-03',

  // Enable Nuxt DevTools for development
  devtools: { enabled: true },

  // Global CSS files
  css: [
    'vuetify/lib/styles/main.sass',        // Vuetify styles
    '@mdi/font/css/materialdesignicons.min.css', // Material Design Icons
    '~/assets/css/main.scss',              // Custom application styles
  ],

  // Nuxt modules
  modules: [
    '@nuxtjs/google-fonts',  // Google Fonts integration
    '@nuxt/content'          // Content management system
  ],

  // Components configuration
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],

  /**
   * Nuxt Content configuration
   *
   * Configures how markdown content is processed and rendered.
   *
   * @see https://content.nuxt.com/get-started/configuration
   */
  content: {
    // Configure content rendering
    renderer: {
      // Disable automatic anchor link generation for headings
      // We'll handle this manually in our custom heading components
      anchorLinks: false
    }
  },

  /**
   * Google Fonts configuration
   *
   * Downloads fonts during build for better performance and privacy.
   * Configures font display behavior and preloading.
   *
   * @see https://google-fonts.nuxtjs.org/
   */
  // @ts-ignore - Known module configuration
  googleFonts: {
    inject: true,     // Automatically inject fonts into the head
    download: true,   // Download fonts during build instead of using Google's CDN
    display: "swap",  // Use 'swap' strategy to prevent FOIT (Flash of Invisible Text)
    prefetch: true,   // Prefetch fonts for better performance
    families: {
      // Primary font for body text and UI elements
      Roboto: {
        wght: [100, 400, 700, 900], // Various weights for different UI elements
        ital: [100],                // Italic style for emphasis
      },
      // Secondary font for certain UI elements
      Lato: {
        wght: [100, 300, 400, 700, 900],
        ital: [100],
      },
      // Display font for headings and titles
      Raleway: {
        wght: [100, 400, 900],
        ital: [100],
      },
      // Accent font for special elements
      "Caveat+Brush": {
        wght: [400],
      },
    }
  },

  /**
   * Build configuration
   *
   * Configures how Nuxt builds the application.
   */
  build: {
    transpile: ['vuetify'], // Ensure Vuetify is properly transpiled
  },

  /**
   * Application configuration
   *
   * Configures global app settings including:
   * - Default head metadata (title, description, favicon)
   * - Page transitions
   */
  app: {
    // Global head configuration for SEO and metadata
    head: {
      // Default page title
      title: 'Violence Prevention Plan for Illinois: 2025-2029',

      // Meta tags for SEO
      meta: [
        { name: 'description', content: 'Violence Prevention Plan for Illinois: 2025-2029' }
      ],

      // Favicon configuration
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },

    // Page transition animation
    pageTransition: {
      name: 'page',  // CSS class name for the transition
      mode: 'out-in' // First hide old page, then show new page
    }
  },

  /**
   * Nitro server configuration
   *
   * Configures the Nitro server engine that powers Nuxt.
   * Used here primarily for static site generation settings.
   *
   * @see https://nitro.unjs.io/
   */
  nitro: {
    // Static site generation configuration
    prerender: {
      // Automatically crawl and generate all linked pages
      crawlLinks: true,

      // Explicitly include these routes in static generation
      routes: [
        // Accessibility documentation HTML files
        '/accessibility-documentation.html',
        '/audit-log-accessibility.html',
        // Legal documentation HTML files
        '/privacy-policy.html',
        '/terms-of-service.html'
      ],

      // Exclude these routes from crawling/generation
      ignore: [
        // Development sandbox page
        //'/sandbox'
      ]
    }
  },
})
