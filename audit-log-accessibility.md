# Accessibility Audit Log

This log tracks all accessibility-related changes and fixes for WCAG 2.1 AA compliance and Illinois Information Technology Accessibility Act (IITAA) 2.1 Standards.

Entries are in reverse chronological order (newest first).

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
