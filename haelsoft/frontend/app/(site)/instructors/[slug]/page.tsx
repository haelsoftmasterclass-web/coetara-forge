import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Check } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import MediaImage, { Initials } from "@/components/MediaImage";
import Paragraphs from "@/components/Paragraphs";
import { DemoBadge, stripDemo } from "@/components/States";
import { getInstructor } from "@/lib/api/server";
import { SITE_URL, contactHref, pageMeta, routes, site } from "@/lib/site";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

async function loadInstructor(slug: string) {
  const result = await getInstructor(slug);
  if (!result.ok) {
    if (result.kind === "not_found") notFound();
    // Network or server failure: let the error boundary explain, rather than claiming the profile doesn't exist.
    throw new Error(`Instructor API unavailable (${result.kind})`);
  }
  return result.data;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getInstructor(slug);
  if (!result.ok) return { title: "Instructor", robots: { index: false } };
  const name = stripDemo(result.data.name);
  return pageMeta({
    title: `${name}, ${result.data.headline}`,
    description: result.data.short_bio,
    path: routes.instructor(slug),
  });
}

export default async function InstructorProfilePage({ params }: { params: Params }) {
  const { slug } = await params;
  const instructor = await loadInstructor(slug);
  const name = stripDemo(instructor.name);
  const links = [
    instructor.linkedin_url ? { label: "LinkedIn", href: instructor.linkedin_url } : null,
    instructor.website_url ? { label: "Website", href: instructor.website_url } : null,
  ].filter((l): l is { label: string; href: string } => l !== null);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-paper">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(255,154,31,0.18),rgba(242,80,10,0.07),transparent)]" />
        <div className="wrap relative pb-16 pt-10 md:pb-20 md:pt-14">
          <Breadcrumbs items={[{ label: "Instructors", href: routes.instructors }, { label: name, href: routes.instructor(slug) }]} className="mb-10" />
          <div className="grid gap-10 md:grid-cols-[280px_1fr] md:items-end lg:gap-16">
            {instructor.photo ? (
              <MediaImage src={instructor.photo} alt={instructor.photo_alt} width={560} height={700} priority className="aspect-[4/5] w-full max-w-[280px] rounded-[var(--radius-card)] object-cover" />
            ) : (
              <Initials name={name} className="aspect-[4/5] w-full max-w-[280px] rounded-[var(--radius-card)] text-[72px]" />
            )}
            <div>
              <DemoBadge name={instructor.name} />
              <p className="eyebrow mt-4 text-muted">Instructor</p>
              <h1 className="display mt-5 text-[40px] sm:text-[56px]">{name}</h1>
              <p className="mt-4 text-[20px] font-medium text-ember-deep">{instructor.headline}</p>
              {instructor.expertise.length ? (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Areas of expertise">
                  {instructor.expertise.map((area) => (
                    <li key={area.slug}>
                      <a href={`${routes.instructors}?expertise=${encodeURIComponent(area.slug)}`} className="tag hover:border-ink hover:text-ink">{area.name}</a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="wrap grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <div>
            <h2 className="heading text-[28px]">About {name}</h2>
            <Paragraphs text={instructor.biography} className="mt-6" />

            {instructor.qualifications.length ? (
              <div className="mt-14">
                <h2 className="heading text-[28px]">Qualifications</h2>
                <ul className="mt-6 grid gap-3">
                  {instructor.qualifications.map((q) => (
                    <li key={q} className="flex gap-3 text-[17px]"><Check className="mt-1.5 shrink-0 text-success" />{q}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-14">
              <h2 className="heading text-[28px]">Courses</h2>
              {instructor.courses.length ? (
                <ul className="mt-6 grid gap-3">
                  {instructor.courses.map((c) => <li key={c.slug}>{c.title}</li>)}
                </ul>
              ) : (
                <p className="mt-4 text-[17px] text-muted">Courses will be listed here as they become available.</p>
              )}
            </div>
          </div>

          <aside className="grid content-start gap-6" aria-label={`Contact and links for ${name}`}>
            <div className="card bg-sand p-7">
              <h2 className="heading text-[22px]">Interested in learning with {name.split(" ")[0]}?</h2>
              <p className="mt-3 text-[15px] text-muted">Send us a message and we&apos;ll let you know when their courses are available.</p>
              <div className="mt-6 grid gap-3">
                <PrimaryButton href={contactHref("learning", `Learning with ${name}`)}>Register your interest</PrimaryButton>
                <SecondaryButton href={routes.instructors}>All instructors</SecondaryButton>
              </div>
            </div>
            {links.length ? (
              <div className="card p-7">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Elsewhere</h2>
                <ul className="mt-4 grid gap-2">
                  {links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} rel="noopener noreferrer" className="link-arrow">{l.label}<span className="sr-only"> of {name}</span></a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name,
          jobTitle: instructor.headline,
          description: instructor.short_bio,
          url: `${SITE_URL}${routes.instructor(slug)}`,
          ...(instructor.photo ? { image: instructor.photo } : {}),
          ...(links.length ? { sameAs: links.map((l) => l.href) } : {}),
          knowsAbout: instructor.expertise.map((a) => a.name),
          affiliation: { "@type": "EducationalOrganization", name: site.name, url: SITE_URL },
        }}
      />
    </>
  );
}
