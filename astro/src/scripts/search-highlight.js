/**
 * search-highlight.js
 *
 * Browser ES module — framework-agnostic highlight / excerpt helpers.
 * Ported from app/utils/sanitize.js (safeHighlightMatches, createHighlightedSnippets,
 * createFallbackExcerpt, plus the private helpers they depend on).
 *
 * Security contract:
 *   - ALL user/content text is HTML-escaped before being returned.
 *   - The ONLY HTML tags that can survive in the output are <mark> elements
 *     injected by this module — never from the raw input.
 *   - Callers rendering via x-html / innerHTML must use these functions and
 *     must NOT pass the output through any additional HTML-aware layer that
 *     could interpret residual markup.
 *
 * Exported API
 *   escapeHtml(str)                                            → string
 *   sanitizeSearchQuery(query, maxLength)                      → string
 *   safeHighlightMatches(text, query, minTermLength)           → HTML string
 *   createHighlightedSnippets(fuseResult, fieldKey, ctx, max, q) → HTML string
 *   createFallbackExcerpt(item, fieldKey, maxLength)           → HTML string
 *
 * @module search-highlight
 */

// ---------------------------------------------------------------------------
// Core HTML escape — the security foundation of the whole module
// ---------------------------------------------------------------------------

/**
 * Escape HTML special characters so that arbitrary text can be placed safely
 * inside innerHTML / x-html without being interpreted as markup.
 *
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ---------------------------------------------------------------------------
// Query sanitization
// ---------------------------------------------------------------------------

/**
 * Sanitise a search query: trim, length-cap, strip dangerous chars / patterns.
 * Returns a safe plain-text string suitable for passing to Fuse.js.
 *
 * @param {string} query
 * @param {number} [maxLength=50]
 * @returns {string}
 */
export function sanitizeSearchQuery(query, maxLength = 50) {
  if (!query || typeof query !== 'string') return '';

  let s = query.trim().slice(0, maxLength);

  // Allow only alphanumeric, whitespace, and minimal punctuation
  s = s.replace(/[^\w\s.,?!\-']/g, '');

  // Collapse whitespace
  s = s.replace(/\s+/g, ' ');

  // Strip leading/trailing punctuation
  s = s.replace(/^[.,?!\-']+|[.,?!\-']+$/g, '');

  // Block injection keywords
  const BLOCKED = [/script/gi, /javascript/gi, /vbscript/gi, /onload/gi,
                   /onerror/gi, /onclick/gi, /eval/gi, /expression/gi,
                   /import/gi, /require/gi];
  for (const p of BLOCKED) s = s.replace(p, '');

  return s.trim();
}

// ---------------------------------------------------------------------------
// Simple regex-based highlighter (used for title + fallback)
// ---------------------------------------------------------------------------

/**
 * HTML-escape `text` then wrap each occurrence of every query term (length ≥
 * minTermLength) in <mark>.  The query itself is also escaped before building
 * the regex so no user input can inject markup.
 *
 * @param {string} text          — plain text to highlight
 * @param {string} query         — raw search query (may be unsanitised)
 * @param {number} [minTermLength=3]
 * @returns {string}             — HTML string; only <mark> tags present
 */
export function safeHighlightMatches(text, query, minTermLength = 3) {
  if (!text || !query || typeof text !== 'string' || typeof query !== 'string') {
    return escapeHtml(text || '');
  }

  // Escape the content first — eliminates all pre-existing HTML
  let html = escapeHtml(text);

  // Split query into terms; escape each term for both HTML and regex
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= minTermLength)
    .map((t) => escapeHtml(t)); // escaping makes the term safe in HTML context

  if (terms.length === 0) return html;

  for (const term of terms) {
    // Escape special regex metacharacters within the (already HTML-escaped) term
    const reTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
      html = html.replace(new RegExp(`(${reTerm})`, 'gi'), '<mark>$1</mark>');
    } catch {
      // If regex fails (e.g. degenerate input) leave text as-is
    }
  }

  return html;
}

// ---------------------------------------------------------------------------
// Private helpers for index-based snippet building
// ---------------------------------------------------------------------------

/**
 * Filter Fuse.js match indices to those that contain a meaningful search term.
 *
 * @param {Array<[number,number]>} indices
 * @param {string} content
 * @param {string} searchQuery
 * @returns {Array<[number,number]>}
 */
function filterMeaningfulMatches(indices, content, searchQuery) {
  if (!indices || indices.length === 0 || !searchQuery) return indices || [];

  const terms = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  return indices.filter(([start, end]) => {
    const matchText = content.substring(start, end + 1).toLowerCase();
    const len = end - start + 1;
    if (len >= 3) return true;
    return terms.some((t) => t.startsWith(matchText) || t === matchText);
  });
}

/**
 * Merge adjacent / overlapping index pairs so that nearby character matches
 * produce a single contiguous highlight instead of many tiny ones.
 *
 * @param {Array<[number,number]>} indices
 * @param {number} [maxGap=2]
 * @returns {Array<[number,number]>}
 */
function mergeAdjacentIndices(indices, maxGap = 2) {
  if (!indices || indices.length === 0) return [];
  const sorted = [...indices].sort((a, b) => a[0] - b[0]);
  const merged = [[...sorted[0]]];

  for (let i = 1; i < sorted.length; i++) {
    const cur  = sorted[i];
    const last = merged[merged.length - 1];
    if (cur[0] <= last[1] + maxGap) {
      last[1] = Math.max(last[1], cur[1]);
    } else {
      merged.push([...cur]);
    }
  }

  return merged;
}

/**
 * Validate that a candidate match span actually contains one of the search terms.
 * Prevents false-positive highlights from Fuse's fuzzy character scatter.
 *
 * @param {string} matchedText  — lower-cased substring from content
 * @param {string} searchQuery
 * @returns {boolean}
 */
function validateMatchContainsSearchTerm(matchedText, searchQuery) {
  if (!searchQuery || !matchedText) return false;

  const terms = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  const lower = matchedText.toLowerCase();

  return terms.some((term) => {
    if (lower.includes(term) || term.includes(lower)) return true;
    if (new RegExp(`\\b${term}`, 'i').test(matchedText)) return true;
    return lower.split(/\s+/).some((w) => w.startsWith(term) || term.startsWith(w));
  });
}

// ---------------------------------------------------------------------------
// Primary snippet builder — uses Fuse.js match indices
// ---------------------------------------------------------------------------

/**
 * Build up to `maxSnippets` contextual excerpt snippets from the Fuse.js
 * match-index data for `fieldKey`, wrapping matches in <mark>.
 *
 * Security: every plain-text segment is HTML-escaped before being joined with
 * the <mark> tags.  No raw content can survive as markup.
 *
 * @param {object} fuseResult         — result object from fuse.search()
 * @param {string} [fieldKey='content']
 * @param {number} [contextChars=80]  — chars of context on each side of a match
 * @param {number} [maxSnippets=3]
 * @param {string} [searchQuery='']
 * @returns {string}  HTML string containing only <mark> tags
 */
export function createHighlightedSnippets(
  fuseResult,
  fieldKey = 'content',
  contextChars = 80,
  maxSnippets = 3,
  searchQuery = ''
) {
  if (!fuseResult || !fuseResult.item || !fuseResult.matches) return '';

  const item = fuseResult.item;
  const fieldContent = item[fieldKey];
  if (!fieldContent || typeof fieldContent !== 'string') return '';

  const fieldMatches = fuseResult.matches.filter((m) => m.key === fieldKey);

  // If no matches for this field, return a safe plain excerpt from the start
  if (!fieldMatches.length || !fieldMatches[0].indices) {
    const excerpt = fieldContent.substring(0, contextChars * 2);
    return (
      escapeHtml(excerpt) +
      (fieldContent.length > contextChars * 2 ? '...' : '')
    );
  }

  const indices = fieldMatches[0].indices;
  const meaningful = filterMeaningfulMatches(indices, fieldContent, searchQuery);
  const merged = mergeAdjacentIndices(meaningful, 2);

  const snippets = [];

  for (let i = 0; i < Math.min(merged.length, maxSnippets); i++) {
    const [start, end] = merged[i];
    const wordStart = start;
    const wordEnd   = end + 1;

    // Validate this match actually contains a search term
    const exactMatchText = fieldContent.substring(wordStart, wordEnd).toLowerCase();
    if (!validateMatchContainsSearchTerm(exactMatchText, searchQuery)) continue;

    const contextStart = Math.max(0, wordStart - contextChars);
    const contextEnd   = Math.min(fieldContent.length, wordEnd + contextChars);

    const prefix = contextStart > 0 ? '...' : '';
    const suffix = contextEnd < fieldContent.length ? '...' : '';

    const relStart = wordStart - contextStart;
    const relEnd   = wordEnd   - contextStart;
    const snippet  = fieldContent.substring(contextStart, contextEnd);

    const before    = escapeHtml(snippet.substring(0, relStart));
    const matchText = escapeHtml(snippet.substring(relStart, relEnd));
    const after     = escapeHtml(snippet.substring(relEnd));

    snippets.push(
      `${prefix}${before}<mark class="search-highlight" aria-label="highlighted search term">${matchText}</mark>${after}${suffix}`
    );
  }

  return snippets.join(' ... ');
}

// ---------------------------------------------------------------------------
// Fallback excerpt (no match data available)
// ---------------------------------------------------------------------------

/**
 * Produce a plain HTML-escaped excerpt from `item[fieldKey]` (or description /
 * title as fallback).  No highlighting — used when Fuse returns no match indices.
 *
 * @param {object} item
 * @param {string} [fieldKey='content']
 * @param {number} [maxLength=160]
 * @returns {string}  HTML string (no tags — purely text)
 */
export function createFallbackExcerpt(item, fieldKey = 'content', maxLength = 160) {
  if (!item || typeof item !== 'object') return '';

  const raw = item[fieldKey] || item.description || item.title || '';
  if (!raw || typeof raw !== 'string') return '';

  let excerpt = raw.substring(0, maxLength);

  if (raw.length > maxLength) {
    const lastSpace = excerpt.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.7) excerpt = excerpt.substring(0, lastSpace);
    excerpt += '...';
  }

  return escapeHtml(excerpt);
}
