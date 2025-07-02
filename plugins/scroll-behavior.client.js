/**
 * Client-side plugin to handle scroll behavior for navigation
 *
 * This plugin provides:
 * - A function to scroll to the top of the page
 * - Ability to manually trigger scroll to top
 * - Accessibility support through respecting prefers-reduced-motion
 * - WCAG 2.1 AA compliant motion handling
 * - Browser compatibility checks
 *
 * @module ScrollBehaviorPlugin
 * @version 1.0.0
 * @author Violence Prevention Plan for Illinois: 2025-2029
 *
 * @example
 * // Use in any component via inject:
 * // const { $scrollToTop } = useNuxtApp()
 * // $scrollToTop() // Scrolls to top with appropriate behavior
 *
 * @example
 * // Respects user preferences:
 * // - Users with prefers-reduced-motion: instant scroll
 * // - Other users: smooth scroll animation
 */

/**
 * Nuxt plugin function that provides scroll behavior functionality
 *
 * @param {Object} nuxtApp - Nuxt application instance
 * @returns {Object} Plugin return object with provided scrollToTop function
 * @returns {Object} returns.provide - Object containing provided services
 * @returns {Function} returns.provide.scrollToTop - Function to scroll to page top
 */
export default defineNuxtPlugin((nuxtApp) => {
  /**
   * Scroll to the top of the page with smooth behavior
   *
   * Respects user's prefers-reduced-motion setting for accessibility.
   * Includes browser compatibility checks and graceful fallbacks.
   *
   * @function scrollToTop
   * @returns {void}
   *
   * @example
   * // Call from any component:
   * const { $scrollToTop } = useNuxtApp()
   * $scrollToTop() // Smooth scroll or instant based on user preference
   */
  const scrollToTop = () => {
    // Check if we're in the browser
    if (typeof window === "undefined") return;

    // Get the prefers-reduced-motion media query
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    // Scroll to top with appropriate behavior based on user preference
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  };

  // Make scrollToTop available globally in the Nuxt app
  return {
    provide: {
      scrollToTop,
    },
  };
});
