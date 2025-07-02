#!/usr/bin/env node

/**
 * Sync Accessibility Audit Logs Script
 *
 * This script ensures that the accessibility audit logs are properly synchronized:
 * - Copies content from root audit-log-accessibility.md to content/accessibility/audit-log.md
 * - Adds proper frontmatter for Nuxt Content
 * - Updates the date in the frontmatter and "Last Updated" section
 * - Maintains WCAG 2.1 AA compliance documentation
 * - Preserves audit trail for accessibility improvements
 *
 * Features:
 * - Automatic frontmatter generation with current date
 * - Chicago timezone date handling for consistency
 * - Content verification after sync
 * - Error handling with detailed logging
 * - Preserves original audit log formatting
 *
 * @module SyncAccessibilityAuditLogs
 * @version 1.0.0
 * @author Violence Prevention Plan for Illinois: 2025-2029
 *
 * @example
 * // Run manually:
 * node scripts/sync-accessibility-audit-logs.js
 *
 * @example
 * // Run via yarn:
 * yarn sync:accessibility-audit
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// File paths
const sourceFile = path.join(rootDir, "audit-log-accessibility.md");
const targetFile = path.join(
  rootDir,
  "content",
  "accessibility",
  "audit-log.md",
);

/**
 * Get current date in Chicago timezone
 *
 * @returns {string} Current date in YYYY-MM-DD format
 *
 * @example
 * const date = getCurrentDate(); // "2025-07-02"
 */
const getCurrentDate = () => {
  const now = new Date();
  const chicagTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" }),
  );
  return chicagTime.toISOString().split("T")[0]; // YYYY-MM-DD format
};

/**
 * Get current date formatted for display in Chicago timezone
 *
 * @returns {string} Current date in "Month DD, YYYY" format
 *
 * @example
 * const date = getCurrentDateFormatted(); // "July 02, 2025"
 */
const getCurrentDateFormatted = () => {
  const now = new Date();
  const chicagTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" }),
  );
  return chicagTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};

/**
 * Main function to synchronize accessibility audit logs
 *
 * Copies content from the root audit log to the content directory,
 * adds proper frontmatter, and updates dates for consistency.
 *
 * @async
 * @function syncAccessibilityAuditLogs
 * @returns {Promise<void>}
 * @throws {Error} If source file doesn't exist or sync fails
 *
 * @example
 * await syncAccessibilityAuditLogs();
 */
async function syncAccessibilityAuditLogs() {
  try {
    console.log("🔄 Starting accessibility audit log synchronization...");

    // Check if source file exists
    if (!fs.existsSync(sourceFile)) {
      console.error(`❌ Source file not found: ${sourceFile}`);
      process.exit(1);
    }

    // Read source content
    const sourceContent = fs.readFileSync(sourceFile, "utf8");
    console.log(`📖 Read source file: ${sourceFile}`);

    // Get current date
    const currentDate = getCurrentDate();
    const currentDateFormatted = getCurrentDateFormatted();

    // Create frontmatter and convert content
    const frontmatter = `---
title: "Accessibility Audit Log"
date: ${currentDate}
description: "This document contains a log of accessibility updates and audits conducted on the Violence Prevention Plan for Illinois: 2025-2029 website."
---

**Last Updated: ${currentDateFormatted}**

`;

    // Convert the markdown content (remove the first line title and add proper structure)
    const contentLines = sourceContent.split("\n");
    const contentWithoutTitle = contentLines.slice(1).join("\n"); // Remove first line (title)

    // Combine frontmatter with content
    const targetContent = frontmatter + contentWithoutTitle;

    // Ensure target directory exists
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`📁 Created directory: ${targetDir}`);
    }

    // Write target file
    fs.writeFileSync(targetFile, targetContent, "utf8");
    console.log(`✅ Successfully synced to: ${targetFile}`);

    // Verify file was written correctly
    const verification = fs.readFileSync(targetFile, "utf8");
    const lines = verification.split("\n").length;
    console.log(`📊 Target file contains ${lines} lines`);

    console.log(
      "🎉 Accessibility audit log synchronization completed successfully!",
    );
  } catch (error) {
    console.error("❌ Error during synchronization:", error.message);
    process.exit(1);
  }
}

// Run the sync
syncAccessibilityAuditLogs();
