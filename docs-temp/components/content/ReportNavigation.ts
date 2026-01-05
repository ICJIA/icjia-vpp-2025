/**
 * @module ReportNavigation
 * @fileoverview Vue component: ReportNavigation
 */

/**
 * Report Navigation Component
 *
 * Provides clean previous/next page navigation for report pages with:
 * - Streamlined card-based design with hover effects
 * - Page titles with directional indicators (no circular arrows)
 * - Progress indicator
 * - Linear navigation (no circular logic)
 * - TOC-responsive layout
 * - Full accessibility support (WCAG 2.1 AA)
 * - Mobile-optimized design without overflow issues
 * - Theme-aware styling
 *
 * @component
 * @accessibility WCAG 2.1 AA compliant
 */
import { computed } from "vue";
import { useRoute, navigateTo } from "#imports";
import useReportNavigation from "~/composables/useReportNavigation";
import { useConsoleLogger } from "~/composables/useConsoleLogger";

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
    default: null,
  },
});

// Get navigation data for current page
const currentPath = computed(() => props.currentPath || route.path);

// Get navigation data from composable
const navigationData = computed(() => getNavigationData(currentPath.value));

/**
 * Calculate progress percentage for progress bar
 * @returns {number} Progress percentage (0-100)
 */
const progressPercentage = computed(() => {
  if (!navigationData.value) return 0;
  return Math.round(
    ((navigationData.value.currentIndex + 1) /
      navigationData.value.totalPages) *
      100
  );
});

/**
 * Generate accessible progress aria label
 * @returns {string} Aria label for progress indicator
 */
const progressAriaLabel = computed(() => {
  if (!navigationData.value) return "";
  return `Reading progress: section ${
    navigationData.value.currentIndex + 1
  } of ${navigationData.value.totalPages}, ${
    progressPercentage.value
  }% complete`;
});

/**
 * Navigate to a specific page with logging
 * @param {string} path - Target page path
 */
function navigateToPage(path) {
  // Log only on client-side to prevent hydration mismatch
  if (typeof window !== "undefined") {
    log("navigation", "Report navigation used", {
      from: currentPath.value,
      to: path,
      timestamp: new Date().toISOString(),
    });
  }

  navigateTo(path);
}

// Log component initialization (client-side only to prevent hydration mismatch)
if (navigationData.value && typeof window !== "undefined") {
  log("navigation", "Report navigation component initialized", {
    currentPath: currentPath.value,
    hasNavigation: !!navigationData.value,
    timestamp: new Date().toISOString(),
  });
}
