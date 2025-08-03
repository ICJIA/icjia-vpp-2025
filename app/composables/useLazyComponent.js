/**
 * Lazy Component Loading Composable
 *
 * Provides intersection-based lazy loading functionality for components.
 * Uses IntersectionObserver to detect when components come into view
 * and triggers loading only when needed.
 *
 * @module useLazyComponent
 */

import { ref, onMounted, onUnmounted } from 'vue';
import { useConsoleLogger } from '~/composables/useConsoleLogger';

/**
 * Create a lazy loading composable for intersection-based component loading
 *
 * @param {Object} options - Configuration options
 * @param {string} options.rootMargin - Margin around root for early loading (default: '100px')
 * @param {number} options.threshold - Intersection threshold (0-1, default: 0.1)
 * @param {boolean} options.once - Whether to observe only once (default: true)
 * @param {string} options.componentName - Name for debugging (optional)
 * @returns {Object} Object containing isVisible ref and targetRef
 */
export const useLazyComponent = (options = {}) => {
  const {
    rootMargin = '100px',
    threshold = 0.1,
    once = true,
    componentName = 'LazyComponent'
  } = options;

  const { log } = useConsoleLogger();
  
  // Reactive state
  const isVisible = ref(false);
  const targetRef = ref(null);
  
  // Observer instance
  let observer = null;

  /**
   * Initialize intersection observer when component is mounted
   */
  onMounted(() => {
    // Skip if no target element or if running on server
    if (!targetRef.value || typeof window === 'undefined') {
      log('lazy-loading', `Skipping lazy loading setup for ${componentName} (no target or SSR)`);
      return;
    }

    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      log('lazy-loading', `IntersectionObserver not supported, loading ${componentName} immediately`);
      isVisible.value = true;
      return;
    }

    try {
      // Create intersection observer
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              log('lazy-loading', `${componentName} entered viewport, triggering load`);
              isVisible.value = true;
              
              // Unobserve if this is a one-time load
              if (once && observer) {
                observer.unobserve(entry.target);
                log('lazy-loading', `${componentName} unobserved (one-time load)`);
              }
            }
          });
        },
        {
          rootMargin,
          threshold
        }
      );

      // Start observing the target element
      observer.observe(targetRef.value);
      log('lazy-loading', `Started observing ${componentName} with rootMargin: ${rootMargin}, threshold: ${threshold}`);

    } catch (error) {
      console.error(`Error setting up lazy loading for ${componentName}:`, error);
      // Fallback: load immediately if observer setup fails
      isVisible.value = true;
    }
  });

  /**
   * Cleanup observer when component is unmounted
   */
  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
      log('lazy-loading', `Cleaned up observer for ${componentName}`);
      observer = null;
    }
  });

  return {
    isVisible,
    targetRef
  };
};
