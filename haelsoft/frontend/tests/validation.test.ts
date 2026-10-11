import { validateEnquiry } from "@/lib/validation";
import type { EnquiryPayload } from "@/lib/api/types";

const valid: EnquiryPayload = {
  enquiry_type: "learning",
  name: "Ada Obi",
  email: "ada@example.com",
  phone: "",
  country: "Nigeria",
  subject: "Course updates",
  message: "Please let me know when the data courses open.",
  consent: true,
  source_page: "/contact",
  company_website: "",
};

describe("validateEnquiry", () => {
  it("accepts a complete enquiry with an empty optional phone", () => {
    expect(validateEnquiry(valid)).toEqual({});
  });

  it("flags every missing required field", () => {
    const errors = validateEnquiry({ ...valid, name: "", email: "", country: "", subject: "", message: "", consent: false });
    expect(Object.keys(errors).sort()).toEqual(["consent", "country", "email", "message", "name", "subject"]);
  });

  it("rejects malformed email and phone values", () => {
    const errors = validateEnquiry({ ...valid, email: "ada@", phone: "call me" });
    expect(errors.email).toMatch(/valid email/);
    expect(errors.phone).toMatch(/country code/);
  });

  it("requires a message of at least 20 characters", () => {
    expect(validateEnquiry({ ...valid, message: "Too short" }).message).toBeDefined();
  });
});
