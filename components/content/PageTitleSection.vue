<template>
  <section class="page-title-section" :class="{ 'with-border': showBorder }">
    <div class="container">
      <div class="title-content">
        <h1 class="main-page-title">
          <slot name="title">{{ title }}</slot>
        </h1>
        <div v-if="$slots.description || description" class="page-description">
          <slot name="description">
            <p>{{ description }}</p>
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * PageTitleSection Component - Reusable Page Title System
 * 
 * A standardized, reusable component for creating consistent page titles across
 * the entire project. Provides infographic-style typography with professional
 * animations and full accessibility compliance.
 * 
 * Features:
 * - Infographic-style large typography (5rem base font size)
 * - Professional fade-in animations with staggered timing
 * - Full responsive design with proportional scaling
 * - Light/dark theme compatibility
 * - Optional subtitle/description support
 * - Optional border separator
 * - WCAG 2.1 AA accessibility compliance
 * - Consistent margins, padding, and spacing
 * - Reusable across all project pages
 * 
 * Usage Examples:
 * 
 * Basic usage with props:
 * <PageTitleSection 
 *   title="Page Title" 
 *   description="Page description text"
 *   :show-border="true" 
 * />
 * 
 * Advanced usage with slots:
 * <PageTitleSection :show-border="true">
 *   <template #title>Custom <strong>Title</strong> Content</template>
 *   <template #description>
 *     <p>Custom description with <em>formatting</em></p>
 *   </template>
 * </PageTitleSection>
 * 
 * @component
 */

/**
 * Component props
 * 
 * @typedef {Object} Props
 * @property {string} [title] - The main page title text (can be overridden by title slot)
 * @property {string} [description] - The page description text (can be overridden by description slot)
 * @property {boolean} [showBorder=false] - Whether to show the bottom border separator
 */
const props = defineProps({
  /**
   * Main page title text
   * Can be overridden using the title slot for custom formatting
   */
  title: {
    type: String,
    default: ''
  },

  /**
   * Page description/subtitle text
   * Can be overridden using the description slot for custom formatting
   */
  description: {
    type: String,
    default: ''
  },

  /**
   * Whether to show the subtle bottom border separator
   * Useful for pages that need visual separation between title and content
   */
  showBorder: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
/**
 * PageTitleSection Styling - Infographic-Style Design System
 * 
 * Implements a modern, professional page title system with:
 * - Large, impactful typography for infographic-style appearance
 * - Consistent spacing and layout patterns
 * - Professional animations with accessibility support
 * - Full responsive design with proportional scaling
 * - Light/dark theme compatibility
 * - WCAG 2.1 AA accessibility compliance
 */

/* Main page title section container */
.page-title-section {
  padding: 3rem 0 2.5rem;
  background: transparent;
}

/* Optional border separator for visual hierarchy */
.page-title-section.with-border {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

/* Container with consistent max-width and centering */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Title content wrapper for centering and max-width */
.title-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

/* Infographic-style main page title */
.main-page-title {
  /* Large, impactful font size for infographic-style appearance */
  font-size: 5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: rgba(var(--v-theme-on-surface), 0.95);
  font-family: 'Roboto', sans-serif;
  letter-spacing: -0.03em;
  /* Professional entrance animation */
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
}

/* Page description styling */
.page-description {
  /* Staggered animation for professional appearance */
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.4s;
}

.page-description p {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(var(--v-theme-on-surface), 0.8);
  margin: 0;
  max-width: 800px;
  margin: 0 auto;
}

/* Responsive design with proportional scaling */
@media (max-width: 960px) {
  .main-page-title {
    font-size: 4rem; /* 80% of 5rem for tablet scaling */
  }
}

@media (max-width: 768px) {
  .page-title-section {
    padding: 2.5rem 0 2rem;
  }

  .main-page-title {
    font-size: 3rem; /* 60% of 5rem for mobile scaling */
  }

  .page-description p {
    font-size: 1rem;
  }

  .container {
    padding: 0 1rem;
  }
}

@media (max-width: 600px) {
  .main-page-title {
    font-size: 2.25rem; /* 45% of 5rem for small mobile */
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

/* Reduced motion support for accessibility */
@media (prefers-reduced-motion: reduce) {
  .main-page-title,
  .page-description {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
}

/* Print styles */
@media print {
  .page-title-section {
    padding: 2rem 0 1rem;
    border-bottom: 1px solid #ccc;
  }

  .main-page-title,
  .page-description {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
}
</style>
