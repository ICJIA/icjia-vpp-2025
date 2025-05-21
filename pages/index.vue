<template>
  <div>
    <HeroSection />

    <v-divider></v-divider>

    <FeatureSection />

    <v-divider></v-divider>

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
            <h2 class="text-h3 font-weight-bold mb-6">
              Enim manus aether virtus manus mare carmen elit
            </h2>

            <p class="text-body-1 mb-8">
              Tempus tempus rex terra summo ipsum fine stella portitor enim mare homo bellum deus opus.
            </p>

            <v-list class="bg-transparent pa-0" role="list">
              <v-list-item
                v-for="(item, i) in highlights"
                :key="i"
                class="pa-0 mb-4"
                role="listitem"
              >
                <template v-slot:prepend>
                  <v-icon
                    color="success"
                    icon="mdi-check-circle"
                    class="mr-2"
                    aria-hidden="true"
                  ></v-icon>
                </template>
                <v-list-item-title class="text-body-1">{{ item }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-btn
              color="primary"
              variant="tonal"
              size="large"
              class="mt-8 rounded-pill px-8"
            >
              Ipsum Enim Vita
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="section py-16 bg-primary-lighten-5">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 font-weight-bold mb-4">Ipsum Enim Vita</h2>
          <p class="text-body-1 mx-auto" style="max-width: 600px;">
            Lorem elit anima lumen manus.
          </p>
        </div>

        <div class="text-center">
          <v-btn
            color="primary"
            size="x-large"
            class="rounded-pill px-8 py-3 elevation-3 cta-button"
          >
            Ipsum Enim Vita
            <v-icon end icon="mdi-arrow-right" />
          </v-btn>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup>
/**
 * Home page for the Violence Prevention Plan for Illinois: 2025-2029
 *
 * This page includes:
 * - Hero section with main call-to-action
 * - Feature section highlighting key capabilities
 * - Project highlights with accessible list
 * - Call-to-action section
 * - Proper SEO metadata and accessibility attributes
 *
 * @page
 */
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';
import { useHead, useSeoMeta } from '#imports';

/**
 * Set page title and HTML attributes for accessibility and SEO
 */
useHead({
  title: 'Violence Prevention Plan for Illinois: 2025-2029 - Home',
  htmlAttrs: {
    lang: 'en'
  }
});

/**
 * Set SEO metadata for search engines and social sharing
 * Includes Open Graph and Twitter Card metadata
 */
useSeoMeta({
  description: 'The Violence Prevention Plan for Illinois: 2025-2029 provides resources and tools for violence prevention initiatives across Illinois.',
  ogTitle: 'Violence Prevention Plan for Illinois: 2025-2029 - Home',
  ogDescription: 'Resources and tools for violence prevention initiatives across Illinois.',
  ogImage: '/images/og-image.jpg',
  twitterCard: 'summary_large_image',
});

/**
 * Project highlights displayed in the feature list
 * @type {string[]}
 */
const highlights = [
  'Ipsum caelum bellum homax pax',
  'Sanctum sol elit sol',
  'Umbra fine homo terra',
  'Sit mare idem jugum gloria',
  'Quam stella dolor anima mare summo'
];
</script>

<style scoped>
.shadow-img {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: transform 0.5s ease;
}

.shadow-img:hover {
  transform: scale(1.02) rotate(1deg);
}

.cta-button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>