/**
 * @module DownloadPlanButton
 * @fileoverview Vue component: DownloadPlanButton
 */

/**
 * Download Plan Button Component
 *
 * Reusable component for downloading the Violence Prevention Plan PDF.
 * Provides consistent styling, functionality, and accessibility across all pages.
 *
 * Features:
 * - Consistent button styling matching HomeAction component
 * - Proper spacing (mt-8) between button and descriptive text
 * - Full keyboard accessibility with Enter and Space key support
 * - WCAG 2.1 AA compliance with proper ARIA labels
 * - Theme compatibility for both light and dark modes
 * - Hover effects and smooth animations
 * - Reduced motion support for accessibility
 * - Customizable text content via props
 *
 * @component
 */

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {string} [buttonText='Download the Plan'] - Text displayed on the button
 * @property {string} [descriptiveText='Download the complete Statewide Violence Prevention Plan for Illinois: 2025-2029'] - Descriptive text below button
 * @property {string} [ariaLabel='Download the complete Violence Prevention Plan PDF'] - ARIA label for accessibility
 * @property {string} [containerClass=''] - Additional CSS classes for the container
 */
const props = defineProps({
  buttonText: {
    type: String,
    default: "Download the Plan",
  },
  descriptiveText: {
    type: String,
    default:
      "Download the complete Statewide Violence Prevention Plan for Illinois: 2025-2029",
  },
  ariaLabel: {
    type: String,
    default: "Go to download page for the Violence Prevention Plan",
  },
  containerClass: {
    type: String,
    default: "",
  },
});

/**
 * Handle Download the Plan button activation
 * Navigates to the download page where users can choose from multiple formats
 */
const handleDownloadPlan = () => {
  // Navigate to the download page
  navigateTo("/download");
};
