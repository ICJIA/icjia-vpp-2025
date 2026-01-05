/**
 * @module [...slug]
 * @fileoverview Vue component: [...slug]
 */

/**
 * Dynamic Catch-All Route Component with Table of Contents
 *
 * This component handles all routes that don't have corresponding Vue pages by
 * automatically checking for and rendering markdown content from the /content/ directory.
 *
 * Features:
 * - Automatic content resolution from /content/ directory
 * - Conditional Table of Contents based on frontmatter showTOC property
 * - Fixed positioning TOC with scroll detection and active section highlighting
 * - Proper 404 handling when neither Vue nor markdown exists
 * - Full MDC (Markdown Components) support
 * - SEO optimization with dynamic metadata
 * - WCAG 2.1 AA accessibility compliance
 * - Theme support (light/dark)
 * - Integration with existing search and site configuration systems
 * - Loading states and error handling
 * - Keyboard navigation support
 * - Responsive grid layout (8/4 split when TOC enabled)
 *
 * Route Examples:
 * - /some-page → looks for /content/some-page.md
 * - /nested/page → looks for /content/nested/page.md
 * - /projects/new-initiative → looks for /content/projects/new-initiative.md
 *
 * @page
 * @accessibility WCAG 2.1 AA compliant
 * @seo Dynamic metadata from frontmatter
 */
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useHead, useSeoMeta, navigateTo } from "#imports";
import { useConsoleLogger } from "~/composables/useConsoleLogger";
import useContentFetcher from "~/composables/useContentFetcher";
import useReportNavigation from "~/composables/useReportNavigation";
import PageTitleSection from "~/components/content/PageTitleSection.vue";
import ReportNavigation from "~/components/content/ReportNavigation.vue";
import StructuredData from "~/components/seo/StructuredData.vue";

// Initialize console logger
const { log, logError } = useConsoleLogger();

// Get current route
const route = useRoute();

// Canonical route path for parity (collapse duplicate slashes, drop trailing slash except root)
const canonicalPath = computed(() => {
  let p = route.path || "/";
  p = p.replace(/\/+/g, "/");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p;
});

// Plan page detection (used for dark-mode background hardening)
const isPlanPage = computed(() => route.path.startsWith("/plan/"));

// Initialize report navigation composable
const { isReportPage } = useReportNavigation();

// Build canonical content path from route.path (normalize trailing slashes for SSR/CSR parity)
const contentPath = computed(() => {
  let p = route.path || "/";
  // Collapse duplicate slashes
  p = p.replace(/\/+/g, "/");
  // Remove trailing slash except for root
  if (p.length > 1) p = p.replace(/\/+$/, "");

  // Log only on client-side to prevent hydration mismatch
  if (typeof window !== "undefined") {
    log("content", "Dynamic route - resolving content path", {
      routePath: route.path,
      contentPath: p,
      date: new Date().toISOString().split("T")[0], // Use date only to prevent hydration mismatch
    });
  }

  return p;
});

// Use the project's content fetcher composable
const { content, pending, error, refresh, markAsRendered } = useContentFetcher({
  path: contentPath.value,
});

/**
 * =============================================================================
 * TOC REACTIVE STATE VARIABLES
 * =============================================================================
 */

// Current scroll position of the window (used for display and calculations)
const scrollY = ref(0);

// Whether the TOC sidebar is currently in fixed position mode
const isFixed = ref(false);

// Position of the title row's bottom edge relative to viewport
const titleBottom = ref(0);

// Reactive state for active TOC item
const activeItemId = ref("");

/**
 * =============================================================================
 * TEMPLATE REFS (DOM ELEMENT REFERENCES)
 * =============================================================================
 */

// Reference to the TOC content element (the actual fixed element)
const stickyElement = ref(null);

// Reference to the title row element (monitored for visibility)
const titleRow = ref(null);

// Reference to the sidebar column element (used for width calculations)
const sidebarCol = ref(null);

/**
 * =============================================================================
 * CONFIGURATION CONSTANTS
 * =============================================================================
 */

// Height of the fixed navbar at the top of the page
// The TOC becomes fixed when the title disappears behind this navbar
const NAVBAR_HEIGHT = 80; // pixels

/**
 * =============================================================================
 * FIXED POSITIONING STATE
 * =============================================================================
 */

// Calculated width for the fixed element (matches natural width)
const fixedWidth = ref(0);

// Calculated left position for the fixed element (matches natural position)
const fixedLeft = ref(0);

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================

/**
 * Determines if the current error is a "not found" (404) error
 *
 * Checks various error properties to identify 404 errors specifically,
 * which are handled differently from other errors (custom 404 page vs generic error).
 *
 * @returns {boolean} True if error is a 404/not found error
 */
const isNotFoundError = computed(() => {
  return (
    error.value &&
    (error.value.code === "NOT_FOUND" ||
      error.value.message?.includes("not found") ||
      error.value.statusCode === 404)
  );
});

/**
 * Determines if content needs a standardized PageTitleSection header
 *
 * Plain markdown content gets a standardized header, while content with
 * layout components (like ::hero-section, ::about-hero) handles its own header.
 *
 * Detection logic:
 * - Checks for MDC layout component syntax (::component-name)
 * - Checks for specific known layout components
 * - Returns true for plain markdown, false for component-rich content
 *
 * @returns {boolean} True if content should get PageTitleSection header
 */
const needsStandardHeader = computed(() => {
  // Default to no standard header until content is available
  if (!content.value) return false;

  // Normalize body to a stable, JSON-safe string for SSR/CSR parity
  const bodyRaw = content.value.body ?? content.value._body ?? "";
  let bodyStr = "";
  try {
    // Many Nuxt Content structures are objects; JSON stringify makes detection stable
    bodyStr = typeof bodyRaw === "string" ? bodyRaw : JSON.stringify(bodyRaw);
  } catch (e) {
    // Fallback to toString without causing reactive differences
    bodyStr = "" + bodyRaw;
  }

  // Detect embedded layout components in a stable way
  const hasLayoutComponents =
    bodyStr.includes("::") ||
    bodyStr.includes("about-hero") ||
    bodyStr.includes("hero-section") ||
    bodyStr.includes("feature-section");

  // Provide standardized header only when plain markdown (no layout components)
  return !hasLayoutComponents;
});

/**
 * Determines if Table of Contents should be displayed
 *
 * Checks frontmatter for showTOC property in multiple possible locations:
 * - content.showTOC (direct property)
 * - content.meta.showTOC (nested in meta object)
 *
 * Only displays TOC when explicitly set to true in frontmatter.
 *
 * @returns {boolean} True if TOC should be displayed
 */
const showTOC = computed(() => {
  return !!(content.value?.showTOC || content.value?.meta?.showTOC);
});

/**
 * Determines the Table of Contents label to display
 *
 * Priority order:
 * 1. Page-specific tocLabel from frontmatter (highest priority)
 * 2. Site-wide default from site.config.json (ui.tableOfContents.defaultLabel)
 * 3. Hardcoded fallback "Table of Contents" (lowest priority)
 *
 * Frontmatter Usage:
 * ```yaml
 * ---
 * title: "Page Title"
 * showTOC: true
 * tocLabel: "Jump To"
 * ---
 * ```
 *
 * Site Configuration:
 * ```json
 * {
 *   "ui": {
 *     "tableOfContents": {
 *       "defaultLabel": "Jump To..."
 *     }
 *   }
 * }
 * ```
 *
 * @returns {string} The label to display for the TOC heading
 */
const tocLabel = computed(() => {
  // 1. Check for page-specific tocLabel in frontmatter (highest priority)
  if (content.value?.tocLabel) {
    return content.value.tocLabel;
  }

  // 2. Use site-wide default from configuration (medium priority)
  // Note: This will be loaded asynchronously, so we provide a fallback
  return "Jump To..."; // Default fallback while config loads or if config unavailable
});

/**
 * ID attribute for the TOC heading to reference via aria-labelledby.
 * Ensures stable reference across renders.
 */
const tocTitleId = "toc-heading";

/**
 * Computed styles for fixed positioning of the TOC
 *
 * Returns CSS styles object that positions the TOC element as fixed
 * when it should be "stuck" to the viewport during scrolling.
 *
 * Fixed positioning is activated when:
 * - isFixed.value is true (PageTitleSection scrolled out of view)
 * - Returns empty object when in normal flow
 *
 * @returns {Object} CSS styles object for fixed positioning
 * @property {string} position - "fixed" when active
 * @property {string} top - Distance from top of viewport (below navbar)
 * @property {string} left - Horizontal position (maintains natural position)
 * @property {string} width - Width in pixels (maintains natural width)
 * @property {number} zIndex - Stacking order (above other content)
 */
const fixedStyles = computed(() => {
  if (isFixed.value) {
    return {
      position: "fixed",
      top: `${NAVBAR_HEIGHT}px`, // Position below the fixed navbar
      left: `${fixedLeft.value}px`, // Maintain horizontal position
      width: `${fixedWidth.value}px`, // Maintain exact width
      zIndex: 1000, // Ensure it appears above other content
    };
  }
  // Return empty object when not fixed (uses natural positioning)
  return {};
});

/**
 * Extracts and processes H2-level headings for Table of Contents
 *
 * Automatically parses the content's TOC data (generated by Nuxt Content)
 * and filters for H2 headings only, which provide the main section structure.
 *
 * TOC Data Sources (in order of preference):
 * 1. content.body.toc - Standard Nuxt Content v3 location
 * 2. content.toc - Alternative location
 * 3. content._toc - Legacy location
 *
 * Processing Logic:
 * - Handles both array and object TOC data structures
 * - Filters for depth === 2 (H2 headings only)
 * - Extracts text and id for navigation
 * - Validates that both text and id exist
 *
 * @returns {Array<Object>} Array of TOC items for H2 headings
 * @property {string} text - Heading text for display
 * @property {string} id - Heading ID for scroll targeting
 */
const tocH2Items = computed(() => {
  // Try different possible TOC data paths
  const tocData =
    content.value?.body?.toc || content.value?.toc || content.value?._toc;

  if (!tocData) {
    return [];
  }

  // Handle different TOC data structures
  let linksArray = [];

  if (Array.isArray(tocData)) {
    // If tocData is directly an array
    linksArray = tocData;
  } else if (tocData.links && Array.isArray(tocData.links)) {
    // If tocData has a links property (most common structure)
    linksArray = tocData.links;
  } else {
    return [];
  }

  // Filter for H2 headings (depth === 2) and extract text and id
  return linksArray
    .filter((item) => item.depth === 2)
    .map((item) => ({
      text: item.text || item.title || "Untitled Section",
      id: item.id || item.anchor || item.slug || "",
    }))
    .filter((item) => item.text && item.id); // Only include items with both text and valid IDs
});

/**
 * Computes responsive column widths for main content based on TOC visibility
 *
 * Dynamically adjusts the content column width based on whether TOC is enabled.
 * Uses Vuetify 3 grid system with 12-column layout.
 *
 * Layout Logic:
 * - Mobile (xs, sm): Always 12 columns (full width) - TOC is hidden
 * - Desktop (md+) with TOC: 8 columns (leaves 4 for TOC sidebar)
 * - Desktop (md+) without TOC: 12 columns (full width)
 *
 * @returns {Object} Vuetify column width configuration
 * @property {number} cols - Mobile column width (always 12)
 * @property {number} sm - Small screen column width (always 12)
 * @property {number} md - Medium screen column width (8 or 12)
 * @property {number} lg - Large screen column width (8 or 12)
 * @property {number} xl - Extra large screen column width (8 or 12)
 */
const contentColumnWidth = computed(() => {
  const hasTOC = showTOC.value;
  return {
    cols: 12, // Always full width on mobile (TOC hidden via d-none d-md-block)
    sm: 12, // Always full width on small screens (TOC hidden)
    md: hasTOC ? 8 : 12, // 8 cols when TOC enabled, 12 when disabled on tablet
    lg: hasTOC ? 8 : 12, // 8 cols when TOC enabled, 12 when disabled on desktop
    xl: hasTOC ? 8 : 12, // 8 cols when TOC enabled, 12 when disabled on large desktop
  };
});

/**
 * Computes responsive column widths for TOC sidebar
 *
 * Defines the TOC sidebar column widths across all breakpoints.
 * The TOC is hidden on mobile via CSS classes (d-none d-md-block).
 *
 * Layout Logic:
 * - Mobile (xs, sm): Hidden via CSS, but would be 12 columns if shown
 * - Desktop (md+): 4 columns (complements 8-column content area)
 *
 * @returns {Object} Vuetify column width configuration
 * @property {number} cols - Mobile column width (12, but hidden via CSS)
 * @property {number} sm - Small screen column width (12, but hidden via CSS)
 * @property {number} md - Medium screen column width (4)
 * @property {number} lg - Large screen column width (4)
 * @property {number} xl - Extra large screen column width (4)
 */
const tocColumnWidth = computed(() => {
  return {
    cols: 12, // Full width on mobile (but hidden via d-none d-md-block)
    sm: 12, // Full width on small screens (but hidden)
    md: 4, // 4 cols on tablet
    lg: 4, // 4 cols on desktop
    xl: 4, // 4 cols on large desktop
  };
});

/**
 * Generates page title from content frontmatter or URL slug
 *
 * Priority order:
 * 1. content.title from frontmatter (preferred)
 * 2. Generated from URL slug (kebab-case to Title Case) + project title
 * 3. Fallback to project title only
 *
 * Slug Processing:
 * - Takes the last segment of the URL path
 * - Converts kebab-case to Title Case (e.g., "youth-intervention" → "Youth Intervention")
 * - Appends project title for SEO consistency
 *
 * @returns {string} Page title for display and SEO
 */
const pageTitle = computed(() => {
  if (content.value?.title) {
    return content.value.title;
  }

  // Generate title from slug
  const slugArray = route.params.slug || [];
  const lastSlug = Array.isArray(slugArray)
    ? slugArray[slugArray.length - 1]
    : slugArray;

  if (lastSlug) {
    // Convert kebab-case to Title Case
    const titleFromSlug = lastSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return `${titleFromSlug} - Statewide Violence Prevention Plan for Illinois: 2025-2029`;
  }

  return "Statewide Violence Prevention Plan for Illinois: 2025-2029";
});

/**
 * Generates page description from content frontmatter or default
 *
 * Priority order:
 * 1. content.description from frontmatter (preferred)
 * 2. Default project description with tagline
 *
 * Used for:
 * - Meta description tag for SEO
 * - Open Graph description
 * - Twitter Card description
 *
 * @returns {string} Page description for SEO and social sharing
 */
const pageDescription = computed(() => {
  if (content.value?.description) {
    return content.value.description;
  }

  return "Statewide Violence Prevention Plan for Illinois: 2025-2029 - Building safer communities through evidence-based violence prevention strategies.";
});

/**
 * Determines if report navigation should be displayed
 *
 * Shows navigation only for pages that are part of the report section
 * (defined in "The 2025-2029 Plan" menu dropdown). This ensures navigation
 * appears only where it's relevant and maintains clean UI on other pages.
 *
 * @returns {boolean} True if current page is a report page
 */
const showReportNavigation = computed(() => {
  return isReportPage(route.path);
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Truncates text to a specified length while preserving word boundaries
 *
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation (default: 70)
 * @returns {string} Truncated text with ellipsis if needed
 */
const truncateText = (text, maxLength = 70) => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  // Find the last space within the max length to avoid breaking words
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  // If we found a space and it's not too close to the beginning, break there
  if (lastSpaceIndex > maxLength * 0.6) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }

  // Otherwise, just truncate at max length
  return truncated + "...";
};

// =============================================================================
// CORE FUNCTIONALITY METHODS
// =============================================================================

// Performance optimization: throttle scroll updates using requestAnimationFrame
let scrollUpdatePending = false;

/**
 * Main scroll event handler for TOC positioning and active section detection
 *
 * This is the primary scroll event handler that coordinates all scroll-based
 * functionality for the Table of Contents system. Called on every scroll event
 * to maintain accurate positioning and highlighting.
 *
 * Responsibilities:
 * - Updates current scroll position tracking
 * - Determines when to activate/deactivate fixed positioning
 * - Calculates exact positioning values for fixed mode
 * - Updates active section highlighting based on viewport
 *
 * Error Handling:
 * - Gracefully handles DOM-related errors during development
 * - Continues operation even if individual functions fail
 * - Logs warnings for debugging purposes
 *
 * Performance Optimizations:
 * - Uses requestAnimationFrame to throttle expensive DOM measurements
 * - Prevents multiple getBoundingClientRect calls per frame
 * - Reduces forced reflow by batching DOM reads
 * - Called on every scroll event but DOM measurements are throttled
 *
 * @function updateScroll
 * @returns {void}
 */
// Initialize as no-op function for SSR safety
let updateScroll = () => {
  // No-op function for SSR - will be replaced on client-side
};

// Only define the actual function on client-side to prevent hydration mismatches
if (process.client) {
  updateScroll = () => {
    // Update current scroll position immediately (lightweight operation)
    scrollY.value = window.scrollY;

    // Throttle expensive DOM measurements using requestAnimationFrame
    if (!scrollUpdatePending) {
      scrollUpdatePending = true;

      requestAnimationFrame(() => {
        try {
          // Batch all DOM measurements in a single frame
          // Check if title is still visible and update fixed state
          updateTitleVisibility();

          // Calculate positioning for fixed state
          updateFixedPosition();

          // Update active section for TOC highlighting
          updateActiveSection();
        } catch (error) {
          // Gracefully handle any DOM-related errors during development
          console.warn("Error updating scroll position:", error);
        } finally {
          // Reset throttle flag
          scrollUpdatePending = false;
        }
      });
    }
  };
}

// Initialize as no-op functions for SSR safety
let updateTitleVisibility = () => {};
let updateFixedPosition = () => {};
let updateActiveSection = () => {};
let scrollToHeading = () => {};
let scrollToTop = () => {};

// Function definitions moved to onMounted to prevent hydration mismatches

/**
 * Navigation helper function to return to homepage
 *
 * Used in error states (404 page, general errors) to provide users
 * with a way to navigate back to the main site when content fails to load.
 *
 * Uses Nuxt's navigateTo function for proper SPA navigation.
 *
 * @function navigateToHome
 * @returns {void}
 */
const navigateToHome = () => {
  navigateTo("/");
};

// =============================================================================
// CONTENT LOADING MONITORING
// =============================================================================

/**
 * Monitor successful content loading for debugging and analytics
 *
 * Logs content loading events when content is successfully fetched and parsed.
 * Useful for debugging content resolution and monitoring page performance.
 */
if (content.value && typeof window !== "undefined") {
  log("content", "Dynamic route content loaded", {
    title: content.value.title,
    path: contentPath.value,
    date: new Date().toISOString().split("T")[0], // Use date only to prevent hydration mismatch
  });
}

/**
 * Monitor content loading errors for debugging and error tracking
 *
 * Logs detailed error information when content fails to load.
 * Helps with debugging content resolution issues and monitoring site health.
 */
if (error.value && typeof window !== "undefined") {
  logError("Dynamic route content error", {
    path: contentPath.value,
    error: error.value.message,
    code: error.value.code,
    date: new Date().toISOString().split("T")[0], // Use date only to prevent hydration mismatch
  });
}

// =============================================================================
// LIFECYCLE MANAGEMENT
// =============================================================================

/**
 * Component initialization and event listener setup
 *
 * Sets up all necessary event listeners and performs initial calculations
 * for the Table of Contents positioning system.
 *
 * Event Listeners:
 * - scroll: Updates TOC positioning and active section highlighting
 * - resize: Recalculates positioning when window size changes
 *
 * Initialization Timing:
 * - Uses setTimeout to ensure Vuetify components are fully rendered
 * - 100ms delay allows for proper DOM measurement
 *
 * @lifecycle onMounted
 */
onMounted(() => {
  // Define the actual functions here to prevent hydration mismatches
  updateTitleVisibility = () => {
    // Handle Vue component instance (PageTitleSection) - get the root element
    const titleElement = titleRow.value?.$el || titleRow.value;

    if (
      titleElement &&
      typeof titleElement.getBoundingClientRect === "function"
    ) {
      const rect = titleElement.getBoundingClientRect();

      // Store title bottom position for debugging and display purposes
      titleBottom.value = rect.bottom;

      // Activate fixed positioning when title bottom edge reaches/passes navbar
      // rect.bottom <= NAVBAR_HEIGHT means the title is completely hidden behind navbar
      isFixed.value = rect.bottom <= NAVBAR_HEIGHT;
    }
  };

  updateFixedPosition = () => {
    // Get reference to the TOC content element
    const contentElement = stickyElement.value?.$el || stickyElement.value;

    if (
      contentElement &&
      typeof contentElement.getBoundingClientRect === "function"
    ) {
      // CRITICAL: Only measure position when element is in natural (not fixed) state
      // This prevents measurement of already-fixed positioning which would be incorrect
      if (!isFixed.value) {
        const rect = contentElement.getBoundingClientRect();

        // Store the exact natural dimensions and position
        // These values will be used when the element becomes fixed
        fixedWidth.value = rect.width; // Maintain exact width
        fixedLeft.value = rect.left; // Maintain exact horizontal position
      }
    }
  };

  updateActiveSection = () => {
    // Early return if no TOC items to process
    if (!tocH2Items.value.length) return;

    // Check if we're at the top of the page - clear active state
    if (window.scrollY < 100) {
      if (activeItemId.value !== "") {
        activeItemId.value = "";
      }
      return;
    }

    const headerOffset = 120; // Slightly larger offset for better detection accuracy
    let currentActiveId = "";

    // Find the section that's currently most visible in the viewport
    for (const item of tocH2Items.value) {
      const element = document.getElementById(item.id);
      if (!element) continue; // Skip if heading element not found

      const rect = element.getBoundingClientRect();

      // Check if element is in the "active zone" (considering header offset)
      if (rect.top <= headerOffset && rect.bottom > headerOffset) {
        currentActiveId = item.id;
        break; // Found the active section, stop searching
      }

      // If we're past all sections (heading is below viewport), use the last one
      if (rect.top > headerOffset) {
        break;
      }

      // If element is above viewport but still visible, it could be the active one
      if (rect.bottom > 0) {
        currentActiveId = item.id;
      }
    }

    // Only update state if the active section has actually changed and we found a valid section
    if (currentActiveId && currentActiveId !== activeItemId.value) {
      activeItemId.value = currentActiveId;
    }
  };

  scrollToHeading = (headingId) => {
    // Validate input parameter
    if (!headingId) return;

    // Find the target heading element in the DOM
    const targetElement = document.getElementById(headingId);
    if (!targetElement) {
      console.warn(`TOC: Could not find element with ID: ${headingId}`);
      return;
    }

    // Update active state immediately for better UX responsiveness
    activeItemId.value = headingId;

    // Calculate scroll position with header offset compensation
    const headerOffset = 80; // Keep consistent with navbar height for content visibility
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    // Perform smooth scroll animation to target position
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Set focus to target element for accessibility (screen readers)
    targetElement.focus({ preventScroll: true });
  };

  updateScroll = () => {
    updateTitleVisibility();
    updateFixedPosition();
    updateActiveSection();
  };

  scrollToTop = () => {
    // Clear active item when scrolling to top (no section is active)
    activeItemId.value = "";

    // Perform smooth scroll animation to page top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Listen for scroll events to update TOC positioning and active sections
  window.addEventListener("scroll", updateScroll);

  // Listen for resize events to recalculate TOC positioning
  window.addEventListener("resize", updateScroll);

  // Perform initial calculation after DOM is ready
  // setTimeout ensures all Vuetify components are fully rendered
  setTimeout(() => {
    updateScroll();
  }, 100);
});

// TEMPORARY client-side sanitizer for audit log page list/link semantics
// Scope strictly to /accessibility/audit-log to resolve axe "list", "listitem", and "link-name"
// This adjusts malformed UL children and adds labels for empty anchors at runtime.
onMounted(() => {
  if (route.path === "/accessibility/audit-log") {
    try {
      const root = document.querySelector(".content-renderer");
      if (!root) return;

      // Ensure <ul> contains only <li> direct children
      root.querySelectorAll("ul").forEach((ul) => {
        const children = Array.from(ul.children);
        children.forEach((el) => {
          if (el.tagName === "A") {
            const li = document.createElement("li");
            ul.replaceChild(li, el);
            li.appendChild(el);
          }
        });
      });

      // Ensure each focusable <a> has discernible text or an ARIA label
      root.querySelectorAll("a[href]").forEach((a) => {
        const text = (a.textContent || "").trim();
        const hasAccessibleName =
          !!text ||
          a.hasAttribute("aria-label") ||
          a.hasAttribute("aria-labelledby") ||
          !!a.title;
        if (!hasAccessibleName) {
          const href = a.getAttribute("href") || "";
          let label = "Link";
          if (href.startsWith("#")) label = `Jump to section ${href.slice(1)}`;
          a.setAttribute("aria-label", label);
          // Add sr-only fallback text to ensure name in all AT
          const sr = document.createElement("span");
          sr.className = "sr-only";
          sr.textContent = label;
          a.appendChild(sr);
        }
      });
    } catch (e) {
      console.warn("Audit-log semantic sanitizer failed", e);
    }
  }
});

// Store MutationObserver reference for cleanup
let scrollableRegionObserver = null;

// Make all scrollable regions focusable for keyboard access
// This ensures WCAG 2.1 A compliance (2.1.1 Keyboard, 2.1.3 Keyboard - No Exception)
const enhanceScrollableRegions = () => {
  try {
    // Check both content-renderer and the entire document for scrollable regions
    const roots = [
      document.querySelector(".content-renderer"),
      document.body,
    ].filter(Boolean);

    roots.forEach((root) => {
      if (!root) return;

      // Handle ALL pre elements - make them focusable regardless of scrollability
      // This ensures keyboard access for code blocks on all pages
      const preElems = root.querySelectorAll("pre");
      preElems.forEach((pre) => {
        // Always make pre elements focusable for keyboard access
        if (!pre.hasAttribute("tabindex")) {
          pre.setAttribute("tabindex", "0");
          pre.setAttribute("role", "region");
          pre.setAttribute("aria-label", "Code example");
          pre.classList.add("focus-outline-visible");
        }

        // Also make any code children focusable
        const codeChild = pre.querySelector("code");
        if (codeChild && !codeChild.hasAttribute("tabindex")) {
          codeChild.setAttribute("tabindex", "0");
          codeChild.setAttribute("role", "region");
          codeChild.setAttribute("aria-label", "Code example");
        }
      });

      // Handle standalone code elements (code blocks not inside pre)
      const codeElems = root.querySelectorAll("code:not(pre code)");
      codeElems.forEach((code) => {
        // Only make standalone code elements focusable if they're likely to be scrollable
        // Check if the code element or its parent might be scrollable
        const parent = code.parentElement;
        const isLikelyScrollable =
          parent &&
          (parent.scrollWidth > parent.clientWidth ||
            parent.scrollHeight > parent.clientHeight ||
            getComputedStyle(parent).overflow === "auto" ||
            getComputedStyle(parent).overflow === "scroll" ||
            getComputedStyle(parent).overflowX === "auto" ||
            getComputedStyle(parent).overflowX === "scroll" ||
            getComputedStyle(parent).overflowY === "auto" ||
            getComputedStyle(parent).overflowY === "scroll");

        if (isLikelyScrollable && !code.hasAttribute("tabindex")) {
          code.setAttribute("tabindex", "0");
          code.setAttribute("role", "region");
          code.setAttribute("aria-label", "Code example");
          code.classList.add("focus-outline-visible");
        }
      });

      // Handle ALL scrollable divs and other elements with overflow
      // This catches any scrollable region that might not be a code block
      const allElements = root.querySelectorAll("*");
      allElements.forEach((el) => {
        const style = getComputedStyle(el);
        const hasOverflow =
          style.overflow === "auto" ||
          style.overflow === "scroll" ||
          style.overflowY === "auto" ||
          style.overflowY === "scroll" ||
          style.overflowX === "auto" ||
          style.overflowX === "scroll";

        // Check if element is actually scrollable
        const isScrollable =
          hasOverflow &&
          (el.scrollHeight > el.clientHeight ||
            el.scrollWidth > el.clientWidth);

        // Skip if already has tabindex or is a form element
        if (
          isScrollable &&
          !el.hasAttribute("tabindex") &&
          el.tagName !== "INPUT" &&
          el.tagName !== "TEXTAREA" &&
          el.tagName !== "SELECT" &&
          el.tagName !== "BUTTON" &&
          el.tagName !== "A"
        ) {
          el.setAttribute("tabindex", "0");
          el.setAttribute("role", "region");
          el.setAttribute(
            "aria-label",
            el.getAttribute("aria-label") || "Scrollable region"
          );
          el.classList.add("focus-outline-visible");
        }
      });
    });
  } catch (e) {
    console.warn("Scrollable region enhancer failed", e);
  }
};

onMounted(() => {
  // Run immediately
  enhanceScrollableRegions();

  // Run after next tick
  nextTick(() => {
    enhanceScrollableRegions();
  });

  // Run after delays to catch any late-rendering content
  // Multiple timeouts ensure we catch content that renders at different times
  setTimeout(() => {
    enhanceScrollableRegions();
  }, 100);

  setTimeout(() => {
    enhanceScrollableRegions();
  }, 300);

  setTimeout(() => {
    enhanceScrollableRegions();
  }, 500);

  setTimeout(() => {
    enhanceScrollableRegions();
  }, 1000);

  // Use MutationObserver to catch dynamically added content
  const contentRenderer = document.querySelector(".content-renderer");
  if (contentRenderer && !scrollableRegionObserver) {
    scrollableRegionObserver = new MutationObserver(() => {
      enhanceScrollableRegions();
    });

    scrollableRegionObserver.observe(contentRenderer, {
      childList: true,
      subtree: true,
    });
  }
});

// Also enhance on route changes
watch(
  () => route.path,
  () => {
    enhanceScrollableRegions();
    nextTick(() => {
      enhanceScrollableRegions();
    });
    setTimeout(() => {
      enhanceScrollableRegions();
    }, 100);
    setTimeout(() => {
      enhanceScrollableRegions();
    }, 300);
    setTimeout(() => {
      enhanceScrollableRegions();
    }, 500);
    setTimeout(() => {
      enhanceScrollableRegions();
    }, 1000);
  }
);

/**
 * Component cleanup and memory leak prevention
 *
 * Removes all event listeners to prevent memory leaks when the component
 * is unmounted or the route changes.
 *
 * Critical for SPA performance as components may be created/destroyed
 * frequently during navigation.
 *
 * @lifecycle onUnmounted
 */
onUnmounted(() => {
  window.removeEventListener("scroll", updateScroll);
  window.removeEventListener("resize", updateScroll);

  // Clean up MutationObserver if it exists
  if (scrollableRegionObserver) {
    scrollableRegionObserver.disconnect();
    scrollableRegionObserver = null;
  }
});

// =============================================================================
// SEO AND METADATA CONFIGURATION
// =============================================================================

/**
 * Configure page title and HTML attributes for accessibility and SEO
 *
 * Sets the document title and language attribute for proper SEO indexing
 * and accessibility compliance.
 *
 * Title Priority:
 * 1. content.title from frontmatter
 * 2. Generated from URL slug + project title
 * 3. Project title fallback
 *
 * @seo Page title configuration
 * @accessibility Language attribute for screen readers
 */
useHead({
  title: pageTitle,
  htmlAttrs: {
    lang: "en",
  },
});

/**
 * Configure comprehensive SEO metadata for search engines and social sharing
 *
 * Sets up all necessary meta tags for optimal SEO performance and social
 * media sharing appearance.
 *
 * Metadata Sources:
 * - Frontmatter properties (preferred)
 * - Generated fallbacks for consistency
 *
 * Social Sharing:
 * - Open Graph tags for Facebook, LinkedIn
 * - Twitter Card tags for Twitter
 * - Fallback images and descriptions
 *
 * SEO Features:
 * - Dynamic robots meta based on content type
 * - 404 pages marked as noindex, nofollow
 * - Regular content marked as index, follow
 * - Canonical URLs for duplicate content prevention
 * - Structured data for enhanced search results
 *
 * @seo Complete metadata configuration
 * @social Open Graph and Twitter Card support
 */

// Computed properties for enhanced SEO
const canonicalUrl = computed(() => {
  const baseUrl = "https://vpp.icjia.illinois.gov";
  return content.value?.canonical || `${baseUrl}${route.path}`;
});

const socialImage = computed(() => {
  // Priority: content frontmatter image > default OG image
  if (content.value?.image) {
    // If it's a relative path, make it absolute
    if (content.value.image.startsWith("/")) {
      return `https://vpp.icjia.illinois.gov${content.value.image}`;
    }
    // If it's already absolute (external URL), use as-is
    return content.value.image;
  }
  // Fallback to default OG image
  return "https://vpp.icjia.illinois.gov/images/og-image-default.jpg";
});

const twitterImage = computed(() => {
  // Use content image if available, otherwise Twitter-specific default
  if (content.value?.image) {
    if (content.value.image.startsWith("/")) {
      return `https://vpp.icjia.illinois.gov${content.value.image}`;
    }
    return content.value.image;
  }
  return "https://vpp.icjia.illinois.gov/images/twitter-card-default.jpg";
});

useSeoMeta({
  title: pageTitle,
  description: pageDescription,

  // Open Graph meta tags for Facebook, LinkedIn, etc.
  ogTitle: computed(() => content.value?.ogTitle || pageTitle.value),
  ogDescription: computed(
    () => content.value?.ogDescription || pageDescription.value
  ),
  ogImage: socialImage,
  ogUrl: canonicalUrl,
  ogType: computed(() => content.value?.ogType || "article"),
  ogSiteName: "Statewide Violence Prevention Plan for Illinois: 2025-2029",
  ogLocale: "en_US",

  // Twitter Card meta tags
  twitterCard: computed(
    () => content.value?.twitterCard || "summary_large_image"
  ),
  twitterTitle: computed(() => content.value?.twitterTitle || pageTitle.value),
  twitterDescription: computed(
    () => content.value?.twitterDescription || pageDescription.value
  ),
  twitterImage: twitterImage,
  twitterSite: "@ICJIA_Illinois",
  twitterCreator: "@ICJIA_Illinois",

  // Additional SEO meta tags
  robots: computed(() => {
    // Don't index 404 pages to avoid SEO penalties
    if (isNotFoundError.value) {
      return "noindex, nofollow";
    }
    // Allow indexing of regular content
    return content.value?.robots || "index, follow";
  }),

  // Canonical URL for duplicate content prevention (as meta fallback)
  canonical: canonicalUrl,

  // Additional meta tags for better SEO
  author: computed(
    () =>
      content.value?.author || "Illinois Criminal Justice Information Authority"
  ),
  publishedTime: computed(
    () => content.value?.date || content.value?.publishedTime
  ),
  modifiedTime: computed(
    () => content.value?.lastModified || content.value?.modifiedTime
  ),
});

// Also inject an explicit <link rel="canonical"> for Lighthouse compliance
useHead(() => ({
  link: [{ rel: "canonical", href: canonicalUrl.value }],
}));
