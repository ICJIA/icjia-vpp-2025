/**
 * Sitemap Generator
 *
 * Generates a comprehensive XML sitemap for the Violence Prevention Plan for Illinois: 2025-2029.
 * This script integrates with the existing site configuration system to discover all routes
 * and create a valid sitemap.xml file following the sitemaps.org protocol.
 *
 * Features:
 * - Integrates with existing site configuration system
 * - Respects blacklist patterns from search indexing
 * - Supports frontmatter exclusions (includeInSiteMap: false)
 * - Configurable priorities and change frequencies
 * - Automatic URL sanitization to prevent template syntax artifacts
 * - XML validation and duplicate detection
 * - Color-coded logging following project conventions
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 */

import { promises as fs } from "fs";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";

import { createLogger } from "../utils/logger.js";
import {
  createScriptLoggerConfig,
  getVerbosityFromArgs,
} from "../utils/config-loader.js";

/**
 * Sitemap Generator Class
 *
 * Handles the generation of XML sitemaps based on discovered routes
 * and configuration settings.
 */
class SitemapGenerator {
  constructor(options = {}) {
    this.config = null;
    this.siteConfig = null;
    this.routes = [];
    this.stats = {
      totalRoutes: 0,
      includedRoutes: 0,
      excludedRoutes: 0,
      duplicatesRemoved: 0,
    };
    this.logger = null;
    this.options = options;
  }

  /**
   * Load sitemap configuration from config files
   *
   * @returns {Promise<void>}
   */
  async loadConfiguration() {
    try {
      // Load sitemap-specific configuration
      const sitemapConfigPath = path.join(
        process.cwd(),
        "config/sitemap.config.json",
      );
      const sitemapConfigContent = await fs.readFile(
        sitemapConfigPath,
        "utf-8",
      );
      this.config = JSON.parse(sitemapConfigContent);

      // Load site configuration for routes
      const siteConfigPath = path.join(
        process.cwd(),
        "config/routes.config.json",
      );
      const siteConfigContent = await fs.readFile(siteConfigPath, "utf-8");
      this.siteConfig = JSON.parse(siteConfigContent);

      this.logger?.info("✅ Loaded sitemap and site configurations");
    } catch (error) {
      this.logger?.error("❌ Failed to load configuration:", error.message);
      throw error;
    }
  }

  /**
   * Check if a route should be excluded from the sitemap
   *
   * @param {Object} route - Route object from site configuration
   * @returns {boolean} True if route should be excluded
   */
  shouldExcludeRoute(route) {
    const exclusions = this.config.sitemap.exclusions;

    // Check pattern exclusions
    for (const pattern of exclusions.patterns) {
      if (pattern.includes("*")) {
        // Handle glob patterns
        const regex = new RegExp(pattern.replace(/\*/g, ".*"));
        if (regex.test(route.path)) {
          return true;
        }
      } else if (route.path === pattern) {
        return true;
      }
    }

    // Check frontmatter exclusions for markdown files
    if (route.type === "content" && route.source) {
      try {
        const filePath = path.join(process.cwd(), "content", route.source);
        const fileContent = require("fs").readFileSync(filePath, "utf-8");
        const { data: frontmatter } = matter(fileContent);

        if (
          frontmatter[exclusions.frontmatterKey] === exclusions.frontmatterValue
        ) {
          return true;
        }
      } catch (error) {
        // File might not exist or be readable, continue
      }
    }

    return false;
  }

  /**
   * Sanitize URL to remove template syntax artifacts
   *
   * @param {string} url - URL to sanitize
   * @returns {string} Sanitized URL
   */
  sanitizeUrl(url) {
    return (
      url
        .replace(/\{\{.*?\}\}/g, "") // Remove {{ }} template syntax
        .replace(/\$\{.*?\}/g, "") // Remove ${ } template syntax
        .replace(/<%.*?%>/g, "") // Remove <% %> template syntax
        .replace(/\/+/g, "/") // Replace multiple slashes with single slash
        .replace(/\/$/, "") || "/"
    ); // Remove trailing slash except for root
  }

  /**
   * Get file modification time for lastmod
   *
   * @param {Object} route - Route object
   * @returns {string} ISO date string
   */
  async getLastModified(route) {
    try {
      let filePath;

      if (route.type === "content" && route.source) {
        filePath = path.join(process.cwd(), "content", route.source);
      } else if (route.type === "vue" && route.source) {
        filePath = path.join(process.cwd(), route.source);
      }

      if (filePath) {
        const stats = await fs.stat(filePath);
        return stats.mtime.toISOString();
      }
    } catch (error) {
      // If we can't get file stats, use current date
    }

    return new Date().toISOString();
  }

  /**
   * Get priority for a route
   *
   * @param {string} path - Route path
   * @returns {number} Priority value
   */
  getPriority(path) {
    const priorities = this.config.sitemap.priorities;
    return priorities[path] || this.config.sitemap.defaultPriority;
  }

  /**
   * Get change frequency for a route
   *
   * @param {string} path - Route path
   * @returns {string} Change frequency
   */
  getChangeFrequency(path) {
    const frequencies = this.config.sitemap.changeFrequencies;
    return frequencies[path] || this.config.sitemap.defaultChangeFreq;
  }

  /**
   * Process routes from site configuration
   *
   * @returns {Promise<void>}
   */
  async processRoutes() {
    this.logger?.info("🔍 Processing routes from site configuration...");

    const allRoutes = this.siteConfig.pages || [];
    this.stats.totalRoutes = allRoutes.length;

    const processedRoutes = new Map(); // Use Map to prevent duplicates

    for (const route of allRoutes) {
      // Check if route should be excluded
      if (this.shouldExcludeRoute(route)) {
        this.stats.excludedRoutes++;
        this.logger?.addToGroup("warning", `Excluded route: ${route.path}`);
        continue;
      }

      // Sanitize the URL
      const sanitizedPath = this.sanitizeUrl(route.path);
      const fullUrl =
        this.config.sitemap.baseUrl.replace(/\/$/, "") + sanitizedPath;

      // Check for duplicates
      if (processedRoutes.has(sanitizedPath)) {
        this.stats.duplicatesRemoved++;
        this.logger?.addToGroup(
          "warning",
          `Duplicate route removed: ${sanitizedPath}`,
        );
        continue;
      }

      // Get metadata for the route
      const lastmod = await this.getLastModified(route);
      const priority = this.getPriority(sanitizedPath);
      const changefreq = this.getChangeFrequency(sanitizedPath);

      const sitemapEntry = {
        loc: fullUrl,
        lastmod,
        changefreq,
        priority,
      };

      processedRoutes.set(sanitizedPath, sitemapEntry);
      this.stats.includedRoutes++;
      this.logger?.addToGroup("success", `Added route: ${sanitizedPath}`);
    }

    this.routes = Array.from(processedRoutes.values());
    this.logger?.info(
      `📊 Route processing complete: ${this.stats.includedRoutes} included, ${this.stats.excludedRoutes} excluded, ${this.stats.duplicatesRemoved} duplicates removed`,
    );
  }

  /**
   * Generate XML sitemap content
   *
   * @returns {string} XML sitemap content
   */
  generateXML() {
    this.logger?.info("📝 Generating XML sitemap...");

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const route of this.routes) {
      xml += "  <url>\n";
      xml += `    <loc>${route.loc}</loc>\n`;
      xml += `    <lastmod>${route.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += "  </url>\n";
    }

    xml += "</urlset>\n";

    return xml;
  }

  /**
   * Validate XML sitemap
   *
   * @param {string} xml - XML content to validate
   * @returns {boolean} True if valid
   */
  validateXML(xml) {
    if (!this.config.validation.validateXML) {
      return true;
    }

    this.logger?.info("🔍 Validating XML sitemap...");

    // Basic XML validation
    try {
      // Check for required elements
      if (!xml.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
        throw new Error("Missing XML declaration");
      }

      if (
        !xml.includes(
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        )
      ) {
        throw new Error("Missing or invalid urlset element");
      }

      if (!xml.includes("</urlset>")) {
        throw new Error("Missing closing urlset tag");
      }

      // Check URL count
      const urlCount = (xml.match(/<url>/g) || []).length;
      if (urlCount > this.config.validation.maxUrls) {
        throw new Error(
          `Too many URLs: ${urlCount} (max: ${this.config.validation.maxUrls})`,
        );
      }

      this.logger?.success("✅ XML sitemap validation passed");
      return true;
    } catch (error) {
      this.logger?.error("❌ XML sitemap validation failed:", error.message);
      return false;
    }
  }

  /**
   * Write sitemap to file
   *
   * @param {string} xml - XML content to write
   * @returns {Promise<void>}
   */
  async writeSitemap(xml) {
    const outputPath = path.join(process.cwd(), this.config.sitemap.outputPath);

    try {
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      // Write sitemap file
      await fs.writeFile(outputPath, xml, "utf-8");

      this.logger?.success(`✅ Sitemap written to ${outputPath}`);
    } catch (error) {
      this.logger?.error(
        `❌ Failed to write sitemap to ${outputPath}:`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Generate the complete sitemap
   *
   * @returns {Promise<void>}
   */
  async generate() {
    // Initialize logger
    const verbosity = getVerbosityFromArgs() || "NORMAL";
    const loggerConfig = await createScriptLoggerConfig("SitemapGenerator", {
      level: verbosity,
      groupMessages: true,
    });
    this.logger = createLogger(loggerConfig).createScope("SitemapGenerator");

    this.logger.info("🗺️  Starting sitemap generation...");

    try {
      // Load configuration
      await this.loadConfiguration();

      // Process routes
      await this.processRoutes();

      // Generate XML
      const xml = this.generateXML();

      // Validate XML
      if (!this.validateXML(xml)) {
        throw new Error("XML validation failed");
      }

      // Write sitemap
      await this.writeSitemap(xml);

      // Log final statistics
      this.logger.success("🎉 Sitemap generation completed successfully!");
      this.logger.info("📊 Final Statistics:", {
        totalRoutes: this.stats.totalRoutes,
        includedRoutes: this.stats.includedRoutes,
        excludedRoutes: this.stats.excludedRoutes,
        duplicatesRemoved: this.stats.duplicatesRemoved,
      });
    } catch (error) {
      this.logger.error("❌ Sitemap generation failed:", error.message);
      process.exit(1);
    }
  }
}

// Run the generator if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new SitemapGenerator();
  generator.generate();
}

export { SitemapGenerator };
