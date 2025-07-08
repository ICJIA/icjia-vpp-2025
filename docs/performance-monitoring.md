# Performance Monitoring Infrastructure

This document describes the comprehensive performance monitoring infrastructure implemented for the Illinois Violence Prevention Project (ICJIA VPP 2025).

## Overview

The performance monitoring system provides automated tracking and analysis of:

- **Core Web Vitals** - Real-time user experience metrics
- **Bundle Size Analysis** - Automated bundle optimization recommendations
- **Performance Budgets** - Automated enforcement of performance targets

## Core Web Vitals Tracking

### Implementation

- **Plugin**: `plugins/web-vitals.client.js`
- **Library**: web-vitals v5.0.3
- **Integration**: Plausible Analytics for metric reporting

### Tracked Metrics

- **LCP (Largest Contentful Paint)**: Loading performance target <2.5s
- **INP (Interaction to Next Paint)**: Interactivity target <200ms (replaces FID in v5)
- **CLS (Cumulative Layout Shift)**: Visual stability target <0.1
- **FCP (First Contentful Paint)**: Loading performance target <1.8s
- **TTFB (Time to First Byte)**: Server response target <800ms

### Features

- Automatic batch reporting every 5 minutes
- Integration with Plausible Analytics for custom events
- Performance rating classification (good/needs-improvement/poor)
- Debug mode with detailed console logging in development
- Graceful error handling and fallbacks

## Bundle Size Analysis

### Implementation

- **Script**: `scripts/bundle-size-report.js`
- **Library**: webpack-bundle-analyzer v4.10.2
- **Reports**: HTML and JSON formats

### Performance Budgets

- **Total Bundle**: 250KB (compressed)
- **JavaScript**: 200KB
- **CSS**: 50KB
- **Images**: 500KB
- **Fonts**: 200KB

### Current Status

- **Total Size**: 1.49 MB (609.3% over budget)
- **JavaScript**: 1.21 MB (619.8% over budget)
- **CSS**: 283.5 KB (567.0% over budget)

### Optimization Recommendations

1. Implement code splitting with dynamic imports
2. Remove unused dependencies and code
3. Use tree shaking to eliminate dead code
4. Consider lazy loading for non-critical components
5. Optimize Vuetify component imports

## Usage Instructions

### Manual Performance Analysis

```bash
# Run bundle size analysis
yarn perf:bundle

# Run bundle analysis with detailed output
yarn perf:bundle:verbose

# Open bundle report in browser
yarn perf:bundle:open

# Run all performance tools
yarn perf:all

# Generate and open reports
yarn perf:report
```

### CI/CD Integration

```bash
# Run in CI mode (fails build if budgets exceeded)
yarn perf:bundle:ci
```

### Automated Integration

Performance monitoring runs automatically during:

- `yarn build` - Production builds
- `yarn generate` - Static site generation
- `yarn build:verbose` - Detailed build logging

## Report Locations

### Bundle Analysis Reports

- **HTML Report**: `reports/bundle-size-report.html`
- **JSON Report**: `reports/bundle-size-report.json`

## Configuration

### Core Web Vitals Configuration

Located in `nuxt.config.ts` under `runtimeConfig.public.performance`:

```javascript
performance: {
  webVitalsEnabled: true,
  budgets: {
    totalSize: 250 * 1024,    // 250KB
    jsSize: 200 * 1024,       // 200KB
    cssSize: 50 * 1024,       // 50KB
  },
  thresholds: {
    LCP: { good: 2500, poor: 4000 },
    INP: { good: 200, poor: 500 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 }
  }
}
```

### Bundle Analysis Configuration

Located in `scripts/bundle-size-report.js`:

```javascript
const config = {
  budgets: {
    totalSize: 250 * 1024, // 250KB total (compressed)
    jsSize: 200 * 1024, // 200KB JavaScript
    cssSize: 50 * 1024, // 50KB CSS
    imageSize: 500 * 1024, // 500KB images
    fontSize: 200 * 1024, // 200KB fonts
    htmlSize: 50 * 1024, // 50KB HTML
  },
};
```

## Troubleshooting

### Common Issues

1. **Bundle Analysis Errors**
   - Ensure build has completed successfully
   - Check `.output/public` directory exists
   - Verify file permissions for reports directory

2. **Web Vitals Not Tracking**
   - Check browser console for errors
   - Verify Plausible Analytics integration
   - Ensure client-side JavaScript is enabled

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Bundle analysis with verbose output
yarn perf:bundle:verbose

# Development mode with debug logging
NODE_ENV=development yarn dev
```

## Performance Optimization Roadmap

### Immediate Actions (High Priority)

1. Implement dynamic imports for large components
2. Optimize Vuetify component imports
3. Remove unused dependencies
4. Enable tree shaking

### Medium-term Goals

1. Implement service worker for caching
2. Optimize image loading and formats
3. Implement critical CSS extraction
4. Add performance regression testing

### Long-term Objectives

1. Achieve <250KB bundle size target
2. Implement real-time performance monitoring
3. Establish performance culture and best practices

## Monitoring and Alerts

### Current Monitoring

- Automated bundle size analysis on every build
- Core Web Vitals tracking in production

### Future Enhancements

- Performance regression alerts
- Real-time monitoring dashboard
- Automated optimization suggestions
- Performance budget enforcement in CI/CD

## Documentation and Support

- **JSDoc Documentation**: Available in generated API docs
- **Component Documentation**: Vue component docs with performance notes
- **Audit Logs**: Detailed implementation history in `audit-log-project.md`
- **Issue Tracking**: Performance issues tracked in project management system

For questions or support, refer to the project documentation or contact the development team.
