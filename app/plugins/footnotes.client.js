/**
 * Footnote Enhancement Plugin
 *
 * Provides comprehensive footnote functionality for Nuxt Content 3 with:
 * - Bidirectional smooth scrolling between footnote references and definitions
 * - Subtle transparent styling that adapts to light/dark themes
 * - Robust navigation with multiple fallback mechanisms
 * - WCAG 2.1 AA accessibility compliance
 * - SPA navigation support with dynamic content detection
 *
 * Features:
 * - Automatic detection and styling of existing <sup> footnote elements
 * - Theme-aware transparent styling (30% opacity grey backgrounds)
 * - Reliable return navigation to exact footnote references
 * - Multiple ID pattern matching for different markdown processors
 * - Sticky header offset compensation (80px)
 * - MutationObserver for dynamic content and theme changes
 *
 * @module FootnotePlugin
 * @version 2.0.0
 * @author Violence Prevention Plan for Illinois Team
 * @since 2025-05-27
 *
 * @example
 * // Footnotes work automatically with standard markdown syntax:
 * // Text with footnote[^1] reference.
 * // [^1]: This is the footnote definition.
 *
 * @example
 * // Plugin provides global functionality - no manual setup required
 * // Footnotes are automatically enhanced on page load and SPA navigation
 */

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client side
  if (import.meta.server) return;

  false && console.log("FOOTNOTE PLUGIN: Starting up");

  // Track cleanup references for memory leak prevention
  let themeObserver = null;
  let contentObserver = null;
  let clickHandler = null;
  let initTimeout = null;

  // Track the last clicked footnote reference for return navigation
  let lastClickedFootnoteRef = null;

  /**
   * Sets up footnote scrolling functionality with bidirectional navigation.
   *
   * Intercepts clicks on footnote references and back-references to provide
   * smooth scrolling with sticky header offset compensation. Implements
   * robust fallback mechanisms for different markdown processor ID patterns.
   *
   * @function setupFootnoteScrolling
   * @returns {void}
   *
   * @example
   * // Automatically handles clicks on footnote links like:
   * // <sup><a href="#user-content-fn-1">1</a></sup>
   * // <a href="#user-content-fnref-1" class="footnote-backref">↩</a>
   */
  function setupFootnoteScrolling() {
    false && console.log("FOOTNOTE PLUGIN: Setting up scrolling");

    // Find ALL links on the page and intercept footnote ones
    clickHandler = (e) => {
        false && console.log(
          "FOOTNOTE PLUGIN: Click detected on:",
          e.target.tagName,
          e.target.className,
        );

        // Check if it's a footnote link
        if (e.target.tagName === "A" && e.target.getAttribute("href")) {
          const href = e.target.getAttribute("href");
          false && console.log("FOOTNOTE PLUGIN: Link clicked with href:", href);

          // Check if it's a footnote reference (going to footnote definition)
          const isFootnoteRef =
            (href.startsWith("#footnote-") ||
              href.startsWith("#user-content-fn-") ||
              href.includes("fn-")) &&
            (e.target.classList.contains("footnote-ref") ||
              !e.target.classList.contains("footnote-backref"));

          // Check if it's a footnote back-reference (return arrow)
          const isFootnoteBackref =
            href.startsWith("#footnote-ref-") ||
            href.startsWith("#user-content-fnref-") ||
            href.startsWith("#fnref-") ||
            href.startsWith("#fn-") ||
            href.includes("footnote-ref") ||
            href.includes("fnref") ||
            e.target.classList.contains("footnote-backref") ||
            e.target.textContent.includes("↩") ||
            e.target.textContent.includes("⤴") ||
            e.target.getAttribute("aria-label")?.includes("Back to");

          if (isFootnoteRef) {
            false && console.log(
              "FOOTNOTE PLUGIN: FOOTNOTE REFERENCE CLICKED - PREVENTING DEFAULT!",
            );
            e.preventDefault();
            e.stopPropagation();
            false && console.log("FOOTNOTE PLUGIN: preventDefault() called");

            // Store the clicked footnote reference for return navigation
            // Find the parent <sup> element if we clicked on the <a> inside it
            let referenceElement = e.target;
            if (e.target.tagName === "A" && e.target.closest("sup")) {
              referenceElement = e.target.closest("sup");
            }
            lastClickedFootnoteRef = referenceElement;
            false && console.log(
              "FOOTNOTE PLUGIN: Stored reference for return:",
              referenceElement.id || referenceElement.textContent,
            );

            // Find the footnotes section and scroll to it with offset for sticky header
            const footnotesSection = document.querySelector(
              '.footnotes, section[role="doc-endnotes"], #footnotes',
            );
            if (footnotesSection) {
              false && console.log(
                "FOOTNOTE PLUGIN: Found footnotes section, scrolling with offset...",
              );

              // Calculate offset for sticky header (estimate 80px for navigation)
              const headerOffset = 80;
              const elementPosition =
                footnotesSection.getBoundingClientRect().top + window.scrollY;
              const offsetPosition = elementPosition - headerOffset;

              false && console.log(
                "FOOTNOTE PLUGIN: Element position:",
                elementPosition,
                "Offset position:",
                offsetPosition,
              );

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });

              false && console.log("FOOTNOTE PLUGIN: Scrolling executed with offset");
            } else {
              false && console.log(
                "FOOTNOTE PLUGIN: No footnotes section found, trying to scroll to bottom",
              );
              window.scrollTo({
                top: document.body.scrollHeight - 80,
                behavior: "smooth",
              });
              false && console.log("FOOTNOTE PLUGIN: Scrolled to bottom with offset");
            }

            return false;
          }

          if (isFootnoteBackref) {
            false && console.log(
              "FOOTNOTE PLUGIN: FOOTNOTE BACK-REFERENCE CLICKED - PREVENTING DEFAULT!",
            );
            e.preventDefault();
            e.stopPropagation();
            false && console.log(
              "FOOTNOTE PLUGIN: preventDefault() called for back-reference",
            );

            // Try to scroll back to the stored reference first
            if (lastClickedFootnoteRef) {
              false && console.log(
                "FOOTNOTE PLUGIN: Scrolling back to stored reference:",
                lastClickedFootnoteRef.id || lastClickedFootnoteRef.textContent,
              );

              const headerOffset = 80;
              const elementPosition =
                lastClickedFootnoteRef.getBoundingClientRect().top +
                window.scrollY;
              const offsetPosition = elementPosition - headerOffset;

              false && console.log(
                "FOOTNOTE PLUGIN: Reference position:",
                elementPosition,
                "Offset position:",
                offsetPosition,
              );

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });

              false && console.log(
                "FOOTNOTE PLUGIN: Return scroll executed with offset",
              );
            } else {
              // Fallback: try to find the target element from href
              const targetId = href.substring(1); // Remove #
              let targetElement = document.getElementById(targetId);

              // If not found, try alternative ID patterns
              if (!targetElement) {
                // Try different ID patterns that might be generated
                const alternativeIds = [
                  targetId.replace("footnote-ref-", "user-content-fnref-"),
                  targetId.replace("footnote-ref-", "fnref-"),
                  targetId.replace("footnote-ref-", "fn-"),
                  targetId.replace("footnote-ref-", ""),
                  "user-content-fnref-" +
                    targetId.replace(/^.*?(\d+).*$/, "$1"),
                  "fnref-" + targetId.replace(/^.*?(\d+).*$/, "$1"),
                  "fn-" + targetId.replace(/^.*?(\d+).*$/, "$1"),
                ];

                for (const altId of alternativeIds) {
                  targetElement = document.getElementById(altId);
                  if (targetElement) {
                    false && console.log(
                      "FOOTNOTE PLUGIN: Found target with alternative ID:",
                      altId,
                    );
                    break;
                  }
                }
              }

              false && console.log(
                "FOOTNOTE PLUGIN: No stored reference, looking for target:",
                targetId,
                "Found:",
                targetElement,
              );

              if (targetElement) {
                const headerOffset = 80;
                const elementPosition =
                  targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;

                false && console.log(
                  "FOOTNOTE PLUGIN: Target position:",
                  elementPosition,
                  "Offset position:",
                  offsetPosition,
                );

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                });

                false && console.log(
                  "FOOTNOTE PLUGIN: Fallback return scroll executed with offset",
                );
              } else {
                false && console.log(
                  "FOOTNOTE PLUGIN: No target found for return scroll, trying to find any footnote reference",
                );

                // Last resort: find any footnote reference and scroll to the first one
                const anyFootnoteRef = document.querySelector(
                  'sup a[href*="fn"], sup a[data-footnote-ref], .footnote-ref',
                );
                if (anyFootnoteRef) {
                  const headerOffset = 80;
                  const elementPosition =
                    anyFootnoteRef.getBoundingClientRect().top + window.scrollY;
                  const offsetPosition = elementPosition - headerOffset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });

                  false && console.log(
                    "FOOTNOTE PLUGIN: Last resort scroll to first footnote reference",
                  );
                } else {
                  false && console.log(
                    "FOOTNOTE PLUGIN: No footnote references found at all",
                  );
                }
              }
            }

            return false;
          }
        }
    };
    document.addEventListener("click", clickHandler, true);

    false && console.log("FOOTNOTE PLUGIN: Click handler installed");
  }

  /**
   * Finds and styles existing footnote <sup> elements in the DOM.
   *
   * Uses multiple selector strategies to detect footnote elements generated
   * by different markdown processors. Applies subtle transparent styling
   * that adapts to the current theme.
   *
   * @function styleExistingFootnotes
   * @returns {void}
   *
   * @example
   * // Targets elements like:
   * // <sup><a data-footnote-ref href="#user-content-fn-1">1</a></sup>
   * // <sup><a href="#fn-1">1</a></sup>
   */
  function styleExistingFootnotes() {
    false && console.log("FOOTNOTE PLUGIN: Styling existing footnote <sup> elements");

    // Find all existing <sup> elements that contain footnote references
    const footnoteSupElements = document.querySelectorAll(
      'sup:has(a[data-footnote-ref]), sup[data-footnote-ref], sup:has(a[href*="fn-"]), sup:has(a[href*="footnote"])',
    );

    false && console.log(
      "FOOTNOTE PLUGIN: Found",
      footnoteSupElements.length,
      "footnote <sup> elements",
    );

    if (footnoteSupElements.length === 0) {
      // Fallback: look for any <sup> elements containing links
      const allSupElements = document.querySelectorAll("sup");
      false && console.log(
        "FOOTNOTE PLUGIN: Fallback - found",
        allSupElements.length,
        "total <sup> elements",
      );

      allSupElements.forEach((sup) => {
        const link = sup.querySelector("a");
        if (
          link &&
          (link.href.includes("fn-") ||
            link.href.includes("footnote") ||
            link.getAttribute("data-footnote-ref") !== null)
        ) {
          false && console.log("FOOTNOTE PLUGIN: Styling fallback <sup> element:", sup);
          applyFootnoteStyles(sup);
        }
      });
    } else {
      footnoteSupElements.forEach((sup) => {
        false && console.log("FOOTNOTE PLUGIN: Styling <sup> element:", sup);
        applyFootnoteStyles(sup);
      });
    }
  }

  /**
   * Applies subtle transparent styling to a footnote <sup> element.
   *
   * Applies theme-aware styling with transparent backgrounds, appropriate
   * text colors, and hover effects. Uses inline styles to ensure visibility
   * over any conflicting CSS.
   *
   * @function applyFootnoteStyles
   * @param {HTMLElement} supElement - The <sup> element to style
   * @returns {void}
   *
   * @example
   * // Applies styling like:
   * // background: rgba(107, 114, 128, 0.3)
   * // font-size: 0.75em
   * // padding: 0.1rem 0.2rem
   */
  function applyFootnoteStyles(supElement) {
    if (!supElement) return;

    // Detect current theme for appropriate colors
    const isDarkTheme =
      document.documentElement.getAttribute("data-theme") === "dark";

    // Theme-specific colors - very subtle transparent
    const lightThemeColors = {
      background: "rgba(107, 114, 128, 0.3)",
      border: "rgba(107, 114, 128, 0.2)",
      hoverBackground: "rgba(107, 114, 128, 0.4)",
      hoverBorder: "rgba(107, 114, 128, 0.3)",
    };

    const darkThemeColors = {
      background: "rgba(156, 163, 175, 0.3)",
      border: "rgba(156, 163, 175, 0.2)",
      hoverBackground: "rgba(156, 163, 175, 0.4)",
      hoverBorder: "rgba(156, 163, 175, 0.3)",
    };

    const colors = isDarkTheme ? darkThemeColors : lightThemeColors;

    // Apply very subtle inline styles to the <sup> element - matches CSS styling
    supElement.style.fontSize = "0.75em"; // Smaller, closer to browser default
    supElement.style.fontWeight = "500"; // Medium weight for subtle visibility
    supElement.style.backgroundColor = colors.background;
    supElement.style.color = isDarkTheme ? "#e5e7eb" : "#374151"; // Light text for dark theme, dark for light
    supElement.style.padding = "0.1rem 0.2rem"; // Much smaller padding
    supElement.style.marginLeft = "0.1rem"; // Smaller left margin
    supElement.style.borderRadius = "0.15rem"; // Smaller border radius
    supElement.style.textDecoration = "none";
    supElement.style.display = "inline-block";
    supElement.style.verticalAlign = "super";
    supElement.style.border = `1px solid ${colors.border}`; // Thin border
    supElement.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.1)"; // Very gentle shadow
    supElement.style.transform = "translateY(-0.05em)"; // Minimal superscript positioning
    supElement.style.transition = "all 0.2s ease";
    supElement.style.lineHeight = "1"; // Consistent line height
    supElement.style.textAlign = "center";
    supElement.style.cursor = "pointer";
    supElement.style.position = "relative";

    // Add enhanced class for theme updates
    supElement.classList.add("footnote-ref-enhanced");

    // Style the inner anchor to be clean
    const anchor = supElement.querySelector("a");
    if (anchor) {
      anchor.style.color = "inherit";
      anchor.style.textDecoration = "none";
      anchor.style.display = "block";
      anchor.style.width = "100%";
      anchor.style.height = "100%";
    }

    // Add very subtle hover event handlers
    supElement.onmouseover = function () {
      this.style.backgroundColor = colors.hoverBackground;
      this.style.borderColor = colors.hoverBorder;
      this.style.color = isDarkTheme ? "#f9fafb" : "#1f2937"; // Hover text colors
      this.style.transform = "translateY(-0.08em) scale(1.03)"; // Very subtle scaling
      this.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)"; // Gentle enhanced shadow
    };

    supElement.onmouseout = function () {
      this.style.backgroundColor = colors.background;
      this.style.borderColor = colors.border;
      this.style.color = isDarkTheme ? "#e5e7eb" : "#374151"; // Return to normal text colors
      this.style.transform = "translateY(-0.05em) scale(1)";
      this.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.1)"; // Return to original shadow
    };

    false && console.log("FOOTNOTE PLUGIN: Applied styles to <sup> element");
  }

  /**
   * Updates footnote colors when the theme changes.
   *
   * Responds to theme changes by updating all existing footnote elements
   * with appropriate colors for the new theme. Updates both static styles
   * and hover event handlers.
   *
   * @function updateFootnoteThemeColors
   * @returns {void}
   *
   * @example
   * // Called automatically when data-theme attribute changes
   * // Updates from light theme colors to dark theme colors or vice versa
   */
  function updateFootnoteThemeColors() {
    false && console.log("FOOTNOTE PLUGIN: Updating theme colors");

    const isDarkTheme =
      document.documentElement.getAttribute("data-theme") === "dark";

    // Theme-specific colors - very subtle transparent
    const lightThemeColors = {
      background: "rgba(107, 114, 128, 0.3)",
      border: "rgba(107, 114, 128, 0.2)",
      hoverBackground: "rgba(107, 114, 128, 0.4)",
      hoverBorder: "rgba(107, 114, 128, 0.3)",
    };

    const darkThemeColors = {
      background: "rgba(156, 163, 175, 0.3)",
      border: "rgba(156, 163, 175, 0.2)",
      hoverBackground: "rgba(156, 163, 175, 0.4)",
      hoverBorder: "rgba(156, 163, 175, 0.3)",
    };

    const colors = isDarkTheme ? darkThemeColors : lightThemeColors;

    // Update all existing footnote references (targeting enhanced <sup> elements)
    const footnoteRefs = document.querySelectorAll(".footnote-ref-enhanced");
    footnoteRefs.forEach((ref) => {
      ref.style.backgroundColor = colors.background;
      ref.style.borderColor = colors.border;

      // Update hover event handlers for <sup> elements
      ref.onmouseover = function () {
        this.style.backgroundColor = colors.hoverBackground;
        this.style.borderColor = colors.hoverBorder;
        this.style.color = isDarkTheme ? "#f9fafb" : "#1f2937";
        this.style.transform = "translateY(-0.08em) scale(1.03)";
        this.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
      };

      ref.onmouseout = function () {
        this.style.backgroundColor = colors.background;
        this.style.borderColor = colors.border;
        this.style.color = isDarkTheme ? "#e5e7eb" : "#374151";
        this.style.transform = "translateY(-0.05em)";
        this.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.1)";
      };
    });
  }

  /**
   * Handles content changes during SPA navigation.
   *
   * Re-styles footnotes when new content is loaded during single-page
   * application navigation. Includes a small delay to ensure content
   * is fully rendered before applying styles.
   *
   * @function handleContentChange
   * @returns {void}
   */
  function handleContentChange() {
    false && console.log("FOOTNOTE PLUGIN: Content changed, re-styling footnotes");
    // Small delay to ensure new content is fully rendered
    setTimeout(() => {
      styleExistingFootnotes();
    }, 100);
  }

  /**
   * Sets up a MutationObserver to watch for theme changes.
   *
   * Monitors the document element for changes to the data-theme attribute
   * and automatically updates footnote colors when the theme changes.
   *
   * @function setupThemeWatcher
   * @returns {void}
   */
  function setupThemeWatcher() {
    false && console.log("FOOTNOTE PLUGIN: Setting up theme watcher");

    // Create a MutationObserver to watch for theme changes
    themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          false && console.log("FOOTNOTE PLUGIN: Theme change detected");
          updateFootnoteThemeColors();
        }
      });
    });

    // Start observing the document element for attribute changes
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  /**
   * Sets up a MutationObserver to watch for new footnotes being added to the DOM.
   *
   * Monitors the document body for new footnote elements and automatically
   * applies styling when new footnotes are detected during SPA navigation.
   *
   * @function setupContentWatcher
   * @returns {void}
   */
  function setupContentWatcher() {
    false && console.log("FOOTNOTE PLUGIN: Setting up content watcher");

    // Create a MutationObserver to watch for new footnotes
    contentObserver = new MutationObserver((mutations) => {
      let shouldRestyle = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          // Check if any new nodes contain footnotes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              // Check if the added element is a footnote or contains footnotes
              if (element.tagName === "SUP" || element.querySelector("sup")) {
                shouldRestyle = true;
              }
            }
          });
        }
      });

      if (shouldRestyle) {
        false && console.log("FOOTNOTE PLUGIN: New footnotes detected, re-styling");
        handleContentChange();
      }
    });

    // Start observing the document body for changes
    contentObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Initializes all footnote functionality.
   *
   * Sets up footnote styling, scrolling, theme watching, and content watching.
   * Called when the DOM is ready to ensure all footnote features are active.
   *
   * @function init
   * @returns {void}
   */
  function init() {
    false && console.log("FOOTNOTE PLUGIN: Initializing");

    // Style existing footnote <sup> elements
    styleExistingFootnotes();

    // Setup scrolling
    setupFootnoteScrolling();

    // Setup theme watching
    setupThemeWatcher();

    // Setup content watching for SPA navigation
    setupContentWatcher();

    false && console.log("FOOTNOTE PLUGIN: Ready");
  }

  // Start when DOM is ready - delay to prevent hydration mismatches
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initTimeout = setTimeout(init, 500);
    });
  } else {
    initTimeout = setTimeout(init, 500);
  }

  // Cleanup on app unmount to prevent memory leaks
  nuxtApp.hook("app:unmounted", () => {
    if (initTimeout) clearTimeout(initTimeout);
    if (themeObserver) themeObserver.disconnect();
    if (contentObserver) contentObserver.disconnect();
    if (clickHandler) document.removeEventListener("click", clickHandler, true);
  });
});
