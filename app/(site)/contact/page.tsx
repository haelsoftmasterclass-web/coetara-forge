import PageHero from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Select, TextArea, TextField } from "@/components/Field";
import { Arrow } from "@/components/Icons";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact Forge",
  description: "Talk to Coetara Forge about the 10-Week Venture Incubator, university and corporate partnerships, technology commercialisation or investment.",
  path: routes.contact,
});

const pathways = [
  { who: "I'm a Builder", what: "Interested in the 10-Week Venture Incubator.", cta: "Apply for Cohort 01", href: routes.apply, track: "apply_cta" },
  { who: "I'm a University or Research Institution", what: "Interested in technology commercialisation and venture creation.", cta: "Explore University Partnerships", href: `${routes.partners}#universities`, track: "partner_cta" },
  { who: "I'm a Corporate", what: "Interested in innovation and strategic venture-building partnerships.", cta: "Partner With Forge", href: "#enquiry", track: "partner_cta" },
  { who: "I'm an Investor", what: "Interested in Forge ventures and investment opportunities.", cta: "Discuss Investment & Partnerships", href: "#enquiry", track: "partner_cta" },
];

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let&apos;s Build What <span className="flame-text">Comes Next.</span></>}
        lede="Whether you are a builder, university, research institution, corporate innovation team, investor or ecosystem partner, we would like to understand what you are building and where there may be a fit."
      />
      <Section>
        <ul className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {pathways.map((p, i) => (
            <li key={p.who} className="flex flex-col bg-white p-7" data-reveal>
              <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="heading mt-6 text-[22px]">{p.who}</h2>
              <p className="mt-2 text-[15px] text-muted">{p.what}</p>
              <a href={p.href} className="link-arrow mt-auto self-start pt-6" data-track={p.track}>{p.cta} <Arrow /></a>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="sand" id="enquiry">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="eyebrow text-muted">Send an enquiry</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[44px]">Tell us what you are working on.</h2>
            <p className="lede mt-5">We read every enquiry and route it to the right person in the Forge team.</p>
          </div>
          <div className="rounded-[22px] border border-line bg-white p-6 sm:p-10">
            <form name="contact" method="POST" action="/api/contact" data-api="/api/contact" data-netlify="true" netlify-honeypot="company_website" data-contact-form noValidate className="grid gap-5">
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden"><label>Leave this empty <input name="company_website" tabIndex={-1} autoComplete="off" /></label></p>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField id="contact-name" name="name" label="Name" required autoComplete="name" />
                <TextField id="contact-org" name="organisation" label="Organisation" autoComplete="organization" />
                <TextField id="contact-email" name="email" label="Email" type="email" required autoComplete="email" />
                <TextField id="contact-phone" name="phone" label="Phone" type="tel" autoComplete="tel" />
              </div>
              <Select id="contact-role" name="role" label="I am a" required options={["Founder / Builder", "University / Research Institution", "Corporate", "Investor", "Mentor / Operator", "Other"]} />
              <TextField id="contact-topic" name="topic" label="What would you like to discuss?" required />
              <TextArea id="contact-message" name="message" label="Message" required rows={6} />
              <p className="text-[13px] text-muted">By sending this form you agree that Coetara Forge may use these details to respond to your enquiry. See the <a href={routes.privacy} className="underline">privacy policy</a>.</p>
              <div>
                <button type="submit" className="btn btn-primary">Send Enquiry</button>
              </div>
            </form>
            <div data-form-done hidden tabIndex={-1} className="py-8 outline-none">
              <h3 className="display text-[34px]">Thank you.</h3>
              <p className="lede mt-3">Your enquiry has been sent. A member of the Forge team will reply by email.</p>
            </div>
            <p data-form-fail hidden className="mt-6 rounded-xl border border-ember/30 bg-[#fff1ee] p-4 text-[15px] text-ember-deep" role="alert">
              <span data-form-fail-detail className="block font-semibold" /> Your enquiry could not be sent. Check your connection and try again.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
