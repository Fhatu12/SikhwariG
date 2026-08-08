import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import nodemailer from "nodemailer";
import { buildLeadNotificationMessage } from "@/lib/email/lead-notification";
import { prisma } from "@/lib/prisma";
import { POST } from "./route";

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  headers: vi.fn(
    async () => new Headers({ "user-agent": "vitest", "x-forwarded-for": "127.0.0.1" })
  ),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkLeadSubmissionRateLimit: vi.fn(() => ({ allowed: true })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    lead: {
      create: vi.fn(),
    },
  },
}));

const sendMail = vi.fn();

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail })),
  },
}));

const OLD_ENV = process.env;

function setCompleteSmtpEnv() {
  process.env.SMTP_HOST = "smtp.example.test";
  process.env.SMTP_PORT = "465";
  process.env.SMTP_SECURE = "true";
  process.env.SMTP_USER = "mailer@example.test";
  process.env.SMTP_PASSWORD = "test-password";
  process.env.LEAD_NOTIFICATION_FROM = "info@sikhwarigroup.co.za";
  process.env.LEAD_NOTIFICATION_TO = "info@sikhwarigroup.co.za";
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Jane Customer",
    email: "jane.customer@example.com",
    phone: "+27110000000",
    company: "Customer Holdings",
    intent: "Request a quote",
    serviceArea: "Software Development and Digital Services",
    message: "Please help with a portal build.",
    formStartedAt: Date.now() - 5000,
    sourcePath: "/contact",
    ...overrides,
  };
}

function notificationLead(overrides: Record<string, unknown> = {}) {
  return {
    leadId: 42,
    submittedAt: new Date("2026-07-26T08:30:00.000Z"),
    name: "Jane Customer",
    email: "jane.customer@example.com",
    phone: "+27110000000",
    company: "Customer Holdings",
    intent: "Request a quote",
    serviceArea: "Software Development and Digital Services",
    hospitalityServiceType: null,
    eventDate: null,
    eventLocation: null,
    estimatedGuestCount: null,
    message: "Please help with a portal build.",
    ...overrides,
  };
}

function postRequest(payload: Record<string, unknown>) {
  return new Request("https://example.test/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function readJson(response: Response) {
  return response.json() as Promise<unknown>;
}

function stringifyLogCalls(mock: ReturnType<typeof vi.fn>) {
  return JSON.stringify(mock.mock.calls);
}

describe("lead notification content", () => {
  it("includes all supplied enquiry fields", () => {
    const message = buildLeadNotificationMessage(notificationLead());

    expect(message.text).toContain("Lead reference ID: 42");
    expect(message.text).toContain("Submitted at: 2026-07-26T08:30:00.000Z");
    expect(message.text).toContain("Customer name: Jane Customer");
    expect(message.text).toContain("Customer email: jane.customer@example.com");
    expect(message.text).toContain("Customer phone: +27110000000");
    expect(message.text).toContain("Company: Customer Holdings");
    expect(message.text).toContain("Enquiry type: Request a quote");
    expect(message.text).toContain("Service area: Software Development and Digital Services");
    expect(message.text).toContain("Please help with a portal build.");
    expect(message.text).toContain("This enquiry has been saved in the website database.");
  });

  it("handles optional fields cleanly", () => {
    const message = buildLeadNotificationMessage(
      notificationLead({
        leadId: 43,
        phone: null,
        company: null,
        intent: "General enquiry",
        serviceArea: null,
        message: "Hello",
      })
    );

    expect(message.text).not.toContain("Customer phone:");
    expect(message.text).not.toContain("Company:");
    expect(message.text).not.toContain("Service area:");
    expect(message.text).not.toContain("Hospitality service type:");
  });

  it("escapes HTML user content", () => {
    const message = buildLeadNotificationMessage(
      notificationLead({
        leadId: 44,
        name: "<Jane>",
        phone: null,
        company: "A&B",
        serviceArea: null,
        message: "<script>alert('x')</script>",
      })
    );

    expect(message.html).toContain("&lt;Jane&gt;");
    expect(message.html).toContain("A&amp;B");
    expect(message.html).toContain("&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;");
    expect(message.html).not.toContain("<script>");
  });

  it("includes hospitality fields when supplied", () => {
    const message = buildLeadNotificationMessage(
      notificationLead({
        serviceArea: "Culinary and Hospitality Services",
        hospitalityServiceType: "Corporate Function",
        eventDate: new Date("2026-09-12T00:00:00.000Z"),
        eventLocation: "Centurion",
        estimatedGuestCount: 80,
        message: "Please assist with a corporate function.",
      })
    );

    expect(message.text).toContain("Hospitality service type: Corporate Function");
    expect(message.text).toContain("Event date: 2026-09-12");
    expect(message.text).toContain("Event location: Centurion");
    expect(message.text).toContain("Estimated guest count: 80");
    expect(message.html).toContain("Hospitality service type");
  });
});

describe("POST /api/leads notifications", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env = { ...OLD_ENV };
    process.env.PRISMA_POSTGRES_DATABASE_URL = "postgresql://placeholder.example/db";
    setCompleteSmtpEnv();
    vi.mocked(prisma.lead.create).mockResolvedValue({
      id: 101,
      name: "Jane Customer",
      email: "jane.customer@example.com",
      phone: "+27110000000",
      intent: "Request a quote",
      serviceArea: "Software Development and Digital Services",
      hospitalityServiceType: null,
      eventDate: null,
      eventLocation: null,
      estimatedGuestCount: null,
      message: "Please help with a portal build.",
      createdAt: new Date("2026-07-26T08:30:00.000Z"),
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
      sourcePath: "/contact",
    });
    sendMail.mockResolvedValue({ accepted: ["info@sikhwarigroup.co.za"] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses fixed subject and recipient with customer email only as Reply-To", async () => {
    const response = await POST(postRequest(validPayload()));

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ ok: true });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: {
          name: "Sikhwari Group Website",
          address: "info@sikhwarigroup.co.za",
        },
        to: "info@sikhwarigroup.co.za",
        replyTo: "jane.customer@example.com",
        subject: "New Sikhwari Group website enquiry",
      })
    );
    expect(sendMail.mock.calls[0][0].subject).not.toContain("Jane Customer");
    expect(sendMail.mock.calls[0][0].to).not.toContain("jane.customer@example.com");
  });

  it("sends mail after successful database insert", async () => {
    await POST(postRequest(validPayload()));

    expect(prisma.lead.create).toHaveBeenCalledOnce();
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: "smtp.example.test",
      port: 465,
      secure: true,
      auth: {
        user: "mailer@example.test",
        pass: "test-password",
      },
    });
    expect(sendMail).toHaveBeenCalledOnce();
  });

  it("persists and notifies hospitality-specific fields for hospitality leads", async () => {
    const response = await POST(
      postRequest(
        validPayload({
          serviceArea: "Culinary and Hospitality Services",
          hospitalityServiceType: "Catering",
          eventDate: "2026-09-12",
          eventLocation: "Johannesburg",
          estimatedGuestCount: "45",
          message: "Please help with catering.",
        })
      )
    );

    expect(response.status).toBe(200);
    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          serviceArea: "Culinary and Hospitality Services",
          hospitalityServiceType: "Catering",
          eventDate: new Date("2026-09-12T00:00:00.000Z"),
          eventLocation: "Johannesburg",
          estimatedGuestCount: 45,
        }),
      })
    );
    expect(sendMail).toHaveBeenCalledOnce();
  });

  it("normalises stale hospitality fields for non-hospitality leads", async () => {
    const response = await POST(
      postRequest(
        validPayload({
          serviceArea: "Software Development and Digital Services",
          hospitalityServiceType: "Catering",
          eventDate: "2026-09-12",
          eventLocation: "Johannesburg",
          estimatedGuestCount: "45",
        })
      )
    );

    expect(response.status).toBe(200);
    expect(prisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          serviceArea: "Software Development and Digital Services",
          hospitalityServiceType: null,
          eventDate: null,
          eventLocation: null,
          estimatedGuestCount: null,
        }),
      })
    );
  });

  it("rejects invalid hospitality fields", async () => {
    const response = await POST(
      postRequest(
        validPayload({
          serviceArea: "Culinary and Hospitality Services",
          hospitalityServiceType: "Unsupported",
          eventDate: "not-a-date",
          estimatedGuestCount: "-5",
        })
      )
    );

    expect(response.status).toBe(400);
    expect(prisma.lead.create).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("logs safe accepted and rejected counts after sendMail completes", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    sendMail.mockResolvedValue({
      accepted: ["info@sikhwarigroup.co.za"],
      rejected: [],
      pending: ["queued"],
      messageId: "do-not-log-complete-message-id",
      response: "250 2.0.0 Ok: queued as do-not-log",
    });

    const response = await POST(postRequest(validPayload()));

    expect(response.status).toBe(200);
    expect(infoSpy).toHaveBeenCalledWith({
      event: "lead_notification_send_result",
      acceptedCount: 1,
      rejectedCount: 0,
      pendingCount: 1,
      messageIdPresent: true,
      responseCode: 250,
      notificationConfigured: true,
    });

    const logs = stringifyLogCalls(infoSpy);
    expect(logs).not.toContain("Jane Customer");
    expect(logs).not.toContain("jane.customer@example.com");
    expect(logs).not.toContain("+27110000000");
    expect(logs).not.toContain("Customer Holdings");
    expect(logs).not.toContain("Please help with a portal build.");
    expect(logs).not.toContain("info@sikhwarigroup.co.za");
    expect(logs).not.toContain("do-not-log-complete-message-id");
    expect(logs).not.toContain("do-not-log");
    expect(logs).not.toContain("test-password");
  });

  it("keeps a successful API response when SMTP delivery fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const smtpError = Object.assign(new Error("contains customer jane.customer@example.com"), {
      code: "EAUTH",
      command: "AUTH PLAIN",
      responseCode: 535,
    });
    sendMail.mockRejectedValue(smtpError);

    const response = await POST(postRequest(validPayload()));

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ ok: true });
    expect(errorSpy).toHaveBeenCalledWith({
      event: "lead_notification_send_failure",
      code: "EAUTH",
      command: "AUTH PLAIN",
      responseCode: 535,
      errorName: "Error",
      notificationConfigured: true,
    });

    const logs = stringifyLogCalls(errorSpy);
    expect(logs).not.toContain("contains customer");
    expect(logs).not.toContain("jane.customer@example.com");
    expect(logs).not.toContain("test-password");
  });

  it("safely disables notification and logs missing variable names only", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    delete process.env.SMTP_PASSWORD;
    delete process.env.SMTP_HOST;

    const response = await POST(postRequest(validPayload()));

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ ok: true });
    expect(sendMail).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith({
      event: "lead_notification_disabled",
      missingEnv: ["SMTP_HOST", "SMTP_PASSWORD"],
      notificationConfigured: false,
    });

    const logs = stringifyLogCalls(warnSpy);
    expect(logs).toContain("SMTP_HOST");
    expect(logs).toContain("SMTP_PASSWORD");
    expect(logs).not.toContain("smtp.example.test");
    expect(logs).not.toContain("test-password");
    expect(logs).not.toContain("jane.customer@example.com");
  });

  it("returns 400 and sends no email for invalid lead input", async () => {
    const response = await POST(postRequest(validPayload({ name: "", email: "not-an-email" })));

    expect(response.status).toBe(400);
    expect(prisma.lead.create).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("sends no email when database persistence fails", async () => {
    vi.mocked(prisma.lead.create).mockRejectedValue(new Error("database unavailable"));

    await expect(POST(postRequest(validPayload()))).rejects.toThrow("database unavailable");
    expect(sendMail).not.toHaveBeenCalled();
  });
});
