/**
 * Plan JSON Generator
 *
 * Automatically generates a comprehensive plan.json file containing all content
 * from report pages (those under the "Read the Plan" menu section) with both
 * metadata and body content in JSON format.
 *
 * The generated file is placed in public/plan.json to be accessible at the site root.
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 */

import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { createLogger } from '../utils/logger.js';
import { createScriptLoggerConfig, getVerbosityFromArgs } from '../utils/config-loader.js';

/**
 * Plan JSON Generator Class
 *
 * Handles the extraction and formatting of report content into comprehensive JSON format
 */
class PlanJsonGenerator {
  constructor(options = {}) {
    this.menuConfig = null;
    this.reportPages = [];
    this.stats = {
      totalPages: 0,
      processedPages: 0,
      skippedPages: 0,
      totalContentLength: 0,
      totalMetadataFields: 0
    };
    this.logger = null; // Will be initialized in generate()
    this.options = options;
  }

  /**
   * Load menu configuration to identify report pages
   *
   * @returns {Promise<void>}
   */
  async loadMenuConfig() {
    try {
      const menuConfigPath = path.join(process.cwd(), 'config/menu.config.json');
      const menuConfigContent = await fs.readFile(menuConfigPath, 'utf-8');
      this.menuConfig = JSON.parse(menuConfigContent);
      this.logger?.info('Loaded menu configuration');
    } catch (error) {
      this.logger?.error('Failed to load menu configuration');
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
      throw new Error('Menu configuration not loaded');
    }

    const headerItems = this.menuConfig.header?.items || [];
    const readThePlanMenu = headerItems.find(item => item.text === "Read the Plan");
    
    if (!readThePlanMenu || !readThePlanMenu.children) {
      throw new Error('Could not find "Read the Plan" menu section');
    }

    return readThePlanMenu.children.map(child => ({
      path: child.to,
      title: child.text,
      summary: child.summary || '',
      ariaLabel: child.ariaLabel || ''
    }));
  }

  /**
   * Read and process a markdown content file with full metadata extraction
   *
   * @param {string} contentPath - Path to the content file (without .md extension)
   * @param {Object} menuData - Menu data for this page
   * @returns {Promise<Object|null>} Processed content object or null if failed
   */
  async processContentFile(contentPath, menuData) {
    try {
      // Convert URL path to file path
      const filePath = path.join(process.cwd(), 'content', `${contentPath.replace(/^\//, '')}.md`);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        this.logger?.warning(`Content file not found: ${filePath}`);
        this.stats.skippedPages++;
        return null;
      }

      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);

      // Clean the content - preserve markdown formatting but normalize spacing
      const cleanContent = content
        .trim()
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .replace(/^\s+|\s+$/gm, '') // Trim whitespace from each line
        .replace(/\n\n+/g, '\n\n'); // Normalize paragraph spacing

      this.stats.totalContentLength += cleanContent.length;
      this.stats.totalMetadataFields += Object.keys(frontmatter).length;
      this.stats.processedPages++;

      // Create comprehensive page object
      const pageObject = {
        // URL and identification
        path: contentPath,
        slug: contentPath.replace(/^\//, ''),
        
        // Menu metadata
        menuTitle: menuData.title,
        menuSummary: menuData.summary,
        menuAriaLabel: menuData.ariaLabel,
        
        // File metadata
        sourceFile: filePath.replace(process.cwd(), ''),
        
        // Frontmatter metadata (all YAML fields)
        meta: {
          ...frontmatter
        },
        
        // Body content
        body: cleanContent,
        
        // Content statistics
        stats: {
          contentLength: cleanContent.length,
          metadataFields: Object.keys(frontmatter).length,
          estimatedReadingTime: Math.ceil(cleanContent.split(/\s+/).length / 200) // ~200 words per minute
        }
      };

      return pageObject;

    } catch (error) {
      this.logger?.error(`Failed to process content file ${contentPath}: ${error.message}`);
      this.stats.skippedPages++;
      return null;
    }
  }

  /**
   * Generate the comprehensive plan JSON structure
   *
   * @param {Array<Object>} processedPages - Array of processed page content
   * @returns {Object} Complete plan JSON object
   */
  generatePlanJson(processedPages) {
    const planJson = {
      // Plan metadata
      planInfo: {
        title: "Statewide Violence Prevention Plan for Illinois: 2025-2029",
        description: "Comprehensive violence prevention plan outlining Illinois's strategic approach to preventing violence through evidence-based practices, equity advancement, and collaborative efforts across state, municipal, and community-based agencies for 2025-2029.",
        version: "2025-2029",
        organization: "Illinois Criminal Justice Information Authority (ICJIA)",
        generatedAt: new Date().toISOString(),
        baseUrl: "https://vpp-2025.netlify.app"
      },
      
      // Generation statistics
      generationStats: {
        totalPages: this.stats.totalPages,
        processedPages: this.stats.processedPages,
        skippedPages: this.stats.skippedPages,
        totalContentLength: this.stats.totalContentLength,
        totalMetadataFields: this.stats.totalMetadataFields,
        averageContentLength: Math.round(this.stats.totalContentLength / this.stats.processedPages),
        averageMetadataFields: Math.round(this.stats.totalMetadataFields / this.stats.processedPages)
      },
      
      // All plan pages with complete content and metadata
      pages: processedPages.filter(page => page !== null),
      
      // Quick reference index
      index: {
        pageCount: processedPages.filter(page => page !== null).length,
        paths: processedPages.filter(page => page !== null).map(page => page.path),
        titles: processedPages.filter(page => page !== null).map(page => page.meta.title || page.menuTitle),
        slugs: processedPages.filter(page => page !== null).map(page => page.slug)
      }
    };

    return planJson;
  }

  /**
   * Write the generated plan JSON to the public directory
   *
   * @param {Object} planJson - The complete plan JSON object
   * @returns {Promise<void>}
   */
  async writePlanJsonFile(planJson) {
    try {
      // Ensure public directory exists
      const publicDir = path.join(process.cwd(), 'public');
      await fs.mkdir(publicDir, { recursive: true });

      // Write the plan.json file with pretty formatting
      const outputPath = path.join(publicDir, 'plan.json');
      const jsonContent = JSON.stringify(planJson, null, 2);
      await fs.writeFile(outputPath, jsonContent, 'utf-8');

      this.logger?.success(`✅ Generated plan.json file: ${outputPath}`);
      this.logger?.info(`📊 File size: ${(jsonContent.length / 1024).toFixed(2)} KB`);
    } catch (error) {
      this.logger?.error(`Failed to write plan.json file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Display generation statistics
   */
  displayStats() {
    this.logger?.info('📊 Plan JSON Generation Statistics:');
    this.logger?.info(`   Total pages identified: ${this.stats.totalPages}`);
    this.logger?.info(`   Successfully processed: ${this.stats.processedPages}`);
    this.logger?.info(`   Skipped pages: ${this.stats.skippedPages}`);
    this.logger?.info(`   Total content length: ${(this.stats.totalContentLength / 1024).toFixed(2)} KB`);
    this.logger?.info(`   Total metadata fields: ${this.stats.totalMetadataFields}`);
    this.logger?.info(`   Average content per page: ${Math.round(this.stats.totalContentLength / this.stats.processedPages)} chars`);
    this.logger?.info(`   Average metadata per page: ${Math.round(this.stats.totalMetadataFields / this.stats.processedPages)} fields`);
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
    const loggerConfig = await createScriptLoggerConfig('Plan JSON Generator', loggerOptions);
    this.logger = createLogger(loggerConfig);

    this.logger?.info('🚀 Starting Plan JSON generation...');

    try {
      // Load menu configuration
      await this.loadMenuConfig();

      // Get report pages from menu
      const reportPages = this.getReportPages();
      this.stats.totalPages = reportPages.length;

      this.logger?.info(`📄 Found ${reportPages.length} report pages to process`);

      // Process each content file
      const processedPages = [];
      for (const page of reportPages) {
        this.logger?.debug(`Processing: ${page.path}`);
        const processedPage = await this.processContentFile(page.path, page);
        if (processedPage) {
          processedPages.push(processedPage);
        }
      }

      // Generate comprehensive plan JSON
      const planJson = this.generatePlanJson(processedPages);

      // Write to public directory
      await this.writePlanJsonFile(planJson);

      // Display statistics
      this.displayStats();

      this.logger?.success('✅ Plan JSON generation completed successfully!');

    } catch (error) {
      this.logger?.error(`❌ Plan JSON generation failed: ${error.message}`);
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
  const generator = new PlanJsonGenerator({
    verbose: process.argv.includes('--verbose') || process.argv.includes('-v')
  });

  await generator.generate();
}

// Execute if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
