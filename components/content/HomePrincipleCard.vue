<template>
  <div class="principle-card-container" :style="animationStyle">
    <v-card
      variant="elevated"
      class="principle-card-inner"
      role="article"
      tabindex="0"
      @click="handleCardClick"
      @keydown.enter="handleCardClick"
      @keydown.space.prevent="handleCardClick"
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

        <!-- Button Section -->
        <div class="button-section">
          <v-btn
            color="primary"
            variant="outlined"
            size="default"
            class="rounded-pill px-6"
            append-icon="mdi-arrow-right"
            @click.stop="handleLearnMoreClick"
            :aria-label="`Learn more about ${principle.title}`"
          >
            Learn More
          </v-btn>
        </div>

      </div>
    </v-card>
  </div>
</template>

<script setup>
/**
 * Principle Card Component - Dual Navigation with Learn More Buttons
 *
 * Displays individual guiding principles with both card-level click navigation and dedicated
 * "Learn More" buttons for enhanced user experience and clear call-to-action.
 *
 * Features:
 * - CSS Grid-based layout for optimal content organization with bottom-aligned buttons
 * - Larger icons (size 64) for better visual impact
 * - Responsive design with consistent minimum heights and equal card heights
 * - Dual navigation: card-level click and dedicated "Learn More" buttons
 * - Bottom-aligned buttons regardless of content length differences
 * - Enhanced accessibility with proper ARIA attributes and keyboard navigation
 * - Smooth animations with reduced motion support
 * - Professional hover and focus effects
 * - Full theme compatibility (light/dark)
 * - WCAG 2.1 AA compliance maintained
 *
 * Technical Implementation:
 * - Uses CSS Grid with fixed template areas including button section
 * - Description section expands with 1fr to fill available space
 * - Button section uses auto height with bottom alignment
 * - Deep selectors override Vuetify card defaults for perfect control
 * - Dual navigation with @click.stop to prevent event bubbling
 *
 * @component
 */
import { computed, inject } from 'vue';

/**
 * Get the announce function from the provider for screen reader announcements
 */
const announce = inject('announce', null);

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {Object} principle - The principle object containing title, description, etc.
 * @property {number} [delay=0] - Animation delay in milliseconds
 * @property {string|null} [url=null] - Optional URL for navigation (local or external)
 */
const props = defineProps({
  principle: {
    type: Object,
    required: true
  },
  delay: {
    type: Number,
    default: 0
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
   * <SandboxPrincipleCard :principle="principleData" url="/about" />
   *
   * // External navigation
   * <SandboxPrincipleCard :principle="principleData" url="https://example.com" />
   *
   * // No navigation (hover effects only)
   * <SandboxPrincipleCard :principle="principleData" />
   */
  url: {
    type: String,
    default: null,
    validator: (value) => {
      if (value === null) return true;
      if (typeof value !== 'string') return false;
      // Allow local paths and external URLs
      return value.startsWith('/') ||
             value.startsWith('http://') ||
             value.startsWith('https://') ||
             value.startsWith('./') ||
             value.startsWith('../');
    }
  }
});

/**
 * Generate unique ID for accessibility using principle title for consistency
 * This ensures the same ID is generated on both server and client
 */
const uniqueId = computed(() => {
  // Create a deterministic ID based on the principle title
  return props.principle.title
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
 * <SandboxPrincipleCard :principle="principleData" url="/about" />
 *
 * // Without URL prop (hover effects only)
 * <SandboxPrincipleCard :principle="principleData" />
 */
const handleCardClick = async () => {
  console.log('Principle card clicked:', props.principle.title);

  // If no URL is provided, only show hover/focus effects (current behavior)
  if (!props.url) {
    console.log('No URL provided - showing hover effects only');
    return;
  }

  // Announce to screen readers for accessibility
  if (announce) {
    announce(`Navigating to learn more about ${props.principle.title}`);
  }

  try {
    // Check if it's an external URL
    if (props.url.startsWith('http://') || props.url.startsWith('https://')) {
      // External URL - open in new window with security attributes
      window.open(props.url, '_blank', 'noopener,noreferrer');
      console.log('Opened external URL:', props.url);
    } else {
      // Local URL - use Nuxt navigation
      await navigateTo(props.url);
      console.log('Navigated to local URL:', props.url);
    }
  } catch (error) {
    console.error('Navigation failed:', error);
    // Announce error to screen readers
    if (announce) {
      announce('Navigation failed. Please try again.');
    }
  }
};

/**
 * Handle Learn More button click
 * Uses the same navigation logic as card click but with button-specific logging
 * The @click.stop prevents event bubbling to avoid triggering card click
 *
 * @returns {Promise<void>} Promise that resolves when navigation is complete
 */
const handleLearnMoreClick = async () => {
  console.log('Learn More button clicked:', props.principle.title);

  // Use the same navigation logic as card click
  await handleCardClick();
};
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
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

/* Hover and Focus States */
.principle-card-inner:hover,
.principle-card-inner:focus-visible {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.principle-card-inner:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Dark Theme Adjustments */
:root[data-theme="dark"] .principle-card-inner {
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
  /* Enhanced background for better contrast against dark page backgrounds */
  background: #2A3441 !important;
}

:root[data-theme="dark"] .principle-card-inner:hover,
:root[data-theme="dark"] .principle-card-inner:focus-visible {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6);
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

  .principle-card-inner {
    transition: none;
  }

  .principle-card-inner:hover {
    transform: none;
  }
}
</style>
