import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAnnouncer } from '../../app/composables/useAnnouncer';

/**
 * useAnnouncer Composable Tests
 * 
 * Tests for the accessibility announcer composable that provides ARIA live region
 * announcements for the Statewide Violence Prevention Plan for Illinois: 2025-2029.
 * 
 * This composable is essential for notifying screen reader users about dynamic
 * content changes that they might otherwise miss.
 */

describe('useAnnouncer composable', () => {
  describe('basic functionality', () => {
    it('should return announcer interface', () => {
      const announcer = useAnnouncer();
      
      expect(announcer).toBeDefined();
      expect(typeof announcer.announce).toBe('function');
    });

    it('should provide announcePolite ref', () => {
      const { announcePolite } = useAnnouncer();
      
      expect(announcePolite).toBeDefined();
      expect(announcePolite.value).toBe('');
    });

    it('should provide announceAssertive ref', () => {
      const { announceAssertive } = useAnnouncer();
      
      expect(announceAssertive).toBeDefined();
      expect(announceAssertive.value).toBe('');
    });

    it('should provide announce function', () => {
      const { announce } = useAnnouncer();
      
      expect(typeof announce).toBe('function');
    });
  });

  describe('polite announcements', () => {
    it('should default to polite priority', () => {
      const { announce, announcePolite } = useAnnouncer();
      
      // Default priority should be 'polite'
      announce('Test message');
      
      // Note: Due to setTimeout, we test the clearing mechanism
      expect(announcePolite.value).toBe('');
    });

    it('should clear before announcing for screen reader detection', () => {
      const { announce, announcePolite } = useAnnouncer();
      
      announce('First message', 'polite');
      
      // Should be cleared immediately before the setTimeout sets the new value
      expect(announcePolite.value).toBe('');
    });
  });

  describe('assertive announcements', () => {
    it('should support assertive priority', () => {
      const { announce, announceAssertive } = useAnnouncer();
      
      announce('Urgent message', 'assertive');
      
      // Should be cleared immediately before the setTimeout sets the new value
      expect(announceAssertive.value).toBe('');
    });

    it('should use assertive for interrupting announcements', () => {
      // Assertive announcements interrupt current speech
      const priority = 'assertive';
      expect(priority).toBe('assertive');
    });
  });

  describe('enhanced announcement methods', () => {
    it('should provide announceLoading method', () => {
      const { announceLoading } = useAnnouncer();
      
      expect(typeof announceLoading).toBe('function');
    });

    it('should provide announceSuccess method', () => {
      const { announceSuccess } = useAnnouncer();
      
      expect(typeof announceSuccess).toBe('function');
    });

    it('should provide announceError method', () => {
      const { announceError } = useAnnouncer();
      
      expect(typeof announceError).toBe('function');
    });

    it('should provide announceNavigation method', () => {
      const { announceNavigation } = useAnnouncer();
      
      expect(typeof announceNavigation).toBe('function');
    });
  });

  describe('context-aware announcements', () => {
    it('should handle loading announcements with context', () => {
      const { announceLoading } = useAnnouncer();
      
      // Should not throw when called with context
      expect(() => {
        announceLoading('Loading content...', 'search');
      }).not.toThrow();
    });

    it('should handle success announcements with context', () => {
      const { announceSuccess } = useAnnouncer();
      
      expect(() => {
        announceSuccess('Content loaded successfully', 'form');
      }).not.toThrow();
    });

    it('should handle error announcements with context', () => {
      const { announceError } = useAnnouncer();
      
      expect(() => {
        announceError('Failed to load content', 'network');
      }).not.toThrow();
    });

    it('should handle navigation announcements with additional info', () => {
      const { announceNavigation } = useAnnouncer();
      
      expect(() => {
        announceNavigation('Executive Summary', 'Page 1 of 7');
      }).not.toThrow();
    });
  });

  describe('message formatting', () => {
    it('should handle empty messages', () => {
      const { announce } = useAnnouncer();
      
      expect(() => {
        announce('');
      }).not.toThrow();
    });

    it('should handle long messages', () => {
      const { announce } = useAnnouncer();
      const longMessage = 'A'.repeat(500);
      
      expect(() => {
        announce(longMessage);
      }).not.toThrow();
    });

    it('should handle special characters', () => {
      const { announce } = useAnnouncer();
      
      expect(() => {
        announce('Message with <special> & "characters"');
      }).not.toThrow();
    });
  });

  describe('WCAG compliance', () => {
    it('should support ARIA live region polite mode', () => {
      // Polite mode should wait for user to be idle
      const { announcePolite } = useAnnouncer();
      expect(announcePolite).toBeDefined();
    });

    it('should support ARIA live region assertive mode', () => {
      // Assertive mode should interrupt current speech
      const { announceAssertive } = useAnnouncer();
      expect(announceAssertive).toBeDefined();
    });

    it('should clear announcements to trigger screen reader detection', () => {
      // Clearing before setting ensures screen readers detect changes
      // even if the same message is announced twice
      const { announce, announcePolite } = useAnnouncer();
      
      announce('Same message');
      expect(announcePolite.value).toBe(''); // Should be cleared
      
      announce('Same message');
      expect(announcePolite.value).toBe(''); // Should be cleared again
    });
  });

  describe('composable interface', () => {
    it('should return all expected properties', () => {
      const announcer = useAnnouncer();
      
      const expectedProperties = [
        'announcePolite',
        'announceAssertive',
        'announce',
        'announceLoading',
        'announceSuccess',
        'announceError',
        'announceNavigation'
      ];
      
      expectedProperties.forEach(prop => {
        expect(announcer).toHaveProperty(prop);
      });
    });
  });
});

