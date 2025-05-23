import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ConsoleLogger from '~/components/dev/ConsoleLogger.vue';

/**
 * Mock the useConsoleLogger composable
 *
 * This mock provides all the necessary methods and properties that the
 * ConsoleLogger component expects from the useConsoleLogger composable.
 * It includes mock functions for all logging methods and a replica of the
 * COLORS object with the same color values as the real implementation.
 */
vi.mock('~/composables/useConsoleLogger', () => ({
  useConsoleLogger: () => ({
    isEnabled: { value: true },
    logUI: vi.fn(),
    logRoute: vi.fn(),
    logTheme: vi.fn(),
    logLifecycle: vi.fn(),
    logSuccess: vi.fn(),
    logWarning: vi.fn(),
    logError: vi.fn(),
    logAPI: vi.fn(),
    logPerf: vi.fn(),
    COLORS: {
      ui: '#3498db',
      route: '#9b59b6',
      theme: '#8e44ad',
      lifecycle: '#2ecc71',
      success: '#27ae60',
      warning: '#f39c12',
      error: '#e74c3c',
      api: '#1abc9c',
      perf: '#f1c40f',
      default: '#7f8c8d'
    }
  })
}));

describe('ConsoleLogger', () => {
  /**
   * Set up test environment before each test
   *
   * Mock console.clear to prevent actual console clearing during tests
   * and to allow verifying that it's called when expected.
   */
  beforeEach(() => {
    vi.spyOn(console, 'clear').mockImplementation(() => {});
  });

  it('should render the toggle button when controls are hidden', () => {
    const wrapper = mount(ConsoleLogger, {
      global: {
        stubs: ['v-btn', 'v-card', 'v-card-title', 'v-card-text', 'v-switch', 'v-spacer']
      }
    });

    expect(wrapper.find('.console-logger-toggle').exists()).toBe(true);
    expect(wrapper.find('.console-logger-controls').exists()).toBe(false);
  });

  it('should show controls when toggle button is clicked', async () => {
    const wrapper = mount(ConsoleLogger, {
      global: {
        stubs: ['v-btn', 'v-card', 'v-card-title', 'v-card-text', 'v-switch', 'v-spacer']
      }
    });

    await wrapper.find('.console-logger-toggle v-btn-stub').trigger('click');

    expect(wrapper.find('.console-logger-toggle').exists()).toBe(false);
    expect(wrapper.find('.console-logger-controls').exists()).toBe(true);
  });

  it('should hide controls when close button is clicked', async () => {
    const wrapper = mount(ConsoleLogger, {
      data() {
        return {
          showControls: true
        };
      },
      global: {
        stubs: ['v-btn', 'v-card', 'v-card-title', 'v-card-text', 'v-switch', 'v-spacer']
      }
    });

    await wrapper.find('.console-logger-controls v-card-title-stub v-btn-stub').trigger('click');

    expect(wrapper.find('.console-logger-toggle').exists()).toBe(true);
    expect(wrapper.find('.console-logger-controls').exists()).toBe(false);
  });

  it('should clear console when clear button is clicked', async () => {
    const wrapper = mount(ConsoleLogger, {
      data() {
        return {
          showControls: true
        };
      },
      global: {
        stubs: ['v-btn', 'v-card', 'v-card-title', 'v-card-text', 'v-switch', 'v-spacer']
      }
    });

    const clearButton = wrapper.findAll('v-btn-stub').filter(btn =>
      btn.attributes('color') === 'error'
    )[0];

    await clearButton.trigger('click');

    expect(console.clear).toHaveBeenCalled();
  });

  it('should display color samples for all categories', () => {
    const wrapper = mount(ConsoleLogger, {
      data() {
        return {
          showControls: true
        };
      },
      global: {
        stubs: ['v-btn', 'v-card', 'v-card-title', 'v-card-text', 'v-switch', 'v-spacer']
      }
    });

    const colorSamples = wrapper.findAll('.color-sample');

    // Verify all color categories are displayed (9 specific categories + default)
    expect(colorSamples.length).toBe(10);
  });
});
