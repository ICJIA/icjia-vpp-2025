<template>
  <v-app-bar
    color="background"
    elevation="0"
    :border="true"
    class="app-header"
  >
    <v-container class="d-flex align-center justify-space-between py-0">
      <nuxt-link to="/" class="text-decoration-none">
        <v-row no-gutters align="center">
          <v-col cols="auto">
            <div class="logo d-flex align-center">
              <v-icon
                icon="mdi-cube-outline"
                size="x-large"
                color="primary"
                class="mr-2"
              />
              <span class="text-h5 font-weight-bold text-primary">Elegant</span>
            </div>
          </v-col>
        </v-row>
      </nuxt-link>

      <div class="d-flex align-center justify-end">
        <v-btn
          variant="text"
          class="font-weight-medium mx-2 nav-link"
          to="/"
          color="on-background"
        >
          Home
        </v-btn>
        <v-btn
          variant="text"
          class="font-weight-medium mx-2 nav-link"
          to="/about"
          color="on-background"
        >
          About
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          class="ml-4 font-weight-medium rounded-pill elevation-0 hidden-sm-and-down"
        >
          Get Started
        </v-btn>
        <ThemeSwitch
          :theme="theme"
          @toggle-theme="$emit('toggle-theme')"
          class="ml-4"
        />
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import ThemeSwitch from './ThemeSwitch.vue';

defineProps({
  theme: {
    type: String,
    required: true
  }
});

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