import { submitEnquiry } from "@/lib/api/contact";
import type { EnquiryPayload } from "@/lib/api/types";

const payload = { enquiry_type: "general", name: "A B", email: "a@b.co", phone: "", country: "Ghana", subject: "Hello", message: "x".repeat(25), consent: true, source_page: "/contact", company_website: "" } satisfies EnquiryPayload;

function respond(status: number, body: unknown) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));
}

describe("submitEnquiry", () => {
  it("reports success only on HTTP 201", async () => {
    expect(await submitEnquiry(payload, respond(201, { detail: "Received." }))).toEqual({ ok: true, message: "Received." });
    expect((await submitEnquiry(payload, respond(200, {}))).ok).toBe(false);
  });

  it("maps server validation errors to fields", async () => {
    const result = await submitEnquiry(payload, respond(400, { email: ["Enter a valid email address."] }));
    expect(result).toEqual({ ok: false, kind: "validation", fieldErrors: { email: "Enter a valid email address." } });
  });

  it("distinguishes rate limiting, server errors and network failures", async () => {
    expect(await submitEnquiry(payload, respond(429, {}))).toEqual({ ok: false, kind: "rate_limited" });
    expect(await submitEnquiry(payload, respond(500, {}))).toEqual({ ok: false, kind: "server" });
    const offline = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    });
    expect(await submitEnquiry(payload, offline)).toEqual({ ok: false, kind: "network" });
  });
});
