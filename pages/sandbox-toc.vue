<template>
  <div>
    <!-- Page Title Section -->
    <PageTitleSection
      :title="about?.title || 'TOC Layout Test'"
      :description="
        about?.description || 'Testing Table of Contents layout with visual indicators'
      "
      :show-border="true"
      :toc-visible="showTOC"
    />

    <!-- Main content layout with responsive TOC -->
    <v-container>
      <v-row>
        <!-- Main content area -->
        <v-col
          :cols="contentColumnWidth.cols"
          :sm="contentColumnWidth.sm"
          :md="contentColumnWidth.md"
          :lg="contentColumnWidth.lg"
          :xl="contentColumnWidth.xl"
        >
          <ContentRenderer v-if="about" :value="about" />
          <div v-else>About not found</div>
        </v-col>

        <!-- TOC Sidebar -->
        <v-col v-if="showTOC && about" cols="12" sm="12" md="4" lg="3" xl="3">
          <div
            ref="tocContainer"
            class="toc-fixed-container"
            :style="{ top: `${tocTopOffset}px` }"
          >
            <v-card elevation="0" class="toc-card">
              <v-card-title
                class="text-subtitle-1 pb-2 px-3 pt-3 toc-title-clickable"
                @click="scrollToTop"
                role="button"
                tabindex="0"
                @keydown.enter="scrollToTop"
                @keydown.space.prevent="scrollToTop"
                aria-label="Scroll to top of page"
              >
                Table of Contents
              </v-card-title>
              <v-card-text class="pt-0 px-0 pb-3">
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
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Toggle for testing TOC visibility -->
    <v-container>
      <v-row>
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
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Fetch content from Nuxt Content v3 system
const { data: about } = await useAsyncData(() =>
  queryCollection("content").path("/about").first()
);

// Reactive state for TOC visibility (initialize to true for testing)
const showTOC = ref(true);

// Reactive state for active TOC item
const activeItemId = ref("");

// Reactive state for TOC positioning
const tocTopOffset = ref(80); // Fixed offset from top
const tocContainer = ref(null);

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
 * Calculate the top offset for TOC positioning
 * Simple fixed positioning approach
 */
const calculateTocOffset = () => {
  // Fixed offset: 60px header + 20px buffer = 80px total
  tocTopOffset.value = 80;
};

// Set up scroll listener for active section detection
onMounted(() => {
  // Calculate initial TOC offset
  nextTick(() => {
    calculateTocOffset();
  });

  // Initial active section detection
  updateActiveSection();

  // Throttled scroll listener for performance
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  };

  // Resize listener to recalculate TOC offset
  const handleResize = () => {
    calculateTocOffset();
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });

  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
  });
});

/**
 * Compute responsive column widths for main content based on TOC toggle state
 * @returns {Object} Object with responsive column widths
 */
const contentColumnWidth = computed(() => {
  const hasTOC = showTOC.value; // Use showTOC for layout, not shouldShowTOC
  return {
    cols: 12, // Always full width on mobile
    sm: 12, // Always full width on small screens
    md: hasTOC ? 8 : 12, // 8 cols when TOC enabled, 12 when disabled on tablet
    lg: hasTOC ? 9 : 12, // 9 cols when TOC enabled, 12 when disabled on desktop
    xl: hasTOC ? 9 : 12, // 9 cols when TOC enabled, 12 when disabled on large desktop
  };
});

// Set page title
useHead({
  title: "TOC Layout Test - Violence Prevention Plan",
});
</script>

<style scoped>
/* TOC Card Styling - Sleek, blended appearance */
.toc-card {
  background-color: transparent !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  border-radius: 8px !important;
}

.v-theme--dark .toc-card {
  border-color: rgba(255, 255, 255, 0.08) !important;
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
  position: fixed;
  height: fit-content;
  z-index: 10;
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

/* Visual Indicator Dots */
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
  top: 50%;
  transform: translateY(-50%);
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
  transform: translateY(-50%) scale(1.2);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

.toc-item:hover .toc-indicator-dot {
  background-color: rgba(var(--v-theme-primary), 0.6);
  transform: scale(1.1);
}

.toc-item:hover .toc-indicator-dot--active {
  transform: scale(1.3);
}

/* TOC Link Text Styling */
.toc-link {
  color: rgba(var(--v-theme-on-surface), 0.87) !important;
  font-weight: 400 !important;
  line-height: 1.4 !important;
  transition: all 0.3s ease-in-out;
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
</style>
