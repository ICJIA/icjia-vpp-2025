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
              src="https://images.pexels.com/photos/6192137/pexels-photo-6192137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
              alt="App Screenshot"
              image-class="rounded-xl shadow-img"
              aspect-ratio="4/3"
              cover
              spinner-color="primary"
            />
          </v-col>

          <v-col cols="12" md="6" class="pl-md-12">
            <h2 class="text-h3 font-weight-bold mb-6">
              Crafted with Precision
            </h2>

            <p class="text-body-1 mb-8">
              Every detail in this application has been carefully considered and implemented with precision.
              From subtle animations to responsive layouts, we've created an experience that feels both
              delightful and intuitive.
            </p>

            <v-list class="bg-transparent pa-0">
              <v-list-item
                v-for="(item, i) in highlights"
                :key="i"
                class="pa-0 mb-4"
              >
                <template v-slot:prepend>
                  <v-icon
                    color="success"
                    icon="mdi-check-circle"
                    class="mr-2"
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
              Learn More
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="section py-16 bg-primary-lighten-5">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 font-weight-bold mb-4">Ready to Get Started?</h2>
          <p class="text-body-1 mx-auto" style="max-width: 600px;">
            Join thousands of users who are already enjoying our application.
          </p>
        </div>

        <div class="text-center">
          <v-btn
            color="primary"
            size="x-large"
            class="rounded-pill px-8 py-3 elevation-3 cta-button"
          >
            Start Your Journey
            <v-icon end icon="mdi-arrow-right" />
          </v-btn>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import ImageWithSpinner from '~/components/content/ImageWithSpinner.vue';

const highlights = [
  'Modern stack with Vue 3, Nuxt 3, and Vuetify 3',
  'Optimized for performance and SEO',
  'Fully responsive design for all devices',
  'Beautiful dark and light themes',
  'Smooth animations and transitions'
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