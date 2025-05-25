/**
 * Configuration Loader Utility
 * 
 * Loads and manages configuration from site.config.json with fallback defaults.
 * Provides environment-specific configuration loading for both Node.js and browser contexts.
 * 
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 */

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Default configuration values
 */
const defaultConfig = {
  logging: {
    level: 'NORMAL',
    showTimestamp: true,
    showPrefix: true,
    groupMessages: false,
    buildSummary: true,
    colors: {
      success: '#27ae60',
      error: '#e74c3c',
      warning: '#f39c12',
      info: '#3498db',
      debug: '#7f8c8d'
    }
  },
  metadata: {
    projectName: 'Violence Prevention Plan for Illinois: 2025-2029',
    description: 'Comprehensive violence prevention strategies and community resources',
    version: '1.0.0'
  },
  urls: {
    baseUrl: 'https://vpp-2025.netlify.app/',
    devUrl: 'http://localhost:8000'
  }
};

/**
 * Load configuration from site.config.json
 * @param {string} configPath - Path to configuration file
 * @returns {Promise<Object>} Configuration object
 */
export async function loadSiteConfig(configPath = null) {
  try {
    // Determine config path
    const configFile = configPath || path.join(process.cwd(), 'config/site.config.json');
    
    // Read and parse configuration file
    const configContent = await fs.readFile(configFile, 'utf-8');
    const config = JSON.parse(configContent);
    
    // Merge with defaults to ensure all required properties exist
    return mergeWithDefaults(config);
  } catch (error) {
    console.warn(`Warning: Could not load site configuration from ${configPath || 'config/site.config.json'}: ${error.message}`);
    console.warn('Using default configuration values');
    return defaultConfig;
  }
}

/**
 * Load configuration synchronously (Node.js only)
 * @param {string} configPath - Path to configuration file
 * @returns {Object} Configuration object
 */
export function loadSiteConfigSync(configPath = null) {
  try {
    // Determine config path
    const configFile = configPath || path.join(process.cwd(), 'config/site.config.json');
    
    // Read and parse configuration file synchronously
    const configContent = require('fs').readFileSync(configFile, 'utf-8');
    const config = JSON.parse(configContent);
    
    // Merge with defaults to ensure all required properties exist
    return mergeWithDefaults(config);
  } catch (error) {
    console.warn(`Warning: Could not load site configuration from ${configPath || 'config/site.config.json'}: ${error.message}`);
    console.warn('Using default configuration values');
    return defaultConfig;
  }
}

/**
 * Load configuration for browser environment
 * @param {string} configUrl - URL to configuration file
 * @returns {Promise<Object>} Configuration object
 */
export async function loadSiteConfigBrowser(configUrl = '/config/site.config.json') {
  try {
    const response = await fetch(configUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const config = await response.json();
    return mergeWithDefaults(config);
  } catch (error) {
    console.warn(`Warning: Could not load site configuration from ${configUrl}: ${error.message}`);
    console.warn('Using default configuration values');
    return defaultConfig;
  }
}

/**
 * Merge loaded configuration with defaults
 * @param {Object} config - Loaded configuration
 * @returns {Object} Merged configuration
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
        ...(config.logging?.colors || {})
      }
    },
    metadata: {
      ...defaultConfig.metadata,
      ...(config.metadata || {})
    },
    urls: {
      ...defaultConfig.urls,
      ...(config.urls || {})
    }
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
  const logLevel = envLogLevel || siteConfig?.logging?.level || defaultConfig.logging.level;
  
  // Check for other environment overrides
  const showTimestamp = process.env.LOG_TIMESTAMP !== 'false' && 
                       (siteConfig?.logging?.showTimestamp ?? defaultConfig.logging.showTimestamp);
  
  const groupMessages = process.env.LOG_GROUP === 'true' || 
                       (siteConfig?.logging?.groupMessages ?? defaultConfig.logging.groupMessages);
  
  return {
    level: logLevel,
    showTimestamp,
    showPrefix: siteConfig?.logging?.showPrefix ?? defaultConfig.logging.showPrefix,
    groupMessages,
    buildSummary: siteConfig?.logging?.buildSummary ?? defaultConfig.logging.buildSummary,
    colors: siteConfig?.logging?.colors || defaultConfig.logging.colors
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
    ...options
  };
}

/**
 * Environment detection utility
 * @returns {string} Environment type ('node' or 'browser')
 */
export function detectEnvironment() {
  return typeof process !== 'undefined' && 
         process.versions && 
         process.versions.node ? 'node' : 'browser';
}

/**
 * Check if running in development mode
 * @returns {boolean} True if in development
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 * @returns {boolean} True if in production
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get verbosity level from command line arguments
 * @param {string[]} args - Command line arguments
 * @returns {string} Verbosity level
 */
export function getVerbosityFromArgs(args = process.argv) {
  if (args.includes('--verbose') || args.includes('-v')) {
    return 'DETAILED';
  }
  if (args.includes('--quiet') || args.includes('-q')) {
    return 'CONCISE';
  }
  if (args.includes('--normal') || args.includes('-n')) {
    return 'NORMAL';
  }
  return null; // Use config file default
}
