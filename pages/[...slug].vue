<template>
  <div class="dynamic-content-page">
    <!-- Loading state -->
    <div v-if="pending" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-body-1 mt-4">Loading content...</p>
    </div>

    <!-- Error state - show 404 when content not found -->
    <div v-else-if="error && isNotFoundError" class="text-center py-16">
      <div class="error-content">
        <div class="error-animation mb-8">
          <v-icon
            icon="mdi-map-marker-off"
            size="100"
            color="primary"
            class="error-icon"
            aria-hidden="true"
          />
          <div class="error-code">404</div>
        </div>

        <h1 class="text-h2 font-weight-bold mb-4">Page Not Found</h1>

        <p class="text-subtitle-1 text-primary font-weight-medium mb-2 max-width-text">
          Statewide Violence Prevention Plan for Illinois: 2025-2029
        </p>

        <p class="text-body-1 mb-8 max-width-text">
          Oops! It seems like the page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div class="text-center">
          <v-btn
            color="primary"
            size="large"
            class="rounded-pill px-8 py-3 elevation-1 home-button"
            @click="navigateToHome"
            aria-label="Return to homepage"
          >
            <v-icon icon="mdi-home" class="mr-2" aria-hidden="true" />
            Return to Homepage
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Other error states -->
    <div v-else-if="error" class="text-center py-16">
      <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
      <h2 class="text-h4 mb-4">Content Loading Error</h2>
      <p class="text-body-1 mb-4">{{ error.message }}</p>
      <v-btn color="primary" @click="refresh()">Try Again</v-btn>
    </div>

    <!-- Content display -->
    <div v-else-if="content">
      <!-- Use PageTitleSection for standardized header -->

      <PageTitleSection
        v-if="needsStandardHeader"
        ref="titleRow"
        :title="content.title || pageTitle"
        :description="content.description"
        :show-border="true"
        :show-date="!!(content.meta?.showDate || content.showDate)"
        :date="content.date"
      />

      <!-- Main content section -->
      <div class="page-content">
        <div class="container">
          <!-- Content and TOC Layout using Vuetify Grid -->
          <v-row>
            <!-- Main Content Column -->
            <v-col
              :cols="contentColumnWidth.cols"
              :sm="contentColumnWidth.sm"
              :md="contentColumnWidth.md"
              :lg="contentColumnWidth.lg"
              :xl="contentColumnWidth.xl"
              class="main-content-col"
            >
              <!-- Content Renderer for Nuxt Content -->
              <div
                class="content-renderer"
                :class="{ 'hide-first-heading': needsStandardHeader }"
              >
                <ContentRenderer :value="content" @rendered="markAsRendered" />
              </div>
            </v-col>

            <!-- TOC Sidebar Column - Hidden on mobile, visible on md+ screens -->
            <v-col
              v-if="showTOC && content"
              :cols="tocColumnWidth.cols"
              :sm="tocColumnWidth.sm"
              :md="tocColumnWidth.md"
              :lg="tocColumnWidth.lg"
              :xl="tocColumnWidth.xl"
              class="sidebar-col d-none d-md-block"
              ref="sidebarCol"
            >
              <div class="sidebar-wrapper">
                <!--
                  The actual TOC content element that becomes fixed
                  - ref="stickyElement": Used to measure dimensions and apply fixed positioning
                  - :class="{ 'is-fixed': isFixed }": Applies fixed styling when positioned
                  - :style="fixedStyles": Applies computed fixed positioning styles
                -->
                <div
                  ref="stickyElement"
                  class="toc-content"
                  :class="{ 'is-fixed': isFixed }"
                  :style="fixedStyles"
                >
                  <v-sheet class="toc-sheet" color="transparent">
                    <div
                      class="text-subtitle-1 pb-2 px-3 pt-3 toc-title-clickable"
                      @click="scrollToTop"
                      role="button"
                      tabindex="0"
                      @keydown.enter="scrollToTop"
                      @keydown.space.prevent="scrollToTop"
                      aria-label="Scroll to top of page"
                    >
                      Table of Contents
                    </div>
                    <div class="pt-0 px-0 pb-3">
                      <!-- Functional TOC List with Visual Indicator -->
                      <div v-if="tocH2Items.length > 0" class="toc-container">
                        <!-- Left border indicator line -->
                        <div class="toc-indicator-line"></div>

                        <v-list density="compact" class="toc-list" bg-color="transparent">
                          <v-list-item
                            v-for="(item, index) in tocH2Items"
                            :key="`toc-${index}`"
                            @click="scrollToHeading(item.id)"
                            :class="[
                              'toc-item',
                              { 'toc-item--active': activeItemId === item.id },
                            ]"
                            :ripple="true"
                            :tabindex="0"
                            @keydown.enter="scrollToHeading(item.id)"
                            @keydown.space.prevent="scrollToHeading(item.id)"
                            :aria-label="`Navigate to section: ${item.text}`"
                            :aria-current="activeItemId === item.id ? 'true' : 'false'"
                            role="button"
                          >
                            <!-- Visual indicator dot positioned absolutely relative to container -->
                            <div
                              :class="[
                                'toc-indicator-dot',
                                { 'toc-indicator-dot--active': activeItemId === item.id },
                              ]"
                            ></div>

                            <v-list-item-title
                              :class="[
                                'text-body-2 toc-link',
                                { 'toc-link--active': activeItemId === item.id },
                              ]"
                            >
                              {{ item.text }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </div>

                      <!-- Fallback for no TOC data -->
                      <div v-else class="px-3">
                        <p class="text-body-2 text-medium-emphasis mb-0">
                          No table of contents available
                        </p>
                      </div>
                    </div>
                  </v-sheet>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>

    <!-- Fallback content if no content is found -->
    <div v-else class="text-center py-16">
      <v-icon color="warning" size="64" class="mb-4">mdi-file-document-outline</v-icon>
      <h2 class="text-h4 mb-4">No Content Found</h2>
      <p class="text-body-1">The requested page content could not be found.</p>
      <v-btn color="primary" @click="navigateToHome" class="mt-4">
        <v-icon icon="mdi-home" class="mr-2" aria-hidden="true" />
        Return to Homepage
      </v-btn>
    </div>
  </div>
</template>

<script setup>
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
import PageTitleSection from "~/components/content/PageTitleSection.vue";

// Initialize console logger
const { log, logError } = useConsoleLogger();

// Get current route
const route = useRoute();

// Build content path from route params
const contentPath = computed(() => {
  const slugArray = route.params.slug || [];
  const path = Array.isArray(slugArray) ? `/${slugArray.join("/")}` : `/${slugArray}`;

  log("content", "Dynamic route - resolving content path", {
    routePath: route.path,
    contentPath: path,
    timestamp: new Date().toISOString(),
  });

  return path;
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
  if (!content.value) return false;

  // Check if content body contains layout components
  const bodyContent = content.value.body || content.value._body || "";
  const hasLayoutComponents =
    bodyContent.toString().includes("::") ||
    bodyContent.toString().includes("about-hero") ||
    bodyContent.toString().includes("hero-section") ||
    bodyContent.toString().includes("feature-section");

  // If no layout components detected, provide standardized header
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
  const tocData = content.value?.body?.toc || content.value?.toc || content.value?._toc;

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
  const lastSlug = Array.isArray(slugArray) ? slugArray[slugArray.length - 1] : slugArray;

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

// =============================================================================
// CORE FUNCTIONALITY METHODS
// =============================================================================

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
 * Performance Considerations:
 * - Called on every scroll event (high frequency)
 * - Uses try/catch to prevent scroll event blocking
 * - Efficient DOM queries with early returns
 *
 * @function updateScroll
 * @returns {void}
 */
const updateScroll = () => {
  // Update current scroll position for debugging and calculations
  scrollY.value = window.scrollY;

  try {
    // Check if title is still visible and update fixed state
    updateTitleVisibility();

    // Calculate positioning for fixed state
    updateFixedPosition();

    // Update active section for TOC highlighting
    updateActiveSection();
  } catch (error) {
    // Gracefully handle any DOM-related errors during development
    console.warn("Error updating scroll position:", error);
  }
};

/**
 * Monitors PageTitleSection visibility to determine fixed positioning activation
 *
 * This function tracks when the PageTitleSection component scrolls out of view
 * behind the fixed navbar, which triggers the TOC to become position: fixed.
 *
 * Logic:
 * - Gets the PageTitleSection element (handles Vue component refs)
 * - Measures its bounding rectangle relative to viewport
 * - Activates fixed positioning when title bottom <= navbar height
 * - Stores title bottom position for debugging purposes
 *
 * Vue Component Handling:
 * - Handles both component instances ($el) and direct DOM elements
 * - Safely checks for getBoundingClientRect method existence
 * - Gracefully handles component mounting/unmounting
 *
 * @function updateTitleVisibility
 * @returns {void}
 */
const updateTitleVisibility = () => {
  // Handle Vue component instance (PageTitleSection) - get the root element
  const titleElement = titleRow.value?.$el || titleRow.value;

  if (titleElement && typeof titleElement.getBoundingClientRect === "function") {
    const rect = titleElement.getBoundingClientRect();

    // Store title bottom position for debugging and display purposes
    titleBottom.value = rect.bottom;

    // Activate fixed positioning when title bottom edge reaches/passes navbar
    // rect.bottom <= NAVBAR_HEIGHT means the title is completely hidden behind navbar
    isFixed.value = rect.bottom <= NAVBAR_HEIGHT;
  }
};

/**
 * Calculates and stores exact positioning values for fixed mode
 *
 * This function ensures that when the TOC becomes position: fixed, it appears
 * in exactly the same position as it had in normal document flow. This prevents
 * visual jumping or layout shifts during the transition.
 *
 * Critical Timing:
 * - ONLY measures position when element is in natural (not fixed) state
 * - Prevents measurement of already-fixed positioning (which would be incorrect)
 * - Stores values for use when transitioning to fixed state
 *
 * Measurements Stored:
 * - fixedWidth: Exact width to maintain during fixed positioning
 * - fixedLeft: Exact horizontal position relative to viewport
 *
 * Vue Component Handling:
 * - Handles both component instances ($el) and direct DOM elements
 * - Safely checks for getBoundingClientRect method existence
 *
 * @function updateFixedPosition
 * @returns {void}
 */
const updateFixedPosition = () => {
  // Get reference to the TOC content element
  const contentElement = stickyElement.value?.$el || stickyElement.value;

  if (contentElement && typeof contentElement.getBoundingClientRect === "function") {
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

/**
 * Detects which H2 section is currently most visible in the viewport
 *
 * This function implements intelligent section detection to highlight the
 * appropriate TOC item based on what content is currently visible to the user.
 *
 * Detection Algorithm:
 * 1. Iterates through all H2 headings in document order
 * 2. Checks if each heading is within the "active zone" (considering header offset)
 * 3. Uses the first heading that intersects with the active zone
 * 4. Falls back to the last heading above the viewport if none intersect
 *
 * Active Zone Logic:
 * - Uses 120px header offset for better detection accuracy
 * - Considers a heading "active" if it's near the top of the viewport
 * - Handles edge cases like very short sections or long content
 *
 * Performance Considerations:
 * - Early return if no TOC items exist
 * - Efficient DOM queries with getElementById
 * - Only updates state when active section actually changes
 *
 * @function updateActiveSection
 * @returns {void}
 */
const updateActiveSection = () => {
  // Early return if no TOC items to process
  if (!tocH2Items.value.length) return;

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

  // Only update state if the active section has actually changed
  if (currentActiveId && currentActiveId !== activeItemId.value) {
    activeItemId.value = currentActiveId;
  }
};

/**
 * Smooth scrolls to a specific heading with header offset compensation
 *
 * This function provides the core navigation functionality for TOC items.
 * It handles smooth scrolling to headings while accounting for the fixed
 * navbar and providing proper accessibility support.
 *
 * Functionality:
 * - Validates heading ID and target element existence
 * - Immediately updates active state for responsive UI feedback
 * - Calculates scroll position with header offset compensation
 * - Performs smooth scroll animation
 * - Sets focus to target element for accessibility
 *
 * Header Offset Logic:
 * - Uses 80px offset to account for fixed navbar
 * - Ensures target heading is visible below the navbar
 * - Consistent with other scroll positioning in the app
 *
 * Accessibility Features:
 * - Sets focus to target element for screen readers
 * - Uses preventScroll to avoid double scrolling
 * - Provides immediate visual feedback via active state
 *
 * Error Handling:
 * - Validates headingId parameter
 * - Checks for target element existence
 * - Logs warnings for debugging when elements not found
 *
 * @function scrollToHeading
 * @param {string} headingId - The HTML ID of the heading element to scroll to
 * @returns {void}
 */
const scrollToHeading = (headingId) => {
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

/**
 * Smooth scrolls to the top of the page
 *
 * This function is triggered when users click on the "Table of Contents" title.
 * It provides a quick way to return to the beginning of the page content.
 *
 * Functionality:
 * - Clears active TOC item highlighting (no section is active at top)
 * - Performs smooth scroll animation to page top
 * - Resets TOC visual state appropriately
 *
 * User Experience:
 * - Provides intuitive "back to top" functionality
 * - Maintains smooth animation consistency
 * - Clears section highlighting when appropriate
 *
 * @function scrollToTop
 * @returns {void}
 */
const scrollToTop = () => {
  // Clear active item when scrolling to top (no section is active)
  activeItemId.value = "";

  // Perform smooth scroll animation to page top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

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
if (content.value) {
  log("content", "Dynamic route content loaded", {
    title: content.value.title,
    path: contentPath.value,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Monitor content loading errors for debugging and error tracking
 *
 * Logs detailed error information when content fails to load.
 * Helps with debugging content resolution issues and monitoring site health.
 */
if (error.value) {
  logError("Dynamic route content error", {
    path: contentPath.value,
    error: error.value.message,
    code: error.value.code,
    timestamp: new Date().toISOString(),
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
 *
 * @seo Complete metadata configuration
 * @social Open Graph and Twitter Card support
 */
useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: computed(() => content.value?.ogTitle || pageTitle.value),
  ogDescription: computed(() => content.value?.ogDescription || pageDescription.value),
  ogImage: computed(() => content.value?.ogImage || "/images/og-image-default.jpg"),
  twitterCard: computed(() => content.value?.twitterCard || "summary_large_image"),
  robots: computed(() => {
    // Don't index 404 pages to avoid SEO penalties
    if (isNotFoundError.value) {
      return "noindex, nofollow";
    }
    // Allow indexing of regular content
    return content.value?.robots || "index, follow";
  }),
});
</script>

<style scoped>
/**
 * Dynamic Content Page Styling - Consistent with PageTitleSection System
 *
 * Implements the standardized page layout with soft light theme background,
 * consistent spacing, and proper content structure to match other pages
 * using the PageTitleSection component.
 */

/* Page structure with soft light theme background */
.dynamic-content-page {
  min-height: 100vh;
  padding-top: 60px; /* Account for sticky header */
  overflow-x: hidden;
  /* Soft light theme background to reduce eye strain */
  background: #fafafa;
}

/* Dark theme background override */
:root[data-theme="dark"] .dynamic-content-page {
  background: rgb(var(--v-theme-surface));
}

/* Container styling for content areas */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Main content spacing */
.page-content {
  padding: 4.5rem 0; /* Consistent with other pages */
}

/* Add focus styles for accessibility - matching existing pages */
:deep(*:focus-visible) {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Error page styling */
.error-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.error-animation {
  position: relative;
  display: inline-block;
}

.error-icon {
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

.error-code {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.max-width-text {
  max-width: 500px;
  margin: 0 auto;
}

.home-button {
  transition: all 0.3s ease;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Animation for error icon */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Reduced motion support - matching existing pages */
@media (prefers-reduced-motion: reduce) {
  .error-icon {
    animation: none !important;
  }

  .home-button:hover {
    transform: none !important;
  }

  /* Match the reduced motion classes from existing pages */
  :deep(.hero-title),
  :deep(.hero-description),
  :deep(.hero-button),
  :deep(.feature-card),
  :deep(.shadow-img),
  :deep(.cta-button),
  :deep(.animate-title),
  :deep(.animate-text),
  :deep(.about-image),
  :deep(.value-card),
  :deep(.approach-item),
  :deep(.contact-button) {
    animation: none !important;
    transition: none !important;
  }

  :deep(.shadow-img:hover),
  :deep(.cta-button:hover),
  :deep(.about-image:hover),
  :deep(.value-card:hover),
  :deep(.value-card:focus-visible),
  :deep(.contact-button:hover),
  :deep(.contact-button:focus-visible) {
    transform: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .error-code {
    text-shadow: none;
    border: 2px solid currentColor;
    background: rgb(var(--v-theme-surface));
    padding: 0.5rem;
    border-radius: 4px;
  }
}

/* Dark theme adjustments */
:deep(.v-theme--dark) .error-code {
  color: rgb(var(--v-theme-primary));
}

/* Loading state accessibility */
.v-progress-circular {
  margin: 0 auto;
}

/* Responsive design */
@media (max-width: 768px) {
  .dynamic-content-page {
    padding-top: 50px; /* Smaller header offset on mobile */
  }

  .page-content {
    padding: 3rem 0; /* Responsive spacing - reduced from 4.5rem for mobile */
  }

  .container {
    padding: 0 1rem;
  }
}

/* Content renderer styling - matches existing components */
.content-renderer {
  /* Hide first heading when we have a standardized header */
  &.hide-first-heading {
    :deep(h1:first-of-type) {
      display: none;
    }
  }

  /* Heading styles */
  :deep(h1) {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  :deep(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    line-height: 1.3;
    /* Ensure H2 headings remain flush left */
    margin-left: 0;
  }

  :deep(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }

  /*
   * Visual Hierarchy: Content Indentation System
   *
   * Creates visual hierarchy by indenting all content that follows H2 headings.
   * H2 headings remain flush left, while all subsequent content (until the next H2)
   * is indented to show the relationship and create clear content sections.
   */

  /* Indent all content following H2 headings */
  :deep(h2 ~ *) {
    margin-left: 2rem; /* 32px indentation for clear visual hierarchy */
  }

  /* Ensure H2 headings themselves are not indented (override the sibling selector) */
  :deep(h2 ~ h2) {
    margin-left: 0;
  }

  /* Responsive indentation - reduce on smaller screens */
  @media (max-width: 768px) {
    :deep(h2 ~ *) {
      margin-left: 1.5rem; /* 24px on tablets */
    }
  }

  @media (max-width: 480px) {
    :deep(h2 ~ *) {
      margin-left: 1rem; /* 16px on mobile */
    }
  }

  /* Paragraph and list styles */
  :deep(p) {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  :deep(li) {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }

  /* Link styles */
  :deep(a) {
    color: var(--v-primary-base);
    text-decoration: underline;
  }

  :deep(a:hover) {
    text-decoration: none;
  }

  :deep(a:focus-visible) {
    outline: 2px solid var(--v-primary-base);
    outline-offset: 2px;
  }

  /* Other elements */
  :deep(blockquote) {
    border-left: 4px solid var(--v-primary-lighten-1);
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 1rem;
    font-style: italic;
  }

  /* Code styling is now handled by global CSS with Shiki integration */
}

/* Dark theme adjustments for content renderer */
:deep(.v-theme--dark) {
  .content-renderer {
    :deep(blockquote) {
      border-left-color: var(--v-primary-lighten-2);
    }
  }
}

/**
 * =============================================================================
 * LAYOUT COLUMN STYLES
 * =============================================================================
 */

/* Main content column styling - transparent to use page background */
.main-content-col {
  background-color: transparent;
}

/* Sidebar column styling - transparent to use page background */
.sidebar-col {
  background-color: transparent;
}

/* Sidebar wrapper for flex layout with increased left spacing */
.sidebar-wrapper {
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem 2rem 3rem; /* Increased left padding from 1.5rem to 3rem */
}

/* Responsive sidebar padding */
@media (max-width: 768px) {
  .sidebar-wrapper {
    padding: 1.5rem 1rem 1.5rem 2rem; /* Increased left padding from 1rem to 2rem on mobile */
  }
}

/**
 * =============================================================================
 * TOC CONTENT STYLES (Fixed Positioning)
 * =============================================================================
 */

/* Base styles for the TOC content (both normal and fixed states) */
.toc-content {
  width: 100%;
  box-sizing: border-box; /* Include padding and border in width calculations */

  /* Prevent unexpected sizing issues */
  min-width: 0;
  max-width: 100%;
}

/* Enhanced styling when in fixed position mode - NO BOX SHADOW */
.toc-content.is-fixed {
  /* Ensure consistent sizing in fixed state */
  box-sizing: border-box;
  /* Explicitly remove any box shadows */
  box-shadow: none !important;
}

/* TOC Sheet Styling - Completely blended into background with no hover effects */
.toc-sheet {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  /* Remove all hover effects and transitions */
  transition: none !important;
}

.toc-sheet:hover {
  box-shadow: none !important;
  transform: none !important;
  background-color: transparent !important;
}

.toc-sheet::before,
.toc-sheet::after {
  box-shadow: none !important;
}

/* Remove hover effects from all sheet states */
.toc-sheet:hover::before,
.toc-sheet:hover::after,
.toc-sheet:focus::before,
.toc-sheet:focus::after {
  box-shadow: none !important;
}

/* Clickable TOC Title */
.toc-title-clickable {
  cursor: pointer !important;
  transition: all 0.3s ease-in-out;
  border-radius: 6px;
  user-select: none;
}

.toc-title-clickable:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
  color: rgb(var(--v-theme-primary)) !important;
  transform: translateY(-1px);
}

.toc-title-clickable:focus {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.toc-title-clickable:active {
  transform: translateY(0px);
}

/* TOC Container with Visual Indicator */
.toc-container {
  position: relative;
  padding-left: 0;
}

/* Vertical indicator line */
.toc-indicator-line {
  position: absolute;
  left: 20px;
  top: 18px;
  bottom: 18px;
  width: 2px;
  background-color: rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 1px;
  z-index: 1;
  transition: background-color 0.3s ease;
}

.v-theme--dark .toc-indicator-line {
  background-color: rgba(255, 255, 255, 0.12);
}

/* TOC List Styling */
.toc-list {
  background-color: transparent !important;
  position: relative;
  z-index: 2;
}

/* TOC Item Styling */
.toc-item {
  border-radius: 6px !important;
  margin: 2px 8px 2px 0 !important;
  padding-left: 40px !important; /* Add padding to make room for dots */
  min-height: 40px !important;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative;

  /* Ensure TOC items can expand to accommodate wrapped text */
  height: auto !important; /* Allow dynamic height for wrapped text */
  align-items: flex-start !important; /* Align content to top when text wraps */
}

/* Override Vuetify v-list-item-title default truncation styles */
.toc-item .v-list-item-title {
  white-space: normal !important; /* Allow text wrapping */
  text-overflow: unset !important; /* Remove ellipsis */
  overflow: visible !important; /* Show all content */
  word-wrap: break-word !important; /* Break long words */
  hyphens: auto !important; /* Add hyphens for better readability */
  line-height: 1.4 !important; /* Consistent line height */
  padding: 0.25rem 0 !important; /* Add vertical padding for better spacing */
}

.toc-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
  transform: translateX(2px);
}

.toc-item:focus {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Active TOC Item */
.toc-item--active {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
  transform: translateX(4px);
}

.toc-item--active:hover {
  background-color: rgba(var(--v-theme-primary), 0.16) !important;
}

/* Visual Indicator Dots - Adjusted for wrapped text */
.toc-indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #1976d2; /* High contrast blue for unselected items */
  border: 2px solid rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease-in-out;
  flex-shrink: 0;
  position: absolute;
  left: 15px; /* Position relative to the toc-item */
  top: 0.75rem; /* Fixed position relative to top instead of center for wrapped text */
  transform: translateY(0); /* Remove vertical centering transform */
  z-index: 3;
}

/* Dark mode - unselected items stay blue */
.v-theme--dark .toc-indicator-dot {
  background-color: #1976d2; /* Keep blue for unselected in dark mode */
  border-color: rgba(25, 118, 210, 0.3);
}

.toc-indicator-dot--active {
  background-color: #4caf50 !important; /* High contrast green for selected items */
  border-color: rgba(76, 175, 80, 0.3) !important;
  transform: scale(1.2); /* Remove translateY since we're using fixed top positioning */
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

.toc-item:hover .toc-indicator-dot {
  background-color: rgba(var(--v-theme-primary), 0.6);
  transform: scale(1.1); /* Consistent scaling without translateY */
}

.toc-item:hover .toc-indicator-dot--active {
  transform: scale(1.3); /* Consistent scaling without translateY */
}

/* TOC Link Text Styling - Fix truncation and allow text wrapping */
.toc-link {
  color: rgba(var(--v-theme-on-surface), 0.87) !important;
  font-weight: 400 !important;
  line-height: 1.4 !important;
  transition: all 0.3s ease-in-out;

  /* Override Vuetify's default text truncation */
  white-space: normal !important; /* Allow text to wrap instead of truncating */
  text-overflow: unset !important; /* Remove ellipsis truncation */
  overflow: visible !important; /* Show all text content */
  word-wrap: break-word !important; /* Break long words if necessary */
  hyphens: auto !important; /* Add hyphens for better word breaking */
}

.toc-link--active {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600 !important;
}

.toc-item:hover .toc-link {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 500 !important;
}

.toc-item:hover .toc-link--active {
  font-weight: 600 !important;
}

/* Dark theme support */
.v-theme--dark .toc-link {
  color: rgba(255, 255, 255, 0.87) !important;
}

.v-theme--dark .toc-link--active {
  color: rgb(var(--v-theme-primary)) !important;
}

.v-theme--dark .toc-item:hover .toc-link {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Ensure proper focus states for accessibility */
.toc-item:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Smooth animations for better UX */
.toc-item,
.toc-indicator-dot,
.toc-link {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .toc-item,
  .toc-indicator-dot,
  .toc-link,
  .toc-title-clickable {
    animation: none !important;
    transition: none !important;
  }

  .toc-item:hover,
  .toc-item--active,
  .toc-title-clickable:hover {
    transform: none !important;
  }
}
</style>
