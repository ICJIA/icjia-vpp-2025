/**
 * Verify Touch Target Sizes for AAA Compliance
 * 
 * WCAG 2.1 Level AAA requires minimum 44x44px touch targets
 * This script verifies all interactive elements meet this requirement
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FILES_TO_CHECK = [
  '/docs/index.html',
  '/docs/accessibility/index.html'
];

async function checkTouchTargets(browser, filePath) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🎯 Checking Touch Targets: ${filePath}`);
  console.log('='.repeat(80));
  
  const page = await browser.newPage();
  const fullPath = `file://${join(__dirname, 'public', filePath.replace(/^\//, ''))}`;
  
  await page.goto(fullPath, { waitUntil: 'networkidle0' });
  
  const touchTargets = await page.evaluate(() => {
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    const results = [];
    
    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(el);
      
      results.push({
        tag: el.tagName,
        text: el.textContent.trim().substring(0, 50),
        width: rect.width,
        height: rect.height,
        meetsMinimum: rect.width >= 44 && rect.height >= 44,
        padding: computedStyle.padding,
        minHeight: computedStyle.minHeight,
        minWidth: computedStyle.minWidth
      });
    });
    
    return results;
  });
  
  await page.close();
  
  const failing = touchTargets.filter(t => !t.meetsMinimum);
  const passing = touchTargets.filter(t => t.meetsMinimum);
  
  console.log(`\n✅ Passing: ${passing.length} elements`);
  console.log(`❌ Failing: ${failing.length} elements`);
  
  if (failing.length > 0) {
    console.log('\n❌ Elements below 44x44px:');
    failing.forEach((target, idx) => {
      console.log(`\n${idx + 1}. ${target.tag}`);
      console.log(`   Text: "${target.text}"`);
      console.log(`   Size: ${target.width.toFixed(2)} x ${target.height.toFixed(2)} pixels`);
      console.log(`   Padding: ${target.padding}`);
      console.log(`   Min-height: ${target.minHeight}`);
      console.log(`   Min-width: ${target.minWidth}`);
    });
  } else {
    console.log('\n✅ All interactive elements meet 44x44px minimum');
  }
  
  return {
    filePath,
    total: touchTargets.length,
    passing: passing.length,
    failing: failing.length,
    failingElements: failing
  };
}

async function main() {
  console.log('🚀 Touch Target Size Verification (AAA Requirement: 44x44px)\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const allResults = [];
  
  for (const filePath of FILES_TO_CHECK) {
    const result = await checkTouchTargets(browser, filePath);
    allResults.push(result);
  }
  
  await browser.close();
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  
  let totalFailing = 0;
  allResults.forEach(result => {
    totalFailing += result.failing;
    console.log(`\n${result.filePath}:`);
    console.log(`  Total elements: ${result.total}`);
    console.log(`  ✅ Passing: ${result.passing}`);
    console.log(`  ❌ Failing: ${result.failing}`);
  });
  
  console.log(`\n${'='.repeat(80)}`);
  if (totalFailing === 0) {
    console.log('✅ ALL TOUCH TARGETS MEET 44x44px MINIMUM');
  } else {
    console.log(`❌ ${totalFailing} TOUCH TARGETS BELOW 44x44px`);
  }
  console.log('='.repeat(80));
  
  process.exit(totalFailing > 0 ? 1 : 0);
}

main().catch(console.error);

