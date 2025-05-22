<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10" lg="8" class="mx-auto">
        <div class="d-flex align-center mb-6">
          <v-icon icon="mdi-file-document-outline" size="x-large" class="me-3" aria-hidden="true"></v-icon>
          <h1 class="text-h4 font-weight-bold">{{ pageTitle }}</h1>
        </div>

        <p class="text-subtitle-1 text-medium-emphasis mb-6">
          A demonstration of Nuxt Content v3 functionality
        </p>

        <!-- Content Display Component -->
        <ContentDisplay
          :path="contentPath"
          @render-complete="onRenderComplete"
          @error="onError"
        />

        <!-- How It Works Section -->
        <v-expand-transition>
          <v-card
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
                This page demonstrates how to use the ContentDisplay component with useContentFetcher composable:
              </p>

              <v-timeline density="compact" align="start">
                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 1: Import Components</div>
                  <p>Import the ContentDisplay component and useRoute composable</p>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 2: Determine Content Path</div>
                  <p>Create a dynamic path that preserves the full route name</p>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 3: Use the Component</div>
                  <p>Provide the dynamic content path to the component</p>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 4: Handle Events</div>
                  <p>Listen for events like render-complete and error</p>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 5: Customize (Optional)</div>
                  <p>Use slots to customize the appearance if needed</p>
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
                <pre class="code-block"><code>&lt;template&gt;
  &lt;v-container&gt;
    &lt;v-row&gt;
      &lt;v-col cols="12" md="10" lg="8" class="mx-auto"&gt;
        &lt;h1 class="text-h4 mb-6"&gt;{{ pageTitle }}&lt;/h1&gt;

        &lt;!-- Dynamic Path Usage --&gt;
        &lt;ContentDisplay :path="contentPath" /&gt;

        &lt;!-- Advanced Usage with Events --&gt;
        &lt;ContentDisplay
          :path="contentPath"
          :show-frontmatter="true"
          :use-card="true"
          @render-complete="onRenderComplete"
          @error="onError"
        /&gt;

        &lt;!-- Custom Slots --&gt;
        &lt;ContentDisplay :path="contentPath"&gt;
          &lt;template #loading&gt;
            &lt;!-- Custom loading state --&gt;
            &lt;v-progress-circular indeterminate /&gt;
          &lt;/template&gt;

          &lt;template #error&gt;
            &lt;!-- Custom error state --&gt;
            &lt;div class="error-message"&gt;Error loading content&lt;/div&gt;
          &lt;/template&gt;

          &lt;template #before-content&gt;
            &lt;!-- Content before the main content --&gt;
            &lt;div class="intro-text"&gt;Introduction text...&lt;/div&gt;
          &lt;/template&gt;
        &lt;/ContentDisplay&gt;
      &lt;/v-col&gt;
    &lt;/v-row&gt;
  &lt;/v-container&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, computed } from 'vue';
import { useRoute } from '#imports';

// Get the current route
const route = useRoute();

// Determine content path from route name
const getContentPath = () => {
  const routeName = route.name?.toString() || 'default';

  // Handle index route specially
  if (routeName === 'index') {
    return '/';
  }

  // Preserve full route name including hyphens
  return `/${routeName}`;
};

// Get dynamic content path
const contentPath = getContentPath();

// For direct access to content data and state
// you can use the composable directly
const { content, pending, error } = useContentFetcher({
  path: contentPath
});

const pageTitle = computed(() => {
  return content.value?.title || 'Content Page';
});

function onRenderComplete(event) {
  console.log('Content rendered:', event);
}

function onError(error) {
  console.error('Content error:', error);
}
&lt;/script&gt;</code></pre>
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
 * Sandbox page demonstrating ContentDisplay component and useContentFetcher composable
 *
 * This page shows how to:
 * 1. Use the ContentDisplay component to render content
 * 2. Handle events from the component
 * 3. Access content data directly using the useContentFetcher composable if needed
 */
import { ref, computed, onMounted, watch } from 'vue';
import { useHead, useSeoMeta, useRuntimeConfig, useNuxtApp, useRoute } from '#imports';
import { useConsoleLogger } from '~/composables/useConsoleLogger';
import useContentFetcher from '~/composables/useContentFetcher';
import ContentDisplay from '~/components/ContentDisplay.vue';

// Initialize console logger
const { log } = useConsoleLogger();

// Determine if we're in development mode
const isDevelopment = useRuntimeConfig().public.NODE_ENV === 'development';

// Get the current route
const route = useRoute();

/**
 * Determine the content path based on the current route name
 *
 * This function converts the route name to a content path:
 * - Preserves hyphenated route names (like 'sandbox-refactored')
 * - Handles index routes by converting them to the appropriate path
 * - Falls back to 'sandbox' if the route name is undefined or empty
 *
 * @returns {string} The content path to fetch
 */
const getContentPath = () => {
  // Get the route name, fallback to 'sandbox' if undefined
  const routeName = route.name?.toString() || 'sandbox';

  // Handle index routes (convert 'index' to appropriate path)
  if (routeName === 'index') {
    return '/';
  }

  // For all other routes, preserve the full route name including hyphens
  // This ensures paths like '/sandbox-refactored' remain intact
  return `/${routeName}`;
};

// Get the dynamic content path for the current route
const contentPath = getContentPath();

// Log the content path
log('content', 'Using dynamic content path', {
  route: route.name,
  path: contentPath,
  timestamp: new Date().toISOString()
});

// For direct access to content data (optional)
// Using our simplified useContentFetcher composable with dynamic path
const { content } = useContentFetcher({
  path: contentPath
});

// Theme detection
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
  return content.value?.title || 'Sandbox';
});

/**
 * Handle render complete event
 */
function onRenderComplete(event) {
  log('content', 'Content render complete event received', {
    path: event.path,
    timestamp: new Date().toISOString()
  });
}

/**
 * Handle error event
 */
function onError(error) {
  log('error', 'Content error event received', {
    error: error.error?.message,
    details: isDevelopment ? error.details : 'Hidden in production',
    timestamp: new Date().toISOString()
  });
}
</script>

<style lang="scss" scoped>
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

// Ensure proper contrast for dark mode
:deep(.v-theme--dark) {
  .code-block {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .v-expand-transition {
    transition: opacity 0.1s ease !important;
  }
}
</style>
