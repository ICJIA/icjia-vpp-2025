
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
                  <div class="mb-2 font-weight-bold">Step 2: Fetch Content</div>
                  <p>We fetch it using <code>queryCollection('content').path('/sandbox').first()</code></p>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 3: Handle States</div>
                  <p>We implement loading, error, and empty states for better UX</p>
                </v-timeline-item>

                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-2 font-weight-bold">Step 4: Render Content</div>
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
// Fetch content from the markdown file
const { data: content, pending, error } = await useAsyncData(
  'sandbox-content',
  () => queryCollection('content').path('/sandbox').first()
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
import { useHead, useSeoMeta, useRuntimeConfig, useAsyncData, ref, computed, onMounted, watch } from '#imports';

// Determine if we're in development mode
const isDevelopment = useRuntimeConfig().public.NODE_ENV === 'development';

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
 * Fetch content from the sandbox.md file in the content directory
 *
 * Uses queryCollection to fetch content from the 'content' collection
 * The path is set to '/sandbox' to match the sandbox.md file
 * We use useAsyncData to handle the async operation with proper loading and error states
 */
const { data: content, pending, error } = await useAsyncData('sandbox-content', () =>
  queryCollection('content').path('/sandbox').first()
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