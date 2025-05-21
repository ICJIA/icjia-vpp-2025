/**
 * Console Logger Composable
 * 
 * A utility for color-coded console logging during development.
 * Can be globally enabled/disabled and categorizes logs by type.
 */

import { ref } from 'vue';

// Singleton pattern - shared state across imports
const isEnabled = ref(process.env.NODE_ENV !== 'production');

// Color codes for different log categories
const COLORS = {
  // UI Components
  ui: '#3498db',       // Blue
  
  // Route changes
  route: '#9b59b6',    // Purple
  
  // Theme changes
  theme: '#8e44ad',    // Dark Purple
  
  // Lifecycle events
  lifecycle: '#2ecc71', // Green
  
  // Success messages
  success: '#27ae60',  // Dark Green
  
  // Warnings
  warning: '#f39c12',  // Orange
  
  // Errors
  error: '#e74c3c',    // Red
  
  // API/Data
  api: '#1abc9c',      // Teal
  
  // Performance
  perf: '#f1c40f',     // Yellow
  
  // Default
  default: '#7f8c8d'   // Gray
};

/**
 * Console logger composable for development
 * 
 * @returns {Object} Logger methods and state
 */
export function useConsoleLogger() {
  /**
   * Log a message with category styling
   * 
   * @param {string} category - The log category (ui, route, theme, etc.)
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const log = (category, message, data) => {
    if (!isEnabled.value) return;
    
    const color = COLORS[category] || COLORS.default;
    const prefix = `%c[${category.toUpperCase()}]`;
    
    if (data) {
      console.log(
        `${prefix} ${message}`, 
        `color: ${color}; font-weight: bold;`, 
        data
      );
    } else {
      console.log(
        `${prefix} ${message}`, 
        `color: ${color}; font-weight: bold;`
      );
    }
  };
  
  /**
   * Log UI component events
   * 
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logUI = (message, data) => log('ui', message, data);
  
  /**
   * Log route changes
   * 
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logRoute = (message, data) => log('route', message, data);
  
  /**
   * Log theme changes
   * 
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logTheme = (message, data) => log('theme', message, data);
  
  /**
   * Log lifecycle events
   * 
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logLifecycle = (message, data) => log('lifecycle', message, data);
  
  /**
   * Log success messages
   * 
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logSuccess = (message, data) => log('success', message, data);
  
  /**
   * Log warnings
   * 
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logWarning = (message, data) => log('warning', message, data);
  
  /**
   * Log errors
   * 
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logError = (message, data) => log('error', message, data);
  
  /**
   * Log API/data operations
   * 
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logAPI = (message, data) => log('api', message, data);
  
  /**
   * Log performance metrics
   * 
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  const logPerf = (message, data) => log('perf', message, data);
  
  /**
   * Enable console logging
   */
  const enable = () => {
    isEnabled.value = true;
    log('default', 'Console logging enabled');
  };
  
  /**
   * Disable console logging
   */
  const disable = () => {
    log('default', 'Console logging disabled');
    isEnabled.value = false;
  };
  
  /**
   * Toggle console logging state
   */
  const toggle = () => {
    isEnabled.value = !isEnabled.value;
    if (isEnabled.value) {
      log('default', 'Console logging enabled');
    }
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
    COLORS
  };
}
