<template>
  <div class="principle-card-container" :style="animationStyle">
    <v-card
      variant="elevated"
      class="principle-card-inner"
      role="article"
      :aria-labelledby="`principle-title-${uniqueId}`"
      :aria-describedby="`principle-desc-${uniqueId}`"
    >
      <!-- Card Content Grid -->
      <div class="card-content-grid">
        <!-- Icon Section -->
        <div class="icon-section" aria-hidden="true">
          <v-icon
            :icon="principle.icon"
            size="64"
            :color="principle.color"
            class="principle-icon"
          />
        </div>

        <!-- Title Section -->
        <div :id="`principle-title-${uniqueId}`" class="title-section">
          <h3 class="principle-title">
            {{ principle.title }}
          </h3>
        </div>

        <!-- Description Section -->
        <div :id="`principle-desc-${uniqueId}`" class="description-section">
          <p class="principle-description">
            {{ principle.description }}
          </p>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
/**
 * Principle Card Component - Static Display
 *
 * Displays individual guiding principles as static, non-interactive cards
 * for clean, presentational display.
 *
 * Features:
 * - CSS Grid-based layout for optimal content organization
 * - Larger icons (size 64) for better visual impact
 * - Responsive design with consistent minimum heights and equal card heights
 * - Static display with no interactive behaviors
 * - Enhanced accessibility with proper ARIA attributes
 * - Smooth animations with reduced motion support
 * - Full theme compatibility (light/dark)
 * - WCAG 2.1 AA compliance maintained
 *
 * Technical Implementation:
 * - Uses CSS Grid with fixed template areas for content organization
 * - Description section expands with 1fr to fill available space
 * - Deep selectors override Vuetify card defaults for perfect control
 * - Proper semantic HTML structure with ARIA attributes
 *
 * @component
 */
import { computed } from "vue";

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {Object} principle - The principle object containing title, description, etc.
 * @property {number} [delay=0] - Animation delay in milliseconds
 */
const props = defineProps({
  principle: {
    type: Object,
    required: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
});

/**
 * Generate unique ID for accessibility using principle title for consistency
 * This ensures the same ID is generated on both server and client
 */
const uniqueId = computed(() => {
  // Create a deterministic ID based on the principle title
  return props.principle.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
});

/**
 * Animation style with delay
 */
const animationStyle = computed(() => ({
  animationDelay: `${props.delay}ms`,
}));
</script>

<style scoped>
/* Container for animation and positioning */
.principle-card-container {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Card styling with perfect height control */
.principle-card-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  padding: 2rem;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Card Content Grid - Perfect alignment system */
.card-content-grid {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas:
    "icon"
    "title"
    "description"
    "button";
  height: 100%;
  gap: 1.5rem;
  align-content: start;
}

/* Icon Section */
.icon-section {
  grid-area: icon;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.principle-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Title Section */
.title-section {
  grid-area: title;
  text-align: center;
}

.principle-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
}

/* Description Section - Expands to fill space */
.description-section {
  grid-area: description;
  display: flex;
  align-items: flex-start;
  text-align: center;
}

.principle-description {
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  /* Enhanced contrast for better readability */
  color: rgba(var(--v-theme-on-surface), 0.87);
}

/* Button Section - Bottom aligned */
.button-section {
  grid-area: button;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
}

/* Dark Theme Adjustments */
:root[data-theme="dark"] .principle-card-inner {
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.5),
    0 2px 4px -1px rgba(0, 0, 0, 0.4);
  /* Enhanced background for better contrast against dark page backgrounds */
  background: #2a3441 !important;
}

:root[data-theme="dark"] .principle-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Light theme text contrast */
:root[data-theme="light"] .principle-title,
:root:not([data-theme]) .principle-title {
  color: rgba(0, 0, 0, 0.87);
}

:root[data-theme="light"] .principle-description,
:root:not([data-theme]) .principle-description {
  color: rgba(0, 0, 0, 0.75);
}

/* Enhanced text contrast for dark theme */
:root[data-theme="dark"] .principle-title {
  color: rgba(255, 255, 255, 0.95);
}

:root[data-theme="dark"] .principle-description {
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
  .principle-card-inner {
    min-height: 350px;
    padding: 1.5rem;
  }

  .card-content-grid {
    gap: 1.25rem;
  }

  .principle-title {
    font-size: 1.125rem;
  }

  .principle-description {
    font-size: 0.8125rem;
  }
}

@media (min-width: 1024px) {
  .principle-card-inner {
    min-height: 450px;
    padding: 2.5rem;
  }

  .card-content-grid {
    gap: 2rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .principle-card-container {
    animation: none;
    opacity: 1;
  }
}
</style>
