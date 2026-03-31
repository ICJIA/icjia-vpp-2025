<template>
  <div class="feature-card" :style="animationStyle">
    <v-card
      variant="elevated"
      class="h-100 rounded-xl pa-6 feature-card-inner"
      role="article"
      tabindex="0"
      @keydown.enter="handleCardActivation"
      @keydown.space.prevent="handleCardActivation"
      :aria-labelledby="`feature-title-${uniqueId}`"
      :aria-describedby="`feature-desc-${uniqueId}`"
    >
      <div class="feature-icon-wrapper mb-4" aria-hidden="true">
        <v-icon :icon="icon" size="x-large" color="primary" />
      </div>

      <div :id="`feature-title-${uniqueId}`">
        <slot mdc-unwrap="p" />
      </div>
    </v-card>
  </div>
</template>

<script setup>
/**
 * Accessible feature card component with animation and keyboard support
 *
 * This component displays a feature with an icon, title, and description.
 * It includes:
 * - Keyboard navigation support (Enter/Space activation)
 * - Screen reader announcements
 * - Proper ARIA attributes for accessibility
 * - Animation with configurable delay
 * - Focus styles matching hover effects
 *
 * @component
 */
import { computed, ref, inject, useId } from "vue";

/**
 * Get the announce function from the provider for screen reader announcements
 */
const announce = inject("announce", null);

/**
 * Component props
 */
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
});

/**
 * Generate SSR-safe unique ID for ARIA attributes
 * Uses Vue's useId() composable to ensure consistent IDs across server and client
 */
const uniqueId = useId();

/**
 * Computed style for animation delay based on the delay prop
 * Allows for staggered animations when multiple cards are displayed
 *
 * @returns {Object} CSS style object with animation delay
 */
const animationStyle = computed(() => ({
  animationDelay: `${props.delay}s`,
}));

/**
 * Handle keyboard activation (Enter/Space)
 * Provides keyboard accessibility for interactive card
 * Announces selection to screen readers
 */
const handleCardActivation = () => {
  // This would typically navigate to a feature detail page or show more information
  console.log("Feature card activated");

  // Announce to screen readers for accessibility
  if (announce) {
    announce("Feature card selected");
  }
};
</script>

<style scoped>
.feature-card {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
  height: 100%;
}

.feature-card-inner {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Dark mode box shadow */
:root[data-theme="dark"] .feature-card-inner {
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.5),
    0 2px 4px -1px rgba(0, 0, 0, 0.4);
}

.feature-card-inner:hover,
.feature-card-inner:focus-visible {
  transform: translateY(-8px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Dark mode hover box shadow */
:root[data-theme="dark"] .feature-card-inner:hover,
:root[data-theme="dark"] .feature-card-inner:focus-visible {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.7),
    0 10px 10px -5px rgba(0, 0, 0, 0.6);
}

.feature-card-inner:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.feature-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: rgba(var(--v-theme-primary), 0.1);
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
