import { TeamMemberCard } from "@/components/Cards";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import { Section } from "@/components/Section";
import { EmptyState, ErrorState } from "@/components/States";
import { getTeam } from "@/lib/api/server";
import type { TeamMember } from "@/lib/api/types";
import { contactHref, pageMeta, routes } from "@/lib/site";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Our Team",
  description: "Meet the people building Haelsoft EdTech.",
  path: routes.team,
});

function Group({ id, title, members }: { id: string; title: string; members: TeamMember[] }) {
  if (!members.length) return null;
  return (
    <section aria-labelledby={id} className="mt-14 first:mt-0">
      <h2 id={id} className="heading text-[28px] sm:text-[34px]">{title}</h2>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m) => (
          <li key={m.slug} className="flex"><TeamMemberCard member={m} /></li>
        ))}
      </ul>
    </section>
  );
}

export default async function TeamPage() {
  const team = await getTeam();
  const members = team.ok ? team.data.results : [];
  return (
    <>
      <PageHero
        eyebrow="Our team"
        title={<>The people behind <span className="brand-text">Haelsoft EdTech.</span></>}
        lede={<p>A team focused on making practical, career-focused learning accessible to people across Africa.</p>}
        crumbs={[{ label: "About", href: routes.about }, { label: "Our Team", href: routes.team }]}
      />
      <Section>
        {!team.ok ? (
          <ErrorState title="Team profiles are unavailable right now" />
        ) : members.length ? (
          <>
            <Group id="leadership" title="Leadership" members={members.filter((m) => m.is_leadership)} />
            <Group id="team-members" title="Team" members={members.filter((m) => !m.is_leadership)} />
          </>
        ) : (
          <EmptyState title="Team profiles are on their way" action={{ label: "Contact the team", href: routes.contact }}>
            We&apos;re preparing profiles for the people behind Haelsoft EdTech. They will be published here once each person has
            approved their details.
          </EmptyState>
        )}
      </Section>
      <CtaBand
        eyebrow="Join us"
        title="Want to teach with Haelsoft?"
        body="We're looking to work with practitioners who enjoy helping others learn. Tell us about your expertise."
        primary={{ label: "Teach with Haelsoft", href: contactHref("instructor", "Teaching with Haelsoft") }}
        secondary={{ label: "Meet our instructors", href: routes.instructors }}
      />
    </>
  );
}
