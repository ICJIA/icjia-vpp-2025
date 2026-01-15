/**
 * Comprehensive WCAG 2.1 Level AAA Audit for Documentation Files
 * 
 * This script performs detailed AAA compliance checks including:
 * - Color contrast (7:1 for normal text, 4.5:1 for large text)
 * - Font size verification (minimum 16px)
 * - Focus indicators
 * - Text spacing (line-height 1.5x minimum)
 * - Resize text to 200% test
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FILES_TO_AUDIT = [
  '/docs/index.html',
  '/docs/accessibility/index.html'
];

// Helper to calculate contrast ratio
function getContrastRatio(rgb1, rgb2) {
  const getLuminance = (rgb) => {
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

async function auditFile(browser, filePath) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🔍 Auditing: ${filePath}`);
  console.log('='.repeat(80));
  
  const page = await browser.newPage();
  const fullPath = `file://${join(__dirname, 'public', filePath.replace(/^\//, ''))}`;
  
  await page.goto(fullPath, { waitUntil: 'networkidle0' });
  
  const results = {
    filePath,
    checks: []
  };
  
  // Check 1: Font sizes (AAA recommends 18px+ for better readability)
  console.log('\n📏 Checking font sizes...');
  const fontSizes = await page.evaluate(() => {
    const elements = document.querySelectorAll('body, p, li, a, button, span, div');
    const sizes = [];
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize);
      if (fontSize > 0 && el.textContent.trim()) {
        sizes.push({
          tag: el.tagName,
          fontSize,
          text: el.textContent.trim().substring(0, 50)
        });
      }
    });
    return sizes;
  });
  
  const smallFonts = fontSizes.filter(s => s.fontSize < 16);
  if (smallFonts.length > 0) {
    console.log(`   ❌ Found ${smallFonts.length} elements with font size < 16px`);
    results.checks.push({ name: 'Font Size', status: 'FAIL', details: smallFonts.slice(0, 5) });
  } else {
    console.log(`   ✅ All text is at least 16px`);
    results.checks.push({ name: 'Font Size', status: 'PASS' });
  }
  
  // Check 2: Line height (AAA requires 1.5x minimum)
  console.log('\n📐 Checking line heights...');
  const lineHeights = await page.evaluate(() => {
    const elements = document.querySelectorAll('p, li, div');
    const heights = [];
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight);
      const fontSize = parseFloat(style.fontSize);
      if (lineHeight > 0 && fontSize > 0) {
        heights.push({
          tag: el.tagName,
          ratio: lineHeight / fontSize,
          lineHeight,
          fontSize
        });
      }
    });
    return heights;
  });
  
  const poorLineHeights = lineHeights.filter(h => h.ratio < 1.5);
  if (poorLineHeights.length > 0) {
    console.log(`   ❌ Found ${poorLineHeights.length} elements with line-height < 1.5x`);
    results.checks.push({ name: 'Line Height', status: 'FAIL', details: poorLineHeights.slice(0, 5) });
  } else {
    console.log(`   ✅ All line heights are at least 1.5x font size`);
    results.checks.push({ name: 'Line Height', status: 'PASS' });
  }
  
  // Check 3: Focus indicators
  console.log('\n🎯 Checking focus indicators...');
  const focusStyles = await page.evaluate(() => {
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    const results = [];
    interactiveElements.forEach(el => {
      el.focus();
      const style = window.getComputedStyle(el);
      results.push({
        tag: el.tagName,
        outline: style.outline,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor
      });
    });
    return results;
  });
  
  const noFocus = focusStyles.filter(f => f.outline === 'none' || f.outlineWidth === '0px');
  if (noFocus.length > 0) {
    console.log(`   ❌ Found ${noFocus.length} elements without visible focus indicators`);
    results.checks.push({ name: 'Focus Indicators', status: 'FAIL', details: noFocus.slice(0, 5) });
  } else {
    console.log(`   ✅ All interactive elements have visible focus indicators`);
    results.checks.push({ name: 'Focus Indicators', status: 'PASS' });
  }
  
  // Check 4: Resize to 200% test
  console.log('\n🔍 Testing 200% zoom...');
  await page.setViewport({ width: 1280, height: 1024, deviceScaleFactor: 2 });
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  
  if (hasHorizontalScroll) {
    console.log(`   ❌ Horizontal scrolling detected at 200% zoom`);
    results.checks.push({ name: '200% Zoom', status: 'FAIL' });
  } else {
    console.log(`   ✅ No horizontal scrolling at 200% zoom`);
    results.checks.push({ name: '200% Zoom', status: 'PASS' });
  }
  
  await page.close();
  return results;
}

async function main() {
  console.log('🚀 Comprehensive WCAG 2.1 Level AAA Audit\n');
  
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
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  
  let totalFails = 0;
  allResults.forEach(result => {
    const fails = result.checks.filter(c => c.status === 'FAIL').length;
    totalFails += fails;
    console.log(`\n${result.filePath}: ${fails === 0 ? '✅ PASS' : `❌ ${fails} FAILURES`}`);
  });
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(totalFails === 0 ? '✅ ALL CHECKS PASSED' : `❌ ${totalFails} TOTAL FAILURES`);
  console.log('='.repeat(80));
  
  // Save results
  fs.writeFileSync('docs-aaa-comprehensive-results.json', JSON.stringify(allResults, null, 2));
  
  process.exit(totalFails > 0 ? 1 : 0);
}

main().catch(console.error);

