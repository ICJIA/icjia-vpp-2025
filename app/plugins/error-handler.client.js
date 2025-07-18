/**
 * Error Handler Plugin
 *
 * Intercepts and handles common errors in a more graceful way.
 * Specifically targets 404 "Page not found" errors to prevent console noise in production.
 *
 * This plugin overrides the console.error method to filter out expected 404 errors
 * in production, while preserving the original behavior for all other errors and
 * in development mode. Hydration errors are never suppressed as they indicate real issues.
 *
 * Features:
 * - Filters 404 errors in production to reduce console noise
 * - Preserves all error logging in development mode
 * - Never suppresses hydration errors (critical for debugging)
 * - Maintains original console.error functionality for other errors
 * - Pattern matching for various 404 error formats
 *
 * @module ErrorHandlerPlugin
 * @version 1.0.0
 * @author Violence Prevention Plan for Illinois: 2025-2029
 *
 * @example
 * // Plugin automatically filters these in production:
 * // console.error('Page not found: /non-existent-page')
 * // console.error('[nuxt] error caught during app initialization Page not found: /test')
 *
 * @example
 * // These errors are never filtered (always shown):
 * // console.error('Hydration completed but contains mismatches')
 * // console.error('API request failed')
 */

/**
 * Nuxt plugin function that sets up error filtering
 *
 * @param {Object} nuxtApp - Nuxt application instance
 * @returns {void}
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Original console.error function
  const originalConsoleError = console.error;

  // Override console.error to filter out expected 404 errors
  console.error = (...args) => {
    // Convert all arguments to strings for pattern matching
    const errorString = args
      .map((arg) => (typeof arg === "string" ? arg : String(arg)))
      .join(" ");

    // Check if this is a "Page not found" error with improved logic
    const is404Error =
      typeof errorString === "string" &&
      (errorString.includes("Page not found:") ||
        (errorString.includes(
          "[nuxt] error caught during app initialization",
        ) &&
          errorString.includes("Page not found:")));

    // Check if this is a hydration mismatch error (should not be suppressed)
    const isHydrationError =
      typeof errorString === "string" &&
      (errorString.includes("Hydration completed but contains mismatches") ||
        errorString.includes("hydration mismatch") ||
        errorString.includes("hydration error"));

    // In production, suppress only 404 errors from the console
    // Never suppress hydration errors as they indicate real issues
    if (
      process.env.NODE_ENV === "production" &&
      is404Error &&
      !isHydrationError
    ) {
      // Optionally, we could log a more friendly message here
      // console.info('User navigated to a non-existent page, showing 404 page');
      return;
    }

    // For all other errors, hydration errors, or in development mode, use the original console.error
    originalConsoleError.apply(console, args);
  };

  // No need to provide anything to the app
});
