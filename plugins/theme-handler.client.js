/**
 * Theme Handler Plugin
 *
 * This plugin runs only on the client side.
 * It sets the theme before Vue hydration to prevent flash of incorrect theme (FOUC).
 *
 * The plugin reads the user's theme preference from localStorage and applies it
 * immediately to the document, ensuring consistent theming during the initial render.
 * If no user preference exists, it uses the default theme from site configuration.
 */

import { useConsoleLogger } from '~/composables/useConsoleLogger';

export default defineNuxtPlugin(async () => {
  // Get logger instance
  const { logTheme, logError } = useConsoleLogger();

  // This code runs before the app is mounted
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Load site configuration to get default theme
    let defaultTheme = 'dark'; // Fallback default
    try {
      const siteConfig = await $fetch('/config/site.config.json');
      defaultTheme = siteConfig?.features?.themes?.default || 'dark';
    } catch (configError) {
      logError('Could not load site configuration, using fallback default theme', configError);
    }

    // Try to get theme from localStorage
    try {
      const savedTheme = localStorage.getItem('theme-preference');

      // If there's a saved theme, apply it immediately
      if (savedTheme) {
        // Apply to document for potential CSS usage
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Add a class to the body to prevent flash
        document.body.classList.add(`theme-${savedTheme}`);

        // Log theme initialization
        logTheme('Theme initialized from localStorage', { theme: savedTheme });
      } else {
        // Use configured default theme if no preference
        document.documentElement.setAttribute('data-theme', defaultTheme);
        document.body.classList.add(`theme-${defaultTheme}`);

        // Log default theme initialization
        logTheme('Theme initialized with configured default', {
          theme: defaultTheme,
          source: 'site-config'
        });
      }
    } catch (e) {
      // Fallback if localStorage is not available
      logError('Error accessing localStorage for theme', e);

      // Use configured default theme
      document.documentElement.setAttribute('data-theme', defaultTheme);
      document.body.classList.add(`theme-${defaultTheme}`);

      // Log fallback theme
      logTheme('Theme initialized with fallback', {
        theme: defaultTheme,
        reason: 'localStorage error',
        source: 'site-config-fallback'
      });
    }
  }
});
