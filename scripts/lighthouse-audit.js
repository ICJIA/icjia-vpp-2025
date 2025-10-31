/*
 * Lighthouse Accessibility Audit Script (ESM)
 * Runs Lighthouse audits focusing on accessibility compliance
 */

/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
 * Generate HTML report from Lighthouse results
 */
function generateHtmlReport(results, route, outDir) {
  const accessibility = results.categories.accessibility;
  const score = Math.round(accessibility.score * 100);
  const auditResults = results.audits;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lighthouse Audit - ${route}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-top: 0; }
    .score { font-size: 48px; font-weight: bold; padding: 20px; border-radius: 8px; display: inline-block; margin: 20px 0; }
    .score.good { background: #0cce6b; color: white; }
    .score.needs-improvement { background: #ffa400; color: white; }
    .score.poor { background: #ff4e42; color: white; }
    .audit-item { margin: 20px 0; padding: 15px; border-left: 4px solid #ddd; }
    .audit-item.pass { border-left-color: #0cce6b; background: #f0fdf4; }
    .audit-item.fail { border-left-color: #ff4e42; background: #fef2f2; }
    .audit-item.warning { border-left-color: #ffa400; background: #fffbf0; }
    .audit-title { font-weight: bold; margin-bottom: 5px; }
    .audit-description { color: #666; font-size: 14px; }
    .timestamp { color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Lighthouse Accessibility Audit</h1>
    <p><strong>Route:</strong> ${route}</p>
    <p><strong>URL:</strong> ${new URL(route, BASE_URL).toString()}</p>
    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    
    <div class="score ${score >= 90 ? "good" : score >= 50 ? "needs-improvement" : "poor"}">
      ${score}
    </div>
    
    <h2>Accessibility Audits</h2>
    <div id="audits"></div>
    
    <div class="timestamp">Generated: ${new Date().toISOString()}</div>
  </div>
  
  <script>
    const audits = ${JSON.stringify(auditResults, null, 2)};
    const container = document.getElementById('audits');
    
    Object.entries(audits).forEach(([key, audit]) => {
      if (audit.scoreDisplayMode === 'notApplicable') return;
      
      const div = document.createElement('div');
      const status = audit.score === 1 ? 'pass' : audit.score === 0 ? 'fail' : 'warning';
      div.className = 'audit-item ' + status;
      
      div.innerHTML = \`
        <div class="audit-title">\${audit.title}</div>
        <div class="audit-description">\${audit.description || ''}</div>
      \`;
      
      container.appendChild(div);
    });
  </script>
</body>
</html>`;

  return html;
}

async function run() {
  const routes = ROUTES.length ? ROUTES : DEFAULT_ROUTES;
  const outRoot = path.join(process.cwd(), "reports", "lighthouse", timestamp());
  ensureDir(outRoot);

  console.log(`Lighthouse audit starting...`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Routes: ${routes.join(", ")}`);
  console.log(`Output: ${outRoot}`);

  let chrome;
  const summary = [];

  try {
    chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

    for (const route of routes) {
      const url = new URL(route, BASE_URL).toString();
      console.log(`\nAuditing: ${url}`);

      const options = {
        logLevel: "error",
        output: "json",
        port: chrome.port,
        onlyCategories: ["accessibility"],
      };

      const runnerResult = await lighthouse(url, options);
      const results = runnerResult.lhr;

      const fileSafe =
        route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_");
      const jsonFile = path.join(outRoot, `lighthouse-${fileSafe}.json`);
      const htmlFile = path.join(outRoot, `lighthouse-${fileSafe}.html`);

      fs.writeFileSync(jsonFile, JSON.stringify(results, null, 2));

      const htmlReport = generateHtmlReport(results, route, outRoot);
      fs.writeFileSync(htmlFile, htmlReport);

      const score = Math.round(results.categories.accessibility.score * 100);
      summary.push({ route, score });

      console.log(`  Accessibility Score: ${score}`);
    }
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }

  const summaryPath = path.join(outRoot, "summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify({ summary }, null, 2));

  const lines = [];
  lines.push(`# Lighthouse Audit Summary`);
  lines.push(`Base URL: ${BASE_URL}`);
  lines.push(`Timestamp: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("Accessibility Scores:");
  for (const item of summary) {
    lines.push(`  ${item.route}: ${item.score}`);
  }

  fs.writeFileSync(path.join(outRoot, "summary.txt"), lines.join("\n"));

  console.log(`\nLighthouse audit complete. Reports in: ${outRoot}`);
}

run().catch((err) => {
  console.error("Lighthouse audit failed:", err);
  process.exitCode = 1;
});

