import { ref, computed } from 'vue';
import { useAsyncData, useRuntimeConfig, queryCollection } from '#imports';
import { useConsoleLogger } from '~/composables/useConsoleLogger';

/**
 * Simple composable for fetching content from Nuxt Content
 *
 * This is a minimal abstraction of the content fetching logic from sandbox.vue
 * It provides the same functionality without any additional features or complexity
 *
 * @param {Object} options - Configuration options
 * @param {string} options.path - Content path to fetch (e.g., '/sandbox')
 * @returns {Object} Content fetching state and utilities
 */
export default function useContentFetcher(options) {
  // Get the content path
  const { path } = options;

  // Initialize state
  const contentSuccessfullyRendered = ref(false);
  const technicalErrorDetails = ref(null);
  const errorAction = ref(null);

  // Get environment information
  const isDevelopment = useRuntimeConfig().public.NODE_ENV === 'development';

  // Initialize logger
  const { log, logError } = useConsoleLogger();

  // Log fetch start
  log('content', 'Content fetching started', {
    path,
    timestamp: new Date().toISOString()
  });

  // Fetch content using the same approach as in sandbox.vue
  const { data: content, pending, error, refresh } = useAsyncData(
    `content-${path}`,
    async () => {
      try {
        // Fetch the content using queryCollection
        const result = await queryCollection('content').path(path).first();

        // Handle null/undefined result
        if (result === null || result === undefined) {
          const notFoundError = new Error(`Content not found at path: ${path}`);
          notFoundError.code = 'NOT_FOUND';
          throw notFoundError;
        }

        // Log success
        log('content', 'Content successfully retrieved', {
          path,
          contentType: typeof result
        });

        return result;
      } catch (err) {
        // Log error
        logError('Content error', {
          path,
          error: err.message
        });

        // Store technical details for development mode
        technicalErrorDetails.value = {
          message: err.message,
          stack: err.stack,
          code: err.code,
          context: {
            path,
            timestamp: new Date().toISOString()
          }
        };

        throw err;
      }
    }
  );

  /**
   * Determine if content is renderable
   */
  const isContentRenderable = computed(() => {
    if (!content.value) return false;
    if (typeof content.value !== 'object') return false;
    if (contentSuccessfullyRendered.value) return true;

    // Check for frontmatter
    if (content.value.title && content.value.description) {
      return true;
    }

    // Check for body
    if (content.value.body) {
      return true;
    }

    return false;
  });

  /**
   * Create content preview for non-standard structures
   */
  const contentPreview = computed(() => {
    if (!content.value || typeof content.value !== 'object') {
      return { content: String(content.value) };
    }

    const preview = {};

    // Add metadata
    if (content.value.title) preview.title = content.value.title;
    if (content.value.description) preview.description = content.value.description;

    // Add path
    if (Object.prototype.hasOwnProperty.call(content.value, '_path')) {
      preview.path = content.value['_path'];
    } else if (Object.prototype.hasOwnProperty.call(content.value, 'path')) {
      preview.path = content.value.path;
    }

    // Handle body
    if (content.value.body) {
      if (typeof content.value.body === 'string') {
        preview.body = content.value.body;
      } else if (typeof content.value.body === 'object') {
        try {
          preview.body = JSON.stringify(content.value.body, null, 2);
        } catch (err) {
          preview.body = '[Complex body structure]';
        }
      }
    }

    return preview;
  });

  /**
   * User-friendly error message
   */
  const userFriendlyErrorMessage = computed(() => {
    if (!error.value) return '';
    return error.value.message || 'There was a problem loading the content. Please try again later.';
  });

  /**
   * Error severity
   */
  const errorSeverity = computed(() => {
    return 'error';
  });

  /**
   * Error title
   */
  const errorTitle = computed(() => {
    if (!error.value) return 'Error';
    return 'Error Loading Content';
  });

  /**
   * Mark content as successfully rendered
   */
  const markAsRendered = () => {
    contentSuccessfullyRendered.value = true;
    log('content', 'Content rendering completed', {
      path,
      renderSuccess: true
    });
  };

  // Return the composable API
  return {
    content,
    pending,
    error,
    isContentRenderable,
    contentSuccessfullyRendered,
    userFriendlyErrorMessage,
    errorSeverity,
    errorTitle,
    contentPreview,
    refresh,
    markAsRendered,
    errorAction,
    technicalErrorDetails,
    isDevelopment
  };
}
