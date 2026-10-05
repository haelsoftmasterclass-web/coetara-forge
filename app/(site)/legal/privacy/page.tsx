import LegalPage from "@/components/LegalPage";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({ title: "Privacy Policy", description: "Privacy Policy for the Coetara Forge website.", path: routes.privacy, });

export default function Page() {
  return (
    <LegalPage title="Privacy Policy">
      <p><strong>This page is being finalised.</strong> The full Privacy Policy for Coetara Forge, a platform of Coetara Technologies Limited, will be published here before launch.</p>
      <p>If you have a question in the meantime, please <a href="/contact/">contact Forge</a>.</p>
    </LegalPage>
  );
}
