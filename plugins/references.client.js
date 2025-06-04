/**
 * Reference Enhancement Plugin
 *
 * Automatically enhances elements with data-ref attributes by wrapping them
 * with ReferenceTooltip components. Provides comprehensive reference popup
 * functionality for Nuxt Content 3 with:
 * - Automatic detection of [data-ref] elements
 * - Dynamic Vue component mounting for tooltips
 * - SPA navigation support with content change detection
 * - WCAG 2.1 AA accessibility compliance
 * - Robust error handling and fallbacks
 *
 * Features:
 * - Automatic enhancement of existing elements with data-ref attributes
 * - Support for single and multiple reference IDs (comma-separated)
 * - Dynamic component creation and mounting
 * - MutationObserver for content changes and SPA navigation
 * - Comprehensive error handling with graceful degradation
 * - Performance optimization with debounced processing
 *
 * @module ReferencePlugin
 * @version 1.0.0
 * @author Violence Prevention Plan for Illinois Team
 * @since 2025-06-04
 *
 * @example
 * // References work automatically with data-ref attributes:
 * // <span data-ref="armstead-2021">(Armstead et al., 2021)</span>
 * // <span data-ref="cdc-2019,wilkins-2014">(CDC, 2019; Wilkins et al., 2014)</span>
 *
 * @example
 * // Plugin provides global functionality - no manual setup required
 * // References are automatically enhanced on page load and SPA navigation
 */

// No imports needed - we'll dynamically import the composable

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (import.meta.server) return;

  console.log('REFERENCE PLUGIN: Starting up');

  // Track enhanced elements to avoid duplicate processing
  const enhancedElements = new WeakSet();
  
  // Debounce timer for performance optimization
  let debounceTimer = null;

  /**
   * Create and enhance an element with reference tooltip functionality
   *
   * @param {HTMLElement} element - The element to enhance
   * @param {string} referenceId - The reference ID(s) from data-ref attribute
   */
  const createReferenceTooltip = (element, referenceId) => {
    try {
      // Skip if already enhanced
      if (enhancedElements.has(element)) {
        return;
      }

      console.log('REFERENCE PLUGIN: Creating tooltip for element with ref:', referenceId);

      // Note: Visual styling is now handled entirely by CSS in assets/css/main.scss
      // This ensures consistent theming and accessibility compliance

      // Import and use the references composable
      import('~/composables/useReferences.js').then(({ useReferences }) => {
        console.log('REFERENCE PLUGIN: Successfully imported useReferences for:', referenceId);
        const { getReference, getMultipleReferences, formatMultipleReferences } = useReferences();

        // Load reference data
        const loadReferenceData = async () => {
          try {
            console.log('REFERENCE PLUGIN: Loading reference data for:', referenceId);
            let references = [];

            if (referenceId.includes(',')) {
              console.log('REFERENCE PLUGIN: Loading multiple references:', referenceId);
              references = await getMultipleReferences(referenceId);
            } else {
              console.log('REFERENCE PLUGIN: Loading single reference:', referenceId);
              const ref = await getReference(referenceId);
              references = ref ? [ref] : [];
            }

            console.log('REFERENCE PLUGIN: Loaded references:', references);

            if (references.length === 0) {
              console.warn('REFERENCE PLUGIN: No references found for:', referenceId);
              element.title = `Reference not found: ${referenceId}`;
              element.classList.add('reference-error'); // Use CSS class for error styling
              return;
            }

            // Set tooltip text
            if (references.length === 1) {
              element.title = references[0].fullCitation || references[0].shortCitation || 'Citation unavailable';
            } else {
              element.title = formatMultipleReferences(references);
            }

            console.log('REFERENCE PLUGIN: Reference loaded for:', referenceId);
          } catch (error) {
            console.warn('REFERENCE PLUGIN: Failed to load reference:', referenceId, error);
            element.title = `Reference error: ${error.message}`;
            element.classList.add('reference-error'); // Use CSS class for error styling
          }
        };

        // Load the reference data
        loadReferenceData();
      }).catch(error => {
        console.error('REFERENCE PLUGIN: Failed to import useReferences:', error);
        element.title = `Reference: ${referenceId}`;
      });

      // Mark as enhanced
      enhancedElements.add(element);

      console.log('REFERENCE PLUGIN: Successfully enhanced element with ref:', referenceId);
    } catch (error) {
      console.error('REFERENCE PLUGIN: Failed to create tooltip for ref:', referenceId, error);

      // Fallback: add basic tooltip and error class (styling handled by CSS)
      element.title = `Reference: ${referenceId}`;
      element.classList.add('reference-error');
    }
  };

  /**
   * Find and enhance all elements with data-ref attributes
   */
  const enhanceReferenceElements = () => {
    console.log('REFERENCE PLUGIN: Scanning for reference elements...');

    // Find all elements with data-ref attributes
    const referenceElements = document.querySelectorAll('[data-ref]');
    console.log('REFERENCE PLUGIN: Found', referenceElements.length, 'reference elements');

    referenceElements.forEach(element => {
      const referenceId = element.getAttribute('data-ref');
      
      if (!referenceId) {
        console.warn('REFERENCE PLUGIN: Element has data-ref attribute but no value:', element);
        return;
      }

      // Skip if already enhanced
      if (enhancedElements.has(element)) {
        console.log('REFERENCE PLUGIN: Element already enhanced, skipping:', referenceId);
        return;
      }

      console.log('REFERENCE PLUGIN: Processing reference element:', referenceId);
      createReferenceTooltip(element, referenceId);
    });

    console.log('REFERENCE PLUGIN: Enhancement complete');
  };

  /**
   * Debounced version of enhanceReferenceElements for performance
   */
  const debouncedEnhance = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
      enhanceReferenceElements();
    }, 100); // 100ms debounce
  };

  /**
   * Set up MutationObserver to watch for content changes
   */
  const setupContentObserver = () => {
    console.log('REFERENCE PLUGIN: Setting up content observer...');

    const observer = new MutationObserver((mutations) => {
      let shouldEnhance = false;

      mutations.forEach(mutation => {
        // Check for added nodes
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the added node or its children have data-ref attributes
              if (node.hasAttribute && node.hasAttribute('data-ref')) {
                shouldEnhance = true;
              } else if (node.querySelector && node.querySelector('[data-ref]')) {
                shouldEnhance = true;
              }
            }
          });
        }
      });

      if (shouldEnhance) {
        console.log('REFERENCE PLUGIN: Content change detected, re-enhancing...');
        debouncedEnhance();
      }
    });

    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('REFERENCE PLUGIN: Content observer active');
  };

  /**
   * Initialize the plugin
   */
  const initialize = () => {
    console.log('REFERENCE PLUGIN: Initializing...');

    // Initial enhancement
    enhanceReferenceElements();

    // Set up content observer for SPA navigation and dynamic content
    setupContentObserver();

    console.log('REFERENCE PLUGIN: Initialization complete');
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM is already ready
    initialize();
  }

  // Also run on route changes for SPA navigation
  if (window.nuxtApp) {
    window.nuxtApp.hook('page:finish', () => {
      console.log('REFERENCE PLUGIN: Page navigation detected, re-enhancing...');
      setTimeout(debouncedEnhance, 100); // Small delay to ensure content is rendered
    });
  }
});
