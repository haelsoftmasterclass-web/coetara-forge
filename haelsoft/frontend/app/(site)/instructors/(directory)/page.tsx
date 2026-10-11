import Link from "next/link";
import { InstructorCard } from "@/components/Cards";
import CtaBand from "@/components/CtaBand";
import { Search } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import { Section } from "@/components/Section";
import { EmptyState, ErrorState } from "@/components/States";
import { getExpertiseAreas, getInstructors } from "@/lib/api/server";
import { contactHref, pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Our Instructors",
  description: "Meet Haelsoft EdTech instructors: practitioners in digital, technology and professional skills.",
  path: routes.instructors,
});

type SearchParams = Promise<{ search?: string; expertise?: string; page?: string }>;

function pageHref(params: { search?: string; expertise?: string; page?: number }) {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.expertise) q.set("expertise", params.expertise);
  if (params.page && params.page > 1) q.set("page", String(params.page));
  const s = q.toString();
  return s ? `${routes.instructors}?${s}` : routes.instructors;
}

export default async function InstructorsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const search = (params.search ?? "").slice(0, 100).trim();
  const expertise = (params.expertise ?? "").trim();
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const filtered = Boolean(search || expertise);

  const [result, areas] = await Promise.all([getInstructors({ search, expertise, page }), getExpertiseAreas()]);
  const expertiseAreas = areas.ok ? areas.data : [];
  const pageSize = 12;
  const totalPages = result.ok ? Math.max(1, Math.ceil(result.data.count / pageSize)) : 1;
  const showTools = filtered || (result.ok && result.data.count > 0);

  return (
    <>
      <PageHero
        eyebrow="Our instructors"
        title={<>Learn from <span className="brand-text">practitioners.</span></>}
        lede={<p>Our instructors use the skills they teach in their own work. Explore their profiles and areas of expertise.</p>}
        crumbs={[{ label: "Instructors", href: routes.instructors }]}
      />
      <Section>
        {showTools ? (
          <div className="mb-12 grid gap-6">
            <form role="search" action={routes.instructors} className="flex max-w-xl gap-3" aria-label="Search instructors">
              <label htmlFor="instructor-search" className="sr-only">Search by name or expertise</label>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="instructor-search"
                  name="search"
                  type="search"
                  defaultValue={search}
                  placeholder="Search by name or expertise"
                  className="input !pl-11"
                  maxLength={100}
                />
              </div>
              {expertise ? <input type="hidden" name="expertise" value={expertise} /> : null}
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
            {expertiseAreas.length > 1 ? (
              <nav aria-label="Filter by expertise">
                <ul className="flex flex-wrap gap-2">
                  <li>
                    <Link
                      href={pageHref({ search })}
                      aria-current={!expertise ? "true" : undefined}
                      className={`inline-flex rounded-full border px-4 py-2 text-[14px] font-medium ${!expertise ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
                    >
                      All
                    </Link>
                  </li>
                  {expertiseAreas.map((area) => (
                    <li key={area.slug}>
                      <Link
                        href={pageHref({ search, expertise: area.slug })}
                        aria-current={expertise === area.slug ? "true" : undefined}
                        className={`inline-flex rounded-full border px-4 py-2 text-[14px] font-medium ${expertise === area.slug ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
                      >
                        {area.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        ) : null}

        {!result.ok ? (
          <ErrorState title="Instructor profiles are unavailable right now">
            We couldn&apos;t reach our servers. Please refresh the page in a moment.
          </ErrorState>
        ) : result.data.results.length ? (
          <>
            <p className="mb-6 text-[15px] text-muted" aria-live="polite">
              {result.data.count} {result.data.count === 1 ? "instructor" : "instructors"}
              {filtered ? " match your search" : ""}
            </p>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.data.results.map((instructor) => (
                <li key={instructor.slug} className="flex"><InstructorCard instructor={instructor} headingLevel={2} /></li>
              ))}
            </ul>
            {totalPages > 1 ? (
              <nav aria-label="Pagination" className="mt-12 flex items-center justify-between gap-4">
                {page > 1 ? (
                  <Link href={pageHref({ search, expertise, page: page - 1 })} className="btn btn-secondary">Previous</Link>
                ) : <span />}
                <span className="text-[15px] text-muted">Page {page} of {totalPages}</span>
                {page < totalPages ? (
                  <Link href={pageHref({ search, expertise, page: page + 1 })} className="btn btn-secondary">Next</Link>
                ) : <span />}
              </nav>
            ) : null}
          </>
        ) : filtered ? (
          <EmptyState title="No instructors match your search" action={{ label: "Clear search", href: routes.instructors }}>
            Try a different name or area of expertise.
          </EmptyState>
        ) : page > 1 ? (
          <EmptyState title="This page is empty" action={{ label: "Back to the first page", href: routes.instructors }} />
        ) : (
          <EmptyState title="Instructor profiles are coming soon" action={{ label: "Interested in teaching?", href: contactHref("instructor", "Teaching with Haelsoft") }}>
            We&apos;re preparing profiles for our first instructors. Each profile is published once the instructor has approved it.
          </EmptyState>
        )}
      </Section>
      <CtaBand
        eyebrow="Teach with Haelsoft"
        title="Share what you know with learners across Africa."
        body="If you're a practitioner who enjoys teaching, we'd like to hear from you."
        primary={{ label: "Get in touch", href: contactHref("instructor", "Teaching with Haelsoft") }}
      />
    </>
  );
}
