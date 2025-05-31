<template>
  <div class="sandbox-toc-page">
    <!-- Edge-to-edge PageTitleSection - no container wrapper -->
    <PageTitleSection
      ref="titleRow"
      title="Test Page"
      description="Testing the integration of PageTitleSection-style banner with sticky TOC behavior from sandbox-draft.vue"
      :show-border="true"
    />

    <!-- Main content section with proper container margins -->
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
            <!-- Content Renderer for Nuxt Content - Structure matches catch-all page -->
            <div v-if="about" class="content-renderer">
              <ContentRenderer :value="about" />
            </div>
            <div v-else class="pa-4">
              <p>About content not found</p>
            </div>
          </v-col>

          <!-- TOC Sidebar Column - Hidden on mobile, visible on md+ screens -->
          <v-col
            v-if="showTOC && about"
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
                    <!-- Status Information for Testing -->
                    <!-- <div class="px-3 mb-3">
                      <p class="text-caption mb-1">
                        <strong>Status:</strong> {{ isFixed ? "FIXED" : "NORMAL" }}
                      </p>
                      <p class="text-caption mb-0">
                        <strong>Scroll:</strong> {{ scrollY }}px
                      </p>
                    </div> -->

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

        <!-- Toggle for testing TOC visibility -->
        <v-row class="mt-8">
          <v-col
            :cols="contentColumnWidth.cols"
            :sm="contentColumnWidth.sm"
            :md="contentColumnWidth.md"
            :lg="contentColumnWidth.lg"
            :xl="contentColumnWidth.xl"
          >
            <v-card>
              <v-card-text class="py-3">
                <v-switch
                  v-model="showTOC"
                  :label="`TOC ${showTOC ? 'Enabled' : 'Disabled'}`"
                  color="primary"
                  inset
                  hide-details
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import PageTitleSection from "~/components/content/PageTitleSection.vue";

// Fetch content from Nuxt Content v3 system
const { data: about } = await useAsyncData(() =>
  queryCollection("content").path("/about").first()
);

/**
 * =============================================================================
 * REACTIVE STATE VARIABLES
 * =============================================================================
 */

// Current scroll position of the window (used for display and calculations)
const scrollY = ref(0);

// Whether the TOC sidebar is currently in fixed position mode
const isFixed = ref(false);

// Position of the title row's bottom edge relative to viewport
const titleBottom = ref(0);

// Reactive state for TOC visibility (initialize to false to prevent hydration mismatch)
const showTOC = ref(false);

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

/**
 * =============================================================================
 * COMPUTED PROPERTIES
 * =============================================================================
 */

/**
 * Computed styles for the fixed positioning
 * Returns positioning styles only when the element should be fixed
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
 * Extract and process TOC data to get H2-level headings only
 * @returns {Array} Array of H2 TOC items with text and id properties
 */
const tocH2Items = computed(() => {
  // Try different possible TOC data paths
  const tocData = about.value?.body?.toc || about.value?.toc || about.value?._toc;

  if (!tocData) {
    return [];
  }

  // Handle different TOC data structures
  let linksArray = [];

  if (Array.isArray(tocData)) {
    // If tocData is directly an array
    linksArray = tocData;
  } else if (tocData.links && Array.isArray(tocData.links)) {
    // If tocData has a links property (like in our case)
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
 * Compute responsive column widths for main content based on TOC toggle state
 * @returns {Object} Object with responsive column widths
 */
const contentColumnWidth = computed(() => {
  const hasTOC = showTOC.value;
  return {
    cols: 12, // Always full width on mobile (TOC hidden via d-none d-md-block)
    sm: 12, // Always full width on small screens (TOC hidden)
    md: hasTOC ? 9 : 12, // 9 cols when TOC enabled, 12 when disabled on tablet
    lg: hasTOC ? 9 : 12, // 9 cols when TOC enabled, 12 when disabled on desktop
    xl: hasTOC ? 9 : 12, // 9 cols when TOC enabled, 12 when disabled on large desktop
  };
});

/**
 * Compute responsive column widths for TOC sidebar
 * @returns {Object} Object with responsive column widths
 */
const tocColumnWidth = computed(() => {
  return {
    cols: 12, // Full width on mobile (but hidden via d-none d-md-block)
    sm: 12, // Full width on small screens (but hidden)
    md: 3, // 3 cols on tablet
    lg: 3, // 3 cols on desktop
    xl: 3, // 3 cols on large desktop
  };
});

/**
 * =============================================================================
 * CORE FUNCTIONALITY METHODS
 * =============================================================================
 */

/**
 * Main scroll event handler
 * Called on every scroll event to update positioning state
 */
const updateScroll = () => {
  // Update current scroll position
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
 * Monitors the title row visibility and determines when to activate fixed positioning
 * The TOC becomes fixed when the title row disappears behind the navbar
 */
const updateTitleVisibility = () => {
  // Handle Vue component instance (PageTitleSection) - get the root element
  const titleElement = titleRow.value?.$el || titleRow.value;

  if (titleElement && typeof titleElement.getBoundingClientRect === "function") {
    const rect = titleElement.getBoundingClientRect();

    // Store title bottom position for display purposes
    titleBottom.value = rect.bottom;

    // Activate fixed positioning when title bottom edge reaches/passes navbar
    // rect.bottom <= NAVBAR_HEIGHT means the title is completely hidden behind navbar
    isFixed.value = rect.bottom <= NAVBAR_HEIGHT;
  }
};

/**
 * Calculates and stores the exact positioning values for fixed mode
 * This ensures the fixed element appears in exactly the same position as natural positioning
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
 * Detect which section is currently in the viewport
 * @returns {void}
 */
const updateActiveSection = () => {
  if (!tocH2Items.value.length) return;

  const headerOffset = 120; // Slightly larger offset for better detection
  let currentActiveId = "";

  // Find the section that's currently most visible
  for (const item of tocH2Items.value) {
    const element = document.getElementById(item.id);
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    // Check if element is in viewport (considering header offset)
    if (rect.top <= headerOffset && rect.bottom > headerOffset) {
      currentActiveId = item.id;
      break;
    }
    // If we're past all sections, use the last one
    if (rect.top > headerOffset) {
      break;
    }
    // If element is above viewport, it could be the active one
    if (rect.bottom > 0) {
      currentActiveId = item.id;
    }
  }

  if (currentActiveId && currentActiveId !== activeItemId.value) {
    activeItemId.value = currentActiveId;
  }
};

/**
 * Smooth scroll to a heading with header offset compensation
 * @param {string} headingId - The ID of the heading to scroll to
 */
const scrollToHeading = (headingId) => {
  if (!headingId) return;

  const targetElement = document.getElementById(headingId);
  if (!targetElement) {
    console.warn(`TOC: Could not find element with ID: ${headingId}`);
    return;
  }

  // Update active state immediately for better UX
  activeItemId.value = headingId;

  // Calculate scroll position with header offset (use same as TOC positioning)
  const headerOffset = 80; // Keep consistent with original offset for content visibility
  const elementPosition = targetElement.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - headerOffset;

  // Smooth scroll to target
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });

  // Set focus to target element for accessibility
  targetElement.focus({ preventScroll: true });
};

/**
 * Smooth scroll to the top of the page
 * Used when clicking on the "Table of Contents" title
 */
const scrollToTop = () => {
  // Clear active item when scrolling to top
  activeItemId.value = "";

  // Smooth scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

/**
 * =============================================================================
 * LIFECYCLE MANAGEMENT
 * =============================================================================
 */

/**
 * Component initialization
 * Sets up event listeners and performs initial calculations
 */
onMounted(() => {
  // Enable TOC after hydration to prevent SSR mismatch
  showTOC.value = true;

  // Listen for scroll events to update positioning
  window.addEventListener("scroll", updateScroll);

  // Listen for resize events to recalculate positioning
  window.addEventListener("resize", updateScroll);

  // Perform initial calculation after DOM is ready
  // setTimeout ensures all Vuetify components are fully rendered
  setTimeout(() => {
    updateScroll();
  }, 100);
});

/**
 * Component cleanup
 * Removes event listeners to prevent memory leaks
 */
onUnmounted(() => {
  window.removeEventListener("scroll", updateScroll);
  window.removeEventListener("resize", updateScroll);
});

// Set page title
useHead({
  title: "TOC Layout Test - Violence Prevention Plan",
});
</script>

<style>
/**
 * =============================================================================
 * PAGE STRUCTURE STYLES
 * =============================================================================
 */

/* Main page container - matches catch-all page structure */
.sandbox-toc-page {
  min-height: 100vh;
  padding-top: 60px; /* Account for sticky header */
  overflow-x: hidden;
  /* Soft light theme background to reduce eye strain */
  background: #fafafa;
}

/* Dark theme background override */
:root[data-theme="dark"] .sandbox-toc-page {
  background: rgb(var(--v-theme-surface));
}

/* Container styling for content areas - matches catch-all page */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Main content spacing - matches catch-all page */
.page-content {
  padding: 4.5rem 0; /* Consistent with other pages */
}

/* Main content column styling - matches catch-all page structure */
.main-content-col {
  background-color: transparent;
}

/* Add focus styles for accessibility - matching existing pages */
:deep(*:focus-visible) {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Responsive content spacing */
@media (max-width: 768px) {
  .page-content {
    padding: 3rem 0; /* Responsive spacing - reduced from 4.5rem for mobile */
  }

  .container {
    padding: 0 1rem;
  }
}

/**
 * =============================================================================
 * CONTENT RENDERER STYLES (Matching catch-all page)
 * =============================================================================
 */

/* Content renderer styling - sandbox page specific with global scope */
.sandbox-toc-page .content-renderer {
  /* Heading styles with stronger specificity to override global styles */
  h1 {
    font-size: 1.8rem !important;
    font-weight: 600 !important;
    margin-bottom: 1rem !important;
    line-height: 1.3 !important;
  }

  h2 {
    font-size: 1.5rem !important;
    font-weight: 600 !important;
    margin-top: 1.5rem !important;
    margin-bottom: 1rem !important;
    line-height: 1.3 !important;
    /* Ensure H2 headings remain flush left - override global styles */
    margin-left: 0 !important;
  }

  h3 {
    font-size: 1.25rem !important;
    font-weight: 600 !important;
    margin-top: 1.25rem !important;
    margin-bottom: 0.75rem !important;
    line-height: 1.3 !important;
  }

  /*
   * Visual Hierarchy: Content Indentation System
   *
   * Creates visual hierarchy by indenting all content that follows H2 headings.
   * H2 headings remain flush left, while all subsequent content (until the next H2)
   * is indented to show the relationship and create clear content sections.
   *
   * Using !important to override global styles from main.scss
   */

  /* Indent all content following H2 headings - CRITICAL: Use !important to override global styles */
  h2 ~ * {
    margin-left: 2rem !important; /* 32px indentation for clear visual hierarchy */
  }

  /* Ensure H2 headings themselves are not indented (override the sibling selector) */
  h2 ~ h2 {
    margin-left: 0 !important;
  }

  /* Responsive indentation - reduce on smaller screens with !important */
  @media (max-width: 768px) {
    h2 ~ * {
      margin-left: 1.5rem !important; /* 24px on tablets */
    }
  }

  @media (max-width: 480px) {
    h2 ~ * {
      margin-left: 1rem !important; /* 16px on mobile */
    }
  }

  /* Paragraph and list styles with stronger specificity */
  p {
    margin-bottom: 1rem !important;
    line-height: 1.6 !important;
  }

  ul,
  ol {
    margin-bottom: 1rem !important;
    padding-left: 1.5rem !important;
  }

  li {
    margin-bottom: 0.5rem !important;
    line-height: 1.6 !important;
  }

  /* Link styles */
  a {
    color: var(--v-primary-base) !important;
    text-decoration: underline !important;
  }

  a:hover {
    text-decoration: none !important;
  }

  a:focus-visible {
    outline: 2px solid var(--v-primary-base) !important;
    outline-offset: 2px !important;
  }

  /* Other elements */
  blockquote {
    border-left: 4px solid var(--v-primary-lighten-1) !important;
    padding-left: 1rem !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 1rem !important;
    font-style: italic !important;
  }
}

/* Dark theme adjustments for content renderer */
.v-theme--dark .sandbox-toc-page .content-renderer {
  blockquote {
    border-left-color: var(--v-primary-lighten-2) !important;
  }
}

/**
 * =============================================================================
 * LAYOUT COLUMN STYLES
 * =============================================================================
 */

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

/* TOC Fixed Container */
.toc-fixed-container {
  position: sticky;
  top: 0;
  height: fit-content;
  z-index: 10;
  align-self: flex-start;
  transition: top 0.3s ease-in-out;
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

/**
 * =============================================================================
 * RESPONSIVE DESIGN
 * =============================================================================
 */

/* Responsive design with proportional scaling */

/**
 * =============================================================================
 * ANIMATION KEYFRAMES
 * =============================================================================
 */

/* Animation keyframes */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .toc-item,
  .toc-indicator-dot,
  .toc-link {
    animation: none !important;
    transition: none !important;
  }
}
</style>
