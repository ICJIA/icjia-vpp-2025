import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useConsoleLogger } from '~/composables/useConsoleLogger';

describe('useConsoleLogger', () => {
  /**
   * Set up test environment before each test
   *
   * Mock console.log to prevent actual console output during tests
   * and to allow spying on its calls.
   */
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should provide logging functions', () => {
    const logger = useConsoleLogger();

    expect(logger.log).toBeDefined();
    expect(logger.logUI).toBeDefined();
    expect(logger.logRoute).toBeDefined();
    expect(logger.logTheme).toBeDefined();
    expect(logger.logLifecycle).toBeDefined();
    expect(logger.logSuccess).toBeDefined();
    expect(logger.logWarning).toBeDefined();
    expect(logger.logError).toBeDefined();
    expect(logger.logAPI).toBeDefined();
    expect(logger.logPerf).toBeDefined();
    expect(logger.enable).toBeDefined();
    expect(logger.disable).toBeDefined();
    expect(logger.toggle).toBeDefined();
  });

  it('should log messages when enabled', () => {
    const logger = useConsoleLogger();
    logger.enable();

    logger.log('test', 'Test message');

    expect(console.log).toHaveBeenCalled();
  });

  it('should not log messages when disabled', () => {
    const logger = useConsoleLogger();
    logger.disable();

    logger.log('test', 'Test message');

    expect(console.log).not.toHaveBeenCalled();
  });

  it('should toggle logging state', () => {
    const logger = useConsoleLogger();
    const initialState = logger.isEnabled.value;

    logger.toggle();

    expect(logger.isEnabled.value).toBe(!initialState);

    logger.toggle();

    expect(logger.isEnabled.value).toBe(initialState);
  });

  it('should log with data when provided', () => {
    const logger = useConsoleLogger();
    logger.enable();

    const testData = { test: 'data' };
    logger.log('test', 'Test message', testData);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[TEST]'),
      expect.any(String),
      testData
    );
  });

  it('should log without data when not provided', () => {
    const logger = useConsoleLogger();
    logger.enable();

    logger.log('test', 'Test message');

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[TEST]'),
      expect.any(String)
    );
  });

  it('should use category-specific logging functions', () => {
    const logger = useConsoleLogger();
    logger.enable();

    logger.logUI('UI message');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[UI]'),
      expect.any(String)
    );

    logger.logRoute('Route message');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[ROUTE]'),
      expect.any(String)
    );

    logger.logTheme('Theme message');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[THEME]'),
      expect.any(String)
    );
  });
});
