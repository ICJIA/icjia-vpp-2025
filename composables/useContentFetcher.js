import { ref, computed } from 'vue';
import { useAsyncData, useRuntimeConfig, queryCollection } from '#imports';
import { useConsoleLogger } from '~/composables/useConsoleLogger';

/**
 * Composable for fetching and managing content from Nuxt Content
 *
 * This composable provides a comprehensive solution for fetching, rendering,
 * and error handling when working with Nuxt Content. It includes features for
 * tracking render state, handling errors gracefully, and providing appropriate
 * feedback based on the environment (development vs. production).
 *
 * @param {Object} options - Configuration options
 * @param {string} options.path - Content path to fetch (e.g., '/sandbox')
 * @returns {Object} Content fetching state and utilities including:
 *   - content: Ref containing the fetched content data
 *   - pending: Ref indicating if the fetch is in progress
 *   - error: Ref containing any error that occurred during fetching
 *   - isContentRenderable: Computed boolean indicating if content can be rendered
 *   - contentSuccessfullyRendered: Ref boolean tracking if content was rendered
 *   - userFriendlyErrorMessage: Computed string with user-friendly error message
 *   - errorSeverity: Computed string indicating error severity level
 *   - errorTitle: Computed string with error title
 *   - contentPreview: Computed object with simplified content preview
 *   - refresh: Function to manually refresh the content
 *   - markAsRendered: Function to mark content as successfully rendered
 *   - errorAction: Ref containing any action to take on error
 *   - technicalErrorDetails: Ref containing detailed error information
 *   - isDevelopment: Boolean indicating if running in development mode
 *
 * @example
 * // Basic usage in a Vue component
 * <script setup>
 * import { computed } from 'vue';
 * import useContentFetcher from '~/composables/useContentFetcher';
 *
 * // Fetch content from a specific path
 * const {
 *   content,
 *   pending,
 *   error,
 *   isContentRenderable,
 *   markAsRendered
 * } = useContentFetcher({
 *   path: '/about'
 * });
 *
 * // Create computed properties based on the content
 * const pageTitle = computed(() => content.value?.title || 'Default Title');
 * const pageDescription = computed(() => content.value?.description || 'Default description');
 *
 * // Call markAsRendered when content is successfully displayed
 * function onContentRendered() {
 *   markAsRendered();
 * }
 * </script>
 *
 * @example
 * // Advanced usage with error handling
 * <script setup>
 * import { computed, watch } from 'vue';
 * import useContentFetcher from '~/composables/useContentFetcher';
 *
 * // Fetch content with dynamic path
 * const route = useRoute();
 * const contentPath = computed(() => `/${route.name}`);
 *
 * const {
 *   content,
 *   pending,
 *   error,
 *   refresh,
 *   userFriendlyErrorMessage,
 *   errorTitle,
 *   errorSeverity,
 *   technicalErrorDetails,
 *   isDevelopment
 * } = useContentFetcher({
 *   path: contentPath.value
 * });
 *
 * // Watch for route changes to refresh content
 * watch(() => route.path, () => {
 *   refresh();
 * });
 *
 * // Handle errors with different approaches for dev vs production
 * const errorMessage = computed(() => {
 *   if (!error.value) return null;
 *
 *   // In development, show technical details
 *   if (isDevelopment) {
 *     return {
 *       title: errorTitle.value,
 *       message: technicalErrorDetails.value?.message || userFriendlyErrorMessage.value,
 *       details: technicalErrorDetails.value
 *     };
 *   }
 *
 *   // In production, show user-friendly message
 *   return {
 *     title: errorTitle.value,
 *     message: userFriendlyErrorMessage.value,
 *     severity: errorSeverity.value
 *   };
 * });
 * </script>
 *
 * @example
 * // Usage with ContentDisplay component
 * <template>
 *   <div>
 *     <h1>{{ pageTitle }}</h1>
 *
 *     <div v-if="pending">
 *       <v-progress-circular indeterminate />
 *       <span>Loading content...</span>
 *     </div>
 *
 *     <div v-else-if="error">
 *       <v-alert :type="errorSeverity" :title="errorTitle">
 *         {{ userFriendlyErrorMessage }}
 *       </v-alert>
 *     </div>
 *
 *     <div v-else-if="isContentRenderable">
 *       <ContentRenderer
 *         :value="content"
 *         @rendered="markAsRendered"
 *       />
 *     </div>
 *
 *     <div v-else>
 *       <v-alert type="warning">
 *         No renderable content found
 *       </v-alert>
 *     </div>
 *   </div>
 * </template>
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

  // Fetch content using Nuxt's useAsyncData and queryCollection
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
