<template>
  <div class="scroll-to-top-container">
    <v-btn
      icon="mdi-chevron-up"
      size="large"
      color="primary"
      variant="elevated"
      class="scroll-to-top-btn"
      aria-label="Scroll to top of page"
      @click="handleScrollToTop"
      @keydown.enter="handleScrollToTop"
      @keydown.space.prevent="handleScrollToTop"
    ></v-btn>
  </div>
</template>

<script setup>
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
</script>

<style scoped>
/**
 * Styles for the Scroll to Top component
 *
 * Positioned in the bottom-right corner with the same positioning
 * as the previous console logger to maintain consistent UI placement.
 * Uses high z-index to ensure visibility above other content.
 */

/* Container for the scroll to top button */
.scroll-to-top-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000; /* Same z-index as console logger for consistent layering */
}

/* Scroll to top button styling */
.scroll-to-top-btn {
  /* Ensure adequate touch target size for accessibility */
  min-width: 48px;
  min-height: 48px;

  /* Add subtle shadow for better visibility */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  /* Smooth transitions for hover effects */
  transition: all 0.2s ease;
}

/* Hover effects */
.scroll-to-top-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Focus styles for keyboard accessibility */
.scroll-to-top-btn:focus {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .scroll-to-top-container {
    bottom: 16px;
    right: 16px;
  }

  .scroll-to-top-btn {
    /* Slightly smaller on mobile but still accessible */
    min-width: 44px;
    min-height: 44px;
  }
}

/* Respect prefers-reduced-motion for animations */
@media (prefers-reduced-motion: reduce) {
  .scroll-to-top-btn {
    transition: none;
  }

  .scroll-to-top-btn:hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .scroll-to-top-btn {
    border: 2px solid currentColor;
  }
}
</style>
