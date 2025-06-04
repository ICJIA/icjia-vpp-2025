<template>
  <AccessibleTooltip
    :text="tooltipText"
    :location="location"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    :mobile-close-delay="mobileCloseDelay"
    class="reference-tooltip"
  >
    <template v-slot="{ props }">
      <span
        v-bind="props"
        class="reference-citation"
        :class="{ 'reference-loading': isLoading, 'reference-error': hasError }"
        :aria-label="ariaLabel"
        tabindex="0"
        @keydown.enter="handleKeyboardActivation"
        @keydown.space.prevent="handleKeyboardActivation"
      >
        <slot />
      </span>
    </template>
  </AccessibleTooltip>
</template>

<script setup>
/**
 * Reference Tooltip Component
 *
 * Displays reference information in an accessible tooltip when hovering over
 * or focusing on citation elements. Extends the existing AccessibleTooltip
 * component with reference-specific functionality.
 *
 * Features:
 * - Automatic reference loading by ID(s)
 * - Support for single and multiple references
 * - Accessible keyboard navigation
 * - Loading and error states
 * - WCAG 2.1 AA compliant styling
 * - Mobile-friendly auto-dismiss
 *
 * @component
 * @example Single reference
 * ```vue
 * <ReferenceTooltip reference-id="armstead-2021">
 *   (Armstead et al., 2021)
 * </ReferenceTooltip>
 * ```
 *
 * @example Multiple references
 * ```vue
 * <ReferenceTooltip reference-id="cdc-2019,wilkins-2014">
 *   (CDC, 2019; Wilkins et al., 2014)
 * </ReferenceTooltip>
 * ```
 *
 * @example Custom styling
 * ```vue
 * <ReferenceTooltip 
 *   reference-id="ginwright-2018"
 *   location="top"
 *   :open-delay="100"
 * >
 *   (Ginwright, 2018)
 * </ReferenceTooltip>
 * ```
 */

import { ref, computed, onMounted, watch } from 'vue';
import AccessibleTooltip from './AccessibleTooltip.vue';
import { useReferences } from '~/composables/useReferences';

/**
 * Component props
 */
const props = defineProps({
  /**
   * Reference ID or comma-separated IDs to display
   */
  referenceId: {
    type: String,
    required: true
  },

  /**
   * Position of the tooltip relative to the activator
   */
  location: {
    type: String,
    default: 'top'
  },

  /**
   * Delay before showing the tooltip (in ms)
   */
  openDelay: {
    type: Number,
    default: 200
  },

  /**
   * Delay before hiding the tooltip on desktop (in ms)
   */
  closeDelay: {
    type: Number,
    default: 0
  },

  /**
   * Delay before automatically hiding the tooltip on mobile (in ms)
   */
  mobileCloseDelay: {
    type: Number,
    default: 4000
  }
});

/**
 * Component emits
 */
const emit = defineEmits([
  'reference-loaded',
  'reference-error',
  'tooltip-activated'
]);

// References composable
const { getReference, getMultipleReferences, formatMultipleReferences, isLoading } = useReferences();

// Component state
const references = ref([]);
const loadError = ref(null);
const isLoadingRef = ref(false);

/**
 * Load reference data based on the provided ID(s)
 *
 * @returns {Promise<void>}
 */
const loadReferenceData = async () => {
  if (!props.referenceId) {
    return;
  }

  try {
    isLoadingRef.value = true;
    loadError.value = null;

    // Check if we have multiple references (comma-separated)
    if (props.referenceId.includes(',')) {
      const refs = await getMultipleReferences(props.referenceId);
      references.value = refs;
    } else {
      const ref = await getReference(props.referenceId);
      references.value = ref ? [ref] : [];
    }

    if (references.value.length === 0) {
      throw new Error(`No references found for: ${props.referenceId}`);
    }

    emit('reference-loaded', references.value);
  } catch (error) {
    loadError.value = error;
    console.error('Failed to load reference:', error);
    emit('reference-error', error);
  } finally {
    isLoadingRef.value = false;
  }
};

/**
 * Handle keyboard activation (Enter or Space)
 *
 * @param {KeyboardEvent} event - The keyboard event
 */
const handleKeyboardActivation = (event) => {
  event.preventDefault();
  emit('tooltip-activated', {
    referenceId: props.referenceId,
    references: references.value,
    trigger: 'keyboard'
  });
};

// Computed properties
const hasError = computed(() => loadError.value !== null);

const tooltipText = computed(() => {
  if (isLoadingRef.value) {
    return 'Loading reference...';
  }

  if (hasError.value) {
    return `Reference error: ${loadError.value?.message || 'Unknown error'}`;
  }

  if (references.value.length === 0) {
    return 'Reference not found';
  }

  if (references.value.length === 1) {
    const ref = references.value[0];
    return ref.fullCitation || ref.shortCitation || 'Citation unavailable';
  }

  // Multiple references - show formatted list
  return formatMultipleReferences(references.value);
});

const ariaLabel = computed(() => {
  if (isLoadingRef.value) {
    return 'Loading reference information';
  }

  if (hasError.value) {
    return 'Reference information unavailable';
  }

  if (references.value.length === 0) {
    return 'Reference not found';
  }

  const refCount = references.value.length;
  const refText = refCount === 1 ? 'reference' : 'references';
  return `Citation with ${refCount} ${refText}. Press Enter or Space for details.`;
});

// Load reference data on mount and when referenceId changes
onMounted(() => {
  loadReferenceData();
});

watch(() => props.referenceId, () => {
  loadReferenceData();
});
</script>

<style scoped>
/**
 * Reference Citation Styling
 *
 * Provides visual styling for reference citations that follows WCAG 2.1 AA
 * accessibility guidelines and integrates with the site's design system.
 */

.reference-citation {
  /* Base styling for citation elements */
  cursor: help;
  border-bottom: 1px dotted currentColor;
  text-decoration: none;
  transition: all 0.2s ease;
  
  /* Ensure proper focus visibility */
  outline-offset: 2px;
}

.reference-citation:hover {
  /* Subtle hover effect */
  border-bottom-style: solid;
  border-bottom-width: 2px;
}

.reference-citation:focus {
  /* Enhanced focus state for keyboard navigation */
  border-bottom-style: solid;
  border-bottom-width: 2px;
  outline: 2px solid var(--v-primary-base);
}

/* Loading state */
.reference-loading {
  opacity: 0.7;
  cursor: wait;
  border-bottom-style: dashed;
}

/* Error state */
.reference-error {
  color: var(--v-error-base, #e74c3c);
  border-bottom-color: var(--v-error-base, #e74c3c);
  cursor: help;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .reference-citation {
    border-bottom-width: 2px;
    border-bottom-style: solid;
  }
  
  .reference-citation:hover,
  .reference-citation:focus {
    border-bottom-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .reference-citation {
    transition: none;
  }
}
</style>
