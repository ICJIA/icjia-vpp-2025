/**
 * Site Configuration Generator
 *
 * Automatically discovers and catalogs all pages in the project,
 * extracting metadata and generating a comprehensive site map.
 *
 * This script scans both Nuxt Content markdown files and Vue pages,
 * extracting titles and metadata to create a complete site catalog.
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 */

import { promises as fs } from "fs";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";

import { createLogger } from "../app/utils/logger.js";
import {
  createScriptLoggerConfig,
  getVerbosityFromArgs,
} from "../app/utils/config-loader.js";

/**
 * Enhanced Site Configuration Generator Class
 *
 * Handles the discovery and cataloging of all pages in the project with
 * enhanced routing configuration, menu integration, and build-time optimization
 */
class SiteConfigGenerator {
  constructor(options = {}) {
    this.baseConfig = null;
    this.pages = [];
    this.menuConfig = null;
    this.stats = {
      totalPages: 0,
      contentPages: 0,
      vuePages: 0,
      combinedPages: 0,
      blacklistedFiles: 0,
      menuIntegratedPages: 0,
      orphanedPages: 0,
    };
    this.logger = null; // Will be initialized in generate()
    this.options = options;
    this.routeOptimizations = {
      duplicateRoutes: [],
      missingTitles: [],
      longPaths: [],
    };
  }

  /**
   * Load routing configuration from config/site.config.json
   *
   * @returns {Promise<void>}
   */
  async loadBaseConfig() {
    try {
      const configPath = path.join(process.cwd(), "config/site.config.json");
      const configContent = await fs.readFile(configPath, "utf-8");
      const siteConfig = JSON.parse(configContent);

      // Extract routing-specific configuration
      this.baseConfig = {
        baseUrl:
          siteConfig.urls?.baseUrl?.replace(/\/$/, "") ||
          "https://vpp-2025.netlify.app",
        blacklist: siteConfig.routing?.blacklist || {
          vue: ["sandbox.vue", "sandbox-*.vue"],
          markdown: ["sandbox.md", "sandbox-*.md"],
        },
        titleExtraction: siteConfig.routing?.titleExtraction || {
          fallbackPattern:
            "Statewide Violence Prevention Plan for Illinois: 2025-2029",
          maxLength: 100,
        },
        summary: siteConfig.metadata || {
          projectName:
            "Statewide Violence Prevention Plan for Illinois: 2025-2029",
          description:
            "Comprehensive site configuration for automatic page discovery and cataloging",
          version: "1.0.0",
        },
      };
      this.logger?.info(
        "Loaded routing configuration from config/site.config.json"
      );
    } catch (error) {
      this.logger?.warning("Site config file not found, using defaults");
      // Use defaults if config file doesn't exist
      this.baseConfig = {
        baseUrl: "https://vpp-2025.netlify.app",
        blacklist: {
          vue: ["sandbox.vue", "sandbox-*.vue"],
          markdown: ["sandbox.md", "sandbox-*.md"],
        },
        titleExtraction: {
          fallbackPattern:
            "Statewide Violence Prevention Plan for Illinois: 2025-2029",
          maxLength: 100,
        },
        summary: {
          projectName:
            "Statewide Violence Prevention Plan for Illinois: 2025-2029",
          description:
            "Comprehensive site configuration for automatic page discovery and cataloging",
          version: "1.0.0",
        },
      };
    }
  }

  /**
   * Load menu configuration for enhanced routing integration
   *
   * @returns {Promise<void>}
   */
  async loadMenuConfig() {
    try {
      const menuConfigPath = path.join(
        process.cwd(),
        "config/menu.config.json"
      );
      const menuConfigContent = await fs.readFile(menuConfigPath, "utf-8");
      this.menuConfig = JSON.parse(menuConfigContent);
      this.logger?.info("Loaded menu configuration for routing integration");
    } catch (error) {
      this.logger?.warning(
        "Menu config file not found, skipping menu integration"
      );
      this.menuConfig = null;
    }
  }

  /**
   * Check if a page is referenced in menu configuration
   *
   * @param {string} path - Page path to check
   * @returns {boolean} True if page is in menu
   */
  isPageInMenu(path) {
    if (!this.menuConfig) return false;

    // Check header menu items
    const headerItems = this.menuConfig.header?.items || [];
    const footerSections = this.menuConfig.footer?.sections || [];

    // Check all menu items
    const allMenuItems = [
      ...headerItems,
      ...footerSections.flatMap((section) => section.items || []),
    ];

    return allMenuItems.some(
      (item) =>
        item.href === path ||
        item.to === path ||
        (item.href && item.href.endsWith(path)) ||
        (item.to && item.to.endsWith(path))
    );
  }

  /**
   * Calculate enhanced statistics for routing optimization
   *
   * @param {Array} pages - Array of processed pages
   */
  calculateEnhancedStats(pages) {
    // Calculate menu integration statistics
    this.stats.menuIntegratedPages = pages.filter((page) =>
      this.isPageInMenu(page.path)
    ).length;
    this.stats.orphanedPages = pages.length - this.stats.menuIntegratedPages;

    // Identify route optimizations
    this.routeOptimizations.missingTitles = pages.filter(
      (page) =>
        !page.title ||
        page.title.includes("Violence Prevention Plan for Illinois: 2025-2029")
    );

    this.routeOptimizations.longPaths = pages.filter(
      (page) => page.path.length > 50
    );

    // Log optimization insights
    if (this.routeOptimizations.missingTitles.length > 0) {
      this.logger?.warning(
        `Found ${this.routeOptimizations.missingTitles.length} pages with generic titles`
      );
    }

    if (this.routeOptimizations.longPaths.length > 0) {
      this.logger?.info(
        `Found ${this.routeOptimizations.longPaths.length} pages with long paths (>50 chars)`
      );
    }

    if (this.stats.orphanedPages > 0) {
      this.logger?.info(
        `Found ${this.stats.orphanedPages} pages not referenced in menu configuration`
      );
    }
  }

  /**
   * Check if file should be blacklisted based on patterns
   *
   * @param {string} filePath - Path to the file
   * @param {string} type - Type of file ('vue' or 'markdown')
   * @returns {boolean} True if file should be blacklisted
   */
  isBlacklisted(filePath, type) {
    const blacklistPatterns = this.baseConfig.blacklist[type] || [];
    const fileName = path.basename(filePath);

    const isBlacklisted = blacklistPatterns.some((pattern) => {
      if (pattern.includes("*")) {
        const regex = new RegExp(pattern.replace("*", ".*"));
        return regex.test(fileName);
      }
      return fileName === pattern;
    });

    if (isBlacklisted) {
      this.stats.blacklistedFiles++;
      this.logger?.debug(`Blacklisted file: ${filePath}`);
    }

    return isBlacklisted;
  }

  /**
   * Extract title from markdown frontmatter
   *
   * @param {string} filePath - Path to the markdown file
   * @returns {Promise<string|null>} Extracted title or null
   */
  async extractMarkdownTitle(filePath) {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const { data } = matter(content);
      return data.title || null;
    } catch (error) {
      this.logger?.warning(
        `Failed to extract title from ${filePath}: ${error.message}`
      );
      return null;
    }
  }

  /**
   * Extract title from Vue component using various methods
   *
   * @param {string} filePath - Path to the Vue file
   * @returns {Promise<string|null>} Extracted title or null
   */
  async extractVueTitle(filePath) {
    try {
      const content = await fs.readFile(filePath, "utf-8");

      // Look for useHead title (most common pattern)
      const useHeadMatch = content.match(
        /useHead\s*\(\s*\{[^}]*title:\s*['"`]([^'"`]+)['"`]/
      );
      if (useHeadMatch) {
        return useHeadMatch[1];
      }

      // Look for computed useHead title
      const computedUseHeadMatch = content.match(
        /useHead\s*\(\s*\{[^}]*title:\s*computed\(\s*\(\)\s*=>\s*['"`]([^'"`]+)['"`]/
      );
      if (computedUseHeadMatch) {
        return computedUseHeadMatch[1];
      }

      // Look for template variables in title (fallback to default title)
      const templateVarMatch = content.match(
        /title:\s*['"`][^'"`]*\$\{[^}]+\}[^'"`]*['"`]/
      );
      if (templateVarMatch) {
        // If title contains template variables, try to extract default values
        const defaultTitleMatch = content.match(
          /defaultTitle\s*=\s*['"`]([^'"`]+)['"`]/
        );
        if (defaultTitleMatch) {
          return defaultTitleMatch[1];
        }
      }

      // Look for useSeoMeta title
      const seoMetaMatch = content.match(
        /useSeoMeta\s*\(\s*\{[^}]*title:\s*['"`]([^'"`]+)['"`]/
      );
      if (seoMetaMatch) {
        return seoMetaMatch[1];
      }

      // Look for JSDoc @page annotation with title
      const jsdocMatch = content.match(/@page\s+([^\n*]+)/);
      if (jsdocMatch) {
        return jsdocMatch[1].trim();
      }

      // Look for component name in JSDoc comments
      const componentMatch = content.match(
        /\*\s*([A-Z][a-zA-Z\s]+)\s*(?:page|component)/i
      );
      if (componentMatch) {
        return componentMatch[1].trim();
      }

      return null;
    } catch (error) {
      this.logger?.warning(
        `Failed to extract title from ${filePath}: ${error.message}`
      );
      return null;
    }
  }

  /**
   * Convert file path to URL path
   *
   * @param {string} filePath - File system path
   * @param {string} type - Type of file ('content' or 'vue')
   * @returns {string} URL path
   */
  filePathToUrlPath(filePath, type) {
    if (type === "content") {
      // Remove content/ prefix and .md extension
      let urlPath = filePath.replace(/^content\//, "").replace(/\.md$/, "");

      // Handle index files
      if (urlPath === "index" || urlPath.endsWith("/index")) {
        urlPath = urlPath.replace(/\/?index$/, "");
      }

      return "/" + urlPath;
    } else {
      // Remove pages/ prefix and .vue extension
      let urlPath = filePath.replace(/^pages\//, "").replace(/\.vue$/, "");

      // Handle index files
      if (urlPath === "index" || urlPath.endsWith("/index")) {
        urlPath = urlPath.replace(/\/?index$/, "");
      }

      return "/" + urlPath;
    }
  }

  /**
   * Generate fallback title from URL path
   *
   * @param {string} urlPath - URL path
   * @returns {string} Generated title
   */
  generateFallbackTitle(urlPath) {
    if (urlPath === "/" || urlPath === "") {
      return (
        this.baseConfig.titleExtraction?.fallbackPattern ||
        "Statewide Violence Prevention Plan for Illinois: 2025-2029"
      );
    }

    // Convert path to title case
    const segments = urlPath.split("/").filter(Boolean);
    const title = segments
      .map((segment) =>
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join(" - ");

    const baseName =
      this.baseConfig.titleExtraction?.fallbackPattern ||
      "Statewide Violence Prevention Plan for Illinois: 2025-2029";
    return `${title} - ${baseName}`;
  }

  /**
   * Process markdown files from the content directory
   *
   * @returns {Promise<void>}
   */
  async processMarkdownFiles() {
    this.logger?.info("📄 Processing markdown files from content directory...");

    try {
      const contentFiles = await glob("content/**/*.md", {
        cwd: process.cwd(),
      });
      this.logger?.debug(`📊 Found ${contentFiles.length} markdown files`);

      for (const filePath of contentFiles) {
        if (this.isBlacklisted(filePath, "markdown")) {
          this.logger?.addToGroup(
            "warning",
            `Skipped blacklisted file: ${filePath}`
          );
          continue;
        }

        const title = await this.extractMarkdownTitle(filePath);
        const urlPath = this.filePathToUrlPath(filePath, "content");

        const pageEntry = {
          title: title || this.generateFallbackTitle(urlPath),
          path: urlPath,
          fullUrl: this.baseConfig.baseUrl.replace(/\/$/, "") + urlPath,
          type: "content",
          source: filePath,
        };

        this.pages.push(pageEntry);
        this.stats.contentPages++;

        this.logger?.addToGroup(
          "success",
          `Indexed markdown: ${filePath} -> ${urlPath}`
        );
      }

      this.logger?.info(
        `📊 Markdown processing complete: ${this.stats.contentPages} successful`
      );
    } catch (error) {
      this.logger?.error(`Failed to process markdown files: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process Vue page files from the pages directory
   *
   * @returns {Promise<void>}
   */
  async processVueFiles() {
    this.logger?.info("🖼️  Processing Vue files from pages directory...");

    try {
      const vueFiles = await glob("pages/**/*.vue", { cwd: process.cwd() });
      this.logger?.debug(`📊 Found ${vueFiles.length} Vue files`);

      for (const filePath of vueFiles) {
        if (this.isBlacklisted(filePath, "vue")) {
          this.logger?.addToGroup(
            "warning",
            `Skipped blacklisted file: ${filePath}`
          );
          continue;
        }

        const title = await this.extractVueTitle(filePath);
        const urlPath = this.filePathToUrlPath(filePath, "vue");

        const pageEntry = {
          title: title || this.generateFallbackTitle(urlPath),
          path: urlPath,
          fullUrl: this.baseConfig.baseUrl.replace(/\/$/, "") + urlPath,
          type: "vue",
          source: filePath,
        };

        this.pages.push(pageEntry);
        this.stats.vuePages++;

        this.logger?.addToGroup(
          "success",
          `Indexed Vue page: ${filePath} -> ${urlPath}`
        );
      }

      this.logger?.info(
        `📊 Vue processing complete: ${this.stats.vuePages} successful`
      );
    } catch (error) {
      this.logger?.error(`Failed to process Vue files: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deduplicate pages that map to the same URL path
   *
   * Implements intelligent merging of pages that have the same path but come from
   * different sources (e.g., both content/about.md and pages/about.vue mapping to /about)
   *
   * @returns {Array} Deduplicated array of page entries
   */
  deduplicatePages() {
    this.logger?.info("🔄 Starting page deduplication process...");

    // Group pages by path
    const pageGroups = new Map();

    for (const page of this.pages) {
      if (!pageGroups.has(page.path)) {
        pageGroups.set(page.path, []);
      }
      pageGroups.get(page.path).push(page);
    }

    const deduplicatedPages = [];
    let duplicatesFound = 0;

    for (const [path, pages] of pageGroups) {
      if (pages.length === 1) {
        // Single page, no deduplication needed but ensure consistent structure
        const page = pages[0];
        // Add sources array for consistency
        page.sources = [
          {
            type: page.type,
            source: page.source,
            title: page.title,
          },
        ];
        // Remove the old source field since we now use sources array
        delete page.source;
        deduplicatedPages.push(page);
      } else {
        // Multiple pages for the same path, merge them
        duplicatesFound++;
        const mergedPage = this.mergePages(pages, path);
        deduplicatedPages.push(mergedPage);

        this.logger?.debug(`🔗 Merged ${pages.length} pages for path: ${path}`);
        this.logger?.debug(
          `   Sources: ${pages.map((p) => p.source).join(", ")}`
        );
      }
    }

    this.logger?.info(
      `✅ Deduplication complete: ${duplicatesFound} duplicate paths merged`
    );
    this.logger?.debug(
      `📊 Final page count: ${deduplicatedPages.length} unique pages`
    );

    return deduplicatedPages;
  }

  /**
   * Merge multiple pages that map to the same path
   *
   * @param {Array} pages - Array of page objects to merge
   * @param {string} path - The common path for these pages
   * @returns {Object} Merged page object
   */
  mergePages(pages, path) {
    // Separate pages by type
    const contentPages = pages.filter((p) => p.type === "content");
    const vuePages = pages.filter((p) => p.type === "vue");

    // Determine the best title (prefer content titles over Vue titles)
    let bestTitle = "";
    let titleSource = "";

    if (contentPages.length > 0) {
      // Prefer content (markdown) titles
      const contentPage = contentPages[0];
      bestTitle = contentPage.title;
      titleSource = "content";
    } else if (vuePages.length > 0) {
      // Fall back to Vue titles, but clean them up
      const vuePage = vuePages[0];
      bestTitle = this.cleanVueTitle(vuePage.title);
      titleSource = "vue";
    } else {
      // Fallback to generated title
      bestTitle = this.generateFallbackTitle(path);
      titleSource = "generated";
    }

    // Determine the page type
    let pageType = "combined";
    if (contentPages.length > 0 && vuePages.length === 0) {
      pageType = "content";
    } else if (vuePages.length > 0 && contentPages.length === 0) {
      pageType = "vue";
    }

    // Create sources array with all source information
    const sources = pages.map((page) => ({
      type: page.type,
      source: page.source,
      title: page.title,
    }));

    // Update statistics
    if (pageType === "combined") {
      this.stats.combinedPages++;
    }

    this.logger?.debug(
      `   📝 Selected title: "${bestTitle}" (from ${titleSource})`
    );

    return {
      title: bestTitle,
      path: path,
      fullUrl: this.baseConfig.baseUrl.replace(/\/$/, "") + path,
      type: pageType,
      sources: sources,
    };
  }

  /**
   * Clean Vue component titles by removing template variables and improving formatting
   *
   * @param {string} title - Original Vue component title
   * @returns {string} Cleaned title
   */
  cleanVueTitle(title) {
    if (!title) return "";

    // Remove template variables like ${pageTitle.value}
    let cleaned = title.replace(/\$\{[^}]+\}/g, "");

    // Remove extra spaces and dashes
    cleaned = cleaned.replace(/\s*-\s*$/, "").trim();

    // If the title is now empty or too short, generate a fallback
    if (!cleaned || cleaned.length < 3) {
      return "";
    }

    return cleaned;
  }

  /**
   * Generate the complete site configuration
   *
   * @returns {Promise<Object>} Generated configuration object
   */
  async generate() {
    try {
      // Initialize logger with configuration
      const verbosity = getVerbosityFromArgs() || this.options.logLevel;
      const loggerConfig = await createScriptLoggerConfig("SiteConfig", {
        level: verbosity,
        groupMessages: true,
      });
      this.logger = createLogger(loggerConfig).createScope("SiteConfig");

      this.logger.time("generation");
      this.logger.info("🔍 Starting site configuration generation...");

      // Load base configuration
      await this.loadBaseConfig();

      // Load menu configuration for enhanced routing
      await this.loadMenuConfig();

      // Process all files
      await this.processMarkdownFiles();
      await this.processVueFiles();

      // Deduplicate pages with the same path
      const deduplicatedPages = this.deduplicatePages();

      // Enhanced statistics calculation
      this.calculateEnhancedStats(deduplicatedPages);

      // Calculate final stats
      this.stats.totalPages = deduplicatedPages.length;

      // Sort pages by path for consistency
      deduplicatedPages.sort((a, b) => a.path.localeCompare(b.path));

      // Create the complete configuration object
      const config = {
        baseUrl: this.baseConfig.baseUrl,
        generatedAt: new Date().toISOString(),
        summary: {
          projectName:
            this.baseConfig.summary?.projectName ||
            "Violence Prevention Plan for Illinois: 2025-2029",
          description:
            this.baseConfig.summary?.description ||
            "Comprehensive site configuration for automatic page discovery and cataloging",
          version: this.baseConfig.summary?.version || "1.0.0",
          totalPages: this.stats.totalPages,
          contentPages: this.stats.contentPages,
          vuePages: this.stats.vuePages,
          combinedPages: this.stats.combinedPages,
          blacklistedFiles: this.stats.blacklistedFiles,
        },
        pages: deduplicatedPages,
        stats: this.stats,
      };

      // Ensure output directories exist
      await fs.mkdir(path.join(process.cwd(), "config"), { recursive: true });
      await fs.mkdir(path.join(process.cwd(), "public/config"), {
        recursive: true,
      });

      // Write to config directory
      const outputPath = path.join(process.cwd(), "config/routes.config.json");
      await fs.writeFile(outputPath, JSON.stringify(config, null, 2));

      // Also write to public directory for runtime access
      const publicPath = path.join(
        process.cwd(),
        "public/config/routes.config.json"
      );
      await fs.writeFile(publicPath, JSON.stringify(config, null, 2));

      this.logger.timeEnd(
        "generation",
        "Routes configuration generation completed"
      );

      // Log success summary
      this.logger.success("✅ Routes configuration generated successfully!");
      this.logger.info(
        `📊 Summary: ${this.stats.totalPages} pages (${this.stats.contentPages} content, ${this.stats.vuePages} Vue, ${this.stats.combinedPages} combined, ${this.stats.blacklistedFiles} blacklisted)`
      );
      this.logger.debug(`📁 Files written to: ${outputPath} and ${publicPath}`);

      return config;
    } catch (error) {
      this.logger?.error(
        `Site configuration generation failed: ${error.message}`
      );
      throw error;
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new SiteConfigGenerator();
  generator.generate().catch((error) => {
    console.error("Site configuration generation failed:", error);
    process.exit(1);
  });
}

export default SiteConfigGenerator;
