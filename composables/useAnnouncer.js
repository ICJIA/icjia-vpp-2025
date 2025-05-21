import { ref } from 'vue';

/**
 * Accessibility Announcer Composable
 *
 * A utility for making announcements to screen readers using ARIA live regions.
 * This is essential for notifying screen reader users about dynamic content changes
 * that they might otherwise miss.
 *
 * Features:
 * - Support for both polite and assertive announcement modes
 * - Proper clearing of previous announcements to ensure screen readers detect changes
 * - Simple API that can be used throughout the application
 * - Can be provided via Vue's provide/inject system for global access
 *
 * Usage:
 * ```js
 * // In a component
 * import { useAnnouncer } from '~/composables/useAnnouncer';
 *
 * const { announce } = useAnnouncer();
 *
 * // Make a polite announcement (default)
 * announce('Item added to cart');
 *
 * // Make an assertive (interrupting) announcement
 * announce('Error submitting form', 'assertive');
 * ```
 *
 * Implementation:
 * This composable should be used in conjunction with ARIA live regions in your template:
 * ```html
 * <div aria-live="polite" aria-atomic="true">{{ announcePolite }}</div>
 * <div aria-live="assertive" aria-atomic="true">{{ announceAssertive }}</div>
 * ```
 *
 * @module useAnnouncer
 * @returns {Object} Announcer methods and state
 * @returns {import('vue').Ref<string>} announcePolite - Reactive ref for polite announcements
 * @returns {import('vue').Ref<string>} announceAssertive - Reactive ref for assertive announcements
 * @returns {Function} announce - Function to make an announcement with specified priority
 */
export function useAnnouncer() {
  const announcePolite = ref('');
  const announceAssertive = ref('');

  /**
   * Announce a message to screen readers
   *
   * This function sends a message to screen readers through ARIA live regions.
   * It supports two priority levels:
   *
   * 1. 'polite' (default): Announces when the user is idle, doesn't interrupt
   *    - Use for non-critical updates (item added, page loaded, etc.)
   *
   * 2. 'assertive': Announces immediately, interrupting current speech
   *    - Use sparingly for critical information (errors, alerts, etc.)
   *
   * The function uses a technique of clearing the announcement text first,
   * then setting it after a brief delay. This ensures screen readers detect
   * the change even if the same message is announced twice in succession.
   *
   * @param {string} message - The message to announce to screen readers
   * @param {string} [priority='polite'] - The announcement priority ('polite' or 'assertive')
   * @returns {void}
   *
   * @example
   * // Polite announcement (default)
   * announce('Page loaded successfully');
   *
   * @example
   * // Assertive (interrupting) announcement
   * announce('Form submission failed', 'assertive');
   */
  const announce = (message, priority = 'polite') => {
    if (priority === 'assertive') {
      // Clear first, then set to ensure screen readers announce the change
      // even if the same message is announced twice
      announceAssertive.value = '';
      setTimeout(() => {
        announceAssertive.value = message;
      }, 50);
    } else {
      // Clear first, then set to ensure screen readers announce the change
      // even if the same message is announced twice
      announcePolite.value = '';
      setTimeout(() => {
        announcePolite.value = message;
      }, 50);
    }
  };

  return {
    announcePolite,
    announceAssertive,
    announce
  };
}
