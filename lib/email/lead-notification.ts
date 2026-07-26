import "server-only";

import nodemailer from "nodemailer";

const SUBJECT = "New Sikhwari Group website enquiry";
const FROM_NAME = "Sikhwari Group Website";

type LeadNotification = {
  leadId: number;
  submittedAt: Date;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  intent: string;
  serviceArea: string | null;
  message: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
  to: string;
};

type SmtpDiagnosticError = {
  code?: unknown;
  command?: unknown;
  responseCode?: unknown;
  name?: unknown;
};

function envValue(name: string) {
  return (process.env[name] ?? "").trim();
}

function hasHeaderUnsafeCharacters(value: string) {
  return /[\r\n]/.test(value);
}

function isEmailAddress(value: string) {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

function parseBoolean(value: string) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return null;
}

function getRequiredEnv(name: string, missingEnv: string[]) {
  const value = envValue(name);

  if (!value) {
    missingEnv.push(name);
  }

  return value;
}

function getSmtpConfig(): { config: SmtpConfig | null; missingEnv: string[] } {
  const missingEnv: string[] = [];
  const host = getRequiredEnv("SMTP_HOST", missingEnv);
  const portRaw = getRequiredEnv("SMTP_PORT", missingEnv);
  const secureRaw = getRequiredEnv("SMTP_SECURE", missingEnv).toLowerCase();
  const user = getRequiredEnv("SMTP_USER", missingEnv);
  const password = getRequiredEnv("SMTP_PASSWORD", missingEnv);
  const from = getRequiredEnv("LEAD_NOTIFICATION_FROM", missingEnv);
  const to = getRequiredEnv("LEAD_NOTIFICATION_TO", missingEnv);
  const port = Number(portRaw);
  const secure = parseBoolean(secureRaw);
  const headerValues = [host, user, from, to];

  if (
    missingEnv.length > 0 ||
    !host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    secure === null ||
    !user ||
    !password ||
    !from ||
    !to ||
    headerValues.some(hasHeaderUnsafeCharacters) ||
    !isEmailAddress(from) ||
    !isEmailAddress(to)
  ) {
    return { config: null, missingEnv };
  }

  return { config: { host, port, secure, user, password, from, to }, missingEnv };
}

function countValues(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

function safeString(value: unknown) {
  return typeof value === "string" && value ? value : undefined;
}

function safeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getResponseCode(info: unknown) {
  if (typeof info !== "object" || info === null || !("response" in info)) {
    return undefined;
  }

  const response = (info as { response?: unknown }).response;
  if (typeof response !== "string") {
    return undefined;
  }

  const match = response.match(/^(\d{3})\b/);
  return match ? Number(match[1]) : undefined;
}

function logSendResult(info: unknown) {
  const result = typeof info === "object" && info !== null ? (info as Record<string, unknown>) : {};
  const logPayload: Record<string, unknown> = {
    event: "lead_notification_send_result",
    acceptedCount: countValues(result.accepted),
    rejectedCount: countValues(result.rejected),
    messageIdPresent: typeof result.messageId === "string" && result.messageId.length > 0,
    notificationConfigured: true,
  };
  const responseCode = getResponseCode(result);

  if (Array.isArray(result.pending)) {
    logPayload.pendingCount = countValues(result.pending);
  }

  if (responseCode) {
    logPayload.responseCode = responseCode;
  }

  console.info(logPayload);
}

function logSendFailure(error: unknown) {
  const diagnostic = error as SmtpDiagnosticError;

  console.error({
    event: "lead_notification_send_failure",
    code: safeString(diagnostic.code),
    command: safeString(diagnostic.command),
    responseCode: safeNumber(diagnostic.responseCode),
    errorName: safeString(diagnostic.name),
    notificationConfigured: true,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function line(label: string, value: string | number) {
  return `${label}: ${value}`;
}

export function buildLeadNotificationMessage(lead: LeadNotification) {
  const submittedAt = lead.submittedAt.toISOString();
  const textLines = [
    line("Lead reference ID", lead.leadId),
    line("Submitted at", submittedAt),
    line("Customer name", lead.name),
    line("Customer email", lead.email),
  ];

  if (lead.phone) {
    textLines.push(line("Customer phone", lead.phone));
  }

  if (lead.company) {
    textLines.push(line("Company", lead.company));
  }

  textLines.push(line("Enquiry type", lead.intent));

  if (lead.serviceArea) {
    textLines.push(line("Service area", lead.serviceArea));
  }

  textLines.push(
    "",
    "Customer message:",
    lead.message,
    "",
    "This enquiry has been saved in the website database."
  );

  const htmlRows = [
    ["Lead reference ID", String(lead.leadId)],
    ["Submitted at", submittedAt],
    ["Customer name", lead.name],
    ["Customer email", lead.email],
    ...(lead.phone ? [["Customer phone", lead.phone]] : []),
    ...(lead.company ? [["Company", lead.company]] : []),
    ["Enquiry type", lead.intent],
    ...(lead.serviceArea ? [["Service area", lead.serviceArea]] : []),
  ]
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join("");

  const html = [
    htmlRows,
    "<p><strong>Customer message:</strong></p>",
    `<p>${escapeHtml(lead.message).replaceAll("\n", "<br>")}</p>`,
    "<p>This enquiry has been saved in the website database.</p>",
  ].join("");

  return {
    subject: SUBJECT,
    text: textLines.join("\n"),
    html,
  };
}

export async function sendLeadNotification(lead: LeadNotification) {
  const { config, missingEnv } = getSmtpConfig();

  if (!config) {
    console.warn({
      event: "lead_notification_disabled",
      missingEnv,
      notificationConfigured: false,
    });
    return;
  }

  const message = buildLeadNotificationMessage(lead);
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  try {
    const info = await transport.sendMail({
      from: {
        name: FROM_NAME,
        address: config.from,
      },
      to: config.to,
      replyTo: lead.email,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    logSendResult(info);
  } catch (error) {
    logSendFailure(error);
  }
}
