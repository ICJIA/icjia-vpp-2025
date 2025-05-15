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
import { ref } from 'vue';

const theme = ref('light');

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};
</script>