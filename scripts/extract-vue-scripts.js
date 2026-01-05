#!/usr/bin/env node

/**
 * Vue SFC Script Extraction
 *
 * Extracts <script> sections from Vue Single File Components (.vue files)
 * and converts them to TypeScript files for TypeDoc documentation generation.
 *
 * TypeDoc cannot directly parse .vue files, so this script:
 * 1. Reads all .vue files from specified directories
 * 2. Extracts the <script setup lang="ts"> or <script lang="ts"> section
 * 3. Adds module documentation if missing
 * 4. Writes extracted scripts to docs-temp/ directory as .ts files
 *
 * @fileoverview Vue SFC script extraction for TypeDoc
 * @module scripts/extract-vue-scripts
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  statSync,
} from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

/**
 * Directories to scan for Vue components
 */
const VUE_DIRS = [
  { src: 'app/components', dest: 'docs-temp/components' },
  { src: 'app/pages', dest: 'docs-temp/pages' },
  { src: 'app/layouts', dest: 'docs-temp/layouts' },
];

/**
 * Extract script content from a Vue SFC
 *
 * @param {string} vueContent - Complete Vue file content
 * @param {string} filename - Original filename for documentation
 * @returns {string|null} Extracted TypeScript/JavaScript code or null
 */
function extractScript(vueContent, filename) {
  // Match <script setup lang="ts"> or <script lang="ts">
  const scriptMatch = vueContent.match(
    /<script\s+(?:setup\s+)?lang=["']ts["'][^>]*>([\s\S]*?)<\/script>/
  );

  if (!scriptMatch) {
    // Try JavaScript variant
    const jsScriptMatch = vueContent.match(
      /<script\s+(?:setup\s+)?[^>]*>([\s\S]*?)<\/script>/
    );
    
    if (!jsScriptMatch) {
      return null;
    }
    
    let script = jsScriptMatch[1];

    // Add module documentation if missing
    if (!script.includes('@fileoverview') && !script.includes('@module')) {
      const componentName = basename(filename, '.vue');
      script = `/**\n * @module ${componentName}\n * @fileoverview Vue component: ${componentName}\n */\n${script}`;
    }

    return script;
  }

  let script = scriptMatch[1];

  // Add module documentation if missing
  if (!script.includes('@fileoverview') && !script.includes('@module')) {
    const componentName = basename(filename, '.vue');
    script = `/**\n * @module ${componentName}\n * @fileoverview Vue component: ${componentName}\n */\n${script}`;
  }

  return script;
}

/**
 * Recursively process all .vue files in a directory
 *
 * @param {string} srcDir - Source directory to scan
 * @param {string} destDir - Destination directory for extracted scripts
 * @param {string} relativePath - Current relative path for nested directories
 */
function processDirectory(srcDir, destDir, relativePath = '') {
  const fullSrcPath = join(projectRoot, srcDir, relativePath);
  const fullDestPath = join(projectRoot, destDir, relativePath);

  if (!existsSync(fullSrcPath)) {
    console.log(`⚠️  Source directory not found: ${fullSrcPath}`);
    return;
  }

  // Create destination directory
  mkdirSync(fullDestPath, { recursive: true });

  const entries = readdirSync(fullSrcPath);

  for (const entry of entries) {
    const srcFilePath = join(fullSrcPath, entry);
    const stat = statSync(srcFilePath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(srcDir, destDir, join(relativePath, entry));
    } else if (entry.endsWith('.vue')) {
      // Process .vue file
      const content = readFileSync(srcFilePath, 'utf-8');
      const script = extractScript(content, entry);

      if (script) {
        const outFileName = entry.replace('.vue', '.ts');
        const outFilePath = join(fullDestPath, outFileName);
        writeFileSync(outFilePath, script);
        console.log(`✓ Extracted: ${join(destDir, relativePath, outFileName)}`);
      } else {
        console.log(`⚠️  No script found in: ${join(srcDir, relativePath, entry)}`);
      }
    }
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Starting Vue SFC script extraction...\n');

  let totalExtracted = 0;

  for (const dir of VUE_DIRS) {
    console.log(`📁 Processing: ${dir.src} → ${dir.dest}`);
    processDirectory(dir.src, dir.dest);
    totalExtracted++;
  }

  console.log(`\n✅ Vue script extraction complete!`);
  console.log(`   Extracted scripts are in docs-temp/ directory`);
  console.log(`   Run 'yarn generate:jsdoc' to generate TypeDoc documentation`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main();
  } catch (error) {
    console.error('❌ Error during script extraction:', error.message);
    process.exit(1);
  }
}

export { extractScript, processDirectory };

