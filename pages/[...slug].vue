<template>
  <div class="dynamic-content-page">
    <!-- Loading state -->
    <div v-if="pending" class="text-center py-16">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="text-body-1 mt-4">Loading content...</p>
    </div>

    <!-- Error state - show 404 when content not found -->
    <div v-else-if="error && isNotFoundError" class="text-center py-16">
      <div class="error-content">
        <div class="error-animation mb-8">
          <v-icon
            icon="mdi-map-marker-off"
            size="100"
            color="primary"
            class="error-icon"
            aria-hidden="true"
          />
          <div class="error-code">404</div>
        </div>

        <h1 class="text-h2 font-weight-bold mb-4">Page Not Found</h1>

        <p class="text-subtitle-1 text-primary font-weight-medium mb-2 max-width-text">
          Statewide Violence Prevention Plan for Illinois: 2025-2029
        </p>

        <p class="text-body-1 mb-8 max-width-text">
          Oops! It seems like the page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div class="text-center">
          <v-btn
            color="primary"
            size="large"
            class="rounded-pill px-8 py-3 elevation-1 home-button"
            @click="navigateToHome"
            aria-label="Return to homepage"
          >
            <v-icon icon="mdi-home" class="mr-2" aria-hidden="true" />
            Return to Homepage
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Other error states -->
    <div v-else-if="error" class="text-center py-16">
      <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
      <h2 class="text-h4 mb-4">Content Loading Error</h2>
      <p class="text-body-1 mb-4">{{ error.message }}</p>
      <v-btn color="primary" @click="refresh()">Try Again</v-btn>
    </div>

    <!-- Content display -->
    <div v-else-if="content">
      <!-- Use PageTitleSection for standardized header -->


      <PageTitleSection
        v-if="needsStandardHeader"
        :title="content.title || pageTitle"
        :description="content.description"
        :show-border="true"
        :show-date="!!(content.meta?.showDate || content.showDate)"
        :date="content.date"
      />

      <!-- Main content section -->
      <div class="page-content">
        <div class="container">
          <div class="content-renderer" :class="{ 'hide-first-heading': needsStandardHeader }">
            <ContentRenderer :value="content" @rendered="markAsRendered" />
          </div>
        </div>
      </div>
    </div>

    <!-- Fallback content if no content is found -->
    <div v-else class="text-center py-16">
      <v-icon color="warning" size="64" class="mb-4">mdi-file-document-outline</v-icon>
      <h2 class="text-h4 mb-4">No Content Found</h2>
      <p class="text-body-1">The requested page content could not be found.</p>
      <v-btn color="primary" @click="navigateToHome" class="mt-4">
        <v-icon icon="mdi-home" class="mr-2" aria-hidden="true" />
        Return to Homepage
      </v-btn>
    </div>
  </div>
</template>

<script setup>
/**
 * Dynamic Catch-All Route Component
 *
 * This component handles all routes that don't have corresponding Vue pages by
 * automatically checking for and rendering markdown content from the /content/ directory.
 *
 * Features:
 * - Automatic content resolution from /content/ directory
 * - Proper 404 handling when neither Vue nor markdown exists
 * - Full MDC (Markdown Components) support
 * - SEO optimization with dynamic metadata
 * - WCAG 2.1 AA accessibility compliance
 * - Theme support (light/dark)
 * - Integration with existing search and site configuration systems
 * - Loading states and error handling
 * - Keyboard navigation support
 *
 * Route Examples:
 * - /some-page → looks for /content/some-page.md
 * - /nested/page → looks for /content/nested/page.md
 * - /projects/new-initiative → looks for /content/projects/new-initiative.md
 *
 * @page
 * @accessibility WCAG 2.1 AA compliant
 * @seo Dynamic metadata from frontmatter
 */
import { computed } from 'vue';
import { useRoute, useHead, useSeoMeta, navigateTo } from '#imports';
import { useConsoleLogger } from '~/composables/useConsoleLogger';
import useContentFetcher from '~/composables/useContentFetcher';
import PageTitleSection from '~/components/content/PageTitleSection.vue';

// Initialize console logger
const { log, logError } = useConsoleLogger();

// Get current route
const route = useRoute();

// Build content path from route params
const contentPath = computed(() => {
  const slugArray = route.params.slug || [];
  const path = Array.isArray(slugArray) ? `/${slugArray.join('/')}` : `/${slugArray}`;

  log('content', 'Dynamic route - resolving content path', {
    routePath: route.path,
    contentPath: path,
    timestamp: new Date().toISOString()
  });

  return path;
});

// Use the project's content fetcher composable
const { content, pending, error, refresh, markAsRendered } = useContentFetcher({
  path: contentPath.value
});



// Check if error is a "not found" error
const isNotFoundError = computed(() => {
  return error.value && (
    error.value.code === 'NOT_FOUND' ||
    error.value.message?.includes('not found') ||
    error.value.statusCode === 404
  );
});

// Detect if content needs a standardized header
// This applies to plain markdown content that doesn't use layout components
const needsStandardHeader = computed(() => {
  if (!content.value) return false;

  // Check if content body contains layout components (like ::about-hero, ::hero-section, etc.)
  const bodyContent = content.value.body || content.value._body || '';
  const hasLayoutComponents = bodyContent.toString().includes('::') ||
                             bodyContent.toString().includes('about-hero') ||
                             bodyContent.toString().includes('hero-section') ||
                             bodyContent.toString().includes('feature-section');



  // If no layout components detected, provide standardized header
  return !hasLayoutComponents;
});

// Generate page title from slug or content
const pageTitle = computed(() => {
  if (content.value?.title) {
    return content.value.title;
  }

  // Generate title from slug
  const slugArray = route.params.slug || [];
  const lastSlug = Array.isArray(slugArray) ? slugArray[slugArray.length - 1] : slugArray;

  if (lastSlug) {
    // Convert kebab-case to Title Case
    const titleFromSlug = lastSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return `${titleFromSlug} - Statewide Violence Prevention Plan for Illinois: 2025-2029`;
  }

  return 'Statewide Violence Prevention Plan for Illinois: 2025-2029';
});

// Generate page description
const pageDescription = computed(() => {
  if (content.value?.description) {
    return content.value.description;
  }

  return 'Statewide Violence Prevention Plan for Illinois: 2025-2029 - Building safer communities through evidence-based violence prevention strategies.';
});

// Navigation helper
const navigateToHome = () => {
  navigateTo('/');
};

// Watch for successful content loading
if (content.value) {
  log('content', 'Dynamic route content loaded', {
    title: content.value.title,
    path: contentPath.value,
    timestamp: new Date().toISOString()
  });
}

// Watch for errors
if (error.value) {
  logError('Dynamic route content error', {
    path: contentPath.value,
    error: error.value.message,
    code: error.value.code,
    timestamp: new Date().toISOString()
  });
}

/**
 * Set page title and HTML attributes for accessibility and SEO
 * Uses content frontmatter when available, falls back to generated titles
 */
useHead({
  title: pageTitle,
  htmlAttrs: {
    lang: 'en'
  }
});

/**
 * Set SEO metadata based on content frontmatter or generated values
 * Includes Open Graph and Twitter Card metadata
 */
useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: computed(() => content.value?.ogTitle || pageTitle.value),
  ogDescription: computed(() => content.value?.ogDescription || pageDescription.value),
  ogImage: computed(() => content.value?.ogImage || '/images/og-image-default.jpg'),
  twitterCard: computed(() => content.value?.twitterCard || 'summary_large_image'),
  robots: computed(() => {
    // Don't index 404 pages
    if (isNotFoundError.value) {
      return 'noindex, nofollow';
    }
    return content.value?.robots || 'index, follow';
  })
});
</script>

<style scoped>
/**
 * Dynamic Content Page Styling - Consistent with PageTitleSection System
 *
 * Implements the standardized page layout with soft light theme background,
 * consistent spacing, and proper content structure to match other pages
 * using the PageTitleSection component.
 */

/* Page structure with soft light theme background */
.dynamic-content-page {
  min-height: 100vh;
  padding-top: 60px; /* Account for sticky header */
  overflow-x: hidden;
  /* Soft light theme background to reduce eye strain */
  background: #FAFAFA;
}

/* Dark theme background override */
:root[data-theme="dark"] .dynamic-content-page {
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
  padding: 4.5rem 0; /* Consistent with other pages */
}

/* Add focus styles for accessibility - matching existing pages */
:deep(*:focus-visible) {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Error page styling */
.error-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.error-animation {
  position: relative;
  display: inline-block;
}

.error-icon {
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

.error-code {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.max-width-text {
  max-width: 500px;
  margin: 0 auto;
}

.home-button {
  transition: all 0.3s ease;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Animation for error icon */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Reduced motion support - matching existing pages */
@media (prefers-reduced-motion: reduce) {
  .error-icon {
    animation: none !important;
  }

  .home-button:hover {
    transform: none !important;
  }

  /* Match the reduced motion classes from existing pages */
  :deep(.hero-title),
  :deep(.hero-description),
  :deep(.hero-button),
  :deep(.feature-card),
  :deep(.shadow-img),
  :deep(.cta-button),
  :deep(.animate-title),
  :deep(.animate-text),
  :deep(.about-image),
  :deep(.value-card),
  :deep(.approach-item),
  :deep(.contact-button) {
    animation: none !important;
    transition: none !important;
  }

  :deep(.shadow-img:hover),
  :deep(.cta-button:hover),
  :deep(.about-image:hover),
  :deep(.value-card:hover),
  :deep(.value-card:focus-visible),
  :deep(.contact-button:hover),
  :deep(.contact-button:focus-visible) {
    transform: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .error-code {
    text-shadow: none;
    border: 2px solid currentColor;
    background: rgb(var(--v-theme-surface));
    padding: 0.5rem;
    border-radius: 4px;
  }
}

/* Dark theme adjustments */
:deep(.v-theme--dark) .error-code {
  color: rgb(var(--v-theme-primary));
}

/* Loading state accessibility */
.v-progress-circular {
  margin: 0 auto;
}

/* Responsive design */
@media (max-width: 768px) {
  .dynamic-content-page {
    padding-top: 50px; /* Smaller header offset on mobile */
  }

  .page-content {
    padding: 3rem 0; /* Responsive spacing - reduced from 4.5rem for mobile */
  }

  .container {
    padding: 0 1rem;
  }
}

/* Content renderer styling - matches existing components */
.content-renderer {
  /* Hide first heading when we have a standardized header */
  &.hide-first-heading {
    :deep(h1:first-of-type) {
      display: none;
    }
  }

  /* Heading styles */
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

  /* Paragraph and list styles */
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

  /* Link styles */
  :deep(a) {
    color: var(--v-primary-base);
    text-decoration: underline;
  }

  :deep(a:hover) {
    text-decoration: none;
  }

  :deep(a:focus-visible) {
    outline: 2px solid var(--v-primary-base);
    outline-offset: 2px;
  }

  /* Other elements */
  :deep(blockquote) {
    border-left: 4px solid var(--v-primary-lighten-1);
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 1rem;
    font-style: italic;
  }

  /* Code styling is now handled by global CSS with Shiki integration */
}

/* Dark theme adjustments for content renderer */
:deep(.v-theme--dark) {
  .content-renderer {
    :deep(blockquote) {
      border-left-color: var(--v-primary-lighten-2);
    }
  }
}
</style>
