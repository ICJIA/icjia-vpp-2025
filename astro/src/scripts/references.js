/**
 * References / Citation Popups
 *
 * Plain ES module — no framework dependency. Ported from
 * app/plugins/references.client.js (Nuxt/Vue wrapper stripped).
 *
 * Exports `initReferences()` which:
 *   - Fetches /data/references.json once (module-level de-duped promise)
 *   - Queries all [data-ref] spans not yet enhanced
 *   - Builds a <div role="tooltip"> per span and wires hover/focus/click/keyboard
 *   - A11y: aria-describedby on trigger span when shown; aria-hidden on tooltip
 *
 * WCAG behaviour (2026-09-16 evaluation, fixed in 2.3.1):
 *   - 1.4.13 dismissible: Escape hides any open tooltip, however it was opened
 *     (a document-level listener, not one on the focused span only).
 *   - 1.4.13 hoverable + persistent: the pointer can move onto the tooltip; it
 *     stays open while the citation or tooltip is hovered, or while the
 *     citation holds keyboard focus or was clicked/tapped, until Escape.
 *   - 2.5.2 pointer cancellation: pointers open it on click (the up-event).
 *     No touchstart; focus that a pointer press gives the citation does not
 *     open it, so pressing and sliding off does nothing.
 *   - 1.4.10 reflow: width capped to the viewport less 16px margins, long URLs
 *     may break anywhere, and the box is clamped inside the viewport.
 *   - Focus stays visible: the tooltip is sized before it is measured and
 *     placed wholly above or below the citation, never over it.
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

/** Widest a tooltip may be, in CSS px, when the viewport allows it. */
const TOOLTIP_MAX_WIDTH = 400;

/** Clearance kept between a tooltip and the viewport's left and right edges. */
const VIEWPORT_MARGIN = 16;

/** Space between a citation and its tooltip. */
const TOOLTIP_GAP = 8;

/**
 * Tooltips currently open, as { dismiss, reposition } handles, so one
 * document-level listener can close them all on Escape and keep them inside
 * the viewport when it changes size.
 *
 * @type {Set<{dismiss: () => void, reposition: () => void}>}
 */
const _openTips = new Set();

/** True while a pointer (mouse button, finger, pen) is pressed down. */
let _pointerIsDown = false;

let _globalListenersAdded = false;

function addGlobalListeners() {
  if (_globalListenersAdded) return;
  _globalListenersAdded = true;

  // WCAG 1.4.13 "dismissible": Escape closes every open tooltip, including
  // one opened by hovering, where focus is not on the citation at all.
  document.addEventListener("keydown", (e) => {
    _pointerIsDown = false;
    if (e.key !== "Escape") return;
    for (const handle of [..._openTips]) handle.dismiss();
  }, true);

  // Track pointer presses so focus given by a press (the down-event) is not
  // treated as a request to open the tooltip (WCAG 2.5.2).
  document.addEventListener("pointerdown", () => { _pointerIsDown = true; }, true);
  document.addEventListener("pointerup", () => { _pointerIsDown = false; }, true);
  document.addEventListener("pointercancel", () => { _pointerIsDown = false; }, true);

  // Only a change of width can push a tooltip out of the viewport. Height
  // alone changes as mobile browser toolbars show and hide while scrolling,
  // and repositioning then would make an open tooltip jump.
  let lastViewportW = document.documentElement.clientWidth;
  window.addEventListener("resize", () => {
    const viewportW = document.documentElement.clientWidth;
    if (viewportW === lastViewportW) return;
    lastViewportW = viewportW;
    for (const handle of _openTips) handle.reposition();
  });
}

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
    max-width: ${TOOLTIP_MAX_WIDTH}px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    text-align: left;
    opacity: 0;
    transform: translateY(-8px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  `;

  parent.appendChild(tip);
  return tip;
}

/**
 * Size `tip`, then position it absolutely (relative to `parent`) above `span`,
 * or below it when it does not fit above, horizontally centred on the span and
 * clamped inside the viewport.
 *
 * The width is settled before anything is measured. Measuring first and then
 * moving the box let it re-wrap taller after placement, so it could cover the
 * focused citation, and a long URL could stretch it past the viewport and
 * widen the page at 320px (WCAG 1.4.10).
 *
 * @param {HTMLElement} tip
 * @param {HTMLElement} span
 * @param {HTMLElement} parent
 */
function positionTooltip(tip, span, parent) {
  const viewportW = document.documentElement.clientWidth;
  const viewportH = window.innerHeight;

  // 1. Width: its natural width, capped by the viewport less its margins.
  const maxW = Math.max(0, Math.min(TOOLTIP_MAX_WIDTH, viewportW - 2 * VIEWPORT_MARGIN));
  tip.style.maxWidth = `${maxW}px`;
  tip.style.width    = "max-content";
  tip.style.left     = "0px";
  tip.style.top      = "0px";
  const tipW = Math.min(Math.ceil(tip.getBoundingClientRect().width), maxW);
  tip.style.width = `${tipW}px`; // frozen: moving the box cannot re-wrap it now
  const tipH = tip.offsetHeight;

  const spanRect   = span.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  // `left`/`top` are measured from the parent's padding box
  const originX = parentRect.left + parent.clientLeft;
  const originY = parentRect.top  + parent.clientTop;

  // 2. Horizontal: centred on the citation, kept inside the viewport.
  let x = spanRect.left + spanRect.width / 2 - tipW / 2;
  x = Math.min(x, viewportW - VIEWPORT_MARGIN - tipW);
  x = Math.max(x, VIEWPORT_MARGIN);

  // 3. Vertical: wholly above or wholly below the citation, never over it.
  //    "Above" must clear the sticky header and may not start above the top
  //    of the document, where it could not be scrolled into view.
  const header   = document.querySelector("header");
  const topLimit = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
  const aboveY   = spanRect.top - TOOLTIP_GAP - tipH;
  const belowY   = spanRect.bottom + TOOLTIP_GAP;
  const fitsAbove = aboveY >= topLimit;
  const fitsBelow = belowY + tipH <= viewportH;
  const moreRoomAbove = spanRect.top - topLimit > viewportH - spanRect.bottom;
  const useAbove = fitsAbove ||
    (!fitsBelow && moreRoomAbove && aboveY + window.scrollY >= 0);
  const y = useAbove ? aboveY : belowY;

  tip.style.left = `${x - originX}px`;
  tip.style.top  = `${y - originY}px`;
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
  let showTimer   = null; // 50ms reveal delay
  let hideTimer   = null; // grace period before hiding (WCAG 1.4.13 hoverable)
  let removeTimer = null; // post-transition DOM removal

  // What holds the tooltip open (WCAG 1.4.13 "persistent"): it stays while
  // either is true, and closes when both are false or on Escape.
  let hovered = false; // pointer is over the citation or over the tooltip
  let engaged = false; // citation has keyboard focus, or was clicked/tapped

  const handle = {
    dismiss() {
      hovered = false;
      engaged = false;
      hideTooltipNow();
    },
    reposition() {
      if (tip) positionTooltip(tip, span, parent);
    },
  };

  addGlobalListeners();

  // ---- show ----------------------------------------------------------------
  function showTooltip() {
    if (hideTimer)   { clearTimeout(hideTimer);   hideTimer   = null; }
    if (removeTimer) { clearTimeout(removeTimer); removeTimer = null; }
    if (showTimer)   { clearTimeout(showTimer);   showTimer   = null; }

    if (!tip) {
      tip = createTooltipElement(parent, citationText, tipId);
      // WCAG 1.4.13 "hoverable": the tooltip itself accepts the pointer, so
      // users can move onto it to read/select long citations without it
      // disappearing.
      tip.addEventListener("mouseenter", () => {
        hovered = true;
        if (hideTimer)   { clearTimeout(hideTimer);   hideTimer   = null; }
        if (removeTimer) { clearTimeout(removeTimer); removeTimer = null; }
      });
      tip.addEventListener("mouseleave", () => {
        hovered = false;
        scheduleHide();
      });
    }

    positionTooltip(tip, span, parent);
    _openTips.add(handle);

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
  function hideTooltipNow() {
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    _openTips.delete(handle);

    if (tip) {
      tip.style.opacity   = "0";
      tip.style.transform = "translateY(-8px)";
      tip.setAttribute("aria-hidden", "true");
      // A11y: remove association when tooltip is hidden
      span.removeAttribute("aria-describedby");

      // Hiding twice (e.g. Escape, then the pointer leaving) must not leave an
      // earlier removal timer behind to remove a tooltip that has reopened.
      if (removeTimer) clearTimeout(removeTimer);
      removeTimer = setTimeout(() => {
        if (tip && tip.parentNode) {
          tip.parentNode.removeChild(tip);
          tip = null;
        }
        removeTimer = null;
      }, 200); // wait for CSS transition
    }
  }

  /**
   * Delayed hide — the grace period lets the pointer travel span → tooltip.
   * Does nothing while keyboard focus or a click still holds the tooltip.
   */
  function scheduleHide() {
    if (engaged) return;
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      hideTimer = null;
      if (!hovered && !engaged) hideTooltipNow();
    }, 300);
  }

  // ---- event listeners -----------------------------------------------------
  // Hover (mouse, pen) shows it; leaving the citation and the tooltip hides it.
  span.addEventListener("mouseenter", () => {
    hovered = true;
    showTooltip();
  });
  span.addEventListener("mouseleave", () => {
    hovered = false;
    scheduleHide();
  });

  // Keyboard focus shows it. Focus that arrives while a pointer is pressed
  // comes from that press (the down-event), so it waits for the click
  // (WCAG 2.5.2). A tap's focus follows the finger lifting, so it shows.
  span.addEventListener("focus", () => {
    if (_pointerIsDown) return;
    engaged = true;
    showTooltip();
  });
  span.addEventListener("blur", () => {
    engaged = false;
    if (!hovered) hideTooltipNow();
  });

  // Click or tap: completes on the up-event, so sliding off cancels it.
  span.addEventListener("click", () => {
    engaged = true;
    showTooltip();
  });

  // Keyboard: Enter / Space show it again after Escape. Escape itself is the
  // document-level listener in addGlobalListeners().
  span.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      engaged = true;
      showTooltip();
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
