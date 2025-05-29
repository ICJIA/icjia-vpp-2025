<template>
  <div class="statistic-card" :style="animationStyle">
    <v-card
      variant="elevated"
      class="h-100 rounded-xl statistic-card-inner"
      role="article"
      :aria-labelledby="`stat-title-${uniqueId}`"
      :aria-describedby="`stat-desc-${uniqueId}`"
    >
      <v-card-text class="pa-0 h-100">
        <!-- Card Content Grid - Static informational display -->
        <div class="card-content-grid">
          <!-- Icon Section -->
          <div class="icon-section" aria-hidden="true">
            <div class="statistic-icon-wrapper">
              <v-icon
                :icon="icon"
                size="80"
                color="primary"
                class="statistic-icon"
              />
            </div>
          </div>

          <!-- Title Section -->
          <div class="title-section">
            <h3 :id="`stat-title-${uniqueId}`" class="statistic-title">
              {{ title }}
            </h3>
          </div>

          <!-- Description Section -->
          <div class="description-section">
            <p :id="`stat-desc-${uniqueId}`" class="statistic-description">
              {{ description }}
            </p>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
/**
 * Home Statistic Card Component - Compact Infographic-Style Display
 *
 * Displays individual statistics as compact, infographic-style cards optimized for data presentation.
 * Features reduced white space, larger icons, prominent typography, and enhanced background contrast
 * for impactful visual communication and professional card-like appearance.
 *
 * Features:
 * - Compact infographic-style layout with optimized spacing
 * - Larger icons (80px) and prominent typography for visual impact
 * - Reduced card height and padding for efficient space usage
 * - Enhanced background contrast (white/light surface) for visual separation
 * - Enhanced accessibility with proper ARIA attributes
 * - Smooth entrance animations with reduced motion support
 * - Full theme compatibility (light/dark)
 * - WCAG 2.1 AA compliance
 * - Static display without interactive affordances
 *
 * @component
 */
import { computed } from 'vue';

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {string} title - The title of the statistic card
 * @property {string} description - The description text for the statistic
 * @property {string} icon - Material Design icon name
 * @property {string} [color='primary'] - Vuetify color theme
 * @property {number} [delay=0] - Animation delay in milliseconds
 */
const props = defineProps({
  title: {
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
 * Generate unique ID for accessibility using statistic title for consistency
 * This ensures the same ID is generated on both server and client
 */
const uniqueId = computed(() => {
  // Create a deterministic ID based on the statistic title
  return props.title
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
</script>

<style scoped>
.statistic-card {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
  height: 100%;
}

/* Card styling - Compact infographic-style display with enhanced background contrast */
.statistic-card-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: default;
  /* Enhanced background for better contrast against page backgrounds */
  background: #FFFFFF;
}

/* Dark mode styling with enhanced contrast */
:root[data-theme="dark"] .statistic-card-inner {
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
  /* Lighter surface color for better contrast against dark page backgrounds */
  background: #2A3441;
}

/* Card Content Grid - Compact infographic layout */
.card-content-grid {
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    "icon"
    "title"
    "description";
  height: 100%;
  gap: 1rem;
  align-content: start;
  padding: 1.5rem;
}

/* Icon Section */
.icon-section {
  grid-area: icon;
  display: flex;
  justify-content: center;
  align-items: center;
}

.statistic-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 24px;
  background-color: rgba(var(--v-theme-primary), 0.1);
  margin: 0 auto;
}

.statistic-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Title Section */
.title-section {
  grid-area: title;
  text-align: center;
}

.statistic-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
}

/* Description Section */
.description-section {
  grid-area: description;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.statistic-description {
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  color: rgb(var(--v-theme-on-surface-variant));
}



/* Enhanced text contrast for light theme */
:root[data-theme="light"] .statistic-title,
:root:not([data-theme]) .statistic-title {
  color: rgba(0, 0, 0, 0.87);
}

:root[data-theme="light"] .statistic-description,
:root:not([data-theme]) .statistic-description {
  color: rgba(0, 0, 0, 0.75);
}

/* Enhanced text contrast for dark theme */
:root[data-theme="dark"] .statistic-title {
  color: rgba(255, 255, 255, 0.95);
}

:root[data-theme="dark"] .statistic-description {
  color: rgba(255, 255, 255, 0.85);
}

/* Force Vuetify card to use our grid layout */
:deep(.v-card) {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

:deep(.v-card__text) {
  padding: 0 !important;
  flex: 1 !important;
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

/* Responsive adjustments */
@media (max-width: 599px) {
  .statistic-card-inner {
    min-height: 280px;
  }

  .card-content-grid {
    padding: 1.25rem;
    gap: 0.875rem;
  }

  .statistic-title {
    font-size: 1.25rem;
  }

  .statistic-description {
    font-size: 0.8125rem;
  }

  .statistic-icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 20px;
  }

  .statistic-icon {
    font-size: 64px !important;
  }
}

@media (min-width: 1024px) {
  .statistic-card-inner {
    min-height: 360px;
  }

  .card-content-grid {
    padding: 1.75rem;
    gap: 1.25rem;
  }

  .statistic-title {
    font-size: 1.625rem;
  }

  .statistic-icon-wrapper {
    width: 110px;
    height: 110px;
    border-radius: 26px;
  }

  .statistic-icon {
    font-size: 88px !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .statistic-card {
    animation: none;
    opacity: 1;
  }
}
</style>
