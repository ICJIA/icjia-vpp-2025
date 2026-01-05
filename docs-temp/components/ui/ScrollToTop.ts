/**
 * @module ScrollToTop
 * @fileoverview Vue component: ScrollToTop
 */

/**
 * Scroll to Top Button Component
 *
 * A floating action button that allows users to quickly scroll to the top of the page.
 * Positioned in the bottom-right corner with smooth scrolling behavior that respects
 * user accessibility preferences.
 *
 * Features:
 * - Smooth scrolling with prefers-reduced-motion support
 * - Accessible with proper ARIA labels and keyboard support
 * - Consistent styling with the design system
 * - Positioned to replace the development console logger
 * - Visible across all pages and breakpoints
 *
 * Accessibility:
 * - WCAG 2.1 AA compliant
 * - Keyboard accessible (Enter and Space keys)
 * - Respects prefers-reduced-motion user preference
 * - Proper ARIA labeling for screen readers
 * - Adequate touch target size (48x48px minimum)
 *
 * @component
 * @requires ~/plugins/scroll-behavior.client.js
 */

/**
 * Get the scroll to top function from the Nuxt app
 * This uses the existing scroll behavior plugin that respects user preferences
 */
const { $scrollToTop } = useNuxtApp();

/**
 * Handle scroll to top action
 *
 * Uses the global scrollToTop function which automatically handles:
 * - Smooth scrolling for users who allow motion
 * - Instant scrolling for users with prefers-reduced-motion
 * - Browser compatibility checks
 *
 * @returns {void}
 */
const handleScrollToTop = () => {
  if ($scrollToTop) {
    $scrollToTop();
  } else {
    // Fallback for cases where the plugin isn't available
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }
};
