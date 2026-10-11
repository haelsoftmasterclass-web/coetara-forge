import Link from "next/link";
import type { ImpactMetric as Metric, InstructorSummary, Partner, TeamMember, Testimonial } from "@/lib/api/types";
import { routes } from "@/lib/site";
import { Arrow } from "./Icons";
import MediaImage, { Initials } from "./MediaImage";
import { DemoBadge, stripDemo } from "./States";

export function InstructorCard({ instructor, headingLevel = 3 }: { instructor: InstructorSummary; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as "h2" | "h3";
  const name = stripDemo(instructor.name);
  return (
    <article className="card group relative flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-card)]">
      {instructor.photo ? (
        <MediaImage src={instructor.photo} alt={instructor.photo_alt} width={600} height={450} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <Initials name={name} className="aspect-[4/3] w-full text-[56px]" />
      )}
      <div className="flex flex-1 flex-col p-6">
        <DemoBadge name={instructor.name} />
        <Heading className="heading mt-2 text-[22px]">
          <Link href={routes.instructor(instructor.slug)} className="after:absolute after:inset-0 after:content-['']">
            {name}
          </Link>
        </Heading>
        <p className="mt-1 text-[15px] font-medium text-ember-deep">{instructor.headline}</p>
        <p className="mt-3 text-[15px] text-muted">{instructor.short_bio}</p>
        {instructor.expertise.length ? (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Areas of expertise">
            {instructor.expertise.slice(0, 4).map((area) => (
              <li key={area.slug} className="tag">{area.name}</li>
            ))}
          </ul>
        ) : null}
        <span className="mt-auto flex items-center gap-2 pt-6 text-[14px] font-semibold" aria-hidden="true">
          View profile <Arrow />
        </span>
      </div>
    </article>
  );
}

export function TeamMemberCard({ member }: { member: TeamMember }) {
  const name = stripDemo(member.name);
  return (
    <article className="card flex flex-col overflow-hidden">
      {member.photo ? (
        <MediaImage src={member.photo} alt={member.photo_alt} width={600} height={600} className="aspect-square w-full object-cover" />
      ) : (
        <Initials name={name} className="aspect-square w-full text-[56px]" />
      )}
      <div className="flex flex-1 flex-col p-6">
        <DemoBadge name={member.name} />
        <h3 className="heading mt-2 text-[21px]">{name}</h3>
        <p className="mt-1 text-[15px] font-medium text-ember-deep">{member.role}</p>
        {member.bio ? <p className="mt-3 text-[15px] text-muted">{member.bio}</p> : null}
        {member.linkedin_url || member.website_url ? (
          <ul className="mt-auto flex gap-4 pt-5 text-[14px] font-semibold">
            {member.linkedin_url ? (
              <li><a href={member.linkedin_url} rel="noopener noreferrer" className="underline underline-offset-4">LinkedIn<span className="sr-only"> profile of {name}</span></a></li>
            ) : null}
            {member.website_url ? (
              <li><a href={member.website_url} rel="noopener noreferrer" className="underline underline-offset-4">Website<span className="sr-only"> of {name}</span></a></li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export function PartnerCard({ partner }: { partner: Partner }) {
  const name = stripDemo(partner.name);
  return (
    <article className="card flex flex-col p-6">
      <div className="flex h-16 items-center">
        {partner.logo ? (
          <MediaImage src={partner.logo} alt={partner.logo_alt} width={200} height={64} className="h-12 w-auto max-w-[200px] object-contain" />
        ) : (
          <span className="heading text-[20px]">{name}</span>
        )}
      </div>
      <DemoBadge name={partner.name} />
      {partner.logo ? <h3 className="heading mt-4 text-[20px]">{name}</h3> : <h3 className="sr-only">{name}</h3>}
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{partner.category_label}</p>
      {partner.description ? <p className="mt-3 text-[15px] text-muted">{partner.description}</p> : null}
      {partner.website_url ? (
        <a href={partner.website_url} rel="noopener noreferrer" className="link-arrow mt-auto self-start pt-5">
          Visit website<span className="sr-only"> of {name}</span> <Arrow />
        </a>
      ) : null}
    </article>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const name = stripDemo(testimonial.learner_name);
  const meta = [testimonial.role, testimonial.location].filter(Boolean).join(" · ");
  return (
    <figure className="card flex h-full flex-col p-7">
      <DemoBadge name={testimonial.learner_name} />
      <svg aria-hidden="true" width="34" height="26" viewBox="0 0 34 26" className="mt-2 text-flame">
        <path d="M0 26V15C0 6 5 1 14 0v5c-5 1-7 4-7 9h7v12H0Zm20 0V15c0-9 5-14 14-15v5c-5 1-7 4-7 9h7v12H20Z" fill="currentColor" />
      </svg>
      <blockquote className="mt-5 flex-1 text-[18px] leading-relaxed text-ink-2">
        <p>{testimonial.quote}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        {testimonial.photo ? (
          <MediaImage src={testimonial.photo} alt={testimonial.photo_alt} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
        ) : null}
        <span>
          <span className="block font-semibold">{name}</span>
          {testimonial.programme ? <span className="block text-[14px] text-ember-deep">{testimonial.programme}</span> : null}
          {meta ? <span className="block text-[14px] text-muted">{meta}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** A verified, dated and sourced figure. The API only returns published, verified metrics. */
export function ImpactMetric({ metric }: { metric: Metric }) {
  return (
    <article className="card flex flex-col p-7">
      <p className="display text-[48px] text-ink">{metric.value}</p>
      <h3 className="mt-2 text-[17px] font-semibold">{metric.label}</h3>
      {metric.description ? <p className="mt-2 text-[15px] text-muted">{metric.description}</p> : null}
      <dl className="mt-auto grid gap-1 border-t border-line pt-4 text-[13px] text-muted">
        <div className="flex gap-2"><dt className="font-semibold text-ink-2">As of</dt><dd>{formatDate(metric.as_of)}</dd></div>
        <div className="flex gap-2"><dt className="font-semibold text-ink-2">Source</dt><dd>{metric.source}</dd></div>
      </dl>
    </article>
  );
}
