/**
 * Ultra-simple plugin to force scroll to top (0,0) on page refresh
 */

// Execute immediately when this script is loaded
if (typeof window !== 'undefined') {
  // Disable browser's automatic scroll restoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Force scroll to absolute top (0,0)
  window.scrollTo(0, 0);

  // Also set these for maximum compatibility
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default defineNuxtPlugin(() => {
  // Nothing needed in the plugin itself
  // The code above runs before Vue is initialized
});
