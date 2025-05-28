<template>
  <section class="news-section section section-primary py-16">
    <v-container>
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold mb-4">
          Latest News & Updates
        </h2>
        <p class="text-h6 text-medium-emphasis max-width-800 mx-auto mb-8">
          Stay informed about violence prevention initiatives, research findings, and community 
          programs making a difference across Illinois.
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="pending" class="text-center py-8">
        <v-progress-circular
          color="primary"
          size="40"
          indeterminate
          aria-label="Loading news articles"
        />
        <p class="text-body-1 mt-4 text-medium-emphasis">Loading latest news...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-8">
        <v-icon icon="mdi-alert-circle" size="48" color="error" class="mb-4" />
        <h3 class="text-h6 mb-2">Unable to Load News</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          We're having trouble loading the latest news. Please try again later.
        </p>
        <v-btn
          color="primary"
          variant="outlined"
          @click="refresh"
          prepend-icon="mdi-refresh"
        >
          Try Again
        </v-btn>
      </div>

      <!-- News grid -->
      <div v-else-if="newsItems && newsItems.length > 0" class="news-grid">
        <NewsCard
          v-for="(item, index) in newsItems"
          :key="item._path || index"
          :news-item="item"
          :delay="index * 150"
          class="news-grid-item"
        />
      </div>

      <!-- No news state -->
      <div v-else class="text-center py-8">
        <v-icon icon="mdi-newspaper-variant-outline" size="48" color="primary" class="mb-4" />
        <h3 class="text-h6 mb-2">No News Available</h3>
        <p class="text-body-2 text-medium-emphasis">
          Check back soon for the latest violence prevention news and updates.
        </p>
      </div>

      <!-- View all news button -->
      <div v-if="newsItems && newsItems.length > 0" class="text-center mt-12">
        <v-btn
          color="primary"
          size="large"
          variant="outlined"
          class="rounded-pill px-8"
          @click="handleViewAllNews"
          append-icon="mdi-arrow-right"
        >
          View All News
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<script setup>
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import NewsCard from '~/components/content/NewsCard.vue';

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
    }
  }
});

const router = useRouter();

/**
 * Fetch news content using Nuxt Content v3 with optimized query
 * Uses queryCollection() with .limit() method as documented
 * Sorts by date descending at database level for better performance
 */
const { data: allNews, pending, error, refresh } = await useAsyncData('home-news', async () => {
  try {
    // Use Nuxt Content v3 queryCollection with .limit() method
    // Sort by date descending and limit results at query level
    const news = await queryCollection('content')
      .where('path', 'LIKE', '/news%')
      .order('date', 'DESC')
      .limit(props.itemCount)
      .all();

    return news || [];
  } catch (err) {
    console.error('Error fetching news:', err);
    throw err;
  }
});

/**
 * Computed property for news items with proper formatting
 */
const newsItems = computed(() => {
  if (!allNews.value) return [];

  return allNews.value.map(item => ({
    ...item,
    // Ensure we have all required fields
    title: item.title || 'Untitled',
    summary: item.summary || item.description || '',
    date: item.date || new Date().toISOString().split('T')[0],
    image: item.image || null,
    _path: item.path
  }));
});

/**
 * Handle "View All News" button click
 * Navigates to the full news listing page
 */
const handleViewAllNews = () => {
  router.push('/news');
};
</script>

<style scoped>
/* Background handled by global .section-primary class */

.max-width-800 {
  max-width: 800px;
}

/* Section animations */
.news-section h2 {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

.news-section > .v-container > div:first-child p {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s;
}

/* News grid layout */
.news-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}

/* Responsive grid adjustments */
@media (min-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .news-grid {
    gap: 2rem;
  }
}

/* Grid item styling */
.news-grid-item {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* View all button animation */
.news-section .v-btn {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 1s;
}

/* Animation keyframes */
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

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .news-section h2,
  .news-section > .v-container > div:first-child p,
  .news-section .v-btn {
    animation: none;
    opacity: 1;
  }
}
</style>
