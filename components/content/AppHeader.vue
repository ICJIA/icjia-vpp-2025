<template>
  <v-app-bar
    color="app-bar"
    elevation="0"
    :border="true"
    class="app-header"
    role="banner"
  >
    <div class="header-container d-flex align-center justify-space-between py-0">
      <!-- Site logo/branding -->
      <AccessibleTooltip
        text="Return to homepage"
        :location="$vuetify.display.smAndDown ? 'bottom' : 'bottom'"
      >
        <template v-slot="{ props }">
          <a
            href="/"
            class="text-decoration-none"
            v-bind="props"
            aria-label="Violence Prevention Plan for Illinois: 2025-2029 - Return to homepage"
            @click.prevent="handleHomeClick"
          >
            <v-row no-gutters align="center">
              <v-col cols="auto">
                <div class="logo d-flex align-center">
                  <v-icon
                    icon="mdi-cube-outline"
                    :size="$vuetify.display.smAndDown ? 'large' : 'x-large'"
                    color="primary"
                    :class="$vuetify.display.smAndDown ? 'mr-1' : 'mr-2'"
                    aria-hidden="true"
                  />
                  <!-- Responsive title display based on screen size -->
                  <span class="d-none d-xl-block text-h6 font-weight-bold text-primary">
                    Violence Prevention Plan for Illinois: 2025-2029
                  </span>
                  <span class="d-none d-lg-block d-xl-none text-h6 font-weight-bold text-primary">
                    Violence Prevention Plan for Illinois: 2025-2029
                  </span>
                  <span class="d-none d-sm-block d-lg-none text-subtitle-1 font-weight-bold text-primary">
                    Violence Prevention Plan: 2025-2029
                  </span>
                  <span class="d-block d-sm-none text-subtitle-1 font-weight-bold text-primary">
                    IL VPP: 2025
                  </span>
                </div>
              </v-col>
            </v-row>
          </a>
        </template>
      </AccessibleTooltip>

      <!-- Main navigation -->
      <nav class="d-flex align-center justify-end" aria-label="Main Navigation">
        <AccessibleTooltip
          text="Navigate to home page"
          :location="$vuetify.display.smAndDown ? 'bottom' : 'bottom'"
        >
          <template v-slot="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="font-weight-medium mx-2 nav-link"
              href="/"
              color="on-app-bar"
              aria-current="page"
              @click.prevent="handleHomeClick"
            >
              Home
            </v-btn>
          </template>
        </AccessibleTooltip>

        <AccessibleTooltip
          text="Learn more about our project"
          :location="$vuetify.display.smAndDown ? 'bottom' : 'bottom'"
        >
          <template v-slot="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="font-weight-medium mx-2 nav-link"
              to="/about"
              color="on-app-bar"
            >
              About
            </v-btn>
          </template>
        </AccessibleTooltip>

        <AccessibleTooltip
          text="Begin using our application"
          :location="$vuetify.display.smAndDown ? 'bottom' : 'right'"
        >
          <template v-slot="{ props }">
            <v-btn
              v-bind="props"
              variant="outlined"
              color="primary"
              class="ml-4 font-weight-medium rounded-pill elevation-0 hidden-sm-and-down"
              aria-label="Get Started with our application"
            >
              Get Started
            </v-btn>
          </template>
        </AccessibleTooltip>

        <ThemeSwitch
          :theme="theme"
          @toggle-theme="$emit('toggle-theme')"
          class="ml-4"
        />
      </nav>
    </div>
  </v-app-bar>
</template>

<script setup>
/**
 * Application header component with navigation and theme toggle
 *
 * This component provides:
 * - Main site navigation with accessible links
 * - Site branding and logo
 * - Theme toggle switch
 * - Tooltips for improved usability
 * - Proper ARIA attributes for accessibility
 * - Scroll to top functionality for homepage links
 *
 * @component
 */
import ThemeSwitch from './ThemeSwitch.vue';
import AccessibleTooltip from './AccessibleTooltip.vue';
import { useRouter, useRoute } from '#imports';

/**
 * Component props
 */
defineProps({
  /**
   * Current theme ('light' or 'dark')
   */
  theme: {
    type: String,
    required: true
  }
});

/**
 * Define emits for the component
 * toggle-theme: Emitted when theme switch is toggled
 */
defineEmits(['toggle-theme']);

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
.app-header {
  backdrop-filter: blur(10px);
}

.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--v-primary-base);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.router-link-active::after {
  width: 60%;
}

.logo {
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.header-container {
  width: 100%;
  max-width: 1600px; /* Wider than default container */
  margin: 0 auto;
  padding: 0 16px; /* Minimum padding on small screens */
}

/* Responsive padding adjustments */
@media (min-width: 600px) {
  .header-container {
    padding: 0 24px;
  }
}

@media (min-width: 960px) {
  .header-container {
    padding: 0 32px;
  }
}
</style>