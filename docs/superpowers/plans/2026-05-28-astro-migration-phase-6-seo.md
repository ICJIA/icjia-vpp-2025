# Astro Migration — Phase 6 (SEO/Discovery) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Read this + `docs/superpowers/audits/2026-05-28-phase6-seo-brief.md` + cited source. Verify by inspecting built HTML + lightcap SEO.

**Goal:** Full per-page SEO — astro-seo meta (title/description/canonical/OG/Twitter), JSON-LD structured data, sitemap (+/sitemap.xml rewrite), robots.txt, llms.txt — matching the current site's discovery output, per checklist §8/§10.

**Architecture:** `astro-seo` `<SEO>` in BaseLayout (extended Props) + a WebPage JSON-LD block; page templates pass per-page props + add page-type JSON-LD (Org/WebSite on home; Article/BreadcrumbList on content; SearchAction on search). `@astrojs/sitemap` (already configured) + a Netlify two-rewrite for `/sitemap.xml`. Static `robots.txt` + `llms.txt`. Titles follow checklist §8 ≤60 rule (concise suffix; flagged).

**Brief:** `docs/superpowers/audits/2026-05-28-phase6-seo-brief.md`
**Verification:** built HTML inspection + prod compare + lightcap SEO 100. Branch `feat/astro-migration` (no merge to main). Commit per task; no Co-Authored-By trailer.

---

## Task 1: SEO foundation (astro-seo + helpers + static files + assets)
- [ ] `cd astro && pnpm add astro-seo`.
- [ ] Create `astro/src/lib/seo.ts`: `SITE_ORIGIN`, `SITE_NAME`, `SITE_SHORT` ("Illinois VPP"), `DEFAULT_DESCRIPTION`, `DEFAULT_KEYWORDS`, `DEFAULT_OG_IMAGE`; `truncateTitle(page, max=60)` (full name if page is empty/home; else `<word-boundary-truncated page> | Illinois VPP`, total ≤60); `truncateDescription(d)` (return d if 80–160 else clamp/fallback to default); a build-time assert that `DEFAULT_DESCRIPTION.length` is 80–160. Export JSON-LD builders: `webPageJsonLd({title,description,url,image,publishedAt,updatedAt})`, `organizationJsonLd()`, `webSiteJsonLd()`, `articleJsonLd({...})`, `breadcrumbJsonLd(pathname)` (shapes per brief §3, verbatim from `StructuredData.vue`).
- [ ] Copy assets: `cp public/images/og-image-vpp-2025.png astro/public/images/` and `cp public/images/illinois-seal.png astro/public/images/` (verify present).
- [ ] Create `astro/public/robots.txt` (verbatim from brief §5 — NO underscore) and `astro/public/llms.txt` (copy root `public/llms.txt` verbatim).
- [ ] `pnpm build` succeeds; `ls astro/public/{robots.txt,llms.txt} astro/public/images/{og-image-vpp-2025.png,illinois-seal.png}`. Commit `feat(astro): SEO foundation — astro-seo, seo.ts helpers, robots/llms, OG assets`.

## Task 2: BaseLayout SEO + WebPage JSON-LD
- [ ] Modify `astro/src/layouts/BaseLayout.astro`: expand `Props` (brief §2); compute canonical from `Astro.url.pathname`; render `<SEO>` (replacing the bare `<title>`/`<meta description>`) with the full openGraph/twitter/extend mapping (brief §2); add `<script type="application/ld+json" set:html={JSON.stringify(webPageJsonLd(...))} />`. KEEP the no-flash theme script + favicon (SEO `extend.link` can own the icons; avoid duplicate favicon tags). Use `seo.ts` helpers.
- [ ] `pnpm build`; inspect `dist/index.html` for `<title>`, `og:image`, `twitter:card`, `<link rel="canonical">`, and the WebPage JSON-LD. Commit `feat(astro): astro-seo + WebPage JSON-LD in BaseLayout`.

## Task 3: Per-page SEO wiring + page-type JSON-LD
- [ ] `index.astro` (home): pass `title=""` (→ full site name), `publishedAt`/`updatedAt`; add GovernmentOrganization + WebSite JSON-LD scripts (brief §3B).
- [ ] `plan/[slug].astro`: pass `title={entry.data.title}`, `description`, `ogImage={entry.data.ogImage}`, `ogType="article"`, `publishedAt={entry.data.date}`, `updatedAt={entry.data.lastModified}`; add Article + BreadcrumbList JSON-LD.
- [ ] `[...slug].astro`: same Article+Breadcrumb pattern for pages/legal.
- [ ] `news/index.astro`: `ogType="website"` (+ optional CollectionPage JSON-LD).
- [ ] `search.astro`: `noindex={true}` + SearchAction WebPage JSON-LD.
- [ ] `pnpm build`; inspect a plan page's HTML for Article + BreadcrumbList JSON-LD + `og:type=article` + canonical; home for Org+WebSite. Commit `feat(astro): per-page SEO props + page-type JSON-LD`.

## Task 4: Sitemap filter + Netlify /sitemap.xml rewrite
- [ ] `astro.config.ts`: update sitemap `filter` to exclude `/sandbox`, `/404`, `/docs`, `/search/` (brief §4); optional `serialize` for priorities.
- [ ] `netlify.toml`: under `[context."feat/astro-migration"]`, add two `[[context."feat/astro-migration".redirects]]` blocks: `/sitemap.xml` and `/sitemap.xml/` → `/sitemap-0.xml` `status=200` (brief §4).
- [ ] `pnpm build`; confirm `dist/sitemap-index.xml` + `dist/sitemap-0.xml` emit and contain the real routes (and exclude sandbox/search). Commit `build(astro): sitemap filter + Netlify /sitemap.xml rewrite`.

## Task 5: Verification gate
- [ ] `pnpm build`; inspect built HTML for: per-page `<title>` (≤60), `<meta name="description">` (80–160), `<link rel="canonical">` (trailing slash), og:*/twitter:* on home + a plan page + search (noindex), and valid JSON-LD (parse each `application/ld+json` block with `JSON.parse`).
- [ ] Confirm `dist/robots.txt`, `dist/llms.txt`, `dist/sitemap-0.xml` exist + correct. Validate JSON-LD shapes (no undefined required fields).
- [ ] lightcap `run_audit` on `/`, a plan page, `/search/` → **SEO 100** (and confirm a11y still 100).
- [ ] Push; verify branch deploy; check `curl -sI <preview>/sitemap.xml` returns 200 (the rewrite) and `<preview>/robots.txt` + `/llms.txt` return 200.

## Phase 6 Done-Gate
- [ ] Every page: title (≤60) + description (80–160) + canonical (trailing-slash) + OG/Twitter; WebPage JSON-LD; home has Org+WebSite; content pages Article+Breadcrumb; search noindex+SearchAction.
- [ ] sitemap-0.xml correct (excludes sandbox/search); `/sitemap.xml` 200 via rewrite; robots.txt + llms.txt served.
- [ ] lightcap SEO 100 (a11y still 100); no Vue/Vuetify; build + deploy green.

When complete, write the Phase 7 (headers/perf) plan.
