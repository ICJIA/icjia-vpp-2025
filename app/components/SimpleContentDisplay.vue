<template>
  <div class="simple-content-display">
    <!-- Loading State -->
    <div v-if="pending" class="loading-state">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <v-alert
        type="error"
        title="Error Loading Content"
        :text="
          error && error.message ? error.message : 'Failed to load content'
        "
      />
    </div>

    <!-- Content Display -->
    <div v-else-if="content" class="content-container">
      <!-- Just the content, nothing else -->
      <ContentRenderer :value="content" class="content-renderer" />

      <!-- Debug Information (only shown when debug=true) -->
      <div v-if="props.debug" class="debug-container mt-6">
        <v-divider class="my-4"></v-divider>
        <h3 class="text-h6 font-weight-bold mb-3">
          <v-icon icon="mdi-code-json" class="me-2" aria-hidden="true"></v-icon>
          Debug: Raw Content Data
        </h3>
        <v-card class="debug-card" variant="outlined">
          <v-card-text class="pa-0">
            <pre class="debug-content">{{
              JSON.stringify(content, null, 2)
            }}</pre>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- No Content State -->
    <div v-else class="empty-state">
      <v-alert
        type="info"
        title="No Content Found"
        text="The requested content could not be found."
      />
    </div>
  </div>
</template>

<script setup>
/**
 * SimpleContentDisplay Component
 *
 * A minimal component for displaying markdown content without any UI decorations.
 * Just shows the raw content with basic loading and error states.
 *
 * @example Basic usage
 * ```vue
 * <SimpleContentDisplay :path="contentPath" />
 * ```
 *
 * @example With debug enabled
 * ```vue
 * <SimpleContentDisplay :path="contentPath" :debug="true" />
 * ```
 *
 * @example All available props
 * ```vue
 * <SimpleContentDisplay
 *   :path="contentPath"
 *   :debug="isDevelopment"
 * />
 * ```
 */
import { ContentRenderer } from "#components";
import useContentFetcher from "~/composables/useContentFetcher";

const props = defineProps({
  /**
   * Content path to fetch
   */
  path: {
    type: String,
    required: true,
  },

  /**
   * Debug mode
   *
   * When enabled, displays the complete raw JSON representation of the content data
   * below the rendered content. This is useful for development and debugging
   * to understand the content structure and troubleshoot rendering issues.
   *
   * The debug display shows all keys and values in the content object, including
   * metadata, body content, and any other properties returned by the content API.
   * It is formatted with proper indentation for readability and placed in a
   * visually distinct section below the rendered content.
   *
   * @type {Boolean}
   * @default false
   * @example
   * // Enable debug mode
   * <SimpleContentDisplay :path="contentPath" :debug="true" />
   *
   * // Conditionally enable debug mode in development only
   * <SimpleContentDisplay :path="contentPath" :debug="isDevelopment" />
   */
  debug: {
    type: Boolean,
    default: false,
  },
});

// Use the content fetcher composable with minimal options
const { content, pending, error } = useContentFetcher({
  path: props.path,
});
</script>

<style lang="scss" scoped>
.simple-content-display {
  // Basic container styling
  width: 100%;

  // Loading state
  .loading-state {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }

  // Error state
  .error-state {
    margin: 1rem 0;
  }

  // Empty state
  .empty-state {
    margin: 1rem 0;
  }

  // Content styling
  .content-renderer {
    // Heading styles
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

    // Paragraph and list styles
    :deep(p) {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    :deep(ul),
    :deep(ol) {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }

    :deep(li) {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }

    // Link styles
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

    // Other elements
    // Blockquote styling is now handled by global CSS for consistent theming
    // This ensures proper contrast in both light and dark themes

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
}

// Debug container styling
.debug-container {
  margin-top: 2rem;

  .debug-card {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px;

    .debug-content {
      font-family: "Roboto Mono", monospace;
      background-color: rgba(0, 0, 0, 0.03);
      padding: 1.5rem;
      overflow-x: auto;
      line-height: 1.6;
      font-size: 0.9rem;
      max-height: 500px;
      overflow-y: auto;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
}

// Dark mode support
:deep(.v-theme--dark) {
  .content-renderer {
    :deep(code) {
      background-color: rgba(255, 255, 255, 0.1);
    }

    :deep(pre) {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .debug-container {
    .debug-card {
      border-color: rgba(255, 255, 255, 0.12);

      .debug-content {
        background-color: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.87);
      }
    }
  }
}
</style>
