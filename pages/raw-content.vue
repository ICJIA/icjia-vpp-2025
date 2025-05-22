<template>
  <div class="raw-content-container">
    <ContentRenderer
      v-if="content"
      :value="content"
      class="content-renderer"
    />
    <div v-else-if="pending" class="loading-state">
      Loading content...
    </div>
    <div v-else-if="error" class="error-state">
      Error loading content: {{ error.message }}
    </div>
  </div>
</template>

<script setup>
/**
 * Raw Content Page
 * 
 * This page renders Nuxt Content without any UI elements, headers, or decorations.
 * It's designed to show only the raw markdown content as rendered HTML.
 */
import { useRoute } from '#imports';
import { ContentRenderer } from '#components';
import useContentFetcher from '~/composables/useContentFetcher';

// Get the current route
const route = useRoute();

// Get the content path from the query parameter
const contentPath = route.query.path || '';

// Fetch the content
const { content, pending, error } = useContentFetcher({
  path: contentPath
});
</script>

<style lang="scss" scoped>
.raw-content-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.loading-state, .error-state {
  padding: 20px;
  text-align: center;
}

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
</style>
