/**
 * Adds Preview-scoped project env vars on Vercel using values from repo-root `.env`
 * (never prints secret values). Uses the Vercel CLI with values on stdin.
 *
 * Playwright: on CLI failure, opens the Environment Variables page (headed) for
 * manual completion. After successful CLI adds, optionally validates routes with
 * Playwright's request API (no browser cookies required).
 *
 * Run from repo root (requires `npx vercel` auth for team `fhatu12s-projects`):
 *   node scripts/devops/vercel-preview-env-from-local.mjs
 *
 * Optional: set PREVIEW_SITE_URL to override NEXT_PUBLIC_SITE_URL for Preview.
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium, request } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

const SCOPE = "fhatu12s-projects";
const DEFAULT_PREVIEW_SITE_URL =
  "https://sikhwarig-a0kjhb0fx-fhatu12s-projects.vercel.app";
const PREVIEW_SITE_URL =
  process.env.PREVIEW_SITE_URL?.trim() || DEFAULT_PREVIEW_SITE_URL;

const REQUIRED_FROM_ENV = [
  "DATABASE_URL",
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
];

const OPTIONAL_FROM_ENV = [
  "COMPANY_REGISTRATION_NUMBER",
  "COMPANY_REGISTERED_ADDRESS",
];

const SENSITIVE = new Set([
  "DATABASE_URL",
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
]);

/** @returns {Record<string, string>} */
function parseDotEnv(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    const dq = v.startsWith('"') && v.endsWith('"');
    const sq = v.startsWith("'") && v.endsWith("'");
    if (dq || sq) v = v.slice(1, -1);
    out[key] = v;
  }
  return out;
}

function auditDatabaseUrlForPreview(raw) {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return { ok: false, code: "MISSING" };
  if (/^file:/i.test(trimmed)) return { ok: false, code: "LOCAL_FILE" };
  try {
    const normalized = trimmed.replace(/^postgresql:/i, "postgres:");
    const u = new URL(normalized);
    const hay = `${u.hostname}${u.pathname}`.toLowerCase();
    if (
      /(^|[._-])prod($|[._-])|production|prd[._]|\.prd\.|live\.neon/i.test(hay)
    ) {
      return { ok: false, code: "PROD_LIKE" };
    }
    return { ok: true };
  } catch {
    return { ok: false, code: "PARSE" };
  }
}

/**
 * @param {string} name
 * @param {boolean} sensitive
 * @param {string} value
 */
function vercelEnvAddPreview(name, sensitive, value) {
  return new Promise((resolve, reject) => {
    const args = [
      "vercel",
      "env",
      "add",
      name,
      "preview",
      "-y",
      "--scope",
      SCOPE,
      "--force",
    ];
    if (sensitive) args.push("--sensitive");

    const child = spawn("npx", args, {
      cwd: repoRoot,
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
    });

    let combined = "";
    const onChunk = (buf) => {
      combined += buf.toString();
    };
    child.stdout?.on("data", onChunk);
    child.stderr?.on("data", onChunk);

    child.stdin?.write(value.endsWith("\n") ? value : `${value}\n`);
    child.stdin?.end();

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      const tail = combined.trimEnd().slice(-280);
      reject(new Error(`vercel env add ${name} exited ${String(code)}: ${tail}`));
    });
  });
}

async function openDashboardForManualFallback(team, project) {
  const url = `https://vercel.com/${team}/${project}/settings/environment-variables`;
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
  console.log(
    "[vercel-preview-env-from-local] Playwright opened the Environment Variables page (headed). Complete Preview entries in the browser, then close the window.",
  );
  await page.waitForTimeout(120000);
  await browser.close();
}

/** @param {string} baseUrl */
async function validatePublicRoutes(baseUrl) {
  const ctx = await request.newContext();
  const paths = [
    "/services",
    "/",
    "/contact",
    "/divisions/software-development-and-digital-services",
    "/legal/privacy",
  ];
  for (const p of paths) {
    const res = await ctx.get(`${baseUrl.replace(/\/$/, "")}${p}`, {
      maxRedirects: 10,
    });
    console.log(`[vercel-preview-env-from-local] Playwright GET ${p} = ${String(res.status())}`);
  }
  await ctx.dispose();
}

async function main() {
  const team = process.env.VERCEL_TEAM_SLUG ?? "fhatu12s-projects";
  const project = process.env.VERCEL_PROJECT ?? "sikhwarig";

  const envPath = path.join(repoRoot, ".env");
  const env = parseDotEnv(envPath);

  const missing = REQUIRED_FROM_ENV.filter((k) => !(env[k] ?? "").trim());
  if (missing.length) {
    console.error(
      `[vercel-preview-env-from-local] Missing in .env (names only): ${missing.join(", ")}`,
    );
    process.exit(2);
  }

  const dbAudit = auditDatabaseUrlForPreview(env.DATABASE_URL);
  if (!dbAudit.ok) {
    console.error(
      `[vercel-preview-env-from-local] DATABASE_URL blocked for Preview: ${dbAudit.code}`,
    );
    process.exit(3);
  }

  const order = [
    ...REQUIRED_FROM_ENV,
    "NEXT_PUBLIC_SITE_URL",
    ...OPTIONAL_FROM_ENV,
  ];

  for (const name of order) {
    let value;
    if (name === "NEXT_PUBLIC_SITE_URL") {
      value = PREVIEW_SITE_URL;
    } else {
      value = (env[name] ?? "").trim();
    }
    if (!value) continue;

    const sensitive = SENSITIVE.has(name);
    try {
      await vercelEnvAddPreview(name, sensitive, value);
      console.log(`[vercel-preview-env-from-local] Set Preview: ${name}`);
    } catch (e) {
      console.error(
        `[vercel-preview-env-from-local] CLI failed for ${name}. Opening dashboard for manual completion.`,
      );
      console.error(String(e?.message ?? e));
      await openDashboardForManualFallback(team, project).catch(() => {});
      process.exit(4);
    }
  }

  await validatePublicRoutes(PREVIEW_SITE_URL).catch((e) => {
    console.error(
      "[vercel-preview-env-from-local] Playwright route check failed:",
      e?.message ?? e,
    );
  });
}

main().catch((e) => {
  console.error("[vercel-preview-env-from-local] Failed:", e?.message ?? e);
  process.exit(1);
});
