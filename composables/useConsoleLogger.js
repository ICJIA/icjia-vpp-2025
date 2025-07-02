/**
 * Console Logger Composable
 *
 * A utility for color-coded console logging during development.
 * Can be globally enabled/disabled and categorizes logs by type.
 *
 * Features:
 * - Color-coded log categories for easy visual identification
 * - Global enable/disable functionality
 * - Specialized logging methods for different contexts (UI, API, routes, etc.)
 * - Support for additional data objects in logs
 * - Singleton pattern ensures consistent state across imports
 *
 * Usage:
 * ```js
 * import { useConsoleLogger } from '~/composables/useConsoleLogger';
 *
 * const { logUI, logError, isEnabled, toggle } = useConsoleLogger();
 *
 * // Log a UI event
 * logUI('Button clicked', { id: 'submit-btn' });
 *
 * // Log an error
 * logError('Failed to fetch data', errorObject);
 *
 * // Toggle logging on/off
 * toggle();
 * ```
 *
 * @module useConsoleLogger
 */

import { ref } from "vue";

/**
 * Singleton state for the logger
 * Using ref to make it reactive and shared across all imports
 *
 * @type {Object}
 */
const isEnabled = ref(true);

/**
 * Color codes for different log categories
 *
 * Each category has a specific color for visual distinction in the console.
 * Colors are chosen to be visually distinct and semantically meaningful:
 * - Blues/Purples: UI and navigation related
 * - Greens: Success and lifecycle events
 * - Yellows/Oranges: Warnings and performance
 * - Reds: Errors
 * - Teals: Data operations
 *
 * @constant {Object.<string, string>}
 */
const COLORS = {
  /** Blue - UI component events and interactions */
  ui: "#3498db",

  /** Purple - Navigation and route changes */
  route: "#9b59b6",

  /** Dark Purple - Theme and appearance changes */
  theme: "#8e44ad",

  /** Green - Component lifecycle events (mount, unmount, etc.) */
  lifecycle: "#2ecc71",

  /** Dark Green - Successful operations */
  success: "#27ae60",

  /** Orange - Warning conditions that don't prevent operation */
  warning: "#f39c12",

  /** Red - Errors and failures */
  error: "#e74c3c",

  /** Teal - API calls and data operations */
  api: "#1abc9c",

  /** Yellow - Performance metrics and timing */
  perf: "#f1c40f",

  /** Gray - Default for uncategorized logs */
  default: "#7f8c8d",
};

/**
 * Console logger composable for development
 *
 * This composable provides a comprehensive logging system for development.
 * It uses a singleton pattern to ensure consistent state across imports,
 * allowing you to enable/disable logging globally from any component.
 *
 * The returned object includes specialized logging methods for different
 * contexts (UI, routes, API, etc.), each with its own color coding for
 * easy visual identification in the console.
 *
 * @returns {Object} Logger methods and state
 * @returns {Object} isEnabled - Reactive ref to control logging state
 * @returns {Function} log - Base logging function with category support
 * @returns {Function} logUI - Log UI component events
 * @returns {Function} logRoute - Log route navigation events
 * @returns {Function} logTheme - Log theme changes
 * @returns {Function} logLifecycle - Log component lifecycle events
 * @returns {Function} logSuccess - Log successful operations
 * @returns {Function} logWarning - Log warning conditions
 * @returns {Function} logError - Log errors and failures
 * @returns {Function} logAPI - Log API calls and data operations
 * @returns {Function} logPerf - Log performance metrics
 * @returns {Function} enable - Enable logging
 * @returns {Function} disable - Disable logging
 * @returns {Function} toggle - Toggle logging state
 * @returns {Object} COLORS - Color codes for different log categories
 */
export function useConsoleLogger() {
  /**
   * Log a message with category styling
   *
   * This is the core logging function that all specialized logging methods use.
   * It applies color styling based on the category and handles optional data objects.
   *
   * Features:
   * - Respects the global enabled/disabled state
   * - Applies consistent color coding based on category
   * - Formats messages with category prefix: [CATEGORY] message
   * - Supports additional data objects for detailed logging
   *
   * @param {string} category - The log category (ui, route, theme, etc.)
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log (objects will be expanded in console)
   * @returns {void}
   */
  const log = (category, message, data) => {
    if (!isEnabled.value) return;

    const color = COLORS[category] || COLORS.default;
    const prefix = `%c[${category.toUpperCase()}]`;

    if (data) {
      console.log(
        `${prefix} ${message}`,
        `color: ${color}; font-weight: bold;`,
        data,
      );
    } else {
      console.log(
        `${prefix} ${message}`,
        `color: ${color}; font-weight: bold;`,
      );
    }
  };

  /**
   * Log UI component events
   *
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logUI = (message, data) => log("ui", message, data);

  /**
   * Log route changes
   *
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logRoute = (message, data) => log("route", message, data);

  /**
   * Log theme changes
   *
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logTheme = (message, data) => log("theme", message, data);

  /**
   * Log lifecycle events
   *
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logLifecycle = (message, data) => log("lifecycle", message, data);

  /**
   * Log success messages
   *
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logSuccess = (message, data) => log("success", message, data);

  /**
   * Log warnings
   *
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logWarning = (message, data) => log("warning", message, data);

  /**
   * Log errors
   *
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logError = (message, data) => log("error", message, data);

  /**
   * Log API/data operations
   *
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logAPI = (message, data) => log("api", message, data);

  /**
   * Log performance metrics
   *
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logPerf = (message, data) => log("perf", message, data);

  /**
   * Enable console logging
   *
   * Turns on logging globally and logs a confirmation message.
   * This affects all components using this composable due to the singleton pattern.
   *
   * @returns {void}
   */
  const enable = () => {
    isEnabled.value = true;
    log("default", "Console logging enabled");
  };

  /**
   * Disable console logging
   *
   * Turns off logging globally after logging a final confirmation message.
   * This affects all components using this composable due to the singleton pattern.
   *
   * @returns {void}
   */
  const disable = () => {
    log("default", "Console logging disabled");
    isEnabled.value = false;
  };

  /**
   * Toggle console logging state
   *
   * Switches between enabled and disabled states.
   * Logs a confirmation message only when enabling.
   * This affects all components using this composable due to the singleton pattern.
   *
   * @returns {void}
   */
  const toggle = () => {
    isEnabled.value = !isEnabled.value;
    if (isEnabled.value) {
      log("default", "Console logging enabled");
    }
    // No message when disabling to avoid the paradox of logging that logging is disabled
  };

  return {
    isEnabled,
    log,
    logUI,
    logRoute,
    logTheme,
    logLifecycle,
    logSuccess,
    logWarning,
    logError,
    logAPI,
    logPerf,
    enable,
    disable,
    toggle,
    COLORS,
  };
}
