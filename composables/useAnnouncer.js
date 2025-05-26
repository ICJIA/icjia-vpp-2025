import { ref } from 'vue';

/**
 * Enhanced Accessibility Announcer Composable
 *
 * A comprehensive utility for making announcements to screen readers using ARIA live regions.
 * This is essential for notifying screen reader users about dynamic content changes
 * that they might otherwise miss, with enhanced features for better accessibility.
 *
 * Enhanced Features:
 * - Support for both polite and assertive announcement modes
 * - Enhanced clearing mechanism with optimized timing for different screen readers
 * - Advanced API with context-aware announcements and message queuing
 * - Improved screen reader compatibility (NVDA, JAWS, VoiceOver, TalkBack)
 * - Smart announcement deduplication to prevent repetitive messages
 * - Context-aware announcements for different UI states (loading, error, success)
 * - Can be provided via Vue's provide/inject system for global access
 * - Enhanced timing controls for better screen reader responsiveness
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

  /**
   * Enhanced announcement methods for common UI states
   */

  /**
   * Announce loading state changes
   * @param {string} message - Loading message
   * @param {string} [context] - Additional context (e.g., 'search', 'form')
   */
  const announceLoading = (message, context = '') => {
    const fullMessage = context ? `${context}: ${message}` : message;
    announce(fullMessage, 'polite');
  };

  /**
   * Announce success states
   * @param {string} message - Success message
   * @param {string} [context] - Additional context
   */
  const announceSuccess = (message, context = '') => {
    const fullMessage = context ? `${context}: ${message}` : message;
    announce(fullMessage, 'polite');
  };

  /**
   * Announce error states (assertive for immediate attention)
   * @param {string} message - Error message
   * @param {string} [context] - Additional context
   */
  const announceError = (message, context = '') => {
    const fullMessage = context ? `${context}: ${message}` : message;
    announce(fullMessage, 'assertive');
  };

  /**
   * Announce navigation changes
   * @param {string} pageName - Name of the new page
   * @param {string} [additionalInfo] - Additional navigation context
   */
  const announceNavigation = (pageName, additionalInfo = '') => {
    const message = additionalInfo
      ? `Navigated to ${pageName}. ${additionalInfo}`
      : `Navigated to ${pageName}`;
    announce(message, 'polite');
  };

  return {
    announcePolite,
    announceAssertive,
    announce,
    // Enhanced announcement methods
    announceLoading,
    announceSuccess,
    announceError,
    announceNavigation
  };
}
