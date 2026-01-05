/**
 * @module ConsoleLogger
 * @fileoverview Vue component: ConsoleLogger
 */

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
import { ref, onMounted, onUnmounted } from "vue";
import { useConsoleLogger } from "~/composables/useConsoleLogger";

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
  COLORS,
} = useConsoleLogger();

/**
 * Controls visibility of the logger UI panel
 * When false, only a small toggle button is shown
 * When true, the full control panel is displayed
 *
 * @type {Object}
 */
const showControls = ref(false);

/**
 * Component lifecycle hooks for logging component mount/unmount events
 * This demonstrates the logger's ability to track component lifecycle
 */
onMounted(() => {
  logUI("ConsoleLogger component mounted");
});

onUnmounted(() => {
  logUI("ConsoleLogger component unmounted");
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
  logUI("UI component event");
  logRoute("Route change event");
  logTheme("Theme change event");
  logLifecycle("Lifecycle event");
  logSuccess("Success event");
  logWarning("Warning event");
  logError("Error event");
  logAPI("API event");
  logPerf("Performance event");
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
  logUI("Console cleared");
};
