/**
 * @module HomeGoalCard
 * @fileoverview Vue component: HomeGoalCard
 */

/**
 * Home Goal Card Component - Interactive Navigation
 *
 * Displays individual strategic goals as clickable cards that navigate to
 * the goals and recommendations page.
 *
 * Features:
 * - CSS Grid-based layout for optimal content organization
 * - Larger icons (size 64) for better visual impact
 * - Responsive design with consistent minimum heights and equal card heights
 * - Interactive hover effects and click navigation
 * - Enhanced accessibility with proper ARIA attributes
 * - Smooth animations with reduced motion support
 * - Full theme compatibility (light/dark)
 * - Enhanced background contrast for better visual separation from section backgrounds
 * - WCAG 2.1 AA compliance with enhanced text contrast
 * - Goal number badges for clear identification
 *
 * Technical Implementation:
 * - Uses NuxtLink for client-side navigation
 * - CSS Grid with flexible layout for optimal content alignment
 * - Deep selectors override Vuetify card defaults
 * - Enhanced text contrast for optimal readability in both themes
 * - Balanced styling matching HomeAction cards for consistent visual hierarchy
 * - Hover effects that preserve background colors in both themes
 *
 * @component
 */
import { computed, inject } from "vue";

/**
 * Get the announce function from the provider for screen reader announcements
 */
const announce = inject("announce", null);

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {Object} goal - The goal object containing title, description, etc.
 * @property {number} [delay=0] - Animation delay in milliseconds
 */
const props = defineProps({
  goal: {
    type: Object,
    required: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
});

/**
 * Generate unique ID for accessibility using goal title for consistency
 * This ensures the same ID is generated on both server and client
 */
const uniqueId = computed(() => {
  // Create a deterministic ID based on the goal title
  return props.goal.title
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
