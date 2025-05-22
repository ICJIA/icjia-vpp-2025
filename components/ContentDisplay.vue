<template>
  <div class="content-display">
    <!-- Loading State -->
    <slot name="loading" v-if="pending">
      <v-skeleton-loader
        type="article"
        class="mb-6"
      />
    </slot>

    <!-- Error State -->
    <slot
      name="error"
      v-else-if="error"
      :error="error"
      :error-title="errorTitle"
      :error-message="userFriendlyErrorMessage"
      :error-severity="errorSeverity"
      :error-action="errorAction"
      :technical-details="technicalErrorDetails"
      :is-development="isDevelopment"
    >
      <v-alert
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
    </slot>

    <!-- Content Display or No Content State -->
    <template v-else-if="!pending && !error">
      <div v-if="content">
        <slot name="before-content"></slot>

        <!-- Content display with conditional card wrapper -->
        <template v-if="useCard">
          <v-slide-y-transition>
            <v-card
              class="mb-6 rounded-lg content-card"
              :elevation="cardElevation"
              :theme="isDark ? 'dark' : 'light'"
            >
              <!-- Frontmatter Display -->
              <v-card-item v-if="showFrontmatter && (content.title || content.description)" class="pb-0">
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
                <v-divider v-if="showFrontmatter && (content.title || content.description)" class="my-4"></v-divider>

                <!-- Always attempt to render content with ContentRenderer -->
                <div>
                  <ContentRenderer
                    :value="content"
                    :class="['content-renderer', { 'hide-matching-heading': props.hideMatchingHeading }]"
                    @render-complete="onContentRendered"
                  />
                </div>

                <!-- Fallback for non-standard content structures -->
                <div
                  v-if="(!isContentRenderable && !contentSuccessfullyRendered.value) || showDebug"
                  class="content-fallback mt-8"
                >
                  <slot
                    name="fallback"
                    :content="content"
                    :content-preview="contentPreview"
                    :show-debug="showDebug"
                  >
                    <v-alert
                      type="info"
                      :title="showDebug ? 'Content Structure Debug' : 'Content Preview'"
                      variant="tonal"
                      border="start"
                      class="mb-4"
                    >
                      <template v-if="showDebug">
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
                  </slot>
                </div>
              </v-card-text>
            </v-card>
          </v-slide-y-transition>
        </template>

        <!-- Non-card version -->
        <template v-else>
          <div v-if="showFrontmatter && (content.title || content.description)" class="mb-4">
            <h1 v-if="content.title" class="text-h4 mb-2">{{ content.title }}</h1>
            <p v-if="content.description" class="text-body-1">{{ content.description }}</p>
            <v-divider class="my-4"></v-divider>
          </div>

          <!-- Content Renderer -->
          <div>
            <ContentRenderer
              :value="content"
              :class="['content-renderer', { 'hide-matching-heading': props.hideMatchingHeading }]"
              @render-complete="onContentRendered"
            />
          </div>

          <!-- Fallback for non-standard content structures -->
          <div
            v-if="(!isContentRenderable && !contentSuccessfullyRendered.value) || showDebug"
            class="content-fallback mt-8"
          >
            <slot
              name="fallback"
              :content="content"
              :content-preview="contentPreview"
              :show-debug="showDebug"
            >
              <v-alert
                type="info"
                :title="showDebug ? 'Content Structure Debug' : 'Content Preview'"
                variant="tonal"
                border="start"
                class="mb-4"
              >
                <template v-if="showDebug">
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
            </slot>
          </div>
        </template>

        <slot name="after-content"></slot>
      </div>

      <!-- No Content State -->
      <slot name="empty" v-else>
        <v-alert
          type="info"
          title="No Content Found"
          text="The requested content could not be found."
          class="mb-6"
          variant="tonal"
          border="start"
        ></v-alert>
      </slot>
    </template>
  </div>
</template>

<script setup>
/**
 * ContentDisplay Component
 *
 * A reusable component for displaying content with consistent loading, error, and empty states.
 * Uses the useContentFetcher composable for data fetching and error handling.
 */
import { ref, computed, onMounted, watch } from 'vue';
import { useNuxtApp } from '#imports';
import { ContentRenderer } from '#components';
import useContentFetcher from '~/composables/useContentFetcher';

const props = defineProps({
  /**
   * Content path to fetch
   */
  path: {
    type: String,
    required: true
  },

  /**
   * Whether to fetch content lazily
   */
  lazy: {
    type: Boolean,
    default: false
  },

  /**
   * Additional query options for content fetching
   */
  queryOptions: {
    type: Object,
    default: () => ({})
  },

  /**
   * Optional transform function for content data
   */
  transform: {
    type: Function,
    default: null
  },

  /**
   * Show debug information
   */
  showDebug: {
    type: Boolean,
    default: false
  },

  /**
   * Whether to wrap content in a card
   */
  useCard: {
    type: Boolean,
    default: true
  },

  /**
   * Card elevation when useCard is true
   */
  cardElevation: {
    type: [String, Number],
    default: '2'
  },

  /**
   * Whether to show frontmatter (title and description)
   */
  showFrontmatter: {
    type: Boolean,
    default: true
  },

  /**
   * Whether to hide the first heading if it matches the title
   * This prevents duplicate titles when the content has a heading that matches the frontmatter title
   */
  hideMatchingHeading: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits([
  'render-start',
  'render-complete',
  'error',
  'content-loaded'
]);

// Use the simplified content fetcher composable
const {
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
} = useContentFetcher({
  path: props.path
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

// Watch for content loading
watch(() => content.value, (newContent) => {
  if (newContent) {
    emit('content-loaded', newContent);
  }
});

// Watch for errors
watch(() => error.value, (newError) => {
  if (newError) {
    emit('error', {
      error: newError,
      details: technicalErrorDetails.value
    });
  }
});

/**
 * Called when content rendering is complete
 */
const onContentRendered = () => {
  // Mark content as successfully rendered
  markAsRendered();

  // Emit event
  emit('render-complete', {
    path: props.path,
    content: content.value
  });
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
  // Hide first heading if hideMatchingHeading is true
  &.hide-matching-heading {
    :deep(h1:first-of-type) {
      display: none;
    }
  }

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
