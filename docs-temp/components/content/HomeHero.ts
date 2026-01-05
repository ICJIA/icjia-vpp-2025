/**
 * @module HomeHero
 * @fileoverview Vue component: HomeHero
 */

/**
 * Home Hero Section Component
 *
 * Hero section for the Violence Prevention Plan homepage featuring mission-driven
 * content with compelling opening statements about violence prevention being paramount.
 * Includes an interactive hero image with professional hover effects and coordinated
 * animations that match the homepage design patterns.
 *
 * @component
 *
 * @features
 * **Content & Layout:**
 * - Mission-driven opening statements from VPP analysis
 * - Responsive two-column layout (text left, image right)
 * - Proportional hero image that scales with viewport
 * - Centered image positioning with proper aspect ratio maintenance
 * - Decorative background elements for visual interest
 *
 * **Interactive Elements:**
 * - Clickable hero image and caption that navigate to /download page
 * - Professional hover effects matching homepage card patterns
 * - Subtle upward transform (translateY(-4px)) on image hover
 * - Soft box-shadow effects that appear on hover for depth
 * - Smooth 0.3s ease transitions for professional animation
 * - Caption color change on hover for additional visual feedback
 *
 * **Animation System:**
 * - Coordinated fadeSlideUp animation sequence across all elements
 * - Staggered timing: title (0.2s) → description (0.4s) → buttons (0.6s) → image (0.8s) → caption (1.0s)
 * - Elements start with opacity: 0 and animate to full visibility
 * - Consistent 0.8s animation duration with cubic-bezier easing
 *
 * **Visual Design:**
 * - Flat, non-tilted image appearance (no 3D perspective transforms)
 * - No box-shadow in default state for clean, flush appearance
 * - Subtle border-radius (0.5rem) for visual polish
 * - Hover effects constrained to actual image dimensions (not container)
 * - Theme-aware styling with enhanced shadows in dark mode
 *
 * **Accessibility & Compliance:**
 * - WCAG 2.1 AA compliant contrast ratios in both light and dark themes
 * - Full keyboard accessibility with Enter and Space key support
 * - Proper ARIA attributes (role="button", aria-label) for screen readers
 * - Focusable elements with tabindex="0" for keyboard navigation
 * - Respects prefers-reduced-motion for users with motion sensitivity
 * - Maintains minimum 44px touch targets for mobile accessibility
 * - Comprehensive screen reader support with descriptive labels
 *
 * @example
 * ```vue
 * <HomeHero />
 * ```
 *
 * @since 2025-07-31 Enhanced with interactive hover effects and coordinated animations
 */
/**
 * Handle Download the Plan button and hero image/caption activation
 *
 * Navigates to the download page where users can choose from multiple formats
 * including PDF, accessible formats, and other document types. This function
 * is triggered by:
 * - Download button click
 * - Hero image click
 * - Hero caption click
 * - Keyboard activation (Enter/Space) on any of the above elements
 *
 * @function
 * @returns {void}
 * @example
 * // Triggered automatically by user interaction
 * handleDownloadPlan();
 */
const handleDownloadPlan = () => {
  // Navigate to the download page
  navigateTo("/download");
};

/**
 * Handle Learn More button activation
 *
 * Smoothly scrolls to the Letter from Delrice Adams section to provide users
 * with immediate context about the Violence Prevention Plan from ICJIA's
 * Executive Director. Uses native smooth scrolling behavior with proper offset
 * for fixed navigation header.
 *
 * @function
 * @returns {void}
 * @example
 * // Triggered by Learn More button click or keyboard activation
 * handleLearnMore();
 */
const handleLearnMore = () => {
  // Scroll to the Letter from Delrice Adams section (letters-section)
  const lettersSection = document.querySelector(".letters-section");
  if (lettersSection) {
    // Calculate offset for fixed navigation (80px as per project guidelines)
    const offset = 80;
    const elementPosition = lettersSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};
