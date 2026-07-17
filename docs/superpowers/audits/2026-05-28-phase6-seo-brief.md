# Phase 6 SEO/Discovery Port Brief

> Research for the SEO layer. Match the current site's meta + structured data; follow checklist §8 (astro-seo, title ≤60, 80≤desc≤160, JSON-LD, llms.txt) + §10/§10a (sitemap two-rewrite, robots no-underscore).

## Decision: titles
Checklist §8 hard rule = title ≤60 chars WITH suffix. Current Nuxt titles are long dash-form (>60). Apply the checklist rule (titles are non-visual SEO; it's the team's playbook standard). Use `truncateTitle(pageTitle, "Illinois VPP", 60)` → `"<Page> | Illinois VPP"` (home can be the full name, ≤60). FLAG to user (revertable).

## 1. Global default meta (verbatim from nuxt.config.ts app.head → replicate in BaseLayout)
- title default: `Violence Prevention Plan for Illinois: 2025-2029`
- description (151 chars, in-band): "The official web presence for the Statewide Violence Prevention Plan for Illinois: 2025-2029, featuring comprehensive violence prevention strategies and community resources."
- keywords: "violence prevention, Illinois, public health, community safety, trauma-informed care, evidence-based practices"
- author: "Illinois Criminal Justice Information Authority"; robots: "index, follow"
- og: title (=title), description (=desc), image `https://vpp.icjia.illinois.gov/images/og-image-vpp-2025.png` (1200×630, alt="Violence Prevention Plan for Illinois: 2025-2029"), site_name "Statewide Violence Prevention Plan for Illinois: 2025-2029", type "website", locale "en_US"
- twitter: card "summary_large_image", title, description, image (same), image:alt, site "@ICJIA_Illinois", creator "@ICJIA_Illinois"
- theme-color "#1976d2", msapplication-TileColor "#1976d2", mobile-web-app-capable "yes", apple-mobile-web-app-status-bar-style "default", generator "Astro", application-name (=title), format-detection "telephone=no, email=no, address=no"
- links: icon `/favicon.png`; apple-touch-icon `/images/illinois-seal.png`; alternate hreflang en + x-default → `https://vpp.icjia.illinois.gov/`
- OMIT the MDI/jsdelivr preloads (Vuetify-era).

## 2. astro-seo (`pnpm add astro-seo`) in BaseLayout
Expand BaseLayout `Props`: `{ title, description?, canonical?, ogTitle?, ogDescription?, ogImage?, ogType?='website', twitterCard?, noindex?=false, publishedAt?, updatedAt?, keywords? }`. Use `<SEO>` (replace bare title/desc). canonical = `new URL(Astro.url.pathname.replace(/\/index\.html$/,'/').replace(/\.html$/,''), SITE_ORIGIN)`. og.image width 1200 height 630 alt; article block when publishedAt/updatedAt; twitter site/creator @ICJIA_Illinois; `extend.meta` for author/keywords/theme-color/application-name/format-detection/generator/article:* ; `extend.link` for icons + hreflang. Keep the no-flash theme `<script>`.
Create `astro/src/lib/seo.ts`: `truncateTitle(page, suffix, 60)` (word-boundary + ` | suffix`), `truncateDescription(d)` (80≤n≤160; build-time assert on default).

## 3. JSON-LD (`<script type="application/ld+json" set:html={JSON.stringify(x)}>`)
- **BaseLayout (every page): WebPage** — name(title), description, url(canonical), image(socialImg), inLanguage "en-US", datePublished(publishedAt??buildTime), dateModified(updatedAt??buildTime), isPartOf WebSite{name,url}, publisher GovernmentOrganization{name ICJIA, url icjia.illinois.gov, logo illinois-seal.png 1200×1198}.
- **index.astro (home): GovernmentOrganization** (ICJIA: alternateName ICJIA, url, logo, description, address "60 E Van Buren St, Suite 650, Chicago, IL 60605 US", contactPoint email cja.irc@illinois.gov, sameAs [twitter/facebook/linkedin]) + **WebSite** (name, alternateName "Illinois Violence Prevention Plan", url, datePublished "2025-07-24", dateModified "2026-04-08", potentialAction SearchAction target `/search?q={search_term_string}`).
- **plan/[slug].astro + [...slug].astro: Article** (headline title, description, author/publisher ICJIA, datePublished(date??'2025-07-24'), dateModified(lastModified??date), url, image og, mainEntityOfPage, keywords, articleSection "Violence Prevention", inLanguage) + **BreadcrumbList** (title-cased slug segments).
- **search.astro: WebPage + SearchAction**; noindex.
- **news/index.astro: CollectionPage** (optional); website.
(Shapes verbatim in source `StructuredData.vue` + `index.vue` 221-271. Org address/sameAs from StructuredData.vue.)

## 4. Sitemap (@astrojs/sitemap already configured)
Update `astro.config.ts` sitemap `filter`: exclude `/sandbox`, `/404`, `/docs`, `/search/` (Nuxt excludes /news too — but news is empty; either is fine, keep simple: exclude sandbox/404/docs/search). Optional `serialize` for priorities (home 1.0, key pages 0.8, rest 0.6) — optional, uniform is acceptable.
**Two-rewrite (checklist §10a):** @astrojs/sitemap emits `sitemap-index.xml`+`sitemap-0.xml`, NOT `sitemap.xml`. Add to `netlify.toml` (under the `[context."feat/astro-migration"]`): two `[[context."feat/astro-migration".redirects]]` blocks `from "/sitemap.xml"` and `from "/sitemap.xml/"` → `to "/sitemap-0.xml"` `status 200`.

## 5. robots.txt → `astro/public/robots.txt` (NO underscore!) — copy verbatim from root `public/robots.txt`:
```
User-agent: *
Allow: /

Disallow: /*sandbox*
Disallow: /documentation/
Disallow: /documentation/*
Disallow: /debug-search.html

Sitemap: https://vpp.icjia.illinois.gov/sitemap.xml
```

## 6. llms.txt → `astro/public/llms.txt` — hand-author (copy from root `public/llms.txt` verbatim; stable content). Sections: `# <site>` + blockquote summary + 2 context paragraphs + `## Plan Content` (7 plan links w/ descriptions) + `## Optional` (PDF, ICJIA site, repo).

## 7. Assets to copy to `astro/public/images/` (verify/copy from root public/images/)
`og-image-vpp-2025.png` (1200×630), `illinois-seal.png` (1200×1198; JSON-LD logo + apple-touch-icon). (webp seal already present; the .png is also needed.) Also confirm `astro/public/favicon.png` (already there from Phase 2).

## Task breakdown
P6.1 foundation: astro-seo + seo.ts helpers + copy assets (og png, seal png) + robots.txt + llms.txt.
P6.2 BaseLayout: <SEO> + Props + WebPage JSON-LD.
P6.3 per-page: index (Org+WebSite), plan/[slug] + [...slug] (Article+Breadcrumb, ogType article, dates), news (website), search (noindex+SearchAction).
P6.4 sitemap filter + netlify /sitemap.xml rewrites.
P6.5 gate: verify meta/OG/canonical/JSON-LD per page (curl built HTML), sitemap/robots/llms reachable, lightcap SEO 100, deploy.

@astrojs/sitemap REPLACES generate-sitemap.js (don't port). llms.txt hand-authored (don't port generator).

## Source refs
nuxt.config.ts 148-289; StructuredData.vue; index.vue 158-271; [...slug].vue 1243-1395; news.vue 28-119; search.vue 246-297; config/sitemap.config.json; public/{robots.txt,llms.txt}; checklist §8/§10/§10a.
