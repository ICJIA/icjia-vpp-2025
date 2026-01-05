/**
 * @module HomeNews
 * @fileoverview Vue component: HomeNews
 */

/**
 * Home News Section Component - Enhanced with Configurable Item Count
 *
 * Displays recent news items on the homepage with configurable count,
 * proper loading states, error handling, and navigation to the full news listing page.
 *
 * Features:
 * - Configurable item count (default: 3) for easy adjustment
 * - Uses Nuxt Content v3 queryCollection() with .limit() method
 * - Sorts by date descending (newest first) using database-level ordering
 * - Responsive grid layout with consistent card styling
 * - Loading and error states with user-friendly messaging
 * - Navigation to full news listing page
 * - Follows project section styling patterns with alternating backgrounds
 * - WCAG 2.1 AA accessibility compliance
 * - Full theme compatibility (light/dark)
 * - Smooth animations with reduced motion support
 * - Easy removal capability for demo content
 *
 * @component
 */
import { computed } from "vue";
import { useRouter } from "vue-router";
import NewsCard from "~/components/content/NewsCard.vue";

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {number} [itemCount=3] - Number of news items to display (2-3 recommended)
 */
const props = defineProps({
  itemCount: {
    type: Number,
    default: 3,
    validator: (value) => {
      return value >= 1 && value <= 10; // Reasonable limits
    },
  },
});

const router = useRouter();

/**
 * Fetch news content using Nuxt Content v3 with optimized query
 * Uses queryCollection() with .limit() method as documented
 * Sorts by date descending at database level for better performance
 */
const {
  data: allNews,
  pending,
  error,
  refresh,
} = await useAsyncData("home-news", async () => {
  try {
    // Use Nuxt Content v3 queryCollection with .limit() method
    // Sort by date descending and limit results at query level
    const news = await queryCollection("content")
      .where("path", "LIKE", "/news%")
      .order("date", "DESC")
      .limit(props.itemCount)
      .all();

    return news || [];
  } catch (err) {
    console.error("Error fetching news:", err);
    throw err;
  }
});

/**
 * Computed property for news items with proper formatting
 */
const newsItems = computed(() => {
  if (!allNews.value) return [];

  return allNews.value.map((item) => ({
    ...item,
    // Ensure we have all required fields
    title: item.title || "Untitled",
    summary: item.summary || item.description || "",
    date: item.date || new Date().toISOString().split("T")[0],
    image: item.image || null,
    _path: item.path,
  }));
});

/**
 * Handle "View All News" button click
 * Navigates to the full news listing page
 */
const handleViewAllNews = () => {
  router.push("/news");
};
