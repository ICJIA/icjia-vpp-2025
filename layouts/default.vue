<script setup>
/**
 * Default layout component for the Illinois Violent Prevention Project
 *
 * This layout provides the common structure for all pages including:
 * - Theme management (light/dark mode with localStorage persistence)
 * - Skip-to-content accessibility link
 * - Screen reader announcements system
 * - Common header and footer
 *
 * @component
 */
import { ref, watch, onMounted, provide } from 'vue';
import { useAnnouncer } from '~/composables/useAnnouncer';

// Initialize theme state
const theme = ref('light'); // Default to light for SSR
const skipLinkVisible = ref(false);

// Set up screen reader announcer
const { announcePolite, announceAssertive, announce } = useAnnouncer();

// Make announce function available to all components via provide/inject
provide('announce', announce);

// Check if we're on client-side to safely use browser APIs
const isClient = typeof window !== 'undefined';

/**
 * Initialize theme settings on component mount
 * Only runs on client-side to avoid SSR issues with localStorage
 */
onMounted(() => {
  if (isClient) {
    initTheme();
  }
});

/**
 * Initialize theme from localStorage or use default
 *
 * Retrieves saved theme preference from localStorage and applies it
 * Falls back to light theme if localStorage is unavailable
 */
function initTheme() {
  try {
    // Check if there's a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme-preference');

    // Set theme based on localStorage or default to light
    theme.value = savedTheme || 'light';

    // Apply theme class to document
    document.documentElement.setAttribute('data-theme', theme.value);
  } catch (e) {
    // Fallback if localStorage is not available
    console.error('Error accessing localStorage:', e);
    theme.value = 'light';
  }
}

/**
 * Toggle between light and dark themes
 *
 * Switches the current theme, saves preference to localStorage,
 * and updates the document attribute for CSS variables
 */
const toggleTheme = () => {
  if (!isClient) return;

  // Toggle the theme
  theme.value = theme.value === 'light' ? 'dark' : 'light';

  try {
    // Store the user's preference in localStorage
    localStorage.setItem('theme-preference', theme.value);

    // Update document attribute
    document.documentElement.setAttribute('data-theme', theme.value);
  } catch (e) {
    console.error('Error saving theme preference:', e);
  }
};

/**
 * Set up watcher for theme changes
 * Updates document attributes when theme changes
 */
onMounted(() => {
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