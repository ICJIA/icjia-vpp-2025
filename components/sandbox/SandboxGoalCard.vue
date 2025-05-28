<template>
  <div class="goal-card-container" :style="animationStyle">
    <v-card
      variant="elevated"
      class="goal-card-inner"
      role="article"
      tabindex="0"
      @keydown.enter="handleCardActivation"
      @keydown.space.prevent="handleCardActivation"
      :aria-labelledby="`goal-title-${uniqueId}`"
      :aria-describedby="`goal-desc-${uniqueId}`"
    >
      <!-- Card Content Grid -->
      <div class="card-content-grid">
        <!-- Badge Section -->
        <div class="badge-section" aria-hidden="true">
          <v-chip
            :color="goal.color"
            size="large"
            class="goal-number-badge"
          >
            Goal {{ goal.number }}
          </v-chip>
        </div>

        <!-- Icon Section -->
        <div class="icon-section" aria-hidden="true">
          <v-icon
            :icon="goal.icon"
            size="64"
            :color="goal.color"
            class="goal-icon"
          />
        </div>

        <!-- Title Section -->
        <div :id="`goal-title-${uniqueId}`" class="title-section">
          <h3 class="goal-title">
            {{ goal.title }}
          </h3>
        </div>

        <!-- Description Section -->
        <div :id="`goal-desc-${uniqueId}`" class="description-section">
          <p class="goal-description">
            {{ goal.description }}
          </p>
        </div>

        <!-- Highlights Section -->
        <div class="highlights-section">
          <h4 class="highlights-title">Key Focus Areas:</h4>
          <v-list class="highlights-list" role="list">
            <v-list-item
              v-for="(highlight, index) in goal.highlights"
              :key="index"
              class="highlight-item"
              role="listitem"
            >
              <template v-slot:prepend>
                <v-icon
                  :color="goal.color"
                  icon="mdi-check-circle"
                  size="small"
                  class="highlight-icon"
                  aria-hidden="true"
                />
              </template>
              <v-list-item-title class="highlight-text">
                {{ highlight }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <!-- Button Section - Always at bottom -->
        <div class="button-section">
          <v-btn
            variant="outlined"
            :color="goal.color"
            size="small"
            class="learn-more-btn"
            @click="handleLearnMore"
            @keydown.enter="handleLearnMore"
            @keydown.space.prevent="handleLearnMore"
            :aria-label="`Learn more about ${goal.title}`"
          >
            Learn More
            <v-icon end icon="mdi-arrow-right" size="small" />
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
/**
 * Sandbox Goal Card Component - Completely Refactored
 *
 * Displays individual strategic goals with perfect button alignment using CSS Grid.
 * Completely refactored for pixel-perfect horizontal alignment of Learn More buttons
 * across all cards regardless of content length variations.
 *
 * Features:
 * - CSS Grid-based layout for perfect button alignment
 * - Larger icons (size 64) for better visual impact
 * - Responsive design with consistent minimum heights
 * - Perfect button alignment using grid-template-areas
 * - Enhanced accessibility with proper ARIA attributes
 * - Smooth animations with reduced motion support
 * - Professional hover and focus effects
 * - Full theme compatibility (light/dark)
 * - WCAG 2.1 AA compliance with enhanced text contrast
 * - Goal number badges and key focus areas with checkmarks
 *
 * Technical Implementation:
 * - Uses CSS Grid with fixed template areas for content sections
 * - Button section uses grid-area: button for consistent positioning
 * - Highlights section expands with 1fr to fill available space
 * - Deep selectors override Vuetify card and list defaults
 * - Enhanced text contrast for optimal readability in both themes
 *
 * @component
 */
import { computed, ref, inject } from 'vue';

/**
 * Get the announce function from the provider for screen reader announcements
 */
const announce = inject('announce', null);

/**
 * Component props
 */
const props = defineProps({
  goal: {
    type: Object,
    required: true
  },
  delay: {
    type: Number,
    default: 0
  }
});

/**
 * Generate unique ID for accessibility using goal title for consistency
 * This ensures the same ID is generated on both server and client
 */
const uniqueId = computed(() => {
  // Create a deterministic ID based on the goal title
  return props.goal.title
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
 */
const handleCardActivation = () => {
  console.log('Goal card activated:', props.goal.title);

  // Announce to screen readers for accessibility
  if (announce) {
    announce(`Goal selected: ${props.goal.title}`);
  }
};

/**
 * Handle learn more button click
 */
const handleLearnMore = () => {
  // This would navigate to detailed goal information
  console.log('Learn more about goal:', props.goal.title);
};
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

/* Card styling with perfect height control */
.goal-card-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
  padding: 2rem;
  border-radius: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

/* Card Content Grid - Perfect alignment system */
.card-content-grid {
  display: grid;
  grid-template-rows: auto auto auto auto 1fr auto;
  grid-template-areas:
    "badge"
    "icon"
    "title"
    "description"
    "highlights"
    "button";
  height: 100%;
  gap: 1.5rem;
  align-content: start;
}

/* Badge Section */
.badge-section {
  grid-area: badge;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.goal-number-badge {
  font-weight: 700;
  letter-spacing: 0.025em;
}

/* Icon Section */
.icon-section {
  grid-area: icon;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.goal-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Title Section */
.title-section {
  grid-area: title;
  text-align: center;
}

.goal-title {
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
}

/* Description Section */
.description-section {
  grid-area: description;
  text-align: center;
}

.goal-description {
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

/* Highlights Section - Expands to fill space */
.highlights-section {
  grid-area: highlights;
  display: flex;
  flex-direction: column;
}

.highlights-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: rgb(var(--v-theme-on-surface));
  text-align: center;
}

.highlights-list {
  background: transparent !important;
  padding: 0 !important;
}

.highlight-item {
  padding: 0 !important;
  margin-bottom: 0.75rem;
  min-height: auto !important;
}

.highlight-icon {
  margin-right: 0.75rem;
}

.highlight-text {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

/* Button Section - Always at bottom */
.button-section {
  grid-area: button;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: auto;
  padding-top: 1rem;
}

.learn-more-btn {
  border-radius: 2rem;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.025em;
  min-width: 120px;
}

/* Hover and Focus States */
.goal-card-inner:hover,
.goal-card-inner:focus-visible {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.goal-card-inner:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Dark Theme Adjustments */
:root[data-theme="dark"] .goal-card-inner {
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
}

:root[data-theme="dark"] .goal-card-inner:hover,
:root[data-theme="dark"] .goal-card-inner:focus-visible {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6);
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

:root[data-theme="light"] .highlights-title,
:root:not([data-theme]) .highlights-title {
  color: rgba(0, 0, 0, 0.87);
}

:root[data-theme="light"] .highlight-text,
:root:not([data-theme]) .highlight-text {
  color: rgba(0, 0, 0, 0.7);
}

/* Enhanced text contrast for dark theme */
:root[data-theme="dark"] .goal-title {
  color: rgba(255, 255, 255, 0.95);
}

:root[data-theme="dark"] .goal-description {
  color: rgba(255, 255, 255, 0.85);
}

:root[data-theme="dark"] .highlights-title {
  color: rgba(255, 255, 255, 0.95);
}

:root[data-theme="dark"] .highlight-text {
  color: rgba(255, 255, 255, 0.8);
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

/* Override Vuetify list styling */
:deep(.v-list-item__prepend) {
  align-self: flex-start !important;
  margin-top: 0.125rem !important;
}

:deep(.v-list-item-title) {
  white-space: normal !important;
  line-height: 1.5 !important;
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
@media (max-width: 767px) {
  .goal-card-inner {
    min-height: 450px;
    padding: 1.5rem;
  }

  .card-content-grid {
    gap: 1.25rem;
  }

  .goal-title {
    font-size: 1.25rem;
  }

  .goal-description {
    font-size: 0.875rem;
  }
}

@media (min-width: 1024px) {
  .goal-card-inner {
    min-height: 550px;
    padding: 2.5rem;
  }

  .card-content-grid {
    gap: 2rem;
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

  .goal-card-inner:hover {
    transform: none;
  }
}
</style>
