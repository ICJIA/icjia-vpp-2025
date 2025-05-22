
<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12">
        <!-- Page Header -->
        <v-card
          class="mb-6 rounded-lg"
          elevation="3"
          :theme="isDark ? 'dark' : 'light'"
        >
          <v-card-item>
            <v-card-title class="text-h4 font-weight-bold">
              <v-icon
                icon="mdi-file-document-outline"
                size="large"
                class="me-2"
                aria-hidden="true"
              ></v-icon>
              <span>{{ pageTitle }}</span>
            </v-card-title>
            <v-card-subtitle class="mt-2 text-body-1">
              A demonstration of Nuxt Content v3 functionality
            </v-card-subtitle>
          </v-card-item>
        </v-card>

        <!-- Loading State -->
        <div v-if="pending">
          <v-skeleton-loader
            type="article, paragraph, paragraph"
            class="mb-6 rounded-lg"
            aria-label="Loading content"
            role="status"
          ></v-skeleton-loader>
        </div>

        <!-- Error State -->
        <v-alert
          v-else-if="error"
          :type="errorSeverity"
          :title="errorTitle"
          class="mb-6"
          variant="tonal"
          border="start"
          closable
          role="alert"
          aria-live="assertive"
        >
          <!-- User-friendly error message -->
          <p>{{ userFriendlyErrorMessage }}</p>

          <!-- Actionable information when available -->
          <div v-if="errorAction" class="mt-3">
            <v-btn
              :color="errorSeverity"
              variant="outlined"
              size="small"
              @click="errorAction.handler"
              :aria-label="errorAction.ariaLabel"
            >
              {{ errorAction.label }}
            </v-btn>
          </div>

          <!-- Technical details (development only) -->
          <div v-if="isDevelopment && technicalErrorDetails" class="mt-4 text-caption">
            <v-expansion-panels variant="accordion">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <strong>Developer Details</strong>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="error-details pa-2">
                    <div v-if="error.code" class="mb-2">
                      <strong>Error Code:</strong> {{ error.code }}
                    </div>
                    <div v-if="error.message" class="mb-2">
                      <strong>Message:</strong> {{ error.message }}
                    </div>
                    <div v-if="technicalErrorDetails.stack" class="mb-2">
                      <strong>Stack Trace:</strong>
                      <pre class="stack-trace mt-1">{{ technicalErrorDetails.stack }}</pre>
                    </div>
                    <div v-if="technicalErrorDetails.context" class="mb-2">
                      <strong>Context:</strong>
                      <pre class="context-data mt-1">{{ JSON.stringify(technicalErrorDetails.context, null, 2) }}</pre>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-alert>

        <!-- Content Display or No Content State -->
        <template v-if="!pending && !error">
          <div v-if="content">
            <v-slide-y-transition>
              <v-card
                class="mb-6 rounded-lg content-card"
                elevation="2"
                :theme="isDark ? 'dark' : 'light'"
              >
                <!-- Frontmatter Display -->
                <v-card-item class="pb-0">
                  <v-chip
                    v-if="content.title"
                    color="primary"
                    class="mb-2"
                    size="small"
                    prepend-icon="mdi-tag"
                  >
                    {{ content.title }}
                  </v-chip>
                  <p v-if="content.description" class="text-body-2 mt-2">
                    {{ content.description }}
                  </p>
                </v-card-item>

                <!-- Content Renderer -->
                <v-card-text>
                  <v-divider class="my-4"></v-divider>

                  <!-- Always attempt to render content with ContentRenderer -->
                  <div>
                    <ContentRenderer
                      :value="content"
                      class="content-renderer"
                      @render-complete="onContentRendered"
                    />
                  </div>

                  <!-- Fallback for non-standard content structures - only shown when:
                       1. Content is not detected as renderable by our validation AND
                       2. Content has not been successfully rendered AND
                       3. We're not in debug mode -->
                  <div v-if="(!isContentRenderable && !contentSuccessfullyRendered) || showDebugContentStructure"
                       class="content-fallback mt-8">
                    <v-alert
                      type="info"
                      :title="showDebugContentStructure ? 'Content Structure Debug' : 'Content Preview'"
                      variant="tonal"
                      border="start"
                      class="mb-4"
                    >
                      <template v-if="showDebugContentStructure">
                        This is a debug view of the content structure.
                      </template>
                      <template v-else>
                        This content is available but uses a non-standard format.
                      </template>
                    </v-alert>

                    <div v-if="content && typeof content === 'object'">
                      <div v-for="(value, key) in contentPreview" :key="key" class="mb-4">
                        <div class="text-subtitle-1 font-weight-bold">{{ key }}</div>
                        <pre class="content-preview pa-3">{{ value }}</pre>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-slide-y-transition>
          </div>

          <!-- No Content State -->
          <v-alert
            v-else
            type="info"
            title="No Content Found"
            text="The requested content could not be found."
            class="mb-6"
            variant="tonal"
            border="start"
          ></v-alert>
        </template>

        <!-- How It Works Section -->
        <v-expand-transition>
          <v-card
            v-if="!pending"
            class="mt-8 rounded-lg"
            :color="isDark ? 'primary-darken-1' : 'primary-lighten-5'"
            elevation="1"
          >
            <v-card-item>
              <v-card-title class="text-h5">
                <v-icon icon="mdi-lightbulb-outline" class="me-2" aria-hidden="true"></v-icon>
                How This Works
              </v-card-title>
            </v-card-item>

            <v-card-text>
              <p class="mb-4">
                This page demonstrates how to use Nuxt Content v3 to fetch and display markdown content:
              </p>

              <v-timeline density="compact" align="start">
                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 1: Store Content</div>
                  <p>Content is stored in <code>/content/sandbox.md</code> with frontmatter</p>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 2: Determine Content Path</div>
                  <p>We dynamically determine the content path based on the current route name</p>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 3: Fetch Content</div>
                  <p>We fetch it using <code>queryCollection('content').path(contentPath).first()</code></p>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 4: Handle States</div>
                  <p>We implement loading, error, and empty states for better UX</p>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 5: Render Content</div>
                  <p>The content is rendered with <code>&lt;ContentRenderer&gt;</code> component</p>
                </v-timeline-item>
              </v-timeline>

              <!-- Code Example -->
              <v-sheet
                class="pa-4 mt-4 rounded-lg code-example"
                :color="isDark ? 'grey-darken-3' : 'grey-lighten-4'"
              >
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-code-tags" class="me-2" aria-hidden="true"></v-icon>
                  <span class="text-subtitle-1 font-weight-bold">Code Example</span>
                </div>
                <pre class="code-block"><code>&lt;script setup&gt;
// Get the current route
const route = useRoute();

// Determine content path from route name
const getContentPath = () => {
  const routeName = route.name?.toString() || 'default';
  const baseRouteName = routeName.includes('-')
    ? routeName.split('-').pop()
    : routeName;

  return baseRouteName === 'index' ? '/' : `/${baseRouteName}`;
};

// Get dynamic content path
const contentPath = getContentPath();

// Fetch content from the markdown file
const { data: content, pending, error } = await useAsyncData(
  `content-${contentPath}`,
  () => queryCollection('content').path(contentPath).first()
)

// Use frontmatter for SEO
useSeoMeta({
  title: content.value?.title,
  description: content.value?.description
})
&lt;/script&gt;

&lt;template&gt;
  &lt;!-- Loading state --&gt;
  &lt;v-skeleton-loader v-if="pending" type="article" /&gt;

  &lt;!-- Error state --&gt;
  &lt;v-alert v-else-if="error" type="error" /&gt;

  &lt;!-- Content display --&gt;
  &lt;ContentRenderer v-else-if="content" :value="content" /&gt;

  &lt;!-- No content state --&gt;
  &lt;v-alert v-else type="info" text="No content found" /&gt;
&lt;/template&gt;</code></pre>
              </v-sheet>
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
/**
 * Sandbox page demonstrating Nuxt Content v3 functionality
 *
 * This page shows how to:
 * 1. Fetch markdown content from the content directory
 * 2. Display the content with proper loading and error states
 * 3. Access frontmatter data from the markdown file
 * 4. Render markdown content using ContentRenderer
 * 5. Implement accessible UI components
 *
 * @page
 */
import { useHead, useSeoMeta, useRuntimeConfig, useAsyncData, useRoute, ref, computed, onMounted, watch } from '#imports';
import { useConsoleLogger } from '~/composables/useConsoleLogger';
import { useRouter } from 'vue-router';

// Determine if we're in development mode
const isDevelopment = useRuntimeConfig().public.NODE_ENV === 'development';

// Initialize router for navigation actions
const router = useRouter();

/**
 * Error Handling System
 *
 * This section implements a comprehensive error handling system for content fetching.
 * It's designed to:
 * 1. Provide user-friendly error messages in production
 * 2. Show detailed technical information in development
 * 3. Log all errors consistently
 * 4. Handle specific error types differently
 * 5. Be extractable into a reusable composable
 *
 * The implementation is structured as discrete functions that could be
 * moved to a separate composable in the future.
 */

/**
 * Error type constants
 *
 * These constants define the different types of errors that can occur
 * during content fetching. Using constants instead of string literals
 * makes the code more maintainable and less prone to typos.
 *
 * @type {Object.<string, string>}
 */
const ERROR_TYPES = {
  NETWORK: 'network',
  NOT_FOUND: 'not_found',
  INVALID_CONTENT: 'invalid_content',
  MALFORMED_MARKDOWN: 'malformed_markdown',
  UNKNOWN: 'unknown'
};

/**
 * Technical error details storage
 *
 * This reactive object stores detailed technical information about errors
 * that is only shown in development mode. It's separate from the user-facing
 * error information.
 *
 * @type {import('vue').Ref<Object|null>}
 */
const technicalErrorDetails = ref(null);

/**
 * Error action configuration
 *
 * This reactive object stores information about actions that can be taken
 * to resolve the error, such as retrying or navigating elsewhere.
 *
 * @type {import('vue').Ref<Object|null>}
 */
const errorAction = ref(null);

/**
 * Analyze an error to determine its type
 *
 * This function examines an error object and its context to determine
 * what type of error occurred. This allows for more specific error handling
 * and user messaging.
 *
 * @param {Error} err - The error object
 * @param {Object} context - Additional context about when/where the error occurred
 * @returns {string} The error type from ERROR_TYPES
 */
const analyzeErrorType = (err, context = {}) => {
  // Check for network-related errors
  if (
    err.message?.includes('network') ||
    err.message?.includes('fetch') ||
    err.message?.includes('connection') ||
    err.name === 'NetworkError' ||
    err.code === 'NETWORK_ERROR' ||
    err.code === 'ECONNREFUSED' ||
    err.code === 'ECONNRESET'
  ) {
    return ERROR_TYPES.NETWORK;
  }

  // Check for not found errors
  if (
    err.message?.includes('not found') ||
    err.message?.includes('404') ||
    err.statusCode === 404 ||
    err.code === 'NOT_FOUND' ||
    (context.path && err.message?.includes(context.path))
  ) {
    return ERROR_TYPES.NOT_FOUND;
  }

  // Check for invalid content structure
  if (
    err.message?.includes('invalid') ||
    err.message?.includes('unexpected') ||
    err.message?.includes('schema') ||
    err.message?.includes('structure') ||
    err.code === 'INVALID_CONTENT'
  ) {
    return ERROR_TYPES.INVALID_CONTENT;
  }

  // Check for malformed markdown
  if (
    err.message?.includes('markdown') ||
    err.message?.includes('parse') ||
    err.message?.includes('syntax') ||
    err.code === 'MARKDOWN_ERROR'
  ) {
    return ERROR_TYPES.MALFORMED_MARKDOWN;
  }

  // Default to unknown error type
  return ERROR_TYPES.UNKNOWN;
};

/**
 * Create user-friendly error message based on error type
 *
 * This function generates appropriate user-facing error messages
 * based on the type of error that occurred. Messages are designed
 * to be helpful without exposing technical details.
 *
 * @param {string} errorType - The type of error from ERROR_TYPES
 * @param {Object} context - Additional context about the error
 * @returns {string} A user-friendly error message
 */
const createUserFriendlyMessage = (errorType, context = {}) => {
  switch (errorType) {
    case ERROR_TYPES.NETWORK:
      return 'Unable to load content due to a network issue. Please check your internet connection and try again.';

    case ERROR_TYPES.NOT_FOUND:
      return `The requested content "${context.path || ''}" could not be found. It may have been moved or deleted.`;

    case ERROR_TYPES.INVALID_CONTENT:
      return 'The content could not be displayed because it has an invalid structure. Our team has been notified.';

    case ERROR_TYPES.MALFORMED_MARKDOWN:
      return 'The content could not be displayed due to formatting issues. Our team has been notified.';

    case ERROR_TYPES.UNKNOWN:
    default:
      return 'There was a problem loading the content. Please try again later.';
  }
};

/**
 * Create appropriate error action based on error type
 *
 * This function defines actions that users can take to resolve
 * different types of errors, such as retrying or navigating elsewhere.
 *
 * @param {string} errorType - The type of error from ERROR_TYPES
 * @param {Function} retryFn - Function to call to retry the operation
 * @returns {Object|null} Action configuration or null if no action is available
 */
const createErrorAction = (errorType, retryFn) => {
  switch (errorType) {
    case ERROR_TYPES.NETWORK:
    case ERROR_TYPES.UNKNOWN:
      return {
        label: 'Retry',
        handler: retryFn,
        ariaLabel: 'Retry loading the content'
      };

    case ERROR_TYPES.NOT_FOUND:
      return {
        label: 'Go to Homepage',
        handler: () => router.push('/'),
        ariaLabel: 'Navigate to the homepage'
      };

    // For other error types, no action is provided
    default:
      return null;
  }
};

/**
 * Determine error severity for UI display
 *
 * This function maps error types to Vuetify alert severities
 * to provide appropriate visual treatment.
 *
 * @param {string} errorType - The type of error from ERROR_TYPES
 * @returns {string} Vuetify alert type ('error', 'warning', or 'info')
 */
const getErrorSeverity = (errorType) => {
  switch (errorType) {
    case ERROR_TYPES.NETWORK:
    case ERROR_TYPES.UNKNOWN:
      return 'error';

    case ERROR_TYPES.INVALID_CONTENT:
    case ERROR_TYPES.MALFORMED_MARKDOWN:
      return 'warning';

    case ERROR_TYPES.NOT_FOUND:
      return 'info';

    default:
      return 'error';
  }
};

/**
 * Get appropriate error title based on error type
 *
 * This function provides a concise title for the error alert
 * based on the type of error that occurred.
 *
 * @param {string} errorType - The type of error from ERROR_TYPES
 * @returns {string} A short, descriptive error title
 */
const getErrorTitle = (errorType) => {
  switch (errorType) {
    case ERROR_TYPES.NETWORK:
      return 'Network Error';

    case ERROR_TYPES.NOT_FOUND:
      return 'Content Not Found';

    case ERROR_TYPES.INVALID_CONTENT:
      return 'Invalid Content Structure';

    case ERROR_TYPES.MALFORMED_MARKDOWN:
      return 'Content Format Error';

    case ERROR_TYPES.UNKNOWN:
    default:
      return 'Error Loading Content';
  }
};

/**
 * Handle content fetching error
 *
 * This is the main error handling function that orchestrates the error
 * handling process. It:
 * 1. Analyzes the error to determine its type
 * 2. Creates appropriate user-facing messages and actions
 * 3. Stores technical details for development mode
 * 4. Logs the error with the console logger
 *
 * This function is designed to be called from the catch block of
 * content fetching operations.
 *
 * @param {Error} err - The error object
 * @param {Object} context - Additional context about the error
 * @param {Function} [retryFn] - Optional function to retry the operation
 */
const handleContentError = (err, context = {}, retryFn = null) => {
  // Determine the type of error
  const errorType = analyzeErrorType(err, context);

  // Store technical details for development mode
  technicalErrorDetails.value = {
    errorType,
    message: err.message,
    stack: err.stack,
    code: err.code,
    context: {
      ...context,
      timestamp: new Date().toISOString()
    }
  };

  // Set up error action if a retry function is provided
  if (retryFn) {
    // Use the retry function directly instead of retryContentFetch
    errorAction.value = createErrorAction(errorType, retryFn);
  } else {
    errorAction.value = null;
  }

  // Log the error with appropriate detail level based on environment
  logError('Content error handled', {
    errorType,
    message: err.message,
    path: context.path,
    // Only include stack trace and full context in development
    ...(isDevelopment ? {
      stack: err.stack,
      fullContext: context
    } : {})
  });

  // Return the error type for potential further handling
  return errorType;
};

// Note: The refresh function from useAsyncData is used directly for retrying content fetching
// This approach is more efficient than reloading the entire page with router.go(0)

/**
 * Determine if content is renderable by ContentRenderer
 *
 * This computed property checks if the content has the expected structure
 * that can be rendered by the ContentRenderer component. If not, we'll
 * display a fallback view.
 *
 * The logic has been made more permissive to handle various content structures
 * that Nuxt Content might return, especially for standard markdown files.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isContentRenderable = computed(() => {
  // First check if content exists
  if (!content.value) return false;

  // Check if content is an object (required for ContentRenderer)
  if (typeof content.value !== 'object') return false;

  // IMPORTANT: If content has been successfully rendered, always return true
  // This prevents false negatives when content renders correctly but structure validation fails
  if (contentSuccessfullyRendered.value) return true;

  // If we have title and description, it's likely a valid markdown document
  // This is a common pattern for markdown files with frontmatter
  if (content.value.title && content.value.description) {
    return true;
  }

  // Check for standard Nuxt Content structure with body property
  if (content.value.body) {
    // If body is an object with children array, it's the standard structure
    if (
      typeof content.value.body === 'object' &&
      content.value.body.children &&
      Array.isArray(content.value.body.children)
    ) {
      return true;
    }

    // If body is a string, it might be raw content that can be rendered
    if (typeof content.value.body === 'string' && content.value.body.trim().length > 0) {
      return true;
    }

    // If body has any content property, assume it's renderable
    // This catches various Nuxt Content structures
    if (typeof content.value.body === 'object' && Object.keys(content.value.body).length > 0) {
      return true;
    }
  }

  // If we have _id and _path properties, it's likely a Nuxt Content document
  // even if it doesn't have the expected body structure
  if (
    content.value &&
    (Object.prototype.hasOwnProperty.call(content.value, '_id') ||
     Object.prototype.hasOwnProperty.call(content.value, '_path') ||
     Object.prototype.hasOwnProperty.call(content.value, 'path'))
  ) {
    return true;
  }

  // If we have any markdown-specific properties, assume it's renderable
  if (
    content.value.excerpt ||
    content.value.toc ||
    content.value.readingTime ||
    content.value.layout
  ) {
    return true;
  }

  // Otherwise, it's not renderable by ContentRenderer
  return false;
});

/**
 * Create a preview of content for non-standard structures
 *
 * This computed property creates a simplified view of the content
 * for display when it can't be rendered by ContentRenderer.
 *
 * @type {import('vue').ComputedRef<Object>}
 */
const contentPreview = computed(() => {
  if (!content.value || typeof content.value !== 'object') {
    return { content: String(content.value) };
  }

  // Create a safe preview object
  const preview = {};

  // Add metadata fields
  if (content.value.title) preview.title = content.value.title;
  if (content.value.description) preview.description = content.value.description;

  // Add path information if available
  // Use hasOwnProperty to safely check for properties
  if (Object.prototype.hasOwnProperty.call(content.value, '_path')) {
    preview.path = content.value['_path'];
  } else if (Object.prototype.hasOwnProperty.call(content.value, 'path')) {
    preview.path = content.value.path;
  }

  // Handle different body structures
  if (content.value.body) {
    if (typeof content.value.body === 'string') {
      preview.body = content.value.body;
    } else if (typeof content.value.body === 'object') {
      // Safely stringify the body object
      try {
        preview.body = JSON.stringify(content.value.body, null, 2);
      } catch (err) {
        preview.body = '[Complex body structure]';
      }
    }
  }

  // Add other fields that might be useful
  const otherFields = Object.keys(content.value).filter(key =>
    !['title', 'description', '_path', 'body'].includes(key) &&
    !key.startsWith('_')
  );

  if (otherFields.length > 0) {
    preview.otherFields = otherFields.map(key => `${key}: ${JSON.stringify(content.value[key])}`).join('\n');
  }

  return preview;
});

/**
 * Computed property for user-friendly error message
 *
 * This computed property generates an appropriate user-facing
 * error message based on the current error.
 *
 * @type {import('vue').ComputedRef<string>}
 */
const userFriendlyErrorMessage = computed(() => {
  if (!error.value) return '';

  // If we have technical details with an error type, use that
  if (technicalErrorDetails.value?.errorType) {
    return createUserFriendlyMessage(
      technicalErrorDetails.value.errorType,
      { path: contentPath }
    );
  }

  // Fallback to the error message or a generic message
  return error.value.message || 'There was a problem loading the content. Please try again later.';
});

/**
 * Computed property for error severity
 *
 * This computed property determines the appropriate Vuetify
 * alert type based on the current error.
 *
 * @type {import('vue').ComputedRef<string>}
 */
const errorSeverity = computed(() => {
  if (!error.value) return 'error';

  // If we have technical details with an error type, use that
  if (technicalErrorDetails.value?.errorType) {
    return getErrorSeverity(technicalErrorDetails.value.errorType);
  }

  // Default to error severity
  return 'error';
});

/**
 * Computed property for error title
 *
 * This computed property generates an appropriate title
 * for the error alert based on the current error.
 *
 * @type {import('vue').ComputedRef<string>}
 */
const errorTitle = computed(() => {
  if (!error.value) return 'Error';

  // If we have technical details with an error type, use that
  if (technicalErrorDetails.value?.errorType) {
    return getErrorTitle(technicalErrorDetails.value.errorType);
  }

  // Default to generic error title
  return 'Error Loading Content';
});

/**
 * Initialize console logger with custom content logging
 *
 * We're creating a custom content logging function with a distinct color (cyan)
 * for content-related operations. This helps distinguish content logs from other
 * types of logs in the console.
 *
 * NOTE: Console logging is intentionally enabled in all environments (including production)
 * during the pre-launch phase for monitoring and debugging purposes.
 */
const { log, logError } = useConsoleLogger();

/**
 * Log content-related events with cyan color
 *
 * @param {string} message - The message to log
 * @param {any} [data] - Optional data to log
 */
const logContent = (message, data) => {
  // Use a custom 'content' category with cyan color (#00BCD4)
  log('content', message, data);
};

// Add the custom content color to the console if in development mode
if (isDevelopment && typeof window !== 'undefined') {
  // This is just for development visualization in the console
  console.log(
    '%c[CONTENT] Color sample for content logs',
    'color: #00BCD4; font-weight: bold;'
  );
}

// Use a simpler approach for theme detection
const isDark = ref(false);
onMounted(() => {
  // Check for dark theme preference on client-side only
  try {
    const { $vuetify } = useNuxtApp();
    if ($vuetify && $vuetify.theme) {
      isDark.value = $vuetify.theme.global.current.value.dark;

      // Watch for theme changes
      watch(() => $vuetify.theme.global.current.value.dark, (newVal) => {
        isDark.value = newVal;
      });
    }
  } catch (error) {
    console.error('Theme detection error:', error);
  }
});

/**
 * Set page title and HTML attributes for accessibility and SEO
 */
useHead({
  title: 'Nuxt Content Demo - Violence Prevention Plan for Illinois: 2025-2029',
  htmlAttrs: {
    lang: 'en'
  }
});

/**
 * Fetch content from the markdown file in the content directory based on current route
 *
 * Uses queryCollection to fetch content from the 'content' collection
 * The path is dynamically determined from the current route name
 * We use useAsyncData to handle the async operation with proper loading and error states
 */

// Get the current route
const route = useRoute();

/**
 * Determine the content path based on the current route name
 *
 * This function converts the route name to a content path:
 * - Removes any parent route segments (everything after the last hyphen)
 * - Handles index routes by converting them to the appropriate path
 * - Falls back to 'sandbox' if the route name is undefined or empty
 *
 * @returns {string} The content path to fetch
 */
const getContentPath = () => {
  // Get the route name, fallback to 'sandbox' if undefined
  const routeName = route.name?.toString() || 'sandbox';

  // Handle nested routes by taking only the last part of the route name
  // For example, 'parent-child' becomes 'child'
  const baseRouteName = routeName.includes('-')
    ? routeName.split('-').pop()
    : routeName;

  // Handle index routes (convert 'index' to appropriate path)
  if (baseRouteName === 'index') {
    return '/';
  }

  // Return the path with leading slash
  return `/${baseRouteName}`;
};

// Get the content path for the current route
const contentPath = getContentPath();

// Log the content fetching start with detailed context
logContent('Content fetching started', {
  route: route.name,
  path: contentPath,
  timestamp: new Date().toISOString(),
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side',
});

// Create a timestamp for performance tracking
// Use a safe approach that works in both browser and server environments
const fetchStartTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

// Fetch the content with enhanced error handling
const { data: content, pending, error, refresh } = await useAsyncData(
  `content-${contentPath}`, // Use dynamic key based on path
  async () => {
    try {
      // Fetch the content
      const result = await queryCollection('content').path(contentPath).first();

      // Validate content structure with more flexible validation
      if (result === null || result === undefined) {
        // Handle missing content explicitly
        const notFoundError = new Error(`Content not found at path: ${contentPath}`);
        notFoundError.code = 'NOT_FOUND';
        throw notFoundError;
      }

      // Log the content structure for debugging
      if (isDevelopment) {
        console.log(`[DEBUG] Content structure for ${contentPath}:`, {
          type: typeof result,
          hasBody: result && typeof result === 'object' && 'body' in result,
          bodyType: result && typeof result === 'object' && result.body ? typeof result.body : 'none',
          keys: result && typeof result === 'object' ? Object.keys(result) : []
        });
      }

      // More permissive validation that accepts different content structures
      // Nuxt Content can return different structures depending on the content type
      if (typeof result !== 'object') {
        const invalidTypeError = new Error(`Invalid content type: expected object, got ${typeof result}`);
        invalidTypeError.code = 'INVALID_CONTENT';
        throw invalidTypeError;
      }

      // Calculate fetch duration for performance monitoring
      // Use the same timing API that was used to create the start time
      const fetchDuration = typeof performance !== 'undefined'
        ? performance.now() - fetchStartTime
        : Date.now() - fetchStartTime;

      // Log successful content retrieval with detailed information
      // Use a try-catch block to ensure logging doesn't cause additional errors
      try {
        // Create a safe version of the content structure for logging
        const safeContentInfo = {
          path: contentPath,
          duration: `${fetchDuration.toFixed(2)}ms`,
          contentType: typeof result,
          // Safely check for various content structures
          hasBody: Boolean(result && typeof result === 'object' && 'body' in result),
          // Extract frontmatter safely
          frontmatter: result && typeof result === 'object' ? {
            title: result.title || null,
            description: result.description || null,
            hasOtherMetadata: Object.keys(result).filter(key =>
              !['title', 'description', '_id', '_path', 'body'].includes(key)
            ).length > 0
          } : null
        };

        // Only add body information if it exists and is safe to access
        if (result && typeof result === 'object' && result.body) {
          // Handle different body structures
          if (result.body.children && Array.isArray(result.body.children)) {
            safeContentInfo.bodyStructure = 'standard';
            safeContentInfo.bodyLength = result.body.children.length;
          } else if (typeof result.body === 'string') {
            safeContentInfo.bodyStructure = 'string';
            safeContentInfo.bodyLength = result.body.length;
          } else {
            safeContentInfo.bodyStructure = 'other';
            safeContentInfo.bodyKeys = Object.keys(result.body);
          }
        }

        logContent('Content successfully retrieved', safeContentInfo);
      } catch (logError) {
        // If logging fails, log a simpler message
        console.warn('Error while logging content info:', logError);
        logContent('Content successfully retrieved (logging error)', {
          path: contentPath,
          error: logError.message
        });
      }

      // Clear any previous error state
      if (technicalErrorDetails.value) {
        technicalErrorDetails.value = null;
        errorAction.value = null;
      }

      return result;
    } catch (err) {
      // Use our enhanced error handling system
      const context = {
        path: contentPath,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side',
        fetchStartTime,
        routeName: route.name
      };

      // Process the error through our error handling system
      handleContentError(err, context, () => refresh());

      // Re-throw the error to be caught by useAsyncData
      // This ensures the error state is properly set
      throw err;
    }
  }
);

/**
 * Set SEO metadata based on content frontmatter
 */
useSeoMeta({
  title: computed(() => content.value?.title || 'Nuxt Content Demo'),
  description: computed(() => content.value?.description || 'A demonstration of Nuxt Content v3 functionality.'),
  ogTitle: computed(() => content.value?.title || 'Nuxt Content Demo'),
  ogDescription: computed(() => content.value?.description || 'A demonstration of Nuxt Content v3 functionality.')
});

/**
 * Computed property for page title
 * Falls back to a default if content title is not available
 */
const pageTitle = computed(() => {
  return content.value?.title || 'Nuxt Content Demo';
});

/**
 * Track content rendering time for performance monitoring
 */
const renderStartTime = ref(0);

/**
 * Track whether content has been successfully rendered
 * This is used to prevent showing fallback content when rendering succeeds
 * even if our structure validation is imperfect
 */
const contentSuccessfullyRendered = ref(false);

/**
 * Debug flag to help diagnose content structure issues
 * When true, will show both the rendered content and the fallback preview
 * This is useful for development only
 */
const showDebugContentStructure = ref(isDevelopment && false); // Set to true to enable debug mode

/**
 * Called when content starts rendering
 * This is triggered when the content becomes available and rendering begins
 */
onMounted(() => {
  // Only run this on the client side where we have access to the DOM
  if (typeof window !== 'undefined') {
    // Check if content is already available
    if (content.value && !pending.value) {
      // Use a safe approach for performance tracking
      renderStartTime.value = typeof performance !== 'undefined'
        ? performance.now()
        : Date.now();

      logContent('Content rendering started', {
        path: contentPath,
        timestamp: new Date().toISOString(),
        environment: 'client'
      });
    }
  }
});

/**
 * Called when content rendering is complete
 * This is triggered by the ContentRenderer component's render-complete event
 */
const onContentRendered = () => {
  // Only run this on the client side where we have access to the DOM
  if (typeof window === 'undefined') return;

  // Mark content as successfully rendered
  // This is crucial to prevent showing fallback content when rendering succeeds
  contentSuccessfullyRendered.value = true;

  // Only log if we have content and a valid start time
  if (content.value && renderStartTime.value > 0) {
    // Use the same timing API that was used to create the start time
    const renderDuration = typeof performance !== 'undefined'
      ? performance.now() - renderStartTime.value
      : Date.now() - renderStartTime.value;

    // Safely create log data with proper null checks
    const logData = {
      path: contentPath,
      duration: `${renderDuration.toFixed(2)}ms`,
      timestamp: new Date().toISOString(),
      contentTitle: content.value?.title || 'Untitled',
      contentType: typeof content.value,
      renderSuccess: true
    };

    // Only add bodySize if we can safely access it
    try {
      if (content.value?.body) {
        // Use a safer approach to get body size
        const bodyString = JSON.stringify(content.value.body || {});
        logData.bodySize = bodyString ? bodyString.length : 0;
      } else {
        logData.bodySize = 0;
      }
    } catch (err) {
      // If there's any error calculating body size, just log it as 0
      logData.bodySize = 0;
      logData.bodySizeError = true;
    }

    // Log content structure for debugging if needed
    if (isDevelopment) {
      try {
        logData.contentStructure = {
          hasBody: Boolean(content.value?.body),
          bodyType: content.value?.body ? typeof content.value.body : 'none',
          hasChildren: Boolean(content.value?.body?.children),
          childrenIsArray: Array.isArray(content.value?.body?.children),
          topLevelKeys: Object.keys(content.value || {})
        };
      } catch (err) {
        logData.contentStructureError = err.message;
      }
    }

    logContent('Content rendering completed', logData);
  }
};
</script>

<style lang="scss" scoped>
// Styling for error details in development mode
.error-details {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px;
  overflow-y: auto;

  .stack-trace, .context-data {
    background-color: rgba(0, 0, 0, 0.03);
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    line-height: 1.4;
    max-height: 150px;
    overflow-y: auto;
  }
}

// Styling for content preview when standard rendering is not possible
.content-fallback {
  .content-preview {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.85rem;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 300px;
    overflow-y: auto;
    line-height: 1.5;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}

// Styling for the content renderer
.content-renderer {
  :deep(h1) {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  :deep(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  :deep(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }

  :deep(p) {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  :deep(ul), :deep(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  :deep(li) {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }

  :deep(a) {
    color: var(--v-primary-base);
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }

    &:focus-visible {
      outline: 2px solid var(--v-primary-base);
      outline-offset: 2px;
    }
  }

  :deep(blockquote) {
    border-left: 4px solid var(--v-primary-lighten-1);
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
  }

  :deep(code) {
    font-family: monospace;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.9em;
  }

  :deep(pre) {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    margin-bottom: 1rem;

    code {
      background-color: transparent;
      padding: 0;
      border-radius: 0;
    }
  }
}

// Code example styling
.code-example {
  .code-block {
    margin: 0;
    padding: 1rem;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.03);
    overflow-x: auto;
    font-family: monospace;
    font-size: 0.9rem;
    line-height: 1.5;
  }
}

// Add focus styles for accessibility
:deep(*:focus-visible) {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

// Ensure content card has proper spacing
.content-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
}

// Ensure proper contrast for dark mode
:deep(.v-theme--dark) {
  .error-details {
    background-color: rgba(255, 255, 255, 0.05);

    .stack-trace, .context-data {
      background-color: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .content-fallback {
    .content-preview {
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .code-block {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .content-renderer {
    :deep(code) {
      background-color: rgba(255, 255, 255, 0.1);
    }

    :deep(pre) {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  // Improve contrast for error alerts in dark mode
  .v-alert {
    &.v-alert--type-error {
      background-color: rgba(var(--v-theme-error), 0.15);
    }

    &.v-alert--type-warning {
      background-color: rgba(var(--v-theme-warning), 0.15);
    }

    &.v-alert--type-info {
      background-color: rgba(var(--v-theme-info), 0.15);
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .content-card {
    transition: none;

    &:hover {
      transform: none;
    }
  }

  .v-slide-y-transition,
  .v-expand-transition {
    transition: opacity 0.1s ease !important;
  }
}
</style>