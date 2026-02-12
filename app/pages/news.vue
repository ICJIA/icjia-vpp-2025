<script setup>
/**
 * News Listing Page - Enhanced with Reusable Page Title System
 *
 * Displays all news items as clickable cards using the existing NewsCard component.
 * Now implements the standardized PageTitleSection component for consistent
 * typography and styling across the entire project.
 *
 * Features:
 * - Reusable PageTitleSection component with infographic-style typography
 * - Horizontal card layout with image thumbnails on left, content on right
 * - Card-level click navigation to individual news articles
 * - Illinois State seal as placeholder for items without images
 * - Consistent styling with site's card patterns
 * - WCAG 2.1 AA accessibility compliance
 * - Light/dark theme compatibility
 * - Loading and error states
 * - Responsive design with proper spacing
 *
 * @page
 */
import { computed } from "vue";
import NewsCard from "~/components/content/NewsCard.vue";
import PageTitleSection from "~/components/content/PageTitleSection.vue";
import StructuredData from "~/components/seo/StructuredData.vue";

/**
 * SEO Configuration
 */
const newsTitle =
  "News & Updates - Violence Prevention Plan for Illinois: 2025-2029";
const newsDescription =
  "Stay updated with the latest news, announcements, and developments in Illinois violence prevention initiatives, community programs, and policy updates.";
const newsCanonicalUrl = "https://vpp.icjia.illinois.gov/news";
const newsOgImage =
  "https://vpp.icjia.illinois.gov/images/og-image-vpp-2025.png";

useHead({
  title: newsTitle,
  htmlAttrs: {
    lang: "en",
  },
  link: [{ rel: "canonical", href: newsCanonicalUrl }],
});

/**
 * Fetch all news items using the existing working implementation
 * Keep the current queryCollection logic unchanged as requested
 */
const {
  data: allNews,
  pending,
  error,
  refresh,
} = await useAsyncData("news", () => {
  return queryCollection("content")
    .where("path", "LIKE", "/news%")
    .order("date", "DESC")
    .all();
});

/**
 * Computed property for news items with proper formatting
 * Ensures all required fields are available for the NewsCard component
 */
const newsItems = computed(() => {
  if (!allNews.value) return [];

  return allNews.value.map((item) => ({
    ...item,
    // Ensure we have all required fields for NewsCard component
    title: item.title || "Untitled",
    summary: item.summary || item.description || "",
    date: item.date || new Date().toISOString().split("T")[0],
    image: item.image || null,
    _path: item.path,
  }));
});

/**
 * SEO meta configuration
 */
useSeoMeta({
  title: newsTitle,
  description: newsDescription,

  // Open Graph meta tags
  ogTitle: newsTitle,
  ogDescription: newsDescription,
  ogImage: newsOgImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt:
    "News & Updates - Violence Prevention Plan for Illinois: 2025-2029",
  ogUrl: newsCanonicalUrl,
  ogType: "website",
  ogSiteName: "Statewide Violence Prevention Plan for Illinois: 2025-2029",
  ogLocale: "en_US",

  // Twitter Card meta tags
  twitterCard: "summary_large_image",
  twitterTitle: newsTitle,
  twitterDescription: newsDescription,
  twitterImage: newsOgImage,
  twitterImageAlt:
    "News & Updates - Violence Prevention Plan for Illinois: 2025-2029",
  twitterSite: "@ICJIA_Illinois",
  twitterCreator: "@ICJIA_Illinois",

  // Additional SEO meta tags
  canonical: newsCanonicalUrl,
  robots: "index, follow",
  author: "Illinois Criminal Justice Information Authority",
  keywords:
    "violence prevention news, Illinois, updates, announcements, community programs, policy updates",

  // Informational: helps dev tools show when page content was last updated
  ogUpdatedTime: new Date().toISOString(),
});
</script>

<template>
  <div class="news-page">
    <!-- SEO Structured Data for News Collection -->
    <StructuredData
      :content="{
        title:
          'News & Updates - Violence Prevention Plan for Illinois: 2025-2029',
        description:
          'Stay updated with the latest news, announcements, and developments in Illinois violence prevention initiatives, community programs, and policy updates.',
      }"
      page-type="collection"
      :path="'/news'"
      :collection-items="newsItems"
    />

    <!-- Reusable Page Title Section Component -->
    <PageTitleSection
      title="News & Updates"
      description="Stay informed about the latest developments in Illinois violence prevention initiatives, community programs, funding announcements, and policy updates."
      :show-border="true"
    />

    <!-- Main Content -->
    <div class="page-content">
      <div class="container">
        <!-- Loading state -->
        <div v-if="pending" class="loading-state">
          <div class="text-center py-12">
            <v-progress-circular
              color="primary"
              size="64"
              width="4"
              indeterminate
              class="mb-4"
            />
            <h3 class="text-h6 mb-2">Loading News</h3>
            <p class="text-body-2 text-medium-emphasis">
              Fetching the latest updates...
            </p>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <div class="text-center py-12">
            <v-icon
              icon="mdi-alert-circle"
              size="64"
              color="error"
              class="mb-4"
            />
            <h3 class="text-h6 mb-2">Unable to Load News</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
              We're having trouble loading the latest news. Please try again
              later.
            </p>
            <v-btn
              color="primary"
              variant="outlined"
              @click="refresh"
              prepend-icon="mdi-refresh"
              size="large"
            >
              Try Again
            </v-btn>
          </div>
        </div>

        <!-- News grid -->
        <div v-else-if="newsItems && newsItems.length > 0" class="news-grid">
          <NewsCard
            v-for="(item, index) in newsItems"
            :key="item._path || index"
            :news-item="item"
            :delay="index * 100"
            class="news-grid-item"
          />
        </div>

        <!-- Empty state -->
        <div v-else class="empty-state">
          <div class="text-center py-12">
            <v-icon
              icon="mdi-newspaper-variant-outline"
              size="64"
              color="primary"
              class="mb-4"
            />
            <h3 class="text-h6 mb-2">No News Available</h3>
            <p class="text-body-2 text-medium-emphasis">
              Check back soon for the latest updates and announcements.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/**
 * News Page Styling
 *
 * Implements consistent styling patterns matching the site's design system.
 * Includes proper spacing, typography, and responsive behavior.
 * Maintains accessibility standards and theme compatibility.
 */

/* Page structure */
.news-page {
  min-height: 100vh;
  padding-top: 60px; /* Reduced from 80px to bring title closer to top */
  /* Soft light theme background to reduce eye strain */
  background: #fafafa;
}

/* Dark theme background override */
:root[data-theme="dark"] .news-page {
  background: rgb(var(--v-theme-surface));
}

/* Container styling for content areas */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Main content */
.page-content {
  padding: 4.5rem 0; /* Increased from 3rem 0 for better visual breathing room */
}

/* News grid */
.news-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  max-width: 900px;
  margin: 0 auto;
}

.news-grid-item {
  width: 100%;
}

/* State containers */
.loading-state,
.error-state,
.empty-state {
  max-width: 600px;
  margin: 0 auto;
}

/* Responsive design for page layout */
@media (max-width: 768px) {
  .news-page {
    padding-top: 50px; /* Further reduced header offset on mobile */
  }

  .page-content {
    padding: 3rem 0; /* Responsive spacing - reduced from 4.5rem for mobile */
  }

  .container {
    padding: 0 1rem;
  }

  .news-grid {
    gap: 1.5rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .news-grid-item {
    animation: none !important;
  }
}

/* Focus styles for accessibility */
.news-grid-item:focus-within {
  outline: 2px solid rgba(var(--v-theme-primary), 0.8);
  outline-offset: 4px;
  border-radius: 1rem;
}

/* Print styles */
@media print {
  .news-grid {
    gap: 1rem;
  }
}
</style>
