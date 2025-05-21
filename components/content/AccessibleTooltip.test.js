import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import AccessibleTooltip from './AccessibleTooltip.vue';

// Mock VueUse functions
vi.mock('@vueuse/core', () => ({
  useTimeoutFn: (fn, ms) => ({
    start: () => {
      fn();
    },
    stop: vi.fn()
  }),
  useMediaQuery: (query) => ({
    value: query === '(max-width: 959px)' // Mock as mobile for testing
  }),
  useEventListener: vi.fn()
}));

// Create a test component that uses the tooltip
const TestComponent = {
  components: { AccessibleTooltip },
  template: `
    <div>
      <AccessibleTooltip text="Test tooltip">
        <template v-slot="{ props }">
          <button v-bind="props">Hover me</button>
        </template>
      </AccessibleTooltip>
    </div>
  `
};

describe('AccessibleTooltip', () => {
  let wrapper;
  
  // Set up window and document for testing
  beforeEach(() => {
    // Mock window and document
    global.window = {
      __TOOLTIP_INSTANCES__: new Map()
    };
    
    global.document = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
    
    // Mount the test component
    wrapper = mount(TestComponent, {
      global: {
        stubs: {
          'v-tooltip': {
            template: '<div><slot name="activator" :props="{}"></slot><div v-if="modelValue">{{ text }}</div></div>',
            props: ['text', 'modelValue', 'location', 'openDelay', 'closeDelay', 'aria-label'],
            emits: ['update:model-value']
          }
        }
      }
    });
  });
  
  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });
  
  it('renders the tooltip component', () => {
    expect(wrapper.findComponent(AccessibleTooltip).exists()).toBe(true);
  });
  
  it('shows tooltip when activator is focused', async () => {
    const tooltipComponent = wrapper.findComponent(AccessibleTooltip);
    const button = wrapper.find('button');
    
    // Simulate focus event
    await button.trigger('focus');
    
    // Check if tooltip visibility is updated
    expect(tooltipComponent.vm.isTooltipVisible).toBe(true);
  });
  
  it('closes tooltip when clicking outside', async () => {
    const tooltipComponent = wrapper.findComponent(AccessibleTooltip);
    
    // First make tooltip visible
    tooltipComponent.vm.isTooltipVisible = true;
    await nextTick();
    
    // Simulate document click
    tooltipComponent.vm.handleDocumentClick();
    await nextTick();
    
    // Check if tooltip is hidden
    expect(tooltipComponent.vm.isTooltipVisible).toBe(false);
  });
  
  it('closes other tooltips when a new one becomes visible', async () => {
    // Create a mock tooltip instance
    const mockClose = vi.fn();
    const mockTooltipId = Symbol('mock-tooltip');
    
    // Add mock tooltip to registry
    window.__TOOLTIP_INSTANCES__.set(mockTooltipId, { close: mockClose });
    
    // Get tooltip component
    const tooltipComponent = wrapper.findComponent(AccessibleTooltip);
    
    // Add mock tooltip to registry
    tooltipComponent.vm.tooltipRegistry.add(mockTooltipId);
    
    // Make tooltip visible
    tooltipComponent.vm.handleTooltipVisibilityChange(true);
    await nextTick();
    
    // Check if closeOtherTooltips was called
    expect(mockClose).toHaveBeenCalled();
  });
  
  it('cleans up on unmount', async () => {
    const tooltipComponent = wrapper.findComponent(AccessibleTooltip);
    const tooltipId = tooltipComponent.vm.tooltipId;
    
    // Add tooltip to registry for testing cleanup
    window.__TOOLTIP_INSTANCES__.set(tooltipId, { close: vi.fn() });
    
    // Unmount component
    wrapper.unmount();
    
    // Check if tooltip was removed from registry
    expect(window.__TOOLTIP_INSTANCES__.has(tooltipId)).toBe(false);
  });
});
