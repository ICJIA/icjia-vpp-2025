/**
 * @module AboutValues
 * @fileoverview Vue component: AboutValues
 */

/**
 * AboutValues component for the About page
 *
 * This component displays the core values section with:
 * - Interactive value cards with keyboard navigation
 * - Proper ARIA labels and accessibility attributes
 * - Responsive grid layout
 * - Screen reader announcements for interactions
 *
 * @component
 */
import { inject } from "vue";

/**
 * Get the announce function from the provider for screen reader announcements
 */
const announce = inject("announce", null);

/**
 * Handle value card activation via keyboard or click
 * Announces selection to screen readers for accessibility
 *
 * @param {string} title - The title of the value
 */
const handleValueCardActivation = (title) => {
  console.log(`Value card activated: ${title}`);

  // Announce to screen readers for accessibility
  if (announce) {
    announce(`Selected value: ${title}`);
  }
};
