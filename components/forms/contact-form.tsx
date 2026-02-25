"use client";

import { FormEvent, useMemo, useState } from "react";

const INTENT_OPTIONS = ["Request a quote", "Book consultation", "General enquiry"] as const;

const SERVICE_AREA_OPTIONS = [
  "Not sure",
  "Telecommunications, ICT, and Network Services",
  "Cybersecurity Services",
  "Culinary and Hospitality Services",
  "Software Development and Digital Services",
] as const;

type ContactIntent = (typeof INTENT_OPTIONS)[number];

type ContactValues = {
  fullName: string;
  email: string;
  phone: string;
  intent: ContactIntent;
  serviceArea: string;
  message: string;
  companyWebsite: string;
};

type ContactFormProps = {
  initialIntent: ContactIntent;
};

function createInitialValues(initialIntent: ContactIntent): ContactValues {
  return {
    fullName: "",
    email: "",
    phone: "",
    intent: initialIntent,
    serviceArea: "Not sure",
    message: "",
    companyWebsite: "",
  };
}

function toIntent(value: string): ContactIntent {
  if (INTENT_OPTIONS.includes(value as ContactIntent)) {
    return value as ContactIntent;
  }

  return "General enquiry";
}

function validate(values: ContactValues) {
  const errors: Partial<Record<keyof ContactValues, string>> = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (values.fullName.length > 80) {
    errors.fullName = "Full name must be 80 characters or fewer.";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  } else if (values.email.length > 120) {
    errors.email = "Email must be 120 characters or fewer.";
  }

  if (values.phone.trim()) {
    if (values.phone.length > 30) {
      errors.phone = "Phone number must be 30 characters or fewer.";
    } else if (!/^[0-9+\-()\s]{7,30}$/.test(values.phone)) {
      errors.phone = "Enter a valid phone number.";
    }
  }

  if (!INTENT_OPTIONS.includes(values.intent)) {
    errors.intent = "Please select a reason.";
  }

  if (values.serviceArea.trim().length > 80) {
    errors.serviceArea = "Service area must be 80 characters or fewer.";
  }

  if (!values.message.trim()) {
    errors.message = "Please add a short message.";
  } else if (values.message.length > 2000) {
    errors.message = "Message must be 2000 characters or fewer.";
  }

  return errors;
}

export function ContactForm({ initialIntent }: ContactFormProps) {
  const [values, setValues] = useState<ContactValues>(() => createInitialValues(initialIntent));
  const [formStartedAt] = useState(() => Date.now());
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const errors = useMemo(() => validate(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

  const fullNameErrorId = "contact-fullName-error";
  const emailErrorId = "contact-email-error";
  const phoneErrorId = "contact-phone-error";
  const intentErrorId = "contact-intent-error";
  const serviceAreaErrorId = "contact-serviceArea-error";
  const messageErrorId = "contact-message-error";
  const statusMessageId = "contact-form-status";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      intent: true,
      serviceArea: true,
      message: true,
      companyWebsite: true,
    });

    if (hasErrors) {
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          intent: values.intent,
          serviceArea: values.serviceArea === "Not sure" ? "" : values.serviceArea,
          message: values.message,
          companyWebsite: values.companyWebsite,
          formStartedAt,
          sourcePath: window.location.pathname,
        }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setStatus("error");
        setSubmitError(data?.error || "We could not submit your enquiry. Please try again.");
        return;
      }

      setStatus("success");
      setValues(createInitialValues(initialIntent));
      setTouched({});
    } catch {
      setStatus("error");
      setSubmitError("We could not submit your enquiry. Please try again.");
    }
  }

  return (
    <form
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]"
      onSubmit={handleSubmit}
      noValidate
    >
      <p className="text-sm text-slate-600">
        Use this form for business enquiries and consultation requests only.
      </p>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Full name *</span>
        <input
          aria-describedby={touched.fullName && errors.fullName ? fullNameErrorId : undefined}
          aria-invalid={touched.fullName && errors.fullName ? "true" : undefined}
          className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
          id="contact-fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          maxLength={80}
          value={values.fullName}
          onBlur={() => setTouched((current) => ({ ...current, fullName: true }))}
          onChange={(event) => {
            setStatus("idle");
            setValues((current) => ({ ...current, fullName: event.target.value }));
          }}
        />
        {touched.fullName && errors.fullName ? (
          <p className="mt-1 text-xs text-red-600" id={fullNameErrorId}>
            {errors.fullName}
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Email address *</span>
        <input
          aria-describedby={touched.email && errors.email ? emailErrorId : undefined}
          aria-invalid={touched.email && errors.email ? "true" : undefined}
          className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={120}
          value={values.email}
          onBlur={() => setTouched((current) => ({ ...current, email: true }))}
          onChange={(event) => {
            setStatus("idle");
            setValues((current) => ({ ...current, email: event.target.value }));
          }}
        />
        {touched.email && errors.email ? (
          <p className="mt-1 text-xs text-red-600" id={emailErrorId}>
            {errors.email}
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Phone (optional)</span>
        <input
          aria-describedby={touched.phone && errors.phone ? phoneErrorId : undefined}
          aria-invalid={touched.phone && errors.phone ? "true" : undefined}
          className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={30}
          value={values.phone}
          onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
          onChange={(event) => {
            setStatus("idle");
            setValues((current) => ({ ...current, phone: event.target.value }));
          }}
        />
        {touched.phone && errors.phone ? (
          <p className="mt-1 text-xs text-red-600" id={phoneErrorId}>
            {errors.phone}
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Reason *</span>
        <select
          aria-describedby={touched.intent && errors.intent ? intentErrorId : undefined}
          aria-invalid={touched.intent && errors.intent ? "true" : undefined}
          className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
          id="contact-intent"
          name="intent"
          value={values.intent}
          onBlur={() => setTouched((current) => ({ ...current, intent: true }))}
          onChange={(event) => {
            setStatus("idle");
            setValues((current) => ({ ...current, intent: toIntent(event.target.value) }));
          }}
        >
          {INTENT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {touched.intent && errors.intent ? (
          <p className="mt-1 text-xs text-red-600" id={intentErrorId}>
            {errors.intent}
          </p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Service area (optional)
        </span>
        <select
          aria-describedby={
            touched.serviceArea && errors.serviceArea ? serviceAreaErrorId : undefined
          }
          aria-invalid={touched.serviceArea && errors.serviceArea ? "true" : undefined}
          className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
          id="contact-serviceArea"
          name="serviceArea"
          value={values.serviceArea}
          onBlur={() => setTouched((current) => ({ ...current, serviceArea: true }))}
          onChange={(event) => {
            setStatus("idle");
            setValues((current) => ({ ...current, serviceArea: event.target.value }));
          }}
        >
          {SERVICE_AREA_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {touched.serviceArea && errors.serviceArea ? (
          <p className="mt-1 text-xs text-red-600" id={serviceAreaErrorId}>
            {errors.serviceArea}
          </p>
        ) : null}
      </label>

      <label className="hidden" aria-hidden="true">
        <span className="mb-1 block text-sm font-medium text-slate-700">Website</span>
        <input
          autoComplete="off"
          name="companyWebsite"
          tabIndex={-1}
          type="text"
          value={values.companyWebsite}
          onChange={(event) => {
            setValues((current) => ({ ...current, companyWebsite: event.target.value }));
          }}
        />
      </label>
      <input name="formStartedAt" type="hidden" value={String(formStartedAt)} />

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Message *</span>
        <textarea
          aria-describedby={touched.message && errors.message ? messageErrorId : undefined}
          aria-invalid={touched.message && errors.message ? "true" : undefined}
          className="min-h-32 w-full resize-none rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
          id="contact-message"
          name="message"
          maxLength={2000}
          value={values.message}
          onBlur={() => setTouched((current) => ({ ...current, message: true }))}
          onChange={(event) => {
            setStatus("idle");
            setValues((current) => ({ ...current, message: event.target.value }));
          }}
        />
        <p className="mt-1 text-right text-xs text-slate-500">{values.message.length} / 2000</p>
        {touched.message && errors.message ? (
          <p className="mt-1 text-xs text-red-600" id={messageErrorId}>
            {errors.message}
          </p>
        ) : null}
      </label>

      <button
        className="rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]"
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? "Submitting…" : "Submit"}
      </button>

      {status === "success" ? (
        <p
          aria-live="polite"
          className="rounded-[var(--radius-sm)] bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
          id={statusMessageId}
        >
          Thank you. Your consultation request has been received and our team will follow up
          shortly.
        </p>
      ) : null}

      {status === "error" ? (
        <p
          aria-live="polite"
          className="rounded-[var(--radius-sm)] bg-red-50 px-3 py-2 text-sm text-red-700"
          id={statusMessageId}
        >
          {submitError}
        </p>
      ) : null}
    </form>
  );
}
