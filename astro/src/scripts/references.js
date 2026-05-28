/**
 * References / Citation Popups
 *
 * Plain ES module — no framework dependency. Ported from
 * app/plugins/references.client.js (Nuxt/Vue wrapper stripped).
 *
 * Exports `initReferences()` which:
 *   - Fetches /data/references.json once (module-level de-duped promise)
 *   - Queries all [data-ref] spans not yet enhanced
 *   - Builds a <div role="tooltip"> per span and wires hover/focus/touch/keyboard
 *   - A11y: aria-describedby on trigger span when shown; aria-hidden on tooltip
 *
 * Multi-key spans (data-ref="a,b") → each key's fullCitation joined with "\n\n"
 * (numbered: "1. <citation>\n\n2. <citation>")
 *
 * @module references
 * @version 1.0.0
 */

// ---------------------------------------------------------------------------
// Module-level fetch cache (de-duped promise, shared across all callers)
// ---------------------------------------------------------------------------

/** @type {Object|null} Populated after first successful fetch */
let _cache = null;

/** @type {Promise<Object|null>|null} In-flight promise to prevent duplicate requests */
let _fetchPromise = null;

/** @type {number} Auto-incrementing id for unique tooltip element ids */
let _tooltipCounter = 0;

/**
 * Fetch /data/references.json once; return the `references` sub-object.
 * Subsequent calls return the cached value immediately.
 *
 * @returns {Promise<Object|null>}
 */
async function fetchReferences() {
  if (_cache) return _cache;
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = (async () => {
    try {
      const res = await fetch("/data/references.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || !data.references) throw new Error("Unexpected shape");
      _cache = data.references;
      return _cache;
    } catch (err) {
      console.warn("[references] Failed to fetch /data/references.json:", err);
      return null;
    } finally {
      _fetchPromise = null;
    }
  })();

  return _fetchPromise;
}

/**
 * Look up a single reference entry by key.
 *
 * @param {string} key
 * @returns {Promise<Object|null>}
 */
async function getReference(key) {
  const refs = await fetchReferences();
  if (!refs) return null;
  const entry = refs[key.trim()];
  if (!entry) {
    console.warn(`[references] Key not found: "${key.trim()}"`);
    return null;
  }
  return entry;
}

// ---------------------------------------------------------------------------
// Tooltip construction helpers
// ---------------------------------------------------------------------------

/**
 * Determine whether the page is currently in dark mode.
 * Checks documentElement for a "dark" class (Tailwind / our BaseLayout
 * approach) or the data-theme="dark" attribute (fallback).
 *
 * @returns {boolean}
 */
function isDark() {
  const el = document.documentElement;
  return el.classList.contains("dark") || el.getAttribute("data-theme") === "dark";
}

/**
 * Build the tooltip element, append it to the span's parent (so it stays
 * within the document flow / landmarks), and return it.
 *
 * @param {HTMLElement} parent  - Span's parent element
 * @param {string}      text    - Tooltip content (may contain \n\n separators)
 * @param {string}      tipId   - Unique element id for aria-describedby
 * @returns {HTMLElement}
 */
function createTooltipElement(parent, text, tipId) {
  const bg = isDark() ? "rgba(30,40,60,0.98)" : "rgba(33,33,33,0.95)";

  const tip = document.createElement("div");
  tip.setAttribute("role", "tooltip");
  tip.setAttribute("id", tipId);
  tip.setAttribute("aria-hidden", "true");
  tip.textContent = text;

  tip.style.cssText = `
    position: absolute;
    z-index: 9999;
    padding: 12px 16px;
    background-color: ${bg};
    color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
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

  parent.appendChild(tip);
  return tip;
}

/**
 * Position `tip` absolutely above `span` (relative to `parent`).
 * Flips below the span when insufficient viewport space above.
 *
 * @param {HTMLElement} tip
 * @param {HTMLElement} span
 * @param {HTMLElement} parent
 */
function positionTooltip(tip, span, parent) {
  const spanRect   = span.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  const tipW = tip.offsetWidth  || 200;
  const tipH = tip.offsetHeight || 50;

  // Position relative to parent (which has position:relative)
  let left = (spanRect.left - parentRect.left) + (spanRect.width / 2) - (tipW / 2);
  let top  = (spanRect.top  - parentRect.top)  - tipH - 8;

  // Flip below if not enough room above in viewport
  if (spanRect.top - tipH - 8 < 0) {
    top = (spanRect.top - parentRect.top) + spanRect.height + 8;
  }

  tip.style.left = `${Math.max(0, left)}px`;
  tip.style.top  = `${top}px`;
}

// ---------------------------------------------------------------------------
// Per-span enhancement
// ---------------------------------------------------------------------------

/**
 * Attach tooltip behaviour to a single [data-ref] span.
 * Called asynchronously after the citation text is resolved.
 *
 * @param {HTMLElement} span
 * @param {string}      citationText  - Resolved full citation(s)
 */
function wireSpan(span, citationText) {
  const tipId  = `ref-tip-${++_tooltipCounter}`;
  const parent = span.parentElement || document.body;

  // Ensure parent can contain an absolutely-positioned child
  if (getComputedStyle(parent).position === "static") {
    parent.style.position = "relative";
  }

  // Span presentation
  span.style.cursor  = "help";
  span.setAttribute("tabindex", "0");

  let tip         = null;
  let showTimer   = null;
  let hideTimer   = null;

  // ---- show ----------------------------------------------------------------
  function showTooltip() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }

    if (!tip) {
      tip = createTooltipElement(parent, citationText, tipId);
    }

    positionTooltip(tip, span, parent);

    showTimer = setTimeout(() => {
      if (!tip) return;
      tip.style.opacity   = "1";
      tip.style.transform = "translateY(0)";
      tip.setAttribute("aria-hidden", "false");
      // A11y: associate trigger with tooltip while visible
      span.setAttribute("aria-describedby", tipId);
    }, 50);
  }

  // ---- hide ----------------------------------------------------------------
  function hideTooltip() {
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }

    if (tip) {
      tip.style.opacity   = "0";
      tip.style.transform = "translateY(-8px)";
      tip.setAttribute("aria-hidden", "true");
      // A11y: remove association when tooltip is hidden
      span.removeAttribute("aria-describedby");

      hideTimer = setTimeout(() => {
        if (tip && tip.parentNode) {
          tip.parentNode.removeChild(tip);
          tip = null;
        }
        hideTimer = null;
      }, 200); // wait for CSS transition
    }
  }

  // ---- event listeners -----------------------------------------------------
  span.addEventListener("mouseenter", showTooltip);
  span.addEventListener("mouseleave", hideTooltip);
  span.addEventListener("focus",      showTooltip);
  span.addEventListener("blur",       hideTooltip);

  // Touch: show + auto-hide after 4 s
  span.addEventListener("touchstart", (e) => {
    showTooltip();
    setTimeout(hideTooltip, 4000);
  }, { passive: true });

  // Keyboard: Enter / Space show; Escape hide
  span.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      showTooltip();
    } else if (e.key === "Escape") {
      hideTooltip();
    }
  });
}

/**
 * Resolve the tooltip text for a span and then wire it.
 * Multi-key (comma-separated) → numbered full citations joined with "\n\n".
 * Missing keys are skipped gracefully; if ALL keys are missing the span is
 * left as plain styled text (no tooltip attached).
 *
 * @param {HTMLElement} span
 * @param {string}      refAttr  - raw value of data-ref
 */
async function enhanceSpan(span, refAttr) {
  const keys = refAttr.split(",").map((k) => k.trim()).filter(Boolean);

  // Resolve each key; collect only found entries
  const entries = (
    await Promise.all(keys.map((k) => getReference(k)))
  ).filter(Boolean);

  if (entries.length === 0) {
    // All keys missing — leave span unstyled (graceful degradation)
    console.warn(`[references] No entries resolved for data-ref="${refAttr}" — span left as plain text`);
    return;
  }

  let citationText;
  if (entries.length === 1) {
    citationText =
      entries[0].fullCitation ||
      entries[0].shortCitation ||
      "Citation unavailable";
  } else {
    // Multiple references: numbered list separated by blank lines
    const numbered = entries.map((e, i) => {
      const c = e.fullCitation || e.shortCitation || `Citation unavailable for ${e.id}`;
      return `${i + 1}. ${c}`;
    });
    citationText = `Multiple References:\n\n${numbered.join("\n\n")}`;
  }

  wireSpan(span, citationText);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Query all [data-ref] spans that have not yet been enhanced, resolve their
 * citations from /data/references.json, and wire tooltip behaviour.
 *
 * Safe to call multiple times (already-enhanced spans are skipped via the
 * `data-ref-enhanced` attribute).
 */
export async function initReferences() {
  const spans = document.querySelectorAll("[data-ref]:not([data-ref-enhanced])");
  if (spans.length === 0) return;

  // Pre-fetch (warms cache for all spans in parallel)
  await fetchReferences();

  for (const span of spans) {
    const refAttr = span.getAttribute("data-ref");
    if (!refAttr) continue;

    // Mark immediately so re-runs don't double-process
    span.setAttribute("data-ref-enhanced", "");

    // Enhance asynchronously (non-blocking per span)
    enhanceSpan(span, refAttr).catch((err) => {
      console.error(`[references] Unexpected error enhancing data-ref="${refAttr}":`, err);
    });
  }
}
