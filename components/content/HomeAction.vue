<template>
  <section class="section py-16 bg-primary-lighten-5">
    <v-container>
      <div class="text-center mb-12">
        <slot mdc-unwrap="p" />
      </div>

      <div class="text-center">
        <v-btn
          color="primary"
          size="x-large"
          class="rounded-pill px-8 py-3 elevation-3 cta-button"
        >
          <slot name="button-text" mdc-unwrap="p" />
          <v-icon end icon="mdi-arrow-right" />
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<script setup>
/**
 * Home Action Component
 *
 * Displays the main call-to-action section for the home page.
 * This component now uses slots for content management, allowing all text content
 * to be defined in markdown files for better searchability and content management.
 *
 * Features:
 * - Centered layout with prominent heading and description
 * - Large call-to-action button with icon
 * - Hover animations and visual feedback
 * - Accessible button with proper focus states
 * - Slot-based content management for title, description, and button text
 *
 * Accessibility Features:
 * - Proper heading hierarchy
 * - Keyboard navigation support
 * - Focus states matching hover effects
 * - Screen reader friendly content structure
 *
 * @component
 */
</script>

<style scoped>
.cta-button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
