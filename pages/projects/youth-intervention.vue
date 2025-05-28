<template>
  <div class="youth-intervention-page">
    <!-- Use PageTitleSection for consistent styling -->
    <PageTitleSection
      :title="pageTitle"
      :description="pageDescription"
      :show-border="true"
    />

    <!-- Main Content -->
    <div class="page-content">
      <div class="container">
        <!-- Simple Content Display -->
        <SimpleContentDisplay
          :path="contentPath"
        />

        <!-- Fallback Content (shown only if content fails to load) -->
        <div v-if="showFallbackContent" class="mt-8">
          <v-row>
            <v-col cols="12" lg="6" class="pr-lg-12">
              <h2 class="text-h3 font-weight-bold mb-6">Youth Programs</h2>
              <p class="text-body-1 mb-4">
                This is a fallback content for Youth Intervention programs. The dynamic content could not be loaded.
              </p>
              <p class="text-body-1 mb-4">
                Please check back later for updated information about our youth intervention initiatives and programs.
              </p>
            </v-col>

            <v-col cols="12" lg="6" class="mt-8 mt-lg-0">
              <ImageWithSpinner
                src="https://placehold.co/1200x800?text=Youth+Intervention"
                alt="Youth Intervention Programs"
                image-class="rounded-xl youth-image"
                height="400"
                cover
                spinner-color="primary"
              />
            </v-col>
          </v-row>

          <section class="section py-16 bg-primary-lighten-5 mt-8">
            <div class="text-center">
              <h2 class="text-h3 font-weight-bold mb-6">Our Approach</h2>
              <p class="text-body-1 mx-auto mb-8" style="max-width: 600px;">
                Our youth intervention approach focuses on early prevention, education, and support systems.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Youth Intervention page for the Violence Prevention Plan for Illinois: 2025-2029
 *
 * This page now uses the standardized PageTitleSection component for consistent
 * typography and styling across the site. It dynamically fetches and renders content
 * from the content directory using the ContentDisplay component and useContentFetcher composable.
 *
 * Features:
 * - Reusable PageTitleSection component with infographic-style typography
 * - Dynamic content fetching from /content/projects/youth-intervention.md
 * - Proper loading states and error handling
 * - Fallback content if dynamic content fails to load
 * - SEO metadata based on content frontmatter
 * - Accessibility features and consistent visual hierarchy
 *
 * @page
 */
import { ref, computed, watch } from 'vue';
import { useHead, useSeoMeta, useRoute } from '#imports';
import { useConsoleLogger } from '~/composables/useConsoleLogger';
import useContentFetcher from '~/composables/useContentFetcher';
import SimpleContentDisplay from '~/components/SimpleContentDisplay.vue';
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';
import PageTitleSection from '~/components/content/PageTitleSection.vue';

// Initialize console logger
const { log, logError } = useConsoleLogger();

// Get the current route
const route = useRoute();

// Content path for this page
const contentPath = '/projects/youth-intervention';

// Log the content path
log('content', 'Youth Intervention page - content path', {
  route: route.name,
  path: contentPath,
  timestamp: new Date().toISOString()
});

// For direct access to content data
const { content, error } = useContentFetcher({
  path: contentPath
});

// Flag to show fallback content if there's an error
const showFallbackContent = ref(false);

// Watch for errors to show fallback content
watch(error, (newError) => {
  if (newError) {
    logError('Youth Intervention content error', {
      error: newError.message,
      timestamp: new Date().toISOString()
    });
    showFallbackContent.value = true;
  }
});

// Default page title and description (fallbacks)
const defaultTitle = 'Youth Intervention';
const defaultDescription = 'Learn about our youth intervention programs for the Violence Prevention Plan for Illinois: 2025-2029.';

// Computed properties for page title and description
const pageTitle = computed(() => content.value?.title || defaultTitle);
const pageDescription = computed(() => content.value?.description || defaultDescription);

/**
 * Set page title and HTML attributes for accessibility and SEO
 */
useHead({
  title: computed(() => `Violence Prevention Plan for Illinois: 2025-2029 - ${pageTitle.value}`),
  htmlAttrs: {
    lang: 'en'
  }
});

/**
 * Set SEO metadata based on content frontmatter
 */
useSeoMeta({
  description: computed(() => pageDescription.value),
  ogTitle: computed(() => `Violence Prevention Plan for Illinois: 2025-2029 - ${pageTitle.value}`),
  ogDescription: computed(() => pageDescription.value),
  ogImage: '/images/og-image-youth.jpg',
  twitterCard: 'summary_large_image',
});

// Watch for successful content loading to hide fallback content
watch(content, (newContent) => {
  if (newContent) {
    log('content', 'Youth Intervention content loaded', {
      timestamp: new Date().toISOString()
    });
    showFallbackContent.value = false;
  }
});
</script>

<style scoped>
/**
 * Youth Intervention Page Styling - Consistent with PageTitleSection System
 *
 * Implements the standardized page layout with soft light theme background,
 * consistent spacing, and proper content structure to match other pages
 * using the PageTitleSection component.
 */

/* Page structure with soft light theme background */
.youth-intervention-page {
  min-height: 100vh;
  padding-top: 60px; /* Account for sticky header */
  overflow-x: hidden;
  /* Soft light theme background to reduce eye strain */
  background: #FAFAFA;
}

/* Dark theme background override */
:root[data-theme="dark"] .youth-intervention-page {
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

.youth-image {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: transform 0.5s ease;
}

/* Dark mode image shadow */
:root[data-theme="dark"] .youth-image {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
}

.youth-image:hover {
  transform: scale(1.02);
}

/* Responsive design */
@media (max-width: 768px) {
  .youth-intervention-page {
    padding-top: 50px; /* Smaller header offset on mobile */
  }

  .page-content {
    padding: 3rem 0; /* Responsive spacing - reduced from 4.5rem for mobile */
  }

  .container {
    padding: 0 1rem;
  }
}

/* Add focus styles for accessibility */
:deep(*:focus-visible) {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .youth-image {
    transition: none;
  }

  .youth-image:hover {
    transform: none;
  }
}

/* Print styles */
@media print {
  .youth-intervention-page {
    background: none !important;
    padding-top: 0;
  }

  .page-content {
    padding: 2rem 0;
  }
}
</style>
