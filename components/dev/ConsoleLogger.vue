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
 * Provides a UI for controlling the console logger during development.
 * This component is only meant to be used during development and should
 * not be included in production builds.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useConsoleLogger } from '~/composables/useConsoleLogger';

// Get logger instance
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

// UI state
const showControls = ref(false);

// Log component lifecycle
onMounted(() => {
  logUI('ConsoleLogger component mounted');
});

onUnmounted(() => {
  logUI('ConsoleLogger component unmounted');
});

/**
 * Test all log types
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
 */
const clearConsole = () => {
  console.clear();
  logUI('Console cleared');
};
</script>

<style scoped>
.console-logger-controls {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.console-logger-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.color-sample {
  border-radius: 4px;
  height: 24px;
}
</style>
