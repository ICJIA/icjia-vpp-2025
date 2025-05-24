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
 * @param {number} maxLength - Maximum allowed length (default: 100)
 * @returns {string} - The sanitized search query
 */
export function sanitizeSearchQuery(query, maxLength = 100) {
  if (!query || typeof query !== 'string') {
    return '';
  }
  
  // Trim and limit length
  let sanitized = query.trim().slice(0, maxLength);
  
  // Remove potentially dangerous characters
  // Allow alphanumeric, spaces, and basic punctuation
  sanitized = sanitized.replace(/[^\w\s.,?!-]/g, '');
  
  return sanitized;
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
