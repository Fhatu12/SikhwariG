"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ContactIntent,
  HOSPITALITY_SERVICE_TYPE_OPTIONS,
  INTENT_OPTIONS,
  SERVICE_AREA_OPTIONS,
  isContactIntent,
  isHospitalityServiceArea,
  isHospitalityServiceType,
  isServiceAreaOption,
} from "@/lib/lead-options";

type ContactValues = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  intent: ContactIntent;
  serviceArea: string;
  hospitalityServiceType: string;
  eventDate: string;
  eventLocation: string;
  estimatedGuestCount: string;
  message: string;
  companyWebsite: string;
};

type ContactFormProps = {
  initialIntent: ContactIntent;
  initialServiceArea?: string;
};

function createInitialValues(
  initialIntent: ContactIntent,
  initialServiceArea = "Not sure"
): ContactValues {
  return {
    fullName: "",
    email: "",
    phone: "",
    company: "",
    intent: initialIntent,
    serviceArea: toServiceArea(initialServiceArea),
    hospitalityServiceType: "",
    eventDate: "",
    eventLocation: "",
    estimatedGuestCount: "",
    message: "",
    companyWebsite: "",
  };
}

function toIntent(value: string): ContactIntent {
  if (isContactIntent(value)) {
    return value;
  }

  return "General enquiry";
}

function toServiceArea(value: string) {
  return isServiceAreaOption(value) ? value : "Not sure";
}

function validate(values: ContactValues) {
  const errors: Partial<Record<keyof ContactValues, string>> = {};
  const isHospitality = isHospitalityServiceArea(values.serviceArea);

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

  if (values.company.trim().length > 120) {
    errors.company = "Company must be 120 characters or fewer.";
  }

  if (!INTENT_OPTIONS.includes(values.intent)) {
    errors.intent = "Please select a reason.";
  }

  if (!isServiceAreaOption(values.serviceArea)) {
    errors.serviceArea = "Please select a valid service area.";
  }

  if (isHospitality) {
    if (!isHospitalityServiceType(values.hospitalityServiceType)) {
      errors.hospitalityServiceType = "Please select a hospitality service type.";
    }

    if (values.eventDate && Number.isNaN(Date.parse(values.eventDate))) {
      errors.eventDate = "Enter a valid event date.";
    }

    if (values.eventLocation.trim().length > 160) {
      errors.eventLocation = "Event location must be 160 characters or fewer.";
    }

    if (values.estimatedGuestCount.trim()) {
      const guestCount = Number(values.estimatedGuestCount);
      if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 100000) {
        errors.estimatedGuestCount = "Estimated guest count must be a positive number.";
      }
    }
  }

  if (!values.message.trim()) {
    errors.message = "Please add a short message.";
  } else if (values.message.length > 2000) {
    errors.message = "Message must be 2000 characters or fewer.";
  }

  return errors;
}

export function ContactForm({ initialIntent, initialServiceArea = "Not sure" }: ContactFormProps) {
  const [values, setValues] = useState<ContactValues>(() =>
    createInitialValues(initialIntent, initialServiceArea)
  );
  const [formStartedAt] = useState(() => Date.now());
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const errors = useMemo(() => validate(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;
  const isHospitality = isHospitalityServiceArea(values.serviceArea);
  const hasSavedHospitalityDetails =
    !isHospitality &&
    Boolean(
      values.hospitalityServiceType ||
      values.eventDate ||
      values.eventLocation ||
      values.estimatedGuestCount
    );

  const fullNameErrorId = "contact-fullName-error";
  const emailErrorId = "contact-email-error";
  const phoneErrorId = "contact-phone-error";
  const companyErrorId = "contact-company-error";
  const intentErrorId = "contact-intent-error";
  const serviceAreaErrorId = "contact-serviceArea-error";
  const hospitalityServiceTypeErrorId = "contact-hospitalityServiceType-error";
  const eventDateErrorId = "contact-eventDate-error";
  const eventLocationErrorId = "contact-eventLocation-error";
  const estimatedGuestCountErrorId = "contact-estimatedGuestCount-error";
  const messageErrorId = "contact-message-error";
  const statusMessageId = "contact-form-status";
  const hospitalityRevealId = "contact-hospitality-reveal";

  const errorSummary = Object.entries(errors)
    .filter(([, message]) => Boolean(message))
    .map(([field, message]) => ({ field, message }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      company: true,
      intent: true,
      serviceArea: true,
      hospitalityServiceType: true,
      eventDate: true,
      eventLocation: true,
      estimatedGuestCount: true,
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
          company: values.company,
          intent: values.intent,
          serviceArea: values.serviceArea,
          ...(isHospitality
            ? {
                hospitalityServiceType: values.hospitalityServiceType,
                eventDate: values.eventDate,
                eventLocation: values.eventLocation,
                estimatedGuestCount: values.estimatedGuestCount,
              }
            : {}),
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
      setValues(createInitialValues(initialIntent, initialServiceArea));
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
      {errorSummary.length > 0 && Object.values(touched).some(Boolean) ? (
        <div className="rounded-[var(--radius-sm)] bg-red-50 px-3 py-2 text-sm text-red-700">
          <p className="font-medium">Please check the highlighted fields.</p>
          <ul className="mt-1 list-disc pl-5">
            {errorSummary.map((error) => (
              <li key={error.field}>{error.message}</li>
            ))}
          </ul>
        </div>
      ) : null}
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
        <span className="mb-1 block text-sm font-medium text-slate-700">Company (optional)</span>
        <input
          aria-describedby={touched.company && errors.company ? companyErrorId : undefined}
          aria-invalid={touched.company && errors.company ? "true" : undefined}
          className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
          id="contact-company"
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={120}
          value={values.company}
          onBlur={() => setTouched((current) => ({ ...current, company: true }))}
          onChange={(event) => {
            setStatus("idle");
            setValues((current) => ({ ...current, company: event.target.value }));
          }}
        />
        {touched.company && errors.company ? (
          <p className="mt-1 text-xs text-red-600" id={companyErrorId}>
            {errors.company}
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
        <span className="mb-1 block text-sm font-medium text-slate-700">Service area *</span>
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
            setValues((current) => ({
              ...current,
              serviceArea: toServiceArea(event.target.value),
            }));
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

      <div aria-live="polite" className="sr-only" id={hospitalityRevealId}>
        {isHospitality ? "Hospitality enquiry fields are now available." : ""}
      </div>

      {isHospitality ? (
        <fieldset
          aria-describedby={hospitalityRevealId}
          className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          <legend className="text-sm font-semibold text-slate-900">Hospitality details</legend>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Service type *</span>
            <select
              aria-describedby={
                touched.hospitalityServiceType && errors.hospitalityServiceType
                  ? hospitalityServiceTypeErrorId
                  : undefined
              }
              aria-invalid={
                touched.hospitalityServiceType && errors.hospitalityServiceType ? "true" : undefined
              }
              className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
              id="contact-hospitalityServiceType"
              name="hospitalityServiceType"
              value={values.hospitalityServiceType}
              onBlur={() => setTouched((current) => ({ ...current, hospitalityServiceType: true }))}
              onChange={(event) => {
                setStatus("idle");
                setValues((current) => ({
                  ...current,
                  hospitalityServiceType: event.target.value,
                }));
              }}
            >
              <option value="">Select service type</option>
              {HOSPITALITY_SERVICE_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {touched.hospitalityServiceType && errors.hospitalityServiceType ? (
              <p className="mt-1 text-xs text-red-600" id={hospitalityServiceTypeErrorId}>
                {errors.hospitalityServiceType}
              </p>
            ) : null}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Event date (optional)
              </span>
              <input
                aria-describedby={
                  touched.eventDate && errors.eventDate ? eventDateErrorId : undefined
                }
                aria-invalid={touched.eventDate && errors.eventDate ? "true" : undefined}
                className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                id="contact-eventDate"
                name="eventDate"
                type="date"
                value={values.eventDate}
                onBlur={() => setTouched((current) => ({ ...current, eventDate: true }))}
                onChange={(event) => {
                  setStatus("idle");
                  setValues((current) => ({ ...current, eventDate: event.target.value }));
                }}
              />
              {touched.eventDate && errors.eventDate ? (
                <p className="mt-1 text-xs text-red-600" id={eventDateErrorId}>
                  {errors.eventDate}
                </p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Estimated guest count (optional)
              </span>
              <input
                aria-describedby={
                  touched.estimatedGuestCount && errors.estimatedGuestCount
                    ? estimatedGuestCountErrorId
                    : undefined
                }
                aria-invalid={
                  touched.estimatedGuestCount && errors.estimatedGuestCount ? "true" : undefined
                }
                className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
                id="contact-estimatedGuestCount"
                min={1}
                name="estimatedGuestCount"
                type="number"
                value={values.estimatedGuestCount}
                onBlur={() => setTouched((current) => ({ ...current, estimatedGuestCount: true }))}
                onChange={(event) => {
                  setStatus("idle");
                  setValues((current) => ({
                    ...current,
                    estimatedGuestCount: event.target.value,
                  }));
                }}
              />
              {touched.estimatedGuestCount && errors.estimatedGuestCount ? (
                <p className="mt-1 text-xs text-red-600" id={estimatedGuestCountErrorId}>
                  {errors.estimatedGuestCount}
                </p>
              ) : null}
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Event location (optional)
            </span>
            <input
              aria-describedby={
                touched.eventLocation && errors.eventLocation ? eventLocationErrorId : undefined
              }
              aria-invalid={touched.eventLocation && errors.eventLocation ? "true" : undefined}
              className="w-full rounded-[var(--radius-sm)] border border-slate-300 px-3 py-2 text-sm outline-none ring-[var(--color-brand-600)] transition focus:ring-2"
              id="contact-eventLocation"
              maxLength={160}
              name="eventLocation"
              type="text"
              value={values.eventLocation}
              onBlur={() => setTouched((current) => ({ ...current, eventLocation: true }))}
              onChange={(event) => {
                setStatus("idle");
                setValues((current) => ({ ...current, eventLocation: event.target.value }));
              }}
            />
            {touched.eventLocation && errors.eventLocation ? (
              <p className="mt-1 text-xs text-red-600" id={eventLocationErrorId}>
                {errors.eventLocation}
              </p>
            ) : null}
          </label>
        </fieldset>
      ) : null}

      {hasSavedHospitalityDetails ? (
        <p className="rounded-[var(--radius-sm)] bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Hospitality details are saved in this form but will not be submitted unless Culinary and
          Hospitality Services is selected.
        </p>
      ) : null}

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
        <span className="mb-1 block text-sm font-medium text-slate-700">
          {isHospitality ? "Requirements / message *" : "Message *"}
        </span>
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
