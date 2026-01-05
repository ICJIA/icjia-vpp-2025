/**
 * @module HomeAction
 * @fileoverview Vue component: HomeAction
 */

/**
 * Home Action Section Component
 *
 * Final informational section providing multiple access methods to the Violence Prevention Plan and contact information.
 * Features infographic-style cards with large titles and compact design.
 *
 * Features:
 * - Download access to the complete plan
 * - Online reading with interactive navigation
 * - Contact information and support
 * - Infographic-style cards with large titles (3-card layout)
 * - Compact design with reduced spacing
 * - Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
 * - Animated entrance effects
 * - WCAG 2.1 AA accessibility compliance
 * - Full theme compatibility
 *
 * @component
 */

/**
 * Call-to-action options for user engagement
 * Provides download access, online reading, and contact information
 * Using muted, subtle colors for consistent design system
 *
 * @typedef {Object} CallToAction
 * @property {string} title - The title of the action card
 * @property {string} description - The description text for the action
 * @property {string} icon - Material Design icon name
 * @property {string} color - Vuetify color theme
 * @property {string} buttonText - Text displayed on the action button
 * @property {string} action - Internal action identifier
 * @property {string|null} [url] - Optional URL for navigation (local or external)
 */
const callToActions = [
  {
    title: "Download the Plan",
    description:
      "Access the complete Violence Prevention Plan with detailed goals, recommendations, and implementation strategies in multiple formats.",
    icon: "mdi-download",
    color: "primary",
    buttonText: "Download",
    action: "download-plan",
    url: "/download",
  },
  {
    title: "Read the Plan Online",
    description:
      "Browse the complete Violence Prevention Plan directly in your browser with interactive navigation and searchable content.",
    icon: "mdi-book-open-page-variant",
    color: "primary",
    buttonText: "Read Online",
    action: "read-online",
    url: "/plan/front-cover",
  },
  {
    title: "Contact Us",
    description:
      "Have questions about the Violence Prevention Plan? Need assistance with implementation? Get in touch with our team for support and guidance.",
    icon: "mdi-email",
    color: "primary",
    buttonText: "Contact",
    action: "contact-us",
    url: "/contact",
  },
];

/**
 * Handle action card click with URL navigation support
 *
 * Supports both local and external URL navigation:
 * - Local URLs (starting with '/' or relative paths): Use Nuxt's navigateTo()
 * - External URLs (starting with 'http://' or 'https://'): Open in new window
 * - No URL provided: Execute legacy action-based navigation
 *
 * @param {CallToAction} action - The action object containing navigation information
 * @returns {Promise<void>} Promise that resolves when navigation is complete
 * @throws {Error} When navigation fails
 *
 * @example
 * // Local navigation
 * handleActionClick({ action: 'view-plan', url: '/executive-summary' })
 *
 * // External navigation
 * handleActionClick({ action: 'external', url: 'https://example.com' })
 *
 * // Legacy action-based navigation
 * handleActionClick({ action: 'view-plan' })
 */
const handleActionClick = async (action) => {
  console.log("Action clicked:", action.action);

  // Handle URL-based navigation if URL is provided
  if (action.url) {
    try {
      // Check if it's an external URL
      if (
        action.url.startsWith("http://") ||
        action.url.startsWith("https://")
      ) {
        // External URL - open in new window with security attributes
        window.open(action.url, "_blank", "noopener,noreferrer");
        console.log("Opened external URL:", action.url);
      } else {
        // Local URL - use Nuxt navigation
        await navigateTo(action.url);
        console.log("Navigated to local URL:", action.url);
      }
    } catch (error) {
      console.error("Navigation failed:", error);
      // Fallback to legacy action handling if navigation fails
      handleLegacyAction(action);
    }
  } else {
    // No URL provided - use legacy action-based navigation
    handleLegacyAction(action);
  }
};

/**
 * Handle legacy action-based navigation for backward compatibility
 *
 * @param {CallToAction} action - The action object
 * @returns {void}
 */
const handleLegacyAction = (action) => {
  switch (action.action) {
    case "download-plan":
      // Navigate to download page
      console.log("Navigate to download page");
      break;
    case "read-online":
      // Navigate to online plan reading
      console.log("Navigate to online plan");
      break;
    case "contact-us":
      // Navigate to contact page
      console.log("Navigate to contact page");
      break;
    default:
      console.warn("Unknown action:", action.action);
  }
};
