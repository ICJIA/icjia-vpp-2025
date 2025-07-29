<template>
  <div class="goal-card-container" :style="animationStyle">
    <NuxtLink
      :to="goal.url"
      class="goal-card-link"
      :aria-labelledby="`goal-title-${uniqueId}`"
      :aria-describedby="`goal-desc-${uniqueId}`"
    >
      <v-card variant="elevated" class="goal-card-inner" role="article">
        <!-- Flexible Responsive Layout -->
        <div class="card-content-flex">
          <!-- Icon Section -->
          <div class="icon-section">
            <div class="icon-container" aria-hidden="true">
              <v-icon
                :icon="goal.icon"
                size="80"
                :color="goal.color"
                class="goal-icon"
              />
            </div>
          </div>

          <!-- Title and Description Section -->
          <div class="title-description-section">
            <div :id="`goal-title-${uniqueId}`" class="title-wrapper">
              <h3 class="goal-title">
                {{ goal.title }}
              </h3>
            </div>
            <div :id="`goal-desc-${uniqueId}`" class="description-wrapper">
              <p class="goal-description">
                {{ goal.description }}
              </p>
            </div>
          </div>
        </div>
      </v-card>
    </NuxtLink>
  </div>
</template>

<script setup>
/**
 * Home Goal Card Component - Interactive Navigation
 *
 * Displays individual strategic goals as clickable cards that navigate to
 * the goals and recommendations page.
 *
 * Features:
 * - CSS Grid-based layout for optimal content organization
 * - Larger icons (size 64) for better visual impact
 * - Responsive design with consistent minimum heights and equal card heights
 * - Interactive hover effects and click navigation
 * - Enhanced accessibility with proper ARIA attributes
 * - Smooth animations with reduced motion support
 * - Full theme compatibility (light/dark)
 * - Enhanced background contrast for better visual separation from section backgrounds
 * - WCAG 2.1 AA compliance with enhanced text contrast
 * - Goal number badges for clear identification
 *
 * Technical Implementation:
 * - Uses NuxtLink for client-side navigation
 * - CSS Grid with flexible layout for optimal content alignment
 * - Deep selectors override Vuetify card defaults
 * - Enhanced text contrast for optimal readability in both themes
 * - Balanced styling matching HomeAction cards for consistent visual hierarchy
 * - Hover effects that preserve background colors in both themes
 *
 * @component
 */
import { computed, inject } from "vue";

/**
 * Get the announce function from the provider for screen reader announcements
 */
const announce = inject("announce", null);

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {Object} goal - The goal object containing title, description, etc.
 * @property {number} [delay=0] - Animation delay in milliseconds
 */
const props = defineProps({
  goal: {
    type: Object,
    required: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
});

/**
 * Generate unique ID for accessibility using goal title for consistency
 * This ensures the same ID is generated on both server and client
 */
const uniqueId = computed(() => {
  // Create a deterministic ID based on the goal title
  return props.goal.title
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
.goal-card-container {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* NuxtLink wrapper styling */
.goal-card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.goal-card-link:hover {
  transform: translateY(-4px);
}

.goal-card-link:focus {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
  border-radius: 1rem;
}

/* Card styling with perfect height control - matching HomeAction card styling */
.goal-card-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
  padding: 1.5rem;
  border-radius: 1rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.goal-card-link:hover .goal-card-inner {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Flexible Responsive Layout */
.card-content-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1.5rem;
  justify-content: space-between;
}

/* Icon Section */
.icon-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-bottom: 1rem;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.goal-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Title and Description Section */
.title-description-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  padding-bottom: 1rem;
}

.title-wrapper {
  margin-bottom: 1rem;
}

.goal-title {
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
  text-align: center;
  width: 100%;
}

.description-wrapper {
  margin-bottom: 0.5rem;
}

.goal-description {
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.87);
  text-align: center;
}

/* Dark Theme Adjustments - matching HomeAction card styling */
:root[data-theme="dark"] .goal-card-inner {
  background: #2a3441 !important; /* Same color as HomeAction cards */
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.5),
    0 2px 4px -1px rgba(0, 0, 0, 0.4);
}

:root[data-theme="dark"] .goal-card-link:hover .goal-card-inner {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.6),
    0 4px 6px -2px rgba(0, 0, 0, 0.5);
}

:root[data-theme="dark"] .goal-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Light theme text contrast */
:root[data-theme="light"] .goal-title,
:root:not([data-theme]) .goal-title {
  color: rgba(0, 0, 0, 0.87);
}

:root[data-theme="light"] .goal-description,
:root:not([data-theme]) .goal-description {
  color: rgba(0, 0, 0, 0.75);
}

/* Enhanced text contrast for dark theme */
:root[data-theme="dark"] .goal-title {
  color: rgba(255, 255, 255, 0.95);
}

:root[data-theme="dark"] .goal-description {
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

/* Responsive adjustments - matching HomeAction card styling */
@media (max-width: 599px) {
  .goal-card-inner {
    min-height: 280px;
    padding: 1.25rem;
  }

  .card-content-flex {
    gap: 0.875rem;
    justify-content: center; /* Center content instead of space-between */
  }

  .icon-section {
    padding-bottom: 0.5rem;
  }

  .title-wrapper {
    margin-bottom: 0.5rem;
  }

  .title-description-section {
    padding-bottom: 0.5rem;
  }

  .goal-title {
    font-size: 1.25rem;
    line-height: 1.4;
  }

  .goal-description {
    font-size: 0.875rem;
    line-height: 1.5;
  }
}

@media (min-width: 1024px) {
  .goal-card-inner {
    min-height: 350px;
    padding: 2rem;
  }

  .card-content-flex {
    gap: 1.25rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .goal-card-container {
    animation: none;
    opacity: 1;
  }

  .goal-card-inner {
    transition: none;
  }
}
</style>
