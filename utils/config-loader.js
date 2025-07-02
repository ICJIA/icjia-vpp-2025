/**
 * Configuration Loader Utility
 *
 * Loads and manages configuration from site.config.json with fallback defaults.
 * Provides environment-specific configuration loading for both Node.js and browser contexts.
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 */

import { promises as fs } from "fs";
import path from "path";

/**
 * Default configuration values
 */
const defaultConfig = {
  logging: {
    level: "NORMAL",
    showTimestamp: true,
    showPrefix: true,
    groupMessages: false,
    buildSummary: true,
    colors: {
      success: "#27ae60",
      error: "#e74c3c",
      warning: "#f39c12",
      info: "#3498db",
      debug: "#7f8c8d",
    },
  },
  metadata: {
    projectName: "Violence Prevention Plan for Illinois: 2025-2029",
    description:
      "Comprehensive violence prevention strategies and community resources",
    version: "1.0.0",
  },
  urls: {
    baseUrl: "https://vpp-2025.netlify.app/",
    devUrl: "http://localhost:8000",
  },
};

/**
 * Load configuration from site.config.json asynchronously
 *
 * Loads site configuration from the specified path or default location.
 * If loading fails, returns default configuration with warning messages.
 * The loaded configuration is merged with defaults to ensure all required properties exist.
 *
 * @param {string|null} [configPath=null] - Path to configuration file, defaults to 'config/site.config.json'
 * @returns {Promise<Object>} Configuration object merged with defaults
 * @returns {Promise<Object>} returns.logging - Logging configuration settings
 * @returns {Promise<Object>} returns.metadata - Project metadata (name, version, description)
 * @returns {Promise<Object>} returns.urls - URL configuration (baseUrl, devUrl)
 *
 * @throws {Error} Logs warning if file cannot be read or parsed, but doesn't throw
 *
 * @example
 * // Load default configuration
 * const config = await loadSiteConfig();
 * console.log(config.metadata.projectName);
 *
 * @example
 * // Load from custom path
 * const config = await loadSiteConfig('/custom/path/config.json');
 * console.log(config.logging.level);
 */
export async function loadSiteConfig(configPath = null) {
  try {
    // Determine config path
    const configFile =
      configPath || path.join(process.cwd(), "config/site.config.json");

    // Read and parse configuration file
    const configContent = await fs.readFile(configFile, "utf-8");
    const config = JSON.parse(configContent);

    // Merge with defaults to ensure all required properties exist
    return mergeWithDefaults(config);
  } catch (error) {
    console.warn(
      `Warning: Could not load site configuration from ${configPath || "config/site.config.json"}: ${error.message}`,
    );
    console.warn("Using default configuration values");
    return defaultConfig;
  }
}

/**
 * Load configuration synchronously (Node.js only)
 *
 * Synchronous version of loadSiteConfig for use in Node.js environments where
 * async loading is not suitable (e.g., module initialization, build scripts).
 * Uses fs.readFileSync for immediate file reading.
 *
 * @param {string|null} [configPath=null] - Path to configuration file, defaults to 'config/site.config.json'
 * @returns {Object} Configuration object merged with defaults
 * @returns {Object} returns.logging - Logging configuration settings
 * @returns {Object} returns.metadata - Project metadata (name, version, description)
 * @returns {Object} returns.urls - URL configuration (baseUrl, devUrl)
 *
 * @throws {Error} Logs warning if file cannot be read or parsed, but doesn't throw
 *
 * @example
 * // Load configuration in build script
 * const config = loadSiteConfigSync();
 * const logLevel = config.logging.level;
 *
 * @example
 * // Load from custom path
 * const config = loadSiteConfigSync('./custom-config.json');
 */
export function loadSiteConfigSync(configPath = null) {
  try {
    // Determine config path
    const configFile =
      configPath || path.join(process.cwd(), "config/site.config.json");

    // Read and parse configuration file synchronously
    const configContent = require("fs").readFileSync(configFile, "utf-8");
    const config = JSON.parse(configContent);

    // Merge with defaults to ensure all required properties exist
    return mergeWithDefaults(config);
  } catch (error) {
    console.warn(
      `Warning: Could not load site configuration from ${configPath || "config/site.config.json"}: ${error.message}`,
    );
    console.warn("Using default configuration values");
    return defaultConfig;
  }
}

/**
 * Load configuration for browser environment
 *
 * Browser-compatible version that uses fetch API to load configuration from a URL.
 * Designed for client-side usage where file system access is not available.
 * Handles HTTP errors gracefully and falls back to default configuration.
 *
 * @param {string} [configUrl='/config/site.config.json'] - URL to configuration file
 * @returns {Promise<Object>} Configuration object merged with defaults
 * @returns {Promise<Object>} returns.logging - Logging configuration settings
 * @returns {Promise<Object>} returns.metadata - Project metadata (name, version, description)
 * @returns {Promise<Object>} returns.urls - URL configuration (baseUrl, devUrl)
 *
 * @throws {Error} Logs warning if fetch fails or response is invalid, but doesn't throw
 *
 * @example
 * // Load configuration in browser
 * const config = await loadSiteConfigBrowser();
 * console.log(config.metadata.projectName);
 *
 * @example
 * // Load from custom URL
 * const config = await loadSiteConfigBrowser('/api/config');
 */
export async function loadSiteConfigBrowser(
  configUrl = "/config/site.config.json",
) {
  try {
    const response = await fetch(configUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const config = await response.json();
    return mergeWithDefaults(config);
  } catch (error) {
    console.warn(
      `Warning: Could not load site configuration from ${configUrl}: ${error.message}`,
    );
    console.warn("Using default configuration values");
    return defaultConfig;
  }
}

/**
 * Merge loaded configuration with defaults
 *
 * Performs deep merge of loaded configuration with default values to ensure
 * all required properties exist. Nested objects (logging, metadata, urls) are
 * merged individually to preserve partial configurations.
 *
 * @param {Object} config - Loaded configuration object (may be partial)
 * @param {Object} [config.logging] - Logging configuration overrides
 * @param {Object} [config.metadata] - Metadata overrides
 * @param {Object} [config.urls] - URL configuration overrides
 * @returns {Object} Merged configuration with all required properties
 * @returns {Object} returns.logging - Complete logging configuration
 * @returns {Object} returns.metadata - Complete metadata configuration
 * @returns {Object} returns.urls - Complete URL configuration
 *
 * @example
 * const partial = { logging: { level: 'DEBUG' } };
 * const complete = mergeWithDefaults(partial);
 * // complete.logging.level === 'DEBUG'
 * // complete.logging.showTimestamp === true (from defaults)
 */
function mergeWithDefaults(config) {
  return {
    ...defaultConfig,
    ...config,
    logging: {
      ...defaultConfig.logging,
      ...(config.logging || {}),
      colors: {
        ...defaultConfig.logging.colors,
        ...(config.logging?.colors || {}),
      },
    },
    metadata: {
      ...defaultConfig.metadata,
      ...(config.metadata || {}),
    },
    urls: {
      ...defaultConfig.urls,
      ...(config.urls || {}),
    },
  };
}

/**
 * Get logging configuration from environment variables or config file
 * @param {Object} siteConfig - Site configuration object
 * @returns {Object} Logging configuration
 */
export function getLoggingConfig(siteConfig = null) {
  // Check for environment variable override
  const envLogLevel = process.env.LOG_LEVEL || process.env.NUXT_LOG_LEVEL;

  // Use environment variable if set, otherwise use config file, otherwise use default
  const logLevel =
    envLogLevel || siteConfig?.logging?.level || defaultConfig.logging.level;

  // Check for other environment overrides
  const showTimestamp =
    process.env.LOG_TIMESTAMP !== "false" &&
    (siteConfig?.logging?.showTimestamp ?? defaultConfig.logging.showTimestamp);

  const groupMessages =
    process.env.LOG_GROUP === "true" ||
    (siteConfig?.logging?.groupMessages ?? defaultConfig.logging.groupMessages);

  return {
    level: logLevel,
    showTimestamp,
    showPrefix:
      siteConfig?.logging?.showPrefix ?? defaultConfig.logging.showPrefix,
    groupMessages,
    buildSummary:
      siteConfig?.logging?.buildSummary ?? defaultConfig.logging.buildSummary,
    colors: siteConfig?.logging?.colors || defaultConfig.logging.colors,
  };
}

/**
 * Create a logger configuration for scripts
 * @param {string} scriptName - Name of the script (for context)
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Logger configuration
 */
export async function createScriptLoggerConfig(scriptName, options = {}) {
  const siteConfig = await loadSiteConfig();
  const loggingConfig = getLoggingConfig(siteConfig);

  return {
    ...loggingConfig,
    context: scriptName,
    groupMessages: options.groupMessages ?? loggingConfig.groupMessages,
    ...options,
  };
}

/**
 * Environment detection utility
 * @returns {string} Environment type ('node' or 'browser')
 */
export function detectEnvironment() {
  return typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
    ? "node"
    : "browser";
}

/**
 * Check if running in development mode
 * @returns {boolean} True if in development
 */
export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

/**
 * Check if running in production mode
 * @returns {boolean} True if in production
 */
export function isProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * Get verbosity level from command line arguments
 * @param {string[]} args - Command line arguments
 * @returns {string} Verbosity level
 */
export function getVerbosityFromArgs(args = process.argv) {
  if (args.includes("--verbose") || args.includes("-v")) {
    return "DETAILED";
  }
  if (args.includes("--quiet") || args.includes("-q")) {
    return "CONCISE";
  }
  if (args.includes("--normal") || args.includes("-n")) {
    return "NORMAL";
  }
  return null; // Use config file default
}
