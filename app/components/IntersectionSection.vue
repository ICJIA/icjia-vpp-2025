<template>
  <div ref="targetRef" class="intersection-section">
    <!-- Actual content when visible -->
    <div v-if="isVisible" class="intersection-content">
      <slot />
    </div>
    
    <!-- Placeholder/skeleton when not visible -->
    <div 
      v-else-if="showPlaceholder" 
      class="intersection-placeholder"
      :style="{ height: placeholderHeight }"
      role="status"
      aria-label="Loading content..."
    >
      <v-skeleton-loader
        :type="skeletonType"
        :height="skeletonHeight"
        :width="skeletonWidth"
        class="mx-auto"
        :class="skeletonClass"
      />
      
      <!-- Optional loading text -->
      <div v-if="showLoadingText" class="loading-text text-center mt-4">
        <p class="text-body-2 text-medium-emphasis">
          {{ loadingText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Intersection Section Wrapper Component
 *
 * A reusable wrapper component that provides intersection-based lazy loading
 * for any content. Shows skeleton loaders while content is loading and
 * triggers actual component loading when the section comes into view.
 *
 * @component IntersectionSection
 */

import { useLazyComponent } from '~/composables/useLazyComponent';

/**
 * Component props for configuring lazy loading behavior
 */
const props = defineProps({
  /**
   * Root margin for intersection observer (how early to start loading)
   */
  rootMargin: {
    type: String,
    default: '200px'
  },

  /**
   * Intersection threshold (0-1, how much of element must be visible)
   */
  threshold: {
    type: Number,
    default: 0.1
  },

  /**
   * Whether to show skeleton placeholder while loading
   */
  showPlaceholder: {
    type: Boolean,
    default: true
  },

  /**
   * Type of skeleton loader to display
   */
  skeletonType: {
    type: String,
    default: 'card',
    validator: (value) => [
      'card', 'image', 'paragraph', 'sentences', 'article',
      'list-item', 'list-item-avatar', 'list-item-two-line',
      'list-item-three-line', 'table', 'chip', 'button'
    ].includes(value)
  },

  /**
   * Height of the placeholder container
   */
  placeholderHeight: {
    type: [String, Number],
    default: '400px'
  },

  /**
   * Height of the skeleton loader
   */
  skeletonHeight: {
    type: [String, Number],
    default: undefined
  },

  /**
   * Width of the skeleton loader
   */
  skeletonWidth: {
    type: [String, Number],
    default: undefined
  },

  /**
   * Additional CSS classes for skeleton loader
   */
  skeletonClass: {
    type: String,
    default: ''
  },

  /**
   * Whether to show loading text below skeleton
   */
  showLoadingText: {
    type: Boolean,
    default: false
  },

  /**
   * Custom loading text to display
   */
  loadingText: {
    type: String,
    default: 'Loading content...'
  },

  /**
   * Component name for debugging purposes
   */
  componentName: {
    type: String,
    default: 'IntersectionSection'
  }
});

/**
 * Initialize lazy loading with configured options
 */
const { isVisible, targetRef } = useLazyComponent({
  rootMargin: props.rootMargin,
  threshold: props.threshold,
  once: true,
  componentName: props.componentName
});

/**
 * Computed property to format placeholder height
 */
const placeholderHeight = computed(() => {
  if (typeof props.placeholderHeight === 'number') {
    return `${props.placeholderHeight}px`;
  }
  return props.placeholderHeight;
});
</script>

<style scoped>
/**
 * Intersection section container styling
 */
.intersection-section {
  min-height: 0;
  position: relative;
}

/**
 * Placeholder container styling
 */
.intersection-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  transition: opacity 0.3s ease-in-out;
}

/**
 * Content container styling
 */
.intersection-content {
  animation: fadeIn 0.5s ease-in-out;
}

/**
 * Loading text styling
 */
.loading-text {
  opacity: 0.7;
  font-style: italic;
}

/**
 * Fade-in animation for loaded content
 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/**
 * Reduced motion support
 */
@media (prefers-reduced-motion: reduce) {
  .intersection-content {
    animation: none;
  }
  
  .intersection-placeholder {
    transition: none;
  }
}

/**
 * High contrast mode support
 */
@media (prefers-contrast: high) {
  .loading-text {
    opacity: 1;
    font-weight: 600;
  }
}
</style>
