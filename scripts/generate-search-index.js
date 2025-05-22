/**
 * Search Index Generator
 * 
 * This script generates a search index for all markdown content in the /content directory.
 * The index is saved as a JSON file that can be loaded by the search page.
 * 
 * The index includes:
 * - Title from frontmatter
 * - Content body text
 * - Path to the content
 * - Description from frontmatter (if available)
 * 
 * Usage:
 * node scripts/generate-search-index.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import matter from 'gray-matter';

// Get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define paths
const contentDir = path.join(__dirname, '../content');
const outputDir = path.join(__dirname, '../public/data');
const outputFile = path.join(outputDir, 'search-index.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Extract plain text content from markdown, removing markdown syntax
 * This is a simple implementation - for more complex markdown, consider using a markdown parser
 */
function extractTextFromMarkdown(markdown) {
  if (!markdown) return '';
  
  // Remove code blocks
  let text = markdown.replace(/```[\s\S]*?```/g, '');
  
  // Remove inline code
  text = text.replace(/`[^`]*`/g, '');
  
  // Remove headers
  text = text.replace(/#{1,6}\s+/g, '');
  
  // Remove links but keep the text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove images
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

/**
 * Create a search index from markdown files
 */
async function generateSearchIndex() {
  console.log('Generating search index...');
  
  // Find all markdown files in the content directory
  const markdownFiles = globSync('**/*.md', { cwd: contentDir });
  
  // Process each file
  const searchIndex = await Promise.all(markdownFiles.map(async (file) => {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { data, content: markdownContent } = matter(content);
    
    // Extract text from markdown
    const plainText = extractTextFromMarkdown(markdownContent);
    
    // Determine the route path
    let routePath = '/' + file.replace(/\.md$/, '');
    if (routePath === '/index') {
      routePath = '/';
    }
    
    // Create search item
    return {
      title: data.title || path.basename(file, '.md'),
      content: plainText,
      path: routePath,
      description: data.description || plainText.substring(0, 160) + '...',
      // Store the raw frontmatter data for additional search fields
      frontmatter: data
    };
  }));
  
  // Write the search index to a JSON file
  fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2));
  
  console.log(`Search index generated with ${searchIndex.length} items`);
  console.log(`Index saved to ${outputFile}`);
}

// Run the generator
generateSearchIndex().catch(error => {
  console.error('Error generating search index:', error);
  process.exit(1);
});
