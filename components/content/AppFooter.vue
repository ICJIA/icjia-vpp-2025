<template>
  <v-footer
    color="background"
    border
    class="py-8"
  >
    <v-container>
      <v-row justify="space-between" align="center" class="mb-6">
        <v-col cols="12" md="4">
          <v-tooltip
            text="Return to homepage"
            :location="$vuetify.display.smAndDown ? 'top' : 'top'"
            :open-delay="200"
          >
            <template v-slot:activator="{ props }">
              <div class="d-flex align-center" v-bind="props">
                <v-icon
                  icon="mdi-cube-outline"
                  size="large"
                  color="primary"
                  class="mr-2"
                />
                <span class="text-h6 font-weight-bold text-primary">Elegant</span>
              </div>
            </template>
          </v-tooltip>
          <p class="mt-4 text-body-2 text-medium-emphasis max-width-300">
            A beautifully designed application built with Nuxt 3 and Vuetify 3,
            focusing on elegant user experiences.
          </p>
        </v-col>

        <v-col cols="12" md="8" class="d-flex justify-end">
          <div class="d-flex flex-column mr-8">
            <span class="text-subtitle-1 font-weight-bold mb-4">Navigation</span>

            <v-tooltip
              text="Navigate to home page"
              :location="$vuetify.display.smAndDown ? 'top' : 'left'"
              :open-delay="200"
            >
              <template v-slot:activator="{ props }">
                <nuxt-link to="/" class="footer-link mb-2" v-bind="props">Home</nuxt-link>
              </template>
            </v-tooltip>

            <v-tooltip
              text="Learn more about our project"
              :location="$vuetify.display.smAndDown ? 'top' : 'left'"
              :open-delay="200"
            >
              <template v-slot:activator="{ props }">
                <nuxt-link to="/about" class="footer-link mb-2" v-bind="props">About</nuxt-link>
              </template>
            </v-tooltip>
          </div>

          <div class="d-flex flex-column mr-8">
            <span class="text-subtitle-1 font-weight-bold mb-4">Connect</span>

            <v-tooltip
              text="Follow us on Twitter"
              :location="$vuetify.display.smAndDown ? 'top' : 'top'"
              :open-delay="200"
            >
              <template v-slot:activator="{ props }">
                <a href="#" class="footer-link mb-2" v-bind="props">Twitter</a>
              </template>
            </v-tooltip>

            <v-tooltip
              text="View our code on GitHub"
              :location="$vuetify.display.smAndDown ? 'top' : 'top'"
              :open-delay="200"
            >
              <template v-slot:activator="{ props }">
                <a href="#" class="footer-link mb-2" v-bind="props">GitHub</a>
              </template>
            </v-tooltip>

            <v-tooltip
              text="Connect with us on LinkedIn"
              :location="$vuetify.display.smAndDown ? 'top' : 'top'"
              :open-delay="200"
            >
              <template v-slot:activator="{ props }">
                <a href="#" class="footer-link mb-2" v-bind="props">LinkedIn</a>
              </template>
            </v-tooltip>
          </div>

          <div class="d-flex flex-column">
            <span class="text-subtitle-1 font-weight-bold mb-4">Legal</span>

            <v-tooltip
              text="Read our privacy policy"
              :location="$vuetify.display.smAndDown ? 'top' : 'right'"
              :open-delay="200"
            >
              <template v-slot:activator="{ props }">
                <a href="#" class="footer-link mb-2" v-bind="props">Privacy Policy</a>
              </template>
            </v-tooltip>

            <v-tooltip
              text="View our terms of service"
              :location="$vuetify.display.smAndDown ? 'top' : 'right'"
              :open-delay="200"
            >
              <template v-slot:activator="{ props }">
                <a href="#" class="footer-link mb-2" v-bind="props">Terms of Service</a>
              </template>
            </v-tooltip>
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