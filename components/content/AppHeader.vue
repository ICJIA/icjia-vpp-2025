<template>
  <v-app-bar
    color="background"
    elevation="0"
    :border="true"
    class="app-header"
    role="banner"
  >
    <v-container class="d-flex align-center justify-space-between py-0">
      <!-- Site logo/branding -->
      <v-tooltip
        text="Return to homepage"
        :location="$vuetify.display.smAndDown ? 'bottom' : 'bottom'"
        :open-delay="200"
        role="tooltip"
        aria-label="Return to homepage"
      >
        <template v-slot:activator="{ props }">
          <nuxt-link to="/" class="text-decoration-none" v-bind="props" aria-label="Elegant - Return to homepage">
            <v-row no-gutters align="center">
              <v-col cols="auto">
                <div class="logo d-flex align-center">
                  <v-icon
                    icon="mdi-cube-outline"
                    size="x-large"
                    color="primary"
                    class="mr-2"
                    aria-hidden="true"
                  />
                  <span class="text-h5 font-weight-bold text-primary">Elegant</span>
                </div>
              </v-col>
            </v-row>
          </nuxt-link>
        </template>
      </v-tooltip>

      <!-- Main navigation -->
      <nav class="d-flex align-center justify-end" aria-label="Main Navigation">
        <v-tooltip
          text="Navigate to home page"
          :location="$vuetify.display.smAndDown ? 'bottom' : 'bottom'"
          :open-delay="200"
          role="tooltip"
          aria-label="Navigate to home page"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="font-weight-medium mx-2 nav-link"
              to="/"
              color="on-background"
              aria-current="page"
            >
              Home
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip
          text="Learn more about our project"
          :location="$vuetify.display.smAndDown ? 'bottom' : 'bottom'"
          :open-delay="200"
          role="tooltip"
          aria-label="Learn more about our project"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="font-weight-medium mx-2 nav-link"
              to="/about"
              color="on-background"
            >
              About
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip
          text="Begin using our application"
          :location="$vuetify.display.smAndDown ? 'bottom' : 'right'"
          :open-delay="200"
        >
          <template v-slot:activator="{ props }">
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
        </v-tooltip>

        <ThemeSwitch
          :theme="theme"
          @toggle-theme="$emit('toggle-theme')"
          class="ml-4"
        />
      </nav>
    </v-container>
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
 *
 * @component
 */
import ThemeSwitch from './ThemeSwitch.vue';

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
</style>