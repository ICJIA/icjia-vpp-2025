<template>
  <div class="theme-switch-container">
    <div class="theme-switch-wrapper">
      <!-- Theme icon indicator -->
      <v-icon
        :icon="isDarkTheme ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
        size="small"
        :color="isDarkTheme ? 'yellow-lighten-2' : 'orange'"
        class="theme-icon"
        aria-hidden="true"
      />

      <!-- Switch component with proper label association -->
      <v-switch
        :model-value="isDarkTheme"
        @update:model-value="handleSwitchChange"
        :aria-labelledby="labelId"
        :aria-describedby="descriptionId"
        color="primary"
        class="theme-switch"
        hide-details
        density="compact"
        :ripple="false"
      />

      <!-- Theme label with proper ID for label association -->
      <span :id="labelId" class="theme-label" :aria-live="'polite'">
        {{ isDarkTheme ? "Dark" : "Light" }}
      </span>

      <!-- Hidden description for additional context -->
      <span :id="descriptionId" class="sr-only">
        {{ ariaLabel }}
      </span>

      <!-- Screen reader announcement -->
      <span class="sr-only" aria-live="assertive" :key="isDarkTheme">
        {{ isDarkTheme ? "Switched to dark mode" : "Switched to light mode" }}
      </span>
    </div>
  </div>
</template>

<script setup>
/**
 * Accessible theme switch component with prominent switch and text labels
 *
 * This component provides:
 * - Prominent switch/slider component for better discoverability
 * - Clear text labels indicating current theme mode
 * - Visual theme icons (sun/moon) for enhanced clarity
 * - Keyboard accessibility with proper focus management
 * - Screen reader support with ARIA attributes and live announcements
 * - Proper label association using aria-labelledby and aria-describedby
 * - SSR-safe unique component IDs to prevent conflicts in multiple instances
 * - Responsive design that works on mobile and desktop
 * - WCAG 2.1 AA compliance with proper form labeling
 *
 * @component
 */

// Import Vue composables
import { useId } from "vue";
import { computed } from "vue";

/**
 * Component props
 */
const props = defineProps({
  theme: {
    type: String,
    required: true,
    validator: (value) => ["light", "dark"].includes(value),
  },
});

/**
 * Define emits for the component
 */
const emit = defineEmits(["toggle-theme"]);

/**
 * Generate unique IDs for proper label association
 * This ensures accessibility compliance by providing proper label relationships
 * Uses useId() for SSR-safe unique ID generation
 */
const componentId = useId();
const labelId = `theme-label-${componentId}`;
const descriptionId = `theme-description-${componentId}`;

/**
 * Computed property to convert theme string to boolean
 * Used for conditional rendering and ARIA attributes
 *
 * @returns {boolean} True if theme is dark, false if light
 */
const isDarkTheme = computed({
  get: () => props.theme === "dark",
  set: (value) => {
    // This is handled by the toggleTheme method
  },
});

/**
 * Computed property for the switch's aria-label
 * Provides context for screen readers
 *
 * @returns {string} Descriptive label for the current action
 */
const ariaLabel = computed(() =>
  isDarkTheme.value ? "Switch to light theme" : "Switch to dark theme",
);

/**
 * Handle switch value change
 * Emits event to parent component to handle theme change
 *
 * @param {boolean} value - New switch value (true for dark, false for light)
 */
const handleSwitchChange = (value) => {
  // Emit toggle event to parent component
  emit("toggle-theme");
};
</script>

<style scoped>
.theme-switch-container {
  display: flex;
  align-items: center;
  height: 100%;
}

.theme-switch-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1.5rem;
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  transition: background-color 0.3s ease;
}

.theme-switch-wrapper:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.15);
}

.theme-icon {
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.theme-switch {
  flex-shrink: 0;
}

/* Override Vuetify switch styles for compact appearance */
.theme-switch :deep(.v-switch__track) {
  width: 2rem;
  height: 1rem;
}

.theme-switch :deep(.v-switch__thumb) {
  width: 0.75rem;
  height: 0.75rem;
}

.theme-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  user-select: none;
  transition: color 0.3s ease;
}

/* Improve focus visibility for accessibility */
.theme-switch :deep(.v-switch__input:focus-visible + .v-switch__track) {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .theme-switch-wrapper {
    gap: 0.375rem;
    padding: 0.25rem 0.375rem;
  }

  .theme-label {
    font-size: 0.8125rem;
  }
}

/* Very small screens - show icon and switch only */
@media (max-width: 480px) {
  .theme-label {
    display: none;
  }

  .theme-switch-wrapper {
    gap: 0.25rem;
    padding: 0.25rem;
  }
}

/* Dark theme adjustments */
:root[data-theme="dark"] .theme-switch-wrapper {
  background-color: rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .theme-switch-wrapper:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

:root[data-theme="dark"] .theme-label {
  color: rgba(255, 255, 255, 0.9);
}
</style>
