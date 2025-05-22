/**
 * Composable for managing accessibility documentation
 *
 * This composable provides utilities for working with accessibility documentation,
 * including updating the HTML versions of the documentation and retrieving URLs
 * for the HTML documentation files.
 *
 * Features:
 * - Generate HTML versions of markdown accessibility documentation
 * - Get URLs for accessibility documentation HTML files
 * - Support for both client and server-side environments
 *
 * @module useAccessibilityDocs
 *
 * @example
 * // Basic usage in a Vue component or Nuxt page
 * <script setup>
 * import { getAccessibilityDocUrls } from '~/composables/useAccessibilityDocs';
 *
 * // Get URLs for accessibility documentation
 * const docUrls = getAccessibilityDocUrls();
 *
 * // Use the URLs in your component
 * const documentationUrl = docUrls.documentation;
 * const auditLogUrl = docUrls.auditLog;
 * </script>
 *
 * @example
 * // Usage in a server-side context (e.g., Nuxt server middleware or API route)
 * <script>
 * import { updateAccessibilityHtml } from '~/composables/useAccessibilityDocs';
 *
 * // After updating markdown documentation, generate HTML versions
 * export default defineEventHandler(async (event) => {
 *   try {
 *     // Update the accessibility documentation HTML files
 *     await updateAccessibilityHtml();
 *     return { success: true, message: 'Accessibility documentation updated' };
 *   } catch (error) {
 *     return { success: false, error: error.message };
 *   }
 * });
 * </script>
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
 * Update the HTML versions of the accessibility documentation
 *
 * This function is meant to be called after updating the accessibility audit log
 * or documentation. It runs the script to generate HTML versions of the documentation.
 *
 * The function behaves differently depending on the execution environment:
 * - In browser environments, it logs a message explaining that HTML generation
 *   is only available during build or in a Node.js environment
 * - In server environments, it executes the npm script to generate the HTML files
 *
 * Note: This function only works in a development environment with Node.js access.
 * In production, the HTML files are generated during the build process.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete
 *
 * @example
 * // Usage in a Nuxt server route
 * export default defineEventHandler(async (event) => {
 *   try {
 *     await updateAccessibilityHtml();
 *     return { success: true };
 *   } catch (error) {
 *     return { success: false, error: error.message };
 *   }
 * });
 *
 * @example
 * // Usage in a component method (will show informational message in browser)
 * <script setup>
 * import { updateAccessibilityHtml } from '~/composables/useAccessibilityDocs';
 *
 * async function regenerateAccessibilityDocs() {
 *   try {
 *     await updateAccessibilityHtml();
 *     // Note: In browser context, this will just log an informational message
 *   } catch (error) {
 *     console.error('Failed to update accessibility docs:', error);
 *   }
 * }
 * </script>
 */
export async function updateAccessibilityHtml() {
  // Check if we're in a browser environment using typeof window
  if (typeof window !== 'undefined') {
    try {
      // In a browser environment, we can't run Node.js scripts directly
      console.log('Accessibility HTML generation is only available during build or in a Node.js environment.');
      console.log('The HTML files will be automatically generated during the next build.');
      return;
    } catch (error) {
      console.error('Error updating accessibility HTML:', error);
    }
  } else {
    // We're in a server environment (SSR or build process)
    try {
      // In a server environment (SSR), we can try to run the script
      const { exec } = await import('child_process');

      return new Promise((resolve, reject) => {
        exec('npm run create:accessibility-html', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing script: ${error.message}`);
            reject(error);
            return;
          }

          if (stderr) {
            console.error(`Script stderr: ${stderr}`);
          }

          console.log(`Script output: ${stdout}`);
          resolve();
        });
      });
    } catch (error) {
      console.error('Error updating accessibility HTML:', error);
      throw error; // Re-throw to allow proper error handling by caller
    }
  }
}

/**
 * Get the URLs for the HTML versions of the accessibility documentation
 *
 * This function returns an object containing the URLs for the HTML versions
 * of the accessibility documentation. These URLs can be used to create links
 * to the documentation in the application.
 *
 * The function automatically prepends the base URL from the environment
 * configuration, ensuring the URLs work correctly in any deployment environment.
 *
 * @returns {Object} Object containing the URLs for the accessibility documentation
 * @returns {string} documentation - URL for the accessibility documentation HTML file
 * @returns {string} auditLog - URL for the accessibility audit log HTML file
 *
 * @example
 * // Basic usage
 * const urls = getAccessibilityDocUrls();
 * console.log(urls.documentation); // '/accessibility-documentation.html'
 * console.log(urls.auditLog); // '/audit-log-accessibility.html'
 *
 * @example
 * // Usage in a component template
 * <template>
 *   <footer>
 *     <a :href="accessibilityUrls.documentation" target="_blank">
 *       Accessibility Documentation
 *     </a>
 *     <a :href="accessibilityUrls.auditLog" target="_blank">
 *       Accessibility Audit Log
 *     </a>
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
  const baseUrl = process.env.BASE_URL || '';

  return {
    documentation: `${baseUrl}/accessibility-documentation.html`,
    auditLog: `${baseUrl}/audit-log-accessibility.html`
  };
}
