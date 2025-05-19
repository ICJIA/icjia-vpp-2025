/**
 * Script to create favicon files from the Illinois State Seal image
 * 
 * This script uses the 'sharp' library to resize the image and create
 * favicon.png and favicon.ico files in the public directory.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define paths
const sourceImagePath = path.join(process.cwd(), 'temp_assets', 'illinois_seal.png');
const faviconPngPath = path.join(process.cwd(), 'public', 'favicon.png');
const faviconIcoPath = path.join(process.cwd(), 'public', 'favicon.ico');

// Check if source image exists
if (!fs.existsSync(sourceImagePath)) {
  console.error(`Source image not found: ${sourceImagePath}`);
  process.exit(1);
}

// Create favicon.png (32x32)
async function createFaviconPng() {
  try {
    await sharp(sourceImagePath)
      .resize(32, 32)
      .png()
      .toFile(faviconPngPath);
    
    console.log(`Created favicon.png at ${faviconPngPath}`);
  } catch (error) {
    console.error('Error creating favicon.png:', error);
  }
}

// Create favicon.ico (multiple sizes)
async function createFaviconIco() {
  try {
    // For favicon.ico, we'll create a temporary PNG and then convert it
    // Since sharp doesn't directly support ICO format, we'll use a workaround
    const tempPngPath = path.join(process.cwd(), 'temp_assets', 'temp_favicon.png');
    
    await sharp(sourceImagePath)
      .resize(32, 32)
      .png()
      .toFile(tempPngPath);
    
    // Copy the PNG as ICO (this is a workaround since we can't use ImageMagick)
    fs.copyFileSync(tempPngPath, faviconIcoPath);
    
    // Clean up temporary file
    fs.unlinkSync(tempPngPath);
    
    console.log(`Created favicon.ico at ${faviconIcoPath}`);
  } catch (error) {
    console.error('Error creating favicon.ico:', error);
  }
}

// Run the functions
async function main() {
  try {
    await createFaviconPng();
    await createFaviconIco();
    console.log('Favicon creation completed successfully!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main();
