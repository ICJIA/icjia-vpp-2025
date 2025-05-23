/**
 * Client-side plugin to handle scroll behavior for navigation
 *
 * This plugin provides:
 * - A function to scroll to the top of the page
 * - Ability to manually trigger scroll to top
 * - Accessibility support through respecting prefers-reduced-motion
 */

export default defineNuxtPlugin((nuxtApp) => {
  /**
   * Scroll to the top of the page with smooth behavior
   * Respects user's prefers-reduced-motion setting
   */
  const scrollToTop = () => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    // Get the prefers-reduced-motion media query
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Scroll to top with appropriate behavior based on user preference
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
    });
  };

  // Make scrollToTop available globally in the Nuxt app
  return {
    provide: {
      scrollToTop
    }
  };
});
