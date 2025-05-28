<template>
  <div class="sandbox-home-page">
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

    <!-- Fallback content if no markdown file -->
    <div v-else>
      <SandboxHomeHero />
      <SandboxHomeStatistics />
      <SandboxHomeGoals />
      <SandboxHomeStakeholders />
      <SandboxHomePrinciples />
      <SandboxHomeApproach />
      <SandboxHomeAction />
    </div>
  </div>
</template>

<script setup>
/**
 * Sandbox Home Page for Violence Prevention Plan Testing
 *
 * This is a comprehensive test implementation of the new homepage design
 * based on the Violence Prevention Plan analysis. It maintains the exact
 * look, feel, and styling of the current homepage while implementing
 * all content recommendations from the VPP analysis.
 *
 * Features:
 * - Hero section with mission-driven opening statements
 * - Key statistics dashboard with visual presentation
 * - Strategic priorities overview (3 main goals)
 * - Stakeholder/partnership information
 * - Guiding principles section
 * - Public health approach explanation
 * - Call to action section
 * - Full theme compatibility (light/dark)
 * - WCAG 2.1 AA accessibility compliance
 * - Responsive design
 *
 * @page
 */
import { computed } from 'vue';
import { useHead, useSeoMeta } from '#imports';
import { useConsoleLogger } from '~/composables/useConsoleLogger';
import useContentFetcher from '~/composables/useContentFetcher';

// Import sandbox components
import SandboxHomeHero from '~/components/sandbox/SandboxHomeHero.vue';
import SandboxHomeStatistics from '~/components/sandbox/SandboxHomeStatistics.vue';
import SandboxHomeGoals from '~/components/sandbox/SandboxHomeGoals.vue';
import SandboxHomeStakeholders from '~/components/sandbox/SandboxHomeStakeholders.vue';
import SandboxHomePrinciples from '~/components/sandbox/SandboxHomePrinciples.vue';
import SandboxHomeApproach from '~/components/sandbox/SandboxHomeApproach.vue';
import SandboxHomeAction from '~/components/sandbox/SandboxHomeAction.vue';

// Initialize console logger
const { log } = useConsoleLogger();

// Content path for the sandbox home page
const contentPath = '/sandbox-home';

// Log the content path
log('content', 'Sandbox home page - loading MDC content', {
  path: contentPath,
  timestamp: new Date().toISOString()
});

// Use the project's content fetcher composable
const { content, pending, error, refresh } = useContentFetcher({
  path: contentPath
});

// Watch for successful content loading
if (content.value) {
  log('content', 'Sandbox home page content loaded', {
    title: content.value.title,
    timestamp: new Date().toISOString()
  });
}

/**
 * Set page title and HTML attributes for accessibility and SEO
 * Uses content frontmatter when available, falls back to defaults
 */
useHead({
  title: computed(() => content.value?.title || 'Violence Prevention Plan for Illinois: 2025-2029 - Test Homepage'),
  htmlAttrs: {
    lang: 'en'
  }
});

/**
 * Set SEO meta tags
 * Uses content frontmatter when available, falls back to defaults
 */
useSeoMeta({
  title: computed(() => content.value?.title || 'Violence Prevention Plan for Illinois: 2025-2029 - Test Homepage'),
  description: computed(() => content.value?.description || 'Test implementation of the new homepage design based on the Violence Prevention Plan analysis for Illinois 2025-2029.'),
  ogTitle: computed(() => content.value?.ogTitle || 'Violence Prevention Plan for Illinois: 2025-2029 - Test Homepage'),
  ogDescription: computed(() => content.value?.ogDescription || 'Test implementation of the new homepage design based on the Violence Prevention Plan analysis for Illinois 2025-2029.'),
  twitterCard: computed(() => content.value?.twitterCard || 'summary_large_image'),
});
</script>

<style scoped>
.sandbox-home-page {
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
  :deep(.cta-button),
  :deep(.statistic-card),
  :deep(.goal-card),
  :deep(.principle-card) {
    animation: none !important;
    transition: none !important;
  }

  :deep(.shadow-img:hover),
  :deep(.cta-button:hover),
  :deep(.statistic-card:hover),
  :deep(.goal-card:hover),
  :deep(.principle-card:hover) {
    transform: none !important;
  }
}
</style>
