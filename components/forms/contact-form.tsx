"use client";

import { FormEvent, useMemo, useState } from "react";

type ContactValues = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

const INITIAL_VALUES: ContactValues = {
  fullName: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

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

  if (!values.message.trim()) {
    errors.message = "Please add a short message.";
  } else if (values.message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (values.message.length > 1200) {
    errors.message = "Message must be 1200 characters or fewer.";
  }

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const errors = useMemo(() => validate(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      message: true,
      website: true,
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
          message: values.message,
          website: values.website,
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
      setValues(INITIAL_VALUES);
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
        Use this form for business enquiries and consultation requests only. Trading solicitations
        are not accepted.
      </p>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Full name *</span>
        <input
          className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
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
          <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Email address *</span>
        <input
          className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
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
          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Phone (optional)</span>
        <input
          className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
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
          <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
        ) : null}
      </label>

      <label className="hidden" aria-hidden="true">
        <span className="mb-1 block text-sm font-medium text-slate-700">Website</span>
        <input
          autoComplete="off"
          name="website"
          tabIndex={-1}
          type="text"
          value={values.website}
          onChange={(event) => {
            setValues((current) => ({ ...current, website: event.target.value }));
          }}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Message *</span>
        <textarea
          className="min-h-32 w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
          name="message"
          maxLength={1200}
          value={values.message}
          onBlur={() => setTouched((current) => ({ ...current, message: true }))}
          onChange={(event) => {
            setStatus("idle");
            setValues((current) => ({ ...current, message: event.target.value }));
          }}
        />
        {touched.message && errors.message ? (
          <p className="mt-1 text-xs text-red-600">{errors.message}</p>
        ) : null}
      </label>

      <button
        className="rounded-[var(--radius-sm)] bg-[var(--color-brand-700)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-600)]"
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? "Submitting..." : "Book consultation"}
      </button>

      {status === "success" ? (
        <p className="rounded-[var(--radius-sm)] bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Thank you. Your consultation request has been received and our team will follow up
          shortly.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="rounded-[var(--radius-sm)] bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}
    </form>
  );
}
