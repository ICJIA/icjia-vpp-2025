⚠️  WARNING: DO NOT EDIT DATA FILES IN THIS DIRECTORY ⚠️

================================================================================
                    AUTO-GENERATED FILES - CHANGES WILL BE LOST
================================================================================

This directory contains AUTO-GENERATED data files that are created during the 
build process. Any manual changes made to files in this directory will be 
OVERWRITTEN and LOST during the next build.

📁 EDIT SOURCE FILES INSTEAD:
   All editable configuration files are located in: /config/
   Content files are located in: /content/

🔄 AUTO-GENERATED FILES IN THIS DIRECTORY:
   • search-index.json    → Generated from all content files + configuration
   • fuse.config.json     → Copy of /config/fuse.config.json
   • (Other data files may be added by build scripts)

🛠️  BUILD SCRIPTS THAT REGENERATE THESE FILES:
   • yarn create:search-index-defuddle  → Generates search-index.json and copies fuse.config.json
   • yarn dev / yarn build / yarn generate → Runs all generation scripts

📋 SEARCH INDEX GENERATION PROCESS:
   1. Scans all content files in /content/ directory
   2. Renders pages to HTML using Nuxt Content
   3. Extracts clean content using Defuddle library
   4. Processes content through security sanitization
   5. Generates search-index.json with searchable content
   6. Copies fuse.config.json for client-side search configuration

💡 WHY THESE FILES EXIST:
   • search-index.json: Contains processed, searchable content for Fuse.js
   • fuse.config.json: Client-accessible copy of search configuration
   These files enable the client-side search functionality to work without
   requiring server-side processing during runtime.

🔧 TO MODIFY SEARCH FUNCTIONALITY:
   • Edit search configuration: /config/fuse.config.json
   • Edit content: /content/*.md files
   • Modify search processing: /scripts/generate-search-index-defuddle.js
   • Then run: yarn create:search-index-defuddle

🔗 RELATED DOCUMENTATION:
   • /config/fuse.config.md              → Search configuration documentation
   • /config/defuddle-search.config.md   → Defuddle integration documentation
   • /scripts/generate-search-index-defuddle.js → Search index generation script
   • README.md                           → Project overview and build process

================================================================================
For questions about the search system, see the documentation files listed
above or contact the development team.
================================================================================
