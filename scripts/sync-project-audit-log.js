#!/usr/bin/env node

/**
 * Sync Project Audit Log Script
 *
 * This script ensures that the project audit log is properly synchronized:
 * - Copies content from root audit-log-project.md to public/documentation/audit-log/
 * - Converts markdown to HTML with proper styling and navigation
 * - Updates the date in the HTML and maintains formatting
 * - Preserves audit trail for project changes
 * - Ensures publicly accessible audit log matches repository state
 *
 * Features:
 * - Automatic HTML generation with light/dark theme support
 * - Chicago timezone date handling for consistency
 * - Content verification after sync
 * - Error handling with detailed logging
 * - Preserves original audit log formatting
 * - WCAG 2.1 AA accessibility compliance
 *
 * @module SyncProjectAuditLog
 * @version 1.0.0
 * @author Violence Prevention Plan for Illinois: 2025-2029
 *
 * @example
 * // Run manually:
 * node scripts/sync-project-audit-log.js
 *
 * @example
 * // Run via yarn:
 * yarn sync:project-audit
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// File paths
const sourceFile = path.join(rootDir, "audit-log-project.md");
const targetDir = path.join(rootDir, "public", "documentation", "audit-log");
const targetFile = path.join(targetDir, "index.html");

/**
 * Get current date in Chicago timezone
 *
 * @returns {string} Current date in YYYY-MM-DD format
 *
 * @example
 * const date = getCurrentDate(); // "2025-07-28"
 */
const getCurrentDate = () => {
  const now = new Date();
  const chicagoTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
  return chicagoTime.toISOString().split("T")[0]; // YYYY-MM-DD format
};

/**
 * Get current date formatted for display in Chicago timezone
 *
 * @returns {string} Current date in "Month DD, YYYY" format
 *
 * @example
 * const date = getCurrentDateFormatted(); // "July 28, 2025"
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
 * Generate HTML template for the audit log
 *
 * @param {string} content - The HTML content to embed
 * @param {string} lastUpdated - The last updated date string
 * @returns {string} Complete HTML document
 */
const generateHTMLTemplate = (content, lastUpdated) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Audit Log - Violence Prevention Plan for Illinois: 2025-2029</title>
    <meta
      name="description"
      content="Chronological audit log of all significant changes made to the Illinois Violence Prevention Plan project.">
    <meta
      name="author"
      content="Illinois Criminal Justice Information Authority">

    <!-- Theme and Accessibility -->
    <meta name="color-scheme" content="dark light">
    <meta
      name="theme-color"
      content="#1A2234"
      media="(prefers-color-scheme: dark)">
    <meta
      name="theme-color"
      content="#F2F2F2"
      media="(prefers-color-scheme: light)">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
      rel="stylesheet">

    <!-- Material Design Icons -->
    <link
      href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css"
      rel="stylesheet">

    <!-- Prism.js for Syntax Highlighting -->
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css"
      rel="stylesheet">

    <style>
      :root {
        --primary-color: #1976d2;
        --primary-dark: #1565c0;
        --secondary-color: #424242;
        --accent-color: #ff5722;
        --background-light: #ffffff;
        --background-dark: #121212;
        --surface-light: #f5f5f5;
        --surface-dark: #1e1e1e;
        --text-light: #212121;
        --text-dark: #ffffff;
        --text-secondary-light: #757575;
        --text-secondary-dark: #b0b0b0;
        --border-light: #e0e0e0;
        --border-dark: #333333;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: var(--text-light);
        background-color: var(--background-light);
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      /* Dark theme styles */
      [data-theme="dark"] {
        color: var(--text-dark);
        background-color: var(--background-dark);
      }

      [data-theme="dark"] .header {
        border-bottom-color: var(--border-dark);
      }

      [data-theme="dark"] .header p {
        color: var(--text-secondary-dark);
      }

      [data-theme="dark"] .last-updated {
        background: var(--surface-dark);
      }

      [data-theme="dark"] .content {
        background: var(--surface-dark);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      [data-theme="dark"] code {
        background: var(--background-dark);
      }

      [data-theme="dark"] .skip-link {
        background: var(--primary-color);
        color: white;
      }

      [data-theme="dark"] .back-link:hover,
      [data-theme="dark"] .back-link:focus {
        background-color: rgba(25, 118, 210, 0.15);
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        :root {
          --text-light: #000000;
          --text-dark: #ffffff;
          --background-light: #ffffff;
          --background-dark: #000000;
          --primary-color: #0066cc;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      [data-theme="dark"] pre {
        background: var(--background-dark);
      }

      /* Theme toggle button */
      .theme-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 16px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        z-index: 1000;
      }

      .theme-toggle:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .theme-toggle:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      .theme-toggle i {
        font-size: 18px;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .header {
        text-align: center;
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 2px solid var(--border-light);
      }

      .header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 1rem;
      }

      .header p {
        font-size: 1.1rem;
        color: var(--text-secondary-light);
        max-width: 800px;
        margin: 0 auto;
      }

      .last-updated {
        background: var(--surface-light);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        border-left: 4px solid var(--primary-color);
      }

      .content {
        background: var(--background-light);
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      h1, h2, h3, h4, h5, h6 {
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-weight: 600;
      }

      h1 { font-size: 2rem; }
      h2 { font-size: 1.75rem; }
      h3 { font-size: 1.5rem; }
      h4 { font-size: 1.25rem; }

      p {
        margin-bottom: 1rem;
      }

      ul, ol {
        margin-bottom: 1rem;
        padding-left: 2rem;
      }

      li {
        margin-bottom: 0.5rem;
      }

      code {
        background: var(--surface-light);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
      }

      pre {
        background: var(--surface-light);
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
        margin-bottom: 1rem;
      }

      .back-link {
        display: inline-flex;
        align-items: center;
        color: var(--primary-color);
        text-decoration: none;
        margin-bottom: 2rem;
        font-weight: 500;
        transition: color 0.3s ease;
        padding: 8px 12px;
        border-radius: 8px;
        min-height: 44px;
        min-width: 44px;
      }

      .back-link:hover {
        color: var(--primary-dark);
        background-color: rgba(25, 118, 210, 0.08);
      }

      .back-link:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
        background-color: rgba(25, 118, 210, 0.08);
      }

      .back-link i {
        margin-right: 0.5rem;
      }

      /* Skip to main content link for screen readers */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        font-weight: 500;
      }

      .skip-link:focus {
        top: 6px;
      }

      @media (max-width: 768px) {
        .container {
          padding: 1rem;
        }
        
        .header h1 {
          font-size: 2rem;
        }
        
        .content {
          padding: 1rem;
        }
      }
    </style>
  </head>
  <body data-theme="dark">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="container">
      <header role="banner">
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle between light and dark theme">
          <i class="mdi mdi-theme-light-dark" aria-hidden="true"></i>
          <span id="theme-text">Light Mode</span>
        </button>

        <nav role="navigation" aria-label="Documentation navigation">
          <a href="/documentation/" class="back-link" aria-label="Return to main documentation portal">
            <i class="mdi mdi-arrow-left" aria-hidden="true"></i>
            Back to Documentation
          </a>
        </nav>

        <div class="header">
          <h1>Project Audit Log</h1>
          <p>
            Chronological record of all significant changes made to the Statewide Violence Prevention Plan for Illinois: 2025-2029,
            providing transparency and accountability for external reviewers and future developers.
          </p>
        </div>

        <div class="last-updated" role="status" aria-live="polite">
          <strong>Last Updated:</strong> <time datetime="${getCurrentDate()}">${lastUpdated}</time>
        </div>
      </header>

      <main id="main-content" role="main" class="content" aria-label="Project audit log entries">
        ${content}
      </main>
    </div>

    <!-- Prism.js for Syntax Highlighting -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>

    <!-- Theme Toggle Functionality -->
    <script>
      function toggleTheme() {
        const body = document.body;
        const themeText = document.getElementById('theme-text');
        const currentTheme = body.getAttribute('data-theme');

        if (currentTheme === 'dark') {
          body.setAttribute('data-theme', 'light');
          themeText.textContent = 'Dark Mode';
          localStorage.setItem('audit-log-theme', 'light');
        } else {
          body.setAttribute('data-theme', 'dark');
          themeText.textContent = 'Light Mode';
          localStorage.setItem('audit-log-theme', 'dark');
        }
      }

      // Initialize theme from localStorage or default to dark
      document.addEventListener('DOMContentLoaded', function() {
        const savedTheme = localStorage.getItem('audit-log-theme') || 'dark';
        const body = document.body;
        const themeText = document.getElementById('theme-text');

        // Always ensure we start with the saved theme or default to dark
        body.setAttribute('data-theme', savedTheme);
        themeText.textContent = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';

        // If no saved theme exists, explicitly save dark as default
        if (!localStorage.getItem('audit-log-theme')) {
          localStorage.setItem('audit-log-theme', 'dark');
        }
      });
    </script>
  </body>
</html>`;
};

/**
 * Main function to synchronize project audit log
 *
 * Copies content from the root audit log to the public documentation directory,
 * converts to HTML, and updates dates for consistency.
 *
 * @async
 * @function syncProjectAuditLog
 * @returns {Promise<void>}
 * @throws {Error} If source file doesn't exist or sync fails
 *
 * @example
 * await syncProjectAuditLog();
 */
async function syncProjectAuditLog() {
  try {
    console.log("🔄 Starting project audit log synchronization...");

    // Check if source file exists
    if (!fs.existsSync(sourceFile)) {
      console.error(`❌ Source file not found: ${sourceFile}`);
      process.exit(1);
    }

    // Read source content
    const sourceContent = fs.readFileSync(sourceFile, "utf8");
    console.log(`📖 Read source file: ${sourceFile}`);

    // Get current date
    const currentDateFormatted = getCurrentDateFormatted();

    // Convert markdown to HTML
    const htmlContent = marked(sourceContent);

    // Generate complete HTML document
    const completeHTML = generateHTMLTemplate(
      htmlContent,
      currentDateFormatted
    );

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`📁 Created directory: ${targetDir}`);
    }

    // Write target file
    fs.writeFileSync(targetFile, completeHTML, "utf8");
    console.log(`✅ Successfully synced to: ${targetFile}`);

    // Verify file was written correctly
    const verification = fs.readFileSync(targetFile, "utf8");
    const lines = verification.split("\n").length;
    console.log(`📊 Target file contains ${lines} lines`);

    console.log("🎉 Project audit log synchronization completed successfully!");
  } catch (error) {
    console.error("❌ Error during synchronization:", error.message);
    process.exit(1);
  }
}

// Run the sync
syncProjectAuditLog();
