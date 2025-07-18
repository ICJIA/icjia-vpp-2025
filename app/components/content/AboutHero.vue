<template>
  <section class="hero-section py-16">
    <v-container>
      <v-row>
        <v-col cols="12" md="8" class="mx-auto text-center">
          <div class="animate-title">
            <slot />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
/**
 * AboutHero component for the About page
 *
 * This component displays the hero section of the about page with:
 * - Main page title with animation
 * - Subtitle description with delayed animation
 * - Responsive layout with centered content
 * - Accessibility-compliant heading structure
 *
 * @component
 */
</script>

<style scoped>
.animate-title {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
}

/* Style the H1 heading from the slot content to match homepage */
.animate-title :deep(h1) {
  font-size: 2.5rem; /* Large heading size */
  font-weight: 700; /* Bold weight */
  line-height: 1.2; /* Tight line height for impact */
  margin-bottom: 1.5rem; /* Space below heading */
  color: inherit; /* Use theme color */
}

/* Style the paragraph content from the slot */
.animate-title :deep(p) {
  font-size: 1.125rem; /* Slightly larger than body text */
  line-height: 1.6; /* Good readability */
  margin-bottom: 1rem; /* Add margin for proper spacing */
  color: rgba(var(--v-theme-on-surface), 0.8); /* Slightly muted text */
}

/* Style other markdown elements */
.animate-title :deep(strong) {
  font-weight: 700;
}

.animate-title :deep(em) {
  font-style: italic;
}

/* Responsive heading sizes to match homepage */
@media (max-width: 960px) {
  .animate-title :deep(h1) {
    font-size: 2rem; /* Smaller on tablets */
  }
}

@media (max-width: 600px) {
  .animate-title :deep(h1) {
    font-size: 1.75rem; /* Even smaller on mobile */
  }
}

.animate-text {
  opacity: 0;
  animation: fadeSlideUp 0.8s forwards;
  animation-delay: 0.2s;
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

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-title,
  .animate-text {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
}
</style>
