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

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    let observer: MutationObserver | null = null;

    const handleLinks = () => {
      const links = document.querySelectorAll('a[href^="/docs/"]');

      links.forEach((link) => {
        // Skip links already processed
        if (link.hasAttribute('data-docs-handled')) return;
        link.setAttribute('data-docs-handled', 'true');

        const href = link.getAttribute('href');

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
    observer = new MutationObserver(() => {
      handleLinks();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Clean up observer when app unmounts to prevent memory leaks
    nuxtApp.hook('app:error', () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    });
  }
});
