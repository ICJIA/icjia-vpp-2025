/**
 * ⚠️  DEPRECATED: Enhanced Search Index Generator ⚠️
 *
 * 🚨 THIS SCRIPT HAS BEEN DEPRECATED 🚨
 *
 * This script has been replaced by 'generate-search-index-defuddle.js' which provides
 * significantly improved search functionality through Defuddle integration.
 *
 * ❌ DO NOT USE THIS SCRIPT
 * ✅ USE: scripts/generate-search-index-defuddle.js instead
 *
 * DEPRECATION DETAILS:
 * - Deprecated Date: 2025-05-25
 * - Replacement: scripts/generate-search-index-defuddle.js
 * - Reason: Defuddle integration provides 6x better content capture and cleaner search results
 * - Status: Kept for emergency fallback only, not used in build processes
 *
 * IMPROVEMENTS IN DEFUDDLE VERSION:
 * - 6x improvement in content capture (from ~500 words to 3,267 words)
 * - Clean, readable plain text without HTML tags or markdown formatting
 * - Better extraction of MDC component content (::hero-section, ::feature-section, etc.)
 * - Comprehensive content from rendered HTML pages
 * - Enhanced security and sanitization
 *
 * This file remains in the repository for emergency fallback purposes only.
 * All build scripts now use the Defuddle-enhanced version.
 *
 * ORIGINAL DESCRIPTION (for reference):
 * This script generates a comprehensive search index for:
 * 1. All markdown content in the /content directory
 * 2. Vue pages in the /pages directory (extracting visible text content)
 * 3. Recursively processes component imports to include their content
 * 4. Extracts text from script sections including reactive variables and computed properties
 * 5. Detects and processes auto-imported components used in templates
 *
 * The index is saved as a JSON file that can be loaded by the search page.
 *
 * The index includes:
 * - Title from frontmatter or page metadata
 * - Content body text
 * - Path to the content
 * - Description from frontmatter or page metadata (if available)
 * - Type of content (markdown, vue-page, or combined)
 *
 * Features:
 * - Recursive directory scanning for both content and pages
 * - Configurable blacklist to exclude specific pages (via glob patterns)
 * - Duplicate detection and intelligent content merging based on path
 * - Enhanced text extraction from Vue files with component recursion
 * - Configuration via /config/fuse.config.json
 * - Automatic copying of configuration to public directories for browser access
 * - Content overlap detection to prevent duplication
 * - Path normalization for consistent route handling
 * - Special handling for common components (HeroSection, FeatureSection, etc.)
 * - Auto-detection of components used in templates
 * - Extraction of reactive variables and computed properties from script sections
 * - Weighted content extraction to prioritize important text (headings, titles, etc.)
 * - Detailed logging of component processing and content extraction
 *
 * Accessibility Considerations:
 * - Extracts alt text from images to include in the search index
 * - Preserves semantic structure by extracting content from appropriate HTML elements
 * - Includes ARIA label text in the search index
 * - Maintains text relationships by processing parent-child component hierarchies
 * - Ensures screen reader users can find content through search
 * - Prioritizes heading text to match how screen readers present content hierarchy
 *
 * Usage:
 * node scripts/generate-search-index.js [--log-level LEVEL]
 *
 * Options:
 * --log-level LEVEL   Set the logging level (DETAILED, NORMAL, CONCISE)
 *                     DETAILED: Show all messages
 *                     NORMAL: Show success, error, warning, and important info messages (default)
 *                     CONCISE: Show only success and error messages
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";
import matter from "gray-matter";
import {
  sanitizeContentForIndexing,
  containsDangerousContent,
} from "../app/utils/sanitize.js";

/**
 * Console Logger for Search Index Generation
 *
 * A utility for color-coded console logging during search index generation.
 * Provides visual distinction between different types of messages.
 * Supports configurable logging levels to control verbosity.
 */
const Logger = {
  /**
   * Color codes for different log categories
   */
  COLORS: {
    success: "\x1b[32m", // Green
    error: "\x1b[31m", // Red
    warning: "\x1b[33m", // Yellow
    info: "\x1b[36m", // Cyan
    debug: "\x1b[90m", // Gray
    reset: "\x1b[0m", // Reset
  },

  /**
   * Logging levels
   * - DETAILED: Show all messages (success, error, warning, info, debug)
   * - NORMAL: Show success, error, warning, and important info messages
   * - CONCISE: Show only success and error messages
   */
  LEVELS: {
    DETAILED: 3,
    NORMAL: 2,
    CONCISE: 1,
  },

  /**
   * Current logging level
   * @type {number}
   */
  level: 2, // Default to NORMAL

  /**
   * Set the logging level
   * @param {string|number} level - The logging level ('DETAILED', 'NORMAL', 'CONCISE' or 3, 2, 1)
   */
  setLevel(level) {
    if (typeof level === "string") {
      if (this.LEVELS[level.toUpperCase()] !== undefined) {
        this.level = this.LEVELS[level.toUpperCase()];
      } else {
        console.warn(`Invalid logging level: ${level}. Using NORMAL.`);
        this.level = this.LEVELS.NORMAL;
      }
    } else if (typeof level === "number") {
      if (level >= 1 && level <= 3) {
        this.level = level;
      } else {
        console.warn(`Invalid logging level: ${level}. Using NORMAL.`);
        this.level = this.LEVELS.NORMAL;
      }
    }

    // Log the current level
    const levelName = Object.keys(this.LEVELS).find(
      (key) => this.LEVELS[key] === this.level
    );
    console.log(
      `${this.COLORS.info}[INFO]${this.COLORS.reset} Logging level set to ${levelName}`
    );
  },

  /**
   * Log a success message (green)
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  success(message, data) {
    // Always show success messages (all levels)
    this._log("SUCCESS", this.COLORS.success, message, data);
  },

  /**
   * Log an error message (red)
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  error(message, data) {
    // Always show error messages (all levels)
    this._log("ERROR", this.COLORS.error, message, data);
  },

  /**
   * Log a warning message (yellow)
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  warning(message, data) {
    // Show warnings in NORMAL and DETAILED modes
    if (this.level >= this.LEVELS.NORMAL) {
      this._log("WARNING", this.COLORS.warning, message, data);
    }
  },

  /**
   * Log an info message (cyan)
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  info(message, data) {
    // Show info messages in NORMAL and DETAILED modes
    if (this.level >= this.LEVELS.NORMAL) {
      this._log("INFO", this.COLORS.info, message, data);
    }
  },

  /**
   * Log a debug message (gray)
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  debug(message, data) {
    // Show debug messages only in DETAILED mode
    if (this.level >= this.LEVELS.DETAILED) {
      this._log("DEBUG", this.COLORS.debug, message, data);
    }
  },

  /**
   * Internal method to format and log messages
   * @private
   * @param {string} level - The log level
   * @param {string} color - The color code
   * @param {string} message - The message to log
   * @param {any} [data] - Optional data to log
   */
  _log(level, color, message, data) {
    const timestamp = new Date().toISOString().substring(11, 19); // HH:MM:SS
    const prefix = `${color}[${timestamp}][${level}]${this.COLORS.reset}`;

    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  },
};

// Set to track processed components to avoid circular references
const processedComponents = new Set();

// Get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load configuration from fuse.config.json
const configPath = path.join(__dirname, "../config/fuse.config.json");
let config;

try {
  const configData = fs.readFileSync(configPath, "utf8");
  config = JSON.parse(configData);
  console.log("Loaded configuration from fuse.config.json");
} catch (error) {
  console.error("Error loading configuration:", error);
  console.log("Using default configuration");
  config = {
    indexing: {
      blacklist: {
        vue: ["sandbox.vue", "sandbox-*.vue"],
        markdown: ["sandbox.md", "sandbox-*.md"],
      },
      paths: {
        content: "content",
        pages: "pages",
        output: "public/data",
        outputFile: "search-index.json",
      },
    },
  };
}

// Define paths from configuration
const contentDir = path.join(__dirname, "..", config.indexing.paths.content);
const pagesDir = path.join(__dirname, "..", config.indexing.paths.pages);
const outputDir = path.join(__dirname, "..", config.indexing.paths.output);
const outputFile = path.join(outputDir, config.indexing.paths.outputFile);

// Configure blacklist for pages to exclude from indexing
const BLACKLISTED_PAGES = config.indexing.blacklist.vue || [
  "sandbox.vue",
  "sandbox-*.vue", // Glob pattern to exclude all files starting with 'sandbox-'
];

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Delete existing search index if it exists to prevent stale data
if (fs.existsSync(outputFile)) {
  try {
    fs.unlinkSync(outputFile);
    Logger.info(`Deleted existing search index at ${outputFile}`);
  } catch (error) {
    Logger.error(`Failed to delete existing search index: ${error.message}`);
  }
}

/**
 * Normalize a path to a consistent format for comparison
 * This helps with duplicate detection by standardizing paths
 *
 * @param {string} inputPath - The file path to normalize
 * @returns {string} - The normalized path suitable for URL routing and comparison
 *
 * @example
 * // Returns '/about'
 * normalizePath('about.vue')
 *
 * @example
 * // Returns '/'
 * normalizePath('/index.md')
 */
function normalizePath(inputPath) {
  // Remove file extension
  let normalizedPath = inputPath.replace(/\.(vue|md)$/, "");

  // Ensure path starts with a slash
  if (!normalizedPath.startsWith("/")) {
    normalizedPath = "/" + normalizedPath;
  }

  // Convert /index to / for root paths
  if (normalizedPath === "/index") {
    normalizedPath = "/";
  }

  return normalizedPath;
}

/**
 * Calculate the content overlap between two text strings
 * This helps determine if content is duplicated and should be merged
 *
 * @param {string} text1 - First text string
 * @param {string} text2 - Second text string
 * @returns {number} - Overlap ratio between 0 (no overlap) and 1 (complete overlap)
 */
function calculateContentOverlap(text1, text2) {
  if (!text1 || !text2) return 0;

  // Normalize texts for comparison
  const normalizedText1 = text1.toLowerCase().trim();
  const normalizedText2 = text2.toLowerCase().trim();

  // If either text is empty, there's no overlap
  if (!normalizedText1 || !normalizedText2) return 0;

  // Split texts into words for comparison
  const words1 = new Set(
    normalizedText1.split(/\s+/).filter((word) => word.length > 3)
  );
  const words2 = new Set(
    normalizedText2.split(/\s+/).filter((word) => word.length > 3)
  );

  // Count words that appear in both texts
  let overlapCount = 0;
  for (const word of words1) {
    if (words2.has(word)) {
      overlapCount++;
    }
  }

  // Calculate overlap ratio
  const totalUniqueWords = new Set([...words1, ...words2]).size;
  return totalUniqueWords > 0 ? overlapCount / totalUniqueWords : 0;
}

/**
 * Extract plain text content from markdown, removing markdown syntax
 * This function preserves the actual text content while removing all markdown formatting
 * to create a clean text representation suitable for searching.
 *
 * @param {string} markdown - The markdown content to process
 * @returns {string} - Plain text content with markdown syntax removed
 *
 * @example
 * // Returns "This is a heading This is paragraph text"
 * extractTextFromMarkdown('## This is a heading\n\nThis is paragraph text');
 *
 * @example
 * // Returns "Link text with image alt text"
 * extractTextFromMarkdown('[Link text](https://example.com) with ![image alt text](image.jpg)');
 *
 * @accessibility
 * - Preserves alt text from images for better searchability
 * - Maintains text content from links while removing URLs
 * - Preserves the actual text content that would be read by screen readers
 * - Removes formatting that wouldn't be relevant for search purposes
 */
function extractTextFromMarkdown(markdown) {
  if (!markdown) return "";

  // Remove code blocks
  let text = markdown.replace(/```[\s\S]*?```/g, "");

  // Remove inline code
  text = text.replace(/`[^`]*`/g, "");

  // Remove headers but keep the text
  text = text.replace(/#{1,6}\s+/g, "");

  // Remove links but keep the text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Extract alt text from images and keep it
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");

  // Remove HTML tags and their attributes
  text = text.replace(/<[^>]*>/g, " ");

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  // Remove markdown horizontal rules
  text = text.replace(/^\s*[-*_]{3,}\s*$/gm, "");

  // Remove blockquotes but keep the text
  text = text.replace(/^\s*>\s+/gm, "");

  // Remove markdown list markers but keep the list items
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");

  // Remove emphasis markers (* and _) but keep the emphasized text
  text = text.replace(/([*_]{1,2})(\S.*?\S)\1/g, "$2");

  // Replace HTML entities with spaces to avoid concatenated words
  text = text.replace(/&[a-zA-Z0-9#]+;/g, " ");

  // Remove extra whitespace and normalize spacing
  text = text.replace(/\s+/g, " ").trim();

  // Apply additional security sanitization
  text = sanitizeContentForIndexing(text);

  return text;
}

/**
 * Extract component imports from a Vue file
 * This function identifies all component imports in a Vue file
 *
 * @param {string} scriptContent - The script section content of a Vue file
 * @param {string} baseDir - The base directory to resolve relative imports
 * @returns {Array<string>} - Array of absolute paths to imported component files
 */
function extractComponentImports(scriptContent, baseDir) {
  if (!scriptContent) return [];

  const componentPaths = [];

  // Track components that have been processed to avoid duplicates
  const processedComponents = new Set();

  // Extract import statements - handle multiple import patterns
  // Focus on imports that are likely to be Vue components

  // 1. Standard imports: import Component from 'path' (only if path suggests a component)
  const standardImports = scriptContent.match(
    /import\s+[A-Z]\w+\s+from\s+['"]([^'"]+)['"]/g
  );

  // 2. Named imports from component directories: import { Component1, Component2 } from 'components/...'
  const namedImports = scriptContent.match(
    /import\s+\{\s*[^}]+\}\s+from\s+['"]([^'"]*(?:components|\.vue)[^'"]*)['"]/g
  );

  // 3. Dynamic imports: const Component = () => import('path') (only if path suggests a component)
  const dynamicImports = scriptContent.match(
    /import\(\s*['"]([^'"]*(?:components|\.vue)[^'"]*)['"]\s*\)/g
  );

  // 4. Default and named imports from component directories
  const mixedImports = scriptContent.match(
    /import\s+[A-Z]\w+\s*,\s*\{\s*[^}]+\}\s+from\s+['"]([^'"]*(?:components|\.vue)[^'"]*)['"]/g
  );

  // Process standard imports
  if (standardImports) {
    standardImports.forEach((importStatement) => {
      const importPathMatch = importStatement.match(/from\s+['"]([^'"]+)['"]/);
      if (importPathMatch && importPathMatch[1]) {
        const importPath = importPathMatch[1];
        // Additional filtering for standard imports
        if (
          !importPath.includes("composables") &&
          !importPath.includes("utils") &&
          !importPath.includes("plugins") &&
          !importPath.startsWith("use") &&
          !importPath.endsWith(".js") &&
          !importPath.endsWith(".ts")
        ) {
          processImportPath(
            importPath,
            baseDir,
            componentPaths,
            processedComponents
          );
        } else {
          Logger.debug(
            `  Skipping non-component standard import: ${importPath}`
          );
        }
      }
    });
  }

  // Process named imports
  if (namedImports) {
    namedImports.forEach((importStatement) => {
      const importPathMatch = importStatement.match(/from\s+['"]([^'"]+)['"]/);
      if (importPathMatch && importPathMatch[1]) {
        processImportPath(
          importPathMatch[1],
          baseDir,
          componentPaths,
          processedComponents
        );
      }
    });
  }

  // Process dynamic imports
  if (dynamicImports) {
    dynamicImports.forEach((importStatement) => {
      const importPathMatch = importStatement.match(/['"]([^'"]+)['"]/);
      if (importPathMatch && importPathMatch[1]) {
        processImportPath(
          importPathMatch[1],
          baseDir,
          componentPaths,
          processedComponents
        );
      }
    });
  }

  // Process mixed imports
  if (mixedImports) {
    mixedImports.forEach((importStatement) => {
      const importPathMatch = importStatement.match(/from\s+['"]([^'"]+)['"]/);
      if (importPathMatch && importPathMatch[1]) {
        processImportPath(
          importPathMatch[1],
          baseDir,
          componentPaths,
          processedComponents
        );
      }
    });
  }

  // Special case for index.vue - explicitly check for HeroSection and FeatureSection
  // This is a fallback for cases where the import might not be detected correctly
  if (baseDir.endsWith("index.vue") || baseDir.includes("/index.vue")) {
    Logger.info(
      `  Special handling for index.vue: checking for common components`
    );

    // Common components that might be used in index.vue
    const commonComponents = [
      "components/content/HeroSection.vue",
      "components/content/FeatureSection.vue",
      "components/content/ImageWithSpinner.vue",
    ];

    commonComponents.forEach((componentPath) => {
      const fullPath = path.join(path.resolve(__dirname, ".."), componentPath);
      if (fs.existsSync(fullPath) && !processedComponents.has(fullPath)) {
        Logger.info(
          `  Adding common component for index.vue: ${componentPath}`
        );
        componentPaths.push(fullPath);
        processedComponents.add(fullPath);

        // Special handling for HeroSection to ensure the headline is captured
        if (componentPath.includes("HeroSection")) {
          try {
            const heroContent = fs.readFileSync(fullPath, "utf8");
            const headlineMatch = heroContent.match(
              /headline\s*=\s*['"]([^'"]+)['"]/
            );
            if (headlineMatch && headlineMatch[1]) {
              Logger.info(
                `  Found HeroSection headline: "${headlineMatch[1]}"`
              );
              // We'll handle this headline in the processComponentRecursively function
            }
          } catch (error) {
            Logger.error(
              `Error reading HeroSection component: ${error.message}`
            );
          }
        }
      }
    });
  }

  return componentPaths;
}

/**
 * Process an import path and add it to the component paths if it's a component
 *
 * @param {string} importPath - The import path from the import statement
 * @param {string} baseDir - The base directory of the Vue file
 * @param {string[]} componentPaths - Array to store resolved component paths
 * @param {Set<string>} processedComponents - Set of already processed components
 */
function processImportPath(
  importPath,
  baseDir,
  componentPaths,
  processedComponents
) {
  // Skip non-component imports (utilities, composables, etc.)
  // Be more selective to avoid false positives
  const isLikelyComponent =
    importPath.includes(".vue") ||
    importPath.includes("/components/") ||
    importPath.includes("components/") ||
    // Only consider PascalCase imports that don't match known non-component patterns
    (/^[A-Z][a-zA-Z0-9]*$/.test(path.basename(importPath)) &&
      !importPath.includes("/composables/") &&
      !importPath.includes("composables/") &&
      !importPath.includes("/utils/") &&
      !importPath.includes("utils/") &&
      !importPath.includes("/plugins/") &&
      !importPath.includes("plugins/") &&
      !importPath.includes("/middleware/") &&
      !importPath.includes("middleware/") &&
      !importPath.includes("/stores/") &&
      !importPath.includes("stores/") &&
      !importPath.includes("/api/") &&
      !importPath.includes("api/") &&
      !importPath.startsWith("use") && // Skip composables that start with 'use'
      !importPath.includes("use") && // Skip any path containing 'use'
      !importPath.endsWith(".js") &&
      !importPath.endsWith(".ts"));

  if (!isLikelyComponent) {
    Logger.debug(`  Skipping non-component import: ${importPath}`);
    return;
  }

  try {
    // Resolve the import path to an absolute path
    let resolvedPath = importPath;

    // Handle relative imports
    if (importPath.startsWith("./") || importPath.startsWith("../")) {
      resolvedPath = path.resolve(path.dirname(baseDir), importPath);
    }
    // Handle aliased imports (~/components, @/components)
    else if (importPath.startsWith("~/") || importPath.startsWith("@/")) {
      const projectRoot = path.resolve(__dirname, "..");
      resolvedPath = path.join(projectRoot, importPath.replace(/^[~@]\//, ""));
    }
    // Handle imports without ./ or ~/ but that might be components
    else if (
      !importPath.startsWith("/") &&
      !importPath.includes("node_modules")
    ) {
      // Try in components directory first
      const projectRoot = path.resolve(__dirname, "..");
      const componentPath = path.join(projectRoot, "components", importPath);
      const contentComponentPath = path.join(
        projectRoot,
        "components/content",
        importPath
      );

      if (fs.existsSync(componentPath + ".vue")) {
        resolvedPath = componentPath + ".vue";
      } else if (fs.existsSync(contentComponentPath + ".vue")) {
        resolvedPath = contentComponentPath + ".vue";
      } else {
        // Try as a direct path from project root
        resolvedPath = path.join(projectRoot, importPath);
      }
    }

    // Add .vue extension if missing
    if (!resolvedPath.endsWith(".vue")) {
      resolvedPath = resolvedPath + ".vue";
    }

    // Check if the file exists and hasn't been processed yet
    if (fs.existsSync(resolvedPath) && !processedComponents.has(resolvedPath)) {
      componentPaths.push(resolvedPath);
      processedComponents.add(resolvedPath);
      Logger.debug(`  Resolved component: ${path.basename(resolvedPath)}`);
    } else if (!fs.existsSync(resolvedPath)) {
      // Try alternative paths for components
      const alternatives = findAlternativeComponentPaths(importPath);
      let found = false;

      for (const altPath of alternatives) {
        if (fs.existsSync(altPath) && !processedComponents.has(altPath)) {
          componentPaths.push(altPath);
          processedComponents.add(altPath);
          Logger.info(`  Found component at alternative path: ${altPath}`);
          found = true;
          break;
        }
      }

      if (!found) {
        Logger.warning(`Component file not found: ${resolvedPath}`);
      }
    }
  } catch (error) {
    Logger.error(`Error resolving import path ${importPath}:`, error);
  }
}

/**
 * Find alternative paths for a component that might not be resolved correctly
 *
 * @param {string} importPath - The original import path
 * @returns {string[]} - Array of alternative paths to check
 */
function findAlternativeComponentPaths(importPath) {
  const projectRoot = path.resolve(__dirname, "..");
  const componentName = path.basename(importPath, ".vue");

  // Generate possible locations for the component
  return [
    // Check in components directory
    path.join(projectRoot, "components", `${componentName}.vue`),
    // Check in components/content directory
    path.join(projectRoot, "components/content", `${componentName}.vue`),
    // Check with PascalCase
    path.join(
      projectRoot,
      "components",
      `${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.vue`
    ),
    path.join(
      projectRoot,
      "components/content",
      `${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.vue`
    ),
    // Check with kebab-case
    path.join(
      projectRoot,
      "components",
      `${componentName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}.vue`
    ),
    path.join(
      projectRoot,
      "components/content",
      `${componentName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}.vue`
    ),
  ];
}

/**
 * Extract text content from Vue files
 * This function extracts visible text content from Vue template sections
 * It focuses on text that would be visible to users on the rendered page
 * and includes accessibility-related text like ARIA labels and alt text.
 *
 * @param {string} vueContent - The content of the Vue file
 * @param {string} filePath - The path to the Vue file
 * @param {boolean} processComponents - Whether to recursively process imported components
 * @returns {Object} - Object containing extracted text, title, description, and component references
 *
 * @example
 * // Returns object with text content, title, description, and component references
 * extractTextFromVueFile(vueFileContent, '/path/to/component.vue', true);
 *
 * @accessibility
 * - Extracts text from semantic HTML elements (headings, paragraphs, lists)
 * - Includes text from ARIA labels and alt attributes
 * - Captures text from Vuetify components that would be visible to users
 * - Preserves text from buttons and interactive elements
 * - Extracts title and description metadata for better search context
 * - Processes JSDoc comments that may contain accessibility documentation
 */
function extractTextFromVueFile(
  vueContent,
  filePath,
  processComponents = false
) {
  if (!vueContent)
    return { text: "", title: "", description: "", components: [] };

  // Initialize result object
  const result = {
    text: "",
    title: "",
    description: "",
    components: [],
  };

  try {
    // Extract template section
    const templateMatch = vueContent.match(/<template>([\s\S]*?)<\/template>/);
    let templateContent = null;

    if (templateMatch && templateMatch[1]) {
      templateContent = templateMatch[1];

      // Extract text from template
      // First, remove script and style tags if present in the template
      templateContent = templateContent.replace(
        /<script[\s\S]*?<\/script>/g,
        ""
      );
      templateContent = templateContent.replace(/<style[\s\S]*?<\/style>/g, "");

      // Extract component usage from template for auto-imported components
      // This helps identify components that might not be explicitly imported in the script section
      if (processComponents && filePath) {
        // Look for components in PascalCase (standard Vue component naming)
        const componentTags = templateContent.match(
          /<([A-Z][a-zA-Z0-9]+)[\s>]/g
        );
        if (componentTags) {
          const autoImportedComponents = new Set();

          componentTags.forEach((tag) => {
            // Extract component name from tag
            const componentName = tag.match(/<([A-Z][a-zA-Z0-9]+)/)[1];

            // Skip if already processed
            if (processedComponents.has(componentName)) {
              return;
            }

            Logger.info(
              `  Found potential auto-imported component in template: ${componentName}`
            );
            autoImportedComponents.add(componentName);
          });

          // Try to resolve auto-imported components
          if (autoImportedComponents.size > 0) {
            Logger.info(
              `  Attempting to resolve ${autoImportedComponents.size} auto-imported components`
            );

            // Common locations for components
            const componentLocations = [
              "components",
              "components/content",
              "components/layout",
              "components/ui",
            ];

            autoImportedComponents.forEach((componentName) => {
              // Try different casing conventions
              const kebabCase = componentName
                .replace(/([a-z])([A-Z])/g, "$1-$2")
                .toLowerCase();

              let found = false;

              // Check each potential location
              for (const location of componentLocations) {
                const projectRoot = path.resolve(__dirname, "..");

                // Try PascalCase
                const pascalPath = path.join(
                  projectRoot,
                  location,
                  `${componentName}.vue`
                );
                // Try kebab-case
                const kebabPath = path.join(
                  projectRoot,
                  location,
                  `${kebabCase}.vue`
                );

                if (fs.existsSync(pascalPath)) {
                  Logger.info(`  Found auto-imported component: ${pascalPath}`);
                  result.components.push(pascalPath);
                  found = true;
                  break;
                } else if (fs.existsSync(kebabPath)) {
                  Logger.info(`  Found auto-imported component: ${kebabPath}`);
                  result.components.push(kebabPath);
                  found = true;
                  break;
                }
              }

              if (!found) {
                Logger.warning(
                  `  Could not resolve auto-imported component: ${componentName}`
                );
              }
            });
          }
        }
      }

      // Special case for headings (h1-h6) - these are critical for search
      // We prioritize headings by adding them multiple times to increase their weight in search results
      const headingMatches = {
        h1: templateContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/g),
        h2: templateContent.match(/<h2[^>]*>([\s\S]*?)<\/h2>/g),
        h3: templateContent.match(/<h3[^>]*>([\s\S]*?)<\/h3>/g),
        h4: templateContent.match(/<h4[^>]*>([\s\S]*?)<\/h4>/g),
        h5: templateContent.match(/<h5[^>]*>([\s\S]*?)<\/h5>/g),
        h6: templateContent.match(/<h6[^>]*>([\s\S]*?)<\/h6>/g),
      };

      // Process each heading level
      Object.entries(headingMatches).forEach(([level, matches]) => {
        if (matches) {
          matches.forEach((match) => {
            // Extract the text content from the heading tag
            const regex = new RegExp(
              `<${level}[^>]*>([\\s\\S]*?)<\\/${level}>`,
              "i"
            );
            const textMatch = match.match(regex);
            if (textMatch && textMatch[1]) {
              // Clean up the heading text
              const headingText = textMatch[1]
                .replace(/<[^>]*>/g, " ") // Remove HTML tags
                .replace(/\s+/g, " ") // Normalize whitespace
                .trim();

              if (headingText) {
                // Add the heading text to the result multiple times based on importance
                // h1 gets added 5 times, h2 gets added 4 times, etc.
                const weight = 6 - parseInt(level.substring(1));
                const repeatedText = Array(weight).fill(headingText).join(" ");
                result.text += " " + repeatedText;

                // Log the heading text for debugging
                Logger.info(
                  `  Found ${level} heading: "${headingText}" (weight: ${weight})`
                );

                // If this is an h1, it might be the page title
                if (level === "h1" && !result.title) {
                  result.title = headingText;
                  Logger.info(`  Using h1 as page title: "${headingText}"`);
                }
              }
            }
          });
        }
      });

      // Pre-process the template to remove non-content elements
      // Remove class attributes (which often contain Vuetify classes and other styling)
      templateContent = templateContent.replace(/\sclass="[^"]*"/g, "");

      // Remove other common non-content attributes
      const nonContentAttrs = [
        /\sv-bind:[^=]+=(?:"[^"]*"|'[^']*')/g, // v-bind directives
        /\s@[^=]+=(?:"[^"]*"|'[^']*')/g, // @event handlers
        /\sv-on:[^=]+=(?:"[^"]*"|'[^']*')/g, // v-on directives
        /\sv-[^=]+=(?:"[^"]*"|'[^']*')/g, // other v-directives
        /\s:[^=]+=(?:"[^"]*"|'[^']*')/g, // shorthand props
        /\sstyle="[^"]*"/g, // inline styles
        /\sid="[^"]*"/g, // id attributes
        /\sref="[^"]*"/g, // ref attributes
        /\skey="[^"]*"/g, // key attributes
        /\sdata-[^=]+=(?:"[^"]*"|'[^']*')/g, // data attributes
      ];

      nonContentAttrs.forEach((pattern) => {
        templateContent = templateContent.replace(pattern, "");
      });

      // Extract text from common text elements
      // This focuses on elements that typically contain visible text
      const textElements = [
        // Headers and text content
        /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g,
        /<p[^>]*>([\s\S]*?)<\/p>/g,
        /<li[^>]*>([\s\S]*?)<\/li>/g,
        /<span[^>]*>([\s\S]*?)<\/span>/g,
        /<div[^>]*>([\s\S]*?)<\/div>/g,
        /<a[^>]*>([\s\S]*?)<\/a>/g,
        /<strong[^>]*>([\s\S]*?)<\/strong>/g,
        /<em[^>]*>([\s\S]*?)<\/em>/g,
        /<b[^>]*>([\s\S]*?)<\/b>/g,
        /<i[^>]*>([\s\S]*?)<\/i>/g,
        // Button text
        /<v-btn[^>]*>([\s\S]*?)<\/v-btn>/g,
        /<button[^>]*>([\s\S]*?)<\/button>/g,
        // List items and card content
        /<v-list-item-title[^>]*>([\s\S]*?)<\/v-list-item-title>/g,
        /<v-card-title[^>]*>([\s\S]*?)<\/v-card-title>/g,
        /<v-card-text[^>]*>([\s\S]*?)<\/v-card-text>/g,
        /<v-card-subtitle[^>]*>([\s\S]*?)<\/v-card-subtitle>/g,
        // Vuetify specific components
        /<v-list-item[^>]*>([\s\S]*?)<\/v-list-item>/g,
        /<v-alert[^>]*>([\s\S]*?)<\/v-alert>/g,
        /<v-chip[^>]*>([\s\S]*?)<\/v-chip>/g,
        /<v-tooltip[^>]*>([\s\S]*?)<\/v-tooltip>/g,
        // Text in attributes (for static text)
        /text="([^"]+)"/g,
        /label="([^"]+)"/g,
        /placeholder="([^"]+)"/g,
        /title="([^"]+)"/g,
        /alt="([^"]+)"/g,
        // Accessibility-related attributes
        /aria-label="([^"]+)"/g,
        /aria-labelledby="([^"]+)"/g,
        /aria-description="([^"]+)"/g,
        /aria-details="([^"]+)"/g,
        /aria-placeholder="([^"]+)"/g,
        /aria-roledescription="([^"]+)"/g,
        /aria-valuetext="([^"]+)"/g,
        /aria-valuenow="([^"]+)"/g,
        /description="([^"]+)"/g,
        /tooltip="([^"]+)"/g,
        /caption="([^"]+)"/g,
      ];

      // Extract text from each pattern
      let extractedText = "";
      textElements.forEach((pattern) => {
        const matches = templateContent.matchAll(pattern);
        for (const match of matches) {
          if (match[1] && match[1].trim()) {
            // Include all text, even if it contains template variables
            extractedText += " " + match[1].trim();
          }
        }
      });

      // Extract text from template interpolation ({{ variable }})
      // This captures text that might be rendered through template variables
      const interpolationMatches = templateContent.match(/{{([^}]*)}}/g);
      if (interpolationMatches) {
        interpolationMatches.forEach((match) => {
          // Extract the variable name from the interpolation
          const varMatch = match.match(/{{([^}|.]*)}}/);
          if (varMatch && varMatch[1]) {
            const varName = varMatch[1].trim();
            // Add the variable name as a potential search term
            // This will be useful when we extract the actual values from the script section
            if (varName && !varName.includes(".") && !varName.includes("(")) {
              extractedText += " " + varName;
            }
          }
        });
      }

      // Clean up the extracted text
      // Remove HTML tags (including nested tags)
      extractedText = extractedText.replace(/<[^>]*>/g, " ");

      // Clean up template variables and directives but keep potential content
      extractedText = extractedText.replace(/{{|}}/g, " ");
      extractedText = extractedText.replace(/@[a-zA-Z0-9_]+/g, " ");
      extractedText = extractedText.replace(/:[a-zA-Z0-9_]+/g, " ");
      extractedText = extractedText.replace(/v-[a-zA-Z0-9_]+/g, " ");

      // Remove common Vue/Vuetify class names that might have been captured
      const classPatterns = [
        /\btext-[a-zA-Z0-9-]+\b/g, // text-* classes
        /\bfont-[a-zA-Z0-9-]+\b/g, // font-* classes
        /\bbg-[a-zA-Z0-9-]+\b/g, // bg-* classes
        /\bma-[0-9]+\b/g,
        /\bpa-[0-9]+\b/g, // margin/padding classes
        /\bmt-[0-9]+\b/g,
        /\bpt-[0-9]+\b/g, // margin/padding top classes
        /\bmb-[0-9]+\b/g,
        /\bpb-[0-9]+\b/g, // margin/padding bottom classes
        /\bml-[0-9]+\b/g,
        /\bpl-[0-9]+\b/g, // margin/padding left classes
        /\bmr-[0-9]+\b/g,
        /\bpr-[0-9]+\b/g, // margin/padding right classes
        /\bmx-[0-9]+\b/g,
        /\bpx-[0-9]+\b/g, // margin/padding x-axis classes
        /\bmy-[0-9]+\b/g,
        /\bpy-[0-9]+\b/g, // margin/padding y-axis classes
        /\bd-[a-zA-Z0-9-]+\b/g, // display classes
        /\bflex-[a-zA-Z0-9-]+\b/g, // flex classes
        /\balign-[a-zA-Z0-9-]+\b/g, // align classes
        /\bjustify-[a-zA-Z0-9-]+\b/g, // justify classes
        /\brow\b/g,
        /\bcol\b/g,
        /\bcol-[0-9]+\b/g, // grid classes
        /\bprimary\b/g,
        /\bsecondary\b/g,
        /\baccent\b/g, // color classes
        /\berror\b/g,
        /\bwarning\b/g,
        /\binfo\b/g,
        /\bsuccess\b/g, // status classes
        /\blighten-[0-9]+\b/g,
        /\bdarken-[0-9]+\b/g, // color modification classes
        /\belevation-[0-9]+\b/g, // elevation classes
        /\brounded-[a-zA-Z0-9-]+\b/g, // rounded classes
        /\bv-[a-zA-Z0-9-]+\b/g, // Vuetify specific classes
      ];

      classPatterns.forEach((pattern) => {
        extractedText = extractedText.replace(pattern, " ");
      });

      // Remove any remaining HTML attributes that might have been captured
      extractedText = extractedText.replace(/\s[a-zA-Z0-9_-]+="[^"]*"/g, " ");

      // Remove extra whitespace
      extractedText = extractedText.replace(/\s+/g, " ").trim();

      result.text = extractedText;
    }

    // Extract metadata from script section
    const scriptMatch = vueContent.match(
      /<script[\s\S]*?>([\s\S]*?)<\/script>/
    );
    if (scriptMatch && scriptMatch[1]) {
      const scriptContent = scriptMatch[1];

      // Look for title in useHead or useSeoMeta
      const titleMatch = scriptContent.match(/title:\s*['"]([^'"]+)['"]/);
      if (titleMatch && titleMatch[1]) {
        result.title = titleMatch[1];
      }

      // Look for description in useSeoMeta
      const descMatch = scriptContent.match(/description:\s*['"]([^'"]+)['"]/);
      if (descMatch && descMatch[1]) {
        result.description = descMatch[1];
      }

      // Look for JSDoc comments with page title
      const jsdocTitleMatch = scriptContent.match(
        /@page\s*\n\s*\*\/\s*[\s\S]*?['"]([^'"]+)['"]/
      );
      if (!result.title && jsdocTitleMatch && jsdocTitleMatch[1]) {
        result.title = jsdocTitleMatch[1];
      }

      // Extract text from component documentation
      const docCommentMatch = scriptContent.match(/\/\*\*[\s\S]*?\*\//g);
      if (docCommentMatch) {
        docCommentMatch.forEach((comment) => {
          // Extract description from JSDoc comment
          const descriptionMatch = comment.match(/\*\s*([^@*][^\n]*)/g);
          if (descriptionMatch) {
            const docText = descriptionMatch
              .map((line) => line.replace(/^\*\s*/, "").trim())
              .filter((line) => line && !line.startsWith("@"))
              .join(" ");

            if (docText) {
              result.text += " " + docText;
            }
          }
        });
      }

      // Extract text from JavaScript variables and constants
      // This captures text content defined in the script section that might be used in the template
      Logger.info(
        `  Extracting text from script section of ${path.basename(filePath)}`
      );

      // Track variables found in template interpolation
      const templateVariables = new Set();
      const interpolationMatches = templateContent
        ? templateContent.match(/{{([^}]*)}}/g)
        : null;
      if (interpolationMatches) {
        interpolationMatches.forEach((match) => {
          const varMatch = match.match(/{{([^}|.]*)}}/);
          if (varMatch && varMatch[1]) {
            const varName = varMatch[1].trim();
            if (varName && !varName.includes(".") && !varName.includes("(")) {
              templateVariables.add(varName);
              Logger.info(`    Found template variable: ${varName}`);
            }
          }
        });
      }

      // Extract string literals from const/let/var declarations
      const variableDeclarations = scriptContent.match(
        /(?:const|let|var)\s+(\w+)\s*=\s*(['"][^'"]+['"]|ref\(['"][^'"]+['"]\)|computed\(\s*\(\)\s*=>\s*['"][^'"]+['"]\))/g
      );
      if (variableDeclarations) {
        variableDeclarations.forEach((declaration) => {
          // Extract variable name
          const varNameMatch = declaration.match(
            /(?:const|let|var)\s+(\w+)\s*=/
          );
          if (varNameMatch && varNameMatch[1]) {
            const varName = varNameMatch[1];

            // Check if this variable is used in template interpolation
            const isTemplateVar = templateVariables.has(varName);

            // Extract string value
            const stringMatch = declaration.match(/['"]([^'"]+)['"]/);
            if (stringMatch && stringMatch[1]) {
              const value = stringMatch[1];
              // Add with higher weight if it's a template variable
              if (isTemplateVar) {
                // Repeat the value to give it higher weight in search
                const repeatedValue = Array(3).fill(value).join(" ");
                result.text += " " + repeatedValue;
                Logger.info(
                  `    Added template variable value: ${varName} = "${value}" (with higher weight)`
                );
              } else {
                result.text += " " + value;
                Logger.info(
                  `    Added variable value: ${varName} = "${value}"`
                );
              }
            }
          }
        });
      }

      // Extract reactive variables (ref, reactive)
      const refMatches = scriptContent.match(
        /(?:const|let|var)\s+(\w+)\s*=\s*ref\(['"]([^'"]+)['"]\)/g
      );
      if (refMatches) {
        refMatches.forEach((match) => {
          const refNameMatch = match.match(/(?:const|let|var)\s+(\w+)\s*=/);
          const refValueMatch = match.match(/ref\(['"]([^'"]+)['"]\)/);

          if (
            refNameMatch &&
            refNameMatch[1] &&
            refValueMatch &&
            refValueMatch[1]
          ) {
            const refName = refNameMatch[1];
            const refValue = refValueMatch[1];

            // Check if this ref is used in template interpolation
            const isTemplateVar = templateVariables.has(refName);

            // Add with higher weight if it's a template variable
            if (isTemplateVar) {
              // Repeat the value to give it higher weight in search
              const repeatedValue = Array(3).fill(refValue).join(" ");
              result.text += " " + repeatedValue;
              Logger.info(
                `    Added template ref value: ${refName} = "${refValue}" (with higher weight)`
              );
            } else {
              result.text += " " + refValue;
              Logger.info(`    Added ref value: ${refName} = "${refValue}"`);
            }
          }
        });
      }

      // Extract computed properties
      const computedMatches = scriptContent.match(
        /(?:const|let|var)\s+(\w+)\s*=\s*computed\(\s*\(\)\s*=>\s*(['"][^'"]+['"]|{[\s\S]*?return\s+['"]([^'"]+)['"]\s*;?\s*})/g
      );
      if (computedMatches) {
        computedMatches.forEach((match) => {
          const computedNameMatch = match.match(
            /(?:const|let|var)\s+(\w+)\s*=/
          );

          if (computedNameMatch && computedNameMatch[1]) {
            const computedName = computedNameMatch[1];

            // Try to extract direct string return
            let computedValue = "";
            const directReturnMatch = match.match(
              /computed\(\s*\(\)\s*=>\s*['"]([^'"]+)['"]/
            );
            if (directReturnMatch && directReturnMatch[1]) {
              computedValue = directReturnMatch[1];
            } else {
              // Try to extract from return statement in function body
              const returnMatch = match.match(/return\s+['"]([^'"]+)['"]/);
              if (returnMatch && returnMatch[1]) {
                computedValue = returnMatch[1];
              }
            }

            if (computedValue) {
              // Check if this computed prop is used in template interpolation
              const isTemplateVar = templateVariables.has(computedName);

              // Add with higher weight if it's a template variable
              if (isTemplateVar) {
                // Repeat the value to give it higher weight in search
                const repeatedValue = Array(3).fill(computedValue).join(" ");
                result.text += " " + repeatedValue;
                Logger.info(
                  `    Added template computed value: ${computedName} = "${computedValue}" (with higher weight)`
                );
              } else {
                result.text += " " + computedValue;
                Logger.info(
                  `    Added computed value: ${computedName} = "${computedValue}"`
                );
              }
            }
          }
        });
      }

      // Extract text from array literals (common for menu items, features, etc.)
      const arrayStringMatches = scriptContent.match(/['"]([^'"]+)['"]/g);
      if (arrayStringMatches) {
        arrayStringMatches.forEach((match) => {
          const stringContent = match.replace(/['"]/g, "");
          if (
            stringContent &&
            stringContent.length > 3 &&
            !/^https?:\/\//.test(stringContent)
          ) {
            // Skip URLs and very short strings (likely not content)
            result.text += " " + stringContent;
          }
        });
      }

      // Special case for arrays of objects (common pattern in Vue components)
      // This handles cases like feature lists, menu items, etc.
      const arrayObjectMatches = scriptContent.match(
        /(?:const|let|var)\s+(\w+)\s*=\s*\[([\s\S]*?)\];/g
      );
      if (arrayObjectMatches) {
        arrayObjectMatches.forEach((arrayMatch) => {
          // Extract the array name and content
          const nameMatch = arrayMatch.match(/(?:const|let|var)\s+(\w+)\s*=/);
          if (nameMatch && nameMatch[1]) {
            const arrayName = nameMatch[1];
            Logger.info(`  Processing array: ${arrayName}`);

            // Extract all string properties from the array objects
            const propertyMatches = arrayMatch.match(
              /(\w+):\s*['"]([^'"]+)['"]/g
            );
            if (propertyMatches) {
              propertyMatches.forEach((propMatch) => {
                const valueMatch = propMatch.match(/:\s*['"]([^'"]+)['"]/);
                if (valueMatch && valueMatch[1]) {
                  const value = valueMatch[1];
                  // Skip URLs, class names, and very short strings
                  if (
                    value.length > 3 &&
                    !/^https?:\/\//.test(value) &&
                    !/^[a-z-]+$/.test(value)
                  ) {
                    result.text += " " + value;
                    Logger.info(`    Added text from ${arrayName}: "${value}"`);
                  }
                }
              });
            }
          }
        });
      }

      // Extract text from object literals (common for component props, metadata)
      const objectProperties = scriptContent.match(/\w+:\s*['"]([^'"]+)['"]/g);
      if (objectProperties) {
        objectProperties.forEach((prop) => {
          const valueMatch = prop.match(/:\s*['"]([^'"]+)['"]/);
          if (valueMatch && valueMatch[1]) {
            const value = valueMatch[1];
            // Skip URLs, class names, and very short strings
            if (
              value.length > 3 &&
              !/^https?:\/\//.test(value) &&
              !/^[a-z-]+$/.test(value)
            ) {
              result.text += " " + value;
            }
          }
        });
      }

      // Process component imports if requested
      if (processComponents && filePath) {
        // Extract component imports
        const componentPaths = extractComponentImports(scriptContent, filePath);

        // Process each imported component
        if (componentPaths.length > 0) {
          Logger.info(
            `  Found ${componentPaths.length} component imports in ${path.basename(filePath)}`
          );

          // Log the component paths for debugging
          componentPaths.forEach((compPath) => {
            Logger.info(`    - ${path.basename(compPath)}`);
          });

          // Add to the list of components for this file
          result.components = componentPaths;
        }
      }
    }

    // If no title was found, use the filename as a fallback
    if (!result.title && filePath) {
      const filename = path.basename(filePath, ".vue");
      // Convert kebab-case to Title Case
      result.title = filename
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return result;
  } catch (error) {
    Logger.error("Error extracting text from Vue file:", error);
    return result;
  }
}

/**
 * Recursively process a Vue component and its imported components
 * This function extracts text content from a component and all its child components,
 * following the component hierarchy to ensure all visible content is included in the search index.
 *
 * @param {string} filePath - The path to the Vue component file
 * @param {Set<string>} visited - Set of already processed component paths to avoid circular references
 * @param {number} depth - Current recursion depth (limited to 5 levels to prevent infinite recursion)
 * @returns {Object} - Object containing extracted text, title, description, and component info
 *
 * @example
 * // Process a component and all its children
 * const result = processComponentRecursively('/path/to/PageComponent.vue');
 *
 * @accessibility
 * - Follows component relationships to maintain content context
 * - Ensures content from nested components is properly associated with parent pages
 * - Preserves the relationship between parent pages and child components
 * - Captures text from all levels of the component hierarchy
 * - Prevents circular references that could cause processing issues
 * - Maintains a depth limit to ensure reasonable processing time
 */
function processComponentRecursively(filePath, visited = new Set(), depth = 0) {
  // Skip if already processed to avoid circular references
  if (visited.has(filePath)) {
    return { text: "", components: [] };
  }

  // Add to visited set
  visited.add(filePath);

  // Read the component file
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Extract text and metadata from the component
    const result = extractTextFromVueFile(content, filePath, true);

    // Special handling for common components
    // This section handles special cases for components that need custom extraction logic

    // HeroSection component
    if (filePath.includes("HeroSection.vue")) {
      Logger.info(`  Special handling for HeroSection component`);

      // Extract headline prop from the component
      const headlineMatch = content.match(/headline\s*=\s*['"]([^'"]+)['"]/);
      if (headlineMatch && headlineMatch[1]) {
        const headline = headlineMatch[1];
        Logger.info(`  Found HeroSection headline: "${headline}"`);

        // Add the headline to the result text with high weight (repeat 10 times)
        // This ensures the headline is highly prioritized in search results
        const repeatedHeadline = Array(10).fill(headline).join(" ");
        result.text += " " + repeatedHeadline;

        // Also add it as a title if no title is set
        if (!result.title) {
          result.title = headline;
        }
      }

      // Extract subheadline prop from the component
      const subheadlineMatch = content.match(
        /subheadline\s*=\s*['"]([^'"]+)['"]/
      );
      if (subheadlineMatch && subheadlineMatch[1]) {
        const subheadline = subheadlineMatch[1];
        Logger.info(`  Found HeroSection subheadline: "${subheadline}"`);

        // Add the subheadline to the result text with medium weight (repeat 5 times)
        const repeatedSubheadline = Array(5).fill(subheadline).join(" ");
        result.text += " " + repeatedSubheadline;
      }
    }

    // FeatureSection component
    else if (filePath.includes("FeatureSection.vue")) {
      Logger.info(`  Special handling for FeatureSection component`);

      // Extract features array from the component
      const featuresMatch = content.match(
        /const\s+features\s*=\s*\[([\s\S]*?)\];/
      );
      if (featuresMatch && featuresMatch[1]) {
        const featuresContent = featuresMatch[1];

        // Extract titles and descriptions from features
        const titleMatches = featuresContent.match(
          /title:\s*['"]([^'"]+)['"]/g
        );
        const descriptionMatches = featuresContent.match(
          /description:\s*['"]([^'"]+)['"]/g
        );

        if (titleMatches) {
          titleMatches.forEach((match) => {
            const titleMatch = match.match(/['"]([^'"]+)['"]/);
            if (titleMatch && titleMatch[1]) {
              const title = titleMatch[1];
              // Add feature titles with high weight (repeat 3 times)
              const repeatedTitle = Array(3).fill(title).join(" ");
              result.text += " " + repeatedTitle;
              Logger.info(`  Found FeatureSection title: "${title}"`);
            }
          });
        }

        if (descriptionMatches) {
          descriptionMatches.forEach((match) => {
            const descMatch = match.match(/['"]([^'"]+)['"]/);
            if (descMatch && descMatch[1]) {
              const description = descMatch[1];
              result.text += " " + description;
              Logger.info(
                `  Found FeatureSection description: "${description}"`
              );
            }
          });
        }
      }
    }

    // FeatureCard component
    else if (filePath.includes("FeatureCard.vue")) {
      Logger.info(`  Special handling for FeatureCard component`);

      // Extract props from the component
      const titlePropMatch = content.match(
        /title:\s*{\s*type:\s*String,\s*required:\s*true\s*}/
      );
      const descriptionPropMatch = content.match(
        /description:\s*{\s*type:\s*String,\s*required:\s*true\s*}/
      );

      if (titlePropMatch || descriptionPropMatch) {
        Logger.info(
          `  Found FeatureCard props that will be populated by parent component`
        );
      }
    }

    // ContentDisplay component
    else if (
      filePath.includes("ContentDisplay.vue") ||
      filePath.includes("SimpleContentDisplay.vue")
    ) {
      Logger.info(`  Special handling for ContentDisplay component`);

      // These components render dynamic content from the content directory
      // We need to ensure the path prop is captured to potentially link to the content
      const pathPropMatch = content.match(
        /path:\s*{\s*type:\s*String,\s*required:\s*true\s*}/
      );

      if (pathPropMatch) {
        Logger.info(
          `  Found ContentDisplay path prop that will load dynamic content`
        );

        // Try to find usages of this component in the parent file
        if (depth === 0) {
          const parentDir = path.dirname(filePath);
          const parentFiles = globSync("**/*.vue", { cwd: parentDir });

          parentFiles.forEach((parentFile) => {
            const parentPath = path.join(parentDir, parentFile);
            try {
              const parentContent = fs.readFileSync(parentPath, "utf8");

              // Look for path prop assignments
              const pathAssignments = parentContent.match(
                /path\s*=\s*['"]([^'"]+)['"]/g
              );

              if (pathAssignments) {
                pathAssignments.forEach((assignment) => {
                  const pathMatch = assignment.match(/['"]([^'"]+)['"]/);
                  if (pathMatch && pathMatch[1]) {
                    const contentPath = pathMatch[1];
                    Logger.info(
                      `  Found potential content path: ${contentPath}`
                    );

                    // Add a note about this content path
                    result.text += ` Content from path: ${contentPath}`;
                  }
                });
              }
            } catch (error) {
              // Ignore errors reading parent files
            }
          });
        }
      }
    }

    // Process child components recursively (up to a reasonable depth)
    if (depth < 5 && result.components && result.components.length > 0) {
      const indent = "  ".repeat(depth + 1);
      Logger.info(
        `${indent}Processing ${result.components.length} child components for ${path.basename(filePath)}`
      );

      // Track component processing statistics
      let processedCount = 0;
      let skippedCount = 0;
      let totalTextAdded = 0;

      // Process each child component
      for (const componentPath of result.components) {
        // Skip processing if the component path doesn't exist
        if (!fs.existsSync(componentPath)) {
          Logger.warning(
            `${indent}Skipping non-existent component: ${componentPath}`
          );
          skippedCount++;
          continue;
        }

        // Skip if we've already processed this component at this depth or higher
        if (visited.has(componentPath)) {
          Logger.info(
            `${indent}Skipping already processed component: ${path.basename(componentPath)}`
          );
          skippedCount++;
          continue;
        }

        // Process the component recursively
        const childResult = processComponentRecursively(
          componentPath,
          visited,
          depth + 1
        );

        // Add child component text to parent component text
        if (childResult.text) {
          // Log the text being added from child components for debugging
          if (childResult.text.length > 50) {
            Logger.info(
              `${indent}Adding ${childResult.text.length} characters of text from ${path.basename(componentPath)}`
            );
            Logger.info(
              `${indent}Sample: "${childResult.text.substring(0, 50)}..."`
            );
          } else if (childResult.text.length > 0) {
            Logger.info(
              `${indent}Adding text from ${path.basename(componentPath)}: "${childResult.text}"`
            );
          }

          result.text += " " + childResult.text;
          totalTextAdded += childResult.text.length;
          processedCount++;
        } else {
          Logger.info(
            `${indent}No text content found in component: ${path.basename(componentPath)}`
          );
          skippedCount++;
        }
      }

      // Log component processing statistics
      Logger.info(
        `${indent}Component processing complete: ${processedCount} processed, ${skippedCount} skipped, ${totalTextAdded} characters added`
      );
    }

    return result;
  } catch (error) {
    Logger.error(`Error processing component ${filePath}:`, error);
    return { text: "", components: [] };
  }
}

/**
 * Create a search index from markdown files and Vue pages
 * This is the main function that orchestrates the entire indexing process,
 * processing both markdown content and Vue pages, handling duplicates,
 * and generating the final search index file.
 *
 * @param {Object} options - Options for the search index generation
 * @param {string} [options.logLevel='NORMAL'] - Logging level ('DETAILED', 'NORMAL', 'CONCISE')
 * @returns {Promise<void>} - A promise that resolves when the index has been generated
 *
 * @accessibility
 * - Creates a comprehensive search index that includes all visible content
 * - Ensures content is properly associated with the correct routes
 * - Handles duplicate content intelligently to prevent redundancy
 * - Preserves important metadata like titles and descriptions
 * - Includes accessibility-related text like ARIA labels and alt text
 * - Makes content discoverable through search for all users
 * - Copies configuration to public directories for client-side access
 */
async function generateSearchIndex(options = {}) {
  // Set logging level based on options
  const logLevel = options.logLevel || "NORMAL";
  Logger.setLevel(logLevel);

  Logger.info("🔍 Starting search index generation...");
  Logger.info(`📊 Configuration: Logging level = ${logLevel}`);

  // Initialize the search index map (using path as key for duplicate detection)
  const searchIndexMap = new Map();

  // PART 1: Process markdown files from the content directory
  Logger.info("📄 Processing markdown files from content directory...");

  // Define blacklist patterns for markdown files from configuration
  const MARKDOWN_BLACKLIST = config.indexing.blacklist.markdown || [
    "sandbox.md",
    "sandbox-*.md", // Glob pattern to exclude all files starting with 'sandbox-'
  ];

  const markdownFiles = globSync("**/*.md", {
    cwd: contentDir,
    ignore: MARKDOWN_BLACKLIST, // Use the markdown blacklist
  });

  Logger.info(
    `📊 Found ${markdownFiles.length} markdown files (excluding blacklisted files)`
  );

  // Track success and failure counts
  let markdownSuccessCount = 0;
  let markdownFailureCount = 0;

  // Process each markdown file
  for (const file of markdownFiles) {
    try {
      const filePath = path.join(contentDir, file);
      const content = fs.readFileSync(filePath, "utf8");

      // Parse frontmatter and content
      const { data, content: markdownContent } = matter(content);

      // Extract text from markdown
      const plainText = extractTextFromMarkdown(markdownContent);

      // Determine the route path and normalize it
      let routePath = "/" + file.replace(/\.md$/, "");
      const normalizedPath = normalizePath(routePath);

      // Security check for dangerous content
      if (containsDangerousContent(plainText)) {
        Logger.warning(
          `⚠️ Potentially dangerous content detected in ${file}, applying extra sanitization`
        );
      }

      // Create search item with sanitized content
      const searchItem = {
        title: sanitizeContentForIndexing(
          data.title || path.basename(file, ".md")
        ),
        content: plainText, // Already sanitized in extractTextFromMarkdown
        path: normalizedPath,
        description: sanitizeContentForIndexing(
          data.description || plainText.substring(0, 160) + "..."
        ),
        // Store the raw frontmatter data for additional search fields (but sanitize it)
        frontmatter: data,
        // Add type field to identify content source
        type: "markdown",
        // Add source file for debugging
        sourceFile: file,
      };

      // Add to search index map
      searchIndexMap.set(normalizedPath, searchItem);
      Logger.success(`✓ Indexed markdown: ${file} -> ${normalizedPath}`);
      markdownSuccessCount++;
    } catch (error) {
      Logger.error(`✗ Error processing markdown file ${file}:`, error);
      markdownFailureCount++;
    }
  }

  Logger.info(
    `📊 Markdown processing complete: ${markdownSuccessCount} successful, ${markdownFailureCount} failed`
  );

  // PART 2: Process Vue files from the pages directory
  Logger.info("\n📄 Processing Vue files from pages directory...");

  // Use recursive glob to find all Vue files, including in subdirectories
  const vueFiles = globSync("**/*.vue", {
    cwd: pagesDir,
    ignore: BLACKLISTED_PAGES, // Use the configurable blacklist
  });

  Logger.info(
    `📊 Found ${vueFiles.length} Vue files (excluding blacklisted pages)`
  );

  // Track success and failure counts
  let vueSuccessCount = 0;
  let vueFailureCount = 0;
  let vueSkippedCount = 0;
  let duplicateCount = 0;

  // Special handling for index.vue (homepage)
  // Process it first to ensure it's properly indexed
  const indexFile = vueFiles.find((file) => file === "index.vue");
  if (indexFile) {
    Logger.info(`🏠 Special handling for homepage (index.vue)`);
    const normalizedPath = "/"; // Homepage is always the root path

    try {
      const filePath = path.join(pagesDir, indexFile);

      // Reset the processed components set for the homepage
      processedComponents.clear();

      // Read the file content
      const fileContent = fs.readFileSync(filePath, "utf8");

      // Check for explicitly imported components in the template
      const templateMatch = fileContent.match(
        /<template>([\s\S]*?)<\/template>/
      );
      if (templateMatch && templateMatch[1]) {
        const templateContent = templateMatch[1];

        // Look for components that might not be explicitly imported
        // Common components used in index.vue
        const commonComponents = [
          "HeroSection",
          "FeatureSection",
          "ImageWithSpinner",
          "ContentDisplay",
          "SimpleContentDisplay",
        ];

        Logger.info(`🔍 Scanning index.vue template for common components`);

        commonComponents.forEach((componentName) => {
          // Check if the component is used in the template
          const componentRegex = new RegExp(`<${componentName}[\\s>]`, "g");
          if (componentRegex.test(templateContent)) {
            Logger.info(
              `  Found component usage in index.vue: ${componentName}`
            );

            // Try to resolve the component path
            const projectRoot = path.resolve(__dirname, "..");
            const possiblePaths = [
              path.join(projectRoot, "components", `${componentName}.vue`),
              path.join(
                projectRoot,
                "components/content",
                `${componentName}.vue`
              ),
              path.join(
                projectRoot,
                "components/layout",
                `${componentName}.vue`
              ),
              path.join(projectRoot, "components/ui", `${componentName}.vue`),
            ];

            // Check each possible path
            for (const possiblePath of possiblePaths) {
              if (fs.existsSync(possiblePath)) {
                Logger.info(`  Resolved component path: ${possiblePath}`);
                // Add to processed components to ensure it's included
                processedComponents.add(possiblePath);
                break;
              }
            }
          }
        });
      }

      // Process the homepage and all its components recursively
      const result = processComponentRecursively(filePath);

      // Extract text, title, and description from the result
      const { text, title, description } = result;

      // Ensure the homepage has a title
      const pageTitle = title || "Home";

      // Create a description if none was extracted
      const pageDescription = description || text.substring(0, 160) + "...";

      // Add extra weight to the homepage content
      // This ensures the homepage content is prioritized in search results
      const enhancedText = `${text} ${text}`;

      Logger.info(
        `📝 Extracted ${text.length} characters of text from homepage and its components`
      );

      // Security check for dangerous content
      if (containsDangerousContent(enhancedText)) {
        Logger.warning(
          `⚠️ Potentially dangerous content detected in homepage, applying extra sanitization`
        );
      }

      // Create search item for homepage with sanitized content
      const searchItem = {
        title: sanitizeContentForIndexing(pageTitle),
        content: sanitizeContentForIndexing(enhancedText),
        path: normalizedPath,
        description: sanitizeContentForIndexing(pageDescription),
        type: "vue-page",
        sourceFile: indexFile,
      };

      // Add to search index
      searchIndexMap.set(normalizedPath, searchItem);

      Logger.success(`✓ Indexed homepage at path: ${normalizedPath}`);
      Logger.info(`Homepage title: "${pageTitle}"`);
      Logger.info(`Homepage text length: ${enhancedText.length} characters`);
      if (text.length > 100) {
        Logger.info(`Homepage text sample: "${text.substring(0, 100)}..."`);
      } else {
        Logger.info(`Homepage text: "${text}"`);
      }

      vueSuccessCount++;
    } catch (error) {
      Logger.error(`✗ Error processing homepage: ${error.message}`);
      vueFailureCount++;
    }
  }

  // Process other Vue files
  for (const file of vueFiles) {
    // Skip index.vue as we've already processed it
    if (file === "index.vue") {
      continue;
    }
    try {
      const filePath = path.join(pagesDir, file);

      // Reset the processed components set for each page
      processedComponents.clear();

      Logger.info(`🔍 Processing Vue page with components: ${file}`);

      // Process the page and all its components recursively
      const result = processComponentRecursively(filePath);

      // Extract text, title, and description from the result
      const { text, title, description } = result;

      // Determine the route path and normalize it
      let routePath = "/" + file.replace(/\.vue$/, "");
      const normalizedPath = normalizePath(routePath);

      // Skip if no meaningful text was extracted
      if (!text.trim()) {
        Logger.warning(
          `⚠️ Skipping ${file} - no meaningful text content found`
        );
        vueSkippedCount++;
        continue;
      }

      // Create a description if none was extracted
      const pageDescription = description || text.substring(0, 160) + "...";

      Logger.info(
        `📝 Extracted ${text.length} characters of text from ${file} and its components`
      );

      // Security check for dangerous content
      if (containsDangerousContent(text)) {
        Logger.warning(
          `⚠️ Potentially dangerous content detected in ${file}, applying extra sanitization`
        );
      }

      // Create search item with sanitized content
      const searchItem = {
        title: sanitizeContentForIndexing(title || "Untitled"),
        content: sanitizeContentForIndexing(text),
        path: normalizedPath,
        description: sanitizeContentForIndexing(pageDescription),
        // Add type field to identify content source
        type: "vue-page",
        // Add source file for debugging
        sourceFile: file,
      };

      // Check for duplicates and handle reconciliation
      if (searchIndexMap.has(normalizedPath)) {
        // A duplicate was found - merge content from both sources
        const existingItem = searchIndexMap.get(normalizedPath);
        duplicateCount++;
        Logger.warning(`⚠️ Duplicate found for path ${normalizedPath}:`);
        Logger.warning(
          `  Existing: ${existingItem.sourceFile} (${existingItem.type})`
        );
        Logger.warning(`  New: ${file} (vue-page)`);

        // Enhanced merge strategy:
        // - Always combine content from both sources
        // - Prioritize structured content (titles, descriptions) from Markdown
        // - Ensure all component content is included
        if (existingItem.type === "markdown") {
          // Create a merged item that combines both sources
          const mergedItem = {
            // Keep markdown title if it exists, otherwise use Vue title
            title: existingItem.title || searchItem.title,

            // Keep markdown description if it exists, otherwise use Vue description
            description: existingItem.description || searchItem.description,

            // Combine content from both sources, ensuring no duplication
            content: existingItem.content,

            // Keep the path and other metadata
            path: existingItem.path,
            frontmatter: existingItem.frontmatter,

            // Mark as a combined type
            type: "combined",

            // Keep track of source files for debugging
            sourceFile: `${existingItem.sourceFile} + ${file}`,
          };

          // Add Vue content if it's not already included in the markdown content
          // This ensures we don't duplicate content that might appear in both places
          if (searchItem.content) {
            // Check if the Vue content is substantially different
            const contentOverlap = calculateContentOverlap(
              existingItem.content,
              searchItem.content
            );

            if (contentOverlap < 0.5) {
              // Less than 50% overlap
              // Append the Vue content to the markdown content
              mergedItem.content += " " + searchItem.content;
              Logger.info(
                `  📊 Content overlap: ${Math.round(contentOverlap * 100)}% - Adding Vue content`
              );
            } else {
              Logger.warning(
                `  📊 Content overlap: ${Math.round(contentOverlap * 100)}% - Skipping duplicate content`
              );
            }
          }

          // Update the search index with the merged item
          searchIndexMap.set(normalizedPath, mergedItem);
          Logger.success(
            `  ✓ Resolution: Created combined entry with content from both sources`
          );
          vueSuccessCount++;
        } else {
          // Both are Vue pages, merge their content
          // This handles cases where multiple Vue components might contribute to the same route
          const mergedItem = {
            // Keep the title from the item with more content
            title:
              searchItem.content.length > existingItem.content.length
                ? searchItem.title
                : existingItem.title,

            // Keep the description from the item with more content
            description:
              searchItem.content.length > existingItem.content.length
                ? searchItem.description
                : existingItem.description,

            // Combine content from both Vue pages
            content: existingItem.content + " " + searchItem.content,

            // Keep the path
            path: existingItem.path,

            // Keep as vue-page type
            type: "vue-page",

            // Keep track of source files for debugging
            sourceFile: `${existingItem.sourceFile} + ${file}`,
          };

          // Update the search index with the merged item
          searchIndexMap.set(normalizedPath, mergedItem);
          Logger.success(`  ✓ Resolution: Merged content from both Vue pages`);
          vueSuccessCount++;
        }
      } else {
        // No duplicate, add to search index map
        searchIndexMap.set(normalizedPath, searchItem);
        Logger.success(`✓ Indexed Vue page: ${file} -> ${normalizedPath}`);
        vueSuccessCount++;
      }
    } catch (error) {
      Logger.error(`✗ Error processing Vue file ${file}:`, error);
      vueFailureCount++;
    }
  }

  Logger.info(
    `📊 Vue processing complete: ${vueSuccessCount} successful, ${vueFailureCount} failed, ${vueSkippedCount} skipped, ${duplicateCount} duplicates merged`
  );

  // Convert map to array for final output
  const searchIndex = Array.from(searchIndexMap.values());

  // Remove the sourceFile property from the final output
  searchIndex.forEach((item) => {
    delete item.sourceFile;
  });

  // Write the combined search index to a JSON file
  try {
    fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2));
    Logger.success(`✓ Search index written to ${outputFile}`);
  } catch (error) {
    Logger.error(`✗ Failed to write search index to ${outputFile}:`, error);
  }

  // Copy the configuration file to public directories for browser access
  try {
    // Ensure the public/config directory exists
    const publicConfigDir = path.join(__dirname, "../public/config");
    if (!fs.existsSync(publicConfigDir)) {
      fs.mkdirSync(publicConfigDir, { recursive: true });
    }

    // Copy the config file to public/config
    fs.copyFileSync(configPath, path.join(publicConfigDir, "fuse.config.json"));
    Logger.success(
      "✓ Configuration file copied to public/config/fuse.config.json"
    );

    // Copy the config file to public/data as a fallback
    fs.copyFileSync(configPath, path.join(outputDir, "fuse.config.json"));
    Logger.success(
      "✓ Configuration file copied to public/data/fuse.config.json"
    );
  } catch (error) {
    Logger.error("✗ Error copying configuration files:", error);
  }

  // Print summary statistics
  const totalItems = searchIndex.length;
  const typeBreakdown = searchIndex.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  Logger.info("\n📊 Search Index Generation Summary:");
  Logger.info(`📝 Total items indexed: ${totalItems}`);

  // Display breakdown by type
  Object.entries(typeBreakdown).forEach(([type, count]) => {
    Logger.info(`   - ${type}: ${count} items`);
  });

  // Display processing statistics
  Logger.info(`📝 Processing statistics:`);
  Logger.info(
    `   - Markdown files: ${markdownSuccessCount} successful, ${markdownFailureCount} failed`
  );
  Logger.info(
    `   - Vue files: ${vueSuccessCount} successful, ${vueFailureCount} failed, ${vueSkippedCount} skipped`
  );
  Logger.info(`   - Duplicates merged: ${duplicateCount}`);

  Logger.success(`\n✅ Search index generation completed successfully!`);
}

// Parse command-line arguments
const args = process.argv.slice(2);
const options = {};

// Check for --log-level argument
const logLevelIndex = args.indexOf("--log-level");
if (logLevelIndex !== -1 && args.length > logLevelIndex + 1) {
  options.logLevel = args[logLevelIndex + 1].toUpperCase();
}

// Display usage information if --help is provided
if (args.includes("--help")) {
  console.log(`
Search Index Generator

Usage:
  node scripts/generate-search-index.js [options]

Options:
  --log-level LEVEL   Set the logging level (DETAILED, NORMAL, CONCISE)
                      DETAILED: Show all messages
                      NORMAL: Show success, error, warning, and important info messages (default)
                      CONCISE: Show only success and error messages
  --help              Display this help message

Examples:
  node scripts/generate-search-index.js
  node scripts/generate-search-index.js --log-level DETAILED
  node scripts/generate-search-index.js --log-level CONCISE
  `);
  process.exit(0);
}

// Run the generator with options
generateSearchIndex(options).catch((error) => {
  Logger.error("❌ Fatal error generating search index:", error);
  process.exit(1);
});
