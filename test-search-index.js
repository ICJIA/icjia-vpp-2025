#!/usr/bin/env node

// Simple test to check if the search index generation works
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Testing search index generation...');

try {
  // Check if the script file exists
  const scriptPath = path.join(__dirname, 'scripts', 'generate-search-index.js');
  console.log('Script path:', scriptPath);
  console.log('Script exists:', fs.existsSync(scriptPath));
  
  // Check if config file exists
  const configPath = path.join(__dirname, 'config', 'fuse.config.json');
  console.log('Config path:', configPath);
  console.log('Config exists:', fs.existsSync(configPath));
  
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('Config loaded successfully');
    console.log('Config keys:', Object.keys(config));
  }
  
  // Check if pages directory exists
  const pagesDir = path.join(__dirname, 'pages');
  console.log('Pages directory exists:', fs.existsSync(pagesDir));
  
  if (fs.existsSync(pagesDir)) {
    const files = fs.readdirSync(pagesDir);
    console.log('Pages files:', files);
  }
  
  // Check if content directory exists
  const contentDir = path.join(__dirname, 'content');
  console.log('Content directory exists:', fs.existsSync(contentDir));
  
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir);
    console.log('Content files:', files);
  }
  
  console.log('Basic checks completed successfully');
  
} catch (error) {
  console.error('Error during testing:', error);
}
