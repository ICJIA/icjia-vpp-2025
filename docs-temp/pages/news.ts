/**
 * @module news
 * @fileoverview Vue component: news
 */

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
  title: "News & Updates - Violence Prevention Plan for Illinois: 2025-2029",
  description:
    "Stay updated with the latest news, announcements, and developments in Illinois violence prevention initiatives, community programs, and policy updates.",
});
