/**
 * Report Navigation Composable
 *
 * Provides next/previous navigation functionality for report pages based on the
 * site configuration order. Extracts page order from the "Read the Plan"
 * menu section in site config and provides linear navigation between report pages.
 *
 * Features:
 * - Linear navigation (first page has no previous, last page has no next)
 * - Page title and description extraction from content
 * - Caching for performance
 * - Error handling and validation
 * - WCAG 2.1 AA accessibility support
 *
 * @example Basic usage
 * ```vue
 * <script setup>
 * const { getNavigationData, isReportPage } = useReportNavigation();
 * const route = useRoute();
 *
 * const navData = await getNavigationData(route.path);
 * if (navData) {
 *   console.log('Previous:', navData.previous); // null on first page
 *   console.log('Next:', navData.next); // null on last page
 * }
 * </script>
 * ```
 *
 * @composable
 * @accessibility WCAG 2.1 AA compliant
 */
import { ref, computed } from "vue";
import { useConsoleLogger } from "~/composables/useConsoleLogger";
import siteConfig from "../config/site.config.json";

// Initialize console logger
const { log, logError } = useConsoleLogger();

/**
 * Cached report pages data to avoid repeated processing
 * @type {Object}
 */
const cachedReportPages = ref(null);

/**
 * Extract report pages from menu configuration
 *
 * Finds the "Read the Plan" dropdown menu section and extracts
 * all child pages in their defined order. This provides the canonical
 * page order for navigation purposes. Results are cached for performance.
 *
 * @returns {Array<Object>} Array of report page objects
 * @returns {Array<Object>} returns[].path - Page path (e.g., '/plan/executive-summary')
 * @returns {Array<Object>} returns[].title - Page title from menu config
 * @returns {Array<Object>} returns[].summary - Page summary for navigation context
 * @returns {Array<Object>} returns[].ariaLabel - Accessibility label from menu config
 * @returns {Array<Object>} returns[].tooltip - Tooltip text for navigation elements
 *
 * @throws {Error} Logs error if menu configuration is invalid or missing
 *
 * @example
 * const pages = extractReportPages();
 * console.log(pages[0]); // { path: '/plan/executive-summary', title: 'Executive Summary', ... }
 */
function extractReportPages() {
  if (cachedReportPages.value) {
    return cachedReportPages.value;
  }

  try {
    // Get "Read the Plan" menu configuration from site config
    const readThePlanMenuConfig = siteConfig.ui?.navigation?.readThePlanMenu;

    if (!readThePlanMenuConfig || !readThePlanMenuConfig.enabled) {
      // Log only on client-side to prevent hydration mismatch
      if (typeof window !== "undefined") {
        logError(
          'Report navigation: Could not find enabled "Read the Plan" menu section'
        );
      }
      return [];
    }

    if (!readThePlanMenuConfig.items) {
      // Log only on client-side to prevent hydration mismatch
      if (typeof window !== "undefined") {
        logError(
          'Report navigation: No items found in "Read the Plan" menu section'
        );
      }
      return [];
    }

    // Extract enabled pages in order
    const reportPages = [];
    Object.entries(readThePlanMenuConfig.items).forEach(([key, item]) => {
      if (item.enabled && item.to) {
        reportPages.push({
          path: item.to,
          title: item.text,
          summary: item.summary || "Navigate to this section of the report",
          ariaLabel: item.ariaLabel || item.text,
          tooltip: item.tooltip || item.text,
        });
      }
    });

    cachedReportPages.value = reportPages;

    // Log only on client-side to prevent hydration mismatch
    if (typeof window !== "undefined") {
      log("navigation", "Report pages extracted from site config", {
        totalPages: reportPages.length,
        pages: reportPages.map((p) => ({ path: p.path, title: p.title })),
        date: new Date().toISOString().split("T")[0], // Use date only to prevent hydration mismatch
      });
    }

    return reportPages;
  } catch (error) {
    // Log only on client-side to prevent hydration mismatch
    if (typeof window !== "undefined") {
      logError("Error extracting report pages from site config", {
        error: error.message,
        date: new Date().toISOString().split("T")[0], // Use date only to prevent hydration mismatch
      });
    }
    return [];
  }
}

/**
 * Check if a given path is a report page
 *
 * @param {string} path - Page path to check
 * @returns {boolean} True if path is a report page
 */
function isReportPage(path) {
  const reportPages = extractReportPages();
  return reportPages.some((page) => page.path === path);
}

/**
 * Find the index of a page in the report pages array
 *
 * @param {string} currentPath - Current page path
 * @param {Array<Object>} reportPages - Array of report pages
 * @returns {number} Index of current page, or -1 if not found
 */
function findCurrentPageIndex(currentPath, reportPages) {
  return reportPages.findIndex((page) => page.path === currentPath);
}

/**
 * Get navigation data for a specific page
 *
 * Provides previous and next page information for linear navigation.
 * Returns null if the current page is not a report page.
 *
 * @param {string} currentPath - Current page path
 * @returns {Object|null} Navigation data or null
 * @property {Object|null} previous - Previous page data with summary
 * @property {Object|null} next - Next page data with summary
 * @property {number} currentIndex - Current page index
 * @property {number} totalPages - Total number of report pages
 */
function getNavigationData(currentPath) {
  const reportPages = extractReportPages();

  if (reportPages.length === 0) {
    // Log only on client-side to prevent hydration mismatch
    if (typeof window !== "undefined") {
      log("navigation", "No report pages found in menu config");
    }
    return null;
  }

  const currentIndex = findCurrentPageIndex(currentPath, reportPages);

  if (currentIndex === -1) {
    log("navigation", "Current page is not a report page", { currentPath });
    return null;
  }

  // Calculate previous and next indices with linear navigation
  const totalPages = reportPages.length;

  // Linear navigation: no previous on first page, no next on last page
  const previousPage = currentIndex > 0 ? reportPages[currentIndex - 1] : null;
  const nextPage =
    currentIndex < totalPages - 1 ? reportPages[currentIndex + 1] : null;

  const navigationData = {
    previous: previousPage
      ? {
          ...previousPage,
          description: previousPage.summary, // Keep for backward compatibility
        }
      : null,
    next: nextPage
      ? {
          ...nextPage,
          description: nextPage.summary, // Keep for backward compatibility
        }
      : null,
    currentIndex,
    totalPages,
    isFirstPage: currentIndex === 0,
    isLastPage: currentIndex === totalPages - 1,
  };

  // Log navigation data (client-side only to prevent hydration mismatch)
  if (typeof window !== "undefined") {
    log("navigation", "Navigation data generated with summaries", {
      currentPath,
      currentIndex,
      totalPages,
      previousPage: previousPage?.title || "none (first page)",
      nextPage: nextPage?.title || "none (last page)",
      previousSummary:
        previousPage?.summary?.substring(0, 50) + "..." || "none",
      nextSummary: nextPage?.summary?.substring(0, 50) + "..." || "none",
      isFirstPage: navigationData.isFirstPage,
      isLastPage: navigationData.isLastPage,
      timestamp: new Date().toISOString(),
    });
  }

  return navigationData;
}

/**
 * Main composable export
 *
 * @returns {Object} Navigation composable interface
 */
export default function useReportNavigation() {
  return {
    getNavigationData,
    isReportPage,
    extractReportPages,

    // Computed properties for reactive access
    reportPages: computed(() => extractReportPages()),
    totalReportPages: computed(() => extractReportPages().length),
  };
}
