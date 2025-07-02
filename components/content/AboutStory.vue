<template>
  <section class="section py-16">
    <v-container>
      <v-row>
        <v-col cols="12" lg="6" class="pr-lg-12">
          <slot />
        </v-col>

        <v-col cols="12" lg="6" class="mt-8 mt-lg-0">
          <ImageWithSpinner
            src="https://placehold.co/1200x800?text=VPP+Image+Here"
            alt="Our Team"
            image-class="rounded-xl about-image"
            height="400"
            cover
            spinner-color="primary"
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
/**
 * AboutStory component for the About page
 *
 * This component displays the main story section with:
 * - Organization story and mission text
 * - Team image with loading spinner
 * - Responsive two-column layout
 * - Proper image accessibility attributes
 *
 * @component
 */
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";
</script>

<style scoped>
.about-image {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: transform 0.5s ease;
}

/* Dark mode about image shadow */
:root[data-theme="dark"] .about-image {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.5),
    0 10px 10px -5px rgba(0, 0, 0, 0.4);
}

.about-image:hover {
  transform: scale(1.02);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .about-image {
    transition: none !important;
  }

  .about-image:hover {
    transform: none !important;
  }
}

/* Markdown content styling */
:deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

:deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

:deep(strong) {
  font-weight: 700;
}

:deep(em) {
  font-style: italic;
}

:deep(ul) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

:deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}
</style>
