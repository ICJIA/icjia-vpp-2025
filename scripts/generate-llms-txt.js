/**
 * LLMS.txt Generator
 *
 * Automatically generates an llms.txt file following the specification at https://llmstxt.org/
 * This script extracts content from report pages (those under the "Read the Plan" menu section)
 * and formats them according to the llms.txt standard for LLM consumption.
 *
 * The generated file is placed in public/llms.txt to be accessible at the site root.
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 */

import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

import { createLogger } from "../app/utils/logger.js";
import {
  createScriptLoggerConfig,
  getVerbosityFromArgs,
} from "../app/utils/config-loader.js";

/**
 * LLMS.txt Generator Class
 *
 * Handles the extraction and formatting of report content into llms.txt format
 */
class LLMSTxtGenerator {
  constructor(options = {}) {
    this.menuConfig = null;
    this.reportPages = [];
    this.stats = {
      totalPages: 0,
      processedPages: 0,
      skippedPages: 0,
    };
    this.logger = null; // Will be initialized in generate()
    this.options = options;
  }

  /**
   * Load site configuration to identify report pages
   *
   * @returns {Promise<void>}
   */
  async loadMenuConfig() {
    try {
      const siteConfigPath = path.join(
        process.cwd(),
        "config/site.config.json"
      );
      const siteConfigContent = await fs.readFile(siteConfigPath, "utf-8");
      this.menuConfig = JSON.parse(siteConfigContent);
      this.logger?.info("Loaded site configuration");
    } catch (error) {
      this.logger?.error("Failed to load site configuration");
      throw error;
    }
  }

  /**
   * Extract report page paths from "Read the Plan" menu section
   *
   * @returns {Array<Object>} Array of page objects with path, text, and summary
   */
  getReportPages() {
    if (!this.menuConfig) {
      throw new Error("Site configuration not loaded");
    }

    const readThePlanMenuConfig =
      this.menuConfig.ui?.navigation?.readThePlanMenu;

    if (!readThePlanMenuConfig || !readThePlanMenuConfig.enabled) {
      throw new Error('Could not find enabled "Read the Plan" menu section');
    }

    if (!readThePlanMenuConfig.items) {
      throw new Error('No items found in "Read the Plan" menu section');
    }

    const pages = [];
    Object.entries(readThePlanMenuConfig.items).forEach(([key, item]) => {
      if (item.enabled && item.to) {
        pages.push({
          path: item.to,
          title: item.text,
          summary: item.summary || "",
          ariaLabel: item.ariaLabel || "",
        });
      }
    });

    return pages;
  }

  /**
   * Read and process a markdown content file
   *
   * @param {string} contentPath - Path to the content file (without .md extension)
   * @returns {Promise<Object|null>} Processed content object or null if failed
   */
  async processContentFile(contentPath) {
    try {
      // Convert URL path to file path
      const filePath = path.join(
        process.cwd(),
        "content",
        `${contentPath.replace(/^\//, "")}.md`
      );

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        this.logger?.warning(`Content file not found: ${filePath}`);
        this.stats.skippedPages++;
        return null;
      }

      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data: frontmatter } = matter(fileContent);

      this.stats.processedPages++;

      return {
        title: frontmatter.title || "Untitled",
        description: frontmatter.description || "",
        path: contentPath,
        filePath: filePath,
      };
    } catch (error) {
      this.logger?.error(
        `Failed to process content file ${contentPath}: ${error.message}`
      );
      this.stats.skippedPages++;
      return null;
    }
  }

  /**
   * Generate the llms.txt content according to the llms.txt specification
   * Following the format at https://llmstxt.org/
   *
   * @param {Array<Object>} processedPages - Array of processed page metadata
   * @returns {string} Formatted llms.txt content
   */
  generateLLMSTxtContent(processedPages) {
    const lines = [];

    // H1 title (required)
    lines.push("# Statewide Violence Prevention Plan for Illinois: 2025-2029");
    lines.push("");

    // Blockquote summary (optional but recommended)
    lines.push(
      "> This comprehensive violence prevention plan outlines Illinois's strategic approach to preventing violence through evidence-based practices, equity advancement, and collaborative efforts across state, municipal, and community-based agencies for 2025-2029."
    );
    lines.push("");

    // Optional details section
    lines.push("This plan presents three primary violence prevention goals:");
    lines.push(
      "1. **Prevent violence and promote health and safety** through trauma-informed, evidence-based prevention efforts"
    );
    lines.push(
      "2. **Advance equity** by increasing access to grants and economic opportunities"
    );
    lines.push(
      "3. **Promote collaboration** across agencies, informed by research, data sharing, and best practices"
    );
    lines.push("");
    lines.push(
      "The plan was developed by the Illinois Criminal Justice Information Authority (ICJIA) in collaboration with the Ad Hoc Violence Prevention Committee and various workgroups, building upon the previous 2020-2024 plan with updated research, implementation findings, and community feedback."
    );
    lines.push("");

    // Main content sections - following llms.txt specification
    lines.push("## Plan Content");
    lines.push("");

    for (const page of processedPages) {
      if (page && page.title && page.path) {
        const baseUrl = "https://vpp-2025.netlify.app";
        const fullUrl = `${baseUrl}${page.path}`;

        // Create markdown link with description following llms.txt spec
        const linkText = `[${page.title}](${fullUrl})`;
        const description = page.description ? `: ${page.description}` : "";

        lines.push(`- ${linkText}${description}`);
      }
    }

    lines.push("");

    // Optional section for supplementary content
    lines.push("## Optional");
    lines.push("");
    lines.push(
      "- [Full PDF Report](https://vpp-2025.netlify.app/files/Full_Report_Statewide_Violence_Prevention_Plan_2025-2029_2025_Update.pdf): Complete downloadable version of the violence prevention plan"
    );
    lines.push(
      "- [ICJIA Website](https://icjia.illinois.gov): Illinois Criminal Justice Information Authority main website"
    );
    lines.push(
      "- [Project Repository](https://github.com/ICJIA/icjia-vpp-2025): Source code and development information"
    );

    return lines.join("\n");
  }

  /**
   * Write the generated llms.txt content to the public directory
   *
   * @param {string} content - The formatted llms.txt content
   * @returns {Promise<void>}
   */
  async writeLLMSTxtFile(content) {
    try {
      // Ensure public directory exists
      const publicDir = path.join(process.cwd(), "public");
      await fs.mkdir(publicDir, { recursive: true });

      // Write the llms.txt file
      const outputPath = path.join(publicDir, "llms.txt");
      await fs.writeFile(outputPath, content, "utf-8");

      this.logger?.success(`✅ Generated llms.txt file: ${outputPath}`);
      this.logger?.info(
        `📊 File size: ${(content.length / 1024).toFixed(2)} KB`
      );
    } catch (error) {
      this.logger?.error(`Failed to write llms.txt file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Display generation statistics
   */
  displayStats() {
    this.logger?.info("📊 LLMS.txt Generation Statistics:");
    this.logger?.info(`   Total pages identified: ${this.stats.totalPages}`);
    this.logger?.info(
      `   Successfully processed: ${this.stats.processedPages}`
    );
    this.logger?.info(`   Skipped pages: ${this.stats.skippedPages}`);
  }

  /**
   * Main generation method
   *
   * @returns {Promise<void>}
   */
  async generate() {
    // Initialize logger
    const verbosity = getVerbosityFromArgs();
    const loggerOptions = verbosity ? { level: verbosity } : {};
    const loggerConfig = await createScriptLoggerConfig(
      "LLMS.txt Generator",
      loggerOptions
    );
    this.logger = createLogger(loggerConfig);

    this.logger?.info("🚀 Starting LLMS.txt generation...");

    try {
      // Load menu configuration
      await this.loadMenuConfig();

      // Get report pages from menu
      const reportPages = this.getReportPages();
      this.stats.totalPages = reportPages.length;

      this.logger?.info(
        `📄 Found ${reportPages.length} report pages to process`
      );

      // Process each content file
      const processedPages = [];
      for (const page of reportPages) {
        this.logger?.debug(`Processing: ${page.path}`);
        const processedPage = await this.processContentFile(page.path);
        if (processedPage) {
          // Merge menu metadata with processed content
          processedPage.menuTitle = page.title;
          processedPage.menuSummary = page.summary;
          processedPages.push(processedPage);
        }
      }

      // Generate llms.txt content
      const llmsTxtContent = this.generateLLMSTxtContent(processedPages);

      // Write to public directory
      await this.writeLLMSTxtFile(llmsTxtContent);

      // Display statistics
      this.displayStats();

      this.logger?.success("✅ LLMS.txt generation completed successfully!");
    } catch (error) {
      this.logger?.error(`❌ LLMS.txt generation failed: ${error.message}`);
      if (this.options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  const generator = new LLMSTxtGenerator({
    verbose: process.argv.includes("--verbose") || process.argv.includes("-v"),
  });

  await generator.generate();
}

// Execute if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
