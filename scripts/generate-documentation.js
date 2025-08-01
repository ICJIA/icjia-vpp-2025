#!/usr/bin/env node

/**
 * Documentation Generation Script
 *
 * Generates comprehensive project documentation including:
 * - Documentation portal (index.html)
 * - Project documentation (dev/index.html)
 * - JSDoc API documentation (jsdoc/index.html)
 * - Vue component documentation (components/*.html)
 *
 * This script is automatically run during build, dev, and generate processes.
 *
 * @author Illinois Criminal Justice Information Authority
 * @version 2.1.0
 * @since 2025-07-31
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { marked } from "marked";

// Get current file directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * Parse command line arguments for logging configuration
 *
 * @returns {Object} Configuration object with logging settings
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    verbose: false,
    silent: false,
    logLevel: "INFO",
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--verbose":
      case "-v":
        config.verbose = true;
        config.logLevel = "DEBUG";
        break;
      case "--silent":
      case "-s":
        config.silent = true;
        config.logLevel = "ERROR";
        break;
    }
  }

  return config;
}

/**
 * Enhanced logging function with multiple levels and optional data
 *
 * @param {string} level - Log level (DEBUG, INFO, WARN, ERROR, SUCCESS)
 * @param {string} message - Log message
 * @param {Object} config - Logging configuration
 * @param {*} [data] - Optional data to log in verbose mode
 */
function log(level, message, config, data = null) {
  if (config.silent && level !== "ERROR") return;

  const levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, SUCCESS: 1 };
  const configLevel = levels[config.logLevel] || 1;
  const messageLevel = levels[level] || 1;

  if (messageLevel < configLevel) return;

  const timestamp = new Date().toISOString();
  const colors = {
    DEBUG: "\x1b[36m", // Cyan
    INFO: "\x1b[34m", // Blue
    WARN: "\x1b[33m", // Yellow
    ERROR: "\x1b[31m", // Red
    SUCCESS: "\x1b[32m", // Green
  };
  const reset = "\x1b[0m";

  const prefix = `${colors[level] || ""}[${level}]${reset}`;
  console.log(`${prefix} ${message}`);

  if (config.verbose && data) {
    console.log(`${colors.DEBUG}[DEBUG]${reset} Additional data:`, data);
  }
}

/**
 * Ensure directory exists, create if it doesn't
 *
 * @param {string} dirPath - Directory path to ensure
 * @param {Object} config - Logging configuration
 */
function ensureDirectory(dirPath, config) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log("DEBUG", `Created directory: ${dirPath}`, config);
  }
}

/**
 * Load site configuration synchronously
 *
 * @returns {Object} Site configuration object
 * @throws {Error} If configuration file cannot be loaded
 */
function loadSiteConfigSync() {
  try {
    const configPath = path.join(projectRoot, "config", "site.config.json");
    const configContent = fs.readFileSync(configPath, "utf8");
    return JSON.parse(configContent);
  } catch (error) {
    throw new Error(`Failed to load site configuration: ${error.message}`);
  }
}

/**
 * Get current date in Chicago timezone
 *
 * @returns {string} Formatted date string
 */
function getCurrentDate() {
  return new Date().toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generate documentation portal HTML
 *
 * @param {Object} config - Logging configuration
 * @returns {string} HTML content for the documentation portal
 */
function generatePortalHTML(config) {
  const currentDate = getCurrentDate();

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Documentation Portal - Violence Prevention Plan for Illinois: 2025-2029</title>
  <meta name="description" content="Comprehensive documentation portal for the Illinois Violence Prevention Plan development.">
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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--background-color);
      color: var(--text-color);
      line-height: 1.6;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--primary-color);
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: 3rem;
    }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 2rem;
      transition: transform 0.2s ease, border-color 0.2s ease;
      text-decoration: none;
      color: inherit;
      display: block;
      cursor: pointer;
    }

    .card:hover {
      transform: translateY(-2px);
      border-color: var(--primary-color);
      text-decoration: none;
    }

    .card:focus {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .card h2 {
      color: var(--primary-color);
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .card p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .card-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      pointer-events: none;
    }
    
    .footer {
      text-align: center;
      padding: 2rem 0;
      border-top: 1px solid var(--border-color);
      color: var(--text-secondary);
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      h1 {
        font-size: 2rem;
      }
      
      .cards-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Documentation Portal</h1>
      <p class="subtitle">Comprehensive documentation for the Violence Prevention Plan for Illinois: 2025-2029</p>
    </header>
    
    <main>
      <div class="cards-grid">
        <a href="/documentation/dev/" class="card" aria-label="View Project Documentation">
          <h2>Project Documentation</h2>
          <p>Complete project documentation including setup instructions, architecture overview, and development guidelines.</p>
          <span class="card-link">View Project Docs →</span>
        </a>

        <a href="/documentation/jsdoc/" class="card" aria-label="View API Documentation">
          <h2>API Documentation</h2>
          <p>JSDoc-generated API documentation for all JavaScript functions, classes, and modules.</p>
          <span class="card-link">View API Docs →</span>
        </a>

        <a href="/documentation/components/" class="card" aria-label="View Component Documentation">
          <h2>Component Documentation</h2>
          <p>Vue component documentation with props, events, and usage examples.</p>
          <span class="card-link">View Components →</span>
        </a>

        <a href="/documentation/tools/" class="card" aria-label="View Tooling Documentation">
          <h2>Tooling Documentation</h2>
          <p>Comprehensive reference for all development tools and resources used in this project. Includes extensive digital accessibility resources for web and mobile app accessibility, as well as social media and video accessibility guidelines.</p>
          <span class="card-link">View Tools →</span>
        </a>

        <a href="/accessibility/documentation" class="card" aria-label="View Project Accessibility Documentation">
          <h2>Project Accessibility Documentation</h2>
          <p>Violence Prevention Plan website-specific accessibility compliance documentation and implementation guidelines.</p>
          <span class="card-link">View Accessibility →</span>
        </a>

        <a href="/documentation/audit-log/" class="card" aria-label="View Project Audit Log">
          <h2>Project Audit Log</h2>
          <p>Complete chronological record of all project changes, updates, and development milestones.</p>
          <span class="card-link">View Audit Log →</span>
        </a>
      </div>
    </main>
    
    <footer class="footer">
      <p>Illinois Criminal Justice Information Authority</p>
      <p>60 E Van Buren St, Suite 650, Chicago, IL 60605</p>
      <p>Documentation generated on ${currentDate}</p>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Generate project documentation HTML from markdown
 *
 * @param {Object} config - Logging configuration
 * @returns {Promise<void>}
 */
async function generateProjectDocumentation(config) {
  try {
    log("INFO", "Generating project documentation...", config);

    const markdownPath = path.join(projectRoot, "project-documentation.md");
    const outputPath = path.join(
      projectRoot,
      "public",
      "documentation",
      "dev",
      "index.html"
    );

    if (!fs.existsSync(markdownPath)) {
      throw new Error(`Project documentation file not found: ${markdownPath}`);
    }

    const markdownContent = fs.readFileSync(markdownPath, "utf8");

    // Function to generate slug from heading text
    function generateSlug(text) {
      // Ensure text is a string and strip HTML tags
      const cleanText = String(text).replace(/<[^>]*>/g, "");
      return cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .trim();
    }

    // Generate HTML content from markdown
    marked.setOptions({
      gfm: true,
      breaks: false,
    });

    let htmlContent = marked(markdownContent);

    // Post-process HTML to add IDs to headings
    htmlContent = htmlContent.replace(
      /<h([1-6])>([^<]+)<\/h[1-6]>/g,
      (match, level, text) => {
        const slug = generateSlug(text);
        return `<h${level} id="${slug}">${text}</h${level}>`;
      }
    );
    const currentDate = getCurrentDate();

    const fullHTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Project Documentation - Violence Prevention Plan for Illinois: 2025-2029</title>
  <meta name="description" content="Comprehensive project documentation for the Illinois Violence Prevention Plan development.">
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
      --code-bg: #2d2d2d;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--background-color);
      color: var(--text-color);
      line-height: 1.6;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .nav-links {
      display: flex;
      gap: 1rem;
    }

    .nav-links a {
      color: var(--primary-color);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .nav-links a:hover {
      background-color: var(--primary-color);
      color: white;
    }

    h1, h2, h3, h4, h5, h6 {
      color: var(--text-color);
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    h1 {
      color: var(--primary-color);
      font-size: 2.5rem;
      margin-top: 0;
    }

    h2 {
      color: var(--primary-color);
      font-size: 2rem;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0.5rem;
    }

    p {
      margin-bottom: 1rem;
      color: var(--text-color);
    }

    ul, ol {
      margin-left: 2rem;
      margin-bottom: 1rem;
    }

    li {
      margin-bottom: 0.5rem;
    }

    a {
      color: var(--primary-color);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    code {
      background-color: var(--code-bg);
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9em;
    }

    pre {
      background-color: var(--code-bg);
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1rem 0;
    }

    pre code {
      background: none;
      padding: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }

    th, td {
      border: 1px solid var(--border-color);
      padding: 0.75rem;
      text-align: left;
    }

    th {
      background-color: var(--surface-color);
      font-weight: 600;
    }

    blockquote {
      border-left: 4px solid var(--primary-color);
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
      color: var(--text-secondary);
    }

    .footer {
      text-align: center;
      padding: 2rem 0;
      border-top: 1px solid var(--border-color);
      color: var(--text-secondary);
      margin-top: 3rem;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .nav-links {
        flex-wrap: wrap;
      }

      h1 {
        font-size: 2rem;
      }

      h2 {
        font-size: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>Project Documentation</h1>
      <nav class="nav-links">
        <a href="/documentation/">← Portal</a>
        <a href="/documentation/jsdoc/">API Docs</a>
        <a href="#" onclick="toggleTheme()">🌙 Light Mode</a>
      </nav>
    </header>

    <main>
      ${htmlContent}
    </main>

    <footer class="footer">
      <p>Illinois Criminal Justice Information Authority</p>
      <p>60 E Van Buren St, Suite 650, Chicago, IL 60605</p>
      <p>Documentation generated on ${currentDate}</p>
    </footer>
  </div>

  <script>
    function toggleTheme() {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);

      const button = document.querySelector('nav a[onclick="toggleTheme()"]');
      button.textContent = newTheme === 'dark' ? '🌙 Light Mode' : '☀️ Dark Mode';

      localStorage.setItem('theme', newTheme);
    }

    // Smooth scrolling for anchor links
    function setupSmoothScrolling() {
      // Add smooth scrolling to all anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();

          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Update URL without triggering page reload
            history.pushState(null, null, this.getAttribute('href'));
          }
        });
      });
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
      setupSmoothScrolling();

      // Handle direct navigation to anchors (e.g., from URL)
      if (window.location.hash) {
        setTimeout(() => {
          const targetElement = document.querySelector(window.location.hash);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const button = document.querySelector('nav a[onclick="toggleTheme()"]');
    if (button) {
      button.textContent = savedTheme === 'dark' ? '🌙 Light Mode' : '☀️ Dark Mode';
    }
  </script>
</body>
</html>`;

    fs.writeFileSync(outputPath, fullHTML);
    log("SUCCESS", `Project documentation generated: ${outputPath}`, config);
  } catch (error) {
    log(
      "ERROR",
      `Failed to generate project documentation: ${error.message}`,
      config
    );
    throw error;
  }
}

/**
 * Generate JSDoc API documentation
 *
 * @param {Object} config - Logging configuration
 * @returns {Promise<void>}
 */
async function generateJSDocDocumentation(config) {
  try {
    log("INFO", "Generating JSDoc API documentation...", config);

    const outputDir = path.join(
      projectRoot,
      "public",
      "documentation",
      "jsdoc"
    );

    // Run JSDoc command with dynamic configuration (updated for Nuxt 4 structure)
    const jsdocCommand = `npx jsdoc -d ${outputDir} -t node_modules/clean-jsdoc-theme -R README.md --recurse app/ scripts/`;
    execSync(jsdocCommand, {
      cwd: projectRoot,
      stdio: config.verbose ? "inherit" : "pipe",
    });

    log("SUCCESS", `JSDoc documentation generated: ${outputDir}`, config);
  } catch (error) {
    log("WARN", `JSDoc generation failed: ${error.message}`, config);
    // Don't throw error for JSDoc failures as it's not critical
  }
}

/**
 * Main function to generate all documentation
 *
 * @returns {Promise<void>}
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
