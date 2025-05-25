# Unified Logging System Documentation

## Overview

The Violence Prevention Plan for Illinois: 2025-2029 project implements a comprehensive unified logging system that works consistently across both Node.js (server-side) and browser environments with configurable verbosity levels and color coding.

## Architecture

### Core Components

1. **`utils/logger.js`** - Unified logger that works in both Node.js and browser environments
2. **`utils/config-loader.js`** - Configuration loader for logging settings
3. **`composables/useConsoleLogger.js`** - Browser-specific composable for Vue components
4. **`config/site.config.json`** - Centralized logging configuration

### Environment Detection

The system automatically detects the runtime environment:
- **Node.js**: Uses ANSI color codes for terminal output
- **Browser**: Uses CSS color codes for console styling

## Configuration

### Verbosity Levels

| Level | Description | Shows |
|-------|-------------|-------|
| `DETAILED` | All logs including debug information | success, error, warning, info, debug |
| `NORMAL` | Standard logs (default) | success, error, warning, info |
| `CONCISE` | Essential logs only | success, error |

### Configuration Options

```json
{
  "logging": {
    "level": "NORMAL",
    "showTimestamp": true,
    "showPrefix": true,
    "groupMessages": true,
    "buildSummary": true,
    "colors": {
      "success": "#27ae60",
      "error": "#e74c3c",
      "warning": "#f39c12",
      "info": "#3498db",
      "debug": "#7f8c8d"
    }
  }
}
```

## Usage

### Server-Side Scripts

```javascript
import { createLogger } from '../utils/logger.js';
import { createScriptLoggerConfig, getVerbosityFromArgs } from '../utils/config-loader.js';

// Initialize logger with configuration
const verbosity = getVerbosityFromArgs() || 'NORMAL';
const loggerConfig = await createScriptLoggerConfig('ScriptName', {
  level: verbosity,
  groupMessages: true
});
const logger = createLogger(loggerConfig).createScope('ScriptName');

// Basic logging
logger.success('Operation completed successfully');
logger.error('Something went wrong', errorObject);
logger.warning('This is a warning');
logger.info('Informational message');
logger.debug('Debug information');

// Performance timing
logger.time('operation');
// ... do work ...
logger.timeEnd('operation', 'Operation completed');

// Message grouping
logger.addToGroup('success', 'File processed: file1.txt');
logger.addToGroup('success', 'File processed: file2.txt');
logger.addToGroup('warning', 'File skipped: file3.txt');
logger.summarize('File processing summary');
```

### Browser/Vue Components

```javascript
import { useConsoleLogger } from '~/composables/useConsoleLogger';

const { logUI, logError, logSuccess, isEnabled, toggle } = useConsoleLogger();

// Log UI events
logUI('Button clicked', { id: 'submit-btn' });

// Log errors
logError('Failed to fetch data', errorObject);

// Log success
logSuccess('Data saved successfully');

// Toggle logging
toggle();
```

## Command Line Usage

### Verbosity Flags

```bash
# Verbose output (DETAILED level)
yarn dev:verbose
yarn build:verbose
yarn generate:verbose

# Quiet output (CONCISE level)
yarn dev:quiet
yarn build:quiet
yarn generate:quiet

# Normal output (default)
yarn dev
yarn build
yarn generate
```

### Individual Scripts

```bash
# Run with specific verbosity
node scripts/generate-site-config.js --verbose
node scripts/generate-site-config.js --quiet
node scripts/generate-site-config.js --normal
```

## Environment Variables

```bash
# Set logging level
export LOG_LEVEL=DETAILED
export LOG_LEVEL=NORMAL
export LOG_LEVEL=CONCISE

# Control specific features
export LOG_TIMESTAMP=false
export LOG_GROUP=true
```

## Color Scheme

### Node.js Terminal Colors (ANSI)
- **Success**: Green (`\x1b[32m`)
- **Error**: Red (`\x1b[31m`)
- **Warning**: Yellow (`\x1b[33m`)
- **Info**: Cyan (`\x1b[36m`)
- **Debug**: Gray (`\x1b[90m`)

### Browser Console Colors (CSS)
- **Success**: `#27ae60` (Green)
- **Error**: `#e74c3c` (Red)
- **Warning**: `#f39c12` (Orange)
- **Info**: `#3498db` (Blue)
- **Debug**: `#7f8c8d` (Gray)

## Build Integration

### Script Execution Order

1. **Accessibility HTML Generation**
2. **Search Index Generation**
3. **Site Configuration Generation**
4. **Nuxt Build/Dev/Generate**

### Grouped Output Example

```
[SiteConfig] 🔍 Starting site configuration generation...
[SiteConfig] 📄 Processing markdown files from content directory...
[SiteConfig] 🖼️  Processing Vue files from pages directory...
[SiteConfig] 🔄 Starting page deduplication process...
[SiteConfig] ✅ Routes configuration generated successfully!
[SiteConfig] 📊 Summary: 5 pages (4 content, 5 Vue, 4 combined, 4 blacklisted)
[SiteConfig] Routes configuration generation completed (245ms)
```

## Best Practices

### For Script Development

1. **Use scoped loggers** for context-specific logging
2. **Group related messages** for cleaner build output
3. **Use appropriate log levels** (debug for detailed info, info for progress, success/error for results)
4. **Include timing information** for performance monitoring
5. **Provide meaningful error messages** with context

### For Component Development

1. **Use the existing useConsoleLogger** composable
2. **Choose appropriate categories** (ui, route, theme, lifecycle, etc.)
3. **Include relevant data objects** for debugging
4. **Respect the global enabled state**
5. **Use consistent naming conventions**

## Migration Guide

### From Old Logger Classes

Replace old logger instances:

```javascript
// Old
this.logger.log('success', 'Message');

// New
this.logger.success('Message');
```

### From Direct Console Calls

Replace direct console usage:

```javascript
// Old
console.log('Message');

// New
logger.info('Message');
```

## Troubleshooting

### Common Issues

1. **Logger not initialized**: Ensure logger is created before use
2. **Missing colors in terminal**: Check terminal ANSI support
3. **Verbose output**: Use `--quiet` flag or set `LOG_LEVEL=CONCISE`
4. **Missing logs**: Check verbosity level and enabled state

### Debug Mode

Enable detailed logging to troubleshoot issues:

```bash
LOG_LEVEL=DETAILED yarn dev
```

## Future Enhancements

- **Log file output** for production environments
- **Remote logging** integration
- **Performance metrics** collection
- **Log filtering** by component/category
- **Structured logging** with JSON output

*Last Updated: May 25, 2025*
