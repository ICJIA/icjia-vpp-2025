<template>
  <div class="download-plan-button text-center" :class="containerClass">
    <v-btn
      color="primary"
      size="x-large"
      class="rounded-pill px-8 py-3 elevation-3 download-cta-button"
      @click="handleDownloadPlan"
      @keydown.enter="handleDownloadPlan"
      @keydown.space.prevent="handleDownloadPlan"
      :aria-label="ariaLabel"
    >
      {{ buttonText }}
      <v-icon end icon="mdi-download" />
    </v-btn>
    <p class="text-body-2 text-medium-emphasis mt-8">
      {{ descriptiveText }}
    </p>
  </div>
</template>

<script setup>
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
    default: 'Download the Plan'
  },
  descriptiveText: {
    type: String,
    default: 'Download the complete Statewide Violence Prevention Plan for Illinois: 2025-2029'
  },
  ariaLabel: {
    type: String,
    default: 'Download the complete Violence Prevention Plan PDF'
  },
  containerClass: {
    type: String,
    default: ''
  }
});

/**
 * Handle Download the Plan button activation
 * Downloads the complete Violence Prevention Plan PDF document
 * Opens PDF in new tab for accessibility and user convenience
 */
const handleDownloadPlan = () => {
  // Open the complete Violence Prevention Plan PDF in a new tab
  window.open('/files/Full_Report_Statewide_Violence_Prevention_Plan_2025-2029_2025_Update.pdf', '_blank');
};
</script>

<style scoped>
/* Download CTA button styling - matches HomeAction component */
.download-cta-button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.download-cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .download-cta-button {
    transition: none;
  }

  .download-cta-button:hover {
    transform: none;
  }
}
</style>
