/**
 * Content Links Client Plugin
 *
 * Handles special link navigation for static documentation files.
 * Ensures that links to /docs/* perform full page navigations instead of
 * being intercepted by Nuxt router, which would cause 404 errors.
 *
 * @fileoverview Client-side plugin for handling documentation portal links
 * @module plugins/content-links
 */

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Wait for DOM to be ready
    const handleLinks = () => {
      // Find all links on the page
      const links = document.querySelectorAll('a[href^="/docs/"]');

      links.forEach((link) => {
        const href = link.getAttribute('href');

        // Handle /docs/ links - force full page navigation to bypass Nuxt router
        if (href && href.startsWith('/docs/')) {
          link.addEventListener(
            'click',
            (event) => {
              event.preventDefault();
              event.stopPropagation();
              window.location.href = href;
            },
            { capture: true }
          );
        }
      });
    };

    // Run on initial load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleLinks);
    } else {
      handleLinks();
    }

    // Re-run after route changes (for content rendered by Nuxt Content)
    const observer = new MutationObserver(() => {
      handleLinks();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
});

