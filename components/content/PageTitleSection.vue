<template>
  <section class="page-title-section" :class="{ 'with-border': showBorder }">
    <div class="title-content">
      <h1 class="main-page-title">
        <slot name="title">{{ title }}</slot>
      </h1>

      <!-- Date display section - positioned between title and description -->
      <div v-if="showDate && date" class="page-date-section">
        <div class="page-date-chip">
          <v-icon
            icon="mdi-calendar"
            size="small"
            class="date-icon"
            aria-hidden="true"
          />
          <time :datetime="date" class="date-text">{{ formattedDate }}</time>
        </div>
      </div>

      <div v-if="$slots.description || description" class="page-description">
        <slot name="description">
          <p>{{ description }}</p>
        </slot>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * PageTitleSection Component - Reusable Page Title System
 *
 * A standardized, reusable component for creating consistent page titles across
 * the entire project. Provides infographic-style typography with professional
 * animations and full accessibility compliance.
 *
 * Features:
 * - Infographic-style large typography (5rem base font size)
 * - Professional fade-in animations with staggered timing
 * - Full responsive design with proportional scaling
 * - Light/dark theme compatibility
 * - Optional subtitle/description support
 * - Optional date display for news articles and time-sensitive content
 * - Optional border separator
 * - WCAG 2.1 AA accessibility compliance
 * - Consistent margins, padding, and spacing
 * - Reusable across all project pages
 *
 * Usage Examples:
 *
 * Basic usage with props:
 * <PageTitleSection
 *   title="Page Title"
 *   description="Page description text"
 *   :show-border="true"
 * />
 *
 * With date display for news articles:
 * <PageTitleSection
 *   title="News Article Title"
 *   description="Article summary"
 *   :show-date="true"
 *   date="2025-01-27"
 *   :show-border="true"
 * />
 *
 * Advanced usage with slots:
 * <PageTitleSection :show-border="true">
 *   <template #title>Custom <strong>Title</strong> Content</template>
 *   <template #description>
 *     <p>Custom description with <em>formatting</em></p>
 *   </template>
 * </PageTitleSection>
 *
 * @component
 */

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {string} [title] - The main page title text (can be overridden by title slot)
 * @property {string} [description] - The page description text (can be overridden by description slot)
 * @property {boolean} [showBorder=false] - Whether to show the bottom border separator
 * @property {boolean} [showDate=false] - Whether to display the publication date
 * @property {string} [date] - The publication date in YYYY-MM-DD format
 */

import { computed } from "vue";

const props = defineProps({
  /**
   * Main page title text
   * Can be overridden using the title slot for custom formatting
   */
  title: {
    type: String,
    default: "",
  },

  /**
   * Page description/subtitle text
   * Can be overridden using the description slot for custom formatting
   */
  description: {
    type: String,
    default: "",
  },

  /**
   * Whether to show the subtle bottom border separator
   * Useful for pages that need visual separation between title and content
   */
  showBorder: {
    type: Boolean,
    default: false,
  },

  /**
   * Whether to display the publication date
   * When true and date is provided, shows formatted date between title and description
   */
  showDate: {
    type: Boolean,
    default: false,
  },

  /**
   * Publication date in YYYY-MM-DD format
   * Used when showDate is true to display formatted date
   */
  date: {
    type: String,
    default: "",
    validator: (value) => {
      // Allow empty string or valid date format
      if (!value) return true;
      // Check for YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) return false;
      // Check if it's a valid date
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
  },
});

/**
 * Format date for display
 * Converts YYYY-MM-DD to Month DD, YYYY format (consistent with NewsCard)
 */
const formattedDate = computed(() => {
  if (!props.date) return "";

  try {
    const date = new Date(props.date);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.warn("Invalid date format:", props.date);
    return props.date;
  }
});

// Note: Column width management is now handled by the parent component
// since PageTitleSection is placed inside a v-col in the parent layout
</script>

<style scoped>
/**
 * PageTitleSection Styling - Infographic-Style Design System
 * 
 * Implements a modern, professional page title system with:
 * - Large, impactful typography for infographic-style appearance
 * - Consistent spacing and layout patterns
 * - Professional animations with accessibility support
 * - Full responsive design with proportional scaling
 * - Light/dark theme compatibility
 * - WCAG 2.1 AA accessibility compliance
 */

/* Main page title section container */
.page-title-section {
  padding: 0; /* Remove default padding, will be handled by flexbox centering */
  /* Darker background for better distinction from content */
  background: #eeeeee; /* Darker than previous #F5F5F5 for better contrast */
  /* Extend background to reach navigation */
  margin-top: -60px; /* Account for header height */
  /* Center content vertically and horizontally */
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(25vh + 60px); /* Reduced height for tighter layout */
}

/* Dark theme background override */
:root[data-theme="dark"] .page-title-section {
  /* Darker background for better distinction from content */
  background: #1b2530; /* Darker than previous #1E2A3A for better contrast */
}

/* Optional border separator for visual hierarchy */
.page-title-section.with-border {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

/* Title content wrapper for centering and max-width */
.title-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 1.5rem; /* Add vertical padding for content breathing room */
}

/* Infographic-style main page title */
.main-page-title {
  /* Large, impactful font size for infographic-style appearance */
  font-size: 5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: rgba(var(--v-theme-on-surface), 0.95);
  font-family: "Roboto", sans-serif;
  letter-spacing: -0.03em;
  /* Professional entrance animation */
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

/* Date display section - positioned between title and description */
.page-date-section {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  /* Staggered animation between title and description */
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.3s;
}

.page-date-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 0.3s ease;
}

.date-icon {
  color: rgba(255, 255, 255, 0.95);
  opacity: 1;
}

.date-text {
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
}

/* Dark theme adjustments for date chip */
:root[data-theme="dark"] .page-date-chip {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:root[data-theme="dark"] .date-icon,
:root[data-theme="dark"] .date-text {
  color: rgba(255, 255, 255, 0.9);
}

/* Light theme adjustments for date chip */
:root[data-theme="light"] .page-date-chip {
  background: rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.15);
}

:root[data-theme="light"] .date-icon,
:root[data-theme="light"] .date-text {
  color: rgba(0, 0, 0, 0.85);
}

/* Page description styling */
.page-description {
  /* Staggered animation for professional appearance */
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s;
}

.page-description p {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(var(--v-theme-on-surface), 0.8);
  margin: 0;
  max-width: 800px;
  margin: 0 auto;
}

/* Responsive design with proportional scaling */
@media (max-width: 960px) {
  .main-page-title {
    font-size: 4rem; /* 80% of 5rem for tablet scaling */
  }
}

@media (max-width: 768px) {
  .page-title-section {
    min-height: calc(20vh + 60px); /* Smaller height on mobile */
  }

  .main-page-title {
    font-size: 3rem; /* 60% of 5rem for mobile scaling */
  }

  .page-description p {
    font-size: 1rem;
  }

  .title-content {
    padding: 1.5rem 1rem; /* Reduced vertical padding on mobile */
  }
}

@media (max-width: 600px) {
  .main-page-title {
    font-size: 2.25rem; /* 45% of 5rem for small mobile */
  }
}

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

/* Reduced motion support for accessibility */
@media (prefers-reduced-motion: reduce) {
  .main-page-title,
  .page-date-section,
  .page-description {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
}

/* Print styles */
@media print {
  .page-title-section {
    padding: 2rem 0 1rem;
    border-bottom: 1px solid #ccc;
  }

  .main-page-title,
  .page-date-section,
  .page-description {
    animation: none !important;
    opacity: 1;
    transform: none;
  }

  .page-date-chip {
    background: #f5f5f5 !important;
    color: #333 !important;
    border: 1px solid #ccc !important;
  }
}
</style>
