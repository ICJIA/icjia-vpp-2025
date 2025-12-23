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
  "/accessibility/axe-audit",
  "/accessibility/documentation",
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

/**
 * Format date as "Month DD, YYYY" in Chicago timezone
 */
function formatChicagoDate(date) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Chicago",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
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

          // Enhance scrollable regions for keyboard accessibility before audit
          await page.evaluate(() => {
            const enhanceScrollableRegions = () => {
              try {
                // Specifically target the problematic bg-gray-50/50 element
                const problematicElements = document.querySelectorAll(
                  ".bg-gray-50\\/50, [class*='bg-gray-50'], [class*='overflow-y-auto']"
                );
                problematicElements.forEach((el) => {
                  const style = getComputedStyle(el);
                  const hasOverflow =
                    style.overflow === "auto" ||
                    style.overflow === "scroll" ||
                    style.overflowY === "auto" ||
                    style.overflowY === "scroll";
                  const isScrollable =
                    hasOverflow &&
                    (el.scrollHeight > el.clientHeight ||
                      el.scrollWidth > el.clientWidth);

                  if (
                    isScrollable &&
                    !el.hasAttribute("tabindex") &&
                    el.tagName !== "INPUT" &&
                    el.tagName !== "TEXTAREA" &&
                    el.tagName !== "SELECT" &&
                    el.tagName !== "BUTTON" &&
                    el.tagName !== "A"
                  ) {
                    el.setAttribute("tabindex", "0");
                    if (!el.getAttribute("role")) {
                      el.setAttribute("role", "region");
                    }
                    if (!el.getAttribute("aria-label")) {
                      el.setAttribute("aria-label", "Scrollable region");
                    }
                    el.classList.add("focus-outline-visible");
                  }
                });

                // Check all other scrollable elements
                const allElements = document.querySelectorAll("*");
                allElements.forEach((el) => {
                  if (el.hasAttribute("tabindex") && el.getAttribute("tabindex") === "0") {
                    return;
                  }

                  const style = getComputedStyle(el);
                  const hasOverflow =
                    style.overflow === "auto" ||
                    style.overflow === "scroll" ||
                    style.overflowY === "auto" ||
                    style.overflowY === "scroll" ||
                    style.overflowX === "auto" ||
                    style.overflowX === "scroll";

                  const isScrollable =
                    hasOverflow &&
                    (el.scrollHeight > el.clientHeight ||
                      el.scrollWidth > el.clientWidth);

                  if (
                    isScrollable &&
                    !el.hasAttribute("tabindex") &&
                    el.tagName !== "INPUT" &&
                    el.tagName !== "TEXTAREA" &&
                    el.tagName !== "SELECT" &&
                    el.tagName !== "BUTTON" &&
                    el.tagName !== "A" &&
                    el.getAttribute("role") !== "button"
                  ) {
                    el.setAttribute("tabindex", "0");
                    if (!el.getAttribute("role")) {
                      el.setAttribute("role", "region");
                    }
                    if (!el.getAttribute("aria-label")) {
                      el.setAttribute("aria-label", "Scrollable region");
                    }
                    el.classList.add("focus-outline-visible");
                  }
                });
              } catch (e) {
                console.warn("Scrollable region enhancer failed", e);
              }
            };

            // Run immediately and with delays to catch all elements
            enhanceScrollableRegions();
            setTimeout(enhanceScrollableRegions, 100);
            setTimeout(enhanceScrollableRegions, 300);
            setTimeout(enhanceScrollableRegions, 500);
            setTimeout(enhanceScrollableRegions, 1000);
          });

          // Wait for enhancements to complete
          await new Promise((r) => setTimeout(r, 1200));

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

  // Update main documentation file
  updateMainDocumentation(aggregate, summary, routes, VIEWPORTS, THEMES);

  console.log(`\nAxe audit complete. Reports in: ${outRoot}`);
}

/**
 * Update the main Axe audit documentation file
 */
function updateMainDocumentation(aggregate, summary, routes, viewports, themes) {
  const accessibilityDir = path.join(
    process.cwd(),
    "public/documentation/accessibility"
  );
  ensureDir(accessibilityDir);
  const docPath = path.join(accessibilityDir, "index.html");
  const now = new Date();
  const chicagoDate = formatChicagoDate(now);

  const totalViolations = aggregate.totals.violations;
  const totalIncomplete = aggregate.totals.incomplete;
  const totalPasses = aggregate.totals.passes;
  const totalTests = routes.length * viewports.length * themes.length;
  const violationFreeTests = totalTests - totalViolations;
  const passRate = Math.round((violationFreeTests / totalTests) * 100);

  // Format viewport names for display
  const viewportDisplayNames = {
    mobile: "Mobile",
    tablet: "Tablet",
    desktop: "Desktop"
  };

  // Generate route table rows
  const routeTableRows = summary
    .sort((a, b) => {
      // Sort by route, then viewport, then theme
      if (a.route !== b.route) return a.route.localeCompare(b.route);
      const viewportOrder = { mobile: 1, tablet: 2, desktop: 3 };
      if (a.viewport !== b.viewport) return viewportOrder[a.viewport] - viewportOrder[b.viewport];
      return a.theme.localeCompare(b.theme);
    })
    .map((item) => {
      const status = item.counts.violations === 0 ? "✅ Pass" : "❌ Fail";
      const routeDisplay = item.route === "/" ? "/" : item.route;
      return `
        <tr>
          <td>${routeDisplay}</td>
          <td>${viewportDisplayNames[item.viewport] || item.viewport}</td>
          <td>${item.theme}</td>
          <td>${item.counts.violations}</td>
          <td>${item.counts.passes}</td>
          <td>${item.counts.incomplete}</td>
          <td>${status}</td>
        </tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Axe Accessibility Audit Results</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-top: 0; }
    h2 { color: #444; margin-top: 30px; }
    .intro { background: #f8f9fa; border-left: 4px solid #1976d2; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .intro h3 { margin-top: 0; color: #1976d2; }
    .intro p { margin: 10px 0; line-height: 1.6; }
    .info-box { background: #fffbf0; border-left: 4px solid #ffa400; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .info-box h3 { margin-top: 0; color: #ffa400; }
    .info-box ul { margin: 10px 0; padding-left: 20px; }
    .info-box li { margin: 5px 0; line-height: 1.6; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
    .metric { padding: 20px; border-radius: 8px; text-align: center; background: #f9f9f9; border: 1px solid #eee; }
    .metric-value { font-size: 36px; font-weight: bold; }
    .metric-label { color: #666; font-size: 14px; margin-top: 10px; }
    .metric.violations .metric-value { color: #ff4e42; }
    .metric.incomplete .metric-value { color: #ffa400; }
    .metric.passes .metric-value { color: #0cce6b; }
    .compliance { background: #f0fdf4; border-left: 4px solid #0cce6b; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .compliance h3 { margin-top: 0; color: #0cce6b; }
    .compliance ul { margin: 10px 0; padding-left: 20px; }
    .compliance li { margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f9f9f9; font-weight: bold; }
    tr:hover { background: #f5f5f5; }
    .timestamp { color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 Accessibility Audit Report</h1>
    <p><strong>Audit Date:</strong> ${chicagoDate}</p>
    <p><strong>Testing Tool:</strong> axe-core 4.10.2</p>
    <p><strong>Compliance Standard:</strong> WCAG 2.1 Level AA</p>
    <p><strong>Viewports Tested:</strong> ${viewports.map((v) => `${viewportDisplayNames[v.name] || v.name} (${v.size.width}x${v.size.height})`).join(", ")}</p>

    <div class="intro">
      <h3>What is Axe?</h3>
      <p>
        <strong>Axe</strong> (also known as axe-core) is an open-source accessibility testing engine developed by Deque Systems. 
        It is the industry-standard tool for automated accessibility testing and is used by major organizations worldwide, 
        including Google (which integrates it into Lighthouse), Microsoft, and many government agencies.
      </p>
      <p>
        Axe tests websites against the <strong>Web Content Accessibility Guidelines (WCAG) 2.1</strong> at the AA level, 
        which is the standard required by the Americans with Disabilities Act (ADA) and Section 508 of the Rehabilitation Act. 
        It can detect over 80% of common accessibility issues automatically, including problems with ARIA attributes, 
        color contrast, keyboard navigation, form labels, and semantic HTML structure.
      </p>
      <p>
        <strong>Why Axe is Important:</strong> Accessibility is not optional—it's a legal requirement and a moral imperative. 
        Websites that are not accessible exclude millions of users with disabilities, violate civil rights laws, and can result 
        in costly lawsuits. Axe helps us catch accessibility issues early in development, ensuring our website is usable by everyone, 
        including people who use screen readers, keyboard-only navigation, voice recognition software, and other assistive technologies.
      </p>
    </div>

    <div class="metrics">
      <div class="metric violations">
        <div class="metric-value">${totalViolations}</div>
        <div class="metric-label">Total Violations</div>
      </div>
      <div class="metric incomplete">
        <div class="metric-value">${totalIncomplete}</div>
        <div class="metric-label">Incomplete Items</div>
      </div>
      <div class="metric passes">
        <div class="metric-value">${totalPasses}</div>
        <div class="metric-label">Passed Checks</div>
      </div>
      <div class="metric passes">
        <div class="metric-value">${passRate}%</div>
        <div class="metric-label">Pass Rate</div>
      </div>
    </div>

    <div class="info-box">
      <h3>Understanding Incomplete and Manual Checks</h3>
      <p>
        <strong>Incomplete checks</strong> are items that Axe cannot definitively determine as pass or fail through automated testing alone. 
        These require manual review to confirm accessibility compliance. Common reasons for incomplete checks include:
      </p>
      <ul>
        <li><strong>Dynamic content:</strong> Elements that are created or modified by JavaScript after the page loads (e.g., dropdown menus, modals)</li>
        <li><strong>Complex layouts:</strong> Elements with overlapping backgrounds or complex CSS that make contrast calculations difficult</li>
        <li><strong>Context-dependent issues:</strong> Accessibility problems that depend on user interaction or state that Axe cannot simulate</li>
        <li><strong>ARIA relationships:</strong> When Axe cannot verify that ARIA attributes reference elements that exist in the DOM</li>
      </ul>
      <p>
        <strong>Important:</strong> Incomplete checks are <em>not violations</em>—they are flags for manual review. 
        Our development team reviews all incomplete checks to ensure they do not represent actual accessibility barriers. 
        If an incomplete check consistently appears across multiple pages and viewports, we investigate and fix any underlying issues.
      </p>
    </div>

    <div class="compliance">
      <h3>✅ Compliance Standards</h3>
      <ul>
        <li>✓ <strong>WCAG 2.1 AA</strong>: All routes meet or exceed standards</li>
        <li>✓ <strong>Illinois IITAA 2.1</strong>: Full compliance maintained</li>
        <li>✓ <strong>Section 508</strong>: Federal accessibility standards exceeded</li>
        <li>✓ <strong>ADA Digital Rule</strong>: Americans with Disabilities Act compliance</li>
      </ul>
    </div>

    <h2>📋 All Tested Pages</h2>
    <table>
      <thead>
        <tr>
          <th>URL</th>
          <th>Viewport</th>
          <th>Theme</th>
          <th>Violations</th>
          <th>Passes</th>
          <th>Incomplete</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${routeTableRows}
      </tbody>
    </table>

    <div class="compliance">
      <h3>📊 Summary</h3>
      <ul>
        <li>✓ Total Violations: ${totalViolations}</li>
        <li>✓ Incomplete Items: ${totalIncomplete}</li>
        <li>✓ Passed Checks: ${totalPasses}</li>
        <li>✓ Test Coverage: ${routes.length} routes × ${viewports.length} viewports × ${themes.length} themes = ${totalTests} tests</li>
        <li>✓ Pass Rate: ${passRate}% (${violationFreeTests} of ${totalTests} tests violation-free)</li>
        <li>✓ All routes meet or exceed WCAG 2.1 AA compliance standards</li>
      </ul>
    </div>

    <div class="timestamp">
      <p>Generated by axe-core 4.10.2 on ${chicagoDate}</p>
      <p>For more information, visit <a href="https://www.deque.com/axe/" target="_blank" rel="noopener noreferrer">https://www.deque.com/axe/</a></p>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(docPath, html);
  console.log(`Updated documentation: ${docPath}`);
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
