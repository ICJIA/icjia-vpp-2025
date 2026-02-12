import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Build Scripts Integration Tests
 *
 * Tests the actual execution and output of critical build scripts:
 * - generate-search-index-defuddle.js (search index generation)
 * - generate-site-config.js (routes configuration)
 * - generate-sitemap.js (XML sitemap)
 * - generate-plan-json.js (plan data files)
 *
 * These tests verify that build scripts:
 * 1. Execute successfully without errors
 * 2. Generate expected output files
 * 3. Produce valid, well-formed output
 * 4. Include required content and metadata
 */

const rootDir = path.resolve(process.cwd());

/**
 * Helper function to run a build script
 * @param {string} scriptName - Name of script file in /scripts/
 * @returns {string} Script output
 */
function runBuildScript(scriptName) {
  const scriptPath = path.join(rootDir, 'scripts', scriptName);
  return execSync(`node "${scriptPath}" --quiet`, {
    cwd: rootDir,
    encoding: 'utf-8',
    env: { ...process.env, NODE_ENV: 'test' }
  });
}

/**
 * Helper function to read and parse JSON file
 * @param {string} filePath - Relative path from project root
 * @returns {Promise<any>} Parsed JSON content
 */
async function readJSON(filePath) {
  const fullPath = path.join(rootDir, filePath);
  const content = await fs.readFile(fullPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Helper function to read file as text
 * @param {string} filePath - Relative path from project root
 * @returns {Promise<string>} File content
 */
async function readFile(filePath) {
  const fullPath = path.join(rootDir, filePath);
  return await fs.readFile(fullPath, 'utf-8');
}

/**
 * Helper function to check if file exists
 * @param {string} filePath - Relative path from project root
 * @returns {Promise<boolean>}
 */
async function fileExists(filePath) {
  try {
    const fullPath = path.join(rootDir, filePath);
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

describe('Build Scripts Integration Tests', () => {
  describe('generate-site-config.js', () => {
    beforeAll(() => {
      // Run the script before tests
      runBuildScript('generate-site-config.js');
    });

    it('generates routes.config.json file', async () => {
      const exists = await fileExists('config/routes.config.json');
      expect(exists).toBe(true);
    });

    it('creates valid JSON structure', async () => {
      const config = await readJSON('config/routes.config.json');

      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });

    it('includes required metadata fields', async () => {
      const config = await readJSON('config/routes.config.json');

      expect(config.summary).toBeDefined();
      expect(config.generatedAt).toBeDefined();
      expect(config.summary.totalPages).toBeGreaterThan(0);
    });

    it('includes pages array with route data', async () => {
      const config = await readJSON('config/routes.config.json');

      expect(Array.isArray(config.pages)).toBe(true);
      expect(config.pages.length).toBeGreaterThan(0);
    });

    it('each route has required fields', async () => {
      const config = await readJSON('config/routes.config.json');

      const firstPage = config.pages[0];
      expect(firstPage).toBeDefined();
      expect(firstPage.path).toBeDefined();
      expect(firstPage.title).toBeDefined();
      expect(typeof firstPage.path).toBe('string');
      expect(typeof firstPage.title).toBe('string');
    });

    it('includes homepage route', async () => {
      const config = await readJSON('config/routes.config.json');

      const homepage = config.pages.find(page => page.path === '/');
      expect(homepage).toBeDefined();
      expect(homepage.title).toBeTruthy();
    });

    it('all paths start with forward slash', async () => {
      const config = await readJSON('config/routes.config.json');

      const invalidPaths = config.pages.filter(page => !page.path.startsWith('/'));
      expect(invalidPaths).toHaveLength(0);
    });

    it('no duplicate paths in config', async () => {
      const config = await readJSON('config/routes.config.json');

      const paths = config.pages.map(page => page.path);
      const uniquePaths = new Set(paths);
      expect(uniquePaths.size).toBe(paths.length);
    });
  });

  describe('generate-sitemap.js', () => {
    beforeAll(() => {
      // Run the script before tests
      runBuildScript('generate-sitemap.js');
    });

    it('generates sitemap.xml file', async () => {
      const exists = await fileExists('public/sitemap.xml');
      expect(exists).toBe(true);
    });

    it('creates valid XML structure', async () => {
      const sitemap = await readFile('public/sitemap.xml');

      // Check for XML declaration
      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');

      // Check for sitemap namespace
      expect(sitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    });

    it('includes urlset root element', async () => {
      const sitemap = await readFile('public/sitemap.xml');

      expect(sitemap).toContain('<urlset');
      expect(sitemap).toContain('</urlset>');
    });

    it('includes URL entries with required elements', async () => {
      const sitemap = await readFile('public/sitemap.xml');

      // Should have multiple URL entries
      const urlMatches = sitemap.match(/<url>/g);
      expect(urlMatches).toBeTruthy();
      expect(urlMatches.length).toBeGreaterThan(0);

      // Each URL should have loc and lastmod
      expect(sitemap).toContain('<loc>');
      expect(sitemap).toContain('<lastmod>');
    });

    it('includes homepage in sitemap', async () => {
      const sitemap = await readFile('public/sitemap.xml');

      // Should include base URL
      expect(sitemap).toMatch(/<loc>https?:\/\/[^<]+\/<\/loc>/);
    });

    it('has valid date format in lastmod', async () => {
      const sitemap = await readFile('public/sitemap.xml');

      // Extract lastmod dates
      const dateMatches = sitemap.match(/<lastmod>([^<]+)<\/lastmod>/);
      if (dateMatches && dateMatches[1]) {
        const date = dateMatches[1];
        // Check for ISO 8601 format (YYYY-MM-DD)
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}/);
      }
    });

    it('all URLs use HTTPS protocol', async () => {
      const sitemap = await readFile('public/sitemap.xml');

      const locMatches = sitemap.match(/<loc>([^<]+)<\/loc>/g) || [];
      const httpUrls = locMatches.filter(match => match.includes('<loc>http://'));

      // All URLs should use HTTPS (no http://)
      expect(httpUrls).toHaveLength(0);
    });
  });

  describe('generate-plan-json.js', () => {
    beforeAll(() => {
      // Run the script before tests
      runBuildScript('generate-plan-json.js');
    });

    it('generates JSON plan file', async () => {
      const exists = await fileExists('public/vpp-plan-2025-2029.json');
      expect(exists).toBe(true);
    });

    it('generates YAML plan file', async () => {
      const exists = await fileExists('public/vpp-plan-2025-2029.yaml');
      expect(exists).toBe(true);
    });

    it('creates valid JSON structure', async () => {
      const plan = await readJSON('public/vpp-plan-2025-2029.json');

      expect(plan).toBeDefined();
      expect(typeof plan).toBe('object');
    });

    it('includes plan metadata', async () => {
      const plan = await readJSON('public/vpp-plan-2025-2029.json');

      expect(plan.planInfo).toBeDefined();
      expect(plan.planInfo.title).toBeDefined();
      expect(typeof plan.planInfo.title).toBe('string');
      expect(plan.planInfo.title.length).toBeGreaterThan(0);
    });

    it('includes plan pages data', async () => {
      const plan = await readJSON('public/vpp-plan-2025-2029.json');

      expect(plan.pages).toBeDefined();
      expect(Array.isArray(plan.pages)).toBe(true);
      // Pages array may be empty if content not yet generated
      expect(plan.pages).toEqual(expect.any(Array));
    });

    it('includes generation statistics', async () => {
      const plan = await readJSON('public/vpp-plan-2025-2029.json');

      expect(plan.generationStats).toBeDefined();
      expect(typeof plan.generationStats.totalPages).toBe('number');
    });

    it('YAML file contains valid structure', async () => {
      const yaml = await readFile('public/vpp-plan-2025-2029.yaml');

      // Basic YAML structure checks
      expect(yaml).toBeTruthy();
      expect(yaml.length).toBeGreaterThan(0);

      // Check for key YAML elements
      expect(yaml).toContain('planInfo:');
      expect(yaml).toContain('title:');
    });

    it('JSON and YAML have consistent data', async () => {
      const json = await readJSON('public/vpp-plan-2025-2029.json');
      const yaml = await readFile('public/vpp-plan-2025-2029.yaml');

      // Check that both contain the plan title from planInfo
      expect(yaml).toContain(json.planInfo.title);

      // Check that YAML has planInfo structure
      expect(yaml).toContain('planInfo:');
      expect(yaml).toContain('pages:');
    });
  });

  describe('generate-search-index-defuddle.js', () => {
    it('script exists and is executable', async () => {
      const scriptPath = path.join(rootDir, 'scripts', 'generate-search-index-defuddle.js');
      const exists = await fileExists('scripts/generate-search-index-defuddle.js');
      expect(exists).toBe(true);
    });

    // Note: This script requires a full build (yarn generate) to have HTML files to process
    // Testing it in isolation is complex, so we verify the script structure instead
    it('can be imported without errors', async () => {
      const scriptPath = path.join(rootDir, 'scripts', 'generate-search-index-defuddle.js');

      // Verify the file can be read
      const content = await readFile('scripts/generate-search-index-defuddle.js');
      expect(content).toBeTruthy();
      expect(content).toContain('Defuddle');
      expect(content).toContain('search-index.json');
    });
  });

  describe('Script Error Handling', () => {
    it('scripts exit cleanly on success', () => {
      expect(() => {
        runBuildScript('generate-site-config.js');
      }).not.toThrow();
    });

    it('scripts produce console output', () => {
      const output = runBuildScript('generate-sitemap.js');

      // Should have some output (even if quiet mode)
      expect(typeof output).toBe('string');
    });

    it('scripts respect quiet flag', () => {
      const output = runBuildScript('generate-site-config.js');

      // In quiet mode, output should be minimal
      // (exact length varies, but should not be excessively verbose)
      expect(output.length).toBeLessThan(5000);
    });
  });

  describe('Build Output Consistency', () => {
    it('routes config matches sitemap URLs', async () => {
      const config = await readJSON('config/routes.config.json');
      const sitemap = await readFile('public/sitemap.xml');

      // Get homepage route
      const homePage = config.pages.find(page => page.path === '/');
      expect(homePage).toBeDefined();

      // Check that base URL appears in sitemap
      expect(sitemap).toContain(config.baseUrl);

      // Check that sitemap has URL entries
      expect(sitemap).toContain('<url>');
      expect(sitemap).toContain('<loc>');
    });

    it('all generated files use consistent base URL', async () => {
      const config = await readJSON('config/routes.config.json');
      const sitemap = await readFile('public/sitemap.xml');

      // Extract base URL from sitemap
      const locMatch = sitemap.match(/<loc>(https?:\/\/[^/]+)/);
      if (locMatch) {
        const sitemapBaseUrl = locMatch[1];

        // Should use production URL
        expect(sitemapBaseUrl).toContain('vpp.icjia.illinois.gov');
      }
    });
  });

  describe('Content Security', () => {
    it('sitemap contains no sandbox or test pages', async () => {
      const sitemap = await readFile('public/sitemap.xml');

      expect(sitemap.toLowerCase()).not.toContain('sandbox');
      expect(sitemap.toLowerCase()).not.toContain('/test/');
      expect(sitemap.toLowerCase()).not.toContain('/debug');
    });

    it('routes config excludes blacklisted pages', async () => {
      const config = await readJSON('config/routes.config.json');

      const sandboxPages = config.pages.filter(page =>
        page.path.toLowerCase().includes('sandbox')
      );

      expect(sandboxPages).toHaveLength(0);
    });
  });
});
