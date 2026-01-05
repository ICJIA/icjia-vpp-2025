#!/usr/bin/env node

/**
 * Ensure Accessibility Report Placeholder
 *
 * This script creates a placeholder accessibility report if one doesn't exist.
 * This ensures /docs/accessibility/ never returns a 404, even before the first
 * accessibility audit has been run.
 *
 * The placeholder provides clear instructions on how to generate a real report.
 *
 * @fileoverview Build-time placeholder generator for accessibility reports
 * @module scripts/ensure-accessibility-report
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Format date in Chicago timezone
 */
function formatChicagoDate() {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  }).format(new Date());
}

/**
 * Generate placeholder HTML
 */
function generatePlaceholderHTML() {
  const timestamp = formatChicagoDate();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Report - Violence Prevention Plan for Illinois</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="icon" href="/favicon.png">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --bg-primary: #0f172a;
      --bg-surface: #1e293b;
      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --accent: #60a5fa;
      --warning: #fbbf24;
      --border: rgba(96, 165, 250, 0.2);
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      padding: 2rem;
      min-height: 100vh;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 3rem;
    }

    h1 {
      color: var(--warning);
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    .warning-box {
      background: var(--bg-surface);
      border: 2px solid var(--warning);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .warning-icon {
      font-size: 3rem;
      text-align: center;
      margin-bottom: 1rem;
    }

    .info-box {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    h2 {
      color: var(--accent);
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    p {
      margin-bottom: 1rem;
      color: var(--text-secondary);
    }

    code {
      background: rgba(96, 165, 250, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-family: "JetBrains Mono", monospace;
      color: var(--accent);
    }

    pre {
      background: rgba(0, 0, 0, 0.3);
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1rem 0;
    }

    pre code {
      background: none;
      padding: 0;
    }

    ol {
      margin-left: 2rem;
      margin-bottom: 1rem;
    }

    li {
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
    }

    footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border);
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    a {
      color: var(--accent);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>⚠️ Accessibility Report Placeholder</h1>
      <p class="subtitle">No accessibility audit has been run yet</p>
    </header>

    <div class="warning-box">
      <div class="warning-icon">🔍</div>
      <p style="text-align: center; color: var(--text-primary); font-size: 1.2rem;">
        This is a placeholder page. To generate a real accessibility report,
        follow the instructions below.
      </p>
    </div>

    <div class="info-box">
      <h2>How to Generate Accessibility Report</h2>
      <p>Run the following commands to generate a comprehensive accessibility audit:</p>

      <ol>
        <li>
          <strong>Start the development server:</strong>
          <pre><code>yarn dev</code></pre>
        </li>
        <li>
          <strong>In a new terminal, run the accessibility audit:</strong>
          <pre><code>yarn generate:accessibility</code></pre>
          <p>Or directly:</p>
          <pre><code>node audit-accessibility.js</code></pre>
        </li>
        <li>
          <strong>Wait for the audit to complete</strong> - this may take several minutes
          as it tests multiple pages across different viewports
        </li>
        <li>
          <strong>Refresh this page</strong> to see the full report
        </li>
      </ol>
    </div>

    <div class="info-box">
      <h2>What the Report Will Include</h2>
      <ul style="list-style-type: none; margin-left: 0;">
        <li style="margin-bottom: 1rem;">✅ <strong>WCAG 2.1 AA Compliance Results</strong></li>
        <li style="margin-bottom: 1rem;">📊 <strong>Violations by Page and Severity</strong></li>
        <li style="margin-bottom: 1rem;">📱 <strong>Multiple Viewport Tests</strong> (mobile, tablet, desktop)</li>
        <li style="margin-bottom: 1rem;">🌓 <strong>Theme Testing</strong> (light and dark modes)</li>
        <li style="margin-bottom: 1rem;">📝 <strong>Detailed Remediation Guidance</strong></li>
      </ul>
    </div>

    <div class="info-box">
      <h2>Configuration</h2>
      <p>
        The accessibility audit script is located at:
        <code>audit-accessibility.js</code>
      </p>
      <p>
        You can configure the base URL, routes to test, and viewports by
        setting environment variables or modifying the script.
      </p>
    </div>

    <footer>
      <p>Placeholder generated: ${timestamp}</p>
      <p><a href="/docs/">← Back to Documentation Portal</a></p>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Main function to ensure placeholder exists
 */
function ensurePlaceholder() {
  const reportDir = path.join(projectRoot, 'public', 'docs', 'accessibility');
  const reportFile = path.join(reportDir, 'index.html');

  // Create directory if it doesn't exist
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
    console.log('✓ Created accessibility report directory');
  }

  // Only create placeholder if report doesn't exist
  if (!fs.existsSync(reportFile)) {
    const html = generatePlaceholderHTML();
    fs.writeFileSync(reportFile, html);
    console.log('✓ Created accessibility report placeholder');
    console.log('  Run "yarn generate:accessibility" to generate a real report');
  } else {
    console.log('✓ Accessibility report already exists');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    ensurePlaceholder();
  } catch (error) {
    console.error('✗ Failed to ensure accessibility report:', error.message);
    process.exit(1);
  }
}

export { ensurePlaceholder, generatePlaceholderHTML };

