<template>
  <div class="home-page">
    <!-- Loading state -->
    <div v-if="pending" class="text-center py-16">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="text-body-1 mt-4">Loading content...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-16">
      <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
      <h2 class="text-h4 mb-4">Content Loading Error</h2>
      <p class="text-body-1 mb-4">{{ error.message }}</p>
      <v-btn color="primary" @click="refresh()">Try Again</v-btn>
    </div>

    <!-- Content display -->
    <div v-else-if="content">
      <ContentRenderer :value="content" />
    </div>

    <!-- Fallback content if no content is found -->
    <div v-else class="text-center py-16">
      <v-icon color="warning" size="64" class="mb-4">mdi-file-document-outline</v-icon>
      <h2 class="text-h4 mb-4">No Content Found</h2>
      <p class="text-body-1">The home page content could not be found.</p>
    </div>
  </div>
</template>

<script setup>
/**
 * Home page for the Violence Prevention Plan for Illinois: 2025-2029
 *
 * This page now uses Nuxt Content's MDC (Markdown Components) system to render
 * the home page content from /content/index.md. This approach allows for:
 * - Better content management through markdown
 * - Vue component integration within markdown
 * - Proper SEO metadata from frontmatter
 * - Consistent content structure
 *
 * @page
 */
import { computed } from 'vue';
import { useHead, useSeoMeta } from '#imports';
import { useConsoleLogger } from '~/composables/useConsoleLogger';
import useContentFetcher from '~/composables/useContentFetcher';

// Initialize console logger
const { log } = useConsoleLogger();

// Content path for the home page
const contentPath = '/';

// Log the content path
log('content', 'Home page - loading MDC content', {
  path: contentPath,
  timestamp: new Date().toISOString()
});

console.log('DEBUG: contentPath is:', contentPath);

// Use the project's content fetcher composable
const { content, pending, error, refresh } = useContentFetcher({
  path: contentPath
});

// Watch for successful content loading
if (content.value) {
  log('content', 'Home page content loaded', {
    title: content.value.title,
    timestamp: new Date().toISOString()
  });
}

/**
 * Set page title and HTML attributes for accessibility and SEO
 * Uses content frontmatter when available, falls back to defaults
 */
useHead({
  title: computed(() => content.value?.title || 'Violence Prevention Plan for Illinois: 2025-2029 - Home'),
  htmlAttrs: {
    lang: 'en'
  }
});

/**
 * Set SEO metadata based on content frontmatter
 * Includes Open Graph and Twitter Card metadata
 */
useSeoMeta({
  description: computed(() => content.value?.description || 'The Violence Prevention Plan for Illinois: 2025-2029 provides resources and tools for violence prevention initiatives across Illinois.'),
  ogTitle: computed(() => content.value?.ogTitle || content.value?.title || 'Violence Prevention Plan for Illinois: 2025-2029 - Home'),
  ogDescription: computed(() => content.value?.ogDescription || content.value?.description || 'Resources and tools for violence prevention initiatives across Illinois.'),
  ogImage: computed(() => content.value?.ogImage || '/images/og-image.jpg'),
  twitterCard: computed(() => content.value?.twitterCard || 'summary_large_image'),
});
</script>

<style scoped>
.home-page {
  overflow-x: hidden;
}

/* Add focus styles for accessibility */
:deep(*:focus-visible) {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  :deep(.hero-title),
  :deep(.hero-description),
  :deep(.hero-button),
  :deep(.feature-card),
  :deep(.shadow-img),
  :deep(.cta-button) {
    animation: none !important;
    transition: none !important;
  }

  :deep(.shadow-img:hover),
  :deep(.cta-button:hover) {
    transform: none !important;
  }
}
</style>