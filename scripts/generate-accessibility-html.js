/**
 * Script to generate HTML versions of accessibility documentation
 *
 * This script converts Markdown files to HTML and places them in the /public directory
 * to make them accessible via direct URL.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

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
  <title>${title} - Illinois Violent Prevention Project</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    a {
      color: #1867c0;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
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
    blockquote {
      margin: 0;
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }
    table th, table td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    table tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }
    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
    .header-link {
      display: block;
      padding: 10px 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #eaecef;
    }
    .footer-link {
      display: block;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eaecef;
      text-align: center;
    }
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #121212;
        color: #e0e0e0;
      }
      a {
        color: #64b5f6;
      }
      code {
        background-color: rgba(255, 255, 255, 0.1);
      }
      pre {
        background-color: #1e1e1e;
      }
      blockquote {
        color: #9e9e9e;
        border-left-color: #424242;
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
      .header-link, .footer-link {
        border-color: #424242;
      }
    }
  </style>
</head>
<body>
  <a href="/" class="header-link">← Back to Illinois Violent Prevention Project</a>
  ${content}
  <div class="footer-link">
    <a href="/">Illinois Violent Prevention Project</a> |
    <a href="/accessibility-documentation.html">Accessibility Documentation</a> |
    <a href="/audit-log-accessibility.html">Accessibility Audit Log</a>
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

    console.log(`Successfully generated ${file.destination}`);

    // If we're running during static site generation, also copy to .output/public
    if (isStaticGeneration) {
      const outputFilePath = path.join(outputPublicDir, path.basename(file.destination));
      fs.writeFileSync(outputFilePath, fullHtml);
      console.log(`Also copied to ${outputFilePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${file.source}:`, error);
  }
});

console.log('HTML generation complete!');
