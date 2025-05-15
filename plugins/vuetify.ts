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
            primary: '#0962E8',
            secondary: '#06B6D4',
            accent: '#7C3AED',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
            background: '#F8FAFC',
            surface: '#FFFFFF',
            'on-surface': '#1E293B',
            'on-background': '#1E293B',
          }
        },
        dark: {
          dark: true,
          colors: {
            primary: '#3B82F6',
            secondary: '#0891B2',
            accent: '#8B5CF6',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#60A5FA',
            background: '#0F172A',
            surface: '#1E293B',
            'on-surface': '#F1F5F9',
            'on-background': '#F1F5F9',
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})