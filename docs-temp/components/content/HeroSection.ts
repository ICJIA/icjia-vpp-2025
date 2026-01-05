/**
 * @module HeroSection
 * @fileoverview Vue component: HeroSection
 */

/**
 * Hero Section Component
 *
 * A prominent banner section typically used at the top of landing pages.
 * Features a heading, description, call-to-action buttons, and hero image
 * with subtle animations and decorative elements.
 *
 * Features:
 * - Responsive layout that adapts to different screen sizes
 * - Animated content with fade-in and subtle movement effects
 * - Decorative background elements for visual interest
 * - Accessible image loading with spinner during load
 * - Respects user preferences for reduced motion
 * - Keyboard navigation support for interactive elements
 *
 * Accessibility Features:
 * - Proper heading hierarchy with semantic HTML
 * - ARIA labels for interactive elements
 * - Keyboard navigation support
 * - Decorative elements marked with aria-hidden
 * - Reduced motion support via media query
 *
 * @component
 * @requires ~/components/content/ImageWithSpinner
 */
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";

/**
 * Import the console logger
 *
 * NOTE: Console logging is intentionally enabled in all environments (including production)
 * during the pre-launch phase for monitoring and debugging purposes.
 */
import { useConsoleLogger } from "~/composables/useConsoleLogger";
const { logUI } = useConsoleLogger();

/**
 * Handle Get Started button activation
 *
 * This function is triggered when the user activates the primary CTA button
 * either by clicking or using keyboard navigation (Enter/Space).
 * In a real implementation, this would navigate to a sign-up or onboarding page.
 *
 * @returns {void}
 */
const handleGetStarted = () => {
  // This would typically navigate to a sign-up or onboarding page
  logUI("Get Started button activated", {
    component: "HeroSection",
    action: "primary-cta",
  });
};

/**
 * Handle Learn More button activation
 *
 * This function is triggered when the user activates the secondary CTA button
 * either by clicking or using keyboard navigation (Enter/Space).
 * In a real implementation, this would navigate to an about or features page.
 *
 * @returns {void}
 */
const handleLearnMore = () => {
  // This would typically navigate to an about or features page
  console.log("Learn More button activated");
};
