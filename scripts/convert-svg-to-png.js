/**
 * Convert SVG to PNG using Puppeteer
 * Usage: node scripts/convert-svg-to-png.js
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

async function convertSvgToPng() {
  console.log("Converting SVG to PNG...");

  const svgPath = join(projectRoot, "public/images/og-image-vpp-2025.svg");
  const pngPath = join(projectRoot, "public/images/og-image-vpp-2025.png");

  // Read SVG file
  const svgContent = readFileSync(svgPath, "utf-8");

  // Create HTML with SVG embedded
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; }
          svg { display: block; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `;

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    // Set viewport to exact OG image dimensions
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
    });

    // Load HTML with SVG
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Take screenshot
    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
      omitBackground: false,
    });

    // Save PNG
    writeFileSync(pngPath, screenshot);

    console.log(`✅ PNG created successfully at: ${pngPath}`);
    console.log(`   Dimensions: 1200x630px`);
  } catch (error) {
    console.error("Error converting SVG to PNG:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

convertSvgToPng();
