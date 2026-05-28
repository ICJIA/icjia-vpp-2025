# Astro Migration — Phase 8 (Teardown to Astro-only) Implementation Plan

> **⛔ REQUIRES EXPLICIT USER THUMBS-UP BEFORE EXECUTING.** This phase deletes the Nuxt app and prepares the merge to `main`. Do NOT run any step until the user approves. The branch must stay Astro/Tailwind/Alpine-only after this.

**Goal:** Make the merged branch Astro-only — delete the legacy Nuxt/Vue/Vuetify app + stray non-`/docs` files, promote `astro/` to the deploy root, rewrite `README.md`, and merge to `main`.

**Pre-req:** Phases 1–7 complete + deployed green; user has reviewed the preview and given a thumbs-up to merge.

**Branch:** `feat/astro-migration`. Commit per task; no Co-Authored-By trailer.

---

## Task 0: Confirm scope with the user (BLOCKING)
- [ ] Confirm: merge to `main` now? Keep `CHANGELOG.md` at root (user's standing pref = KEEP + update)? Promote `astro/` to repo root, or keep it as the `base` subdir? Exact non-`/docs` files to delete.
- [ ] Tag the last legacy commit: `git tag v1-final <pre-teardown SHA>` (rollback point).

## Task 1: Inventory what to delete vs keep
- [ ] **KEEP:** `astro/` (the app), `/docs/**` (checklist + specs/plans/audits), `README.md` (rewritten), `LICENSE`, `.git`, `.gitignore`, `CHANGELOG.md` (per user), `netlify.toml` (rewritten for Astro).
- [ ] **DELETE (Nuxt/Vue/Vuetify footprint):** `app/`, `nuxt.config.ts`, `content.config.ts`, `server/`, root `content/` (Astro has its own copy in `astro/src/content`), `public/` (Astro has `astro/public`), `scripts/` (ported to `astro/scripts`), `config/` (ported into Astro), `package.json`+`yarn.lock`+`.nuxt/`+`.output/`+`dist` symlink, `app.vue`/`error.vue` if any at root, `tsconfig*.json` (root Nuxt), `vitest.config.*`, `playwright.config.js`, `audit-accessibility.js` + `audit-*.js`, `verify-touch-targets.js`, `test/`, `markdown-documentation/`, stray root logs (`*-output.log`, `accessibility-audit-output.log`, `docs-aaa-*.json`), `audit-log-*.md` (decide w/ user — may keep), `letter.txt`, `temp_assets/`, `tmp/`, `reports/`, `.lighthouseci/`, `typedoc*.json`, `tsconfig.typedoc.json`.
- [ ] Grep-confirm nothing in `astro/` imports from the to-be-deleted root paths (it shouldn't — Astro is self-contained).

## Task 2: Promote astro/ + rewrite netlify.toml
- [ ] DECISION (Task 0): either (a) `git mv astro/* astro/.* .` to promote to root + update paths, OR (b) keep `astro/` as subdir and set `netlify.toml` root `[build] base="astro/"`, `publish="astro/dist"`, `command="pnpm install && pnpm build"`. (b) is lower-risk — fewer path changes. Recommend (b) unless user wants a clean root.
- [ ] Rewrite root `netlify.toml`: REMOVE the legacy `[[headers]]` + Nuxt `[build]` + the `[context."feat/astro-migration"]` override; set the Astro build as the default `[build]`. The Astro `_headers` + `_redirects` (in `astro/public/`) now own headers/redirects. Keep `NODE_VERSION=22` + `PNPM_VERSION`.
- [ ] Verify a production-context build works: `cd astro && pnpm build` green; `dist/_headers` + `dist/_redirects` present.

## Task 3: Rewrite README.md
- [ ] Rewrite `README.md` for the Astro/Tailwind/Alpine stack: overview, OG image at top + tech-stack badge row (checklist §8 README convention), `pnpm` dev/build commands, project structure (`astro/src/...`), content-editing (`astro/src/content`), the build scripts (references/search-index/sitemap), deploy (Netlify), accessibility/SEO notes. Remove all Nuxt/yarn/Vuetify references.
- [ ] Update `CHANGELOG.md` (per user pref): a dated entry for the Astro migration (reverse-chronological, grouped under one date heading).

## Task 4: Final verification (Astro-only)
- [ ] `grep -rIl -e vuetify -e "from \"vue\"" -e "@nuxt" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=docs .` → clean (only docs may mention them historically).
- [ ] `pnpm build` from the promoted base → green; all routes emit.
- [ ] lightcap A11y/SEO/BP 100 + Perf ≥99 on key routes (re-confirm post-teardown).
- [ ] Push; verify the branch deploy STILL green after netlify.toml rewrite; **now confirm the tighter Astro `_headers` CSP is active** (`curl -sI <preview>/ | grep -i content-security-policy` shows no jsdelivr/googleapis + `object-src 'none'`; `/_astro/*` immutable cache) — this is the payoff of removing the legacy `[[headers]]`.

## Task 5: Cutover + merge (ON USER GO)
- [ ] §17 cutover smoke test on the deploy: skip-link Tab, search, menu/drawer, references popups, image modal, theme toggle, Plausible registers a real request.
- [ ] Merge `feat/astro-migration` → `main` (PR or fast-forward, per user). Keep the branch + `v1-final` tag ~1 week for rollback.
- [ ] Confirm production (`vpp.icjia.illinois.gov`) serves the Astro build with the tighter CSP + sitemap/robots/llms.

## Phase 8 Done-Gate
- [ ] Repo is Astro/Tailwind/Alpine-only (no Vue/Vuetify/Nuxt/yarn); `README.md` rewritten; `LICENSE` + `/docs` intact.
- [ ] Production builds from the Astro app; tighter `_headers` CSP active; all audits pass.
- [ ] Merged to `main` on the user's explicit approval; `v1-final` tag exists for rollback.
