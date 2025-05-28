/**
 * Vuetify Plugin
 *
 * Configures and initializes Vuetify for the application.
 * Sets up themes, components, directives, and icon sets.
 *
 * The color palette is designed for high contrast ratios (>8:1)
 * to ensure WCAG AA and AAA compliance for text accessibility.
 */

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#0747A6', // Darker blue for better contrast (>8:1)
            secondary: '#057A8C', // Darker teal for better contrast
            accent: '#5B21B6', // Darker purple for better contrast
            success: '#047857', // Darker green for better contrast
            warning: '#B45309', // Darker amber for better contrast
            error: '#B91C1C', // Darker red for better contrast
            info: '#1E40AF', // Darker blue for better contrast
            background: '#FAFAFA', // Softer off-white background (was #F8FAFC)
            'app-bar': '#F2F2F2', // Light grey for app-bar (distinguishable from white body)
            surface: '#F8F8F8', // Very subtle off-white surface (was #FFFFFF)
            'on-surface': '#1E293B',
            'on-background': '#1E293B',
            'on-app-bar': '#1E293B', // Same as on-background for consistent text color
          }
        },
        dark: {
          dark: true,
          colors: {
            primary: '#93C5FD', // Lighter blue for better contrast (>8:1)
            secondary: '#67E8F9', // Lighter teal for better contrast
            accent: '#C4B5FD', // Lighter purple for better contrast
            success: '#6EE7B7', // Lighter green for better contrast
            warning: '#FCD34D', // Lighter amber for better contrast
            error: '#FCA5A5', // Lighter red for better contrast
            info: '#BFDBFE', // Lighter blue for better contrast
            background: '#0F172A',
            'app-bar': '#1A2234', // Slightly different hue from background for distinction
            surface: '#1E293B',
            'on-surface': '#F1F5F9',
            'on-background': '#F1F5F9',
            'on-app-bar': '#F1F5F9', // Same as on-background for consistent text color
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})