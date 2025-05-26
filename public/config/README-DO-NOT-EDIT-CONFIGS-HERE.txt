⚠️  WARNING: DO NOT EDIT CONFIGURATION FILES IN THIS DIRECTORY ⚠️

================================================================================
                    AUTO-GENERATED FILES - CHANGES WILL BE LOST
================================================================================

This directory contains AUTO-GENERATED copies of configuration files that are 
created during the build process. Any manual changes made to files in this 
directory will be OVERWRITTEN and LOST during the next build.

📁 EDIT SOURCE FILES INSTEAD:
   All editable configuration files are located in: /config/

🔄 AUTO-GENERATED FILES IN THIS DIRECTORY:
   • fuse.config.json     → Generated from /config/fuse.config.json
   • routes.config.json   → Generated from /config/routes.config.json
   • (Other config files may be added by build scripts)

🛠️  BUILD SCRIPTS THAT REGENERATE THESE FILES:
   • yarn create:search-index-defuddle  → Copies fuse.config.json
   • yarn create:site-config            → Generates routes.config.json
   • yarn dev / yarn build / yarn generate → Runs all generation scripts

📋 DEVELOPMENT WORKFLOW:
   1. Edit source files in /config/ directory
   2. Run build commands (dev/build/generate) to regenerate public copies
   3. Never edit files directly in /public/config/ or /public/data/

💡 WHY THESE COPIES EXIST:
   These files are copied to /public/ so they can be accessed by the client-side
   application at runtime via fetch requests. The source files in /config/ are
   not accessible to the browser during runtime.

🔗 RELATED DOCUMENTATION:
   • /config/fuse.config.md     → Fuse.js search configuration
   • /config/routes.config.md   → Routes configuration system
   • /config/site.config.md     → Site configuration system
   • README.md                  → Project overview and build process

================================================================================
For questions about the configuration system, see the documentation files
listed above or contact the development team.
================================================================================
