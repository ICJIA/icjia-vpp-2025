/**
 * Plugin to force scroll to top (0,0) on page refresh
 *
 * This plugin ensures that when a user refreshes the page, the scroll position
 * is reset to the top. It disables the browser's automatic scroll restoration
 * and manually sets the scroll position to the top of the page.
 *
 * Features:
 * - Disables browser's automatic scroll restoration
 * - Forces scroll position to absolute top (0,0)
 * - Executes before Vue initialization for maximum compatibility
 * - Multiple fallback methods for different browsers
 * - Client-side only execution
 *
 * @module RefreshScrollPlugin
 * @version 1.0.0
 * @author Violence Prevention Plan for Illinois: 2025-2029
 *
 * @example
 * // Plugin runs automatically on page load/refresh
 * // No manual intervention required
 * // Ensures consistent scroll position across browser refreshes
 */

// Execute immediately when this script is loaded
if (typeof window !== "undefined") {
  // Disable browser's automatic scroll restoration
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // Force scroll to absolute top (0,0)
  window.scrollTo(0, 0);

  // Also set these for maximum compatibility
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/**
 * Nuxt plugin function (minimal implementation)
 *
 * The actual scroll reset logic runs before this plugin is called,
 * ensuring it executes before Vue initialization for maximum compatibility.
 *
 * @returns {void}
 */
export default defineNuxtPlugin(() => {
  // Nothing needed in the plugin itself
  // The code above runs before Vue is initialized
});
