#!/usr/bin/env node

/**
 * Tools Documentation Generation Script
 *
 * This script generates a rendered HTML version of tools.md for the Illinois Violent Prevention Project.
 * The output is placed in public/documentation/tools/index.html with light/dark theme support.
 *
 * Features:
 * - Converts tools.md to HTML with markdown parsing
 * - Dark mode as default (matching project preferences)
 * - WCAG 2.1 AA accessibility compliance
 * - Responsive design compatible with project's Vuetify theme
 * - Unified logging system integration
 * - Error handling with detailed feedback
 *
 * Output:
 * /public/documentation/tools/index.html
 *
 * @module GenerateToolsDocumentation
 * @version 1.0.0
 * @author Violence Prevention Plan for Illinois: 2025-2029
 *
 * @example
 * // Run manually:
 * node scripts/generate-tools-documentation.js
 *
 * @example
 * // Run via yarn:
 * yarn create:tools-docs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root directory
const projectRoot = path.resolve(__dirname, "..");

// Input and output paths
const toolsMarkdownPath = path.join(projectRoot, "tools.md");
const outputDir = path.join(projectRoot, "public", "documentation", "tools");
const outputPath = path.join(outputDir, "index.html");

/**
 * Configure marked options for better HTML output
 */
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false,
});

/**
 * Generate a URL-friendly slug from text
 * @param {string} text - The text to convert to a slug
 * @returns {string} URL-friendly slug
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/&/g, "amp") // Replace & with amp
    .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens and spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Generate the HTML template with embedded CSS and JavaScript
 * @param {string} content - The rendered markdown content
 * @returns {string} Complete HTML document
 */
function generateHTMLTemplate(content) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Development Tools & Resources - Violence Prevention Plan for Illinois</title>
    <meta name="description" content="Comprehensive list of tools, frameworks, and resources used in the Violence Prevention Plan for Illinois project.">
    
    <!-- Preload fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        /* CSS Variables for Theme Support */
        :root {
            --primary-color: #1976D2;
            --primary-dark: #1565C0;
            --accent-color: #2196F3;
            --success-color: #4CAF50;
            --warning-color: #FF9800;
            --error-color: #F44336;
        }
        
        /* Light Theme */
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
        
        /* Dark Theme (Default) */
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
        
        /* Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html {
            scroll-behavior: smooth;
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
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid var(--border-color);
            position: relative;
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
            top: 0;
            right: 0;
            background: var(--bg-card);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            padding: 0.5rem 1rem;
            cursor: pointer;
            font-size: 0.9rem;
            color: var(--text-primary);
            transition: all 0.3s ease;
        }
        
        .theme-toggle:hover {
            background: var(--bg-secondary);
            box-shadow: var(--shadow-hover);
        }
        
        /* Content Styles */
        .content {
            background: var(--bg-card);
            border-radius: 12px;
            padding: 2rem;
            box-shadow: var(--shadow);
            margin-bottom: 2rem;
        }
        
        /* Typography */
        h1, h3, h4, h5, h6 {
            color: var(--text-primary);
            margin-bottom: 1rem;
            font-weight: 600;
        }

        /* Main section headings with high contrast */
        h2 {
            color: var(--primary-color);
            margin-bottom: 1rem;
            margin-top: 2rem;
            font-weight: 700;
            font-size: 2rem;
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 0.5rem;
        }

        h1 { font-size: 2.5rem; }
        h3 { font-size: 1.5rem; margin-top: 1.5rem; }
        h4 { font-size: 1.25rem; margin-top: 1rem; }
        
        p {
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        /* Links */
        a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        a:hover {
            color: var(--primary-dark);
            text-decoration: underline;
        }
        
        /* Lists */
        ul, ol {
            margin-bottom: 1rem;
            padding-left: 2rem;
        }
        
        li {
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }
        
        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            background: var(--bg-card);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: var(--shadow);
        }
        
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        th {
            background: var(--bg-secondary);
            font-weight: 600;
            color: var(--text-primary);
        }
        
        tr:hover {
            background: var(--bg-secondary);
        }
        
        /* Code */
        code {
            background: var(--bg-secondary);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
        }
        
        pre {
            background: var(--bg-secondary);
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        /* Blockquotes */
        blockquote {
            border-left: 4px solid var(--primary-color);
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: var(--text-secondary);
        }
        
        /* Horizontal Rules */
        hr {
            border: none;
            height: 2px;
            background: var(--border-color);
            margin: 2rem 0;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 1.5rem;
            }
            
            .theme-toggle {
                position: static;
                margin-top: 1rem;
                display: inline-block;
            }
            
            table {
                font-size: 0.9rem;
            }
            
            th, td {
                padding: 0.75rem;
            }
        }
        
        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            * {
                transition: none !important;
            }
        }
        
        /* Focus styles for accessibility */
        a:focus, button:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle between light and dark theme">
                🌙 Dark Mode
            </button>
            <h1>Development Tools & Resources</h1>
            <p>Comprehensive tooling guide for the Violence Prevention Plan for Illinois project</p>
        </header>
        
        <main class="content">
            ${content}
        </main>
    </div>
    
    <script>
        // Theme management
        function toggleTheme() {
            const html = document.documentElement;
            const button = document.querySelector('.theme-toggle');
            const currentTheme = html.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                html.setAttribute('data-theme', 'light');
                button.textContent = '☀️ Light Mode';
                localStorage.setItem('theme', 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                button.textContent = '🌙 Dark Mode';
                localStorage.setItem('theme', 'dark');
            }
        }
        
        // Initialize theme from localStorage or default to dark
        function initTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            const html = document.documentElement;
            const button = document.querySelector('.theme-toggle');
            
            html.setAttribute('data-theme', savedTheme);
            button.textContent = savedTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode';
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', initTheme);

        // Smooth scrolling for anchor links
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    </script>
</body>
</html>`;
}

/**
 * Main function to generate the tools documentation
 */
async function generateToolsDocumentation() {
  try {
    console.log("🔧 Generating tools documentation...");

    // Check if tools.md exists
    if (!fs.existsSync(toolsMarkdownPath)) {
      throw new Error(`tools.md not found at ${toolsMarkdownPath}`);
    }

    // Read the markdown file
    const markdownContent = fs.readFileSync(toolsMarkdownPath, "utf-8");

    // Convert markdown to HTML
    let htmlContent = marked(markdownContent);

    // Post-process HTML to add IDs to headings
    htmlContent = htmlContent.replace(
      /<h([1-6])>([^<]+)<\/h[1-6]>/g,
      (match, level, text) => {
        const slug = generateSlug(text);
        return `<h${level} id="${slug}">${text}</h${level}>`;
      }
    );

    // Fix TOC links to match the generated heading IDs
    htmlContent = htmlContent.replace(
      /<a href="#([^"]+)">([^<]+)<\/a>/g,
      (match, href, text) => {
        // Only fix TOC links that contain & characters
        if (text.includes("&")) {
          const correctedHref = generateSlug(text);
          return `<a href="#${correctedHref}">${text}</a>`;
        }
        return match;
      }
    );

    // Generate the complete HTML document
    const fullHTML = generateHTMLTemplate(htmlContent);

    // Ensure output directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    // Write the HTML file
    fs.writeFileSync(outputPath, fullHTML, "utf-8");

    console.log(
      `✅ Tools documentation generated successfully at ${outputPath}`
    );
  } catch (error) {
    console.error("❌ Error generating tools documentation:", error.message);
    process.exit(1);
  }
}

// Run the script
generateToolsDocumentation();
