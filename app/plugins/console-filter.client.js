/**
 * Console Filter Plugin
 *
 * Filters out known harmless console warnings in production builds
 * while preserving important error messages and development logging.
 *
 * This plugin specifically addresses the Nuxt internal timer warning:
 * "Timer '[nuxt-app] page:loading:end' already exists"
 *
 * The warning is a known Nuxt internal issue that doesn't affect functionality
 * but creates noise in production console logs.
 *
 * @module ConsoleFilterPlugin
 * @version 1.0.0
 * @author Violence Prevention Plan for Illinois: 2025-2029
 */

export default defineNuxtPlugin(() => {
  // Only run on client side and in production
  if (import.meta.server || process.env.NODE_ENV !== 'production') return;

  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;

  /**
   * List of warning patterns to suppress in production
   * These are known harmless warnings that don't affect functionality
   */
  const suppressedWarnings = [
    /Timer '\[nuxt-app\] page:loading:end' already exists/,
    /Timer '\[nuxt-app\].*' already exists/,
  ];

  /**
   * Check if a message should be suppressed
   * @param {string} message - The console message
   * @returns {boolean} True if message should be suppressed
   */
  const shouldSuppress = (message) => {
    if (typeof message !== 'string') return false;
    return suppressedWarnings.some(pattern => pattern.test(message));
  };

  /**
   * Filtered console.warn that suppresses known harmless warnings
   */
  console.warn = function(...args) {
    const message = args[0];
    if (!shouldSuppress(message)) {
      originalWarn.apply(console, args);
    }
  };

  /**
   * Filtered console.error that suppresses known harmless errors
   * (Currently no error patterns to suppress, but ready for future use)
   */
  console.error = function(...args) {
    const message = args[0];
    if (!shouldSuppress(message)) {
      originalError.apply(console, args);
    }
  };

  /**
   * Filtered console.log that suppresses known harmless log messages
   * (Currently no log patterns to suppress, but ready for future use)
   */
  console.log = function(...args) {
    const message = args[0];
    if (!shouldSuppress(message)) {
      originalLog.apply(console, args);
    }
  };

  // Log that the filter is active (this will show since it's not suppressed)
  console.log('🔇 Console filter active - suppressing known harmless warnings');
});
