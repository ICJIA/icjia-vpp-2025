/**
 * Utility functions for sanitizing user input to prevent XSS attacks
 */

/**
 * Sanitizes a string by escaping HTML special characters
 * This prevents XSS attacks by ensuring user input cannot be interpreted as HTML
 *
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string with HTML special characters escaped
 */
export function sanitizeString(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
  if (!query || typeof query !== 'string') {
    return '';
  }

  // Trim and limit length more strictly
  let sanitized = query.trim().slice(0, maxLength);

  // Remove potentially dangerous characters more strictly
  // Only allow alphanumeric, spaces, and very basic punctuation
  sanitized = sanitized.replace(/[^\w\s.,?!\-']/g, '');

  // Remove multiple consecutive spaces
  sanitized = sanitized.replace(/\s+/g, ' ');

  // Remove leading/trailing punctuation
  sanitized = sanitized.replace(/^[.,?!\-']+|[.,?!\-']+$/g, '');

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
    /require/gi
  ];

  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
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
  if (!text || !query || typeof text !== 'string' || typeof query !== 'string') {
    return sanitizeString(text || '');
  }

  // First sanitize the input text
  const sanitizedText = sanitizeString(text);

  // Split query into terms and filter out short terms
  const terms = query.trim()
    .split(/\s+/)
    .filter(term => term.length >= minTermLength)
    .map(term => sanitizeString(term));

  if (terms.length === 0) {
    return sanitizedText;
  }

  // Create a safe pattern for highlighting
  let highlightedText = sanitizedText;

  // Process each term
  terms.forEach(term => {
    // Create a safe regex pattern (escape special regex characters)
    const safeTermPattern = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    try {
      // Case-insensitive global replace
      const regex = new RegExp(`(${safeTermPattern})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    } catch (error) {
      console.error('Error in regex highlighting:', error);
      // If regex fails, return the sanitized text without highlighting
      return sanitizedText;
    }
  });

  return highlightedText;
}

/**
 * Sanitizes content for search indexing to prevent malicious code injection
 *
 * @param {string} content - The content to sanitize for indexing
 * @returns {string} - The sanitized content safe for indexing
 */
export function sanitizeContentForIndexing(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  let sanitized = content;

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Remove style tags and their content
  sanitized = sanitized.replace(/<style[\s\S]*?<\/style>/gi, '');

  // Remove HTML comments
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');

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
    /{{[^}]*}}/gi,   // Vue template syntax
  ];

  jsPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, ' ');
  });

  // Remove Vue directives and attributes
  sanitized = sanitized.replace(/\s(v-|:|@)[a-zA-Z0-9\-_]+="[^"]*"/gi, '');

  // Remove class and style attributes that might contain code
  sanitized = sanitized.replace(/\s(class|style)="[^"]*"/gi, '');

  // Remove data attributes
  sanitized = sanitized.replace(/\sdata-[a-zA-Z0-9\-_]+="[^"]*"/gi, '');

  // Remove HTML tags but preserve content
  sanitized = sanitized.replace(/<[^>]*>/g, ' ');

  // Remove URLs to prevent potential security issues
  sanitized = sanitized.replace(/https?:\/\/[^\s]+/gi, '');

  // Remove email addresses to prevent information disclosure
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, '');

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // Limit length to prevent DoS
  if (sanitized.length > 5000) {
    sanitized = sanitized.substring(0, 5000) + '...';
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

  return results.map(result => {
    if (!result || typeof result !== 'object') {
      return null;
    }

    return {
      title: sanitizeString(result.title || ''),
      path: sanitizeString(result.path || ''),
      excerpt: sanitizeString(result.excerpt || ''),
      score: typeof result.score === 'number' ? result.score : 0,
      type: sanitizeString(result.type || '')
    };
  }).filter(result => result !== null);
}

/**
 * Checks if a string contains potentially dangerous content
 *
 * @param {string} str - String to check
 * @returns {boolean} - True if string contains dangerous content
 */
export function containsDangerousContent(str) {
  if (!str || typeof str !== 'string') {
    return false;
  }

  const dangerousPatterns = [
    /<script/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /import\s+/gi,
    /require\s*\(/gi,
    /\$\{/gi, // Template literals
    /{{/gi,   // Template syntax
  ];

  return dangerousPatterns.some(pattern => pattern.test(str));
}
