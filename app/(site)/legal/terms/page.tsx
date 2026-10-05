import LegalPage from "@/components/LegalPage";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({ title: "Terms of Use", description: "Terms of Use for the Coetara Forge website.", path: routes.terms, });

export default function Page() {
  return (
    <LegalPage title="Terms of Use">
      <p><strong>This page is being finalised.</strong> The full Terms of Use for Coetara Forge, a platform of Coetara Technologies Limited, will be published here before launch.</p>
      <p>If you have a question in the meantime, please <a href="/contact/">contact Forge</a>.</p>
    </LegalPage>
  );
}
