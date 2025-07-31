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
import { ref, watch, onMounted, provide, nextTick } from "vue";

// Composables and components
import { useAnnouncer } from "~/composables/useAnnouncer";
import { useConsoleLogger } from "~/composables/useConsoleLogger";
import { useTheme } from "~/composables/useTheme";
import ConsoleLogger from "~/components/dev/ConsoleLogger.vue";

// Get logger instance for theme logging
// NOTE: Console logging is intentionally enabled in all environments (including production)
// during the pre-launch phase for monitoring and debugging purposes.
const { logTheme, logError } = useConsoleLogger();

/**
 * Environment detection for conditional rendering
 *
 * NOTE: Console logging is intentionally enabled in all environments (including production)
 * during the pre-launch phase for monitoring and debugging purposes. This will be
 * revisited before the official launch.
 *
 * @type {boolean}
 */
const showConsoleLogger = true; // Intentionally enabled in all environments for pre-launch debugging

/**
 * Theme state management using session-only storage
 *
 * Uses the simplified useTheme composable for session-only theme management.
 * Always defaults to dark mode on page load/refresh.
 */
const {
  theme,
  toggleTheme: toggleThemeComposable,
  syncWithVuetify,
  initializeTheme,
} = useTheme();

/**
 * Skip link visibility state
 *
 * Controls the visibility of the skip-to-content link.
 * Only visible when focused (for keyboard users).
 *
 * @type {Object}
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
provide("announce", announce);

/**
 * Client-side detection
 *
 * Used to safely access browser APIs only when running in the browser.
 * Prevents errors during server-side rendering.
 *
 * @type {boolean}
 */
const isClient = typeof window !== "undefined";

/**
 * Initialize theme system on client-side mount
 *
 * Only initializes the theme system without syncing with Vuetify to prevent hydration mismatches.
 * Vuetify should already be initialized with the correct theme from the plugin.
 */
onMounted(() => {
  if (isClient) {
    // Use nextTick to ensure DOM is fully hydrated before theme initialization
    nextTick(() => {
      // Initialize theme system (client-side only to prevent hydration mismatch)
      initializeTheme();

      // Check if Vuetify theme matches our session theme
      const { $vuetify } = useNuxtApp();
      if ($vuetify && $vuetify.theme && $vuetify.theme.global) {
        const vuetifyTheme = $vuetify.theme.global.name.value;
        const sessionTheme = theme.value;

        if (process.dev) {
          console.log(
            `[Layout] Vuetify theme: ${vuetifyTheme}, Session theme: ${sessionTheme}`
          );
        }

        // Only sync if there's a mismatch and we're sure it's safe to do so
        // This should rarely happen if the Vuetify plugin is working correctly
        if (vuetifyTheme !== sessionTheme) {
          console.warn(
            `[Layout] Theme mismatch detected. Vuetify: ${vuetifyTheme}, Session: ${sessionTheme}`
          );
          // Don't automatically sync to avoid hydration issues
          // Let the user manually toggle if needed
        }
      }
    });
  }
});

/**
 * Toggle between light and dark themes
 *
 * This function:
 * 1. Switches the current theme between 'light' and 'dark'
 * 2. Updates Vuetify's theme to maintain consistency
 * 3. Persists the preference to localStorage for future visits
 * 4. Updates the document's data-theme attribute for CSS variables
 * 5. Handles errors if localStorage is unavailable
 * 6. Logs theme changes for debugging purposes
 *
 * It's passed to the AppHeader component as a prop and called when
 * the user clicks the theme toggle button.
 *
 * NOTE: Console logging is intentionally enabled in all environments (including production)
 * during the pre-launch phase for monitoring and debugging purposes.
 *
 * @returns {void}
 */
const toggleTheme = () => {
  // Use the composable's toggle function for session-only theme management
  toggleThemeComposable();

  // Sync with Vuetify after theme change
  syncWithVuetify();
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
 *
 * NOTE: Console logging is intentionally enabled in all environments (including production)
 * during the pre-launch phase for monitoring and debugging purposes.
 */
onMounted(() => {
  // Safety check for SSR
  if (!isClient) return;

  // Watch for theme changes and update document attributes
  watch(theme, (newTheme, oldTheme) => {
    // Update document attribute for CSS variables
    document.documentElement.setAttribute("data-theme", newTheme);

    // Only log if this change wasn't already logged by toggleTheme
    // This helps avoid duplicate logs for the same theme change
    if (oldTheme && newTheme !== oldTheme) {
      logTheme("Theme changed via watcher", {
        from: oldTheme,
        to: newTheme,
        timestamp: new Date().toISOString(),
        source: "watcher",
      });
    }
  });
});
</script>

<template>
  <v-app :theme="theme" style="">
    <a
      href="#main-content"
      class="skip-link"
      @focus="skipLinkVisible = true"
      @blur="skipLinkVisible = false"
    >
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
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      {{ announcePolite }}
    </div>

    <div aria-live="assertive" aria-atomic="true" class="sr-only">
      {{ announceAssertive }}
    </div>

    <!-- Console Logger (enabled in all environments for pre-launch debugging) -->
    <ClientOnly>
      <ConsoleLogger v-if="showConsoleLogger" />
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
