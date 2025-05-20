<template>
  <div class="theme-switch-container">
    <AccessibleTooltip
      :text="tooltipText"
      location="bottom"
    >
      <template v-slot="{ props }">
        <v-btn
          v-bind="props"
          icon
          color="on-app-bar"
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
    </AccessibleTooltip>
  </div>
</template>

<script setup>
/**
 * Accessible theme switch component for toggling between light and dark themes
 *
 * This component provides:
 * - Keyboard accessibility (Enter/Space activation)
 * - Screen reader support with ARIA attributes
 * - Tooltip with descriptive text
 * - Visual indication of current theme
 * - Focus styles for keyboard navigation
 *
 * @component
 */
import { computed } from 'vue';
import AccessibleTooltip from './AccessibleTooltip.vue';

/**
 * Component props
 */
const props = defineProps({
  theme: {
    type: String,
    required: true,
    validator: (value) => ['light', 'dark'].includes(value)
  }
});

/**
 * Define emits for the component
 */
const emit = defineEmits(['toggle-theme']);

/**
 * Computed property to convert theme string to boolean
 * Used for conditional rendering and ARIA attributes
 *
 * @returns {boolean} True if theme is dark, false if light
 */
const isDarkTheme = computed({
  get: () => props.theme === 'dark',
  set: (value) => {
    // This is handled by the toggleTheme method
  }
});

/**
 * Computed property for the button's aria-label
 * Provides context for screen readers
 *
 * @returns {string} Descriptive label for the current action
 */
const ariaLabel = computed(() =>
  isDarkTheme.value ? 'Switch to light theme' : 'Switch to dark theme'
);

/**
 * Computed property for the tooltip text
 * Provides visual description on hover
 *
 * @returns {string} Descriptive tooltip text
 */
const tooltipText = computed(() =>
  isDarkTheme.value ? 'Switch to light theme' : 'Switch to dark theme'
);

/**
 * Toggle theme method
 * Emits event to parent component to handle theme change
 */
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
