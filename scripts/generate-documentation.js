#!/usr/bin/env node

/**
 * Documentation Generation Script
 *
 * This script generates comprehensive documentation for the Illinois Violent Prevention Project:
 * 1. Converts project-documentation.md to HTML with light/dark theme support
 * 2. Generates JSDoc API documentation using clean-jsdoc-theme
 * 3. Generates Vue component documentation using vue-component-meta
 * 4. Creates a modern documentation portal with navigation
 *
 * Features:
 * - Automatic integration with build pipeline
 * - Dark mode as default (matching project preferences)
 * - WCAG 2.1 AA accessibility compliance
 * - Responsive design compatible with project's Vuetify theme
 * - Unified logging system integration
 * - Error handling with detailed feedback
 *
 * Output Structure:
 * /public/documentation/
 * ├── index.html (portal page)
 * ├── dev/
 * │   └── index.html (project documentation)
 * ├── jsdoc/
 * │   └── [JSDoc generated files]
 * └── components/
 *     └── [Vue component documentation]
 *
 * @module GenerateDocumentation
 * @version 1.0.0
 * @author Violence Prevention Plan for Illinois: 2025-2029
 *
 * @example
 * // Run manually:
 * node scripts/generate-documentation.js
 *
 * @example
 * // Run via yarn:
 * yarn create:docs
 *
 * @example
 * // Run with verbose logging:
 * yarn create:docs --verbose
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { marked } from "marked";
import { createChecker } from "vue-component-meta";
import { loadSiteConfigSync } from "../app/utils/config-loader.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * Parse command line arguments for logging configuration
 *
 * @returns {Object} Configuration object with logging settings
 * @returns {string} returns.logLevel - Logging level (Concise, Standard, Detailed)
 * @returns {boolean} returns.verbose - Whether to use verbose logging
 * @returns {boolean} returns.quiet - Whether to use quiet logging
 */
const parseArgs = () => {
  const args = process.argv.slice(2);
  const config = {
    logLevel: "Standard",
    verbose: false,
    quiet: false,
  };

  if (args.includes("--verbose")) {
    config.logLevel = "Detailed";
    config.verbose = true;
  } else if (args.includes("--quiet")) {
    config.logLevel = "Concise";
    config.quiet = true;
  } else if (args.includes("--log-level")) {
    const levelIndex = args.indexOf("--log-level");
    if (levelIndex !== -1 && args[levelIndex + 1]) {
      config.logLevel = args[levelIndex + 1];
    }
  }

  return config;
};

/**
 * Unified logging function that respects project logging standards
 *
 * @param {string} level - Log level (INFO, SUCCESS, WARNING, ERROR)
 * @param {string} message - Message to log
 * @param {Object} config - Logging configuration
 * @param {Object} [details] - Additional details for verbose logging
 */
const log = (level, message, config, details = null) => {
  if (config.quiet && level !== "ERROR") return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [DOCS-GEN] [${level}]`;

  console.log(`${prefix} ${message}`);

  if (config.verbose && details) {
    console.log(`${prefix} Details:`, details);
  }
};

/**
 * Ensure directory exists, create if it doesn't
 *
 * @param {string} dirPath - Directory path to ensure
 * @param {Object} config - Logging configuration
 */
const ensureDirectory = (dirPath, config) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log("INFO", `Created directory: ${dirPath}`, config);
  }
};

/**
 * Get current date in Chicago timezone
 *
 * @returns {string} Current date in YYYY-MM-DD format
 */
const getCurrentDate = () => {
  const now = new Date();
  const chicagoTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
  return chicagoTime.toISOString().split("T")[0];
};

/**
 * Get current date formatted for display in Chicago timezone
 *
 * @returns {string} Current date in "Month DD, YYYY" format
 */
const getCurrentDateFormatted = () => {
  const now = new Date();
  const chicagoTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
  return chicagoTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};

/**
 * Generate the documentation portal HTML
 *
 * @param {Object} config - Logging configuration
 * @returns {string} HTML content for the portal page
 */
const generatePortalHTML = (config) => {
  log("INFO", "Generating documentation portal HTML...", config);

  const currentDate = getCurrentDateFormatted();

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation Portal - Violence Prevention Plan for Illinois: 2025-2029</title>
    <meta name="description" content="Comprehensive documentation portal for the Illinois Violence Prevention Plan project, including project documentation and API reference.">
    <meta name="author" content="Illinois Criminal Justice Information Authority">
    
    <!-- Theme and Accessibility -->
    <meta name="color-scheme" content="dark light">
    <meta name="theme-color" content="#1A2234" media="(prefers-color-scheme: dark)">
    <meta name="theme-color" content="#F2F2F2" media="(prefers-color-scheme: light)">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Material Design Icons -->
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css" rel="stylesheet">
    
    <style>
        /* CSS Variables for Theme System */
        :root {
            --primary-color: #1976D2;
            --primary-dark: #1565C0;
            --secondary-color: #424242;
            --accent-color: #FF5722;
            
            /* Light Theme */
            --bg-primary: #FFFFFF;
            --bg-secondary: #F5F5F5;
            --bg-card: #FFFFFF;
            --text-primary: #212121;
            --text-secondary: #757575;
            --border-color: #E0E0E0;
            --shadow: 0 2px 4px rgba(0,0,0,0.1);
            --shadow-hover: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        /* Dark Theme (Default) */
        @media (prefers-color-scheme: dark) {
            :root {
                --bg-primary: #121212;
                --bg-secondary: #1E1E1E;
                --bg-card: #2D2D2D;
                --text-primary: #FFFFFF;
                --text-secondary: #B0B0B0;
                --border-color: #404040;
                --shadow: 0 2px 4px rgba(0,0,0,0.3);
                --shadow-hover: 0 4px 8px rgba(0,0,0,0.4);
            }
        }
        
        /* Force Dark Theme */
        [data-theme="dark"] {
            --bg-primary: #121212;
            --bg-secondary: #1E1E1E;
            --bg-card: #2D2D2D;
            --text-primary: #FFFFFF;
            --text-secondary: #B0B0B0;
            --border-color: #404040;
            --shadow: 0 2px 4px rgba(0,0,0,0.3);
            --shadow-hover: 0 4px 8px rgba(0,0,0,0.4);
        }
        
        /* Force Light Theme */
        [data-theme="light"] {
            --bg-primary: #FFFFFF;
            --bg-secondary: #F5F5F5;
            --bg-card: #FFFFFF;
            --text-primary: #212121;
            --text-secondary: #757575;
            --border-color: #E0E0E0;
            --shadow: 0 2px 4px rgba(0,0,0,0.1);
            --shadow-hover: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        /* Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        /* Container and Layout */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        /* Header */
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid var(--border-color);
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--primary-color);
        }
        
        .header p {
            font-size: 1.1rem;
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* Theme Toggle */
        .theme-toggle {
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: var(--bg-card);
            border: 2px solid var(--border-color);
            border-radius: 50px;
            padding: 0.5rem 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            color: var(--text-primary);
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .theme-toggle:hover {
            background: var(--bg-secondary);
            box-shadow: var(--shadow-hover);
        }
        
        .theme-toggle:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        
        /* Documentation Cards */
        .docs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .doc-card {
            background: var(--bg-card);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
            box-shadow: var(--shadow);
            position: relative;
            overflow: hidden;
        }
        
        .doc-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-hover);
            border-color: var(--primary-color);
        }
        
        .doc-card:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        
        .doc-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        
        .doc-card:hover::before {
            transform: scaleX(1);
        }
        
        .doc-icon {
            font-size: 3rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        .doc-card h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .doc-card p {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }
        
        .doc-card .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--primary-color);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s ease;
        }
        
        .doc-card .btn:hover {
            background: var(--primary-dark);
        }
        
        /* Footer */
        .footer {
            margin-top: auto;
            text-align: center;
            padding-top: 2rem;
            border-top: 2px solid var(--border-color);
            color: var(--text-secondary);
        }
        
        .footer p {
            margin-bottom: 0.5rem;
        }
        
        .footer a {
            color: var(--primary-color);
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .docs-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            
            .doc-card {
                padding: 1.5rem;
            }
            
            .theme-toggle {
                position: static;
                margin: 0 auto 2rem;
                width: fit-content;
            }
        }
        
        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        /* High Contrast Support */
        @media (prefers-contrast: high) {
            :root {
                --border-color: #000000;
                --shadow: 0 2px 4px rgba(0,0,0,0.5);
            }
            
            [data-theme="dark"] {
                --border-color: #FFFFFF;
            }
        }
    </style>
</head>
<body data-theme="dark">
    <div class="container">
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle between light and dark theme">
            <i class="mdi mdi-theme-light-dark" aria-hidden="true"></i>
            <span id="theme-text">Light Mode</span>
        </button>
        
        <header class="header">
            <h1>Documentation Portal</h1>
            <p>Comprehensive documentation for the Illinois Violence Prevention Plan: 2025-2029 project, including project guides and API reference documentation.</p>
        </header>
        
        <main class="docs-grid">
            <a href="/documentation/dev/" class="doc-card" aria-describedby="project-docs-desc">
                <div class="doc-icon">
                    <i class="mdi mdi-book-open-page-variant" aria-hidden="true"></i>
                </div>
                <h2>Project Documentation</h2>
                <p id="project-docs-desc">Complete project documentation including development guidelines, architecture overview, and implementation details for the Violence Prevention Plan.</p>
                <span class="btn">
                    <i class="mdi mdi-arrow-right" aria-hidden="true"></i>
                    View Documentation
                </span>
            </a>

            <a href="/documentation/audit-log/" class="doc-card" aria-describedby="audit-log-desc">
                <div class="doc-icon">
                    <i class="mdi mdi-history" aria-hidden="true"></i>
                </div>
                <h2>Audit Log</h2>
                <p id="audit-log-desc">Chronological record of all significant changes made to the project, providing transparency and accountability for external reviewers and future developers.</p>
                <span class="btn">
                    <i class="mdi mdi-arrow-right" aria-hidden="true"></i>
                    View Audit Log
                </span>
            </a>

            <a href="/documentation/jsdoc/" class="doc-card" aria-describedby="api-docs-desc">
                <div class="doc-icon">
                    <i class="mdi mdi-code-braces" aria-hidden="true"></i>
                </div>
                <h2>API Documentation</h2>
                <p id="api-docs-desc">Comprehensive JSDoc API reference for all functions, composables, utilities, and scripts in the codebase with detailed examples and usage information.</p>
                <span class="btn">
                    <i class="mdi mdi-arrow-right" aria-hidden="true"></i>
                    View API Reference
                </span>
            </a>

            <a href="/documentation/components/" class="doc-card" aria-describedby="components-docs-desc">
                <div class="doc-icon">
                    <i class="mdi mdi-view-dashboard" aria-hidden="true"></i>
                </div>
                <h2>Vue Components</h2>
                <p id="components-docs-desc">Complete documentation for all Vue 3 components including props, events, slots, and usage examples extracted from component source code.</p>
                <span class="btn">
                    <i class="mdi mdi-arrow-right" aria-hidden="true"></i>
                    View Components
                </span>
            </a>
        </main>
        
        <footer class="footer">
            <p><strong>Violence Prevention Plan for Illinois: 2025-2029</strong></p>
            <p>Illinois Criminal Justice Information Authority</p>
            <p>60 E Van Buren St, Chicago, IL 60605</p>
            <p>Documentation generated on ${currentDate}</p>
            <p><a href="https://github.com/ICJIA/icjia-vpp-2025" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
        </footer>
    </div>
    
    <script>
        // Theme Management
        function getPreferredTheme() {
            const stored = localStorage.getItem('documentation-theme');
            if (stored) return stored;
            
            // Default to dark mode as per project preferences
            return 'dark';
        }
        
        function setTheme(theme) {
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('documentation-theme', theme);
            
            const themeText = document.getElementById('theme-text');
            if (themeText) {
                themeText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
            }
        }
        
        function toggleTheme() {
            const current = document.body.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        }
        
        // Initialize theme on page load
        document.addEventListener('DOMContentLoaded', function() {
            setTheme(getPreferredTheme());
        });
        
        // Keyboard navigation support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target.classList.contains('doc-card')) {
                    e.preventDefault();
                    e.target.click();
                }
            }
        });
    </script>
</body>
</html>`;
};

/**
 * Convert project documentation markdown to HTML
 *
 * @param {Object} config - Logging configuration
 * @returns {Promise<void>}
 * @throws {Error} If markdown conversion fails
 */
const generateProjectDocumentation = async (config) => {
  log("INFO", "Converting project documentation to HTML...", config);

  const markdownPath = path.join(projectRoot, "project-documentation.md");
  const outputPath = path.join(
    projectRoot,
    "public",
    "documentation",
    "dev",
    "index.html"
  );

  if (!fs.existsSync(markdownPath)) {
    log(
      "WARNING",
      "project-documentation.md not found, skipping project docs generation",
      config
    );
    return;
  }

  const markdownContent = fs.readFileSync(markdownPath, "utf-8");
  const htmlContent = marked(markdownContent);
  const currentDate = getCurrentDateFormatted();





/**

 * Generate JSDoc configuration file

/**
 * Generate JSDoc configuration file
 *
 * @param {Object} config - Logging configuration
 * @returns {string} Path to the generated JSDoc configuration file
 */
const generateJSDocConfig = (config) => {
  log("INFO", "Generating JSDoc configuration...", config);

  const jsdocConfig = {
    source: {
      include: [
        "./composables/",
        "./utils/",
        "./plugins/",
        "./scripts/",

        "./README.md",
      ],
      includePattern: "\\.js$",
      exclude: [
        "./node_modules/",
        "./.nuxt/",
        "./.output/",
        "./dist/",
        "./coverage/",
      ],
    },
    plugins: ["plugins/markdown"],
    opts: {
      destination: "./public/documentation/jsdoc/",
      recurse: true,
      readme: "./README.md",
      template: "node_modules/clean-jsdoc-theme",
      theme_opts: {
        default_theme: "fallback-dark",
        homepageTitle: "Violence Prevention Plan API Documentation",
        title: "VPP API Docs",
        favicon: "/favicon.ico",
        base_url: "/documentation/jsdoc/",
        meta: [
          {
            name: "description",
            content:
              "Comprehensive API documentation for the Illinois Violence Prevention Plan: 2025-2029 project",
          },
          {
            name: "author",
            content: "Illinois Criminal Justice Information Authority",
          },
        ],
        search: true,
        menu: [
          {
            title: "Documentation Portal",
            link: "/documentation/",
            target: "_self",
          },
          {
            title: "Project Documentation",
            link: "/documentation/dev/",
            target: "_self",
          },
          {
            title: "GitHub Repository",
            link: "https://github.com/ICJIA/icjia-vpp-2025",
            target: "_blank",
          },
        ],
        footer:
          "Illinois Criminal Justice Information Authority | 60 E Van Buren St, Chicago, IL 60605",
        displayModuleHeader: true,
        includeFilesListInHomepage: true,
        create_style: `
          /* Force dark mode initialization */
          :root {
            --primary-color: #1976d2;
            --background-color: #121212;
            --text-color: #ffffff;
          }

          /* Ensure dark theme is applied immediately */
          body {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
          }

          /* Dark theme class application */
          .dark-theme,
          [data-theme="dark"] {
            --primary-color: #1976d2;
            --background-color: #121212;
            --text-color: #ffffff;
          }
        `,
        add_scripts: `
          // Force dark mode initialization on page load
          (function() {
            // Set dark theme immediately
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-theme');

            // Override any theme detection
            if (typeof window !== 'undefined') {
              localStorage.setItem('theme', 'dark');
              localStorage.setItem('clean-jsdoc-theme', 'dark');
            }

            // Ensure theme is applied after DOM is ready
            document.addEventListener('DOMContentLoaded', function() {
              document.documentElement.setAttribute('data-theme', 'dark');
              document.body.classList.add('dark-theme');

              // Find and trigger any theme switcher to dark mode
              const themeToggle = document.querySelector('[data-theme-toggle]') ||
                                 document.querySelector('.theme-toggle') ||
                                 document.querySelector('#theme-toggle');
              if (themeToggle && themeToggle.textContent !== 'dark') {
                themeToggle.click();
              }
            });
          })();
        `,
      },
    },
    templates: {
      cleverLinks: false,
      monospaceLinks: false,
    },
    markdown: {
      hardwrap: false,
      idInHeadings: true,
    },
  };

  const configPath = path.join(projectRoot, "jsdoc.config.json");
  fs.writeFileSync(configPath, JSON.stringify(jsdocConfig, null, 2));
  log("SUCCESS", "JSDoc configuration generated", config);

  return configPath;
};

/**
 * Generate JSDoc API documentation
 *
 * @param {Object} config - Logging configuration
 * @returns {Promise<void>}
 * @throws {Error} If JSDoc generation fails
 */
const generateJSDocDocumentation = async (config) => {
  log("INFO", "Generating JSDoc API documentation...", config);

  try {
    const configPath = generateJSDocConfig(config);
    // Use relative path to avoid hardcoded absolute paths in output
    const relativeConfigPath = path.relative(projectRoot, configPath);
    const jsdocCommand = `npx jsdoc -c "${relativeConfigPath}"`;

    log("INFO", `Running JSDoc command: ${jsdocCommand}`, config);

    const output = execSync(jsdocCommand, {
      cwd: projectRoot,
      encoding: "utf-8",
      stdio: config.verbose ? "inherit" : "pipe",
    });

    if (config.verbose && output) {
      log("INFO", "JSDoc output:", config, output);
    }

    // Clean up config file
    fs.unlinkSync(configPath);

    // Clean up files with invalid characters for Netlify deployment
    cleanupInvalidFilenames(config);

    log("SUCCESS", "JSDoc API documentation generated successfully", config);
  } catch (error) {
    log("ERROR", `JSDoc generation failed: ${error.message}`, config, error);
    throw error;
  }
};

/**
 * Clean up files with invalid characters for Netlify deployment
 * Removes files with # or ? characters in filenames
 *
 * @param {Object} config - Logging configuration
 */
const cleanupInvalidFilenames = (config) => {
  log(
    "INFO",
    "Cleaning up files with invalid characters for Netlify...",
    config
  );

  const jsdocDir = path.join(projectRoot, "public", "documentation", "jsdoc");

  try {
    const files = fs.readdirSync(jsdocDir, { recursive: true });
    let removedCount = 0;

    for (const file of files) {
      if (
        typeof file === "string" &&
        (file.includes("#") || file.includes("?"))
      ) {
        const fullPath = path.join(jsdocDir, file);
        try {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            removedCount++;
            log("INFO", `Removed invalid filename: ${file}`, config);
          }
        } catch (error) {
          log(
            "WARN",
            `Failed to remove file ${file}: ${error.message}`,
            config
          );
        }
      }
    }

    log(
      "SUCCESS",
      `Cleaned up ${removedCount} files with invalid characters`,
      config
    );
  } catch (error) {
    log(
      "WARN",
      `Failed to clean up invalid filenames: ${error.message}`,
      config
    );
  }
};

/**
 * Generate Vue component documentation using vue-component-meta
 *
 * @param {Object} config - Logging configuration
 * @returns {Promise<void>}
 * @throws {Error} If Vue component documentation generation fails
 */
const generateVueComponentDocumentation = async (config) => {
  log("INFO", "Generating Vue component documentation...", config);

  try {
    // Create TypeScript checker for Vue components
    const checker = createChecker(
      // Use the project's tsconfig.json or create a minimal one for Vue components
      path.join(projectRoot, "tsconfig.json"),
      {
        forceUseTs: true,
        schema: { ignore: [] },
        printer: { newLine: 1 },
      }
    );

    // Find all Vue components
    const componentsDir = path.join(projectRoot, "components");
    const pagesDir = path.join(projectRoot, "pages");

    const vueFiles = [];

    // Recursively find Vue files in components directory
    if (fs.existsSync(componentsDir)) {
      const findVueFiles = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            findVueFiles(filePath);
          } else if (file.endsWith(".vue")) {
            vueFiles.push(filePath);
          }
        }
      };
      findVueFiles(componentsDir);
    }

    // Find Vue files in pages directory
    if (fs.existsSync(pagesDir)) {
      const findVueFiles = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            findVueFiles(filePath);
          } else if (file.endsWith(".vue")) {
            vueFiles.push(filePath);
          }
        }
      };
      findVueFiles(pagesDir);
    }

    log("INFO", `Found ${vueFiles.length} Vue components to document`, config);

    // Generate documentation for each component
    const componentDocs = [];
    for (const filePath of vueFiles) {
      try {
        const meta = checker.getComponentMeta(filePath);
        const relativePath = path.relative(projectRoot, filePath);

        componentDocs.push({
          filePath: relativePath,
          name: path.basename(filePath, ".vue"),
          meta: meta,
        });

        if (config.verbose) {
          log("INFO", `Processed component: ${relativePath}`, config);
        }
      } catch (error) {
        log(
          "WARNING",
          `Failed to process component ${filePath}: ${error.message}`,
          config
        );
      }
    }

    // Generate HTML documentation
    const componentDocsDir = path.join(
      projectRoot,
      "public",
      "documentation",
      "components"
    );
    ensureDirectory(componentDocsDir, config);

    // Generate individual component pages
    for (const doc of componentDocs) {
      const componentHTML = generateComponentHTML(doc, config);
      // Avoid overwriting index.html by using a different name for index page component
      const fileName =
        doc.name === "index" ? "page-index.html" : `${doc.name}.html`;
      fs.writeFileSync(path.join(componentDocsDir, fileName), componentHTML);
    }

    // Generate index page for components (after individual pages to avoid overwriting)
    const indexHTML = generateComponentIndexHTML(componentDocs, config);
    fs.writeFileSync(path.join(componentDocsDir, "index.html"), indexHTML);

    log(
      "SUCCESS",
      `Vue component documentation generated for ${componentDocs.length} components`,
      config
    );
  } catch (error) {
    log(
      "ERROR",
      `Vue component documentation generation failed: ${error.message}`,
      config,
      error
    );
    throw error;
  }
};

/**
 * Generate HTML for component index page
 *
 * @param {Array} componentDocs - Array of component documentation objects
 * @param {Object} config - Logging configuration
 * @returns {string} HTML content for the component index page
 */
const generateComponentIndexHTML = (componentDocs, config) => {
  const componentsList = componentDocs
    .map((doc) => {
      const propsCount = doc.meta.props?.length || 0;
      const eventsCount = doc.meta.events?.length || 0;
      const slotsCount = doc.meta.slots?.length || 0;

      // Use correct filename for index page component
      const fileName =
        doc.name === "index" ? "page-index.html" : `${doc.name}.html`;

      return `
        <div class="component-card">
          <h3><a href="${fileName}">${doc.name}</a></h3>
          <p class="component-path">${doc.filePath}</p>
          <div class="component-stats">
            <span class="stat">Props: ${propsCount}</span>
            <span class="stat">Events: ${eventsCount}</span>
            <span class="stat">Slots: ${slotsCount}</span>
          </div>
        </div>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Vue Components - Violence Prevention Plan API Documentation</title>
  <meta name="description" content="Vue component documentation for the Illinois Violence Prevention Plan: 2025-2029 project">
  <meta name="author" content="Illinois Criminal Justice Information Authority">
  <link rel="icon" href="/favicon.ico">
  <style>
    :root {
      --primary-color: #1976d2;
      --background-color: #121212;
      --surface-color: #1e1e1e;
      --text-color: #ffffff;
      --text-secondary: #b0b0b0;
      --border-color: #333;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--background-color);
      color: var(--text-color);
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: var(--primary-color);
      margin-bottom: 1rem;
      font-size: 2.5rem;
    }

    .nav-links {
      margin-bottom: 2rem;
      padding: 1rem;
      background: var(--surface-color);
      border-radius: 8px;
    }

    .nav-links a {
      color: var(--primary-color);
      text-decoration: none;
      margin-right: 1rem;
    }

    .nav-links a:hover {
      text-decoration: underline;
    }

    .components-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .component-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
      transition: transform 0.2s ease;
    }

    .component-card:hover {
      transform: translateY(-2px);
      border-color: var(--primary-color);
    }

    .component-card h3 {
      margin-bottom: 0.5rem;
    }

    .component-card h3 a {
      color: var(--text-color);
      text-decoration: none;
    }

    .component-card h3 a:hover {
      color: var(--primary-color);
    }

    .component-path {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 1rem;
      font-family: monospace;
    }

    .component-stats {
      display: flex;
      gap: 1rem;
    }

    .stat {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Vue Components</h1>

    <div class="nav-links">
      <a href="../">← Documentation Portal</a>
      <a href="../jsdoc/">JSDoc API</a>
      <a href="../dev/">Project Documentation</a>
    </div>

    <p>This page contains documentation for all Vue components in the Violence Prevention Plan project. Components are documented using vue-component-meta to extract props, events, and slots information.</p>

    <div class="components-grid">
      ${componentsList}
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate HTML for individual component page
 *
 * @param {Object} doc - Component documentation object
 * @param {Object} config - Logging configuration
 * @returns {string} HTML content for the component page
 */
const generateComponentHTML = (doc, config) => {
  const { name, filePath, meta } = doc;

  // Generate props documentation
  const propsHTML =
    meta.props && meta.props.length > 0
      ? `
      <section class="section">
        <h2>Props</h2>
        <div class="props-table">
          ${meta.props
            .map(
              (prop) => `
            <div class="prop-item">
              <div class="prop-header">
                <h3 class="prop-name">${prop.name}</h3>
                <span class="prop-type">${prop.type || "any"}</span>
                ${prop.required ? '<span class="prop-required">required</span>' : ""}
              </div>
              ${prop.description ? `<p class="prop-description">${prop.description}</p>` : ""}
              ${prop.default !== undefined ? `<p class="prop-default"><strong>Default:</strong> <code>${JSON.stringify(prop.default)}</code></p>` : ""}
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `
      : "";

  // Generate events documentation
  const eventsHTML =
    meta.events && meta.events.length > 0
      ? `
      <section class="section">
        <h2>Events</h2>
        <div class="events-table">
          ${meta.events
            .map(
              (event) => `
            <div class="event-item">
              <div class="event-header">
                <h3 class="event-name">${event.name}</h3>
                <span class="event-type">${event.type || "any"}</span>
              </div>
              ${event.description ? `<p class="event-description">${event.description}</p>` : ""}
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `
      : "";

  // Generate slots documentation
  const slotsHTML =
    meta.slots && meta.slots.length > 0
      ? `
      <section class="section">
        <h2>Slots</h2>
        <div class="slots-table">
          ${meta.slots
            .map(
              (slot) => `
            <div class="slot-item">
              <div class="slot-header">
                <h3 class="slot-name">${slot.name}</h3>
              </div>
              ${slot.description ? `<p class="slot-description">${slot.description}</p>` : ""}
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `
      : "";

  return `
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${name} - Vue Components Documentation</title>
  <meta name="description" content="Documentation for ${name} Vue component">
  <meta name="author" content="Illinois Criminal Justice Information Authority">
  <link rel="icon" href="/favicon.ico">
  <style>
    :root {
      --primary-color: #1976d2;
      --background-color: #121212;
      --surface-color: #1e1e1e;
      --text-color: #ffffff;
      --text-secondary: #b0b0b0;
      --border-color: #333;
      --success-color: #4caf50;
      --warning-color: #ff9800;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--background-color);
      color: var(--text-color);
      line-height: 1.6;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }

    .component-path {
      color: var(--text-secondary);
      font-family: monospace;
      margin-bottom: 2rem;
    }

    .nav-links {
      margin-bottom: 2rem;
      padding: 1rem;
      background: var(--surface-color);
      border-radius: 8px;
    }

    .nav-links a {
      color: var(--primary-color);
      text-decoration: none;
      margin-right: 1rem;
    }

    .nav-links a:hover {
      text-decoration: underline;
    }

    .section {
      margin-bottom: 3rem;
    }

    .section h2 {
      color: var(--primary-color);
      margin-bottom: 1rem;
      font-size: 1.8rem;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0.5rem;
    }

    .prop-item, .event-item, .slot-item {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    .prop-header, .event-header, .slot-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .prop-name, .event-name, .slot-name {
      color: var(--text-color);
      font-size: 1.2rem;
      font-family: monospace;
    }

    .prop-type, .event-type {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-family: monospace;
    }

    .prop-required {
      background: var(--warning-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    .prop-description, .event-description, .slot-description {
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .prop-default {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .prop-default code {
      background: var(--background-color);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${name}</h1>
    <p class="component-path">${filePath}</p>

    <div class="nav-links">
      <a href="index.html">← All Components</a>
      <a href="../">Documentation Portal</a>
      <a href="../jsdoc/">JSDoc API</a>
    </div>

    ${propsHTML}
    ${eventsHTML}
    ${slotsHTML}

    ${!propsHTML && !eventsHTML && !slotsHTML ? "<p>No props, events, or slots documented for this component.</p>" : ""}
  </div>
</body>
</html>
  `;
};

/**
 * Main function to generate all documentation
 *
 * @async
 * @function generateDocumentation
 * @returns {Promise<void>}
 * @throws {Error} If documentation generation fails
 */
async function generateDocumentation() {
  const config = parseArgs();

  try {
    log("INFO", "Starting documentation generation...", config);

    // Load site configuration
    const siteConfig = loadSiteConfigSync();
    log("INFO", "Loaded site configuration", config, siteConfig.metadata);

    // Ensure output directories exist
    const docsDir = path.join(projectRoot, "public", "documentation");
    const devDocsDir = path.join(docsDir, "dev");
    const jsdocDir = path.join(docsDir, "jsdoc");
    const componentsDir = path.join(docsDir, "components");

    ensureDirectory(docsDir, config);
    ensureDirectory(devDocsDir, config);
    ensureDirectory(jsdocDir, config);
    ensureDirectory(componentsDir, config);

    // Generate documentation portal
    log("INFO", "Generating documentation portal...", config);
    const portalHTML = generatePortalHTML(config);
    fs.writeFileSync(path.join(docsDir, "index.html"), portalHTML);
    log("SUCCESS", "Documentation portal generated successfully", config);

    // Generate project documentation
    await generateProjectDocumentation(config);

    // Generate JSDoc API documentation
    await generateJSDocDocumentation(config);

    // Generate Vue component documentation
    await generateVueComponentDocumentation(config);

    log("SUCCESS", "Documentation generation completed successfully!", config, {
      portalPath: "/documentation/",
      projectDocsPath: "/documentation/dev/",
      apiDocsPath: "/documentation/jsdoc/",
      componentsPath: "/documentation/components/",
    });
  } catch (error) {
    log(
      "ERROR",
      `Documentation generation failed: ${error.message}`,
      config,
      error
    );
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDocumentation();
}
