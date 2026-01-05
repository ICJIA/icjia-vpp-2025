/**
 * @module NewsCard
 * @fileoverview Vue component: NewsCard
 */

/**
 * News Card Component - Horizontal Layout
 *
 * Displays individual news items with horizontal layout featuring image thumbnail
 * on the left and content on the right. Follows project card design patterns
 * with full accessibility compliance and theme support.
 *
 * Features:
 * - Horizontal layout with image thumbnail and content
 * - Illinois State seal fallback for items without images
 * - Card-level click navigation to full article
 * - Proper date formatting following project conventions
 * - Enhanced accessibility with ARIA attributes
 * - Smooth animations with reduced motion support
 * - Professional hover and focus effects
 * - Enhanced visual contrast with distinct card backgrounds
 * - Full theme compatibility (light/dark)
 * - WCAG 2.1 AA compliance
 *
 * @component
 */
import { computed, ref, useId } from "vue";
import { useRouter } from "vue-router";
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {Object} newsItem - The news item object with title, summary, date, etc.
 * @property {number} [delay=0] - Animation delay in milliseconds
 */
const props = defineProps({
  newsItem: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value.title && value.summary && value.date;
    },
  },
  delay: {
    type: Number,
    default: 0,
  },
});

const router = useRouter();

/**
 * Generate SSR-safe unique ID for ARIA attributes
 * Uses Vue's useId() composable to ensure consistent IDs across server and client
 */
const uniqueId = useId();

/**
 * Computed style for animation delay
 */
const animationStyle = computed(() => ({
  animationDelay: `${props.delay}ms`,
}));

/**
 * Format date for display
 * Converts YYYY-MM-DD to Month DD, YYYY format
 */
const formattedDate = computed(() => {
  if (!props.newsItem.date) return "";

  try {
    const date = new Date(props.newsItem.date);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.warn("Invalid date format:", props.newsItem.date);
    return props.newsItem.date;
  }
});

/**
 * Handle card click navigation
 * Navigates to the full news article
 */
const handleCardClick = () => {
  if (props.newsItem._path) {
    router.push(props.newsItem._path);
  } else {
    // Fallback: construct path from filename or slug
    const slug =
      props.newsItem._file?.replace(".md", "") ||
      props.newsItem.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (slug) {
      router.push(`/news/${slug}`);
    }
  }
};
