import { ref, readonly, computed } from "vue";

/**
 * Site Settings Composable
 *
 * Provides reactive access to site configuration settings from site.config.json.
 * This composable allows components to access site-wide configuration values
 * like UI defaults, branding, and feature settings.
 *
 * @example Basic usage
 * ```vue
 * <script setup>
 * const { getSetting, isLoaded } = useSiteSettings();
 *
 * // Access UI settings
 * const tocLabel = await getSetting('ui.tableOfContents.defaultLabel', 'Table of Contents');
 * const siteName = await getSetting('branding.siteName', 'Default Site Name');
 * </script>
 * ```
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 * @module useSiteSettings
 */

/**
 * Composable for accessing site configuration settings
 *
 * @returns {Object} Site settings composable object
 * @returns {Function} loadConfig - Function to load site configuration
 * @returns {Function} getSetting - Function to get a specific setting value
 * @returns {Function} getSettings - Function to get multiple settings at once
 * @returns {Object} config - Reactive reference to loaded configuration
 * @returns {Object} loading - Reactive reference to loading state
 * @returns {Object} error - Reactive reference to any loading errors
 * @returns {Object} isLoaded - Computed property indicating if config is loaded
 */
export const useSiteSettings = () => {
  const config = ref(null);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Load site configuration from the public directory
   *
   * @returns {Promise<Object|null>} Loaded configuration or null on error
   */
  const loadConfig = async () => {
    // Return cached config if already loaded
    if (config.value) return config.value;

    loading.value = true;
    error.value = null;

    try {
      // Load site configuration
      const response = await $fetch("/config/site.config.json");
      config.value = response;

      // Log successful load in development
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Site configuration loaded:", {
          projectName: response.metadata?.projectName || "Unknown",
          version: response.metadata?.version || "Unknown",
          lastUpdated: response.metadata?.lastUpdated || "Unknown",
        });
      }

      return response;
    } catch (e) {
      error.value = e;
      console.error("Failed to load site configuration:", e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get a configuration setting by dot notation path
   *
   * @param {string} path - Dot notation path to the setting (e.g., 'ui.tableOfContents.defaultLabel')
   * @param {any} defaultValue - Default value if setting is not found
   * @returns {Promise<any>} The setting value or default value
   */
  const getSetting = async (path, defaultValue = null) => {
    // Ensure config is loaded
    if (!config.value) {
      await loadConfig();
    }

    if (!config.value) {
      return defaultValue;
    }

    // Navigate the object using dot notation
    const keys = path.split(".");
    let current = config.value;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return current !== undefined ? current : defaultValue;
  };

  /**
   * Get multiple settings at once
   *
   * @param {Object} settings - Object with keys as result names and values as setting paths or objects with path and default
   * @param {string|Object} settings.key - Either a string path or an object with {path: string, default: any}
   * @returns {Promise<Object>} Object with resolved setting values
   * @throws {Error} If there's an error loading the configuration
   *
   * @example
   * // Simple paths
   * const settings = await getSettings({
   *   siteName: 'branding.siteName',
   *   tocLabel: 'ui.tableOfContents.defaultLabel'
   * });
   *
   * @example
   * // With defaults
   * const settings = await getSettings({
   *   siteName: { path: 'branding.siteName', default: 'Default Site' },
   *   tocLabel: { path: 'ui.tableOfContents.defaultLabel', default: 'TOC' }
   * });
   */
  const getSettings = async (settings) => {
    const result = {};

    for (const [key, path] of Object.entries(settings)) {
      if (typeof path === "object" && path.path && path.default !== undefined) {
        result[key] = await getSetting(path.path, path.default);
      } else {
        result[key] = await getSetting(path);
      }
    }

    return result;
  };

  // Auto-load on first access in client-side
  if (import.meta.client && !config.value && !loading.value) {
    loadConfig();
  }

  return {
    // Core reactive state
    config: readonly(config),
    loading: readonly(loading),
    error: readonly(error),

    // Methods
    loadConfig,
    getSetting,
    getSettings,

    // Computed helpers
    isLoaded: computed(() => !!config.value),
    hasError: computed(() => !!error.value),
    isLoading: computed(() => loading.value),
  };
};
