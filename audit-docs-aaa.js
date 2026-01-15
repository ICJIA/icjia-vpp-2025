/**
 * WCAG 2.1 Level AAA Accessibility Audit for Documentation Files
 * 
 * This script audits the static HTML documentation files in /public/docs/
 * for WCAG 2.1 Level AAA compliance (not just AA).
 * 
 * AAA Requirements:
 * - Color contrast: 7:1 for normal text, 4.5:1 for large text
 * - Enhanced focus indicators
 * - Text spacing requirements
 * - Resize text to 200% without horizontal scrolling
 */

import { AxePuppeteer } from '@axe-core/puppeteer';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Files to audit
const FILES_TO_AUDIT = [
  '/docs/index.html',
  '/docs/accessibility/index.html'
];

// AAA-level rules to check
const AAA_RULES = [
  'color-contrast-enhanced', // AAA contrast (7:1 for normal, 4.5:1 for large)
  'focus-order-semantics',
  'target-size',
  'label-content-name-mismatch',
  'link-in-text-block',
  'meta-viewport-large',
  'region',
  'skip-link'
];

async function auditFile(browser, filePath) {
  console.log(`\n🔍 Auditing: ${filePath}`);
  
  const page = await browser.newPage();
  const fullPath = `file://${join(__dirname, 'public', filePath.replace(/^\//, ''))}`;
  
  try {
    await page.goto(fullPath, { waitUntil: 'networkidle0' });
    
    // Run axe-core with AAA-level rules
    const results = await new AxePuppeteer(page)
      .options({
        runOnly: {
          type: 'tag',
          values: ['wcag2aaa', 'wcag21aaa', 'best-practice']
        }
      })
      .analyze();
    
    await page.close();
    
    return {
      filePath,
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete
    };
  } catch (error) {
    await page.close();
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting WCAG 2.1 Level AAA Audit for Documentation Files\n');
  console.log('Target Standard: WCAG 2.1 Level AAA');
  console.log('Files to audit:', FILES_TO_AUDIT.length);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const allResults = [];
  
  for (const filePath of FILES_TO_AUDIT) {
    const result = await auditFile(browser, filePath);
    allResults.push(result);
  }
  
  await browser.close();
  
  // Generate report
  console.log('\n' + '='.repeat(80));
  console.log('📊 WCAG 2.1 Level AAA Audit Results');
  console.log('='.repeat(80));
  
  let totalViolations = 0;
  let totalPasses = 0;
  
  allResults.forEach(result => {
    console.log(`\n📄 ${result.filePath}`);
    console.log(`   ✅ Passes: ${result.passes.length}`);
    console.log(`   ❌ Violations: ${result.violations.length}`);
    console.log(`   ⚠️  Incomplete: ${result.incomplete.length}`);
    
    totalViolations += result.violations.length;
    totalPasses += result.passes.length;
    
    if (result.violations.length > 0) {
      console.log('\n   Violations:');
      result.violations.forEach((violation, idx) => {
        console.log(`   ${idx + 1}. ${violation.id} (${violation.impact})`);
        console.log(`      ${violation.description}`);
        console.log(`      Affected nodes: ${violation.nodes.length}`);
        violation.nodes.forEach((node, nodeIdx) => {
          console.log(`      - ${node.html.substring(0, 100)}...`);
        });
      });
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`Total Passes: ${totalPasses}`);
  console.log(`Total Violations: ${totalViolations}`);
  console.log('='.repeat(80));
  
  // Save detailed results
  const outputPath = join(__dirname, 'docs-aaa-audit-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2));
  console.log(`\n💾 Detailed results saved to: ${outputPath}`);
  
  process.exit(totalViolations > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('❌ Audit failed:', error);
  process.exit(1);
});

