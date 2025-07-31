/**
 * Utility functions for sanitizing user input to prevent XSS attacks
 *
 * This module provides comprehensive sanitization functions for different contexts:
 * - String sanitization for general HTML escaping
 * - Search query sanitization with length limits and pattern filtering
 * - Safe text highlighting without XSS vulnerabilities
 * - Content sanitization for search indexing
 * - Search result validation and sanitization
 * - Dangerous content detection with Vue.js context awareness
 *
 * All functions are designed to handle edge cases gracefully and provide
 * secure defaults when input validation fails.
 *
 * @module sanitize
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 */

/**
 * Sanitizes a string by escaping HTML special characters
 * This prevents XSS attacks by ensuring user input cannot be interpreted as HTML
 *
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string with HTML special characters escaped
 */
export function sanitizeString(str) {
  if (!str || typeof str !== "string") {
    return "";
  }

  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitizes a search query by removing potentially dangerous characters
 * and limiting the length to prevent DoS attacks
 *
 * @param {string} query - The search query to sanitize
 * @param {number} maxLength - Maximum allowed length (default: 50)
 * @returns {string} - The sanitized search query
 */
export function sanitizeSearchQuery(query, maxLength = 50) {
  if (!query || typeof query !== "string") {
    return "";
  }

  // Trim and limit length more strictly
  let sanitized = query.trim().slice(0, maxLength);

  // Remove potentially dangerous characters more strictly
  // Only allow alphanumeric, spaces, and very basic punctuation
  sanitized = sanitized.replace(/[^\w\s.,?!\-']/g, "");

  // Remove multiple consecutive spaces
  sanitized = sanitized.replace(/\s+/g, " ");

  // Remove leading/trailing punctuation
  sanitized = sanitized.replace(/^[.,?!\-']+|[.,?!\-']+$/g, "");

  // Prevent common injection patterns
  const dangerousPatterns = [
    /script/gi,
    /javascript/gi,
    /vbscript/gi,
    /onload/gi,
    /onerror/gi,
    /onclick/gi,
    /eval/gi,
    /expression/gi,
    /import/gi,
    /require/gi,
  ];

  dangerousPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  return sanitized.trim();
}

/**
 * Safely highlight search terms in text without introducing XSS vulnerabilities
 *
 * @param {string} text - The text to highlight
 * @param {string} query - The search query containing terms to highlight
 * @param {number} minTermLength - Minimum term length to consider for highlighting
 * @returns {string} - HTML string with highlighted terms (safe from XSS)
 */
export function safeHighlightMatches(text, query, minTermLength = 3) {
  if (
    !text ||
    !query ||
    typeof text !== "string" ||
    typeof query !== "string"
  ) {
    return sanitizeString(text || "");
  }

  // First sanitize the input text
  const sanitizedText = sanitizeString(text);

  // Split query into terms and filter out short terms
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length >= minTermLength)
    .map((term) => sanitizeString(term));

  if (terms.length === 0) {
    return sanitizedText;
  }

  // Create a safe pattern for highlighting
  let highlightedText = sanitizedText;

  // Process each term
  terms.forEach((term) => {
    // Create a safe regex pattern (escape special regex characters)
    const safeTermPattern = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    try {
      // Case-insensitive global replace - only highlight the exact search term
      // This will find the search term within words and highlight only that part
      const regex = new RegExp(`(${safeTermPattern})`, "gi");
      highlightedText = highlightedText.replace(regex, "<mark>$1</mark>");
    } catch (error) {
      console.error("Error in regex highlighting:", error);
      // If regex fails, return the sanitized text without highlighting
      return sanitizedText;
    }
  });

  return highlightedText;
}

/**
 * Create highlighted contextual snippets using Fuse.js match data
 * This function uses the actual match indices from Fuse.js to create
 * contextual snippets around matched terms with proper highlighting.
 *
 * @param {Object} fuseResult - The result object from Fuse.js search
 * @param {string} fieldKey - The field key to extract matches from (e.g., 'content', 'title')
 * @param {number} contextChars - Number of characters to include around matches for context
 * @param {number} maxSnippets - Maximum number of snippets to return
 * @param {string} searchQuery - The original search query for validation
 * @returns {string} - HTML string with highlighted contextual snippets
 */
export function createHighlightedSnippets(
  fuseResult,
  fieldKey = "content",
  contextChars = 80,
  maxSnippets = 3,
  searchQuery = ""
) {
  if (!fuseResult || !fuseResult.item || !fuseResult.matches) {
    return "";
  }

  const item = fuseResult.item;
  const fieldContent = item[fieldKey];

  if (!fieldContent || typeof fieldContent !== "string") {
    return "";
  }

  // Find matches for the specified field
  const fieldMatches = fuseResult.matches.filter(
    (match) => match.key === fieldKey
  );

  if (!fieldMatches.length || !fieldMatches[0].indices) {
    // If no matches in this field, return a safe excerpt from the beginning
    const excerpt = fieldContent.substring(0, contextChars * 2);
    return (
      sanitizeString(excerpt) +
      (fieldContent.length > contextChars * 2 ? "..." : "")
    );
  }

  const indices = fieldMatches[0].indices;

  // Filter indices to only include meaningful matches
  const filteredIndices = filterMeaningfulMatches(
    indices,
    fieldContent,
    searchQuery
  );

  // Merge overlapping or adjacent indices to create complete word highlights
  const mergedIndices = mergeAdjacentIndices(filteredIndices, 2); // Reduced gap for more precise matching

  const snippets = [];

  // Process each merged match to create contextual snippets
  for (let i = 0; i < Math.min(mergedIndices.length, maxSnippets); i++) {
    const [start, end] = mergedIndices[i];

    // Use exact match boundaries instead of expanding to word boundaries
    // This ensures we only highlight the search term, not the entire word
    const wordStart = start;
    const wordEnd = end + 1;

    // Validate that the exact match contains the search term
    const exactMatchText = fieldContent
      .substring(wordStart, wordEnd)
      .toLowerCase();
    const isValidMatch = validateMatchContainsSearchTerm(
      exactMatchText,
      searchQuery
    );

    if (!isValidMatch) {
      // If exact match doesn't contain search term, skip this match
      continue;
    }

    // Calculate context boundaries
    const contextStart = Math.max(0, wordStart - contextChars);
    const contextEnd = Math.min(fieldContent.length, wordEnd + contextChars);

    // Extract the context around the match
    let snippet = fieldContent.substring(contextStart, contextEnd);

    // Add ellipsis if we're not at the beginning/end
    const prefix = contextStart > 0 ? "..." : "";
    const suffix = contextEnd < fieldContent.length ? "..." : "";

    // Calculate the relative position of the match within the snippet
    const relativeStart = wordStart - contextStart;
    const relativeEnd = wordEnd - contextStart;

    // Split the snippet into parts: before match, match, after match
    const beforeMatch = snippet.substring(0, relativeStart);
    const matchText = snippet.substring(relativeStart, relativeEnd);
    const afterMatch = snippet.substring(relativeEnd);

    // Sanitize each part separately
    const sanitizedBefore = sanitizeString(beforeMatch);
    const sanitizedMatch = sanitizeString(matchText);
    const sanitizedAfter = sanitizeString(afterMatch);

    // Create the highlighted snippet with accessibility attributes
    const highlightedSnippet = `${prefix}${sanitizedBefore}<mark class="search-highlight" aria-label="highlighted search term">${sanitizedMatch}</mark>${sanitizedAfter}${suffix}`;

    snippets.push(highlightedSnippet);
  }

  // Join multiple snippets with a separator and return HTML (not sanitized)
  return snippets.join(" ... ");
}

/**
 * Validate that a matched text actually contains one of the search terms
 * This is the final check to prevent highlighting unrelated words
 *
 * @param {string} matchedText - The text that was matched
 * @param {string} searchQuery - The original search query
 * @returns {boolean} - True if the match is valid
 */
function validateMatchContainsSearchTerm(matchedText, searchQuery) {
  if (!searchQuery || !matchedText) {
    return false;
  }

  const searchTerms = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length >= 2);

  const lowerMatchedText = matchedText.toLowerCase();

  // Check if the matched text contains any of the search terms as a substring
  // Also check for partial matches at word boundaries
  return searchTerms.some((term) => {
    // Direct substring match
    if (lowerMatchedText.includes(term) || term.includes(lowerMatchedText)) {
      return true;
    }

    // Check for word boundary matches (e.g., "violen" should match "violence")
    const wordBoundaryRegex = new RegExp(`\\b${term}`, "i");
    if (wordBoundaryRegex.test(matchedText)) {
      return true;
    }

    // Check if any word in the matched text starts with the search term
    const words = lowerMatchedText.split(/\s+/);
    return words.some((word) => word.startsWith(term) || term.startsWith(word));
  });
}

/**
 * Filter match indices to only include meaningful matches
 * This prevents highlighting of random character matches within unrelated words
 *
 * @param {Array} indices - Array of [start, end] index pairs from Fuse.js
 * @param {string} content - The content being searched
 * @param {string} searchQuery - The original search query
 * @returns {Array} - Filtered index pairs
 */
function filterMeaningfulMatches(indices, content, searchQuery) {
  if (!indices || indices.length === 0 || !searchQuery) return indices;

  const searchTerms = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length >= 2);

  return indices.filter(([start, end]) => {
    const matchText = content.substring(start, end + 1).toLowerCase();
    const matchLength = end - start + 1;

    // Keep matches that are:
    // 1. At least 3 characters long, OR
    // 2. Match the beginning of a search term, OR
    // 3. Are complete short words (2 chars) that match search terms exactly
    if (matchLength >= 3) return true;

    // For shorter matches, check if they're meaningful
    return searchTerms.some((term) => {
      return term.startsWith(matchText) || term === matchText;
    });
  });
}

/**
 * Merge adjacent or overlapping indices to create complete word highlights
 * This prevents highlighting individual characters and creates more meaningful highlights
 *
 * @param {Array} indices - Array of [start, end] index pairs from Fuse.js
 * @param {number} maxGap - Maximum gap between indices to merge
 * @returns {Array} - Merged index pairs
 */
function mergeAdjacentIndices(indices, maxGap = 3) {
  if (!indices || indices.length === 0) return [];

  // Sort indices by start position
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);
  const merged = [sortedIndices[0]];

  for (let i = 1; i < sortedIndices.length; i++) {
    const current = sortedIndices[i];
    const last = merged[merged.length - 1];

    // If current index is close to or overlaps with the last one, merge them
    if (current[0] <= last[1] + maxGap) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

/**
 * Expand match boundaries to word boundaries for better highlighting
 * This ensures we highlight complete words rather than partial characters
 *
 * @param {string} text - The text content
 * @param {number} position - The position to expand from
 * @param {string} direction - 'start' or 'end'
 * @returns {number} - The expanded position
 */
function expandToWordBoundary(text, position, direction) {
  const wordBoundaryRegex = /\s/;

  if (direction === "start") {
    // Expand backwards to find word start
    let start = position;
    while (start > 0 && !wordBoundaryRegex.test(text[start - 1])) {
      start--;
    }
    return start;
  } else {
    // Expand forwards to find word end
    let end = position;
    while (end < text.length && !wordBoundaryRegex.test(text[end])) {
      end++;
    }
    return end;
  }
}

/**
 * Create a fallback excerpt when no matches are found
 * This provides a consistent way to show content previews even when
 * Fuse.js doesn't find specific matches in the requested field.
 *
 * @param {Object} item - The search result item
 * @param {string} fieldKey - The field to extract content from
 * @param {number} maxLength - Maximum length of the excerpt
 * @returns {string} - Sanitized excerpt text
 */
export function createFallbackExcerpt(
  item,
  fieldKey = "content",
  maxLength = 160
) {
  if (!item || typeof item !== "object") {
    return "";
  }

  // Try to get content from the specified field, then fallback to other fields
  const content = item[fieldKey] || item.description || item.title || "";

  if (!content || typeof content !== "string") {
    return "";
  }

  // Create a clean excerpt
  let excerpt = content.substring(0, maxLength);

  // Try to break at a word boundary if we're truncating
  if (content.length > maxLength) {
    const lastSpace = excerpt.lastIndexOf(" ");
    if (lastSpace > maxLength * 0.7) {
      // Only break at word if it's not too short
      excerpt = excerpt.substring(0, lastSpace);
    }
    excerpt += "...";
  }

  return sanitizeString(excerpt);
}

/**
 * Sanitizes content for search indexing to prevent malicious code injection
 *
 * Removes potentially dangerous content including scripts, styles, HTML comments,
 * JavaScript patterns, Vue directives, and other code that could be executed.
 * Designed specifically for preparing content for search indexing where security
 * is paramount. Limits content length to prevent DoS attacks.
 *
 * @param {string} content - The content to sanitize for indexing
 * @returns {string} The sanitized content safe for indexing (max 5000 chars)
 *
 * @throws {Error} Does not throw, handles all input gracefully
 *
 * @example
 * const unsafe = '<script>alert("xss")</script><p>Safe content</p>';
 * const safe = sanitizeContentForIndexing(unsafe);
 * console.log(safe); // "Safe content"
 *
 * @example
 * const vueContent = '<div v-if="show">{{ title }}</div>';
 * const indexed = sanitizeContentForIndexing(vueContent);
 * // Removes Vue directives but preserves text content
 */
export function sanitizeContentForIndexing(content) {
  if (!content || typeof content !== "string") {
    return "";
  }

  let sanitized = content;

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Remove style tags and their content
  sanitized = sanitized.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Remove HTML comments
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, "");

  // Remove JavaScript code patterns
  const jsPatterns = [
    /import\s+.*?from\s+['"][^'"]*['"]/gi,
    /require\s*\(['"][^'"]*['"]\)/gi,
    /export\s+.*?{[\s\S]*?}/gi,
    /function\s+\w+\s*\([^)]*\)\s*{[\s\S]*?}/gi,
    /const\s+\w+\s*=\s*.*?;/gi,
    /let\s+\w+\s*=\s*.*?;/gi,
    /var\s+\w+\s*=\s*.*?;/gi,
    /console\.\w+\([^)]*\)/gi,
    /\$\{[^}]*\}/gi, // Template literals
    /{{[^}]*}}/gi, // Vue template syntax
  ];

  jsPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, " ");
  });

  // Remove Vue directives and attributes
  sanitized = sanitized.replace(/\s(v-|:|@)[a-zA-Z0-9\-_]+="[^"]*"/gi, "");

  // Remove class and style attributes that might contain code
  sanitized = sanitized.replace(/\s(class|style)="[^"]*"/gi, "");

  // Remove data attributes
  sanitized = sanitized.replace(/\sdata-[a-zA-Z0-9\-_]+="[^"]*"/gi, "");

  // Remove HTML tags but preserve content
  sanitized = sanitized.replace(/<[^>]*>/g, " ");

  // Remove URLs to prevent potential security issues
  sanitized = sanitized.replace(/https?:\/\/[^\s]+/gi, "");

  // Remove email addresses to prevent information disclosure
  sanitized = sanitized.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    ""
  );

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, " ").trim();

  // Limit length to prevent DoS
  if (sanitized.length > 5000) {
    sanitized = sanitized.substring(0, 5000) + "...";
  }

  return sanitized;
}

/**
 * Validates that search results are safe to display
 *
 * @param {Array} results - Array of search results to validate
 * @returns {Array} - Validated and sanitized search results
 */
export function validateSearchResults(results) {
  if (!Array.isArray(results)) {
    return [];
  }

  return results
    .map((result) => {
      if (!result || typeof result !== "object") {
        return null;
      }

      return {
        title: sanitizeString(result.title || ""),
        content: sanitizeString(result.content || ""),
        path: sanitizeString(result.path || ""),
        excerpt: result.excerpt || "", // Preserve HTML for v-html rendering (already sanitized in highlighting functions)
        score: typeof result.score === "number" ? result.score : 0,
        type: sanitizeString(result.type || ""),
        description: sanitizeString(result.description || ""),
        fullPath: sanitizeString(result.fullPath || ""),
        frontmatter: result.frontmatter || {},
        sourceFile: sanitizeString(result.sourceFile || ""),
        wordCount: typeof result.wordCount === "number" ? result.wordCount : 0,
        matches: result.matches || [], // Preserve match data for debugging
      };
    })
    .filter((result) => result !== null);
}

/**
 * Checks if a string contains potentially dangerous content
 * Excludes common Vue.js patterns that are safe in search index context
 *
 * @param {string} str - String to check
 * @returns {boolean} - True if string contains dangerous content
 */
export function containsDangerousContent(str) {
  if (!str || typeof str !== "string") {
    return false;
  }

  // Patterns that are actually dangerous in search index context
  const dangerousPatterns = [
    /<script[^>]*>/gi, // Script tags (more specific)
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /eval\s*\(/gi,
    /expression\s*\(/gi,
  ];

  // Check for dangerous patterns first
  const hasDangerousPattern = dangerousPatterns.some((pattern) =>
    pattern.test(str)
  );

  if (!hasDangerousPattern) {
    return false;
  }

  // If dangerous patterns found, check if they're in safe Vue.js context
  // These are common Vue.js patterns that are safe in search index
  const vuePatterns = [
    /import\s+\w+/gi, // ES6 imports (safe in component context)
    /\{\{\s*\w+/gi, // Vue template syntax like {{ title }}
    /\$\{\s*\w+/gi, // Template literals in safe context
    /require\s*\(\s*['"][^'"]+['"]\s*\)/gi, // Safe require statements
  ];

  // Additional safe patterns for CSS and Vue components
  const additionalSafePatterns = [
    /:deep\s*\(/gi, // Vue deep selectors
    /margin-left:\s*\d+px/gi, // CSS margin properties
    /\*\s*H\d+\s*Content/gi, // CSS comments about headings
    /~\s*\*/gi, // CSS sibling selectors
    /\{\{\s*\w+\.\w+\s*\}\}/gi, // Vue template object properties
    /import\s+\{[^}]+\}\s+from/gi, // ES6 named imports
    /export\s+function/gi, // ES6 exports
    /console\.(log|warn|error)/gi, // Console statements
    /navigateTo\s*\(/gi, // Nuxt navigation
    /useHead\s*\(/gi, // Nuxt composables
  ];

  // If content contains Vue patterns or additional safe patterns, it's likely safe
  const hasVuePatterns = vuePatterns.some((pattern) => pattern.test(str));
  const hasAdditionalSafePatterns = additionalSafePatterns.some((pattern) =>
    pattern.test(str)
  );

  // Only flag as dangerous if it has dangerous patterns but no safe context
  return hasDangerousPattern && !hasVuePatterns && !hasAdditionalSafePatterns;
}

/**
 * Comprehensive content filtering to remove CSS, JavaScript, and HTML code
 * This function specifically targets code that shouldn't be in search results
 * @param {string} content - Content to filter
 * @returns {string} - Filtered content with code removed
 */
export function filterCodeFromContent(content) {
  if (!content || typeof content !== "string") {
    return "";
  }

  let filtered = content;

  // Remove CSS code blocks and inline styles
  filtered = filtered.replace(/\/\*[\s\S]*?\*\//g, ""); // CSS comments
  filtered = filtered.replace(/:deep\s*\([^)]*\)[^{]*\{[^}]*\}/g, ""); // Vue deep selectors
  filtered = filtered.replace(/\.[a-zA-Z0-9_-]+\s*\{[^}]*\}/g, ""); // CSS classes
  filtered = filtered.replace(/#[a-zA-Z0-9_-]+\s*\{[^}]*\}/g, ""); // CSS IDs
  filtered = filtered.replace(/[a-zA-Z0-9_-]+\s*:\s*[^;]+;/g, ""); // CSS properties
  filtered = filtered.replace(/margin-left:\s*\d+px/g, ""); // Specific CSS properties
  filtered = filtered.replace(/~\s*\*/g, ""); // CSS sibling selectors

  // Remove JavaScript/Vue code patterns
  filtered = filtered.replace(/import\s+\{[^}]+\}\s+from\s+[^;]+;?/g, ""); // ES6 imports
  filtered = filtered.replace(/import\s+\w+\s+from\s+[^;]+;?/g, ""); // Default imports
  filtered = filtered.replace(/export\s+(default\s+)?function\s+\w+/g, ""); // Function exports
  filtered = filtered.replace(/export\s+\{[^}]+\}/g, ""); // Named exports
  filtered = filtered.replace(/const\s+\w+\s*=\s*[^;]+;?/g, ""); // Const declarations
  filtered = filtered.replace(/let\s+\w+\s*=\s*[^;]+;?/g, ""); // Let declarations
  filtered = filtered.replace(/var\s+\w+\s*=\s*[^;]+;?/g, ""); // Var declarations
  filtered = filtered.replace(/console\.(log|warn|error|info)\([^)]*\);?/g, ""); // Console statements
  filtered = filtered.replace(/\$\{[^}]+\}/g, ""); // Template literals
  filtered = filtered.replace(/\{\{[^}]+\}\}/g, ""); // Vue template syntax

  // Remove HTML/Vue template code
  filtered = filtered.replace(/<template[^>]*>[\s\S]*?<\/template>/g, ""); // Template blocks
  filtered = filtered.replace(/<script[^>]*>[\s\S]*?<\/script>/g, ""); // Script blocks
  filtered = filtered.replace(/<style[^>]*>[\s\S]*?<\/style>/g, ""); // Style blocks
  filtered = filtered.replace(/<[^>]+>/g, ""); // HTML tags
  filtered = filtered.replace(
    /v-[a-zA-Z0-9_-]+(?::[a-zA-Z0-9_-]+)?="[^"]*"/g,
    ""
  ); // Vue directives
  filtered = filtered.replace(/@[a-zA-Z0-9_-]+="[^"]*"/g, ""); // Vue event handlers
  filtered = filtered.replace(/:[a-zA-Z0-9_-]+="[^"]*"/g, ""); // Vue props

  // Remove common code artifacts
  filtered = filtered.replace(/\*\s*@\w+\s+[^\n]*/g, ""); // JSDoc tags
  filtered = filtered.replace(/\/\*\*[\s\S]*?\*\//g, ""); // JSDoc comments
  filtered = filtered.replace(/\/\/[^\n]*/g, ""); // Single-line comments
  filtered = filtered.replace(
    /\b(function|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|new|this|super|class|extends|implements|interface|type|enum|namespace|module|require|define)\b/g,
    ""
  ); // JS keywords

  // Remove common Vue/Nuxt patterns
  filtered = filtered.replace(/use[A-Z]\w+\([^)]*\)/g, ""); // Composables
  filtered = filtered.replace(/navigateTo\([^)]*\)/g, ""); // Nuxt navigation
  filtered = filtered.replace(/\$[a-zA-Z0-9_]+/g, ""); // Vue instance properties

  // Remove file paths and URLs
  filtered = filtered.replace(
    /[a-zA-Z0-9_-]+\.(vue|js|ts|css|scss|sass|less|json|md)/g,
    ""
  ); // File extensions
  filtered = filtered.replace(/https?:\/\/[^\s]+/g, ""); // URLs
  filtered = filtered.replace(
    /\/[a-zA-Z0-9_/-]+\.(vue|js|ts|css|scss|sass|less|json|md)/g,
    ""
  ); // File paths

  // Remove common code symbols and operators
  filtered = filtered.replace(/[{}[\]();,.:=+\-*/%<>!&|^~?]/g, " "); // Code symbols
  filtered = filtered.replace(/\b\d+\b/g, ""); // Numbers (often not meaningful in search)

  // Clean up whitespace and normalize
  filtered = filtered.replace(/\s+/g, " ").trim();

  // Remove very short words that are likely code artifacts
  filtered = filtered
    .split(" ")
    .filter((word) => word.length > 2 && !/^[a-z]{1,2}$/.test(word))
    .join(" ");

  return filtered;
}
