import PageHero from "./PageHero";
import { Section } from "./Section";

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} />
      <Section>
        <div className="prose-forge">{children}</div>
      </Section>
    </>
  );
}
