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

function getSmtpConfig(): SmtpConfig | null {
  const host = envValue("SMTP_HOST");
  const portRaw = envValue("SMTP_PORT");
  const secureRaw = envValue("SMTP_SECURE").toLowerCase();
  const user = envValue("SMTP_USER");
  const password = envValue("SMTP_PASSWORD");
  const from = envValue("LEAD_NOTIFICATION_FROM");
  const to = envValue("LEAD_NOTIFICATION_TO");
  const port = Number(portRaw);
  const secure = parseBoolean(secureRaw);
  const headerValues = [host, user, from, to];

  if (
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
    return null;
  }

  return { host, port, secure, user, password, from, to };
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
  const config = getSmtpConfig();

  if (!config) {
    console.warn("Lead notification disabled: SMTP configuration incomplete or invalid.");
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
    await transport.sendMail({
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
  } catch {
    console.error("Lead notification failed after successful persistence.");
  }
}
