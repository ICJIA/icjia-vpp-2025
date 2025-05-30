<script setup lang="ts">
/**
 * Sandbox TOC Page - CSS-Based Sticky Table of Contents
 *
 * This page demonstrates a CSS-based sticky table of contents (TOC) that:
 * - Uses pure CSS sticky positioning instead of JavaScript
 * - Matches the catch-all page ([...slug].vue) architecture
 * - Displays only H2 headings from content
 * - Provides smooth scrolling to sections with 80px header offset
 * - Uses CSS Grid layout for proper content flow
 * - Ensures WCAG 2.1 AA accessibility compliance
 * - Implements proper keyboard navigation
 * - Solves footer overlap using CSS layout techniques
 */

import { ref, computed, onMounted, nextTick } from "vue";
import { useScroll, useEventListener, useThrottleFn } from "@vueuse/core";

/**
 * Fetch content data from the about page
 */
const { data: about } = await useAsyncData(() =>
  queryCollection("content").path("/about").first()
);

/**
 * Reactive references for TOC functionality
 */
const activeSection = ref("");

/**
 * Scroll tracking using VueUse for active section detection
 */
const { y: scrollY } = useScroll(typeof window !== "undefined" ? window : null);

/**
 * Computed property to filter TOC items to only H2 headings (depth 2)
 *
 * @returns {Array} Array of H2 heading objects with id, text, and anchor properties
 */
const h2Headings = computed(() => {
  if (!about.value?.body?.toc?.links) return [];

  return about.value.body.toc.links.filter((item) => item.depth === 2);
});

/**
 * Scroll to a specific section with smooth behavior and header offset
 *
 * @param {string} sectionId - The ID of the section to scroll to
 * @param {Event} event - The click event (for preventing default behavior)
 */
const scrollToSection = (sectionId: string, event: Event) => {
  event.preventDefault();

  const element = document.getElementById(sectionId);
  if (!element) return;

  // Calculate position with 80px offset for sticky header
  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition - 80;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  window.scrollTo({
    top: offsetPosition,
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
  });

  // Update active section
  activeSection.value = sectionId;

  // Update URL hash without triggering scroll
  history.replaceState(null, "", `#${sectionId}`);
};

/**
 * Handle keyboard navigation for TOC links
 *
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} sectionId - The ID of the section
 */
const handleKeydown = (event: KeyboardEvent, sectionId: string) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    scrollToSection(sectionId, event);
  }
};

/**
 * Track active section based on scroll position
 */
const trackActiveSection = useThrottleFn(() => {
  if (!h2Headings.value.length) return;

  const scrollPosition = scrollY.value + 100; // Account for header offset
  let currentSection = "";

  // Find the section that's currently in view
  for (const heading of h2Headings.value) {
    const element = document.getElementById(heading.id);
    if (element && element.offsetTop <= scrollPosition) {
      currentSection = heading.id;
    }
  }

  activeSection.value = currentSection;
}, 100);

/**
 * Initialize active section tracking
 */
onMounted(async () => {
  await nextTick(); // Ensure DOM is ready

  // Set up scroll listener for active section tracking
  useEventListener(window, "scroll", trackActiveSection, { passive: true });

  // Initial active section calculation
  trackActiveSection();
});

/**
 * Set up page metadata for accessibility and SEO
 */
useHead({
  title: "Sandbox TOC - Violence Prevention Plan for Illinois: 2025-2029",
  htmlAttrs: {
    lang: "en",
  },
});
</script>

<template>
  <!-- CSS-Based Layout Matching Catch-All Page Architecture -->
  <div class="dynamic-content-page">
    <!-- Main content section -->
    <div class="page-content">
      <div class="container">
        <!-- Content Grid: Main content + Sticky TOC -->
        <div class="content-grid">
          <!-- Main Content Area -->
          <main class="content-main">
            <div class="content-renderer">
              <ContentRenderer v-if="about" :value="about" />
              <div v-else class="error-message">
                <p>About content not found</p>
              </div>
            </div>

            <!-- Debug information at bottom of content -->
            <div v-if="about" class="debug-section">
              <div class="debug-info">
                <details>
                  <summary>Debug: TOC Data Structure</summary>
                  <pre>{{ JSON.stringify(h2Headings, null, 2) }}</pre>
                </details>
              </div>
            </div>
          </main>

          <!-- Sticky TOC Sidebar -->
          <aside
            v-if="h2Headings.length > 0"
            class="toc-sidebar"
            role="navigation"
            aria-label="Table of Contents"
          >
            <div class="toc-sticky-container">
              <div class="toc-card">
                <nav class="toc-nav">
                  <div class="toc-header">
                    <h2 class="toc-title">
                      <v-icon icon="mdi-format-list-bulleted" class="toc-title-icon" />
                      Table of Contents
                    </h2>
                  </div>
                  <ul class="toc-list" role="list">
                    <li
                      v-for="heading in h2Headings"
                      :key="heading.id"
                      class="toc-item"
                      role="listitem"
                    >
                      <a
                        :href="`#${heading.id}`"
                        :class="[
                          'toc-link',
                          { 'toc-link--active': activeSection === heading.id },
                        ]"
                        :aria-current="
                          activeSection === heading.id ? 'location' : undefined
                        "
                        @click="scrollToSection(heading.id, $event)"
                        @keydown="handleKeydown($event, heading.id)"
                        tabindex="0"
                      >
                        <span class="toc-link-text">{{ heading.text }}</span>
                        <v-icon
                          v-if="activeSection === heading.id"
                          icon="mdi-chevron-right"
                          class="toc-active-indicator"
                          size="small"
                        />
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
 * CSS-Based Sticky TOC Layout - Matching Catch-All Page Architecture
 *
 * This implementation uses pure CSS sticky positioning instead of JavaScript
 * to create a robust, performant TOC that integrates seamlessly with the
 * catch-all page layout patterns. Solves footer overlap using CSS layout
 * techniques and maintains all accessibility features.
 */

/* Page structure matching catch-all page ([...slug].vue) */
.dynamic-content-page {
  min-height: 100vh;
  padding-top: 60px; /* Account for sticky header */
  overflow-x: hidden;
  /* Soft light theme background to reduce eye strain */
  background: #fafafa;
  /* Ensure proper positioning context for sticky elements */
  position: relative;
}

/* Dark theme background override */
:root[data-theme="dark"] .dynamic-content-page {
  background: rgb(var(--v-theme-surface));
}

/* Container styling matching catch-all page */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  /* Ensure container doesn't interfere with sticky positioning */
  position: relative;
}

/* Main content spacing matching catch-all page */
.page-content {
  padding: 4.5rem 0; /* Consistent with other pages */
  /* Ensure sufficient height for sticky behavior */
  min-height: 100vh;
}

/**
 * Content Layout - Flexbox for TOC Integration
 *
 * Creates a responsive flexbox layout where:
 * - Main content takes available space (flex: 1)
 * - TOC sidebar has fixed width (320px) on desktop
 * - Better compatibility with sticky positioning
 */
.content-grid {
  display: flex;
  gap: 3rem; /* Space between content and TOC */
  align-items: flex-start; /* Align items to top */
}

/* Main content area */
.content-main {
  flex: 1; /* Take available space in flexbox */
  min-width: 0; /* Prevent flex overflow */
  /* Add extra height for testing scroll behavior - ensure scrolling is possible */
  min-height: 150vh; /* Sufficient height to test sticky behavior */


}

/**
 * TOC Sidebar - CSS Sticky Positioning Implementation
 *
 * Uses pure CSS sticky positioning to create a TOC that:
 * - Sticks to the top when scrolling
 * - Automatically handles footer overlap through CSS layout
 * - Maintains proper responsive behavior
 * - Integrates seamlessly with page flow
 */
.toc-sidebar {
  /* Fixed width for desktop */
  width: 320px;
  flex-shrink: 0; /* Don't shrink in flexbox */
  /* DIRECT STICKY POSITIONING - Apply sticky directly to sidebar */
  position: -webkit-sticky; /* Safari support */
  position: sticky;
  top: 80px; /* Account for 80px header */
  height: fit-content; /* Only take space needed */
  max-height: calc(100vh - 100px); /* Prevent overflow beyond viewport */
  overflow-y: auto; /* Allow scrolling if TOC is too long */
  z-index: 10;


}

/* Container inside sticky sidebar */
.toc-sticky-container {
  /* Remove sticky positioning from container */
  position: static;
  height: 100%;
}

/* TOC Card - Modern design matching site patterns */
.toc-card {
  /* Modern card-style design matching site patterns */
  background: #ffffff;
  border-radius: 1rem; /* Modern border radius matching card components */
  border: 1px solid rgba(0, 0, 0, 0.05);

  /* Enhanced elevation effects matching HomeGoalCard and HomePrincipleCard */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 10px 15px -3px rgba(0, 0, 0, 0.05);

  /* Smooth transitions for interactions */
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  /* Ensure proper overflow handling */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%; /* Fill the sticky container */
}

/* Enhanced hover effect for modern interaction */
.toc-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Dark theme adjustments */
:root[data-theme="dark"] .toc-card {
  background: rgb(var(--v-theme-surface-variant));
  border-color: rgba(255, 255, 255, 0.1);
}

.error-message {
  padding: 2rem;
  text-align: center;
  color: var(--v-error-base, #d32f2f);
  background-color: var(--v-error-lighten5, #ffebee);
  border-radius: 12px; /* Modern border radius */
  border: 1px solid var(--v-error-lighten3, #ef9a9a);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.toc-nav {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/**
 * Modern TOC Header Design
 *
 * Implements sophisticated header styling with gradient background,
 * refined typography, and professional visual hierarchy.
 */
.toc-header {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary-darken-1, var(--v-theme-primary))) 100%
  );
  border-radius: 1rem 1rem 0 0; /* Rounded top corners only */
  padding: 1.5rem 2rem;
  margin: 0;
  position: relative;
  overflow: hidden;
}

/* Subtle pattern overlay for header depth */
.toc-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.toc-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.toc-title-icon {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/**
 * Modern TOC List Design
 *
 * Implements clean list styling with proper spacing and visual hierarchy.
 */
.toc-list {
  list-style: none;
  margin: 0;
  padding: 1.5rem 0 1rem 0;
  flex: 1;
}

.toc-item {
  margin-bottom: 0.25rem; /* Reduced spacing for cleaner appearance */
}

/**
 * Modern TOC Link Styles - Enhanced Design System Integration
 *
 * Implements sophisticated link styling with contemporary design elements,
 * enhanced hover states, and professional visual feedback. Maintains
 * WCAG 2.1 AA accessibility standards with improved user experience.
 */
.toc-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.75);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
  position: relative;
  margin: 0 1.5rem;

  /* Subtle background for better visual separation */
  background: rgba(0, 0, 0, 0.02);
}

.toc-link-text {
  flex: 1;
  transition: transform 0.2s ease;
}

.toc-active-indicator {
  color: rgb(var(--v-theme-primary));
  transition: transform 0.2s ease;
}

/* Enhanced hover states with modern micro-interactions */
.toc-link:hover {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.08) 0%,
    rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.12) 100%
  );
  color: rgb(var(--v-theme-primary-darken-2, var(--v-theme-primary)));
  transform: translateX(4px);
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.toc-link:hover .toc-link-text {
  transform: translateX(2px);
}

/* Enhanced focus states for accessibility */
.toc-link:focus {
  outline: none;
  border: 2px solid rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.1);
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.2);
}

/* Modern active state with gradient and enhanced styling */
.toc-link--active {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-primary-darken-1, var(--v-theme-primary))) 100%
  );
  color: #ffffff;
  font-weight: 600;
  border-left: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.3);
  transform: translateX(4px);
}

.toc-link--active:hover {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary-darken-1, var(--v-theme-primary))) 0%,
    rgb(var(--v-theme-primary-darken-2, var(--v-theme-primary))) 100%
  );
  color: #ffffff;
  transform: translateX(6px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.4);
}

.toc-link--active .toc-active-indicator {
  color: #ffffff;
  transform: scale(1.1);
}

/**
 * Debug Section - Relocated to Bottom of Page
 *
 * Modern styling for development debugging section positioned at page bottom
 * to avoid interfering with main content layout.
 */
.debug-section {
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 2rem 0;
  margin-top: 4rem;
}

.debug-info {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.debug-info details {
  cursor: pointer;
}

.debug-info summary {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1rem;
  color: rgb(var(--v-theme-primary));
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.05);
  transition: background-color 0.2s ease;
}

.debug-info summary:hover {
  background: rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.1);
}

.debug-info pre {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-family: "Fira Code", "Monaco", "Consolas", "Ubuntu Mono", monospace;
  line-height: 1.5;
}

/**
 * Responsive Design - CSS Grid Layout Adjustments
 *
 * Implements responsive layout adjustments that maintain design quality
 * across all screen sizes while preserving the CSS sticky positioning.
 */
@media (max-width: 959px) {
  /* Switch to single column layout on mobile */
  .content-grid {
    flex-direction: column; /* Stack vertically on mobile */
    gap: 2rem;
  }

  .dynamic-content-page {
    padding-top: 50px; /* Smaller header offset on mobile */
  }

  .page-content {
    padding: 3rem 0; /* Responsive spacing - reduced from 4.5rem for mobile */
  }

  .content-main {
    min-height: auto; /* Reset forced height on mobile */
  }

  /* TOC becomes a normal block element on mobile */
  .toc-sidebar {
    order: -1; /* Show TOC before content on mobile */
    width: 100%; /* Full width on mobile */
    position: static; /* Disable sticky positioning on mobile */
    height: auto;
    max-height: none;
    overflow-y: visible;
  }



  .toc-card {
    height: auto; /* Allow natural height on mobile */
  }

  .toc-header {
    padding: 1.25rem 1.5rem;
  }

  .toc-title {
    font-size: 1rem;
  }

  .toc-link {
    padding: 0.875rem 1.5rem;
    margin: 0 1rem;
    font-size: 0.85rem;
  }

  .toc-list {
    padding: 1.25rem 0 1rem 0;
  }
}

@media (max-width: 599px) {
  .container {
    padding: 0 1rem;
  }

  .content-grid {
    gap: 1.5rem;
  }

  .toc-header {
    padding: 1rem 1.25rem;
  }

  .toc-title {
    font-size: 0.9rem;
    gap: 0.5rem;
  }

  .toc-link {
    padding: 0.75rem 1.25rem;
    margin: 0 0.75rem;
    font-size: 0.8rem;
  }

  .debug-section {
    padding: 1.5rem 0;
    margin-top: 2rem;
  }

  .debug-info {
    padding: 1rem;
    margin: 0 1rem;
  }
}

/**
 * Reduced Motion Support - Enhanced Accessibility
 *
 * Respects user preference for reduced motion by disabling
 * all transitions and animations when requested.
 */
@media (prefers-reduced-motion: reduce) {
  .toc-card,
  .toc-link,
  .toc-link-text,
  .toc-active-indicator {
    transition: none !important;
    animation: none !important;
  }

  .toc-card:hover {
    transform: none !important;
  }

  .toc-link:hover,
  .toc-link--active:hover {
    transform: none !important;
  }

  .toc-link:hover .toc-link-text {
    transform: none !important;
  }

  .toc-link--active .toc-active-indicator {
    transform: none !important;
  }
}

/**
 * Dark Theme Support - Enhanced Design System Integration
 *
 * Provides comprehensive dark theme styling with proper contrast ratios,
 * enhanced visual hierarchy, and consistent design patterns.
 */
:root[data-theme="dark"] .toc-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6),
    0 4px 6px -1px rgba(0, 0, 0, 0.5);
}

:root[data-theme="dark"] .toc-link {
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.02);
}

:root[data-theme="dark"] .toc-link:hover {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.15) 0%,
    rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.25) 100%
  );
  color: rgba(255, 255, 255, 0.95);
  border-left: 3px solid rgb(var(--v-theme-primary-lighten-1, var(--v-theme-primary)));
}

:root[data-theme="dark"] .toc-link:focus {
  background: rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.2);
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.3);
}

:root[data-theme="dark"] .error-message {
  background-color: #b71c1c;
  color: #ffffff;
  border-color: #c62828;
}

:root[data-theme="dark"] .debug-section {
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:root[data-theme="dark"] .debug-info {
  background: #2a3441;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
}

:root[data-theme="dark"] .debug-info summary {
  background: rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.1);
}

:root[data-theme="dark"] .debug-info summary:hover {
  background: rgba(var(--v-theme-primary-rgb, 25, 118, 210), 0.2);
}

:root[data-theme="dark"] .debug-info pre {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

/**
 * Focus Styles for Accessibility - Matching Site Patterns
 *
 * Ensures proper focus indicators for keyboard navigation
 * that match the site's accessibility standards.
 */
:deep(*:focus-visible) {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}
</style>
