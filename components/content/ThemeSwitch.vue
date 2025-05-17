<template>
  <div class="theme-switch-container">
    <v-tooltip
      :text="tooltipText"
      location="bottom"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          color="on-background"
          :aria-label="ariaLabel"
          @click="toggleTheme"
          class="theme-btn"
        >
          <v-icon>{{ isDarkTheme ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  theme: {
    type: String,
    required: true,
    validator: (value) => ['light', 'dark'].includes(value)
  }
});

const emit = defineEmits(['toggle-theme']);

// Computed property to convert theme string to boolean for v-switch
const isDarkTheme = computed({
  get: () => props.theme === 'dark',
  set: (value) => {
    // This is handled by the toggleTheme method
  }
});

// Computed properties for accessibility
const ariaLabel = computed(() =>
  isDarkTheme.value ? 'Switch to light theme' : 'Switch to dark theme'
);

const tooltipText = computed(() =>
  isDarkTheme.value ? 'Switch to light theme' : 'Switch to dark theme'
);

// Method to toggle theme
const toggleTheme = () => {
  emit('toggle-theme');
};
</script>

<style scoped>
.theme-switch-container {
  display: flex;
  align-items: center;
  height: 100%;
}

.theme-btn {
  margin: 0;
  padding: 0;
}

/* Improve focus visibility for accessibility */
.theme-btn:focus-visible {
  outline: 2px solid var(--v-primary-base);
  outline-offset: 2px;
  border-radius: 50%;
}
</style>
