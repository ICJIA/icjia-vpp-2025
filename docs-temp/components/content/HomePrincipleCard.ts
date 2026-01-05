/**
 * @module HomePrincipleCard
 * @fileoverview Vue component: HomePrincipleCard
 */

/**
 * Principle Card Component - Static Display
 *
 * Displays individual guiding principles as static, non-interactive cards
 * for clean, presentational display.
 *
 * Features:
 * - CSS Grid-based layout for optimal content organization
 * - Larger icons (size 64) for better visual impact
 * - Responsive design with consistent minimum heights and equal card heights
 * - Static display with no interactive behaviors
 * - Enhanced accessibility with proper ARIA attributes
 * - Smooth animations with reduced motion support
 * - Full theme compatibility (light/dark)
 * - WCAG 2.1 AA compliance maintained
 *
 * Technical Implementation:
 * - Uses CSS Grid with fixed template areas for content organization
 * - Description section expands with 1fr to fill available space
 * - Deep selectors override Vuetify card defaults for perfect control
 * - Proper semantic HTML structure with ARIA attributes
 *
 * @component
 */
import { computed } from "vue";

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {Object} principle - The principle object containing title, description, etc.
 * @property {number} [delay=0] - Animation delay in milliseconds
 */
const props = defineProps({
  principle: {
    type: Object,
    required: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
});

/**
 * Generate unique ID for accessibility using principle title for consistency
 * This ensures the same ID is generated on both server and client
 */
const uniqueId = computed(() => {
  // Create a deterministic ID based on the principle title
  return props.principle.title
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
