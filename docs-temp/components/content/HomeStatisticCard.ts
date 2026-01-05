/**
 * @module HomeStatisticCard
 * @fileoverview Vue component: HomeStatisticCard
 */

/**
 * Home Statistic Card Component - Compact Infographic-Style Display
 *
 * Displays individual statistics as compact, infographic-style cards optimized for data presentation.
 * Features reduced white space, larger icons, prominent typography, and enhanced background contrast
 * for impactful visual communication and professional card-like appearance.
 *
 * Features:
 * - Compact infographic-style layout with optimized spacing
 * - Larger icons (80px) and prominent typography for visual impact
 * - Reduced card height and padding for efficient space usage
 * - Enhanced background contrast (white/light surface) for visual separation
 * - Enhanced accessibility with proper ARIA attributes
 * - Smooth entrance animations with reduced motion support
 * - Full theme compatibility (light/dark)
 * - WCAG 2.1 AA compliance
 * - Static display without interactive affordances
 *
 * @component
 */
import { computed } from "vue";

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {string} title - The title of the statistic card
 * @property {string} description - The description text for the statistic
 * @property {string} icon - Material Design icon name
 * @property {string} [color='primary'] - Vuetify color theme
 * @property {number} [delay=0] - Animation delay in milliseconds
 */
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "primary",
  },
  delay: {
    type: Number,
    default: 0,
  },
});

/**
 * Generate unique ID for accessibility using statistic title for consistency
 * This ensures the same ID is generated on both server and client
 */
const uniqueId = computed(() => {
  // Create a deterministic ID based on the statistic title
  return props.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
});

/**
 * Animation style with delay
 */
const animationStyle = computed(() => ({
  animationDelay: `${props.delay}ms`,
}));
