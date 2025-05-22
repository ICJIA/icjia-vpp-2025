<template>
  <div class="simple-content-display">
    <!-- Loading State -->
    <div v-if="pending" class="loading-state">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <v-alert type="error" title="Error Loading Content" :text="error && error.message ? error.message : 'Failed to load content'" />
    </div>

    <!-- Content Display -->
    <div v-else-if="content" class="content-container">
      <!-- Just the content, nothing else -->
      <ContentRenderer :value="content" class="content-renderer" />
    </div>

    <!-- No Content State -->
    <div v-else class="empty-state">
      <v-alert type="info" title="No Content Found" text="The requested content could not be found." />
    </div>
  </div>
</template>

<script setup>
/**
 * SimpleContentDisplay Component
 *
 * A minimal component for displaying markdown content without any UI decorations.
 * Just shows the raw content with basic loading and error states.
 */
import { ContentRenderer } from '#components';
import useContentFetcher from '~/composables/useContentFetcher';

const props = defineProps({
  /**
   * Content path to fetch
   */
  path: {
    type: String,
    required: true
  }
});

// Use the content fetcher composable with minimal options
const { content, pending, error } = useContentFetcher({
  path: props.path
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

    :deep(ul), :deep(ol) {
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
}
</style>
