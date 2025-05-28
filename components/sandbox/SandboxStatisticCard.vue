<template>
  <div class="statistic-card" :style="animationStyle">
    <v-card
      variant="elevated"
      class="h-100 rounded-xl statistic-card-inner"
      role="article"
      tabindex="0"
      @keydown.enter="handleCardActivation"
      @keydown.space.prevent="handleCardActivation"
      :aria-labelledby="`stat-title-${uniqueId}`"
      :aria-describedby="`stat-desc-${uniqueId}`"
    >
      <v-card-text class="pa-0 h-100">
        <!-- Card Content Grid - Perfect alignment system -->
        <div class="card-content-grid">
          <!-- Icon Section -->
          <div class="icon-section" aria-hidden="true">
            <div class="statistic-icon-wrapper">
              <v-icon
                :icon="icon"
                size="64"
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

          <!-- Button Section -->
          <div class="button-section">
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              class="rounded-pill px-4"
              @click="handleLearnMore"
              :aria-label="`Learn more about ${title}`"
            >
              Learn More
              <v-icon end icon="mdi-arrow-right" size="small" />
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
/**
 * Sandbox Statistic Card Component - Refactored for Visual Consistency
 *
 * Displays individual statistics with visual emphasis and accessibility features.
 * Completely refactored to match the visual consistency patterns used in other
 * card sections throughout the page.
 *
 * Features:
 * - CSS Grid-based layout for perfect button alignment
 * - Consistent card heights with other sections (400px minimum)
 * - Catchy titles with coherent descriptions
 * - Action buttons aligned at bottom like other cards
 * - Enhanced accessibility with proper ARIA attributes
 * - Smooth animations with reduced motion support
 * - Professional hover and focus effects
 * - Full theme compatibility (light/dark)
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
 *
 * @typedef {Object} Props
 * @property {string} title - The title of the statistic card
 * @property {string} description - The description text for the statistic
 * @property {string} icon - Material Design icon name
 * @property {string} [color='primary'] - Vuetify color theme
 * @property {number} [delay=0] - Animation delay in milliseconds
 * @property {string|null} [url=null] - Optional URL for navigation (local or external)
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
   * <SandboxStatisticCard title="Stat" description="Desc" icon="mdi-chart" url="/about" />
   *
   * // External navigation
   * <SandboxStatisticCard title="Stat" description="Desc" icon="mdi-chart" url="https://example.com" />
   *
   * // No navigation (hover effects only)
   * <SandboxStatisticCard title="Stat" description="Desc" icon="mdi-chart" />
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
  },
  // Deprecated: Use 'url' prop instead
  actionUrl: {
    type: String,
    default: '#'
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

/**
 * Handle keyboard activation (Enter/Space)
 * Provides keyboard accessibility for interactive card
 * Announces selection to screen readers
 */
const handleCardActivation = () => {
  handleLearnMore();
};

/**
 * Handle Learn More button click with URL navigation support
 *
 * Supports both local and external URL navigation:
 * - Local URLs (starting with '/' or relative paths): Use Nuxt's navigateTo()
 * - External URLs (starting with 'http://' or 'https://'): Open in new window
 * - No URL provided: Show hover/focus effects only (no navigation)
 * - Fallback to legacy actionUrl for backward compatibility
 *
 * @returns {Promise<void>} Promise that resolves when navigation is complete
 * @throws {Error} When navigation fails
 *
 * @example
 * // With URL prop
 * <SandboxStatisticCard title="Stat" description="Desc" icon="mdi-chart" url="/about" />
 *
 * // Without URL prop (hover effects only)
 * <SandboxStatisticCard title="Stat" description="Desc" icon="mdi-chart" />
 */
const handleLearnMore = async () => {
  console.log('Statistic card Learn More clicked:', props.title);

  // Determine which URL to use (new 'url' prop takes precedence over legacy 'actionUrl')
  const targetUrl = props.url || (props.actionUrl !== '#' ? props.actionUrl : null);

  // If no URL is provided, only show hover/focus effects (current behavior)
  if (!targetUrl) {
    console.log('No URL provided - showing hover effects only');
    return;
  }

  // Announce to screen readers for accessibility
  if (announce) {
    announce(`Learn more about ${props.title}`);
  }

  try {
    // Check if it's an external URL
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      // External URL - open in new window with security attributes
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      console.log('Opened external URL:', targetUrl);
    } else {
      // Local URL - use Nuxt navigation
      await navigateTo(targetUrl);
      console.log('Navigated to local URL:', targetUrl);
    }
  } catch (error) {
    console.error('Navigation failed:', error);
    // Announce error to screen readers
    if (announce) {
      announce('Navigation failed. Please try again.');
    }
  }
};
</script>

<style scoped>
.statistic-card {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
  height: 100%;
}

/* Card styling with perfect height control */
.statistic-card-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
  border-radius: 1rem;
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
  padding: 2rem;
}

/* Icon Section */
.icon-section {
  grid-area: icon;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.statistic-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 20px;
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
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
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

/* Button Section */
.button-section {
  grid-area: button;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
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
    min-height: 350px;
  }

  .card-content-grid {
    padding: 1.5rem;
    gap: 1.25rem;
  }

  .statistic-title {
    font-size: 1.125rem;
  }

  .statistic-description {
    font-size: 0.8125rem;
  }

  .statistic-icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 16px;
  }
}

@media (min-width: 1024px) {
  .statistic-card-inner {
    min-height: 450px;
  }

  .card-content-grid {
    padding: 2.5rem;
    gap: 2rem;
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
