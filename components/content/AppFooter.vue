<template>
  <v-footer
    color="background"
    border
    class="py-8"
    role="contentinfo"
  >
    <v-container>
      <v-row justify="space-between" align="center" class="mb-6">
        <v-col cols="12" md="4">
          <div class="footer-branding">
            <v-tooltip
              text="Return to homepage"
              :location="$vuetify.display.smAndDown ? 'top' : 'top'"
              :open-delay="200"
              role="tooltip"
              aria-label="Return to homepage"
            >
              <template v-slot:activator="{ props }">
                <nuxt-link to="/" class="d-flex align-center text-decoration-none" v-bind="props" aria-label="VPPI - Return to homepage">
                  <v-icon
                    icon="mdi-cube-outline"
                    size="large"
                    color="primary"
                    class="mr-2"
                    aria-hidden="true"
                  />
                  <span class="text-subtitle-1 font-weight-bold text-primary">Violence Prevention Plan for Illinois: 2025-2029</span>
                </nuxt-link>
              </template>
            </v-tooltip>
            <p class="mt-4 text-body-2 max-width-300 footer-description">
              Tempor magna proident qui dolore ipsum ut mollit reprehenderit labore duis. Qui commodo culpa ullamco in sit veniam id minim laborum velit. Duis cillum nisi sint minim sint reprehenderit amet eu consectetur officia do.
            </p>
          </div>
        </v-col>

        <v-col cols="12" md="8" class="d-flex justify-end">
          <nav aria-label="Footer Navigation" class="d-flex justify-end w-100">
            <div class="d-flex flex-column mr-8">
              <h2 class="text-subtitle-1 font-weight-bold mb-4">Navigation</h2>

              <v-tooltip
                text="Navigate to home page"
                :location="$vuetify.display.smAndDown ? 'top' : 'left'"
                :open-delay="200"
                role="tooltip"
                aria-label="Navigate to home page"
              >
                <template v-slot:activator="{ props }">
                  <nuxt-link to="/" class="footer-link mb-2" v-bind="props">Home</nuxt-link>
                </template>
              </v-tooltip>

              <v-tooltip
                text="Learn more about our project"
                :location="$vuetify.display.smAndDown ? 'top' : 'left'"
                :open-delay="200"
                role="tooltip"
                aria-label="Learn more about our project"
              >
                <template v-slot:activator="{ props }">
                  <nuxt-link to="/about" class="footer-link mb-2" v-bind="props">About</nuxt-link>
                </template>
              </v-tooltip>
            </div>

            <div class="d-flex flex-column mr-8">
              <h2 class="text-subtitle-1 font-weight-bold mb-4">Connect</h2>

              <v-tooltip
                text="View our code on GitHub"
                :location="$vuetify.display.smAndDown ? 'top' : 'top'"
                :open-delay="200"
                role="tooltip"
                aria-label="View our code on GitHub"
              >
                <template v-slot:activator="{ props }">
                  <a href="#" class="footer-link mb-2" v-bind="props" aria-label="GitHub">GitHub</a>
                </template>
              </v-tooltip>

              <v-tooltip
                text="Connect with us on LinkedIn"
                :location="$vuetify.display.smAndDown ? 'top' : 'top'"
                :open-delay="200"
                role="tooltip"
                aria-label="Connect with us on LinkedIn"
              >
                <template v-slot:activator="{ props }">
                  <a href="#" class="footer-link mb-2" v-bind="props" aria-label="LinkedIn">LinkedIn</a>
                </template>
              </v-tooltip>
            </div>

            <div class="d-flex flex-column">
              <h2 class="text-subtitle-1 font-weight-bold mb-4">Legal</h2>

              <v-tooltip
                text="Read our privacy policy"
                :location="$vuetify.display.smAndDown ? 'top' : 'right'"
                :open-delay="200"
                role="tooltip"
                aria-label="Read our privacy policy"
              >
                <template v-slot:activator="{ props }">
                  <a href="#" class="footer-link mb-2" v-bind="props" aria-label="Privacy Policy">Privacy Policy</a>
                </template>
              </v-tooltip>

              <v-tooltip
                text="View our terms of service"
                :location="$vuetify.display.smAndDown ? 'top' : 'right'"
                :open-delay="200"
                role="tooltip"
                aria-label="View our terms of service"
              >
                <template v-slot:activator="{ props }">
                  <a href="#" class="footer-link mb-2" v-bind="props" aria-label="Terms of Service">Terms of Service</a>
                </template>
              </v-tooltip>
            </div>
          </nav>
        </v-col>
      </v-row>

      <v-divider class="mb-6" aria-hidden="true"></v-divider>

      <div class="text-center text-body-2 footer-copyright" role="contentinfo">
        <small>&copy; {{ new Date().getFullYear() }} Illinois Criminal Justice Information Authority. All rights reserved.</small>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
/**
 * Application footer component with navigation, social links, and legal information
 *
 * This component provides:
 * - Secondary site navigation
 * - Social media links
 * - Legal information links
 * - Site branding
 * - Copyright information
 * - Tooltips for improved usability
 * - Proper ARIA attributes for accessibility
 *
 * @component
 */
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}

.footer-description,
.footer-copyright {
  color: rgba(var(--v-theme-on-background), 0.87); /* Higher contrast than default medium-emphasis */
}

.footer-link {
  color: rgba(var(--v-theme-on-background), 0.87); /* Increased from 0.7 opacity for better contrast */
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--v-primary-base);
}

@media (max-width: 960px) {
  .d-flex.justify-end {
    justify-content: flex-start !important;
    margin-top: 32px;
  }
}
</style>