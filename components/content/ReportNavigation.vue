<template>
  <div v-if="navigationData" class="report-navigation">
    <!-- Use responsive container based on TOC presence -->
    <div :class="containerClass">
      <v-row class="navigation-row">
        <!-- Previous Page Column - Always present (left column) -->
        <v-col cols="12" md="6" class="navigation-col">
          <v-card
            v-if="navigationData.previous"
            :to="navigationData.previous.path"
            class="navigation-card navigation-card--previous"
            :class="{ 'navigation-card--mobile': $vuetify.display.smAndDown }"
            elevation="2"
            :ripple="true"
            :aria-label="`Previous section: ${navigationData.previous.title}`"
            role="button"
            tabindex="0"
            @keydown.enter="navigateToPage(navigationData.previous.path)"
            @keydown.space.prevent="navigateToPage(navigationData.previous.path)"
          >
            <v-card-text class="navigation-content">
              <!-- Top section with direction and title -->
              <div class="navigation-top">
                <!-- Direction indicator -->
                <div class="navigation-direction">
                  <v-icon
                    icon="mdi-chevron-left"
                    size="small"
                    class="direction-icon"
                    aria-hidden="true"
                  />
                  <span class="direction-text">Previous Section</span>
                </div>

                <!-- Page title -->
                <h3 class="navigation-title">
                  {{ navigationData.previous.title }}
                </h3>
              </div>

              <!-- Bottom section with summary -->
              <div class="navigation-bottom">
                <!-- Page summary -->
                <p class="navigation-summary">
                  {{ navigationData.previous.summary }}
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Next Page Column - Always present (right column) -->
        <v-col cols="12" md="6" class="navigation-col">
          <v-card
            v-if="navigationData.next"
            :to="navigationData.next.path"
            class="navigation-card navigation-card--next"
            :class="{ 'navigation-card--mobile': $vuetify.display.smAndDown }"
            elevation="2"
            :ripple="true"
            :aria-label="`Next section: ${navigationData.next.title}`"
            role="button"
            tabindex="0"
            @keydown.enter="navigateToPage(navigationData.next.path)"
            @keydown.space.prevent="navigateToPage(navigationData.next.path)"
          >
            <v-card-text class="navigation-content">
              <!-- Top section with direction and title -->
              <div class="navigation-top">
                <!-- Direction indicator -->
                <div class="navigation-direction navigation-direction--next">
                  <span class="direction-text">Next Section</span>
                  <v-icon
                    icon="mdi-chevron-right"
                    size="small"
                    class="direction-icon"
                    aria-hidden="true"
                  />
                </div>

                <!-- Page title -->
                <h3 class="navigation-title">
                  {{ navigationData.next.title }}
                </h3>
              </div>

              <!-- Bottom section with summary -->
              <div class="navigation-bottom">
                <!-- Page summary -->
                <p class="navigation-summary">
                  {{ navigationData.next.summary }}
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Progress indicator -->
      <div class="navigation-progress" role="status" :aria-label="progressAriaLabel">
        <div class="plan-title">
          Statewide Violence Prevention Plan for Illinois: 2025-2029
        </div>
        <div class="progress-text">
          Section {{ navigationData.currentIndex + 1 }} of {{ navigationData.totalPages }}
        </div>
        <v-progress-linear
          :model-value="progressPercentage"
          color="primary"
          height="4"
          rounded
          class="progress-bar"
          :aria-label="`Reading progress: ${progressPercentage}% complete`"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Report Navigation Component
 *
 * Provides stylish previous/next page navigation for report pages with:
 * - Card-based design with hover effects
 * - Page titles and descriptions
 * - Progress indicator
 * - Linear navigation (no circular logic)
 * - TOC-responsive layout
 * - Full accessibility support (WCAG 2.1 AA)
 * - Responsive design
 * - Theme-aware styling
 *
 * @component
 * @accessibility WCAG 2.1 AA compliant
 */
import { computed } from 'vue';
import { useRoute, navigateTo } from '#imports';
import useReportNavigation from '~/composables/useReportNavigation';
import { useConsoleLogger } from '~/composables/useConsoleLogger';

// Initialize console logger
const { log } = useConsoleLogger();

// Get current route
const route = useRoute();

// Get navigation composable
const { getNavigationData } = useReportNavigation();

// Props
const props = defineProps({
  /**
   * Override current path for navigation calculation
   * @type {string}
   */
  currentPath: {
    type: String,
    default: null
  },
  /**
   * Whether Table of Contents is present on the page
   * Used to determine responsive layout behavior
   * @type {boolean}
   */
  hasTOC: {
    type: Boolean,
    default: false
  }
});

// Get navigation data for current page
const currentPath = computed(() => props.currentPath || route.path);

// Get navigation data from composable
const navigationData = computed(() => getNavigationData(currentPath.value));

/**
 * Compute container class based on TOC presence
 * When TOC is present, use content column width to align with main content
 * When TOC is absent, use full container width
 * @returns {string} CSS class for container
 */
const containerClass = computed(() => {
  return props.hasTOC ? 'navigation-content-width' : 'container';
});

/**
 * Calculate progress percentage for progress bar
 * @returns {number} Progress percentage (0-100)
 */
const progressPercentage = computed(() => {
  if (!navigationData.value) return 0;
  return Math.round(((navigationData.value.currentIndex + 1) / navigationData.value.totalPages) * 100);
});

/**
 * Generate accessible progress aria label
 * @returns {string} Aria label for progress indicator
 */
const progressAriaLabel = computed(() => {
  if (!navigationData.value) return '';
  return `Reading progress: section ${navigationData.value.currentIndex + 1} of ${navigationData.value.totalPages}, ${progressPercentage.value}% complete`;
});

/**
 * Navigate to a specific page with logging
 * @param {string} path - Target page path
 */
function navigateToPage(path) {
  log('navigation', 'Report navigation used', {
    from: currentPath.value,
    to: path,
    timestamp: new Date().toISOString()
  });
  
  navigateTo(path);
}

// Log component initialization
if (navigationData.value) {
  log('navigation', 'Report navigation component initialized', {
    currentPath: currentPath.value,
    hasNavigation: !!navigationData.value,
    hasTOC: props.hasTOC,
    timestamp: new Date().toISOString()
  });
}
</script>

<style scoped>
/**
 * Report Navigation Styling
 *
 * Provides stylish, accessible navigation cards with:
 * - Subtle hover effects and transitions
 * - Proper contrast ratios (8:1 target)
 * - Responsive design
 * - Theme-aware colors
 * - Reduced motion support
 */

/* Main navigation container */
.report-navigation {
  margin-top: 4rem;
  margin-bottom: 2rem;
  padding: 2rem 0;
}

/* Container classes for TOC-responsive layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.navigation-content-width {
  /* When TOC is present, align with content column width */
  /* This matches the 8-column content area when TOC takes 4 columns */
  max-width: calc(66.666667% - 2rem); /* 8/12 columns minus padding */
  margin: 0;
  padding: 0;
}

/* Responsive adjustments for navigation content width */
@media (max-width: 959px) {
  .navigation-content-width {
    /* On mobile/tablet, TOC is hidden so use full width */
    max-width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
  }
}



/* Navigation row spacing */
.navigation-row {
  margin-bottom: 2rem;
  /* Ensure equal height cards using flexbox */
  display: flex;
  align-items: stretch;
}

/* Navigation column spacing */
.navigation-col {
  padding: 0.75rem;
  /* Ensure columns stretch to full height */
  display: flex;
  flex-direction: column;
}

/* Navigation card base styles */
.navigation-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background: rgb(var(--v-theme-surface));
  /* Ensure card takes full height of its container */
  display: flex;
  flex-direction: column;
}

/* Card hover effects */
.navigation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.navigation-card:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
  transform: translateY(-2px);
}

/* Mobile card adjustments */
.navigation-card--mobile {
  margin-bottom: 1rem;
}

.navigation-card--mobile:hover {
  transform: translateY(-2px);
}

/* Navigation content padding */
.navigation-content {
  padding: 1.5rem !important;
  /* Ensure content takes full height and allows proper vertical alignment */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0; /* Allow flex items to shrink */
}

/* Navigation content sections */
.navigation-top {
  /* Contains direction indicator and title */
  flex-shrink: 0;
  /* Ensure consistent height for top sections */
  min-height: 4rem; /* Adjust based on direction indicator + title height */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.navigation-bottom {
  /* Contains summary text */
  flex: 1;
  display: flex;
  align-items: flex-start; /* Align text to top of bottom section */
  margin-top: 1rem;
}

/* Direction indicator styling */
.navigation-direction {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  /* Ensure consistent height for direction indicators */
  height: 1.25rem;
  flex-shrink: 0;
}

.navigation-direction--next {
  justify-content: flex-end;
}

.direction-icon {
  color: rgb(var(--v-theme-primary));
}

.direction-text {
  margin: 0 0.25rem;
}

/* Navigation title styling */
.navigation-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 0;
  color: rgb(var(--v-theme-on-surface));
  /* Allow title to wrap on multiple lines */
  word-wrap: break-word;
  hyphens: auto;
  /* Ensure titles take remaining space in top section */
  flex: 1;
  display: flex;
  align-items: flex-start;
}

/* Navigation summary styling */
.navigation-summary {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 0;
  margin-top: 0;
  /* Allow summary to wrap naturally */
  word-wrap: break-word;
  hyphens: auto;
  /* Ensure summary text fills available space and aligns to top */
  flex: 1;
  align-self: flex-start;
}

/* Legacy navigation description styling (for backward compatibility) */
.navigation-description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 0;
  /* Allow description to wrap naturally */
  word-wrap: break-word;
  hyphens: auto;
  /* Ensure description text fills available space */
  flex: 1;
}

/* Progress indicator styling */
.navigation-progress {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* Plan title styling */
.plan-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 0.5rem;
  line-height: 1.4;
  /* Ensure proper contrast ratio (8:1 target) */
  opacity: 0.9;
}

.progress-text {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.progress-bar {
  max-width: 300px;
  margin: 0 auto;
}

/* Dark theme adjustments */
:deep(.v-theme--dark) {
  .navigation-card {
    background: rgb(var(--v-theme-surface));
    border-color: rgba(255, 255, 255, 0.08);
  }

  .navigation-card:hover {
    border-color: rgba(var(--v-theme-primary), 0.4);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
  }

  .plan-title {
    /* Ensure high contrast in dark mode */
    color: rgb(var(--v-theme-on-surface));
    opacity: 0.95;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .navigation-card {
    transition: none !important;
  }
  
  .navigation-card:hover {
    transform: none !important;
  }
  
  .navigation-card:focus-visible {
    transform: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .navigation-card {
    border-width: 2px;
  }

  .navigation-direction,
  .direction-icon {
    color: rgb(var(--v-theme-primary)) !important;
  }

  .navigation-title {
    font-weight: 700;
  }

  .plan-title {
    font-weight: 700;
    opacity: 1;
    color: rgb(var(--v-theme-on-surface)) !important;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .report-navigation {
    margin-top: 3rem;
    padding: 1.5rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .navigation-content {
    padding: 1.25rem !important;
  }
  
  .navigation-title {
    font-size: 1.125rem;
  }
  
  .navigation-description,
  .navigation-summary {
    font-size: 0.8125rem;
  }
}
</style>
