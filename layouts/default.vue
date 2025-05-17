<script setup>
import { ref, watch, onMounted } from 'vue';

// Initialize theme state
const theme = ref('light'); // Default to light for SSR

// Check if we're on client-side
const isClient = typeof window !== 'undefined';

// Client-only initialization
onMounted(() => {
  if (isClient) {
    initTheme();
  }
});

// Get theme from localStorage (client-side only)
function initTheme() {
  try {
    // Check if there's a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme-preference');

    // Set theme based on localStorage or default to light
    theme.value = savedTheme || 'light';

    // Apply theme class to document
    document.documentElement.setAttribute('data-theme', theme.value);
  } catch (e) {
    // Fallback if localStorage is not available
    console.error('Error accessing localStorage:', e);
    theme.value = 'light';
  }
}

// Toggle theme function (client-side only)
const toggleTheme = () => {
  if (!isClient) return;

  // Toggle the theme
  theme.value = theme.value === 'light' ? 'dark' : 'light';

  try {
    // Store the user's preference in localStorage
    localStorage.setItem('theme-preference', theme.value);

    // Update document attribute
    document.documentElement.setAttribute('data-theme', theme.value);
  } catch (e) {
    console.error('Error saving theme preference:', e);
  }
};

// Set up watcher for theme changes
onMounted(() => {
  if (!isClient) return;

  // Watch for theme changes
  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  });
});
</script>

<template>
  <v-app :theme="theme">
    <AppHeader @toggle-theme="toggleTheme" :theme="theme" />

    <v-main>
      <slot />
    </v-main>

    <AppFooter />
  </v-app>
</template>