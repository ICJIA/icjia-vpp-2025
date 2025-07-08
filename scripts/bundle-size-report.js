#!/usr/bin/env node

/**
 * Bundle Size Analysis and Reporting Script
 *
 * Automated bundle analysis script for the Illinois Violence Prevention Project
 * (ICJIA VPP 2025). This script analyzes the built application bundle, generates
 * size reports, and provides optimization recommendations.
 *
 * Features:
 * - Bundle size analysis with webpack-bundle-analyzer
 * - Performance budget validation per project guidelines
 * - Optimization recommendations
 * - JSON and HTML report generation
 * - CI/CD integration support
 *
 * Usage:
 *   node scripts/bundle-size-report.js [options]
 *
 * Options:
 *   --verbose    Enable detailed logging
 *   --quiet      Suppress non-error output
 *   --json       Output JSON report only
 *   --open       Open HTML report in browser
 *   --ci         CI mode (exit with error if budget exceeded)
 *
 * @author Illinois Criminal Justice Information Authority
 * @license MIT
 */

import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuration for bundle analysis
 */
const config = {
  // Performance budgets per project guidelines
  budgets: {
    totalSize: 250 * 1024, // 250KB total (compressed)
    jsSize: 200 * 1024, // 200KB JavaScript
    cssSize: 50 * 1024, // 50KB CSS
    imageSize: 500 * 1024, // 500KB images
    fontSize: 200 * 1024, // 200KB fonts
    htmlSize: 50 * 1024, // 50KB HTML
  },

  // Paths
  buildDir: path.resolve(__dirname, "../.output"),
  publicDir: path.resolve(__dirname, "../.output/public"),
  reportsDir: path.resolve(__dirname, "../reports"),

  // Analysis options
  analyzer: {
    analyzerMode: "static",
    reportFilename: "bundle-report.html",
    openAnalyzer: false,
    generateStatsFile: true,
    statsFilename: "bundle-stats.json",
  },
};

/**
 * Parse command line arguments
 * @returns {Object} Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    verbose: args.includes("--verbose"),
    quiet: args.includes("--quiet"),
    json: args.includes("--json"),
    open: args.includes("--open"),
    ci: args.includes("--ci"),
  };
}

/**
 * Logger utility with different levels
 */
class Logger {
  constructor(options = {}) {
    this.isVerbose = options.verbose || false;
    this.quiet = options.quiet || false;
  }

  log(message, level = "info") {
    if (this.quiet && level !== "error") return;

    const colors = {
      info: "\x1b[36m", // Cyan
      success: "\x1b[32m", // Green
      warning: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
      reset: "\x1b[0m", // Reset
    };

    const prefix =
      level === "error"
        ? "❌"
        : level === "warning"
          ? "⚠️"
          : level === "success"
            ? "✅"
            : "ℹ️";

    console.log(`${colors[level]}${prefix} ${message}${colors.reset}`);
  }

  verbose(message) {
    if (this.isVerbose) {
      this.log(message, "info");
    }
  }

  success(message) {
    this.log(message, "success");
  }

  warning(message) {
    this.log(message, "warning");
  }

  error(message) {
    this.log(message, "error");
  }
}

/**
 * Analyzes directory size recursively
 * @param {string} dirPath - Directory path to analyze
 * @param {Array} extensions - File extensions to include
 * @returns {Object} Size analysis results
 */
function analyzeDirectorySize(dirPath, extensions = []) {
  let totalSize = 0;
  let fileCount = 0;
  const files = [];

  if (!fs.existsSync(dirPath)) {
    return { totalSize: 0, fileCount: 0, files: [] };
  }

  function walkDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        walkDirectory(itemPath);
      } else if (stats.isFile()) {
        const ext = path.extname(item).toLowerCase();

        if (extensions.length === 0 || extensions.includes(ext)) {
          const size = stats.size;
          totalSize += size;
          fileCount++;

          files.push({
            path: path.relative(dirPath, itemPath),
            size: size,
            sizeFormatted: formatBytes(size),
          });
        }
      }
    }
  }

  walkDirectory(dirPath);

  return {
    totalSize,
    fileCount,
    files: files.sort((a, b) => b.size - a.size), // Sort by size descending
  };
}

/**
 * Formats bytes to human readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Generates bundle size report
 * @param {Object} options - Analysis options
 * @returns {Object} Bundle analysis report
 */
function generateBundleReport(options) {
  const logger = new Logger(options);

  logger.verbose("Starting bundle size analysis...");

  // Analyze different asset types
  const jsAnalysis = analyzeDirectorySize(
    path.join(config.publicDir, "_nuxt"),
    [".js", ".mjs"]
  );

  const cssAnalysis = analyzeDirectorySize(
    path.join(config.publicDir, "_nuxt"),
    [".css"]
  );

  const imageAnalysis = analyzeDirectorySize(
    path.join(config.publicDir, "images"),
    [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"]
  );

  const fontAnalysis = analyzeDirectorySize(
    path.join(config.publicDir, "fonts"),
    [".woff", ".woff2", ".ttf", ".otf", ".eot"]
  );

  // Calculate total size
  const totalSize = jsAnalysis.totalSize + cssAnalysis.totalSize;

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalSize: totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      budgetStatus: totalSize <= config.budgets.totalSize ? "PASS" : "FAIL",
      budgetUsage: ((totalSize / config.budgets.totalSize) * 100).toFixed(1),
    },
    assets: {
      javascript: {
        ...jsAnalysis,
        budget: config.budgets.jsSize,
        budgetFormatted: formatBytes(config.budgets.jsSize),
        status: jsAnalysis.totalSize <= config.budgets.jsSize ? "PASS" : "FAIL",
        usage: ((jsAnalysis.totalSize / config.budgets.jsSize) * 100).toFixed(
          1
        ),
      },
      css: {
        ...cssAnalysis,
        budget: config.budgets.cssSize,
        budgetFormatted: formatBytes(config.budgets.cssSize),
        status:
          cssAnalysis.totalSize <= config.budgets.cssSize ? "PASS" : "FAIL",
        usage: ((cssAnalysis.totalSize / config.budgets.cssSize) * 100).toFixed(
          1
        ),
      },
      images: {
        ...imageAnalysis,
        budget: config.budgets.imageSize,
        budgetFormatted: formatBytes(config.budgets.imageSize),
        status:
          imageAnalysis.totalSize <= config.budgets.imageSize ? "PASS" : "FAIL",
        usage: (
          (imageAnalysis.totalSize / config.budgets.imageSize) *
          100
        ).toFixed(1),
      },
      fonts: {
        ...fontAnalysis,
        budget: config.budgets.fontSize,
        budgetFormatted: formatBytes(config.budgets.fontSize),
        status:
          fontAnalysis.totalSize <= config.budgets.fontSize ? "PASS" : "FAIL",
        usage: (
          (fontAnalysis.totalSize / config.budgets.fontSize) *
          100
        ).toFixed(1),
      },
    },
    recommendations: generateOptimizationRecommendations({
      jsAnalysis,
      cssAnalysis,
      imageAnalysis,
      fontAnalysis,
      totalSize,
    }),
  };

  return report;
}

/**
 * Generates optimization recommendations based on analysis
 * @param {Object} analysis - Bundle analysis data
 * @returns {Array} Array of recommendation objects
 */
function generateOptimizationRecommendations(analysis) {
  const recommendations = [];

  // JavaScript size recommendations
  if (analysis.jsAnalysis.totalSize > config.budgets.jsSize) {
    recommendations.push({
      type: "javascript",
      priority: "high",
      title: "JavaScript bundle exceeds budget",
      description: `JavaScript bundle is ${formatBytes(analysis.jsAnalysis.totalSize)}, exceeding the ${formatBytes(config.budgets.jsSize)} budget.`,
      suggestions: [
        "Implement code splitting with dynamic imports",
        "Remove unused dependencies and code",
        "Use tree shaking to eliminate dead code",
        "Consider lazy loading for non-critical components",
        "Optimize Vuetify component imports",
      ],
    });
  }

  // CSS size recommendations
  if (analysis.cssAnalysis.totalSize > config.budgets.cssSize) {
    recommendations.push({
      type: "css",
      priority: "medium",
      title: "CSS bundle exceeds budget",
      description: `CSS bundle is ${formatBytes(analysis.cssAnalysis.totalSize)}, exceeding the ${formatBytes(config.budgets.cssSize)} budget.`,
      suggestions: [
        "Remove unused CSS rules",
        "Use CSS purging tools",
        "Optimize Vuetify CSS imports",
        "Consider critical CSS extraction",
      ],
    });
  }

  // Total size recommendations
  if (analysis.totalSize > config.budgets.totalSize) {
    recommendations.push({
      type: "overall",
      priority: "critical",
      title: "Total bundle size exceeds performance budget",
      description: `Total bundle size is ${formatBytes(analysis.totalSize)}, exceeding the ${formatBytes(config.budgets.totalSize)} budget by ${((analysis.totalSize / config.budgets.totalSize - 1) * 100).toFixed(1)}%.`,
      suggestions: [
        "Prioritize JavaScript optimization",
        "Implement aggressive code splitting",
        "Review and remove unnecessary dependencies",
        "Consider server-side rendering optimizations",
        "Optimize asset loading strategies",
      ],
    });
  }

  return recommendations;
}

/**
 * Saves report to file
 * @param {Object} report - Bundle analysis report
 * @param {Object} options - Save options
 */
function saveReport(report, options) {
  const logger = new Logger(options);

  // Ensure reports directory exists
  if (!fs.existsSync(config.reportsDir)) {
    fs.mkdirSync(config.reportsDir, { recursive: true });
  }

  // Save JSON report
  const jsonPath = path.join(config.reportsDir, "bundle-size-report.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  logger.verbose(`JSON report saved to: ${jsonPath}`);

  // Generate and save HTML report if not in JSON-only mode
  if (!options.json) {
    const htmlReport = generateHTMLReport(report);
    const htmlPath = path.join(config.reportsDir, "bundle-size-report.html");
    fs.writeFileSync(htmlPath, htmlReport);
    logger.verbose(`HTML report saved to: ${htmlPath}`);

    if (options.open) {
      try {
        execSync(`open "${htmlPath}"`, { stdio: "ignore" });
      } catch (error) {
        logger.verbose("Could not open HTML report automatically");
      }
    }
  }
}

/**
 * Generates HTML report
 * @param {Object} report - Bundle analysis report
 * @returns {string} HTML report content
 */
function generateHTMLReport(report) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundle Size Report - ICJIA VPP 2025</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1, h2 { color: #333; margin-top: 0; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; margin: 10px 0; }
        .status-pass { color: #28a745; }
        .status-fail { color: #dc3545; }
        .asset-section { margin: 30px 0; }
        .file-list { max-height: 300px; overflow-y: auto; background: #f8f9fa; padding: 15px; border-radius: 6px; }
        .file-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
        .recommendations { background: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .recommendation { margin: 15px 0; padding: 15px; background: white; border-radius: 4px; border-left: 4px solid #ffc107; }
        .priority-critical { border-left-color: #dc3545; }
        .priority-high { border-left-color: #fd7e14; }
        .priority-medium { border-left-color: #ffc107; }
        ul { margin: 10px 0; padding-left: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bundle Size Report</h1>
        <p><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</p>

        <div class="summary">
            <div class="metric">
                <div>Total Bundle Size</div>
                <div class="metric-value ${report.summary.budgetStatus === "PASS" ? "status-pass" : "status-fail"}">
                    ${report.summary.totalSizeFormatted}
                </div>
                <div>Budget Usage: ${report.summary.budgetUsage}%</div>
            </div>
            <div class="metric">
                <div>JavaScript</div>
                <div class="metric-value ${report.assets.javascript.status === "PASS" ? "status-pass" : "status-fail"}">
                    ${formatBytes(report.assets.javascript.totalSize)}
                </div>
                <div>Usage: ${report.assets.javascript.usage}%</div>
            </div>
            <div class="metric">
                <div>CSS</div>
                <div class="metric-value ${report.assets.css.status === "PASS" ? "status-pass" : "status-fail"}">
                    ${formatBytes(report.assets.css.totalSize)}
                </div>
                <div>Usage: ${report.assets.css.usage}%</div>
            </div>
        </div>

        ${Object.entries(report.assets)
          .map(
            ([type, data]) => `
            <div class="asset-section">
                <h2>${type.charAt(0).toUpperCase() + type.slice(1)} Assets</h2>
                <p><strong>Total Size:</strong> ${formatBytes(data.totalSize)} / ${data.budgetFormatted}
                   <span class="${data.status === "PASS" ? "status-pass" : "status-fail"}">(${data.status})</span></p>
                <p><strong>File Count:</strong> ${data.fileCount}</p>

                ${
                  data.files.length > 0
                    ? `
                    <div class="file-list">
                        ${data.files
                          .slice(0, 10)
                          .map(
                            (file) => `
                            <div class="file-item">
                                <span>${file.path}</span>
                                <span>${file.sizeFormatted}</span>
                            </div>
                        `
                          )
                          .join("")}
                        ${data.files.length > 10 ? `<div style="text-align: center; margin-top: 10px; color: #666;">... and ${data.files.length - 10} more files</div>` : ""}
                    </div>
                `
                    : "<p>No files found</p>"
                }
            </div>
        `
          )
          .join("")}

        ${
          report.recommendations.length > 0
            ? `
            <div class="recommendations">
                <h2>Optimization Recommendations</h2>
                ${report.recommendations
                  .map(
                    (rec) => `
                    <div class="recommendation priority-${rec.priority}">
                        <h3>${rec.title}</h3>
                        <p>${rec.description}</p>
                        <ul>
                            ${rec.suggestions.map((suggestion) => `<li>${suggestion}</li>`).join("")}
                        </ul>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `
            : ""
        }
    </div>
</body>
</html>`;
}

/**
 * Main execution function
 */
async function main() {
  const options = parseArgs();
  const logger = new Logger(options);

  try {
    logger.log("🔍 Starting bundle size analysis for ICJIA VPP 2025...");

    // Check if build directory exists
    if (!fs.existsSync(config.buildDir)) {
      logger.error('Build directory not found. Please run "yarn build" first.');
      process.exit(1);
    }

    // Generate bundle report
    const report = generateBundleReport(options);

    // Save reports
    saveReport(report, options);

    // Display summary
    if (!options.quiet) {
      logger.log("\n📊 Bundle Size Analysis Summary:");
      logger.log(
        `Total Size: ${report.summary.totalSizeFormatted} (${report.summary.budgetUsage}% of budget)`
      );
      logger.log(
        `JavaScript: ${formatBytes(report.assets.javascript.totalSize)} (${report.assets.javascript.usage}% of budget)`
      );
      logger.log(
        `CSS: ${formatBytes(report.assets.css.totalSize)} (${report.assets.css.usage}% of budget)`
      );

      if (report.summary.budgetStatus === "PASS") {
        logger.success("✅ All performance budgets are within limits!");
      } else {
        logger.warning("⚠️ Performance budget exceeded!");
        logger.log(
          `\n💡 ${report.recommendations.length} optimization recommendations available.`
        );
      }

      logger.log(`\n📄 Reports saved to: ${config.reportsDir}`);
    }

    // Exit with error code if in CI mode and budget exceeded
    if (options.ci && report.summary.budgetStatus === "FAIL") {
      logger.error("Bundle size exceeds performance budget. Build failed.");
      process.exit(1);
    }
  } catch (error) {
    logger.error(`Bundle analysis failed: ${error.message}`);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
