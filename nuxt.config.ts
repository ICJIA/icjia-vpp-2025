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
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  // Set compatibility date for Nuxt features
  compatibilityDate: "2024-04-03",

  // Enable Nuxt 4 compatibility mode for testing
  future: {
    compatibilityVersion: 4,
  },

  // Enable Nuxt DevTools for development
  devtools: { enabled: true },

  // Force static site generation
  ssr: true,

  // Global CSS files
  css: [
    "vuetify/lib/styles/main.sass", // Vuetify styles
    "~/assets/css/main.scss", // Custom application styles
  ],

  // Nuxt modules
  modules: [
    // Google Fonts integration
    "@nuxtjs/google-fonts", // Content management system
    "@nuxt/content",
    "@nuxtjs/plausible",
    "@nuxt/image",
  ],

  // Components configuration
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
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
      anchorLinks: false,
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
      },
    },


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
    inject: true, // Automatically inject fonts into the head
    download: true, // Download fonts during build instead of using Google's CDN
    display: "swap", // Use 'swap' strategy to prevent FOIT (Flash of Invisible Text)
    prefetch: true, // Prefetch fonts for better performance
    families: {
      // Primary font for body text and UI elements
      Roboto: {
        wght: [400, 700], // Essential weights only: normal and bold
      },
      // Display font for headings and titles
      Raleway: {
        wght: [400, 700], // Essential weights only: normal and bold
      },
      // Removed fonts for performance optimization:
      // - Lato: Redundant with Roboto for UI text
      // - Caveat Brush: Decorative font, rarely used
      // - All italic variants: Removed to reduce bundle size
      // - Light (100) and black (900) weights: Removed to reduce bundle size
    },
  },

  /**
   * Build configuration
   *
   * Configures how Nuxt builds the application.
   */
  build: {
    transpile: ["vuetify"], // Ensure Vuetify is properly transpiled
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
      title: "Violence Prevention Plan for Illinois: 2025-2029",

      // Meta tags for SEO and social media
      meta: [
        {
          name: "description",
          content:
            "The official web presence for the Statewide Violence Prevention Plan for Illinois: 2025-2029, featuring comprehensive violence prevention strategies and community resources.",
        },
        {
          name: "keywords",
          content:
            "violence prevention, Illinois, public health, community safety, trauma-informed care, evidence-based practices",
        },
        {
          name: "author",
          content: "Illinois Criminal Justice Information Authority",
        },
        { name: "robots", content: "index, follow" },

        // Open Graph meta tags for social media sharing
        {
          property: "og:site_name",
          content: "Statewide Violence Prevention Plan for Illinois: 2025-2029",
        },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en_US" },

        // Twitter Card meta tags
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@ICJIA_Illinois" },
        { name: "twitter:creator", content: "@ICJIA_Illinois" },

        // Additional meta tags for better SEO
        { name: "theme-color", content: "#1976d2" },
        { name: "msapplication-TileColor", content: "#1976d2" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      ],

      // Favicon and icon configuration
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "apple-touch-icon", href: "/images/illinois-seal.png" },
        { rel: "canonical", href: "https://vpp-2025.netlify.app" },
        // Material Design Icons CSS
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css",
          crossorigin: "anonymous",
          integrity: "sha384-HphS8cQyN+eYiJ5PMbzShG6qZdRtvHPVLPkYb8JwMkmNgaIxrFVDhQe3jIbq3EZ2"
        },
      ],
    },

    // Page transition animation
    pageTransition: {
      name: "page", // CSS class name for the transition
      mode: "out-in", // First hide old page, then show new page
    },
  },
  plausible: {
    // Prevent tracking on localhost
    ignoredHostnames: ["localhost"],
    apiHost: "https://plausible.icjia.cloud",
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
    "/plan": { redirect: "/plan/front-cover" },
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
    // Force static site generation preset
    preset: 'static',

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
      ],
    },
  },

  /**
   * Experimental configuration
   */
  experimental: {
    // Enable payload extraction for better performance
    payloadExtraction: false,

    // Enable inline route rules for better performance
    inlineRouteRules: true,
  },

  /**
   * Vite configuration for performance optimization
   *
   * Configures Vite build settings to optimize bundle size and performance.
   */
  vite: {
    // CSS configuration
    css: {
      preprocessorOptions: {
        scss: {
          // Use modern Dart Sass instead of node-sass
          implementation: 'sass',
          // Additional Sass options
          additionalData: `@use "sass:math";`
        }
      }
    },

    build: {
      // Disable source maps in production for security
      sourcemap: false,

      // Optimize chunk splitting for better caching
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching (simplified for tree-shaking)
          manualChunks: {
            // Vuetify (now tree-shaken, single chunk for better compatibility)
            'vendor-vuetify': ['vuetify'],

            // VueUse chunks
            'vendor-vueuse': ['@vueuse/core', '@vueuse/head', '@vueuse/motion'],

            // Content and search chunks
            'search': ['fuse.js'],

            // Utilities
            'utils': ['gray-matter', 'yaml', 'remove-markdown']
          }
        }
      }
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'vue',
        'vuetify',
        '@vueuse/core',
        'fuse.js'
      ]
    }
  },

  /**
   * Image optimization configuration
   */
  image: {
    // Default image format for optimization
    format: ['webp', 'avif'],

    // Screen sizes for responsive images
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },

    // Device pixel ratio densities
    densities: [1, 2],

    // Quality settings
    quality: 80,

    // Provider configuration (using default ipx)
    provider: 'ipx',

    // Presets for common image sizes
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 150,
          height: 150,
          quality: 80
        }
      },
      hero: {
        modifiers: {
          format: 'webp',
          quality: 85,
          width: 1200
        }
      }
    }
  },

  /**
   * Runtime configuration
   */
  runtimeConfig: {
    // Private keys (only available on server-side)

    // Public keys (exposed to client-side)
    public: {
      // Environment configuration for SSR consistency
      NODE_ENV: process.env.NODE_ENV || 'production'
    }
  }
});
