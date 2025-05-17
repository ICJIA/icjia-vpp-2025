<template>
  <v-app :theme="theme">
    <AppHeader @toggle-theme="toggleTheme" :theme="theme" />

    <v-main>
      <slot />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { usePreferredDark, useStorage } from '@vueuse/core';

// Use VueUse to detect user's preferred color scheme
const prefersDark = usePreferredDark();

// Use localStorage to persist theme preference
const storedTheme = useStorage('theme-preference', null);

// Initialize theme based on stored preference or system preference
const theme = ref(storedTheme.value || (prefersDark.value ? 'dark' : 'light'));

// Toggle theme function
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  // Store the user's preference
  storedTheme.value = theme.value;
};

// Watch for changes in system preference if user hasn't set a preference
watch(prefersDark, (newValue) => {
  if (storedTheme.value === null) {
    theme.value = newValue ? 'dark' : 'light';
  }
});

// Apply theme class to document for potential CSS usage
onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  });
});
</script>