<template>
  <v-footer
    color="background"
    border
    class="py-8"
  >
    <v-container>
      <v-row justify="space-between" align="center" class="mb-6">
        <v-col cols="12" md="4">
          <div class="d-flex align-center">
            <v-icon
              icon="mdi-cube-outline"
              size="large"
              color="primary"
              class="mr-2"
            />
            <span class="text-h6 font-weight-bold text-primary">Elegant</span>
          </div>
          <p class="mt-4 text-body-2 text-medium-emphasis max-width-300">
            A beautifully designed application built with Nuxt 3 and Vuetify 3,
            focusing on elegant user experiences.
          </p>
        </v-col>
        
        <v-col cols="12" md="8" class="d-flex justify-end">
          <div class="d-flex flex-column mr-8">
            <span class="text-subtitle-1 font-weight-bold mb-4">Navigation</span>
            <nuxt-link to="/" class="footer-link mb-2">Home</nuxt-link>
            <nuxt-link to="/about" class="footer-link mb-2">About</nuxt-link>
          </div>
          
          <div class="d-flex flex-column mr-8">
            <span class="text-subtitle-1 font-weight-bold mb-4">Connect</span>
            <a href="#" class="footer-link mb-2">Twitter</a>
            <a href="#" class="footer-link mb-2">GitHub</a>
            <a href="#" class="footer-link mb-2">LinkedIn</a>
          </div>
          
          <div class="d-flex flex-column">
            <span class="text-subtitle-1 font-weight-bold mb-4">Legal</span>
            <a href="#" class="footer-link mb-2">Privacy Policy</a>
            <a href="#" class="footer-link mb-2">Terms of Service</a>
          </div>
        </v-col>
      </v-row>
      
      <v-divider class="mb-6"></v-divider>
      
      <div class="text-center text-body-2 text-medium-emphasis">
        &copy; {{ new Date().getFullYear() }} Elegant. All rights reserved.
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.max-width-300 {
  max-width: 300px;
}

.footer-link {
  color: inherit;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.footer-link:hover {
  opacity: 1;
  color: var(--v-primary-base);
}

@media (max-width: 960px) {
  .d-flex.justify-end {
    justify-content: flex-start !important;
    margin-top: 32px;
  }
}
</style>