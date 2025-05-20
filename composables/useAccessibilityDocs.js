/**
 * Composable for managing accessibility documentation
 * 
 * This composable provides utilities for working with accessibility documentation,
 * including updating the HTML versions of the documentation.
 */

/**
 * Update the HTML versions of the accessibility documentation
 * 
 * This function is meant to be called after updating the accessibility audit log
 * or documentation. It runs the script to generate HTML versions of the documentation.
 * 
 * Note: This function only works in a development environment with Node.js access.
 * In production, the HTML files are generated during the build process.
 * 
 * @returns {Promise<void>}
 */
export async function updateAccessibilityHtml() {
  if (process.client) {
    try {
      // In a browser environment, we can't run Node.js scripts directly
      console.log('Accessibility HTML generation is only available during build or in a Node.js environment.');
      console.log('The HTML files will be automatically generated during the next build.');
      return;
    } catch (error) {
      console.error('Error updating accessibility HTML:', error);
    }
  } else if (process.server) {
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
    }
  }
}

/**
 * Get the URLs for the HTML versions of the accessibility documentation
 * 
 * @returns {Object} Object containing the URLs for the accessibility documentation
 */
export function getAccessibilityDocUrls() {
  const baseUrl = process.env.BASE_URL || '';
  
  return {
    documentation: `${baseUrl}/accessibility-documentation.html`,
    auditLog: `${baseUrl}/audit-log-accessibility.html`
  };
}
