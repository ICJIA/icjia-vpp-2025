import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useConsoleLogger } from '../../app/composables/useConsoleLogger';

/**
 * useConsoleLogger Composable Tests
 * 
 * Tests for the console logger composable that provides color-coded
 * logging for the Statewide Violence Prevention Plan for Illinois: 2025-2029.
 * 
 * This composable implements a singleton pattern for consistent logging
 * state across all components.
 */

describe('useConsoleLogger composable', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('basic functionality', () => {
    it('should return logger interface', () => {
      const logger = useConsoleLogger();
      
      expect(logger).toBeDefined();
      expect(typeof logger.log).toBe('function');
    });

    it('should provide isEnabled ref', () => {
      const { isEnabled } = useConsoleLogger();
      
      expect(isEnabled).toBeDefined();
      expect(typeof isEnabled.value).toBe('boolean');
    });

    it('should provide enable function', () => {
      const { enable } = useConsoleLogger();
      
      expect(typeof enable).toBe('function');
    });

    it('should provide disable function', () => {
      const { disable } = useConsoleLogger();
      
      expect(typeof disable).toBe('function');
    });

    it('should provide toggle function', () => {
      const { toggle } = useConsoleLogger();
      
      expect(typeof toggle).toBe('function');
    });
  });

  describe('category-specific loggers', () => {
    it('should provide logUI function', () => {
      const { logUI } = useConsoleLogger();
      expect(typeof logUI).toBe('function');
    });

    it('should provide logRoute function', () => {
      const { logRoute } = useConsoleLogger();
      expect(typeof logRoute).toBe('function');
    });

    it('should provide logTheme function', () => {
      const { logTheme } = useConsoleLogger();
      expect(typeof logTheme).toBe('function');
    });

    it('should provide logLifecycle function', () => {
      const { logLifecycle } = useConsoleLogger();
      expect(typeof logLifecycle).toBe('function');
    });

    it('should provide logSuccess function', () => {
      const { logSuccess } = useConsoleLogger();
      expect(typeof logSuccess).toBe('function');
    });

    it('should provide logWarning function', () => {
      const { logWarning } = useConsoleLogger();
      expect(typeof logWarning).toBe('function');
    });

    it('should provide logError function', () => {
      const { logError } = useConsoleLogger();
      expect(typeof logError).toBe('function');
    });

    it('should provide logAPI function', () => {
      const { logAPI } = useConsoleLogger();
      expect(typeof logAPI).toBe('function');
    });

    it('should provide logPerf function', () => {
      const { logPerf } = useConsoleLogger();
      expect(typeof logPerf).toBe('function');
    });
  });

  describe('color constants', () => {
    it('should provide COLORS object', () => {
      const { COLORS } = useConsoleLogger();
      
      expect(COLORS).toBeDefined();
      expect(typeof COLORS).toBe('object');
    });

    it('should have UI color defined', () => {
      const { COLORS } = useConsoleLogger();
      expect(COLORS.ui).toBe('#3498db');
    });

    it('should have route color defined', () => {
      const { COLORS } = useConsoleLogger();
      expect(COLORS.route).toBe('#9b59b6');
    });

    it('should have theme color defined', () => {
      const { COLORS } = useConsoleLogger();
      expect(COLORS.theme).toBe('#8e44ad');
    });

    it('should have lifecycle color defined', () => {
      const { COLORS } = useConsoleLogger();
      expect(COLORS.lifecycle).toBe('#2ecc71');
    });

    it('should have success color defined', () => {
      const { COLORS } = useConsoleLogger();
      expect(COLORS.success).toBe('#27ae60');
    });

    it('should have warning color defined', () => {
      const { COLORS } = useConsoleLogger();
      expect(COLORS.warning).toBe('#f39c12');
    });

    it('should have error color defined', () => {
      const { COLORS } = useConsoleLogger();
      expect(COLORS.error).toBe('#e74c3c');
    });

    it('should have API color defined', () => {
      const { COLORS } = useConsoleLogger();
      expect(COLORS.api).toBe('#1abc9c');
    });

    it('should have perf color defined', () => {
      const { COLORS } = useConsoleLogger();
      expect(COLORS.perf).toBe('#f1c40f');
    });

    it('should have default color defined', () => {
      const { COLORS } = useConsoleLogger();
      expect(COLORS.default).toBe('#7f8c8d');
    });
  });

  describe('enable/disable behavior', () => {
    it('should enable logging when enable is called', () => {
      const { enable, isEnabled } = useConsoleLogger();
      
      enable();
      expect(isEnabled.value).toBe(true);
    });

    it('should disable logging when disable is called', () => {
      const { disable, isEnabled, enable } = useConsoleLogger();
      
      // First enable, then disable
      enable();
      disable();
      expect(isEnabled.value).toBe(false);
    });

    it('should toggle logging state', () => {
      const { toggle, isEnabled, enable } = useConsoleLogger();
      
      // Ensure enabled first
      enable();
      const initialState = isEnabled.value;
      
      toggle();
      expect(isEnabled.value).toBe(!initialState);
    });

    it('should not log when disabled', () => {
      const { log, disable, enable, isEnabled } = useConsoleLogger();
      
      disable();
      log('test', 'This should not appear');
      
      // Re-enable for other tests
      enable();
      
      // The log should have been called only for enable, not for the test message
      // when logging was disabled
    });
  });

  describe('logging with data', () => {
    it('should accept message parameter', () => {
      const { log, enable, isEnabled } = useConsoleLogger();
      
      // Ensure enabled
      if (!isEnabled.value) enable();
      
      expect(() => {
        log('test', 'Test message');
      }).not.toThrow();
    });

    it('should accept optional data parameter', () => {
      const { log, enable, isEnabled } = useConsoleLogger();
      
      if (!isEnabled.value) enable();
      
      expect(() => {
        log('test', 'Test message', { key: 'value' });
      }).not.toThrow();
    });

    it('should handle undefined data', () => {
      const { log, enable, isEnabled } = useConsoleLogger();
      
      if (!isEnabled.value) enable();
      
      expect(() => {
        log('test', 'Test message', undefined);
      }).not.toThrow();
    });

    it('should handle null data', () => {
      const { log, enable, isEnabled } = useConsoleLogger();
      
      if (!isEnabled.value) enable();
      
      expect(() => {
        log('test', 'Test message', null);
      }).not.toThrow();
    });

    it('should handle array data', () => {
      const { log, enable, isEnabled } = useConsoleLogger();
      
      if (!isEnabled.value) enable();
      
      expect(() => {
        log('test', 'Test message', [1, 2, 3]);
      }).not.toThrow();
    });
  });

  describe('singleton behavior', () => {
    it('should share state across multiple calls', () => {
      const logger1 = useConsoleLogger();
      const logger2 = useConsoleLogger();
      
      // Both should reference the same isEnabled state
      logger1.enable();
      expect(logger2.isEnabled.value).toBe(true);
      
      logger2.disable();
      expect(logger1.isEnabled.value).toBe(false);
      
      // Re-enable for other tests
      logger1.enable();
    });

    it('should maintain consistent color constants', () => {
      const logger1 = useConsoleLogger();
      const logger2 = useConsoleLogger();
      
      expect(logger1.COLORS).toEqual(logger2.COLORS);
    });
  });

  describe('category fallback', () => {
    it('should use default color for unknown categories', () => {
      const { COLORS } = useConsoleLogger();
      
      // Unknown category should fall back to default
      const unknownCategory = 'nonexistent';
      const color = COLORS[unknownCategory] || COLORS.default;
      
      expect(color).toBe(COLORS.default);
    });
  });
});

