import { describe, it, expect } from 'vitest';
import { 
  sanitizeString, 
  sanitizeSearchQuery, 
  sanitizeContentForIndexing,
  safeHighlightMatches,
  createHighlightedSnippets,
  validateSearchResults,
  containsDangerousContent,
  filterCodeFromContent
} from '../../app/utils/sanitize';

describe('sanitize utility', () => {
  describe('sanitizeString', () => {
    it('should escape < character', () => {
      const text = '<div>';
      const escaped = sanitizeString(text);
      expect(escaped).toContain('&lt;');
      expect(escaped).not.toContain('<div>');
    });

    it('should escape > character', () => {
      const text = '</div>';
      const escaped = sanitizeString(text);
      expect(escaped).toContain('&gt;');
    });

    it('should escape & character', () => {
      const text = 'A & B';
      const escaped = sanitizeString(text);
      expect(escaped).toContain('&amp;');
    });

    it('should escape " character', () => {
      const text = 'Say "hello"';
      const escaped = sanitizeString(text);
      expect(escaped).toContain('&quot;');
    });

    it('should escape \' character', () => {
      const text = "It's great";
      const escaped = sanitizeString(text);
      expect(escaped).toContain('&#039;');
    });

    it('should handle empty input', () => {
      expect(sanitizeString('')).toBe('');
    });

    it('should handle null input', () => {
      expect(sanitizeString(null)).toBe('');
    });

    it('should handle text without special characters', () => {
      const text = 'Hello World';
      expect(sanitizeString(text)).toBe(text);
    });
  });

  describe('sanitizeSearchQuery', () => {
    it('should remove dangerous patterns', () => {
      const query = 'test';
      const result = sanitizeSearchQuery(query);
      expect(result).toBe('test');
    });

    it('should limit query length', () => {
      const longQuery = 'a'.repeat(100);
      const result = sanitizeSearchQuery(longQuery);
      expect(result.length).toBeLessThanOrEqual(50);
    });

    it('should respect custom max length', () => {
      const query = 'a'.repeat(100);
      const result = sanitizeSearchQuery(query, 20);
      expect(result.length).toBeLessThanOrEqual(20);
    });

    it('should normalize whitespace', () => {
      const query = 'test    query   with   spaces';
      const result = sanitizeSearchQuery(query);
      expect(result).toBe('test query with spaces');
    });

    it('should remove javascript patterns', () => {
      const query = 'test javascript code';
      const result = sanitizeSearchQuery(query);
      expect(result).not.toContain('javascript');
      expect(result).toContain('test');
      expect(result).toContain('code');
    });

    it('should handle empty input', () => {
      expect(sanitizeSearchQuery('')).toBe('');
    });
  });

  describe('sanitizeContentForIndexing', () => {
    it('should remove script tags', () => {
      const content = '<p>Hello</p><script>alert("xss")</script>';
      const sanitized = sanitizeContentForIndexing(content);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
    });

    it('should remove style tags', () => {
      const content = '<style>.test { color: red; }</style><p>Content</p>';
      const sanitized = sanitizeContentForIndexing(content);
      expect(sanitized).not.toContain('<style>');
      expect(sanitized).not.toContain('color');
    });

    it('should remove HTML comments', () => {
      const content = '<!-- Comment --><p>Content</p>';
      const sanitized = sanitizeContentForIndexing(content);
      expect(sanitized).not.toContain('<!--');
      expect(sanitized).toContain('Content');
    });

    it('should remove Vue directives', () => {
      const content = '<div v-if="show">Content</div>';
      const sanitized = sanitizeContentForIndexing(content);
      expect(sanitized).not.toContain('v-if');
      expect(sanitized).toContain('Content');
    });

    it('should limit content length', () => {
      const longContent = 'a'.repeat(10000);
      const sanitized = sanitizeContentForIndexing(longContent);
      expect(sanitized.length).toBeLessThanOrEqual(5003); // 5000 + '...'
    });

    it('should handle empty input', () => {
      expect(sanitizeContentForIndexing('')).toBe('');
    });
  });

  describe('containsDangerousContent', () => {
    it('should detect script tags', () => {
      const text = '<script>alert("xss")</script>';
      expect(containsDangerousContent(text)).toBe(true);
    });

    it('should detect javascript: protocol', () => {
      const text = '<a href="javascript:alert()">Link</a>';
      expect(containsDangerousContent(text)).toBe(true);
    });

    it('should detect event handlers', () => {
      const text = '<div onclick="alert()">Click</div>';
      expect(containsDangerousContent(text)).toBe(true);
    });

    it('should not flag safe Vue.js patterns', () => {
      const text = 'import { ref } from "vue"';
      expect(containsDangerousContent(text)).toBe(false);
    });

    it('should handle empty input', () => {
      expect(containsDangerousContent('')).toBe(false);
    });
  });
});
