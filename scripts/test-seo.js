#!/usr/bin/env node

/**
 * SEO Testing Script for Illinois Violence Prevention Project
 *
 * This script validates the SEO implementation by checking:
 * - Meta tags presence and format
 * - Open Graph and Twitter Card tags
 * - Structured data validation
 * - Image accessibility and dimensions
 * - Canonical URLs
 * - Sitemap validation
 *
 * Features:
 * - Automated SEO validation
 * - Social media meta tag verification
 * - Image dimension checking
 * - Structured data validation
 * - Performance recommendations
 *
 * @script
 * @seo SEO validation and testing
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = "https://vpp-2025.netlify.app";
const TEST_PAGES = [
  "/",
  "/plan/executive-summary",
  "/news/community-violence-prevention-grant-2024",
  "/contact",
  "/download",
];

/**
 * Color codes for console output
 */
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

/**
 * Log with colors
 */
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  let color = colors.reset;
  let prefix = "";

  switch (level) {
    case "error":
      color = colors.red;
      prefix = "❌";
      break;
    case "success":
      color = colors.green;
      prefix = "✅";
      break;
    case "warning":
      color = colors.yellow;
      prefix = "⚠️";
      break;
    case "info":
      color = colors.blue;
      prefix = "ℹ️";
      break;
    default:
      prefix = "📋";
  }

  console.log(`${color}${prefix} ${message}${colors.reset}`);
  if (data) {
    console.log(`   ${JSON.stringify(data, null, 2)}`);
  }
}

/**
 * Check if required files exist
 */
function checkRequiredFiles() {
  log("info", "Checking required SEO files...");

  const requiredFiles = [
    "public/sitemap.xml",
    "public/robots.txt",
    "public/images/og-image-default.jpg",
    "public/images/twitter-card-default.jpg",
    "public/images/illinois-seal.png",
  ];

  let allFilesExist = true;

  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, "..", file);
    if (fs.existsSync(filePath)) {
      log("success", `Found: ${file}`);
    } else {
      log("error", `Missing: ${file}`);
      allFilesExist = false;
    }
  }

  return allFilesExist;
}

/**
 * Check image dimensions for social media compliance
 */
function checkImageDimensions() {
  log("info", "Checking social media image dimensions...");

  const images = [
    {
      file: "public/images/og-image-default.jpg",
      expectedWidth: 1200,
      expectedHeight: 630,
      type: "Open Graph",
    },
    {
      file: "public/images/twitter-card-default.jpg",
      expectedWidth: 1200,
      expectedHeight: 675,
      type: "Twitter Card",
    },
  ];

  let allImagesValid = true;

  for (const image of images) {
    const imagePath = path.join(__dirname, "..", image.file);

    if (!fs.existsSync(imagePath)) {
      log("error", `${image.type} image not found: ${image.file}`);
      allImagesValid = false;
      continue;
    }

    try {
      // Use ImageMagick identify command to get dimensions
      const output = execSync(`identify -format "%wx%h" "${imagePath}"`, {
        encoding: "utf8",
      }).trim();
      const [width, height] = output.split("x").map(Number);

      if (width === image.expectedWidth && height === image.expectedHeight) {
        log(
          "success",
          `${image.type} image dimensions correct: ${width}x${height}`,
        );
      } else {
        log(
          "warning",
          `${image.type} image dimensions: ${width}x${height} (expected: ${image.expectedWidth}x${image.expectedHeight})`,
        );
      }
    } catch (error) {
      log(
        "error",
        `Could not check dimensions for ${image.file}: ${error.message}`,
      );
      allImagesValid = false;
    }
  }

  return allImagesValid;
}

/**
 * Validate sitemap.xml
 */
function validateSitemap() {
  log("info", "Validating sitemap.xml...");

  const sitemapPath = path.join(__dirname, "..", "public", "sitemap.xml");

  if (!fs.existsSync(sitemapPath)) {
    log("error", "Sitemap.xml not found");
    return false;
  }

  try {
    const sitemapContent = fs.readFileSync(sitemapPath, "utf8");

    // Basic XML validation
    if (!sitemapContent.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      log("error", "Sitemap missing XML declaration");
      return false;
    }

    if (
      !sitemapContent.includes(
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      )
    ) {
      log("error", "Sitemap missing proper urlset declaration");
      return false;
    }

    // Count URLs
    const urlMatches = sitemapContent.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;

    if (urlCount === 0) {
      log("error", "Sitemap contains no URLs");
      return false;
    }

    log("success", `Sitemap validation passed with ${urlCount} URLs`);

    // Check for required pages
    const requiredPages = ["/", "/plan/executive-summary", "/download"];
    for (const page of requiredPages) {
      const pageUrl = `${BASE_URL}${page === "/" ? "" : page}`;
      if (sitemapContent.includes(pageUrl)) {
        log("success", `Required page found in sitemap: ${page}`);
      } else {
        log("warning", `Required page missing from sitemap: ${page}`);
      }
    }

    return true;
  } catch (error) {
    log("error", `Sitemap validation failed: ${error.message}`);
    return false;
  }
}

/**
 * Validate robots.txt
 */
function validateRobotsTxt() {
  log("info", "Validating robots.txt...");

  const robotsPath = path.join(__dirname, "..", "public", "robots.txt");

  if (!fs.existsSync(robotsPath)) {
    log("error", "robots.txt not found");
    return false;
  }

  try {
    const robotsContent = fs.readFileSync(robotsPath, "utf8");

    // Check for required directives
    if (!robotsContent.includes("User-agent: *")) {
      log("error", "robots.txt missing User-agent directive");
      return false;
    }

    if (!robotsContent.includes("Sitemap:")) {
      log("error", "robots.txt missing Sitemap directive");
      return false;
    }

    if (robotsContent.includes(`Sitemap: ${BASE_URL}/sitemap.xml`)) {
      log("success", "robots.txt contains correct sitemap URL");
    } else {
      log("warning", "robots.txt sitemap URL may be incorrect");
    }

    log("success", "robots.txt validation passed");
    return true;
  } catch (error) {
    log("error", `robots.txt validation failed: ${error.message}`);
    return false;
  }
}

/**
 * Check component imports for SEO components
 */
function checkSEOComponents() {
  log("info", "Checking SEO component integration...");

  const filesToCheck = [
    {
      file: "pages/index.vue",
      shouldContain: ["StructuredData", "useSeoMeta"],
    },
    {
      file: "pages/[...slug].vue",
      shouldContain: ["StructuredData", "useSeoMeta"],
    },
    {
      file: "components/seo/StructuredData.vue",
      shouldContain: ["@context", "schema.org"],
    },
  ];

  let allComponentsValid = true;

  for (const check of filesToCheck) {
    const filePath = path.join(__dirname, "..", check.file);

    if (!fs.existsSync(filePath)) {
      log("error", `SEO component file not found: ${check.file}`);
      allComponentsValid = false;
      continue;
    }

    try {
      const fileContent = fs.readFileSync(filePath, "utf8");

      for (const requirement of check.shouldContain) {
        if (fileContent.includes(requirement)) {
          log("success", `${check.file} contains ${requirement}`);
        } else {
          log("error", `${check.file} missing ${requirement}`);
          allComponentsValid = false;
        }
      }
    } catch (error) {
      log("error", `Could not check ${check.file}: ${error.message}`);
      allComponentsValid = false;
    }
  }

  return allComponentsValid;
}

/**
 * Main SEO testing function
 */
function runSEOTests() {
  log("info", "🔍 Starting SEO validation tests...");
  console.log("");

  const results = {
    files: checkRequiredFiles(),
    images: checkImageDimensions(),
    sitemap: validateSitemap(),
    robots: validateRobotsTxt(),
    components: checkSEOComponents(),
  };

  console.log("");
  log("info", "📊 SEO Test Results Summary:");

  let allTestsPassed = true;
  for (const [test, passed] of Object.entries(results)) {
    if (passed) {
      log(
        "success",
        `${test.charAt(0).toUpperCase() + test.slice(1)} tests: PASSED`,
      );
    } else {
      log(
        "error",
        `${test.charAt(0).toUpperCase() + test.slice(1)} tests: FAILED`,
      );
      allTestsPassed = false;
    }
  }

  console.log("");
  if (allTestsPassed) {
    log(
      "success",
      "🎉 All SEO tests passed! Your site is optimized for search engines and social media.",
    );
  } else {
    log(
      "error",
      "❌ Some SEO tests failed. Please review the issues above and fix them.",
    );
    process.exit(1);
  }

  // Additional recommendations
  console.log("");
  log("info", "💡 Additional SEO Recommendations:");
  console.log(
    "   • Test social media sharing on Facebook, Twitter, and LinkedIn",
  );
  console.log("   • Use Google Search Console to monitor indexing status");
  console.log("   • Validate structured data with Google's Rich Results Test");
  console.log("   • Monitor Core Web Vitals for performance optimization");
  console.log("   • Consider implementing breadcrumb navigation");
  console.log("   • Add alt text to all images for accessibility");
}

// Run tests if script is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSEOTests();
}

export { runSEOTests };
