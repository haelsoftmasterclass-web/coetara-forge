import { Choices, Select, TextArea, TextField } from "@/components/Field";
import { Arrow } from "@/components/Icons";
import { africanCountries } from "@/content/countries";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Apply for Cohort 01",
  description:
    "Apply for Cohort 01 of the Coetara Forge 10-Week Venture Incubator. Open to exceptional builders across Africa, with or without a company or idea.",
  path: routes.apply,
});

function Step({ name, n, title, intro, children }: { name: string; n: number; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <fieldset data-step={name} className="grid gap-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ember-deep">Step {String(n).padStart(2, "0")} · {name}</p>
        <h2 className="heading mt-3 text-[28px] outline-none sm:text-[34px]">{title}</h2>
        {intro ? <p className="mt-2 text-[16px] text-muted">{intro}</p> : null}
      </div>
      {children}
    </fieldset>
  );
}

export default function Apply() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="wrap grid gap-10 pb-14 pt-14 md:pt-20 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-muted">Apply · Cohort 01 · 10-Week Venture Incubator</p>
            <h1 className="display mt-6 text-[44px] sm:text-[64px] lg:text-[76px]">
              Your Next Chapter Could Be a <span className="flame-text">Company.</span>
            </h1>
          </div>
          <div className="grid gap-1.5 text-[18px] leading-relaxed text-ink-2">
            <p>You may already have an idea.</p>
            <p>You may have the skills but not the company.</p>
            <p>You may understand a problem deeply.</p>
            <p>You may simply know that something needs to be built.</p>
            <p className="heading mt-3 text-[24px] text-ink">Start there.</p>
            <a href="#application" className="btn btn-primary mt-6 w-fit" data-track="application_begin">Begin Your Application <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="bg-sand py-14 md:py-20" id="application">
        <div className="wrap grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start" data-progress>
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted" data-progress-label aria-live="polite" suppressHydrationWarning>11 steps</p>
            <p className="heading mt-2 text-[22px]" data-progress-name suppressHydrationWarning>Your application</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div className="h-full w-[9%] rounded-full bg-[linear-gradient(90deg,#feb101,#fd7200,#fe5301)] transition-[width] duration-500" data-progress-bar />
            </div>
            <ul className="mt-6 hidden gap-2 text-[14px] text-muted lg:grid">
              <li>About 15–20 minutes to complete.</li>
              <li>Your answers save in this browser as you type.</li>
              <li>There are no wrong answers. Be specific.</li>
            </ul>
            <div className="mt-6 rounded-xl border border-line bg-white p-4 text-[14px]" data-restored hidden>
              <p className="font-semibold">Welcome back.</p>
              <p className="mt-1 text-muted">We restored your saved answers.</p>
              <button type="button" className="mt-2 text-[13px] font-semibold text-ember-deep underline" data-restart>Start over</button>
            </div>
          </aside>

          <div className="rounded-[22px] border border-line bg-white p-6 sm:p-10">
            <form name="application" method="POST" action="/api/apply" data-api="/api/apply" data-netlify="true" netlify-honeypot="company_website" data-apply-form noValidate className="grid gap-10">
              <input type="hidden" name="form-name" value="application" />
              <p className="hidden"><label>Leave this empty <input name="company_website" tabIndex={-1} autoComplete="off" /></label></p>

              <Step name="About You" n={1} title="Tell us who you are.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField id="full_name" label="Full name" required autoComplete="name" />
                  <TextField id="email" label="Email" type="email" required autoComplete="email" />
                  <TextField id="phone" label="Phone" type="tel" required autoComplete="tel" hint="Include your country code, e.g. +234" />
                  <Select id="country" label="Country" required options={[...africanCountries, "Outside Africa"]} />
                  <TextField id="city" label="City" required autoComplete="address-level2" />
                  <TextField id="current_role" label="Current role" required placeholder="e.g. Backend engineer, researcher, student" />
                  <TextField id="organisation" label="Organisation" />
                  <Select id="experience" label="Years of experience" required options={["Less than 1", "1–2", "3–5", "6–10", "More than 10"]} />
                </div>
              </Step>

              <Step name="Your Capability" n={2} title="What do you build with?" intro="Pick the one that best describes your strongest capability.">
                <Choices id="expertise" label="Primary area of expertise" required options={["Technology", "Product", "Business", "Research", "Design", "Operations", "Industry Expertise", "Other"]} />
              </Step>

              <Step name="Your Motivation" n={3} title="Why do you want to build a company?">
                <TextArea id="motivation" label="Your answer" required rows={6} hint="A few honest paragraphs are better than a polished statement." />
              </Step>

              <Step name="The Problem" n={4} title="What problem in Africa deserves solving?">
                <TextArea id="problem" label="Your answer" required rows={6} hint="Who has the problem, how do they deal with it today, and why does it matter?" />
              </Step>

              <Step name="Your Idea" n={5} title="Do you already have a business idea?" intro="You do not need one to apply.">
                <Choices id="has_idea" label="Choose one" required options={["Yes", "No", "Exploring"]} cols={3} />
                <TextArea id="idea" label="If yes or exploring, describe it briefly" rows={4} />
              </Step>

              <Step name="Team" n={6} title="Building a founding team.">
                <TextArea id="skills_bring" label="What skills would you bring to a founding team?" required rows={4} />
                <TextArea id="skills_seek" label="What skills are you looking for in co-founders?" required rows={4} />
              </Step>

              <Step name="Why Forge" n={7} title="Why Coetara Forge?">
                <TextArea id="why_forge" label="Your answer" required rows={5} />
              </Step>

              <Step name="Your 10-Week Ambition" n={8} title="What do you hope to build in 10 weeks?">
                <TextArea id="ambition" label="Your answer" required rows={5} hint="Think in evidence: customers spoken to, a working prototype, a pilot, a first payment." />
              </Step>

              <Step name="Commitment" n={9} title="Can you commit to the programme?">
                <div className="rounded-xl border border-flame/30 bg-[#fff6ee] p-4 text-[14.5px] text-ink-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ember-deep">Subject to final programme confirmation</p>
                  <p className="mt-2">The intended rhythm is a weekly masterclass, build sprints from Tuesday to Thursday, office hours and a Friday Forge Review over 10 weeks. Format, dates and exact hours will be confirmed before the cohort starts.</p>
                </div>
                <Choices id="commitment" label="Will you be able to meet this commitment?" required options={["Yes", "Probably, depending on final dates", "Not sure yet"]} cols={3} />
              </Step>

              <Step name="Links" n={10} title="Where can we see your work?" intro="All optional. Share whatever shows how you build.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField id="linkedin" label="LinkedIn" type="url" placeholder="https://linkedin.com/in/…" />
                  <TextField id="portfolio" label="Portfolio" type="url" placeholder="https://" />
                  <TextField id="github" label="GitHub" type="url" placeholder="https://github.com/…" />
                  <TextField id="website" label="Website" type="url" placeholder="https://" />
                </div>
              </Step>

              <Step name="Final Message" n={11} title="Anything else we should know?">
                <TextArea id="final_message" label="Tell us anything else we should know" rows={5} />
                <label className="flex items-start gap-3 text-[14.5px] text-ink-2" htmlFor="consent">
                  <input id="consent" name="consent" type="checkbox" value="yes" required className="mt-1 h-[18px] w-[18px] accent-[#fe5301]" data-error="Please confirm to submit your application." />
                  <span>
                    I agree that Coetara Forge may store and use the information in this application to assess it and contact me about Forge programmes. See the <a href={routes.privacy} className="underline">privacy policy</a>.
                  </span>
                </label>
                <p className="error-msg" hidden />
              </Step>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
                <button type="button" className="btn btn-ghost" data-back hidden>← Back</button>
                <div className="ml-auto flex gap-3">
                  <button type="button" className="btn btn-primary" data-next>Continue <Arrow /></button>
                  <button type="submit" className="btn btn-flame" data-submit hidden>Submit Application</button>
                </div>
              </div>
            </form>

            <div data-form-done hidden tabIndex={-1} className="py-10 text-center outline-none">
              <svg width="56" height="48" viewBox="0 0 14 12" className="mx-auto" aria-hidden="true">
                <path d="M5 0h9L9 5H0z" fill="#feb101" />
                <path d="M5 7h7l-5 5H0z" fill="#fe5301" />
              </svg>
              <h2 className="display mt-8 text-[36px] sm:text-[48px]">Application received.</h2>
              <p className="lede mx-auto mt-4">Thank you for applying to Cohort 01. We review every application. Shortlisted applicants will be contacted by email about the next stage of assessment.</p>
              <a href={routes.incubator} className="btn btn-ghost mt-8">Explore the 10-Week Incubator <Arrow /></a>
            </div>
            <p data-form-fail hidden className="mt-6 rounded-xl border border-ember/30 bg-[#fff1ee] p-4 text-[15px] text-ember-deep" role="alert">
              <span data-form-fail-detail className="block font-semibold" /> Your application could not be sent. Your answers are still saved in this browser. Check your connection and press Submit again, or <a href={routes.contact} className="underline">contact us</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
