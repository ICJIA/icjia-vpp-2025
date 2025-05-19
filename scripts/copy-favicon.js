/**
 * Script to copy the Illinois State Seal image as the new favicon
 */

const fs = require('fs');
const path = require('path');

// Define paths
const sourceImagePath = path.join(process.cwd(), 'temp_assets', 'illinois_seal.png');
const faviconPngPath = path.join(process.cwd(), 'public', 'favicon.png');
const faviconIcoPath = path.join(process.cwd(), 'public', 'favicon.ico');

// Check if source image exists
if (!fs.existsSync(sourceImagePath)) {
  console.error(`Source image not found: ${sourceImagePath}`);
  process.exit(1);
}

// Copy the Illinois State Seal image as the new favicon.png
try {
  fs.copyFileSync(sourceImagePath, faviconPngPath);
  console.log(`Copied ${sourceImagePath} to ${faviconPngPath}`);
  
  // Also copy it as favicon.ico (this is a workaround since we can't convert to ICO format)
  fs.copyFileSync(sourceImagePath, faviconIcoPath);
  console.log(`Copied ${sourceImagePath} to ${faviconIcoPath}`);
  
  console.log('Favicon replacement completed successfully!');
} catch (error) {
  console.error('Error copying favicon files:', error);
}
