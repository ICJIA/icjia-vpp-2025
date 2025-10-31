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

  // Generate HTML summary report
  const htmlSummary = generateHtmlSummary(aggregate, routes, VIEWPORTS, THEMES);
  fs.writeFileSync(path.join(outRoot, "summary.html"), htmlSummary);

  console.log(`\nAxe audit complete. Reports in: ${outRoot}`);
}

/**
 * Generate HTML summary report from axe results
 */
function generateHtmlSummary(aggregate, routes, viewports, themes) {
  const totalViolations = aggregate.totals.violations;
  const totalIncomplete = aggregate.totals.incomplete;
  const totalPasses = aggregate.totals.passes;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Axe Accessibility Audit Summary</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-top: 0; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
    .summary-card { padding: 20px; border-radius: 8px; text-align: center; }
    .summary-card.violations { background: #fef2f2; border: 2px solid #ff4e42; }
    .summary-card.incomplete { background: #fffbf0; border: 2px solid #ffa400; }
    .summary-card.passes { background: #f0fdf4; border: 2px solid #0cce6b; }
    .summary-card h3 { margin: 0 0 10px 0; color: #666; font-size: 14px; }
    .summary-card .number { font-size: 36px; font-weight: bold; }
    .summary-card.violations .number { color: #ff4e42; }
    .summary-card.incomplete .number { color: #ffa400; }
    .summary-card.passes .number { color: #0cce6b; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f9f9f9; font-weight: bold; }
    tr:hover { background: #f5f5f5; }
    .meta { color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Axe Accessibility Audit Summary</h1>
    <p><strong>Base URL:</strong> ${BASE_URL}</p>
    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>

    <div class="summary-grid">
      <div class="summary-card violations">
        <h3>Violations</h3>
        <div class="number">${totalViolations}</div>
      </div>
      <div class="summary-card incomplete">
        <h3>Incomplete</h3>
        <div class="number">${totalIncomplete}</div>
      </div>
      <div class="summary-card passes">
        <h3>Passes</h3>
        <div class="number">${totalPasses}</div>
      </div>
    </div>

    <h2>Results by Route</h2>
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Viewport</th>
          <th>Theme</th>
          <th>Violations</th>
          <th>Incomplete</th>
          <th>Passes</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(aggregate.byRoute)
          .map(([route, items]) =>
            items
              .map(
                (item) => `
          <tr>
            <td>${route}</td>
            <td>${item.viewport}</td>
            <td>${item.theme}</td>
            <td style="color: ${item.counts.violations > 0 ? "#ff4e42" : "#0cce6b"}">${item.counts.violations}</td>
            <td style="color: ${item.counts.incomplete > 0 ? "#ffa400" : "#0cce6b"}">${item.counts.incomplete}</td>
            <td style="color: #0cce6b">${item.counts.passes}</td>
          </tr>
        `
              )
              .join("")
          )
          .join("")}
      </tbody>
    </table>

    <div class="meta">
      <p><strong>Configuration:</strong></p>
      <p>Viewports: ${viewports.map((v) => v.name).join(", ")}</p>
      <p>Themes: ${themes.join(", ")}</p>
      <p>Generated: ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>`;

  return html;
}

run().catch((err) => {
  console.error("Axe audit failed:", err);
  process.exitCode = 1;
});
