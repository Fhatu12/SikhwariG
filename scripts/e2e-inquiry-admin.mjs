import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { chromium, request } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const reportPath = path.join(repoRoot, "docs", "test-reports", "inquiry-admin-e2e.md");
const port = Number.parseInt(process.env.E2E_PORT ?? "3105", 10);
const baseUrl = `http://localhost:${String(port)}`;
const runTimestamp = new Date().toISOString();
const runTag = runTimestamp.replace(/[-:.TZ]/g, "").slice(0, 14);
const runRateLimit = process.env.E2E_RUN_RATE_LIMIT === "1";

if (!Number.isFinite(port) || port <= 0) {
  throw new Error("E2E_PORT must be a valid positive number.");
}

const SELECTORS = {
  fullName: '#contact-fullName, [name="fullName"]',
  email: '#contact-email, [name="email"]',
  phone: '#contact-phone, [name="phone"]',
  intent: '#contact-intent, [name="intent"]',
  serviceArea: '#contact-serviceArea, [name="serviceArea"]',
  message: '#contact-message, [name="message"]',
  honeypot: '[name="companyWebsite"]',
  timing: 'input[name="formStartedAt"]',
  submit: 'button[type="submit"]',
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function spawnPromise(command, args, options, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
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

async function runNpmScript(scriptName, envOverrides = {}) {
  const npmCommand =
    process.platform === "win32"
      ? {
          command: "cmd.exe",
          args: ["/d", "/s", "/c", `npm run ${scriptName}`],
        }
      : {
          command: "npm",
          args: ["run", scriptName],
        };
  await spawnPromise(
    npmCommand.command,
    npmCommand.args,
    {
      cwd: repoRoot,
      stdio: "inherit",
      env: { ...process.env, ...envOverrides },
    },
    `npm run ${scriptName}`
  );
}

async function waitForServer(url, timeoutMs = 60000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
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

async function startNextServer() {
  const npmCommand =
    process.platform === "win32"
      ? {
          command: "cmd.exe",
          args: ["/d", "/s", "/c", "npm run start"],
        }
      : {
          command: "npm",
          args: ["run", "start"],
        };
  const child = spawn(npmCommand.command, npmCommand.args, {
    cwd: repoRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: String(port),
      NODE_ENV: "production",
    },
  });

  const exitedEarly = new Promise((_, reject) => {
    child.once("exit", (code) => {
      reject(new Error(`next start exited early with code ${String(code)}`));
    });
    child.once("error", reject);
  });

  await Promise.race([waitForServer(baseUrl), exitedEarly]);
  return child;
}

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const body = trimmed.startsWith("export ") ? trimmed.slice(7).trim() : trimmed;
  const equalsIndex = body.indexOf("=");
  if (equalsIndex <= 0) {
    return null;
  }

  const key = body
    .slice(0, equalsIndex)
    .trim()
    .replace(/^\uFEFF/u, "");
  if (!key) {
    return null;
  }
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(key)) {
    return null;
  }

  let value = body.slice(equalsIndex + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  value = value.replace(/\\n/g, "\n");
  return { key, value };
}

async function loadDotEnvFile() {
  const envPath = path.join(repoRoot, ".env");
  if (!existsSync(envPath)) {
    return;
  }

  const envContent = await readFile(envPath, "utf8");
  for (const line of envContent.split(/\r?\n/u)) {
    const parsed = parseEnvLine(line);
    if (!parsed) {
      continue;
    }
    if (process.env[parsed.key] === undefined) {
      process.env[parsed.key] = parsed.value;
    }
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function escapeCell(value) {
  return String(value ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", "<br>");
}

function maskUsername(username) {
  if (!username) {
    return "***";
  }
  const atIndex = username.indexOf("@");
  if (atIndex > 0) {
    return `${username[0]}***@***`;
  }
  return "***";
}

function makeMarker(suffix) {
  return `[E2E:${runTag}:${suffix}]`;
}

function makeValidPayload(marker, overrides = {}) {
  return {
    name: `E2E User ${marker.slice(-8)}`,
    email: `e2e+${marker.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}@example.com`,
    phone: "+27110000000",
    intent: "General enquiry",
    serviceArea: "",
    message: `Automated E2E message ${marker}`,
    companyWebsite: "",
    formStartedAt: Date.now() - 6000,
    sourcePath: "/contact",
    ...overrides,
  };
}

async function waitForLeadByMarker(prisma, marker, timeoutMs = 10000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const lead = await prisma.lead.findFirst({
      where: {
        message: {
          contains: marker,
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    if (lead) {
      return lead;
    }
    await wait(300);
  }
  return null;
}

async function findLeadByMarker(prisma, marker) {
  return prisma.lead.findFirst({
    where: {
      message: {
        contains: marker,
      },
    },
    orderBy: {
      id: "desc",
    },
  });
}

async function setHiddenInputValue(page, selector, value) {
  await page.evaluate(
    ({ inputSelector, nextValue }) => {
      const element = document.querySelector(inputSelector);
      if (!(element instanceof HTMLInputElement)) {
        return;
      }
      element.value = nextValue;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
    },
    { inputSelector: selector, nextValue: value }
  );
}

async function waitForText(page, text, timeout = 3000) {
  try {
    await page.getByText(text, { exact: false }).first().waitFor({ state: "visible", timeout });
    return true;
  } catch {
    return false;
  }
}

async function submitAndCaptureStatus(page, expectRequest) {
  const responsePromise = page
    .waitForResponse(
      (response) => {
        const url = new URL(response.url());
        return url.pathname === "/api/leads" && response.request().method() === "POST";
      },
      { timeout: expectRequest ? 10000 : 1500 }
    )
    .catch(() => null);

  await page.locator(SELECTORS.submit).click();
  const response = await responsePromise;
  if (!response) {
    return "no-request";
  }
  return String(response.status());
}

async function fillContactForm(page, { fullName, email, phone, intent, serviceArea, message }) {
  await page.locator(SELECTORS.fullName).fill(fullName);
  await page.locator(SELECTORS.email).fill(email);
  await page.locator(SELECTORS.phone).fill(phone);
  await page.locator(SELECTORS.intent).selectOption({ label: intent });
  await page.locator(SELECTORS.serviceArea).selectOption({ label: serviceArea || "Not sure" });
  await page.locator(SELECTORS.message).fill(message);
}

function makeResult(caseName, method, expectedStatus, expectedStored, marker) {
  return {
    caseName,
    method,
    expectedStatus: String(expectedStatus),
    actualStatus: "not-run",
    expectedStored: expectedStored ? "yes" : "no",
    actualStored: "no",
    leadId: "",
    adminVerified: "n/a",
    notes: "",
    marker,
    pass: false,
  };
}

function appendNote(result, note) {
  if (!note) {
    return;
  }
  result.notes = result.notes ? `${result.notes}; ${note}` : note;
}

function evaluatePass(result) {
  const statusMatches = result.expectedStatus === result.actualStatus;
  const storedMatches = result.expectedStored === result.actualStored;
  const adminMatches = result.actualStored === "yes" ? result.adminVerified === "yes" : true;
  return statusMatches && storedMatches && adminMatches;
}

async function runUiCase({
  page,
  prisma,
  routeState,
  ip,
  caseName,
  pathName,
  expectedStatus,
  expectedStored,
  marker,
  waitBeforeSubmitMs = 0,
  expectRequest = true,
  payloadOverrides,
  beforeFill,
  setup,
  assertionText,
  preSubmit,
}) {
  const result = makeResult(caseName, "UI", expectedStatus, expectedStored, marker);
  routeState.ip = ip;
  routeState.bodyMutator = null;

  try {
    const payload = makeValidPayload(marker, payloadOverrides);
    await page.goto(`${baseUrl}${pathName}`, { waitUntil: "networkidle" });
    if (beforeFill) {
      await beforeFill({ page, payload, routeState, marker });
    }
    await fillContactForm(page, {
      fullName: payload.name,
      email: payload.email,
      phone: payload.phone,
      intent: payload.intent,
      serviceArea: payload.serviceArea,
      message: payload.message,
    });

    if (setup) {
      await setup({ page, payload, routeState, marker });
    }
    if (waitBeforeSubmitMs > 0) {
      await wait(waitBeforeSubmitMs);
    }
    if (preSubmit) {
      await preSubmit({ page, routeState, marker });
    }

    result.actualStatus = await submitAndCaptureStatus(page, expectRequest);

    if (assertionText) {
      const found = await waitForText(page, assertionText);
      if (!found) {
        appendNote(result, `Missing validation text: ${assertionText}`);
      }
    }

    if (expectedStored) {
      const lead = await waitForLeadByMarker(prisma, marker);
      if (lead) {
        result.actualStored = "yes";
        result.leadId = String(lead.id);
      } else {
        appendNote(result, "Lead was not persisted");
      }
    } else {
      await wait(800);
      const lead = await findLeadByMarker(prisma, marker);
      if (lead) {
        result.actualStored = "yes";
        result.leadId = String(lead.id);
        appendNote(result, "Lead unexpectedly persisted");
      }
    }
  } catch (error) {
    result.actualStatus = "error";
    appendNote(result, error instanceof Error ? error.message : String(error));
  } finally {
    routeState.bodyMutator = null;
  }

  const validationFailed = result.notes.includes("Missing validation text:");
  result.pass = evaluatePass(result) && !validationFailed;
  return result;
}

async function runApiCase({
  apiContext,
  prisma,
  ip,
  caseName,
  expectedStatus,
  expectedStored,
  marker,
  payloadOverrides,
}) {
  const result = makeResult(caseName, "API", expectedStatus, expectedStored, marker);
  try {
    const payload = makeValidPayload(marker, payloadOverrides);
    const response = await apiContext.post("/api/leads", {
      data: payload,
      headers: {
        "x-forwarded-for": ip,
      },
    });
    result.actualStatus = String(response.status());

    if (expectedStored) {
      const lead = await waitForLeadByMarker(prisma, marker);
      if (lead) {
        result.actualStored = "yes";
        result.leadId = String(lead.id);
      } else {
        appendNote(result, "Lead was not persisted");
      }
    } else {
      await wait(500);
      const lead = await findLeadByMarker(prisma, marker);
      if (lead) {
        result.actualStored = "yes";
        result.leadId = String(lead.id);
        appendNote(result, "Lead unexpectedly persisted");
      }
    }
  } catch (error) {
    result.actualStatus = "error";
    appendNote(result, error instanceof Error ? error.message : String(error));
  }

  result.pass = evaluatePass(result);
  return result;
}

async function verifyStoredLeadsInAdmin({ browser, results, adminUsername, adminPassword }) {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(`${baseUrl}/admin/login`, { waitUntil: "networkidle" });
    await page.locator('input[name="username"]').fill(adminUsername);
    await page.locator('input[name="password"]').fill(adminPassword);
    await page.locator('button[type="submit"]').click();

    const loginDeadline = Date.now() + 10000;
    while (Date.now() < loginDeadline) {
      const currentPath = new URL(page.url()).pathname;
      if (currentPath === "/admin/leads") {
        break;
      }

      const invalidMessageVisible = await waitForText(page, "Invalid username or password.", 200);
      if (invalidMessageVisible) {
        throw new Error("Admin login failed: invalid credentials.");
      }

      await page.waitForTimeout(250);
    }

    const finalPath = new URL(page.url()).pathname;
    if (finalPath !== "/admin/leads") {
      throw new Error(`Admin login did not reach /admin/leads (current path: ${finalPath}).`);
    }

    for (const result of results) {
      if (result.actualStored !== "yes" || !result.leadId) {
        continue;
      }

      await page.goto(`${baseUrl}/admin/leads?id=${result.leadId}`, { waitUntil: "networkidle" });
      const content = await page.locator("body").innerText();
      if (content.includes(result.marker)) {
        result.adminVerified = "yes";
      } else {
        result.adminVerified = "no";
        appendNote(result, "Lead marker not found in admin details");
      }

      result.pass = evaluatePass(result);
    }
  } finally {
    await context.close();
  }
}

async function runRateLimitCase({ apiContext, prisma, markerPrefix }) {
  const result = makeResult(
    "Rate limit exceed (optional, 6 posts same IP)",
    "API",
    "n/a",
    false,
    markerPrefix
  );
  result.expectedStatus = "200,200,200,200,200,429";
  result.expectedStored = "5/6";
  const rateIp = "10.9.0.9";
  const statuses = [];
  const leadIds = [];

  try {
    for (let index = 1; index <= 6; index += 1) {
      const marker = `${markerPrefix}#${String(index)}`;
      const payload = makeValidPayload(marker, {
        intent: "General enquiry",
      });
      const response = await apiContext.post("/api/leads", {
        data: payload,
        headers: {
          "x-forwarded-for": rateIp,
        },
      });
      statuses.push(String(response.status()));

      if (response.status() === 200) {
        const storedLead = await waitForLeadByMarker(prisma, marker, 6000);
        if (storedLead) {
          leadIds.push(storedLead.id);
        }
      }
    }

    result.actualStatus = statuses.join(",");
    const sixthIs429 = statuses[5] === "429";
    const storedCount = leadIds.length;
    result.actualStored = `${String(storedCount)}/6`;
    result.leadId = leadIds.join(",");
    result.adminVerified = "n/a";

    if (!sixthIs429) {
      appendNote(result, "6th request did not return 429");
    }
    if (storedCount !== 5) {
      appendNote(result, `Expected 5 stored leads before throttling, found ${String(storedCount)}`);
    }
    appendNote(
      result,
      "Warning: rate-limit run can affect subsequent manual testing from same IP."
    );
    result.pass = sixthIs429 && storedCount === 5;
  } catch (error) {
    result.actualStatus = "error";
    appendNote(result, error instanceof Error ? error.message : String(error));
    result.pass = false;
  }

  return result;
}

async function writeReport({ results, adminUsernameMasked, fatalError }) {
  await mkdir(path.dirname(reportPath), { recursive: true });

  const total = results.length;
  const passed = results.filter((result) => result.pass).length;
  const failed = total - passed;

  const lines = [
    "# Inquiry + Admin E2E Report",
    "",
    `- Timestamp: ${runTimestamp}`,
    `- Base URL: ${baseUrl}`,
    `- Admin user: ${adminUsernameMasked}`,
    `- Rate limit test enabled: ${runRateLimit ? "yes" : "no"}`,
    `- Summary: ${String(passed)}/${String(total)} passed, ${String(failed)} failed`,
  ];

  if (fatalError) {
    lines.push(`- Fatal error: ${fatalError}`);
  }

  lines.push(
    "",
    "| caseName | method(UI/API) | expectedStatus | actualStatus | expectedStored | actualStored | leadId | adminVerified | notes/error |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |"
  );

  for (const result of results) {
    lines.push(
      `| ${escapeCell(result.caseName)} | ${escapeCell(result.method)} | ${escapeCell(result.expectedStatus)} | ${escapeCell(result.actualStatus)} | ${escapeCell(result.expectedStored)} | ${escapeCell(result.actualStored)} | ${escapeCell(result.leadId || "-")} | ${escapeCell(result.adminVerified)} | ${escapeCell(result.notes || (result.pass ? "pass" : "failed"))} |`
    );
  }

  if (!runRateLimit) {
    lines.push("", "> Rate limit exceed test skipped. Set `E2E_RUN_RATE_LIMIT=1` to enable.");
  }

  await writeFile(reportPath, `${lines.join("\n")}\n`, "utf8");
}

async function ensureBuildIfMissing() {
  const buildIdPath = path.join(repoRoot, ".next", "BUILD_ID");
  if (!existsSync(buildIdPath)) {
    await runNpmScript("build", { NODE_ENV: "production" });
  }
}

async function main() {
  await loadDotEnvFile();
  const adminUsername = requireEnv("ADMIN_USERNAME");
  const adminPassword = requireEnv("ADMIN_PASSWORD");
  requireEnv("ADMIN_SESSION_SECRET");
  requireEnv("DATABASE_URL");

  const adminUsernameMasked = maskUsername(adminUsername);
  const prisma = new PrismaClient();
  const results = [];
  let browser;
  let apiContext;
  let serverProcess;
  let fatalError = "";

  const routeState = {
    ip: "10.0.0.1",
    bodyMutator: null,
  };

  const shutdown = async () => {
    if (apiContext) {
      await apiContext.dispose();
    }
    if (browser) {
      await browser.close();
    }
    await prisma.$disconnect();
    await stopServer(serverProcess);
  };

  process.on("SIGINT", () => {
    void shutdown().finally(() => process.exit(1));
  });
  process.on("SIGTERM", () => {
    void shutdown().finally(() => process.exit(1));
  });

  try {
    await ensureBuildIfMissing();
    serverProcess = await startNextServer();

    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.route("**/api/leads", async (route, request) => {
      const headers = {
        ...request.headers(),
        "x-forwarded-for": routeState.ip,
      };

      let postData = request.postData();
      if (routeState.bodyMutator && postData) {
        const body = JSON.parse(postData);
        const mutated = routeState.bodyMutator(body);
        postData = JSON.stringify(mutated);
      }

      await route.continue({
        headers,
        postData,
      });
    });

    apiContext = await request.newContext({ baseURL: baseUrl });

    const uiCases = [
      {
        caseName: "UI valid enquiry (General enquiry, wait >3s)",
        pathName: "/contact",
        expectedStatus: "200",
        expectedStored: true,
        marker: makeMarker("ui-valid-general"),
        ip: "10.0.0.11",
        waitBeforeSubmitMs: 3300,
      },
      {
        caseName: "UI valid quote flow (/contact?intent=quote default intent)",
        pathName: "/contact?intent=quote",
        expectedStatus: "200",
        expectedStored: true,
        marker: makeMarker("ui-valid-quote"),
        ip: "10.0.0.12",
        waitBeforeSubmitMs: 3300,
        payloadOverrides: {
          intent: "Request a quote",
        },
        beforeFill: async ({ page }) => {
          const currentIntent = await page.locator(SELECTORS.intent).inputValue();
          if (currentIntent !== "Request a quote") {
            throw new Error("Default intent was not 'Request a quote'");
          }
        },
      },
      {
        caseName: "UI missing name (client-side validation)",
        pathName: "/contact",
        expectedStatus: "no-request",
        expectedStored: false,
        marker: makeMarker("ui-missing-name"),
        ip: "10.0.0.13",
        setup: async ({ page }) => {
          await page.locator(SELECTORS.fullName).fill("");
        },
        assertionText: "Full name is required.",
        expectRequest: false,
      },
      {
        caseName: "UI invalid email (client-side validation)",
        pathName: "/contact",
        expectedStatus: "no-request",
        expectedStored: false,
        marker: makeMarker("ui-invalid-email"),
        ip: "10.0.0.14",
        setup: async ({ page }) => {
          await page.locator(SELECTORS.email).fill("invalid-email");
        },
        assertionText: "Enter a valid email address.",
        expectRequest: false,
      },
      {
        caseName: "UI message too long >2000 (client-side validation)",
        pathName: "/contact",
        expectedStatus: "no-request",
        expectedStored: false,
        marker: makeMarker("ui-message-too-long"),
        ip: "10.0.0.15",
        setup: async ({ page, marker }) => {
          await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element instanceof HTMLTextAreaElement) {
              element.removeAttribute("maxlength");
            }
          }, SELECTORS.message);
          await page.locator(SELECTORS.message).fill(`${"x".repeat(2005)} ${marker}`);
        },
        assertionText: "Message must be 2000 characters or fewer.",
        expectRequest: false,
      },
      {
        caseName: "UI honeypot filled (200 but not stored)",
        pathName: "/contact",
        expectedStatus: "200",
        expectedStored: false,
        marker: makeMarker("ui-honeypot"),
        ip: "10.0.0.16",
        setup: async ({ page }) => {
          await setHiddenInputValue(page, SELECTORS.honeypot, "https://spam.example");
        },
      },
      {
        caseName: "UI too-fast submission (formStartedAt now, 200 not stored)",
        pathName: "/contact",
        expectedStatus: "200",
        expectedStored: false,
        marker: makeMarker("ui-too-fast"),
        ip: "10.0.0.17",
        preSubmit: async ({ routeState }) => {
          routeState.bodyMutator = (body) => ({
            ...body,
            formStartedAt: Date.now(),
          });
        },
      },
      {
        caseName: "UI spam phrase 'forex signal' (400 not stored)",
        pathName: "/contact",
        expectedStatus: "400",
        expectedStored: false,
        marker: makeMarker("ui-spam-phrase"),
        ip: "10.0.0.18",
        waitBeforeSubmitMs: 3300,
        setup: async ({ page, marker }) => {
          await page
            .locator(SELECTORS.message)
            .fill(`Need help with forex signal strategy ${marker}`);
        },
      },
      {
        caseName: "UI URL density >2 URLs (400 not stored)",
        pathName: "/contact",
        expectedStatus: "400",
        expectedStored: false,
        marker: makeMarker("ui-url-density"),
        ip: "10.0.0.19",
        waitBeforeSubmitMs: 3300,
        setup: async ({ page, marker }) => {
          await page
            .locator(SELECTORS.message)
            .fill(
              `Please review https://a.example and https://b.example and https://c.example ${marker}`
            );
        },
      },
    ];

    for (const uiCase of uiCases) {
      const result = await runUiCase({
        page,
        prisma,
        routeState,
        ...uiCase,
      });
      results.push(result);
    }

    const apiCases = [
      {
        caseName: "API invalid intent (unknown, 400 not stored)",
        expectedStatus: "400",
        expectedStored: false,
        marker: makeMarker("api-invalid-intent"),
        ip: "10.1.0.21",
        payloadOverrides: {
          intent: "Unknown intent",
        },
      },
      {
        caseName: "API invalid serviceArea (unknown, 400 not stored)",
        expectedStatus: "400",
        expectedStored: false,
        marker: makeMarker("api-invalid-service-area"),
        ip: "10.1.0.22",
        payloadOverrides: {
          serviceArea: "Unknown service area",
        },
      },
    ];

    for (const apiCase of apiCases) {
      const result = await runApiCase({
        apiContext,
        prisma,
        ...apiCase,
      });
      results.push(result);
    }

    if (runRateLimit) {
      const rateResult = await runRateLimitCase({
        apiContext,
        prisma,
        markerPrefix: makeMarker("api-rate-limit"),
      });
      results.push(rateResult);
    }

    await verifyStoredLeadsInAdmin({
      browser,
      results,
      adminUsername,
      adminPassword,
    });

    for (const result of results) {
      if (!result.pass && !result.notes) {
        appendNote(result, "Assertion mismatch");
      }
    }
  } catch (error) {
    fatalError = error instanceof Error ? error.message : String(error);
    results.push({
      caseName: "Fatal setup/run error",
      method: "UI/API",
      expectedStatus: "n/a",
      actualStatus: "error",
      expectedStored: "n/a",
      actualStored: "n/a",
      leadId: "-",
      adminVerified: "n/a",
      notes: fatalError,
      marker: "fatal",
      pass: false,
    });
  } finally {
    await writeReport({
      results,
      adminUsernameMasked,
      fatalError,
    });
    await shutdown();
  }

  const hasFailures = results.some((result) => !result.pass);
  if (hasFailures) {
    process.exitCode = 1;
  }
}

await main();
