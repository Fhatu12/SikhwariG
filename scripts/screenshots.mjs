import { spawn, spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const nextBin = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next");
const port = Number(process.env.SCREENSHOT_PORT ?? "3100");
const baseUrl = `http://127.0.0.1:${port}`;
const routes = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/legal/disclaimer",
];

const viewports = [
  {
    name: "desktop",
    context: {
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
    },
  },
  {
    name: "mobile",
    context: {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
  },
];

function routeFileName(route) {
  if (route === "/") {
    return "home";
  }
  return route.slice(1).replaceAll("/", "-");
}

function runNextCommand(args, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [nextBin, ...args], {
      cwd: repoRoot,
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} failed with exit code ${String(code)}`));
    });
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 60000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        return;
      }
    } catch {}
    await wait(500);
  }
  throw new Error(`Timed out waiting for server at ${url}`);
}

async function startServer() {
  const child = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    cwd: repoRoot,
    stdio: "inherit",
    env: process.env,
  });

  const exitedEarly = new Promise((_, reject) => {
    child.once("exit", (code) => {
      reject(new Error(`Server exited before capture with code ${String(code)}`));
    });
    child.once("error", reject);
  });

  await Promise.race([waitForServer(baseUrl), exitedEarly]);
  return child;
}

async function stopServer(child) {
  if (!child || child.exitCode !== null) {
    return;
  }

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
    return;
  }

  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      if (child.exitCode === null) {
        child.kill("SIGKILL");
      }
      resolve();
    }, 5000);

    child.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });

    child.kill("SIGTERM");
  });
}

async function ensureOutputDirs() {
  await Promise.all(
    viewports.map(({ name }) =>
      mkdir(path.join(repoRoot, "docs", "screenshots", name), { recursive: true })
    )
  );
}

async function captureAllScreenshots() {
  await ensureOutputDirs();

  const browser = await chromium.launch();
  try {
    for (const viewport of viewports) {
      const context = await browser.newContext(viewport.context);
      const page = await context.newPage();

      for (const route of routes) {
        const targetUrl = `${baseUrl}${route}`;
        const outputPath = path.join(
          repoRoot,
          "docs",
          "screenshots",
          viewport.name,
          `${routeFileName(route)}.png`
        );

        await page.goto(targetUrl, { waitUntil: "networkidle" });
        await page.evaluate(async () => {
          if (document.fonts?.ready) {
            await document.fonts.ready;
          }
        });
        await page.waitForTimeout(400);
        await page.screenshot({ path: outputPath, fullPage: true });
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  let serverProcess;
  let exitCode = 0;

  const shutdown = async () => {
    await stopServer(serverProcess);
  };

  process.on("SIGINT", () => {
    void shutdown().finally(() => process.exit(1));
  });
  process.on("SIGTERM", () => {
    void shutdown().finally(() => process.exit(1));
  });

  try {
    await runNextCommand(["build"], "next build");
    serverProcess = await startServer();
    await captureAllScreenshots();
  } catch (error) {
    exitCode = 1;
    console.error(error instanceof Error ? error.message : error);
  } finally {
    await shutdown();
  }

  process.exitCode = exitCode;
}

await main();
