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
  modules: [// Google Fonts integration
  '@nuxtjs/google-fonts', // Content management system
  '@nuxt/content', '@nuxtjs/plausible'],

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
   * Includes syntax highlighting with Shiki for code blocks and footnote support.
   *
   * @see https://content.nuxt.com/get-started/configuration
   */
  content: {
    
    // Configure content rendering
    renderer: {
      // Disable automatic anchor link generation for headings
      // We'll handle this manually in our custom heading components
      anchorLinks: false
    },

    // Configure build-time processing
    build: {
      // Configure markdown processing
      markdown: {
        // Disable Shiki syntax highlighting due to accessibility issues
        // We'll implement custom highlighting with better contrast
        highlight: false,
         toc: {
          depth: 2, // include h2 headings
        },


      }
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
   * - Enhanced SEO and social media optimization
   */
  app: {
    // Global head configuration for SEO and metadata
    head: {
      // Default page title
      title: 'Violence Prevention Plan for Illinois: 2025-2029',

      // Meta tags for SEO and social media
      meta: [
        { name: 'description', content: 'The official web presence for the Statewide Violence Prevention Plan for Illinois: 2025-2029, featuring comprehensive violence prevention strategies and community resources.' },
        { name: 'keywords', content: 'violence prevention, Illinois, public health, community safety, trauma-informed care, evidence-based practices' },
        { name: 'author', content: 'Illinois Criminal Justice Information Authority' },
        { name: 'robots', content: 'index, follow' },

        // Open Graph meta tags for social media sharing
        { property: 'og:site_name', content: 'Statewide Violence Prevention Plan for Illinois: 2025-2029' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },

        // Twitter Card meta tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@ICJIA_Illinois' },
        { name: 'twitter:creator', content: '@ICJIA_Illinois' },

        // Additional meta tags for better SEO
        { name: 'theme-color', content: '#1976d2' },
        { name: 'msapplication-TileColor', content: '#1976d2' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],

      // Favicon and icon configuration
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/images/illinois-seal.png' },
        { rel: 'canonical', href: 'https://vpp-2025.netlify.app' }
      ]
    },

    // Page transition animation
    pageTransition: {
      name: 'page',  // CSS class name for the transition
      mode: 'out-in' // First hide old page, then show new page
    }
  },
  plausible: {
    // Prevent tracking on localhost
    ignoredHostnames: ['localhost'],
    apiHost: 'https://plausible.icjia.cloud'
  },

  /**
   * Route rules configuration
   *
   * Configures route-specific behavior including redirects.
   *
   * @see https://nuxt.com/docs/guide/concepts/rendering#route-rules
   */
  routeRules: {
    // Redirect /plan/ to /plan/front-cover for better user experience
    '/plan': { redirect: '/plan/front-cover' },
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
        // Accessibility documentation is now handled by Nuxt Content
        // via the dynamic catch-all page system at /pages/[...slug].vue
      ],

      // Exclude these routes from crawling/generation
      ignore: [
        // Development sandbox page
        //'/sandbox'
      ]
    }
  },
})