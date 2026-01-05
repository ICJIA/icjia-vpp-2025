/**
 * @module PageTitleSection
 * @fileoverview Vue component: PageTitleSection
 */

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
