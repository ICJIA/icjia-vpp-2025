
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
          type="error"
          title="Error Loading Content"
          class="mb-6"
          variant="tonal"
          border="start"
          closable
        >
          <p>{{ error.message || 'There was a problem loading the content. Please try again later.' }}</p>
          <div v-if="isDevelopment" class="mt-4 text-caption">
            <strong>Developer Details:</strong>
            <pre class="error-details mt-2 pa-2">{{ error }}</pre>
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
                  <ContentRenderer
                    :value="content"
                    class="content-renderer"
                    @render-complete="onContentRendered"
                  />
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

// Determine if we're in development mode
const isDevelopment = useRuntimeConfig().public.NODE_ENV === 'development';

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

// Fetch the content with proper error handling
const { data: content, pending, error } = await useAsyncData(
  `content-${contentPath}`, // Use dynamic key based on path
  async () => {
    try {
      // Fetch the content
      const result = await queryCollection('content').path(contentPath).first();

      // Calculate fetch duration for performance monitoring
      // Use the same timing API that was used to create the start time
      const fetchDuration = typeof performance !== 'undefined'
        ? performance.now() - fetchStartTime
        : Date.now() - fetchStartTime;

      // Log successful content retrieval with detailed information
      logContent('Content successfully retrieved', {
        path: contentPath,
        duration: `${fetchDuration.toFixed(2)}ms`,
        contentType: result ? typeof result : 'null',
        hasBody: result && result.body ? true : false,
        frontmatter: result ? {
          title: result.title || null,
          description: result.description || null,
          hasOtherMetadata: Object.keys(result || {}).filter(key =>
            !['title', 'description', '_id', '_path', 'body'].includes(key)
          ).length > 0
        } : null,
        // Safely access nested properties with optional chaining
        bodyLength: result?.body?.children?.length || 0
      });

      return result;
    } catch (err) {
      // Log any errors that occur during content fetching
      logError('Content fetching failed', {
        path: contentPath,
        error: err.message,
        stack: isDevelopment ? err.stack : 'hidden in production',
        timestamp: new Date().toISOString()
      });

      // Re-throw the error to be caught by useAsyncData
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
      contentType: typeof content.value
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
  max-height: 200px;
  overflow-y: auto;
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
  .error-details,
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