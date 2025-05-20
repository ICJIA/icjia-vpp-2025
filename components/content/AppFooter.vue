<template>
  <v-footer
    color="background"
    border
    class="py-8"
    role="contentinfo"
  >
    <div class="footer-container">
      <v-row justify="space-between" align="center" class="mb-6">
        <v-col cols="12" md="4">
          <div class="footer-branding">
            <AccessibleTooltip
              text="Return to homepage"
              :location="$vuetify.display.smAndDown ? 'top' : 'top'"
            >
              <template v-slot="{ props }">
                <a href="/" class="d-flex align-center text-decoration-none" v-bind="props" aria-label="VPPI - Return to homepage" @click.prevent="handleHomeClick">
                  <v-icon
                    icon="mdi-cube-outline"
                    :size="$vuetify.display.smAndDown ? 'medium' : 'large'"
                    color="primary"
                    :class="$vuetify.display.smAndDown ? 'mr-1' : 'mr-2'"
                    aria-hidden="true"
                  />
                  <!-- Responsive title display based on screen size -->
                  <span class="d-none d-xl-block text-subtitle-1 font-weight-bold text-primary">
                    Violence Prevention Plan for Illinois: 2025-2029
                  </span>
                  <span class="d-none d-lg-block d-xl-none text-subtitle-1 font-weight-bold text-primary">
                    Violence Prevention Plan for Illinois
                  </span>
                  <span class="d-none d-sm-block d-lg-none text-subtitle-2 font-weight-bold text-primary">
                    Violence Prevention Plan
                  </span>
                  <span class="d-block d-sm-none text-subtitle-2 font-weight-bold text-primary">
                    IL VPP
                  </span>
                </a>
              </template>
            </AccessibleTooltip>
            <p class="mt-4 text-body-2 max-width-300 footer-description">
              Tempor magna proident qui dolore ipsum ut mollit reprehenderit labore duis. Qui commodo culpa ullamco in sit veniam id minim laborum velit. Duis cillum nisi sint minim sint reprehenderit amet eu consectetur officia do.
            </p>
          </div>
        </v-col>

        <v-col cols="12" md="8" class="d-flex justify-end">
          <nav aria-label="Footer Navigation" class="d-flex justify-end w-100">
            <div class="d-flex flex-column mr-8">
              <h2 class="text-subtitle-1 font-weight-bold mb-4">Navigation</h2>

              <AccessibleTooltip
                text="Navigate to home page"
                :location="$vuetify.display.smAndDown ? 'top' : 'left'"
              >
                <template v-slot="{ props }">
                  <a href="/" class="footer-link mb-2" v-bind="props" @click.prevent="handleHomeClick">Home</a>
                </template>
              </AccessibleTooltip>

              <AccessibleTooltip
                text="Learn more about our project"
                :location="$vuetify.display.smAndDown ? 'top' : 'left'"
              >
                <template v-slot="{ props }">
                  <nuxt-link to="/about" class="footer-link mb-2" v-bind="props">About</nuxt-link>
                </template>
              </AccessibleTooltip>
            </div>

            <div class="d-flex flex-column mr-8">
              <h2 class="text-subtitle-1 font-weight-bold mb-4">Connect</h2>

              <AccessibleTooltip
                text="View our code on GitHub"
                :location="$vuetify.display.smAndDown ? 'top' : 'top'"
              >
                <template v-slot="{ props }">
                  <a href="#" class="footer-link mb-2" v-bind="props" aria-label="GitHub">GitHub</a>
                </template>
              </AccessibleTooltip>

              <AccessibleTooltip
                text="Connect with us on LinkedIn"
                :location="$vuetify.display.smAndDown ? 'top' : 'top'"
              >
                <template v-slot="{ props }">
                  <a href="#" class="footer-link mb-2" v-bind="props" aria-label="LinkedIn">LinkedIn</a>
                </template>
              </AccessibleTooltip>
            </div>

            <div class="d-flex flex-column">
              <h2 class="text-subtitle-1 font-weight-bold mb-4">Legal</h2>

              <AccessibleTooltip
                text="Read our privacy policy"
                :location="$vuetify.display.smAndDown ? 'top' : 'right'"
              >
                <template v-slot="{ props }">
                  <a href="#" class="footer-link mb-2" v-bind="props" aria-label="Privacy Policy">Privacy Policy</a>
                </template>
              </AccessibleTooltip>

              <AccessibleTooltip
                text="View our terms of service"
                :location="$vuetify.display.smAndDown ? 'top' : 'right'"
              >
                <template v-slot="{ props }">
                  <a href="#" class="footer-link mb-2" v-bind="props" aria-label="Terms of Service">Terms of Service</a>
                </template>
              </AccessibleTooltip>
            </div>
          </nav>
        </v-col>
      </v-row>

      <v-divider class="mb-6" aria-hidden="true"></v-divider>

      <div class="text-center text-body-2 footer-copyright" role="contentinfo">
        <small>&copy; {{ new Date().getFullYear() }} Illinois Criminal Justice Information Authority. All rights reserved.</small>
      </div>
    </div>
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
 * - Scroll to top functionality for homepage links
 *
 * @component
 */
import { useRouter, useRoute } from '#imports';

// Get Nuxt app instance to access plugins
const nuxtApp = useNuxtApp();
const router = useRouter();
const route = useRoute();

/**
 * Handle click on home links
 * If already on homepage, just scroll to top
 * Otherwise navigate to homepage
 */
const handleHomeClick = () => {
  if (route.path === '/') {
    // Already on homepage, just scroll to top
    nuxtApp.$scrollToTop();
  } else {
    // Navigate to homepage
    router.push('/');
  }
};
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

.footer-container {
  width: 100%;
  max-width: 1600px; /* Wider than default container */
  margin: 0 auto;
  padding: 0 16px; /* Minimum padding on small screens */
}

/* Responsive padding adjustments */
@media (min-width: 600px) {
  .footer-container {
    padding: 0 24px;
  }
}

@media (min-width: 960px) {
  .footer-container {
    padding: 0 32px;
  }
}
</style>