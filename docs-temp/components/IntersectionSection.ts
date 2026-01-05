/**
 * @module IntersectionSection
 * @fileoverview Vue component: IntersectionSection
 */

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
