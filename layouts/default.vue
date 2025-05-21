<script setup>
/**
 * Default Layout Component
 *
 * This is the main layout component for the Violence Prevention Plan for Illinois: 2025-2029.
 * It provides the common structure and functionality used across all pages.
 *
 * Key Features:
 * - Theme management (light/dark mode with localStorage persistence)
 * - Skip-to-content accessibility link for keyboard users
 * - Screen reader announcement system for dynamic content
 * - Common header and footer components
 * - Development console logger (dev mode only)
 *
 * Accessibility Features:
 * - Skip link for keyboard navigation
 * - ARIA live regions for screen reader announcements
 * - Proper landmark roles (banner, main, contentinfo)
 * - Screen reader only text for non-visual users
 *
 * Technical Implementation:
 * - Uses Vue's provide/inject for sharing the announcer across components
 * - Handles SSR/CSR differences for browser APIs like localStorage
 * - Persists theme preference between sessions
 * - Conditionally renders development tools
 *
 * @component
 * @requires ~/composables/useAnnouncer
 * @requires ~/components/dev/ConsoleLogger
 * @requires ~/components/content/AppHeader
 * @requires ~/components/content/AppFooter
 */
// Vue core imports
import { ref, watch, onMounted, provide } from 'vue';

// Composables and components
import { useAnnouncer } from '~/composables/useAnnouncer';
import ConsoleLogger from '~/components/dev/ConsoleLogger.vue';

/**
 * Environment detection for conditional rendering
 *
 * Used to only include development tools in non-production environments.
 * The ConsoleLogger component will only be rendered when isDev is true.
 *
 * @type {boolean}
 */
const isDev = process.env.NODE_ENV !== 'production';

/**
 * Theme state management
 *
 * Reactive reference to the current theme ('light' or 'dark').
 * Default is 'light' for server-side rendering, then updated from localStorage on client.
 *
 * @type {import('vue').Ref<'light'|'dark'>}
 */
const theme = ref('light');

/**
 * Skip link visibility state
 *
 * Controls the visibility of the skip-to-content link.
 * Only visible when focused (for keyboard users).
 *
 * @type {import('vue').Ref<boolean>}
 */
const skipLinkVisible = ref(false);

/**
 * Screen reader announcer setup
 *
 * Provides methods and state for making announcements to screen readers.
 * Used throughout the application for accessibility.
 */
const { announcePolite, announceAssertive, announce } = useAnnouncer();

/**
 * Make the announce function available to all child components
 *
 * This allows any component in the application to make screen reader
 * announcements without having to import the useAnnouncer composable.
 */
provide('announce', announce);

/**
 * Client-side detection
 *
 * Used to safely access browser APIs only when running in the browser.
 * Prevents errors during server-side rendering.
 *
 * @type {boolean}
 */
const isClient = typeof window !== 'undefined';

/**
 * Initialize theme settings on component mount
 *
 * This hook runs after the component is mounted to the DOM.
 * It only executes on the client-side to avoid SSR issues with localStorage.
 * The theme initialization is separated from the component setup to ensure
 * it only runs in the browser environment.
 */
onMounted(() => {
  if (isClient) {
    initTheme();
  }
});

/**
 * Initialize theme from localStorage or use default
 *
 * This function:
 * 1. Attempts to retrieve the user's theme preference from localStorage
 * 2. Sets the theme state based on the saved preference or falls back to 'light'
 * 3. Applies the theme to the document by setting a data-theme attribute
 * 4. Handles errors if localStorage is unavailable (e.g., in private browsing)
 *
 * The data-theme attribute is used by CSS variables to apply the appropriate
 * theme colors throughout the application.
 *
 * @returns {void}
 */
function initTheme() {
  try {
    // Check if there's a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme-preference');

    // Set theme based on localStorage or default to light
    theme.value = savedTheme || 'light';

    // Apply theme class to document for CSS variable access
    document.documentElement.setAttribute('data-theme', theme.value);
  } catch (e) {
    // Fallback if localStorage is not available (e.g., private browsing)
    console.error('Error accessing localStorage:', e);
    theme.value = 'light';
  }
}

/**
 * Toggle between light and dark themes
 *
 * This function:
 * 1. Switches the current theme between 'light' and 'dark'
 * 2. Persists the preference to localStorage for future visits
 * 3. Updates the document's data-theme attribute for CSS variables
 * 4. Handles errors if localStorage is unavailable
 *
 * It's passed to the AppHeader component as a prop and called when
 * the user clicks the theme toggle button.
 *
 * @returns {void}
 */
const toggleTheme = () => {
  // Safety check for SSR
  if (!isClient) return;

  // Toggle between light and dark
  theme.value = theme.value === 'light' ? 'dark' : 'light';

  try {
    // Store the user's preference in localStorage for persistence
    localStorage.setItem('theme-preference', theme.value);

    // Update document attribute for CSS variables
    document.documentElement.setAttribute('data-theme', theme.value);
  } catch (e) {
    // Handle localStorage errors (e.g., private browsing, storage quota)
    console.error('Error saving theme preference:', e);
  }
};

/**
 * Set up watcher for theme changes
 *
 * This hook establishes a reactive watcher that responds to theme changes.
 * It ensures the document's data-theme attribute stays in sync with the
 * theme state, which is necessary for CSS variables to apply correctly.
 *
 * This provides a fallback mechanism in case the theme is changed through
 * means other than the toggleTheme function.
 */
onMounted(() => {
  // Safety check for SSR
  if (!isClient) return;

  // Watch for theme changes and update document attributes
  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  });
});
</script>

<template>
  <v-app :theme="theme">
    <a href="#main-content"
       class="skip-link"
       @focus="skipLinkVisible = true"
       @blur="skipLinkVisible = false">
      Skip to main content
    </a>

    <AppHeader @toggle-theme="toggleTheme" :theme="theme" role="banner" />

    <v-main role="main">
      <div id="main-content" tabindex="-1">
        <slot />
      </div>
    </v-main>

    <AppFooter role="contentinfo" />

    <!-- Screen reader announcer elements -->
    <div
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    >{{ announcePolite }}</div>

    <div
      aria-live="assertive"
      aria-atomic="true"
      class="sr-only"
    >{{ announceAssertive }}</div>

    <!-- Console Logger (development only) -->
    <ClientOnly>
      <ConsoleLogger v-if="isDev" />
    </ClientOnly>
  </v-app>
</template>

<style>

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--v-primary-base);
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 0;
}

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>