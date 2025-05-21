/**
 * Script to generate HTML versions of accessibility documentation
 *
 * This script converts Markdown files to HTML and places them in the /public directory
 * to make them accessible via direct URL.
 *
 * Console output is color-coded:
 * - Filenames in blue
 * - Successful steps in green
 * - Errors in red
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

// ANSI color codes for console output
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

// HTML template for the generated files
const htmlTemplate = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${title} for the Violence Prevention Plan for Illinois: 2025-2029">
  <title>${title} - Violence Prevention Plan for Illinois: 2025-2029</title>
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
        <a href="/" aria-label="Return to Violence Prevention Plan for Illinois homepage">Home</a> |
        <a href="/accessibility-documentation.html" aria-label="View Accessibility Documentation">Accessibility Documentation</a> |
        <a href="/audit-log-accessibility.html" aria-label="View Accessibility Audit Log">Accessibility Audit Log</a> |
        <a href="/privacy-policy.html" aria-label="View Privacy Policy">Privacy Policy</a>
      </nav>
      <p>&copy; ${new Date().getFullYear()} Illinois Criminal Justice Information Authority. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>
`;

// Files to convert
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
  {
    source: path.join(process.cwd(), 'privacy-policy.md'),
    destination: path.join(process.cwd(), 'public/privacy-policy.html'),
    title: 'Privacy Policy'
  }
];

// Also check if we're running during a static site generation
// If .output/public exists, we'll copy the files there too
const outputPublicDir = path.join(process.cwd(), '.output/public');
const isStaticGeneration = fs.existsSync(outputPublicDir);

// Create public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Convert each file
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
