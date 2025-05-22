<template>
  <div class="community-outreach-page">
    <section class="hero-section py-16">
      <v-container>
        <v-row>
          <v-col cols="12" md="8" class="mx-auto text-center">
            <h1 class="text-h2 font-weight-bold mb-6 animate-title">{{ pageTitle }}</h1>
            <p class="text-body-1 mb-8 animate-text">
              {{ pageDescription }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <v-divider></v-divider>

    <section class="section py-16">
      <v-container>
        <v-row>
          <v-col cols="12" lg="10" class="mx-auto">
            <!-- Dynamic Content Display -->
            <ContentDisplay
              :path="contentPath"
              @render-complete="onRenderComplete"
              @error="onError"
            />
            
            <!-- Fallback Content (shown only if content fails to load) -->
            <div v-if="showFallbackContent" class="mt-8">
              <v-row>
                <v-col cols="12" lg="6" class="pr-lg-12">
                  <h2 class="text-h3 font-weight-bold mb-6">Our Community Programs</h2>
                  <p class="text-body-1 mb-4">
                    This is a fallback content for Community Outreach programs. The dynamic content could not be loaded.
                  </p>
                  <p class="text-body-1 mb-4">
                    Please check back later for updated information about our community outreach initiatives and programs.
                  </p>
                </v-col>

                <v-col cols="12" lg="6" class="mt-8 mt-lg-0">
                  <ImageWithSpinner
                    src="https://placehold.co/1200x800?text=Community+Outreach"
                    alt="Community Outreach Programs"
                    image-class="rounded-xl community-image"
                    height="400"
                    cover
                    spinner-color="primary"
                  />
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup>
/**
 * Community Outreach page for the Violence Prevention Plan for Illinois: 2025-2029
 *
 * This page dynamically fetches and renders content from the content directory
 * using the ContentDisplay component and useContentFetcher composable.
 *
 * Features:
 * - Dynamic content fetching from /content/projects/community-outreach.md
 * - Proper loading states and error handling
 * - Fallback content if dynamic content fails to load
 * - SEO metadata based on content frontmatter
 * - Accessibility features
 *
 * @page
 */
import { ref, computed, onMounted } from 'vue';
import { useHead, useSeoMeta, useRoute, useNuxtApp } from '#imports';
import { useConsoleLogger } from '~/composables/useConsoleLogger';
import useContentFetcher from '~/composables/useContentFetcher';
import ContentDisplay from '~/components/ContentDisplay.vue';
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';

// Initialize console logger
const { log, logError } = useConsoleLogger();

// Get the current route
const route = useRoute();

// Content path for this page
const contentPath = '/projects/community-outreach';

// Log the content path
log('content', 'Community Outreach page - content path', {
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

// Default page title and description (fallbacks)
const defaultTitle = 'Community Outreach';
const defaultDescription = 'Learn about our community outreach programs for the Violence Prevention Plan for Illinois: 2025-2029.';

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
  ogImage: '/images/og-image-community.jpg',
  twitterCard: 'summary_large_image',
});

/**
 * Handle render complete event
 */
function onRenderComplete(event) {
  log('content', 'Community Outreach content render complete', {
    path: event.path,
    timestamp: new Date().toISOString()
  });
  
  // Hide fallback content when rendering is successful
  showFallbackContent.value = false;
}

/**
 * Handle error event
 */
function onError(error) {
  logError('Community Outreach content error', {
    error: error.error?.message,
    timestamp: new Date().toISOString()
  });
  
  // Show fallback content when there's an error
  showFallbackContent.value = true;
}
</script>

<style scoped>
.community-outreach-page {
  overflow-x: hidden;
}

.animate-title {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
}

.animate-text {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

.community-image {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: transform 0.5s ease;
}

/* Dark mode image shadow */
:root[data-theme="dark"] .community-image {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
}

.community-image:hover {
  transform: scale(1.02);
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add focus styles for accessibility */
:deep(*:focus-visible) {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-title,
  .animate-text {
    animation: none;
    opacity: 1;
  }
  
  .community-image {
    transition: none;
  }
  
  .community-image:hover {
    transform: none;
  }
}
</style>
