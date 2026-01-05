/**
 * @module FeatureCard
 * @fileoverview Vue component: FeatureCard
 */

/**
 * Accessible feature card component with animation and keyboard support
 *
 * This component displays a feature with an icon, title, and description.
 * It includes:
 * - Keyboard navigation support (Enter/Space activation)
 * - Screen reader announcements
 * - Proper ARIA attributes for accessibility
 * - Animation with configurable delay
 * - Focus styles matching hover effects
 *
 * @component
 */
import { computed, ref, inject, useId } from "vue";

/**
 * Get the announce function from the provider for screen reader announcements
 */
const announce = inject("announce", null);

/**
 * Component props
 */
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
});

/**
 * Generate SSR-safe unique ID for ARIA attributes
 * Uses Vue's useId() composable to ensure consistent IDs across server and client
 */
const uniqueId = useId();

/**
 * Computed style for animation delay based on the delay prop
 * Allows for staggered animations when multiple cards are displayed
 *
 * @returns {Object} CSS style object with animation delay
 */
const animationStyle = computed(() => ({
  animationDelay: `${props.delay}s`,
}));

/**
 * Handle keyboard activation (Enter/Space)
 * Provides keyboard accessibility for interactive card
 * Announces selection to screen readers
 */
const handleCardActivation = () => {
  // This would typically navigate to a feature detail page or show more information
  console.log("Feature card activated");

  // Announce to screen readers for accessibility
  if (announce) {
    announce("Feature card selected");
  }
};
