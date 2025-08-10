### 2025-08-10 (Fix: Header logo overlaps navbar on mobile)
- Replaced header logo <img> with Nuxt Image component and enforced explicit small-screen sizing to prevent overlap with the navbar on mobile. Ensures responsive sizing and uses optimized formats.
- Files modified/created:
  - `app/components/content/AppHeader.vue`: Swapped <img> to <NuxtImg>; added explicit .logo-image sizing (32px on small screens, 40px on md+); removed nested media query style block to avoid SSR/CSR mismatch and overlap; enabled webp format and preload; added sizes hints.
- Technical Notes:
  - Using Nuxt Image leverages IPX provider configured in nuxt.config.ts. The explicit width/height prevents the seal from obscuring the app bar in mobile view. Accessibility preserved with proper alt text and 44x44 target preserved via button sizing.

