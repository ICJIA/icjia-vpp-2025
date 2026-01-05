---
title: "How to run the axe-core accessibility audit"
date: 2025-09-15
description: "Step-by-step guide to run the automated axe-core audit across routes, viewports, and themes for the VPP site."
---

# How to run the axe-core accessibility audit

Last Updated: September 16, 2025

This guide explains how to run the automated axe-core audit locally on the generated static site. It covers prerequisites, commands, and where to find the results.

## What this audit covers

- 15 major routes (homepage, plan pages, resources, download, contact, legal, audit log)
- 3 viewports: mobile, tablet, desktop
- 2 themes: dark and light (the script sets theme per run to avoid hydration issues)

## Prerequisites

- Node and yarn installed
- Project dependencies installed (run `yarn` once)

The scripts and configuration are already in this repo:

- Audit runner: `scripts/axe-audit.js`
- Package script: `"audit:axe": "node scripts/axe-audit.js"`

## Steps

1. Build a static site

- This ensures a clean, SSR-stable target for auditing

```bash
yarn generate
```

2. Serve the generated output

- Use any static server. We commonly use `serve` and prefer port 3000. If 3000 is occupied, `serve` will choose another port and print it in the console.

```bash
npx serve -l 3000 .output/public
```

3. Run the audit against the served URL

- Open a new terminal tab/window. Set BASE_URL to the address printed by the server (e.g., http://localhost:3000 or the auto-picked port) and run the audit script.

```bash
BASE_URL=http://localhost:3000 yarn audit:axe
```

Notes:

- If `serve` picked a different port, substitute it in BASE_URL (e.g., http://localhost:59474)
- The script programmatically sets the theme before any app scripts execute to avoid hydration mismatch and to reliably test both dark and light themes

## Results

- Outputs are written to `reports/axe/<timestamp>`
- Files include per-route JSON results and a `summary.txt`

Common paths:

- Latest run: `reports/axe/2025-09-15T08-54-49/summary.txt`
- Previous run: `reports/axe/2025-09-15T08-36-35/summary.txt`
- Individual result samples: `axe-<route>-<viewport>-theme-<dark|light>.json`

### Latest results (2025-09-16)

- Summary file: `reports/axe/2025-09-16T10-07-11/summary.txt`
- Headline: 0 violations across all routes/viewports/themes
- Notes: Includes the reference tooltip contrast updates and dark-mode background reinforcement for /plan/\* pages

### Latest results (2025-09-15)

- Summary file: `reports/axe/2025-09-15T08-54-49/summary.txt`
- Headline: 0 violations across all routes/viewports/themes
- Typical axe “incomplete” items remain for manual review

Differences from previous run (2025-09-15T08-36-35):

- No changes in violations (remained 0)
- No material changes in incomplete or passes counts per route/viewport/theme in the summary
- Base URL changed due to auto-picked port (expected)

Interpreting results:

- “violations”: actionable issues found by axe
- “incomplete”: potential issues needing manual verification (often benign)
- “passes”: rules that passed

### How to interpret “incomplete” findings

Axe marks some checks as “incomplete” when automation can’t be fully certain. Common examples that often require a quick human check:

- aria-valid-attr-value: Verify custom ARIA attributes or dynamic values (e.g., aria-level, aria-errormessage) are appropriate for the element and valid per spec
- aria-allowed-attr / aria-prohibited-attr: Ensure ARIA attributes used are allowed for the element’s role; remove unsupported ones
- aria-label / has-visible-text: Confirm interactive elements have discernible names (visible text or accessible name via aria-label/aria-labelledby)
- color-contrast (incomplete cases): Some dynamic states or gradients may need manual sampling; verify 4.5:1 (AA) or higher per project standards
- duplicate-id-aria: If flagged as incomplete, confirm IDs are unique in the rendered DOM

Tip: If an “incomplete” item consistently shows with no user-impacting issue identified, document the rationale in the Accessibility Audit Log and re-check periodically.

## Axe run history

A chronological record of recent automated axe runs. Paths are repository-relative and will exist after running the audit locally.

- 2025-09-15T11-45-53
  - Summary: `reports/axe/2025-09-15T11-45-53/summary.txt`
  - Base URL: http://localhost:56055
  - Result: 0 violations across all routes/viewports/themes; typical “incomplete” items remained

- 2025-09-15T08-54-49
  - Summary: `reports/axe/2025-09-15T08-54-49/summary.txt`
  - Base URL: http://localhost:61044
  - Result: 0 violations across all routes/viewports/themes; typical “incomplete” items remained

- 2025-09-15T08-36-35
  - Summary: `reports/axe/2025-09-15T08-36-35/summary.txt`
  - Base URL: http://localhost:59474
  - Result: 0 violations across all routes/viewports/themes

- 2025-09-15T08-06-23
  - Summary: `reports/axe/2025-09-15T08-06-23/summary.txt`
  - Base URL: http://localhost:55059
  - Result: 0 violations across all routes/viewports/themes

- 2025-09-14T13-54-26
  - Summary: `reports/axe/2025-09-14T13-54-26/summary.txt`
  - Base URL: http://localhost:51370
  - Result: 0 violations across all routes/viewports/themes

- “passes”: rules that passed

## Troubleshooting

- Port in use: either stop the conflicting process or let `serve` auto-pick a port and update BASE_URL accordingly
- Empty pages or 404s: ensure `yarn generate` completed successfully and the route exists in the static output
- Slow runs: the audit iterates routes × viewports × themes; allow a few minutes to complete

## Useful links

- Accessibility Audit Log: /accessibility/audit-log
- Developer Documentation Portal: /docs/
- Accessibility Report: /docs/accessibility/
- Axe Audit Runner Script (GitHub): https://github.com/ICJIA/icjia-vpp-2025/blob/main/scripts/axe-audit.js

Note: This repository is private. For source code inquiries, please use the Contact page: /contact
