/** Client-side checks mirroring apps/contact/serializers.py. The server re-validates everything. */
import type { EnquiryPayload } from "./api/types";

export const ENQUIRY_TYPES: { value: EnquiryPayload["enquiry_type"]; label: string }[] = [
  { value: "general", label: "General enquiry" },
  { value: "learning", label: "Learning and courses" },
  { value: "instructor", label: "Teaching with Haelsoft" },
  { value: "partnership", label: "Partnerships" },
  { value: "corporate", label: "Corporate training" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;

export type EnquiryErrors = Partial<Record<keyof EnquiryPayload, string>>;

export function validateEnquiry(values: EnquiryPayload): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!ENQUIRY_TYPES.some((t) => t.value === values.enquiry_type)) errors.enquiry_type = "Choose what your enquiry is about.";
  if (values.name.trim().length < 2) errors.name = "Enter your full name.";
  if (!EMAIL_RE.test(values.email.trim())) errors.email = "Enter a valid email address, like name@example.com.";
  if (values.phone.trim() && !PHONE_RE.test(values.phone.trim()))
    errors.phone = "Enter a valid phone number, including the country code.";
  if (values.country.trim().length < 2) errors.country = "Choose your country.";
  if (values.subject.trim().length < 3) errors.subject = "Enter a subject (at least 3 characters).";
  if (values.message.trim().length < 20) errors.message = "Please tell us a little more (at least 20 characters).";
  if (!values.consent) errors.consent = "Please confirm you have read the privacy notice.";
  return errors;
}
