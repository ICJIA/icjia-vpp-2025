/**
 * Composable for managing accessibility documentation
 *
 * This composable provides utilities for working with accessibility documentation
 * through the Nuxt Content v3 system. The accessibility documentation has been
 * migrated from static HTML files to the dynamic content management system.
 *
 * Features:
 * - Get URLs for accessibility documentation via Nuxt Content routes
 * - Support for both client and server-side environments
 * - Integration with dynamic catch-all page system
 *
 * @module useAccessibilityDocs
 *
 * @example
 * // Basic usage in a Vue component or Nuxt page
 * <script setup>
 * import { getAccessibilityDocUrls } from '~/composables/useAccessibilityDocs';
 *
 * // Get URLs for accessibility documentation via Nuxt Content routes
 * const docUrls = getAccessibilityDocUrls();
 *
 * // Use the URLs in your component
 * const documentationUrl = docUrls.documentation; // '/accessibility/documentation'
 * const auditLogUrl = docUrls.auditLog; // '/accessibility/audit-log'
 * </script>
 *
 * @example
 * // Usage with nuxt-link for navigation
 * <template>
 *   <nuxt-link :to="getAccessibilityDocUrls().documentation">
 *     View Accessibility Documentation
 *   </nuxt-link>
 * </template>
 *
 * @example
 * // Usage in a component with links to documentation
 * <template>
 *   <div>
 *     <h2>Accessibility Resources</h2>
 *     <v-list>
 *       <v-list-item :href="docUrls.documentation" target="_blank">
 *         <v-list-item-title>Accessibility Documentation</v-list-item-title>
 *       </v-list-item>
 *       <v-list-item :href="docUrls.auditLog" target="_blank">
 *         <v-list-item-title>Accessibility Audit Log</v-list-item-title>
 *       </v-list-item>
 *     </v-list>
 *   </div>
 * </template>
 *
 * <script setup>
 * import { getAccessibilityDocUrls } from '~/composables/useAccessibilityDocs';
 *
 * const docUrls = getAccessibilityDocUrls();
 * </script>
 */

/**
 * Note: HTML generation functionality has been removed as accessibility documentation
 * has been migrated to the Nuxt Content v3 system. Documentation is now managed
 * through markdown files in the /content/accessibility/ directory and rendered
 * dynamically via the catch-all page system at /pages/[...slug].vue.
 *
 * The accessibility documentation is now available at:
 * - /accessibility/documentation (was /accessibility-documentation.html)
 * - /accessibility/audit-log (was /audit-log-accessibility.html)
 */

/**
 * Get the URLs for the accessibility documentation via Nuxt Content routes
 *
 * This function returns an object containing the URLs for the accessibility
 * documentation through the Nuxt Content v3 system. These URLs can be used to create
 * links to the documentation in the application using nuxt-link or regular links.
 *
 * The documentation is now served dynamically through the catch-all page system
 * and is fully integrated with the site's search functionality.
 *
 * @returns {Object} Object containing the URLs for the accessibility documentation
 * @returns {string} documentation - URL for the accessibility documentation page
 * @returns {string} auditLog - URL for the accessibility audit log page
 *
 * @example
 * // Basic usage
 * const urls = getAccessibilityDocUrls();
 * console.log(urls.documentation); // '/accessibility/documentation'
 * console.log(urls.auditLog); // '/accessibility/audit-log'
 *
 * @example
 * // Usage in a component template with nuxt-link
 * <template>
 *   <footer>
 *     <nuxt-link :to="accessibilityUrls.documentation">
 *       Accessibility Documentation
 *     </nuxt-link>
 *     <nuxt-link :to="accessibilityUrls.auditLog">
 *       Accessibility Audit Log
 *     </nuxt-link>
 *   </footer>
 * </template>
 *
 * <script setup>
 * import { getAccessibilityDocUrls } from '~/composables/useAccessibilityDocs';
 *
 * const accessibilityUrls = getAccessibilityDocUrls();
 * </script>
 */
export function getAccessibilityDocUrls() {
  return {
    documentation: '/accessibility/documentation',
    auditLog: '/accessibility/audit-log'
  };
}
