/**
 * @module SearchInterface
 * @fileoverview Vue component: SearchInterface
 */

/**
 * Search Interface Component
 * 
 * Lazy-loaded search input component that includes VTextField
 * and other heavy Vuetify components not needed in the main bundle.
 */

// Import heavy Vuetify components only when needed
import { VTextField } from 'vuetify/components';

// Register components locally for this component
const components = {
  VTextField
};

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isSearching: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['update:model-value', 'clear', 'focus']);
