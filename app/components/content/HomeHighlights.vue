<template>
  <section class="section py-16">
    <v-container>
      <v-row align="center">
        <v-col cols="12" md="6">
          <ImageWithSpinner
            src="https://placehold.co/1200x800?text=VPP+Image+Here"
            alt="App Screenshot"
            image-class="rounded-xl shadow-img"
            aspect-ratio="4/3"
            cover
            spinner-color="primary"
          />
        </v-col>

        <v-col cols="12" md="6" class="pl-md-12">
          <div class="mb-8">
            <slot mdc-unwrap="p" />
          </div>

          <v-list class="bg-transparent pa-0" role="list">
            <v-list-item class="pa-0 mb-4" role="listitem">
              <template v-slot:prepend>
                <v-icon
                  color="success"
                  icon="mdi-check-circle"
                  class="mr-2"
                  aria-hidden="true"
                ></v-icon>
              </template>
              <v-list-item-title class="text-body-1">
                <slot name="highlight-1" mdc-unwrap="p" />
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="pa-0 mb-4" role="listitem">
              <template v-slot:prepend>
                <v-icon
                  color="success"
                  icon="mdi-check-circle"
                  class="mr-2"
                  aria-hidden="true"
                ></v-icon>
              </template>
              <v-list-item-title class="text-body-1">
                <slot name="highlight-2" mdc-unwrap="p" />
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="pa-0 mb-4" role="listitem">
              <template v-slot:prepend>
                <v-icon
                  color="success"
                  icon="mdi-check-circle"
                  class="mr-2"
                  aria-hidden="true"
                ></v-icon>
              </template>
              <v-list-item-title class="text-body-1">
                <slot name="highlight-3" mdc-unwrap="p" />
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="pa-0 mb-4" role="listitem">
              <template v-slot:prepend>
                <v-icon
                  color="success"
                  icon="mdi-check-circle"
                  class="mr-2"
                  aria-hidden="true"
                ></v-icon>
              </template>
              <v-list-item-title class="text-body-1">
                <slot name="highlight-4" mdc-unwrap="p" />
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="pa-0 mb-4" role="listitem">
              <template v-slot:prepend>
                <v-icon
                  color="success"
                  icon="mdi-check-circle"
                  class="mr-2"
                  aria-hidden="true"
                ></v-icon>
              </template>
              <v-list-item-title class="text-body-1">
                <slot name="highlight-5" mdc-unwrap="p" />
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <v-btn
            color="primary"
            variant="tonal"
            size="large"
            class="mt-8 rounded-pill px-8"
          >
            <slot name="button-text" mdc-unwrap="p" />
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
/**
 * Home Highlights Component
 *
 * Displays the project highlights section with an image and feature list.
 * This component was extracted from the original index.vue page to enable
 * its use within MDC (Markdown Components) files.
 *
 * Features:
 * - Responsive layout with image and content side-by-side
 * - Accessible list with proper ARIA attributes
 * - Interactive elements with keyboard navigation support
 * - Animated image with hover effects
 * - Call-to-action button
 *
 * Accessibility Features:
 * - Proper heading hierarchy
 * - ARIA labels for list structure
 * - Keyboard navigation support
 * - Screen reader friendly content structure
 *
 * @component
 */
import ImageWithSpinner from "~/components/content/ImageWithSpinner.vue";

/**
 * Home Highlights Component
 *
 * Displays the project highlights section with an image and feature list.
 * This component now uses slots for content management, allowing all text content
 * to be defined in markdown files for better searchability and content management.
 *
 * Features:
 * - Responsive layout with image and content side-by-side
 * - Accessible list with proper ARIA attributes
 * - Interactive elements with keyboard navigation support
 * - Animated image with hover effects
 * - Call-to-action button
 * - Slot-based content management for title, description, and individual highlights
 *
 * @component
 */
</script>

<style scoped>
.shadow-img {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: transform 0.5s ease;
}

.shadow-img:hover {
  transform: scale(1.02) rotate(1deg);
}
</style>
