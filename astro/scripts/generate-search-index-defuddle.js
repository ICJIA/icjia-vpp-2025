#!/usr/bin/env node

/**
 * Defuddle-Enhanced Search Index Generator (Astro port — markdown-only)
 *
 * Ported from scripts/generate-search-index-defuddle.js (root Nuxt repo).
 * Changes vs. original:
 *   - Reads markdown from astro/src/content/**\/*.{md,mdx}
 *   - Skips the "static HTML" pass (no build chicken-and-egg dependency)
 *   - Writes output to astro/public/data/search-index.json
 *   - Copies config from root config/fuse.config.json → astro/public/config/fuse.config.json
 *   - No Nuxt-specific imports
 *
 * News files are excluded from the index (blacklist in fuse.config.json).
 *
 * @version 1.0.0 (astro port)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import { Defuddle } from "defuddle/node";
import { glob } from "glob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// rootDir = astro/
const rootDir = path.resolve(__dirname, "..");
// repoRoot = repo root (one level above astro/)
const repoRoot = path.resolve(rootDir, "..");

// Console logging utilities with color support
const Logger = {
  colors: {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
  },

  info: (message, data = null) => {
    console.log(`${Logger.colors.green}✓${Logger.colors.reset} ${message}`);
    if (data && logLevel === "Detailed") {
      console.log(`${Logger.colors.cyan}  →${Logger.colors.reset}`, data);
    }
  },

  warning: (message, data = null) => {
    console.log(`${Logger.colors.yellow}⚠${Logger.colors.reset} ${message}`);
    if (data && logLevel === "Detailed") {
      console.log(`${Logger.colors.cyan}  →${Logger.colors.reset}`, data);
    }
  },

  error: (message, data = null) => {
    console.log(`${Logger.colors.red}✗${Logger.colors.reset} ${message}`);
    if (data) {
      console.log(`${Logger.colors.cyan}  →${Logger.colors.reset}`, data);
    }
  },

  status: (message, data = null) => {
    console.log(`${Logger.colors.blue}ℹ${Logger.colors.reset} ${message}`);
    if (data && logLevel === "Detailed") {
      console.log(`${Logger.colors.cyan}  →${Logger.colors.reset}`, data);
    }
  },
};

// Parse command line arguments
const args = process.argv.slice(2);
let logLevel = "Normal";

const logLevelIndex = args.indexOf("--log-level");
if (logLevelIndex !== -1 && args[logLevelIndex + 1]) {
  logLevel = args[logLevelIndex + 1];
}

Logger.info(
  `Starting Astro search index generation — markdown-only pass (Log Level: ${logLevel})`
);

/**
 * Load fuse configuration from root config/fuse.config.json
 */
async function loadConfig() {
  try {
    // Config lives in the root repo's config/ directory
    const configPath = path.join(repoRoot, "config", "fuse.config.json");
    const configContent = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(configContent);

    // Override paths for Astro layout
    config.indexing.paths.content = "src/content";
    config.indexing.paths.output = "public/data";
    config.baseURL = "https://vpp.icjia.illinois.gov";

    Logger.info("Configuration loaded successfully");
    return config;
  } catch (error) {
    Logger.warning("Could not load fuse.config.json, using defaults");
    return {
      baseURL: "https://vpp.icjia.illinois.gov",
      indexing: {
        blacklist: {
          markdown: ["sandbox.md", "sandbox-*.md", "news.md", "news/*.md"],
          paths: ["/news", "/news/*", "news/*"],
        },
        paths: {
          content: "src/content",
          output: "public/data",
          outputFile: "search-index.json",
        },
      },
    };
  }
}

/**
 * Normalize path and construct fullPath
 */
function normalizePathAndConstructFullPath(rawPath, baseURL) {
  let normalizedPath = rawPath === "/index" ? "/" : rawPath;

  if (!normalizedPath.startsWith("/")) {
    normalizedPath = "/" + normalizedPath;
  }

  let fullPath;
  if (normalizedPath === "/") {
    fullPath = baseURL;
  } else {
    fullPath = baseURL + normalizedPath;
  }

  return { path: normalizedPath, fullPath };
}

/**
 * Security: sanitize content for indexing
 */
function sanitizeContentForIndexing(content) {
  if (!content || typeof content !== "string") return "";

  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:text\/html/gi, "")
    .trim();
}

/**
 * Check if content contains dangerous patterns
 */
function containsDangerousContent(content) {
  if (!content || typeof content !== "string") return false;

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
    /expression\s*\(/i,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(content));
}

/**
 * Check if a file should be blacklisted based on filename patterns
 */
function isBlacklisted(filePath, blacklistPatterns) {
  if (!blacklistPatterns || blacklistPatterns.length === 0) return false;

  const fileName = path.basename(filePath);
  return blacklistPatterns.some((pattern) => {
    const regexPattern = pattern.replace(/\*/g, ".*").replace(/\?/g, ".");
    const regex = new RegExp(`^${regexPattern}$`, "i");
    return regex.test(fileName);
  });
}

/**
 * Check if a path should be blacklisted based on path patterns
 */
function isPathBlacklisted(filePath, pathPatterns) {
  if (!pathPatterns || pathPatterns.length === 0) return false;

  const normalizedPath = filePath.replace(/\\/g, "/");

  return pathPatterns.some((pattern) => {
    const regexPattern = pattern.replace(/\*/g, ".*").replace(/\?/g, ".");
    const regex = new RegExp(regexPattern, "i");
    return regex.test(normalizedPath) || regex.test(`/${normalizedPath}`);
  });
}

/**
 * Convert HTML to plain text
 */
function htmlToPlainText(html) {
  if (!html || typeof html !== "string") return "";

  return (
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/::[a-zA-Z-]+::/g, " ")
      .replace(/::[a-zA-Z-]+/g, " ")
      .replace(/^::/gm, " ")
      .replace(/::$/gm, " ")
      .replace(/\b\w+\s*=\s*["'][^"']*["']/g, " ")
      .replace(/\b\w+\s*=\s*[^\s>]+/g, " ")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/#{1,6}\s+/g, "")
      .replace(/---+/g, " ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/v-[a-zA-Z-]+\s*=\s*["'][^"']*["']/g, " ")
      .replace(/@[a-zA-Z-]+\s*=\s*["'][^"']*["']/g, " ")
      .replace(/\{\{[^}]*\}\}/g, " ")
      .replace(/[&<>]/g, " ")
      .replace(/\/>/g, " ")
      .replace(/[^\w\s\-.,!?;:()\[\]]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .replace(/^\s+|\s+$/g, "")
      .replace(/([.!?;:])/g, " $1 ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Temporarily suppress Defuddle's internal URL-parsing console errors
 */
async function suppressConsoleErrors(fn) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(" ");
    if (
      message.includes("Error in findExtractor: TypeError: Invalid URL") ||
      message.includes("ERR_INVALID_URL")
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  try {
    return await fn();
  } finally {
    console.error = originalConsoleError;
  }
}

/**
 * Extract content from HTML using Defuddle
 */
async function extractContentWithDefuddle(htmlContent, url) {
  try {
    const dom = new JSDOM(htmlContent, { url });

    const result = await suppressConsoleErrors(async () => {
      return await Defuddle(dom, {
        debug: false,
        markdown: false,
        url: url,
      });
    });

    const plainTextContent = htmlToPlainText(result.content);
    const plainTextDescription = htmlToPlainText(result.description);

    return {
      title: result.title || "",
      content: plainTextContent,
      description: plainTextDescription,
      wordCount: result.wordCount || 0,
    };
  } catch (error) {
    if (
      error.message.includes("Invalid URL") ||
      error.code === "ERR_INVALID_URL"
    ) {
      try {
        const result = await suppressConsoleErrors(async () => {
          return await Defuddle(htmlContent, { debug: false, markdown: false });
        });

        return {
          title: result.title || "",
          content: htmlToPlainText(result.content),
          description: htmlToPlainText(result.description),
          wordCount: result.wordCount || 0,
        };
      } catch (fallbackError) {
        Logger.error(
          `Defuddle extraction failed for ${url}`,
          fallbackError.message
        );
        return { title: "", content: "", description: "", wordCount: 0 };
      }
    } else {
      Logger.error(`Defuddle extraction failed for ${url}`, error.message);
      return { title: "", content: "", description: "", wordCount: 0 };
    }
  }
}

/**
 * Process markdown/mdx content files from astro/src/content/
 */
async function processMarkdownContent(config) {
  // contentDir = astro/src/content
  const contentDir = path.join(rootDir, config.indexing.paths.content);
  const searchItems = [];

  if (!fs.existsSync(contentDir)) {
    Logger.warning("Content directory not found, skipping markdown processing");
    return searchItems;
  }

  Logger.info("Processing markdown content files...");

  // Find all md and mdx files
  const markdownFiles = glob.sync("**/*.{md,mdx}", { cwd: contentDir });

  let processedCount = 0;
  let skippedCount = 0;

  for (const file of markdownFiles) {
    // Check filename blacklist
    if (isBlacklisted(file, config.indexing.blacklist.markdown)) {
      Logger.warning(`Skipping blacklisted markdown file: ${file}`);
      skippedCount++;
      continue;
    }

    // Check path blacklist (covers news/*)
    if (isPathBlacklisted(file, config.indexing.blacklist.paths)) {
      Logger.warning(`Skipping path-blacklisted markdown file: ${file}`);
      skippedCount++;
      continue;
    }

    try {
      const filePath = path.join(contentDir, file);
      const content = fs.readFileSync(filePath, "utf8");

      // Parse frontmatter
      const frontmatterMatch = content.match(
        /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
      );
      let frontmatter = {};
      let bodyContent = content;

      if (frontmatterMatch) {
        try {
          const yamlContent = frontmatterMatch[1];
          const lines = yamlContent.split("\n");
          for (const line of lines) {
            const match = line.match(/^(\w+):\s*["']?([^"']+)["']?$/);
            if (match) {
              frontmatter[match[1]] = match[2];
            }
          }
          bodyContent = frontmatterMatch[2];
        } catch (error) {
          Logger.warning(`Could not parse frontmatter for ${file}`);
        }
      }

      // Build simple HTML for Defuddle
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${frontmatter.title || path.basename(file, path.extname(file))}</title>
          <meta name="description" content="${frontmatter.description || ""}">
        </head>
        <body>
          <article>
            ${bodyContent
              .replace(/^#{1,6}\s+(.+)$/gm, "<h2>$1</h2>")
              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
              .replace(/\*(.+?)\*/g, "<em>$1</em>")
              .replace(/\n\n/g, "</p><p>")
              .replace(/^(.+)$/gm, "<p>$1</p>")
              .replace(/<p><h/g, "<h")
              .replace(/h><\/p>/g, "h>")}
          </article>
        </body>
        </html>
      `;

      // Strip .md/.mdx and trailing /index for the route path
      const rawPath =
        "/" +
        file
          .replace(/\.(md|mdx)$/, "")
          .replace(/\/index$/, "");

      const extracted = await extractContentWithDefuddle(
        htmlContent,
        `http://localhost${rawPath}`
      );

      if (!extracted.content.trim()) {
        Logger.warning(`Skipping ${file} - no meaningful content extracted`);
        skippedCount++;
        continue;
      }

      if (containsDangerousContent(extracted.content)) {
        Logger.warning(
          `Potentially dangerous content in ${file}, applying sanitization`
        );
      }

      const { path: normalizedPath, fullPath } =
        normalizePathAndConstructFullPath(rawPath, config.baseURL);

      const searchItem = {
        title: sanitizeContentForIndexing(
          extracted.title ||
            frontmatter.title ||
            path.basename(file, path.extname(file))
        ),
        content: sanitizeContentForIndexing(extracted.content),
        path: normalizedPath,
        fullPath: fullPath,
        description: sanitizeContentForIndexing(
          extracted.description ||
            frontmatter.description ||
            extracted.content.substring(0, 160) + "..."
        ),
        frontmatter: frontmatter,
        type: "markdown",
        sourceFile: file,
        wordCount: extracted.wordCount,
      };

      searchItems.push(searchItem);
      processedCount++;

      if (logLevel === "Detailed") {
        Logger.info(`Processed: ${file}`, {
          title: searchItem.title,
          contentLength: searchItem.content.length,
          wordCount: searchItem.wordCount,
        });
      }
    } catch (error) {
      Logger.error(`Error processing ${file}`, error.message);
      skippedCount++;
    }
  }

  Logger.info(
    `Markdown processing complete: ${processedCount} processed, ${skippedCount} skipped`
  );
  return searchItems;
}

/**
 * Main: generate the search index (markdown-only, no static HTML pass)
 */
async function generateSearchIndex() {
  try {
    Logger.info("Starting search index generation (markdown-only pass)...");

    const config = await loadConfig();

    // Markdown-only — skip processStaticHTML to avoid build-order dependency
    const markdownItems = await processMarkdownContent(config);

    // Deduplicate by path
    const uniqueItems = [];
    const seenPaths = new Set();

    for (const item of markdownItems) {
      if (!seenPaths.has(item.path)) {
        seenPaths.add(item.path);
        uniqueItems.push(item);
      } else {
        Logger.warning(`Duplicate path skipped: ${item.path}`);
      }
    }

    Logger.info(
      `Search index generation complete: ${uniqueItems.length} unique items`
    );

    // Write output
    const outputDir = path.join(rootDir, config.indexing.paths.output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, config.indexing.paths.outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(uniqueItems, null, 2));
    Logger.info(`Search index saved to: ${outputPath}`);

    // Copy fuse.config.json to astro/public/config/ for runtime browser access
    const publicConfigDir = path.join(rootDir, "public", "config");
    if (!fs.existsSync(publicConfigDir)) {
      fs.mkdirSync(publicConfigDir, { recursive: true });
    }

    const configSourcePath = path.join(repoRoot, "config", "fuse.config.json");
    const configDestPath = path.join(publicConfigDir, "fuse.config.json");

    if (fs.existsSync(configSourcePath)) {
      fs.copyFileSync(configSourcePath, configDestPath);
      Logger.info("fuse.config.json copied to public/config/");
    } else {
      Logger.warning("Root config/fuse.config.json not found — skipping copy");
    }

    Logger.info("Search index generation completed successfully!");
  } catch (error) {
    Logger.error("Search index generation failed", error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateSearchIndex();
}

export {
  loadConfig,
  normalizePathAndConstructFullPath,
  sanitizeContentForIndexing,
  containsDangerousContent,
  isBlacklisted,
  isPathBlacklisted,
  htmlToPlainText,
  extractContentWithDefuddle,
  processMarkdownContent,
  generateSearchIndex,
  Logger,
};
