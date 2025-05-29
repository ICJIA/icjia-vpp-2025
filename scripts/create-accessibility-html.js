/**
 * Enhanced Accessibility Documentation HTML Generator
 *
 * This script converts Markdown accessibility documentation files to HTML format
 * and places them in the /public directory for direct URL access. The generated
 * HTML files include comprehensive styling, accessibility features, and proper
 * semantic structure following WCAG 2.1 AA guidelines.
 *
 * Enhanced Features:
 * - Converts multiple markdown files to HTML with consistent styling
 * - Includes comprehensive CSS with dark mode support and enhanced contrast ratios
 * - Implements advanced accessibility features (skip links, focus management, ARIA, screen reader optimizations)
 * - Enhanced WCAG 2.1 AA compliance with improved color contrast (7:1+ ratios)
 * - Advanced screen reader support with proper landmark regions and heading hierarchy
 * - Supports both development and static generation environments
 * - Provides color-coded console output for better developer experience
 * - Includes enhanced print styles for better document accessibility
 * - Improved keyboard navigation with visible focus indicators
 * - Reduced motion support for accessibility preferences
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 * @since 2025-05-25
 *
 * @example
 * // Run the script directly
 * node scripts/create-accessibility-html.js
 *
 * @example
 * // Run via npm/yarn script
 * yarn create:accessibility-html
 * npm run create:accessibility-html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

/**
 * ANSI color codes for console output
 *
 * These color codes provide visual distinction in the terminal:
 * - Blue for filenames and paths
 * - Green for successful operations
 * - Red for errors and warnings
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m'
};

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure marked for GitHub-flavored markdown
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false
});

/**
 * Generates a complete HTML document with accessibility features and styling
 *
 * This function creates a comprehensive HTML template that includes:
 * - Semantic HTML structure with proper ARIA landmarks
 * - WCAG 2.1 AA compliant styling and color contrast
 * - Dark mode support with prefers-color-scheme
 * - Skip links for keyboard navigation
 * - Print styles for better document accessibility
 * - Responsive design for mobile devices
 * - Reduced motion support for accessibility
 *
 * @param {string} title - The title of the document (used in <title> and meta description)
 * @param {string} content - The HTML content to be inserted into the main section
 * @returns {string} Complete HTML document as a string
 *
 * @example
 * const html = htmlTemplate('Accessibility Documentation', '<h1>Welcome</h1><p>Content here</p>');
 * fs.writeFileSync('output.html', html);
 */
const htmlTemplate = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${title} for the Violence Prevention Plan for Illinois: 2025-2029">
  <title>${title} - Violence Prevention Plan for Illinois: 2025-2029</title>
  <!-- Accessibility meta tags -->
  <meta name="author" content="Illinois Criminal Justice Information Authority">
  <meta name="robots" content="index, follow">
  <style>
    /* Base styles */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    /* Typography */
    a {
      color: #0056b3; /* Darker blue for better contrast (4.5:1 ratio) */
      text-decoration: underline; /* Always show underlines for links - WCAG 2.1 AA */
    }

    a:hover, a:focus {
      text-decoration: underline;
      color: #003b7a; /* Even darker on hover/focus */
    }

    /* Focus styles for keyboard navigation */
    a:focus, button:focus, [tabindex]:focus {
      outline: 3px solid #0056b3;
      outline-offset: 2px;
    }

    /* Skip link */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: #0056b3;
      color: white;
      padding: 8px;
      z-index: 100;
      transition: top 0.2s ease;
    }

    .skip-link:focus {
      top: 0;
    }

    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }

    h1 {
      font-size: 2em;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }

    h2 {
      font-size: 1.5em;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }

    h3 {
      font-size: 1.25em;
    }

    /* Code blocks */
    code {
      font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
      background-color: rgba(27, 31, 35, 0.05);
      border-radius: 3px;
      padding: 0.2em 0.4em;
      font-size: 85%;
    }

    pre {
      background-color: #f6f8fa;
      border-radius: 3px;
      padding: 16px;
      overflow: auto;
    }

    pre code {
      background-color: transparent;
      padding: 0;
    }

    /* Quotes */
    blockquote {
      margin: 0;
      padding: 0 1em;
      color: #4a5568; /* Darker for better contrast */
      border-left: 0.25em solid #dfe2e5;
    }

    /* Tables */
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }

    table th, table td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }

    table th {
      background-color: #f1f1f1;
      font-weight: 600;
    }

    table tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }

    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }

    /* Header and footer */
    .site-header {
      padding: 10px 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #eaecef;
    }

    .site-footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eaecef;
      text-align: center;
    }

    .footer-nav {
      margin: 1rem 0;
    }

    .footer-nav a {
      margin: 0 10px;
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #121212;
        color: #e0e0e0;
      }

      a {
        color: #64b5f6; /* Light blue for dark mode - still meets 4.5:1 contrast */
      }

      a:hover, a:focus {
        color: #90caf9; /* Lighter on hover/focus */
      }

      a:focus, button:focus, [tabindex]:focus {
        outline-color: #64b5f6;
      }

      code {
        background-color: rgba(255, 255, 255, 0.1);
      }

      pre {
        background-color: #1e1e1e;
      }

      blockquote {
        color: #a0aec0; /* Lighter for dark mode, still with good contrast */
        border-left-color: #424242;
      }

      table th {
        background-color: #2d2d2d;
      }

      table th, table td {
        border-color: #424242;
      }

      table tr {
        background-color: #1e1e1e;
        border-top-color: #424242;
      }

      table tr:nth-child(2n) {
        background-color: #262626;
      }

      .site-header, .site-footer {
        border-color: #424242;
      }
    }

    /* Respect user's motion preferences */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
    }

    /* Print styles for better accessibility when printing */
    @media print {
      body {
        font-size: 12pt;
        line-height: 1.5;
        color: #000;
        background: #fff;
      }

      a {
        color: #000;
        text-decoration: underline;
      }

      a::after {
        content: " (" attr(href) ")";
        font-size: 90%;
      }

      .skip-link,
      .site-header,
      .site-footer {
        display: none;
      }

      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        page-break-inside: avoid;
      }

      img, table, figure {
        page-break-inside: avoid;
      }

      p, h2, h3 {
        orphans: 3;
        widows: 3;
      }

      .container {
        max-width: 100%;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <div class="container">
    <header class="site-header" role="banner">
      <a href="/" aria-label="Return to Violence Prevention Plan for Illinois homepage">← Back to Violence Prevention Plan for Illinois: 2025-2029</a>
    </header>

    <main id="main-content" role="main">
      ${content}
    </main>

    <footer class="site-footer" role="contentinfo">
      <nav class="footer-nav" aria-label="Footer Navigation">
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; justify-content: center;">
          <li style="margin: 0 10px;"><a href="/" aria-label="Return to Violence Prevention Plan for Illinois homepage">Home</a></li>
          <li style="margin: 0 10px;"><a href="/accessibility-documentation.html" aria-label="View Accessibility Documentation">Accessibility Documentation</a></li>
          <li style="margin: 0 10px;"><a href="/audit-log-accessibility.html" aria-label="View Accessibility Audit Log">Accessibility Audit Log</a></li>
          <li style="margin: 0 10px;"><a href="/legal/privacy-policy" aria-label="View Privacy Policy">Privacy Policy</a></li>
          <li style="margin: 0 10px;"><a href="/legal/terms-of-service" aria-label="View Terms of Service">Terms of Service</a></li>
        </ul>
      </nav>
      <p>&copy; ${new Date().getFullYear()} Illinois Criminal Justice Information Authority. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>
`;

/**
 * Configuration array defining which markdown files to convert to HTML
 *
 * Each object in this array specifies:
 * - source: Path to the source markdown file
 * - destination: Path where the generated HTML file should be saved
 * - title: Human-readable title for the document (used in HTML title and meta tags)
 *
 * @type {Array<{source: string, destination: string, title: string}>}
 */
const filesToConvert = [
  {
    source: path.join(process.cwd(), 'accessibility-documentation.md'),
    destination: path.join(process.cwd(), 'public/accessibility-documentation.html'),
    title: 'Accessibility Documentation'
  },
  {
    source: path.join(process.cwd(), 'audit-log-accessibility.md'),
    destination: path.join(process.cwd(), 'public/audit-log-accessibility.html'),
    title: 'Accessibility Audit Log'
  },

];

/**
 * Check if we're running during static site generation
 * If .output/public exists, we'll copy the files there too for Nuxt static generation
 */
const outputPublicDir = path.join(process.cwd(), '.output/public');
const isStaticGeneration = fs.existsSync(outputPublicDir);

/**
 * Ensure the public directory exists before writing files
 * Creates the directory if it doesn't exist to prevent write errors
 */
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

/**
 * Main processing loop - converts each configured markdown file to HTML
 *
 * For each file in the filesToConvert array:
 * 1. Reads the source markdown file
 * 2. Converts markdown to HTML using marked
 * 3. Applies content-specific transformations (e.g., link updates)
 * 4. Wraps content in the HTML template
 * 5. Writes the result to the destination file
 * 6. Optionally copies to static generation output directory
 *
 * @throws {Error} If file reading, conversion, or writing fails
 */
filesToConvert.forEach(file => {
  try {
    // Read markdown file
    const markdown = fs.readFileSync(file.source, 'utf8');

    // Convert to HTML
    let htmlContent = marked.parse(markdown);

    // Replace Markdown links with HTML links
    if (file.source.includes('audit-log-accessibility.md')) {
      // Replace the link to accessibility-documentation.md with a link to the HTML version
      htmlContent = htmlContent.replace(
        /<p>The documentation is available at <a href="\.\/accessibility-documentation\.md">accessibility-documentation\.md<\/a> and is referenced in the README\.<\/p>/g,
        '<p>The documentation is available at <a href="/accessibility-documentation.html">Accessibility Documentation</a> and is referenced in the README.</p>'
      );
    }

    // Wrap in HTML template
    const fullHtml = htmlTemplate(file.title, htmlContent);

    // Write to destination
    fs.writeFileSync(file.destination, fullHtml);

    console.log(`${colors.green}Successfully generated HTML file${colors.reset}`);

    // If we're running during static site generation, also copy to output directory
    if (isStaticGeneration) {
      const outputFilePath = path.join(outputPublicDir, path.basename(file.destination));
      fs.writeFileSync(outputFilePath, fullHtml);
      console.log(`${colors.green}Also copied to output directory${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}Error processing file:${colors.reset}`, error.message);
  }
});

console.log(`${colors.green}HTML generation complete!${colors.reset}`);
