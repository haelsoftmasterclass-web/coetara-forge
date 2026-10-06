import { Select, TextArea, TextField } from "./Field";
import { routes } from "@/lib/site";

export const enquiryRoles = ["Founder / Builder", "University / Research Institution", "Corporate", "Investor", "Mentor / Operator", "Other"];

/**
 * The Forge enquiry form. Posts to /api/contact (Netlify Function → Supabase + Resend),
 * with Netlify Forms as the fallback; forge.js handles validation and submission.
 * Landing pages preset the role and topic so the team knows where an enquiry came from.
 */
export default function EnquiryForm({
  idPrefix = "contact",
  role,
  topic,
  messageLabel = "Message",
  submitLabel = "Send Enquiry",
  track,
}: {
  idPrefix?: string;
  role?: string;
  topic?: string;
  messageLabel?: string;
  submitLabel?: string;
  /** dataLayer event pushed when the submit button is clicked */
  track?: string;
}) {
  return (
    <>
      <form name="contact" method="POST" action="/api/contact" data-api="/api/contact" data-netlify="true" netlify-honeypot="company_website" data-contact-form noValidate className="grid gap-5">
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden"><label>Leave this empty <input name="company_website" tabIndex={-1} autoComplete="off" /></label></p>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id={`${idPrefix}-name`} name="name" label="Name" required autoComplete="name" />
          <TextField id={`${idPrefix}-org`} name="organisation" label="Organisation" autoComplete="organization" />
          <TextField id={`${idPrefix}-email`} name="email" label="Email" type="email" required autoComplete="email" />
          <TextField id={`${idPrefix}-phone`} name="phone" label="Phone" type="tel" autoComplete="tel" />
        </div>
        <Select id={`${idPrefix}-role`} name="role" label="I am a" required options={enquiryRoles} defaultValue={role} />
        <TextField id={`${idPrefix}-topic`} name="topic" label="What would you like to discuss?" required defaultValue={topic} />
        <TextArea id={`${idPrefix}-message`} name="message" label={messageLabel} required rows={6} />
        <p className="text-[13px] text-muted">By sending this form you agree that Coetara Forge may use these details to respond to your enquiry. See the <a href={routes.privacy} className="underline">privacy policy</a>.</p>
        <div>
          <button type="submit" className="btn btn-primary" data-track={track}>{submitLabel}</button>
        </div>
      </form>
      <div data-form-done hidden tabIndex={-1} className="py-8 outline-none">
        <h3 className="display text-[34px]">Thank you.</h3>
        <p className="lede mt-3">Your enquiry has been sent. A member of the Forge team will reply by email.</p>
      </div>
      <p data-form-fail hidden className="mt-6 rounded-xl border border-ember/30 bg-[#fff1ee] p-4 text-[15px] text-ember-deep" role="alert">
        <span data-form-fail-detail className="block font-semibold" /> Your enquiry could not be sent. Check your connection and try again.
      </p>
    </>
  );
}
