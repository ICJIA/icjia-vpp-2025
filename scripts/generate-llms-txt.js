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

import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { createLogger } from '../utils/logger.js';
import { createScriptLoggerConfig, getVerbosityFromArgs } from '../utils/config-loader.js';

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
      totalContentLength: 0
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
   * Read and process a markdown content file
   *
   * @param {string} contentPath - Path to the content file (without .md extension)
   * @returns {Promise<Object|null>} Processed content object or null if failed
   */
  async processContentFile(contentPath) {
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

      // Clean the content - remove frontmatter delimiters and extra whitespace
      const cleanContent = content
        .trim()
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .replace(/^\s+|\s+$/gm, '') // Trim whitespace from each line
        .replace(/\n\n+/g, '\n\n'); // Normalize paragraph spacing

      this.stats.totalContentLength += cleanContent.length;
      this.stats.processedPages++;

      return {
        title: frontmatter.title || 'Untitled',
        description: frontmatter.description || '',
        content: cleanContent,
        path: contentPath,
        filePath: filePath
      };

    } catch (error) {
      this.logger?.error(`Failed to process content file ${contentPath}: ${error.message}`);
      this.stats.skippedPages++;
      return null;
    }
  }

  /**
   * Generate the llms.txt content according to the specification
   *
   * @param {Array<Object>} processedPages - Array of processed page content
   * @returns {string} Formatted llms.txt content
   */
  generateLLMSTxtContent(processedPages) {
    const lines = [];

    // H1 title (required)
    lines.push('# Statewide Violence Prevention Plan for Illinois: 2025-2029');
    lines.push('');

    // Blockquote summary (optional but recommended)
    lines.push('> This comprehensive violence prevention plan outlines Illinois\'s strategic approach to preventing violence through evidence-based practices, equity advancement, and collaborative efforts across state, municipal, and community-based agencies for 2025-2029.');
    lines.push('');

    // Optional details section
    lines.push('This plan presents three primary violence prevention goals:');
    lines.push('1. **Prevent violence and promote health and safety** through trauma-informed, evidence-based prevention efforts');
    lines.push('2. **Advance equity** by increasing access to grants and economic opportunities');
    lines.push('3. **Promote collaboration** across agencies, informed by research, data sharing, and best practices');
    lines.push('');
    lines.push('The plan was developed by the Illinois Criminal Justice Information Authority (ICJIA) in collaboration with the Ad Hoc Violence Prevention Committee and various workgroups, building upon the previous 2020-2024 plan with updated research, implementation findings, and community feedback.');
    lines.push('');

    // Main content sections
    lines.push('## Plan Content');
    lines.push('');

    for (const page of processedPages) {
      if (page && page.content) {
        const baseUrl = 'https://vpp-2025.netlify.app';
        const fullUrl = `${baseUrl}${page.path}`;
        
        // Create markdown link with description
        const linkText = `[${page.title}](${fullUrl})`;
        const description = page.description ? `: ${page.description}` : '';
        
        lines.push(`- ${linkText}${description}`);
      }
    }

    lines.push('');

    // Optional section for supplementary content
    lines.push('## Optional');
    lines.push('');
    lines.push('- [Full PDF Report](https://vpp-2025.netlify.app/files/Full_Report_Statewide_Violence_Prevention_Plan_2025-2029_2025_Update.pdf): Complete downloadable version of the violence prevention plan');
    lines.push('- [ICJIA Website](https://icjia.illinois.gov): Illinois Criminal Justice Information Authority main website');
    lines.push('- [Project Repository](https://github.com/ICJIA/icjia-vpp-2025): Source code and development information');

    return lines.join('\n');
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
      const publicDir = path.join(process.cwd(), 'public');
      await fs.mkdir(publicDir, { recursive: true });

      // Write the llms.txt file
      const outputPath = path.join(publicDir, 'llms.txt');
      await fs.writeFile(outputPath, content, 'utf-8');

      this.logger?.success(`✅ Generated llms.txt file: ${outputPath}`);
      this.logger?.info(`📊 File size: ${(content.length / 1024).toFixed(2)} KB`);
    } catch (error) {
      this.logger?.error(`Failed to write llms.txt file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Display generation statistics
   */
  displayStats() {
    this.logger?.info('📊 LLMS.txt Generation Statistics:');
    this.logger?.info(`   Total pages identified: ${this.stats.totalPages}`);
    this.logger?.info(`   Successfully processed: ${this.stats.processedPages}`);
    this.logger?.info(`   Skipped pages: ${this.stats.skippedPages}`);
    this.logger?.info(`   Total content length: ${(this.stats.totalContentLength / 1024).toFixed(2)} KB`);
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
    const loggerConfig = await createScriptLoggerConfig('LLMS.txt Generator', loggerOptions);
    this.logger = createLogger(loggerConfig);

    this.logger?.info('🚀 Starting LLMS.txt generation...');

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

      this.logger?.success('✅ LLMS.txt generation completed successfully!');

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
