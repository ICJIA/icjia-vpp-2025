# Accessibility Audit Log

This log tracks all accessibility-related changes and fixes for WCAG 2.1 AA compliance and Illinois Information Technology Accessibility Act (IITAA) 2.1 Standards.

Entries are in reverse chronological order (newest first).

---

## 2026-03-31: Fix Keyboard Focus Visibility — Vuetify 3 CSS Variable Migration

**Summary**
Fixed keyboard focus indicators being invisible across the entire site due to use of Vuetify 2 CSS variables (`--v-primary-base`, `--v-accent-base`, `--v-error-base`) that do not exist in Vuetify 3. Replaced with correct Vuetify 3 equivalents (`rgb(var(--v-theme-primary))`, etc.). Also added missing CSS definition for `.focus-outline-visible` class that was applied via JavaScript but had no styling rule.

**Issue Source**: Siteimprove accessibility scan flagged "Is it clear which page element has focus from the keyboard?" on 4 pages: `/plan/public-health-approach/`, `/plan/executive-summary/`, `/plan/planning-process/`, `/plan/guiding-principles/`.

**Root Cause**: All `:focus` and `:focus-visible` outline declarations used `var(--v-primary-base)`, a Vuetify 2 CSS custom property. Vuetify 3 generates `--v-theme-primary` (comma-separated RGB values), so `var(--v-primary-base)` resolved to nothing, rendering all focus outlines invisible.

**Files Modified**
- `app/assets/css/main.scss`
  - Replaced all `var(--v-primary-base)` → `rgb(var(--v-theme-primary))`
  - Replaced `var(--v-accent-base)` → `rgb(var(--v-theme-accent))`
  - Replaced `var(--v-error-base, #e74c3c)` → `rgb(var(--v-theme-error, 231, 76, 60))`
  - Added `.focus-outline-visible` CSS class for scrollable regions and code blocks
- `app/pages/[...slug].vue` — Replaced 3 occurrences of `var(--v-primary-base)`
- `app/pages/index.vue` — Replaced 1 occurrence
- `app/components/content/HomeHero.vue` — Replaced 2 occurrences
- `app/components/content/ReferenceTooltip.vue` — Replaced `--v-primary-base` and `--v-error-base`
- `app/components/content/AppHeader.vue` — Replaced 1 occurrence
- `app/components/content/HeroSection.vue` — Replaced 1 occurrence
- `app/components/content/FeatureCard.vue` — Replaced 1 occurrence
- `app/components/content/AboutValues.vue` — Replaced 1 occurrence
- `app/components/content/AboutContact.vue` — Replaced 1 occurrence
- `app/components/content/AboutApproach.vue` — Replaced 1 occurrence
- `app/components/ContentDisplay.vue` — Replaced 2 occurrences
- `app/components/SimpleContentDisplay.vue` — Replaced 2 occurrences
- `app/error.vue` — Replaced 1 occurrence

**Technical Notes**
- **WCAG Criterion**: 2.4.7 Focus Visible (Level AA)
- **Vuetify 3 CSS Variables**: Theme colors stored as comma-separated RGB values (e.g., `--v-theme-primary: 7, 71, 166`), used via `rgb(var(--v-theme-primary))`
- **Total replacements**: 21 occurrences of deprecated Vuetify 2 variables across 15 files
- **`.focus-outline-visible` class**: Now provides 3px solid primary-color outline with 2px offset on `:focus-visible`, matching global focus styles
- **Build**: Production build and all 332 tests pass

---

## 2026-02-12: Fix WCAG 2.4.7 Focus Visible Violations

**Summary**
Fixed 3 serious accessibility violations identified by axe-core accessibility testing. Added visible focus indicators to interactive elements that were missing keyboard focus styles, ensuring compliance with WCAG 2.4.7 (Focus Visible) AA requirements.

**Files Modified**
- `app/pages/index.vue`
  - Added `:focus` and `:focus-visible` styles to `.home-page` class
  - 3px solid blue outline (#1976d2) with 2px offset

- `app/components/content/HomeHero.vue`
  - Added `:focus` and `:focus-visible` styles to `.hero-image` class
  - 3px solid blue outline with 4px offset, matching hover transform/shadow effects
  - Added `:focus` and `:focus-visible` styles to `.hero-image-caption` class
  - 3px solid blue outline with 2px offset, matching hover color change

**Technical Notes**
- **Violations Fixed**: All 3 serious violations from axe-core rule `advanced/css-focus-visible`
- **WCAG Criterion**: 2.4.7 Focus Visible (Level AA)
- **Testing Method**: Automated testing with axe-core DevTools extension
- **Implementation**: Used both `:focus` and `:focus-visible` pseudo-classes for broad browser compatibility
- **Visual Design**: High contrast 3px outline ensures visibility in both light and dark themes
- **User Experience**: Focus styles match hover states where applicable for visual consistency
- **Elements Fixed**:
  1. `.home-page` - Scrollable region container
  2. `.hero-image` - Interactive image with role="button" and tabindex="0"
  3. `.hero-image-caption` - Interactive caption div with role="button" and tabindex="0"

**Commit**: c78de3b - fix: add visible focus indicators for WCAG 2.4.7 compliance
