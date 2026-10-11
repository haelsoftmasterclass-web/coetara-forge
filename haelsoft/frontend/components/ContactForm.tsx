"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { submitEnquiry } from "@/lib/api/contact";
import type { EnquiryPayload } from "@/lib/api/types";
import { OTHER_AFRICAN_COUNTRIES, OTHER_COUNTRY, PRIORITY_COUNTRIES } from "@/lib/countries";
import { routes } from "@/lib/site";
import { ENQUIRY_TYPES, validateEnquiry, type EnquiryErrors } from "@/lib/validation";
import { Check } from "./Icons";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_ORDER: (keyof EnquiryPayload)[] = ["enquiry_type", "name", "email", "phone", "country", "subject", "message", "consent"];

const FAILURE_COPY = {
  rate_limited: "You've sent several messages in a short time. Please wait a while and try again.",
  network: "We couldn't reach our server, so your message was not sent. Check your connection and try again.",
  server: "Something went wrong on our side and your message was not sent. Please try again shortly.",
} as const;

function RequiredMark({ required }: { required: boolean }) {
  return required ? (
    <span className="text-danger" aria-hidden="true"> *</span>
  ) : (
    <span className="font-normal text-faint"> (optional)</span>
  );
}

export default function ContactForm({
  initialType = "general",
  initialSubject = "",
}: {
  initialType?: EnquiryPayload["enquiry_type"];
  initialSubject?: string;
}) {
  const [values, setValues] = useState<EnquiryPayload>({
    enquiry_type: initialType,
    name: "",
    email: "",
    phone: "",
    country: "",
    subject: initialSubject,
    message: "",
    consent: false,
    source_page: routes.contact,
    company_website: "",
  });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  function update<K extends keyof EnquiryPayload>(key: K, value: EnquiryPayload[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function showErrors(next: EnquiryErrors) {
    setErrors(next);
    setStatus("error");
    setFailure("");
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    const clientErrors = validateEnquiry(values);
    if (Object.keys(clientErrors).length) {
      showErrors(clientErrors);
      return;
    }
    setStatus("submitting");
    setFailure("");
    const result = await submitEnquiry(values);
    if (result.ok) {
      setSuccessMessage(result.message);
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
      return;
    }
    if (result.kind === "validation") {
      const known: EnquiryErrors = {};
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        if (FIELD_ORDER.includes(field as keyof EnquiryPayload)) known[field as keyof EnquiryPayload] = message;
      }
      if (Object.keys(known).length) {
        showErrors(known);
        return;
      }
      setFailure(FAILURE_COPY.server);
    } else {
      setFailure(FAILURE_COPY[result.kind]);
    }
    setStatus("error");
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  if (status === "success") {
    return (
      <div className="card p-8 md:p-10" role="status">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f5ec] text-success">
          <Check className="h-6 w-6" />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="heading mt-6 text-[28px] outline-none">
          Message received
        </h2>
        <p className="mt-3 text-[17px] text-muted">{successMessage}</p>
        <button
          type="button"
          className="btn btn-secondary mt-8"
          onClick={() => {
            setValues((v) => ({ ...v, subject: "", message: "", consent: false }));
            setStatus("idle");
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const errorList = FIELD_ORDER.filter((key) => errors[key]);
  const describedBy = (key: keyof EnquiryPayload, hint?: boolean) =>
    [hint ? `${key}-hint` : null, errors[key] ? `${key}-error` : null].filter(Boolean).join(" ") || undefined;

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-6" aria-describedby="form-required-note">
      <p id="form-required-note" className="text-[14px] text-muted">
        Fields marked <span className="text-danger">*</span> are required.
      </p>

      {status === "error" && (errorList.length || failure) ? (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-[var(--radius-control)] border border-[#f3c3bd] bg-[#fff6f5] p-5 outline-none">
          {failure ? (
            <p className="font-semibold text-danger">{failure}</p>
          ) : (
            <>
              <p className="font-semibold text-danger">Please fix {errorList.length === 1 ? "this problem" : `these ${errorList.length} problems`}:</p>
              <ul className="mt-2 list-disc pl-5 text-[15px]">
                {errorList.map((key) => (
                  <li key={key}>
                    <a href={`#field-${key}`} className="underline underline-offset-2">{errors[key]}</a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="field-enquiry_type">What is your enquiry about?<RequiredMark required /></label>
        <select
          id="field-enquiry_type"
          className="input"
          value={values.enquiry_type}
          onChange={(e) => update("enquiry_type", e.target.value as EnquiryPayload["enquiry_type"])}
          aria-invalid={Boolean(errors.enquiry_type)}
          aria-describedby={describedBy("enquiry_type")}
          required
        >
          {ENQUIRY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {errors.enquiry_type ? <p id="enquiry_type-error" className="error-msg">{errors.enquiry_type}</p> : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="field-name">Full name<RequiredMark required /></label>
          <input id="field-name" className="input" type="text" autoComplete="name" value={values.name} onChange={(e) => update("name", e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} maxLength={120} required />
          {errors.name ? <p id="name-error" className="error-msg">{errors.name}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="field-email">Email address<RequiredMark required /></label>
          <input id="field-email" className="input" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={(e) => update("email", e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} maxLength={254} required />
          {errors.email ? <p id="email-error" className="error-msg">{errors.email}</p> : null}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="field-phone">Phone number<RequiredMark required={false} /></label>
          <input id="field-phone" className="input" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone", true)} maxLength={30} />
          <p id="phone-hint" className="hint">Include your country code, for example +234.</p>
          {errors.phone ? <p id="phone-error" className="error-msg">{errors.phone}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="field-country">Country<RequiredMark required /></label>
          <select id="field-country" className="input" autoComplete="country-name" value={values.country} onChange={(e) => update("country", e.target.value)} aria-invalid={Boolean(errors.country)} aria-describedby={describedBy("country")} required>
            <option value="" disabled>Select your country</option>
            <optgroup label="Our initial markets">
              {PRIORITY_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
            <optgroup label="Other African countries">
              {OTHER_AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </optgroup>
            <option value={OTHER_COUNTRY}>{OTHER_COUNTRY}</option>
          </select>
          {errors.country ? <p id="country-error" className="error-msg">{errors.country}</p> : null}
        </div>
      </div>

      <div className="field">
        <label htmlFor="field-subject">Subject<RequiredMark required /></label>
        <input id="field-subject" className="input" type="text" value={values.subject} onChange={(e) => update("subject", e.target.value)} aria-invalid={Boolean(errors.subject)} aria-describedby={describedBy("subject")} maxLength={160} required />
        {errors.subject ? <p id="subject-error" className="error-msg">{errors.subject}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="field-message">Message<RequiredMark required /></label>
        <textarea id="field-message" className="input" rows={6} value={values.message} onChange={(e) => update("message", e.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={describedBy("message", true)} maxLength={5000} required />
        <p id="message-hint" className="hint">Please don&apos;t include passwords, ID numbers or payment details.</p>
        {errors.message ? <p id="message-error" className="error-msg">{errors.message}</p> : null}
      </div>

      {/* Honeypot: hidden from people and assistive technology; bots that fill it are discarded. */}
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="field-company_website">Company website</label>
        <input id="field-company_website" type="text" tabIndex={-1} autoComplete="off" value={values.company_website} onChange={(e) => update("company_website", e.target.value)} />
      </div>

      <div className="field">
        <div className="flex items-start gap-3">
          <input
            id="field-consent"
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 accent-[#b83a00]"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent")}
            required
          />
          <label htmlFor="field-consent" className="!font-normal text-[15px] leading-relaxed text-ink-2">
            I agree that Haelsoft may use these details to respond to my enquiry, as described in the{" "}
            <Link href={routes.privacy} className="font-semibold underline underline-offset-2">privacy notice</Link>.
            <RequiredMark required />
          </label>
        </div>
        {errors.consent ? <p id="consent-error" className="error-msg">{errors.consent}</p> : null}
      </div>

      <div>
        <button type="submit" className="btn btn-primary" disabled={status === "submitting"} aria-disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
        <p className="sr-only" aria-live="polite">{status === "submitting" ? "Sending your message" : ""}</p>
      </div>
    </form>
  );
}
