/*
 * Axe Accessibility Audit Script (ESM)
 */

/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import { AxePuppeteer } from "@axe-core/puppeteer";
import puppeteer from "puppeteer";

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

const DEFAULT_ROUTES = [
  "/",
  "/plan/front-cover",
  "/plan/executive-summary",
  "/plan/public-health-approach",
  "/plan/goals-and-recommendations",
  "/plan/planning-process",
  "/plan/guiding-principles",
  "/plan/references",
  "/resources",
  "/organizational-and-agency-highlights",
  "/download",
  "/contact",
  "/accessibility/audit-log",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
];

const ROUTES = (process.env.ROUTES || "")
  .split(",")
  .map((r) => r.trim())
  .filter(Boolean);

const VIEWPORT_PRESETS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1366, height: 900 },
};

const VIEWPORTS = (process.env.VIEWPORTS || "mobile,tablet,desktop")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean)
  .map((name) => ({ name, size: VIEWPORT_PRESETS[name] }))
  .filter((v) => v.size);

const THEMES = (process.env.THEMES || "dark,light")
  .split(",")
  .map((t) => t.trim())
  .filter((t) => t === "dark" || t === "light");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function timestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    now.getFullYear() +
    "-" +
    pad(now.getMonth() + 1) +
    "-" +
    pad(now.getDate()) +
    "T" +
    pad(now.getHours()) +
    "-" +
    pad(now.getMinutes()) +
    "-" +
    pad(now.getSeconds())
  );
}

async function run() {
  const routes = ROUTES.length ? ROUTES : DEFAULT_ROUTES;
  const outRoot = path.join(process.cwd(), "reports", "axe", timestamp());
  ensureDir(outRoot);

  console.log(`Axe audit starting...`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Routes: ${routes.join(", ")}`);
  console.log(`Viewports: ${VIEWPORTS.map((v) => v.name).join(", ")}`);
  console.log(`Themes: ${THEMES.join(", ")}`);
  console.log(`Output: ${outRoot}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const summary = [];

  try {
    for (const route of routes) {
      for (const { name: viewportName, size } of VIEWPORTS) {
        const page = await browser.newPage();
        await page.setViewport(size);

        for (const theme of THEMES) {
          const url = new URL(route, BASE_URL).toString();

          // Ensure theme is set BEFORE any app scripts run to avoid hydration mismatch
          // and allow our useTheme() initializeTheme() to pick it up onMounted.
          await page.evaluateOnNewDocument((t) => {
            try {
              sessionStorage.setItem("vpp-theme", t);
            } catch (e) {}
            try {
              document.documentElement.setAttribute("data-theme", t);
            } catch (e) {}
          }, theme);

          console.log(`\nNavigating: ${url} [${viewportName}, theme=${theme}]`);
          await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

          // After navigation, force-sync Vuetify's theme if available
          await page.evaluate((t) => {
            try {
              // Nuxt app instance with Vuetify plugin
              const app = window.__NUXT__ && window.__NUXT__.app;
              const vuetify = app && app.$vuetify;
              if (vuetify && vuetify.theme && vuetify.theme.global) {
                vuetify.theme.global.name.value = t;
              }
            } catch (e) {}
          }, theme);

          // Small delay post-update to allow CSS/theme to settle
          await new Promise((r) => setTimeout(r, 700));

          const axe = new AxePuppeteer(page).withTags(["wcag2a", "wcag2aa"]);
          const results = await axe.analyze();

          const fileSafe =
            route === "/"
              ? "home"
              : route.replace(/^\//, "").replace(/\//g, "_");
          const outFile = path.join(
            outRoot,
            `axe-${fileSafe}-${viewportName}-theme-${theme}.json`
          );
          fs.writeFileSync(outFile, JSON.stringify(results, null, 2));

          const counts = {
            violations: results.violations.length,
            incomplete: results.incomplete.length,
            passes: results.passes.length,
            inapplicable: results.inapplicable.length,
          };

          summary.push({ route, viewport: viewportName, theme, counts });
          console.log(
            `Axe results: violations=${counts.violations}, incomplete=${counts.incomplete}, passes=${counts.passes}`
          );
        }

        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  const aggregate = {
    totals: { violations: 0, incomplete: 0, passes: 0 },
    byRoute: {},
  };
  for (const item of summary) {
    aggregate.totals.violations += item.counts.violations;
    aggregate.totals.incomplete += item.counts.incomplete;
    aggregate.totals.passes += item.counts.passes;

    const key = `${item.route}`;
    if (!aggregate.byRoute[key]) aggregate.byRoute[key] = [];
    aggregate.byRoute[key].push(item);
  }

  const summaryPath = path.join(outRoot, "summary.json");
  fs.writeFileSync(
    summaryPath,
    JSON.stringify({ summary, aggregate }, null, 2)
  );

  const lines = [];
  lines.push(`# Axe Audit Summary`);
  lines.push(`Base URL: ${BASE_URL}`);
  lines.push(`Routes: ${routes.join(", ")}`);
  lines.push(`Viewports: ${VIEWPORTS.map((v) => v.name).join(", ")}`);
  lines.push(`Themes: ${THEMES.join(", ")}`);
  lines.push("");
  for (const [route, items] of Object.entries(aggregate.byRoute)) {
    lines.push(`Route: ${route}`);
    for (const it of items) {
      lines.push(
        `  - ${it.viewport} | theme=${it.theme} -> violations=${it.counts.violations}, incomplete=${it.counts.incomplete}, passes=${it.counts.passes}`
      );
    }
  }
  fs.writeFileSync(path.join(outRoot, "summary.txt"), lines.join("\n"));

  console.log(`\nAxe audit complete. Reports in: ${outRoot}`);
}

run().catch((err) => {
  console.error("Axe audit failed:", err);
  process.exitCode = 1;
});
