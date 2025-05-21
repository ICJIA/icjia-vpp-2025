<template>
  <div v-if="showControls" class="console-logger-controls">
    <v-card class="pa-2" variant="outlined" width="300">
      <v-card-title class="text-subtitle-1 pb-1">
        Console Logger
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="showControls = false"
          aria-label="Hide console logger controls"
        ></v-btn>
      </v-card-title>

      <v-card-text class="py-1">
        <v-switch
          v-model="isEnabled"
          color="primary"
          hide-details
          density="compact"
          label="Enable logging"
        ></v-switch>

        <div class="d-flex flex-wrap mt-2">
          <div
            v-for="(color, category) in COLORS"
            :key="category"
            class="color-sample ma-1 d-flex align-center"
            :style="`background-color: ${color}20; border: 1px solid ${color}`"
          >
            <span class="px-2 text-caption">{{ category }}</span>
          </div>
        </div>

        <div class="mt-2">
          <v-btn
            size="small"
            variant="outlined"
            color="primary"
            class="mr-2"
            @click="testLog"
          >
            Test Log
          </v-btn>
          <v-btn
            size="small"
            variant="outlined"
            color="error"
            @click="clearConsole"
          >
            Clear Console
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
  <div v-else class="console-logger-toggle">
    <v-btn
      icon="mdi-console"
      size="small"
      color="grey"
      variant="outlined"
      @click="showControls = true"
      aria-label="Show console logger controls"
    ></v-btn>
  </div>
</template>

<script setup>
/**
 * Development Console Logger Component
 *
 * Provides a floating UI for controlling the console logger during development.
 * This component is only meant to be used during development and is conditionally
 * rendered in the default layout when in development mode.
 *
 * Features:
 * - Toggle console logging on/off
 * - Display color legend for different log categories
 * - Test all log types with a single click
 * - Clear the console
 * - Collapsible UI that stays out of the way
 *
 * Usage:
 * This component is automatically included in the default layout when in development mode:
 * ```html
 * <ClientOnly>
 *   <ConsoleLogger v-if="isDev" />
 * </ClientOnly>
 * ```
 *
 * @component
 * @requires ~/composables/useConsoleLogger
 */
import { ref, onMounted, onUnmounted } from 'vue';
import { useConsoleLogger } from '~/composables/useConsoleLogger';

/**
 * Get logger instance from the useConsoleLogger composable
 * This provides access to all logging methods and the global enabled state
 */
const {
  isEnabled,
  logUI,
  logRoute,
  logTheme,
  logLifecycle,
  logSuccess,
  logWarning,
  logError,
  logAPI,
  logPerf,
  COLORS
} = useConsoleLogger();

/**
 * Controls visibility of the logger UI panel
 * When false, only a small toggle button is shown
 * When true, the full control panel is displayed
 *
 * @type {import('vue').Ref<boolean>}
 */
const showControls = ref(false);

/**
 * Component lifecycle hooks for logging component mount/unmount events
 * This demonstrates the logger's ability to track component lifecycle
 */
onMounted(() => {
  logUI('ConsoleLogger component mounted');
});

onUnmounted(() => {
  logUI('ConsoleLogger component unmounted');
});

/**
 * Test all log types
 *
 * Demonstrates each log category with a sample message.
 * This is useful for:
 * - Verifying that logging is working correctly
 * - Seeing the color coding for each category
 * - Testing that the logger respects the enabled/disabled state
 *
 * @returns {void}
 */
const testLog = () => {
  logUI('UI component event');
  logRoute('Route change event');
  logTheme('Theme change event');
  logLifecycle('Lifecycle event');
  logSuccess('Success event');
  logWarning('Warning event');
  logError('Error event');
  logAPI('API event');
  logPerf('Performance event');
};

/**
 * Clear the console
 *
 * Clears all previous console output and logs a confirmation message.
 * This is useful during development to remove clutter and focus on new logs.
 *
 * @returns {void}
 */
const clearConsole = () => {
  console.clear();
  logUI('Console cleared');
};
</script>

<style scoped>
/**
 * Styles for the ConsoleLogger component
 *
 * The component has two main states:
 * 1. Collapsed: Just a small toggle button (console-logger-toggle)
 * 2. Expanded: Full control panel (console-logger-controls)
 *
 * Both states are positioned in the bottom-right corner of the viewport
 * with a high z-index to ensure they're always visible and accessible.
 */

/* Full control panel container */
.console-logger-controls {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000; /* High z-index to stay above other content */
}

/* Toggle button container (when panel is collapsed) */
.console-logger-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000; /* Same z-index as the panel for consistent layering */
}

/* Color category sample boxes */
.color-sample {
  border-radius: 4px;
  height: 24px;
  /* Semi-transparent background with solid border for better visibility */
}
</style>
