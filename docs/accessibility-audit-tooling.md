# Accessibility Audit Tooling Guide

## Overview

The Illinois Violent Prevention Project includes comprehensive accessibility audit tooling to ensure WCAG 2.1 AA and Illinois IITAA 2.1 compliance. Two complementary tools are available:

1. **Google Lighthouse** - Automated accessibility scoring and recommendations
2. **axe-core** - Detailed WCAG 2.1 AA violation detection across multiple viewports and themes

## Quick Start

### Run All Audits
```bash
yarn audit:accessibility
```

### Run Individual Audits
```bash
# Lighthouse only
yarn audit:lighthouse

# Axe only
yarn audit:axe
```

### Test Against Different Environments
```bash
# Local development server
BASE_URL=http://localhost:8000 yarn audit:axe

# Production site
BASE_URL=https://vpp.icjia.illinois.gov yarn audit:lighthouse

# Staging environment
BASE_URL=https://staging.vpp.icjia.illinois.gov yarn audit:accessibility
```

### Test Specific Routes
```bash
# Test only homepage and plan pages
ROUTES=/,/plan/front-cover,/plan/executive-summary yarn audit:axe

# Test with custom viewports
VIEWPORTS=mobile,desktop yarn audit:axe

# Test specific themes
THEMES=light yarn audit:lighthouse
```

## Lighthouse Audit

### What It Tests
- Accessibility compliance using Google Lighthouse
- WCAG 2.1 AA standards
- 15 primary routes by default
- Generates accessibility scores (0-100)

### Output
- **JSON Reports**: Detailed audit data for programmatic access
- **HTML Reports**: Visual summaries for each route
- **Summary Files**: Text and JSON summaries of all results

### Reports Location
```
reports/lighthouse/YYYY-MM-DDTHH-MM-SS/
├── lighthouse-home.json
├── lighthouse-home.html
├── lighthouse-plan_front-cover.json
├── lighthouse-plan_front-cover.html
├── summary.json
└── summary.txt
```

### Interpreting Results
- **100**: Perfect accessibility score
- **90-99**: Excellent (minor issues)
- **50-89**: Needs improvement
- **0-49**: Poor (significant issues)

## Axe Audit

### What It Tests
- WCAG 2.1 AA compliance violations
- Multiple viewports: mobile (375×667), tablet (768×1024), desktop (1366×900)
- Multiple themes: light and dark
- 15 primary routes by default
- Generates detailed violation reports

### Output
- **JSON Reports**: Individual test results for each route/viewport/theme combination
- **HTML Summary**: Visual summary with violation counts and details
- **Summary Files**: Text and JSON summaries of all results

### Reports Location
```
reports/axe/YYYY-MM-DDTHH-MM-SS/
├── axe-home-mobile-theme-dark.json
├── axe-home-mobile-theme-light.json
├── axe-home-tablet-theme-dark.json
├── ... (90 total test runs)
├── summary.html
├── summary.json
└── summary.txt
```

### Interpreting Results
- **Violations**: Confirmed accessibility failures (must fix)
- **Incomplete**: Heuristic checks requiring manual review (not failures)
- **Passes**: Successful accessibility checks
- **Inapplicable**: Checks not applicable to the page

## Current Compliance Status

### Lighthouse Results (October 29, 2025)
- **Average Score**: 99.3/100
- **Perfect Scores**: 13 routes (86.7%)
- **Excellent Scores**: 2 routes (98/100)
- **Status**: ✓ All routes WCAG 2.1 AA compliant

### Axe Results (October 29, 2025)
- **Total Test Runs**: 90 (15 routes × 3 viewports × 2 themes)
- **Violations**: 4 (all on /legal/terms-of-service at mobile/tablet)
- **Passed Checks**: 1,485
- **Violation-Free Routes**: 14 of 15 (93.3%)
- **Status**: ✓ Excellent compliance with minor mobile form issue

## Configuration

### Default Routes
```javascript
[
  "/",
  "/plan/front-cover",
  "/plan/executive-summary",
  "/plan/public-health-approach",
  "/plan/goals-and-recommendations",
  "/plan/planning-process",
  "/plan/guiding-principles",
  "/plan/references",
  "/resources",
  "/organizational-and-agency-highlights",
  "/download",
  "/contact",
  "/legal/privacy-policy",
  "/legal/terms-of-service"
]
```

### Environment Variables

#### BASE_URL
- **Default**: `http://localhost:8000`
- **Usage**: `BASE_URL=https://example.com yarn audit:axe`

#### ROUTES
- **Default**: All default routes
- **Usage**: `ROUTES=/,/plan/front-cover,/resources yarn audit:lighthouse`
- **Format**: Comma-separated list

#### VIEWPORTS (axe only)
- **Default**: `mobile,tablet,desktop`
- **Usage**: `VIEWPORTS=mobile,desktop yarn audit:axe`
- **Options**: `mobile`, `tablet`, `desktop`

#### THEMES (axe only)
- **Default**: `dark,light`
- **Usage**: `THEMES=light yarn audit:axe`
- **Options**: `dark`, `light`

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Accessibility Audits
  run: |
    yarn audit:lighthouse
    yarn audit:axe
    
- name: Upload Reports
  uses: actions/upload-artifact@v3
  with:
    name: accessibility-reports
    path: reports/
```

### Netlify Build Integration
Add to `netlify.toml`:
```toml
[build]
  command = "yarn generate && yarn audit:accessibility"
```

## Troubleshooting

### Audits Fail to Connect
- Ensure dev server is running: `yarn dev:fast`
- Check BASE_URL is correct
- Verify network connectivity

### Chrome/Chromium Issues
- Lighthouse requires Chrome/Chromium
- Install: `npm install -g chromium`
- Or use system Chrome: `CHROME_PATH=/usr/bin/google-chrome yarn audit:lighthouse`

### Memory Issues
- Reduce number of routes: `ROUTES=/ yarn audit:axe`
- Run audits separately instead of together
- Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096 yarn audit:axe`

## Documentation Portal

View audit results in the documentation portal:
- **Lighthouse Results**: `/documentation/lighthouse-audit.html`
- **Axe Results**: `/documentation/axe-audit.html`
- **Main Portal**: `/documentation/`

## Standards Compliance

- **WCAG 2.1 AA**: Web Content Accessibility Guidelines Level AA
- **Illinois IITAA 2.1**: Illinois Information Technology Accessibility Act 2.1 Standards
- **Color Contrast**: Minimum 4.5:1 (AA), target 7:1+ (project standard)
- **Keyboard Navigation**: Full keyboard accessibility required
- **Screen Readers**: Compatible with NVDA, JAWS, VoiceOver

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Illinois IITAA 2.1 Standards](https://doit.illinois.gov/initiatives/accessibility/iitaa/iitaa-2-1-standards.html)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## Support

For questions or issues with the audit tooling:
1. Review documentation: `/documentation/`
2. Check accessibility reports: `/docs/accessibility/`
3. Contact: accessibility@icjia.illinois.gov

