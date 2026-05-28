# Astro Migration — Phase 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a building, deployable Astro 6 skeleton in `astro/` with the design system (Tailwind 4 `@theme` tokens matched to the current Vuetify palette), self-hosted fonts, tree-shaken MDI icons, a semantic `BaseLayout`, the dev-server script, a branch-scoped Netlify preview, and the two audits (dead-component + MDC token) that unblock later phases.

**Architecture:** New `astro/` subdirectory alongside the untouched Nuxt app at the repo root (Nuxt stays runnable for screenshot diffing). Astro static output, Tailwind 4 via the Vite plugin with semantic color tokens that flip under a `.dark` class, Alpine for later islands. No Vue/Vuetify. This is plan 1 of a per-phase sequence; phases 2–7 get their own plans informed by this phase's audits.

**Tech Stack:** Astro 6.3+, Tailwind 4 (`@tailwindcss/vite`), Alpine 3 (`@astrojs/alpinejs`), `astro-icon` + `@iconify-json/mdi`, `@fontsource/roboto` + `@fontsource/raleway`, Sharp, pnpm 10, Netlify.

**Spec:** `docs/superpowers/specs/2026-05-28-nuxt-to-astro-migration-design.md`
**Checklist:** `docs/astro-conversion-checklist-v6.5.md` (§1 shape, §2 config, §6 fonts, §18 pnpm, §19 dev script)

**Branch:** `feat/astro-migration` (already created; do NOT merge to `main`). Commit after every task.

---

## File map (created in this phase)

- `astro/package.json` — pnpm-pinned manifest, deps, scripts
- `astro/astro.config.ts` — static config, Tailwind vite plugin, Alpine, icon, sitemap
- `astro/tsconfig.json` — extends `astro/tsconfigs/strict`
- `astro/src/styles/global.css` — Tailwind entry + semantic `@theme` tokens + dark variant + ported skip-link/`sr-only`
- `astro/src/layouts/BaseLayout.astro` — head, no-flash theme script, skip-links, header/footer placeholders, `main#main-content`, announcer regions, font imports
- `astro/src/components/chrome/HeaderPlaceholder.astro`, `FooterPlaceholder.astro` — temporary chrome (replaced in Phase 2)
- `astro/src/pages/index.astro` — smoke page proving the layout + tokens + icon render
- `astro/src/env.d.ts` — Astro + astro-icon types
- `start-dev-server` (repo root) — §19 pnpm dev launcher
- `docs/superpowers/audits/2026-05-28-phase1-audits.md` — dead-component + MDC token audit findings
- `netlify.toml` (repo root, MODIFY) — add a `feat/astro-migration` branch-context that builds `astro/` (production/main context left untouched → Nuxt keeps deploying)

---

## Task 1: Scaffold the `astro/` package manifest

**Files:**
- Create: `astro/package.json`

- [ ] **Step 1: Write `astro/package.json`**

```json
{
  "name": "icjia-vpp-astro",
  "type": "module",
  "version": "0.0.0",
  "private": true,
  "packageManager": "pnpm@10.33.0",
  "engines": {
    "node": ">=22",
    "pnpm": ">=10"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^6.3.7",
    "@astrojs/sitemap": "^3.7.2",
    "@astrojs/alpinejs": "^0.4.8",
    "alpinejs": "^3.15.12",
    "astro-icon": "^1.1.5",
    "@iconify-json/mdi": "^1.2.3",
    "@fontsource/roboto": "^5.1.1",
    "@fontsource/raleway": "^5.1.1",
    "sharp": "^0.34.5"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.0",
    "tailwindcss": "^4.3.0",
    "@types/alpinejs": "^3.13.11"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["esbuild", "sharp"]
  }
}
```

- [ ] **Step 2: Install with pnpm (this also verifies the manifest resolves)**

Run: `cd astro && pnpm install`
Expected: completes without error; creates `astro/node_modules` and `astro/pnpm-lock.yaml`. If pnpm warns that a newer patch exists for `astro`, that is fine.

- [ ] **Step 3: Verify the pinned package manager + native-build allowlist**

Run: `cd astro && pnpm why sharp >/dev/null && node -e "const p=require('./package.json');if(p.packageManager!=='pnpm@10.33.0')throw new Error('packageManager not pinned');if(!p.pnpm.onlyBuiltDependencies.includes('sharp'))throw new Error('sharp not in onlyBuiltDependencies');console.log('OK: pnpm pinned + sharp allowlisted')"`
Expected: prints `OK: pnpm pinned + sharp allowlisted`

- [ ] **Step 4: Commit**

```bash
git add astro/package.json astro/pnpm-lock.yaml
git commit -m "build(astro): scaffold pnpm-pinned Astro package manifest"
```

---

## Task 2: Astro config + tsconfig + env types

**Files:**
- Create: `astro/astro.config.ts`
- Create: `astro/tsconfig.json`
- Create: `astro/src/env.d.ts`

- [ ] **Step 1: Write `astro/astro.config.ts`**

```ts
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import alpinejs from '@astrojs/alpinejs';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://vpp.icjia.illinois.gov',
  output: 'static',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    alpinejs(),
    icon(),
    sitemap({
      filter: (page) => !page.includes('/sandbox') && !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.5,
    }),
  ],
});
```

- [ ] **Step 2: Write `astro/tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 3: Write `astro/src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

- [ ] **Step 4: Run the Astro type sync to verify config loads**

Run: `cd astro && pnpm astro sync`
Expected: `Types generated` (or similar success); no config errors. Creates `astro/.astro/`.

- [ ] **Step 5: Commit**

```bash
git add astro/astro.config.ts astro/tsconfig.json astro/src/env.d.ts
git commit -m "build(astro): add static config, sitemap, alpine, icon integrations"
```

---

## Task 3: Tailwind 4 entry + semantic `@theme` tokens (the design system)

**Files:**
- Create: `astro/src/styles/global.css`

The color values below are the exact current Vuetify palette (`app/plugins/vuetify.js`). Semantic CSS variables flip under `.dark`; `@theme inline` exposes them as Tailwind color utilities (`bg-background`, `text-on-surface`, `bg-primary`, etc.). The spacing/radius scale mirrors `app/assets/css/main.scss` (`$spacing-unit: 8px`, radii 8/12/16).

- [ ] **Step 1: Write `astro/src/styles/global.css`**

```css
@import "tailwindcss";

/* Class-based dark mode: <html class="dark"> wins over OS preference. */
@custom-variant dark (&:where(.dark, .dark *));

/* ---- Semantic color tokens (light = :root default, dark = .dark) ---- */
/* Source of truth: app/plugins/vuetify.js light/dark theme colors. */
:root {
  --color-primary: #0747a6;
  --color-secondary: #057a8c;
  --color-accent: #5b21b6;
  --color-success: #047857;
  --color-warning: #b45309;
  --color-error: #b91c1c;
  --color-info: #1e40af;
  --color-background: #fafafa;
  --color-app-bar: #f2f2f2;
  --color-surface: #f8f8f8;
  --color-on-surface: #1e293b;
  --color-on-background: #1e293b;
  --color-on-app-bar: #1e293b;
}

:root.dark {
  --color-primary: #93c5fd;
  --color-secondary: #67e8f9;
  --color-accent: #c4b5fd;
  --color-success: #6ee7b7;
  --color-warning: #fcd34d;
  --color-error: #fca5a5;
  --color-info: #bfdbfe;
  --color-background: #0f172a;
  --color-app-bar: #1a2234;
  --color-surface: #1e293b;
  --color-on-surface: #f1f5f9;
  --color-on-background: #f1f5f9;
  --color-on-app-bar: #f1f5f9;
}

/* ---- Expose tokens to Tailwind utilities ---- */
@theme inline {
  --color-primary: var(--color-primary);
  --color-secondary: var(--color-secondary);
  --color-accent: var(--color-accent);
  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-error: var(--color-error);
  --color-info: var(--color-info);
  --color-background: var(--color-background);
  --color-app-bar: var(--color-app-bar);
  --color-surface: var(--color-surface);
  --color-on-surface: var(--color-on-surface);
  --color-on-background: var(--color-on-background);
  --color-on-app-bar: var(--color-on-app-bar);

  --font-sans: "Roboto", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Raleway", ui-sans-serif, system-ui, sans-serif;

  /* main.scss scale */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}

/* ---- Base ---- */
@layer base {
  body {
    background-color: var(--color-background);
    color: var(--color-on-background);
    font-family: var(--font-sans);
  }
}

/* ---- Ported from app/layouts/default.vue <style> (utilities can't express) ---- */
a.skip-link,
a.skip-link:link,
a.skip-link:visited {
  position: fixed;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  background: #000 !important;
  color: #fff !important;
  padding: 12px 20px;
  text-decoration: none;
  z-index: 99999;
  transition: top 0.3s ease;
  border-radius: 4px;
}
a.skip-link:focus {
  top: 0;
  outline: 3px solid #fff !important;
  outline-offset: 2px;
}
.skip-links-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99998;
  pointer-events: none;
}
.skip-links-nav .skip-link {
  pointer-events: auto;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add astro/src/styles/global.css
git commit -m "style(astro): add Tailwind 4 entry + semantic theme tokens (Vuetify palette)"
```

---

## Task 4: BaseLayout with no-flash theme script, fonts, skip-links, landmarks

**Files:**
- Create: `astro/src/components/chrome/HeaderPlaceholder.astro`
- Create: `astro/src/components/chrome/FooterPlaceholder.astro`
- Create: `astro/src/layouts/BaseLayout.astro`

The no-flash script preserves current behavior (`app/plugins/vuetify.js` + `useTheme`): default to **dark** on load, **session-only** persistence (sessionStorage, not localStorage). CSP hashing of this inline script is deferred to Phase 7.

- [ ] **Step 1: Write `astro/src/components/chrome/HeaderPlaceholder.astro`**

```astro
---
// TEMPORARY chrome — replaced by the real header in Phase 2.
---
<header role="banner" class="bg-app-bar text-on-app-bar border-b border-black/10">
  <nav id="site-navigation" aria-label="Main" class="container mx-auto flex h-16 items-center px-4">
    <a href="/" class="font-display text-lg font-bold">VPP (Phase 1 placeholder)</a>
  </nav>
</header>
```

- [ ] **Step 2: Write `astro/src/components/chrome/FooterPlaceholder.astro`**

```astro
---
// TEMPORARY chrome — replaced by the real footer in Phase 2.
---
<footer role="contentinfo" class="bg-app-bar text-on-app-bar border-t border-black/10">
  <div class="container mx-auto px-4 py-8 text-sm">
    Footer placeholder — Phase 2.
  </div>
</footer>
```

- [ ] **Step 3: Write `astro/src/layouts/BaseLayout.astro`**

```astro
---
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/700.css";
import "../styles/global.css";
import HeaderPlaceholder from "../components/chrome/HeaderPlaceholder.astro";
import FooterPlaceholder from "../components/chrome/FooterPlaceholder.astro";

interface Props {
  title: string;
  description?: string;
}
const {
  title,
  description = "The official web presence for the Statewide Violence Prevention Plan for Illinois: 2025-2029.",
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <!-- No-flash theme: default dark, session-only (matches current behavior). -->
    <script is:inline>
      (function () {
        try {
          var t = sessionStorage.getItem("theme") || "dark";
          if (t === "dark") document.documentElement.classList.add("dark");
          document.documentElement.setAttribute("data-theme", t);
        } catch (e) {
          document.documentElement.classList.add("dark");
          document.documentElement.setAttribute("data-theme", "dark");
        }
      })();
    </script>
  </head>
  <body>
    <nav aria-label="Skip links" class="skip-links-nav">
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#site-navigation" class="skip-link">Skip to navigation</a>
    </nav>

    <HeaderPlaceholder />

    <main role="main">
      <div id="main-content" tabindex="-1">
        <slot />
      </div>
    </main>

    <FooterPlaceholder />

    <div aria-live="polite" aria-atomic="true" class="sr-only" id="announcer-polite"></div>
    <div aria-live="assertive" aria-atomic="true" class="sr-only" id="announcer-assertive"></div>
  </body>
</html>
```

- [ ] **Step 4: Commit**

```bash
git add astro/src/layouts/BaseLayout.astro astro/src/components/chrome/
git commit -m "feat(astro): add BaseLayout with no-flash theme, fonts, skip-links, landmarks"
```

---

## Task 5: Smoke index page proving layout + tokens + icon render

**Files:**
- Create: `astro/src/pages/index.astro`

- [ ] **Step 1: Write `astro/src/pages/index.astro`**

```astro
---
import { Icon } from "astro-icon/components";
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="VPP — Astro Foundation Smoke Test">
  <section class="container mx-auto grid grid-cols-1 gap-6 px-4 py-12 md:grid-cols-3">
    <article class="rounded-md bg-surface p-6 text-on-surface shadow">
      <Icon name="mdi:magnify" class="h-8 w-8 text-primary" />
      <h2 class="font-display text-xl font-bold">Tailwind grid</h2>
      <p>This card uses <code>grid grid-cols-1 md:grid-cols-3</code>.</p>
    </article>
    <article class="rounded-md bg-surface p-6 text-on-surface shadow">
      <Icon name="mdi:theme-light-dark" class="h-8 w-8 text-secondary" />
      <h2 class="font-display text-xl font-bold">Theme tokens</h2>
      <p class="text-primary">Primary-colored text via <code>text-primary</code>.</p>
    </article>
    <article class="rounded-md bg-surface p-6 text-on-surface shadow">
      <Icon name="mdi:download" class="h-8 w-8 text-accent" />
      <h2 class="font-display text-xl font-bold">MDI icon</h2>
      <p>Inline SVG from <code>@iconify-json/mdi</code>.</p>
    </article>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Build the site**

Run: `cd astro && pnpm build`
Expected: build succeeds; `astro/dist/index.html` and `astro/dist/sitemap-index.xml` are emitted, no errors.

- [ ] **Step 3: Verify tokens, icon, and grid landed in the built HTML**

Run: `cd astro && node -e "const fs=require('fs');const h=fs.readFileSync('dist/index.html','utf8');const checks={'inline mdi svg':/<svg[^>]*>/.test(h),'grid utility':/md:grid-cols-3/.test(h)||/grid-cols/.test(h),'skip link':/Skip to main content/.test(h),'no-flash script':/sessionStorage/.test(h)};let ok=true;for(const k in checks){console.log((checks[k]?'PASS':'FAIL')+': '+k);if(!checks[k])ok=false;}if(!ok)process.exit(1);"`
Expected: four `PASS` lines (inline mdi svg, grid utility, skip link, no-flash script).

- [ ] **Step 4: Commit**

```bash
git add astro/src/pages/index.astro
git commit -m "feat(astro): add foundation smoke page (grid + tokens + mdi icon)"
```

---

## Task 6: Visual + a11y baseline of the smoke page (gate)

No code — this establishes the Phase 1 done-gate using the project's MCP tooling.

- [ ] **Step 1: Serve the built site**

Run (background): `cd astro && pnpm preview --port 4321`
Expected: serves at `http://localhost:4321/`.

- [ ] **Step 2: Screenshot light + dark, desktop + mobile (viewcap)**

Use the `viewcap` MCP server to capture `http://localhost:4321/` at 1280px and 390px widths. To capture dark, the page already defaults to dark; for light, append a one-off `?` and toggle by evaluating `sessionStorage.setItem('theme','light')` then reload (Phase 2 adds the real toggle). Save all four screenshots.
Expected: cards render in a 3-column grid on desktop, single column on mobile; dark uses `#0f172a` background, light uses `#fafafa`; the three MDI icons are visible and tinted primary/secondary/accent.

- [ ] **Step 3: Lighthouse a11y + full audit (lightcap)**

Use `lightcap` `run_a11y` and `run_audit` (mobile) against `http://localhost:4321/`.
Expected: Accessibility 100; Performance/Best-Practices/SEO at or near 100 (a smoke page should clear all four). Record the numbers in the audit doc (Task 8).

- [ ] **Step 4: Stop the preview server**

Stop the background `pnpm preview` process.

- [ ] **Step 5: Commit (screenshots, if saved into the repo)**

```bash
git add -A
git commit -m "test(astro): Phase 1 visual + a11y baseline of foundation smoke page" --allow-empty
```

---

## Task 7: `start-dev-server` script (§19) + Netlify branch preview

**Files:**
- Create: `start-dev-server` (repo root)
- Modify: `netlify.toml` (repo root) — add a branch-scoped context only

This keeps production (main → Nuxt) untouched. Only the `feat/astro-migration` branch deploy builds Astro, so the branch preview reflects migration progress.

- [ ] **Step 1: Write `start-dev-server` (repo root)**

```bash
#!/usr/bin/env bash
# Launch the Astro dev server from the repo root (ICJIA checklist §19).
set -euo pipefail

PORT=4321
ARGS=()
for a in "$@"; do
  case "$a" in
    --port) shift; PORT="${1:-4321}"; shift || true ;;
    --port=*) PORT="${a#*=}" ;;
    *) ARGS+=("$a") ;;
  esac
done

# Free the port if something is already listening (macOS + Linux via lsof).
if command -v lsof >/dev/null 2>&1; then
  PID="$(lsof -ti tcp:"$PORT" || true)"
  if [ -n "${PID:-}" ]; then
    kill "$PID" 2>/dev/null || true
    for _ in 1 2 3; do sleep 1; lsof -ti tcp:"$PORT" >/dev/null 2>&1 || break; done
    lsof -ti tcp:"$PORT" >/dev/null 2>&1 && kill -9 "$PID" 2>/dev/null || true
  fi
fi

cd "$(dirname "$0")/astro"
rm -rf .astro 2>/dev/null || true
[ -d node_modules ] || pnpm install
exec pnpm exec astro dev --port "$PORT" "${ARGS[@]}"
```

- [ ] **Step 2: Make it executable**

Run: `chmod +x start-dev-server`
Expected: no output; `ls -l start-dev-server` shows the `x` bit.

- [ ] **Step 3: Verify it boots the dev server**

Run (background): `./start-dev-server --port 4321`
Then: `curl -sf http://localhost:4321/ | grep -q "Astro Foundation Smoke Test" && echo "DEV OK"`
Expected: prints `DEV OK`. Stop the background server afterward.

- [ ] **Step 4: Add the branch-scoped Netlify context (append to root `netlify.toml`)**

Append this block to the END of the existing `netlify.toml` (do NOT edit the existing `[build]`/production blocks — production keeps building Nuxt until cutover):

```toml
# --- Astro migration branch preview (feat/astro-migration only) ---
# Production (main) is unaffected and keeps building the Nuxt app.
[context."feat/astro-migration"]
  base = "astro/"
  command = "pnpm install && pnpm build"
  publish = "astro/dist"

[context."feat/astro-migration".environment]
  NODE_VERSION = "22"
  PNPM_VERSION = "10.33.0"
```

- [ ] **Step 5: Commit**

```bash
git add start-dev-server netlify.toml
git commit -m "build(astro): add §19 dev-server script + branch-scoped Netlify preview"
```

- [ ] **Step 6: Push and verify the branch deploy**

```bash
git push
```
Then use the globally-installed `netlify` CLI to confirm the branch built (e.g. `netlify status`, or `netlify open --site` to view deploys). Confirm the deploy-preview URL serves the smoke page and the existing production site is unchanged.
Expected: branch deploy succeeds; preview URL renders the 3-card grid.

---

## Task 8: Dead-component audit + MDC token audit (unblocks Phases 2–5)

**Files:**
- Create: `docs/superpowers/audits/2026-05-28-phase1-audits.md`

These two audits produce the inputs later-phase plans need: which components are actually reachable (so dead ones aren't ported), and the exact MDC token → component inventory (so home uses Strategy 1 and the right content files become `.mdx`).

- [ ] **Step 1: Inventory MDC tokens used in content**

Run:
```bash
cd /Volumes/satechi/webdev/icjia-vpp-2025
grep -rnE '^::?[A-Za-z]' content/ | sort
grep -rlnE '^::?[A-Za-z]' content/ | sort -u
```
Record, per content file, which MDC component tokens appear and whether each occupies the whole body (→ Strategy 1 / compose in `.astro`) or is interleaved with prose (→ convert that file to `.mdx`).

- [ ] **Step 2: Inventory potentially-dead components**

Run (for each component, see if it is referenced anywhere outside its own file):
```bash
cd /Volumes/satechi/webdev/icjia-vpp-2025
for f in app/components/content/About*.vue app/components/content/Feature*.vue app/components/content/CenteredImage.vue app/components/content/HomeHighlights.vue; do
  name=$(basename "$f" .vue)
  hits=$(grep -rIl --exclude-dir=node_modules -e "$name" app/ content/ | grep -v "$f" | wc -l | tr -d ' ')
  echo "$name: $hits external references"
done
```
A component with `0 external references` (and no MDC token, kebab-cased, in `content/`) is a drop candidate. Confirm by also grepping `content/` for its kebab-case MDC token.

- [ ] **Step 3: Confirm the home source of truth**

Run: `git grep -n "Home" -- app/pages/index.vue | head` and compare against the `::home-*` tokens in `content/index.md`.
Record the decision: `pages/index.vue` (component-driven) is authoritative; `content/index.md` body is discarded for home (Strategy 1).

- [ ] **Step 4: Write the findings to `docs/superpowers/audits/2026-05-28-phase1-audits.md`**

Capture three sections — **MDC token inventory** (table: file → token → whole-body? → strategy), **Dead-component list** (confirmed-drop vs keep), and **Phase 1 baseline numbers** (the lightcap scores from Task 6). No placeholders — fill with the real grep results.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/audits/2026-05-28-phase1-audits.md
git commit -m "docs(astro): record Phase 1 dead-component + MDC token audits"
```

---

## Phase 1 Done-Gate

- [ ] `cd astro && pnpm build` succeeds; `astro/dist/` emitted with `index.html` + sitemap.
- [ ] Task 5 Step 3 verification prints four `PASS` lines.
- [ ] Smoke page screenshots (light/dark × desktop/mobile) reviewed; grid + tokens + icons correct.
- [ ] lightcap: Accessibility 100 on the smoke page (perf/BP/SEO recorded).
- [ ] `start-dev-server` boots Astro on 4321.
- [ ] Netlify branch deploy renders the preview; production (Nuxt) unchanged.
- [ ] `docs/superpowers/audits/2026-05-28-phase1-audits.md` written with real audit results.

When all boxes are checked, Phase 1 is complete and we write the Phase 2 (Chrome) plan using the audit findings.
```
