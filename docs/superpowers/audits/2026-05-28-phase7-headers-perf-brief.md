# Phase 7 Headers/Perf/A11y Port Brief

> Research for the final phase: security headers (CSP), perf (LCP/CLS/images/fonts), Plausible, full a11y sweep. Follow checklist §9 (Plausible), §11 (CSP/_headers), §12/§12a (a11y/CLS floor), §15/§16 (mobile/perf).

## Astro 6.4 items to fold in (we're on 6.4.0; bump to 6.4.2)
- **`markdown.processor: unified({...})`** — migrate `remarkPlugins:[remarkGfm]` + `rehypePlugins:[[rehypeExternalLinks,...]]` to the new processor API (clears the build deprecation warning seen since Phase 3). Needs `@astrojs/markdown-remark`'s `unified`.
- **`experimental.csp`** (NOT 6.4-specific, but the key Phase-7 lever) — Astro auto-hashes all inline `<script>`/`<style>` at build → lets us DROP `'unsafe-inline'` from script-src/style-src and keep only `'unsafe-eval'` (Alpine needs it; can't be hashed). EVALUATE first; fall back to `'unsafe-inline'` if it conflicts with Alpine/inline scripts. (Skip Sätteri Rust md processor — build already ~1.2s; risk to pixel baseline. Cloudflare cf() N/A.)

## 1. Current production CSP + headers (root netlify.toml [[headers]], verbatim — targets Nuxt/Vuetify)
`X-Frame-Options DENY; X-Content-Type-Options nosniff; X-XSS-Protection 1; mode=block; Referrer-Policy strict-origin-when-cross-origin; HSTS max-age=31536000; includeSubDomains; preload; Permissions-Policy camera=(),microphone=(),geolocation=(),payment=(); COOP same-origin; Cache-Control public, max-age=3600`
CSP: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.icjia.cloud; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' data: https://cdn.jsdelivr.net https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://plausible.icjia.cloud https://cdn.jsdelivr.net; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`

## 2. Proposed TIGHTER Astro CSP (drop jsdelivr/google-fonts — all self-hosted)
`default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.icjia.cloud; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https://plausible.icjia.cloud; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`
- Keep `'unsafe-eval'` (Alpine). Keep `'unsafe-inline'` UNLESS experimental.csp works (then drop it). Add `object-src 'none'` (free win). Plausible host in script-src+connect-src (Phase 7 adds Plausible).

## 3. Inline scripts (for CSP)
- No-flash theme `is:inline` (BaseLayout) — stable hash `sha256-6QdOf5rOiytCzvgqDH+MZ9QQxyp19ieoBfgc/GLPaQM=` (deterministic).
- TextCenteredImage `is:inline define:vars` dialog scripts — per-instance hashes (fragile manually).
- TOC scroll-spy — Astro bundles as module (build-changing hash).
- JSON-LD `application/ld+json` — data blocks, exempt from script-src.
- Module bundles `/_astro/*.js` — external, covered by `'self'`.
- **Recommendation:** try `experimental.csp` (auto-hashes all of these); else keep `'unsafe-inline' 'unsafe-eval'` per checklist §11.

## DECISION (P7.5): experimental.csp NOT enabled — keep `'unsafe-inline' 'unsafe-eval'`
Evaluated Astro 6.4 `security.csp` (Context7). Rejected for VPP because:
- It emits a **per-page `<meta http-equiv>` CSP, not HTTP headers** → would run as a SECOND CSP alongside our `_headers` CSP (both must agree; fragile dual-policy management).
- **`'unsafe-inline'` is "incompatible with Astro's CSP" by design** (it auto-hashes bundled scripts; browsers reject unsafe-inline when a hash is present).
- **External scripts "not supported out of the box"** → Plausible would need a manually-maintained hash.
- **Alpine requires `'unsafe-eval'`** regardless (can't be hashed) → removing `'unsafe-inline'` is a marginal XSS-inline gain for significant fragility.
- Checklist §11 explicitly says KEEP `'unsafe-inline' 'unsafe-eval'` for the Alpine/Astro stack.
→ Ship the header-based `_headers` CSP with `'unsafe-inline' 'unsafe-eval'` (tighter than Nuxt: dropped jsdelivr/google-fonts, added object-src 'none'). Revisit experimental.csp portfolio-wide later if desired.

## 4. `_headers` — USE `astro/public/_headers` (NOT context netlify.toml)
Same lesson as `_redirects`: context-scoped netlify.toml headers did NOT apply on the branch deploy. Ship `astro/public/_headers` (origin-layer, context-isolated to the Astro deploy). Include the CSP + all security headers + cache rules:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: <the tighter CSP above>
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Cross-Origin-Opener-Policy: same-origin
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

## 5. Plausible (checklist §9) — in scope
Add to BaseLayout `<head>`: `<script is:inline defer data-domain="vpp.icjia.illinois.gov" src="https://plausible.icjia.cloud/js/script.js"></script>`. NO preconnect (§9). `data-domain="vpp.icjia.illinois.gov"`. (External `src` → falls under script-src host, not unsafe-inline.) Update CSP to allow plausible.icjia.cloud (already in proposed CSP §2).

## 6. Perf fixes (priority order)
- **P1 LCP (zero file change):** hero image is `loading=eager fetchpriority=high` BUT `.hero-image-col` has `opacity:0; animation-delay:0.8s` → LCP element hidden 800ms. **Remove the fadeSlideUp animation from the hero IMAGE column** (keep text animations). Biggest LCP win.
- **P1 CLS:** Stratton portrait MISSING `height` (home.js line ~66, `width:150` no height; natural 600×728 → height 182). Add `height:182`. ICJIA footer logo missing width/height (Footer.astro ~line 22; natural 250×175). Add them.
- **P2 fonts (CLS + 219 KiB):** BaseLayout imports full `@fontsource/{roboto,raleway}/{400,700}.css` (all unicode subsets → 369 KiB woff2). Switch to **`latin-`** variants (`@fontsource/roboto/latin-400.css` etc.) → ~150 KiB (English-only site). Optionally `@fontsource-variable` for fewer files + easy preload. CLS floor 0.02 (§12) is acceptable — don't chase below.
- **P3 images (astro:assets <Image>/Sharp):** move oversized public images to `src/assets/` + `<Image>`: illinois-seal.webp (1200px→40px, ~198 KiB save), DirectorAdamsResized.jpg (1000px→150px, ~80 KiB), Stratton (600→150), PPT_circles/pyramid.webp (8001px→~1600px lightbox, ~1 MiB save on goals page). Hero vpp-cover.webp: KEEP in public (already webp, sized, eager) — only fix the animation.
- CSS render-blocking: `inlineStylesheets:'auto'` already set; 75 KiB main CSS stays external (correct). No action.

## 7. Full a11y sweep (16 routes) — lightcap run_a11y → 100 each
/, /plan/ (redirect), /plan/{front-cover,executive-summary,public-health-approach,guiding-principles,planning-process,goals-and-recommendations,references}/, /resources/, /organizational-and-agency-highlights/, /download/, /news/, /search/, /contact/, /legal/privacy-policy/. Focus: goals dialog focus-trap, search live region, plan TOC keyboard nav, portrait reading order.

## Task breakdown
P7.1 foundation: bump astro 6.4.2; markdown.processor migration; latin-only fonts; `astro/public/_headers` (tighter CSP + security + cache); add `object-src 'none'`.
P7.2 Plausible snippet + CSP allow.
P7.3 LCP/CLS: hero animation fix + Stratton height + footer logo dims.
P7.4 image optimization (astro:assets <Image> for seal/portraits/PPT).
P7.5 experimental.csp evaluation (drop unsafe-inline if it works; else document keep).
P7.6 full a11y sweep + perf re-audit (lightcap) all routes; fix findings; push + verify _headers applied on deploy (curl -I CSP).

## Source refs
netlify.toml 28-39,112-126; BaseLayout.astro 2-5,74; HomeHero.astro 76-85,138-143; home.js ~66; Footer.astro ~22; Header.astro ~57; TextCenteredImage.astro ~121; astro.config.ts 16; dist/_astro/. Checklist §9/§11/§12/§12a/§15/§16.
