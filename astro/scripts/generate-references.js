/**
 * Reference Data Generation Script (Astro port)
 *
 * Parses the src/content/plan/references.md file and generates a structured
 * JSON file containing all references with metadata for use in the reference
 * popup system.
 *
 * Ported from scripts/generate-references.js (root Nuxt repo).
 * Changes vs. original:
 *   - Reads from astro/src/content/plan/references.md (not content/references.md)
 *   - Writes to astro/public/data/references.json
 *   - Nuxt-specific logger/config-loader imports removed; uses simple console logging
 *
 * @version 1.0.0 (astro port)
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// Simple logger (replaces Nuxt-specific createLogger)
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${msg}`),
  warning: (msg) => console.warn(`[WARNING] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
  debug: (msg) => console.log(`[DEBUG] ${msg}`),
};

/**
 * Reference Data Generator
 */
class ReferenceDataGenerator {
  constructor() {
    this.references = new Map();
    this.stats = {
      totalReferences: 0,
      webReferences: 0,
      journalReferences: 0,
      bookReferences: 0,
      reportReferences: 0,
      parseErrors: 0,
    };
  }

  generateReferenceId(referenceText) {
    const authorMatch = referenceText.match(/^([^,.(]+)/);
    const yearMatch = referenceText.match(/\((\d{4})\)/);

    let id = "";

    if (authorMatch) {
      const author = authorMatch[1]
        .trim()
        .split(/\s+/)[0]
        .replace(/[^a-zA-Z]/g, "")
        .toLowerCase();
      id += author;
    }

    if (yearMatch) {
      id += "-" + yearMatch[1];
    }

    if (!id) {
      id = referenceText
        .split(/\s+/)
        .slice(0, 3)
        .join("-")
        .replace(/[^a-zA-Z0-9-]/g, "")
        .toLowerCase();
    }

    let finalId = id;
    let counter = 1;
    while (this.references.has(finalId)) {
      finalId = `${id}-${counter}`;
      counter++;
    }

    return finalId;
  }

  parseAuthors(referenceText) {
    const beforeYear = referenceText.split(/\(\d{4}\)/)[0];

    if (beforeYear.includes(" & ")) {
      return beforeYear
        .split(" & ")
        .map((author) => author.trim().replace(/\.$/, ""));
    } else if (beforeYear.includes(", ")) {
      const parts = beforeYear.split(", ");
      const authors = [];

      for (let i = 0; i < parts.length; i += 2) {
        if (i + 1 < parts.length) {
          authors.push(`${parts[i]}, ${parts[i + 1]}`);
        } else {
          authors.push(parts[i]);
        }
      }

      return authors.map((author) => author.trim().replace(/\.$/, ""));
    } else {
      return [beforeYear.trim().replace(/\.$/, "")];
    }
  }

  extractYear(referenceText) {
    const yearMatch = referenceText.match(/\((\d{4})\)/);
    return yearMatch ? parseInt(yearMatch[1]) : null;
  }

  extractTitle(referenceText) {
    const afterYear = referenceText.split(/\(\d{4}\)\.?\s*/)[1];
    if (!afterYear) return null;

    const titleMatch = afterYear.match(/^([^.]+\.)/);
    if (titleMatch) {
      return titleMatch[1].replace(/\.$/, "").trim();
    }

    const stopWords = [
      "Journal of",
      "American Journal",
      "CDC",
      "Atlanta",
      "Press",
      "https://",
      "[https://",
    ];
    let title = afterYear;

    for (const stopWord of stopWords) {
      const index = title.indexOf(stopWord);
      if (index !== -1) {
        title = title.substring(0, index).trim();
        break;
      }
    }

    return title.replace(/\.$/, "").trim() || null;
  }

  extractUrl(referenceText) {
    const markdownLinkMatch = referenceText.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (markdownLinkMatch) {
      return markdownLinkMatch[2];
    }

    const urlMatch = referenceText.match(/(https?:\/\/[^\s\]]+)/);
    return urlMatch ? urlMatch[1] : null;
  }

  determineReferenceType(referenceText) {
    if (
      referenceText.includes("https://") ||
      referenceText.includes("http://")
    ) {
      return "web";
    } else if (
      referenceText.includes("Journal of") ||
      referenceText.includes("American Journal")
    ) {
      return "journal";
    } else if (
      referenceText.includes("Press") ||
      referenceText.includes("(Eds.)") ||
      referenceText.includes("(Ed.)")
    ) {
      return "book";
    } else {
      return "report";
    }
  }

  generateShortCitation(authors, year) {
    if (!authors || authors.length === 0) {
      return year ? `(${year})` : "(n.d.)";
    }

    const firstAuthor = authors[0];
    const lastName = firstAuthor.split(",")[0];

    if (authors.length === 1) {
      return `${lastName}, ${year || "n.d."}`;
    } else if (authors.length === 2) {
      const secondLastName = authors[1].split(",")[0];
      return `${lastName} & ${secondLastName}, ${year || "n.d."}`;
    } else {
      return `${lastName} et al., ${year || "n.d."}`;
    }
  }

  cleanMarkdown(text) {
    if (!text) return text;

    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    text = text.replace(/\[([^[\]]*https?:\/\/[^[\]]*)\]/g, "");
    text = text.replace(/\*\*(.*?)\*\*/g, "$1");
    text = text.replace(/\*(.*?)\*/g, "$1");
    text = text.replace(/`(.*?)`/g, "$1");
    text = text.replace(/\s+/g, " ").trim();

    return text;
  }

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
      const cleanedFullCitation = this.cleanMarkdown(cleanText);

      const reference = {
        id,
        authors,
        year,
        title,
        url,
        type,
        shortCitation,
        fullCitation: cleanedFullCitation,
      };

      this.stats[`${type}References`]++;

      return reference;
    } catch (error) {
      logger.warning(
        `Failed to parse reference: ${referenceText.substring(0, 50)}...`
      );
      this.stats.parseErrors++;
      return null;
    }
  }

  async parseReferencesFile() {
    logger.info("Reading src/content/plan/references.md ...");

    // Astro content path: astro/src/content/plan/references.md
    const referencesPath = path.join(
      rootDir,
      "src",
      "content",
      "plan",
      "references.md"
    );
    const content = await fs.readFile(referencesPath, "utf-8");

    const referenceItemRegex =
      /<div class="reference-item">\s*([\s\S]*?)\s*<\/div>/g;
    const matches = [...content.matchAll(referenceItemRegex)];

    logger.info(`Found ${matches.length} reference items to process`);

    for (const match of matches) {
      const referenceHtml = match[1];

      // Clean up HTML entities (e.g. &#8203; zero-width space), HTML tags,
      // and markdown attributes
      const referenceText = referenceHtml
        .replace(/&#\d+;/g, "") // Remove numeric HTML entities
        .replace(/&[a-zA-Z]+;/g, " ") // Remove named HTML entities
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .replace(/\{[^}]*\}/g, "") // Remove markdown attributes
        .replace(/\s+/g, " ")
        .trim();

      if (referenceText) {
        const reference = this.parseReference(referenceText);
        if (reference) {
          this.references.set(reference.id, reference);
          this.stats.totalReferences++;
          logger.debug(`Parsed reference: ${reference.id}`);
        }
      }
    }

    logger.info(
      `Successfully parsed ${this.stats.totalReferences} references`
    );
  }

  async generateJsonFile() {
    logger.info("Generating public/data/references.json ...");

    const dataDir = path.join(rootDir, "public", "data");
    await fs.mkdir(dataDir, { recursive: true });

    const referencesObject = {};
    for (const [id, reference] of this.references) {
      referencesObject[id] = reference;
    }

    const jsonData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: "generate-references.js (astro port)",
        version: "1.0.0",
        totalReferences: this.stats.totalReferences,
        stats: this.stats,
      },
      references: referencesObject,
    };

    const outputPath = path.join(dataDir, "references.json");
    await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), "utf-8");

    logger.success(
      `Generated references.json with ${this.stats.totalReferences} references`
    );
    logger.info(`Output: ${outputPath}`);
  }

  printStats() {
    logger.info("Reference Generation Statistics:");
    logger.info(`  Total: ${this.stats.totalReferences}`);
    logger.info(`  Web: ${this.stats.webReferences}`);
    logger.info(`  Journal: ${this.stats.journalReferences}`);
    logger.info(`  Book: ${this.stats.bookReferences}`);
    logger.info(`  Report: ${this.stats.reportReferences}`);
    if (this.stats.parseErrors > 0) {
      logger.warning(`  Parse Errors: ${this.stats.parseErrors}`);
    }
  }

  async generate() {
    logger.info("Starting reference data generation (Astro port)...");

    try {
      await this.parseReferencesFile();
      await this.generateJsonFile();
      this.printStats();
      logger.success("Reference data generation completed successfully!");
    } catch (error) {
      logger.error(`Reference data generation failed: ${error.message}`);
      process.exit(1);
    }
  }
}

async function main() {
  const generator = new ReferenceDataGenerator();
  await generator.generate();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
