<template>
  <div class="statistic-card" :style="animationStyle">
    <v-card
      variant="elevated"
      class="h-100 rounded-xl pa-6 statistic-card-inner text-center"
      role="article"
      tabindex="0"
      @keydown.enter="handleCardActivation"
      @keydown.space.prevent="handleCardActivation"
      :aria-labelledby="`stat-value-${uniqueId}`"
      :aria-describedby="`stat-desc-${uniqueId}`"
    >
      <!-- Icon -->
      <div class="statistic-icon-wrapper mb-4" aria-hidden="true">
        <v-icon
          :icon="icon"
          size="x-large"
          color="primary"
        />
      </div>

      <!-- Statistic value -->
      <div :id="`stat-value-${uniqueId}`" class="statistic-value mb-2">
        <span class="text-h3 font-weight-bold">
          {{ statistic }}
        </span>
      </div>

      <!-- Label -->
      <div class="statistic-label mb-2">
        <span class="text-h6 font-weight-medium">
          {{ label }}
        </span>
      </div>

      <!-- Description -->
      <div :id="`stat-desc-${uniqueId}`" class="statistic-description">
        <span class="text-body-2 text-medium-emphasis">
          {{ description }}
        </span>
      </div>
    </v-card>
  </div>
</template>

<script setup>
/**
 * Sandbox Statistic Card Component
 *
 * Displays individual statistics with visual emphasis and accessibility features.
 * Used in the statistics section to showcase key data points from the VPP analysis.
 *
 * Features:
 * - Visual statistic presentation with icon and color coding
 * - Keyboard navigation support
 * - Screen reader accessibility
 * - Animation with configurable delay
 * - Hover and focus effects
 * - WCAG 2.1 AA compliance
 *
 * @component
 */
import { computed, onMounted, ref, inject } from 'vue';

/**
 * Get the announce function from the provider for screen reader announcements
 */
const announce = inject('announce', null);

/**
 * Component props
 */
const props = defineProps({
  statistic: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  delay: {
    type: Number,
    default: 0
  }
});

/**
 * Generate unique ID for accessibility using statistic label for consistency
 * This ensures the same ID is generated on both server and client
 */
const uniqueId = computed(() => {
  // Create a deterministic ID based on the statistic label
  return props.label
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
});

/**
 * Animation style with delay
 */
const animationStyle = computed(() => ({
  animationDelay: `${props.delay}ms`
}));

/**
 * Handle keyboard activation (Enter/Space)
 * Provides keyboard accessibility for interactive card
 * Announces selection to screen readers
 */
const handleCardActivation = () => {
  // This could expand the card or show more details
  console.log('Statistic card activated:', props.label);

  // Announce to screen readers for accessibility
  if (announce) {
    announce(`Statistic selected: ${props.statistic} ${props.label}`);
  }
};
</script>

<style scoped>
.statistic-card {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
  height: 100%;
}

.statistic-card-inner {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

/* Dark mode box shadow */
:root[data-theme="dark"] .statistic-card-inner {
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
}

.statistic-card-inner:hover,
.statistic-card-inner:focus-visible {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Dark mode hover box shadow */
:root[data-theme="dark"] .statistic-card-inner:hover,
:root[data-theme="dark"] .statistic-card-inner:focus-visible {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6);
}

.statistic-card-inner:focus-visible {
  outline: 3px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Icon wrapper styling - matches original FeatureCard design */
.statistic-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: rgba(var(--v-theme-primary), 0.1);
  margin: 0 auto;
}

/* Statistic value emphasis */
.statistic-value {
  line-height: 1.2;
}

/* Animation */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .statistic-card {
    animation: none;
    opacity: 1;
  }
  
  .statistic-card-inner {
    transition: none;
  }
  
  .statistic-card-inner:hover {
    transform: none;
  }
}
</style>
