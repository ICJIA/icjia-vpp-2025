<template>
  <div class="theme-switch-container">
    <v-tooltip
      :text="tooltipText"
      location="bottom"
      role="tooltip"
      :aria-label="tooltipText"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          color="on-background"
          :aria-label="ariaLabel"
          @click="toggleTheme"
          @keydown.enter="toggleTheme"
          @keydown.space.prevent="toggleTheme"
          class="theme-btn"
          tabindex="0"
          role="switch"
          :aria-checked="isDarkTheme ? 'true' : 'false'"
        >
          <v-icon aria-hidden="true">{{ isDarkTheme ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
          <span class="sr-only">{{ isDarkTheme ? 'Currently in dark mode' : 'Currently in light mode' }}</span>
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
  outline: 3px solid var(--v-primary-base);
  outline-offset: 2px;
  border-radius: 50%;
}

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
