<template>
  <div class="news-card-container" :style="animationStyle">
    <v-card
      variant="elevated"
      class="news-card-inner"
      role="article"
      tabindex="0"
      @click="handleCardClick"
      @keydown.enter="handleCardClick"
      @keydown.space.prevent="handleCardClick"
      :aria-labelledby="`news-title-${uniqueId}`"
      :aria-describedby="`news-summary-${uniqueId}`"
    >
      <!-- Horizontal layout with image and content -->
      <div class="news-card-content">
        <!-- Image section -->
        <div class="news-image-section">
          <ImageWithSpinner
            :src="newsItem.image || '/images/illinois-seal.png'"
            :alt="newsItem.image ? `Image for ${newsItem.title}` : 'Illinois State Seal'"
            image-class="news-image"
            aspect-ratio="4/3"
            cover
            spinner-color="primary"
          />
        </div>

        <!-- Content section -->
        <div class="news-content-section">
          <!-- Date badge -->
          <div class="news-date-section">
            <v-chip
              color="primary"
              size="small"
              class="news-date-chip"
              prepend-icon="mdi-calendar"
            >
              {{ formattedDate }}
            </v-chip>
          </div>

          <!-- Title -->
          <div :id="`news-title-${uniqueId}`" class="news-title-section">
            <h3 class="news-title">
              {{ newsItem.title }}
            </h3>
          </div>

          <!-- Summary -->
          <div :id="`news-summary-${uniqueId}`" class="news-summary-section">
            <p class="news-summary">
              {{ newsItem.summary }}
            </p>
          </div>

          <!-- Read more indicator -->
          <div class="news-action-section">
            <v-btn
              variant="text"
              color="primary"
              size="small"
              append-icon="mdi-arrow-right"
              class="news-read-more"
              tabindex="-1"
            >
              Read More
            </v-btn>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
/**
 * News Card Component - Horizontal Layout
 *
 * Displays individual news items with horizontal layout featuring image thumbnail
 * on the left and content on the right. Follows project card design patterns
 * with full accessibility compliance and theme support.
 *
 * Features:
 * - Horizontal layout with image thumbnail and content
 * - Illinois State seal fallback for items without images
 * - Card-level click navigation to full article
 * - Proper date formatting following project conventions
 * - Enhanced accessibility with ARIA attributes
 * - Smooth animations with reduced motion support
 * - Professional hover and focus effects
 * - Full theme compatibility (light/dark)
 * - WCAG 2.1 AA compliance
 *
 * @component
 */
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';

/**
 * Component props
 *
 * @typedef {Object} Props
 * @property {Object} newsItem - The news item object with title, summary, date, etc.
 * @property {number} [delay=0] - Animation delay in milliseconds
 */
const props = defineProps({
  newsItem: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value.title && value.summary && value.date;
    }
  },
  delay: {
    type: Number,
    default: 0
  }
});

const router = useRouter();

/**
 * Unique ID for ARIA attributes
 */
const uniqueId = ref('');

/**
 * Generate unique ID on mount
 */
onMounted(() => {
  uniqueId.value = `news-${Math.random().toString(36).substring(2, 9)}`;
});

/**
 * Computed style for animation delay
 */
const animationStyle = computed(() => ({
  animationDelay: `${props.delay}ms`
}));

/**
 * Format date for display
 * Converts YYYY-MM-DD to Month DD, YYYY format
 */
const formattedDate = computed(() => {
  if (!props.newsItem.date) return '';
  
  try {
    const date = new Date(props.newsItem.date);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Invalid date format:', props.newsItem.date);
    return props.newsItem.date;
  }
});

/**
 * Handle card click navigation
 * Navigates to the full news article
 */
const handleCardClick = () => {
  if (props.newsItem._path) {
    router.push(props.newsItem._path);
  } else {
    // Fallback: construct path from filename or slug
    const slug = props.newsItem._file?.replace('.md', '') || 
                 props.newsItem.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (slug) {
      router.push(`/news/${slug}`);
    }
  }
};
</script>

<style scoped>
/* Animation and container */
.news-card-container {
  opacity: 0;
  animation: fadeSlideUp 0.6s forwards;
  height: 100%;
}

/* Card styling */
.news-card-inner {
  height: 100%;
  min-height: 200px;
  border-radius: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

/* Dark mode box shadow */
:root[data-theme="dark"] .news-card-inner {
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
}

/* Hover and focus effects */
.news-card-inner:hover,
.news-card-inner:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Dark theme hover */
:root[data-theme="dark"] .news-card-inner:hover,
:root[data-theme="dark"] .news-card-inner:focus-visible {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

/* Focus outline */
.news-card-inner:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

/* Horizontal layout */
.news-card-content {
  display: grid;
  grid-template-columns: 200px 1fr;
  height: 100%;
  min-height: 200px;
}

/* Image section */
.news-image-section {
  position: relative;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Content section */
.news-content-section {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas:
    "date"
    "title"
    "summary"
    "action";
  padding: 1.5rem;
  gap: 1rem;
  align-content: start;
}

/* Date section */
.news-date-section {
  grid-area: date;
}

.news-date-chip {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Title section */
.news-title-section {
  grid-area: title;
}

.news-title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface));
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Summary section */
.news-summary-section {
  grid-area: summary;
  align-self: start;
}

.news-summary {
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgb(var(--v-theme-on-surface-variant));
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Action section */
.news-action-section {
  grid-area: action;
  align-self: end;
}

.news-read-more {
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
}

/* Responsive design */
@media (max-width: 768px) {
  .news-card-content {
    grid-template-columns: 1fr;
    grid-template-rows: 150px 1fr;
  }
  
  .news-image-section {
    grid-row: 1;
  }
  
  .news-content-section {
    grid-row: 2;
    padding: 1rem;
  }
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
  .news-card-container {
    animation: none;
    opacity: 1;
  }
  
  .news-card-inner:hover {
    transform: none;
  }
}
</style>
