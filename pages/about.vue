<template>
  <div class="about-page">
    <!-- Loading state -->
    <div v-if="pending" class="loading-state">
      <div class="text-center py-16">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-body-1 mt-4">Loading content...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <div class="text-center py-16">
        <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
        <h2 class="text-h4 mb-4">Content Loading Error</h2>
        <p class="text-body-1 mb-4">{{ error.message }}</p>
        <v-btn color="primary" @click="refresh()">Try Again</v-btn>
      </div>
    </div>

    <!-- Content display with PageTitleSection -->
    <div v-else-if="content">
      <!-- Replace AboutHero with PageTitleSection -->
      <PageTitleSection
        :title="pageTitle"
        :description="pageDescription"
        :show-border="true"
      />

      <!-- Main Content -->
      <div class="page-content">
        <div class="container">
          <!-- Render content without the hero section -->
          <ContentRenderer :value="contentWithoutHero" />
        </div>
      </div>
    </div>

    <!-- Fallback content if no content is found -->
    <div v-else class="fallback-state">
      <div class="text-center py-16">
        <v-icon color="warning" size="64" class="mb-4">mdi-file-document-outline</v-icon>
        <h2 class="text-h4 mb-4">No Content Found</h2>
        <p class="text-body-1">The about page content could not be found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * About page for the Violence Prevention Plan for Illinois: 2025-2029
 *
 * This page now uses the standardized PageTitleSection component for consistent
 * typography and styling across the site. It uses Nuxt Content's MDC system to render
 * the about page content from /content/about.md with the following features:
 * - Reusable PageTitleSection component with infographic-style typography
 * - Better content management through markdown
 * - Vue component integration within markdown
 * - Proper SEO metadata from frontmatter
 * - Consistent content structure and visual hierarchy
 *
 * @page
 */
import { computed } from 'vue';
import { useHead, useSeoMeta } from '#imports';
import { useConsoleLogger } from '~/composables/useConsoleLogger';
import useContentFetcher from '~/composables/useContentFetcher';
import PageTitleSection from '~/components/content/PageTitleSection.vue';

// Initialize console logger
const { log } = useConsoleLogger();

// Content path for the about page
const contentPath = '/about';

// Log the content path
log('content', 'About page - loading MDC content', {
  path: contentPath,
  timestamp: new Date().toISOString()
});

console.log('DEBUG: contentPath is:', contentPath);

// Use the project's content fetcher composable
const { content, pending, error, refresh } = useContentFetcher({
  path: contentPath
});

/**
 * Extract title and description for PageTitleSection
 * Uses content frontmatter when available, falls back to defaults
 */
const pageTitle = computed(() => {
  return content.value?.title || 'About Us';
});

const pageDescription = computed(() => {
  return content.value?.description || 'Learn about the Violence Prevention Plan for Illinois: 2025-2029, our mission, values, and approach to violence prevention across Illinois.';
});

/**
 * Filter content to remove the hero section since we're using PageTitleSection
 * This prevents duplicate titles and maintains clean content structure
 */
const contentWithoutHero = computed(() => {
  if (!content.value) return null;

  // Create a copy of the content object
  const filteredContent = { ...content.value };

  // If the content has a body, filter out the about-hero section
  if (filteredContent.body && typeof filteredContent.body === 'object') {
    // Filter out about-hero components from the body
    if (filteredContent.body.children) {
      filteredContent.body = {
        ...filteredContent.body,
        children: filteredContent.body.children.filter(child =>
          !(child.tag === 'about-hero' || child.type === 'about-hero')
        )
      };
    }
  }

  return filteredContent;
});

// Watch for successful content loading
if (content.value) {
  log('content', 'About page content loaded', {
    title: content.value.title,
    timestamp: new Date().toISOString()
  });
}

/**
 * Set page title and HTML attributes for accessibility and SEO
 * Uses content frontmatter when available, falls back to defaults
 */
useHead({
  title: computed(() => content.value?.title || 'Violence Prevention Plan for Illinois: 2025-2029 - About Us'),
  htmlAttrs: {
    lang: 'en'
  }
});

/**
 * Set SEO metadata based on content frontmatter
 * Includes Open Graph and Twitter Card metadata
 */
useSeoMeta({
  description: computed(() => content.value?.description || 'Learn about the Violence Prevention Plan for Illinois: 2025-2029, our mission, values, and approach to violence prevention across Illinois.'),
  ogTitle: computed(() => content.value?.ogTitle || content.value?.title || 'Violence Prevention Plan for Illinois: 2025-2029 - About Us'),
  ogDescription: computed(() => content.value?.ogDescription || content.value?.description || 'Learn about our mission, values, and approach to violence prevention across Illinois.'),
  ogImage: computed(() => content.value?.ogImage || '/images/og-image-about.jpg'),
  twitterCard: computed(() => content.value?.twitterCard || 'summary_large_image'),
});
</script>

<style scoped>
/**
 * About Page Styling - Consistent with PageTitleSection System
 *
 * Implements the standardized page layout with soft light theme background,
 * consistent spacing, and proper content structure to match the news page
 * and other pages using the PageTitleSection component.
 */

/* Page structure with soft light theme background */
.about-page {
  min-height: 100vh;
  padding-top: 60px; /* Account for sticky header */
  overflow-x: hidden;
  /* Soft light theme background to reduce eye strain */
  background: #FAFAFA;
}

/* Dark theme background override */
:root[data-theme="dark"] .about-page {
  background: rgb(var(--v-theme-surface));
}

/* Container styling for content areas */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Main content spacing */
.page-content {
  padding: 4.5rem 0; /* Consistent with news page spacing */
}

/* State containers */
.loading-state,
.error-state,
.fallback-state {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Add focus styles for accessibility */
:deep(*:focus-visible) {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .about-page {
    padding-top: 50px; /* Smaller header offset on mobile */
  }

  .page-content {
    padding: 3rem 0; /* Responsive spacing - reduced from 4.5rem for mobile */
  }

  .container {
    padding: 0 1rem;
  }

  .loading-state,
  .error-state,
  .fallback-state {
    padding: 1.5rem 1rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  :deep(.animate-title),
  :deep(.animate-text),
  :deep(.about-image),
  :deep(.value-card),
  :deep(.approach-item),
  :deep(.contact-button) {
    animation: none !important;
    transition: none !important;
  }

  :deep(.about-image:hover),
  :deep(.value-card:hover),
  :deep(.value-card:focus-visible),
  :deep(.contact-button:hover),
  :deep(.contact-button:focus-visible) {
    transform: none !important;
  }
}

/* Print styles */
@media print {
  .about-page {
    background: none !important;
    padding-top: 0;
  }

  .page-content {
    padding: 2rem 0;
  }
}
</style>