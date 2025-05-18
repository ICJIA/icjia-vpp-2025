import { ref } from 'vue';

/**
 * Composable for announcing messages to screen readers
 * 
 * @returns {Object} Announcer methods and state
 * @property {Ref<string>} announcePolite - Ref for polite announcements
 * @property {Ref<string>} announceAssertive - Ref for assertive announcements
 * @property {Function} announce - Function to make an announcement
 */
export function useAnnouncer() {
  const announcePolite = ref('');
  const announceAssertive = ref('');

  /**
   * Announce a message to screen readers
   * 
   * @param {string} message - The message to announce
   * @param {string} priority - The announcement priority ('polite' or 'assertive')
   */
  const announce = (message, priority = 'polite') => {
    if (priority === 'assertive') {
      // Clear first, then set to ensure screen readers announce the change
      announceAssertive.value = '';
      setTimeout(() => {
        announceAssertive.value = message;
      }, 50);
    } else {
      // Clear first, then set to ensure screen readers announce the change
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
