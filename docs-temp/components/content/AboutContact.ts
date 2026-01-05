/**
 * @module AboutContact
 * @fileoverview Vue component: AboutContact
 */

/**
 * AboutContact component for the About page
 *
 * This component displays the contact section with:
 * - Call-to-action heading and description
 * - Accessible contact button with keyboard navigation
 * - Screen reader announcements for interactions
 * - Proper ARIA labels and focus management
 *
 * @component
 */
import { inject } from "vue";

/**
 * Get the announce function from the provider for screen reader announcements
 */
const announce = inject("announce", null);

/**
 * Handle contact button click or keyboard activation
 * Announces action to screen readers and would typically open a contact form
 */
const handleContactClick = () => {
  console.log("Contact button clicked");

  // Announce to screen readers with assertive priority for immediate feedback
  if (announce) {
    announce("Contact form will open shortly", "assertive");
  }

  // This would typically open a contact form or navigate to a contact page
};
