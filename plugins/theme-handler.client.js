/**
 * Theme Handler Plugin
 *
 * This plugin runs only on the client side.
 * It sets the theme before Vue hydration to prevent flash of incorrect theme.
 *
 * NOTE: Console logging is intentionally enabled in all environments (including production)
 * during the pre-launch phase for monitoring and debugging purposes.
 */

import { useConsoleLogger } from '~/composables/useConsoleLogger';

export default defineNuxtPlugin(() => {
  // Get logger instance
  const { logTheme, logError } = useConsoleLogger();

  // This code runs before the app is mounted
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
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
        // Default to light theme if no preference
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.add('theme-light');

        // Log default theme initialization
        logTheme('Theme initialized with default', { theme: 'light' });
      }
    } catch (e) {
      // Fallback if localStorage is not available
      logError('Error accessing localStorage for theme', e);

      // Default to light theme
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.add('theme-light');

      // Log fallback theme
      logTheme('Theme initialized with fallback', { theme: 'light', reason: 'localStorage error' });
    }
  }
});
