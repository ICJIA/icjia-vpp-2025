#!/usr/bin/env node

/**
 * Documentation Generation Script
 *
 * This script generates comprehensive documentation for the Illinois Violent Prevention Project:
 * 1. Converts project-documentation.md to HTML with light/dark theme support
 * 2. Generates JSDoc API documentation using clean-jsdoc-theme
 * 3. Creates a modern documentation portal with navigation
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
 * └── jsdoc/
 *     └── [JSDoc generated files]
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
import { loadSiteConfigSync } from "../utils/config-loader.js";

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
            
            <a href="/documentation/jsdoc/" class="doc-card" aria-describedby="api-docs-desc">
                <div class="doc-icon">
                    <i class="mdi mdi-code-braces" aria-hidden="true"></i>
                </div>
                <h2>API Documentation</h2>
                <p id="api-docs-desc">Comprehensive JSDoc API reference for all functions, composables, utilities, and components in the codebase with detailed examples and usage information.</p>
                <span class="btn">
                    <i class="mdi mdi-arrow-right" aria-hidden="true"></i>
                    View API Reference
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

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Documentation - Violence Prevention Plan for Illinois: 2025-2029</title>
    <meta name="description" content="Comprehensive project documentation for the Illinois Violence Prevention Plan development.">
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    <!-- Material Design Icons -->
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css" rel="stylesheet">

    <!-- Syntax Highlighting -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">

    <style>
        /* CSS Variables for Theme System */
        :root {
            --primary-color: #1976D2;
            --primary-dark: #1565C0;
            --secondary-color: #424242;
            --accent-color: #FF5722;

            /* Light Theme */
            --bg-primary: #FFFFFF;
            --bg-secondary: #F8F9FA;
            --bg-card: #FFFFFF;
            --bg-code: #F5F5F5;
            --text-primary: #212121;
            --text-secondary: #757575;
            --text-code: #333333;
            --border-color: #E0E0E0;
            --shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Dark Theme (Default) */
        @media (prefers-color-scheme: dark) {
            :root {
                --bg-primary: #121212;
                --bg-secondary: #1E1E1E;
                --bg-card: #2D2D2D;
                --bg-code: #1E1E1E;
                --text-primary: #FFFFFF;
                --text-secondary: #B0B0B0;
                --text-code: #E0E0E0;
                --border-color: #404040;
                --shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
        }

        /* Force Dark Theme */
        [data-theme="dark"] {
            --bg-primary: #121212;
            --bg-secondary: #1E1E1E;
            --bg-card: #2D2D2D;
            --bg-code: #1E1E1E;
            --text-primary: #FFFFFF;
            --text-secondary: #B0B0B0;
            --text-code: #E0E0E0;
            --border-color: #404040;
            --shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        /* Force Light Theme */
        [data-theme="light"] {
            --bg-primary: #FFFFFF;
            --bg-secondary: #F8F9FA;
            --bg-card: #FFFFFF;
            --bg-code: #F5F5F5;
            --text-primary: #212121;
            --text-secondary: #757575;
            --text-code: #333333;
            --border-color: #E0E0E0;
            --shadow: 0 2px 4px rgba(0,0,0,0.1);
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
        }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--border-color);
        }

        .header h1 {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
        }

        .nav-links {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .nav-links a {
            color: var(--text-secondary);
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .nav-links a:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }

        /* Theme Toggle */
        .theme-toggle {
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
        }

        .theme-toggle:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }

        /* Content Styles */
        .content {
            background: var(--bg-card);
            border-radius: 12px;
            padding: 2rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border-color);
        }

        .content h1, .content h2, .content h3, .content h4, .content h5, .content h6 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }

        .content h1:first-child {
            margin-top: 0;
        }

        .content h1 { font-size: 2.5rem; font-weight: 700; }
        .content h2 { font-size: 2rem; font-weight: 600; }
        .content h3 { font-size: 1.5rem; font-weight: 600; }
        .content h4 { font-size: 1.25rem; font-weight: 500; }
        .content h5 { font-size: 1.1rem; font-weight: 500; }
        .content h6 { font-size: 1rem; font-weight: 500; }

        .content p {
            margin-bottom: 1rem;
            color: var(--text-primary);
        }

        .content ul, .content ol {
            margin-bottom: 1rem;
            padding-left: 2rem;
        }

        .content li {
            margin-bottom: 0.5rem;
        }

        .content a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
        }

        .content a:hover {
            text-decoration: underline;
        }

        .content blockquote {
            background: var(--bg-secondary);
            border-left: 4px solid var(--primary-color);
            padding: 1rem 1.5rem;
            margin: 1rem 0;
            border-radius: 0 8px 8px 0;
        }

        .content code {
            font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
            background: var(--bg-code);
            color: var(--text-code);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 0.9rem;
        }

        .content pre {
            background: var(--bg-code);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1rem;
            overflow-x: auto;
            margin: 1rem 0;
        }

        .content pre code {
            background: none;
            padding: 0;
        }

        .content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
        }

        .content th, .content td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }

        .content th {
            background: var(--bg-secondary);
            font-weight: 600;
        }

        /* Footer */
        .footer {
            margin-top: 2rem;
            text-align: center;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }

            .header {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }

            .nav-links {
                justify-content: center;
            }

            .content {
                padding: 1.5rem;
            }

            .content h1 { font-size: 2rem; }
            .content h2 { font-size: 1.5rem; }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>
</head>
<body data-theme="dark">
    <div class="container">
        <header class="header">
            <h1>Project Documentation</h1>
            <nav class="nav-links">
                <a href="/documentation/" aria-label="Back to documentation portal">
                    <i class="mdi mdi-arrow-left" aria-hidden="true"></i>
                    Portal
                </a>
                <a href="/documentation/jsdoc/" aria-label="View API documentation">
                    <i class="mdi mdi-code-braces" aria-hidden="true"></i>
                    API Docs
                </a>
                <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle between light and dark theme">
                    <i class="mdi mdi-theme-light-dark" aria-hidden="true"></i>
                    <span id="theme-text">Light Mode</span>
                </button>
            </nav>
        </header>

        <main class="content">
            ${htmlContent}
        </main>

        <footer class="footer">
            <p>Documentation generated on ${currentDate} | <a href="https://github.com/ICJIA/icjia-vpp-2025" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
        </footer>
    </div>

    <!-- Syntax Highlighting -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>

    <script>
        // Theme Management
        function getPreferredTheme() {
            const stored = localStorage.getItem('documentation-theme');
            if (stored) return stored;
            return 'dark'; // Default to dark mode
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
    </script>
</body>
</html>`;

  fs.writeFileSync(outputPath, fullHTML);
  log("SUCCESS", "Project documentation HTML generated successfully", config);
};

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
        "./components/",
        "./pages/",
        "./README.md",
      ],
      includePattern: "\\.(js|vue)$",
      exclude: [
        "./node_modules/",
        "./.nuxt/",
        "./.output/",
        "./dist/",
        "./coverage/",
      ],
    },
    plugins: ["plugins/markdown", "node_modules/jsdoc-vuejs"],
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

    log("SUCCESS", "JSDoc API documentation generated successfully", config);
  } catch (error) {
    log("ERROR", `JSDoc generation failed: ${error.message}`, config, error);
    throw error;
  }
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

    ensureDirectory(docsDir, config);
    ensureDirectory(devDocsDir, config);
    ensureDirectory(jsdocDir, config);

    // Generate documentation portal
    log("INFO", "Generating documentation portal...", config);
    const portalHTML = generatePortalHTML(config);
    fs.writeFileSync(path.join(docsDir, "index.html"), portalHTML);
    log("SUCCESS", "Documentation portal generated successfully", config);

    // Generate project documentation
    await generateProjectDocumentation(config);

    // Generate JSDoc API documentation
    await generateJSDocDocumentation(config);

    log("SUCCESS", "Documentation generation completed successfully!", config, {
      portalPath: "/documentation/",
      projectDocsPath: "/documentation/dev/",
      apiDocsPath: "/documentation/jsdoc/",
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

export { generateDocumentation };
