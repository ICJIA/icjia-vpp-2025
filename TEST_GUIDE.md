# Test Suite Guide

## Overview

This project uses a comprehensive testing strategy with **Integration Tests** for build scripts and **Playwright E2E Tests** for real browser testing.

## Test Structure

```
test/
├── composables/          # Composable unit tests (✅ Passing)
├── utils/                # Utility function tests (✅ Passing)
├── e2e/                  # Mock E2E tests (✅ Passing)
├── integration/          # Build script integration tests (✅ Passing)
└── templates/            # Disabled component test templates

e2e-playwright/           # Playwright E2E tests (📝 Ready to run)
├── accessibility.spec.js
├── navigation.spec.js
└── search.spec.js
```

## Running Tests

### All Unit & Integration Tests
```bash
yarn test        # Run all unit + integration tests (332 tests)
# or
yarn test:unit   # Same as above
```

**Result:** 14 test files, 332 tests passing ✅

### Integration Tests Only
```bash
yarn test:integration
```

### Playwright E2E Tests
```bash
# Run all E2E tests
yarn test:e2e

# Interactive UI mode (recommended for development)
yarn test:e2e:ui

# Run with visible browser
yarn test:e2e:headed

# Run single browser
yarn test:e2e:chromium
```

### Test Coverage
```bash
yarn test:coverage
```

## Test Suite Details

### 1. Integration Tests (32 tests)
**Location:** `test/integration/build-scripts.test.js`

Tests all critical build scripts:
- `generate-site-config.js` - Routes configuration generation
- `generate-sitemap.js` - XML sitemap generation
- `generate-plan-json.js` - Plan JSON/YAML generation
- Build script error handling
- Output file validation
- Content security (blacklist enforcement)

**Status:** ✅ All 32 tests passing

### 2. Playwright E2E Tests (3 spec files)
**Location:** `e2e-playwright/`

Real browser tests for:
- **Accessibility** - Keyboard navigation, skip links, ARIA, focus management
- **Navigation** - Page routing, mobile/desktop menus, breadcrumbs, scroll behavior
- **Search** - Search input, results display, filtering, highlighting

Tests run in multiple browsers:
- Chromium, Firefox, WebKit
- Mobile Chrome, Mobile Safari
- iPad

**Status:** 📝 Ready to run (requires `yarn dev` server)

### 3. Composable & Utility Tests (300+ tests)
**Location:** `test/composables/` and `test/utils/`

Unit tests for:
- `useTheme()` - Theme management
- `useAnnouncer()` - Screen reader announcements
- `useConsoleLogger()` - Development logging
- `useReportNavigation()` - Report navigation
- `useSiteSettings()` - Site configuration
- `useReferences()` - Reference management
- Sanitization utilities
- Config loaders

**Status:** ✅ All passing

## Component Tests

Component tests are **disabled** because Nuxt 4's auto-imports (`#imports`) require complex mocking setup.

**Alternative:** Use Playwright E2E tests which test components in their real runtime environment with actual user interactions.

**Disabled templates location:** `test/templates/component-tests-disabled/`

## Test Configuration

- **Vitest Config:** `vitest.config.js`
- **Playwright Config:** `playwright.config.js`
- **Coverage:** v8 provider with HTML, JSON, and text reporters

## Best Practices

1. **Run integration tests** before committing to ensure build scripts work
2. **Use Playwright E2E tests** for component behavior testing
3. **Run with coverage** periodically to identify gaps
4. **Use Playwright UI mode** for debugging E2E tests

## Troubleshooting

### Playwright Tests Won't Start
Ensure dev server is running:
```bash
yarn dev:fast
```

Playwright auto-starts the server, but manual start provides better debugging.

### Integration Tests Fail
Ensure build outputs exist:
```bash
yarn build
```

Or run individual build scripts to regenerate outputs.

### Coverage Reports Missing
Install coverage dependencies:
```bash
yarn add -D @vitest/coverage-v8
```

## Future Enhancements

- Add visual regression testing with Playwright
- Implement performance testing
- Add API endpoint testing
- Consider component tests with @nuxt/test-utils if isolated testing becomes critical

## Test Coverage Summary

| Test Type | Count | Status | Purpose |
|-----------|-------|--------|---------|
| Integration | 32 | ✅ Passing | Build script validation |
| Playwright E2E | 3 specs | 📝 Ready | Real browser testing |
| Composable | ~150 | ✅ Passing | Logic unit tests |
| Utility | ~50 | ✅ Passing | Helper function tests |
| E2E Mock | ~100 | ✅ Passing | Mocked navigation/content tests |

**Total:** 332+ tests passing
