import { describe, it, expect, vi } from 'vitest';
import refreshScrollPlugin from '../../plugins/refresh-scroll.client';

/**
 * Test setup - Mock browser globals
 *
 * These mocks simulate the browser environment for testing the scroll plugin:
 * 1. window.scrollTo - Mock function to verify it's called with correct parameters
 * 2. document - Mock document object with scrollTop properties
 * 3. history - Mock history object with scrollRestoration property
 */

// Mock window.scrollTo
const scrollToMock = vi.fn();
vi.stubGlobal('scrollTo', scrollToMock);

// Mock document.documentElement and document.body
vi.stubGlobal('document', {
  documentElement: { scrollTop: 0 },
  body: { scrollTop: 0 }
});

// Mock history.scrollRestoration
const historyMock = {
  scrollRestoration: 'auto'
};
vi.stubGlobal('history', historyMock);

describe('Refresh Scroll Plugin', () => {
  it('should set history.scrollRestoration to manual', () => {
    // Verify that history.scrollRestoration was set to manual
    expect(historyMock.scrollRestoration).toBe('manual');
  });

  it('should scroll to top immediately when loaded', () => {
    // Verify that window.scrollTo was called with (0, 0)
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it('should set document.documentElement.scrollTop and document.body.scrollTop to 0', () => {
    // Verify that document.documentElement.scrollTop and document.body.scrollTop were set to 0
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);
  });

  it('should return an empty plugin', () => {
    // Run the plugin
    const result = refreshScrollPlugin();

    // Verify that the plugin doesn't provide anything
    expect(result).toBeUndefined();
  });
});
