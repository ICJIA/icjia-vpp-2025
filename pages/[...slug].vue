<template>
  <div class="dynamic-content-page">
    <!-- Loading state -->
    <div v-if="pending" class="text-center py-16">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
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
              <div class="content-renderer" :class="{ 'hide-first-heading': needsStandardHeader }">
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useHead, useSeoMeta, navigateTo } from '#imports';
import { useConsoleLogger } from '~/composables/useConsoleLogger';
import useContentFetcher from '~/composables/useContentFetcher';
import PageTitleSection from '~/components/content/PageTitleSection.vue';

// Initialize console logger
const { log, logError } = useConsoleLogger();

// Get current route
const route = useRoute();

// Build content path from route params
const contentPath = computed(() => {
  const slugArray = route.params.slug || [];
  const path = Array.isArray(slugArray) ? `/${slugArray.join('/')}` : `/${slugArray}`;

  log('content', 'Dynamic route - resolving content path', {
    routePath: route.path,
    contentPath: path,
    timestamp: new Date().toISOString()
  });

  return path;
});

// Use the project's content fetcher composable
const { content, pending, error, refresh, markAsRendered } = useContentFetcher({
  path: contentPath.value
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



/**
 * =============================================================================
 * COMPUTED PROPERTIES
 * =============================================================================
 */

// Check if error is a "not found" error
const isNotFoundError = computed(() => {
  return error.value && (
    error.value.code === 'NOT_FOUND' ||
    error.value.message?.includes('not found') ||
    error.value.statusCode === 404
  );
});

// Detect if content needs a standardized header
// This applies to plain markdown content that doesn't use layout components
const needsStandardHeader = computed(() => {
  if (!content.value) return false;

  // Check if content body contains layout components (like ::about-hero, ::hero-section, etc.)
  const bodyContent = content.value.body || content.value._body || '';
  const hasLayoutComponents = bodyContent.toString().includes('::') ||
                             bodyContent.toString().includes('about-hero') ||
                             bodyContent.toString().includes('hero-section') ||
                             bodyContent.toString().includes('feature-section');

  // If no layout components detected, provide standardized header
  return !hasLayoutComponents;
});

// Check if TOC should be displayed based on frontmatter
const showTOC = computed(() => {
  return !!(content.value?.showTOC || content.value?.meta?.showTOC);
});

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
    md: hasTOC ? 8 : 12, // 8 cols when TOC enabled, 12 when disabled on tablet
    lg: hasTOC ? 8 : 12, // 8 cols when TOC enabled, 12 when disabled on desktop
    xl: hasTOC ? 8 : 12, // 8 cols when TOC enabled, 12 when disabled on large desktop
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
    md: 4, // 4 cols on tablet
    lg: 4, // 4 cols on desktop
    xl: 4, // 4 cols on large desktop
  };
});

// Generate page title from slug or content
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
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return `${titleFromSlug} - Statewide Violence Prevention Plan for Illinois: 2025-2029`;
  }

  return 'Statewide Violence Prevention Plan for Illinois: 2025-2029';
});

// Generate page description
const pageDescription = computed(() => {
  if (content.value?.description) {
    return content.value.description;
  }

  return 'Statewide Violence Prevention Plan for Illinois: 2025-2029 - Building safer communities through evidence-based violence prevention strategies.';
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

// Navigation helper
const navigateToHome = () => {
  navigateTo('/');
};

// Watch for successful content loading
if (content.value) {
  log('content', 'Dynamic route content loaded', {
    title: content.value.title,
    path: contentPath.value,
    timestamp: new Date().toISOString()
  });
}

// Watch for errors
if (error.value) {
  logError('Dynamic route content error', {
    path: contentPath.value,
    error: error.value.message,
    code: error.value.code,
    timestamp: new Date().toISOString()
  });
}

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

/**
 * Set page title and HTML attributes for accessibility and SEO
 * Uses content frontmatter when available, falls back to generated titles
 */
useHead({
  title: pageTitle,
  htmlAttrs: {
    lang: 'en'
  }
});

/**
 * Set SEO metadata based on content frontmatter or generated values
 * Includes Open Graph and Twitter Card metadata
 */
useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: computed(() => content.value?.ogTitle || pageTitle.value),
  ogDescription: computed(() => content.value?.ogDescription || pageDescription.value),
  ogImage: computed(() => content.value?.ogImage || '/images/og-image-default.jpg'),
  twitterCard: computed(() => content.value?.twitterCard || 'summary_large_image'),
  robots: computed(() => {
    // Don't index 404 pages
    if (isNotFoundError.value) {
      return 'noindex, nofollow';
    }
    return content.value?.robots || 'index, follow';
  })
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
  background: #FAFAFA;
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
  0%, 100% {
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

  :deep(ul), :deep(ol) {
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
