<template>
  <div class="goal-card-container" :style="animationStyle">
    <v-card
      variant="elevated"
      class="goal-card-inner"
      role="article"
      tabindex="0"
      @click="handleCardClick"
      @keydown.enter="handleCardClick"
      @keydown.space.prevent="handleCardClick"
      :aria-labelledby="`goal-title-${uniqueId}`"
      :aria-describedby="`goal-desc-${uniqueId}`"
    >
      <!-- Flexible Responsive Layout -->
      <div class="card-content-flex">
        <!-- Icon and Badge Section -->
        <div class="icon-badge-section">
          <div class="badge-container" aria-hidden="true">
            <v-chip :color="goal.color" size="large" class="goal-number-badge">
              Goal {{ goal.number }}
            </v-chip>
          </div>
          <div class="icon-container" aria-hidden="true">
            <v-icon
              :icon="goal.icon"
              size="64"
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

        <!-- Key Focus Areas Section -->
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
      </div>
    </v-card>
  </div>
</template>

<script setup>
/**
 * Home Goal Card Component - Card-Level Navigation
 *
 * Displays individual strategic goals with card-level click navigation for
 * clean, accessible user experience.
 *
 * Features:
 * - CSS Grid-based layout for optimal content organization
 * - Larger icons (size 64) for better visual impact
 * - Responsive design with consistent minimum heights and equal card heights
 * - Card-level click navigation for entire card interaction
 * - Enhanced accessibility with proper ARIA attributes and keyboard navigation
 * - Smooth animations with reduced motion support
 * - Professional hover and focus effects
 * - Full theme compatibility (light/dark)
 * - WCAG 2.1 AA compliance with enhanced text contrast
 * - Goal number badges and key focus areas with checkmarks
 *
 * Technical Implementation:
 * - Uses CSS Grid with 5-row template for optimal content alignment
 * - Highlights section expands with 1fr to fill available space
 * - Deep selectors override Vuetify card and list defaults
 * - Enhanced text contrast for optimal readability in both themes
 * - Consistent vertical alignment of Key Focus Areas across cards
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
 * @property {string|null} [url=null] - Optional URL for navigation (local or external)
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
  /**
   * Optional URL for card navigation
   *
   * @param {string|null} url - URL for navigation
   * @returns {boolean} True if URL is valid or null
   * @throws {Error} When URL format is invalid
   *
   * @example
   * // Local navigation
   * <HomeGoalCard :goal="goalData" url="/about" />
   *
   * // External navigation
   * <HomeGoalCard :goal="goalData" url="https://example.com" />
   *
   * // No navigation (hover effects only)
   * <HomeGoalCard :goal="goalData" />
   */
  url: {
    type: String,
    default: null,
    validator: (value) => {
      if (value === null) return true;
      if (typeof value !== "string") return false;
      // Allow local paths and external URLs
      return (
        value.startsWith("/") ||
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("./") ||
        value.startsWith("../")
      );
    },
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

/**
 * Handle card click navigation with URL support
 *
 * Supports both local and external URL navigation:
 * - Local URLs (starting with '/' or relative paths): Use Nuxt's navigateTo()
 * - External URLs (starting with 'http://' or 'https://'): Open in new window
 * - No URL provided: Show hover/focus effects only (no navigation)
 *
 * @returns {Promise<void>} Promise that resolves when navigation is complete
 * @throws {Error} When navigation fails
 *
 * @example
 * // With URL prop
 * <HomeGoalCard :goal="goalData" url="/about" />
 *
 * // Without URL prop (hover effects only)
 * <HomeGoalCard :goal="goalData" />
 */
const handleCardClick = async () => {
  console.log("Goal card clicked:", props.goal.title);

  // If no URL is provided, only show hover/focus effects (current behavior)
  if (!props.url) {
    console.log("No URL provided - showing hover effects only");
    return;
  }

  // Announce to screen readers for accessibility
  if (announce) {
    announce(`Navigating to ${props.goal.title}`);
  }

  try {
    // Check if it's an external URL
    if (props.url.startsWith("http://") || props.url.startsWith("https://")) {
      // External URL - open in new window with security attributes
      window.open(props.url, "_blank", "noopener,noreferrer");
      console.log("Opened external URL:", props.url);
    } else {
      // Local URL - use Nuxt navigation
      await navigateTo(props.url);
      console.log("Navigated to local URL:", props.url);
    }
  } catch (error) {
    console.error("Navigation failed:", error);
    // Announce error to screen readers
    if (announce) {
      announce("Navigation failed. Please try again.");
    }
  }
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

/* Flexible Responsive Layout */
.card-content-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1.5rem;
  justify-content: space-between;
}

/* Icon and Badge Section */
.icon-badge-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-bottom: 0.5rem;
}

.badge-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.goal-number-badge {
  font-weight: 700;
  letter-spacing: 0.025em;
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

/* Key Focus Areas Section - Aligned to Bottom */
.highlights-section {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-top: auto;
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

/* Hover and Focus States */
.goal-card-inner:hover,
.goal-card-inner:focus-visible {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.goal-card-inner:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Dark Theme Adjustments */
:root[data-theme="dark"] .goal-card-inner {
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5),
    0 2px 4px -1px rgba(0, 0, 0, 0.4);
}

:root[data-theme="dark"] .goal-card-inner:hover,
:root[data-theme="dark"] .goal-card-inner:focus-visible {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7),
    0 10px 10px -5px rgba(0, 0, 0, 0.6);
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

/* Responsive adjustments for mobile and narrow screens */
@media (max-width: 959px) {
  .goal-card-inner {
    padding: 1.5rem;
  }

  .card-content-flex {
    gap: 1rem;
  }

  .badge-container {
    margin-bottom: 0.75rem;
  }

  .title-wrapper {
    margin-bottom: 0.75rem;
  }

  .goal-title {
    font-size: 1.25rem;
    line-height: 1.4;
  }

  .goal-description {
    font-size: 0.875rem;
  }
}

/* Extra responsive adjustments for very narrow screens */
@media (max-width: 600px) {
  .goal-card-inner {
    padding: 1rem;
  }

  .card-content-flex {
    gap: 0.75rem;
  }

  .goal-title {
    font-size: 1.125rem;
    line-height: 1.4;
  }

  .goal-description {
    font-size: 0.8125rem;
    line-height: 1.5;
  }

  .highlights-title {
    font-size: 0.9375rem;
  }

  .highlight-text {
    font-size: 0.8125rem;
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
