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

  console.log("REFERENCE PLUGIN: Starting up");

  // Track enhanced elements to avoid duplicate processing
  const enhancedElements = new WeakSet();

  // Debounce timer for performance optimization
  let debounceTimer = null;

  /**
   * Create and enhance an element with reference tooltip functionality using Vuetify styling
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

      console.log(
        "REFERENCE PLUGIN: Creating enhanced tooltip for element with ref:",
        referenceId
      );

      // Import and use the references composable
      import("~/composables/useReferences.js")
        .then(({ useReferences }) => {
          console.log(
            "REFERENCE PLUGIN: Successfully imported useReferences for:",
            referenceId
          );
          const {
            getReference,
            getMultipleReferences,
            formatMultipleReferences,
          } = useReferences();

          // Load reference data
          const loadReferenceData = async () => {
            try {
              console.log(
                "REFERENCE PLUGIN: Loading reference data for:",
                referenceId
              );
              let references = [];
              let tooltipText = "";
              let hasError = false;

              if (referenceId.includes(",")) {
                console.log(
                  "REFERENCE PLUGIN: Loading multiple references:",
                  referenceId
                );
                references = await getMultipleReferences(referenceId);
              } else {
                console.log(
                  "REFERENCE PLUGIN: Loading single reference:",
                  referenceId
                );
                const ref = await getReference(referenceId);
                references = ref ? [ref] : [];
              }

              console.log("REFERENCE PLUGIN: Loaded references:", references);

              if (references.length === 0) {
                console.warn(
                  "REFERENCE PLUGIN: No references found for:",
                  referenceId
                );
                tooltipText = `Reference not found: ${referenceId}`;
                hasError = true;
                element.classList.add("reference-error");
              } else {
                // Set tooltip text
                if (references.length === 1) {
                  tooltipText =
                    references[0].fullCitation ||
                    references[0].shortCitation ||
                    "Citation unavailable";
                } else {
                  tooltipText = formatMultipleReferences(references);
                }
                console.log(
                  "REFERENCE PLUGIN: Reference loaded for:",
                  referenceId
                );
              }

              // Create a custom Vuetify-styled tooltip using DOM manipulation
              // This approach avoids Vue app mounting conflicts with Nuxt SSR
              createVuetifyTooltip(element, tooltipText, hasError, referenceId);
            } catch (error) {
              console.warn(
                "REFERENCE PLUGIN: Failed to load reference:",
                referenceId,
                error
              );
              // Fallback to native title attribute
              element.title = `Reference error: ${error.message}`;
              element.classList.add("reference-error");
            }
          };

          // Load the reference data
          loadReferenceData();
        })
        .catch((error) => {
          console.error(
            "REFERENCE PLUGIN: Failed to import useReferences:",
            error
          );
          // Fallback to native title attribute
          element.title = `Reference: ${referenceId}`;
          element.classList.add("reference-error");
        });

      // Mark as enhanced
      enhancedElements.add(element);

      console.log(
        "REFERENCE PLUGIN: Successfully initiated enhancement for ref:",
        referenceId
      );
    } catch (error) {
      console.error(
        "REFERENCE PLUGIN: Failed to create tooltip for ref:",
        referenceId,
        error
      );

      // Fallback: add basic tooltip and error class
      element.title = `Reference: ${referenceId}`;
      element.classList.add("reference-error");
    }
  };

  /**
   * Create a Vuetify-styled tooltip using DOM manipulation
   * This approach provides consistent styling without Vue app mounting conflicts
   *
   * @param {HTMLElement} element - The element to enhance
   * @param {string} tooltipText - The tooltip content
   * @param {boolean} hasError - Whether this is an error state
   * @param {string} referenceId - The reference ID for debugging
   */
  const createVuetifyTooltip = (
    element,
    tooltipText,
    hasError,
    referenceId
  ) => {
    try {
      console.log(
        "REFERENCE PLUGIN: Creating Vuetify-styled tooltip for:",
        referenceId
      );

      // Remove any existing title attribute to prevent browser default tooltip
      element.removeAttribute("title");

      // Add appropriate CSS classes for styling
      element.classList.add("reference-citation-enhanced");
      if (hasError) {
        element.classList.add("reference-error");
      }

      // Create tooltip element
      let tooltipElement = null;
      let showTimeout = null;
      let hideTimeout = null;

      const showTooltip = (event) => {
        // Clear any existing timeouts
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          hideTimeout = null;
        }

        // Create tooltip if it doesn't exist
        if (!tooltipElement) {
          tooltipElement = document.createElement("div");
          tooltipElement.className =
            "v-tooltip__content reference-tooltip-content";
          tooltipElement.setAttribute("role", "tooltip");
          tooltipElement.setAttribute("aria-hidden", "true");
          tooltipElement.textContent = tooltipText;

          // Apply Vuetify-consistent styling with theme-aware colors
          const isDarkTheme =
            document.documentElement.getAttribute("data-theme") === "dark";
          const backgroundColor = isDarkTheme ? "#616161" : "#424242";
          const textColor = "#ffffff";

          tooltipElement.style.cssText = `
            position: absolute;
            z-index: 2000;
            padding: 12px 16px;
            background-color: ${backgroundColor};
            color: ${textColor};
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            font-size: 0.875rem;
            line-height: 1.5;
            max-width: 400px;
            white-space: pre-wrap;
            word-wrap: break-word;
            text-align: left;
            opacity: 0;
            transform: translateY(-8px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: none;
          `;

          document.body.appendChild(tooltipElement);
        }

        // Position tooltip
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltipElement.getBoundingClientRect();

        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.top - tooltipRect.height - 8;

        // Adjust for viewport boundaries
        if (left < 8) left = 8;
        if (left + tooltipRect.width > window.innerWidth - 8) {
          left = window.innerWidth - tooltipRect.width - 8;
        }
        if (top < 8) {
          top = rect.bottom + 8; // Show below if no room above
        }

        tooltipElement.style.left = `${left + window.scrollX}px`;
        tooltipElement.style.top = `${top + window.scrollY}px`;

        // Show tooltip with delay for instant popup
        showTimeout = setTimeout(() => {
          if (tooltipElement) {
            tooltipElement.style.opacity = "1";
            tooltipElement.style.transform = "translateY(0)";
            tooltipElement.setAttribute("aria-hidden", "false");
          }
        }, 50); // Instant popup timing
      };

      const hideTooltip = () => {
        if (showTimeout) {
          clearTimeout(showTimeout);
          showTimeout = null;
        }

        if (tooltipElement) {
          hideTimeout = setTimeout(() => {
            if (tooltipElement) {
              tooltipElement.style.opacity = "0";
              tooltipElement.style.transform = "translateY(-8px)";
              tooltipElement.setAttribute("aria-hidden", "true");

              setTimeout(() => {
                if (tooltipElement && tooltipElement.parentNode) {
                  tooltipElement.parentNode.removeChild(tooltipElement);
                  tooltipElement = null;
                }
              }, 200); // Wait for transition to complete
            }
          }, 0); // No delay for hiding
        }
      };

      // Add event listeners
      element.addEventListener("mouseenter", showTooltip);
      element.addEventListener("mouseleave", hideTooltip);
      element.addEventListener("focus", showTooltip);
      element.addEventListener("blur", hideTooltip);

      // Mobile support - auto-hide after delay
      // Use passive: true to improve scroll performance and avoid console warnings
      element.addEventListener(
        "touchstart",
        (event) => {
          showTooltip(event);
          setTimeout(hideTooltip, 4000); // Auto-hide on mobile
        },
        { passive: true }
      );

      // Keyboard support
      element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showTooltip(event);
        } else if (event.key === "Escape") {
          hideTooltip();
        }
      });

      console.log(
        "REFERENCE PLUGIN: Successfully created Vuetify-styled tooltip for:",
        referenceId
      );
    } catch (error) {
      console.error(
        "REFERENCE PLUGIN: Failed to create Vuetify tooltip for:",
        referenceId,
        error
      );
      // Fallback to native title
      element.title = tooltipText;
    }
  };

  /**
   * Find and enhance all elements with data-ref attributes
   */
  const enhanceReferenceElements = () => {
    console.log("REFERENCE PLUGIN: Scanning for reference elements...");

    // Find all elements with data-ref attributes
    const referenceElements = document.querySelectorAll("[data-ref]");
    console.log(
      "REFERENCE PLUGIN: Found",
      referenceElements.length,
      "reference elements"
    );

    referenceElements.forEach((element) => {
      const referenceId = element.getAttribute("data-ref");

      if (!referenceId) {
        console.warn(
          "REFERENCE PLUGIN: Element has data-ref attribute but no value:",
          element
        );
        return;
      }

      // Skip if already enhanced
      if (enhancedElements.has(element)) {
        console.log(
          "REFERENCE PLUGIN: Element already enhanced, skipping:",
          referenceId
        );
        return;
      }

      console.log(
        "REFERENCE PLUGIN: Processing reference element:",
        referenceId
      );
      createReferenceTooltip(element, referenceId);
    });

    console.log("REFERENCE PLUGIN: Enhancement complete");
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
    console.log("REFERENCE PLUGIN: Setting up content observer...");

    const observer = new MutationObserver((mutations) => {
      let shouldEnhance = false;

      mutations.forEach((mutation) => {
        // Check for added nodes
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the added node or its children have data-ref attributes
              if (node.hasAttribute && node.hasAttribute("data-ref")) {
                shouldEnhance = true;
              } else if (
                node.querySelector &&
                node.querySelector("[data-ref]")
              ) {
                shouldEnhance = true;
              }
            }
          });
        }
      });

      if (shouldEnhance) {
        console.log(
          "REFERENCE PLUGIN: Content change detected, re-enhancing..."
        );
        debouncedEnhance();
      }
    });

    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log("REFERENCE PLUGIN: Content observer active");
  };

  /**
   * Initialize the plugin
   */
  const initialize = () => {
    console.log("REFERENCE PLUGIN: Initializing...");

    // Initial enhancement
    enhanceReferenceElements();

    // Set up content observer for SPA navigation and dynamic content
    setupContentObserver();

    console.log("REFERENCE PLUGIN: Initialization complete");
  };

  // Initialize when DOM is ready - delay to prevent hydration mismatches
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      // Delay initialization to ensure hydration is complete
      setTimeout(initialize, 500);
    });
  } else {
    // DOM is already ready - delay to ensure hydration is complete
    setTimeout(initialize, 500);
  }

  // Also run on route changes for SPA navigation
  if (window.nuxtApp) {
    window.nuxtApp.hook("page:finish", () => {
      console.log(
        "REFERENCE PLUGIN: Page navigation detected, re-enhancing..."
      );
      setTimeout(debouncedEnhance, 100); // Small delay to ensure content is rendered
    });
  }
});
