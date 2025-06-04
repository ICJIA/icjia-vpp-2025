/**
 * Reference Data Generation Script
 *
 * Parses the content/references.md file and generates a structured JSON file
 * containing all references with metadata for use in the reference popup system.
 *
 * This script extracts references from the markdown file and creates:
 * - Unique IDs for each reference
 * - Structured metadata (authors, year, title, etc.)
 * - Short and full citation formats
 * - URL extraction for web references
 *
 * @author Violence Prevention Plan for Illinois: 2025-2029
 * @version 1.0.0
 * @since 2025-06-04
 */

import { promises as fs } from 'fs';
import path from 'path';

import { createLogger } from '../utils/logger.js';
import { createScriptLoggerConfig, getVerbosityFromArgs } from '../utils/config-loader.js';

/**
 * Reference Data Generator Class
 *
 * Handles parsing of references.md and generation of structured JSON data
 */
class ReferenceDataGenerator {
  constructor(options = {}) {
    this.references = new Map();
    this.stats = {
      totalReferences: 0,
      webReferences: 0,
      journalReferences: 0,
      bookReferences: 0,
      reportReferences: 0,
      parseErrors: 0
    };
    this.logger = null; // Will be initialized in generate()
    this.options = options;
  }

  /**
   * Generate unique ID from reference text
   *
   * @param {string} referenceText - The full reference text
   * @returns {string} Generated unique ID
   */
  generateReferenceId(referenceText) {
    // Extract first author's last name and year
    const authorMatch = referenceText.match(/^([^,.(]+)/);
    const yearMatch = referenceText.match(/\((\d{4})\)/);
    
    let id = '';
    
    if (authorMatch) {
      // Clean up author name - take first word, remove special chars
      const author = authorMatch[1]
        .trim()
        .split(/\s+/)[0] // Take first word
        .replace(/[^a-zA-Z]/g, '') // Remove non-letters
        .toLowerCase();
      id += author;
    }
    
    if (yearMatch) {
      id += '-' + yearMatch[1];
    }
    
    // If we couldn't extract author/year, create ID from first few words
    if (!id) {
      id = referenceText
        .split(/\s+/)
        .slice(0, 3)
        .join('-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase();
    }
    
    // Ensure uniqueness by adding suffix if needed
    let finalId = id;
    let counter = 1;
    while (this.references.has(finalId)) {
      finalId = `${id}-${counter}`;
      counter++;
    }
    
    return finalId;
  }

  /**
   * Parse author information from reference text
   *
   * @param {string} referenceText - The full reference text
   * @returns {Array} Array of author names
   */
  parseAuthors(referenceText) {
    // Extract text before the year
    const beforeYear = referenceText.split(/\(\d{4}\)/)[0];
    
    // Handle different author formats
    if (beforeYear.includes(' & ')) {
      // Format: "Author1, A. & Author2, B."
      return beforeYear.split(' & ').map(author => author.trim().replace(/\.$/, ''));
    } else if (beforeYear.includes(', ')) {
      // Format: "Author1, A., Author2, B., Author3, C."
      const parts = beforeYear.split(', ');
      const authors = [];
      
      // Group parts into author names (assuming "LastName, FirstInitial" format)
      for (let i = 0; i < parts.length; i += 2) {
        if (i + 1 < parts.length) {
          authors.push(`${parts[i]}, ${parts[i + 1]}`);
        } else {
          authors.push(parts[i]);
        }
      }
      
      return authors.map(author => author.trim().replace(/\.$/, ''));
    } else {
      // Single author or organization
      return [beforeYear.trim().replace(/\.$/, '')];
    }
  }

  /**
   * Extract year from reference text
   *
   * @param {string} referenceText - The full reference text
   * @returns {number|null} Extracted year or null
   */
  extractYear(referenceText) {
    const yearMatch = referenceText.match(/\((\d{4})\)/);
    return yearMatch ? parseInt(yearMatch[1]) : null;
  }

  /**
   * Extract title from reference text
   *
   * @param {string} referenceText - The full reference text
   * @returns {string|null} Extracted title or null
   */
  extractTitle(referenceText) {
    // Look for text after year and before journal/publisher info
    const afterYear = referenceText.split(/\(\d{4}\)\.?\s*/)[1];
    if (!afterYear) return null;
    
    // Title is typically the first sentence or until we hit journal/publisher indicators
    const titleMatch = afterYear.match(/^([^.]+\.)/);
    if (titleMatch) {
      return titleMatch[1].replace(/\.$/, '').trim();
    }
    
    // Fallback: take everything until common journal/publisher indicators
    const stopWords = ['Journal of', 'American Journal', 'CDC', 'Atlanta', 'Press', 'https://', '[https://'];
    let title = afterYear;
    
    for (const stopWord of stopWords) {
      const index = title.indexOf(stopWord);
      if (index !== -1) {
        title = title.substring(0, index).trim();
        break;
      }
    }
    
    return title.replace(/\.$/, '').trim() || null;
  }

  /**
   * Extract URL from reference text
   *
   * @param {string} referenceText - The full reference text
   * @returns {string|null} Extracted URL or null
   */
  extractUrl(referenceText) {
    // Look for markdown link format [url](url) or just https:// URLs
    const markdownLinkMatch = referenceText.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (markdownLinkMatch) {
      return markdownLinkMatch[2];
    }
    
    // Look for plain URLs
    const urlMatch = referenceText.match(/(https?:\/\/[^\s\]]+)/);
    return urlMatch ? urlMatch[1] : null;
  }

  /**
   * Determine reference type based on content
   *
   * @param {string} referenceText - The full reference text
   * @returns {string} Reference type
   */
  determineReferenceType(referenceText) {
    if (referenceText.includes('https://') || referenceText.includes('http://')) {
      return 'web';
    } else if (referenceText.includes('Journal of') || referenceText.includes('American Journal')) {
      return 'journal';
    } else if (referenceText.includes('Press') || referenceText.includes('(Eds.)') || referenceText.includes('(Ed.)')) {
      return 'book';
    } else {
      return 'report';
    }
  }

  /**
   * Generate short citation format
   *
   * @param {Array} authors - Array of author names
   * @param {number} year - Publication year
   * @returns {string} Short citation format
   */
  generateShortCitation(authors, year) {
    if (!authors || authors.length === 0) {
      return year ? `(${year})` : '(n.d.)';
    }
    
    const firstAuthor = authors[0];
    const lastName = firstAuthor.split(',')[0]; // Get last name before comma
    
    if (authors.length === 1) {
      return `${lastName}, ${year || 'n.d.'}`;
    } else if (authors.length === 2) {
      const secondLastName = authors[1].split(',')[0];
      return `${lastName} & ${secondLastName}, ${year || 'n.d.'}`;
    } else {
      return `${lastName} et al., ${year || 'n.d.'}`;
    }
  }

  /**
   * Clean markdown formatting from text
   *
   * @param {string} text - Text with potential markdown formatting
   * @returns {string} Clean text without markdown
   */
  cleanMarkdown(text) {
    if (!text) return text;

    // Remove markdown links [text](url) and keep just the text
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Remove standalone URLs in brackets
    text = text.replace(/\[([^[\]]*https?:\/\/[^[\]]*)\]/g, '');

    // Remove any remaining markdown formatting
    text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
    text = text.replace(/\*(.*?)\*/g, '$1'); // Italic
    text = text.replace(/`(.*?)`/g, '$1'); // Code

    // Clean up extra whitespace
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }

  /**
   * Parse a single reference item
   *
   * @param {string} referenceText - The reference text to parse
   * @returns {Object|null} Parsed reference object or null if parsing failed
   */
  parseReference(referenceText) {
    try {
      const cleanText = referenceText.trim();
      if (!cleanText) return null;

      const id = this.generateReferenceId(cleanText);
      const authors = this.parseAuthors(cleanText);
      const year = this.extractYear(cleanText);
      const title = this.extractTitle(cleanText);
      const url = this.extractUrl(cleanText);
      const type = this.determineReferenceType(cleanText);
      const shortCitation = this.generateShortCitation(authors, year);

      // Clean the full citation of markdown formatting
      const cleanedFullCitation = this.cleanMarkdown(cleanText);

      const reference = {
        id,
        authors,
        year,
        title,
        url,
        type,
        shortCitation,
        fullCitation: cleanedFullCitation
      };

      // Update stats
      this.stats[`${type}References`]++;

      return reference;
    } catch (error) {
      this.logger?.warning(`Failed to parse reference: ${referenceText.substring(0, 50)}...`);
      this.stats.parseErrors++;
      return null;
    }
  }

  /**
   * Parse the references.md file and extract all references
   *
   * @returns {Promise<void>}
   */
  async parseReferencesFile() {
    this.logger?.info('📄 Reading references.md file...');

    try {
      const referencesPath = path.join(process.cwd(), 'content/references.md');
      const content = await fs.readFile(referencesPath, 'utf-8');

      // Extract reference items from the HTML structure
      const referenceItemRegex = /<div class="reference-item">\s*(.*?)\s*<\/div>/gs;
      const matches = [...content.matchAll(referenceItemRegex)];

      this.logger?.info(`📊 Found ${matches.length} reference items to process`);

      for (const match of matches) {
        const referenceHtml = match[1];

        // Clean up HTML and extract text
        const referenceText = referenceHtml
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/\{[^}]*\}/g, '') // Remove markdown attributes like {target="_blank"}
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();

        if (referenceText) {
          const reference = this.parseReference(referenceText);
          if (reference) {
            this.references.set(reference.id, reference);
            this.stats.totalReferences++;
            this.logger?.debug(`✅ Parsed reference: ${reference.id}`);
          }
        }
      }

      this.logger?.info(`✅ Successfully parsed ${this.stats.totalReferences} references`);
    } catch (error) {
      this.logger?.error(`Failed to read references.md: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate the JSON output file
   *
   * @returns {Promise<void>}
   */
  async generateJsonFile() {
    this.logger?.info('📝 Generating references.json file...');

    try {
      // Ensure public/data directory exists
      const dataDir = path.join(process.cwd(), 'public/data');
      await fs.mkdir(dataDir, { recursive: true });

      // Convert Map to Object for JSON serialization
      const referencesObject = {};
      for (const [id, reference] of this.references) {
        referencesObject[id] = reference;
      }

      // Create the final JSON structure
      const jsonData = {
        metadata: {
          generatedAt: new Date().toISOString(),
          generatedBy: 'generate-references.js',
          version: '1.0.0',
          totalReferences: this.stats.totalReferences,
          stats: this.stats
        },
        references: referencesObject
      };

      // Write the JSON file
      const outputPath = path.join(dataDir, 'references.json');
      await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');

      this.logger?.success(`✅ Generated references.json with ${this.stats.totalReferences} references`);
      this.logger?.info(`📁 Output file: ${outputPath}`);
    } catch (error) {
      this.logger?.error(`Failed to generate JSON file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Print generation statistics
   */
  printStats() {
    this.logger?.info('📊 Reference Generation Statistics:');
    this.logger?.info(`   Total References: ${this.stats.totalReferences}`);
    this.logger?.info(`   Web References: ${this.stats.webReferences}`);
    this.logger?.info(`   Journal References: ${this.stats.journalReferences}`);
    this.logger?.info(`   Book References: ${this.stats.bookReferences}`);
    this.logger?.info(`   Report References: ${this.stats.reportReferences}`);
    if (this.stats.parseErrors > 0) {
      this.logger?.warning(`   Parse Errors: ${this.stats.parseErrors}`);
    }
  }

  /**
   * Main generation method
   *
   * @returns {Promise<void>}
   */
  async generate() {
    // Initialize logger with fallback configuration
    try {
      const verbosity = getVerbosityFromArgs() || this.options.logLevel;
      const loggerConfig = await createScriptLoggerConfig('generate-references', {
        level: verbosity,
        groupMessages: true
      });
      this.logger = createLogger(loggerConfig).createScope('ReferenceGenerator');
    } catch (error) {
      // Fallback to simple console logging if config fails
      console.log('Warning: Could not load logger config, using fallback');
      this.logger = {
        info: (msg) => console.log(`[INFO] ${msg}`),
        success: (msg) => console.log(`[SUCCESS] ${msg}`),
        warning: (msg) => console.warn(`[WARNING] ${msg}`),
        error: (msg) => console.error(`[ERROR] ${msg}`),
        debug: (msg) => console.log(`[DEBUG] ${msg}`)
      };
    }

    this.logger?.info('🚀 Starting reference data generation...');

    try {
      await this.parseReferencesFile();
      await this.generateJsonFile();
      this.printStats();

      this.logger?.success('✅ Reference data generation completed successfully!');
    } catch (error) {
      this.logger?.error(`❌ Reference data generation failed: ${error.message}`);
      process.exit(1);
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  const generator = new ReferenceDataGenerator();
  await generator.generate();
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
