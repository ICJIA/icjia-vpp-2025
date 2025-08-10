### 2025-08-10 (Fix hydration node mismatch on dynamic content header)
- Standardized detection of embedded layout components in dynamic content page header logic to avoid SSR/client divergence that produced Symbol(v-cmt) warnings.
- Files modified/created:
  - `app/pages/[...slug].vue`: Rewrote needsStandardHeader to JSON-stringify content body for stable detection of '::', 'about-hero', 'hero-section', 'feature-section'.
- Technical Notes:
  - Prior logic used body.toString(), which can differ between SSR and client when body is a structured object.
  - Using JSON.stringify(() => string) yields deterministic checks on both SSR and client, preventing mismatched v-if branches around PageTitleSection.

