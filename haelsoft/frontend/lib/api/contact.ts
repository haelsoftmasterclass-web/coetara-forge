/** Browser-side submission of the contact form to Django. */
import { apiBaseUrl } from "./config";
import type { EnquiryPayload } from "./types";

export type SubmitResult =
  | { ok: true; message: string }
  | { ok: false; kind: "validation"; fieldErrors: Record<string, string> }
  | { ok: false; kind: "rate_limited" | "network" | "server" };

export async function submitEnquiry(payload: EnquiryPayload, fetchImpl: typeof fetch = fetch): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetchImpl(`${apiBaseUrl()}/api/v1/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, kind: "network" };
  }
  if (res.status === 201) {
    const body = (await res.json().catch(() => ({}))) as { detail?: string };
    return { ok: true, message: body.detail || "Your message has been received." };
  }
  if (res.status === 400) {
    const body = (await res.json().catch(() => ({}))) as Record<string, string[] | string>;
    const fieldErrors: Record<string, string> = {};
    for (const [field, messages] of Object.entries(body)) {
      fieldErrors[field] = Array.isArray(messages) ? messages.join(" ") : String(messages);
    }
    return { ok: false, kind: "validation", fieldErrors };
  }
  if (res.status === 429) return { ok: false, kind: "rate_limited" };
  return { ok: false, kind: "server" };
}
