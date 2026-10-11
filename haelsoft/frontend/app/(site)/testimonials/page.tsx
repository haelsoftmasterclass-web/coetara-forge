import { TestimonialCard } from "@/components/Cards";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import { Section } from "@/components/Section";
import { EmptyState, ErrorState } from "@/components/States";
import { getTestimonials } from "@/lib/api/server";
import { contactHref, pageMeta, routes } from "@/lib/site";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Testimonials",
  description: "Learner stories from Haelsoft EdTech, shared with each learner's permission.",
  path: routes.testimonials,
});

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title={<>Learner stories, <span className="brand-text">shared with permission.</span></>}
        lede={<p>Every testimonial on this page is a learner&apos;s own words, published with their consent.</p>}
        crumbs={[{ label: "Testimonials", href: routes.testimonials }]}
      />
      <Section>
        {!testimonials.ok ? (
          <ErrorState title="Testimonials are unavailable right now" />
        ) : testimonials.data.results.length ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.data.results.map((t) => (
              <li key={t.id}><TestimonialCard testimonial={t} /></li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Learner stories will be shared here with permission"
            action={{ label: "Share your experience", href: contactHref("general", "My learner story") }}
          >
            We only publish testimonials that learners have agreed to share, in their own words. As learners complete their
            courses, their stories will appear here.
          </EmptyState>
        )}
      </Section>
      <CtaBand
        eyebrow="Learned with Haelsoft Masterclass?"
        title="We'd love to hear your story."
        body="If you learned with us and are happy to share your experience, get in touch. We'll ask for your consent before publishing anything."
        primary={{ label: "Share your story", href: contactHref("general", "My learner story") }}
        secondary={{ label: "Meet our instructors", href: routes.instructors }}
      />
    </>
  );
}
