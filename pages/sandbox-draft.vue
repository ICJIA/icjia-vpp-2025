<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0 ma-0">
        <!-- Title Header Row - This row will be monitored for visibility -->
        <v-row ref="titleRow">
          <v-col>
            <div
              style="
                height: 200px;
                background: #1976d2;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <h1>This is the title</h1>
            </div>
          </v-col>
        </v-row>

        <!-- Main Content and Sidebar Layout -->
        <v-row no-gutters>
          <!-- Main Content Column (8/12 width on medium+ screens) -->
          <v-col cols="12" md="8" class="main-content-col">
            <div class="pa-4">
              <h1>Main Scrollable Content</h1>
              <!-- Generate multiple paragraphs to create scrollable content -->
              <p v-for="i in 70" :key="'main-p-' + i" class="mb-4">
                <strong>Paragraph {{ i }}</strong
                ><br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus
                non enim praesent elementum facilisis leo vel. Sit amet consectetur
                adipiscing elit duis tristique. Ullamcorper dignissim cras tincidunt
                lobortis feugiat vivamus at augue. Posuere sollicitudin aliquam ultrices
                sagittis orci a scelerisque. Eget felis eget nunc lobortis mattis aliquam
                faucibus purus. Tellus orci ac auctor augue mauris augue neque gravida.
                Amet nisl purus in mollis nunc sed id semper. Vitae justo eget magna
                fermentum iaculis eu non diam. Turpis egestas integer eget aliquet nibh
                praesent. Faucibus pulvinar elementum integer enim neque volutpat ac
                tincidunt. Et malesuada fames ac turpis egestas maecenas pharetra. Id
                aliquet lectus proin nibh nisl condimentum id. Nunc lobortis mattis
                aliquam faucibus purus in massa tempor nec. Sed velit dignissim sodales ut
                eu sem integer vitae.
              </p>
            </div>
          </v-col>

          <!-- Sidebar Column (4/12 width on medium+ screens) -->
          <v-col cols="12" md="4" class="sidebar-col" ref="sidebarCol">
            <div class="sidebar-wrapper pa-4">
              <!-- 
                The actual sidebar content element that becomes fixed
                - ref="stickyElement": Used to measure dimensions and apply fixed positioning
                - :class="{ 'is-fixed': isFixed }": Applies fixed styling when positioned
                - :style="fixedStyles": Applies computed fixed positioning styles
              -->
              <div
                ref="stickyElement"
                class="sidebar-content"
                :class="{ 'is-fixed': isFixed }"
                :style="fixedStyles"
              >
                <!-- Sidebar Header with Dynamic Status -->
                <h2>{{ isFixed ? "Fixed" : "Normal" }} Sidebar</h2>
                <p>
                  This sidebar becomes fixed when the title disappears behind the navbar.
                </p>

                <!-- Status Information -->
                <p><strong>Status:</strong> {{ isFixed ? "FIXED" : "NORMAL" }}</p>
                <p><strong>Scroll:</strong> {{ scrollY }}px</p>

                <!-- Interactive Elements -->
                <v-btn block color="primary" class="mt-2">Button 1</v-btn>
                <v-btn block color="secondary" class="mt-2">Button 2</v-btn>

                <!-- Additional Content -->
                <p class="mt-3">This content is part of the sidebar element.</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

/**
 * =============================================================================
 * REACTIVE STATE VARIABLES
 * =============================================================================
 */

// Current scroll position of the window (used for display and calculations)
const scrollY = ref(0);

// Whether the sidebar is currently in fixed position mode
const isFixed = ref(false);

// Position of the title row's bottom edge relative to viewport
const titleBottom = ref(0);

/**
 * =============================================================================
 * TEMPLATE REFS (DOM ELEMENT REFERENCES)
 * =============================================================================
 */

// Reference to the sidebar content element (the actual fixed element)
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
// The sidebar becomes fixed when the title disappears behind this navbar
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
  } catch (error) {
    // Gracefully handle any DOM-related errors during development
    console.warn("Error updating scroll position:", error);
  }
};

/**
 * Monitors the title row visibility and determines when to activate fixed positioning
 * The sidebar becomes fixed when the title row disappears behind the navbar
 */
const updateTitleVisibility = () => {
  // Handle both direct DOM elements and Vue component instances
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
  // Get reference to the sidebar content element
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
</script>

<style>
/**
 * =============================================================================
 * BASE BROWSER AND APP STYLES
 * =============================================================================
 */

/* Ensure proper scrolling behavior */
html {
  overflow-y: auto;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

/* Override Vuetify's default overflow settings that can interfere with fixed positioning */
#app {
  overflow: visible !important;
}

.v-main__wrap {
  overflow: visible !important;
}

/**
 * =============================================================================
 * LAYOUT COLUMN STYLES
 * =============================================================================
 */

/* Main content area styling */
.main-content-col {
  background-color: #f0f0f0;
}

/* Sidebar column styling */
.sidebar-col {
  background-color: #e0e0e0;
}

/* Sidebar wrapper for flex layout */
.sidebar-wrapper {
  display: flex;
  flex-direction: column;
}

/**
 * =============================================================================
 * SIDEBAR CONTENT STYLES
 * =============================================================================
 */

/* Base styles for the sidebar content (both normal and fixed states) */
.sidebar-content {
  background-color: #fff9c4;
  padding: 16px;
  border: 1px solid #fbc02d;
  width: 100%;
  box-sizing: border-box; /* Include padding and border in width calculations */
  border-radius: 4px;
  transition: box-shadow 0.3s ease; /* Smooth shadow transitions */

  /* Prevent unexpected sizing issues */
  min-width: 0;
  max-width: 100%;
}

/* Hover effect for interactive feedback */
.sidebar-content:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Enhanced styling when in fixed position mode */
.sidebar-content.is-fixed {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); /* Stronger shadow for elevation */
  border-color: #f57f17; /* Slightly different border color */
  background-color: #fffde7; /* Slightly different background */

  /* Ensure consistent sizing in fixed state */
  box-sizing: border-box;
}
</style>
