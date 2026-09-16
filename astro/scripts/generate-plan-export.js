/**
 * Plan Export Generation Script
 *
 * Builds the machine-readable exports offered on /download/:
 *   public/vpp-plan-2025-2029.json
 *   public/vpp-plan-2025-2029.yaml
 *
 * Both files existed before this script did, but held zero pages — they were
 * generated once on 2026-04-13 against a source that produced nothing, and
 * nothing regenerated them afterwards. The /download/ page and the README
 * have been offering an empty download ever since. Wiring this into
 * `prebuild` means they are rebuilt from content on every build, so they
 * cannot silently drift again.
 *
 * Page order comes from src/data/planOrder.js — the same array the site's
 * navigation uses — so the export reads in plan order rather than whatever
 * order the filesystem returns. There is deliberately no second list of
 * slugs here.
 *
 * Scope is the `plan` collection: the seven documents listed under
 * "Plan Content" in public/llms.txt.
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { load as yamlLoad, dump as yamlDump } from "js-yaml";
import { planOrder } from "../src/data/planOrder.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const contentDir = path.join(rootDir, "src", "content", "plan");
const publicDir = path.join(rootDir, "public");

const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${msg}`),
  warning: (msg) => console.warn(`[WARNING] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
};

const PLAN_INFO = {
  title: "Statewide Violence Prevention Plan for Illinois: 2025-2029",
  description:
    "Comprehensive violence prevention plan outlining Illinois's strategic approach to preventing violence through evidence-based practices, equity advancement, and collaborative efforts across state, municipal, and community-based agencies for 2025-2029.",
  version: "2025-2029",
  organization: "Illinois Criminal Justice Information Authority (ICJIA)",
  baseUrl: "https://vpp.icjia.illinois.gov",
};

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/**
 * Split a content file into frontmatter and body.
 *
 * The frontmatter block is parsed with js-yaml rather than a line regex so
 * that quoted strings, arrays and multi-line values survive intact — several
 * plan pages carry keyword arrays that a naive `key: value` match drops.
 */
function parseFrontmatter(raw, label) {
  const match = FRONTMATTER_RE.exec(raw);
  if (!match) return { data: {}, body: raw.trim() };

  let data = {};
  try {
    data = yamlLoad(match[1]) || {};
  } catch (err) {
    logger.warning(`${label}: frontmatter did not parse (${err.message}); treating as empty`);
    data = {};
  }
  return { data, body: match[2].trim() };
}

/** Find <slug>.md or <slug>.mdx — goals-and-recommendations is .mdx. */
async function readPlanFile(slug) {
  for (const ext of [".md", ".mdx"]) {
    const file = path.join(contentDir, `${slug}${ext}`);
    try {
      return { raw: await fs.readFile(file, "utf8"), file: `${slug}${ext}` };
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
  }
  return null;
}

async function build() {
  const pages = [];
  let skipped = 0;

  for (const [i, entry] of planOrder.entries()) {
    const found = await readPlanFile(entry.slug);
    if (!found) {
      logger.warning(`no .md or .mdx for "${entry.slug}" — skipping`);
      skipped += 1;
      continue;
    }

    const { data, body } = parseFrontmatter(found.raw, found.file);
    const { title, description, ...metadata } = data;
    const routePath = `/plan/${entry.slug}`;

    pages.push({
      slug: entry.slug,
      path: routePath,
      url: `${PLAN_INFO.baseUrl}${routePath}`,
      order: i + 1,
      // Frontmatter wins; planOrder's title is the fallback so a page missing
      // a title still exports the name the navigation shows.
      title: title || entry.title,
      description: description || null,
      file: found.file,
      metadata,
      contentLength: body.length,
      content: body,
    });
  }

  if (pages.length === 0) {
    // The failure this script exists to prevent. An empty export is worse
    // than no export: /download/ links it and the README advertises it.
    throw new Error(
      `no plan pages were read from ${contentDir} — refusing to write an empty export`
    );
  }

  const totalContentLength = pages.reduce((n, p) => n + p.contentLength, 0);
  const totalMetadataFields = pages.reduce(
    (n, p) => n + Object.keys(p.metadata).length,
    0
  );

  const doc = {
    planInfo: {
      ...PLAN_INFO,
      generatedAt: new Date().toISOString(),
      totalPages: pages.length,
    },
    generationStats: {
      totalPages: planOrder.length,
      processedPages: pages.length,
      skippedPages: skipped,
      totalContentLength,
      totalMetadataFields,
      averageContentLength: Math.round(totalContentLength / pages.length),
      averageMetadataFields:
        Math.round((totalMetadataFields / pages.length) * 100) / 100,
    },
    pages,
    index: {
      pageCount: pages.length,
      paths: pages.map((p) => p.path),
      titles: pages.map((p) => p.title),
      slugs: pages.map((p) => p.slug),
    },
  };

  await fs.mkdir(publicDir, { recursive: true });

  const jsonPath = path.join(publicDir, "vpp-plan-2025-2029.json");
  await fs.writeFile(jsonPath, JSON.stringify(doc, null, 2) + "\n", "utf8");

  const yamlPath = path.join(publicDir, "vpp-plan-2025-2029.yaml");
  await fs.writeFile(
    yamlPath,
    yamlDump(doc, { lineWidth: 110, noRefs: true }),
    "utf8"
  );

  logger.success(
    `plan export: ${pages.length}/${planOrder.length} pages, ` +
      `${totalContentLength.toLocaleString()} chars → ` +
      `public/vpp-plan-2025-2029.{json,yaml}`
  );
  if (skipped > 0) logger.warning(`${skipped} page(s) skipped — see warnings above`);
}

build().catch((err) => {
  logger.error(err.message);
  process.exit(1);
});
